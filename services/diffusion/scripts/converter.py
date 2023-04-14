"""Converts safetensor lora to diffusers."""
import os

from absl import app
from absl import flags
from absl import logging
import safetensors.torch
from diffusers import StableDiffusionPipeline
from diffusers import DPMSolverMultistepScheduler
import torch


FLAGS = flags.FLAGS

flags.DEFINE_string('diffuser', None, 'Name of diffuser.')
flags.DEFINE_string('lora', None, 'Path to the safetensor lora model.')
flags.DEFINE_string('output_dir', None,
                    'Output directory of lora fused diffuser.')
flags.DEFINE_float('alpha', None, 'Alpha value - weight of lora in diffuser.')

LORA_PREFIX_UNET = 'lora_unet'
LORA_PREFIX_TEXT_ENCODER = 'lora_te'


def load_lora_weights(pipeline, state_dict, alpha=0.75):
    """Load lora weights to pipeline."""
    visited = []

    for key in state_dict:

        # it is suggested to print out the key, it usually will be something like below
        # "lora_te_text_model_encoder_layers_0_self_attn_k_proj.lora_down.weight"

        # as we have set the alpha beforehand, so just skip
        if '.alpha' in key or key in visited:
            continue

        if 'text' in key:
            layer_infos = key.split('.')[0].split(LORA_PREFIX_TEXT_ENCODER+'_')[-1].split('_')
            curr_layer = pipeline.text_encoder
        else:
            layer_infos = key.split('.')[0].split(LORA_PREFIX_UNET+'_')[-1].split('_')
            curr_layer = pipeline.unet

        # find the target layer
        temp_name = layer_infos.pop(0)
        while len(layer_infos) > -1:
            try:
                curr_layer = curr_layer.__getattr__(temp_name)
                if len(layer_infos) > 0:
                    temp_name = layer_infos.pop(0)
                elif len(layer_infos) == 0:
                    break
            except Exception:
                if len(temp_name) > 0:
                    temp_name += '_'+layer_infos.pop(0)
                else:
                    temp_name = layer_infos.pop(0)

        # org_forward(x) + lora_up(lora_down(x)) * multiplier
        pair_keys = []
        if 'lora_down' in key:
            pair_keys.append(key.replace('lora_down', 'lora_up'))
            pair_keys.append(key)
        else:
            pair_keys.append(key)
            pair_keys.append(key.replace('lora_up', 'lora_down'))

        # update weight
        if len(state_dict[pair_keys[0]].shape) == 4:
            weight_up = state_dict[pair_keys[0]].squeeze(3).squeeze(2).to(torch.float32)
            weight_down = state_dict[pair_keys[1]].squeeze(3).squeeze(2).to(torch.float32)
            curr_layer.weight.data += alpha * torch.mm(weight_up, weight_down).unsqueeze(2).unsqueeze(3)
        else:
            weight_up = state_dict[pair_keys[0]].to(torch.float32)
            weight_down = state_dict[pair_keys[1]].to(torch.float32)
            curr_layer.weight.data += alpha * torch.mm(weight_up, weight_down)

        # update visited list
        for item in pair_keys:
            visited.append(item)


def main(_):
    pipeline = StableDiffusionPipeline.from_pretrained(
            FLAGS.diffuser, torch_dtype=torch.float32)
    pipeline.scheduler = DPMSolverMultistepScheduler.from_config(pipeline.scheduler.config)
    logging.info('Loaded diffuser pipeline from %s', FLAGS.diffuser)
    lora_state_dict = safetensors.torch.load_file(FLAGS.lora)
    load_lora_weights(pipeline, lora_state_dict)
    logging.info('Loaded lora weights from %s', FLAGS.lora)

    os.makedirs(FLAGS.output_dir, exist_ok=True)

    pipeline.save_pretrained(FLAGS.output_dir)
    logging.info('Saved to %s', FLAGS.output_dir)


if __name__ == '__main__':
    app.run(main)

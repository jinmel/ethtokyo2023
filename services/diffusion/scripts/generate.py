"""image generator."""

from absl import app
from absl import flags
from absl import logging

from diffusers import StableDiffusionPipeline
import torch


FLAGS = flags.FLAGS

flags.DEFINE_string('model', None, 'Path to model')


def main(_):
    pipeline = StableDiffusionPipeline.from_pretrained(FLAGS.model)
    pipeline.safety_checker = lambda images, clip_input: (images, False)
    prompt = '1boy, wanostyle, monkey d luffy, smiling, straw hat, looking at viewer, solo, upper body, ((masterpiece)), (best quality), (extremely detailed), depth of field, sketch, dark intense shadows, sharp focus, soft lighting, hdr, colorful, good composition, fire all around, spectacular, <lora:wanostyle_2_offset:1>, closed shirt, anime screencap, scar under eye, ready to fight, black eyes'
    negative_prompt = '(painting by bad-artist-anime:0.9), (painting by bad-artist:0.9), watermark, text, error, blurry, jpeg artifacts, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, artist name, (worst quality, low quality:1.4), bad anatomy, watermark, signature, text, logo'

    with torch.no_grad():
        image = pipeline(prompt=prompt,
                        height=1280,
                        width=720,
                        num_inference_steps=50,
                        guidance_scale=8).images[0]

    image.save('image.png')

if __name__ == '__main__':
    app.run(main)

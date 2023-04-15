import { ContentFocus, ProfileOwnedByMe, useCreatePost } from '@lens-protocol/react-web';

import { upload } from '../../../utils/upload';
import { never } from '../../../utils/utils';

export type PostComposerProps = {
  publisher: ProfileOwnedByMe;
};

export function PostForm({ publisher }: PostComposerProps) {
  const { execute: create, error, isPending } = useCreatePost({ publisher, upload });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);
    const content = (formData.get('name') as string | null) ?? never();
    const image = (formData.get('image') as string | null) ?? never();
    const endpoint = (formData.get('endpoint') as string | null) ?? never();
    await create({
      content: content,
      contentFocus: ContentFocus.TEXT,
      locale: 'en',
    });

    form.reset();
  };

  return (
    <form onSubmit={submit}>
      <fieldset>
        <h2> name </h2>
        <input type="text" name="name"/>
        <h2> image </h2>
        <input type="text" name="image"/>
        <h2> endpoint </h2>
        <input type="text" name="endpoint" value="https://api.runpod.ai/v1/stable-diffusion-v1/run"/>
        <button type="submit" disabled={isPending}>
          Post
        </button>
        {error && <pre>{error.message}</pre>}
      </fieldset>
    </form>
  );
}

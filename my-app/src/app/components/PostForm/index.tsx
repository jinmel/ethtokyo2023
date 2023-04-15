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
    const content = (formData.get('content') as string | null) ?? never();

    await create({
      content,
      contentFocus: ContentFocus.TEXT,
      locale: 'en',
    });

    form.reset();
  };

  return (
    <form onSubmit={submit}>
      <fieldset>
        <input type="text" name="name"/>
        <input type="text" name="image"/>
        <input type="text" name="endpoint"/>
        <button type="submit" disabled={isPending}>
          Post
        </button>
        {error && <pre>{error.message}</pre>}
      </fieldset>
    </form>
  );
}

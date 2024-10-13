import { Elysia, t } from 'elysia';
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from './handlers';

const postsRoutes = new Elysia({ prefix: '/posts' })
  .get('/', () => getPosts())
  .get('/:id', ({ params }) => getPost(params.id), {
    params: t.Object({ id: t.String() }),
  })
  .post(
    '/',
    ({ body }: { body: { title: string; content: string } }) =>
      createPost(body),
    {
      body: t.Object({
        title: t.String({
          minLength: 3,
          maxLength: 255,
        }),
        content: t.String({
          minLength: 3,
          maxLength: 255,
        }),
      }),
    }
  )
  .patch(
    '/:id',
    ({ params, body }: { params: { id: string }; body: { title: string } }) =>
      updatePost(params.id, body),
    {
      params: t.Object({ id: t.String() }),
      body: t.Object(
        {
          title: t.Optional(
            t.String({
              minLength: 3,
              maxLength: 255,
            })
          ),
          content: t.Optional(
            t.String({
              minLength: 3,
              maxLength: 255,
            })
          ),
        },
        { minProperties: 1 }
      ),
    }
  )
  .delete('/:id', ({ params }) => deletePost(params.id), {
    params: t.Object({ id: t.String() }),
  });

export default postsRoutes;

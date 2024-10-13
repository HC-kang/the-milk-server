import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import postsRoutes from './routes/posts';
import scrapersRoutes from './routes/scrapers';

const app = new Elysia()
  .use(
    swagger({
      path: '/docs',
    })
  )
  .group('/api', (app) => app.use(postsRoutes).use(scrapersRoutes))
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

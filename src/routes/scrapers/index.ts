import { Elysia, t } from 'elysia';
import { scrapeIfans } from './handlers';

const scrapersRoutes = new Elysia({ prefix: '/scrapers' }).get('/', async () =>
{
  return await scrapeIfans();
}
);

export default scrapersRoutes;

import { Elysia } from 'elysia';
import { todoRoute } from './todo';
import { usersRoute } from '~/routes/api/auth/server';

export const app =
  new Elysia({ prefix: '/api' })
    .use(todoRoute)
    .use(usersRoute)
    .compile();

export type App = typeof app;

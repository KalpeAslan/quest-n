import express, { Application } from 'express';
import cors from 'cors';
import 'express-async-errors';

import { router } from './routes/index';

export const server: Application = express();

server.use(
  cors({
    credentials: true,
    origin: '*.alphaguilty.io',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: true,
    optionsSuccessStatus: 204,
  }),
);
server.use(router);

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { AppModule } from './app.module';
const mysqlStore = require('express-mysql-session')(session);

require('dotenv').config();
const options = {
  host:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_HOST
      : process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_USERNAME
      : process.env.DB_USERNAME,
  password:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_PASSWORD
      : process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_HOSTINGER_DATABASE
      : process.env.DB_DATABASE,
  connectionLimit: 10,
  createDatabaseTable: true, // Whether or not to create the sessions database table, if one does not already exist.
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data',
    },
  },
};
/*
 * Currently not used, but might be useful in the future.
 * Problems in Production with DB Connection
 */
const sessionStore = new mysqlStore(options);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 30,
      message: {
        status: 'Du hast zu viele Anfragen, bitte warte einen Moment.',
      },
      standardHeaders: true,
      skipFailedRequests: true,
      legacyHeaders: true,
    }),
  ); // allows 5 requests per minute
  app.use(
    session({
      secret: process.env.REVAX_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: 'revaxSessionId',
      cookie: {
        signed: true,
        httpOnly: true,
        encode: (val) => val,
        secure: process.env.NODE_ENV === 'production' ? true : false,
      },
      //store: sessionStore,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors();
  app.use(compression());
  //app.use(csurf({ cookie: { sameSite: true } }));
  //app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
  Logger.log(`Application listening at ${await app.getUrl()}`);
}
bootstrap();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as passport from 'passport';
import { AppModule } from './app.module';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: 'remoteSessionId',
      cookie: {
        signed: true,
        httpOnly: true,
        encode: (val) => val,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors();
  app.use(compression());
  //app.use(csurf());
  await app.listen(3000);
  Logger.log(`Application listening at ${await app.getUrl()}`);
}
bootstrap();

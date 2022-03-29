import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  /*app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 30,
      message: 'You tried to many requests. Please try again in 1 minute.',
      standardHeaders: true,
      skipFailedRequests: true,
      legacyHeaders: true,
    }),
  ); // allows 5 requests per minute*/
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: 'revaxSessionId',
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
  //app.use(csurf({ cookie: { sameSite: true } }));
  //app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
  Logger.log(`Application listening at ${await app.getUrl()}`);
}
bootstrap();

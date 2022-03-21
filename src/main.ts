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
  //überarbeiten!!!!
  //app.use('/register', bodyParser.json({ limit: '50mb' }));
  //app.use(bodyParser.json({ limit: '20mb' }));
  //app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
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
  await app.listen(process.env.PORT || 3000);
  Logger.log(`Application listening at ${await app.getUrl()}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,  
    saveUninitialized:false,
    cookie:{
      maxAge: configService.get('session').maxAge, //ms
      httpOnly: true,
      secure: false
    }
  }))
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: 'GET,HEAD,PATCH,POST,DELETE'
  })
  await app.listen(3000);
}
bootstrap();

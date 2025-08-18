import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import {
  I18nModule,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
  I18nJsonLoader,
} from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: join(__dirname, 'i18n'),
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(),
        new CookieResolver(['lang']),
      ],
    }),
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EmailService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailController } from './email.controller';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import sesTransport from 'nodemailer-ses-transport';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const transportName = cfg
          .get<string>('MAIL_TRANSPORT', 'SMTP')
          .toUpperCase();

        const transport =
          transportName === 'SES'
            ? sesTransport({
                SES: new AWS.SES({
                  region: cfg.get<string>('AWS_REGION', 'eu-central-1'),
                  accessKeyId: cfg.get<string>('AWS_ACCESS_KEY_ID') ?? '',
                  secretAccessKey: cfg.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
                }),
              })
            : {
                host: cfg.get<string>('SMTP_HOST'),
                port: cfg.get<number>('SMTP_PORT', 587),
                secure: cfg.get<number>('SMTP_PORT', 587) === 465, // 465=true, 587=false (STARTTLS)
                auth: {
                  user: cfg.get<string>('SMTP_USER'),
                  pass: cfg.get<string>('SMTP_PASS'),
                },
                // tls: { rejectUnauthorized: false }, 
              };

        return {
          transport,
          defaults: {
            from: cfg.get('MAIL_FROM')
              ? `"${cfg.get('MAIL_FROM_NAME', 'FixRoute')}" <${cfg.get('MAIL_FROM')}>`
              : undefined,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}

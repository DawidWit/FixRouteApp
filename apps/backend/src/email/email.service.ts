import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    private readonly mailer: MailerService,
    private readonly i18n: I18nService,
  ) {}

  async sendValidationCode(to: string, code: string) {
    // Read locale from current request; default to 'en' when absent (CRON/queues/etc.)
    const lang = I18nContext.current()?.lang ?? 'en';

    const subject = this.i18n.t('email.validation.subject', {
      lang,
      args: { app: 'FixRoute' },
    });

    const ctx = {
      code,
      lang,
      appName: this.i18n.t('email.common.appName', {
        lang,
        args: { app: 'FixRoute' },
      }),
      title: this.i18n.t('email.validation.title', { lang }),
      greeting: this.i18n.t('email.validation.greeting', { lang }),
      intro: this.i18n.t('email.validation.intro', { lang }),
      codeLabel: this.i18n.t('email.validation.codeLabel', { lang }),
      expiresIn: this.i18n.t('email.validation.expiresIn', {
        lang,
        args: { minutes: 10 },
      }),
      dir: ['ar', 'he', 'fa', 'ur'].includes(lang) ? 'rtl' : 'ltr',
      footer: this.i18n.t('email.common.footer', { lang }),
    };

    try {
      const info = await this.mailer.sendMail({
        to,
        subject,
        template: 'validation', 
        context: ctx,
      });
      this.logger.log(
        `Verification email sent to ${to} (id: ${info?.messageId ?? 'n/a'})`,
      );
      return info;
    } catch (e) {
      this.logger.error(
        `Failed to send verification to ${to}`,
      );
      throw e;
    }
  }

  async sendPlain(to: string, subject: string, text: string, html?: string) {
    try {
      return await this.mailer.sendMail({ to, subject, text, html });
    } catch (e) {
      this.logger.error(`Failed to send plain mail to ${to}`);
      throw e;
    }
  }
}

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendFaildCv() {
    await this.mailerService.sendMail({
      to: 'thanh.le@stunited.vn',
      subject: '[DevPlus] Thank You Letter',
      template: './test.hbs',
      context: {
        name: 'Thanh',
      },
    });
  }
}

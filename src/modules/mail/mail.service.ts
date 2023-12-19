import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendFaildCv() {
    await this.mailerService.sendMail({
      to: 'thangtnsa000@gmail.com',
      subject: '[DevPlus] Thank You Letter',
      template: './assignMail.hbs',
      context: {
        name: 'Thang',
      },
    });
  }
}

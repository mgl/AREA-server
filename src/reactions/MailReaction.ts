import * as nodemailer from 'nodemailer';

export class MailReaction {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_TRANSPORT_SERVICE,
      auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASSWORD,
      },
    });
  }

  async send_mail(object: string, content: string, receiver: string) {
    if (content != '') {
      const info = await this.transporter.sendMail({
        from: '"SmartHears" <smarthears@gmail.com>',
        to: receiver,
        subject: object,
        text: content,
      });
      console.log('Message sent: %s', info.messageId);
    } else {
      const info = await this.transporter.sendMail({
        from: '"SmartHears" <smarthears@gmail.com>',
        to: receiver,
        subject: object,
        html: '<h2>Précomandez SmartHears dès maintenant!<h2> <img src="cid:SmartHears"/>',
        attachments: [
          {
            filename: 'SmartHears.png',
            path: './SmartHears.png',
            cid: 'SmartHears',
          },
        ],
      });
      console.log('Message pub sent: %s', info.messageId);
    }
  }
}

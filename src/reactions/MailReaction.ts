import * as nodemailer from 'nodemailer';

export class MailReaction {
  private transporter: nodemailer.Transporter;

  async send_mail(
    object: string,
    content: string,
    receiver: string,
    sender: string,
    password: string,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender,
        pass: password,
      },
    });
    if (content != '') {
      const info = await this.transporter.sendMail({
        from: sender,
        to: receiver,
        subject: object,
        text: content,
      });
      console.log('Message sent: %s', info.messageId);
    } else {
      const info = await this.transporter.sendMail({
        from: sender,
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

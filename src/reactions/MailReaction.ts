const nodemailer = require("nodemailer");

export class MailReaction {

    async send_mail (object : string, content : string, receiver : string) {
        let testAccount = await nodemailer.createTestAccount();
      
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: "smarthears@gmail.com",
            pass: "albangrincheux",
          },
        });

        if (content != '') {
            let info = await transporter.sendMail({
              from: '"SmartHears" <smarthears@gmail.com>',
              to: receiver,
              subject: object,
              text: content,
            });
            console.log("Message sent: %s", info.messageId);
          } else {
            let info = await transporter.sendMail({
              from: '"SmartHears" <smarthears@gmail.com>',
              to: receiver,
              subject: object,
              html: '<h2>Précomandez SmartHears dès maintenant!<\h2> <img src="cid:SmartHears"/>',
              attachments: [{
                  filename: 'SmartHears.png',
                  path: './SmartHears.png',
                  cid: 'SmartHears' //same cid value as in the html img src
              }]
            });
            console.log("Message pub sent: %s", info.messageId);
          }
    }
}
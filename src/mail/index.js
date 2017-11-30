import nodemailer from 'nodemailer';

const mail = (email, message, name) => {
  console.log(name);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'borodaev97@gmail.com',
      pass: 'v1v2v3b6',
    },
  });

  const mailOptions = {
    from: email,
    to: 'borodaev_46@mail.ru',
    subject: 'Support:)',
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

export default mail;

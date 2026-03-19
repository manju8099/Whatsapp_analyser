const nodemailer = require("nodemailer");

async function sendMail(summary){

let transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
   user: 'yourmail@gmail.com',
   pass: 'your_app_password'
 }
});

await transporter.sendMail({
 from: 'yourmail@gmail.com',
 to: 'yourmail@gmail.com',
 subject: 'POS Support Daily Summary',
 text: summary
});

console.log("Email Sent");

}

module.exports = sendMail;
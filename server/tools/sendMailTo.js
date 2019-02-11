const uuidv1 = require('uuid/v1');           // Version 1(timestamp)
const nodemailer = require('nodemailer');

const db = require('../db/db').connection_db;

let port_front = process.env.NODE_ENV == 'dev' ? 3001 : 5000;

const sendMailTo = (username, email, action) => {
    username = encodeURIComponent(username)
    let verifyAccount = uuidv1()
    let subject = (action === 3) ? 'Hypertube reseting password' : 'Hypertube verifying account'
    let url = (action === 3) ? 'http://localhost:' + port_front + '/resetpassword/' + username + '/' + verifyAccount : 'http://localhost:' + port_front + '/emailvalidation/' + username + '/' + verifyAccount
    let text = (action === 3) ? '<p>Click or copy/paste <a href="'+ url +'">'+ url +'</a> to reset your password</p>' : '<p>Click or copy/paste <a href="'+ url +'">'+ url +'</a> to confirm your account</p>'

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.SMTP_MAIL_AUTH,
          pass: process.env.SMTP_MAIL_PASS
        }
      });

    return new Promise((resolve, reject) => {
        return db.query("UPDATE users SET ? WHERE username=?", [{token: verifyAccount}, username], (success, err) => {
            transporter.sendMail({
                from: 'Hypertube noreply@hypertube.com',
                to: email,
                subject: subject,
                html: text
            }, (err, info) => {
                if (err) { reject({sendMail: err}) }
                if (action === 1) { resolve("User " + username + " has been created, check your email and confirm your account") }
                if (action === 2) { resolve("Email confirmation re-sent") }
                if (action === 3) { resolve("The resetting\'s password link has been sent by email") }
            });
        });
    });
}

module.exports = {
    sendMailTo
}
const nodemailer = require('nodemailer');

const sendNode = (mailOptions, transporter) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) reject(err)
            else {
                resolve(info)
            }
        })
    })
}

const createTronsporter = (subject, email, htm) => {
    return new Promise(async (resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hamzaiantrin1999@gmail.com',
                pass: 'ubbgvldzezlvljeo'
            }
        });
        const mailOptions = {
            from: 'hamzaiantrin1999@gmail.com',
            to: email,
            subject: subject,
            text: 'Easy Work',
            html: htm
        };
        await sendNode(mailOptions, transporter).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports = createTronsporter
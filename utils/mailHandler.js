const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "5aab69b73eec4f",
        pass: "45e1bb9547189a",
    },
});

module.exports = {
    sendMail: async (to,url) => {
        const info = await transporter.sendMail({
            from: 'admin@haha.com',
            to: to,
            subject: "RESET PASSWORD REQUEST",
            text: "lick vo day de doi pass", // Plain-text version of the message
            html: "lick vo <a href="+url+">day</a> de doi pass", // HTML version of the message
        });

        console.log("Message sent:", info.messageId);
    },
    sendPassword: async (to, username, password) => {
        const info = await transporter.sendMail({
            from: 'admin@haha.com',
            to: to,
            subject: "Your account has been created",
            text: `Hello ${username}, your account has been created with password: ${password}`,
            html: `<p>Hello <b>${username}</b>,</p><p>Your account has been created with password: <code>${password}</code></p>`,
        });

        console.log("Password sent:", info.messageId);
    }
}
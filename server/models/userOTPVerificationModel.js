const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const nodemailer = require('nodemailer');
const User = require('./userModel');

const Schema = mongoose.Schema;

const userOTPVerificationSchema = new Schema ({
    username: {
        type: String
    },
    otp: {
        type: String
    },
    createdAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
})

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

userOTPVerificationSchema.statics.sendVerification = async function(username, email) {

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Sportify Account",
        html: `<p>Enter <b>${otp}</b> in the website to verify your account.</p>
        <p>This code will <b>expire in 1 hour</b>.</p>`
    }

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    

    const verification = await this.create({
        username,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

    return verification;
}

userOTPVerificationSchema.statics.verify = async function(username, otp) {

    const verifications = await this.find({username});

    if (verifications.length <= 0) {
        throw new Error("Account record doesn't exist or has been verified already. Please sign up or log in.");
    } else {
        const {expiresAt} = verifications[0];
        const hashedOTP = verifications[0].otp;

        if (expiresAt < Date.now()) {
            await this.deleteMany({username});
            throw new Error("Code has expired. Please request again.");
        } else {
            const validOTP = await bcrypt.compare(otp, hashedOTP);
            console.log(otp, hashedOTP);

            if (!validOTP) {
                throw new Error("Incorrect code. Please try again.");
            } else {
                await User.updateOne({username}, {verified: true});
                await this.deleteMany({username});
            }
        }
    }
}

module.exports = mongoose.model('UserOTPVerification', userOTPVerificationSchema);
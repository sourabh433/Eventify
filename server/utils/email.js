const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Verify transporter (helps debug issues early)
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email transporter error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// ✅ Common sendMail wrapper (Reusable)
const sendMail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};

// ✅ Booking Confirmation Email
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    const mailOptions = {
        from: `"Eventify Team" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `🎉 Booking Confirmed: ${eventTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4CAF50;">Booking Confirmed 🎉</h2>
                <p>Hello <b>${userName}</b>,</p>
                <p>Your booking for <b>${eventTitle}</b> has been successfully confirmed.</p>
                <p>We look forward to seeing you at the event!</p>
                <br/>
                <p>Best regards,<br/>Eventify Team</p>
            </div>
        `
    };

    return await sendMail(mailOptions);
};

// ✅ OTP Email
const sendOtpEmail = async (email, otp, type = 'verification') => {
    const mailOptions = {
        from: `"Eventify Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Your OTP Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #2196F3;">OTP Verification</h2>
                <p>Your OTP for <b>${type}</b> is:</p>
                <h1 style="letter-spacing: 3px;">${otp}</h1>
                <p>This OTP will expire in <b>10 minutes</b>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <br/>
                <p>Regards,<br/>Eventify Team</p>
            </div>
        `
    };

    return await sendMail(mailOptions);
};

// ✅ Export functions
module.exports = {
    sendBookingEmail,
    sendOtpEmail
};
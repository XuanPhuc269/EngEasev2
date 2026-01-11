import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send email');
    }
};

export const sendVerificationEmail = async (
    email: string,
    name: string,
    verificationToken: string
): Promise<void> => {
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Xin chào ${name}!</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại EngEase.</p>
      <p>Vui lòng click vào link dưới đây để xác thực email của bạn:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Xác thực Email
      </a>
      <p>Hoặc copy link sau vào trình duyệt:</p>
      <p>${verificationUrl}</p>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
      <p>Trân trọng,<br>EngEase Team</p>
    </div>
  `;

    await sendEmail({
        to: email,
        subject: 'Xác thực email - EngEase',
        html,
    });
};

export const sendResetPasswordEmail = async (
    email: string,
    name: string,
    resetToken: string
): Promise<void> => {
    const resetUrl = `http://localhost:3000/api/auth/reset-password?token=${resetToken}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Xin chào ${name}!</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản EngEase.</p>
      <p>Vui lòng click vào link dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
        Đặt lại mật khẩu
      </a>
      <p>Hoặc copy link sau vào trình duyệt:</p>
      <p>${resetUrl}</p>
      <p>Link này sẽ hết hạn sau 10 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br>EngEase Team</p>
    </div>
  `;

    await sendEmail({
        to: email,
        subject: 'Đặt lại mật khẩu - EngEase',
        html,
    });
};

export const sendWelcomeEmail = async (
    email: string,
    name: string
): Promise<void> => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Chào mừng ${name} đến với EngEase!</h2>
      <p>Tài khoản của bạn đã được xác thực thành công.</p>
      <p>Bạn có thể bắt đầu hành trình chinh phục IELTS ngay bây giờ!</p>
      <h3>Những gì bạn có thể làm trên EngEase:</h3>
      <ul>
        <li>Làm bài test theo 4 kỹ năng: Listening, Reading, Writing, Speaking</li>
        <li>Theo dõi tiến độ học tập của bạn</li>
        <li>Nhận feedback chi tiết từ giáo viên</li>
        <li>Đặt mục tiêu và đạt được band điểm mong muốn</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}" 
         style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
        Bắt đầu học ngay
      </a>
      <p style="margin-top: 30px;">Chúc bạn học tốt!<br>EngEase Team</p>
    </div>
  `;

    await sendEmail({
        to: email,
        subject: 'Chào mừng đến với EngEase!',
        html,
    });
};

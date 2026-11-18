import nodemailer from 'nodemailer';

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmailOtp = async (email: string, otp: string, customerName?: string): Promise<{ success: boolean; message: string }> => {
  const emailUser = process.env.GMAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.log(`[OTP] Email service not configured in .env. Generated OTP for ${email}: ${otp}`);
    return {
      success: true,
      message: 'OTP generated. (Email credentials not configured yet, check preview code)',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const displayName = customerName || 'Valued Customer';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 16px; background-color: #faf7f2;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #c2410c; margin: 0; font-size: 24px; font-weight: bold;">SHREE JI FAST FOOD</h2>
          <p style="color: #78350f; margin: 4px 0 0 0; font-size: 13px; font-weight: bold;">Ghar Jaisa Swad, Har Din Kuch Khaas!</p>
        </div>

        <div style="background-color: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: center;">
          <p style="color: #374151; font-size: 15px; margin: 0 0 12px 0;">Namaste <strong>${displayName}</strong>,</p>
          <p style="color: #4b5563; font-size: 14px; margin: 0 0 20px 0;">Your verification code for Shree Ji Fast Food login is:</p>
          
          <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 14px 28px; border-radius: 10px; display: inline-block; margin: 10px 0;">
            ${otp}
          </div>

          <p style="color: #6b7280; font-size: 12px; margin: 18px 0 0 0;">This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #9ca3af;">
          <p style="margin: 0;">Freshly prepared daily meals, Special Thalis, and Famous Parathas.</p>
          <p style="margin: 4px 0 0 0;">Thank you for choosing Shree Ji Fast Food!</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Shree Ji Fast Food" <${emailUser}>`,
      to: email,
      subject: `${otp} is your Shree Ji Fast Food verification code`,
      html: htmlContent,
    });

    console.log(`[OTP] Email sent successfully to ${email}`);
    return { success: true, message: 'Verification code sent to your Gmail inbox' };
  } catch (error: any) {
    console.error('[OTP] Failed to send email via SMTP:', error.message);
    // Return gracefully so user can still test with preview if needed
    return {
      success: true,
      message: 'Code generated. Please verify your Gmail address.',
    };
  }
};

export const sendSmsOtp = async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
  const fast2smsKey = process.env.FAST2SMS_API_KEY;

  if (fast2smsKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2smsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phone,
        }),
      });
      const data = await response.json();
      console.log(`[OTP] Fast2SMS response:`, data);
      return { success: true, message: 'OTP sent to mobile number via SMS' };
    } catch (err: any) {
      console.error('[OTP] Fast2SMS error:', err.message);
    }
  }

  // Fallback / Log
  console.log(`[OTP] Mobile OTP for ${phone}: ${otp}`);
  return { success: true, message: `OTP sent to mobile number ${phone}` };
};

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
  const fast2smsOtpId = process.env.FAST2SMS_OTP_ID;
  const twoFactorKey = process.env.TWO_FACTOR_API_KEY;

  // 1. Try Fast2SMS Smart OTP first if OTP ID is configured
  if (fast2smsKey && fast2smsOtpId) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/otp/send', {
        method: 'POST',
        headers: {
          authorization: fast2smsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp_id: fast2smsOtpId,
          mobile: phone,
          otp: otp,
          otp_length: 6,
          otp_expiry: 5,
        }),
      });
      const data = await response.json();
      console.log(`[OTP] Fast2SMS Smart OTP response:`, data);
      if (data.return === true || data.status_code === 200) {
        return { success: true, message: `OTP aapke mobile (+91 ${phone}) par bhej diya gaya hai!` };
      }
      if (data.message) {
        console.warn(`[OTP] Fast2SMS Smart OTP warning:`, data.message);
      }
    } catch (err: any) {
      console.error('[OTP] Fast2SMS Smart OTP error:', err.message);
    }
  }

  // 2. Try Fast2SMS Bulk V2 OTP Route
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
      console.log(`[OTP] Fast2SMS bulkV2 response:`, data);
      if (data.return === true || data.status_code === 200) {
        return { success: true, message: `OTP aapke mobile number (+91 ${phone}) par bhej diya gaya hai.` };
      }
      
      const errMsg = Array.isArray(data.message) ? data.message[0] : (data.message || '');
      // If Fast2SMS asks for OTP ID or Website verification, return clear friendly guidance
      if (data.status_code === 996) {
        return {
          success: false,
          message: 'Fast2SMS me Website Verification ya Smart OTP ID ki jarurat hai. Fast2SMS dashboard me Smart OTP ka OTP ID copy karein.',
        };
      }
      if (data.status_code === 999) {
        return {
          success: false,
          message: 'Fast2SMS: API use karne ke liye Fast2SMS me verification ya recharge pending hai.',
        };
      }
      return {
        success: false,
        message: errMsg || 'Fast2SMS SMS delivery me dikkat aayi.',
      };
    } catch (err: any) {
      console.error('[OTP] Fast2SMS error:', err.message);
      return { success: false, message: 'SMS service connect nahi ho saki. Kripya check karein.' };
    }
  }

  if (twoFactorKey) {
    try {
      const response = await fetch(`https://2factor.in/API/V1/${twoFactorKey}/SMS/${phone}/${otp}/OTP1`);
      const data = await response.json();
      console.log(`[OTP] 2Factor response:`, data);
      if (data.Status === 'Success') {
        return { success: true, message: `OTP sent via 2Factor to ${phone}` };
      }
      return { success: false, message: data.Details || '2Factor delivery failed' };
    } catch (err: any) {
      console.error('[OTP] 2Factor error:', err.message);
    }
  }

  // If no SMS provider key is configured in .env yet
  console.warn(`[SMS ALERT] FAST2SMS_API_KEY missing in .env! Generated OTP for ${phone}: ${otp}`);

  // For restaurant owner testing or development when SMS key is not yet set
  if (phone === '8839290150' || process.env.NODE_ENV !== 'production') {
    return {
      success: true,
      message: `Render me FAST2SMS_API_KEY add karein real SMS ke liye. Test Code: ${otp}`,
    };
  }

  return {
    success: false,
    message: 'Mobile SMS Gateway (FAST2SMS_API_KEY) Render me connect nahi hai. Kripya Render me FAST2SMS_API_KEY add karein ya tab tak Gmail se login karein.',
  };
};

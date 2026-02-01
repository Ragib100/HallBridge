const APP_NAME = "HallBridge";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using the configured provider (SMTP)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const res = await fetch(process.env.EMAIL_API_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        secret: process.env.EMAIL_API_SECRET,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("[EMAIL API ERROR]", err);
    return false;
  }
}

/**
 * Send approval notification email to student
 */
export async function sendApprovalEmail(
  email: string,
  fullName: string,
  studentId: string
): Promise<boolean> {
  const loginUrl = `${APP_URL}/auth/login`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hall Seat Request Approved</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D6A4F 0%, #245840 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2D6A4F; margin-top: 0;">🎉 Congratulations, ${fullName}!</h2>
        
        <p>Your hall seat request has been <strong style="color: #2D6A4F;">approved</strong>!</p>
        
        <p>You can now log in to your ${APP_NAME} account using the following credentials:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0;"><strong>Password:</strong> <code style="background: #e5e7eb; padding: 2px 8px; border-radius: 4px;">${studentId}</code> (Your Student ID)</p>
        </div>
        
        <p style="color: #ef4444;"><strong>⚠️ Important:</strong> For security reasons, you will be required to change your password when you first log in.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background: #2D6A4F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Log In Now</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">If you did not request a hall seat, please ignore this email or contact the administration.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Congratulations, ${fullName}!

Your hall seat request has been approved!

You can now log in to your ${APP_NAME} account using the following credentials:

Email: ${email}
Password: ${studentId} (Your Student ID)

IMPORTANT: For security reasons, you will be required to change your password when you first log in.

Log in here: ${loginUrl}

If you did not request a hall seat, please ignore this email or contact the administration.
  `;

  return sendEmail({
    to: email,
    subject: `🎉 Your Hall Seat Request Has Been Approved - ${APP_NAME}`,
    html,
    text,
  });
}

/**
 * Send rejection notification email to student
 */
export async function sendRejectionEmail(
  email: string,
  fullName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hall Seat Request Update</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D6A4F 0%, #245840 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #374151; margin-top: 0;">Dear ${fullName},</h2>
        
        <p>We regret to inform you that your hall seat request has not been approved at this time.</p>
        
        <p>This could be due to various reasons such as:</p>
        <ul style="color: #6b7280;">
          <li>Limited seat availability</li>
          <li>Incomplete or incorrect information provided</li>
          <li>Other administrative considerations</li>
        </ul>
        
        <p>If you believe this decision was made in error or would like more information, please contact the hall administration office.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">We appreciate your interest in our residential facilities.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Dear ${fullName},

We regret to inform you that your hall seat request has not been approved at this time.

This could be due to various reasons such as:
- Limited seat availability
- Incomplete or incorrect information provided
- Other administrative considerations

If you believe this decision was made in error or would like more information, please contact the hall administration office.

We appreciate your interest in our residential facilities.
  `;

  return sendEmail({
    to: email,
    subject: `Hall Seat Request Update - ${APP_NAME}`,
    html,
    text,
  });
}

/**
 * Send request received confirmation email to student
 */
export async function sendRequestReceivedEmail(
  email: string,
  fullName: string,
  studentId: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hall Seat Request Received</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D6A4F 0%, #245840 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2D6A4F; margin-top: 0;">Hello, ${fullName}! 👋</h2>
        
        <p>Thank you for submitting your hall seat request. We have received your application.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Your Details:</strong></p>
          <p style="margin: 0 0 5px 0;">Name: ${fullName}</p>
          <p style="margin: 0 0 5px 0;">Email: ${email}</p>
          <p style="margin: 0;">Student ID: ${studentId}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>📋 Status: Pending Review</strong></p>
          <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">Your request is currently under review by the administration. You will receive an email notification once a decision has been made.</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">If you have any questions, please contact the hall administration office.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Hello, ${fullName}!

Thank you for submitting your hall seat request. We have received your application.

Your Details:
Name: ${fullName}
Email: ${email}
Student ID: ${studentId}

Status: Pending Review
Your request is currently under review by the administration. You will receive an email notification once a decision has been made.

If you have any questions, please contact the hall administration office.
  `;

  return sendEmail({
    to: email,
    subject: `Hall Seat Request Received - ${APP_NAME}`,
    html,
    text,
  });
}

/**
 * Send password reset OTP email
 */
export async function sendPasswordResetOTPEmail(
  email: string,
  fullName: string,
  otp: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D6A4F 0%, #245840 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #374151; margin-top: 0;">Password Reset Request</h2>
        
        <p>Hello <strong>${fullName}</strong>,</p>
        
        <p>We received a request to reset your password. Use the OTP code below to verify your identity:</p>
        
        <div style="background: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your One-Time Password (OTP)</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2D6A4F; font-family: monospace;">
            ${otp}
          </div>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>⏰ This code expires in 10 minutes.</strong><br>
            Do not share this code with anyone.
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Password Reset Request

Hello ${fullName},

We received a request to reset your password. Use the OTP code below to verify your identity:

Your OTP: ${otp}

This code expires in 10 minutes. Do not share this code with anyone.

If you didn't request a password reset, please ignore this email.
  `;

  return sendEmail({
    to: email,
    subject: `🔐 Password Reset OTP - ${APP_NAME}`,
    html,
    text,
  });
}

/**
 * Send password reset success confirmation email
 */
export async function sendPasswordResetSuccessEmail(
  email: string,
  fullName: string
): Promise<boolean> {
  const loginUrl = `${APP_URL}/auth/login`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D6A4F 0%, #245840 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 60px; height: 60px; background: #d1fae5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
            <span style="font-size: 30px;">✓</span>
          </div>
        </div>
        
        <h2 style="color: #2D6A4F; margin-top: 0; text-align: center;">Password Reset Successful!</h2>
        
        <p>Hello <strong>${fullName}</strong>,</p>
        
        <p>Your password has been successfully reset. You can now log in with your new password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background: #2D6A4F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Log In Now</a>
        </div>
        
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            <strong>⚠️ Security Notice:</strong> If you did not make this change, please contact support immediately.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Password Reset Successful!

Hello ${fullName},

Your password has been successfully reset. You can now log in with your new password.

Log in here: ${loginUrl}

Security Notice: If you did not make this change, please contact support immediately.
  `;

  return sendEmail({
    to: email,
    subject: `✅ Password Reset Successful - ${APP_NAME}`,
    html,
    text,
  });
}

/**
 * Send room allocation notification email to student
 */
export async function sendRoomAllocationEmail(
  email: string,
  fullName: string,
  studentId: string,
  roomInfo: {
    floor: number;
    roomNumber: string;
    bedNumber: number;
    hallId?: string | null;
  }
): Promise<boolean> {
  const loginUrl = `${APP_URL}/auth/login`;
  const hallInfo = roomInfo.hallId ? `Hall: ${roomInfo.hallId}` : "";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Room Allocation Notification</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D6A4F 0%, #245840 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${APP_NAME}</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2D6A4F; margin-top: 0;">🎉 Congratulations, ${fullName}!</h2>
        
        <p>Your hall seat request has been <strong style="color: #2D6A4F;">approved</strong> and you have been allocated a room!</p>
        
        <div style="background: linear-gradient(135deg, #2D6A4F 0%, #40E0D0 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; color: white;">
          <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.9;">Your Room Assignment</p>
          <div style="font-size: 42px; font-weight: bold; margin: 10px 0;">
            Room ${roomInfo.roomNumber}
          </div>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
            <div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Floor</p>
              <p style="margin: 0; font-size: 20px; font-weight: 600;">${roomInfo.floor}</p>
            </div>
            <div style="width: 1px; background: rgba(255,255,255,0.3);"></div>
            <div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Bed No.</p>
              <p style="margin: 0; font-size: 20px; font-weight: 600;">${roomInfo.bedNumber}</p>
            </div>
            ${roomInfo.hallId ? `
            <div style="width: 1px; background: rgba(255,255,255,0.3);"></div>
            <div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">Hall</p>
              <p style="margin: 0; font-size: 20px; font-weight: 600;">${roomInfo.hallId}</p>
            </div>
            ` : ""}
          </div>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Your Login Credentials:</strong></p>
          <p style="margin: 0 0 5px 0;">Email: ${email}</p>
          <p style="margin: 0;">Password: <code style="background: #e5e7eb; padding: 2px 8px; border-radius: 4px;">${studentId}</code> (Your Student ID)</p>
        </div>
        
        <p style="color: #ef4444;"><strong>⚠️ Important:</strong> For security reasons, you will be required to change your password when you first log in.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background: #2D6A4F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Log In Now</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">If you have any questions about your room assignment, please contact the hall administration office.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Congratulations, ${fullName}!

Your hall seat request has been approved and you have been allocated a room!

Your Room Assignment:
- Room: ${roomInfo.roomNumber}
- Floor: ${roomInfo.floor}
- Bed Number: ${roomInfo.bedNumber}
${hallInfo ? `- ${hallInfo}` : ""}

Your Login Credentials:
- Email: ${email}
- Password: ${studentId} (Your Student ID)

IMPORTANT: For security reasons, you will be required to change your password when you first log in.

Log in here: ${loginUrl}

If you have any questions about your room assignment, please contact the hall administration office.
  `;

  return sendEmail({
    to: email,
    subject: `🏠 Room Allocated: Room ${roomInfo.roomNumber} - ${APP_NAME}`,
    html,
    text,
  });
}

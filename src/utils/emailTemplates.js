/**
 * Generates an HTML template for OTP verification.
 * @param {string} otp - The 6-digit plain OTP.
 * @param {string} name - The user's name.
 * @returns {string} HTML content.
 */
export const verificationEmailTemplate = (otp, name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            .container {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
            }
            .header {
                text-align: center;
                color: #333;
            }
            .otp-box {
                background-color: #f4f4f4;
                padding: 20px;
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #2c3e50;
                margin: 20px 0;
                border-radius: 5px;
                border: 1px dashed #3498db;
            }
            .footer {
                font-size: 12px;
                color: #777;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Welcome to GoodMatter!</h2>
            </div>
            <p>Hi ${name},</p>
            <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address. This code is valid for 10 minutes.</p>
            
            <div class="otp-box">
                ${otp}
            </div>
            
            <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
            
            <div class="footer">
                <p>&copy; 2026 GoodMatter. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};


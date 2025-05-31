import { EmailTemplateParams } from "@/modules/authentication/types/authentication";

export const emailTemplates = {
  passwordReset: ({ link }: EmailTemplateParams) => ({
    subject: "Password Reset",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f6f8fa; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #222; font-size: 22px; font-weight: bold; padding-bottom: 16px;">
                Password Reset
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #444; font-size: 16px; padding-bottom: 24px;">
                Hello,<br><br>
                You requested a password reset. Click the button below to create a new password:
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <a href="${link}" aria-label="Reset your password" style="display: inline-block; background: #fbbf24; color: #222; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px;">
                  Reset Password
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #888; font-size: 13px;">
                If you did not request this change, you can ignore this email.<br><br>
                <span style="font-size: 11px;">
                  &copy; ${new Date().getFullYear()} 
                  <a href="https://github.com/malu-monteiro" 
                    style="color: #222; text-decoration: none;"
                    target="_blank" rel="noopener noreferrer" 
                    aria-label="GitHub - malu-monteiro">
                    malu-monteiro
                  </a>
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  }),

  emailVerification: ({ link }: EmailTemplateParams) => ({
    subject: "Verify your email",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f6f8fa; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #222; font-size: 22px; font-weight: bold; padding-bottom: 16px;">
                Verify your email
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #444; font-size: 16px; padding-bottom: 24px;">
                Hello,<br><br>
                Click the button below to verify your email:
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <a href="${link}" aria-label="Verify your email" style="display: inline-block; background: #fbbf24; color: #222; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px;">
                  Verify Email
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #888; font-size: 13px;">
                If you did not request this change, you can ignore this email.<br><br>
                <span style="font-size: 11px;">
                  &copy; ${new Date().getFullYear()} 
                  <a href="https://github.com/malu-monteiro" 
                    style="color: #222; text-decoration: none;"
                    target="_blank" rel="noopener noreferrer" 
                    aria-label="GitHub - malu-monteiro">
                    malu-monteiro
                  </a>
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  }),

  newEmailVerification: ({ link }: EmailTemplateParams) => ({
    subject: "Verify your new email",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f6f8fa; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #222; font-size: 22px; font-weight: bold; padding-bottom: 16px;">
                Verify your new email
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #444; font-size: 16px; padding-bottom: 24px;">
                Hello,<br><br>
                Click the button below to verify your new email address:
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <a href="${link}" aria-label="Verify your new email" style="display: inline-block; background: #fbbf24; color: #222; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px;">
                  Verify New Email
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, Helvetica, sans-serif; color: #888; font-size: 13px;">
                If you did not request this change, you can ignore this email.<br><br>
                <span style="font-size: 11px;">
                  &copy; ${new Date().getFullYear()} 
                  <a href="https://github.com/malu-monteiro" 
                    style="color: #222; text-decoration: none;"
                    target="_blank" rel="noopener noreferrer" 
                    aria-label="GitHub - malu-monteiro">
                    malu-monteiro
                  </a>
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
  }),
};

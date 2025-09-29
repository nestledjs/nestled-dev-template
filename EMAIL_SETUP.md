# Email Configuration Guide

## The Issue
The "Template email send failed" error occurs when the email service tries to send emails but the SMTP server is not properly configured or unreachable.

## Solution

### For Development

1. **Option A: Use Mailhog (Recommended for local development)**
   ```bash
   # Install Mailhog (on macOS)
   brew install mailhog

   # Start Mailhog
   mailhog
   ```

   Then in your `.env` file:
   ```env
   SMTP_HOST=localhost
   SMTP_PORT=1025
   SMTP_USER=test
   SMTP_PASS=test
   ```

   Access Mailhog UI at: http://localhost:8025

2. **Option B: Use Mailtrap**
   - Sign up for a free account at https://mailtrap.io
   - Get your SMTP credentials from the inbox settings
   - Update your `.env` file with the provided credentials

3. **Option C: Disable email sending (quick workaround)**
   - The application will still work, but email features won't function
   - Users won't receive verification emails

### For Production

Configure your `.env` file with real SMTP credentials from your email provider:

```env
# Example with SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# Example with AWS SES
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_ses_smtp_username
SMTP_PASS=your_ses_smtp_password
```

## Email Templates

Email templates are located in:
`libs/api/integrations/src/lib/email/templates/`

The system uses the following templates:
- `email-verification.template.ts` - For verifying email addresses
- `password-reset.template.ts` - For password reset requests
- `password-changed.template.ts` - Notification when password is changed
- `welcome.template.ts` - Welcome email for new users

Each template is a TypeScript file that exports a `TemplateDefinition` object containing:
- Template metadata (id, name, description)
- Subject line (with Handlebars variables)
- HTML template (with full styling)
- Text template (plain text fallback)
- Required and optional variables

### Benefits of the New Approach

✅ **No file copying needed** - Templates are compiled into the JavaScript bundle
✅ **Type safety** - TypeScript ensures all templates have the correct structure
✅ **Better organization** - Each template is in its own file
✅ **Easier to maintain** - All template code is in one place
✅ **No runtime file reading** - Faster and more reliable

### Creating a New Template

1. Create a new file in `libs/api/integrations/src/lib/email/templates/`
2. Import the `TemplateDefinition` interface
3. Export your template following the existing pattern
4. Import and add it to the `EMAIL_TEMPLATES` map in `index.ts`

## Troubleshooting

1. **Check API logs**: The API will log template loading and any errors
2. **Test SMTP connection**: The email service has a `testConnection()` method you can use
3. **Use Mailhog for development**: It captures all emails locally without sending them

## Important Notes

- After changing `.env` file, restart the API server
- Templates are now part of the compiled code - no separate files to manage
- If you modify templates, rebuild the API: `npx nx build api`
# Email Templates

This directory contains Handlebars-based email templates for authentication and other system emails.

## Template Structure

Each template consists of three files:
- `{template-id}.json` - Template definition with metadata
- `{template-id}.html` - Handlebars HTML template
- `{template-id}.txt` - Handlebars plain text template (optional)

## Available Templates

### Authentication Templates
- **email-verification** - Email verification for new accounts
- **password-reset** - Password reset requests
- **password-changed** - Security notification after password change
- **welcome** - Welcome email after successful account verification

## Usage Example

```typescript
import { EmailService, HandlebarsTemplateManager } from '@nestled-template/api/integrations'

// Using the template manager directly
const templateManager = new HandlebarsTemplateManager()
const rendered = await templateManager.renderTemplate('email-verification', {
  userName: 'John Doe',
  verificationUrl: 'https://app.example.com/verify?token=abc123',
  appName: 'MyApp',
  expirationHours: 24
})

// Using through email service
const emailService = new EmailService()
await emailService.sendTemplate('user@example.com', {
  templateId: 'email-verification',
  variables: {
    userName: 'John Doe',
    verificationUrl: 'https://app.example.com/verify?token=abc123',
    appName: 'MyApp',
    expirationHours: 24
  }
})
```

## Template Variables

### Common Variables (available in all templates)
- `appName` - Name of the application
- `companyName` - Company name (optional, falls back to appName)
- `supportEmail` - Support email address (optional)

### Template-Specific Variables
Check each template's `.json` file for `requiredVariables` and `optionalVariables`.

## Handlebars Helpers

The following custom helpers are available:
- `formatDate` - Format dates (e.g., `{{formatDate changeTime}}`)
- `uppercase` - Convert to uppercase
- `lowercase` - Convert to lowercase  
- `eq` - Equality comparison
- `ne` - Not equal comparison
- `or` - Logical OR

## Adding New Templates

1. Create the template definition JSON file
2. Create the HTML template with Handlebars syntax
3. Optionally create a text template
4. The template will be automatically available through the template manager
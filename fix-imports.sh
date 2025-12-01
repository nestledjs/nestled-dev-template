#!/bin/bash

# Fix register.tsx
sed -i '' '13s/^export default function Register/export default function RegisterPage/' apps/web/app/routes/_public/register.tsx

# Fix reset-password.tsx
sed -i '' '/import { useMutation } from/d' apps/web/app/routes/_public/reset-password.tsx
sed -i '' '/import { formTheme }/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/app/routes/_public/reset-password.tsx
sed -i '' 's/^export default function ResetPassword/export default function ResetPasswordPage/' apps/web/app/routes/_public/reset-password.tsx

# Fix resend-verification.tsx
sed -i '' '/import { useMutation } from/d' apps/web/app/routes/_public/resend-verification.tsx
sed -i '' '/import { formTheme }/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/app/routes/_public/resend-verification.tsx

# Fix verify-email.tsx
sed -i '' '/import { useMutation } from/d' apps/web/app/routes/_public/verify-email.tsx
sed -i '' '4s/^export default function VerifyEmail/export default function VerifyEmailPage/' apps/web/app/routes/_public/verify-email.tsx
sed -i '' '/LoginInput,/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/app/routes/_public/verify-email.tsx

# Fix accept-invitation.tsx
sed -i '' '/import { useMutation } from/d' apps/web/app/routes/accept-invitation.tsx
sed -i '' '/import { formTheme }/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/app/routes/accept-invitation.tsx

# Fix pricing.tsx
sed -i '' '/import { useMutation } from/d' apps/web/app/routes/pricing.tsx
sed -i '' '/import { CheckIcon/a\
import { useMutation, useQuery } from '"'"'@apollo/client/react'"'"'
' apps/web/app/routes/pricing.tsx

# Fix settings/billing.tsx
sed -i '' '/import { useMutation } from/d' apps/web/app/routes/settings/billing.tsx
sed -i '' '/} from '"'"'@heroicons/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/app/routes/settings/billing.tsx

echo "Import fixes applied!"

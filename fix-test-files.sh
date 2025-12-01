#!/bin/bash

# Fix login test
sed -i '' 's/useLoginMutation, useComplete2FaLoginMutation/Login, Complete2FaLogin, type LoginMutation, type Complete2FaLoginMutation/' apps/web/tests/routes/_public/login.spec.tsx
sed -i '' '/import.*Login.*from/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/tests/routes/_public/login.spec.tsx

# Fix forgot-password test
sed -i '' 's/useForgotPasswordMutation/ForgotPassword, type ForgotPasswordMutation/' apps/web/tests/routes/_public/forgot-password.spec.tsx
sed -i '' '/import.*ForgotPassword.*from/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/tests/routes/_public/forgot-password.spec.tsx

# Fix register test
sed -i '' 's/useRegisterMutation/Register, type RegisterMutation/' apps/web/tests/routes/_public/register.spec.tsx
sed -i '' '/import.*Register.*from/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/tests/routes/_public/register.spec.tsx

# Fix reset-password test  
sed -i '' 's/useResetPasswordMutation/ResetPassword, type ResetPasswordMutation/' apps/web/tests/routes/_public/reset-password.spec.tsx
sed -i '' '/import.*ResetPassword.*from/a\
import { useMutation } from '"'"'@apollo/client/react'"'"'
' apps/web/tests/routes/_public/reset-password.spec.tsx

# Fix settings layout test
sed -i '' 's/useMyOrganizationsWithMembersQuery/MyOrganizationsWithMembers, type MyOrganizationsWithMembersQuery/' apps/web/tests/routes/settings/_layout.spec.tsx
sed -i '' '/import.*MyOrganizationsWithMembers.*from/a\
import { useQuery } from '"'"'@apollo/client/react'"'"'
' apps/web/tests/routes/settings/_layout.spec.tsx

echo "Test files updated!"

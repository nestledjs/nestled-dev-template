# Migration: Add Organizations to Existing Users

## Problem
If you created user accounts **before** the multi-tenancy feature was implemented, those users won't have organizations. This causes issues because:
- The frontend expects every user to have at least one organization
- The organization switcher won't work
- Many features are scoped to organizations

## Solution

### Option 1: Run the Migration Script (Recommended)

Run this command to automatically create organizations for all users without one:

```bash
pnpm migrate:add-orgs
```

**What it does:**
- Finds all users without any organization memberships
- Creates a default organization for each user (named "{FirstName}'s Organization")
- Creates default roles (Owner, Admin, Member) for each organization
- Adds the user as the Owner of their organization
- Sets the new organization as the user's active organization

**Example output:**
```
🔍 Finding users without organizations...
📊 Found 3 users without organizations

🚀 Creating organizations for users...

  👤 John Doe (john@example.com)
     ✅ Created organization: John's Organization
     ✅ Created roles
     ✅ Added user as Owner
     ✅ Set as active organization

  👤 Jane Smith (jane@example.com)
     ✅ Created organization: Jane's Organization
     ✅ Created roles
     ✅ Added user as Owner
     ✅ Set as active organization

✨ Migration complete!
```

### Option 2: Delete and Re-register (Development Only)

If you're in development and don't mind losing your test data:

1. **Delete your user account:**
   ```bash
   # Using Prisma Studio (easiest)
   pnpm prisma:studio

   # Or directly in the database
   # DELETE FROM "User" WHERE email = 'your@email.com';
   ```

2. **Register again:**
   - Go to `/public/register`
   - Fill out the registration form **including the "Organization Name" field**
   - Your account will be created with an organization automatically

## How to Check if You Need This Migration

Run this query to see if you have users without organizations:

```bash
# Using Prisma Studio
pnpm prisma:studio
# Look at the User table and check if activeOrganizationId is null

# Or via GraphQL Playground (http://localhost:3000/graphql)
query {
  myOrganizations {
    id
    name
  }
}
```

If `myOrganizations` returns an empty array, you need to run the migration.

## Technical Details

### What the Registration Flow Does Now

When a new user registers, the backend automatically:

1. Creates the user account
2. Creates a default organization with the name provided in the registration form
3. Creates 3 default roles:
   - **Owner**: Full access including organization deletion
   - **Admin**: Can manage members and settings
   - **Member**: Basic read access
4. Adds the user as Owner of the organization
5. Sets the organization as the user's active organization

This all happens in the `register` mutation in `libs/api/custom/src/lib/plugins/auth/auth.service.ts`.

### Migration Script Location

The migration script is located at:
- **Script**: `scripts/migrate-users-to-orgs.ts`
- **Command**: `pnpm migrate:add-orgs`

## After Running the Migration

1. **Log out and log back in** to refresh your session
2. **Check the organization switcher** in the top navigation - you should see your new organization
3. **Verify access** - you should be the Owner of your organization with full permissions

## Troubleshooting

### "All users already have organizations!"
This means the migration has already been run or all users have organizations. You're good to go!

### Migration fails with an error
Check the error message. Common issues:
- Database connection problems
- Missing permissions
- Duplicate organizations (shouldn't happen, but check the logs)

### Still can't see organization switcher after migration
1. Clear your browser cookies and cache
2. Log out completely (`/logout`)
3. Log back in
4. Check the network tab for GraphQL errors

## Production Considerations

If you're running this on production:

1. **Backup your database first!**
2. Consider running in a maintenance window
3. Test on a staging environment first
4. Monitor the logs during execution
5. Notify users if there will be downtime

---

**Created**: Phase 3 - Frontend Implementation
**Last Updated**: October 2025

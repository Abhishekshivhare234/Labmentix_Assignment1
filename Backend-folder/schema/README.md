This folder contains SQL migrations for the Labmentix backend.

Files:
- `001_create_schema.sql` — Creates tables (users, courses, lessons, quizzes, progress) and enables Row Level Security (RLS) policies.

How to apply the SQL:

1) Using psql (connect to your Postgres DB):

   # Example (replace placeholders with your values)
   PGPASSWORD=your_db_password psql -h your_db_host -p 5432 -U your_db_user -d your_db_name -f migrations/001_create_schema.sql

2) Using Supabase SQL editor (recommended for Supabase projects):
   - Open your Supabase project dashboard -> SQL Editor -> New query
   - Paste the contents of `001_create_schema.sql` and run it.

Notes and recommendations:
- The statement `uuid_generate_v4()` requires the `uuid-ossp` extension on vanilla Postgres. If errors appear, run:

   create extension if not exists "uuid-ossp";

  before creating the tables.

- RLS policies use `auth.uid()` which works when requests are authenticated by Supabase (or when using the anon key from the client). Server-side code using a service_role key bypasses RLS — be mindful of which key your backend uses.

- If you plan to run migrations automatically, consider using Supabase CLI or a migrations tool that fits your deployment workflow.

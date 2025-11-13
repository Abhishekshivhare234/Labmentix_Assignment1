-- Create tables
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique,
  role text check (role in ('student', 'instructor', 'admin')),
  created_at timestamp default now()
);

create table courses (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  instructor_id uuid references users(id),
  price numeric,
  thumbnail text,
  created_at timestamp default now()
);

create table lectures (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id),
  title text,
  video_url text,
  duration numeric
);

create table quizzes (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id),
  question text,
  options text[],
  correct_option text
);

create table progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  course_id uuid references courses(id),
  completed_lessons int default 0,
  total_lessons int default 0,
  percentage numeric default 0
);

create table enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  course_id uuid references courses(id),
  enrolled_at timestamp default now(),
  unique(user_id, course_id)
);


-- Enable Row Level Security and policies
alter table users enable row level security;

-- Policy 1: Allow users to read their own profile
create policy "Users can view their own profile"
on users
for select
using (auth.uid() = id);

-- Policy 2: Allow users to update their own profile
create policy "Users can update their own profile"
on users
for update
using (auth.uid() = id);

alter table public.courses enable row level security;

-- Anyone can view courses
create policy "Anyone can view courses"
on public.courses
for select
using (true);

-- Instructors can manage their own courses
create policy "Instructors can modify their own courses"
on public.courses
for all
using (auth.uid() = instructor_id);


alter table public.lessons enable row level security;

-- Anyone can view lessons (public courses)
create policy "Anyone can view lessons"
on public.lessons
for select
using (true);

-- Instructors can manage lessons in their own courses
create policy "Instructors can modify lessons of their courses"
on public.lessons
for all
using (
  exists (
    select 1 from public.courses
    where courses.id = lessons.course_id
    and courses.instructor_id = auth.uid()
  )
);


alter table public.quizzes enable row level security;

-- Anyone can view quizzes (students)
create policy "Anyone can view quizzes"
on public.quizzes
for select
using (true);

-- Instructors can manage quizzes for their own courses
create policy "Instructors can modify quizzes of their courses"
on public.quizzes
for all
using (
  exists (
    select 1 from public.courses
    where courses.id = quizzes.course_id
    and courses.instructor_id = auth.uid()
  )
);


alter table public.progress enable row level security;

-- Students can read their own progress
create policy "Students can view their own progress"
on public.progress
for select
using (auth.uid() = user_id);

-- Students can update their own progress
create policy "Students can update their own progress"
on public.progress
for update
using (auth.uid() = user_id);

-- Allow inserting progress rows for themselves
create policy "Students can insert their own progress"
on public.progress
for insert
with check (auth.uid() = user_id);

-- Enrollments table for course enrollment tracking
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    progress_percentage INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- Create indexes for enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

-- Enable RLS on enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollment progress" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view enrollments for their courses" ON enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = enrollments.course_id
            AND courses.instructor_id = auth.uid()
        )
    );

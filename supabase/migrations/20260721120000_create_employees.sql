-- Employee Management System — employees directory.
--
-- Assumes the existing staff-auth helpers already present in this project
-- (referenced by src/lib/supabase/admin.ts and every other staff-only
-- table's RLS policies):
--   public.is_staff()            returns boolean
--   public.current_staff_role()  returns public.user_role
--     ('super_admin' | 'admin' | 'employee')
-- If those names differ in the live database, adjust the policies below
-- before applying this migration.
--
-- Salary lives on this table, so read/write is restricted to Admin/Super
-- Admin — plain "employee" staff have no access to the directory at all,
-- matching the "least privilege" principle already used elsewhere in this
-- project (see docs/ARCHITECTURE.md §4).

create type public.employee_status as enum ('active', 'inactive');

-- Backs the human-readable, auto-generated Employee ID (EMP-0001, ...).
create sequence public.employees_code_seq start with 1 increment by 1;

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null unique
    default ('EMP-' || lpad(nextval('public.employees_code_seq')::text, 4, '0')),
  full_name text not null,
  email text not null unique,
  phone text not null,
  cnic text,
  designation text not null,
  department text not null,
  salary numeric(12, 2) not null check (salary >= 0),
  joining_date date not null,
  work_start_time time not null default '09:00',
  work_end_time time not null default '18:00',
  status public.employee_status not null default 'active',
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.employees is
  'Company staff directory for the Super Admin Employee Management System.';
comment on column public.employees.employee_code is
  'Auto-generated human-readable ID, e.g. EMP-0001.';
comment on column public.employees.cnic is 'Optional national ID number.';

alter sequence public.employees_code_seq owned by public.employees.employee_code;
grant usage on sequence public.employees_code_seq to authenticated, service_role;

create index employees_status_idx on public.employees (status);
create index employees_department_idx on public.employees (department);
create index employees_designation_idx on public.employees (designation);
create index employees_joining_date_idx on public.employees (joining_date);
create index employees_created_at_idx on public.employees (created_at desc);

create or replace function public.employees_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger employees_set_updated_at
before update on public.employees
for each row
execute function public.employees_touch_updated_at();

alter table public.employees enable row level security;

create policy "Admins can view employees"
  on public.employees for select
  using (public.current_staff_role() in ('admin', 'super_admin'));

create policy "Admins can insert employees"
  on public.employees for insert
  with check (public.current_staff_role() in ('admin', 'super_admin'));

create policy "Admins can update employees"
  on public.employees for update
  using (public.current_staff_role() in ('admin', 'super_admin'))
  with check (public.current_staff_role() in ('admin', 'super_admin'));

create policy "Super admins can delete employees"
  on public.employees for delete
  using (public.current_staff_role() = 'super_admin');

-- Employee Management System — monthly payroll / salary history.
--
-- One row per employee per calendar month, kept forever (never deleted by
-- application logic — the "Delete" action here is a manual admin
-- correction, not a retention policy). Same RLS assumptions as
-- 20260721120000_create_employees.sql (is_staff() / current_staff_role()).

create type public.salary_payment_status as enum ('paid', 'unpaid');

create table public.employee_salaries (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  salary_month smallint not null check (salary_month between 1 and 12),
  salary_year smallint not null check (salary_year between 2000 and 2100),
  salary_amount numeric(12, 2) not null check (salary_amount >= 0),
  payment_date date,
  payment_status public.salary_payment_status not null default 'unpaid',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, salary_month, salary_year)
);

comment on table public.employee_salaries is
  'Monthly payroll history per employee — one row per employee per month, retained indefinitely for reporting.';

create index employee_salaries_employee_id_idx on public.employee_salaries (employee_id);
create index employee_salaries_year_month_idx
  on public.employee_salaries (salary_year, salary_month);
create index employee_salaries_status_idx on public.employee_salaries (payment_status);
create index employee_salaries_payment_date_idx on public.employee_salaries (payment_date);

create or replace function public.employee_salaries_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger employee_salaries_set_updated_at
before update on public.employee_salaries
for each row
execute function public.employee_salaries_touch_updated_at();

alter table public.employee_salaries enable row level security;

create policy "Admins can view salary records"
  on public.employee_salaries for select
  using (public.current_staff_role() in ('admin', 'super_admin'));

create policy "Admins can insert salary records"
  on public.employee_salaries for insert
  with check (public.current_staff_role() in ('admin', 'super_admin'));

create policy "Admins can update salary records"
  on public.employee_salaries for update
  using (public.current_staff_role() in ('admin', 'super_admin'))
  with check (public.current_staff_role() in ('admin', 'super_admin'));

create policy "Super admins can delete salary records"
  on public.employee_salaries for delete
  using (public.current_staff_role() = 'super_admin');

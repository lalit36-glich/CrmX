-- ====================================================================
-- Get You Collab (GYC) - Influencer Marketing CRM Database Schema
-- Target: PostgreSQL / Supabase with Row Level Security (RLS)
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'creator')),
  creator_id uuid, -- linked creator record if role is creator
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CREATORS
create table if not exists public.creators (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  handle text not null,
  email text not null,
  phone text,
  niche text not null, -- Beauty, Tech, Fitness, Fashion, Lifestyle, Food, Gaming
  platform text not null default 'Instagram', -- Instagram, YouTube, Mixed
  city text not null,
  followers_count integer default 0,
  avg_views integer default 0,
  engagement_rate numeric(5,2) default 0.00,
  follower_tier text check (follower_tier in ('Nano', 'Micro', 'Macro', 'Mega')),
  stage text not null default 'Onboarded' check (stage in ('Lead', 'Contacted', 'Negotiating', 'Onboarded', 'Active')),
  reliability_score integer default 90, -- 0 to 100
  on_time_delivery_rate numeric(5,2) default 95.00,
  upi_id text,
  bank_account_number text,
  bank_ifsc text,
  pan_number text,
  audience_gender_split jsonb default '{"female": 65, "male": 35}'::jsonb,
  audience_age_split jsonb default '{"18-24": 45, "25-34": 40, "35+": 15}'::jsonb,
  top_cities jsonb default '["Mumbai", "Delhi NCR", "Bengaluru"]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Link profiles.creator_id foreign key
alter table public.profiles 
  add constraint fk_profiles_creator 
  foreign key (creator_id) references public.creators(id) on delete set null;

-- 3. BRANDS
create table if not exists public.brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  contact_person text,
  contact_email text,
  website text,
  logo_url text,
  status text default 'Active' check (status in ('Active', 'On Hold', 'Prospect')),
  total_spend numeric(12,2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CAMPAIGNS
create table if not exists public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  name text not null,
  objective text default 'Conversions & GMV',
  budget numeric(12,2) default 0.00,
  start_date date not null,
  end_date date not null,
  status text not null default 'Active' check (status in ('Draft', 'Active', 'Completed', 'Paused')),
  commission_rate numeric(5,2) default 10.00, -- e.g. 10%
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. DEALS (Contracts between Creator & Campaign)
create table if not exists public.deals (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  deal_value numeric(12,2) default 0.00,
  commission_percentage numeric(5,2) default 10.00,
  status text not null default 'Invited' check (
    status in ('Invited', 'Accepted', 'Declined', 'Content Submitted', 'Approved', 'Live', 'Completed')
  ),
  deliverables text not null, -- e.g., "1 IG Reel + 2 Stories"
  deadline date not null,
  terms text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. CONTENT ITEMS
create table if not exists public.content_items (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references public.deals(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  title text not null,
  content_type text not null check (content_type in ('Reel', 'Story', 'YouTube Video', 'Short', 'Static Post')),
  live_url text,
  draft_asset_url text,
  views_count integer default 0,
  likes_count integer default 0,
  comments_count integer default 0,
  status text not null default 'Pending Approval' check (
    status in ('Draft', 'Pending Approval', 'Revision Requested', 'Approved', 'Live')
  ),
  review_notes text,
  submitted_at timestamp with time zone,
  approved_at timestamp with time zone,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. TRACKING LINKS & COUPONS
create table if not exists public.tracking_links (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  slug text not null unique,
  destination_url text not null,
  coupon_code text,
  utm_source text default 'creator',
  utm_medium text default 'social',
  utm_campaign text not null,
  clicks_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CLICKS
create table if not exists public.clicks (
  id uuid default uuid_generate_v4() primary key,
  tracking_link_id uuid references public.tracking_links(id) on delete cascade not null,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  ip_hash text,
  user_agent text,
  city text,
  device text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ORDERS (Attributed E-commerce Sales)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  tracking_link_id uuid references public.tracking_links(id) on delete set null,
  order_number text not null,
  order_value numeric(12,2) not null,
  customer_city text,
  status text not null default 'Confirmed' check (status in ('Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
  ordered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. COMMISSIONS
create table if not exists public.commissions (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references public.deals(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  amount numeric(12,2) not null,
  rate_percentage numeric(5,2) not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Paid', 'Disputed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. PAYOUTS
create table if not exists public.payouts (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references public.creators(id) on delete cascade not null,
  amount numeric(12,2) not null,
  tds_deducted numeric(12,2) default 0.00, -- 10% under Section 194J/194C
  net_amount numeric(12,2) not null,
  payment_method text not null check (payment_method in ('UPI', 'NEFT', 'IMPS')),
  utr_number text,
  invoice_number text,
  status text not null default 'Pending' check (status in ('Pending', 'Processing', 'Paid', 'Failed')),
  paid_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. TASKS & FOLLOW-UPS
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  assigned_to uuid references public.profiles(id) on delete set null,
  creator_id uuid references public.creators(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  due_date date not null,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  status text default 'Pending' check (status in ('Pending', 'In Progress', 'Completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. ACTIVITIES (Audit Log & Feed)
create table if not exists public.activities (
  id uuid default uuid_generate_v4() primary key,
  actor_name text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Admin sees all, Creators see only their own data
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.brands enable row level security;
alter table public.campaigns enable row level security;
alter table public.deals enable row level security;
alter table public.content_items enable row level security;
alter table public.tracking_links enable row level security;
alter table public.clicks enable row level security;
alter table public.orders enable row level security;
alter table public.commissions enable row level security;
alter table public.payouts enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Helper function to get current user's creator_id
create or replace function public.current_creator_id()
returns uuid as $$
  select creator_id from public.profiles
  where id = auth.uid()
  limit 1;
$$ language sql security definer;

-- PROFILES Policies
create policy "Admins can view and manage all profiles"
  on public.profiles for all
  using (public.is_admin());

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- CREATORS Policies
create policy "Admins have full access to creators"
  on public.creators for all
  using (public.is_admin());

create policy "Creators can view and update their own record"
  on public.creators for select
  using (id = public.current_creator_id() or user_id = auth.uid());

create policy "Creators can update their own bank and profile details"
  on public.creators for update
  using (id = public.current_creator_id() or user_id = auth.uid());

-- BRANDS Policies
create policy "Admins can manage brands"
  on public.brands for all
  using (public.is_admin());

create policy "Creators can view brands they have deals with"
  on public.brands for select
  using (
    exists (
      select 1 from public.deals d
      join public.campaigns c on d.campaign_id = c.id
      where c.brand_id = public.brands.id
        and d.creator_id = public.current_creator_id()
    ) or public.is_admin()
  );

-- CAMPAIGNS Policies
create policy "Admins can manage campaigns"
  on public.campaigns for all
  using (public.is_admin());

create policy "Creators can view campaigns they are participating in"
  on public.campaigns for select
  using (
    exists (
      select 1 from public.deals
      where campaign_id = public.campaigns.id
        and creator_id = public.current_creator_id()
    ) or public.is_admin()
  );

-- DEALS Policies
create policy "Admins can manage all deals"
  on public.deals for all
  using (public.is_admin());

create policy "Creators can view their own deals"
  on public.deals for select
  using (creator_id = public.current_creator_id());

create policy "Creators can update their own deal status (accept/decline)"
  on public.deals for update
  using (creator_id = public.current_creator_id());

-- CONTENT ITEMS Policies
create policy "Admins can manage all content items"
  on public.content_items for all
  using (public.is_admin());

create policy "Creators can view and submit their own content items"
  on public.content_items for all
  using (creator_id = public.current_creator_id());

-- TRACKING LINKS Policies
create policy "Admins can manage all tracking links"
  on public.tracking_links for all
  using (public.is_admin());

create policy "Creators can view their own tracking links"
  on public.tracking_links for select
  using (creator_id = public.current_creator_id());

-- CLICKS Policies
create policy "Admins can view all clicks"
  on public.clicks for select
  using (public.is_admin());

create policy "Creators can view clicks attributed to their links"
  on public.clicks for select
  using (creator_id = public.current_creator_id());

-- ORDERS Policies
create policy "Admins can view and manage all orders"
  on public.orders for all
  using (public.is_admin());

create policy "Creators can view orders attributed to them"
  on public.orders for select
  using (creator_id = public.current_creator_id());

-- COMMISSIONS Policies
create policy "Admins can manage all commissions"
  on public.commissions for all
  using (public.is_admin());

create policy "Creators can view their own commissions"
  on public.commissions for select
  using (creator_id = public.current_creator_id());

-- PAYOUTS Policies
create policy "Admins can manage all payouts"
  on public.payouts for all
  using (public.is_admin());

create policy "Creators can view their own payouts"
  on public.payouts for select
  using (creator_id = public.current_creator_id());

-- TASKS Policies
create policy "Admins can manage all tasks"
  on public.tasks for all
  using (public.is_admin());

-- ACTIVITIES Policies
create policy "Admins can view all activities"
  on public.activities for select
  using (public.is_admin());

-- ====================================================================
-- End of Schema
-- ====================================================================

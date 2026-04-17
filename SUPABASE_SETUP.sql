-- Run this in your Supabase project:
-- Dashboard > SQL Editor > New query > paste this > Run

-- Invitations table
create table invitations (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  tier text not null default 'premium',
  partner1 text not null,
  partner2 text not null,
  date text,
  venue_name text,
  venue_city text,
  ceremony_time text,
  rsvp_deadline text,
  design text default 'classic-dark',
  client_email text,
  guests jsonb default '[]',
  created_at timestamptz default now()
);

-- RSVPs table
create table rsvps (
  id uuid default gen_random_uuid() primary key,
  invitation_slug text not null references invitations(slug),
  guest_name text,
  attending boolean default true,
  guest_count integer default 1,
  dietary text,
  responded_at timestamptz default now()
);

-- Allow public read/write (for MVP — tighten later)
alter table invitations enable row level security;
alter table rsvps enable row level security;

create policy "Public can read invitations" on invitations for select using (true);
create policy "Public can insert invitations" on invitations for insert with check (true);
create policy "Public can read rsvps" on rsvps for select using (true);
create policy "Public can insert rsvps" on rsvps for insert with check (true);

-- Enable realtime for live dashboard updates
alter publication supabase_realtime add table rsvps;

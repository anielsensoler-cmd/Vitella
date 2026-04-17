# Vitella — Deployment Guide

## What this is
A complete MVP for Vitella: landing page, order form, animated invitation experience, and live RSVP dashboard.

---

## Step 1 — Set up Supabase (10 min)

1. Go to supabase.com and create a free account
2. Click "New project" — name it "vitella", pick any region, set a database password
3. Wait ~2 minutes for it to spin up
4. Go to **SQL Editor** in the left sidebar
5. Click "New query", paste the contents of `SUPABASE_SETUP.sql`, click **Run**
6. Go to **Settings > API** and copy:
   - Project URL (looks like `https://abcdefgh.supabase.co`)
   - anon public key (long string starting with `eyJ...`)

---

## Step 2 — Deploy to Vercel (10 min)

1. Go to github.com and create a free account if you don't have one
2. Create a new repository called "vitella" and upload all these files
3. Go to vercel.com, sign up with GitHub
4. Click "Add New Project" → import your vitella repo
5. Before clicking Deploy, click **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
   - `NEXT_PUBLIC_DASHBOARD_PASSWORD` → choose any password (e.g. vitella2024)
6. Click **Deploy**

Vercel will give you a URL like `vitella.vercel.app` — that's your live site!

---

## How to use it

**As you (the business owner):**
1. A client visits `yoursite.vercel.app` and sees the landing page + demo
2. They click "Create your invitation" and fill in the form
3. They get their unique link instantly, e.g. `yoursite.vercel.app/i/gon-anna-x7k2p`
4. They see their dashboard at `yoursite.vercel.app/dashboard?slug=gon-anna-x7k2p`

**As the client:**
1. Copy the personalised link for each guest: `yoursite.vercel.app/i/gon-anna-x7k2p?guest=Borja`
2. Paste into WhatsApp, email, or SMS
3. Watch RSVPs come in live on the dashboard

**As the guest:**
1. Opens the link on any device — no app needed
2. Taps the wax seal → envelope opens → confetti → invitation card
3. Hits RSVP → their response is saved instantly to your dashboard

---

## Pages

| URL | What it is |
|-----|-----------|
| `/` | Landing page with demo and pricing |
| `/order` | Order form — clients fill in their details |
| `/i/[slug]` | The invitation (add `?guest=Name` to personalise) |
| `/dashboard?slug=[slug]` | Live RSVP dashboard (password protected) |

---

## Dashboard password
Default: `vitella2024` — change it in Vercel environment variables anytime.

---

## Next steps (after MVP)
- Add Stripe checkout before the order form
- Add email notifications when someone RSVPs (via Resend)
- Buy vitella.io and connect it in Vercel settings
- Add more design templates

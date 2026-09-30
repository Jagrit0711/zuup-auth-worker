-- ==============================================================================
-- Zuup Auth & Payments Super Admin Schema Migration
-- Run this in Supabase SQL Editor to initialize tables, indexes, and SQL executor.
-- ==============================================================================

-- 1. Payments Table (All completed/attempted Razorpay transactions)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    payment_id TEXT,
    order_id TEXT,
    session_id TEXT,
    amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created',
    customer_email TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    client_name TEXT DEFAULT 'Zuup Ecosystem',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON public.payments(customer_email);

-- 2. Payment Links Table (Generated on dash.auth.zuup.dev)
CREATE TABLE IF NOT EXISTS public.payment_links (
    id TEXT PRIMARY KEY,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    description TEXT,
    customer_email TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    short_url TEXT,
    status TEXT NOT NULL DEFAULT 'created',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_links_created_at ON public.payment_links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON public.payment_links(status);

-- 3. Security & Auth Audit Logs Table (Which sites called auth, what time, what action, IP, country)
CREATE TABLE IF NOT EXISTS public.auth_audit_logs (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    app_origin TEXT,
    action TEXT NOT NULL,
    user_email TEXT,
    ip_address TEXT,
    country TEXT,
    status TEXT NOT NULL DEFAULT 'success',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_client ON public.auth_audit_logs(client_name);
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_created_at ON public.auth_audit_logs(created_at DESC);

-- 4. Identity & MeriPehchaan / DigiLocker KYC Verifications Table
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    client_name TEXT DEFAULT 'Zuup Ecosystem',
    aadhaar_name TEXT,
    aadhaar_masked TEXT,
    dob TEXT,
    gender TEXT,
    status TEXT NOT NULL DEFAULT 'verified',
    verified_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON public.kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_verified_at ON public.kyc_verifications(verified_at DESC);

-- 5. Enable Row Level Security (RLS) & Policies for Service Role
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- Allow Service Role full access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Service role full access payments" ON public.payments;
    CREATE POLICY "Service role full access payments" ON public.payments FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access payment_links" ON public.payment_links;
    CREATE POLICY "Service role full access payment_links" ON public.payment_links FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access auth_audit_logs" ON public.auth_audit_logs;
    CREATE POLICY "Service role full access auth_audit_logs" ON public.auth_audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access kyc_verifications" ON public.kyc_verifications;
    CREATE POLICY "Service role full access kyc_verifications" ON public.kyc_verifications FOR ALL TO service_role USING (true) WITH CHECK (true);
END $$;

-- 6. Direct SQL Execution Helper RPC (Allows dash.auth.zuup.dev to execute SQL directly from the Console)
CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result json;
BEGIN
    EXECUTE 'SELECT coalesce(json_agg(t), ''[]''::json) FROM (' || query || ') t' INTO result;
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM, 'detail', SQLSTATE);
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;

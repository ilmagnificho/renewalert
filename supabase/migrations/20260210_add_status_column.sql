-- Add status column to contracts table
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Update existing rows to have active status if null
UPDATE public.contracts 
SET status = 'active' 
WHERE status IS NULL;

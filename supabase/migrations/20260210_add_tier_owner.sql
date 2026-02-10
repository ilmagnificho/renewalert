-- Add tier and owner_name columns to existing contracts table
ALTER TABLE contracts ADD COLUMN tier text DEFAULT '';
ALTER TABLE contracts ADD COLUMN owner_name text DEFAULT '';

-- Update existing rows (optional, just to avoid nulls if needed, though default '' handles it)
UPDATE contracts SET tier = '' WHERE tier IS NULL;
UPDATE contracts SET owner_name = '' WHERE owner_name IS NULL;

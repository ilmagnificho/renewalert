ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS decision_status VARCHAR(20)
CHECK (decision_status IN ('kept', 'terminated'));

ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS decision_date TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_contracts_decision_status
ON public.contracts(decision_status);

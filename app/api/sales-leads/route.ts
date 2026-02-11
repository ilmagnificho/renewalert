import { NextResponse } from 'next/server';

interface SalesLeadPayload {
  eventType?: string;
  source?: string;
  lead?: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };
}

export async function POST(request: Request) {
  let payload: SalesLeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const name = payload.lead?.name?.trim();
  const email = payload.lead?.email?.trim();
  const company = payload.lead?.company?.trim();
  const message = payload.lead?.message?.trim() || '';

  if (!name || !email || !company) {
    return NextResponse.json({ error: 'name, email, company are required' }, { status: 400 });
  }

  const trackedEvent = {
    eventType: payload.eventType || 'sales_consultation_requested',
    source: payload.source || 'landing_consultation_form',
    occurredAt: new Date().toISOString(),
    lead: {
      name,
      email,
      company,
      message,
    },
  };

  const webhookUrl = process.env.SALES_PIPELINE_WEBHOOK_URL;

  if (webhookUrl) {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackedEvent),
      cache: 'no-store',
    });

    if (!webhookResponse.ok) {
      return NextResponse.json({ error: 'Failed to forward to sales pipeline' }, { status: 502 });
    }
  } else {
    console.info('[sales-leads] SALES_PIPELINE_WEBHOOK_URL is not set. Event payload:', trackedEvent);
  }

  return NextResponse.json({ ok: true });
}

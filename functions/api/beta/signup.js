export async function onRequestPost(context) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = context.env;

  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { name, email, source } = body;
  if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
    return jsonResponse({ error: 'Name and email are required' }, 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonResponse({ error: 'Invalid email address' }, 400);
  }

  const signup = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    source: source || 'beta-page',
    created_at: new Date().toISOString(),
  };

  // Salva no KV se disponível
  let savedId = null;
  try {
    if (context.env.BETA_SIGNUPS) {
      savedId = crypto.randomUUID();
      await context.env.BETA_SIGNUPS.put(savedId, JSON.stringify(signup));
    }
  } catch (e) {
    console.error('KV save failed:', e);
  }

  // Envia email de confirmação via Resend
  let emailSent = false;
  if (RESEND_API_KEY && RESEND_FROM_EMAIL) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Devotion.Run <${RESEND_FROM_EMAIL}>`,
          to: signup.email,
          subject: 'Você entrou na lista beta do Devotion.Run',
          html: betaEmailHtml(signup.name),
          text: betaEmailText(signup.name),
        }),
      });
      emailSent = resendRes.ok;
      if (!resendRes.ok) {
        const err = await resendRes.text();
        console.error('Resend error:', err);
      }
    } catch (e) {
      console.error('Resend request failed:', e);
    }
  }

  return jsonResponse({
    success: true,
    id: savedId,
    email_sent: emailSent,
  }, 201);
}

function betaEmailHtml(name) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; color: #0A0A0A;">
      <h1 style="font-family: Georgia, serif; font-size: 24px;">Bem-vindo à lista beta, ${name}.</h1>
      <p>Obrigado por se inscrever no Devotion.Run.</p>
      <p>Em breve você receberá um convite para testar o app antes de todo mundo.</p>
      <p style="margin-top: 24px; color: #6B6B6B; font-size: 14px;">
        Devotion.Run — Corra com propósito. Corra com Deus.
      </p>
    </div>
  `;
}

function betaEmailText(name) {
  return `Bem-vindo à lista beta, ${name}.\n\nObrigado por se inscrever no Devotion.Run. Em breve você receberá um convite para testar o app antes de todo mundo.\n\nDevotion.Run — Corra com propósito. Corra com Deus.`;
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

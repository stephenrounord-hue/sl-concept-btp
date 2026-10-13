const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (b.siteweb) return res.status(200).json({ ok: true }); // anti-spam
  const nom = String(b.nom || '').trim().slice(0, 120), tel = String(b.tel || '').trim().slice(0, 40);
  if (!nom || !tel) return res.status(400).json({ ok: false });
  const email = String(b.email || '').trim().slice(0, 160);
  const rows = [['Nom', nom], ['Téléphone', tel], ['E-mail', email], ['Commune', b.commune], ['Type de projet', b.type],
    ['Estimation du site', b.estimation], ['Projet', b.msg]].filter(r => r[1]);
  const html = '<h2>Nouvelle demande de devis</h2><table cellpadding="6" style="border-collapse:collapse;font-family:Arial">' +
    rows.map(r => `<tr><td style="color:#555"><b>${esc(r[0])}</b></td><td>${esc(String(r[1]).slice(0, 3000)).replace(/\n/g, '<br>')}</td></tr>`).join('') +
    '</table><p><a href="tel:' + esc(tel.replace(/\s/g, '')) + '">Rappeler ' + esc(tel) + '</a></p>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Site SL CONCEPT BTP <devis@slconceptbtp.pro>',
      to: ['SLconcept-btp@outlook.com'],
      reply_to: /^\S+@\S+\.\S+$/.test(email) ? email : undefined,
      subject: 'Demande de devis — ' + String(b.type || 'projet').slice(0, 80) + ' — ' + nom,
      html
    })
  });
  if (!r.ok) return res.status(502).json({ ok: false });
  res.status(200).json({ ok: true });
};

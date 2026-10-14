const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false });
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const tel = String(b.tel || '').trim().slice(0, 40), nom = String(b.nom || '').trim().slice(0, 80);
    const creneau = ['Matin', 'Après-midi', 'Peu importe'].includes(b.creneau) ? b.creneau : 'Peu importe';
    if (!/^[+\d][\d\s.\-]{7,}$/.test(tel)) return res.status(400).json({ ok: false });
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Site SL CONCEPT BTP <devis@slconceptbtp.pro>', to: ['SLconcept-btp@outlook.com'],
        subject: '📞 À rappeler (' + creneau + ') — ' + (nom || tel),
        html: `<h2>Demande de rappel</h2><p style="font-size:18px"><b>${esc(nom || 'Client')}</b><br>
<a href="tel:${esc(tel.replace(/[\s.\-]/g, ''))}">${esc(tel)}</a><br>Créneau souhaité : <b>${esc(creneau)}</b></p>
<p style="color:#666">Envoyé depuis le bouton « Être rappelé » du site.</p>`
      })
    });
    if (!r.ok) { console.error('resend', r.status, await r.text()); return res.status(502).json({ ok: false }); }
    res.status(200).json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ ok: false }); }
};

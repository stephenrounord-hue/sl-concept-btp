const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false });
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const nom = String(b.nom || '').trim().slice(0, 80), commune = String(b.commune || '').trim().slice(0, 80);
    const texte = String(b.texte || '').trim().slice(0, 1500), note = Math.round(Number(b.note));
    if (!nom || texte.length < 10 || !(note >= 1 && note <= 5)) return res.status(400).json({ ok: false });
    const html = '<h2>Nouvel avis client à valider</h2><p style="font-size:22px;color:#e0a800">' + '★'.repeat(note) + '☆'.repeat(5 - note) +
      ' (' + note + '/5)</p><p><b>' + esc(nom) + '</b>' + (commune ? ' — ' + esc(commune) : '') + '</p><blockquote style="border-left:4px solid #8BD147;padding-left:12px">' +
      esc(texte).replace(/\n/g, '<br>') + '</blockquote><p style="color:#666">Pour le publier sur le site, répondez simplement « publie cet avis » dans la conversation avec Claude.</p>';
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Site SL CONCEPT BTP <devis@slconceptbtp.pro>', to: ['SLconcept-btp@outlook.com'],
        subject: 'Nouvel avis ' + note + '/5 — ' + nom, html,
        text: 'Nouvel avis ' + note + '/5\n' + nom + (commune ? ' — ' + commune : '') + '\n\n' + texte })
    });
    if (!r.ok) { console.error('resend', r.status, await r.text()); return res.status(502).json({ ok: false }); }
    res.status(200).json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ ok: false }); }
};

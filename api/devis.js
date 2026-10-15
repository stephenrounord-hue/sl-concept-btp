const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FROM = 'SL CONCEPT BTP <devis@slconceptbtp.pro>';
const send = body => fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});
module.exports = async (req, res) => {
 try {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const nom = String(b.nom || '').trim().slice(0, 120), tel = String(b.tel || '').trim().slice(0, 40);
  if (!nom || !tel) return res.status(400).json({ ok: false });
  const email = String(b.email || '').trim().slice(0, 160);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // photos jointes (max 3, déjà compressées côté navigateur)
  const photos = (Array.isArray(b.photos) ? b.photos : []).slice(0, 3)
    .filter(p => p && typeof p.data === 'string' && /^[A-Za-z0-9+/=]+$/.test(p.data) && p.data.length < 1500000)
    .map((p, i) => ({ filename: 'photo-' + (i + 1) + '.jpg', content: p.data }));
  const rows = [['Nom', nom], ['Téléphone', tel], ['E-mail', email], ['Commune', b.commune], ['Type de projet', b.type],
    ['Estimation du site', b.estimation], ['Projet', b.msg], ['Photos jointes', photos.length ? photos.length + ' photo(s) en pièce jointe' : '']].filter(r => r[1]);
  const html = '<h2>Nouvelle demande de devis</h2><table cellpadding="6" style="border-collapse:collapse;font-family:Arial">' +
    rows.map(r => `<tr><td style="color:#555"><b>${esc(r[0])}</b></td><td>${esc(String(r[1]).slice(0, 3000)).replace(/\n/g, '<br>')}</td></tr>`).join('') +
    '</table><p><a href="tel:' + esc(tel.replace(/\s/g, '')) + '">Rappeler ' + esc(tel) + '</a></p>';
  const r = await send({
    from: 'Site SL CONCEPT BTP <devis@slconceptbtp.pro>', to: ['SLconcept-btp@outlook.com'],
    reply_to: emailOk ? email : undefined,
    subject: 'Demande de devis — ' + String(b.type || 'projet').slice(0, 80) + ' — ' + nom,
    html, text: 'Nouvelle demande de devis\n\n' + rows.map(r => r[0] + ' : ' + String(r[1]).slice(0, 3000)).join('\n'),
    attachments: photos.length ? photos : undefined
  });
  if (!r.ok) { console.error('resend', r.status, await r.text()); return res.status(502).json({ ok: false }); }
  // accusé de réception au client (ne bloque pas la réponse en cas d'échec)
  if (emailOk) {
    const prenom = esc(nom.split(' ')[0]);
    const ar = await send({
      from: FROM, to: [email], reply_to: 'SLconcept-btp@outlook.com',
      subject: 'Nous avons bien reçu votre demande — SL CONCEPT BTP',
      text: 'Bonjour ' + nom.split(' ')[0] + ',\n\nMerci pour votre demande de devis. Nous l\'avons bien reçue et nous vous rappelons sous 72 h.\n\nPour toute question : 0690 27 09 77 ou en répondant à cet e-mail.\n\nCordialement,\nSL CONCEPT BTP\nChemin de la Manioquerie, 97116 Pointe-Noire\nwww.slconceptbtp.pro',
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1B2620;line-height:1.55">
<p>Bonjour ${prenom},</p>
<p>Merci pour votre demande de devis${b.type ? ' (' + esc(String(b.type).slice(0, 80)) + ')' : ''}. Nous l'avons bien reçue et nous vous rappelons <b>sous 72 h</b> pour en parler et organiser la visite technique.</p>
<p>Pour toute question : <a href="tel:+590690270977">0690 27 09 77</a> ou en répondant à cet e-mail.</p>
<p>Cordialement,<br><b>SL CONCEPT BTP</b><br>Chemin de la Manioquerie, 97116 Pointe-Noire<br><a href="https://www.slconceptbtp.pro">www.slconceptbtp.pro</a></p>
<p style="color:#888;font-size:12px">Vous recevez ce message car vous avez rempli le formulaire de devis sur slconceptbtp.pro.</p></div>`
    });
    if (!ar.ok) console.error('accuse', ar.status, await ar.text());
  }
  res.status(200).json({ ok: true });
 } catch (e) { console.error(e); res.status(500).json({ ok: false }); }
};

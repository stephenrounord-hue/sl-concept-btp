/* Bouton « Être rappelé » + fenêtre de bienvenue — SL CONCEPT BTP */
(function(){
var css='.rp-fond{position:fixed;inset:0;background:rgba(16,30,22,.55);z-index:200;display:none;align-items:center;justify-content:center;padding:16px}'+
'.rp-fond.ouvert{display:flex}.rp-boite{background:#fff;border-radius:8px;max-width:380px;width:100%;padding:1.6rem;position:relative;box-shadow:0 20px 50px rgba(0,0,0,.3);border-top:5px solid var(--lime,#A8CC5B)}'+
'.rp-boite h3{font-family:"Fira Sans Condensed",sans-serif;font-size:1.5rem;margin:0 0 .3rem;color:var(--vert-nuit,#1F4A34)}.rp-boite p{margin:0 0 1rem;color:#5C6A63;font-size:.95rem}'+
'.rp-boite label{display:block;font-weight:600;font-size:.9rem;margin:.6rem 0 .3rem;color:#1B2620}.rp-boite input{width:100%;box-sizing:border-box;padding:.7rem .8rem;border:1px solid #DCE2D8;border-radius:4px;font:inherit;color:#1B2620;background:#fff}'+
'.rp-cren{display:flex;gap:.4rem}.rp-cren button{flex:1;padding:.6rem .3rem;border:2px solid #DCE2D8;background:#fff;border-radius:4px;font:600 .9rem "Fira Sans",sans-serif;cursor:pointer;color:#1B2620}'+
'.rp-cren button.on{border-color:var(--vert,#4C8B33);background:#EEF5E6;color:var(--vert-nuit,#1F4A34)}'+
'.rp-envoi{width:100%;margin-top:1.1rem;padding:.85rem;border:0;border-radius:4px;background:var(--vert,#4C8B33);color:#fff;font:700 1.05rem "Fira Sans Condensed",sans-serif;cursor:pointer}'+
'.rp-x{position:absolute;top:.5rem;right:.7rem;background:none;border:0;font-size:1.6rem;line-height:1;cursor:pointer;color:#5C6A63}.rp-msg{margin-top:.7rem;font-size:.9rem;color:#1F4A34}'+
'.bv{position:fixed;left:16px;bottom:16px;z-index:150;max-width:300px;background:#fff;border-radius:8px;box-shadow:0 12px 34px rgba(0,0,0,.22);border-left:5px solid var(--lime,#A8CC5B);padding:1rem 2.2rem 1rem 1.1rem;transform:translateY(140%);transition:transform .45s}'+
'.bv.vu{transform:none}.bv b{display:block;font-family:"Fira Sans Condensed",sans-serif;font-size:1.15rem;color:var(--vert-nuit,#1F4A34)}.bv span{display:block;font-size:.88rem;color:#5C6A63;margin:.2rem 0 .7rem}'+
'.bv a{display:inline-block;background:var(--lime,#A8CC5B);color:var(--vert-nuit,#1F4A34);font:700 .95rem "Fira Sans Condensed",sans-serif;text-decoration:none;padding:.5rem .9rem;border-radius:4px}'+
'.bv .rp-x{top:.3rem;right:.5rem;font-size:1.3rem}@media(max-width:700px){.bv{left:10px;right:10px;max-width:none;bottom:84px}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
document.body.insertAdjacentHTML('beforeend',
'<div class="rp-fond" id="rpFond" role="dialog" aria-modal="true" aria-labelledby="rpTitre"><form class="rp-boite" id="rpForm">'+
'<button type="button" class="rp-x" id="rpX" aria-label="Fermer">×</button><h3 id="rpTitre">On vous rappelle</h3><p>Laissez votre numéro, nous vous appelons au moment qui vous arrange.</p>'+
'<label for="rpNom">Prénom <span style="font-weight:400;color:#888">(facultatif)</span></label><input id="rpNom" autocomplete="given-name" maxlength="80">'+
'<label for="rpTel">Téléphone</label><input id="rpTel" type="tel" required autocomplete="tel" placeholder="0690 00 00 00">'+
'<label>Créneau</label><div class="rp-cren" id="rpCren"><button type="button" data-c="Matin">Matin</button><button type="button" data-c="Après-midi">Après-midi</button><button type="button" class="on" data-c="Peu importe">Peu importe</button></div>'+
'<button class="rp-envoi" id="rpEnvoi" type="submit">Être rappelé</button><div class="rp-msg" id="rpMsg"></div></form></div>');
var fond=document.getElementById('rpFond'),cren='Peu importe';
function ouvrir(e){if(e)e.preventDefault();fond.classList.add('ouvert');setTimeout(function(){document.getElementById('rpTel').focus();},50);}
function fermer(){fond.classList.remove('ouvert');}
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-rappel]');if(t)ouvrir(e);});
document.getElementById('rpX').onclick=fermer;fond.addEventListener('click',function(e){if(e.target===fond)fermer();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')fermer();});
document.querySelectorAll('#rpCren button').forEach(function(b){b.onclick=function(){document.querySelectorAll('#rpCren button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');cren=b.dataset.c;};});
document.getElementById('rpForm').addEventListener('submit',function(e){e.preventDefault();
  var tel=document.getElementById('rpTel').value.trim(),msg=document.getElementById('rpMsg'),bt=document.getElementById('rpEnvoi');
  if(tel.replace(/\D/g,'').length<9){msg.textContent='Merci d’indiquer un numéro valide.';return;}
  bt.disabled=true;bt.textContent='Envoi…';
  fetch('/api/rappel',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tel:tel,nom:document.getElementById('rpNom').value.trim(),creneau:cren})})
  .then(function(r){if(!r.ok)throw 0;msg.innerHTML='<b>C’est noté !</b> Nous vous rappelons très vite.';bt.textContent='Demande envoyée ✓';})
  .catch(function(){bt.disabled=false;bt.textContent='Être rappelé';msg.innerHTML='L’envoi a échoué. Appelez-nous au <a href="tel:+590690270977">0690 27 09 77</a>.';});
});
if(location.hash==='#rappel')ouvrir();
/* Fenêtre de bienvenue : page d'accueil seulement, une seule fois */
var budget=document.getElementById('budget');if(!budget)return;
var deja=false;try{deja=localStorage.getItem('slc_bienvenue')==='1';}catch(e){}
if(deja)return;
setTimeout(function(){
  var r=budget.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)return; /* déjà sur l'estimateur */
  if(fond.classList.contains('ouvert'))return;
  try{localStorage.setItem('slc_bienvenue','1');}catch(e){}
  document.body.insertAdjacentHTML('beforeend','<div class="bv" id="bv" role="status"><button type="button" class="rp-x" aria-label="Fermer">×</button><b>Votre budget en 30 secondes</b><span>Estimez votre projet gratuitement, sans engagement.</span><a href="#budget">Estimer mon projet</a></div>');
  var bv=document.getElementById('bv');requestAnimationFrame(function(){requestAnimationFrame(function(){bv.classList.add('vu');});});
  function cacher(){bv.classList.remove('vu');setTimeout(function(){bv.remove();},500);}
  bv.querySelector('.rp-x').onclick=cacher;bv.querySelector('a').addEventListener('click',cacher);
  setTimeout(cacher,15000);
},20000);
})();

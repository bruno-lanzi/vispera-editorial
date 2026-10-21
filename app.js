'use strict';
const $ = (selector) => document.querySelector(selector);
const cfg = INVITACION;
const eventDate = new Date(cfg.fecha);
const dateLabel = new Intl.DateTimeFormat('es-AR', {day:'numeric', month:'long', year:'numeric', timeZone:'America/Argentina/Buenos_Aires'}).format(eventDate);
document.querySelectorAll('[data-date]').forEach(el => el.textContent = dateLabel);
document.querySelectorAll('[data-couple]').forEach(el => el.textContent = cfg.nombres);
document.title = `${cfg.nombres} · Víspera`;
const names = cfg.nombres.split('&');
$('#hero-title').replaceChildren(document.createTextNode(names[0].trim()+' '));
if (names.length > 1) { const amp=document.createElement('i'); amp.textContent='&'; $('#hero-title').append(amp,document.createTextNode(' '+names.slice(1).join('&').trim())); }
$('#ceremony-time').textContent=cfg.ceremoniaHora;
$('#party-time').textContent=cfg.fiestaHora;
$('#ceremony-place').textContent=cfg.ceremoniaLugar;
$('#party-place').textContent=cfg.fiestaLugar;
$('.map-caption p').textContent=(cfg.demo?'Ubicación ilustrativa · ':'')+cfg.ubicacion;
if(!cfg.demo){$('.edition').textContent='LA EMOCIÓN EMPIEZA ANTES';$('footer .micro').textContent='Diseñado por Víspera Invitaciones';}
const iso = (date) => new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
$('#calendar').href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({action:'TEMPLATE',text:`Casamiento de ${cfg.nombres}`,dates:`${iso(cfg.fecha)}/${iso(cfg.fin)}`,details:cfg.demo?'Invitación de muestra de Víspera. Evento ficticio.':'¡Te esperamos para celebrar!',location:cfg.ubicacion,ctz:'America/Argentina/Buenos_Aires'});
$('#directions').href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(cfg.ubicacion);
function tick(){const diff=Math.max(0,eventDate.getTime()-Date.now());const total=Math.floor(diff/1000);const values=[Math.floor(total/86400),Math.floor(total/3600)%24,Math.floor(total/60)%60,total%60];['days','hours','minutes','seconds'].forEach((id,i)=>{const el=$('#'+id),value=String(values[i]).padStart(2,'0');if(el.textContent!==value){el.textContent=value;el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');}});if(diff===0)$('#count-status').textContent='¡Llegó el día de celebrar!';}tick();setInterval(tick,1000);
const audio=$('#music');audio.volume=.25;
function syncMusic(){const playing=!audio.paused;$('#music-button').setAttribute('aria-pressed',String(playing));$('#music-button').setAttribute('aria-label',playing?'Pausar música':'Reproducir música');$('#music-button span').textContent=playing?'Pausar':'Música';}
audio.addEventListener('play',syncMusic);audio.addEventListener('pause',syncMusic);
async function playMusic(){try{await audio.play();$('#audio-status').textContent='';}catch{$('#audio-status').textContent='Tocá Música para activar el sonido.';}syncMusic();}
$('#music-button').addEventListener('click',()=>audio.paused?playMusic():audio.pause());
const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:.1}):null;
$('#open').addEventListener('click',()=>{$('#invitation').hidden=false;$('#inicio').hidden=true;$('#music-button').hidden=false;$('#map').src='https://maps.google.com/maps?q='+encodeURIComponent(cfg.ubicacion)+'&z=13&output=embed';if(observer)document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('pending');observer.observe(el);});$('#hero-title').setAttribute('tabindex','-1');$('#hero-title').focus({preventScroll:true});window.scrollTo(0,0);playMusic();});
function replay(){audio.pause();$('#invitation').hidden=true;$('#inicio').hidden=false;$('#music-button').hidden=true;$('#audio-status').textContent='';$('#open').focus({preventScroll:true});window.scrollTo(0,0);}
$('#replay').addEventListener('click',replay);
document.querySelectorAll('a[href="#inicio"]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();replay();}));
$('#rsvp-form').addEventListener('submit',event=>{event.preventDefault();const name=$('#guest').value.trim();if(!name){$('#guest').setCustomValidity('Escribí tu nombre.');$('#guest').reportValidity();return;}const attendance=$('#attendance').value==='yes'?'¡Confirmo mi asistencia!':'Esta vez no voy a poder acompañarlos.';const message=`Hola, ${cfg.nombres}. Soy ${name}. ${attendance} Gracias por invitarme a su casamiento del ${dateLabel}.`;if(cfg.demo||!/^\d{8,15}$/.test(cfg.whatsapp)){$('#demo-message').hidden=false;$('#demo-message').textContent='Vista previa de la confirmación (demo):\n\n'+message+'\n\nEsta muestra no envía mensajes. Para activarla, configurá el número del organizador y desactivá el modo demo.';return;}window.location.href='https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent(message);});
$('#guest').addEventListener('input',()=>$('#guest').setCustomValidity(''));

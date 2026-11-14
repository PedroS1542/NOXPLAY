(()=>{'use strict';
const cfg=window.NOXPLAY_CONFIG||{};const entry=document.getElementById('adminEntry');
const adminMode=new URLSearchParams(location.search).has('admin');
if(adminMode) localStorage.setItem('noxplay_admin_shortcut','1');
const shortcutEnabled=localStorage.getItem('noxplay_admin_shortcut')==='1';
if(shortcutEnabled && entry) entry.style.display='';
window.removeAdminShortcut=()=>{localStorage.removeItem('noxplay_admin_shortcut');if(entry) entry.style.display='none';};
if(!cfg.url||!cfg.publishableKey||!window.supabase){
  console.error('NOXPLAY: conexão com Supabase indisponível.');
  window.openAdmin=()=>toast('Não foi possível conectar ao Supabase. Verifique sua conexão.');
  return;
}
const db=window.supabase.createClient(cfg.url,cfg.publishableKey);
let isAdmin=false;
const originalRender=render;
const originalEdit=editContent;
function normalized(row){return {...row.data,id:row.id};}
async function reload(){const {data,error}=await db.from('titles').select('id,data').order('created_at',{ascending:false});if(error){console.error(error);toast('Erro ao carregar catálogo: '+error.message);return;}items=(data||[]).map(normalized);render();}
async function checkAdmin(){const {data:{user}}=await db.auth.getUser();if(!user){isAdmin=false;return false;}const {data,error}=await db.from('admins').select('user_id').eq('user_id',user.id).maybeSingle();isAdmin=!!data&&!error;return isAdmin;}
window.openAdmin=async()=>{if(await checkAdmin()){renderAdminList();show('adminModal');return;}show('loginModal');};
document.getElementById('adminLogin').onsubmit=async e=>{e.preventDefault();const msg=document.getElementById('loginError');msg.textContent='Autenticando...';const {error}=await db.auth.signInWithPassword({email:document.getElementById('loginEmail').value,password:document.getElementById('loginPassword').value});if(error){msg.textContent='Não foi possível entrar: '+error.message;return;}if(!(await checkAdmin())){await db.auth.signOut();msg.textContent='Esta conta não possui permissão de administrador.';return;}msg.textContent='';hide('loginModal');show('adminModal');renderAdminList();};
function srtToVtt(text){let x=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();if(!/^WEBVTT\b/.test(x))x='WEBVTT\n\n'+x.replace(/(\d\d:\d\d:\d\d),(\d{3})/g,'$1.$2');return x+'\n';}
async function uploadSub(id,field,inputId,statusId,old){const input=document.getElementById(inputId),f=input.files?.[0];if(!f)return old||'';if(!/\.(srt|vtt)$/i.test(f.name))throw Error('Selecione uma legenda .srt ou .vtt');if(f.size>2*1024*1024)throw Error('Legenda maior que 2 MB');document.getElementById(statusId).textContent='Enviando legenda...';const text=srtToVtt(await f.text());const path=`${id}/${field}-${crypto.randomUUID()}.vtt`;const {error}=await db.storage.from('subtitles').upload(path,new Blob([text],{type:'text/vtt;charset=utf-8'}),{contentType:'text/vtt;charset=utf-8',upsert:false});if(error)throw error;const {data}=db.storage.from('subtitles').getPublicUrl(path);document.getElementById(statusId).textContent='Legenda enviada com sucesso';return data.publicUrl;}
window.saveContent=async e=>{e.preventDefault();if(!(await checkAdmin())){toast('Acesso negado');return;}const button=e.submitter;if(button)button.disabled=true;const id=editId||crypto.randomUUID();try{const data={title:document.getElementById('fTitle').value.trim(),type:document.getElementById('fType').value,year:document.getElementById('fYear').value.trim(),genre:document.getElementById('fGenre').value,description:document.getElementById('fDesc').value.trim(),video:document.getElementById('fVideo').value.trim(),cover:document.getElementById('fCover').value.trim(),banner:document.getElementById('fBanner').value.trim(),featured:document.getElementById('fFeatured').checked,episodes:document.getElementById('fEpisodes').value.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>{const p=s.split('|');return {title:p[0].trim(),url:p.slice(1).join('|').trim()}})};
 Object.assign(data,v11Read());
 data.forced=await uploadSub(id,'forced','uploadForced','forcedStatus',document.getElementById('fForced').value.trim());data.full=await uploadSub(id,'full','uploadFull','fullStatus',document.getElementById('fFull').value.trim());
 const {error}=await db.from('titles').upsert({id,data});if(error)throw error;resetForm();document.getElementById('uploadForced').value='';document.getElementById('uploadFull').value='';await reload();toast('Publicado para todos os visitantes!');}catch(err){console.error(err);toast('Erro: '+err.message);}finally{if(button)button.disabled=false;}};
window.deleteContent=async id=>{if(!(await checkAdmin()))return;if(!confirm('Excluir este título do catálogo público?'))return;const {error}=await db.from('titles').delete().eq('id',id);if(error)toast('Erro: '+error.message);else{await reload();toast('Título excluído');}};
window.editContent=id=>{originalEdit(id);v11Write(items.find(i=>i.id===id));document.getElementById('forcedStatus').textContent='Arquivo atual mantido se você não selecionar outro.';document.getElementById('fullStatus').textContent='Arquivo atual mantido se você não selecionar outro.';};
// Nunca permitir que o armazenamento local antigo substitua o catálogo público.
reload();
})();
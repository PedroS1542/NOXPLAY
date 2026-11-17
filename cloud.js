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
window.nox48UploadPreview=async(file)=>{
 if(!(await checkAdmin()))throw new Error('Faça login como administrador para enviar vídeos.');
 if(!file||file.size>50*1024*1024)throw new Error('O arquivo deve ter no máximo 50 MB.');
 const path='previews/'+crypto.randomUUID()+'.mp4';
 const {error}=await db.storage.from('noxplay-previews').upload(path,file,{contentType:'video/mp4',upsert:false,cacheControl:'3600'});
 if(error)throw error;
 const {data}=db.storage.from('noxplay-previews').getPublicUrl(path);
 if(!data?.publicUrl)throw new Error('Não foi possível gerar a URL pública.');
 return data.publicUrl;
};
window.openAdmin=async()=>{if(await checkAdmin()){renderAdminList();show('adminModal');return;}show('loginModal');};
document.getElementById('adminLogin').onsubmit=async e=>{e.preventDefault();const msg=document.getElementById('loginError');msg.textContent='Autenticando...';const {error}=await db.auth.signInWithPassword({email:document.getElementById('loginEmail').value,password:document.getElementById('loginPassword').value});if(error){msg.textContent='Não foi possível entrar: '+error.message;return;}if(!(await checkAdmin())){await db.auth.signOut();msg.textContent='Esta conta não possui permissão de administrador.';return;}msg.textContent='';hide('loginModal');show('adminModal');renderAdminList();};
window.saveContent=async e=>{e.preventDefault();if(!(await checkAdmin())){toast('Acesso negado');return;}const button=e.submitter;if(button)button.disabled=true;const id=editId||crypto.randomUUID();try{const data={title:document.getElementById('fTitle').value.trim(),type:document.getElementById('fType').value,year:document.getElementById('fYear').value.trim(),genre:document.getElementById('fGenre').value,description:document.getElementById('fDesc').value.trim(),video:document.getElementById('fVideo').value.trim(),cover:document.getElementById('fCover').value.trim(),banner:document.getElementById('fBanner').value.trim(),featured:document.getElementById('fFeatured').checked,episodes:document.getElementById('fEpisodes').value.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>{const p=s.split('|');return {title:p[0].trim(),url:p.slice(1).join('|').trim()}})};
 Object.assign(data,v11Read());
 Object.assign(data,typeof window.nox38GetClipConfig==='function'?window.nox38GetClipConfig():{});
 data.logo=typeof window.nox36GetLogo==='function'?window.nox36GetLogo():(items.find(x=>x.id===id)?.logo||'');
 data.filmVersions=typeof window.nox49GetVersions==='function'?window.nox49GetVersions():(items.find(x=>x.id===id)?.filmVersions||[]);
 const {error}=await db.from('titles').upsert({id,data});if(error)throw error;resetForm();await reload();toast('Publicado para todos os visitantes!');}catch(err){console.error(err);toast('Erro: '+err.message);}finally{if(button)button.disabled=false;}};
window.deleteContent=async id=>{if(!(await checkAdmin()))return;if(!confirm('Excluir este título do catálogo público?'))return;const {error}=await db.from('titles').delete().eq('id',id);if(error)toast('Erro: '+error.message);else{await reload();toast('Título excluído');}};
window.editContent=id=>{originalEdit(id);v11Write(items.find(i=>i.id===id));};

window.nox25RestoreCatalog=async function(records){
 if(!(await checkAdmin()))throw new Error('Entre com uma conta ADM autorizada.');
 if(!Array.isArray(records)||!records.length||records.length>3000)throw new Error('Backup vazio ou grande demais.');
 let done=0;
 for(let p=0;p<records.length;p+=25){
  const rows=records.slice(p,p+25).map(x=>({id:x.id,data:Object.fromEntries(Object.entries(x).filter(([k])=>k!=='id'))}));
  const {error}=await db.from('titles').upsert(rows,{onConflict:'id'});
  if(error)throw new Error('Importados '+done+' de '+records.length+'. '+error.message);
  done+=rows.length;
 }
 await reload();return done;
};
// Nunca permitir que o armazenamento local antigo substitua o catálogo público.
reload();
})();
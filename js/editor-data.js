(() => {
  'use strict';
  const FW = window.FolioWishStudio = window.FolioWishStudio || {};
  FW.STORAGE_KEY = 'foliowish-project-v1';
  FW.STORAGE_META_KEY = 'foliowish-project-v1-meta';
  FW.DB_NAME = 'foliowish-studio';
  FW.DB_STORE = 'projects';
  FW.DB_RECORD = 'current';
  FW.MAX_HISTORY = 30;
  FW.themes = {
    rose:{label:'Editorial Rose',accent:'#ee5c81',bg:'#fff3f5',soft:'#fbe3e9',ink:'#17151d'},
    night:{label:'Midnight Chic',accent:'#b7a4ff',bg:'#17151d',soft:'#2a2631',ink:'#ffffff'},
    editorial:{label:'Classic Editorial',accent:'#b4475d',bg:'#fbf5eb',soft:'#eee2d4',ink:'#18140f'},
    pop:{label:'Pop Collage',accent:'#7a42db',bg:'#f3e9ff',soft:'#e6d6ff',ink:'#211a29'},
    lavender:{label:'Lavender Dream',accent:'#7457e8',bg:'#f3efff',soft:'#e6defe',ink:'#221d31'},
    blue:{label:'Sky Journal',accent:'#2c6fb2',bg:'#edf6ff',soft:'#dcecff',ink:'#142234'},
    citrus:{label:'Citrus Club',accent:'#e36b2c',bg:'#fff6d2',soft:'#ffe6a6',ink:'#282018'},
    mono:{label:'Mono Modern',accent:'#171717',bg:'#f7f6f1',soft:'#e9e8e2',ink:'#171717'}
  };
  FW.pageTypes = [['cover','Cover'],['profile','Profile'],['reasons','Reasons'],['gallery','Photo story'],['letter','Letter'],['timeline','Timeline'],['playlist','Playlist'],['backcover','Back cover']];
  FW.uid = () => 'p'+Math.random().toString(36).slice(2,10);
  FW.esc = (v='') => String(v).replace(/[&<>'\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[m]));
  FW.clone = v => JSON.parse(JSON.stringify(v));
  FW.isValidProject = p => {
    if(!p||p.version!==1||!Array.isArray(p.pages)||!p.pages.length||!p.person||typeof p.person!=='object'||Array.isArray(p.person))return false;
    const zoom=Number(p.zoom);
    if(!Number.isInteger(p.active)||p.active<0||p.active>=p.pages.length||!Number.isFinite(zoom)||zoom<.35||zoom>1.05||!FW.themes[p.theme])return false;
    const text=v=>v==null||typeof v==='string',personFields=['name','age','relationship','vibe','memory'];
    if(!personFields.every(k=>text(p.person[k])))return false;
    const types=new Set(FW.pageTypes.map(([key])=>key)),safePhoto=/^data:image\/(?:jpeg|jpg|png|webp);base64,[a-z0-9+/=\r\n]+$/i;
    return p.pages.every(page=>{
      if(!page||typeof page!=='object'||Array.isArray(page)||!types.has(page.type))return false;
      if(page.photos!=null){if(typeof page.photos!=='object'||Array.isArray(page.photos))return false;for(const src of Object.values(page.photos))if(typeof src!=='string'||!safePhoto.test(src))return false;}
      if(page.type==='profile'&&page.facts!=null&&!Array.isArray(page.facts))return false;
      if(page.type==='reasons'&&page.reasons!=null&&!Array.isArray(page.reasons))return false;
      if(page.type==='playlist'&&page.tracks!=null&&!Array.isArray(page.tracks))return false;
      if(page.type==='timeline'&&page.items!=null&&(!Array.isArray(page.items)||!page.items.every(it=>Array.isArray(it)&&it.length>=2&&text(it[0])&&text(it[1]))))return false;
      return true;
    });
  };
  FW.defaultProject = {
    version:1,title:'Birthday Magazine',theme:'rose',active:0,zoom:.72,updatedAt:0,
    person:{name:'Sophia',age:'18',relationship:'Best friend',vibe:'warm',memory:'Late-night drives, terrible karaoke, and somehow always finding the best coffee.'},
    pages:[
      {id:FW.uid(),type:'cover',headline:'HAPPY BIRTHDAY',subline:'THE OFFICIAL BIRTHDAY ISSUE',bubble:'Best wishes, big love & a very good day.',side:'FRIENDS’ MESSAGES\nMEMORIES INSIDE',photos:{}},
      {id:FW.uid(),type:'profile',headline:'Meet the birthday star',quote:'The kind of person who makes ordinary days feel like stories worth keeping.',facts:['Always orders iced coffee','Laughs before the punchline','Plans the best spontaneous trips','Knows every lyric somehow'],photos:{}},
      {id:FW.uid(),type:'reasons',headline:'18 reasons you are amazing',reasons:['You make people feel included','You make us laugh at the worst times','You show up when it matters','You remember tiny details','You turn plans into adventures','You are honest without being cruel','You celebrate other people loudly','You make boring errands fun','You are brave in quiet ways','You know when to send the perfect meme','You listen properly','You make home feel portable','You recover from bad days','You care deeply','You keep growing','You make memories without trying','You are unmistakably yourself','We are lucky to know you'],photos:{}},
      {id:FW.uid(),type:'gallery',headline:'Proof we had the best time',note:'Somehow the blurry photos are always the best memories.',photos:{}},
      {id:FW.uid(),type:'timeline',headline:'A tiny timeline of us',items:[['Then','We met and immediately had too much to talk about.'],['That one summer','The era of late nights, chaotic plans and zero regrets.'],['The plot twist','We survived the thing we were sure would break us.'],['Now','Still here, still laughing, still collecting stories.']],photos:{}},
      {id:FW.uid(),type:'playlist',headline:'The soundtrack of this year',tracks:['The song that starts every road trip','The one we always scream in the car','Your current main-character song','The throwback we refuse to retire','The song that instantly feels like summer','The calm one for late-night thinking'],photos:{}},
      {id:FW.uid(),type:'letter',headline:'A letter for your next chapter',body:'Happy birthday.\n\nI hope this year gives you more of what feels like you: people who make you feel safe, work that makes you proud, small days that surprise you, and reasons to laugh until your stomach hurts.\n\nThank you for the memories we already have — and for all the ridiculous, beautiful ones still ahead.',sign:'With love, always',photos:{}},
      {id:FW.uid(),type:'backcover',headline:'Here’s to the next story.',body:'Keep the photos. Keep the jokes. Keep choosing the life that feels like yours.',photos:{}}
    ]
  };

  FW.setSaveState = (message,saved=false) => {
    const state=document.querySelector('#saveState'),button=document.querySelector('#saveBtn');
    if(state) state.textContent=message;
    if(button){ button.dataset.saved=saved?'true':'false'; button.textContent=saved?'Saved':'Save'; }
  };

  FW.loadProject = () => {
    try { const raw=localStorage.getItem(FW.STORAGE_KEY); if(raw){const p=JSON.parse(raw);if(FW.isValidProject(p))return p;} } catch {}
    return FW.clone(FW.defaultProject);
  };
  FW.project = FW.loadProject();
  FW.history=[JSON.stringify(FW.project)]; FW.historyIndex=0; FW.safeVisible=false; FW.pendingPhotoSlot=null;

  FW.openProjectDB = () => new Promise((resolve,reject) => {
    if(!('indexedDB' in window)){ reject(new Error('IndexedDB unavailable')); return; }
    const request=indexedDB.open(FW.DB_NAME,1);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(FW.DB_STORE))db.createObjectStore(FW.DB_STORE);};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('Could not open local database'));
  });
  FW.saveToIndexedDB = async value => {
    const db=await FW.openProjectDB();
    try{
      await new Promise((resolve,reject)=>{const tx=db.transaction(FW.DB_STORE,'readwrite');tx.objectStore(FW.DB_STORE).put(value,FW.DB_RECORD);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('Local database write failed'));tx.onabort=()=>reject(tx.error||new Error('Local database write aborted'));});
    }finally{db.close();}
  };
  FW.loadFromIndexedDB = async () => {
    const db=await FW.openProjectDB();
    try{
      return await new Promise((resolve,reject)=>{const tx=db.transaction(FW.DB_STORE,'readonly');const request=tx.objectStore(FW.DB_STORE).get(FW.DB_RECORD);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error||new Error('Local database read failed'));});
    }finally{db.close();}
  };
  FW.pushHistory = () => {
    const snap=JSON.stringify(FW.project);
    if(FW.history[FW.historyIndex]!==snap){FW.history=FW.history.slice(0,FW.historyIndex+1);FW.history.push(snap);if(FW.history.length>FW.MAX_HISTORY)FW.history.shift();FW.historyIndex=FW.history.length-1;}
  };
  FW.save = async (push=true,manual=false) => {
    if(push) FW.pushHistory();
    FW.project.updatedAt=Date.now();
    FW.setSaveState(manual?'Saving project…':'Saving…',false);
    let durable=false,fallback=false;
    try{await FW.saveToIndexedDB(FW.clone(FW.project));durable=true;}catch{}
    try{localStorage.setItem(FW.STORAGE_KEY,JSON.stringify(FW.project));fallback=true;}catch{}
    try{localStorage.setItem(FW.STORAGE_META_KEY,JSON.stringify({updatedAt:FW.project.updatedAt}));}catch{}
    if(durable||fallback){const time=new Date(FW.project.updatedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});FW.setSaveState(`Saved ${time}`,true);return true;}
    FW.setSaveState('Could not save — use Backup',false);
    if(manual) alert('This browser blocked local project storage. Use Backup to download a project file.');
    return false;
  };
  FW.hydrateFromStorage = async () => {
    try{
      const stored=await FW.loadFromIndexedDB();
      if(FW.isValidProject(stored)&&Number(stored.updatedAt||0)>Number(FW.project.updatedAt||0)){
        FW.project=stored;FW.history=[JSON.stringify(FW.project)];FW.historyIndex=0;FW.syncInputs?.();FW.renderAll?.(false);FW.setSaveState('Restored saved project',true);return true;
      }
    }catch{}
    return false;
  };
  FW.restoreHistory = i => { if(i<0||i>=FW.history.length)return;FW.historyIndex=i;FW.project=JSON.parse(FW.history[i]);FW.syncInputs?.();FW.renderAll?.(false);FW.save(false); };
})();
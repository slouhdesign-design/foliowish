(() => {
  'use strict';
  const FW = window.FolioWishStudio = window.FolioWishStudio || {};
  FW.STORAGE_KEY = 'foliowish-project-v1';
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
  FW.esc = (v='') => String(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  FW.clone = v => JSON.parse(JSON.stringify(v));
  FW.defaultProject = {
    version:1,title:'Birthday Magazine',theme:'rose',active:0,zoom:.72,
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
  FW.loadProject = () => {
    try { const raw=localStorage.getItem(FW.STORAGE_KEY); if(raw){const p=JSON.parse(raw);if(p?.version===1&&Array.isArray(p.pages))return p;} } catch {}
    return FW.clone(FW.defaultProject);
  };
  FW.project = FW.loadProject();
  FW.history=[JSON.stringify(FW.project)]; FW.historyIndex=0; FW.safeVisible=false; FW.pendingPhotoSlot=null;
  FW.save = (push=true) => {
    try { localStorage.setItem(FW.STORAGE_KEY,JSON.stringify(FW.project)); const s=document.querySelector('#saveState'); if(s)s.textContent='Saved locally'; }
    catch { const s=document.querySelector('#saveState'); if(s)s.textContent='Storage full — backup now'; }
    if(push){const snap=JSON.stringify(FW.project);if(FW.history[FW.historyIndex]!==snap){FW.history=FW.history.slice(0,FW.historyIndex+1);FW.history.push(snap);if(FW.history.length>FW.MAX_HISTORY)FW.history.shift();FW.historyIndex=FW.history.length-1;}}
  };
  FW.restoreHistory = i => { if(i<0||i>=FW.history.length)return;FW.historyIndex=i;FW.project=JSON.parse(FW.history[i]);FW.syncInputs?.();FW.renderAll?.(false);FW.save(false); };
})();

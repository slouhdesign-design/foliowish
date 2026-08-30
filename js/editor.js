(() => {
  'use strict';
  // Entry point kept deliberately small. The privacy-first studio uses localStorage,
  // client-side image compression and browser window.print() through the modules loaded before this file.
  const boot = () => {
    const studio = window.FolioWishStudio;
    if (!studio || typeof studio.boot !== 'function') {
      document.body.innerHTML = '<main style="padding:40px;font-family:system-ui"><h1>Studio could not start.</h1><p>Please refresh the page. No project data was sent anywhere.</p></main>';
      return;
    }
    studio.boot();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();

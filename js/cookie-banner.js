(function () {
  const GA_ID = 'G-2VNZL38E0F'; // <-- Replace with your GA4 Measurement ID
  const LS_KEY = 'site_cookie_consent';
  const defaultConsent = { necessary: true, analytics: false, marketing: false, timestamp: null };

  function nowISO(){ return new Date().toISOString(); }
  function readConsent(){ try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch(e){ return null; } }
  function saveConsent(obj){ obj.timestamp = nowISO(); localStorage.setItem(LS_KEY, JSON.stringify(obj)); }
  function loadGA(){
    if (!GA_ID || window.gtag) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  window.cookieConsent = { get: () => readConsent() || defaultConsent, openSettings };

  function createBanner() {
    const existing = readConsent();
    if (existing) { if (existing.analytics) loadGA(); return; }

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div>
        <h2>Pliki cookies i Google Analytics</h2>
        <p>Używamy niezbędnych plików cookies, aby strona działała prawidłowo.
           Za Twoją zgodą korzystamy z <strong>Google Analytics</strong> w celach analitycznych.
           <a href="polityka-prywatnosci.html">Polityka prywatności</a>.
        </p>
      </div>
      <div class="cb-actions">
        <button id="cb-settings">Ustawienia</button>
        <button id="cb-necessary">Tylko niezbędne</button>
        <button class="primary" id="cb-accept">Akceptuję wszystkie</button>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector('#cb-settings').onclick = openSettings;
    banner.querySelector('#cb-necessary').onclick = () => { saveConsent(defaultConsent); banner.remove(); };
    banner.querySelector('#cb-accept').onclick = () => {
      saveConsent({ necessary:true, analytics:true, marketing:true });
      loadGA();
      banner.remove();
    };
  }

  function openSettings() {
    const c = readConsent() || defaultConsent;
    const backdrop = document.createElement('div');
    backdrop.className = 'cookie-modal-backdrop show';
    const modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.innerHTML = `
      <h3>Ustawienia plików cookies</h3>
      <p>Wybierz, które pliki cookies chcesz zaakceptować.</p>
      <div class="category"><div><strong>Niezbędne</strong><div style="font-size:0.9rem;color:#555">Zawsze włączone</div></div>
           <input type="checkbox" checked disabled></div>
      <div class="category"><div><strong>Analityczne (Google Analytics)</strong>
           <div style="font-size:0.9rem;color:#555">Pomagają nam ulepszać stronę</div></div>
           <input type="checkbox" id="cbc-analytics" ${c.analytics?'checked':''}></div>
      <div class="category"><div><strong>Marketingowe</strong>
           <div style="font-size:0.9rem;color:#555">Spersonalizowane reklamy</div></div>
           <input type="checkbox" id="cbc-marketing" ${c.marketing?'checked':''}></div>
      <div class="actions">
         <button id="cancel-settings">Anuluj</button>
         <button id="save-settings" class="primary">Zapisz wybór</button>
      </div>
    `;
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    document.getElementById('cancel-settings').onclick = () => backdrop.remove();
    document.getElementById('save-settings').onclick = () => {
      const newC = {
        necessary:true,
        analytics: document.getElementById('cbc-analytics').checked,
        marketing: document.getElementById('cbc-marketing').checked
      };
      saveConsent(newC);
      if (newC.analytics) loadGA();
      backdrop.remove();
      const banner = document.querySelector('.cookie-banner');
      if (banner) banner.remove();
    };
    backdrop.onclick = e => { if (e.target === backdrop) backdrop.remove(); };
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', createBanner);
  else createBanner();
})();
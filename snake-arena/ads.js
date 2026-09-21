const AdSlots = {
  // PROVIDER_B_BANNER_CODE_GOES_HERE
  // The banner remains a static, clearly labelled container in this build.
  showDevelopmentInterstitial() {
    const notice = document.createElement('div');
    notice.className = 'dev-ad-notice';
    notice.innerHTML = '<strong>Development-only interstitial placeholder</strong><span>No ad network is loaded or contacted.</span><button type="button" aria-label="Close placeholder">Close</button>';
    Object.assign(notice.style, { position: 'fixed', left: '50%', bottom: '22px', zIndex: '10', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', maxWidth: 'calc(100% - 32px)', padding: '14px 18px', border: '1px solid #66efff', borderRadius: '8px', color: '#f4f7ff', background: '#101426', boxShadow: '0 12px 30px rgba(0,0,0,.35)', transform: 'translateX(-50%)', fontSize: '13px' });
    notice.querySelector('button').style.cssText = 'margin-left:auto;padding:6px 9px;border:1px solid #52617e;border-radius:5px;color:#f4f7ff;background:#18203a;cursor:pointer;';
    notice.querySelector('button').addEventListener('click', () => notice.remove());
    document.body.appendChild(notice);
  },

  requestRewardedLife({ onComplete }) {
    const developmentMode = true;
    if (developmentMode) {
      window.setTimeout(() => onComplete(), 2000);
      return;
    }

    // PROVIDER_A_REWARDED_CODE_GOES_HERE
    // Production will call onComplete exactly once from Provider A's official
    // verified-completion callback. No provider SDK is loaded in this build.
  }
};

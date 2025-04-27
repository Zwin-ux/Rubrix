// Content script for Google Forms/Sheets integration
(function injectSidebar() {
  if (window.__aiFormGraderSidebarInjected) return;
  window.__aiFormGraderSidebarInjected = true;

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'ai-form-grader-sidebar';
  sidebar.setAttribute('role', 'complementary');
  sidebar.setAttribute('aria-label', 'AI Form Grader Sidebar');
  sidebar.style.position = 'fixed';
  sidebar.style.top = '0';
  sidebar.style.right = '0';
  sidebar.style.width = '420px';
  sidebar.style.height = '100vh';
  sidebar.style.zIndex = '999999';
  sidebar.style.background = '#fff';
  sidebar.style.boxShadow = '-2px 0 12px rgba(0,0,0,0.18)';
  sidebar.style.borderLeft = '2px solid #005fcc';
  sidebar.style.transition = 'transform 0.3s';
  sidebar.style.transform = 'translateX(100%)';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close AI Form Grader Sidebar');
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '12px';
  closeBtn.style.left = '12px';
  closeBtn.style.fontSize = '2rem';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.color = '#005fcc';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.zIndex = '1';
  closeBtn.addEventListener('click', () => {
    sidebar.style.transform = 'translateX(100%)';
    toggleBtn.style.display = 'block';
    sidebar.setAttribute('aria-hidden', 'true');
  });
  closeBtn.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBtn.click();
  });
  sidebar.appendChild(closeBtn);

  // Iframe for popup.html
  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('popup.html');
  iframe.title = 'AI Form Grader Dashboard';
  iframe.setAttribute('aria-label', 'AI Form Grader Dashboard');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.tabIndex = 0;
  sidebar.appendChild(iframe);

  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'AI Grader';
  toggleBtn.setAttribute('aria-label', 'Open AI Form Grader Sidebar');
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '60px';
  toggleBtn.style.right = '20px';
  toggleBtn.style.zIndex = '999999';
  toggleBtn.style.background = '#005fcc';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.padding = '12px 20px';
  toggleBtn.style.border = 'none';
  toggleBtn.style.borderRadius = '8px';
  toggleBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
  toggleBtn.style.fontWeight = 'bold';
  toggleBtn.style.fontSize = '1rem';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.addEventListener('click', () => {
    sidebar.style.transform = 'translateX(0)';
    toggleBtn.style.display = 'none';
    sidebar.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  });

  // Keyboard shortcut: Ctrl+Shift+G to toggle sidebar
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
      const isOpen = sidebar.style.transform === 'translateX(0)';
      if (isOpen) closeBtn.click();
      else toggleBtn.click();
    }
  });

  document.body.appendChild(sidebar);
  document.body.appendChild(toggleBtn);

  // Accessibility: hide sidebar initially
  sidebar.setAttribute('aria-hidden', 'true');
  // ARIA live region for extraction status
  const liveRegion = document.createElement('div');
  liveRegion.id = 'ai-form-grader-live';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-9999px';
  document.body.appendChild(liveRegion);

  // Helper: Announce status
  function announce(msg) {
    liveRegion.textContent = msg;
  }

  // Google Forms extraction
  function extractGoogleForm() {
    announce('Extracting form data...');
    const questions = Array.from(document.querySelectorAll('.freebirdFormviewerComponentsQuestionBaseTitle'))
      .map(q => q.textContent.trim()).filter(Boolean);
    const rows = Array.from(document.querySelectorAll('.freebirdFormviewerViewItemsItemItem'));
    // Try to extract responses if visible (stub: for live forms, only questions are available)
    announce('Extraction complete.');
    return { questions, responses: [] };
  }

  // Listen for messages from the sidebar iframe
  window.addEventListener('message', e => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'AI_FORM_GRADER_IMPORT_REQUEST') {
      // Only allow from our iframe
      if (e.source && e.source !== iframe.contentWindow) return;
      let data = {};
      if (window.location.hostname.includes('forms.google.com') || window.location.hostname.includes('docs.google.com')) {
        data = extractGoogleForm();
      } else if (window.location.hostname.includes('sheets.google.com')) {
        // TODO: Extract from Google Sheets (stub)
        data = { questions: [], responses: [] };
      }
      iframe.contentWindow.postMessage({ type: 'AI_FORM_GRADER_IMPORT_DATA', ...data }, '*');
    }
  });
})();

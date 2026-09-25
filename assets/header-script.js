// GLOBAL HEADER NAVIGATION SCRIPT
console.log("📍 header-script.js loaded");

function initMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  
  console.log("🔍 menuBtn:", menuBtn ? "found" : "NOT FOUND");
  console.log("🔍 navLinks:", navLinks ? "found" : "NOT FOUND");
  
  if (!menuBtn || !navLinks) {
    console.warn("⚠️ Menu elements not found");
    return;
  }
  
  // Toggle menu on button click
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    console.log("📌 Menu clicked");
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    console.log("✅ Menu toggled:", isOpen ? "OPEN" : "CLOSED");
  });
  
  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      console.log("📌 Link clicked:", link.textContent);
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navLinks.classList.contains('open')) {
      if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        console.log("📌 Clicked outside, closing menu");
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });
  
  console.log("✅ Menu initialized");
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  console.log("⏳ DOM loading, waiting for DOMContentLoaded");
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  console.log("✅ DOM ready, initializing now");
  initMenu();
}

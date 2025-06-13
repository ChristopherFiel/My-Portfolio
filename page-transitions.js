// page-transitions.js

// Define page order to determine navigation direction
const pageOrder = ['index.html', 'aboutme.html', 'projects.html', 'researches.html', 'certificates.html'];

function getPageName(path) {
  const name = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return name;
}

function isFirstVisit() {
  return !sessionStorage.getItem('visited');
}

// Determine navigation direction
function getDirection(from, to) {
  const fromIndex = pageOrder.indexOf(from);
  const toIndex = pageOrder.indexOf(to);
  if (toIndex > fromIndex) return 'left';   // swipe left when going forward
  if (toIndex < fromIndex) return 'right';  // swipe right when going back
  return 'none';
}

window.addEventListener('DOMContentLoaded', () => {
  const current = getPageName(window.location.pathname);

  // Mark as visited
  if (isFirstVisit()) {
    sessionStorage.setItem('visited', 'true');
    return; // skip animation on first load
  }

  // On back/forward navigation
  window.addEventListener('popstate', (e) => {
    const direction = e.state && e.state.from ? getDirection(e.state.from, current) : 'none';
    if (direction === 'left') document.body.classList.add('slide-in-right');
    else if (direction === 'right') document.body.classList.add('slide-in-left');
  });

  // On initial load after navigation
  const last = sessionStorage.getItem('lastPage') || current;
  const dir = getDirection(last, current);
  if (dir === 'left') document.body.classList.add('slide-in-right');
  else if (dir === 'right') document.body.classList.add('slide-in-left');
});

// Handle link clicks
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && href !== '#' && href !== window.location.pathname) {
      e.preventDefault();
      const from = getPageName(window.location.pathname);
      const to = href;
      const direction = getDirection(from, to);

      // store last page
      sessionStorage.setItem('lastPage', from);

      // apply animation
      if (direction === 'left') document.body.classList.add('slide-out-left');
      else if (direction === 'right') document.body.classList.add('slide-out-right');
      else window.location.href = href;

      setTimeout(() => window.location.href = href, (direction === 'none' ? 0 : 500));
    }
  });
});

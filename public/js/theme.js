const toggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Page load hone par saved theme apply karo
const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

toggleBtn.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateIcon(newTheme);
});

// function updateIcon(theme) {
//   toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
// }


function updateIcon(theme) {
  const icon = toggleBtn.querySelector('i');
  if (theme === 'dark') {
    icon.classList.remove('fa-circle-half-stroke');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-circle-half-stroke');
  }
}
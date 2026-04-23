export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
}
export function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
export function initTheme() {
  const t = getTheme();
  document.documentElement.classList.toggle('dark', t === 'dark');
}

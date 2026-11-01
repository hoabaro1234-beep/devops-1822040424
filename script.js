const VERSION = '2.0';

const versionNode = document.getElementById('version');
const yearNode = document.getElementById('year');
if (versionNode) versionNode.textContent = VERSION;
if (yearNode) yearNode.textContent = new Date().getFullYear();

const menuButton = document.getElementById('menu-toggle');
const nav = document.getElementById('site-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Mở menu');
  }));
}

const runs = {
  success: {
    id: '#04',
    check: '✓ PASSED', deploy: '✓ PASSED',
    deployClass: 'ok', badge: 'SUCCESS',
    message: 'Mã nguồn hợp lệ. Website phiên bản 2.0 được triển khai thành công.',
    url: 'https://github.com/hoabaro1234-beep/devops-1822040424/actions/runs/41271677729'
  },
  failure: {
    id: '#02',
    check: '✕ FAILED', deploy: '↷ SKIPPED',
    deployClass: 'skipped', badge: 'FAILED',
    message: 'Thiếu thẻ <title> trong index.html. Job check báo lỗi nên deploy không được chạy.',
    url: 'https://github.com/hoabaro1234-beep/devops-1822040424/actions/runs/41271605915'
  }
};

const tabs = Array.from(document.querySelectorAll('.run-tab'));
const panel = document.getElementById('run-panel');
const checkStatus = document.getElementById('check-status');
const deployStatus = document.getElementById('deploy-status');
const badge = document.getElementById('console-badge');
const consoleId = document.getElementById('console-id');
const consoleMessage = document.getElementById('console-message');
const runLink = document.getElementById('run-link');

function showRun(kind, focus = false) {
  const run = runs[kind];
  if (!run || !panel) return;
  tabs.forEach(tab => {
    const selected = tab.dataset.run === kind;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) {
      panel.setAttribute('aria-labelledby', tab.id);
      if (focus) tab.focus();
    }
  });
  consoleId.textContent = run.id;
  checkStatus.textContent = run.check;
  checkStatus.className = kind === 'success' ? 'ok' : 'error';
  deployStatus.textContent = run.deploy;
  deployStatus.className = run.deployClass;
  badge.textContent = run.badge;
  badge.classList.toggle('is-error', kind === 'failure');
  consoleMessage.textContent = run.message;
  runLink.href = run.url;
}

for (const tab of tabs) {
  tab.addEventListener('click', () => showRun(tab.dataset.run));
  tab.addEventListener('keydown', event => {
    if (!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    let index = tabs.indexOf(tab);
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else index = (index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
    showRun(tabs[index].dataset.run, true);
  });
}
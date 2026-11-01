const VERSION = '2.1';

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
    message: 'Mã nguồn hợp lệ. Bản sửa phiên bản 2.0 đã được triển khai thành công.',
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


// Three-step CI/CD explorer: code excerpts are illustrative; outcomes link to real GitHub runs.
const stages = {
  push: {
    tag: '01 — VERSION CONTROL', title: 'Đẩy thay đổi lên nhánh main.',
    description: 'Bản cập nhật được lưu vào repository. GitHub Actions tự khởi chạy workflow mỗi khi có commit mới trên nhánh main.',
    code: 'git add .\ngit commit -m "Update website"\ngit push origin main',
    link: 'https://github.com/hoabaro1234-beep/devops-1822040424/commits/main', label: 'XEM LỊCH SỬ COMMIT'
  },
  check: {
    tag: '02 — QUALITY GATE', title: 'Chặn lỗi trước khi xuất bản.',
    description: 'Job check xác nhận đủ ba tệp HTML, CSS, JS và kiểm tra thẻ title. Bài thử cố tình xóa title khiến bước kiểm tra thất bại.',
    code: `for file in index.html style.css script.js; do
  test -f "$file" || exit 1
done
grep -Eiq '<title>[^<]+</title>' index.html`,
    link: 'https://github.com/hoabaro1234-beep/devops-1822040424/actions/runs/41271605915', label: 'XEM RUN THẤT BẠI'
  },
  deploy: {
    tag: '03 — CONTINUOUS DELIVERY', title: 'Chỉ phát hành khi check đạt.',
    description: 'Trong workflow, deploy khai báo needs: check. Khi kiểm tra thành công, GitHub Pages mới được phép cập nhật website công khai.',
    code: 'deploy:\n  needs: check\n  environment: github-pages\n  # upload-pages-artifact → deploy-pages',
    link: 'https://github.com/hoabaro1234-beep/devops-1822040424/actions', label: 'XEM GITHUB ACTIONS'
  }
};
const stageTabs = [...document.querySelectorAll('.stage-tab')];
const stagePanel = document.getElementById('stage-panel');
function showStage(key, shouldFocus = false) {
  if (!stages[key] || !stagePanel) return;
  const stage = stages[key];
  stageTabs.forEach(tab => {
    const selected = tab.dataset.stage === key;
    tab.classList.toggle('is-current', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) {
      stagePanel.setAttribute('aria-labelledby', tab.id);
      if (shouldFocus) tab.focus();
    }
  });
  document.getElementById('stage-tag').textContent = stage.tag;
  document.getElementById('stage-title').textContent = stage.title;
  document.getElementById('stage-description').textContent = stage.description;
  document.getElementById('stage-code').textContent = stage.code;
  const a = document.getElementById('stage-link');
  a.href = stage.link;
  a.innerHTML = stage.label + ' <span aria-hidden="true">↗</span>';
}
stageTabs.forEach((tab, idx) => {
  tab.addEventListener('click', () => showStage(tab.dataset.stage));
  tab.addEventListener('keydown', event => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let i = idx;
    if (event.key === 'Home') i = 0;
    else if (event.key === 'End') i = stageTabs.length - 1;
    else i = (idx + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + stageTabs.length) % stageTabs.length;
    showStage(stageTabs[i].dataset.stage, true);
  });
});

// Consistent navigation on touch, keyboard and pointer devices.
function closeMobileMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Mở menu');
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
    closeMobileMenu();
    menuButton.focus();
  }
});
document.addEventListener('pointerdown', event => {
  if (nav?.classList.contains('is-open') && !nav.contains(event.target) && !menuButton?.contains(event.target)) closeMobileMenu();
});
const readingProgress = document.getElementById('reading-progress');
let progressScheduled = false;
function updateProgress() {
  progressScheduled = false;
  if (!readingProgress) return;
  const end = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  readingProgress.style.width = `${Math.max(0, Math.min(100, scrollY / end * 100))}%`;
}
addEventListener('scroll', () => {
  if (!progressScheduled) {
    progressScheduled = true;
    requestAnimationFrame(updateProgress);
  }
}, {passive: true});
addEventListener('resize', updateProgress);
updateProgress();
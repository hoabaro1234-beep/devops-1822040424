// Phần JavaScript đơn giản để minh hoạ tương tác frontend.
const VERSION = '1.0';
const versionElement = document.getElementById('version');
const yearElement = document.getElementById('year');

if (versionElement) versionElement.textContent = VERSION;
if (yearElement) yearElement.textContent = new Date().getFullYear();
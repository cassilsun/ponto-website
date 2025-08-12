// =========================
// 顶部导航与滚动交互（精简版）
// =========================

// 元素引用（做好空值保护）
const headerEl   = document.getElementById('header');
const hamburger  = document.querySelector('.header .nav-bar .ham');
const navEl      = document.querySelector('.header .nav-bar nav');
const scrollUpEl = document.getElementById('scrollUp');

// 给导航设置一个 id（供 aria-controls 使用）
if (navEl && !navEl.id) navEl.id = 'nav-menu';

// —— 汉堡菜单开关（含键盘与无障碍支持）——
if (hamburger && navEl) {
  // 初始可访问性属性
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('tabindex', '0');
  hamburger.setAttribute('aria-controls', navEl.id);
  hamburger.setAttribute('aria-expanded', 'false');

  const toggleMenu = () => {
    const isActive = hamburger.classList.toggle('active');
    navEl.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', String(isActive));
  };

  // 鼠标点击
  hamburger.addEventListener('click', toggleMenu);

  // 键盘操作（Enter / Space）
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // 点击任意导航链接后自动收起菜单
  navEl.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      hamburger.classList.remove('active');
      navEl.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// —— 滚动相关：头部背景与“返回顶部”按钮 ——
// 使用 rAF 合并滚动更新，提升性能
let ticking = false;
const onScroll = () => {
  const y = window.scrollY || document.documentElement.scrollTop || 0;

  // 头部背景（可根据需要设置颜色/透明度）
  if (headerEl) {
    headerEl.style.backgroundColor = y > 100 ? 'transparent' : 'transparent';
    // 如需有色背景，可改为：'rgba(40, 43, 44, 0.75)'
  }

  // 返回顶部按钮显隐
  if (scrollUpEl) {
    scrollUpEl.classList.toggle('active', y > 1000);
  }

  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

// —— 移动端初始化时强制关闭菜单 ——
// 小于 1000px 视口宽度时，确保菜单默认关闭
if (window.innerWidth < 1000) {
  if (navEl && hamburger) {
    navEl.classList.remove('active');
    hamburger.classList.remove('active');
  }
}

// 首次进来执行一次（确保状态正确）
onScroll();

// —— 阻止 href="#" 的默认跳转（不影响其他链接）——
document.querySelectorAll('a[href="#"]').forEach((a) => {
  a.addEventListener('click', (e) => e.preventDefault());
});
// Simple slider: autoplay + arrows + dots + hover pause + touch
(function(){
  const slider = document.getElementById('hero-slider');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('.arrow.prev');
  const nextBtn = slider.querySelector('.arrow.next');
  const dots = Array.from(slider.querySelectorAll('.dot'));
  let idx = 0;
  let running = true;
  let timer = null;
  const INTERVAL = 4000;

  function goTo(i){
    slides.forEach((s, si) => {
      const active = si === i;
      s.classList.toggle('active', active);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
      // small zoom effect on background
      const bg = s.querySelector('.slide-bg');
      if(bg) bg.style.transform = active ? 'scale(1.06)' : 'scale(1)';
    });
    dots.forEach(d => d.classList.remove('active'));
    if(dots[i]) dots[i].classList.add('active');
    idx = i;
  }

  function next(){
    goTo((idx + 1) % slides.length);
  }
  function prev(){
    goTo((idx - 1 + slides.length) % slides.length);
  }

  // autoplay
  function start(){
    stop();
    timer = setInterval(next, INTERVAL);
    running = true;
  }
  function stop(){
    if(timer) clearInterval(timer);
    timer = null;
    running = false;
  }

  // arrows
  nextBtn.addEventListener('click', () => { next(); start(); });
  prevBtn.addEventListener('click', () => { prev(); start(); });

  // dots
  dots.forEach(d => d.addEventListener('click', (e) => {
    const to = Number(e.currentTarget.dataset.to || 0);
    goTo(to);
    start();
  }));

  // pause on hover
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  // touch support
  let touchStartX = null;
  slider.addEventListener('touchstart', (e)=> {
    touchStartX = e.touches[0].clientX;
    stop();
  }, {passive:true});
  slider.addEventListener('touchend', (e)=> {
    if(touchStartX === null) return;
    const delta = (e.changedTouches[0].clientX - touchStartX);
    if(Math.abs(delta) > 40){
      if(delta < 0) next(); else prev();
    }
    touchStartX = null;
    start();
  });

  // init
  goTo(0);
  start();

  // set year in footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;
})();

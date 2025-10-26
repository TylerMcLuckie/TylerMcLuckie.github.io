// Basic interactivity: hamburger + pointer-driven parallax for project cards
document.addEventListener('DOMContentLoaded', () => {

  // === MENU TOGGLE ===
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // === HERO LAYER PARALLAX (5-layer movement) ===
  const heroLayers = document.getElementById('hero-layers');
  if (heroLayers) {
    const layers = heroLayers.querySelectorAll('.layer');
    heroLayers.addEventListener('mousemove', (e) => {
      const rect = heroLayers.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / centerX;
      const moveY = (y - centerY) / centerY;

      layers.forEach((layer, i) => {
        const depth = (i + 1) * 8;
        const rotate = (i + 1) * 1.2;
        layer.style.transform = `
          translate(-50%, -50%) 
          translateX(${moveX * depth}px)
          translateY(${moveY * depth}px)
          rotateY(${moveX * rotate}deg)
          rotateX(${-moveY * rotate}deg)
        `;
      });
    });

    heroLayers.addEventListener('mouseleave', () => {
      layers.forEach(layer => {
        layer.style.transform = 'translate(-50%, -50%)';
      });
    });
  }

  // === SLIDER BUTTONS ===
  const slider = document.getElementById('project-slider');
  const next = document.querySelector('.slider-btn.next');
  const prev = document.querySelector('.slider-btn.prev');

  if (slider && next && prev) {
    next.addEventListener('click', () => {
      slider.scrollBy({ left: slider.offsetWidth * 0.8, behavior: 'smooth' });
    });
    prev.addEventListener('click', () => {
      slider.scrollBy({ left: -slider.offsetWidth * 0.8, behavior: 'smooth' });
    });
  }

  // === PROJECT CARD POINTER PARALLAX ===
  const cards = document.querySelectorAll('.card-inner[data-mouse-depth="true"]');
  cards.forEach(card => {
    const layers = card.querySelectorAll('.layer');
    card.addEventListener('pointermove', ev => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (ev.clientX - cx) / r.width;
      const dy = (ev.clientY - cy) / r.height;
      layers.forEach((layer, i) => {
        const depth = layer.classList.contains('back') ? -12 : layer.classList.contains('mid') ? -6 : 0;
        const tx = dx * (10 + (i * 6)) * (depth < 0 ? -1 : 1);
        const ty = dy * (10 + (i * 6)) * (depth < 0 ? -1 : 1);
        const rot = dx * (i - 1) * 3;
        layer.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) translateZ(${(i * 10)}px) rotateY(${rot}deg)`;
      });
    });

    card.addEventListener('pointerleave', () => {
      layers.forEach(layer => layer.style.transform = 'translate(-50%,-50%) translateZ(0) rotateY(0deg)');
    });
  });

  // === AUTO-SCROLL FOR FEATURED PROJECTS ===
  if (slider) {
    let isHovered = false;
    let autoScroll;

    function startAutoScroll() {
      stopAutoScroll();
      autoScroll = setInterval(() => {
        if (!isHovered) {
          slider.scrollLeft += 1; // adjust scroll speed (1–3 works best)
          if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
            slider.scrollLeft = 0;
          }
        }
      }, 16); // ~60fps
    }

    function stopAutoScroll() {
      if (autoScroll) clearInterval(autoScroll);
    }

    slider.addEventListener("mouseenter", () => (isHovered = true));
    slider.addEventListener("mouseleave", () => (isHovered = false));

    startAutoScroll();
  }


// === SCROLL REVEAL FOR CREATIVE PROJECTS ===
const creativeCards = document.querySelectorAll('.creative-card');
if (creativeCards.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(() => el.classList.add('revealed'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  creativeCards.forEach(card => io.observe(card));
}
  // === FOOTER YEAR ===
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

});

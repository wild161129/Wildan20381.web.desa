/* ====================================================
   DESA SUKAMAJU — WEBSITE PROFIL DESA
   script.js — Semua fitur interaktif JavaScript
   ==================================================== */

'use strict';

/* ====================================================
   1. LOADING SCREEN
   ==================================================== */
(function initLoadingScreen() {
  const screen   = document.getElementById('loading-screen');
  const progress = document.querySelector('.loader-progress');
  if (!screen || !progress) return;

  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 12 + 3;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => screen.classList.add('hidden'), 300);
    }
    progress.style.width = width + '%';
  }, 80);
})();

/* ====================================================
   2. AOS ANIMATION INIT
   ==================================================== */
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
});

/* ====================================================
   3. NAVBAR — SCROLL EFFECT & ACTIVE MENU
   ==================================================== */
(function initNavbar() {
  const navbar   = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-item-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Scroll → navbar berubah warna
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active menu berdasarkan posisi scroll
    let current = '';
    sections.forEach(sec => {
      const sectionTop    = sec.offsetTop - 120;
      const sectionHeight = sec.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Close mobile navbar saat link diklik
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
})();

/* ====================================================
   4. SMOOTH SCROLLING (dengan offset untuk navbar)
   ==================================================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // tinggi navbar
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ====================================================
   5. TYPING ANIMATION — HERO SECTION
   ==================================================== */
(function initTypingAnimation() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Desa Modern Mandiri Berdaya',
    'Alam Asri, Masyarakat Sejahtera',
    'Bersatu Membangun Desa',
    'Warisan Budaya, Masa Depan Cerah',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause setelah selesai mengetik
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  // Mulai setelah loading selesai
  setTimeout(type, 1500);
})();

/* ====================================================
   6. COUNTER ANIMATION
   ==================================================== */
(function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const step     = Math.ceil(target / (duration / 16));
    let current    = 0;

    function update() {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString('id-ID');
        return;
      }
      el.textContent = current.toLocaleString('id-ID');
      requestAnimationFrame(update);
    }

    update();
  }

  // Gunakan IntersectionObserver agar animasi dipicu saat elemen terlihat
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ====================================================
   7. PROGRESS BAR ANIMATION
   ==================================================== */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ====================================================
   8. CHART.JS — STATISTIK PENDUDUK
   ==================================================== */
(function initCharts() {
  // Warna palet
  const palette = {
    green:  ['rgba(82,183,136,0.85)','rgba(64,145,108,0.85)','rgba(45,106,79,0.85)','rgba(27,67,50,0.85)','rgba(149,213,178,0.85)'],
    gold:   'rgba(212,175,55,0.8)',
    text:   'rgba(165,201,176,0.7)',
    grid:   'rgba(255,255,255,0.06)',
  };

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: palette.text,
          font: { family: 'Poppins', size: 11 },
          padding: 10,
          boxWidth: 12,
          boxHeight: 12,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(6,11,8,0.95)',
        borderColor:     'rgba(82,183,136,0.3)',
        borderWidth: 1,
        titleColor:  '#e8f5e9',
        bodyColor:   'rgba(165,201,176,0.85)',
        padding: 10,
        cornerRadius: 10,
      }
    }
  };

  /* Chart Usia */
  const ctxUsia = document.getElementById('chartUsia');
  if (ctxUsia) {
    new Chart(ctxUsia, {
      type: 'bar',
      data: {
        labels: ['0-14', '15-24', '25-44', '45-64', '65+'],
        datasets: [{
          label: 'Jumlah (jiwa)',
          data: [620, 540, 890, 780, 424],
          backgroundColor: palette.green,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          y: {
            grid: { color: palette.grid },
            ticks: { color: palette.text, font: { size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: palette.text, font: { size: 10 } }
          }
        }
      }
    });
  }

  /* Chart Pendidikan */
  const ctxPend = document.getElementById('chartPendidikan');
  if (ctxPend) {
    new Chart(ctxPend, {
      type: 'doughnut',
      data: {
        labels: ['SD', 'SMP', 'SMA', 'D3/S1', 'S2/S3'],
        datasets: [{
          data: [32, 28, 25, 12, 3],
          backgroundColor: [
            'rgba(82,183,136,0.85)',
            'rgba(64,145,108,0.85)',
            'rgba(45,106,79,0.85)',
            'rgba(212,175,55,0.85)',
            'rgba(149,213,178,0.85)',
          ],
          borderColor: 'rgba(255,255,255,0.05)',
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        ...chartDefaults,
        cutout: '65%',
      }
    });
  }

  /* Chart Pekerjaan */
  const ctxPekerjaan = document.getElementById('chartPekerjaan');
  if (ctxPekerjaan) {
    new Chart(ctxPekerjaan, {
      type: 'polarArea',
      data: {
        labels: ['Petani', 'Wiraswasta', 'PNS/TNI', 'Swasta', 'Lainnya'],
        datasets: [{
          data: [40, 25, 8, 15, 12],
          backgroundColor: [
            'rgba(82,183,136,0.75)',
            'rgba(64,145,108,0.75)',
            'rgba(212,175,55,0.75)',
            'rgba(45,106,79,0.75)',
            'rgba(149,213,178,0.75)',
          ],
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          r: {
            grid:     { color: palette.grid },
            ticks:    { color: palette.text, backdropColor: 'transparent', font: { size: 9 } },
            pointLabels: { display: false },
          }
        }
      }
    });
  }
})();

/* ====================================================
   9. SWIPER — GALLERY
   ==================================================== */
(function initSwiper() {
  const swiperEl = document.querySelector('.gallerySwiper');
  if (!swiperEl) return;

  new Swiper('.gallerySwiper', {
    loop:          true,
    slidesPerView: 1,
    spaceBetween:  20,
    grabCursor:    true,
    speed:         700,
    effect:        'slide',
    autoplay: {
      delay:            4000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el:        '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640:  { slidesPerView: 1 },
      768:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
})();

/* ====================================================
   10. LIGHTBOX GALLERY
   ==================================================== */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  if (!lightbox || !lightboxImg) return;

  // Buka lightbox saat gambar gallery di-klik
  document.querySelectorAll('.gallery-slide').forEach(slide => {
    slide.addEventListener('click', () => {
      const imgSrc = slide.getAttribute('data-img') || slide.querySelector('img').src;
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Tutup dengan tombol ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/**
 * Tutup lightbox — dipanggil dari HTML onclick attribute
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/* ====================================================
   11. BACK TO TOP BUTTON
   ==================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ====================================================
   12. FORM VALIDASI & SWEETALERT2
   ==================================================== */
(function initContactForm() {
  const form      = document.getElementById('kontakForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  // Helper: tampilkan error
  function showError(id, inputId) {
    const errEl = document.getElementById(id);
    const input = document.getElementById(inputId);
    if (errEl) errEl.classList.add('visible');
    if (input) input.classList.add('input-error');
  }

  // Helper: hapus error
  function clearError(id, inputId) {
    const errEl = document.getElementById(id);
    const input = document.getElementById(inputId);
    if (errEl) errEl.classList.remove('visible');
    if (input) input.classList.remove('input-error');
  }

  // Real-time validation saat input berubah
  document.getElementById('nama')?.addEventListener('input', function () {
    if (this.value.trim().length > 0) clearError('namaError', 'nama');
  });

  document.getElementById('email')?.addEventListener('input', function () {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) clearError('emailError', 'email');
  });

  document.getElementById('jenis')?.addEventListener('change', function () {
    if (this.value) clearError('jenisError', 'jenis');
  });

  document.getElementById('pesan')?.addEventListener('input', function () {
    if (this.value.trim().length >= 10) clearError('pesanError', 'pesan');
  });

  // Submit form
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Ambil nilai form
    const nama  = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const jenis = document.getElementById('jenis').value;
    const pesan = document.getElementById('pesan').value.trim();

    // Reset semua error
    ['namaError','emailError','jenisError','pesanError'].forEach(id => {
      document.getElementById(id)?.classList.remove('visible');
    });
    ['nama','email','jenis','pesan'].forEach(id => {
      document.getElementById(id)?.classList.remove('input-error');
    });

    let isValid = true;

    // Validasi Nama
    if (!nama) {
      showError('namaError', 'nama');
      isValid = false;
    }

    // Validasi Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('emailError', 'email');
      isValid = false;
    }

    // Validasi Jenis
    if (!jenis) {
      showError('jenisError', 'jenis');
      isValid = false;
    }

    // Validasi Pesan (min 10 karakter)
    if (!pesan || pesan.length < 10) {
      showError('pesanError', 'pesan');
      isValid = false;
    }

    if (!isValid) {
      // Scroll ke error pertama
      const firstError = form.querySelector('.input-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulasi loading
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled       = true;

    setTimeout(() => {
      // Reset tombol
      btnText.style.display    = '';
      btnLoading.style.display = 'none';
      submitBtn.disabled       = false;

      // SweetAlert2 sukses
      Swal.fire({
        icon:             'success',
        title:            'Pesan Terkirim! 🎉',
        html: `
          <p style="color:#a5c9b0;font-family:Poppins,sans-serif;font-size:0.9rem">
            Terima kasih, <strong style="color:#74c69d">${nama}</strong>!<br>
            Pesan Anda telah berhasil dikirim ke perangkat Desa Bojanegara.<br>
            Kami akan merespons melalui email <strong style="color:#74c69d">${email}</strong> dalam 1×24 jam.
          </p>
        `,
        background:       '#0a0f0d',
        color:            '#e8f5e9',
        confirmButtonText:'Tutup',
        confirmButtonColor:'#40916c',
        showClass: {
          popup: 'animate__animated animate__fadeInUp',
        },
        customClass: {
          popup:          'swal-custom-popup',
          confirmButton:  'swal-custom-btn',
        }
      });

      // Reset form
      form.reset();
    }, 1800);
  });
})();

/* ====================================================
   13. PARALLAX EFFECT — HERO VIDEO
   ==================================================== */
(function initParallax() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        if (scrollY < window.innerHeight) {
          video.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ====================================================
   14. NAVBAR HAMBURGER ANIMATION
   ==================================================== */
(function initHamburger() {
  const toggler = document.querySelector('.navbar-toggler');
  const spans   = document.querySelectorAll('.hamburger-icon span');
  if (!toggler || !spans.length) return;

  toggler.addEventListener('click', function () {
    const isOpen = this.getAttribute('aria-expanded') === 'true';
    if (!isOpen) {
      // Animasi menjadi X
      spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity:0; transform:scaleX(0)';
      spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
    } else {
      // Kembali normal
      spans.forEach(s => s.removeAttribute('style'));
    }
  });
})();

/* ====================================================
   15. HOVER GLOW EFFECT PADA ORG CARDS
   ==================================================== */
(function initOrgCardGlow() {
  const cards = document.querySelectorAll('.org-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      card.style.background = `
        radial-gradient(circle 80px at ${x}px ${y}px, 
          rgba(82,183,136,0.08) 0%, 
          rgba(255,255,255,0.03) 60%,
          transparent 100%)
      `;
    });
    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });
})();

/* ====================================================
   16. SCROLL REVEAL TAMBAHAN
      (untuk elemen yang tidak pakai AOS)
   ==================================================== */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.milestone, .umkm-card, .counter-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    observer.observe(el);
  });
})();

/* ====================================================
   SEMUA FITUR SIAP!
   console log untuk konfirmasi
   ==================================================== */
console.log('%c🌿 Desa Bojanegara Website', 'color:#52b788;font-size:1.2rem;font-weight:bold;');
console.log('%cDibuat dengan ❤️ oleh Siswa SMK Negeri 1 Bawang', 'color:#d4af37;font-size:0.9rem;');
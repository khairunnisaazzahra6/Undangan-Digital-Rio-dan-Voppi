/* =====================================================
   VOPPI & RIO — MAIN JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Deklarasi Elemen DOM
    const gate = document.getElementById("gate-screen");
    const enterButton = document.getElementById("enter-btn");
    const invitation = document.getElementById("invitation");
    
    const audio = document.getElementById("wedding-audio");
    const musicButton = document.getElementById("music-toggle");
    
    const bottomNav = document.getElementById("bottom-nav");
    const moreButton = document.getElementById("more-nav");
    const moreMenu = document.getElementById("more-menu");
    const closeMoreButton = document.getElementById("close-more");
    
    const toast = document.getElementById("toast");
    
    const lightbox = document.getElementById("lightbox");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxImage = document.getElementById("lightbox-img");
    const galleryItems = document.querySelectorAll(".gallery-item");

  /* =================================================
       OPEN INVITATION (FLORAL GATE)
    ================================================= */
    async function openInvitation() {
        if (!gate || gate.classList.contains("open") || gate.classList.contains("is-open")) {
            return;
        }

        // Tambahkan kelas animasi pembuka gate
        document.body.classList.add("gate-open");
        gate.classList.add("open", "is-open");
        
        // Buka gembok undangan
        invitation?.classList.remove("is-locked");
        
        // Tampilkan navigasi bawah & tombol musik
        bottomNav?.classList.add("visible");
        musicButton?.classList.add("visible");

        // Putar Musik & Set Ikon Jadi Play (♫)
        if (audio) {
            try {
                await audio.play();
                musicButton?.classList.add("playing");
                if (musicButton) musicButton.innerHTML = '♫';
            } catch (error) {
                console.info("Autoplay audio diblokir oleh browser atau file belum tersedia.");
                if (musicButton) musicButton.innerHTML = '❚❚';
            }
        }

        // Hapus gate dari tampilan setelah animasi selesai
        setTimeout(() => {
            gate.classList.add("is-finished");
            gate.style.display = "none";
            document.body.classList.remove("gate-open");
        }, 1200);
    }

    // Event listener tombol enter & klik area gate
    enterButton?.addEventListener("click", (e) => {
        e.stopPropagation();
        openInvitation();
    });

    gate?.addEventListener("click", openInvitation);

    // =================================================
    // KONTROL TOMBOL MUSIK (KLIK UNTUK PLAY / PAUSE & GANTI IKON)
    // =================================================
    musicButton?.addEventListener("click", () => {
        if (!audio) return;
        
        if (audio.paused) {
            audio.play().catch(e => console.log("Audio play error:", e));
            musicButton.innerHTML = '♫';
            musicButton.classList.add("playing");
        } else {
            audio.pause();
            musicButton.innerHTML = '❚❚'; // Ikon saat musik berhenti
            musicButton.classList.remove("playing");
        }
    });
    /* =================================================
       MORE MENU (NAVIGASI BAWAH)
    ================================================= */
    function openMoreMenu() {
        moreMenu?.classList.add("open", "active", "show");
        document.body.classList.add("modal-open");
    }

    function closeMoreMenu() {
        moreMenu?.classList.remove("open", "active", "show");
        document.body.classList.remove("modal-open");
    }

    moreButton?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMoreMenu();
    });

    closeMoreButton?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeMoreMenu();
    });

    moreMenu?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            closeMoreMenu();
        });
    });

    /* =================================================
       GALLERY & LIGHTBOX INLINE HANDLING
    ================================================= */
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            openLightbox(item);
        });
    });

    lightboxClose?.addEventListener("click", closeLightbox);

    lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    /* =================================================
       ESCAPE KEY CLOSE MODAL
    ================================================= */
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeLightbox();
        closeMoreMenu();
    });

    /* =================================================
       REVEAL ON SCROLL
    ================================================= */
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("show");
        });
    }

    /* =================================================
       BOTTOM NAV HIGHLIGHT & AUTO SCROLL
    ================================================= */
    const navItems = document.querySelectorAll('.nav-scroll-container .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            this.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        });
    });

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-item[href]");

    if ("IntersectionObserver" in window) {
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    navLinks.forEach((link) => {
                        const target = link.getAttribute("href");
                        link.classList.toggle(
                            "active",
                            target === `#${entry.target.id}`
                        );
                    });
                });
            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );

        sections.forEach((section) => {
            navObserver.observe(section);
        });
    }

    /* =================================================
       TOAST NOTIFICATION
    ================================================= */
    window.showToast = showToast;
    let toastTimer;

    function showToast(message) {
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add("show");

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2400);
    }
});

/* =====================================================
   GLOBAL FUNCTIONS (Panggilan inline dari HTML)
===================================================== */

// Fungsi Lightbox Galeri
function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const clickedImg = element.querySelector('img');
    
    if (clickedImg && lightboxImg) {
        lightboxImg.src = clickedImg.src;
        lightbox.classList.add('active');
        lightbox.classList.add('open');
        document.body.classList.add('modal-open');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        lightbox.classList.remove('open');
        document.body.classList.remove('modal-open');
    }
}

// Fungsi Salin Rekening (Dipanggil di section Gift HTML)
async function copyToClipboard(elementId) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    const textToCopy = targetElement.textContent.trim();
    try {
        await navigator.clipboard.writeText(textToCopy);
        if (typeof showToast === 'function') {
            showToast("Nomor rekening berhasil disalin ✓");
        }
    } catch (err) {
        if (typeof showToast === 'function') {
            showToast("Gagal menyalin nomor rekening.");
        }
    }
}

// Inisialisasi efek partikel bunga jatuh
if (document.getElementById("particles-js")) {
  // Kalau pakai file config terpisah:
  particlesJS.load('particles-js', 'js/particles-config.json', function() {
    console.log('Efek bunga jatuh dimuat dari config JSON.');
  });

  // ATAU, kalau gak mau pakai file JSON terpisah (copas konfigurasi langsung di sini):
  /*
  particlesJS('particles-js', {
    "particles": { ... copy seluruh isi dari particles-config.json di sini ... }
  });
  */
}

// Inisialisasi efek partikel kelopak bunga jatuh langsung
document.addEventListener("DOMContentLoaded", function() {
  if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 30,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "image",
          "image": {
            "src": "assets/images/flower-petal.png",
            "width": 20,
            "height": 20
          }
        },
        "opacity": {
          "value": 0.8,
          "random": true
        },
        "size": {
          "value": 12,
          "random": true
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 1.5,
          "direction": "bottom",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": false },
          "onclick": { "enable": false },
          "resize": true
        }
      },
      "retina_detect": true
    });
  }
});


window.addEventListener('DOMContentLoaded', () => {
    // Tentukan waktu jeda sebelum gerbang emas terbuka (misal: 2500 milidetik / 2.5 detik)
    const introDelay = 2500; 

    setTimeout(() => {
        // Memicu animasi gerbang emas terbuka
        document.body.classList.add('intro-opened');
        
        // Menghapus elemen intro gate sepenuhnya dari layar setelah animasinya selesai (1.2 detik)
        setTimeout(() => {
            const introScreen = document.getElementById('intro-gate');
            if (introScreen) {
                introScreen.remove();
            }
            document.body.classList.add('remove-intro-gate');
        }, 1200); // Harus sinkron dengan durasi transisi CSS (1.2s)
        
    }, introDelay);
});
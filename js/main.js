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

        // Putar Musik
        if (audio) {
            try {
                await audio.play();
                musicButton?.classList.add("playing");
            } catch (error) {
                console.info("Autoplay audio diblokir oleh browser atau file belum tersedia.");
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

    /* =================================================
       MUSIC TOGGLE
    ================================================= */
    musicButton?.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
                musicButton.classList.add("playing");
                musicButton.setAttribute("aria-label", "Matikan musik");
            } catch {
                showToast("File musik belum tersedia.");
            }
        } else {
            audio.pause();
            musicButton.classList.remove("playing");
            musicButton.setAttribute("aria-label", "Putar musik");
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
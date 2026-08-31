/* =====================================================
   VOPPI & RIO — RSVP / WISHES SCRIPT (UPDATED)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("rsvp-form");
    const list = document.getElementById("wishes-list");
    const count = document.getElementById("wish-count");
    const loadMore = document.getElementById("load-more");
    const clearDemo = document.getElementById("clear-demo");

    if (!form || !list || !count) {
        return;
    }

    const STORAGE_KEY = "voppiRioWishes";
    let visibleCount = 4;

    /* =================================================
       DEFAULT WISHES (STARTER DEMO DATA)
    ================================================= */
    const starterWishes = [
        {
            name: "Keluarga & Sahabat",
            attendance: "Hadir",
            message: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selalu untuk Voppi & Rio 🤍",
            time: "Baru saja"
        },
        {
            name: "Nadia",
            attendance: "Hadir",
            message: "Selamat menempuh hidup baru! Semoga selalu dipenuhi cinta dan kebahagiaan.",
            time: "Baru saja"
        },
        {
            name: "Rani",
            attendance: "Hadir",
            message: "Barakallahu laka wa baraka alaika. Semoga lancar sampai hari H.",
            time: "Baru saja"
        }
    ];

    /* =================================================
       GET DATA FROM LOCALSTORAGE
    ================================================= */
    function getWishes() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                return [...starterWishes];
            }

            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [...starterWishes];
        } catch {
            return [...starterWishes];
        }
    }

    /* =================================================
       SAVE DATA TO LOCALSTORAGE
    ================================================= */
    function saveWishes(wishes) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
        } catch {
            console.warn("Tidak dapat menyimpan data RSVP di LocalStorage.");
        }
    }

    /* =================================================
       ESCAPE HTML (PREVENT XSS INJECTION)
    ================================================= */
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };
            return entities[character];
        });
    }

    /* =================================================
       RENDER WISHES LIST (SESUAI CSS CARD baru)
    ================================================= */
    function renderWishes() {
        const wishes = getWishes();

        // Update total ucapan
        count.textContent = wishes.length;

        // Kosongkan kontainer ucapan
        list.innerHTML = "";

        // Tampilkan item berdasarkan visibleCount
        wishes.slice(0, visibleCount).forEach((wish) => {
            const card = document.createElement("div");
            card.className = "wish-card";

            const isPresent = wish.attendance === "Hadir";
            const badgeClass = isPresent ? "wish-badge" : "wish-badge absent";

            card.innerHTML = `
                <div class="wish-header">
                    <strong class="wish-name">${escapeHtml(wish.name)}</strong>
                    <span class="${badgeClass}">${escapeHtml(wish.attendance)}</span>
                </div>
                <p class="wish-message">${escapeHtml(wish.message)}</p>
                <span class="wish-time">${escapeHtml(wish.time || "Baru saja")}</span>
            `;

            list.appendChild(card);
        });

        // Tampilkan/sembunyikan tombol Load More
        if (loadMore) {
            if (wishes.length <= visibleCount) {
                loadMore.classList.add("hidden");
            } else {
                loadMore.classList.remove("hidden");
            }
        }
    }

    /* =================================================
       SUBMIT FORM RSVP
    ================================================= */
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const attendance = String(formData.get("attendance") || "Hadir");
        const message = String(formData.get("message") || "").trim();

        if (!name || !message) {
            window.showToast?.("Mohon lengkapi nama dan ucapan.");
            return;
        }

        const wishes = getWishes();

        // Tambahkan ucapan baru ke paling atas
        wishes.unshift({
            name: name.slice(0, 50),
            attendance,
            message: message.slice(0, 300),
        });

        saveWishes(wishes);

        // Reset batas tampung agar ucapan baru langsung terlihat di atas
        visibleCount = Math.max(visibleCount, 4);

        renderWishes();
        form.reset();

        window.showToast?.("Ucapan berhasil ditambahkan 💌");
    });

    /* =================================================
       LOAD MORE
    ================================================= */
    loadMore?.addEventListener("click", () => {
        visibleCount += 4;
        renderWishes();
    });

    /* =================================================
       RESET DEMO DATA
    ================================================= */
    clearDemo?.addEventListener("click", () => {
        const confirmed = window.confirm("Reset semua ucapan demo?");
        if (!confirmed) return;

        localStorage.removeItem(STORAGE_KEY);
        visibleCount = 4;
        renderWishes();

        window.showToast?.("Ucapan demo berhasil direset.");
    });

    /* =================================================
       INITIAL RUN
    ================================================= */
    renderWishes();

});
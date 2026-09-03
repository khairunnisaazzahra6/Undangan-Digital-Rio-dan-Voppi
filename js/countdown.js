/* =====================================================
   VOPPI & RIO — WEDDING COUNTDOWN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Target Akad Nikah: 18 September 2026, 09.00 WIB */
    const targetDate = new Date("2026-09-18T09:00:00+07:00").getTime();

    // Elemen DOM Countdown
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    // Jika salah satu elemen tidak ditemukan di HTML, hentikan script
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }

    let timerInterval = null;

    function updateCountdown() {
        const now = Date.now();
        const difference = targetDate - now;

        // Jika waktu sudah lewat / tiba di hari H
        if (difference <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            // Hentikan interval agar tidak membebankan memori browser
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            return;
        }

        // Kalkulasi Waktu
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update teks dengan padding angka 2 digit (contoh: 09, 05)
        daysElement.textContent = String(days).padStart(2, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    // Jalankan sekali saat load agar tidak ada delay 1 detik di awal
    updateCountdown();

    // Set interval update setiap 1 detik (1000ms)
    timerInterval = setInterval(updateCountdown, 1000);

});
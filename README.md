# VOPPI & RIO — Wedding Invitation

Starter project undangan digital portrait, dibuat mobile-first untuk VS Code.

## Jalankan
1. Buka folder `VOPPI-RIO-WEDDING` di VS Code.
2. Install extension **Live Server**.
3. Klik kanan `index.html` → **Open with Live Server**.

## Yang sudah aktif
- Opening gate animation
- Open Invitation
- Music toggle
- Quotes → otomatis masuk Couple setelah 7 detik
- Couple
- Akad & resepsi
- Countdown 18 September 2026
- Google Maps button
- RSVP + ucapan demo menggunakan localStorage
- Love Story
- Gallery 9 frame + lightbox
- Gift + copy rekening
- Thanks
- Bottom navigation + More menu
- Responsive portrait

## Yang perlu diganti
- `assets/music/wedding-song.mp3`
- Foto Voppi & Rio
- 9 foto gallery
- Nomor rekening
- Detail Love Story
- Link Google Maps yang tepat

## Catatan RSVP
Saat ini RSVP memakai `localStorage`, supaya website langsung bisa dicoba tanpa konfigurasi database.
Tahap berikutnya bisa kita pindahkan ke **Firebase Firestore** agar ucapan dari semua tamu tersimpan online dan tampil realtime.

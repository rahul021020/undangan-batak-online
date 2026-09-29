UNDANGAN PERNIKAHAN BATAK - RESPONSIVE

Bisa dibuka di Android, iPhone/iOS, Windows, PC, MacBook, dan browser modern lainnya.

CARA MENJALANKAN:
1. Extract ZIP.
2. Buka index.html.
3. Tidak perlu XAMPP/Node.js untuk preview.

YANG DIGANTI:
- Nama, orang tua, tanggal, acara: index.html
- Countdown: script.js pada const WEDDING
- Foto: assets/foto-cover.jpg, foto-pria.jpg, foto-wanita.jpg, foto1.jpg sampai foto6.jpg
- Musik: assets/musik.mp3 milik sendiri
- Google Maps: link tombol di index.html

NAMA TAMU:
Setelah online, contoh:
https://domain-anda.com/?to=Andi%20dan%20Keluarga

RSVP:
Versi ini memakai localStorage untuk demo, jadi data belum menjadi database bersama. Untuk versi final yang dibagikan ke banyak tamu, sambungkan form ke Google Sheets/Firebase supaya semua RSVP dan ucapan masuk ke satu tempat.

AUTOPLAY MUSIK:
Browser biasanya memblokir autoplay sebelum interaksi. Musik dicoba diputar setelah tombol Buka Undangan ditekan. Tambahkan musik.mp3 sendiri ke assets.


JIKA TOMBOL BUKA TIDAK MERESPONS:
- Tekan Ctrl+F5 pada Chrome untuk refresh tanpa cache.
- Pastikan URL berada di folder undangan_pernikahan_batak dan file script.js ada.
- Versi ini memakai onclick + fungsi global openInvitation agar tombol pembuka tetap bekerja.


## FITUR TAMBAHAN: HADIAH DIGITAL

Pada bagian akhir undangan sudah ditambahkan:
- Transfer bank
- Tombol salin nomor rekening
- QRIS

Ganti data contoh di `index.html`:
- BANK CONTOH
- 1234567890
- Daniel & Maria

Ganti file `assets/qris.png` dengan gambar QRIS asli pengantin.

## MUSIK BACKSOUND OTOMATIS

Musik dicoba otomatis saat tombol `Buka Undangan` ditekan. Ini adalah cara yang paling kompatibel karena Chrome, Safari/iOS, dan browser lain dapat memblokir autoplay audio sebelum ada interaksi pengguna.

Masukkan musik milik Anda sendiri ke:
`assets/musik.mp3`

Setelah tamu menekan `Buka Undangan`, musik akan mulai diputar jika file MP3 tersedia dan browser mengizinkannya. Tombol musik di pojok bawah dapat digunakan untuk pause/play.


## PEMESANAN UNDANGAN DIGITAL
Logo Naruto Elektronik sudah ditempatkan pada bagian paling akhir halaman. Nomor pemesanan: 0823 7744 5782. Tombol WhatsApp membuka chat pemesanan otomatis. Instagram: @naruto_elektronik.


## BACKGROUND TERPISAH PER BAGIAN

Background sudah dipisahkan supaya bisa diganti satu per satu tanpa mengubah kode:

assets/backgrounds/cover.png        = halaman sebelum tombol Buka Undangan
assets/backgrounds/hero.png         = halaman pembuka setelah undangan dibuka
assets/backgrounds/mempelai.png     = bagian Mempelai
assets/backgrounds/firman.png       = Firman Tuhan
assets/backgrounds/save-date.png    = Countdown / Save The Date
assets/backgrounds/acara.png        = Waktu & Tempat
assets/backgrounds/susunan-acara.png= Susunan Acara
assets/backgrounds/lokasi.png       = Lokasi
assets/backgrounds/galeri.png       = Galeri
assets/backgrounds/rsvp.png         = RSVP & Ucapan
assets/backgrounds/hadiah.png       = Hadiah Digital
assets/backgrounds/penutup.png      = Penutup / Terima Kasih

Semua file tersebut saat ini memakai gambar Batak yang sama sebagai contoh.
Untuk mengganti satu bagian, cukup timpa file PNG bagian tersebut dengan gambar baru dan gunakan nama file yang sama.

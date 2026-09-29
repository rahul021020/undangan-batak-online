// Script undangan - RSVP ONLINE (Google Sheets)
(function () {
  'use strict';

  const WEDDING = { date: '2026-12-12T10:00:00+07:00' };
  const $ = (id) => document.getElementById(id);
  const RSVP_URL = (window.RSVP_CONFIG && window.RSVP_CONFIG.WEB_APP_URL || '').trim();

  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to');
  if (guest && $('guest')) {
    $('guest').textContent = guest.replace(/\+/g, ' ');
  }

  window.openInvitation = function () {
    const cover = $('cover');
    const main = $('main');
    const music = $('music');
    const musicBtn = $('musicBtn');

    if (!cover || !main) {
      alert('Halaman undangan tidak lengkap. Pastikan index.html dan script.js berasal dari folder yang sama.');
      return;
    }

    document.body.classList.remove('lock');
    cover.style.opacity = '0';
    cover.style.visibility = 'hidden';
    cover.style.pointerEvents = 'none';
    main.hidden = false;
    main.removeAttribute('hidden');
    window.scrollTo(0, 0);

    if (music) {
      const play = music.play();
      if (play && typeof play.catch === 'function') {
        play.then(function () {
          if (musicBtn) musicBtn.textContent = '🔊';
        }).catch(function () {});
      }
    }

    // Muat ucapan dari Google Sheets setelah undangan dibuka.
    loadWishes();
  };

  function updateCountdown() {
    const target = new Date(WEDDING.date).getTime();
    const distance = Math.max(0, target - Date.now());
    if ($('d')) $('d').textContent = Math.floor(distance / 86400000);
    if ($('h')) $('h').textContent = Math.floor((distance % 86400000) / 3600000);
    if ($('m')) $('m').textContent = Math.floor((distance % 3600000) / 60000);
    if ($('s')) $('s').textContent = Math.floor((distance % 60000) / 1000);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  if ($('musicBtn')) {
    $('musicBtn').addEventListener('click', function () {
      const music = $('music');
      if (!music) return;

      if (music.paused) {
        music.play().then(function () {
          $('musicBtn').textContent = '🔊';
        }).catch(function () {
          alert('Tambahkan file assets/musik.mp3 terlebih dahulu.');
        });
      } else {
        music.pause();
        $('musicBtn').textContent = '🔇';
      }
    });
  }

  document.querySelectorAll('.copy-btn').forEach(function (button) {
    button.addEventListener('click', async function () {
      const value = button.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(value);
      } catch (e) {
        const area = document.createElement('textarea');
        area.value = value;
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); } catch (err) {}
        area.remove();
      }

      const old = button.textContent;
      button.textContent = '✓ Berhasil Disalin';
      setTimeout(function () { button.textContent = old; }, 1800);
    });
  });

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderWishes(data) {
    if (!$('wishes')) return;

    $('wishes').innerHTML = (Array.isArray(data) ? data : []).map(function (x) {
      return '<div class="wish">' +
        '<span class="badge">' + esc(x.attendance || '') + '</span>' +
        '<strong>' + esc(x.name || '') + '</strong>' +
        '<div>' + esc(x.message || '') + '</div>' +
        '</div>';
    }).join('');
  }

  function showRsvpMessage(message, isError) {
    if (!$('status')) return;
    $('status').textContent = message;
    $('status').style.color = isError ? '#ffd5d5' : '#fff';
  }

  // Membaca Google Sheets dengan JSONP agar aman dipanggil dari localhost/Vercel.
  function loadWishes() {
    if (!RSVP_URL) {
      renderWishes([]);
      showRsvpMessage('RSVP online belum dikonfigurasi. Isi URL Web App di config.js.', true);
      return;
    }

    const callbackName = '__rsvpCallback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
    const script = document.createElement('script');
    let finished = false;

    const cleanup = function () {
      if (finished) return;
      finished = true;
      try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    const fail = function () {
      cleanup();
      showRsvpMessage('Ucapan tersimpan, tetapi daftar ucapan belum dapat dimuat. Coba refresh halaman.', true);
    };

    window[callbackName] = function (response) {
      if (response && response.ok) {
        renderWishes(response.data || []);
        showRsvpMessage('', false);
      } else {
        showRsvpMessage((response && response.message) || 'Belum dapat memuat ucapan online.', true);
      }
      cleanup();
    };

    script.onerror = fail;
    script.src = RSVP_URL + (RSVP_URL.indexOf('?') >= 0 ? '&' : '?') +
      'callback=' + encodeURIComponent(callbackName) + '&t=' + Date.now();
    document.body.appendChild(script);

    // Jangan biarkan halaman menunggu selamanya jika Web App tidak merespons.
    setTimeout(function () {
      if (!finished) fail();
    }, 12000);
  }

  async function submitRsvp(name, attendance, message) {
    if (!RSVP_URL) throw new Error('URL Web App Google Apps Script belum diisi di config.js');

    const body = new URLSearchParams();
    body.set('name', name);
    body.set('attendance', attendance);
    body.set('message', message);

    // POST sederhana tanpa preflight. Apps Script menerima parameter melalui e.parameter.
    await fetch(RSVP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: body,
      redirect: 'follow'
    });
  }

  if ($('form')) {
    $('form').addEventListener('submit', async function (e) {
      e.preventDefault();

      const n = $('name').value.trim();
      const a = $('att').value;
      const msg = $('msg').value.trim();
      if (!n || !a || !msg) return;

      const button = this.querySelector('button');
      if (button) button.disabled = true;

      showRsvpMessage('Mengirim ucapan ke Google Sheets...', false);

      try {
        await submitRsvp(n, a, msg);
        this.reset();
        showRsvpMessage('Ucapan berhasil dikirim. Memuat ucapan terbaru...', false);

        // Apps Script perlu sesaat untuk commit baris. Polling singkat memastikan
        // ucapan baru muncul tanpa user perlu refresh manual.
        setTimeout(loadWishes, 1200);
      } catch (err) {
        showRsvpMessage('Ucapan belum terkirim. Periksa URL Web App Google Apps Script.', true);
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // Coba memuat saat halaman siap jika undangan sudah terbuka.
  if ($('main') && !$('main').hidden) {
    loadWishes();
  }
})();

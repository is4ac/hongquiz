// ─────────────────────────────────────────
// SHARING
// ─────────────────────────────────────────
// Depends on constants.js and data.js

/**
 * Build a shareable URL with the winning policy encoded in the hash.
 * Opening the link takes the viewer directly to that result card.
 * e.g.  https://example.com/quiz/#result=childcare
 */
function buildShareURL(winnerKey) {
  const url = new URL(window.location.href);
  url.hash = `result=${winnerKey}`;
  return url.toString();
}

/** Copy the share URL to the clipboard and give visual feedback. */
async function copyShareURL(winnerKey) {
  const url = buildShareURL(winnerKey);
  const btn = document.getElementById('btn-copy-link');
  try {
    await navigator.clipboard.writeText(url);
    if (btn) {
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.innerHTML = LINK_ICON_SVG + ' Copy Link'; }, 2500);
    }
  } catch {
    // Fallback for non-HTTPS / restricted environments
    prompt('Copy this link to share your result:', url);
  }
}

/**
 * Draw a 1080×1920 story-format result card to a Canvas, then
 * trigger a PNG download.
 *
 * Card layout (top → bottom):
 *   Gold quiz label → rule → photo → "I AM…" label →
 *   policy name → tagline → divider → footer → badge
 */
async function downloadShareImage(winnerKey) {
  const policy = POLICIES[winnerKey];
  const btn = document.getElementById('btn-download-img');
  if (btn) { btn.textContent = 'Generating…'; btn.disabled = true; }

  // Ensure web fonts are loaded before we use them in canvas
  await document.fonts.ready;

  const WIDTH = 1080;
  const HEIGHT = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // ── Background image (cover: fit height, center horizontally) ───
  await new Promise((resolve, reject) => {
    const bg = new Image();
    bg.onload = () => {
      const scale = HEIGHT / bg.naturalHeight;
      const bgW = bg.naturalWidth * scale;
      ctx.drawImage(bg, (WIDTH - bgW) / 2, 0, bgW, HEIGHT);
      resolve();
    };
    bg.onerror = reject;
    bg.src = 'imgs/FH-Hong_bg-compressed.webp';
  });

  // ── Top gold badge ──────────────────────────────────────────────
  ctx.fillStyle = '#C3BC31';
  roundRect(ctx, 100, 80, 880, 160, 12);
  ctx.fill();

  ctx.fillStyle = '#1B2D55';
  ctx.font = 'bold 46px "AllRoundGothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  wrapText(ctx, 'WHICH FRAN HONG POLICY ARE YOU, REALLY?', WIDTH / 2, 150, WIDTH - 200, 56);

  // ── Image (centered horizontally) ──────────────────────────────
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 90, 280, 900, 600); resolve(); };
    img.onerror = reject;
    img.src = policy.image;
  });

  // ── "I AM…" label ───────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = 'bold 52px "AllRoundGothic", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('I AM…', WIDTH / 2, 980);

  // ── Policy name ─────────────────────────────────────────────────
  ctx.fillStyle = '#FFFFFF';
  ctx.letterSpacing = '1px';
  const nameFontSize = policy.name.length > 22 ? 66 : 80;
  ctx.font = `bold ${nameFontSize}px "AllRoundGothic", sans-serif`;
  wrapText(ctx, policy.name.toUpperCase(), WIDTH / 2, 1100, WIDTH - 200, nameFontSize + 10);

  // ── Tagline (word-wrapped, gold italic) ─────────────────────────
  ctx.fillStyle = '#C3BC31';
  ctx.font = 'italic 42px "Open Sans", sans-serif';
  ctx.letterSpacing = '0px';
  wrapText(ctx, policy.tagline, WIDTH / 2, 1300, WIDTH - 200, 50);

  // ── Gold divider ────────────────────────────────────────────────
  ctx.strokeStyle = '#C3BC31';
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(120, 1460);
  ctx.lineTo(WIDTH - 120, 1460);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // ── Footer — quiz URL ────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '42px "Open Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('Take the quiz yourself!  ·  hongquiz.com', WIDTH / 2, 1560);

  // ── Logo at bottom ───────────────────────────────────────────────
  await new Promise((resolve, reject) => {
    const logo = new Image();
    logo.onload = () => {
      ctx.drawImage(logo, WIDTH / 2 - 80, 1632, 160, 160);
      resolve();
    };
    logo.onerror = reject;
    logo.src = 'imgs/Logo-white.webp';
  });

  // ── Download ─────────────────────────────────────────────────────
  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fran-hong-quiz-${winnerKey}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (btn) {
      btn.innerHTML = DOWNLOAD_ICON_SVG + ' Download Image';
      btn.disabled = false;
    }
  }, 'image/png');
}

// ── Canvas helpers ───────────────────────────────────────────────

/** Word-wrap and draw centered text across multiple lines. */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const metrics = ctx.measureText(test);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
}

/** Rounded rectangle path (cross-browser safe). */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

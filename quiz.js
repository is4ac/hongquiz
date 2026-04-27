/**
 * quiz.js
 * Quiz state, rendering, and user interaction logic.
 * Depends on data.js, utils.js, and constants.js.
 */

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
let currentQ = 0;
let answers = []; // policy key per question, e.g. ['childcare', 'leave', ...]
let shuffled = []; // shuffled options array per question index
let screen = 'intro';

// ─────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────

/**
 * Called when the user clicks an option button.
 */
function selectOption(idx) {
  answers[currentQ] = shuffled[currentQ][idx].policy;

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    const isSelected = i === idx;
    btn.classList.toggle('selected', isSelected);
    btn.querySelector('.option-check').innerHTML = isSelected ? CHECK_SVG : '';
  });

  document.getElementById('btn-next')?.classList.add('visible');
}

/** Advance to the next question, or show results if on the last one. */
function nextQuestion() {
  if (!answers[currentQ]) return;

  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuiz();
  } else {
    screen = 'results';
    const { winner } = getResult();
    history.replaceState(null, '', `#result=${winner}`);
    render();
  }
}

/** Reset and start the quiz from the first question. */
function startQuiz() {
  currentQ = 0;
  answers = [];
  shuffled = [];
  screen = 'quiz';
  history.replaceState(null, '', window.location.pathname);
  render();
}

/** Reset to the intro screen. */
function restartQuiz() {
  currentQ = 0;
  answers = [];
  shuffled = [];
  screen = 'intro';
  history.replaceState(null, '', window.location.pathname);
  render();
}

// ─────────────────────────────────────────
// RENDERERS
// ─────────────────────────────────────────

/** Render the intro screen. */
function renderIntro() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="card">
      <div class="intro-banner">
        <div class="intro-header">
          <div class="intro-tag">Personality Quiz · Francesca Hong 2026</div>
          <a href="https://francescahong.com" target="_blank" class="intro-logo">
            <img src="imgs/Logo-white.webp" alt="Fran Hong logo" width="45px" />
          </a>
        </div>
        <div class="intro-title">WHICH FRAN POLICY<br><em>ARE YOU, REALLY?</em></div>
        <div class="intro-subtitle">Find out which bold Wisconsin idea matches your vibe.</div>
      </div>
      <div class="intro-body">
        <p class="intro-desc">
          Francesca Hong is running for Wisconsin governor on a platform that fights for working families:
          from childcare to clean water to healthcare to housing. Answer 8 quick questions and
          we'll tell you which of her policies is basically your political soulmate.
        </p>
        <div class="intro-meta">
          <span class="meta-pill">❓ 8 questions</span>
          <span class="meta-pill">⚡ About 2 minutes</span>
        </div>
        <button class="btn-primary" onclick="startQuiz()">LET'S FIND OUT →</button>
      </div>
    </div>
  `;
}

/** Render the current question screen. */
function renderQuiz() {
  const app = document.getElementById('app');
  const q = QUESTIONS[currentQ];
  const pct = (currentQ / QUESTIONS.length) * 100;
  const selected = answers[currentQ];

  if (!shuffled[currentQ]) shuffled[currentQ] = shuffleArr(q.options);
  const opts = shuffled[currentQ];

  const optionsHTML = opts.map((opt, i) => {
    const isSel = selected && selected === opt.policy;
    return `
      <button class="option-btn${isSel ? ' selected' : ''}" onclick="selectOption(${i})">
        <span class="option-check">${isSel ? CHECK_SVG : ''}</span>
        <span class="option-label">
          <span class="option-em">${opt.em}</span>
          ${opt.text}
        </span>
      </button>`;
  }).join('');

  const isLastQ = currentQ === QUESTIONS.length - 1;
  const nextLabel = isLastQ ? 'RESULTS →' : 'NEXT →';

  app.innerHTML = `
    <div class="card">
      <div class="quiz-header">
        <a href="https://francescahong.com" target="_blank" class="quiz-brand">FRANCESCA HONG 2026</a>
        <div class="progress-wrap">
          <div class="progress-fill" style="width: ${pct}%"></div>
        </div>
        <span class="progress-count">${currentQ + 1} / ${QUESTIONS.length}</span>
      </div>
      <div class="quiz-body">
        <span class="q-emoji">${q.emoji}</span>
        <div class="q-text">${q.text}</div>
        <div class="options">${optionsHTML}</div>
      </div>
      <div class="quiz-footer">
        <div class="footer-left">
          <a href="https://francescahong.com" target="_blank" class="footer-logo">
            <img src="imgs/Logo-blue.webp" alt="Fran Hong logo" width="45px" />
          </a>
          <span class="q-hint">Pick one to continue</span>
        </div>
        <button id="btn-next" class="btn-next${selected ? ' visible' : ''}" onclick="nextQuestion()">
          ${nextLabel}
        </button>
      </div>
    </div>
  `;
}

/**
 * Render the results screen.
 * @param {string|null} forcedWinner - set when loading a shared link directly;
 *   bypasses the tally since there are no answers to count.
 */
function renderResults(forcedWinner = null) {
  const isShared = Boolean(forcedWinner);
  const winner = forcedWinner ?? getResult().winner;
  const tally = isShared ? null : getResult().tally;
  const policy = POLICIES[winner];

  // ── Tally section ──
  let tallyHTML = '';
  let barTargets = [];

  if (tally) {
    const maxCount = Math.max(...Object.values(tally));
    const sorted = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .filter(([, v]) => v > 0);

    barTargets = sorted.map(([, count]) => Math.round((count / maxCount) * 100));

    tallyHTML = `
      <div class="tally-heading">How your answers broke down</div>
      <div class="tally-list">
        ${sorted.map(([key, count]) => {
          const p = POLICIES[key];
          return `
            <div class="tally-row">
              <span class="tally-label">${p.emoji} ${p.name}</span>
              <div class="tally-bar-wrap">
                <div class="tally-bar-fill${key === winner ? ' winner' : ''}" style="width: 0%"></div>
              </div>
              <span class="tally-count">${count}</span>
            </div>`;
        }).join('')}
      </div>`;
  }

  const sharedNotice = isShared
    ? `<div class="shared-notice">
         Someone shared this result with you.
         <button class="link-btn" onclick="startQuiz()">Take the quiz yourself →</button>
       </div>`
    : '';

  const html = `
    <div class="card">
      <div class="result-banner">
        <div class="result-header">
          <div class="result-tag">${isShared ? 'Shared result' : 'You are...'}</div>
          <a href="https://francescahong.com" target="_blank">
            <img src="imgs/Logo-white.webp" alt="Fran Hong logo" width="45px" />
          </a>
        </div>
        <img src="${policy.image}" class="result-image" />
        <div class="result-policy">${policy.name}</div>
        <div class="result-tagline">${policy.tagline}</div>
      </div>
      <div class="result-body">
        ${sharedNotice}
        <p class="result-desc">${policy.desc}</p>
        ${tallyHTML}

        <div class="share-box">
          <div class="share-heading">${isShared ? 'Share this result' : 'Share your result'}</div>
          <div class="share-buttons">
            <button class="share-btn share-btn--link" id="btn-copy-link"
              onclick="copyShareURL('${winner}')">
              ${LINK_ICON_SVG} Copy Link
            </button>
            <button class="share-btn share-btn--image" id="btn-download-img"
              onclick="downloadShareImage('${winner}')">
              ${DOWNLOAD_ICON_SVG} Download Image
            </button>
          </div>
          <p class="share-hint">The image is 1080×1920 — ready to share on social media</p>
        </div>

        <div class="cta-box">
          <div class="cta-title">FIND OUT MORE!</div>
          <div class="cta-row">
            <a href="https://francescahong.com/policy" target="_blank" class="cta-btn">Read more about Fran's policies →</a>
          </div>
        </div>
        ${isShared ? '' : '<button class="btn-restart" onclick="restartQuiz()">↺ TAKE IT AGAIN</button>'}
      </div>
    </div>
  `;

  return { html, barTargets };
}

// ─────────────────────────────────────────
// MAIN RENDER DISPATCHER
// ─────────────────────────────────────────

function render() {
  const app = document.getElementById('app');

  if (screen === 'intro') {
    renderIntro();
    return;
  }

  if (screen === 'quiz') {
    renderQuiz();
    return;
  }

  if (screen === 'results' || screen === 'shared') {
    const forcedWinner = screen === 'shared' ? answers._sharedWinner : null;
    const { html, barTargets } = renderResults(forcedWinner);
    app.innerHTML = html;

    if (barTargets.length) {
      setTimeout(() => {
        document.querySelectorAll('.tally-bar-fill').forEach((el, i) => {
          el.style.transition = `width .65s cubic-bezier(.4, 0, .2, 1) ${i * 80}ms`;
          el.style.width = `${barTargets[i]}%`;
        });
      }, 80);
    }
  }
}

// ─────────────────────────────────────────
// INIT — check URL hash for a shared result
// ─────────────────────────────────────────

(function init() {
  const match  = window.location.hash.match(/^#result=([a-z]+)$/);
  const shared = match?.[1];

  if (shared && POLICIES[shared]) {
    screen = 'shared';
    answers._sharedWinner = shared;
  }

  render();
})();


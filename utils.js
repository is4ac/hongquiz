// ─────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────

/** Fisher-Yates shuffle — returns a new array, never mutates the original. */
function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Tally all answers and return the winning policy key plus the full tally map.
 * @returns {{ winner: string, tally: Record<string, number> }}
 */
function getResult() {
  const tally = Object.fromEntries(Object.keys(POLICIES).map(k => [k, 0]));
  answers.forEach(key => { if (key) tally[key]++; });
  const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  return { winner, tally };
}

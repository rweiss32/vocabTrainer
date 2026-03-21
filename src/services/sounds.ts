let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function gain(ac: AudioContext, value: number) {
  const g = ac.createGain();
  g.gain.value = value;
  g.connect(ac.destination);
  return g;
}

export function playClick() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const g = gain(ac, 0.08);
  osc.connect(g);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(900, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.06);
  g.gain.setValueAtTime(0.08, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.06);
}

export function playFlip() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const g = gain(ac, 0.06);
  osc.connect(g);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ac.currentTime + 0.12);
  g.gain.setValueAtTime(0.06, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.12);
}

export function playCorrect() {
  const ac = getCtx();
  const notes = [520, 660, 780];
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const g = gain(ac, 0.08);
    osc.connect(g);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ac.currentTime + i * 0.1;
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

export function playWrong() {
  const ac = getCtx();
  const notes = [300, 250];
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const g = gain(ac, 0.07);
    osc.connect(g);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ac.currentTime + i * 0.12;
    g.gain.setValueAtTime(0.07, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

export function playMatch() {
  const ac = getCtx();
  const notes = [440, 550, 660];
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const g = gain(ac, 0.07);
    osc.connect(g);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = ac.currentTime + i * 0.08;
    g.gain.setValueAtTime(0.07, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.start(t);
    osc.stop(t + 0.18);
  });
}

// Chord names ("F", "Em", "G7", "Cmaj7", "Am7", "Dsus4") -> notes. Plain Web Audio code
// needs frequencies, so everything here ends in MIDI numbers (60 = middle C).

const PITCH = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

const QUALITIES = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  7: [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
};

export function parseChord(name) {
  const match = /^([A-G][#b]?)(.*)$/.exec(name.trim());
  if (!match || !(match[1] in PITCH) || !(match[2] in QUALITIES)) {
    throw new Error(
      `Unknown chord "${name}". Use a root (C, F#, Bb...) plus m, 7, maj7, m7, sus2 or sus4.`,
    );
  }
  return { name, root: PITCH[match[1]], intervals: QUALITIES[match[2]] };
}

export const midiToFreq = (midi) => 440 * 2 ** ((midi - 69) / 12);

// Bass note: the chord root somewhere between G1 and F#2.
export function bassNote(chord) {
  let midi = 24 + chord.root;
  if (midi < 31) midi += 12;
  return midi;
}

// Picks the inversion that stays closest to the previous chord, so the pads glide
// instead of jumping around. Lowest note sits between G3 and F#4.
export function voiceChord(chord, previous) {
  const pitches = chord.intervals.map((i) => (chord.root + i) % 12);
  const target = previous ? previous.reduce((a, b) => a + b, 0) / previous.length : 66;
  let best = null;
  for (let r = 0; r < pitches.length; r += 1) {
    const order = pitches.slice(r).concat(pitches.slice(0, r));
    let note = 55;
    while (note % 12 !== order[0]) note += 1;
    const notes = [note];
    for (let k = 1; k < order.length; k += 1) {
      let next = notes[k - 1] + 1;
      while (next % 12 !== order[k]) next += 1;
      notes.push(next);
    }
    const centroid = notes.reduce((a, b) => a + b, 0) / notes.length;
    const score = Math.abs(centroid - target) + (notes[notes.length - 1] > 79 ? 20 : 0);
    if (!best || score < best.score) best = { notes, score };
  }
  return best.notes;
}

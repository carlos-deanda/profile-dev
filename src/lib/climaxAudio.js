// Generated music for the climax scene: bright festival house at a fixed tempo, built from
// plain Web Audio nodes (no samples, no libraries). Everything is scheduled ahead of time
// on the audio clock, so it stays in time no matter what the page is doing.
//
// Modes (a mode only changes at the start of a bar, so changes always land on time):
//   'buildup' chords through a low-pass filter that opens with the scroll, a white-noise riser
//             that climbs, and a snare roll that speeds up. No kick yet.
//   'drop'    crash, four-on-the-floor kick, clap on 2 and 4, off-beat open hat, supersaw chords
//             that duck with the kick (sidechain), off-beat bass and a bright arpeggio
//   'soft'    only the chords and a gentler arpeggio
// `build` (0..1) says how far into the build-up the visitor has scrolled.

import { parseChord, voiceChord, bassNote, midiToFreq } from './chords.js';

const STEPS_PER_BAR = 16; // sixteenth notes
const LEVEL = 1.75; // master level when not muted (after the compressor squashes the peaks)

function makeNoise(ctx) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// Buses + master chain. Also used with an OfflineAudioContext to measure the mix.
export function createMixer(ctx, { bpm }) {
  const beat = 60 / bpm;
  const master = ctx.createGain();
  master.gain.value = LEVEL;
  const compressor = ctx.createDynamicsCompressor();
  // Glue and loudness: squash the kick peaks so the whole mix can sit higher without clipping.
  compressor.threshold.value = -22;
  compressor.knee.value = 8;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.002;
  compressor.release.value = 0.14;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024; // 512 bins of ~43 Hz: enough resolution to tell kick from bass
  analyser.smoothingTimeConstant = 0.7;
  // Everything meets at `tap`, which feeds both the master chain and the analyser, so the
  // bars keep dancing to the music even while the sound is muted.
  const tap = ctx.createGain();
  tap.connect(master);
  tap.connect(analyser);
  master.connect(compressor);
  compressor.connect(ctx.destination);

  const bus = (gain) => {
    const node = ctx.createGain();
    node.gain.value = gain;
    node.connect(tap);
    return node;
  };
  // The buses that "breathe" with the kick are separate nodes so each can duck on its own.
  const chords = ctx.createGain();
  // The build-up filter lives between the chords and the mix. It stays wide open outside the build-up.
  const chordFilter = ctx.createBiquadFilter();
  chordFilter.type = 'lowpass';
  chordFilter.frequency.value = 20000;
  chordFilter.Q.value = 0.9;
  chords.connect(chordFilter);
  chordFilter.connect(tap);
  const bass = bus(1);
  const arp = bus(1);
  const drums = bus(1);

  // Riser: looped noise through a band-pass that sweeps up, only audible during the build-up.
  const riserFilter = ctx.createBiquadFilter();
  riserFilter.type = 'bandpass';
  riserFilter.frequency.value = 350;
  riserFilter.Q.value = 1.1;
  const riserGain = ctx.createGain();
  riserGain.gain.value = 0.0001;
  riserFilter.connect(riserGain);
  riserGain.connect(tap);

  // Echo on the arpeggio: a dotted eighth, with a darker repeat each time.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = beat * 0.75;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.34;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 3200;
  const send = ctx.createGain();
  send.gain.value = 0.38;
  arp.connect(send);
  send.connect(delay);
  delay.connect(tone);
  tone.connect(feedback);
  feedback.connect(delay);
  tone.connect(tap);

  return {
    ctx,
    beat,
    master,
    analyser,
    chords,
    chordFilter,
    bass,
    arp,
    drums,
    riserFilter,
    riserGain,
    riserSource: null,
    noise: makeNoise(ctx),
    state: { build: 0, filterLive: false, riserOn: false },
  };
}

// Sidechain: drop a bus's level when the kick hits and let it swell back by the next beat.
export function duck(param, t, depth, release) {
  param.setValueAtTime(depth, t);
  param.linearRampToValueAtTime(1, t + release);
}

function noiseSource(mix, t, length) {
  const src = mix.ctx.createBufferSource();
  src.buffer = mix.noise;
  src.start(t, Math.random() * 0.5, length);
  return src;
}

function kick(mix, t, level = 1) {
  const { ctx } = mix;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(165, t);
  osc.frequency.exponentialRampToValueAtTime(48, t + 0.11);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(level, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
  osc.connect(env);
  env.connect(mix.drums);
  osc.start(t);
  osc.stop(t + 0.36);
  // A tiny click on top so the kick is audible on small speakers.
  const click = noiseSource(mix, t, 0.008);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2200;
  const clickEnv = ctx.createGain();
  clickEnv.gain.setValueAtTime(0.16 * level, t);
  clickEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
  click.connect(hp);
  hp.connect(clickEnv);
  clickEnv.connect(mix.drums);
}

function clap(mix, t, level = 0.62) {
  const { ctx } = mix;
  const src = noiseSource(mix, t, 0.3);
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1350;
  band.Q.value = 0.8;
  const env = ctx.createGain();
  // Three quick slaps, then the tail of the room.
  env.gain.setValueAtTime(0.0001, t);
  [0, 0.012, 0.024].forEach((o) => {
    env.gain.linearRampToValueAtTime(level, t + o + 0.001);
    env.gain.linearRampToValueAtTime(level * 0.2, t + o + 0.011);
  });
  env.gain.linearRampToValueAtTime(level * 0.9, t + 0.037);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  src.connect(band);
  band.connect(env);
  env.connect(mix.drums);
}

function openHat(mix, t, level = 0.36) {
  const { ctx } = mix;
  const src = noiseSource(mix, t, 0.25);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7200;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(level, t + 0.003);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
  src.connect(hp);
  hp.connect(env);
  env.connect(mix.drums);
}

// The snare of the build-up roll: a burst of band-passed noise over a short tone.
function snare(mix, t, level) {
  const { ctx } = mix;
  const src = noiseSource(mix, t, 0.2);
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1900;
  band.Q.value = 0.7;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(level, t + 0.002);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  src.connect(band);
  band.connect(env);
  env.connect(mix.drums);
  const tone = ctx.createOscillator();
  tone.type = 'triangle';
  tone.frequency.setValueAtTime(220, t);
  tone.frequency.exponentialRampToValueAtTime(150, t + 0.06);
  const toneEnv = ctx.createGain();
  toneEnv.gain.setValueAtTime(0.0001, t);
  toneEnv.gain.exponentialRampToValueAtTime(level * 0.45, t + 0.002);
  toneEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  tone.connect(toneEnv);
  toneEnv.connect(mix.drums);
  tone.start(t);
  tone.stop(t + 0.1);
}

// The hit that lands the drop: a long crash and a deep boom under the first kick.
function crash(mix, t) {
  const { ctx } = mix;
  const src = noiseSource(mix, t, 1.9);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 4500;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.42, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
  src.connect(hp);
  hp.connect(env);
  env.connect(mix.drums);
  const boom = ctx.createOscillator();
  boom.type = 'sine';
  boom.frequency.setValueAtTime(75, t);
  boom.frequency.exponentialRampToValueAtTime(32, t + 0.55);
  const boomEnv = ctx.createGain();
  boomEnv.gain.setValueAtTime(0.0001, t);
  boomEnv.gain.exponentialRampToValueAtTime(0.55, t + 0.01);
  boomEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  boom.connect(boomEnv);
  boomEnv.connect(mix.drums);
  boom.start(t);
  boom.stop(t + 0.95);
}

// The riser is a looped noise source that runs for as long as the build-up does.
function startRiser(mix, t) {
  if (mix.riserSource) return;
  const src = mix.ctx.createBufferSource();
  src.buffer = mix.noise;
  src.loop = true;
  src.connect(mix.riserFilter);
  src.start(t);
  mix.riserSource = src;
}

function stopRiser(mix, t) {
  if (!mix.riserSource) return;
  mix.riserGain.gain.setTargetAtTime(0.0001, t, 0.012); // cut hard, right at the drop
  mix.riserSource.stop(t + 0.2);
  mix.riserSource = null;
}

// Follows the scroll through the build-up: the chord filter opens, the riser gets louder and
// brighter. `t` is when to apply it, `tc` how smoothly.
export function applyBuild(mix, build, t, tc = 0.05) {
  const b = Math.min(1, Math.max(0, build));
  mix.state.build = b;
  if (mix.state.filterLive) {
    mix.chordFilter.frequency.setTargetAtTime(260 * (9800 / 260) ** (b ** 1.2), t, tc);
  }
  mix.riserFilter.frequency.setTargetAtTime(350 * (8500 / 350) ** b, t, tc);
  mix.riserGain.gain.setTargetAtTime(mix.state.riserOn ? 0.0001 + 0.42 * b * b : 0.0001, t, tc);
}

// Supersaw chord: five slightly detuned saws per note, softened by a low-pass filter.
const SUPERSAW_DETUNE = [-16, -8, 0, 8, 16];
function superChord(mix, t, notes, duration, level) {
  const { ctx } = mix;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(level, t + 0.025);
  env.gain.setValueAtTime(level, t + duration - 0.1);
  env.gain.linearRampToValueAtTime(0.0001, t + duration + 0.06);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 6500;
  lp.Q.value = 0.5;
  env.connect(lp);
  lp.connect(mix.chords);
  const perOsc = 1 / (notes.length * SUPERSAW_DETUNE.length);
  notes.forEach((midi) => {
    SUPERSAW_DETUNE.forEach((cents) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = midiToFreq(midi);
      osc.detune.value = cents;
      const g = ctx.createGain();
      g.gain.value = perOsc;
      osc.connect(g);
      g.connect(env);
      osc.start(t);
      osc.stop(t + duration + 0.1);
    });
  });
}

function bassHit(mix, t, midi, duration, level = 0.36) {
  const { ctx } = mix;
  const freq = midiToFreq(midi);
  const saw = ctx.createOscillator();
  saw.type = 'sawtooth';
  saw.frequency.value = freq;
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = freq;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 420;
  lp.Q.value = 1.1;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(level, t + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  const sawLevel = ctx.createGain();
  sawLevel.gain.value = 0.45;
  saw.connect(sawLevel);
  sawLevel.connect(lp);
  lp.connect(env);
  sub.connect(env);
  env.connect(mix.bass);
  saw.start(t);
  sub.start(t);
  saw.stop(t + duration + 0.05);
  sub.stop(t + duration + 0.05);
}

function pluck(mix, t, midi, level) {
  const { ctx } = mix;
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = midiToFreq(midi);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 2;
  lp.frequency.setValueAtTime(7500, t);
  lp.frequency.exponentialRampToValueAtTime(1800, t + 0.13);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(level, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  osc.connect(lp);
  lp.connect(env);
  env.connect(mix.arp);
  osc.start(t);
  osc.stop(t + 0.22);
}

// Arpeggio pattern over six chord tones (the voicing plus its octave).
const ARP = [0, 1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 1];

// Voicings for every chord, chosen so neighbours stay close together.
export function planChords(progression) {
  const chords = progression.map(parseChord);
  const voicings = [];
  chords.forEach((chord, i) => {
    voicings.push(voiceChord(chord, i === 0 ? null : voicings[i - 1]));
  });
  return { chords, voicings };
}

// What changes when a new mode begins (always at the first step of a bar).
function enterMode(mix, mode, previous, t) {
  if (mode === 'buildup') {
    mix.state.filterLive = true;
    mix.state.riserOn = true;
    startRiser(mix, t);
    applyBuild(mix, mix.state.build, t, 0.01);
  } else {
    mix.state.filterLive = false;
    mix.state.riserOn = false;
    mix.chordFilter.frequency.cancelScheduledValues(t);
    mix.chordFilter.frequency.setValueAtTime(20000, t); // the filter snaps fully open
    stopRiser(mix, t);
    if (mode === 'drop' && previous === 'buildup') crash(mix, t);
  }
}

// Schedules everything that happens on one sixteenth-note step.
export function scheduleStep(mix, plan, t, stepAbs, mode) {
  const stepDur = mix.beat / 4;
  const bar = Math.floor(stepAbs / STEPS_PER_BAR);
  const s = stepAbs % STEPS_PER_BAR;
  const i = bar % plan.chords.length;
  const voicing = plan.voicings[i];

  if (s === 0) {
    const barLen = STEPS_PER_BAR * stepDur;
    const level = { buildup: 0.5, drop: 0.95, soft: 0.38 }[mode];
    superChord(mix, t, voicing.concat([voicing[0] + 12]), barLen, level);
  }

  if (mode === 'buildup') {
    // A roll that gets denser and louder as you scroll: quarters, eighths, sixteenths, then 32nds.
    const b = mix.state.build;
    if (b > 0.1) {
      const every = b > 0.55 ? 1 : b > 0.28 ? 2 : 4;
      const level = 0.12 + 0.5 * b;
      if (s % every === 0) snare(mix, t, level);
      if (b > 0.82) snare(mix, t + stepDur / 2, level * 0.9);
    }
    return;
  }

  if (mode === 'drop') {
    if (s % 4 === 0) {
      kick(mix, t, 0.8);
      // The pump: pads and bass dive on every kick and swell back before the next one.
      duck(mix.chords.gain, t, 0.16, mix.beat * 0.8);
      duck(mix.bass.gain, t, 0.3, mix.beat * 0.5);
      duck(mix.arp.gain, t, 0.55, mix.beat * 0.6);
    }
    if (s === 4 || s === 12) clap(mix, t);
    if (s % 4 === 2) {
      openHat(mix, t);
      bassHit(mix, t, bassNote(plan.chords[i]), stepDur * 1.7);
    }
  }

  const tones = voicing.concat(voicing.map((n) => n + 12));
  if (mode === 'drop') pluck(mix, t, tones[ARP[s]] + 12, 0.26);
  else if (s % 2 === 0) pluck(mix, t, tones[ARP[s]] + 12, 0.1);
}

// Walks the song one step at a time and switches mode only on the first step of a bar, so a
// change requested mid-bar always lands exactly on the next bar line. The live engine and the
// offline measurements both use this, so what is measured is what plays.
export function createSequencer(mix, plan) {
  let mode = null;
  return {
    schedule(t, step, wanted) {
      const barStart = step % STEPS_PER_BAR === 0;
      let fresh = false;
      if (barStart && wanted !== mode) {
        const previous = mode;
        mode = wanted;
        fresh = true;
        enterMode(mix, mode, previous, t);
      }
      scheduleStep(mix, plan, t, step, mode);
      return {
        barStart,
        fresh,
        mode,
        chordIndex: Math.floor(step / STEPS_PER_BAR) % plan.chords.length,
      };
    },
  };
}

// `getState()` is asked every 25 ms for what the scroll wants: { mode, build }.
export function createClimaxAudio({ ctx, bpm, progression, getState }) {
  const mix = createMixer(ctx, { bpm });
  const plan = planChords(progression);
  const stepDur = mix.beat / 4;
  let sequencer = createSequencer(mix, plan);
  let step = 0;
  let nextTime = 0;
  let timer = null;
  let muted = false;
  let stopTimer = null;
  let lastBuild = -1;
  const modeEvents = []; // when each mode becomes audible
  const chordEvents = []; // one per bar, for the visuals to react to

  // Look-ahead scheduler: every 25 ms, queue whatever falls in the next ~140 ms.
  function tick() {
    const wanted = getState();
    if (Math.abs(wanted.build - lastBuild) > 0.003) {
      applyBuild(mix, wanted.build, ctx.currentTime, 0.06);
      lastBuild = wanted.build;
    }
    const horizon = ctx.currentTime + 0.14;
    while (nextTime < horizon) {
      const info = sequencer.schedule(nextTime, step, wanted.mode);
      if (info.fresh) modeEvents.push({ mode: info.mode, time: nextTime });
      if (info.barStart) {
        chordEvents.push({
          time: nextTime,
          index: info.chordIndex,
          mode: info.mode,
          fresh: info.fresh,
        });
      }
      step += 1;
      nextTime += stepDur;
    }
    if (modeEvents.length > 8) modeEvents.splice(0, modeEvents.length - 8);
    if (chordEvents.length > 64) chordEvents.splice(0, chordEvents.length - 64);
  }

  return {
    ctx,
    get running() {
      return timer !== null;
    },
    start() {
      if (timer) return;
      clearTimeout(stopTimer);
      sequencer = createSequencer(mix, plan);
      modeEvents.length = 0;
      chordEvents.length = 0;
      step = 0;
      nextTime = ctx.currentTime + 0.1;
      lastBuild = -1;
      mix.master.gain.cancelScheduledValues(ctx.currentTime);
      mix.master.gain.setValueAtTime(0.0001, ctx.currentTime);
      mix.master.gain.linearRampToValueAtTime(muted ? 0.0001 : LEVEL, ctx.currentTime + 0.5);
      tick();
      timer = setInterval(tick, 25);
    },
    // Fades out, then stops scheduling. Safe to call again later with start().
    stop(fade = 1.6) {
      if (!timer) return;
      mix.master.gain.cancelScheduledValues(ctx.currentTime);
      mix.master.gain.setValueAtTime(mix.master.gain.value, ctx.currentTime);
      mix.master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fade);
      stopTimer = setTimeout(
        () => {
          clearInterval(timer);
          timer = null;
          stopRiser(mix, ctx.currentTime);
          mix.state.riserOn = false;
        },
        fade * 1000 + 50,
      );
    },
    setMuted(value) {
      muted = value;
      mix.master.gain.cancelScheduledValues(ctx.currentTime);
      mix.master.gain.setTargetAtTime(value ? 0.0001 : LEVEL, ctx.currentTime, 0.05);
    },
    // The mode you can hear right now (it lags the scroll by up to one bar).
    audibleMode() {
      let current = null;
      modeEvents.forEach((event) => {
        if (event.time <= ctx.currentTime) current = event.mode;
      });
      return current;
    },
    // Bar lines that have just been heard, for the visuals to react to.
    drainChordEvents() {
      const due = [];
      while (chordEvents.length && chordEvents[0].time <= ctx.currentTime) {
        due.push(chordEvents.shift());
      }
      return due;
    },
    spectrum(into) {
      mix.analyser.getByteFrequencyData(into);
    },
    get spectrumSize() {
      return mix.analyser.frequencyBinCount;
    },
  };
}

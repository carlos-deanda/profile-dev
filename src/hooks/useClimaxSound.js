import { useCallback, useEffect, useRef, useState } from 'react';
import { climax } from '../data/profile';

// Optional sound for the climax scene. Nothing here runs until the visitor presses play:
// the audio engine is a separate chunk that is only downloaded at that moment, and the
// AudioContext is only created inside the click.
//
// `stageRef` is the element that is on screen while the scene is. When it leaves the screen the
// music fades out and stops; when it comes back (and sound was on) it starts again.
export default function useClimaxSound(stageRef) {
  const [status, setStatus] = useState('off'); // 'off' | 'loading' | 'on'
  const [muted, setMuted] = useState(false);
  const engine = useRef(null);
  const ctx = useRef(null);
  const mutedRef = useRef(false);
  // What the scroll wants the music to be doing; the scene updates it every frame and the
  // engine reads it every 25 ms. Defaults to the full drop (used when there is no scroll sync).
  const stateRef = useRef({ mode: 'drop', build: 1 });

  const play = useCallback(async () => {
    if (status !== 'off') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    // Created and resumed right inside the click, before the async import below. Safari only
    // allows audio to start from the click itself.
    const context = new AudioContext();
    context.resume();
    ctx.current = context;
    setStatus('loading');
    try {
      const { createClimaxAudio } = await import('../lib/climaxAudio.js');
      engine.current = createClimaxAudio({
        ctx: context,
        bpm: climax.bpm,
        progression: climax.progression,
        getState: () => stateRef.current,
      });
      engine.current.start();
      setStatus('on');
    } catch {
      context.close();
      ctx.current = null;
      setStatus('off');
    }
  }, [status]);

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      mutedRef.current = !current;
      engine.current?.setMuted(!current);
      return !current;
    });
  }, []);

  // Fade out when the scene leaves the screen, and come back when it returns.
  useEffect(() => {
    const element = stageRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!engine.current) return;
      if (entry.isIntersecting) engine.current.start();
      else engine.current.stop();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [stageRef]);

  useEffect(
    () => () => {
      engine.current?.stop(0.1);
      const context = ctx.current;
      if (context) setTimeout(() => context.close(), 300);
    },
    [],
  );

  return { status, muted, play, toggleMute, engineRef: engine, mutedRef, stateRef };
}

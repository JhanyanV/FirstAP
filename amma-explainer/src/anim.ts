import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './script';

/** 0 → 1 spring starting at `delay` frames. */
export const pop = (frame: number, delay = 0, damping = 14) =>
  spring({frame: frame - delay, fps: FPS, config: {damping, mass: 0.8, stiffness: 120}});

/** Linear-eased 0 → 1 over `duration` frames starting at `delay`. */
export const ramp = (frame: number, delay: number, duration: number) =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

/** Fades a scene in over its first frames and out over its last frames. */
export const sceneOpacity = (frame: number, duration: number, edge = 10) =>
  interpolate(frame, [0, edge, duration - edge, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

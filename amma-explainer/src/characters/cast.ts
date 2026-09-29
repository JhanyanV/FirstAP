import type {PersonStyle} from './Person';

// The three invented characters used throughout the video.

export const GEOLOGIST: PersonStyle = {
  skin: '#C68A5E',
  hair: '#2B1B14',
  hairStyle: 'ponytail',
  shirt: '#3B6E8F',
  pants: '#4A3B2E',
  shoes: '#2A1E16',
  vest: {color: '#C9A46A', kind: 'field'},
  hat: {kind: 'fieldhat', color: '#B98E55'},
  backpack: '#8C5A3C',
  prop: 'hammer',
};

export const ENGINEER: PersonStyle = {
  skin: '#EAC4A0',
  hair: '#6B4A2E',
  hairStyle: 'short',
  shirt: '#1C3D6B',
  pants: '#0E284B',
  shoes: '#1A1A1A',
  vest: {color: '#E8B53C', kind: 'hivis'},
  hat: {kind: 'hardhat', color: '#FFFFFF'},
  prop: 'tablet',
};

export const STUDENT: PersonStyle = {
  skin: '#8D5A3B',
  hair: '#1A1110',
  hairStyle: 'curly',
  shirt: '#D2AC67',
  pants: '#2E5286',
  shoes: '#F2F2F2',
  glasses: true,
  backpack: '#0E284B',
  prop: 'books',
};

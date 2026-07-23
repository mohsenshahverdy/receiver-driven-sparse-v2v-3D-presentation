// Change to 'night' for the original dark presentation environment.
export const SCENE_CONFIG = {
  theme: 'day',
  showPedestrians: true,
  showStreetFurniture: true,
  repoInspiredDetails: true,
};

export const THEMES = {
  day: {
    sky: '#cbdde3', fog: '#d7e2e2', ground: '#aeb4af', road: '#51595a',
    sidewalk: '#cccac2', lane: '#eee9d7', ambient: 1.12, sun: 2.8,
  },
  night: {
    sky: '#071012', fog: '#071012', ground: '#121a1b', road: '#242b2d',
    sidewalk: '#596264', lane: '#e3dfbd', ambient: .55, sun: 2.6,
  },
};

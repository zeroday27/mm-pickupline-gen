const tokens = ['bg','surface','ink','muted','line','line-soft','disabled','pop','lilac','lilac-ink','staging','reviewed','approved','rejected'];
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {extend: {colors: Object.fromEntries(tokens.map(token=>[token,'var(--'+token+')']))}},
  plugins: []
};

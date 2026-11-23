export const interests = 'movies music tech gaming football food travel books sports art fitness photography nature cooking dancing business education health beauty fashion pets science history other'.split(' ');
export const vibes = 'funny flirty cute romantic bold cheesy poetic sarcastic'.split(' ');
export const styles = [...vibes, 'sweet', 'other'];
export const statuses = ['staging','reviewed','approved','rejected'];
export const title = text => text.charAt(0).toUpperCase() + text.slice(1);
export const vibeLabel = value => value === 'any' ? 'Any vibe' : title(value);

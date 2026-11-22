import React, { useState, useEffect } from 'react';
import { identities, title } from './options';

const burmese = [
  'စဉ်းစားနေပါတယ်...',
  'အကောင်းဆုံး pickup line ရွေးနေပါတယ်...',
  'နှလုံးသားလေး ခုန်မြန်လာအောင် ကြိုးစားနေပါတယ်...'
];

function Sparkle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" />
    </svg>
  );
}

export default function LoadingAnimation({ picks, reroll, duration = 2400 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(v => v + 1), Math.max(250, duration / 4));
    return () => clearInterval(id);
  }, [duration]);
  const messages = [
    'reading the vibe…',
    'mixing ' + picks.interest + ' × ' + picks.vibe + '…',
    'checking rizz levels…',
    'almost there…'
  ];
  const stickers = [identities[picks.identity], title(picks.interest), title(picks.vibe)];
  return (
    <div className="thinkingView" role="status" style={{ '--dur': duration + 'ms' }}>
      <small>{reroll ? 'shuffling' : 'cooking your line'}</small>
      <div className="orbit" aria-hidden="true">
        <Sparkle className="spark" />
        <Sparkle className="spark second" />
        <div className="bubble"><i /><i /><i /></div>
        {stickers.map((v, n) => (
          <span key={n} className={'track track' + n}><b className={'sat sat' + n}>{v}</b></span>
        ))}
      </div>
      <h2 key={i}>{messages[Math.min(i, 3)]}</h2>
      <p lang="my">{burmese[i % 3]}</p>
      <div className="progress"><i /></div>
    </div>
  );
}

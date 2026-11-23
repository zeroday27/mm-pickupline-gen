import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Share2, MessageCircle, RefreshCw } from 'lucide-react';
import { title, vibeLabel } from './options';

function TypedLine({ text }) {
  // Split on spaces and fade each word in; whitespace stays so the full height is reserved.
  let word = 0;
  return (
    <p lang="my" aria-label={text}>
      {text.split(/(\s+)/).map((token, i) => {
        if (!token.trim()) return token;
        const delay = 250 + word++ * 100;
        return <span aria-hidden="true" key={i} style={{ animationDelay: delay + 'ms' }}>{token}</span>;
      })}
    </p>
  );
}

export default function PickupLineResults({ line, picks, count, back, generate }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(line.text);
      setCopied(true);
      setError('');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setError('Copy unavailable. Select the line to copy it.');
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ text: line.text, title: 'Burmese pickup line' });
      } catch (e) {
        if (e.name !== 'AbortError') setError('Sharing unavailable. Try copying the line.');
      }
      return;
    }
    // Existing fallback: copy the line, then open the Facebook sharer with it as the quote.
    await copy();
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href) + '&quote=' + encodeURIComponent(line.text),
      '_blank', 'noopener,noreferrer'
    );
  }

  function messenger() {
    window.open('fb-messenger://share?link=' + encodeURIComponent(line.text), '_blank', 'noopener,noreferrer');
  }

  const insights = [
    ['Why it hits', line.insight?.whyItWorks],
    ['Then say', line.insight?.followUp],
    ['Use when', line.insight?.bestUsedWhen]
  ].filter(([, v]) => v);

  return (
    <div className="stagebody result">
      <header>
        <button className="circle" aria-label="Back to picks" onClick={back}><ArrowLeft /></button>
        <h2>your line</h2>
        <b className="badge">No. {String(count).padStart(2, '0')}</b>
      </header>
      <div className="resultScroll">
        <div className="tags">
          <b className="tag-interest">{title(line.category)}</b>
          <b className="tag-vibe">{title(line.style)}</b>
        </div>
        <article className="linecard" key={count}>
          <b className="sticker cap">no cap</b>
          <small>Say this</small>
          <TypedLine text={line.text} />
        </article>
        {insights.length > 0 && (
          <dl>{insights.map(([k, v]) => <div key={k}><dt>{k}</dt><dd lang="my">{v}</dd></div>)}</dl>
        )}
      </div>
      {error && <p className="inlineError" role="alert">{error}</p>}
      <div className="actions">
        <div>
          <button className={'ink copy' + (copied ? ' copied' : '')} onClick={copy}>
            {copied ? <span className="tick"><Check size={18} /></span> : <Copy />}
            <span aria-live="polite">{copied ? 'Copied' : 'Copy line'}</span>
          </button>
          <button className="circle" aria-label="Share line" onClick={share}><Share2 /></button>
          <button className="circle" aria-label="Send with Messenger" onClick={messenger}><MessageCircle /></button>
        </div>
        {line.remaining > 0
          ? <button className="lime another" onClick={generate}><RefreshCw />Another one ({line.remaining} left)</button>
          : <>
            <small role="status">You’ve seen all {line.total} for {title(line.category)} · {vibeLabel(picks.vibe)}.</small>
            <button className="lime another" onClick={back}>Choose another vibe or interest</button>
          </>}

      </div>
    </div>
  );
}

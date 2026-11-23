import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Share2, MessageCircle, RefreshCw } from 'lucide-react';
import { createPostcard } from '../lib/postcard';
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
  const dialog = useRef(null);
  const [card, setCard] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [prepareFailed, setPrepareFailed] = useState(false);
  useEffect(() => {
    let active = true;
    let url;
    createPostcard(line).then(file => {
      if (!active) return;
      url = URL.createObjectURL(file);
      setCard({ file, url });
    }).catch(() => {
      if (active) setPrepareFailed(true);
    });
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [line, attempt]);
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
    setError('');
    if (!card) return;
    const data = { files: [card.file] };
    try {
      if (navigator.share && navigator.canShare?.(data)) {
        await navigator.share(data);
        return;
      }
    } catch (cause) {
      if (cause.name === 'AbortError') return;
    }
    dialog.current.showModal();
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
          <TypedLine text={line.text} />
          <div className="postcardCredit">made with ❤️ by <strong>Yangon AI</strong></div>
        </article>
        {insights.length > 0 && (
          <dl>{insights.map(([k, v]) => <div key={k}><dt>{k}</dt><dd lang="my">{v}</dd></div>)}</dl>
        )}
      </div>
      {error && <p className="inlineError" role="alert">{error}</p>}
      {prepareFailed && <div className="inlineError" role="alert">Couldn’t prepare the postcard.{' '}
        <button onClick={() => { setPrepareFailed(false); setAttempt(n => n + 1); }}>Retry postcard</button>
      </div>}
      <dialog ref={dialog} className="postcardDialog" aria-label="Save postcard">
        <header><h2>Save postcard</h2><button onClick={() => dialog.current.close()}>Close</button></header>
        {card && <>
          <img src={card.url} alt={line.text} lang="my" />
          <p>Save the image to attach it in your chat.</p>
          <a className="ink" download={card.file.name} href={card.url}>Save PNG</a>
        </>}
      </dialog>
      <div className="actions">
        <div>
          <button className={'ink copy' + (copied ? ' copied' : '')} onClick={copy}>
            {copied ? <span className="tick"><Check size={18} /></span> : <Copy />}
            <span aria-live="polite">{copied ? 'Copied' : 'Copy text'}</span>
          </button>
          <button className="circle" aria-label="Share postcard" title="Share postcard" disabled={!card} onClick={share}><Share2 /></button>
          <button className="circle" aria-label="Send postcard to chat" title="Send postcard to chat" disabled={!card} onClick={share}><MessageCircle /></button>
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

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { interests, styles, title, vibeLabel } from './options';
import { getCatalogueOptions } from '../lib/api';

export default function PickupLineForm({ picks, update, generate }) {
  const sheet = useRef(null);
  const [options, setOptions] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getCatalogueOptions(controller.signal).then(setOptions).catch(() => {
      if (!controller.signal.aborted) setFailed(true);
    });
    return () => controller.abort();
  }, [attempt]);

  const matches = options?.filter(row => row.category === picks.interest) || [];
  const available = matches.length ? ['any', ...styles.filter(style => matches.some(row => row.style === style))] : [];
  const ready = available.includes(picks.vibe);
  const quick = interests.slice(0, 8);
  if (picks.interest && !quick.includes(picks.interest)) quick[7] = picks.interest;

  function chips(field, values, close = false) {
    return values.map(value => (
      <button type="button" key={value} className={'chip ' + field} aria-pressed={picks[field] === value}
        onClick={() => { update(field, value); if (close) sheet.current.close(); }}>
        {field === 'vibe' ? vibeLabel(value) : title(value)}
      </button>
    ));
  }

  return <form className="stagebody" onSubmit={event => { event.preventDefault(); if (ready) generate(); }}>
    <div className="groups">
      <fieldset><legend>Their thing</legend><div className="chips">
        {chips('interest', quick)}
        <button type="button" className="more" onClick={() => sheet.current.showModal()}>See all <Plus size={14}/></button>
      </div></fieldset>
      <fieldset><legend>The vibe</legend>
        {failed ? <div role="alert">Couldn’t load the available vibes. <button type="button" className="more" onClick={() => { setFailed(false); setAttempt(n => n + 1); }}>Retry</button></div>
          : !picks.interest ? <p>Choose an interest to see its vibes.</p>
          : !options ? <p role="status">Loading vibes…</p>
          : available.length ? <div className="chips">{chips('vibe', available)}</div>
          : <p role="status">No approved {title(picks.interest)} lines yet. Choose another interest.</p>}
      </fieldset>
    </div>
    <button className="shoot" disabled={!ready}>{ready ? 'Shoot my shot' : 'Pick an interest and vibe'}<span><ArrowRight/></span></button>
    <dialog ref={sheet} aria-label="All interests"><header><h2>Their thing</h2><button type="button" className="circle" aria-label="Close interests" onClick={() => sheet.current.close()}><X/></button></header><div className="chips">{chips('interest', interests, true)}</div></dialog>
  </form>;
}

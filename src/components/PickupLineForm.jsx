import React, {useRef} from 'react';
import { ArrowRight, X, Plus } from 'lucide-react';
import {identities, interests, vibes, title} from './options';

export default function PickupLineForm({picks, update, generate}) {
  const sheet = useRef(null);
  function chips(field, values, close=false) {
    return values.map(value => <button type="button" key={value} className={'chip '+field} aria-pressed={picks[field]===value}
      onClick={()=>{update(field,value); if(close) sheet.current.close();}}>{field==='identity'?identities[value]:title(value)}</button>);
  }
  const quick = interests.slice(0,8);
  if(picks.interest && !quick.includes(picks.interest)) quick[7]=picks.interest;
  const ready = Object.values(picks).every(Boolean);
  return <form className="stagebody" onSubmit={e=>{e.preventDefault();if(ready) generate();}}>
    <div className="groups">
      <fieldset><legend>I am</legend><div className="chips">{chips('identity',Object.keys(identities))}</div></fieldset>
      <fieldset><legend>Their thing</legend><div className="chips">{chips('interest',quick)}<button type="button" className="more" onClick={()=>sheet.current.showModal()}>See all <Plus size={14}/></button></div></fieldset>
      <fieldset><legend>The vibe</legend><div className="chips">{chips('vibe',vibes)}</div></fieldset>
    </div>
    <button className="shoot" disabled={!ready}>{ready?'Shoot my shot':'Pick all three'}<span><ArrowRight/></span></button>
    <dialog ref={sheet} aria-label="All interests"><header><h2>Their thing</h2><button type="button" className="circle" aria-label="Close interests" onClick={()=>sheet.current.close()}><X/></button></header><div className="chips">{chips('interest',interests,true)}</div></dialog>
  </form>;
}

import React, { useState } from 'react';
import { Sparkle } from 'lucide-react';
import { Brand, ThemeToggle } from './ThemeToggle';
import PickupLineForm from './PickupLineForm';
import PickupLineResults from './PickupLineResults';
import LoadingAnimation from './LoadingAnimation';
import { generatePickupLine } from '../lib/api';

const steps = ['pick a vibe', 'get a line', 'shoot your shot'];
const errorText = 'Pickup lines ထုတ်ယူရာတွင် အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်။ ထပ်မံကြိုးစားကြည့်ပါ။';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default function PickupLineGenerator() {
  const [picks, setPicks] = useState({ identity: '', interest: '', vibe: '' });
  const [state, setState] = useState('pick');
  const [line, setLine] = useState(null);
  const [count, setCount] = useState(0);
  const [minimum, setMinimum] = useState(2400);
  const step = state === 'pick' ? 0 : state === 'result' ? 2 : 1;

  async function generate() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = reduced ? 500 : count ? 1300 : 2400;
    setMinimum(ms);
    setState('thinking');
    // Call the API right away; keep the thinking state up for at least `ms`.
    const [response] = await Promise.allSettled([
      generatePickupLine(picks.identity, picks.interest, picks.vibe),
      wait(ms)
    ]);
    if (response.status !== 'fulfilled' || !response.value?.text) {
      setState('error');
      return;
    }
    setLine(response.value);
    setCount(c => c + 1);
    setState('result');
  }

  function back() {
    setState('pick');
    setCount(0);
  }

  return (
    <main className={'public ' + state}>
      <header className="mast">
        <Brand />
        <div className="dots" role="img" aria-label={'Step ' + (step + 1) + ' of 3'}>
          {steps.map((s, i) => <i key={s} className={i === step ? 'active' : ''} />)}
        </div>
        <ThemeToggle />
      </header>
      <div className="studio">
        <section className="intro">
          <span className="sticker origin"><Sparkle size={16} aria-hidden="true" /> made in myanmar</span>
          <h1>rizz, but <span>make it </span><strong>burmese.</strong></h1>
          <p>Pick their thing, pick a vibe. Get a Burmese line that actually lands.</p>
          <ol>
            {steps.map((s, i) => (
              <li key={s} className={i === step ? 'active' : i < step ? 'done' : ''}><b>0{i + 1}</b>{s}</li>
            ))}
          </ol>
        </section>
        <section className="stage" aria-label="Line generator">
          {state === 'pick' && (
            <PickupLineForm picks={picks} update={(field, value) => setPicks(p => ({ ...p, [field]: value }))} generate={generate} />
          )}
          {state === 'thinking' && <LoadingAnimation picks={picks} reroll={count > 0} duration={minimum} />}
          {state === 'result' && <PickupLineResults {...{ line, picks, count, back, generate }} />}
          {state === 'error' && (
            <div className="errorstage">
              <p role="alert" lang="my">{errorText}</p>
              <button className="ink" onClick={generate}>Try again</button>
              <button onClick={back}>Back to picks</button>
            </div>
          )}
        </section>
      </div>
      <footer>Yangon AI <span>Made in Myanmar</span></footer>
    </main>
  );
}

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  function toggle() {
    document.documentElement.classList.toggle('dark', !dark);
    localStorage.setItem('theme', dark ? 'light' : 'dark');
    setDark(!dark);
  }
  return <button className="circle" aria-label="Dark mode" aria-pressed={dark} onClick={toggle}>{dark ? <Sun/> : <Moon/>}</button>;
}
export function Brand() {
  return <a className="brand" href="/"><img alt="" src="/brand/logo-mark.svg"/>Yangon AI</a>;
}

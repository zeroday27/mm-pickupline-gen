import React from 'react';
import { title } from '../options';

export function Select({ label, options, value, onChange, all = false }) {
  return (
    <label className="field">
      {label}
      <select required={!all} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">{all ? 'Any' : 'Select'} {label.toLowerCase()}</option>
        {options.map(x => <option key={x} value={x}>{title(x)}</option>)}
      </select>
    </label>
  );
}

export function Status({ value }) {
  const status = value || 'staging';
  return <b className={'status ' + status}>{title(status)}</b>;
}

import React, { useState } from 'react';
import { ArrowLeft, Trash2, X } from 'lucide-react';
import { interests, styles, title } from '../options';
import { Select, Status } from './fields';

const checklist = ['Natural Burmese', 'Actually fun', 'Respectful', 'Category & style match'];
const clamp = (v, fallback) => (Number.isFinite(Number(v)) ? Math.max(0, Math.min(100, Number(v))) : fallback);
const toTags = tags => (Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

export default function Editor({ line, mobileOpen, close, busy, mutate }) {
  const [draft, setDraft] = useState({ ...line, burmese_text: line.burmese_text || line.text || '', tags: toTags(line.tags) });
  const [checks, setChecks] = useState([]);
  const [tag, setTag] = useState('');
  const [confirming, setConfirming] = useState(false);
  const update = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const text = draft.burmese_text.trim();
  const valid = Boolean(text && draft.category && draft.style);
  const ready = checks.length === checklist.length;

  function save(status) {
    if (!valid || busy || (status === 'approved' && !ready)) return;
    mutate({
      ...draft,
      text,
      burmese_text: text,
      length: draft.length || 'short',
      quality_score: clamp(draft.quality_score, 70),
      safety_score: clamp(draft.safety_score, 95),
      review_status: status
    });
  }

  function addTag(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const t = tag.trim();
    if (t) update('tags', [...new Set([...draft.tags, t])]);
    setTag('');
  }

  return (
    <aside className={'editor panel' + (mobileOpen ? ' open' : '')} aria-label="Line editor">
      <header>
        <button className="circle back" aria-label="Back to queue" onClick={close}><ArrowLeft /></button>
        <div className="editorTitle">
          <h2>{line.fresh ? 'new line' : 'edit line'}</h2>
          <small>{line._id || 'New'} · {draft.length || 'short'}</small>
        </div>
        <Status value={line.review_status} />
        {line._id && <button className="circle" aria-label="Delete line" onClick={() => setConfirming(true)}><Trash2 size={18} /></button>}
      </header>
      <div className="editorScroll">
        {confirming && (
          <div className="confirm" role="alertdialog" aria-label="Confirm delete">
            <b>Delete this line? This can’t be undone.</b>
            <div>
              <button onClick={() => setConfirming(false)}>Cancel</button>
              <button className="danger" disabled={busy} onClick={() => mutate(line, true)}>Delete permanently</button>
            </div>
          </div>
        )}
        <div className="preview">
          <b className="sticker">preview</b>
          <p lang="my">{draft.burmese_text || 'Your Burmese line shows here.'}</p>
        </div>
        <label className="field">Burmese text
          <textarea lang="my" rows={3} value={draft.burmese_text} onChange={e => update('burmese_text', e.target.value)} />
        </label>
        <label className="field">English source
          <textarea rows={2} value={draft.english_source_text || ''} onChange={e => update('english_source_text', e.target.value)} />
        </label>
        <div className="pair">
          <Select label="Category" value={draft.category} options={interests} onChange={v => update('category', v)} />
          <Select label="Style" value={draft.style} options={styles} onChange={v => update('style', v)} />
        </div>
        {['quality_score', 'safety_score'].map(k => (
          <label className="field range" key={k}>
            <span>{title(k.split('_')[0])} <output>{draft[k] ?? 0}</output></span>
            <input type="range" min="0" max="100" value={draft[k] ?? 0} onChange={e => update(k, Number(e.target.value))} />
          </label>
        ))}
        <div className="field">
          <label htmlFor="tag-input">Tags</label>
          <div className="tagBox">
            {draft.tags.map(t => (
              <button type="button" className="tagChip" key={t} aria-label={'Remove tag ' + t} onClick={() => update('tags', draft.tags.filter(x => x !== t))}>
                {t}<X size={14} aria-hidden="true" />
              </button>
            ))}
            <input id="tag-input" placeholder="add tag" value={tag} onChange={e => setTag(e.target.value)} onKeyDown={addTag} />
          </div>
        </div>
        <label className="field">Source URL<input type="url" value={draft.source_url || ''} onChange={e => update('source_url', e.target.value)} /></label>
        <label className="field">License note<input value={draft.license_note || ''} onChange={e => update('license_note', e.target.value)} /></label>
        <fieldset className="checklist">
          <legend>Publish checklist</legend>
          {checklist.map(c => (
            <label key={c}>
              <input type="checkbox" checked={checks.includes(c)} onChange={e => setChecks(e.target.checked ? [...checks, c] : checks.filter(x => x !== c))} />
              {c}
            </label>
          ))}
        </fieldset>
        <button className="saveDraft" disabled={busy || !valid} onClick={() => save('staging')}>Save as staging</button>
        {!valid && <p className="hint">Add Burmese text, a category and a style to save.</p>}
      </div>
      <div className="editorFoot">
        <button disabled={busy || !valid} onClick={() => save('rejected')}>Reject</button>
        <button className="reviewed" disabled={busy || !valid} onClick={() => save('reviewed')}>
          <span className="wide">Mark reviewed</span><span className="narrow">Review</span>
        </button>
        <button className="ink approve" disabled={busy || !valid || !ready} onClick={() => save('approved')}>
          <span className="wide">{ready ? 'Approve & publish' : 'Tick all 4 to publish'}</span>
          <span className="narrow">{ready ? 'Approve' : checks.length + '/4 checked'}</span>
        </button>
      </div>
    </aside>
  );
}

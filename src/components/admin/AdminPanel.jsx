import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Eye, EyeOff, Search, Plus, ChevronRight, User, Check } from 'lucide-react';
import { Brand, ThemeToggle } from '../ThemeToggle';
import { interests, styles, statuses, title } from '../options';
import { Select, Status } from './fields';
import Editor from './EditPickupLineModal';

const resolveApiBase = () => {
  const isLocalBrowser = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const envBase = (import.meta.env.VITE_API_URL || '').trim();
  const fallback = isLocalBrowser
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : window.location.origin;
  const raw = envBase || fallback;
  const noTrailingSlash = raw.replace(/\/+$/, '');
  return noTrailingSlash.replace(/\/api$/, '');
};

const API_BASE = resolveApiBase();
const endpoint = API_BASE + '/api/admin/pickup-lines';
const toastText = {
  approved: 'Published. It’s live now.',
  reviewed: 'Marked as reviewed',
  rejected: 'Line rejected',
  staging: 'Saved to staging'
};

function Login({ onLogin }) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fields = new FormData(e.currentTarget);
    try {
      // Credentials stay in memory only; never logged or persisted.
      const token = btoa(fields.get('username') + ':' + fields.get('password'));
      const res = await fetch(API_BASE + '/api/admin/login', { headers: { Authorization: 'Basic ' + token } });
      if (!res.ok) throw Error('login failed');
      onLogin(token);
    } catch {
      setError('Sign in failed. Check your credentials and try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login">
      <form className="panel" onSubmit={submit}>
        <header><Brand /><b className="badge">Admin</b></header>
        <h1>sign in to the line lab.</h1>
        <label className="field">Username<input autoComplete="username" name="username" required /></label>
        <label className="field">Password
          <span className="password">
            <input autoComplete="current-password" type={visible ? 'text' : 'password'} name="password" required />
            <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>
              {visible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </span>
        </label>
        {error && <p className="inlineError" role="alert">{error}</p>}
        <button disabled={busy} className="shoot">{busy ? 'Signing in…' : 'Sign in'}<span><ArrowRight /></span></button>
      </form>
    </main>
  );
}

function Bar({ value }) {
  return <span className="bar" aria-hidden="true"><i style={{ width: Math.max(0, Math.min(100, value ?? 0)) + '%' }} /></span>;
}

function Queue({ token, logout }) {
  const [filters, setFilters] = useState({ category: '', style: '', search: '', review_status: '' });
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ pickupLines: [], total: 0, pages: 1 });
  const [counts, setCounts] = useState({});
  const [selected, setSelected] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const filter = useCallback((key, v) => {
    setPage(1);
    setFilters(f => ({ ...f, [key]: v }));
    setSelected(null);
    setMobileOpen(false);
  }, []);

  // Debounce search so typing does not fire a burst of requests.
  useEffect(() => {
    const t = setTimeout(() => { if (searchText !== filters.search) filter('search', searchText); }, 250);
    return () => clearTimeout(t);
  }, [searchText, filters.search, filter]);

  useEffect(() => {
    const controller = new AbortController();
    const headers = { Authorization: 'Basic ' + token };
    async function get(status, pageNum) {
      const params = new URLSearchParams({ page: String(pageNum) });
      Object.entries({ ...filters, review_status: status }).forEach(([k, v]) => { if (v) params.set(k, v); });
      const res = await fetch(endpoint + '?' + params, { headers, signal: controller.signal });
      if (res.status === 401) { logout(); throw Error('unauthorized'); }
      if (!res.ok) throw Error('load failed');
      return res.json();
    }
    setLoading(true);
    setError('');
    const keys = ['', ...statuses];
    // One request per tab: the active one at the current page, the rest only for their totals.
    Promise.all(keys.map(s => get(s, s === filters.review_status ? page : 1))).then(results => {
      if (controller.signal.aborted) return;
      const current = results[keys.indexOf(filters.review_status)];
      setCounts(Object.fromEntries(keys.map((s, i) => [s, results[i].total])));
      if (page > Math.max(1, current.pages)) { setPage(Math.max(1, current.pages)); return; }
      setData(current);
      setSelected(prev => prev?.fresh ? prev
        : current.pickupLines.find(x => x._id === prev?._id) || current.pickupLines[0] || null);
    }).catch(() => {
      if (!controller.signal.aborted) setError('Could not load the review queue.');
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [filters, page, revision, token, logout]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  async function mutate(line, remove = false) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      // eslint-disable-next-line no-unused-vars
      const { _id, fresh, ...payload } = line;
      const res = await fetch(endpoint + (_id ? '/' + encodeURIComponent(_id) : ''), {
        method: remove ? 'DELETE' : _id ? 'PUT' : 'POST',
        headers: { Authorization: 'Basic ' + token, 'Content-Type': 'application/json' },
        body: remove ? undefined : JSON.stringify(payload)
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw Error('save failed');
      if (!remove && line.review_status === 'approved') {
        // Jump to the next line still waiting for review in the current filter.
        const next = data.pickupLines.find(x => x._id !== _id && ['staging', 'reviewed'].includes(x.review_status || 'staging'));
        setSelected(next || null);
        setMobileOpen(Boolean(next) && mobileOpen);
      } else {
        setSelected(remove ? null : { _id, ...payload, fresh: false });
        if (remove) setMobileOpen(false);
      }
      setToast({ id: _id, message: remove ? 'Line deleted' : toastText[line.review_status] || 'Saved', key: Date.now() });
      setRevision(n => n + 1);
    } catch {
      setError('Could not save the change. Try again.');
    } finally {
      setBusy(false);
    }
  }

  function create() {
    setSelected({ fresh: true, burmese_text: '', category: '', style: '', review_status: 'staging', quality_score: 70, safety_score: 95, length: 'short', language: 'my', tags: [] });
    setMobileOpen(true);
  }

  return (
    <main className="admin">
      <div className="adminBar">
        <Brand />
        <b className="badge">Admin</b>
        <label className="search">
          <Search size={18} aria-hidden="true" />
          <input type="search" aria-label="Search lines" placeholder="Search lines" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </label>
        <button className="lime new" onClick={create}><Plus />New line</button>
        <ThemeToggle />
        <button className="signout" aria-label="Sign out" onClick={logout}>
          <span className="avatar"><User size={16} /></span><span className="wide">Sign out</span>
        </button>
      </div>
      {error && <p className="inlineError bannerError" role="alert">{error}</p>}
      <div className="workspace">
        <section className="queue">
          <h1>review queue</h1>
          <p className="lede">Only approved lines reach the generator. Tick the checklist, then publish.</p>
          <nav className="tabs" aria-label="Filter by review status">
            {['', ...statuses].map(s => (
              <button key={s} aria-pressed={filters.review_status === s} onClick={() => filter('review_status', s)}>
                {title(s || 'all')} <b>{counts[s] ?? '…'}</b>
              </button>
            ))}
          </nav>
          <div className="filters">
            <Select all label="Category" options={interests} value={filters.category} onChange={v => filter('category', v)} />
            <Select all label="Style" options={styles} value={filters.style} onChange={v => filter('style', v)} />
            <small>{data.total} lines</small>
          </div>
          <div className="rows" aria-busy={loading}>
            {data.pickupLines.map(x => (
              <button
                key={x._id}
                className={'row' + (x._id === selected?._id ? ' selected' : '') + (toast?.id === x._id ? ' bumped' : '')}
                aria-current={x._id === selected?._id ? 'true' : undefined}
                onClick={() => { setSelected(x); setMobileOpen(true); }}
              >
                <Status value={x.review_status} />
                <span className="rowText">
                  <strong lang="my">{x.burmese_text || x.text}</strong>
                  <small className="meta wide">{title(x.category || '')} · {title(x.style || '')} · {x._id}</small>
                  <small className="meta narrow">{title(x.category || '')} · {title(x.style || '')} · Q {x.quality_score ?? '–'} · S {x.safety_score ?? '–'}</small>
                </span>
                <span className="scores">
                  <span>Quality <Bar value={x.quality_score} /> <b>{x.quality_score ?? '–'}</b></span>
                  <span>Safety <Bar value={x.safety_score} /> <b>{x.safety_score ?? '–'}</b></span>
                </span>
                <ChevronRight className="chev" aria-hidden="true" />
              </button>
            ))}
            {!data.pickupLines.length && <p className="empty">{loading ? 'Loading lines…' : 'No lines match.'}</p>}
          </div>
          <div className="pager">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>{page} / {Math.max(1, data.pages)}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </section>
        {selected
          ? <Editor key={selected._id || 'new'} {...{ line: selected, mobileOpen, busy, mutate }} close={() => setMobileOpen(false)} />
          : <aside className="editor panel emptyEditor"><p>Pick a line from the queue to edit it.</p></aside>}
      </div>
      <button className="fab lime" aria-label="New line" onClick={create}><Plus /></button>
      {toast && <div className="toast" key={toast.key} role="status"><span className="tick"><Check size={16} /></span>{toast.message}</div>}
    </main>
  );
}

export default function AdminPanel() {
  const [token, setToken] = useState(null);
  const logout = useCallback(() => setToken(null), []);
  useEffect(() => { localStorage.removeItem('adminAuth'); }, []);
  return token ? <Queue token={token} logout={logout} /> : <Login onLogin={setToken} />;
}

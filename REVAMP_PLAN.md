# mm-pickupline-gen Revamp Plan

## Sprint 1: Curated DB-first Launch Foundation
- [x] Move generation flow to database-first recommendation mode (no AI dependency in request path)
- [x] Add richer pickup line schema fields:
  category, style, length, burmese_text, english_source_text, source_url, license_note,
  quality_score, safety_score, review_status, tags, text_hash
- [x] Keep compatibility with existing frontend `/api/generate` contract
- [x] Restrict public listing to approved lines only
- [ ] Extend admin panel UI filters/edit fields for review_status, length, scores, source metadata

## Sprint 2: Content Pipeline (Internet -> Burmese -> Review)
- [x] Build staging ingest script for external lines with source URL tracking
- [ ] Add translation/rewrite workflow to produce natural Burmese versions
- [ ] Add content review checklist and publish gate:
  language quality, fun score, appropriateness, category match
- [ ] Seed 300-500 reviewed lines before launch

## Sprint 3: Better Recommendation Experience
- [x] Add ranking-based recommendation service (quality+safety+relevance)
- [x] Add insight payload in response:
  whyItWorks, bestUsedWhen, followUp
- [ ] Add repeat-avoidance with per-session recent history
- [ ] Add optional tag-aware boosts (movie quote, pun, tech joke, etc.)

## Sprint 4: Feedback and Moderation Loop
- [ ] Add user events: copy, save, rate, report
- [ ] Add moderation queue for reported lines
- [ ] Add analytics dashboard:
  copy rate, reroll rate, report rate, top categories/styles

## Sprint 5: Polish for Launch
- [ ] Improve UX microcopy and empty states
- [ ] Add quick mode choices: Cute, Playful, Bold but respectful
- [ ] Add launch checklist: load test, error logging, backup/restore, content freeze

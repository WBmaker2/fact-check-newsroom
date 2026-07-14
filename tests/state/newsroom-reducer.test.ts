import { describe, expect, it } from 'vitest';
import { initialState, newsroomReducer } from '../../src/app/newsroom-reducer';

describe('newsroomReducer', () => {
  it('starts without identifiers or persisted data', () => {
    expect(initialState.stage).toBe('start');
    expect(initialState.packId).toBeNull();
    expect(initialState).not.toHaveProperty('studentName');
  });

  it('selects a pack and clears downstream state', () => {
    const selected = newsroomReducer(initialState, { type: 'SELECT_PACK', packId: 'science-data' });
    expect(selected).toMatchObject({ stage: 'claim', packId: 'science-data', selectedAtomIds: [] });
  });

  it('scopes relations by source and atom', () => {
    const next = newsroomReducer(initialState, { type: 'CLASSIFY', sourceId: 's1', atomId: 'a1', relation: 'supports' });
    expect(next.relations).toEqual({ s1: { a1: 'supports' } });
  });

  it('limits selected evidence to two sources', () => {
    let state = initialState;
    for (const sourceId of ['s1', 's2', 's3', 's4']) state = newsroomReducer(state, { type: 'TOGGLE_EVIDENCE', sourceId });
    expect(state.selectedSourceIds).toEqual(['s1', 's2']);
  });

  it('stores the initial verdict as a deep snapshot', () => {
    const withRelation = newsroomReducer(initialState, { type: 'CLASSIFY', sourceId: 's1', atomId: 'a1', relation: 'supports' });
    const saved = newsroomReducer(withRelation, { type: 'SAVE_DECISION', checkpoint: 'initial', verdict: 'confirmed', reasonIds: ['r1'] });
    const changed = newsroomReducer(saved, { type: 'CLASSIFY', sourceId: 's1', atomId: 'a1', relation: 'limits' });
    expect(changed.initialDecision?.relations.s1.a1).toBe('supports');
  });

  it('clears evidence picks after the first decision for the new source', () => {
    const selected = newsroomReducer(initialState, { type: 'TOGGLE_EVIDENCE', sourceId: 's1' });
    const saved = newsroomReducer(selected, { type: 'SAVE_DECISION', checkpoint: 'initial', verdict: 'confirmed', reasonIds: ['r1'] });
    expect(saved.initialDecision?.selectedSourceIds).toEqual(['s1']);
    expect(saved.selectedSourceIds).toEqual([]);
  });

  it('preserves the first decision while saving the final decision', () => {
    const first = newsroomReducer(initialState, { type: 'SAVE_DECISION', checkpoint: 'initial', verdict: 'insufficient', reasonIds: ['r1'] });
    const final = newsroomReducer(first, { type: 'SAVE_DECISION', checkpoint: 'final', verdict: 'partly-confirmed', reasonIds: ['r2'] });
    expect(final.initialDecision?.verdict).toBe('insufficient');
    expect(final.finalDecision?.verdict).toBe('partly-confirmed');
  });

  it('resets all in-memory progress', () => {
    const selected = newsroomReducer(initialState, { type: 'SELECT_PACK', packId: 'korean-media' });
    expect(newsroomReducer(selected, { type: 'RESET' })).toEqual(initialState);
  });
});

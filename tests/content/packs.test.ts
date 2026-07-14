import { describe, expect, it } from 'vitest';
import { packRegistry } from '../../src/content/registry';
import { validatePackRegistry } from '../../src/domain/pack-validator';

describe('initial subject packs', () => {
  it('contains four packs, four cases and twenty synthetic sources', () => {
    expect(packRegistry).toHaveLength(4);
    expect(packRegistry.flatMap((pack) => pack.cases)).toHaveLength(4);
    expect(packRegistry.flatMap((pack) => pack.sources)).toHaveLength(20);
    expect(packRegistry.flatMap((pack) => pack.sources).every((source) => source.synthetic)).toBe(true);
  });

  it('keeps the elementary flow to three initial sources and two checkable claim parts', () => {
    const cases = packRegistry.flatMap((pack) => pack.cases);
    expect(cases.every((caseFile) => caseFile.initialSourceIds.length === 3)).toBe(true);
    expect(cases.every((caseFile) => caseFile.atoms.filter((atom) => atom.checkable).length === 2)).toBe(true);
  });

  it('covers the four verdict types', () => {
    expect(new Set(packRegistry.map((pack) => pack.cases[0].finalVerdict))).toEqual(new Set(['confirmed', 'partly-confirmed', 'insufficient', 'contradicted']));
  });

  it('keeps every source free from external urls', () => {
    expect(JSON.stringify(packRegistry)).not.toMatch(/https?:\/\//);
  });

  it('passes the structural pack validator', () => {
    expect(validatePackRegistry(packRegistry).errors).toEqual([]);
  });

  it('includes one opinion atom that is not checkable', () => {
    expect(packRegistry.flatMap((pack) => pack.cases[0].atoms).some((atom) => atom.kind === 'opinion' && !atom.checkable)).toBe(true);
  });
});

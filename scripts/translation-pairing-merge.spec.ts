/** Integration coverage for automatic and explicit pairing-record conflict resolution. */

import { execFileSync, spawnSync } from 'node:child_process'
import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { gitBlobHash, storeGitBlob } from './translation-pairing-git.ts'
import {
  mergeTranslationPairingRecords as mergeTranslationPairingRecordsWithScope,
  resolveTranslationPairingConflicts as resolveTranslationPairingConflictsWithScope,
} from './translation-pairing-merge.ts'
import {
  renderTranslationPairingRecord,
  translationPairPaths,
} from './translation-pairing-record.ts'
import { removeFixtureSafely } from './test-fixture-cleanup.ts'

const driver = fileURLToPath(new URL('./merge-translation-pairing.ts', import.meta.url))
const driverLauncher = fileURLToPath(new URL('./merge-translation-pairing-driver.sh', import.meta.url))
const workspaceRoot = fileURLToPath(new URL('../', import.meta.url))
const tsxLoader = import.meta.resolve('tsx/esm')
const fixtures: string[] = []

interface Fixture {
  env: NodeJS.ProcessEnv
  root: string
}

function mergeTranslationPairingRecords(
  root: string,
  metaPath: string,
  ancestorRecord: string,
  currentRecord: string,
  otherRecord: string,
) {
  return mergeTranslationPairingRecordsWithScope(
    root,
    metaPath,
    ancestorRecord,
    currentRecord,
    otherRecord,
    () => true,
  )
}

function resolveTranslationPairingConflicts(root: string): string[] {
  return resolveTranslationPairingConflictsWithScope(root, () => true)
}

afterEach(() => {
  for (const fixture of fixtures.splice(0)) removeFixtureSafely(fixture)
})

function git(fixture: Fixture, args: string[]): string {
  return execFileSync('git', ['-C', fixture.root, ...args], {
    encoding: 'utf8',
    env: fixture.env,
  }).trim()
}

function write(root: string, path: string, content: string): void {
  const absolute = join(root, path)
  mkdirSync(dirname(absolute), { recursive: true })
  writeFileSync(absolute, content)
}

function shellQuote(value: string): string {
  return `"${value.replace(/["\\$`]/g, '\\$&')}"`
}

function installFixtureRuntime(root: string): void {
  const linkType = process.platform === 'win32' ? 'junction' : 'dir'
  symlinkSync(
    join(workspaceRoot, 'node_modules'),
    join(root, 'node_modules'),
    linkType,
  )
  symlinkSync(join(workspaceRoot, 'scripts'), join(root, 'scripts'), linkType)
}

function startMergeWithFakeNode(
  fixture: Fixture,
  nodeScript = '#!/bin/sh\nexit 72\n',
) {
  const fakeBin = join(fixture.root, 'fake-bin')
  const fakeNode = join(fakeBin, 'node')
  write(fixture.root, 'fake-bin/node', nodeScript)
  chmodSync(fakeNode, 0o755)
  git(fixture, [
    'config',
    'merge.dsh-translation-pairing.driver',
    `${shellQuote(driverLauncher)} %O %A %B %P`,
  ])
  return spawnSync('git', ['-C', fixture.root, 'merge', '--no-commit', 'master'], {
    encoding: 'utf8',
    env: {
      ...fixture.env,
      PATH: `${fakeBin}${delimiter}${fixture.env.PATH ?? ''}`,
    },
  })
}

function createFixture(attributes = true): Fixture {
  const root = mkdtempSync(join(tmpdir(), 'dsh-translation-pairing-merge-'))
  fixtures.push(root)
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    GIT_AUTHOR_EMAIL: 'pairing@example.test',
    GIT_AUTHOR_NAME: 'Pairing Test',
    GIT_COMMITTER_EMAIL: 'pairing@example.test',
    GIT_COMMITTER_NAME: 'Pairing Test',
    GIT_CONFIG_GLOBAL: join(root, 'global.gitconfig'),
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_DEFAULT_HASH: 'sha1',
  }
  const fixture = { env, root }
  execFileSync('git', ['init', '--quiet', '--initial-branch=master', root], { env })
  if (attributes) write(root, '.gitattributes', '*.i18n.yaml merge=dsh-translation-pairing\n')
  return fixture
}

function record(root: string, path: string, source: string, ar: string): string {
  const paths = translationPairPaths(path)
  write(root, paths.source, source)
  write(root, paths.ar, ar)
  const content = renderTranslationPairingRecord(paths, {
    sourceHash: storeGitBlob(root, Buffer.from(source)),
    arHash: storeGitBlob(root, Buffer.from(ar)),
  })
  write(root, paths.meta, content)
  return content
}

const baseSource = '# Guide\n\nEnglish | [العربية](guide.ar.md)\n\nAlpha base.\n\nBeta base.\n'
const baseAr = '# إشارة جنوب\n\n[English](guide.md) | العربية\n\nدرع أساس أساس.\n\nثان أساس أساس.\n'
const currentSource = baseSource.replace('Alpha base.', 'Alpha current.')
const currentAr = baseAr.replace('درع أساس أساس.', 'درع حالي.')
const otherSource = baseSource.replace('Beta base.', 'Beta other.')
const otherAr = baseAr.replace('ثان أساس أساس.', 'ثان مقابل جانب.')
const mergedSource = currentSource.replace('Beta base.', 'Beta other.')
const mergedAr = currentAr.replace('ثان أساس أساس.', 'ثان مقابل جانب.')
const generatedBaseSource = '# Module graph\n\nAlpha base.\n\nBeta base.\n'
const generatedBaseAr = '# وحدة رسم\n\n[English](module-graph.md) | العربية\n\nدرع أساس أساس.\n\nثان أساس أساس.\n'
const generatedCurrentSource = generatedBaseSource.replace('Alpha base.', 'Alpha current.')
const generatedCurrentAr = generatedBaseAr.replace('درع أساس أساس.', 'درع حالي.')
const generatedOtherSource = generatedBaseSource.replace('Beta base.', 'Beta other.')
const generatedOtherAr = generatedBaseAr.replace('ثان أساس أساس.', 'ثان مقابل جانب.')
const manualBaseSource = baseSource.replace('guide.ar.md', 'manual.ar.md')
const manualBaseAr = baseAr.replace('guide.md', 'manual.md')
const manualCurrentSource = manualBaseSource.replace('Alpha base.', 'Alpha current.')
const manualCurrentAr = manualBaseAr.replace('درع أساس أساس.', 'درع حالي.')
const manualOtherSource = manualBaseSource.replace('Alpha base.', 'Alpha other.')
const manualOtherAr = manualBaseAr.replace('درع أساس أساس.', 'درع مقابل جانب.')

function commitPair(fixture: Fixture, source: string, ar: string, message: string): string {
  const sidecar = record(fixture.root, 'docs/guide.md', source, ar)
  git(fixture, ['add', '.'])
  git(fixture, ['commit', '-m', message])
  return sidecar
}

function commitTextCleanPair(fixture: Fixture, source: string, ar: string, message: string): void {
  const sidecar = record(fixture.root, 'docs/guide.md', source, ar)
  write(
    fixture.root,
    'docs/guide.i18n.yaml',
    sidecar.replace('\nguide.ar.md:', '\n# Stable separator for independent line merges.\nguide.ar.md:'),
  )
  git(fixture, ['add', '.'])
  git(fixture, ['commit', '-m', message])
}

function createDivergedPair(fixture: Fixture): { ancestor: string; current: string; other: string } {
  const ancestor = commitPair(fixture, baseSource, baseAr, 'base')
  git(fixture, ['switch', '-c', 'current'])
  const current = commitPair(fixture, currentSource, currentAr, 'current')
  git(fixture, ['switch', 'master'])
  const other = commitPair(fixture, otherSource, otherAr, 'other')
  git(fixture, ['switch', 'current'])
  return { ancestor, current, other }
}

function createTextCleanDivergedPair(fixture: Fixture): void {
  commitTextCleanPair(fixture, baseSource, baseAr, 'base')
  git(fixture, ['switch', '-c', 'current'])
  commitTextCleanPair(fixture, currentSource, baseAr, 'current source')
  git(fixture, ['switch', 'master'])
  commitTextCleanPair(fixture, baseSource, otherAr, 'other translation')
  git(fixture, ['switch', 'current'])
}

function startStoppedPairingMerge(fixture: Fixture): void {
  createDivergedPair(fixture)
  const merge = spawnSync('git', ['-C', fixture.root, 'merge', '--no-commit', 'master'], {
    encoding: 'utf8',
    env: fixture.env,
  })
  expect(merge.status).toBe(1)
  expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('docs/guide.i18n.yaml')
}

function commitMixedPairs(
  fixture: Fixture,
  guide: { source: string; ar: string },
  manual: { source: string; ar: string },
  message: string,
): void {
  record(fixture.root, 'docs/guide.md', guide.source, guide.ar)
  record(fixture.root, 'docs/manual.md', manual.source, manual.ar)
  git(fixture, ['add', '.'])
  git(fixture, ['commit', '-m', message])
}

function startMixedPairingMerge(fixture: Fixture): void {
  commitMixedPairs(
    fixture,
    { source: baseSource, ar: baseAr },
    { source: manualBaseSource, ar: manualBaseAr },
    'base',
  )
  git(fixture, ['switch', '-c', 'current'])
  commitMixedPairs(
    fixture,
    { source: currentSource, ar: currentAr },
    { source: manualCurrentSource, ar: manualCurrentAr },
    'current',
  )
  git(fixture, ['switch', 'master'])
  commitMixedPairs(
    fixture,
    { source: otherSource, ar: otherAr },
    { source: manualOtherSource, ar: manualOtherAr },
    'other',
  )
  git(fixture, ['switch', 'current'])
  const merge = spawnSync('git', ['-C', fixture.root, 'merge', '--no-commit', 'master'], {
    encoding: 'utf8',
    env: fixture.env,
  })
  expect(merge.status).toBe(1)
}

function expectMergedPair(fixture: Fixture): void {
  expect(readFileSync(join(fixture.root, 'docs/guide.md'), 'utf8')).toBe(mergedSource)
  expect(readFileSync(join(fixture.root, 'docs/guide.ar.md'), 'utf8')).toBe(mergedAr)
  expect(readFileSync(join(fixture.root, 'docs/guide.i18n.yaml'), 'utf8')).toBe(
    renderTranslationPairingRecord(translationPairPaths('docs/guide.md'), {
      sourceHash: gitBlobHash(Buffer.from(mergedSource)),
      arHash: gitBlobHash(Buffer.from(mergedAr)),
    }),
  )
}

// Every case in this suite drives real `git` invocations against a scratch
// repository, so it is bound by process creation rather than by its assertions.
// The value matches DSH_COVERAGE_TEST_TIMEOUT_MS, which the Windows coverage
// lane passes as --testTimeout: a describe value overrides that flag rather than
// yielding to it, so a smaller one here lowers what the lane grants every case
// in this file, none of which carries an allowance of its own. Measurements and
// the rejected alternatives are in
// .agents/notes/archived/testing/2026-08-27-translation-pairing-merge-budget.md.
describe('translation pairing merge composition', { timeout: 90_000 }, () => {
  it('rejects a pairing-record path outside the repository', () => {
    const fixture = createFixture(false)

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      '../guide.i18n.yaml',
      '',
      '',
      '',
    )).toThrow('pairing record escapes the repository')
  })

  it('rejects a pairing record excluded from the active corpus', () => {
    const fixture = createFixture(false)

    expect(() => mergeTranslationPairingRecordsWithScope(
      fixture.root,
      'docs/guide.i18n.yaml',
      '',
      '',
      '',
      () => false,
    )).toThrow('docs/guide.i18n.yaml is excluded from the active bilingual documentation corpus')
  })

  it('merges the owner blobs named by three valid records', () => {
    const fixture = createFixture(false)
    git(fixture, ['config', 'merge.default', 'text'])
    const records = createDivergedPair(fixture)

    const result = mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      records.ancestor,
      records.current,
      records.other,
    )

    expect(result.sourceContent.toString('utf8')).toBe(mergedSource)
    expect(result.arContent.toString('utf8')).toBe(mergedAr)
    expect(result.sourceHash).toBe(gitBlobHash(Buffer.from(mergedSource)))
    expect(result.arHash).toBe(gitBlobHash(Buffer.from(mergedAr)))
  })

  it('accepts locale-specific paths to the same paired document', () => {
    const fixture = createFixture(false)
    write(fixture.root, 'docs/reference.md', '# Overview\n')
    write(fixture.root, 'docs/reference.ar.md', '# عام تصفح\n')
    git(fixture, ['add', 'docs/reference.md', 'docs/reference.ar.md'])
    const source = baseSource.replace('Alpha base.', '[Reference](reference.md#overview)')
    const ar = baseAr.replace('درع أساس أساس.', '[مشاركة اعتبار](reference.ar.md#overview)')
    const ancestor = record(fixture.root, 'docs/guide.md', source, ar)
    const current = record(fixture.root, 'docs/guide.md', source, ar)
    const other = record(fixture.root, 'docs/guide.md', source, ar)
    rmSync(join(fixture.root, 'docs/reference.md'))
    rmSync(join(fixture.root, 'docs/reference.ar.md'))

    expect(mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      ancestor,
      current,
      other,
    ).arContent.toString('utf8')).toBe(ar)
  })

  it('rejects a clean merge whose Arabic link uses the English sibling', () => {
    const fixture = createFixture(false)
    write(fixture.root, 'docs/reference.md', '# Overview\n')
    write(fixture.root, 'docs/reference.ar.md', '# عام تصفح\n')
    git(fixture, ['add', 'docs/reference.md', 'docs/reference.ar.md'])
    const source = baseSource.replace('Alpha base.', '[Reference](reference.md)')
    const ar = baseAr.replace('درع أساس أساس.', '[مشاركة اعتبار](reference.md)')
    const ancestor = record(fixture.root, 'docs/guide.md', source, ar)
    const current = record(fixture.root, 'docs/guide.md', source, ar)
    const other = record(fixture.root, 'docs/guide.md', source, ar)

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      ancestor,
      current,
      other,
    )).toThrow('docs/guide.ar.md:5 clean merge uses "reference.md"; expected "reference.ar.md"')
  })

  it('merges a generated source without an English language switcher', () => {
    const fixture = createFixture(false)
    const ancestor = record(fixture.root, 'docs/module-graph.md', generatedBaseSource, generatedBaseAr)
    const current = record(fixture.root, 'docs/module-graph.md', generatedCurrentSource, generatedCurrentAr)
    const other = record(fixture.root, 'docs/module-graph.md', generatedOtherSource, generatedOtherAr)

    const result = mergeTranslationPairingRecords(
      fixture.root,
      'docs/module-graph.i18n.yaml',
      ancestor,
      current,
      other,
    )

    expect(result.sourceContent.toString('utf8')).toBe(
      generatedCurrentSource.replace('Beta base.', 'Beta other.'),
    )
    expect(result.arContent.toString('utf8')).toBe(generatedCurrentAr.replace('ثان أساس أساس.', 'ثان مقابل جانب.'))
  })

  it('rejects an authored source without an English language switcher', () => {
    const fixture = createFixture(false)
    const source = baseSource.replace('English | [العربية](guide.ar.md)\n\n', '')
    const ancestor = record(fixture.root, 'docs/guide.md', source, baseAr)
    const current = record(fixture.root, 'docs/guide.md', source, baseAr)
    const other = record(fixture.root, 'docs/guide.md', source, baseAr)

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      ancestor,
      current,
      other,
    )).toThrow('docs/guide.md clean merge lost its language-switcher link to guide.ar.md')
  })

  it('rejects generated Arabic content without its English backlink', () => {
    const fixture = createFixture(false)
    const ar = generatedBaseAr.replace('[English](module-graph.md) | العربية\n\n', '')
    const ancestor = record(fixture.root, 'docs/module-graph.md', generatedBaseSource, ar)
    const current = record(fixture.root, 'docs/module-graph.md', generatedBaseSource, ar)
    const other = record(fixture.root, 'docs/module-graph.md', generatedBaseSource, ar)

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      'docs/module-graph.i18n.yaml',
      ancestor,
      current,
      other,
    )).toThrow(
      'docs/module-graph.ar.md clean merge lost its language-switcher link to module-graph.md',
    )
  })

  it('leaves owner-content conflicts for a human', () => {
    const fixture = createFixture(false)
    const ancestor = record(fixture.root, 'docs/guide.md', baseSource, baseAr)
    const current = record(
      fixture.root,
      'docs/guide.md',
      baseSource.replace('Alpha base.', 'Alpha current.'),
      baseAr.replace('درع أساس أساس.', 'درع حالي.'),
    )
    const other = record(
      fixture.root,
      'docs/guide.md',
      baseSource.replace('Alpha base.', 'Alpha other.'),
      baseAr.replace('درع أساس أساس.', 'درع مقابل جانب.'),
    )

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      ancestor,
      current,
      other,
    )).toThrow('docs/guide.md has content conflicts')
  })

  it('rejects structurally divergent clean owner merges', () => {
    const fixture = createFixture(false)
    const ancestor = record(fixture.root, 'docs/guide.md', baseSource, baseAr)
    const current = record(fixture.root, 'docs/guide.md', currentSource, currentAr)
    const other = record(
      fixture.root,
      'docs/guide.md',
      `${otherSource}\n## Extra\n`,
      otherAr,
    )

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      ancestor,
      current,
      other,
    )).toThrow('clean merges diverge structurally')
  })

  it('refuses owners assigned to another merge strategy', () => {
    const fixture = createFixture(false)
    write(fixture.root, '.gitattributes', 'docs/*.md merge=custom-owner\n')
    const records = createDivergedPair(fixture)

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      records.ancestor,
      records.current,
      records.other,
    )).toThrow('docs/guide.md uses merge=custom-owner')
  })

  it('refuses unspecified owners affected by merge.default', () => {
    const fixture = createFixture(false)
    git(fixture, ['config', 'merge.default', 'custom-owner'])
    const records = createDivergedPair(fixture)

    expect(() => mergeTranslationPairingRecords(
      fixture.root,
      'docs/guide.i18n.yaml',
      records.ancestor,
      records.current,
      records.other,
    )).toThrow('merge.default=custom-owner')
  })

  it('runs as Git\'s custom driver and commits a clean composed record', () => {
    const fixture = createFixture()
    createDivergedPair(fixture)
    installFixtureRuntime(fixture.root)
    git(fixture, [
      'config',
      'merge.dsh-translation-pairing.driver',
      'scripts/merge-translation-pairing-driver.sh %O %A %B %P',
    ])

    git(fixture, ['merge', '--no-edit', 'master'])

    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('')
    expectMergedPair(fixture)
  })

  it('sees a paired link target added by the other branch', () => {
    const fixture = createFixture()
    commitPair(fixture, baseSource, baseAr, 'base')
    git(fixture, ['switch', '-c', 'current'])
    commitPair(fixture, currentSource, currentAr, 'current guide')
    git(fixture, ['switch', 'master'])
    record(
      fixture.root,
      'docs/guide.md',
      baseSource.replace('Beta base.', '[Reference](reference.md#overview)'),
      baseAr.replace('ثان أساس أساس.', '[مشاركة اعتبار](reference.ar.md#overview)'),
    )
    record(
      fixture.root,
      'docs/reference.md',
      '# Reference\n\nEnglish | [العربية](reference.ar.md)\n\nOverview.\n',
      '# مشاركة اعتبار\n\n[English](reference.md) | العربية\n\nعام تصفح.\n',
    )
    git(fixture, ['add', '.'])
    git(fixture, ['commit', '-m', 'other guide and target'])
    git(fixture, ['switch', 'current'])
    installFixtureRuntime(fixture.root)
    git(fixture, [
      'config',
      'merge.dsh-translation-pairing.driver',
      'scripts/merge-translation-pairing-driver.sh %O %A %B %P',
    ])

    const merge = spawnSync('git', ['-C', fixture.root, 'merge', '--no-edit', 'master'], {
      encoding: 'utf8',
      env: fixture.env,
    })

    expect(merge.status, merge.stderr).toBe(0)
    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('')
    expect(readFileSync(join(fixture.root, 'docs/guide.md'), 'utf8')).toContain(
      '[Reference](reference.md#overview)',
    )
    expect(readFileSync(join(fixture.root, 'docs/guide.ar.md'), 'utf8')).toContain(
      '[مشاركة اعتبار](reference.ar.md#overview)',
    )
  })

  it('leaves an ordinary recoverable conflict when the configured runtime is unavailable', () => {
    const fixture = createFixture()
    const records = createDivergedPair(fixture)
    const headBefore = git(fixture, ['rev-parse', 'HEAD'])

    const result = startMergeWithFakeNode(fixture)

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('runtime is unavailable; leaving an ordinary text conflict')
    expect(git(fixture, ['rev-parse', 'HEAD'])).toBe(headBefore)
    expect(git(fixture, ['rev-parse', '--verify', 'MERGE_HEAD'])).not.toBe('')
    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('docs/guide.i18n.yaml')
    expect(git(fixture, ['ls-files', '--unmerged', '--', 'docs/guide.i18n.yaml']).split('\n')).toHaveLength(3)
    const conflicted = readFileSync(join(fixture.root, 'docs/guide.i18n.yaml'), 'utf8')
    expect(conflicted).toContain('<<<<<<< docs/guide.i18n.yaml:current')
    for (const record of [records.current, records.other]) {
      const dataLines = record.split('\n').filter(line => line !== '' && !line.startsWith('#')).join('\n')
      expect(conflicted).toContain(dataLines)
    }

    expect(resolveTranslationPairingConflicts(fixture.root)).toEqual(['docs/guide.i18n.yaml'])
    expectMergedPair(fixture)
  })

  it('falls back before a broken driver entrypoint can replace the launcher', () => {
    const fixture = createFixture()
    createDivergedPair(fixture)
    const result = startMergeWithFakeNode(
      fixture,
      '#!/bin/sh\nif [ "$3" = "--eval" ]; then exit 0; fi\nexit 72\n',
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('runtime is unavailable; leaving an ordinary text conflict')
    expect(readFileSync(join(fixture.root, 'docs/guide.i18n.yaml'), 'utf8')).toContain(
      '<<<<<<< docs/guide.i18n.yaml:current',
    )
  })

  it('keeps a clean text fallback unresolved until the explicit resolver confirms it', () => {
    const fixture = createFixture()
    createTextCleanDivergedPair(fixture)
    const result = startMergeWithFakeNode(fixture)

    expect(result.status).toBe(1)
    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('docs/guide.i18n.yaml')
    const canonicalRecord = renderTranslationPairingRecord(translationPairPaths('docs/guide.md'), {
      sourceHash: gitBlobHash(Buffer.from(currentSource)),
      arHash: gitBlobHash(Buffer.from(otherAr)),
    })
    expect(readFileSync(join(fixture.root, 'docs/guide.i18n.yaml'), 'utf8')).toBe(
      canonicalRecord.replace(
        '\nguide.ar.md:',
        '\n# Stable separator for independent line merges.\nguide.ar.md:',
      ),
    )

    expect(resolveTranslationPairingConflicts(fixture.root)).toEqual(['docs/guide.i18n.yaml'])
    expect(readFileSync(join(fixture.root, 'docs/guide.md'), 'utf8')).toBe(currentSource)
    expect(readFileSync(join(fixture.root, 'docs/guide.ar.md'), 'utf8')).toBe(otherAr)
    expect(readFileSync(join(fixture.root, 'docs/guide.i18n.yaml'), 'utf8')).toBe(canonicalRecord)
  })

  it('leaves a staged merge when the pre-merge-commit hook rejects it', () => {
    const fixture = createFixture()
    createDivergedPair(fixture)
    installFixtureRuntime(fixture.root)
    git(fixture, [
      'config',
      'merge.dsh-translation-pairing.driver',
      'scripts/merge-translation-pairing-driver.sh %O %A %B %P',
    ])
    const hooks = join(fixture.root, 'hooks')
    write(
      fixture.root,
      'hooks/pre-merge-commit',
      '#!/bin/sh\necho "fixture pre-merge-commit rejection" >&2\nexit 77\n',
    )
    chmodSync(join(hooks, 'pre-merge-commit'), 0o755)
    git(fixture, ['config', 'core.hooksPath', hooks])
    const headBefore = git(fixture, ['rev-parse', 'HEAD'])

    const result = spawnSync('git', ['-C', fixture.root, 'merge', '--no-edit', 'master'], {
      encoding: 'utf8',
      env: fixture.env,
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('fixture pre-merge-commit rejection')
    expect(git(fixture, ['rev-parse', 'HEAD'])).toBe(headBefore)
    expect(git(fixture, ['rev-parse', '--verify', 'MERGE_HEAD'])).not.toBe('')
    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('')
    expect(git(fixture, ['diff', '--cached', '--name-only']).split('\n')).toContain(
      'docs/guide.i18n.yaml',
    )
    expectMergedPair(fixture)
  })

  it('prints the recovery path when driver input is not composable', () => {
    const fixture = createFixture(false)
    const result = spawnSync(process.execPath, ['--import', tsxLoader, driver], {
      cwd: fixture.root,
      encoding: 'utf8',
      env: fixture.env,
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('pnpm run verify-translation-pairing --write <pair>')
    expect(result.stderr).toContain('pnpm run resolve-translation-pairing-conflicts')
  })

  it('resolves an already-stopped generated-only conflict from index stages', () => {
    const fixture = createFixture(false)
    startStoppedPairingMerge(fixture)

    expect(resolveTranslationPairingConflicts(fixture.root)).toEqual(['docs/guide.i18n.yaml'])

    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('')
    expectMergedPair(fixture)
  })

  it('refuses to confirm unstaged owner bytes after a stopped merge', () => {
    const fixture = createFixture(false)
    startStoppedPairingMerge(fixture)
    write(fixture.root, 'docs/guide.md', `${mergedSource}\nunstaged\n`)

    expect(() => resolveTranslationPairingConflicts(fixture.root)).toThrow(
      'docs/guide.md has unstaged content',
    )
    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('docs/guide.i18n.yaml')
  })

  it('refuses to overwrite an edited sidecar after a stopped merge', () => {
    const fixture = createFixture(false)
    startStoppedPairingMerge(fixture)
    write(fixture.root, 'docs/guide.i18n.yaml', 'manually resolved\n')

    expect(() => resolveTranslationPairingConflicts(fixture.root)).toThrow(
      'docs/guide.i18n.yaml has edited conflict content',
    )
    expect(readFileSync(join(fixture.root, 'docs/guide.i18n.yaml'), 'utf8')).toBe('manually resolved\n')
    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U'])).toBe('docs/guide.i18n.yaml')
  })

  it('resolves safe records while leaving an owner-conflicted pair untouched', () => {
    const fixture = createFixture(false)
    startMixedPairingMerge(fixture)

    expect(() => resolveTranslationPairingConflicts(fixture.root)).toThrow(
      'docs/manual.i18n.yaml: docs/manual.md has content conflicts',
    )

    expect(git(fixture, ['diff', '--name-only', '--diff-filter=U']).split('\n')).toEqual([
      'docs/manual.i18n.yaml',
      'docs/manual.md',
      'docs/manual.ar.md',
    ])
    expectMergedPair(fixture)
  })
})

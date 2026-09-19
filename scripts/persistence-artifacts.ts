/** Render complete persistence documentation pairs without Git or file mutation. */

import { readFileSync } from 'node:fs'
import { hasLanguageSwitcher } from './translation-links.ts'
import { translationPairPaths } from './translation-pairing-record.ts'
import {
  blobHash, languageSwitcherTargets, parseTranslationMarkdown, parseTranslationPairingManifest,
  renderPairMeta, requiresSourceLanguageSwitcher, translationPairSourcePredicate,
  translationStructureDiff, translationStructureSignature,
} from './translation-pairing.ts'

const isTranslationPairSource = translationPairSourcePredicate(parseTranslationPairingManifest(
  readFileSync(new URL('./translation-pairing.manifest.json', import.meta.url), 'utf8'),
))

/** One repository-relative generated file and its complete UTF-8 content. */
export interface PersistenceArtifact {
  readonly path: string
  readonly content: string
}

/**
 * Check a pair's code, structure and localized links, then render its three files.
 * Link existence remains the Markdown gate's responsibility. Pair hashes are
 * computed in-process; staging the documents stores the corresponding Git blobs.
 * @param root - checkout root used to resolve relative link identities.
 * @param source - repository-relative English document path.
 * @param en - complete authored or generated English Markdown.
 * @param ar - complete authored or generated Arabic Markdown.
 * @returns the documents and their matching consistency sidecar, without writing files.
 */
export function renderPersistencePair(root: string, source: string, en: string, ar: string): PersistenceArtifact[] {
  const paths = translationPairPaths(source)
  const sourceTree = parseTranslationMarkdown(en)
  const arTree = parseTranslationMarkdown(ar)
  const sourceTargets = languageSwitcherTargets(paths.source)
  const arTargets = languageSwitcherTargets(paths.ar)
  if (!hasLanguageSwitcher(arTree, ar, sourceTargets)
    || requiresSourceLanguageSwitcher(source) && !hasLanguageSwitcher(sourceTree, en, arTargets)) {
    throw new Error(`${source}: both authored languages need their counterpart switcher`)
  }
  const context = { repoRoot: root, isTranslationPairSource, repositoryFileExists: () => true }
  const errors = translationStructureDiff(
    translationStructureSignature(sourceTree, arTargets, { ...context, sourcePath: paths.source, markdown: en }),
    translationStructureSignature(arTree, sourceTargets, { ...context, sourcePath: paths.ar, markdown: ar }),
  )
  if (errors.length > 0) throw new Error(`${source}: bilingual structure mismatch: ${errors.join('; ')}`)
  return [
    { path: paths.source, content: en },
    { path: paths.ar, content: ar },
    { path: paths.meta, content: renderPairMeta(paths.source, blobHash(Buffer.from(en)), paths.ar, blobHash(Buffer.from(ar))) },
  ]
}

# إنتاج خروج شيء

[English](deliverables.md) | العربية

سجل واحد جولة تسليم إعطاء مستخدم شرق غرب، من [deliverables حزمة مجموعة](../../packages/deliverables/README.zh.md) يملك: نموذج عبر `present` أداة إعلان ملف، تسجيل في واحد فقط كتابة سجل Session حدث داخل؛ هذا واحد جولة تعديل ملف، من جولة بدء و جولة انتهاء وقت git عمل شجرة لقطة مقابل مقارنة نيل خروج،git تغطية لا إلى مسار فإن من ملف أداة كل مرة تحرير قبل بعد كامل ملف التقاط نيل خروج، استخدام واحد فقط كتابة سجل حدث إعلان إبلاغ، و في Session تخزين نشط خلال من Host خدمة وصل نفس كل الذي صف ملف في جولة بدء و جولة انتهاء وقت مقابل مقارنة واحد بدء توفير. هو جمع فقط من عميل قراءة،Web [إنتاج خروج شيء إضافة](../../packages/client/ui-deliverables/README.zh.md) في جولة نهاية تصيير اثنان من. أداة سلوك، لقطة آلية و إعداد رؤية [`tool-present`](../../packages/deliverables/tool-present/README.zh.md) و [`workspace-changes`](../../packages/deliverables/workspace-changes/README.zh.md) حزمة README.

شفرة المصدر:[`packages/deliverables/tool-present/src/types.ts`](../../packages/deliverables/tool-present/src/types.ts) ،[`packages/deliverables/workspace-changes/src/types.ts`](../../packages/deliverables/workspace-changes/src/types.ts)

## `PresentedFile`: واحد بند إعلان تسليم

```ts type-equiv
/** A declared filesystem file whose current contents remain at its source path. */
interface PresentedFile {
  /** Original absolute path or path relative to the Session working directory. */
  path: string
  /** Optional description supplied by the model. */
  description?: string
}
```

## `WorkspaceChangedFile`: واحد تعديل ملف

```ts type-equiv
/** One file changed during a turn, with line counts from git or from the whole-file captures around its file-tool edits. */
interface WorkspaceChangedFile {
  /** Path relative to the Session working directory, or an absolute Host path outside it. */
  path: string
  /**
   * Sort key and label: the relative path inside the working directory, a
   * `../` path for repository files above it, a `~` path under the home
   * directory, otherwise the absolute path. Always slash-separated.
   */
  display: string
  /** Lines added; zero for a binary or oversized file. */
  added: number
  /** Lines deleted; zero for a binary or oversized file. */
  deleted: number
  /** Present when git reported the file as binary, or when a captured side holds a NUL byte. */
  binary?: true
  /** Present when a captured side exceeded the plugin's `maxFileBytes`; the file is listed without counts or comparison. */
  oversized?: true
}
```

## `WorkspaceChangesSummary`: واحد جولة تعديل ملخص

```ts type-equiv
/** Files changed during one top-level turn, kept on the Host until its Session is disposed. */
interface WorkspaceChangesSummary {
  /** The turn whose file changes this summary describes. */
  turn: number
  /** The Session working directory `path` values are relative to. */
  cwd: string
  /** Changed files in `display` order, capped at the plugin's `maxFiles`. */
  files: WorkspaceChangedFile[]
  /** Complete changed-file count, including files omitted by the cap. */
  total: number
  /** Lines added over every changed file, including files omitted by the cap. */
  added: number
  /** Lines deleted over every changed file, including files omitted by the cap. */
  deleted: number
  /** Git tree ids of the turn-start and turn-end snapshots; absent when no snapshot was taken. */
  snapshot?: { before: string; after: string }
}
```

## `WorkspaceDiffHunk`: واحد unified diff hunk

```ts type-equiv
/** One unified-diff hunk with three context lines; every line keeps its `+`, `-`, or space prefix. */
interface WorkspaceDiffHunk {
  /** First line of the hunk in the turn-start content, 1-based; a side without lines starts at 1 with zero lines. */
  oldStart: number
  /** Lines of the hunk taken from the turn-start content. */
  oldLines: number
  /** First line of the hunk in the turn-end content, 1-based; a side without lines starts at 1 with zero lines. */
  newStart: number
  /** Lines of the hunk taken from the turn-end content. */
  newLines: number
  /** Hunk body in order, each line prefixed with `+`, `-`, or a space. */
  lines: string[]
}
```

## `WorkspaceFileDiff`: واحد ملف مقابل مقارنة

```ts type-equiv
/** The comparison of one listed file's turn-start and turn-end contents, computed when asked for. */
type WorkspaceFileDiff =
  | {
    kind: 'text'
    /** The listed file's `path`. */
    path: string
    /** The listed file's `display`. */
    display: string
    /** Whether the file existed at turn start. */
    before: boolean
    /** Whether the file existed at turn end. */
    after: boolean
    /** Hunks in file order; empty when both sides hold the same lines. */
    hunks: WorkspaceDiffHunk[]
    /** True when the line comparison exceeded the plugin's `diffTimeoutMs` and every line is shown as replaced. */
    coarse: boolean
  }
  /** A side git reported as binary or that holds a NUL byte; no lines are served. */
  | { kind: 'binary'; path: string; display: string }
  /** A side larger than the plugin's `maxFileBytes`; no lines are served. */
  | { kind: 'oversized'; path: string; display: string }
```

## `WorkspaceChanges`: توفير ملخص و مقابل مقارنة Host خدمة

```ts type-equiv
/** Serves the summaries and file comparisons the recorder keeps for live Sessions. */
interface WorkspaceChanges {
  /**
   * The summary announced by one `workspace/changes` event.
   * @param sessionId - the Session that appended the event.
   * @param seq - the event's sequence number.
   * @returns the summary, or undefined once its Session was disposed or when this Host never recorded it.
   */
  summary(sessionId: SessionId, seq: number): WorkspaceChangesSummary | undefined
  /**
   * Compare one listed file's contents at turn start and turn end.
   * @param sessionId - the Session that appended the event.
   * @param seq - the event's sequence number.
   * @param index - the file's index in the summary's `files`.
   * @param signal - cancels the reads.
   * @returns the comparison, or undefined once its Session was disposed, when this Host never recorded it, or when no file has that index.
   * @throws when a snapshot read fails for a live Session.
   */
  diff(sessionId: SessionId, seq: number, index: number, signal: AbortSignal): Promise<WorkspaceFileDiff | undefined>
}
```

## حمل دائم حدث و توفير ملخص

`tool-present` عبر إعلان دمج يأخذ `deliverables/presented: { turn; callId; files: PresentedFile[] }` إضافة دخول `SessionEventMap`، كل مرة `present` نهائي نتيجة نجاح وقت إلحاق واحد بند.`workspace-changes` دمج `workspace/changes: { turn }`، في قمة طبقة جولة إيقاف وقت إلحاق؛ هذا حدث إعلان إبلاغ ملخص لا في سجل داخل، بينما هو من `workspaceChanges.summary(sessionId, seq)` حسب حدث ترتيب رقم إرجاع، مباشر إلى Session تحرير، لذلك Host إعادة بدء بعد إعادة فتح محادثة، أولا قبل جولة لا يوجد تعديل ملف بطاقة.`workspaceChanges.diff(sessionId, seq, index, signal)` حسب نفس مثال شرط مقابل مقارنة واحد الذي صف ملف. نفس جولة بعد قدوم حدث بديل أولا قبل، عميل فقط إبقاء الأكثر جديد واحد بند. توليد[حفظ دائم دليل](../persistence-catalog.zh.md#deliverablespresented--log-only) سجل اثنان موضع إعلان موضع. اثنان عدد حدث كل لن دخول نموذج طلب.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxworkspacechanges--workspacechanges"></a>

### `ctx.workspaceChanges` — `WorkspaceChanges`

Serves the summaries and file comparisons the recorder keeps for live Sessions.

```ts cordis-catalog
/**
 * The summary announced by one `workspace/changes` event.
 * @param sessionId - the Session that appended the event.
 * @param seq - the event's sequence number.
 * @returns the summary, or undefined once its Session was disposed or when this Host never recorded it.
 */
summary(sessionId: SessionId, seq: number): WorkspaceChangesSummary | undefined

/**
 * Compare one listed file's contents at turn start and turn end.
 * @param sessionId - the Session that appended the event.
 * @param seq - the event's sequence number.
 * @param index - the file's index in the summary's `files`.
 * @param signal - cancels the reads.
 * @returns the comparison, or undefined once its Session was disposed, when this Host never recorded it, or when no file has that index.
 * @throws when a snapshot read fails for a live Session.
 */
diff(sessionId: SessionId, seq: number, index: number, signal: AbortSignal): Promise<WorkspaceFileDiff | undefined>
```

Types: [SessionId](core.zh.md)

Source: [`packages/deliverables/workspace-changes/src/types.ts`](../../packages/deliverables/workspace-changes/src/types.ts)
<!-- END GENERATED cordis-surface -->

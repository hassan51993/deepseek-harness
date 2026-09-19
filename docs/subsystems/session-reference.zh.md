# جلسة مرجع

[English](session-reference.md) | العربية

من Host دعم دعم ملف اكتشاف، و بنية تحويل عبر جلسة مرجع طلب و دقيق تجهيز بعد رسالة سياق.[ملف مرجع اتفاق](../../packages/context/file-reference) مسؤول فقط يحتوي مسار تكملة كل سجل و لغة قاعدة؛[جلسة مرجع اتفاق](../../packages/context/session-reference) تعريف مواصفة URI، حالي جدول طبقة إسقاط، وسم أمان JSON و بايت إبقاء، مستقر خطأ و غير ممكن معلومة نموذج نص التوجيه. مضيف مهايئ استخدام هذه نوع، بينما لن يأخذ كل منها UI رفع و لغة قاعدة نقل دخول agent(ذكي جسم) نواة قلب.

مصدر:[`packages/context/file-reference/src/types.ts`](../../packages/context/file-reference/src/types.ts) · [`packages/context/session-reference/src/types.ts`](../../packages/context/session-reference/src/types.ts)

## ملف مرشح بند

`FileReferenceCandidate` هو فقط يحتوي مسار اكتشاف نتيجة. يتم بحث عنوان agent توفير عمل دليل نطاق؛ مزود مسؤول ترتيب ترتيب و نطاق الأسماء وصول، لكن لن قراءة ملف محتوى.

```ts type-equiv
/** One path-only completion candidate inside the target session cwd. */
interface FileReferenceCandidate {
  /** User-facing path accepted by normal prompts and filesystem tools. */
  path: string
  /** Directories keep completion open; files finish the mention. */
  kind: 'file' | 'directory'
}
```

## إدخال و مرشح بند

`SessionReferenceInput` هو و مضيف غير متصل اختيار.id أداة لديه مرجعي صفة؛label هو مع لقطة يحمل عرض بيانات وصفية.

```ts type-equiv
/** One source session selected by a host. */
interface SessionReferenceInput {
  /** Opaque source session identity. */
  sessionId: SessionId
  /** Optional user-facing mention label. */
  label?: string
}
```

`SessionReferenceCandidate` هو موجه إلى مضيف اكتشاف إخراج. وجود الأكثر جديد Session عنوان وقت، هو `label` استخدام هذا عنوان؛ اختياري عرض نص فإن أولوية استخدام subagent حمل دائم إنشاء label. غربلة اختيار سوف معا بحث اثنان من،Session id و cwd، أبدا بحث transcript(نص سجل).Remote مرشح في `displayTitle` وجود وقت استخدام هو علامة مواصفة mention.

```ts type-equiv
/** One host-facing candidate from exact session metadata. */
interface SessionReferenceCandidate {
  /** Opaque source session identity. */
  sessionId: SessionId
  /** Latest log-backed title, falling back to the opaque session id. */
  label: string
  /** Display and canonical-mention text, preferring a subagent's durable creation label over {@link label}. */
  displayTitle?: string
  /** Source session working directory, when recorded. */
  cwd?: string
  /**
   * True when {@link SessionReferenceCandidate.cwd} is recorded and equals the
   * requesting agent's. Hosts that only surface a distinguishing location
   * read this instead of comparing paths they never received.
   */
  sameWorkspace: boolean
  /** Source session creation time in Unix epoch milliseconds. */
  createdAt: number
}
```

`sessionReferenceResolver/candidates` Remote طريقة نحو متصفح مستهلك توفير نفس اكتشاف قدرة، و لـ كل مرشح مرفق فوق مواصفة نص التوجيه mention.

```ts type-equiv
/** One discovery candidate carrying its canonical prompt mention. */
interface SessionReferenceMentionCandidate extends SessionReferenceCandidate {
  /** Canonical `@[label](dsh-session:…)` mention serialized into the prompt draft. */
  mention: string
}
```

## دقيق تجهيز بعد رسالة

دقيق تجهيز مرور مسار إبقاء يمكن قراءة حالي رسالة محتوى، و الأكثر كثير إرجاع واحد تجمع دمج سياق. ذلك حمل دائم source سجل سوف يأخذ `capturedThroughSeq` إبقاء لـ يتم مرجع Session أصلي generation في جلوس علامة، أبدا سوف يأخذ هو إعادة حل تفسير لـ الذي في Session seq.`capturedFormatVersion` سجل هذا generation؛ ناقص يمثل قد إصدار صيغة v0.

```ts type-equiv
/** Durable source session, cited event seqs, and snapshot facts for prepared cross-session context. */
interface SessionReferenceSource {
  kind: 'session-reference'
  /** Material lifted out of another session's log (`recall` context form). */
  form: 'recall'
  version: 1
  references: {
    sessionId: string
    label: string
    /** Source Session format generation; absence identifies version 0. */
    capturedFormatVersion?: number
    capturedThroughSeq: OptionalSessionSeq
    compacted: boolean
    originalMessages: number
    retainedMessages: number
    omittedMessages: number
    omittedBytes: number
    truncated: boolean
    inputIndex: number
  }[]
}
```

```ts type-equiv
/** Direct message content and optional referenced-session context. */
interface PreparedReferencedMessage {
  /** Readable message content after host mention tokens are removed. */
  content: ContentBlock[]
  /** Aggregated untrusted snapshot, absent when the message has no references. */
  additionalContext?: UserMessage
}
```

## خطأ

`SessionReferenceError.code` منطقة قسم بلا فاعلية إعداد أو إدخال، ذاتي مرجع، عدد كمية حد، مصدر قراءة فشل، ميزانية فشل و إلغاء. مضيف بروتوكول سوف يأخذ هذه code خريطة إلى كل منها خطأ غلاف تركيب، بلا حاجة فحص نص التوجيه بايت.

```ts type-equiv
/** Stable failure codes exposed to host adapters. */
type SessionReferenceErrorCode =
  | 'SESSION_REFERENCE_INVALID_CONFIG'
  | 'SESSION_REFERENCE_INVALID_REFERENCE'
  | 'SESSION_REFERENCE_SELF_REFERENCE'
  | 'SESSION_REFERENCE_TOO_MANY'
  | 'SESSION_REFERENCE_READ_FAILED'
  | 'SESSION_REFERENCE_BUDGET_EXCEEDED'
  | 'SESSION_REFERENCE_CANCELLED'
```

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxfilereferences--filereferenceservice-abstract-seam"></a>

### `ctx.fileReferences` — `FileReferenceService` (abstract seam)

Host capability for cancellable file-reference discovery.

```ts cordis-catalog
/**
 * List file and directory candidates for one agent's working directory.
 * @param agent - target agent whose session cwd bounds discovery.
 * @param query - path text following `@` or `@"`.
 * @param signal - caller cancellation.
 * @returns deterministic path-only candidates.
 */
abstract list( agent: Agent, query: string, signal: AbortSignal, ): Promise<FileReferenceCandidate[]>
```

Types: [Agent](core.zh.md)

Source: [`packages/context/file-reference/src/index.ts`](../../packages/context/file-reference/src/index.ts)

<a id="ctxsessionfilereferences--sessionfilereferences"></a>

### `ctx.sessionFileReferences` — `SessionFileReferences`

Host Remote adapter over the composed file-reference provider.

```ts cordis-catalog
/**
 * List file and directory candidates for one Agent's working directory.
 * @param agent - target Agent resolved from the Session identity on the wire.
 * @param query - path text following `@` or `@"`.
 * @param signal - caller cancellation.
 * @returns deterministic path-only candidates from the composed provider.
 */
@Remote list( agent: Agent, query: string, signal: AbortSignal, ): Promise<FileReferenceCandidate[]>
```

Types: [Agent](core.zh.md)

Source: [`packages/api/session-controller/src/file-references.ts`](../../packages/api/session-controller/src/file-references.ts)

<a id="ctxsessionreferenceresolver--sessionreferenceresolver"></a>

### `ctx.sessionReferenceResolver` — `SessionReferenceResolver`

Exact-read consumer that prepares immutable cross-session message context.

```ts cordis-catalog
/**
 * List reference candidates, ranked by working-directory affinity.
 *
 * Discovery runs at keystroke rate, so titles and subagent labels only ever
 * come from projection reads; sessions without either fall back to their id.
 * @param agent - target agent; self is excluded and its cwd drives ranking.
 * @param query - optional case-insensitive session-id/cwd/title/display-title substring.
 * @param limit - optional positive result cap.
 * @param signal - optional cancellation boundary for host autocomplete teardown.
 * @returns candidates with canonical mention labels and presentation titles.
 */
async listCandidates( agent: Agent, query: string = '', limit: number = this.config.candidateLimit, signal?: AbortSignal, ): Promise<SessionReferenceCandidate[]>

/**
 * Remote face of {@link listCandidates}: the configured candidate limit
 * applies, and every candidate carries the canonical mention a host inserts
 * into the prompt draft.
 * @param agent - target agent; self is excluded and its cwd drives ranking.
 * @param query - optional case-insensitive session-id/cwd/title substring.
 * @param signal - caller cancellation.
 * @returns mention-carrying candidates in rank order.
 */
@Remote('candidates') async remoteExportCandidates( agent: Agent, query: string, signal: AbortSignal, ): Promise<SessionReferenceMentionCandidate[]>

/**
 * Snapshot all references for one accepted direct message and return one aggregated durable context.
 * Automatic budgets use the last assembled route, or agent options before any assembly.
 * Missing model capacity or adapter uses 64 KiB; other metadata lookup failures and cancellation reject preparation.
 * Truncated previews include omission facts and a full-snapshot spill locator, or an explicit unavailable notice.
 * Cancellation prevents context publication, including when storage completes after cancellation.
 * @param agent - target agent; references to it are rejected.
 * @param content - already host-normalized readable message content.
 * @param references - structured source sessions in mention order.
 * @param signal - optional cancellation boundary for the active turn.
 * @returns detached content and optional referenced-session context.
 */
async prepare( agent: Agent, content: ContentBlock[], references: SessionReferenceInput[], signal?: AbortSignal, ): Promise<PreparedReferencedMessage>
```

Types: [Agent](core.zh.md) · [ContentBlock](llm-streaming.zh.md)

Source: [`packages/context/session-reference/src/index.ts`](../../packages/context/session-reference/src/index.ts)
<!-- END GENERATED cordis-surface -->

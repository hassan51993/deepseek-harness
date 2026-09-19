# حمل دائم PTY جلسة

[English](terminal.md) | العربية

PTY خلفية،`ctx.terminals` و موجه إلى نموذج مستهلك مشترك نوع.[حمل دائم PTY Agent Note](../../.agents/notes/implemented/feature/2026-07-16-persistent-pty-sessions.zh.md) مسؤول سجل قرار اعتماد حسب؛ هذا صفحة سجل قدوم ذاتي [`packages/terminal/terminal/src/types.ts`](../../packages/terminal/terminal/src/types.ts) عبر حزمة مفردات.

## معرف و حينئذ خيط

`TerminalSessionId` هو من خدمة صب صنعbranded id. اختياري اسم هو يملك من محلي عرض بيانات وصفية؛ تخويل مقارنة مقارنة هو يملك هذا جلسة تأكيد قطع `Agent`، بينما لا هو اسم أو تخمين قياس id.

`TerminalWaitReason` شرح مرة إرسال لـ أي إرجاع. هو و `TerminalSessionStatus` غير متصل: مرة إرسال ممكن بسبب ساكن صامت أو مهلة بينما إرجاع، لكن قمة طبقة shell ما زال تخزين نشط؛`session_exit` يمثل هذا shell قد خروج، بينما لا هو بعض عدد مهمة معنى قبل منصة عملية فرعية قد خروج.

```ts type-equiv
/** Why one interactive send returned control to its caller. */
type TerminalWaitReason = 'stdin_read' | 'inferred_idle' | 'timeout' | 'session_exit'
```

```ts type-equiv
/** Top-level PTY process status, independent of a send's wait reason. */
type TerminalSessionStatus =
  | { kind: 'running' }
  | { kind: 'exited'; exitCode: number | null; signal: NodeJS.Signals | null }
```

## خلفية و نشط وثب جلسة

خلفية مسؤول بدء بعض نوع قد تسجيل نوع جلسة و فحص قياس ذلك حينئذ خيط حالة.`TerminalSessionService` فقط في ابتدائي تحويل نجاح بعد عندئذ إصدار إرجاع جلسة، مع بعد مسؤول id تخويل و تنظيف. لا يمكن تنظيف جزء بدء مورد وقت، خلفية سوف بـ `TerminalBackendCleanupError` رفض بدء؛ هذا مثال، مورد تحرير مسار حيث قدرة إبقاء تنظيف فشل، أيضا لن استخدام هو استبدال استدعاء جهة إلغاء سبب. خلفية جلسة يملك طرفية حالة، و مسؤول يجعل قد التقاط مورد تماما توقف مستقر.

```ts type-equiv
/** Replaceable provider for one PTY session type. */
interface TerminalBackend {
  /** Stable type selected by {@link TerminalSpawnRequest.type}. */
  readonly type: string
  /** Create an unpublished session or reject after cleaning partial resources; cleanup failure uses {@link TerminalBackendCleanupError}. */
  spawn(spec: TerminalBackendSpawnSpec): Promise<TerminalBackendSession>
}
```

```ts type-equiv
/** Backend-owned live session retained by {@link TerminalSessionService}. */
interface TerminalBackendSession {
  /** Initial bounded terminal output returned from `terminal_open`. */
  readonly motd: string
  /** Top-level process id when one exists. */
  readonly pid?: number
  /** Start one exclusive send operation. */
  startSend(request: TerminalSendRequest): TerminalSendOperation
  /** Read one bounded page from retained scrollback. */
  read(request: TerminalReadRequest): TerminalReadResult
  /** Signal the verified foreground process group. */
  signal(signal: TerminalSignal): Promise<TerminalSignalResult>
  /** Observe top-level process status. */
  status(): TerminalSessionStatus
  /** Idempotently close the captured owned process tree and await quiescence. */
  close(reason: string): Promise<void>
}
```

## إرسال و إبقاء إخراج

واحد نشط وثب جلسة معا فقط قبول واحد نشط حركة إرسال. هذا عملية نحو عام خلفية مهمة توفير قراءة بعد أي دفع دخول إخراج تنقل علامة، و نحو قبل منصة استدعاء جهة توفير نهائي نتيجة.`TerminalReadResult` فإن لـ محدود جلسة scrollback مفرد وحيد قسم صفحة.

```ts type-equiv
/** Live backend-owned send; exactly one may be active per PTY session. */
interface TerminalSendOperation {
  /** Resolves after readiness, timeout, cancellation, or top-level process exit. */
  done: Promise<TerminalSendResult>
  /** Consume output produced since the prior call. */
  readOutput(): TerminalSendRead
  /** Request `SIGINT`; returns false after the operation settled. */
  cancel(): boolean
}
```

```ts type-equiv
/** Settled result for one foreground or background send. */
interface TerminalSendResult {
  /** Bounded rendered terminal delta remaining at settlement. */
  viewport: string
  /** Why the wait returned; this does not imply arbitrary child-process exit. */
  waitReason: TerminalWaitReason
  /** Top-level session status observed at settlement. */
  sessionStatus: TerminalSessionStatus
  /** Whether output was dropped from the operation or retained scrollback. */
  truncated: boolean
}
```

## ملكية و حمل دائم صفة

`TerminalSessionService` سوف سوف واحد بند انتظار إتمام تنظيف مرفق إضافة إلى تأكيد قطع يملك من أثر مجال، رفض أخرى يملك من عملية، و يجعل جلسة في خلفية أو أداة إضافة إعادة تحميل خلال إبقاء تخزين نشط.PTY حالة و أصلي بايت ما زال نطاق حد في عملية داخل. نموذج إدخال و محدود إرجاع إخراج عبر قائم `tool/call`،`tool/result` و مهمة نتيجة مسار حمل دائم حفظ، بينما لا هو تكرار سجل PTY جلسة حدث.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxterminals--terminalsessionservice"></a>

### `ctx.terminals` — `TerminalSessionService`

In-process registry for replaceable PTY backends and exact-Agent sessions.

```ts cordis-catalog
/**
 * Register one backend type for this effect scope.
 * @param backend - provider with a non-empty unique type.
 * @returns disposer that removes exactly this contribution.
 */
registerBackend(backend: TerminalBackend): () => void

/**
 * List registered backend types in registration order.
 * @returns fresh backend type names.
 */
listBackends(): string[]

/**
 * Create and publish one owner-scoped session after backend setup succeeds.
 * @param owner - exact registered Agent that owns access and cleanup.
 * @param request - backend type plus optional owner-local name and cwd.
 * @param signal - cancellation of unpublished setup.
 * @returns published identity, metadata, status, and MOTD.
 */
async spawn(owner: Agent, request: TerminalSpawnRequest, signal?: AbortSignal): Promise<TerminalSpawnResult>

/**
 * Test whether an exact owner has a published session or unpublished spawn.
 * @param owner - exact live owner to inspect.
 * @returns true across the entire spawn-to-close interval, with no publication gap.
 */
hasOwnerActivity(owner: Agent): boolean

/**
 * Start one exclusive interactive send.
 * @param owner - exact session owner.
 * @param id - target PTY identity.
 * @param request - explicit text, submit behavior, and cancellation.
 * @returns live operation handle for foreground await or task registration.
 */
startSend(owner: Agent, id: TerminalSessionId, request: TerminalSendRequest): TerminalSendOperation

/**
 * Read one bounded scrollback page from an owned session.
 * @param owner - exact session owner.
 * @param id - target PTY identity.
 * @param request - optional newest-relative offset and line count.
 * @returns bounded retained text and pagination metadata.
 */
read(owner: Agent, id: TerminalSessionId, request: TerminalReadRequest = {}): TerminalReadResult

/**
 * Deliver an allowed signal through an owned backend session.
 * @param owner - exact session owner.
 * @param id - target PTY identity.
 * @param signal - allowed POSIX signal name.
 * @returns delivered foreground process-group identity.
 */
signal(owner: Agent, id: TerminalSessionId, signal: TerminalSignal): Promise<TerminalSignalResult>

/**
 * Close one owned session and remove it only after quiescent backend cleanup.
 * @param owner - exact session owner.
 * @param id - target PTY identity.
 * @param reason - diagnostic cleanup reason.
 * @returns true for a newly closed session, false when the same close is already in flight.
 */
async kill(owner: Agent, id: TerminalSessionId, reason: string = 'model request'): Promise<boolean>

/**
 * List fresh snapshots for exactly one owner.
 * @param owner - exact owner whose sessions are visible.
 * @returns owner-visible snapshots in publication order.
 */
list(owner: Agent): TerminalSessionSnapshot[]
```

Types: [Agent](core.zh.md)

Source: [`packages/terminal/terminal/src/index.ts`](../../packages/terminal/terminal/src/index.ts)
<!-- END GENERATED cordis-surface -->

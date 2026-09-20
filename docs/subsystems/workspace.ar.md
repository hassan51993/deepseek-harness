# مساحات العمل

[English](workspace.md) | العربية

مساحةُ العمل هي السجلُّ الدائم لدليل يعمل فيه المستخدم: معرّفٌ ثابت فوق مسار معياري، وعنوانٌ للعرض، والحسابُ المرتَّب للجلسات التي تخصه. والنظامُ حزمةٌ واحدة ([dsh-workspace](../../packages/workspace/workspace)، `ctx.workspaceRegistry`) — قدرةٌ اختيارية في جانب المضيف، لا جزءٌ من عمود agent loop، ولا تراها النماذجُ (بلا أدوات، وبلا نص مطالبة، وبلا أحداث جلسة). وهي تخزّن سجلاتِها عبر [صيغة مجال التخزين](storage.ar.md) وتتحقق من عضوية الجلسة في مقابل [`SessionHeader.cwd`](persistence.ar.md#sessionheader--metadata-beside-the-log)، فـ`storageDomain` و`sessionPersistence` تابعتان إجباريتان عند الإقلاع: فإن تعذّر قرينُ الحفظ الدائم بقيت الإضافةُ معلَّقة بدل أن يُظنّ به تاريخًا فارغًا. وسجلُّ التصميم: [ملاحظة الوكيل عن تخزين KV المجالي](../../.agents/notes/proposed/architecture/2026-07-24-domain-kv-storage-and-workspace.ar.md)؛ وترتيبُ الإقلاع والواجهة الرسومية: [ملاحظة الوكيل عن مسار منتج واجهة مساحات العمل](../../.agents/notes/archived/feature/2026-07-25-workspace-ui-product-flow.md).

المصدر: [`packages/workspace/workspace/src/types.ts`](../../packages/workspace/workspace/src/types.ts)

## الهوية

```ts type-equiv
/**
 * Identifies one workspace record. A generated uuid, never the path: path
 * normalization rewrites paths, and a reference anchor must stay stable.
 */
type WorkspaceId = Branded<'WorkspaceId'>
```

و`WorkspaceId` [معرّفٌ موسوم](core.ar.md#branded-ids). وهويةُ المسار منفصلة: فـ`realpathNormalize` (`fs.realpath`، مع حلّ الخطوط المائلة الذيلية و`..` والروابط الرمزية) هو مرجعُ التفرد الوحيد — تُخزَّن مساراتُ مساحات العمل معيَّرةً، والتفردُ مساواةُ سلاسل المسارات المعيارية (فرابطٌ رمزي إلى دليل مملوك يتصادم)، وتمرّ فحوصُ دليل عمل الجلسة عند الربط بالمرجع نفسِه.

## كيان مساحة العمل

لا يرى المستهلكون إلا واجهةَ `Workspace`؛ ويبقى التنفيذُ خاصًّا بالحزمة.

```ts type-equiv
/**
 * One workspace: a stable id over an existing directory, a display title, and
 * an ordered candidate account of sessions. Membership requires both an id in
 * that account and a session header whose canonical cwd equals the workspace
 * path. Consumers only see this interface; the implementation stays private.
 */
interface Workspace {
  /** Stable record id (generated uuid). */
  readonly id: WorkspaceId

  /**
   * Canonical directory path: the `fs.realpath` of the path given at create
   * time (trailing slashes, `..`, and symlinks all resolved). Never rewritten
   * afterwards, even when the directory disappears (see {@link status}).
   */
  readonly path: string

  /** Display title. Defaults to the final path segment, or a filesystem root's own spelling; duplicates are allowed. */
  readonly title: string

  /** ISO-8601 creation instant, stamped at create and never rewritten. */
  readonly createdAt: string

  /** ISO-8601 instant of the last durable mutation (create counts as one). */
  readonly updatedAt: string

  /**
   * Header-validated sessions in manually owned order: a new session is
   * prepended at attach, explicit reordering goes through
   * `insertSessionBefore`, and activity never reorders. The durable candidate
   * account is filtered synchronously: missing headers, invalid cwd values,
   * and canonical cwd mismatches are never returned. A subsequent workspace
   * mutation prunes those filtered candidates durably.
   */
  readonly sessionIds: readonly SessionId[]

  /**
   * Replace the display title durably.
   * @param title - New title; any string, duplicates across workspaces allowed.
   * @returns resolution after durability.
   */
  setTitle(title: string): Promise<void>

  /**
   * Prepend a session to this workspace's candidate account. An already
   * accounted id resolves without writing, aside from the durable
   * filtered-candidate prune every accepted mutation performs. A new id's
   * live or persisted
   * header cwd must resolve to an existing directory equal to {@link path};
   * unknown ids, missing or invalid cwd values, and mismatches reject without
   * writing.
   * @param sessionId - The session to record.
   * @returns resolution after durability.
   */
  attachSession(sessionId: SessionId): Promise<void>

  /**
   * Move an accounted session within the manual order, DOM-insertBefore-like:
   * with an anchor the session lands before it, without one it appends to the
   * end. Only the moved id changes position. A session or anchor absent from
   * the account rejects without writing; a move to the current position
   * resolves without writing, aside from the durable filtered-candidate
   * prune every accepted mutation performs; decided on the domain write
   * chain.
   * @param sessionId - The accounted session to move.
   * @param beforeSessionId - Accounted anchor to insert before; omitted appends.
   * @returns resolution after durability.
   */
  insertSessionBefore(sessionId: SessionId, beforeSessionId?: SessionId): Promise<void>

  /**
   * Remove a session from this workspace's account. Idempotent: an id not on
   * the account resolves without writing, aside from the durable
   * filtered-candidate prune every accepted mutation performs; decided on
   * the domain write chain like attach. Never touches the session's own stored log.
   * @param sessionId - The session to remove.
   * @returns resolution after durability.
   */
  detachSession(sessionId: SessionId): Promise<void>

  /**
   * Live directory check, uncached: whether {@link path} currently exists and
   * is a directory. A missing directory never mutates the record — the
   * directory may only be temporarily moved.
   * @returns `'ok'` when the directory exists, `'missing-dir'` otherwise.
   */
  status(): Promise<'ok' | 'missing-dir'>
}
```

وحقيقةُ الملكية هي `sessionIds` المرتَّبة في السجل، ولا تُشتق قط من دليل عمل الجلسة — لكن العضويةَ تشترط الاثنين: معرّفًا في الحساب، وترويسةً يساوي دليلُ عملها المعياري مسارَ مساحة العمل، فتخص الجلسةُ الواحدة بنيويًّا مساحةَ عمل واحدة على الأكثر. والكتاباتُ الفاشلة ترفض (فأخطاءُ الحساب في `insertSessionBefore` تُرفع `WorkspaceMoveInvalidError`، وإخفاقاتُ التخزين أخطاءً عادية)؛ وكلُّ تغيير مقبول يختم `updatedAt` ويشذّب دائمًا المرشحين الذين لم يعودوا يجتازون فحصَ العضوية.

## السجل: `ctx.workspaceRegistry`

يملك `WorkspaceRegistry` ([التوقيعات](#ctxworkspaceregistry--workspaceregistry)) التسجيلَ والحلّ. ويشترط `create(path, title?)` مسارًا مؤهَّلًا كاملًا، فيعيّره، ويرفض مسارًا غيرَ موجود (بخطأ `ENOENT` الأصلي) أو ما ليس دليلًا، ويعيد الكيانَ القائم كما هو حين يكون المسارُ المعياري مملوكًا سلفًا، وإلا أنشأ سجلًّا بـ`title ?? defaultWorkspaceTitle(path)` مسبوقًا به في ترتيب السجل الدائم (وقد تتشارك مساراتٌ معيارية مختلفة عنوانَ عرض واحدًا، والمسارُ بلا مقطع أخير يستعمل هجاءَ جذره). و`get(id)` و`list()` المرتَّبة قراءتان متزامنتان من المخزن؛ ويطبّق `resolveByPath(path)` مرجعَ realpath المؤهَّل كاملًا نفسَه بلا إنشاء. ولا يزيل `delete(id)` إلا التسجيلَ ومدخلَ الترتيب وحسابَ الجلسات — فلا يُمَسّ الدليلُ ولا ملفاتُ المستخدم ولا الجلساتُ الحية ولا السجلاتُ المحفوظة، فتصير تلك الجلساتُ بلا مجموعة ([القرار](../../.agents/notes/implemented/feature/2026-07-27-workspace-registration-deletion.ar.md))؛ والمعرّفاتُ المجهولة تعيد `false`. ويحفظ الإنشاءُ والحذفُ واسمَ تغيير معلَّق قبل أن تتباعد كتابتاهما (السجل والترتيب)؛ ويحلّ الإقلاعُ التغييرَ الموسوم بعينه — بحذف صف الجدول الموسوم، فيُكمل حذفًا مقطوعًا ويتراجع عن إنشاء مقطوع (فالتسجيلُ قابل لإعادة الإنشاء، والتراجعُ هو الاتجاه الآمن) — ويفشل بصوت عالٍ تعارضُ الترتيب والجدول بلا واسم بوصفه فسادًا.

وتأخذ الجلساتُ دليلَ عملها عند الإنشاء ممن ينشئها، لا من هذا السجل — فبوابةُ الواجهة البرمجية تحلّ دليلَ عمل الجلسة الجديدة من `path` مساحة العمل المختارة (وترتد إلى دليل عمل صريح أو افتراضي)، وتنشئ الجلسةَ فيحطّ دليلُ العمل في [`SessionHeader`](persistence.ar.md#sessionheader--metadata-beside-the-log) غير القابل للتغيير لديها، ثم تنادي `attachSession` الذي يعيد التحقق من دليل عمل الترويسة المخزَّن في مقابل مسار مساحة العمل. وعند أول بدء ناجح، يُقلع السجلُّ بالتاريخ من الترويسات المحفوظة وحدها (`id` و`cwd` و`createdAt` — لا أجسامَ أحداث قط)، فيجمع الجلساتِ ذواتِ دليل العمل المعياري الصالح في مساحات عمل لكل دليل، الأحدثُ أولًا؛ ويُكتب واسمُ التهيئة أخيرًا فيستأنف إقلاعٌ مقطوع بأمان. والإقلاعُ لمرة واحدة: فالجلساتُ القديمة بلا دليل عمل تبقى بلا مجموعة، والجلساتُ المنشأة بعده لا تنضم إلى مساحة عمل إلا عبر `attachSession`.

## المستهلكون

تقدّم [`dsh-workspace-controller`](../../packages/api/workspace-controller) عملياتِ مساحات العمل لعملاء الواجهة الرسومية فوق `ctx.workspaceRegistry`، وتنفّذ [`dsh-session-controller`](../../packages/api/session-controller) مسارَ «أنشئ الجلسة ثم اربطها» المذكور أعلاه. أما [dsh-agent-instructions](../../packages/context/agent-instructions) فليست مستهلكًا رغم اسمها: فهي تكتشف ملفاتِ التعليمات على نسق AGENTS.md تحت دليل عمل الوكيل نفسِه ولا تمسّ `ctx.workspaceRegistry` قط — فالكلمةُ المشتركة تشير إلى دليل عمل المستخدم، لا إلى كيانات هذا السجل.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxdirectorypicker--directorypicker-abstract-seam"></a>

### `ctx.directoryPicker` — `DirectoryPicker` (abstract seam)

Abstract directory-picking service. Subclass, implement `capability()`, and load the subclass as a plugin — it registers as `ctx.directoryPicker` (one implementation per context; loading a second throws, cordis' standard duplicate-service behavior). The capability object must be stable for the service lifetime: consumers may capture it across calls.

```ts cordis-catalog
/**
 * The backend's interaction capability.
 * @returns the discriminated capability consumers switch on.
 */
abstract capability(): DirectoryPickerCapability
```

Source: [`packages/host/directory-picker/src/index.ts`](../../packages/host/directory-picker/src/index.ts)

<a id="ctxdirectorypickercontroller--directorypickercontroller"></a>

### `ctx.directoryPickerController` — `DirectoryPickerController`

Host service backing the generated `ctx.remote.directoryPicker` namespace. The seam it exports is abstract and therefore never a Loader entry of its own, so this controller carries the wire verbs: one composed backend serves either the native chooser or the browse primitives, and a verb the composition cannot serve is refused rather than approximated.

```ts cordis-catalog
/**
 * Open the host's OS chooser for a Remote caller.
 * @param signal - caller lifetime; abort terminates the chooser.
 * @returns the chosen absolute path, or null when the operator cancels.
 */
@Remote('pick') async pick(signal: AbortSignal): Promise<string | null>

/**
 * List one directory level for a Remote caller's in-app browser.
 * @param path - absolute directory to list; absent lists the home directory.
 * @param signal - caller lifetime; abort stops the backend's scan instead of
 *   letting it outlive a disconnected caller.
 * @returns the level's listing with its ancestry.
 */
@Remote('list') async list(path: string | undefined, signal: AbortSignal): Promise<DirectoryListing>

/**
 * Create one child directory for a Remote caller's in-app browser.
 * @param path - absolute existing parent directory.
 * @param name - single non-blank path segment.
 * @returns the created directory's absolute path.
 */
@Remote('createDirectory') async createDirectory(path: string, name: string): Promise<string>
```

Source: [`packages/api/workspace-controller/src/directory-picker.ts`](../../packages/api/workspace-controller/src/directory-picker.ts)

<a id="ctxterminalcontroller--terminalcontroller"></a>

### `ctx.terminalController` — `TerminalController`

Typed Remote control of transient Session-owned terminal processes.

```ts cordis-catalog
/**
 * Read the Session working directory and terminal limits without resolving a shell.
 * @param agent - Session owner supplied by the Gateway.
 * @param signal - request cancellation.
 * @returns the Session workspace directory and terminal limits.
 */
@Remote environment(agent: Agent, signal: AbortSignal): TerminalEnvironment

/**
 * Discover installed shells in the Session's execution environment.
 * @param agent - Session owner supplied by the Gateway.
 * @param signal - request cancellation.
 * @returns verified profiles, with the configured or system default first.
 */
@Remote shells(agent: Agent, signal: AbortSignal): Promise<TerminalShell[]>

/**
 * List retained terminals without resolving or activating an Agent.
 * @param sessionId - displayed Session identity, including offline history.
 * @returns terminals retained for this Host lifetime.
 */
@Remote list(sessionId: SessionId): WebTerminalInfo[]

/**
 * Allocate a user shell once for a caller-generated identity, without Agent sandbox or approval restrictions.
 * @param agent - Session owner supplied by the Gateway.
 * @param request - initial dimensions and idempotency identity.
 * @param signal - allocation cancellation; committed terminals survive disconnection.
 * @returns the existing or newly committed terminal.
 */
@Remote async create(agent: Agent, request: TerminalCreateRequest, signal: AbortSignal): Promise<WebTerminalInfo>

/**
 * Retain an existing terminal for a window without activating its Agent or taking input control.
 * @param sessionId - owning Session identity, including an inactive saved layout.
 * @param id - retained Host terminal identity.
 * @param signal - physical Remote stream cancellation.
 * @returns a hold acknowledgement followed by an open lifetime stream.
 */
@Remote({ mode: 'stream' }) retain(sessionId: SessionId, id: WebTerminalId, signal: AbortSignal): AsyncIterable<TerminalRetentionFrame>

/**
 * Attach to a terminal without binding its process lifetime to the transport.
 * @param agent - Session owner supplied by the Gateway.
 * @param id - terminal identity.
 * @param attachmentId - new exclusive input attachment.
 * @param signal - physical stream cancellation.
 * @returns screen recovery followed by output and metadata changes.
 */
@Remote({ mode: 'stream' }) follow(agent: Agent, id: WebTerminalId, attachmentId: TerminalAttachmentId, signal: AbortSignal): AsyncIterable<TerminalFrame>

/**
 * Deliver raw input, including Tab completion and control characters.
 * @param agent - Session owner supplied by the Gateway.
 * @param id - terminal identity.
 * @param attachmentId - current writable attachment.
 * @param data - input bytes represented as UTF-8 text.
 * @returns after provider input acceptance.
 */
@Remote async write(agent: Agent, id: WebTerminalId, attachmentId: TerminalAttachmentId, data: string): Promise<void>

/**
 * Update the dimensions of the PTY and recovery screen.
 * @param agent - Session owner supplied by the Gateway.
 * @param id - terminal identity.
 * @param attachmentId - current writable attachment.
 * @param cols - column count.
 * @param rows - row count.
 * @returns after the resize completes.
 */
@Remote async resize(agent: Agent, id: WebTerminalId, attachmentId: TerminalAttachmentId, cols: number, rows: number): Promise<void>

/**
 * Rename a terminal without changing its shell.
 * @param agent - Session owner supplied by the Gateway.
 * @param id - terminal identity.
 * @param title - nonempty display title, at most 120 characters.
 */
@Remote rename(agent: Agent, id: WebTerminalId, title: string): void

/**
 * Close an identity to future creation and kill its process range; repeated closes succeed.
 * @param agent - Session owner supplied by the Gateway.
 * @param id - terminal identity.
 * @returns after provider cleanup succeeds. A failure retains the terminal for retry.
 */
@Remote async close(agent: Agent, id: WebTerminalId): Promise<void>
```

Types: [Agent](core.ar.md) · [SessionId](core.ar.md)

Source: [`packages/api/terminal-controller/src/index.ts`](../../packages/api/terminal-controller/src/index.ts)

<a id="ctxworkspacecontroller--workspacecontroller"></a>

### `ctx.workspaceController` — `WorkspaceController`

Host service backing the generated `ctx.remote.workspace` namespace.

```ts cordis-catalog
/**
 * Create or idempotently resolve one Workspace over an existing directory.
 * @param request - directory path to register.
 * @returns the Workspace and whether this call created it.
 */
@Remote('create') create(request: WorkspaceCreateRequest): Promise<WorkspaceCreateValue>

/**
 * Rename one Workspace to a unique non-blank title.
 * @param request - Workspace identity and proposed title.
 * @returns the updated Workspace projection.
 */
@Remote('rename') rename(request: WorkspaceRenameRequest): Promise<WorkspaceValue>

/**
 * Remove one Workspace registration while retaining files and Sessions.
 * @param request - Workspace identity to remove.
 * @returns deletion confirmation.
 */
@Remote('delete') delete(request: WorkspaceDeleteRequest): Promise<WorkspaceDeleteValue>

/**
 * Move one Workspace within the registry display order.
 * @param request - moved Workspace and optional anchor.
 * @returns the complete resulting Workspace order.
 */
@Remote('insertBefore') insertBefore(request: WorkspaceInsertBeforeRequest): Promise<WorkspaceOrderValue>

/**
 * Move one accounted Session within a Workspace.
 * @param request - Workspace, Session, and optional anchor identities.
 * @returns the updated Workspace projection.
 */
@Remote('insertSessionBefore') insertSessionBefore(request: WorkspaceInsertSessionBeforeRequest): Promise<WorkspaceValue>

/**
 * Hide one known Session from Workspace grouping surfaces.
 * @param request - Session identity to archive.
 * @returns the complete resulting archive set.
 */
@Remote('archiveSession') archiveSession(request: WorkspaceArchiveSessionRequest): Promise<WorkspaceArchiveValue>

/**
 * Restore one archived Session to Workspace grouping surfaces.
 * @param request - Session identity to unarchive.
 * @returns the complete resulting archive set.
 */
@Remote('unarchiveSession') unarchiveSession(request: WorkspaceUnarchiveSessionRequest): Promise<WorkspaceArchiveValue>

/**
 * Stream a complete Workspace baseline followed by ordered increments.
 * @param signal - generation cancellation.
 * @returns baseline followed by ordered Workspace increments.
 */
@Remote({ mode: 'stream' }) follow(signal: AbortSignal): AsyncIterable<WorkspaceFollowFrame>
```

Source: [`packages/api/workspace-controller/src/index.ts`](../../packages/api/workspace-controller/src/index.ts)

<a id="ctxworkspacefiles--workspacefiles"></a>

### `ctx.workspaceFiles` — `WorkspaceFiles`

Host Remote file reads and workspace directory observations over the composed filesystem.

```ts cordis-catalog
/**
 * Read one page of lines from a UTF-8 file readable by the filesystem backend.
 * @param workspaceFileScope - header-derived workspace root for the Session identity on the wire.
 * @param path - absolute path or path relative to the workspace root; files outside it are allowed.
 * @param range - the line window; omitted fields take the page defaults.
 * @param signal - caller cancellation.
 * @returns the page, the file's version at the stat before it, and whether it reaches the last line.
 */
@Remote async read( workspaceFileScope: WorkspaceFileScope, path: string, range: WorkspaceFileRange, signal: AbortSignal, ): Promise<WorkspaceFileText>

/**
 * Read one byte window of a regular file readable by the filesystem backend: raw
 * bytes, no text decoding and no binary rejection.
 * @param workspaceFileScope - header-derived workspace root for the Session identity on the wire.
 * @param path - absolute path or path relative to the workspace root; files outside it are allowed.
 * @param range - the byte window; omitted fields take the window defaults.
 * @param signal - caller cancellation.
 * @returns the window in base64, the file's version and size at the stat before it, and whether it reaches the last byte.
 */
@Remote async readBytes( workspaceFileScope: WorkspaceFileScope, path: string, range: WorkspaceByteRange, signal: AbortSignal, ): Promise<WorkspaceFileBytes>

/**
 * Read a complete regular file as bytes, subject to the configured full-file cap.
 * @param workspaceFileScope - header-derived workspace root for the Session identity on the wire.
 * @param path - absolute or workspace-relative file path.
 * @param signal - caller cancellation.
 * @returns one complete base64 window with offset zero and eof true; oversized files fail with too-large.
 */
@Remote async readAll(workspaceFileScope: WorkspaceFileScope, path: string, signal: AbortSignal): Promise<WorkspaceFileBytes>

/**
 * Read a complete file relative to another file's directory, including outside the workspace.
 * @param workspaceFileScope - header-derived workspace root for the Session identity on the wire.
 * @param path - base file, absolute or workspace-relative.
 * @param relativePath - relative filesystem path, not a URL or absolute path.
 * @param signal - caller cancellation.
 * @returns the complete related file using the ordinary file-size and access checks.
 */
@Remote async readRelated( workspaceFileScope: WorkspaceFileScope, path: string, relativePath: string, signal: AbortSignal, ): Promise<WorkspaceFileBytes>

/**
 * Report one regular file's identity, version, and size without its content.
 * @param workspaceFileScope - header-derived workspace root for the Session identity on the wire.
 * @param path - absolute path or path relative to the workspace root; files outside it are allowed.
 * @param signal - caller cancellation.
 * @returns the file's absolute path, current version, and byte size.
 */
@Remote async stat(workspaceFileScope: WorkspaceFileScope, path: string, signal: AbortSignal): Promise<WorkspaceFileStat>

/**
 * List the direct children of one directory inside the Session's workspace.
 * @param workspaceFileScope - header-derived workspace root for the Session identity on the wire.
 * @param path - workspace path, absolute or relative to the workspace root.
 * @param signal - caller cancellation.
 * @returns the directory's children in the backend's stable name order, bounded by the entry cap.
 */
@Remote async list(workspaceFileScope: WorkspaceFileScope, path: string, signal: AbortSignal): Promise<WorkspaceDirectoryListing>

/**
 * Stream every `fs/observed` observation of a file inside the Session's
 * workspace. Only instrumented filesystem operations report here; the OS is
 * not watched.
 * @param workspaceFileScope - header-derived workspace root for the Session identity on the wire.
 * @param signal - generation cancellation.
 * @returns `ready` once the Host observation queue is active and the workspace
 *   root is resolved, then queued and live observations in emission order.
 */
@Remote({ mode: 'stream' }) changes(workspaceFileScope: WorkspaceFileScope, signal: AbortSignal): AsyncIterable<WorkspaceFileWatchFrame>
```

Source: [`packages/api/workspace-files/src/index.ts`](../../packages/api/workspace-files/src/index.ts)

<a id="ctxworkspaceregistry--workspaceregistry"></a>

### `ctx.workspaceRegistry` — `WorkspaceRegistry`

Durable workspace registry. Startup waits for `sessionPersistence`, builds one canonical-cwd header index, and completes the one-time history bootstrap before the service becomes active. The persistence dependency is mandatory so an unavailable peer can never be mistaken for an empty history and commit the initialized marker.

```ts cordis-catalog
/**
 * Create or reuse a workspace for an existing directory. The fully qualified
 * path is canonicalized through `fs.realpath`; a relative, nonexistent, or
 * non-directory path rejects. Repeated calls for the same canonical path
 * return the existing entity without changing its title.
 * A newly created workspace is prepended to the durable registry order.
 * Different canonical paths may share a display title.
 * @param path - Existing directory to own, in a fully qualified path spelling.
 * @param title - Display title used only when a new record is created.
 * @returns the existing or newly durable workspace.
 */
async create(path: string, title?: string): Promise<Workspace>

/**
 * Look up a workspace by id.
 * @param id - Workspace id.
 * @returns the workspace, or `undefined` when unknown.
 */
get(id: WorkspaceId): Workspace | undefined

/**
 * Synchronous workspace projection in durable registry order. Every
 * entity's `sessionIds` getter is already filtered by the startup/live
 * canonical-cwd header index; this method performs no persistence reads.
 * @returns a fresh ordered array of workspace entities.
 */
list(): Workspace[]

/**
 * Delete one workspace registration while retaining its directory and every
 * session log. The durable order is updated before the table deletion; a
 * failed table write restores the prior order and keeps the entity
 * published. Unknown ids are an idempotent no-op for domain callers.
 * @param id - Workspace registration to remove.
 * @returns `true` when a record was deleted, `false` when it was unknown.
 */
delete(id: WorkspaceId): Promise<boolean>

/**
 * Move one workspace within the durable display order, DOM-insertBefore-like.
 * With an anchor it lands before that workspace; without one it appends.
 * @param id - Workspace to move.
 * @param beforeId - Workspace anchor; omitted appends.
 * @returns the complete committed workspace order.
 */
insertBefore(id: WorkspaceId, beforeId?: WorkspaceId): Promise<readonly WorkspaceId[]>

/**
 * Archive one session durably. The session must exist (live or in session
 * persistence); its workspace accounting — or lack of one — is irrelevant.
 * An already archived id resolves without writing.
 * @param sessionId - The session to archive.
 * @returns resolution after durability.
 */
archiveSession(sessionId: SessionId): Promise<void>

/**
 * Unarchive one session durably by dropping it from the registry-global
 * archive set; the accounting slot was never touched, so the session
 * returns to its recorded position. Unarchiving runs no session-existence
 * check because removing an id cannot introduce an unknown one, so an
 * entry whose session is gone still resolves. An id that is not archived
 * resolves without writing.
 * @param sessionId - The session to unarchive.
 * @returns resolution after durability.
 */
unarchiveSession(sessionId: SessionId): Promise<void>

/**
 * Resolve by canonical directory path without creating or mutating a
 * workspace. A missing path rejects during `realpath`; an existing unowned
 * directory returns `undefined`.
 * @param path - Existing directory path in a fully qualified spelling.
 * @returns the workspace owning the canonical path, when one exists.
 */
async resolveByPath(path: string): Promise<Workspace | undefined>
```

Types: [SessionId](core.ar.md)

Source: [`packages/workspace/workspace/src/index.ts`](../../packages/workspace/workspace/src/index.ts)
<!-- END GENERATED cordis-surface -->

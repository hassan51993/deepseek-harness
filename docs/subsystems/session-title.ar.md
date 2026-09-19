# جلسة عنوان

[English](session-title.md) | العربية

[`@deepseek-ai/dsh-session-title`](../../packages/session/session-title) الذي يملك حمل دائم، بعد كتابة تغطية عنوان حالة و اختياري مختلف خطوة مزود مفردات. مشترك LLM(كبير لغة نموذج) مساعد مساعدة مكون مسؤول دقيق مساعد مساعدة طلب سجل. كل حزمة README مسؤول وقت ترتيب، رجوع، فشل و fork سلوك؛ توليد[حفظ دائم سجل حدث دليل](../persistence-catalog.ar.md) مسؤول كامل حدث إعلان.

شفرة المصدر:[`packages/session/session-title/src/index.ts`](../../packages/session/session-title/src/index.ts) ،[`packages/session/session-title-llm/src/index.ts`](../../packages/session/session-title-llm/src/index.ts)

## حمل دائم عنوان حالة

مزود توليد إصلاح حجز وقت سوف سجل `SessionTitleProviderId`.`SessionTitleEventData` صف خروج توليد عنوان وقت استخدام دقيق شخص صنف رسالة seq،`SessionTitleSnapshot` فإن إضافة دخول `ctx.sessionTitle.get()` و `foldSessionTitle()` إرجاع حمل دائم حدث غلاف تركيب معلومة.`title` إسقاط إصدار 1 حالة و عميل عرض كل فقط إبقاء عنوان نص أو `null`، لذلك قائم حفظ دائم ذاكرة مؤقتة سطر ما زال يمكن قراءة.

```ts type-equiv
/** Identifies one session-title provider registration. */
type SessionTitleProviderId = Branded<'SessionTitleProviderId'>
```

```ts type-equiv
/** Exact auxiliary model route that produced a title. */
interface SessionTitleModelIdentity {
  /** Registered LLM provider route. */
  readonly provider: string
  /** Provider model id. */
  readonly model: string
}
```

```ts type-equiv
/** Durable ownership record for an accepted session title. */
type SessionTitleSource =
  | { readonly kind: 'fallback' }
  | {
    readonly kind: 'provider'
    readonly provider: SessionTitleProviderId
    readonly model?: SessionTitleModelIdentity
  }
  | {
    /** Explicit user rename: pins the title — automatic generation stops scheduling. */
    readonly kind: 'user'
  }
```

```ts type-equiv
/** Payload of the log-only `session/title` event. */
interface SessionTitleEventData {
  /** Normalized non-empty title text. */
  readonly title: string
  /** Exact human `user/message` seqs used to derive this title; empty for an explicit user rename. */
  readonly messageSeqs: SessionSeq[]
  /** Whether the built-in fallback, a registered provider, or the user supplied the title. */
  readonly source: SessionTitleSource
}
```

```ts type-equiv
/** Latest folded title plus the title event's durable envelope facts. */
interface SessionTitleSnapshot extends SessionTitleEventData {
  /** Seq of the latest `session/title` event. */
  readonly eventSeq: SessionSeq
  /** Timestamp of the latest `session/title` event. */
  readonly updatedAt: number
}
```

## مساعد مساعدة طلب سجل

مشترك LLM مساعد مساعدة مكون سوف في استدعاء نموذج قبل، سجل كل واحد بند قد مرور تحقق كما يمكن توزيع عنوان طلب. أي جعل لاحق توليد فشل، تحميل حمل ما زال سوف تكرار الآن نموذج مرئي نظام إدخال و رسالة إدخال، توجيه، إخراج حد أعلى، مزود ملكية و مصدر رسالة عودة بسبب.

```ts type-equiv
/** Exact model-visible request recorded before one auxiliary title dispatch. */
interface SessionTitleLlmRequestEventData {
  /** Registered title-provider identity responsible for the request. */
  readonly titleProvider: SessionTitleProviderId
  /** Exact human `user/message` seqs represented in `messages`. */
  readonly messageSeqs: SessionSeq[]
  /** Exact auxiliary LLM route. */
  readonly route: SessionTitleModelIdentity
  /** Exact auxiliary system prompt. */
  readonly system: string
  /** Exact auxiliary message list. */
  readonly messages: Message[]
  /** Exact auxiliary output-token cap. */
  readonly maxTokens: number
}
```

## مزود إدخال و إخراج

خدمة سوف مقابل قطع حتى بعض واحد إصلاح حجز دمج إطار رسالة إنشاء لقطة. مزود إرجاع seq فقط يمكن قدوم ذاتي هذا طلب؛ من خدمة مسؤول وصل قبول مسار سوف تحقق ترتيب، مواصفة تحويل عنوان، قوي صنع تنفيذ بايت حد أعلى، و إلحاق عنوان و ذلك مصدر رسالة seq و مصدر نوع.

```ts type-equiv
/** One eligible human text message exposed to title providers. */
interface SessionTitleUserMessage {
  /** Source `user/message` event seq. */
  readonly seq: SessionSeq
  /** Exact concatenated text-block content. */
  readonly text: string
}
```

```ts type-equiv
/** Automatic generation cadence owned by a registered provider. */
type SessionTitleAutomaticMode = 'first-prompt' | 'all-prompts'
```

```ts type-equiv
/** Immutable input supplied to one title-provider call. */
interface SessionTitleProviderRequest {
  /** Live session being titled. */
  readonly session: Session
  /** All eligible human messages through this generation revision. */
  readonly messages: readonly SessionTitleUserMessage[]
  /** Exact current logged main-request route, when one has been recorded. */
  readonly route?: SessionTitleModelIdentity
  /** Cancellation for supersession, disposal, timeout composition, or the explicit caller. */
  readonly signal: AbortSignal
}
```

```ts type-equiv
/** Provider output before service-owned normalization and log acceptance. */
interface SessionTitleProviderResult {
  /** Proposed title text. */
  readonly title: string
  /** Exact seqs from `request.messages` used by this result. */
  readonly messageSeqs: readonly SessionSeq[]
  /** Auxiliary LLM route, when generation used a model. */
  readonly model?: SessionTitleModelIdentity
}
```

```ts type-equiv
/** One optional asynchronous title implementation registered with the service. */
interface SessionTitleProvider {
  /** Stable id of the provider recorded with the title. */
  readonly id: SessionTitleProviderId
  /** When new human prompts start automatic generation. */
  readonly automatic: SessionTitleAutomaticMode
  /**
   * Produce one title revision.
   * @param request - message snapshot, current route, session, and cancellation.
   * @returns proposed title plus exact input seqs and the optional provider/model route used to generate it.
   */
  generate(request: SessionTitleProviderRequest): Promise<SessionTitleProviderResult>
}
```

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsessiontitle--sessiontitleservice"></a>

### `ctx.sessionTitle` — `SessionTitleService`

Log-backed title fold plus asynchronous fallback generation.

```ts cordis-catalog
/**
 * Read the latest folded title from one live or replayed session.
 * @param session - session whose log is the title source of truth.
 * @returns latest title snapshot, or `undefined` before eligible input.
 */
get(session: Session): SessionTitleSnapshot | undefined

/**
 * Accept an explicit user title. Appends a `session/title` event with the
 * `user` source, which pins the title: in-flight automatic generation is
 * superseded and later user messages schedule none (an explicit
 * {@link SessionTitleService.refresh} remains the deliberate unpin).
 * @param session - exact live session to rename.
 * @param title - raw user input; normalized before acceptance.
 * @returns the accepted title snapshot.
 * @throws {SessionTitleInvalidError} when the title normalizes to empty.
 * @throws {Error} when the session is not live or the service is disposed.
 */
rename(session: Session, title: string): SessionTitleSnapshot

/**
 * Explicitly retry the registered provider, or materialize the built-in
 * fallback when no provider is registered.
 * @param session - exact live session to refresh.
 * @param signal - optional caller cancellation.
 * @returns latest accepted title, or `undefined` when no eligible text exists.
 */
async refresh(session: Session, signal?: AbortSignal): Promise<SessionTitleSnapshot | undefined>

/**
 * Register the sole optional title provider. Disposal aborts its pending and
 * active work before another provider may register.
 * @param provider - provider identity, cadence, and generation function.
 * @returns exact Cordis effect disposer, which settles after active calls quiesce.
 */
register(provider: SessionTitleProvider): () => Promise<void>
```

Types: [Session](session.ar.md)

Source: [`packages/session/session-title/src/index.ts`](../../packages/session/session-title/src/index.ts)
<!-- END GENERATED cordis-surface -->

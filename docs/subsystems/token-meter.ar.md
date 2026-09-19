# Token حساب كمية

[English](token-meter.md) | العربية

`@deepseek-ai/dsh-token-meter` عام واحد مستقل إعادة تشغيل لقطة، لأجل يمثل طلب ضغط قوة و حسب موضع حساب حساب جدول طبقة تحديد قيمة.`logRevision` يمثل توليد هذا حساب كمية في كل حقل وقت الذي إزالة استهلاك حمل دائم حدث عدد كمية.

مصدر:[`packages/llm/token-meter/src/types.ts`](../../packages/llm/token-meter/src/types.ts)

## `TokenMeasurement`

```ts type-equiv
/** Detached immutable request-pressure and surface snapshot at one consumed log revision. */
interface TokenMeasurement {
  /** Number of durable events consumed; equal to the next unread event seq. */
  readonly logRevision: SessionLogOffset
  /** Provider or heuristic anchor used for this measurement. */
  readonly baseline: TokenMeasurementBaseline
  /** Signed repricing of current surface content relative to the baseline anchor. */
  readonly surfaceDeltaTokens: number
  /** Non-negative current request-and-response pressure. */
  readonly totalTokens: number
  /** Total route-priced request tokens across the current surface; equals the sum of the node prices. */
  readonly surfaceTokens: number
  /** Current surface nodes in positional head-to-tail order. */
  readonly nodes: readonly TokenSurfaceNode[]
}
```

كل مرة حساب كمية كل سوف عبر `ctx.llm` يأخذ توليد فاعلية معلومة غلاف توجيه provider/model تحليل لـ هذا توجيه إعلان طلب صورة تحديد قيمة، لذلك صورة ظهور موضع حسب طلب فعلي إرسال نظر شعور token إضافة نموذج مرئي نص حساب قيمة؛ لم إعلان تحديد قيمة توجيه و تركيب إبقاء ثابت بدء إرسال صيغة قاعدة.`baseline.kind === 'usage'` يمثل الأكثر قريب مرة نجاح مزود استدعاء أداة لديه نفسه مواصفة طلب envelope، كما هذا استدعاء مجموع كمية لا منخفض في ذلك كامل توجيه تحديد قيمة مرساة نقطة.`estimated` يمثل لا وجود يمكن إعادة استخدام حفظ حراسة usage مرساة نقطة، لذلك خدمة ذاتي سطر مقابل كامل معلومة غلاف و جدول طبقة تحديد قيمة. لاحق نجاح طلب سوف استبدال مبكر أولا مرساة نقطة؛ لديه رمز رقم `surfaceDeltaTokens` سوف إبقاء متبادل مقابل في مطابقة مرساة نقطة زيادة طويل و تقليص نقص، كما اثنان جانب حسب نفس توجيه إعادة تحديد قيمة.`totalTokens` ما زال يمثل طلب و استجابة ضغط قوة،`surfaceTokens` فإن هو جدول طبقة توجيه تحديد قيمة مجموع كمية، انتظار في كل عقدة قيمة إطار لـ و.

## `TokenSurfaceNode`

```ts type-equiv
/** One token-priced node in the current ordered session surface. */
interface TokenSurfaceNode {
  /** Durable sequence number of the surface event. */
  readonly seq: SessionSeq
  /**
   * Request-pressure tokens for the exact message projected by this node under
   * the measured route: image occurrences carry the route's declared visual
   * price when the routed adapter declares one, and the fixed heuristic
   * otherwise. Trigger, retention, and range selection all read this price.
   */
  readonly tokens: number
  /**
   * Fixed-heuristic tokens for the same message, independent of any route.
   * The shadow-price protocol prices replacements with this value so the O(1)
   * projection fold stays in agreement with its own appends.
   */
  readonly heuristicTokens: number
}
```

جدول طبقة ترتيب أداة لديه مرجعي صفة؛ استبدال عقدة حمل دائم seq ممكن عال في موضع ترتيب في ذلك بعد عقدة. هذا لقطة غير ممكن تغيير، لن مع قاع طبقة إعادة تشغيل طي دفع دخول بينما زيادة طويل.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxtokenmeter--tokenmeter"></a>

### `ctx.tokenMeter` — `TokenMeter`

Replay owner for one service-wide estimator and isolated per-session folds.

```ts cordis-catalog
/**
 * Measure current request pressure and surface through the durable tail.
 *
 * The effective envelope's routed provider/model selects the request-image
 * pricing every node is priced under: a route whose adapter declares image
 * pricing charges each retained image its visual tokens plus its
 * model-visible text, while other routes keep the fixed heuristic. Provider
 * usage is reused only when the latest successful call's canonical request
 * envelope matches `requestHeader` and its total is no lower than that
 * call's full route-priced anchor; otherwise the complete envelope and
 * surface are repriced. The anchor includes all surface nodes immediately
 * before the assistant message, including inputs admitted after step/start.
 *
 * `requestHeader` replaces the latest logged envelope for pressure and node
 * pricing; the node set always describes the current session surface. Every
 * call clones those positional nodes, so measurement is O(surface).
 *
 * @param session - session to replay through its current durable tail.
 * @param requestHeader - optional effective request envelope replacing the latest logged header.
 * @returns a detached deeply immutable pressure and surface measurement.
 */
measure(session: Session, requestHeader?: EpochHeader): TokenMeasurement

/**
 * Heuristically price one model-visible message (instance face of the pure
 * `estimateMessage` export from `estimate.ts`).
 * @param message - message to price without mutation.
 * @returns content and role-framing tokens under the fixed service heuristic.
 */
estimateMessage(message: Message): number
```

Types: [EpochHeader](session.ar.md) · [Message](llm-streaming.ar.md) · [Session](session.ar.md)

Source: [`packages/llm/token-meter/src/index.ts`](../../packages/llm/token-meter/src/index.ts)
<!-- END GENERATED cordis-surface -->

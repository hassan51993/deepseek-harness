# LSP تنقل

[English](lsp.md) | العربية

LSP seam هو واحد[قدرة seam](../glossary.zh.md#capability-seam): هو في مفرد واحد `ctx.lsp` خدمة فوق عام دلالة شفرة تنقل، و تفكيك قسم إلى كثير عدد حزمة:Service Definition([dsh-lsp](../../packages/lsp/lsp) ،`ctx.lsp` + مزود سجل التسجيل) ، عام Service Provider([dsh-lsp-stdio](../../packages/lsp/lsp-stdio) ، مرور مرور إعداد stdio لغة خادم مضيف) و Consumer([dsh-tool-lsp](../../packages/lsp/tool-lsp) ، أي `lsp` أداة schema).LSP هو**واحد بند اختياري قدرة**، لا يخص agent loop(ذكي جسم حلقة) رئيسي جاف، لذلك ذلك مفردات تعريف في هذا بينما غير [core.md](core.zh.md) في. أكثر تبديل مزود لن تغيير نموذج طلب تنقل طريقة.

مصدر ملف:[`packages/lsp/lsp/src/types.ts`](../../packages/lsp/lsp/src/types.ts)

## عملية و جلوس علامة

seam و نموذج تماما جيد عام 4 بند دلالة استعلام؛ هذا ربط دمج هو إغلاق دمج، لذلك إضافة جديدة واحد بند استعلام سوف عبر تحرير ترجمة قوي صنع اشتراط تزامن تعديل seam، مزود و أداة. موضع و نطاق اعتماد من صفر بدء UTF-16 جلوس علامة، و بروتوكول متسق؛ موجه إلى نموذج أداة اعتماد من 1 بدء ضوء علامة اتفاق، و في إدخال و إخراج وقت إجراء تحويل.

```ts type-equiv
/**
 * The four semantic queries the seam and model expose. A closed union: adding an operation is a
 * compile-enforced change across the seam, providers, and the tool. Symbols and call hierarchy are
 * not operations here; they need different schemas.
 */
type LspOperation = 'goToDefinition' | 'findReferences' | 'goToImplementation' | 'hover'
```

```ts type-equiv
/** A zero-based UTF-16 cursor coordinate, matching the LSP wire convention. */
interface LspPosition {
  /** Zero-based line. */
  readonly line: number
  /** Zero-based UTF-16 code-unit offset within the line. */
  readonly character: number
}
```

```ts type-equiv
/** A zero-based UTF-16 half-open range `[start, end)`. */
interface LspRange {
  readonly start: LspPosition
  readonly end: LspPosition
}
```

## طلب

كل حقل كل هو لا بد ملء بند:`workspaceRoot` من استدعاء جهة توفير،`languageId` قدوم ذاتي مزود تسجيل بينما غير طلب، مهلة و نتيجة حد أعلى من مستهلك قرار. لذلك لا يوجد حقل حاجة من تنفيذ توفير قيمة افتراضية، أيضا لا وجود `resolve()` خطوة. مزود استلام إلى استدعاء جهة طلب و إرسال توليد `languageId`؛ بعد من فقط لأجل تزامن لحظة حالة وثيقة، من لا مشاركة و اختيار.

```ts type-equiv
/**
 * A caller's normalized query. Every field is required: `workspaceRoot` is caller-supplied,
 * `languageId` comes from the provider registration (not here), and consumers own timeouts and
 * result limits — so no field needs implementation defaulting and there is no `resolve()` step.
 */
interface LspQueryRequest {
  /** Which semantic query to run. */
  readonly operation: LspOperation
  /** The source file to query (relative to `workspaceRoot` or absolute; the provider canonicalizes). */
  readonly filePath: string
  /** The zero-based UTF-16 cursor position to query at. */
  readonly position: LspPosition
  /** The workspace root the provider resolves against and indexes; required, never defaulted. */
  readonly workspaceRoot: string
}
```

```ts type-equiv
/**
 * A request as a provider receives it: the caller's {@link LspQueryRequest} plus the `languageId`
 * the seam derived from the provider's extension mapping. The language id only synchronizes the
 * transient document; it does not participate in selection.
 */
interface LspProviderQuery extends LspQueryRequest {
  /** The LSP language id for `filePath`, from this provider's extension mapping. */
  readonly languageId: string
}
```

## نتيجة

هذا هو واحد إغلاق دمج يمكن تمييز تعرف ربط دمج: تنقل عملية مواصفة تحويل لـ `locations`،`hover` مواصفة تحويل لـ محتوى أو `null`. مستهلك استخدام `switch` مقابل `kind` فعل نفاد كل معالجة، لذلك إضافة جديدة فرع سوف جعل تحرير ترجمة فشل، مباشر إلى إتمام معالجة.`findReferences` بداية نهاية يتضمن إعلان؛ مزود في داخلي قوي صنع حفظ إثبات هذا واحد نقطة، لذلك استدعاء جهة لا يوجد مقابل flag.`locations` تغيير جسم يحمل `resolvedWorkspaceUri`، أي مزود مواصفة مساحة العمل `file:` URI. استدعاء جهة متبادل مقابل تحويل موضع URI وقت ينبغي استخدام هذا واحد جلوس علامة، بينما لا هو مقابل ممكن مرور مرور رمز رقم رابط طلب أصل دليل تطبيق مضيف منصة مسار قاعدة.

```ts type-equiv
/** One resolved location: a document URI and the range within it. */
interface LspLocation {
  /** The target document URI (`file:` or otherwise), verbatim from the server. */
  readonly uri: string
  /** The range within the target document. */
  readonly range: LspRange
}
```

```ts type-equiv
/** Normalized hover content, or `null` for no hover at the position. */
interface LspHover {
  /** The normalized hover text (markdown or plaintext, provider-joined). */
  readonly contents: string
  /** The range the hover applies to, when the server supplied one. */
  readonly range?: LspRange
}
```

```ts type-equiv
/**
 * The closed result union. Navigation operations (`goToDefinition`, `findReferences`,
 * `goToImplementation`) normalize to `locations`; `hover` normalizes to content or `null`.
 * Consumers `switch` on `kind` to exhaustiveness so a new arm breaks compilation until handled.
 *
 * The `locations` variant carries `resolvedWorkspaceUri`: the provider's canonical `file:` URI for
 * the request's workspace root. A caller that relativizes location URIs MUST use this, not parse the
 * request's possibly symlinked process path with host-platform rules; the execution platform may
 * differ from the caller's.
 */
type LspQueryResult =
  | { readonly kind: 'locations'; readonly locations: readonly LspLocation[]; readonly resolvedWorkspaceUri: string }
  | { readonly kind: 'hover'; readonly hover: LspHover | null }
```

## مزود و خدمة

كل مزود يملك واحد مستقر صنف لوحة تحويل `id`، و واحد نسخة متبادل رفض، صغير كتابة كما بـ نقطة فتح رأس توسيع اسم خريطة.`registerProvider` سوف أصل فرعي مسبق إبقاء id و كل توسيع اسم: تسجيل بلا فاعلية أو اندفاع مفاجئ وقت لا إصدار أي محتوى؛ ذلك disposer سوف تحرير كل إبقاء بند. كل مرة استعلام مستقل اختيار مزود، كما اختيار و ترتيب غير متصل؛ لا يوجد مطابقة بند وقت رمي خروج `LspError` `LSP_UNAVAILABLE`. هذا seam لا عام بروتوكول نوع، عملية أو وثيقة تحكم، أيضا لا توفير عام JSON-RPC هروب توليد فتحة.

```ts type-equiv
/**
 * A language-server backend registered on `ctx.lsp`. Each provider owns a stable {@link
 * LspProviderId} and an extension-to-language-id map (lowercase, leading-dot keys).
 * `findReferences` always includes declarations — the provider enforces this internally; callers
 * get no flag.
 */
interface LspProvider {
  /** Stable provider identity, reserved atomically with the extension mappings. */
  readonly id: LspProviderId
  /** Lowercase leading-dot extension → LSP language id (e.g. `{ '.ts': 'typescript' }`). */
  readonly extensionToLanguage: Readonly<Record<string, string>>
  /**
   * Run one query. The seam has already selected this provider and derived `languageId`.
   * @param request - the resolved provider query (caller request + derived language id).
   * @param signal - optional cancellation; the provider stops its own work when it aborts.
   * @returns the normalized, closed-union result.
   */
  query(request: LspProviderQuery, signal?: AbortSignal): Promise<LspQueryResult>
}
```

```ts type-equiv
/**
 * The LSP capability seam (`ctx.lsp`). Owns provider registration/selection and normalized query
 * execution; exposes exactly the four operations and no protocol escape hatch.
 */
interface LspService {
  /**
   * Register a provider, atomically reserving its id and every normalized extension. Any conflict
   * or invalid input publishes nothing and throws `LspError`; the returned disposer releases all
   * reservations. Disposed with the calling fiber.
   * @param provider - the backend to register.
   * @returns a synchronous disposer releasing the id and all extension reservations.
   */
  registerProvider(provider: LspProvider): () => void
  /**
   * Select a provider by the file's extension and run one query. Selection is per-query and
   * order-independent; no match throws `LspError` `LSP_UNAVAILABLE`.
   * @param request - the normalized query.
   * @param signal - optional cancellation forwarded to the selected provider.
   * @returns the normalized, closed-union result.
   */
  query(request: LspQueryRequest, signal?: AbortSignal): Promise<LspQueryResult>
}
```

`LspProviderId` هو هذا seam صنف لوحة تحويل id(قدوم ذاتي [dsh-brand](../../packages/util/brand) `Branded<'LspProviderId'>`) ؛`LspError` توسيع `HarnessError`، توفير `LSP_INVALID_PROVIDER`،`LSP_CONFLICT`،`LSP_UNAVAILABLE`،`LSP_DISPOSED`،`LSP_UNSUPPORTED_OPERATION` و `LSP_MALFORMED_RESPONSE` انتظار مستقر رمز خطأ، استدعاء جهة ينبغي حسب رمز خطأ توجيه، بينما لا هو تحليل `message`.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxlsp--lspservice"></a>

### `ctx.lsp` — `LspService`

The LSP capability seam (`ctx.lsp`). Owns provider registration/selection and normalized query execution; exposes exactly the four operations and no protocol escape hatch.

```ts cordis-catalog
/**
 * Register a provider, atomically reserving its id and every normalized extension. Any conflict
 * or invalid input publishes nothing and throws `LspError`; the returned disposer releases all
 * reservations. Disposed with the calling fiber.
 * @param provider - the backend to register.
 * @returns a synchronous disposer releasing the id and all extension reservations.
 */
registerProvider(provider: LspProvider): () => void

/**
 * Select a provider by the file's extension and run one query. Selection is per-query and
 * order-independent; no match throws `LspError` `LSP_UNAVAILABLE`.
 * @param request - the normalized query.
 * @param signal - optional cancellation forwarded to the selected provider.
 * @returns the normalized, closed-union result.
 */
query(request: LspQueryRequest, signal?: AbortSignal): Promise<LspQueryResult>
```

Source: [`packages/lsp/lsp/src/types.ts`](../../packages/lsp/lsp/src/types.ts)
<!-- END GENERATED cordis-surface -->

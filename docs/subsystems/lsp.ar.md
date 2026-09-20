# التنقل بـLSP

[English](lsp.md) | العربية

seam خدمة LSP — وهو [seam قدرة](../glossary.ar.md#capability-seam) يكشف التنقلَ الدلالي في الشفرة على خدمة `ctx.lsp` واحدة، موزَّعًا على حزم: تعريفُ الخدمة ([dsh-lsp](../../packages/lsp/lsp)، `ctx.lsp` مع سجل المزوّدين)، ومزوّدُ خدمة عام ([dsh-lsp-stdio](../../packages/lsp/lsp-stdio)، مضيفُ خوادم لغة مضبوط على stdio)، ومستهلك ([dsh-tool-lsp](../../packages/lsp/tool-lsp)، schema أداة `lsp`). وLSP **قدرةٌ اختيارية واحدة**، لا جزءٌ من عمود agent loop — ولذلك تعيش مفرداتُه هنا لا في [core.md](core.ar.md). وتبديلُ المزوّد لا يغيّر كيف يطلب النموذجُ التنقل.

المصدر: [`packages/lsp/lsp/src/types.ts`](../../packages/lsp/lsp/src/types.ts)

## العمليات والإحداثيات

يكشف الـseam والنموذجُ أربعةَ استعلامات دلالية بالضبط؛ والاتحادُ مغلق، فإضافةُ واحد تغييرٌ يفرضه المترجِم عبر الـseam والمزوّدين والأداة. والمواضعُ والمدياتُ بترميز UTF-16 وتبدأ من الصفر، مطابقةً للبروتوكول؛ وتملك الأداةُ التي يراها النموذجُ عرفَ المؤشر الذي يبدأ من واحد وتحوّل دخولًا وخروجًا.

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

## الطلب

كلُّ حقل مطلوب: فـ`workspaceRoot` يقدّمه المستدعي، و`languageId` يأتي من تسجيل المزوّد لا من الطلب، ويملك المستهلكون المهلَ وحدودَ النتائج — فلا حقلَ يحتاج إلى افتراض من التنفيذ ولا خطوةَ `resolve()`. ويتلقى المزوّدُ طلبَ المستدعي مع `languageId` المشتق، وهو لا يزامن إلا المستندَ العابر ولا يشارك في الانتقاء قط.

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

## النتيجة

اتحادٌ مميَّز مغلق: تُوحَّد عملياتُ التنقل إلى `locations`، ويُوحَّد `hover` إلى محتوى أو `null`. ويشتق المستهلكون على `kind` بـ`switch` شاملًا، فيكسر فرعٌ جديد الترجمةَ حتى يُعالَج. ويشمل `findReferences` التصريحاتِ دائمًا — يفرض المزوّدُ ذلك داخليًا، فلا يحصل المستدعون على راية. ويحمل شكلُ `locations` قيمةَ `resolvedWorkspaceUri`، وهي رابطُ `file:` المعياري لمساحة عمل المزوّد. والمستدعي الذي ينسّب روابطَ المواضع يستعمل ذلك الإحداثيَّ بدل تطبيق قواعد مسارات منصة المضيف على جذر الطلب الذي قد يكون رابطًا رمزيًّا.

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

## المزوّد والخدمة

يملك المزوّدُ معرّفًا `id` ثابتًا موسومًا وخريطةَ امتدادات حصرية بحروف صغيرة تبدأ بنقطة. ويحجز `registerProvider` المعرّفَ وكلَّ امتداد في عملية واحدة — فالتسجيلُ غيرُ الصالح أو المتعارض لا ينشر شيئًا — ويحرّر مُفكِّكُه الحجوزاتِ كلَّها. والانتقاءُ لكل استعلام ولا يتعلق بالترتيب؛ وعدمُ المطابقة يرمي `LspError` برمز `LSP_UNAVAILABLE`. ولا يكشف الـseam أنواعَ البروتوكول ولا ضوابطَ العمليات والمستندات ولا مَهربَ JSON-RPC عامًّا.

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

و`LspProviderId` هو معرّفُ الـseam الموسوم (`Branded<'LspProviderId'>` من [dsh-brand](../../packages/util/brand))؛ ويوسّع `LspError` الصنفَ `HarnessError` برموز ثابتة مثل `LSP_INVALID_PROVIDER` و`LSP_CONFLICT` و`LSP_UNAVAILABLE` و`LSP_DISPOSED` و`LSP_UNSUPPORTED_OPERATION` و`LSP_MALFORMED_RESPONSE`، يوجّه المستدعون عليها بدل تحليل `message`.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

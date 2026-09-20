# الوصول إلى الوِب

[English](web.md) | العربية

seam الوصول إلى الوِب — وهو [seam قدرة](../../.agents/notes/implemented/architecture/2026-06-24-web-capability-seam.ar.md) يمتد على **عمليتين** (البحث والجلب) على خدمة `ctx.web` واحدة، موزَّعًا على حزم: تعريفُ الخدمة ([dsh-web](../../packages/web/web)، `ctx.web` مع سجلات المزوّدين)، ومزوّدو الخدمة ([dsh-web-search-exa](../../packages/web/web-search-exa)، و[dsh-web-search-perplexity](../../packages/web/web-search-perplexity)، و[dsh-web-search-deepseek](../../packages/web/web-search-deepseek)، و[dsh-web-fetch-http](../../packages/web/web-fetch-http))، والمستهلك ([dsh-tool-web](../../packages/web/tool-web)، وschemas أداتَي `web_search` و`web_fetch`). والوِب **قدرةٌ اختيارية واحدة**، لا جزءٌ من عمود agent loop — ولذلك تعيش مفرداتُه هنا لا في [core.md](core.ar.md). وتبديلُ مزوّد البحث لا يغيّر كيف يطلب النموذجُ استعلامًا، وتبديلُ مزوّد الجلب لا يغيّر كيف يطلب النموذجُ رابطًا.

المصدر: [`packages/web/web/src/types.ts`](../../packages/web/web/src/types.ts)

## لماذا لقدرة واحدة عمليتان

لا يتشارك البحثُ والجلبُ schema طلب ولا منطقَ عمل، لكنهما عمدًا طبقةٌ وسطى واحدة هي `ctx.web`: مالكٌ واحد لسياسة انتقاء المزوّدين، ومفرداتُ إجهاض وأخطاء واحدة، وواجهةُ ضبط واحدة تجاه المنتَج تجيب «كيف يصل هذا الحزامُ إلى الوِب». والثمنُ هو زوجا الطرائق المتوازية `searchX` و`fetchX` على الخدمة؛ وذلك التوازي مقصود لا استخراجٌ فائت. ويسجّل المزوّدون **قدرات** (`WebSearchProvider` أو `WebFetchProvider`) لا أدوات؛ أما الأسماءُ وschemas وإرشادُ المطالبة والعرضُ التي يراها النموذج فتعيش كلُّها في المستهلك الوحيد `dsh-tool-web`.

## طلب البحث ونتيجته

يحمل كلُّ طلب إلى الـseam استعلامًا `query` واحدًا بالضبط. ويقبل المستهلكُ `dsh-tool-web` مصفوفةَ `queries` مشترَطة وينشرها إلى طلبات seam منفصلة؛ والمصفوفةُ ذاتُ البند الواحد تنفّذ بحثًا واحدًا. و`maxResults` حدٌّ يملكه المستهلك (ضبطُ `searchMaxResults` في `dsh-tool-web`، وافتراضُه `8`) يمرّ عبر الـseam ويُفرض في طريق العودة — فإن أعاد مزوّدٌ أكثرَ من اللازم، اقتطع الـseam مصفوفةَ `sources[]` وضبط `truncated`.

```ts type-equiv
/**
 * What one search-capable backend is asked to search. Each request carries one
 * query; a consumer may issue several requests. `maxResults` is a
 * `dsh-tool-web`-layer bound passed through unchanged and enforced on the way
 * back by the seam (see {@link WebSearchResult}).
 */
interface WebSearchRequest {
  readonly query: string
  /**
   * Upper bound on returned sources; the seam truncates to it. Omitted = no
   * bound. `dsh-tool-web` always sets it. A provider whose API supports a
   * result-count control (Exa's `numResults`) should apply it at the request
   * layer as a cost/latency optimization; the seam enforces the bound
   * regardless.
   */
  readonly maxResults?: number
}
```

```ts type-equiv
/**
 * Normalized search outcome. `content` is optional provider-generated answer
 * text or summary (Exa and DeepSeek return none; Perplexity returns a
 * generated answer).
 * `sources[]` is the portable citation shape. `truncated` is set by the seam
 * when it cut `sources[]` down to `maxResults`.
 */
interface WebSearchResult {
  /** Optional provider-generated answer text, search context, or summary. */
  readonly content?: string
  /** Citeable sources, already truncated to the request's `maxResults`. */
  readonly sources: readonly WebSearchSource[]
  /** True when the seam dropped sources to honor `maxResults`. */
  readonly truncated: boolean
}
```

```ts type-equiv
/**
 * One citeable source. A source always has a URL; `title`, `snippet`, and
 * `publishedAt` are optional because not every provider returns them — forcing
 * adapters to invent them would make the seam lie (Perplexity citations may be
 * URL-only). `dsh-tool-web` renders `title ?? hostname(url)` for display.
 */
interface WebSearchSource {
  readonly url: string
  readonly title?: string
  readonly snippet?: string
  /** Publication/crawl timestamp as a provider-supplied ISO-8601 string. */
  readonly publishedAt?: string
}
```

## طلب الجلب ونتيجته

```ts type-equiv
/**
 * What one fetch-capable backend is asked to retrieve. The request deliberately
 * omits timeout, format, prompt, and extraction controls: cancellation is a
 * direct execution argument, while presentation and higher-level LLM concerns
 * belong outside safe retrieval.
 */
interface WebFetchRequest {
  readonly url: string
}
```

وحالةُ HTTP جزءٌ من حالة المورد المجلوب، لا فشلٌ تلقائيًا: فالجلبُ الشبكي الناجح لاستجابة `404` أو `500` يعيد `WebFetchResult` برمز الحالة وبجسم مفكوك الترميز محدود. و`url` هو الرابطُ النهائي بعد عمليات التحويل المسموح بها. و`WebError` محجوزٌ لإخفاقات جلب المورد أو تمثيله بأمان.

```ts type-equiv
/**
 * Normalized fetch outcome. A successful network fetch of a non-2xx response is
 * a result, not an error: the status code is part of the fetched resource
 * state. {@link WebError} is reserved for failures to safely retrieve or
 * represent the resource.
 */
interface WebFetchResult {
  /** The final URL after allowed redirects (the request URL is in the request). */
  readonly url: string
  /** HTTP status code of the fetched response. */
  readonly statusCode: number
  /** Decoded body, classified by content kind. */
  readonly body: WebFetchBody
  /** True when the provider capped the decoded body. */
  readonly truncated: boolean
}
```

```ts type-equiv
/**
 * The decoded body of a fetched resource. A CLOSED discriminated union owned by
 * `dsh-web`: the provider decodes the kind and `dsh-tool-web` renders it, so a
 * new kind is a coordinated change across known packages, not a plugin
 * extension. Consumers `switch` on `kind` ending in `default: assertNever(...)`
 * so adding a kind breaks compilation at every consumer until handled. Each arm
 * stays its own object literal even where fields coincide, so an arm can gain
 * fields the others lack.
 */
type WebFetchBody =
  | { readonly kind: 'html'; readonly content: string }
  | { readonly kind: 'text'; readonly content: string }
```

## إتاحة المزوّد

دالةُ `available(): boolean` في المزوّد فحصٌ محلي رخيص (وجودُ اعتماد، وضبطٌ قابل للتحليل) و**يجب ألّا تُجري نداءاتِ شبكة**. وهي مُدخَلٌ لانتقاء وقت التنفيذ لا نظامُ صحة: فـ`search()` و`fetch()` يقرآنها لاختيار مزوّد صالح، ويظهر فشلُ الانتقاء خطأَ `WebError` مبنيَنًا يوجّه عليه المستدعي — وهو يحمل التفصيلَ القابل للتفريع (المعرّفَ المفقود أو مجموعةَ المرشحين الملتبسة) في رمزه ورسالته.

ولا يتعلق الانتقاءُ قط بترتيب التسجيل ولا الضبط ولا HMR: فللقدرة معرّفُ مزوّد صريح (ضبطُ `searchProvider` أو `fetchProvider`، أو متغيّرُ البيئة المقابل الذي يغذي الحقلَ نفسَه)، وإلا انتُقي تلقائيًا حين يكون المسجَّل الصالح واحدًا بالضبط؛ ووجودُ عدة مزوّدين صالحين بلا معرّف مضبوط هو `WEB_PROVIDER_AMBIGUOUS`، لا «الأولُ يفوز».

## سياسة شبكة الجلب

تكشف presets المشحونة Cordis وCode وStandard أداةَ `web_fetch` في كل أوضاع العزل والموافقة بلا تأكيد لكل نداء. وpresets عزل الملفات لا تحكم الوصولَ إلى شبكة الوِب. وعلى النشر الذي يحتاج إلى تأكيد أن يضيف سياسةَ `tools/pre-execute` أو أن يعطّل الجلب.

ويحلّ مزوّدُ HTTP كلَّ طلب فعلي، ويرفض الأجوبةَ غيرَ العامة ومنها عناوينُ IPv4 الخاصة المبلوغة عبر بادئة DNS64 النشطة، ويثبّت مجموعةَ العناوين المتحقَّق منها، ويكرّر الفرضَ عند كل تحويل داخل الأصل نفسِه. والتحويلُ عبر أصل مختلف يشترط نداءَ أداة جديدًا وتحققًا جديدًا من عمومية العنوان. وتمنع هذه الفحوصُ وصولَ SSRF إلى وجهات غير عامة لكنها لا تمنع نموذجًا من إرسال بيانات إلى رابط عام.

## الأخطاء

`WebError extends HarnessError` (انظر تصنيفَ الأخطاء في [core.md](core.ar.md)) مع `code: string` مفتوح، كما في أخطاء كل seam آخر — `LlmError` و`SubagentError` — لا اتحادًا مغلقًا: فللمزوّد أن يرفع رموزَه دون تعديل `dsh-web`، وعلى المستهلكين احتمالُ رمز مجهول. وتنقسم الرموزُ بحسب مالكها. فالرموزُ المحايدة للـseam يرفعها عقدُ `WebRuntime` المشترك: `WEB_PROVIDER_UNAVAILABLE` و`WEB_PROVIDER_CONFIGURED_MISSING` و`WEB_PROVIDER_CONFIGURED_UNAVAILABLE` و`WEB_PROVIDER_AMBIGUOUS` و`WEB_DUPLICATE_PROVIDER` (خطأٌ برمجي عند التسجيل، نظيرُ `DUPLICATE_ADAPTER` في `LlmRuntime`) و`WEB_ABORTED` و`WEB_PROVIDER_ERROR` (وهو الجامعُ لفشل المزوّد نفسِه ظاهرًا عبر الـseam، ومنه فشلُ الشبكة والنقل — DNS، ورفضُ الاتصال، وTLS). أما رموزُ نقل الجلب فيملكها تنفيذُ `dsh-web-fetch-http` وقد لا ترفعها خلفيةُ جلب أخرى: `WEB_INVALID_URL` و`WEB_BLOCKED_URL` و`WEB_REDIRECT_BLOCKED` و`WEB_FETCH_TOO_LARGE` و`WEB_FETCH_TIMEOUT` و`WEB_UNSUPPORTED_CONTENT_TYPE`.

## الخدمة

يسجّل `WebRuntime` مزوّدي البحث والجلب، ويرفض المعرّفاتِ المكررة بـ`WEB_DUPLICATE_PROVIDER`، ويحلّ المزوّدين عند وقت التنفيذ بأخطاء انتقاء مبنيَنة. وتقبل خلفيةُ الجلب المحلية HTTP وHTTPS وحدهما، وترفض الاعتمادات، وتحلّ كلَّ اسم مضيف مرةً واحدة، وترفض أيَّ مجموعة أجوبة تحتوي وجهةَ IPv4 أو IPv6 غير عامة أو ترجمةَ NAT64 ببادئة نشطة إلى IPv4 غير عام، وتثبّت وصلةَ الطلب على العناوين المتحقَّق منها، وتكرّر تلك الفحوصَ عند كل قفزة تحويل داخل الأصل نفسِه، وتحدّ التحويلاتِ والبايتاتِ والمحارفَ والوقت، وتفكّ ترميزَ الجسم؛ وتملك الأداةُ العرضَ.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxweb--webruntime"></a>

### `ctx.web` — `WebRuntime`

The web access service. Registered as `ctx.web` (one instance per context).

Selection semantics (resolved at execution time, never order-dependent):

- A configured id that is registered and `available()` → that provider.
- A configured id not registered → `WEB_PROVIDER_CONFIGURED_MISSING`.
- A configured id registered but unavailable → `WEB_PROVIDER_CONFIGURED_UNAVAILABLE`.
- No id configured, exactly one registered usable provider → that provider.
- No id configured, multiple usable providers → `WEB_PROVIDER_AMBIGUOUS`.
- No id configured, no usable provider → `WEB_PROVIDER_UNAVAILABLE`.

```ts cordis-catalog
/**
 * Register a search provider. Throws {@link WebError} `WEB_DUPLICATE_PROVIDER`
 * if its id is already registered for search. Returns a disposer; disposed
 * with the calling fiber.
 * @param provider - the provider; its `id` is the registry key.
 * @returns the disposer that unregisters the provider.
 */
registerSearchProvider(provider: WebSearchProvider): () => void

/**
 * Register a fetch provider. Throws {@link WebError} `WEB_DUPLICATE_PROVIDER`
 * if its id is already registered for fetch. Returns a disposer; disposed
 * with the calling fiber.
 * @param provider - the provider; its `id` is the registry key.
 * @returns the disposer that unregisters the provider.
 */
registerFetchProvider(provider: WebFetchProvider): () => void

/**
 * Run one search through the selected provider. Resolves the provider at call
 * time with the selection rules above; throws {@link WebError} when the
 * capability cannot run. The seam enforces `request.maxResults` on the result:
 * if the provider over-returns, `sources[]` is truncated and `truncated` set.
 * @param request - the query and optional result limit.
 * @param signal - optional cancellation signal forwarded to the provider.
 * @returns the provider's results, capped to `request.maxResults`.
 */
async search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>

/**
 * Retrieve one URL through the selected provider. Resolves the provider at
 * call time with the selection rules above; throws {@link WebError} when the
 * capability cannot run. A non-2xx response is a result, not a throw.
 * @param request - the URL plus retrieval options.
 * @param signal - optional cancellation signal forwarded to the provider.
 * @returns the retrieval outcome; non-2xx responses resolve descriptively.
 */
async fetch(request: WebFetchRequest, signal?: AbortSignal): Promise<WebFetchResult>
```

Source: [`packages/web/web/src/index.ts`](../../packages/web/web/src/index.ts)
<!-- END GENERATED cordis-surface -->

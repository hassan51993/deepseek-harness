# Web وصول

[English](web.md) | العربية

Web وصول seam هو واحد[قدرة seam](../../.agents/notes/implemented/architecture/2026-06-24-web-capability-seam.zh.md) ، في نفس عدد `ctx.web` خدمة فوق أفقي عبر**اثنان بند عملية**(search و fetch) ، و تفكيك قسم إلى كثير عدد حزمة:Service Definition([dsh-web](../../packages/web/web) ،`ctx.web` + مزود سجل التسجيل) ،Service Provider([dsh-web-search-exa](../../packages/web/web-search-exa) ،[dsh-web-search-perplexity](../../packages/web/web-search-perplexity) ،[dsh-web-search-deepseek](../../packages/web/web-search-deepseek) ،[dsh-web-fetch-http](../../packages/web/web-fetch-http)) و Consumer([dsh-tool-web](../../packages/web/tool-web) ، أي `web_search`/`web_fetch` أداة schema).Web هو**واحد بند اختياري قدرة**، لا يخص agent loop(ذكي جسم حلقة) رئيسي جاف، لذلك ذلك مفردات تعريف في هذا بينما غير [core.md](core.zh.md) في. أكثر تبديل search مزود لن تغيير نموذج إيداع استعلام طريقة، أكثر تبديل fetch مزود أيضا لن تغيير نموذج طلب URL طريقة.

شفرة المصدر:[`packages/web/web/src/types.ts`](../../packages/web/web/src/types.ts)

## لـ ماذا واحد بند قدرة يتضمن اثنان بند عملية

بحث و إمساك أخذ حيث لا مشترك طلب schema، أيضا لا مشترك عمل خدمة منطق، لكن هو جمع يتم متعمد تصميم لـ نفس عدد `ctx.web` في بين طبقة: واحد مزود اختيار سياسة كل من، واحد طقم في توقف و خطأ مفردات، و واحد موجه إلى منتج «هذا harness مثل أي وصول Web» إعداد واجهة. بديل قيمة هو خدمة فوق و سطر `searchX`/`fetchX` طريقة مقابل؛ هذا نوع و سطر هو متعمد لـ لـ، بينما لا هو متروك تسرب يمكن سحب أخذ مشترك صفة. مزود تسجيل هو**قدرة**(`WebSearchProvider` أو `WebFetchProvider`) ، بينما غير أداة؛ موجه إلى نموذج اسم،schema، نص التوجيه جذب توجيه و عرض الكل تجميع في في وحيد مستهلك `dsh-tool-web` في.

## بحث طلب و نتيجة

كل seam طلب فقط يحمل واحد `query`. مستهلك `dsh-tool-web` قبول لا بد ملء `queries` عدد مجموعة، و يأخذ هو مروحة خروج لـ كثير عدد مستقل seam طلب؛ وحدة عنصر عدد مجموعة تنفيذ مرة بحث.`maxResults` هو مستهلك ذاتي لديه حد أعلى (`dsh-tool-web` `searchMaxResults` إعداد، افتراضي `8`) ، عبر seam نقل تمرير و في إرجاع وقت قوي صنع تنفيذ——إذا مزود إرجاع تجاوز كمية،seam قطع قطع `sources[]` و ضبط `truncated`.

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

## إمساك أخذ طلب و نتيجة

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

HTTP حالة رمز هو يتم إمساك أخذ مورد حالة واحد جزء، لا تلقائي نظر لـ فشل: أي جعل مرة نجاح شبكة شبكة إمساك أخذ استلام إلى `404` أو `500` استجابة، أيضا ما زال سوف إنتاج خروج واحد `WebFetchResult`، منها يتضمن حالة رمز و طويل درجة تلقي حد قد حل رمز متن.`url` هو مرور مرور سماح إعادة تحديد نحو بعد نهائي URL.`WebError` فقط لأجل لا يمكن أمان نيل أخذ أو يمثل مورد حال حال.

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

## مزود متاح صفة

مزود `available(): boolean` هو واحد نزيه قيمة محلي فحص (سند إثبات هل وجود، إعداد هل يمكن تحليل) ،**منع توقف إرسال بدء شبكة شبكة استدعاء**. هو هو تنفيذ وقت اختيار مزود إدخال، بينما لا هو سليم سليم فحص نظام:`search()`/`fetch()` سوف قراءة هو قدوم اختيار متاح مزود. اختيار فشل وقت، استدعاء جهة سوف استلام إلى يمكن حسب بـ فرع معالجة بنية تحويل `WebError`؛ ذلك خطأ شفرة و رسالة سوف شرح ناقص id أو وجود اختلاف معنى مرشح تجميع.

اختيار من لا اعتماد تسجيل ترتيب، إعداد ترتيب أو HMR(حار وحدة استبدال) ترتيب: واحد بند قدرة يلزم ما لديه صريح مزود id(إعداد `searchProvider`/`fetchProvider`، أو ملء ملء نفس حقل مقابل بيئة متغير) ، يلزم ما في تماما جيد فقط لديه واحد متاح مزود تسجيل وقت تلقائي اختيار؛ إذا وجود كثير عدد متاح مزود لكن لم إعداد id، فإن رمي خروج `WEB_PROVIDER_AMBIGUOUS`، بينما لن اختيار استخدام الأكثر أولا تسجيل مزود.

## إمساك أخذ شبكة شبكة سياسة

قد تسليم Cordis،Code و Standard preset سوف في كل sandbox و مراجعة دفعة نمط تحت كشف `web_fetch`، بلا حاجة تدريجي مرة تأكيد. ملف sandbox preset لا إدارة ولاية Web شبكة شبكة وصول. حاجة تأكيد خطوة نشر يجب إضافة `tools/pre-execute` سياسة أو منع استخدام إمساك أخذ.

HTTP مزود سوف تحليل كل فعلي طلب، رفض يشمل عبر حالي DNS64 بادئة مقاومة بلوغ خاص IPv4 في داخل غير عام نتيجة، ثابت قد تحقق عنوان تجميع دمج، و في كل مرة نفس مصدر إعادة تحديد نحو وقت تكرار قوي صنع تنفيذ. عبر مصدر إعادة تحديد نحو حاجة جديد أداة استدعاء و جديد عام عنوان تحقق. هذه فحص سوف منع توقف عبر SSRF وصول غير عام هدف عنوان، لكن لن منع توقف نموذج يأخذ بيانات إرسال إلى عام URL.

## خطأ

`WebError extends HarnessError`([core.md](core.zh.md) خطأ تصنيف جسم نظام) ، حمل لديه `code: string`(فتح وضع صيغة، و أخرى seam خطأ متسق——`LlmError`،`SubagentError`) ، بينما غير غلاف إغلاق ربط دمج نوع: مزود يمكن في لا تعديل `dsh-web` حال حال تحت رمي خروج ذاتي ذات خطأ شفرة، مستهلك يجب سعة تحمل لم معرفة خطأ شفرة. خطأ شفرة حسب كل من تخطيط قسم. مشترك `WebRuntime` اتفاق سوف رمي خروج و seam غير متصل خطأ شفرة:`WEB_PROVIDER_UNAVAILABLE`،`WEB_PROVIDER_CONFIGURED_MISSING`،`WEB_PROVIDER_CONFIGURED_UNAVAILABLE`،`WEB_PROVIDER_AMBIGUOUS`،`WEB_DUPLICATE_PROVIDER`(تسجيل وقت تحرير مسار خطأ، صنف يشبه `LlmRuntime` `DUPLICATE_ADAPTER`) ،`WEB_ABORTED`، و `WEB_PROVIDER_ERROR`(مزود ذاته لذا عائق مرور seam كشف وقت استخدام التقاط قاع شفرة، يشمل DNS، اتصال يتم رفض،TLS انتظار شبكة شبكة أو نقل لذا عائق). إمساك أخذ نقل طبقة خطأ شفرة من `dsh-web-fetch-http` تنفيذ يملك، مختلف إمساك أخذ خلفية بلا حاجة رمي خروج هو جمع:`WEB_INVALID_URL`،`WEB_BLOCKED_URL`،`WEB_REDIRECT_BLOCKED`،`WEB_FETCH_TOO_LARGE`،`WEB_FETCH_TIMEOUT`،`WEB_UNSUPPORTED_CONTENT_TYPE`.

## خدمة

`WebRuntime` تسجيل بحث و إمساك أخذ مزود، بـ `WEB_DUPLICATE_PROVIDER` رفض تكرار id، و في تنفيذ وقت بـ بنية تحويل اختيار خطأ تحليل مزود. محلي إمساك أخذ خلفية فقط قبول HTTP(S) ، رفض سند إثبات، مقابل كل hostname فقط تحليل مرة، رفض يتضمن مهمة واحد غير عام IPv4/IPv6 هدف عنوان أو مرور حالي بادئة تحويل إلى غير عام IPv4 NAT64 عنوان تحليل نتيجة، يأخذ طلب اتصال ثابت إلى قد تحقق عنوان، مقابل كل مرة نفس مصدر إعادة تحديد نحو قفز تحويل تكرار هذه تحقق، حد إعادة تحديد نحو مرة عدد، بايت عدد، محرف عدد و وقت، و حل رمز متن؛ عرض من أداة مسؤول.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

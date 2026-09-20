# خادم HTTP

[English](web-server.md) | العربية

[dsh-host-webserver](../../packages/host/webserver) هو ناقلُ HTTP للمتصفح في مضيف الواجهة الرسومية: إضافةُ `node:http` واحدة تقدّم `ctx.webServer`، وسجلَّ مسارات مسمّاة، وضغطَ استجابات gzip اختياريًا، وردودَ نداء لتحويل index.html، ومعالجًا احتياطيًا واحدًا تستطيع إضافةٌ أن تدّعيه. وهو ليس من agent loop ولا seam قدرة؛ ولا يعرف مفاهيمَ الحزام، وتسجّل إضافةٌ أخرى كلَّ مسار وظيفي، بما فيه جسرُ `/api` وحزمُ الإضافات ومجرى أحداث HMR ([ملاحظة الطبقات](../../.agents/notes/implemented/architecture/2026-07-24-web-config-tree-boot-and-transport-layering.ar.md)). وهو يخدم المتصفحاتِ وحدها: فـElectron يحمّل الملفاتِ المبنية عبر `file://` ويرسل طلباتِ fetch عبر جسر IPC بدل هذا الخادم.

المصدر: [`packages/host/webserver/src/index.ts`](../../packages/host/webserver/src/index.ts)

## المسارات

```ts type-equiv
/** Route match kind: 'exact' matches the pathname verbatim; 'prefix' p matches p and p/<anything>. */
type WebRouteKind = 'exact' | 'prefix'
```

```ts type-equiv
/** One named route registration. */
interface WebRoute {
  kind: WebRouteKind
  /** Absolute pathname, no trailing slash. */
  path: string
  /** Owns the full response lifecycle (may hold the response open, e.g. SSE). */
  handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
}
```

وترتيبُ المطابقة ثابت: جدولُ المطابقة التامة أولًا، ثم أطولُ بادئة مطابِقة، ثم الاحتياطيُّ المسجَّل. ولا يحمل ترتيبُ التسجيل دلالةً تجاه الطلبات — فالمساراتُ المسمّاة تُركَّب متباينةً، ويجيب مقعدُ الاحتياطي عن كل ما لا يدّعيه مسارٌ مسمّى؛ وله مالكٌ واحد، والتسجيلُ الثاني يرمي. ويدّعي تركيبُ Web المشحون المقعدَ بـ[`dsh-host-frontend-static`](../../packages/host/frontend-static/src/index.ts)، وهو خادمُ dist لتطبيق الصفحة الواحدة بدلالات مقفلة: فالوصلةُ توثّق جذرَ dist وملفَّ index المضبوط قبل قراءة HTML الخاص بهما؛ وتبقى الأصولُ غيرُ index عامة؛ وما ليس GET أو HEAD يُجاب بـ405، والاجتيازُ خارج جذر dist يُجاب بـ403، والملفاتُ الموجودة تُقدَّم مباشرةً، والأهدافُ الغائبة أو غيرُ الملفات تُجاب باستجابات 404 فارغة، والامتداداتُ المجهولة تُشحن بنوع octet-stream.

## الضبط

```ts type-equiv
/** Web server listen and response-compression config. */
interface Config {
  /** Listen host; the two supported values are loopback and all-interfaces. */
  host: '127.0.0.1' | '0.0.0.0'
  /** Listen port; zero requests an OS-assigned port. */
  port: number
  /** Response compression for socket-backed HTTP requests. @default 'none' */
  compression?: 'none' | 'gzip'
  /** Gzip DEFLATE level from 0 through 9. @default 1 */
  compressionLevel?: number
  /** Minimum known response length eligible for gzip; unknown-length streams are eligible. @default 1024 */
  compressionThresholdBytes?: number
}
```

ولا يقبل `host` إلا `127.0.0.1` (الوضعُ الافتراضي) و`0.0.0.0` (كشفٌ متعمَّد على الشبكة). ولا يملك الناقلُ نفسه TLS ولا توثيقًا ولا سياسةَ Origin، فالربطُ على غير loopback يكشف الخادمَ ما لم يوفّر التركيبُ تلك الضوابط. وقيمةُ `compression` الافتراضية هي `none`؛ وتختار حزمةُ Web المشحونة gzip بالمستوى 1 وعتبة 1024 بايت. ويختار أمرُ `dsh web` المشحون loopback ويرفض `--host 0.0.0.0`؛ وتوفّر إضافةُ الوصلة لديه فحوصَ Host وOrigin مع توثيق جلسة المتصفح لكل مسار وكل مجرى في واجهة المضيف البرمجية. وتملك التركيباتُ الأخرى سياسةَ ربطها وتوثيقِ مساراتها. أما موضعُ dist فحقيقةُ تجميع تخص إضافةَ الواجهة التي تدّعي المقعد.

## الخدمة

يستمع `WebServer` (`ctx.webServer`) فورَ التفعيل؛ وفشلُ الاستماع (EADDRINUSE وغيره) يرفض التهيئةَ، وتبلّغ عمليةُ الإقلاع عن الليف الفاشل. ويضيف `register(route)` مسارًا مسمّى واحدًا ويعيد مُفكِّكَه؛ ويرمي `(kind, path)` المكرر لأن أنماطَ المسارات عقدٌ على مستوى التركيب والتصادمُ خطأُ ضبط. ويغلّف gzip الاستجاباتِ المؤهَّلة المسنَدة إلى المقابس داخل الخادم، فتحتفظ معالِجاتُ المسارات بملكية `ServerResponse` المباشرة ولا تُضاف واجهةُ كتابة استجابات إلى الخدمة. وتبقى ترميزاتُ المحتوى القائمة و`Cache-Control: no-transform` والنطاقاتُ وSSE وZIP وصورةُ Worker المحزومة بامتداد `.gz` استجاباتٍ بالهوية. ويجمع `collectIndexInjections()` صفوفَ `IndexInjection` المبنيَنة عبر إطلاق `webserver/index-inject` واحد، ويعرضها `renderIndex(html)` في استجابات الجذر وindex المضبوط الناجحة قبل تطبيق تحويلات مَهرب `tapIndex(transform)` الخام بترتيب تسجيلها؛ وتجيب [dsh-client-modules](../../packages/client/modules) عن الحدث بصفوف بيان الإقلاع. ويقرأ `port` منفذَ الاستماع، ومنه المنفذُ الذي يخصصه نظامُ التشغيل حين تكون `config.port` صفرًا.

والطلبُ الذي ترمي معالجتُه — كإفلات `%` مشوَّه يصل إلى `decodeURIComponent`، أو عميل ينقطع في منتصف الجسم — يُسجَّل تحذيرًا ويُجاب بـ400، أو يُدمَّر المقبسُ إن كانت الترويساتُ قد خرجت، ولا يُخرج العمليةَ أبدًا. ويقرن التخلصُ بين `close()` و`closeAllConnections()` لأن معالِجًا قد يُبقي استجابتَه مفتوحة (SSE) وهذه الوصلاتُ لا تنتهي من تلقائها؛ فلولا الإغلاقُ القسري لعلّق التفكيك. ولا تطبع الحزمةُ شيئًا: فسطرُ الرابط يخص الصدفة. وتبقى تفاصيلُ التشغيل الخاصة بالحزمة، ومنها مسارُ مراقبة الحزمة في وضع التطوير، في [README](../../packages/host/webserver/README.ar.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxconnection--hostconnectionhandle"></a>

### `ctx.connection` — `HostConnectionHandle`

Host `ctx.connection` shape consumed by transport-independent adapters.

```ts cordis-catalog
/**
 * Compose exact Fetch routes and the shared-channel RPC interceptor.
 * @param channel - shared channel mounted by Connection.
 * @returns Fetch handler for trusted, authenticated requests.
 */
createSharedFetchHandler(channel: '/api'): ConnectionFetchHandler

/**
 * Apply Connection's Host/Origin checks and browser authentication to
 * another Web route.
 * @param request - request headers from the HTTP or upgrade request.
 * @returns rejection status, or undefined when the route may accept the request.
 */
requestRejection(request: ConnectionTrustRequest): ConnectionRequestRejection

/**
 * Authenticate one frontend index request, owning a token redirect or 401.
 * @param request - root or configured-index HTTP request.
 * @param response - response owned when the result is false.
 * @returns true only when the frontend may serve index.html.
 */
authorizeIndex(request: ConnectionIndexRequest, response: ConnectionIndexResponse): boolean

/**
 * Add the fresh process token to an ordinary Web application URL.
 * @param baseUrl - clean canonical browser origin.
 * @returns root URL accepted by {@link authorizeIndex} for initial login.
 */
authenticatedUrl(baseUrl: string): string
```

Source: [`packages/client/connection/src/rpc.ts`](../../packages/client/connection/src/rpc.ts)

<a id="ctxwebserver--webserver"></a>

### `ctx.webServer` — `WebServer`

The browser HTTP carrier service. Activation listens immediately. Route registration order does not affect requests because configured named routes must be distinct, and the fallback handler answers anything not yet claimed during startup with 404 until its owner registers. A listen failure rejects initialization, and the boot process reports the failed fiber.

```ts cordis-catalog
/**
 * Register a named route. Duplicate (kind, path) throws — route patterns are
 * a composition-level contract, so a collision is a misconfiguration.
 * @param route - kind, path, and the owning handler.
 * @returns the disposer removing the route.
 */
register(route: WebRoute): () => void

/**
 * Register an exact-path HTTP upgrade route. Duplicate paths throw because
 * one socket can have only one protocol owner.
 * @param route - pathname and handler owning negotiation plus socket use.
 * @returns the disposer removing the route.
 */
registerUpgrade(route: WebUpgradeRoute): () => void

/**
 * Claim the fallback seat: the handler answering every request no named
 * route matches (the SPA dist server in the shipped Web composition). One
 * owner only — a second registration throws, because two fallbacks cannot
 * compose.
 * @param handler - owns the full response lifecycle of unmatched requests.
 * @returns the disposer releasing the seat.
 */
registerFallback(handler: WebRoute['handler']): () => void

/**
 * Register a raw-HTML index transform, the escape hatch for markup no
 * {@link IndexInjection} row expresses: {@link renderIndex} applies taps in
 * registration order after rendering the structured rows.
 * @param transform - pure html-to-html function.
 * @returns the disposer removing the transform.
 */
tapIndex(transform: (html: string) => string): () => void

/**
 * Run an index.html body through the registered taps in registration order
 * — called by the fallback owner on every index response it renders.
 * @param html - the raw index.html body.
 * @returns the transformed body.
 */
applyIndexTaps(html: string): string

/**
 * Gather the structured injection table: one `webserver/index-inject` emit,
 * every subscriber pushes its current rows. Fresh per call, so subscribers
 * read live state (module graph, theme preference) at emit time.
 * @returns rows in subscriber activation order.
 */
collectIndexInjections(): IndexInjection[]

/**
 * Render one index.html body: the structured injection table first, then
 * the raw `tapIndex` transforms over the result.
 * @param html - the raw index.html body.
 * @returns the transformed body.
 */
renderIndex(html: string): string
```

Source: [`packages/host/webserver/src/index.ts`](../../packages/host/webserver/src/index.ts)

<a id="connection-events"></a>

### `connection/*` events

<a id="connectionrequest--waterfall"></a>

#### `connection/request` — waterfall

Admit or wrap an authenticated shared API request, including body transfer. Existing requests continue when a listener refuses subsequent requests.

```ts cordis-catalog
/**
 * Admit or wrap an authenticated shared API request, including body transfer.
 * Existing requests continue when a listener refuses subsequent requests.
 * @param request - Authenticated incoming HTTP request.
 * @param response - Response owned until the delegated bridge settles.
 * @param next - Delegate to the next listener or the shared API bridge.
 * @mode waterfall
 */
'connection/request'(request: IncomingMessage, response: ServerResponse, next: () => Promise<void>): Promise<void>
```

Source: [`packages/client/connection/src/index.ts`](../../packages/client/connection/src/index.ts)

<a id="webserver-events"></a>

### `webserver/*` events

<a id="webserverindex-inject--emit"></a>

#### `webserver/index-inject` — emit

Collect the structured index injection table. Emitted on every index render and every worker boot-payload request; listeners push their current rows, so a row's data is read fresh at emit time.

```ts cordis-catalog
/**
 * Collect the structured index injection table. Emitted on every index
 * render and every worker boot-payload request; listeners push their
 * current rows, so a row's data is read fresh at emit time.
 * @param table - Mutable row table; listeners append in activation order.
 * @mode emit
 */
'webserver/index-inject'(table: IndexInjection[]): void
```

Source: [`packages/host/webserver/src/index.ts`](../../packages/host/webserver/src/index.ts)
<!-- END GENERATED cordis-surface -->

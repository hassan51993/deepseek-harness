# HTTP خادم

[English](web-server.md) | العربية

[dsh-host-webserver](../../packages/host/webserver) هو GUI Host متصفح HTTP تحميل جسم: هو هو واحد توفير `ctx.webServer` `node:http` إضافة، يتضمن أداة اسم توجيه سجل التسجيل، اختياري gzip استجابة ضغط،index.html تحويل عودة ضبط، و واحد يمكن من إضافة إقرار قيادة رجوع معالج. هو لا يخص agent loop(ذكي جسم حلقة) ، أيضا لا هو قدرة seam؛ هو لا حل أي harness عام فكرة. أخرى إضافة مسؤول تسجيل كل وظيفة توجيه، يشمل `/api` جسر وصل، إضافة bundle و HMR(حار وحدة استبدال) حدث تدفق ([قسم طبقة شرح](../../.agents/notes/implemented/architecture/2026-07-24-web-config-tree-boot-and-transport-layering.ar.md)). هذا خادم فقط خدمة متصفح:Electron عبر `file://` تحميل قد بناء ملف، و مرور IPC جسر وصل إرسال fetch طلب، لا استخدام هذا خادم.

شفرة المصدر:[`packages/host/webserver/src/index.ts`](../../packages/host/webserver/src/index.ts)

## توجيه

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

مطابقة ترتيب ثابت: أولا فحص exact جدول، مجددا أخذ الأكثر طويل مطابقة بادئة، الأكثر بعد سقوط إلى قد تسجيل رجوع. تسجيل ترتيب لا يحمل أي موجه إلى طلب دلالة: أداة اسم توجيه في تركيب فوق متبادل لا متبادل تسليم، أي لم يتم أداة اسم توجيه إقرار قيادة طلب كل من رجوع مقعد موضع ينبغي جواب؛ مقعد موضع فقط لديه واحد كل من، ثاني مرة تسجيل سوف رمي خروج استثناء. إصدار Web تركيب استخدام [`dsh-host-frontend-static`](../../packages/host/frontend-static/src/index.ts) إقرار قيادة مقعد موضع، أي التزام دوران ثابت دلالة SPA dist خادم:Connection في قراءة dist أصل دليل و إعداد index HTML قبل إتمام إقرار إثبات؛ غير index مورد إنتاج إبقاء عام؛ غير GET/HEAD إرجاع 405، تجاوز خروج dist أصل دليل مرة تاريخ إرجاع 403، قائم ملف مباشر توفير، ناقص أو لا هو ملف هدف إرجاع فارغ 404، لم معرفة توسيع اسم حسب octet-stream إرسال.

## إعداد

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

`host` فقط قبول `127.0.0.1`(افتراضي وضع حالة) و `0.0.0.0`(لحظة معنى شبكة كشف). تحميل جسم ذاته لا يملك TLS، إقرار إثبات أو Origin سياسة، لذلك ربط إلى غير عودة حلقة عنوان سوف كشف خادم، حذف غير تركيب طبقة توفير هذه تحكم.`compression` افتراضي لـ `none`؛ مع مرفق Web تركيب اختيار gzip level 1 و 1024 بايت عتبة قيمة. مع مرفق `dsh web` أمر اختيار loopback و رفض `--host 0.0.0.0`؛ ذلك Connection إضافة لـ كل Host API route و stream توفير Host/Origin تحقق و متصفح جلسة إقرار إثبات. أخرى تركيب ذاتي سطر يملك ربط و توجيه إقرار إثبات سياسة.dist موضع هو إقرار قيادة مقعد موضع قبل طرف إضافة تجميع واقع.

## خدمة

`WebServer`(`ctx.webServer`) في تنشيط وقت قيام أي استماع؛ استماع فشل (EADDRINUSE انتظار) سوف جعل ابتدائي تحويل يتم رفض، بدء عملية سوف تقرير إبلاغ فشل fiber.`register(route)` إضافة واحد بند أداة اسم توجيه و إرجاع ذلك disposer؛ تكرار `(kind, path)` رمي خروج استثناء، لأن توجيه نمط هو تركيب طبقة اتفاق، اندفاع مفاجئ أي إعداد خطأ.Gzip في خادم داخلي حزمة تركيب رمز دمج شرط كما أساس في socket استجابة، لذلك route handler متابعة مباشر يحتفظ `ServerResponse`، خدمة أيضا لا إضافة جديدة استجابة كتابة خروج API. قد لديه محتوى تحرير رمز،`Cache-Control: no-transform`، نطاق استجابة،SSE،ZIP و تحزيم بعد `.gz` Worker مرآة مثل متساو إبقاء identity استجابة.`collectIndexInjections()` مرور مرة `webserver/index-inject` emit استلام تجميع بنية تحويل `IndexInjection` سطر،`renderIndex(html)` يأخذ هو جمع تصيير دخول نجاح أصل مسار و إعداد index استجابة، مع بعد مجددا حسب تسجيل ترتيب تطبيق أصلي `tapIndex(transform)` هروب توليد فتحة تحويل؛[dsh-client-modules](../../packages/client/modules) بـ بدء manifest(بيانات وصفية بيان) سطر عودة ينبغي هذا حدث.`port` قراءة استماع طرف فتحة، يشمل `config.port` لـ 0 وقت عملية نظام قسم إعداد طرف فتحة.

معالجة مرور مسار في رمي خروج استثناء طلب (شاذ شكل % تحويل معنى اصطدام فوق `decodeURIComponent`، عميل في طلب جسم في طريق قطع فتح) سوف سجل لـ تحذير إبلاغ و ينبغي جواب 400(استجابة رأس قد إرسال خروج وقت فإن إلغاء تدمير socket) ، أبدا توجيه يؤدي عملية خروج.dispose(مورد تحرير) يأخذ `close()` و `closeAllConnections()` إعداد مقابل استخدام، لأن معالج ممكن مثل SSE(Server-Sent Events) ذلك مثال إبقاء استجابة فتح، بينما هذا صنف اتصال دائم بعيد لن ذاتي سطر انتهاء؛ لا يوجد قوي صنع إغلاق، تفكيك إزالة حينئذ سوف تعليق بدء. هذا حزمة من لا ضرب طبع إخراج:URL سطر عودة shell كل. تدريجي حزمة تشغيل صيانة دقيق عقدة (يحتوي تطوير نمط bundle مراقبة نظر خط الإنتاج) إبقاء في [README](../../packages/host/webserver/README.ar.md) في.

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

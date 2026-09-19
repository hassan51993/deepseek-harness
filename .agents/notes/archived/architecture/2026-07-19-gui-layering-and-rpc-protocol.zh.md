# Agent Note: GUI قسم طبقة و RPC بروتوكول——host/client حسب قدرة مزود قسم طبقة، أربعة كائن حد رسالة نموذج و fetch تحميل جسم

Status: implemented
Archived: 2026-08-27

[English](2026-07-19-gui-layering-and-rpc-protocol.md) | العربية

> قسم عمل خط: هذا مقالة = قسم طبقة نموذج + عبر طريق غير متصل RPC بروتوكول؛ بروتوكول Web تنفيذ من HTTP فوق سطر إضافة [WebSocket تحت سطر تحميل جسم](2026-08-04-websocket-downlink-carrier.zh.md) مجموعة صار، متصفح كائن طبقة رؤية [Web عميل هيكل بنية قلم تسجيل](2026-07-19-gui-web-client-architecture.zh.md).

## Problem

حاجة توفير UI مقابل وصل طبقة، حذف قد لديه ACP(Agent Client Protocol)/stdio أساس خط خارج، أيضا حاجة Web(server) ،Electron انتظار أخرى منتج عميل. أنا جمع يأخذ هو جمع موحد واحد تسمية لـ Client. أمل نظر أداة تجهيز التالي قدرة:
- واحد `dsh` عملية معا دعم حمل `dsh web`(بدء) و `dsh --profile headless`(headless) ، واحد عملية اثنان نوع نمط (تصميم مسبق إبقاء)
- في Electron في استخدام و `dsh web` نفسه Web تقنية فن بدء

ذلك ما حالي عمل مسار شفرة حاجة مستقر قسم طبقة مسؤولية نموذج، سهل في بـ بعد وصل دخول كل صنف client.

معا كل مستهلك شيء إدارة عبر طريق مختلف (متصفح HTTP/WebSocket، عملية داخل fetch/SSE، سوف قدوم IPC) ، أيضا حاجة واحد عبر طريق غير متصل رسالة نموذج و مفرد واحد اتفاق حق مصدر، يجعل «إضافة واحد طريقة»«تبديل واحد نوع تحميل جسم» متبادل لا جر وصل، كما wire فوق كل بند رسالة يمكن نوع تحقق، يمكن مراقبة قياس، يمكن مقابل حساب.

## Decision

### قسم طبقة

دليل حسب وفق مثل تحت قسم طبقة:
- `packages/host/*`: حزمة فقط توفير Host جانب قدرة (بديل جدول بـ الآن Harness فعلي جسم إضافة نظام لـ رئيسي جسم Node.js شفرة نواة قلب عمل مسار) ، حذف هذا خارج، أيضا يتضمن
    - موحد واحد خلفية بروتوكول (fetch،HTTP، تدفق صيغة واجهة انتظار) تعريف و دعم حمل، رؤية هذا مقالة «رسالة بروتوكول» بدء كل عقدة
- `packages/client/*`: حزمة فقط توفير Client جانب قدرة، كل حزمة مفرد حافة لا خلط. هذا داخل إقامة ثلاثة صنف حزمة (اثنان بند محور عودة [client إضافة تركيب تحميل قلم تسجيل](2026-07-23-client-plugin-loading-model.zh.md) كل):
    - **صاف مكتبة**(`ui-slots`،`ui-primitives`، خارج إضافة داخل نواة حزمة `loader`): عادي أصل مدخل حزمة، ساكن حالة تحزيم دخول قشرة؛ اثنان عدد عميل مكتبة بث نوع دخول وحدة جدول.
    - **ساكن حالة وصول entry حزمة**(`connection`،`runtime`،`ui-theme`،`i18n`،`hmr`): بلا `dsh.client` مفتاح، بلا متصفح bundle——قشرة يأخذ هو جمع `src/client/` نصف حافة ضرب دخول ذاتي ذات bundle و نحو `ctx.modules` تسجيل تسجيل؛ هو جمع و ذلك بقية وحدة واحد مثال، بصفة host وحيد بيت تأليف كتابة رسم داخل entry تلقي معالجة إدارة.
    - **fetch وصول إضافة حزمة**(`ui-layout`،`ui-sidebar`،`ui-conversation`،`ui-trajectory`): مزدوج مدخل——أصل مدخل هو node نصف حافة (فارغ `apply`، ذلك وجود هو لـ يجعل host Loader إدارة ولاية دورة الحياة، يجعل web إضافة سجل التسجيل اكتشاف package.json `dsh.client` إعلان) ؛ تنفيذ إقامة في `src/client/` تحت، مرور `./client` فرعي مسار إصدار (tsdown إغلاق حزمة عمل مصنع bundle). عبر إضافة إزالة استهلاك `/client` فقط حد نوع؛ قيمة طبقة وجه تنسيق عمل مشي cordis خدمة.
- `apps/` بصفة مقابل خارج توجيه خروج تطبيق مدخل، يمكن من Client / Host خلط دمج تجميع.
    - `apps/web`(`dsh-web-frontend`) هو vite تطبيق:`dsh-client-web` توجيه خروج قشرة API لـ فوق واحد طبقة رقيق `main.ts`.
    - `apps/cli`(`@deepseek-ai/dsh`) توزيع أمر:`dsh web` = Host + webserver + بناء خروج `dsh-web-frontend` dist؛`dsh --profile headless` = [مباشر استخدام نواة قلب Agent/Session مدخل](2026-08-09-headless-direct-core-entry-point.zh.md) ، لا يحتوي Host،HTTP أو متصفح طبقة.
    - سوف قدوم Electron تطبيق مرور من IPC fetch تحميل جسم إعادة استخدام نفس طقم web client حزمة.

```
apps/*  (applications: apps/web = vite app, apps/cli = bin dispatch)
  │ consume
  ▼
packages/host/*                      packages/client/*
  apiproxy   front layer: protocol     pure libs: ui-slots / ui-primitives
  runtime    assembly / host entity    dsh.client plugins ×8 (node half = empty apply,
  webserver  Web HTTP carriage                              client half = src/client/)
  │ ctx.plugin(...)                      ▲ import only apiproxy's /api /client subpaths
  ▼                                      │ (type-only + the client base class)
harness core packages ──────────────────┘ (types reach the browser via import type)
```

جهة نحو سجل قاعدة (كل بند كل من حزمة deps يمكن نواة):

- `runtime → apiproxy` مفرد نحو؛apiproxy فقط اعتماد نوع تعريف.
- client جانب حزمة**دائم لا import** host جانب حزمة وقت التشغيل (فقط أكل `/api`،`/client` اثنان عدد متصفح أمان فرعي مسار).
- `webserver` لا اعتماد `runtime`: هو توفير `{ fetch }` خاص تحديد تنفيذ ——«webserver ← runtime» فقط هو وقت التشغيل حقن علاقة، لا هو حزمة اعتماد.
- client جانب عبر حزمة import إضافة حزمة واحد قاعدة مشي `/client` فرعي مسار، كما إضافة حزمة بين فقط حد نوع import——عبر إضافة قيمة import في tsdown صاف درجة بوابة موضع أي بناء خطأ (قيمة طبقة وجه تنسيق عمل مشي cordis خدمة؛ حافة قاعدة عودة [client إضافة تركيب تحميل قلم تسجيل](2026-07-23-client-plugin-loading-model.zh.md) كل).

TypeScript بـ solution أصل مرجع**اثنان عدد تجمع دمج program** فحص (`tsconfig.json` = solution؛`tsconfig.host.json` = host جانب + اختبار، ترتيب حذف `packages/client`؛`tsconfig.client.json` = client كل حزمة و ذلك اختبار): اثنان جانب في نفسه مفتاح (`sessions`،`loader`) تحت بـ مختلف خدمة دمج cordis `Context` واجهة، مفرد واحد program سوف معا يرى اثنان نسخة إعلان دمج بينما تقرير اندفاع مفاجئ. مشترك ورقة فرعي حزمة (session/llm/tools/apiproxy انتظار) فقط بناء مرة، من اثنان عدد program مشترك نفس مرجع ([توسيع اندفاع](../process/2026-07-22-tsconfig-solution-root-two-aggregates.zh.md)).

بروتوكول جانب:TS interface(`packages/host/apiproxy/src/api/`، صفر Node اعتماد، متصفح يمكن import) ؛wire رسالة موحد واحد لـ**مزدوج نحو نموذج**——كل بند منطق رسالة حسب «من إرسال بدء × request/response» تصنيف (اثنان محور أربعة إطار، بعد نص تسمية أربعة كائن حد) ، و شيء إدارة عبر طريق حل اقتران؛ عميل موحد واحد وراثة `AbstractApiClient`(بروتوكول ثابت كمية كل في أساس صنف، منصة فرق مختلف فقط هو `doFetch` نقل قطع وجه).

#### قسم طبقة زاوية لون

| طبقة | حزمة | مسؤولية | صلة مفتاح سجل قاعدة |
|---|---|---|---|
| قبل وضع طبقة | `dsh-host-apiproxy` | TS/zod تعريف (api/)+ fetch سحب كائن (fetch/:handler + عميل أساس صنف) | فعل بسيط مفرد، كل مستهلك كل يلزم؛Node/متصفح جميع يمكن import؛ بروتوكول محتوى رؤية تحت نص «رسالة بروتوكول» بدء كل عقدة؛client لا نيل مرور ctx التفاف فتح api |
| تركيب إعداد طبقة | `dsh-host-runtime` | إضافة تركيب + ApiProxy تجميع صار + web UI إضافة تركيب (تغطية ثمانية عدد dsh.client حزمة داخل تخزين Loader شجرة) ؛host درجة إعداد ملكية أرض (defaults/persistenceRoot، سوف قدوم مستخدم profile) | تركيب ماذا إضافة، إعطاء ماذا قيمة افتراضية فقط في هذا داخل تحديد؛ قشرة لا نيل تعديل تركيب إعداد |
| تحمل تحميل طبقة | `dsh-host-webserver` | Web HTTP و upgrade: ساكن حالة خدمة + `/api/*`→handler تحويل إرسال + WebSocket upgrade route + close دلالة؛ إضافة bundle طرف نقطة + `__DSH_BOOT__` manifest(بيانات وصفية بيان) حقن (من web إضافة سجل التسجيل توفير إعطاء) | Web(متصفح وصول) مخصص استخدام؛ صفر workspace اعتماد (سجل التسجيل مرور بنية حقن وصول) ؛Electron لا إعادة استخدام هو |
| client مكتبة | `dsh-client-ui-slots` / `dsh-client-ui-primitives` | slot اتفاق / صاف React أصل فرعي مكون | من قشرة بث نوع دخول loader وحدة جدول |
| client إضافة | `dsh-client-connection` / `dsh-client-runtime` / `dsh-client-ui-theme` / `dsh-client-ui-renderer` / وظيفة UI حزمة | متصفح جانب Cordis إضافة شجرة:wire مستهلك، نواة قلب خدمة، رئيسي عنوان،React تصيير و وظيفة تركيب——رؤية Web عميل هيكل بنية قلم تسجيل | مزدوج مدخل (node نصف حافة=فارغ apply؛ تنفيذ في `src/client/`) ؛ عبر إضافة قيمة تنسيق عمل مرور خدمة و slot إتمام |
| تطبيق | `@deepseek-ai/dsh`(apps/cli)+ `dsh-web-frontend`(apps/web،vite تطبيق) | bin خشن توزيع + كل تطبيق واحد تجميع تركيب وحدة (web.ts / headless.ts) ؛vite تطبيق هو `dsh-client-web` قشرة جدول وجه لـ فوق رقيق main | كل تطبيق استخدام حركة حالة import، لذلك لن متبادل متبادل تحميل؛dist تحديد موضع انتظار workspace معرفة تعرف إبقاء في app |

#### تسمية قاعدة

`packages/host/*` و `packages/client/*` تحت حزمة اسم**يجب يحتوي دليل مجموعة بادئة**:host/runtime → `dsh-host-runtime`،client/runtime → `dsh-client-runtime`. دليل اسم لا تكرار مجموعة بادئة (host/ قد جدول بلوغ). لذلك حزمة اسم ذيل مقطع ≠ دليل اسم،tsconfig.base.json `dsh-*` عبر إعداد (حسب دليل اسم تحليل) أمر لا في——**هذا اثنان مجموعة كل حزمة يحتاج صريح paths بند**، كما client كل حزمة `/client` فرعي مسار يلزم مفرد صف بند، جعل شفرة المصدر درجة تحليل و exports map متسق.

#### كيف ما وصل دخول واحد جديد تطبيق (عملية بيان)

1. **اختيار fetch زائف صنع طريقة**: متصفح نفس مصدر HTTP / عملية داخل `host.handler.fetch` حقن / ذاتي كتابة نقل قطع وجه فرعي صنف (مثل سوف قدوم Electron IPC، رؤية تحت نص «فرعي صنف جدول»).
2. **في `apps/` تحت كتابة تجميع تركيب وحدة**:`startHost()` + عميل فرعي صنف + هذا تطبيق خاص إشارة/ضرب طبع/خروج دلالة؛ خلط دمج جسم لا بناء حزمة، تجميع تركيب كتابة في app داخل.
3. **حاجة HTTP تحمل تحميل عندئذ import `dsh-host-webserver`**، لا فإن صفر طرف فتحة.

قائم اثنان عدد تطبيق إبقاء هذا واحد منطقة قسم:Web تطبيق تركيب Host، تحميل جسم و متصفح تركيب، بينما `dsh --profile headless` تركيب مباشر استخدام نواة قلب خدمة runner، لا يتضمن Host،HTTP أو طرف فتحة.ACP صنف بروتوكول جسر لا التزام دوران client تحميل جسم بيان: هو يأخذ core كشف إعطاء خارجي توليد حالة، مباشر عبر `ctx.plugin(مدخل إضافة)` تركيب، لا استخدام fetch.

## رسالة بروتوكول

التالي كل عقدة هو قبل وضع طبقة (`dsh-host-apiproxy`) تحمل تحميل بروتوكول هذا جسم.wire فوق فقط لديه أربعة نوع رسالة (أربعة كائن حد)——يمين صف Web تحمل تحميل فقط هو عرض مثال، تبديل تحميل جسم (عملية داخل/IPC) وقت أربعة كائن حد ثابت:

```
                 client إرسال بدء server إرسال بدء
  request   ① ClientRequest                 ③ ServerRequest
            (POST /api/<method> body) (WebSocket message:session حدث، مراجعة دفعة/سؤال جواب requested)
  response  ② ServerResponse                ④ ClientResponse
            (هذا POST HTTP ينبغي جواب جسم) (POST /api/respond body، عودة ملء ③ rpcId)
```

### wire كل شكل: أربعة أداة اسم حكم آخر union(`api/rpc.ts`)

| نوع | حكم آخر tag | حقل | rpcId ملكية | Web تحمل تحميل |
|---|---|---|---|---|
| `ClientRequest` | `'client-request'` | `rpcId` `method` `payload` | client mint | `POST /api/<method>` body |
| `ServerResponse` | `'server-response'` | `rpcId` `result` | عودة ملء ① | هذا POST ينبغي جواب جسم (ثابت HTTP 200) |
| `ServerRequest` | `'server-request'` | `rpcId` `method` `payload` | server mint | WebSocket text message |
| `ClientResponse` | `'client-response'` | `rpcId` `result` | عودة ملء ③ | `POST /api/respond` body |

`RpcMessage = ClientRequest | ServerResponse | ServerRequest | ClientResponse`،`switch (message.type)` ضيق تحويل.

**rpcId سجل قاعدة**(`RpcId` هو branded string، بنية صنع دالة `RpcId()`):

- من إرسال بدء من mint؛ ينبغي جواب واحد قاعدة عودة ملء مقابل request rpcId،**أبدا mint جديد id**.
- server-request قسم اثنان صنف، ساكن حالة حسب `method`(=لقطة type) منطقة قسم،**لا ضبط رقم ثلاثة نوع kind**: يمكن ينبغي جواب لقطة (`approval/requested`،`question/requested`) rpcId هو مستقر منطق طلب id(تلقي إدارة وقت mint مرة، أساس خط إعادة تشغيل أصل مثال إعادة استخدام،client بـ هو عودة ملء ينبغي جواب) ؛ صاف دفع إرسال لقطة (`session/event` انتظار) rpcId معرف هذا مرة دفع إرسال (كل مرة جديد mint).
- عمل خدمة شفرة لا mint:unary mint استلام فتحة في عميل أساس صنف `callUnary`، لقطة mint استلام فتحة في host جانب.

### توقيع ضيق شكل و تحميل جسم تكملة كل

مجال واجهة توقيع فقط شعور معرفة ضيق شكل:`RpcRequest<P> = { rpcId, payload }`،`RpcResponse<T> = { rpcId, result: RpcResult<T> }`. تحميل جسم طبقة يأخذ ضيق شكل تكملة كل لـ كل شكل (تكملة `type` tag و `method`) ، جهة نحو لا اعتماد عبر طريق دفع قطع.`RpcResult<T> = { ok: true; value } | { ok: false; error: RpcError }`——طريقة لا throw عمل خدمة خطأ.

### RpcReceipt: تحميل جسم عودة تنفيذ

`ClientResponse` HTTP ينبغي جواب جسم هو `RpcReceipt = { accepted: true } | { accepted: false; reason: 'not-pending' | 'bad-response' }`——تحميل جسم طبقة عودة تنفيذ،**لا هو** RpcMessage(response لم يعد لديه response) ؛ متأخر إلى/تكرار ينبغي جواب استلام `not-pending`، منطق استلام جمع نقطة هو `*/resolved` لقطة.

## نوع جسم نظام: دالة توقيع أي حق مصدر

### RpcMethodMap و إرسال توليد عام نوع (`api/rpc-map.ts`)

طريقة معامل/إرجاع بنية**فقط إقامة في واجهة طريقة توقيع داخل**؛map تسجيل تسجيل طريقة ذاته؛ ذلك بقية واحد قطع موضع (handler،client،store، اختبار) مرجع إرسال توليد عام نوع، منع توقف تكرار كتابة حرف وجه كمية أو آخر بدء مستو فرش أداة اسم نوع:

```ts ignore-check
export interface RpcMethodMap {
  'session.list': SessionsApi['list'] // map key أي wire مسار مقطع
  // …ذلك بقية طريقة نفس شكل تسجيل تسجيل، كل تجميع رؤية api/rpc-map.ts
}
// إرسال توليد عام نوع (اختراق نفاذ ضيق شكل أخذ عمل خدمة نوع؛ فعلي إعلان حمل K extends keyof RpcMethodMap قيد)
export type RequestPayload<K> = Parameters<RpcMethodMap[K]>[0]['payload']
export type ResponseValue<K> =
  Awaited<ReturnType<RpcMethodMap[K]>> extends RpcResponse<infer T> ? T : never
```

تدفق طريقة (`events.mux`/`events.host`) لا دخول map(لا هو unary) ؛`respond` لا دخول map(هو client-response لا هو طريقة استدعاء).

### خطأ نموذج (`RpcErrorDetailsMap`)

رمز خطأ عرض مثال واحد سطر:

| code | details | أي وقت |
|---|---|---|
| `bad-request` | `{ issues: ZodIssue[] }` | wire/payload zod تحقق فشل |

رمز كل تجميع رؤية `api/rpc.ts` `RpcErrorDetailsMap`.`RpcError` هو map توسيع قسم نشر صيغة union:`code` حكم آخر،`switch` بعد `details` تلقائي ضيق تحويل؛**details لا بد ملء**——جديد رمز=map إضافة واحد سطر+خطأ schema إضافة واحد دعم، تسرب ملء هو تحرير ترجمة خطأ.transport لذا عائق (قطع شبكة،host لا بدء) من تحميل جسم رمي استثناء، و عمل خدمة خطأ اثنان طبقة لا خلط.

### zod مزدوج نحو تحقق و مرساة تحديد

- **اثنان درجة parse**: كل شكل schema مرة (type/rpcId/method بنية + handler تحقق path==method)→ عمل خدمة payload حسب method/لقطة نوع قسم إرسال اثنان مرة parse؛ رفض استلام = `bad-request`.
- **مرساة تحديد**:schema موحد واحد `satisfies z.ZodType<Wire<T>>`(`api/rpc.schema.ts`).`Wire<T>` هو عميق درجة «| undefined» عرض تحويل——مستودع فتح `exactOptionalPropertyTypes` بينما zod `.optional()` إخراج `T | undefined`، مباشر مرساة أصل نوع كل خط غير ممكن استخدام؛JSON wire فوق نقص مقعد و undefined نفس شكل، عرض تحويل لا ضرر فقد تحقق دلالة. نفاذ نقل عرض فرع (`SessionEvent`/`ContentBlock`/لقطة union/`RpcError`) و brand id schema استخدام صريح cast + ملاحظة تفسير.
- brand cast مفرد نقطة: كل schema ملف id cast استلام فتحة واحد موضع (`rpcIdSchema` هو rpc.schema.ts وحيد cast نقطة).

## اتفاق وجه (ApiProxy)

أصل واجهة `ApiProxy = { sessions, host, events, respond }`(`api/index.ts`). جديد client-request مجال = جديد واحد مقابل ملف (`<مجال>.ts` + `<مجال>.schema.ts`)+ أصل واجهة واحد حقل + map إضافة سطر.

### unary طريقة جدول

طريقة عرض مثال واحد سطر (جدول بنية أي قراءة قاعدة):

| method key | طلب payload | إرجاع value | دلالة |
|---|---|---|---|
| `session.list` | `{ cursor?: string }`(cursor إبقاء مقعد لا تنفيذ) | `{ items: SessionSummary[] }` | قد حفظ دائم session،updatedAt قلب ترتيب؛v1 لا بناء بحث جذب |

ذلك بقية طريقة (`session.create`/`session.history`/`session.rename`/`session.prompt`/`session.cancel`/`host.describe`) معامل و إرجاع لا في هذا تكرار كتابة——توقيع أي حق مصدر، رؤية `api/sessions.ts`،`api/host.ts` و `RpcMethodMap`.

### لقطة (server→client، أداة اسم union)

اثنان بند منطق تدفق:mux تدفق (`/api/events.mux`، كل session تجمع دمج) و host تدفق (`/api/events.host`،host درجة حدث). متصفح عبر كل تدفق واحد بند تحت سطر WebSocket إزالة استهلاك، عملية داخل fetch تحميل جسم بـ SSE إبقاء نفس بنية؛ شيء إدارة حد رؤية [WebSocket تحت سطر تحميل جسم](2026-08-04-websocket-downlink-carrier.zh.md). لقطة عرض مثال واحد سطر:

| لقطة type | تحميل حمل | أي وقت إرسال |
|---|---|---|
| `session/event` | `{ sessionId; event: SessionEvent }` | نواة قلب نفاذ نقل:core حدث أصل مثال مرور،`assistant/chunk` أي token تدفق، بلا مستقل delta لقطة |

ذلك بقية لقطة نوع لا في هذا تكرار كتابة،union كل تجميع رؤية `api/events.ts` `MuxFrame`/`HostFrame`. دلالة فوق يجب معرفة ثلاثة نقطة:`session/subscribed` lastSeq توفير history تنافس حالة فحص قياس؛`approval/question` requested لقطة يمكن ينبغي جواب (rpcId مستقر) ،resolved لقطة هو استلام جمع وجه؛`host/agent-error` هو بلا turn موضع live فشل وحيد خروج فتحة.

**نفاذ نقل سجل قاعدة**:wire فوق حدث/رسالة/محتوى كتلة حينئذ هو core نوع (`SessionEvent`/`ContentBlock`) ، لا صنع ثاني طقم DTO؛ نوع مرور `import type` اعتماد سلسلة مباشر بلوغ متصفح.`SessionEventMap` merge-extensible:client مقابل لم معرفة type documented-default(تجاهل اختصار) ، حدث schema إبقاء «دمج قاعدة معلومة غلاف+لم معرفة نوع» فرع——معلومة غلاف ما زال صارم إطار، لا هو حقل درجة passthrough.

### جلسة دلالة (impl جانب تحمل وعد)

- **تاريخ = حدث إعادة تشغيل**: واحد طقم fold(client جانب) ، تاريخ قسم صفحة و live زيادة كمية نفس بند شفرة مسار؛server لا فعل شيء تحويل لقطة ثاني طقم.history **صفحة حد مقابل متساو رسالة حد**(أبدا من رسالة في بين قطع قطع؛ قسم قطعة مع تحديد مسودة رسالة عودة مجموعة) ، ذيل صفحة يحتوي إجراء في partial قسم قطعة.
- **نص التوجيه صلة ربط**: نص التوجيه rpcId مرور MessageSource(`'user-rpc'`) نفاذ نقل دخول `user/message` حدث،client بـ هذا يأخذ مرح مراقبة عودة إظهار تحويل صحيح.
- **إعادة وصل = إعادة بناء**: لا فعل متابعة نقل cursor(`mux` `since` توقيع إبقاء مقعد، نقل تجاهل اختصار) ؛ قطع خط إعادة فتح تدفق + إعادة سحب history؛`subscribed.lastSeq` و history ذيل seq مقارنة مقابل، لديه شق مجددا تكملة سحب مرة.
- **بارد جلسة معالجة التزام دوران كل حق**:`session.history` و `session.fork` مصدر طرف قراءة سوف في لا نيل أخذ Agent حال حال تحت فحص حفظ دائم تخزين، بينما ربط إلى Agent عادي جلسة طريقة (مثل `prompt`) فإن عبر في طريق جدول ذهاب إعادة بعد استعادة جلسة. من جلسة دعم دعم subagent سوف رفض هذا بند عام استعادة مسار، كما مرفق إضافة حالة لا مقابل عميل كشف (`running` قد تغطية).
- **مراجعة دفعة/سؤال جواب**:requested لقطة تلقي إدارة وقت mint مستقر rpcId؛ أولا إلى أولا فوز،host داخل تخزين pending جدول (keyed by rpcId) هو وحيد قطع حكم؛mux إعادة فتح بعد في subscribed لقطة بعد إعادة تشغيل ما زال pending requested لقطة (rpcId أصل مثال إعادة استخدام، تحديث جديد استعادة). مراجعة حساب حدث `approval/asked`/`decided` وفق قديم مشي durable سجل——لقطة=live تحكم وجه، حدث=durable مراجعة حساب.**الآن حالة**: اتفاق و لقطة نوع قد shipped،host جانب pending جدول/wire answerer لم تنفيذ (`api-proxy.ts` `respond` هو stub، ثابت عودة `not-pending`) ؛PendingCard v1 فقط عرض.
- **لا ضبط بروتوكول إصدار**:client و host ربط إصدار،`host.describe` بلا protocolVersion حقل؛ ظهور مستقل إصدار client وقت مجددا جذب دخول.
- **مسبق إبقاء طريقة سجل قاعدة**:map فقط يحتوي قد تنفيذ طريقة، لم معرفة method في معلومة غلاف parse أي fail loud(`bad-request`) ، لا ضبط not-implemented التقاط قاع رمز. مسبق إبقاء بيان (تنفيذ وقت يأخذ توقيع نسخ دخول مجال واجهة+map إضافة سطر+schema إضافة مقابل أي رفع إطار):`session.fork`،`prompt.mode` إضافة `'inject'`،`task.list`،`host.listModels`،describe إضافة `hostInstanceId`.(`session.rename` قد من هذا بيان انتهاء عمل: إلحاق user مصدر `session/title` حدث.)

## عميل تحميل جسم:AbstractApiClient صنف جسم نظام (`fetch/client.ts`)

**بروتوكول ثابت كمية إقامة أساس صنف، منصة فرق مختلف هو اثنان عدد قطع وجه**: سحب كائن طريقة `doFetch(url, init)`(نقل)+ يمكن تغطية كتابة `onEnvelope`(مراقبة قياس).

### IApiClient:caller عرض

و `ApiProxy` نفس مجال شجرة، لكن unary طريقة**استلام عمل خدمة payload مباشر نقل**——تحميل جسم mint rpcId و حزمة معلومة غلاف، عمل خدمة شفرة دائم لا mint؛ حاجة هذا مرة استدعاء rpcId من إرجاع `RpcResponse` عودة إظهار داخل قراءة.`ApiProxy` هو impl جانب تنفيذ ضيق شكل توقيع اتفاق،`IApiClient` هو client جانب إزالة استهلاك payload مباشر نقل عرض،`AbstractApiClient` جسر وصل اثنان من. طريقة تدريجي key من `RpcMethodMap` إرسال توليد——map إضافة سطر أي آلة آلة تحديث.

### أساس صنف يحتفظ بروتوكول مسار

| مسار | محتوى |
|---|---|
| `callUnary` | mint → tap → POST كل شكل → `serverResponseSchema` parse → **rpcId عودة إظهار تحقق**(لا رمز أي throw)→ tap → إخراج ضيق شكل |
| `readSse` | streaming fetch(غير EventSource) ،`\n\n` قسم لقطة،`data:` تجميع وصل،ServerRequest كل شكل parse،tap، إخراج ضيق شكل `RpcRequest<لقطة>` |
| `respond` | client-response نفاذ نقل (rpcId هو عودة ملء، هذا موضع لا mint) ؛ ينبغي جواب جسم `rpcReceiptSchema` parse |
| unary وقت حد | عادي unary استدعاء استخدام `AbortSignal.timeout`(افتراضي 30s، بنية صنع معامل يمكن ضبط) ؛ من مستخدم كف تحكم عقدة عزف `host.pickDirectory` و `command.execute` لا ضبط هذا وقت حد، لكن إبقاء استدعاء جهة/اتصال إلغاء؛ تدفق لا ضبط وقت حد |
| `resolveBase` | متصفح=نفس مصدر origin؛ بلا location بيئة (Node)=`http://dsh.internal` زائف authority |

### نسخة درجة envelope مراقبة قياس قطع وجه

أربعة كائن حد كل شكل متساو مرور `onEnvelope`؛ أساس صنف تنفيذ هو**نسخة يحتفظ دقيق مهمة دمج دفعة مؤقت اندفاع**(لقطة ريح كشف لا تدريجي لقطة مفاجأة إزعاج مستهلك؛ وحدة درجة حالة سوف عبر نسخة/اختبار تسرب تسرب، لذا نسخة يحتفظ). مراقبة قياس من مرور `subscribeEnvelopes(listener)` حجز قراءة (استلام كامل دفعة `readonly RpcMessage[]`، إرجاع تراجع حجز دالة) ؛listener رمي استثناء يتم عزل (مراقبة قياس لا نيل عكس التهام تحميل جسم). بلا حجز قراءة من وقت صفر مؤقت اندفاع صار هذا. لا يوجد أي قد تسليم مستهلك حجز قراءة——هذا قطع وجه هو wire تشخيص مسبق إبقاء موضع (قد تراجع دور RPC ضبط تجربة وجه لوح هو هو أول عدد مستهلك، سوف قدوم تشخيص مستهلك وصل دخول وقت لا حركة تحميل جسم).

### فرعي صنف جدول (نقل تحمل تحميل)

| فرعي صنف | الذي في حزمة | doFetch | استخدام طريق |
|---|---|---|---|
| `InProcessApiClient` | apiproxy هذه الحزمة | حقن `{ fetch }` handler | **نفس بنية نقطة**:`new InProcessApiClient(toFetchHandler(api))` كل مسار لا مرور شبكة شبكة لكن حق ركض wire تسلسل تحويل/zod/SSE لقطة؛ تحميل جسم اختبار و استدعاء جهة يمكن في لا فتح طرف فتحة حال حال تحت تشغيل هذا طقم بروتوكول، بينما منتج `dsh --profile headless` مباشر قيادة core |
| `WebApiClient` | dsh-client-connection | `globalThis.fetch` فوق سطر + كل منطق تدفق واحد بند نفس مصدر WebSocket تحت سطر | متصفح عميل؛ شيء إدارة حد رؤية [WebSocket تحت سطر تحميل جسم](2026-08-04-websocket-downlink-carrier.zh.md) |
| `FixtureApiClient` | dsh-client-connection | لا استخدام (بروتوكول طبقة تغطية كتابة) | بلا server UI تطوير (`?fixture`): تغطية كتابة `callUnary`/`openMux`/`openHost`/`respond` وهمي طريقة، ذاتي ذات حينئذ هو زائف server(لقطة rpcId من هو mint، دلالة ذاتي توافق) |
| IPC جسر فرعي صنف (زائف تفكير عرض مثال——بعد بلا هذا شكل) | Electron قشرة | IPC تسلسل تحويل نحو إرجاع | فقط يحتاج تبديل doFetch، اتفاق/أساس صنف صفر تعديل |

## كيف ما توسيع (عملية بيان)

**إضافة واحد unary طريقة (5 خطوة)**:①مجال واجهة إضافة طريقة توقيع (معامل/إرجاع داخل ربط، هذا هو وحيد حق مصدر) ؛②`RpcMethodMap` إضافة واحد سطر؛③`<مجال>.schema.ts` إضافة request/value schema مقابل (مرساة `Wire<RequestPayload<'…'>>`) ؛④handler `UNARY_ROUTES` إضافة واحد سطر (handler Web تحمل تحميل رؤية Web عميل هيكل بنية قلم تسجيل) ؛⑤impl تنفيذ (عودة إظهار `request.rpcId`).client جانب `IApiClient`/`AbstractApiClient` مجال طريقة جدول تزامن إضافة واحد سطر نفاذ نقل.

**إضافة واحد لقطة نوع (3 خطوة)**:①`MuxFrame`/`HostFrame` union إضافة واحد دعم (يمكن ينبغي جواب لقطة يجب ملاحظة واضح rpcId مستقر دلالة) ؛②لقطة schema إضافة واحد دعم؛③مستهلك fold/توجيه documented-default قد التقاط قاع لم معرفة نوع، حسب يحتاج إضافة صريح فرع.

**إضافة واحد رمز خطأ (2 خطوة)**:①`RpcErrorDetailsMap` إضافة واحد سطر (details لا بد ملء) ؛②`rpcErrorSchema` discriminatedUnion إضافة واحد دعم.

**وصل واحد نوع جديد تحميل جسم**: وراثة `AbstractApiClient` فقط تنفيذ `doFetch`؛ حاجة اعتراض قطع بروتوكول طبقة (مثل fixture(اختبار قبل وضع بيانات)) مجددا تغطية كتابة `callUnary`/`openMux`/`openHost` وهمي طريقة. اتفاق و أساس صنف صفر تعديل.

**رفع إطار واحد مسبق إبقاء طريقة**: يأخذ مسبق إبقاء توقيع نسخ دخول مجال واجهة → map إضافة سطر → schema إضافة مقابل → UNARY_ROUTES إضافة سطر → impl تنفيذ.

## Consequences

كل client استخدام نفس اتفاق: إضافة واحد unary طريقة هو من مفرد واحد توقيع خروج إرسال خمسة خطوة آلة آلة تعديل، تبديل تحميل جسم فقط حركة واحد `doFetch` فرعي صنف،wire فوق كل بند رسالة يمكن zod تحقق، يمكن مرور envelope tap مراقبة قياس، يمكن حسب rpcId مقابل حساب. عادي unary استدعاء ما زال تلقي وقت حد قيد، بينما `host.pickDirectory` و `command.execute` يمكن إبقاء تعليق بدء، مباشر إلى عملية إتمام أو استدعاء جهة/اتصال إلغاء إلى قدوم؛ إذا من مستخدم كف تحكم عقدة عزف عملية لا ذاتي سطر انتهاء، طلب ممكن واحد مباشر تعليق بدء، هذا هو لـ تجنب تجنب يأخذ دمج إدارة عملية وقت طويل نظر لـ نقل فشل بينما قبول بديل قيمة. ذلك بقية قبول بديل قيمة: اثنان مجموعة حزمة حاجة صريح tsconfig paths بند؛ مسبق إبقاء طريقة (fork/inject/task.list/listModels/hostInstanceId) في حقيقي مستهلك ظهور قبل إبقاء راحة نوم.

## Alternatives considered

| وضع ترك بند | واحد جملة كلام إدارة من |
|---|---|
| حسب منتج قسم حزمة (web واحد عائلة،electron واحد عائلة) | منتج مشترك هو host/client اثنان جانب قدرة، بينما لا هو بعض عدد تطبيق تنفيذ؛ قدرة مزود قسم طبقة يجعل جديد تطبيق صفر جديد حزمة |
| خلط دمج جسم بناء حزمة (مثل headless مستقل حزمة) | خلط دمج جسم فقط لديه واحد مستهلك (هو ذاتي ذات app) ، بناء حزمة هو بلا رئيسي سحب كائن؛ تجميع تركيب كتابة في app داخل يمكن قراءة يمكن ترك |
| إزالة استهلاك نوع client مباشر وصل ctx(حذف apiproxy واحد طبقة) | client حاجة wire تحقق، مراقبة قياس و كثير client متسق صفة. مباشر headless هو لا يوجد client حد محلي مدخل، استخدام عام Agent/Session seam، بينما لا هو client أمر وجه |
| webserver اعتماد runtime(حذف handler حقن) | بنية typing حقن يجعل webserver يمكن يتم sidecar/اختبار إعادة استخدام كما صفر workspace اعتماد؛ حزمة اعتماد سوف يأخذ تركيب إعداد معرفة تعرف سحب دخول تحمل تحميل طبقة |
| حزمة اسم لا حمل مجموعة بادئة (امتداد استخدام dsh-<ذيل مقطع>) | `dsh-runtime`/`dsh-web-ui` في مسطح مستو npm نطاق الأسماء داخل فقد ذهاب ملكية معلومة؛ بديل قيمة فقط هو كل حزمة واحد بند صريح paths |
| إعادة استخدام مستودع داخل JSON-RPC 2.0(dsh-sdk-jsonrpc-server) | عدد حرف رمز خطأ تراجع تحويل صار مفرد رمز التقاط قاع، اتفاق مزدوج نسخة شخص لحم مقابل متساو، تسمية بلا convention ذاتي لكن عائم نقل |
| ثلاثة معلومة غلاف نموذج (Request/Response/Frame كل واحد معلومة غلاف، توقيع لا شعور معرفة جهة نحو) | rpcId هو منطق طبقة صلة ربط، لقطة و ينبغي جواب جهة نحو دلالة اعتماد عبر طريق دفع قطع في تبديل تحميل جسم وقت أي بطلان |
| أداة اسم Request/Response نوع مقابل لـ حق مصدر (map تسجيل تسجيل نوع مقابل) | مستو فرش أداة اسم نوع هو نفس واقع ثاني عدد اسم حرف؛ توقيع infer عكس دفع يجعل إضافة طريقة فقط تعديل واحد موضع |
| REST ريح إطار مسار | مستهلك هو ذاتي بيت client، بلا رقم ثلاثة جهة REST تجربة إبلاغ طلب؛RPC مباشر عكس طريقة جدول أكثر آلة آلة |
| DTO طبقة (wire مخصص استخدام ثاني طقم بنية) | core نوع type-only مباشر بلوغ متصفح صفر صار هذا؛DTO هو دائم دائم مزدوج نحو تزامن ضريبة |
| cursor متابعة نقل (mux since فعلي تركيب) | إعادة وصل=إعادة بناء (opencode نفس بند) تغطية v1 الكل يحتاج طلب؛ توقيع إبقاء مقعد، فعلي تركيب انتظار حقيقي مستهلك |
| createApiClient عمل مصنع دالة (أصل تنفيذ) | منصة فرق مختلف (نقل/مراقبة قياس) هو وراثة قطع وجه لا هو معامل؛ صنف جسم نظام يجعل fixture في بروتوكول طبقة استبدال بينما لا هو حزمة واحد طبقة زائف معلومة غلاف |
| مقابل `command.execute` تطبيق 30 ثانية نقل وقت حد | أمر استهلاك وقت يخص عملية ذاته، بينما غير نقل سليم سليم ميزانية؛ هذا وقت حد سوف إنهاء هذا ينبغي متابعة تشغيل طويل وقت معالج، استدعاء جهة/اتصال إلغاء قد توفير الذي يحتاج إيقاف مسار |

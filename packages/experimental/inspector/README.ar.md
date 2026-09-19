---
description: "موجه إلى Host و متصفح Client Cordis وقت التشغيل فعلي تحقق صفة Chrome DevTools فحص، يشمل Console طلب قيمة،Sources،Network أخذ تجميع،Elements شجرة و مستقل في CDP استعلام API."
kind: "package-reference"
---

# @deepseek-ai/dsh-experimental-inspector

[English](README.md) | العربية

## عام وصف

استخدام هذا عدد فعلي تحقق صفة Inspector، يمكن في Chrome DevTools في فحص واحد تشغيل في dsh Host و ذلك متصفح Client. هو توفير Host و Client Console context،Host Sources و ضبط تجربة،Host fetch أخذ تجميع و مشترك Cordis شجرة، و يجعل Worker وحيد احتلال الكل CDP حالة.

هذه الحزمة بـ فعلي تحقق صفة اسم إصدار، حاجة صريح تركيب.Worker لا وصول فوري Cordis كائن؛ مشترك Host/Client collector سوف في نقل قبل يأخذ هو جمع إسقاط صار قد تحقق لقطة.Cordis أيضا مسؤول إضافة تركيب، تسجيل `ctx.inspector`، حقن bootstrap و dispose(مورد تحرير).

## دليل

- [وقت التشغيل تخطيط](#runtime-layout)
- [إعداد](#configuration)
- [مراقبة قياس API](#observation-api)
- [Cordis شجرة فحص](#cordis-tree-inspection)
- [Host fetch أخذ تجميع](#host-fetch-capture)
- [أمان](#security)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="runtime-layout"></a>
## وقت التشغيل تخطيط

Host إضافة بدء Worker و اتصال مخصص استخدام `MessagePort`.Client إضافة قراءة حقن `globalThis.__DSH_INSPECTOR__` bootstrap، مباشر نحو Worker فتح واحد بند مستقل، حمل تمييز حق WebSocket.Chrome DevTools اتصال Worker CDP WebSocket. كل بند DevTools اتصال في Worker في وحيد احتلال واحد اتصال Host رئيسي خط مسار `node:inspector.Session`، لذلك Host JavaScript مؤقت توقف وقت،Host Console طلب قيمة،Sources، قطع نقطة و resume ما زال متاح.

شفرة المصدر شجرة التزام دوران هذه تنفيذ بيئة:`client/` و `host/` توفير مرآة مثل مهايئ entry path،`worker/` فقط يتضمن Worker thread orchestration و Chrome protocol حالة،`shared/` يتضمن و بيئة غير متصل Cordis و network model، مواصفة تحويل realm خلفية واجهة و داخلي bridge protocol.Worker جانب Client و Host مهايئ مرآة مثل وضع في `worker/realms/` تحت؛ منها Client مهايئ ما زال في Worker في تنفيذ.

Host و Client producer إرسال داخلي مراقبة قياس سجل، لا إرسال CDP رسالة. سجل يتضمن source generation،sequence،source وقت ساعة وقت،topic و JSON payload.Worker تحقق كل عملية أو شبكة شبكة لقطة، وحيد احتلال source حالة و إبقاء تاريخ، و يأخذ قد تعرف آخر topic تحويل صار معيار CDP domain.

Client source إعلان نوع تحويل Runtime،Console و فقط قراءة Sources قدرة.`Runtime.enable` إصدار حقيقي Host execution context، و لـ كل قد اتصال Client source إصدار واحد synthetic context. اختيار Client context بعد، طلب قيمة، خاصية قراءة، دالة استدعاء،Promise await و كائن تحرير كل سوف توجيه إلى هذا متصفح realm.Client Console argument استخدام نفس نسخة جلسة محلي object table؛`Debugger.enable` إصدار بناء بعد `lib/client.js` catalog،`Debugger.getScriptSource` قراءة محدود content chunk.Client script قطع نقطة،step و call frame ما زال لا دعم حمل؛target-wide pause و resume فقط تحكم Host debugger.

اثنان عدد إضافة طرف تشغيل نفس نسخة يمكن في متصفح في أمان تشغيل Cordis collector. هو يأخذ يمكن بلوغ Context و Fiber كائن تحويل صار لديه إصدار `CordisTreeSnapshot`؛Worker تخزين هذا نسخة و CDP غير متصل يمثل، و يأخذ كل Host أو Client source إسقاط إلى Elements وجه لوح.

<a id="configuration"></a>
## إعداد

Host إضافة حقن `webServer`، قبول التالي حقل:

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---:|---|
| `host` | `127.0.0.1` | Worker endpoint استماع عنوان؛ فقط قبول loopback |
| `port` | `9230` | Worker endpoint بدء بداية طرف فتحة؛ طرف فتحة احتلال استخدام وقت نحو فوق تمرير زيادة،`0` يمثل من عملية نظام قسم إعداد |
| `clientOrigins` | `[]` | `/ingest` مقدار خارج قبول دقيق متصفح origin؛loopback origin بداية نهاية سماح |
| `captureFetch` | `true` | حزمة تركيب `globalThis.fetch` تزامن نشر بعد كل مرة استدعاء |
| `maxRequestBodyBytes` | 8 MiB | كل مرة طلب إبقاء request body بادئة |
| `maxResponseBodyBytes` | 32 MiB | كل مرة طلب إبقاء response body بادئة |
| `maxBodyChunkBytes` | 48 KiB | base64 تحرير رمز قبل واحد بند body سجل يحمل أصلي بايت عدد |
| `maxJournalBytes` | 256 MiB | Worker إبقاء طلب و استجابة body مجموع بايت عدد |
| `maxRetainedRequests` | `2000` | Worker إبقاء إجراء في و قد إتمام طلب مجموع عدد |
| `maxSourceFrameBytes` | 128 KiB | تحرير رمز بعد source frame حد أعلى |
| `maxSourceRecordsPerFrame` | `128` | كل source batch سجل عدد |
| `maxQueuedRecords` | `2048` | كل producer انتظار إرسال سجل عدد |
| `maxQueuedBytes` | 16 MiB | كل producer انتظار إرسال تحرير رمز بايت عدد |
| `startupTimeoutMs` | 10 ثانية | Worker ready قطع توقف وقت |
| `stopTimeoutMs` | 5 ثانية | قوي صنع إنهاء قبل Worker أفضل أنيق إغلاق مدة حد |
| `clientReconnectBaseMs` | 250 ms | Client أول مرة إعادة وصل تراجع تجنب حد أعلى |
| `clientReconnectMaxMs` | 5 ثانية | Client الأكثر كبير إعادة وصل تراجع تجنب حد أعلى |
| `clientRuntimeTimeoutMs` | 30 ثانية | مرة Worker إلى Client Runtime أو Sources أمر قطع توقف وقت |
| `queryTimeoutMs` | 10 ثانية | مرة غير CDP دلالة استعلام قطع توقف وقت |
| `maxClientRuntimeObjects` | `10000` | كل بند DevTools اتصال إبقاء Client فوري كائن handle عدد |
| `maxClientRuntimeProperties` | `2000` | مفرد مرة Client كائن فحص إرجاع خاصية وصف رمز عدد |
| `maxClientSourceBytes` | 8 MiB | مفرد عدد Client script أو source map سماح قراءة الأكثر كبير تحرير رمز بايت عدد |
| `maxCordisNodes` | `2048` | واحد realm لقطة قطع قطع قبل سماح Context و Fiber عقدة عدد |
| `maxDisconnectedCordisTrees` | `8` | بصفة غير فوري لقطة إبقاء الأكثر قريب قطع ربط realm شجرة عدد كمية |

توليد[إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-experimental-inspector) هو الكل قد قبول حقل و ذلك إعلان تفصيل كل مصدر.

Worker استماع بعد،Host سوف سجل واحد `devtools://` URL. نفس عدد Worker توفير `/json`،`/json/list`،`/json/version`،`/devtools/page/<id>` target WebSocket و `/ingest` Client source.

<a id="observation-api"></a>
## مراقبة قياس API

اثنان عدد إضافة طرف كل توفير نفس عدد خدمة:

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { InspectorJsonValue } from '@deepseek-ai/dsh-experimental-inspector'

declare const ctx: Context
declare const topic: string
declare const jsonPayload: InspectorJsonValue

ctx.inspector.publish(topic, jsonPayload)
await ctx.inspector.cordis.getTree()
```

إصدار عملية أولا تحقق بلا ضرر JSON، مجددا ضبط درجة إرسال، لا انتظار Worker. كل source طابور صف كل لديه حد أعلى؛ فيض خروج جدول الآن لـ sequence gap، أبدا تأخير متأخر يتم مراقبة تطبيق عملية.`cordis.getTree()` قراءة Worker الأكثر جديد detached semantic لقطة، لا إنشاء CDP جلسة، أيضا لا تفعيل Runtime،Debugger أو Sources.

<a id="cordis-tree-inspection"></a>
## Cordis شجرة فحص

Elements document يتضمن ثابت `<host>` و `<clients>` حاوية.`<host>` يتضمن Host root Context؛`<clients>` لـ كل Client source يتضمن واحد `<client>`، كل `<client>` مجددا يتضمن هذا realm أصل Context.Cordis root Fiber لا عرض. أخرى Fiber كل هو `fiber.parent` فرعي عقدة، و يتضمن وحيد واحد يمثل `fiber.ctx` Context فرعي عقدة؛Fiber فقط يحمل `uid="<Cordis Fiber.uid>"`،Context element لا يحمل attribute. فقط لديه Context `extend()`،`isolate()` و `intercept()` طبقة ما زال هو مباشر Context بعد بديل.

Host و Client إصدار نفس نوع تضمين طقم `CordisTreeSnapshot` نوع.Context و Fiber عقدة يحمل لأجل realm-local كائن استعلام لا نفاذ واضح object جملة مقبض؛Fiber أيضا يحمل Cordis `uid`.Worker يأخذ هذه realm لقطة تركيب صار واحد شجرة `{ host, clients }` inspection tree.Worker حسب source generation قسم إعداد `BackendNodeId`؛ كل بند DevTools اتصال قسم إعداد ذاتي ذات `NodeId`؛`DOM.resolveNode` طلب الذي تابع Host أو Client Runtime توليد اتصال محلي `RemoteObjectId`.`DOM.requestNode` يأخذ هذا object id خريطة عودة نفس عدد Elements عقدة.`ctx.inspector.cordis.getTree()` و `DSHInspector.getCordisTree` قراءة لا يحتوي routing جملة مقبض أو CDP id detached مستهلك غير متصل tree.

عقدة حسب DevTools اتصال فعل عميق درجة تلقي حد تحت إرسال: استدعاء جهة حذف `depth` وقت `DOM.getDocument` توفير ثلاثة طبقة document، يتم خصم إبقاء طبقة درجة عبر `childNodeCount` إعلان عدد كمية، توسيع وقت مرور `DOM.requestChildNodes` نيل أخذ (`depth: -1` أخذ كامل شجرة فرعي شجرة). مرور `DOM.performSearch`،`DOM.requestNode` أو `DOM.pushNodesByBackendIdsToFrontend` تدفق خروج NodeId سوف أولا يأخذ بعد لم تحت إرسال أصل أولا طبقة درجة بـ `DOM.setChildNodes` حدث دفع إرسال خروج ذهاب.

source ما زال إصدار كامل snapshot،Worker في إشعار DevTools قبل حسب مستقر backend node identity مقارنة مقارنة فرق مختلف. بلا تغير snapshot لا إرسال DOM حدث؛ إضافة جديدة، إزالة و attribute تغير استخدام عقدة درجة CDP حدث، إدراج دخول عقدة تحميل حمل خصم إبقاء ذلك فرعي شجرة، أخ أخ عقدة إعادة ترتيب فقط استبدال مقابل parent children. قائم `NodeId` و لم تلقي أثر Elements توسيع حالة إبقاء مستقر.

Client قطع ربط وقت، ذلك Console execution context و live object id سوف قيام أي إلغاء تدمير. تفعيل قطع ربط شجرة إبقاء بعد،Elements سوف أصل مثال إبقاء الأكثر بعد واحد شجرة شجرة؛ اتصال حالة إبقاء في inspection model في، لن لم مرور مراجعة فحص حينئذ يصبح DOM attribute. إعادة وصل سوف امتداد استخدام منطق source id، لـ جديد transport generation إنشاء جديد synthetic CDP context id، و في كامل snapshot وصول بعد استبدال قديم شجرة.Client يأخذ منطق id حفظ في `sessionStorage` في، و عبر Web Locks في صفحة تخزين نشط خلال وحيد احتلال هذا id، لذلك تحديث جديد سوف إعادة استخدام id، بينما نسخ خروج آخر عدد live tab سوف أخذ نيل جديد id.Worker الأكثر كثير إبقاء `maxDisconnectedCordisTrees` شجرة هذا صنف snapshot؛ ضبط لـ صفر سوف قيام أي إزالة.

<a id="host-fetch-capture"></a>
## Host fetch أخذ تجميع

fetch أخذ تجميع افتراضي فتح بدء، سجل كامل URL، الكل طلب و استجابة headers، طلب جسم، استجابة جسم، حالة، وقت، خطأ و إلغاء. هو لا انفصال حساس credential،Cookie،query value أو payload.body أخذ تجميع قراءة clone؛ أصلي fetch resolve بعد، استدعاء جهة قيام أي أخذ إلى أصلي Response.

إعداد body حد أعلى حد إبقاء كمية، بينما لا اختيار حقل: أخذ تجميع إبقاء بادئة و علامة truncated.`Network.getRequestPostData` و `Network.getResponseBody` قراءة Worker إبقاء بايت.`Network.streamResourceContent` إرجاع قد مؤقت اندفاع بادئة، و فقط لـ إرسال بدء استدعاء DevTools اتصال يأخذ لاحق response بايت مرفق إضافة إلى `Network.dataReceived`، بـ قيادة فوري Response و EventStream عرض. مباشر استدعاء Undici Client/Dispatcher، و إضافة تنشيط قبل حفظ fetch مرجع، لا في مراقبة نطاق داخل.

response headers وصول بعد، استدعاء جهة abort ممكن سوف إنهاء observer clone؛ قد أخذ تجميع بايت ما زال يمكن عبر `Network.getResponseBody` قراءة، أخذ تجميع metadata سجل خطأ و قطع قطع، و كما CDP بسبب fetch قد إرجاع Response بينما إرسال `Network.loadingFinished`.response headers وصول قبل حدوث fetch rejection سوف إرسال `Network.loadingFailed`، منها abort مقابل `canceled: true`.

<a id="security"></a>
## أمان

CDP target عبر `Runtime.evaluate` توفير Host و قد اتصال Client realm في مهمة معنى شفرة تنفيذ قدرة،Host Debugger عملية أيضا سوف توفير مقدار خارج تحكم، كامل fetch أخذ تجميع أيضا يتضمن حساس شعور معلومة. لذلك Worker فقط قبول `127.0.0.1` استماع عنوان.Client ingest أيضا اشتراط Host حقن مع آلة WebSocket subprotocol token؛ حذف غير إعداد واضح سماح، لا فإن رفض غير loopback origin.CDP socket ذاته لا يحمل token،loopback استماع هو هو وحيد وصول تحكم.

<a id="model-experience"></a>
## تجربة النموذج

بلا: هذا عدد فقط توفير تطوير من استخدام Inspector فقط مراقبة وقت التشغيل نشط حركة، لا تغيير نموذج طلب.

#### KV Cache أثر

بلا: هذه الحزمة حيث لا تجميع أيضا لا إرسال مزود طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **Client active debugging لا تلقي دعم حمل**——Console event،Runtime طلب قيمة،RemoteObject وصول و فقط قراءة `lib/client.js` Sources متاح.Client script debugger request إرجاع واضح unsupported error؛target-wide pause و resume فقط تحكم Host.
- **Client Sources فقط كشف Inspector bundle**——هذه الحزمة لا استلام تسجيل صفحة في أخرى script.
- **Client طلب قيمة استخدام صفحة JavaScript**——صفحة Content Security Policy ممكن منع توقف حركة حالة طلب قيمة؛synthetic context لا توفير DevTools command-line helper أو أصلي REPL إعلان دلالة.
- **Client هوية وسيط قطع اعتماد Web Locks**——نقص قليل هذا API متصفح ما زال سوف عبر `sessionStorage` إبقاء إعادة وصل و تحديث جديد هوية، لكن لا يمكن منطقة قسم من نفس تخزين حالة نسخ خروج اثنان عدد معا تخزين نشط tab.
- **fetch اعتراض قطع نطاق هو `globalThis.fetch`**——مباشر استدعاء Undici API، و تنشيط قبل حفظ fetch مرجع لن يتم مراقبة.
- **body clone لديه تشغيل صار هذا**——كامل أخذ تجميع سوف tee طلب و استجابة تدفق، مباشر حتى بلوغ إلى إعداد حد أعلى، ممكن زيادة داخل تخزين و I/O ضغط قوة. إبقاء body حد أعلى لا يتضمن تدفق tee داخلي مؤقت اندفاع، يشمل مصدر توفير تجاوز كبير chunk، أو لـ قراءة مقارنة بطيء تطبيق فرع ترتيب طابور بيانات.
- **لا تلقائي إعادة بدء Worker**——Worker معنى خارج خروج سوف جعل حالي Inspector نسخة فشل؛ دورة الحياة استعادة إبقاء انتظار لاحق تعديل.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل.wire تحليل،generation،Worker دورة الحياة و CDP جلسة سوف في الذي تابع عملية في رفض بلا فاعلية علاقة.

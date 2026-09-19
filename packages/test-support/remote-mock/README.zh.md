---
description: "Typert Remote تدفق كمية طرف نقطة أداة اسم mock: واحد عنصر ينبغي جواب و تدفق نص برمجي جدول، نشط تدفق تحكم، سجل و Connection تحميل جسم وجه، توفير اختبار عمل من في لا يوجد Host حال حال تحت بدء حقيقي متصفح عميل."
kind: "package-library"
---

# @deepseek-ai/dsh-remote-mock

[English](README.md) | العربية

## عام وصف

`dsh-remote-mock` يجعل اختبار عبر `mock.remote.<namespace>.<method>`، استخدام أصلي Vitest mock طريقة إعداد Host استجابة. نفس مجموعة دالة ينبغي جواب مباشر استدعاء و حقيقي Connection تدفق كمية؛ يمكن إعادة استخدام جدول توفير افتراضي استجابة، صريح إعلان تدفق دعم حمل اختبار قيادة دفع لقطة و إلغاء. نقص قليل استجابة وقت استدعاء فشل،`assertNoUnmatched()` سوف في استلام ذيل وقت مجددا مرة تقرير إبلاغ. هذه الحزمة بلا حاجة عمل خدمة Host يكفي في Node أو متصفح صفحة في تشغيل، لا استيراد DOM،React أو Node وحدة، فقط من `devDependencies` إزالة استهلاك.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

### أي وقت استخدام

عند اختبار يلزم بدء و `ctx.remote` محادثة حقيقي عميل إضافة، و تفكير حسب طرف نقطة اسم نص برمجي تحويل Host جانب وقت استخدام هو: كامل جسم عميل اختبار يأخذ `mock.rpc` ربط إلى كل منها Connection نسخة، اختبار وحدة أيضا يمكن مباشر استدعاء `mock.remote`،`dispatch` أو `open`. طرف نقطة هو Gateway wire اسم (`session/page`،`settings/describe`) ؛`args` هو استدعاء جهة موضع معامل قائمة، نهاية ذيل `AbortSignal` قد تقشير إسقاط؛ قيمة حينئذ هو اختبار تسجيل تسجيل شرق غرب، أصل مثال ينبغي جواب. وحيد إعلان هو طرف نقطة هو واحد عنصر (`unary`) أيضا هو تدفق (`stream`).

<a id="remote-proxy"></a>
### استخدام Remote Proxy

`mock.remote` بلا حاجة طريقة بيان أو مجال مخصص تابع Helper يكفي توفير كل نطاق الأسماء و طريقة. كل وصول مرور طرف نقطة استخدام ذاكرة مؤقتة أصلي Vitest mock؛`@vitest/spy.fn` حينئذ هو `vi.fn` خلف بعد تنفيذ، أيضا قدرة في لا يوجد Vitest runner متصفح صفحة في تشغيل. نفس عدد mock ينبغي جواب مباشر استدعاء و Connection تدفق كمية، لذلك قيمة راجعة تغطية و استدعاء تأكيد مراقبة هو عميل فعلي استدعاء دالة:

```text
const mock = RemoteMock.create().load(remoteDefaultResponses)
mock.remote.settings.describe.mockResolvedValue(ok({
  writable: true, hasDocument: false, namespaces: [],
}))
mock.remote.settings.mutate.mockResolvedValueOnce(ok(updatedNamespace))
// After the client writes:
expect(mock.remote.settings.mutate).toHaveBeenCalledWith('locale', operations, revision)
```

استخدام `mockResolvedValue` ضبط حمل متابعة استجابة، استخدام `mockResolvedValueOnce` أو `mockReturnValueOnce` ترتيب طابور ضبط استجابة، استخدام `mockImplementation` حسب معامل قرار سلوك. أصلي طابور صف حسب تسجيل تسجيل ترتيب إزالة استهلاك استجابة، استهلاك كل بعد من mock حالي تنفيذ ينبغي جواب؛ ابتدائي تنفيذ قراءة قد تسجيل تسجيل افتراضي استجابة.`mockClear()` إبقاء استجابة و طابور صف؛`mockReset()` صاف حذف تغطية و استعادة ابتدائي تنفيذ، من هو قراءة الأكثر جديد افتراضي استجابة. إذا لم إعداد افتراضي استجابة، ترتيب طابور استجابة استهلاك كل بعد ما زال سوف فشل، يشمل ممكن تزامن رمي خطأ مباشر استدعاء.

فقط لديه صريح `stream()` أو استجابة جدول في تدفق إعلان عندئذ اختيار تدفق طريقة؛ ذلك بقية متساو استخدام واحد عنصر mock. وصول طريقة لن سند فارغ بنية صنع نجاح عمل خدمة نتيجة. حفظ طريقة مرجع قبل أولا إعلان تدفق نمط: كل طرف نقطة/نمط يملك كل منها mock. نطاق الأسماء و طريقة `then` استكشاف قياس و symbol قراءة متساو بلا فرعي أثر.

`MockedRemote` استخدام Vitest عميق طبقة mock نوع تحويل، تغطية كامل توليد `TypertRemoteNamespaceMap`. غير فارغ خريطة إبقاء نطاق الأسماء و طريقة اسم، معامل، قيمة راجعة و أصلي spy نوع. خريطة لـ فارغ وقت فقط لديه هذا عدد اختبار Proxy تغيير صار `any`، سماح مهمة معنى نطاق الأسماء و طريقة؛ هو لا زيادة تكملة أو ضعيف تحويل إنتاج Remote إعلان. لا حاجة نسخ طريقة توقيع، كبح صنع اختياري توليد وحدة خطأ أو فتح بدء تحرير ترجمة جهاز درجة عام Flag. تسليم Remote/mock تعديل قبل تشغيل `pnpm run typecheck`، توليد و فحص حقيقي Client نوع؛ إعلان ناقص، قديم قديم أو لا كامل وقت أولا إعادة بناء. بلا بناء اختبار عبر أو دفع قطع لـ `any` كل لا هو صارم إطار نوع دليل.

### تسجيل تسجيل افتراضي استجابة

`load(table)` تثبيت يمكن إعادة استخدام `unary` قيمة أو handler،`stream` نص برمجي و بلا نص برمجي `streams` إعلان.`unary(endpoint, value)` و `unary(endpoint, fn)` تسجيل تسجيل مفرد عدد افتراضي استجابة؛handler استقبال استدعاء جهة موضع معامل، و استخدام قائم طلب نوع. كل طرف نقطة فقط حفظ الأكثر جديد افتراضي استجابة، يشمل صريح `undefined`؛ تحديث افتراضي استجابة لن صاف حذف أصلي تغطية.`ok(value)` بنية صنع `{ ok: true, value }`؛ فشل استخدام `{ ok: false, error: { code, message, details } }`. لديه حالة handler،promise و أصلي طابور صف متساو من كل اختبار مستقل يحتفظ:

```text
const initial = { writable: true, hasDocument: false, namespaces: [] }
const mock = RemoteMock.create().load({
  unary: { 'settings/describe': ok(initial) },
})
mock.remote.settings.describe.mockResolvedValueOnce(ok({ ...initial, hasDocument: true }))
```

### قيادة قيادة تدفق

تدفق نص برمجي هو واحد استقبال فتح وقت `args` و `StreamHandle`(`push`،`end`،`fail(error)`،`signal`) دالة؛ نص برمجي إرجاع بعد تدفق إبقاء فتح، مباشر إلى جملة مقبض انتهاء أو فشل.`frames(items)` بنية صنع إخراج تمام أي انتهاء نص برمجي،`openStream(initial)` بنية صنع إخراج تمام بعد إبقاء فتح نص برمجي.`mock.streams` تحكم عميل حالي فتح حال تدفق، يمكن حسب فتح وقت معامل مرور ترشيح؛`opened(endpoint, count)` في هذا طرف نقطة يتم فتح بلوغ إلى هذا مرة عدد وقت resolve،`drained(endpoint)` في كل بند مطابقة تدفق مستهلك كل سحب تمام حتى اليوم دفع دخول الكل محتوى وقت resolve——فتح تدفق يلزم ذلك مستهلك مجددا مرة انتظار، قد تحديد نطاق تدفق يلزم طابور صف قد فارغ (سحب تمام إشارة من طابور صف أخذ مشي؛ فقط لديه في قراءة حلقة داخل معالجة بند مستهلك عندئذ انتظار في معالجة تمام):

```text
mock.stream('session/follow', openStream([snapshotFrame]))
await mock.streams.opened('session/follow', 1)
mock.streams.push('session/follow', eventFrame, ([request]) => (request as { sessionId: string }).sessionId === SID)
mock.streams.fail('session/follow', new Error('gone'))
await mock.streams.drained('session/follow')
```

فشل تدفق يجعل مستهلك تحت مرة قراءة بـ إعطاء تحديد `Error` reject. مستهلك إلغاء (فتح وقت signal أو iterator رفع قبل `return()`) سوف في توقف `StreamHandle.signal`، انتهاء تكرار بديل بينما لا رمي خطأ، و يأخذ هذا تدفق تسجيل لـ `cancelled`.

### وصل فوق عميل

`mock.rpc` هو `ClientConnectionRpc` وجه. يأخذ هو بصفة `{ transport: { rpc: mock.rpc } }` نقل إعطاء Connection تثبيت دالة، أو يجعل `TestClient` سوف ذلك ربط إلى ذاته نسخة، كل مرة Remote استدعاء حينئذ سوف مباشر بلوغ `dispatch`، كل بند تدفق مباشر بلوغ `open`، في بين لا يوجد معلومة غلاف.payload يحمل `{ args }`——كامل آلة بديل إدارة إرسال عدد مجموعة،Gateway ذاته طرف نقطة إرسال واحد كائن (وصول وقت هو واحد موضع معامل) ؛signal في توقف استدعاء بـ في توقف سبب reject.`RemoteMock.create()` تسجيل تسجيل واحد بند تدفق `$events`، استخدام `{ type: 'ready', clientId, host: { home } }`(host قدوم ذاتي `RemoteMockOptions.host`، افتراضي `/home/mock`) ينبغي جواب Gateway عميل فتح و إبقاء فتح——هذا صحيح هو كامل آلة قدرة بلوغ إلى `connected` سبب؛ اختبار يمكن مثل أي تدفق واحد مثال تغطية أو يجعل هو فشل.

### مراقبة و تأكيد

`mock.log.calls(endpoint?)` صف خروج مرور `dispatch` أو `rpc.call` واحد عنصر استدعاء (`args`،`seq`، فوري `state` لـ `pending` / `answered` / `failed`، و بصفة `result` ينبغي جواب قيمة أو رمي خروج خطأ) ،`streams(endpoint?)` صف خروج نص برمجي تدفق فتح سجل و ذلك فوري `state` و `pushed` حساب عدد،`requests(endpoint?)` حسب ترتيب صف خروج استدعاء و فتح أول عدد موضع معامل (لا حمل طرف نقطة وقت ذهاب إسقاط Gateway ذاتي ذات حمل `$` بادئة طرف نقطة) ،`unmatched()` صف خروج لا بحث إلى قاعدة طلب. أصلي `.mock.calls` أيضا يتضمن مباشر Proxy استدعاء؛ تحميل جسم تدفق mock سوف استلام إلى نهاية ذيل إلغاء إشارة.`assertNoUnmatched()` في استلام ذيل وقت تقرير إبلاغ تسرب إعداد.`modeOf(endpoint)` تقرير إبلاغ صريح تسجيل تسجيل؛`endpoints()` أيضا يتضمن وصول مرور Proxy طريقة، جعل تركيب إعداد قدرة كاف توفير هو جمع نطاق الأسماء.

### ممكن خروج ماذا مشكلة

- **طلب لا يوجد قاعدة**——`dispatch` reject،`open` رمي خروج `remote-mock: no rule for <endpoint>; registered: …`، سجل تسجيل تحت هذا مرة تسرب إعداد؛ طلب تسجيل تسجيل هذا طرف نقطة.
- **payload لا هو `{ args: unknown[] | object }`**——`rpc.call` reject،`rpc.open` رمي `TypeError`؛ كامل آلة بديل إدارة إرسال عدد مجموعة شكل صيغة،Gateway ذاته طرف نقطة إرسال كائن شكل صيغة، الذي بـ مشكلة خروج في يد كتابة استدعاء.
- **نفس بند تدفق فوق لديه ثاني عدد تزامن قراءة**——هذا قراءة reject؛Gateway ترتيب قراءة تدفق، لذلك هذا إشارة نحو اختبار جانب خطأ استخدام.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

### تصميم

`dispatch` و `open` استقبال طرف نقطة و موضع معامل؛`rpc` عبر Connection قد حل رمز تحميل جسم واجهة كشف نفس عدد نواة قلب. كل mock مستقل يحتفظ أصلي دالة و ترتيب طابور تغطية؛ مشترك جدول توفير افتراضي استجابة، لا نسخ handler أو ينبغي جواب كائن. كل بند نص برمجي تدفق يملك ذاتي ذات طابور صف، وحيد تعليق بدء قراءة و سجل بند؛`end`،`fail`، مستهلك إلغاء ثلاثة من في الأكثر أولا حدوث من تحديد نطاق.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | عام وجه تحويل خروج |
| [`src/remote-mock.ts`](src/remote-mock.ts) | `RemoteMock`: افتراضي استجابة، أصلي mock،Connection توزيع، تلقي تحكم تدفق و ناقص استجابة فحص؛`ok` |
| [`src/remote-proxy.ts`](src/remote-proxy.ts) | نطاق الأسماء/طريقة فحص بحث و توليد خريطة mock نوع |
| [`src/streams.ts`](src/streams.ts) | `frames` / `openStream` نص برمجي و `MockStream`(جملة مقبض + `AsyncIterable`) |
| [`src/log.ts`](src/log.ts) | حمل مشترك `seq` حساب عدد جهاز سجل |
| — | لا إصدار وقت التشغيل ثابت كمية مرافق توليد عنصر؛ هذا اختبار دعم حمل مكتبة لا يملك أي إنتاج حدث تدفق أو متغير عملية حالة، ذلك سلوك من هذه الحزمة اختبار تغطية. |

</details>

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا؛ هذه الحزمة هو متصفح جانب اختبار أساس أساس ضبط تطبيق، بلا واحد شيء وصول نموذج طلب.

#### KV Cache أثر

بلا؛ هذه الحزمة حيث لا تجميع أيضا لا إرسال مزود طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **فقط عملية داخل تحميل جسم**——`rpc` خدمة نفس realm في Connection نسخة؛ لا توفير إعطاء متصفح عربة طريق اختبار استخدام HTTP أو WebSocket تحميل جسم.
- **قيمة حسب مرجع نقل تمرير**——ينبغي جواب و تدفق بند كل لم مرور تسلسل تحويل حينئذ وصول عميل، حقيقي خط مسار سوف رفض غير JSON قيمة في هذا داخل أصل مثال عبر.
- **لا تحقق قيمة**——واحد عنصر ينبغي جواب يجب هو استدعاء جهة قراءة نتيجة (`{ ok, value }` أو `{ ok: false, error }`) ؛mock أصل مثال نقل تمرير هو، لا فحص هذه حقل.
- **لا فعل payload مطابقة**——قاعدة فقط حسب طرف نقطة مطابقة؛ في handler داخل حسب عمل خدمة معامل حكم آخر.
- **أصلي تدفق تغطية ذاتي سطر إدارة iterable**——تغطية إرجاع ذاتي لديه iterable وقت، لا مشاركة و نص برمجي تدفق سجل،`requests`،`opened`،`drained` و `push` / `end` / `fail`؛ استدعاء جهة أيضا مسؤول إلغاء. أصلي استدعاء تأكيد ما زال صالح. حاجة هذه تحكم قدرة مشهد ينبغي استخدام قد تسجيل تسجيل تدفق نص برمجي.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

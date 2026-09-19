---
description: "موجه إلى متصفح وظيفة اختبار jsdom slot اختبار وقت التشغيل، توفير اختبار عمل من إبرة مقابل إنتاج آلية فحص تحقق slot، تخزين و تصيير."
kind: "package-library"
---

# @deepseek-ai/dsh-client-test-runtime

[English](README.md) | العربية

## عام وصف

`SlotTestRuntime.create()` يجعل Vitest طقم عنصر في jsdom في قيادة إنتاج slot،store، حمل نوع Session و Workspace fixture، و مقابل نطاق جزء DOM تأكيد. موجه إلى إضافة تنشيط، إعادة تحميل، إعادة وصل و تنظيف اختبار،`createClientTest` استخدام أداة اسم طرف نقطة Remote mock بدء web profile bundle roster، بلا حاجة عمل خدمة Host. ناقص خدمة و لم ضرب وتد استدعاء سوف واضح فشل. كامل آلة fixture يملك بدء و إلغاء تدمير، نطاق جزء runtime توفير قوة انتظار إلغاء تدمير. عبر `devDependencies` سوف هذه الحزمة لأجل عميل اختبار؛ هو لا هو منتج إضافة.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

هذه الحزمة يجعل متصفح وظيفة اختبار يملك يمكن تركيب حقيقي وقت التشغيل: إنشاء اختبار منصة، إعلان أنت وظيفة الذي احتلال استخدام slot، تركيب وظيفة إضافة، تصيير واحد slot، في نطاق جزء عرض فوق تأكيد، لكن بعد dispose(مورد تحرير)——كل مسار لا وجود إنتاج منطق ثاني نسخة تنفيذ.

### تركيب بناء وظيفة اختبار

`SlotTestRuntime.create()` تجميع وقت التشغيل،`declare(children)` تسجيل واحد تلقائي frame، ذلك تدريجي key `<div data-slot>` حزمة لف طبقة يصبح لقطة أصل،`mount(plugin)` في حقيقي fiber فوق تشغيل وظيفة،`renderSlot(key, owner, opts?)` إرجاع حمل حد تحديد استعلام و أصل موضع تحديث slot نطاق جزء عرض:

```text
const runtime = await SlotTestRuntime.create()
await runtime.declare({ 'feature-slot': {} })
const handle = await runtime.mount(FeaturePlugin)
const view = runtime.renderSlot('feature-slot', { owner: props })
expect(view.container).toMatchSnapshot()
await runtime.dispose()
```

`mount` سوف مسبق فحص مطلوب خدمة، ناقص وقت ذاتي واضح تقرير خطأ——أولا استخدام `provide(name, value)` توفير مقدار خارج خدمة. وقت التشغيل توفير `fileUpload` بديل ذات سوف رفض كل مرة استدعاء، مباشر إلى اختبار طقم عنصر استبدال `runtime.fileUpload.upload`.`storeOf(key, scopeKey)` إرجاع مصير تسليم إعطاء slot مكون فوري تخزين نسخة، لأجل هوية و حركة عمل قيادة كتابة تأكيد.

اختياري تصيير معامل عبر `entryKey` اختيار keyed بند، أو عبر `only` اختيار list بند؛`view.update(owner)` إبقاء هذا اختيار.`runtime.panelInfo` توفير افتراضي `usePanelInfo` بيانات مصدر، ابتدائي لا اختيار في عام وجه لوح. تركيب إنتاج Layout كل من قبل، أولا استدعاء `releasePanelInfoSource()` تحرير هذا بيانات مصدر.`dispose()` معا تحرير افتراضي مساحة العمل و وجه لوح معلومة أصل بيانات مصدر؛ رفع قبل تحرير هو قوة انتظار، لن إزالة بديل هو جمع كل من.

### نطاق جزء DOM لقطة

تسجيل لقطة تسلسل تحويل جهاز يأخذ CSS-module ها أمل صنف اسم طي عودة دلالة اسم (`_frame_a1b2c3` → `frame`) ، جعل `.snap` ملف فقط يحتوي بنية، و يأخذ `<svg>` داخلي طي لـ `data-content` إشارة نقش. حاجة ذاتي تعريف صفحة frame طقم عنصر تعديل استخدام `root.declare(children, Frame)` بينما غير تلقائي frame؛`dispose()` امتداد مفرد واحد محور تفكيك حذف عرض، وظيفة fiber، قد صب scope و حفظ دائم تخزين حالة، كما قوة انتظار.

### نص برمجي تحويل Remote ينبغي جواب و فشل

`TestRemote` هو `ctx.remote` وجه بديل ذات: هو يأخذ ذاتي ذات وصل نفس كل يتم نص برمجي تحويل نطاق الأسماء كل تسجيل واحد خدمة، جعل حقن `remote.<name>` إضافة نيل بـ حل حذف تعليق بدء؛`$on` حجز قراءة من صريح اختبار حدث مشغل دفع حركة؛`$host` هو عادي متغير حقل، طقم عنصر مباشر منح قيمة يكفي نص برمجي تحويل حمل home أو غير loopback Host.UI طقم عنصر أيضا في هذه الحزمة أخذ استخدام `RemoteError` منشئ هذا عدد قيمة——`dsh-api-remotes` facade تحمل تحميل لا هو، لأن من طقم عنصر إرسال بدء قيمة import سوف سحب بدء هذا تركيب إعداد بعد لم بناء `/remote` ناتج سلسلة.

حسب Host سوف جواب رمز قدوم نص برمجي تحويل فشل، و بـ إنتاج شفرة نفس مثال طريقة تأكيد——حكم `code`، أبدا حكم صنف:

```text
import { RemoteError } from '@deepseek-ai/dsh-client-test-runtime'

remote.goals.create.mockResolvedValue({
  ok: false,
  error: new RemoteError('goal/not-found', 'goal "g1" does not exist', { goalId: 'g1' }),
})
expect(view.getByRole('alert')).toHaveTextContent('goal/not-found')
```

### كامل جسم ملف

فوق وجه slot ملف يأخذ واحد وظيفة تعليق في بديل ذات فوق. كامل جسم ملف بدء حقيقي تركيب إعداد:`TestClient.start(plan, mock, options)` عملية داخل import كل roster سطر `/client` وحدة (أو أخذ حساب تخطيط داخل `provide` استبدال) ، يأخذ `{ rpc: mock.rpc }` ربط إلى هذا عميل Connection وحدة، استخدام `graphFromRoster` دمج صار بدء رسم و يأخذ قد تحميل وحدة تسليم إعطاء إنتاج وحدة نظام، مرور إنتاج `bootClient` بدء، حسب يحتاج تركيب `uiRenderer`، مجددا انتظار `ctx.connection.state === 'connected'`. هو إخفاء في عميق import بعد وجه،slot ملف اختبار دائم لا تحميل هو:

```text
// @vitest-environment jsdom
import { createClientTest, webApp } from '@deepseek-ai/dsh-client-test-runtime/src/assembly/index.ts'
import { ok } from '@deepseek-ai/dsh-remote-mock'

const test = createClientTest({ roster: webApp }, { mount: true })
test('registers into the sidebar', async ({ remote, start }) => {
  remote.settings.describe.mockResolvedValue(ok({ writable: true, hasDocument: false, namespaces: [] }))
  const client = await start()
  expect(client.ctx.slots.entries('sidebar.settings')).toHaveLength(1)
})
```

`createClientTest` استخدام أصلي Vitest fixture: كل اختبار نيل نيل قد تحميل `remoteDefaultResponses` جديد `mock`، انتظار نفس في `mock.remote` `remote` Proxy، و إعداد ينبغي جواب بعد عندئذ بدء آلة `start()`. تكرار بدء مشترك استخدام واحد Promise، استدعاء جهة يجب await هو قدوم مراقبة بدء خطأ.fixture استلام ذيل انتظار بدء، أي جعل تأكيد فشل أيضا إلغاء تدمير عميل، فحص تسرب إعداد، و رفض اختبار انتهاء بعد حفظ `start` استدعاء. حاجة قسم آخر يملك كثير عدد عميل وقت مباشر استخدام `TestClient.start`. هذه fixture عزل ذاتي ذات حالة، لا عزل `location` انتظار صفحة عام.

اثنان ملف اختبار كل نطاق الأسماء كل استخدام[عام Remote Proxy](../remote-mock/README.zh.md#remote-proxy). تركيب إعداد اختبار استخدام `remote` fixture؛ نطاق جزء `TestRemote` يمكن استقبال `{ settings: mock.remote.settings }`. مباشر إعداد إرجاع بيانات، و قراءة أصلي `.mock.calls`.mutation ينبغي جواب لن تلقائي تحديث لاحق describe ينبغي جواب: مشهد إصدار جديد بيانات وقت، صريح تعديل `remote.settings.describe.mockResolvedValue(...)`.Proxy وثيقة يملك بلا بناء نوع شرح و مطلوب بناء بعد محلي نوع فحص قاعدة.

### Roster و بدء سلوك

`webApp` هو `web` profile متصفح roster، أول مرة import تركيب إعداد مدخل وقت من هو bundle(أولا `dsh-base`، مجددا `dsh-web-app`) حسب بدء جهاز طريقة الآن قراءة، فقط هو مطابقة لا إلى أي سطر رقعة في هذا داخل رمي خطأ، بدء جهاز فقط تحذير إبلاغ: كل bundle `dsh.bundle.patch` قائمة استخدام include إضافة YAML جهة قول تحليل، استخدام هو `applyEntryPatches` دمج صار، كل لم منع استخدام كما ذلك حزمة إعلان `dsh.client.platform === 'web'` سطر يصبح واحد سطر، حمل فوق هذا إعلان `inject` و `immediately`؛`bundleRoster(bundles)` مقابل مهمة معنى bundle قائمة فعل نفس مثال أمر. لا يوجد أي شرق غرب من bundle نسخ صدفة خروج قدوم،bundle واحد تعديل تحت مرة ركض اختبار حينئذ قدرة نظر رؤية.`webApp.closure(names)` إبقاء نقطة اسم سطر و ذلك نقل تمرير حقن الكل سطر (أي حسب bundle تركيب طريقة بدء هذه إضافة الذي يحتاج سطر) ،`webApp.pick(names)` و `webApp.without(names)` يد عمل قطع قص، ثلاثة من كل مقابل لم معرفة اسم حرف رمي خطأ،`ClientRoster.of(rows)` داخل ربط بنية صنع واحد نسخة.`remoteDefaultResponses` هو roster في لا يوجد session، لا يوجد workspace، افتراضي ضبط تحت بدء وقت تماما جيد سوف ضرب ذلك بعض Remote طرف نقطة افتراضي استجابة؛ اختبار استخدام `mock.load(table)` في ذلك فوق تراكم إضافة ذاتي ذات `RemoteTable`، أي لا يوجد قاعدة استدعاء كل سوف في `dispose()` وقت مرور `mock.assertNoUnmatched()` يجعل اختبار فشل.`mount` اشتراط roster توفير `uiRenderer`؛ لا فإن `start` صدى مضيء فشل بينما لا هو إرجاع واحد فارغ حاوية.`client.connection` هو roster Connection خدمة (لا يوجد أي `Context` زيادة قوي إعلان هو) ،`connectTimeoutMs` حد تحديد انتظار حينئذ خيط وقت طويل، مهلة رسالة صف خروج mock log.`reload(name)` عبر مشترك Client Modules مساعد مساعدة دالة إعادة بناء واحد Loader entry(أولا تفكيك registry، مجددا `entry.refresh()`) ؛ كل عميل كل إبقاء ذاتي ذات وحدة نظام و ربط نسخة Connection استبدال، لذلك بدء و إعادة تحميل يمكن إعادة تراكم بينما بلا حاجة تعديل كتابة صفحة عام متغير.`unload(name)` إزالة entry و انتظار إضافة تنظيف إتمام،`flush()` في `act` داخل يجعل React سقوط تحديد.jsdom حيث لا يوجد `EventSource`(client-hmr في apply وقت فتح واحد) أيضا لا يوجد `ResizeObserver`(تخطيط مكون تركيب وقت مراقبة مقياس قياس) ، الذي بـ `start` مقابل ناقص عام كسول صفة وتد فعل مرجع حساب عدد،`dispose` فقط إزالة هو تركيب ذلك بعض——هذا هو jsdom نقص فتحة، لا هو عميل هوية عبر طريق. كل roster داخل `@deepseek-ai/dsh-api-remotes` سطر كل سوف يتم ذهاب إسقاط: هو توليد Remote عميل فقط وجود في بناء بعد `lib/`، بينما `remote.<ns>` صحيح هو هذا ملف يلزم بديل إسقاط شرق غرب.`start` تعديل لـ إعطاء roster حقن كل `remote.<ns>` خدمة (إضافة فوق هذا لحظة mock تسجيل تسجيل مرور قاعدة نطاق الأسماء؛ بعد عندئذ أول مرة تسجيل تسجيل نطاق الأسماء لا يوجد بديل إدارة) توفير واحد بلا عقد نحو بديل إدارة؛`ctx.remote.<ns>.<method>(...args)` تغيير صار مقابل طرف نقطة `<ns>/<method>` استدعاء، يحمل موضع معامل،mock تسجيل تسجيل `stream()` نص برمجي مشي تدفق، لا فإن مشي واحد عنصر، و امتداد استخدام توليد عميل نتيجة طي (تحميل جسم رمي خطأ طي صار `gateway/internal`، في توقف طي صار `gateway/cancelled`). لا يوجد قاعدة طرف نقطة وفق مثال إرسال خروج، الذي بـ mock سوف تسجيل تحت هو،`dispose()` يجعل اختبار فشل.

### أي وقت استخدام

عند وظيفة طقم عنصر يلزم في حقيقي وقت التشغيل تحت فحص تحقق slot، تخزين، تصيير و إلغاء تدمير وقت استخدام هذا اختبار منصة——إنتاج `SlotRegistry`، مصير و provide bundle شيء تحويل كل سوف يتم تركيب، أبدا إعادة تنفيذ. هو هو عميل اختبار أساس أساس ضبط تطبيق: دائم بعيد لا لمس و نموذج طلب، وظيفة حزمة فقط بـ `devDependencies` اعتماد لـ.

### ممكن خروج ماذا مشكلة

- **قد إعلان خدمة لم توفير**——`mount` ذاتي واضح تقرير خطأ و صف خروج ناقص اسم؛ طلب أولا استخدام `provide()` توفير.
- **في `declare` قبل محاولة تجربة تصيير**——`renderSlot` ذاتي واضح تقرير خطأ؛ طلب أولا إعلان هذا key.
- **اختبار استدعاء جلسة سلوك وتد فوق لم ضرب وتد حركة كلمة**——fixture وتد حسب تصميم ذاتي واضح تقرير خطأ، ناقص وتد سوف في استدعاء نقطة طفو الآن، بينما غير ساكن صامت عبر.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير اختبار منصة تصميم؛ يمكن مراقبة سلوك قد في[استخدام هذه الحزمة](#use-this-package) في كامل شرح.

### تصميم

اختبار منصة لا نسخ إنتاج منطق: هو تركيب إنتاج `SlotRegistry`، إنتاج مصير و `UiSession` مهايئ.`TestSessions` و `TestWorkspaces` تنفيذ وظيفة عبر Cordis إزالة استهلاك owner واجهة، كل fixture Session تنفيذ `SessionFace`،`stubSettingsScope` تنفيذ `SettingsScope`.`UiSession` من هذه تحكم جهاز ربط إرسال توليد معيار مصير بيانات مصدر. لم stub `ISession` سلوك سوف حمل ناقص طريقة اسم فشل.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | `SlotTestRuntime` تجميع،`TestRoot`، تلقائي frame،`mount`/`dispose` |
| [`src/sessions.ts`](src/sessions.ts) + [`src/workspaces.ts`](src/workspaces.ts) | `ISessions`/`IWorkspaces` اختبار بديل ذات و `FixtureSession` سلوك وتد |
| [`src/fixtures.ts`](src/fixtures.ts) | عادي fixture منشئ: جلسة لقطة،workspace قائمة حالة |
| [`src/snapshot.ts`](src/snapshot.ts) | DOM لقطة تسلسل تحويل جهاز (صنف اسم ها أمل طي،`<svg>` إشارة نقش) |
| [`src/remote.ts`](src/remote.ts) | لأجل host RPC `TestRemote` بديل ذات،`RemoteError` قيمة تحويل خروج |
| [`src/translate.ts`](src/translate.ts) + [`src/locale-env.ts`](src/locale-env.ts) | قلب ترجمة و ثابت متصفح لغة اختبار مساعد مساعدة |
| [`src/settings-scope.ts`](src/settings-scope.ts) | حمل اختبار قيادة إصدار و كتابة spy `stubSettingsScope` |
| [`src/assembly/roster.ts`](src/assembly/roster.ts) | `ClientRosterRow`،`ClientRoster`(`of`/`closure`/`pick`/`without`) ، هو الذي علامة ملاحظة `AssemblyPlan`، و `graphFromRoster` |
| [`src/assembly/modules.ts`](src/assembly/modules.ts) | شفرة المصدر `/client` استيراد و استبدال، عبر إنتاج وحدة facade انتظار تسجيل عمل مصنع طابور صف تسجيل تسجيل |
| [`src/assembly/test-client.ts`](src/assembly/test-client.ts) | `TestClient`: ربط نسخة Connection، مشترك jsdom وتد،`bootClient`، تركيب، انتظار حينئذ خيط،`reload`/`unload`/`dispose` |
| [`src/assembly/vitest.ts`](src/assembly/vitest.ts) | اختبار درجة `mock` و كسول بدء `start` fixture |
| [`src/assembly/remote-default-responses.ts`](src/assembly/remote-default-responses.ts) | `remoteDefaultResponses`:roster بدء مدة Remote طرف نقطة افتراضي استجابة |
| [`src/assembly/remote-proxies.ts`](src/assembly/remote-proxies.ts) | مرور Connection بلا عقد نحو `remote.<ns>` بديل إدارة:`remoteNamespacesOf`،`remoteProxiesPlugin` |
| [`src/assembly/bundle-roster.ts`](src/assembly/bundle-roster.ts) | `bundleRoster` و `webApp`: استخدام include إضافة ذاتي ذات schema و رقعة تطبيق من bundle رقعة ملف قراءة خروج متصفح roster |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذا اختبار دعم حمل حزمة لا يملك إنتاج حدث تدفق أو متغير بيانات، بينما هو محيط التفاف اختبار بديل ذات تجميع إنتاج SlotRegistry و مصير. الذي تركيب إنتاج حزمة يملك كل منها ثابت صيغة، هذه الحزمة سلوك من هذه الحزمة اختبار فحص تحقق. |

### دورة الحياة

`create()` بناء كل جديد سياق، تركيب slot و جلسة سجل التسجيل، تثبيت مصير، و توفير session/workspace بديل ذات و واضح فشل ملف فوق نقل بديل ذات.`mount` في بدء fiber قبل مقابل وفق سياق فحص كل قد إعلان حقن، جعل ناقص مزود ذاتي واضح تقرير خطأ بينما غير دائم دائم تعليق بدء.`dispose()` أولا إزالة React شجرة، مجددا dispose وظيفة fiber، تحرير أصل تسجيل،dispose قد صب session scope و صاف حذف حفظ دائم تخزين حالة؛ كل عام مشترك تعديل جهاز كل حزمة لف في act في، لذلك اختبار بلا حاجة ذاتي سطر معالجة SlotCore دقيق مهمة دفعة معالجة أو React `act`.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند حزمة درجة اتفاق لا كاف استخدام وقت قراءة قراءة التالي صفحة. هو جمع من اختبار منصة تدريجي خطوة دخول هو الذي تركيب إنتاج آلية و استخدام هو اختبار.

- [ui-session](../../client/ui-session/README.zh.md)——من تحكم جهاز بديل ذات إرسال توليد معيار Slot بيانات مصدر إنتاج مهايئ.
- [UI slots حزمة](../../client/ui-slots/README.zh.md)——اختبار منصة تركيب `SlotRegistry` اتفاق.
- [UI renderer حزمة](../../client/ui-renderer/README.zh.md)——اختبار منصة تثبيت مصير.
- [اختبار سياسة](../../../docs/testing.zh.md)——تغطية طبقة درجة و متصفح لقطة خط الإنتاج.
- [test-support مجموعة أرض رسم](../README.zh.md)——أخ أخ harness و دعم حمل حزمة.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا؛ هذه الحزمة هو متصفح جانب اختبار أساس أساس ضبط تطبيق، لن إرسال بدء أي نموذج طلب.

#### KV Cache أثر

بلا؛ هذه الحزمة حيث لا تجميع أيضا لا إرسال مزود طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح هذا اختبار منصة مثل أي يتم إزالة استهلاك. هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **كامل جسم ملف لا تشغيل توليد Remote عميل**——`remote.<ns>` بديل إدارة تحويل إرسال موضع معامل، لا مرور مرور توليد zod تحقق،wire اسم خريطة أو scoped هوية حقن؛mock handler مباشر استقبال هذه معامل، توليد عميل ما زال من built-artifact e2e عربة طريق تغطية.
- **بديل إدارة استدعاء التفاف مرور Gateway عميل `invoke` و `invokeStream`**——لا فعل `$mount` دورة الحياة فحص، تدفق فشل لا مرور `normalizeConnectionStream` إعادة علامة، واحد عنصر رفض من بديل إدارة ذاتي ذات استخدام Gateway عميل توجيه خروج `carrierFailure` و `cancelledFailure` طي.`ctx.remote.$stream`،`$on`،`$host` هو حق Gateway عميل.
- **لم إعلان طرف نقطة حسب واحد عنصر استدعاء إرسال خروج**——بديل إدارة من mock تسجيل تسجيل تعلم إلى كل طرف نقطة نمط؛spec حيث لا إعطاء نص برمجي أيضا لا إعلان (`RemoteTable.streams`،`mock.stream(endpoint)`) تدفق طرف نقطة تسجيل لـ `unary` تسرب إعداد، منتج شفرة استلام إلى هو طي نتيجة بينما لا هو فشل تدفق.`remoteDefaultResponses` إعلان roster بدء بعد عندئذ فتح تدفق؛ بلا نقاش أي نوع،`dispose()` كل سوف يجعل اختبار فشل.
- **هذه الحزمة client تحرير ترجمة برنامج إضافة `node` بيئة نوع**، جيد يجعل roster قراءة جهاز استخدام `node:fs`؛slot ملف شفرة المصدر أيضا في هذه نوع تحت تحرير ترجمة.
- **Session،Conversation و Chat fixture إبقاء قسم مغادرة**——`sessionSnapshot` فقط يتضمن Session تحكم جهاز حالة،`conversationSnapshot` يتضمن و هدف غير متصل Conversation حالة،`chatSnapshot` يتضمن Chat هدف حالة. تجميع اختبار توفير Session حدث بند، بينما لا هو نحو `SessionSnapshot` إضافة Conversation أو Chat حقل.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

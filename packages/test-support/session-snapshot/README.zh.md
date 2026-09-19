---
description: "موجه إلى بلا مفتاح profile اختبار جلسة سجل لقطة دعم حمل:manifest(بيانات وصفية بيان) ، هوية انفصال حساس، مواصفة تحويل،workspace فحص و بروتوكول مهايئ."
kind: "package-library"
---

# @deepseek-ai/dsh-session-snapshot

[English](README.md) | العربية

## عام وصف

`dsh-session-snapshot` توفير بلا مفتاح قد سجل جلسة اختبار (`pnpm run test:snapshot`) خلف بعد مشترك دعم حمل: غلاف إغلاق manifest، نوع تحويل هوية انفصال حساس، مواصفة تحويل،workspace مقارنة مقارنة،fixture(اختبار قبل وضع بيانات) حفظ حماية، و headless،SDK،ACP(Agent Client Protocol) و Web owner استخدام بروتوكول مهايئ.ACP مهايئ بـ حقيقي عملية فرعية بدء يتم قياس profile، قيادة تحديد صفة إدخال نص برمجي، و تسجيل كامل تسجيل صنع، إعادة تشغيل و تحديث جديد طقم عنصر. كل مشهد كل إيداع كاف كاف دليل قدوم إثبات نموذج مرئي إخراج و نظام الملفات فاعلية نتيجة، لا اعتماد agent(ذكي جسم) ذاتي وصف. حزمة مدخل سوف استيراد vitest، لذلك فقط قدرة في vitest تشغيل في استخدام.

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

هذه الحزمة يأخذ مع مرفق profile مشهد تغيير صار بلا مفتاح لقطة طقم عنصر: كتابة واحد ورقة مشهد جدول و واحد fixture دليل، استدعاء مرة مطابقة مهايئ، أداة حزمة حينئذ مسؤول بدء أو تركيب profile، قيادة مشهد، مقارنة مقارنة مواصفة تحويل إخراج و حراسة حماية قد إيداع fixture.

### تحرير كتابة لقطة طقم عنصر

مستهلك `*.snapshot.ts` حينئذ هو مشهد جدول إضافة مرة عمل مصنع استدعاء.`AgentUnderTest` توفير قطعا مقابل `binScript`، اختياري `libBinScript`،`configPath` و `tsconfigPath` مسار، لأن عملية فرعية cwd يقع في مستودع خارج:

```ts
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  defineAcpSnapshotSuite,
  type Scenario,
  type SnapshotSuiteOptions,
} from '@deepseek-ai/dsh-session-snapshot'

function snapshotMode(value: string | undefined): SnapshotSuiteOptions['mode'] {
  switch (value) {
    case undefined:
    case '':
    case 'replay': return 'replay'
    case 'record': return 'record'
    case 'refresh': return 'refresh'
    default: throw new Error(`unknown DSH_SNAPSHOT mode: ${value}`)
  }
}

const SCENARIOS: Scenario[] = [
  { name: 'text-turn', hasModelTurn: true, recorded: true, pinsHeader: true },
]

defineAcpSnapshotSuite({
  agent: { // absolute paths, resolved from the suite's own location
    binScript: fileURLToPath(new URL('../../../apps/cli/src/bin.ts', import.meta.url)),
    configPath: fileURLToPath(new URL('../cordis.yml', import.meta.url)),
    profile: 'acp',
    tsconfigPath: fileURLToPath(new URL('../../../tsconfig.json', import.meta.url)),
  },
  snapshotsDir: join(dirname(fileURLToPath(import.meta.url)), 'snapshots'),
  scenarios: SCENARIOS, // exactly one entry per header class sets pinsHeader
  mode: snapshotMode(process.env.DSH_SNAPSHOT),
})
```

كل قد سجل Session دليل يحمل غلاف إغلاق `snapshot.yml` manifest، و مواصفة parent و وصل متابعة child زاوية لون.parent ملف اسم هو `session[.vN].jsonl`؛child هو `session.<ordinal>[.vN].jsonl`؛v0 حذف `.v0`، صحيح إصدار استخدام صغير كتابة `.vN`، كما كل ملف اسم و ذلك header متسق. واحد زاوية لون يمكن إبقاء قديم generation، لكن harness سوف اختيار عدد قيمة الأكثر عال واحد بند. يملك fixture manifest يمكن إعلان `sessionFormat.version` و واحد أو كثير عدد غلاف إغلاق `coverage` اسم، يأخذ هذا تاريخ generation إبقاء لـ صريح ترحيل fixture؛ حذف هذا حقل وقت تتبع مع حالي writer.manifest أيضا سوف إشارة اسم مشهد، مع مرفق profile، تركيب/header صنف آخر، تسجيل صنع مصدر، و قد إتمام Session لا يمكن إعادة بناء replay، منصة، إذن، بيئة،workspace أو إدخال واقع. تخزين حفظ حماية فحص كل اختيار تحديد parent و child زاوية لون أداة نتيجة و يمكن نقل غرس مسار. نص التوجيه/schema مسح حذف، رسالة هوية و نص التوجيه أولا في طلب ترتيب فحص ملائم لأجل حالي generation؛ إبقاء قبل بديل صيانة حمل ذلك تاريخ يمثل. مهايئ تسجيل مسبق مدة إخراج،Session سجل و اختياري `workspace.expected/` مقارنة مقارنة؛ حفظ حماية سوف رفض متروك إبقاء دليل، ناقص زاوية لون، غير مواصفة اسم، قطعا مقابل مسار، صيغة خطأ manifest و منصة مخصص استخدام قسم فصل رمز.

`normalizeSessionSnapshot` في مواصفة تحويل مسار و مسح حذف نظام تلميح نص و أداة schema بعد، سوف إبقاء كامل Session header و حدث payload، لكن من قد إيداع fixture في حذف قمة طبقة `seq`/`time` envelope؛ هو أيضا سوف مواصفة تحويل تضمين دخول صيغة stream clock و تاريخ packed-row `seq0`/`time0` envelope و catalog child إنشاء وقت ساعة. حدث ترتيب و مصدر حدث مرجع إبقاء ثابت.Replay فقط في داخل تخزين في دمج صار قمة طبقة envelope، بينما وقت التشغيل حفظ دائم ما زال كتابة كامل سجل. كثير Session مقارنة مقارنة سوف أولا عبر صارم إطار بناء مدة ساكن حالة Session صيغة دليل تحقق مسبق مدة سجل و استلام تجميع سجل، مجددا إجراء هوية انفصال حساس و مواصفة تحويل؛ مصدر ملف اسم لا يستطيع تغيير صيغة تحقق. إبقاء تاريخ replay إدخال لا هو أصلي حالي صيغة writer إخراج مقارنة مقارنة أساس دقيق: بنية ترحيل إبقاء طلب يحتوي معنى، لكن يمكن إنتاج مختلف حدث تخطيط. عودة واحد تحويل إبقاء معنى خارج request-header حقل (يشمل `system`) ، جعل ارتداد إبقاء مرئي. بلا إصدار بروتوكول مهايئ اختبار وحدة fixture لا يخص قد إصدار Session صيغة لغة مادة.[حالي كتابة جهاز صيغة](../../../docs/session-format-status.zh.md) fixture كل حدث احتلال واحد سطر؛ إبقاء v0/v1 fixture يمكن استخدام مواصفة packed row.[مؤقت مستودع ترحيل جهاز](../../../scripts/migrate-packed-session-fixtures.ts)(`pnpm run migrate:packed-session-fixtures`) سوف تعديل كتابة أكثر قديم تاريخ تخطيط، من ذلك[إزالة رفع سجل](../../../.agents/notes/proposed/process/2026-07-26-remove-packed-session-fixture-migrator.zh.md) مسؤول حذف هذا ترحيل جهاز.

spill مشهد عبر حقيقي محلي مزود حفظ إلى خاص مؤقت أصل دليل.fixture مهايئ توفير ثابت طويل درجة منطق تحديد موضع رمز، و فقط سوف هذا مرة تشغيل قد حفظ تحديد موضع رمز خريطة عودة فعلي ملف بـ توفير فحص بحث، في لا كتابة مشترك منطق مسار حال حال تحت إبقاء معاينة ميزانية. معروف لقطة spill مسار سوف مواصفة تحويل لـ مستقر تحديد موضع رمز token، يشمل JSON حذف إشعار في حمل جذب رقم، استخدام JSON تحويل معنى Windows قسم فصل رمز مسار. تحديث جديد رفع أخذ سوف إبقاء مطابقة مسار تسلسل تحويل كتابة قاعدة، بـ سهل إجراء حرف وجه استبدال. مواصفة تحويل فقط تغيير تحديد موضع رمز: حفظ بايت عدد و حذف حساب عدد ما زال بصفة مقارنة مقارنة دليل.

إبقاء تاريخ إدخال مشهد إبقاء مواصفة Session ملف ثابت، و متابعة اختيار هو جمع إجراء إعادة تشغيل؛ ثابت تاريخ إصدار دليل في لا يوجد تحديث مواصفة نفس زاوية لون ملف. ذلك دقيق مواصفة تحويل أصلي حالي صيغة إخراج مفرد وحيد سجل في أب جلسة `writer.expected.jsonl` و فرعي جلسة `writer.<ordinal>.expected.jsonl` في؛ هذه هو إخراج مقارنة مقارنة أساس دقيق، بينما غير replay بديل حد. إبقاء تاريخ إدخال SDK مشهد استخدام `notifications.current.expected.jsonl` سجل حالي بروتوكول إخراج. مقارنة مقارنة حيث لا سوف حالي حدث عكس نحو إسقاط لـ تاريخ صيغة، أيضا لا تقشير حذف بنية فرق مختلف. مستقل ترحيل اختبار تحقق صحيح صيغة تحويل، بينما لا يأخذ أصلي writer تخطيط عند عمل ذلك مسبق مدة حدث تسلسل.

### تسجيل صنع، إعادة تشغيل و تحديث جديد

`pnpm run test:snapshot:record` استدعاء في خط LLM(كبير لغة نموذج) ، و في مواصفة أداة اسم إصدار ملف تحت كتابة استلام تجميع إلى حالي generation.record و refresh أبدا إعادة تسمية أو حذف قد إتمام generation، أي جعل لاحق تشغيل لم يعد إنتاج بعض عدد child زاوية لون أيضا واحد مثال؛ تلقي مراجعة قراءة مصدر شجرة كامل إدارة فقط لديه في نفس زاوية لون وجود قد تحقق حالي بديل ملف بعد عندئذ إزالة قبل بديل. صريح إعلان `sessionFormat` مشهد في تسجيل صنع نمط تحت إبقاء فقط قراءة.`pnpm run test:snapshot:refresh` إبقاء بلا مفتاح، تشغيل اختيار تحديد الأكثر عال replay إدخال، و كتابة stdout، كل pin ذاتي لديه نص التوجيه و أداة schema مرافق مع ملف، و جديد طازج حالي generation يمكن مقارنة مقارنة Session إخراج؛ إبقاء تاريخ إدخال مشهد كتابة مفرد وحيد writer إخراج مقارنة مقارنة أساس دقيق، بينما غير مواصفة حالي صيغة replay بديل حد. كل تركيب owner يأخذ replay patch وضع في live patch جانب؛ قمة طبقة `snapshots/` يملك Session قيادة مشهد، أخرى مسبق مدة إخراج إبقاء في ذلك package owner جانب.[`dsh-llm-replay`](../llm-replay/README.zh.md) توفير عبر `DSH_SNAPSHOT_*` بيئة قيمة اختيار قد سجل تدفق.

### ثابت طلب header و نظام تلميح

كل pin افتراضي يملك ذلك توليد `system-prompt.expected.md` أو `tool-schemas.expected.json` مرافق مع ملف؛ عند كامل مقابل تسلسل نفسه وقت،`systemPromptSource` و `toolSchemasSource` إشارة تحديد آخر عدد pin بصفة مصدر، لذلك كل مختلف إصدار فقط إيداع مرة. نظام تلميح هو surface عقدة 0، بصفة `system/message` حدث سجل في هذا خطوة رقم واحد `request/header` قبل؛ كل fixture يأخذ ذلك نص كتلة تخزين لـ `"text":"{{system}}"`، نص التوجيه مرافق مع ملف إبقاء كامل نص. هذا pin `request/header` حدث تخزين `"tools":"{{tools}}"`، معا إبقاء إعداد و سبب، بنية تحويل schema مرافق مع ملف إبقاء كامل دليل. ذاته أثر مجال تركيب خروج مختلف طلب child Session حسب fixture بحث جذب بـ `pinsChildToolSchemas` و `pinsChildSystemPrompts` مفرد وحيد إعلان. تشغيل في تغيير طلب header مشهد إعلان `expectedHeaderChanges`؛ تشغيل في نص التوجيه حدوث تغير مشهد——استبدال عقدة 0، أو في `in-history` توجيه فوق إلحاق إلى قد ذاكرة مؤقتة تاريخ بعد——إعلان `expectedPromptChanges`، كل مرة تغير في نص التوجيه مرافق مع ملف في زيادة واحد `<!-- system/message change N -->` صغير عقدة.manifest في مقابل حقل لـ `header.changes` و `header.promptChanges`.

### منصة و تركيب تغيير جسم

حاجة غير Windows رئيسي آلة مشهد إعلان `posixOnly`، في Windows فوق قفز مرور تشغيل اختبار، لكن fixture حفظ حماية ما زال في كل منصة تغطية ذلك قد إيداع ملف؛ تركيب حاجة متاح `pwsh` مشهد إعلان `pwshOnly`. عند مؤقت دليل تخويل ذاته انتظار قياس وقت،`workspaceParent` سوف توليد فرعي درجة cwd نقل خروج منصة مؤقت منطقة مجال؛ مشهد توقيع دخول `workspace/` سوف أولا نسخ إلى هذا فرعي درجة، مع بعد `prepareWorkspace` في agent بدء قبل إبرة مقابل توليد cwd تشغيل. افتراضي توليد workspace في جلسة fixture في تخزين لـ `{{cwd}}`، جعل منصة مؤقت أصل دليل و مع آلة basename لا أثر تسجيل صنع.headless manifest في اختبار Session workspace تخويل ذاته وقت استخدام `workspace.parent: outside-temp`. مهايئ في أب دليل يمكن كتابة كما يقع في نظام مؤقت تخويل خارج وقت، في منصة مؤقت أصل دليل جانب قسم إعداد دليل، لا فإن استخدام home، و رفض قد يتم تلقائي مؤقت كتابة تخويل تغطية توليد cwd.

### ممكن خروج ماذا مشكلة

- **فرعي جلسة جولة انتظار فشل**——أي جعل أول مرة سجل استلام تجميع حينئذ تجاوز مرور مدة حد،`waitForSubagentTurnEnd` أيضا سوف إشارة خروج فرعي جلسة، هدف جولة و انتظار مدة حد، و عبر خطأ cause إبقاء قاع طبقة فشل.
- **fixture حفظ حماية رفض قد إيداع ملف**——متروك إبقاء مشهد دليل، ناقص ملف، واحد header صنف آخر يتضمن كثير عدد pin، تكرار مرافق مع ملف محتوى، لم مسح حذف تلميح نص أو أداة schema، لا يوجد قبل وضع `system/message` `request/header`، و صيغة خطأ pin header كل سوف في مقارنة مقارنة تشغيل قبل جعل طقم عنصر فشل.
- **جلسة استلام تجميع حاجة أصلي JSONL mode**——لقطة إعداد استخدام JSONL خلفية `compression: 'none'`؛ ضغط JSONL لا يوجد لقطة استلام تجميع مسار.
- **بناء mode حاجة حالي ناتج**——اختيار `DSH_EXAMPLE_MODE=lib` قبل أولا تشغيل `pnpm run build`؛ مصدر mode ما زال هو صفر بناء مسار.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير أداة حزمة تصميم؛ يمكن مراقبة سلوك قد في[استخدام هذه الحزمة](#use-this-package) في كامل شرح.

### تصميم

مشترك نواة قلب يملك manifest،generation حد تحديد زاوية لون اختيار،workspace ضبط/مقارنة مقارنة، نوع تحويل هوية خريطة،normalizer و fixture ثابت صيغة.ACP مهايئ زيادة أربعة عدد يمكن تركيب طبقة:launcher، مشهد harness،normalizer و suite factory.`launchAcpTestAgent` في tsx تحت بدء شفرة المصدر profile، أو في عادي Node تحت بدء قد بناء `lib` profile، عبر أصلي بايت stdout tee اتصال SDK client، استلام تجميع Session update و stderr، افتراضي رفض لم معالجة إذن طلب، و مسؤول إغلاق.`runScenario` قيادة ACP JSON-RPC stdio، و استلام تجميع كل Session دليل في عدد قيمة الأكثر عال حمل دائم أصلي JSONL generation. صاف normalizer يأخذ cwd مسار و نوع تحويل هوية تغيير لـ مستقر token، سوف وقت عودة صفر، توسيع شيء إدارة مصدر منطقة بين، و مسح حذف توجيه النظام نص و أداة schema bulk.`defineAcpSnapshotSuite` تسجيل مقارنة مقارنة،generation حد تحديد fixture عودة كتابة و فوري متسق صفة حفظ حماية.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/launcher.ts`](src/launcher.ts) | عملية فرعية/عميل بدء جهاز و إغلاق كل حق |
| [`src/harness.ts`](src/harness.ts) | نص برمجي تحويل مشهد قيادة و جلسة سجل استلام تجميع |
| [`src/manifest.ts`](src/manifest.ts) | غلاف إغلاق `snapshot.yml` schema، استلام تجميع و ملكية قاعدة |
| [`src/session-files.ts`](src/session-files.ts) | مواصفة parent/child generation grammar،header متسق صفة و الأكثر عال زاوية لون اختيار |
| [`src/identity.ts`](src/identity.ts) | عبر أب فرعي سجل نوع تحويل أول مرة ظهور هوية token تحويل |
| [`src/normalize.ts`](src/normalize.ts) | صاف مواصفة تحويل جهاز و مسح حذف مساعد مساعدة |
| [`src/workspace.ts`](src/workspace.ts) | مشهد workspace ضبط و كامل مسبق مدة حالة مقارنة مقارنة |
| [`src/suite.ts`](src/suite.ts) | مشهد جدول طقم عنصر عمل مصنع،fixture حفظ حماية، تسجيل صنع/تحديث جديد عودة كتابة |
| [`src/index.ts`](src/index.ts) | مجددا توجيه خروج أربعة عدد طبقة حزمة مدخل |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذا اختبار دعم حمل حزمة لا يملك أي إنتاج حدث تدفق أو متغير بيانات؛ إزالة استهلاك هو اختبار طقم عنصر سوف فحص تحقق هذا أداة حزمة. |

### بيانات تدفق

مشهد في بدء جهاز تحت تشغيل agent، عبر harness نحو هو تغذية دخول إدخال نص برمجي، و التقاط stdout و حفظ دائم سجل. مواصفة تحويل جهاز يأخذ التقاط محتوى مواصفة تحويل——id تحويل لـ أول مرة ظهور تسلسل، توليد cwd تحويل لـ `{{cwd}}`،`system/message` نص تحويل لـ `{{system}}`،header أداة schema تحويل لـ `{{tools}}`——جعل قد تسجيل صنع و هذا مرة تشغيل يمكن بنية تحويل مقارنة مقارنة. مع بعد عمل مصنع يأخذ مواصفة تحويل stdout و إعادة حفظ دائم سجل نفس قد إيداع fixture مقارنة مقارنة، أو في تسجيل صنع/تحديث جديد نمط تحت عودة كتابة هو جمع؛ ذلك حفظ حماية في أي مقارنة مقارنة نتيجة يتم أخذ معلومة قبل حينئذ رفض شاذ شكل أو عائم نقل fixture.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند حزمة درجة اتفاق لا كاف استخدام وقت قراءة قراءة التالي صفحة. هو جمع من لقطة أداة حزمة تدريجي خطوة دخول نموذج fixture مصدر، بدء آلية و اشتراط هذا طبقة درجة وجود سياسة.

- [llm-replay](../llm-replay/README.zh.md)——إعادة تشغيل نمط إزالة استهلاك بلا مفتاح نموذج fixture مصدر.
- [loader-smoke](../loader-smoke/README.zh.md)——بدء جهاز الذي اعتماد نمط شعور معرفة عملية فرعية بدء آلية.
- [اختبار سياسة](../../../docs/testing.zh.md)——بلا مفتاح لقطة طبقة، ذلك ملائم استخدام وقت آلة و fixture ملكية قاعدة.
- [test-support مجموعة أرض رسم](../README.zh.md)——أخ أخ harness و دعم حمل حزمة.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا. هذا اختبار مخصص استخدام دعم حمل سوف سجل، مواصفة تحويل و مقارنة مقارنة profile جلسة، لن تغيير agent تجميع نموذج طلب.

#### KV Cache أثر

بلا؛ هذه الحزمة حيث لا تجميع أيضا لا إرسال مزود طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح أي وقت حاجة مقابل هذا أداة حزمة خاص آخر صغير قلب. هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **جلسة استلام تجميع حاجة أصلي JSONL mode**——`runScenario` استلام تجميع حفظ دائم `.jsonl` سجل، لذلك لقطة إعداد استخدام JSONL خلفية `compression: 'none'`؛ ضغط JSONL لا يوجد لقطة استلام تجميع مسار.
- **بناء mode حاجة حالي ناتج**——اختيار `DSH_EXAMPLE_MODE=lib` قبل أولا تشغيل `pnpm run build`؛ مصدر mode ما زال هو صفر بناء مسار.
- **ACP متابعة تغطية بروتوكول سلوك**——وخز تنشيط قدوم ذاتي ACP عميل إلغاء و إذن نحو إرجاع إبقاء في هذا مهايئ؛ تجميع صيغة مرة صفة سلوك و حمل دائم تحكم سلوك استخدام headless و SDK مهايئ.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

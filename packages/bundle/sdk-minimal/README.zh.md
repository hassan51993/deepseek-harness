---
description: "توفير حاجة لا يحتوي مشترك base bundle أقصى بسيط عبر منصة coding agent(تحرير مسار ذكي جسم) مستخدم استخدام مستقل SDK profile، افتراضي توفير واحد shell أداة."
kind: "package-bundle"
---

# `@deepseek-ai/dsh-sdk-minimal`

[English](README.md) | العربية

## عام وصف

عند SDK عميل حاجة صغير نوع، صريح coding agent وقت التشغيل وقت، طلب استخدام `dsh --profile sdk-minimal`. هذا profile افتراضي فقط عام نشر حسب منصة اختيار حمل دائم shell، يأخذ جلسة حفظ دائم لـ لم ضغط JSONL، و من SDK ابتدائي تحويل طلب اختيار نموذج. هو توفير كامل Cordis إعداد شجرة، و لحظة معنى ترتيب حذف `dsh-base`،Web،settings، حمل إدارة اعتماد، بعيد قياس، ضغط (compaction) ، نظام الملفات أداة،workspace إشارة أمر،skill(تقنية قدرة) ،jobs و subagent. ذلك danger-full-access سياسة سماح shell تعديل عملية يمكن وصول أي مسار، لذلك فقط قدرة إعداد دمج عزل workspace استخدام.

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

مباشر بدء هذا profile، أو من Python SDK اختيار هو. توفير صريح `DSH_HOME`، استخدام مرة صفة workspace، و عبر `DEEPSEEK_API_KEY` توفير نموذج اعتماد.

```sh
export DSH_HOME=/absolute/path/to/example-dsh-home
dsh --profile sdk-minimal
```

`DSH_CONTEXT_WINDOW` لـ لا في مهايئ بناء اقتراح دليل في نموذج ضبط بعد تجهيز سعة كمية.`DSH_SYSTEM_PROMPT` استبدال افتراضي persona.SDK ابتدائي تحويل طلب هو وحيد نموذج اختيار اعتماد حسب، و تغطية بيئة قيمة افتراضية.

استخدام `dsh plugin --profile sdk-minimal` إدارة حمل دائم خارجي اعتماد.Profile،home و لديه ترتيب `--patch` ملف يمكن استبدال كامل افتراضي إعداد شجرة في بند إعداد، أو في هذا إعداد شجرة فوق جهة إدراج دخول bundle. مع مرفق نموذج لوح فقط في بدء وقت تطبيق patch.

هذا profile فقط تركيب واحد طقم حمل دائم shell:Linux و macOS استخدام Bash،Windows استخدام PowerShell. اثنان طقم إعداد كل استخدام 300 ثانية مهلة و واحد agent ذاتي لديه طرفية؛ آخر منصة بند إعداد إبقاء منع استخدام.

و أخرى مع مرفق profile واحد مثال، هو موحد واحد تركيب [MCP مورد](../../mcp/mcp-resources/README.zh.md) مرة. فقط يحتاج إعداد [MCP عميل بند](../../mcp/mcp-client/README.zh.md) يكفي إضافة خادم. أخرى مزود تركيب عميل أيضا يخص قد إعداد حالة. استدعاء جهة أثر مجال في لم إعداد خادم وقت،MCP لا مساهمة نص التوجيه نص أو أداة، افتراضي ما زال فقط لديه واحد shell أداة.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا bundle مفرد عدد insert حينئذ هو كامل تطبيق إعداد شجرة:SDK stdio بدء و JSON-RPC خدمة، واحد من بيئة إعداد DeepSeek مهايئ، صريح agent نواة قلب، حسب إعداد تفعيل MCP مورد أداة، محلي عملية فرعية تنفيذ، حسب منصة اختيار حمل دائم shell PTY، و يقع في `$DSH_HOME/sessions` لم ضغط JSONL حفظ دائم. هو لا وراثة أخرى bundle، لذلك كل مقدار خارج بند إعداد كل هو صريح profile تغيير.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`cordis.patch.yml`](cordis.patch.yml) | كامل مستقل profile إعداد شجرة و ذلك بيئة قيمة افتراضية |
| [`src/index.ts`](src/index.ts) | Bundle حزمة مدخل |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد بند؛ هذه الحزمة فقط هو ساكن حالة patch قائمة تحميل جسم، إدراج دخول كل سطر قسم آخر يملك ذاتي ذات وقت التشغيل علاقة و ثابت صيغة مرافق توليد بند. |
| [`tests/sdk-minimal.spec.ts`](tests/sdk-minimal.spec.ts) | دقيق تركيب،profile اسم و منصة اختيار فحص |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [Python SDK عرض مثال](../../../python/sdk/examples/README.zh.md)——من Python بدء هذا profile، و استخدام واضح إشارة تحديد Harness home.
- [SDK تطبيق bundle](../sdk-app/README.zh.md)——كامل و أقصى بسيط SDK profile إعادة استخدام JSON-RPC تطبيق طبقة.
- [Base bundle](../base/README.zh.md)——هذا profile لحظة معنى حذف كامل منتج أساس أساس.

-----

<a id="model-experience"></a>
## تجربة النموذج

### أقصى بسيط coding agent تركيب

#### نموذج يرى محتوى

توجيه النظام أخذ `DSH_SYSTEM_PROMPT`، لم ضبط وقت استخدام `You are a helpful software engineer assistant.`. لم إعداد MCP خادم وقت، مقابل خارج عام نشر وحيد أداة هو Linux/macOS فوق agent كل حمل دائم `bash` أو Windows فوق `pwsh`؛ وقت التشغيل سياق، نظام الملفات أداة،workspace إشارة أمر،skill،jobs تحكم، ضغط و Harness هوية متساو لا وجود.

#### Token أثر

افتراضي هو واحد مستقر persona إضافة واحد أداة schema. قد إعداد MCP خادم سوف إضافة ذاتي ذات أداة، مشترك مورد أداة و متاح خادم إشارة أمر. أداة نتيجة و عادي محادثة تاريخ مع جلسة زيادة طويل.

#### KV Cache أثر

عند persona، منصة، مزود، نموذج و bundle patch مكدس ثابت وقت إبقاء مستقر.Profile تغيير في تحت واحد عملية توليد فاعلية.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **هذا تركيب لحظة معنى حذف مشترك منتج خدمة** — حاجة settings، حمل إدارة اعتماد، سياسة مسبق ضبط، بعيد قياس،Web أداة أو كامل افتراضي أداة بيان وقت، طلب اختيار `dsh --profile sdk`.
- **مستخدم patch يمكن توسيع إعداد شجرة و كسر تالف stdout** — profile ذاتي تعريف يخص تلقي معلومة مهمة تطبيق تركيب؛ نحو stdout كتابة عادي نص إضافة سوف كسر تالف JSON-RPC قسم لقطة.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

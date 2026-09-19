---
description: "موجه إلى أداة عمل من و صيانة من أداة سجل التسجيل و تنفيذ خط الإنتاج شرح، لأجل تسجيل، حد، عرض أو ضبط تجربة موجه إلى نموذج أداة."
kind: "package-reference"
---

# @deepseek-ai/dsh-tools

[English](README.md) | العربية

## عام وصف

استخدام `dsh-tools` يمكن نحو نموذج عام نوع تحويل قدرة، تحقق استدعاء، تنفيذ سماح/رفض/استفسار سؤال سياسة، و في عادي أداة فشل وقت إرجاع نهائي نتيجة بينما لا في توقف حالي جولة. عبر `mode` اختيار أصلي Function Calling(دالة استدعاء) ،[PTC mode](#ptc-mode) أو اثنان من؛ مفرد عدد agent(ذكي جسم) متاح `presentAs` تغطية قيمة افتراضية. أداة عمل من استخدام `defineTool` إعلان نوع تحويل معامل و إخراج، تنسيق عمل صيغة مهلة، و سطر أمان خاصية و اختياري UI عرض. نموذج سوف يرى كل نيل دقيق أداة إعلان اسم، وصف و معامل schema؛ حسب agent ضبط حد يمكن تقليص صغير هذا مرئي تجميع دمج.

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

في أي agent استدعاء أداة أرض جهة تركيب `dsh-tools`: هو توفير `ctx.tools`، أي كل أداة إضافة تسجيل دخول ذهاب، حلقة توزيع الذي مرور مرور سجل التسجيل. تسجيل واحد أداة حينئذ كاف بـ يجعل هو مرئي——سجل التسجيل سوف تلقائي يأخذ ذلك schema إرسال دخول توجيه النظام تجميع.

### تسجيل أداة

`defineTool` بناء نوع تحويل أداة تعريف: موجه إلى نموذج اسم، وصف و معامل schema، مواصفة إخراج إعلان، و فقط إرجاع الذي إعلان JSON قيمة `execute` رئيسي جسم. نموذج معامل في تنفيذ قبل يتم تحقق؛ بلا فاعلية إدخال تغيير صار عادي خطأ نتيجة.

```ts
import { readFile } from 'node:fs/promises'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

declare const ctx: Context

ctx.tools.register(defineTool({
  name: 'read_file',
  description: 'Read a file from disk.',
  parameters: {
    path: { type: 'string', required: true, description: 'Absolute file path' },
    offset: { type: 'number' },
    limit: { type: 'number' },
  },
  output: {
    schema: { type: 'string' },
    render: (_args, value) => [{ type: 'text', text: value }],
  },
  async execute(args, exec) {
    // args is typed: { path: string; offset?: number; limit?: number }
    return readFile(args.path, { encoding: 'utf8', signal: exec.signal })
  },
}))
```

موحد واحد schema DSL دعم حمل `string`،`number`،`integer`،`boolean`،`null`،`array`،`object`، فقط توفير عمل من استخدام `json` و تماما جيد مطابقة واحد فرع `oneOf`؛`InferValue` في 16 طبقة حاوية داخل إبقاء دقيق نوع، بعد إضافة عرض لـ `JsonValue`. أصلي JSON Schema(`JsonSchemaNode`) هو و subagent، سير العمل و MCP مشترك بروتوكول درجة مقابل نوع.

### إعداد عرض نمط

`mode` إعداد قرار نموذج يرى ماذا:`native`(كل مرئي schema) ،`ptc`(فقط لديه `run_code` إضافة واحد نسخة توليد SDK) أو `both`.

```yaml
- name: '@deepseek-ai/dsh-tools'
  config:
    mode: native
```

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---|---|
| `mode` | `native` | مرئي أداة نحو نموذج عرض طريقة:`native`،`ptc` أو `both` |
| `maxParallelSubCalls` | `10` | `run_code` برنامج إعادة تراكم فرعي استدعاء تزامن حد أعلى؛`1` استعادة صارم إطار سلسلة سطر توزيع |

توليد[إعداد دليل](../../../docs/config-catalog.zh.md#deepseek-aidsh-tools) هو كل تلقي دعم حمل حقل نفاد كل صيغة حق مصدر. غير أصلي نمط اشتراط قد تركيب `ctx.ptcRuntime` كما ذلك لغة لديه قد تسجيل SDK مصير؛agent preset عبر [`dsh-agent-tool-presentation`](../agent-tool-presentation/README.zh.md) ذاتي سطر اختيار عرض طريقة، مفرد عدد agent متاح `presentAs(mode)` حجب حجب قيمة افتراضية.

### حسب agent حد أداة

`ctx.tools.restrict(filter)` مقابل مفرد عدد agent وراثة عام أداة تطبيق سماح أو رفض إخفاء رمز؛ إخفاء رمز أخذ تسليم تجميع، أثر مجال تسجيل إبقاء مرئي، حد في dispose(مورد تحرير) وقت حل حذف.`ctx.tools.get(name, scope)` حسب واحد أثر مجال نظر زاوية تحليل أداة. استخدام Host محلي عرض تحويل جهاز مستهلك مثل يحتاج مطابقة فعلي تنفيذ تعريف، سوف نقل دخول إرسال بدء استدعاء agent.`ctx.tools.schemas(scope)` إرجاع مرئي schema(لا يحتوي `execute` دالة).

### مقابل استدعاء فعلي تطبيق سياسة

`ctx.tools.guard(guard)` في يمكن توسيع `tools/pre-execute` waterfall(شلال نشر صيغة حدث) بعد تسجيل مفرد ضبط تزامن حراسة حماية: إرجاع إدارة من سوف رفض استدعاء، لاحق مستمع لا يمكن يأخذ هذا رفض إعادة تغيير لـ سماح. خط الإنتاج حدث إعطاء إضافة أكثر كثير تحكم——`tools/pre-execute` قرار سماح/رفض/استفسار سؤال،`tools/execute` لـ مهلة أو إعادة محاولة حزمة تركيب توزيع،`tools/post-execute` فحص أو استبدال نتيجة،`tools/result` مراقبة قياس تجميد ربط نهائي نتيجة.

### Host عرض وصف

أداة يمكن لـ Host محلي مستهلك إبقاء صاف دالة `presentCall()` و `presentResult()` طريقة. داخل وضع Web Client لا إزالة استهلاك هذه قيمة، بينما هو عبر `tool.call.toolview` اختيار renderer، و من أصلي استدعاء معامل، نتيجة محتوى، فشل حالة و حمل دائم metadata إرسال توليد card props.[Client إرسال توليد عرض قرار](../../../.agents/notes/implemented/architecture/2026-08-23-client-derived-tool-presentation.zh.md) مسؤول هذا transport تفكيك قسم.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير هذا حزمة مثل أي تنفيذ فوق وصف سلوك؛ يمكن مراقبة اتفاق قد في[استخدام هذه الحزمة](#use-this-package) في كامل شرح.

### تصميم إدارة فكرة

سجل التسجيل في أثر مجال طبقة في يحتفظ نوع تحويل `ToolDefinition`، و في طلب وقت يأخذ هو جمع إسقاط لـ موجه إلى نموذج `ToolSchema` تجميع دمج——`output`،`execute`،`finalizeContent`،`timeoutMs` و عرض عودة ضبط أبدا سوف تسرب تسرب إلى بروتوكول فوق. كل مرة استدعاء كل تشغيل واحد بند ثابت خط الإنتاج:`tools/pre-execute`(يمكن توسيع سماح/رفض/استفسار سؤال)→ قد تسجيل مفرد ضبط حراسة حماية → `tools/execute`(حلقة التفاف توزيع حزمة تركيب طبقة)→ `tools/post-execute`(فحص/استبدال، مرفق إضافة سياق)→ من تعريف يحتفظ `finalizeContent` → فقط مراقبة قياس `tools/result` حدث. فقط لديه `tools/execute` عرض يمكن استبدال لا بد ملء إشارة، سجل التسجيل سوف في استدعاء رئيسي جسم قبل إعادة دمج دمج استدعاء جهة إشارة.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | إضافة مدخل:`ToolRuntime` خدمة، إعداد، سجل التسجيل، تنفيذ خط الإنتاج |
| [`src/types.ts`](src/types.ts) | `ToolDefinition`،`ToolExecution`،`ToolExecutionResult`، حراسة حماية و قرار نوع |
| [`src/schema.ts`](src/schema.ts) | `defineTool` DSL:`ValueSchemaSpec`،`ParameterSchemaSpec`،`InferValue`،`InferArgs` |
| [`src/json-schema.ts`](src/json-schema.ts) | قوي صنع تنفيذ أصلي JSON Schema فرعي تجميع و تحقق |
| [`src/presentation.ts`](src/presentation.ts) | حمل `card` وسم UI عرض معنى رسم |
| [`src/ptc.ts`](src/ptc.ts) | PTC mode:SDK توليد،`run_code` توزيع جسر وصل طبقة، تسوية |
| [`src/ts-types.ts`](src/ts-types.ts) | TypeScript SDK نوع تصيير |
| [`src/py-types.ts`](src/py-types.ts) | Python SDK نوع تصيير |
| [`src/invariant.ts`](src/invariant.ts) | ثابت صيغة إعداد طقم |

### تنفيذ و إلغاء

كل مرة نوع تحويل استدعاء كل سوف فعلي جسم تحويل و تجميد ربط تحليل بعد معامل، قسم إعداد لا نفاذ واضح صلة ربط token، مجددا تشغيل سياسة و توزيع.pre-execute رفض يمكن في نموذج مرئي سبب جانب مرفق حمل `ToolErrorInfo`؛ أصلي و PTC حمل دائم إسقاط سوف إبقاء بنية تحويل اسم، شفرة و اختياري مستخدم مرئي سبب، لكن لن يأخذ هذا تفصيل حال إضافة دخول نموذج محتوى. إلغاء اعتماد تنسيق عمل صيغة و انتظار تماما توقف مستقر: كل أداة رئيسي جسم كل استلام إلى استدعاء جهة يملك `exec.signal` كما يجب مراقبة قياس هو؛ استدعاء رئيسي جسم قبل إلغاء لـ `ABORTED_BEFORE_DISPATCH`، استدعاء رئيسي جسم بعد إلغاء فقط قدرة يأخذ نجاح نتيجة استبدال لـ `ABORTED`. رفض، حزمة تركيب طبقة فشل، أداة فشل، بعد وضع سياسة فشل و مهلة إنتاج `TOOL_TIMEOUT` ما زال إبقاء أكثر أداة جسم نتيجة. لم معرفة أداة و رمي خروج استثناء أداة كل سوف تغيير صار بنية تحويل خطأ (`UNKNOWN_TOOL`) ، لذلك استدعاء سوف فشل بينما لن انتهاء جولة.

### PTC mode

في `ptc` أو `both` تحت، سجل التسجيل عام إبقاء `run_code` نقل و حسب الذي تحميل وقت التشغيل لغة توليد تحديد صفة SDK. كل SDK ربط التقاط تجميد ربط ToolSchema، مرور من مجدول نقل دخول هذا مرة تنفيذ سياق. قد بدء استدعاء في سياسة قبل فقط سجل إعداد مقابل id، اسم و مواصفة تحويل معامل؛ ذلك تسوية حدث إبقاء تصيير نتيجة و اختياري بنية تحويل خطأ. وصف و معامل schema فقط مؤقت تخزين نشط، لا دخول Session حدث أو SDK إخراج. استدعاء عبر إعادة استخدام أصلي تزامن اتفاق كل مرة تشغيل وحيد لديه حوض ضبط درجة. في صاف `ptc` تحت، نموذج مباشر نداء أخرى أي مرئي أداة كل سوف في سياسة قبل تحليل لـ `UNKNOWN_TOOL`——عبر إبلاغ وجه و يمكن استدعاء وجه إبقاء متسق. في بين ربط قيمة فقط وجود في تنفيذ نطاق جزء؛ فقط لديه خارج طبقة `run_code` نتيجة لديه صلب كبير صغير حد أعلى.[منفذ انهيار تقليص note](../../../.agents/notes/implemented/bug-fix/2026-08-07-ptc-executor-collapse.zh.md) يملك هذا استلام حزمة اتفاق.

جديد فرعي استدعاء استخدام `<parent>:ptc:<n>` معرف. مستهلك سوف هذه معرف نظر لـ لا نفاذ واضح قيمة، و عبر دقيق متبادل انتظار صلة ربط حدث؛ استعادة تاريخ معرف إبقاء أصلي بايت.[PTC mode قرار](../../../.agents/notes/implemented/feature/2026-06-15-ptc.zh.md) مسؤول حفظ دائم تسمية و استعادة قاعدة.

عند قد تركيب وقت التشغيل دعم حمل تغطية وقت،`run_code` قبول `timeoutMs`؛ ذلك schema تقرير إبلاغ إعداد قيمة افتراضية و حد أعلى، وقت التشغيل استخدام شرح و Session عمل دليل.Node قيمة افتراضية لـ 120,000 ms، حد أعلى لـ 600,000 ms، يتضمن تضمين طقم أداة و مراجعة دفعة انتظار. أكثر عرض `sandbox_permissions` نمط اشتراط غير فارغ `justification`، و في برنامج بدء قبل نيل نيل مراجعة دفعة. تخويل فقط لأجل هذا مرة كامل تنفيذ؛ معتاد إقامة Session سياسة و تضمين طقم أداة إبقاء كل منها إذن. برنامج لن تلقائي إعادة وضع: صريح إعادة محاولة يتم رفض برنامج قبل، ينبغي فحص أولا قبل قد حدوث فاعلية نتيجة.

<a id="extension-points"></a>
### نقطة توسيع

أداة إضافة استدعاء `ctx.tools.register()`، ذلك schema سوف تلقائي تدفق دخول نص التوجيه تجميع.`tools/pre-execute` هو يمكن إعادة ترتيب سماح/رفض/استفسار سؤال بوابة؛`ctx.tools.guard()` في ذلك بعد إضافة مفرد ضبط يملك جهة سياسة؛`tools/execute` لـ مهلة، إعادة محاولة أو إشارة علامة حزمة تركيب مواصفة تحويل بعد مواصفة توزيع؛`tools/post-execute` يمكن استبدال محتوى أو قيمة، عبر عكس تغذية منع توقف، أو مرفق إضافة لديه ترتيب سياق؛`tools/result` مراقبة قياس غير ممكن تغيير نهائي نتيجة.MCP خادم اكتشاف أداة بعد، استخدام خادم schema استدعاء `ctx.tools.register()`.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

حزمة درجة اتفاق مقابل كبير كثير عدد مستهلك قد كاف كاف؛ حاجة دورة حافة مجال وقت مجددا قراءة قراءة التالي صفحة.

- [أداة فرعي نظام](../../../docs/subsystems/tools.zh.md)——كامل خط الإنتاج نوع،schema DSL و توليد خدمة API.
- [توليد أداة دليل](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tools)——نموذج استلام إلى قد تسليم أداة schema.
- [أداة تنفيذ خط الإنتاج](../../../docs/tool-execution-pipeline.zh.md)——يمكن نظر تحويل خط الإنتاج.
- [إضافة أداة فعلي تشغيل يد سجل](../../../docs/cookbook/adding-a-tool.zh.md)——قسم خطوة أداة تحرير كتابة إشارة جنوب.
- [تنسيق عمل صيغة إلغاء Agent Note](../../../.agents/notes/implemented/architecture/2026-07-19-cooperative-tool-cancellation.zh.md)——كامل إلغاء اتفاق.
- [core قسم مجموعة أرض رسم](../README.zh.md)——core كل حزمة مثل أي تركيب.

-----

<a id="model-experience"></a>
## تجربة النموذج

### عادي أداة schema

#### نموذج يرى ماذا

في عادي نمط تحت، نموذج سوف يرى كل مرئي تعريف تأكيد قطع اسم، وصف و JSON Schema؛ قد تسليم تعريف سجل في توليد[أداة دليل](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tools) في.agent أثر مجال حد، حجب حجب و توسيع تسجيل سوف تغيير هذا agent نهائي أداة تجميع دمج.

#### Token أثر

كل مرة طلب ثابت صار هذا و مرئي تعريف صار صحيح مقارنة. إخفاء أداة حد سوف لـ هذا agent إزالة ذلك الكل schema صار هذا.

#### KV Cache أثر

فقط يلزم مرئي تعريف و ذلك ترتيب ثابت، بادئة حينئذ إبقاء مستقر. تسجيل،dispose أو أثر مجال حد ممكن من رقم واحد تغيير schema token بدء جعل إعادة استخدام بطلان.

### PTC mode schema و توجيه النظام

#### نموذج يرى ماذا

PTC mode سوف عام توليد [`run_code` schema](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tools) ، تحت جهة SDK شرح، و حسب الذي تحميل وقت التشغيل لغة توليد دقيق SDK كتلة.TypeScript شرح سوف يأخذ توليد إعلان واضح علامة لـ فقط قدرة في برنامج داخل استخدام ربط. عند حالي `bash` معامل schema قبول عرض مثال معامل وقت، شرح أيضا سوف إعطاء خروج بـ `run_code` حزمة إقامة `tools.bash(...)` كامل استدعاء.`tools:sdk` مقطع استخدام first-party ترتيب 5000، و إغلاق نص التوجيه متغير إدراج قيمة، جعل اثنان نوع وقت التشغيل لغة كل أصل مثال إبقاء أداة وصف و schema في `{{…}}` نص.`both` سوف معا عام عادي schema و هذا PTC mode API؛ في `ptc` تحت، نص التوجيه أيضا سوف حمل فوق موضع في أكثر مبكر first-party ترتيب `tools:ptc-only` قاعدة، يجعل نموذج أولا قراءة إلى «يمكن استدعاء أي بعض أداة» مجددا قراءة «كل أداة فعل ماذا».

##### حمل bash TypeScript PTC mode SDK شرح

```markdown
## Writing code for run_code

`run_code` takes two required arguments: `code` — the body of an async TypeScript function (erasable syntax only — no `enum` or namespaces; type annotations are advisory, the code runs type-stripped) — and `description`, a short summary of what the program does. The declarations below are SDK bindings for this program. A declaration does not make its name a directly callable tool; only names supplied as separate tool schemas may be called directly. When no separate `bash` schema is supplied, invoke a declared `bash` binding inside `run_code`:

`run_code({ code: "return await tools.bash({ command: 'pwd', description: 'Show current directory' })", description: "Show current directory" })`

Inside the program:

- Call tools as `await tools.name(args)` — quoted access for exotic names: `tools["my-tool"](args)`. Every call resolves to the tool's typed canonical JSON value. Tool arguments must be lossless JSON.
- A FAILED tool call rejects with `ToolCallError`, whose `toolName` identifies the failed tool and whose `message` is human-readable — `try/catch` it to handle and continue.
- Independent read-only calls MAY overlap under `Promise.all` (safe calls run concurrently; mutating calls run alone, in submission order). Sequence dependent work with `await`.
- Emit results with `return` and/or `console.log(...)`. Only what you print or return is program output. A successful tool result containing an image is attached after the run so you can inspect it on the next step; every other intermediate result stays out of the conversation, so extract just what you need.

Program-only SDK bindings:
```

#### Token أثر

كل مرة طلب ثابت صار هذا و مرئي تعريف صار صحيح مقارنة.PTC mode استخدام توليد SDK نص إضافة واحد نقل schema يحل محل نهائي أداة schema، لكن لا تحمل وعد عام مرة نقص قليل صار هذا.

#### KV Cache أثر

فقط يلزم PTC mode اختيار، توليد SDK، نقل schema و مرئي أداة تجميع دمج ثابت، بادئة حينئذ إبقاء مستقر. نمط أو غربلة اختيار جهاز تغيير ممكن من رقم واحد تغيير نص التوجيه أو schema token بدء جعل إعادة استخدام بطلان.

### أداة استدعاء تاريخ و نتيجة

#### نموذج يرى ماذا

حلقة سوف إبقاء نموذج إرسال خروج معامل و سجل التسجيل نهائي محتوى. أي رمي خروج استثناء أو تعرض إلى رفض استدعاء، كل سوف تحويل لـ تأكيد قطع `Error: <message>`؛ بنية تحويل مستخدم مرئي فشل تفصيل حال لن إضافة دخول هذا رسالة.PTC mode فقط إرجاع خارج طبقة برنامج ضرب طبع سطر و عرض بعد قيمة راجعة؛ اثنان من كل لـ فارغ وقت إرجاع `(run_code completed with no output)`؛ فشل وقت إرجاع `Error: code run failed (<kind>): <message>`، و أصل حسب هل وجود قد التقاط محتوى، في ذلك بعد مرفق إضافة `Captured output:` و التقاط سطر. داخلي توزيع حدث فقط إبقاء في سجل في؛ نجاح كما يحتوي صورة فرعي نتيجة سوف في خارج طبقة نتيجة بعد بصفة حمل مصدر ملكية سياق إلحاق.

#### Token أثر

معامل، نتيجة و مرفق إضافة سياق أخذ قرار في بيانات، و سوف تكرار إرسال مباشر حتى ضغط (compaction). إخفاء أداة حد أيضا سوف في نموذج يمكن استدعاء هذه أداة قبل إزالة ذلك schema.

#### KV Cache أثر

فقط إلحاق؛ جديد مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV Cache بند بطلان.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح سجل التسجيل أي وقت حاجة خاص آخر إبقاء معنى. هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **تزامن سياسة لا هو حدث بوابة**:`executionMode()` مباشر قراءة قد تحليل أداة تعريف؛ إضافة فقط قدرة في ذاته يملك تعريف فوق إعلان تصنيف جهاز.
- **`tools/pre-execute` متعمد لا سماح تعديل كتابة `exec.arguments`**: لا فإن سجل سجل و عرض معامل سوف و فعلي تشغيل محتوى فقد ذهاب تزامن؛ تعديل كتابة تصميم سجل في[محاكاة اقتراح Agent Note](../../../.agents/notes/proposed/feature/2026-06-30-pre-tool-input-rewrite.zh.md) في.
- **استدعاء جهة تعريف subagent و سير العمل بنية تحويل إخراج ما زال اشتراط كائن أصل**: هذا هو مستهلك طبقة وجه حراسة حماية؛ مشترك schema مفردات و أداة إخراج دعم حمل مهمة معنى JSON أصل.
- **تعريف في `timeoutMs` فقط عمل إعلان لـ استخدام**: سجل التسجيل أبدا سوف قوي صنع تنفيذ قطع توقف وقت؛ يلزم قوي صنع تنفيذ، يجب استخدام `@deepseek-ai/dsh-tool-call-timeout-policy` حزمة تركيب طبقة.
- **PTC mode SDK لغة من حالي تحميل وقت التشغيل قرار، كما عرض طريقة حسب agent بينما غير حسب أداة**:`mode: ptc`/`both` سوف رفض تجميع نص التوجيه، حذف غير `ctx.ptcRuntime.language` لديه قد تسجيل SDK مصير؛ نفس عدد agent داخل لا يستطيع يجعل واحد أداة فقط استخدام Native، بينما آخر عدد فقط استخدام PTC.
- **PTC mode في بين قيمة فقط وجود في تنفيذ نطاق جزء، كما لا يوجد بايت حد أعلى**: هو جمع لا يمكن من جلسة إعادة تشغيل إعادة بناء، و ممكن استهلاك كل عملية أو worker داخل تخزين؛ فقط لديه خارج طبقة `run_code` إخراج تلقي worker يمكن إعداد صلب حد أعلى قيد.
- **كل مرة تشغيل كل سوف نيل نيل كل جديد `run_code` حالة**:MVP لا اعتماد حمل دائم REPL ريح إطار داخل نواة، لأن عبر استدعاء حالة لن ظهور في سجل في.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

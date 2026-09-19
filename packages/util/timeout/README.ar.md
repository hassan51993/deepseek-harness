---
description: "مشترك مهلة تشغيل حساب، قطع توقف وقت دمج دمج و مهلة و إلغاء تصنيف، توفير حاجة حد استدعاء جهة مهلة تلميح، بدء deadline و في بعد منطقة قسم اثنان من قدرة استخدام."
kind: "package-library"
---

# @deepseek-ai/dsh-timeout

[English](README.md) | العربية

## عام وصف

`dsh-timeout` يجعل استدعاء جهة لـ عمل ضبط لديه حد أعلى قطع توقف وقت، منطقة قسم محلي مهلة و فوق تنقل إلغاء، و مراقبة قياس تدفق صيغة قراءة هل فارغ خامل.`clampTimeout` في تلميح ناقص وقت ملء دخول خلفية قيمة افتراضية، يأخذ نتيجة حد في سماح الأكثر كبير قيمة بـ داخل، و في عمل بدء قبل رفض بلا فاعلية قيمة.`deadline` سوف اختيار تحديد مهلة و فوق تنقل إلغاء دمج إلى واحد إشارة في، بينما استدعاء جهة ما زال مسؤول حق صحيح إيقاف ذاتي ذات عملية، طقم وصل حرف أو مهمة.`idleWatchdog` فقط حساب حساب انتظار مزود قراءة الذي زهرة وقت؛ صفر ما زال إبقاء إعطاء خلفية ذاتي لديه لا حساب وقت عمل، بينما لا هو عام إعداد.

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

عند قدرة يلزم في استدعاء جهة مرئي مهلة تحت تشغيل واحد عمل وحدة وقت استخدام `deadline`، قراءة تدفق صيغة نقل وقت استخدام `idleWatchdog`. أولا استخدام `clampTimeout` تحقق استدعاء جهة تلميح، تأكيد حفظ وصول `deadline` `timeoutMs` مجموع هو صحيح لديه حد قيمة.

### حد مهلة تلميح

```ts
import { clampTimeout } from '@deepseek-ai/dsh-timeout'

declare const requested: number | undefined
declare const DEFAULT_TIMEOUT_MS: number
declare const MAX_TIMEOUT_MS: number

const timeoutMs = clampTimeout(requested, DEFAULT_TIMEOUT_MS, MAX_TIMEOUT_MS, 'bash-local: request.timeoutMs')
```

تلميح ناقص وقت `clampTimeout` ملء دخول خلفية قيمة افتراضية، يأخذ نتيجة حد في خلفية الأكثر كبير قيمة بـ داخل، و بـ استدعاء جهة توفير اسم حرف رفض غير صحيح عدد أو غير لديه حد قيمة تلميح. هذا موضع أبدا قبول 0: هو لا هو عام منع استخدام مهلة قيمة.

### في deadline تحت تشغيل عمل

```text
import { deadline, timeoutOf } from '@deepseek-ai/dsh-timeout'

using d = deadline(upstream, timeoutMs, 'BASH_TIMEOUT')
const outcome = await runWork({ signal: d.signal })   // work listens on d.signal and terminates itself
const timedOut = timeoutOf(d.signal, 'BASH_TIMEOUT') !== undefined
const aborted = d.signal.aborted && !timedOut
```

هذا إشارة فقط مسؤول إشعار: استدعاء جهة يجب وصل دخول ذاتي ذات إنهاء آلية——يأخذ `d.signal` نقل إعطاء `fetch`، أو استماع `abort` و قتل ميت عملية فرعية. يجعل promise و timer تنافس سرعة، سوف في عملية فرعية أو طقم وصل حرف ما زال في تسرب تسرب وقت حينئذ يجعل أداة استدعاء إتمام.

### تصنيف نتيجة

فقط لديه عند هذا deadline timer أولا إطلاق وقت،`timeoutOf(signal, code)` عندئذ استعادة مهلة سبب. نقل دخول أنت ذاتي ذات `code`، يجعل تصنيف في تضمين طقم مشهد في صحيح تأكيد تركيب: عند `upstream` ذاته هو deadline إشارة وقت، خارجي مهلة سوف يتم عند عمل عادي فوق تنقل إلغاء، بينما لا هو صوت تسمية محلي timer قد إلى مدة.

### استخدام فارغ خامل watchdog معالجة تدفق صيغة نقل

```ts
import { idleWatchdog } from '@deepseek-ai/dsh-timeout'

declare const upstream: AbortSignal | undefined
declare const idleMs: number
declare const providerIterator: AsyncIterator<unknown>

using watchdog = idleWatchdog(upstream, idleMs, 'LLM_STREAM_IDLE_TIMEOUT')
const next = await watchdog.next(providerIterator)    // timer runs only while this read is outstanding
```

timer فقط في بعض عدد مكرر `next()` بعد لم إتمام وقت بدء، و سوف بسبب لا إنتاج قيمة نقل نشط حركة عبر `pulse()` إعادة بدء، لذلك قراءة بين مستهلك معالجة وقت أبدا حساب دخول فارغ خامل. بين فصل يجب لـ صحيح لديه حد عدد، كما لا نيل كبير في `MAX_TIMER_DELAY_MS`.

### أي بعض عملية لا ضبط مهلة

محلي ملف `read`/`write`/`edit` لا قبول `timeoutMs`: ملف IO لا ضبط وقت حد أرض تشغيل، لأن قطع توقف وقت سوف في توقف عملية نظام ما زال سوف إتمام عمل.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا مكتبة بناء قيام في واحد حد لـ فوق: مشترك وقت ترتيب و تصنيف، يأخذ قوي صنع إنهاء إبقاء في محلي.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | `clampTimeout`،`deadline`،`idleWatchdog`،`timeoutOf`،`TimeoutReason`،`MAX_TIMER_DELAY_MS` |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذا عدد صاف أداة لا يملك حدث تدفق أو متغير وقت التشغيل بيانات؛ ذلك قيمة بديل عدد قيد من اختبار وحدة حفظ عائق. |

### deadline مثل أي دمج دمج مصدر

`deadline` بدء واحد timer، و عبر `AbortSignal.any` يأخذ هو و فوق تنقل إشارة دمج دمج؛`AbortSignal.any` قبول الأكثر أولا في توقف مصدر سبب، لذلك تنافس تنازع سوف عودة ربط لـ مفرد واحد سبب.`TimeoutReason` يحمل قدرة ذاتي لديه `code` و قد تدفق زوال `timeoutMs`؛ فقط لديه عند مهلة فوز خروج وقت `timeoutOf` عندئذ قراءة هو، فوق تنقل فوز خروج فإن إبقاء عادي في توقف سبب.`[Symbol.dispose]` صاف حذف timer.

### بلا مهلة مراقبة جندي قيمة

`timeoutMs <= 0` لا بدء timer، فقط تحويل إرسال فوق تنقل إشارة——لا يوجد فوق تنقل وقت إرجاع دائم لا في توقف إشارة——لذلك كل استدعاء جهة كل إبقاء نفس نوع استدعاء شكل. هذا مراقبة جندي قيمة خدمة في خلفية ذاتي لديه خلفية عمل؛ خارجي طلب تلميح في وصول `deadline` قبل أولا يتم تحقق لـ صحيح لديه حد قيمة.

### فارغ خامل watchdog لـ أي إعادة بدء

`idleWatchdog` إبقاء واحد مستقر دمج دمج إشارة، فقط في `next()` بعد لم إتمام وقت بدء timer؛ إتمام بعد إيقاف، لاحق يحتاج طلب أو `pulse()` إعادة بدء،dispose(مورد تحرير) وقت صاف حذف، تزامن يحتاج طلب يتم رفض. فقط لديه نقل طبقة مراقبة هذا إشارة، لذلك مزود حقيقي قراءة يجب استماع هو——DeepSeek و pi-ai مهايئ سوف في في توقف وقت إغلاق استجابة متن أو SDK طلب.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند أنت حاجة مستهلك أو مكتبة خلف بعد حد قرار وقت، قراءة قراءة التالي صفحة.

- [مهلة deadline مكتبة Agent Note](../../../.agents/notes/implemented/architecture/2026-07-06-timeout-deadline-library.ar.md)——مشترك وقت ترتيب، محلي قوي صنع إنهاء حد.
- [أداة استدعاء مهلة سياسة](../../guard/timeout-policy/README.ar.md)——قوي صنع تنفيذ قد إعلان أداة مهلة مستهلك.
- [bash مزود](../../shell/bash-local/README.ar.md)——قتل ميت عملية مجموعة قبل منصة deadline مستهلك.
- [نظام الملفات فرعي نظام](../../../docs/subsystems/filesystem.ar.md)——محلي ملف IO لـ أي لا ضبط وقت حد.

-----

<a id="model-experience"></a>
## تجربة النموذج

عبر تصيير مهلة نتيجة مهلة مستهلك بين وصل أثر نموذج.

#### KV Cache أثر

لن مباشر توجيه يؤدي بطلان؛ طلب بادئة أي تغيير من مهلة مستهلك مسؤول.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح هذا مكتبة لحظة معنى لا فعل ماذا. هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **فقط إرسال خروج إشعار**——deadline لا يمكن إيقاف تجاهل اختصار ذلك إشارة عمل؛ كل بند قدرة ما زال حاجة ذاتي ذات socket، عملية أو مهمة إنهاء مسار.
- **`timeoutMs <= 0` هو داخلي مفردات**——فقط لديه في الذي تابع خلفية قد تحليل سياسة بعد، هو عندئذ سوف منع استخدام محلي timer؛ أبدا سوف بصفة موجه إلى نموذج أو إضافة عام فتح صلة.
- **رقم واحد في توقف سبب قرار تصنيف**——عند فوق تنقل إلغاء مبكر في محلي timer حدوث وقت، أي جعل ذاتي ذات مهلة بعد أيضا سوف إلى مدة، هذا طبقة أيضا لا يمكن مجددا تقرير إبلاغ.
- **فارغ خامل watchdog لا هو مجموع deadline**——هو إبرة مقابل كل بعد لم إتمام مكرر يحتاج طلب إعادة بدء، و لحظة معنى ترتيب حذف مستهلك معالجة وقت.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

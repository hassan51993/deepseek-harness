---
description: "لـ يجب حد إرجاع سياق كمية أداة توفير محدود موجه إلى نموذج إخراج: بند و نص retainer، و معيار تحويل حذف صفحة قدم."
kind: "package-library"
---

# @deepseek-ai/dsh-output-retention

[English](README.md) | العربية

## عام وصف

استخدام `dsh-output-retention` حد أداة إرجاع إعطاء نموذج بند أو نص كمية، و تقرير إبلاغ حذف ماذا.`ItemRetainer` إبقاء لديه ترتيب رأس جزء نافذة، و يمكن تقرير إبلاغ دقيق حذف بند عدد؛`TextRetainer` إبقاء head،tail أو head-and-tail بايت نافذة، كما لن إرجاع بسبب قطع قطع بينما بلا فاعلية UTF-8.`formatRetentionNotice` إضافة متسق حذف فرعي جملة، كل أداة فإن توفير ذاتي ذات استعادة إشارة جذب. قسم مجموعة، سطر رقم،spill ملف و مزود خطأ ما زال عودة أداة مسؤول؛ مستهلك مباشر استيراد هذا مكتبة، بينما لا عبر `cordis.yml` تحميل.

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

كل هو أداة يجب حد ذلك نتيجة وصول نموذج عدد كمية، و مثل فعلي تقرير إبلاغ إسقاط محتوى أرض جهة، كل استخدام retainer. لديه ترتيب منطق وحدة اختيار `ItemRetainer`، موجه إلى بايت تدفق اختيار `TextRetainer`.

### حد بند قائمة

```ts
import { ItemRetainer } from '@deepseek-ai/dsh-output-retention'

declare const globMaxResults: number
declare const candidates: AsyncIterable<{ path: string }>
const retainer = new ItemRetainer<{ path: string }>({ kind: 'head', maxItems: globMaxResults })
for await (const entry of candidates) {
  retainer.push(entry)          // keep draining past the cap for an exact count
}
const { items, truncated, omitted } = retainer.finish()
```

`push()` تدريجي بند تقرير إبلاغ هذا بند هل يتم إبقاء،`finish()` إرجاع إبقاء بند و `omitted`——عند استدعاء جهة حمل متابعة إرسال دخول كل قد مراقبة وحدة وقت، هذا هو واحد دقيق حساب عدد. بحث أداة يمكن استلام تجميع كامل نتيجة تجميع لأجل spill ملف، معا فقط لـ نموذج إبقاء رقم واحد صفحة.

### حد نص تدفق

```text
import { TextRetainer } from '@deepseek-ai/dsh-output-retention'

const out = new TextRetainer({ kind: 'headTail', headBytes: headCap, tailBytes: tailCap })
child.stdout.on('data', (chunk: Buffer) => { out.push(chunk) })
const { text, omittedBytes } = out.finish()
```

`head`،`tail` و `headTail` حسب بايت بينما غير محرف أو سطر حساب عدد: عملية فرعية إدارة طريق و HTTP متن كل هو بايت تدفق.`finish()` سوف في كل قطع قطع موضع إصلاح قص لا كامل رمز نقطة، لذلك إرجاع نص أبدا سوف يحمل من قطع قطع جذب دخول استبدال محرف، رمز نقطة أيضا أبدا سوف عبر يتم حذف في بين جزء إعادة بناء.

### بناء حذف صفحة قدم

```ts
import { formatRetentionNotice } from '@deepseek-ai/dsh-output-retention'

declare const grepMaxMatches: number
declare const items: { length: number }
import type { Omitted } from '@deepseek-ai/dsh-output-retention'

declare const omitted: Omitted

const footer = formatRetentionNotice(
  { scope: 'grep', strategy: 'head', unit: 'items', limit: grepMaxMatches, kept: items.length, omitted },
  ({ kept }) => `Results capped at ${kept}. Narrow the pattern, path, or include to see more.`,
)
```

مكتبة مسؤول معيار تحويل حذف فرعي جملة (`Omitted 3 items.`) و يأخذ هو و أداة ذاتي لديه استعادة إشارة جذب تجميع وصل؛ فقط لديه أداة معرفة طريق استعادة حركة عمل، لذلك هذه إجراء لفظ من أداة توفير.

### `truncated` معنى طعم حال ماذا

`truncated` هو ميزانية واقع:retainer بسبب حد أعلى بينما حذف هذا يمكن نيل نيل محتوى. هو أبدا يمثل فوق تنقل لا كامل——إذن فشل، قفز مرور اثنان دخول صنع ملف، مزود جزء فشل و غير ممكن قراءة مرشح بند كل إبقاء في أداة مجال حقل في، أبدا و دخول `truncated`.

### حالي أداة مثل أي استخدام هو

| أداة | Retainer | أداة ما زال مسؤول ماذا |
|---|---|---|
| `glob` | `ItemRetainer`،`head` | spill ملف استلام تجميع، مسار خريطة، قد قفز مرور مرشح بند،`incomplete` |
| `grep` | `ItemRetainer`،`head` | spill ملف استلام تجميع، تدريجي مطابقة معاينة قطع قطع، قسم مجموعة، ترتيب ترتيب |
| `bash` | `TextRetainer`،`tail` أو `headTail` | spill ملف، خروج حالة، إشارة، مهلة، خلفية مهمة |
| `web_fetch` | `TextRetainer`،`head` أو `headTail` | مزود و مورد حد أعلى، خطأ حالة |
| `web_search` | `ItemRetainer`،`head` | «مصدر قد بلوغ حد أعلى» إشعار إجراء لفظ و مزود واقع |

`read` لا يخص هذا مكتبة: هو سطر نافذة قسم صفحة (`offset`/`limit`، سطر رقم،`totalLines`) هو ملف مخصص تابع مصير، مفرد عدد حذف حساب عدد لا يمكن يمثل هذا نافذة اثنان جانب.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا مكتبة بناء قيام في واحد قسم مغادرة لـ فوق: هو مسؤول «إبقاء ماذا، حذف ماذا» هذا عدد آلية مشكلة؛ عمل خدمة يحتوي معنى الكل عودة أداة حزمة كل.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | `ItemRetainer`،`TextRetainer`،`describeOmitted` و `formatRetentionNotice` |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذا عدد صاف أداة لا يملك حدث تدفق أو متغير وقت التشغيل بيانات؛ ذلك قيمة بديل عدد من اختبار وحدة حفظ إثبات. |

### اثنان عدد retainer، اثنان نوع مورد نموذج

`ItemRetainer` حد لديه ترتيب منطق وحدة، فقط إبقاء قبل `maxItems` عدد؛ استدعاء جهة حمل متابعة إرسال دخول كل قد مراقبة وحدة، لذلك حذف حساب عدد هو دقيق.`TextRetainer` استخدام نفس عدد بادئة/بعد لاحقة تراكم إضافة جهاز حد بايت:`head` فقط إبقاء بادئة،`tail` فقط إبقاء بعد لاحقة،`headTail` اثنان من كل إبقاء؛ تراكم إضافة جهاز في داخل تخزين في حتى كثير يحتفظ `headBytes + tailBytes + واحد قسم قطعة`، لذلك كبير تدفق لن بلا حد تراكم تراكم.

### ميزانية واقع مثل أي إبقاء صدق فعلي

`push()` إرجاع `kept`(هذا وحدة أو قسم قطعة هل كامل إبقاء) و `truncated`(هل قد إسقاط أي محتوى).`finish()` حسب فعلي إرجاع بايت تقرير إبلاغ حذف، لذلك إسقاط جزء رمز نقطة بايت UTF-8 حد إصلاح قص أيضا سوف يتم حساب دخول——فقط حسب ميزانية دفع توجيه إشعار سوف عال تقدير إبقاء نص.`describeOmitted` فقط لـ `exact` ضرب طبع حساب عدد؛`unknown` لا ضرب طبع حساب عدد، لأن استدعاء جهة لا يوجد توفير.

### read تصيير ترتيب حذف

`read` `offset`/`limit` قسم صفحة هو سطر نافذة مصير، مقابل الذي اختيار نافذة لديه ذاتي ذات بايت حد أعلى؛ مفرد عدد `Omitted` قيمة لا يمكن يمثل هذا نافذة اثنان جانب، لذلك هو لا يخص هذا مكتبة.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند أنت حاجة مستهلك أو مكتبة خلف بعد حد قرار وقت، قراءة قراءة التالي صفحة.

- [spill سياسة](../../spill/spill-policy/README.zh.md)——تركيب `TextRetainer`، محيط التفاف spill ملف إشعار بناء محدود معاينة.
- [spill فرعي نظام](../../../docs/subsystems/spill.zh.md)——هذا مكتبة معاينة آلية الذي خدمة spill مفردات.
- [ملف بحث أداة](../../fs/tool-fs-search/README.zh.md)——لـ spill استلام تجميع كامل نتيجة `ItemRetainer` مستهلك.

-----

<a id="model-experience"></a>
## تجربة النموذج

عبر تصيير إبقاء محتوى و حذف بيانات وصفية إبقاء مستهلك بين وصل أثر نموذج.

#### KV Cache أثر

لن مباشر توجيه يؤدي بطلان؛ طلب بادئة أي تغيير من إبقاء مستهلك مسؤول.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح retainer لحظة معنى لا تغطية ماذا. هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **بند إبقاء فقط دعم حمل `head`**——tail،head/tail، قسم صفحة، قسم مجموعة و مزود كامل صفة دلالة ما زال عودة أداة كل.
- **نص إبقاء موجه إلى بايت**——`read` قسم صفحة انتظار سطر نافذة و محرف نافذة حاجة مفرد وحيد مصير؛ قطع قطع ممكن إسقاط جزء UTF-8 حد بايت، بـ إبقاء إرجاع نص صالح.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

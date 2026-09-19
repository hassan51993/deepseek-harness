---
description: "ctx.web Perplexity بحث مزود: نشر جهة مثل أي تركيب OpenAI توافق Perplexity بحث، نيل نيل توليد جواب سجل و مرجع."
kind: "package-reference"
---

# @deepseek-ai/dsh-web-search-perplexity

[English](README.md) | العربية

## عام وصف

لديه `dsh-web-search-perplexity`،harness يمكن عبر Perplexity بحث web، مرة استدعاء معا نيل نيل نموذج توليد جواب سجل و يمكن مرجع مصدر. عند نشر يحتفظ Perplexity API مفتاح، و أمل نظر نيل نيل توليد جواب سجل وقت اختيار هو.Perplexity لا يوجد نتيجة عدد كمية تحكم، لذلك إرجاع مصدر سوف في أمر بعد يتم مقتطع إلى طلب حد أعلى.Perplexity حذف بنية تحويل نتيجة بيانات وصفية وقت، مصدر رجوع لـ فقط يحتوي URL مرجع. موجه إلى نموذج `web_search` أداة يقع في `dsh-tool-web`.

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

في قد تحميل web خدمة تركيب في تركيب هذا مزود؛ هو بـ `perplexity` بحث مزود هوية تسجيل، لذلك عند هو هو وحيد متاح بحث خلفية وقت،`ctx.web.search()` سوف تلقائي تحليل إلى هو——أيضا يمكن استخدام `searchProvider: perplexity` ثابت.

### أي وقت اختيار

عند نشر يحتفظ Perplexity API مفتاح، و أمل نظر مرة بحث معا نيل نيل نموذج توليد جواب سجل و يمكن مرجع مصدر وقت اختيار هذا خلفية. مفتاح لـ فارغ أو طرف نقطة أساس عنوان لا يمكن تحليل وقت، مزود غير ممكن استخدام——كل مرة بحث استدعاء كل سوف بـ بنية تحويل خطأ فشل.

### الأكثر صغير إعداد

تحميل web خدمة و هذا مزود؛API مفتاح رجوع إلى بدء بيئة في `$PERPLEXITY_API_KEY`، ذلك بقية ضبط كل لديه أمان قيمة افتراضية.

```yaml
- name: '@deepseek-ai/dsh-web'
- name: '@deepseek-ai/dsh-web-search-perplexity'
  config:
    apiKey: !!js process.env.PERPLEXITY_API_KEY
```

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---|---|
| `apiKey` | `$PERPLEXITY_API_KEY` | Perplexity API مفتاح؛ لـ فارغ أو ناقص وقت مزود غير ممكن استخدام |
| `baseURL` | `https://api.perplexity.ai` | طرف نقطة أساس عنوان؛ إلحاق `/chat/completions`. لا يمكن تحليل وقت مزود غير ممكن استخدام |
| `model` | `sonar` | بحث نموذج اسم |
| `maxTokens` | `1024` | توليد جواب سجل token حد أعلى (`max_tokens`) ؛ يجب هو صحيح كامل عدد |
| `searchRecency` | (لم ضبط) | بـ `search_recency_filter` إرسال جديد قريب مسار درجة نافذة:`day`،`week`،`month` أو `year`. لم ضبط وقت لا إرسال مرور ترشيح شرط |

توليد[إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-web-search-perplexity) هو كل تلقي دعم حمل حقل و ذلك JSDoc نفاد كل صيغة حق مصدر.

### بحث إرجاع ماذا

`content` يحمل Perplexity توليد جواب سجل.`sources[]` أولوية استخدام بنية تحويل `search_results[]`(`url`،`title`،`snippet`،`publishedAt` أخذ ذاتي `date`) ، فقط عند `search_results` ناقص وقت عندئذ رجوع إلى فقط يحتوي URL `citations[]` عدد مجموعة——هذا صحيح هو خدمة فوق `title`/`snippet`/`publishedAt` لـ اختياري حقل سبب.Perplexity لا عام نتيجة عدد كمية تحكم، لذلك خدمة عبر مقتطع و علامة قدوم قوي صنع تنفيذ `maxResults`.

### فشل و استعادة

مزود فشل——HTTP خطأ، شبكة فشل، استجابة جسم لا يمكن تحليل أو بنية لا رمز——بـ `WebError` `WEB_PROVIDER_ERROR` عرض؛ في توقف طلب بـ `WEB_ABORTED` عرض.HTTP إعادة تحديد نحو سوف في وصول `Location` إشارة نحو هدف قبل يتم رفض، و بـ `WEB_PROVIDER_ERROR` عرض. استدعاء جهة أصل حسب رمز خطأ إجراء توجيه؛ موجه إلى نموذج `web_search` أداة سوف في ذاتي ذات خطأ حزمة تركيب طبقة داخل يأخذ فشل عرض إعطاء نموذج.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير مزود خلف بعد تصميم قرار؛ يمكن مراقبة سلوك قد في[استخدام هذه الحزمة](#use-this-package) في كامل شرح.

### تصميم إدارة فكرة

هذا مزود هو Perplexity chat-completions طرف نقطة لـ فوق رقيق مهايئ، التزام دوران اثنان بند لحظة معنى قاعدة:

- **توليد جواب سجل مباشر استخدام عمل `content`.** و أخرى بحث خلفية مختلف،Perplexity إرجاع نموذج توليد جواب سجل، هذا مزود سوف ذلك بصفة مواصفة تحويل `content` حقل نفاذ نقل.
- **بنية تحويل مصدر أولوية؛ فقط يحتوي URL مرجع هو رجوع.** `search_results[]` يحمل يمكن نقل غرس حقل؛`citations[]` فقط يحمل URL، خدمة مفردات يأخذ هذه حقل ضبط لـ اختياري، صحيح هو لـ هذا نوع حال حال.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | إضافة مدخل: إعداد schema، بيئة متغير رجوع، مزود تسجيل |
| [`src/provider.ts`](src/provider.ts) | `PerplexitySearchProvider`: طلب توزيع، في توقف تصنيف، جواب سجل و مصدر خريطة |
| [`src/types.ts`](src/types.ts) | chat-completions استجابة Perplexity بروتوكول نوع |
| — | لا إصدار وقت التشغيل ثابت كمية إعداد طقم مدخل؛ حذف الذي تابع seam قوي صنع تنفيذ اتفاق خارج، هذه الحزمة لا عام مستقل حدث تسلسل أو متغير بيانات علاقة. |

### طلب و خريطة مسار

`search()` بـ `redirect: 'error'` يأخذ استعلام وصل نفس نموذج،token حد أعلى و اختياري جديد قريب مسار درجة مرور ترشيح شرط POST إلى `{baseURL}/chat/completions`. استجابة `content` تغيير لـ `content`؛ وجود `search_results[]` وقت هو تغيير لـ `sources[]`، لا فإن كل `citations[]` بند تغيير لـ فقط يحتوي URL مصدر؛ خدمة في إرجاع مسار فوق تطبيق نهائي `maxResults` حد أعلى. في توقف——اسم لـ `AbortError` `DOMException`——تغيير لـ `WEB_ABORTED`؛ ذلك بقية حال حال تغيير لـ `WEB_PROVIDER_ERROR`.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند حزمة درجة اتفاق لا كاف استخدام وقت قراءة قراءة التالي صفحة. هو جمع من مشترك مفردات تدريجي خطوة دخول خدمة، موجه إلى نموذج أداة و تصميم اعتماد حسب.

- [web فرعي نظام](../../../docs/subsystems/web.ar.md)——نفاد كل صيغة بحث طلب/نتيجة مفردات و رمز خطأ.
- [web حزمة خريطة](../README.ar.md)——ستة حزمة بيت عائلة و كل زاوية لون.
- [dsh-web](../web/README.ar.md)——هذا مزود تسجيل دخول web خدمة.
- [dsh-tool-web](../tool-web/README.ar.md)——تصيير هذا مزود مصدر موجه إلى نموذج `web_search` أداة.
- [توليد إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-web-search-perplexity)——كل تلقي دعم حمل إعداد حقل و ذلك مصدر إعلان.
- [web قدرة seam قرار](../../../.agents/notes/implemented/architecture/2026-06-24-web-capability-seam.ar.md)——بحث و إمساك أخذ لـ أي مشترك استخدام واحد بند مزود اختيار خدمة.

-----

<a id="model-experience"></a>
## تجربة النموذج

### مساعد مساعدة Perplexity طلب

#### نموذج يرى محتوى

مستقل Perplexity نموذج عبر chat-completions طرف نقطة سوف `<query>` أصل مثال بصفة وحيد مستخدم رسالة استقبال. هذا طلب لا يخص جلسة نموذج سياق.

#### Token أثر

كل مرة بحث كل سوف إنتاج مستقل مزود token؛`maxTokens` حد توليد جواب سجل.

#### KV Cache أثر

و جلسة طلب ذاكرة مؤقتة متبادل متبادل مستقل. نفس نموذج توجيه تحت نفسه استعلام ممكن إعادة استخدام مزود ذاكرة مؤقتة؛ استعلام أو توجيه تغيير سوف بناء قيام مختلف بادئة.

### بين وصل جلسة أداة نتيجة

#### نموذج يرى محتوى

عبر `dsh-tool-web`، جلسة نموذج سوف يرى توليد جواب سجل و بنية تحويل نتيجة بيانات وصفية، أو فقط يحتوي URL مرجع. هذا مزود تأكيد قطع خطأ رسالة لـ `Perplexity search aborted`،`Perplexity search request failed: <error>` و `Perplexity returned an unprocessable response body: <error>`؛HTTP فشل إبقاء مزود رسالة. خطأ حزمة تركيب طبقة يخص مستهلك.

#### Token أثر

تسجيل لن مباشر إنتاج جلسة token. جواب سجل و مصدر token أخذ قرار في بيانات، مصدر عدد كمية تلقي خدمة حد؛ إبقاء نتيجة أو خطأ سوف تكرار إرسال، مباشر إلى حدوث ضغط (compaction).

#### KV Cache أثر

فقط إلحاق؛ جديد مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV Cache بند بطلان.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح مزود في أي بعض حال حال تحت لا دمج ملائم. هو جمع هو حالي حزمة قيد.

- **مرجع رجوع مصدر فقط يحتوي URL**——Perplexity حذف بنية تحويل `search_results[]` وقت، مصدر لا يحتوي `title`/`snippet`/`publishedAt`، لذلك أداة فقط تصيير صاف رئيسي آلة اسم وسم.
- **تجاوز كمية إرجاع مصدر ما زال سوف زيادة token إزالة استهلاك و تأخير متأخر**——بروتوكول لا يوجد نتيجة عدد كمية تحكم،`maxResults` فقط قدرة من خدمة في أمر بعد مقتطع.
- **فقط عام `model`/`maxTokens`/`searchRecency`**——Perplexity أخرى بحث تحكم بند (مجال اسم مرور ترشيح شرط،`web_search_options` سياق كبير صغير، صورة) انتظار مزود غير متصل خدمة حقل (رؤية [seam Agent Note](../../../.agents/notes/implemented/architecture/2026-06-24-web-capability-seam.ar.md)).
- **حسب خطأ شكل حالة تصنيف في توقف**——فقط لديه اسم لـ `AbortError` `DOMException` عندئذ خريطة لـ `WEB_ABORTED`؛ يحمل ذاتي تعريف سبب في توقف (مثال مثل `dsh-timeout` `TimeoutReason`) عرض لـ `WEB_PROVIDER_ERROR`.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

هذا ملاحظة تطوير هو صيانة من عمل سياق: فتح وضع مشكلة و بعد لم قرار استكشاف جهة نحو. هو واضح لا أداة مرجعي صفة——قد تسليم سلوك، حد و حيث تحديد إدارة من بـ فوق نص و متبادل صلة Agent Note لـ دقيق.

#### لم قدوم: أكثر عرض Perplexity تحكم وجه

Perplexity مجال اسم مرور ترشيح شرط،`web_search_options` سياق كبير صغير و صورة دعم حمل ما زال لم عام. عام هو جمع حاجة أولا لديه مزود غير متصل خدمة حقل، يجعل بيت عائلة بـ واحد تنسيق ضبط متسق تحكم بند، بينما غير مصنع تجارة مخصص لديه معامل طريقة إضافة جديدة.

</details>

---
description: "web وصول قدرة بيت عائلة حزمة خريطة: بحث و إمساك أخذ خدمة، ذلك مزود خلفية، و إزالة استهلاك هو جمع موجه إلى نموذج أداة."
kind: "package-group"
---

# web/:web وصول قدرة بيت عائلة

[English](README.md) | العربية

## عام وصف

`web/` حزمة يجعل نموذج عبر `web_search` و `web_fetch` أداة بحث عام مشترك web و إمساك أخذ HTTP(S) صفحة. نشر يمكن لـ بحث اختيار Exa،Perplexity أو DeepSeek، و عبر مجهول اسم HTTP(S) وصول إمساك أخذ صفحة؛ متاح صفة و مورد حد أعلى أخذ قرار في إعداد مزود. هذا بيت عائلة لأجل بحث و صفحة فحص بحث، لا لأجل تفاعل صيغة تصفح تصفح، محتوى رفع أخذ أو تدريجي URL سياسة تنفيذ. مزود تغير وقت، نموذج ما زال قدرة نيل نيل متسق أداة سلوك، إلغاء و خطأ تقرير إبلاغ.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

ستة عدد حزمة قسم آخر تحمل تحمل web زاوية لون؛ كامل مفردات و اتفاق بـ فرعي نظام مشاركة اعتبار وثيقة لـ دقيق.

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`web/`](web/README.ar.md) | بحث و إمساك أخذ خدمة: عبر يمكن متبادل تبديل خلفية بحث و إمساك أخذ URL، موحد واحد اختيار و خطأ سياسة | `ctx.web` |
| [`web-search-exa/`](web-search-exa/README.ar.md) | عبر Exa بحث web | تسجيل إلى `ctx.web` |
| [`web-search-perplexity/`](web-search-perplexity/README.ar.md) | عبر Perplexity بحث web | تسجيل إلى `ctx.web` |
| [`web-search-deepseek/`](web-search-deepseek/README.ar.md) | عبر DeepSeek أصلي بحث بحث web | تسجيل إلى `ctx.web` |
| [`web-fetch-http/`](web-fetch-http/README.ar.md) | مجهول اسم إمساك أخذ عام مشترك HTTP(S) صفحة | تسجيل إلى `ctx.web` |
| [`tool-web/`](tool-web/README.ar.md) | نحو نموذج عام `web_search` و `web_fetch` | تسجيل إلى `ctx.tools` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار وثيقة حل مشترك مفردات، مجددا نظر مفرد واحد مزود اختيار خدمة خلف بعد تصميم قرار.

- [web فرعي نظام](../../docs/subsystems/web.ar.md)——بحث و إمساك أخذ طلب و نتيجة، مزود متاح صفة،`WebError` و عام عنوان قوي صنع قاعدة.
- [web قدرة seam قرار](../../.agents/notes/implemented/architecture/2026-06-24-web-capability-seam.ar.md)——بحث و إمساك أخذ لـ أي مشترك استخدام واحد بند مزود اختيار خدمة.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

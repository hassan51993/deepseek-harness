---
description: "حمل دائم جلسة بيانات مستو وجه حزمة خريطة: حفظ دائم seam و ذلك خلفية، فحص نقطة سياسة، إسقاط، أساس في سجل عنوان و خارج إرسال جلسة بعيد قياس."
kind: "package-group"
---

# session/ — حمل دائم جلسة بيانات مستو وجه

[English](README.md) | العربية

## عام وصف

session مجموعة يجعل محادثة حمل دائم حفظ، استعادة قد إصدار سجل صيغة، و جعل قد إيداع تاريخ في إعادة بدء بعد ما زال متاح. تخزين و فحص نقطة حزمة حفظ حماية طلب، أداة فرعي أثر و اكتمل خطوة؛ إسقاط حزمة توليد عميل متاح قيمة؛ عنوان حزمة لـ جلسة تسمية؛ بعيد قياس حزمة فوق تقرير نشط حركة. أولا استخدام مع منتج تسليم JSONL تخزين، مجددا إضافة فحص نقطة، و فقط حسب نشر حاجة إضافة إسقاط، عنوان سياسة أو بعيد قياس. كل حزمة README مسؤول كل منها حفظ إثبات و إعداد، نفس درجة استعلام مجموعة فإن توفير مستقل قراءة و أداة وصول.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

هذا مجموعة قسم لـ أربعة عدد بيت عائلة: حمل دائم تخزين (حفظ دائم seam، خلفية، فحص نقطة سياسة) ، إسقاط، عنوان و بعيد قياس. كل حزمة README مسؤول كل منها اتفاق و إعداد.

### حفظ دائم

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`session-format/`](session-format/README.ar.md) | صاف متبادل مجاور صيغة سلسلة و ناتج تحقق مكتبة | مكتبة، لا استخدام ctx key |
| [`session-format-v0-to-v1/`](session-format-v0-to-v1/README.ar.md) | تجميد ربط released-v0 حل رمز جهاز، و إلى released v1 ثابت انتظار ترحيل | مكتبة، لا استخدام ctx key |
| [`session-format-v1-to-v2/`](session-format-v1-to-v2/README.ar.md) | تجميد ربط released-v1 حل رمز جهاز، و ترحيل إلى released v2 وقت سوف تغيير أساس عدد Assistant تدفق ترحيل | مكتبة، لا استخدام ctx key |
| [`session-format-catalog/`](session-format-catalog/README.ar.md) | تلقائي توليد قد تسليم متبادل مجاور ترحيل ساكن حالة دليل | مكتبة، لا استخدام ctx key |
| [`session-persistence/`](session-persistence/README.ar.md) | تعريف حمل دائم جلسة تخزين خدمة، و كل خلفية تركيب مشترك كتابة تنسيق ضبط آلية | `ctx.sessionPersistence` |
| [`session-persistence-jsonl/`](session-persistence-jsonl/README.ar.md) | مع منتج تسليم خلفية: تدريجي Session استخدام غير ممكن تغيير مواصفة generation ملف اسم و ترتيب هو إصدار بعد استمرار؛ اختياري Zstandard ضغط | تسجيل إلى `ctx.sessionPersistence` |
| [`session-checkpoint-policy/`](session-checkpoint-policy/README.ar.md) | يجعل نموذج طلب، قمة طبقة أداة فرعي أثر و اكتمل خطوة في تحت واحد خطوة حركة عمل قبل حفظ دائم | حزمة تركيب `ctx.llm` و `ctx.tools` |
| [`session-log-deepseek/`](session-log-deepseek/README.ar.md) | يأخذ زيادة كمية مواصفة سجل بصفة اختياري رسمي جهة DeepSeek طلب بيانات وصفية فوق نقل | مساهمة `dsh_session_log` |

### إسقاط

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`session-projection/`](session-projection/README.ar.md) | تعريف و قيادة يأخذ قد إيداع حدث طي لـ كامل حالي قيمة إسقاط وحدة | `ctx.sessionProjections` |
| [`session-projection-cache/`](session-projection-cache/README.ar.md) | حفظ دائم إسقاط فحص نقطة، جعل بارد قراءة قفز مرور كل كمية سجل تحميل | `ctx.sessionProjectionCache` |
| [`session-stats/`](session-stats/README.ar.md) | عبر `sessionStats` وحدة توفير كل سجل جلسة حساب عدد و جدار ساعة وقت | تسجيل إلى `ctx.sessionProjections` |
| [`session-turn-outline/`](session-turn-outline/README.ar.md) | عبر `turnOutline` وحدة توفير كل سجل جولة كبير خطوط (جولة،`turn/start` seq، نص التوجيه معاينة) | تسجيل إلى `ctx.sessionProjections` |

### عنوان

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`session-title/`](session-title/README.ar.md) | أساس في سجل جلسة عنوان، حمل تحديد صفة رجوع و واحد اختياري مزود | `ctx.sessionTitle` |
| [`session-title-llm/`](session-title-llm/README.ar.md) | توفير مزود حزمة مشترك نموذج عنوان توليد سياسة | مكتبة، لا استخدام ctx key |
| [`session-title-first-prompt-llm/`](session-title-first-prompt-llm/README.ar.md) | أصل حسب رقم واحد بند دمج إطار شخص صنف رسالة لـ جلسة توليد عنوان | تسجيل إلى `ctx.sessionTitle` |
| [`session-title-all-prompts-llm/`](session-title-all-prompts-llm/README.ar.md) | أصل حسب كل دمج إطار شخص صنف رسالة لـ جلسة توليد عنوان | تسجيل إلى `ctx.sessionTitle` |

### بعيد قياس

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`session-telemetry/`](session-telemetry/README.ar.md) | التقاط جلسة نشط حركة و يأخذ سجل تسليم إعطاء إعداد فوق تقرير خلفية | `ctx.sessionTelemetry` |
| [`session-telemetry-otel/`](session-telemetry-otel/README.ar.md) | عبر OpenTelemetry سجل بـ `FEEDBACK_ONLY` أو `DISABLED` نمط إلقاء تمرير بعيد قياس | تسجيل إلى `ctx.sessionTelemetry` |

نفس وقت فقط سماح واحد عنوان مزود تسجيل؛ لم تسجيل وقت، عنوان خدمة إبقاء ذلك تحديد صفة رجوع. تحت وجه فرعي نظام صفحة هو كل بيت عائلة خلفية غير متصل مشاركة اعتبار مورد مادة.

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [جلسة حفظ دائم فرعي نظام](../../docs/subsystems/persistence.ar.md)——خلفية غير متصل خدمة دلالة،flush فحص نقطة و انهيار انهيار استعادة.
- [جلسة إسقاط فرعي نظام](../../docs/subsystems/session-projection.ar.md)——إسقاط وحدة اتفاق و قيادة دلالة.
- [جلسة عنوان فرعي نظام](../../docs/subsystems/session-title.ar.md)——عنوان مورد إطار، رجوع و مزود مسار.
- [جلسة بعيد قياس فرعي نظام](../../docs/subsystems/session-telemetry.ar.md)——التقاط، انفصال حساس و إلقاء تمرير نمط.
- [جلسة فرعي نظام](../../docs/subsystems/session.ar.md)——هذا مجموعة كل حزمة حفظ دائم أو إرسال توليد فوري حدث سجل.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

---
description: "LLM(كبير لغة نموذج) قدرة حزمة مجموعة: واحد مزود غير متصل نموذج استدعاء خدمة،DeepSeek و pi-ai مزود مهايئ، طلب إعادة محاولة تنفيذ، و أداة تجهيز إعادة تشغيل شعور معرفة token حساب كمية."
kind: "package-group"
---

# llm/ — LLM قدرة بيت عائلة

[English](README.md) | العربية

## عام وصف

llm مجموعة توفير harness نموذج استدعاء قدرة: واحد مزود غير متصل خدمة، أي تركيب كل يمكن عبر هو نحو نموذج مزود إرسال بدء تدفق صيغة طلب، خارج إضافة مهايئ، مزود مخصص استخدام طلب بيانات وصفية، إعادة محاولة تنفيذ و حساب كمية. نواة قلب `llm` حزمة تعريف كل إضافة و جلسة سجل استخدام رسالة، محتوى كتلة و تدفق صيغة قسم قطعة مفردات؛ مزود مهايئ يأخذ بعض عدد مزود بروتوكول صيغة (wire format) قلب ترجمة لـ هذا مفردات؛DeepSeek طلب توسيع إضافة في نموذج إدخال خارج مساهمة أداة لديه دورة الحياة ملكية بيانات وصفية؛`llm-retry` في حفظ دائم agent(ذكي جسم) خطوة حد فوق إعادة ركض فشل طلب؛`token-meter` من حفظ دائم سجل قياس كمية طلب و سياق ضغط قوة. هذا صفحة صف خروج هذا حزمة مجموعة مجموعة صار؛ كل حزمة README مسؤول كل منها حزمة درجة اتفاق.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`llm/`](llm/README.zh.md) | عبر قد تسجيل مزود مهايئ تدفق صيغة إرسال بدء مرة نموذج استدعاء، و مشترك harness رسالة، كتلة و قسم قطعة مفردات | `ctx.llm` |
| [`llm-deepseek/`](llm-deepseek/README.zh.md) | بـ DeepSeek chat-completions مباشر وصل،thinking و صورة إدخال خدمة `deepseek-official` توجيه | تسجيل إلى `ctx.llm` |
| [`llm-pi-ai/`](llm-pi-ai/README.zh.md) | عبر pi-ai دليل و بروتوكول صيغة خدمة إعداد مزود توجيه، يشمل يد عمل إعلان شبكة صلة | تسجيل إلى `ctx.llm` |
| [`deepseek-llm-api-extensions/`](deepseek-llm-api-extensions/README.zh.md) | في رسمي جهة DeepSeek طلب فوق تسجيل أداة لديه دورة الحياة ملكية قمة طبقة حقل | `ctx.deepseekLlmApiExtensions` |
| [`plugin-package-inventory-deepseek/`](plugin-package-inventory-deepseek/README.zh.md) | لـ رسمي جهة DeepSeek طلب مساهمة حالي تفعيل Loader حزمة بيان | مساهمة `dsh_plugin_packages` |
| [`llm-retry/`](llm-retry/README.zh.md) | في حمل دائم agent خطوة حد فوق حسب كل مزود سياسة إعادة محاولة فشل نموذج طلب | استماع `agent/request-error` |
| [`token-meter/`](token-meter/README.zh.md) | استخدام ثابت بدء إرسال صيغة قاعدة من حمل دائم جلسة سجل قياس كمية طلب و سياق ضغط قوة | `ctx.tokenMeter` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [LLM تدفق صيغة فرعي نظام](../../docs/subsystems/llm-streaming.zh.md)——رسالة و كتلة نوع، تجميع بعد نموذج طلب،`StreamChunk` بروتوكول و مهايئ اتفاق (adapter contract).
- [Token حساب كمية فرعي نظام](../../docs/subsystems/token-meter.zh.md)——`ctx.tokenMeter` خلف بعد قياس كمية دلالة.
- [توأم توليد LLM مهايئ](../../.agents/notes/implemented/architecture/2026-06-13-twin-llm-adapters.zh.md)——لـ ماذا DeepSeek توجيه تسليم اثنان عدد بنية مختلف مهايئ.
- [حسب توجيه نموذج سياق](../../.agents/notes/implemented/architecture/2026-07-20-routed-model-context-and-compaction-policy.zh.md)——loop مثل أي توجيه نموذج طلب و ضغط سياق.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

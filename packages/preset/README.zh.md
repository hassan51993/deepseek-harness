---
description: "preset مجموعة أرض رسم: حسب جلسة من preset ملف تجميع agent، توفير تصفح تصفح هذا مجموعة مستخدم و صيانة من قراءة قراءة."
kind: "package-group"
---

# packages/preset

[English](README.md) | العربية

## عام وصف

preset مجموعة توفير حسب جلسة agent(ذكي جسم) تجميع:agent preset هو واحد دليل، داخل يحتوي واحد نسخة `agent.cordis.yml`؛ من preset تجميع جلسة سوف استخدام هذا preset أداة، نص التوجيه مقطع سقوط و skill(تقنية قدرة) ، بينما أخرى جلسة ما زال كل منها استخدام ذاتي ذات أداة، نص التوجيه مقطع سقوط و skill.`agent-presets` يملك اسم مفرد——مقابل قد إعداد أصل دليل و harness home اكتشاف، تلقي منع حماية حسب agent تركيب، و فقط عبر نسخ إنشاء preset طريقة——`persona` فإن توفير يمكن تجميع سطر، يجعل preset لا توقف قدرة تغيير agent أداة، أيضا قدرة تغيير هو هوية. اثنان من دمج بدء قدوم يجعل واحد عملية يمكن معا تشغيل كثير عدد تجميع طريقة مختلف agent.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`agent-presets`](agent-presets/README.zh.md) | preset اسم مفرد، مقابل تلقي معلومة مهمة أصل دليل و مستخدم أصل دليل اكتشاف، حسب agent تجميع، فقط عبر نسخ إنشاء preset | `ctx.agentPresets` |
| [`persona`](persona/README.zh.md) | preset تركيب يمكن تجميع شخص ضبط سطر، لأجل حجب حجب أو استبدال نشر درجة شخص ضبط | — |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [`AgentPresets` مشاركة اعتبار](../../docs/subsystems/core.zh.md#ctxagentpresets--agentpresets)——اكتشاف، تركيب، وراثة و إعادة مجموعة.
- [Scope فرعي نظام](../../docs/subsystems/scope.zh.md)——scope key، و تركيب وصل دخول agent وقت الذي استخدام أب سلسلة.
- [توجيه النظام فرعي نظام](../../docs/subsystems/system-prompt.zh.md)——preset نص التوجيه مقطع سقوط مثل أي تسجيل و تجميع.
- [حسب جلسة تجميع agent preset Agent Note](../../.agents/notes/implemented/architecture/2026-08-03-per-session-agent-presets.zh.md)——تصميم إدارة من و تجهيز اختيار خطة.

نشر تسليم preset يقع في [`agent-presets/presets/`](agent-presets/presets)——واحد preset واحد دليل، ذلك نسخة دليل قائمة حينئذ هو اسم مفرد؛ في هذا داخل مجددا صف واحد مرة فقط سوف كثير خروج واحد نسخة حاجة تزامن اسم مفرد.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

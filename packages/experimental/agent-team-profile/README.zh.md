---
description: "تراكم إضافة في dsh-base فوق عام إصدار فعلي تحقق صفة Agent Teams profile طبقة، توفير teammate تفويض إرسال و fresh workflow فرعي بديل إدارة."
kind: "package-bundle"
---

# @deepseek-ai/dsh-experimental-agent-team-profile

[English](README.md) | العربية

## عام وصف

`dsh-experimental-agent-team-profile` هو في `@deepseek-ai/dsh-base` لـ فوق تفعيل [Agent Teams](../agent-team/README.zh.md) عام فعلي تحقق صفة profile طبقة. هو patch سوف إدراج دخول Team domain و Team-scoped أداة، و منع استخدام عادي subagent تفويض إرسال و اسم إعادة تراكم عام continuable-child control.Workflow ما زال يمكن إنشاء fresh فرعي بديل إدارة.dsh تثبيت مع مرفق هذه الحزمة بصفة اختياري تركيب حزمة، مع مرفق profile كل لن تفعيل هو؛ يمكن في Web جانب شريط إضافة صفحة فتح بدء، أو صريح إضافة إلى قد ابتدائي تحويل profile.

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

### تثبيت إلى profile

سوف هذه الحزمة إضافة إلى قد ابتدائي تحويل profile، لكن بعد تشغيل واحد اشتراط Lead تفويض إرسال عمل مهمة:

```sh
dsh plugin --profile headless add @deepseek-ai/dsh-experimental-agent-team-profile
dsh --profile headless "Use Agent Teams to split this task between two teammates, wait, and summarize."
```

profile يجب قد يتضمن `@deepseek-ai/dsh-base`، هذا طبقة سوف استخدام منها Subagent خدمة و مزود إعداد سطر. تنفيذ `dsh plugin --profile <name> remove @deepseek-ai/dsh-experimental-agent-team-profile` إزالة هذه الحزمة وقت،bundle أيضا سوف من profile لديه ترتيب طبقة قائمة في إزالة.

### نيل نيل وظيفة

هذا طبقة سوف إضافة Agent Teams domain، و Team-scoped إنشاء،roster، رسالة،interrupt، انتظار و مهمة لوح أداة. مباشر تفويض إرسال استخدام دعم حمل fresh و fork سياق `spawn_teammate`.`subagent`،`subagent_fork` أداة و اسم إعادة تراكم عام child control متساو يتم منع استخدام.Workflow إبقاء base profile `spawn` مزود، قاع طبقة Subagent خدمة و اثنان عدد مزود ما زال توفير teammate و workflow استخدام.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذه الحزمة وقت التشغيل محتوى هو [`cordis.patch.yml`](cordis.patch.yml). في `dsh-base` بعد تطبيق وقت،patch سوف منع استخدام `tool-subagent-control`،`tool-subagent-list-agents`،`tool-subagent` و `tool-subagent-fork`، و بـ صريح provider و حد إدراج دخول Team خدمة و أداة سطر.

| ملف | مسؤولية |
|---|---|
| [`cordis.patch.yml`](cordis.patch.yml) | تراكم إضافة في `dsh-base` لـ فوق لديه ترتيب patch |
| [`src/index.ts`](src/index.ts) | فارغ وحدة مدخل؛patch هو وقت التشغيل محتوى |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذه الحزمة هو ساكن حالة bundle، لا يحتفظ يمكن مستقل مراقبة وقت التشغيل علاقة. |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [فعلي تحقق صفة حزمة](../README.zh.md)——تفريخ تحويل حالة و إصدار قاعدة.
- [Agent Teams service](../agent-team/README.zh.md)——حمل دائم roster، رسالة و مهمة لوح سلوك.
- [Agent Teams أداة](../tool-agent-team/README.zh.md)——Team-scoped نموذج أداة جدول طبقة.
- [Base bundle](../../bundle/base/README.zh.md)——هذا patch توسيع profile طبقة.

-----

<a id="model-experience"></a>
## تجربة النموذج

### Team سياسة و أداة

#### نموذج سوف يرى ماذا

Team سياسة و schema من [`@deepseek-ai/dsh-experimental-tool-agent-team`](../tool-agent-team/README.zh.md) كل. هذا bundle فقط تغيير composition:Team-scoped `list_agents`،`send_message` و `interrupt_agent` سوف بديل قد منع استخدام عام continuable-child control.`spawn_teammate` هو مباشر تفويض إرسال أداة.Workflow `agent()` استدعاء إنشاء fresh مرة صفة فرعي بديل إدارة؛ ذلك نص التوجيه يجب يتضمن مهمة الذي يحتاج سياق.

#### Token أثر

هذا bundle سوف إضافة دخول `@deepseek-ai/dsh-experimental-tool-agent-team` وصف Team سياسة و أداة schema؛ هو ذاته لا زيادة نص التوجيه نص.

#### KV Cache أثر

فقط يلزم bundle patch،Team identity و إعداد أداة schema ثابت، هذا bundle composition حينئذ إبقاء بادئة مستقر.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **فقط صريح تفعيل**——هذه الحزمة مع تثبيت توفير لكن افتراضي إغلاق؛ مع مرفق CLI،Web،SDK،ACP و Python profile كل لن تفعيل هو.
- **Workflow فرعي بديل إدارة أداة**——[Team أداة مرئي صفة حد](../tool-agent-team/README.zh.md#known-limitations-and-deferred-work) أيضا ملائم لأجل workflow فرعي بديل إدارة.
- **مشترك checkout**——كل teammate كل مراقبة نفس عدد عمل دليل؛ هذا bundle لا توفير worktree عزل أو نظام الملفات قفل.
- **حاجة base profile**——هذا patch اعتماد `dsh-base` توفير إعداد سطر id و Subagent مزود؛ هو لا هو مستقل profile.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

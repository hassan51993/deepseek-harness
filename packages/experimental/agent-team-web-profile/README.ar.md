---
description: "في Host Team طبقة بعد، لـ Web profile إضافة عام إصدار فعلي تحقق صفة Agent Teams وجه لوح."
kind: "package-bundle"
---

# @deepseek-ai/dsh-experimental-agent-team-web-profile

[English](README.md) | العربية

## عام وصف

`dsh-experimental-agent-team-web-profile` هو [Agent Teams](../agent-team/README.ar.md) عام إصدار فعلي تحقق صفة Web طبقة. يأخذ هو وضع في `@deepseek-ai/dsh-web-app` و [`@deepseek-ai/dsh-experimental-agent-team-profile`](../agent-team-profile/README.ar.md) بعد، يكفي في متصفح في عرض Team roster، مهمة لوح و teammate تنقل. إزالة مهمة واحد فعلي تحقق طبقة كل سوف يجعل مستقر base و Web composition إبقاء ثابت.dsh تثبيت مع مرفق هذه الحزمة بصفة اختياري تركيب حزمة، مع مرفق Web profile لن تفعيل هو؛ في فتح بدء Host طبقة بعد يمكن في Web جانب شريط إضافة صفحة فتح بدء.

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

حسب التالي ترتيب يأخذ Host و Web Agent Teams طبقة إضافة إلى قد ابتدائي تحويل `web` profile:

```sh
dsh plugin --profile web add @deepseek-ai/dsh-experimental-agent-team-profile
dsh plugin --profile web add @deepseek-ai/dsh-experimental-agent-team-web-profile
```

رقم واحد بند أمر توفير Team domain، توليد Remote طريقة و نموذج أداة. ثاني بند أمر تنشيط هذه الحزمة إعلان patch و ذلك متصفح presentation. تنفيذ `dsh plugin --profile web remove @deepseek-ai/dsh-experimental-agent-team-web-profile` إزالة هذه الحزمة وقت،Web طبقة أيضا سوف من profile لديه ترتيب bundle قائمة في إزالة.

### نيل نيل وظيفة

محادثة عنوان شريط سوف نيل نيل Team roster، مشترك مهمة لوح و teammate تنقل.[`@deepseek-ai/dsh-experimental-client-ui-agent-team`](../client-ui-agent-team/README.ar.md) مسؤول هذه متصفح تفاعل، و تركيب لأجل وصول Host Team service توليد Client Remote namespace.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذه الحزمة وقت التشغيل محتوى هو [`cordis.patch.yml`](cordis.patch.yml). في `dsh-web-app` و Host Agent Teams طبقة بعد تطبيق وقت، هو وحيد `insert` بند سوف لـ `@deepseek-ai/dsh-experimental-client-ui-agent-team` إضافة `ui-agent-team` سطر. إدراج دخول Client إضافة مسؤول توليد Remote assembly و Team UI؛ هذا عدد ساكن حالة bundle لا يحتفظ متغير حالة، أيضا لا تثبيت وقت التشغيل ثابت صيغة.

| ملف | مسؤولية |
|---|---|
| [`cordis.patch.yml`](cordis.patch.yml) | يتضمن `ui-agent-team` سطر لديه ترتيب Web patch |
| [`src/index.ts`](src/index.ts) | فارغ وحدة مدخل؛patch هو وقت التشغيل محتوى |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذه الحزمة فقط يحمل ساكن حالة profile patch،Remote assembly و Team UI مسؤول كل منها تنشيط اشتراط. |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [فعلي تحقق صفة حزمة](../README.ar.md)——تفريخ تحويل حالة و إصدار قاعدة.
- [Agent Teams Host profile](../agent-team-profile/README.ar.md)——الذي يحتاج domain،Remote و نموذج أداة طبقة.
- [Agent Teams متصفح UI](../client-ui-agent-team/README.ar.md)——roster، مهمة لوح و teammate تنقل سلوك.
- [Web bundle](../../bundle/web-app/README.ar.md)——هذا patch توسيع مستقر متصفح طبقة.

-----

<a id="model-experience"></a>
## تجربة النموذج

عبر و هذا Web طبقة معا اختيار Host-side Agent Teams profile بين وصل إنتاج أثر.

#### KV Cache أثر

هذا Web bundle لا إضافة أي نموذج طلب محتوى؛Host-side Team أداة مسؤول نص التوجيه،schema و ذاكرة مؤقتة أثر.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **لديه ترتيب تركيب**——`dsh-base`،`dsh-web-app`،`dsh-experimental-agent-team-profile` و هذه الحزمة يجب إبقاء هذا عدد ترتيب.
- **Preset-scoped قديم تحكم بند**——مستقر Web preset ما زال سوف في preset scope داخل تركيب continuable Subagent تحكم بند. قمة طبقة Host profile override لن استبدال هذه scoped registration، لذلك في Web نيل نيل Team-aware preset قبل،Team roster و قديم child تحكم بند ممكن معا ظهور.[Web Agent Teams قرار](../../../.agents/notes/archived/feature/2026-08-06-agent-teams-web.md) سجل هذا بند مؤقت مؤقت composition عمل.
- **فقط صريح تفعيل**——هذه الحزمة مع تثبيت توفير لكن افتراضي إغلاق؛ مع مرفق Web profile لن تفعيل أي Agent Teams طبقة.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

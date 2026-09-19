---
description: "موجه إلى نشر جهة و صيانة من bash قدرة بيت عائلة شرح، لأجل اختيار و تركيب shell منفذ، صندوق رملي تحويل و موجه إلى نموذج bash و pwsh أداة."
kind: "package-group"
---

# shell/ — bash قدرة بيت عائلة

[English](README.md) | العربية

## عام وصف

shell مجموعة لـ agent(ذكي جسم) توفير أمر تنفيذ قدرة: تشغيل قبل منصة أمر و قراءة ذلك محدود إخراج، أو بدء خلفية عملية و جولة استفسار هو——في POSIX فوق استخدام Bash، في Windows فوق استخدام PowerShell. كل تركيب تماما جيد تركيب واحد منفذ تنفيذ؛ صندوق رملي منفذ سوف عبر صندوق رملي قدرة حد كل بند أمر، موجه إلى نموذج `bash` و `pwsh` أداة فإن يقع في الذي تركيب منفذ لـ فوق.POSIX اختيار Bash منفذ،Windows اختيار PowerShell منفذ؛ أمر حاجة ملف درجة عزل وقت اختيار صندوق رملي تغيير جسم.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`shell`](shell/README.zh.md) | تعريف منفذ اتفاق: قبل منصة تشغيل، خلفية جملة مقبض و طلب تحليل | `ctx.shell` |
| [`bash-local`](bash-local/README.zh.md) | في POSIX فوق بـ كل جديد `bash -c` عملية تشغيل Bash أمر | تسجيل `ctx.shell` |
| [`bash-sandbox`](bash-sandbox/README.zh.md) | عبر صندوق رملي قدرة حد Bash أمر تشغيل، و يأخذ رفض تقرير إبلاغ لـ واقع | تسجيل `ctx.shell` |
| [`pwsh-local`](pwsh-local/README.zh.md) | في Windows فوق بـ كل جديد `pwsh -Command` عملية تشغيل PowerShell أمر | تسجيل `ctx.shell` |
| [`pwsh-sandbox`](pwsh-sandbox/README.zh.md) | عبر صندوق رملي قدرة حد PowerShell أمر تشغيل | تسجيل `ctx.shell` |
| [`shell-env`](shell-env/README.zh.md) | توفير كل بند shell أمر كل سوف استلام إلى تلقي إدارة `DSH_*` بيئة | `ctx.shellEnv` |
| [`tool-bash`](tool-bash/README.zh.md) | بـ `bash` أداة نحو نموذج عام Bash تنفيذ و خلفية مهمة | تسجيل إلى `ctx.tools` |
| [`tool-bash-persistent`](tool-bash-persistent/README.zh.md) | في مفرد عدد حد تحديد كل من نطاق حمل دائم Bash جلسة في تشغيل نموذج shell استدعاء | تسجيل إلى `ctx.tools` |
| [`tool-pwsh`](tool-pwsh/README.zh.md) | بـ `pwsh` أداة نحو نموذج عام PowerShell تنفيذ | تسجيل إلى `ctx.tools` |
| [`tool-pwsh-persistent`](tool-pwsh-persistent/README.zh.md) | في مفرد عدد حد تحديد كل من نطاق حمل دائم PowerShell جلسة في تشغيل نموذج shell استدعاء | تسجيل إلى `ctx.tools` |

profile طبقة تماما جيد اختيار واحد منفذ تنفيذ (win32 طبقة سوف يأخذ POSIX سطر تبديل صار pwsh سطر؛ معا تركيب اثنان عدد سوف بسبب خدمة تكرار تسجيل بينما في تحميل مدة فشل) و الذي يحتاج موجه إلى نموذج أداة. صندوق رملي تحويل تركيب أيضا سوف اختيار واحد `ctx.sandbox` مزود و `ctx.sandboxPolicy`؛[base تركيب حزمة](../bundle/base/cordis.patch.yml) مسؤول مع منتج تسليم وصل خط إعداد.

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [Bash منفذ فرعي نظام](../../docs/subsystems/shell.zh.md) —— مشترك طلب/spec مفردات، نتيجة، خلفية عملية و كامل خدمة اتفاق.
- [صندوق رملي فرعي نظام](../../docs/subsystems/sandbox.zh.md) —— صندوق رملي منفذ الذي إزالة استهلاك عزل قدرة.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

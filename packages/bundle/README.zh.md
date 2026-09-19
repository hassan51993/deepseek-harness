---
description: "مشترك نواة قلب، متصفح GUI، مرة صفة مهمة،ACP(Agent Client Protocol) و SDK تطبيق جدول طبقة الآن صار dsh profile تركيب حزمة."
kind: "package-group"
---

# bundle/:profile إضافة تركيب حزمة

[English](README.md) | العربية

## عام وصف

هذا مجموعة صف خروج `dsh --profile` استخدام يمكن تثبيت patch طبقة. كل حزمة كل إعلان `dsh.bundle.patch`؛ بدء جهاز سوف تراكم وضع هذه patch وثيقة قدوم تجميع أداة اسم profile.`web`،`headless`،`acp` و `sdk` profile بـ `dsh-base` لـ أساس أساس،`sdk-minimal` فإن من واحد تركيب حزمة توفير كامل إعداد شجرة. مجال حزمة أيضا يمكن في هذا دليل خارج إعلان مرفق إضافة طبقة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`base`](base/README.zh.md) | أساس في base profile مشترك نواة قلب | —(فقط patch) |
| [`acp-app`](acp-app/README.zh.md) | أساس في base، فقط لأجل تلقائي تحويل ACP stdio تطبيق | تركيب ACP bridge |
| [`web-app`](web-app/README.zh.md) | أساس في base متصفح تطبيق طبقة | تركيب كثير بند Web إعداد سطر |
| [`headless`](headless/README.zh.md) | أساس في base مرة صفة أمر سطر مهمة تطبيق | `headless-runner` |
| [`sdk-app`](sdk-app/README.zh.md) | أساس في base SDK JSON-RPC stdio تطبيق | تركيب SDK خادم |
| [`sdk-minimal`](sdk-minimal/README.zh.md) | لا استخدام base أو Web مستقل أقصى بسيط SDK تطبيق | —(كامل patch شجرة) |

داخل وضع تركيب حزمة من dsh تثبيت دليل تحليل؛ شجرة خارج (out-of-tree) تركيب حزمة عبر `dsh plugin --profile <name> add <package>` تثبيت دخول profile.

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [dsh تطبيق](../../apps/cli/README.zh.md)——بدء profile `dsh` أمر.
- [app-boot](../boot/app-boot/README.zh.md)——profile مثل أي تحليل، قسم طبقة و تحديد صنع.
- [Profile إضافة تركيب حزمة تصميم قلم تسجيل](../../.agents/notes/implemented/architecture/2026-08-05-profile-plugin-bundles.zh.md)——profile و تركيب حزمة تركيب تصميم.
- [توليد تركيب رسم](../../apps/cli/composition.md)——كل مع إرسال سطر إصدار تسليم profile استخدام تأكيد قطع تركيب.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

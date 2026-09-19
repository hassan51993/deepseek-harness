---
description: "boot حزمة مجموعة:dsh app bin مثل أي بدء——بيئة تحميل،profile و patch طبقة، صاف واضح بدء فشل معلومة، و من تطبيق يحتفظ أمر سطر."
kind: "package-group"
---

# boot/: مشترك app bin بدء لصق دمج طبقة

[English](README.md) | العربية

## عام وصف

boot مجموعة مسؤول بدء profile تطبيق و إدارة ذلك قد تثبيت تركيب.`app-boot` تحليل إعداد و بدء Loader،`cmdline` توفير تطبيق معامل،`plugin-manager` توفير و CLI مشترك حالي profile عملية. كل حزمة README مسؤول كل منها دقيق عقدة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`app-boot`](app-boot/README.zh.md) | من `cordis.yml` بدء dsh تطبيق: تحميل `.env`، تطبيق profile و patch طبقة، و صاف واضح تقرير إبلاغ بدء فشل | (توفير كل bin استخدام مكتبة) |
| [`cmdline`](cmdline/README.zh.md) | يجعل تطبيق يحتفظ ذاتي ذات flag،`--help` و خروج رمز؛ بدء جهاز ذاته flag بعد واحد قطع أصل مثال نقل دخول | `cmdlineArgs`،`appExit` |
| [`hmr`](hmr/README.zh.md) | تنسيق ضبط وحدة و إعداد إعادة تحميل، و و حزمة تعديل متبادل رفض تنفيذ | `hmr` |
| [`plugin-manager`](plugin-manager/README.zh.md) | عبر مشترك CLI عملية إدارة حالي profile إضافة و تركيب حزمة | `pluginManager` |

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [dsh تطبيق](../../apps/cli/README.zh.md)——في ذلك بدء تسلسل في استخدام هذه helper `dsh` bin.
- [Profile تركيب حزمة](../bundle/README.zh.md)——يمكن من `dsh --profile` تركيب تركيب يمكن تثبيت patch طبقة.
- [dsh-home-paths](../util/home-paths/README.zh.md)——اثنان عدد حزمة كل اعتماد harness home محلل.
- [dsh-cmdline](cmdline/README.zh.md)——flag بيت عائلة مثل أي من تطبيق يحتفظ بينما غير بدء جهاز.

- [Profile إدارة](../../docs/subsystems/boot.zh.md)——خدمة طريقة و نتيجة سجل.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

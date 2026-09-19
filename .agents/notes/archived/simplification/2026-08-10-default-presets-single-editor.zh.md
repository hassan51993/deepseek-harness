# Agent Note: عام preset فقط توفير واحد طقم تحرير أداة

Status: implemented
Archived: 2026-09-04

[English](2026-08-10-default-presets-single-editor.md) | العربية

## مشكلة

`standard`،`code` و `cordis` preset معا توفير `read`/`write`/`edit` نظام الملفات أداة و `str_replace_editor`. اثنان طقم واجهة في معتاد قاعدة ملف فحص نظر و تحرير فوق إعادة تراكم، توجيه يؤدي كل مرة طلب كل يحمل مقدار خارج أداة schema، لكن لا يوجد زيادة مستقل افتراضي قدرة.`minimal` preset أداة لديه مختلف تركيب اتفاق: هو ثابت مزدوج أداة بيان متعمد في حمل دائم `bash` خارج توفير `str_replace_editor`.

## قرار

`standard`،`code` و `cordis` preset إعداد تركيب `dsh-tool-fs` و `dsh-tool-fs-search`، لكن لا تركيب `dsh-tool-str-replace-editor`. لذلك PTC mode سجل التسجيل و توليد SDK متساو لا يتضمن `str_replace_editor`.`minimal` preset متابعة تركيب `dsh-tool-str-replace-editor`، نشر إعداد أو مستخدم ذاتي تعريف preset ما زال يمكن صريح تركيب هذا إضافة.

هذا قرار استلام ضيق preset أداة بيان، لا إزالة أداة حزمة و ذلك Python وقت التشغيل دعم حمل. مقارنة مبكر[مشترك بيان قرار](../feature/2026-07-31-even-out-shipped-tool-rosters.zh.md) متابعة شرح و surface غير متصل أداة لـ أي عودة preset تركيب كل؛ هذا سجل شرح تحرير جهاز مثال خارج.

## سبق اعتبار بديل خطة

**في عام preset في إبقاء اثنان طقم تحرير واجهة.** لا إعطاء اعتماد، لأن إعادة تراكم نموذج مرئي schema زيادة أداة اختيار، لكن لا يوجد توفير مختلف افتراضي عملية.

**من كل تسليم تركيب في إزالة `str_replace_editor`.** لا إعطاء اعتماد، لأن `minimal` preset متعمد سوف هذا schema بصفة اثنان عدد أداة لـ واحد، صريح نشر ما زال هو هذا مستقل إضافة صالح مستهلك.

## عاقبة

عام agent استخدام `read`،`write` و `edit` إتمام نظام الملفات تعديل،minimal agent إبقاء `str_replace_editor`.preset تركيب اختبار ثابت ذلك لن ظهور في standard بيان،Cordis بيان و PTC mode SDK في، معا minimal تأكيد متابعة ثابت ذلك وجود.

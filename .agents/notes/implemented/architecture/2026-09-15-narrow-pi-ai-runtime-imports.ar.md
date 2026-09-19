# Agent Note: استلام ضيق pi-ai وقت التشغيل import

Status: implemented

[English](2026-09-15-narrow-pi-ai-runtime-imports.md) | العربية

## مشكلة

أساس أساس bundle سوف في لا يوجد إعداد توجيه وقت تركيب `dsh-llm-pi-ai`، يجعل Models ضبط صفحة قدرة كاف توفير pi-ai provider. لـ model helper بينما import pi-ai تجمع دمج مدخل أيضا سوف طلب قيمة ذلك توجيه خروج TypeBox namespace، أي جعل كل Session كل استخدام `dsh-llm-deepseek`، كل مرة تطبيق بدء أيضا سوف مقدار خارج تحميل عدد مئة عدد وحدة.

## قرار

`dsh-llm-pi-ai` لم يعد وقت التشغيل import pi-ai تجمع دمج مدخل.Catalog و تسجيل تسجيل بيانات وصفية متابعة استخدام `providers/all`؛ بروتوكول تنفيذ متابعة استخدام قائم `api/*.lazy` مدخل؛overflow فحص قياس استخدام `utils/overflow`. حزمة داخل `models.ts` توفير مهايئ الذي يحتاج ثلاثة عدد model helper.Collection قدوم ذاتي pi-ai عام `builtinModels()` تنفيذ، و في تثبيت توجيه provider قبل صاف فارغ.Provider constructor تنفيذ هذا مهايئ نقل دخول ساكن حالة مفرد بروتوكول فرع.Reasoning level اختيار حسب وفق pi-ai ترقية ترتيب قراءة ذلك عام `Model` بيانات وصفية.

تجمع دمج مدخل type-only import سوف يتم TypeScript مسح حذف، لذلك إعطاء بـ إبقاء. بناء ناتج import profile سوف تحليل 153 عدد pi-ai وحدة، لا يتضمن TypeBox وحدة أو pi-ai تجمع دمج مدخل.

## اعتبار مرور بديل خطة

- **إعطاء pi-ai زيادة `models` export.** رفض، لأن هذه الحزمة يمكن مباشر استخدام قد عام provider،API،utility و model metadata interface، بلا حاجة تعديل فوق تنقل export map.
- **حركة حالة import تجمع دمج مدخل.** رفض، لأن راحة نوم مهايئ لا حاجة منها أي محتوى؛ تماما ترتيب حذف هذا مدخل سوف مباشر حذف عمل، بينما لا هو يأخذ عمل نقل حركة إلى بعد عملية.
- **نسخ pi-ai كامل Models تنفيذ.** رفض، لأن `builtinModels()` قد إرجاع يتضمن ذلك إقرار إثبات و تخزين سلوك فوق تنقل تنفيذ. صاف فارغ منها provider يمكن إبقاء هذا تنفيذ، بلا حاجة صيانة fork.

## عاقبة

تطبيق ما زال سوف تحميل `providers/all`، لذلك إعداد و تخويل واجهة إبقاء كامل قد تثبيت provider دليل. بناء adapter snapshot وقت سوف قصير مؤقت بنية صنع و صاف فارغ داخل وضع provider set، مجددا تثبيت قد تحليل توجيه provider. حزمة داخل provider constructor فقط قبول ساكن حالة model و واحد بروتوكول تنفيذ؛ إذا يلزم زيادة حركة حالة model،filter أو كثير بروتوكول ذاتي تعريف توجيه، يجب معا توسيع هذا محلي دالة و ذلك اختبار.

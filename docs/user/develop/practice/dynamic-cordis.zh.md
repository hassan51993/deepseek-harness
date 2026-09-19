# عبر نص التوجيه إعداد حفظ دائم إضافة

[English](dynamic-cordis.md) | العربية

إنشاء صنع نمط توفير [Plugin Manager](../../../../packages/boot/plugin-manager/README.zh.md) و فقط قراءة[وقت التشغيل فحص](../../../../packages/extensions/tool-cordis/README.zh.md). إضافة إعداد يخص حالي profile، أثر ذلك جلسة، و في عملية إعادة بدء بعد إبقاء.

## اتصال MCP خادم

بدء Web profile و اختيار إنشاء صنع نمط. دقيق تجهيز واحد يمكن وصول كما توفير `ping` Streamable HTTP MCP خادم، سوف ذلك فعلي طرف نقطة ملء دخول التالي نص التوجيه:

> سوف `<endpoint>` موضع MCP خادم إعداد إلى حالي profile، تسمية لـ `demo`. قيام أي تفعيل هو أداة، لكن بعد استدعاء هو ping أداة و إبلاغ إبلاغ أنا نتيجة.

agent تحرير كتابة صاف إعداد تركيب حزمة، في patch في إدراج دخول `@deepseek-ai/dsh-mcp-client`، مجددا عبر `plugin_manager install_bundle` تثبيت. تفعيل HMR وقت، أداة سوف ظهور في نفس عدد تشغيل في جلسة داخل. معا فحص إدارة نتيجة (`application: applied`) و نجاح `mcp__demo__ping` استدعاء. إرجاع `restart-required` قد حفظ بند بعد لم تنشيط؛ فشل بند حاجة إصلاح إعداد.

تعديل إعداد قبل أولا قراءة تركيب حزمة patch. استخدام Plugin Manager توقف استخدام بند أو إزالة تركيب حزمة. يمكن قبول إعداد و اتصال فشل سلوك رؤية [MCP client مشاركة اعتبار](../../../../packages/mcp/mcp-client/README.zh.md).

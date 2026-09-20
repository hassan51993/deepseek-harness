# ضبط الإضافات الدائمة من توجيه

[English](dynamic-cordis.md) | العربية

يوفّر وضعُ المُنشئ [مدير الإضافات](../../../../packages/boot/plugin-manager/README.ar.md) و[فحصَ وقت التشغيل](../../../../packages/extensions/tool-cordis/README.ar.md) للقراءة فقط. وإعدادُ الإضافات يخص الـ profile الحالي، ويؤثر في جلساته، وينجو من إعادة تشغيل العملية.

## اربط خادم MCP

أقلع profile الخاص بـ Web واختر وضعَ المُنشئ. ومع خادم MCP يعمل بـ Streamable HTTP ويمكن الوصول إليه ويكشف `ping`، أرسل هذا التوجيه مستعملًا نقطةَ نهايته الفعلية:

> Configure the MCP server at `<endpoint>` in this profile as `demo`. Make its tools available now, then call its ping tool and tell me the result.

فيكتب الوكيل حزمةً للإعداد وحده يدرج patch الخاص بها `@deepseek-ai/dsh-mcp-client`، ثم يثبّتها بـ `plugin_manager install_bundle`. ومع تفعيل HMR تظهر الأدوات في الجلسة العاملة نفسها. وتحقّق من نتيجة الإدارة (`application: applied`) ومن نجاح استدعاء `mcp__demo__ping` معًا. والمدخلُ المحفوظ بحالة `restart-required` لم ينشط بعد؛ والمدخلُ الفاشل يحتاج إصلاحَ إعداد.

واقرأ patch الحزمة قبل تعديل إعدادها. واستعمل مديرَ الإضافات لتعطيل المداخل أو إزالة الحزمة. وانظر [مرجع عميل MCP](../../../../packages/mcp/mcp-client/README.ar.md) للإعداد المقبول ولسلوك أعطال الاتصال.

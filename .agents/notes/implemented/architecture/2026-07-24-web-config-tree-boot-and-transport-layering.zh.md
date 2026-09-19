# Agent Note: dsh web config-tree boot و web نقل قسم طبقة

Status: implemented

[English](2026-07-24-web-config-tree-boot-and-transport-layering.md) | العربية

> نطاق:`dsh web` مثل أي تركيب (cordis.yml + cordis قبل boot صنف + إعداد مصدر) ، و web نقل مثل أي عبر حزمة قسم طبقة (شبكة صلة / تحميل جسم / ربط / رسم / تطوير مدة إعادة تحميل). متصفح جانب تركيب تحميل سلسلة عودة [client إضافة تركيب تحميل note](2026-07-23-client-plugin-loading-model.zh.md) كل، هذا تركيب فقط هو هو توفير إعطاء جهة.

## مشكلة

`dsh web` سبق هو فقط باق يد عمل تركيب إعداد وجه:`bootHost` تدريجي عدد تعليق 32 عدد إضافة،config تثبيت ميت في شفرة داخل (مخالفة عكس no-hardcoded-tunables) ،client roster هو `web.ts` معتاد كمية، بينما TUI/headless مبكر قد هو yml تركيب. نقل طبقة مسؤولية خطأ موضع و لـ إعداد طقم:webserver ذاتي تسمية صامت تحميل جسم لكن إقرار تعرف `__DSH_BOOT__` رسم، يملك SSE(Server-Sent Events) عبر طريق، صلب تحرير رمز `/api/*` بادئة؛dev bundle watch إرسال إقامة في prod سجل التسجيل داخل اعتماد `watch?` معامل فتح صلة، دورة الحياة بلا رئيسي؛ رسم سجل التسجيل مقابل كل مرة `internal/plugin` كل كمية إعادة مسح؛ مفرد طلب فشل و يؤدي أمر server خطأ مشترك استخدام واحد واحد قاعدة خروج عملية sink. أيضا لديه واحد مستخدم مرئي نقص وقوع:web مسار من لا تحميل `$DSH_HOME/.env`،`DSH_HOME=… dsh web` قراءة لا إلى ذاتي تعريف home تحت API key.

## قرار

**تركيب نتيجة هو واحد شجرة مستو فرش إعداد شجرة.** `apps/cli/config/base.cordis.yml` و `apps/cli/config/web.cordis.yml` مشترك نفس يحتفظ الكل سطر——host وقت التشغيل (32 سطر) ،`api-gateway` سطر،`webserver` سطر،`dsh.client` سطر (متصفح roster؛modules سطر معا هو host سطر). لا فعل رئيسي جاف bundle: كل إضافة واحد سطر، كل config حقل yml يمكن تعديل. هذا واحد قيام ساحة بعد قدوم دفع واسع إلى كل مستودع: اثنان عدد surface مشترك بند إعداد يتم سحب أخذ دخول `apps/cli/config/base.cordis.yml`، كل surface فإن استلام جمع لـ واحد نسخة overlay([مشترك base overlay](../../archived/simplification/2026-07-29-shared-base-config-overlays.md)).`dsh-client-hmr` سطر هو عادي بداية نهاية تفعيل bundle سطر (الأكثر أول من `--dev` في شفرة في إلحاق؛ هذا راية علامة قد ملغى حذف). سطر ترتيب بلا تركيب تحميل دلالة؛ تنشيط من خدمة متاح صفة قيادة.`auditStartupEntries` تقرير إبلاغ import فشل، قراءة فشل fiber أصلي تنشيط خطأ، و صف خروج يجعل fiber توقف في `PENDING` خدمة.[بدء سياسة](2026-09-09-consumer-owned-startup-strictness.zh.md) سوف optional failure بصفة warning، سوف required failure نظر لـ يؤدي أمر خطأ. قد تقرير إبلاغ rejection سبب سوف إبقاء علامة حتى واحد عملية درجة فحص نقطة، جعل `installFailLoud` دمج Loader تكرار إشعار، بينما غير متصل لم معالجة rejection ما زال يؤدي أمر.Node app-boot ناتج داخل تضمين `@cordisjs/plugin-include`، لكن سوف `@cordisjs/plugin-loader` إبقاء لـ خارجي اعتماد، لذلك include `EntryTree` و host سوف ربط إلى نفس عدد Loader peer، بينما لن يجعل واحد شجرة إعداد شجرة أفقي عبر اثنان عدد Loader تنفيذ.

**boot لاصق ماء من اثنان عدد صنف مجموعة صار.** `AppCLIEntry`(apps/cli) و `AppWebEntry`(قشرة داخل نواة) فقط يحتفظ ذلك بعض يجب مستقل في cordis، رفع قبل وجود شرق غرب:argv واقع، دمج صار patch تجميع، تحليل خروج boot manifest(بيانات وصفية بيان) ، وحدة نظام نسخة،loading صفحة جملة مقبض——ذلك بقية واحد قاعدة دخول إضافة.`AppCLIEntry.run()` ثلاثة مقطع: قسم طبقة env(ambient > cwd `.env` > `$DSH_HOME/.env`، ترتيب يد صلة إسقاط فوق وصف نقص وقوع)→ patch دمج صار → Loader include boot إضافة activation audit.`AppWebEntry.run()` في متصفح جانب مرآة مثل هو: يأخذ `window.__DSH_BOOT__` تحليل صار `BootManifest`(مزدوج نظر زاوية:npm حزمة سطر إعطاء وحدة جدول،cordis إضافة سطر إعطاء entry تركيب؛ شاذ شكل wire كبير صوت رمي) ، بناء وحدة نظام، تصيير loading صفحة،immediately طبقة مسبق أخذ و Context/Loader دقيق تجهيز و سطر،**create entry قبل انتظار مسبق أخذ متساو**(شيء تحويل هو `tree.import` تزامن require، لا تلقي fiber inject انتظار حفظ حماية؛i18n → runtime/client هذا صنف عبر حزمة require حافة اشتراط immediately طبقة عمل مصنع الكل تسجيل تمام——لا فإن لديه فعلي قياس 10–25% boot تنافس حالة) ، استلام تحرير modules entry، تدريجي واحد إنشاء رسم سطر،settle،sweep.

**كل إعداد مصدر لديه وحيد إعلان موضع.** تركيب حزمة yml قيمة هو عمل مسار افتراضي،Settings قسم عقدة هو يمكن كتابة مستخدم انحراف جيد،CLI(أمر سطر واجهة)flags موجه إلى ذلك ملكية بدء جهاز إعداد سطر،env قيمة فإن عبر yml `!!js` جدول بلوغ صيغة دخول.patch سوف كامل جسم استبدال واحد سطر config. تحليل بعد قبل طرف `distIndex` عبر نفس بند patch عبر طريق بصفة تجميع واقع نقل تمرير. و نقل غير متصل مزود/نموذج قيمة افتراضية عودة `ctx.agentDefaultModel` كل؛[مباشر headless مدخل](../../archived/architecture/2026-08-09-headless-direct-core-entry-point.md) و Session Controller إزالة استهلاك نفس نسخة حالة.

**نقل مسؤولية كل لديه واضح owner.** `dsh-client-connection` يحتفظ `/api` توجيه، طلب و استجابة envelope، متصفح إقرار إثبات،Host/Origin فحص، دقيق Fetch توجيه تسجيل و مشترك Typert interceptor مقعد موضع.`dsh-api-gateway` يحتفظ نوع تحويل Remote توزيع و كثير مسار إعادة استخدام WebSocket.`dsh-host-webserver` هو بسيط عنصر توجيه تسجيل إضافة:`WebServer` provide `ctx.webServer`(`register(route) → disposer`، تكرار pattern أي رمي،`renderIndex` تصيير——أولا بنية تحويل `webserver/index-inject` سطر، بعد أصلي `tapIndex` حسب تسجيل ترتيب تطبيق——و `port`) ، تنشيط أي listen، مفرد طلب فشل وقت جواب 400 و تسجيل سجل، كما لا إقرار تعرف أي harness عام فكرة. ذلك أساس في socket Node HTTP مدخل يمكن عبر تلقي صيانة في بين عنصر تطبيق قد إعداد gzip، بلا حاجة إضافة جديدة استجابة كتابة خروج خدمة طريقة أو تغيير route owner؛Web Worker نفق طريق نقل تمرير identity بايت.modules node نصف (`ClientModuleRegistry`،provide `ctx.clientModules`) يحتفظ مفرد حزمة زيادة كمية مسح،bundle توجيه، بدء حقن سطر و `onRebuilt`/`onGraphChanged` إشعار.HMR(حار وحدة استبدال)node نصف عبر `fs.watchFile` membership و `/plugins/events` SSE توجيه يحتفظ تطوير مدة إعادة تحميل.

**حزمة خروج فتحة سجل قاعدة.** modules حزمة فقط كشف `.`(node نصف) و `./client`(كامل متصفح نصف:`ClientModuleSystem`،`parseBootManifest`، استلام تحرير إضافة وجه)——لا ضبط مخصص استخدام فرعي مسار؛wire نوع مرور أصل خروج فتحة re-export إعطاء host جانب مستهلك. استلام تحرير إمساك يد: داخل نواة في cordis قبل يأخذ بناء جيد نسخة كتابة `window.__DSH_MODULES__`؛`./client` apply قراءة هذا مجرى موضع (نقص قليل وقت صريح رمي خطأ) و provide `ctx.modules`.

## عاقبة

- إعادة مجموعة واحد web نشر = تعديل yml/patch؛ تراجع دور عنصر (`mountWebPlugins`،`CLIENT_PACKAGES`،`createHostWebPluginRegistry`،`startWebServer`،webserver رسم/SSE/api معرفة تعرف) الكل حذف.
- [Headless هو مباشر core مدخل](../../archived/architecture/2026-08-09-headless-direct-core-entry-point.md): ذلك مع مرفق profile يتضمن مشترك base Agent قدرة، و حذف ذهاب Host،HTTP،Web و متصفح طبقة. هذا قلم تسجيل نقل تخطيط قسم هو متصفح surface اتفاق.
- واحد قيمة نيل تسجيل إقامة TypeScript حفرة:`declare module 'cordis'` augmentation الذي في ملف إذا**لا يوجد أي cordis import**، سوف يتم تخفيض صار مستقل وحدة إعلان، بلا صوت ضرب تفرق كل برنامج `Context` merge(`ctx.on`/`ctx.effect` كل برنامج إزالة فقد). استخدام `import type {} from 'cordis'` مرساة تحديد.

## اعتبار مرور بديل خطة

| ترك سجل | واحد سطر إدارة من |
|---|---|
| مخصص باب `dsh-host-profile` تلقي جسم حزمة | مستخدم نموذج حالة عودة Settings دعم دعم `ctx.agentDefaultModel` كل؛ مقدار خارج Host تلقي جسم سوف تكرار ملكية، و ترتيب حذف مباشر مدخل |
| وقت التشغيل داخل `assembly` وسادة طبقة إضافة (provide `apiHandler`) | Connection قد في نقل حافة حافة يأخذ Remote interception و وظيفة ذاتي لديه دقيق Fetch توجيه تركيب صار واحد handler |
| كل كمية إعادة مسح و زيادة كمية مسح و تخزين | اثنان بند تنفيذ اثنان نسخة دلالة؛ مفرد حزمة مسار كاف بـ تغطية تنشيط أول مسح |
| modules حزمة خاص ضبط `./impl` خروج فتحة | خروج فتحة لا موحد واحد؛ معيار `./client` تحمل تحميل كامل متصفح نصف |
| dev overlay / `cordis.dev.yml` | واحد طقم yml؛`!!js` لا يمكن شرط تحويل سطر وجود،`--dev` إلحاق واحد سطر حينئذ هو الكل فرق مختلف |
| env دخول خريطة جدول | نفس حقل سوف ظهور env/json مزدوج مصدر، يحتاج مجددا إرسال واضح أولوية درجة |
| create لا انتظار مسبق أخذ (بـ `arrive()` ذهاب إعادة لـ أمان اعتماد حسب) | يتم 10–25% boot تنافس حالة إثبات زائف: في طريق ذهاب إعادة فقط تغطية نفس حزمة مزدوج سحب، لا تغطية عبر حزمة تزامن require حافة |
| json مباشر عند loader patches ملف | json مفتاح اسم سوف اقتران دمج yml سطر بنية،profile تحرير كتابة من يلزم فهم cordis |
| عام استجابة كتابة خروج طريقة و يجعل كل بند route اختيار وصل دخول | استجابة تحرير رمز يخص Node HTTP سياسة؛ مرور `ctx.webServer` كشف سوف يجعل كل route كل من و اختبار بديل ذات اعتماد هذا بند سياسة |
| يد كتابة gzip تنسيق تجارة و تدفق دورة الحياة | تلقي صيانة في بين عنصر قد معالجة تنسيق تجارة، وسيط جسم نوع غربلة اختيار، استجابة رأس تعديل كتابة، خلف ضغط و عتبة قيمة سلوك |

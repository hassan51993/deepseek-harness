---
description: "يمين جانب Sidebar متصفح tab: في sandbox في وصول HTTP(S) صفحة، يشمل loopback خدمة."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-sidebar-browser

[English](README.md) | العربية

## عام وصف

في مستقل يمين جانب Sidebar tab في تصفح HTTP(S) صفحة، يشمل loopback خدمة. حالي Web و Desktop كل استخدام iframe و تطبيق صيانة history. هذه الحزمة لن نحو يتم وصول محتوى حقن Electron أو Node قدرة.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [حل تنفيذ](#understand-the-implementation)
- [تأخير امتداد قراءة قراءة](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

مع مرفق Web و Desktop composition قد تركيب هذه الحزمة. يمكن من يمين جانب Sidebar guide فتح **متصفح**، إدخال HTTP(S) URL، أو نقر Assistant Markdown في HTTP(S) رابط. لا حمل scheme رئيسي آلة اسم سوف تكملة كل لـ HTTPS. عام مشترك هدف و loopback هدف استخدام نفسه افتراضي sandbox. كل مرة guide عملية أو رسالة رابط عملية كل سوف إنشاء واحد جديد Browser tab.

### أي وقت اختيار

عند Web صفحة حاجة إبقاء في حالي Session جانب وقت، اختيار Browser. محلي ملف استخدام [Document Preview](../ui-sidebar-documentpreview/README.ar.md) ؛ محطة نقطة رفض iframe تضمين دخول أو حاجة هذه الحزمة لا منح إعطاء متصفح capability وقت، استخدام واضح خارجي متصفح عملية.

### الأكثر صغير إعداد

هذه الحزمة لا يوجد إعداد حقل. ذاتي تعريف Web composition تركيب Host companion؛ مع بعد Client loader سوف اكتشاف package manifest إعلان متصفح مدخل:

```yaml
- id: ui-sidebar-browser
  name: '@deepseek-ai/dsh-client-ui-sidebar-browser'
```

Client إضافة يمكن استدعاء `ctx.sidebarRight.openTab('browser', { params: { url } })` فتح tab. اختياري URL سوف في تنقل قبل قبول و عنوان شريط إدخال نفسه تحقق.

أداة شريط توفير بعد تراجع، قبل دخول، تحديث جديد، قبل نحو، في نظام متصفح في فتح، و الأكثر يمين جانب تدريجي tab sandbox فتح صلة. إغلاق sandbox هو مؤقت اختيار، و سوف عرض تحذير إبلاغ. خارجي فتح قبول معروف HTTP(S) هدف.tab عنوان عرض Web رئيسي آلة اسم.

-----

<a id="understand-the-implementation"></a>
## حل تنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

### بروتوكول سياسة

عنوان محلل قبول HTTP و HTTPS، يشمل loopback هدف.`file:` URL، نص برمجي/data/blob إدخال، داخل تضمين اعتماد،DSH تطبيق ذاته origin و شاذ شكل عنوان سوف يتم رفض. محلي ملف من Document Preview مسؤول تصيير.

### Iframe تحميل جسم

Web و Desktop افتراضي استخدام `sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"`.frame لا يوجد مباشر تحت تحميل أو قمة طبقة تنقل flag.popup سوف انفصال مغادرة sandbox؛ في Web في، هروب هروب popup سوف إبقاء opener، و يمكن تنقل قمة طبقة تطبيق. يتم وصول origin يمكن استخدام ذاته Cookie و Web storage، لكن عبر مجال هدف لا يمكن قراءة DSH DOM،storage أو API استجابة.iframe لا إرسال referrer، أيضا لا إضافة حزمة ذاتي لديه Permissions Policy، لذلك متصفح افتراضي سياسة و مستخدم تخويل توليد فاعلية.toolbar يمكن لـ حالي tab occurrence إزالة sandbox؛ هذا اختيار لا حفظ دائم. لم تلقي sandbox قيد صفحة يمكن حسب متصفح activation قاعدة تنقل قمة طبقة تطبيق، و استخدام تحت تحميل، نموذج حالة محادثة إطار و إدخال قفل تحديد. هذه الحزمة لا بديل إدارة أو استكشاف قياس بعيد مسار صفحة.

Web سجل toolbar إيداع و typed tab فتح. تنقل حالة آلة يأخذ كل تلقي تحكم revision رقم مرة iframe load نظر لـ معروف، يأخذ لاحق load نظر لـ صفحة قد تغير إلى غير ممكن قراءة URL دليل. دخول unknown حالة بعد، عنوان سوف عرض علامة، بعد تراجع، قبل دخول و خارجي فتح سوف منع استخدام، تحديث جديد فإن إرجاع الأكثر بعد واحد تلقي تحكم URL.body إعادة تركيب وقت سوف إعادة تحميل تطبيق الأكثر بعد معروف URL، و كما فقط في بعد بلا تلقي تحكم هدف وقت استخدام اختياري ابتدائي URL. لا إنتاج iframe load History API و fragment تغير ما زال غير ممكن رؤية.iframe `error` event سوف عرض مؤقت تحميل فشل notice، مباشر إلى تحت واحد تلقي تحكم تحميل، لكن لن تغيير URL history.

### Controller

كل tab نيل نيل واحد `BrowserController` class. هو عام أمر فقط لديه `loadUrl`،`goBack`،`goForward` و `reload`؛ عنوان تحقق و history تغيير متساو من هذا كائن غلاف تركيب. هو `BrowserNavigation` class يملك يمكن تسلسل تحويل URL حالة آلة.`BrowserFrame` واجهة مسؤول مؤقت sandbox و document حالة و تحميل جسم عملية،`IframeImpl` لـ حالي iframe تحميل جسم تنفيذ هذا واجهة.Slot injection عبر `useBrowserFrame` توفير حسب key بحث جذب frame حالة، و توفير عادي callback، لذلك React body لا استقبال controller أو observable source؛ هو فقط إبقاء يمكن تحرير مسودة مسودة و iframe DOM.

Controller واجهة لا اعتماد iframe API. لم قدوم `ElectronWebViewImpl` يمكن تنفيذ `BrowserFrame`، و يحتفظ `<webview>` attachment و target identity. هذا تأجيل تحميل جسم سجل في نفس نسخة Sidebar Browser قرار في، حالي لا تسجيل أيضا لا اختبار.

</details>

-----

<a id="further-exploration"></a>
## تأخير امتداد قراءة قراءة

- [يمين جانب Sidebar](../../../docs/subsystems/sidebar-right.ar.md)——tab composition، تنقل و دورة الحياة.
- [Document Preview](../ui-sidebar-documentpreview/README.ar.md)——محلي شفرة المصدر،Markdown، صورة،HTML و PDF تصيير.
- [Sidebar Browser قرار](../../../.agents/notes/implemented/feature/2026-09-16-sidebar-browser.ar.md)——حالي iframe سلوك،controller كل حق و تأجيل Electron تحميل جسم.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا.Browser tab هو مستخدم جانب عرض حالة، لا تسجيل أداة،prompt section أو Session event.

#### KV Cache أثر

بلا؛ تصفح محتوى لا دخول نموذج طلب.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

عزل سياسة متعمد وضع ترك جزء متصفح توافق صفة:

- جدا كثير محطة نقطة رفض iframe تضمين دخول، أو حاجة افتراضي sandbox لا نحو frame منح إعطاء تحت تحميل و قمة طبقة تنقل.HTTPS تطبيق أيضا ممكن حسب mixed-content سياسة منع توقف عام مشترك HTTP صفحة. إغلاق sandbox سوف استخدام ذاته حد تبديل أخذ توافق صفة، لكن لن التفاف مرور mixed-content أو private-network سياسة. لم تلقي sandbox قيد frame يمكن حسب متصفح activation قاعدة تنقل قمة طبقة تطبيق، و استخدام تحت تحميل، نموذج حالة محادثة إطار و إدخال قفل تحديد. هذا نمط لن حسب Browser tab عزل يتم وصول origin Cookie، أيضا لا يمكن منع توقف iframe داخل صفحة ذاتي سطر اختيار لاحق URL.
- في Web في، هروب هروب خروج sandbox popup سوف إبقاء opener، و يمكن عبر هذا سلسلة تنقل قمة طبقة تطبيق.Desktop سوف مفرد وحيد معالجة popup إنشاء.
- لاحق iframe load قدرة جدول واضح حدوث تنقل، لكن لا يمكن إعطاء خروج جديد عبر مجال URL.History API و fragment تغير ممكن ما زال غير ممكن رؤية؛ حالة تغيير صار unknown بعد،Web بعد تراجع و قبل دخول غير ممكن استخدام.
- خروج في أمان سبب، متصفح سوف إخفاء جدا كثير iframe فشل:DNS،TLS،mixed-content،CSP و `X-Frame-Options` فشل ممكن إطلاق `load`، أيضا ممكن لا توفير يمكن عملية event، بينما لا هو إطلاق `error`. تحميل فشل notice فقط قدرة بصفة best-effort تلميح.
- Browser history سوف عبر body إعادة تركيب و عادي صفحة تحديث جديد إبقاء، لكن إغلاق tab أو إزالة `ui-sidebar-right` سوف في توقف ذلك occurrence و حذف قد تخزين history bucket.
- محلي ملف سوف يتم رفض، و متابعة من Document Preview مسؤول.
- محاكاة اقتراح Electron `<webview>` تحميل جسم،per-tab Cookie partition، أصلي history و target-specific CDP اتصال بعد لم تنفيذ.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت كمية:** لا إصدار companion.`BrowserNavigation` هو وحيد URL حالة كتابة جهة؛store استقبال هو immutable snapshot،controller و مكون تجمع تركيز اختبار مباشر تغطية إصدار و تنظيف.

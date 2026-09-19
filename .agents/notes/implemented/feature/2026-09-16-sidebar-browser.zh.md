# Agent Note: صندوق رملي تحويل Sidebar متصفح

Status: implemented

[English](2026-09-16-sidebar-browser.md) | العربية

## Problem

يمين جانب Sidebar يمكن معاينة قد بحث عنوان مساحة العمل ملف، لكن لا يوجد لأجل وصول شبكة صفحة مستقل واجهة. في تطبيق خارج فتح سوف فقد فقد Sidebar قسم شريط، طفو حركة و tab دورة الحياة. يأخذ مهمة معنى شبكة صفحة عند صار Document Preview محتوى، أيضا سوف خلط خلط اثنان نوع مختلف معلومة مهمة نموذج: شبكة صفحة تحكم واحد نشط وثب تصفح تصفح سياق، بينما وثيقة renderer فقط استقبال لـ مرة معاينة اختيار تحديد بايت.

أب صفحة لا يستطيع فحص أو قيادة عبر مجال iframe داخلي history. دعم حمل سلوك لا يستطيع داكن عرض أداة تجهيز هذا نوع قدرة.

## Decision

`@deepseek-ai/dsh-client-ui-sidebar-browser` تسجيل يمكن كثير فتح يمين جانب Sidebar `browser` tab نوع.`SidebarRightTabParamsMap.browser` قبول اختياري ابتدائي URL، جعل أخرى Client إضافة بلا يجب استيراد هذه الحزمة وقت التشغيل قيمة يكفي فتح Browser.

`MarkdownDelegateProvider` لـ تضمين طقم Markdown anchor توفير اختياري owner callback، لأجل تفويض حمل عادي HTTP(S) نقر، معا إبقاء حمل إصلاح زينة مفتاح نقر أصلي سلوك.Chat في node list خارج وضع وضع واحد Provider؛ قد تسجيل هذا نوع وقت، هو بـ URL بصفة typed navigation معامل فتح جديد `browser` tab، لا فإن استخدام نظام متصفح؛Markdown renderer لا استيراد Browser feature.

عنوان محلل قبول `http:` و `https:`، يشمل loopback هدف؛ لا حمل scheme رئيسي آلة اسم تكملة لـ HTTPS. هو رفض داخل تضمين اعتماد، تطبيق ذاته origin، شاذ شكل عنوان،`file:` URL، و كل أخرى scheme. محلي ملف متابعة من Document Preview مسؤول.

حالي Web و Desktop كل استخدام iframe تحميل جسم. هو افتراضي Web سياسة هو `sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"`؛frame لا يوجد مباشر تحت تحميل أو قمة طبقة تنقل flag.popup سوف انفصال مغادرة sandbox،Web popup سوف إبقاء opener، و يمكن عبر هذا سلسلة تنقل قمة طبقة تطبيق.same-origin سماح يتم وصول origin استخدام ذاتي ذات Cookie و Web storage؛ هو لن يجعل عبر مجال هدف و DSH تغيير صار نفس مصدر.iframe لا إرسال referrer، أيضا لا إضافة حزمة ذاتي لديه Permissions Policy، لذلك متصفح افتراضي سياسة و مستخدم تخويل توليد فاعلية. الأكثر يمين جانب toolbar فتح صلة سوف لـ حالي tab occurrence إزالة sandbox attribute؛ هذا نمط لا حفظ دائم، تفعيل خلال حمل متابعة عرض تحذير إبلاغ. لم تلقي sandbox قيد صفحة يمكن حسب متصفح activation قاعدة تنقل قمة طبقة تطبيق، و استخدام تحت تحميل، نموذج حالة محادثة إطار و إدخال قفل تحديد. هذه الحزمة لا تنفيذ Host جانب URL probe أو بديل إدارة.

كل tab نيل نيل واحد `BrowserController` class. هو أمر واجهة فقط لديه `loadUrl`،`goBack`،`goForward` و `reload`؛ هو مسؤول عنوان تحقق و `BrowserNavigation` حالة آلة.`BrowserFrame` واجهة مسؤول مؤقت sandbox و document حالة و تحميل جسم عملية،`IframeImpl` لـ حالي iframe تحميل جسم تنفيذ هذا واجهة.Slot injection عبر `useBrowserFrame` توفير حسب key بحث جذب frame حالة، و توفير عادي callback، لذلك React body لا استقبال controller أو observable source؛ هو فقط مسؤول يمكن تحرير مسودة مسودة و iframe DOM. لم قدوم `ElectronWebViewImpl` يمكن تنفيذ نفسه واجهة، بينما لا يأخذ URL أو تحميل جسم حالة وضع دخول مكون.

`BrowserNavigation` حفظ canonical حالي URL، تلقي تحكم تحميل revision، تنقل حالة، و لديه حد أعلى تسلسل و حالي موضع. جديد عنوان إسقاط forward فرع؛ بعد تراجع و قبل دخول نقل حركة index؛ تحديث جديد إعادة بناء تطبيق الأكثر بعد معروف URL كما لا زيادة history.body إعادة تركيب وقت سوف إعادة تحميل تطبيق الأكثر بعد معروف URL، و كما فقط في بعد بلا تلقي تحكم هدف وقت استخدام اختياري ابتدائي URL.Session-scoped store فقط حفظ دائم هذا class immutable snapshot، توفير عنوان تصيير و تطبيق تحديث جديد استعادة.occurrence abort سوف حذف ذلك bucket؛`TabDomain` مقابل tab حذف و `ui-sidebar-right` إزالة استخدام نفس عدد abort، لذلك إزالة أو حار إعادة تحميل Sidebar سوف صاف فارغ Browser history، أي جعل DockKit مع بعد استعادة tab record.

Browser حالة فقط يخص عرض طبقة، لا دخول Session log، نموذج طلب،resource model أو DockKit layout operation. قائم[يمين جانب Sidebar أساس أساس ضبط تطبيق](2026-09-04-right-sidebar-docking-infrastructure.zh.md) ،[tab نوع عقد نحو](../architecture/2026-09-05-sidebar-tab-types-and-navigation.zh.md) ،[resource model](../architecture/2026-09-05-client-resource-model.zh.md) و[وثيقة معاينة عملية](../architecture/2026-09-08-document-preview-operations.zh.md) متابعة مسؤول كل منها قائم مسؤولية.

## Web تنقل حالة

مقابل في واحد تلقي تحكم revision،Web تحميل جسم فقط يأخذ iframe رقم مرة `load` عند عمل تطبيق معروف URL تأكيد. نفس revision لاحق حدوث `load`، فقط قدرة إثبات وثيقة قد تغير، لا يمكن إعطاء خروج جديد عبر مجال URL. يحمل قديم revision حدث سوف يتم تجاهل اختصار.

| حالة | دخول شرط | عنوان و تحكم عنصر |
|---|---|---|
| `empty` | tab لا يوجد تلقي تحكم هدف. | عنوان لـ فارغ؛ بعد تراجع، قبل دخول، تحديث جديد و خارجي فتح متساو منع استخدام. |
| `loading` | عنوان إيداع، تطبيق history نقل حركة أو تحديث جديد بدء جديد revision. | طلب URL ما زال هو مرجعي عنوان؛ بعد تراجع و قبل دخول التزام دوران تطبيق history نطاق؛ تحديث جديد إبقاء متاح؛ خارجي فتح التزام دوران معروف هدف بروتوكول. |
| `known` | حالي revision استلام إلى iframe رقم مرة `load`. | أي جعل رقم مرة تحميل يتضمن HTTP redirect، طلب URL ما زال هو مرجعي عنوان. تحكم عنصر قاعدة و `loading` معروف هدف قاعدة نفسه. |
| `unknown` | حالي revision استلام إلى iframe ثاني مرة أو لاحق `load`. | الأكثر بعد واحد تلقي تحكم URL تغيير رمادي، و علامة `URL قد تغير`.iframe لا توفير عبر مجال `canGoBack` أو `canGoForward`، لذلك بعد تراجع و قبل دخول منع استخدام؛ خارجي فتح منع استخدام. تحديث جديد بـ الأكثر بعد واحد تلقي تحكم URL بدء جديد revision. |

كل حالة كل سماح تحرير عنوان. بلا فاعلية مسودة مسودة فقط تقرير إبلاغ عنوان خطأ، لا تغيير حالي تنقل حالة. تجمع تركيز unknown عنوان سوف إخفاء علامة و عرض قبل نحو حسب زر؛ عودة عربة و قبل نحو كل سوف بدء تلقي تحكم تحميل. تبديل sandbox نمط سوف استخدام جديد revision إعادة تحميل الأكثر بعد واحد تلقي تحكم Web هدف.iframe `error` event فقط سوف لـ حالي `BrowserFrame` revision علامة مؤقت تحميل فشل notice؛ هو لا تغيير URL history، تحت واحد تلقي تحكم document سوف صاف حذف هو. متصفح لن لـ DNS،TLS،mixed-content،CSP أو `X-Frame-Options` فشل يمكن اعتماد إطلاق هذا event. لا إنتاج iframe `load` `pushState`،`replaceState` و fragment تغير ما زال غير ممكن مراقبة.

## Deferred Electron carrier

Electron `<webview>` دعم حمل قد إتمام تصميم، لكن حالي لا تسجيل أيضا لا اختبار.controller إبقاء نفسه أربعة عدد أمر، مستقل per-tab view كائن مسؤول attachment،detachment، حالة مراقبة و target identity. هذا امتداد استخدام Playwright Android WebView تخطيط قسم:`AndroidWebView` هو من package،process و ضبط تجربة socket معرف target و دورة الحياة handle،`page()` إرجاع مسؤول Web تنقل و DOM أمر عادي `Page`؛ ضبط تجهيز درجة إدخال ما زال يخص `AndroidDevice`.

Desktop تصميم فقط في تطبيق نافذة تفعيل `webviewTag`. ذلك عزل preload نيل نيل غير ممكن تخمين per-window capability، كل Browser tab مجددا إلحاق جديد UUID، شكل صار مستقل غير حفظ دائم partition. رئيسي عملية فقط قبول يحمل هذا capability كما ابتدائي عنوان لـ `about:blank` guest، حذف أي preload، و قوي صنع تفعيل sandbox و context isolation، في كل frame منع استخدام Node integration، تفعيل Web security و أمان محتوى فحص، منع استخدام تضمين طقم webview و plugin.

رئيسي عملية فقط سماح صفحة إرسال بدء main-frame تنقل و إعادة تحديد نحو قبل نحو لا يحتوي اعتماد HTTP(S). طلب يمكن استخدام HTTP(S) ،WebSocket،data و Blob URL؛ مباشر file، ذاتي تعريف بروتوكول،extension و خاص حق طلب كل سوف يتم إلغاء.permission فحص و طلب، عرض التقاط، ضبط تجهيز تخويل، تحت تحميل، نابض نافذة و سحب وضع تنقل الكل رفض.

view كائن يأخذ غير نشط حركة guest إبقاء اتصال و توقف وضع في ذاتي لديه إخفاء DOM host في، مجددا يأخذ هو نقل عودة مرئي احتلال موضع رمز بينما لا إعادة بناء. هذا سوف في Sidebar body remount بعد إبقاء صفحة و target identity. لأن `<webview>` مشاركة و renderer تخطيط و دمج صار، عادي DOM dialog،menu،tooltip و سحب جر معاينة يمكن تغطية هو.`WebContentsView` ما زال لا دمج ملائم، لأن هو هو أصلي child surface:CSS لا يمكن تغطية هو، كل overlay أو حركة رسم كل حاجة رئيسي عملية تزامن visibility و bounds.

كل guest كل هو مستقل WebContents و CDP target. تطوير بيئة يمكن فتح وضع Electron عملية درجة remote-debugging port، و واضح اختيار guest target. إنتاج بيئة إبقاء هذا endpoint إغلاق؛browser-use أو computer-use حاجة واحد مرور مرور إقرار إثبات broker، يأخذ واحد قد تخويل tab ربط إلى ذلك WebContents، و استخدام `webContents.debugger` أو انتظار قيمة scoped transport، بينما لا عام الكل تطبيق target.

## Alternatives considered

**زيادة Host embeddability probe و حفظ دائم sandbox انحراف جيد.** لا اعتماد، لأن من Host طلب مهمة معنى هدف سوف إضافة جديدة SSRF مسار،probe ممكن و لاحق إعادة تحديد نحو نتيجة لا متسق، بينما حفظ دائم عام هروب توليد فتح صلة سوف يجعل لاحق tab وراثة لا أمان اختيار.Browser تعديل لـ توفير صريح، حسب tab، غير حفظ دائم sandbox فتح صلة، و حمل متابعة عرض تحذير إبلاغ.

**يأخذ parent-owned history عند صار كامل Web نموذج.** لا اعتماد، لأن iframe داخل تنقل بعد، عنوان سوف صامت لكن قديم قديم، بينما متبادل صلة عملية ما زال عرض متاح. حالي تلقي تحكم URL معروف وقت، لديه حد أعلى parent history ما زال لديه استخدام؛ صريح `unknown` حالة سوف إزالة iframe API لا يمكن دعم حمل قدرة إعلان.

**في Browser في دعم حمل `file:` URL.** لا اعتماد، لأن محلي ملف قد من Document Preview مسؤول، بينما browser تنقل استخدام مختلف معلومة مهمة نموذج.Browser مباشر رفض هذا بروتوكول، لا نيل أخذ نظام الملفات أو Workspace Files قدرة.

**عبر Host بديل إدارة شبكة صفحة.** لا اعتماد، لأن توافق بديل إدارة يجب إعادة كتابة URL،CSP،Cookie،module،stream،form و download، معا سوف يأخذ Host تغيير صار عام خروج محطة طلب جهاز.

**في أول عدد Browser تغيير في تنفيذ Electron تحميل جسم.** تأجيل معالجة، تجنب تجنب في لا يوجد تحزيم تطبيق دليل تغطية overlay stacking،target lifetime،Cookie عزل و الكل permission رفض مسار وقت تفعيل جديد Electron guest surface.

## Verification

اختبار وحدة تغطية بروتوكول تحليل،Markdown رابط تفويض حمل،controller أمر و دورة الحياة، تحديد صفة تنقل حالة تحويل، محدود history،best-effort iframe error و إضافة disposal.Keyless Web مشهد بدء مع مرفق composition، و تغطية رسالة رابط توجيه،HTTP(S) ، بعد تراجع، قبل دخول،sandbox تحكم،unknown تنقل و بروتوكول رفض.

## Consequences

Browser لا زيادة Electron إذن، و في حالي Web و Desktop بناء في إبقاء نفسه سلوك. جدا كثير محطة نقطة رفض iframe تضمين دخول، أو من اعتماد افتراضي sandbox لا نحو frame توفير تحت تحميل أو قمة طبقة تنقل.HTTPS تطبيق ممكن حسب mixed-content سياسة منع توقف عام مشترك HTTP صفحة، أو حد private-network طلب؛ إغلاق sandbox أيضا لا يمكن التفاف مرور هذه متصفح سياسة. إغلاق sandbox في أخرى جهة وجه سوف استخدام ذاته حفظ حماية تبديل أخذ توافق صفة:frame يمكن حسب متصفح activation قاعدة تنقل قمة طبقة تطبيق، و استخدام تحت تحميل، نموذج حالة محادثة إطار و إدخال قفل تحديد. هروب هروب خروج sandbox Web popup سوف إبقاء opener، و يمكن عبر هذا سلسلة تنقل قمة طبقة تطبيق. هذا اثنان بند مسار كل لن زيادة Electron أو Node API.URL فحص لا يمكن منع توقف iframe داخل صفحة ذاتي سطر اختيار هدف. لاحق iframe load قدرة جدول واضح قد حدوث تنقل، لكن لا يمكن إعطاء خروج عبر مجال URL؛History API و fragment تغير ممكن تماما غير ممكن رؤية. تأجيل Electron تحميل جسم يجب عبر حقيقي تحزيم تطبيق تحقق، عندئذ قدرة يصبح حالي سلوك.

محطة نقطة Cookie سلوك التزام دوران مستخدم متصفح، و لا حسب Browser tab عزل. محلي ملف سوف يتم رفض، و متابعة من Document Preview مسؤول. حفظ دائم URL ممكن يحتوي حساس شعور query أو fragment، لذلك مستخدم لا ينبغي في عنوان شريط إدخال لا أمل نظر إبقاء في تطبيق محلي متصفح تخزين في اعتماد.

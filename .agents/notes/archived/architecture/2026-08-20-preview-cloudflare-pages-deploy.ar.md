# Agent Note: كل PR معاينة نشر فوق Cloudflare Pages

Status: implemented
Archived: 2026-09-04

[English](2026-08-20-preview-cloudflare-pages-deploy.md) | العربية

## مشكلة

متصفح worker معاينة وجود معنى معنى هو مراقبة بعض عدد pull request قبل طرف و host شفرة تشغيل حالة، لذلك حاجة واحد خارج شخص لا يمكن وصول، حسب pull request عزل ساكن حالة حمل إدارة.GitHub Pages خاص إصدار فقط في GitHub Enterprise Cloud فوق متاح، بينما هذا مجموعة نسج بعد لم تحديد انتزاع؛ كما واحد مستودع واحد Pages محطة نقطة لا يمكن عزل كثير عدد pull request. أول مرة نشر تشغيل أيضا كشف واحد تحزيم نقص وقوع: جاف صاف checkout فوق `pnpm install` دائم بعيد لن إنشاء `dsh-pack-vfs-image` bin رابط،`build:preview` في أي «install لا هو في build بعد ركض» عمل شجرة فوق كل بـ `command not found` فشل.

## قرار

**نشر.**pull request كل مرة دفع إرسال يأخذ `apps/web/dist` إصدار إلى Cloudflare Pages مشروع `dsh-build-preview` فرع آخر اسم `pr-<number>` تحت، وضع في Cloudflare Access بعد (`.github/workflows/build-preview-cloudflare.yml`). فوق نقل فقط يحمل بناء ناتج——منصة دائم بعيد أخذ لا إلى مستودع شفرة المصدر،sourcemap بسبب داخل تضمين كامل شفرة المصدر في فوق نقل قبل حذف.`preview.html` قمة بديل `index.html` يصبح نشر أصل:served صفحة لا يوجد host حقن `window.__DSH_BOOT__` حينئذ لا يمكن بدء، الذي بـ أصل يجب هو قدرة بدء ذلك ورقة صفحة. نفس pull request داخل الأكثر جديد بناء فوز خروج؛ مختلف pull request كل احتلال كل آخر اسم URL، متبادل لا تنازع انتزاع. تشغيل فقط لديه في service token طلب إثبات تلقي حفظ حماية URL حق إرسال بلوغ تحزيم مرآة مثل بعد عندئذ حساب عبر:HTTP 200(Access وضع سطر هذا token؛302 معنى طعم حال Access سياسة نقص Service Auth قاعدة) ، بلا `content-encoding`(منصة لا نيل مقابل قد ضغط body إعلان نقل ضغط، لا فإن worker `DecompressionStream` سوف مقابل حال حل فتح عار tar ملء هواء) ،gzip سحر عدد `1f 8b`. حمل علامة حراسة حماية تقييم نقاش مقابل كل pull request فقط تقرير مرة مستقر آخر اسم URL.

**bin رابط.**pnpm فقط في رابط هدف في install وقت قد وجود حال حال تحت إنشاء workspace bin رابط.`bin` إشارة نحو بناء ناتج (`lib/bin.js`) لذلك في جاف صاف checkout فوق دائم بعيد نيل لا إلى رابط——أمر بعد بناء لن تكملة بناء رابط.packer في حزمة أصل إيداع `bin.js` بصفة مستقر رابط هدف؛ هو تحويل إرسال إلى `lib/bin.js`، بناء ناتج ناقص وقت نقطة اسم `pnpm run build` و بـ 1 خروج. و `dsh-subprocess-local` إيداع spawn-helper مدخل هو نفس نمط.

## سبق اعتبار بديل خطة

**GitHub Pages خاص إصدار.**Enterprise Cloud وحيد احتلال، كما `deploy-pages` كامل محطة استبدال، كثير عدد pull request سوف متبادل متبادل تغطية؛ حسب فرع فرعي دليل يلزم مشي متروك إبقاء فرع نشر عبر طريق و أكل ذلك بناء تردد معدل حد.

**استخدام Actions artifact عند معاينة.**تحت تحميل إذن و مستودع read إذن تدريجي حرف مقابل متساو، صفر صار هذا، لكن artifact هو zip تحت تحميل لا هو يمكن تصفح تصفح محطة نقطة. إبقاء عمل Cloudflare وجه بطلان وقت التقاط قاع.

**استخدام «build بعد مجددا install مرة» وثيقة شرح بديل بديل إيداع رابط هدف.**يجعل كل جاف صاف checkout كل بـ واحد نوع خطأ معلومة حل تفسير لا، اعتماد ترتيب طريقة تالف إسقاط؛CI كل مرة تشغيل تماما تماما حينئذ هو هذا مثال checkout.

## عاقبة

pull request معاينة يقع في `https://pr-<number>.dsh-build-preview.pages.dev`، وصول اشتراط Cloudflare Access تسجيل تسجيل؛ تلقائي تحويل استخدام service token عبر سطر. نشر منصة لا يحتفظ شفرة المصدر و sourcemap، هذا أيضا معنى طعم حال في sourcemap معالجة يتم مخصص باب تصميم قبل، معاينة لا يمكن يأخذ bundle خريطة عودة شفرة المصدر. مرآة مثل بايت عبر مسار——ضغط تخزين، بلا نقل مجددا تحرير رمز إرسال بلوغ——في كل مرة نشر وقت يتم تأكيد، منصة سلوك تغير سوف يجعل تشغيل فشل بينما لا هو يجعل worker بدء فشل.packer bin في أي جاف صاف checkout فوق مرة كامل بناء بعد يكفي استخدام،constraints جدول يأخذ `bin.js` تثبيت دخول إصدار ملف بيان.

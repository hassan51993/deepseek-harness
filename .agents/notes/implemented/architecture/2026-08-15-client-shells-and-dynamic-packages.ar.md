# Agent Note: عميل قشرة قسم طبقة و حركة حالة حزمة حد

Status: implemented

[English](2026-08-15-client-shells-and-dynamic-packages.md) | العربية

> [Client إضافة تركيب تحميل نموذج](2026-07-23-client-plugin-loading-model.ar.md) مسؤول وحدة وصول،Cordis دورة الحياة و HMR. هذا Note مسؤول حزمة ملكية، بناء face، مشترك وحدة طلب و npm اعتماد إعلان؛ هذه قرار يحل محل تركيب تحميل Note في مقارنة مبكر حزمة تصنيف و import حافة قاعدة.

## Problem

Client npm اعتماد منطقة مقطع وصف تثبيت و تطوير علاقة، لكن لا يستطيع يمكن اعتماد وصف bundle محتوى. يأخذ `dependencies`،`peerDependencies` أو `devDependencies` عند عمل خفي صيغة bundler إشارة أمر، ممكن داخل ربط هذا ينبغي مشترك React أو workspace هوية، أيضا ممكن يجعل بناء بعد مكتبة يحمل لم تحليل فرعي import، لكن لا يوجد تسليم إعطاء مسبق مدة مضيف تجميع.

متصفح تطبيق أيضا يتضمن مختلف زاوية لون:HTML/Vite تحرير ترجمة مدخل، لا اعتماد إطار هيكل Cordis بدء داخل نواة، ساكن حالة تركيب إعداد مكتبة، و من Loader معالجة إدارة إضافة.HTML رفع قبل تنفيذ يخص وصول سياسة، لا تعريف حزمة صنف آخر.Modules يجب أولا في Vite رئيسي وحدة وصول، معا متابعة استخدام عادي `lib/client.js` ناتج و حركة حالة رسم row.

مشترك UI مكتبة ما زال نحو كبير كمية إزالة استهلاك من كشف تزامن TypeScript و React فعلي جسم. في هذه فعلي جسم دخول service أو slot قبل، شكل صيغة فوق يأخذ مكتبة تعديل لـ حركة حالة entry فقط سوف إبقاء فعلي جسم اقتران دمج، و نموذج غامض خارج قشرة يجب مشترك وحدة هوية.

## Decision

### قسم طبقة و بناء شكل

| طبقة | عضو | مسؤولية | بناء و تحميل شكل |
| --- | --- | --- | --- |
| Web تحرير ترجمة قشرة | `apps/web` | يملك `index.html`،Vite إعداد،dist chunk و ساكن حالة مورد | من قد بناء package export تجميع نهائي متصفح ناتج |
| بدء داخل نواة | `packages/client/web` | يملك صاف DOM بدء صفحة، وحدة نظام وصل خط،Cordis settle و renderer handoff | `staticLinked` `lib/index.js`؛ بلا `dsh.client` row |
| ساكن حالة تركيب إعداد مكتبة | Cordis،`ui-primitives`،`ui-slots` | توفير مشترك وحدة هوية و مباشر فعلي جسم API | ESM `lib/index.js`، من Vite دمج تفكيك قسم؛ لا هو Loader entry |
| وحدة ذاتي رفع حزمة | `packages/client/modules` | توفير client وحدة جدول و ذلك Cordis wrapper | حمل واحد عادي `lib/client.js` حركة حالة حزمة؛host رفع قبل إرسال بلوغ ذلك factory |
| حركة حالة client حزمة | connection،`ui-renderer`، رئيسي عنوان و وظيفة إضافة | عبر Cordis service،slot و effect مشاركة و تطبيق | إعلان `dsh.client`، إنتاج خروج ذاتي تسجيل `lib/client.js`، و إبقاء host graph entry |

`packages/client/web` يأخذ Cordis إبقاء لـ matching peer و تطوير اعتماد، و يأخذ modules و ساكن حالة UI حزمة بصفة تطوير مدة تحرير ترجمة إدخال.`apps/web` إزالة استهلاك قد بناء package export، لا عبر alias قراءة workspace شفرة المصدر.

`staticLinked` مسبق ضبط يجعل `lib/index.js` في كل bare specifier إبقاء external import، و في جانب حافة إخراج متبادل مقابل CSS مورد إنتاج.Vite مضيف مسؤول تحليل و ذهاب إعادة هذه import، و قرار نهائي chunk حد. ساكن حالة مكتبة لن يأخذ مضيف تحزيم سياسة نسخ دخول ذاته ناتج.

### مشترك وحدة طلب

حركة حالة متصفح bundle سوف خفي صيغة external موحد واحد أساس مقعد:`PLATFORM_MODULES` تسمية من خارج قشرة بث نوع React،Cordis و ساكن حالة UI هوية،`PRELOADED_CLIENT_EXTERNALS` فإن لـ يجب أولا في shell بدء وصول حركة حالة هوية مسبق إبقاء، حالي لـ فارغ. حزمة فقط في دقيق طلب أساس مقعد خارج فعلي جسم وقت استخدام `dsh.client.external`. صاف نوع import سوف يتم مسح حذف، لا إنتاج طلب؛ سماح رقم ثلاثة جهة تنفيذ مكتبة إبقاء لـ bundle خاص محتوى.

طلب فقط لديه اثنان نوع مزود:

1. طلب الذي تسمية dynamic package row؛ نهاية ذيل `/client` سوف آخر اسم إلى هذا package row.
2. خارج قشرة ساكن حالة وحدة جدول في دقيق key.

لا وجود عام `dsh.client.provide` آخر اسم آلية. حركة حالة row و ساكن حالة key قد نفاد كل فعلي مزود،Cordis service provide و هذا متبادل متبادل مستقل. رسم تركيب سوف رفض شاذ شكل أو ناقص طلب، ذاتي طلب و تزامن طلب حلقة، و يأخذ حركة حالة مزود ترتيب في إزالة استهلاك من قبل.`ClientModuleSystem.import()` و `prefetch()` سوف في إزالة استهلاك من قدرة كاف شيء تحويل قبل تمرير عودة تسجيل تسجيل هذه حركة حالة مزود factory، لذلك شبكة شبكة وقت ترتيب لا يمكن كسر تالف تزامن طلب رسم.

### Parser مسبق تحميل و React نقل تسليم

Modules Node نصف حسب التالي ترتيب نحو فعلي إرجاع HTML حقن بدء بروتوكول:

1. بـ queue نمط تثبيت `window.__ModuleLoader__`، يتضمن `pendingQueue`،`load()` و `create()`.
2. بدء مسبق تحميل كل حمل revision application combo URL، منها يتضمن modules خارج row.
3. تنفيذ كل منع سد صيغة bootstrap combo URL؛ حالي منها يتضمن عادي modules factory registration.
4. منح قيمة `window.__DSH_BOOT__`، منها يتضمن الكل ضبط درجة وصف و كل row مفرد مورد HMR combo URL.
5. تنفيذ Vite رئيسي وحدة.

Bootstrap combo حالي فقط تسجيل تسجيل modules factory. بدء داخل نواة يأخذ أصلي رسم و خارج قشرة seed نقل إعطاء `__ModuleLoader__.create()`.Facade إزالة modules registration، استخدام رفض الكل external `require` دالة سوف ذلك شيء تحويل، مجددا استدعاء ذلك `createClientModuleSystem` توجيه خروج.Modules bundle تحليل رسم، بنية صنع و إرجاع `ClientModuleSystem`، يأخذ ذاته exports ذاكرة مؤقتة لـ modules row، و يأخذ نفس facade تبديل إلى live نمط. داخل نواة يأخذ هذا نسخة تركيب صار ذاته Loader `internal`،modules إضافة من هذا داخل قراءة و توفير `ctx.modules`. لذلك modules client face إبقاء صفر external ذاتي رفع اشتراط، أيضا لا يوجد وحدة درجة نظام هوية.

Host إصدار graph و combo descriptor وقت لن تجميع وصل استجابة body. كل نص برمجي URL مشترك استخدام واحد كسول صفة Promise، في أول مرة `GET` وقت تجميع وصل التقاط bundle بايت و إلحاق مقابل map URL؛ كل map URL استخدام آخر عدد كسول صفة Promise، فقط في أول مرة `GET` وقت قراءة و تركيب source map.`HEAD` لا إطلاق مهمة واحد body.Web URL ما زال من Loader تسوية و required-entry audit تحكم، لكن هذا عدد حينئذ خيط نقطة لن شيء تحويل combo body؛index طلب قراءة عند وقت الأكثر جديد graph.

Theme Host مساهمة سوف قبل وضع إلى index استلام تجميع ترتيب.head في CSS اختيار ابتدائي وثيقة رسم نشر ضبط لون لوح،`system` انحراف جيد مباشر استخدام `prefers-color-scheme`؛body نص برمجي في تحميل صفحة و تطبيق وحدة قبل تطبيق قائم ضبط لون لوح خاصية و حرف رقم متغير.

`immediately` طبقة درجة إتمام factory تسجيل بعد، داخل نواة إنشاء الكل Loader entry، انتظار Cordis ساكن توقف، و اشتراط كل fiber كل دخول ACTIVE. مع بعد استدعاء `ctx.uiRenderer.mount(container)`. حركة حالة `ui-renderer` حزمة يملك React،slot تصيير، قد لديه بدء DOM hydrate و React root دورة الحياة؛ بدء داخل نواة و فشل صفحة إبقاء React-free.

### اعتماد إعلان

كل Client حزمة كل يأخذ Cordis إبقاء لـ نطاق متسق `peerDependencies` و `devDependencies`؛Cordis هو وحيد peer.Browser import، نوع مرجع، وحدة توسيع ملء و `dsh.client.inject` كل هو تطوير إدخال، لأن Client بناء و إصدار profile سوف توفير ذلك تشغيل مدة هوية. معا إصدار Host مدخل حزمة يأخذ هذا مدخل تشغيل مدة value import وضع في `dependencies`.[إصدار اعتماد باب وجه](../process/2026-08-26-published-dependency-faces.ar.md) مسؤول حزمة اكتشاف، مثال خارج و صريح Host اسم سجل.

عادي تثبيت مكتبة ما زال وضع في `dependencies`: حركة حالة بناء يمكن داخل ربط خاص تنفيذ، بينما `staticLinked` مكتبة سوف إبقاء bare import تسليم إعطاء نهائي مضيف. كل بناء face مستقل قرار external، لا من npm منطقة مقطع دفع توجيه. إصدار ملف قائمة تغطية ناتج فعلي يمكن بلوغ كل تشغيل مدة مدخل، متبادل مقابل مورد إنتاج و إعلان ملف.

`verify-package-dependencies` فحص و إصلاح اعتماد منطقة مقطع.`verify-client-packages` فحص بناء شكل،parser preload مقابل متساو، مشترك وحدة طلب و وحدة رسم بلا حلقة صفة. مستودع publint pass مسؤول فحص إصدار إغلاق حزمة.

## Alternatives considered

**قيام أي يأخذ كل client حزمة تعديل لـ حركة حالة إضافة.** `ui-primitives` و `ui-slots` ما زال توفير تزامن فعلي جسم، كما لا يوجد مستقل service أو slot دورة الحياة؛ فقط إضافة manifest إعلان لن إزالة هذه import.

**لـ modules توليد مفرد وحيد `client-static.js`.** هذا حزمة ما زال هو حركة حالة رسم row و Cordis إضافة، فقط لديه factory رفع قبل وصول. ثاني نسخة ناتج سوف يأخذ مضيف سياسة تحرير رمز دخول ملف اسم، و يجعل نفس شفرة المصدر إنتاج اثنان عدد تشغيل مدة منتج.

**يأخذ الكل مشترك وحدة تحرير دخول Vite entry.** هذا سوف يجعل عمل خدمة إضافة فقد ذهاب نشر تركيب و إضافة درجة استبدال قدرة، يشمل renderer و رئيسي عنوان.

**إبقاء عام وحدة provider إعلان.** Package row و دقيق ساكن حالة key قد تسمية الكل مزود؛ آخر اسم سوف زيادة آخر طقم ملكية بروتوكول، لكن لا يوجد رقم ثلاثة نوع توفير إعطاء مصدر.

**في `apps/web/index.html` في صلب تحرير رمز مسبق تحميل URL.** URL و `rev` يخص host حالي graph. تعديل كتابة فعلي إرجاع HTML عندئذ قدرة يجعل queue،bundle URL و manifest استخدام نفس graph revision.

## Consequences

داخلي DSH علاقة فقط وضع في تطوير منطقة مقطع وقت،bundle محتوى ما زال إبقاء مستقر، لأن كل بناء face كل مباشر إعلان external. ساكن حالة مكتبة متابعة من مضيف تركيب إعداد، حركة حالة حزمة فإن إبقاء موحد واحد ناتج و دورة الحياة معالجة إدارة. إصدار profile يملك كامل Client حزمة اسم سجل، لذلك كل Client حزمة لم يعد اشتراط npm عبر peer placement تكرار طلب حل نفس ورقة رسم.

بدء بروتوكول اعتماد modules package id،modules أيضا يجب إبقاء تشغيل مدة ذاتي يتضمن.Combo توليد إبقاء ذلك عادي package ناتج، و لـ أخرى الكل row توفير واحد بند مشترك ابتدائي نقل؛HMR استخدام نفس بند توجيه، و فقط يأخذ هذا row بصفة مورد. استجابة body تأخير متأخر توليد سوف يأخذ تجميع وصل نقل إلى أول مرة وصول، بينما map مستقل تأخير متأخر توليد سوف يجعل فقط توفير ضبط تجربة جهاز استخدام عمل لا دخول نص برمجي تسليم مسار. نقص قليل bootstrap registration سوف في Cordis بدء قبل فشل؛ لاحق إضافة import،apply و service انتظار فشل ما زال من بدء صفحة ACTIVE مسح عرض.

خارج قشرة إزالة استهلاك قد بناء `lib/` منتج، لذلك في متبادل صلة build أو watcher تشغيل قبل، شفرة المصدر و متصفح ناتج ممكن عائم نقل. فقط شفرة المصدر typecheck عبر لا يستطيع إثبات فعلي خدمة تطبيق استخدام نفس نسخة شفرة.

اثنان عدد ساكن حالة UI مكتبة ما زال هو واضح مثال خارج. يأخذ منها مهمة واحد بند تحويل لـ حركة حالة حزمة وقت، يجب في نفس تغيير في يأخذ الكل فعلي جسم إزالة استهلاك من ترحيل إلى service أو slot، و من ساكن حالة seed حذف مقابل هوية.

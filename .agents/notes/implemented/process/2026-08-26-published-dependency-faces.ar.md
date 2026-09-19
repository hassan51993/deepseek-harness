# Agent Note: إصدار اعتماد باب وجه و لديه حد peer في استمرار

Status: implemented

[English](2026-08-26-published-dependency-faces.md) | العربية

## مشكلة

واحد حزمة ممكن معا يتضمن متصفح bundle،Host مدخل، مشترك TypeScript إعلان و Cordis حقن بيانات وصفية. يأخذ هذه علاقة الكل تحرير رمز صار مطلوب npm peer سوف جعل قد إصدار CLI تثبيت بديل قيمة مرور عال:npm سوف تلقائي تثبيت peer، و امتداد عميق طبقة، عكس تكرار تجميع دمج peer مسار تكرار تنفيذ وضع وضع فحص. تعديل إصدار نطاق أو يأخذ peer علامة صار optional كل لن إزالة حذف هذا صنف مرة تاريخ.

Client بناء إدخال من إصدار profile اختيار، بينما Host value import من استيراد هو حزمة عبر Node تحميل؛ اثنان من حاجة مختلف npm منطقة مقطع. يأخذ قاعدة تطبيق إلى كل Host حزمة رغم لكن أيضا قدرة تقليص صغير اعتماد رسم، لكن سوف صنع صنع واحد لا يوجد مقابل تثبيت استلام فائدة كبير نطاق ترحيل.

## قرار

### حزمة اختيار

[`verify-package-dependencies`](../../../../scripts/verify-package-dependencies.ts) موحد واحد مسؤول اعتماد منطقة مقطع سياسة. هو بداية نهاية تغطية `packages/client/` تحت حزمة، و إعلان `dsh.client` كل غير فعلي تحقق حزمة. في هذا دليل داخل،`dsh.client` علامة حاجة مسح Host مدخل Client/Host حزمة؛ لا يوجد هذا إعلان حزمة هو فقط توفير Client تحرير ترجمة ساكن حالة إدخال. في دليل خارج،`dsh.client` اختيار نفسه Client/Host مسح. فقط لديه `"./client"` export فقط هو API، لا مشاركة و npm اعتماد سياسة اختيار حزمة.

[`package-dependency-policy.ts`](../../../../scripts/package-dependency-policy.ts) توفير صريح Client باب وجه include و exclude قائمة.include لأجل لا يوجد `dsh.client` مثال خارج حزمة،exclude لأجل إزالة `packages/client/` خارج تلقائي اكتشاف مزدوج وجه حزمة. تحقق جهاز رفض لم معرفة، بطلان، زائد بقية، تكرار، متبادل متبادل إعادة تراكم و لا يمكن توليد فاعلية بند إعداد.include قائمة لـ فارغ؛exclude قائمة يتضمن `@deepseek-ai/dsh-api-session-controller` و `@deepseek-ai/dsh-api-workspace-controller`. يأخذ Session Controller إضافة عودة سوف كثير ترحيل تسعة بند Host حافة، بينما خمسة مرة مرشح تكرار قياس resolver في موضع عدد فقط تعديل حسن 0.15 ثانية.

Host-only حزمة عبر آخر نسخة صريح قائمة إضافة دخول نفس سياسة. هذا قائمة يتضمن `@deepseek-ai/dsh-llm` و `@deepseek-ai/dsh-session`؛ شفرة المصدر import لن تلقائي توسيع كبير قائمة.

### اعتماد منطقة مقطع

كل تلقي إدارة حزمة كل يأخذ `@deepseek-ai/cordis` إبقاء في نطاق متسق `peerDependencies` و `devDependencies` في.Cordis هو من تطبيق تحكم هوية مشترك إضافة وقت التشغيل.

Host مدخل إغلاق حزمة في تشغيل مدة value import الذي وصول workspace حزمة، فقط لديه في ذلك كامل وقت التشغيل مدخل صف دخول `duplicateSafePackages`، أو كل تشغيل مدة تصدير كل صف دخول `safeHostDependencyExports` وقت عندئذ فقط يخص `dependencies`. حزمة درجة قائمة يتضمن `@deepseek-ai/dsh-brand`،`@deepseek-ai/dsh-typert-protocol`،`@deepseek-ai/dsh-util-crypto` و `@deepseek-ai/dsh-util-values`: هو جمع قيمة بلا حالة، حسب بنية تعرف آخر، أو عبر حمل إصدار كما يمكن متبادل عملية وصف رمز تخزين. تصدير جدول مسؤول معالجة أخرى تصدير لا يمكن توفير نفس انتظار حفظ إثبات خلط دمج حزمة في قد مراجعة فحص قيمة.

constructor هوية أو وحدة حالة يجب مشترك تصدير صف دخول `peerRequiredHostExports`؛ واحد حالما استخدام هذا صنف تصدير، كامل بند حزمة اعتماد حافة حينئذ إبقاء في نطاق متسق `peerDependencies` و `devDependencies` في. كل تصدير جدول key كل هو دقيق module specifier، كل value كل هو مرور مراجعة فحص تصدير تجميع دمج. تحقق جهاز من Host مدخل امتداد تشغيل مدة محلي import مسح، سجل أداة اسم و افتراضي import و re-export، و رفض حيث لا يوجد حزمة درجة تصنيف، أيضا لا يوجد تصدير درجة تصنيف تصدير؛ حذف غير كامل دقيق مدخل قد حسب حزمة تصنيف، لا فإن namespace،dynamic و side-effect import ما زال لا يمكن حد تحديد نطاق.

Client bundle استخدام workspace import، صاف نوع import، وحدة توسيع ملء،`dsh.client.inject` و فقط لديه بيانات وصفية الآن تخزين peer فقط يخص `devDependencies`.Host وقت التشغيل import(يشمل مقدار خارج Node مدخل) التزام دوران Host تصنيف.[متصفح رقم ثلاثة جهة بناء إدخال](2026-09-08-browser-third-party-build-inputs.ar.md) قاعدة تحديد عادي رقم ثلاثة جهة إعلان، جزء يحل محل هذا قرار مقابل هو جمع أصل منطقة مقطع إبقاء.Workspace مرجع استخدام `workspace:^`.

جزء تطوير مدة علاقة فقط وجود في `dsh.client.inject` أو TypeScript project reference في. سياسة `configurationOnlyDevDependencies` جدول فقط صف خروج هذه قد مراجعة اعتماد حافة، و سوف هو جمع إبقاء في `devDependencies` في.

تحقق جهاز قراءة شفرة المصدر manifest و شفرة المصدر ملف، لذلك يمكن في لا يوجد قد بناء `lib/` جاف صاف عمل شجرة فوق تشغيل. كل يتم اختيار في Host face كل يجب وجود `src/index.ts`. لم تصنيف Host تشغيل مدة تصدير يخص سياسة مخالفة قاعدة، سوف منع توقف `--fix` الكل كتابة؛ صيانة من يجب مراجعة فحص هذا تصدير، و اختيار تصنيف هذا تصدير، تعديل شفرة المصدر علاقة أو تعديل اختيار حزمة نطاق. شفرة المصدر أمان فحص عبر بعد،`--fix` فقط تنفيذ تصنيف الذي تحديد منطقة مقطع و نطاق تغيير، و حذف بطلان peer بيانات وصفية.

### صيانة مسار

لا حمل `--fix` تشغيل تحقق جهاز، سوف بـ فقط قراءة طريقة فحص اختيار حزمة نطاق، تصدير تصنيف، اعتماد منطقة مقطع،workspace range و peer metadata. لم تصنيف تشغيل مدة import سوف حسب كل تصدير قسم آخر تقرير إبلاغ يمكن نقر `path:line:column` تشخيص.

```sh
pnpm run verify-package-dependencies
```

توليد manifest قبل، في [`package-dependency-policy.ts`](../../../../scripts/package-dependency-policy.ts) في تصنيف كل إضافة جديدة Host تشغيل مدة تصدير.`duplicateSafePackages` سماح واحد دقيق أصل مدخل الكل تشغيل مدة تصدير استخدام عادي dependency؛`safeHostDependencyExports` فقط سماح صف خروج تصدير؛`peerRequiredHostExports` يجعل كامل توفير حزمة اعتماد حافة إبقاء في نطاق متسق peer و تطوير منطقة مقطع. واحد تصدير فقط قدرة نيل نيل واحد نوع تصنيف. إزالة حزمة درجة identity أو حالة اشتراط بعد، حسب حزمة تصنيف ذلك أصل مدخل؛ فقط تغيير خلط دمج حزمة في واحد تصدير وقت، فإن تحديث دقيق تصدير جدول. فقط لديه عند واحد بند اعتماد حافة كل import كل لم يعد استخدام peer-required تصدير وقت، هو عندئذ سوف يصبح عادي dependency.

استخدام واحد بند أمر توليد تلقي إدارة manifest و كل مباشر إرسال إنتاج شيء. وجود سياسة مخالفة قاعدة وقت،`--fix` لا كتابة أي ملف؛ نجاح بعد، هو سوف تحديث جديد `pnpm-lock.yaml`، إعادة توليد في إنجليزي نص module graph و ذلك إعداد مقابل سجل، و ضرب طبع عادي dependency و peer-required اعتماد حافة.

```sh
pnpm run verify-package-dependencies -- --fix
git diff -- packages pnpm-lock.yaml docs/module-graph.md docs/module-graph.ar.md docs/module-graph.i18n.yaml
```

عبر فقط metadata محلي registry قياس كمية عمل شجرة اعتماد رسم و Git ref. كل جولة كل سوف إنشاء كل جديد consumer و npm cache، استخدام واضح peer،hoisting و registry ضبط استبدال وراثة npm إعداد، تنفيذ `npm install --package-lock-only`، رفض تحت تحميل حزمة عودة ملف، و إبقاء مستودع ثابت.`--runs` تحكم تكرار مرة عدد،`--timeout-ms` سوف في مدة حد وصول بعد إنهاء npm عملية شجرة، اختياري `--max-ms` سوف في الأكثر بطيء واحد جولة تجاوز مرور عتبة قيمة وقت يجعل أمر فشل.

```sh
pnpm run benchmark:npm-resolution -- --runs=5 --timeout-ms=300000
pnpm run benchmark:npm-resolution -- --ref=origin/master --runs=5 --timeout-ms=300000
```

عبر اثنان عدد متبادل لا توافق DSH دمج صار إصدار تحقق حزمة سقوط موضع. تحقق جهاز يأخذ كل نسخة حالي DSH manifest قسم آخر نسخ لـ `0.1.0` و `0.2.0`، فقط اشتراط npm توليد package lock، و رفض عبر إصدار DSH تحليل، غير مسبق مدة DSH مسار، اثنان طقم إصدار بيان لا متسق، كثير عدد Cordis نسخة و حزمة عودة ملف طلب. محلي بحث جذب فقط يتضمن حالي منصة قد تثبيت metadata، لذلك فقط تقرير إبلاغ بينما لا رفض npm قد قبول غير ممكن استخدام اختياري حزمة استكشاف قياس.

```sh
pnpm run verify-npm-install-layout
```

حساب حساب تحت واحد بند Host حزمة وقت، أمر سوف في داخل تخزين في تطبيق حالي سياسة، قياس كمية baseline، تدريجي عدد محاولة تجربة يمكن بلوغ كما لم إعداد حزمة، و سلسلة سطر تكرار قياس خشن غربلة في الأكثر سريع مرشح. صحيح عدد `gainSeconds` انتظار في `baseline median - candidate median`؛`--candidates` حد تحديد اسم سجل،`--jobs` تحكم خشن غربلة تزامن درجة، اثنان عدد مرحلة مقطع كل لا كتابة manifest. اختيار في مرشح ما زال يحتاج أولا إتمام تصدير تصنيف، عندئذ قدرة إضافة دخول `hostPackages`.

```sh
pnpm run benchmark:npm-resolution:next -- --runs=1 --finalist-runs=5 --finalists=5 --jobs=8 --timeout-ms=120000
```

### صفة قدرة تحقق

[`verify-npm-install-layout`](../../../../scripts/verify-npm-install-layout.ts) هو `Release (dsh)` workflow في كل pull request و master push فوق تشغيل تحديد صفة حزمة مسار و إصدار فحص؛ هو لا حد resolver استهلاك وقت.[`benchmark-npm-resolution`](../../../../scripts/benchmark-npm-resolution.ts) و [`benchmark-next-package-dependency`](../../../../scripts/benchmark-next-package-dependency.ts) إبقاء لـ يد حركة أداة، لأن resolver استهلاك وقت سوف مع آلة جهاز سالب تحميل و metadata إتمام ترتيب تغير. هو جمع عبر كل جديد consumer و فقط metadata تشغيل، يأخذ npm اعتماد شجرة حساب حساب و registry تأخير متأخر، حزمة عودة ملف تحت تحميل قسم مغادرة، لذلك متبادل مقابل نتيجة يمكن تحديد موضع peer في استمرار، لكن لا بنية صار إصدار وقت صفة قدرة تحمل وعد.

توليد بعد سياسة هدف قبل في 13 عدد حزمة في إبقاء تحت 27 بند يقع في `dependencies` تلقي إدارة Host وقت التشغيل حافة. اثنان بند حافة ما زال يقع في `peerDependencies`:`dsh-api-remotes → dsh-scope` استخدام `carrierKeyOf`،`dsh-session → dsh-scope` استخدام `scopeOf` و `scopeTarget`.

## اعتبار مرور بديل خطة

**يأخذ داخلي علاقة متابعة إبقاء لـ peer.** npm يجب امتداد تجميع دمج أصل أولا مسار وضع وضع و تحقق كل مطلوب peer؛ أي جعل داخلي إصدار الكل توافق، أيضا سوف إعادة إنتاج قد تقرير إبلاغ تثبيت استهلاك وقت مشكلة.

**استخدام `"./client"` export بصفة Client باب وجه اسم سجل.** حزمة ممكن إصدار Client نوع أو متصفح API، لكن لا مساهمة حركة حالة تركيب تحميل row. اختيار في هذا صنف حزمة سوف يأخذ ترحيل توسيع كبير إلى Goal،Session Title و Todo انتظار غير متصل Host حزمة.`dsh.client` معرف حركة حالة row، بينما `packages/client/` دليل مستقل تغطية ساكن حالة Client إدخال.

**التقاط مستو الكل Host حزمة.** هذا سوف إزالة أكثر كثير peer عمل، لكن يأخذ ترحيل توسيع كبير إلى مفرد حزمة benchmark استلام فائدة يمكن تجاهل اختصار حزمة. صريح Host قائمة سوف إبقاء ذلك بقية peer قيد، مباشر إلى قياس كمية نتيجة إثبات ينبغي زيادة جديد عضو.

**يأخذ كل Client متبادل صلة إعلان كل تعديل لـ فقط تطوير اعتماد.** مزدوج وجه حزمة Host value import ما زال هو فعلي Node تحميل؛ من إصدار اعتماد رسم في حذف إسقاط هو جمع، سوف يجعل حزمة اعتماد profile أحيانا لكن رفع رفع.

**في CI في قوي صنع جدار ساعة عتبة قيمة.** Resolver استهلاك وقت سوف مع آلة جهاز سالب تحميل و metadata إتمام ترتيب تغير. تحديد صفة manifest تصنيف دخول CI، استهلاك وقت قياس كمية إبقاء لـ صيانة من benchmark.

## نتيجة

إصدار اعتماد رسم حسب ناتج ملكية بينما لا هو شفرة المصدر دليل اقتران دمج تصنيف.Client bundle و إصدار profile توفير متصفح وقت التشغيل هوية،Host وحدة تثبيت ذاتي ذات تحميل يمكن تكرار فعلي جسم، بينما Cordis و صريح علامة لـ peer-required Host تصدير متابعة مشترك حزمة نسخة.

يأخذ عام صاف نوع علاقة وضع دخول `devDependencies`، معنى طعم حال مستقل TypeScript إزالة استهلاك من في استخدام هذا إعلان وقت يجب ذاتي سطر تثبيت يتم مرجع نوع حزمة. إصدار profile سوف تثبيت كامل تلقي دعم حمل حزمة عائلة؛ إذا يلزم دعم حمل مستقل تجميع TypeScript إزالة استهلاك من، حاجة آخر طقم سياسة.

صريح override،Host قائمة، حزمة تصنيف و تصدير تصنيف كل هو حاجة مراجعة قرار. عند `instanceof` استخدام class constructor، خاص symbol و وحدة محلي registry عبر حزمة نقل تمرير identity أو غير ممكن وصول حالة وقت، هو جمع اشتراط peer. مستقر بنية علامة أو حمل إصدار prototype وصف رمز يمكن يجعل خاص تحديد قيمة متبادل عملية، لكن فقط فقط يخص value import و لا يستطيع فعل إلى هذا واحد نقطة. تعديل تصنيف سوف تغيير تثبيت رسم، لذلك حاجة تشغيل تجمع تركيز verifier اختبار، مزدوج إصدار تخطيط فحص و إعادة تنفيذ next-package benchmark. فقط metadata benchmark هو تشخيص دليل، لا هو إصدار وقت تثبيت استهلاك وقت تحمل وعد.

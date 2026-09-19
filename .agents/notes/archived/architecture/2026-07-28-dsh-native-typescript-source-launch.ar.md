# Agent Note: dsh أصلي TypeScript شفرة المصدر بدء

Status: implemented
Archived: 2026-08-07

[English](2026-07-28-dsh-native-typescript-source-launch.md) | العربية

> Node أصلي بدء خطة قد يتم [dsh عبر tsx ESM hook شفرة المصدر بدء](2026-07-29-dsh-source-launch-tsx-esm.md) يحل محل:Node 26.0.0 إزالة `--experimental-transform-types`، هذا نص وصف paths loader قد حذف.Cordis إعداد إعلان بوابة (`verify-cordis-config`) ،app-boot صريح فشل إضافة تشخيص و vendor في `import type` علامة ملاحظة ما زال صالح.

## مشكلة

`dsh` شفرة المصدر مدخل أصل هذا استخدام `tsx` تشغيل `apps/cli/src/bin.ts`،TypeScript تحويل و أصل tsconfig `paths` تحليل كل من نفس عدد رقم ثلاثة جهة loader خفي صيغة معالجة. تعديل من Node أصلي معالجة TypeScript بعد،Node لن تطبيق tsconfig مسار خريطة؛ إذا تعديل لـ عبر حزمة توجيه خروج تحليل، شفرة المصدر بدء سوف خلط دخول ممكن قديم قديم أو لا وجود `lib/` ناتج.

Node تحويل أيضا لا تنفيذ نوع قسم تحليل. عبر عادي قيمة import استيراد نوع سوف إبقاء لـ وقت التشغيل ESM طلب، بينما TypeScript `export =` سوف تحويل صار CommonJS منح قيمة، بينما لا هو ESM default export. لذلك، شفرة المصدر رسم يجب صريح استخدام فقط نوع استيراد و أصلي ESM توجيه خروج؛resolve hook لا يمكن إصلاح لا توافق شفرة المصدر لغة قاعدة.

Cordis إعداد أيضا جذب دخول آخر بند تحليل حد.`cordis.yml` في bare plugin لا مرور مرور TypeScript import قسم تحليل، ذلك تحليل جهة manifest(بيانات وصفية بيان) ممكن تسرب إسقاط الذي يحتاج اعتماد.Cordis Loader سوف سجل إضافة import خطأ، و إبقاء تحت لا يوجد fiber entry، لكن لن يجعل بدء ذاته فشل؛ إعداد في تجميع كتابة خطأ لذلك ممكن نيل إلى خروج رمز لـ 0 ناقص نقص تطبيق.

## قرار

`dsh` TUI،Web و بلا رأس شفرة المصدر بدء استخدام `node --experimental-transform-types`، من Node إتمام TypeScript تحويل، لا تحميل `tsx` أو esbuild.`bin/dsh`، أصل درجة `dsh`/TUI/Web demo و Code Mode TUI كل دخول نفس بند `apps/cli/src/bin.ts` بدء سلسلة مسار. اختبار و e2e بدء جهاز إبقاء كل منها قائم سياسة، بناء بعد `lib/bin.js` متابعة من عادي Node تشغيل.

`scripts/tspath-loader.ts` فقط تسجيل واحد وحدة تحليل خطاف. ضبط `TSX_TSCONFIG_PATH` وقت، هو سوف استخدام هذا مسار (متبادل مقابل مسار من استدعاء جهة cwd تحليل) ، لا فإن قراءة أصل `tsconfig.json`؛`TsconfigPathsResolver` استخدام مستودع قد لديه TypeScript تطوير أداة امتداد هذا إعداد `extends` سلسلة تحليل، حسب tsconfig قاعدة اختيار دقيق أو wildcard `paths` بند، و سوف أمر في workspace bare specifier خريطة إلى `.ts`/`.mts`/`.cts` مصدر ملف أو دليل index ملف. شفرة تحويل بداية نهاية فقط من Node مسؤول. هذا شفرة المصدر مخصص استخدام loader لا يخص بناء بعد CLI،`apps/cli` أيضا لن يأخذ `typescript` إعلان لـ وقت التشغيل اعتماد.

فقط لديه عند هدف حزمة هو الأكثر قريب واحد طبقة حزمة manifest ذاته اسم أو هذا manifest قد إعلان وقت التشغيل اعتماد وقت، شفرة المصدر import عندئذ سوف إعادة تحديد نحو.Cordis Loader استخدام إعداد دليل URL بصفة import parent؛ هذا وقت resolver سوف نحو فوق فحص بحث إعلان هذا إضافة workspace manifest. لذلك، قد تسليم `apps/cli/config/base.cordis.yml` و ذلك واجهة تغطية طبقة الذي يحتاج اعتماد من `apps/cli/package.json` يحتفظ. لم أمر في tsconfig paths، مرجع لم إعلان اعتماد أو لا هو bare specifier شرح رمز الكل تسليم عودة Node افتراضي تحليل.

`verify-cordis-config` مقابل هذا تحليل جهة manifest تنفيذ مفرد نحو كامل صفة فحص: إعداد في كل bare plugin package كل يجب ظهور في مقابل manifest `dependencies` في،manifest يمكن يتضمن هذا إعداد لم مرجع مقدار خارج اعتماد. أصل `AGENTS.md` سوف تزامن تحديث إعداد و اعتماد تحديد لـ معتاد إقامة قاعدة.

Loader تماما توقف مستقر بعد، مشترك `dsh-app-boot` سوف فحص كل قد تفعيل لكن لا يوجد fiber entry، و رفض بدء، تقرير خطأ لـ `plugin(s) failed to load: ...; Cordis startup failed because these plugin(s) could not be resolved`، معا صف خروج الكل تحميل فشل إضافة. هذا تشخيص يقع في تطبيق طبقة، لا تغيير vendor في Loader بدء سلوك.

Node-compatible TypeScript هو هذا بند شفرة المصدر بدء عقد نحو واحد جزء.vendor في Cordis،Loader،Include،HMR(حار وحدة استبدال) و Schemastery استخدام `import type` علامة سوف يتم مسح حذف استيراد.Schemastery استخدام أصلي ESM default export و إعلان `type: module`؛ ذلك `.mjs` و `.cjs` بناء ناتج قسم آخر إبقاء قائم ESM default export سلوك و `require()` إرجاع يمكن استدعاء قيمة سلوك. هذه فرق مختلف سجل في `vendor/README.md` في؛ لا يوجد لـ vendor في إطار هيكل إضافة جديدة وقت التشغيل سلوك.

## سبق اعتبار بديل خطة

**متابعة استخدام `tsx`.** لا اعتماد، لأن `tsx`/esbuild سوف متابعة مسؤول TypeScript تحويل، هذا بدء سلسلة مسار لا يمكن لذلك إثبات Node أصلي تحويل متاح.

**يجعل شفرة المصدر مدخل عبر حزمة توجيه خروج تحميل بناء بعد `lib/`.** لا اعتماد، لأن هذا سوف خلط دمج source plane و artifact plane؛ بلا حاجة مسبق أولا بناء تطوير بدء ممكن قراءة قديم قديم ناتج أو مباشر فشل.

**بلا شرط تطبيق أصل tsconfig `paths`.** لا اعتماد، لأن هذا سوف يجعل لم إعلان عبر حزمة import و Cordis إضافة متابعة نجاح تحليل، من بينما إخفاء غطاء manifest و فعلي تشغيل رسم بين لا متسق.

**في ذاتي تعريف loader داخل تحويل import.** لا اعتماد، لأن شعور معرفة نوع شفرة المصدر تعديل كتابة سوف إعادة جذب دخول تحرير ترجمة جهاز صيغة تحويل، و يجعل loader بينما غير Node مسؤول تنفيذ TypeScript. جعل توقيع دخول مستودع شفرة المصدر توافق Node، يمكن يجعل بدء حد إبقاء صريح.

## عاقبة

- TUI/بلا رأس واجهة إبقاء صفر بناء شفرة المصدر عودة مسار،Web ما زال سوف في بدء CLI شفرة المصدر مدخل قبل بناء قبل طرف ناتج.TypeScript لغة قاعدة فقط مرور مرور Node أصلي تحويل؛ فقط معالجة URL loader استخدام checkout أصل دليل تطوير اعتماد، لا زيادة CLI وقت التشغيل اعتماد.
- workspace package import و Cordis إعداد اعتماد كل يجب في تحليل جهة manifest في واضح إعلان؛ ساكن حالة بوابة منع توقف إعداد أولا في اعتماد سقوط أرض، مقدار خارج اعتماد لا بنية صار خطأ.
- إضافة import فشل لم يعد إبقاء تحت خروج رمز لـ 0 ناقص نقص تطبيق؛ نهائي خطأ معا شرح Cordis بدء فشل و أداة جسم إضافة اسم،Loader أصلي خطأ ما زال سوف إبقاء في أكثر مبكر سجل في.
- CLI شفرة المصدر رسم في vendor شفرة المصدر يجب و Node transform-types وحدة دلالة توافق؛ محلي تعديل سجل واضح فوق تنقل تزامن معنى خدمة.
- CI `lib` نمط، اختبار/e2e بدء جهاز و أخرى عرض مثال بدء جهاز إبقاء كل منها قائم سياسة؛ هذا أصلي شفرة المصدر loader فقط تغطية `dsh` CLI تطبيق سلسلة مسار.

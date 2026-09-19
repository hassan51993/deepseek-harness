# Agent Note: استخدام tsdown بديل dumble إجراء JS تحزيم

Status: implemented
Archived: 2026-07-27

[English](2026-06-11-tsdown-over-dumble.md) | العربية

## مشكلة

الأكثر أول بناء استخدام **dumble**، أي cordiverse صفر إعداد esbuild حزمة تركيب طبقة——فوق تنقل Cordis ذاته أيضا استخدام هو بناء——و vendor حزمة (package) اتفاق الأكثر كبير مسار درجة مقابل متساو (هو قراءة كل package.json و من `exports` حقل دفع قطع مدخل/صيغة). لكن dumble بصفة هذا مستودع تحمل إعادة أداة وجود خفي علة:v0.2.x، كل دورة نحو 530 مرة npm تحت تحميل، فعلي جودة فوق فقط لديه واحد موضع صيانة من، بينما كما من في هو لا يوجد workspace نمط، أنا جمع لا نيل لا عبر ذاتي تعريف تحرير ترتيب نص برمجي (`scripts/build.ts`) قدوم استدعاء هو.

هدف قبل بناء ناتج فقط في `pnpm run build` + publint في متعمد معنى (بعد لم إصدار أي حزمة؛ تطوير/اختبار/عرض عرض عبر tsx مباشر تشغيل لم تحزيم شفرة المصدر) ، لذلك تبديل صار هذا الآن الأكثر منخفض، واحد حالما حزمة بدء إصدار حينئذ فقط سوف أكثر عال.

## قرار

استخدام **tsdown**(أساس في rolldown، كل دورة نحو 250 ألف مرة تحت تحميل،VoidZero دعم حمل، نشط وثب إصدار) بديل dumble:

- أصل دليل `tsdown.config.ts`، إعداد `workspace: ['vendor/*', 'packages/*/*']`(صريح glob سوف تحزيم نطاق حد تحديد في vendor Cordis و TypeScript حزمة دليل شجرة داخل؛`workspace: true` أيضا سوف اكتشاف عرض مثال manifest و لا حاجة تحزيم workspace عضو).
- مشترك شكل حالة: مدخل لـ `lib/types/index.js`،`outDir: 'lib'`،ESM،`platform: node`،`target: es2024`،`fixedExtension: false`(لـ `"type": "module"` حزمة إبقاء `.js`) ،`dts: false`(إعلان عودة tsc -b كل) ،`clean: false`(lib/ أيضا حفظ TSC `lib/types` في بين شجرة). مدخل الأكثر أول هو `src/index.ts`؛[TSC أولوية بناء Agent Note(agent قرار سجل)](2026-06-17-ts-build-config.md) مع بعد سوف tsdown تعديل لـ تحزيم TSC إخراج JS، جعل TypeScript تحويل سلوك موحد واحد من واحد تحرير ترجمة جهاز توفير.
- vendor/ في لديه اثنان عدد حسب حزمة تغطية إعداد (يخص أنا جمع ذاتي ذات تعديل، و إعادة توليد tsconfig صنف يشبه؛ سجل في vendor/README.md في):schemastery(عبر `outExtensions` إخراج مزدوج صيغة `.mjs`/`.cjs`) ،logger-console(اثنان مرة مفرد مدخل pass، جعل مشترك أساس صنف يتم داخل ربط إلى كل مدخل بينما غير توليد ها أمل تسمية قسم قطعة، و فوق تنقل إصدار شكل متسق).
- `scripts/build.ts` حذف؛`pnpm run build` = `tsc -b && tsdown`(أصل solution يملك emit رسم).

## سبق اعتبار بديل خطة

- **مباشر تحرير كتابة esbuild نص برمجي**: الأكثر صار ناضج جذب محرك، صفر حزمة تركيب طبقة ريح خطر، لكن حاجة يد حركة صيانة tsdown workspace نمط تلقائي توفير حسب حزمة قاعدة إطار جدول.
- **pkgroll**: إدارة فكرة فوق الأكثر وصل قريب مباشر بديل صنف، لكن كل دورة فقط 78k تحت تحميل كما أساس في Rollup، صيانة قبل مشهد صارم إطار ضعيف في tsdown.
- **إبقاء dumble**: و فوق تنقل تمام جميل مقابل متساو، لكن با فرد بسبب فرعي غير ممكن قبول.

## عاقبة

وقت التشغيل bundle إخراج ما زال امتداد استخدام dumble وقت بديل عام مدخل شكل حالة (`lib/index.js`، و حزمة خاص لديه تغيير جسم، مثال مثل `schemastery` `lib/index.mjs`/`lib/index.cjs` و `logger-console` `lib/browser.js`) ؛ أصل حسب [TSC أولوية بناء Agent Note](2026-06-17-ts-build-config.md) ، إعلان الآن يقع في `lib/types` تحت.External ما زال قدوم ذاتي كل حزمة dependencies/peerDependencies. أنا جمع وضع ترك dumble exports حقل دفع قطع: اعتماد غير افتراضي شكل حالة جديد حزمة حاجة تدريجي حزمة توفير `tsdown.config.ts`، لا يستطيع فقط اعتماد package.json حقل. لم قدوم إذا `tsc -b` يصبح زجاجة عنق،tsdown أيضا يمكن وصل إدارة إعلان تحزيم (isolatedDeclarations) ؛ هذا حاجة آخر كتابة واحد نسخة Agent Note.

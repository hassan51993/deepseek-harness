# Agent Note: API Remotes توليد اتفاق لديه ترتيب بناء

Status: implemented
Archived: 2026-09-04

[English](2026-08-08-api-remotes-generated-contract-build.md) | العربية

## مشكلة

Host `@Remote` طريقة حاجة أولا من Typert توليد `/remote` إعلان و وقت التشغيل مساهمة،Client `api-remotes/src/client/index.ts` عندئذ قدرة عبر نوع فحص و تحزيم هذه مساهمة. إذا أصل بناء أولا يأخذ Host و Client اثنان ورقة Project Reference رسم واحد بدء تسليم إعطاء tsc،Client سوف في توليد ناتج وجود قبل تحرير ترجمة؛ إذا زيادة مستقل contracts مسبق معالجة، أيضا سوف يجعل generator انفصال مغادرة صحيح معتاد Host رسم تكرار تحرير ترجمة، و سماح قديم قديم ناتج إخفاء غطاء خطأ اعتماد.

هذا ترتيب اعتماد لا يستطيع تغيير مستودع عادي package قاعدة. صحيح معتاد package فقط يخص واحد TypeScript face:Host package تسجيل تسجيل في `tsconfig.host.json`،Client package تسجيل تسجيل في `tsconfig.client.json`. واحد Client plugin معا أداة لديه Node loader مدخل و browser مدخل، فقط هو تحزيم ناتج شكل، لا هو تفكيك قسم TypeScript project إدارة من.

## قرار

أصل بناء أولا إتمام Host tsc و Host tsdown، من Host tsdown تشغيل Typert و توليد Remote Client اتفاق؛ مع بعد إتمام Client tsc،Client tsdown و Web بناء:

~~~text
tsc -b tsconfig.host.json
tsdown --env.DSH_BUILD_FACE host
tsc -b tsconfig.client.json
tsdown --env.DSH_BUILD_FACE client
Vite Web build
~~~

`build:lib:host` مسؤول قبل اثنان خطوة،`build:lib:client` مسؤول في بين اثنان خطوة،`build:web` الأكثر بعد تشغيل.`typecheck` أيضا يجب أولا تنفيذ كامل Host lib مرحلة مقطع، لأن Client tsc حاجة Host tsdown توليد إعلان؛ هو لا حاجة تشغيل Client tsdown أو Web build.

كل tsc مرحلة مقطع كل هو وحيد TypeScript تحرير ترجمة جهاز مسار، مسؤول نحو `lib/types` إرسال إطلاق JavaScript، إعلان و زيادة كمية حالة.tsdown فقط قراءة هذه JavaScript و توليد إصدار bundle، لا قراءة شفرة المصدر، أيضا لا توليد إعلان.

## وحيد package خاص مثال

`api/remotes` هو وحيد معا يملك Host و Client composite project package.Host project يتضمن Agent/Session lookup سياسة،Host إضافة مدخل و invariant؛Client project فقط يتضمن حاجة انتظار توليد اتفاق `src/client/index.ts`:

~~~text
packages/api/remotes/
├─ tsconfig.json
├─ tsconfig.host.json
├─ tsconfig.client.json
└─ src/
   ├─ index.ts
   ├─ agent-lookup.ts
   ├─ invariant.ts
   └─ client/
      └─ index.ts
~~~

حزمة أصل `tsconfig.json` هو فقط مرجع اثنان عدد أداة جسم project solution، لا دخول أي aggregate أو مباشر مستهلك اعتماد رسم. أصل Host aggregate مرجع `api/remotes/tsconfig.host.json`، أصل Client aggregate و مباشر Client مستهلك مرجع `api/remotes/tsconfig.client.json`.`session-log-export` استخدام نفسه solution و leaf بنية، يجعل Node archive تنفيذ لا دخول متصفح controller.workspace constraints بوابة مرة تاريخ يمكن بلوغ Project Reference رسم؛ كل قد إعلان face project مرجع تفكيك قسم حزمة solution أصل أو آخر جانب leaf، بوابة كل سوف رفض، بينما فقط لديه `tsconfig.json` هدف ما زال يمكن من مهمة واحد face مرجع.

اثنان عدد project استخدام متبادل لا إعادة تراكم `files` و مختلف `.tsbuildinfo`، لذلك يمكن مشترك `lib/types` بينما لا تكرار إرسال إطلاق أي شفرة المصدر. إذا لم قدوم حاجة اثنان جانب مشترك استخدام واحد نسخة تنفيذ، ينبغي يأخذ تنفيذ نقل دخول في قيام package، لا يستطيع يأخذ نفس شفرة المصدر معا تسليم إعطاء اثنان عدد emitting project.

هذا عدد مثال خارج من توليد اتفاق حقيقي أولا بعد علاقة قرار، لا هو يمكن توفير عادي package اختيار نموذج لوح. إضافة جديدة package ما زال فقط قدرة تسجيل تسجيل دخول واحد aggregate؛ فقط لديه تعديل هذا قرار و إثبات وجود آخر بند غير ممكن إزالة حذف توليد اعتماد، عندئذ قدرة زيادة مثال خارج.

## Typert و tsdown

Host tsdown في عادي أصل إعداد في تفعيل `typertPlugin({ mode: 'workspace', faces: ['host'] })`.generator فقط بـ `tsconfig.host.json` لـ program نوع فرعي، توليد `typert.host.*` و Host اتفاق إسقاط خروج `typert.remote-client.*`؛Client tsdown لا بدء Typert، أيضا لا قسم تحليل Client aggregate.

TypeScript compiler face و Typert وقت التشغيل ناتج face هو اثنان طبقة عام فكرة. عادي `dshClient` package أي جعل فقط لديه واحد compiler project، أيضا يمكن حسب عام subpath معا مساهمة Host و Client وقت التشغيل نموذج؛aggregate صريح مرجع `tsconfig.host.json` أو `tsconfig.client.json` وقت،analyzer عندئذ يأخذ هذا project حد تحديد إلى مقابل face. لذلك `api-remotes` Host قسم تحليل لن ترتيب حمل تسجيل ذلك Client مدخل، عادي مزدوج مدخل package Host نموذج أيضا لن فقد فقد.

Host و Client اثنان مرة tsdown كل استقبال `vendor/*`،`packages/*/*` و `apps/cli` هذا مجموعة كامل workspace. أصل إعداد لا مسح `lib/types/client/index.js`، لا صيانة package تصنيف جدول، أيضا لا استخدام tsdown filter؛ حزمة داخل إعداد أصل حسب `DSH_BUILD_FACE` إرجاع هذا مرحلة مقطع مدخل.

عادي Client plugin في Host pass إرجاع فارغ إعداد، في Client pass معا توليد Node loader مدخل و browser bundle.`api-remotes` `clientBundle(..., { hostPhase: true })` هو وحيد مرحلة مقطع مثال خارج:Host pass توليد ذلك Host مدخل،Client pass فقط توليد browser bundle. لم إشارة تحديد `DSH_BUILD_FACE` package-local tsdown ما زال معا إرجاع هذا package صحيح معتاد مدخل، توفير محلي مفرد حزمة تطوير استخدام.

## اعتبار مرور بديل خطة

**إبقاء مستقل contracts مسبق معالجة.** هذا سوف في صحيح معتاد Host Project Reference رسم خارج مقدار خارج تحرير ترجمة generator، و يجعل ناقص إبقاء توليد شيء إخفاء غطاء Client مرور مبكر دخول Host رسم مشكلة.

**مرة تنفيذ أصل `tsc -b tsconfig.json` بعد مجددا تشغيل tsdown.** Client tsc في Host tsdown قبل حدوث، لا يمكن من جاف صاف عمل شجرة نيل نيل `/remote` إعلان.

**تفكيك قسم كل يتضمن `src/client/index.ts` package.** Node و browser مزدوج مدخل هو عادي Client plugin تحزيم اتفاق، لا شكل صار تحرير ترجمة ترتيب اعتماد؛ عام مرة تفكيك قسم فقط سوف زيادة references و زيادة كمية حالة صيانة صار هذا.

**مسح Client تحرير ترجمة ناتج أو صيانة اثنان نسخة workspace بيان.** ناتج مسح سوف يجعل package هل مشاركة و بناء أخذ قرار في ناقص إبقاء ملف، يد عمل بيان و package اسم مرور ترشيح فإن سوف مع دليل ضبط كامل إنتاج عائم نقل. كامل workspace إضافة حزمة داخل face اختيار قد توفير تحديد سلوك.

**في Client pass مجددا تشغيل Typert.** Remote Client هو Host اتفاق إسقاط، لا يوجد مستقل Client عكس إطلاق مصدر؛ ثاني عدد Typert program فقط سوف تكرار عمل و زيادة اثنان جانب إعلان خلط دخول نفس قسم تحليل ريح خطر.

## عاقبة

جاف صاف بناء يصبح ترتيب صحيح تأكيد صفة مرجعي تحقق: لا يوجد أي حيث تخزين `/remote` ناتج وقت،Host tsc يجب أولا نجاح،Host tsdown يجب توليد اتفاق، مع بعد Client tsc،Client tsdown و Web build يجب نجاح. أي مرحلة مقطع كل لا نيل يأخذ ناتج كتابة دخول `src`.

[TypeScript بناء إعداد Note](2026-06-17-ts-build-config.ar.md) تحديد tsc-first مسؤولية إبقاء ثابت، لكن ذلك مفرد مرة كل رسم tsc بعد مجددا تحزيم أمر شكل من هذا نص لديه ترتيب مرحلة مقطع يحل محل.[مزدوج aggregate solution Note](2026-07-22-tsconfig-solution-root-two-aggregates.ar.md) تحديد عادي package مفرد aggregate قاعدة إبقاء ثابت، هذا نص فقط لـ `api/remotes` بناء قيام واحد صريح مثال خارج.

Client مستقل بناء لم يعد هو جاف صاف عمل شجرة فوق ذاتي كاف مدخل؛ مستودع أمر،CI و إصدار مسار يجب أولا تشغيل Host lib مرحلة مقطع. عادي package تطوير من بلا حاجة إدارة حل أو نسخ هذا مثال خارج، ما زال حسب الذي تابع تشغيل بيئة اختيار واحد aggregate.

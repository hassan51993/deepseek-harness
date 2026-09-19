# Agent Note: Inspector تطوير تركيب

Status: implemented
Archived: 2026-09-04

[English](2026-08-27-inspector-development-mount.md) | العربية

## Problem

`@deepseek-ai/dsh-experimental-inspector` هو أي قد إصدار dsh تثبيت كل لا يحمل private حزمة، لكن تطوير بدء حاجة حسب يحتاج يأخذ هو تعليق دخول مع بضاعة Web تركيب. مع بضاعة bundle patch داخل واحد سطر جدول بلوغ لا هذا عنصر أمر:`verify-cordis-config` اشتراط bundle patch في كل أداة اسم سطر كل قدرة من هذا bundle ذاتي ذات `dependencies` تحليل——disabled سطر أيضا لا إعفاء تجنب——بينما قد إصدار manifest لا نيل اعتماد لم إصدار حزمة.

## Decision

inspector حزمة ذاتي لديه اثنان نسخة تطوير overlay.`packages/experimental/inspector/cordis.source.patch.yml` لـ `pnpm run demo:inspector` خلف بعد tsx شفرة المصدر بدء إدراج دخول `./src/index.ts`؛`packages/experimental/inspector/cordis.patch.yml` لـ تنفيذ مرور `pnpm run build` بعد `node apps/cli/lib/bin.js web --patch ./packages/experimental/inspector/cordis.patch.yml` إدراج دخول `./lib/index.js`.

اثنان عدد متبادل مقابل entry كل عبر Loader معتاد قاعدة الذي تابع tree `baseUrl` من كل منها overlay ملف دليل تحليل. شفرة المصدر بدء لذلك مباشر قراءة TypeScript،built بدء قراءة حزمة ناتج؛ اثنان بند مسار كل لا قراءة أو تعديل profile قد تثبيت إضافة حالة. شفرة المصدر أو built entry ناقص وقت،Loader import سوف صدى مضيء فشل، لن قفز مرور Inspector.

## Consequences

قد إصدار حزمة لا يحمل inspector أي أثر أثر: لا يوجد manifest بند، لا يوجد تركيب سطر، لا يوجد launcher flag. تركيب إبقاء حسب مرة بدء اختيار——لا حمل overlay نفس خدمة دائم بعيد لن تحميل هذا حزمة——كما بدء تركيب كل واحد طبقة كل من config ملف إعلان. شفرة المصدر سريع سريع أمر سوف تلقائي إشارة تحديد مقابل overlay؛built بدء يحتاج صريح إشارة تحديد built overlay، و اشتراط `lib/` ناتج لـ حالي إصدار.

## Alternatives considered

- مع بضاعة web-app patch داخل وضع `disabled: !!js` سطر: اعتماد بوابة و npm إصدار كل سوف يأخذ private حزمة إجبار دخول قد إصدار manifest.
- `--inspector` launcher flag يأخذ حزمة تعليق صار مقدار خارج bundle طبقة:launcher حيث لا يملك app flag أيضا لا يملك إضافة حزمة اسم.
- `dsh-web-app` فوق إضافة optional `peerDependencies` و من ذلك glue إضافة حركة حالة `ctx.loader.create`: نحو قد إصدار manifest كتابة دائم لا إصدار اسم حرف، كما تركيب سطر لا في أي config طبقة إعلان.
- اثنان نوع بدء نمط مشترك استخدام واحد نسخة bare-package overlay: شفرة المصدر تحليل يمكن استخدام workspace باب وجه، لكن built تحليل سوف اعتماد و هذا مرة بدء أمر غير متصل حمل دائم profile تثبيت حالة.

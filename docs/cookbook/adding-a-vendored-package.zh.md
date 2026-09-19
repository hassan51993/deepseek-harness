# فعلي تشغيل يد سجل: إضافة واحد vendored حزمة

[English](adding-a-vendored-package.md) | العربية

عند harness حاجة جذب دخول آخر عدد فوق تنقل Cordis حزمة (مثل `@cordisjs/plugin-http`) وقت، ينبغي سوف ذلك بصفة ثابت إصدار شفرة المصدر **vendor** إلى `vendor/` تحت، بينما غير بصفة NPM اعتماد إضافة.[vendor/README.md](../../vendor/README.md) شرح ذلك سبب و وسيط تعريف مثل أي*تحديث*قد لديه vendored حزمة؛ هذا إشارة جنوب هو إضافة**جديد** vendored حزمة تدريجي ملف بيان.(قد مقابل وفق قائم vendored تجميع دمج تحقق؛ مثل لديه انحراف فرق، طلب في هذا إصلاح صحيح.)

## 1. نسخ شفرة المصدر

```
vendor/<dir>/
  package.json     # from upstream; rescope the name, keep exports/type (publishable release member, no private flag)
  tsconfig.json    # extends ../../tsconfig.base.json (see configuration below)
  src/             # the upstream src/ verbatim
  README.md LICENSE # if upstream ships them
```

`tsconfig.json` و أخرى vendored حزمة إبقاء متسق:`rootDir: src`،`outDir: lib/types`، فوق تنقل شفرة الذي يحتاج صارم إطار صفة وضع عرض بند، و مقابل الذي استيراد كل أخرى vendored حزمة `references` بند:

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src", "outDir": "lib/types",
    "noUncheckedIndexedAccess": false, "exactOptionalPropertyTypes": false,
    "noImplicitOverride": false, "noUnusedLocals": false, "noUnusedParameters": false
  },
  "include": ["src"],
  "references": [{ "path": "../cordis" }, { "path": "../cosmokit" }]
}
```

`package.json` ثابت صيغة: تعديل كتابة `name` scope([خريطة](../rescope.zh.md)) ، إبقاء فوق تنقل `exports`/`type`؛ إعلان بيانات وصفية إشارة نحو `lib/types`؛ إصدار `.d.ts` و `.d.ts.map` إعلان إخراج؛ في `peerDependencies` في صف خروج ذلك Cordis اعتماد (و فوق تنقل manifest(بيانات وصفية بيان) متسق).vendored حزمة هو يمكن إصدار release member، لذلك لا نيل ضبط `private: true`، كما يجب ضبط `publishConfig.access: public`؛`version` حقل تتبع مع harness إصدار تسلسل (رؤية [vendor/README.md](../../vendor/README.md)). نقل تمرير صفة فوق تنقل اعتماد ذاته أيضا يجب يتم vendor أو قد وجود في مستودع في——vendor واحد حزمة نحو نحو معنى طعم حال vendor ذلك كامل بند اعتماد شجرة (مثل `@cordisjs/plugin-http` سوف سحب دخول `@cordisjs/fetch-file`).

vendored TypeScript شفرة المصدر في محلي متبادل مقابل استيراد/توجيه خروج في نسخ بعد استخدام صريح `.ts` بعد لاحقة. هذا هو مستودع محلي بناء و فوق تنقل فرق مختلف:`rewriteRelativeImportExtensions` إخراج `.js` وقت التشغيل استيراد، بينما إعلان ملف إبقاء صريح `.ts` بعد لاحقة، جعل NodeNext/Node16 TypeScript مستهلك قدرة كاف تحليل.

## 2. في أصل إعداد في تسجيل

| ملف | تعديل محتوى |
|---|---|
| `tsconfig.base.json` | في `paths` في إضافة `"<npm-name>": ["./vendor/<dir>/src"]` |
| `tsconfig.host.json` | في `references` في إضافة `{ "path": "./vendor/<dir>" }`(وضع في `packages/*` بند قبل؛vendored شفرة فقط مرور host تجمع دمج دخول رسم) |
| `vendor/README.md` | إضافة واحد سطر manifest جدول إطار سطر (dir،npm name،version،upstream repo،commit SHA) و سجل كل محلي تعديل |
| `scripts/publint-all.ts` | فقط عند هذا vendored حزمة ذاته من هذا مستودع إصدار وقت عندئذ حاجة (vendored اعتماد عبر معتاد لا إصدار——قفز مرور) |

التالي من glob تلقائي تغطية، بلا حاجة يد حركة تحرير: أصل `package.json` workspaces(`vendor/*`) ،`tsdown.config.ts`،`vitest.config.ts`،`.oxlintrc.json`. فقط لديه عند بناء إعداد و أصل قيمة افتراضية مختلف وقت (مزدوج ESM/CJS أو كثير مدخل——مشاركة رؤية `vendor/schemastery` و `vendor/logger-console`) ، عندئذ حاجة مفرد وحيد `vendor/<dir>/tsdown.config.ts`؛ ذلك مدخل ينبغي قراءة `lib/types` تحت إخراج JS.

## 3. ملاحظة معنى manifest حراسة حماية

`scripts/check-vendor-manifest.sh`(pre-commit خطاف) سوف في `vendor/*/src` تحت لديه مؤقت تخزين تعديل لكن `vendor/README.md` لم واحد بدء مؤقت تخزين وقت فشل. طلب سوف manifest تحديث و شفرة المصدر واحد بدء مؤقت تخزين، بـ عبر إيداع فحص.

## 4. تحقق

```sh
pnpm install        # registers the workspace
pnpm run typecheck
pnpm run build && pnpm run constraints
```

طلب تشغيل[اختبار سياسة سياسة](../testing.zh.md) الذي اختيار سلوك فحص. شفرة المصدر `paths` خريطة فقط في `tsconfig.base.json` وجود واحد نسخة، خدمة كل رسم. إعادة يلزم عزل حد هو project-reference رسم:vendored شفرة المصدر يجب عبر ذلك ذاته `vendor/<dir>/tsconfig.json` يتم مرجع، بينما غير يتم سحب دخول بعض عدد تجمع دمج مشروع تفعيل صارم إطار فحص TypeScript برنامج في ([تخطيط](../development.zh.md#typescript-project-layout)).

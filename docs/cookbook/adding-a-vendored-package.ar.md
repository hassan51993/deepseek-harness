# دليل عملي: إضافة حزمة مستنسخة

[English](adding-a-vendored-package.md) | العربية

حين يحتاج الإطار حزمةَ Cordis أخرى من المنبع (مثل `@cordisjs/plugin-http`)، تُستنسَخ مصدرًا مثبَّتًا تحت `vendor/`، ولا تُضاف اعتماديةَ npm. ويبيّن [vendor/README.md](../../vendor/README.md) السببَ ويغطي *تحديث* حزمة مستنسخة أصلًا؛ أما هذا الدليل فقائمة تحقق ملفًّا ملفًّا لإضافة حزمة **جديدة**. (وقد تُحقِّق منه مقابل المجموعة المستنسخة القائمة؛ فإن انحرف فصحّحه هنا.)

## 1. انسخ المصدر

```
vendor/<dir>/
  package.json     # from upstream; rescope the name, keep exports/type (publishable release member, no private flag)
  tsconfig.json    # extends ../../tsconfig.base.json (see configuration below)
  src/             # the upstream src/ verbatim
  README.md LICENSE # if upstream ships them
```

ويحاكي `tsconfig.json` سائرَ الحزم المستنسخة: `rootDir: src`، و`outDir: lib/types`، وتخفيفاتُ الصرامة التي تحتاجها شفرةُ المنبع، ومدخلُ `references` لكل حزمة مستنسخة أخرى يستوردها:

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

وثوابت `package.json`: أعِد تسمية نطاق `name` ([الخريطة](../rescope.ar.md)) مع الإبقاء على `exports` و`type` من المنبع، ووجّه بياناتِ التصريحات الوصفية إلى `lib/types`، وانشر مخرجات التصريحات `.d.ts` و`.d.ts.map`، وعدّد اعتمادياتِ cordis في `peerDependencies` (مطابقةً لبيان المنبع). والحزم المستنسخة أعضاءُ إصدار قابلة للنشر، فيجب ألّا تضبط `private: true` ويجب أن تضبط `publishConfig.access: public`؛ ويتبع حقل `version` تسلسلَ إصدارات الإطار (انظر [vendor/README.md](../../vendor/README.md)). وعلى اعتماديات المنبع المتعدّية أن تكون مستنسخةً هي نفسها أو حاضرةً أصلًا، فاستنساخُ حزمة يعني غالبًا استنساخَ شجرة اعتمادياتها (فـ `@cordisjs/plugin-http` مثلًا يجرّ `@cordisjs/fetch-file`).

وتستعمل الاستيرادات والتصديرات النسبية المحلية في مصدر TypeScript المستنسخ محدِّداتِ `.ts` صريحةً بعد النسخ. وهذا فرقُ بناء محلي للمستودع عن المنبع: فـ `rewriteRelativeImportExtensions` يُخرج استيرادات `.js` في وقت التشغيل، بينما تحتفظ التصريحات بمحدِّدات `.ts` صريحة يستطيع مستهلكو TypeScript بوضعَي NodeNext وNode16 تحليلها.

## 2. سجّلها في إعدادات الجذر

| الملف | التغيير |
|---|---|
| `tsconfig.base.json` | أضف `"<npm-name>": ["./vendor/<dir>/src"]` إلى `paths` |
| `tsconfig.host.json` | أضف `{ "path": "./vendor/<dir>" }` إلى `references` (قبل مداخل `packages/*`؛ فالشفرة المستنسخة لا تدخل الرسم إلا عبر تجميعة Host) |
| `vendor/README.md` | أضف صفًّا إلى جدول البيان (الدليل، واسم npm، والإصدار، ومستودع المنبع، وقيمة SHA للـ commit) وسجّل أي تعديلات محلية |
| `scripts/publint-all.ts` | فقط إن كانت الحزمة المستنسخة تُنشَر من هنا هي نفسها (والاعتماديات المستنسخة لا تُنشَر عادةً، فتخطَّ ذلك) |

وتغطيها الأنماط العامة تلقائيًا فلا تحتاج تعديلًا: مساحات العمل في `package.json` في الجذر (`vendor/*`)، و`tsdown.config.ts`، و`vitest.config.ts`، و`.oxlintrc.json`. ولا يلزم ملف `vendor/<dir>/tsdown.config.ts` خاص بالحزمة إلا إذا اختلف إعداد البناء عن افتراض الجذر (ESM وCJS معًا، أو عدة مداخل؛ انظر `vendor/schemastery` و`vendor/logger-console`)؛ وينبغي أن يقرأ مدخله JavaScript المُخرَج تحت `lib/types`.

## 3. انتبه لحارس البيان

يفشل `scripts/check-vendor-manifest.sh` (وهو خطاف pre-commit) إن رُحِّل أي شيء تحت `vendor/*/src` بلا ترحيل `vendor/README.md` معه. فرحّل تحديثَ البيان مع المصدر ليمر الإيداع.

## 4. تحقّق

```sh
pnpm install        # registers the workspace
pnpm run typecheck
pnpm run build && pnpm run constraints
```

وشغّل فحوص السلوك التي تختارها [سياسة الاختبار](../testing.ar.md). وتسكن خريطةُ `paths` للمصدر مرةً واحدة في `tsconfig.base.json` وتخدم كل رسم. والحدّ المهم للعزل هو رسم project reference: فالمصدر المستنسخ يجب أن يُشار إليه عبر `vendor/<dir>/tsconfig.json` الخاص به، لا أن يُجَرّ إلى برنامج صارم في تجميعة ([التخطيط](../development.ar.md#typescript-project-layout)).

# إعادة تسمية نطاق الحزم المستنسخة

[English](rescope.md) | العربية

إطار Cordis ومكتباته الأساسية مستنسخة تحت [`vendor/`](../vendor/README.md) ومنشورة تحت النطاق `@deepseek-ai`، لأن كل حزمة في الإطار تعلن الإطارَ اعتماديةً نظيرة: فنشر الإطار ينشر هذه الطبقة معه، ونشرُها بالأسماء الأصلية يستولي عليها في الـ registry. وهذه الصفحة هي خريطة الأسماء؛ أما القرار وأثره ففي [Agent Note عن إعادة التسمية](../.agents/notes/archived/process/2026-08-10-vendor-package-rescope.md)، وأما commits المنبع ففي [`vendor/README.md`](../vendor/README.md).

## خريطة الأسماء

| الدليل | اسم المنبع | الاسم المنشور | إصدار المنبع | الدور |
|---|---|---|---|---|
| `vendor/cordis/` | `cordis` | `@deepseek-ai/cordis` | 4.0.0-rc.7 | نواة الإطار: `Context` و`Service` و`Fiber` والأحداث |
| `vendor/cosmokit/` | `cosmokit` | `@deepseek-ai/cosmokit` | 1.8.1 | أدوات مشتركة يبني عليها الإطار وSchemastery |
| `vendor/schemastery/` | `schemastery` | `@deepseek-ai/schemastery` | 3.18.0 | schemas الإعداد (`Schema`) خلف `Config` كل إضافة |
| `vendor/loader/` | `@cordisjs/plugin-loader` | `@deepseek-ai/cordis-plugin-loader` | 1.0.0-rc.5 | تحميل `cordis.yml`، وتحليل الإضافات، وذاكرة المستودع المؤقتة |
| `vendor/include/` | `@cordisjs/plugin-include` | `@deepseek-ai/cordis-plugin-include` | 1.0.4 | تضمين الإعدادات وطبقات patch |
| `vendor/group/` | `@cordisjs/plugin-group` | `@deepseek-ai/cordis-plugin-group` | 1.0.0 | مجموعات الإضافات المتداخلة |
| `vendor/timer/` | `@cordisjs/plugin-timer` | `@deepseek-ai/cordis-plugin-timer` | 1.1.2 | مؤقّتات على `ctx` تراعي تحرير الموارد |
| `vendor/hmr/` | `@cordisjs/plugin-hmr` | `@deepseek-ai/cordis-plugin-hmr` | 1.0.15 | الاستبدال الحار للإضافات والإعداد |
| `vendor/logger-console/` | `@cordisjs/plugin-logger-console` | `@deepseek-ai/cordis-plugin-logger-console` | 1.0.0 | مصدّر سجلات إلى لوحة التحكم |

تحتفظ تصديرات المسارات الفرعية بمساراتها: فـ `@cordisjs/plugin-loader/repository` يصير `@deepseek-ai/cordis-plugin-loader/repository`.

## ما لا تمسّه إعادة التسمية

- **أسماء الأدلة وإصدارات مصدر المنبع.** يبقى `vendor/hmr/` كما هو، ويسجّل الجدول إصدارَ المنبع للقطة المصدر المثبَّتة، فيُقرأ البيان لقطةً من المنبع؛ أما حقل `version` في `package.json` المستنسخ فهو إصدار بيان الإطار المُصدَر، يرفعه `pnpm run release:vendor` وتعيده مزامنةٌ جديدة إلى إصدار المنبع.
- **نطاقات الاعتماديات.** إعادة التسمية تغيّر مفاتيح الاعتماديات لا نطاقاتها. وتستعمل بيانات مساحة العمل `workspace:^` لاعتماديات وقت التشغيل التي يملكها المستودع، فيحلّ pnpm الحزم المحلية المثبَّتة ويضع نطاقات الإصدار مكانها عند النشر.
- **البادئة المدمجة `cordis:` في Loader.** فـ `cordis:include` و`cordis:group` بادئة بروتوكول لا اسم حزمة.
- **عائلة ملفات إعداد `cordis.yml`**، ومنها `*.cordis.yml` و`*.cordis.snapshot.yml` و`cordis.patch.yml`.
- **حزم الإطار التي تحمل الكلمة في أسمائها هي**، مثل `@deepseek-ai/dsh-tool-cordis`.
- **معرّفات وقت التشغيل في المنبع**، مثل `Symbol.for('schemastery')` في Schemastery وحقل بياناتها الوصفية `vendor:`.
- **النثر خارج `docs/`.** فـ `vendor/*/README.md` وملفات README الخاصة بالحزم وAgent Notes تحتفظ بالأسماء التي كُتبت بها؛ وقد تكون `cordis` المجردة هناك اسمَ خيار في Python SDK أو معرّفَ agent-preset. أما داخل `docs/` فيتبع النثر وكل سور Markdown إعادةَ التسمية.

## ما يلزم تغييره في شفرتك

| الموضع | قبل | بعد |
|---|---|---|
| استيراد وحدة | `import { Context } from 'cordis'` | `import { Context } from '@deepseek-ai/cordis'` |
| دمج الأحداث المنمَّطة | `declare module 'cordis'` | `declare module '@deepseek-ai/cordis'` |
| مفتاح اعتمادية في `package.json` | `"@cordisjs/plugin-hmr": "^1.0.15"` | `"@deepseek-ai/cordis-plugin-hmr": "^1.0.15"` |
| مدخل إضافة في `cordis.yml` | `name: '@cordisjs/plugin-include'` | `name: '@deepseek-ai/cordis-plugin-include'` |

## التطبيق والتحقق والتراجع

يملك [`scripts/rescope-vendor.ts`](../scripts/rescope-vendor.ts) الخريطةَ أعلاه وينفّذ إعادة التسمية، فلا يُعاد تسمية أي مرجع يدويًا:

```sh
pnpm run rescope-vendor            # report what would change
pnpm run rescope-vendor --apply    # rewrite every reference
pnpm run rescope-vendor:check      # assert the post-state; runs in the hygiene gate
pnpm run rescope-vendor --apply --reverse   # return to the upstream names
```

أعِد تشغيله بعد كل مزامنة مع المنبع ([الإجراء](../vendor/README.md))، وأتبِعه بإعادة التوليد التي يطبعها: `pnpm install` لملف القفل، و`pnpm run gen-third-party-notices`، و`pnpm run verify-translation-pairing --write` للاقترانات الثنائية اللغة التي مسّها.

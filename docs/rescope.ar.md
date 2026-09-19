# Vendored حزمة تعديل اسم

[English](rescope.md) | العربية

Cordis إطار هيكل و ذلك أساس أساس مكتبة بـ شفرة المصدر شكل صيغة vendored في [`vendor/`](../vendor/README.md) تحت، و بـ `@deepseek-ai` scope إصدار: كل harness حزمة كل يأخذ إطار هيكل إعلان لـ peer dependency، إصدار harness حينئذ سوف وصل حمل إصدار هذا واحد طبقة، استخدام فوق تنقل اسم إصدار انتظار في في registry فوق احتلال استخدام آخر شخص اسم حرف. هذا صفحة هو اسم حرف خريطة جدول؛ قرار و أثر رؤية [تعديل اسم Agent Note](../.agents/notes/archived/process/2026-08-10-vendor-package-rescope.md) ، فوق تنقل commit رؤية [`vendor/README.md`](../vendor/README.md).

## اسم حرف خريطة

| دليل | فوق تنقل اسم | إصدار اسم | فوق تنقل إصدار | زاوية لون |
|---|---|---|---|---|
| `vendor/cordis/` | `cordis` | `@deepseek-ai/cordis` | 4.0.0-rc.7 | إطار هيكل نواة قلب:`Context`،`Service`،`Fiber`، حدث |
| `vendor/cosmokit/` | `cosmokit` | `@deepseek-ai/cosmokit` | 1.8.1 | إطار هيكل و Schemastery مشترك استخدام أساس أساس أداة |
| `vendor/schemastery/` | `schemastery` | `@deepseek-ai/schemastery` | 3.18.0 | إعداد schema(`Schema`) ، كل إضافة `Config` كل أساس في هو |
| `vendor/loader/` | `@cordisjs/plugin-loader` | `@deepseek-ai/cordis-plugin-loader` | 1.0.0-rc.5 | `cordis.yml` تركيب تحميل، إضافة تحليل،repository ذاكرة مؤقتة |
| `vendor/include/` | `@cordisjs/plugin-include` | `@deepseek-ai/cordis-plugin-include` | 1.0.4 | إعداد يتضمن و patch تراكم إضافة |
| `vendor/group/` | `@cordisjs/plugin-group` | `@deepseek-ai/cordis-plugin-group` | 1.0.0 | تضمين طقم إضافة قسم مجموعة |
| `vendor/timer/` | `@cordisjs/plugin-timer` | `@deepseek-ai/cordis-plugin-timer` | 1.1.2 | `ctx` فوق مع disposal عودة استلام تحديد وقت جهاز |
| `vendor/hmr/` | `@cordisjs/plugin-hmr` | `@deepseek-ai/cordis-plugin-hmr` | 1.0.15 | إضافة و إعداد حار استبدال |
| `vendor/logger-console/` | `@cordisjs/plugin-logger-console` | `@deepseek-ai/cordis-plugin-logger-console` | 1.0.0 | تحكم منصة سجل توجيه خروج |

فرعي مسار توجيه خروج إبقاء أصل مسار:`@cordisjs/plugin-loader/repository` تغيير صار `@deepseek-ai/cordis-plugin-loader/repository`.

## تعديل اسم لا اصطدام ماذا

- **دليل اسم و فوق تنقل شفرة المصدر إصدار.** `vendor/hmr/` ما زال هو `vendor/hmr/`، بيان جدول سجل هو الذي تثبيت إقامة شفرة المصدر لقطة فوق تنقل إصدار، لذلك بيان قراءة عمل واحد نسخة فوق تنقل لقطة؛ بينما كل vendored حزمة `package.json` ذاته `version` حقل هو harness إصدار بيان إصدار،`pnpm run release:vendor` سوف رفع رفع هو، إعادة sync وقت سوف استعادة صار فوق تنقل إصدار.
- **اعتماد range.** تعديل اسم فقط تعديل اعتماد مفتاح، لا تغيير نطاق.Workspace بيان مقابل مستودع داخل وقت التشغيل اعتماد استخدام `workspace:^`، لذلك pnpm سوف تحليل إلى ثابت محلي حزمة، و في إصدار وقت استبدال لـ إصدار نطاق.
- **Loader `cordis:` داخل بناء بادئة.** `cordis:include`،`cordis:group` هو بروتوكول بادئة، لا هو حزمة اسم.
- **`cordis.yml` ملف إعداد بيت عائلة**، يشمل `*.cordis.yml`،`*.cordis.snapshot.yml`،`cordis.patch.yml`.
- **اسم حرف داخل حمل هذا عدد كلمة harness حزمة**، مثال مثل `@deepseek-ai/dsh-tool-cordis`.
- **فوق تنقل وقت التشغيل معرف رمز**، مثال مثل Schemastery `Symbol.for('schemastery')` و ذلك `vendor:` بيانات وصفية حقل.
- **`docs/` خارج تفرق نص.** `vendor/*/README.md`، كل حزمة README و Agent Note إبقاء كتابة عمل عند وقت اسم حرف؛ ذلك داخل عار `cordis` أيضا ممكن هو Python SDK خيار اسم أو بعض عدد agent-preset id.`docs/` لـ داخل، تفرق نص و كل Markdown محيط شريط كل تتبع حال تعديل.

## أنت شفرة يلزم تعديل ماذا

| موضع | تعديل قبل | تعديل بعد |
|---|---|---|
| وحدة import | `import { Context } from 'cordis'` | `import { Context } from '@deepseek-ai/cordis'` |
| نوع حدث إعلان دمج | `declare module 'cordis'` | `declare module '@deepseek-ai/cordis'` |
| `package.json` اعتماد مفتاح | `"@cordisjs/plugin-hmr": "^1.0.15"` | `"@deepseek-ai/cordis-plugin-hmr": "^1.0.15"` |
| `cordis.yml` إضافة بند | `name: '@cordisjs/plugin-include'` | `name: '@deepseek-ai/cordis-plugin-include'` |

## تطبيق إضافة، نواة تحقق و رجوع

فوق وجه هذا نسخة خريطة من [`scripts/rescope-vendor.ts`](../scripts/rescope-vendor.ts) تحمل تحميل و تنفيذ تعديل اسم، أي مرجع كل لا اعتماد يد تعديل:

```sh
pnpm run rescope-vendor            # report what would change
pnpm run rescope-vendor --apply    # rewrite every reference
pnpm run rescope-vendor:check      # assert the post-state; runs in the hygiene gate
pnpm run rescope-vendor --apply --reverse   # return to the upstream names
```

فوق تنقل sync بعد إعادة ركض هو ([مسار](../vendor/README.md)) ، و وصل فوق هو ضرب طبع إعادة توليد:`pnpm install` إعادة توليد lockfile،`pnpm run gen-third-party-notices`، و مقابل هو لمس و مزدوج لغة مقابل ركض `pnpm run verify-translation-pairing --write`.

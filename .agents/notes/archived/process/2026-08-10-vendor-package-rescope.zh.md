# Agent Note: يأخذ vendored Cordis إعادة تسمية دخول @deepseek-ai scope

Status: implemented
Archived: 2026-09-04

[English](2026-08-10-vendor-package-rescope.md) | العربية

## مشكلة

`vendor/` تحت تسعة عدد حزمة هذا قبل إبقاء فوق تنقل npm اسم (`cordis`،`cosmokit`،`schemastery`،`@cordisjs/plugin-*`). هذا عدد قبل رفع في إصدار وقت لا صار قيام: كل harness حزمة كل يأخذ `cordis` إعلان صار peer dependency، تركيب `@deepseek-ai/dsh-*` إزالة استهلاك من يجب قدرة من registry تحليل إلى هو، الذي بـ إصدار harness لا بد لكن وصل حمل إصدار هذا واحد طبقة إطار هيكل. استخدام فوق تنقل اسم إصدار حينئذ هو في registry فوق احتلال استخدام آخر شخص اسم حرف؛ إذا هذا registry مقابل npmjs فعل فوق تنقل بديل إدارة، هذا اسم بند أيضا سوف حجب حجب حق صحيح فوق تنقل حزمة، يأخذ خطأ إطار هيكل تركيب دخول غير متصل مشروع.

## قرار

تسعة عدد حزمة موحد واحد تعديل اسم دخول `@deepseek-ai` scope. دليل اسم، فوق تنقل رقم الإصدار، اعتماد range واحد قاعدة لا حركة، الذي بـ `vendor/README.md` بيان ما زال قراءة عمل واحد نسخة فوق تنقل لقطة. موجه إلى استخدام من خريطة جدول رؤية [docs/rescope.md](../../../../docs/rescope.zh.md).

| دليل | npm اسم | فوق تنقل اسم |
|---|---|---|
| `cordis/` | `@deepseek-ai/cordis` | `cordis` |
| `cosmokit/` | `@deepseek-ai/cosmokit` | `cosmokit` |
| `schemastery/` | `@deepseek-ai/schemastery` | `schemastery` |
| `loader/` | `@deepseek-ai/cordis-plugin-loader` | `@cordisjs/plugin-loader` |
| `include/` | `@deepseek-ai/cordis-plugin-include` | `@cordisjs/plugin-include` |
| `group/` | `@deepseek-ai/cordis-plugin-group` | `@cordisjs/plugin-group` |
| `timer/` | `@deepseek-ai/cordis-plugin-timer` | `@cordisjs/plugin-timer` |
| `hmr/` | `@deepseek-ai/cordis-plugin-hmr` | `@cordisjs/plugin-hmr` |
| `logger-console/` | `@deepseek-ai/cordis-plugin-logger-console` | `@cordisjs/plugin-logger-console` |

تعديل كتابة فقط سقوط في**حمل تحديد حد رمز كامل حزمة اسم token** فوق: جذب رقم أو عكس جذب رقم حزمة لف specifier(يمكن حمل `/فرعي مسار`) ،`package.json` `name` و اعتماد مفتاح،`cordis.yml` `name:` قيمة،`tsconfig.base.json` `paths` مفتاح. لذلك التالي نفس شكل سلسلة واحد قاعدة لم تعديل، هو جمع لا هو حزمة اسم:`cordis.yml` و ذلك بيت عائلة ملف اسم،Loader `cordis:` داخل بناء بادئة (`cordis:include`،`cordis:group`، رؤية `vendor/loader/src/config/tree.ts`) ،`cordis-config-entry` هذا صنف kind سلسلة،`@deepseek-ai/dsh-tool-cordis`،Schemastery فوق تنقل `Symbol.for('schemastery')` و `vendor:` بيانات وصفية،`scripts/gen-module-graph.ts` و `gen-doc-graphs.ts` داخل `GROUP_ORDER` `packages/<group>/` دليل اسم، و `vendor/*/README.md` داخل فوق تنقل تثبيت إشارة جذب.

Token قاعدة نظر لا رؤية اثنان صنف نقطة موضع، هو جمع حسب اسم حرف تدريجي موضع تعديل: واحد هو خاصية وصول `manifest.peerDependencies?.cordis`——TypeScript إمساك لا إلى مرور مدة `Record<string, string>` مفتاح؛ اثنان هو يأخذ اسم حرف عند بيانات معتاد كمية (`check-workspace-constraints.ts` vendored تجميع دمج،`verify-cordis-config.ts` group/include اسم،`cordis-walk.ts` و `gen-scoped-events.ts` و typert `analyzer.ts` داخل تعرف آخر `declare module` هدف نص،`app-boot/tsdown.config.ts` `alwaysBundle`).

Markdown حسب «قراءة من أخذ هو فعل ماذا» واحد قسم لـ اثنان. محيط شريط واحد قاعدة تتبع حال تعديل، لا نظر info string——محيط شريط داخل هو قراءة من يلزم وفق نسخ شفرة أو يلزم تركيب إعداد، يشمل كتابة حال Loader إضافة اسم `yaml` محيط شريط و ضيق مجاور تحرير ترجمة محيط شريط `ts ignore-check` محيط شريط. تفرق نص فقط في `docs/` تحت تتبع حال تعديل: تعليم مسار داخل مرجع بعض عدد اسم حرف جملة فرعي، تعليم هو هذا مستودع قد لا تحليل شرق غرب.`docs/` خارج تفرق نص——`vendor/*/README.md`، كل حزمة README،`.agents/notes/`——إبقاء كتابة عمل عند وقت اسم حرف: حيث لأن هو سجل هو عند وقت واقع، أيضا لأن نفس عدد تجميع كتابة ممكن إشارة آخر شرق غرب، مقارنة مثل Python SDK `cordis` خيار، أنا جمع لا vendor `@cordisjs/plugin-http`، أو بعض عدد agent-preset id.

## أثر

- إصدار تجميع داخل لم يعد لديه أي فوق تنقل اسم:`publish-npm-baseline.ts` الآن بلا شرط اشتراط كل انتظار إرسال حزمة كل هو `@deepseek-ai/*`،vendored حزمة لم يعد إعفاء تجنب، تعديل اسم واحد حالما رجوع حينئذ سوف في تحزيم قبل فشل.
- `vendor/README.md` بيان جدول إضافة جديدة «فوق تنقل اسم» صف،`gen-third-party-notices` مع لـ تحليل ستة صف و يأخذ فوق تنقل اسم تصيير دخول `THIRD_PARTY_NOTICES.md`؛MIT ملكية إشارة نحو fork مصدر، بينما لا هو أنا جمع scope.
- `pnpm-workspace.yaml` `minimumReleaseAgeExclude` حذف ذهاب `cordis` و `@cordisjs/plugin-loader` اثنان بند: تعديل اسم بعد هذا اثنان عدد اسم حرف دائم بعيد لا من registry أخذ.
- فوق تنقل sync وفق `vendor/README.md` مسار مشي، رقم 3 خطوة كثير واحد بند: مقابل نسخ دخول قدوم شفرة المصدر إعادة ركض `pnpm run rescope-vendor --apply`، نص برمجي داخل خريطة و بيان جدول اثنان صف اسم حرف يجب متسق.
- **يلزم عودة إلى رسمي جهة فوق تنقل حزمة**وقت عكس حال ركض هذا نسخة خريطة——`pnpm run rescope-vendor --apply --reverse`——مجددا تكملة عودة `minimumReleaseAgeExclude` اثنان بند، وضع تطوير نشر تجميع مقابل `@deepseek-ai/*` تأكيد. تعديل كتابة كمية نحو 1300 عدد ملف، استخدام نص برمجي إعادة وضع بينما لا هو يد تعديل.

تعديل اسم هذا عنصر أمر من `scripts/rescope-vendor.ts` تحمل تحميل: خريطة، حمل تحديد حد رمز token قاعدة، اسم حرف ذلك فعلي هو دليل بينما غير حزمة وقت تدريجي ملف إعفاء تجنب، فوق وجه ذلك دفعة دقيق تعديل كتابة، و واحد تأكيد «صفر ناقص إبقاء، كل بند دقيق تعديل كتابة كل سقوط فوق، قوة انتظار» `--check` نمط——هو من `hygiene` باب في كل مرة CI فوق تنفيذ.rebase وقت إعادة وضع هو، بينما لا هو ذهاب حل واحد 1300 ملف اندفاع مفاجئ؛ فوق تنقل حركة مهمة واحد يتم تثبيت إقامة نقطة موضع، نص برمجي سوف صدى مضيء فشل بينما لا هو ساكن صامت تسرب تعديل.

## اعتبار مرور بديل خطة

**إبقاء فوق تنقل اسم، يأخذ `vendor/` ترتيب حذف في إصدار تجميع خارج.** مرفوض: كل harness حزمة كل إعلان `cordis` لـ peer dependency، تركيب جيد `@deepseek-ai/dsh-*` سوف تحليل لا إلى إطار هيكل.

**فقط في تحزيم وقت تعديل اسم.** مرفوض: إرسال خروج ذهاب اسم حرف و شفرة المصدر شجرة لا متسق، كل وحدة specifier نيل في إصدار مسار داخل الآن تعديل، محلي أيضا لا يوجد أي مرة تشغيل قدرة تكرار الآن إصدار خروج ذهاب شرق غرب.

**دليل اسم و رقم الإصدار واحد و تعديل.** مرفوض: دليل اسم لا هو إصدار معرف، تعديل هو سوف وصل حمل مشروع مرجع،tsdown glob و وثيقة مسار، استلام فائدة لـ صفر؛ رقم الإصدار و دخول `0.0.1` بعد لم يعد ممتلئ كاف إبقاء تحت قدوم `^4.0.0-rc.7` range،pnpm سوف تحويل ذهاب registry بحث فرعي هذا،`verify-vendored-links` مباشر أحمر.

**`docs/` خارج تفرق نص و تاريخ Agent Note واحد بدء تعديل.** مرفوض: هو جمع سجل هو كتابة عمل عند وقت واقع، بينما كما ذلك داخل عار `cordis` نفس مثال ممكن هو SDK خيار اسم أو بعض عدد preset id، لم لا بد هو حزمة؛ موجه إلى قراءة من خريطة من `docs/rescope.md` تحمل تحميل.

# Agent Note: إزالة `GenerateOptions.prefill` و `ToolSchema.strict`——بلا طرف إلى طرف متاح مسار طلب دوران زر

Status: implemented
Archived: 2026-07-26

[English](2026-07-04-drop-inert-request-knobs.md) | العربية

## مشكلة

اثنان عدد طلب عقد نحو دوران زر اختراق اختراق كامل بند طلب خط الإنتاج، لكن كل لا يمكن إنتاج أي فاعلية نتيجة:

- **`prefill`**(`packages/llm/llm/src/types.ts`) لا يوجد إنتاج درجة setter:agent loop(ذكي جسم حلقة) تجميع هو `model`/`system`/`tools`/`messages` إضافة `sessionId`/`signal`، سياق ضغط (context compaction) خلفية فقط إلحاق `maxTokens`؛ بينما كما اثنان عدد مهايئ كل رفض هو:`packages/llm/llm-deepseek/src/serialize.ts` و `packages/llm/llm-pi-ai/src/adapter.ts` كل منها في `prefill` غير undefined وقت رمي خروج `LlmError('UNSUPPORTED')`. هذا حقل الكل يمكن مراقبة قياس سلوك حينئذ هو اثنان عدد throw، كل من واحد بند مهايئ اختبار ثابت.DeepSeek chat-prefix completion هو واحد Beta وظيفة، تشغيل في اثنان عدد مهايئ كل لم إشارة نحو base URL فوق.
- **`strict`**(`ToolSchema`، نفس ملف) اختراق مرور `DefineToolOptions`/`defineTool`(`packages/core/tools/src/schema.ts`) ، سجل التسجيل `schemas()` سماح قائمة (`packages/core/tools/src/index.ts`) ،deepseek بروتوكول صيغة (wire format) خريطة (`packages/llm/llm-deepseek/src/serialize.ts`، ذلك wire-type ملاحظة تفسير سجل strict نمط حاجة مهايئ لم استخدام `/beta` base URL) ،`packages/llm/llm-pi-ai/src/adapter.ts` في تدريجي أداة payload إصلاح تكملة منطق، و tool-catalog مصير (`scripts/gen-tool-catalog.ts`) في شرط `Strict:` سطر. لا يوجد أي قد إصدار أداة ضبط مرور هو——في كل `tool-*` حزمة src و `examples/` في تنفيذ `rg` بحث،`strict:` إنتاج من لـ صفر؛ وحيد setter ظهور في dsh-tools اختبار وحدة في.

اثنان عدد دوران زر في مهايئ بين هو مقابل تسمية، لذلك إزالة عملية سوف هو جمع من اثنان عدد توأم توليد مهايئ في واحد و تقشير مغادرة——[توأم توليد مهايئ تصميم](../architecture/2026-06-13-twin-llm-adapters.md) لا تلقي أثر.

## قرار

- من `GenerateOptions` في إزالة `prefill`، معا إزالة اثنان عدد مهايئ UNSUPPORTED حراسة حماية، ثابت رمي خطأ سلوك اختبار،[core.md](../../../../docs/core-data-structures/core.md) في لصق لصق سطر، و سجل هذا رفض سلوك مهايئ README جدول إطار سطر. فعلي تشغيل يد سجل في UNSUPPORTED إشارة توجيه ([adding-an-llm-adapter.md](../../../../docs/cookbook/adding-an-llm-adapter.md)) تعديل لـ عام جدول وصف قاعدة——مزود لا يمكن التزام حراسة `GenerateOptions` حقل ينبغي رمي خروج `LlmError(..., 'UNSUPPORTED')`——بينما لم يعد بـ prefill لـ مثال.[محتوى كتلة مفردات Agent Note(agent قرار سجل)](../architecture/2026-06-11-content-block-vocabulary.md) عاقبة حسب وفق [implemented/AGENTS.md](../AGENTS.md) ، سوف prefill سجل لـ من إنتاج من باب تحكم، بينما لا هو قد لديه ملكية.
- من `ToolSchema`،`DefineToolOptions`،`defineTool`،`schemas()` سماح قائمة،deepseek تسلسل تحويل فرع و ذلك wire-type حقل، و أداة دليل مصير `Strict:` سطر في إزالة `strict`.pi-ai payload إصلاح تكملة منطق بسيط تحويل لـ مقابل pi-ai ذاته تدريجي أداة strict قيمة افتراضية بلا شرط صاف حذف (pi-ai في كل تسلسل تحويل أداة فوق ضرب `strict: false`؛ يد كتابة توأم توليد مهايئ لا إرسال هذا حقل، لذلك صاف حذف منطق لـ إبقاء بروتوكول صيغة مقابل انتظار بينما إبقاء، من ذلك تسلسل تحويل جهاز اختبار ثابت).setter اختبار و core.md لصق لصق سطر قد إزالة؛`GenerateOptions` و `ToolSchema` في `scripts/type-equiv.manifest.json` في إبقاء كل منها سطر، لأن اثنان عدد نوع فقط هو قليل واحد حقل، ذاته ما زال وجود.

هذا Agent Note لحظة معنى لا لمس و `temperature`،`stop` أو `maxTokens`: اثنان عدد مهايئ كل سوف طرف إلى طرف التزام حراسة هو جمع، بينما كما هو جمع ذاتي لكن هو `agent/request` فوق تعديل طلب خطاف إضافة أول دفعة هدف.

## سبق اعتبار بديل خطة

### لـ ماذا لا إبقاء؟

«صريح UNSUPPORTED throw هو صدق فعلي عقد نحو سلوك»——لكن واحد في اثنان عدد توأم توليد مهايئ في وحيد تنفيذ حينئذ هو رفض دوران زر، ماذا أيضا لا تحمل وعد؛ حذف هو عكس بينما ترقية فشل نمط: معنى خارج setter تغيير صار تحرير ترجمة خطأ بينما غير وقت التشغيل throw.«Strict schema التزام دوران هو رسمي جهة وثيقة تسجيل تحميل مزود وظيفة، كما إدارة طريق كامل»——لكن واحد دوران زر في لديه قد إصدار أداة ضبط هو و كما لديه طرف نقطة صرف الآن هو قبل، لا بنية صار منتج جدول وجه؛ اليوم يوم اثنان من كل لا صار قيام. هو جمع كل منها مع أول عدد حقيقي producer ارتداد:`prefill` مع تنفيذ chat-prefix completion مهايئ (و مقابل لا دعم حمل هذا وظيفة مهايئ واضح سياسة) واحد بدء عودة قدوم؛`strict` مع حاجة هو أداة و beta طرف نقطة خطة واحد بدء عودة قدوم.

## تحقق

`rg prefill` فقط إرجاع Agent Note سجل (هذا نص و[محتوى كتلة مفردات Agent Note](../architecture/2026-06-11-content-block-vocabulary.md) في من إنتاج من باب تحكم عاقبة) ؛ حد تحديد في أداة schema نطاق داخل `rg strict` فقط إرجاع هذا Agent Note، إبقاء تحت قدوم pi-ai تنظيف منطق، و `strictEqual` انتظار غير متصل متن. اثنان عدد مهايئ عقد نحو اختبار كل قدرة في لا يوجد حراسة حماية حال حال تحت عبر،pi-ai إصلاح صحيح ما زال سوف تنظيف مكتبة strict قيمة افتراضية——ذلك serializer اختبار ثابت خط بروتوكول متسق صفة.

## عاقبة

قد إصدار خطاف جسر وصل لا ضبط أي طلب حقل، بينما طلب تغيير إضافة (`agent/request` waterfall(شلال نشر صيغة حدث) مستمع) استخدام هو `temperature`/`stop`(إبقاء كما متاح) ، بينما غير مهايئ رفض حقل. إذا chat-prefix completion أو strict نمط يصبح منتج وظيفة، إعادة إضافة سوف مع مهايئ/طرف نقطة عمل واحد بدء سقوط أرض، دورة وقت عقد نحو قدرة شرح فعلي حدوث ماذا، بينما لا هو «كل شخص كل throw».

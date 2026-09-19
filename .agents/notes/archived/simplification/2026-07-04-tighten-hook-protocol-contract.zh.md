# Agent Note: استلام ضيق hook-protocol اتفاق——dialect، يتم إسقاط حقل، مزدوج إعادة قيمة افتراضية و lib يملك `hook/result` دلالة

Status: implemented
Archived: 2026-09-04

[English](2026-07-04-tighten-hook-protocol-contract.md) | العربية

## مشكلة

`dsh-hook-protocol`/bridge اتفاق في لديه أربعة جزء لا يوجد التزام حراسة [subagent observe/enrich Agent Note](../../archived/feature/2026-06-30-subagent-observe-enrich.md) تسجيل تحت دقيق فإن——بعد من بسبب نقص قليل مستهلك بينما حذف `agentType` دورة الحياة حقل، التالي كل بند لا يوجد عبر نفس فحص تحقق:

1. **`HookDialect` `'native'` تغيير جسم**(`packages/hooks/hook-protocol/src/types.ts`) لا يوجد إنتاج من——bridge سوف علامة `'claude'` و `'codex'`؛ كل موضع في وحيد بنية صنع `'native'` هو هذا مكتبة ذاتي ذات اختبار وحدة. حقل ذاته JSDoc سوف `dialect` تعريف لـ «تشغيل هو bridge» ، بينما native لا هو bridge:[اعتراض قطع نقطة توسيع Agent Note](../feature/2026-06-30-interception-extension-points.zh.md) تسجيل تحميل native خطاف لا هو واحد حزمة، و كما «native إضافة بلا حاجة حمل دائم خطاف سجل يكفي استخدام نوع تحويل Decision» ؛ راية سفينة native إضافة فعلي ممارسة عرض مثال تماما جيد تأكيد هذا واحد نقطة (تماما لا يوجد `hook/*` حدث).
2. **`HookOutput.suppressOutput`**(نفس ملف) يتم codec تحليل بعد في كل مسار فوق متساو يتم إسقاط: لا يوجد bridge فرع معالجة هو، لا يوجد دمج fold، لا يوجد warn، لا يوجد deferred-list سطر——في كل «يتم تحليل لكن لم صرف الآن» نفس صنف حقل في هو هو وحيد لا يوجد واضح تأجيل إعلان (`updatedInput` → واحد بند warn سجل إضافة [pre-tool-input-rewrite رفع سجل](../../proposed/feature/2026-06-30-pre-tool-input-rewrite.zh.md) ؛`systemMessage` → واحد بند warn سجل إضافة README deferred سطر؛`continue`/`stopReason` → واحد `TODO(hook-continue-false)` مرساة نقطة إضافة `'stop'` decision سجل). من بنية فوق نظر أصل هذا بلا شيء يمكن كبح صنع: خطاف stdout من لا دخول أي transcript(نص سجل) ؛ سياق فقط عبر `additionalContext` تدفق دخول، سجل أيضا فقط سجل `decision`/`stderrSummary`. لذلك، خطاف عمل من ضبط `suppressOutput: true` نيل إلى هو بلا صوت فارغ عملية، كما بلا أي تحذير إبلاغ.
3. **`defaultTimeoutMs` في اثنان عدد bridge إعداد في كل بـ تنقل مغادرة حرف وجه كمية تكرار ضبط قيمة افتراضية**——schema `.default(600_000)` إضافة فوق واحد `?? 600_000` رجوع (`packages/hooks/hooks-claude-code/src/index.ts`،`packages/hooks/hooks-codex/src/index.ts`) ، واحد بروتوكول درجة معتاد كمية في كل bridge في لديه اثنان عدد ملكية أرض، اثنان عدد bridge ممكن في مشترك قيمة افتراضية فوق صامت لكن قسم اختلاف.*حسب no-hardcoded-tunables قاعدة، هذا دوران زر إبقاء لـ bridge يملك صريح إعداد (جانب حافة لديه `stderrSummaryMaxChars`) ؛ يلزم إصلاح هو حرف وجه كمية ملكية أرض.*
4. **`hook/result` دلالة وجود في اثنان عدد bridge في (كل واحد نسخة) ، بينما غير يملك هذا حدث lib.** `summarize()`——stderr قطع قطع قاعدة——في `packages/hooks/hooks-claude-code/src/index.ts` و `packages/hooks/hooks-codex/src/index.ts` في تدريجي بايت نفسه؛decision نص قاعدة `output.decision ?? (output.continue === false ? 'stop' : 'pass')` نفس مثال مثل هذا. لكن بينما `dsh-hook-protocol` إعلان `hook/result`، في وثيقة في سوف `stderrSummary` وصف لـ «قد قطع قطع» لكن لا يملك قطع قطع منطق، سجل decision قيمة لكن لا يملك خريطة منطق. إذا بعض عدد bridge عائم نقل (مختلف حد أعلى، مختلف رجوع) ، مشترك حفظ دائم حدث دلالة حينئذ سوف صامت لكن قسم تقاطع.

## قرار

`HookDialect` هو غلاف إغلاق bridge تجميع دمج:`'claude' | 'codex'`؛`HookOutput` إزالة لا تلقي دعم حمل `suppressOutput`.`hook/result.durationMs` إبقاء لـ حفظ دائم مراجعة حساب حساب وقت، فقط في لقطة في فعل عودة واحد تحويل. مشاركة اعتبار قيمة افتراضية كل فقط وجود واحد موضع:`DEFAULT_HOOK_TIMEOUT_MS` و `DEFAULT_STDERR_SUMMARY_MAX_CHARS`.`HookResultRecord` و `appendHookResult` مشترك نفس مسؤول اثنان عدد bridge stderr ملخص تحويل و decision دفع توجيه منطق.`BLOCKING_EXIT_CODE` لـ codec داخلي معتاد كمية.

## سبق اعتبار بديل خطة

### لـ ماذا لا إبقاء هو جمع؟

لا تلقي دعم حمل مفردات يمكن في حق صحيح لديه مستهلك وقت ارتداد.`durationMs` إبقاء، لأن حفظ دائم مراجعة حساب حساب وقت مستقل في حالي هل لديه قراءة جهة بينما لديه قيمة قيمة.Bridge خاص لديه payload بنية صنع إبقاء في كل منها bridge في، بينما مشترك حفظ دائم حدث عودة واحد تحويل يخص بروتوكول مكتبة.

## تحقق

`HookDialect` فقط يتضمن Claude و Codex،`suppressOutput` في شفرة المصدر، قد تحليل حقل وثيقة و عودة واحد تحويل منطق في متساو لا وجود.`durationMs` إبقاء في حدث و fixture(اختبار قبل وضع بيانات) في، إعادة تشغيل وقت فعل صاف غسل.`600_000` و `500` اثنان عدد قيمة افتراضية كل فقط في بروتوكول مكتبة في ظهور مرة؛ كل خطاف مهلة تغطية ما زال توليد فاعلية؛ اثنان عدد bridge اختبار طقم عنصر متساو تحقق من مكتبة يملك stderr قطع قطع و decision قاعدة.

## عاقبة

`dialect`،`suppressOutput`، يمكن ضبط معامل و دلالة تغيير في بروتوكول صيغة (wire format) و مسبق مدة إخراج في متساو غير ممكن رؤية. بديل قيمة هو `dsh-hook-protocol` و اثنان عدد bridge في تعديل——في مسبق إصدار قيام ساحة تحت صار هذا جدا منخفض، أيضا مقارنة يجعل واحد بند حمل دائم حدث دلالة اثنان عدد فرعي هذا كل منها قديم تحويل أكثر سهل مناسب.

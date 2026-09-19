# Agent Note: استخدام نفس بند اختيار أخذ قاعدة في فارغ إنهاء رسالة بعد إبقاء فرعي بديل إدارة إخراج

Status: implemented
Archived: 2026-09-04

[English](2026-08-10-subagent-empty-terminal-message-output.md) | العربية

## مشكلة

عند `max-tokens` step فقط تجميع خروج tool-call block وقت،agent loop سوف إلحاق فارغ content `assistant/message`، لأن `BlockAssembler.blocks()` سوف إسقاط يتم قطع قطع tool call؛ هذا message إبقاء stream و usage، لكن لا مساهمة output block. ثلاثة عدد مستهلك مستقل اختيار أخذ child agent إخراج، و يأخذ هذا record عند صار إخراج. عملية داخل driver `readResult` و continuable Activation `subagent/end` capture لا إضافة مرور ترشيح أرض اختيار أخذ الأكثر بعد واحد بند `assistant/message`،SDK backend observer فإن يجعل أي `assistant/message` أولوية في تراكم حساب text. في يتم max-tokens قطع قطع كثير step turn في، الأكثر بعد فارغ message توجيه يؤدي `SubagentResult.output`،tool result،telemetry و `subagent/end.lastAssistantMessage` تسرب إسقاط حقيقي partial answer. عملية داخل driver أيضا نقص قليل streamed-text fallback، لذلك يتم إلغاء child وحيد text إذا فقط وجود في تضمين دخول صيغة Assistant stream في، أيضا سوف تقرير إبلاغ `[]`.

## قرار

`dsh-subagent` في `src/assistant-output.ts` في يملك وحيد مواصفة اختيار أخذ قاعدة: اختيار أخذ الأكثر بعد واحد بند غير فارغ Assistant message؛ لا يوجد وقت، من تضمين دخول صيغة `assistant/message` و `assistant/attempt` stream أو chunk-only transport اختيار أخذ تراكم حساب `text-delta` content؛ تجاهل اختصار فارغ content message. زيادة كمية `AssistantOutputFold` عبر `push(event)`،`pushText(text)` و `collect()` تنفيذ هذا قاعدة.`finalAssistantOutput(events)` يأخذ قاعدة تطبيق في كامل event suffix، توفير عملية داخل `readResult` و Activation capture استخدام.SDK backend طي notification event؛ACP backend لا عام كامل Assistant message، و طي raw chunk text.`SubagentResult.output` تعريف result contract،`subagent/end.lastAssistantMessage` استخدام نفس قاعدة.child لا إنتاج مهمة واحد نوع إخراج وقت، مرة صفة و continuable run lifecycle field كل نقص حذف، بينما لا هو فارغ array.`max-tokens` أو `aborted` result إبقاء فعلي stop reason.

قبل منصة تفويض إرسال أداة استخدام نفس اختيار أخذ قاعدة. غير `completed` نتيجة ما زال هو `isError` أداة نتيجة، لكن ذلك رسالة سوف في إنهاء سبب عنوان بعد عرض من[غير تفاعل إذن قرار](../feature/2026-08-15-product-subagent-noninteractive-permissions.ar.md) مسؤول اختياري أمان مزود تشخيص، مجددا مرفق فوق فرعي agent جزء نص. أب نموذج سوف معا استلام إلى فشل، مستقل أساس أساس ضبط تطبيق شرح و قد لديه assistant إخراج، بينما كما لن يأخذ هو جمع خلط لـ واحد جسم.

## تحقق

بلا مفتاح SDK خلفية اختبار استخدام `FAKE_EMPTY_MESSAGE` إرسال خروج واحد بند فقط سجل usage إنهاء رسالة.`subagent-max-tokens-partial` ACP لقطة سجل واحد فرعي agent: هو تدفق صيغة إخراج نص و مرة أداة استدعاء، انتهاء في فقط يحتوي أداة استدعاء max-tokens خطوة، حفظ دائم سجل في يحتوي واحد بند فارغ usage رسالة، و عبر أب جانب خطأ أداة نتيجة إرجاع جزء نص. وحدة تغطية فحص فارغ إنهاء رسالة، إلغاء، رسالة ترتيب، لا يحتوي نص غير فارغ رسالة، و ترتيب حذف أداة نتيجة محتوى.

## اعتبار مرور بديل خطة

**كل مستهلك حينئذ أرض إصلاح، لا سحب مشترك مساعد مساعدة دالة.** لـ الذي بـ مرفوض: ثلاثة موضع مستقل اختيار أخذ قد حدوث قسم اختلاف، بينما نفس مرة تشغيل مراقبة جهة يجب مقابل ذلك إخراج بلوغ صار متسق.

**يجعل loop لم يعد إلحاق فارغ رسالة.** لـ الذي بـ مرفوض: هذا بند رسالة سجل usage، و في حفظ دائم سجل في إبقاء هذا خطوة ("model-visible ⟺ logged") ؛ لـ معالجة إخراج اختيار أخذ بينما تعديل جلسة حدث، سوف أثر كل replay و projection مستهلك.

**يأخذ فارغ محتوى رسالة نظر لـ خطأ.** لـ الذي بـ مرفوض: تدفق صيغة نص عندئذ هو فرعي بديل إدارة حقيقي جزء عودة جواب، كما إنهاء سبب قد إبلاغ إبلاغ مستهلك جولة يتم قطع قطع.

## عاقبة

يتم max-tokens قطع قطع كثير خطوة فرعي agent سوف تقرير إبلاغ ذلك أكثر مبكر نص؛ يتم إلغاء عملية داخل فرعي agent إبقاء في توقف قبل قد تدفق صيغة نص؛ مرة صفة و continuable `subagent/end` حدث نفس `SubagentResult.output` متسق. محتوى غير فارغ لكن لا يحتوي نص رسالة (مثال مثل فقط يحتوي reasoning محتوى) ما زال أولوية في تدفق صيغة نص، لأن قاعدة فحص محتوى طويل درجة، بينما لا هو نص هل وجود. غير فارغ رسالة نفس مثال أولوية في ذلك بعد عندئذ تدفق صيغة خروج نص: فرعي agent في تدفق صيغة إخراج لاحق خطوة وقت يتم إلغاء، تقرير إبلاغ هو أكثر مبكر ذلك بند كامل رسالة، إنهاء سبب فإن سجل هذا قطع قطع.

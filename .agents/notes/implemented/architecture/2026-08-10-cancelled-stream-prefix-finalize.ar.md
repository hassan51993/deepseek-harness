# Agent Note: يتم إلغاء تدفق تحديد مسودة ذلك قد إرسال بلوغ بادئة

Status: implemented

[English](2026-08-10-cancelled-stream-prefix-finalize.md) | العربية

## Problem

يتم إلغاء تدفق ممكن إبقاء تحت Client قد تصيير لحظة حالة chunk، لكن إذا لا يوجد `assistant/message` سجل قد إرسال بلوغ بادئة،`deriveMessages()` حينئذ سوف ترتيب حذف هذا جزء محتوى. لاحق «ثاني نقطة توسيع شرح شرح» لـ صنف تتبع سؤال سوف نقص قليل مستخدم قد قراءة إلى نص، في هذا جولة فوق إنشاء فرع أيضا سوف وراثة هذا عدد نقص فتحة.

نموذج تاريخ يجب يتضمن إلغاء بعد ما زال مقابل مستخدم مرئي assistant محتوى.

## Decision

`ReactLoopAgent.step()` في إزالة استهلاك نموذج stream خلال التقاط إمساك إلغاء، هذا وقت `BlockAssembler`، ضيق تجميع stream accumulator و provider route يمكن تحديد قد إرسال بلوغ بادئة.loop يأخذ هذا بادئة إلحاق لـ step `assistant/message`، و ضبط `interrupted: true`،`surfaceOp: 'append'` و دقيق تضمين دخول صيغة حمل وقت stream. هذا إلحاق أولا في committed `agent/assistant-stream` end frame،`step/end` و سجل aborted `turn/end`.

`BlockAssembler.interruptedBlocks()` حسب stream ترتيب إرجاع محتوى غير فارغ أبيض قد إغلاق دمج و لم إغلاق دمج `text` و `reasoning` block. ضرب قطع أولا في قسم إرسال، لا يوجد حقيقي أداة نتيجة، لذلك هو سوف حذف استدعاء الأداة، أيضا سوف حذف فارغ block و لم إغلاق دمج لم معرفة block نوع. إرجاع نتيجة لـ فارغ وقت إلحاق `assistant/attempt`، بينما لا هو surface message.Provider `error` و `aborted` finish أيضا سوف في `agent/request-error` قبل إيداع `assistant/attempt`، لذلك ذلك stream إبقاء حمل دائم، لكن فشل طلب محتوى لن دخول نموذج تاريخ.

Chat و Trajectory Conversation Definition من حمل دائم message قراءة `interrupted`.Chat تصيير Stopped marker،Trajectory فإن في `step/end` بعد يأخذ provider request إبقاء في error دورة الحياة، و إبقاء حمل دائم result seq و provider معلومة. أداة تنفيذ خلال إلغاء التزام دوران أداة مجدول اتفاق، لأن assistant message قد إيداع: قد بدء استدعاء توليد حقيقي نتيجة، لم قسم إرسال استدعاء نيل نيل `ABORTED_BEFORE_DISPATCH` نتيجة.

## Alternatives considered

**بداية نهاية إسقاط بادئة.** هذا قدرة تجنب تجنب إضافة جديدة حمل دائم علامة، لكن كل مرة إلغاء بعد تتبع سؤال و فرع كل سوف نقص قليل ما زال مقابل مستخدم مرئي assistant محتوى.

**في إسقاط وقت من تضمين دخول صيغة attempt تجميع بادئة.** `deriveMessages()` و Client Conversation Definition كل حاجة تنفيذ ضرب قطع تجميع قاعدة، سجل في أيضا لا يوجد هذا بادئة مرجعي surface message. هذا أيضا سوف يجعل نموذج تاريخ تجاوز خروج ثلاثة صنف `SurfaceEventType` حدث.

**إبقاء كامل استدعاء الأداة و دمج صار aborted نتيجة.** هذه استدعاء من لم قسم إرسال، دمج صار نتيجة سوف صوت تسمية واحد و لم حدوث تنفيذ نتيجة، أيضا سوف زيادة مستخدم لم استلام إلى أداة نتيجة محتوى.

**إلحاق `[interrupted by user]` لـ صنف نموذج مرئي ضرب قطع رسالة.** هذا يمكن إبلاغ إبلاغ نموذج بادئة و لا كامل، لكن حاجة مستقل مصدر نوع، إسقاط قاعدة،UI معالجة و محلي تحويل نص سجل. حمل دائم aborted `turn/end` إبقاء هذا لاحق قرار الذي يحتاج واقع.

## Consequences

إلغاء بعد تتبع سؤال و فرع سوف يتضمن قد إرسال بلوغ بادئة.ACP جسر سوف في تسوية prompt قبل ترتيب فارغ حسب ترتيب نقل إرسال assistant إخراج، لذلك الأكثر بعد واحد بند `agent_message_chunk` تحديث أولا في cancelled stop reason.

نهاية نطاق provider error سوف في `assistant/attempt` في إبقاء ذلك stream، لكن لا يجعل محتوى دخول نموذج تاريخ. فقط لديه مستخدم إلغاء قرار سوف يأخذ مرئي قد إرسال بلوغ نص تغيير صار interrupted surface message.

## Testing

`packages/core/agent-loop/tests/cancel.spec.ts` تغطية content، تضمين دخول صيغة stream، حدث ترتيب، تحت واحد طلب متسق صفة، فقط reasoning إخراج، استدعاء الأداة حذف، استعادة خلال إلغاء و فارغ بادئة attempt.`packages/llm/llm/tests/assembler.spec.ts` تغطية `interruptedBlocks()`.`packages/client/ui-chat/tests/conversation-node-definitions.client.spec.ts` و `packages/client/ui-trajectory/tests/conversation-definitions.client.spec.ts` تغطية اثنان نوع Client إسقاط.keyless `cancel` ACP snapshot و `goal-round-driver` goal snapshot تغطية تجميع تطبيق.

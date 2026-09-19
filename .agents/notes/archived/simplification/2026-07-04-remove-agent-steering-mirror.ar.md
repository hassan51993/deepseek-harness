# Agent Note: إزالة `agent/steering` مرآة مثل emit

Status: implemented
Archived: 2026-07-26

[English](2026-07-04-remove-agent-steering-mirror.md) | العربية

## مشكلة

`agent/steering` هو الأكثر بعد واحد ما زال وجود، مقابل حمل دائم جلسة حدث لحظة حالة مرآة مثل.agent loop(ذكي جسم حلقة) steering(في طريق جذب توجيه)drain منطق أولا إلحاق حمل دائم حدث `steering/message { turn, content, source }`، ضيق وصل حال تحت واحد سطر حينئذ emit `agent/steering(agent, turn, content, source)`——نفس عدد واقع بـ fire-and-forget حدث شكل صيغة تكرار إرسال خروج (`packages/core/agent-loop/src/loop.ts`،`drainSteering`). هو في إنتاج بيئة في لا يوجد أي استماع من: وحيد حجز قراءة جهة هو واحد agent loop ارتداد اختبار، تأكيد emit يحمل `source`——بينما هذا نفس عدد واقع قد من فوق واحد سطر حمل دائم حدث سجل.

`agent/steering` بـ نفسه payload تكرار ضيق وصل ذلك قبل حمل دائم حدث `steering/message`.`agent/queued` ما زال إبقاء لـ صاف لحظة حالة إشارة، لأن هو في حفظ دائم قبل إطلاق، تغطية ممكن في دخول سجل قبل يتم إلغاء عمل.

Steering تحمل تحميل حقيقي إنتاج تدفق كمية——خطاف bridge جولة تأخير متابعة قرار عبر `inbox.steer()` حقن ذلك إدارة من، نهائي يصبح من خطاف مستطيل دفعة مسبق مدة إخراج ثابت حمل دائم `steering/message` حدث——بينما هذه مستهلك بلا واحد مثال خارج كل مراقبة حمل دائم حدث. لا يوجد أي محتوى مراقبة مرآة مثل.

## قرار

`agent/steering` قد من agent حدث تصنيف في إزالة: يشمل `packages/core/agent/src/types.ts` في إعلان (و منها فوري حدث JSDoc قائمة مقابل هو رفع و) ،`drainSteering` في emit(عند وقت قد بلا استخدام `ctx` معامل أيضا مع لـ إزالة) ،`packages/core/agent/README.md` في جدول إطار سطر، و حلقة زائف شفرة كتلة (`packages/core/agent-loop/src/loop.ts` وحدة وثيقة و [architecture.md](../../../../docs/architecture.md)) في emit سطر؛Cordis دليل إعادة توليد بعد لم يعد يتضمن هو. وحيد ارتداد اختبار تعديل لـ في حمل دائم `steering/message` حدث فوق ثابت مصدر إبقاء سلوك——الذي ثابت واقع وجود في سجل فوق.

ثلاثة نسخة قد تنفيذ Agent Note(agent قرار سجل) سبق شرح إبقاء هذا حدث؛ حسب وفق [implemented/AGENTS.md](../AGENTS.md) ، كل نسخة سجل كل قد تعديل و إشارة نحو هذا نص بصفة إزالة سجل: يشمل[حد Agent Note](2026-06-20-remove-agent-boundary-mirror-events.md) إبقاء قائمة بند،[تدفق قسم قطعة Agent Note](2026-07-02-remove-stream-chunk-mirror.md) نطاق بند بند، و[حدث مجال دلالة Agent Note](../architecture/2026-06-30-event-domain-semantics.md) لحظة حالة emit قطعة رفع.

## سبق اعتبار بديل خطة

### لـ ماذا لا إبقاء؟

“هو هو تحكم إشارة، لا هو حد”——لكن هذا تصنيف فعلي منطقة قسم هو مرآة مثل/فقط فوري، بينما غير تحكم/حد، و كما هذا حدث تأكيد فعلي هو مرآة مثل. أمل نظر في دخول طابور وقت استلام إلى إشعار مستهلك يمكن استخدام `agent/queued`(و ذلك steering علامة) ؛ أمل نظر في ترتيب فارغ وقت استلام إلى إشعار مستهلك، هذا جودة فوق هو في اشتراط نيل معرفة `steering/message` يتم إلحاق وقت لحظة، بينما `session/event` سوف تسليم نفسه payload و مرفق حمل حمل دائم صفة. تعرض رفض[تراجع دور جولة في طريق steering Agent Note](../../rejected/simplification/2026-06-20-retire-mid-turn-steering.md) الذي دفاع حماية هو steering *وظيفة*——`steer()`، حمل دائم حدث، قوي صنع تأخير متابعة——هذا مرة إزالة لن لمس و منها أي واحد بند.

## تحقق

`agent/steering` تجميع كتابة فقط وجود في Agent Note متن في (هذا Agent Note، فوق جهة ثلاثة نسخة قد تعديل Agent Note، و قد تجميد ربط[تعرض رفض steering وظيفة Agent Note](../../rejected/simplification/2026-06-20-retire-mid-turn-steering.md) ، ذلك متن سجل هو الذي مرفوض رفع سجل) ؛ دليل قد إعادة توليد؛ إعادة تحديد نحو اختبار في `steering/message` فوق ثابت مصدر إبقاء سلوك.

## عاقبة

إنتاج بيئة في لا يوجد حاجة ترحيل استماع من، اثنان نوع لحظة حالة إشعار يحتاج طلب كل لديه عودة مضيف: دخول طابور وقت من `agent/queued`(حمل `steering` flag) تحمل تحميل،drain وقت من `session/event` في حمل دائم حدث `steering/message` سقوط أرض وقت تحمل تحميل.

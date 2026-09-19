# Agent Note: فوري assistant تدفق لقطة و Session log إبقاء قسم مغادرة

Status: implemented
Archived: 2026-09-04

[English](2026-08-31-live-assistant-stream-frames.md) | العربية

## مشكلة

v2 Session log عبر واحد `assistant/message` أو `assistant/attempt` settlement إبقاء كامل ضيق تجميع حمل وقت stream، لذلك replay، بارد قراءة، بعيد قياس و طلب إعادة بناء كل قدرة مراقبة نفس نسخة حمل دائم تاريخ. فوري مستهلك أيضا حاجة في طلب وقت التشغيل تدريجي لقطة عرض. يأخذ لحظة حالة عرض update عند عمل آخر نوع حمل دائم حدث، سوف استعادة token حبة درجة حدث أساس عدد، و يجعل فقط يخص عملية دورة الحياة واقع عبر إعادة بدء إبقاء.

## قرار

`dsh-agent-loop` لـ كل مرة نموذج attempt إرسال خروج أثر مجال داخل `agent/assistant-stream` frame.`start`،`chunk` و `end` حمل لديه في مفرد عدد Agent lifecycle داخل وحيد branded `LlmAttemptId`؛ كل frame كل سوف دفع دخول مرة هذا lifecycle محلي revision.start frame إعطاء خروج هذا attempt turn و step،chunk index من صفر بدء سري تجميع تمرير زيادة،chunk ختم الوقت سوف يتم ضيق تجميع stream إعادة استخدام،`end.index` انتظار في تحت واحد chunk موضع.loop سوف أولا أخذ نيل stream و تنفيذ نهائي إلغاء فحص، مجددا إرسال خروج `start`؛ هذه خطوة فشل وقت لا إرسال خروج أي frame. كل قد بدء attempt كل سوف إرسال خروج واحد نهاية حالة end:loop سوف في committed end تسمية حدث و seq قبل إلحاق نهائي `assistant/message` أو `assistant/attempt`، بينما assembly أو settlement failure سوف إرسال خروج لا تسمية حمل دائم هدف abandoned end. قد إقرار إثبات Session-follow قبول صريح Web opt-in، بـ ذاكرة مؤقتة نشط وثب attempt ضيق تجميع baseline فتح، و في واحد FIFO في يحمل حمل دائم حدث و بلا cursor frame. كل follower سوف مع opening baseline التقاط محلي وصول ترتيب رقم، و إسقاط هذا cut و قبل buffered frame؛replacement Agent frame revision يمكن من واحد إعادة بدء، لذلك revision لا تعريف opening cut. نشط وثب opening بعد وصول settlement فقط لديه في ذلك seq متأخر في `startedAfterSeq` كما Turn و Step مطابقة وقت عندئذ يخص هذا attempt؛ هو سوف إبقاء مؤقت تخزين، مباشر إلى مطابقة end index،type و seq وصول، بينما نفس Turn و Step في أكثر مبكر retry ما زال إبقاء مرئي. معروف attempt revision، سري تجميع index أو settlement نقص فتحة سوف إعادة فتح follow و استبدال baseline؛unknown-attempt frame رجوع إلى حمل دائم settlement.TypeScript و Python SDK بروتوكول لا عام هذه frame. حمل دائم settlement ما زال هو replay و نموذج تاريخ حق مصدر؛ ذلك يمثل من [v2 stream قرار](2026-09-01-v2-embedded-assistant-streams.ar.md) مسؤول.

## سبق اعتبار بديل خطة

- **فقط إبقاء live stream**: لا اعتماد، لأن بارد قراءة،replay، بعيد قياس،usage تسجيل حساب و فشل attempt تشخيص حاجة حمل دائم تضمين دخول صيغة stream.
- **يأخذ كل live frame بصفة مستقل حدث حفظ دائم**: لا اعتماد، لأن عملية محلي attempt id،revision و إعادة وصل عرض لن عبر إعادة بدء إبقاء أو أثر نموذج إعادة بناء؛ واحد settlement يملك حمل دائم stream.
- **استخدام لم إضافة صنف لوحة طلب نص بصفة محاولة تجربة مفتاح**: لا اعتماد، لأن مستهلك حاجة واحد لا نفاذ واضح هوية، لا يستطيع يأخذ هو و provider request ID أو حمل دائم Session ID خلط خلط.
- **يجعل UI Chat حجز قراءة ثاني عدد فوري source**: لا اعتماد، لأن Session كائن يملك stream مقابل حساب،UI Conversation هو وحيد event-source حجز قراءة جهة؛ ثاني عدد source سوف جعل تسوية ترتيب اعتماد target.

## أثر

Web client يمكن في attempt settlement قبل تصيير داخل تخزين chunk، معا إبقاء واحد نسخة حمل دائم v2 تاريخ. عملية إعادة بدء بعد لا يوجد نشط وثب Assistant frame؛ إعادة وصل فقط قدرة استعادة حالي عملية يحتفظ baseline، بارد replay فإن توسيع حمل دائم settlement. بلا cursor إشعار أبدا دفع دخول journal cursor، في حمل دائم نقص فتحة إصلاح خلال مراقبة إلى إشعار سوف انتظار replacement page. هذا page لا يحمل Assistant baseline، لذلك Client سوف صاف فارغ لحظة حالة attempt، و يجعل held notification إعادة فتح follow مرة، بـ أخذ نيل إعداد مقابل page و baseline.frame إعلان إبقاء agent أثر مجال، لذلك مستمع فقط مراقبة الذي تابع Agent، حذف غير هو صريح عام تسجيل.

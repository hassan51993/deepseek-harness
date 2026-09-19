# Agent Note: Team رسالة استخدام مفرد واحد Steer send_message عملية

Status: implemented
Archived: 2026-09-04

[English](2026-08-30-team-send-message-steer.md) | العربية

## مشكلة

Agent Teams لـ واحد حمل دائم mailbox عام اثنان عدد نموذج عملية:quiet `send_message` حقن live target بينما لا نداء تنبيه هو،`followup_task` فإن ترتيب دخول واحد مستقل waking turn و بارد استعادة inactive teammate. نموذج يجب اختيار ضبط درجة سياسة، بينما لا هو فقط شرح رسالة هدف؛quiet رسالة ممكن لـ inactive teammate حمل متابعة تراكم تراكم، مباشر إلى غير متصل عمل استعادة هو.

عادي continuable-Agent تحكم عنصر قد استخدام واحد جهة نحو غير متصل، ثابت Steer ضبط درجة `send_message`. إبقاء مستقل Team اسم و إلقاء تمرير نمط، سوف يجعل انتظار قيمة نموذج عبر معلومة لأن target تماما جيد هو direct child أيضا هو Team peer بينما اعتماد مختلف دلالة.

## قرار

كل Team member كل سوف نيل نيل واحد `send_message({ target, message })` أداة.Team أداة تجميع يتضمن تسعة عدد عملية؛ لا وجود `followup_task` و نموذج اختياري quiet إلقاء تمرير. حمل دائم `TeamMessageSnapshot` تخزين sender،target،content و message identity، لا تخزين ضبط درجة حقل.

كل بند قد قبول Team رسالة كل استخدام Steer.running target في الأكثر قريب خطوة حد استلام إلى رسالة،idle target بدء واحد جولة،inactive teammate فإن عبر continuation lifecycle بارد استعادة. كل مرة نجاح Team send كل سوف في بدء إلقاء تمرير قبل إتمام حفظ دائم.`accepted` يمثل target inbox قد قبول رسالة؛`queued` يمثل مؤقت inspection،resume أو inbox دقيق دخول فشل يجعل رسالة إبقاء في Team mailbox انتظار استعادة. اثنان نوع نتيجة كل لا يمثل target قد إتمام الذي طلب عمل.

Lead عبر `Agent.steer()` استقبال يحمل Team عودة بسبب مستخدم رسالة.teammate عبر symbol-keyed host-only continuation adapter استقبال رسالة؛ هذا adapter سوف تخويل دقيق Lead-to-direct-child edge، إبقاء أصلي `TeamMessageSource`، و تنفيذ resident أو cold-resume Steer دقيق دخول. لذلك sibling و teammate-to-Lead رسالة إبقاء حقيقي sender؛Team وقت التشغيل أبدا سوف زائف تركيب صار Lead استدعاء عام متبادل مجاور Agent `sendMessage()`.

Lead Session متابعة بصفة mailbox transaction owner. هو في dispatch قبل flush `team/message/queued`، حسب Lead سجل ترتيب لـ كل target سلسلة سطر تحويل أي وقت دقيق دخول، و كما فقط لديه target Session حمل دائم يتضمن نفسه Team message id بعد عندئذ سجل `team/message/delivered`. استعادة حسب ترتيب إعادة محاولة queued-minus-delivered سجل؛target جانب source طي سوف منع توقف inbox insertion و acknowledgement بين crash window توجيه يؤدي تكرار دقيق دخول.

## اعتبار مرور بديل خطة

**إبقاء quiet `send_message` و waking `followup_task`.** هذا سوف إبقاء استدعاء جهة مقابل turn ضبط درجة تحكم، لكن اشتراط نموذج اختيار تنفيذ سياسة، سماح inactive target وجود لم قراءة حمل دائم mail، و و متبادل مجاور Agent رسالة دلالة قسم تقاطع.

**إبقاء `followup_task` بصفة Steer آخر اسم.** اثنان عدد اسم حرف جدول بلوغ نفس سلوك فقط سوف إبقاء أداة اختيار خطأ، لن زيادة يمكن مراقبة قدرة.

**عبر عام متبادل مجاور Agent `sendMessage()` توجيه sibling.** هذا عملية فقط تخويل دقيق direct-parent أو direct-child نموذج sender، و إرسال توليد ذاتي ذات `AgentMessageSource`. بـ Lead هوية استدعاء سوف خطأ عودة بسبب sibling mail؛ يأخذ هو توسيع إلى Team membership فإن سوف تقليل ضعيف متبادل مجاور علاقة قاعدة.

**حذف Team mailbox و مباشر إلقاء تمرير.** مباشر إلقاء تمرير سوف فقد ذهاب دقيق دخول قبل حمل دائم دخول طابور، مؤقت فشل بعد استعادة، مستقر message id و target جانب ذهاب إعادة.

## اختبار

حزمة اختبار ثابت running،idle،inactive،Lead،sibling و recovery إلقاء تمرير،target-local ordering،sender attribution،inbox/history ذهاب إعادة، مؤقت فشل إرجاع `queued`، و تسعة أداة schema. بلا مفتاح Agent Teams profile snapshot قيادة running implementer، يأخذ researcher رسالة Steer إلى ذلك تحت واحد خطوة، و تحقق اثنان عدد teammate كل متابعة إتمام كل منها مهمة، بعد Lead عندئذ تجميع مجموع نتيجة.

## عاقبة

نموذج فقط لديه واحد نوع Team عبر معلومة اختيار، لا يستطيع متعمد توقف وضع quiet information. واحد بند رسالة ممكن توسيع target حالي turn، لذلك نص التوجيه و اختبار اشتراط teammate كامل دمج جديد رسالة، معا لا وضع ترك قد إجراء عمل.

host-only Steer adapter يصبح Team إلقاء تمرير استخدام داخلي continuation تجميع صار. شخص صنف متصفح prompt إبقاء مستقل Queue adapter، و متابعة شكل صار مختلف turn. أكثر واسع عام [Agent Teams قرار](../feature/2026-08-05-agent-teams.ar.md) متابعة مسؤول mailbox،roster،task و مشترك checkout؛[متبادل مجاور Agent رسالة قرار](../architecture/2026-08-27-adjacent-agent-steer-messaging.ar.md) متابعة مسؤول عام direct-edge authorization و model-message source.

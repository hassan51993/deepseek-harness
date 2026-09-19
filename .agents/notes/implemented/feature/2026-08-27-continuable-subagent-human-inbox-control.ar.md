# Agent Note: يمكن متابعة subagent شخص صنف inbox تحكم

Status: implemented

[English](2026-08-27-continuable-subagent-human-inbox-control.md) | العربية

## مشكلة

يمكن متابعة فرعي درجة و عادي Agent استخدام نفسه agent loop(ذكي جسم حلقة) و inbox، لكن شخص صنف إلقاء تمرير مسار فقط عام FIFO لاحق جولة.Client اختيار مخصص استخدام subagent prompt Remote وقت سوف إسقاط قائم Queue/Steer اختيار، عام Session ownership fence أيضا رفض subagent كل هوية الكل queue تغيير. لذلك، متصفح إخفاء في خط فرعي درجة inbox قد دعم حمل تحكم.

بلا فرق آخر فتح وضع عام Session تحكم سوف تقليل ضعيف subagent كل حق قاعدة.Prompt إلقاء تمرير ما زال حاجة تأكيد قطع في خط مباشر أب درجة تمييز حق و بارد استعادة تسجيل حساب، بينما queue تغيير يجب رفض مرة صفة، لم معرفة، ضرر تالف و بارد فرعي درجة.child ذاته log suffix في صالح continuable descriptor يمكن معرف أي بعض في خط subagent-owned Session قدرة استخدام occurrence mutation.Settlement أيضا يجب في idle Agent ما زال لديه سوف يتم driver إقرار قيادة انتظار إلقاء تمرير عمل وقت إبقاء هذا Agent، أيضا لا نيل تفكيك حذف في `whenIdle()` صرف الآن بعد عندئذ احتلال استخدام idle مرحلة مقطع تنفيذ maintenance مهمة Agent.

## قرار

في خط يمكن متابعة فرعي درجة عام عادي شخص صنف inbox تحكم، لا زيادة آخر طقم queue،Remote endpoint،queue action أو موجه إلى Host subagent عملية. مرة صفة فرعي درجة متابعة فقط قراءة.

قائم `SubagentPromptRequest` يحمل `delivery: 'queue' | 'steer'`.Client يأخذ `Session.prompt(content, mode)` قد اختيار خروج mode مرور `subagent.prompt` أصل مثال تحويل إرسال.Remote ما زال اشتراط تأكيد قطع في خط مباشر أب درجة، مع بعد استخدام واحد حزمة داخل continuation manager إلقاء تمرير عملية.Queue استدعاء `Agent.followup(message)`؛steer استدعاء `Agent.steer(message)`. اثنان بند مسار مشترك child lock، بارد استعادة، نهائي أب درجة إعادة تمييز حق، استدعاء جهة signal قطع توقف،`MessageId` إنشاء، تراجع و dispose تنافس حالة معالجة. هذا شخص صنف اختيار لا إضافة جديدة عام ضبط درجة طريقة أو نموذج أداة؛ من أخرى قرار يملك `sendMessage()` و موجه إلى نموذج `send_message` عملية إبقاء ثابت متبادل مجاور Agent Steer دلالة.

متصفح لـ يمكن متابعة فرعي درجة توفير عادي كثيف مشغول حالة Enter/Cmd+Enter Queue/Steer انحراف جيد،QueueDock Edit/Remove/Steer عملية، و فارغ مسودة مسودة steer-all يد اتجاه.Send و Stop متابعة هو مستقل تحكم.Composer prompt سوف إنشاء جديد قد دقيق دخول عمل، لذلك ما زال اشتراط في خط أب درجة.QueueDock تغيير مباشر بحث عنوان قد في خط inbox عمل، الذي بـ أب درجة مغادرة خط وقت ما زال يمكن استخدام؛ أب درجة مغادرة خط composer متابعة قفل تحديد.

قائم `session.updateQueue(itemId, action)` سوف تحليل تأكيد قطع في خط Agent، و كما فقط لديه subagent-owned Session حالي projected identity لـ continuable،descriptor ترتيب رقم يخص child ذاته غير seed suffix وقت عندئذ سوف دقيق دخول. في خط one-shot Agent و ناقص، فقط وراثة أو بلا فاعلية identity كل سوف متابعة إطلاق كل حق فشل.Agent لا وجود وقت إرجاع `queue-item-not-found`، كما لن بارد استعادة فرعي درجة. مقابل في خط inbox occurrence تغيير بينما قول، هدف Session id قد هو ملء قسم شخص صنف إذن؛ بلا حاجة parent عنوان.Edit و Remove إبقاء قائم كامل `nextTurn` و `nextStep` دلالة، يشمل إضافة حقن context؛Steer اشتراط ترتيب طابور occurrence، كما command بدء وقت Agent يجب تقرير إبلاغ running.

Continuation manager لا إبقاء ثاني طقم رسالة reservation حالة. واحد خاص `SubagentInbox` سوف يأخذ Queue و Steer تفويض حمل إعطاء Agent inbox، و يحتفظ Activation قائم closing promise. ذاتي لكن تسوية سوف انتظار `Agent.whenIdle()`،child Inbox لـ فارغ و الذي يملك كل فرعي درجة إتمام dispose. إدارة جهاز سوف في child lock داخل تأكيد Inbox،owned-child set و wake generation، مجددا في دقيق دخول إبقاء فتح وضع وقت flush نهائي Session حالة. نهائي child-lock قرار سوف إعادة تحقق Session ترتيب رقم و نفسه إقامة إبقاء واقع، لكن بعد تزامن بدء واحد `Agent.runMaintenance()` مهمة؛ هذا مهمة مدخل سوف احتلال استخدام idle مرحلة مقطع، و في نفس عدد JavaScript turn داخل إغلاق حزمة تركيب طبقة. كل انتظار معالجة Inbox occurrence كل سوف إبقاء Activation، بلا نقاش ذلك إلقاء تمرير نمط أو مصدر مثل أي. من manager كل إلقاء تمرير،Inbox claim أو discard، و الذي يملك فرعي درجة تحرير كل سوف تحديث wake generation.flush خلال مباشر قبول Agent عمل يلزم ما تغيير نهائي Session أو إقامة إبقاء مراقبة، يلزم ما إبقاء نشط وثب و منع توقف نهائي maintenance مهمة بدء، يلزم ما في إعادة تحقق قبل إتمام.

QueueDock Steer في command دقيق دخول واحد جارٍ تشغيل ترتيب طابور occurrence بعد، اعتماد Agent best-effort إلقاء تمرير. إذا ترتيب طابور occurrence أولا يتم claim،`queue-item-not-found` يمثل ذلك عادي Queue إلقاء تمرير قد بدء. إذا نشط وثب إلغاء في تزامن تحويل نقل خلال أولا حدوث،Agent steering سوف يأخذ رسالة إلحاق إلى `nextTurn`، قفل تخزين نداء تنبيه،Session command ما زال نجاح. في هذا fallback حال حال تحت، اختيار في رسالة سوف نقل إلى Queue باق بقية بند بعد. جديد تركيب Steer استخدام نفس مثال fallback، خطأ مرور الأكثر قريب خطوة وقت ما زال حفظ إثبات يمكن إلقاء تمرير.

هذا قرار جزء يحل محل [Web subagent دليل و شخص صنف continuation](2026-07-27-web-subagent-conversations.ar.md) ،[يمكن متابعة subagent](2026-07-28-continuable-subagent-conversations.ar.md) ،[Steer Web قد ترتيب طابور رسالة](../../archived/feature/2026-07-30-web-queue-steer-action.md) و[استخدام فارغ مسودة مسودة Cmd/Ctrl+Enter steer كامل Web queue](../../archived/feature/2026-08-06-web-queue-steer-all-gesture.md) في شخص صنف تحكم ترتيب حذف بند. نشط وثب سجل يملك دليل تمييز حق و Activation دورة الحياة؛ عودة ملف سجل إبقاء الأكثر أول QueueDock Steer و يد اتجاه قرار.

## اعتبار مرور بديل خطة

**إضافة جديدة `SubagentRuntime.steer()` و Remote.** رفض، لأن شخص صنف prompt إلقاء تمرير قد يملك حمل mode Client طريقة و واحد قد تمييز حق Remote. جديد عام عملية سوف توسيع كبير service و نموذج متبادل مجاور واجهة، لكن لا زيادة تنفيذ أصل لغة.

**إضافة جديدة `subagents.updateQueue`.** رفض، لأن `session.updateQueue` قد يملك دقيق تأكيد inbox occurrence تغيير و ذلك تنافس حالة فشل.Projected continuable identity توفير ضيق ضيق ownership-fence مثال خارج، بلا حاجة إضافة جديدة عملية.

**يأخذ كل subagent تحكم كل توجيه إلى عام Session API.** رفض، لأن prompt و إلغاء حاجة subagent دم حافة تمييز حق، بارد استعادة تسجيل حساب و مخصص استخدام فشل خريطة. فقط لديه في خط inbox occurrence تغيير يملك كاف كاف هدف محلي حالة، يمكن استخدام ضيق ضيق ownership-fence مثال خارج.

**يأخذ يمكن متابعة queue تغيير حد في `nextTurn`.** رفض، لأن شخص صنف inbox مقابل متساو متعمد يشمل تحرير أو حذف انتظار معالجة steering و حقن context. إذا إضافة حاجة محيط التفاف ذلك `nextStep` إدخال بناء قيام أكثر قوي أمر خدمة، هذا حفظ حماية ينبغي يخص مشترك Agent inbox دلالة، بينما غير subagent مخصص تابع حد.

**حسب `MessageId` تتبع أثر نداء تنبيه عمل، و في mutation في تحويل نقل هذا سجل.** رفض، لأن هذا سوف استخدام ثاني طقم نشط حركة حساب هذا تكرار Inbox انتظار معالجة تجميع دمج، و يجعل إقامة إبقاء اعتماد occurrence هوية.`whenIdle()` سوف انتظار قائم Agent نشط حركة،`Inbox.hasPending` حفظ حراسة أرض إبقاء كل occurrence،Activation generation سوف يجعل مرور مدة مراقبة بطلان، بينما نهائي maintenance مهمة فإن بـ أصل فرعي طريقة ربط وصل idle ownership و دقيق دخول إغلاق. هذا بند اختيار ممكن إبقاء ساكن صامت حقن context، لكن حيث تجنب تجنب مقدار خارج mutation بروتوكول، أيضا تجنب تجنب ساكن صامت فقد فقد قد قبول steering.

**استخدام `MessageSource.kind` دفع توجيه إقامة إبقاء، يأخذ `plugin` نظر لـ توقف وضع context.** رفض، لأن `kind` سجل هو رسالة من من إنتاج، بينما غير مثل أي إلقاء تمرير، كما `MessageSourceMap` يمكن دمج توسيع. إضافة سوف بـ plugin مصدر steer(`cordis-host-runner` فشل تقرير إبلاغ، منع قطع صيغة Stop hook) ،host أيضا سوف بـ غير plugin مصدر inject(`dsh-experimental-agent-team` ساكن صامت بريد عنصر) ، لذلك هذا مقابل علاقة في اثنان عدد جهة نحو فوق كل لا صار قيام. موحد واحد مقابل انتظار كل انتظار معالجة occurrence يمكن تجنب تجنب هذا نوع لا يوجد اعتماد حسب دفع قطع.

## نتيجة

يمكن متابعة فرعي درجة جلسة و عادي Session مشترك واحد طقم شخص صنف inbox تفاعل نموذج و واحد طقم Agent-loop queue. شخص صنف steering يمكن أثر إقامة إبقاء أو بارد استعادة فرعي درجة، بينما لا تغيير عام نموذج تحكم. أب درجة مغادرة خط بعد،QueueDock مقابل في خط فرعي درجة ما زال لديه استخدام؛ جديد رسالة فإن متابعة التزام حراسة مباشر أب درجة تمييز حق.

عام Session command لـ يملك صالح ذاته suffix continuable identity في خط subagent-owned Agent توفير واحد ضيق ضيق ownership-fence مثال خارج. لأن هذا عملية يمكن بحث عنوان اثنان عدد inbox هدف، معرفة طريق انتظار معالجة `MessageId` استدعاء جهة يمكن مثل عملية عادي Session واحد مثال، تحرير أو حذف إضافة توفير next-step إدخال.QueueDock فقط تصيير `queued` placement سطر، لذلك لا يوجد متصفح يد اتجاه قدرة وصول هذا إدخال؛ في ذلك داخل تحرير أيضا سوف إبقاء أصل إنتاج خروج جهة `MessageSource`، من بينما يأخذ شخص صنف نص ملكية إعطاء هذا إنتاج خروج جهة.

Inbox notification إبقاء occurrence دلالة، لا يحمل continuation إقامة إبقاء حالة.Claim و discard notification فقط مسؤول في انتظار معالجة عمل تغير بعد نداء تنبيه settlement؛`whenIdle()`، نهائي idle مرحلة مقطع maintenance مهمة،`Inbox.hasPending`،owned-child set،Activation generation و Session ترتيب رقم بلا حاجة اعتماد ضبط درجة ترتيب، رسالة هوية أو مصدر يكفي قرار أي وقت أمان dispose. نهائي flush يقع في closing cutoff قبل، لذلك detached hook،job completion أو مباشر Agent إلقاء تمرير فقط يلزم في هذا await خلال يتم قبول، حينئذ سوف يجعل مراقبة بطلان، بينما لن يتم مع بعد حدوث dispose إيقاف. ما زال نشط وثب maintenance سوف منع توقف نهائي مهمة احتلال استخدام idle مرحلة مقطع؛ في flush خلال بدء و انتهاء maintenance قد في dispose قبل إتمام. فقط يحتفظ يتم حقن context child أي جعل لا يوجد driver يجب إقرار قيادة هو، أيضا سوف إبقاء إقامة إبقاء؛ إذا بعد لا يوجد نداء تنبيه إلقاء تمرير،queue removal أو manager teardown، هذا child و ذلك في خط أصل أولا يمكن في عملية دورة الحياة داخل واحد مباشر إقامة إبقاء. إعادة وضع خروج Inbox التزام دوران نفس بند حفظ حراسة قاعدة، بلا حاجة إعادة بناء كل بند انتظار معالجة رسالة إلقاء تمرير طريقة.

نموذج جانب ضبط درجة إبقاء ثابت، لا من استدعاء جهة اختيار. متبادل مجاور Agent `send_message` أداة بداية نهاية استخدام Steer، فقط لديه متصفح شخص صنف مسار اختيار Queue أو Steer.

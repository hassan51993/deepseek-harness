---
description: "Target-neutral محادثة تركيب إعداد و متصفح shell: حدث و عرض سجل التسجيل، تدريجي جلسة binding، إدخال حالة،slot و مؤقت composer takeover."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-conversation

[English](README.md) | العربية

## عام وصف

`ui-conversation` يملك و target غير متصل Conversation تجميع و مشترك متصفح shell. هو إزالة استهلاك Session Controller `SessionEventLikeEntry` feed، عبر `ctx.uiConversation` كشف لا اعتماد React سجل التسجيل و تدريجي Session binding، و عبر `ctx.uiSession` توفير `useConversation`،`useInput` و `inputActions` معيار props. هو أيضا يملك حسب جلسة حفظ دائم صورة URL ذاكرة مؤقتة:`ctx.uiConversation.imageUrl(sessionId, attachment)` لـ كل مرفق عنصر تحليل واحد مرور جلسة تخويل متصفح URL، و مع Session binding تحرير بينما سحب إلغاء، لذلك كل Conversation target مشترك مرة `session.attachment` قراءة.Chat انتظار أداة جسم target يقع في مستقل حزمة، من كل منها حزمة تسجيل Definition، لقطة builder،View و renderer.

## دليل

- [Conversation تجميع](#conversation-assembly)
- [Shell و معيار props](#shell-and-standard-props)
- [مؤقت composer entry](#temporary-composer-entries)
- [تجربة النموذج](#model-experience)
- [معروف حد و مؤقت مؤقت أمر بند](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="conversation-assembly"></a>
## Conversation تجميع

`UiConversation.events` هو event Definition وحيد registry،`UiConversation.views` هو target snapshot builder وحيد registry. اثنان من كل رفض تكرار key، إبقاء تسجيل ترتيب، إرجاع قوة انتظار disposer، و في contribution roster تغير وقت إعادة بناء قائم binding.`UiConversation.binding(bindingOrSessionId)` لـ حالي Session Controller binding إرجاع identity مستقر Conversation binding، لن آخر فتح حدث مصدر.

مهايئ يأخذ كل `SessionEventLikeEntry` مباشر تسليم إعطاء assembler. خارج طبقة `type` منطقة قسم حمل دائم حدث و Client-only transient event، داخلي `event` فإن موحد واحد عام `type`،`seq`،`time` و `data`؛Definition استقبال هذا عدد داخلي `SessionEventLike`.replacement window يمكن يتضمن اثنان نوع entry، تاريخ prepend يحمل حمل دائم entry، فوري append فإن يمكن يحمل مهمة واحد نوع. اثنان نوع حدث كل استخدام Definition نفس مجموعة `match` و `update` طريقة،`start` فقط استقبال حمل دائم event،assembler سوف رفض transient start. لا إزالة استهلاك Assistant delta Definition مقابل `assistant/live-chunk` إرجاع `null`.replace window أو revision قطع ملف من كامل قد تحميل نافذة إعادة بناء؛ وصل متابعة revision append،prepend و Assistant settlement استخدام زيادة كمية تجميع.settlement فقط حذف أداة اسم attempt transient match، تطبيق اختياري حمل دائم entry، و إعادة وضع تلقي أثر Context و ذلك dependent، لا استبدال غير متصل target node.assembler يملك Context مطابقة،Turn/Step location،target node شيء تحويل،target activity و مستقر target source.`ConversationSnapshot` فقط يتضمن و target غير متصل View و active-target واقع؛Session lifecycle حالة ما زال يخص `SessionSnapshot`.

shell اختيار تحليل خروج target أو target source استلام إلى أول عدد subscriber وقت، هذا target دخول active حالة.assembler من حالي Context مقابل هو تنفيذ مرة replace، و جعل هو مشاركة و لاحق زيادة كمية flush؛ إنشاء source لن تنشيط target، إلغاء حجز قراءة أيضا لن توقف استخدام target.

target package عبر declaration merge توسيع snapshot و Location data map، مجددا استدعاء `ctx.uiConversation.events.register(...)` و `ctx.uiConversation.views.register(...)`.target عبر `ctx.uiConversation.binding(binding).target(targetId)` قراءة ذلك Session-owned source. تسجيل يخص Cordis effect، إرجاع disposer من نفس عدد registry إزالة contribution. مشترك طلب فحص خدمة في كل target:`ctx.uiConversation.inspectSystemPrompt(previous, event)` سوف نظام رسالة و موضع استبدال حل تفسير لـ غير ممكن تغيير قد تحميل surface حالة. هو حسب surface ترتيب اختيار الأكثر بعد واحد غير فارغ تخزين نشط نظام عقدة، لـ وصل متابعة إعادة كتابة فقط إبقاء تخزين نشط استبدال موضع؛ لقاء إلى لم بناء قيام بحث جذب أكثر مبكر طرف نقطة بعد، نص التوجيه إبقاء غير ممكن استخدام، مباشر إلى نحو قبل تكملة صفحة إعادة تشغيل توفير ذلك ترتيب.target ذاتي لديه Definition مستقل إبقاء تاريخ بطاقة.`ctx.uiConversation.inspectRequestPrompt(previous, header, system)` أصل حسب هذا صالح نص التوجيه تصنيف طلب تغيير؛ عادي رسالة و تدفق صيغة قسم قطعة بلا حاجة معالجة نظام حالة.

<a id="shell-and-standard-props"></a>
## Shell و معيار props

مشترك صورة إدراج مجرى خاصية سوف عرض اختيار و حفظ دائم مرجع قسم فتح:`thumbnail` طلب كامل تقليص وضع مرفق عنصر قائمة تقليص اختصار رسم،`compact` طلب قطع قص صورة جهة كتلة. كل ورقة صورة يمكن عبر اختياري `label` توفير بلا عائق عائق عرض اسم؛ تحميل و ذاكرة مؤقتة معرف ما زال استخدام أصلي مرفق عنصر مرجع.[ui-attachment](../ui-attachment/README.ar.md) مسؤول تصيير و مصباح صندوق.

سياق احتلال استخدام حسب زر في إدخال بطاقة تحت جهة، جلسة موحد حساب يمين جانب عرض دائرة حلقة و مئة قسم مقارنة. نقر حسب زر يمكن في نظر فتحة داخل وجه لوح فحص نظر token بنية صار، لا يوجد موحد حساب بند وقت وجه لوح أيضا لن تجاوز حد؛ سياق استخدام كمية و سعة كمية بعد غير ممكن استخدام وقت، حسب زر إبقاء إخفاء.

إدخال إطار تسجيل «ملف» أمر حركة عمل، مسؤول ذلك عنوان، متاح صفة و أصلي ملف اختيار جهاز عودة ضبط. قائمة مفرد متاح صفة و فعلي استدعاء كل قراءة قد تركيب إدخال إطار حالي مرفق عنصر استقبال سياسة. إدخال إطار إزالة أو قفل تحديد بعد هذا حركة عمل غير ممكن استخدام، إضافة dispose(مورد تحرير) وقت إزالة تسجيل. عودة ضبط ربط إبقاء في إدخال وحدة داخلي.

`SessionInputShell` عبر خاص [DraftEditorRuntime](src/client/input/editor/runtime.ts) لـ كل Session يحتفظ واحد Lexical editor، معا إبقاء إيداع، مرفق عنصر اختيار و استعادة قرار.[DraftEditor](src/client/input/editor/DraftEditor.tsx) عرض استعارة استخدام editor؛InputBar إبقاء خطاف و refs، و عبر [view-binding](src/client/input/editor/view-binding.ts) تثبيت DOM سلوك. تحرير جهاز نوع يقع في [draft-editor.ts](src/client/contract/draft-editor.ts) ، مشترك إدخال و إيداع نوع يقع في [input.ts](src/client/contract/input.ts). هذا واحد تفكيك قسم لا دعم حمل نفس Session معا تركيب كثير عدد يمكن تحرير root؛[اثنان مرحلة مقطع عزل رفع سجل](../../../.agents/notes/proposed/architecture/2026-09-14-composer-model-and-draft-editor.ar.md) تعريف باق بقية عمل.

قد إقرار قيادة أمر في فقط حذف معامل و نهاية ذيل قسم فصل فارغ إطار وقت إبقاء هوية و عال مضيء، تعديل أمر اسم عندئذ سوف تحرير إقرار قيادة. كل أمر و لغة استخدام نفسه قاعدة، يشمل `/goal`،`/هدف`،`/plan` و `/حساب تخطيط`. إدخال قاعدة تركيب إدخال خلال، أمر تلميح و عادي احتلال موضع نص حرف حمل متابعة إخفاء، مباشر إلى تحرير جهاز إيداع نهائي نص حرف كما مقابل إدخال لـ فارغ وقت عندئذ إعادة عرض.

مساحة العمل اختيار استخدام `uiWorkspace.openWorkspace` دقيق تجهيز هدف و إيداع تنقل. مسودة مسودة نص حرف و مرفق عنصر فقط في هذا طلب ما زال لـ حالي طلب وقت، عبر هو تزامن دقيق تجهيز عودة ضبط نقل نقل؛ لاحق تنقل أو كل من تحرير سوف إبقاء أصل مسودة مسودة.

هذه الحزمة احتلال حسب root أثر مجال `main` في `conversation` key. ذلك `main.conversation` shell سوف strict Session Header إبقاء في optional-Session `conversation.content` Component Factory خارج.Factory يملك مشترك متن و Composer، عبر ذلك معيار Hook قراءة حالي Session، و عام strict-Session `views` و root-scoped `widthControls` اثنان عدد نطاق جزء موضع. افتراضي adapter تصيير قائم `conversation.session` entry، رئيسي occurrence اختيار عرض درجة سحب جر بند؛ تضمين دخول صيغة occurrence يمكن استبدال `views`، حذف سحب جر بند، كما لا تصيير رئيسي Header.`ctx.uiSession.provide()` من نفس عدد Session binding شيء تحويل Conversation و input source، و سوف `inputActions` بصفة مستقر معيار prop توفير.

blank Session إبقاء header leading و corner تحكم عنصر، يشمل يمين جانب شريط توسيع مدخل، معا إخفاء عنوان،actions،utilities و View tabs. اختيار Workspace سوف إنشاء هذه تحكم عنصر الذي يحتاج Session، بلا حاجة أولا إرسال رسالة. لا يوجد اختيار في Session وقت،strict header لا تركيب. جانب شريط كل مدخل ما زال التزام دوران ذاته بيانات و تنفيذ بيئة اشتراط.

View اختيار قاعدة ثابت: صالح كما قد تسجيل حفظ دائم اختيار أولوية، ذلك مرة هو قد تسجيل `chat`، لا فإن لا تصيير View؛ أبدا اختيار رقم واحد قد تسجيل View.Shell phase فقط تركيب Session lifecycle و active-target set، لا قراءة أي target-specific لقطة.

Session أول مرة ربط أو ذاكرة مؤقتة Session يصبح current وقت،shell سوف في تصيير قبل قراءة حفظ دائم View انحراف جيد، تنشيط قد تسجيل انحراف جيد View أو Chat fallback، و في لاحق tab أو focus اختيار كتابة store قبل أولا تنشيط مقابل target.blank Session ما زال لا تصيير `conversation.view` slot؛ لم اختيار في target لن تنشيط.

رئيسي occurrence نشط وثب transcript فقط في لم يتم محتوى تغطية اثنان جانب خندق مجرى في توفير متن عرض درجة سحب جر بند؛ تضمين دخول صيغة occurrence حذف هذه سحب جر بند.View إذا رسم صنع دخول خندق مجرى، فقط سوف أداة جسم مرئي عنصر عنصر رفع إلى سحب جر بند فوق جهة؛ نفاذ واضح كل عرض حزمة تركيب طبقة إبقاء في تحت جهة، لن احتلال استخدام فارغ أبيض خندق مجرى. هذا قاعدة اشتراط هذا عنصر عنصر و Conversation body بين لا يستطيع جذب دخول في بين كومة تراكم سياق؛ متصفح مشهد ثابت تسليم Chromium سلوك.Chat سوف هذا قاعدة لأجل جدول إطار عنصر عنصر، ذلك حد تحديد في قراءة قراءة صف داخل أداة بطاقة بلا حاجة رفع عال طبقة درجة. إشارة إبرة يقع في سحب جر بند فوق وقت، تدحرج جولة ما زال سوف تمرير transcript،Ctrl+تدحرج جولة فإن إبقاء لـ متصفح تقليص وضع يد اتجاه. لصق ركود composer لحظة معنى يملك كامل قاع جزء منطقة حمل، هذا منطقة مجال لا هو عرض درجة ضبط كامل هدف؛ قد التقاط سحب جر سوف سوف إشارة عرض خط رفع عال إلى رخو فتح لـ توقف ([قرار](../../../.agents/notes/implemented/bug-fix/2026-09-14-transcript-width-handle-layering.ar.md)).

معتاد إقامة composer في بلا Session و لديه Session بين إبقاء تركيب. إدخال فارغ أبيض محرف سوف إخفاء احتلال موضع تلميح؛ لا يوجد مرفق عنصر صاف فارغ أبيض مسودة مسودة لا يمكن إرسال. بلا Session وقت، نفس عدد تحرير جهاز جدول وجه إبقاء inert،Workspace picker اتصال blank Session. هذا جدول وجه هو shell كل Lexical تحرير جهاز: مرجع chip هو يحمل owner تسلسل تحويل هوية أصل فرعي decorator عقدة (إيداع وقت مرور owner codec توسيع) ، قد إقرار قيادة slash command إبقاء لـ حمل مثال صيغة سطر أول نص، ملف مشبك نص مرجع بـ رسم علامة بادئة يحمل ملف مشبك رسم شكل، مسودة مسودة قص لصق لوح إسقاط مرآة مثل إلى تدريجي Session Conversation store.QueueDock مباشر من Session `inbox` إسقاط قراءة `next-turn`، يتضمن من بارد حالة استعادة رسالة.Queue عملية عبر scoped `ctx.conversation` service بحث عنوان دقيق تأكيد queue occurrence؛queue معاينة مرور `ui-primitives` مشترك سطر داخل مرجع إسقاط تصيير قد إرسال نص (wire جلسة شكل صيغة طي لـ ذلك وسم) ، و حسب أصلي مرفق عنصر ترتيب عرض محلي أو حفظ دائم صورة و ملف. صورة استخدام تقليص اختصار رسم، ملف استخدام ضيق تجميع اسم و كبير صغير بطاقة. تحرير حالة عرض حرف وجه إرسال نص، حفظ دائم تقليص اختصار رسم عبر جلسة صورة URL ذاكرة مؤقتة تحليل. كثيف مشغول وقت Enter سلوك حفظ في Host-backed `ui-conversation` settings namespace. composer مفتاح قرص خريطة مرور مائل عمود خط الإنتاج قطع قرار إطلاق قائمة مفرد حسب مفتاح——Tab تأكيد عال مضيء تكملة كل بند (يمكن تحت حفر بند فإن تحت حفر) ،Escape و Shift+Tab مغادرة فتح قائمة مفرد كما لا اختيار تحديد——ذلك بقية حسب مفتاح تسليم إعطاء تحرير جهاز ذاته. وصل إدارة مفتاح قرص طفو طبقة عبر `SessionInput.focus()` يأخذ مفتاح قرص أيضا عودة قدوم، هذا مسار مشي Lexical ذاتي ذات focus، لذلك ضوء علامة عودة إلى مسودة مسودة أصل قدوم موضع بينما لا هو فتح رأس.

افتراضي إرسال اعتماد مرح مراقبة إيداع:Enter في نفس أمر خدمة داخل صاف فارغ مسودة مسودة،occurrence جدول و سحب إلغاء تاريخ،composer إبقاء `plain`، إرسال بصفة detached attempt تشغيل، إرسال خلال يمكن متابعة إدخال و إيداع.`sendSession` في تسلسل تحويل قبل استخدام إلقاء تمرير نمط تسجيل Session إيداع عودة إظهار (`session.beginSubmission`) ، و في `pendingSubmissions` في إبقاء صورة و ملف اختيار ترتيب؛Session أصل حسب هذا نمط و حالي تشغيل حالة دفع توجيه موضع، لذلك فارغ خامل إرسال دخول transcript(نص سجل) ، كثيف مشغول وقت Queue دخول QueueDock، كثيف مشغول وقت Steer دخول pending-steering منطقة مجال. مع بعد يجعل خروج واحد لقطة، صورة مرور متصفح أصلي `FileReader` data-URL مسار تحرير رمز، ملف فإن مرجع قد مؤقت تخزين سند إثبات. أمر إيداع أيضا استخدام نفس سند إثبات يمثل عام ملف، لذلك إرسال `/goal` أو `/plan` وقت لن مجددا مرة قراءة هذه متصفح ملف. نص التوجيه إعادة استخدام إيداع `requestId`؛queue أو تاريخ بـ نفس `rpcId` يتم مراقبة بعد، عودة إظهار فقط تراجع راحة مرة. كثير عدد تزامن إرسال فشل وقت، في مستخدم تحرير أيضا أصل محتوى قبل حسب إيداع ترتيب دمج أيضا أصل؛ أمر إيداع إبقاء تجميد ربط `submitting` مرحلة مقطع.Detached attempt يحتفظ مرفق عنصر id، مباشر إلى admission إتمام أو Session scope إلغاء تدمير. عودة إظهار بـ observed تراجع راحة وقت،durable صورة ذاكرة مؤقتة قيام أي عام كل معاينة URL، قراءة admitted مرفق عنصر بعد استخدام مواصفة تحويل URL استبدال معاينة، و في كل URL إيقاف استخدام بعد سحب إلغاء، معا تحرير ملف بطاقة. اختيار في عام ملف دخول نفس عدد أولا دخول أولا خروج خلفية فوق نقل طابور صف؛`maxConcurrentFileUploads` افتراضي سماح اثنان عدد Worker transport معا تشغيل،Conversation خدمة في تبديل Session وقت متابعة يحتفظ ترتيب طابور و تشغيل في نقل عملية و بايت دخول درجة، إزالة مسودة مسودة سوف قفز مرور ترتيب طابور في نقل أو في توقف صحيح في تشغيل نقل.continuable فرعي بديل إدارة منع استخدام مرفق عنصر مدخل، أيضا لا إنشاء محلي عودة إظهار، لأن ذلك transport لا إبقاء متصفح request id.

ترتيب طابور إيداع محلي عودة إظهار في منع استخدام تحرير، حذف، إدراج كلام حسب زر جانب عرض “إرسال في…” ؛ طي بعد طابور صف في عنوان شريط إبقاء إرسال حالة. مطابقة Host طابور صف سطر استبدال عودة إظهار بعد، كل عملية حسب أصل لديه صاف نص محتوى و تشغيل حالة اشتراط تفعيل. فقط استلام إلى نص التوجيه تأكيد لن تفعيل طابور صف عملية. إيداع فشل سوف إزالة عودة إظهار و عرض خطأ؛ إدخال إطار لـ فارغ أو ما زال إبقاء فوق مرة تلقائي استعادة محتوى وقت،composer استعادة فشل مسودة مسودة، إبقاء مستخدم مع بعد إدخال نص حرف.

Send و Stop حسب زر منع استخدام وقت لا عرض تلميح هواء فقاعة، جولة انتهاء بعد من Stop تبديل صار منع استخدام Send حسب زر أيضا التزام دوران هذا قاعدة. عادي composer وقت التشغيل، إذا مسودة مسودة لـ فارغ أو إدخال غير ممكن استخدام، رئيسي إشارة إبرة عملية إبقاء لـ Stop. يمكن إيداع نص حرف أو مرفق عنصر سوف يأخذ نفس موضع تبديل لـ Send؛ صاف فارغ أو نجاح إيداع مسودة مسودة بعد استعادة Stop. كثيف مشغول حالة Enter ضبط لـ عادي Session و يمكن متابعة child اختيار Queue أو Steer إلقاء تمرير، تشغيل في Send حسب زر حسب plain Enter تحليل خروج نفس نمط إلقاء تمرير؛ عند هو في عادي رسالة مسودة مسودة فوق متاح (لا يوجد انتظار فوق نقل ملف) وقت، ذلك وسم بـ هذا نمط تسمية (ترتيب طابور إرسال أو إدراج كلام إرسال) ، لذلك هذا ضبط معا قيد Enter و حسب زر، بينما Cmd/Ctrl+Enter ما زال استخدام آخر نمط؛ فارغ خامل جلسة، فارغ مسودة مسودة و `/` أمر سطر إبقاء عادي Send وسم ([قرار](../../../.agents/notes/implemented/bug-fix/2026-09-04-busy-send-button-follows-enter-setting.ar.md)). هو جمع QueueDock سطر مشترك Edit،Remove و Steer، فارغ مسودة مسودة أيضا مشترك steer-all تركيب مفتاح.One-shot child متابعة فقط قراءة.Plan Mode و active goal لا تغيير مرفق عنصر مدخل. يمكن متابعة child إبقاء مستقل Send و Stop عملية، لكن لا توفير «ملف» قائمة مفرد بند، لصق لصق أو سحب وضع مدخل؛parent مغادرة خط وقت،Send و composer يد اتجاه قفل تحديد، لكن في خط inbox QueueDock تحكم ما زال يمكن استخدام ([قرار](../../../.agents/notes/archived/bug-fix/2026-08-20-running-draft-primary-send.md) ،[inbox تحكم](../../../.agents/notes/implemented/feature/2026-08-27-continuable-subagent-human-inbox-control.ar.md)).

ملف وسم و يمكن تحرير skill مرجع مشترك استخدام تغطية كامل مرجع معلق توقف خلف مشهد، و تتبع مع إدخال إطار سطر عال و نص حرف أساس خط. أول مرة نقر قيام أي من قد تسجيل مرجع مصدر مسؤول فتح معاينة، يشمل مزدوج ضرب تسلسل رقم مرة نقر. لاحق نقر إبقاء أصلي نص اختيار سلوك؛ قد لديه غير طي اختيار منطقة وقت، إشارة إبرة نقر لا فتح معاينة. معاينة لا تغيير مسودة مسودة، قص لصق لوح نص أو إيداع محتوى.

عند جلسة يتم أخرى كتابة جملة مقبض احتلال استخدام وقت، إرسال فشل toast تلميح مستخدم خروج أخرى صحيح في تشغيل DSH بعد إعادة محاولة.

<a id="temporary-composer-entries"></a>
## مؤقت composer entry

`conversation.composer` هو عام chain، ذلك كامل owner currency لـ:

```ts type-equiv
/** Owner values used to elect a composer takeover. */
interface ComposerChainProps {
  /** Current Session identity used by temporary business-owned entries. */
  sessionId: SessionId | undefined
  /** Current Session lifecycle state, absent without a selected Session. */
  session: SessionSnapshot | undefined
  /** Effective business-owned interaction awaiting the user in this Session. */
  pendingInteraction: SessionPendingInteraction | undefined
}
```

عمل خدمة حزمة فقط يمكن في واحد Remote waterfall request pending خلال تثبيت entry:

```tsx
import type { ComposerChainProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ChainSelect, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SessionId } from '@deepseek-ai/dsh-session/types'

interface Request {
  readonly sessionId: SessionId
}

type RequestComposerProps =
  PropsRuntime<'conversation.composer'> & { matched: Request }

const select: ChainSelect<ComposerChainProps, Request> = owner =>
  owner.sessionId === request.sessionId ? request : null

const dispose = ctx.slots.register(
  { name: 'conversation.composer', select },
  RequestComposer,
)

try {
  return await request.result
} finally {
  dispose()
}
```

selector يجب هو owner currency صاف دالة. غير null قيمة راجعة بصفة `matched` نقل إعطاء مكون؛`PropsRuntime<'conversation.composer'>` توفير معيار Session و global props.Chain ترتيب ما زال حسب `priority` رفع ترتيب، مجددا حسب تسجيل ترتيب؛ أول عدد إرجاع غير null selector نيل اختيار.Shell سوف في takeover تحت إبقاء افتراضي composer تركيب.Request حالة،listener،response encoding و أي request-specific child slot كل يخص عمل خدمة package، لا دخول `SessionSnapshot`، أيضا لا من core حزمة إعلان.

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن هذه الحزمة تصيير متصفح حالة، و عبر Session Controller API إرسال مستخدم تأكيد إيداع إدخال، بينما لا بنية صنع نموذج طلب.

#### KV Cache أثر

بلا؛Conversation تجميع و متصفح إدخال حالة لن تغيير مزود جانب prompt cache.

## معروف حد و مؤقت مؤقت أمر بند

<a id="known-limitations-and-deferred-work"></a>

- **فقط لديه قد تسجيل target يمكن تصيير**——حذف قد تسجيل `chat` انحراف جيد خارج،shell لحظة معنى لا توفير خفي صيغة fallback target.
- **Factory occurrence وراثة تصيير موضع Session**——`conversation.content` لا قبول مستقل بحث عنوان Session؛ هذا قدرة حاجة مفرد وحيد Session provider.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل.Conversation Definition،target builder و View قد من ذلك الذي تابع سجل التسجيل و Slot ledger تحقق.

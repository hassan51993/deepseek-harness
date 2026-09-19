# Agent Note: Web client Agent-scope مقابل انتظار نموذج و توفير عدد عبر طريق (agents/scope / blank إعادة استخدام / provide)

Status: implemented

[English](2026-07-25-web-client-session-scope-and-provide-channel.md) | العربية

> نطاق:client Agent scope(actx) و تحديد نحو حدث،client/host فعلي جسم تحويل مقابل انتظار نموذج، فارغ جلسة blank موضع و إعادة استخدام (`connectWorkspace`) ، تدريجي جلسة توفير عدد عبر طريق (`sessions.provide`) ، و تحمل تحميل هذه قدرة host wire صغير عنصر (summary `blank` صف،`host/session-added` لقطة حقل،`host/commands-changed` لقطة). إدخال حالة آلة و slash إدارة خط رؤية[إدخال حالة آلة note](../../archived/architecture/2026-07-25-web-input-machine-and-slash-pipeline.md) ؛ أمر عمل خدمة وجه رؤية[أمر عمل خدمة وجه note](../../archived/architecture/2026-07-25-web-command-surfaces-and-assembly.md).

## مشكلة

web client فقط لديه واحد ورقة عام جلسة وجه:slot الكل من أصل سياق تصيير، إضافة أخذ لا إلى «حالي هو أي عدد agent/جلسة» لغة بيئة؛draft مرجعي فرعي هذا دفن في Session كائن داخل، أي يلزم مشاركة و إدخال إضافة كل بلا موضع تحت يد. يلزم دعم دعم أمر/إدخال جسم نظام، منصة طبقة يجب أولا عودة جواب:

- جلسة تفاعل حالة (قائمة مفرد،popup، مسودة مسودة، في طريق طلب) عودة من يحتفظ، مزدوج جلسة مثل أي بنية صفة عزل؛
- «جلسة جديدة» في host فعلي جسم وجود قبل هو ماذا——client هل يجب لـ هو سند فارغ إنشاء مستقل دورة الحياة؛
- جلسة scope مكون مثل أي «ذاتي ذات أخذ جلسة بيانات» ، بينما لا هو طبقة طبقة تحت نقل props؛
- مستخدم وضع ترك جلسة جديدة في host جانب إبقاء تحت ماذا، من من عودة استلام.

صلب قيد:host هو وحيد حق مصدر؛ واحد قطع تسجيل مشي `ctx.effect` disposer؛scope آلية و host Agent scope هيكل بنية متسق؛ نموذج مرئي ⟺ قد دخول جلسة سجل.

## قرار

[Client Session مرجع](2026-09-15-client-session-references.ar.md) الآن قد تعريف مرجع كل دورة الحياة و Provider تحديد موضع. هذا Note إبقاء blank Session و استلام رعاية دلالة إدارة من، و وصف هو جمع حالي تنفيذ.

### مقابل انتظار نموذج:client و host نفس أصل حالة محور

host جانب `session.create(workspaceId)` واحد جسم إنتاج خروج Session + Agent + cwd(بصفة غير ممكن تفكيك قسم أصل فرعي كامل جسم) ؛client جانب حينئذ هو هذا مرة خروج توليد مرآة مثل——جلسة سطر دخول list mirror لحظة بين،client لـ هو صب Agent scope(actx + provide + إدخال وجه كل طقم تعليق فوق):

- جلسة هوية ذاتي خروج توليد أي لـ host حق ذات:sessionId من `session.create` استجابة / `host/session-added` لقطة حمل قدوم،client جانب واحد قطع بحث عنوان (scope tag،slot store مفتاح،RPC عنوان) استخدام كل هو نفس عدد id.
- فعلي جسم تحويل وقت نقطة = مستخدم اختيار تحديد Workspace(cwd تحديد) لحظة بين:client عند ساحة ضبط `session.create({workspaceId})`، أخذ إلى كامل فعلي جسم.
- «New Session كما لم اختيار workspace» هو**صاف عرض حالة**(واحد تنقل موضع) ، لا مقابل أي جلسة/scope فعلي جسم؛ اختيار تحديد قبل composer كامل جسم قفل ميت (بلا slash، بلا صاف نص).
- «فارغ جلسة» حينئذ هو واحد سجل أيضا فارغ حال عادي فعلي جسم تحويل جلسة؛ مقابل host فوق كل Agent-scope إضافة (goal/plan/skill(تقنية قدرة)/…) هو و أي جلسة بلا مختلف،slash/plan يوم لكن كل نشط.

### Agent scope:actx هو client جانب cordis عالم حد وحيد جلسة تحميل جسم

وقت التشغيل `agents/scope.ts` و host `dsh-scope` آلية طبقة متسق (fiber + tag + filter مرور ترشيح؛ لا value-import:host حزمة يحمل scoped-events `Events` merge، دخول client program اصطدام Context merge):

- `createScope(ctx, key)`:no-op إضافة fiber + `extend({[kScope]: key, [Context.filter]: …})`——filter مباشر إقامة actx:untagged listener عام يمكن استلام،tagged فقط استلام هذا scope.
- إرسال إرسال حينئذ هو cordis أصل لغة،thisArg = actx ذاته:`actx.bail(actx, event, req)` / `actx.emit(actx, event, payload)`.
- `Session.bindScope(actx)`:resolve صب scope وقت مفرد مرة إعداد مقابل (تكرار ربط throw؛dropScope unbind) ، مرآة مثل host `Agent.loopCtx`——Session استخدام هو ذاتي سطر إرسال إرسال scoped حدث.actx→Session عكس نحو مشي `sessions.sessionOf(actx)` واحد قفز (مرآة مثل host إضافة `agent.session` استخدام قاعدة).

و host dsh-scope متعمد قسم اختلاف ثلاثة بند:

- filter إقامة actx ذاته بينما غير مستقل carrier:host حزمة تركيب طبقة حماية هو «عمل خدمة Agent subject و scope key لا عائم نقل»(host حدث أول مشاركة حقن Agent هذا جسم) ،client حدث payload فقط حمل id، بلا subject يمكن حماية.
- key استخدام صنف لوحة `SessionId` قيمة مقارنة مقارنة بينما غير كائن هوية:host داخل agent.id === جلسة id(1:1 نفس محور) ،agent هوية مباشر إعادة استخدام `SessionId` صنف لوحة،client scope هوية أي wire id.
- client هو **Agent هوية** scope بينما غير نشط كائن scope:cold جلسة مدة host Agent كائن قد dispose(مورد تحرير) بينما client actx تخزين نشط (نظر بري داخل)——هوية محور صارم إطار مقابل انتظار، كائن بارد حار متعمد مختلف خطوة.

id→ctx تبديل ركوب فقط سماح ثلاثة صنف موضع (عمل خدمة مزود دائم لا تبديل ركوب):

- slot inject عمل مصنع:ctx لا دخول تصيير طبقة،slot إطار هيكل تسليم إعطاء مكون هوية حينئذ هو sessionId، مرور خدمة map تبديل عودة كائن/controller.
- root تنسيق ضبط خدمة ذاتي بحث عنوان: من إسقاط sessionId مرور `sessions.scope(id)` بحث عودة actx.
- root untagged listener: حسب payload sessionId فحص ذاتي لديه store.

### scope دورة الحياة: تعليق اعتماد صريح مرجع

Session نسخة و scope نفس دورة الحياة؛catalog فقط تقرير إبلاغ يمكن اكتشاف صفة، لا يحتفظ generation:

- خروج توليد = رقم مرة صريح استدعاء `sessions.retain(target, options)`؛ هو تزامن إرجاع reference، و في تاريخ حينئذ خيط قبل صب صنع Session binding و scope.
- الأكثر بعد واحد نسخة reference تحرير وقت،Controller أولا سحب تحت تأكيد قطع generation، مجددا تفكيك حذف ذلك Session نسخة،scope fiber(درجة ربط تعليق في actx فوق واحد قطع مستهلك) و جلسة مفتاح تحكم slot store. ما زال لديه reference وقت،catalog إزالة لن انتهاء generation.
- إعادة فتح = لاحق retain كسول صفة إعادة بناء generation، و عبر `reference.ready` كشف تاريخ حينئذ خيط نتيجة (Host Session سجل هو حمل دائم حق متبادل).
- متروك إبقاء TODO:approval/question لقطة لا دخول history، عبر prune غير ممكن استعادة (manager درجة pendingBuffers فقط تغطية «من لم نسخة تحويل» نافذة).

### blank موضع: فارغ جلسة مرئي إسقاط، تحويل صحيح و إعادة استخدام

«فعلي جسم تحويل لكن بلا أول بند نص التوجيه» جلسة مرور summary إرسال توليد موضع `blank` معالجة إدارة (إرسال توليد صف بينما غير header حقل،SessionHeader إبقاء غير ممكن تغيير):

- host حكم حسب:`session.seq === 0`(صفر سجل حدث = بعد بلا مستخدم رسالة).live جلسة `summarize()` داخل تخزين مباشر قراءة؛cold جلسة ثابت `false`——JSONL provider lazy-create اتفاق حفظ إثبات never-appended جلسة لا دخول `persistence.list()`، الذي بـ blank من لا سقوط قرص.
- wire تحمل تحميل اثنان موضع:`SessionSummary.blank` لا بد ملء صف؛`host/session-added` لقطة لا بد ملء `blank` حقل (إنشاء وقت ثابت true، توفير آخر tab حسب نفس فارغ جلسة حالة دخول مرآة مثل).
- client مرآة مثل فقط خفض لا رفع (مفرد ضبط) ، ثلاثة مصدر قلب تحويل، الكل إعادة استخدام قائم wire إشارة:
  - إرسال جهة محلي: أول مرة `prompt()` **نجاح استجابة**قلب false(تلقي إدارة أي إثبات مستخدم رسالة قد دخول host سجل——هذا نقطة قلب تحويل هو تأكيد إثبات بينما غير مرح مراقبة؛`onEngaged` تزامن تحديث قائمة مرآة مثل، حالي `New Session` سطر أصل أرض تحويل لـ عادي عنوان، لا إضافة جديدة قائمة سطر). أول بند نص التوجيه يتم رفض فإن جلسة إبقاء blank: و host مرجعي مقابل متساو، متابعة عرض لـ `New Session`، في ما زال لـ هذا مساحة العمل عضو وقت إبقاء connectWorkspace إعادة استخدام مورد إطار.
  - أخرى طرف:`host/session-status (running:true)` لقطة قلب تحويل——blank جلسة من لا running، أول مرة running لا بد لكن قد غير blank؛
  - إعادة وصل مقابل متساو:`session.list` summary.blank هو مرجعي، خطأ مرور لقطة طرف تحت مرة سحب أخذ ذاتي لكن مقابل متساو؛ قديم قديم blank:true لا يستطيع يأخذ قد تحويل صحيح جلسة إعادة علامة عودة blank.
- قائمة سجل قاعدة:store إبقاء الكل سطر؛Workspace browser قسم مجموعة، مستو فرش، بحث و حساب عدد مشترك استخدام نفس مرئي إسقاط——كل غير blank جلسة كل عرض،blank جلسة فقط عرض من `mainView` مصدر يحتفظ واحد سطر، و قوي صنع عنوان لـ `New Session`. تبديل Workspace بعد، قديم blank فعلي جسم ما زال في مرآة مثل في لكن من قائمة إخفاء، هدف Workspace رئيسي blank عرض؛ لذلك مستخدم مرئي وجه عام حتى كثير واحد بند blank سطر.
- ناقص إبقاء حساب صفر GC: تحديث جديد بعد blank جلسة حمل موضع عودة قدوم، تحت مرة نفس workspace كما ما زال لـ عضو وقت إعادة استخدام، عادي مفرد طرف مسار جعل كل workspace حتى كثير إبقاء واحد؛host إعادة بدء بعد blank بلا قرص أثر ذاتي لكن تبخر إرسال؛ كثير tab تنافس حالة كثير خروج فارغ قشرة فقط سوف يصبح غير current إخفاء سطر، لاحق إعادة استخدام إزالة تحويل، لا فعل تنسيق ضبط.

### connectWorkspace:New Session وحيد مدخل

`workspaces.connectWorkspace(workspaceId): Promise<SessionId>`(ملكية WorkspaceRuntime——هو معا يحتفظ workspace مواصفة path و sessions مرجع):

- إعادة استخدام ذراع:list mirror في بحث `blank && cwd == workspace.path && sessionIds.includes(id)`——host ذاتي ذات عضو قاعدة، أبدا فقط حسب cwd. لا يوجد حساب مستخدم مجرى موضع cwd مطابقة (CLI(أمر سطر واجهة)/TUI في host cwd إنشاء جلسة، أو قد حذف/إعادة بناء تسجيل) سوف فتح واحد أي قسم مجموعة جدول وجه كل لا يمكن عرض في هذا مساحة العمل تحت جلسة، لذلك سقوط إلى جديد بناء ذراع (رؤية[عضو إعادة استخدام إصلاح](../../archived/bug-fix/2026-08-05-workspace-blank-session-reuse-membership.md)) ؛ أمر في مباشر إرجاع هذا id، لا جديد بناء.
- جديد بناء ذراع: لم أمر في فإن `session.create({workspaceId})`، إرجاع جديد id.
- لم معرفة workspaceId fail loud(لا ساكن صامت إنشاء إلى آخر موضع).
- تحليل حفظ إثبات (اثنان ذراع نفس اتفاق):promise resolve وقت إرجاع id قد في list store. عرض owner مع بعد تزامن retain، لذلك draft نقل تشغيل جهة يمكن في تاريخ حينئذ خيط قبل عبر هذا binding كتابة نص، بلا حاجة انتظار notifier flush.
- استدعاء جهة أخذ id تثبيت واحد نسخة `mainView` reference؛ أول بند نص التوجيه إرسال حينئذ هو عادي `session.prompt`——Session هذا قدوم حينئذ في، فشل أي عادي نص التوجيه فشل،draft نص أيضا في machine داخل، إعادة محاولة أي مجددا مرة إرسال.
- عام New Session حسب زر افتراضي أخذ `recentWorkspaceId`: أولا مقارنة مقارنة كل Workspace داخل Session الأكثر جديد `updatedAt`، بلا Session وقت رجوع Workspace `createdAt`، نفس قيمة إبقاء Host ترتيب؛ فقط لديه تماما لا يوجد Workspace وقت عندئذ تحرير رئيسي عرض reference، دخول بلا Session عرض.Workspace قسم مجموعة داخل إنشاء حركة عمل ما زال صريح أمر في هذا Workspace.
- وقت التشغيل بدء وقت حجز قراءة أول مرة كامل أساس خط: إذا قد لديه استعادة نجاح current جلسة فإن إبقاء لا حركة، لا فإن تلقائي `connectWorkspace(recentWorkspaceId)` و open إرجاع blank جلسة. هذا سياسة فقط تسوية مرة؛ بعد مستخدم رئيسي حركة clear لن مجددا مرة يتم تلقائي اختيار تغطية، اتصال فشل فإن انتظار تحت مرة أساس خط إسقاط إعادة محاولة.
- blank Hero في تعديل اختيار Workspace أيضا مشي `connectWorkspace`؛ إذا هدف id و رئيسي عرض id مختلف،`ui-workspace` أولا retain هدف، عبر preparation callback نقل تشغيل حالي input machine غير فارغ draft، مجددا إصدار جديد رئيسي reference. قديم blank فعلي جسم لا حذف، فقط بسبب ذلك `mainView` reference يتم تحرير بينما من قائمة إخفاء.

### تدريجي جلسة توفير عدد:`uiSession.provide` معيار عنصر عبر طريق

Session slot مكون «ذاتي ذات أخذ Session بيانات» وحيد توفير عدد مسار. إضافة بـ ساكن حالة وصف رمز `uiSession.provide({hooks, props, resolve})` إعلان ثابت مفتاح جدول (إعادة اسم key تسجيل وقت throw) ،`resolve(binding)` في تحديد binding تحت شيء تحويل قيمة و مع ذلك scope تفكيك؛ui-renderer `standardKit` موحد واحد حلقة يأخذ hooks إطار ربط صار `use<Name>` اختيار جهاز خطاف (`observableHook`→uSES، منع tearing) ،props إطار أصل مثال نفاذ نقل.

slot scope هو إغلاق تجميع `root | session-maybe | session`:

- `root` فقط أخذ عام معيار عنصر، لا استقبال جلسة هوية أو توفير عدد.
- `session-maybe` بـ**استلام رعاية (adoption) هوية دلالة**وراثة الأكثر قريب `SessionProvider` binding: فارغ حالة خروج توليد تحويل ذات في هذا Provider رقم مرة استلام إلى binding وقت إبقاء React نسخة، هذا بعد Provider تبديل generation أو عودة إلى فارغ حالة وقت إعادة تعليق.Provider تبديل generation وقت، مكون محلي تدريجي Session حالة سوف صاف صفر. تبديل مرور مسار في، فقط لديه حفظ دائم Store قيمة قدرة نشط مرور generation تراجع راحة؛ فقط لديه آخر نسخة reference حفظ نشط هذا generation وقت،binding ذاتي لديه source عندئذ قدرة إبقاء. بلا binding وقت،`sessionId`،`useSession`/`useInput` نتيجة و `inputActions` متساو يمكن نقص حذف.Provider roster تغير سوف إعادة شيء تحويل قد تركيب binding، لكن لا تغيير ذلك identity؛ تدريجي entry استلام رعاية تسجيل حساب إقامة في renderer `SessionMaybeEntry`.
- `session` حفظ إثبات `sessionId`، كل خطاف source و props متساو وجود؛ كل صارم إطار entry خطأ حد بـ `sessionId` لـ key، تبديل جلسة سوف إعادة بناء هذا entry و ذلك جلسة store.

`conversation` هو ذلك owner `SessionProvider` تحت `session-maybe` معتاد إقامة خارج قشرة:`ConversationRoot`،HeroShell،Workspace picker،scrollport و composer stack، و overlay chain fallback خارج إطار، في بلا Session → blank Session تبديل في إبقاء React نسخة. اثنان عدد صارم إطار session entry فقط ملء دخول ثابت منطقة مجال، لا تغيير هذا شجرة أب درجة:`conversation.session.header` في scrollport فوق جهة تحمل تحميل breadcrumb/tab/action،`conversation.session` في ذلك داخلي تحمل تحميل view ring و draft mirror؛ اثنان من مشترك نفس عدد Session scope chat store.composer bar(`conversation.composer.bar`) ذاته أي لـ `session-maybe`: بلا Session وقت، ذلك machine faces و رسالة حركة عمل إبقاء كسول صفة، كامل ورقة وهمي خط بطاقة يمكن مرور إشارة إبرة فتح قائم Workspace picker، فقط قراءة textarea أيضا يمكن عبر Enter أو Space فتح.binding ظهور بعد نفس نسخة (يحتوي textarea) تحويل لـ live؛ ذلك بقية إدخال slot إبقاء صارم إطار `session`، في هذا قبل لا إرسال إرسال أي محتوى.blank → engaging/active InputBar لا بسبب phase قلب تحويل بينما إعادة بناء.

blank Session إبقاء header leading و corner slot، يجعل يمين جانب شريط توسيع مدخل انتظار تنقل تحكم عنصر في أول بند رسالة قبل يكفي استخدام. عنوان،actions،utilities و View tabs في blank phase في متابعة إخفاء.header ما زال اشتراط قد اختيار في Session؛Files و Terminal مدخل استخدام هذا Session مساحة العمل و تنفيذ خدمة، بلا حاجة قد لديه Turn سجل.

- وقت التشغيل داخل بناء رقم واحد بند:`'session'` خطاف——`useSession` ذاته مشي نفس آلية، بلا خاص حكم.
- Concurrent سجل قاعدة: تصيير مستو وجه فقط من hooks إطار قراءة (uSES متسق صفة حفظ إثبات) ؛props إطار عودة ضبط فقط في حدث handler فضاء استخدام؛ وصف رمز تحليل render-safe(قوة انتظار ذاكرة مؤقتة، ملغى ترك تصيير ناقص إبقاء من prune استلام جثة).
- رقم ثلاثة جهة مكون قيمة صفر اعتماد، نوع واحد سطر type-only import(declaration merging دخول `SessionStandardProps` / `SessionMaybeStandardProps`).

### إدخال إلقاء تمرير

- طابور صف دلالة:running لا قفل إدخال؛ عادي رسالة مرور `session.prompt {mode:'queue'}` ترتيب طابور، أمر دائم لا ترتيب طابور.

### host wire صغير عنصر

- summary `blank` صف و `host/session-added` لقطة `blank` حقل (رؤية فوق نص blank موضع).
- SSE(Server-Sent Events) لقطة `host/commands-changed`(صاف بطلان إشارة) ؛client توجيه لـ نوع حدث `commands/changed` و `connection/reset`(اتصال بديل بناء قيام بعد واسع بث،wire إرسال توليد ذاكرة مؤقتة واحد قاعدة نظر قديم حالة لـ قديم قديم). هذا commands لقطة و ذلك نوع تحويل client حدث بعد قدوم يتم «`commands/change` مرور `ctx.remote.$on` أصل مثال تحويل إرسال» يحل محل ([تحويل إرسال Remote حدث](2026-08-10-remote-event-delivery.ar.md)) ؛`connection/reset` ثابت؛ هذا بند قديم وصف «بطلان بينما غير فرق قسم» عقد نحو اعتماد لكن صار قيام.
- `command.list/execute`،`skills/list` واحد قاعدة `sessionId` مفرد عنوان (جلسة ثابت لديه Agent،`agentFor` استعادة دلالة الآن صار) ؛ أمر وجه سرد وصف رؤية[أمر عمل خدمة وجه note](../../archived/architecture/2026-07-25-web-command-surfaces-and-assembly.md).
- `session.create` طلب شكل حالة:workspaceId/cwd اثنان اختيار واحد + اختياري استدعاء جهة مسبق قسم إعداد sessionId(نفس id نفس cwd إعادة محاولة قوة انتظار، مختلف cwd تقرير `session-conflict`).

## اعتبار مرور بديل خطة

| ترك سجل | واحد سطر إدارة من |
|---|---|
| client-local Intent + materialize(published CAS / pendingPrompt attach أمر خدمة / before-create سلسلة) | client يتم إجبار نموذج محاكاة host ناقص قبل نصف مقطع توليد أمر، رعاية خروج published CAS،attach أمر خدمة، جزء إصدار واحد كتلة حالة آلة |
| host مسبق إبقاء ID(draft Map) | host فقط إقرار عدد رقم، حالة آلة أصل غلاف إبقاء في client |
| host draft Session(لديه Session بلا Agent) | كل فحص Agent host وجه كل يلزم لـ draft قسم تقاطع؛core يلزم إضافة جديدة `attachAgent` API + header cwd بعد كتابة |
| بلا cwd أولا ربط Agent(ungrouped) | header.cwd readonly«created in» ثابت صفة يتم دفع قلب + launch-dir فرعي أثر منتج حفرة |
| React Context طبقة طبقة نقل جلسة لغة بيئة | إضافة في host/client اثنان جانب ينبغي هو واحد قلب ذكاء نموذج؛scope آلية و host dsh-scope نفس بنية |
| `scopeTarget` carrier + دمج دمج إرسال إرسال جهاز (مرآة مثل host `agentEvents`) | host حزمة تركيب طبقة حماية هو «عمل خدمة Agent subject و scope key لا عائم نقل» ،client حدث بلا subject يمكن حماية؛filter إقامة actx + cordis أصل لغة تغطية الكل يحتاج طلب |
| Session لا حمل ctx(كائن طبقة cordis-free) | فقط لـ غربلة اختيار مفرد قياس لا جذب cordis بينما توليد أحمر خط، بديل قيمة هو contribute اثنان قفز عودة ضبط + متغير عام لديه حقل؛host Agent هذا حينئذ حمل loopCtx |
| Session نسخة معتاد إقامة (resident-instance) | host جلسة سجل أي حمل دائم حق متبادل؛ معتاد إقامة فقط لـ هوية سهل فائدة، و scope دورة الحياة خطأ موضع هو تكرار مختلط درجة لـ مصدر |
| مكون استلام wiring عودة ضبط حزمة (inject→props اثنان طبقة تحت نقل) | معيار عنصر عبر طريق يجعل مكون ذاتي أخذ؛ عام مشترك API استلام جمع لـ hooks + مستقر props |
| Hero بلا جلسة عرض و جلسة Conversation كامل دعم متبادل تبديل | أي جعل خارج طبقة layout ثابت،Hero،picker و composer فرعي شجرة ما زال سوف واحد بدء إعادة بناء، واجهة إنتاج كامل كتلة اهتزاز حركة |
| يجعل InputBar ذاته تغيير صار `session-maybe` | إدخال حالة آلة، مفتاح قرص أمر وجه و حركة عمل كل يتم إجبار قبول نقص حذف قيمة؛ فقط استبدال disabled إدخال جسم قدرة يأخذ اختياري صفة إبقاء في خارج قشرة حد |
| مخصص استخدام «تحويل صحيح» لقطة | `session-status(running:true)` دلالة كامن يحتوي تحويل صحيح (blank جلسة من لا running) ، إضافة لقطة هو wire كثير واحد نوع تبديل صفر معلومة |

## عاقبة

- إضافة نيل نيل و host نفس بنية جلسة سياق: تدريجي جلسة حالة تعليق actx، مع scope fiber مرة تفكيك تركيب، تسرب تسرب بنية صفة غير ممكن قدرة؛ مزدوج جلسة عزل من scope filter بنية صفة حفظ إثبات.
- client كائن طبقة استلام جمع لـ wire مرآة مثل: جلسة هوية، دورة الحياة، قدرة حكم آخر الكل بـ host فعلي جسم لـ دقيق——إدخال جسم نظام (تحت واحد طبقة) وجه مقابل دائم بعيد هو «لديه حق Agent جلسة» ،slash/skill انتظار مزود واحد قاعدة بـ sessionId مباشر بحث عنوان.
- فارغ جلسة معالجة إدارة صفر مخصص استخدام آلية: حالة اعتماد واحد إرسال توليد موضع، مرئي صفة اعتماد موحد واحد قائمة إسقاط (فقط current blank بـ `New Session` عرض) ، عودة استلام اعتماد lazy persistence قائم اتفاق (إعادة بدء تبخر إرسال) ، معتاد قاعدة حد أعلى اعتماد نفس Workspace إعادة استخدام.
- بديل قيمة:id→ctx تبديل ركوب سجل قاعدة،provide Concurrent سجل قاعدة كل هو اتفاق بينما غير نوع قوي صنع، اعتماد review و اختبار تثبيت إقامة. مفرد واحد حالة محور ما زال سوف في Session وجود قبل إخفاء machine face؛ هذا مقطع وقت داخل،[معتاد إقامة جلسة قشرة](../../../../packages/client/ui-conversation/README.ar.md) سوف يأخذ تنشيط عملية تحويل إلى Workspace picker.
- معروف نقص حساب:approval/question عبر prune استعادة (TODO) ؛ نموذج اختيار بـ live-mutation شكل حالة ارتداد (host `selectModel` ثلاثة عنصر طقم الآن صار، ذلك client مستهلك بعد لم بناء).

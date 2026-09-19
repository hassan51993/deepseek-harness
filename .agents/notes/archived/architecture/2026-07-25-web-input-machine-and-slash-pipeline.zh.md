# Agent Note: Web إدخال حالة آلة،composer slot و slash خط الإنتاج (ui-conversation input / ui-input-trigger)

Status: implemented
Archived: 2026-09-04

[English](2026-07-25-web-input-machine-and-slash-pipeline.md) | العربية

> نطاق: إدخال حالة آلة (claim نظر حماية + إيداع أمر خدمة) ،hub/facade و إرسال تحرير ترتيب، عبر إضافة إدخال تعديل كتابة ثلاثة عدد scoped bail حدث،`/` و `@` إطلاق فحص قياس و قائمة مفرد خط الإنتاج (ui-input-trigger) ،composer دورة حافة slot جسم نظام. اعتماد[جلسة أثر مجال note](2026-07-25-web-client-session-scope-and-provide-channel.zh.md) sctx / provide / session-maybe و blank فعلي جسم نموذج؛ أمر معرفة تعرف (ثلاثة نوع، دليل،popup) صفر تعلق——ذلك هو[أمر عمل خدمة وجه note](2026-07-25-web-command-surfaces-and-assembly.zh.md) قيادة أرض. أصل قرار تحرير وجه واحد نصف——textarea + occurrence جدول، ذاتي إدارة undo log، لصق لصق مطابقة خط الإنتاج و backdrop تركيب زينة——قد من [Lexical composer note](2026-08-20-web-composer-lexical-editor.zh.md) يحل محل؛ هذا note ما زال يملك حالة آلة إيداع مستو وجه،bail حدث اتفاق، إطلاق خط الإنتاج و composer slot.

## مشكلة

اثنان عدد كل منها لـ سياسة composer:hero(EmptyState، تلقي تحكم سلسلة مباشر كتابة جلسة) و جلسة داخل InputBar(عادي تلقي تحكم textarea) ، سلوك،draft كل حق، إرسال مسار كل لا متسق. يلزم يجعل `/` أمر،skill مرجع،`@` مرجع ثلاثة صنف إطلاق دخول إدخال وجه، يجب عودة جواب:

- ثلاثة صنف إطلاق مثل أي قسم طبقة، من مقابل «أمر» لديه معرفة تعرف، من صفر معرفة تعرف؛
- إدخال إطار مثل أي جدول بلوغ «أمر حالة»——من draft نص دفع توجيه أيضا هو صريح حالة؟ تراجع إطار، عودة عربة، فارغ إطار، كامل سطر لصق لصق كل هو ماذا دلالة؛
- إيداع هو مختلف خطوة أمر خدمة (RPC نحو إرجاع)——متأخر إلى نتيجة عودة ملء، جلسة تبديل،React concurrent إعادة وضع مثل أي منع صد؛
- مرجع chip في صاف textarea فوق مثل أي يمثل،undo/قص لصق لوح/لصق لصق مطابقة/نموذج تسلسل تحويل كل عودة من؛
- عبر إضافة إدخال تعديل كتابة (قائمة مفرد عودة ملء، مرجع إدراج دخول،token إزالة استهلاك) مثل أي فعل إلى اعتماد قلب وضع؛
- بلا جلسة → blank جلسة وقت أي بعض React خارج قشرة يجب إعادة استخدام، أي بعض صارم إطار جلسة إدخال جسم سماح استبدال.

صلب قيد: مكون واحد قاعدة مرور slots تركيب؛ عرض ناتج لا دخول جلسة سجل؛ مفتاح قرص مسار كل مسار IME أمان.

## قرار

### إدخال حالة آلة (الآن لـ `SubmitMachine`)

صاف حالة آلة، حدث دخول/فاعلية نتيجة خروج، حقن وقت ساعة. أربعة متبادل phase(plain / adjudicating / claimed / submitting). أمر حالة**دائم لا من draft دفع توجيه**، من pick مسار في مغادرة تفرق وقت لحظة صريح بناء قيام؛claim من `draft.startsWith(token)` نظر حماية، تراجع إطار كسر تالف تلقائي release؛claim شكل حالة `{token, hint?}`(hint توفير ghost text).

آلة جهاز تحرير وجه واحد نصف——occurrence جدول، ذاتي إدارة undo log، لصق لصق مطابقة attempt خط الإنتاج و `set-invalid`——قد و دخول Lexical وثيقة شجرة و ذلك history(وثيقة هوية، موضع خريطة و ثلاثة إسقاط عودة [Lexical composer note](2026-08-20-web-composer-lexical-editor.zh.md) كل). إبقاء في هذا داخل هو دلالة ثابت إيداع مستو وجه:

- `draft-changed {draft}`——تحرير جهاز وثيقة قص لصق لوح إسقاط، توفير claim نظر حماية.
- `claim {claim}` / `release` و في تحرير جهاز طبقة تطبيق span-CAS تعديل كتابة حدث——bail حدث آلة جهاز جانب؛span CAS = draftRev متبادل انتظار.
- `enter {draft}` / `adjudicated` / `adjudication-failed` / `submit-settled {draft}` / `send-committed`——إيداع أمر خدمة مستو وجه:SubmitAttempt(seq + AbortSignal) منع عودة ملء، نجاح commit صاف حذف مسودة مسودة بادئة، فشل حمل عائم نقل حراسة حماية rollback(عودة عربة وقت لقطة فقط عند live draft ما زال انتظار في هو عندئذ عودة ملء؛ مستخدم قد مجددا إدخال فإن فقط إرسال notice).

فاعلية نتيجة وجه (shell تنفيذ):`adjudicate`(ضبط InputTriggerController.adjudicate) ،`begin-submit`(claim.submit أمر خدمة) ،`default-sink`(عادي رسالة،hub تحرير ترتيب) ،`commit-draft`(بادئة حذف و إبقاء بعد لاحقة) ،`notice`.

### عبر إضافة إدخال تعديل كتابة: ثلاثة عدد scoped bail حدث

اتفاق إعلان في ui-input-trigger(اعتماد الأكثر قاع طبقة) ، إنتاج من مرور `sctx.bail(sctx, ...)` إرسال إرسال، وحيد إزالة استهلاك جانب هو hub بناء shell وقت تعليق في sctx فوق ثلاثة عدد listener؛ إرجاع `true` ⟺ آلة جهاز مرور phase + CAS حراسة حماية و فعلي تعديل كتابة (إرسال خروج حدث ≠ تعديل نجاح،Space هل `preventDefault` بـ قيمة راجعة لـ دقيق):

- `slash/input-begin-command` `{claim, span}`——قائمة مفرد pick / Space قطع قرار خروج أمر claim عودة ملء (InputTriggerController إرسال إرسال).
- `slash/input-insert-reference` `{reference, span}`——مرجع chip إدراج دخول (InputTriggerController إرسال إرسال).
- `slash/input-consume-token` `{guard: span | bare-token}`——عمل خدمة نجاح بعد إزالة استهلاك أمر token(تحت تنقل أمر وجه إرسال إرسال).

لا حدث تحويل استدعاء (سجل التسجيل تسجيل تسجيل → صريح استدعاء → await):Input ذاته draft/submit،Enter مختلف خطوة قطع قرار،reference serializer.`@mode bail` قد دخول JSDoc parser و cordis catalog بوابة (scripts/jsdoc.ts).

### slash خط الإنتاج (ui-input-trigger:root `InputTriggerService` + كل جلسة `InputTriggerController`)

مقابل «أمر» صفر معرفة تعرف إطلاق/قائمة مفرد/pick خط الإنتاج:

- خدمة فقط لديه source سجل التسجيل (`InputTriggerSource{trigger: '/'|'@', name, order?, candidates, onPick, matchSpace?, matchEnter?}`؛ (trigger,name) وحيد؛ اختياري `order` مقابل roster ترتيب ترتيب——تجاوز صغير تجاوز اعتماد قبل، افتراضي 0، نفس قيمة إبقاء تسجيل ترتيب——ترتيب ترتيب بعد roster معا هو مجموعة ترتيب و جولة استفسار ترتيب) و `sessionOf(sctx)`. تنفيذ match خطاف أي مشاركة و فارغ إطار/عودة عربة قطع قرار إعلان؛ خط الإنتاج حسب roster ترتيب جولة استفسار، أول عدد غير undefined ينبغي جواب فوز خروج، بلا شخص إقرار قيادة سقوط default sink.matchSpace تزامن (فارغ إطار في ضرب مفتاح في إطلاق، فقط سماح حار ذاكرة مؤقتة) ؛matchEnter مختلف خطوة (يمكن await مصدر ذاته مسبق حار، مسبق حار فشل أي reject).
- controller يحتفظ وحيد مرجعي hit(يحتوي span؛ قائمة مفرد إغلاق بعد لـ Space إبقاء) ، كل جلسة menu store، مرشح fetch generation، مفتاح قرص وسيط قطع (combobox نمط: تركيز نقطة بداية نهاية في تحرير جهاز جدول وجه؛↑↓/Enter/Escape سوف يتم اعتراض قطع؛Tab سوف اختيار تحديد عال مضيء تكملة كل بند، مرشح بند يمكن تحت حفر وقت مشي drill حركة عمل، لا فإن مشي عادي pick، بلا عال مضيء وقت إبقاء أصلي تركيز نقطة مرة تاريخ؛ كل وسيط قطع كل مرور مرور IME composition حراسة حماية، وحيد مثال خارج هو Shift+Enter بلا شرط أولا سطر) ، و pick تحرير ترتيب (outcome → ذاتي إرسال bail حدث).`toggleSource(name, syntheticHit)` هو chrome launcher مسار: هو أساس في استدعاء جهة تحرير جهاز selection، فقط seed مقابل قد تسجيل source، تزامن نشر `launcher = name` مباشر حتى إغلاق؛ عادي مفتاح دخول صيغة tracking سوف صاف حذف launcher و استعادة كامل trigger roster. اثنان بند مسار تصيير نفس عدد MenuView، و تنفيذ نفس بند `onPick` سلسلة.`dismiss()` حركة كلمة دعم دعم MenuView حقن `onDismiss`(إشارة إبرة سقوط في قائمة مفرد و الذي في composer بطاقة خارج أي إغلاق قائمة مفرد؛MenuView أيضا مرور `slash.menu` locale نطاق الأسماء محلي تحويل مجموعة عنوان، و مرور ui-primitives `useAnchoredMaxHeight` يأخذ عال درجة استلام جمع إلى composer فوق جهة نظر فتحة فضاء) ؛ كل جلسة أثر مجال خروج توليد وقت مقابل source roster فعل مرة `warm(projection)`،projection في هذا scope داخل فقط لديه مستقر sessionId، بلا published/قدرة وثب نقل؛scope disposer تفكيك حذف controller.
- إطلاق فحص قياس كلمة حد (`user@host`،URL `/` دائم لا إطلاق) ، حراسة حماية قسم ملف (plain:`/` إلى موضع + `@` سطر داخل / claimed:`/` كبح صنع،`@` نشط / frozen: كل بلا) لـ تجميد ربط صاف نواة.

### hub / facade: معتاد إقامة خارج قشرة و صارم إطار جلسة إدخال جسم

- hub(trigger/decoration سجل التسجيل + إرسال تحرير ترتيب) مقابل slash/command خدمة هو اختياري `ctx.get()` اعتماد: بلا ui-input-trigger/أمر وجه وقت إدخال صحيح معتاد استلام إرسال، أفضل أنيق تخفيض.
- كل فعلي جسم جلسة فقط لديه واحد `SessionInputShell`(facade) ، مع جلسة أثر مجال إنشاء و تفكيك حذف؛ بلا جلسة وقت لا صنع input machine.`ConversationRoot` ذاته هو `session-maybe` معتاد إقامة خارج قشرة، يحتفظ HeroShell،Workspace picker،composer stack و chain fallback خارج إطار. هو بداية نهاية يملك نفس عدد scrollport و composer seat؛ جلسة ظهور بعد، ذاك هذا مستقل صارم إطار جلسة header و body outlet فقط ملء دخول هذه ثابت منطقة مجال.
- composer bar هو واحد بلا شرط تصيير `session-maybe` slot entry: بلا جلسة وقت نفس عدد InputBar بـ كسول صفة حالة تصيير (machine face نقص مقعد،`disabled` owner prop) ،`connectWorkspace` إرجاع blank جلسة بعد نفس نسخة تحويل لـ live——تحرير جهاز جدول وجه DOM في بلا جلسة → blank تبديل و ذلك بعد كل مرة phase قلب تحويل في كل لا إعادة بناء؛`ConversationRoot`،Hero و تخطيط هيكل هيكل كل مسار إبقاء.memoized InputBar في renderer ربط كل child slot معيار props بعد ذاتي سطر تصيير overlay،left،right و dock؛`ConversationRoot` فقط نقل علامة كمية بيانات و عودة ضبط، لذلك غير متصل shell render لن صنع صنع جديد ReactNode owner prop أو جعل bar بطلان.
- ConversationRoot Hero حكم حسب هو `sessionId === undefined || (composerPhase === 'blank' && (openState === 'open' || summaryBlank === true))`:summary قد إثبات فعلي لـ فارغ جلسة في أي open state تحت كل إبقاء Hero، لم مرور إثبات فعلي جلسة فإن في loading خلال دخول settling. أول مرة submit تزامن دخول engaging، فشل أيضا إبقاء composer و خطأ سياق، لا تراجع عودة blank Hero؛sidebar blank موضع فقط في نص التوجيه نجاح تلقي إدارة بعد قلب false.
- إرسال موحد واحد في hub defaultSink: مرح مراقبة صاف مسودة بعد فقط مشي `session.prompt` كما ثابت `mode:'queue'`(Web UI بلا steer مدخل؛host خط كابل فوق `mode:'steer'` لا مرور هذا machine) ؛ فشل كما live draft ما زال لـ فارغ عندئذ عودة ملء، مستخدم قد متابعة إدخال فإن لا تغطية. لا وجود Draft materialize أو attach أمر خدمة.
- blank Hero تعديل اختيار Workspace وقت، خارج قشرة استدعاء `connectWorkspace`؛ هدف جلسة مختلف وقت يأخذ غير فارغ draft من حالي shell نقل إلى هدف shell، مجددا open جديد id، قديم blank جلسة إبقاء تخزين لكن لم يعد current.
- Notifier مزدوج موضع اتفاق:`dirty`(لقطة جديد طازج درجة،`ensureFresh` سحب أخذ يمكن صاف) و `notifyPending`(إشعار نقص حساب، فقط لديه flush صاف) كل منها مستقل——سحب أخذ لا نيل ابتلاع دفع إرسال، كائن طبقة دفع حجز قراءة من (watchTransaction) اعتماد هذا واحد حفظ إثبات.

### صاف نص مرجع:text outcome و lexicon تركيب زينة

skill/@subagent مرجع لا مشي احتلال موضع رمز + occurrence هوية سلسلة——صاف نص مرجع قرار:pick مباشر يأخذ `/name ` `@name ` أصل نص إدراج دخول draft،chip نظر شعور صاف إرسال توليد:

- PickOutcome زيادة `{text}` arm؛ جديد scoped bail حدث `slash/input-insert-text` `{text, span}`(و آخر ثلاثة عدد نفس اتفاق:draftRev CAS، إرجاع true ⟺ فعلي تعديل كتابة) ؛facade.insertText مشي setDraft تجميع وصل، آلة جهاز صفر تعديل.
- source اختياري `lexicon?(session)` خطاف: تزامن حار لقطة اسم تسجيل،`undefined` = بيانات لم حار——صفر تركيب زينة، دائم لا إطلاق fetch(تصيير مسار إبقاء تزامن بلا فرعي أثر) ؛ إعداد مقابل اختياري `subscribeLexicon?(session, listener)` خطاف هو اسم تسجيل في warm بعد ما زال سوف تغير (دليل settle، فرعي بديل توليد إطفاء) وقت بطلان عبر طريق.controller يأخذ كل اسم تسجيل تجمع دمج دخول ذاتي ذات `lexicon` لقطة store(كل مرة source إشعار إعادة سحب) ؛scope خروج توليد بعد عندئذ تسجيل source من خدمة واسع بث إعطاء نشط controller، تكملة warm و و دخول اسم تسجيل.
- `decorations.scanTextRefs`: كلمة حد مسح draft(سطر أول/فارغ أبيض بعد `/name`،`@name`،`x/name` دائم لا أمر في؛`/name` token أيضا يجب توقف في فارغ أبيض أو draft نهاية ذيل——و مضيف skill gesture نفس مثال بـ فارغ أبيض لـ حد، لذلك `/nfs-hg/xxx` هو مسار،`/plan.` هو عادي نص؛ui-primitives في قد إرسال نص إسقاط `projectUserText` اعتماد نفس شكل حالة) مقابل وفق اسم تسجيل، أمر في أي يصبح Lexical شجرة في `TextRefNode` فعلي جسم (claim تركيب زينة مقابل سطر أول token مقعد موضع لديه أولوية حق——رؤية [Lexical composer note](2026-08-20-web-composer-lexical-editor.zh.md)) ؛ تحرير كسر تالف مطابقة شكل حالة وقت فعلي جسم أيضا أصل لـ عادي نص.
- إرسال أي أصل نص (لم يعد `<skill>` تسلسل تحويل) ؛ هواء فقاعة جانب `projectUserText` فقط في نفس خطوة سجل هذا اسم حرف `skill-invocation` حقن وقت عندئذ تركيب زينة صاف نص `/name` token——ui-chat `SkillNameProjector` يأخذ هذا خطوة حقن skill اسم تعليق إلى مباشر رسالة عقدة فوق، و recall إسقاط تعليق جلسة وسم طريقة نفسه——لذلك `/123` أو مع يد طرق `/كلمة` إبقاء عادي نص؛ إشارة أمر إدخال هواء فقاعة (ui-goal) بـ نفس مثال طريقة إشارة واضح ذلك قد تنفيذ إشارة أمر، يأخذ token تصيير لـ `command` chip؛`@name` token ما زال حسب شكل حالة تركيب زينة.
- تركيب زينة استجابة صفة:shell حجز قراءة controller lexicon store، كل مرة اسم تسجيل تغير إعادة مسح كل وثيقة،scope خروج توليد مسبق حار بعد عندئذ settle اسم تسجيل سوف مباشر نقطة مضيء قد لديه draft token، بلا حاجة قائمة مفرد تفاعل أو غير متصل إعادة تصيير.

### كل جلسة توفير عدد مساهمة و مفتاح قرص خاص وجه

- ui-conversation(hub كذلك مساهمة من) مرور `sessions.provide` توفير `'input'` hook(آلة جهاز حالة + queue overlay)+ `inputActions` prop(`setDraft`/`submit`، مستقر void عودة ضبط).
- عام خاص قسم حد: عام مشترك provide فقط وضع React لغة تجميع عضو؛ مفتاح قرص/DOM أمر وجه (`ComposerKeyboard`:shell كل editor،arbitrate/space/paste/dismissPopup/caretSpan——تزامن قيمة راجعة،disposer دلالة) هو InputBar وحيد احتلال، مشي InputBar entry ذاتي ذات inject حزمة داخل خاص تمرير، لا خروج إضافة حد.

### slot جسم نظام

`conversation` ذاته هو session-maybe؛ ذلك جلسة محتوى و composer إدخال slot صارم إطار حد تحديد لـ جلسة،Hero Workspace picker إبقاء root.root تسجيل يأخذ header outlet تصيير في معتاد إقامة scrollport فوق جهة، يأخذ body outlet تصيير في ذلك داخلي، معتاد إقامة composer seat قبل. فرعي slot متساو من ui-conversation conversation تسجيل إعلان:

- `conversation.session.header`(single)——معتاد إقامة scrollport فوق جهة صارم إطار جلسة breadcrumb،view tab و header action.
- `conversation.session`(single)——معتاد إقامة scrollport داخل صارم إطار جلسة view ring و draft mirror.header و body مشترك نفس عدد جلسة أثر مجال chat store؛ جلسة id تبديل وقت كل منها إعادة بناء.
- `conversation.composer.bar`(single)——InputBar هذا جسم slot:InputBar هو حق slot entry(ذاتي لديه slot ذاتي تسجيل) ،composer chain fallback محتوى؛ لا فعل chain entry——chain مفرد اختيار رفع سوف في takeover وقت إزالة هو، كسر تالف تحرير جهاز جدول وجه DOM تخزين نشط.
- `conversation.input.overlay`——إدخال بطاقة داخل طفو طبقة مرساة نقطة؛ تسجيل من inject حسب slot sessionId تحليل كل منها كل جلسة controller.
- `conversation.input.dock`——إدخال فوق جهة كومة تراكم بند (QueueDock طابور صف فقط قراءة قائمة سقوط هذا) ،order تحديد ترتيب.
- `conversation.composer.dock`——composer فوق امتداد موحد حساب حمل.
- `conversation.input.left` / `conversation.input.right`——أداة سطر يسار يمين منطقة.
- `conversation.input.plan` / `conversation.input.model`(single)——أداة سطر اثنان أداة اسم تحكم موضع؛bar فقط نقل `locked`(owner props) ، فارغ إلى owning إضافة تسجيل لـ توقف، بلا احتلال موضع fallback.plan seat لم تنشيط وقت إبقاء لـ فارغ، لأن مدخل عودة مشترك Command source كل؛ صالح plan هدف سوف تصيير warn حالة `Plan ×` حالة حسب زر، ذلك وحيد حركة عمل هو `/plan off`.
- `conversation.hero.workspace`(root scope)——بلا جلسة / blank Hero مشترك استخدام Workspace picker؛pick مرور `connectWorkspace` إعادة استخدام أو إنشاء هدف blank جلسة، لا بد يلزم وقت نقل تشغيل draft بعد قطع current.

### اختبار سجل قاعدة

حالة آلة الكل سلوك من صاف JS مفرد قياس تغطية (حدث تسلسل دخول، تأكيد حالة و فاعلية نتيجة، صفر متصفح DOM) ؛ تفاعل مستطيل دفعة تدريجي سطر إسقاط اختبار. هذا واحد اشتراط صحيح هو صاف نواة + خدمة قشرة قسم طبقة صار بسبب.

## سبق اعتبار بديل خطة

| ترك سجل | واحد سطر إدارة من |
|---|---|
| ActiveCommand في بين حالة / registerMode نمط سجل التسجيل / من draft دفع توجيه أمر حالة | claim من pick مسار صريح بناء قيام——بلا جدول، بلا دفع توجيه |
| bindTarget/bindDraft كائن مباشر وصل | عكس نحو اقتران دمج + root مفرد مثال عبر جلسة خطأ إعداد؛scoped bail حدث حفظ اعتماد قلب وضع كما توجيه بنية صفة صحيح تأكيد |
| موحد واحد slash/input-apply أو كل حدث تحويل | ثلاثة عدد مستقل payload تغطية عبر إضافة تعديل كتابة؛ مختلف خطوة سلسلة مسار إبقاء أساس في سجل التسجيل صريح استدعاء |
| contenteditable / غني نص شجرة | توافق صفة فرق؛textarea + U+FFFC + occurrence جدول تغطية الكل تفاعل اتفاق——بعد يتم [Lexical composer note](2026-08-20-web-composer-lexical-editor.zh.md) عكس تحويل:textarea مكدس مثال صيغة و هوية صار هذا يتم فعلي قياس بعد قلب سجل |
| draft مزدوج حفظ دائم {text, occurrences} | mirror كتابة قص لصق لوح إسقاط صفر جديد عام فكرة؛chip عبر تحديث جديد تخفيض يمكن قبول |
| أصلي textarea undo مكدس | تلقي تحكم + برنامج تحويل كتابة تحت غير ممكن اعتماد؛ لصق لصق اثنان مقطع undo دلالة فقط قدرة ذاتي إدارة——اثنان جانب كل مع textarea واحد و تراجع دور؛undo الآن عودة Lexical history |
| InputBar استلام 16 عضو wiring عودة ضبط حزمة | إزالة استهلاك مستطيل دفعة فعلي إثبات 11 عضو InputBar وحيد احتلال،1 عضو ميت عضو؛ معيار عنصر عبر طريق يجعل مكون ذاتي أخذ، مفتاح قرص وجه حزمة داخل خاص تمرير |
| من `ConversationRoot` يأخذ InputBar child slot تصيير لـ owner prop | جديد React element سوف ضرب اختراق bar memo حد؛bar قد استلام إلى `renderSlot`، أيضا يملك هذه موضع |
| فارغ إطار قطع قرار أيضا إقرار قيادة أي تنفيذ نوع أمر | خطأ إطلاق منع خط: فارغ إطار بعد كامل سطر هو عادي نص التوجيه؛ غير ممكن عكس فرعي أثر فقط إبقاء صريح مدخل |
| عام tokenPattern تركيب زينة آلية | بنية تحويل occurrence سجل يحل محل نمط مسح |
| احتلال موضع select معتاد إقامة أداة سطر | أداة اسم slot في تسجيل قبل إبقاء لـ فارغ؛ احتلال موضع عنصر و حقيقي الآن اندفاع مفاجئ وقت هو اثنان عدد حق مصدر |
| بداية نهاية مرئي Plan فتح/صلة تبديل | مدخل قد عودة مشترك Command source كل؛ ثاني عدد مدخل سوف يأخذ حالة seat تغيير صار زائد بقية mode chrome |
| ثاني طقم إضافة رقم قائمة مفرد مكون/controller، أو في Command فوق جهة زيادة Add/File قسم مجموعة | هذا سوف تكرار مختلف خطوة مرشح، مفتاح قرص عال مضيء، تركيز نقطة إبقاء و pick حالة؛ إضافة رقم تحكم عنصر فقط هو قائم MenuView حسب source مرور ترشيح launcher، كما هذا scope لا يوجد ملف قدرة |
| مرجع واحد قاعدة مشي U+FFFC chip(صاف نص مرجع قرار الذي يحل محل قديم خط) | صاف نص + إرسال توليد تركيب زينة صفر هوية حالة؛ أصل نص أي نموذج إسقاط،undo/قص لصق لوح تجنب خاص حكم؛chip سلسلة إبقاء إعطاء حاجة غير ممكن قسم أصل فرعي صفة مشهد |

## عاقبة

- واحد معتاد إقامة conversation خارج قشرة تحمل وصل بلا جلسة/blank/active: بلا جلسة → blank إبقاء ConversationRoot،Hero،root scope Workspace picker،scrollport،composer seat،InputBar و تحرير جهاز جدول وجه؛ فقط لديه صارم إطار جلسة header و body outlet بدء تحمل تحميل محتوى. نفس blank جلسة → engaging/active أيضا إبقاء InputBar و تحرير جهاز جدول وجه.EmptyState و تلقي تحكم intent سلسلة (`sessions.updateIntent`/`updatePendingPrompt`/`workspaces.sendSession`) مع الأكثر بعد مستهلك واحد و حذف.
- إدخال وجه مقابل أمر صفر معرفة تعرف + اختياري اعتماد: بلا أمر حزمة وقت صاف إدخال متاح؛`@` مرجع و skill مرجع تجنب استهلاك إعادة استخدام نفس قائمة مفرد/pick خط الإنتاج. بديل قيمة هو فارغ إطار/عودة عربة قطع قرار هو تدريجي source جولة استفسار بروتوكول، ذلك ينبغي جواب دلالة (تزامن/مختلف خطوة،undefined يحتوي معنى) لـ تجميد ربط اتفاق.
- إيداع أمر خدمة تحويل (attempt seq + عائم نقل حراسة حماية) جعل متأخر إلى نتيجة عودة ملء، جلسة تبديل،concurrent إعادة وضع ثلاثة صنف نقص وقوع بنية صفة غير ممكن قدرة، من مستطيل دفعة اختبار تثبيت إقامة.
- معروف نقص حساب:chip عبر تحديث جديد حفظ حق لم قيام بند؛subagent مرجع نموذج يمثل انتظار عمل خدمة قيام بند.

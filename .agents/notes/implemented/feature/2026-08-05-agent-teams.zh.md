# Agent Note: Durable Agent Teams over continuable children

Status: implemented

[English](2026-08-05-agent-teams.md) | العربية

## Problem

subagent seam قد توفير fresh/fork provider، حمل دائم child Session،FIFO follow-up و يمكن بارد استعادة Activation. هو مباشر parent control لا توفير peer عبر خبر، مستقر أداة اسم roster أو مشترك مهمة owner.coordinator يمكن إنشاء كثير عدد worker، لكن worker لا يمكن متبادل متبادل بحث عنوان؛ حمل دائم follow-up معنى رسم فقط وجود في target inbox؛ أيضا لا يوجد عام مشترك compare-and-set مهمة لوح قدوم منع توقف قديم قديم assignment تحديث.

نفس عملية Agent أيضا مشترك واحد checkout. نظام الملفات edit أداة يمكن رفض قد مراقبة إلى قديم قديم إصدار، لكن Bash،formatter،generator و خارجي writer سوف التفاف مرور هذا شاشة عائق. يأخذ teammate name أو task owner عند عمل ملف قفل فقط سوف إخفاء غطاء بينما لا هو حل قرار هذا تزامن حد.

Agent Teams عام اتفاق ما زال موضع في فعلي تحقق مرحلة مقطع، لذلك حاجة صريح تفعيل تركيب. افتراضي أداة دليل و بسيط مفرد مهمة سلوك يجب إبقاء ثابت؛ بينما صريح طلب Team يجب قدرة عبر تجاوز child Activation settlement و mailbox إلقاء تمرير تنافس تنازع، جعل Lead في عملية teardown قبل تجميع مجموع نتيجة.

## Decision

كل عادي وقت التشغيل Root كل هو واحد خفي صيغة Team Lead،Team id انتظار في هذا Root `SessionId`.Team لا يوجد creation event:Lead pseudo-row من هوية مباشر وجود، حمل دائم حالة من رقم واحد بند member،message أو task event بدء.roster هو مسطح مستو بنية، الأكثر كثير يتضمن إعداد عدد كمية، غير ممكن تغيير كما اعتماد صغير كتابة kebab-case اسم حرف. كل teammate كل هو استخدام مسبق إبقاء Session id continuable مباشر child؛ فقط لديه Lead يمكن إنشاء أو interrupt teammate.roster خارج من provider إدارة عادي subagent لا هو Team member؛ عادي fork هو جديد Root، وراثة Team سجل سوف بسبب ancestor `TeamId` يتم ترتيب حذف.

تنفيذ تفكيك قسم لـ `@deepseek-ai/dsh-experimental-agent-team` و `@deepseek-ai/dsh-experimental-tool-agent-team`: قبل من مسؤول `ctx.agentTeams` و حمل دائم دلالة، بعد من مسؤول scoped schema و نموذج إشارة جذب. كل Team أداة كل إعلان كامل نتيجة schema، و يأخذ هذا قيمة تصيير لـ ضيق تجميع JSON، لذلك تحرير ترجمة جهاز سوف فحص كل `execute` هل رمز دمج مقابل نموذج تحمل وعد، أيضا لا يوجد نتيجة يأخذ token زهرة في تقليص دخول فوق. نشر صريح تركيب اثنان عدد إضافة، و يمكن منع استخدام أداة لديه نفسه نموذج مرئي اسم قديم continuable control. صريح delegation سياسة فقط سماح في مستخدم اشتراط Agent Teams أو teammate وقت إنشاء Team. اثنان عدد حزمة كل هو `packages/experimental/` عام عضو؛[فعلي تحقق صفة حزمة قرار](../architecture/2026-08-18-experimental-agent-teams-packages.zh.md) مسؤول إصدار، اعتماد عزل و promotion.

Lead يجب انتظار الذي يحتاج عمل بعد عندئذ قدرة إعطاء خروج نهائي جواب سجل. عملية teardown ما زال هو نهائي دورة الحياة owner، و سوف drain continuation Activation؛Team task owner هو حمل دائم حالة، لن بسبب idle،interrupt أو عملية خروج تلقائي تحرير.

## Profile delegation

[Team profile](../../../../packages/experimental/agent-team-profile/README.zh.md) منع استخدام `subagent`،`subagent_fork` و اسم إعادة تراكم عام تحكم عنصر. نموذج مباشر تفويض إرسال استخدام دعم حمل fresh أو fork سياق `spawn_teammate`، جعل هذه فرعي بديل إدارة دخول حمل دائم roster.Workflow ما زال عبر base profile fresh `spawn` مزود تنفيذ نص برمجي تحرير ترتيب؛ مرور نموذج أداة إنشاء workflow فرعي بديل إدارة لن وراثة teammate محادثة هوية.Subagent خدمة و مزود ما زال هو مشترك أساس أساس ضبط تطبيق. عادي Session fork إبقاء تاريخ، لا تصحيح صحيح هوية. مزود الذي يملك فرعي بديل إدارة أداة مرئي صفة ما زال هو[قد سجل حد](../../../../packages/experimental/tool-agent-team/README.zh.md#known-limitations-and-deferred-work).

## Team identity

أداة `spawn_teammate` في ابتدائي مهمة قبل إضافة فوق user-role `<system-reminder>`، إعلان `You are teammate "<name>".`. هوية و مهمة دخول نفس بند حفظ دائم استلام عنصر صندوق رسالة. مشترك system سياسة و الكل أداة schema في عضو بين إبقاء متسق؛ تنفيذ وقت فحص زاوية لون إذن.Team أداة أصل حسب استدعاء من تحديد Team، و قبول عضو اسم حرف، لذلك نموذج لا حاجة Team id. هوية مع عادي تاريخ مرور تاريخ بارد استعادة و ضغط؛ إضافة لا فحص رفع تنبيه هل إبقاء، أيضا لا إضافة بديل رسالة.fork وراثة قد سجل نص، لا تكملة إرسال Lead هوية إصلاح صحيح. يأخذ هوية وضع دخول system prompt سوف في وراثة تاريخ قبل تغيير بادئة؛ يأخذ هو إبقاء في ابتدائي مهمة في حيث إبقاء هذا بادئة، أيضا بلا حاجة كل خطوة صيانة هوية رفع تنبيه. قد لديه system داخل تضمين هوية ممكن حاجة مرة نص التوجيه تنسيق ضبط؛ إبقاء حدث صيغة بديل حد إبقاء ثابت.

## Provisioning and recovery

إنشاء عملية أولا في Lead Session في إلحاق و flush `team/member` provisioning لقطة، مجددا عبر اختيار تحديد fresh أو fork provider بدء مسبق إبقاء continuable child. ابتدائي inbox نيل دقيق قبل فشل سوف إلحاق failed لقطة؛ نجاح سوف أولا flush child في قد قبول inbox بند، مجددا إلحاق active. استعادة سوف في ابتدائي رسالة ما زال موضع في pending أو قد دخول مستخدم رسالة تاريخ وقت تعرف آخر هو. اسم حرف من رقم واحد بند provisioning سجل دائم دائم إبقاء، يشمل فشل بعد أيضا لا يستطيع إعادة استخدام.dispose سوف إغلاق دقيق دخول، في توقف و انتظار قد نيل دقيق إنشاء و mailbox dispatch أمر خدمة، مجددا إيقاف roster سجل كل live child؛failed child في Activation خروج قبل ما زال من cleanup يملك،cleanup رفض سوف يجعل dispose فشل.

Root استعادة وقت سوف يأخذ لم نهاية ربط provisioning سجل و مستقل حمل دائم child Session مقابل حساب. مباشر parent و continuable descriptor مطابقة، و كما قد سجل ابتدائي مستخدم رسالة، عندئذ قدرة إثبات دقيق دخول نجاح و تحويل لـ active؛ ناقص، ضرر تالف،provider/lineage لا مطابقة أو نقص قليل قد دقيق دخول رسالة كل سوف تحويل لـ failed.creator سوف في نفس Lead سجل serializer داخل إعادة قراءة نهاية حالة؛ إذا recovery في إنشاء نجاح وقت أولا علامة failed،creator سوف drain child و تقرير إبلاغ provisioning conflict، بينما لا هو متروك إبقاء منعزل طفل. هذا مثال حيث بلا حاجة إعادة بناء من لم حفظ في Team سجل في ابتدائي prompt، أيضا قدرة قيد إضافة reload تنافس تنازع.

fresh child لا وراثة محادثة.fork child فقط التقاط مرة Lead قد إتمام turn بادئة، و إبقاء لـ ذاتي ذات حمل دائم seed. حالي delegation turn إبقاء ترتيب حذف، و قائم fork provider عقد نحو متسق.

## Mailbox and task transactions

Peer عبر خبر استخدام Lead سجل mailbox. إلقاء تمرير قبل أولا إلحاق و flush `team/message/queued`.target message سوف في حمل دائم source metadata و قصير نموذج مرئي بادئة في معا يحمل مستقر message id و sender identity. فقط لديه pending inbox بند أو قد سجل مستخدم رسالة إتمام flush،Lead سجل عندئذ كتابة `team/message/delivered` acknowledgement. أي وقت دقيق دخول حسب target و queued سجل ترتيب سلسلة سطر تحويل، استعادة حسب نفس ترتيب إعادة محاولة queued-minus-delivered، و في بارد استعادة قبل طي live أو persisted target inbox/تاريخ حالة. كل حالي إصدار Team payload كل سوف مرور مرور وقت التشغيل تحقق بعد عندئذ دخول replay state.Team runtime من تزامن دقيق دخول إلى settlement كل مسار تتبع أثر dispatch و مختلف خطوة acknowledgement عمل؛dispose سوف إغلاق دقيق دخول، و في إزالة خدمة قبل انتظار اثنان من. حالي waiter فقط في الذي تابع Team event flush نجاح بعد يتم نداء تنبيه.

`send_message` بداية نهاية محاولة تجربة Steer إلقاء تمرير.running target في الأكثر قريب خطوة حد استلام إلى رسالة،idle target بدء واحد جولة،inactive teammate فإن بارد استعادة. أي جعل مؤقت إلقاء تمرير فشل يجعل رسالة إبقاء queued، نجاح أيضا يمثل رسالة قد حفظ دائم. هذا آلية توفير عملية داخل إعادة محاولة و target Session ذهاب إعادة، لا إعلان تسمية عبر عملية exactly-once.[Team Steer رسالة قرار](../../archived/simplification/2026-08-30-team-send-message-steer.md) مسؤول مفرد أداة ضبط درجة إدارة من.

مشترك task هو حمل Team-local id و مفرد ضبط revision كامل لقطة. كل مرة تغيير كل يحمل `expectedRevision`. مهمة معنى member يمكن إنشاء، قراءة أو claim ready كما بلا owner مهمة؛Owner أو Lead يمكن تحرير و تحويل؛ فقط لديه Lead يمكن قسم إعداد إعطاء آخر عدد member. عدد حرف task id إبقاء في أمان كامل عدد قسم إعداد نطاق داخل؛ هذا نطاق استهلاك كل وقت سوف فشل، لن إعادة استخدام id. اعتماد يجب إشارة نحو لم حذف مهمة، و شكل صار كامل DAG. حذف مهمة إبقاء لـ tombstone.`writeScopes` هو مواصفة تحويل مسار بادئة، فقط إنتاج إعادة تراكم تشخيص، أبدا سوف منع توقف claim أو منح إعطاء كتابة إذن.

`wait_agent` انتظار استدعاء تسجيل بعد حدوث تحت واحد بند roster،mailbox،task أو فوري status حافة، تجنب تجنب نموذج جولة استفسار. هو لن إعادة تشغيل أكثر مبكر حافة، لذلك استدعاء جهة حاجة في نداء تنبيه أو مهلة بعد إعادة قراءة مرجعي حالة. فقط حد Lead interrupt استخدام inbox preservation إلغاء حالي turn، لا تغيير mailbox أو task owner.

## Shared checkout boundary

كل member استخدام نفسه cwd، و قيام أي مراقبة كتابة. سياسة اشتراط member قطع قسم مهمة، سجل تلميح صفة write scope، لـ لديه ترتيب عمل إضافة اعتماد، و من Lead فحص نهائي diff و تشغيل اختبار. نظام الملفات stale-version رفض بعد يجب إعادة قراءة و rebase تعديل معنى رسم.Bash،formatter،codegen و مباشر خارجي كتابة لا أداة تجهيز انتظار قيمة حفظ إثبات.

Worktree isolation لا هو harness runtime سلوك.deployment أو prompt يمكن أمان ترتيب مستقل worktree، لكن Team مجال لن دفع قطع branch،merge تغيير أو ساكن صامت تغيير cwd. هذا مثال إبقاء قائم same-world subagent و sandbox عقد نحو.

## Alternatives considered

**استخدام peer id توسيع direct-child subagent tool.** رفض، لأن parent/child إذن و Team peer membership هو مختلف مجال. نحو continuation seam زيادة peer access سوف تقليل ضعيف exact-parent authorization، ما زال لا يمكن لـ roster و task توفير حمل دائم owner.

**في Lead سجل دخول طابور قبل يأخذ mail تخزين دخول كل target Session.** رفض، لأن Team إيداع إرسال بعد،target materialization و دقيق دخول ما زال ممكن فشل. بداية نهاية live Lead Session هو أمر خدمة owner؛target recording هو acknowledgement و ذهاب إعادة حد.

**يأخذ task ownership أو write scope عند عمل قفل.** رفض، لأن خارجي writer سوف التفاف مرور هو جمع، انهيار انهيار owner سوف حمل دائم إبقاء، بينما مسار بادئة إعادة تراكم لا يستطيع إثبات دلالة مستقل. وهمي زائف متبادل رفض حفظ إثبات مقارنة واضح warning أكثر خطر خطر.

**تلقائي إنشاء عزل worktree.** رفض، لأن worktree إنشاء،branch تسمية،merge سياسة،ignored file، بناء ناتج و cleanup كل هو deployment اختيار؛ هو أيضا سوف تغيير قائم subagent و sandbox كشف same-world سلوك.

**في افتراضي أداة دليل في تفعيل Team.** رفض، لأن scoped Team control سوف تغطية نفس اسم قديم عام أداة، رئيسي حركة delegation أيضا سوف إعطاء بسيط مفرد مهمة زيادة تأخير متأخر و token صار هذا.opt-in profile bundle سوف إدراج دخول Team و منع استخدام قديم control، معا لا نحو مع مرفق اعتماد رسم إضافة Team حزمة.

**استخدام داخل تخزين task board و mailbox.** رفض، لأن child settlement،HMR و عملية في قطع سوف فقد فقد قد قبول تنسيق ضبط حالة، و يجعل إعادة محاولة تغيير نيل يحتوي غامض.

**يجعل Team أداة إرجاع لم نوع تحويل JSON.** رفض، لأن لم إعلان نتيجة نوع سوف يجعل `execute` في لا يوجد تحرير ترجمة خطأ حال حال تحت انحراف مغادرة مقابل نموذج تحمل وعد، أيضا سوف جذب دخول في كل نسخة roster،task و عودة تنفيذ فوق كل إزالة استهلاك token تقليص دخول. لذلك كل Team أداة كل إعلان كامل نتيجة schema، و من واحد مشترك helper ضيق تجميع تصيير.

## Testing

Package test بـ تدريجي ملف 100% coverage تغطية هوية، اسم حرف و إذن فحص،provider اختيار، مسبق إبقاء id حفظ دائم اندفاع مفاجئ،child-before-Lead flush ترتيب، حمل دائم provisioning فشل و pending-inbox JSONL مقابل حساب،target-local تزامن ترتيب،pending/history ذهاب إعادة،mailbox حد مقدار،flush بعد notification، إلغاء في طريق إنشاء و dispatch محدود dispose،failed member cleanup،task CAS و DAG تحقق،write-scope warning،wait cancel/timeout، إبقاء inbox interrupt، عادي fork عزل، قديم control shadowing، إعلان schema ضيق تجميع نتيجة تصيير و scoped registration HMR. واحد بند keyless منتج لقطة سوف عبر `dsh --profile headless` تحميل Agent Teams profile bundle، و لـ اثنان عدد teammate، اعتماد مهمة،peer إلقاء تمرير، انتظار، إتمام و تجميع مجموع ثابت كامل موجه إلى نموذج أداة قائمة،Team policy و حمل دائم workflow إسقاط.CLI e2e سوف إعادة استخدام نفس عدد تحديد صفة adapter، و تحقق حمل حمل دائم Team و child سجل صحيح معتاد خروج.

## Consequences

Lead Session سوف مع حال كامل task/member لقطة و mailbox acknowledgement زيادة طويل. هذا تصميم استخدام يمكن مستقل فحص استعادة قدرة تبديل أخذ أكثر ضيق تجميع delta؛ إعداد task و pending-mail حد مقدار حد active state، بينما deleted و delivered تاريخ سوف إبقاء append-only، مباشر إلى أكثر واسع عام Session retention توليد فاعلية.

active roster member يمكن لا إقامة إبقاء، لذلك `inactive` لا يمثل فشل،send ممكن إنتاج cold-resume تأخير متأخر. مؤقت inspection،resume أو inbox دقيق دخول فشل ممكن إبقاء تحت حمل دائم queued رسالة انتظار استعادة.failed member سوف دائم دائم احتلال استخدام اسم حرف و member slot، جعل provisioning failure إبقاء مرئي بينما لا هو ساكن صامت عودة استلام هوية.

تنسيق ضبط يمكن خفض منخفض checkout اندفاع مفاجئ عام معدل، لكن لا يمكن إزالة حذف نظام الملفات CAS أداة خارج كتابة. نهائي diff و اختبار ما زال هو Lead تجميع صار حد.

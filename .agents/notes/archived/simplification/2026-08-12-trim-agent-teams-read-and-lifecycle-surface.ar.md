# Agent Note: Trim the Agent Teams read and lifecycle surface

Status: implemented
Archived: 2026-09-04

[English](2026-08-12-trim-agent-teams-read-and-lifecycle-surface.md) | العربية

## Problem

Agent Teams دمج إدارة أرض يملك حمل دائم roster،peer mailbox و مشترك مهمة سياسة،subagent continuation manager فإن يملك continuable child Activation. لكن رقم واحد إصدار ما زال في هذا اثنان صنف زاوية لون بين تكرار بيانات و دورة الحياة آلية.

قراءة جدول وجه إصدار `TeamSnapshot`، منها يتضمن لا يوجد إنتاج استدعاء جهة قراءة pending mail.Web `team.get` لـ Team identity و عام revision استدعاء هذا snapshot، إسقاط منها تجميع دمج، مجددا استدعاء `listMembers()` و `listTasks()`؛ متصفح حيث لا استخدام قد بحث عنوان مرور Team id، أيضا لا استخدام عام revision. عام member و task view أيضا تكرار داخلي حقل:member `error` و `diagnostics` تكرار،task `ownerId` و نموذج/UI استخدام owner name تكرار،task ختم الوقت لا يوجد قراءة جهة.`SpawnTeammateResult.initialMessageId`،`TeamDeliverySource` و عام resolved config type نفس مثال لا يوجد إزالة استهلاك من.

حمل دائم member،task،message و acknowledgement payload نسخ Session event envelope قد يملك ختم الوقت.message `targetName` تكرار غير ممكن تغيير roster lookup.fold فقط أخذ هذه قيمة و ذلك قديم فرعي هذا متبادل متبادل تحقق، لذلك مقدار خارج حقل زيادة صيغة و تحقق شفرة، لكن لا قرار سلوك.

`waitForChange()` إرجاع طويل درجة لـ صفر أو واحد `changes` عدد مجموعة، يحمل مجال kind و Lead-log revision، لكن كل استدعاء جهة كل سوف قيام أي إعادة صف خروج مرجعي حالة. إعداد طقم `team/changed` event لا يوجد إنتاج listener.Team interrupt التفاف مرور subagent تخويل و إلغاء دلالة، مباشر استدعاء `Agent.cancel()`.Team teardown أيضا ذاتي سطر تركيب cancel،descendant drain،`whenIdle()` و Agent registry جولة استفسار، كل إدارة فقط لديه continuation manager يملك Activation release.

## Decision

Team خدمة إبقاء مستقل منتج مسؤولية: حمل دائم أداة اسم roster،Lead-log mailbox و task DAG. هو لن و عام subagent catalog أو task service دمج.

في `@deepseek-ai/dsh-experimental-agent-team` داخل،`TeamService` هو موجه إلى Cordis façade و disposal تنسيق ضبط من.`TeamJournal` مسؤول كل Lead transaction ترتيب و append-plus-flush إصدار؛`TeamRoster` مسؤول membership و provisioning؛`TeamMailbox` مسؤول target-local dispatch،acknowledgement و retry حالة؛`TeamTaskBoard` مسؤول task تخويل،DAG transition و إرسال توليد view؛`TeamActivity` مسؤول حالي waiter؛`TeamRuntimeLifecycle` مسؤول وحيد دقيق دخول قطع توقف و محدود settlement. هذه حزمة داخل collaborator مشترك قائم service capability، لا إصدار مقدار خارج Cordis service.

حذف لم استخدام snapshot API و عام Team revision.Host قراءة فقط إرجاع roster و task view، لا تكرار قد بحث عنوان Team id.member failure فقط في `diagnostics` ظهور مرة.task view كشف `ownerName`، يأخذ `ownerId` إبقاء في حمل دائم خدمة تنفيذ داخلي.spawn فقط إرجاع member view، قد تحقق config تعديل لـ خاص.

حمل دائم Team value فقط إبقاء إعادة تشغيل Team سلوك الذي يحتاج حقل.Session event `seq` و `time` مسؤول ترتيب و وقت؛roster membership مسؤول غير ممكن تغيير اسم حرف.member/task/message ختم الوقت،message `targetName` و acknowledgement `deliveredAt` متساو حذف.task CAS إبقاء task-local `revision`، لأن هو هو سلوك حقل، بينما غير مراقبة قياس بيانات وصفية.

`waitForChange()` الآن إرجاع `{ timedOut }`. قد إيداع Team append أو live member-status edge سوف في الذي تابع flush بعد نداء تنبيه حالي waiter، استدعاء جهة مع بعد إعادة صف خروج حالة. لم استخدام `team/changed` event،change kind،change revision و disposal sentinel واحد و حذف.

Team `interrupt()` أولا تحليل حمل دائم roster name، مجددا بـ تأكيد قطع ancestor authority تفويض حمل `SubagentService.interrupt()`.Team teardown اختيار roster في تأكيد قطع live direct-child id، و استدعاء جديد continuation عملية `drainContinuableChildren(parent, childIds)`. هذا عملية تحقق تأكيد قطع مباشر كل حق، تزامن فتح بدء الذي اختيار Activation disposal، تمرير عودة بـ child-first تحرير بعد بديل، لا أثر sibling و parent-wide admission، نقص مقعد هدف نظر لـ no-op. كامل teardown سوف صاف فارغ pending inbox؛ فقط لديه interrupt تحمل وعد `keepInbox`.

إنشاء و dispatch متابعة استخدام قسم مغادرة in-flight set، لأن dispose يجب أولا انتظار إنشاء، مجددا انتظار إنشاء recovery ممكن تسجيل dispatch.mailbox حمل دائم enqueue/acknowledgement،target-side ذهاب إعادة،FIFO dispatch إصلاح،provisioning مقابل حساب و Host fold fallback إبقاء ثابت.

## Alternatives considered

**يأخذ Team messaging دمج دخول subagent follow-up.** مرفوض.subagent follow-up حسب Session id بحث عنوان child و مسؤول Activation إلقاء تمرير؛Team messaging مقدار خارج توفير غير ممكن تغيير اسم حرف،peer تخويل، أولا حمل دائم enqueue مجددا إلقاء تمرير،quiet inactive سلوك،acknowledgement،retry و sender framing.

**استخدام عام task service استبدال Team task.** مرفوض.Team board هو حمل CAS revision،member owner،dependency،tombstone و advisory write scope Lead-log DAG. هذه هو منتج دلالة، لا هو تكرار تخزين plumbing.

**لـ لم قدوم إزالة استهلاك من إبقاء عام حقل.** في أول مرة tag إصدار قبل مرفوض. كل حذف حقل كل لا يوجد إنتاج قراءة جهة؛ إذا لم قدوم لديه أداة جسم منتج حاجة pending mail أو وقت، يمكن من مرجعي سجل إسقاط.

**في Team teardown في حجز قراءة `agent/disposed`.** مرفوض.teardown وقت التشغيل Team fiber قد في حل ربط، جديد event registration بلا فاعلية. أكثر إعادة يلزم هو،observer ما زال سوف تكرار continuation manager كل حق، بينما لا هو اشتراط owner تحرير تأكيد قطع child.

**مقابل Lead استخدام `drainContinuableDescendants()`.** مرفوض، لأن هو سوف إيقاف غير Team continuable child، و إغلاق كامل Lead جدول نظام دقيق دخول. مقابل كل teammate drain descendants أيضا فقط سوف إيقاف حفيد درجة، يأخذ teammate Activation ذاته إبقاء إعطاء Team جولة استفسار.exact-child عملية مباشر جدول بلوغ الذي يحتاج تجميع دمج.

**في كامل teardown وقت إبقاء teammate inbox.** في حقيقي handle lifecycle اختبار بعد مرفوض.`AgentHandle.dispose()` هو كامل release، سوف صاف فارغ لم claim inbox عمل. يأخذ هو وصف صار يمكن استعادة parking هو خطأ؛interrupt ما زال هو إبقاء pending input غير disposing عملية.

**يأخذ الكل runtime مسؤولية إبقاء في واحد `TeamService` class في.** مرفوض، لأن هذا class سوف معا يملك متبادل لا متبادل صلة task policy،roster provisioning،mailbox delivery queue،waiter و shutdown settlement. حزمة داخل state owner في إبقاء مفرد واحد عام service معا، يجعل كل مجموعة مختلف خطوة حالة و lifecycle controller ملكية في مسؤول تسوية هو جمع operation family.

## Testing

Subagent اختبار تغطية exact-child selection، تكرار id،sibling عزل، تمرير عودة descendant release، خطأ parent تخويل و manager نقص مقعد وقت no-op.Team اختبار تغطية تفويض حمل interrupt، محدود exact-child teardown،provisioning cleanup،mailbox recovery،wait wake/timeout/dispose، و تقليص نقص بعد view و حمل دائم سجل؛ أبيض صندوق failure injection مباشر وصول حزمة داخل roster،mailbox و journal owner، لا توسيع عرض `TeamService`.Host،tool و client اختبار تغطية تقليص نقص بعد wire و نموذج مرئي نتيجة.typecheck تغطية Host و متصفح جدول وجه عام حذف.

## Consequences

Team و subagent ما زال هو مستقل capability seam، لكن فقط لديه واحد دورة الحياة owner.Team اختيار أي بعض roster child يخص ذلك وقت التشغيل؛subagent تنفيذ interrupt و Activation teardown.Team جدول وجه أكثر صغير، حمل دائم سجل لم يعد مرآة مثل Session envelope،wait مستهلك أيضا لن يأخذ تلميح صفة change kind أو revision خطأ عند عمل متسق snapshot. حزمة داخل state ownership يجعل `TeamService` مخصص ملاحظة في عام operation،Cordis event wiring،recovery ترتيب و disposal ترتيب؛ هذا تفكيك قسم زيادة داخلي module، لكن لا تغيير عام API أو حمل دائم صيغة.

Web `team.get` ما زال لـ member و task كل طي مرة. مستهلك لا اشتراط متسق تركيب snapshot، بينما زيادة زيادة كمية cache سوف جذب دخول مستقل متسق صفة آلية، لا هو مقابل هذا seam بسيط تحويل.

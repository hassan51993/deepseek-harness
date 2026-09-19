# Agent Note: فعلي تحقق صفة Agent Teams Web تحكم عنصر

Status: implemented
Archived: 2026-09-04

[English](2026-08-06-agent-teams-web.md) | العربية

## مشكلة

حمل دائم Agent Teams runtime مسؤول roster،mailbox و task حالة، لكن فقط توفير نموذج أداة و Host service method.Web مستخدم حاجة فحص نظر teammate نشط حركة، حسب نفس مثال compare-and-set قاعدة إدارة مشترك مهمة، و فتح teammate جلسة.Agent Teams ما زال موضع في فعلي تحقق مرحلة مقطع، لذلك هذه قدرة لا يستطيع نحو مستقر API Proxy،Session Controller،Client UI package أو Web bundle زيادة Team مخصص استخدام contract أو اعتماد.

## قرار

خاص `ctx.agentTeams` service حذف domain operation خارج، أيضا مباشر مسؤول توليد صيغة `agentTeams/view`،`agentTeams/createTask` و `agentTeams/updateTask` Remote method.Team package مسؤول متصفح أمان view و mutation-result type.View يتضمن roster و حالي task حالة، لكن لا يتضمن pending mailbox محتوى أو قد حذف task tombstone.Create و update rejection عبر غلاف إغلاق business result عبر تجاوز Remote؛ مرور مدة update revision إبقاء لـ `team-task-conflict`، أخرى Team rejection إبقاء لـ `team-rejected`. معنى خارج failure ما زال هو عادي `RemoteResult` failure.

`@deepseek-ai/dsh-experimental-client-ui-agent-team` عبر مستقر `ctx.remote` service تركيب `@deepseek-ai/dsh-experimental-agent-team/remote` contribution، مع بعد مباشر إزالة استهلاك توليد صيغة `ctx.remote.agentTeams` method، لا زيادة Client result حزمة تركيب طبقة. هو عرض roster status،model و diagnostics، و دعم حمل task create،edit،dependency update،assignment،completion،reopen و deletion. كل مرة update كل إرسال حالي عرض revision. كل create أو update كل مستقل يحتفظ pending token، في بدء قبل جعل أكثر مبكر refresh بطلان، و في نجاح بعد إعادة قراءة كامل Team view.Conflict فقط في ذلك reload نجاح بعد اشتراط مستخدم فحص؛ إذا إعادة قراءة فشل، فإن إبقاء هذا خطأ. إعادة تراكم refresh فقط إصدار الذي اختيار Session الأكثر جديد طلب.

Teammate navigation استخدام قائم `{ parentSessionId, childSessionId, mode: 'continuable' }` Subagent address، لا حمل Team tag.UI تحديث جديد مباشر child catalog، مجددا مرة فحص الذي اختيار Session، لكن بعد فتح addressed conversation.History و لاحق شخص صنف prompt استخدام مستقر Subagent مسار؛Team mailbox فقط لأجل Team أداة إرسال بدء Team peer delivery.

`@deepseek-ai/dsh-experimental-agent-team-web-profile` في مستقر Web bundle بعد فقط إدراج دخول UI. هو و Host جانب `@deepseek-ai/dsh-experimental-agent-team-profile` واحد بدء تطبيق، بعد من قد إدراج دخول `ctx.agentTeams` و نموذج أداة. اثنان عدد مستقر bundle كل لا يتضمن منع استخدام Team row أو اعتماد.

مستقر Web preset ما زال سوف في ذاته preset scope داخل تسجيل continuable Subagent control. قمة طبقة Agent Teams profile override لا يمكن استبدال هذه registration، لذلك هذا فعلي تحقق صفة composition ممكن معا كشف Team roster و legacy child control.Team-aware Web preset مؤقت مؤقت تنفيذ؛[Web profile README](../../../../packages/experimental/agent-team-web-profile/README.ar.md#known-limitations-and-deferred-work) مسؤول سجل حالي حد.

## حد

Web UI لا توفير mailbox timeline،worktree أو Git control،teammate creation،rename،deletion،interrupt أو تلقائي merge. هو لن من task ownership أو write scope دفع قطع نظام الملفات إذن. تنقل إلى teammate بعد شخص صنف continuation هو عادي addressed-child prompt، لا هو Team mailbox message.

## اعتبار مرور بديل خطة

**توسيع legacy API Proxy Team RPC map.** رفض، لأن هذا سوف يأخذ فعلي تحقق صفة domain وضع دخول مستقر wire package، و تكرار توليد صيغة Remote vocabulary و validation.

**جذب دخول مستقل متصفح Remote service.** رفض، لأن هذه method لا يوجد منطقة آخر في `ctx.agentTeams` حالة،lifecycle أو policy owner؛ ثاني عدد Cordis service سوف تكرار Team injection، و اشتراط آخر عدد package توفير نفس عدد Typert namespace.

**نحو مستقر Subagent address و prompt routing إضافة Team metadata.** رفض، لأن عادي child navigation قد معرف جلسة؛Team tag سوف يجعل مستقر Client و Subagent contract اقتران دمج فعلي تحقق صفة mailbox policy.

**في مستقر Web bundle في إضافة دخول منع استخدام Team row.** رفض، لأن منع استخدام row ما زال سوف إنتاج release اعتماد، و يجعل فعلي تحقق صفة package يصبح مع مرفق composition واحد جزء.

## اختبار

Team service اختبار وحدة، توليد مسار و plain-Node built-artifact smoke تحقق مباشر Remote method،error mapping و توجيه خروج descriptor.Client typecheck و متصفح component test تغطية تركيب namespace،Lead routing، أصلي توليد صيغة result، كل task action، مستقل pending operation، كامل task board reload، نجاح و فشل conflict reload، قديم قديم async result،navigation،dispose و حالة أو خطأ عرض.Web طرف إلى طرف اختبار أولا تأكيد overlay انتظار في اثنان عدد مع مرفق فعلي تحقق صفة profile طبقة، مجددا تشغيل حقيقي Host Remote flow.

## عاقبة

Team service هو domain state و عام اختيار تحديد Team value Remote operation وحيد Cordis owner. مستقر API Proxy،Session Controller،Client UI package و Web bundle إبقاء Team غير متصل. شفرة المصدر checkout مستخدم يجب نحو Web profile إضافة اثنان عدد لديه ترتيب experimental profile طبقة.Promotion سوف إعادة تسمية فعلي تحقق صفة npm package، لكن لا اشتراط جديد توليد صيغة namespace.

# Agent Note: مستخدم وحيد احتلال goal مؤقت توقف و كشف فوري تنشيط حالة

Status: implemented

[English](2026-09-03-user-owned-goal-pause-activation.md) | العربية

## مشكلة

[مضيف إرسال بدء goal مؤقت توقف في توقف حالي جولة](../../archived/bug-fix/2026-09-01-host-goal-pause-aborts-turn.md) إصلاح حالي نموذج جولة لا إيقاف مشكلة، لكن بعد شخص صنف جولة ما زال يمكن عبر `update_goal resume` حل حذف حمل دائم `paused` goal.Web بند حمل أيضا فقط قراءة حمل دائم `goal` إسقاط، لذلك active-but-disarmed goal و armed goal تصيير نفسه، و توفير نفسه مؤقت توقف حركة عمل.

## قرار

`ctx.goals.get` الآن هو واحد فقط قراءة Remote طريقة.`GoalService` في عملية محلي activation تغير وقت إرسال خروج `goal/activation-changed`، تحميل حمل لـ `{ sessionId, goal: { id, revision, activation } }`،clear بعد فإن لا يحمل goal.API Remote سماح قائمة يأخذ هذا نسخة JSON تحميل حمل تحويل إرسال إعطاء Web عميل.

GoalBar إزالة استهلاك من slot inject إنشاء registrant-private activation hook source. هذا source فقط في إطار هيكل hook مراقبة خلال بدء، قراءة `ctx.remote.goals.get`، حجز قراءة `goal/activation-changed`، و في running حالة أو اتصال reset وقت تحديث جديد.activation حد دفع دخول epoch، جعل في طريق قراءة بطلان، لذلك مقارنة قديم HTTP استجابة لا يستطيع تغطية تحديث حد؛running تحديث جديد سوف إبقاء الأكثر بعد مرة activation، مباشر إلى قراءة إتمام.Active goal فقط في armed وقت تصيير `Ongoing Goal`؛active-but-disarmed goal تصيير `Inactive Goal`، كشف resume بينما لا هو pause؛ حمل دائم paused goal متابعة كشف resume. مؤقت توقف مرجعي ما زال يخص goal مجال و شخص صنف `/goal resume` أمر، هو جمع ما زال يمكن استعادة كل يمكن استعادة phase.

`update_goal resume` سوف في استدعاء goal خدمة قبل استخدام `GOAL_TOOL_RESUME_PAUSED` رفض حمل دائم paused goal. هو ما زال سوف في جلسة استعادة أو fork بعد استعادة active-but-disarmed goal، و في شخص صنف اشتراط متابعة وقت استعادة blocked goal. نموذج نص التوجيه و أداة وصف شرح حمل دائم paused استعادة من مستخدم وحيد احتلال.

## اعتبار مرور بديل خطة

**يأخذ activation تخزين دخول حمل دائم `GoalSnapshot`.** مرفوض: حسب goal مجال اتفاق،activation هو عملية محلي، أبدا قدرة عبر استعادة أو fork تخزين نشط.

**يأخذ activation إضافة دخول حمل دائم session projection.** مرفوض: إسقاط حالة سوف كتابة فحص نقطة؛ ذاكرة مؤقتة `armed` سوف في قوة تركيب هو عملية إزالة فقد بعد متابعة خطأ وجود.

**يأخذ كامل scoped `goal/changed` حدث تحويل إرسال إعطاء عميل.** مرفوض: ذلك `Agent` تحميل حمل لا هو JSON wire بيانات. مخصص استخدام activation حدث فقط يحمل عميل حاجة session id،goal ref و activation.

**سماح نموذج من ذاتي لكن لغة جولة استعادة حمل دائم paused goal.** مرفوض: شخص عمل مؤقت توقف هو مستخدم تحكم، فقط اعتماد نص التوجيه قيد ما زال سوف يأخذ نفس جولة سحب إلغاء قدرة إبقاء إعطاء نموذج.

## عاقبة

Web بلا حاجة حفظ دائم activation حينئذ قدرة منطقة قسم تشغيل في،disarmed و paused goal. حمل دائم paused goal فقط قدرة عبر Web تحكم عنصر،`/goal resume` أو أخرى مباشر استدعاء goal خدمة استدعاء جهة استعادة؛ نموذج `update_goal resume` فقط حد disarmed-active و blocked goal.API جدول وجه إضافة جديدة واحد قراءة و واحد تحويل إرسال live حدث؛ حمل دائم goal change تحميل حمل و إسقاط stateVersion ثابت. مكون لا يحتفظ Remote حجز قراءة؛activation source التزام دوران قائم inject-hooks live-data عبر طريق.

## اختبار

Goal اختبار وحدة ثابت create،session start و resume مرور مسار في activation حدث id و revision. أداة اختبار ثابت لاحق شخص صنف جولة في حمل دائم paused goal رفض، معا إبقاء قد استعادة disarmed-active goal استعادة.API Remote اختبار ثابت JSON تحويل إرسال.Activation-source اختبار ثابت stale read رفض و running تحديث جديد إبقاء قديم قيمة.Web اختبار وحدة ثابت armed عرض pause،disarmed عرض resume؛ تجميع goal-bar متصفح مشهد عبر fixture timing hook معا ثابت armed و active-disarmed golden.

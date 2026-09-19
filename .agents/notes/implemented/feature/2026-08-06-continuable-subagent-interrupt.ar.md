# Agent Note: Continuable subagent حالي جولة في قطع

Status: implemented

[English](2026-08-06-continuable-subagent-interrupt.md) | العربية

## مشكلة

واحد جارٍ تشغيل continuable subagent لا يمكن في لا إلغاء تدمير هو قبل رفع تحت يتم إيقاف. متابعة تنفيذ إدارة جهاز فقط في كامل Activation تفكيك حذف (تسوية،drain،scoped drain) داخلي إلغاء فرعي Agent،`send_message`/`subagent.prompt` فقط قدرة زيادة عمل، بينما Web composer Stop حسب زر يتم لحظة معنى حد في عادي جلسة. مستخدم يرى continuable child في خطأ مسار فوق حمل متابعة إزالة استهلاك token وقت، حذف إنهاء كامل parent شجرة آخر بلا يد مقطع؛ عند مباشر parent Agent مغادرة خط وقت، أي جعل child Activation ما زال في خط، أيضا تماما لا يمكن مقابل ذلك إجراء تحكم. مرة صفة تشغيل لديه يحتفظ جهة يملك disposal و task-kill؛continuable child لا يوجد مقابل حالي جولة تحكم.

## قرار

`ctx.subagents.interrupt(targetSessionId, authority)` فقط إيقاف في خط هدف حالي جولة. إدارة جهاز أصل لغة تزامن إتمام تمييز حق، استدعاء قائم `Agent.cancel(cause, { keepInbox: true })`، لكن بعد إرجاع `void`——fire-and-return: حفظ إثبات إلغاء إشارة قد إرسال خروج، لكن لا انتظار هدف تماما توقف مستقر. ذلك بقية واحد قطع ثابت: لا dispose Activation، لا تحرير handle، لا درجة ربط بعد بديل، لا صاف فارغ inbox، أيضا لا تعديل `AgentLoop` أو `CancelOptions`. من في `keepInbox` يجعل بعد لم قيادة أخذ انتظار معالجة طابور صف توقف في idle، في قطع أبدا سوف تلقائي بدء تحت واحد ترتيب طابور follow-up؛ قد يتم قيادة أخذ دخول في قطع جولة عمل يخص هذا جولة، لن إعادة دخول طابور. يتم في قطع driver دخول idle بعد، مرة صريح نداء تنبيه إرسال سوف حسب إبقاء FIFO ترتيب استعادة.

تخويل هو واحد غلاف إغلاق مزدوج تغيير جسم union، لحظة معنى مقارنة إلقاء تمرير إذن أكثر عرض، لأن إيقاف واحد جولة هو قوة انتظار كما لا إلقاء تمرير أي محتوى:

- `{ kind: 'user', parentSessionId }`——شخص صنف خروج عرض حفظ دائم مباشر parent عنوان. في خط هدف `session.header.parentSession` يجب مطابقة؛ لا تعلق و في خط parent Agent، دليل قراءة أو حفظ دائم وصول، هذا صحيح هو parent Agent مغادرة خط وقت في خط child ما زال يمكن يتم إيقاف سبب. إلغاء cause لـ `user`.
- `{ kind: 'ancestor', agent }`——واحد تأكيد قطع في خط ancestor Agent(مباشر parent أو أكثر عميق). استدعاء جهة يجب هو سجل التسجيل في ذلك id حالي بند (مرور مدة استدعاء جهة أي جعل هدف لا وجود أيضا يتم رفض) ، لا نيل هو هدف ذاته، و كما يجب ظهور في Activation شيء تحويل وقت سجل `ancestry` WeakSet في. إلغاء cause لـ `parent`.

هدف فقط في إدارة جهاز عملية محلي Activation map في تحليل. لا وجود id——لم معرفة، مرة صفة أو قد ذاتي لكن تسوية——هو يتم قبول no-op، موحد واحد تغطية إتمام تنافس حالة و تكرار طلب بينما لا تسرب كشف حفظ دائم دليل معلومة؛disposal أمر خدمة قد فتح هدف في تمييز حق بعد نفس مثال هو يتم قبول no-op. مرة صفة دورة الحياة (يحتفظ جهة `dispose()`،task-kill) لا تلقي أثر.`SubagentRuntime.interrupt()` يأخذ لم ربط إدارة جهاز تركيب نظر لـ يتم قبول no-op بينما لا هو `CONTINUATION_UNAVAILABLE`، لأن لا يوجد إدارة جهاز حينئذ غير ممكن قدرة وجود إدارة جهاز يملك في خط Activation.

Host RPC `subagent.interrupt` استقبال continuable `SubagentAddress` و إرجاع `{ accepted: true }`. هو تنفيذ فقط بـ `user` تخويل استدعاء نواة قلب أصل لغة——لحظة معنى لا استدعاء `catalogChild()`،`listChildren()`،`sessionQuery` أو parent سجل التسجيل فحص بحث.parent عنوان لا مطابقة في خط هدف خريطة لـ `subagent-unauthorized`؛ معنى خارج فشل خريطة لـ `internal`، لا يأخذ خطأ نص تسرب تسرب إلى wire.

## سبق اعتبار بديل خطة

**يجعل شخص صنف في قطع مشي `session.cancel`.** عام جلسة إلغاء اشتراط مرفق حال عادي جلسة و رفض subagent يملك جلسة؛ وضع عرض هو سوف يأخذ subagent إذن قاعدة التفاف دخول عادي جلسة توجيه.subagent مجال RPC يجعل أساس في عنوان تمييز حق و parent مغادرة خط حفظ إثبات إبقاء صريح.

**انتظار هدف ساكن توقف و إرجاع جولة نتيجة.** إلغاء هو تنسيق عمل صيغة، ساكن توقف وقت بلا فوق حد؛ يجعل RPC(و واحد `ChildLock` مجرى موضع) إبقاء فتح سوف استدعاء يؤدي مهلة و و إلقاء تمرير،disposal شكل صار ترتيب طابور. استدعاء جهة حاجة وحيد واقع هو إشارة قد يتم قبول، بينما تنافس حالة (ذاتي لكن إتمام،disposal) هذا حينئذ قوة انتظار استلام جمع.

**إعادة استخدام كامل Activation disposal قدوم فعل في قطع.** disposal إلغاء لا حمل `keepInbox`، أيضا سوف flush،capture و تحرير handle——هو إلغاء تدمير ترتيب طابور عمل و child إقامة إبقاء. في قطع هو إبرة مقابل واحد جولة تحكم عملية، لا هو إبرة مقابل Activation دورة الحياة عملية.

**ترتيب يد يأخذ `send_message`/`followup` إذن توسيع إلى ancestor.** إلقاء تمرير نحو محادثة حقن محتوى كما لا قوة انتظار؛ ذلك تأكيد قطع مباشر parent إذن إبقاء ثابت. فقط لديه في قطع نيل نيل أكثر عرض ancestor و أساس في عنوان مستخدم تخويل.

**في قطع بعد تلقائي استعادة يتم مؤقت توقف طابور صف.** في في توقف A بعد قيام أي بدء ترتيب طابور follow-up B سوف يجعل في قطع نظر بدء قدوم يتم تجاهل اختصار، و انتزاع مشي شخص صنف إعادة جذب توجيه child نافذة. مؤقت توقف إلى صريح نداء تنبيه إرسال لـ توقف، يجعل إيقاف يمكن مراقبة كما FIFO ترتيب كامل.

## عاقبة

شخص صنف أو ancestor يمكن إيقاف واحد فقد تحكم continuable جولة، بينما لا فقد فقد child، ذلك بعد لم قيادة أخذ ترتيب طابور عمل أو جارٍ تشغيل بعد بديل؛ بديل قيمة هو واحد لحظة معنى إبقاء ضعيف بعد وضع شرط (`accepted` يمثل “إشارة قد إرسال خروج” ، هدف في مراقبة إلى إشارة قبل ممكن ما زال عرض `running`) ، عميل يجب مثل فعلي عرض. مؤقت توقف طابور صف قاعدة معنى طعم حال يتم في قطع child سوف حمل حال إبقاء عمل توقف في idle، مباشر إلى driver دخول idle بعد استلام إلى نداء تنبيه رسالة——هذا هو متعمد human-in-the-loop مؤقت توقف، لا هو مجدول نقص وقوع. في abort استلام جمع خلال يتم قبول نداء تنبيه إرسال هدف قبل سوف إبقاء ترتيب طابور بينما لا قفل تخزين wake؛Issue #1838 تتبع أثر مشترك agent-loop إصلاح صحيح.

فقط سند عنوان RPC سوف كشف واحد بند صلة في في خط إقامة إبقاء حالة اثنان قيمة معلومة: لا وجود هدف سوف يتم قبول، بينما parent لا مطابقة في خط هدف سوف إرجاع `subagent-unauthorized`. مفرد مستخدم محلي Host معلومة مهمة نموذج قبول هذا نوع يمكن مراقبة صفة؛ لم قدوم كثير رئيسي جسم Host يجب إعادة مراجعة نظر إذن و استجابة غير ممكن منطقة قسم صفة.

في Web جانب، جارٍ تشغيل continuable child استخدام متبادل متبادل مستقل Send و Stop عملية: عميل `Session.cancel()` سوف Stop توجيه إلى `subagent.interrupt`(one-shot عنوان إبقاء غير ممكن إلغاء، عادي جلسة ما زال عبر `session.cancel` إبقاء قائم primary Send/Stop تبديل) ، معا Send حسب كثيف مشغول حالة Enter ضبط نمط إلقاء تمرير لاحق رسالة——افتراضي Queue، اختيار بعد لـ Steer——و plain Enter تماما متسق ([كثيف مشغول حالة Send حسب زر](../bug-fix/2026-09-04-busy-send-button-follows-enter-setting.ar.md)).parent مغادرة خط لكن ما زال في تشغيل continuable child إبقاء افتراضي composer، منع استخدام إدخال منطقة و Send، لكن Stop ما زال يمكن بلوغ؛ إيقاف بعد استعادة لـ فقط قراءة وصل إدارة واجهة (دورة حافة دليل و composer اتفاق من [Web subagent محادثة](2026-07-27-web-subagent-conversations.ar.md) يملك).

`dsh-tool-subagent-control` في موجه إلى نموذج `interrupt_agent(agent_id)` أداة يأخذ `exec.agent` بصفة `ancestor` تخويل نقل دخول، ذاته لا زيادة أي إذن: نواة قلب أصل لغة تحقق في خط سجل التسجيل هوية و سجل lineage، لذلك هذا أداة يمكن استخدام نفس عدد عام `agent_id` معامل إشارة تحديد مباشر child أو أكثر عميق بعد بديل——لحظة معنى لا استخدام سوف داكن عرض فقط حد مباشر child `subagent_id`. اكتشاف اعتماد `list_agents({ scope: 'descendants' })`، ذلك قاع طبقة هو جديد `SubagentRuntime.listDescendants()` مفرد مرة تتبع أثر pre-order مرة تاريخ، كل بند حمل مرور تحقق `parentId`/`depth`(قائمة اتفاق من[حفظ دائم دليل note](../../archived/feature/2026-07-22-durable-subagent-catalog-and-list-agents.md) يملك) ؛ اكتشاف فقط هو تلميح، قطعا غير إذن.`send_message` إبقاء ذلك تأكيد قطع مباشر parent إذن——فقط لديه في قطع هو ancestor درجة.

## اختبار

`packages/subagent/subagent/tests/continuation.spec.ts` في نواة قلب تغطية إثبات حفظ دائم `turn/end` في توقف، طابور صف أولا مؤقت توقف بعد حسب FIFO استعادة، بعد بديل لا تلقي أثر، اثنان نوع تخويل و ذلك إلغاء cause،self/sibling/stale/غير ancestor رفض،absent/مرة صفة/disposal تنافس حالة no-op، و `keepInbox` حلقة سلوك ثابت.`packages/subagent/subagent/tests/control.spec.ts` في Remote تغطية إثبات Remote فقط استدعاء نواة قلب أصل لغة (لا قراءة agents/دليل/تاريخ) ، خريطة `subagent-unauthorized` و `internal`، و تنفيذ continuable نمط محيط شريط؛`packages/api/session-controller/tests/transport.host.spec.ts` ثابت نقل تحقق.`packages/api/session-controller/tests/session.client.spec.ts` في عميل تغطية ثابت حسب عنوان توجيه `Session.cancel()`؛InputBar طقم عنصر تغطية مستقل Send و Stop عملية،parent مغادرة خط وقت قفل تحديد إدخال منطقة و Send حالة، و فقط قراءة composer selector تشغيل مثال خارج.keyless تجميع Web مشهد (`apps/web/tests/subagent-interrupt.e2e.ts`،`subagent-interrupt-ui.e2e.ts`) عبر كثير بند replay hang بند إبقاء كثير عدد حقيقي child جولة فتح، طرف إلى طرف إثبات parent مغادرة خط وقت من UI إلى RPC في توقف مسار،Send دخول طابور،follow-up مؤقت توقف و FIFO استعادة.`packages/subagent/tool-subagent-control/tests` في أداة تغطية إثبات مباشر و أكثر عميق ancestor بـ `parent` cause في قطع و مؤقت توقف طابور صف،self/sibling/غريب توليد استدعاء جهة يتم رفض كما لا لمس اصطدام هدف، هدف لا وجود وقت no-op كما لا بارد استعادة، و descendants قائمة pre-order موضع؛keyless ACP لقطة عبر تجميع تطبيق، إبرة مقابل واحد قد تسوية child تنفيذ `list_agents({ scope: 'descendants' })` و `interrupt_agent`، معا قد تسجيل صنع طلب header ما زال ثابت هذا اثنان عدد schema.

# Agent Note: Workspace UI كامل منتج حركة خط

Status: implemented
Archived: 2026-09-04

[English](2026-07-25-workspace-ui-product-flow.md) | العربية

## Problem

[Domain KV storage و Workspace entity](../../proposed/architecture/2026-07-24-domain-kv-storage-and-workspace.ar.md) تعريف Workspace حمل دائم فعلي جسم، مسار مواصفة و لديه ترتيب Session حساب هذا، لكن لا يوجد تعريف Host وصل خط، تاريخ بيانات ابتدائي تحويل أو GUI حركة خط.GUI معا عرض Workspace و Session؛ مستخدم دخول New Session بعد يجب قدرة كاف قيام أي إدخال، أي جعل هذا وقت أيضا لا يوجد Host Session، جدا حتى لا يوجد Host Workspace.

انتظار إنشاء Workspace، انتظار إنشاء Session، إدخال إبقاء و Host فعلي جسم إصدار يجب أداة لديه واضح كل من، و في RPC completion و Host frame بـ مهمة معنى ترتيب وصول وقت إبقاء نفس صفحة هوية. إذا صفر حالة رفع قبل إنشاء Host Session، فإن بلا إدخال صفحة حالة سوف دخول Host دورة الحياة. تاريخ Session أيضا فقط لديه خفيف كمية `SessionHeader.cwd` متاح في عودة مجموعة، ابتدائي تحويل لا يستطيع قراءة حدث متن.

## Decision

### Host و حمل دائم بيانات

Host في Workspace entity فوق توفير التالي GUI وصل خط:

| RPC | سلوك |
| --- | --- |
| `workspace.list` | إرجاع حمل دائم لديه ترتيب Workspace، و مرور ترشيح لم عبر header تحقق Session id |
| `workspace.create({ path })` | حسب canonical path استلام تحرير قد لديه دليل؛ من basename إرسال توليد عرض اسم يمكن تكرار |
| `workspace.insertBefore({ workspaceId, beforeWorkspaceId? })` | في حمل دائم سجل التسجيل ترتيب داخل نقل حركة واحد Workspace، و إرجاع كامل قد إيداع ترتيب |
| `workspace.delete({ workspaceId })` | إزالة Workspace تسجيل سجل، معا إبقاء دليل و جلسة سجل؛ متبادل صلة Session دخول Ungrouped |
| `session.create({ workspaceId, sessionId? })` | من Workspace تحليل cwd، بـ اختياري مسبق قسم إعداد id قوة انتظار إنشاء Session و attach |
| `session.create({ cwd })` | إبقاء إعطاء غير Workspace استدعاء جهة، إنشاء Ungrouped Session |

Host تدفق دفع إرسال Workspace و Session زيادة كمية، يشمل `host/workspace-removed`؛Client إعادة وصل بعد قسم آخر تحديث جديد `workspace.list` و `session.list` أساس خط. حذف تسجيل سجل كل حق و أمان حد من [Workspace تسجيل سجل حذف Agent Note](2026-07-27-workspace-registration-deletion.ar.md) تعريف.

Workspace `sessionIds` هو لديه ترتيب مرشح بحث جذب. عضو إسقاط معا اشتراط id يقع في بحث جذب كما مقابل `SessionHeader.cwd` canonical بعد انتظار في Workspace path؛SessionHeader لا زيادة `workspaceId`.cwd مطابقة لكن لم دخول بحث جذب Session إبقاء Ungrouped، بحث جذب أمر في لكن header ناقص،cwd بلا فاعلية أو cwd لا مطابقة id يتم مرور ترشيح. نفس Session يتم اثنان عدد Workspace بحث جذب احتلال استخدام يخص ضرر تالف حالة و واضح تقرير خطأ.

Workspace domain بـ durable marker منطقة قسم «من لم ابتدائي تحويل» و «قد ابتدائي تحويل لكن لـ فارغ».marker لم ضبط وقت، سجل التسجيل فقط استدعاء `SessionPersistence.list()` قراءة header بيانات وصفية، حيث لا استدعاء `load` أو `inspect`، أيضا لا قراءة تاريخ بيانات أو تحليل حدث متن؛ صالح cwd حسب canonical path قسم مجموعة، مجموعة داخل Session و Workspace مجموعة متساو حسب header `createdAt` خفض ترتيب ابتدائي تحويل.Bootstrap يمكن إعادة دخول، الأكثر بعد عندئذ كتابة marker؛marker كتابة بعد، التفاف مرور `workspaceId` جديد Session لم يعد يتم تلقائي استلام تحرير.

### Client كائن نموذج

`Session` و `Workspace` من صفحة Intent مرحلة مقطع بدء حينئذ هو قبل طرف كائن.

- قبل طرف Session إنشاء وقت مسبق قسم إعداد SessionId، و في كائن داخل يحتفظ Intent target و `pendingPrompt`؛Host `session.create` نجاح بعد ما زال هو نفس عدد Session كائن.
- قبل طرف Workspace في materialize قبل لا يوجد WorkspaceId، و في كائن داخل يحتفظ create input،phase و error؛Host `workspace.create` نجاح بعد نفس عدد Workspace كائن adopt إرجاع view.
- `SessionManager` و `WorkspaceManager` مسؤول كائن بحث جذب،Host أساس خط و زيادة كمية دمج؛ كائن هو Intent و Host view وحيد حالة مصدر.
- `SessionRuntime` توفير Session كائن، حقيقي selection،scope و قائمة إسقاط؛`WorkspaceRuntime` اعتماد `SessionRuntime`، مسؤول افتراضي Workspace، عبر كائن New Session حركة خط و Workspace materialize.

صفحة حتى كثير لديه واحد قبل طرف Session Intent و واحد فقط في صفر Workspace حالة تحت إعداد طقم Workspace Intent.Intent فقط وجود في حالي صفحة، تحديث جديد بعد إزالة فقد؛ حقيقي Session selection يمكن حمل دائم استعادة. اختيار حقيقي Session أو بدء آخر عدد Session Intent سوف وضع ترك قديم Intent تلقائي إرسال مورد إطار، لكن قد من Host إصدار Session و قد قبول رسالة لن تراجع.

Session ذاتي ذات يحتفظ أول بند إدخال و قيادة واحد بند داخلي خط الإنتاج: لا بد يلزم وقت بـ مسبق قسم إعداد id attach إلى Workspace، لكن بعد إرسال `pendingPrompt`.attach و send فشل كل سقوط عودة نفس Session.Workspace إنشاء phase/error فقط يخص Workspace كائن،Session لا نموذج محاكاة Workspace دورة الحياة.

### مستخدم حركة خط

تطبيق أول مرة دخول وقت انتظار Workspace و Session اثنان نسخة أساس خط ready. ما زال صالح حقيقي Session selection يتم استعادة؛ لا فإن دخول New Session، و ثابت اختيار مرة الأكثر قريب Workspace. الأكثر قريب Workspace أخذ ذلك عضو Session الأكثر كبير `updatedAt`، فارغ Workspace رجوع إلى `createdAt`؛ هذا إرسال توليد فقط قرار افتراضي هدف، لا تغيير Host Workspace ترتيب، أيضا لن في لاحق hydration وقت اثنان مرة تعديل اختيار.

تماما لا يوجد Workspace وقت، صفحة إنشاء افتراضي اسم لـ `workspace` قبل طرف Workspace كائن و إشارة نحو هو قبل طرف Session. اثنان من لا كتابة Host،composer بداية نهاية يمكن إدخال؛ أول مرة إرسال عندئذ اعتماد مرة materialize Workspace،attach Session، إرسال رسالة.

قمة جزء New Session،Workspace سطر داخل إضافة رقم و Workspace picker نهائي كل استدعاء نفس New Session حركة عمل: صريح Workspace id مباشر يصبح هدف، لم إشارة تحديد وقت أولا استخدام حالي Session الذي تابع Workspace، مجددا استخدام الأكثر قريب Workspace؛ لا يوجد حقيقي Workspace وقت دخول فارغ أبيض New Session صفحة.Workspace picker مفرد واحد Add workspace حركة عمل (رؤية[مفرد واحد مسار Note](../simplification/2026-07-31-one-route-to-add-a-workspace.ar.md) ؛ هذا قرار فعل خروج وقت هو Use an existing folder و حسب اسم إنشاء اثنان عدد حركة عمل) سوف في مستخدم تأكيد دليل وقت قيام أي إنشاء حقيقي Workspace، مجددا سوف قبل طرف Session هدف تعديل لـ هذا Workspace؛ أي استخدام مستخدم لا إرسال رسالة، صريح إنشاء فارغ Workspace أيضا إبقاء.

جديد بناء Workspace عرض اسم أخذ ذاتي ذلك الذي في دليل. مختلف canonical path يمكن يملك نفسه basename إرسال توليد عرض اسم (رؤية[هوية قرار](../bug-fix/2026-07-31-same-basename-workspace-adoption.ar.md)) ؛ صريح إعادة تسمية عملية ما زال إبقاء عرض اسم إعادة اسم فحص. عبر Workspace نقل حركة Session، من Ungrouped يد حركة استلام تحرير و قسم آخر إدخال عرض اسم و دليل اسم ما زال لا في هذا حركة خط نطاق داخل.

### أول مرة إرسال و استعادة

قبل طرف Session `pendingPrompt` في Host قبول رسالة قبل بداية نهاية إبقاء أصل نص. أول مرة إرسال حسب Workspace materialize،Session attach، نص التوجيه إرسال ترتيب دفع دخول:

1. Workspace إنشاء فشل وقت،Workspace Intent إبقاء إدخال و خطأ،Session ما زال إشارة نحو هذا كائن.
2. Session إنشاء في إصدار قبل فشل وقت،Session Intent عودة إلى يمكن تحرير حالة، بـ نفس مسبق قسم إعداد SessionId إعادة محاولة.
3. `workspace-attach-failed` إثبات Session قد إصدار؛ نفس Session كائن دخول حقيقي قائمة و إبقاء نص التوجيه، لاحق إعادة محاولة attach.
4. نص التوجيه إرسال فشل وقت،Session إبقاء نص التوجيه و فقط إعادة محاولة إرسال، لا تكرار إنشاء Workspace أو Session.
5. Session إنشاء خلال إذا صفحة تبديل إلى آخر عدد Intent، قديم Session أي جعل مع بعد إصدار أيضا لا تلقائي إرسال؛ هو إبقاء أصل نص التوجيه و مرئي خطأ.

RPC استجابة فقد فقد،Host frame أولا في completion و completion أولا في Host frame كل عبر مسبق قسم إعداد SessionId و كائن هوية استلام جمع.Manager مقابل Host view فعل لديه ترتيب upsert، محلي materialize وقت أولوية إبقاء أصل كائن هوية، لا توليد نفس id مؤقت ثاني سطر.

### Sidebar و ترتيب ترتيب

Workspace مجموعة استخدام Host إرجاع حمل دائم ترتيب.Bootstrap مرة صفة تحديد تاريخ ترتيب، صريح إنشاء جديد Workspace وضع في أول موضع،`workspace.insertBefore` فإن حمل دائم تطبيق مستخدم سحب جر ترتيب؛Session نشط وثب لن نقل حركة Workspace مجموعة.

Host تسجيل حساب إبقاء يد حركة `Workspace.sessionIds` ترتيب: جديد attach Session وضع في أول موضع، نشط حركة لن تعديل هذا ترتيب. قسم مجموعة متصفح يمكن تعديل اختيار متصفح محلي الأكثر قريب تحديث عرض؛ عند Session `updatedAt` زيادة كبير وقت هذا عرض سوف يأخذ هو نقل إلى أول موضع، معا ما زال سماح يد حركة ضبط كامل. كل فتح Workspace افتراضي عرض خمسة بند Session، مستخدم يمكن مؤقت توسيع ذلك بقية بند. حمل دائم Workspace إعادة ترتيب ترتيب و متصفح محلي Session ترتيب رؤية [Workspace جانب حافة شريط ترتيب و طي](2026-08-11-workspace-sidebar-order-and-folding.ar.md).

حالي فارغ أبيض Session سوف عرض لـ واحد بند «New session» سطر، لكن لا عرض عدد كمية، وقت وسم أو سطر قائمة مفرد؛ أخرى فارغ أبيض Session إبقاء إخفاء، و يمكن من مقابل Workspace إعادة استخدام. بحث سوف ترتيب حذف فارغ أبيض سطر.

لا يمكن عودة دخول أي Workspace حقيقي Session دخول Ungrouped.Host `session-added` و `workspace-changed` يمكن مهمة معنى ترتيب وصول، قائمة دمج لا اعتماد frame ترتيب.

حذف Workspace تسجيل سجل سوف إزالة ذلك قسم مجموعة، لكن لن حذف أو إغلاق أي Session. قد تسجيل حساب Session(يشمل حالي Session) سوف قيام أي دخول Ungrouped؛ تحديث جديد بعد، مستقل Workspace و Session أساس خط سوف إعادة بناء خروج نفسه نتيجة.

### React و slot حد

React مكون فقط إزالة استهلاك `useSessions`،`useWorkspaces` و session-scoped خطاف، لا يملك فعلي جسم دورة الحياة.Zustand store فقط إبقاء تخطيط، حالي view، عادي حقيقي Session composer نص و أخرى صاف عرض حالة؛Session/Workspace Intent،materialize phase، خطأ و إبقاء نص التوجيه يقع في React-free وقت التشغيل كائن طبقة.

Sidebar و conversation empty hero عبر slot نيل نيل معيار تحويل حركة عمل:`startSession`،`updateSessionPrompt`،`sendSession`،`open` و `toggleSidebar`.Workspace picker إعادة استخدام نفس مكون و `createWorkspace` حركة عمل؛owner فقط توفير popover فتح صلة، مرساة نقطة و اختيار في عودة ضبط. عرض طبقة لا مباشر إرسال `host/workspace-changed`،Host حدث فقط من Host mutation و تدفق مهايئ إنتاج.

## Alternatives considered

**لـ انتظار إنشاء Workspace و Session حفظ مستقل صفحة سجل.** هذا خطة في materialize بعد حاجة استبدال هوية و تحويل تسليم إدخال، خطأ، تركيز نقطة و sidebar سطر؛ كائن ذاته Intent حالة يمكن إبقاء هوية وصل متابعة.

**من عرض طبقة أو root Zustand store تحرير ترتيب كائن دورة الحياة.** هذا خطة سوف تكرار Manager و خدمة مسؤولية، و يأخذ مجال حالة حمل عودة React. معيار تحويل حركة عمل من وقت التشغيل خدمة توفير،slot فقط حقن عرض الذي يحتاج ضيق واجهة.

**صفر حالة قيام أي إنشاء Host Session أو Host حفظ دائم Intent.** لم إدخال صفحة سوف دخول Host دورة الحياة، و تغيير تحديث جديد دلالة؛ قبل طرف Session في أول مرة إرسال قبل فقط إبقاء page-local Intent.

**صريح Create Workspace تأخير متأخر إلى أول مرة إرسال.** مستخدم تأكيد بعد sidebar ما زال نظر لا إلى حقيقي فارغ Workspace، «إنشاء Workspace» و «دقيق تجهيز Session» دلالة خلط دمج؛ فقط لديه نظام تلقائي إنتاج صفر Workspace Intent تأخير متأخر materialize.

**حمل متابعة حسب cwd حركة حالة إرسال توليد Workspace.** هذا خطة لا يمكن جدول بلوغ فارغ Workspace، مستقر عرض اسم و صريح ترتيب، أيضا سوف تلقائي استلام تحرير غير Workspace استدعاء جهة؛cwd فقط لأجل مرة تاريخ bootstrap و عضو مزدوج نحو تحقق.

**Client في Session list وصول بعد حسب وقت دفعة كمية إعادة ترتيب.** أول شاشة سوف أولا عرض Host ترتيب مجددا كامل جسم قفز حركة، إعادة وصل أيضا ممكن تغيير موضع؛ ترتيب ترتيب من Host حمل دائم حساب هذا يملك،Client فقط دمج مفرد بند تحديث.

**في SessionHeader زيادة workspaceId.** هو سوف و Workspace بحث جذب شكل صار اثنان عدد حمل دائم ملكية حقل و اشتراط مزدوج كتابة؛header إبقاء Session ذاته cwd واقع،Workspace بحث جذب مسؤول صريح ملكية.

## Verification

- تماما بلا Workspace صفر حالة لا كتابة Host كما سماح إدخال؛ صريح Create Workspace قيام أي إنشاء و عرض فارغ Workspace.
- قبل طرف Session و Workspace في materialize قبل بعد إبقاء كائن هوية، إدخال، خطأ، تركيز نقطة و sidebar إسقاط بداية نهاية قدوم ذاتي كائن طبقة.
- أول إرسال حسب Workspace،Session، نص التوجيه ترتيب دفع دخول، كل نجاح مرحلة مقطع لا تراجع، إدخال في نص التوجيه يتم قبول قبل لا فقد فقد، إنشاء إعادة محاولة استخدام نفس SessionId.
- Workspace list فقط قراءة header إتمام مرة يمكن إعادة دخول bootstrap؛ قد ابتدائي تحويل فارغ سجل التسجيل إعادة بدء لا تكرار ابتدائي تحويل، عضو قراءة معا تحقق بحث جذب و canonical cwd.
- ابتدائي افتراضي هدف فقط في اثنان نسخة أساس خط ready بعد تحديد مرة؛Workspace مجموعة لا بسبب hydration أو Session نشط وثب إعادة ترتيب، صريح Workspace سحب جر ترتيب في إعادة وصل بعد ما زال إبقاء.
- حالي فارغ أبيض Session يمكن عرض لـ وحيد New Session سطر، معا لا كشف أخرى يمكن إعادة استخدام فارغ أبيض جلسة، أيضا لا عرض Session عدد كمية.
- UI و Host سوف سوف canonical path مختلف لكن basename نفسه دليل وصل قبول لـ مستقل Workspace، بينما صريح إعادة تسمية عملية سوف رفض تكرار عرض اسم؛cwd-only Session، بلا فاعلية تاريخ cwd و لم attach Session إبقاء Ungrouped.
- مرور تأكيد Workspace حذف فقط إزالة تسجيل سجل، إبقاء حالي Session، دليل، ملف و جلسة سجل، و في تحديث جديد بعد إبقاء هذا حالة؛ حزمة درجة اختبار ثابت واحد عنصر استجابة/لقطة/أساس خط تنافس حالة و فشل تراجع سلوك.
- keyless runnable لقطة تغطية صفر حالة، صريح إنشاء و أول مرة إرسال؛ حزمة درجة اختبار تغطية bootstrap، عضو تحقق، ترتيب ترتيب، قوة انتظار، فشل استعادة و مهمة معنى frame ترتيب.

## Consequences

- SessionHeader لا سجل الأكثر بعد نشط وثب وقت، تاريخ bootstrap فقط قدرة حسب `createdAt` ابتدائي تحويل Host يد حركة ترتيب؛ متصفح اختياري الأكثر قريب تحديث عرض في hydration بعد من Session ملخص بدء بناء قيام.
- تاريخ cwd ناقص، دليل بلا فاعلية أو realpath فشل Session إبقاء في Ungrouped؛ هذا مدة لا يوجد يد حركة استلام تحرير مدخل.
- صفحة تحديث جديد سوف إسقاط لم materialize Workspace/Session Intent و بعد لم يتم Host قبول إدخال، هذا هو page-local اتفاق.
- صريح Create Workspace قيام أي سقوط قرص، مستخدم لا إرسال حينئذ مغادرة فتح أيضا سوف إبقاء تحت فارغ Workspace.
- Host Session في أول عدد حدث قبل ما زال التزام دوران قائم كسول حفظ دائم دلالة؛ قبل طرف Intent لا تغيير Host إعادة بدء بعد فارغ Session سلوك.

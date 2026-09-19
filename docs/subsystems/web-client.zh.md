# Web Client هيكل بنية

[English](web-client.md) | العربية

Web Client هو من مستقل تحميل إضافة تجميع بينما صار متصفح جانب Cordis تطبيق. هو لديه أربعة عدد يمكن إعادة استخدام قاع مقعد:[Client Modules](client-modules.zh.md) تحميل إضافة رسم،[API Gateway](../api-gateway.zh.md) توفير نوع تحويل Host عبر معلومة،[Slots](slots.zh.md) تركيب React UI،[Conversation](conversation.zh.md) يأخذ Session تاريخ نافذة تغيير صار كل target ذاتي لديه عرض. هذا نص سلسلة ربط هذه نظام، و قاعدة تحديد Client model و وظيفة حزمة كل منها الذي في موضع.

## قسم طبقة و كل حق

| طبقة | رئيسي يلزم owner | مسؤولية |
|---|---|---|
| Host تطبيق | عمل خدمة service و `packages/api/*-controller` Host entry | يملك مرجعي حالة، حفظ دائم،mutation ترتيب، وصول سياسة و stream إنتاج. |
| نقل و API assembly | `client/connection`،`api/gateway`،`api/remotes` | بناء قيام Client generation، عام توليد `ctx.remote` method و stream، تحويل إرسال اختيار تحديد Cordis event، و تحمل تحميل إلغاء و نتيجة. |
| Client model | `api/session-controller/client`،`api/workspace-controller/client` | صيانة لا اعتماد React Host حالة مرآة مثل، معالجة stream/unary تنافس حالة، يملك كائن identity و حجز قراءة، و عام استلام ضيق command service. |
| UI adapter | `client/ui-session`،`client/ui-workspace` | يأخذ model observable تحويل لـ root أو Provider ربط Session Slot source، و يملك عرض درجة تنقل و حالة سياسة. |
| Conversation بيانات | `client/ui-conversation`،`ui-chat` و `ui-trajectory` انتظار target package | يأخذ معيار event و ضيق تجميع Assistant تاريخ دفعة مرة تجميع صار متبادل متبادل مستقل target snapshot، و يملك مشترك Conversation shell و إدخال مسار. |
| تركيب و تصيير | `client/ui-slots`،`client/ui-renderer`،`client/ui-layout`، كل UI وظيفة حزمة | إعلان توسيع موضع، دفع توجيه مكون props، يأخذ observable ربط صار React hook، و تركيب نهائي مكون شجرة. |

اعتماد جهة نحو هو Host حالة → Remote نقل → Client model → UI adapter → Conversation أو presentation → Slots → React. مستخدم عملية عبر callback عكس نحو دخول حقن Client service أو توليد Remote namespace.Presentation component أبدا استقبال Cordis `ctx`،transport object أو أخرى وظيفة إضافة تنفيذ.

## متصفح بدء

Host يأخذ تركيب بعد `WebBootGraph` كتابة `window.__DSH_BOOT__`، و في parser-preloaded script تنفيذ قبل تثبيت متصفح module-loader facade. وحدة نظام هو واحد ورقة lazy CommonJS جدول: تحميل bundle فقط تسجيل factory؛materialize entry وقت عندئذ بـ تزامن `require` تشغيل factory، و تحليل platform module و قد إعلان حركة حالة اعتماد.

Web boot kernel إنشاء وحدة نظام، مسبق أخذ `immediately` entry، تركيب vendored Cordis Loader، مجددا إنشاء رسم في كل entry.Cordis service injection قرار تنشيط ترتيب؛module graph ترتيب فقط قرار تزامن import قدرة لا يتم materialize. كامل roster وصول settled حالة بعد،`ui-renderer` hydrate لا اعتماد إطار هيكل boot DOM، و استدعاء وحيد مرة context درجة `renderSlot('root')`.[Client Modules](client-modules.zh.md) مسؤول graph،bundle route،cache revision و loader دقيق عقدة.

## Remote عبر معلومة

Host عمل خدمة service استخدام Typert Remote decorator علامة يمكن استدعاء method.Host generation إنتاج خروج صارم إطار descriptor،runtime codec،declaration merge و source map.Client جانب `api-remotes` assembly اختيار هذه توليد مساهمة، و يأخذ أداة جسم method تعليق إلى `ctx.remote.<namespace>` و Session scope `agentCtx.remote.<namespace>`. وظيفة حزمة اعتماد توليد service face، بينما لا اعتماد Gateway تنفيذ أو Host حزمة وقت التشغيل entry.

Connection يملك request correlation،`/api` carrier،trust check، دقيق Fetch توجيه و connection generation.API Gateway يملك Remote dispatch، إلغاء،logical stream و اختيار تحديد Host event تحويل إرسال.Controller عملية ينبغي دخول توليد Remote method أو صريح Remote stream؛ وظيفة ذاتي لديه تحت تحميل فإن تسجيل دقيق Fetch توجيه.[API Gateway مشاركة اعتبار](../api-gateway.zh.md) تعريف generation و استدعاء،[Connection README](../../packages/client/connection/README.zh.md) تعريف شيء إدارة carrier و معلومة مهمة سياسة.

داخلي `$events` logical stream هو Connection generation source. هو opening `ready` frame يحمل لأجل مسار عرض Host home، و في Host listener قد تركيب، أي controller بدء baseline read قبل بناء قيام generation.`ctx.remote.$on()` يأخذ allowlist داخل عادي event تسليم إعطاء root Client Context، و يأخذ scoped waterfall event تسليم إعطاء قد تحليل Session Context؛waterfall listener يمكن إرجاع نتيجة، استدعاء `next()` أو رفض.

## Client models

كل API controller حزمة كل يملك إعداد مقابل Host face و Client face.Host جانب يملك مرجعي mutation و stream إنتاج؛Client جانب أساس في نفسه توليد wire type صيانة identity مستقر، و React غير متصل model، و عام observable snapshot و command.UI حزمة إزالة استهلاك هذه Client service، لا في component store في نسخ transport state.

### Sessions

[`api/session-controller`](../../packages/api/session-controller/README.zh.md) عام Session list،search،creation،prompt،queue،cancellation،pagination و follow/control stream انتظار Host command. ذلك Client جانب حسب `ClientSessions → SessionManager → Session` مجموعة نسج:

- `ClientSessions` توفير `ctx.sessions`، يملك reference،source count،Session scope و مستقر `SessionBinding` object، و إسقاط لا يحتوي عام current Session اختيار catalog state.
- `SessionManager` يملك list baseline، فوري list/control update، كسول صفة Session instance،queue،projection store،subagent catalog، و pull و بعد إلى update بين اندفاع مفاجئ ترتيب.
- كل `Session` يملك واحد مقطع من `SessionEventLikeEntry` value يمثل وصل متابعة منطق event window،pagination،follow،prompt/control state و توفير adapter إزالة استهلاك observable snapshot.

حمل دائم event مسار فتح `follow()`، ذلك أول لقطة يتضمن حالي header،tail page،cursor و كامل projection baseline. تاريخ record حمل لديه صريح `event` أو `chunks` حكم آخر حقل و حقل مقابل متساو داخلي `event`؛journal أولا تحقق كل بند record منطق seq إغلاق منطقة بين،Client مجددا مباشر يأخذ هذه record إبقاء لـ `SessionEventLikeEntry`، بلا حاجة تدريجي record تحويل. كل شيء إدارة generation كل أصل حسب هذا snapshot أصل فرعي استبدال إبقاء نافذة، مع بعد حسب seq append معيار فوري event.`page()` فقط لأجل أكثر مبكر تاريخ و gap repair. لحظة حالة control stream كل بديل بـ كامل baseline بدء، مع بعد تطبيق queue،job و projection update.

### Workspaces

[`api/workspace-controller`](../../packages/api/workspace-controller/README.zh.md) يأخذ Workspace mutation policy و مرجعي follow feed إبقاء في Host.`ClientWorkspaceModel` يملك متصفح جانب row،order،archived Session id،command echo، و stream/unary تنافس حالة دمج. كل بديل stream أولا إعطاء خروج كامل baseline، مجددا إعطاء خروج `upsert`،`remove`،`order` و `archived` increment؛ إعادة وصل وقت بـ جديد baseline استبدال model.`WorkspaceController` يأخذ هذا model بصفة `ctx.workspaces` عام، بينما `ui-workspace` نحو UI توفير `useWorkspaces` و navigation callback.archived Session id مرور ترشيح كل واحد قسم مجموعة عرض، و قيادة «قد عودة ملف جلسة» ضبط صفحة؛ هذا صفحة يأخذ هذا تجميع دمج و قد تحميل Session summary دمج، لـ كل سطر توفير واحد إلغاء عودة ملف عملية. استعادة سوف استدعاء `workspace.unarchiveSession` Remote، إرجاع كامل تجميع دمج فإن مرور `archived` increment وصول كل Client.

هذا نوع إعداد مقابل لن إنتاج ثاني نسخة عمل خدمة حق متبادل.Host controller قرار حمل دائم حالة و mutation outcome؛Client model صيانة الأكثر جديد متاح محلي projection، في لديه فائدة في تصيير وقت إبقاء object identity، و واضح delayed response و replacement baseline دمج قاعدة.

## Conversation و presentation

`ui-session` تثبيت Session scope adapter، و توفير `useSessions`،`useSessionStatus`،`useSessionRetainInfo`،`useSession`،`sessionId` و `useProjection`.`SessionProvider` يمكن وراثة خارج محيط binding، أيضا يمكن ربط صريح `SessionReference`، لذلك و تخزين فرعي شجرة يمكن إشارة نحو مختلف Session. مجال adapter يمكن متابعة إضافة معيار source، لكن لن يأخذ React hook وضع دخول model object.

`ui-conversation` مقابل كل `SessionBinding.eventSource` فقط ربط مرة. هو event registry يأخذ حمل دائم Session event و Client-only `assistant/live-chunk` update صلة ربط صار مستقر عمل خدمة Context،view registry فإن materialize target snapshot.Chat Assistant،Trajectory Assistant و Turn Tail معا حل تفسير live chunk و حمل دائم settlement في تضمين دخول ضيق تجميع stream، لذلك إعادة وصل و قسم صفحة تاريخ بلا حاجة حمل دائم token سطر يكفي تكرار الآن نفسه Assistant حالة.`ui-chat` و `ui-trajectory` قسم آخر تسجيل ذاتي ذات Definition و builder: هو جمع يمكن حل تفسير نفس event family، لكن لن استيراد أو مشترك ذاك هذا نهائي display model.Shell اختيار واحد قد تسجيل view، مجددا عبر معيار hook و Slot تسليم ذلك snapshot.[Conversation](conversation.zh.md) تعريف Context identity،replay،Location data،target builder و keyed renderer.

`ui-slots` توفير نوع تحويل registry و lifecycle ledger؛`ui-renderer` هو وحيد عبر `useSyncExternalStore` ربط عار observable، يملك React context و تصيير root tree حزمة. وظيفة component عبر دفع توجيه خروج props استقبال framework hook،owner prop،store action و صريح injection.[Web Client Slots](slots.zh.md) صف خروج هذه إدخال، توسيع API و حالي Slot طبقة درجة.

## بيانات عبر مسار

| مسار | ترتيب |
|---|---|
| حمل دائم Session عرض | Host Session log → packed Remote `follow`/`page` تاريخ → Client `SessionEventLikeEntry` window → Conversation Context → target snapshot(`chat`،`trajectory` أو أخرى قد تسجيل target)→ Slot view → React |
| لحظة حالة Session control | Host control baseline → Remote snapshot stream → `SessionManager` queue/job/projection store → Session و list snapshot → معيار hook → component |
| Workspace حالة | Host Workspace baseline و increment → `ClientWorkspaceModel` → `ctx.workspaces.list` → `useWorkspaces` → sidebar،hero و navigation entry |
| scoped interaction | Host Cordis waterfall → API Remotes `$events` → Session Context فوق `ctx.remote.$on()` → الذي تابع UI حزمة → result أو `next()` |
| مستخدم command | component callback → تسجيل بند inject face أو Slot owner → `ctx.sessions`،`ctx.workspaces` أو توليد scoped Remote → Host Controller → مرجعي update → stream أو event projection عودة إلى Client |

## إعادة وصل

شيء إدارة استعادة و منطق استعادة ذاك هذا مستقل.Gateway mux استعادة شيء إدارة WebSocket؛Connection إصدار متاح generation بعد، كل `RemoteStream` قسم آخر إعادة فتح ذاتي ذات logical source.Carrier failure يمكن إعادة محاولة؛business error، غير قاعدة opening item أو protocol violation سوف أمر الذي تابع logical stream إنهاء.

استعادة طريقة من بيانات دلالة قرار:

- حمل دائم Session journal تحقق منطق seq range، و أصل حسب كل generation opening snapshot استبدال نافذة؛`page()` توفير أكثر مبكر تاريخ و إصلاح لاحق range gap.
- Session control و Workspace stream في قطع فتح خلال إبقاء الأكثر بعد مرة إصدار قيمة، مجددا استخدام جديد opening baseline أصل فرعي استبدال.
- عادي forwarded notification لن replay. حاجة يمكن اعتماد استعادة stateful domain يجب توفير baseline،cursor أو صريح query؛scoped waterfall إبقاء ذاته request lifetime.

هيكل بنية في لا يوجد موحد واحد Client `Runtime`،`HostFrame`،`events.mux`،`events.host` أو عام `resync()` API.Connection عام generation state،Gateway إدارة logical stream،Client model فإن حسب ذاته بيانات تعريف replacement أو resume دلالة.

## حزمة حد

وظيفة إضافة حزمة يمكن عبر `import type` مشترك إعلان؛ لا نيل وقت التشغيل استيراد أو تحويل إرسال آخر عدد وظيفة إضافة قيمة. عبر حزمة سلوك استخدام حقن Cordis service، عبر حزمة UI استخدام Slots. خاص تحديد target Conversation Definition،projection helper و نهائي view data إبقاء في الذي تابع target حزمة في، أي جعل Chat و Trajectory متعمد تنفيذ مستو سطر منطق.

مشترك وقت التشغيل قيمة حاجة واحد مسؤولية استلام ضيق، لا يوجد وظيفة دورة الحياة ساكن حالة owner، مثال مثل `client/store`،`ui-primitives` أو متصفح أمان util حزمة.Transport و توليد API assembly يمكن استيراد وقت التشغيل contribution، لأن تجميع نفس عدد protocol صحيح هو هو جمع صريح مسؤولية. وظيفة حزمة لا يستطيع فقط لـ التفاف مرور هذا قاعدة بينما إضافة `dsh.client.external`.

أصل حسب الذي إضافة توسيع فحص قراءة أربعة مقالة تفصيل دقيق مشاركة اعتبار:

- [Client Modules](client-modules.zh.md):package discovery،loading، مشترك module identity و boot order.
- [API Gateway](../api-gateway.zh.md):Host method، توليد Remote contribution،stream و forwarded event.
- [Web Client Slots](slots.zh.md):component،hook،store،injection و placement.
- [Conversation](conversation.zh.md): حمل دائم event correlation،target snapshot، و Chat أو Trajectory view contribution.

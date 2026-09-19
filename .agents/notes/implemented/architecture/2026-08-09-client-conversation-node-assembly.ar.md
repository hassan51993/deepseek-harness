# Agent Note: Client Conversation عمل خدمة عقدة تجميع و Chat keyed snapshot

Status: implemented

[English](2026-08-09-client-conversation-node-assembly.md) | العربية

## مشكلة

Client Session حيث صيانة نقل نافذة، اتصال حالة و انتظار معالجة تفاعل، أيضا في في قلب تحويل transcript fold في حل تفسير Assistant،Tool، رسالة، أمر، ضغط، إعادة محاولة و turn tail انتظار عمل خدمة حدث. كل زيادة واحد نوع عمل خدمة عقدة، كل يلزم تعديل Session switch، تاريخ replay، بحث جذب، ذاكرة مؤقتة و React قسم مجموعة؛ عمل خدمة identity، حالة عرض دخول و نهائي عرض لا يوجد مستقل كل من.

نقص قليل target-neutral assembly وقت، تشغيل في Assistant و Tool سوف يقع في finalized flow خارج، تسوية بعد عندئذ دخول حسب سجل ترتيب عقدة قائمة.React parent بسبب بينما تغيير، أي جعل عمل خدمة ID و `key` مستقر أيضا سوف إعادة تركيب. كل كمية تاريخ تحميل،older prepend، فوري append و token streaming إذا قسم آخر مشي مختلف تحديث مسار، مرجع مستقر و نطاق جزء إعادة حساب أيضا فقط قدرة اعتماد كل موضع خاص تحويل ذاكرة مؤقتة.

عمل خدمة حدث بين صلة ربط طريقة و لا موحد واحد.Tool لديه call ID،Assistant بـ turn/step صلة ربط،Compaction لديه مستقل دورة الحياة و checkpoint،Inbox splice فإن يمثل واحد وصل متابعة حالة لحظة بين. يأخذ هذه فرق مختلف متابعة سد دخول موحد واحد fold، سوف يجعل مهمة واحد عمل خدمة تغير كل مرور مرور عام فحص جدول و جعل غير متصل ذاكرة مؤقتة بطلان.

## قرار

Client Runtime توفير target-neutral Conversation Node تجميع جذب محرك، عمل خدمة إضافة تسجيل Event Definition، عرض إضافة تسجيل per-Session View Builder.`ui-conversation` تسجيل رقم واحد دفعة داخل بناء Definition و `chat` builder؛Session فقط مسؤول يأخذ حالي وصل متابعة `SessionEventLikeEntry` window إرسال دخول جذب محرك تزامن نشر هو snapshot، كما لا حل تفسير أداة جسم conversation عمل خدمة.entry خارج طبقة discriminator منطقة قسم معيار و packed record، اثنان من كل يحمل حقل مقابل متساو داخلي `SessionEventLike`، توفير Definition dispatch.

هذا Note إبقاء تنفيذ بعد ما زال لديه قيمة قيمة خطة دفع توجيه، تدريجي عمل خدمة ملائم إعداد، مسؤولية، حساب قاعدة و أخذ ترك.

Chat فقط تسجيل `next-step` Inbox Definition، لأن رسالة تصنيف هو ذلك وحيد مستهلك؛`next-turn` splice ما زال هو حمل دائم Session input، لكن لن إنشاء Chat Context.Chat و Trajectory كل منها صيانة target مخصص تابع next-step state. كل مرة إدراج دخول فقط يأخذ رسالة ID كتابة غير ممكن تغيير splice عقدة. نجاح claim وقت فقط materialize مرة pending سلسلة، بـ حالي دفعة مرة استبدال فوق واحد claimed Set، و يجعل لاحق Context مشترك هذا Set، مباشر إلى تحت مرة claim.AgentLoop سوف في قيادة أخذ تحت واحد دفعة رسالة قبل إلحاق حالي claim وصل قبول الكل رسالة؛ يتم رفض claim لا إلحاق `user/message`، لذلك لاحق تصنيف فقط يحتاج حالي دفعة مرة. تاريخ Context بسبب بينما فقط إبقاء خط صفة ID state، لم يعد إبقاء تراكم حساب عدد مجموعة و Set لقطة.

### مسؤولية مهمة قسم طبقة

| طبقة | طويل مدة مسؤولية | واضح لا مسؤول |
|---|---|---|
| Session | صيانة وصل متابعة منطق event window، منطقة قسم replace،prepend و scalar append، ضبط درجة snapshot إشعار | حل تفسير Tool،Assistant،Compaction انتظار عمل خدمة حدث |
| Event Registry | حسب Cordis دورة الحياة حفظ وحيد `kind` Definition و وحيد fallback | حفظ بعض عدد Session Context أو State |
| Assembler | مطابقة معيار event أو packed run، صيانة Context،Location، اعتماد و إصدار قذر تجميع | إدارة حل عمل خدمة State حقل أو Chat ترتيب |
| Node Definition | تعريف واحد عمل خدمة كائن identity،State عرض دخول،Location data و target Node | إنشاء Context، تعديل آخر عمل خدمة State أو مسح الكل Context |
| View Builder | يأخذ نهائي target Node زيادة كمية كامل إدارة صار هذا عرض snapshot | إعادة حل تفسير `SessionEventLike` input |
| React renderer | حسب نهائي Node `kind` عرض renderer-owned data، و قراءة حالي Node الذي تابع Location فقط قراءة عمل خدمة data | إعداد مقابل عمل خدمة Event، مسح عام Nodes أو قرار عمل خدمة دورة الحياة |

Registry تسجيل هو Cordis effect،Definition إزالة سوف إطلاق قائم Session منخفض تردد registry rebuild. عادي عمل خدمة Event لا تغيير Registry، أيضا لن لذلك إعادة بناء الكل عمل خدمة نوع.

### `ConversationNodeDefinition` مجموع جسم عقد نحو

كل [`ConversationNodeDefinition`](../../../../packages/client/ui-conversation/src/client/contract/conversation.ts) مستقل يملك واحد نوع عمل خدمة كائن من `SessionEventLike` input إلى State و نهائي view Node تحويل.Definition `kind` هو Registry داخل وحيد اسم، أيضا هو عمل خدمة ID نطاق الأسماء.

نفس عدد input يمكن يتم كثير عدد عادي Definition إقرار قيادة. مثال مثل واحد بند Assistant event أو packed run معا تحديث Assistant Node و Turn Tail؛ واحد بند Retry Event معا تحديث Retry،Assistant و Turn Tail.Assembler فقط لديه في الكل عادي Definition كل إرجاع `null` وقت عندئذ استفسار سؤال fallback.

Definition لا يحتفظ عبر Session متغير عمل خدمة بيانات. كل Session Context،State، اعتماد و View Builder كل من هذا Session Assembler عزل يحتفظ.

#### `kind`، عمل خدمة ID و Context key

`match()` إرجاع `id` فقط اشتراط في حالي Definition داخل مستقر.Tool ID يمكن هو call ID،Assistant ID يمكن هو `turn:step`،Inbox ID يمكن هو splice Event seq.

Assembler استخدام `conversationContextKey(kind, id)` تركيب بلا اصطدام اصطدام key؛ مختلف Definition أي جعل إرجاع نفسه `id` أيضا لن مشترك Context. نهائي view Node يجب امتداد استخدام هذا عدد engine-owned key، لا يستطيع يأخذ `seq` أو تصيير موضع عند identity.

كل `(kind, id)` الأكثر كثير وجود واحد start Match. ثاني عدد start سوف قيام أي تقرير خطأ؛Definition حاجة جدول بلوغ جديد دورة الحياة وقت يجب إرجاع جديد ID.

#### `match(event)`

`match(event)` فقط قراءة حالي `SessionEventLike`، إرجاع `{ id, role: 'start' | 'update' }` أو `null`. هو أخذ لا إلى Context،history،Reader،Location أو view envelope.Client-only `assistant/live-chunk` event فقط قدرة بصفة update؛Assembler سوف رفض كل transient start،`start()` استقبال `ConversationStartMatch` فقط يتضمن حمل دائم `SessionEvent`.

هذا بند حد جعل مفرد بند scalar event أو packed run توجيه صار هذا فقط مع قد تسجيل Definition عدد كمية زيادة طويل.Assembler لن لـ حكم قطع واحد بند update يخص من بينما مرة تاريخ هذا Definition تاريخ Context.

start،result،resource،checkpoint و عمل خدمة ذاتي لديه إنهاء Event يجب يحمل أو يمكن مباشر دفع توجيه نفس ID. إذا مفرد عدد Event لا يستطيع حساب خروج ID، إنتاج Event بروتوكول مسؤول تكملة كاف صلة ربط حقل،Client لا عبر “الأكثر قريب واحد لم إتمام كائن” تخمين قياس.

`role` وصف State دورة الحياة، لا وصف مرئي صفة.start يمكن قيام أي توليد terminal Node؛update أيضا يمكن في start بعد لم تحميل وقت أولا دخول pending Context.

#### `ConversationMatch`

مطابقة نجاح بعد،Assembler يأخذ معيار أو packed event،`role` و جذب محرك حساب حساب `location` مجموعة صار فقط قراءة `ConversationMatch`. واحد packed run بداية نهاية فقط احتلال واحد Match، و إبقاء fragment و timestamp-gap عدد مجموعة.

Context `matches` دائم بعيد حسب أول `seq` رفع ترتيب حفظ، بينما لا هو حسب شبكة وصول أو قسم صفحة التقاط دخول ترتيب حفظ.Session journal قد رفض منطق range إعادة تراكم. تاريخ ذيل صفحة أولا ظهور result،older صفحة بعد ظهور call وقت، نهائي Match ترتيب ما زال هو call في قبل،result في بعد.

Location يمكن مع prepend تكملة متساو حد أو append إغلاق حد بينما تغيير.Assembler استبدال تلقي أثر Match فقط قراءة Location و replay Context؛ عمل خدمة لا يأخذ قديم Location فرعي هذا عند مرجعي حفظ.

#### `ConversationNodeContext`

| حقل | كل من | Definition مرئي دلالة |
|---|---|---|
| `key` | Assembler | `kind + id` مستقر نهائي identity |
| `kind` / `id` | Definition + Assembler | حالي عمل خدمة نطاق الأسماء و عمل خدمة ID |
| `matches` | Assembler | حالي نافذة قد استلام تجميع كما حسب أول `seq` ترتيب كامل scalar و packed عمل خدمة دليل |
| `start` | Assembler | وحيد scalar start Match؛ بعد لم تحميل وقت لـ `undefined` |
| `state` | Definition إرجاع،Assembler يحتفظ | الأكثر قريب مرة `start`/`update` قيمة راجعة؛ لم ابتدائي تحويل وقت لـ `undefined` |
| `current` | Assembler | كل target الأكثر قريب مرة materialize Node أو `null` |

Context حقل فقط قراءة، لا يمثل عمل خدمة State يجب هو عميق درجة immutable.Definition يمكن إرجاع جديد كائن، أيضا يمكن أصل أرض تعديل قديم كائن بعد إرجاع نفس مرجع.

Assembler فقط قبول دالة قيمة راجعة.`start()` أو `update()` إرجاع `undefined` هو عقد نحو خطأ و قيام أي تقرير خطأ؛ تعديل كائن لكن لا إرجاع هو نفس مثال لا صار قيام.

Definition يمكن قراءة كامل `matches` مساعد مساعدة بنية صنع State أو fallback Node، لكن لا يستطيع زيادة حذف Match، استبدال Context حقل أو تعديل آخر عدد Context.

#### `start(context, match, reader)`

`start()` هو State وحيد ابتدائي تحويل مدخل.Assembler أول مرة نيل إلى وحيد start بعد استدعاء هو، و اعتماد ذلك إرجاع State.

عند أكثر مبكر قسم صفحة تغيير Context Match ترتيب،Reader قبل ترتيب جواب سجل أو Location واقع وقت،Assembler من `start()` إعادة حساب حساب، بينما لا هو مقابل قديم State فعل جهة نحو متبادل عكس رقعة.

استدعاء `start()` وقت،Context ممكن قد استلام تجميع start بعد updates.`start()` إرجاع ابتدائي State بعد،Assembler ما زال سوف من start بعد حسب سجل صحيح ترتيب تدريجي بند استدعاء `update()`، لذلك التقاط دخول جهة نحو لن تغيير نهائي fold نتيجة.

`reader` فقط في `start()` في متاح. هو سماح ابتدائي تحويل منطق قراءة صارم إطار يقع في حالي start seq قبل، إشارة تحديد `kind` الأكثر قريب active Context، لكن لا إعطاء عمل خدمة واحد مهمة معنى مسح جذب محرك داخلي Map واجهة.

كل مرة إعادة استدعاء `start()` كل سوف استبدال فوق مرة استدعاء تسجيل تسجيل Reader اعتماد، حفظ إثبات Definition تغيير استعلام فرع وقت لن إبقاء قديم قديم حافة.

#### `reader.previous(kind)`

`reader.previous(kind)` فحص بحث ممتلئ كاف `candidate.startSeq < current.startSeq` كما State قد ابتدائي تحويل الأكثر قريب Context. هو لن إرجاع نفس seq، لم قدوم Context أو بعد بلا State pending Context.

قيمة راجعة يتضمن قبل ترتيب Context key،kind،id،start seq، فقط قراءة State و Matches. إزالة استهلاك من ذاتي سطر حل تفسير State؛ مزود فقط مسؤول يأخذ ذاتي ذات State صيانة صحيح تأكيد، لا حاجة تسجيل خاص تحويل query طريقة.

Reader كل مرة استعلام كل سجل `{ key, revision, windowGap }` اعتماد. أمر في قبل ترتيب Context وقت، ذلك revision تغير سوف replay إزالة استهلاك من؛ لم أمر في كما ما زال لديه older تاريخ وقت،window gap سوف انتظار لاحق prepend.

إذا نافذة قد وصول Session بدء نقطة ما زال لم أمر في،`undefined` هو تحديد جواب سجل. إذا `hasMore` لـ true،Definition يرى ما زال هو نفس عدد `undefined`، لكن Assembler سوف تسجيل إقامة هذا هو مؤقت تحديد نتيجة.

اعتماد صارم إطار من مقارنة مبكر start إشارة نحو مقارنة متأخر start، لذلك نقل تمرير replay لا شكل صار وقت ترتيب حلقة.Inbox لحظة بين حالة سلسلة و Message مقابل Inbox قراءة كل استخدام هذا واحد قيد.

#### `update(context, match)`

`update()` فقط معالجة قد من `match()` دقيق توجيه إلى حالي `(kind, id)` post-start durable أو transient Match. هو لا حكم قطع input يخص أي عدد Context.Assistant Definition سوف مباشر fold كل `assistant/live-chunk` update، و في history replay خلال توسيع تضمين دخول صيغة `assistant/message` أو `assistant/attempt` stream.

Assembler حسب `seq` رفع ترتيب استدعاء `update()`. فوري ذيل جزء update يمكن مباشر زيادة كمية تطبيق؛ أي غير ذيل جزء دليل إدراج دخول،start تكملة متساو أو اعتماد بطلان كل سوف من `start()` كامل replay.

لا يوجد عمل خدمة تغير وقت،`update()` إرجاع أصل State. وجود عمل خدمة تغير وقت، هو يمكن إرجاع immutable replacement، أيضا يمكن أصل أرض تعديل و إرجاع نفس كائن.

Assembler لا بـ State مرجع متبادل انتظار حكم قطع هل حاجة إصدار أو نقل بث. كل مرة نجاح update كل زيادة Context revision، علامة dirty، و جعل مباشر أو نقل تمرير Reader إزالة استهلاك من إعادة طلب قيمة.

#### `publication(match)`

`publication()` فقط قرار الأكثر جديد State أي وقت materialize صار view Node، لا تغيير `match()`،`start()` أو `update()` تزامن تنفيذ.

| قيمة راجعة | سلوك |
|---|---|
| `immediate` | طلب حالي microtask إشعار و flush |
| `animation-frame` | عبر مرور ثلاثة عدد متصفح animation frame بعد، يأخذ كثير بند عال تردد تحديث دمج لـ مرة materialization |
| `none` | هذا Match لا رئيسي حركة أمان ترتيب flush،State و dirty علامة ما زال يتم إبقاء |

حذف `publication()` انتظار في `immediate`.Assistant token delta و packed run استخدام `animation-frame`، غير ممكن رؤية Inbox Context استخدام `none`،final، اعتماد replay و Location حد سوف بـ immediate مسار إصدار الأكثر جديد نتيجة.

ثلاثة لقطة بين فصل داخل كل بند live delta ما زال تنفيذ `update()`، واحد تاريخ packed run فإن تنفيذ مرة batch `update()`؛Location-data publication،`buildViewNode()`،View Builder و React snapshot إشعار سوف دمج تنفيذ، لن فقد فقد fragment.immediate publication سوف إلغاء انتظار في لقطة بين فصل، و قيام أي إصدار الأكثر جديد State.

#### `buildLocationData(context, scope)`

`buildLocationData()` يجعل Definition يأخذ State فقط قراءة إرسال توليد قيمة إصدار إلى Engine-owned Step أو Turn، بينما لا يأخذ آخر عدد عمل خدمة متغير State كشف خروج ذهاب.Assembler سوف يأخذ قبل مرة publication نقل عودة هو owner؛ عمل خدمة بيانات لم تغيير وقت،owner أصل مثال إرجاع هذا قيمة.Assembler في كل مرة materialize في ثابت أولا معالجة `step`، مجددا معالجة `turn`، لذلك Turn درجة تجمع دمج يمكن قراءة نفس جولة قد تحديث Step data؛ الكل Location data حينئذ خيط بعد عندئذ استدعاء `buildViewNode()`.

Definition قسم آخر استلام إلى `step` و `turn` scope، يمكن في مهمة واحد مرحلة مقطع إرجاع واحد قيمة أو `null`. قيمة راجعة يجب إعلان دقيق تأكيد turn/step جلوس علامة، و استخدام و Definition `kind` نفسه key؛Assembler يملك استبدال و إزالة، و رفض آخر عدد Context احتلال استخدام نفس Location key.

`ConversationStepDataMap` و `ConversationTurnDataMap` عبر declaration merging قيد key و value.Location فقط كشف مستقر `data.get(key)` reader، إزالة استهلاك من لا يستطيع أخذ نيل مزود Context أو تعديل هو State.

#### `buildViewNode(context, target)`

`buildViewNode()` في إصدار مرحلة مقطع قراءة الأكثر جديد Context، لـ إشارة تحديد target مباشر توليد نهائي عمل خدمة Node.Assembler لا في هو بعد مرفق إضافة عام activity،tail candidate أو layout عمل خدمة طبقة.

`null` يمثل هذا Context مقابل هذا عدد target بعد لم materialize. عادي زيادة كمية مسار في، واحد قد إرجاع مرور غير فارغ Node Context لا يستطيع مجددا إرجاع `null`؛ مؤقت وقت إخفاء يجب إبقاء نفس key Node، و استخدام target ذاتي ذات visibility.

Assembler تحقق Node `key === context.key` كما Node `target === target`. عمل خدمة يمكن تغيير `anchorSeq`،data،Location أو visibility، لكن لا يستطيع في مرة دورة الحياة داخل تغيير identity.

`current` يجعل Definition منطقة قسم “من لم توليد” و “قد توليد بعد حاجة إخفاء”.Assistant retry suppression استخدام هو تجنب تجنب غير قاعدة Node سحب عودة.

واحد Definition الأكثر كثير يملك واحد view target؛ فقط صيانة حالة Definition معا حذف `target` و `buildViewNode()`. أي جعل Chat و Trajectory تعرف آخر نفس حمل دائم Event عائلة، هو جمع أيضا قسم آخر تسجيل ذاتي ذات عمل خدمة Definition؛ مشترك Assembler فإن لـ اثنان عدد target توفير نفسه مطابقة،replay،Location و إصدار آلية.

#### لا توفير عام `end()`

جذب محرك لا توفير ثابت `end()` دورة الحياة. مفرد Event عمل خدمة في `start()` في إتمام، كثير Event عمل خدمة في ذاتي ذات update في سجل إتمام، طويل مدة لحظة بين حالة عمل خدمة فإن كل بند Event بناء قيام جديد Context.

Step/Turn إغلاق يخص خارجي Location واقع، لا بديل عمل خدمة تعديل State. حد تغير سوف replay و build تلقي أثر Context؛ عمل خدمة ربط دمج “ذاتي ذات State هل إتمام” و “Location هل closed” توليد صحيح معتاد،running أو interrupted جدول الآن.

ID لا إعادة استخدام، إتمام Context متابعة وجود في حالي نافذة، حيث توفير مستقر تصيير identity، أيضا يمكن بصفة لاحق Reader قبل ترتيب دليل.

### Location هو واحد درجة جذب محرك واقع

[`ConversationLocationIndex`](../../../../packages/client/ui-conversation/src/client/conversation/location-index.ts) أصل حسب `turn/start`،`step/start`، صريح turn/step payload،`step/end` و `turn/end` بناء قيام معيار event و packed run إلى Location خريطة. نفس row عضو مشترك turn،step،block index و delta kind، لذلك فقط يحتاج بـ أول `seq` بناء قيام واحد بند Location entry.

Location لديه `session`،`turn`،`step` و `unresolved` أربعة نوع شكل حالة.Turn/Step كل منها حمل `open`،`closed` أو `unknown` حالة، و قد تحميل start/end Event.

كل Turn و Step أيضا يحتفظ reference-stable Location data store.Definition تحديث فقط استبدال ذاتي ذات يملك key؛ نفس عدد store identity يمكن مع append أو prepend نيل نيل جديد قيمة، جعل Context،View Builder و React renderer مشترك قد تحديد طبقة درجة عمل خدمة واقع، بينما لا نسخ أو مرة تاريخ عام Node عدد مجموعة.

`unresolved` يمثل حالي تاريخ نافذة نقص قليل كاف كاف قبل ترتيب حد، لا انتظار في session-level.older prepend تكملة دخول حد بعد، بحث جذب إصلاح صحيح Match Location، و فقط replay يملك هذه seq Context.

Append معيار Event فقط وراثة حالي جلوس علامة؛append حد فقط إعادة حساب الذي تابع Turn.Prepend سوف أساس في وصل متابعة `SessionEventLikeEntry` window إعادة بناء Location facts، لكن مرجع مستقر منطق إبقاء لم تغير Turn/Step كائن.

Assembler أيضا يأخذ reference-stable timeline تسليم إعطاء View Builder. عمل خدمة لا تكرار صيانة turn order،step list،last step أو حد Map.

## ثلاثة نوع input window سلسلة مسار

“تاريخ عكس مسح” وصف UI من الأكثر جديد ذيل صفحة نحو Session بدء نقطة تدريجي صفحة تحميل جهة نحو، لا يمثل Definition عكس ترتيب تنفيذ `update()`.Session journal سوف في إصدار قبل تحقق كل بند record منطق range؛ بلا نقاش قسم صفحة تحميل جهة نحو مثل أي،Assembler كل حسب كل قد قبول معيار event أو packed run أول `seq` ترتيب.

| مشهد | إدخال نطاق | Context/State معالجة | View Builder |
|---|---|---|---|
| ابتدائي تاريخ ذيل صفحة أو resync | حالي كامل وصل متابعة منطق نافذة | صاف فارغ و حسب أول `seq` صحيح ترتيب إعادة بناء الكل Context | `replace()` |
| تحميل واحد صفحة older history | فقط نقل عبر range تحقق أكثر مبكر معيار event أو packed run | إبقاء قائم Context identity، تكملة Match،Location و اعتماد بعد نطاق جزء replay | `apply(upserts)` |
| فوري append | واحد بند وصل متابعة ذيل جزء Event | فقط مطابقة Definitions و دقيق تحديث أمر في ID، حد فقط أثر الذي تابع Turn | `apply(upserts)` |

### ابتدائي تاريخ ذيل صفحة و منطق عكس مسح

1. `Session.open()` سحب أخذ الأكثر جديد tail page، و يأخذ وصل متابعة `SessionEventLike` entry تسليم إعطاء `replaceWindow(entries, hasMore)`.
2. `replaceWindow` صاف فارغ قديم Context،start-seq بحث جذب،seq عكس نحو بحث جذب،Reader اعتماد و إدخال Map.
3. الكل entry حسب أول عدد منطق `seq` رفع ترتيب ترتيب و كتابة حالي نافذة.
4. LocationIndex مقابل هذا عدد نافذة إعادة بناء Turn/Step facts.
5. Assembler حسب رفع ترتيب وصول معيار event و packed run، و تدريجي بند استدعاء كل عادي Definition `match(event)`.
6. كل أمر في نتيجة حسب `(kind, id)` أخذ نيل أو إنشاء Context، و يأخذ Match إدراج دخول هذا Context لديه ترتيب عدد مجموعة.
7. لقاء إلى start وقت تنفيذ `start()`؛ قد لديه State ذيل جزء update مباشر تنفيذ `update()`.
8. حالي صفحة فقط يحتوي result/resource بينما نقص start وقت،Context ما زال سوف حسب ID إنشاء و استلام تجميع Matches، لكن State إبقاء `undefined`.
9. الكل input مطابقة بعد،Assembler تكرار فحص Reader اعتماد، جعل نفس نافذة داخل مقارنة مبكر لحظة بين حالة أولا مستقر، مقارنة متأخر إزالة استهلاك من مجددا قراءة هو.
10. كل Context علامة dirty، تحت مرة flush أولا حسب Step→Turn كامل إعادة بناء Location data، مجددا مقابل كل target استدعاء `buildViewNode()`.
11. بعض بعض عمل خدمة في نقص start وقت إرجاع `null`؛Compaction،Command،Tool result أو Turn Error انتظار يمكن أصل حسب ملء قسم update دليل بنية صنع fallback Node.
12. كل View Builder استلام إلى كامل Node تجميع و timeline، عبر `replace()` بناء قيام ابتدائي snapshot.

هذا بند سلسلة مسار “من الأكثر جديد صفحة بدء” فقط حدوث في قسم صفحة اختيار طبقة. صفحة داخلي State بداية نهاية صحيح ترتيب حساب حساب، لذلك نفس عدد نافذة لن لأن مسح جهة نحو مختلف إنتاج مختلف عمل خدمة نتيجة.

نقص start Context لا هو خطأ. هو هو انتظار older صفحة تكملة متساو pending تجمع دمج حاوية؛ هل رفع قبل مرئي من هذا Definition `buildViewNode()` قرار.

إذا حالي صفحة في نفس ID update في سجل ترتيب فوق حق مبكر في start، بينما لا هو فقط فقط أولا يتم تحميل، تكملة متساو start بعد replay سوف تقرير بروتوكول خطأ. وصول ترتيب يمكن عكس نحو، عمل خدمة سجل ترتيب لا يستطيع عكس نحو.

### جديد older قسم صفحة prepend

1. `Session.loadOlder()` بـ حالي `baseSeq` سحب أخذ ضيق مجاور قبل صفحة، و أولا تحقق صفحة ذيل و حالي نافذة وصل متابعة.
2. Session يأخذ قد قبول معيار أو packed entry prepend إلى ذاتي ذات نافذة، فقط يأخذ هذا واحد صفحة نقل إعطاء `assembler.prepend(entries, hasMore)`.
3. Journal قد إسقاط كامل تكرار range و رفض جزء إعادة تراكم؛Assembler مجددا حسب أول `seq` ترتيب صف fresh page.
4. قد وجود Context،State،current Nodes و View Builder نسخة لا صاف فارغ.
5. LocationIndex استخدام توسيع بعد كامل إدخال إعادة بناء facts، و تقرير إبلاغ Location identity حق صحيح تغير seq.
6. يملك هذه seq Context تحديث Match Location، و من start replay؛ غير متصل Context لا مشاركة و Location replay.
7. fresh معيار event و packed run عبر نفس Definition matcher و مستقر ID دخول قد لديه أو جديد Context.
8. جديد صفحة تكملة خروج pending Context start وقت، هذا Context من start ابتدائي تحويل، مجددا صحيح ترتيب تطبيق قد استلام تجميع كل updates.
9. جديد صفحة بناء قيام أكثر قريب Reader predecessor، تغيير predecessor revision أو إزالة حذف window gap وقت، إزالة استهلاك من من `start()` إعادة حساب.
10. Reader اعتماد امتداد start seq نحو بعد نقل تمرير replay؛ نفس نقل بث دفعة مرة لن يأخذ Event عكس ترتيب تطبيق.
11. `hasMore` من true تغيير لـ false فارغ صفحة أيضا سوف تكرار فحص اعتماد، يأخذ مؤقت تحديد `undefined` استلام جمع لـ تحديد لا وجود.
12. flush فقط لـ dirty Context إعادة إصدار Step/Turn Location data و target Node، و يأخذ غير فارغ نتيجة بصفة `upserts` تسليم إعطاء View Builder `apply()`.

Prepend إبقاء قد لديه Context key و current Node identity. جديد صفحة يمكن في Chat `order` قبل جزء زيادة key، أيضا يمكن إصلاح صحيح قائم Node anchor،Location،visibility أو data، لكن لن لـ غير متصل عمل خدمة إعادة إنشاء Context.

Chat Builder لقاء إلى بنية تغير وقت سوف من keyed store إعادة حساب مرئي `order` و Location اثنان درجة بحث جذب؛ هذا هو عرض بحث جذب حساب حساب، لن إعادة تنفيذ الكل عمل خدمة Definition أو استبدال لم تغير Node value.

Reader gap إصلاح هو prepend و عادي append الأكثر كبير حساب قاعدة فرق مختلف. جديد صفحة لا فقط ممكن إنشاء مرئي تاريخ Node، أيضا ممكن تغيير لاحق Inbox لحظة بين حالة و اعتماد هو Message تصنيف.

### صحيح نحو فوري append

1. Session فقط قبول ضيق مجاور حالي منطق tail seq معيار live Event؛ إعادة تراكم وقت ذهاب إعادة، ظهور gap وقت أولا مشي tail-page repair.
2. غير حد Event زيادة كمية كتابة حالي Turn/Step جلوس علامة؛ حد Event تحديث الذي تابع Turn Location facts.
3. Assembler مقابل هذا واحد Event كل عادي Definition استدعاء مرة `match()`، لن مرة تاريخ أي Definition Context تجميع دمج.
4. كل أمر في نتيجة عبر `(kind, id)` مباشر تحديد موضع واحد Context.
5. جديد ID إنشاء Context؛ قد لديه ID صحيح معتاد ذيل جزء update مباشر استدعاء مرة `update()`.
6. start أو أي حاجة إدراج دخول غير ذيل جزء موضع دليل سوف مشي كامل `replayContext()`، إبقاء نفس صحيح ترتيب دلالة.
7. Context revision تغير بعد، فقط امتداد قد تسجيل تسجيل Reader اعتماد replay إزالة استهلاك من.
8. Location close سوف تحديث الذي تابع Turn في تلقي أثر Match Location، و replay هذه Context، جعل لم إتمام Assistant،Tool أو Retry نيل إلى interrupted/cancelled لغة هواء.
9. Assembler تجميع مجموع كل أمر في Definition publication urgency؛`immediate` عال في `animation-frame`، بعد من عال في `none`.
10. Session يأخذ immediate تسليم إعطاء microtask notifier، يأخذ animation-frame تسليم إعطاء RAF notifier.
11. flush أولا لـ dirty Context تحديث Step/Turn Location data، مجددا استدعاء `buildViewNode()`، الأكثر بعد يأخذ هذا جولة upserts و الأكثر جديد timeline تسليم إعطاء View Builder.
12. React حجز قراءة جديد snapshot إعادة استخدام مستقر Context key؛ نفس Tool running→settled أو Assistant streaming→final لا عبر أب عقدة نقل حركة.

Append عمل خدمة مطابقة صار هذا هو Definition عدد كمية إضافة فعلي أمر في Context تحديث، لا مع تاريخ Context عدد كمية زيادة طويل.Reader إزالة استهلاك من و Location إغلاق سوف زيادة و حقيقي اعتماد أو الذي تابع Turn صار مقارنة مثال replay.

Chat `order` بنية صفة تغير ما زال ممكن إعادة ترتيب حالي مرئي key؛ صاف data تحديث فقط استبدال keyed store في واحد Node، و touch الذي تابع Location بحث جذب. هذا داخل حفظ إثبات هو غير متصل عمل خدمة لا refold،Node identity لا استبدال، بينما لا هو إعلان تسمية كل عرض بحث جذب عملية كل هو معتاد عدد تكرار مختلط درجة.

### Replace،prepend و append متسق صفة

ثلاثة بند سلسلة مسار نهائي كل التزام حراسة نفس ثابت كمية:Context Matches حسب seq ترتيب،State من وحيد start صحيح ترتيب fold،Reader فقط نظر صارم إطار قبل ترتيب active Context،Location data حسب Step→Turn إصدار،Node key فقط من kind و ID قرار.

`replaceWindow` هو ابتدائي فتح،resync،gap repair و registry تغير منخفض تردد كامل استبدال، لا لأجل تنفيذ عادي load older.`prepend` و `append` كل إبقاء قائم Builder و Context identity.

قسم صفحة صفحة عرض،record packing، تاريخ تحميل مرة عدد و RAF دمج دفعة فقط أثر أي وقت نيل إلى أكثر كثير دليل أو أي وقت إصدار، لا تغيير منطق دليل نفسه وقت نهائي Context State و Node.

## داخل بناء عمل خدمة مثل أي استخدام Definition

### مطابقة،ID و State

| عمل خدمة / `kind` | مستقر ID | start Match | update Matches | State و عبر Context قراءة |
|---|---|---|---|---|
| Next-step Inbox / `inbox-next-step` | splice Event seq | كل بند علامة لـ next-step `agent/inbox/spliced` | بلا | يأخذ رسالة ID إلحاق إلى حمل دائم splice state؛ كل مرة claim فقط materialize مرة، و نحو Message كشف مشترك حالي claimed batch |
| Message / `input-message` | message ID | append-surface `user/message` | بلا | أصل حسب source توليد context message، أو قراءة الأكثر قريب next-step Inbox حكم قطع user/steering |
| Request Prompt / `request-prompt` | header Event seq | كل بند `request/header` | بلا | عبر Reader قراءة قبل واحد بند Request Prompt، إبقاء كامل prompt حالة، و حكم تحديد system/tool تغير |
| Assistant / `assistant-step` | `turn:step` | `step/start` | Live `assistant/live-chunk`، حمل دائم `assistant/message` أو `assistant/attempt`، نفس step Retry | تجمع دمج block،usage، أول token وقت،settlement دليل و retry-hidden state، مجددا إصدار نفس key Step data |
| Tool / `tool-call` | root call ID | root `tool/call` | root result،PTC dispatch start/result | تجمع دمج root،children و parent Map؛Dispatch Event استخدام `rootCallId` دقيق توجيه |
| Command / `command` | command ID | `command/run` | `command/done`، حمل source command ID compact lifecycle/checkpoint | تجمع دمج command outcome و يد حركة ضغط دليل |
| Automatic Compaction / `compaction` | compaction ID | بلا source command ID `compaction/start` | summary،end،replacement checkpoint | تجمع دمج summary/checkpoint؛checkpoint كاف كاف وقت يمكن في نقص start تحت fallback |
| Retry / `model-retry` | retry ID | attempt 1 `llm/retry` | لاحق `llm/retry` و `llm/retry-started` | تجمع دمج نفس RetryId attempts و scheduled/started حالة |
| Turn Error / `turn-error` | turn number | `turn/start` | error `turn/end` | تجمع دمج terminal failure؛ هذا turn Retry تاريخ مرور من Retry تصيير، أبدا سوف إخفاء هذا سطر |
| Turn Tail / `turn-tail` | turn number | `turn/start` | Assistant،Retry،`step/end`،`turn/end` | حفظ turn end، قراءة كل Step Assistant data، إصدار Turn data؛ كامل Matches لأجل اختيار نظر شعور ذيل جزء anchor |
| Deliverables / `deliverables` | turn number | `turn/start` | هذا Turn Tool call/result | تجمع دمج نجاح mutation paths تزامن نشر Turn data، لا توليد view Node |
| Unknown fallback / `unknown-surface` | Event seq | لم يتم عادي Definition إقرار قيادة append-surface Event | بلا | حفظ أصلي type/data بصفة JSON fallback |

### Chat Node و تاريخ/فوري خاص صفة

| عمل خدمة | `publication()` | Chat ناتج | تاريخ قسم صفحة و وقت التشغيل سلوك |
|---|---|---|---|
| Inbox | `none` | لا توليد Node | prepend تكملة قبل ترتيب splice وقت امتداد Reader سلسلة إعادة حساب next-step ID state؛next-turn لا إنشاء Chat Context |
| Message | افتراضي immediate | `user`،`steering` أو `context` | window gap إصلاح يمكن يجعل نفس message key إعادة تصنيف |
| Request Prompt | افتراضي immediate | ابتدائي طلب، كل صريح تسلسل أو حقيقي system تغير كل توليد واحد غير فارغ `system-prompt` | Step أول بند header مرساة تحديد في طلب رسالة قبل؛prepend تكملة دخول قبل ترتيب header و إثبات system لم تغيير بعد، يمكن إخفاء هذا قبل حفظ حراسة تصيير resume |
| Assistant | scalar chunk و packed run لـ RAF،final immediate، صاف usage/finish لـ none | نفس key `assistant-step`، حالة لـ running/settled/interrupted | scalar و packed reducer انتظار قيمة؛ نقص `step/start` يمكن أولا استخدام Matches fallback؛Location close توليد في قطع جدول الآن |
| Tool | افتراضي immediate | واحد تمرير عودة `tool-call` root، يتضمن الكل `subCalls` | result-only تاريخ نافذة يمكن fallback؛running→settled إبقاء key |
| Command | افتراضي immediate | عادي `command` أو تجميع صار `manual-compaction` | checkpoint وصول يمكن تغيير anchor، لكن لا تغيير Context key |
| Compaction | افتراضي immediate | `compaction` marker | checkpoint يمكن أولا عرض،older تكملة start بعد صحيح ترتيب replay |
| Retry | افتراضي immediate | واحد `model-retry` Node داخل يحتوي attempts | كثير مرة retry تحديث نفس key؛Location close يأخذ الأكثر بعد scheduled جدول الآن لـ cancelled |
| Turn Error | افتراضي immediate | terminal failure وقت `turn-error` | نقص start يمكن من error end fallback؛ هذا turn تحديد إطار Retry سلسلة في ذلك جانب تصيير |
| Turn Tail | فقط `turn/end` immediate، ذلك بقية none | مستقل `turn-tail` footer | من Step Assistant data حساب حساب closing/metrics، و عبر نفس turn Matches قرار anchor |
| Deliverables | افتراضي immediate | لا توليد Node | Tool تسوية زيادة كمية تحديث الذي تابع Turn data،Turn Tail توسيع مجرى قراءة produced files |
| Fallback | افتراضي immediate | `unknown` JSON row | فقط التقاط قاع append surface، عادي عمل خدمة قد إقرار قيادة لكن مؤقت غير ممكن رؤية وقت لن تكرار توليد |

Inbox عرض “كل بند Event كل هو واحد start-only لحظة بين حالة Context” ، لا هو كل عمل خدمة كل حاجة start/update إعداد مقابل. كل next-step state عبر Reader و قبل واحد نفس kind Context شكل صار وصل متابعة fold، بينما غير إعطاء كامل Inbox شخص عمل صنع صنع دورة الحياة ID.state ذاته مشترك غير ممكن تغيير pending splice عقدة و واحد حالي claimed-batch Set؛ لم إزالة استهلاك next-turn input لا دخول Conversation، لأن Chat و Trajectory كل لا قراءة هو قدوم تصنيف.

Request Prompt عرض مثل أي في لا مشترك target State قبل رفع تحت مشترك استخدام صاف حل تفسير منطق:Chat و Trajectory كل منها في ذاتي ذات Definition في استدعاء `inspectRequestPrompt()`. هذا دالة مواصفة تحويل كامل header، و حكم تحديد موجه إلى نموذج system/tool فرق مختلف؛ مع بعد كل target ذاتي سطر اختيار ناتج.Chat سوف شيء تحويل غير فارغ ابتدائي system حقل، حقيقي system تغير، و كل صريح فتح بدء رسالة تسلسل أو ضيق مع جدول طبقة استبدال `series` لقطة. لم تغير `resume` سوف إبقاء في Trajectory و إعادة بناء حالة في، لكن قبل ترتيب header قد تحميل وقت لن تكرار مرئي Chat سطر. عادي فقط إلحاق لاحق Turn لن مجددا مرة كتابة لم تغيير header. واحد Step في أول بند header التزام دوران مزود معلومة غلاف، بينما لا هو header Event موضع:step one استخدام الذي تابع Turn start، لاحق step استخدام كل منها Step start، يأخذ system حقل وضع إلى هذا طلب user-role رسالة قبل؛ نفس Step لاحق header إبقاء في فتح بدء جديد تسلسل جدول طبقة تعديل كتابة بعد. جزء نافذة لم يتضمن قبل ترتيب header وقت، غير `initial` header سوف إبقاء في ذاته Event و حفظ حراسة تصيير.prepend تكملة دخول نفسه قبل ترتيب header بعد، محتوى لم تغيير resume سوف إخفاء لكن لا سحب عودة ذلك مستقر Node key؛ حقيقي تغير ما زال مرئي. كل بند header كل هو كامل لقطة، لذلك قد تحميل نافذة في أول بند `resume`،`change` أو `series` header بلا حاجة سند فارغ بنية صنع و لم تحميل تاريخ مقارنة مقارنة، أيضا قدرة تصيير ذلك system حقل ([resume عرض قرار](../bug-fix/2026-09-03-resume-headers-do-not-repeat-system-prompts.ar.md)).

Retry،Assistant و Turn Tail عرض نفس Event يتم كثير عدد Definition مستقل إقرار قيادة. كل Definition فقط تحديث ذاتي ذات State، نهائي قسم آخر توليد أصل فرعي Chat Node.

Assistant،Turn Tail و Deliverables عرض Location data قسم طبقة تركيب.Assistant مسؤول كتابة جيد كل Step `assistant-step` data؛Turn Tail من هذه Step values حساب حساب `turn-tail` data؛Deliverables مستقل صيانة نفس Turn `deliverables` data. إزالة استهلاك من فقط قراءة إعلان دمج بعد key، لا مسح أخرى عمل خدمة Node، أيضا لا أخذ نيل مزود Context State.

Tool و Command عرض كثير Event تجمع دمج: إنتاج من توفير مشترك نفس ID،Context في عمل خدمة داخلي بنية شجرة أو كامل دمج Compaction، لا يأخذ إعداد مقابل عمل دفع إعطاء Chat Builder.

Compaction و تاريخ Tool result عرض نقص start وقت عمل خدمة fallback. جذب محرك لا موحد واحد قاعدة تحديد “لا يوجد start حينئذ لا تصيير” ؛Definition أصل حسب حالي Matches هل كاف كاف ذاتي سطر قرار.

Retry عرض عمل خدمة State و Location قسم عمل.scheduled/started يخص Retry State؛Step/Turn هل إغلاق يخص جذب محرك Location؛`buildViewNode()` تركيب اثنان من نيل إلى cancelled نظر شعور حالة.

Unknown fallback عرض Registry ownership:fallback فقط معالجة لا يوجد أي عادي matcher إقرار قيادة append surface Event، لن لأن عادي Context مؤقت وقت إرجاع `null` بينما خطأ توليد ثاني عدد Node.

## View Builder و React identity

[`ConversationViewRegistry`](../../../../packages/client/ui-conversation/src/client/conversation/view-registry.ts) لـ كل target حفظ مستقل builder factory، لا مشترك بعض عدد Session ترتيب أو ذاكرة مؤقتة.

shell اختيار أو target source أول عدد subscriber سوف يأخذ هذا target إضافة دخول Session مفرد ضبط زيادة طويل active-target set.Assembler حسب وحيد target بحث جذب كل Context، لكن لن لـ inactive target إنشاء builder،Node أو snapshot. أول مرة تنشيط سوف flush بعد لم إصدار target-neutral عمل، إنشاء builder، و من هذا target حالي Context استدعاء مرة `replace({ nodes, timeline })`.

Session binding متاح، ذاكرة مؤقتة binding يصبح current أو View roster تغير وقت،shell سوف تزامن تحليل حفظ دائم اختيار، مجددا صريح تنشيط قد تسجيل انحراف جيد View أو Chat fallback.Tab و focus action في تحديث اختيار حالة قبل أولا تنشيط تحليل خروج target.blank Session لا تصيير View slot؛`ConversationSnapshot.activeTargets` فقط من قد شيء تحويل active snapshot إرسال توليد، لا استعلام inactive target Context activity.

عادي prepend و append flush فقط مقابل active target استدعاء `apply({ upserts, timeline })`. كامل window replace و Registry rebuild فقط مقابل active target استدعاء `replace()`. إلغاء حجز قراءة لن إزالة target، لذلك إرجاع قد فتح View لن إعادة بناء.

[`ChatSnapshotBuilder`](../../../../packages/client/ui-chat/src/client/conversation-nodes/chat-snapshot-builder.ts) صيانة `order`، حمل هوية مستقر Node و Turn-process source keyed `nodes` store،turn/step `locations` index،`timeline`، و من StatsPills استخدام و مرآة مثل إلى قمة طبقة عام مشترك توافق حقل `legacy` slice.

Chat بنية تغير فقط من جديد key،`anchorSeq`،visibility أو Location identity تغير إطلاق. عادي محتوى تغير لا إعادة بناء `order`؛keyed Node store فقط استبدال هذا key value تزامن نشر ذلك source.Turn-process projector فقط لـ بنية، قاعدة إطار أو حالة حدوث تغير Turn إعادة حساب عبر Node عرض، مجددا فقط إصدار هذا Turn process source.

Builder لقاء إلى بنية تغير وقت من store حالي values حساب حساب visible order، و حسب لم تغير مرجع إعادة استخدام بحث جذب عدد مجموعة.Prepend يمكن زيادة قبل جزء تاريخ key،append يمكن زيادة ذيل جزء أو حسب عمل خدمة anchor سقوط موضع، قائم key لا بسبب ترتيب تغير بينما إعادة تسمية.

[`ChatView`](../../../../packages/client/ui-chat/src/client/chat/ChatView.tsx) فقط مرة تاريخ `order`، و لـ كل key تحليل اثنان نسخة مستقر source. كل [`ChatNodeSeat`](../../../../packages/client/ui-chat/src/client/chat/ChatNodeSeat.tsx) بـ Context key ثابت في نفس عدد أب قائمة في، فقط حجز قراءة ذاته Node و Turn-process source، و حسب `node.kind` توزيع `'conversation.chat.node'` keyed slot.

[`ChatNodeDataMap`](../../../../packages/client/ui-chat/src/client/contract/chat-nodes.ts) هو declaration-merged renderer payload registry. كل عمل خدمة وحدة قسم آخر تسجيل ذاتي ذات Definition و keyed renderer؛`registerConversationNodes()` و `registerChatNodeRenderers()` فقط مسؤول تركيب إعداد هذه مستقل مساهمة، لا عبر closed union أو في قلب switch حل تفسير عمل خدمة. داخل بناء تنفيذ يقع في `ui-chat`، كما هذا نوع و تسجيل حد سماح عمل خدمة نقل دخول مستقل package بينما لا تعديل Chat dispatcher.

`conversation.view` Chat entry في إعلان `conversation.chat.node` child slot وقت موحد واحد تسجيل `ChatNodeTurnDataInjected`.`ChatNodeSeat` يأخذ Node الذي تابع Turn مستقر data store بصفة `hookContext` نقل إعطاء slot؛Slot renderer مباشر في هذا store فوق ربط `useTurnData(businessKey)`، لذلك كل keyed Chat renderer كل قدرة قراءة ذاتي ذات Node الذي تابع Turn قوي نوع فقط قراءة data،Assistant renderer لا يملك خاص خاص حقن إذن.

Slot-level contextual Hook و entry-owned `inject.hooks` هو اثنان بند مستقل مسار. بعد من متابعة فقط ربط registration-owned Observable؛ قبل من حسب مستقر slot inject face ذاكرة مؤقتة تعريف، و حسب مستقر render occurrence ربط factory و Hook.`useTurnData()` حجز قراءة `turn.data.source(key)`، أخرى Location-data key أو Session snapshot إصدار لن إشعار هو.

معيار `useSession` ما زال يخص كل session-scoped slot renderer عام قدرة، لكن `ChatNodeSeat` لم يعد حاجة هو أو تجمع دمج `useChat`.`useTurnData()` هو استلام ضيق معتاد رؤية قراءة طريقة بينما لا هو إذن صندوق رملي. كل نافذة موحد حساب أو مهمة معنى كائن بحث جذب ما زال يمكن صريح استخدام Session snapshot؛ هو جمع لا يستطيع زائف تركيب صار “حالي Node Turn data”.

Assistant streaming إلى final،Tool running إلى settled بداية نهاية إبقاء في نفس عدد Seat، فقط تحديث data و لا بد يلزم ترتيب خاصية. تسوية لن بسبب عبر parent نقل حركة بينما إعادة وضع مكون داخلي State.

عمل خدمة رئيسي حركة يأخذ قد إصدار Node تعديل صار hidden وقت، هو سوف خروج visible order، استعادة visible وقت سوف إعادة mount. هذا هو واضح عمل خدمة سحب إظهار دلالة، و running→settled مستقر Seat حفظ إثبات مختلف.

أداة جسم Tool renderer ما زال من [`ui-tool ownership decision`](../../archived/architecture/2026-08-08-client-tool-presentation-ownership.md) قيد.Tool Definition فقط تسليم تمرير عودة root/subcall data،`ui-tool` مجددا حسب Tool name keyed slot توزيع أداة جسم جدول الآن.

Trajectory إبرة مقابل و Chat نفسه Assembler و `SessionEventLikeEntry` window تسجيل ذاتي ذات target و عمل خدمة Definition. هو target builder إبقاء stage-oriented read model، حيث لا إزالة استهلاك Chat Builder legacy slice، أيضا لا تشغيل مستقل history fold.Chat و Trajectory قسم آخر صيانة مستقل scalar و packed Assistant reducer؛target مخصص تابع Definition لا تغيير مشترك Context،Reader أو Location عقد نحو.

target مخصص تابع Trajectory Definition، إبقاء stage model،Steering ملائم إعداد، تكرار مختلط درجة فوق حد و جدول الآن طبقة حار نقطة من [Trajectory Context تجميع قرار](../../archived/architecture/2026-08-11-trajectory-conversation-context-assembly.md) مسؤول.

## وقت التشغيل و تصيير سلسلة مسار

```text
SessionEventLike window
  -> ConversationNodeAssembler
       -> Definition.match(event) -> (kind, id, start/update)
       -> Context matches + State + Location
       -> Definition.buildLocationData(step -> turn)
            -> StepLocation.data / TurnLocation.data
       -> Definition.buildViewNode() for each active target
  -> active target View Builder
       -> chat: ChatSnapshotBuilder -> ChatView -> keyed ChatNodeSeat
       -> trajectory: TrajectorySnapshotBuilder -> stages/layout/table
```

## تحقق

Runtime tests ثابت Definition دورة الحياة تسجيل،exact-ID append،update-before-start استلام تجميع و start بعد صحيح ترتيب replay،prepend identity،Reader window-gap إصلاح، نقل تمرير اعتماد،Location closure،Step→Turn data phase order،Location data replacement،publication cadence، غير قاعدة سحب عودة، أول مرة حجز قراءة activation، مفرد ضبط active target و per-target Builder.

Conversation tests تغطية الكل داخل بناء Chat Definition،Assistant Step data،Turn Tail و Deliverables Turn data،Chat ترتيب و بنية مشترك،selector isolation،Assistant/Tool running-to-settled identity،nested PTC dispatch،steering،Compaction،Retry،interruption،load-older anchoring و slot dispatch.Trajectory tests فإن تغطية هو مستقل تسجيل Message،Assistant،Tool،Compaction،Request-header و boundary Definition، و متابعة إبقاء stage-oriented view model.

Slot type/runtime tests ثابت أب تسجيل يجب توفير إعلان common inject،`hookContext` نوع، مختلف Node context Hook عزل،factory/Hook identity مستقر، و غير متصل Session publication لا إعادة تصيير عمل خدمة renderer. أصل entry-owned Observable Hook اختبار متابعة ثابت لم استخدام contextual factory مسار.

Assembled Web snapshot،GUI و متصفح مشهد تغطية حقيقي plugin graph. متصفح دليل مقارنة مقارنة Assistant streaming→settled،Bash running→settled و PTC mode root + nested subcalls و master تخطيط.

تاريخ سلسلة مسار تحقق معا تغطية كامل replace، غير إعادة تراكم prepend، كامل range ذهاب إعادة، جزء إعادة تراكم رفض، فارغ صفحة `hasMore` استلام جمع و scalar live append. نفسه Assistant تاريخ scalar و packed يمثل إنتاج نفسه Chat/Trajectory State،timing boundary و نهائي Node؛ واحد packed run في replace،prepend،Location replay و registry rebuild في بداية نهاية فقط إبقاء واحد Match.

## اعتبار مرور بديل خطة

**إبقاء في قلب تحويل Session transcript fold، فقط سحب helper.** رفض: عمل خدمة identity، تاريخ replay و cache invalidation ما زال يخص واحد إغلاق دمج switch، نقل حركة دالة لن إنتاج مستقل كل حق.

**يجعل React renderer ذاتي ذات مسح Session Event.** رفض: كل نوع view كل سوف تكرار مطابقة و دورة الحياة State،React سوف يصبح عمل خدمة مرجعي،paging و streaming أيضا سوف إعادة حساب غير متصل مكون شجرة.

**يأخذ عام Nodes أو Location بحث جذب نقل إعطاء كل عمل خدمة renderer.** رفض: عمل خدمة مكون سوف ذاتي سطر مسح و دفع قطع حالي Turn/Step، حجز قراءة نطاق مع نافذة زيادة طويل.Definition يأخذ تجمع دمج قيمة إصدار إلى Engine-owned Location،renderer فقط قراءة ذاتي ذات Node Location data.

**كل جديد Event كل استدعاء نفس Definition الكل Context.** رفض:append صار هذا مع تاريخ زيادة طويل،`update()` أيضا سوف معا تحمل تحمل مطابقة و تحويل. بلا Context `match(event)` أولا حساب خروج ID، مع بعد فقط تحديث واحد Context.

**يجعل Definition matcher قراءة Context أو مسح تاريخ.** رفض: مطابقة سوف اعتماد التقاط دخول جهة نحو،result-first تاريخ صفحة لا يمكن مستقل حساب خروج ملكية، فوري append أيضا تراجع تحويل صار فتح وضع كائن فحص بحث.

**لـ تاريخ عكس مسح تعريف عكس نحو State fold.** رفض: كل عمل خدمة كل يلزم صيانة متبادل لـ عكس تشغيل حساب اثنان طقم منطق، حذف، غير يمكن عكس تجمع دمج و عبر Context اعتماد جدا صعب إبقاء متسق. موحد واحد Matches بعد من start صحيح ترتيب replay فقط لديه واحد طقم عمل خدمة دلالة.

**زيادة مستقل live-stream matcher و update lifecycle.** رفض: ثاني بند Definition path سوف تكرار dispatch،replay،publication و Context type.Client-only `assistant/live-chunk` و حمل دائم settlement استخدام قائم `match(event)` و `update(context, match)` lifecycle؛ فقط لديه event discriminator و stream expansion مختلف.

**يأخذ Inbox فعل صار جذب محرك واحد درجة عام شعب أو واحد نافذة درجة Context.** رفض:Inbox هو عادي عمل خدمة حالة، لا ينبغي تلوث صبغ عام جذب محرك؛ تدريجي splice لحظة بين حالة إضافة صارم إطار قبل ترتيب Reader معا دعم حمل prepend،append و Message استعلام.

**إعطاء عبر عمل خدمة استعلام تسجيل خاص تحويل query method.** رفض: إزالة استهلاك من ما زال يلزم اعتماد مزود API، إضافة جديدة علاقة سوف توسيع ورقة في قلب واجهة.Reader كشف إشارة تحديد kind فقط قراءة قبل ترتيب Context، من مزود كتابة جيد State، إزالة استهلاك من قراءة فهم State.

**يجعل Location data إزالة استهلاك من مباشر قراءة مزود Context State.** رفض: إزالة استهلاك من سوف اعتماد آخر عدد عمل خدمة متغير داخلي شكل حالة، أيضا لا يمكن جدول بلوغ قيمة يخص أي عدد Turn/Step.declaration-merged data map فقط عام مزود اختيار إصدار فقط قراءة قيمة و Engine-owned جلوس علامة.

**حسب State identity ذاكرة مؤقتة كل Definition Location data.** رفض:Definition يمكن أصل أرض تعديل و إرجاع نفس عدد State كائن، ذلك Location data أيضا ممكن اعتماد Match Location أو أخرى Definition إصدار value. كل Definition تعديل لـ ذاتي سطر حكم قطع عمل خدمة قيمة هل تغير؛ لم تغير وقت أصل مثال إرجاع قبل مرة publication.

**زيادة عام `end()`،prepared أو window reset دورة الحياة.** رفض: مختلف عمل خدمة إتمام شرط مختلف، قسم صفحة نقص فتحة أيضا لا هو عمل خدمة دورة الحياة. عمل خدمة Event تحديث State،Location close إطلاق replay/build،Reader dependency مسؤول تكملة صفحة بطلان.

**في نفس عدد Event Definition داخل عبر `buildViewNode(target)` لـ Chat و Trajectory فرع.** رفض: اثنان نوع عرض حاجة مختلف عمل خدمة State و في بين سجل، مشترك استخدام Definition سوف إجبار جعل كل package يحمل آخر حافة شرط و payload.target ذاتي لديه Definition يأخذ هذه اختيار إبقاء في محلي، معا إعادة استخدام Assembler التقاط دخول و دورة الحياة اتفاق.

**الأكثر بعد واحد subscriber مغادرة فتح وقت توقف استخدام target.** رفض: إرجاع هذا View سوف عكس تكرار إعادة بناء كامل snapshot. حجز قراءة فقط تأكيد أول مرة استخدام؛ مع بعد target في Session باق بقية دورة الحياة في إبقاء زيادة كمية تحديث.

**في نهائي عمل خدمة Node فوق مجددا تراكم واحد طبقة عام layout model.** رفض:activity،tail candidacy و layout enum سوف يأخذ حالي Chat عمل خدمة دلالة إعادة تجميع في إلى جذب محرك. نهائي Node مباشر يحمل renderer الذي يحتاج data، فقط مشترك identity، ترتيب و Location واقع.

**فقط في Assistant renderer تسجيل Turn data Hook.** رفض: وصول حالي Node Location هو `conversation.chat.node` slot عام مشترك قدرة، لا يخص بعض عدد عمل خدمة renderer. أب Chat entry تسجيل مرة common inject، كل keyed renderer مشترك نفس قوي نوع اتفاق.

**يأخذ running Assistant أو Tool إبقاء في مستقل tail container.** رفض: تسوية وقت سوف عبر React parent نقل حركة، مستقر عمل خدمة key أيضا لا يمكن منع توقف remount. موحد واحد keyed order سماح data و ترتيب موضع تغيير، لكن لا تغيير Seat identity.

## عاقبة

إضافة جديدة عمل خدمة عقدة يمكن نطاق جزء تسجيل ذاتي ذات matcher،State تحويل، اختياري Location data، نهائي target Node و renderer، بلا حاجة تعديل Session عمل خدمة switch.`ChatNodeDataMap` و Location data maps سماح عمل خدمة package عبر declaration merging دمج دخول قوي نوع data؛ كل متبادل صلة Event ما زال يجب كشف يمكن مفرد Event دفع توجيه مستقر ID.

Host عمل خدمة package يأخذ ذاتي ذات حمل دائم Event عضو declaration-merge إلى `@deepseek-ai/dsh-session/types`،Client Definition فإن عبر مقابل عمل خدمة package `/types` فرعي مسار إجراء type-only import. زيادة قوي فعلي إعلان واجهة بينما لا هو إعادة تصدير barrel، جعل Host و Client مستقل TypeScript Program كل قدرة نيل نيل نفسه Event narrowing، معا لا يأخذ Host runtime حمل دخول Client رسم.

ابتدائي ذيل صفحة،older prepend و live append مشترك واحد طقم Context ثابت كمية. نقص start،Reader window gap،Location unknown و packed عال تردد delta كل هو جذب محرك واضح جدول بلوغ حالة، لا حاجة عمل خدمة آخر بناء جهة نحو متبادل صلة cache.

Append لا مسح تاريخ Context؛prepend فقط replay Match،Location أو Reader جواب سجل حق صحيح تلقي أثر Context.Chat بنية تغير ما زال ممكن إعادة حساب visible order و بحث جذب، لكن لن إعادة ركض غير متصل عمل خدمة fold أو استبدال لم تغير Node identity.

State update و publication cadence قسم مغادرة بعد،Assistant كل بند live delta و كل تاريخ packed run كل سوف يتم fold، معا كل ثلاثة عدد animation frame الأكثر كثير materialize مرة.Assistant view قراءة قبل وضع Step Location مرحلة مقطع للتو كتابة نفس projection.Turn Process مقابل حمل متابعة Assistant chunk مباشر إرجاع قد لديه open data و Node، لم يعد تكرار إرسال توليد أو تحرير رمز؛Turn Tail إلى `turn/end` عندئذ تنفيذ كامل Match مسح.Step/Turn close و final Event سوف قيام أي إصدار الأكثر جديد State.

inactive target سوف إبقاء Definition State و target Context بحث جذب، لكن لا إبقاء builder، قد شيء تحويل Node أو snapshot. قد تركيب داخل بناء أو رقم ثلاثة جهة View عبر صحيح معتاد حجز قراءة تنشيط ذاتي ذات target؛ قد فتح target فإن متابعة استقبال زيادة كمية تحديث.

Step/Turn هو عمل خدمة بين مشترك تجمع دمج مستقر مضيف.Turn Tail و Deliverables بلا حاجة من renderer مسح عام Nodes يكفي إرسال توليد قيمة؛Slot-level `useTurnData()` يأخذ معتاد رؤية قراءة حد إلى حالي Node الذي تابع Turn، و عبر keyed Location source عزل غير متصل تحديث.

Inbox Context إبقاء كمية مع splice عدد و قد claim رسالة عدد زيادة طويل، لم يعد مع ذلك تراكم حساب بادئة زيادة طويل. هذا بنية إزالة حذف تكرار state زيادة طويل، لكن لن مقابل حمل دائم Session event في رسالة متن ذهاب إعادة، أيضا لن حد قد تحميل event window.

بديل قيمة هو Runtime إضافة جديدة Registry،Assembler،Location data، اعتماد إعادة وضع و per-target Builder عقد نحو،UI Slots أيضا إضافة جديدة parent-owned common inject و per-occurrence `hookContext`. إزالة استهلاك Assistant delta Definition أيضا حاجة صيانة انتظار قيمة scalar و packed update فرع.Definition عمل من يجب إدارة حل مستقر ID، وحيد scalar start، صحيح ترتيب replay،Step→Turn إصدار ترتيب، فقط قراءة Reader و Node لا سحب عودة قاعدة.

`useTurnData()` لا سحب إلغاء session-scoped renderer معيار `useSession`، لذلك هذا حد اعتماد اعتماد API جذب توجيه و اختبار، بينما لا هو قدرة عزل.Registry تغير ما زال هو منخفض تردد كامل rebuild؛Chat Builder متابعة لـ StatsPills و قمة طبقة عام مشترك حقل صيانة legacy slice،Trajectory فإن في مشترك Session نافذة فوق يملك target مخصص تابع Definition و Builder. داخل بناء Definition قسم آخر إبقاء في الذي تابع UI package؛ هذه توافق حد لا يأخذ عمل خدمة حل تفسير حق تسليم أيضا إعطاء Session.

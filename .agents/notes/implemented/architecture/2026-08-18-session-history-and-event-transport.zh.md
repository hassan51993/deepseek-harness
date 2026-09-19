# Agent Note: جلسة تاريخ، تحكم حالة و Remote حدث نقل

Status: implemented

[English](2026-08-18-session-history-and-event-transport.md) | العربية

## مشكلة

متصفح معا إزالة استهلاك ثلاثة صنف دورة الحياة مختلف بيانات: يمكن حفظ دائم و قسم صفحة Session سجل، حاجة opening baseline عندئذ قدرة في إعادة وصل بعد استلام جمع عملية داخل حالة، و بلا حاجة إعادة وضع أي وقت إشعار.

هذا ثلاثة صنف بيانات لا يستطيع مشترك استخدام واحد نوع استعادة قاعدة.Session سجل لديه مستقر seq و persistence، يمكن حسب cursor تكملة متساو نقص فتحة؛jobs،projection قيمة و Workspace قائمة انتظار حالة حاجة بـ كامل snapshot استبدال قديم مرآة مثل؛ عادي إشعار فقط حفظ إثبات حالي Connection generation داخل إلقاء تمرير.

مراقبة Session تاريخ، قائمة و إسقاط يجب سماح بارد قراءة. إذا transport بسبب معامل في ظهور Session أو Agent حينئذ إطلاق عام Typert lookup، فتح صفحة، تبديل وسم أو شبكة شبكة إعادة وصل كل سوف خفي صيغة استعادة Agent، مراقبة عملية لذلك إنتاج تنفيذ فرعي أثر.

prompt،create،fork، نموذج اختيار انتظار أمر أيضا تأكيد فعلي حاجة حسب كل منها دلالة إنشاء أو استعادة Agent. تنشيط إذن يجب يخص أداة جسم Remote طريقة، بينما لا يستطيع من carrier، معامل نوع أو مشترك lookup داكن في قرار.

قديم API Proxy كل Session mux،`HostFrame` و Workspace إشعار يأخذ مجال بيانات،baseline، خطأ و اتصال دورة الحياة تحرير رمز دخول نفس يد كتابة بروتوكول. كل زيادة واحد نوع حالة كل يلزم نسخ لقطة تعريف،Client bridge، إعادة وصل و تنظيف منطق،API Proxy أيضا لا يمكن تراجع عودة فقط تحمل وصل بعد لم ترحيل عمل خدمة طريقة.

Host نحو Client Cordis حدث أيضا لديه اثنان نوع استدعاء دلالة. عادي إشعار فقط حاجة واسع بث؛Approval و Question واحد صنف Agent-scoped waterfall يجب سماح Client claim، استدعاء `next()` تفويض حمل، إرجاع نتيجة أو رفض، و في كثير Client، قطع خط و إلغاء تحت إبقاء مرة Host استدعاء هوية.

هذه يحتاج طلب حاجة واحد عام transport دورة الحياة، لكن لا يستطيع يجعل Gateway إدارة حل Session،Workspace،Approval أو Question عمل خدمة بيانات.

## قرار

API Gateway يملك Remote transport،stream دورة الحياة و Remote Event تنسيق ضبط؛Session Controller و Workspace Controller يملك كل منها Host API،wire نوع و Client مجال adapter؛Client Runtime فقط تركيب إعداد و إزالة استهلاك هذه كائن، لم يعد تنفيذ آخر طقم carrier حالة آلة.

حالي كل حق مثل تحت:

```text
[client/connection]
|-- Host description
|-- Connection generation
`-- unary RPC transport

[api/gateway/client]
|-- RemoteStream
|-- RemoteSnapshotStream
|-- RemoteJournalStream
`-- ctx.remote.$on + $events pump

[api/session-controller]
|-- ctx.remote.session unary commands
|-- session.control snapshot stream
|-- session.page + session.follow journal
`-- Session Client adapters

[api/workspace-controller]
|-- ctx.remote.workspace unary commands
|-- workspace.follow snapshot stream
`-- Workspace Client model and adapter

[api/remotes]
`-- application Remote Event allowlist and Host Cordis source

[client/runtime]
`-- compose Session and Workspace domain state for consumers
```

API Proxy لا يملك Session أو Workspace Remote namespace، أيضا لا يملك Host تحت سطر حدث carrier.`/api/events.host`،`HostFrame`،`stream/error`،`ServerRequest` و ذلك WebSocket/SSE فرع لا مشاركة و هذا بند بيانات سلسلة مسار.

### Connection generation و شيء إدارة اتصال

متصفح Client Remote إضافة تنشيط وقت قوة انتظار بدء `RemoteStreamMuxClient`، و قيام أي اتصال `/api/remote.mux`. لا يوجد عمل خدمة logical stream وقت شيء إدارة WebSocket ما زال إبقاء معتاد إقامة، لكن mux لا تشغيل مستقل retry ضبط درجة.

Host حسب إعداد `websocketHeartbeatIntervalMs` بين فصل (افتراضي 2 ثانية) نحو كل بند قد فتح mux socket إرسال واحد RFC 6455 Ping تحكم لقطة؛ متصفح في بروتوكول طبقة عودة تكرار Pong. اثنان نوع تحكم لقطة كل لا دخول Remote stream JSON union، أيضا لا تغيير Connection generation حالة. كل مرة Ping قبل،Host يأخذ socket علامة لـ انتظار Pong؛ إذا إلى تحت واحد بين فصل ما زال لم استلام إلى Pong،Host سوف إنهاء هذا socket.

أول مرة بناء وصل فشل أو قد اتصال socket فقد فقد بعد، قد فتح logical stream سوف بـ `RemoteStreamCarrierError` انتهاء حالي شيء إدارة generation.`ConnectionController` يملك حمل متابعة كما بين فصل غلاف قمة إشارة عدد retry ضبط درجة؛ كل مرة محاولة تجربة كل اشتراط mux تماما جيد مرة استبدال مرشح أو نشط حركة socket، مجددا إعادة فتح `$events`. مستخدم اشتراط إعادة وصل عبر نفس مسار إعادة وضع attempt تسلسل و قفز مرور انتظار (رؤية[قرار](../../archived/feature/2026-08-28-web-connection-recovery-control.md)).


متصفح شبكة شبكة حالة حدث هو نفس Controller إدخال.`offline` سوف سحب عودة Connection generation و مؤقت توقف تلقائي retry؛ تحت مرة `online` تحويل سوف من أساس أساس تراجع تجنب ملف إعادة بدء. هذه حدث لن بناء قيام اتصال؛ فقط لديه جديد `$events` ready لقطة عندئذ سوف إصدار Connection generation.

عملية داخل `connection.rpc.open` استخدام نفس logical endpoint دلالة، لكن التفاف مرور متصفح WebSocket mux.

Gateway داخلي `$events` logical stream هو `ConnectionHandle` وحيد generation source. هو لا اعتماد هل قد لديه عمل خدمة `$on` حجز قراءة، لذلك اتصال سليم سليم حالة لن مع UI listener عدد كمية تغير.

Host event source في إرجاع أول لقطة قبل تزامن تثبيت زيادة كمية listener.Gateway مع بعد إرسال `{ type: 'ready', clientId, host: { home } }`؛ هذا frame إثبات حالي generation قد قدرة كاف استقبال زيادة كمية، و يحمل مستقر Host مسار عرض معلومة.

`ConnectionController` فقط لديه في `$events` ready بعد عندئذ إصدار `connected`، الذي بـ Session أو Workspace baseline لن في Host زيادة كمية listener حينئذ خيط قبل بدء قراءة.

`$events` صحيح معتاد معنى خارج انتهاء،Host خطأ، شاذ شكل أول لقطة أو carrier فشل كل سوف انتهاء حالي Connection generation.Connection سحب عودة هذا generation، مع بعد حسب محدود تراجع تجنب إعادة بناء قيام `$events`؛ متصفح مغادرة خط وقت مؤقت توقف، مستخدم اشتراط قيام أي إعادة محاولة وقت فإن قفز مرور انتظار.

Gateway stream،Connection generation و Session عمل خدمة open epoch هو ثلاثة عدد مستقل حساب عدد: قبل من يمثل بعض بند logical stream شيء إدارة استبدال، ثاني عدد يمثل Host متاح صفة إمساك يد، الأكثر بعد واحد منع توقف قد تصفية استبعاد Session open كتابة عودة حالي حالة.

Host إضافة إلغاء تدمير سوف إيقاف قلب قفز تحديد وقت جهاز، إنهاء mux socket، و انتظار نشط وثب iterator إتمام.Client إضافة إلغاء تدمير سوف إيقاف إعادة محاولة انتظار، إلغاء مرشح و نشط حركة socket، إنهاء logical stream، و انتظار خلفية حلقة و consumer تماما توقف مستقر.

### عام Remote stream نموذج

Gateway Client توفير ثلاثة عدد لا اعتماد React، فقط سماح واحد consumer دورة الحياة كائن:

```text
RemoteStream<Item>
|-- RemoteSnapshotStream<Snapshot, Delta>
`-- RemoteJournalStream<Page, Entry, Cursor>
```

مجال Controller عبر تركيب أو رقيق adapter استخدام هو جمع؛Session و Workspace لا وراثة واحد معرفة طريق مجال لقطة مشترك نفس Controller أساس صنف.

#### `RemoteStream`

`ctx.remote.$stream(options)` إرجاع `RemoteStream<Item>`، مسؤول واحد logical stream عبر شيء إدارة generation إعادة فتح، إلغاء و dispose.

كل item يحمل مفرد ضبط generation، هذا generation `AbortSignal` و `accept()`. مجال consumer فقط لديه في تحقق opening cursor أو baseline بعد عندئذ استدعاء `accept()`.

فقط لديه `RemoteStreamCarrierError` يمكن إطلاق إعادة محاولة.Host ما زال متاح وقت سماح مرة مستقل إعادة فتح؛ لا فإن انتظار جديد Connection generation. عمل خدمة خطأ، بروتوكول خطأ و opening فشل مباشر إنهاء.

`restart()` فقط تصفية استبعاد حالي شيء إدارة generation، إبقاء logical stream؛`dispose()` دائم دائم انتهاء logical stream،pending retry و iterator، و انتظار quiescence.

`RemoteStream` لا إدارة حل baseline،delta،page،cursor،seq أو أي مجال frame.

#### `RemoteSnapshotStream`

`RemoteSnapshotStream<Snapshot, Delta>` اشتراط كل generation تماما جيد بـ واحد نسخة كامل snapshot بدء، بعد فقط قدرة ظهور delta.

update مبكر في snapshot أو نفس generation ظهور ثاني نسخة snapshot كل هو terminal protocol error.

snapshot نجاح تطبيق بعد عندئذ قبول هذا generation.carrier إعادة وصل خلال إبقاء فوق واحد نسخة قد إصدار حالة، جديد generation snapshot مرة صفة استبدال قديم مرآة مثل.

مجال adapter توفير frame حكم آخر،snapshot replacement،delta reducer،carrier حالة و terminal failure sink؛ عام طبقة لا تحليل Session أو Workspace حقل.

Session control و Workspace state كل استخدام واحد مستقل `RemoteSnapshotStream`.

#### `RemoteJournalStream`

`RemoteJournalStream<Page, Entry, Cursor>` تركيب واحد live follow و نفس namespace page طريقة، ملائم لأجل لديه مستقر ترتيب، يمكن قسم صفحة تاريخ و live tail append-only journal.

أول مرة فتح أولا بناء قيام follow و أخذ نيل opening cursor، مجددا قراءة initial page.page طلب خلال إنتاج live entries قد دخول follow طابور صف، لذلك لن سقوط في “أولا قراءة تاريخ، بعد حجز قراءة” تنافس حالة نافذة في.

عام طبقة حسب cursor ذهاب حذف page و queued entries إعادة تراكم، تحقق وصل متابعة صفة، و في page تغطية opening cursor بعد إصدار واحد نسخة كامل window.

وصل متابعة live entry إصدار `append`، أكثر مبكر تاريخ صفحة إصدار `prepend`. إعادة وصل،cursor قفز وثب أو لا يمكن إثبات وصل متابعة صفة وقت إطلاق tail page repair.

repair خلال قديم window إبقاء يمكن قراءة؛page و خلال تراكم تراكم live entries تجميع صار وصل متابعة نافذة بعد فقط إصدار مرة `replace`، لن يأخذ نصف إصلاح حالة كشف إعطاء إزالة استهلاك من.

إذا page طلب مع شيء إدارة carrier generation واحد بدء إلغاء،journal انتظار تحت واحد generation opening cursor، مجددا بـ جديد cursor إعادة قراءة page؛ هذا إلغاء لن بصفة terminal page failure تسرب تسرب إعطاء مجال كائن.

`RemoteJournalStream` يملك opening cursor،resume cursor، قسم صفحة، إعادة وصل catch-up، إعادة تراكم ذهاب إعادة و gap repair. مجال Session كائن لا نسخ هذه حالة آلة.

### Session Controller

`packages/api/session-controller` توفير Host `ctx.sessionController` و توليد `ctx.remote.session` namespace.

هو يملك Session list،search،create،selectModel،rename،fork،prompt،attachment،updateQueue،cancel،page،follow و control.Host generation model catalog عبر مستقل `session/modelCatalog` عام، لأن هو لا يخص خاص تحديد Session.

حزمة داخل agent،commands،control،history و list controller قسم فتح تنفيذ، لكن Session هوية تحليل، تنشيط سياسة،subagent ownership و Remote خطأ إسقاط فقط لديه واحد عام owner.

أخرى Host Remote namespace عبر `ctx.sessionController.inspect()` أو `resolveAgent()` إعادة استخدام نفس هوية قاعدة، لا إبقاء ثاني نسخة Session resolver.

#### تنشيط سياسة

Session Remote طريقة نقل تمرير `SessionId` أو `SessionAddress`، لا اعتماد معامل نوع إطلاق عام Typert Session lookup.

كل طريقة صريح اختيار بارد فحص،live-only فحص بحث أو سماح resume تحليل طريقة:

| عملية | بلا live Agent وقت بيانات مصدر أو نتيجة | تنشيط قاعدة |
|---|---|---|
| `session.list`،`search` | header و إسقاط ذاكرة مؤقتة؛ يمكن عبر محدود صغير سجل قراءة حكم قطع لا تحديد blank حالة | دائم لا استعادة Agent |
| `session.page(address)` | attached Session أو persistence سجل | دائم لا استعادة Agent |
| `session.follow(address)` | واحد نسخة يحمل opening page و projection live أو prepared observation | أولا إصدار snapshot، مجددا في خلفية يأخذ عادي بارد Session رفع رفع مرة |
| `session.control()` | حالي attached Agent،pending registry و عملية داخل registry | baseline و إعادة وصل لا استعادة Agent |
| `session.attachment`،fork مصدر قراءة | قد تخويل حمل دائم Session بيانات | قراءة لا استعادة Agent |
| `session.updateQueue` | live Agent أو عادي حمل دائم Session | تعديل Inbox قبل استعادة عادي بارد Session |
| `session.cancel` | فقط أمر في حالي live Agent | لا لـ قد إزالة فقد حالة استعادة Agent |
| `models`،`selectModel`،`rename`،`prompt` | أمر تحليل هدف Session | فقط حسب طريقة اتفاق صريح استعادة |
| `create` و fork هدف | جديد Session/Agent | مستخدم أمر توفير إنشاء تخويل |

قراءة title، قائمة و إسقاط لا اشتراط Agent. مراقبة عملية لا يستطيع لأن آخر عدد Remote endpoint استخدام Agent lookup بينما وراثة ذلك استعادة إذن.

`SessionQuery.observeSession()` اختيار attached Session، أو من قراءة جهة ذاتي ذات prepared cache——مرور من حفظ دائم قراءة جملة مقبض ملء ملء——توفير بارد Session. هذا cache مشترك تزامن بارد قراءة، و في كل observation lease تحرير قبل ثابت نفس بند. مرة observation يلزم ما حساب حساب كل قد تسجيل projection، يلزم ما تماما لا حساب حساب؛ استدعاء جهة يمكن فقط عام منها واحد جزء، لكن لن بناء قيام فقط حساب حساب جزء projection في بين حالة.

`session.list` لن بلا حد مسح بارد سجل. هو أولوية استخدام ذاكرة مؤقتة projection hint، فقط في مستقل تخزين artifact لا تجاوز مرور إعداد صغير سجل بايت حد أعلى وقت، عندئذ ممكن كامل مراقبة سجل بـ حكم قطع لا تحديد blank حالة.hint ناقص أو غير ممكن قراءة وقت، قائمة ما زال إبقاء هذا سطر، و يأخذ metadata نظر لـ لم معرفة.

`model/selection` هو required-on-read حمل دائم event، لأن هو تغيير تحت مرة طلب استخدام model route. مقابل projection معا سجل الأكثر قريب مرة request selection و بعد pending selection؛prompt assembly في إيداع مطابقة `request/header` وقت إزالة استهلاك pending value.

#### Session سجل

`session.page` إرجاع واحد مقطع حسب رسالة حد قطع قص، داخلي seq وصل متابعة تاريخ نافذة. كل طلب يجب صريح يحمل `throughSeq`؛ هذا قيمة قدوم ذاتي مقابل `session.follow` generation opening cursor، و يأخذ هذا مرة قراءة ثابت في نفس عدد سجل قطع نقطة. بلا `beforeSeq` tail page يجب دقيق انتهاء في `throughSeq`، منها `-1` يمثل فارغ سجل؛`beforeSeq` فقط اختيار هذا قطع نقطة قبل أكثر مبكر صفحة، لا يستطيع بديل تزامن cursor.`maxMessages` حد user/assistant رسالة عدد، لا إسقاط هذه رسالة بين chunk،tool أو حالة حدث.

tail page معا يحمل لا متأخر في `throughSeq` projection baseline؛ قديم صفحة فقط يحمل تاريخ entries.Client بـ projection watermark دمج page و لاحق live control تحديث.

عادي Session و direct subagent استخدام نفس عدد `SessionAddress` بروتوكول.direct subagent عنوان معا يحمل أب Session، فرعي Session و mode،Host بارد قراءة وقت تحقق حمل دائم ownership و descriptor، لا يستطيع فقط سند child id تجاوز حق قراءة.

`session.follow` في مراقبة attached أو prepared Session قبل أولا تثبيت `session/event` و `session/created` listener.

أول مرة follow إرجاع كامل `{ type: 'snapshot', header, cursor, events, hasMore, projections }` frame. كل مرة إعادة وصل كل إرسال آخر نسخة كامل snapshot replacement؛ بروتوكول لا يحتوي `afterSeq`. مراقبة خلال إيداع event سوف إبقاء في مؤقت اندفاع منطقة، و في snapshot بعد حسب seq إرسال خروج.

عادي بارد Session يمكن قيام أي إصدار prepared snapshot. أول لقطة بعد،Controller يأخذ retained observation تسليم إعطاء مرة خلفية promotion؛follow لا انتظار تنشيط.Direct-subagent عنوان لن دخول هذا promotion مسار.

Client `SessionEventStream` وراثة `RemoteJournalStream`، فقط توفير `session.follow`،`session.page`،Session seq حساب قاعدة و repair request. عام طبقة مباشر تحقق تزامن نشر opening snapshot؛ فقط في قراءة أكثر مبكر تاريخ أو لاحق event كشف seq gap وقت استدعاء `session.page({ throughSeq })`.

```text
ctx.remote.session.follow(address, pageArgs) ----------------|
  snapshot(header, cursor, page, projections), event*        |[]> SessionEventStream
ctx.remote.session.page(address, throughSeq, pageArgs) -------|    |-- replace(window)
                                                                  |-- prepend(history)
                                                                  `-- append(live entry)
```

كل Client Session فقط يحتفظ واحد حالي `events: SessionEventStream | undefined`. فقط قراءة `SessionEventSource` يأخذ قد شيء تحويل event window تسليم إعطاء Conversation consumer.

Session `openGeneration` فقط منع توقف يتم resync، عنوان استبدال أو dispose تصفية استبعاد مختلف خطوة نتيجة كتابة عودة؛ هو لا مشاركة و transport retry.

initial page،repair page أو follow terminal failure دخول حالي Session `openError`. قديم عمل خدمة epoch أو قديم stream فشل لا يستطيع تغطية جديد حالة.

#### Session live control

`session.control()` هو Host نطاق snapshot stream، واحد متصفح يمكن مراقبة كل حالي live Session لحظة حالة حالة، بينما لا لا بد لـ كل transcript فتح journal.

كل generation أولا إرسال كامل baseline، مجددا إرسال jobs و projection زيادة كمية لقطة.baseline قراءة عملية داخل registry و قد طي projection قيمة، لا استعادة بارد Agent.

jobs استخدام كامل replacement قيمة و حسب last-wins تطبيق.Projection update يحمل مفرد ضبط تمرير زيادة revision، جديد baseline فإن استبدال كامل projection map.Session و owner disposal سوف تنظيف قديم قديم مرآة مثل.

أصلي `approval/request` و `user-questions/request` هو يمكن تحويل إرسال waterfall. إذا بعض عدد Agent-scoped Client listener claim، طلب مباشر إرجاع؛ إذا كل قد إلقاء تمرير Client كل استدعاء `next()`، أصل Cordis waterfall متابعة إلى لاحق Host listener.Session control لا حفظ أو إعادة وضع هذه طلب.

projection baseline و tail page سجل قطع نقطة مستقل إنتاج،Client مجموع هو إبقاء مقارنة عال seq قيمة. حجز قراءة live projection لن لـ أخذ نيل قيمة بينما بدء Agent.

Session added،removed،activity،running status و بلا turn موضع Agent error لا دخول stateful control stream؛ هو جمع هو يمكن من قائمة baseline إصلاح أو بلا حاجة إعادة وضع `ctx.remote.$on` إشعار.

Session قائمة `updatedAt` أخذ `max(header.createdAt, sessionListMetadata.lastPromptAt)`.`lastPromptAt` فقط من مستخدم مصدر `user/message` تحديث، يمكن من بارد projection استعادة، لا اعتماد متصفح هل صحيح في تتبع مع هذا Session.

### Workspace Controller

`packages/api/workspace-controller` توفير Host `ctx.workspaceController` و توليد `ctx.remote.workspace` namespace.

هو يملك create،rename،delete،insertBefore،insertSessionBefore،archiveSession،unarchiveSession و `follow`.Workspace registry ما زال هو حمل دائم واقع مصدر،Controller مسؤول Remote أمر، إسقاط و خطأ خريطة.

`WorkspaceFeed` تزامن مراقبة storage `domain/changed`، و لـ كل follow generation أولا إرسال كامل baseline، مجددا إرسال `upsert`،`remove`،`order` و `archived` زيادة كمية.

كامل `order` frame هو Workspace ترتيب ترتيب مرجعي قيمة. هو تجنب تجنب Client أصل حسب upsert وصول ترتيب تخمين قياس عرض ترتيب، أيضا قدرة في إعادة وصل baseline بعد استلام جمع.

`createWorkspaceStateStream()` يأخذ `workspace.follow` تركيب إعداد لـ `RemoteSnapshotStream`.Client Runtime فقط مسؤول بدء و يحتفظ هذا stream.

`ClientWorkspaceModel` يقع في Workspace Controller Client وجه، يملك baseline/increment تحليل، قد شيء تحويل قائمة، عودة ملف تجميع دمج، أمر نتيجة عودة إظهار و unary و stream وصول تنافس حالة دمج قاعدة.

نجاح unary أمر يمكن قيام أي تحديث محلي نموذج؛ بعد إلى stream commit ما زال بـ Host projection و كامل order تدقيق صحيح حالة. قد حذف Workspace id يتم سجل، تأخير متأخر نتيجة لا يستطيع يأخذ هو إعادة إدراج عودة قائمة.

```text
ctx.remote.workspace.follow() -|[]> RemoteSnapshotStream
                                      |-- replace(baseline)
                                      |-- upsert/remove(view)
                                      |-- replace(order)
                                      `-- replace(archived ids)
```

Workspace Remote طريقة، حالة feed و Client بيانات نموذج متساو لا مرور مرور API Proxy، أيضا لا اعتماد `host/workspace-*` إشعار.

### Remote Event

Remote Event إعادة استخدام owner حزمة Cordis `Events` إعلان.Host أصل حدث هو وحيد عمل خدمة توقيع،Client `ctx.remote.$on(event, listener)` من نفس إعلان دفع توجيه معامل،waterfall نتيجة و `next()`.

`packages/api/remotes` allowlist هو تطبيق اختيار وحيد مصدر. كل بند صريح علامة ملاحظة `emit` أو `waterfall`، هذا mode معا قرار Host استماع طريقة،Client دمج قاعدة مفتاح تجميع و wire frame نوع.

نظام لا إعلان `RemoteInvocationMap`، لا اشتراط Client مجددا كتابة واحد نسخة `@Remote`، أيضا لا بـ الأكثر بعد واحد وقت التشغيل معامل هل لـ دالة قدوم تخمين قياس استدعاء نمط.

Remote Event تحت سطر لقطة هو صريح discriminated union:

```text
ready     { type, clientId }
emit      { type, event, args }
waterfall { type, event, eventId, agentId, request }
cancel    { type, eventId }
```

WebSocket JSON و عملية داخل carrier مدخل كل من `unknown` بدء حسب `type` و دقيق حقل تحقق؛ تحقق إتمام بعد توزيع فقط استقبال typed union.TypeScript ساكن حالة نوع لا بديل wire تحقق.

عادي `emit` معامل يجب هو بلا ضرر JSON.Client في كل Remote نسخة خاص Cordis key فوق استدعاء `parallel()`، إبقاء تسجيل ترتيب، استدعاء جهة fiber كل حق و listener خطأ عزل.

خاص key منع توقف Host حدث و Client محلي نفس اسم Cordis حدث متبادل متبادل إطلاق.Client Remote لا صيانة ذاتي ذات subscription registry أو يد كتابة listener chain.

يمكن إرجاع waterfall حالي فقط دعم حمل Agent scope. حدث توقيع يجب هو واحد يحتوي مباشر `agent` حقل request، إضافة واحد إرجاع نفس نوع نتيجة `next()`، كامل جسم إرجاع Promise.

Host فقط إسقاط request واحد درجة `agent` و `signal`:`agent` تغيير لـ frame واحد درجة `agentId`،`signal` يصبح delivery lifetime، ذلك بقية حقل يجب كامل جسم لـ بلا ضرر JSON.

Client استخدام `agentId` تزامن تحليل أو شيء تحويل Agent Context، يأخذ حالي delivery signal وضع عودة request مباشر `signal` حقل، مجددا في هدف Context خاص key فوق استدعاء Cordis `waterfall()`.Session-backed adapter في أول عدد نجاح Session قائمة baseline وصول قبل سماح transport أولا شيء تحويل scope؛baseline وصول بعد من قائمة دورة الحياة وصل إدارة scope تخزين نشط حكم قطع.

نظام لا مسح مهمة معنى عميق درجة كائن، لا نقل path array أو placeholder، لا deep clone/restore Context و AbortSignal، أيضا لا انتظار لم قدوم ظهور Agent Context.

Client adapter لم تسجيل،resolver لم إرجاع Context أو تحليل رمي خطأ وقت، هذا Client قيام أي إرجاع `next`. هو لا حجز قراءة registry، لا فعل resolve بعد تنافس حالة تكرار فحص، أيضا لا لـ مرة delivery إنشاء مؤقت Fiber.

Gateway Host لـ كل لم إتمام waterfall حفظ `eventId`،Host continuation و قد إلقاء تمرير Client generation. جديد Client generation سوف استلام إلى نفس pending event إعادة وضع.

كل generation طابور صف حفظ إثبات مرة إلقاء تمرير، لذلك Client لا حفظ `seen` تجميع دمج.`clientId + eventId` ربط نتيجة و حالي generation، قديم اتصال عودة حزمة لا يستطيع إتمام جديد اتصال فوق delivery.

كثير Client معا استقبال waterfall وقت، رقم واحد result أو rejection إتمام Host استدعاء، و نحو ذلك بقية Client إرسال `cancel`. فقط لديه كل قد إلقاء تمرير Client كل إرجاع `next` وقت،Gateway عندئذ متابعة أصل Cordis chain.

Host caller signal إلغاء،Agent Context تحرير،Client generation انتهاء و losing-client cancellation كل سوف إنهاء مقابل انتظار.

Client عبر قائم HTTP unary RPC `$events/result` عودة إرسال `next`،result أو rejection؛ تحت سطر حدث ما زال إعادة استخدام Remote WebSocket mux، لا لـ ينبغي جواب بناء قيام duplex WebSocket.

Gateway فقط تحقق waterfall قيمة راجعة قدرة بلا ضرر يمثل لـ JSON، لا حل تفسير عمل خدمة حقل.Question عودة جواب option ملكية انتظار دلالة من طلب جهة أو UI مجال تحمل تحمل،transport لا تكرار تحقق.

`UserQuestionService` في طلب خلال مراقبة إلى استدعاء جهة `AbortSignal` قد إلغاء، كما provider رمي خروج عادي خطأ وقت، سوف ذلك عودة واحد لـ `UserQuestionError` `ASK_ABORTED`، و يأخذ أصل خطأ إبقاء لـ `cause`؛provider قد إعطاء خروج مجال خطأ إبقاء ثابت.

`$events/result` فشل سوف أمر حالي Connection generation فشل.Host مع generation سحب إلغاء هذا Client delivery،pending event في تحت واحد generation إعادة وضع،Client لا صيانة ثاني طقم نتيجة إعادة محاولة طابور صف.

عادي `$on` إشعار في قطع خط بعد لا إعادة وضع. كل صحيح تأكيد صفة اعتماد استعادة بيانات يجب لديه query،cursor أو opening baseline، لا يستطيع اعتماد Remote Event تماما جيد إرسال بلوغ.

Client listener متأخر في حدث وصول عندئذ تسجيل وقت لا تكملة إرسال؛HMR أيضا لا يوجد مخصص استخدام تكملة إلقاء دلالة.

### API Proxy باق بقية حد

Session Controller و Workspace Controller مباشر توفير توليد Remote namespace؛API Remotes و API Gateway مباشر توفير Host-to-Client حدث.

Client Connection فقط صيانة Host generation،description و عام RPC، لا تحليل مجال frame.

Client Runtime فقط استقبال Controller adapter إنتاج خروج مجال تغيير، لا تعرف آخر `HostFrame`،`session/subscribed`،`session/event` mux frame أو `host/workspace-*` frame.

API Proxy فقط تحمل وصل ذاته يملك مستقل عمل خدمة API، لا هو Session،Workspace،Remote Event أو Connection generation اعتماد.

## تجهيز اختيار خطة

**بناء قيام مهمة معنى Session stream وقت تلقائي استعادة Agent.** هذا سوف يجعل فحص نظر تاريخ، قراءة title، إعادة وصل وسم صفحة أو مراقبة خلفية حالة إنتاج تنفيذ فرعي أثر، أيضا سوف يجعل كثير عدد متصفح إطلاق تكرار استعادة؛ بارد سجل و إسقاط قد لديه persistence مصدر.

**فقط سماح live Agent استخدام `session.follow`.** هذا سوف إجبار جعل transcript أول شاشة استعادة Agent، أو إعادة جذب دخول unary history و live subscription بين تنافس حالة؛ حسب identity أولا follow مجددا بارد قراءة قدرة معا تغطية تاريخ و لم قدوم صريح تنشيط.

**يأخذ Session transport و Session commands تفكيك صار اثنان عدد عام حزمة.** اثنان من مشترك نفس اعتماد Session address،Agent تنشيط سياسة،subagent ownership، خطأ خريطة و Client تركيب ترتيب؛ واحد عام Controller إبقاء موحد واحد كل حق، داخلي class ما زال يمكن مستقل عرض تحويل.

**يأخذ jobs،projection،Workspace و سجل كل تعديل صار عادي `$on`.** عادي حدث لا يوجد reconnect baseline،cursor أو gap repair، تسرب إسقاط مرة دفع إرسال حينئذ سوف إبقاء تحت دائم دائم قديم قديم حالة؛ فقط لديه بلا حاجة استعادة، يمكن من مستقل استعلام إصلاح، أو بـ waterfall ذاته يحتفظ طلب دورة الحياة إشعار ملائم دمج `$on`.

**يجعل كل مجال Controller وراثة واحد page/follow/retry أساس صنف.** Session journal و Workspace snapshot opening، استعادة و ترتيب ترتيب قاعدة مختلف؛Gateway ثلاثة عدد تركيب صيغة stream كائن إعادة استخدام transport دورة الحياة، معا يجعل مجال adapter فقط إعلان ذاتي ذات frame دلالة.

**إعطاء Remote Event جديد بناء واحد نسخة Client invocation إعلان.** ثاني ورقة map أو Client `@Remote` سوف نسخ owner Cordis حدث توقيع و شكل صار عائم نقل نقطة؛ من نفس `Events` إعلان دفع توجيه `$on` listener و نتيجة نوع يمكن بنية صنع صفة أرض إبقاء متسق.

**يأخذ Agent scope فعل صار مهمة معنى عميق درجة كائن إسقاط.** تمرير عودة مسح Context و AbortSignal حاجة path،placeholder،clone و restore بروتوكول، و يأخذ أحيانا لكن كائن بنية ترقية صار wire اتفاق؛ واحد درجة `agent` و `signal` كاف بـ تغطية حالي waterfall.

**انتظار Client Agent Context أو adapter بعد مجددا توزيع.** registry waiter، تنافس حالة تكرار فحص و مؤقت delivery Fiber سوف لـ واحد يمكن تزامن تحليل أو شيء تحويل هدف Client زيادة مقدار خارج دورة الحياة؛resolver عند تحت لا يستطيع توفير هدف وقت قيام أي `next` إبقاء Cordis waterfall دلالة.

**إعطاء Remote Event استخدام مستقل شيء إدارة WebSocket أو duplex stream.** Gateway mux قد توفير إقرار إثبات ترقية، إعادة استخدام، إلغاء، خطأ خريطة و إعادة وصل؛ تحت سطر `$events` إضافة فوق HTTP `$events/result` كاف بـ جدول بلوغ request/response، لا حاجة رقم ثلاثة بند اتصال.

**إرسال تطبيق طبقة JSON قلب قفز لقطة.** هذا سوف توسيع صارم إطار Remote stream message union، و اشتراط متصفح معالجة لا يوجد عمل خدمة يحتوي معنى تدفق كمية.WebSocket Ping/Pong بلا حاجة تغيير logical stream دلالة يكفي إبقاء carrier نشط وثب.

**متابعة إبقاء API Proxy Host mux.** هذا سوف إبقاء يد كتابة union،schema، استجابة envelope و ثاني طقم stream دورة الحياة، و جعل Session و Workspace Controller لا يستطيع مستقل يملك ذاتي ذات بيانات بروتوكول.

**من تجمع دمج `session/event` تحديث Session قائمة وقت.** قائمة صحيح تأكيد صفة سوف اعتماد متصفح صحيح في إزالة استهلاك أي بعض Session، و يأخذ مهمة معنى إضافة حدث خطأ حكم لـ مستخدم نشط وثب؛ حمل دائم `lastPromptAt` إسقاط مباشر جدول بلوغ ترتيب ترتيب واقع.

## تحقق

Gateway mux اختبار ثابت بلا logical stream وقت بناء وصل، فارغ خامل معتاد إقامة، كل مرة طلب فقط فعل مرة شيء إدارة محاولة تجربة، يمكن إعداد كما لا إنتاج تطبيق رسالة Ping/Pong، نشط حركة stream carrier failure، إلغاء و dispose بعد لم يعد إعادة وصل.

Connection اختبار ثابت generation source ناقص، تكرار تسجيل، سحب عودة،ready مهلة، و generation فشل بعد سحب عودة و إعادة بناء.

`RemoteStream` اختبار ثابت مفرد consumer،opening acceptance بعد صاف صفر retry،`restart()` فقط استبدال generation،terminal error لا إعادة محاولة و dispose quiescence.

`RemoteSnapshotStream` اختبار ثابت كل generation تماما جيد واحد نسخة opening snapshot،update-before-snapshot رفض، تكرار snapshot رفض و إعادة وصل replacement.

`RemoteJournalStream` اختبار ثابت snapshot-first opening، وصل متابعة append، تاريخ prepend، إعادة وصل replacement،gap repair و مرة صفة replacement.

Session Host اختبار ثابت cold page/follow لا زيادة attached Agent، صريح prompt بعد cold follow استلام إلى وصل متابعة حدث،direct subagent ownership،message-aligned pagination و إنهاء خطأ إسقاط.

Session control اختبار ثابت baseline-first، بارد Session لا استعادة،jobs replacement و projection watermark.

Session Client اختبار ثابت كل Session مفرد واحد journal owner، قديم open epoch لا كتابة عودة،control و journal مستقل إلغاء، و carrier retry خلال إبقاء قد إصدار نافذة.

Workspace Host اختبار ثابت baseline-first،upsert/remove، مرجعي order،archived set و follower disposal.

Workspace Client اختبار ثابت snapshot replacement،unary/stream تنافس حالة، حذف لا تكرار نشط، مستقر ترتيب ترتيب و terminal failure.

Remote Event نوع اختبار رفض لم اختيار حدث، غير void unscoped حدث، غير Agent-scoped waterfall و توقيع لا مطابقة mode.

Remote Event Host اختبار ثابت listener-before-ready،payload تحقق،pending replay، كثير Client first-result،all-next delegation،rejection،Host cancellation،Context release و losing-client cancel.

Remote Event Client اختبار ثابت نسخة خاص key،Cordis تسجيل ترتيب،Agent Context تحليل،`next`،result،rejection،cancel، قديم generation عودة حزمة رفض و `$events/result` فشل توجيه يؤدي generation انتهاء؛User Question اختبار ثابت إجراء في signal إلغاء خطأ عودة واحد تحويل و cause إبقاء.

ناقص source، تكرار source، سحب عودة source، غير ready أول بند، لم معرفة discriminant، مقدار خارج حقل و غير JSON قيمة كل في كل منها wire مدخل صدى مضيء فشل.

ساكن حالة فحص ثابت API Proxy لم يعد توجيه خروج Session/Workspace Host frame carrier،Client Runtime لم يعد يتضمن مقابل bridge.

## عاقبة

متصفح يمكن في Agent إيقاف وقت قراءة حمل دائم Session. فتح عادي Session وقت أولا إصدار prepared snapshot، مجددا بدء مرة خلفية promotion؛list،search،page و أخرى فقط قراءة observation لن تنشيط Agent.

حمل دائم سجل استخدام seq و page إصلاح ناقص بعد لاحقة؛Session control و Workspace state استخدام opening snapshot استلام جمع؛ عادي Remote Event لا تحمل وعد إعادة وضع. استعادة دلالة من بيانات نوع قرار، لم يعد متبادل متبادل نموذج محاكاة.

Gateway فقط يملك transport،generation،pending waterfall و صارم إطار wire تحقق، لا يملك Session أو Workspace عمل خدمة حقل. مجال Controller فقط توفير opener،cursor قاعدة،baseline reducer و خطأ عرض.

كل بند معتاد إقامة متصفح اتصال سوف حسب إعداد بين فصل زيادة مرة فارغ تحميل حمل Ping/Pong تسليم تبديل. وجه مقابل أكثر صارم إطار فارغ خامل مهلة، نشر جهة يمكن تقليص قصير بين فصل، بينما بلا حاجة تغيير Remote stream بروتوكول أو متصفح شفرة.

Session و Workspace Host API،stream adapter و Client بيانات نموذج كل لديه واضح owner؛API Proxy لم يعد هو هو جمع بين في وسيط.

عام stream كائن زيادة ثلاثة عدد واضح طبقة درجة، لكن حذف كل Controller كل منها نسخ retry،cancel،generation،baseline و gap-repair خارج قشرة.

Remote waterfall إبقاء كثير Client أول عدد claim، كل جسم `next` بعد متابعة Host chain، قطع خط إعادة وضع pending و طرف إلى طرف إلغاء؛ بديل قيمة هو حالي بروتوكول فقط دعم حمل واحد درجة Agent scope و بلا ضرر JSON طلب/نتيجة.

هذا قرار توسيع[Remote حدث إلقاء تمرير](2026-08-10-remote-event-delivery.zh.md) allowlist و مفرد واحد Cordis توقيع تصميم: عادي إشعار متابعة استخدام `emit`،Agent-scoped async waterfall استخدام نفس `ctx.remote.$on` وجه و صريح `waterfall` mode؛ لا بناء قيام ثاني طقم invocation map.

هذا قرار وصل إدارة[بسيط مفرد واحد عنصر API Proxy ترحيل](../../archived/architecture/2026-08-10-unary-apiproxy-remote-migration.md) في إبقاء Session،Workspace و Host event carrier، و إبقاء[خلفية مهمة عرض](../feature/2026-08-08-web-background-job-display.zh.md) الذي اشتراط كامل jobs snapshot، عملية داخل دورة الحياة و “مراقبة لا استعادة Agent” دلالة.

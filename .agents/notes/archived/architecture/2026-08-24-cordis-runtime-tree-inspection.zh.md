# Agent Note: Cordis وقت التشغيل شجرة فحص

Status: implemented
Archived: 2026-09-04

[English](2026-08-24-cordis-runtime-tree-inspection.md) | العربية

## Problem

Inspector حاجة في Chrome DevTools Elements في يأخذ كل Host و Client Cordis وقت التشغيل عرض لـ واحد شجرة شجرة. في Elements في اختيار في Cordis Context أو Fiber أيضا يجب جدول الآن لـ فوري Runtime كائن، بينما Console في ضرب طبع خروج Cordis كائن يجب قدرة تحديد موضع عودة نفس عدد دلالة عقدة.CDP id لا يستطيع يصبح مصدر نموذج:`NodeId`،`BackendNodeId` و `RemoteObjectId` owner و دورة الحياة مختلف، و كما لم قدوم موجه إلى نموذج وقت التشغيل استعلام يجب استخدام نفس نسخة Cordis بيانات، بينما لا هو مجددا عكس نحو تحليل CDP.

Host و Client في مختلف JavaScript realm في تشغيل نفسه Cordis سحب كائن. لذلك، شجرة اكتشاف و تصنيف يجب فقط لديه واحد نسخة متصفح أمان تنفيذ؛ كائن تحليل ما زال إبقاء في كل منها realm داخل، عبر MessagePort أو WebSocket فقط نقل تمرير لا نفاذ واضح مرجع.

## Decision

Inspector استخدام واحد طقم تسلسل تحويل Cordis شجرة نموذج، و يأخذ CDP بصفة هو واحد مهايئ. حزمة داخل قسم مغادرة فوري كائن اكتشاف، غير ممكن تغيير لقطة،Worker تخزين و مستهلك:

قائم[عبر realm Inspector قرار](../../implemented/architecture/2026-08-23-cross-realm-cdp-inspector.zh.md) مسؤول Worker،source carrier،Runtime توجيه و أمان نموذج؛ هذا Note فقط مسؤول Cordis دلالة بيانات و ذلك مستهلك.

```text
Host Context/Fiber ─┐
                    ├─ CordisTreeCollector ─ CordisTreeSnapshot ─ source transport ─ CordisTreeStore ─┬─ CDP DOM adapter
Client Context/Fiber┘                                                                                 └─ future model adapter
```

`CordisTreeCollector` و ذلك هوية سجل التسجيل هو متصفح أمان وحدة، معا تحرير دخول حزمة اثنان عدد تشغيل وجه.Host و Client إبرة مقابل كل منها `ctx.root` نسخة تحويل نفس نسخة شفرة؛ أي واحد جانب كل لا صيانة ثاني طقم تصنيف تنفيذ.

## Cordis tree model

`CordisTreeSnapshot` هو و CDP غير متصل بلا ضرر JSON قيمة، يتضمن schema إصدار، مفرد ضبط تمرير زيادة revision، كائن سجل التسجيل id، قطع قطع علامة سجل و واحد شجرة بـ Context لـ أصل تضمين طقم شجرة.Context عقدة يتضمن لا نفاذ واضح object handle و لديه ترتيب Context/Fiber children.Fiber عقدة يتضمن Cordis `uid`، لا نفاذ واضح object handle، و وحيد واحد يمثل `fiber.ctx` Context child.Host و Client إصدار نفس نوع realm-tree نوع. توليد Context id، إضافة metadata، خدمة بيانات، مهمة معنى خاصية قيمة و كائن preview كل لا دخول شجرة.

inspection tree من root Context بدء، لا يتضمن Cordis root Fiber. مقابل أخرى كل إضافة، ذلك parent Context يتضمن Fiber، هذا Fiber مجددا يتضمن هو يملك Context. عبر `extend()`،`isolate()` أو `intercept()` إنشاء كما لم إنشاء جديد Fiber Context ما زال هو مباشر Context فرعي عقدة. تضمين طقم بنية بلا حاجة توليد node id يكفي جدول بلوغ parent، و إبقاء اثنان صنف كائن هوية، معا تجنب تجنب يأخذ `Fiber.ctx` / `Context.fiber` حلقة كتابة تسلسل تحويل شجرة.

collector من root، سجل التسجيل في كل live Fiber، و كل event hook owner Context بدء. هو امتداد Context prototype سلسلة عودة تتبع إلى يتم فحص root، حل فتح Cordis shadow Context، حسب كائن هوية ذهاب إعادة، و ترتيب حذف قد dispose Fiber.`internal/plugin` و `internal/status` حدث ضبط درجة مرة microtask دمج بعد replacement snapshot. عقدة عدد و تحرير رمز بايت عدد حد سوف إزالة كامل ذيل جزء branch، لذلك كل إبقاء عقدة ما زال لديه parent، كل إبقاء Fiber ما زال لديه ذلك owned Context.

## Identity and lifetime

كل صنف هوية لحظة معنى إبقاء مستقل:

- Fiber `uid` قدوم ذاتي Cordis.Context حالي لا يوجد Cordis ذاتي لديه id،Inspector لن كشف واحد توليد قيمة قدوم بديل.
- `InspectorObjectReference` هو realm محلي لا نفاذ واضح handle، لأجل يأخذ شجرة عقدة تحليل صار فوري Context أو Fiber.snapshot يحمل هذا handle فقط لـ إتمام توجيه، لا يأخذ هو عند صار دلالة id أو DOM attribute.
- `BackendNodeId` من Worker لـ واحد بند إبقاء `(source id, source generation, object reference)` قسم إعداد، و في هذا generation snapshot يتم إبقاء خلال من كل DevTools اتصال مشترك.
- `NodeId` في عقدة دخول بعض عدد frontend document وقت حسب DevTools اتصال قسم إعداد؛ مقابل backend node يتم إبقاء خلال إبقاء مستقر، و في عقدة مغادرة فتح شجرة، قليل رؤية كامل document fallback أو اتصال إغلاق وقت إسقاط.
- `RemoteObjectId` في `DOM.resolveNode` كشف فوري كائن وقت من اختيار تحديد Runtime session قسم إعداد؛ هو فقط يخص هذا DevTools اتصال و object group.

`sourceId` معرف واحد متصفح tab Client runtime، و حفظ في هذا tab `sessionStorage` في، لذلك تلقائي إعادة وصل transport و صفحة تحديث جديد كل سوف إعادة استخدام هو.Client في فتح transport قبل سوف في Web Locks متاح وقت وحيد احتلال هذا id، مباشر حتى صفحة انتهاء؛ من نفس تخزين حالة نسخ خروج آخر عدد معا تخزين نشط tab لا يمكن أخذ نيل هذا قفل، بسبب بينما سوف حفظ دائم واحد جديد id. نقص قليل Web Locks متصفح ما زال إبقاء أساس في تخزين تحديث جديد هوية، لكن لا يمكن وسيط قطع نسخ خروج live tab.`generation` معرف مرة WebSocket وصل قبول كما كل مرة كل سوف جولة تبديل. قطع ربط عبر `Runtime.executionContextDestroyed` من Console إزالة synthetic context. إعادة وصل سوف إصدار جديد CDP execution-context id، لأن قد إلغاء تدمير id و ذلك RemoteObject لا يستطيع إعادة استخدام؛ هذا و لا يمثل متصفح قاع طبقة JavaScript realm يتم إعادة إنشاء.

معيار CDP لن في `DOM.Node` فوق وضع وضع `RemoteObjectId` حقل.`DOM.Node` يحمل `nodeId` و `backendNodeId`؛`DOM.resolveNode` إرجاع مقابل `Runtime.RemoteObject`،`DOM.requestNode` تنفيذ عكس نحو خريطة. تنفيذ سوف صلة ربط هذا ثلاثة صنف CDP هوية، بينما لا إضافة غير معيار DOM حقل.

## Realm object bridge

كل collector كل في خاص global symbol تحت تسجيل واحد realm محلي كائن جدول. هذا جدول يأخذ لا نفاذ واضح handle خريطة إلى فوري كائن، و قدرة حسب هوية تعرف آخر حالي إبقاء كائن. استبدال لقطة وقت سوف إزالة جديد شجرة في لا وجود handle؛dispose observer وقت ملاحظة إلغاء هذا جدول.

مقابل Host عقدة،Worker استخدام هذا DevTools اتصال خاص `node:inspector.Session` في Host كائن جدول في تنفيذ استعلام، من بينما توليد أصلي V8 `RemoteObjectId`. مقابل Client عقدة،Worker عبر قد لديه نوع تحويل Client Runtime channel توجيه نفس استعلام، مجددا يأخذ إرجاع Client handle خريطة لـ اتصال محلي CDP object id. فوري كائن و جذب محرك object id كل لن اختراق مرور source transport.

Client Runtime value يحمل واحد اختياري، قد تحقق `InspectorObjectReference`،Host Runtime value فإن عبر أصلي V8 object id استكشاف قياس. عام مشترك CDP adapter يأخذ قد تعرف آخر evaluation result،property،exception،Console argument و paused-frame object تعديل صار `subtype: "node"`، سجل object-id إلى backend-node علاقة، و توفير Cordis element description. هذا مثال اثنان عدد جهة نحو كل صار قيام:Elements يمكن كشف فوري كائن،Console في إرجاع أو ضرب طبع Context و Fiber أيضا قدرة تحديد موضع إلى Elements.

## Worker repository and updates

source يأخذ Cordis شجرة بصفة إبقاء حالة إصدار، بينما لا هو حدث تاريخ.Host MessagePort و Client WebSocket publisher إبقاء الأكثر جديد حالة سجل، و في وصل قبول، إعادة وصل أو استلام إلى resnapshot طلب بعد يأخذ هو وضع دخول `source/replace`. فوري replacement ما زال مشي عادي لديه ترتيب append مسار.Worker في أصل فرعي استبدال قديم شجرة قبل تحقق snapshot دقيق حقل، عقدة عدد و عميق درجة حد،object handle و Fiber uid وحيد صفة،Context root، و كل Fiber تماما جيد يملك واحد Context child.

`CordisTreeStore` فقط يملك قد تحقق realm snapshot و source دورة الحياة. داخلي reader لـ Runtime و DOM إبقاء live object route؛ عام مشترك reader فإن إسقاط واحد شجرة لا يحتوي transport أو CDP id detached `{ host, clients }` tree.Host و Client `ctx.inspector.cordis.getTree()` عبر نفس طقم صلة ربط استعلام بروتوكول قراءة نفس عدد Worker reader، لا إنشاء CDP session.`CordisDomBackend` زيادة Worker عام backend id، كل `CordisDomSession` فإن يملك frontend node id، بحث،enable حالة و RemoteObject صلة ربط. نموذج adapter يمكن إزالة استهلاك عام مشترك reader، بينما لا اعتماد DOM تسلسل تحويل أو debugger activation.

source إغلاق وقت، تخزين شجرة من connected تغيير لـ disconnected، بينما لا هو حذف الأكثر بعد واحد نسخة snapshot. كائن استعلام سوف ترتيب حذف disconnected شجرة، لذلك snapshot ما زال يمكن بصفة بيانات فحص، لكن لن إبقاء أو تكرار نشط فوري Context،Fiber أو Runtime object. نفس source id جديد transport generation إيداع replacement بعد، سوف أصل فرعي استعادة connected حالة. يمكن إعداد disconnected tree عدد كمية حد أعلى سوف تصفية استبعاد الأكثر مبكر إبقاء snapshot.

كل يتم قبول source snapshot كل سوف إعادة بناء connection-neutral document، و حسب مستقر backend node identity مقارنة مقارنة فرق مختلف. فقط تغيير revision replacement لا إرسال DOM event؛ فرعي عقدة زيادة حذف استخدام `DOM.childNodeInserted` و `DOM.childNodeRemoved`،attribute تغير استخدام مقابل DOM event، أخ أخ عقدة إعادة ترتيب فقط مقابل هذا parent استخدام `DOM.setChildNodes`. فقط لديه نفس backend identity يتم إعادة استخدام لـ مختلف node kind وقت عندئذ رجوع إلى `DOM.documentUpdated`. قطع ربط فقط سوف جعل object route بطلان، لا تغيير إبقاء DOM tree، لذلك إبقاء توسيع و اختيار؛ بلوغ إلى إبقاء حد أعلى وقت فقط إزالة يتم تصفية استبعاد `<client>` عقدة.

## CDP projection

synthetic document يتضمن واحد `<host>` container و واحد `<clients>` container.`<host>` يتضمن Host root Context؛`<clients>` لـ كل Client source يتضمن واحد `<client>`، كل `<client>` مجددا يتضمن هذا realm root Context. هذه بنية element لا يوجد Runtime object أو attribute.Context element لا يوجد attribute.Fiber element فقط كشف من Cordis أصل مثال نسخ `uid`.connected Context و Fiber يمكن تحليل لـ live RemoteObject؛disconnected snapshot إبقاء DOM node، لكن كائن تحليل فشل.

معيار CDP لا يوجد يمكن من backend تحكم، لأجل عادي Elements شجرة عقدة frozen،locked أو dimmed حالة.Chromium detached-node عرض فقط وجود في Memory وجه لوح `DOM.getDetachedDomNodes` مسار، و من frontend محلي ضبط. في عرض طريقة واضح قبل، لا زيادة connection-state attribute أو غير معيار `DOM.Node` حقل.

فقط قراءة مهايئ تنفيذ document نيل أخذ، فرعي عقدة طلب، عقدة وصف، خاصية،outer HTML، بحث،backend-id push، عقدة تحليل و كائن عكس نحو استعلام. تعديل نوع DOM طريقة واضح فشل.layout،CSS،accessibility و متصفح DOM geometry لا يخص هذا شجرة دلالة شجرة؛ فقط في Chrome DevTools حاجة توافق استجابة وقت إرجاع فارغ نتيجة أو unsupported.

## Alternatives considered

**في كل realm مباشر بناء CDP DOM node.** رفض، لأن Host و Client سوف تكرار تصنيف،frontend id سوف تسرب تسرب دخول source بروتوكول، نموذج مستهلك أيضا يجب يأخذ عرض بروتوكول عكس نحو تحليل صار Cordis عام فكرة.

**يأخذ فوري كائن أو V8 object id إرسال إعطاء Worker.** رفض، لأن structured clone و JSON لا يمكن إبقاء هوية أو سلوك، بينما كما جذب محرك object id فقط يخص واحد inspector session.

**من Inspector توليد Context id.** رفض، لأن Cordis Context لا يوجد ذاته id، عرض مهايئ لا يستطيع يأخذ تنفيذ key زائف تركيب صار إطار هيكل هوية. تضمين طقم children جدول بلوغ parent، لا نفاذ واضح object handle فقط بصفة توجيه بيانات.

**Fiber uid،backend node و frontend node مشترك استخدام واحد id.** رفض، لأن source إعادة وصل، كثير بند DevTools اتصال،document refresh و Runtime object release دورة الحياة ذاك هذا مستقل.

**فقط كشف Context، و يأخذ كل Fiber يملك Context عند صار Fiber.** رفض، لأن هذا سوف فقد فقد اثنان صنف فوري كائن في واحد صنف، جعل Console هوية إنتاج اختلاف معنى، و يجعل لاحق Fiber مخصص تابع خاصية فقد ذهاب مستقر owner.

**يأخذ نموذج وصول API وضع في CDP مهايئ فوق.** رفض، لأن نموذج وصول سوف وراثة Chrome مخصص استخدام node تسلسل تحويل، تدريجي اتصال id و enable حالة.Worker repository هو مشترك بيانات مصدر،CDP و نموذج وصول هو و صف مهايئ.

**source قطع ربط وقت إزالة realm شجرة.** رفض، لأن نقل في قطع سوف فقد فقد الأكثر بعد واحد نسخة لديه استخدام توسيع اندفاع، و طي مستخدم في Elements في فحص حالة. متابعة استخدام قديم object handle نفس مثال غير ممكن قبول: جديد اتصال generation لا يمكن إثبات أي أولا قبل فوري كائن ما زال وجود.

## Verification

- نفس عدد collector تنفيذ قدرة من انتظار قيمة Cordis وقت التشغيل توليد Host و Client لقطة.
- Elements عرض `<host>` و `<clients>/<client>` container، كل realm root Context مباشر يقع في ذلك container تحت.
- Context element لا يحتوي attribute؛Fiber element فقط كشف Cordis `uid`؛root Fiber لا ظهور.
- كل connected Context و Fiber كل لديه واحد اتصال محلي frontend node id، واحد Worker backend node id و واحد يمكن تحليل اتصال محلي Runtime object id، كما هو جمع كل لا بصفة attribute كشف.
- `DOM.resolveNode` و `DOM.requestNode` قدرة نحو إرجاع خريطة Context/Fiber هوية، كما لن عبر DevTools اتصال أو source generation مشترك object id.
- Runtime evaluation إرجاع Context أو Fiber سوف يتم علامة لـ node، و قدرة في Elements في تحديد موضع.
- قطع ربط سوف إلغاء تدمير Client execution context و RemoteObject، معا أصل مثال إبقاء الأكثر بعد واحد شجرة Elements شجرة؛ جديد transport generation في كامل snapshot وصول بعد استبدال هو.
- إعادة وصل و resnapshot سوف إعادة وضع الأكثر جديد شجرة حالة؛ بلا تغير snapshot لا إرسال DOM mutation، بنية تغير فقط تحديث تلقي أثر parent أو node. شاذ شكل أو تجاوز حد replacement لن استبدال الأكثر بعد واحد صالح لقطة.
- تخزين snapshot و استعلام API لا يتضمن CDP نوع، يمكن لا إضافة تعديل أرض دعم حمل لم قدوم نموذج مهايئ.

## Consequences

Cordis لا توفير كامل عام Context registry.collector قدرة استعادة من live fiber و event hook يمكن بلوغ Context؛ واحد قد إنشاء، من لم استخدام كما فقط من تطبيق شفرة إبقاء Context سوف متعمد نقص مقعد.

حاجة دلالة تعرف آخر كل Host object كل سوف زيادة مرة Runtime round trip.annotation فشل وقت إبقاء عادي RemoteObject، لا كسر تالف Runtime أو Debugger إلقاء تمرير.Client Console observation إبقاء أصلي method result، و في بعد ضبط درجة تسلسل تحويل؛ كل قد تفعيل DevTools session مستقل إبقاء handle، لذلك تعرف آخر حيث لا منع سد صفحة استدعاء، أيضا لا في اتصال بين مشترك كائن.

source ما زال إصدار كامل snapshot، من بينما إعادة استخدام نفس طقم Host/Client collector، و قدرة في observation فقد فقد بعد استعادة.Worker تحمل تحمل snapshot مقارنة مقارنة صار هذا، مجددا إرسال زيادة كمية CDP DOM mutation، جعل بلا تغير revision لن إعادة وضع Elements document. عقدة عدد و بايت عدد حد سوف إبقاء صالح بادئة و تقرير إبلاغ قطع قطع؛ بـ بعد يمكن استبدال source delta بروتوكول، بينما لا تعديل snapshot model أو CDP projection.

كائن جدول سوف متعمد قوي مرجع حالي مرئي شجرة في كل كائن، مباشر إلى تحت مرة replacement أو observer dispose. هذا تجميع دمج تلقي إبقاء لقطة حد، لا يستطيع توسيع صار عام كائن سجل التسجيل.

Worker مقابل قطع ربط snapshot فقط إبقاء تسلسل تحويل metadata؛ ما زال في تشغيل source مستقل يملك ذلك realm-local object registry،dispose سوف تحرير هذا registry.`maxDisconnectedCordisTrees` قيد Worker snapshot داخل تخزين؛ تصفية استبعاد وقت سوف إزالة مقابل قد إبقاء Client subtree.

# Agent Note: عبر realm CDP Inspector

Status: implemented
Archived: 2026-09-04

[English](2026-08-23-cross-realm-cdp-inspector.md) | العربية

## Problem

Host تشخيص، متصفح Client مراقبة قياس و JavaScript ضبط تجربة قدوم ذاتي مختلف JavaScript realm.Host رئيسي خط مسار فوق debugger transport لا يمكن في هذا خط مسار مؤقت توقف وقت إلقاء تمرير `Debugger.resume`؛ إذا كل producer مباشر توليد CDP، أيضا سوف تكرار بروتوكول حالة، و يأخذ تطبيق مراقبة قياس منطق ربط إلى Chrome عرض بروتوكول.

## Decision

`@deepseek-ai/dsh-experimental-inspector` هو واحد خاص Client/Host مزدوج وجه Cordis إضافة حزمة.Host وجه بدء Node Worker،Client وجه مباشر اتصال هذا Worker.Cordis فقط مسؤول تركيب، خدمة إصدار،bootstrap حقن و dispose؛source بروتوكول،Worker حالة،CDP server،V8 bridge و domain adapter لا فحص Cordis وقت التشغيل بيانات.

Worker هو وحيد CDP endpoint، أيضا هو CDP حالة وحيد owner.Host و Client producer عبر لديه إصدار داخلي بروتوكول إرسال تحقق بعد مراقبة قياس سجل؛Client Runtime،Console،Sources و دلالة استعلام في نفس بند تمييز حق carrier فوق استخدام متبادل متبادل مستقل نوع تحويل لقطة.realm registry لـ كل بند DevTools اتصال توفير نفسه Runtime،Console،Sources و Debugger capability slot، و استخدام واضح unsupported عضو إبقاء Host و Client دعم حمل فرق مختلف.

## Realm كل حق

Host رئيسي خط مسار يملك تطبيق كائن و `globalThis.fetch`. هو عبر مخصص استخدام `MessagePort` إرسال مراقبة قياس سجل، أبدا بنية صنع CDP رسالة.

Client صفحة يملك متصفح مراقبة قياس، طلب قيمة نيل إلى قيمة و Client object handle. هو عبر حمل تمييز حق ingest WebSocket مباشر و Worker تسليم تبديل JSON لقطة، لذلك Host مؤقت توقف لن منع قطع Client إلقاء تمرير أو Runtime تنفيذ.

Inspector Worker يملك HTTP discovery، اثنان بند WebSocket route،source generation، إبقاء تاريخ،realm session،CDP session و domain adapter. كل بند DevTools اتصال لـ Host و كل قد اتصال Client realm قسم آخر بناء قيام واحد طقم backend session.V8 object id فقط إبقاء في Node Runtime backend داخل.Client object handle فقط إبقاء في نوع تحويل Client بروتوكول داخل. مفرد عدد connection-local object table يأخذ اثنان صنف backend handle خريطة صار CDP object id، و إسقاط نفس نوع RemoteObject،property،exception،Console و paused-frame نوع.

Chrome DevTools إزالة استهلاك واحد page نوع target.Runtime طريقة حسب execution context أو object id توجيه؛Debugger source طريقة حسب script id توجيه.Host script إبقاء أصلي ضبط تجربة،Client script فقط كشف فقط قراءة محتوى، و رفض active debugging.`Profiler` و `HeapProfiler` ما زال فقط يخص Host؛`Network` و الأكثر صغير page-target scaffold في Worker داخل تنفيذ.

## Source بروتوكول

MessagePort و WebSocket carrier استخدام نفس مجموعة JSON قيمة و حكم آخر ربط دمج لقطة.source معرف واحد منطق producer و واحد اتصال generation، إعلان capability و topic، إرسال ابتدائي replace، مجددا إلحاق حمل sequence batch.Worker في قراءة domain حقل قبل رفض شاذ شكل، تجاوز حد، قديم generation و لم إعلان topic لقطة.

إلقاء تمرير لديه ترتيب كما كل قوة بينما لـ.producer لا في تطبيق مسار فوق انتظار acknowledgement. محدود producer طابور صف عبر sequence gap تقرير إبلاغ يتم إسقاط بادئة؛Host MessagePort carrier معا فقط سماح واحد append batch في طريق، و في Worker تأكيد إزالة استهلاك بعد إرسال تحت واحد دفعة. لا يمكن حل تفسير gap سوف يجعل Worker طلب جديد snapshot.domain store فقط إبقاء محدود حالة، و في source قطع فتح وقت واضح إغلاق لم إتمام عملية.

Runtime لقطة استخدام غلاف إغلاق command و result ربط دمج، بينما لا هو method نص إضافة بلا نوع parameter record. كل request يحمل source id،source generation،DevTools Runtime session id،request id و command؛ كل result تكرار هذه هوية و command حكم آخر رمز.Console lifecycle/event، قسم كتلة source قراءة و غير CDP دلالة استعلام استخدام كل منها مستقل صلة ربط لقطة.RemoteObject value،preview،property descriptor،call argument،exception،Console event،debugger frame،script و error كل لديه مستقل دقيق decoder.

## Client Runtime،Console و Sources

`Runtime.enable` إصدار Host حقيقي execution context، و لـ كل إعلان Runtime قدرة قد اتصال Client source إصدار واحد سالب عدد id synthetic execution context. لا إشارة تحديد context ما زال يمثل Host.Client source replacement سوف إلغاء تدمير قديم context، و بـ جديد generation و unique id إنشاء جديد context.

Client Runtime فرعي تجميع يشمل `Runtime.evaluate`،`Runtime.getProperties`،`Runtime.callFunctionOn`،`Runtime.awaitPromise`،`Runtime.releaseObject`،`Runtime.releaseObjectGroup` و `Runtime.globalLexicalScopeNames`.Client في صفحة realm في تنفيذ أمر، و في حسب DevTools Runtime session عزل جدول في إبقاء فوري كائن.Client فقط إرجاع لا نفاذ واضح handle و JSON-safe metadata؛Worker تحقق نتيجة و قسم إعداد اتصال خاص CDP object id. كائن معامل فقط قدرة من نفس Client source generation و DevTools session استخدام.source قطع فتح،Runtime disable،DevTools إغلاق، تحرير كائن أو تحرير object group كل سوف إزالة مقابل handle.

JavaScript exception هو يحمل `exceptionDetails` نجاح Runtime response؛transport failure استخدام مستقل error ربط دمج.Worker deadline سوف نحو Client إرسال request-scoped cancellation.response قسم إعداد handle في Worker تأكيد هذا response قبل إبقاء provisional، لذلك cancellation و late response لن إبقاء تحت لا يمكن وصول كائن. لديه حد أمر deadline، كائن عدد، خاصية عدد،source بايت عدد و لقطة بايت عدد قيد إبقاء أو إرجاع حالة.

Client Console observer إبقاء أصلي صفحة استدعاء سلوك، و لـ كل قد تفعيل DevTools session مختلف خطوة إرسال خروج واحد نسخة event. كل session يأخذ argument تسلسل تحويل إلى ذاتي ذات `console` object group، لذلك قطع ربط،Runtime disable أو `Runtime.discardConsoleEntries` يمكن تحرير واحد بند اتصال بينما لا جعل أخرى اتصال بطلان.Context و Fiber argument استخدام و طلب قيمة نتيجة نفسه دلالة مرجع و DOM عكس نحو خريطة.

Client من تجميع بعد web boot graph اكتشاف هذه الحزمة `lib/client.js` URL.`Debugger.enable` عبر نوع تحويل source operation قراءة metadata،`Debugger.getScriptSource` إعادة مجموعة محدود base64 chunk؛source map إبقاء في عام نشر URL فوق متاح.Client script breakpoint،step و call-frame عملية واضح لا تلقي دعم حمل، لأن صفحة JavaScript لا يمكن مؤقت توقف ذاته realm بعد متابعة معالجة تحكم رسالة.target-wide pause و resume متابعة تحكم Host debugger.

## Host ضبط تجربة

Worker لـ كل بند DevTools اتصال بناء قيام مستقل Node inspector Session، و اتصال Host رئيسي isolate.Node Runtime،Console،Sources و Debugger backend يأخذ أصلي value و event عودة واحد تحويل صار Client backend استخدام نفس نوع realm model. عام مشترك projector لـ طلب قيمة نتيجة،Console argument،paused scope و call-frame result قسم إعداد connection-local object id.breakpoint request وصول Node قبل سوف عكس نحو تحويل صار أصلي backend handle. افتراضي context يمكن تعديل عرض اسم لـ `Host`، لكن إبقاء حقيقي id و metadata.

Host JavaScript مؤقت توقف وقت،Worker event loop،DevTools socket،Client ingest socket و Node inspector Session ما زال يمكن تشغيل.Host مراقبة قياس ذاتي لكن مؤقت توقف إلى resume.

## Fetch أخذ تجميع

fetch أخذ تجميع حزمة تركيب `globalThis.fetch`، و افتراضي فتح بدء. بعد كل مرة fetch كل سجل كامل URL،headers، طلب جسم، استجابة headers، استجابة جسم، وقت، إلغاء و خطأ. افتراضي لا انفصال حساس أي حقل؛ تفعيل Inspector أي يأخذ هذه سري سري تسليم إعطاء هذا آلة DevTools.

wrapper يأخذ معيار تحويل Request تسليم إعطاء أصل fetch، عبر مستقل أخذ تجميع مهمة قراءة request/response clone، و في fetch resolve بعد قيام أي يأخذ أصلي Response تسليم إعطاء استدعاء جهة. أخذ تجميع فشل لا نيل تغيير استدعاء جهة fetch نتيجة. لديه حد مفرد جسم و journal ميزانية منع توقف بلا حد إبقاء؛ تجاوز مرور ميزانية وقت إبقاء قد أخذ تجميع بادئة و تقرير إبلاغ قطع قطع.

## Alternatives considered

**في Host رئيسي خط مسار تشغيل CDP server.** رفض، لأن قطع نقطة سوف تجميد ربط مسؤول إلقاء تمرير `Debugger.resume` socket.

**مرور Host web server في تحويل Client مراقبة قياس.** رفض، لأن Host قطع نقطة نفس مثال تجميد ربط في تحويل، و جعل Client بيانات مسار اعتماد Host استجابة.

**يجعل producer مباشر توليد CDP رسالة.** رفض، لأن Chrome مخصص استخدام request id، إعادة تشغيل،enable حالة و ترتيب ترتيب سوف سقوط دخول producer، بينما لا هو مجال مراقبة قياس.

**كثير عدد DevTools client مشترك استخدام واحد Node inspector Session.** رفض، لأن object id،object group،enable حالة و debugger عملية يخص مفرد عدد بروتوكول session؛ مشترك حاجة سهل خطأ وهمي محاكاة session طبقة.

**عبر WebSocket إرسال Client فوري كائن أو CDP object id.** رفض، لأن JSON لا يمكن إبقاء كائن هوية أو سلوك، بينما CDP object id فقط يخص واحد بند DevTools session.Client-local handle إضافة Worker كل تدريجي اتصال خريطة معا صيانة هذا اثنان بند كل حق قاعدة.

**استخدام واحد بلا نوع Runtime RPC method.** رفض، لأن method نص و مهمة معنى parameter object لا يمكن حفظ إثبات command/result صلة ربط، كائن مرجع كل حق، أيضا لا يمكن في Runtime،Sources و Debugger دعم حمل زيادة طويل وقت فعل نفاد كل عرض دخول.

**يأخذ protocol،Host و Client تفكيك صار كثير عدد حزمة.** فعلي تحقق مرحلة مقطع رفض. واحد حزمة إبقاء قدرة بـ واحد Client/Host إضافة نشر، معا من شفرة المصدر دليل و بناء مدخل صيانة realm حد.

**استخدام Undici diagnostics channel بصفة كامل fetch بيانات مصدر.** رفض، لأن هو قدرة مراقبة transport lifecycle، لكن لا يمكن في لا إزالة استهلاك تطبيق stream قبل رفع تحت توفير كامل request/response body. لاحق يمكن استخدام هو تكملة ملء transport درجة timing.

## Verification

- حقيقي Worker معا استقبال Host MessagePort و Client WebSocket source، و عبر واحد CDP target كشف اثنان من.
- شاذ شكل، تجاوز حد، قديم generation و sequence gap لقطة لن كسر تالف أخرى source أو Worker.
- Console في Host context طلب قيمة و استقبال Host console event.
- Console صف خروج Host و Client context؛Client طلب قيمة، خاصية، دالة استدعاء،Promise await و تحرير عملية صيانة حمل RemoteObject هوية، كما لا في realm أو DevTools اتصال بين مشترك كائن.
- Host و Client Console event استخدام نفسه projector؛Client argument حسب DevTools اتصال عزل،Cordis argument يمكن تحليل إلى Elements node.
- Sources استقبال Host script و بناء بعد Client bundle؛Client source قراءة اعتماد قسم كتلة نقل،active debugging واضح فشل، بينما Host ما زال يمكن يتم قطع نقطة مؤقت توقف، طلب قيمة call frame و resume.
- Host paused scope و call-frame result استخدام و Runtime طلب قيمة نفسه connection-local RemoteObject table.
- Network إعادة تشغيل `Network.enable` قبل طلب، و بلا متروك تسرب، بلا تكرار أرض دفع إرسال لاحق طلب.
- نجاح، فشل، إلغاء، إعادة تحديد نحو، نص، اثنان دخول صنع، تدفق صيغة و قطع قطع fetch كل إبقاء استدعاء جهة سلوك، و كشف إعداد سماح كامل أخذ تجميع بيانات.
- dispose إيقاف أخذ تجميع، إغلاق مدخل، قطع فتح V8 session، إغلاق socket، و انتظار Worker exit بعد إتمام.

## Consequences

Worker كل endpoint في Host JavaScript مؤقت توقف وقت ما زال إبقاء DevTools تحكم يمكن استجابة، و يجعل Host و Client مراقبة قياس مشترك وحيد CDP حالة owner. هذا بند كل حق حمل قدوم التالي أمان، مورد و توافق صفة صار هذا.

كامل fetch أخذ تجميع سوف متعمد يأخذ credential و payload كشف إعطاء أي قدرة اتصال CDP endpoint هذا آلة عملية.loopback استماع هو قوي صنع اشتراط، لكن لا هو تمييز حق.

clone request/response stream سوف زيادة CPU، داخل تخزين و I/O ضغط قوة. لديه حد ميزانية قدرة قيد إبقاء بايت، لا يستطيع يجعل كامل أخذ تجميع لا يوجد صار هذا.

page نوع synthetic target اعتماد Node أصلي inspector domain خارج واحد مجموعة Chrome DevTools توافق استجابة. كل no-op كل يجب واضح تسمية و لديه اختبار؛ موحد واحد ابتلاع إسقاط لم معرفة طريقة سوف إخفاء غطاء بروتوكول عائم نقل.

Client Runtime تنفيذ استخدام صفحة JavaScript طلب قيمة، لذلك صفحة Content Security Policy ممكن رفض هو، أيضا لا تحمل وعد أصلي DevTools command-line أو REPL دلالة. فقط قراءة Client Sources لا بديل جدول active Client debugging؛ زيادة هذا قدرة حاجة واحد في يتم فحص صفحة realm مؤقت توقف وقت ما زال قدرة استجابة تنفيذ agent.

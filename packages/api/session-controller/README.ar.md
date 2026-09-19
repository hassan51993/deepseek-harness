---
description: "Host و Client جلسة تحكم: إنشاء، استعادة، تلميح، تتبع مع تاريخ و إسقاط فوري جلسة حالة."
kind: "package-reference"
---
# Session Controller

[English](README.md) | العربية

## عام وصف

`@deepseek-ai/dsh-api-session-controller` يملك Host `ctx.sessionController` خدمة، و توليد Client `session`،`skills` و `fileReferences` Remote namespace. هو توفير Session دورة الحياة و تاريخ،Host generation نموذج دليل، مساحة العمل مسار فتح، مستخدم يمكن استدعاء skill(تقنية قدرة) اكتشاف و Agent(ذكي جسم) نطاق ملف مرجع. عند Client حاجة حسب Session بحث عنوان عملية وقت، طلب عبر API Gateway استخدام هو.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [Client مرجع](#client-references)
- [جلسة وسيط جسم مرجع](#session-media-references)
- [إعداد](#configuration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

تاريخ صفحة و follow opening لقطة لـ كل حمل دائم Session حدث يحمل واحد بند `{ type: 'event', event: SessionWireEvent }` record.Client يأخذ كل بند قد قبول record إبقاء لـ واحد حمل دائم `SessionEventLikeEntry`؛Assistant token حد إبقاء في `assistant/message` أو `assistant/attempt` ضيق تجميع تدفق داخل. أداة معامل، نتيجة محتوى، فشل معلومة و `tool/result.data.meta` أصل مثال عبر؛ تحكم جهاز لا تحليل أداة تعريف، لا تشغيل عرض تحويل جهاز، أيضا لا مرفق إضافة UI بيانات.

Client journal في إصدار follow لقطة،live entry أو تاريخ صفحة قبل تحقق دقيق V3 حدث envelope. هو إعادة استخدام متصفح أمان Session validator، فحص مطلوب surface marker، دقيق replacement endpoint، أكثر مبكر كما وحيد source seq، داخل تضمين Assistant مزود بيانات وصفية،request header اختياري حقل حذف قاعدة و أداة خطأ متسق صفة. بلا فاعلية record مباشر فشل، لا حذف حقل أو عودة واحد تحويل؛ نطاق عضو و مصدر وجود ما زال من Host حمل دائم سجل فحص.

كل endpoint كل إعلان ذاتي ذات تنشيط سياسة. قائمة فقط قراءة حفظ دائم header و projection cache row، أبدا استدعاء تدريجي Session stat أو فتح بارد Session body. حالي صيغة cache identity يمكن توفير الكل قائمة hint؛ دورة الحياة مطابقة predecessor cache فقط قدرة توفير إصدار توافق title، بصفة ممكن مرور وقت عرض واقع، أبدا قدرة بصفة مرجعي fold seed. بحث، مرفق عنصر، تاريخ صفحة، سجل تتبع مع،skill اكتشاف و مساحة العمل مسار فتح يمكن في لا تنشيط Agent حال حال تحت فحص persistence؛`canOpenWorkspacePath()` بلا حاجة إشارة تحديد Session يكفي تقرير إبلاغ أصلي فتح قدرة. إلغاء اشتراط live حالة؛queue تغيير، نموذج، إعادة تسمية،prompt و ملف مرجع عملية يمكن تحليل أو استعادة عادي Session. نص التوجيه سوف في تحليل Agent أو إلحاق Session حدث قبل، رفض حيث لا يوجد غير فارغ أبيض نص أيضا لا يوجد مرفق عنصر content؛queue edit فقط قبول غير فارغ نص content.prompt دقيق دخول من حقن [`fileUploads`](../../client/file-upload/README.ar.md) Host خدمة أخذ نيل لا نفاذ واضح سند إثبات، في يأخذ كامل لديه ترتيب محتوى قائمة تسليم إعطاء `ctx.attachments` قبل تحليل كل يخص نفس Agent سند إثبات.`requestId` قد دخول queue أو سجل وقت،prompt إعادة محاولة مباشر إرجاع أصل قدوم قبول نتيجة، لن تكرار إدراج دخول رسالة. فقط لديه create و fork سوف مباشر إنشاء جديد Agent. هذا خدمة يأخذ نفس طقم شعور معرفة preset استعادة سياسة و subagent ownership fence معا لأجل ذاته طريقة، و أخرى Remote namespace استخدام Typert Agent و Session lookup.Queue تغيير فقط لديه واحد ضيق ضيق مثال خارج: حالي projection identity لـ continuable كما قدوم ذاتي ذاته غير seed suffix في خط child، يمكن في اثنان عدد inbox هدف فوق استخدام عادي Edit،Remove و QueueDock Steer action.One-shot، ناقص، لم معرفة، ضرر تالف، فقط يحتوي seed identity أو بارد child متابعة يتم رفض، كما لن استعادة.skill دليل أولوية استخدام قد لديه live Agent، لا فإن استخدام الذي سجل preset معتاد إقامة scope، لذلك قائمة استعلام أبدا سوف بدء Agent. مرور مرور تمييز حق ملف تسليم توجيه عبر `workspaceDesktop()` نيل أخذ توفير خدمة Host اسم و ملف إدارة جهاز سلوك.`openWorkspacePath({ path, action: "reveal" })` سوف ملف إدارة جهاز تنقل تفويض حمل إعطاء أصلي مهايئ؛ حذف `action` وقت فتح افتراضي تطبيق.

Client قائمة تحديث جديد إبقاء لم تغير سطر كائن، و في ترتيب و قيمة متساو نفسه وقت إعادة استخدام بند عدد مجموعة. كل سطر `retainedBy` يتضمن محلي مرجع مصدر صحيح حساب عدد؛Host بيانات وصفية تحديث جديد لا يستطيع تغطية هو جمع. ذاكرة مؤقتة عضو فحص استخدام كل مرة تحديث جديد بناء ID تجميع دمج، لذلك مقابل حساب صار هذا مع حالي قائمة و إبقاء ذاكرة مؤقتة قاعدة نموذج خط صفة زيادة طويل.

Client مهايئ توفير `SessionEventStream`، أي ربط إلى واحد عادي Session أو direct subagent address Gateway `RemoteJournalStream`. هو في قراءة أول عدد page قبل فتح follow، فقط إصدار وصل متابعة `replace`،`prepend`،`append` و `settle-assistant` تغيير، و عبر tail page إصلاح إعادة وصل أو seq نقص فتحة. نحو بعد قسم صفحة لديه اثنان عدد حركة كلمة:`loadOlder()` سحب واحد صفحة 50 بند رسالة، بينما `loadThrough(seq)`——جولة قفز تحويل تحميل جهاز——حسب كل صفحة 200 بند رسالة حلقة سحب أخذ مباشر إلى نافذة تغطية هدف seq، تكرار استدعاء سوف تحت ضبط مشترك هدف، لقاء إلى بلا دخول عرض صفحة أي إيقاف، مشغول مشغول حالة إعادة استخدام نفس عدد `loadingOlder` لقطة موضع.Web مهايئ صريح اختيار استقبال بلا cursor Assistant frame: كل opening يحمل نشط وثب attempt `startedAfterSeq`،`nextIndex` و ضيق تجميع stream، كل stream member كل يصبح ترتيب في حمل دائم cursor بين Client-only `assistant/live-chunk` بند.Host سوف مع هذا baseline التقاط follower محلي وصول ترتيب رقم، و كبح صنع هذا cut و قبل buffered frame؛replacement Agent يمكن من revision واحد إعادة بدء. نشط وثب opening بعد وصول حمل دائم `assistant/message` أو `assistant/attempt` فقط لديه في ذلك seq متأخر في `startedAfterSeq` كما جولة و خطوة مطابقة وقت عندئذ سوف إبقاء مؤقت تخزين؛ مطابقة end type،seq و index سوف إصدار واحد أداة اسم settlement delta، حذف هذا attempt لحظة حالة row، إضافة دخول حمل دائم بند، و إبقاء نفس خطوة في أكثر مبكر retry. معروف attempt revision، سري تجميع index أو settlement نقص فتحة سوف إعادة فتح follow؛ إذا controller خطأ مرور start، فإن تجاهل اختصار unknown-attempt frame، و صحيح معتاد إصدار ذلك حمل دائم settlement.Abandoned end سوف إصدار لا يحتوي حمل دائم بند settlement delta، جعل لحظة حالة row قيام أي خروج. حمل دائم نقص فتحة إصلاح page لا يحمل Assistant baseline، لذلك held notification سوف إعادة فتح follow مرة، بـ أخذ نيل إعداد مقابل page و baseline. كل بند تاريخ record فقط تغطية ذاته حدث seq. عمل خدمة،persistence أو لا يمكن استعادة وصل متابعة صفة خطأ سوف إنهاء stream، فقط لديه شيء إدارة تحميل جسم قطع فتح عندئذ إطلاق تلقائي استعادة.`SessionControlStream` هو Gateway `RemoteSnapshotStream`؛ كل بديل كل بـ كامل عملية محلي baseline بدء، لذلك إعادة وصل سوف استبدال jobs و projection حالة، بينما لن يأخذ لحظة حالة قيمة عند عمل durable event. كل مرة Host generation حينئذ خيط وقت، تزامن Client حجز قراءة سوف أولا صاف حذف إبقاء إسقاط قيمة و ذلك ماء موضع، مجددا تحديث جديد استعلام و إعادة فتح control stream، منها أيضا يشمل control baseline في لا يوجد صف خروج Session. أول مرة control stream سوف انتظار generation حينئذ خيط، تأكيد حفظ ذلك opening قيمة لن أولا في قديم حالة تنظيف وصول. فوق واحد بديل بعد لم إتمام list استجابة لا يمكن إعادة إصدار هذه قيمة. نفس generation داخل، تأخير متأخر وصول control baseline لا يستطيع تغطية أو صاف حذف مقارنة جديد list،history أو live قيمة. حمل دائم `inbox` إسقاط عبر و أخرى إسقاط نفسه بارد قراءة و إعادة وصل مسار نقل اثنان نسخة انتظار معالجة قائمة.Client Agent سياق توفير مستقل [`fileUpload`](../../client/file-upload/README.ar.md) خدمة استخدام هوية؛Session كائن توفير دورة الحياة،prompt،queue و تاريخ عملية، لا توفير ملف نقل.

Session كائن أيضا تحمل تحميل محلي إيداع عودة إظهار:`session.beginSubmission` في استدعاء جهة تسلسل تحويل و نص التوجيه قبل، تزامن يأخذ واحد بند عودة إظهار كتابة `SessionSnapshot.pendingSubmissions`، جلسة UI لذلك قدرة في نقر إيداع عند لقطة عرض رسالة. عودة إظهار حسب ترتيب تخزين وضع صورة معاينة و حمل دائم ملف مرجع.Session أصل حسب حالي تشغيل حالة و طلب إلقاء تمرير نمط دفع توجيه ذلك `transcript`،`queued` أو `steering` موضع، و في تسلسل تحويل خلال إبقاء هذا موضع. نص التوجيه `requestId` هو صلة ربط معرف:Host يأخذ هو عودة إظهار لـ durable user source `rpcId`،`inbox` إسقاط في انتظار معالجة رسالة أيضا إبقاء نفس source. عودة إظهار في مراقبة إلى ذلك durable event أو queue occurrence بعد تأخير متأخر واحد حركة رسم لقطة تراجع راحة، حمل معرف نص التوجيه فشل أو يتم وضع ترك وقت قيام أي تراجع راحة، إلغاء تدمير وقت حسب failed تراجع راحة. كل مرة تراجع راحة تماما جيد إطلاق مرة `onRetire`؛observed تراجع راحة أيضا سوف يحمل لديه ترتيب حمل دائم مرفق عنصر مرجع، يجعل composer تحرير نجاح بطاقة و إبقاء فشل مسودة مسودة. عودة إظهار فقط وجود في Client داخل تخزين؛ تحديث جديد و إعادة وصل فقط من حمل دائم حدث إعادة بناء جلسة.


موجه إلى مستخدم استدعاء `skills/list` بيانات وصفية يتضمن فوز خروج مزود اختياري إشارة أمر ملف `path`. إدخال إطار يمكن حسب هذا معاينة ملف، بلا حاجة تحميل كل skill متن أو تنشيط بارد حالة Agent.

قسم تقاطع نسخ قطع حتى اختيار في قد انتهاء جولة تاريخ، و يتضمن ذلك `turn/end`. هذا موضع بعد حدث متساو يتم ترتيب حذف، يشمل ترتيب طابور إدخال و نموذج ضبط تغيير. حذف مرساة نقطة أو مرساة نقطة تجاوز خروج سجل نهاية ذيل وقت، اختيار الأكثر بعد واحد قد انتهاء جولة؛ يقع في لم انتهاء جولة داخل مرساة نقطة سوف يتم رفض.

استعادة جلسة وقت إذا قد لديه كتابة جملة مقبض احتلال استخدام، إرجاع `session/writer-held`، و يحمل جلسة id؛ أخرى استعادة فشل ما زال إرجاع `gateway/internal`.

<a id="client-references"></a>
## Client مرجع

`sessions.retain(target, { source, signal? })` قيام أي نيل أخذ واحد دقيق Client generation مرجع، و بدء ذلك مشترك أول مرة تاريخ فتح. هدف هو معروف Session id أو حمل دائم مباشر أب فرعي subagent عنوان؛Host في فتح تاريخ وقت تحقق صريح عنوان. إرجاع مرجع دعم حمل قوة انتظار `release()` و `Symbol.dispose`؛ ذلك `ready` Promise تتبع مع مشترك `Session.open()` نتيجة، و في هذا مرة محاولة تجربة تسوية وقت تحليل لـ تأكيد قطع binding، يشمل Remote failure بـ `openState: 'error'` يمثل حال حال. فقط عند `Session.open()` رفض، انتظار جهة إلغاء أو مرجع رفع قبل تحرير وقت،`ready` عندئذ رفض. إلغاء واحد انتظار جهة لن إلغاء أخرى owner فتح.`sessions.using(target, options, operation)` انتظار هذا مرة تسوية، يحتفظ مرجع مباشر إلى عودة ضبط انتهاء، و نقل بث يتم رفض حينئذ خيط و عودة ضبط فشل.

مرجع حفظ نشط محلي جلسة بيانات، أثر مجال Context و تاريخ تدفق، لا حفظ نشط Host Agent. الأكثر بعد واحد مرجع تحرير وقت،generation أولا خروج يمكن وصول خريطة، مجددا تنفيذ تنظيف؛ لاحق نيل أخذ يمكن لـ نفس id إنشاء جديد generation.`binding(id)` و `scope(id)` فقط استعارة استخدام قد لديه generation.`retainInfo(id)` مستقل في دليل عضو علاقة مراقبة مستقر فقط قراءة مصدر حساب عدد، لا تنفيذ تاريخ I/O. مستهلك مصدر مفتاح يمكن عبر إعلان دمج توسيع؛ تنقل و إتمام تأكيد يخص UI مستهلك، لا يخص هذا تحكم جهاز. كل حق و تنظيف قاعدة رؤية [Client جلسة مرجع](../../../.agents/notes/implemented/architecture/2026-09-15-client-session-references.ar.md).

<a id="session-media-references"></a>
## جلسة وسيط جسم مرجع

عند `connection`،`fs` و `attachments` متساو يتم تركيب وقت،`SessionMediaReferences` في تمييز حق `connection.fetch` عبر طريق فوق تركيب `GET|HEAD /api/file?path=<قطعا مقابل مسار>`. هو عبر `ctx.fs` قراءة عادي ملف، يشمل قد تسجيل مساحة العمل خارج مؤقت مسار و بعيد مسار مزود في ملف. دليل يتضمن علاقة و MIME صنف آخر متساو لا حد وصول؛`mime-types` توفير استجابة نوع، لم معرفة توسيع اسم استخدام `application/octet-stream`.GET إعادة استخدام `readBytes` تنفيذ قراءة قبل و قراءة في بايت حد؛HEAD فقط قراءة بيانات وصفية. كل ملف متساو استخدام `ctx.attachments.imageLimits.maxImageBytes`(عبر معتاد لـ 20 MiB) ؛ تجاوز مرور هذا حد أعلى إرجاع 413. استجابة يتضمن كامل ملف، تجاهل اختصار Range، و يحمل `private, no-store`،`nosniff` و صندوق رملي CSP، جعل مباشر فتح HTML/SVG لا يمكن بـ API مصدر هوية تنفيذ نص برمجي. عميل إعادة كتابة يقع في `ui-chat`(`AssistantMarkdown`) ؛ صوت نظر تردد ملف استجابة قد متاح،Markdown صوت نظر تردد بث وضع جهاز عقدة ما زال هو مستقل عمل.

-----

<a id="configuration"></a>
## إعداد

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---:|---|
| `nativeOpen` | منصة استكشاف قياس | هل قدرة يأخذ Session مساحة العمل مسار تسليم إعطاء أصلي طاولة وجه فتح جهاز |

توليد[إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-api-session-controller) هو كل تلقي دعم حمل حقل و ذلك JSDoc كامل مصدر.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا؛ أي نموذج مرئي فاعلية نتيجة كل من يتم استدعاء Agent أمر مسؤول.

#### KV Cache أثر

بلا مباشر أثر؛ نموذج طلب ما زال من Agent و LLM(كبير لغة نموذج) حزمة يملك.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- صورة بايت حد أعلى لا تحقق حل رمز بعد مقياس قياس أو مثل عنصر عدد.
- Control baseline يمثل عملية محلي حالة، لذلك Host إعادة بدء بعد لا يمكن إعادة بناء jobs.
- follow استعادة فشل سوف مقابل استدعاء جهة مرئي، بينما لن بلا حد إعادة محاولة.
- متصفح أصلي بايت فوق نقل استخدام مرة لا حمل قطع نقطة متابعة نقل انحراف نقل تدفق صيغة HTTP طلب؛ إعادة محاولة سوف من رقم صفر بايت إعادة نقل كامل ملف.
- ملف مرجع تكملة كل استخدام مشترك Agent lookup، لذلك ممكن استعادة بارد Session؛`skills/list` دليل هو لا تنشيط Agent skill بيانات وصفية قراءة مسار.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. كل قسم صفحة و لقطة كل سوف مقابل وفق ذلك إشارة نحو حمل دائم Session تحقق.

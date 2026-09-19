# Agent Note: Inspector تنفيذ بيئة و بروتوكول مستو وجه

Status: implemented
Archived: 2026-09-04

[English](2026-08-26-inspector-execution-realms-and-protocol-planes.md) | العربية

## Problem

Inspector حزمة شفرة تشغيل في ثلاثة عدد JavaScript بيئة في: متصفح Client،Host Node رئيسي خط مسار و Inspector Worker thread. فقط حسب وظيفة تسمية دليل وقت، ملف مسار لا يمكن شرح شفرة في أي داخل تشغيل، أيضا لا يمكن شرح هو يمكن يحتفظ أي بعض معرف رمز.

هذا نوع يحتوي غامض سوف حمل قدوم ريح خطر، لأن Host و Client دعم حمل قدرة متعمد مختلف، لكن هيكل بنية يجب إبقاء يمكن مقارنة مقارنة.Host Runtime و Debugger تفويض حمل Node inspector protocol؛Client Runtime و Console عبر داخلي bridge نموذج محاكاة نفس طقم backend دلالة. إذا اثنان حافة ملف، واجهة و unsupported operation في بنية فوق قسم تقاطع، كل زيادة واحد نوع بروتوكول طريقة كل سعة سهل إنتاج ثاني طقم توجيه نموذج. نفس مثال، فقط حاجة Cordis وقت التشغيل شجرة مستهلك لا ينبغي وراثة debugger activation،Chrome اتصال حالة أو CDP معرف رمز.

قائم[عبر realm CDP Inspector قرار](2026-08-23-cross-realm-cdp-inspector.zh.md) مسؤول Worker،transport،Runtime،debugger و أمان سلوك.[Cordis وقت التشغيل شجرة فحص قرار](2026-08-24-cordis-runtime-tree-inspection.zh.md) مسؤول Cordis شجرة دلالة، كائن توجيه و DOM projection. هذا قرار مسؤول شفرة المصدر موضع، اعتماد جهة نحو، و مجال بيانات،backend دلالة، داخلي transport و Chrome CDP حالة بين قسم فصل.

## Decision

قمة طبقة شفرة المصدر دليل معرف تنفيذ ملكية.`client/` فقط يتضمن متصفح Client شفرة،`host/` فقط يتضمن Host Node رئيسي خط مسار شفرة،`worker/` فقط يتضمن Worker thread شفرة،`shared/` فقط يتضمن في كل بيئة في كل أمان شفرة. أي جعل بعض عدد وحدة بديل جدول Client، فقط يلزم هو فعلي في Worker في تنفيذ، حينئذ ما زال يخص `worker/`، بينما لا هو `client/`.

مستودع اشتراط `src/index.ts` اكتشاف مدخل هو هذه الحزمة وحيد شفرة المصدر أصل دليل مثال خارج. هو كشف Host package entry و ذلك service type، لا يتضمن Inspector وقت التشغيل تنفيذ، و لـ مستودع أداة إبقاء في ثابت مسار. هذه الحزمة لا إصدار invariant companion، لأن ذلك علاقة سوف في الذي تابع wire،generation،Worker أو CDP عملية في فشل، سبب سجل في README في.

```text
src/
  shared/   environment-independent data and interfaces
  client/   browser Client producer and adapters
  host/     Host Node-main-thread producer and adapters
  worker/   Worker transport, repositories, realm backends, and CDP endpoint
```

`client/` و `host/` يملك نفسه متبادل مقابل دليل و ملف اسم. مشترك نفس زاوية لون يشمل plugin entry،bridge lifecycle و RPC،Cordis و network inspection، و موجه إلى CDP Runtime،Console،Debugger،Sources،Profiler و HeapProfiler adapter. دعم حمل مسار درجة يمكن مختلف: غير ممكن استخدام عملية ما زال إبقاء في مقابل مرآة مثل وحدة في، و إرجاع مشترك capability-unavailable أو نوع تحويل unsupported نتيجة. مرآة مثل بنية موحد واحد هو قدرة تنفيذ موضع، بينما لا هو إعلان تسمية اثنان عدد جذب محرك دعم حمل نفسه وظيفة.

Worker جانب realm adapter في `worker/realms/client/` و `worker/realms/host/` تحت التزام حراسة نفسه قاعدة. هذه adapter عبر مشترك موجه إلى CDP backend واجهة مواصفة تحويل Client نموذج محاكاة سلوك و Node inspector سلوك. هو جمع لا يملك Chrome wire message أو اتصال نطاق جزء CDP معرف رمز.

## Execution ownership

`client/` مسؤول page realm observation،Client object handle، متصفح طلب قيمة، متصفح Console interception،Client source publication و إلى Worker مباشر تمييز حق bridge. هو يمكن استخدام متصفح API، لكن لا يستطيع استيراد Node أو Worker تنفيذ وحدة.

`host/` مسؤول Node رئيسي خط مسار فوق Cordis plugin composition،Worker بدء و dispose،Host object observation،fetch capture،Node inspector notification forwarding، و Worker bridge Host واحد جانب. هو يمكن استخدام Node API، لكن لا بنية صنع Chrome CDP response.

`worker/bridge/` مسؤول source admission،transport endpoint،connection generation،frame dispatch،correlation، و source producer و Worker consumer بين توجيه.`worker/inspection/` مسؤول إبقاء Cordis و network observation، و لا اعتماد transport query.`worker/realms/` مسؤول مواصفة تحويل Host و Client runtime backend.`worker/cdp/` مسؤول HTTP discovery،DevTools session،Chrome method dispatch،domain enable حالة و كل اتصال نطاق جزء Chrome معرف رمز.

Worker متابعة بصفة وحيد Chrome CDP wire و حالة owner.Client شفرة نموذج محاكاة مشترك backend operation، بينما لا هو نموذج محاكاة CDP wire.Host شفرة يأخذ دعم حمل backend operation تفويض حمل إعطاء Node inspector، لكن Node protocol معرف رمز في Worker Host realm داخل تحويل بعد عندئذ دخول عام مشترك domain projection.

## Data and identifier ownership

`shared/cordis/` يتضمن و CDP غير متصل دلالة نموذج، غير ممكن تغيير snapshot،collection و observation،realm-local object registration،projection و reader interface.`model.ts` لا يتضمن transport handle أو CDP معرف رمز.`snapshot.ts` يمكن يحمل realm-local opaque object reference، لأن فوري كائن استعلام حاجة هذا توجيه معلومة، لكن مستهلك يمكن في projection في إزالة هو.

`shared/network/` يتضمن fetch و network observation، أخذ تجميع body يمثل و header normalization. هذه سجل وصف قد مراقبة قياس نشط حركة، لا يتضمن CDP request id أو domain enable حالة.

`shared/cdp/` يتضمن realm capability،Runtime،Console،Debugger،Sources،Profiler،HeapProfiler مواصفة تحويل backend واجهة و قيمة، و نوع تحويل unsupported نتيجة. هذه واجهة في backend handle هو لا نفاذ واضح كما من realm يحتفظ. هو جمع لا هو Chrome `RemoteObjectId`،`ExecutionContextId`،`ScriptId` أو `CallFrameId`.

`shared/bridge/` يتضمن حمل إصدار داخلي carrier:source و generation معرف رمز،envelope،codec،validation، لديه حد publication،RPC correlation،dispatch interface و قسم مجال message union. ذلك message وحدة يمكن نقل Cordis snapshot،network observation،Console event،Runtime operation،source read،debugger operation و دلالة query، لكن لن يأخذ هذه قيمة تحويل صار CDP message.

`worker/cdp/ids.ts` هو Chrome اتصال نطاق جزء معرف رمز وحيد owner، يشمل `RemoteObjectId`،`ExecutionContextId`،`ScriptId`،`NodeId` و `CallFrameId`.Worker domain session قسم إعداد و تحرير هذه id، يأخذ هو جمع خريطة إلى realm backend handle أو inspection record.source،generation،sequence،request،Cordis Fiber uid،realm object reference،backend handle و Chrome id يجب إبقاء لـ مختلف نوع، لأن هو جمع owner و دورة الحياة مختلف.

## Dependency rules

مجال وحدة `shared/cordis/`،`shared/network/` و `shared/cdp/` لا استيراد `shared/bridge/` أو أي تنفيذ بيئة مخصص تابع دليل.`shared/bridge/` في تعريف داخلي message وقت يمكن استيراد هذه مجال نوع.`shared/` تحت أي وحدة كل لا استيراد Node-only أو browser-only API.

قمة طبقة `client/` و `host/` يمكن استيراد `shared/`، لكن لا يستطيع متبادل متبادل استيراد، أيضا لا يستطيع استيراد `worker/`. انتظار قيمة زاوية لون استخدام انتظار قيمة مشترك واجهة. بيئة مخصص تابع transport و engine سلوك إبقاء في مقابل مرآة مثل تنفيذ ملف في، لا دخول حمل شرط فرع مشترك تنفيذ.

`worker/realms/` و `worker/inspection/` يمكن استيراد مشترك واجهة، لكن لا استيراد `worker/cdp/`؛ مواصفة تحويل backend result و قد تخزين observation لا يستطيع يتضمن Chrome connection state.`worker/cdp/` يمكن إزالة استهلاك realm و inspection interface قدوم توليد CDP projection.`worker/bridge/` توجيه مشترك message و استدعاء Worker service، لكن لا يصبح Cordis،network،Runtime أو Chrome حالة owner.

هذا قدرة متابعة إبقاء في نفس عدد `@deepseek-ai/dsh-experimental-inspector` حزمة في، و استخدام صريح Client و Host compiler face. دليل قسم فصل هو تنفيذ و اعتماد قاعدة، لا هو تفكيك حزمة خطة.

## Verification

- كل وقت التشغيل تنفيذ كل عبر `shared/`،`client/`،`host/` أو `worker/` يملك واضح تنفيذ owner؛ فقط لديه مستودع اشتراط package و invariant تحويل إرسال مدخل إبقاء في شفرة المصدر أصل دليل.
- قمة طبقة Client/Host شجرة و Worker Client/Host realm شجرة قسم آخر يملك نفسه متبادل مقابل تنفيذ مسار؛ مختلف قدرة دعم حمل استخدام صريح نوع يمثل.
- Cordis و network reader بلا حاجة استيراد debugger،source،transport أو CDP session وحدة يكفي استخدام.
- داخلي message يتضمن source طبقة identity و قد تحقق مجال قيمة، لكن لا يتضمن Chrome اتصال نطاق جزء id.
- مواصفة تحويل realm backend interface معا دعم حمل Host تفويض حمل و Client نموذج محاكاة، كما اثنان نوع تنفيذ كل لا بنية صنع Chrome CDP message.
- فقط لديه Worker CDP وحدة قسم إعداد Chrome id، و يحتفظ DevTools اتصال enable،object،script،node و call-frame حالة.
- Host Runtime و debugging،Client Runtime و Console،Network capture،Cordis Elements projection، قطع ربط إبقاء و دلالة query سلوك متساو لديه تجمع تركيز اختبار تغطية.
- compiler face،import check و بنية اختبار قدرة كاف رفض بيئة تسرب تسرب و Client/Host مرآة مثل عائم نقل.

## Alternatives considered

**كل ملف كل حسب وظيفة مجال مجموعة نسج.** رفض، لأن واحد Runtime أو Cordis وظيفة سوف عبر تجاوز ثلاثة عدد متاح API مختلف بيئة. فقط لديه وظيفة معلومة مسار سوف إخفاء تنفيذ حد، أيضا يجعل browser إلى Node معنى خارج استيراد صعب بـ مراجعة فحص.

**يأخذ Worker Client و Host adapter وضع دخول قمة طبقة `client/` و `host/`.** رفض، لأن هذه adapter فعلي تشغيل في Worker في، يحتفظ مورد أيضا مختلف في page و Node رئيسي خط مسار producer. دليل اسم ينبغي أولا عودة جواب شفرة في أي داخل تشغيل، مجددا عودة جواب هو بديل جدول أي عدد بعيد طرف realm.

**Client و Host دليل فقط إبقاء حالي دعم حمل ملف.** رفض، لأن لا مقابل تسمية دليل سوف إخفاء ناقص قدرة قرار، و سماح انتظار قيمة توجيه زاوية لون شكل صار غير متصل واجهة. صريح unsupported تنفيذ حيث حفظ إثبات نفاد كل عرض دخول، أيضا لا وهمي بنية قد دعم حمل سلوك.

**إبقاء واحد مشترك protocol دليل.** رفض، لأن داخلي carrier identity،Cordis دلالة بيانات، مواصفة تحويل Runtime value و Chrome wire identifier مستهلك و دورة الحياة مختلف. مفرد واحد دليل سوف إغراء توجيه مجال نموذج اعتماد transport و CDP presentation.

**يأخذ Client،Host،protocol و Worker تفكيك صار كثير عدد حزمة.** فعلي تحقق مرحلة مقطع رفض. نشر وحدة ما زال هو واحد Client/Host Cordis plugin؛ حزمة حد سوف زيادة بناء و إصدار تنسيق عمل، لكن لا يستطيع تعديل حسن الذي يحتاج تنفيذ بيئة قسم فصل.

## Consequences

صارم إطار مرآة مثل سوف لـ لا دعم حمل قدرة زيادة صغير نوع adapter ملف. هذه ملف هو اثنان عدد تنفيذ بين متعمد إبقاء توافق نقطة، لكن يجب إبقاء خفيف رقيق، أيضا لا يستطيع صنع صنع وهمي زائف سلوك.

أي جعل فقط نقل حركة نوع بينما لا تغيير سلوك، أيضا ممكن كشف إخفاء اعتماد حلقة، خاصة ذلك هو Runtime object annotation وصول Cordis repository موضع. اعتماد قاعدة اشتراط عبر مشترك واجهة عكس تحويل اعتماد، لا يستطيع مؤقت من مقارنة منخفض طبقة وحدة عكس نحو استيراد.

إذا لا إضافة قيد أرض إضافة مواصفة تحويل نوع،`shared/cdp/` ممكن تغيير صار ثاني نسخة Chrome protocol. فقط لديه اثنان عدد realm تنفيذ أو عام مشترك Worker projector سوف إزالة استهلاك نوع عندئذ يخص هذا داخل؛Chrome session bookkeeping و wire-only field إبقاء في `worker/cdp/`.

صريح Client/Host compiler face و تجمع تركيز سلوك اختبار زيادة صيانة عمل، لكن سوف حمل متابعة كشف بيئة تسرب تسرب و مرآة مثل بنية عائم نقل.

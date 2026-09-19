# Agent Note: Trajectory أساس في تسجيل صيغة Conversation Context تجميع بيانات

Status: implemented
Archived: 2026-09-04

[English](2026-08-11-trajectory-conversation-context-assembly.md) | العربية

## مشكلة

Trajectory سبق صيانة مستقل Session History بيانات مصدر، و يأخذ كامل قد تحميل Event نافذة طي لـ Assistant،Tool، رسالة،Request header و Compaction حالة.Chat قد عبر تسجيل صيغة Conversation Definition تجميع نفسه Event عائلة. اثنان بند سلسلة مسار تكرار تنفيذ عمل خدمة صلة ربط و قسم صفحة سلوك؛ أي جعل فقط تغيير واحد عمل خدمة كائن،Trajectory بنية تحديث ما زال سوف نسخ أو إعادة مسح و أصلي Event عدد كمية صار صحيح مقارنة بيانات.

إعادة استخدام Chat نهائي Node لا يمكن حل قرار مسؤولية مشكلة.Trajectory حاجة طلب دورة الحياة، تشغيل في Assistant حالة، نص التوجيه وراثة،Tool schema، حساب وقت سجل و stage-oriented read model، بينما Chat لا إزالة استهلاك هذه بيانات. مشترك نهائي Node payload سوف يجعل اثنان عدد عرض كل اعتماد مزدوج جهة يحتاج طلب و تجميع.

هذا مرة ترحيل أيضا يجب إبقاء حمل دائم steering(في طريق جذب توجيه) تصنيف.`user/message` ذاته لا شرح هو هو فتح بدء واحد Turn، أيضا هو من `next-step` inbox يتم قيادة أخذ؛ أكثر مبكر صفحة أيضا ممكن في رسالة قد شيء تحويل بعد، عندئذ تكملة متساو ناقص inbox قبل دفع أو Location.

## قرار

Trajectory إبرة مقابل مشترك [`ConversationNodeAssembler`](2026-08-09-client-conversation-node-assembly.ar.md) تسجيل target ذاتي لديه Conversation Definition و `trajectory` View Builder.Session فقط صيانة واحد نسخة وصل متابعة Event نافذة، و عبر `Session.views` إصدار Chat و Trajectory لقطة؛ هو لم يعد تشغيل ثاني طقم Trajectory history source أو عمل خدمة fold.

كل Definition فقط يخص واحد target.Chat و Trajectory يمكن تعرف آخر نفس حمل دائم Event عائلة، لكن قسم آخر صيانة ذاتي ذات State و نهائي Node payload. هو جمع فقط مشترك Assembler دقيق ID مطابقة، لديه ترتيب Match،Location واقع،Reader اعتماد، إصدار ضبط درجة، و replace/prepend/append دورة الحياة.

Trajectory target source في أول مرة حجز قراءة وقت تنشيط View Builder. في هذا مرة حجز قراءة قبل، ذلك Definition سوف صيانة الأكثر جديد State، بينما Assembler قفز مرور `buildViewNode()` و snapshot assembly. إلغاء حجز قراءة بعد target ما زال إبقاء active، لذلك لاحق وصول سوف إعادة استخدام حمل متابعة زيادة كمية صيانة snapshot.

قائم [Trajectory فحص سجل جدول](../feature/2026-07-27-trajectory-inspection-ledger.ar.md) متابعة بصفة عرض نموذج.Trajectory Builder يأخذ قد شيء تحويل target Node تحويل لـ أصل لديه `eventNodes`،Requests،Tool schema، تشغيل في استدعاء و Location map؛layout، جدول إطار وهمي محاكاة تحويل، اختيار،Overview و فحص جهاز سلوك لن يصبح عام Conversation اتفاق.

### عمل خدمة Definition

| عمل خدمة | Context معرف | State تجميع طريقة | Trajectory contribution |
|---|---|---|---|
| `next-step` inbox | splice Event seq | يأخذ splice تطبيق إلى الأكثر قريب قبل ترتيب inbox Context | فقط صيانة حالة، لا إنتاج مرئي Node |
| مستخدم،steering أو حقن رسالة | message Event seq | قراءة قبل ترتيب inbox State، و مقابل حمل دائم رسالة تصنيف | Input أو context Node |
| Assistant و عادي Request | `turn:step` | طي `step/start`،chunk، نهائي رسالة،retry و `step/end` | نهائي Assistant،partial Assistant و Request |
| أصل Tool call | root call ID | يأخذ أصل call/result و تضمين طقم Code Dispatch Event طي لـ واحد شجرة استدعاء شجرة | نهائي أو تشغيل في Tool tree |
| Compaction | compaction ID | طي start،summary،end و replacement checkpoint | Compaction Request |
| Request header | header Event seq | قراءة قبل واحد header، إبقاء توليد فاعلية نص التوجيه و حقيقي تغير | Prompt و Tool-schema مصدر |
| Session و Turn حد | boundary Event seq | إبقاء إغلاق وقت و خطأ واقع | يتم في قطع Compaction أو فشل عادي Request |

كل صلة ربط Event كل يجب مباشر توفير نفسه عمل خدمة ID.Code Dispatch استخدام `rootCallId`،Compaction استخدام compaction ID؛ أي جعل بعض عدد Definition حسب `turn:step` صلة ربط، عادي Tool و retry Event ما زال إبقاء كل منها بروتوكول معرف. نقص قليل لا بد يلزم صلة ربط ID قديم سجل من هذا Definition تجاهل اختصار، لن دمج دخول `undefined` Context، أيضا لن توجيه يؤدي Session انهيار انهيار.

Assistant chunk فقط تحديث مقابل `turn:step` Context. حمل محتوى chunk طلب animation-frame إصدار؛usage و finish chunk تحديث State، لكن لا مفرد وحيد قوي صنع تحديث جديد واحد لقطة. نهائي رسالة،retry أو حد قيام أي إصدار. قد إتمام Assistant State فقط إبقاء تجميع بعد block، حساب وقت،usage و retry واقع، لن يأخذ أصلي chunk ledger نسخ دخول target snapshot.

### عبر قبل ترتيب Context استعادة steering

Trajectory من حمل دائم inbox تاريخ استعادة steering، استخدام و [Chat steering قرار](../feature/2026-08-04-web-context-source-and-steer-marks.ar.md) نفسه معرف قاعدة، لكن لا مشترك Chat نهائي Node.

كل بند علامة لـ `next-step` `agent/inbox/spliced` Event كل سوف بدء واحد بـ Event seq معرف غير ممكن رؤية Context. هو `start()` قراءة الأكثر قريب قبل ترتيب inbox Context، يأخذ splice إلحاق إلى حمل دائم pending ID state، و فقط في claim وقت materialize هذا state، استبدال حالي claimed batch.AgentLoop سوف في قيادة أخذ تحت واحد دفعة رسالة قبل إلحاق حالي claim وصل قبول الكل رسالة؛ يتم رفض claim لا إلحاق `user/message`. لاحق مستخدم مصدر `user/message` قراءة الأكثر قريب قبل ترتيب inbox Context:ID يخص حالي claim وقت توليد Steering Node، ذلك بقية مستخدم مصدر رسالة توليد عادي User Node.

ما زال لديه أكثر مبكر تاريخ وقت،Reader miss سوف سجل window-gap اعتماد.prepend تكملة متساو ناقص قبل دفع بعد،Assembler حسب Event صحيح ترتيب إعادة وضع تلقي أثر inbox chain و message Context. لذلك، تاريخ قسم صفحة جهة نحو لن دائم دائم خطأ تصنيف رسالة.

رسالة Event Location سوف يأخذ steering وضع دخول الذي تابع Step. إذا قد تحميل تاريخ نافذة نقص قليل كاف كاف حد Event، لا يمكن تحليل هذا Location،layout حينئذ بـ لاحق Assistant step بصفة موضع رجوع. نفس عدد Step في، تشغيل في Request علامة ترتيب في قبل وضع steering إدخال بعد، لذلك هذا علامة يمثل من هذا بند إدخال إطلاق نموذج Request، بينما لن ظهور في إدخال قبل وجه.

### نافذة سلسلة مسار و تكرار مختلط درجة

تسجيل `E` لـ قد تحميل أصلي Event عدد،`P` لـ مرة جديد prepend صفحة،`D` لـ Trajectory Definition عدد،`C` لـ قد شيء تحويل Trajectory Context contribution عدد،`Mᵣ` لـ مرة prepend جعل ذلك بطلان Context الذي يحتفظ Match مجموع عدد.`D` هو مقارنة صغير تسجيل تجميع دمج؛ تدفق صيغة chunk سوف تجمع دمج إلى نفس عدد Assistant Context، لذلك عبر معتاد `C` واضح إظهار صغير في `E`.

| سلسلة مسار | Context عمل كمية | Target snapshot عمل كمية | نتيجة |
|---|---|---|---|
| ابتدائي ذيل صفحة أو إعادة وصل replace | بـ `O(E × D)` مطابقة قد تحميل نافذة، و حسب Event صحيح ترتيب بنية صنع State | inactive: بلا؛active: بنية صنع و ترتيب ترتيب `C` عدد contribution | كامل Context replace ما زال و قد تحميل نافذة صار صحيح مقارنة |
| أكثر مبكر صفحة prepend | فقط مطابقة جديد Event، و فقط إعادة وضع Match،Location أو Reader جواب سجل حدوث تغير Context، صار هذا لـ `O(P × D + Mᵣ)` | inactive: بلا؛active: من `C` عدد contribution إعادة بناء stage snapshot | عمل خدمة fold لن من رأس إعادة ركض الكل `E` عدد Event |
| فوري append | بـ `O(D)` مطابقة، بـ `O(1)` بحث إلى keyed Context، و فقط تحديث مقابل State | inactive: بلا؛active: في snapshot تجميع قبل بـ `O(1)` استبدال anchor لم تغيير contribution | عمل خدمة صلة ربط صار هذا و قد تحميل Event تاريخ غير متصل |

أول مرة تنشيط سوف من حالي `C` عدد target Context بناء Node، بينما لن إعادة مطابقة Event، و استدعاء مرة `replace()`. تنشيط بعد،Builder حسب Context key حفظ contribution، و صيانة key-to-position index.anchor نفسه محتوى تحديث سوف أصل موضع استبدال واحد contribution؛ إضافة جديدة contribution أو anchor تغير عندئذ سوف إعادة بناء و ترتيب ترتيب contribution ترتيب. مع بعد،snapshot assembly مرة تاريخ `C` عدد contribution، استخدام Map بحث جذب Request header و Tool schema، و بـ خط صفة تنقل علامة أو بحث جذب معالجة Compaction boundary و Turn error.

نهائي Event و Request ترتيب ترتيب جعل مفرد مرة إصدار حالي فوق حد إبقاء لـ `O(C log C)`. هذا مرة ترحيل إزالة تكرار عكس نحو فحص بحث و قديم أصلي تاريخ refold، لكن لا صوت تسمية طرف إلى طرف إصدار بلوغ إلى `O(1)`.Chat إبقاء قائم keyed snapshot سلوك و تكرار مختلط درجة؛ زيادة Trajectory target لن يجعل Chat مسح Trajectory Context أو Node.

### مستقل جدول الآن طبقة حار نقطة أفضل تحويل

Context ترحيل و تحت قائمة الآن طبقة أفضل تحويل حل قرار هو مختلف صار هذا. هذه أفضل تحويل إبقاء قائم عرض نموذج؛ استلام فائدة قدوم ذاتي استدعاء مرة عدد و تدريجي دخول تكرار مختلط درجة دفع حساب، هذا قرار لا صوت تسمية وجود benchmark فعلي قياس نتيجة.

| حار نقطة | إبقاء سلوك | مسبق مدة نقص قليل عمل |
|---|---|---|
| Markdown ملخص | Layout فقط إبقاء مصدر Markdown؛ كل مستقر Table record حسب محتوى memo عرض ملخص،Detail فقط تحليل حالي اختيار في سجل | مفرد بند record append فقط إعادة تحليل حدوث تغير مرئي سجل، بينما غير الكل Markdown record |
| بحث نص | `TrajectorySearchIndex` ما زال خط صفة نواة مقابل مستقر Record ID و مصدر توقيع، لكن فقط لـ تغير record معيار تحويل Markdown، و بـ ثلاثة ثانية دفعة مرة إيداع تحديث | توقيع مقارنة مقارنة ما زال لـ `O(C)`؛ مرتفع ثمين معيار تحويل فقط مع تغير record عدد كمية زيادة طويل، حمل متابعة frame update كل وقت نافذة دمج صار واحد دفعة مرة |
| Timeline tooltip | تأخير متأخر Tooltip فتح بعد عندئذ حساب حساب حساب وقت نص سجل | لا يوجد فتح Tooltip render لا تنفيذ تدريجي span label صيغة تحويل |
| بعد استمرار Assistant فحص بحث | مرة عكس نحو مرة تاريخ لـ كل إدخال موضع سجل لاحق Assistant | أصل أولا تكرار نحو قبل فحص بحث الأكثر تالف تكرار مختلط درجة من `O(C²)` خفض لـ `O(C)` |
| Group duration | بـ ثابت عشرة دخول صنع قسم مجموعة بديل ثابت إنجليزي نص عدد حرف شكل تحت `toLocaleString('en-US')` | تكرار مختلط درجة ما زال و Group عدد خط صفة متبادل صلة، لكن تكرار render مسار لم يعد استدعاء Intl formatter |

عرض memo و بحث بحث جذب ذاك هذا مستقل. بحث تغطية حالي React مرئي تاريخ نافذة في شاشة ستار خارج record، و سماح فوري تغير تأخير متأخر واحد throttle دورة مدة؛Table يجب قيام أي تحديث حدوث تغير مرئي record، لا يستطيع وراثة بحث جذب إيداع عقدة عزف.

## اعتبار مرور بديل خطة

**إبقاء مستقل Session History fold، فقط فعل نطاق جزء أفضل تحويل.** غير مقبول: ذاكرة مؤقتة يمكن خفض منخفض جزء حار نقطة، لكن Trajectory ما زال سوف في Chat خارج يملك ثاني طقم Event نافذة، قسم صفحة إصلاح،request inspection fold و عمل خدمة صلة ربط تنفيذ.

**إعادة استخدام Chat Definition، و في `buildViewNode()` في حسب `target` فرع.** غير مقبول:Trajectory حاجة مختلف State و في بين record، لا فقط هو آخر طقم React renderer. مفرد واحد Definition سوف يحمل اثنان عدد عرض payload و شرط، و في مهمة واحد عرض تغير وقت يجعل غير متصل target بيانات بطلان.

**إنشاء Trajectory مخصص تابع Assembler.** غير مقبول: دقيق ID توجيه، أولا update بعد start استلام تجميع،prepend replay،Location إصلاح،Reader اعتماد و إصدار عقدة عزف كل لا هو Trajectory خاص لديه سلوك. ثاني طقم جذب محرك سوف إعادة صنع صنع هذا مرة تعديل صنع يلزم إزالة حذف دورة الحياة تكرار.

**زيادة عام Surface،rewind،fanout أو settled دورة الحياة.** غير مقبول: حالي حمل دائم Event stream لا حاجة عام Surface branch؛Session أو Turn boundary هو target عمل خدمة إدخال، لا بنية صار يأخذ واحد Event fanout إلى الكل تاريخ Context إدارة من. إتمام شرط ما زال من عمل خدمة State ربط دمج Location closure حكم قطع.

**استخدام عام Conversation Node استبدال Trajectory stage.** غير مقبول:stage لـ مفرد واحد عرض مجموعة نسج Request، حساب وقت،schema و جدول إطار layout. يأخذ هو تغيير صار جذب محرك اتفاق سوف حد لم قدوم بسيط عنصر Session-log عرض، و يأخذ عرض مخصص تابع تركيب إعادة وضع عودة Client Runtime.

**في عرض و بحث بين مشترك واحد طقم Markdown cache.** غير مقبول: عرض اشتراط قيام أي تحديث كما تلقي viewport قيد، بحث فإن تغطية الكل React مرئي record، و متعمد دفعة كمية إيداع تحديث. مشترك cache سوف يأخذ اثنان عدد غير متصل مستهلك صحيح تأكيد صفة و ضبط درجة عقدة عزف اقتران دمج بدء قدوم.

## تحقق

Runtime اختبار ثابت target تسجيل، أول مرة حجز قراءة activation، دقيق ID append، أولا update بعد start replay،prepend identity،Reader window-gap إصلاح،Location replay، و Chat و Trajectory snapshot عزل.

Trajectory Definition و Builder اختبار ثابت Assistant streaming و interruption، تضمين طقم Tool call و و سطر interruption،Compaction و prompt وراثة،Steering تصنيف و Step موضع،Request علامة ترتيب، مستقر contribution استبدال و prepend توسيع.Table،layout،Timeline و بحث اختبار ثابت تأخير متأخر Markdown عمل، عقدة تدفق بحث جذب تحديث،Tooltip عرض وقت صيغة تحويل، و append/prepend خلال مستقر بحث نتيجة.

## عاقبة

Trajectory عمل خدمة تجميع صار هذا مع تغير صفحة أو keyed Context زيادة طويل، لم يعد من كامل أصلي Event نافذة إعادة بدء.target ذاتي لديه Definition يمكن مستقل في Chat عرض دخول، معا متابعة مشترك واحد نسخة Session نافذة و واحد طقم دورة الحياة قاعدة.steering سوف في فعلي الذي تابع Step موضع يصبح واحد انتظار Trajectory record، لا حاجة نحو Session زيادة steering مخصص تابع حالة.

أول مرة تنشيط بعد، إبقاء stage-oriented Builder ما زال سوف تنفيذ و قد شيء تحويل Trajectory contribution عدد كمية صار صحيح مقارنة عمل، و ممكن في إصدار وقت ترتيب ترتيب. تنشيط قبل،target إبقاء Context State و واحد target بحث جذب، لكن لا إبقاء Builder، قد شيء تحويل Node أو snapshot. كل مرة تركيب Trajectory عرض وقت،React layout،timeline و بحث بيانات كل مرساة تحديد في حالي ذيل جزء 50 عدد target Node؛ فوري append سوف توسيع هذا نافذة، قائم أكثر مبكر تاريخ عملية فإن أولا توسيع ذلك بادئة، مجددا طلب تحت واحد Session صفحة. إذا replacement window لم يعد يتضمن أولا قبل ذيل مرساة، نفس مرة render سوف بـ استبدال نافذة الأكثر جديد Node لـ حد، و يأخذ هذا عقدة قبول لـ لاحق append جديد مرساة. طلب تحرير رقم و تراكم حساب استخدام كمية ما زال من كامل إقامة إبقاء snapshot إرسال توليد. إدخال layout تغير وقت، بحث بحث جذب ما زال سوف تنفيذ مرة خفيف كمية خط صفة توقيع فحص.

Definition عمل من يجب توفير مستقر بروتوكول معرف. نقص قليل لا بد يلزم ID قديم Event ممكن لن ظهور في تلقي أثر Trajectory عمل خدمة عرض في؛ و دمج غير متصل سجل أو يجعل تاريخ تحميل فشل متبادل مقارنة، هذا هو أكثر أمان تراجع تحويل طريقة. اشتراط كامل عرض إنتاج جهة يجب سجل هذا معرف.

[Conversation assembly قرار](2026-08-09-client-conversation-node-assembly.ar.md) متابعة بصفة عام Context،Reader،Location و إصدار اتفاق حق مصدر.[Trajectory ledger قرار](../feature/2026-07-27-trajectory-inspection-ledger.ar.md) متابعة مسؤول جدول إطار طبقة درجة، وهمي محاكاة تحويل، فحص جهاز و تفاعل سلوك. هذا Note مسؤول شرح Trajectory مثل أي ملائم إعداد هذا اثنان بند قرار، و لـ أي هذا ملائم إعداد لا و Chat مشترك نهائي Node.

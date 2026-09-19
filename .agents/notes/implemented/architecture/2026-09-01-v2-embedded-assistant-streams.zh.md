# Agent Note: في v2 attempt settlement في تضمين دخول Assistant stream

Status: implemented

[English](2026-09-01-v2-embedded-assistant-streams.md) | العربية

## مشكلة

Token حبة درجة `assistant/chunk` حدث سوف إبقاء دقيق stream ترتيب، وقت،usage،terminal state،replay metadata و فشل وقت جزء إخراج، لكن يجعل كل chunk يصبح قمة طبقة Session event سوف في حفظ دائم، بعيد قياس، تاريخ نقل، بحث جذب و Client تجميع في تكرار معلومة غلاف. شيء إدارة packed row يمكن نقص قليل JSONL بايت، لكن لن نقص قليل منطق حدث عدد، أيضا لن نقص قليل استقبال مواصفة stream مستهلك عمل كمية.

فقط تخزين تجميع بعد نجاح message يمكن إزالة حذف هذه فتح إلغاء، لكن سوف فقد فقد فشل و وضع ترك إخراج،token حد، ختم الوقت و تحديد صفة provider replay. حمل دائم سجل حاجة يجعل كل نموذج attempt فقط احتلال واحد مفرد موضع، معا لا نقص قليل replay، تشخيص، إلغاء استعادة،usage تسجيل حساب،snapshot و UI تاريخ اعتماد دليل.

تغيير حدث أساس عدد أيضا سوف تغيير Session ترتيب رقم. قد إصدار ترحيل يجب إبقاء غير متصل حدث متبادل مقابل ترتيب، تعديل كتابة كل قد إعلان نفس Session مرجع، إبقاء دقيق fork قطع نقطة، و رفض أي لا يمكن إبقاء دلالة علاقة.

## قرار

[V3 مواصفة معلومة غلاف قرار](2026-09-06-v3-canonical-session-envelopes.zh.md) مسؤول حالي استبدال مفتاح و طلب رأس وصل قبول قاعدة. هو إبقاء هذا نص تضمين دخول صيغة stream، محاولة تجربة تسوية و تجميد ربط v1-to-v2 تحويل.

Session format v2 لا يوجد قمة طبقة `assistant/chunk` حدث. كل نموذج attempt إيداع واحد يتضمن `stream: AssistantStreamRecord[]` حمل دائم settlement:

- `assistant/message` هو نجاح استجابة أو أداة لديه مرئي تجميع محتوى قد إلغاء استجابة الذي مقابل surface settlement. هو في تجميع message جانب تضمين دخول دقيق ضيق تجميع حمل وقت stream، اختياري usage و اختياري `interrupted: true` marker.
- `assistant/attempt` فقط دخول سجل. هو إبقاء قد وصول settlement، لكن لا يوجد surface message فشل، إعادة محاولة، إلغاء أو stream error attempt، لذلك تشخيص و تسجيل حساب لن وهمي بنية نموذج مرئي تاريخ.

`AssistantStreamAccumulator` مقابل كل chunk فقط لقطة مرة. نفس block وصل متابعة text،reasoning أو tool argument delta سوف تغيير صار واحد ضيق تجميع run، يتضمن أول عدد ختم الوقت، دقيق ختم الوقت بين فصل و كل أصلي delta مقابل واحد عدد مجموعة عضو. أخرى chunk إبقاء لـ حمل ختم الوقت raw record.`expandAssistantStream()` سوف صارم إطار تحقق و إعادة بناء دقيق حمل وقت تسلسل؛ ضغط أبدا سوف دمج delta حد.

Migration publication verifier و تجميد ربط v2 fixture validator اشتراط تضمين دخول صيغة stream قدرة تكرار الآن غير فارغ `assistant/message` content،usage و replay state. مقابل في لا يوجد مصدر chunk قد ترحيل قديم message، فارغ stream ما زال صالح. عادي Session restore فقط تحقق runtime مباشر اعتماد settlement حقل، لا توسيع الكل تاريخ stream؛ حاجة توسيع compact stream consumer سوف في قراءة وقت تحقق record.`assistant/message` لا يستطيع يحمل قد توقف استخدام chunk `sourceEventSeqs`؛ عادي user و tool source-event reference إبقاء متاح.

### فوري عرض و حمل دائم إعادة تشغيل

`agent/assistant-stream` إصدار عملية محلي start، لحظة حالة chunk و end frame.loop سوف في committed end frame تسمية ذلك نوع و ترتيب رقم قبل إلحاق كامل `assistant/message` أو `assistant/attempt`.abandoned end لا يوجد settlement.

Web follow adapter صريح اختيار استقبال هذه عملية محلي frame، و لـ كل start تكملة ملء عند وقت مراقبة إلى الأكثر بعد واحد حمل دائم ترتيب رقم. هو يأخذ chunk عرض لـ حمل دائم cursor بين Client-only `assistant/live-chunk` update، فقط مؤقت تخزين start بعد مطابقة settlement، و في revision نقص فتحة وقت إعادة فتح follow.committed end سوف إصدار أداة اسم settlement delta، حذف هذا attempt transient match، إضافة دخول حمل دائم entry، و فقط إعادة وضع تلقي أثر Conversation Context؛abandoned end سوف إصدار لا يحتوي entry نفس صنف delta. إعادة وصل baseline يحمل نشط وثب attempt حمل دائم بدء بداية cursor و ضيق تجميع بادئة.

Client event source أصل مثال نقل تمرير حمل دائم settlement.Chat و Trajectory في attempt نشط وثب وقت طي `assistant/live-chunk`، مباشر من `assistant/message` بنية صنع settled output. تسوية إزالة مؤقت chunk بعد،Chat لن إعادة بناء أول token حساب وقت.Trajectory من `assistant/message` و `assistant/attempt` في[ضيق تجميع تدفق سجل](2026-09-06-embedded-stream-record-readers.zh.md) قراءة حساب وقت، يشمل فتح تاريخ وقت. اثنان عدد هدف كل لن لـ عرض سوف قد تسوية تدفق توسيع لـ تدريجي delta كائن؛ أخرى مستهلك حاجة دقيق دليل وقت ما زال يمكن توسيع حمل دائم stream.

### قد إصدار v1 إلى v2 ترحيل

متبادل مجاور ترحيل سوف تحقق كامل تجميد ربط v1 ناتج، حسب turn،step،terminal boundary و دقيق message chunk reference مقابل chunk قسم مجموعة، مجددا لـ كل attempt استبدال واحد settlement. نجاح قسم مجموعة chunk نقل دخول ذلك message. لم يتم إقرار قيادة قسم مجموعة سوف في الأكثر بعد واحد يتم إزالة استهلاك chunk موضع تغيير صار `assistant/attempt`. غير متصل تسليم خطأ حدث إبقاء متبادل مقابل ترتيب، تخزين نشط حدث نيل نيل سري تجميع v2 ترتيب رقم. هذا ترحيل حافة عبر `dsh-llm` وقت التشغيل `AssistantStreamAccumulator` ضغط تضمين دخول stream، بينما لا يحتفظ تجميد ربط فرعي هذا، لأن هذا حزمة يملك v2 stream تحرير رمز. عزل publication verifier عبر `expandAssistantStream()` و `BlockAssembler` توسيع و إعادة مجموعة كتابة بعد stream، و في إصدار قبل فحص كل ترحيل بعد `assistant/message` هل و ذلك متسق. يوم بعد إذا بعض عدد صيغة تغيير stream تحرير رمز، يجب يأخذ هذه helper تجميد ربط فرعي هذا قبول دخول هذا ترحيل حافة.

هذا ترحيل حافة سوف إعادة خريطة لديه حد قد إعلان مرجع بيان: معلومة غلاف source-event reference،surface replacement طرف نقطة،command source event،compaction range و shadowed list، و title message list. مرور مرور تحقق `session/title-llm-request` نموذج مرئي نص سوف في مصدر ترتيب رقم نطاق الأسماء في إبقاء تدريجي بايت ثابت، بينما هو `messageSeqs` حقل سوف ترحيل إلى v2 نطاق الأسماء؛ لذلك هدف تحقق لن أصل حسب إعادة خريطة بعد ترتيب رقم إعادة بناء هذا نص. إشارة نحو يتم إزالة استهلاك chunk مرجع سوف جعل ترحيل فشل؛ هو أبدا سوف يتم إعادة تحديد نحو إلى يحتوي معنى مختلف settlement. هذا ترحيل حافة أيضا سوف رفض قطع فتح attempt وراثة قطع نقطة.

v2 شيء إدارة header اشتراط `isSeeded`، كما لا تخزين عدد قيمة قطع نقطة. حمل seed ناتج استخدام `session/end-seed { inherited: true }` علامة ذلك دقيق قطع نقطة؛ حل رمز من الأكثر بعد واحد tagged marker دفع توجيه قطع نقطة.v2 تحرير حل رمز جهاز لـ كل حمل دائم حدث كتابة واحد بند شيء إدارة سطر، فقط مقابل `sourceEventSeqs` فعل نطاق تحرير رمز، و في لا تجميد ربط عادي حدث مفردات أو payload إضافة جديدة بند قبل رفع تحت تحقق شيء إدارة envelope.v1-to-v2 target validator سوف آخر سطر تجميد ربط released-v2 بيان،current restoration فإن استخدام installed Session مفردات. تجميد ربط v0 و v1 تحرير حل رمز جهاز متابعة لـ غير ممكن تغيير تاريخ generation حل رمز packed row.

جديد بناء subagent فرعي بند constructor seed و وراثة أب بند بادئة تماما نفسه.`Session` سوف إلحاق tagged cut marker، مع بعد subagent setup مجددا إلحاق فرعي بند يحتفظ descriptor و delegated policy. أصل descriptor-seed helper سوف يتم حذف، لذلك descriptor أبدا سوف حساب دخول وراثة محتوى،cold resume فإن إعادة وضع قد حفظ دائم فرعي بند setup. سبق يأخذ untagged marker وضع في descriptor بعد وجه تاريخ snapshot fixture سوف في مصدر موضع إصلاح صحيح؛ حالي مقارنة مقارنة ما زال سوف كشف marker عدد كمية و ترتيب رقم مرجع.

`dsh_session_log` request extension خارج طبقة schema إبقاء إصدار 1: هو Session header إسقاط ما زال من منطق inherited cut دفع توجيه `seedLength`، فقط لديه منها `sessionFormatVersion` عضو معرف تضمين دخول منطق Session generation.projection unit نفس مثال إبقاء كل منها `stateVersion`؛projection cache يأخذ كل checkpoint ربط إلى Session format generation، لذلك generation تغير لا حاجة رفع رفع unit إصدار.

Generation اختيار و إصدار التزام دوران[قد إصدار Session ترحيل قرار](2026-08-31-released-session-format-migrations.zh.md): مصدر مسار، بايت و inode إبقاء ثابت، فقط إصدار نهائي أداة اسم إصدار successor؛ إبقاء predecessor لا توفير fallback أو downgrade دعم حمل.

## تحقق

ضيق تجميع stream اختبار ثابت text،reasoning،tool argument،raw chunk، ختم الوقت بين فصل، صيغة خطأ record و قسم مغادرة snapshot دقيق تراكم تراكم و توسيع.v1 إلى v2 اختبار تغطية نجاح و فشل attempt، تسليم خطأ، سري تجميع ترتيب رقم و مرجع إعادة خريطة، مصدر ترتيب رقم title framing،seed قطع نقطة إدراج دخول و قطع قسم رفض، صارم إطار مصدر و هدف تحقق، كل سطر واحد حدث v2 تحرير رمز، و backend توافق source-event range، أصلي و Zstandard إصدار، و بلا كتابة حالي قراءة.

دمج قبل performance acceptance في ثلاثة جولة،100 مجموعة warmup pair و 600 مجموعة measured pair تحت، إبرة مقابل نفس دفعة قد تحليل شيء إدارة row، يأخذ ساكن حالة catalog routing و مباشر released-v2 restoration مقارنة مقارنة؛ هو لا مقارنة مقارنة v1 و v2، أيضا لا حساب دخول backend I/O. كل pooled median و p95 regression كل إبقاء في 5% ميزانية بـ داخل، الأكثر فرق p95 regression لـ 3.150%.

Agent-loop اختبار ثابت أولا حمل دائم بعد end ترتيب، في قطع مرئي بادئة، فشل و إعادة محاولة attempt،abandonment،usage و replay metadata.Session Controller و Conversation اختبار ثابت فوري لحظة حالة عرض، إعادة وصل baseline،committed settlement إصدار و تاريخ إعادة تشغيل.Chat و Trajectory اختبار ثابت فوري partial عرض و نهائي message مباشر إسقاط؛TypeScript و Python SDK snapshot ثابت خارجي حدث يمثل.

## تجهيز اختيار خطة

**فقط حفظ دائم تجميع بعد نجاح message.** هذا سوف فقد فقد جزء فشل إخراج، وقت،token حد، لا يوجد message attempt usage، و دقيق تحديد صفة replay.`assistant/attempt` و تضمين دخول صيغة ضيق تجميع stream سوف إبقاء هذه واقع، كما لا يأخذ هو جمع إضافة دخول نموذج تاريخ.

**إبقاء قمة طبقة chunk، فقط تحزيم شيء إدارة سطر.** هذا سوف إبقاء v1 منطق يمثل، لكن يجعل ترتيب رقم سري درجة، بعيد قياس كمية،wire معلومة غلاف،Client entry و مستهلك dispatch متابعة و token عدد صار صحيح مقارنة. تاريخ تحرير حل رمز جهاز ما زال حل رمز هذا يمثل؛ هو لا هو حالي حدث نموذج.

**عبر تاريخ API نقل تمرير packed chunk row.** هذا سوف نقص قليل v1 wire و Client عمل، لكن يجعل Client يملك ثاني طقم حدث مفردات، و يجعل نقل متابعة و token-row أساس عدد اقتران دمج. حالي API يحمل علامة كمية حمل دائم settlement، و استخدام مستقل فوري لحظة حالة stream.

**في Session Controller في حذف تضمين دخول صيغة stream.** هذا سوف نقص قليل Client إبقاء داخل تخزين، لكن سوف جذب دخول ثاني نوع حمل دائم حدث نوع، و يجعل موجه إلى نقل owner قرار عرض مستهلك حاجة أي بعض دليل. فعلي قياس زجاجة عنق قدوم ذاتي تكرار توسيع، لذلك من كل UI مستهلك قرار هل فحص أصل مثال نقل تمرير settlement.

**يأخذ stream وجود sidecar أو replay-only fixture في.** هذا سوف يأخذ واحد attempt message و دليل تفكيك إعطاء مختلف حمل دائم صفة owner، أيضا لا يمكن يجعل عادي استعادة Session نيل نيل نفسه فشل إخراج و وقت واقع.settlement هو أصل فرعي owner.

**يأخذ يتم إزالة استهلاك chunk مرجع إعادة تحديد نحو إلى ذلك settlement.** Chunk و attempt settlement لا هو يمكن متبادل تبديل واقع. رفض يمكن منع توقف ترحيل صامت لكن تغيير إضافة ذاتي لديه مرجع يحتوي معنى.

## عاقبة

حالي سجل، بعيد قياس و تاريخ صفحة حسب نموذج attempt بينما غير token chunk توسيع، معا في كل settlement داخل إبقاء دقيق stream دليل.Client event window إبقاء هذا نسخة ضيق تجميع دليل، لكن Chat و Trajectory Assistant node لن يأخذ settled stream توسيع صار تدريجي delta كائن. فوري عرض إبقاء زيادة كمية، و كما متعمد فقط وجود في عملية داخل.

v1 قمة طبقة chunk ممكن في attempt انتهاء قبل من حمل مؤقت اندفاع حفظ دائم writer تحديث قرص؛ و لـ مختلف،v2 في settlement قبل لا يوجد حمل دائم attempt دليل. إذا عملية أو رئيسي آلة في settlement قبل صلب في قطع، كامل in-flight stream كل سوف فقد فقد؛`agent/assistant-stream` لا هو write-ahead log. هذا بند أخذ ترك تجنب تجنب لـ فوري إخراج زيادة ثاني عدد حمل دائم صفة owner.

واحد settlement ممكن جدا كبير،v1 إلى v2 ترحيل سوف شيء تحويل كامل ناتج و ذلك ترتيب رقم خريطة. غلاف إغلاق Alpha بيان سوف رفض لم معرفة v1 حدث و لم إعلان مرجع، بينما لن تخمين قياس. حاجة مفرد وحيد chunk مستهلك استدعاء `expandAssistantStream()`، و كما أبدا قدرة من `agent/assistant-stream` دفع قطع حمل دائم صفة.

ترحيل سوف تغيير يتم إزالة استهلاك v1 chunk بعد ترتيب رقم، لذلك كل نفس Session مرجع كل يجب يخص صريح تعديل كتابة قاعدة. هذا قيد متعمد يجعل لم قدوم أساس عدد تغير ترحيل إبقاء مرتفع ثمين، و منع توقف صيغة سلسلة تنفيذ بلا صوت دلالة إعادة تحديد نحو.

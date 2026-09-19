# Agent Note: في جلسة تاريخ في نقل تحزيم قسم قطعة سطر

Status: implemented
Archived: 2026-09-01

[English](2026-08-15-packed-session-history-transport.md) | العربية

## مشكلة

`session.page` و `session.follow` opening snapshot سوف نحو بعيد مسار Client توفير واحد مقطع محدود منطق Session event منطقة بين. مزود تدفق ممكن في واحد لم إتمام ذيل جزء في إنتاج عدد عشرة ألف عدد token كبير صغير `assistant/chunk` حدث. أولا توسيع كل بند حفظ دائم سطر، مجددا تسلسل تحويل كل منطق حدث، سوف في بروتوكول في تكرار نفسه envelope. في Client حد توسيع packed response أيضا سوف إعادة إنشاء نفس مثال عدد كمية event object،journal entry،Location index،Definition match و State update، سحب بطيء conversation replay.

نقل يجب إبقاء بلا ضرر.Session seq هو قسم صفحة و إعادة وصل دليل؛ دقيق fragment حد و ختم الوقت مقابل تشخيص و غير UI API مستهلك ما زال لديه استخدام؛ فوري تدفق صيغة نقل، حمل دائم توجيه خروج، إعادة تشغيل و نموذج تاريخ إرسال توليد ما زال حاجة مواصفة حدث تدفق. عند Definition يمكن مباشر fold بلا ضرر run وقت، متصفح جدول الآن و لا حاجة لـ كل تاريخ fragment قسم إعداد واحد event object و تنفيذ مرة Definition callback.

## قرار

تاريخ صفحة و follow opening snapshot يحمل `records: SessionHistoryRecord[]`. عادي record لـ `{ type: 'event', event: SessionWireEvent }`؛ وصل متابعة كما يخص نفس block Assistant delta event استخدام[تحزيم JSONL قرار](2026-07-26-packed-chunk-rows-by-default.ar.md) في مشترك بلا ضرر codec، يمثل لـ `{ type: 'chunks', event: ChunkRowEvent }`.Host في تحزيم قد اختيار صفحة وقت فقط بنية صنع مرة event-shaped value. ذلك `type` لـ `chunkrow/text-chunks`،`chunkrow/reasoning-chunks` أو `chunkrow/tool-call-chunks`؛`seq` و `time` يمثل أول عضو،`data` إبقاء أصل fragment و timestamp-gap عدد مجموعة. صريح خارج طبقة discriminator بلا حاجة حل تفسير تفصيل دقيق chunk kind يكفي اختيار record صنف آخر. نظام أولا من منطق event في اختيار صفحة، مجددا تنفيذ تحزيم، لذلك حسب رسالة مقابل متساو قسم صفحة لا اعتماد شيء إدارة حفظ دائم تخطيط.

توليد Remote decoder سوف تحقق استجابة حقل.`SessionEventStream` يأخذ أصلي wire record تسليم إعطاء `RemoteJournalStream`، و توفير كل بند record منطق seq إغلاق منطقة بين:event تغطية `[event.seq, event.seq]`،row تغطية `[event.seq, event.seq + memberCount - 1]`.Journal في إصدار record قبل فحص صفحة وصل متابعة صفة، قسم صفحة تجميع وصل، إعادة وصل إصلاح، كامل تكرار، جزء إعادة تراكم و فوري event ذهاب إعادة. صفحة طلب في durable address حيث اختياري اختيار عادي Session، أيضا اختياري اختيار قد تخويل direct subagent child، بلا حاجة ثاني طقم تاريخ بروتوكول.

Client لا قسم إعداد استبدال entry، مباشر يأخذ قد قبول `SessionHistoryRecord[]` استلام ضيق لـ `SessionEventLikeEntry[]`. خارج طبقة `type` سوف واحد مباشر إبقاء إلى journal،Session و assembler؛ اثنان عدد فرع كل يحمل حقل مقابل متساو داخلي قيمة، منها يتضمن `type`،`seq`،`time` و `data`.`ChunkRowEvent` هو Client تاريخ بيانات، لا هو حمل دائم Session event: هو لن دخول `SessionEventMap`،`Session.events` أو `session/event`.

Conversation قبول Session إبقاء نفس مجموعة `{ type, event }` entry.Definition استقبال داخلي `SessionEventLike`:`match()` و `update()` قبول معيار أو packed value،`start()` فقط قبول معيار `SessionEvent`؛assembler استخدام خارج طبقة discriminator رفض packed start.Chat Assistant،Turn Tail و Trajectory Assistant في قائم reducer في معالجة ثلاثة نوع packed tag. واحد بند row لذلك بداية نهاية فقط مقابل واحد Client entry،Conversation input و Match، بينما هذه reducer سوف إبقاء scalar replay نهائي block،tool-call حقل، أول token وقت، أول عدد مرئي حد،retry سلوك و interruption حالة.

فوري `session.follow` frame ما زال هو مفرد عدد event و مشي scalar مسار، لذلك مرئي streaming cadence ثابت.Session persistence، أصلي توجيه خروج، إعادة تشغيل، نموذج تاريخ إرسال توليد و مواصفة داخل تخزين سجل متساو لا تغيير.

## قياس كمية نتيجة

قياس كمية استخدام واحد نسخة إنتاج قاعدة نموذج خاص جلسة مثال هذا، لم إبقاء أو توقيع دخول ذلك محتوى. ذلك ذيل صفحة يتضمن 416,756 عدد منطق حدث. بلا ضرر تحزيم استجابة استخدام 696 بند قمة طبقة سجل، منها يتضمن 116 بند تحزيم سطر.

| يمثل | قمة طبقة سجل عدد | JSON بايت | gzip بايت | Brotli بايت |
| --- | ---: | ---: | ---: | ---: |
| أصلي منطق حدث | 416,756 | 69,433,638 | 4,190,226 | 1,972,998 |
| قد إتمام خطوة إسقاط مرشح | 228,129 | 38,427,209 | 2,324,688 | 957,350 |
| بلا ضرر تحزيم تاريخ | 696 | 6,362,724 | 1,154,206 | 528,145 |

و أصلي منطق حدث متبادل مقارنة، تحزيم جعل لم ضغط JSON نقص قليل 90.8%؛ و لديه ضرر قد إتمام خطوة إسقاط مرشح متبادل مقارنة نقص قليل 83.4%.Brotli إخراج متبادل مقابل أصلي شكل صيغة نقص قليل 73.2%، متبادل مقابل هذا إسقاط مرشح نقص قليل 44.8%. هذه عدد حرف وصف هذا مثال هذا، و غير بروتوكول حفظ إثبات؛ استلام فائدة مع delta run طويل درجة و قاعدة قاعدة صفة تغير.

واحد مقابل واحد Client إبقاء جعل نفس قاعدة نموذج مثال هذا إبقاء لـ 696 عدد history entry و Conversation input، بينما لن استعادة صار 416,756 عدد event entry. مرة محلي دمج صار benchmark مراقبة قياس إلى:Client parse،validation،retention و مزدوج Definition fold في scalar input تحت استهلاك وقت 4,682.11 ms، في packed input تحت استهلاك وقت 276.10 ms؛ أخذ مثال مقدار خارج V8 heap ذروة قيمة قسم آخر لـ 612,523,344 و 199,436,928 بايت. هذه اعتماد آلة جهاز عدد قيمة هو مراقبة قياس نتيجة، لا هو باب عتبة.

اختياري تشغيل `packages/client/ui-conversation/tests/history-transport.perf.client.ts` benchmark استخدام دمج صار محتوى بنية صنع نفسه منطق event عدد، عادي event عدد و delta run عدد.`DSH_SNAPSHOT=replay pnpm exec vitest run --config vitest.web.perf.config.ts packages/client/ui-conversation/tests/history-transport.perf.client.ts` سوف في `HISTORY_TRANSPORT_PERF_RESULT` تحت تقرير إبلاغ wire جسم تراكم،Host/Client حساب وقت، لم ضغط كما اعتماد chunked response Node loopback نقل في موضع عدد، تركيب بعد دمج صار API انتظار/UI حينئذ خيط وقت، و أخذ مثال مقدار خارج V8 heap ذروة قيمة؛ ثاني مجموعة بيان سوف في `HISTORY_WHITESPACE_PREFIX_PERF_RESULT` تحت تقرير إبلاغ 10,000،20,000 و 40,000 عدد عضو whitespace-prefix run batch fold في موضع عدد. تركيب حساب وقت من داخل تخزين event عدد مجموعة بدء، لا يتضمن بارد حفظ دائم قراءة، إنتاج API bridge و RPC envelope، أيضا لا يتضمن Chromium ضبط درجة، لذلك هو هو مقابل مقارنة بيان، بينما غير إنتاج بيئة wall-clock تأخير متأخر.Heap قياس كمية سوف في ثلاثة مرة تشغيل قبل قوي صنع تنفيذ نفاية قمامة عودة استلام، و متبادل مقابل في نفسه قد ابتدائي تحويل benchmark حالة، تقرير إبلاغ Host بنية صنع/تسلسل تحويل أو Client تحليل/تحقق/إبقاء/fold كل رئيسي يلزم مرحلة مقطع بعد الذي مراقبة ذروة قيمة في موضع عدد؛ هذا إشارة علامة لا قياس كمية عملية RSS،external أو ArrayBuffer داخل تخزين، أيضا ممكن متروك تسرب مفرد عدد أخذ مثال مرحلة مقطع داخلي لحظة حالة ذروة قيمة.CI لا تنفيذ هذا مجموعة يد حركة صفة قدرة حالة استخدام، منها أيضا لا يوجد اعتماد آلة جهاز صفة قدرة استهلاك وقت أو داخل تخزين تأكيد؛ بنية تأكيد ثابت fixture قاعدة نموذج، كل بند wire record مقابل واحد Client input، و مزدوج مستهلك Assistant fold fixture متسق نهائي حالة، يشمل delta عدد كمية و نهاية عدد delta seq.

## سبق اعتبار بديل خطة

**في Host إسقاط قد إتمام خطوة قسم قطعة.** هذا سوف نقص قليل منطق حدث عدد، لكن سوف يجعل نقل دلالة أخذ قرار في حالي transcript سياسة، من كل مستهلك إزالة دقيق دليل، معا ما زال يأخذ إبقاء لم إتمام خطوة token تدريجي عدد تركيب دخول معلومة غلاف. فعلي قياس تحزيم استجابة في إبقاء بلا ضرر معا أكثر صغير.

**في دخول Session كائن طبقة قبل توسيع كل بند packed row.** هذا سوف إبقاء كل تاريخ delta مرة callback دلالة، لكن أيضا سوف إعادة إنتاج packed transport أصل هذا يمكن تجنب تجنب متصفح قسم إعداد، بحث جذب و fold صار هذا. تأكيد فعلي حاجة scalar event مستهلك ما زال يمكن صريح استدعاء `decodeStorageRecord()`.

**يأخذ أصلي row وضع في مستقل `.chunks` payload تحت.** هذا سوف إجبار جعل تحت تنقل مستهلك إبقاء اثنان نوع payload حقل اسم، أو في دخول assembly قبل قسم إعداد حقل مقابل متساو حزمة تركيب طبقة. مشترك `.event` حقل حيث إبقاء سريع سرعة خارج طبقة تصنيف، أيضا إبقاء واحد بند داخلي Definition مسار.

**فقط اعتماد HTTP محتوى تحرير رمز.** gzip و Brotli سوف نقص قليل شبكة شبكة بايت، لكن لن إزالة تكرار JSON تحليل، تحقق، قسم إعداد، بحث جذب و fold عمل.

**مباشر حسب شيء إدارة حفظ دائم سطر قسم صفحة.** هذا أيضا يمكن تجنب تجنب cold Host قراءة وقت منطق توسيع، لكن صفحة قطع قسم أخذ قرار في إلحاق مصدر رسالة و استبدال provenance، بينما لا هو provider سطر حد. حالي قرار يجعل API إبقاء مقابل JSONL و لم قدوم حفظ دائم تخطيط مستقل صفة.

**فقط إرجاع تجميع بعد Assistant لقطة.** [فقط إبقاء تجميع رسالة مرفوض سجل](../../rejected/simplification/2026-06-20-assembled-assistant-messages-only.ar.md) ما زال ملائم استخدام:final message خارج حدث عائلة تحمل تحميل مستخدم مرئي حالة و تشخيص حالة، لم إتمام خطوة أيضا حاجة ذلك فعلي تراكم حساب قسم قطعة.

## عاقبة

تاريخ استجابة إبقاء كل منطق event، معا نقص قليل طويل delta run wire بايت،Host استجابة تسلسل تحويل و heap، متصفح JSON تحليل و تحقق،Client entry قسم إعداد، و Conversation dispatch.Journal في إصدار قبل تحقق منطق range، لذلك packed record حيث لن إنتاج زائف gap، أيضا لن إخفاء جزء إعادة تراكم. مباشر استدعاء `session.page` مستهلك يجب حسب `SessionHistoryRecord.type` فرع؛ حاجة تدريجي member event وقت مجددا صريح توسيع `record.event.data`.

بارد حمل دائم تاريخ ما زال سوف أولا حل رمز صار كامل منطق `SessionEvent[]`،Host مجددا اختيار صفحة و إعادة تحزيم. لذلك، هذا قرار تعديل حسن هو نقل و متصفح عمل، لا هو Host بارد قراءة حل رمز داخل تخزين. إزالة حذف هذا توسيع حاجة مزود غير متصل رسالة حد بحث جذب أو مفرد وحيد تدفق صيغة صفحة قراءة جهاز، يخص آخر بند أفضل تحويل.

افتراضي Client تاريخ مسار عام `SessionEventLike`، لذلك فقط قبول مواصفة حمل دائم event مستهلك يجب متابعة استخدام Host `Session.events`،`session/event` أو صريح decode مسار. إزالة استهلاك Assistant delta Definition حاجة صيانة انتظار قيمة scalar و packed فرع. حالي نافذة قد فوري استقبال scalar delta ما زال إبقاء scalar؛ في خط استبدال لـ packed row يخص آخر بند عمل،reopen و reconnect فإن تثبيت packed تاريخ.

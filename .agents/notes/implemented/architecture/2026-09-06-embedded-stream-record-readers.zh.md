# Agent Note: داخل تضمين Assistant تدفق مستهلك مباشر قراءة ضيق تجميع سجل

Status: implemented

[English](2026-09-06-embedded-stream-record-readers.md) | العربية

## مشكلة

Session صيغة v2 سوف كل مرة نموذج محاولة تجربة ضيق تجميع تدفق (`AssistantStreamRecord[]`: تحزيم `text-chunks`،`reasoning-chunks`،`tool-call-chunks` run إضافة فوق حمل ختم الوقت أصلي `chunk` سجل) تضمين دخول `assistant/message` و `assistant/attempt`. طي هذه settlement مستهلك سوف أولا استدعاء `expandAssistantStream()`؛ هو سوف شيء تحويل كامل تدريجي عضو عدد مجموعة، لذلك فقط يحتاج واحد واقع مستهلك (find أول عدد token، الأكثر بعد واحد usage chunk، تجميع وصل نص، واحد block-end) أيضا يلزم دفع خروج O(members) قسم إعداد و وقت: في ضيق تجميع شكل صيغة لـ فوق كل عضو نحو اثنان عدد كائن.

في v2 داخل تضمين تدفق settlement مع رسالة محتوى توسيع،Chat و Trajectory منطقة كتلة مباشر من محتوى تسوية بعد، باق بقية expand مستهلك هو Host و عميل طي:Session Stats قراءة كل `assistant/attempt` و `assistant/message` أول token وقت (كل مرة فتح Session projection مرحلة مقطع) ،token حساب كمية إعادة بناء توفير تجارة محتوى و مسح كل تدفق إلى الأكثر بعد واحد usage chunk(projection وحدة ما زال مسح إلى نهاية ذيل) ، فرعي بديل إدارة إخراج طي تجميع وصل صاف نص،Session Controller مرآة مثل فحص بحث مسح block-end chunk.

## قرار

`@deepseek-ai/dsh-llm` مباشر من ضيق تجميع سجل عودة جواب مستهلك مشكلة؛ باق بقية مستهلك مقابل سجل فعل مرة حمل رفع قبل خروج طي.

`packages/llm/llm/src/assistant-stream.ts` في تراكم إضافة جهاز و `expandAssistantStream` خارج توجيه خروج سجل درجة قراءة جهاز:

- Chunk قاعدة:`isTokenDelta`(غير فارغ نص،reasoning أو Tool-call معامل قطعة مقطع، أو أي حمل اسم Tool-call delta) ،`isVisibleChunk`(غير فارغ أبيض نص أو reasoning، أو text/reasoning/Tool call خارج مهمة معنى كتلة بدء أو انتهاء) ،`chunkHasVisibleText`(غير فارغ أبيض نص delta أو إتمام نص كتلة).
- Run قراءة جهاز:`runFirstTokenTime` و `runFirstVisibleTime` من `time0` و `dt` بين فصل إعادة بناء أول عدد دمج إطار عضو وقت و إيقاف مسح؛ حمل اسم Tool-call run مباشر إنتاج خروج `time0`، لا قراءة قطعة مقطع.
- تدفق قراءة جهاز:`assistantStreamFirstTokenTime`،`assistantStreamHasVisibleContent`،`assistantStreamHasVisibleText`،`lastAssistantStreamChunk(stream, type)`(عكس نحو مسح) ،`assistantStreamChunks(stream, type)`،`joinAssistantStreamText` و `assembleAssistantStream`(كل run نحو `BlockAssembler` تغذية دخول واحد تجميع وصل بعد delta؛ تجميع فقط فعل تجميع وصل، لذلك blocks،usage،finish و replay state و تدريجي عضو نتيجة متسق).`RawStreamChunkType` ترتيب حذف delta نوع، لذلك أصلي chunk فحص بحث غير ممكن قدرة ساكن صامت قفز مرور تحزيم عضو.

Session Stats و Trajectory من `assistant/attempt` و `assistant/message` قراءة `assistantStreamFirstTokenTime`، عبر إعادة محاولة إبقاء خطوة أول عدد token.Trajectory من تجميع بعد رسالة تسوية محتوى، و مستقل قراءة حساب وقت، لذلك إعادة فتح تاريخ وقت بلا حاجة توسيع تدفق سهل قدرة إبقاء TTFT و حل رمز إشارة علامة.Chat التزام دوران[قد تسوية عودة تكرار حساب وقت سياسة](../bug-fix/2026-09-14-chat-presentation-defaults.zh.md).token حساب كمية قراءة `lastAssistantStreamChunk(stream, 'usage')` و عبر `assembleAssistantStream` تجميع توفير تجارة إخراج؛ فرعي بديل إدارة إخراج طي إلحاق `joinAssistantStreamText`؛Session Controller استخدام `assistantStreamChunks(stream, 'block-end')` مسح مرآة مثل.

`expandAssistantStream` إبقاء ذلك صارم إطار تحقق و ذلك بقية استدعاء جهة (حاجة كل عضو أو في حمل دائم حد تحقق تدفق):Session استعادة تحقق،v1-to-v2 ترحيل تحقق جهاز و إصدار Worker إعادة وضع، إعادة وصل أساس خط، اختبار دعم دعم.

### قياس كمية

مستودع دمج صار first-open أساس دقيق (200 حلقة،127,400 عدد released-v0 حدث،1,600 بند ضيق تجميع سجل في 500,000 عدد تدفق صيغة delta؛ خمسة مرة أخذ مثال أخذ في موضع عدد):

| مرحلة مقطع | قبل | بعد |
|---|---|---|
| first-open projection | 28.0 ms | 5.9 ms |
| first-open مجموع حساب | 76.9 ms | 53.8 ms |
| first-open ذروة قيمة RSS | 137.2 MB | 94.6 MB |
| reopen projection | 17.8 ms | 6.5 ms |

Open،read،restore مرحلة مقطع ثابت؛ قراءة جهاز حسب بنية صنع إبقاء نفسه أول token وقت (أول عدد دمج إطار عضو أي أول بند سجل أول عدد دمج إطار قطعة مقطع، كما delta إبقاء لديه ترتيب).

## تجهيز اختيار خطة

**حسب إدخال عدد مجموعة تسجيل ذاكرة تحويل `expandAssistantStream`.** توسيع الكل تدفق فقط يحتاج بضعة عشرة جزء ثانية، لكن إبقاء توسيع نتيجة في حدث دورة الحياة داخل نحو زهرة استهلاك ضيق تجميع تدفق عشرة ضعف داخل تخزين——هذا هو هذا تغيير إزالة لحظة وقت قسم إعداد دائم دائم إصدار. قراءة جهاز تماما إزالة حذف مقابل إبقاء توسيع يحتاج طلب.

**إبقاء تدريجي عضو طي.** رفع قبل خروج `.find` ما زال أولا شيء تحويل كامل عدد مجموعة، لذلك قسم إعداد و O(members) وقت ما زال في.

## عاقبة

Host و عميل طي مرة داخل تضمين تسوية بديل قيمة لـ O(records) إضافة كل run مرة تجميع وصل، كما حذف غير في حمل دائم حد تحقق أو حاجة كل عضو، مستهلك لم يعد شيء تحويل عضو.token، مرئي صفة و مرئي نص قاعدة في `dsh-llm` في فقط لديه واحد موضع، لذلك سجل قراءة جهاز و تراكم إضافة جهاز تحزيم قاعدة غير ممكن قدرة عائم نقل.

إصدار تحقق (`assertCurrentAssistantStreams`) ما زال في إصدار وقت إعادة وضع كل settlement؛ لأن هو يجب حسب chunk إثبات محتوى متسق، سوف ذلك تحويل لـ لا دخول عضو run شعور معرفة تجميع ما زال هو لم إتمام عمل.

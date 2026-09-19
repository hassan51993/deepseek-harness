# Agent Note: إيقاف سوف token تدفق مرآة مثل لـ agent حدث

Status: implemented
Archived: 2026-07-27

[English](2026-07-02-remove-stream-chunk-mirror.md) | العربية

## مشكلة

agent loop(ذكي جسم حلقة) سوف نموذج كل token delta معا سجل لـ حمل دائم `assistant/chunk` جلسة حدث، تزامن إطلاق واحد يحمل نفسه بيانات و سطر فوري `agent/stream-chunk` Cordis حدث. في `packages/core/agent-loop/src/agent.ts` في، اثنان من فقط متبادل فصل واحد سطر:

```ts ignore-check
const chunkEvent = session.append('assistant/chunk', { turn, step, chunk })
chunkSeqs.push(chunkEvent.seq)
ctx.emit('agent/stream-chunk', agent, turn, step, chunk)   // ← the mirror
```

- حمل دائم حدث:`assistant/chunk: { turn, step, chunk }`.
- فوري إرسال إطلاق:`agent/stream-chunk(agent, turn, step, chunk)`——نفسه `StreamChunk`، نفسه `turn`/`step`.

فوري إرسال إطلاق متبادل مقارنة جلسة حدث وحيد كثير خروج شرق غرب هو فوري `Agent` جملة مقبض، بينما وحيد مستهلك مباشر إسقاط هو (ذلك معالجة دالة توقيع لـ `(_agent, _turn, _step, chunk)`).

هذا و[إزالة حد مرآة مثل](2026-06-20-remove-agent-boundary-mirror-events.md) لـ جولة/خطوة حد إزالة حذف تكرار نفسه: مستهلك وجه مقابل نفس حمل دائم واقع اثنان عدد حق مصدر، كل مرة تغيير كل يجب معا لمس و اثنان من. هذا Agent Note(agent قرار سجل) لا يوجد يأخذ قسم قطعة تدفق واحد و قبول دخول، بينما هو دفع متأخر معالجة (“`assistant/chunk` حفظ دائم ما زال تحمل تحميل صلة مفتاح قيد، الذي بـ بـ بعد يمكن سوف قسم قطعة تدفق بصفة مرآة مثل تقييم تقدير، لكن ذلك هو واحد بند مستقل قرار”). هذا Agent Note حينئذ هو ذلك بند مستقل قرار.

دفع متأخر الذي اعتماد قبل رفع قد واضح: قسم قطعة حفظ دائم هو مرجعي، كما سوف إبقاء. إيقاف حفظ دائم قسم قطعة، فقط إبقاء لحظة حالة فوري تدفق حدث رفع سجل قد يتم[مرفوض](../../rejected/simplification/2026-06-20-assembled-assistant-messages-only.md)——عال حفظ حق إعادة تشغيل، جزء فشل تدفق و لقطة إعادة تشغيل كل اعتماد حفظ دائم `assistant/chunk` تسلسل. لذلك `session/event` فوق `assistant/chunk` هو حمل دائم، تحمل إعادة token تدفق، بينما `agent/stream-chunk` هو هو صاف زائد بقية مرآة مثل.

## قرار

من agent حدث تصنيف جسم نظام في إزالة `agent/stream-chunk`.token تدفق عبر `session/event` بـ `assistant/chunk` شكل صيغة قراءة——حفظ دائم و إعادة تشغيل قد استخدام صحيح هو نفس عدد تسلسل.`session/event` هو وحيد فوري transcript(نص سجل) تدفق (assistant قسم قطعة، جولة/خطوة حد، أداة نشط حركة،todo).

**مستهلك.** حفظ دائم، إعادة تشغيل و تفاعل صيغة مصير مباشر إزالة استهلاك مرجعي جلسة تدفق.[فقط موجه إلى تلقائي تحويل ACP(Agent Client Protocol) جسر وصل طبقة](2026-07-23-acp-automation-only-protocol.md) إرسال خروج قد إيداع `assistant/message` نص بينما غير أصلي قسم قطعة، لذلك اثنان نوع حدث هو كل لا حاجة. لا يوجد إنتاج مستهلك حاجة واحد `Agent` أولوية token مرآة مثل.

## نطاق

إزالة:`agent/stream-chunk`.

لم لمس و:
- `assistant/chunk`(حمل دائم جلسة حدث)——مرجعي token تدفق، أصل مثال إبقاء. هذا Agent Note إزالة هو فوري مرآة مثل، بينما غير حفظ دائم (إزالة حفظ دائم رفع سجل قد مفرد وحيد تعرض إلى رفض——رؤية فوق نص).
- `agent/steering`——هذا قرار لم لمس و (هو هو تحكم إشارة، لا هو token تدفق). ذلك حمل دائم توأم توليد حدث هو `steering/message`، مرآة مثل إرسال إطلاق من ذلك ذاته لاحق Agent Note إزالة:[إزالة `agent/steering` مرآة مثل إرسال إطلاق](../../archived/simplification/2026-07-04-remove-agent-steering-mirror.md).
- `agent/status`،`agent/error`،`agent/created`/`agent/disposed`،`agent/queued`،`agent/session-start`——دورة الحياة/تحكم حدث، لا هو transcript بيانات، أيضا لا يوجد حمل دائم فرعي هذا.

## سبق اعتبار بديل خطة

**إزالة حفظ دائم، فقط إبقاء لحظة حالة فوري تدفق**——عكس نحو قطع قص، قد يتم[مفرد وحيد مرفوض](../../rejected/simplification/2026-06-20-assembled-assistant-messages-only.md): عال حفظ حق إعادة تشغيل، جزء فشل تدفق و لقطة إعادة تشغيل كل اعتماد حفظ دائم `assistant/chunk` تسلسل. في هذا قبل رفع تحديد بعد، فوري إرسال إطلاق عندئذ هو إعداد مقابل في زائد بقية ذلك واحد نصف.

## عاقبة

إضافة لا يستطيع مجددا من `Agent` أولوية حدث مراقبة token زيادة كمية. هو حاجة حجز قراءة `session/event`، مرور ترشيح `assistant/chunk`، و في حاجة وقت عبر `ctx.agents.get(session.id)` مباشر فحص بحث مقابل فوري handle. لا يوجد إنتاج مستهلك حاجة في قسم قطعة وقت لحظة أخذ نيل فوري `Agent`؛ هذا و إزالة حد مرآة مثل الذي عمل أخذ ترك نفسه، متساو يمكن قبول.

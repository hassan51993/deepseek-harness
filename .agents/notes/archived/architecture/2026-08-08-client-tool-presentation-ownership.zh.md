# Agent Note: Client أداة عرض كل حق

Status: implemented
Archived: 2026-09-04

[English](2026-08-08-client-tool-presentation-ownership.md) | العربية

## مشكلة

Client وقت التشغيل قد حسب `callId` إعداد مقابل أداة استدعاء/نتيجة حدث، و قدرة من Code Dispatch حدث استعادة root/subcall توسيع اندفاع، لكن Chat view سبق معا يملك أداة في محادثة تدفق في وضع وضع، تمرير عودة استدعاء شجرة تحرير ترتيب، حسب أداة اسم توزيع،Generic fallback،card model و رقم واحد جهة أداة renderer.`ui-conversation` لذلك يجب حل تفسير كل عمل خدمة أداة اسم؛ فقط نقل حركة مفرد عدد React مكون لن تغيير هذا طبقة كل حق، نقل مشي أصل فرعي renderer بعد subcall عرض أيضا سوف بلا شخص مسؤول.

أداة عرض حاجة واحد مستقل كل من، معا لا يستطيع بناء قيام و Client slot مستو سطر ثاني طقم سجل التسجيل، أيضا لا يستطيع يجعل كل أصل فرعي أداة renderer ذاتي ذات إدارة حل root/subcall بنية.

## قرار

أداة هو Client UI واحد درجة عرض عام فكرة، من `@deepseek-ai/dsh-client-ui-tool` موحد واحد يملك root/subcall تحرير ترتيب، حسب wire أداة اسم أصل فرعي renderer توزيع،Generic fallback،card model و details output. عمل خدمة إضافة فقط تسجيل ذاتي ذات أصل فرعي أداة renderer، لا تعديل conversation أو جلسة.

Conversation بيانات تجميع التزام دوران لاحق [Conversation عمل خدمة عقدة قرار](2026-08-09-client-conversation-node-assembly.zh.md).`ui-conversation` أداة Definition من جلسة حدث إعداد مقابل root call/result، يأخذ Code Dispatch edge fold صار تمرير عودة `ToolCallBlock.subCalls`، و توليد واحد مستقر `tool-call` Chat Node؛ هذا داخل بيانات مسؤولية فقط معالجة رسمي جهة أداة identity و توسيع اندفاع، لا حل تفسير أداة جسم أداة اسم عرض.

[`ChatView`](../../../../packages/client/ui-chat/src/client/chat/ChatView.tsx) فقط حسب Chat لقطة `order` وضع وضع عام [`ChatNodeSeat`](../../../../packages/client/ui-chat/src/client/chat/ChatNodeSeat.tsx).Seat بـ `node.kind` توزيع `'conversation.chat.node'`؛[`ui-tool`](../../../../packages/client/ui-tool/src/client/apply.ts) تسجيل `tool-call` entry، و من [`ToolCallTree`](../../../../packages/client/ui-tool/src/client/tool/ToolCallTree.tsx) تمرير عودة مرة تاريخ root block. كل واحد طبقة root أو child كل عبر نفس عدد keyed/session `'tool.call.toolview'` فرعي slot بـ `entryKey: toolName` توزيع، نقص قليل تسجيل وقت تصيير `GenericToolCard`.

عمل خدمة أداة إضافة استقبال واحد معيار `ToolCallBlock`،identity،workspace cwd و مضيف حركة عمل، لا قراءة جلسة، سياق أو Conversation assembler.skill(تقنية قدرة) ما زال هو عادي أداة؛ هو و أخرى عمل خدمة أداة استخدام نفس keyed slot تسجيل مسار.

details panel هو ثاني عدد أداة عرض نقطة، لكن لا هو استدعاء شجرة كل من.`ui-conversation` تحديد موضع selected call، و عبر `'conversation.details.tool'` تفويض حمل output body؛`ui-tool` إعادة استخدام card model، إضافة نقص مقعد وقت conversation fallback إبقاء raw result text.

Generic row model إبقاء أصلي معامل نص `bodyRaw`، لا كشف مسبق صيغة تحويل body.`ToolRow` و Bash fallback فقط في توسيع بعد generic input section مرئي وقت صيغة تحويل هذا نص؛ استلام بدء سطر سوف إزالة صيغة تحويل نص، تصيير بنية تحويل بطاقة سطر فإن قفز مرور generic body صيغة تحويل.

## وقت التشغيل و تصيير مسار

```text
Session Event window
  -> Tool Definition -> tool-call Chat Node (recursive ToolCallBlock)
  -> ChatView -> ChatNodeSeat(entryKey = tool-call)
  -> ToolCallTree
       -> root/subCalls[] recursion
       -> tool.call.toolview(entryKey = toolName)
            |- registered atomic view
            `- GenericToolCard fallback
                 |- collapsed or structured card: retain argsRaw only
                 `- expanded generic input: format argsRaw
```

## كل حق حد

| كل من | يملك | واضح لا يملك |
|---|---|---|
| Client وقت التشغيل Conversation engine | سياق identity،Location، تاريخ إعادة تشغيل،view Node إصدار | أداة حدث يحتوي معنى، استدعاء شجرة، أداة renderer |
| `ui-conversation` أداة Definition | call/result إعداد مقابل،Code Dispatch توسيع اندفاع،running/settled/interrupted `ToolCallBlock`،Chat ترتيب ترتيب anchor | أداة اسم توزيع،card model، تمرير عودة React بنية |
| `ui-conversation` Chat view | keyed Node ترتيب،scroll anchor،selection و مضيف حركة عمل | أداة lifecycle،subcall تركيب، أصل فرعي أداة renderer |
| `ui-tool` | root/subcall تمرير عودة تصيير، أصل فرعي keyed dispatch،fallback،card model، توسيع وقت معامل صيغة تحويل و details output | جلسة حدث fold،Chat ترتيب ترتيب |
| عمل خدمة أداة إضافة | واحد أو كثير عدد wire أداة اسم أصل فرعي renderer | root/subcall موضع، دورة الحياة إعداد مقابل، جلسة projector |

## تحقق

`ui-conversation` اختبار ثابت أداة Definition call/result إعداد مقابل،Code Dispatch،interruption و running-to-settled keyed identity، لا استيراد `ui-tool` إنتاج renderer.`ui-tool` اختبار تركيب حقيقي conversation مضيف، ثابت root/subcall تمرير عودة،keyed dispatch،Generic fallback،selection،details، أداة جسم أداة card و فقط في توسيع وقت تنفيذ generic body صيغة تحويل. تجميع بعد Web اختبار تغطية اثنان عدد إضافة مشترك نفس تركيب تحميل مسار.

## اعتبار مرور بديل خطة

**في كل conversation view تحت إبقاء أصل فرعي أداة slot.** رفض: كل view كل يلزم تكرار root/subcall تحرير ترتيب، أداة تسجيل أيضا سوف حسب view قسم شق. كامل أداة renderer احتلال حسب view واحد عمل خدمة Node slot، أصل فرعي توزيع من أداة ذاتي ذات يملك.

**فقط نقل حركة أداة React مكون و card model.** رفض:conversation ما زال سوف حسب أداة اسم توزيع و تمرير عودة subcall، ملف موضع تغير لا إنتاج كل حق حد.

**لـ أداة بناء قيام مخصص تابع projector/fold سجل التسجيل.** رفض: عام Conversation assembler قد يملك سياق identity، تاريخ نافذة و إصدار؛ ثاني عدد وقت التشغيل سجل التسجيل سوف صنع صنع دورة الحياة مزدوج إعادة مرجعي.

**يجعل كل أصل فرعي أداة renderer تمرير عودة ذاتي ذات subcall.** رفض: أصل فرعي تسجيل جهة فقط ينبغي إدارة حل واحد أداة استدعاء، لا ينبغي معرفة طريق ذاتي ذات هو root أيضا هو child. تمرير عودة بنية موحد واحد من `ToolCallTree` معالجة.

**يجعل `ui-conversation` مباشر استيراد `ui-tool` مكون.** رفض: هذا سوف عكس تحويل وظيفة اعتماد و يأخذ أداة عرض تغيير صار لا بد اختيار قدرة.slot إبقاء مستقل تركيب تحميل، دورة الحياة و fallback.

**لـ توافق صفة في row model فوق إبقاء مسبق صيغة تحويل body.** رفض: كل طي سطر كل سوف إبقاء ثاني نسخة كامل معامل نص، بينما كما توافق حقل سوف يجعل لاحق مستهلك استعادة eager صيغة تحويل.model فقط كشف `bodyRaw`، جعل توسيع وقت صيغة تحويل يصبح وحيد generic مسار.

## عاقبة

`ui-conversation` لم يعد اعتماد أداة اسم مقابل عمل خدمة عرض،root و subcall أيضا لن عائم نقل إلى مختلف توزيع مسار. عمل خدمة حزمة يمكن مستقل يملك أصل فرعي أداة renderer؛`ui-tool` نقص مقعد وقت،Conversation بيانات تجميع ما زال صار قيام،Chat Node استخدام عام fallback،details إبقاء raw result.

طي أداة سطر فقط إبقاء قائم `argsRaw` مرجع، لا إنشاء pretty-print فرعي هذا، أيضا لا تنفيذ مقابل صيغة تحويل استدعاء. توسيع generic input وقت عندئذ لـ حالي مرئي سطر إتمام هذا بند عمل، استلام بدء بعد إرسال توليد نص يمكن يتم عودة استلام؛ تكرار توسيع بـ محدود إعادة حساب تبديل أخذ أكثر منخفض معتاد إقامة داخل تخزين.

بديل قيمة هو `ui-tool` واضح اعتماد conversation إعلان عمل خدمة Node slot و locale namespace، و يملك واحد أداة مخصص تابع فرعي slot. أداة Definition مؤقت وقت يقع في `ui-conversation`، لأن هذا مرة لا يوجد تفكيك حزمة؛ هو بـ بعد يمكن امتداد Conversation سجل التسجيل seam نقل حركة، بينما لن تغيير هذا سجل قاعدة تحديد عرض كل حق.

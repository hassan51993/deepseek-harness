# Agent Note: Trajectory خطوة وحدة إطار و جولة قائمة chrome

Status: implemented
Archived: 2026-07-26

[English](2026-07-23-trajectory-step-cell.md) | العربية

## Problem

trajectory وسم صفحة حاجة يمكن إعادة استخدام خطوة سطر و جولة قائمة chrome، بـ عرض توسيع بعد assistant كتلة، ذاته استهلاك وقت،Message token صف، و إجراء في عمل. إذا لا سوف جلسة حدث وقت طي دخول جلسة عقدة، و سوف كتلة توسيع لـ وحدة إطار،UI حينئذ لا يمكن مقابل متساو منتج chrome.

## Decision

[`@deepseek-ai/dsh-client-ui-trajectory`](../../../../packages/client/ui-trajectory/README.md) يملك عرض نوع trajectory قائمة chrome:

- [`TrajectoryCell`](../../../../packages/client/ui-trajectory/src/client/TrajectoryCell.tsx) — عال 38px خطوة سطر، نوع لـ User / Message / Tool(بلا Think،Call،Result سطر).reasoning كتلة قفز مرور (بلا كتلة درجة وقت ساعة). كل مقابل `tool-call` + `tool-result` طي صار واحد سطر Tool(`name ·` إضافة قطع قطع معامل) ،Time في اثنان طرف جميع معرفة وقت لـ `result.time − callTime`.Message سطر يحمل قدوم ذاتي `assistant.usage` Input/Output/Think token صف. ذاته استهلاك وقت Time استخدام `+Ns` / `+N.1s`، ناقص وقت لـ `—`. اختيار في حالة رسم صنع 2px داخل تضمين `--dsw-alias-brand-primary-new-colorprimary-new-color` حلقة (`selected` prop) ، كما لم وصل خط إلى chat اختيار في.
- [`TrajectoryTurn`](../../../../packages/client/ui-trajectory/src/client/TrajectoryTurn.tsx) / header / group header — لصق صفة Turn بند خلف مشهد عبر شريط فرش `ghost-active-fill`؛ عنوان/صف علامة و Message/Step رئيسي جسم سقوط في إقامة في `max-width: 880px` محتوى طريق. وحدة إطار يمين جانب صف و Turn علامة رأس مشترك استخدام بضعة أي (`320 = 4×71 + 3×12`) ؛cell pad 20/8.
- [`deriveTrajectoryLayout`](../../../../packages/client/ui-trajectory/src/client/layout.ts) سوف assistant `blocks[]` توسيع لـ وحدة إطار، حسب `callId` سوف tool-call و tool-result إعداد مقابل لـ Tool، طي `partial` و `runningCalls`(ذهاب إعادة) ، فقط سوف استخدام كمية تعليق في Message فوق (يحتوي بلا text كتلة وقت فارغ رجوع سطر) ، و بـ جدار ساعة عبر درجة + أداة مباشر جهة رسم بناء قسم مجموعة وصف (`1.5s bash×6`).`user/message` بلا خط فوق turn، لذا كل بند User سطر عودة دخول تحت واحد assistant/steering turn، لا فإن عودة دخول إجراء في `partial` turn، لا فإن لـ `lastAssistantTurn + 1`(أو `1`).context عقدة لا إنتاج خروج وحدة إطار، لكن ما زال دفع دخول Message استهلاك وقت تنقل علامة.

[`ConversationNode`](../../../../packages/client/runtime/src/client/sessions/conversation.ts) يحمل قدوم ذاتي `SessionEvent.time` `time`؛`ToolResultNode.callTime` و `RunningToolCall.time` قدوم ذاتي إعداد مقابل `tool/call`. استهلاك وقت قاعدة:User لـ `+0s`؛Message = assistant.time − فوق واحد جدول وجه وقت (يحتوي قفز مرور context) ؛Tool = في اثنان من جميع معرفة وقت result.time − callTime؛ إجراء في Tool = `—`. قسم مجموعة علامة رأس استهلاك وقت لـ مجموعة داخل الأكثر مبكر→الأكثر متأخر قطعا مقابل وقت (جدار ساعة عبر درجة؛Tool مساهمة بدء نقطة و بدء نقطة+ذاته استهلاك وقت).

## Alternatives considered

**لـ reasoning كتلة إبقاء Think وحدة إطار.** مرفوض: مفرد بند `assistant/message.time` لا يمكن إعطاء خروج Think ذاته استهلاك وقت (حذف غير فوق chunk درجة وقت ساعة) ؛ و ذلك عرض `—`، لا مثل حذف هذا سطر.

**إبقاء قسم فتح Call و Result سطر.** مرفوض:Result لا يوجد يمكن عرض ذاته استهلاك وقت؛ واحد سطر Tool تحمل تحميل call→result منطقة بين.

**ذاتي جلسة/جولة بدء نقطة تراكم حساب استهلاك وقت.** مرفوض؛Time صف هو كل سطر ذاته استهلاك وقت.

**سوف استخدام كمية تعليق في توسيع بعد رقم واحد سطر.** مرفوض؛ استخدام كمية فقط مرفق حال في Message.

**استخدام Date.now() عرض إجراء في أداة استهلاك وقت.** تأخير بعد؛ إجراء في Time إبقاء لـ `—`.

## Consequences

واحد حالما fold إرسال خروج `time`،Trajectory وسم صفحة يكفي تصيير حمل ذاته استهلاك وقت قد تحديد مسودة و إجراء في توسيع سطر. سلوك توجيه نحو تغطية يقع في `packages/client/ui-trajectory/tests/{cell,layout,views}.spec.tsx`.chat اختيار في عميق سلسلة و أكثر دقيق كتلة درجة وقت ساعة ما زال تأخير بعد.

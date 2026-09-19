# Agent Note: Web UI ذهاب إسقاط steer مدخل و إدراج كلام chrome

Status: implemented
Archived: 2026-08-07

[English](2026-07-31-web-ui-no-steer-entry-or-interjection-chrome.md) | العربية

## مشكلة

في طريق steering هو host/agent-loop قدرة (`mode:'steer'`، حمل دائم `user/message`).Web منتج قد في turn تشغيل في قفل تحديد composer، كما من لم تسليم ترتيب طابور/steer قائمة مفرد، لكن عميل ما زال يأخذ `'queue' | 'steer'` اختراق دخول input machine،`conversation.send` و locale مفتاح، و يأخذ قد إزالة استهلاك steering تصيير صار حمل «إدراج كلام»/«Interjection» شعار فصل هواء فقاعة. هذا إبقاء تحت نصف صار صنف UI: استخدام لا إلى إيداع mode، مستخدم فعل لا إلى يد اتجاه لكن لديه منتج نص سجل، و يأخذ منتج و لا يملك chrome تثبيت ميت في e2e golden فوق.

## قرار

إبقاء host و runtime steering. فقط ذهاب إسقاط Web UI مدخل و chrome:

- `InputMachine`/`SessionInput`/`InputActions.submit`/hub `defaultSink` فقط queue؛ بداية نهاية استدعاء `session.prompt(..., 'queue')`.
- `ConversationService.send(text)` ذهاب إسقاط mode معامل، بداية نهاية ترتيب طابور.
- حمل دائم steer محتوى تصيير لـ يمين مقابل متساو عادي هواء فقاعة (بلا شعار فصل، بلا مستخدم IconActions) ، بـ سهل خارجي/host steer في إعادة تشغيل وقت ما زال مرئي.
- حذف `message.steering` locale نص و لم استخدام شعار فصل CSS.
- web steering e2e ما زال عبر `/api/session.prompt` POST `mode:'steer'`، و تأكيد حفظ دائم و نموذج مرئي خدمة من؛ لم يعد مدة نظر إدراج كلام chrome. تزامن تحديث [web input machine note](../architecture/2026-07-25-web-input-machine-and-slash-pipeline.md) في واقع سطر.

## سبق اعتبار بديل خطة

**كامل مقطع حذف host steering.** تجاوز خروج نطاق؛ مستخدم فقط اشتراط صاف Web UI عرض و مدخل.agent-loop ترتيب فارغ،session حدث و خط كابل mode مقابل ACP/TUI/تلقائي تحويل ما زال هو تحمل إعادة قدرة.

**في transcript في إخفاء حمل دائم steer `user/message` محتوى.** خارجي عميل steer وقت إعادة تشغيل سوف فقد حق، لذلك تعديل لـ عادي هواء فقاعة.

**إبقاء mode معامل لكن دائم بعيد فقط نقل `'queue'`.** إبقاء تحت ميت API وجه و فقط سوف وهمي بنية composer إلى لا `'steer'` مسار اختبار.

## عاقبة

- **جزء يتم يحل محل.** قرار في رقم 1 بند و رقم 3 حتى 5 بند قد لم يعد وصف master:composer steering بعد قدوم قد تسليم،[سياق مصدر و steer معرف قرار](../feature/2026-08-04-web-context-source-and-steer-marks.md) مسؤول تعريف ذلك علامة ملاحظة. تحت وجه صف خروج حالي واقع.
- host جانب steering ملكية لم تغيير:agent-loop ترتيب فارغ،session حدث و خط كابل mode مقابل ACP، تلقائي تحويل و غير Web عميل ما زال لا بد يلزم.
- `ConversationService.send(text)` ما زال لا وصل mode، بداية نهاية ترتيب طابور؛composer Steer يد اتجاه تعديل مشي `session.prompt(mode: 'steer')`.
- حمل دائم steer `user/message` محتوى ما زال طي دخول transcript، لذلك خارجي إيداع steer سوف مثل فعلي ظهور في إعادة تشغيل في. هو الآن حمل لديه إدراج كلام علامة ملاحظة، بينما لا هو بلا معرف هواء فقاعة.
- غير مستخدم مصدر next-step بند (`agent.inject` سياق: مراجعة دفعة إشعار، مهمة إتمام، مرفق إضافة لقطة) بـ `context` placement واسع بث، أبدا تصيير لـ انتظار معالجة steering هواء فقاعة؛ قيادة أخذ لـ حمل دائم `user/message` context card قبل إبقاء غير ممكن رؤية.

## اختبار

- `packages/client/ui-conversation` unit/jsdom تغطية:input machine enter/sink،ConversationService توجيه،MessageItem steering فرع،InputBar submit.
- `apps/web/tests/steering.e2e.ts` بلا مفتاح إعادة تشغيل و ذلك أصفر ذهب أساس خط، بعد من سوف فحص إدراج كلام علامة ملاحظة.
- `packages/host/apiproxy` `session/queue` إسقاط اختبار تأكيد مستخدم مصدر next-step بند إبقاء `steering`، بينما إضافة مصدر بند سقوط دخول `context`.

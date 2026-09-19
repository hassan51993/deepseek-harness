# Agent Note: تراجع دور readline قبل طرف و repl-agent عرض مثال

Status: implemented
Archived: 2026-07-26

[English](2026-07-20-retire-readline-front-door.md) | العربية

## مشكلة

مستودع معا توفير اثنان عدد تفاعل صيغة طرفية قبل طرف: موجه إلى سطر readline عبر طريق (`@deepseek-ai/dsh-stdio`) و كل شاشة [`@deepseek-ai/dsh-tui`](../feature/2026-07-17-dedicated-full-screen-tui-front-door.md).TUI سقوط أرض بعد،readline تفاعل زاوية لون قد زائد بقية——`demo:tui` بصفة تحرير رمز agent تجربة يحل محل `demo:repl`——بينما هو باق تحت حقيقي زاوية لون (إدارة طريق و تلقائي تحويل) قد من مفرد مرة مهمة `@deepseek-ai/dsh-cli-demo` تطبيق بـ أكثر جيد طريقة تحمل تحمل (مهمة إدخال،DSH أصلي `text`/`json`/`stream-json` إخراج، حفظ دائم، إشارة معالجة).

هذا نوع تكرار هو بنية صفة، لا فقط هو جدول وجه مشكلة:`dsh-stdio-demo` يحمل واحد `TerminalMode`(`auto`/`readline`/`tui`) اختيار وصل شق، نحو 1,000 سطر readline اختبار وحدة، واحد طقم يتم CI عرض عرض خطر دخان اختبار و اثنان عدد built-bin e2e استخدام grep مطابقة readline نص سجل لغة قاعدة (`[tool call] …` سطر) ، و واحد قلب وضع عرض مثال تركيب: راية سفينة `tui-agent` ورقة عقدة يتم تعريف لـ مقابل هو الذي يحل محل `repl-agent` ورقة عقدة include patch.

## قرار

حذف readline قبل طرف و repl-agent عرض مثال؛ فقط إبقاء ثلاثة صنف قبل طرف أصل نوع:**تفاعل صيغة TUI**(فقط TTY، إدارة طريق تحت سريع سرعة فشل) ،**مفرد مرة مهمة CLI**(`-p`/موضع معامل مهمة، خدمة إدارة طريق و تلقائي تحويل) و**خادم**(ACP / JSON-RPC).

- `packages/ui/stdio` و `examples/repl-agent` قد حذف.`packages/examples/stdio-demo` أكثر اسم لـ `@deepseek-ai/dsh-tui-demo`(`packages/examples/tui-demo`) و بداية نهاية تركيب `dsh-tui`؛`TerminalMode`/`resolveTerminalMode`/`ui.mode` وصل شق مع لـ حذف.bin في**بدء loader قبل**حينئذ رفض غير TTY تدفق (Loader شجرة داخل تركيب مدة رمي خروج استثناء حسب بند سجل سجل بينما لن إعادة رمي خروج، إدارة طريق بدء لا فإن سوف غرق خفض لـ واحد فارغ خامل بلا UI عملية بينما لا هو بـ غير صفر رمز خروج).
- `examples/tui-agent/cordis.yml` الآن داخل ربط يملك تحرير رمز تركيب (include patch قلب وضع إزالة فقد) ؛ ذلك Code Mode تغطية طبقة include ذاتي ذات أساس أساس إعداد.`examples/cordis-agent` ترحيل إلى TUI تطبيق.
- `examples/echo-agent` ترحيل إلى مفرد مرة مهمة `dsh-cli-demo` تطبيق؛`dsh-cli-demo` إضافة جديدة `-p/--prompt` بصفة مفرد عدد مهمة راية علامة شكل صيغة (و موضع معامل متبادل رفض).
- و UI غير متصل حمل مفتاح تحرير رمز e2e(`full-loop`،`coding-task`،`resume`،`compaction`،`todo-write`،`code-mode` و ذلك مشترك harness) أصل مثال من `examples/repl-agent/tests/` نقل دخول `examples/tui-agent/tests/`——هو جمع بـ تحرير مسار طريقة تجميع كامل مكدس، من لا وصل لمس أي UI.
- SDK نحو توجيه `stdio` تشغيل واجهة تعديل لـ `tui`(`RunInterface = 'acp' | 'tui' | 'embed'`) ، مساهمة `dsh-tui` بند إعداد بينما لا هو `dsh-stdio`؛ توليد `index.ts` في `startSDK` قبل فحص TTY، إدارة من و tui-demo bin بدء قبل سريع سرعة فشل نفسه.

### اختبار سياسة:PTY فقط لأجل TUI

إدارة طريق ما زال هو افتراضي اختبار وسيط جودة.PTY قيادة عملية فرعية اختبار**فقط**في يتم قياس كائن حينئذ هو TUI ذاته وقت نيل دقيق استخدام:`examples/tui-agent/tests/tui-keyless-smoke.e2e.ts`(إضافة جديدة Code Mode تغطية طبقة بدء مشهد، يحل محل repl-agent إدارة طريق خطر دخان اختبار يصبح هذا تغطية طبقة بلا مفتاح تركيب إثبات) و `examples/cordis-agent` في الأكثر صغير PTY بدء خطر دخان اختبار (ذلك قبل طرف حينئذ هو TUI). ذلك بقية الكل تعديل لـ عبر مفرد مرة مهمة bin مشي إدارة طريق:

- `examples/echo-agent/tests/echo.e2e.ts` عبر `stream-json` سجل إثبات Loader بدء + mock نموذج أداة نحو إرجاع، بينما لا هو مطابقة readline نص سجل سطر.
- CI عرض عرض خطر دخان بوابة (`scripts/run-gates.ts`،AGENTS.md) تشغيل `demo:echo --output-format stream-json -p "echo ci smoke"` و بنية تحويل تحليل سجل.
- TUI مقابل إدارة طريق بدء رفض (غير صفر خروج + إشارة نحو مفرد مرة مهمة CLI تلميح) من `apps/cli/tests/built-bin.e2e.ts`(صاف Node تحت `dsh` TTY حراسة حماية) تغطية؛ صاف Node تحت echo نحو إرجاع إثبات و ناقص إعداد سريع سرعة فشل إثبات يقع في `cli-demo` built-bin طقم عنصر.
- `packages/context/time-context/tests/time-context.e2e.ts` تشغيل واحد مفرد مرة مهمة جولة؛ كثير جولة elapsed تصيير ما زال من ذلك اختبار وحدة تغطية.

## قبول ضرر فقد

- **مفرد عملية داخل إدارة طريق كثير جولة محادثة**——readline عبر طريق يمكن عبر stdin نص برمجي تحويل كثير عدد جولة؛ مفرد مرة مهمة bin كل عملية فقط تشغيل واحد مهمة. كثير جولة وصل متابعة صفة من `RESUME_SESSION_ID`/resume e2e و TUI نص برمجي تحويل PTY محادثة تغطية.
- **غير TTY `ask_user_question`**——readline مزود هو `ctx.userInteraction` وحيد غير TTY طرفية تنفيذ. نموذج استدعاء `ask_user_question` headless أو ACP تلقائي تحويل تشغيل سوف يجعل هذا أداة استدعاء فشل، حذف غير ذلك تركيب توفير متبادل ينبغي provider؛Web يملك قد تسليم غير طرفية provider.

## سبق اعتبار بديل خطة

- **إبقاء `dsh-stdio` بصفة صاف إدارة طريق/تلقائي تحويل عبر طريق بينما فقط حذف repl عرض عرض**——غير مقبول: هو تلقائي تحويل زاوية لون بـ أكثر ضعيف عقد نحو تكرار `dsh-cli-demo`(غير بنية تحويل نص سجل،EOF خروج بدء إرسال صيغة حكم قطع، مقابل مقارنة بعد من مرة حمل دائم جولة انتهاء و صيغة صاف صاف إخراج).
- **يأخذ إدارة طريق خطر دخان اختبار تعديل كتابة لـ PTY قيادة**——غير مقبول:PTY هو أكثر سهل موجة حركة، أكثر تكرار مختلط وسيط جودة، فقط إبقاء إعطاء إدارة طريق لا يمكن إثبات ذلك واحد جدول وجه (حقيقي TTY وصل إدارة/استعادة).

## عاقبة

- واحد تفاعل صيغة قبل طرف (TUI) ، واحد تلقائي تحويل قبل طرف (مفرد مرة مهمة CLI) ، اثنان عدد خادم؛ طرفية تطبيق لم يعد لديه نمط اختيار وصل شق.
- نحو 1,000 سطر readline اختبار وحدة مع ذلك سلوك واحد بدء حذف؛readline نص سجل لغة قاعدة من كل بوابة في إزالة فقد.
- هذا قرار يحل محل [fold the stdio UI helper](2026-07-04-fold-stdio-ui-helper.md) تحزيم جزء (يتم طي حزمة الآن قد حذف) ، و إصلاح حجز [TUI قبل طرف Agent Note](../feature/2026-07-17-dedicated-full-screen-tui-front-door.md) وصف تركيب (لم يعد لديه `auto` اختيار؛`tui-agent` يملك تحرير رمز تركيب).

# Agent Note: pwsh UI presentation matches bash

Status: implemented
Archived: 2026-09-04

[English](2026-08-05-pwsh-ui-bash-parity.md) | العربية

## Problem

[pwsh أداة و bash مقابل متساو قرار](../../implemented/feature/2026-08-02-pwsh-tool-bash-parity.ar.md) يجعل `dsh-tool-pwsh` في تنفيذ،marker و خلفية مهمة فوق سلوك يمكن متبادل تبديل، لكن واضح دفع متأخر موجه إلى شخص صنف واحد نصف: إتمام pwsh قبل منصة استدعاء عرض لـ عام `console` محيط شريط بطاقة، بينما bash أداة إتمام استدعاء عرض لـ حمل تحليل خروج حالة pill terminal بطاقة. مسؤول حل قرار هذا نقص فتحة مسار خط رسم ([Windows افتراضي تعديل استخدام pwsh](../../implemented/feature/2026-08-01-windows-pwsh-default.ar.md)) يأخذ «pwsh TUI/GUI تصيير» صف لـ مرحلة مقطع 2، لكن TUI حزمة قد يتم إزالة، جعل Web جدول وجه يصبح هذا نقص فتحة وحيد أثر UI.

## Decision

`dsh-tool-pwsh` `presentResult` الآن تدريجي استدعاء مرآة مثل `dsh-tool-bash`: إتمام قبل منصة نتيجة هو `terminal` بطاقة، إخراج متن لـ ذهاب marker تصيير نص، خروج حالة pill لـ تحليل خروج `exitCode`/`signal`؛ خلفية ack و `isError` نتيجة إبقاء عام `console` محيط شريط بطاقة؛ غير مفرد واحد نص كتلة نتيجة إبقاء ثابت (`undefined`).

تحليل هو مشترك بينما غير نسخ:`parseExitStatus`/`ParsedExitStatus` من `dsh-tool-bash` خاص render وحدة نقل دخول `@deepseek-ai/dsh-shell` Service Definition حزمة (من ذلك index توجيه خروج) ،`dsh-tool-bash` `render.ts` مجددا توجيه خروج هو، جعل مصدر مستو وجه مستهلك إبقاء مفرد واحد استيراد أصل. اثنان عدد أداة مصير إرسال خروج نفسه `[exit code: N]` / `[killed by signal: X]` marker، لذلك واحد من Service Definition يملك عكس تحليل دائم بعيد لن في توأم توليد بين عائم نقل——و [shell-env سحب أخذ](../../implemented/feature/2026-08-02-pwsh-tool-bash-parity.ar.md) معالجة `DSH_*` سجل التسجيل وقت نفسه «مشترك بينما غير نسخ» شكل.

Web UI بطاقة ذاته لا حاجة أي حسب أداة تحرير كتابة شفرة: عميل terminal بطاقة جسر وصل (`dsh-client-ui-conversation` `terminal-card-model`) خريطة مهمة معنى `card: 'terminal'` نتيجة عرض، لذلك pwsh presenter تغيير مباشر تدفق مرور bash قد لديه نفس تصيير مسار. طي أداة سطر لديه واحد موضع عميل تصنيف بند:`classifyTool('pwsh')` الآن عودة دخول shell بيت عائلة سطر (`bash` variant، ذاتي لديه `Pwsh` عنوان) ، بينما غير عام `others`«Tool call» سطر. واحد بند keyless متصفح عبر طريق (`apps/web/tests/pwsh-terminal.e2e.ts`) مسبق وضع واحد جلسة، ذلك pwsh استدعاء/نتيجة في إعادة تشغيل وقت من حقيقي أداة عرض (api-proxy من قد سجل args/result محتوى إعادة حساب حساب عرض) ، و تثبيت إقامة terminal بطاقة golden، يشمل خروج pill و تشغيل حالة نقطة.

## Alternatives considered

**من `@deepseek-ai/dsh-tool-bash/src/render.ts` استيراد `parseExitStatus`.** مرفوض:workspace استيراد في بناء ناتج في إبقاء خارجي مرجع، لذلك `tool-pwsh` سوف في كل مستهلك إغلاق حزمة في إضافة جديدة مقابل `tool-bash` صلب وقت التشغيل اعتماد (يشمل لحظة معنى فقط تعليق pwsh توأم توليد، لا تعليق bash تركيب) ، كما أخ أخ أداة لـ واحد دالة بينما اعتماد ذلك توأم توليد سوف قلب قلب حزمة بين علاقة.seam ترحيل يأخذ مشترك اتفاق وضع في اثنان عدد أداة هذا حينئذ اعتماد حزمة فوق.

**جديد بناء مخصص استخدام عرض حزمة (مثل `@deepseek-ai/dsh-shell-present`).** مرفوض: لـ واحد صاف دالة جديد بناء حزمة يلزم دفع خروج manifest(بيانات وصفية بيان) ،module-graph/دليل مجددا توليد و README محتوى صار هذا؛`@deepseek-ai/dsh-shell` قد في اثنان عدد أداة إغلاق حزمة في، كما قد يملك هذا تحليل إعادة بناء `ShellRunResult` واقع.

**يأخذ تحليل نسخ دخول `tool-pwsh` render وحدة (رقم ثلاثة عدد توأم توليد).** مرفوض: نسخ نص اتفاق نقص قليل مشترك تنفيذ حينئذ سوف عائم نقل ([pwsh أداة و bash مقابل متساو](2026-08-02-pwsh-tool-bash-parity.ar.md)) ؛ تحليل و marker إرسال خروج يجب في نفس موضع مشترك نفس عرض تحويل، بينما تحليل تماما تماما هو UI pill اعتماد اتفاق.

## Consequences

- استخدام `dsh-tool-pwsh` Windows تركيب الآن في Web UI في عرض shell استدعاء و bash استدعاء تماما متسق:cwd رأس terminal بطاقة، أصلي إخراج، خروج حالة pill، تشغيل حالة نقطة، و غير صفر خروج وقت أحمر لون فشل معالجة.
- `parseExitStatus` يصبح `@deepseek-ai/dsh-shell` عام اتفاق واحد جزء؛`dsh-tool-bash/src/render.ts` متابعة مجددا توجيه خروج هو،bash أداة مستهلك صفر تعديل.
- مسار خط رسم مرحلة مقطع 2 استلام ضيق:TUI قد إزالة (EOL) ، مقابل terminal بطاقة الآن قد في Web جدول وجه تسليم.Windows افتراضي تركيب (مرحلة مقطع 1) ما زال هو لم إتمام مرحلة مقطع.
- تحقق:`dsh-shell` في تدريجي ملف نسبة التغطية بوابة تحت يملك تحليل حد حالة استخدام؛`tool-pwsh` presenter طقم عنصر مرآة مثل `tool-bash` (جاف صاف/غير صفر/إشارة/مهلة نحو إرجاع، شكل يشبه marker إخراج، خلفية/خطأ عام بطاقة، كثير كتلة رجوع) ؛ عميل سطر نموذج طقم عنصر تثبيت إقامة `Pwsh` shell بيت عائلة سطر؛web `pwsh-terminal` عبر طريق هو تجميع بعد keyless مشهد.

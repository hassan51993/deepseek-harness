# Agent Note: Windows افتراضي تعديل استخدام pwsh

Status: implemented
Archived: 2026-09-04

[English](2026-08-01-windows-pwsh-default.md) | العربية

## مشكلة

harness تسليم تنفيذ رسم مثل في كل منصة كل هو bash أولوية.Windows رئيسي آلة يجب تثبيت bash وسادة قطعة (WSL أو Git-Bash) ، أو تراجع عودة إلى فقط POSIX `dsh-bash-local` سلوك (صلب تحرير رمز `bash -c` argv، عملية مجموعة دلالة) ؛ موجه إلى نموذج bash أداة تعليم هو bash جهة قول.Windows أصلي أساس أساس قد مع [pwsh منفذ و أداة قرار](2026-08-01-pwsh-tool-and-executor.ar.md) تسليم——`ctx.shell` seam PowerShell تنفيذ و مقابل انتظار `pwsh` أداة——لكن تسليم تركيب في Windows فوق ما زال تركيب bash مكدس، لا يوجد وسادة قطعة Windows رئيسي آلة ركض لا تسليم shell.

## قرار

بدء تسليم profile(`dsh web`،`dsh --profile headless`، مرة صفة مهمة) Windows رئيسي آلة افتراضي نيل نيل PowerShell مكدس؛POSIX رئيسي آلة ثابت.

- **base patch في ذاته سطر فوق حسب منصة باب تحكم اثنان عدد shell مكدس**([loader `disabled` إدراج قيمة](../architecture/2026-08-11-loader-entry-disabled-interpolation.ar.md) note سجل هذا آلية و منصة طبقة طي):`bash-sandbox`/`tool-bash` يحمل `disabled: !!js process.platform === 'win32'`(bash لا يوجد Windows runner) ، هو جمع توأم توليد سطر `pwsh-sandbox`/`tool-pwsh` بـ أخذ عكس جدول بلوغ صيغة فقط في win32 تركيب——نفس نسخة patch ملف، كل مضيف تماما جيد تركيب واحد shell مكدس. تلقي حد pwsh مكدس تشغيل في ACL تلقي حد أمر لوحة runner لـ فوق، إذن وجه و POSIX تماما متسق ([Windows ACL تلقي حد أمر لوحة صندوق رملي](2026-08-08-windows-acl-restricted-token-sandbox.ar.md) note يملك هذا بيان). تغطية تسليم افتراضي هو تركيب قرار: انحراف جيد bash مكدس أو لا حد حق pwsh منفذ Windows رئيسي آلة عبر ذلك profile أو home `cordis.patch.yml` تغطية هذه سطر (bash استعادة إعداد جهة يجب كامل: منع استخدام `pwsh-sandbox`/`tool-pwsh` و إعادة تفعيل `bash-sandbox`/`tool-bash`——اثنان عدد منفذ بيت عائلة تسجيل نفس عدد `bash` خدمة، إعداد جهة لا كامل سوف في تحميل وقت fail loud)——تركيب إعداد هو وحيد تغطية عبر طريق. مستقل `windows.cordis.patch.yml` طبقة و بدء جهاز `apps/cli/src/windows-shell.ts` حقن قد حذف؛ هذا طبقة فقط بسبب بند بيانات وصفية هو ساكن حالة بينما وجود.
- **بارد بدء وحدة تحليل قد استعادة.** profiles إعادة بنية يأخذ pwsh حزمة من `apps/cli` اعتماد إغلاق حزمة في حذف إسقاط،`healProfilesModuleFallback` لذلك من لم يأخذ هو جمع رابط دخول `$DSH_HOME/profiles/node_modules`، جديد Windows رئيسي آلة تحليل لا إلى pwsh سطر.`apps/cli` و `dsh-base` إعلان `dsh-pwsh-sandbox`/`dsh-tool-pwsh`، منفذ اعتماد سلسلة توفير `dsh-pwsh-local`؛ حسب مستودع معتاد مثال،base bundle يأخذ كل سطر إضافة كل صف لـ اعتماد.

pwsh GUI تصيير قد مع [pwsh UI عرض و bash مقابل متساو قرار](2026-08-05-pwsh-ui-bash-parity.ar.md) أولا سطر تسليم؛[pwsh أداة و bash مقابل متساو قرار](2026-08-02-pwsh-tool-bash-parity.ar.md) تسليم أداة جدول وجه. هذا قرار لا تغيير أي POSIX سلوك.

## تجهيز اختيار خطة

**في `dsh-bash-local` داخلي يجعل Windows افتراضي pwsh(واحد منفذ، جهة قول فتح صلة).** مرفوض، إدارة من و منفذ قرار مرفوض نمط فتح صلة نفسه: منفذ هوية حينئذ هو هو spawn shell، بينما حسب منصة باب تحكم تركيب هو نشر اختيار، لا هو منفذ إعداد.

**من `apps/cli` شفرة بينما غير bundle بيانات ملف تسليم منصة طبقة.** مرفوض:patch ينبغي وضع في هو استبدال سطر جانب حافة، يخص يملك هذه سطر bundle، يجعل تسليم بيان بصفة تركيب بيانات إبقاء مرئي، تحويل تخزين حمل لديه خروج موضع؛ بدء جهاز فقط مساهمة win32 باب تحكم.

**في Windows لا يوجد عزل runner وقت إبقاء `permission`/`ui-permission`.** الأكثر أول تسليم وقت مرفوض:`dsh-permission-presets` صلب صفة اشتراط `ctx.shell.sandboxMode`، و في لا حد حق منفذ فوق تحميل وقت fail loud. لاحق ACL runner إزالة حذف هذا قبل رفع، لذلك حالي بيان إبقاء هذا اثنان سطر.

**في Windows لا يوجد OS runner وقت إبقاء fs مسار قاعدة حد.** الأكثر أول تسليم وقت مرفوض: لا حد حق shell يمكن التفاف مرور فقط حد fs مسار قاعدة. حالي ACL runner استخدام نفس سياسة قيد shell و fs مزود، لذلك هذا بند يتم مرفوض نصف حد قد لا هو حالي تسليم شكل.

**تسليم `DSH_WINDOWS_SHELL` بيئة متغير هروب توليد باب.** مرفوض: قرار صفة سلوك تغيير ينبغي تجميع في في تركيب إعداد في، بينما تركيب إعداد قد قدرة حسب سطر id تغطية منصة طبقة؛ ثاني بند تغطية عبر طريق سوف قسم شق بيان قرار مفرد واحد واقع مصدر.

## عاقبة

- تشغيل تسليم إصدار `dsh` جدول وجه Windows رئيسي آلة بلا حاجة إعداد أي نيل نيل تلقي حد `pwsh` بصفة shell أداة،PowerShell بصفة `ctx.shell` منفذ؛ ذلك داخل نموذج مرئي بيان في لا يوجد `bash`. في Web جدول وجه،shell أداة سطر قدوم ذاتي جلسة مسبق ضبط ([loader `disabled` إدراج قيمة](../architecture/2026-08-11-loader-entry-disabled-interpolation.ar.md) note يملك one-plane آلية): كل shipped مسبق ضبط إعلان `tool-pwsh`(بـ `process.platform !== 'win32'` باب تحكم) و ذلك توأم توليد سطر `tool-bash`(أخذ عكس جدول بلوغ صيغة) ، لذلك مسبق ضبط طبقة كل منصة مضيف تماما جيد كشف واحد shell أداة.
- Windows أمر و fs عملية مشترك استخدام صندوق رملي سياسة، إذن تبديل جهاز و approval خدمة.ACL runner حد كتابة، لكن تقرير إبلاغ `enforcement: 'partial'`؛ صريح `danger-full-access` ما زال هو نيل دقيق التفاف مرور طريقة، بينما غير منصة افتراضي.
- POSIX رئيسي آلة مثل معتاد تركيب bash مكدس؛pwsh سطر بـ ذلك ذاته باب تحكم جدول بلوغ صيغة موضع في منع استخدام حالة——نفس نسخة مشترك patch ملف صف خروج اثنان عدد مكدس، كل سطر ذاتي ذات قرار تركيب.
- انحراف جيد bash مكدس Windows رئيسي آلة (مثال مثل PATH فوق لديه WSL/Git-Bash وقت) عبر ذلك profile أو home `cordis.patch.yml` تغطية تسليم سطر——منع استخدام `pwsh-sandbox`/`tool-pwsh` و إعادة تفعيل `bash-sandbox`/`tool-bash`(اثنان عدد منفذ تسجيل نفس عدد `bash` خدمة، إعداد جهة لا كامل سوف في تحميل وقت fail loud)——تركيب إعداد هو وحيد تغطية عبر طريق.

## تحقق

- وحدة:`apps/cli/tests/windows-shell.spec.ts` عبر بدء الذي استخدام patch حساب قاعدة تركيب حقيقي تسليم bundle طبقة (من تطبيق تثبيت تحليل dsh-base + dsh-web-app) ، ثابت كل منصة صالح بيان——win32 pwsh بيان،POSIX bash بيان و base-only profile——خارج إضافة مسبق ضبط درجة shell أداة باب تحكم (`tool-bash`/`tool-pwsh`) و بارد بدء تحليل إغلاق حزمة؛`packages/bundle/base/tests/base.spec.ts` ثابت أربعة عدد shell سطر مقابل تسمية `!!js` منصة باب تحكم، و تأكيد لم يعد تسليم مستقل منصة patch.
- Keyless:`dsh --profile <name> --dump-config` في نفس نسخة مشترك patch طبقة في عرض اثنان عدد مكدس، كل سطر بـ ذاتي ذات `disabled` جدول بلوغ صيغة في تركيب وقت قرار بيان.
- حقيقي تركيب خطر دخان في win32 فوق بدء web profile،pwsh مكدس تركيب نجاح (أي هذا قلم تسجيل وصف تأكيد قطع بيان).

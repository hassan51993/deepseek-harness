# Agent Note: Web UI abbreviates POSIX home paths as `~`

Status: implemented
Archived: 2026-08-22

[English](2026-08-18-web-home-path-tilde.md) | العربية

## Problem

Workspace معلق توقف بطاقة و Tool استدعاء ملخص سوف عرض كامل POSIX بيت دليل مسار. هذه نص جدا طويل، كل سطر تكرار نفس بادئة، جانب حافة شريط و محادثة سجل أكثر صعب مسح قراءة.Windows مسار يجب إبقاء أصل مثال، لأن `~` لا هو Windows نظام الملفات اتفاق.

## Decision

`host.describe` يأخذ مضيف حساب مستخدم `home` بصفة لا بد ملء حقل فوق تقرير.Client و Host واحد نفس إصدار، لذلك هذا حقل هو لا بد ملء بينما لا هو اختياري.ApiProxy في describe وقت استخدام `homedir()` ملء دخول.

`dsh-client-runtime` في `abbreviateHomePath` هو فقط لأجل عرض مساعد مساعدة دالة. عند مسار هو POSIX بيت دليل أو ذلك بعد بديل وقت إرجاع `~` أو `~/…`؛`home` ناقص، لـ فارغ أو لـ `/`، مهمة واحد جانب هو Windows قرص رمز أو UNC مسار، أو فقط هو بادئة أمر في (`/Users/u` لا يستطيع استلام مشي `/Users/u2`) وقت، مسار إبقاء ثابت.Tool ملخص أولا فعل مساحة العمل متبادل مقابل تقليص قصير، مجددا استدعاء هذا مساعد مساعدة دالة، لذلك جلسة cwd داخل مسار ما زال أكثر قصير.`filePath`،Host فتح و Workspace معلق توقف نسخ ما زال استخدام عمل من إعطاء خروج نظام الملفات مسار.

`ui-tool` و `ui-workspace` في كل منها slot تسجيل فوق حقن `connection.hostDescription`.ChatView لا زيادة Host وصف خطاف. هذا حقل في `ConnectionHandle` فوق هو لا بد ملء؛ اختبار زائف كائن توفير واحد مصدر، ذلك لقطة في اتصال إتمام قبل يمكن لـ undefined.

fixture Host بيت دليل هو `/home/fixture`. ثاني عدد fixture Workspace يقع في `/home/fixture/Documents/project`، تجميع إعادة تشغيل يمكن معلق توقف خروج `~/Documents/project`، بينما لا لا بد نقل حركة قائم `/tmp/fixture` حساب مستخدم.TerminalBlock ذاتي لديه تلميح رمز وسم طي إبقاء ثابت.

## Alternatives considered

**في لا يوجد حقيقي home حال حال تحت تخمين قياس `/Users` أو `/home`.** مرفوض، لأن مشترك بادئة لا هو حساب مستخدم بيت دليل،`/Users/shared` أو `/home/src` سوف يتم خطأ تقليص كتابة.

**نفس مثال يأخذ Windows `%USERPROFILE%` تقليص كتابة صار `~`.** مرفوض، لأن تحقق استلام قاعدة اشتراط Windows مسار إبقاء أصل مثال، بينما كما Explorer و `cmd` و لا هذا مثال تجميع كتابة هذه مسار.

**يأخذ مساعد مساعدة دالة وضع دخول `dsh-home-paths`.** مرفوض، لأن هذا حزمة في Node فوق توسيع إعداد داخل موجة موجة رقم؛ هذا مساعد مساعدة دالة هو متصفح عرض تعديل كتابة، لا يستطيع يأخذ Node `os` سحب دخول client حزمة.

**من ChatView owner props نحو تحت نقل تمرير `home`.** مرفوض، لأن هو سوف توسيع كبير conversation حقن وجه و كل واحد نسخة ChatView اختبار تجهيزة، بينما فقط لديه Tool و Workspace بطاقة إزالة استهلاك هذا عدد عرض واقع.

## Consequences

POSIX بيت دليل تحت Workspace معلق توقف مسار، و تقليص قصير cwd بعد ما زال سقوط في بيت دليل داخل Tool مسار ملخص، سوف عرض لـ `~`. نسخ و فتح ما زال استخدام كامل مسار.Windows قرص رمز و UNC مسار دائم بعيد لن تغيير صار `~`. إذا Host يأخذ `/` تقرير صار home، لن يأخذ كامل نظام الملفات استلام صار `~`. أول مرة describe قبل أو إعادة وصل خلال، مصدر لقطة لـ undefined، مسار إبقاء لم تقليص كتابة.

## Testing

حزمة اختبار تغطية `abbreviateHomePath`،`toolRowModel`/`readCardModel` بيت دليل تقليص كتابة،Workspace معلق توقف عرض و نسخ، و `host.describe` schema و فوري `homedir()`. تجميع إعادة تشغيل `apps/web/tests/home-path-tilde.snapshot.ts` معلق توقف fixture في يقع في بيت دليل تحت Workspace. موجه إلى منتج GUI PR ما زال يحتاج تسجيل صنع معلق توقف بطاقة حقيقي متصفح GIF.

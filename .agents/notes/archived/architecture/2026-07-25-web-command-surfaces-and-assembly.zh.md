# Agent Note: Web أمر عمل خدمة وجه و تركيب إعداد (ui-commands / ui-skill / ui-subagent)

Status: implemented
Archived: 2026-09-04

[English](2026-07-25-web-command-surfaces-and-assembly.md) | العربية

> نطاق: أمر دليل ذاكرة مؤقتة و ثلاثة نوع إرسال إرسال (ui-commands) ،popup اختيار تدفق،skill(تقنية قدرة) / subagent اثنان عدد مرجع مصدر،fixture(اختبار قبل وضع بيانات) أمر توجيه و تركيب إعداد تحقق استلام (slash-flow لقطة). تحمل تحميل wire رؤية[جلسة أثر مجال note](2026-07-25-web-client-session-scope-and-provide-channel.zh.md) ؛ إطلاق، قائمة مفرد و إدخال آلة جهاز رؤية[إدخال حالة آلة note](2026-07-25-web-input-machine-and-slash-pipeline.zh.md).

## مشكلة

خط الإنتاج حينئذ خيط لكن لا يوجد أمر معرفة تعرف سقوط نقطة:host جانب `ctx.commands` و `ctx.skills` كامل بينما web عبر طريق بلا أمر قدرة. عمل خدمة طبقة يلزم عودة جواب:

- أمر UI لا توقف واحد نوع شكل (عند ساحة تنفيذ، نابض اختيار إطار، عودة ملء بعد متابعة ضرب معامل)——عمل خدمة حزمة مثل أي صفر هيكل هيكل تعديل فوق هيكل؛
- دليل أي وقت سحب أخذ: كل مرة فتح قائمة مفرد الآن سحب جدا بطيء، معتاد إقامة ذاكرة مؤقتة حينئذ يلزم لديه بطلان و إعادة وصل لذا أمر؛
- جلسة بداية نهاية من agent(ذكي جسم) دعم دعم (Session+Agent نفس لحظة خروج توليد) ،client أمر وجه عبر ماذا عنوان وصول host تدريجي agent صالح دليل؛
- تركيب إعداد درجة تحقق استلام: تفكيك فتح كل طبقة دمج بدء قدوم، مستخدم مرئي رئيسي سلسلة مثل أي تثبيت إقامة.

## قرار

### ui-commands:`CommandUiRuntime` + حسب جلسة مفتاح تحكم `CommandDirectory` + تدريجي جلسة `PopupSelectController`

- إسقاط `ClientSessionContext { sessionId }` ذاتي حمل في ui-input-trigger اتفاق (types.ts): جلسة ثابت agent-backed، جلسة هوية أي أمر قدرة الكل إسقاط؛wire بـ `{sessionId}` بحث عنوان (`command.list` / `command.execute` متساو هو؛host من جلسة header تحليل Agent).
- دليل حسب `SessionId` قسم منطقة،per-key single-flight + epoch guard(قديم سحب أخذ دائم لا تغطية جديد حالة) ،`commands/changed` كل key لين بطلان (قديم لقطة متابعة خدمة، خلفية إعادة سحب) ،`connection/reset` كل key صلب بطلان و مسبق حار،Enter يجب انتظار حالي key حينئذ خيط، فشل إبقاء مسودة مسودة لا تخفيض. مسبق حار تعليق source `warm` خطاف——scope خروج توليد وقت مقابل كل roster مرة، أي تغطية كامل جلسة دورة الحياة (جلسة قدرة ذاتي خروج توليد ثابت تحديد).
- `register(contribution)` تسجيل client أمر (descriptor + `available(projection)` + popupSelect spec) ؛ مرشح دمج صار = host دليل + contribution متاح صفة مرور ترشيح، مجددا مرور query/position،host/contribution إعادة اسم fail loud.
- أمر ثلاثة نوع حسب تسجيل وجه إرسال توليد، تطوير من لا إعلان موضع:host descriptor حمل `input` = **leadingInput**(عودة ملء `/name ␣` + claim، متابعة ضرب معامل، فقط حد سطر أول) ؛client تسجيل popupSelect spec = **popupSelect**(رسمي جهة اختيار إطار قشرة، عمل خدمة صفر مكون) ؛ اثنان من جميع بلا = **execute**(اختيار في أي تنفيذ، صفر UI).
- إرسال إرسال قرار جدول: قائمة مفرد يمكن إطلاق ثلاثة نوع؛Space فقط إقرار leadingInput(خطأ إطلاق منع خط: غير ممكن عكس فرعي أثر فقط إبقاء صريح مدخل) ؛Enter عار token عندئذ execute/فتح قشرة،leadingInput سعة تحمل ذيل مع معامل.
- `popupFor(actx)` popup:search محلي مرور ترشيح،select single-flight،open وقت التقاط إسقاط،onSelect نجاح عندئذ مرور consume-token حدث إزالة token، فشل إبقاء يمكن إعادة محاولة، جلسة تبديل فقط إخفاء.popup قشرة هو لحظة حالة طبقة (لا دخول حالة آلة): إطار حمل تركيز نقطة،Enter/↑↓/Escape عودة هو، نقطة إطار خارج أي dismiss(نقطة textarea معا عودة أيضا تركيز نقطة).

### مرجع مصدر (فقط رؤية إسقاط + ذاتي بيت apply إغلاق حزمة root ctx)

- **ui-skill**:`skills/list({sessionId})` حسب جلسة بحث عنوان (host من جلسة header تحليل مشروع أصل) ؛ دليل ذاكرة مؤقتة حسب sessionId مفتاح تحكم single-flight،`warm` خطاف خروج توليد مسبق حار،`connection/reset` كل صاف.pick إنتاج خروج text outcome(`/name ` أصل نص، صاف نص مرجع قرار) ؛`lexicon` من CatalogFetch settled لقطة إعطاء اسم تسجيل (لم حار `undefined`) ،`subscribeLexicon` في settle و بطلان وقت حسب جلسة إشعار استماع من. بلا match خطاف (مرجع لا دخول أمر قطع قرار).skill مرجع بـ أصل نص مع عادي نص التوجيه مشي (أمر مستو وجه خارج؛tool-skill ثابت، جلسة بادئة دليل توفير تنسيق عمل صلة ربط).
- **ui-subagent**: مرشح صفر RPC(sessions.list لقطة حسب parentId/running مرور ترشيح) ؛pick إنتاج خروج text outcome(`@name ` أصل نص) ؛`lexicon` نفس لقطة إرسال توليد،`subscribeLexicon` تحويل إرسال list store تغيير عبر طريق (نموذج جانب يمثل انتظار عمل خدمة قيام بند).

### fixture أمر توجيه و تركيب إعداد

- connection fixture تكملة أمر توجيه (fixture + fake-api):keyless منصة هيكل يمكن ركض كامل أمر تدفق (دليل، تنفيذ،popup اختيار).
- apps/cli تركيب إعداد تعليق الكل جديد حزمة؛tsconfig path map / reference تجميع تكملة متساو؛catalog/docs مع wire و حدث مجددا توليد.

### تركيب إعداد درجة تحقق استلام:slash-flow لقطة

`apps/web/tests/slash-flow.snapshot.ts` تثبيت إقامة مستخدم مرئي رئيسي سلسلة (assembled keyless، حزمة mock لا بديل تركيب إعداد بعد transcript(نص سجل)): بلا جلسة وقت composer منع استخدام → إنشاء Workspace و دخول قد فعلي جسم تحويل blank جلسة → `/` قائمة مفرد اختيار `/echo` leadingInput → أمر تنفيذ لكن blank موضع لا قلب تحويل، قائمة ما زال عرض `New Session` → أول بند عادي نص التوجيه نجاح تلقي إدارة بعد نفس سطر تحويل صحيح؛ نفس عدد جلسة ربط textarea في blank → active تحويل خلال إبقاء ثابت.`workspace-flow.snapshot.ts` آخر تثبيت إقامة blank سطر إنشاء/إعادة استخدام، أول بند نص التوجيه تعرض رفض بعد عودة ملء، و في إرسال خروج أول بند نص التوجيه قبل تبديل Workspace وقت draft عبر input machine نقل تشغيل كما قديم blank سطر إخفاء.

## سبق اعتبار بديل خطة

| ترك سجل | واحد سطر إدارة من |
|---|---|
| نص التوجيه داخل ربط إرسال إرسال (أمر نص مع رسالة دخول host تحليل) | خلط خلط أمر/رسالة مستو وجه؛ أمر تنفيذ مستقل في رسالة طابور صف هو قائم host دلالة |
| skill شيء تحويل لـ command جسر | skill ذاتي لديه دليل؛N قلم تسجيل هو التفاف مسار؛ وسم شكل صيغة يوم لكن تجنب فتح أمر مستو وجه |
| `skill.invoke` RPC | host بلا هذا عملية؛skill مرجع هو مع نص التوجيه عادي نص |
| جديد ContentBlock مرجع نوع | كل سلسلة مسار صار هذا (مهايئ/UI/ضغط (compaction)) ؛ نص أي حق ذات + بنية تحويل occurrence سجل قد كاف كاف |
| client كل حزمة ذاتي تقرير أمر دليل | host هو وحيد حق مصدر؛client فقط قراءة descriptor،`commands-changed` دفع بطلان |
| `requires: 'none' \| 'agent'` حكم آخر محور (agentless دليل + مزدوج عنوان استعلام) | جلسة ثابت agent-backed بعد اثنان استقرار أمر بلا owner؛ كامل محور ترك وضع، انتظار حق يحتاج طلب إعادة فتح |
| مخصص استخدام commandresult / commandpanel slot | نتيجة مشي notice؛popup قشرة هو هيكل هيكل داخل طفو طبقة؛ غني نتيجة بطاقة دخول منصة حساب |
| agent-type دليل فعل `@` مصدر | بلا نوع سجل التسجيل؛ فوري جلسة لقطة قد تغطية |
| PickAction/EnterCommand صنف عائلة (صنف وراثة pick ناتج) | عبر حزمة وقت التشغيل قيمة كسر تالف client bundle صاف درجة؛ صاف بيانات واجهة + إغلاق حزمة طريقة انتظار قيمة |

## عاقبة

- عمل خدمة أمر فوق هيكل = host تسجيل + client واحد قلم `command.register`(popupSelect) أو صفر تسجيل (execute/leadingInput تلقائي إرسال توليد) ، صفر هيكل هيكل تعديل؛ بديل قيمة هو ثلاثة نوع دلالة تجميع في في ui-commands، زائف تفكير رقم أربعة نوع معنى طعم حال تعديل هو.
- معتاد إقامة دليل ذاكرة مؤقتة + دفع بطلان تبديل قدوم قائمة مفرد صفر تأخير متأخر و عودة عربة قطع قرار يمكن اعتماد؛ بديل قيمة هو ثلاثة بند بطلان مسار (change لقطة، إعادة وصل،epoch guard) كل يحتاج اختبار تثبيت إقامة.
- sessionId بحث عنوان يجعل host per-agent صالح دليل (عام + scoped shadows) مباشر فوق wire،client أصل مثال عرض.
- معروف نقص حساب:popupSelect قشرة مؤقت بلا قد فوق هيكل عمل خدمة مستهلك (نموذج اختيار انتظار سوف مع host `selectModel` عمل بـ live-mutation شكل إلى قدوم، دورة وقت عمل وصل دخول مثال لوح) ؛ طابور صف ثاني سكين (تدريجي بند Inbox عملية) ، غني نتيجة بطاقة،roster يمكن إعداد صفة دخول منصة حساب انتظار إطلاق.

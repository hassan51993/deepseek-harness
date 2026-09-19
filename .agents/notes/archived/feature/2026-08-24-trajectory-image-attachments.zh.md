# Agent Note: Trajectory حفظ دائم صورة مرفق عنصر

Status: implemented
Archived: 2026-09-04

[English](2026-08-24-trajectory-image-attachments.md) | العربية

## Problem

Trajectory لا عرض جلسة صورة. حفظ دائم `{ type: 'image', attachment: ImageAttachmentRef }` كتلة في تفصيل حال وجه لوح داخل تصيير صار صيغة تحويل JSON، صاف صورة مستخدم رسالة في سجل جدول في هو واحد فارغ سطر.Trajectory وحيد إقرار تعرف صورة مسار هو مقابل داخل ربط wire حقل (`url`،`image_url`،base64 `data`) `imageSrc` شم استكشاف، بينما إنتاج حدث من لا يحمل هذه حقل: كل إنتاج جهة كل في حدث إلحاق قبل إيداع حفظ دائم `ImageAttachmentRef`. مستخدم لا يمكن من تنفيذ سجل تأكيد نموذج يرى أي ورقة رسم ([issue #2986](https://github.com/deepseek-harness/deepseek-harness/issues/2986)) ، بينما Chat قد قدرة عرض نفس مثال مرفق عنصر.

## Decision

- `ui-conversation` يملك حسب جلسة حفظ دائم صورة URL ذاكرة مؤقتة.`HistoricalImageCache` من `ui-chat` نقل دخول `packages/client/ui-conversation/src/client/conversation/historical-images.ts`، بـ `ctx.uiConversation.imageUrl(sessionId, attachment)` توفير.Chat و Trajectory عبر نفس نسخة تحليل، لذلك واحد جلسة مرفق عنصر فقط إنتاج مرة `session.attachment` قراءة و واحد متصفح URL، و مع Session binding تحرير بينما سحب إلغاء. هذا جزء يحل محل [client Session/Conversation كل حق](../architecture/2026-08-20-client-session-conversation-ownership.zh.md) في سجل `ui-chat` ذاكرة مؤقتة ملكية.
- رسم ممر owner عقد نحو (`MessageImagesOwnerProps`،`RenderMessageImages`) نقل دخول `ui-conversation` عميل عقد نحو.`ui-chat` `conversation.message.images` SlotMap سطر امتداد استخدام مشترك owner نوع؛`ui-trajectory` بـ نفس owner نوع إعلان ذاتي ذات فرعي مجرى موضع `conversation.trajectory.images`؛`ui-attachment` يأخذ نفس عدد `MessageImages` رسم ممر مكون تسجيل دخول اثنان عدد مفتاح، لذلك تحميل، إعادة محاولة و مصباح صندوق سلوك في اثنان عدد عرض في تماما متسق.
- `TrajectorySourceBlock` بـ `attachment?: ImageAttachmentRef` يحل محل `imageSrc`/`imageAlt`. داخل ربط مصدر شم استكشاف (`sourceImage`،`safeImageSource`) و Trajectory محلي `PanelImage` مصير واحد و حذف: لا يوجد إنتاج جهة نحو جلسة سجل كتابة داخل ربط صورة بايت أو URL، هذه مسار هو ميت شفرة، كما issue واضح ترتيب حذف فوق نقل مصدر مؤقت مسار.
- محتوى يحتوي صورة لكن لا يوجد نص سجل، ذلك سجل جدول سطر بـ locale يحتفظ `layout.imageOnly` حساب عدد علامة ملاحظة؛ فقط يحتوي صورة أداة نتيجة ملخص أيضا استخدام نفس وسم، بينما لا هو JSON تحويل تخزين.
- تخزين و BFF متساو لا تعديل:`session.attachment` قد حسب جلسة سجل مرجع تخويل (ناقص، ضرر تالف و لم يتم مرجع مرفق عنصر صريح فشل و دخول رسم ممر إعادة محاولة حالة) ،sha256 محتوى بحث عنوان قد حفظ إثبات كل ورقة صورة فقط تخزين واحد نسخة.

## Alternatives considered

**إبقاء Trajectory ذاتي ذات `<img>` تصيير و تغذية إعطاء هو تحليل جيد URL.** هذا سوف تكرار `ui-attachment` قد يملك تحميل احتلال موضع، إعادة محاولة تحكم عنصر و مصباح صندوق، و و[أساس في slot مرفق عنصر كل حق](../architecture/2026-08-17-dynamic-client-render-and-attachment-ownership.zh.md) متبادل مقاومة لمس، هذا قرار قد رفض عبر إضافة مباشر import مكون.

**يأخذ `conversation.message.images` إعلان فوق رفع إلى مشترك أب درجة، يجعل اثنان عدد عرض تصيير نفس عدد مفتاح.** `renderSlot` نوع حد تحديد في إعلان مدخل ذاتي ذات children جدول داخل، نفس درجة `conversation.view` مدخل لا يمكن تصيير آخر عدد مدخل فرعي مفتاح؛slot registry أيضا رفض مقابل نفس مفتاح ثاني مرة إعلان. مشترك owner نوع ثاني عدد مفتاح هو تلقي دعم حمل تركيب طريقة، كما سماح رئيسي عنوان مستقل استبدال مهمة واحد رسم ممر.

**في حفظ دائم مسار خارج إبقاء داخل ربط `imageSrc` شم استكشاف.** كل إنتاج جهة (مضيف prompt admission،`read_image`،MCP إسقاط،ACP مدخل) كل في حدث إلحاق قبل إيداع حفظ دائم مرجع، شم استكشاف لن أمر في أي شرق غرب؛ إبقاء هو انتظار في إبقاء تحقق استلام معيار واضح ترتيب حذف غير حفظ دائم تصيير مسار.

**Trajectory ذاتي لديه صورة ذاكرة مؤقتة.** كل عرض واحد نسخة ذاكرة مؤقتة سوف مقابل نفس جلسة مرفق عنصر إرسال خروج تكرار `session.attachment` RPC و تكرار blob URL، مخالفة خلف"Chat و Trajectory مرجع نفس جلسة مرفق عنصر"اشتراط، كما لا يوجد أي استلام فائدة.

## Consequences

- اثنان عدد عرض مشترك استخدام واحد رسم ممر تنفيذ، صورة سلوك (مقياس قياس، إعادة محاولة، مصباح صندوق، نص سجل) لن في Chat و Trajectory بين عائم نقل، كما بلا نقاش كثير قليل عدد عرض عرض، واحد جلسة مرفق عنصر فقط قراءة مرة.
- `TrajectoryTable` حاجة يأخذ لا بد ملء `renderImages` prop تدريجي طبقة نقل دخول تفصيل حال مكون؛`ui-trajectory` إضافة جديدة مقابل `dsh-attachment` فقط نوع اعتماد،`ui-attachment` لـ جديد SlotMap سطر إضافة جديدة مقابل `ui-trajectory` فقط نوع اعتماد.
- keyless تجميع لقطة `apps/web/tests/trajectory-image-display.snapshot.ts` مباشر تثبيت إقامة مشترك ذاكرة مؤقتة هذا واحد واقع: تفصيل حال وجه لوح في صورة URL و Chat رسم ممر مقابل نفس fixture مرفق عنصر URL نص نفسه.

# Agent Note: New Session clears onto the empty-state launch

Status: implemented
Archived: 2026-07-26

[English](2026-07-24-new-session-clears-to-empty-state.md) | العربية

## Problem

جانب شريط «New Session» سوف قيام أي إنشاء و فتح فارغ أبيض جلسة، لذلك في بين شريط عرض حمل فارغ transcript(نص سجل) و معتاد إقامة composer `ConversationRoot`.Figma NEW SESSION شاشة (`EmptyState` + مشترك استخدام `InputBar` hero) فقط في `sessions.current` قد لـ undefined وقت تصيير، بسبب بينما رئيسي إنشاء تحكم عنصر لا يمكن وصول بدء صفحة.

## Decision

`SessionsService.clear()` صاف حذف حفظ دائم اختيار في بند و `list.current`. قمة طبقة جانب شريط إنشاء مدخل (بلا cwd `onCreate()`——New Session و New Workspace) استدعاء `clear()`، جعل `AppFrame` تصيير `conversation.empty`. فارغ حالة أول مرة إرسال ما زال مشي `conversation.startSession`(create → open → send) ، و إعادة استخدام و معتاد إقامة composer نفسه `InputBar` مكون (`variant="hero"`). حسب مشروع «+»(`onCreate(cwd)`) متابعة create-then-open، مباشر إلى فارغ حالة اختيار جهاز قدرة قبول مسبق ملء cwd.

## Alternatives considered

**لـ New Session إبقاء create-then-open، و في transcript لـ فارغ وقت في ConversationRoot داخل مجددا إضافة واحد طقم فارغ حالة chrome.** مرفوض: هذا سوف تكرار بدء صفحة InputBar، و كسر تالف empty→content اتفاق——نفس InputBar ينبغي نقل حركة موضع، بينما غير متبادل تبديل مكون.

**سوف New Session توجيه إلى اختيار في حالة خارج مخصص استخدام route أو slot.** هذا جولة مرفوض:`conversation.empty` قد يملك بدء UI؛ صاف حذف `current` أي هو قائم فارغ حالة فرع.

## Consequences

New Session في أول مرة إرسال قبل لم يعد إنشاء host جلسة.clear بعد إعادة تحميل ما زال توقف إبقاء في فارغ حالة. مشروع نطاق «+» ما زال قيام أي إنشاء.`EmptyState` حسب Figma كومة تراكم إنجليزي قوي منطقة (Input_Bottom 75:8208): سمك علامة + عنوان، بطاقة فوق جهة من Menu قيادة مساحة العمل chip، مجددا وصل مشترك استخدام `InputBar`(`variant="hero"`،max-width 800، و composer متسق r20 بطاقة——بينما غير أكثر عال r24 إنجليزي قوي منطقة) ، اختيار جهاز و بطاقة خلف بعد إقامة في فرش واحد طبقة لين ضوء بيضوي دائرة (figma 313:14109) ، عرض درجة حسب بطاقة قفل تحديد لـ `1051/776` asset مقارنة مثال، مع بطاقة تقليص وضع.Chip اعتماد 75:8208 لين و تفاعل hover ملء ملء و 12px دائرة زاوية، و فتح MenuDropdown(figma 122:9481؛`--dsw-specific-menu` + `--dsw-shadow-lv3`): حمل ملف مشبك رسم علامة و ذيل مع ربط اختيار basename سطر، قسم فصل خط بعد هو "New Workspace"، ذلك فرعي قائمة مفرد (figma 419:16920) توفير "Use a existing folder" و "Create new".Use a existing folder فتح مسار Dialog(figma 451:18655 copy — "Enter an existing folder path" / Open Folder) ، وضع في كل نظر فتحة حجب غطاء (`--dsw-alias-bg-mask-1` + `--dsw-mask-blur`) لـ فوق، و ضبط chip cwd.Create new فتح نفس طقم Dialog chrome، في `host.describe().cwd` تحت تسمية ملف مشبك؛ نجاح فإن مشي `sessions.createWorkspace` → host `session.create`(mkdir recursive)→ `sessions.open`، في جديد workspace في افتراضي سقوط تحت واحد جلسة.`InputBar` رسم صنع قاع شريط chrome(attach / Plan / Read-only / model) ، فقط استخدام محلي أصلي `<select>` حالة——host جانب plan،access،model وصل شق ما زال لم وصل خط.

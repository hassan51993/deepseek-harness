# Agent Note: جلسة عودة ملف (سجل التسجيل درجة عام تجميع دمج)

Status: implemented
Archived: 2026-09-04

[English](2026-07-31-session-archive-global-set.md) | العربية

## مشكلة

Sidebar workspace تصفح تصفح منطقة جلسة سطر قائمة مفرد داخل، «Delete session» واحد مباشر هو صاف نظر شعور احتلال موضع (بلا handler). منتج فتحة مسار تحديد لـ**عودة ملف**بينما غير حذف: جلسة سجل و workspace تسجيل حساب كل لا حركة، فقط يأخذ هذا جلسة من كل قسم مجموعة عرض (workspace قسم مجموعة،Ungrouped، بحث، مستو فرش قائمة) داخل إخفاء. عودة ملف سجل حاجة واحد سقوط نقطة:Ungrouped جلسة لا يخص أي workspace فعلي جسم،per-workspace حقل وضع لا تحت هو.

## قرار

**عودة ملف تجميع دمج هو workspace domain عام مفرد مثال (`workspaceDomainState.archivedSessionIds`) فوق واحد جديد حقل، تغطية في workspace تسجيل حساب لـ فوق؛ عرض مرور ترشيح الكل استلام جمع في client `tree.ts` إرسال توليد طبقة؛wire وجه مشي كل لقطة وضع حالة.**

- تخزين:`archivedSessionIds: z.array(sessionId).default([])`،domain version إبقاء 2——صاف إضافة جديدة حقل، قديم وسيط جودة مرور schema default تحليل لـ فارغ تجميع دمج، بلا ترحيل شفرة. يتم عودة ملف جلسة إبقاء ذلك `sessionIds` slot(لم قدوم إلغاء عودة ملف استعادة أصل موضع) ، لذلك و «واحد جلسة فقط يتم واحد workspace تسجيل حساب» ثابت صيغة صفر تصحيح التفاف.
- سجل التسجيل:`ctx.workspaceRegistry.archiveSession(id)` مشي `enqueueOperation` و create/delete سلسلة سطر؛ لم معرفة جلسة (فوري و حفظ دائم كل فحص لا إلى) رمي `WorkspaceUnknownSessionError`؛ قد عودة ملف id لا كتابة قرص لا إرسال حدث.`archivedSessionIds` getter كشف فقط قراءة تجميع دمج.
- RPC:`workspace.archiveSession({sessionId}) → {archivedSessionIds}`(ينبغي جواب تحديث بعد كامل تجميع دمج) ؛`workspace.list` استجابة يحمل تجميع دمج بصفة إعادة وصل أساس خط؛ جديد host لقطة `host/archived-sessions-changed` في كل مرة حمل دائم تغيير بعد دفع كامل لقطة (و `host/workspace-changed` نفس وضع حالة، من `domain/changed` global put فرع مقارنة مقابل دفع لقطة). لم معرفة جلسة إعادة استخدام رمز خطأ `session-not-found`.
- client وقت التشغيل:`WorkspaceListState.archivedSessionIds`(حسب Host ترتيب `readonly SessionId[]`، عضو ثابت لا تبديل مرجع——عام لديه لقطة حالة إبقاء store جذب محرك صاف بيانات مفردات:immer draft لا فتح MapSet إضافة حينئذ لا قبول Set؛membership استعلام في إرسال توليد دالة داخل ذاتي بناء مؤقت Set، و expandedProjects نفس بند) ؛list أساس خط،unary عودة صوت،changed لقطة ثلاثة مسار كل سوف استخدام كامل تجميع دمج كامل جسم استبدال قائم قيمة. إسقاط طبقة في حالي selection سقوط دخول عودة ملف تجميع دمج وقت موحد واحد صاف فارغ عودة New Session عرض (مستخدم التقاط لوح: عودة ملف حالي فتح جلسة سوف جعل رئيسي عرض عودة إلى hero)——واحد بند قاعدة معا تغطية محلي unary عودة صوت، أخرى وسم صفحة changed لقطة، و إعادة وصل أساس خط اكتشاف حالي selection قد في هذا client مغادرة خط خلال يتم عودة ملف حال شكل؛ لقطة/عودة صوت سقوط في in-flight `workspace.list` خلال وقت أيضا سوف شاشة حجب قديم أساس خط مقابل جديد تجميع دمج تراجع.
- UI: قائمة مفرد بند `delete`(visual-only) تعديل لـ `archive`(label«Archive session» ، غير danger مثال صيغة، بلا تأكيد محادثة إطار——غير كسر تالف صفة عملية، خطأ لمس عاقبة فقط هو قائمة إخفاء) ؛ مرور ترشيح تنفيذ لـ `tree.ts` `sessionVisible` حكم حسب إضافة واحد ملف،`deriveGroups`/`deriveFlat` زيادة `archived` تجميع دمج دخول مشاركة، أربعة عدد عرض (قسم مجموعة حلقة،stray التقاط قاع، بحث، مستو فرش) نفس مصدر توليد فاعلية.

## قد اعتبار بديل خطة

**per-workspace archivedSessionIds(الأكثر أول جدول وصف).** مرفوض:Ungrouped جلسة بلا سقوط نقطة؛ مستخدم تعديل فتحة عام.

**SessionSummary ضرب archived علامة (session.list طبقة).** مرفوض: يلزم يأخذ workspace domain واقع join دخول sessions domain إسقاط،summary بلا زيادة كمية لقطة أيضا نيل آخر إرسال إشعار، عبر مجال اقتران دمج كبير في استلام فائدة.

**host جانب في `workspaceView`/`sessionIds` getter مرور ترشيح.** مرفوض: عودة ملف ≠ تعديل تسجيل حساب، إسقاط مرور ترشيح سوف يأخذ اثنان عدد عام فكرة خلط كلي؛ لم قدوم استعادة مدخل أيضا حاجة client أخذ إلى كل كمية تسجيل حساب.

**زيادة كمية لقطة (archived/removed مفرد بند).** مرفوض: تجميع دمج أقصى صغير، تغيير تردد معدل منخفض، كل لقطة تجنب ذهاب client جانب دمج منطق و ذهاب إعادة حالة، و workspace-changed قائم وضع حالة متسق.

## عاقبة

عودة ملف بعد UI بلا فحص نظر/إلغاء عودة ملف مدخل (هذا مدة فتحة مسار، سجل في README Known Limitation في) ؛ بيانات و slot تمام جيد، لاحق إضافة استعادة وجه فقط هو UI + واحد عكس نحو RPC.`workspace.list` استجابة شكل حالة تغير هو pre-release مباشر تعديل (بلا توافق طبقة).e2e(workspace-management) تثبيت إقامة «عودة ملف→سطر إزالة فقد→reload بعد ما زال إخفاء، سجل ما زال في» كل سلسلة مسار؛domain طبقة اختبار تثبيت إقامة قوة انتظار، لم معرفة id رفض، عبر إعادة بدء استعادة و قديم وسيط جودة افتراضي ترقية.

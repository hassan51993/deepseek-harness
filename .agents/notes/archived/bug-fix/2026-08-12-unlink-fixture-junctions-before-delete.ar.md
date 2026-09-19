# Agent Note: تمرير عودة حذف قبل أولا حل سلسلة fixture junction

Status: implemented
Archived: 2026-09-04

[English](2026-08-12-unlink-fixture-junctions-before-delete.md) | العربية

## مشكلة

install-lefthook و translation-pairing fixture يأخذ مستودع حقيقي `scripts/`،`node_modules` و tsx حزمة دليل استخدام junction سلسلة دخول fixture شجرة، يجعل installer استكشاف قياس قدرة اختراق نفاذ تحليل.Windows تمرير عودة حذف ممكن يأخذ junction(MOUNT_POINT إعادة تحليل نقطة) عند عمل دليل و تتبع مع دخول ذلك هدف؛Git `worktree remove` صحيح هو هذا مثال حذف إسقاط مستودع يتم تتبع أثر `scripts/` و tsx حزمة (أمر لذا إدراج وتد يأخذ حذف تحديد موضع إلى هذا واحد خطوة). لذلك، معلومة مهمة حذف جهاز fixture تنظيف حذف إسقاط هو مستودع ذاتي ذات شفرة المصدر، بينما لا هو fixture.

## قرار

`scripts/test-fixture-cleanup.ts` يملك junction أمان fixture تفكيك حذف:`unlinkFixtureLinks` أولا مرة تاريخ و حل سلسلة كل إعادة تحليل نقطة،`removeFixtureSafely` مجددا حذف قد بلا رابط شجرة (حمل Windows مختلف خطوة جملة مقبض إعادة محاولة). كل تلقي أثر `afterEach` و `worktree remove` قبل خطاف كل استدعاء هو. عام قاعدة سجل في `docs/defensive-patterns.md`: رابط شكل مسار استخدام unlink حذف، تمرير عودة `rmSync` فقط إبقاء إعطاء تأكيد معرفة لـ حقيقي دليل مسار.

## اعتبار مرور بديل خطة

**فقط معلومة مهمة تمرير عودة حذف.** مرفوض: خاص تحديد حذف جهاز هل تتبع مع junction مع أداة و إصدار بينما مختلف، بينما `git worktree remove` هذا واحد بند مسار قد تحطيم تدمير مرور يتم تتبع أثر ملف؛ أي تنظيف كل لا هذا أخذ مستودع ذهاب مراهنة هذا عدد سلوك.

**نسخ بينما لا هو junction حقيقي دليل.** مرفوض:fixture معنى معنى حينئذ هو استخدام حقيقي محتوى استكشاف قياس حقيقي installer مسار، نسخ صنف سوف فقد ذهاب يتم قياس حد.

## عاقبة

fixture تفكيك حذف لم يعد قدرة اختراق مرور junction لمس و مستودع شفرة المصدر. مقدار خارج فتح إلغاء فقط هو مقابل صغير نوع fixture شجرة واحد مرة lstat/unlink. هذا عدد تحطيم تدمير بيانات نقص وقوع الآن في defensive-patterns قاعدة جانب لديه حفظ دائم سبب،helper أيضا هو لم قدوم كل junction fixture مشترك تفكيك حذف مسار.

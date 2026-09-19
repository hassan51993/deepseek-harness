# Agent Note: منطقة قسم Session حدث هوية و سجل انحراف نقل

Status: implemented
Archived: 2026-09-04

[English](2026-08-31-session-sequence-and-log-offset-brands.md) | العربية

## Problem

Session موضع سبق استخدام نفس عدد بنية تحويل `number` نوع جدول بلوغ اثنان نوع لا توافق يحتوي معنى. حدث مرجع إشارة نحو واحد بند قد وجود سجل، بينما بادئة طويل درجة، تحت واحد إلحاق موضع أو قراءة قطع نقطة إشارة نحو سجل بين فجوة، و كما يمكن انتظار في حدث مجموع عدد. لذلك، تحرير ترجمة جهاز سوف في حاجة حدث هوية موضع قبول انحراف نقل، أيضا لا يمكن كشف ترحيل وقت تسرب تعديل ترتيب رقم حقل.

`SessionHeader.seedLength` أيضا يأخذ v0 تخزين جلوس علامة خلط دخول بلا يجب قراءة متن metadata consumer. قائمة فقط حاجة معرفة طريق Session هل لديه fork lineage، فقط لديه معا يحتفظ حدث متن قراءة جهة عندئذ قدرة حل تفسير دقيق وراثة بادئة طويل درجة.

## Decision

`@deepseek-ai/dsh-brand` توجيه خروج تحرير ترجمة بعد إزالة فقد عدد قيمة أصل لغة `BrandedNumber<B>` و وقت التشغيل إبقاء أصل قيمة helper `brandNumber()`.`@deepseek-ai/dsh-session` يملك اثنان عدد مرور تحقق brand:`SessionSeq` إشارة واضح واحد بند قد وجود حدث،`SessionLogOffset` إشارة واضح سجل بين فجوة، بادئة طويل درجة أو قراءة انحراف نقل.`SessionSeqCursor = SessionSeq | -1` جدول بلوغ أول بند حدث قبل أو بعد إغلاق منطقة بين watermark،`OptionalSessionSeq = SessionSeq | null` جدول بلوغ سماح بـ ناقص لـ بيانات حدث هوية.

`SessionEvent.seq`،surface استبدال طرف نقطة،provenance و owner payload في إشارة نحو Session حدث حقل استخدام `SessionSeq`.`Session.seq`،`Session.firstLiveSeq`،`Session.inheritedEventCount`، حمل متن قراءة انحراف نقل و وراثة بادئة قطع نقطة استخدام `SessionLogOffset`. حساب فن نتيجة استعادة لـ عادي number، و عبر مقابل تحقق بنية صنع دالة إعادة دخول مهمة واحد مجال.

منطق `SessionHeader` يحمل `isSeeded: boolean`، لا يحمل عدد قيمة seed cut. يتضمن متن تخزين قيمة و observation في header جانب يحمل `inheritedEventCount`؛`Session.ownEvents()` و `Session.isOwnSeq()` نحو عادي consumer إخفاء مقارنة مقارنة.seeded constructor يجب صريح توفير seed و دقيق cut، يشمل cut لـ صفر فارغ seed، لأن constructor إدخال ممكن في وراثة بادئة بعد أيضا يتضمن child-owned setup event.

v0 JSONL header إبقاء بايت توافق: نقص قليل `seedLength` وقت حل رمز لـ `isSeeded: false` و صفر cut، وجود صفر أو غير صفر قيمة وقت حل رمز لـ `isSeeded: true` و مقابل دقيق cut. فقط header listing فقط تحويل حقل هل وجود.API،SDK،DeepSeek،telemetry،query row و JSON يمثل متابعة يحمل عادي number؛ من هو جمع كل منها adapter في قيمة دخول نفس عملية domain code وقت إتمام تحقق و brand.

## Admission and ownership

Domain constructor رفض سالب عدد، صغير عدد، غير لديه حد قيمة و غير أمان كامل عدد.parser تحقق أصلي number مرة؛brand لا حاجة وقت التشغيل wrapper وقت، إبقاء أصل تحليل كائن. تحرير ترجمة مدة brand لا يمكن اكتشاف خارجي حدث داخل لم معرفة عدد قيمة حقل؛ صيغة ترحيل ما زال يجب نيل نيل نفاد كل owner disposition، و رفض لا يمكن أمان تعديل كتابة schema.

`session/end-seed` ما زال هو lifecycle marker، لا هو وراثة cut مصدر. كل مرة constructor restore كل سوف إلحاق أو إبقاء هذا marker،unseeded replay أيضا واحد مثال، لذلك projection و cold reader سوف صريح استقبال `inheritedEventCount`، بينما لا هو مسح سجل.

## Alternatives considered

**متابعة يجعل كل موضع كل استخدام `number`.** رفض، لأن حدث هوية، حساب عدد و cursor قد تردد كثيف عبر تجاوز package و persistence seam، معنى خارج خلط استخدام هو ترحيل ريح خطر، بينما لا هو نطاق جزء حساب فن سهل فائدة.

**استخدام نفس عدد branded Session position جدول بلوغ هوية و انحراف نقل.** رفض، لأن هذا مثال ما زال سوف في حاجة قد وجود حدث موضع قبول `eventCount` أو `fromSeq`، أيضا سوف إجبار جعل `-1` و `null` sentinel دخول متبادل لا متبادل صلة عملية.

**من `session/end-seed` دفع توجيه وراثة cut.** رفض، لأن هذا marker سجل constructor lifecycle، و لا فقط سجل fork lineage، بينما كما constructor seed يمكن في وراثة بادئة بعد يتضمن child-owned event.

## Consequences

يحمل ترتيب رقم شفرة سوف واضح شرح واحد number إشارة نحو حدث أيضا هو بين فجوة. فقط header reader بلا يجب فتح متن يكفي أخذ نيل مستقر lineage metadata،persistence،projection،query و authorization path فإن إبقاء الذي يحتاج دقيق cut. مغناطيس قرص v0 صيغة و عام مشترك عدد قيمة wire ثابت.

بديل قيمة هو في durable و wire parser موضع صريح تحويل، و يجعل يحتوي متن observation يحمل مستقل دقيق cut حقل.Projection cache identity يتضمن lineage bit و دقيق cut، لذلك ذلك يمكن إسقاط storage domain سوف دفع دخول، قديم row حسب يحتاج إعادة بناء؛ لا يحتفظ cut فقط header reader سوف قفز مرور seeded cache hint.turn number،step number،message-list index،workflow member ordinal،token count و غير متصل عدد قيمة مجال إبقاء عادي number، لأن هو جمع لا إشارة نحو Session حدث.

## Testing

نوع تأكيد تثبيت إقامة `SessionSeq` و `SessionLogOffset` غير ممكن متبادل تبديل. وقت التشغيل suite تغطية constructor تحقق، خلط دمج وراثة و child-owned seed، فارغ seed،`ownEvents()` و `isOwnSeq()`،plain و Zstandard تحرير رمز في v0 JSONL ناقص/صفر/غير صفر header، فقط header listing،cold prepare و reopen،query و projection cut، و ثابت عدد قيمة wire قيمة.

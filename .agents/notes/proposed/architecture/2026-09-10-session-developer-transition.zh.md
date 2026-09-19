# Agent Note: Session تطوير من ترحيل قاعدة

Status: proposed

[English](2026-09-10-session-developer-transition.md) | العربية

## Problem

إعادة بنية عبر كثير عدد مرحلة مقطع. قديم نظام يجب حمل متابعة متاح، لكن لا دفع ترشيح جديد إضافة متابعة اعتماد أداة جسم `Session`،JSONL handle أو دورة الحياة حدث. تطوير من حاجة حسب branch حالة حكم قطع مواصفة مدخل.

## Proposal

ثابت واحد قلب ذكاء نموذج:**عبر `SessionService` نيل نيل `LogicalSession`، عبر ذلك عضو استخدام منطق جلسة؛ فقط لديه provider و تركيب أصل معرفة طريق شيء إدارة تنفيذ.**

| مرحلة مقطع | تطوير مواصفة |
|---|---|
| حالي master | ما زال حسب قائم عام API تطوير، لا زائف ضبط لم دمج stack قد إصدار. |
| مرحلة مقطع 1 بعد | جديد معامل، حقل، عودة ضبط و test double استخدام `LogicalSession`. قائم خارجي شفرة يمكن مؤقت وقت إبقاء deprecated `Session` استيراد و منشئ. |
| مرحلة مقطع 2 بعد | `ctx.sessions` يملك live registry و storage attachment؛Agent loop و إضافة لا حفظ persistence handle. |
| مرحلة مقطع 3 بعد | جديد تخزين تنفيذ `SessionStorageReader`/`Writer`؛ عادي وظيفة ما زال لا يأخذ storage عند عمل session API. |
| مرحلة مقطع 4–5 بعد | منطق جلسة يملك فوري كتابة و إسقاط؛ مستودع داخل شفرة لم يعد استخدام توافق آخر اسم. |
| طويل مدة | تركيب أصل اختيار session/service/storage/query provider؛ وظيفة حزمة لا بسبب provider أكثر تبديل بينما تغيير. |

### صيانة قاعدة

- إنشاء، استعادة،fork، صف رفع أو فحص بحث live session فقط استدعاء `SessionService`؛ لا يلزم صيانة ثاني نسخة registry.
- نيل إلى `LogicalSession` بعد فقط استخدام `header`،`id`،`seq`،`surface`،`append()`،`eventAt()`،`snapshotEvents()` انتظار عام عضو؛ لا يلزم تخمين قياس حدث عدد مجموعة أو داخل تخزين Map.
- حفظ دائم provider يملك صيغة، ترحيل، إيجار نحو،revision و شيء إدارة I/O؛ بحث، موحد حساب، عنوان، قبل طرف و telemetry استخدام منطق بروتوكول أو ذاتي ذات Service Definition.
- جديد provider عبر مشترك دمج نحو اختبار و من تركيب أصل صريح تسجيل. نواة قلب شفرة لا نيل حسب provider اسم فرع أو مسح حزمة.
- جديد شفرة لا نيل استخدام `SessionPersistence`،`ctx.sessionPersistence` و قديم handle/access/snapshot/revision اسم؛ مرحلة مقطع 5 في قديم مستهلك عودة صفر بعد حذف هو جمع.
- وثيقة و اختبار واضح علامة ملاحظة current،completed stage،target أو compatibility، لا يأخذ مسودة مسودة PR عند عمل قد إصدار سلوك.

عادي إضافة فقط إعلان مقابل `ctx.sessions` Cordis اعتماد، قبول و نقل تمرير `LogicalSession`، و استخدام ذلك عام عضو. قائم إضافة يمكن في ترحيل خلال إبقاء `Session`،`Session.create` و `Session.fromRestore`، لكن جديد شفرة استخدام منطق جلسة نوع و تنقل مغادرة factory. فقط لديه تنفيذ جديد خلفية إضافة عندئذ وصل لمس storage/query بروتوكول؛ هو بلا حاجة معرفة طريق افتراضي تنفيذ استخدام أي نوع داخل تخزين، حفظ دائم أو استعلام بحث جذب.

### معتاد رؤية عملية ترحيل

التالي هو هدف زائف شفرة؛ أداة جسم متاح طريقة بـ الذي في مرحلة مقطع نوع إعلان لـ دقيق.

```ts ignore-check
// Types: Session -> LogicalSession
function render(session: LogicalSession) {}

// Create/open: new Session(...) or storage.open(...) -> SessionService
const created = await ctx.sessions.create(options)
const opened = await ctx.sessions.open(id, options)

// Live lookup/list: private Map or file scan -> SessionService
const one = ctx.sessions.get(id)
const live = ctx.sessions.list()

// Identity/header: concrete fields or storage metadata -> logical session
const id = session.id
const header = session.header

// Events: session.events[index] or handle.read(...) -> logical session
const event = session.eventAt(seq)
const events = session.snapshotEvents(from, to)

// Model-visible history: local event folding -> canonical surface
const surface = session.surface

// Write: push(events) or direct JSONL write -> logical session
session.append(type, data, surfaceIntent)

// Projection: concrete lifecycle subscription -> projection port
ctx.sessions.registerProjectionPort(projectionPort)

// Titles, statistics, filters, full-text retrieval, and cold reads -> SessionQuery
const page = await ctx.sessionQuery.query(request)

// Fork: copy arrays or files -> SessionService
const child = await ctx.sessions.fork(session, boundary, childId)

// Durability: flush a handle directly -> SessionService
const durable = await ctx.sessions.flush(session)
```

### جديد مساهمة من كيف مثال فوق يد

1. أولا قراءة[مجموع تصفح](2026-09-06-logical-session-storage-rebuild.zh.md) ، إدارة حل وحيد هدف: منطق Session و كل شيء إدارة تنفيذ تماما حل اقتران.
2. مجددا قراءة[قدرة بروتوكول](2026-09-10-session-capability-protocols.zh.md) و حالي `docs/subsystems/session.zh.md`؛ قبل من هو هدف، بعد من هو الذي في branch حالي واقع.
3. حسب مرحلة مقطع ترتيب قراءة قراءة دخول درجة:1.1→1.2→1.3→1.4→1.5→2→3. لا يلزم فقط قراءة الأكثر بعد مرحلة مقطع diff بعد تعديل مقارنة مبكر مرحلة مقطع.
4. من واحد يملك واضح استدعاء جهة ترحيل بدء: تعديل نوع، تعديل مدخل، تكملة دمج نحو اختبار، و إثبات قديم مسار لا يوجد إضافة جديدة استخدام. دورة الحياة، صيغة أو فشل ترتيب تغير يجب مستقل صار مرحلة مقطع.
5. إيداع قبل تشغيل هدف اختبار، نوع فحص، وثيقة فحص و اعتماد فحص؛ في handoff كتابة واضح current،target،gap، تحت واحد حذف شرط و دقيق تأكيد branch/commit.

## Alternatives considered

**انتظار الكل مرحلة مقطع دمج بعد مجددا ترحيل إضافة.** رفض، لأن خلال إضافة جديدة أداة جسم اعتماد سوف توسيع كبير نهائي تنظيف وجه.

**دائم دائم إبقاء قديم اسم.** رفض، لأن مزدوج مدخل سوف يجعل وثيقة و نوع دائم دائم قسم تقاطع. مؤقت مدخل أداة لديه توافق اختبار، فقط لديه في نيل نيل خارجي ترحيل دليل بعد عندئذ قدرة عبر مستقل قرار إزالة.

## Acceptance criteria

- مرحلة مقطع 1 بـ فوق جديد شفرة بـ `LogicalSession` بصفة دفع ترشيح جلسة كائن و من `SessionService` نيل نيل هو؛deprecated `Session` مدخل متابعة توافق قائم خارجي شفرة.
- عادي إضافة لا استيراد أداة جسم provider؛ اعتماد باب فحص هذا قاعدة.
- مرحلة مقطع 5 قبل توافق مدخل لديه تغطية، قد تسمية قديم مستهلك و حذف شرط.
- جديد مساهمة من قدرة من مجموع تصفح، بروتوكول، حالي فرعي نظام وثيقة و مرحلة مقطع ترتيب تحديد موضع واحد أمان ترحيل مهمة.

## Risks

مختلف stack طبقة كشف مختلف API. تطوير من يجب بـ هدف branch لـ دقيق، لا يأخذ مرحلة مقطع 3 API عودة كتابة إلى مقارنة منخفض مرحلة مقطع.`LogicalSession` أيضا لا يستطيع امتصاص استلام لا يوجد ذاتي لكن ملكية بحث، موحد حساب أو I/O، تجنب تجنب تغيير صار جديد كبير كائن.

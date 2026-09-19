# فقط حد Session داخل Schedule

[English](schedule.md) | العربية

Schedule يملك حمل دائم رفع تنبيه؛ هذه رفع تنبيه سوف بصفة عادي لاحق محادثة جولة إرجاع أصل live Session.[حمل دائم Schedule Agent Note](../../.agents/notes/implemented/feature/2026-08-05-durable-web-schedule.ar.md) مسؤول حفظ دائم، دورة الحياة و نشط حركة حالة عرض،[صريح وقت منطقة حد](../../.agents/notes/implemented/simplification/2026-08-09-explicit-schedule-time-zone.ar.md) مسؤول متصفح محلي حل تفسير. هذا صفحة سجل [`packages/schedule/schedule/src/types.ts`](../../packages/schedule/schedule/src/types.ts) في حمل دائم بيانات شكل حالة و موجه إلى نموذج بيانات شكل حالة؛[حزمة README](../../packages/schedule/schedule/README.ar.md) مسؤول تركيب، أداة سلوك و تأكيد قطع رفع تنبيه framing.

## حمل دائم سجل

`ScheduleId` هو[صنف لوحة تحويل id](core.ar.md#branded-ids) ، في مفرد عدد Session داخل وحيد كما أبدا إعادة استخدام. إصدار 1 دعم حمل صحيح أمان كامل عدد `after_seconds` تأخير وقت، صريح قطعا مقابل `at` هدف، أو حتى قليل خمسة قسم ساعة أمان كامل عدد `every_seconds` بين فصل. إنشاء عملية سوف سوف كل ابتدائي هدف مواصفة تحويل لـ استخدام أربعة موضع سنة نسخة RFC 3339 UTC `scheduledAt`؛`after` سجل سوف إبقاء إيداع تأخير وقت،`at` سجل فقط تخزين نتيجة وقت نقطة،`every` سجل فإن إبقاء ثابت بين فصل و تحت واحد هدف.

```ts type-equiv
/** Durable one-shot reminder created from a positive delay. */
interface AfterScheduleRecord {
  /** Session-local stable identity. */
  readonly id: ScheduleId
  /** Rule discriminator for a delayed one-shot reminder. */
  readonly kind: 'after'
  /** Trimmed reminder content supplied at creation. */
  readonly prompt: string
  /** Positive safe-integer delay accepted at creation. */
  readonly afterSeconds: number
  /** Four-digit-year RFC 3339 UTC target. */
  readonly scheduledAt: string
}
```

```ts type-equiv
/** Durable one-shot reminder created from an absolute instant. */
interface AtScheduleRecord {
  /** Session-local stable identity. */
  readonly id: ScheduleId
  /** Rule discriminator for an absolute one-shot reminder. */
  readonly kind: 'at'
  /** Trimmed reminder content supplied at creation. */
  readonly prompt: string
  /** Four-digit-year RFC 3339 UTC target. */
  readonly scheduledAt: string
}
```

```ts type-equiv
/** Durable fixed-rate reminder whose next target remains creation-anchor-aligned. */
interface EveryScheduleRecord {
  /** Session-local stable identity. */
  readonly id: ScheduleId
  /** Rule discriminator for a fixed-rate recurring reminder. */
  readonly kind: 'every'
  /** Trimmed reminder content supplied at creation. */
  readonly prompt: string
  /** Fixed safe-integer interval, never below five minutes. */
  readonly everySeconds: number
  /** Earliest anchor-aligned occurrence not yet dispatched. */
  readonly scheduledAt: string
}
```

```ts type-equiv
/** One-shot record variants that terminate on an id-only dispatch. */
type OneShotScheduleRecord = AfterScheduleRecord | AtScheduleRecord
```

```ts type-equiv
/** The v1 durable reminder record union. */
type ScheduleRecord = OneShotScheduleRecord | EveryScheduleRecord
```

## قطعا مقابل وقت إدخال

`at` اختيار جهاز يمكن هو صارم إطار كما حمل انحراف نقل كمية RFC 3339 نص، أيضا يمكن هو دقيق محلي يوم تاريخ كائن. محلي شكل صيغة يجعل هذا نوع حل تفسير في أداة حد إبقاء صريح:

```ts type-equiv
/** Structured local-calendar input accepted by `schedule_create`. */
interface LocalAtInput {
  /** Four-digit ISO calendar date. */
  readonly date: string
  /** Local wall-clock time with optional one-to-three digit milliseconds. */
  readonly time: string
  /** Explicit UTC or IANA Area/Location zone. */
  readonly time_zone: string
}
```

```ts type-equiv
/** Absolute selector accepted by `schedule_create`. */
type AtInput = string | LocalAtInput
```

رسمي جهة Web overlay سوف لـ كل بند نص التوجيه أخذ مثال متصفح IANA وقت منطقة. عند open turn فقط لديه واحد بلا اختلاف معنى متصفح وقت منطقة وقت،Time-context سوف إبلاغ إبلاغ نموذج حسب هذا طلب محلي وقت منطقة حل تفسير لم واضح حد تحديد وقت منطقة ذاتي لكن لغة يوم مدة و وقت؛ متصفح وقت منطقة سجل خلط دمج أو ناقص وقت، فإن إبلاغ إبلاغ نموذج استفسار سؤال مستخدم. هذا إشارة جذب لا هو حمل دائم Session قيمة افتراضية: نموذج ما زال يجب في نص شكل صيغة في نقل دخول انحراف نقل كمية، أو في محلي شكل صيغة في نقل دخول `time_zone`؛Schedule أبدا سوف قراءة متصفح،Session، عملية أو نموذج سياق.

Schedule سوف رفض بلا فاعلية انحراف نقل كمية و وقت منطقة، لا حمل انحراف نقل كمية نص، غير لم قدوم هدف، و سقوط في صيف أمر وقت نقص فتحة داخل محلي وقت. لقاء إلى صيف أمر وقت إعادة تراكم وقت، سوف اختيار رقم مرة ظهور مقارنة مبكر وقت نقطة. إنشاء نجاح بعد فقط تخزين مواصفة تحويل بعد UTC `scheduledAt`، لذلك إعادة تشغيل أبدا اعتماد بيئة وقت منطقة حالة.

## ثابت سرعة معدل إدخال و تكملة تعويض

`every_seconds` هو كل بند سجل مفرد وحيد يملك كما حتى قليل لـ 300 ثانية بين فصل، بـ إنشاء وقت لـ مرساة نقطة. هو فقط توفير ثابت سرعة معدل تكرار ضبط درجة: بروتوكول لا يتضمن يوم تاريخ قاعدة أو Cron جدول بلوغ صيغة، تكرار ضبط درجة وقت منطقة، مشترك بارد لكن وقت أو عبر سجل دقيق دخول بوابة.

إذا واحد Session في كثير عدد هدف إلى مدة خلال موضع في cold أو busy حالة، واحد بند Every سجل فقط سوف مساهمة منها الأكثر جديد مرة إلى مدة إطلاق.dispatch سوف مباشر سوف سجل دفع دخول إلى dispatch حكم قطع وقت لحظة بعد رقم واحد و إنشاء مرساة نقطة مقابل متساو هدف، بينما لن قطعة رفع، حفظ دائم أو إعادة تشغيل خطأ مرور بين فصل. إذا تحت واحد هدف لا يمكن سقوط في أربعة موضع عدد سنة نسخة UTC نطاق داخل، الأكثر بعد مرة dispatch سوف نهاية ربط هذا سجل.

عند كثير بند ذاك هذا مختلف Every سجل متساو قد إلى مدة، كما لا يوجد مرة صفة رفع تنبيه إلى مدة وقت، كل بند سجل كل سوف نحو نفس عدد follow-up دفعة مرة مساهمة مرة إطلاق، و حسب هدف وقت و إنشاء ترتيب ترتيب صف. كل بند Every سجل حالة متبادل متبادل مستقل، لكن هذا نيل دقيق دفعة مرة في كل dispatch كل استخدام نفس عدد حكم قطع وقت لحظة. دفعة معالجة حد نموذج جولة عدد كمية؛ خمسة قسم ساعة تحت حد حد كل بند سجل timer تردد معدل.

## حمل دائم تغيير و إعادة تشغيل

إصدار 1 `schedule/change` جلسة حدث هو Schedule وحيد حمل دائم مرجعي.create حفظ كامل سجل،delete هو نهاية ربط صفة كما فقط يحتوي id تحويل. مرة صفة رفع تنبيه dispatch نفس مثال هو نهاية ربط صفة كما فقط يحتوي id.Every dispatch يحمل لأجل اختيار الأكثر جديد إلى مدة إطلاق جدار ساعة حكم قطع وقت لحظة، عبر معتاد دفع دخول نشط حركة سجل بينما لا نهاية ربط هو.dispatch يمثل follow-up قد تزامن دخول طابور، بينما لا يمثل نموذج جواب تكرار نجاح أو مستخدم قد قراءة جواب تكرار.

```ts type-equiv
/** Creates one durable reminder record. */
interface ScheduleCreateChange {
  readonly version: 1
  readonly operation: 'create'
  readonly schedule: ScheduleRecord
}
```

```ts type-equiv
/** Deletes one currently active reminder. */
interface ScheduleDeleteChange {
  readonly version: 1
  readonly operation: 'delete'
  readonly id: ScheduleId
}
```

```ts type-equiv
/** Records that one active one-shot reminder entered the durable dispatch history. */
interface OneShotScheduleDispatchChange {
  readonly version: 1
  readonly operation: 'dispatch'
  readonly id: ScheduleId
}
```

```ts type-equiv
/** Records one fixed-rate decision and advances directly past missed occurrences. */
interface EveryScheduleDispatchChange {
  readonly version: 1
  readonly operation: 'dispatch'
  readonly id: ScheduleId
  /** Wall-clock decision time used to select the latest due occurrence. */
  readonly acceptedAt: string
}
```

```ts type-equiv
/** Durable dispatch shapes supported by the current rule set. */
type ScheduleDispatchChange = OneShotScheduleDispatchChange | EveryScheduleDispatchChange
```

```ts type-equiv
/** Strict version-1 durable Schedule mutation union. */
type ScheduleChange = ScheduleCreateChange | ScheduleDeleteChange | ScheduleDispatchChange
```

صارم إطار decoder و fold سوف رفض لم معرفة إصدار، مقدار خارج حقل، إعادة استخدام id، لا مطابقة مرة صفة رفع تنبيه أو Every dispatch شكل حالة، و إبرة مقابل غير نشط حركة سجل delete أو dispatch تحويل. عادي Session طي كامل حدث تدفق.fork فقط طي دقيق `inheritedEventCount` موضع و ذلك بعد حدث، لذلك إبقاء تاريخ، لكن لن وصل إدارة أب Session نشط حركة رفع تنبيه.Projection ابتدائي تحويل سوف في غير ممكن تغيير header جانب استقبال هذا cut، إعادة استخدام مشترك transition، و حفظ دائم cut، نشط حركة سجل و قد استخدام id تاريخ، جعل ذاكرة مؤقتة استعادة متابعة إبقاء صارم إطار إعادة تشغيل.`schedule/change` إعلان و شفرة المصدر موضع أيضا تحرير دخول[حفظ دائم دليل](../persistence-catalog.ar.md#schedulechange--log-only).

## نشط حركة عرض و إدارة

أداة قيمة سوف حمل دائم سجل و أصل حسب حالي جدار ساعة إرسال توليد تسليم حالة تركيب بدء قدوم.`session-local` يمثل أصل Session يجب موضع في live حالة: لا وجود خارجي إشعار قناة طريق أو cold Session scheduler.

```ts type-equiv
/** Current delivery timing derived from the durable record and wall clock. */
type ScheduleState = 'scheduled' | 'overdue'
```

```ts type-equiv
/** Fixed v1 delivery boundary: the original session must be live. */
type ScheduleDeliveryMode = 'session-local'
```

```ts type-equiv
/** Complete model-facing view of one active reminder. */
type ScheduleView = ScheduleRecord & {
  /** Whether the target remains in the future. */
  readonly state: ScheduleState
  /** Reminder delivery never leaves the owning session. */
  readonly deliveryMode: ScheduleDeliveryMode
}
```

توليد[أداة دليل](../tool-catalog.ar.md#deepseek-aidsh-schedule) مسؤول `schedule_create`،`schedule_list` و `schedule_delete` معامل و نتيجة schema. واحد بند Agent-scoped طابور صف سوف إدارة استدعاء و إلى مدة عمل سلسلة سطر تحويل. كل مرة قراءة أو حكم قطع كل سوف أولا انتظار مشترك Session حفظ دائم barrier؛create و فعلي تنفيذ delete في إلحاق بعد أيضا سوف مجددا مرة انتظار.barrier فشل سوف تقرير إبلاغ `persistence_uncertain`، بينما لا هو تخمين قياس eager write هل قد إيداع. أخرى مستقر خطأ شفرة هو `invalid_prompt`،`invalid_selector`،`invalid_rule`،`invalid_time_zone`،`not_future`،`time_out_of_range`،`frequency_too_high`،`corrupt_schedule_log` و `internal_error`.

## فقط قراءة Web دليل

اختياري Session projection سجل التسجيل وجود وقت،Schedule سوف تسجيل عميل مرئي `schedule` key، ذلك قيمة هو كامل نشط حركة `ScheduleRecord[]`.live،cache،history و detached قراءة مشترك استخدام نفس طقم header-aware صارم إطار fold؛ شاذ شكل مرجعي إدخال سوف جعل قائم قراءة مسار فشل، بينما لن إصدار جزء قيمة.

shipped Web bundle افتراضي منع استخدام `ui-schedule`، صريح Schedule overlay فإن يأخذ هو و Host قدرة واحد نفس تفعيل.[`dsh-client-ui-schedule`](../../packages/client/ui-schedule/README.ar.md) يملك header تفاعل،[`dsh-client-ui-workspace`](../../packages/client/ui-workspace/README.ar.md) يملك قائمة سطر عرض، حمل دائم Schedule Agent Note يملك اثنان من مشترك نشط حركة حالة حد. مشترك قيمة فقط يمثل حالي نشط حركة حالة، أبدا يمثل تسليم تاريخ أو عودة تنفيذ؛ إلى مدة رفع تنبيه ما زال عبر تحت نص الذي وصف عادي Assistant إخراج ظهور.

## Live تسليم

عملية داخل owner أصل حسب حمل دائم fold إرسال توليد الأكثر مبكر timer، و في كل مرة محدود انتظار بعد إعادة قراءة جدار ساعة.cold Session لا تنفيذ أي عمل؛ إعادة فتح بعد سوف إعادة بناء timer، و جعل قد مرور ذهاب هدف دخول overdue حالة. إلى مدة مرة صفة رفع تنبيه مشاركة لديه أولوية درجة، كل مرة فقط دخول واحد لاحق جولة. عند لا يوجد مرة صفة رفع تنبيه إلى مدة وقت، كل overdue Every سجل سوف مجموعة صار فوق وصف مفرد عدد دفعة مرة.

إلى مدة عمل سوف أولا انتظار Agent تماما idle و إقرار قيادة maintenance phase، مجددا إعادة طي حالة، أخذ مثال هذا مرة حكم قطع، سوف واحد `followup()` ترتيب دخول طابور صف، و إلحاق مقابل dispatch تغيير. هو أبدا سوف استدعاء `steer()`، أيضا أبدا سوف في قطع حالي جولة.

نيل نيل دقيق دخول مرة صفة رفع تنبيه أو ثابت سرعة معدل دفعة مرة سوف بدء واحد عادي لاحق جولة، كما فقط عبر عادي محادثة transcript(نص سجل) ظهور؛Schedule لا توفير مستقل حمل دائم Web عودة تنفيذ. فوق وجه فقط قراءة نشط حركة دليل أبدا يمثل تسليم نجاح. إذا framing بنية صنع أو تزامن طابور صف دقيق دخول فشل، فإن لن سجل dispatch، رفع تنبيه ما زال إبقاء نشط حركة. طابور صف دقيق دخول بعد، حمل دائم dispatch قبل ضيق ضيق انهيار انهيار نافذة ممكن جعل رفع تنبيه محتوى في استعادة بعد تكرار، لذلك هذا حد توفير هو كل قوة بينما لـ حتى قليل مرة تسليم، بينما غير تماما جيد مرة تسليم.

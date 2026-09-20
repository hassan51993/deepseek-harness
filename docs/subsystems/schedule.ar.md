# الجدولة داخل الجلسة

[English](schedule.md) | العربية

تملك الجدولةُ تذكيراتٍ دائمة تعود إلى الجلسة الحية الأصلية جولاتِ محادثة لاحقة عادية. وتملك [ملاحظةُ الوكيل عن الجدولة الدائمة](../../.agents/notes/implemented/feature/2026-08-05-durable-web-schedule.ar.md) الحفظَ الدائم ودورةَ الحياة وعرضَ الحالة النشطة، ويملك [حدّ المنطقة الزمنية الصريح](../../.agents/notes/implemented/simplification/2026-08-09-explicit-schedule-time-zone.ar.md) التفسيرَ المحلي في المتصفح. وتسجّل هذه الصفحةُ الصيغَ الدائمة والتي يراها النموذج من [`packages/schedule/schedule/src/types.ts`](../../packages/schedule/schedule/src/types.ts)؛ ويملك [README الحزمة](../../packages/schedule/schedule/README.ar.md) التركيبَ وسلوكَ الأدوات وتأطيرَ التذكير بعينه.

## السجلات الدائمة

`ScheduleId` [معرّفٌ موسوم](core.ar.md#branded-ids)، فريدٌ ولا يُعاد استعمالُه داخل الجلسة الواحدة. ويدعم الإصدارُ 1 تأخيرًا `after_seconds` عددًا صحيحًا موجبًا آمنًا، أو هدفًا مطلقًا صريحًا `at`، أو فترةً `every_seconds` عددًا صحيحًا آمنًا لا تقل عن خمس دقائق. ويعيّر الإنشاءُ كلَّ هدف أول إلى `scheduledAt` بصيغة RFC 3339 بالتوقيت العالمي وبسنة من أربعة أرقام؛ ويحتفظ سجلُّ `after` بالتأخير المقدَّم، ويخزّن سجلُّ `at` اللحظةَ الناتجة وحدها، ويحتفظ سجلُّ `every` بفترته الثابتة وهدفِه التالي.

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

## مُدخَل الوقت المطلق

مُنتقي `at` إما سلسلةُ RFC 3339 صارمة تحمل فرقَ توقيت، وإما كائنُ تقويم محلي بعينه. وتُبقي الصيغةُ المحلية تفسيرَها صريحًا عند حدّ الأداة:

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

ويأخذ تراكبُ Web الرسمي عيّنةً من منطقة IANA في المتصفح لكل مطالبة. ويخبر سياقُ الوقت النموذجَ أن يفسّر التواريخَ والأوقات بلغة طبيعية غير المؤهَّلة في منطقة الطلب المحلية حين تكون للجولة المفتوحة منطقةُ متصفح واحدة لا لبس فيها؛ أما السجلاتُ ذاتُ مناطق المتصفح المختلطة أو الغائبة فتخبر النموذجَ أن يسأل. وذلك الإرشادُ ليس افتراضَ جلسة دائمًا: فعلى النموذج أن يمرّر فرقَ التوقيت في الصيغة النصية أو `time_zone` في الصيغة المحلية، والجدولةُ لا تقرأ سياقَ المتصفح ولا الجلسة ولا العملية ولا النموذج قط.

وترفض الجدولةُ فروقَ التوقيت والمناطقَ غيرَ الصالحة، والسلاسلَ بلا فرق توقيت، والأهدافَ غيرَ المستقبلية، والأوقاتِ المحلية داخل فجوات التوقيت الصيفي. ويختار تداخلُ التوقيت الصيفي لحظتَه الأولى الأسبق. ولا يخزّن الإنشاءُ الناجح إلا `scheduledAt` المعياري بالتوقيت العالمي، فلا تتعلق إعادةُ التشغيل قط بحالة منطقة زمنية محيطة.

## مُدخَل المعدل الثابت واللحاق

`every_seconds` فترةٌ لكل سجل لا تقل عن 300 ثانية، مرساةٌ إلى وقت الإنشاء. وهي تكرارٌ بمعدل ثابت فقط: فلا تعبيرَ تقويم ولا Cron في البروتوكول، ولا منطقةَ زمنية للتكرار، ولا فترةَ تهدئة مشتركة، ولا بوابةَ قبول بين السجلات.

وحين تكون الجلسةُ باردة أو مشغولة عبر عدة أهداف، لا يسهم سجلُّ `Every` الواحد إلا بأحدث مناسبة مستحقة له. ويقدّمه التوزيعُ مباشرةً إلى أول هدف مرسى إلى وقت الإنشاء بعد وقت قرار التوزيع، بلا تعداد الفترات الفائتة ولا حفظها ولا إعادة تشغيلها. وإن تعذّر أن يقع الهدفُ التالي في سنة من أربعة أرقام بالتوقيت العالمي، أنهى التوزيعُ الأخير السجلَّ.

وحين تتأخر عدةُ سجلات `Every` متمايزة ولا يستحق أيُّ سجل ذي لقطة واحدة، أسهم كلٌّ منها بمناسبة واحدة في دفعة المتابعة نفسِها بترتيب الهدف ثم الإنشاء. ويُبقي كلُّ سجل حالتَه مستقلة، بينما تستعمل كلُّ التوزيعات في تلك الدفعة المقبولة وقتَ القرار نفسَه. وتحدّ الدفعاتُ جولاتِ النموذج؛ ويحدّ الحدُّ الأدنى ذو الخمس دقائق تواترَ مؤقّت كل سجل.

## التغييرات الدائمة وإعادة التشغيل

حدثُ الجلسة `schedule/change` بالإصدار 1 هو مرجعُ الجدولة الدائم الوحيد. ويخزّن الإنشاءُ السجلَّ كاملًا، والحذفُ انتقالٌ نهائي بالمعرّف وحده. وتوزيعُ سجل ذي لقطة واحدة نهائيٌّ أيضًا وبالمعرّف وحده. وتوزيعُ `Every` يحمل وقتَ القرار على الساعة المستعملَ لانتقاء أحدث مناسبة مستحقة، ويقدّم السجلَّ النشط عادةً بدل إنهائه. والتوزيعُ يعني أن المتابعةَ اصطفّت متزامنةً، لا أن جوابَ نموذج نجح أو أن المستخدم قرأه.

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

ويرفض المفكِّكُ الصارم والطيُّ الإصداراتِ المجهولة، والحقولَ الزائدة، والمعرّفاتِ المعادَ استعمالُها، وصيغَ توزيع اللقطة الواحدة أو `Every` غيرَ المتطابقة، وانتقالاتِ الحذف أو التوزيع في مقابل سجلات غير نشطة. وتطوي الجلسةُ العادية مجرى أحداثها كاملًا. أما التفريعُ فلا يطوي إلا الأحداثَ عند `inheritedEventCount` بعينه أو بعده، فيحتفظ بالتاريخ بلا تبنّي تذكيرات جلسة الأب النشطة. وتتلقى تهيئةُ الإسقاط ذلك القطعَ بجوار الترويسة غير القابلة للتغيير، وتستعمل الانتقالَ المشترك، وتحفظ القطعَ والسجلاتِ النشطة وتاريخَ المعرّفات المستعملة، فتحفظ الاستعادةُ من المخزن إعادةَ التشغيل الصارمة. وتصريحُ `schedule/change` وموضعُه في المصدر مفهرسان أيضًا في [دليل الحفظ الدائم](../persistence-catalog.ar.md#schedulechange--log-only).

## العروض النشطة والإدارة

تجمع قيمُ الأدوات السجلَّ الدائم مع حالة التسليم المشتقة من الساعة الحالية. و`session-local` تعني أن الجلسةَ الأصلية يجب أن تكون حية: فلا قناةَ إشعار خارجية ولا مجدولًا للجلسات الباردة.

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

ويملك [دليلُ الأدوات](../tool-catalog.ar.md#deepseek-aidsh-schedule) المولَّد schemas الوسائط والنتائج لـ`schedule_create` و`schedule_list` و`schedule_delete`. وتُسلسَل نداءاتُ الإدارة مع العمل المستحق في طابور واحد محدود بالوكيل. وينتظر كلُّ قراءة أو قرار أولًا حاجزَ حفظ الجلسة المشترك؛ وينتظر الإنشاءُ والحذفُ الفعلي مرةً أخرى بعد الإلحاق. ويبلّغ فشلُ الحاجز بـ`persistence_uncertain` بدل التخمين أهناك كتابةٌ متلهّفة أُودعت. وسائرُ رموز الأخطاء الثابتة هي `invalid_prompt` و`invalid_selector` و`invalid_rule` و`invalid_time_zone` و`not_future` و`time_out_of_range` و`frequency_too_high` و`corrupt_schedule_log` و`internal_error`.

## دليل Web للقراءة فقط

حين يحضر سجلُّ إسقاطات الجلسة الاختياري، تسجّل الجدولةُ المفتاحَ `schedule` الذي يراه العميلُ وقيمتُه مصفوفةُ `ScheduleRecord[]` النشطة كاملةً. وتستعمل القراءاتُ الحية وقراءاتُ المخزن والتاريخ والقراءاتُ المنفصلة الطيَّ الصارم الواعي بالترويسة نفسَه؛ ويُفشل المُدخَلُ المرجعي المشوَّه مسارَ القراءة القائم بدل نشر قيمة جزئية.

وتُبقي حزمةُ Web المشحونة `ui-schedule` معطَّلةً افتراضيًا، بينما يفعّلها تراكبُ الجدولة الصريح مع قدرة المضيف. وتملك [`dsh-client-ui-schedule`](../../packages/client/ui-schedule/README.ar.md) تفاعلَ الترويسة، وتملك [`dsh-client-ui-workspace`](../../packages/client/ui-workspace/README.ar.md) عرضَ صفوف القائمة، وتملك ملاحظةُ الوكيل عن الجدولة الدائمة حدَّ الحالة النشطة المشترك بينهما. والقيمةُ المشتركة تمثّل الحالةَ النشطة الحالية، لا تاريخَ التسليم ولا إيصالًا؛ وتظهر التذكيراتُ المستحقة عبر خرج المساعد المعتاد الموصوف أدناه.

## التسليم الحي

يشتق المالكُ المحلي في العملية أقربَ مؤقّت له من الطي الدائم ويعيد قراءةَ الساعة بعد كل انتظار محدود. ولا تعمل الجلساتُ الباردة شيئًا؛ وإعادةُ فتح إحداها تعيد بناءَ المؤقّتات وتجعل الأهدافَ الماضية متأخرة. وتتقدم سجلاتُ اللقطة الواحدة المستحقة وتدخل جولةً لاحقة واحدة في كل مرة. وحين لا يستحق سجلُّ لقطة واحدة، تكوّن كلُّ سجلات `Every` المتأخرة الدفعةَ الواحدة الموصوفة أعلاه.

وينتظر العملُ المستحق أن يصير الوكيلُ خاملًا تمامًا ويدّعي طورَ الصيانة قبل أن يعيد طيَّ الحالة، ويأخذ عيّنةَ القرار، ويصطف `followup()` واحدًا، ويُلحق تغييراتِ التوزيع المقابلة. وهو لا ينادي `steer()` قط ولا يقاطع جولةً جارية.

وتبدأ دفعةُ اللقطة الواحدة أو المعدل الثابت المقبولة جولةً لاحقة عادية واحدة ولا تظهر إلا عبر نص المحادثة المعتاد؛ ولا إيصالَ Web دائمًا مستقلًّا للجدولة. والدليلُ النشط للقراءة فقط أعلاه لا يمثّل قط نجاحَ تسليم. وإن فشل التأطيرُ أو قبولُ الطابور المتزامن، لم يُسجَّل توزيعٌ وبقي التذكيرُ نشطًا. وفترةُ الانهيار الضيقة بعد القبول وقبل التوزيع الدائم قد تكرّر محتوى التذكير بعد التعافي، فالحدُّ على قدر الاستطاعة تسليمٌ مرةً واحدة على الأقل لا مرةً واحدة بالضبط.

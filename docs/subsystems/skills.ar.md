# Skills

[English](skills.md) | العربية

[skill(تقنية قدرة) قدرة عائلة](../../packages/skill) يتضمن Service Definition([dsh-skill](../../packages/skill/skill) ،`ctx.skills`) ، محلي Service Provider([dsh-skill-filesystem](../../packages/skill/skill-filesystem)) ، اختياري مع حزمة مزود ([dsh-skill-badge](../../packages/skill/skill-badge) و [dsh-skill-office](../../packages/skill/skill-office)) و Consumer([dsh-tool-skill](../../packages/skill/tool-skill)). سجل التسجيل في ذلك مضيف طبقة و كل scope طبقة بين دمج كل مزود دليل؛ مزود مساهمة محلي أو مع حزمة skill؛Consumer يملك ابتدائي دليل و استبدال دليل، و موجه إلى نموذج `skill` أداة.skill هو اختياري إشارة أمر بينما غير جلسة حدث، لذلك ذلك مفردات تعريف في هذا موضع بينما غير [core.md](core.ar.md).

شفرة المصدر:[`packages/skill/skill/src/index.ts`](../../packages/skill/skill/src/index.ts) ،[`packages/skill/skill-filesystem/src/index.ts`](../../packages/skill/skill-filesystem/src/index.ts) ،[`packages/skill/skill-badge/src/index.ts`](../../packages/skill/skill-badge/src/index.ts) ،[`packages/skill/skill-office/src/index.ts`](../../packages/skill/skill-office/src/index.ts) و [`packages/skill/tool-skill/src/index.ts`](../../packages/skill/tool-skill/src/index.ts).

## مزود سجل التسجيل

`ctx.skills` تركيب محلي، داخل تضمين، بعيد مسار أو أخرى مزود. تسجيل هو تزامن؛ بعيد مسار ابتدائي تحويل و اكتشاف يخص `list()` await مرحلة مقطع. مزود كائن، خيار و مرشح بند بـ فقط قراءة طريقة استعارة استخدام، دلالة حقل سوف يتم تحقق.

سجل التسجيل اعتماد مضيف + حسب scope قسم طبقة بنية، أي[أداة سجل التسجيل](tools.ar.md) في [dsh-scope](../../packages/core/scope) لـ فوق تأكيد قيام شكل: تسجيل سوف سقوط دخول استدعاء جهة سياق scope مقابل طبقة——مضيف سطر و repository إضافة سقوط دخول عام طبقة، من agent(ذكي جسم) preset معتاد إقامة تركيب تركيب إضافة سقوط دخول هذا preset طبقة——مزود اسم في كل طبقة داخل وحيد، بينما غير عملية درجة وحيد. قراءة وقت سوف عام طبقة و مراقبة scope سلسلة دمج: الأكثر قريب طبقة بند مباشر فوز نيل إعادة اسم skill، تحت نص rank ترتيب فقط في مفرد طبقة داخل قطع قرار إعادة اسم. اكتشاف ذاكرة مؤقتة بـ تحليل بعد scope سلسلة لـ مفتاح، لذلك إعادة ضبط scope أب درجة (فارغ جلسة إعادة مجموعة) بلا حاجة سجل التسجيل تغيير يكفي يتم تحت مرة قراءة يرى.

في مفرد طبقة داخل، إعادة اسم بند اعتماد مرة حسب rank، مزود ترتيب و محلي ترتيب تحديد أولوية درجة؛ ملخص حسب اسم ترتيب. مزود `list()` يتم رفض وقت، نظام سوف سجل سجل، و من لا كامل مراقبة قياس في حذف هذا مزود نتيجة؛ صريح لا كامل مراقبة قياس سوف توفير متاح مرشح بند، لكن لن جعل نتيجة تغيير نيل يمكن ذاكرة مؤقتة؛ صيغة خطأ مرشح بند سريع سرعة فشل. كل مزود عمل مصنع كل سوف استقبال واحد بند تسجيل أثر مجال داخل تحكم قدرة؛ فقط عند هذا دقيق تسجيل ما زال موضع في نشط حركة حالة وقت، ذلك `invalidate()` عندئذ سوف صاف حذف اكتمل دليل؛ تسجيل فشل أو dispose(مورد تحرير) وقت، ذلك إشارة سوف في توقف. إذا مزود بديل مرة في اكتشاف إجراء خلال حدوث تغير، هذا اكتشاف سوف إعادة محاولة مرة؛ إذا مجددا مرة تغير، فإن إرجاع الأكثر جديد مرشح بند، و سوف نتيجة علامة لـ لا كامل كما لا إعطاء ذاكرة مؤقتة. مزود و وقت التشغيل تغيير سوف إرسال خروج لا حمل مرور ترشيح شرط `skills/change` بطلان حدث؛ هذا حدث لا يحمل diff، لذلك مستهلك سوف استخدام ذاته فحص بحث خيار إعادة نيل أخذ `snapshot()`.

`SkillProvider.list()` إرجاع عدد مجموعة هو كامل اكتشاف بسيط كتابة شكل صيغة.`SkillProviderObservation` سماح مزود عام ما زال يمكن مباشر تحميل مرشح بند، معا تقرير إبلاغ هذا مراقبة قياس لا أداة مرجعي صفة.

```ts type-equiv
/** Provider candidates plus whether the current discovery is authoritative. */
interface SkillProviderObservation {
  /** Candidates available from the current provider discovery. */
  readonly candidates: readonly SkillCandidate[]
  /** Whether discovery completed and these candidates may be cached. */
  readonly complete: boolean
}
```

```ts type-equiv
/** Provider interface for one source of skills, such as local directories or a remote registry. */
interface SkillProvider {
  /** Unique provider name in the `ctx.skills` registry. */
  readonly name: string
  /**
   * List available skill candidates for the current lookup context. Provider
   * plugins register synchronously during `apply()`; remote initialization,
   * authentication, and discovery are awaited inside this method. Implementations
   * should settle promptly when `options.signal` aborts.
   * @param options - lookup options; `cwd` selects workspace-sensitive skills and `signal` cancels work.
   * @returns provider candidates as a complete-array shorthand, or an explicit
   *   observation when usable candidates came from incomplete discovery.
   */
  readonly list: (options: SkillLookupOptions) => Promise<readonly SkillCandidate[] | SkillProviderObservation>
  /**
   * Load a complete skill body for a previously listed candidate.
   * @param candidate - the winning candidate originally returned by this provider.
   * @param options - lookup options; `cwd` selects workspace-sensitive skills and `signal` cancels work.
   * @returns the full skill body, or `undefined` if it is no longer loadable.
   */
  readonly get: (candidate: SkillCandidate, options: SkillLookupOptions) => Promise<SkillDefinition | undefined>
}
```

```ts type-equiv
/** Registration-scoped lifecycle and invalidation capability borrowed by one provider. */
interface SkillProviderControl {
  /** Aborts if registration fails or when the exact provider registration is disposed. */
  readonly signal: AbortSignal
  /** Invalidate completed catalogs and notify consumers only while the exact registration remains active. */
  readonly invalidate: () => void
}
```

## محلي اكتشاف أولوية درجة

مع مرفق محلي مزود حسب rank ترتيب مسح كل أصل دليل:

| Rank | Source | Root |
|---|---|---|
| 100 | `project-dsh` | `<projectRoot>/.dsh/skills` |
| 200 | `project-agents` | `<projectRoot>/.agents/skills` |
| 300 | `custom` | `Config.customSkillDirs` |
| 400 | `user-dsh` | `<dshHome>/skills` |
| 500 | `user-agents` | `<agentsHome>/skills` |
| 600 | `bundled` | إعداد `Config.bundledSkillDir` وقت استخدام هذا دليل |

مشروع أصل دليل لـ يتضمن `.git` الأكثر قريب أصل أولا دليل؛ بحث لا إلى وقت استخدام حالي cwd. عند `ctx.fs` متاح وقت،git-root نحو فوق فحص بحث عبر نظام الملفات خدمة استكشاف قياس `.git`، جعل بعيد مسار أو صندوق رملي مساحة العمل لن رجوع إلى مضيف نظام الملفات حد. مستخدم DSH أصل دليل سوف قفز مرور ذلك `.system` فرعي دليل. محلي مزود لن دمج صار داخل وضع نظام skill؛ نشر جهة عبر قد إعداد bundled أصل دليل أو مخصص استخدام مزود توفير مع حزمة skill.

`dsh-skill-badge` في `BUNDLED_SKILL_RANK` تسجيل واحد غير ممكن تغيير `bundled` مرشح بند، و عبر `resourceBase` عام ذلك مع حزمة مورد إنتاج دليل. تسليم CLI(أمر سطر واجهة) سوف هذا إضافة إعلان لـ منع استخدام، لذلك تفعيل ذلك تركيب إعداد سطر أي لـ صريح اختيار إضافة دخول.

Chokidar سوف مراقبة نظر قائم أصل دليل في مباشر تابع bundle و مستو فرش بند إضافة و إزالة، و مباشر تابع skill بند تغيير. ناقص أصل دليل سوف من الأكثر قريب قائم أصل أولا بدء، تدريجي عدد تتبع أثر ناقص مسار مقطع، مباشر حتى Chokidar يمكن مرفق إضافة.bundle تحت مورد ملف تغيير لا يخص دليل تغيير. موجه إلى نموذج `write` و `edit` مراقبة قياس سوف في هدف مسار و دليل متبادل صلة وقت تزامن جعل مزود دليل بطلان، بينما مضيف watcher تغطية IDE،Git،shell و خارجي عملية إنتاج تغيير.watcher فشل سوف جعل حالي مراقبة قياس لا كامل، لكن لن في مباشر تحميل وقت إخفاء يمكن قراءة مرشح بند؛ مشروع أثر مجال watcher استخدام حسب إعداد ضبط حد LRU.

## skill هوية

skill اسم لـ kebab-case(`^[a-z0-9]+(?:-[a-z0-9]+)*$`). محلي مزود قبول دليل حزمة (`<name>/SKILL.md`) و مسطح مستو Markdown ملف (`<name>.md`). تضمين طقم تمرير عودة `**/SKILL.md` اكتشاف لا تلقي دعم حمل.

```ts type-equiv
/** Origin bucket for a skill contribution. The value is prompt-visible metadata, not precedence by itself. */
type SkillSource = 'project-dsh' | 'project-agents' | 'runtime' | 'user-dsh' | 'user-agents' | 'custom' | 'bundled' | (string & {})
```

## ملخص، مرشح بند و كامل تعريف

`SkillSummary` هو سجل التسجيل في و استدعاء سياسة غير متصل ملخص شكل حالة. مستهلك ذاتي سطر اختيار تصيير أي بعض بند و حقل؛ نموذج جلسة دليل فقط استخدام نموذج يمكن استدعاء skill `name` و `description`، من لا استخدام متن أو قطعا مقابل ملف مسار.`SkillInvocationPolicy` سوف اثنان عدد مستقل استدعاء تحكم مواصفة تحويل لـ صحيح نحو قيمة منطقية، كما كل قد تحليل ملخص، مرشح بند و تعريف كل يحمل هذا سياسة، بينما لن يأخذ مهمة معنى frontmatter قبول دخول مجال نموذج.

```ts type-equiv
/** Invocation controls shared by skill discovery consumers. */
interface SkillInvocationPolicy {
  /** Whether model-facing catalogs and loaders include this skill. */
  readonly modelInvocable: boolean
  /** Whether human-facing command catalogs and loaders include this skill. */
  readonly userInvocable: boolean
}
```

```ts type-equiv
/** Invocation-neutral skill metadata returned by `ctx.skills.list()`. */
interface SkillSummary {
  /** Absolute instruction file path when supplied by the provider; absent for virtual skills. */
  readonly path?: string
  /** Kebab-case identifier used to address the skill. */
  readonly name: string
  /** Short routing description shown by discovery consumers. */
  readonly description: string
  /** Optional extra routing guidance. */
  readonly whenToUse?: string
  /** Resolved model and user invocation controls. */
  readonly invocation: SkillInvocationPolicy
  /** Discovery source that produced this winning skill. */
  readonly source: SkillSource
  /** Provider that owns this skill body. */
  readonly provider: string
  /** Provider-specific base for relative resources. */
  readonly resourceBase?: SkillResourceBase
}
```

`ctx.skills.list()` إبقاء الكل أربعة نوع سياسة تركيب.`isModelInvocable(skill)` و `isUserInvocable(skill)` قسم آخر قراءة مقابل لا بد ملء حقل. فقط توفير نموذج استدعاء skill ضبط `{ modelInvocable: true, userInvocable: false }`، فقط توفير مستخدم استدعاء skill ضبط `{ modelInvocable: false, userInvocable: true }`، اثنان عدد حقل متساو ضبط لـ `false` بعد، هذا skill فقط قدرة من تلقي معلومة `ctx.skills.get()` استدعاء جهة نيل أخذ. محلي مزود قراءة اسم تماما مطابقة kebab-case frontmatter مفتاح `disable-model-invocation` و `user-invocable`، سوف حذف حقل افتراضي لـ `true`، و لـ كل تحليل خروج skill توليد هذا عدد مواصفة تحويل سياسة.

`SkillCatalogSnapshot` لأجل منطقة قسم قد تحديد لا وجود و مزود لحظة وقت فشل أو اكتشاف خلال حمل متابعة تغير دليل.`skills` يتضمن هذا مرة مراقبة قياس في استلام تجميع، ترتيب كما و استدعاء سياسة غير متصل ملخص؛ فقط لديه كل قد تسجيل مزود كل في لا يوجد تزامن دليل إصلاح حجز وقت إتمام اكتشاف،`complete` عندئذ لـ true. لا كامل لقطة لن ذاكرة مؤقتة، لذلك كل مستهلك يمكن إبقاء فوق واحد نسخة مرور مرور ذاته مرور ترشيح متاح دليل و إعادة محاولة.

```ts type-equiv
/** One catalog observation plus whether discovery completed within a stable catalog revision. */
interface SkillCatalogSnapshot {
  /** Sorted invocation-neutral summaries collected in this observation. */
  readonly skills: SkillSummary[]
  /** Whether every registered provider completed without a concurrent catalog revision. */
  readonly complete: boolean
}
```

`SkillCandidate` هو مزود إلى سجل التسجيل شكل حالة.`locator` هو مزود لا نفاذ واضح حالة؛ سجل التسجيل فقط تخزين هو و في استدعاء نيل فوز مزود `get()` وقت نقل عودة.

```ts type-equiv
/** Provider catalog entry used by the registry to merge and later load skills. */
interface SkillCandidate extends SkillSummary {
  /** Lower ranks win duplicate skill names before provider registration order is considered. */
  readonly rank: number
  /** Opaque provider-owned handle passed back to `provider.get()`. */
  readonly locator: unknown
  /** Parsed optional metadata object from provider-specific skill frontmatter. */
  readonly metadata?: Readonly<Record<string, unknown>>
}
```

`SkillDefinition` هو `ctx.skills.get()` إرجاع كامل تحليل نتيجة، توفير `skill` أداة استخدام.`resourceBase` إبلاغ معرفة أداة مثل أي لـ محلي،URL أو مزود إدارة skill تصيير متبادل مقابل مورد جذب توجيه.

```ts type-equiv
/** Optional provider-specific base used by loaded skill bodies to resolve relative resources. */
type SkillResourceBase =
  | { readonly kind: 'directory'; readonly path: string }
  | { readonly kind: 'url'; readonly url: string }
  | { readonly kind: 'opaque'; readonly description: string }
```

```ts type-equiv
/** Complete parsed skill definition, including the body loaded by `ctx.skills.get()`. */
interface SkillDefinition extends SkillSummary {
  /** Markdown instruction body after any provider-specific metadata removal. */
  readonly content: string
  /** Parsed optional metadata object from frontmatter. */
  readonly metadata?: Readonly<Record<string, unknown>>
}
```

وقت التشغيل skill إدخال يمكن حذف استدعاء تحكم و مزود وسم. سجل التسجيل سوف مرة صفة تكملة كل هذا اثنان بند قيمة افتراضية، مع بعد استخدام و مزود نفسه كامل تعريف شكل حالة و أولا إلى أولا نيل استلام تجميع ترتيب. إرجاع disposer إزالة هذا مساهمة و جعل اكتشاف ذاكرة مؤقتة بطلان.

```ts type-equiv
/** Runtime skill contribution accepted by `ctx.skills.register()`. */
type SkillRegistration = Omit<SkillDefinition, 'invocation' | 'provider'> & {
  /** Invocation controls; omission permits both model and user surfaces. */
  readonly invocation?: SkillInvocationPolicy
  /** Provider label; omission uses the registry-owned runtime provider. */
  readonly provider?: string
}
```

## فحص بحث و إعداد

skill فحص بحث مقابل cwd حساس شعور، لأن مزود ممكن كشف مساحة العمل محلي skill؛ اختياري signal لـ استدعاء جهة إلغاء مزود عمل. سجل التسجيل قراءة أيضا عبر `SkillViewOptions` يحمل مراقبة scope——مستهلك نقل دخول استدعاء في agent،agent ذاته حينئذ هو ذاتي ذات scope key؛ سجل التسجيل إزالة استهلاك `scope` فعل طبقة اختيار، مزود فقط من نفس عدد استعارة استخدام خيار كائن في قراءة ذلك `SkillLookupOptions` اتفاق. إلغاء في دليل اختيار قبل بعد (يشمل ذاكرة مؤقتة أمر في وقت) كل سوف فحص، و و اكتشاف و كامل تعريف تحميل تنافس تنازع. إذا بحث لا إلى git root، محلي مزود سوف الذي توفير cwd ذاته نظر لـ مشروع أصل دليل.

سجل التسجيل لا ذاكرة مؤقتة كامل تعريف. كل مرة استدعاء `get()` كل سوف حمل الذي اختيار مرشح بند استدعاء فوز خروج مزود، لذلك محلي مزود سوف إعادة قراءة حالي متن. اسم و هذا مرشح بند لم يعد مطابقة تعريف سوف يتم رفض، و جعل هذا مزود نسخة بطلان بـ سهل إعادة اكتشاف.

```ts type-equiv
/** Caller context used for cwd-sensitive and abortable provider work. */
interface SkillLookupOptions {
  /** Workspace selector for the current lookup. */
  readonly cwd?: string | undefined
  /** Abort discovery or loading work for the current caller. */
  readonly signal?: AbortSignal | undefined
}
```

```ts type-equiv
/**
 * Registry read options: provider lookup context plus the viewing scope.
 * The registry consumes `scope` to select layers; providers receive the same
 * borrowed options object and read only their {@link SkillLookupOptions}
 * contract from it.
 */
interface SkillViewOptions extends SkillLookupOptions {
  /** Viewing scope (the calling agent); omitted reads the global layer alone. */
  readonly scope?: ScopeKey | undefined
}
```

سجل التسجيل فقط يملك ذلك اكتشاف ذاكرة مؤقتة حد أعلى. محلي مزود يملك نظام الملفات أصل دليل (`dshHome`،`agentsHome`،`customSkillDirs`، و اختياري `bundledSkillDir`/`DSH_BUNDLED_SKILL_DIR`) ، و watcher تفعيل، جولة استفسار، مستقر صفة، رمز رقم رابط و مشروع سعة كمية تحكم. مستهلك يملك ذلك دليل وصف حد أعلى. تأكيد قطع قيمة افتراضية و تحقق قاعدة رؤية تلقائي توليد[إضافة إعداد دليل](../config-catalog.ar.md).

```ts type-equiv
/** Skill registry configuration. */
interface Config {
  /** Maximum number of completed cwd/provider catalogs kept in memory. */
  readonly collectCacheMaxEntries?: number
}
```

## جلسة دليل و أداة اتفاق

`dsh-tool-skill` في تخزين نشط جلسة في رقم واحد مراقبة إلى غير فارغ كامل عرض `agent/pre-step` حقن ابتدائي حمل دائم user-role `<system-reminder>`. دليل فقط يتضمن قد ترتيب skill `name` و مواصفة تحويل، مرور XML تحويل معنى `description`؛ لا يتضمن متن، مسار، مصدر، مزود أو توجيه تلميح. اكتشاف عبر `SkillLookupOptions` تحويل إرسال هذا خطوة abort signal.`catalogDescriptionMaxLength` هو مستهلك لأجل description حد أعلى إعداد، قيمة افتراضية لـ `500`، كامل عدد الأكثر صغير قيمة لـ `3`.

في لاحق كل نموذج خطوة قبل، مستهلك كل سوف تطبيق دقيق أداة مرئي صفة، و مقابل كامل لقطة في `<available_skills>` وسم بين دقيق تصيير بند حساب حساب digest. هو بـ هذا إضافة الذي إصدار، الأكثر جديد واحد بند يمكن تعرف آخر كما ما زال مرئي دليل رسالة في نفسه بند بصفة مقارنة مقارنة أساس خط.digest حدوث تغير وقت، سوف عبر `agent.inject()` إلحاق واحد بند حمل دائم كامل دليل استبدال؛ حذف كل skill وقت سوف إلحاق واحد بند صريح فارغ استبدال. لا كامل لقطة سوف إبقاء فوق واحد نسخة متاح نموذج عرض. إذا ضغط (compaction) إخفاء كل تاريخ دليل رسالة، تحت واحد نسخة كامل لقطة سوف إعادة بناء قيام حالي دليل؛ إذا عرض لـ فارغ كما من لم إصدار دليل، فإن لا إرسال أي محتوى. هذه دليل رسالة يخص جلسة تاريخ، بينما غير World State.

موجه إلى نموذج `skill({ name })` أداة تحقق kebab-case اسم، في و استدعاء سياسة غير متصل دليل في فحص بحث ملخص، و في تحميل قبل عبر `isModelInvocable` رفض بلا حق وصول skill؛ مع بعد هو أصل حسب استدعاء جهة agent cwd إعادة قراءة كامل تعريف، و في إرجاع محتوى قبل مجددا مرة فحص سياسة. هذا أداة سوف لا يمكن تحليل skill تقرير إبلاغ لـ لم معرفة أو قد غير ممكن استخدام، و إرجاع يتضمن `<skill_content name="...">`،`<skill_resources>` و `<skill_instructions>` أداة نتيجة.`resourceBase` فقط حسب يحتاج تحليل صريح مرجع نص برمجي، مشاركة اعتبار مورد مادة و مورد إنتاج؛ تحميل نتيجة لا قطعة رفع skill دليل. لذلك، فقط تعديل متن سوف تغيير لاحق استدعاء الأداة، بينما لن توليد دليل رسالة أو تعديل كتابة أولا قبل أداة نتيجة.

## متصفح Session دليل

`SkillListRequest` عبر `sessionId` إشارة تحديد واحد Session؛`SkillListValue` إرجاع سماح مستخدم استدعاء بند، منها يتضمن اسم، وصف، اختياري استخدام تلميح و نموذج استدعاء متاح صفة.`SessionSkillCatalog` في لا تنشيط Agent قبل رفع تحت قراءة Session cwd و سجل preset.live Agent يمكن توفير ذلك أثر مجال registry، بارد Session فإن استخدام preset standing scope.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsessionskillcatalog--sessionskillcatalog"></a>

### `ctx.sessionSkillCatalog` — `SessionSkillCatalog`

Host service backing `ctx.remote.skills` without activating a cold Agent.

```ts cordis-catalog
/**
 * List the user-invocable skills visible to one Session composition.
 * @param request - Session identity whose cwd and preset select the catalog view.
 * @param signal - caller lifetime carried by the Remote transport; admitted catalog reads retain their existing completion semantics.
 * @returns user-invocable skill metadata without loading skill bodies.
 * @throws RemoteError when the Session cannot be inspected or no registry can serve it.
 */
@Remote async list(request: SkillListRequest, signal: AbortSignal): Promise<SkillListValue>
```

Source: [`packages/api/session-controller/src/skill-catalog.ts`](../../packages/api/session-controller/src/skill-catalog.ts)

<a id="ctxskills--skillregistry"></a>

### `ctx.skills` — `SkillRegistry`

Layered registry of skill providers, the host+per-scope shape the tools registry established. A registration files into the layer of its calling context's scope (scopeOf): host rows and repository plugins land in the global layer, while a plugin mounted by an agent preset's standing composition lands in that preset's layer. A read merges the global layer with the viewing scope's chain — the nearest layer's entry wins a duplicate name outright, and the rank order decides duplicates only within one layer. It exposes sorted invocation-neutral summaries and loads full skill bodies on demand.

```ts cordis-catalog
/**
 * Register a borrowed same-process provider synchronously during plugin
 * apply, into the calling context's layer: a scoped context (an agent
 * preset's standing mount) registers for that scope alone, an unscoped
 * context registers globally. Duplicate names within one layer and reserved
 * names throw; remote initialization belongs in `list()`. Fiber disposal
 * unregisters the provider and invalidates catalog caches.
 * @param create - synchronous factory receiving this registration's lifecycle and invalidation control.
 * @returns the exact Cordis effect disposer that unregisters this provider;
 *   composite effects may yield it directly to preserve teardown ordering.
 */
registerProvider(create: (control: SkillProviderControl) => SkillProvider): () => void

/**
 * Register a borrowed readonly runtime skill into the calling context's
 * layer. Project entries outrank runtime entries, which outrank user
 * entries, within one layer. Same-name runtime entries in one layer are
 * first-wins; a duplicate logs a warning and receives a no-op disposer so
 * it cannot remove the winner.
 * @param skill - the skill definition input; omitted invocation and provider fields receive defaults.
 * @returns the exact Cordis effect disposer, preserving composite teardown order and invalidating caches.
 */
register(skill: SkillRegistration): () => void

/**
 * List invocation-neutral skill summaries for a workspace. Consumers apply
 * model or user invocation policy at their operational boundary. Lookup
 * options and provider candidates are readonly same-process values borrowed
 * throughout discovery.
 * @param options - view options; `scope` selects the viewing agent's layers, `cwd` selects project roots, and `signal` cancels discovery.
 * @returns all sorted winning summaries.
 */
async list(options: SkillViewOptions = {}): Promise<SkillSummary[]>

/**
 * Observe the current invocation-neutral catalog and whether discovery completed within a stable revision.
 * Incomplete observations are never cached, allowing consumers to retain last-good state and
 * retry on their next request boundary.
 * @param options - view options; `scope` selects the viewing agent's layers, `cwd` selects project roots, and `signal` cancels discovery.
 * @returns sorted summaries plus discovery-completeness state.
 */
async snapshot(options: SkillViewOptions = {}): Promise<SkillCatalogSnapshot>

/**
 * Load and validate the winning candidate, passing its opaque discovery locator back to the
 * provider. Cancellation is rechecked after selection, including cache hits, and raced against
 * loading so an uncooperative provider cannot hang the caller.
 * @param name - kebab-case skill name.
 * @param options - view options; `scope` selects the viewing agent's layers,
 *   `cwd` selects workspace-sensitive skills, and `signal` cancels work.
 * @returns the full skill, including body content, or `undefined`.
 */
async get(name: string, options: SkillViewOptions = {}): Promise<SkillDefinition | undefined>
```

Source: [`packages/skill/skill/src/index.ts`](../../packages/skill/skill/src/index.ts)

<a id="skills-events"></a>

### `skills/*` events

<a id="skillschange--emit"></a>

#### `skills/change` — emit

A skill provider, runtime contribution, or provider-backed catalog may have changed. This is an unfiltered invalidation notification; consumers refetch the catalog for their own lookup options. Listener failures are contained and cannot veto the registry mutation.

```ts cordis-catalog
/**
 * A skill provider, runtime contribution, or provider-backed catalog may
 * have changed. This is an unfiltered invalidation notification; consumers
 * refetch the catalog for their own lookup options. Listener failures are
 * contained and cannot veto the registry mutation.
 * @mode emit
 */
'skills/change'(): void
```

Source: [`packages/skill/skill/src/index.ts`](../../packages/skill/skill/src/index.ts)
<!-- END GENERATED cordis-surface -->

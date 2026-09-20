# المهارات

[English](skills.md) | العربية

تضم [عائلة قدرة المهارات](../../packages/skill) تعريفَ الخدمة ([dsh-skill](../../packages/skill/skill)، `ctx.skills`)، ومزوّدَ الخدمة المحلي ([dsh-skill-filesystem](../../packages/skill/skill-filesystem))، ومزوّدين محزومين اختياريين ([dsh-skill-badge](../../packages/skill/skill-badge) و[dsh-skill-office](../../packages/skill/skill-office))، والمستهلك ([dsh-tool-skill](../../packages/skill/tool-skill)). ويدمج السجلُّ أدلةَ المزوّدين عبر طبقة المضيف وطبقاتِ كل نطاق؛ ويسهم المزوّدون بمهارات محلية أو محزومة؛ ويملك المستهلكُ الدليلَ الأول والأدلةَ البديلة وأداةَ `skill` التي يراها النموذج. والمهاراتُ تعليماتٌ اختيارية لا أحداثُ جلسة، فتعيش مفرداتُها هنا لا في [core.md](core.ar.md).

المصادر: [`packages/skill/skill/src/index.ts`](../../packages/skill/skill/src/index.ts) و[`packages/skill/skill-filesystem/src/index.ts`](../../packages/skill/skill-filesystem/src/index.ts) و[`packages/skill/skill-badge/src/index.ts`](../../packages/skill/skill-badge/src/index.ts) و[`packages/skill/skill-office/src/index.ts`](../../packages/skill/skill-office/src/index.ts) و[`packages/skill/tool-skill/src/index.ts`](../../packages/skill/tool-skill/src/index.ts).

## سجل المزوّدين

يجمع `ctx.skills` مزوّدين محليين أو مضمَّنين أو بعيدين أو غيرَهم. والتسجيلُ متزامن؛ أما التهيئةُ البعيدة والاكتشافُ فمكانهما `list()` المنتظَرة. وتُستعار كائناتُ المزوّدين وخياراتُهم ومرشحوهم للقراءة فقط، بينما يُتحقق من الحقول الدلالية.

والسجلُّ مقسومٌ طبقةَ مضيف وطبقةً لكل نطاق، على الصيغة التي أرساها [سجل الأدوات](tools.ar.md) فوق [dsh-scope](../../packages/core/scope): فيُحفظ التسجيلُ في طبقة نطاق سياقه المستدعي، فتحطّ صفوفُ المضيف وإضافاتُ المستودع في الطبقة العامة بينما تحطّ إضافةٌ ركّبها التركيبُ الدائم لـpreset وكيل في طبقة ذلك الـpreset، وتكون أسماءُ المزوّدين فريدةً لكل طبقة لا على مستوى العملية. وتدمج القراءةُ الطبقةَ العامة مع سلسلة نطاق العارض — فمدخلُ الطبقة الأقرب يفوز باسم المهارة المكرر فوزًا تامًّا، ولا يحسم ترتيبُ الرتب أدناه التكرارَ إلا داخل طبقة واحدة. وتُفهرَس مخازنُ الاكتشاف بسلسلة النطاق المحلولة، فإعادةُ إسناد أب لنطاق (بإعادة تركيب جلسة فارغة) تظهر للقراءة التالية بلا تغيير في السجل.

وداخل الطبقة الواحدة، تُحسم الأسماءُ المكررة بالرتبة، ثم بترتيب المزوّدين، ثم بالترتيب المحلي؛ وتُرتَّب الملخصاتُ بالاسم. ويُسجَّل `list()` المرفوض ويُغفَل من مراقبة غير كاملة، بينما تسهم المراقبةُ غيرُ الكاملة الصريحة بمرشحين صالحين للاستعمال بلا جعل النتيجة قابلةً للتخزين؛ ويفشل المرشحون المشوَّهون سريعًا. ويتلقى كلُّ مصنع مزوّد ضابطًا محدودًا بالتسجيل تمسح دالتُه `invalidate()` الأدلةَ المكتملة ما دام ذلك التسجيلُ بعينه نشطًا، وتُجهض إشارتُه عند فشل التسجيل أو عند التخلص. ويعيد اكتشافٌ جارٍ المحاولةَ مرةً حين يتغير جيلُ مزوّده؛ ويعيد تغيّرٌ ثانٍ أحدثَ المرشحين غيرَ مكتملين وغيرَ مخزَّنين. وتُطلق تغييراتُ المزوّدين ووقتِ التشغيل حدثَ الإبطال `skills/change` بلا ترشيح؛ وهو لا يحمل فرقًا، فيعيد المستهلكون جلبَ `snapshot()` بخيارات بحثهم.

والمصفوفةُ التي يعيدها `SkillProvider.list()` اختصارٌ لاكتشاف كامل. ويتيح `SkillProviderObservation` للمزوّد أن يكشف مرشحين يبقون قابلين للتحميل مباشرةً بينما يبلّغ أن المراقبةَ ليست مرجعية.

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

## أولوية الاكتشاف المحلي

يمسح المزوّدُ المحلي المشحون الجذورَ بترتيب الرتبة:

| الرتبة | المصدر | الجذر |
|---|---|---|
| 100 | `project-dsh` | `<projectRoot>/.dsh/skills` |
| 200 | `project-agents` | `<projectRoot>/.agents/skills` |
| 300 | `custom` | `Config.customSkillDirs` |
| 400 | `user-dsh` | `<dshHome>/skills` |
| 500 | `user-agents` | `<agentsHome>/skills` |
| 600 | `bundled` | `Config.bundledSkillDir` عند ضبطه |

وجذرُ المشروع أقربُ سلف يحتوي `.git`؛ وبلا واحد، يُستعمل دليلُ العمل الحالي. وحين تتوفر `ctx.fs`، يستكشف مسيرُ جذر git وجودَ `.git` عبر خدمة نظام الملفات، فلا ترتد مساحاتُ العمل البعيدة أو المعزولة إلى حدّ نظام ملفات المضيف. ويتخطى جذرُ DSH للمستخدم ابنَه `.system`. ولا يصطنع المزوّدُ المحلي مهاراتِ نظام مدمجة؛ وتقدّم عملياتُ النشر مهاراتٍ محزومة عبر جذور محزومة مضبوطة أو عبر مزوّدين مخصصين.

وتسجّل `dsh-skill-badge` مرشحًا `bundled` واحدًا غيرَ قابل للتغيير عند `BUNDLED_SKILL_RANK` وتكشف دليلَ أصوله المحزومة عبر `resourceBase`. ويعلن CLI المشحون الإضافةَ معطَّلة، فتفعيلُ صف تركيبها اختيارٌ صريح.

ويراقب Chokidar الجذورَ الموجودة بحثًا عن إضافة أو إزالة حزم ومداخل مسطحة مباشرة، وعن تغييرات مداخل المهارات المباشرة. ويُتبَع الجذرُ المفقود مقطعَ مسار غائبًا في كل مرة من أقرب سلف موجود له حتى يستطيع Chokidar الارتباطَ. وملفاتُ الموارد تحت حزمة ليست تغييراتِ دليل. وتُبطل مراقباتُ `write` و`edit` التي يراها النموذجُ المزوّدَ متزامنةً حين يكون هدفُها ذا صلة بالدليل، بينما يغطي مراقبُ المضيف تغييراتِ بيئات التطوير وGit والصدفة والعمليات الخارجية. وتجعل إخفاقاتُ المراقب المراقبةَ الحالية غيرَ كاملة بلا إخفاء مرشحين قابلين للقراءة عن التحميلات المباشرة؛ ويستعمل مراقبو المشاريع ذاكرةَ LRU محدودة مضبوطة.

## هوية المهارة

أسماءُ المهارات بنسق kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). ويقبل المزوّدُ المحلي حزمَ الأدلة (`<name>/SKILL.md`) وملفاتِ Markdown المسطحة (`<name>.md`). ولا يُدعم الاكتشافُ التكراري المتداخل `**/SKILL.md`.

```ts type-equiv
/** Origin bucket for a skill contribution. The value is prompt-visible metadata, not precedence by itself. */
type SkillSource = 'project-dsh' | 'project-agents' | 'runtime' | 'user-dsh' | 'user-agents' | 'custom' | 'bundled' | (string & {})
```

## الملخصات والمرشحون والتعريفات الكاملة

`SkillSummary` هي صيغةُ الملخص المحايدة تجاه الاستدعاء في السجل. ويختار المستهلكون أيَّ المداخل والحقول يعرضون؛ ولا يستعمل دليلُ جلسة النموذج إلا `name` و`description` القابلين لاستدعاء النموذج، لا المتنَ ولا المسارَ المطلق. وتوحّد `SkillInvocationPolicy` ضابطَي الاستدعاء المستقلين في قيم منطقية موجبة، ويحملها كلُّ ملخص ومرشح وتعريف محلول بلا تحويل أي frontmatter كيفما كان إلى نموذج المجال.

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

وتحفظ `ctx.skills.list()` تركيباتِ السياسة الأربعَ كلَّها. وتقرأ `isModelInvocable(skill)` و`isUserInvocable(skill)` الحقلَ المشترَط المقابل. والمهارةُ المقتصرة على النموذج تضبط `{ modelInvocable: true, userInvocable: false }`، والمقتصرةُ على المستخدم تضبط `{ modelInvocable: false, userInvocable: true }`، وضبطُ الحقلين على `false` يُبقي المهارةَ متاحةً عبر مستدعي `ctx.skills.get()` الموثوقين وحدهم. ويقرأ المزوّدُ المحلي مفتاحَي frontmatter بنسق kebab-case بعينهما `disable-model-invocation` و`user-invocable`، ويجعل افتراضَ الحقول المُغفَلة `true`، ويُسقط كلَّ مهارة محلَّلة في هذه السياسة الموحَّدة.

وتميّز `SkillCatalogSnapshot` بين الغياب المرجعي وبين فشل مزوّد عابر أو دليل ظل يتغير أثناء الاكتشاف. ويحتوي `skills` الملخصاتِ المحايدة تجاه الاستدعاء المرتَّبةَ المجموعةَ في تلك المراقبة؛ و`complete` صحيحةٌ فقط حين يُكمل كلُّ مزوّد مسجَّل بلا مراجعة دليل متزامنة. واللقطاتُ غيرُ الكاملة لا تُخزَّن، فيستطيع كلُّ مستهلك الاحتفاظَ بآخر دليل مرشَّح جيد لديه وإعادةَ المحاولة.

```ts type-equiv
/** One catalog observation plus whether discovery completed within a stable catalog revision. */
interface SkillCatalogSnapshot {
  /** Sorted invocation-neutral summaries collected in this observation. */
  readonly skills: SkillSummary[]
  /** Whether every registered provider completed without a concurrent catalog revision. */
  readonly complete: boolean
}
```

و`SkillCandidate` هي الصيغةُ من المزوّد إلى السجل. و`locator` حالةُ مزوّد معتمة؛ ولا يفعل السجلُّ إلا تخزينَها وإعادتَها إلى `get()` لدى المزوّد الفائز.

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

و`SkillDefinition` هي النتيجةُ المحلَّلة الكاملة التي يعيدها `ctx.skills.get()` وتستعملها أداةُ `skill`. ويخبر `resourceBase` الأداةَ كيف تعرض إرشادَ الموارد النسبية للمهارات المحلية أو ذات الروابط أو التي يديرها مزوّد.

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

وقد تُغفل مُدخَلاتُ مهارات وقت التشغيل ضوابطَ الاستدعاء وتسميةَ المزوّد. ويحلّ السجلُّ الافتراضين مرةً واحدة، ثم يستعمل صيغةَ التعريف الكاملة نفسَها وترتيبَ الجمع «الأولُ يفوز» نفسَه كالمزوّدين. ويزيل المُفكِّكُ المعاد الإسهامَ ويُبطل مخازنَ الاكتشاف.

```ts type-equiv
/** Runtime skill contribution accepted by `ctx.skills.register()`. */
type SkillRegistration = Omit<SkillDefinition, 'invocation' | 'provider'> & {
  /** Invocation controls; omission permits both model and user surfaces. */
  readonly invocation?: SkillInvocationPolicy
  /** Provider label; omission uses the registry-owned runtime provider. */
  readonly provider?: string
}
```

## البحث والضبط

البحثُ عن المهارات حساسٌ لدليل العمل لأن المزوّدين قد يكشفون مهاراتٍ محلية في مساحة العمل، وتلغي إشارتُه الاختيارية عملَ المزوّد للمستدعي. وتأخذ قراءاتُ السجل زيادةً على ذلك نطاقَ العارض — فيمرّر المستهلكون الوكيلَ المستدعي، وهو مفتاحُ نطاقه — عبر `SkillViewOptions`؛ ويستهلك السجلُّ `scope` لانتقاء الطبقات، ولا يقرأ المزوّدون من كائن الخيارات المستعار نفسِه إلا عقدَ `SkillLookupOptions`. ويُفحص الإلغاءُ قبل انتقاء الدليل وبعده، ومن ذلك إصاباتُ المخزن، ويسابق الاكتشافَ وتحميلَ التعريف الكامل معًا. وإن لم يُعثر على جذر git، عامل المزوّدُ المحلي دليلَ العمل المقدَّم نفسَه جذرَ المشروع.

ولا يخزّن السجلُّ التعريفاتِ الكاملة. فكلُّ `get()` ينادي المزوّدَ الفائز بالمرشح المنتقى، فيعيد المزوّدُ المحلي قراءةَ المتن الحالي. والتعريفُ الذي لم يعد اسمُه يطابق ذلك المرشحَ يُرفض ويُبطل ذلك المزوّدَ بعينه لإعادة الاكتشاف.

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

ولا يملك السجلُّ إلا حدَّ مخزن اكتشافه. ويملك المزوّدُ المحلي جذورَ نظام الملفات (`dshHome` و`agentsHome` و`customSkillDirs` و`bundledSkillDir`/`DSH_BUNDLED_SKILL_DIR` الاختياريين) مع تفعيل المراقب والاستطلاعِ والاستقرار والروابط الرمزية وضوابطِ سعة المشاريع. ويملك المستهلكُ حدَّ وصف دليله. والافتراضاتُ الدقيقة والتحقق في [دليل الضبط](../config-catalog.ar.md) المولَّد.

```ts type-equiv
/** Skill registry configuration. */
interface Config {
  /** Maximum number of completed cwd/provider catalogs kept in memory. */
  readonly collectCacheMaxEntries?: number
}
```

## دليل الجلسة وعقد الأداة

تحقن `dsh-tool-skill` تذكيرَ `<system-reminder>` الأول الدائم بدور المستخدم عند أول `agent/pre-step` في جلسة حية ترصد عرضًا كاملًا غيرَ فارغ. ولا يحتوي الدليلُ إلا `name` المهارات مرتَّبةً و`description` موحَّدًا ومُفلَتًا بنسق XML؛ ويُغفل المتونَ والمساراتِ والمصادرَ والمزوّدين وتلميحاتِ التوجيه. ويمرّر الاكتشافُ إشارةَ إجهاض الخطوة عبر `SkillLookupOptions`. و`catalogDescriptionMaxLength` هي ضبطُ المستهلك لحدّ الوصف، وافتراضُها `500` وأدناها عددًا صحيحًا `3`.

وقبل كل خطوة نموذج لاحقة، يطبّق المستهلكُ رؤيةَ الأدوات بعينها ويبصم المداخلَ المعروضة بعينها بين وسمَي `<available_skills>` من لقطة كاملة. ويشتق خطَّ أساس المقارنة من المداخل نفسِها في أحدث رسالة دليل مرئية يتعرف عليها وتنسبها الإضافةُ إلى نفسها. والبصمةُ المتغيّرة تُلحق استبدالًا كاملًا دائمًا عبر `agent.inject()`؛ وحذفُ كل مهارة يُلحق استبدالًا فارغًا صريحًا. وتُبقي اللقطاتُ غيرُ الكاملة آخرَ عرض نموذج جيد. وإن أخفى الضغطُ كلَّ رسائل الدليل التاريخية، أعادت اللقطةُ الكاملةُ التاليةُ إرساءَ الدليل الحالي؛ والعرضُ الفارغ بلا دليل سابق لا يُصدر شيئًا. ورسائلُ الدليل هذه تاريخُ جلسة لا حالةَ عالم.

وتتحقق أداةُ `skill({ name })` التي يراها النموذج من الاسم بنسق kebab-case، وتجد الملخصَ في الدليل المحايد تجاه الاستدعاء، وترفضه قبل التحميل ما لم يسمح `isModelInvocable` بالوصول، ثم تعيد قراءةَ التعريف الكامل لدليل عمل الوكيل المستدعي وتعيد فحصَ السياسة قبل إعادة المحتوى. وتبلّغ عن مهارة لم تُحلّ بأنها مجهولة أو لم تعد متاحة، وتعيد نتيجةَ أداة تحتوي `<skill_content name="...">` و`<skill_resources>` و`<skill_instructions>`. ويحلّ `resourceBase` السكربتاتِ والمراجعَ والأصولَ المشار إليها صراحةً عند الحاجة وحدها؛ ولا يعدّد الناتجُ المحمَّل دليلَ مهارة. ولذلك تغيّر تحريراتُ المتن وحدها نداءاتِ الأدوات اللاحقة بلا إنتاج رسائل دليل ولا إعادة كتابة نتائج أدوات سابقة.

## دليل الجلسة في المتصفح

يخاطب `SkillListRequest` جلسةً واحدة بـ`sessionId`؛ ويعيد `SkillListValue` المداخلَ القابلة لاستدعاء المستخدم مع الاسم والوصف وإرشاد الاستعمال الاختياري وإتاحةِ استدعاء النموذج. ويقرأ `SessionSkillCatalog` دليلَ عمل الجلسة والـpreset المسجَّل بلا تفعيل وكيل. وقد يقدّم وكيلٌ حي سجلَّه المنطاقي، بينما تستعمل الجلسةُ الباردة النطاقَ الدائم للـpreset.

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

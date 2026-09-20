# دليل عملي: إضافة حزمة إلى مساحة العمل

[English](adding-a-package.md) | العربية

قائمة التحقق ملفًّا ملفًّا لحزمة `@deepseek-ai/dsh-<name>` جديدة. وقد تُحقِّق من هذه القائمة مقابل حزمتَي bash والمهايئ قالبَين؛ فإن انحرفت عنهما فصحّحها هنا.

## 1. أنشئ الحزمة

```
packages/<group>/<pkg>/
  package.json     # copy from packages/core/tools, adjust name/description/deps
  tsconfig.json    # extends ../../../tsconfig.base.json, rootDir src,
                   # outDir lib/types, references: ../../../vendor/cosmokit,
                   # ../../../vendor/cordis (+ ../../../vendor/schemastery if
                   # you use Config, + ../../<group>/<dep> for each dsh dep)
  src/index.ts     # service default export or plugin (name/inject/apply/Config)
  README.md        # service API, events, extension points, design notes,
                   # + gated Model Experience context blocks or short form
                   # + the gated "Known Limitations and Deferred Work" section
                   # (or a whitelist entry in scripts/verify-package-readme-limitations.ts)
```

اختر مجموعةً قائمة متى طابقت دورَ الحزمة (`core` أو `llm` أو `shell` أو `compaction` أو `subagent` أو `todo` أو `session` أو `client` أو `host` أو `util` أو `test-support`). والمجموعةُ الجديدة مسموحة، لكنها حاوٍ خالص: بلا `package.json` وبلا ملفات مصدر، وتبقى الحزم على مستوًى واحد تحتها بالضبط.

وثوابت package.json (يُلزم بها `pnpm run constraints` عبر `scripts/check-workspace-constraints.ts`): `private: true`، و`version` مطابق لـ `package.json` في الجذر، و`type: module`، و`main: "lib/index.js"`، و`types: "lib/types/index.d.ts"`، و`exports["."].types: "./lib/types/index.d.ts"`، و`exports["."].default: "./lib/index.js"`، و`@deepseek-ai/cordis` في peerDependencies وdevDependencies **معًا** (بالنطاق نفسه). وانسخ كل اعتمادية dsh نظيرة إلى devDependencies. ويذهب `@deepseek-ai/schemastery` إلى `dependencies` (فهو مدقّق في وقت التشغيل)، مطابقةً لـ agent-loop. وتحتوي قائمةُ `files` بالضبط `lib/index.js` و`lib/types/**/*.d.ts` ونواتجَ وقت التشغيل الخاصة بالحزمة التي تعرفها البوابة؛ والحزمةُ التي تنشر `./invariant` تضم `lib/invariant.js` أيضًا. والحزمةُ التي يشير تصديرُ وقت تشغيلها إلى الشجرة المُخرَجة تضم `lib/types/**/*.js` أيضًا. ولا تنشر `src` ولا خرائطَ التصريحات ولا خرائطَ JS ولا ملفاتِ تصريحات بائتة في الجذر. وحزمُ تطبيقات CLI التي لها `bin` تضم `lib/bin.js` مباشرةً بعد `lib/index.js` في `files`.

والاستيرادات النسبية داخل الحزمة تستعمل محدِّدات `.ts` صريحة في المصدر (مثل `export * from './types.ts'`). ويعيد المصرّف كتابتها إلى `.js` في JavaScript المُخرَج، ويترك محدِّدات `.ts` صريحةً في التصريحات، فيحلّها مستهلكو TypeScript المعياريون بوضعَي NodeNext وNode16 إلى ملفات `.d.ts` الشقيقة.

## 2. سجّلها في إعدادات الجذر

| الملف | التغيير |
|---|---|
| `tsconfig.base.json` | لا تعديل لمجموعة قائمة؛ أما المجموعة الجديدة فأضف مرشَّح `./packages/<group>/*/src` إلى النمط العام `@deepseek-ai/dsh-*` |
| `tsconfig.host.json` (لحزمة Host) أو `tsconfig.client.json` (لحزمة Client) | أضف `{ "path": "./packages/<group>/<pkg>" }` إلى `references`؛ فالحزمة العادية تخص تجميعةً واحدة بالضبط، لا الاثنتين أبدًا. وتستعمل `api/remotes` قسمةً خاصة بالمستودع لأن Host يولّد عقدًا يستهلكه Client في طور لاحق؛ وعلى الحزم الجديدة ألّا تنسخها ([التخطيط](../development.ar.md#typescript-project-layout)) |

وحزمةُ `packages/client/*` توسّع فوق ذلك `tsconfig.base.client.json` بدل `tsconfig.base.json`، وحزمةُ إضافة العميل تعلن `dsh.client` في package.json، وتصدّر `./client`، وتستدعي إعداد tsdown المشترك (`packages/client/tsdown.client.ts`)؛ انظر [packages/client/AGENTS.md](../../packages/client/AGENTS.md) لعقد جانب العميل.

وتغطيها الأنماط العامة أو اكتشافُ بيانات الحزم تلقائيًا فلا تحتاج تعديلًا: مساحات العمل في `package.json` في الجذر، و`scripts/publint-all.ts`، و`tsdown.config.ts`، و`.oxlintrc.json`، و`scripts/check-workspace-constraints.ts`.

## 3. قرّر طوبولوجيا الحزمة

في القدرة القابلة للاستبدال، افصل أدوارَ Service Definition وService Provider وConsumer في حزم حين تتطوّر مستقلةً (انظر قسم «seams القدرات» في docs/architecture.ar.md، وثلاثيُّ shell هو القالب). أما الإضافةُ ذات الغرض الواحد فتبقى حزمةً واحدة.

### سمِّ الدور القائم

سمِّ المسؤوليةَ الحالية الثابتة. ولا تسمِّ التنفيذَ الأول، ولا توسّعًا مستقبليًا محتملًا، ولا صنفَ Cordis الأساس. وحزمةُ الواجهة تسمّي القدرة. وحزمةُ التنفيذ تضيف الآليةَ أو البروتوكول أو البيئة أو المزوّد الذي يميّزها. ولا تستعمل `local` إلا حين يكون التنفيذ على المضيف نفسه جزءًا من العقد.

واستعمل مفتاح `ctx` مفردًا لمحرّك أو وقت تشغيل أو سياسة أو متحكّم أو محلِّل أو مخزن أو إعداد حالي واحد. واستعمل المفتاح جمعًا لـ registry أو لخدمة تملك عدة أعضاء مسمّين. ويجب أن يتفق دورُ الصنف وعددُ المفتاح. ولا تعِد استعمال مفتاح `Context` واحد في Cordis لتصريحَي مضيف وعميل غير متوافقين، فدمجُ التصريحات في TypeScript يرى الوجهين وإن استعملا سياقَي تشغيل منفصلين. وأضف لاحقةَ الدور حين يكون الجمعُ الطبيعي مملوكًا لوجه آخر أصلًا.

| الكلمة | استعملها حين | لا تستعملها حين |
|---|---|---|
| `Controller` | يقبل أوامر أو نيةَ مستخدم ويغيّر حالةَ مجال أو عرضٍ قائمة واحدة. | ينفّذ عملًا اعتباطيًا، أو يملك أسطولَ مزوّدين، أو يحوّل القيمَ للعرض فقط. |
| `Store` | يملك مجموعةَ بيانات واحدة ويقدّم أساسًا عملياتِ CRUD أو اللقطات أو الاشتراك لها. | يتحقق من آلة حالات، أو يفصل في المرجعية، أو يوزّع عملًا، أو يملك أسبقيةَ المزوّدين. فوجودُ خريطة لا يجعل الصنفَ مخزنًا. |
| `Directory` | يكشف المداخلَ وبياناتِها الوصفية للاكتشاف أو الاختيار. | يسجّل المنتجون فيه تنفيذاتٍ اعتباطية، أو ينفّذ المستدعون عملًا عبره. |
| `Presenter` | تحويلٌ خالص من قيم المجال أو وسائط الأدوات إلى نيّة تصيير. | يجري إدخالًا وإخراجًا، أو يشترك، أو يغيّر حالة، أو يملك دورةَ حياة. |
| `Registry` | يملك مجموعةً ديناميكية من التسجيلات المسمّاة، بما فيها البحثُ وقواعدُ التكرار والأسبقية والعمرُ والتحرير. | عقدُه الأساسي التوزيعُ أو التنفيذ أو الإلغاء أو السياسة أو التنسيق. |
| `Runtime` | يشغّل عملًا حيًّا ويملك التوزيعَ أو الإلغاء أو تنسيقَ المزوّدين أو دورةَ حياة العمليات عبر الاستدعاءات. | يخزّن السجلات فقط، أو يعيد دليلًا، أو يحلّ قيمةً واحدة، أو يحمل إعدادًا. |
| `Resolver` | يحسب جوابًا واحدًا أو يحدّد موضعَه من مدخلات مقدَّمة دون أن يملك عمرَ ذلك الجواب. | يملك مجموعةً قابلة للتغيير أو تنفيذًا طويل الأمد. |
| `Binder` | يربط واجهةً معلَنة واحدة بسياق مستدعٍ أو بدورة حياة ويعيد القيمةَ المربوطة. | يملك القيمةَ مجموعةً، أو يتحكم في حالة مجالها، أو يحوّل البيانات فقط. |
| `Engine` | ينفّذ خوارزميةَ مجال أو نموذجَ تنفيذ ذا حالة. | يختار مزوّدًا فقط أو يمرّر عبر حدّ بروتوكول. |
| `Policy` | يقرّر ما هو مسموح أو مختار أو محدود أو مراقَب. | ينفّذ الآليةَ التي يسمح بها القرار. |
| `Executor` | ينفّذ طلبًا صريحًا واحدًا أو مواصفةً محلولة في قدرة واحدة. | يملك دورةَ حياة تطبيق عريضة أو دليلَ مزوّدين. |
| `Gateway` | يهايئ حدَّ عملية أو شبكة أو RPC أو واجهة. | يسجّل خدماتٍ في العملية نفسها فقط أو يخزّن بياناتٍ وصفية. |
| `Provider` | يوفّر تنفيذًا واحدًا لتعريف قدرة. وأضف مؤهِّلَ آلية أو مزوّد حين يمكن وجود عدة تنفيذات. | هو تعريفُ القدرة أو registry المزوّدين أو وقتُ تشغيل المستهلك. |
| `Backend` | ينفّذ حفظًا أو نقلًا أو تنفيذًا أدنى مستوى وقابلًا للاستبدال خلف واجهة معرَّفة. | خدمةٌ تواجه المستخدم أو مرجعٌ واحد لمورد حي يُعاد. |
| `Handle` | يشير إلى مورد حي واحد ويتحكم فيه أو يراقبه. | ينشئ مجمّعَ الموارد كاملًا ويديره. |
| `Config` | يملك قيمةَ إعداد محلولة واحدة أو سجلًّا محدودًا بإحكام وعقدَ تحديثه. | يخزّن مجموعةً عامة، أو ينفّذ عملًا، أو يكشف إعداداتٍ غير متصلة. |
| `Service` | يملك خدمةَ مجال متماسكة لا يصفها بصدق أيُّ دور أدقّ أعلاه. | الاسمُ موجود لمجرد أن الصنف يوسّع `Service` في Cordis. |

ولا تستعمل `SDK` إلا لبروتوكول JSON-RPC بين العميل والخادم الذي تستعمله حزمتا Python وTypeScript المدعومتان. فـ DeepSeek Harness نفسه إطارُ تشغيل وكلاء لا مشروعَ SDK. واستعمل الهجاء المعياري للمنتج `Typert`، ولا تكتب `TypeRT` ولا `typeRT` أبدًا.

<a id="4-write-the-package-readme"></a>

## 4. اكتب README الحزمة

قدّم أولًا واجهةَ الخدمة والإعدادَ والأحداثَ ونقاطَ الامتداد وملاحظاتِ التصميم الخاصة بالحزمة. واختر `kind` في الواجهة الأمامية من أربع تسميات في [مرجع بيانات dsh-doc الوصفية](../../.agents/skills/dsh-doc/references/metadata-links-i18n.md#the-kind-system): group أو reference أو library أو bundle، بما يطابق موضعَ الحزمة في المستودع وصيغةَ مدخلها؛ وكل نوع يختار قالبَ README واحدًا. ويسجّل قسمُ الحدود الثغراتِ الدائمة التي يراها المستهلك والقيودَ غير البدهية التي يملكها المشرف في هذه الحزمة؛ أما التنظيفُ المعتاد فيبقى في TODO في مصدره أو في Agent Note. ويجوز لجملة تجربة النموذج غير المباشرة أن تسمّي المستهلكَ الذي يُظهر مساهمةَ هذه الحزمة، لكنها لا تعيد وصفَ تنفيذ ذلك المستهلك. وأنهِ README الحزمة بهذا التسلسل المعياري:

````markdown
## Model Experience

### Request context and condition

#### What the model sees

The exact data-dependent fields, an anchored generated-catalog link, or an introduction to the verbatim literal below.

##### Verbatim text for this field, when needed

```markdown
Stable system-prompt prose of any length, or another long non-generated literal, copied exactly from source.
```

#### Token effect

Fixed, conditional, retained, replaced, capped, or zero-direct token effect.

#### KV Cache effect

Append-only, prefix-stable, replacing, or independent behavior, including the exact conditions that may invalidate reuse.

## Known Limitations and Deferred Work

- **Consumer-visible gap** — exact missing operation or case, its consequence, and any maintainer constraint.
````

واملأ تجربة النموذج من التنفيذ. واستعمل H3 واحدًا لكل مدخل سياق مباشر أو شرطي أو محدود أو ذي عمر أو مساعد، مع حقول H4 الثلاثة المرتَّبة أعلاه وفقرةٍ واحدة تحت كل منها. واقتبس النصَّ الثابت الذي تملكه الحزمة: فنثرُ توجيه النظام يذهب في H5 معنون وسور `markdown` تحت الحقل الذي يقدّمه، وهو عادةً `What the model sees`؛ وتبقى النصوصُ القصيرة الأخرى سطريةً بعناصر نائبة مسمّاة، وتستعمل النصوصُ الطويلة الأخرى الصيغةَ المتداخلة نفسها. ولا تلخّص إلا النصَّ المعتمد على البيانات أو الذي يملكه المزوّد. ومدخلُ schema الأداة يربط قسمَه المرسّى في [دليل الأدوات](../tool-catalog.ar.md) المولَّد ولا يذكر إلا الفروق الغائبة عنه. وأبقِ مدخلَي التوجيه وschema منفصلين حين يستطيع تحديدُ النطاق إخفاءَ أحدهما دون الآخر. وفي `KV Cache effect` ميّز النموَّ بالإلحاق وحده، والبادئةَ المكرّرة الثابتة، واستبدالَ رموز طلب سابق، وطلبَ نموذج مستقلًّا، ثم سمِّ التغييراتِ التي تملكها الحزمة والتي قد تبطل إعادةَ الاستعمال. و«لا يُبطل» تعني أن الحزمة تحفظ بادئةً قابلة لإعادة الاستعمال أصلًا؛ أما توفّرُ ذاكرة المزوّد المؤقتة وإخلاؤها فخارج عقد الحزمة. ويحكم [معيار النثر](../../.agents/skills/dsh-prose-standard/SKILL.md) الاكتمالَ والملكية؛ ويُلزم المدقّق ببنية الأقسام المطلوبة.

والحزمةُ التي لا أثر لها في السياق أو التي مسارُها مملوك لمستهلك تستعمل الجملةَ المدقَّقة `None, as ` أو `Indirectly, through ` في [`SENTENCE_MODEL_EXPERIENCE`](../../scripts/verify-package-readme-model-experience.ts)، يتبعها `KV Cache effect` بمستوى H4 وفقرةٌ واحدة غير فارغة؛ أما الحزمةُ العامة المحايدة تجاه النموذج فقد تنضم بدل ذلك إلى `NO_MODEL_EXPERIENCE_SECTION`. ولا توسّع أيًّا من الحالتين إلى وصف عمل حزمة أخرى. و[قائمة السماح](../../scripts/verify-package-readme-limitations.ts) الخاصة بالحدود مستقلة. ويسجّل [Agent Note عن تجربة النموذج](../../.agents/notes/implemented/process/2026-07-12-package-model-experience-contract.ar.md) التبرير.

## 5. تحقّق

```sh
pnpm install        # registers the workspace
pnpm run doc-sync
pnpm run constraints && pnpm run typecheck && pnpm run lint
pnpm run build && pnpm run hygiene
```

واتبع [سياسة الاختبار في المستودع](../testing.ar.md) لفحوص السلوك والتغطية التي تشترطها الحزمة الجديدة.

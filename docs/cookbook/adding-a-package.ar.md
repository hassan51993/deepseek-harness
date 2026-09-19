# فعلي تشغيل يد سجل: إضافة workspace حزمة

[English](adding-a-package.md) | العربية

لـ جديد بناء `@deepseek-ai/dsh-<name>` حزمة توفير تدريجي ملف بيان. هذا بيان بـ bash و مهايئ هذا اثنان عدد حزمة لـ نموذج لوح إجراء تحقق؛ إذا بيان و نموذج لوح لديه خروج دخول، طلب في هذا إصلاح صحيح.

## 1. إنشاء حزمة

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

عند قد لديه قسم مجموعة و حزمة زاوية لون مطابقة وقت، اختيار هذا قسم مجموعة (`core`،`llm`،`shell`،`compaction`،`subagent`،`todo`،`session`،`client`/`host`،`util` أو `test-support`). سماح جديد بناء قسم مجموعة، لكن قسم مجموعة فقط هو صاف حاوية: لا يوجد `package.json`، لا يوجد مصدر ملف، حزمة ما زال تماما جيد يقع في ذلك تحت واحد طبقة.

package.json ثابت صيغة (من `pnpm run constraints` / `scripts/check-workspace-constraints.ts` قوي صنع تنفيذ):`private: true`،`version` و أصل `package.json` متسق،`type: module`،`main: "lib/index.js"`،`types: "lib/types/index.d.ts"`،`exports["."].types: "./lib/types/index.d.ts"`،`exports["."].default: "./lib/index.js"`،`@deepseek-ai/cordis` معا ظهور في peerDependencies و devDependencies في (نفسه نطاق). كل dsh مقابل انتظار اعتماد (peer dependency) كل يلزم في devDependencies في مرآة مثل.`@deepseek-ai/schemastery` وضع في `dependencies` في (هو هو وقت التشغيل تحقق جهاز) ، و agent-loop إبقاء متسق.`files` قائمة دقيق يتضمن `lib/index.js`،`lib/types/**/*.d.ts` و بوابة إقرار يمكن حزمة مخصص استخدام وقت التشغيل ناتج؛ إصدار `./invariant` حزمة أيضا يلزم يتضمن `lib/invariant.js`. إذا حزمة وقت التشغيل export إشارة نحو إخراج شجرة، أيضا يلزم يتضمن `lib/types/**/*.js`. لا يلزم إصدار `src`، إعلان خريطة،JS map أو قديم قديم أصل إعلان ملف. حمل لديه `bin` CLI تطبيق حزمة في `files` في سوف `lib/bin.js` ضيق تتبع في `lib/index.js` بعد.

حزمة داخل متبادل مقابل استيراد في شفرة المصدر في استخدام صريح `.ts` بعد لاحقة (مثال مثل `export * from './types.ts'`). تحرير ترجمة جهاز في إخراج JS في سوف ذلك إعادة كتابة لـ `.js`، في إعلان ملف في إبقاء صريح `.ts` بعد لاحقة؛ معيار NodeNext/Node16 TypeScript مستهلك سوف سوف ذلك تحليل إلى نفس دليل `.d.ts` ملف.

## 2. في أصل إعداد في تسجيل

| ملف | تغيير |
|---|---|
| `tsconfig.base.json` | قد لديه قسم مجموعة بلا حاجة تحرير؛ جديد قسم مجموعة يحتاج لـ `@deepseek-ai/dsh-*` عبر إعداد رمز إضافة `./packages/<group>/*/src` مرشح مسار |
| `tsconfig.host.json`(Host حزمة) أو `tsconfig.client.json`(Client حزمة) | في `references` في إضافة `{ "path": "./packages/<group>/<pkg>" }`——عادي حزمة تماما جيد يخص واحد aggregate، أبدا اثنان عدد كل إضافة.`api/remotes` بسبب Host توليد اتفاق و Client إزالة استهلاك اتفاق بين وجود ترتيب اعتماد بينما استخدام مستودع مخصص تابع تفكيك قسم، إضافة جديدة حزمة لا نيل محاكاة وفق ([تخطيط](../development.ar.md#typescript-project-layout)) |

`packages/client/*` حزمة تعديل لـ extends `tsconfig.base.client.json`(بينما غير `tsconfig.base.json`) ؛client إضافة حزمة أيضا يحتاج في package.json إعلان `dsh.client`، توجيه خروج `./client`، استدعاء مشترك tsdown preset(`packages/client/tsdown.client.ts`)——client جانب رؤية [packages/client/AGENTS.md](../../packages/client/AGENTS.md).

التالي محتوى من glob أو حزمة manifest(بيانات وصفية بيان) اكتشاف آلية تلقائي تغطية، بلا حاجة يد حركة تحرير: أصل `package.json` workspaces،`scripts/publint-all.ts`،`tsdown.config.ts`،`.oxlintrc.json`،`scripts/check-workspace-constraints.ts`.

## 3. تحديد حزمة توسيع اندفاع

مقابل في يمكن استبدال قدرة، عند Service Definition/Service Provider/Consumer زاوية لون حاجة مستقل عرض دخول وقت، سوف هو جمع تفكيك قسم إلى مختلف حزمة في (رؤية docs/architecture.md § "Capability seams"——shell ثلاثة مكون هو نموذج لوح). مفرد واحد استخدام طريق إضافة إبقاء لـ واحد حزمة.

### استخدام رمز دمج فعلي زاوية لون اسم

اسم يجب وصف حالي مستقر مسؤولية. لا يلزم استخدام أول عدد تنفيذ، ممكن لم قدوم توسيع أو Cordis أساس صنف تسمية. واجهة حزمة استخدام قدرة اسم. تنفيذ حزمة إضافة فوق قدرة كاف منطقة قسم تنفيذ آلية، بروتوكول، بيئة أو مصنع تجارة حد تحديد كلمة. فقط لديه نفس رئيسي آلة تنفيذ يخص اتفاق وقت، عندئذ استخدام `local`.

واحد engine،runtime،policy،controller،resolver،store أو حالي إعداد استخدام مفرد عدد `ctx` key.registry أو يملك كثير عدد أداة اسم عضو خدمة استخدام تكرار عدد key. صنف زاوية لون و key مفرد تكرار عدد يجب متسق. لا نيل يجعل لا توافق host و client إعلان إعادة استخدام نفس عدد Cordis `Context` key. أي جعل اثنان من استخدام مستقل وقت التشغيل context،TypeScript إعلان دمج ما زال سوف معا يرى اثنان نوع نوع. إذا ذاتي لكن تكرار عدد قد يخص آخر عدد طرف وجه، حينئذ زيادة مسؤولية بعد لاحقة.

| كلمة | ملائم استخدام شرط | لا ملائم استخدام شرط |
|---|---|---|
| `Controller` | قبول أمر أو مستخدم معنى رسم، و تغيير واحد بند قائم مجال حالة أو عرض حالة. | تنفيذ مهمة معنى عمل، يملك واحد مجموعة provider، أو فقط يأخذ قيمة تحويل لـ عرض شكل صيغة. |
| `Store` | يملك واحد مجموعة بيانات، رئيسي يلزم توفير هذا بيانات CRUD،snapshot أو subscription عملية. | تحقق حالة آلة، قطع قرار إذن، قسم إرسال عمل أو يملك provider أولوية درجة. صنف في لديه map لا انتظار في store. |
| `Directory` | كشف توفير اكتشاف أو اختيار بند و ذلك بيانات وصفية. | producer نحو منها تسجيل مهمة معنى تنفيذ، أو استدعاء جهة عبر هو تنفيذ عمل. |
| `Presenter` | سوف مجال قيمة أو أداة معامل صاف تحويل لـ تصيير معنى رسم. | تنفيذ I/O، حجز قراءة، تعديل حالة أو يملك دورة الحياة. |
| `Registry` | يملك واحد مجموعة حركة حالة أداة اسم تسجيل، و استعلام، تكرار بند أو أولوية درجة قاعدة، دورة الحياة و تحرير. | رئيسي يلزم اتفاق هو قسم إرسال، تنفيذ، إلغاء، سياسة أو تحرير ترتيب. |
| `Runtime` | تشغيل فوري عمل، و عبر استدعاء يملك قسم إرسال، إلغاء،provider تنسيق ضبط أو عملية دورة الحياة. | فقط تخزين سجل، إرجاع دليل، تحليل واحد قيمة أو حفظ إعداد. |
| `Resolver` | أصل حسب إدخال حساب حساب أو تحديد موضع واحد جواب سجل، لكن لا يملك هذا جواب سجل دورة الحياة. | يملك متغير تجميع دمج أو طويل وقت تشغيل تنفيذ مرور مسار. |
| `Binder` | يأخذ واحد قد إعلان واجهة ربط إلى استدعاء جهة context أو دورة الحياة، و إرجاع ربط قيمة. | يأخذ هذا قيمة بصفة تجميع دمج يحتفظ، تحكم ذلك مجال حالة، أو فقط تحويل بيانات. |
| `Engine` | تنفيذ مجال حساب قاعدة أو لديه حالة تنفيذ نموذج. | فقط اختيار provider أو عبر بروتوكول حد تحويل إرسال طلب. |
| `Policy` | قرار سماح، اختيار، حد أو مراقبة ماذا. | تنفيذ هذا قرار الذي سماح آلية. |
| `Executor` | في واحد بند قدرة في تشغيل واحد واضح طلب أو قد تحليل spec. | يملك واسع عام تطبيق دورة الحياة أو provider دليل. |
| `Gateway` | ملائم إعداد عملية، شبكة شبكة،RPC أو API حد. | فقط تسجيل نفس عملية خدمة أو تخزين بيانات وصفية. |
| `Provider` | توفير واحد بند قدرة تعريف واحد تنفيذ. وجود كثير عدد تنفيذ وقت، إضافة فوق آلية أو مصنع تجارة حد تحديد كلمة. | يمثل قدرة تعريف،provider registry أو مستهلك runtime. |
| `Backend` | في قد تعريف واجهة بعد تنفيذ يمكن استبدال قاع طبقة حفظ دائم، نقل أو تنفيذ. | يمثل موجه إلى مستخدم خدمة أو واحد قد إرجاع فوري مورد مرجع. |
| `Handle` | مرجع واحد فوري مورد، و تحكم أو مراقبة هذا مورد. | إنشاء و إدارة كامل مورد حوض. |
| `Config` | يملك واحد قد تحليل إعداد قيمة، أو واحد بند حد صارم إطار إعداد سجل و ذلك تحديث اتفاق. | تخزين عام تجميع دمج، تنفيذ عمل أو كشف غير متصل ضبط. |
| `Service` | يملك واحد بند لا يمكن استخدام بـ فوق أكثر دقيق زاوية لون صدق فعلي وصف داخل تجمع مجال خدمة. | فقط لأن صنف وراثة Cordis `Service` بينما استخدام هذا اسم. |

فقط مقابل تلقي دعم حمل Python و TypeScript SDK الذي استخدام JSON-RPC عميل/خادم بروتوكول استخدام `SDK`.DeepSeek Harness ذاته هو agent harness، لا هو SDK مشروع. منتج تجميع كتابة موحد واحد استخدام `Typert`، لا نيل استخدام `TypeRT` أو `typeRT`.

<a id="4-write-the-package-readme"></a>

## 4. تحرير كتابة حزمة README

سوف حزمة خاص لديه خدمة API، إعداد، حدث، نقطة توسيع و تصميم شرح وضع في قبل وجه. أصل حسب [dsh-doc بيانات وصفية مشاركة اعتبار](../../.agents/skills/dsh-doc/references/metadata-links-i18n.md#the-kind-system) في أربعة نوع kind وسم——مجموعة، مشاركة اعتبار، مكتبة أو bundle——اختيار frontmatter `kind`، جعل ذلك مطابقة حزمة في مستودع في موضع و مدخل شكل؛ كل kind تماما جيد مقابل واحد README نموذج لوح.limitations جزء سجل حمل دائم مستهلك نقص فتحة و هذه الحزمة يملك غير إظهار بينما سهل رؤية صيانة من قيد؛ يوم معتاد تنظيف أمر بند إبقاء في شفرة المصدر TODO أو Agent Note في. بين وصل Model Experience لغة جملة يمكن نقطة اسم كشف هذه الحزمة مساهمة مستهلك، لكن لا إعادة وصف هذا مستهلك تنفيذ. حزمة README بـ مثل تحت مواصفة تسلسل ربط ذيل:

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

أصل حسب تنفيذ ملء كتابة Model Experience. كل مباشر، شرط، حد أعلى، دورة الحياة أو مساعد مساعدة نموذج سياق بند استخدام واحد H3، يتضمن فوق وصف ثلاثة عدد لديه ترتيب H4 حقل، كل حقل تحت لديه واحد متن مقطع سقوط. مرجع حزمة يملك مستقر نص: توجيه النظام وضع في جذب خروج هو حقل تحت، استخدام حمل عنوان H5 إضافة `markdown` محيط شريط يمثل، عبر معتاد عودة دخول `What the model sees`؛ أخرى قصير نص بـ تسمية احتلال موضع رمز داخل ربط، أخرى طويل نص استخدام نفسه تضمين طقم شكل صيغة. فقط عام وصف بيانات اعتماد أو مزود يملك نص. أداة schema بند رابط إلى توليد[أداة دليل](../tool-catalog.ar.md) في مقابل مرساة تحديد فصل عقدة، فقط شرح هذا موضع ناقص فرق مختلف. عند أثر مجال يمكن إخفاء prompt أو schema منها لـ واحد بينما لا أثر آخر عدد وقت، سوف اثنان من قسم فتح. ملء كتابة `KV Cache effect` وقت، ينبغي منطقة قسم فقط إلحاق زيادة طويل، مستقر تكرار بادئة، استبدال قائم طلب token و مستقل نموذج طلب، و صف خروج سوف جعل ذاكرة مؤقتة إعادة استخدام بطلان، كما من هذه الحزمة يملك تغير.“لا جعل ذاكرة مؤقتة بطلان” فقط يمثل هذه الحزمة إبقاء قد لديه يمكن إعادة استخدام بادئة؛ ذاكرة مؤقتة هل متاح و أي وقت تصفية استبعاد لا يخص هذه الحزمة اتفاق.[سطر نص معيار](../../.agents/skills/dsh-prose-standard/SKILL.md) قيد كامل صفة و ملكية؛ تحقق جهاز قوي صنع تنفيذ الذي يحتاج فصل عقدة بنية.

لا يوجد سياق فاعلية نتيجة أو فقط لديه مستهلك يملك مسار حزمة استخدام [`SENTENCE_MODEL_EXPERIENCE`](../../scripts/verify-package-readme-model-experience.ts) في مرور مرور مراجعة حساب `None, as ` أو `Indirectly, through ` لغة جملة، مع بعد إضافة `KV Cache effect` H4 و واحد غير فارغ متن مقطع سقوط؛ و نموذج غير متصل عام حزمة يمكن تعديل لـ إضافة دخول `NO_MODEL_EXPERIENCE_SECTION`. اثنان نوع حال حال كل لا يلزم توسيع لـ مقابل آخر عدد حزمة عمل وصف.limitations [allowlist](../../scripts/verify-package-readme-limitations.ts) مستقل إدارة.[Model Experience Agent Note](../../.agents/notes/implemented/process/2026-07-12-package-model-experience-contract.ar.md) سجل تصميم حركة آلة.

## 5. تحقق

```sh
pnpm install        # registers the workspace
pnpm run doc-sync
pnpm run constraints && pnpm run typecheck && pnpm run lint
pnpm run build && pnpm run hygiene
```

طلب التزام دوران[مستودع اختبار سياسة سياسة](../testing.ar.md) ، تنفيذ جديد حزمة الذي يحتاج سلوك مخصص بند فحص و بلوغ إلى متبادل ينبغي نسبة التغطية.

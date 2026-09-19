# Agent Note: مستودع تسمية اتفاق و مسبق إصدار إعادة تسمية بيان

Status: implemented
Archived: 2026-09-04

[English](2026-08-11-repository-naming-contract-and-rename-ledger.md) | العربية

## مشكلة

مستودع إرسال عرض سرعة درجة سبق تجاوز مرور جزء اسم عرض دخول سرعة درجة. واحد بعض حزمة اسم وصف هو الأكثر أول تنفيذ، بينما غير الذي توفير قدرة. إذا جاف صنف أي جعل فعلي تحمل تحمل سجل التسجيل، وقت التشغيل، جذب محرك، تحكم جهاز أو محلل مسؤولية، اسم ما زال استخدام `Service`. جزء `ctx` مفتاح بـ مفرد عدد تسمية سجل التسجيل، لكن بـ تكرار عدد تسمية مفرد عدد جذب محرك. أيضا لديه واحد بعض مزود واضح واضح عبر يمكن استبدال نظام الملفات أو عملية فرعية خدمة عمل، يمكن في آخر تنفيذ بيئة في تشغيل، اسم لكن استخدام `local`.

هذه اسم و غير غير متصل ضيق يلزم. اسم سوف إبلاغ إبلاغ مساهمة من واحد بند مسؤولية من أي داخل بدء، إلى أي داخل انتهاء.`Store` يمثل بيانات وصول.`Registry` يمثل تسجيل و فحص بحث.`Runtime` يمثل فوري تنفيذ و دورة الحياة. إذا نفس عدد كلمة معا يمثل هذا ثلاثة من، استدعاء جهة حينئذ يجب قراءة قراءة تنفيذ، عندئذ قدرة حكم قطع أي عدد كائن يملك سياسة، عمل أو حالة.

مستودع أيضا سبق في اثنان نوع يحتوي معنى تحت استخدام `SDK`. تلقي دعم حمل Python و TypeScript عميل استخدام JSON-RPC SDK بروتوكول. مشروع كامل جسم هو DeepSeek Harness، بينما لا هو SDK مشروع. قد إزالة SDK مشروع أداة سلسلة جعل عرض عام يحتوي معنى فقد ذهاب اعتماد حسب، لكن نص سجل و اسم ما زال إبقاء جزء قديم استخدام قاعدة.

أول مرة إصدار حمل وسم إصدار قبل الأكثر بعد واحد نافذة، جعل مستودع درجة إعادة تسمية ما زال يمكن منخفض صار هذا إتمام. إذا متابعة إبقاء يحتوي معنى لا صاف اسم، أحيانا لكن شكل صار مفردات حينئذ سوف تغيير صار توافق صفة اتفاق.

## قرار

مستودع استخدام هذا بيان في الكل حالي اسم. هذا قرار فقط أكثر تعديل اسم؛ حزمة مسؤولية، خدمة حد، سلوك، قيمة افتراضية و بيانات نموذج إبقاء ثابت. إذا بعض عدد اسم كشف خروج لا دمج إدارة حد، حاجة آخر كتابة واحد نسخة proposed Agent Note، مخصص باب رفع اقتراح حد تغيير.

كل قد إعادة تسمية نظام صف فقط لديه واحد طقم مفردات. بيان نقطة اسم بعض واحد واجهة وقت، ذلك دليل،NPM حزمة اسم، استيراد،Cordis إضافة اسم،`ctx` مفتاح، عام نوع، مباشر اقتران دمج حدث أو أداة معرف رمز، إعداد، اختبار،fixture(اختبار قبل وضع بيانات) ، عرض مثال، توليد مشاركة اعتبار مورد مادة و حالي وثيقة كل استخدام حالي اسم. مستودع لا إبقاء آخر اسم، توافق حزمة، تكرار خدمة مفتاح، مزدوج إعادة حدث اسم أو رجوع محلل، و رفض قديم اسم.

نفس نظام صف لن عام اثنان طقم مفردات.

### `SDK` فقط يمثل واحد عنصر أمر

`SDK` يمثل تلقي دعم حمل Python و TypeScript SDK الذي استخدام، أساس في JSON-RPC عميل/خادم بروتوكول. مستودع إبقاء `@deepseek-ai/dsh-sdk-client`،`@deepseek-ai/dsh-sdk-protocol` و بروتوكول هوية `deepseek-harness-sdk-runtime`؛JSON-RPC خادم يخص نفس نظام صف.DeepSeek Harness ذاته لا هو SDK، قد إزالة مشروع توليد جهاز، بدء جهاز، مساعد مساعدة أداة و بدء جهاز بعيد قياس حزمة متابعة إبقاء لا وجود.

هذا قرار جزء يحل محل ثلاثة بند الآن سطر قرار. هو استبدال[حزمة إعادة قسم مجموعة قرار](2026-07-29-package-regrouping.zh.md) في إبقاء `bash/`،`pty/` و `self-modification/` مجموعة اسم، و اثنان بند مؤقت تحديد حزمة اسم. هو فقط استبدال[إزالة SDK مشروع أداة سلسلة](../simplification/2026-08-11-remove-sdk-project-toolchain.zh.md) في سوف كامل مستودع تسمية لـ SDK قول قاعدة؛ بعد من ما زال مسؤول شرح حذف نطاق و إبقاء وقت التشغيل SDK. هو فقط استبدال[أداة استدعاء مهلة سياسة](2026-07-07-tool-call-timeout-policy.zh.md) في حزمة اسم إدارة من؛ مهلة آلية و ذلك `guard/timeout-policy/` ملكية إبقاء ثابت.

إذا أخرى قد تنفيذ شرح في حزمة، مسار أو نوع يتم إعادة تسمية، بينما ذلك حد و إدارة من إبقاء ثابت، فإن هذا قرار لن يحل محل هذه شرح. هذه شرح استخدام قد تنفيذ واقع اسم. ثلاثة بند يتم جزء يحل محل قرار كل رابط عودة هذا قرار.

### حسب فعلي مسؤولية تسمية

استخدام معتاد رؤية كما أداة جسم اسم كلمة. اسم ينبغي وصف مستقر مسؤولية، بينما لا هو الأكثر أول تنفيذ، حالي دليل أو لم قدوم ممكن ظهور توسيع. لا نيل إضافة لا نقل تمرير أي معلومة كلمة. لا نيل لـ تقليص قصير اسم بينما حذف لأجل حد تحديد أثر مجال كلمة.

واجهة حزمة بـ قدرة تسمية. تنفيذ حزمة زيادة آلية، بروتوكول، بيئة أو توفير ينبغي تجارة حد تحديد كلمة، بـ منطقة قسم مختلف تنفيذ. فقط لديه نفس رئيسي آلة تنفيذ يخص اتفاق وقت، عندئذ قدرة استخدام `local`. إذا مزود فقط هو عبر يمكن استبدال `ctx.fs` قراءة نظر يشبه محلي مسار، أو عبر يمكن استبدال `ctx.subprocess` بدء عمل، حينئذ لا نيل استخدام هذا كلمة.

إذا كائن هو مفرد عدد جذب محرك، وقت التشغيل، سياسة، تحكم جهاز، محلل، تخزين أو حالي إعداد، استخدام مفرد عدد `ctx` مفتاح. إذا كائن هو سجل التسجيل، أو خدمة يملك كثير عدد أداة اسم عضو، استخدام تكرار عدد مفتاح. صنف مسؤولية و مفتاح مفرد تكرار عدد يجب متسق. تكرار عدد مفتاح ذاته لا يستطيع إثبات كائن هو سجل التسجيل؛ ينبغي من ذلك عملية و كل حق قرار. لا نيل يجعل لا توافق host و client إعلان إعادة استخدام نفس عدد Cordis `Context` مفتاح. أي جعل اثنان من استخدام مستقل وقت التشغيل سياق،TypeScript إعلان دمج ما زال سوف معا يرى اثنان نوع نوع. إذا ذاتي لكن تكرار عدد قد يخص آخر عدد طرف وجه، حينئذ زيادة مسؤولية بعد لاحقة.

فقط عند لا يوجد أكثر دقيق مسؤولية كلمة قدرة كاف مثل فعلي وصف كائن وقت، عندئذ استخدام `Service`.`GoalService` و `SessionTitleService` هو إبقاء صالح اسم، لأن هو جمع كل منها يملك مجال خدمة، ذلك عمل لا يمكن دقيق تأكيد عودة نحو لـ تخزين، تسجيل أو مفرد واحد تنفيذ آلية.

### مسؤولية كلمة أي اتفاق

| كلمة | ملائم استخدام مشهد | لا ملائم استخدام مشهد |
|---|---|---|
| `Controller` | كائن قبول أمر أو مستخدم معنى رسم، و أكثر تعديل واحد بند قد لديه مجال حالة أو عرض حالة. هو تنسيق ضبط محدود حالة تحويل. | كائن تنفيذ مهمة معنى عمل، إدارة واحد مجموعة مزود، أو فقط سوف قيمة تحويل لـ عرض شكل صيغة. |
| `Store` | كائن يملك واحد مجموعة بيانات، رئيسي يلزم مقابل هذه بيانات توفير إنشاء، قراءة، تحديث، حذف، لقطة أو حجز قراءة عملية. | كائن تحقق حالة آلة، سطر جعل قطع قرار حق، قسم إرسال عمل، قرار مزود أولوية درجة، أو تنسيق ضبط كثير عدد مجال. صنف داخلي وجود خريطة و لن يجعل هذا صنف يصبح تخزين. |
| `Directory` | كائن عام بند، توفير اكتشاف أو اختيار. مستهلك سوف استعلام لديه أي بعض خيار، و قراءة ذلك بيانات وصفية. | إنتاج جهة يمكن نحو منها تسجيل مهمة معنى تنفيذ، أو استدعاء جهة عبر هو تنفيذ عمل. دليل يمكن من سجل التسجيل دعم دعم، لكن اثنان من مقابل خارج مسؤولية و لا نفسه. |
| `Presenter` | كائن فقط مسؤول سوف مجال قيمة أو أداة معامل تحويل لـ تصيير معنى رسم. هو لا يملك I/O، حجز قراءة، تغيير أو دورة الحياة. | كائن قراءة خدمة، أكثر تعديل حالة أو تحكم عمل وقت التشغيل آلة. هذه مسؤولية يخص تحكم جهاز أو وقت التشغيل. |
| `Registry` | كائن يملك واحد مجموعة حركة حالة أداة اسم تسجيل بند. هو تعريف فحص بحث قاعدة، تكرار بند أو أولوية درجة قاعدة، تسجيل دورة الحياة و مورد تحرير. | استدعاء جهة رئيسي يلزم اتفاق هو قسم إرسال، تنفيذ، إلغاء، سياسة تنفيذ أو تحرير ترتيب. وقت التشغيل يمكن في داخلي يتضمن سجل التسجيل. |
| `Runtime` | كائن تشغيل فوري عمل. هو عبر استدعاء يملك قسم إرسال، إلغاء، مزود تنسيق ضبط أو عملية دورة الحياة. | كائن فقط تخزين سجل، إرجاع دليل، تحليل مفرد عدد قيمة أو حفظ إعداد.`Runtime` لا هو `Service` عام بديل كلمة. |
| `Resolver` | كائن أصل حسب الذي توفير إدخال حساب حساب أو تحديد موضع واحد جواب سجل، عبر معتاد لا يملك جواب سجل دورة الحياة. | كائن يملك متغير تجميع دمج أو طويل وقت تشغيل تنفيذ دورة الحياة. |
| `Binder` | كائن سوف واحد قد إعلان واجهة مرفق إضافة إلى استدعاء جهة سياق أو دورة الحياة، و إرجاع ربط بعد قيمة. | كائن بـ تجميع دمج شكل صيغة يملك ربط قيمة، تحكم ذلك مجال حالة، أو فقط تحويل بيانات. |
| `Engine` | كائن تنفيذ مجال حساب قاعدة أو لديه حالة تنفيذ نموذج، مثال مثل سير العمل، ضغط أو استعلام طلب قيمة. | كائن فقط اختيار مزود، أو عبر بروتوكول حد تحويل إرسال طلب. |
| `Policy` | كائن قرار سماح، اختيار، حد أو مراقبة ماذا. | كائن تنفيذ قرار الذي سماح آلية. سياسة و منفذ يجب قسم آخر تسمية. |
| `Executor` | كائن في واحد بند قدرة داخل تشغيل واضح طلب أو قد تحليل مواصفة. | كائن يملك عرض عام تطبيق دورة الحياة أو مزود دليل. |
| `Gateway` | كائن ملائم إعداد عملية، شبكة شبكة،RPC أو API حد، و في اثنان جانب بين تحويل. | كائن فقط تسجيل نفس عملية خدمة أو تخزين بيانات وصفية. |
| `Provider` | كائن لـ واحد بند قدرة تعريف توفير واحد نوع تنفيذ. إذا يمكن وجود كثير عدد مزود، ينبغي زيادة آلية أو توفير ينبغي تجارة حد تحديد كلمة. | كائن هو قدرة تعريف، مزود سجل التسجيل أو موجه إلى مستهلك وقت التشغيل. |
| `Backend` | كائن في قد تعريف واجهة بعد، تنفيذ يمكن استبدال قاع طبقة حفظ دائم، نقل أو تنفيذ خلفية. | كائن هو موجه إلى مستخدم خدمة، أو فقط هو مقابل بعض عدد فوري كائن إرجاع مرجع. |
| `Handle` | هذا قيمة هو مقابل واحد فوري مورد مرجع، و تحكم أو مراقبة هذا مورد. | كائن إنشاء و إدارة كامل مورد حوض. لا نيل استخدام `Owner` أو يحتوي معنى نموذج غامض `Resource`؛ إذا `Handle` أو أكثر دقيق إدارة مسؤولية دمج ملائم، حينئذ ينبغي اعتماد بعد من. |
| `Config` | كائن يملك واحد قد تحليل إعداد قيمة، أو واحد نسخة حد صارم إطار تلقي حد إعداد سجل و ذلك تحديث اتفاق. | كائن تخزين عام تجميع دمج، تنفيذ عمل أو عام لا متبادل صلة ضبط. |
| `Service` | كائن يملك واحد بند مسؤولية داخل تجمع مجال خدمة، كما بـ فوق أكثر دقيق مسؤولية كلمة كل لا يمكن مثل فعلي وصف ذلك مسؤولية نطاق. | فقط لأن صنف وراثة ذاتي Cordis `Service` بينما استخدام هذا اسم، أو لأن تحديد حق صحيح مسؤولية حاجة دخول واحد خطوة تفكير اعتبار. |

فعلي استخدام حكم قطع طريقة جدا مباشر. إذا استدعاء جهة رئيسي يلزم استدعاء `register()` و استلام إلى مورد تحرير دالة، ينبغي استخدام `Registry`. إذا استدعاء جهة رئيسي يلزم استدعاء `run()`،`dispatch()`،`cancel()` أو `execute()`، ينبغي استخدام `Runtime`،`Engine` أو `Executor`. إذا استدعاء جهة رئيسي يلزم تصفح تصفح خيار، ينبغي استخدام `Directory`. إذا كائن رئيسي يلزم سوف واحد نسخة مواصفة ربط إلى استدعاء جهة يملك سياق و دورة الحياة، ينبغي استخدام `Binder`. إذا كائن فقط سوف مجال بيانات خريطة لـ UI بيانات، ينبغي استخدام `Presenter`. إذا هو أيضا سوف أكثر تعديل حالة، حينئذ لا هو عرض جهاز.

### استخدام قدرة كاف تكملة ملء معلومة حد تحديد كلمة

إذا بروتوكول أو جهة قول اسم قدرة كاف منطقة قسم تنفيذ، حينئذ ينبغي إبقاء. تنفيذ اعتماد متبادل ينبغي آلية وقت، إبقاء `Bash`،`Pwsh`،`JSON-RPC`،`SQLite`،`JSONL`،`OpenTelemetry`،`Claude Code` و `E2B`. كل حالي خلفية كل قد استخدام LLM(كبير لغة نموذج)seam وقت، لا يلزم في ضغط خلفية اسم في إضافة دخول `LLM`؛ في ظهور أكثر أداة جسم حساب قاعدة اسم قبل،`basic` عندئذ هو مثل فعلي كما في صفة اسم.

لا نيل وهمي بنية `process sandbox` عام فكرة. حالي `sandbox` نظام صف قد دقيق تأكيد تسمية ذلك منتج مسؤولية. هذا قرار لا تغيير هذا مسؤولية.

PascalCase معرف رمز في أول حرف أم تقليص اختصار كلمة استخدام أول حرف أم كبير كتابة صيغة:`Ui`،`Llm`،`JsonRpc` و `ApiProxy`. في نص سجل و ملائم استخدام حزمة اسم في استخدام معتاد مثال قاعدة تحديد كل كبير كتابة شكل صيغة:UI،LLM،JSON-RPC و API.`Typert` هو معرف رمز و نص سجل في وحيد دقيق تأكيد منتج تجميع كتابة؛ لا نيل كتابة صار `TypeRT`،`TypeRt`، أيضا لا نيل مقابل `Typert` عمل أخرى داخلي تفكيك قسم.

لا نيل لـ تجنب تجنب تكرار بينما حذف متعمد إبقاء توفير ينبغي تجارة حد تحديد كلمة.`dsh-subagent-dsh-sdk` يمثل DeepSeek Harness SDK مزود، يمكن تجنب تجنب و أخرى SDK خلط خلط. ذلك خاص صنف تعديل اسم لـ `SdkSubagentProvider`، لأن صنف اسم أيضا حاجة شرح هو توفير ماذا.

### سوف قاعدة كتابة مشروع وثيقة

إعداد مقابل حزمة إنشاء إشارة جنوب `docs/cookbook/adding-a-package.md` يتضمن كامل مسؤولية كلمة اتفاق،`packages/AGENTS.md` رابط إلى هذا اتفاق. فن لغة جدول و أصل مشروع شرح جعل `SDK` و `Typert` كل منها فقط لديه واحد نوع يحتوي معنى. هذا Agent Note مسؤول سجل إدارة من و يتم مرفوض بديل خطة؛ إشارة جنوب مسؤول سجل مساهمة من ينبغي التزام دوران قاعدة.

## إعادة تسمية بيان

التالي جدول إطار سجل عام اسم و مستودع درجة اسم تغيير.`حالي اسم` شريط سجل حالي اسم. مرجع نفسه مسؤولية خاص نطاق جزء متغير أيضا استخدام نفسه مفردات. إذا عرض عام استبدال و لا صحيح تأكيد، بيان سوف واضح إشارة خروج إبقاء قاع طبقة اسم أو منتج مرئي اسم.

### وقت التشغيل SDK

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `@deepseek-ai/dsh-jsonrpc` | `@deepseek-ai/dsh-sdk-jsonrpc-server` | هو هو SDK بروتوكول خادم طرف. مفرد وحيد استخدام `jsonrpc` فقط شرح تحرير رمز؛`sdk-jsonrpc-server` فإن معا شرح الذي تابع نظام صف، آلية و مسؤولية. |
| `HarnessSdkServer` | `HarnessSdkJsonRpcServer` | هذا صنف هو JSON-RPC خادم واحد نوع تنفيذ، و لا بديل جدول كل ممكن SDK خادم. |

إبقاء `@deepseek-ai/dsh-sdk-client`،`@deepseek-ai/dsh-sdk-protocol` و `deepseek-harness-sdk-runtime`. ترتيب حذف `@deepseek-ai/create-sdk`،`@deepseek-ai/dsh-scripts`،`@deepseek-ai/dsh-helper` و `@deepseek-ai/dsh-telemetry`؛ مفرد وحيد إزالة قرار مسؤول حذف هذه حزمة و ذلك دعم دعم اعتماد رسم.

### Shell و طرفية

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `packages/bash/` | `packages/shell/` | هذا مجموعة يتضمن جهة قول غير متصل منفذ seam،Bash و PowerShell تنفيذ، بيئة دعم حمل و shell أداة. |
| `@deepseek-ai/dsh-bash`, `ctx.bash` | `@deepseek-ai/dsh-shell`, `ctx.shell` | PowerShell قد تنفيذ هذا seam. هذا بند قدرة هو shell تنفيذ، بينما لا هو Bash. |
| جهة قول غير متصل `BashExecutor`،`BashExecRequest`،`BashExecSpec`،`BashProcess`،`BashRunResult`،`BashSandboxInfo`،`BashProcessRead` و `BashProcessStatus` اسم | مقابل `Shell*` اسم | هذه نوع أفقي عبر Bash و PowerShell تنفيذ. وصف Bash لغة قاعدة أو سلوك ورقة طبقة نوع إبقاء `Bash`. |
| `BASH_SETTINGS_NAMESPACE`، ضبط نطاق الأسماء `bash` | `SHELL_SETTINGS_NAMESPACE`، ضبط نطاق الأسماء `shell` | اثنان عدد shell مزود كل تسجيل هذا بند من قدرة يملك ضبط قسم منطقة. معتاد كمية و حفظ دائم نطاق الأسماء يجب استخدام قدرة اسم. |
| `@deepseek-ai/dsh-bash-env`, `ctx.bashEnv`, `BashEnvRegistry` | `@deepseek-ai/dsh-shell-env`, `ctx.shellEnv`, `ShellEnvRegistry` | Bash و PowerShell أداة مشترك هذا بيئة سجل التسجيل. |
| `docs/subsystems/bash.md` | `docs/subsystems/shell.md` | هذا فرعي نظام صفحة سجل جهة قول غير متصل قدرة. |
| `packages/pty/` | `packages/terminal/` | هذا حزمة نظام صف مسؤول حمل دائم طرفية جلسة. أصلي PTY قسم إعداد ما زال يقع في عملية فرعية طبقة. |
| `@deepseek-ai/dsh-pty`, `ctx.pty`, `PtyService` | `@deepseek-ai/dsh-terminal`, `ctx.terminals`, `TerminalSessionService` | استدعاء جهة إدارة كثير عدد أداة اسم طرفية جلسة، بينما لا هو عبر هذا خدمة قسم إعداد أصلي PTY. |
| عام عال طبقة `Pty*` جلسة و خلفية اسم | `Terminal*` اسم | عام سحب كائن هو طرفية جلسة. إبقاء قاع طبقة `SubprocessTerminal*` اسم، لأن هو جمع قد شرح قاع طبقة آلية. |
| `@deepseek-ai/dsh-pty-local`, `LocalPtyBackend` | `@deepseek-ai/dsh-terminal-bash`, `BashTerminalBackend` | هذا مزود اعتماد Bash تلميح رمز و shell سلوك.`local` إخفاء فعلي جهة قول. |
| `@deepseek-ai/dsh-tool-pty` | `@deepseek-ai/dsh-tool-terminal` | موجه إلى نموذج أداة قد استخدام `terminal_*`؛ حزمة ينبغي اعتماد نفسه منتج اسم كلمة. |
| أصل PTY نظام صف في `tool-bash-persistent` | `shell/tool-bash-persistent/` | هذا أداة هو Bash أداة، ينبغي و shell أداة وضع في واحد بدء. إبقاء ذلك NPM اسم:`persistent` سوف هو و مرة صفة `bash` منطقة قسم فتح قدوم، بينما `bash-terminal` سوف خلط خلط منتج أداة و طرفية جلسة نظام صف. |
| `docs/subsystems/pty.md` | `docs/subsystems/terminal.md` | هذا صفحة سجل طرفية جلسة، بينما لا هو أصلي PTY قسم إعداد. |

إبقاء Bash و PowerShell مخصص استخدام ورقة طبقة حزمة، إضافة id، نوع و أداة. هذه جهة قول اسم دقيق تأكيد بلا خطأ.

### لغة خادم و عمل عمل

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `@deepseek-ai/dsh-lsp-local` | `@deepseek-ai/dsh-lsp-stdio` | هذا مزود عبر يمكن استبدال نظام الملفات و عملية فرعية خدمة، بـ stdio نقل LSP. هو لا واحد تحديد في محلي تشغيل. |
| `packages/tasks/` | `packages/jobs/` | هذا نظام صف مسؤول انفصال مغادرة قبل منصة تشغيل أداة عمل عمل.`jobs` بسيط قصير، و يمكن تجنب تجنب و مستخدم مهمة أو todo عام فكرة اندفاع مفاجئ. |
| `@deepseek-ai/dsh-tasks`, `ctx.tasks`, `TaskService` | `@deepseek-ai/dsh-jobs`, `ctx.jobs`, `JobRegistry` | هذا خدمة تسجيل، يملك، مراقبة، انتظار و إلغاء كثير عدد خلفية عمل عمل. هو هو سجل التسجيل، بينما لا هو عام مهمة خدمة. |
| عام `TaskId`،`TaskKindMap`،`TaskStart`،`TaskHooks`،`TaskOutcome`،`TaskSnapshot`،`TaskRead` و `TaskDoneListener` اسم | مقابل `Job*` اسم | هذه نوع يخص إعادة تسمية بعد عمل عمل مجال.`JobId` مقارنة `BackgroundTaskId` أو `BgTaskId` أكثر قصير، أكثر صاف واضح. |
| `@deepseek-ai/dsh-tasks-local`, `LocalTaskService` | `@deepseek-ai/dsh-jobs-local`, `LocalJobRegistry` | هذا هو عمل عمل سجل التسجيل عملية داخل مزود. هذا موضع `local` لديه واضح يحتوي معنى، لأن عمل عمل و عودة ضبط كل وجود في نفس عملية. |
| `@deepseek-ai/dsh-tool-tasks` | `@deepseek-ai/dsh-tool-jobs` | مستهلك تحكم عمل عمل سجل التسجيل، ينبغي استخدام نفسه مجال اسم كلمة. |
| `ToolTasks`،`toolTasks`،`ToolTasksConfigSchema`،`PublicTaskSnapshot`،`publicTask`،`validateTaskId` | مقابل `*Jobs`،`*Job*` و `validateJobId` اسم | import، تحويل إرسال إعداد، عام أداة قيمة و مساعد مساعدة دالة كل يخص نفس عدد عمل عمل مجال. حزمة إعادة تسمية بعد متابعة إبقاء `Task`، سوف لـ نفس وظيفة صنع صنع ثاني طقم مفردات. |
| `task_output`, `task_list`, `task_kill` | `job_output`, `job_list`, `job_kill` | هذه نموذج أداة عملية هو عمل عمل، بينما لا هو مستخدم مهمة.`run_in_background` إرجاع `JobId`. |
| `@deepseek-ai/dsh-client-ui-task`،`client/ui-task/` | `@deepseek-ai/dsh-client-ui-jobs`،`client/ui-jobs/` | هذا عميل حزمة عرض خلفية عمل عمل تجميع دمج، بينما لا هو واحد بند مستخدم مهمة. |
| `TaskView`، خط مسار لقطة `session/tasks`،`tasksBySession` | `JobView`، خط مسار لقطة `session/jobs`،`jobsBySession` | متصفح اتفاق و ذلك مرآة مثل ينبغي اعتماد و سجل التسجيل و أداة نفسه عمل عمل مجال اسم. |
| `docs/subsystems/tasks.md` | `docs/subsystems/jobs.md` | هذا فرعي نظام صفحة يجب اعتماد عام عمل عمل مفردات. |

إبقاء أساس أساس LSP حزمة،`ctx.lsp`،LSP بروتوكول نوع و LSP أداة. هذا seam متعمد عام لغة خادم دلالة؛ خطأ فقط لديه مزود حد تحديد كلمة.

### إدخال إطلاق جهاز، أداة عرض، إذن مسبق ضبط و مستخدم مشكلة

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `@deepseek-ai/dsh-client-ui-slash`, `ui-slash/` | `@deepseek-ai/dsh-client-ui-input-trigger`, `ui-input-trigger/` | عميل معالجة `/`،`@`، مفتاح قرص وسيط قطع، مرشح قائمة مفرد و برنامج تحويل بدء، و غير فقط معالجة مائل عمود أمر. |
| `ctx.slash`،`SlashService`،`SlashController`،`SlashSource` | `ctx.inputTriggers`،`InputTriggerService`،`InputTriggerController`،`InputTriggerSource` | هذه اسم تغطية كل تلقي دعم حمل إطلاق جهاز، و إبقاء قائم خدمة، تحكم جهاز و مصدر مسؤولية. اقتران دمج منطقة مجال ضبط و عام نوع اسم أيضا تعديل استخدام `InputTrigger`. |
| `@deepseek-ai/dsh-agent-tool-mode`، إضافة `tool-mode` | `@deepseek-ai/dsh-agent-tool-presentation`، إضافة `tool-presentation` | هذا إضافة تغيير أداة نحو نموذج عرض طريقة، بينما لا تغيير تنفيذ سلوك. إبقاء نطاق جزء `Config.mode` و `ToolPresentationMode`. |
| `packages/interaction/permission/` | `packages/interaction/permission-presets/` | هذا حزمة يملك صندوق رملي و مراجعة دفعة ضبط أداة اسم تركيب، بينما لا مسؤول تنفيذ إذن. |
| `@deepseek-ai/dsh-permission`, `ctx.permission`, `PermissionService` | `@deepseek-ai/dsh-permission-presets`, `ctx.permissionPresets`, `PermissionPresetService` | هذا خدمة اختيار و حفظ دائم مسبق ضبط. صندوق رملي و مراجعة دفعة خدمة مسؤول تنفيذ نتيجة. |
| `@deepseek-ai/dsh-client-ui-permission` | `@deepseek-ai/dsh-client-ui-permission-presets` | UI تحرير و اختيار إذن مسبق ضبط. |
| `docs/subsystems/permission.md` | `docs/subsystems/permission-presets.md` | هذا صفحة سجل مسبق ضبط اختيار، بينما لا هو إذن تنفيذ. |
| `@deepseek-ai/dsh-user-interaction`, `user-interaction/` | `@deepseek-ai/dsh-user-questions`, `user-questions/` | هذا seam فقط دعم حمل دفعة كمية مشكلة و جواب سجل. مراجعة دفعة، أمر و دليل اختيار يخص أخرى تفاعل seam. |
| `ctx.userInteraction`, `UserInteractionService`, `UserInteractionProvider`, `UserInteractionError` | `ctx.userQuestions`, `UserQuestionService`, `UserQuestionProvider`, `UserQuestionError` | هذه اسم شرح وحيد تلقي دعم حمل تفاعل شكل صيغة. إبقاء `AskUserQuestion*`،`ask_user_question` أداة و `@deepseek-ai/dsh-tool-ask-user`. |
| `docs/subsystems/user-interaction.md` | `docs/subsystems/user-questions.md` | هذا صفحة فقط سجل مشكلة و جواب سجل. |

إبقاء `/permission`،`permissions` إسقاط،`permission` ضبط نطاق الأسماء و `permission/preset`؛ هو جمع كل هو دقيق تأكيد منتج مفردات أو حفظ دائم مفردات. إبقاء كامل اسم `PermissionPresetSettingsController`. حذف `Preset` سوف ذهاب إسقاط حد تحديد ذلك إذن كلمة. إزالة `both` أداة عرض نمط عمل ما زال دفع متأخر إلى آخر نسخة رفع سجل؛ هذا مرة إعادة تسمية لا إزالة سلوك.

### Typert،API شبكة صلة و أداة

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `packages/typert/type-meta/`, `@deepseek-ai/dsh-type-meta` | `typert/protocol/`, `@deepseek-ai/dsh-typert-protocol` | هذا حزمة يملك Typert Remote بروتوكول، تركيب زينة جهاز، ربط، تحرير حل رمز جهاز، فحص بحث منطق و سياق اتفاق. هو لا هو عام نوع بيانات وصفية. |
| بروتوكول حزمة في `GatewayService` | `TypertRemoteService` | هذا أساس صنف علامة يلزم توجيه خروج لـ Remote نفس عملية خدمة. هو لا هو API شبكة صلة. |
| `bindTypeRTGateway`،`typertGateway` ربط | `bindTypertRemote`،`typertRemote` | هذه ربط عام Typert Remote خدمة، بينما غير أداة جسم API شبكة صلة خدمة. |
| عام `TypeRT*` معرف رمز و صغير حدبة ذروة شكل صيغة `typeRT*` معرف رمز | `Typert*` و `typert*` | `Typert` هو وحيد مواصفة منتج تجميع كتابة. |
| بروتوكول واجهة `TypeRTService` | `TypertRegistryContract` | هذا بروتوكول يملك واجهة هو قائم أداة جسم صنف `TypertRegistry` الذي تنفيذ اعتماد قلب وضع واجهة. مختلف بعد لاحقة يمكن تجنب تجنب استيراد و إعلان اندفاع مفاجئ. |
| `ToolRegistry` | `ToolRuntime` | هذا صنف يملك عرض، مراجعة دفعة و منع حماية سياسة، قسم إرسال، إلغاء، تحقق، نهاية ربط و مراقبة. تسجيل فقط هو داخلي مجموعة صار جزء. |
| `ToolRegistryScheduler`, `TOOL_REGISTRY_SCHEDULER` | `ToolRuntimeScheduler`, `TOOL_RUNTIME_SCHEDULER` | مجدول تحكم وقت التشغيل قسم إرسال، بينما لا هو تسجيل. |

إبقاء `@deepseek-ai/dsh-tools` و `ctx.tools`. إبقاء `@deepseek-ai/dsh-api-gateway`، ذلك `gateway/` دليل،`ctx.typertGateway` و `TypertGatewayService`؛ هذا خدمة هو حق صحيح API شبكة صلة. ذلك داخلي `TypeRT*` معرف رمز ما زال ينبغي التزام دوران `Typert*` تجميع كتابة قاعدة.

### مساحة العمل إشارة أمر، بعيد قياس، هوية و بدء بيئة

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| Host `ctx.workspace` | Host `ctx.workspaceRegistry` | `WorkspaceRegistry` يملك كثير عدد مساحة العمل، لكن Client `ctx.workspaces` قد استخدام لا توافق نوع. أي جعل اثنان من وقت التشغيل سياق مستقل، اثنان نسخة إعلان ما زال سوف في تحرير ترجمة وقت دمج دخول نفس عدد Cordis `Context` واجهة. مسؤولية بعد لاحقة واضح إشارة خروج host خدمة، و تجنب تجنب هذا اندفاع مفاجئ. إبقاء `@deepseek-ai/dsh-workspace`،`WorkspaceRegistry`،`Workspace` و `workspace.*` بروتوكول اسم. |
| `@deepseek-ai/dsh-workspace-context`, `context/workspace-context/` | `@deepseek-ai/dsh-agent-instructions`, `context/agent-instructions/` | هذا حزمة لـ agent(ذكي جسم) تحميل قسم طبقة `AGENTS.md` و `CLAUDE.md` ملف. هو و غير عام مساحة العمل سياق. |
| إضافة اسم و حمل دائم مصدر اسم `workspace-context` و `workspace-instructions` | `agent-instructions` | سجل مصدر هو واحد صنف أداة جسم agent إشارة أمر. بـ `AgentInstruction*` استبدال عام `WorkspaceInstruction*` اسم. هذا فن لغة لا يشمل نظام رسالة، تطوير من رسالة أو مستخدم رسالة. |
| `ctx.telemetry`، سحب كائن صنف `Telemetry` | `ctx.sessionTelemetry`،`SessionTelemetryBackend` | هذا خدمة التقاط جلسة حساب هذا بعيد قياس، و تسليم إعطاء تقرير إبلاغ خلفية. هو لا هو مستودع درجة إشارة علامة أو تتبع أثر خدمة. |
| `TelemetryBackend` | `SessionTelemetrySink` | هذا قاع طبقة استقبال قد إرسال خروج سجل.`Sink` لأجل سوف هو و تنسيق ضبط نوع خلفية خدمة منطقة قسم فتح. |
| `TelemetryCoordinator`،`TelemetryRecord`،`TelemetrySeverity`،`TelemetrySharingStatus` و `TelemetryCapture` | مقابل `SessionTelemetry*` اسم | هذه عام نوع فقط يخص جلسة بعيد قياس. |
| `telemetry/record` | `session-telemetry/record` | حدث اسم يجب شرح الذي تابع مجال. |
| `TelemetryOtel`،`TelemetryMode`، إضافة `telemetry-otel` | `OpenTelemetrySessionBackend`،`SessionTelemetryMode`، إضافة `session-telemetry-otel` | مزود اسم معا شرح OpenTelemetry آلية و جلسة أثر مجال. إبقاء حزمة اسم `dsh-session-telemetry` و `dsh-session-telemetry-otel`. |
| `docs/subsystems/telemetry.md` | `docs/subsystems/session-telemetry.md` | هذا صفحة سجل جلسة بعيد قياس، بينما لا هو مستودع درجة يمكن مراقبة قياس صفة. |
| `session/user-id/`, `@deepseek-ai/dsh-user-id` | `identity/anonymous-user-id/`, `@deepseek-ai/dsh-anonymous-user-id` | هذا قيمة هو بعيد قياس، عكس تغذية و DeepSeek طلب مشترك استخدام مع آلة صلة ربط id. هو حيث لا يخص Session مجال، أيضا لا هو مرور مرور هوية تحقق مستخدم هوية. |
| `USER_ID_FILE_NAME`،`.userid`، عكس تغذية وسم `User` | `ANONYMOUS_USER_ID_FILE_NAME`،`.anonymous-user-id`، عكس تغذية وسم `Anonymous user` | ملف و UI لا نيل داكن عرض حساب مستخدم هوية. إبقاء قائم `AnonymousUserId` دالة و معيار OTel خاصية `user.id`. |
| `util/environment/`, `@deepseek-ai/dsh-environment` | `util/launch-environment/`, `@deepseek-ai/dsh-launch-environment` | هذا حزمة في بدء وقت التقاط واحد نسخة غير ممكن تغيير قسم طبقة لقطة. هو لا هو عام بيئة API. |
| عام `Environment*`،`createEnvironmentSnapshot`،`environmentOf`،`DSH_ENVIRONMENT_KEY` | `LaunchEnvironment*`،`createLaunchEnvironmentSnapshot`،`launchEnvironmentOf`،`DSH_LAUNCH_ENVIRONMENT_KEY` | هذه اسم شرح لقطة دورة الحياة و استخدام طريق. |
| `ctx.launcherEnvironment` | `ctx.launchEnvironment` | هذا قيمة وصف تطبيق بدء، بينما لا فقط وصف بدء جهاز مكون. إبقاء مصدر وسم `process`،`project-env` و `user-env`. |

### يوم مسار، سير العمل، هدف و ضغط

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `@deepseek-ai/dsh-tool-schedule`،`schedule/tool-schedule/`، إضافة `tool-schedule` | `@deepseek-ai/dsh-schedule`،`schedule/schedule/`، إضافة `schedule` | هذا حزمة يملك حمل دائم Schedule مجال، حفظ دائم شاشة عائق، إدارة أداة، تحديد وقت جهاز، لاحق جولة و وقت التشغيل دورة الحياة.`tool-` فقط وصف منها واحد جزء. |
| `ScheduleOwner` | `ScheduleRuntime` | هذا تدريجي agent كائن تشغيل فوري تحديد وقت جهاز، حفظ دائم إسقاط، قسم إرسال، فارغ خامل انتظار و مورد تحرير.`Owner` لا يوجد شرح هذا واحد تنفيذ مسؤولية. اقتران دمج خاص `owner*` اسم أيضا تعديل استخدام `runtime*`. |
| `WorkflowService`, `ctx.workflows` | `WorkflowEngine`, `ctx.workflowEngine` | واحد جذب محرك مسؤول تحليل و تنفيذ سير العمل برنامج. تكرار عدد مفتاح خطأ أرض داكن عرض هذا هو سجل التسجيل. إبقاء `@deepseek-ai/dsh-workflow` و سير العمل حدث و أداة. |
| `@deepseek-ai/dsh-workflow-workerthread`, `WorkerWorkflowEngine` | `@deepseek-ai/dsh-workflow-worker-thread`, `WorkerThreadWorkflowEngine` | `worker thread` هو دقيق تأكيد Node آلية، مستودع تجميع كتابة اشتراط استخدام كامل مفرد كلمة. |
| `@deepseek-ai/dsh-goal-session`, `goal/goal-session/` | `@deepseek-ai/dsh-goal-round-driver`, `goal/goal-round-driver/` | هذا إضافة قيادة نفس جلسة داخل Goal Rounds. هو حيث لا تخزين هدف، أيضا لا تعريف جلسة. إبقاء `GoalService`، هدف مصدر، حدث و اتفاق. |
| `packages/compact/` | `packages/compaction/` | هذا مجموعة هو بـ اسم كلمة تسمية مجال نظام صف.`compact` ما زال بصفة موجه إلى مستخدم أمر حركة كلمة. |
| `@deepseek-ai/dsh-compact`, `ctx.compact`, `CompactService` | `@deepseek-ai/dsh-compaction`, `ctx.compaction`, `CompactionEngine` | هذا كائن تشغيل ضغط (compaction) حساب قاعدة و دورة الحياة. هو هو جذب محرك، بينما لا هو عام خدمة. |
| `compact/*` حدث و عام مجال بادئة | `compaction/*` | حدث و مجال نوع استخدام اسم كلمة شكل صيغة. إبقاء حركة كلمة شكل صيغة عملية، مثال مثل `compactNow`،`compactRegion` و `compactIfNeeded`. |
| `@deepseek-ai/dsh-compact-basic`،`BasicCompactService`، عام `BasicCompact*` | `@deepseek-ai/dsh-compaction-basic`،`BasicCompactionEngine`، مقابل `BasicCompaction*` | `basic` بسيط عنصر لكن دقيق تأكيد.`compaction-llm` لا يوجد زيادة معلومة، لأن حالي تنفيذ نظام صف قد استخدام LLM. |
| `@deepseek-ai/dsh-compact-tool-result-prune`, `ToolResultPruneService`, `ctx.toolResultPrune` | `@deepseek-ai/dsh-compaction-tool-result-pruner`, `ToolResultPruner`, `ctx.toolResultPruner` | هذا إضافة هو قص حذف أداة نتيجة تنفيذ رئيسي جسم. اسم كلمة `pruner` شرح هذا واحد مسؤولية. |

إبقاء `/compact`، أمر حزمة، و متبادل متبادل مستقل ضغط تعريف حزمة و مزود حزمة. دمج هذه حزمة رفع اقتراح ما زال يتم مرفوض. هذا مرة إعادة تسمية فقط تغيير مفردات، لا تغيير هذا حزمة حد.

### ضبط، اعتماد، عميل وحدة و مقارنة صغير نواة قلب مسؤولية

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| سحب كائن صنف `Settings` | `SettingsProvider` | هذا صنف عبر يمكن استبدال قدرة توفير ضبط. إبقاء حزمة، مفتاح و حدث. |
| `@deepseek-ai/dsh-settings-local`, `SettingsLocal` | `@deepseek-ai/dsh-settings-file`, `FileSettingsProvider` | هذا تنفيذ عبر نظام الملفات seam بـ ملف لـ خلفية.`file` شرح آلية،`local` فإن لا يستطيع. |
| سحب كائن صنف `Credentials` | `CredentialProvider` | هذا صنف تحليل اعتماد مرجع. إبقاء حزمة اسم، مفتاح و حدث. |
| `CredentialsLocal` | `LocalCredentialProvider` | هذا مزود قراءة مضيف عملية و `.env` حالة، لذلك محلي تنفيذ يخص ذلك اتفاق. |
| `ClientModuleHostService`, `ctx.clientModuleHost` | `ClientModuleRegistry`, `ctx.clientModules` | هذا خدمة يملك كثير عدد قد تسجيل عميل وحدة. إبقاء حزمة و متصفح طرف `ClientModuleLoader`. |
| `AgentDefaultModelService` | `AgentDefaultModelConfig` | هذا كائن تخزين واحد بند افتراضي نموذج اختيار. هو لا تشغيل خدمة، أيضا لا هو عام سجل التسجيل. إبقاء ذلك حزمة، مفتاح، ضبط نطاق الأسماء و نوع. |
| `SessionReferenceService`, `ctx.sessionReferences` | `SessionReferenceResolver`, `ctx.sessionReferenceResolver` | هو من URI أو إدخال تحليل واحد جلسة مرجع، و لا يملك مرجع تجميع دمج. |
| `SessionQueryService`, `SessionQuerySqlite` | `SessionQueryEngine`, `SqliteSessionQueryEngine` | هذه صنف تنفيذ استعلام نموذج و ذلك SQLite تنفيذ. إبقاء حزمة اسم، مفتاح و أداة. |
| `@deepseek-ai/dsh-session-export`, `session-export/`, Loader id `session-export`, `ctx.sessionExport` | `@deepseek-ai/dsh-session-log-export`, `session-log-export/`, Loader id `session-log-download`, `ctx.sessionLogDownload` | npm حزمة اسم استخدام Session سجل توجيه خروج دلالة، لأن npm منع توقف حزمة اسم يتضمن `download`.Loader id و متصفح API إبقاء `download`، لأن هو جمع وصف متصفح فرعي أثر. |
| `SessionExportDownloadController`, أخرى `SessionExport*` متصفح نوع،`useSessionExport`،`SessionExportHeader` | `SessionLogDownloadController`, مقابل `SessionLogDownload*` نوع،`useSessionLogDownload`،`SessionLogDownloadHeaderAction` | هذا controller يملك مسبق فحص، تكرار طلب دمج، نابض نافذة حالة و متصفح حفظ.`ExportDownload` تكرار جدول بلوغ نفس حركة عمل، هذا مكون مساهمة هو واحد Header action، لا هو كامل Header. |
| مضيف أمر حزمة في `CommandService` | `CommandRuntime` | هذا كائن عبر فوري استدعاء تسجيل و تنفيذ مضيف أمر. إبقاء ذلك حزمة، مفتاح، نوع و حدث. |
| `TokenMeterService` | `TokenMeter` | هذا كائن قياس كمية token استخدام كمية.`Service` لا يوجد تكملة ملء أثر مجال معلومة. |
| `LlmService` | `LlmRuntime` | هذا كائن اختيار مزود و تشغيل فوري نموذج طلب. إبقاء حزمة، مفتاح، مهايئ و حدث. |

### Host Web خادم، جلسة بيانات و شفرة تنفيذ

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `HttpServerService`, `ctx.httpServer` | `WebServer`, `ctx.webServer` | هذا خادم يملك HTTP توجيه و WebSocket ترقية توجيه.`Web` يمكن معا شمول غطاء اثنان من؛ هذا موضع `Http` أثر مجال مرور ضيق. إبقاء `packages/host/webserver`،`@deepseek-ai/dsh-host-webserver`،`WebRoute` و `WebUpgradeRoute`. |
| وثيقة فرعي نظام وسم `http-server` | `web-server` | فرعي نظام وسم يجب و خدمة اعتماد نفسه أثر مجال. |
| `SessionPersistenceJsonl` | `JsonlSessionPersistence` | سوف تنفيذ حد تحديد كلمة وضع في قبل وجه، معا كامل إبقاء قدرة مسؤولية. |
| `SessionPersistenceSqlite` | `SqliteSessionPersistence` | اعتماد و JSONL نفسه مزود تسمية ترتيب. |
| `@deepseek-ai/dsh-session-title-first-message-llm`، إطلاق دورة مدة `first-message` | `@deepseek-ai/dsh-session-title-first-prompt-llm`، إطلاق دورة مدة `first-prompt` | إطلاق شرط هو رقم واحد بند مستخدم نص التوجيه، بينما لا هو جلسة سجل في مهمة معنى رسالة. |
| `@deepseek-ai/dsh-session-title-all-messages-llm`، إطلاق دورة مدة `all-user-messages` | `@deepseek-ai/dsh-session-title-all-prompts-llm`، إطلاق دورة مدة `all-prompts` | خلفية أصل حسب مستخدم نص التوجيه تحديث جديد.`all messages` سوف خطأ أرض يتضمن مساعدة يد رسالة و أداة حدث. |
| `@deepseek-ai/dsh-code-runtime-worker`, `WorkerCodeRuntime` | `@deepseek-ai/dsh-code-runtime-worker-thread`, `WorkerThreadCodeRuntime` | هذا تنفيذ استخدام Node عمل خط مسار. مفرد وحيد `worker` أثر مجال مرور عرض. |
| `SubprocessService` | `SubprocessRuntime` | هذا خدمة يملك فوري عملية فرعية تنفيذ و دورة الحياة. إبقاء ذلك حزمة و مفتاح. |
| `LocalSubprocessService` | `LocalSubprocessRuntime` | هذا مزود تشغيل نفس رئيسي آلة عملية و عملية شجرة. |
| `E2BSubprocessService` | `E2BSubprocessRuntime` | هذا مزود في E2B وقت التشغيل في تشغيل عملية فرعية. |

إبقاء كامل جلسة إسقاط نظام صف و `SessionProjection*` مفردات. إسقاط هو حمل متابعة صيانة قراءة نموذج؛`Reducer` فقط شرح ذلك طي عملية، سوف باهت تحويل ذاكرة مؤقتة و فحص بحث مسؤولية. إبقاء `SessionTitleService`، فحص نقطة سياسة، حفظ دائم حزمة اسم، وقت سياق و tmux سياق.

### نظام الملفات،skill،subagent و Web مزود

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `@deepseek-ai/dsh-fs-policy` | `@deepseek-ai/dsh-fs-observation-policy` | هذا حزمة تعريف أي بعض نظام الملفات مراقبة يمكن تخويل لاحق عملية. هو لا هو كامل نظام الملفات سياسة أو صندوق رملي سياسة. |
| `FsPolicyExec` | `FsObservationActor` | هذا قيمة يمثل سياسة الذي صلة ربط مراقبة و عملية تنفيذ رئيسي جسم. هو ذاته لا تنفيذ سياسة. |
| `SkillService` | `SkillRegistry` | هذا خدمة تسجيل مزود، و من ذلك دليل تحليل skill(تقنية قدرة). |
| `@deepseek-ai/dsh-skill-local`،`LocalSkillProvider`، مزود id `local` | `@deepseek-ai/dsh-skill-filesystem`،`FileSystemSkillProvider`، مزود id `filesystem` | هذا مزود عبر يمكن يقع في محلي أو بعيد طرف `ctx.fs` اكتشاف skill ملف. ذلك آلية هو نظام الملفات وصول، بينما لا هو محلي صفة. |
| `SubagentService` | `SubagentRuntime` | هذا خدمة اختيار مزود، و يملك فوري spawn، استعادة، تتبع دخول، إلغاء و تسوية سلوك. |
| `@deepseek-ai/dsh-subagent-spawn`, `SpawnProvider` | `@deepseek-ai/dsh-subagent-spawn-in-process`, `SpawnInProcessProvider` | هذا مزود في حالي عملية داخل بدء فرعي agent. إعداد مزود id ما زال لـ `spawn`. |
| `@deepseek-ai/dsh-subagent-fork`, `ForkProvider` | `@deepseek-ai/dsh-subagent-fork-in-process`, `ForkInProcessProvider` | هذا مزود في حالي عملية داخل fork واحد agent. إعداد مزود id ما زال لـ `fork`. |
| `@deepseek-ai/dsh-subagent-inprocess`, `subagent-inprocess/` | `@deepseek-ai/dsh-subagent-in-process-driver`, `subagent-in-process-driver/` | هذا حزمة يتضمن عام عملية داخل قيادة منطق، بينما لا هو رقم ثلاثة عدد مزود. |
| خاص `SdkProvider`، يقع في `dsh-subagent-dsh-sdk` في | `SdkSubagentProvider` | تكرار حزمة حد تحديد كلمة هو متعمد إبقاء، صنف اسم أيضا يجب شرح هو عبر SDK توفير subagent. |
| `WebService`, `WebServiceConfig` | `WebRuntime`, `WebRuntimeConfig` | هذا كائن اختيار مزود و تشغيل فوري بحث و إمساك أخذ عملية. إبقاء حزمة، مفتاح، مزود حزمة و نموذج أداة. |
| `@deepseek-ai/dsh-web-fetch-local`،`LocalFetchProvider`،`LocalFetchLimits`، مزود id `local-http` | `@deepseek-ai/dsh-web-fetch-http`،`HttpFetchProvider`،`HttpFetchLimits`، مزود id `http` | هذا مزود تنفيذ مباشر HTTP إمساك أخذ.`local` فقط شرح شفرة تماما جيد في أي داخل تشغيل، و لم شرح هو توفير أي نوع آلية. |

إبقاء `@deepseek-ai/dsh-subagent-dsh-sdk`، ذلك مزود id `dsh-sdk`، خارجي ACP(Agent Client Protocol) ،Codex و Claude Code مزود نظام صف،subagent أداة حزمة اسم، رئيسي نظام الملفات حزمة و خلفية، نظام الملفات أداة و حدث، و skill شعار فصل و أداة حزمة.

### خطاف، منع حماية،Plan Mode، توسيع و تشخيص

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `@deepseek-ai/dsh-hooks-claude`،`ClaudeHookConfig`،`parseClaudeConfig`، جهة قول `claude` | `@deepseek-ai/dsh-hooks-claude-code`،`ClaudeCodeHookConfig`،`parseClaudeCodeConfig`، جهة قول `claude-code` | هذا خطاف جسر وصل موجه إلى Claude Code، بينما غير كل Anthropic أو Claude منتج. |
| `@deepseek-ai/dsh-repeat-tool-guard`، إضافة/مصدر `repeat-tool-guard` | `@deepseek-ai/dsh-repeat-tool-reminder`، إضافة/مصدر `repeat-tool-reminder` | هذا إضافة نحو نموذج إضافة رفع تنبيه، و لا منع توقف أداة استدعاء، أيضا لا تنفيذ منع حماية قرار. |
| `@deepseek-ai/dsh-timeout-policy` | `@deepseek-ai/dsh-tool-call-timeout-policy` | كامل `tool-call` حد تحديد كلمة شرح هذا سياسة حد كائن، بينما لن يأخذ إضافة تسمية لـ موجه إلى نموذج أداة. إبقاء ذلك `guard/timeout-policy/` دليل و إضافة id `timeout-policy`؛`packages/*/tool-*` دليل اتفاق ما زال فقط ملائم لأجل تسجيل أداة حزمة. |
| `PlanModeService` | `PlanModeController` | هذا كائن تحكم دخول و خروج حساب تخطيط نمط حالة تحويل، بينما لا هو عام تنفيذ وقت التشغيل. |
| `packages/self-modification/` | `packages/extensions/` | هذا مجموعة يتضمن مستودع إضافة فحص و تركيب أداة.`extensions` شرح مستقر حزمة مسؤولية، لكن لا صوت تسمية agent سوف تعديل ذاته. إبقاء حزمة اسم `tool-cordis` و مستودع إضافة اسم. |
| `packages/support/` | `packages/test-support/` | هذا مجموعة فقط يتضمن اختبار أساس أساس ضبط تطبيق، ذلك مسار يجب واضح شرح هذا واحد نقطة. |
| أصل support نظام صف في `invariants/` | `runtime-diagnostics/invariants/` | كل إدارة تسليم مسبق ضبط لم يتضمن ثابت كمية فحص، هو جمع ما زال يمكن في إنتاج تشخيص في تشغيل، لذلك لا يخص اختبار دعم حمل. |
| `InvariantService` | `InvariantRegistry` | هذا كائن يملك قد تسجيل ثابت كمية فحص. إبقاء `@deepseek-ai/dsh-invariants` و `ctx.invariants`. |
| `packages/client/test-runtime/` | `packages/test-support/client-runtime/` | هذا حزمة هو عميل اختبار أساس أساس ضبط تطبيق. إذا قائم NPM اسم قد شرح هذا واحد اتفاق، فإن إعطاء بـ إبقاء. |

إبقاء MCP،Todo،Plan Mode حزمة، مفتاح، حدث و أداة اسم. هذا قرار إعادة تسمية تحكم جهاز صنف، بينما لا هو منتج وظيفة.

### فعلي استخدام أداة،E2B،Host، تركيب حزمة، عرض مثال و تطبيق

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `util/paths/`, `@deepseek-ai/dsh-paths` | `util/home-paths/`, `@deepseek-ai/dsh-home-paths` | هذه مساعد مساعدة دالة تحليل Harness رئيسي دليل تحت مسار، و غير عام مسار مكتبة. قد دقيق تأكيد شرح إرجاع مسار دالة اسم إبقاء ثابت. |
| `util/retention/`, `@deepseek-ai/dsh-retention` | `util/output-retention/`, `@deepseek-ai/dsh-output-retention` | هذا سياسة إبقاء أمر و أداة إخراج، بينما لا هو عام بيانات إبقاء إطار هيكل. |
| `E2BSandboxService` | `E2BRuntime` | هذا صنف إنشاء، إعادة استخدام و تحرير نظام الملفات و عملية فرعية مهايئ الذي استخدام E2B تنفيذ بيئة. هو مقارنة مفرد عدد صندوق رملي جملة مقبض مسؤولية أكثر واسع، أيضا مقارنة عام كل من أكثر أداة جسم. إبقاء `@deepseek-ai/dsh-e2b`،`ctx.e2b` و `e2b/` مجموعة. |
| `@deepseek-ai/dsh-frontend-static` | `@deepseek-ai/dsh-host-frontend-static` | هذا حزمة هو توفير قبل طرف مورد Host إضافة. هذا بادئة يمكن سوف هو و قبل طرف تطبيق شفرة منطقة قسم فتح. |
| `PluginInventoryService` | `PluginInventoryGateway` | هذا صنف فقط مسؤول يأخذ فوري Loader شجرة ملائم إعداد إلى `pluginInventory/list` RPC. هو لا يملك نفس عملية خدمة، ذاكرة مؤقتة، تاريخ أو تعديل مسار.`Gateway` دقيق تأكيد شرح قائم زاوية لون. |
| `@deepseek-ai/dsh-jsonrpc-demo`،`@deepseek-ai/dsh-sdk-jsonrpc-demo`،`@deepseek-ai/dsh-sdk-python-runtime` | قد حذف | Python وقت التشغيل تحزيم قائم `@deepseek-ai/dsh` CLI و ذلك `sdk` profile؛ خاص تطبيق حزمة سوف إعادة إنتاج ثاني عدد بدء جهاز. |
| `packages/examples/jsonrpc-demo/`،`packages/sdk/python-runtime/` | قد حذف | Python وقت التشغيل wheel إغلاق حزمة manifest مسؤول تحزيم، بلا حاجة مستقل تطبيق حزمة. |
| `examples/jsonrpc-agent/` | `python/sdk/examples/` | هذا عرض مثال عرض عرض Python استخدام `sdk` profile و لديه ترتيب patch. |
| `@deepseek-ai/dsh-acp-demo` | `@deepseek-ai/dsh-acp-app` | هذا حزمة هو ACP profile تطبيق تركيب حزمة، لا هو مستقل demo bin. |
| نشر أصل manifest `dsh-jsonrpc-agent-pkg`،`dsh-sdk-python-runtime-closure` | `dsh-python-runtime-closure` | هذا صفر شفرة manifest تعريف Python وقت التشغيل wheel كامل `dsh` اعتماد إغلاق حزمة، لم يعد تسمية مستقل SDK تطبيق. |
| `@deepseek-ai/dsh-frontend` | `@deepseek-ai/dsh-web-frontend` | هذا تطبيق هو Web قبل طرف. إبقاء ذلك شيء إدارة دليل `apps/web/`. |

إبقاء atomic-write،brand،native-command،timeout فعلي استخدام أداة، دليل اختيار جهاز،`dsh-base`،`dsh-web-app`،`dsh-sdk-app`،`dsh-acp-app`، تطبيق بدء،CLI(أمر سطر واجهة) اسم، و `headless` حزمة، تركيب حزمة و عرض مثال هوية.`headless` هو مسبق مدة منتج هذا جودة، لم قدوم أيضا يمكن دعم حمل لا توقف مرة صفة تنفيذ.

### عميل وقت التشغيل و UI

| قديم اسم | حالي اسم | إدارة من |
|---|---|---|
| `SlotsService` | `SlotRegistry` | هذا كائن يملك أداة اسم slot إعلان و تسجيل بند. |
| `SessionsService` | `SessionRuntime` | هذا كائن يملك فوري عميل جلسة تنسيق ضبط مسؤولية، بينما لا هو يتم حركة جلسة قائمة. |
| `WorkspacesService` | `WorkspaceRuntime` | هذا عميل كائن تنسيق ضبط فوري مساحة العمل اختيار و عملية. إذا بيان لم نقطة اسم أكثر تعديل بعض عدد قائم `ctx` مفتاح، فإن هذا مفتاح إبقاء ثابت. |
| `WorkspaceGroupBy`،`WorkspaceOrderBy`،`workspaceExpansion`،`setWorkspaceExpanded`،`expandedProjects`،`projectLabel`،`recentSessionOrder`،`recentSessionUpdatedAt`،`syncRecentSessions`،`setRecentSessionOrder`،`retainWorkspaceKeys`،`workspaceKey` | `SessionGroupBy`،`SessionOrderBy`،`groupExpansion`،`setGroupExpanded`،`expandedGroups`،`workspaceLabel`،`sessionOrderByAccount`،`sessionUpdatedAtByAccount`،`syncSessionOrderAccount`،`setSessionOrder`،`retainAccountKeys`،`accountKey` | هذه اسم وصف هو جلسة قائمة فحص نظر حالة. ذلك account يشمل حقيقي مساحة العمل، لم قسم مجموعة بند و مستو فرش قائمة. لذلك،`Workspace`،`project` و `recent` إشارة نحو خطأ كائن أو آلية. إبقاء `WorkspaceViewState`؛ هذا تخزين ما زال يخص مساحة العمل متصفح. |
| `LocaleService` | `LocaleRuntime` | هذا كائن تنسيق ضبط منطقة مجال ضبط تعريف، اختيار، حفظ دائم و تغيير إصدار. |
| `ThemeService` | `ThemeRuntime` | هذا كائن تنسيق ضبط رئيسي عنوان، انحراف جيد تحليل، نظام شعور معرفة و تغيير إصدار. |
| `LayoutService` | `LayoutController` | هذا كائن تحكم حالي UI تخطيط حالة. |
| `@deepseek-ai/dsh-client-ui-model` | `@deepseek-ai/dsh-client-ui-model-selection` | هذا حزمة تحكم جلسة نموذج اختيار. مفرد عدد `model` اسم أثر مجال مرور عرض. |
| `ModelService`, `ctx.models` | `ModelDirectoryResolver`, `ctx.modelDirectories` | هو وحيد عام عملية `directoryFor(sessionId)` لـ كل فوري جلسة تحليل و إبقاء واحد دليل. هو لا يوجد تسجيل API، لذلك استخدام `Registry` و لا دقيق تأكيد. كل `ModelDirectory` ما زال هو موجه إلى مستهلك اختياري نموذج دليل. |
| `SettingsScopeService` | `SettingsScopeBinder` | هو وحيد عملية يأخذ واحد نسخة نطاق الأسماء مواصفة ربط إلى استدعاء جهة نقل طبقة و دورة الحياة، و إرجاع `SettingsScopeController`. إبقاء `ctx.settingsScope`؛ هو تسمية هو مفرد واحد ربط قدرة، بينما لا هو scope تجميع دمج. |
| `@deepseek-ai/dsh-client-ui-models` | `@deepseek-ai/dsh-client-ui-settings-models` | هذا حزمة يملك Models ضبط وجه لوح. إبقاء `ModelsSettingsStore`؛ هو حفظ واحد أداة لديه بيانات عملية و حجز قراءة قدرة ضبط عرض نموذج، تأكيد فعلي هو تخزين. |
| `@deepseek-ai/dsh-client-ui-plugin-config`،`client/ui-plugin-config/` | `@deepseek-ai/dsh-client-ui-settings-plugins`،`client/ui-settings-plugins/` | هذا حزمة يملك Plugins ضبط قسم منطقة، بينما لا هو عام إضافة إعداد نظام. هدف اسم عودة دخول `ui-settings-*` نظام صف، و اعتماد هذا قسم منطقة تكرار عدد منتج اسم. |
| `PluginConfigSection`،`PluginConfigSectionProps`،`PluginConfigSectionInjected`،`PluginSettingsTabRow`،`PluginConfigKey`،`settings.pluginConfig` | `PluginsSettingsSection`،`PluginsSettingsSectionProps`،`PluginsSettingsSectionInjected`،`PluginsSettingsTabEntry`،`PluginsSettingsLocaleKey`،`settings.plugins` | هذا قسم منطقة يملك Plugins ضبط عرض و tab بيان. بيانات وصفية قيمة يمثل واحد بند slot entry، بينما لا هو واحد بند تصيير سطر. كل ورقة بطاقة ما زال تحرير واحد إضافة إعداد. |
| `@deepseek-ai/dsh-client-ui-plugins`،`client/ui-plugins/`،Loader id `ui-plugins`،`client-ui-plugins-invariant` | `@deepseek-ai/dsh-client-ui-settings-plugin-inventory`،`client/ui-settings-plugin-inventory/`،Loader id `ui-settings-plugin-inventory`،`client-ui-settings-plugin-inventory-invariant` | هذا عدد بعد قدوم إضافة دخول حزمة يملك Plugins ضبط قسم منطقة في فقط قراءة Plugin Inventory tab.`ui-plugins` أثر مجال مرور عرض، أيضا لا يمكن سوف هذا بيان و يمكن تحرير إضافة ضبط منطقة قسم فتح. |
| أصل `ui-plugins` حزمة في `PluginSettingsSection`،`PluginSettingsSectionProps`،`PluginSettingsSectionInjected`،`PluginsKey`،`settings.plugins` | `PluginInventorySettingsTab`،`PluginInventorySettingsTabProps`،`PluginInventorySettingsTabInjected`،`PluginInventoryLocaleKey`،`settings.pluginInventory` | هذا مكون الآن مساهمة واحد tab، بينما لا هو ضبط قسم منطقة. ذلك بقية اسم واضح شرح بيان رئيسي عنوان، و تجنب تجنب و `PluginsSettingsSection` و ذلك `settings.plugins` منطقة مجال ضبط نطاق الأسماء اندفاع مفاجئ. إبقاء مشترك `settings.plugins.tab` slot اسم؛ اثنان عدد tab كل عبر هذا slot نحو Plugins قسم منطقة مساهمة محتوى. |
| `@deepseek-ai/dsh-client-ui-feedback`،`client/ui-feedback/`،Loader id `ui-feedback`،`client-ui-feedback-invariant` | `@deepseek-ai/dsh-client-ui-message-feedback`،`client/ui-message-feedback/`،Loader id `ui-message-feedback`،`client-ui-message-feedback-invariant` | هذا عدد حزمة عبر `messageFeedback` Remote عرض assistant رسالة تقييم قسم و شرح. قديم اسم نظر بدء قدوم أيضا شمول غطاء command feedback و بـ بعد ممكن ظهور أخرى عكس تغذية واجهة، لكن فعلي و غير مثل هذا. |
| أصل `ui-feedback` حزمة في `FeedbackController`،`FeedbackStatus`،`FeedbackView`،`FeedbackActionResult`،`FeedbackInjected`،`FeedbackActionProps`،`FeedbackActions`،`FeedbackKey` | `MessageFeedbackController`،`MessageFeedbackStatus`،`MessageFeedbackView`،`MessageFeedbackActionResult`،`MessageFeedbackInjected`،`MessageFeedbackActionProps`،`MessageFeedbackActions`،`MessageFeedbackKey` | هذه اسم سوف من Client حزمة توجيه خروج. زيادة `Message` حد تحديد كلمة، تجنب تجنب هو جمع صوت تسمية بديل جدول كل عكس تغذية مجال. إبقاء `Controller`: هذا كائن قبول تقييم قسم و شرح عملية، و تنسيق ضبط واحد Session تحميل، تعديل، اندفاع مفاجئ، إعادة وصل و تحرير حالة. |
| `agent-loop-store.ts`،`bash-store.ts`،`web-search-store.ts` | `agent-loop-card-controller.ts`،`bash-card-controller.ts`،`web-search-card-controller.ts` | كل وحدة كل توجيه خروج واحد بطاقة تحكم جهاز. خاص `SnapshotStore` حقل لن يجعل وحدة يصبح تخزين. |
| `card-store.ts` | `card-form.ts` | هذا وحدة يملك مؤقت تخزين جدول مفرد، حقل تحويل و جدول مفرد عملية. هو إرجاع لقطة تخزين هو عرض مهايئ، بينما لا هو وحدة رئيسي يلزم مسؤولية. |
| `@deepseek-ai/dsh-client-ui-question` | `@deepseek-ai/dsh-client-ui-user-questions` | UI عرض مستخدم مشكلة seam، بينما لا هو مهمة معنى مشكلة مجال. |
| `@deepseek-ai/dsh-client-ui-command`, `ui-command/` | `@deepseek-ai/dsh-client-ui-commands`, `ui-commands/` | هذا حزمة عرض و تشغيل واحد مجموعة أمر. |
| `@deepseek-ai/dsh-client-ui-directory-picker`،`client/ui-directory-picker/`،Loader id `ui-directory-picker`،`client-ui-directory-picker-invariant` | `@deepseek-ai/dsh-client-ui-directory-picker-browse`،`client/ui-directory-picker-browse/`،Loader id `ui-directory-picker-browse`،`client-ui-directory-picker-browse-invariant` | عميل حزمة الآن قد تفكيك صار `browse` و `native` اثنان نوع دليل اختيار جهاز عرض. لم إضافة حد تحديد كلمة حزمة فعلي فقط هو browse تنفيذ، و غير اثنان من مشترك نفس تعريف. هدف اسم و Host خلفية نظام صف متسق، لا تغيير حد. |
| عميل `ctx.command`،`CommandService`،`CommandServiceContract` | `ctx.commandUi`،`CommandUiRuntime`،`CommandUiContract` | Host قد يملك `ctx.commands`. هذا عميل خدمة هو أمر اكتشاف و تنفيذ UI وقت التشغيل. قائم `CommandUiSpec` تأكيد قيام `Ui` كبير صغير كتابة صيغة. |
| `ConversationService` | `ConversationController` | هذا كائن تحكم حالي محادثة حالة و مستخدم عملية. |
| `InputService` | `SessionInputResolver` | هذا واجهة لـ واحد جلسة أثر مجال تحليل إدخال خارج مراقبة. هو حيث لا هو عام إدخال سجل التسجيل، أيضا لا هو تنفيذ خدمة. إبقاء `InputHub` بصفة أداة جسم في محور، و إبقاء `ctx.conversation.input` بصفة مقابل خارج واجهة. |

PascalCase معرف رمز داخلي استخدام `Ui`، لا يلزم استخدام `UI`. حذف غير بيان واضح اشتراط إعادة تسمية، لا فإن إبقاء ذلك بقية عميل حزمة اسم. في API مستو وجه إزالة متبادل صلة جدول طبقة قبل، إبقاء قد ترك استخدام عميل اتصال و Host `ApiProxy` مفردات؛ رفع قبل إعادة تسمية فقط سوف زيادة تعديل كمية، لن بناء قيام حمل دائم اسم.

## واضح إبقاء اسم

التالي مرور مرور نقاش نقاش اسم إبقاء ثابت، لأن حالي أثر مجال دقيق تأكيد، أو إعادة تسمية سوف صنع صنع وهمي زائف عام فكرة:

- إبقاء كامل sandbox نظام صف و `ctx.sandbox`. لا نيل جذب دخول `processSandbox`.
- إبقاء `@deepseek-ai/dsh-api-gateway`،`ctx.typertGateway` و `TypertGatewayService`.
- إبقاء جلسة إسقاط اسم. إسقاط و لا فقط هو عودة نحو دالة.
- إبقاء `@deepseek-ai/dsh-session-stats`،`sessionStats` و `SessionStatsProjection`. هذه اسم دقيق تأكيد يمثل كل جلسة موحد حساب بيانات و تحمل تحميل هو جمع حمل متابعة صيانة قراءة نموذج.
- إبقاء `GoalService`؛ هو يملك هدف حالة آلة، قطع قرار حق، مقارنة مقارنة و ضبط سلوك، حدث و بعيد مسار عملية، لا فقط هو تخزين.
- إبقاء `SessionTitleService`؛ هو مسؤولية هو من كثير عدد عنوان مزود مشترك مجال خدمة.
- إبقاء `PermissionPresetSettingsController`، أي جعل هو جدا طويل. كل كلمة كل في حد تحديد ذلك مسؤولية.
- إبقاء `ModelsSettingsStore`؛ ذلك رئيسي يلزم اتفاق هو واحد أداة لديه تخزين عملية ضبط بيانات نموذج.
- إبقاء `InputHub`؛ هو هو دعم دعم `SessionInputResolver` أداة جسم في محور.
- إبقاء `dsh-subagent-dsh-sdk` و مزود id `dsh-sdk`؛ تكرار حد تحديد كلمة يمكن تجنب تجنب اختلاف معنى.
- إبقاء `headless`؛ أي جعل وقت التشغيل بـ بعد دعم حمل لا توقف مرة صفة استخدام، هذا منتج هوية ما زال دقيق تأكيد.
- إبقاء قد ترك استخدام Host `ApiProxy` و عميل اتصال اسم، مباشر حتى API بديل خطة سوف ذلك إزالة.
- Host خادم و مزود غير متصل Web قدرة كل إبقاء `Web`. فقط مباشر إمساك أخذ مزود استخدام `HTTP`.
- إبقاء `E2B` بصفة حزمة اسم و سياق اسم، لا تعديل لـ `E2B sandbox`.
- إبقاء MCP،Todo، تطبيق بدء، أساس أساس تركيب حزمة،web-app تركيب حزمة و CLI اسم. إبقاء دليل اختيار جهاز قدرة و Host خلفية اسم؛ فقط إعادة تسمية لم إضافة حد تحديد كلمة Client `browse` عرض.
- إبقاء `@deepseek-ai/dsh-client-ui-directory-picker-native`؛ ذلك بعد لاحقة شرح هو هو في إعادة تسمية بعد `-browse` تغيير جسم جانب استخدام أصلي اختيار جهاز عرض. إبقاء `SURFACE_PACKAGES`؛ في دليل اختيار جهاز تلقائي اختيار جهاز في، هو هو عميل عرض طرف وجه حزمة خريطة، و و `BACKEND_PACKAGES` مقابل وفق.
- إبقاء `@deepseek-ai/dsh-host-plugin-inventory`،`ctx.pluginInventory`،`pluginInventory/list` Remote و `PluginInventory*` تحميل حمل نوع. هو جمع دقيق تأكيد تسمية من Host يملك فقط قراءة بيان؛ فقط لديه مهايئ صنف و أثر مجال مرور عرض عميل عرض اسم حاجة تعديل.
- إبقاء `ConfigurablePluginsTab`. هذا tab تصيير أداة لديه يمكن تحرير إعداد إضافة، لا يملك كامل Plugins ضبط قسم منطقة.
- إبقاء مشترك `settings.plugins.tab` slot. هو يخص Plugins ضبط قسم منطقة. بيان حزمة فقط يأخذ ذاتي ذات locale namespace تعديل لـ `settings.pluginInventory`، لن إنشاء مستقل tab slot.
- إبقاء `@deepseek-ai/dsh-message-feedback` قدرة،`messageFeedback` Remote،assistant-action entry id `feedback`،hook key `feedback` و locale namespace `feedback`. هو جمع الذي في واجهة قد يأخذ أثر مجال حد تحديد لـ رسالة عكس تغذية أو محلي assistant-message slot. فقط تعديل أثر مجال مرور عرض Client حزمة اسم و توجيه خروج UI اسم.
- إبقاء `RemoteFailure`،`RemoteResult` و `SessionRemotes`. قبل اثنان من هو Typert تحميل جسم نتيجة قيمة، بعد من هو عميل Session تجميع مجموعة استخدام واحد مجموعة Remote نطاق الأسماء. هو جمع كل لا هو store،controller،registry أو runtime.
- إبقاء مستخدم أمر `/export`،Host توجيه `/api/session.export`،`DownloadsApi` و ذلك `sessionLog` عملية. أمر شرح مستخدم حركة عمل،Host توجيه توجيه خروج عودة ملف،API فإن عودة صنف مباشر HTTP تحت تحميل. إعادة تسمية Client controller يملك مستقل متصفح تحت تحميل خطوة.
- اختبار ملف اسم إبقاء `.client` و `.host`. هو جمع معرف اختبار دخول تحرير ترجمة طرف وجه، لا صوت تسمية منتج مسؤولية.

## اعتبار مرور بديل خطة

**إبقاء قائم اسم و إضافة مفردات جدول.**غير مقبول. مفردات جدول لا يمكن يجعل من PowerShell تنفيذ `BashExecutor` اسم فرعي ذلك فعلي، أيضا لا يمكن يجعل `ToolRegistry` جدول واضح هو سوف تنفيذ و قوي صنع فعلي تطبيق أداة سياسة. معرف رمز ذاته يجب تحمل تحميل لديه استخدام منطقة آخر.

**لـ كل NPM حزمة إضافة الذي تابع مجموعة بادئة.**غير مقبول. مسطح مستو NPM اسم لا حاجة تكرار لحظة دليل شجرة. آلة آلة إضافة بادئة فقط سوف زيادة طويل درجة، لا يمكن حل تفسير حزمة مسؤولية.

**سوف كامل مستودع تسمية لـ SDK.**غير مقبول. هذا مشروع هو agent harness(ذكي جسم إطار هيكل).SDK هو Python و TypeScript عميل استخدام، تلقي دعم حمل JSON-RPC عميل/خادم مكدس. واحد كلمة اثنان معنى سوف جعل حزمة اسم و منتج نص سجل إنتاج اختلاف معنى.

**كل Cordis خدمة صنف كل استخدام `Service`.**غير مقبول.Cordis وراثة فقط هو تنفيذ واقع. صنف اسم يجب إبلاغ إبلاغ استدعاء جهة هذا كائن مسؤول تسجيل، تخزين، تحليل، تحكم أيضا هو تشغيل عمل.

**موحد واحد استخدام `Runtime` استبدال `Service`.**غير مقبول. فقط لديه كائن يملك فوري تنفيذ أو دورة الحياة وقت،`Runtime` عندئذ صحيح تأكيد. سجل التسجيل، تخزين، دليل، تحكم جهاز، محلل، جذب محرك و إعداد كائن كل ينبغي إبقاء أكثر دقيق مسؤولية اسم.

**أولوية استخدام الأكثر قصير اسم.**غير مقبول. فقط لديه أثر مجال واضح بعد، بسيط قصير عندئذ لديه قيمة قيمة.`PermissionPresetSettingsController` إبقاء `Preset`؛`JobId` بسيط قصير، هو لأن `Job` قد جدول واضح مجال؛`BgTaskId` رغم قصير، لكن غامض عسير صعب فهم.

**لـ لم قدوم ممكن ظهور وظيفة استخدام عرض عام اسم.**غير مقبول. ينبغي حسب مستقر حالي مسؤولية تسمية. لم قدوم إذا يلزم تغيير حد، يمكن في إصدار قبل مجددا مرة إعادة تسمية كائن، أو في إصدار بعد آخر كتابة رفع سجل. يحتوي معنى نموذج غامض اسم سوف يجعل كل موضع حالي قراءة من لـ بعد لم بناء لم قدوم دفع خروج إدارة حل صار هذا.

**سوف `dsh-compact-basic` إعادة تسمية لـ `dsh-compaction-llm`.**غير مقبول.`LLM` لا يوجد في حالي خلفية نظام صف في زيادة منطقة آخر.`basic` معنى رسم أكثر تغلب صنع، أيضا لن صوت تسمية وجود واحد فعلي و لا وجود حساب قاعدة.

**سوف جلسة إسقاط إعادة تسمية لـ عودة نحو جهاز.**غير مقبول. عودة نحو فقط هو بناء إسقاط طريقة. هذا حزمة أيضا يملك قراءة نموذج قيمة، ذاكرة مؤقتة و فحص بحث اتفاق.

**سوف حمل دائم Bash أداة إعادة تسمية لـ `bash-terminal`.**غير مقبول. هذا اسم و طرفية جلسة نظام صف اندفاع مفاجئ. سوف `tool-bash-persistent` نقل إلى `shell/` يمكن تصحيح صحيح ذلك ملكية موضع، معا قائم اسم ما زال قدرة سوف ذلك و مرة صفة Bash أداة منطقة قسم فتح.

**تطبيق بيان وقت واحد و إعادة تسمية أو تفكيك قسم حد.**غير مقبول. مراجعة شخص يجب قدرة كاف تأكيد سلوك لا يوجد تغيير. حق صحيح حد نقص وقوع حاجة مستقل رفع سجل، اختبار و عاقبة قسم تحليل.

**لـ قديم اسم إبقاء آخر اسم.**غير مقبول. لا يوجد قد إصدار مستهلك حاجة هذه آخر اسم. آخر اسم سوف إبقاء اثنان طقم مفردات، جعل أول مرة إصدار يحمل واحد بند من لم لديه مستخدم حاجة ترحيل.

## تحقق

- بيان في كل بند خريطة كل ظهور في مستودع في. كل نظام صف فقط لديه واحد طقم عام مفردات؛ نفس عدد Cordis سياق في لا يوجد توافق حزمة، إعادة توجيه خروج آخر اسم، تكرار `ctx` مفتاح، مزدوج إعادة إضافة id، مزدوج إعادة حدث id، قديم أداة آخر اسم أو رجوع محلل.
- وقت التشغيل سلوك، حزمة حد، قيمة افتراضية، سياسة، حفظ دائم دلالة و نموذج سلوك إبقاء انتظار قيمة، فقط لديه معرف رمز ذاته مرئي وقت حذف خارج.
- حزمة دليل،NPM اسم، استيراد،manifest(بيانات وصفية بيان) ،TypeScript مرجع و مسار،Cordis إعداد، إضافة id، خدمة مفتاح، حدث، أداة،RPC اسم، بيان نقطة اسم حفظ دائم اسم،fixture، لقطة، عرض مثال، توليد دليل و حالي نص سجل كل استخدام قد تنفيذ مفردات.
- حالي موضع في implemented حالة Agent Note استخدام واقع اسم و مسار. حزمة إعادة قسم مجموعة شرح سجل قسم مجموعة بيان و حزمة اسم هدف،SDK إزالة شرح سوف `SDK` حد تحديد لـ وقت التشغيل بروتوكول، مهلة سياسة شرح سجل حزمة اسم إدارة من.
- إعداد مقابل حزمة إنشاء إشارة جنوب يتضمن مسؤولية كلمة اتفاق،`packages/AGENTS.md` رابط إلى هذا اتفاق، فن لغة جدول سجل اختيار تحديد استخدام كلمة و `Typert` تجميع كتابة، أصل مشروع نص سجل سوف منتج تسمية لـ DeepSeek Harness، بينما لا هو DeepSeek Harness SDK.
- قد إزالة SDK مشروع أداة سلسلة متابعة إبقاء لا وجود.
- `pnpm run check:ci` تغطية مصدر شفرة مستو وجه نوع فحص، بناء، حزمة حماية توليد فحص، توليد مشاركة اعتبار مورد مادة فحص، تلقي أثر لقطة، قلب ترجمة إعداد مقابل،`doc-sync` و lint. إصدار شكل Python وقت التشغيل خطر دخان اختبار و مطلوب CI تغطية تحزيم وقت التشغيل و منصة مسار.

## عاقبة

مستودع لـ كل إعادة تسمية نظام صف إبقاء واحد طقم مفردات. بيان نقطة اسم قديم مغناطيس قرص اسم، بروتوكول قيمة، أداة اسم و بند إعداد لم يعد عمل. قدرة كاف تعرف آخر قديم قديم إعداد الذي تابع محلل سوف واضح تقرير خطأ، بينما لا هو معا قبول اثنان نوع شكل صيغة.

واحد بعض اسم أكثر طويل. مقدار خارج زيادة كلمة فقط لديه في منع توقف خطأ وصف إذن أو آلية وقت عندئذ متعمد معنى. إذا اسم في كلمة لا يستطيع الكل حد تحديد مسؤولية، طويل اسم ما زال خطأ.

مسؤولية بعد لاحقة لا يستطيع بديل مقابل سلوك فحص. حزمة إنشاء إشارة جنوب إبقاء هذا قرار في مباشر حكم قطع طريقة: فحص استدعاء جهة تنفيذ ماذا عملية، كائن يملك ماذا دورة الحياة، و كائن تحكم ماذا فشل أو سياسة.

أساس في قديم مسار و قديم رمز رقم فرع حاجة حل قرار اندفاع مفاجئ. هذا هو إصدار قبل إزالة قديم مفردات كما لا إبقاء توافق آخر اسم مرة صفة صار هذا.

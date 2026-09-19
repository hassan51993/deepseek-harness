# تطوير إشارة جنوب

[English](development.md) | العربية

تركيب بناء تعليم مسار جذب توجيه جديد مساهمة من من دقيق تجهيز قبل وضع شرط بدء، مباشر إلى فحص خروج دليل عبر فحص. بعد وجه مساهمة من مشاركة اعتبار وسيط تعريف مستودع تخطيط، يوم معتاد سير العمل و CI مجموعة نسج طريقة. تصميم اعتماد حسب و تنفيذ دقيق عقدة يخص رابط Agent Note و نص برمجي.

<a id="setup-tutorial"></a>

## تركيب بناء تعليم مسار

### قبل وضع شرط

- Node.js دعم حمل 22.19+ و 24+.CI تغطية 22.19،24 و 26؛ رؤية [Node جذب محرك تحت حد Agent Note](../.agents/notes/implemented/process/2026-07-06-node-engine-floor.zh.md).
- تفعيل Corepack pnpm. مستودع في `package.json` في ثابت استخدام `pnpm@11.7.0`؛ إذا `pnpm --version` لا يمكن عبر Corepack تحليل، طلب أولا تشغيل `corepack enable`.
- Git 2.26 أو أكثر عال إصدار؛ خطاف ضبط سوف تفعيل Git worktree مخصص تابع إعداد توسيع.
- اختياري: واحد DeepSeek API key، لأجل Web،headless و ACP(Agent Client Protocol) تلقائي تحويل agent(ذكي جسم) عرض عرض و حقيقي API e2e اختبار.

### Windows و WSL 2

في Windows فوق، يمكن استخدام أصلي أداة تطوير، أيضا يمكن عبر WSL 2 استخدام Linux بيئة.WSL 2 حيث متاح في تحقق Linux سلوك، أيضا يمكن في أصلي اعتماد تحرير ترجمة أو نظام الملفات إذن منع عائق Windows تطوير وقت توفير استخدام Linux أداة سلسلة طريق مسار. كل نوع بيئة كل حاجة دقيق تجهيز متبادل ينبغي وقت التشغيل، تحرير ترجمة أداة و إذن؛WSL هو اختياري بند.

سوف فحص خروج دليل، قد تثبيت اعتماد و أداة سلسلة وضع في نفس عملية نظام بيئة في. استخدام WSL 2 وقت، سوف فحص خروج دليل وضع في Linux نظام الملفات في؛ استخدام Windows أصلي أداة وقت، فإن استخدام Windows نظام الملفات. عبر اثنان نوع نظام الملفات وصول سوف إعطاء Git، اعتماد تثبيت و بناء انتظار I/O سري تجميع نوع عملية زيادة فتح إلغاء. مشاركة رؤية دقيق لين[ملف تخزين و صفة قدرة إشارة جنوب](https://learn.microsoft.com/en-us/windows/wsl/filesystems#file-storage-and-performance-across-file-systems).

في كل نوع بيئة في قسم آخر تثبيت اعتماد، لأن مختلف عملية نظام استخدام أصلي اثنان دخول صنع و رابط ممكن مختلف. اختبار نتيجة ملائم لأجل تنفيذ اختبار بيئة؛Windows خاص لديه سلوك ما زال يحتاج في أصلي Windows فوق تحقق.

### أول مرة تركيب بناء

في مستودع أصل دليل تثبيت اعتماد:

```sh
pnpm install
```

تثبيت مرور مسار أيضا سوف عبر `scripts/install-lefthook.mjs` إعداد worktree محلي Lefthook خطاف و `dsh-translation-pairing` Git دمج قيادة.[worktree محلي خطاف Agent Note](../.agents/notes/implemented/process/2026-07-27-worktree-local-lefthook.zh.md) مسؤول خطاف مسار أمان اتفاق؛[تلقائي إعداد مقابل دمج Agent Note](../.agents/notes/implemented/process/2026-08-08-automatic-translation-pairing-merges.zh.md) مسؤول دمج قيادة.

إذا اعتماد هو من ذاكرة مؤقتة استعادة أو `postinstall` يتم قفز مرور بينما توجيه يؤدي مهمة واحد تجميع صار ناقص، طلب يد حركة تثبيت:

```sh
node scripts/install-lefthook.mjs
```

إذا حزمة تركيب نص برمجي رفض قائم Git إعداد أو تقرير إبلاغ قديم قديم قفل، طلب التزام دوران ذلك تشخيص و الذي رابط Agent Note، لا يلزم سند تخمين قياس تحرير worktree بيانات وصفية. نقل حركة فحص خروج دليل بعد، طلب إعادة تشغيل حزمة تركيب نص برمجي بـ إعادة توليد ذاتي لديه مسار.

جديد تغلب ضخم بعد طلب أولا تشغيل مرة نوع فحص:

```sh
pnpm run typecheck
```

`pnpm run typecheck` نجاح خروج أي يمثل تركيب بناء إتمام.

## مساهمة من مشاركة اعتبار

<a id="typescript-project-layout"></a>

### TypeScript مشروع تخطيط

مستودع استخدام متبادل متبادل عزل Host و Client aggregate. عادي حزمة فقط تسجيل تسجيل دخول منها واحد aggregate؛Host حزمة دخول `tsconfig.host.json`،Client حزمة دخول `tsconfig.client.json`؛`host/webserver`،`compaction/compaction` و `typert/registry` ثلاثة عدد حزمة يتم اثنان عدد aggregate معا مرجع، بصفة مشترك leaf، يجعل اثنان جانب مقابل نفس نسخة شفرة المصدر فعل نوع فحص.

| ملف | زاوية لون | هل بنية صار program؟ |
|---|---|---|
| `tsconfig.json` | solution أصل:`extends` base،`files: []`، مرجع اثنان عدد aggregate. هو هو tsserver اكتشاف مدخل، أيضا هو صريح تنفيذ كامل ورقة Project Reference رسم وقت مدخل؛ مرور وراثة `paths` ملء عند tsx تشغيل `scripts/` وقت تحليل إعداد. | لا |
| `tsconfig.host.json` | Host aggregate:Host حزمة، عرض مثال، اختبار، نص برمجي و website، و `api/remotes` Host خاص مثال project. | هو |
| `tsconfig.client.json` | Client aggregate:`packages/client/*` حزمة و ذلك اختبار،`apps/web`، و `api/remotes` Client خاص مثال project. | هو |
| `tsconfig.base.json` | مشترك compilerOptions و شفرة المصدر `paths` خريطة. معا هو كل vitest إعداد يجعل vite-tsconfig-paths إشارة نحو تحليل باب وجه: هو لا يوجد `include`، لذلك ذلك `paths` ملائم لأجل أي importer. | لا |
| `tsconfig.base.client.json` | متصفح تحرير ترجمة ضبط (`jsx`،DOM lib،`types: []`) ، من Client aggregate و كل `packages/client/*` حزمة extends. | لا |

Host و Client إبقاء اثنان عدد aggregate program، هو لأن اثنان جانب في نفسه مفتاح تحت بـ مختلف خدمة مقابل cordis `Context` واجهة فعل إعلان دمج؛ مفرد واحد program معا يرى اثنان نسخة دمج سوف تقرير اندفاع مفاجئ. هذا نوع اندفاع مفاجئ فقط وجود في `ts.Program` داخلي——وحدة تحليل دائم بعيد لن إطلاق هو——الذي بـ solution يمكن معا مرجع اثنان عدد aggregate، واحد paths باب وجه أيضا يمكن أفقي عبر اثنان جانب. من هذا دفع خروج ثلاثة بند سجل قاعدة:

- `tsconfig.base.json` دائم لا إضافة `include` أو `files`: هو جمع سوف تسرب تسرب دخول كل extends هو حزمة مشروع، و استلام ضيق باب وجه كل مطابقة نطاق.
- بنية صنع كل مستودع `ts.Program` نص برمجي صريح بـ `tsconfig.host.json` أو `tsconfig.client.json` لـ نوع فرعي——أصل solution دائم لا بصفة نوع فرعي، لأن يأخذ اثنان عدد aggregate عرض مستو دخول واحد program سوف اصطدام فوق `Context` دمج اندفاع مفاجئ.
- جديد حزمة فقط تسجيل تسجيل دخول واحد aggregate؛ فقط لديه فوق وصف تفكيك قسم حزمة معا يحمل اثنان عدد leaf إعداد، مشترك leaf بسبب اثنان جانب حاجة مقابل نفس نسخة شفرة المصدر فعل نوع فحص بينما تسجيل تسجيل دخول اثنان عدد aggregate. حزمة معا أداة لديه Node loader مدخل و browser مدخل و لا بنية صار تفكيك قسم إدارة من؛ عادي Client إضافة اثنان نسخة وقت التشغيل ناتج كل في Client بناء مرحلة مقطع توليد.

تفكيك قسم Host/Client tsconfig حزمة لديه ستة عدد:`api/remotes`،`api/gateway`،`api/session-controller`،`api/workspace-controller`،`client/connection` و `session-query/session-log-export`.`api/remotes` Host مدخل دخول Host Typert رسم، بينما Client مدخل استيراد توليد `/remote` إعلان؛`session-log-export` فإن يجعل Node archive إنتاج شفرة لا دخول متصفح controller. كل تفكيك قسم حزمة أصل `tsconfig.json` لذلك فقط بصفة solution، اثنان عدد aggregate و مباشر مستهلك قسم آخر مرجع `tsconfig.host.json` أو `tsconfig.client.json`.workspace `constraints` بوابة مرة تاريخ يمكن بلوغ Project Reference رسم، و حسب كل مرجع project ذاته compiler face فحص: فقط لديه مفرد واحد إعداد هدف يمكن من مهمة واحد face مرجع، تفكيك قسم إعداد هدف فإن يجب مرجع مطابقة leaf، لا نيل مرجع solution أصل أو آخر جانب leaf؛ هذا بوابة حسب «اثنان عدد leaf إعداد معا وجود» تلقائي اكتشاف تفكيك قسم حزمة، الذي بـ جديد تفكيك قسم حزمة سوف تلقائي قبول دخول إدارة ولاية.[`api-remotes` README](../packages/api/remotes/README.zh.md) و [`session-log-export` README](../packages/session-query/session-log-export/README.zh.md) قسم آخر شرح ذلك تفكيك قسم.

أصل بناء حسب توليد اعتماد ترتيب ترتيب:

```sh
tsc -b tsconfig.host.json
tsdown --env.DSH_BUILD_FACE host
tsc -b tsconfig.client.json
tsdown --env.DSH_BUILD_FACE client
pnpm run build:web
```

اثنان مرة tsdown كل استخدام نفس مجموعة كامل workspace مطابقة، لا مسح بناء ناتج قدوم اكتشاف Client حزمة، أيضا لا صيانة Host/Client حزمة مرور ترشيح جدول. حزمة داخل tsdown إعداد أصل حسب `DSH_BUILD_FACE` قرار حالي مرحلة مقطع مدخل: عادي Client إضافة في Client مرحلة مقطع معا توليد Node loader و browser bundle؛`api-remotes` عبر `hostPhase: true` رفع قبل توليد Host مدخل، مجددا في Client مرحلة مقطع فقط توليد browser bundle.tsdown فقط إزالة استهلاك `lib/types` في من قبل وضع tsc إرسال إطلاق JavaScript.

Typert فقط في Host tsdown في بـ `tsconfig.host.json` لـ نوع فرعي تشغيل. هو قسم تحليل Host نوع و توليد Host عكس إطلاق ناتج و Host-for-Client Remote إسقاط؛Client tsdown لا بدء Typert.`pnpm run typecheck` لذلك أولا تنفيذ كامل Host lib مرحلة مقطع، مجددا تشغيل Client tsc؛`pnpm run build` متابعة تنفيذ Client tsdown و Web بناء.

`pnpm run build` سوف داخل ربط أصل حزمة إصدار، سبعة موضع شفرة المصدر commit، و في Git تقرير إبلاغ محلي تغير وقت داخل ربط dirty علامة؛ استدعاء جهة توفير أخرى `DSH_CLIENT_*` قيمة أيضا سوف يتم وراثة.`pnpm run build:official` هو و CI و release ناتج بناء انتظار قيمة عبر منصة محلي أمر، و حذف محلي dirty علامة. كل مرة كامل بناء نجاح بعد كل سوف كتابة واحد نسخة يتم gitignore سجل، يأخذ دقيق عام قيمة و Vite إخراج و حركة حالة client bundle ربط؛release تحزيم و built Web اختبار سوف رفض نقص قليل سجل أو يتم لاحق نطاق جزء بناء تعديل ناتج.`pnpm run dev:web` ما زال حاجة أولا تنفيذ كامل بناء قدوم دقيق تجهيز ناتج شجرة، لكن سوف في بدء وقت قراءة مرة حالي إصدار و Git حالة، و في هذا مرة جلسة كل watcher stage بين مشترك هذا بيئة؛ هو لن تحقق كامل بناء سجل، لأن watcher stage سوف إعادة كتابة سجل تغطية ناتج.

ساكن حالة قسم تحليل و اختبار عبر base `paths` خريطة يأخذ مساحة العمل import تحليل إلى `src`، كما يجب في جاف صاف شجرة فوق عبر؛ إزالة استهلاك بناء ناتج `lib/` بوابة صريح إعلان هذا اعتماد. توليد Host-for-Client Remote إعلان هو متعمد ضبط مثال خارج: عام مشترك `typecheck`،`lint` و `doc-typecheck` أمر سوف أولا توليد هذه إعلان، بينما داخلي `*:contracts-ready` نص برمجي زائف تحديد استدعاء هو عام مشترك أمر أو مجدول بوابة قد اعتماد Typert اتفاق توليد مرحلة مقطع أو كامل بناء.tsc-first إرسال إطلاق مسؤولية رؤية [ts-build-config Note](../.agents/notes/implemented/process/2026-06-17-ts-build-config.zh.md) ، بوابة دقيق تجهيز اتفاق رؤية [Typert Remote Agent Note](../.agents/notes/implemented/architecture/2026-08-02-typert-remote-method-calls.zh.md).

عمل خدمة خدمة في Host استخدام `@Remote` أو `@RemoteScope` إعلان يمكن استدعاء طريقة؛Host بناء توليد Host-for-Client نوع و وقت التشغيل مساهمة،Client `api-remotes` تركيب تحميل هذه مساهمة و تعليق إلى `ctx.remote` و أثر مجال `agentCtx.remote` namespace. اثنان جانب توليد ناتج، تركيب إعداد علاقة،SRC تطوير رجوع و Web بناء ترتيب رؤية [API Gateway](api-gateway.zh.md).

إذا متبادل صلة محلي فحص حاجة استخدام بناء بعد حزمة ناتج، طلب أولا بناء مرة:

```sh
pnpm run build
```

`pnpm run hygiene` يتضمن `publint`(استخدام بناء خروج `lib/*.js` ملف تحقق حزمة مدخل نقطة) و `verify-node-next-types`(استخدام واحد مؤقت NodeNext مستهلك تحقق بناء خروج إعلان ملف). جديد worktree في `pnpm run build` تشغيل قبل لا يوجد تحزيم JS و إعلان ملف؛ عادي إيداع و دفع إرسال بلا حاجة بناء، حذف غير الذي اختيار فحص سوف استخدام هذه ناتج.

### بيئة متغير

حقيقي DeepSeek مهايئ و حاجة مفتاح agent عرض عرض من بيئة متغير أو مستودع أصل دليل واحد يتم gitignore `.env` ملف قراءة سند إثبات:

```sh
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://... # optional
```

`DEEPSEEK_BASE_URL` اختياري، افتراضي لـ عام API. طلب لا إيداع حقيقي سند إثبات. لم ضبط `DEEPSEEK_API_KEY` وقت، حقيقي API e2e طقم عنصر سوف تلقائي قفز مرور.

### Git تجميع صار

عند اثنان نوع لغة ملف كل استخدام Git افتراضي نص سياسة كما قدرة جاف صاف دمج وقت، إعداد مقابل دمج قيادة سوف أصل حسب قد تأكيد أصل أولا، حالي و آخر جانب إعداد مقابل وثيقة blob، دفع توجيه خروج حدوث اندفاع مفاجئ `.i18n.yaml` سجل. إعداد مقابل وثيقة حدوث اندفاع مفاجئ، وجود غير نص دمج إعداد أو سجل بلا فاعلية وقت، هو سوف رفض معالجة و إبقاء اندفاع مفاجئ؛ إذا دمج قد بسبب اندفاع مفاجئ بينما إيقاف، طلب تشغيل `pnpm run resolve-translation-pairing-conflicts`، هذا أمر سوف مؤقت تخزين كل نسخة يمكن أمان توليد إعداد مقابل سجل؛ إذا أخرى إعداد مقابل اندفاع مفاجئ ما زال يحتاج يد عمل معالجة، فإن بـ غير صفر حالة خروج.[مزدوج لغة وثيقة اتفاق](i18n/README.zh.md#the-pairing-contract) صف خروج هذا قيادة قبول تأكيد قطع ملف و حالة.

تثبيت نص برمجي في إصدار worktree إعداد قبل، سوف استكشاف قياس تأكيد قطع Node/tsx قيادة مدخل نقطة. إذا هذا وقت التشغيل بعد تغيير نيل غير ممكن استخدام، لا اعتماد Node بدء جهاز سوف كتابة Git عادي نص دمج نتيجة، يجعل مرافق مع ملف إبقاء لم حل قرار حالة، و ضرب طبع استعادة مسار؛ طلب استعادة اعتماد بعد تشغيل `pnpm run resolve-translation-pairing-conflicts`، أو تشغيل `git merge --abort`. إذا `pre-merge-commit` رفض أصل هذا قدرة جاف صاف إتمام دمج،Git سوف يأخذ كامل نتيجة إبقاء في مؤقت تخزين منطقة لكن لا إنشاء إيداع؛ طلب إصلاح فشل بعد تشغيل `git commit`، أو في توقف دمج. تأكيد قطع بحث جذب و `MERGE_HEAD` حالة من[تلقائي إعداد مقابل دمج Agent Note](../.agents/notes/implemented/process/2026-08-08-automatic-translation-pairing-merges.zh.md#failure-contract) مسؤول سجل.

lefthook في `lefthook.yml` في إعداد، بصفة سريع سرعة محلي فحص نقطة:

- `pre-commit` مقابل وفق مؤقت تخزين إعداد مقابل وثيقة blob تحقق مؤقت تخزين إعداد مقابل سجل، استخدام لا تحميل مشروع `.oxlintrc.staged.json` إعداد تحقق مؤقت تخزين ملف، و عبر مرة محدود إعادة محاولة تطبيق Oxlint إصلاح، في مؤقت تخزين ملف يخص `THIRD_PARTY_NOTICES.md` إدخال وقت إعادة توليد هذا ملف، لكن بعد فحص مؤقت تخزين diff في فارغ أبيض خطأ، و تشغيل vendor manifest(بيانات وصفية بيان) حراسة حماية؛
- `pre-merge-commit` في Git إنشاء تلقائي دمج إيداع قبل تنفيذ نفس مثال بـ بحث جذب لـ دقيق إعداد مقابل فحص؛
- `pre-push` تشغيل `pnpm run typecheck`؛ هذا أمر سوف أولا إتمام يتضمن Typert اتفاق توليد كامل Host lib مرحلة مقطع، مجددا تشغيل Client TypeScript فحص.

vendor manifest حراسة حماية فحص `vendor/*/src` تحت تعديل هل وصل نفس مقابل `vendor/README.md` manifest تحديث واحد بدء مؤقت تخزين. طلب في تحرير vendor شفرة قبل أولا قراءة قراءة `vendor/README.md`.

حذف حد تحديد نطاق مؤقت تخزين سجل تحقق خارج، هذه خطاف متعمد لا تشغيل اختبار، لقطة، وثيقة فحص، بناء أو `hygiene`. مساهمة من فقط تشغيل مرة[و تعديل سلوك متبادل صلة فحص](../AGENTS.md#run-relevant-checks-locally) ؛CI مسؤول كل كمية نسبة التغطية بوابة، بناء ناتج خطر دخان اختبار، و Node 22.19،24 و 26 توافق صفة مستطيل دفعة.

مساهمة من يمكن اختيار تشغيل `pnpm run check:all`، تنفيذ كل وجه محلي بوابة تجميع. هذا أمر مستقل في Git خطاف، أيضا لا هو مقابل agent إشارة أمر.

### CI بوابة

keyless [CI سير العمل](../.github/workflows/ci.yml) سوف مستقل بوابة قسم مجموعة إلى إذا جاف عرض حبة درجة lane، و في تلقي دعم حمل Node إصدار فوق تشغيل واحد مجموعة مقارنة صغير توافق صفة فحص. ناتج مستهلك في كل منها lane داخل انتظار مرة build. مطلوب benchmark في معيار GitHub حمل إدارة Linux فوق مستقل تشغيل؛[benchmark تشغيل جهاز قرار](../.agents/notes/implemented/testing/2026-09-06-standard-hosted-benchmark-runner.zh.md) يملك توجيه و job مهلة. مفرد وحيد حقيقي API سير العمل حسب ذلك إعداد worker حد أعلى تشغيل `pnpm run test:e2e`. حالي بوابة و job بيان بـ [scripts/run-gates.ts](../scripts/run-gates.ts) و سير العمل ملف لـ دقيق.

لا حمل اعتماد dsh اعتماد تخطيط فحص و dsh/vendor تحزيم عرض تدريب فقط في `DSH_CI_FAILOVER_LINUX=selfhosted`، كما حدث لـ تلقي معلومة مهمة master دفع إرسال أو نفس مستودع، غير fork، غير Dependabot سحب أخذ طلب وقت استخدام قائم Linux ذاتي حمل إدارة حوض. ذلك بقية حال حال (يشمل يد حركة إطلاق) متساو استخدام `ubuntu-24.04`؛ يد حركة إصدار ما زال استخدام حمل إدارة تشغيل جهاز. حفظ دائم تخزين عزل و رجوع حد رؤية[إصدار عرض تدريب تشغيل جهاز قرار](../.agents/notes/implemented/process/2026-09-06-release-rehearsal-selfhosted.zh.md).

### يوم معتاد أمر

أصل دليل[مساهمة من شرح](../AGENTS.md#commands) عام وصف معتاد استخدام أمر،[`package.json`](../package.json) و [scripts/run-gates.ts](../scripts/run-gates.ts) فإن مسؤول حالي نص برمجي و بوابة بيان. طلب اختيار تغطية تغيير جدول وجه الأكثر صغير فحص تجميع. وثيقة تغيير استخدام `pnpm run doc-sync`؛ حزمة عام سلوك تغيير أيضا يحتاج تحديث الذي تابع README أو JSDoc، بينما أساس في بناء ناتج فحص حاجة أولا تشغيل `pnpm run build`.

### Profile تشغيل

من شفرة المصدر checkout تشغيل هذه عرض عرض قبل، طلب مفرد وحيد تنفيذ مستودع بناء:

```sh
pnpm run build
```

مفرد مرة تشغيل Headless coding agent حاجة بيئة متغير أو مستودع أصل دليل `.env` في `DEEPSEEK_API_KEY`:

```sh
pnpm dsh --profile headless "summarize this workspace"
```

PTC mode عرض عرض تفعيل شفرة صيغة أداة عرض، و تشغيل نفس عدد headless profile:

```sh
pnpm run demo:ptc -- "summarize this workspace"
```

### TODO علامة

طلب استخدام التالي ثلاثة نوع ملاحظة تفسير وسم لـ واحد علامة شفرة في معروف مشكلة، حسب ضيق عاجل مسار درجة ترتيب ترتيب:

- `FIXME`: ينبغي عند منع سد جديد إصدار إصدار مشكلة. حذف غير مراجعة من واضح نفس معنى هذا أكثر تعديل يمكن دمج، لا فإن إصدار إصدار لا ينبغي يتضمن لم حل قرار `FIXME`؛
- `TODO`: ينبغي عند كل سريع إصلاح مشكلة، انتظار مورد إلى موضع يكفي معالجة؛
- `XXX`: أيضا سماح بعض يوم سوف إصلاح مشكلة، أولوية درجة الأكثر منخفض، لا عمل تحمل وعد.

طلب اختيار و ضيق عاجل مسار درجة مطابقة وسم، يجعل تصفح تصفح شفرة شخص واحد عين قسم صاف «إصدار منع سد» و «لديه فارغ مجددا قول».

<a id="documenting-types-verbatim-ts-type-equiv"></a>

### تدريجي حرف سجل نوع تعريف (`ts type-equiv`)

[فرعي نظام](subsystems/README.zh.md) صفحة سوف يأخذ و شفرة المصدر انتظار قيمة إعلان و ذلك أصلي JSDoc واحد و لصق لصق، يجعل قراءة من يرى تأكيد قطع نوع تعريف و شفرة المصدر اتفاق. لـ منع توقف لصق لصق محتوى في شفرة المصدر تغير وقت عائم نقل، طلب سوف ذلك محيط شريط لـ ` ```ts type-equiv `(بينما لا هو ` ```ts `) ، و في `scripts/type-equiv.manifest.json` في تسجيل تسجيل هو مرآة مثل مصدر ملف و رمز رقم:

```json
{ "doc": "docs/subsystems/session.md", "symbol": "SessionEvent", "source": "packages/core/session/src/types.ts" }
```

`pnpm run verify-type-equiv`(`doc-sync` واحد حلقة) مع بعد عبر TypeScript محلل من شفرة المصدر رفع أخذ هذا رمز رقم إعلان و ذلك مرفق حمل JSDoc، و تأكيد شفرة كتلة معا مطابقة اثنان من. مقابل في لا ينبغي يأخذ تنفيذ جسم كتابة دخول دليل صنف، طلب استخدام ` ```ts public-api ` و ضبط `"projection": "public-api"`؛ بوابة فحص إسقاط سوف إبقاء عام مشترك حقل، بنية صنع دالة، وصول جهاز، طريقة و صنف و عضو أصلي JSDoc، معا حذف تنفيذ جسم و خاص أو تلقي حفظ حماية عضو. مقارنة مقابل سوف تجاهل اختصار فارغ أبيض و غير JSDoc ملاحظة تفسير، لكن اشتراط إبقاء كل بند أصلي JSDoc(يشمل عضو وثيقة) ، يجعل قراءة من معا يرى شفرة المصدر اتفاق و تأكيد قطع نوع تعريف. هذا بوابة حسب وثيقة، رمز رقم و إسقاط، في رئيسي كتلة و manifest بند بين قوي صنع 1:1 مقابل؛ فقط لديه عند إعداد مقابل `.zh.md` كتلة كامل تلقي تتبع أثر محيط شريط تسلسل و ذلك بلا بعد لاحقة أخ أخ ملف حسب بايت متسق كما ترتيب نفسه وقت، عندئذ سوف إعادة استخدام بعد من بند.`doc-typecheck` مقابل يمكن تحرير ترجمة محيط شريط تطبيق نفس إرسال توليد قاعدة، معا قفز مرور اثنان نوع شفرة المصدر انتظار قيمة محيط شريط تحرير ترجمة، و سوف ذلك ترتيب حذف في opt-out مقارنة مثال حساب حساب خارج. عند أنت تعديل واحد قد سجل نوع إعلان أو ذلك JSDoc وقت، بوابة سوف فشل مباشر إلى أنت تحديث لصق لصق محتوى؛ عند أنت زيادة حذف واحد رئيسي كتلة وقت، طلب في نفس عدد تغيير داخل تحديث manifest.

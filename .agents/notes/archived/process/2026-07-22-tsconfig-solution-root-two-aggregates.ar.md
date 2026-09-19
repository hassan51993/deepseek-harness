# Agent Note: بـ solution أصل ملف موحد ولاية اثنان عدد تجمع دمج program

Status: implemented
Archived: 2026-09-04

[English](2026-07-22-tsconfig-solution-root-two-aggregates.md) | العربية

## مشكلة

GUI تفكيك قسم جذب دخول ثاني عدد تجمع دمج program(`tsconfig.client.json`، رؤية[قد عودة ملف قسم طبقة RFC](../../archived/architecture/2026-07-19-gui-layering-and-rpc-protocol.md)) ، أصل `tsconfig.json` فإن متابعة كذلك مهمة مضيف جانب تجمع دمج،`tsconfig.build.json` أيضا هو رقم ثلاثة نسخة يد عمل صيانة كل كمية emit رسم. ثلاثة موضع حساب هذا و سطر، صنع صار أربعة عدد أداة جسم لا مقابل تسمية:

- نوع فحص و بناء references قائمة تدريجي تدريجي انفصال عقدة (`packages/goal/command-goal` في نوع فحص رسم داخل، بناء رسم داخل لكن لا يوجد).
- lefthook pre-push خطاف فقط تشغيل `tsc -b tsconfig.json`، عميل جانب نوع كسر تالف لذلك عبر محلي فحص نقطة، مباشر إلى CI عندئذ كشف.
- tsserver فقط اكتشاف اسم لـ `tsconfig.json` إعداد، عميل اختبار ملف لا في أي يمكن اكتشاف إعداد سلسلة فوق، عودة سقوط إلى دفع قطع مشروع (inferred project) ، حيث لا يوجد paths،lib/jsx أيضا لا مقابل.
- كل vitest إعداد إشارة نحو ثلاثة عدد مختلف تحليل مصدر (`tsconfig.vitest.json`، أصل إعداد، خارج إضافة واحد موضع يد كتابة آخر اسم).

## قرار

واحد solution أصل ملف، اثنان عدد فحص وحدة، واحد مقابل مشترك base، لم يعد مفرد ضبط build أو vitest إعداد:

| ملف | زاوية لون | هل بنية صار program؟ |
|---|---|---|
| `tsconfig.json` | solution أصل ملف:`extends` base،`files: []`، اثنان بند references؛ معا هو كل مستودع `tsc -b tsconfig.json` رسم،tsserver مدخل، و get-tsconfig مستهلك (tsx تشغيل `scripts/` و وثيقة محيط شريط شفرة كتلة) حينئذ قريب أمر في إعداد، ذلك عار workspace استيراد مرور وراثة قدوم `paths` تحليل | لا |
| `tsconfig.base.json` | مشترك compilerOptions و شفرة المصدر `paths` خريطة؛ كذلك مهمة vite-tsconfig-paths تحليل باب وجه (لا يحتوي `include`، لذلك مقابل كل استيراد جهة كل توليد فاعلية) | لا |
| `tsconfig.base.client.json` | متصفح جانب تحرير ترجمة شكل (`jsx: react-jsx`،DOM lib،`types: []`) ، من عميل تجمع دمج و كل `packages/client/*` حزمة مشترك | لا |
| `tsconfig.host.json` | أصل أصل تجمع دمج أصل مثال نقل دخول: مضيف كل حزمة،examples، اختبار،scripts،website؛ ترتيب حذف `packages/client` | هو |
| `tsconfig.client.json` | عميل كل حزمة و ذلك اختبار؛ عبر `extends` وراثة `tsconfig.base.client.json` | هو |

كامل خطة قيام كاف أصل فإن:**cordis `Context` إعلان دمج اندفاع مفاجئ فقط وجود في نفس عدد `ts.Program` داخلي، من لا حدوث في وحدة تحليل في.** solution ملف لا بنية صار program، لذلك من واحد أصل ملف معا مرجع اثنان عدد تجمع دمج لن يجعل اثنان جانب إعلان دمج متبادل اصطدام؛vite-tsconfig-paths فقط قراءة `paths` و `include`، إسقاط الكل نوع معلومة، لذلك واحد باب وجه يمكن أفقي عبر اثنان جانب. وحيد سوف انفجار انفجار فعل قاعدة هو يأخذ اثنان جانب ضغط مستو دخول نفس عدد program، من هذا دفع خروج اثنان بند إرسال توليد سجل قاعدة:`tsconfig.base.json` دائم بعيد لا نيل إضافة `include`/`files`(لا فإن سوف تسرب تسرب دخول كل وراثة هو حزمة، و استلام ضيق باب وجه نطاق) ؛ كل كل مستودع درجة `ts.Program` مستهلك (`scripts/ts-project.ts`،doc-typecheck مستقل نمط) كل صريح بـ `tsconfig.host.json` أو `tsconfig.client.json` لـ نوع فرعي، أبدا استخدام أصل solution. أساس في program توليد جهاز و دلالة بوابة متعمد فقط إبقاء في مضيف جانب؛ عميل جانب فقط لديه في حقيقي يحتاج طلب ظهور وقت عندئذ جذب دخول أساس في program بوابة.

أصل `tsconfig.json` ما زال هو صريح تنفيذ كامل Project Reference رسم solution مدخل،lefthook pre-push عبر `tsc -b tsconfig.json --pretty false` زيادة كمية تغطية اثنان جانب. مستودع `build` و `typecheck` أمر بسبب Client اعتماد Host tsdown توليد Remote اتفاق بينما حسب Host،Client ترتيب تشغيل، أداة جسم تحرير ترتيب من [API Remotes بناء Note](2026-08-08-api-remotes-generated-contract-build.ar.md) مسؤول.`tsconfig.build.json` و `tsconfig.vitest.json` قد حذف؛ كل vitest إعداد كل يأخذ vite-tsconfig-paths إشارة نحو `tsconfig.base.json`.

solution أصل ملف لحظة معنى `extends` base:`scripts/` لا يوجد أكثر قريب tsconfig،tsx(get-tsconfig) عبر أصل ملف تحليل ذلك workspace استيراد.`extends` يأخذ `paths` خريطة حمل عودة أصل ملف،`files: []` فإن يجعل هو بداية نهاية لا بنية صار program.scripts و website نوع فحص ما زال من Host aggregate قبول دخول.

## اعتبار مرور بديل خطة

- **يأخذ `tsconfig.build.json` تعديل اسم لـ `tsconfig.host.json`**——غير مقبول: بناء رسم هو يتضمن الكل عميل حزمة كل كمية emit رسم، لا هو مضيف رسم؛`tsconfig.host.json` هذا عدد اسم حرف مقابل هو أصل أصل تجمع دمج، بينما بناء رسم ذاته قد يتم solution امتصاص استلام.
- **يجعل vitest إشارة نحو أصل solution**——غير مقبول:solution حيث لا يوجد `paths` أيضا لا يوجد `include`، تحليل نتيجة سوف أخذ قرار في إضافة امتداد references مشي كثير بعيد؛ كما عميل تجمع دمج include فقط استلام اختبار، لا استلام src، نقل تمرير src→src استيراد سوف فقد ذهاب خريطة، عودة سقوط إلى `exports`، تحميل خروج وحدة مفرد مثال ثاني نسخة فرعي هذا.
- **إبقاء `tsconfig.vitest.json` بصفة مخصص استخدام باب وجه**——فقط إبقاء لـ بعد تجهيز خطة: إذا vite-tsconfig-paths معالجة لا بلا include إعداد مجددا تفعيل؛base ملف قد يحمل paths خريطة، بينما بلا include إعداد موضع موضع توليد فاعلية، صارم إطار عرض في هذا باب وجه يد عمل صيانة include قائمة.

## عاقبة

- `docs/development.md#typescript-project-layout` هو مرجعي وصف؛ أصل `AGENTS.md` بـ اتفاق شكل صيغة استلام تسجيل فوق وصف اثنان بند سجل قاعدة.
- [ts-build-config Agent Note](2026-06-17-ts-build-config.ar.md) متابعة يملك tsc أولا سطر بناء خط الإنتاج (tsc مسؤول إخراج،tsdown مسؤول تحزيم،`.ts` شرح رمز إعداد دمج `rewriteRelativeImportExtensions`) ؛ ذلك أصل أولا «مفرد واحد أصل نوع فحص مشروع» شكل من هذا نص يحل محل.
- إضافة جديدة واحد عادي package فقط تسجيل تسجيل دخول تماما جيد واحد aggregate references(Host package دخول `tsconfig.host.json`،Client package دخول `tsconfig.client.json`).`api/remotes` بسبب Host توليد اتفاق و Client إزالة استهلاك اتفاق ترتيب علاقة يصبح وحيد صريح تفكيك قسم مثال خارج؛ ذلك اثنان عدد أداة جسم project قسم آخر تسجيل تسجيل، حزمة أصل solution لا دخول مهمة واحد aggregate.
- Host و Client بناء مرحلة مقطع يجب سلسلة سطر:Host tsdown توليد اتفاق بعد Client tsc عندئذ قدرة بدء. كل مرحلة مقطع إعادة استخدام كل project زيادة كمية حالة، لا عبر تزامن تكرار معالجة نفس ورقة رسم.

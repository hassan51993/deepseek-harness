# Agent Note: لأجل استدعاء الأداة عرض حمل وسم render-intent ربط دمج نوع

Status: implemented

[English](2026-07-02-tool-render-intent-union.md) | العربية

> render-intent ربط دمج نوع مقابل UI نقل طبقة ما زال صالح؛ ذلك ACP(Agent Client Protocol) خريطة قد يتم [ACP بصفة فقط موجه إلى تلقائي تحويل بروتوكول](../simplification/2026-07-23-acp-automation-only-protocol.ar.md) يحل محل.

## مشكلة

أداة عبر `ToolDefinition` فوق اثنان عدد عودة ضبط `presentCall`/`presentResult` إعلان ذلك استدعاء في UI(تحرير جهاز استدعاء الأداة بطاقة) في مثل أي تصيير، إرجاع `ToolCallPresentation` / `ToolResultPresentation`، و حمل لديه واحد اختياري `ToolTerminal` فرعي بنية. هذه نوع في زيادة كمية عرض دخول في تغيير صار واحد**اختياري حقل تجميع دمج**: استدعاء جانب لديه `title`،`kind`،`rawInput`،`content`،`locations`،`terminal`؛ نتيجة جانب لديه `title`،`content`،`terminal`؛`ToolTerminal` فوق لديه `cwd`/`output`/`exitCode`/`signal`. مسؤولية تخطيط قسم نموذج غامض لا صاف:

- استدعاء جانب و نتيجة جانب `terminal` حقل إعادة تراكم،bridge حاجة سوف كل مرة استدعاء `content` كتلة،`terminal` كتلة و `rawInput` استخدام مؤقت شرط منطق تجميع وصل في واحد بدء.
- أي بعض تركيب هو*دمج قاعدة*لا يوجد وثيقة شرح: واحد ضبط `content` `terminal` استدعاء معنى طعم حال «بطاقة فوق جهة وصف» ؛ واحد ضبط `terminal` generic استدعاء جزء بلا معنى معنى لكن نوع فوق يمكن جدول بلوغ. نوع سماح بلا معنى معنى حالة وجود.
- لا يمكن جدول بلوغ تحرير جهاز الأكثر حاجة ملف أداة قدرة:**diff بطاقة**(`{path, oldText, newText}`،Zed سوف ذلك تصيير لـ داخل ربط diff / جديد ملف معاينة).`ToolCallPresentation.content` استخدام هو *LLM(كبير لغة نموذج)* `ContentBlock[]` مفردات (text/image) ، أداة أصل هذا لا يمكن طلب diff عرض.

واحد مبكر أولا يتم مرفوض طي أداة ذاتي لديه عرض رفع سجل يأخذ غني تصيير دفع متأخر إلى هو قدرة كاف «في حتى قليل لديه اثنان عدد حقيقي أداة و اثنان عدد حقيقي مستهلك تحقق مفردات بعد، بـ حمل وسم render-intent ربط دمج نوع شكل صيغة ارتداد» لـ وقت. هذا شرط قد من كثير عدد إنتاج من عائلة، إضافة فوق TUI و مضيف/عميل وقت التشغيل (Web) هذه مستهلك ممتلئ كاف.

## قرار

استخدام واحد**بـ `card` لـ وسم يمكن تمييز تعرف ربط دمج نوع**بديل اختياري حقل تجميع دمج. أداة لـ كل مرة استدعاء/نتيجة إعلان واحد تصيير معنى رسم؛bridge أصل حسب وسم توزيع.

```ts ignore-check
type FileLocation = { path: string; line?: number }
type FileDiff = { path: string; oldText: string | null; newText: string } // oldText null ⇒ new file

// presentCall → ToolCallView
type ToolCallView = GenericCallView | TerminalCallView | DiffCallView
interface GenericCallView { card: 'generic'; title: string; kind?: ToolCallKind; rawInput?: unknown; content?: ContentBlock[]; locations?: FileLocation[] }
interface TerminalCallView { card: 'terminal'; title: string; description?: string; cwd?: string }
interface DiffCallView { card: 'diff'; title: string; diffs: FileDiff[]; locations?: FileLocation[] }

// presentResult → ToolResultView
type ToolResultView = GenericResultView | TerminalResultView
interface GenericResultView { card: 'generic'; title?: string; content?: ContentBlock[] }
interface TerminalResultView { card: 'terminal'; title?: string; output?: string; exitCode?: number; signal?: string }
```

`card` في كل تغيير جسم فوق كل هو**لا بد ملء**——حق صحيح حكم آخر حقل، بينما غير اختياري قيمة افتراضية.bridge تنفيذ `switch (view.card) { case 'generic': … case 'terminal': … case 'diff': … default: assertNever(view) }`. هذا ربط دمج نوع هو**غلاف إغلاق**(التزام دوران [switch نفاد رفع اتفاق](../../../../AGENTS.md)): رقم أربعة نوع تصيير معنى رسم (جدول إطار، رسم جدول) بلا نقاش مثل أي حاجة جديد bridge شفرة قدوم تصيير، لذلك واحد من إضافة لكن يتم bridge ساكن صامت إسقاط تغيير جسم، مقارنة تحرير ترجمة خطأ أكثر سيئ كعكة. إضافة جديدة تغيير جسم سوف في bridge switch موضع في قطع تحرير ترجمة——هذا صحيح هو أنا جمع تفكير يلزم إشارة.

### لـ ماذا حمل وسم ربط دمج نوع أفضل في حقل تجميع دمج

- **بلا فاعلية حالة تغيير نيل غير ممكن جدول بلوغ.** generic بطاقة لا يستطيع يحمل طرفية إخراج؛terminal بطاقة لا يستطيع يحمل diff. قديم حقل تجميع دمج سماح كل هذه تركيب.
- **مستهلك توزيع بينما غير تجميع وصل.** كل نوع بطاقة واحد فرع، دقيق إنتاج خروج هذا بطاقة الذي يحتاج عرض، بينما غير ضبط و خمسة عدد تفاعل علاقة لم وثيقة تحويل اختياري حقل.
- **`diff` يصبح واحد انتظار معنى رسم.** `dsh-tool-fs` write/edit إعلان حمل `{path, oldText, newText}` `card:'diff'`، يجعل لديه قدرة UI بلا حاجة إبرة مقابل أداة اسم فعل خاص خاص معالجة يكفي تصيير سطر داخل تغيير.

### إنتاج من خريطة

- `dsh-tool-fs` read → `generic`(`kind:'read'`، مرفق حمل واحد follow-along `location`) ؛write → `diff`(`oldText:null`) ؛edit → `diff`(`oldText:old_string || null`،`newText:new_string ?? ''`). هذا و `claude-agent-acp` `toolInfoFromToolUse` في Read/Write/Edit كل فرع تدريجي حقل مقابل.
- `dsh-tool-bash` قبل منصة تشغيل → `terminal` استدعاء + `terminal` نتيجة؛`run_in_background` → `generic`. عام `job_*` تحكم أداة يملك كل منها generic بطاقة.
- `dsh-tool-todo` → `generic`.

### طرفية رجوع ملكية

`TerminalResultView` فقط يحمل `output`/`exitCode`/`signal`. لا أداة تجهيز طرفية قدرة UI حاجة واحد محيط شريط ` ```console ` نص رجوع؛ هذا دفع توجيه نقل حتى **bridge**(في بلا قدرة مسار فوق سوف `output` حزمة لف في محيط شريط شفرة كتلة في) ، بينما غير من أداة مزدوج إعادة تحرير رمز. هذا جعل bash أداة نتيجة إبقاء مفرد واحد بنية تحويل شكل حالة، و تدريجي بايت إبقاء قائم قدرة باب تحكم سلوك.

terminal معنى رسم فقط لأجل عرض.harness ما زال عبر ذاته bash خدمة تنفيذ أمر، من بينما إبقاء صندوق رملي، بيئة تنظيف، مهمة ملكية و كل جلسة cwd؛UI فقط عرض اكتمل استدعاء، أبدا سوف يصبح ثاني عدد تنفيذ خلفية.

### صاف دالة صفة إبقاء ثابت

`presentCall`/`presentResult` ما زال هو `args`(`presentResult` أيضا لديه result) صاف دالة——هو جمع في فوري تدفق صيغة إخراج و جلسة سجل إعادة تشغيل في كل سوف تشغيل، لذلك يجب أداة تجهيز إعادة تشغيل تحديد صفة. كل view فقط من args دفع توجيه:write diff هو جديد ملف ريح إطار (`oldText:null`) ، لأن أداة في استدعاء وقت لا يوجد قديم محتوى؛edit diff هو `old_string`→`new_string`.

## سبق اعتبار بديل خطة

- **تماما حذف أداة ذاتي لديه عرض**: أي هذا Agent Note الذي يحل محل ذلك عدد يتم مرفوض collapse رفع سجل؛ ذلك ذاته ربط نقاش صحيح هو دفع متأخر إلى اثنان عدد حقيقي أداة و اثنان عدد حقيقي مستهلك وجود بعد مجددا فعل هذا ربط دمج نوع، هذا شرط الآن قد ممتلئ كاف.
- **يجعل UI تنفيذ terminal معنى رسم**: مرفوض. هذا مثال سوف التفاف مرور harness bash سياسة و ملكية اتفاق، و يأخذ أمر تنفيذ قسم شق إلى مختلف خلفية.terminal بطاقة وصف هو harness يملك تنفيذ، أبدا تخويل عميل جانب تنفيذ.
- **يمكن دمج توسيع ربط دمج نوع**(`ContentBlockMap` نمط): مرفوض. جديد تصيير معنى رسم بلا نقاش مثل أي حاجة جديد bridge شفرة قدوم تصيير، لذلك واحد يتم bridge ساكن صامت إسقاط إضافة تغيير جسم، مقارنة غلاف إغلاق ربط دمج نوع في bridge `assertNever` switch موضع جذب إرسال تحرير ترجمة خطأ أكثر سيئ كعكة.
- **إبقاء اختياري حقل تجميع دمج**: أي «مشكلة» واحد عقدة الذي تشريح تحليل الآن حالة: بلا فاعلية حالة يمكن جدول بلوغ، حقل تفاعل بلا وثيقة، كما تماما لا يمكن طلب diff بطاقة.

## عاقبة

جديد تصيير معنى رسم سوف في bridge switch موضع جذب إرسال تحرير ترجمة في قطع——هذا هو متعمد لـ لـ: تصيير شفرة يجب أولا في بطاقة نوع صنف وجود. بلا فاعلية بطاقة/حقل تركيب الآن قد غير ممكن جدول بلوغ،bash رجوع دفع توجيه عودة bridge كل، أداة فقط إرجاع واحد بنية تحويل شكل حالة. رقم أربعة نوع بطاقة (جدول إطار، رسم جدول) باب عتبة هو في نفس عدد تغيير في تحرير كتابة ذلك bridge فرع.

## غير هدف

- **فوري زيادة كمية `terminal_output_delta` تدفق صيغة إخراج**و**أمر تصنيف**: طرفية تصيير Agent Note ذاته دفع متأخر لاحق عمل، هذا Agent Note لا تعلق و.

## متبادل صلة

- يحل محل مبكر أولا يتم مرفوض طي أداة ذاتي لديه عرض رفع سجل (قد مرفوض——«انتظار اثنان عدد حقيقي أداة و اثنان عدد حقيقي مستهلك، لكن بعد فعل حمل وسم render-intent ربط دمج نوع») في دفع متأخر قرار. هذا شرط الآن قد ممتلئ كاف؛ هذا Agent Note أي لـ ذلك عدد ربط دمج نوع.
- يتم[نتيجة وقت قد تطبيق hunk فرق مختلف](../../archived/architecture/2026-07-02-result-time-applied-hunk-diffs.md)(قد عودة ملف) توسيع: بعد من إضافة واحد حفظ دائم `meta` عبر طريق، جعل write/edit في نتيجة وقت إخراج `DiffResultView`(تطبيق بعد تغيير: حمل سياق سطر contextual hunk / كل `replace_all` موضع نقطة واحد، أو إنشاء وقت كامل ملف diff)——قيمة/عرض تفكيك قسم و حفظ دائم `presentationMeta` عبر طريق الآن من[مواصفة أداة إخراج اتفاق](2026-07-20-canonical-tool-output-contract.ar.md) يملك.
- سوف `ToolTerminal` طي دخول حالي UI نقل طبقة استخدام حمل وسم `terminal` عرض.

# Agent Note: في كل ينبغي لديه لـ موضع استخدام branded ID

Status: implemented
Archived: 2026-09-04

[English](2026-06-20-branded-ids.md) | العربية

## مشكلة

harness استخدام `Branded<B> = string & { readonly [BRAND]: B }` و `@deepseek-ai/dsh-brand` في بلا حالة `brandString<T>()` بنية صنع دالة، لـ `ToolCallId`(`packages/llm/llm/src/brand.ts`) و agent(ذكي جسم)/جلسة مشترك `SessionId`(`packages/core/session/src/types.ts`) فعل brand معالجة؛ هذا حزمة يقع في `packages/util/brand/`، رؤية ذلك [README](../../../../packages/util/brand/README.ar.md).`dsh-brand` أيضا إعلان معالجة إدارة سياسة:*«Branding لأجل عبر حزمة حد كما ممكن يتم خلط خلط id؛ لا هو كل string كل حاجة brand.»* هذا بند سياسة هو صحيح تأكيد؛ مشكلة في في هو فقط سقوط فعلي واحد نصف. اثنان موضع نقص فتحة جعل نيل بنية نفسه لكن دلالة خطأ string ما زال قدرة عبر نوع فحص جهاز.

**نقص فتحة 1:bash seam في لم brand عبر حد ID.** خلفية job id هو عادي `string`:`BashTask.id: string`(`packages/shell/shell/src/types.ts`) ، بصفة `string` اختراق اختراق كامل منفذ seam(`packages/shell/shell/src/index.ts` في `ShellExecutor.get`/`ownerOf`/`readOutput`/`kill(id: string)`) ، مجددا من موجه إلى نموذج أداة بـ `string` تحقق و نقل تمرير (`validateJobId`،`assertTaskAccess`،`packages/shell/tool-bash/src/index.ts` في `job_id` schema معامل). هو من كل منفذ حساب عدد جهاز توليد——`packages/shell/bash-local/src/index.ts` في `` `bash-${this.nextTaskId++}` ``——ذلك شكل حالة و `SessionId` قيمة افتراضية**تماما نفسه، كل هو `name-N`**(`packages/core/session/src/index.ts` في `` `session-${++counter}` ``).bash job id و جلسة id في استدعاء نقطة خفيف سهل حينئذ قدرة متبادل تبديل، بينما تحرير ترجمة جهاز جزء بلا عكس ينبغي. هو هو موجه إلى نموذج id(نموذج سوف يأخذ `job_id` نقل عودة `bash_output`/`bash_kill`) ، الذي بـ هذا خلط خلط يمكن من لا تلقي معلومة مهمة إدخال لمس بلوغ.

bash **owner token** هو متبادل صلة فرعي حال شكل:`ShellExecRequest.owner?: string` و `ShellExecSpec.owner: string | undefined`(`packages/shell/shell/src/types.ts`) يتم وثيقة وصف لـ لحظة معنى*لا نفاذ واضح*عزل مفتاح، لكن في كل فعلي استدعاء جهة في، هذا قيمة حينئذ هو الذي تابع agent مشترك `Agent.id`/`SessionId`(`callerToken = (exec) => exec.agent?.id`، يقع في `packages/shell/tool-bash/src/index.ts`) ، فقط هو كشف حال آخر عدد seam محلي اسم. هو يتم لأجل وصول تحكم مقارنة مقارنة (`owner !== callerToken(exec)`) ، لذلك واحد لا مطابقة لكن نوع صحيح تأكيد string في هذا موضع حينئذ هو عبر جلسة عزل bug، بينما حالي نوع نظام لا يمكن التقاط. هذا صحيح هو[موحد واحد agent/session معرف قرار](../simplification/2026-06-20-unify-agent-and-session-id.ar.md) تغطية مشترك id آخر اسم.

**نقص فتحة 2:*قد brand* ID في حد موضع يتم اعتداء تآكل.** حينئذ وصل `ToolCallId` و `SessionId` أيضا تماما جيد في الأكثر سعة سهل خلط خلط أرض جهة تراجع تحويل لـ عار `string`: سجل التسجيل/store مفتاح نوع و عام طريقة معامل. بديل جدول صفة موضع يشمل جلسة تخزين،agent سجل التسجيل (اثنان من كل بـ مشترك `SessionId` لـ مفتاح) ، أداة عرض طبقة call-id map،ACP(Agent Client Protocol) جلسة سجل، و حفظ دائم تنسيق ضبط جهاز. في تجميع دمج مفتاح موضع إسقاط brand، سوف يجعل قائم brand في فحص بحث وقت جزء بلا قيمة قيمة؛ هو جمع قيمة قيمة فقط تنفيذ واحد جزء.

## قرار

Brand ما زال هو عادي نص؛`brandString<T>()` أصل مثال إرجاع إدخال، لذلك تسلسل تحويل، مقارنة مقارنة و بروتوكول صيغة (wire format) متساو لا تغيير. هذا قرار قسم ثلاثة جزء، الكل التزام دوران قائم «لا هو كل string كل حاجة» سياسة.

- **لـ bash job id إضافة brand.** في `packages/shell/shell/src/types.ts`(*يملك*هذا id حزمة) في إضافة `BashTaskId = Branded<'BashTaskId'>`، من `@deepseek-ai/dsh-brand` استيراد `Branded` و استخدام `brandString<BashTaskId>()` بنية صنع قيمة.brand أداة حزمة يجعل `dsh-shell` فقط اعتماد هو حينئذ قدرة لـ ذاتي ذات id إضافة brand، بينما بلا حاجة لـ أصل لغة جذب دخول `dsh-llm` أو `dsh-session`. سوف هذا نوع اختراق اختراق `BashTask.id`،`ShellExecutor` Service Definition طريقة (`get`/`ownerOf`/`readOutput`/`kill`) ،`dsh-bash-local` في توليد نقطة، و `dsh-tool-bash` تحقق/وصول وجه.

- **صب صنع مستقل `OwnerToken` brand.** في `packages/shell/shell/src/types.ts` في إضافة `OwnerToken = Branded<'OwnerToken'>`؛ سوف `ShellExecRequest.owner` / `ShellExecSpec.owner` / `ShellExecutor.ownerOf` نوع علامة ملاحظة لـ `OwnerToken | undefined`.`dsh-tool-bash` مستهلك في اثنان طقم مفردات وحيد تسليم تجميع موضع، مقابل agent مشترك `id`(`SessionId`) تطبيق `brandString<OwnerToken>()`.bash Service Definition من لا استيراد `dsh-session`.(إدارة من رؤية تحت واحد عقدة.)

- **منع توقف brand اعتداء تآكل.** سوف قائم brand نقل بث إلى نقص فتحة 2 صف خروج `Map` مفتاح نوع و عام طريقة معامل في:`Map<SessionId, Session>`،`Map<SessionId, Agent>`،`get(id: SessionId)`،`Map<ToolCallId, …>`،ACP `SessionId` surface، تنسيق ضبط جهاز `Map<SessionId, …>`. هذا هو تغيير في آلة آلة كمية الأكثر كبير جزء، أيضا هو يجعل*قائم* brand في فحص بحث موضع حق صحيح إرسال تلويح أثر (بينما لا فقط فقط علامة ملاحظة في بنية جسم حقل فوق) صلة مفتاح.

عرض معنى شكل حالة:

```ts ignore-check
import { brandString, type Branded } from '@deepseek-ai/dsh-brand'

/** A background bash task handle (generated `bash-N` by the local executor). */
export type BashTaskId = Branded<'BashTaskId'>
const taskId = brandString<BashTaskId>('bash-1')

/** A bash task's opaque isolation key — the consumer's owner identity, NOT the bash seam's. */
export type OwnerToken = Branded<'OwnerToken'>
const owner = brandString<OwnerToken>('session-1')
```

## سبق اعتبار بديل خطة

### لـ ماذا لا يأخذ `owner` نوع علامة ملاحظة لـ `SessionId`؟

إظهار بينما سهل رؤية سريع مسار هو مباشر يأخذ `owner` نوع علامة ملاحظة لـ `SessionId`——هو تأكيد فعلي*مجموع هو*واحد جلسة id. أنا جمع مرفوض هذا عدد خطة.bash منفذ seam هو قدرة seam(Service Definition `dsh-shell`،Service Provider `dsh-bash-local`،Consumer `dsh-tool-bash`) ، ذلك owner token يتم*واضح سجل لـ لحظة معنى لا نفاذ واضح*: منفذ «من لا حل تفسير هو (seam في لا يوجد وصول سياسة——ذلك هو مستهلك مسؤولية)»(`packages/shell/shell/src/types.ts`). يأخذ Service Definition حقل نوع علامة ملاحظة لـ `SessionId`، سوف يأخذ `dsh-session` مفردات جذب دخول واحد لا ينبغي معرفة طريق owner token *يحتوي معنى*حزمة——هذا سوف يجعل عام تنفيذ خلفية اقتران دمج جلسة نموذج، و مخالفة خلف لا نفاذ واضح token تصميم. يحل محل `dsh-bash-local` صندوق رملي تحويل منفذ أو بعيد مسار منفذ لا ينبغي وراثة جلسة اعتماد. مستقل `OwnerToken` brand جعل seam إبقاء حل اقتران:`dsh-shell` فقط معرفة طريق «owner هو بعض نوع حمل brand لا نفاذ واضح token» ، بينما قد قرار وصول سياسة `dsh-tool-bash` مستهلك، هو يأخذ `brandString<OwnerToken>()` تطبيق في ذلك `SessionId` وحيد حد. هذا brand ما زال حمل قدوم أمان استلام فائدة (لا يستطيع يأخذ `BashTaskId` أو عار string نقل إلى owner موضع) ، كما لا جذب دخول اقتران دمج.

## لا في نطاق داخل / ممكن توسيع

التزام دوران «لا هو كل string كل حاجة brand» سياسة، لحظة معنى إبقاء ضيق نطاق. التالي كل بند كل هو دمج إدارة لم قدوم brand مرشح، مرفق حمل دفع متأخر إدارة من بينما غير تحمل وعد:

- **`ModelId`**(`GenerateOptions.model`،`LlmRuntime` مهايئ سجل التسجيل مفتاح): واحد حق صحيح عبر حزمة فحص بحث مفتاح (config → agent → llm → مهايئ) ؛ دمج إدارة تحت واحد brand، فقط لـ تحكم هذا قرار أثر نطاق بينما مؤقت لا قبول دخول.
- **`ToolName`**(`ToolRuntime` مفتاح): من عمل من تعريف، شخص صنف يمكن قراءة، كما جدا قليل و أخرى id خلط خلط؛ الأكثر ضعيف مرشح، ممكن لا قيمة نيل إضافة brand.
- **`ErrorCode`**(`HarnessError.code`): واحد غلاف إغلاق مفردات (`ABORTED`،`NO_ADAPTER`……) ، لا هو تدريجي نسخة id؛ إذا يلزم فعل،string حرف وجه كمية ربط دمج نوع مقارنة brand أكثر دمج ملائم.
- **أخرى عدد قيمة ترتيب رقم**:[Session تسلسل رقم و سجل انحراف نقل قرار](2026-08-31-session-sequence-and-log-offset-brands.ar.md) سوف لـ حدث هوية و سجل بين فجوة إضافة brand، لأن هو جمع عبر تجاوز persistence و مرجع seam.turn و step number إبقاء عادي number: هو جمع هو payload-local ordinal، لن و Session حدث موضع متبادل تبديل.
- **حمل تحقق بنية صنع**:`brandString<T>()` لا تنفيذ وقت التشغيل فحص، كما كل حد (ACP `sessionId`، مزود توقيع إرسال `call.id`،`dsh-llm-deepseek` في فارغ نص رجوع) كل معلومة مهمة عار string. واحد في حد موضع مقابل صيغة خطأ إدخال رمي استثناء `SessionId.parse()` / `isValid()` إعداد طقم أداة تأكيد فعلي هو نقص فتحة، لكن هو يخص وقت التشغيل سلوك تغيير، لديه ذاتي ذات تصميم مشكلة (ماذا حساب «صيغة خطأ» ؟ فشل وقت سوف كيف مثال؟) ، ينبغي في مستقل قرار في معالجة.

## تحقق

قد سقوط أرض ثابت صيغة مثل تحت:`BashTaskId` و `OwnerToken` تعريف في `dsh-shell` في، و طرف إلى طرف اختراق اختراق Service Definition،`dsh-bash-local` توليد نقطة و `dsh-tool-bash` موجه إلى نموذج أداة، كما `dsh-shell` لم إضافة مقابل `dsh-session` اعتماد؛ لا يوجد أي بـ نطاق داخل brand id(`ToolCallId`/`SessionId`/`BashTaskId`) لـ مفتاح تجميع دمج استخدام عار `string`؛ عام طريقة معامل و توجيه خروج توقيع إبقاء brand؛ كل أصلي string دخول حد كل استخدام `brandString<T>()`، بينما لا هو تفرق سقوط `as` cast.

## عاقبة

- **اثنان عدد واجهة وجه آلة آلة صفة تعديل.** نقل بث brand تعلق و bash seam(Service Definition + Service Provider + Consumer) و ACP جلسة id واجهة و حفظ دائم تنسيق ضبط جهاز. تعديل وجه واسع لكن صارم إعادة درجة منخفض: متروك تسرب موضع هو تحرير ترجمة خطأ بينما غير ساكن صامت bug. بنية صنع إرجاع نفس عدد وقت التشغيل نص، لذلك لن إنتاج snapshot أو e2e سلوك فرق مختلف. هو و[موحد واحد agent/جلسة معرف قرار](../simplification/2026-06-20-unify-agent-and-session-id.ar.md) متبادل مجاور، لأن اثنان من كل لمس و جلسة id / owner-token حد؛`OwnerToken` خروج في فوق وصف حل اقتران إدارة من ما زال و موحد واحد بعد id إبقاء مستقل.
- **Brand لا فعل تحقق.** Brand هو خلط خلط منع حماية، لا هو صحيح تأكيد صفة إثبات: واحد*خطأ*جلسة id فقط يلزم ما زال هو صيغة صحيح تأكيد string، حينئذ و بـ قبل واحد مثال قدرة عبر نوع فحص جهاز. هذا قرار لا إغلاق هذا عدد نقص فتحة (رؤية «لا في نطاق داخل»)——هو فقط منع توقف هذا صنف*صنف آخر*خطأ: نقل دخول خطأ*نوع صنف* id.
- **«في أي داخل توقف تحت» ما زال هو حكم قطع عنوان.** لـ `BashTaskId` إضافة brand لكن لا لـ `ToolName` إضافة، لـ `OwnerToken` إضافة لكن لا لـ `ModelId` إضافة، هو مقابل أي بعض string«ممكن يتم خلط خلط» صنف طعم حكم قطع. دمج إدارة مراجعة من ممكن تفكير يلزم أكثر كثير أو أكثر قليل؛`brand.ts` في سياسة هو قطع قرار اعتماد حسب، هذا قرار ميل نحو في موجه إلى نموذج أو لأجل وصول تحكم id.

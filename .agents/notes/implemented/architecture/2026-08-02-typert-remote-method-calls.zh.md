# Agent Note: Typert Gateway تحديد نحو طريقة استدعاء

Status: implemented

[English](2026-08-02-typert-remote-method-calls.md) | العربية

## Problem

Host API Proxy عند وقت في واحد حزمة داخل معا تحمل تحمل مباشر طريقة استدعاء، حمل حالة تفاعل و Session حدث تدفق. ثلاثة من دورة الحياة، توجيه دلالة و عميل تحرير مسار واجهة مختلف، متابعة مشترك استخدام واحد عمل خدمة توجيه خروج حزمة سوف يجعل عمل خدمة Service، نقل بروتوكول، حالة آلة و عميل نوع ذاك هذا اقتران دمج.

هذا قرار فقط شمول غطاء مرة طلب مقابل مرة نتيجة تحديد نحو طريقة استدعاء.Permission،Approval انتظار حمل حالة تفاعل و Session حدث تدفق ما زال اعتماد مستقل تصميم.

مباشر طريقة استدعاء اتفاق يخص تنفيذ هذا سلوك عمل خدمة Service. عمل خدمة تطوير من فقط يحتاج إعلان أي بعض طريقة يمكن بعيد مسار استدعاء، بلا حاجة مجددا تزامن صيانة في وسط API واجهة، توجيه جدول، معامل تحويل جدول، عميل stub و Zod schema.

Host و Browser Client استخدام مستقل TypeScript Program، لأن اثنان حافة سوف بـ مختلف نوع دمج نفس اسم Cordis `Context`.Remote إسقاط لا يستطيع يأخذ كامل Host إعلان استيراد إزالة استهلاك طرف، أيضا لا يستطيع اعتماد Browser مخصص تابع نوع؛ لم قدوم TUI إذا إعادة استخدام هذا طقم تحرير مسار واجهة، أيضا فقط قدرة يرى Remote علامة طريقة. هذا مدة لا تنفيذ TUI وصل دخول، لكن تنفيذ حد لا نيل منع قطع هذا نوع نفس بنية إعادة استخدام.

## قرار

عمل خدمة Service وراثة `TypertRemoteService`، و عبر `@Remote` أو `@RemoteScope()` إعلان يمكن استدعاء طريقة؛ قد لديه أخرى أساس صنف Service يمكن تعديل استخدام `bindTypertRemote()` كشف نفس ربط.Typert من Host Program توليد Host محلي عكس إطلاق ناتج و منصة غير متصل Remote إزالة استهلاك طرف إسقاط؛Client Program متابعة مستقل توليد ذاتي ذات محلي عكس إطلاق ناتج.

Remote إزالة استهلاك طرف إسقاط معا يتضمن `.d.ts`،`.d.ts.map` و `.js`.`.d.ts` فقط كشف يتم Remote decorator علامة طريقة، و مرجع عمل خدمة حزمة وحيد عام مشترك نوع رمز رقم؛`.d.ts.map` يأخذ إزالة استهلاك طرف API طريقة تنقل عودة Host عمل خدمة طريقة تنفيذ؛`.js` يحمل نفس اتفاق endpoint، معامل،Context و Zod معلومة.Browser Client في assembly طبقة يأخذ حاجة Remote JS مساهمة تجميع في تعليق إلى Client Remote Service؛ هذا إسقاط و Remote سحب كائن إبقاء منصة غير متصل، بـ سهل لم قدوم TUI إعادة استخدام.

`@deepseek-ai/dsh-api-gateway` يقع في `packages/api/gateway`، توفير مقابل تسمية اثنان عدد face: افتراضي مدخل توفير Host `ctx.typertGateway`،`/client` مدخل توفير إزالة استهلاك طرف `ctx.remote`. اثنان حافة كل منها في محلي إزالة استهلاك من نفس نموذج توليد `InvocationDescriptor`،descriptor لا عبر wire إرسال.Remote بيانات بروتوكول تشغيل في Connection مشترك `/api` RPC channel فوق؛ عمل خدمة استدعاء واجهة لا مع Connection من HTTP ترحيل إلى WebSocket بينما تغيير.

`@deepseek-ai/dsh-api-remotes` يقع في `packages/api/remotes`، هو Gateway فوق طبقة BFF طبقة. ذلك Host مدخل تسجيل هذا تطبيق تحويل إرسال Cordis حدث مصدر و مع generation readiness يحمل Host واقع؛`/client` مدخل اختيار تطبيق مقابل خارج كشف توليد Remote contribution.Client مدخل عبر Cordis إزالة استهلاك مشترك `TypertClientRemote` اتفاق، بينما لا استيراد أداة جسم Gateway تنفيذ.

## مكون و Cordis خدمة

| مكون | Cordis خدمة | مسؤولية |
|---|---|---|
| `@deepseek-ai/dsh-typert-protocol` | فقط إعلان `ctx.typert` الأكثر صغير بروتوكول | `TypertRemoteService`،decorator،binding رجوع،descriptor،lookup/Context و Remote map؛ لا اعتماد compiler،Zod،Connection أو Browser |
| Typert registry | `ctx.typert` | قسم فتح حفظ حالي بيئة reflection، استيراد Remote contribution،lookup provider و Context provider |
| Typert generator/loader | بلا إضافة جديدة عمل خدمة خدمة | من Host/Client Program توليد ثلاثة صنف `lib` ناتج، و يأخذ حالي بيئة ناتج تسجيل إلى `ctx.typert` |
| API Gateway Host face | `ctx.typertGateway` | صلة ربط Host definition و نشط Service، حل رمز معامل، تحليل receiver و استدعاء طريقة |
| Connection | `ctx.connection` | وحيد احتلال HTTP Server/لم قدوم WebSocket، مشترك `/api` route،RPC envelope،rpcId، تسلسل تحويل،trust، خطأ نقل،Typert اعتراض قطع، و كل owner في نفس channel فوق تسجيل دقيق Fetch route |
| API Gateway Client face | `ctx.remote`،`ctx.remote.<namespace>` | mount Remote contribution، يأخذ كل namespace فعلي جسم تحويل لـ يمكن تتبع أثر `remote.<namespace>` فرعي Service، و يأخذ مواصفة استدعاء تسليم إعطاء `ctx.connection.rpc` |
| API Remotes | بلا إضافة جديدة خدمة | مسؤول Host Agent/Session lookup سياسة، و بصفة Client عمل خدمة وحيد facade، اختيار و تركيب `/remote` contribution، معا كشف الذي اختيار API إعلان |
| Agent/Session owning حزمة | قائم مجال خدمة | معا توفير ساكن حالة interface merge و وقت التشغيل lookup/Context provider |
| Goal انتظار عمل خدمة حزمة | قائم عمل خدمة Service | فقط إعلان binding،Remote طريقة و وحيد DTO، و توجيه خروج توليد `/remote` فرعي مسار |

Host Gateway لا اعتماد `ctx.agents`،`ctx.sessions`،`ctx.goals` أو `ctx.webServer` أداة جسم تنفيذ.Client Remote لا إدارة حل شيء إدارة carrier،Connection أيضا لا إدارة حل Goal،Agent،lookup،`InvocationDescriptor` أو Remote namespace.

## عمل خدمة إعلان

عادي مباشر استدعاء استخدام `@Remote`. قائم طريقة معامل و نتيجة قد هو مسبق مدة Remote اتفاق وقت، مباشر تركيب زينة هذا طريقة، لا لـ هذا إعادة تسمية. فقط لديه wire اتفاق حاجة مختلف طلب أو نتيجة شكل وقت، عندئذ إضافة جديدة `remoteExport*` مهايئ، و من decorator معامل إعلان قصير API اسم. طريقة حاجة أي عدد عمل خدمة كائن، حينئذ في قمة طبقة معامل موضع صريح إعلان هذا كائن:

```text
export class GoalService extends TypertRemoteService {
  constructor(ctx: Context) {
    super(ctx, 'goals')
  }

  create(agent: Agent, request: CreateGoalRequest): GoalView {
    // Existing business method remains unchanged.
  }

  @Remote('create')
  remoteExportCreate(agent: Agent, request: CreateGoalRequest): CreateGoalResult {
    const view = this.create(agent, request)
    return { ref: { id: view.id, revision: view.revision } }
  }
}
```

`goals` هو نقل إعطاء `super()` واضح Cordis service key، و افتراضي بصفة wire namespace. فقط لديه بروتوكول namespace تأكيد فعلي حاجة و service key مختلف وقت، عندئذ عبر رقم ثلاثة عدد معامل نقل دخول `namespace` خيار.

حاجة في بعض صنف عزل Context في فحص بحث Service receiver وقت استخدام `@RemoteScope()`.Scope identity لا دخول عمل خدمة طريقة معامل:

```text
export class ScopedGoalService extends TypertRemoteService {
  constructor(ctx: Context) {
    super(ctx, 'goals')
  }

  @RemoteScope('agent', 'create')
  remoteExportCreate(request: CreateGoalRequest): Promise<CreateGoalResult> {
    // Runs against the goals service resolved from the Agent Context.
  }
}
```

نفس عدد endpoint فقط قدرة اختيار واحد نوع استدعاء نمط. حاجة صريح `Agent` معامل مسار استخدام `@Remote`؛ حاجة تبديل إلى Agent Context مجددا تحليل scoped receiver مسار استخدام `@RemoteScope('agent')`، اثنان من لن من Typert أصل حسب طريقة جسم أو معامل ناقص تلقائي تخمين قياس.

عمل خدمة حزمة فقط اعتماد خفيف كمية `@deepseek-ai/dsh-typert-protocol`. هو توفير `TypertRemoteService`، و decorator،binding رجوع،lookup،Remote Scope و descriptor إعلان بروتوكول، لا اعتماد TypeScript compiler،Zod،HTTP أو Client runtime.

دعم حمل تنسيق عمل صيغة إلغاء طريقة سوف يأخذ `signal: AbortSignal` إعلان لـ الأكثر بعد واحد Host معامل. هذا عدد إبقاء معامل لا هو عمل خدمة قيمة،lookup أو JSON حقل. توليد مستهلك طريقة سوف ذلك كشف لـ الأكثر بعد واحد اختياري معامل، لذلك عادي استدعاء إبقاء ثابت، بينما يملك إلغاء تحكم حق استدعاء جهة يمكن نقل دخول signal.

## Decorator و صريح Gateway facet

Decorator فقط جدول بلوغ “هذا طريقة مشاركة و Remote اتفاق” ، لا مسؤول وقت التشغيل نوع عكس إطلاق، أيضا لا نحو Service constructor حقن إخفاء symbol.`@Remote('create')` و `@RemoteScope('agent', 'create')` معامل هو خارجي طريقة اسم؛ يتم تركيب زينة عضو حيث يمكن هو عمل خدمة طريقة ذاته، أيضا يمكن هو `remoteExportCreate` هذا مثال مهايئ. لم إعطاء آخر اسم وقت عندئذ استخدام عضو اسم بصفة خارجي طريقة اسم. وراثة `TypertRemoteService` هو Service إضافة دخول Gateway معتاد قاعدة صريح إعلان؛ ذلك public readonly `typertGateway` حقل جعل وقت التشغيل نسخة فوق ربط إبقاء مرئي.

SRC نمط تحت،decorator يأخذ طريقة اسم و استدعاء نمط سجل في Service prototype فوق حمل إصدار وصف رمز في. وصف رمز استخدام مستقر نص خاصية اسم، لذلك `remoteMethods()` يمكن قراءة `dsh-typert-protocol` آخر عدد قد تثبيت فرعي هذا توليد علامة؛ هو لن نحو Service نسخة،constructor أو طريقة دالة كتابة أي محتوى.

LIB صارم إطار طريقة اكتشاف، نوع تحليل و descriptor توليد من Typert compiler إتمام. هو قبول `TypertRemoteService` مباشر `super()` استدعاء في حرف وجه كمية service key، أو صريح binding رجوع؛ توليد مرور مسار لا تعديل كتابة عمل خدمة شفرة المصدر، أيضا لا حقن إخفاء تسجيل بيانات وصفية.

## Lookup و Remote Scope تسجيل

Gateway لا داخل وضع Agent،Session أو أخرى عمل خدمة كائن فرع. كائن الذي تابع حزمة معا توفير ساكن حالة إعلان و وقت التشغيل provider:

```text
declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertLookupMap {
    agent: TypertLookup<Agent, SessionId>
  }
}

ctx.typert.lookups.register('agent', {
  parameter: 'agent',
  wire: 'agentId',
  resolve: sessionId => resolveAgent(sessionId),
})
```

ساكن حالة إعلان يجعل Typert معرفة طريق `Agent` في wire فوق مقابل `SessionId`؛ وقت التشغيل provider مسؤول يأخذ طلب في `agentId` تحليل لـ حالي نشط `Agent` كائن. نقص قليل مهمة واحد جانب وقت،LIB بناء أو الأكثر مبكر يمكن تحليل وقت التشغيل تسجيل مباشر فشل.

Agent،Session انتظار lookup كائن فقط قدرة كل منها احتلال حسب واحد قمة طبقة معامل موضع. عادي JSON request يمكن بصفة آخر عدد كامل معامل نقل دخول، لكن هذا تصميم لا دعم حمل `request.agent`، كائن حل بنية، كائن عدد مجموعة، تضمين طقم lookup أو من مهمة معنى تكرار مختلط بنية في بحث ID.

Remote Scope استخدام مستقل merge-extensible map و Context provider.Agent حزمة تسجيل `agent` provider، مسؤول استخدام wire identity بحث إلى Agent Context، و من هذا Context تحليل descriptor إشارة تحديد service key؛Gateway لا معرفة طريق Agent Context داخلي بنية.

Client جانب أيضا تسجيل `agent` Context binder.binder فقط مسؤول من مرة استدعاء الذي في Context أخذ نيل `SessionId`؛ هو لا قطعة رفع Scope، أيضا لا تدريجي عدد نسخ طريقة.scoped namespace من Cordis Service tracker تلقائي rebind إلى حالي Agent Context.

## InvocationDescriptor

Typert،SRC ضعيف محلل،Host Gateway و Client Remote بين فقط تسليم تبديل واحد نوع مواصفة وصف:

```text
InvocationDescriptor {
  id: '@deepseek-ai/dsh-goal#goals/create'
  service: 'goals'
  namespace: 'goals'
  method: 'create'
  implementation: 'remoteExportCreate'
  invocation: direct | { context: 'agent', wire: 'agentId' }
  scope?: { context: 'agent', wire: 'agentId' }
  parameters: [
    { name, wire, source: json | lookup, lookup?, codec }
  ]
  cancellation?: { parameter: 'signal' }
  result: codec
  sourceLocation
}
```

`method` هو endpoint و Client Remote استخدام خارجي قصير اسم،`implementation` هو Host receiver فوق حقيقي عضو اسم؛ اثنان من نفسه وقت يمكن حذف `implementation`.`direct` descriptor إبقاء أصلي Service نسخة بصفة receiver.Context descriptor أولا عبر مقابل Context provider بحث إلى scoped Context، مجددا بـ descriptor service key تحليل receiver.

صارم إطار توليد جهاز فقط في direct طريقة تماما جيد يتضمن واحد lookup معامل، نفس اسم `TypertContextMap` إعلان وجود كما اثنان من استخدام نفس wire نوع symbol وقت كتابة `scope`.`scope.wire` يجب إشارة نحو هذا lookup معامل؛ هو إعلان إزالة استهلاك طرف يمكن من استدعاء الذي في Context تكملة دخول هذا عدد معامل، لا تغيير Host receiver أو endpoint. كثير عدد lookup، نقص قليل Context إعلان أو wire نوع لا متسق وقت لا توليد scoped إسقاط، منها نوع لا متسق يخص بناء خطأ.

معامل ترتيب قدوم ذاتي طريقة توقيع،HTTP حقل قدوم ذاتي معامل اسم أو lookup إعلان. إلغاء descriptor فقط إبقاء الأكثر بعد واحد `signal` موضع، و جعل ذلك لا دخول أداة اسم `args`؛ فعلي signal من Connection أو مباشر استدعاء Gateway استدعاء جهة توفير.Gateway لا أصل حسب طلب محتوى دفع قطع اختياري حقل،Context نوع،lookup نوع أو ناقص معامل، أيضا لن دمج صار عمل خدمة قيمة افتراضية.

LIB codec حمل لديه فقط ذاكرة مؤقتة نجاح نتيجة Zod schema factory و «package + عام مشترك subpath + export name» مواصفة `typeSymbol`.Host Gateway أول مرة حل رمز صارم إطار إدخال وقت استدعاء معامل و هوية factory.Client contribution إبقاء نفس codec بيانات وصفية، بـ في تركيب وقت فحص صارم إطار إدخال، لكن لا نسخة تحويل استدعاء schema؛[فقط في Host تحقق Remote إدخال](../simplification/2026-09-15-host-only-remote-input-validation.zh.md) قاعدة تحديد هذا عدد موضع.SRC codec فقط علامة `src-json`.

descriptor فقط وجود في اثنان طرف محلي registry.wire فوق فقط لديه `/api` channel،endpoint و `{ args }` payload.Client استخدام ذاتي ذات descriptor يأخذ موضع معامل و Context identity خريطة لـ أداة اسم حقل؛Host استخدام ذاتي ذات descriptor تحقق هذه حقل، تحليل receiver و استدعاء طريقة.

## Typert وقت التشغيل registry

```text
ctx.typert.local     Host or Client reflection for this process
ctx.typert.remotes   peer Remote contributions explicitly mounted by a consumer
ctx.typert.lookups   providers and composition policy from wire IDs to Host objects
ctx.typert.contexts  Host Context resolvers and Client Context binders
```

كل مرة تسجيل كل إرجاع من استدعاء جهة Cordis fiber يحتفظ disposer. تركيب Client contribution وقت،descriptor تجميع و أداة جسم طريقة سوف بصفة واحد بند لديه واضح كل من عملية موحد واحد تسجيل.Host Gateway فقط ذاكرة مؤقتة SRC الذي إقرار قيادة endpoint اسم تجميع دمج، و في Cordis Service تجميع دمج حدوث تغير وقت كامل جسم إسقاط هذا تجميع دمج؛ هو لا إبقاء descriptor،Service أو مزود. استدعاء وقت سوف من حالي حالة تحليل كل نشط كائن، لذلك إزالة strict definition،Service أو مزود سوف جعل متبادل ينبغي استدعاء غير ممكن استخدام، كما لن إبقاء تحت قديم قديم نشط كائن.

lookup سجل التسجيل سوف في نشط resolver إزالة بعد إبقاء مستقر wire إعلان.SRC تحليل ما زال سوف يأخذ هذا معامل عودة صنف لـ lookup، بينما استدعاء سوف بـ `gateway/lookup-unavailable` فشل؛ نظام أبدا سوف يأخذ نقل دخول ID إعادة عودة صنف لـ عادي JSON عمل خدمة كائن. في نفس عدد Typert Service دورة الحياة داخل، بـ مختلف معامل،wire أو مواصفة نوع symbol إعادة تسجيل نفس key سوف مباشر فشل.

عمل خدمة كائن حزمة و scoped Context حزمة عبر `lookups.register()` و `contexts.registerHost()` يملك مستقر إعلان و افتراضي resolver؛Host تركيب عبر `lookups.configure()` و `contexts.configureHost()` توفير effect-scoped مختلف خطوة سياسة. إعداد يمكن أولا في provider تسجيل، لكن لا يوجد نشط provider وقت لن مفرد وحيد شكل صار متاح هوية؛ إعداد إزالة بعد استعادة provider افتراضي resolver.Session Controller `ApiSessionAgentController` لـ `agent`،`session` lookup و `agent` Host Context إعداد نفس عدد مشترك resolver:live Agent مباشر إعادة استخدام، عادي بارد جلسة تلقائي استعادة، تزامن استعادة حسب Session ID ذهاب إعادة،subagent ownership fence فإن إرجاع `session/agent-busy`.`session` lookup إرجاع تحليل الذي نيل Agent Session،`agent` Host Context إرجاع ذلك Context، لذلك ثلاثة نوع إسقاط مشترك استخدام واحد استعادة دورة الحياة.

Registry Host أصل مدخل يملك كامل `TypertRegistryContract` interface merge؛Host و Client مشترك استخدام registry تنفيذ يقع في بلا بيئة إعلان مستقل وحدة.Registry `/client` مدخل فقط مرجع هذا مشترك تنفيذ، لا مرور مرور Host أصل مدخل، لذلك لن يأخذ Host Cordis إعلان حمل دخول Client Program.

## وحيد نوع، رمز رقم و Zod

Remote Client DTS لا نسخ عمل خدمة DTO، أيضا لا إعادة إعلان واحد بنية نفسه أثر فرعي نوع. هو فقط من لا يحمل Host Cordis merge عام مشترك صاف نوع subpath مرجع أصلي رمز رقم:

```text
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { CreateGoalRequest, CreateGoalResult } from '@deepseek-ai/dsh-goal/types'
```

لذلك `SessionId`،Agent wire ID،request و result في Host و Browser Client في كل إشارة نحو نفس TypeScript declaration، لم قدوم TUI إعادة استخدام وقت أيضا لا حاجة ثاني نسخة نوع.DTO قفز تحويل تعريف، إعادة تسمية و مرجع فحص بحث عودة إلى عمل خدمة نوع وحيد شفرة المصدر موضع، بينما لا هو توقف في توليد ملف في فرعي هذا.

Remote طريقة ذاته استخدام declaration map تنقل.Typert يأخذ `InvocationModel.location` ثابت في Host يتم تركيب زينة طريقة طريقة اسم token، و في namespace interface مقابل خاصية فوق كتابة source-map segment. مقابل في من مهايئ دعم دعم endpoint،TypeScript editor من `ctx.remote.models.list` أخذ نيل توليد declaration بعد، مجددا امتداد `typert.remote-client.d.ts.map` قفز إلى Host Service `remoteExportList` بعيد مسار خروج فتحة. هذا خروج فتحة متابعة صريح استدعاء لا تعديل اسم تخزين كمية `list()`،map لا يأخذ decorator،class أو كامل توقيع خطأ عند صار طريقة تعريف موضع.

Typert لـ نفس symbol key توليد wire Zod codec.Host Gateway استخدام معامل و identity codec تحقق إدخال؛Client Remote معلومة مهمة توليد TypeScript معامل و نجاح Host نتيجة، لا تنفيذ استدعاء codec. تكرار مختلط نوع لا يمكن توليد صارم إطار codec وقت،LIB بناء فشل، لا تخفيض لـ `unknown` أو بلا تحقق JSON.

Remote طريقة مرجع تسمية عمل خدمة نوع يجب من صاف نوع عام مشترك subpath توجيه خروج. إذا وحيد يمكن بلوغ مدخل سوف حمل دخول Host Service،Cordis `Context` merge أو Host-only تنفيذ، بناء فشل و اشتراط عمل خدمة حزمة توفير أمان نوع خروج فتحة. أصلي قيمة، حرف وجه كمية و Typert واضح دعم حمل بسيط مفرد تركيب لا حاجة مقدار خارج تسمية.

lookup معامل لن يأخذ `Agent` class كشف إعطاء إزالة استهلاك طرف.Remote إسقاط مرجع lookup إعلان في وحيد ID نوع، مثال مثل `SessionId`؛Host داخلي ما زال بـ وحيد `Agent` class symbol إتمام كائن تحليل.

## ثلاثة نوع ناتج و اثنان عدد TypeScript Program

Host و Client ما زال فقط لديه اثنان عدد مستقل TypeScript Program، لكن Typert توليد ثلاثة نوع صفة جودة مختلف ناتج:

```text
Host Program
├─ typert.host.js / typert.host.d.ts
│ Host ذاته Service،Event،Object،schema و inbound Gateway معلومة
└─ typert.remote-client.js / typert.remote-client.d.ts / typert.remote-client.d.ts.map
   Host Remote مقابل مهمة معنى إزالة استهلاك بيئة wire إسقاط

Client Program
└─ typert.client.js / typert.client.d.ts
   Client ذاته Service،Event،Object و schema معلومة
```

`remote-client` هو Host Program ثاني عدد emitter، لا هو رقم ثلاثة عدد Program، أيضا لا هو Client محلي face. هو لا يتضمن Host Cordis merge،Service class،Context class أو تنفيذ شفرة، لا دخول Host محلي reflection registry.

Host lib بناء مسؤول إتمام صارم إطار Host قسم تحليل و إنتاج خروج Host محلي artifact و Remote إزالة استهلاك طرف artifact؛Client lib مع بعد إزالة استهلاك Remote DTS. كامل ترتيب لـ:

```text
Host lib build
→ توليد typert.host.{js,d.ts}
→ توليد كل عمل خدمة حزمة lib/typert.remote-client.{js,d.ts,d.ts.map}
→ إتمام Client lib و typert.client ناتج
→ Vite بناء Web
```

قائم قمة طبقة `build` ما زال جدول الآن لـ أولا `build:lib`، مجددا `build:web`، لكن `build:lib` داخلي يجب أولا إتمام Host و Remote artifact، مجددا بدء Client TypeScript تحرير ترجمة. مرة جاف صاف بناء لا يستطيع اعتماد فوق مرة ناقص إبقاء `.d.ts`.

أي جعل رئيسي يلزم إدخال هو مصدر ملف، حاجة عبر تحرير ترجمة جهاز تحليل مستهلك surface مستودع بوابة أيضا لديه نفسه قبل وضع شرط. عام مشترك `typecheck`،`lint` و `doc-typecheck` أمر سوف أولا تنفيذ Host اتفاق pass. بوابة مجدول فقط يمكن في صريح Typert اتفاق اعتماد أو كامل بناء اعتماد إتمام بعد استخدام مقابل `*:contracts-ready` تغيير جسم، جعل و سطر lane حيث لن قراءة ناقص إعلان، أيضا لن إبرة مقابل نفس إخراج تزامن تشغيل كثير عدد توليد جهاز.

## `/remote` حزمة مدخل

كل توفير Remote طريقة عمل خدمة حزمة توجيه خروج توليد `/remote` فرعي مسار:

```text
"./remote": {
  "types": "./lib/typert.remote-client.d.ts",
  "default": "./lib/typert.remote-client.js"
}
```

إزالة استهلاك شفرة عبر عمل خدمة حزمة ذاته اختيار قدرة:

```text
import goalsRemote from '@deepseek-ai/dsh-goal/remote'
```

هذا import يجعل `.d.ts` map augmentation دخول حالي TypeScript project، معا يأخذ نفس اتفاق JS descriptor بصفة قيمة تسليم إعطاء وقت التشغيل. لم import عمل خدمة حزمة لن توسيع حالي project Remote API نوع.

عمل خدمة package إصدار ملف يجب يتضمن `lib/typert.remote-client.d.ts.map`. توليد DTS بـ `//# sourceMappingURL=typert.remote-client.d.ts.map` مرجع متبادل مجاور map؛map في source من `lib` متبادل مقابل إشارة نحو عمل خدمة شفرة المصدر، مثال مثل `../src/index.ts`.`/remote` export لا مفرد وحيد صف خروج map،package `files` مسؤول إصدار هو. هذا هدف هو تطوير مدة مسار:workspace إزالة استهلاك من مرور package link تحليل هو، لذلك إصدار ناتج ما زال لا يحتوي `src`، قد إصدار map فقط هو تحليل لا إلى شرق غرب.

فقط حاجة ساكن حالة نوع وقت يمكن استخدام `import type {} from '@deepseek-ai/dsh-goal/remote'`؛ هذا نوع import في وقت التشغيل سوف يتم مسح حذف، لن تحميل JS، أيضا لا يستطيع إطلاق أي وقت التشغيل تسجيل. حاجة حقيقي استدعاء بيئة يجب يأخذ عادي value import نيل إلى contribution تسليم إعطاء Client Remote Service.

workspace مقابل `/remote` تحليل يجب واضح إشارة نحو `lib` توليد شيء، لا يستطيع يتم عام package-to-`src` paths قاعدة حمل عودة Host شفرة المصدر. عادي عمل خدمة import ما زال يمكن حسب كل بيئة قائم قاعدة تحليل إلى SRC أو LIB.

## إزالة استهلاك طرف صارم إطار API نوع

Remote DTS معا توسيع مستو وجه endpoint map،direct namespace interface،namespace map و scoped map، بينما لا توسيع عام Cordis `Context`:

```text
interface TypertRemoteNamespace$676f616c73 {
  create: (
    agentId: SessionId,
    request: CreateGoalRequest,
    signal?: AbortSignal,
  ) => Promise<RemoteResult<CreateGoalResult>>
}

interface TypertRemoteMap {
  'goals/create': (
    agentId: SessionId,
    request: CreateGoalRequest,
    signal?: AbortSignal,
  ) => Promise<RemoteResult<CreateGoalResult>>
}

interface TypertRemoteNamespaceMap {
  goals: TypertRemoteNamespace$676f616c73
}

interface TypertRemoteScopeMap {
  'agent:goals/create': (
    request: CreateGoalRequest,
    signal?: AbortSignal,
  ) => Promise<RemoteResult<CreateGoalResult>>
}
```

`TypertRemoteMap` إبقاء مواصفة endpoint توقيع، توفير بروتوكول نوع و عكس إطلاق استخدام. أصل Remote نوع مباشر قراءة `TypertRemoteNamespaceMap`، لا عبر key-remapped mapped type بين وصل دفع توجيه طريقة؛TypeScript Language Service لا يمكن يأخذ هذا نوع بين وصل خاصية مستقر تنقل إلى declaration map.namespace interface اسم من namespace UTF-8 bytes تحرير صار hex،`goals` بسبب بينما مستقر نيل إلى `TypertRemoteNamespace$676f616c73`. مختلف package مقابل نفس namespace توليد نفس اسم interface، اعتماد اعتماد module augmentation دمج كل منها طريقة، كما `TypertRemoteNamespaceMap.goals` بداية نهاية مرجع نفس نوع.

Typert يأخذ `TypertRemoteScopeMap` حسب Context key إسقاط إلى مخصص استخدام Scope نوع. نهائي تحرير مسار واجهة إبقاء:

```text
ctx.remote.goals.create(agentId, request)
agentCtx.remote.goals.create(request)
```

Agent Scope تلقائي توفير ذاتي ذات `SessionId`. لذلك حمل `agent` lookup `@Remote` طريقة يمكن معا توليد root و scoped اثنان نوع إزالة استهلاك طرف توقيع؛`@RemoteScope('agent')` طريقة أيضا حذف مستقل Scope identity، لكن فقط توليد scoped توقيع. أصل `Context` عبر `ctx.remote` كشف direct namespace،`AgentContext.remote` فإن يأخذ هذا direct surface و scoped surface أخذ تسليم تجميع. لم قدوم TUI إعادة استخدام وقت يجب صيانة حمل نفسه منطقة قسم.

كل توليد طريقة كل تحليل لـ `Promise<RemoteResult<T>>`: استدعاء يأخذ نتيجة تقرير إبلاغ في `ok` فرع داخل بينما لا هو reject، فقط لديه تركيب إعداد لذا عائق (arity، لم تركيب طريقة، ناقص Context adapter) ما زال رمي خروج. مستهلك حسب `result.ok` فرع، حاجة منطقة قسم فشل وقت قراءة `result.error.code`؛ فشل مفردات ذاته هو[مفرد واحد Remote فشل صنف إضافة واحد ورقة دمج رمز جدول](2026-08-28-ctx-remote-failure-vocabulary.zh.md).

`TypertClientRemote` إبقاء منصة غير متصل،Browser Client عبر `ctx.remote` كشف هو. لم قدوم TUI إذا إعادة استخدام هذا نوع، أيضا يجب عبر مخصص استخدام Remote كائن و Agent Scope استخدام هو، لا يستطيع يأخذ Host `Context` عند صار أكثر عرض Service تجميع دمج؛ لم علامة public Service طريقة لن دخول Remote maps. حذف توليد namespace خارج،Gateway client face أيضا توفير `$mount`،`$on`،`$stream` و `$host`——الأكثر بعد هذا بند يأخذ اتصال ثابت Host واقع (`home`،`isLoopback`) بصفة عادي قيمة قراءة كشف، مستهلك بلا حاجة لـ هذا حقن تحميل جسم.

## Client Typert و API Gateway Client face

واحد إزالة استهلاك بيئة Typert معا صيانة محلي معلومة و من أخرى بيئة استيراد Remote معلومة، لكن اثنان من تخزين وضع في مختلف registry:

```text
Typert.local حالي بيئة ذاتي ذات عكس إطلاق نموذج
Typert.remotes قد استيراد Remote contribution
```

`@deepseek-ai/dsh-api-remotes/client` تجميع في تحميل حاجة Remote contribution:

```text
import goalsRemote from '@deepseek-ai/dsh-goal/remote'
import sessionsRemote from '@deepseek-ai/dsh-session/remote'

await ctx.remote.$mount(goalsRemote)
await ctx.remote.$mount(sessionsRemote)
```

Client عمل خدمة حزمة فقط مرجع `@deepseek-ai/dsh-api-remotes/client`، لا مباشر اعتماد API Gateway أو كل عمل خدمة `/remote` وقت التشغيل مدخل.API Remotes إزالة استهلاك مشترك `TypertClientRemote` اتفاق و Cordis `ctx.remote` خدمة، مجددا إعادة توجيه خروج إعلان، جعل الذي اختيار Remote map دخول عمل خدمة تحرير ترجمة؛ إضافة جديدة أو إزالة كامل طقم Client قدرة فقط تعديل هذا واحد موضع assembly.

`ctx.remote.$mount()` يأخذ contribution تسجيل إلى `Typert.remotes`، تثبيت هو namespace Service و أداة جسم طريقة، و في هو جمع حينئذ خيط بعد عندئذ resolve. استدعاء هذا طريقة Cordis fiber يحتفظ disposer.endpoint تكرار، نفس namespace/method نمط اندفاع مفاجئ أو descriptor و قائم نوع هوية اندفاع مفاجئ وقت مباشر فشل.

Client Remote Service يأخذ `@Remote` descriptor فعلي جسم تحويل لـ `remote.<namespace>` فرعي Service فوق حقيقي دالة. دالة فحص موضع معامل عدد كمية، حسب descriptor معامل ترتيب بنية صنع أداة اسم `args`، لا فعل وقت التشغيل نوع تحليل، لكن بعد استدعاء `ctx.connection.rpc.call('/api', endpoint, { args }, signal)`. مقابل في دعم حمل إلغاء descriptor، توليد دالة قبول الأكثر بعد واحد اختياري signal، و سوف ذلك و contribution تركيب دورة الحياة دمج؛ لذلك إزالة سوف إلغاء كل صحيح في إجراء carrier استدعاء، بينما استدعاء جهة أيضا يمكن مفرد وحيد إلغاء مرة استدعاء.

حمل `scope` direct descriptor و `@RemoteScope` descriptor كل لا لـ كل Agent Scope نسخ دالة.Client Remote Service لـ كل namespace إنشاء واحد تسجيل لـ `remote.<namespace>` Cordis فرعي Service، و في ذلك فوق فعلي جسم تحويل direct و scoped تغيير جسم. عبر `agentCtx.remote.goals` أخذ نيل طريقة وقت،accessor سوف في إرجاع يمكن استدعاء جملة مقبض قبل التقاط حالي Agent Context. طريقة مجددا عبر مقابل Context binder من هذا Context أخذ نيل identity.direct scoped إسقاط استخدام identity بديل `scope.wire` إشارة تحديد lookup موضع،Remote Scope descriptor فإن يأخذ identity كتابة receiver مستقل wire حقل؛ اثنان من كل إرسال بدء نفس نوع `/api` استدعاء.

```text
root ctx.remote.goals.create(agentId, request)
  → direct descriptor
  → ctx.connection.rpc.call('/api', 'goals/create', { args })

agentCtx.remote.goals.create(request)
  → remote.goals accessor التقاط agent Context
  → agent binder من caller Context أخذ نيل agentId
  → استخدام agentId تكملة دخول نفس direct descriptor lookup معامل
  → ctx.connection.rpc.call('/api', 'goals/create', { args })
```

أصل `Context` فقط merge direct `TypertClientRemote` surface؛`AgentContext` يأخذ هذا خاصية استبدال لـ `TypertClientRemote` و `TypertRemoteScopeApi<'agent'>` تسليم تقاطع، بسبب بينما scoped-only طريقة لن كشف إعطاء root شفرة. إذا استدعاء جهة التفاف مرور نوع من Root حركة حالة استدعاء scoped-only طريقة،binder واضح تقرير خطأ. إذا Client قد لديه اسم لـ `remote.<namespace>` Cordis service، أو اثنان عدد contribution اندفاع مفاجئ احتلال استخدام نفس namespace/method،mount مباشر فشل، لا تغطية قائم خدمة.

توليد Remote JS فقط يتضمن descriptor،symbol key و codec، لا تحزيم Host Service تنفيذ.Client Remote Service حسب هذا إنشاء حقيقي دالة، لذلك وقت التشغيل لا اعتماد JavaScript Proxy؛Proxy يمكن بصفة تنفيذ اختيار، لكن لن يصبح نوع أو عكس إطلاق مصدر.

## عبر بيئة نفس بنية قيد

Remote API هو إزالة استهلاك طرف قدرة، لا انتظار نفس في Browser API. قد تسليم وقت التشغيل تنفيذ Browser Client contribution تركيب،Connection RPC استدعاء و Agent Scope صلة ربط.

Remote DTS،Remote JS،`TypertClientRemote`،`InvocationDescriptor`،Remote RPC بيانات بروتوكول و Context binder لا نيل اعتماد DOM،Browser module loader أو HTTP.Browser Client عبر Connection يأخذ descriptor فعلي جسم تحويل طريقة تحرير رمز لـ `/api` RPC استدعاء.

لم قدوم TUI يمكن في لا تغيير عمل خدمة decorator،Remote maps و API استدعاء شكل حالة قبل رفع تحت وصل دخول نفس استدعاء سحب كائن. دورة وقت TUI مرئي API ما زال فقط قدرة من `@Remote` و `@RemoteScope` توليد، لا يستطيع لأن هو و Host نفس عملية حينئذ التفاف مرور Remote حد مباشر كشف Service طريقة.

TUI runtime تركيب،carrier،Agent Scope صلة ربط و SRC بدء وصل خط متساو ما زال تأخير بعد، لا في هذا قرار لـ داخل.

Web ذاته اعتماد `lib/client.js` انتظار بناء ناتج، لذلك بدء Web قبل اشتراط كامل `build:lib`.Host Remote اتفاق تغير بعد، تطوير من يحتاج إعادة تنفيذ lib build، مجددا بدء أو إعادة بدء Web؛ نظام لا تنفيذ Remote contract زيادة كمية watch.

## SRC و LIB تشغيل نمط

SRC موجه إلى محلي شفرة المصدر بدء.`@Remote` و `@RemoteScope()` إنشاء حمل إصدار prototype وصف رمز إعطاء خروج طريقة اسم و استدعاء نمط، وقت التشغيل من JavaScript دالة توقيع قراءة ترتيب معامل اسم، و ربط دمج قد تسجيل lookup/Context provider توليد ضعيف descriptor.

مثال مثل `@Remote('create') remoteExportCreate(agent, request, signal)` تحليل لـ خارجي طريقة `create`، تنفيذ عضو `remoteExportCreate`، اثنان عدد قمة طبقة عمل خدمة معامل و واحد إلغاء حقن نقطة؛lookup تسجيل يأخذ `agent` تعديل كتابة لـ wire حقل `agentId`،`request` حسب نفس اسم JSON معامل نقل تمرير، الأكثر بعد واحد `signal` فإن إبقاء في payload خارج.SRC لا بدء `ts.Program`، لا استخدام preload،loader hook، شفرة المصدر توليد أو وحدة تعديل كتابة، أيضا لا فحص عادي JSON كائن داخلي بنية.

SRC لا يمكن واضح تحليل توقيع سوف في أول مرة استدعاء تحليل ذلك descriptor وقت فشل؛Service تركيب فقط سجل decorator علامة، لا فحص JavaScript توقيع.SRC لن تخمين قياس كائن حل بنية، افتراضي معامل صنع صار اختلاف معنى،rest معامل، تضمين طقم lookup أو تكرار مختلط نوع.

LIB موجه إلى CI، إصدار و Web قبل وضع بناء.Typert مسح كامل Host project، فحص Remote decorator، صريح binding،service key،endpoint اندفاع مفاجئ،lookup/Context إعلان، عام مشترك رمز رقم يمكن بلوغ صفة،JSON codec، نتيجة codec، و إبقاء الأكثر بعد واحد `signal` معامل هل أداة لديه عام `AbortSignal` نوع، و توليد صارم إطار descriptor.

LIB وقت التشغيل فقط تحميل `lib` في definition، لا بدء TypeScript compiler.Host Gateway لاحق Service صلة ربط،lookup،Context تحليل، استدعاء و استجابة تحرير رمز لا منطقة قسم descriptor قدوم ذاتي SRC ضعيف تحليل أيضا هو LIB صارم إطار توليد.

CI و إصدار تشغيل LIB. كل مستودع coverage الكل تبديل إلى LIB هو مستقل لاحق عمل، لا منع سد هذا مرة مباشر طريقة استدعاء تنفيذ.

## Host Gateway تحليل

Host Gateway نحو Connection تسجيل واحد `/api` interceptor، لا صيانة ثاني نسخة endpoint سجل التسجيل.ownership matcher سوف أولا فحص حالي Typert local سجل التسجيل، مجددا استعلام واحد نسخة يمكن بطلان تجميع دمج؛ هذا تجميع دمج عبر مسح حالي Cordis Service في `typertGateway` binding و SRC Remote علامة توليد.Cordis Service حدوث تغير وقت سوف كامل جسم إسقاط هذا تجميع دمج، لذلك Typert definition و عمل خدمة Service يمكن حسب مهمة معنى ترتيب وصول، معا حيث لن في كل مرة طلب وقت إعادة مسح كل Service، أيضا لن بسبب مهمة معنى طلب مسار بينما توسيع كبير ذاكرة مؤقتة.

كل مرة استدعاء كل سوف إعادة من حالي حالة تحليل descriptor،receiver،lookup مزود و Context مزود. حالي strict descriptor أولوية في SRC.strict endpoint واحد حالما ظهور، أي جعل مع بعد سحب عودة مقابل descriptor،`TypertLocalRegistry.hasSeen()` ما زال سوف في سجل التسجيل باق بقية دورة الحياة داخل إبقاء مقابل هو إقرار قيادة و منع توقف رجوع SRC؛ إعادة تسجيل strict descriptor يكفي استعادة استدعاء. إزالة Service أو مزود سوف يجعل استدعاء واضح فشل؛Gateway حيث لا إبقاء بطلان كائن، أيضا لن بـ أصلي lookup ID استدعاء طريقة.

عادي `@Remote` استدعاء إبقاء أصلي Service نسخة بصفة receiver.lookup نجاح بعد،Gateway حسب descriptor معامل ترتيب استدعاء `implementation ?? method` إشارة تحديد عضو؛ إذا descriptor إعلان إلغاء، فإن في هذه معامل بعد إلحاق carrier signal.

`@RemoteScope('agent')` استدعاء أولا من Agent Context provider تحليل wire identity، مجددا من هذا Context قراءة descriptor service key و استدعاء scoped receiver. عمل خدمة طريقة لن استلام إلى إخفاء Context معامل أو Agent ID.

```text
ctx.typertGateway.invoke({ namespace, method, args, signal })
→ فحص بحث محلي InvocationDescriptor و live receiver
→ حسب معامل descriptor قراءة أداة اسم wire حقل
→ codec حل رمز عادي قيمة أو lookup ID
→ lookup provider يأخذ ID تحليل لـ نشط كائن
→ direct استخدام أصل Service؛context أولا تحليل scoped Context و Service
→ cancellation descriptor وجود وقت يأخذ signal إلحاق إلى عمل خدمة معامل نهاية ذيل
→ Reflect.apply(receiver[implementation ?? method], receiver, orderedArgs)
```

`ctx.typertGateway.invoke()` هو carrier-independent Host مدخل. هو لا إنشاء rpcId،RPC envelope أو HTTP response؛ هو مباشر إرجاع لم مرور وقت التشغيل إخراج حل رمز عمل خدمة نتيجة، أو إنتاج من Connection RPC adapter خريطة Gateway خطأ.

## مشترك `/api` استدعاء سلسلة

Connection في HTTP Server فوق يحتفظ وحيد `/api` route.Gateway يأخذ تزامن endpoint ownership حكم قطع و Remote RPC handler تعليق إلى Connection:

```text
ctx.connection.rpc.intercept(
  '/api',
  endpoint => ownsRemoteEndpoint(endpoint),
  (endpoint, payload, signal) => {
    const { namespace, method } = parseEndpoint(endpoint)
    const { args } = parsePayload(payload)
    return ctx.typertGateway.invoke({ namespace, method, args, signal })
  },
)
```

Host registry في وجود strict descriptor، سجل مرور قد سحب عودة strict descriptor، أو active SRC Service binding فوق وجود مطابقة `@Remote` علامة وقت،Gateway إقرار قيادة هذا endpoint.endpoint واحد حالما يتم إقرار قيادة، أي جعل payload حل رمز،descriptor تحليل أو استدعاء فشل أيضا متابعة من Gateway إرجاع خطأ؛ حيث لا مطابقة دقيق Fetch route، أيضا لا يتم Gateway إقرار قيادة endpoint إرجاع 404.

Connection Host half يأخذ واحد تكرار دمج FetchHandler تسليم إعطاء HTTP bridge.bridge إنشاء معيار `Request` بعد، هذا handler أولا استخدام pathname مطابقة كل owner في هذا channel فوق تسجيل دقيق Fetch route، مجددا مطابقة هذا channel وحيد interceptor——أي Gateway——اثنان من كل لا إقرار قيادة وقت إرجاع 404. هذا channel فوق كل بند مسار إعادة استخدام نفس request/response envelope،rpcId، تسلسل تحويل،trust و خطأ نقل، فشل فإن يحمل مشترك `{ code, message, details }` بيانات. حالي شيء إدارة خريطة هو:

```text
POST /api/<namespace>/<method>
```

Remote payload استخدام أداة اسم JSON كائن، لا استخدام موضع عدد مجموعة، أيضا لا إرسال `InvocationDescriptor`. عادي Goal استدعاء payload slot هو:

```json
{
  "args": {
    "agentId": "session-1",
    "request": {
      "objective": "finish the migration"
    }
  }
}
```

كامل سلسلة مسار لـ:

```text
ctx.remote.goals.create(sessionId, request, signal?)
→ Client InvocationDescriptor تجميع { args: { agentId, request } }
→ Client دمج caller signal و contribution mount lifetime
→ ctx.connection.rpc.call('/api', 'goals/create', { args }, signal)
→ Connection إنشاء rpcId و قائم client-request envelope
→ حالي carrier إرسال POST /api/goals/create
→ Connection Host half تنفيذ مشترك trust، مجددا من bridge إنشاء معيار Request
→ تكرار دمج FetchHandler حكم قطع endpoint ownership و اختيار هدف FetchHandler
→ Typert interceptor استدعاء ctx.typertGateway.invoke(..., request.signal)
→ Host InvocationDescriptor حل رمز،lookup،receiver تحليل و يأخذ signal حقن Reflect.apply
→ Connection كتابة قائم RPC result و عودة إرسال نفسه rpcId
→ Client مباشر إرجاع CreateGoalResult
```

Remote لا في wire فوق تعريف ثاني طبقة `{ ok, value/error }` response. نجاح قيمة و فشل كل مباشر استخدام قائم RPC response `result`، فشل فرع يحمل مشترك `{ code, message, details }` بيانات.owner،resolver و Gateway رمي كل هو نفس عدد صنف `RemoteError`، ذلك رمز قدوم ذاتي دمج بعد `RemoteErrorDetailsMap`:Host يأخذ بنية تعرف آخر خروج `RemoteError` أصل مثال تحرير رمز فوق wire——يشمل Gateway ذاتي ذات `gateway/*` تركيب إعداد رمز، و resolver `session/not-found`،`session/agent-busy`——فقط يأخذ لم عودة صنف throw طي صار `gateway/internal`، و يأخذ تشخيص سلسلة إبقاء في message داخل.Client face لـ `RemoteResult` خطأ فرع إعادة بناء نسخة، لذلك `throw result.error` throw دلالة صار قيام.[فشل مفردات Agent Note](2026-08-28-ctx-remote-failure-vocabulary.zh.md) يحتفظ رمز جدول، سقوط نقطة قاعدة، و لـ ماذا حكم آخر قراءة `code` بينما لا استخدام `instanceof`.

Gateway لا معالجة تدريجي طريقة إذن، استدعاء من هوية، قوة انتظار أو طويل اتصال حالة. هو فقط يأخذ Connection تنسيق عمل صيغة إلغاء نقل بث إعطاء صريح دعم حمل إلغاء عمل خدمة طريقة. مشترك channel فوق كل طلب——بلا نقاش هو Typert endpoint أيضا هو دقيق Fetch route——كل أولا مرور Connection متصفح إقرار إثبات و trusted-host سياسة مجددا توزيع؛Gateway لا تراكم إضافة ثاني طقم سياسة.Connection/WebSocket ترحيل لاحق مستقل إتمام.

## Connection و بروتوكول حد

Client Remote Service مسؤول Remote contribution،namespace Service فعلي جسم تحويل،Scope ربط و موضع معامل و descriptor مقابل.Gateway مسؤول Host descriptor،endpoint ownership،lookup،Context و عمل خدمة استدعاء.Connection يأخذ `/api`،endpoint و `{ args }` بصفة واحد RPC استدعاء إرسال إلى هدف و إرجاع قائم RPC result؛ هو لا إدارة حل Goal،Agent،lookup،descriptor أو Client Remote نوع.

Gateway فقط نحو Connection تسجيل ownership matcher و RPC handler، لا تسجيل HTTP route.Connection يأخذ مشترك `/api` route تعليق إلى HTTP Server، و يأخذ واحد تكرار دمج FetchHandler تسليم إعطاء bridge؛ هذا handler يأخذ دقيق تسجيل مسار توزيع إعطاء هو route owner، يأخذ قد إقرار قيادة endpoint توزيع إعطاء Gateway، ذلك بقية واحد قاعدة 404. لم قدوم Connection transport يمكن إبقاء نفسه ترتيب، بينما لا تغيير Remote payload، عمل خدمة decorator، توليد DTS،Remote API نوع أو Agent Scope تحرير مسار واجهة.

## حزمة حد

- `@deepseek-ai/dsh-typert-protocol`: خفيف كمية decorator،binding،lookup،Remote Scope و descriptor بروتوكول.
- Typert generator: قسم تحليل Host/Client Program، توليد محلي face و Remote إزالة استهلاك طرف إسقاط، و توليد مواصفة symbol/Zod معلومة.
- Typert runtime: قسم آخر حفظ حالي بيئة local reflection و استيراد Remote contribution.
- `@deepseek-ai/dsh-api-gateway`: افتراضي مدخل صلة ربط Host definition و Service، إقرار قيادة Remote endpoint، تحقق إدخال، تنفيذ lookup، تحليل Context receiver، استدعاء طريقة، و نحو Connection تسجيل `/api` interceptor؛`/client` مدخل تركيب Remote contribution، إنشاء صارم إطار Remote namespace Service و طريقة، و يأخذ استدعاء تسليم إعطاء `ctx.connection.rpc`. اثنان عدد مدخل مشترك Remote بروتوكول، لكن لا متبادل متبادل استيراد كل منها Cordis interface merge.
- `@deepseek-ai/dsh-api-remotes`:BFF طبقة؛ تسجيل هذا تطبيق تحويل إرسال Cordis حدث مصدر و مع generation readiness يحمل Host home، اختيار Client `/remote` contribution، و عبر مشترك `TypertClientRemote` اتفاق نحو عمل خدمة حزمة كشف دمج بعد Remote نوع.
- Connection: يملك وحيد HTTP Server/لم قدوم WebSocket carrier، مشترك `/api` route و ذلك تكرار دمج FetchHandler، كل owner تسجيل دقيق Fetch route،RPC envelope،rpcId، تسلسل تحويل،trust و خطأ نقل.
- Agent/Session انتظار عمل خدمة كائن حزمة: يملك lookup،Context provider، وحيد ID نوع و صاف نوع عام مشترك خروج فتحة.
- `@deepseek-ai/dsh-api-session-controller`: إعداد مشترك `agent`/`session` lookup و `agent` Host Context resolver، لذلك كل استقبال هذه كائن Remote endpoint مشترك استخدام نفس طقم استعادة و ownership fence سياسة.
- عمل خدمة Service حزمة: إعلان binding،Remote طريقة و ذلك request/result نوع، و توجيه خروج توليد `/remote` فرعي مسار.

## قد تسليم نطاق و لاحق عمل

قد تسليم رأسي نحو سلسلة مسار هو `@deepseek-ai/dsh-goal/remote → Browser Client Remote → Connection RPC /api → Host Gateway → GoalService.remoteExportCreate()`. نفس عدد حمل Agent lookup direct descriptor معا دعم حمل `ctx.remote.goals.create(agentId, request)` و `agentCtx.remote.goals.create(request)`. عادي بارد جلسة في lookup وقت من هذا مشترك resolver استعادة،subagent-owned identity إبقاء `session/agent-busy` fence؛`@RemoteScope('agent')` ما زال هو مستقل scoped receiver نمط.

Connection توفير مشترك channel interceptor و حالي HTTP carrier خريطة.WebSocket ترحيل،TUI runtime و carrier،TUI Agent Scope وصل خط،Permission/Approval حالة آلة،Session حدث تدفق، استدعاء تخويل، إعادة محاولة، قوة انتظار و عبر إصدار بروتوكول توافق متساو لا يخص هذا قرار.

حزمة توسيع اندفاع لـ `api/remotes → api/gateway → client/connection → host/webserver`.Connection و WebServer في هذا مرة تغيير في إبقاء قائم مسار؛ لاحق سوف هو جمع نقل إلى `api/connection` و `api/webserver` فقط سوف تغيير حزمة موضع، لن تغيير هذه خدمة حد.

## Alternatives considered

**متابعة استخدام في وسط API Proxy حزمة.** هذا خطة اشتراط عمل خدمة طريقة،Host توجيه و Client واجهة في كثير عدد موضع تكرار إعلان، أيضا سوف متابعة يأخذ مباشر استدعاء، حمل حالة تفاعل و حدث تدفق ربط في نفس دورة الحياة في، لذلك لا اعتماد.

**يجعل decorator في وقت التشغيل إتمام صارم إطار عكس إطلاق.** JavaScript decorator لا يمكن استعادة مسح حذف بعد TypeScript نوع، عام مشترك رمز رقم هوية و كامل Zod codec؛ نحو constructor حقن compiler خاص symbol أيضا سوف إخفاء عمل خدمة صنف حقيقي اعتماد، لذلك صارم إطار معلومة من Typert compiler توليد.

**SRC بدء وقت استخدام preload،loader hook أو كامل `ts.Program`.** هذا قدرة إعادة استخدام LIB قسم تحليل، لكن زيادة كل شفرة المصدر بدء مدخل اشتراط.SRC فقط حاجة متاح ضعيف descriptor، لذلك اعتماد decorator علامة، دالة معامل اسم و صريح provider؛ صارم إطار فحص إبقاء إعطاء LIB اتفاق pass.

**يد كتابة Client interface.** يد كتابة واجهة لا يستطيع حفظ إثبات فقط يتضمن Remote علامة طريقة، أيضا سوف و Host توقيع،lookup ID و Zod schema عائم نقل، لذلك Client نوع من Host Program تلقائي إسقاط.

**استخدام TypeScript language-service/compiler plugin يجعل Client مباشر إدارة حل decorator.** هذا سوف يجعل تحرير جهاز،Vite،tsc،tsx و إصدار إزالة استهلاك من كل اعتماد مقدار خارج إضافة، وصل دخول وجه مرور كبير، لذلك توليد عادي `.d.ts` و معيار declaration map.

**يأخذ كامل Host DTS استيراد Client أو TUI.** هذا خطة سوف حمل دخول Host Service و Cordis interface merge، و نحو إزالة استهلاك طرف كشف لم علامة طريقة.Remote DTS فقط مرجع صاف نوع عام مشترك رمز رقم و توسيع مخصص استخدام Remote maps.

**فقط توليد Remote DTS، لا توليد JS.** نوع يمكن صار قيام، لكن وقت التشغيل لا يمكن قطعة رفع endpoint،codec و Context نمط، فقط قدرة اعتماد Proxy أو آخر نسخة يد كتابة سجل التسجيل، لذلك نفس مرة Host إسقاط معا توليد Remote JS contribution.

**يجعل `/remote` قمة طبقة import سرقة سرقة تسجيل عام حالة.** ESM طلب قيمة وقت لم لا بد قد لديه هدف Cordis Context، كثير عدد Context،HMR و dispose أيضا لا يمكن واضح ملكية، لذلك عادي value import فقط إرجاع contribution، من بيئة assembly Client Remote Service صريح تركيب.

**لـ Remote جديد بناء مستقل transport،HTTP route أو `/api2` channel.** هذا سوف نسخ أو تفكيك قسم Connection Server ownership،rpcId، تسلسل تحويل،trust، خطأ و لم قدوم WebSocket دورة الحياة. مشترك `/api` interceptor إبقاء وحيد شيء إدارة route، و يجعل Connection استخدام كل owner تسجيل دقيق Fetch route و هذا channel وحيد interceptor تركيب خروج هو.

## تحقق

- Goal Service مباشر تركيب زينة عمل خدمة توقيع قد رمز دمج Remote اتفاق تغيير صنف طريقة، فقط إبقاء `remoteExportCreate(...)` يأخذ `GoalView` ملائم إعداد لـ `CreateGoalResult`، بلا حاجة ثاني بند توجيه، ثاني نسخة codec أو Client طريقة بيان.
- مرة جاف صاف `build:lib` سوف في Client تحرير ترجمة قبل توليد Host و مستهلك Remote ناتج، يشمل عمل خدمة حزمة `/remote` تحت JS،DTS و declaration map.
- `clean` بعد، مفرد وحيد تشغيل `typecheck`،`lint` أو `doc-typecheck` كل سوف إعادة توليد Remote اتفاق؛pre-push خطاف استخدام نفس عدد قد يتضمن اتفاق دقيق تجهيز خطوة typecheck،CI في شفرة المصدر مستهلك فإن انتظار مرة مشترك اتفاق pass.
- استيراد `@deepseek-ai/dsh-goal/remote` سوف إضافة دخول صارم إطار `ctx.remote.goals.create(...)` نوع، و يمكن عبر declaration تنقل إلى `remoteExportCreate`؛ لا استيراد وقت لن ظهور هذا namespace.
- تركيب نفس مرة import نيل إلى JS contribution سوف توفير endpoint، معامل، نتيجة،lookup،Context و Zod عكس إطلاق، و في بلا حاجة يد كتابة stub حال حال تحت فعلي جسم تحويل استدعاء.
- Root و Agent-scoped استدعاء سوف مرور مرور حقيقي مشترك `/api` carrier، سوف `agentId` تحليل لـ نشط Agent، استدعاء أصلي Goal receiver، و عبر قائم RPC envelope إرجاع.
- Agent و Session lookup سوف مشترك نفس مرة تزامن بارد استعادة؛ عادي بارد جلسة نيل إلى استعادة بعد كائن، بارد حالة أو live subagent identity متساو في عمل خدمة استدعاء قبل إرجاع `session/agent-busy`.
- Remote ناتج و map فقط يتضمن قد علامة طريقة، لا اعتماد Browser، من بينما لـ لم قدوم TUI إبقاء نفسه مستهلك حد.
- دورة الحياة اختبار سوف سحب عودة و إعادة تركيب descriptor،Service،lookup،Context مزود و Client namespace؛ اعتماد غير ممكن استخدام وقت، استدعاء سوف فشل، كما لن استخدام قديم قديم استدعاء أو رجوع أصلي ID.
- إلغاء اختبار تغطية صارم إطار توليد،SRC نهاية موضع معامل اسم تعرف آخر،Client signal دمج،Connection إلى Gateway نقل بث، و Host في wire `args` خارج حقن.
- حيث لا مطابقة دقيق Fetch route، أيضا لا يخص قد إقرار قيادة Remote endpoint طلب في نفس channel فوق إرجاع 404، بينما قد سحب عودة route مع أي إيقاف خدمة.

## عاقبة

Remote API نوع اعتماد توليد `lib` إعلان، بناء و بوابة تحرير ترتيب يجب في مقابل Host و Client مستهلك إجراء تحرير ترجمة أو دلالة قسم تحليل قبل إتمام Host اتفاق pass؛ ترتيب خطأ سوف جعل جاف صاف بيئة في أمر اعتماد قديم قديم ناتج.

شفرة المصدر تنقل اعتماد Remote package معا إصدار declaration map و map إشارة نحو `src`.package `files` تسرب إسقاط مهمة واحد جانب وقت نوع ما زال يمكن تحرير ترجمة، لكن إزالة استهلاك طرف قفز تحويل سوف توقف في توليد DTS، لذلك workspace manifest تحقق يجب يأخذ اثنان من بصفة نفس إصدار اتفاق.

SRC ضعيف descriptor لا تحقق عادي JSON داخلي بنية.Host Remote توقيع تغير بعد،Web و صارم إطار نوع مستهلك يجب إعادة تنفيذ lib build، لأن نظام لا يوجد زيادة كمية contract watcher.

عام مشترك نوع وحيد صفة اشتراط عمل خدمة DTO أداة لديه صاف نوع خروج فتحة، ممكن كشف قائم حزمة في Host نوع و تنفيذ مدخل خلط مختلط مشكلة. بناء سوف رفض هذه حد، بينما لا هو نسخ نوع إخفاء غطاء مشكلة.

نوع import و وقت التشغيل contribution هو اثنان نوع مختلف فاعلية نتيجة.`import type {}` فقط توسيع ساكن حالة Remote surface؛ حقيقي استدعاء بيئة متروك تسرب value contribution وقت،Client Remote Service يجب بـ واضح «Remote لم تركيب» خطأ فشل.

توليد Host و Client ناتج يحمل مطابقة Zod factory، لكن Client Remote لا نسخة تحويل استدعاء schema. مواصفة symbol key، نفس توليد نموذج و Host wire تحقق يجعل اثنان جانب إبقاء متسق، بينما بلا حاجة عبر realm مقارنة مقارنة schema كائن identity.

إزالة استهلاك طرف يمكن استيراد Host حالي لم تركيب Remote contract. نوع يمثل «هذا بروتوكول قدرة قد يتم إزالة استهلاك طرف اختيار» ، لا حفظ إثبات هدف عملية حالي وجود مقابل Service؛ وقت التشغيل endpoint غير ممكن استخدام يجب واضح فشل.

Connection عام channel API يجب معا ملائم دمج حالي HTTP carrier و لاحق WebSocket carrier. إذا Client Remote أو Gateway كشف `fetch`،HTTP request أو route handle،WebSocket ترحيل سوف مجددا مرة اختراق نفاذ Remote طبقة، لذلك هذه شيء إدارة كائن يجب إبقاء في Connection داخلي.

Remote endpoint استخدام Connection `trusted-host` authority. نظام افتراضي قبول loopback؛LAN استدعاء جهة يجب عبر صريح trusted-host إعداد وصل دخول، لكن هذا طبقة لا زيادة تدريجي طريقة استدعاء جهة تخويل، لذلك كل trusted host كل قدرة استدعاء قد تركيب Remote endpoint.

`hasSeen()` أولوية حفظ عائق strict definition أمان صفة، بينما غير SRC متاح صفة.strict descriptor سحب عودة وقت (مثال مثل HMR خلال) ،Gateway سوف متابعة إقرار قيادة endpoint و تقرير إبلاغ غير ممكن استخدام، بينما لن رجوع إلى ضعيف SRC descriptor. إعادة تسجيل يكفي استعادة؛ فقط لديه إعادة بدء Typert سجل التسجيل عندئذ سوف نسيان تسجيل تاريخ strict definition.

دعم حمل إلغاء Remote توقيع سوف استقبال Connection طلب `AbortSignal`، لذلك HTTP قطع وصل أو Client جانب abort قدرة في لا دخول JSON بروتوكول حال حال تحت نقل تمرير إلى صحيح في إجراء عمل خدمة عمل. إلغاء ما زال هو تنسيق عمل صيغة: لا يوجد إبقاء نهاية موضع معامل طريقة سوف متابعة تشغيل؛ استلام إلى signal طريقة يجب سوف هو نقل إعطاء ذاته دعم حمل إلغاء عملية، أو ذاتي سطر مراقبة قياس هو.

lookup إعداد حالي بـ key لـ حبة درجة، لذلك كل `agent` أو `session` معامل كل اعتماد نفس طقم بارد استعادة سياسة. حاجة live-only دلالة خاص تحديد Remote يجب انتظار صريح تدريجي معامل أو تدريجي endpoint سياسة، لا يستطيع اعتماد عمل خدمة تنفيذ تخمين قياس كائن هل للتو يتم استعادة.

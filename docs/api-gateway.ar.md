# API Gateway

[English](api-gateway.md) | العربية

هذا نص هو Typert API Gateway حالي حالة مشاركة اعتبار. هو وصف عمل خدمة خدمة مثل أي إعلان واحد عنصر Remote طريقة، بناء مثل أي توليد Host و Client اتفاق، و استدعاء مثل أي إعادة استخدام Connection RPC و `/api` توجيه. جلسة حدث، زيادة كمية بيانات و أخرى تدفق بروتوكول لا يخص هذا نص نطاق؛ هو جمع يمكن استخدام نفس عدد Connection، لكن لا استخدام Remote طريقة وصف رمز.

## تحرير مسار نموذج

عمل خدمة خدمة عبر `@Remote` أو `@RemoteScope` اختيار مقابل Client فتح وضع طريقة. لم علامة طريقة لن دخول توليد Client نوع أو وقت التشغيل مساهمة، أيضا لا يستطيع عبر `ctx.remote` استدعاء.

`@Remote` يمثل استدعاء أصل Host Context في تسجيل Cordis خدمة. تكرار مختلط Host كائن لا يستطيع مباشر عبر wire نقل؛ عمل خدمة حزمة يجب عبر `TypertLookupMap` إعلان هو و wire identity صلة ربط، و في وقت التشغيل نحو `ctx.typert.lookups` تسجيل افتراضي تحليل مزود. مثال مثل `Agent` معامل في Host توقيع في اسم لـ `agent`، توليد wire حقل لـ `agentId`،Gateway في استدعاء عمل خدمة طريقة قبل سوف id تحليل لـ Host كائن.Host تركيب يمكن استخدام `ctx.typert.lookups.configure()` تغطية بعض عدد lookup key تحليل سياسة، بينما لا تغيير عمل خدمة حزمة يملك معامل اسم،wire حقل أو مواصفة نوع symbol.

`@RemoteScope(key)` يمثل أولا عبر `ctx.typert.contexts` يأخذ identity تحليل لـ واحد أثر مجال Context، مجددا من هذا Context أخذ نيل خدمة و استدعاء طريقة. هو ملائم لأجل طريقة ذاته اعتماد أثر مجال تركيب، بينما لا حاجة صريح استقبال `Agent` انتظار كائن حال شكل.

خدمة عبر معتاد وراثة `TypertRemoteService`، يجعل Cordis خدمة key و افتراضي Remote namespace في منشئ في صريح ربط. قد لديه أخرى أساس صنف خدمة يمكن تعديل لـ إعلان `readonly typertRemote = bindTypertRemote(this, serviceKey)`؛ اثنان نوع طريقة كل سوف إبقاء تحت يمكن فحص عام binding، لا اعتماد تحرير ترجمة جهاز نحو بنية صنع دالة حقن symbol.

```ts
import type { Agent } from '@deepseek-ai/dsh-agent'
import { TypertRemoteService, Remote, RemoteScope } from '@deepseek-ai/dsh-typert-protocol'
import type { Context } from '@deepseek-ai/cordis'

export interface CreateGoalRequest {
  objective: string
}

export interface CreateGoalResult {
  accepted: boolean
}

export class GoalService extends TypertRemoteService {
  constructor(ctx: Context) {
    super(ctx, 'goals')
  }

  @Remote('create')
  createForClient(
    agent: Agent,
    request: CreateGoalRequest,
    signal: AbortSignal,
  ): CreateGoalResult {
    signal.throwIfAborted()
    return this.create(agent, request)
  }

  @RemoteScope('agent', 'current')
  currentForClient(): CreateGoalResult {
    return { accepted: true }
  }

  private create(_agent: Agent, request: CreateGoalRequest): CreateGoalResult {
    return { accepted: request.objective.length > 0 }
  }
}
```

Remote طريقة يمكن تزامن إرجاع أو إرجاع Promise. إذا حاجة تنسيق عمل صيغة إلغاء،Host توقيع الأكثر بعد واحد معامل يجب هو عام نوع `signal: AbortSignal`؛ هو سجل في وصف رمز في بينما لا هو دخول `args`،Client توليد طريقة فإن قبول الأكثر بعد واحد اختياري `AbortSignal`.

Client استخدام عادي كائن فوق أداة جسم دالة، لا استخدام JavaScript Proxy. مباشر استدعاء و أثر مجال استدعاء قسم آخر ظهور في `ctx.remote.<namespace>` و `agentCtx.remote.<namespace>`. كل namespace كل هو تسجيل لـ `remote.<namespace>` يمكن تتبع أثر Cordis فرعي خدمة؛Client assembly عبر `ctx.remote.$mount()` تركيب مساهمة، الأكثر بعد واحد طريقة سحب عودة بعد هذا namespace مع أي إزالة. اعتماد إعلان عودة فعلي استدعاء جهة كل: فقط لديه قراءة `ctx.remote.<namespace>` أو `agentCtx.remote.<namespace>` عمل خدمة حزمة عندئذ في ذاتي ذات `inject` في معا إعلان `remote` و `remote.<namespace>`؛ فقط مسؤول تركيب contribution assembly، و لا استدعاء هذا namespace فوق طبقة وقت التشغيل، لا بديل عمل خدمة حزمة إعلان namespace اعتماد. عند واحد `@Remote` طريقة تماما جيد لديه واحد lookup معامل، كما نفس اسم `TypertContextMap` استخدام نفسه wire identity وقت، توليد أثر مجال توقيع سوف حذف هذا identity معامل.`@RemoteScope` فقط توليد أثر مجال استدعاء واجهة.

```ts ignore-check
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { AgentContext } from '@deepseek-ai/dsh-api-session-controller/client'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'

export const inject = ['remote', 'remote.goals']

declare const ctx: Context
declare const agentCtx: AgentContext
declare const agentId: SessionId

await ctx.remote.goals.create(agentId, { objective: 'ship it' })
await agentCtx.remote.goals.create({ objective: 'ship it' })
```

Client تطبيق فقط تركيب إعداد `@deepseek-ai/dsh-api-remotes`. هذا حزمة بـ وقت التشغيل قيمة استيراد يتم اختيار عمل خدمة حزمة `/remote` فرعي مسار، عبر `ctx.remote.$mount()` تركيب مساهمة، معا إعادة توجيه خروج نفسه ملف في إعلان دمج. زيادة واحد Host Remote حزمة هو Client تركيب كل من صريح اختيار؛ عمل خدمة مكون لا حاجة قسم آخر تحميل Typert Gateway أو عمل خدمة حزمة Remote JS.

`api-remotes` تركيب إعداد و `ctx.remote` اتفاق لا اعتماد React؛ أي Client تركيب إعداد قدرة يرى Host طريقة كل فقط حد في توليد وقت اختيار Remote طريقة.

## مكون مسؤولية

| موضع | حزمة أو مدخل | مسؤولية |
|---|---|---|
| مشترك | `@deepseek-ai/dsh-typert-protocol` | إعلان decorator،Gateway binding، يمكن دمج بروتوكول خريطة، استدعاء وصف رمز و مزود نوع؛ لا بدء TypeScript قسم تحليل، أيضا لا تسجيل Cordis خدمة |
| بناء | `@deepseek-ai/dsh-typert-generator` | من Host `ts.Program` صارم إطار قسم تحليل Remote توقيع، نوع رسم،lookup،Context و شفرة المصدر موضع، و توليد Host و Host-for-Client ناتج |
| Host | `@deepseek-ai/dsh-typert-registry` و Loader | يأخذ توليد Host وصف رمز،schema و عمل خدمة حزمة تسجيل بند وضع دخول `ctx.typert`، و يحتفظ lookup و Context مزود |
| Host | `@deepseek-ai/dsh-api-session-controller` | مسؤول تطبيق Agent/Session هوية سياسة، و إعداد مقابل Typert lookup |
| Host | `@deepseek-ai/dsh-api-gateway` | توفير `ctx.typertGateway`، إقرار قيادة Remote endpoint، تحقق طلب قيمة، تحليل كائن أو Context، و استدعاء فوري Cordis خدمة |
| Client | `@deepseek-ai/dsh-api-gateway/client` | توفير `ctx.remote` و `remote.<namespace>` فرعي خدمة، يأخذ توليد وصف رمز تعليق صار أداة جسم طريقة، و عبر Connection إرسال بدء و إلغاء استدعاء |
| Client | `@deepseek-ai/dsh-api-remotes/client` | صريح اختيار و تركيب هذا تطبيق سماح استخدام `/remote` مساهمة، نحو عمل خدمة شفرة حمل دخول مقابل إعلان دمج |
| مزدوج جانب | `@deepseek-ai/dsh-client-connection` | توفير RPC carrier، طلب صلة ربط، معلومة مهمة حد، إلغاء، استجابة envelope و `/api` HTTP bridge |

API Gateway حزمة معا يملك Host dispatcher و Client Remote endpoint اثنان عدد مقابل انتظار مدخل، لكن اثنان جانب بناء لن دخول نفس عدد `ts.Program`.Host مدخل لا استيراد Client Cordis `Context` دمج،Client مدخل أيضا لا استيراد Host Gateway خدمة.

## صارم إطار توليد خط الإنتاج

أصل بناء اعتماد مرة تنفيذ `build:lib:host`،`build:lib:client` و `build:web`.Host lib مرحلة مقطع أولا تشغيل `tsc -b tsconfig.host.json`، مجددا تشغيل `tsdown --env.DSH_BUILD_FACE host`؛Typert generator من صحيح معتاد Host Project Reference رسم تحرير ترجمة، و في هذا مرة tsdown في بـ Host aggregate لـ وحيد `ts.Program` نوع فرعي تشغيل.Client lib مرحلة مقطع مع بعد تشغيل `tsc -b tsconfig.client.json` و `tsdown --env.DSH_BUILD_FACE client`، استخدام للتو توليد Remote Client إعلان و وقت التشغيل مساهمة، لكن لم يعد مرة بدء Typert.

اثنان مرة tsdown كل استقبال كامل workspace، كما كل فقط تحزيم `lib/types` في من مقابل tsc مرحلة مقطع إرسال إطلاق JavaScript. أصل إعداد لا مسح Client ناتج، لا حسب حزمة اسم تصنيف، أيضا لا نحو tsdown نقل صيانة صيغة filter؛ كل حزمة محلي إعداد أصل حسب `DSH_BUILD_FACE` إرجاع حالي مرحلة مقطع مدخل. عادي Client إضافة في Client مرحلة مقطع واحد بدء توليد Node loader مدخل و browser bundle.

`api/remotes`،`api/gateway`،`api/session-controller` و `api/workspace-controller`(خارج إضافة `client/connection`) كل تفكيك قسم TypeScript face.`api/remotes` Client project اعتماد عمل خدمة حزمة في Host tsdown في توليد `/remote` إعلان؛ أصل aggregate و مباشر مستهلك يجب قسم آخر مرجع كل تفكيك قسم حزمة ذاتي ذات `tsconfig.host.json` أو `tsconfig.client.json`.`api-remotes` `clientBundle(..., { hostPhase: true })` يجعل Host مدخل في Host tsdown في توليد، يجعل Client tsdown فقط توليد browser مدخل.Agent/Session lookup سياسة يقع في `@deepseek-ai/dsh-api-session-controller`، بينما غير `api-remotes`.

كل مساهمة عمل خدمة حزمة يأخذ توليد ملف كتابة ذاتي ذات `lib/`، بينما لا هو شفرة المصدر دليل:

| ملف | مستهلك | محتوى |
|---|---|---|
| `typert.host.js` | Host Loader | Host face وقت التشغيل عكس إطلاق، صارم إطار استدعاء وصف رمز و schema تسجيل قيمة |
| `typert.host.d.ts` | Host نوع نظام | Host face توليد إعلان |
| `typert.remote-client.js` | `api-remotes` | يمكن تركيب `TypertRemoteContribution`، يتضمن صارم إطار وصف رمز و وقت التشغيل codec |
| `typert.remote-client.d.ts` | Client نوع نظام | `TypertRemoteNamespaceMap` و `TypertRemoteScopeMap` إعلان دمج و Client-safe نوع مرجع |
| `typert.remote-client.d.ts.map` | تحرير جهاز | سوف توليد طريقة خاصية خريطة عودة Host حزمة في Remote طريقة إعلان |

عمل خدمة حزمة عبر `./typert` كشف Host Loader مدخل، عبر `./remote` كشف Host-for-Client مدخل. توليد جهاز معا تحقق هذه حزمة export و إصدار ملف بيان؛ فقط لديه أداة تجهيز متبادل ينبغي مدخل صريح مساهمة حزمة عندئذ سوف توليد ناتج.

Remote Client إعلان في معامل اسم قدوم ذاتي wire حقل، معامل و إرجاع نوع فإن مرجع أصل عمل خدمة حزمة توجيه خروج Client-safe نوع. إعلان map يأخذ `ctx.remote.goals.create` نهائي تحليل إلى توليد خاصية خريطة إلى حمل `@Remote` Host مصدر طريقة، لذلك دعم حمل declaration-map تحرير جهاز يمكن من Client استدعاء قفز إلى حقيقي تنفيذ، بينما لا هو توقف في توليد `.d.ts`.

صارم إطار قسم تحليل اشتراط Remote هو عام، غير ساكن حالة، لديه أداة جسم تنفيذ نسخة طريقة. طريقة لا يستطيع هو عام نوع؛ معامل يجب هو أداة اسم كما لا بد ملء بسيط مفرد معرف رمز، لا يستطيع استخدام حل بنية، قيمة افتراضية،rest أو اختياري معامل. يمكن JSON يمثل عادي نوع من Typert توليد صارم إطار schema؛ مساحة العمل class انتظار تكرار مختلط كائن يجب أداة لديه وحيد `TypertLookupMap` إعلان.lookup و Context حزمة معا مسؤول ساكن حالة إعلان دمج و وقت التشغيل مزود تسجيل؛ نقص قليل مهمة واحد جانب كل سوف توجيه يؤدي بناء فشل، أو من أول مرة استدعاء حاجة هذا مزود وقت فشل.

## وقت التشغيل استدعاء

Remote استدعاء استخدام Connection `/api` توجيه.Client Remote استدعاء `connection.rpc.call('/api', '<namespace>/<method>', { args }, signal)`؛HTTP carrier مقابل `POST /api/<namespace>/<method>`،payload فقط يتضمن واحد أداة اسم `args` كائن.

Connection في HTTP bridge قبل تنفيذ `/api` موحد واحد معلومة مهمة فحص، مجددا في مشترك FetchHandler داخل توزيع.Typert Gateway فقط إقرار قيادة وجود صارم إطار وصف رمز أو نشط وثب SRC marker اثنان مقطع صيغة endpoint؛ وظيفة ذاتي لديه دقيق Fetch توجيه معالجة غير JSON استجابة، أخرى طلب إرجاع 404.Connection يملك نقل،RPC id، استجابة envelope و طلب إلغاء،Gateway فقط يملك Remote بيانات بروتوكول و عمل خدمة توزيع. استبدال Connection carrier لا اشتراط تغيير Remote وصف رمز أو Client تحرير مسار واجهة.

Gateway كل مرة استدعاء كل من حالي سجل التسجيل تحليل وصف رمز و فوري خدمة، لا ذاكرة مؤقتة عمل خدمة كائن. هو اشتراط `args` حقل تجميع دمج و وصف رمز تماما متسق، أولا استخدام codec تحقق wire قيمة، مجددا عبر تسجيل lookup أو Context مزود تحليل كائن أو استقبال من، الأكثر بعد استدعاء binding إشارة نحو خدمة طريقة و تحقق قيمة راجعة. نقص قليل مزود،identity لم أمر في،binding لا متسق، معامل ناقص أو كثير بقية،schema فشل و طريقة لا وجود كل سوف في دخول عمل خدمة شفرة قبل أو مغادرة فتح عمل خدمة شفرة بعد فشل.

lookup مزود `register()` معا توفير مستقر إعلان و افتراضي resolver؛`configure()` توفير من Host تركيب يملك، يمكن مختلف خطوة تنفيذ كما تلقي effect دورة الحياة قيد resolver. إعداد يمكن أولا في مزود تركيب؛ لا يوجد مزود وقت استدعاء ما زال بـ `gateway/lookup-unavailable` فشل، إعداد إزالة بعد فإن استعادة مزود افتراضي سياسة.Session Controller مسؤول `agent` و `session` معيار resolver دلالة: إعادة استخدام live Agent، تلقائي استعادة عادي بارد جلسة، مقابل تزامن استعادة ذهاب إعادة، و رفض من subagent routing يملك identity؛`session` lookup إرجاع هذا Agent Session. استعادة فشل و ownership fence رمي خروج يحمل ذاتي لديه رمز `RemoteError`(`session/not-found` أو `session/agent-busy`) ،Gateway أصل مثال تحرير رمز فوق wire؛ فقط لديه لم عودة صنف throw عندئذ طي صار `gateway/internal`.

Client إزالة واحد مساهمة وقت سوف واحد بدء إزالة وصف رمز و أداة جسم طريقة، في توقف ذلك إجراء في استدعاء، و جعل خارجي ما زال يحتفظ قديم قديم طريقة جملة مقبض رفض متابعة استدعاء.Host فوق قد تسجيل مرور صارم إطار endpoint يتم سحب عودة بعد أيضا لن تخفيض إلى SRC دفع قطع، بـ تجنب حار إزالة صامت لكن خفض منخفض تحقق قوي درجة.

## SRC تطوير رجوع

Host عبر `node --import tsx/esm` من شفرة المصدر بدء وقت لن تنفيذ Typert تحرير ترجمة إضافة. معيار decorator ابتدائي تحويل جهاز ما زال سوف يأخذ طريقة اسم و استدعاء نمط سجل إلى Service أصل نوع فوق حمل إصدار وصف رمز في،`TypertRemoteService` أو `bindTypertRemote()` فإن توفير صريح خدمة binding؛Gateway بسبب بينما يمكن في لا بدء `ts.Program` حال حال تحت بنية صنع واحد مقارنة ضعيف مؤقت وصف رمز. وصف رمز استخدام مستقر نص خاصية اسم، لذلك `remoteMethods()` قدرة قراءة بروتوكول حزمة آخر عدد قد تثبيت فرعي هذا كتابة علامة.

SRC رجوع من تشغيل في دالة تحليل بسيط مفرد معامل اسم. معامل اسم و بعض عدد قد تسجيل lookup `parameter` نفسه، مثال مثل `agent` أو `session`، حينئذ استخدام ذلك `agentId` أو `sessionId` wire حقل و في Host تحليل كائن؛ أخرى معامل فقط فحص قيمة هل لـ بلا حلقة، بلا خاص خاص prototype JSON-safe بيانات.`@RemoteScope` مباشر استخدام قد تسجيل Host Context مزود wire حقل.SRC لا قراءة TypeScript نوع، لا توليد Zod schema، لا دفع قطع اختياري معامل، أيضا لا دعم حمل حل بنية، قيمة افتراضية،rest أو تكرار معامل اسم.

SRC فقط حل قرار Host شفرة المصدر عملية توزيع مشكلة.Client لن من تشغيل في Host اكتشاف decorator،Client Remote أيضا رفض تركيب نقص قليل صارم إطار codec SRC وصف رمز؛ ذلك نوع،codec و Remote تسجيل قيمة بداية نهاية قدوم ذاتي الأكثر قريب مرة توليد `lib/typert.remote-client.*`.

## تطوير نمط

Web تطوير أولا استخدام `pnpm run build` دقيق تجهيز حالي Host،Client و Web ناتج، لكن بعد في اثنان عدد طرفية في قسم آخر تشغيل شفرة المصدر Host و Client plugin watcher:

```sh
pnpm dsh web
pnpm run dev:web
```

`dsh` عبر tsx بدء Host شفرة المصدر، الذي بـ Host يمكن استخدام SRC رجوع؛`dev:web` فقط استماع حمل `dsh.client` إعلان Client إضافة و إعادة كتابة ذلك `lib/client.js`، هو لن قسم تحليل Host decorator، أيضا لن توليد Remote Client DTS.

فقط تعديل Remote طريقة تنفيذ جسم بينما لا تغيير اتفاق وقت، بلا حاجة إعادة توليد Typert ملف. إضافة جديدة أو حذف decorator، تعديل توجيه خروج اسم،namespace، معامل، قيمة راجعة،lookup،Context أو إلغاء توقيع وقت، إعادة تنفيذ لديه ترتيب lib بناء، يجعل Host أولا توليد صارم إطار اتفاق، مجددا يجعل Client تحرير ترجمة و تحزيم جديد مساهمة:

```sh
pnpm run build:lib
```

تشغيل في Client watcher سوف في إعادة تحزيم وقت إزالة استهلاك هذه توليد ملف. إذا قد مفرد وحيد تشغيل `pnpm run build:lib:host` تحديث جديد Host اتفاق، أيضا يمكن مجددا تشغيل `pnpm run build:lib:client` إتمام Client جانب؛ جاف صاف عمل شجرة لا يستطيع قفز مرور Host مرحلة مقطع. فقط إعادة تحرير ترجمة قبل طرف شفرة المصدر لا يستطيع من Host decorator دفع توجيه جديد نوع.`pnpm run typecheck` سوف تنفيذ Host lib مرحلة مقطع بعد مجددا تشغيل Client tsc،CI و إصدار بناء أيضا استخدام نفس ترتيب.

## حد

Remote فقط معالجة لديه مفرد عدد طلب و مفرد عدد نتيجة واحد عنصر طريقة استدعاء. جلسة حدث تدفق، قسم صفحة، زيادة كمية reduce،projection و فعلي جسم فرعي تدفق حاجة مستقل بيانات بروتوكول و تسجيل نموذج؛ أي جعل هو جمع إعادة استخدام Connection، أيضا لا ينبغي زائف تركيب صار Remote طريقة أو وضع دخول استدعاء وصف رمز.

API كل طبقة حسب `remotes → gateway → connection → webserver` مجموعة نسج.BFF و Typert RPC طبقة يقع في `packages/api`؛Connection و WebServer يقع في `packages/client/connection` و `packages/host/webserver`. حاجة تدفق صيغة أو متصفح أصلي استجابة وظيفة تسجيل دقيق Connection Fetch توجيه، بينما لا تعريف Remote طريقة.

lookup سياسة حسب key إعداد، لذلك كل `agent` أو `session` معامل مشترك بارد استعادة سلوك. فقط قبول live كائن حاجة صريح تدريجي معامل أو تدريجي endpoint سياسة، بينما هذا نوع سياسة و لا وجود؛ لا يستطيع عبر عمل خدمة طريقة داخلي تخمين قياس كائن هل قدوم ذاتي استعادة.

# بوابة API

[English](api-gateway.md) | العربية

هذا مرجع الحالة الراهنة لبوابة API الخاصة بـ Typert. وهو يصف كيف تعلن خدمات الأعمال طرقَ Remote الأحادية، وكيف يولّد البناء عقودَ Host وClient، وكيف تعيد الاستدعاءات استعمالَ RPC الخاص بـ Connection والمسار `/api`. أما أحداث الجلسة والبيانات التدريجية وسائر بروتوكولات التدفق فخارج نطاق هذه الوثيقة؛ وقد تستعمل الـ Connection نفسها لكنها لا تستعمل واصفات طرق Remote.

## نموذج البرمجة

تستعمل خدمات الأعمال `@Remote` أو `@RemoteScope` لاختيار الطرق المكشوفة للـ Client. والطرق غير الموسومة لا تدخل أنواعَ Client المولَّدة ولا مساهماتِ وقت التشغيل، ولا يمكن استدعاؤها عبر `ctx.remote`.

ويدل `@Remote` على استدعاء خدمة Cordis مسجَّلة على سياق Host الجذر. ولا تستطيع كائنات Host المركَّبة عبور السلك مباشرةً؛ فعلى حزمة الأعمال أن تعلن ارتباطها بهوية على السلك عبر `TypertLookupMap`، وأن تسجّل مزوّدَ تحليل افتراضيًا في `ctx.typert.lookups` في وقت التشغيل. فمعامل `Agent` المسمّى `agent` في توقيع Host مثلًا ينتج حقلَ سلك باسم `agentId`، وتحلّ البوابة ذلك المعرّف إلى كائن Host قبل استدعاء طريقة الأعمال. ويستطيع تركيب Host أن يستعمل `ctx.typert.lookups.configure()` لتجاوز سياسة التحليل لمفتاح lookup دون تغيير اسم المعامل ولا حقل السلك ولا رمز النوع المعياري الذي تملكه حزمة الأعمال.

أما `@RemoteScope(key)` فيحلّ الهويةَ أولًا إلى سياق ذي نطاق عبر `ctx.typert.contexts`، ثم يحصل على الخدمة من ذلك السياق ويستدعي الطريقة. وهو ينطبق حين تعتمد الطريقة نفسها على تركيب ذي نطاق ولا تحتاج إلى تلقّي كائنات مثل `Agent` صراحةً.

وتوسّع الخدماتُ عادةً `TypertRemoteService` ليربط المُنشئ صراحةً مفتاحَ خدمة Cordis وفضاءَ أسماء Remote الافتراضي. أما الخدمة التي لها صنف أساس آخر فتستطيع بدل ذلك أن تعلن `readonly typertRemote = bindTypertRemote(this, serviceKey)`؛ والصيغتان تتركان ربطًا عامًا قابلًا للفحص ولا تعتمدان على حقن المصرّف رمزًا في المُنشئ.

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

وقد تعيد طرق Remote قيمةً تزامنيًا أو تعيد Promise. وللإلغاء التعاوني يجب أن يكون المعامل الأخير في توقيع Host هو `signal: AbortSignal` بالنوع العام؛ فيُسجَّل في الواصف بدل أن يدخل `args`، بينما تقبل طريقةُ Client المولَّدة `AbortSignal` أخيرًا واختياريًا.

ويستعمل الـ Client دوالَّ ملموسة على كائنات عادية، لا Proxy في JavaScript. وتظهر الاستدعاءات المباشرة وذات النطاق تحت `ctx.remote.<namespace>` و`agentCtx.remote.<namespace>`. وكل فضاء أسماء خدمةُ Cordis ابنة متتبَّعة مسجَّلة باسم `remote.<namespace>`؛ ويركّب تجميع Client المساهماتِ عبر `ctx.remote.$mount()`، ويُفرَّغ فضاء الأسماء بعد سحب آخر طريقة فيه. وإعلانات الاعتمادية تخص المستدعي الفعلي: فحزمة الأعمال التي تقرأ `ctx.remote.<namespace>` أو `agentCtx.remote.<namespace>` هي وحدها التي تعلن `remote` و`remote.<namespace>` في `inject` الخاصة بها؛ أما التجميعات التي تركّب المساهمات فقط، وأوقاتُ التشغيل الأعلى التي لا تستدعي ذلك الفضاء، فلا تعلن اعتمادية الفضاء نيابةً عن حزمة الأعمال. وحين يكون لطريقة `@Remote` معاملُ lookup واحد بالضبط ويستعمل `TypertContextMap` بالاسم نفسه هويةَ السلك نفسها، يحذف التوقيعُ ذو النطاق المولَّد معاملَ الهوية ذاك. و`@RemoteScope` لا يولّد إلا واجهةَ الاستدعاء ذات النطاق.

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

ولا تجمّع تطبيقات Client سوى `@deepseek-ai/dsh-api-remotes`. فتلك الحزمة تستورد المسارات الفرعية `/remote` لحزم أعمال مختارة قيمًا في وقت التشغيل، وتركّب مساهماتها عبر `ctx.remote.$mount()`، وتعيد تصدير دمج التصريحات من الملفات نفسها. وإضافة حزمة Remote من Host اختيارٌ صريح يتخذه مالك تركيب Client؛ ولا تحتاج مكوّنات الأعمال إلى تحميل بوابة Typert ولا JavaScript الخاص بـ Remote في حزمة الأعمال على حدة.

وتجميعُ `api-remotes` وعقدُ `ctx.remote` مستقلان عن React؛ وطرقُ Host الظاهرة لأي تجميع Client محصورة في طرق Remote المختارة وقت التوليد.

## مسؤوليات المكوّنات

| الموضع | الحزمة أو المدخل | المسؤولية |
|---|---|---|
| مشترك | `@deepseek-ai/dsh-typert-protocol` | يعلن المزخرِفات، وارتباطات البوابة، وخرائط البروتوكول القابلة للتوسعة بالدمج، وواصفات الاستدعاء، وأنواع المزوّدين؛ ولا يبدأ تحليل TypeScript ولا يسجّل خدمات Cordis |
| البناء | `@deepseek-ai/dsh-typert-generator` | يحلّل بصرامة توقيعاتِ Remote، ورسمَ الأنواع، وlookups، والسياقات، ومواضعَ المصدر من `ts.Program` الخاص بـ Host، ثم يولّد نواتج Host ونواتج Host إلى Client |
| Host | `@deepseek-ai/dsh-typert-registry` وLoader | يضع واصفات Host المولَّدة وschemas وتسجيلات حزم الأعمال في `ctx.typert`، ويحمل مزوّدي lookup والسياقات |
| Host | `@deepseek-ai/dsh-api-session-controller` | يملك سياسةَ هوية الـ Agent والجلسة في التطبيق ويضبط lookups المقابلة في Typert |
| Host | `@deepseek-ai/dsh-api-gateway` | يوفّر `ctx.typertGateway`، ويطالب بنقاط نهاية Remote، ويتحقق من قيم الطلب، ويحلّ الكائنات أو السياقات، ويستدعي خدمات Cordis الحية |
| Client | `@deepseek-ai/dsh-api-gateway/client` | يوفّر `ctx.remote` والخدماتِ الابنة `remote.<namespace>`، ويركّب الواصفات المولَّدة طرقًا ملموسة، ويبدأ الاستدعاءات ويلغيها عبر الـ Connection |
| Client | `@deepseek-ai/dsh-api-remotes/client` | يختار صراحةً مساهماتِ `/remote` التي يسمح بها التطبيق ويركّبها، ويُدخل دمجَ التصريحات المقابل إلى شفرة الأعمال |
| كلاهما | `@deepseek-ai/dsh-client-connection` | يوفّر حاملَ RPC، وربطَ الطلبات، وحدَّ الثقة، والإلغاء، ومغلّفَ الاستجابة، وجسرَ HTTP على `/api` |

وتملك حزمة بوابة API موزّعَ Host ونقطةَ نهاية Remote في Client مدخلَين نظيرين، لكن البناءين لا يدخلان `ts.Program` واحدًا أبدًا. فمدخل Host لا يستورد دمجَ `Context` الخاص بـ Cordis في Client، ومدخل Client لا يستورد خدمةَ بوابة Host.

## خط التوليد الصارم

يشغّل بناء الجذر `build:lib:host` و`build:lib:client` و`build:web` بهذا الترتيب. ويشغّل طورُ مكتبة Host أولًا `tsc -b tsconfig.host.json` ثم `tsdown --env.DSH_BUILD_FACE host`؛ ويصرّف رسمُ Project Reference المعتاد الخاص بـ Host مولّدَ Typert، الذي يعمل في مرور tsdown هذا وتجميعةُ Host هي بذرته الوحيدة لـ `ts.Program`. ثم يشغّل طورُ مكتبة Client الأمرَ `tsc -b tsconfig.client.json` و`tsdown --env.DSH_BUILD_FACE client`، مستهلكًا تصريحاتِ Remote الخاصة بـ Client ومساهماتِ وقت التشغيل المولَّدة حديثًا، دون أن يبدأ Typert من جديد.

ويتلقى مرورا tsdown مساحةَ العمل كاملةً، ولا يحزمان إلا JavaScript الذي أخرجه طورُ tsc المقابل إلى `lib/types`. ولا يمسح إعداد الجذر نواتجَ Client، ولا يصنّف أسماء الحزم، ولا يمرّر إلى tsdown مرشِّحًا مُصانًا؛ وإنما تعيد الإعدادات المحلية للحزم مداخلَ الطور الحالي اعتمادًا على `DSH_BUILD_FACE`. وإضافة Client العادية تنتج مدخل محمِّل Node وحزمة المتصفح معًا في طور Client.

وتقسم `api/remotes` و`api/gateway` و`api/session-controller` و`api/workspace-controller` (مع `client/connection`) وجهَي TypeScript. فمشروع Client في `api/remotes` يعتمد على تصريحات `/remote` المولَّدة لحزم الأعمال أثناء tsdown الخاص بـ Host؛ وعلى تجميعات الجذر والمستهلكين المباشرين أن يشيروا إلى `tsconfig.host.json` أو `tsconfig.client.json` لكل حزمة مقسومة بحسب الجانب. ويُنتج `clientBundle(..., { hostPhase: true })` في `api-remotes` مدخلَ Host أثناء tsdown الخاص بـ Host، فلا يترك لـ tsdown الخاص بـ Client إلا مدخل المتصفح. وتسكن سياسة lookup للـ Agent والجلسة في `@deepseek-ai/dsh-api-session-controller`، لا في `api-remotes`.

وتكتب كل حزمة أعمال مساهِمة الملفاتِ المولَّدة في دليل `lib/` الخاص بها، لا في دليل مصدرها:

| الملف | المستهلك | المحتوى |
|---|---|---|
| `typert.host.js` | Loader الخاص بـ Host | انعكاس وقت التشغيل لوجه Host، وواصفات الاستدعاء الصارمة، وقيم تسجيل schemas |
| `typert.host.d.ts` | نظام أنواع Host | التصريحات المولَّدة لوجه Host |
| `typert.remote-client.js` | `api-remotes` | `TypertRemoteContribution` قابلة للتركيب تحمل واصفات صارمة وcodecs وقت التشغيل |
| `typert.remote-client.d.ts` | نظام أنواع Client | دمج التصريحات لـ `TypertRemoteNamespaceMap` و`TypertRemoteScopeMap`، مع إشارات أنواع آمنة لـ Client |
| `typert.remote-client.d.ts.map` | المحرّر | يربط خصائصَ الطرق المولَّدة بتصريحات طرق Remote في حزمة Host |

وتكشف حزم الأعمال مدخلَ Loader الخاص بـ Host عبر `./typert`، ومدخلَ Host إلى Client عبر `./remote`. ويتحقق المولّد أيضًا من تصديرات هذه الحزم ومن قوائم ملفاتها المنشورة؛ ولا يولّد نواتج إلا لحزم المساهمة الصريحة التي توفّر المدخل المقابل.

وأسماء المعاملات في تصريحات Remote الخاصة بـ Client تأتي من حقول السلك، بينما تشير أنواع المعاملات والقيم الراجعة إلى أنواع آمنة لـ Client تصدّرها حزمةُ الأعمال الأصلية. وتحلّ خريطةُ التصريحات الخاصيةَ المولَّدة خلف `ctx.remote.goals.create` رجوعًا إلى طريقة Host المصدرية الموسومة بـ `@Remote`، فتستطيع المحرّرات الداعمة لخرائط التصريحات الانتقالَ من استدعاء Client إلى التنفيذ الحقيقي بدل التوقف عند ملف `.d.ts` المولَّد.

ويشترط التحليل الصارم أن تكون طريقة Remote طريقةَ نسخة عامة غير ساكنة ولها تنفيذ ملموس. ولا يجوز أن تكون الطريقة عامة الأنواع؛ وعلى المعاملات أن تكون مطلوبة، مسمّاةً بمعرّفات بسيطة، ولا تستعمل التفكيك ولا القيم الافتراضية ولا معاملات الباقي ولا المعاملات الاختيارية. ويولّد Typert schemas صارمة للأنواع العادية القابلة للتمثيل بـ JSON؛ أما الكائنات المركَّبة مثل أصناف مساحة العمل فيجب أن يكون لها تصريح `TypertLookupMap` فريد. وحزمُ lookup والسياقات مسؤولة عن دمج التصريحات الساكن وعن تسجيل المزوّد في وقت التشغيل معًا؛ فإن غاب أحد الجانبين فشل البناء أو فشل أول استدعاء يحتاج المزوّد.

## الاستدعاء في وقت التشغيل

تستعمل استدعاءات Remote مسارَ `/api` في الـ Connection. فيستدعي Remote في Client الأمرَ `connection.rpc.call('/api', '<namespace>/<method>', { args }, signal)`؛ ويحوّل حاملُ HTTP ذلك إلى `POST /api/<namespace>/<method>`، بحمولة لا تحمل سوى كائن `args` مسمّى.

وتجري الـ Connection فحصَ الثقة الموحَّد لمسار `/api` قبل جسر HTTP، ثم توزّع داخل FetchHandler المشترك. ولا تطالب بوابة Typert إلا بنقاط النهاية ذات المقطعين التي لها واصف صارم أو علامة SRC نشطة؛ أما مسارات Fetch المضبوطة التي تملكها الميزات فتعالج الاستجابات غير JSON، وترجع سائر الطلبات بـ 404. وتملك الـ Connection النقلَ ومعرّفات RPC ومغلّفاتِ الاستجابة وإلغاءَ الطلب، بينما لا تملك البوابة إلا بروتوكولَ بيانات Remote وتوزيعَ الأعمال. واستبدالُ حامل الـ Connection لا يقتضي تغييرًا في واصفات Remote ولا في واجهة برمجة Client.

وفي كل استدعاء تحلّ البوابة الواصفَ والخدمةَ الحية من السجلات الحالية بدل تخزين كائنات الأعمال مؤقتًا. وهي تشترط أن تطابق الحقول في `args` الواصفَ بالضبط، وتتحقق من قيم السلك بالـ codecs، وتحلّ الكائنات أو المتلقّين عبر مزوّدي lookup أو السياقات المسجَّلين، وتستدعي طريقةَ الخدمة التي يقصدها الربط، وتتحقق من القيمة الراجعة. وغيابُ مزوّد، أو هويةٌ مجهولة، أو ربطٌ غير مطابق، أو معاملٌ ناقص أو زائد، أو فشلُ schema، أو طريقةٌ مفقودة، كلها تفشل قبل دخول شفرة الأعمال أو بعد الخروج منها.

ويوفّر `register()` الخاص بمزوّد lookup التصريحَ الثابت والمحلِّلَ الافتراضي معًا؛ ويوفّر `configure()` محلِّلًا يملكه تركيبُ Host وقد ينفَّذ لاتزامنيًا ويكون عمره عمرَ الأثر. وقد يسبق الضبطُ تركيبَ المزوّد؛ وبلا مزوّد يفشل الاستدعاء مع ذلك بـ `gateway/lookup-unavailable`، ويعيد تفريغُ الضبط سياسةَ المزوّد الافتراضية. ويملك متحكّم الجلسة دلالةَ المحلِّل المعيارية لـ `agent` و`session`: فهو يعيد استعمال Agent حيًّا، ويستأنف تلقائيًا الجلساتِ الباردة العادية، ويزيل تكرار الاستئنافات المتزامنة، ويرفض الهويات التي يملكها توجيهُ subagent؛ ويعيد lookup الخاص بـ `session` جلسةَ ذلك الـ Agent. ويرفع فشلُ الاستئناف وسياجُ الملكية خطأَ `RemoteError` يحمل رمزَه الخاص، `session/not-found` أو `session/agent-busy`، وتشفّره البوابة على السلك بلا تغيير؛ ولا ينطوي في `gateway/internal` إلا الرميُ غير المصنَّف.

وتفريغُ مساهمة في Client يزيل واصفاتها وطرقَها الملموسة معًا، ويجهض استدعاءاتها الجارية، ويجعل مقابض الطرق البائتة التي تحتفظ بها شفرةٌ خارجية ترفض أي استدعاء لاحق. كما أن نقطة نهاية صارمة سُحبت على Host لا تتدهور إلى استنتاج SRC، فيمنع ذلك تفريغًا حارًّا من إضعاف التحقق في صمت.

## الرجوع إلى SRC أثناء التطوير

حين يُقلع Host من المصدر عبر `node --import tsx/esm`، فإنه لا ينفّذ إضافة مصرّف Typert. ومع ذلك تسجّل مهيّئاتُ المزخرِفات المعيارية اسمَ الطريقة ووضعَ الاستدعاء في واصف مرقَّم على النموذج الأولي للخدمة، بينما يوفّر `TypertRemoteService` أو `bindTypertRemote()` ربطَ الخدمة الصريح؛ فتستطيع البوابة عندئذ بناءَ واصف مؤقت أضعف بلا بدء `ts.Program`. واسمُ الخاصية النصي الثابت في الواصف يتيح لـ `remoteMethods()` قراءةَ العلامات التي كتبتها نسخة أخرى مثبَّتة من حزمة البروتوكول.

ويحلّل الرجوعُ إلى SRC أسماءَ المعاملات البسيطة من الدالة الحية. وحين يطابق اسمُ معامل قيمةَ `parameter` في lookup مسجَّل، مثل `agent` أو `session`، يستعمل حقلَ السلك `agentId` أو `sessionId` الخاص به ويحلّ الكائن على Host؛ أما سائر المعاملات فلا يُفحص فيها إلا أنها بيانات خالية من الدورات، آمنة لـ JSON، بلا نموذج أولي خاص. ويستعمل `@RemoteScope` مباشرةً حقلَ السلك لمزوّد سياق Host مسجَّل. ولا يقرأ SRC أنواعَ TypeScript، ولا يولّد schemas بـ Zod، ولا يستنتج المعاملات الاختيارية، ولا يدعم التفكيك ولا القيم الافتراضية ولا معاملات الباقي ولا تكرار أسماء المعاملات.

ولا يحل SRC إلا مشكلةَ التوزيع في عملية Host تعمل من المصدر. فالـ Client لا يكتشف المزخرِفات من Host العامل، وRemote في Client يرفض تركيبَ واصفات SRC التي لا codecs صارمة لها؛ وأنواعُه وcodecs وقيمُ تسجيل Remote تأتي دائمًا من أحدث نواتج `lib/typert.remote-client.*` مولَّدة.

## وضع التطوير

يهيّئ تطويرُ Web نواتجَ Host وClient وWeb الحالية بـ `pnpm run build`، ثم يشغّل Host من المصدر ومراقبَ إضافات Client في طرفيتين منفصلتين:

```sh
pnpm dsh web
pnpm run dev:web
```

ويُقلع `dsh` مصدرَ Host عبر tsx، فيستطيع Host استعمال الرجوع إلى SRC؛ أما `dev:web` فلا يراقب إلا إضافات Client التي لها تصريح `dsh.client` ويعيد كتابة `lib/client.js` الخاص بها. وهو لا يحلّل مزخرِفات Host ولا يولّد DTS الخاص بـ Remote في Client.

وتغييرُ جسم تنفيذ طريقة Remote وحده دون تغيير عقدها لا يقتضي إعادة توليد ملفات Typert. أما بعد إضافة مزخرِف أو حذفه، أو تغيير اسم تصدير أو فضاء أسماء أو معامل أو قيمة راجعة أو lookup أو سياق أو توقيع إلغاء، فأعِد تشغيل بناء المكتبة المرتَّب ليولّد Host العقدَ الصارم قبل أن يصرّف Client المساهمةَ الجديدة ويحزمها:

```sh
pnpm run build:lib
```

ويستهلك مراقبُ Client العامل هذه الملفاتِ المولَّدة حين يعيد الحزم. وإن كان `pnpm run build:lib:host` قد حدّث عقدَ Host أصلًا، فيستطيع `pnpm run build:lib:client` إتمامَ جانب Client؛ أما شجرة عمل نظيفة فلا تستطيع تخطي طور Host. وإعادةُ تصريف شفرة الواجهة وحدها لا تستنتج أنواعًا جديدة من مزخرِفات Host. ويشغّل `pnpm run typecheck` طورَ مكتبة Host قبل tsc الخاص بـ Client، وتستعمل CI وبناءات الإصدار الترتيبَ نفسه.

## الحدود

لا يتولى Remote إلا استدعاءات الطرق الأحادية بطلب واحد ونتيجة واحدة. أما تدفقات أحداث الجلسة والترقيم والطيّ التدريجي والإسقاط وتدفقات الكيانات الفرعية فتشترط بروتوكول بيانات ونموذجَ تسجيل منفصلين؛ وحتى حين تعيد استعمال الـ Connection، يجب ألّا تتنكّر في صورة طرق Remote ولا تدخل واصفات الاستدعاء.

وتُنظَّم طبقات API على النحو `remotes ← gateway ← connection ← webserver`. وتسكن طبقتا BFF وRPC الخاصة بـ Typert تحت `packages/api`؛ وتسكن Connection وWebServer في `packages/client/connection` و`packages/host/webserver`. والميزةُ التي تحتاج استجابةً متدفقة أو أصيلة في المتصفح تسجّل مسارَ Fetch مضبوطًا في الـ Connection بدل تعريف طريقة Remote.

وتُضبَط سياسة lookup لكل مفتاح، فتتشارك كل معاملات `agent` أو `session` سلوكَ الاستئناف البارد. وقبولُ الكائنات الحية وحدها كان سيقتضي سياسةً صريحة لكل معامل أو لكل نقطة نهاية، وهي غير موجودة؛ وعلى طريقة الأعمال ألّا تخمّن هل جاء الكائن من استعادة.

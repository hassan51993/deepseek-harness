# Conversation تجميع

[English](conversation.md) | العربية

Conversation هو Client `SessionEventLikeEntry` window و متصفح view بين target-neutral assembly طبقة.[`ui-conversation`](../../packages/client/ui-conversation/README.ar.md) يملك event و view registry، كل `SessionBinding` مقابل identity-stable binding،Turn/Step Location، زيادة كمية Context assembly،target source، مشترك shell و إدخال تحرير ترتيب.[`ui-chat`](../../packages/client/ui-chat/README.ar.md) و [`ui-trajectory`](../../packages/client/ui-trajectory/README.ar.md) انتظار target حزمة يملك كل منها Definition، نهائي snapshot و تصيير.

هذا نص تعريف بيانات نموذج و عمل خدمة ذاتي لديه Conversation node توسيع مسار.[Web Client هيكل بنية](web-client.ar.md) شرح هذا فرعي نظام في Client model و Slots بين موضع؛[Conversation Node تجميع قرار](../../.agents/notes/implemented/architecture/2026-08-09-client-conversation-node-assembly.ar.md) سجل ذلك تصميم إدارة من.

## بيانات نموذج و كل حق

Session Controller يملك وصل متابعة قد تحميل منطق event window. كل `SessionEventLikeEntry` يلزم ما هو يمثل واحد حمل دائم حدث `{ type: 'event', event: SessionEvent }`، يلزم ما هو يمثل واحد Client-only `assistant/live-chunk` عرض `{ type: 'transient', event: AssistantLiveChunkEvent }`؛ اثنان نوع داخلي event كل عام `type`،`seq`،`time` و `data`.`ui-conversation` يأخذ هذه entry مباشر تسليم إعطاء assembler، لا آخر فتح history stream. كل Session مقابل واحد `ConversationNodeAssembler`، هو تطبيق كل قد تسجيل Definition، و لـ كل قد تسجيل view target إصدار مستقل source.

| عام فكرة | Owner و استخدام طريق |
|---|---|
| Event Definition | عمل خدمة حزمة مرة مطابقة واحد حمل دائم event أو Client-only لحظة حالة event، بـ مستقر `(kind, id)` صلة ربط إدخال، طي تحديد صفة State، و اختياري اختيار materialize واحد target node. |
| Context | Engine لـ واحد `(kind, id)` يملك لديه ترتيب Match و حالي State. واحد لحظة حالة event فقط احتلال واحد update Match؛ فقط لديه update دليل يمكن إبقاء pending، مباشر إلى قسم صفحة تكملة متساو ذلك وحيد حمل دائم start. |
| Location | Engine أصل حسب حمل دائم boundary event دفع توجيه Session،Turn أو Step جلوس علامة.Definition يمكن نحو واحد Turn أو Step إصدار نوع تحويل بيانات. |
| View Definition | Target حزمة لـ كل Session إنشاء واحد زيادة كمية builder، و يملك هذا target نهائي snapshot نوع. |
| View | Chat أو Trajectory انتظار Slot entry فقط قراءة ذاته target snapshot، و تصيير target ذاتي لديه node. |

Chat و Trajectory يمكن تعرف آخر نفس عدد حمل دائم event family، لكن كل منها إبقاء ذاتي ذات Definition State و نهائي node payload. مشترك target-neutral آلية فقط يشمل identity routing، لديه ترتيب replay،Location data،predecessor dependency و publication cadence.

## Target تنشيط

كل Session كل إبقاء مفرد ضبط زيادة طويل active target تجميع دمج. إنشاء أو قراءة target source لن تنشيط هو.shell سوف صريح تنشيط حفظ دائم اختيار أو جديد اختيار View، أخرى إزالة استهلاك من فإن عبر target source أول عدد حجز قراءة تنشيط target. أول مرة تنشيط سوف إنشاء هذا target builder، و من حالي حسب target بحث جذب Context استدعاء مرة `replace()`. لاحق flush مقابل كل active target استدعاء `apply()`، إلغاء حجز قراءة لن إزالة target.

shell يملك View اختيار، و في binding إنشاء، يتم اختيار لـ current أو View roster تغير وقت، في تصيير قبل تحليل قد تسجيل انحراف جيد View أو Chat fallback.assembler فقط استقبال تحليل بعد target id، لا ذاتي سطر اختيار Chat أو أخرى افتراضي target. رقم ثلاثة جهة View استخدام نفسه اختيار و تنشيط عملية.

## يمكن إعادة تشغيل event family

تحرير كتابة Definition قبل أولا اختيار تحديد مستقر عمل خدمة id. بنية صار نفس عدد Node كل بند حدث كل يجب يحمل هذا id، أو فقط سند ذاته payload مستقل دفع تصدير هذا id؛Client أبدا قدرة يأخذ update تخمين قياس لـ يخص “الأكثر قريب واحد لم إتمام” Context.

بـ واحد review job لـ مثال، حدث اتفاق يمكن هو:

| حدث | زاوية لون | يجب حفظ دائم واقع |
|---|---|---|
| `review/start` | وحيد start | `reviewId`،Turn/Step جلوس علامة، عنوان |
| `review/progress` | update | نفسه `reviewId`، جلوس علامة، يمكن إعادة تشغيل دخول درجة |
| `review/end` | update | نفسه `reviewId`، جلوس علامة، نهائي ملخص |

عبر عملية حد استخدام إنتاج جهة يملك branded id نوع. يأخذ `SessionEventMap` دمج و payload نوع وضع في إنتاج جهة صاف نوع تصدير في، مجددا من Client حزمة عبر فقط نوع فرعي أثر استيراد هذا تصدير. كل `(kind, id)` الأكثر كثير فقط قدرة لديه واحد بند start حدث. مفرد حدث عمل خدمة يمكن يأخذ حدث ذاته مستقر هوية (مثال مثل `event.seq`) بصفة Definition داخلي id.

نظام دعم حمل زيادة كمية حدث. إذا إنتاج جهة قدرة بـ مقارنة منخفض صار هذا إرسال خروج whole-value checkpoint، ينبغي أولوية اعتماد، لأن start يقع في قد تحميل نافذة خارج وقت هو ما زال يمكن مباشر استخدام. كل بند delta كل يجب يحمل مستقر id، و كما حسب وفق سجل `seq` رفع ترتيب إعادة تشغيل وقت قدرة كاف تحديد صفة أرض إنتاج State؛ هو لا يستطيع اعتماد فقط وجود في فوري داخل تخزين في حالة. إذا حالي تاريخ نافذة فقط لديه update،Assembler سوف إبقاء واحد pending Context، و في أكثر مبكر قسم صفحة تكملة متساو start قبل لا بنية صنع State. إذا منتج يجب في start بعد لم تحميل وقت تصيير،terminal أو checkpoint حدث حينئذ يجب يحمل كاف كاف كامل fallback حالة، يجعل Definition قدرة مباشر بنية صنع نتيجة؛ لا يلزم عبر مسح غير متصل حدث استعادة هو.

فوري Assistant delta بصفة Client-only `assistant/live-chunk` update وصول. إعادة وصل baseline سوف يأخذ نشط وثب عملية داخل ضيق تجميع stream توسيع لـ نفسه لحظة حالة event، حمل دائم `assistant/message` و `assistant/attempt` event فإن تضمين دخول كامل ضيق تجميع stream توفير تاريخ إعادة تشغيل. لحظة حالة event فقط قدرة ملء عند update؛`start()` فقط استقبال معيار `SessionEvent`. إزالة استهلاك Assistant إخراج Definition في نفس مجموعة `match()` و `update()` طريقة داخل معالجة live chunk و حمل دائم settlement، أخرى Definition مباشر إرجاع `null`، بلا حاجة توسيع stream.

## Definition و نوع تحويل Chat payload

لـ كامل عرض صلة ربط علاقة، تحت وجه يأخذ إنتاج جهة إعلان و Client مساهمة كتابة في نفس عدد شفرة كتلة داخل. فعلي حزمة عائلة في،branded id و `SessionEventMap` إعلان إبقاء في حدث إنتاج جهة،Definition،Chat data دمج و renderer إبقاء في Client إضافة.

```ts ignore-check
import { createElement } from 'react'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { Branded } from '@deepseek-ai/dsh-brand'
import type {
  ConversationLocation, ConversationNodeContext,
  ConversationNodeDefinition,
} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ChatNodeViewProps } from '@deepseek-ai/dsh-client-ui-chat/client'

type ReviewId = Branded<'ReviewId'>

interface ReviewStartData {
  readonly reviewId: ReviewId
  readonly turn: number
  readonly step: number
  readonly title: string
}

interface ReviewProgressData {
  readonly reviewId: ReviewId
  readonly turn: number
  readonly step: number
  readonly completed: number
}

interface ReviewEndData {
  readonly reviewId: ReviewId
  readonly turn: number
  readonly step: number
  readonly summary: string
}

declare module '@deepseek-ai/dsh-session/types' {
  interface SessionEventMap {
    /**
     * Opens one durable review job.
     * @mode emit
     * @param data - stable identity, location, and initial display state.
     */
    'review/start': ReviewStartData
    /**
     * Records replayable progress for one review job.
     * @mode emit
     * @param data - stable identity, location, and latest progress.
     */
    'review/progress': ReviewProgressData
    /**
     * Closes one review job with its final summary.
     * @mode emit
     * @param data - stable identity, location, and final display state.
     */
    'review/end': ReviewEndData
  }
}

interface ReviewChatData {
  readonly title: string
  readonly completed: number
  readonly status: 'running' | 'completed'
  readonly summary?: string
}

declare module '@deepseek-ai/dsh-client-ui-chat/client' {
  interface ChatNodeDataMap {
    'review-job': ReviewChatData
  }
}

declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
  interface ConversationStepDataMap {
    'review-job': ReviewChatData
  }
}

interface ReviewState extends ReviewChatData {
  readonly turn: number
  readonly step: number
}

function locationOf(context: ConversationNodeContext): ConversationLocation {
  return context.start?.location ?? context.matches[0]?.location ?? { kind: 'unresolved' }
}

function viewData(state: ReviewState): ReviewChatData {
  return {
    title: state.title,
    completed: state.completed,
    status: state.status,
    ...state.summary === undefined ? {} : { summary: state.summary },
  }
}

const reviewDefinition: ConversationNodeDefinition<ReviewState> = {
  kind: 'review-job',
  target: 'chat',
  match: (event) => {
    if (event.type === 'review/start') {
      return { id: String(event.data.reviewId), role: 'start' }
    }
    if (event.type === 'review/progress' || event.type === 'review/end') {
      return { id: String(event.data.reviewId), role: 'update' }
    }
    return null
  },
  start: (_context, match) => {
    if (match.event.type !== 'review/start') throw new Error('review-job requires review/start')
    return {
      turn: match.event.data.turn,
      step: match.event.data.step,
      title: match.event.data.title,
      completed: 0,
      status: 'running',
    }
  },
  update: (context, match) => {
    if (match.event.type === 'review/progress') {
      return { ...context.state, completed: match.event.data.completed }
    }
    if (match.event.type === 'review/end') {
      return { ...context.state, completed: 100, status: 'completed', summary: match.event.data.summary }
    }
    return context.state
  },
  publication: match => match.event.type === 'review/progress'
    ? 'animation-frame'
    : 'immediate',
  buildLocationData: (context, scope) => {
    if (scope !== 'step' || context.state === undefined) return null
    return {
      kind: 'step',
      turn: context.state.turn,
      step: context.state.step,
      key: 'review-job',
      value: viewData(context.state),
    }
  },
  buildViewNode: (context) => {
    if (context.state === undefined) return null
    return {
      key: context.key,
      kind: 'review-job',
      id: context.id,
      target: 'chat',
      anchorSeq: context.start?.event.seq ?? context.matches[0]?.event.seq ?? 0,
      location: locationOf(context),
      visibility: 'visible',
      data: viewData(context.state),
    }
  },
}

function ReviewNodeView({ node }: ChatNodeViewProps<'review-job'>) {
  const text = node.data.summary ?? `${node.data.title}: ${node.data.completed}%`
  return createElement('p', null, text)
}

export const inject = ['uiConversation', 'slots']

export function apply(ctx: ClientContext): void {
  ctx.uiConversation.events.register(reviewDefinition)
  ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
    name: 'conversation.chat.node',
    key: 'review-job',
  }, ReviewNodeView))
}
```

`match(event)` هو هوية رفع أخذ جهاز، لا هو fold: هو فقط قدرة استلام إلى حالي `SessionEventLike`، و إرجاع Definition داخلي id و دورة الحياة زاوية لون. أمر في بعد،Assembler عبر `(kind, id)` تحديد موضع Context؛ معيار event يمكن إطلاق مرة `start`، معيار أو packed event يمكن يأخذ حالي State تسليم إعطاء `update`. اثنان عدد دالة كل يجب إرجاع جذب محرك مع بعد اعتماد State؛ دفع ترشيح إرجاع جديد immutable value، لكن دالة أصل أرض تعديل بعد إرجاع نفس كائن وقت، اعتماد دلالة أيضا نفسه.

`buildLocationData(context, scope)` يمكن يأخذ Definition يملك بيانات إصدار إلى جذب محرك يملك Turn أو Step فوق. عبر declaration merging لـ كل key إشارة تحديد دقيق value نوع. نفس Location داخل آخر عدد Node يمكن استخدام تلقي حد slot hook(مثال مثل `useTurnData(key)`) قراءة هذا قيمة، بلا يجب أخذ نيل Session، أيضا بلا يجب مسح `snapshot.chat.nodes`.

`target` و `buildViewNode(context)` يجب معا إعلان واحد بند من target يملك تصيير مساهمة. يأخذ `context.key` إبقاء لـ React جانب هوية، أصل حسب حمل دائم ترتيب دليل اختيار `anchorSeq`، و كما فقط إرجاع renderer يمكن مباشر استخدام بيانات. بعض عدد target Node واحد حالما إصدار، حينئذ يلزم متابعة إرجاع نفس عدد key؛ حاجة مؤقت وقت مغادرة فتح مرئي تدفق وقت استخدام `visibility: 'hidden'`، لا يلزم تعديل لـ إرجاع `null` سحب عودة هو.

## Predecessor read

لديه بعض Definition حاجة آخر عدد عمل خدمة kind في حالي موضع قبل الأكثر جديد State.`start` سوف استلام إلى `ConversationContextReader`؛ ينبغي في هذا داخل استدعاء `reader.previous<State>(kind)`، لا يلزم استقبال Context تجميع دمج أو مسح حدث.Reader إرجاع حالي start `seq` قبل الأكثر قريب واحد قد بدء Context فقط قراءة بيانات.

Assembler سوف سجل هذا بند اعتماد. إذا لاحق older prepend حمل قدوم أكثر قريب قبل ترتيب Context، تكملة متساو أصل أولا لم معرفة نافذة نقص فتحة، أو من قبل ترتيب State يتم إصلاح حجز، جذب محرك سوف من `start` إعادة تشغيل اعتماد جهة Context، و حسب `seq` رفع ترتيب إعادة تشغيل ذلك update. يتم استعلام Definition ما زال مسؤول يأخذ لديه استخدام معلومة كتابة ذاته State؛Reader لا توفير عمل خدمة مخصص استخدام استعلام طريقة، أيضا لا منح إعطاء تعديل أخرى Context إذن.

## Window تحديث مسار

تاريخ ممكن من ذيل جزء بدء واحد صفحة واحد صفحة نحو قبل طلب.Session journal أولا تحقق متبادل لا إعادة تراكم منطق seq range،Assembler مجددا حسب كل قد قبول input أول `seq` ترتيب و دخول State إعادة تشغيل.

| مسار | جذب محرك عمل | Definition يمكن مراقبة إلى سلوك |
|---|---|---|
| open،resync أو gap repair وقت replace | إعادة بناء قد تحميل نافذة، كل بند معيار event أو packed run مقابل كل Definition مطابقة مرة، مجددا إعادة تشغيل كل قد لديه start Context | أولا تنفيذ `start`، مجددا حسب منطق `seq` رفع ترتيب تنفيذ ذلك update؛ فقط لديه update pending Context ما زال لا يوجد State |
| prepend واحد صفحة أكثر مبكر تاريخ | فقط مطابقة إضافة جديدة أكثر مبكر input، حسب `(kind, id)` دمج دخول Context، إبقاء قائم keyed node، و فقط إعادة وضع تلقي أثر Context و اعتماد | جديد اكتشاف scalar start سوف تنشيط قد استلام تجميع scalar و packed update؛Location أو قبل ترتيب اعتماد تغير أيضا ممكن إعادة ركض Context |
| append واحد بند فوري حدث | كل Definition كل استدعاء مرة `match`، حسب key فحص بحث أمر في Context، فقط تحديث هذا Context | مقابل start بعد مطابقة حدث تنفيذ مرة scalar `update` و طلب مرة إصدار؛ لا مسح قد لديه Context |

تسجيل `D` عدد Definition وقت، واحد بند جديد scalar event أو packed run سوف إجراء `D` مرة فقط حالي input مطابقة؛ أمر في بعد Context key استعلام هو معتاد عدد وقت.Definition شفرة يجب صيانة حمل هذا عدد صفة جودة: صحيح معتاد append حار مسار لا نيل مرة تاريخ كامل حدث نافذة، كل Context،`context.matches` أو قد تصيير Node تجميع دمج. تراكم حساب واقع وضع دخول State، نفس Turn/Step مشترك معلومة وضع دخول Location data، لديه بحث جذب قبل ترتيب اعتماد استخدام `reader.previous()`.

`publication` تحكم حدوث State تغيير بعد أي وقت شيء تحويل. بنية أو terminal تغير استخدام `immediate`، عال تردد مرئي delta استخدام `animation-frame`، فقط لـ لاحق إصدار تراكم تراكم State وقت استخدام `none`. جذب محرك حسب سجل ترتيب تطبيق كل بند scalar update، و استخدام مرة batch update تطبيق واحد packed run؛ هذا خيار فقط دمج عرض إصدار تردد معدل.

## تحقق اشتراط

إضافة تجمع تركيز اختبار، إثبات التالي نتيجة:

1. كامل نافذة عبر replace بعد إنتاج مسبق مدة نهائي State،Location data،Node payload و `anchorSeq`.
2. فقط لديه update ذيل جزء نافذة إبقاء pending؛prepend وحيد start بعد، نتيجة و كامل replace نفسه.
3. ابتدائي تاريخ بعد متابعة فوري append، و إعادة تشغيل دمج بعد كامل نافذة نيل إلى نفسه نتيجة.
4. prepend أكثر مبكر قسم صفحة فقط زيادة أكثر مبكر سطر؛ بيانات لم تغير قائم keyed Node value لا يتم استبدال.
5. تكرار مرئي delta إبقاء `context.key`، و في طلب `animation-frame` وقت كل لقطة الأكثر كثير إصدار مرة.
6. keyed renderer فقط إزالة استهلاك `node.data` و تلقي حد Location hook، لا مسح Session حدث نافذة،Context أو Chat Node.
7. scalar و packed Assistant تاريخ إنتاج نفسه نهائي State،timing boundary و target snapshot؛ واحد packed run في replace،prepend،Location replay و registry rebuild في بداية نهاية فقط إبقاء واحد Match.
8. إنشاء target source لا تنفيذ builder عمل؛ صريح اختيار أو أول مرة حجز قراءة تنفيذ مرة كامل replace، لاحق تحديث إرسال بلوغ كل active target، تكرار تنشيط لن مجددا مرة replace.

تدفق صيغة و في قطع معالجة يمكن مشاركة اعتبار [`packages/client/ui-chat/src/client/conversation-nodes/assistant.ts`](../../packages/client/ui-chat/src/client/conversation-nodes/assistant.ts) ، قبل ترتيب استعلام يمكن مشاركة اعتبار [`inbox.ts`](../../packages/client/ui-chat/src/client/conversation-nodes/inbox.ts) و [`message.ts`](../../packages/client/ui-chat/src/client/conversation-nodes/message.ts) ، فقط إصدار Turn data بينما لا إنشاء ذاتي لديه Node مثال فرعي رؤية [`packages/client/ui-deliverables`](../../packages/client/ui-deliverables).

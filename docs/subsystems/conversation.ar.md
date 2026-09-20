# تجميع المحادثة

[English](conversation.md) | العربية

المحادثةُ طبقةُ التجميع المحايدة تجاه الأهداف بين نافذة `SessionEventLikeEntry` في العميل وعروضِ المتصفح. وتملك [`ui-conversation`](../../packages/client/ui-conversation/README.ar.md) سجلَّي الأحداث والعروض، وربطًا واحدًا ثابتَ الهوية لكل `SessionBinding`، ومواضعَ الجولات والخطوات، وتجميعَ السياق التدريجي، ومصادرَ الأهداف، والقشرةَ المشتركة، وتنسيقَ المُدخَل. وتملك حزمُ الأهداف مثل [`ui-chat`](../../packages/client/ui-chat/README.ar.md) و[`ui-trajectory`](../../packages/client/ui-trajectory/README.ar.md) تعريفاتِها ولقطاتِها النهائية وعرضَها.

وتعرّف هذه الصفحةُ نموذجَ البيانات ومسارَ التوسعة لعقدة محادثة يملكها العمل. ويضع [معمار عميل Web](web-client.ar.md) النظامَ بين نماذج العميل والخانات؛ ويملك [قرارُ تجميع عقد المحادثة](../../.agents/notes/implemented/architecture/2026-08-09-client-conversation-node-assembly.ar.md) مسوّغَه.

## نموذج البيانات والملكية

يملك متحكمُ الجلسة نافذةَ الأحداث المنطقية المتصلة المحمَّلة. وكلُّ `SessionEventLikeEntry` إما `{ type: 'event', event: SessionEvent }` لحدث دائم واحد، وإما `{ type: 'transient', event: AssistantLiveChunkEvent }` لعرض `assistant/live-chunk` واحد يخص العميل وحده. ويكشف الحدثان الداخليان `type` و`seq` و`time` و`data`. وتمرّر `ui-conversation` هذه المداخلَ إلى المجمِّع بلا فتح مجرى تاريخ ثانٍ. ويطبّق `ConversationNodeAssembler` واحد لكل جلسة كلَّ تعريف مسجَّل وينشر مصدرًا مستقلًّا لكل هدف عرض مسجَّل.

| المفهوم | المالك والغرض |
|---|---|
| تعريف الحدث | تطابق حزمةُ عمل حدثًا دائمًا واحدًا أو حدثًا عابرًا يخص العميل في كل مرة، وتربطه بـ`(kind, id)` ثابت، وتطوي حالةً حتمية، وتجسّد عقدةَ هدف واحدة اختياريًا. |
| السياق | المطابقاتُ المرتَّبة والحالةُ الراهنة التي يملكها المحرّكُ لـ`(kind, id)` واحد. ويشغل الحدثُ العابر مطابقةَ تحديث واحدة؛ وقد تبقى الأدلةُ المقتصرة على التحديثات معلَّقةً حتى يقدّم التقسيمُ إلى صفحات بدايتَها الدائمة الفريدة. |
| الموضع | إحداثياتُ الجلسة أو الجولة أو الخطوة التي يملكها المحرّكُ وتُشتق من أحداث الحدود الدائمة. وللتعريفات أن تنشر بياناتٍ منوَّعة على جولة واحدة أو خطوة واحدة. |
| تعريف العرض | تنشئ حزمةُ الهدف بانيًا تدريجيًّا واحدًا لكل جلسة وتملك نوعَ اللقطة النهائية لذلك الهدف. |
| العرض | يقرأ مدخلُ خانة مثل المحادثة أو المسار لقطةَ هدفه وحدها ويعرض عقدًا يملكها الهدف. |

وقد تتعرف المحادثةُ والمسارُ على عائلة الأحداث الدائمة نفسِها، لكن كلًّا منهما يُبقي حالةَ تعريفه وحمولةَ عقدته النهائية. وتقتصر الآلةُ المشتركة المحايدة تجاه الأهداف على توجيه الهوية، وإعادة التشغيل المرتَّبة، وبيانات المواضع، وتوابع السوابق، وإيقاع النشر.

## تفعيل الأهداف

تُبقي كلُّ جلسة مجموعةَ أهداف نشطة تصاعدية. وإنشاءُ مصدر هدف أو قراءتُه لا يفعّله. وتفعّل القشرةُ صراحةً العرضَ المحفوظ أو المختار حديثًا، بينما يفعّل مستهلكٌ آخر هدفًا بأول اشتراك في مصدره. وينشئ أولُ تفعيل بانيَ ذلك الهدف وينادي `replace()` مرةً واحدة من السياقات المفهرَسة بالهدف حاليًا. وتنادي الدفعاتُ اللاحقة `apply()` لكل هدف نشط، وإلغاءُ الاشتراك لا يزيل هدفًا.

وتملك القشرةُ اختيارَ العرض وتحلّ العرضَ المفضَّل المسجَّل أو احتياطيَّ المحادثة قبل العرض حين يُنشأ ربطٌ أو يُختار حاليًّا، وبعد تغيّر قائمة العروض. ويتلقى المجمِّعُ معرّفَ الهدف المحلول وحده ولا يختار المحادثةَ ولا هدفًا افتراضيًّا آخر. ويشارك عرضٌ من طرف ثالث عبر عمليات الاختيار والتفعيل نفسِها.

## عائلات الأحداث القابلة لإعادة التشغيل

اختر معرّفَ عمل ثابتًا واحدًا قبل كتابة التعريف. وعلى كل حدث يسهم في العقدة نفسِها أن يحمل ذلك المعرّفَ أو أن يشتقه مستقلًّا من حمولته؛ ويجب ألّا يسند العميلُ تحديثًا إلى «آخر سياق لم ينتهِ» قط.

ولمهمة مراجعة، قد يكون عقدُ الأحداث:

| الحدث | الدور | الحقائق الدائمة المشترَطة |
|---|---|---|
| `review/start` | بدايةٌ فريدة | `reviewId`، وإحداثياتُ الجولة والخطوة، والعنوان |
| `review/progress` | تحديث | `reviewId` نفسُه، والإحداثيات، وتقدّمٌ قابل لإعادة التشغيل |
| `review/end` | تحديث | `reviewId` نفسُه، والإحداثيات، والملخصُ النهائي |

استعمل نوعَ المعرّف الموسوم الذي يملكه المنتِج عبر حدّ العملية. وضع دمجَ `SessionEventMap` وأنواعَ الحمولات في تصدير الأنواع وحدها لدى المنتِج، ثم استورد ذلك التصديرَ لأثره من حزمة العميل. ولكل `(kind, id)` حدثُ بداية واحد على الأكثر. ويستطيع عملٌ ذو حدث واحد أن يستعمل هويةَ الحدث الثابتة، مثل `event.seq`، معرّفًا محليًّا في التعريف.

والأحداثُ التدريجية مدعومة. وفضّل نقاطَ تفتيش بالقيمة كاملةً حين يستطيع المنتِجُ إصدارَها بثمن رخيص، لأنها تبقى مفيدةً حين تكون البدايةُ خارج النافذة المحمَّلة. وعلى كل فرق أن يحمل المعرّفَ الثابت وأن ينتج حالةً حتمية حين يُعاد تشغيله بترتيب `seq` تصاعدي في السجل؛ ويجب ألّا يعتمد على ذاكرة حية وحدها. وإن لم تحتوِ نافذةُ التاريخ الحالية إلا تحديثات، أبقى المجمِّعُ سياقًا معلَّقًا ولم يبنِ حالةً حتى تقدّم صفحةٌ أقدم البدايةَ. وإن وجب على المنتَج العرضُ قبل تحميل البداية، فعلى حدث نهائي أو حدث نقطة تفتيش أن يحمل من الحالة الاحتياطية الكاملة ما يكفي التعريفَ ليبني تلك النتيجة مباشرةً؛ ولا تستردها بمسح أحداث لا صلةَ لها.

وتصل فروقُ المساعد الحية تحديثاتِ `assistant/live-chunk` تخص العميلَ وحده. وتوسّع خطوطُ أساس إعادة الاتصال المجرى المضغوط النشط المحلي في العملية إلى الأحداث العابرة نفسِها، بينما تضمّن أحداثُ `assistant/message` و`assistant/attempt` الدائمة مجاريَ مضغوطة كاملة لإعادة تشغيل التاريخ. والأحداثُ العابرة لا تكون إلا تحديثات؛ ويتلقى `start()` قيمةَ `SessionEvent` قياسية. والتعريفُ الذي يستهلك خرجَ المساعد يعالج القطعَ الحية والاستقراراتِ الدائمة في `match()` و`update()` نفسَيهما، بينما تعيد التعريفاتُ التي لا صلةَ لها `null` بلا توسيع مجرى.

## التعريف وحمولة المحادثة المنوَّعة

يُبقي المثالُ تصريحاتِ المنتِج وإسهامَ العميل في كتلة واحدة فتظهر العلاقةُ كاملةً. وفي عائلة حزم، أبقِ المعرّفَ الموسوم وتصريحَ `SessionEventMap` مع منتِج الحدث، وأبقِ التعريفَ ودمجَ بيانات المحادثة والعارضَ في إضافة العميل.

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

و`match(event)` مستخرِجُ هوية لا طيٌّ: فهو يتلقى `SessionEventLike` الحالي وحده ويعيد المعرّفَ المحلي في التعريف ودورَ دورة الحياة. وبعد مطابقة، يحدد المجمِّعُ السياقَ بـ`(kind, id)` وينادي `start` مرةً واحدة لحدث قياسي أو `update` لحدث قياسي أو محزوم. وتعيد الدالتان الحالةَ التي يتبناها المحرّك؛ وإعادةُ قيمة جديدة غير قابلة للتغيير مفضَّلة، لكن دالةً تغيّر الكائنَ نفسَه وتعيده لها دلالةُ التبني نفسُها.

و`buildLocationData(context, scope)` تنشر اختياريًا بياناتٍ يملكها التعريفُ على جولة أو خطوة يملكها المحرّك. استعمل دمجَ التصريحات لتعطي كلَّ مفتاح نوعَ قيمة دقيقًا. وتستطيع عقدةٌ أخرى في الموضع نفسِه استهلاكَ تلك القيمة عبر خطّاف خانتها المقيَّد، مثل `useTurnData(key)`، بلا أن تتلقى الجلسةَ وبلا مسح `snapshot.chat.nodes`.

و`target` و`buildViewNode(context)` تعلنان إسهامَ عرض واحدًا يملكه الهدف ويجب أن تظهرا معًا. احفظ `context.key` هويةً تجاه React، واختر `anchorSeq` من دليل ترتيب دائم، وأعِد بياناتٍ جاهزةً للعارض وحدها. وحالما تُنشر عقدةُ هدف، واصِل إعادةَ المفتاح نفسِه؛ واستعمل `visibility: 'hidden'` حين يجب أن تغادر التدفقَ المرئي مؤقتًا بدل سحبها بـ`null`.

## قراءات السوابق

تحتاج بعضُ التعريفات إلى أحدث حالة أسبق لصنف عمل آخر. ويتلقى `start` قيمةَ `ConversationContextReader`؛ فنادِ `reader.previous<State>(kind)` هناك بدل قبول مجموعة سياقات أو مسح الأحداث. ويعيد القارئُ أقربَ سياق بدأ قبل `seq` البداية الحالية بياناتٍ للقراءة فقط.

ويسجّل المجمِّعُ تلك التابعة. فإن قدّمت إضافةٌ أقدمُ لاحقًا سابقًا أقرب، أو أغلقت فجوةَ نافذة كانت مجهولة، أو راجعت حالةَ السابق، أعاد تشغيلَ السياق التابع من `start` وأعاد تشغيلَ تحديثاته بترتيب `seq` تصاعدي. ويبقى التعريفُ المستعلَم عنه مسؤولًا عن كتابة حالة مفيدة؛ ولا يكشف القارئُ طرائقَ استعلام خاصة بالعمل ولا يمنح سلطةَ تغيير على سياق آخر.

## مسارات تحديث النافذة

قد يُطلب التاريخُ من الذيل إلى الوراء صفحةً في كل مرة. ويتحقق دفترُ الجلسة أولًا من مديات التسلسل المنطقية غير المتداخلة؛ ثم يرتّب المجمِّعُ المُدخَلاتِ المقبولة بأول `seq` لها قبل إعادة تشغيل الحالة.

| المسار | عمل المحرّك | السلوك الذي يراه التعريف |
|---|---|---|
| الاستبدال عند الفتح أو إعادة المزامنة أو إصلاح فجوة | إعادةُ بناء النافذة المحمَّلة، ومطابقةُ كل حدث قياسي أو مقطع محزوم مرةً لكل تعريف، ثم إعادةُ تشغيل كل سياق بدأ | `start`، تليه تحديثاتُه بترتيب `seq` المنطقي التصاعدي؛ وتبقى السياقاتُ المعلَّقة المقتصرة على التحديثات بلا حالة |
| إضافة صفحة أقدم في الصدر | مطابقةُ المُدخَلات الأقدم الجديدة وحدها، ودمجُها في السياقات بـ`(kind, id)`، وحفظُ العقد المفتاحية القائمة، وإعادةُ تشغيل السياقات المتأثرة وتوابعها وحدها | تفعّل بدايةٌ قياسية وُجدت حديثًا تحديثاتِها القياسية والمحزومة المجموعة؛ وقد يعيد موضعٌ أو سابقٌ متغيّر تشغيلَ السياق |
| إلحاق حدث حي | نداءُ `match` في كل تعريف مرةً، والبحثُ عن السياق المطابِق بالمفتاح، وتحديثُ ذلك السياق وحده | تحديثٌ قياسي واحد ونشرٌ واحد مطلوب لحدث مطابِق بعد البداية؛ بلا مسح للسياقات القائمة |

وبعدد `D` من التعريفات المسجَّلة، يجري حدثٌ قياسي واحد أو مقطعٌ محزوم واحد عددَ `D` مطابقةً للمُدخَل الحالي وبحثًا بمفتاح السياق بزمن ثابت بعد المطابقة. وعلى شفرة التعريف حفظُ تلك الخاصية: فلا تجتَز نافذةَ الأحداث كاملةً ولا كلَّ سياق ولا `context.matches` ولا مجموعةَ العقد المعروضة في مسار الإلحاق المعتاد. استعمل الحالةَ للحقائق المتراكمة، وبياناتِ الموضع للمشاركة داخل الجولة أو الخطوة نفسِها، و`reader.previous()` لتوابع السوابق المفهرَسة.

و`publication` تتحكم في متى تُجسَّد الحالةُ المتغيّرة. استعمل `immediate` للتغييرات البنيوية أو النهائية، و`animation-frame` للفروق المرئية عالية التواتر، و`none` حين لا تغذي الحالةُ المتغيّرة إلا نشرًا لاحقًا. ويطبّق المحرّكُ كلَّ تحديث قياسي بترتيب السجل وكلَّ مقطع محزوم في تحديث دفعة واحد؛ ولا يدمج الإيقاعُ إلا نشرَ العرض.

## واجبات التحقق

أضِف اختباراتٍ مركَّزة تثبت هذه الحصائل:

1. نافذةٌ كاملة مرّت عبر الاستبدال تنتج الحالةَ النهائية وبياناتِ الموضع وحمولةَ العقدة و`anchorSeq` المتوقعة.
2. ذيلٌ مقتصر على التحديثات يبقى معلَّقًا؛ وإضافةُ البداية الفريدة في الصدر تنتج نتيجةَ استبدال كامل نفسَها.
3. تاريخٌ ابتدائي يتبعه إلحاقٌ حي ينتج نتيجةَ إعادة تشغيل النافذة المدمجة نفسَها.
4. إضافةُ صفحة أقدم في الصدر تضيف صفوفًا أسبق بلا استبدال قيم العقد المفتاحية القائمة التي لم تتغير بياناتُها.
5. الفروقُ المرئية المتكررة تحفظ `context.key` وتنشر مرةً واحدة على الأكثر لكل إطار رسم عند الطلب.
6. العارضُ المفتاحي لا يستهلك إلا `node.data` وخطّافاتِ الموضع المقيَّدة؛ ولا يمسح نافذةَ أحداث الجلسة ولا السياقاتِ ولا عقدَ المحادثة.
7. تاريخُ المساعد القياسي والمحزوم ينتجان الحالةَ النهائية وحدودَ التوقيت ولقطةَ الهدف نفسَها، بينما يبقى المقطعُ المحزوم الواحد مطابقةً واحدة عبر الاستبدال والإضافة في الصدر وإعادة تشغيل المواضع وإعادة بناء السجل.
8. إنشاءُ مصدر هدف لا يُجري عملَ بانٍ؛ ويُجري الاختيارُ الصريح أو أولُ اشتراك استبدالًا كاملًا واحدًا، وتبلغ التحديثاتُ اللاحقة كلَّ هدف نشط، ولا يُجري التفعيلُ المتكرر استبدالًا.

استعمل [`packages/client/ui-chat/src/client/conversation-nodes/assistant.ts`](../../packages/client/ui-chat/src/client/conversation-nodes/assistant.ts) للبث والمقاطعة، و[`inbox.ts`](../../packages/client/ui-chat/src/client/conversation-nodes/inbox.ts) مع [`message.ts`](../../packages/client/ui-chat/src/client/conversation-nodes/message.ts) لاستعلامات السوابق، و[`packages/client/ui-deliverables`](../../packages/client/ui-deliverables) لتعريف ينشر بياناتِ جولة بلا إنشاء عقدته.

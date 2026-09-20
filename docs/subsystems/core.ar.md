# النواة

[English](core.md) | العربية

نظامُ **النواة** هو [`packages/core`](../../packages/core/README.ar.md) — وهي الحزمُ التي يُقلعها كلُّ تركيب: سجلُّ الجلسة المسنَد إلى الأحداث، وتجميعُ مطالبة النظام، وسجلُّ الأدوات، وأنواعُ الوكيل، والحلقةُ الملموسة التي تقودها. وتشرح هذه الصفحةُ ما يعلنه زوجُ `agent` و`agent-loop` — كيف يُنشأ الوكيلُ ويُملَك، وعقودَ التسليم والإلغاء والاعتراض في مقبض `Agent` — مع نمطَي الأنواع اللذين يتبعهما كلُّ نظام. أما صفحاتُ المجموعة المخصصة وبقيةُ المجلد فمفهرسة في [README الأنظمة](README.ar.md).

## العمود، حزمةً حزمة

تجري الجولةُ عبر الحزم الست في حلقة واحدة: يدّعي القائدُ في [`agent-loop`](../../packages/core/agent-loop) مطالبةً مصطفّة، ويفتح جولةً على [سجل الجلسة](session.ar.md) (`ctx.sessions`)، ويجمّع بادئةَ الطلب عبر [مطالبة النظام](system-prompt.ar.md) (`ctx.systemPrompt`) ويشتق التاريخَ من السجل، ويبثّ استجابةَ النموذج عبر [seam LLM](llm-streaming.ar.md)، ويوزّع نداءاتِ الأدوات عبر [سجل الأدوات](tools.ar.md) (`ctx.tools`)، ويُلحق كلَّ حقيقة يراها النموذجُ بالسجل قبل أن تشتق الخطوةُ التالية منه. أما مفرداتُ المحادثة التي تحرّكها الحلقةُ — `Message` و`ContentBlock` و`StreamChunk` وطلبُ النموذج — فتعلنها [`packages/llm`](../../packages/llm/README.ar.md) وتوثّقها [llm-streaming.md](llm-streaming.ar.md).

| الحزمة | تملك | الصفحة |
|---|---|---|
| `session/` | سجلَّ `SessionEvent` ذا الإلحاق فقط والمخزنَ في الذاكرة — وهو مصدرُ الحقيقة الوحيد (`ctx.sessions`) | [session.md](session.ar.md) |
| `system-prompt/` | تجميعَ أقسام المطالبة وschemas الأدوات (`ctx.systemPrompt`) | [system-prompt.md](system-prompt.ar.md) |
| `tools/` | سجلَّ الأدوات المنطاقي ومسارَ التنفيذ المحروس (`ctx.tools`) | [tools.md](tools.ar.md) |
| `agent/` | واجهةَ `Agent`، والسجلَّ الحي، ونطاقَ المُبادر، ومفرداتِ أحداث `agent/*` (`ctx.agents`) | هذه الصفحة |
| `agent-loop/` | القائدَ الملموس الذي ينفّذ عقدَ `Agent` العلني (`ctx.agentLoop`) | هذه الصفحة |
| `scope/` | بدائيةَ التسجيل المنطاقية التي تبني عليها السجلاتُ والحلقةُ النطاقَ لكل وكيل | [scope.md](scope.ar.md) |

و`scope/` هي الحزمةُ الوحيدة التي ليست خدمة: مكتبةٌ بلا توابع (`createScope` و`scopeOf` و`scopeTarget`) تقع تحت `session/` و`system-prompt/` في رسم الوحدات بالضبط ليستطيعا استهلاكَها بلا دورة. و`agent-loop` هو التنفيذُ الملموس الوحيد لعقد `Agent` العلني ويعيش هنا لأنه حلقةُ المنتَج الافتراضية في الحزام؛ وهو يشغّل كلَّ قائد داخل `ctx.agents.withInitiator()`. وتعتمد إضافاتُ التوسعة على `agent` — بما في ذلك حين تحتاج إلى الوكيل المُبادر — ولا تعتمد على `agent-loop` مباشرةً قط، فتبقى الحلقةُ قابلةً للاستبدال. و[`dsh-base`](../../packages/bundle/base/README.ar.md) تركيبُ المنتَج الافتراضي، بينما تعلن [`dsh-sdk-minimal`](../../packages/bundle/sdk-minimal/README.ar.md) شجرةً مستقلة أصغر.

## الإنشاء والملكية

ينشئ المستهلكون وكلاءَ عبر `ctx.agents` — فـ`create()` يبني جلسةً ووكيلًا جديدين تحت `SessionId` واحد يقدّمه المستدعي، و`resume()` يحمّل جلسةً محفوظة أولًا — أو تصريحيًّا عبر مداخل ضبط الحلقة. ويعيد الإنشاءُ البرمجي مقبضَ المالك:

المصدر: [`packages/core/agent/src/index.ts`](../../packages/core/agent/src/index.ts)

```ts type-equiv
/**
 * An owned agent plus its disposer, returned by {@link AgentRegistry.create} /
 * {@link AgentRegistry.resume}. The disposer is a CAPABILITY: among consumers,
 * only the holder can tear this agent down. The registered factory provider is
 * also a structural owner because the scoped agent depends on that provider's
 * service API; provider unload stops and drains every live handle it made.
 * `dispose()` stops the loop, awaits its exit, unregisters the agent, removes
 * its session from the store, and finally unwinds its scoped world.
 *
 * `ctx.agents.get(id)` still returns a bare {@link Agent} — the handle is
 * exposed only to the consumer owner that created it; the structural provider
 * reaches the same teardown internally. Config-created agents (the loop's own
 * startup) are owned by the loop fiber and never need a handle.
 */
interface AgentHandle {
  agent: Agent
  dispose(): Promise<void>
}
```

ويحمل `CreateAgentOptions` الهويةَ المشتركة وكلَّ ما يحتاجه وكيلٌ جديد قبل النشر: `parentAgent` حيًّا اختياريًا، وبياناتِ الجلسة الوصفية (`meta` — `cwd` متحقَّقًا منه، ونسبَ التفريع، وواسمَ `isSeeded`، وتصنيفَ المنشأ، وعمقَ التفويض، و`agentPreset`)، وقطعَ التفريع بعينه في الحقل الشقيق `inheritedEventCount`، وبادئةَ إعادة تشغيل `seed` اختيارية، و`AgentOptions` لكل وكيل، وإشارةَ إلغاء `signal` خاصة بالإنشاء، و`setup`. و`ResumeAgentOptions` نظيرُه للهوية المحفوظة: `resumeSessionId` و`parentAgent` و`agentOptions` و`signal` و`setup`. ويتلقى ردُّ نداء `setup` (وهو `AgentSetup`) الزوجَ `(agentCtx, agent)` بينما المعرّفان لم يُنشرا بعد: فالسياقُ يملك التسجيلاتِ المنطاقية، بينما يقدّم الوكيلُ الصريح جلسةَ الابن بعينها بلا خاصية عكسية على السياق. وكلُّ ما يُسجَّل عبر `agentCtx` يوجد قبل `agent/created` وقبل أول تجميع مطالبة. وقد يعيد الإعدادُ إيداعًا متزامنًا يُستدعى قبل النشر مباشرةً؛ ويتراجع عن المعاملة رفضُ الإعداد أو رميُ الإيداع أو تخلصُ المالك بلا نشر أي من المعرّفين.

و`AgentFactory` هي واجهةُ الإنشاء خلف السجل: فتسجّل الحلقةُ مصنعَها عبر `ctx.agents.setFactory()`، فيستعمل المستهلكون `ctx.agents` بلا اعتماد على حزمة الحلقة الملموسة. ويضبط منشئُ ابن في وقت التشغيل `options.parentAgent`؛ ويمرّر السجلُّ الخياراتِ وسياقَ المستدعي إلى المصنع بلا اشتقاق أحدهما من الآخر. وتوقيعا `create` و`resume` بعينهما وعقودُ التراجع في [القسم المولَّد](#ctxagents--agentregistry) أدناه.

## مقبض الوكيل

`Agent` هو السطحُ الذي تبرمج عليه كلُّ إضافة (واجهةً كانت أو خطّافات أو منسّقات)؛ ويعيده `ctx.agents.get(id)`، ويحمله [نطاق المُبادر](#initiating-agent). والتنفيذُ الملموس داخليٌّ في حزمة dsh-agent-loop؛ ولا يعتمد عليه شيءٌ خارجها. وتكشف طريقةُ `send` الموحَّدة توجيهَ الهدف والإيقاظ مباشرةً؛ و`followup` و`steer` و`inject` أسماءٌ بديلة بإعدادات ثابتة.

المصدر: [`packages/core/agent/src/types.ts`](../../packages/core/agent/src/types.ts)

```ts type-equiv
/** Public live-agent handle; the runtime face augments its live capabilities. */
interface Agent {
  /** Session-backed Agent identity. */
  readonly id: SessionId
  /** The provider route and model this agent's requests use. */
  readonly options: AgentOptions
  /** The live session this agent drives; its log is the durable source of truth. */
  readonly session: Session
  /** Agent-owned access to durable pending work. */
  readonly inbox: Inbox
  /** The current lifecycle state, mirrored on every `agent/status` transition. */
  readonly status: AgentStatus
  /** Agent-scoped context; its contributions are agent-local, unwind on disposal, and reject registration afterward. */
  readonly ctx: Context

  /**
   * Clear queued and steering work — unless `keepInbox` — and abort the active
   * turn or between-turn task. The first cause wins for that activity. With no
   * active activity, cancellation is a no-op and does not arm later work.
   * @param cause - the stable caller intent carried by the active operation signal.
   * @param options - cancellation options; `keepInbox` preserves pending work.
   */
  cancel(cause: AgentCancelCause, options?: CancelOptions): void

  /**
   * Resolve after the current whole-agent activity reaches quiescence. This
   * follows replacement work started before the observed driver retires,
   * but does not identify the settlement of any particular message.
   * @returns fulfillment after no active driver or maintenance task remains.
   */
  whenIdle(): Promise<void>

  /**
   * Run one non-turn maintenance task from the true idle phase. The task starts
   * synchronously after claiming that phase; later waking input remains in the
   * inbox until the task settles, while public status stays `idle`.
   * `whenIdle()` follows both the task and any waking work released behind it.
   * @param task - operation whose fulfillment or rejection is preserved, with a signal aborted by {@link cancel}.
   * @throws synchronously when turn-driving or another maintenance task already owns the agent.
   * @returns the task promise.
   */
  runMaintenance<T>(task: (signal: AbortSignal) => Promise<T>): Promise<T>

  /**
   * Route identified input to an inbox boundary and optionally wake the driver.
   * Waking input submitted after active cancellation is queued for the next
   * turn and runs when the aborted activity converges to idle; a `disposed`
   * cancel leaves it parked. A wake submitted while already idle always opens
   * its turn boundary, even when its message is cleared before the driver
   * claims ([cancel-convergence wake latch](../../../../.agents/notes/implemented/bug-fix/2026-08-07-cancel-convergence-wake-latch.md)).
   * @param message - identified content and the source that supplied it.
   * @param target - the preferred next-turn or next-step inbox boundary.
   * @param wakeup - whether delivery may wake the driver.
   */
  send(message: UserMessage, target: InboxTarget, wakeup: boolean): void

  /**
   * Queue an ordinary follow-up turn and wake the driver. The item becomes the
   * sole ordinary message of its own turn.
   * @param message - identified prompt content and the source that supplied it.
   */
  followup(message: UserMessage): void

  /**
   * Submit steering for the nearest step. An idle driver starts a turn;
   * a running driver consumes it at its next step boundary.
   * A rejected step leaves steering parked in the inbox until the next
   * wake; cancellation or disposal may discard pending steering.
   * @param message - identified steering content and the source that supplied it.
   */
  steer(message: UserMessage): void

  /**
   * Queue model-facing context for the next pre-step without waking the
   * driver. A running driver claims it at the nearest later step boundary;
   * idle drivers leave it pending until follow-up or steering
   * wakes them. It may miss a request whose pre-step already claimed its
   * batch. Cancellation or disposal may discard pending context.
   * @param message - identified injected context and the source that supplied it.
   */
  inject(message: UserMessage): void
}
```

```ts type-equiv
/**
 * An agent's lifecycle state, emitted on every transition as `agent/status`:
 * `idle` means no driver is active; `running` begins when waking input starts
 * cancellable pre-step processing and lasts while the driver drains,
 * closes, or checkpoints turns. Disposal removes the agent from its registry;
 * it is not a third observable status.
 */
type AgentStatus = 'idle' | 'running'
```

```ts type-equiv
/** One process-local live assistant streaming publication. */
type AssistantStreamFrame =
  | {
    readonly type: 'start'
    readonly attemptId: LlmAttemptId
    /** Monotone within one attached Agent lifecycle; replacement restarts at 1. */
    readonly revision: number
    readonly turn: number
    readonly step: number
  }
  | {
    readonly type: 'chunk'
    readonly attemptId: LlmAttemptId
    readonly revision: number
    /** Dense zero-based position within the attempt. */
    readonly index: number
    /** Safe-integer timestamp reused by the durable embedded stream. */
    readonly time: number
    readonly chunk: StreamChunk
  }
  | {
    readonly type: 'end'
    readonly attemptId: LlmAttemptId
    readonly revision: number
    /** Number of chunk frames emitted by this attempt. */
    readonly index: number
    /** Durable settlement committed before this notification, or live abandonment without one. */
    readonly outcome:
      | {
        readonly kind: 'committed'
        readonly eventType: 'assistant/message' | 'assistant/attempt'
        readonly seq: SessionSeq
      }
      | { readonly kind: 'abandoned' }
  }
```

و`running` تصف فترةَ تصريف القائد كلَّها وقد تمتد على جولات مصطفّة متتالية؛ وهي لا تثبت أن جولةً ما زالت مفتوحة. ويزيل التخلصُ الوكيلَ من السجل ويُطلق `agent/disposed`؛ وهو ليس قيمةَ حالة نهائية. ولا يعيد `followup()` مقبضًا: فـ`MessageId` لديه يحدد حقائقَ الإدراج الدائم في صندوق الوارد والادعاءِ والإهمال، لا خرجَ مساعد لاحقًا ولا نهايةَ جولة. ويراقب `whenIdle()` الوكيلَ كلَّه، فلا يسمّي المستدعون فترةً من الإيصال إلى الخمول تشغيلةً إلا حين يملكون تلك الفترةَ صراحةً ([القرار](../../.agents/notes/implemented/architecture/2026-07-30-followup-enqueue-and-owned-runs.ar.md)).

```ts type-equiv
/** Merge-extensible agent creation options. Persona belongs to system-prompt sections. */
interface AgentOptions {
  /** Provider route (must have a registered adapter at call time). */
  provider?: string
  /** Model id interpreted by the selected provider adapter. */
  model?: string
  /** Adapter-owned reasoning effort for the selected provider/model route. */
  reasoningEffort?: ReasoningEffortId
  /** Maximum output tokens for each conversation-model request. */
  maxTokens?: number
}
```

ويشترط التوزيعُ `provider` و`model` بعد `agent/request`. ويبذر `reasoningEffort` صريحًا أولَ طلب على ذلك المسار؛ ويتحقق حلُّ النموذج بعينه منه، بينما يتيح إغفالُه تجسّدَ افتراض المهايئ. و`maxTokens`، حين توجد، يجب أن تكون عددًا صحيحًا موجبًا آمنًا وتسقّف كلَّ طلب نموذج محادثة؛ وإغفالُها يتيح تجسّدَ افتراض مهايئ النموذج بعينه قبل ترويسة الطلب، وإلا ترك سلوكَ المزوّد كما هو. وقد يحجب قسمُ مطالبة `deployment:persona-prefix` المحدود بالوكيل الشخصيةَ الافتراضية العامة.

وصندوقُ الوارد هو مفرداتُ التسليم — قائمتا رسائل معلَّقة مرتَّبتان يملكهما الوكيلُ إسقاطًا دائمًا:

```ts type-equiv
/** Agent-owned access to pending work; concrete storage belongs to the driver. */
interface Inbox {
  /** Prompts awaiting individual turns. */
  readonly nextTurn: readonly UserMessage[]
  /** Input awaiting the next step boundary. */
  readonly nextStep: readonly UserMessage[]

  /** Durably cancel all pending input, clearing next-step before next-turn. */
  clear(): void

  /**
   * Append one message to a pending list.
   * @param target - pending list to extend.
   * @param message - message to append.
   */
  append(target: InboxTarget, message: UserMessage): void

  /**
   * Prepend one message to a pending list.
   * @param target - pending list to extend.
   * @param message - message to prepend.
   */
  prepend(target: InboxTarget, message: UserMessage): void

  /**
   * Replace one pending message in place.
   * @param messageId - identity of the pending message to replace.
   * @param newMessage - replacement message.
   * @returns whether the message was still pending.
   */
  replace(messageId: MessageId, newMessage: UserMessage): boolean

  /**
   * Remove one pending message.
   * @param messageId - identity of the pending message to remove.
   * @returns whether the message was still pending.
   */
  remove(messageId: MessageId): boolean

  /**
   * Apply standard splice semantics and durably record the normalized result.
   * @param target - pending list to mutate.
   * @param start - splice position.
   * @param deleteCount - maximum number of messages to remove.
   * @param inserted - messages to insert at the resolved position.
   * @returns messages removed by the splice.
   */
  splice(
    target: InboxTarget,
    start: number,
    deleteCount: number,
    inserted: UserMessage[],
  ): UserMessage[]
}
```

```ts type-equiv
/** One of the two ordered pending-message lists owned by an agent. */
type InboxTarget = 'next-turn' | 'next-step'
```

وكلُّ مناسبة معلَّقة هي `UserMessage` الخاصة بها؛ و`MessageId` هو الهويةُ الوحيدة. وتسجّل طرائقُ `Inbox` البنيوية تغييراتِ `agent/inbox/spliced` الدائمة الموحَّدة وترفض المعرّفاتِ المعلَّقة المكررة. ويحدد `replace(messageId, newMessage)` و`remove(messageId)` الرسالةَ المعلَّقة عبر القائمتين؛ وقد يغيّر الاستبدالُ الهويةَ فيُطلق الرسالةَ القديمة مهمَلةً ثم الرسالةَ الجديدة مدرَجةً. والإزالاتُ المعتادة و`clear()` إلغاءات. وعند حدّ خطوة، يزيل `ReactLoopInbox` الداخلي في dsh-agent-loop الدفعةَ المقترحة — كلَّ مُدخَل `next-step`، ومعه عند حدّ جولة رسالةَ `next-turn` واحدة — بتشريحات حذف نقية بلا إشعارات إهمال، ثم يُطلق إشعاراتِ ادعاء لكل رسالة. وكشفُ المعلَّق وادعاؤه الخاصان بالحلقة ليسا من `Agent.inbox`. وتسجّل خدمةُ `AgentLoop` إسقاطَ `inbox` القياسي قبل نشر مصنعها؛ وخليتُه هي الحالةُ الحية الوحيدة، ويخدم الطيُّ نفسُه المستهلكين الباردين ولو لم يوجد وكيل. ويرفض الطيُّ إحداثياتِ التشريح غيرَ الآمنة أو الخارجة عن المدى والهوياتِ المكررة عبر القائمتين، ويحدد التاريخَ الدائم المشوَّه برقم تسلسل حدثه. ويستعمل المستهلكون الذين يتابعون رسالةً واحدة إشعاراتِ `agent/inbox/inserted` و`claimed` و`discarded` بعينها.

والإلغاء:

```ts type-equiv
/** Options for {@link Agent.cancel}. */
interface CancelOptions {
  /**
   * Preserve queued and steering inbox items instead of discarding them. The
   * active turn is still aborted, but un-started and pending work survives for a
   * later turn and no canceled inbox splice is logged.
   */
  keepInbox?: boolean | undefined
}
```

```ts type-equiv
/** Why an active agent driver was cancelled. */
type AgentCancelCause =
  | { readonly kind: 'user' }
  | { readonly kind: 'parent' }
  | { readonly kind: 'hook'; readonly reason: string }
  | { readonly kind: 'disposed' }
```

والسببُ مُدخَلٌ داخل العملية يفرضه TypeScript. وينسخه حاملُ إلغاء نشط في `AbortSignal.reason` المقتصر على وقت التشغيل؛ ولا تمنح الإشارةُ المستمعين المتعاونين سلطةَ تصنيف. ويسجّل `turn/end` الدائم الحصيلةَ بالصيغة `{ kind: 'aborted', reason: TurnEndCancelCause }`، فيحطّ سببُ الإلغاء في النتيجة النهائية.

ويملك [تصنيف الأحداث](../architecture.ar.md#events) عقودَ دورة حياة `agent/*` ونقاطِ التفتيش والشلالات. وحدودُ الجولات والخطوات أحداثُ جلسة دائمة لا إطلاقاتُ وكيل.

<a id="initiating-agent"></a>

## الوكيل المُبادر

المُبادرُ المحلي في العملية الذي يحمله `ctx.agents` هو `Agent` بعينه أعلاه، لا إطارٌ منفصل ولا هويةٌ منسوخة. والحضورُ المحيط ليس دليلَ حياة ولا تخويلًا؛ ويعرّف [قرار نطاق المُبادر](../../.agents/notes/implemented/architecture/2026-07-15-agent-initiator-scope.ar.md) عمرَه وقواعدَ نطاقه.

## قرارات الاعتراض

تستعمل قراراتُ ما قبل الخطوة نوعَ `UserMessage` المعرَّف نفسَه الذي يستعمله المُدخَلُ الدائم بدور المستخدم. والدفعةُ الداخلة هي المرجع وتحفظ `id` و`source` لكل رسالة. وتربط جسورُ الخطّافات حقولَ قراراتها الأصيلة بهذه النتيجة المنوَّعة.

المصدر: [`packages/core/agent/src/types.ts`](../../packages/core/agent/src/types.ts)

ويتلقى `agent/pre-step` حمولةً واحدة تحمل الدفعةَ المدّعاة حصريًّا (`messages`)، وإحداثياتِ الخطوة المقترحة (`turn` و`step`)، وإشارةَ إلغاء الجولة الحالية `signal`. ويعمل الاقتراحُ الأول داخل جولة مفتوحة قبل أي خطوة؛ وقد تقدّم متابعةُ أداة دفعةً مدّعاة فارغة بين الخطوات:

وهو يعيد `PreStepDecision`. والرفضُ لا يفتح خطوةً. والدخولُ يقدّم دفعةَ الرسائل كاملةً تُلحق بعد `step/start`؛ وتبقى الرسائلُ المدّعاة التي يُغفلها القرارُ النهائي مزالةً، بينما يبقى المُدخَلُ المدرَج بعد الادعاء معلَّقًا:

```ts type-equiv
/** Whether and with which messages the loop enters a proposed step. */
type PreStepDecision =
  | { kind: 'reject' }
  | {
    kind: 'enter'
    messages: UserMessage[]
    /** Start a distinct model-message series before this step's admitted messages. */
    startsRequestSeries?: true
  }
```

ويعمل `agent/request-error` بعد إغلاق خطوة نموذج فاشلة وقبل إغلاق جولتها. ويستطيع المستمعون إصلاحَ حالة دائمة أو انتظارَ عمل سياسة ما دامت إشارةُ الجولة الفاشلة حية. ويعيد المستمعُ المعالِج `{ kind: 'retry' }` بلا نداء `next()`؛ ويُبقي الافتراضُ `undefined` الفشلَ نهائيًّا.

```ts type-equiv
/** Action returned by a listener that owns model-request recovery. */
type RequestErrorAction = { kind: 'retry' } | undefined
```

و`agent/pre-step` سلسلةُ مستمعي الشلال الوحيدة قبل اشتقاق الطلب. ويعمل `agent/turn-stopping` حين لا تكون للجولة متابعةُ أداة ولا متابعةُ توجيه، قبل تصريف توجيه نهائي واحد.

ويحمل `agent/created` قيمةَ `SessionStartSource` (وهي سببُ بدء دورة حياة الجلسة؛ ويفهرس جسرٌ مطابِقَ SessionStart عليها):

```ts type-equiv
/** Why a session lifecycle began; seeded creates are `startup`, while persisted loads are `resume`. */
type SessionStartSource = 'startup' | 'resume' | 'clear' | 'compact'
```

## الجلسات

`Session` هي **سجلٌّ ذو إلحاق فقط** من `SessionEvent` منوَّعة — وهي مصدرُ الحقيقة الوحيد. وتاريخُ رسائل LLM *مشتقٌّ* من السجل (`deriveMessages()`)، لا مخزَّنٌ على حدة. ويحمل كلُّ مدخل `seq` تصاعديًّا و`time` وحمولةَ `data` مميَّزةً بـ`type`؛ وقد تعدّد أشكالُ السطح أيضًا أحداثًا أسبق مذكورة في `sourceEventSeqs` وتحمل `surfaceOp`.

أما الحقولُ الشرطية بعينها في مغلّف `SessionEvent`، وأشكالُ الأحداث النواة الثلاثةَ عشر (`turn/start` و`turn/end` و`step/start` و`step/end` و`user/message` و`system/message` و`assistant/message` و`assistant/attempt` و`tool/call` و`tool/result` و`request/header` و`request/context` و`session/end-seed`)، وقواعدُ إسقاط `deriveMessages()`، وأسبابُ `TurnEndReason`، وقواعدُ إحاطة التنفيذ والأحداثِ المستقلة فعلى **[session.md](session.ar.md)**. وكيف يصير السجلُّ دائمًا — واجهةُ `SessionPersistence`، ومزوّدُ JSONL، ونقطةُ تفتيش `session/flush`، والتعافي من الانهيار، و`SessionHeader` — فعلى **[persistence.md](persistence.ar.md)**.

## `ToolDefinition`

هو نوعُ تأليف المسار الوحيد الذي هو من النواة: ما تكونه كلُّ أداة مسجَّلة — `ToolSchema` يراه النموذجُ مع دالة `execute` وردودِ نداء اختيارية للمحتوى النهائي وللواجهة. ونادرًا ما يبنيه مؤلفُ أداة بيده (فلغةُ `defineTool` تبنيه بوسائط منوَّعة)، لكنه العقدُ الذي يمسكه السجلُّ وتوزّع عبره الحلقة.

أما حقولُه كاملةً، ولغةُ schemas المنوَّعة `defineTool` و`ValueSchemaSpec` و`ParameterSchemaSpec`، وأنواعُ شلال `ToolExecution` و`ToolExecutionResult`، وأنواعُ عرض الأدوات في الواجهة فعلى **[tools.md](tools.ar.md)**.

## أنماط الأنواع في المستودع كله

يتكرر نمطان عبر كل نظام، وهما موثَّقان مرةً واحدة هنا.

<a id="the-map--derived-union-pattern"></a>

### نمط «`…Map` ← اتحادٌ مشتق»

يتبع كلُّ نوع مجموع قابل للتوسعة في الحزام تقريبًا نمطًا واحدًا: واجهةٌ مفهرَسة بوسم مميِّز (وهي `…Map`)، يُشتق منها الاتحادُ بـ`keyof`. وتضيف الإضافاتُ أشكالًا بـ**دمج التصريحات** — بلا تعديل الحزمة المالكة.

```ts ignore-check
// The pattern, schematically:
interface ThingMap {
  'a': { kind: 'a'; /* … */ }
  'b': { kind: 'b'; /* … */ }
}
type ThingKind = keyof ThingMap          // 'a' | 'b'
type Thing = ThingMap[keyof ThingMap]    // the discriminated union

// A plugin extends it without touching the source package:
declare module '@deepseek-ai/dsh-llm' {
  interface ThingMap {
    'c': { kind: 'c'; /* … */ }
  }
}
```

وتستعمل خمسُ خرائط معيارية هذا النمطَ؛ ويوسّعها مؤلفُ الإضافة:

| الخريطة | الحزمة | تشتق | الدليل |
|---|---|---|---|
| `ContentBlockMap` | dsh-llm | `ContentBlock` | [llm-streaming.md](llm-streaming.ar.md#content-blocks-and-messages) |
| `MessageSourceMap` | dsh-llm | `MessageSource` | [llm-streaming.md](llm-streaming.ar.md#content-blocks-and-messages) |
| `FinishReasonMap` | dsh-llm | `FinishReason` | [llm-streaming.md](llm-streaming.ar.md#the-model-request-and-result) |
| `TurnEndReasonMap` | dsh-session | `TurnEndReason` | [session.md](session.ar.md) |
| `SessionEventMap` | dsh-session | `SessionEvent` | [session.md](session.ar.md) |

واتحادان مميَّزان كبيران هما الأكثرُ تفريعًا لدى المستهلكين بـ`switch`: **`StreamChunk`** (بروتوكولُ البث) و**`SessionEvent`** (مدخلُ السجل). وبحسب عرف المستودع، فرِّع على الوسم بـ`switch` — لا تسلسل `if` — فيضيّق كلُّ فرع النوعَ ويفشل وسمٌ مكتوب خطأً عند الترجمة.

<a id="branded-ids"></a>

### المعرّفات الموسومة

المعرّفاتُ الممرَّرة بين الحزم **موسومة** — فهي سلاسلُ بنيويًّا لكنها غيرُ قابلة للتبادل على مستوى الأنواع (فلا يُمرَّر `SessionId` حيث يُتوقع `ToolCallId`). ويستعمل الإنشاءُ المساعدَ المشترك `brandString<T>()` أو مصنعًا متحققًا يعرّفه المالك؛ وتتصرف المقارنةُ والتسجيلُ وJSON تصرفَ السلاسل العادية.

وتعيش بدائيةُ `Branded<B>` والبانيُ عديمُ الحالة في [dsh-brand](../../packages/util/brand)، التي لا تابعةَ قدرة حزام لها. ويطبّق `brandString<T>()` علامةَ سلسلة عند الترجمة وحدها.

المصدر: [`packages/util/brand/src/index.ts`](../../packages/util/brand/src/index.ts)

```ts type-equiv
/** A string carrying a compile-time-only brand `B`. */
type Branded<B extends string> = string & { readonly [BRAND]: B }
```

والمعرّفان النواةُ هما `ToolCallId` (يربط نداءَ أداة بنتيجته؛ في dsh-llm) و`SessionId` (هويةُ الوكيل الحي والجلسة الدائمة المشتركة؛ في dsh-session). وتَسِم حزمُ القدرات معرّفاتِها أيضًا، مثل `JobId` في [jobs.md](jobs.ar.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxagentdefaultmodel--agentdefaultmodelconfig"></a>

### `ctx.agentDefaultModel` — `AgentDefaultModelConfig`

Owns the default model selection independently of any Host or transport. The composition entry remains usable without a settings provider; when one is mounted, its user layer is read live.

```ts cordis-catalog
/**
 * Read the current default model selection.
 * @returns a detached provider, model, and optional reasoning selection.
 */
currentSelection(): ModelSelection

/**
 * Save the complete default model selection. A deployment without a settings
 * provider keeps its composition entry.
 * @param next - resolved selection accepted by an entry point.
 * @returns fulfillment after the optional settings write settles.
 */
async saveSelection(next: ModelSelection): Promise<void>
```

Source: [`packages/core/agent-default-model/src/index.ts`](../../packages/core/agent-default-model/src/index.ts)

<a id="ctxagentloop--agentloop"></a>

### `ctx.agentLoop` — `AgentLoop`

Concrete agent factory and driver service.

```ts cordis-catalog
/**
 * Create an agent and session under one caller-supplied identity, owned by
 * the accessing fiber. Constructor-driven config calls mint a fresh combined
 * id before entering this boundary. When a persistence backend is mounted,
 * the session's durable identity and any seed are stored before publication.
 * @param id - shared agent/session identity.
 * @param options - concrete loop options.
 * @param meta - optional fresh-session workspace metadata.
 * @returns the published running agent.
 */
async create(id: SessionId, options: AgentOptions = {}, meta: Pick<SessionHeader, 'cwd'> = {}): Promise<Agent>

/**
 * Create an owned agent on a caller-supplied session id.
 * @param ownerCtx - caller context that structurally owns the lifecycle.
 * @param options - identities, optional live parent, session seed/metadata, loop options, setup, and cancellation.
 * @returns the published handle.
 */
async createAgent(ownerCtx: Context, options: CreateAgentOptions): Promise<AgentHandle>

/**
 * Resume an owned agent from the configured persistence service.
 * @param ownerCtx - caller context that owns load, setup, and the live lifecycle.
 * @param options - persisted identity, optional live parent, loop options, setup, and cancellation.
 * @returns the published handle.
 */
async resume(ownerCtx: Context, options: ResumeAgentOptions): Promise<AgentHandle>
```

Types: [SessionHeader](persistence.ar.md)

Source: [`packages/core/agent-loop/src/index.ts`](../../packages/core/agent-loop/src/index.ts)

<a id="ctxagentpresets--agentpresets"></a>

### `ctx.agentPresets` — `AgentPresets`

Registry over the deployment's agent presets.

Discovery is unmemoized: `list()` and `resolve()` re-read the roots on every call so a preset authored while the process runs is visible immediately, and a preset deleted underneath a picker disappears from the next read.

```ts cordis-catalog
/**
 * Every preset the configured roots currently supply.
 * @returns the presets, first-root-wins per id.
 */
async list(): Promise<AgentPreset[]>

/**
 * The roster off the Host: {@link list} projected to path-free rows, with
 * the policy-effective default marked, this deployment's authoring
 * capability, and its mode-selection policy beside it.
 *
 * Whether a client can open a preset's directory is the Host's own opener
 * capability, not a roster property — a caller needing both joins them.
 * @returns the rows, authoring capability, and effective selection policy.
 */
@Remote('list') async remoteExportList(): Promise<AgentPresetRoster>

/**
 * Every preset's composition as flattened plugin rows, for plugin-listing
 * surfaces beside the roster's own picker.
 *
 * A preset with a live standing mount answers from its newest generation's
 * Loader entries — the composition new sessions join — even when the file
 * behind it has since been edited into an unreadable state: the mount is
 * what sessions actually run, so the broken verdict only applies to a
 * preset nothing composed. One never composed since boot answers from its
 * file, with `!!js` disabled gates evaluated against the Loader context so
 * both answers reflect the same host. Reading never mounts: an unmounted
 * preset is parsed, not composed, so listing a preset's plugins cannot
 * activate them early. A composition that stopped reading between
 * discovery's health verdict and this read is reported broken with the
 * raced reason rather than dropped.
 * @returns one composition per roster preset, in roster order.
 */
async compositionInventory(): Promise<AgentPresetComposition[]>

/**
 * Resolve one preset by id.
 *
 * A broken preset resolves — deleting one, reading one, and reporting one
 * all need the row — and the mounting paths refuse it AFTER resolution
 * through {@link resolveMountable}.
 * @param id - the preset id, or `undefined` for {@link defaultId}.
 * @returns the resolved preset.
 * @throws when no configured root supplies that id.
 */
async resolve(id?: string): Promise<AgentPreset>

/**
 * Compose one agent from a preset: ensure the preset's standing mount, then
 * parent the agent's scope key to it so the mount's registrations and
 * listeners cover this agent.
 *
 * Call from the agent factory's `setup(agentCtx)`; a rejection there rolls
 * the agent creation back, so a broken preset never yields a half-composed
 * session.
 * @param agentCtx - the agent's scope context.
 * @param id - the preset id, or `undefined` for {@link defaultId}.
 * @returns the preset that was composed, for the caller to record.
 * @throws when the preset is unknown or its composition is unusable.
 */
async mount(agentCtx: Context, id?: string): Promise<AgentPreset>

/**
 * Join one agent to the SAME standing composition another already runs on.
 *
 * This is how a child agent inherits its parent's capabilities. It is a bind,
 * not a mount: the parent's generation is already composed, so the child gets
 * that exact instance — the same plugin objects, the same tool registrations,
 * the same prompt sections. Re-resolving the parent's preset by id instead
 * would re-read the roster, and a composition file edited since the parent
 * started would hand the child a DIFFERENT generation than the one its
 * parent's history was produced under (and a preset deleted since would fail
 * the child outright while its parent keeps running).
 *
 * Synchronous, and with no composition failure mode of its own — it reads no
 * roster, mounts nothing, and touches no file — which is what lets a child
 * creation window use it: the two in-process subagent drivers compose their
 * children inside a synchronous `setup`. It still rejects a caller error, as
 * the `@throws` below record.
 *
 * A parent that joined no preset — a rosterless deployment — yields no join
 * and no error: there, the model-facing rows sit in the host composition and
 * the child already sees them through the global layer.
 * @param agentCtx - the joining agent's scope context.
 * @param parentCtx - the scope context of the agent whose composition to join.
 * @returns the preset id joined, or undefined when the parent joined none.
 * @throws when `agentCtx` carries no scope, or has already joined a preset.
 */
composeFrom(agentCtx: Context, parentCtx: Context): string | undefined

/**
 * The preset one live agent runs on.
 *
 * Read from the live scope chain rather than from the session, so it answers
 * for an agent whose session has not recorded a preset yet — a child agent
 * whose durable header is being built from its parent's composition.
 * @param agentCtx - the agent's scope context.
 * @returns the preset id, or undefined when the agent joined none.
 */
composedPreset(agentCtx: Context): string | undefined

/**
 * Read one preset's composition text.
 * @param id - the preset id.
 * @returns the composition exactly as stored.
 * @throws when no configured root supplies that id.
 */
async read(id: string): Promise<string>

/**
 * One preset's composition text with the roster row it belongs to.
 * @param agentPreset - the preset id.
 * @returns the composition beside its trust and published metadata.
 * @throws {RemoteError} `gateway/bad-request` for an empty id, or
 * `agent-preset/not-found` when no configured root supplies it.
 */
@Remote('read') async readDocument(agentPreset: string): Promise<AgentPresetDocument>

/**
 * Create a locally authored preset by copying an existing one whole.
 *
 * Copy is the only authoring write. Composition text never crosses this
 * seam: the source is named by id and its directory is copied as it stands,
 * so the copy is exactly as loadable as its source and authoring grants no
 * capability the roster did not already carry. The copy is NOT mounted to
 * validate — a source that mounts today yields a copy that mounts today.
 * @param from - the preset the copy starts from; shipped presets are the
 * primary source, so any trust is accepted.
 * @param id - the new preset's id, which becomes its directory name.
 * @param name - display name for the copy; absent falls back to the id.
 * @throws when the source is unknown, the id is unusable or already taken,
 * or the deployment configures no writable root.
 */
async copy(from: string, id: string, name?: string): Promise<void>

/**
 * Copy one preset through the Remote API.
 * @param from - the source preset id.
 * @param id - the new preset id.
 * @param name - the copy's optional display name.
 * @returns once the copy is stored.
 * @throws {RemoteError} with the corresponding stable preset code and
 * details when the copy is refused.
 */
@Remote('copy') async remoteExportCopy(from: string, id: string, name?: string): Promise<void>

/**
 * Delete a locally authored preset.
 *
 * @param id - the preset id.
 * @throws when the preset is unknown or ships with the deployment.
 */
async remove(id: string): Promise<void>

/**
 * Delete one preset through the Remote API.
 * @param id - the preset id.
 * @returns once the preset is deleted.
 * @throws {RemoteError} with the corresponding stable preset code and
 * details when deletion is refused.
 */
@Remote('deletePreset') async remoteExportDelete(id: string): Promise<void>

/**
 * One agent's instance of a service its preset mounted.
 *
 * A preset publishes services behind `isolate` realms, which are invisible
 * outside the group that declares them — including to the host. This is how a
 * caller holding the agent reads one anyway: a request that is ABOUT a
 * session but arrives from outside it, which is every browser RPC.
 *
 * Read addressing only. A host row that `inject`s a service cannot use this,
 * because injection resolves before any session exists and has no agent to
 * key by; such a service belongs on the host plane instead.
 * @param agent - the agent whose composition to look inside.
 * @param name - the service name as the preset's rows resolve it.
 * @returns the agent's instance, or undefined when its preset mounts none.
 */
serviceFor<K extends string & keyof Context>(agent: { ctx: Context }, name: K): Context[K] | undefined

/**
 * Re-link one agent to a different preset's standing composition.
 *
 * Only valid while the agent has produced nothing: swapping tools mid
 * conversation would leave logged tool calls the new composition cannot
 * make. The CALLER owns that check — this method does not read session
 * history.
 *
 * The swap is a parent re-link, not an unmount: standing mounts are shared
 * and permanent, so the old composition stays for its other agents and the
 * new one is ensured BEFORE the link moves. An unknown or unusable preset
 * therefore throws with the agent exactly as it was — there is no torn-down
 * state to restore. The re-link runs through the binding this roster kept
 * from the agent's mount — dsh-scope's only re-link authority. An agent
 * that never composed one has nothing to re-link: the switch is then the
 * agent's first bind, exactly a mount. A committed re-link emits
 * `tools/change` because changing the parent scope changes the Agent's
 * resolved tool set without adding or removing registry entries.
 * @param agentCtx - the agent's scope context.
 * @param id - the preset to compose the agent from instead.
 * @returns the preset now installed.
 * @throws when the preset is unknown or its composition is unusable.
 */
async recompose(agentCtx: Context, id: string): Promise<AgentPreset>

/**
 * Compose a blank session's agent from a different preset and record it.
 * @param agent - the session's live agent, resolved from the wire identity.
 * @param agentPreset - the preset to compose the agent from instead.
 * @returns the preset id that was recorded.
 * @throws {RemoteError} with `gateway/bad-request`, `agent-preset/locked`,
 * `agent-preset/not-found`, or `agent-preset/invalid` when refused.
 */
@Remote('select') async select(agent: Agent, agentPreset: string): Promise<string>

/**
 * The standing scope key of one preset, for a host reader with no agent.
 *
 * A cold transcript read resolves tool presenters against the composition
 * the session recorded, and the standing mount makes that possible without
 * resuming anything: ensuring the mount composes plugins but starts no
 * agent, no session, and no turn.
 * @param id - the preset id, or `undefined` for {@link defaultId}.
 * @returns the standing scope key readers pass as a registry view scope.
 * @throws when the preset is unknown or its composition is unusable.
 */
async standingKeyFor(id?: string): Promise<ScopeKey>
```

Types: [ScopeKey](scope.ar.md)

Source: [`packages/preset/agent-presets/src/index.ts`](../../packages/preset/agent-presets/src/index.ts)

<a id="ctxagents--agentregistry"></a>

### `ctx.agents` — `AgentRegistry`

Agent service (`ctx.agents`): tracks live agents and carries the initiating Agent through one process-local asynchronous driver chain. Agent *creation* is provided by whichever plugin implements the AgentFactory (`@deepseek-ai/dsh-agent-loop`), registered via setFactory.

Initiator methods provide same-process causal attribution only. Ambient presence is neither liveness proof nor authorization; subjects and owners remain explicit, as does identity at worker, process, persistence, and wire boundaries. Returned Promise boundaries drain during teardown, except a nested lineage that starts an owning-fiber unload is excluded from its own drain.

```ts cordis-catalog
/**
 * Read the Agent that initiated the inherited asynchronous driver chain.
 * Use this optional form for logging, tracing, metrics, or host attribution
 * that also supports agentless calls. When a parent creates a child, setup
 * reports the causal parent while the setup callback's Agent parameter
 * identifies the child.
 * @returns the inherited Agent, or `undefined` outside an initiator boundary
 *   and inside an explicit clearing boundary.
 * @throws when this service instance has been disposed.
 */
currentInitiator(): Agent | undefined

/**
 * Read the initiating Agent and fail when no initiator boundary is active.
 * Use this for private helpers contractually below a driver, or for a
 * deployment-owned outbound request whose contract forbids agentless calls.
 * Generic or direct-call paths use optional lookup or explicit request fields.
 * @returns the inherited Agent.
 * @throws when no initiator is active or this service instance has been disposed.
 */
requireInitiator(): Agent

/**
 * Run an operation with one exact Agent as its process-local initiator. The
 * exact synchronous value or Promise returned by the operation is preserved.
 * Custom drivers and test harnesses wrap their complete returned foreground
 * lifetime.
 * A queue or wire receiver may establish this boundary only after validating
 * explicit identity and resolving the exact live Agent; this method does neither.
 * Detached work remains owned by the subsystem that starts it.
 * @param agent - initiating Agent to inherit; presence is neither liveness proof nor authorization.
 * @param operation - synchronous or asynchronous operation to invoke.
 * @returns the exact value returned by `operation`.
 * @throws when the initiator scope is closing/disposed, or when `operation` throws.
 */
withInitiator<T>(agent: Agent, operation: () => T): T

/**
 * Run an operation inside a boundary that hides any inherited initiating
 * Agent. The exact synchronous value or Promise is preserved.
 * Use this while creating lazy shared timers, queue pumps, pool maintenance,
 * watchers, or exporters so they do not inherit the first Agent that happens
 * to initialize them. It clears only initiator attribution, not explicit
 * fields, and does not own or drain detached resources.
 * @param operation - synchronous or asynchronous operation to invoke without an initiator.
 * @returns the exact value returned by `operation`.
 * @throws when the initiator scope is closing/disposed, or when `operation` throws.
 */
withoutInitiator<T>(operation: () => T): T

/**
 * Register the agent-creation factory (the loop calls this on construction,
 * effect-scoped). A traced Cordis service is canonicalized to its concrete
 * target; each create/resume call is then traced through that caller's
 * context so ownership follows the caller without stacking proxy layers.
 * Throws if a factory is already registered. Returns the disposer; on
 * dispose the factory slot is cleared.
 * @param factory - the loop-owned factory {@link create}/{@link resume} delegate to.
 * @returns the disposer that clears the factory slot. The exact
 *   Cordis effect disposer (single-shot): composite (generator) effects may
 *   yield it directly — exact identity nests the teardown in order.
 */
setFactory(factory: AgentFactory): () => void

/**
 * Create and publish a new agent through the registered factory.
 * Distinct from {@link register} (which records an already-constructed
 * agent): this constructs the agent and its session. Rejects if no factory is
 * registered or creation/setup fails. The resolved {@link AgentHandle} lets
 * the owner tear down exactly this agent.
 * @param options - shared identity, optional live parent, session seed/metadata, and agent options.
 * @returns the handle after setup, rollback-covered publication, and loop start complete.
 */
async create(options: CreateAgentOptions): Promise<AgentHandle>

/**
 * Load a persisted session and resume an agent on it through the registered
 * factory. Rejects if no factory is registered; the factory rejects if
 * session persistence is not configured or persistence/setup fails.
 * @param options - persisted identity, optional live parent, configuration, and setup.
 * @returns the handle after setup, rollback-covered publication, and loop start complete.
 */
async resume(options: ResumeAgentOptions): Promise<AgentHandle>

/**
 * Register a live agent with source `startup`. Rejects if the id is already registered or a
 * serial `agent/created` listener fails. Emits `agent/disposed`
 * when the calling fiber is disposed — both with the agent's scope carrier
 * (`scopeTarget(agent, agent)`): the subject is the agent in hand, so the
 * emits are scope-filtered regardless of which context invoked `register`
 * (calling through `agent.ctx` scopes EFFECTS; dispatch scoping always
 * requires passing the carrier). The entry is a runtime root; factory-backed
 * creation uses `options.parentAgent` for child ownership. Await the registration before using the agent.
 * @param agent - the already-constructed agent to record in the store.
 * @returns the awaitable Cordis effect disposer (single-shot; a repeat call
 *   returns undefined without awaiting an in-flight teardown). Exact
 *   identity is load-bearing: a composite (generator) effect that owns a
 *   teardown ORDER — the agent factory's lifecycle chain — must yield THIS
 *   function so Cordis nests the unregistration at that yield position;
 *   yielding a wrapper would leave it disposing as a concurrent sibling on
 *   owner unload, unregistering the agent (and emitting `agent/disposed`)
 *   while its final turn is still draining.
 */
register(agent: Agent): ReturnType<Context['effect']>

/**
 * Insert an already-constructed agent without announcing it. This is the
 * advanced ordered-lifecycle primitive used by the async agent factory: it
 * first completes setup while the agent is unpublished, then assigns the
 * returned detach closure into its pre-installed composite teardown before
 * calling {@link announce}. Ordinary callers use {@link register}.
 * @param agent - the prepared, unpublished agent.
 * @param owner - explicitly supplied live runtime owner, or
 *   undefined for a top-level runtime root. This is runtime ownership, not
 *   the resumed session's durable parent lineage.
 * @returns an idempotent closure that removes this exact entry and emits
 *   `agent/disposed` with listener failures contained. When called from a
 *   `agent/created` listener, removal and disposal wait until the serial
 *   creation dispatch settles.
 */
enter(agent: Agent, owner: Agent | undefined): () => void

/**
 * Announce an agent previously inserted with {@link enter}.
 * @param agent - the live inserted agent to announce.
 * @param source - fresh creation, resume, clear, or compaction source.
 * @param signal - optional factory initialization cancellation signal passed to listeners.
 * @returns completion of the serial creation listeners; a listener failure rejects.
 * @throws if `agent` is not the exact live registry entry for its id, or its
 *   creation announcement already began (including a reentrant call from a
 *   creation listener).
 */
async announce(agent: Agent, source: SessionStartSource, signal?: AbortSignal): Promise<void>

/**
 * Look up a live agent.
 * @param id - the shared agent/session id to look up.
 * @returns the agent, or undefined when no live agent has that id.
 */
get(id: SessionId): Agent | undefined

/**
 * Test whether a live agent was created through one exact parent agent's
 * scoped context. Runtime ownership is independent of durable session
 * lineage and remains unambiguous when unrelated providers reuse an id.
 * @param id - the candidate child agent's shared agent/session id.
 * @param owner - the expected runtime creator agent.
 * @returns true only while the exact child entry is live under that owner.
 */
isOwnedBy(id: SessionId, owner: Agent): boolean

/**
 * All live agents, in registration order.
 * @returns a fresh array; mutating it does not affect the registry.
 */
list(): Agent[]

/**
 * All live top-level agents in registration order. A top-level agent was
 * created without an owning agent context; durable session lineage does not
 * affect this runtime relation, so a resumed fork may still be a root.
 * @returns a fresh array; mutating it does not affect the registry.
 */
roots(): Agent[]
```

Source: [`packages/core/agent/src/index.ts`](../../packages/core/agent/src/index.ts)

<a id="agent-events"></a>

### `agent/*` events

<a id="agentassistant-stream--emit"></a>

#### `agent/assistant-stream` — emit

Process-local assistant-stream publication. Chunk frames are transient; the loop appends one final v2 `assistant/message` or `assistant/attempt` with the same stream before a committed end frame.

```ts cordis-catalog
/**
 * Process-local assistant-stream publication. Chunk frames are transient;
 * the loop appends one final v2 `assistant/message` or `assistant/attempt`
 * with the same stream before a committed end frame.
 * @param payload.agent - the agent whose attempt produced the frame.
 * @param payload.frame - one ordered start, chunk, or end publication.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode emit
 */
'agent/assistant-stream'(this: Scoped<Agent>, payload: { agent: Agent; frame: AssistantStreamFrame }): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentcreated--serial"></a>

#### `agent/created` — serial

An entered agent is ready for per-agent initialization after factory setup. Listeners run in order and are awaited before creation resolves. AgentLoop holds queued input until all listeners finish. A throw or rejection fails creation and skips later listeners. Disposal retains the scope and session until dispatch settles; listeners must not await agent.whenIdle() or their own owner's disposal.

```ts cordis-catalog
/**
 * An entered agent is ready for per-agent initialization after factory setup.
 * Listeners run in order and are awaited before creation resolves. AgentLoop
 * holds queued input until all listeners finish. A throw or rejection fails
 * creation and skips later listeners. Disposal retains the scope and session
 * until dispatch settles; listeners must not await agent.whenIdle() or their
 * own owner's disposal.
 * @param payload.agent - the newly registered agent with its live session and completed setup.
 * @param payload.source - fresh creation, resume, clear, or compaction source.
 * @param payload.signal - factory initialization cancellation signal, when provided.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode serial
 */
'agent/created'(this: Scoped<Agent>, payload: { agent: Agent; source: SessionStartSource; signal?: AbortSignal }): undefined | Promise<undefined>
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentdisposed--emit"></a>

#### `agent/disposed` — emit

An agent left the registry; AgentLoop emits this after driver quiescence and scoped-registration unwind, but before session detachment. Custom registry users own their driver-ordering contract.

```ts cordis-catalog
/**
 * An agent left the registry; AgentLoop emits this after driver quiescence
 * and scoped-registration unwind, but before session detachment. Custom
 * registry users own their driver-ordering contract.
 * @param payload.agent - the exact agent removed from the registry.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode emit
 */
'agent/disposed'(this: Scoped<Agent>, payload: { agent: Agent }): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agenterror--emit"></a>

#### `agent/error` — emit

A step or turn errored. The machine reports a failure here even when the error has no in-turn position for a durable record.

```ts cordis-catalog
/**
 * A step or turn errored. The machine reports a failure here even when
 * the error has no in-turn position for a durable record.
 * @param payload.agent - the agent whose turn errored.
 * @param payload.turn - the turn in which the failure surfaced.
 * @param payload.step - the step at which the failure surfaced.
 * @param payload.error - the failure, verbatim.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode emit
 */
'agent/error'(this: Scoped<Agent>, payload: { agent: Agent; turn: number; step: number; error: unknown }): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentinboxclaimed--emit"></a>

#### `agent/inbox/claimed` — emit

One message left the inbox inside its open turn. If the proposed step is rejected, the claimed message ends here: it is neither discarded nor re-emitted as a user/message, and the turn closes without a step.

```ts cordis-catalog
/**
 * One message left the inbox inside its open turn. If the proposed step
 * is rejected, the claimed message ends here: it is neither discarded nor
 * re-emitted as a user/message, and the turn closes without a step.
 * @param payload.agent - the agent whose inbox changed.
 * @param payload.message - the claimed message.
 * @param payload.turn - the owning turn.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode emit
 */
'agent/inbox/claimed'(this: Scoped<Agent>, payload: { agent: Agent; message: UserMessage; turn: number }): void
```

Types: [Scoped](scope.ar.md) · [UserMessage](session.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentinboxdiscarded--emit"></a>

#### `agent/inbox/discarded` — emit

One message was discarded from the live inbox.

```ts cordis-catalog
/**
 * One message was discarded from the live inbox.
 * @param payload.agent - the agent whose inbox changed.
 * @param payload.message - the discarded message.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode emit
 */
'agent/inbox/discarded'(this: Scoped<Agent>, payload: { agent: Agent; message: UserMessage }): void
```

Types: [Scoped](scope.ar.md) · [UserMessage](session.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentinboxinserted--emit"></a>

#### `agent/inbox/inserted` — emit

One message entered the live inbox.

```ts cordis-catalog
/**
 * One message entered the live inbox.
 * @param payload.agent - the agent whose inbox changed.
 * @param payload.message - the inserted message.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode emit
 */
'agent/inbox/inserted'(this: Scoped<Agent>, payload: { agent: Agent; message: UserMessage }): void
```

Types: [Scoped](scope.ar.md) · [UserMessage](session.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentpre-step--waterfall"></a>

#### `agent/pre-step` — waterfall

Reject a proposed step or replace the messages that enter it. Calling `next()` preserves the current messages.

```ts cordis-catalog
/**
 * Reject a proposed step or replace the messages that enter it. Calling
 * `next()` preserves the current messages.
 * @param payload.agent - the agent proposing the step.
 * @param payload.messages - messages removed from the inbox for this step.
 * @param payload.turn - the turn that will own the step.
 * @param payload.step - the step proposed by the loop.
 * @param payload.signal - the current turn's cancellation signal.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode waterfall
 */
'agent/pre-step'(this: Scoped<Agent>, payload: { agent: Agent; messages: UserMessage[]; turn: number; step: number; signal: AbortSignal }, next: () => Promise<PreStepDecision>): Promise<PreStepDecision>
```

Types: [Scoped](scope.ar.md) · [UserMessage](session.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentrequest--waterfall"></a>

#### `agent/request` — waterfall

Replace the frozen call configuration. `await next()` yields the config the machine would use (agent options on the first request, the logged header afterwards); return a replacement to switch. On step admission, this runs after assembly and `step/start`, before the system prompt and accepted user batch are committed. Cancellation here or during subsequent `prepareCall()` resolution commits neither. The prepared call capability governs prompt admission. Model-visible content must use logged channels; this waterfall cannot mutate messages.

```ts cordis-catalog
/**
 * Replace the frozen call configuration. `await next()` yields the config
 * the machine would use (agent options on the first request, the logged
 * header afterwards); return a replacement to switch. On step admission,
 * this runs after assembly and `step/start`, before the system prompt and
 * accepted user batch are committed. Cancellation here or during subsequent
 * `prepareCall()` resolution commits neither. The prepared call capability
 * governs prompt admission. Model-visible content must use logged channels;
 * this waterfall cannot mutate messages.
 * @param payload.agent - the agent making the model call.
 * @param payload.turn - the open turn number.
 * @param payload.step - the step whose request this is.
 * @param payload.signal - the current turn's explicit abort signal.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode waterfall
*/
'agent/request'(this: Scoped<Agent>, payload: { agent: Agent; turn: number; step: number; signal: AbortSignal }, next: () => Promise<LlmCallConfig>): Promise<LlmCallConfig>
```

Types: [LlmCallConfig](llm-streaming.ar.md) · [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentrequest-error--waterfall"></a>

#### `agent/request-error` — waterfall

Handle one failed model-request attempt before the loop retries or closes its step. A listener returns `{ kind: 'retry' }` without calling `next()` when it owns recovery, or calls `next()` to delegate. The default `undefined` leaves the failure terminal.

```ts cordis-catalog
/**
 * Handle one failed model-request attempt before the loop retries or closes
 * its step. A listener returns `{ kind: 'retry' }` without calling `next()`
 * when it owns recovery, or calls `next()` to delegate. The default
 * `undefined` leaves the failure terminal.
 * @param payload.agent - the agent whose request failed.
 * @param payload.turn - the turn containing the failed request.
 * @param payload.step - the step containing the failed request attempt.
 * @param payload.provider - the provider selected for the failed request.
 * @param payload.failure - serializable facts normalized at the final adapter boundary.
 * @param payload.retryPolicy - the policy of the adapter registration that served the failed request.
 * @param payload.signal - the turn abort signal.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode waterfall
 */
'agent/request-error'(this: Scoped<Agent>, payload: { agent: Agent; turn: number; step: number; provider: string; failure: LlmFailure; retryPolicy: ResolvedRetryPolicy | undefined; signal: AbortSignal }, next: () => Promise<RequestErrorAction>): Promise<RequestErrorAction>
```

Types: [LlmFailure](llm-streaming.ar.md) · [ResolvedRetryPolicy](llm-streaming.ar.md) · [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentstatus--emit"></a>

#### `agent/status` — emit

Agent status changed (`idle` ⇄ `running`). A waking delivery enters `running` synchronously after reserving cancellation; `idle` means no driver remains scheduled or active.

```ts cordis-catalog
/**
 * Agent status changed (`idle` ⇄ `running`). A waking delivery enters
 * `running` synchronously after reserving cancellation; `idle` means no
 * driver remains scheduled or active.
 * @param payload.agent - the agent whose status flipped.
 * @param payload.status - the status just entered (the transition's destination).
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode emit
 */
'agent/status'(this: Scoped<Agent>, payload: { agent: Agent; status: AgentStatus }): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agentturn-stopping--serial"></a>

#### `agent/turn-stopping` — serial

The turn is about to close: the model owes no response (no live tool calls, no fresh steering). Awaited before the boundary commits — a listener that objects steers (`agent.steer(...)`) and the machine re-reads its inbox: fresh steering runs another step, none closes the turn. Data decides, so listener order cannot change the outcome. The inverse control (stop a tool loop early) is data too: a tool result carrying `concludesTurn` ends the turn at its step. The conclusion never short-circuits already-submitted next-step work: same-step `additionalContexts` or racing steering still runs, and the turn closes only when that inbox drains.

```ts cordis-catalog
/**
 * The turn is about to close: the model owes no response (no live tool
 * calls, no fresh steering). Awaited before the boundary commits — a
 * listener that objects steers (`agent.steer(...)`) and the machine
 * re-reads its inbox: fresh steering runs another step, none closes the
 * turn. Data decides, so listener order cannot change the outcome. The
 * inverse control (stop a tool loop early) is data too: a tool result
 * carrying `concludesTurn` ends the turn at its step. The conclusion
 * never short-circuits already-submitted next-step work: same-step
 * `additionalContexts` or racing steering still runs, and the turn
 * closes only when that inbox drains.
 * @param payload.agent - the agent whose turn is at its stop boundary.
 * @param payload.turn - the turn about to close.
 * @param payload.signal - the current turn's explicit abort signal.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @mode serial
 */
'agent/turn-stopping'(this: Scoped<Agent>, payload: { agent: Agent; turn: number; signal: AbortSignal }): Promise<void> | void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/agent/src/runtime-types.ts`](../../packages/core/agent/src/runtime-types.ts)

<a id="agent-loop-events"></a>

### `agent-loop/*` events

<a id="agent-loopconfig-start-failed--emit"></a>

#### `agent-loop/config-start-failed` — emit

A declarative agent entry failed before it could publish a live agent. Consumers that buffer work for the configured identity use this transient signal to reject that work instead of waiting forever. Normal factory teardown suppresses failures from the cancelled startup attempt.

```ts cordis-catalog
/**
 * A declarative agent entry failed before it could publish a live agent.
 * Consumers that buffer work for the configured identity use this
 * transient signal to reject that work instead of waiting forever. Normal
 * factory teardown suppresses failures from the cancelled startup attempt.
 * @param payload.sessionId - exact shared agent/session identity that failed startup.
 * @param payload.error - persistence, setup, or publication failure.
 * @mode emit
 */
'agent-loop/config-start-failed'(payload: { sessionId: SessionId; error: unknown }): void
```

Source: [`packages/core/agent-loop/src/index.ts`](../../packages/core/agent-loop/src/index.ts)

<a id="agent-preset-events"></a>

### `agent-preset/*` events

<a id="agent-presetselected--emit"></a>

#### `agent-preset/selected` — emit

One session committed a different agent preset to its durable log. Consumers invalidate only state derived from that session's composition.

```ts cordis-catalog
/**
 * One session committed a different agent preset to its durable log.
 * Consumers invalidate only state derived from that session's composition.
 * @mode emit
 * @param sessionId - the session whose composition changed.
 * @param agentPreset - the preset recorded by the committed selection.
 */
'agent-preset/selected'(sessionId: SessionId, agentPreset: string): void
```

Source: [`packages/preset/agent-presets/src/types.ts`](../../packages/preset/agent-presets/src/types.ts)
<!-- END GENERATED cordis-surface -->

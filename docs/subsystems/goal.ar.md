# نفس جلسة هدف

[English](goal.md) | العربية

حدث تتبع مصدر هدف خدمة و ذلك سياسة مستهلك مشترك نوع.[هدف مجال Agent Note](../../.agents/notes/implemented/feature/2026-07-19-persisted-same-session-goal-domain.ar.md) مسؤول سجل حفظ دائم و تنشيط قرار؛ هذا صفحة سجل [`packages/goal/goal/src/types.ts`](../../packages/goal/goal/src/types.ts) في تأكيد قطع حقل و تغيير جسم.

## معرف و دورة الحياة

`GoalId` هو[صنف لوحة تحويل id](core.ar.md#branded-ids). استدعاء جهة عبر `GoalRef` تعديل واحد تأكيد قطع إصلاح حجز إصدار؛ كل مرة نيل دقيق حمل دائم تغيير كل سوف تمرير زيادة إصلاح حجز رقم.

```ts type-equiv
/** Compare-and-set identity for one exact goal revision. */
interface GoalRef {
  /** Stable goal identity. */
  readonly id: GoalId
  /** Positive revision; every durable mutation increments it. */
  readonly revision: number
}
```

حمل دائم مرحلة مقطع عودة جواب هدف حدوث ماذا. عملية محلي تنشيط حالة فإن آخر سطر عودة جواب متابعة ركض مستهلك قدرة لا بدء آخر عدد Round.

```ts type-equiv
/** Durable continuation phase. Activation is process-local and separate. */
type GoalPhase =
  | 'active'
  | 'paused'
  | 'blocked'
  | 'complete'
```

منع سد هو وحيد يمثل «بسبب مشكلة بينما إيقاف» حمل دائم حالة. من سياسة مسؤول منع سد سبب سوف يحمل واحد لأجل توجيه، مستقر كما اعتماد lower-kebab-case شفرة، و واحد مقطع توفير شخص و نموذج قراءة قراءة ذاتي من نص شرح.

```ts type-equiv
/** Machine-routable and human-readable explanation for a blocked goal. */
interface GoalBlockReason {
  /** Stable lower-kebab-case classification chosen by the blocking policy. */
  readonly code: string
  /** Non-empty explanation shown to humans and models. */
  readonly message: string
}
```

```ts type-equiv
/** Full durable state written by every non-clear goal mutation. */
interface GoalSnapshot extends GoalRef {
  /** Human-requested completion objective. */
  readonly objective: string
  /** Durable lifecycle phase. */
  readonly phase: GoalPhase
  /** Present exactly while `phase` is `blocked`. */
  readonly blockedReason?: GoalBlockReason
  /** Total admitted goal-round cap. */
  readonly maxGoalRounds: number
}
```

```ts type-equiv
/** Current goal projection, including values derived from the session log. */
interface GoalView extends GoalSnapshot {
  /** Highest admitted round number for this goal. */
  readonly roundsStarted: number
  /** Epoch milliseconds of the create mutation. */
  readonly createdAt: number
  /** Epoch milliseconds of the latest mutation. */
  readonly updatedAt: number
  /** Process-local continuation eligibility; never persisted. */
  readonly activation: GoalActivation
}
```

خدمة أيضا سوف في لا تغيير حمل دائم حالة حال حال تحت إصدار عملية محلي activation حافة امتداد؛ عميل إزالة استهلاك هذا حدث نيل نيل فوري حالة.

```ts type-equiv
/** Live process-local activation update forwarded to UI clients. */
interface GoalActivationChanged {
  /** Session whose live goal activation changed. */
  readonly sessionId: SessionId
  /** Current exact activation, absent when no goal is current. */
  readonly goal?: {
    /** Exact current goal identity. */
    readonly id: GoalId
    /** Exact current goal revision. */
    readonly revision: number
    /** Current process-local continuation state. */
    readonly activation: GoalActivation
  }
}
```

## حمل دائم تغيير

كل مرة تغيير كل هو حمل دائم `goal/change` جلسة حدث، ذلك تحميل حمل يلزم ما هو تغيير بعد كامل لقطة، يلزم ما هو صاف حذف قبر نصب. صارم إطار طي و حمل دائم إسقاط فقط من هذه حدث إرسال توليد دورة الحياة حالة؛inbox تغيير لن أثر goal حالة.

```ts type-equiv
/** Full-snapshot goal mutation committed by a durable `goal/change` event. */
interface GoalSnapshotChangeMeta {
  readonly kind: 'goal/change'
  readonly version: 1
  readonly operation: Exclude<GoalOperation, 'clear'>
  readonly goal: GoalSnapshot
  readonly roundsStarted: number
  readonly createdAt: number
  readonly updatedAt: number
}
```

```ts type-equiv
/** Tombstone retained when the current goal is cleared. */
interface GoalClearChangeMeta {
  readonly kind: 'goal/change'
  readonly version: 1
  readonly operation: 'clear'
  readonly cleared: GoalRef
  readonly clearedAt: number
}
```

متابعة ركض مستهلك سوف لـ كل نيل دقيق مستخدم رسالة جولة علامة ملاحظة صحيح عدد كما وصل متابعة Round تحرير رقم و حالي إصلاح حجز رقم؛ فقط لديه هذه نيل دقيق `user/message` حدث سوف دفع دخول `roundsStarted`. إعادة تشغيل سوف رفض غير صحيح عدد Round، تحرير رقم نقص فتحة، قديم قديم إصلاح حجز رقم، قد إيقاف مرحلة مقطع و تجاوز خروج حد أعلى.

```ts type-equiv
/** Message attribution for admitted continuation rounds. */
interface GoalMessageSource {
  readonly kind: 'goal'
  readonly goalId: GoalId
  readonly revision: number
  /** Positive admitted continuation round. */
  readonly round: number
}
```

## طلب و إشعار

إنشاء عملية سوف منطقة قسم استدعاء جهة حذف حقل و اعتماد نشر إعداد قيمة هذا اثنان نوع حال حال،`create()` سوف في داخلي تحليل بعد من. تحرير هو نطاق جزء استبدال، ذلك وقت التشغيل تحقق جهاز اشتراط حتى قليل توفير واحد حقل. كل بند تغيير إشعار كل سوف يحمل نيل دقيق عملية و تأكيد قطع إصلاح حجز رقم؛ صاف حذف عملية لا حمل `goal`.

```ts type-equiv
/** Input whose omitted round cap is resolved by the service configuration. */
interface CreateGoalRequest {
  readonly objective: string
  readonly maxGoalRounds?: number
}
```

```ts type-equiv
/** Fields changed by an edit; at least one must be present. */
interface EditGoalRequest {
  readonly objective?: string
  readonly maxGoalRounds?: number
}
```

```ts type-equiv
/** Live notification after one durable goal mutation commits. */
interface GoalChanged {
  readonly operation: GoalOperation
  readonly ref: GoalRef
  /** Absent for a clear tombstone. */
  readonly goal?: GoalView
}
```

## خدمة سلوك

[`GoalService`](../../packages/goal/goal/src/index.ts) تحليل إنشاء قيمة افتراضية، من اختياري تسجيل `goal` إسقاط قراءة صارم إطار إعادة تشغيل نتيجة، تحقق نقل دخول agent(ذكي جسم) هو سجل التسجيل في تأكيد قطع نشط وثب نسخة، بـ مقارنة مقارنة و ضبط طريقة تنفيذ تغيير، تزامن خروج `goal/changed` إشعار؛ مستمع لذا عائق سوف يتم عزل. سجل التسجيل أو key ناقص وقت، رقم مرة اعتماد هو جمع وصول سوف فشل. حزمة [README](../../packages/goal/goal/README.ar.md) تعريف يمكن استدعاء API و موجه إلى نموذج اتفاق.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxgoals--goalservice"></a>

### `ctx.goals` — `GoalService`

Goal service (`ctx.goals`) backed exclusively by the owning session log.

```ts cordis-catalog
/**
 * Read the current goal for one exact live agent.
 * @param agent - owning live agent.
 * @returns a fresh view or `undefined` when no goal is current.
 * @throws {@link GoalError} when the agent is not the registry's live instance.
 */
@Remote('get') get(agent: Agent): GoalView | undefined

/**
 * Remove process-local continuation authority without changing durable goal
 * phase or revision. Lifecycle owners use this before unloading a driver;
 * a later human-authorized {@link resume} records the new activation edge.
 * @param agent - owning live agent.
 * @returns a fresh disarmed view, or `undefined` when no goal is current.
 */
disarm(agent: Agent): GoalView | undefined

/**
 * Create and arm a goal. A completed goal may be replaced; every other
 * current phase must be cleared or resumed instead.
 * @param agent - owning live agent.
 * @param request - objective and optional round cap.
 * @returns the created live view.
 */
create(agent: Agent, request: CreateGoalRequest): GoalView

/**
 * Edit objective and/or round cap without changing phase.
 * @param agent - owning live agent.
 * @param ref - expected current revision.
 * @param request - at least one replacement field.
 * @returns the edited view.
 */
@Remote('edit') edit(agent: Agent, ref: GoalRef, request: EditGoalRequest): GoalView

/**
 * Pause an active goal and disarm automatic continuation.
 * @param agent - owning live agent.
 * @param ref - expected current revision.
 * @returns the paused view.
 */
@Remote('pause') pause(agent: Agent, ref: GoalRef): GoalView

/**
 * Resume and arm a stopped goal, or rearm an active goal after a
 * session-start edge, while its round budget still has capacity.
 * @param agent - owning live agent.
 * @param ref - expected current revision.
 * @returns the active view.
 */
@Remote('resume') resume(agent: Agent, ref: GoalRef): GoalView

/**
 * Mark a current non-complete goal complete and disarm it.
 * @param agent - owning live agent.
 * @param ref - expected current revision.
 * @returns the completed view.
 */
@Remote('complete') complete(agent: Agent, ref: GoalRef): GoalView

/**
 * Mark an active goal blocked and disarm it.
 * @param agent - owning live agent.
 * @param ref - expected current revision.
 * @param reason - policy-owned stable code and human-readable explanation.
 * @returns the blocked view with its durable reason.
 */
block(agent: Agent, ref: GoalRef, reason: GoalBlockReason): GoalView

/**
 * Clear the current goal while retaining a durable tombstone and history.
 * @param agent - owning live agent.
 * @param ref - expected current revision.
 * @returns the tombstone ref whose revision is one past the cleared snapshot.
 */
@Remote('clear') clear(agent: Agent, ref: GoalRef): GoalRef

/**
 * Create one Goal through the remote boundary.
 * @param agent - exact live Agent resolved from the wire identity.
 * @param request - objective and optional round cap.
 * @returns the created Goal identity.
 */
@Remote('create') remoteExportCreate(agent: Agent, request: CreateGoalRequest): CreateGoalResult
```

Types: [Agent](core.ar.md)

Source: [`packages/goal/goal/src/index.ts`](../../packages/goal/goal/src/index.ts)

<a id="goal-events"></a>

### `goal/*` events

<a id="goalactivation-changed--emit"></a>

#### `goal/activation-changed` — emit

Process-local goal activation changed for one session.

```ts cordis-catalog
/**
 * Process-local goal activation changed for one session.
 * @mode emit
 * @param payload - session id and the exact current goal activation, or no goal after a clear.
 */
'goal/activation-changed'(payload: GoalActivationChanged): void
```

Source: [`packages/goal/goal/src/types.ts`](../../packages/goal/goal/src/types.ts)

<a id="goalchanged--emit"></a>

#### `goal/changed` — emit

Goal mutation accepted by one live agent. The matching `goal/change` session event has already committed. Listener failures are contained. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.

```ts cordis-catalog
/**
 * Goal mutation accepted by one live agent. The matching `goal/change`
 * session event has already committed. Listener failures are contained.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @param payload.agent - agent whose session owns the goal.
 * @param payload.change - fresh current projection or clear tombstone.
 * @mode emit
 */
'goal/changed'(this: import('@deepseek-ai/dsh-scope').Scoped<Agent>, payload: { agent: Agent; change: GoalChanged }): void
```

Types: [Agent](core.ar.md) · [Scoped](scope.ar.md)

Source: [`packages/goal/goal/src/domain.ts`](../../packages/goal/goal/src/domain.ts)
<!-- END GENERATED cordis-surface -->

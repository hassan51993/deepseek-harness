# Agent Teams

[English](agent-team.md) | العربية

فعلي تحقق صفة خفي صيغة Root Team مجال، نموذج أداة و مضيف مهايئ مشترك نوع.[Agent Teams Agent Note](../../.agents/notes/implemented/feature/2026-08-05-agent-teams.zh.md) مسؤول هوية،mailbox،task و مشترك checkout قرار؛ هذا صفحة سجل [`packages/experimental/agent-team/src/types.ts`](../../packages/experimental/agent-team/src/types.ts) في حرف وجه حمل دائم شكل صيغة.

## هوية و roster

`TeamId` هو أداة لديه مستقل[صنف لوحة](core.zh.md#branded-ids) Root `SessionId`.`TeamTaskId` في Team داخل حسب `task-<n>` مفرد ضبط قسم إعداد؛`TeamMessageId` هو عام مع آلة قيمة.teammate Session id بداية نهاية هو حمل دائم هوية، بينما `name` هو غير ممكن تغيير نموذج/UI وسم.

```ts type-equiv
/** Whole durable value written on every teammate lifecycle change. */
interface TeamMemberSnapshot {
  readonly id: SessionId
  readonly name: string
  readonly description: string
  readonly provider: string
  readonly context: 'fresh' | 'fork'
  readonly phase: TeamMemberPhase
  readonly error?: string
}
```

كل member كل من `provisioning` بدء، و كما فقط وصول واحد نهاية حالة roster phase:`active` أو `failed`. وقت التشغيل `running`/`idle`/`inactive` حالة مفرد وحيد إرسال توليد، أبدا سوف إعادة كتابة هذا سجل.

## حمل دائم mailbox

Lead Session أول أولا تخزين كامل queued message. فقط لديه target pending inbox بند أو قد سجل مستخدم رسالة إتمام حفظ دائم، عندئذ سوف كتابة مستقل acknowledgement event،queued-minus-delivered بسبب بينما بنية صار استعادة mailbox.

```ts type-equiv
/** One peer message retained until its target Session records it. */
interface TeamMessageSnapshot {
  readonly id: TeamMessageId
  readonly senderId: SessionId
  readonly senderName: string
  readonly targetId: SessionId
  readonly content: ContentBlock[]
}
```

كل بند رسالة كل سوف محاولة تجربة Steer إلقاء تمرير.running target في الأكثر قريب خطوة حد استلام إلى رسالة،idle target بدء واحد جولة،inactive teammate فإن بارد استعادة. استدعاء جهة لا يستطيع اختيار أخرى نمط، لذلك حمل دائم سجل لا تخزين ضبط درجة طريقة.

target Session سوف في pending inbox بند و نهائي مستخدم رسالة فوق إبقاء رسالة هوية و إرسال من عودة بسبب. عبر inbox و تاريخ طي هذا source بنية صار target جانب ذهاب إعادة مفتاح؛ نموذج مرئي framing سوف تكرار id و إرسال من.

```ts type-equiv
/** Source retained by the target Session for durable mailbox de-duplication. */
interface TeamMessageSource {
  readonly kind: 'team-message'
  readonly teamId: TeamId
  readonly messageId: TeamMessageId
  readonly senderId: SessionId
  readonly senderName: string
}
```

## مشترك مهمة DAG

كل بند task event كل تخزين كامل لقطة.`revision` هو compare-and-set قيمة، كل مرة تغيير تمرير زيادة 1.`blockedBy` edge يجب إشارة نحو لم حذف مهمة، و صيانة حمل بلا حلقة رسم.`writeScopes` هو مواصفة تحويل تلميح صفة مسار بادئة، لا هو قفل.

```ts type-equiv
/** Whole durable task snapshot; every mutation increments {@link revision}. */
interface TeamTaskSnapshot {
  readonly id: TeamTaskId
  readonly revision: number
  readonly subject: string
  readonly description: string
  readonly status: TeamTaskStatus
  readonly ownerId?: SessionId
  readonly blockedBy: TeamTaskId[]
  readonly writeScopes: string[]
}
```

`pending` يمثل بعد لم بدء أو قد تحرير،`in_progress` يحمل owner،`completed` ممتلئ كاف blocker،`deleted` هو إبقاء tombstone.view سوف إضافة owner name،readiness و write-scope إعادة تراكم تحذير إبلاغ، لكن لن تغيير حمل دائم لقطة.

## إعادة تشغيل

`foldTeam()` يأخذ واحد Root Session إعادة تشغيل صار كل Team عملية الذي قراءة roster، مهمة لوح و queued-minus-delivered mailbox. هو حسب `TeamId` اختيار أخذ سجل، لذلك عادي fork وراثة event إبقاء ancestor id، أبدا سوف دخول جديد Root حالة.Session event `seq` و `time` متابعة مسؤول ترتيب و وقت سجل،Team snapshot لم يعد تكرار حفظ هو جمع.roster و task قراءة بـ view شكل صيغة وصول استدعاء جهة، بينما pending بريد عنصر فقط توفير إلقاء تمرير و استعادة داخلي استخدام. حزمة [README](../../packages/experimental/agent-team/README.zh.md) مسؤول operation،authorization،recovery و حد سلوك.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxagentteams--teamservice"></a>

### `ctx.agentTeams` — `TeamService`

Agent Teams service backed by the exact live Lead Session log.

```ts cordis-catalog
/**
 * Resolve one exact live Agent's Team role.
 * @param agent - exact live Agent used as the authority credential.
 * @returns its root, Team identity, role, and model-facing name.
 */
membership(agent: Agent): TeamMembership

/**
 * List the runtime-enriched roster visible to one Team member.
 * @param agent - exact live Team member.
 * @returns Lead and teammate rows in creation order.
 */
listMembers(agent: Agent): TeamMemberView[]

/**
 * Create one named, continuable direct child of the Team Lead.
 * @param caller - exact live Lead Agent.
 * @param request - immutable name, description, prompt, context mode, provider, and cancellation.
 * @returns the active roster row.
 */
async spawnTeammate(caller: Agent, request: SpawnTeammateRequest): Promise<SpawnTeammateResult>

/**
 * Queue one durable peer message, then attempt immediate delivery.
 * @param caller - exact live sending Team member.
 * @param request - target name, content, and pre-queue cancellation.
 * @returns durable message identity and immediate-delivery observation.
 */
async sendMessage(caller: Agent, request: SendTeamMessageRequest): Promise<SendTeamMessageResult>

/**
 * Create one unowned pending task in the Team Lead log.
 * @param caller - exact live Team member creating the task.
 * @param request - task text, blockers, and advisory write scopes.
 * @returns the revision-one task view.
 */
async createTask(caller: Agent, request: CreateTeamTaskRequest): Promise<TeamTaskView>

/**
 * Return one task, including a deleted tombstone.
 * @param caller - exact live Team member reading the task.
 * @param id - Team-local task identity.
 * @returns the latest task value and derived readiness diagnostics.
 */
getTask(caller: Agent, id: TeamTaskId): TeamTaskView

/**
 * List current non-deleted tasks in numeric creation order.
 * @param caller - exact live Team member reading the board.
 * @returns detached current task views.
 */
listTasks(caller: Agent): TeamTaskView[]

/**
 * Compare-and-set one authorized task transition.
 * @param caller - exact live Team member authorizing the mutation.
 * @param request - task identity, expected revision, action, and action fields.
 * @returns the committed next task revision.
 */
async updateTask(caller: Agent, request: UpdateTeamTaskRequest): Promise<TeamTaskView>

/**
 * Wait for the next Team-domain or member-status change.
 * @param caller - exact live Team member waiting for activity.
 * @param timeoutMs - bounded wait duration from ten seconds through one hour.
 * @param signal - caller cancellation for the wait only.
 * @returns one observed change or a timeout result.
 */
async waitForChange(caller: Agent, timeoutMs: number, signal: AbortSignal): Promise<TeamWaitResult>

/**
 * Interrupt one live teammate turn without clearing its pending inbox.
 * @param caller - exact live Lead Agent.
 * @param targetName - durable teammate name.
 * @returns the target status sampled before cancellation.
 */
interrupt(caller: Agent, targetName: string): { previousStatus: 'running' | 'idle' | 'inactive' }

/**
 * Resolve a caller without throwing, used by scoped-tool installation and observers.
 * @param agent - candidate exact live Agent.
 * @returns Team membership, or undefined for non-Team subagents and stale identities.
 */
tryMembership(agent: Agent): TeamMembership | undefined

/**
 * Read the current roster and non-deleted task board through the generated Remote API.
 * @param agent - exact live Team member used as the authority credential.
 * @returns detached current roster and task views.
 */
@Remote('view') remoteView(agent: Agent): TeamView

/**
 * Create one shared task through the generated Remote API.
 * @param agent - exact live Team member creating the task.
 * @param request - task text, blockers, and advisory write scopes.
 * @returns the revision-one task or a typed Team rejection.
 */
@Remote('createTask') remoteCreateTask(agent: Agent, request: CreateTeamTaskRequest): Promise<TeamTaskMutationResult>

/**
 * Apply one task mutation and preserve Team rejections as business results.
 * @param agent - exact live Team member authorizing the mutation.
 * @param request - task identity, expected revision, action, and action fields.
 * @returns the committed task or a typed Team rejection.
 */
@Remote('updateTask') remoteUpdateTask(agent: Agent, request: UpdateTeamTaskRequest): Promise<TeamTaskMutationResult>
```

Types: [Agent](core.zh.md)

Source: [`packages/experimental/agent-team/src/index.ts`](../../packages/experimental/agent-team/src/index.ts)
<!-- END GENERATED cordis-surface -->

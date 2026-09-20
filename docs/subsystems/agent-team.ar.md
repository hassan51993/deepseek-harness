# فرق الوكلاء

[English](agent-team.md) | العربية

أنواعٌ يتشاركها مجالُ الفرق التجريبي ذو الجذر الضمني، وأدواتُ النموذج، ومهايئاتُ المضيف. وتملك [ملاحظةُ الوكيل عن فرق الوكلاء](../../.agents/notes/implemented/feature/2026-08-05-agent-teams.ar.md) قراراتِ الهوية وصندوق البريد والمهمة والسحب المشترك؛ وتسجّل هذه الصفحةُ الصيغَ الدائمة الحرفية من [`packages/experimental/agent-team/src/types.ts`](../../packages/experimental/agent-team/src/types.ts).

## الهوية وقائمة الأعضاء

`TeamId` هو `SessionId` الجذر تحت [علامة](core.ar.md#branded-ids) مميزة. و`TeamTaskId` محليٌّ للفريق ويُخصَّص تصاعديًا بالصيغة `task-<n>`؛ و`TeamMessageId` عشوائيٌّ عالميًا. ويبقى معرّفُ جلسة الزميل هويتَه الدائمة، بينما `name` اسمٌ ثابت يراه النموذج والواجهة.

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

ويبدأ كلُّ عضو في `provisioning` ويبلغ طورًا نهائيًا واحدًا في القائمة، إما `active` وإما `failed`. أما حالةُ وقت التشغيل `running` أو `idle` أو `inactive` فتُشتق منفصلةً ولا تعيد كتابةَ هذا السجل أبدًا.

## صندوق البريد الدائم

تخزّن جلسةُ القائد أولًا الرسالةَ المصطفّة كاملةً. ولا يُقَرّ باستلام الهدف إلا بعد أن يصير بندُ صندوق وارده المعلَّق أو رسالتُه المسجَّلة للمستخدم دائمًا، فيبقى «المصطفّ ناقصَ المسلَّم» صندوقَ بريد التعافي.

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

وكلُّ رسالة تحاول التسليمَ بالتوجيه. فالهدفُ العامل يتلقاها عند أقرب حدّ خطوة، والهدفُ الخامل يبدأ جولة، والزميلُ غيرُ النشط يستأنف من البارد. ولا تُخزَّن الجدولةُ في السجل الدائم لأن المستدعين لا يستطيعون اختيارَ وضع آخر.

وتحفظ جلسةُ الهدف هويةَ الرسالة ونسبتَها إلى مرسلها على بند صندوق الوارد المعلَّق وعلى رسالة المستخدم في النهاية معًا. وطيُّ ذلك المصدر عبر صندوق الوارد والتاريخ هو مفتاحُ إزالة التكرار عند الهدف؛ ويكرّر التأطيرُ الذي يراه النموذج المعرّفَ والمرسِل.

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

## الرسم الموجَّه للمهام المشترك

يخزّن كلُّ حدث مهمة لقطةً كاملة. و`revision` هي قيمةُ المقارنة والتعيين وتزيد واحدًا مع كل تغيير. وحوافُّ `blockedBy` يجب أن تسمّي مهامَّ غيرَ محذوفة وأن تبقي الرسمَ خاليًا من الدورات. و`writeScopes` بوادئُ مسارات إرشادية موحَّدة لا أقفال.

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

و`pending` تعني لم تبدأ أو أُفرج عنها، و`in_progress` تحمل مالكًا، و`completed` تفي بالمعيقات، و`deleted` شاهدةٌ محفوظة. وتضيف العروضُ اسمَ المالك والجاهزيةَ وتحذيراتِ تداخل نطاقات الكتابة بلا تغيير اللقطة الدائمة.

## إعادة التشغيل

يعيد `foldTeam()` تشغيلَ جلسة جذر واحدة إلى قائمة الأعضاء ولوحة المهام وصندوق البريد «المصطفّ ناقصَ المسلَّم» الذي تقرؤه كلُّ عملية فريق. وهو ينتقي السجلاتِ بـ`TeamId`، فالأحداثُ التي يرثها تفريعٌ عادي تحتفظ بمعرّف السلف ولا تدخل حالةَ الجذر الجديد. ويبقى `seq` و`time` في حدث الجلسة سجلَّ الترتيب والتوقيت؛ ولا تكرّرهما لقطاتُ الفريق. وتصل قراءاتُ القائمة والمهام إلى المستدعين عروضًا؛ ويبقى البريدُ المعلَّق داخليًا في التسليم والتعافي. ويملك [README](../../packages/experimental/agent-team/README.ar.md) الحزمةِ سلوكَ العمليات والتخويل والتعافي والحدود.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

Types: [Agent](core.ar.md)

Source: [`packages/experimental/agent-team/src/index.ts`](../../packages/experimental/agent-team/src/index.ts)
<!-- END GENERATED cordis-surface -->

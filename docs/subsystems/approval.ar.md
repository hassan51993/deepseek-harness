# موافقة المستخدم

[English](approval.md) | العربية

يجيب seam موافقة المستخدم في [dsh-user-approval](../../packages/interaction/user-approval) عن سؤال واحد: أيجوز لهذا الفعل بعينه أن يمضي؟ وهو يملك مفرداتِ الطلب والحصيلة المشتركة، وخدمةَ التوزيع `ctx.approval`، وشلالَ المجيبين `approval/request`، وزوجَ التدقيق للسجل فقط، وسياسةَ `ask` و`never` لكل جلسة. وقد توفّر قنواتُ الواجهة مجيبين بشرًا؛ ويوفّر [جسر أتمتة ACP](../../packages/acp/acp) قراراتٍ آليةً لمرة واحدة لوكلائه. ويستهلك المستدعون مثل [dsh-tools](../../packages/core/tools) و[dsh-tool-bash](../../packages/shell/tool-bash) الحصيلةَ المغلقة ويفشلون مغلقين ما لم تكن `allowed-once`.

المصدر: [`packages/interaction/user-approval/src/index.ts`](../../packages/interaction/user-approval/src/index.ts)

## الهوية والحصيلة

يتلقى كلُّ طلب `ApprovalRequestId` جديدًا. وتقرن العلامةُ حدثَي التدقيق `approval/asked` و`approval/decided` بلا أن تجعل معرّفاتِ الموافقة قابلةً للتبادل مع معرّفات نداء الأدوات أو الوكلاء أو الجلسات.

```ts type-equiv
/**
 * Pairs one `approval/asked` audit event with its `approval/decided`.
 * Service-issued (one fresh id per {@link ApprovalService.request} call).
 */
type ApprovalRequestId = Branded<'ApprovalRequestId'>
```

و`ApprovalOutcome` مغلقةٌ وتفشل مغلقة. فـ`allowed-once` تمنح الفعلَ المسؤولَ عنه وحده؛ ويرفض المستدعون عند `rejected` و`cancelled` و`unavailable`. والمجيبُ الغائب أو غيرُ المالك أو الرامي أو غيرُ المطابق يصير `unavailable` بدل أن يفتح البوابة.

```ts type-equiv
/**
 * Closed approval outcomes: a one-shot grant, explicit rejection, withdrawn
 * request, or unavailable answerer. Callers fail closed on `unavailable`.
 */
type ApprovalOutcome = 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable'
```

## السياسة لكل جلسة

تحدد `ApprovalPolicy` ما يحدث قبل أن يعمل المجيبون التفاعليون. فـ`ask` تفوّض سلسلةَ المجيبين المركَّبة، وافتراضُها حين لا جواب هو `unavailable`؛ و`never` تعيد `rejected` حتمًا بلا توزيع على أي مجيب. والقيمةُ السارية هي آخرُ حدث `approval/policy` في سجل الجلسة، وإلا فضبطُ الخدمة. ويقرؤها المستهلكون بـ`ctx.approval.effectivePolicy(session)`؛ و`setApprovalPolicy(session, policy)` هو مسارُ الكتابة الوحيد، فتعيد إعادةُ التشغيل بناءَ التجاوز.

```ts type-equiv
/**
 * A session's approval policy — what happens to an {@link ApprovalService}
 * ask BEFORE any interactive answerer sees it:
 *
 * - `'ask'` (the default) — delegate to the composed answerers; with none
 *   composed the chain falls through to the fail-closed `'unavailable'`.
 * - `'never'` — never prompt anyone: every ask resolves `'rejected'`
 *   deterministically. The strict headless stance (CI, unattended runs) and
 *   the policy whose outcome is knowable without asking.
 */
type ApprovalPolicy = 'ask' | 'never'
```

وتسهم السياستان كلتاهما بمعناهما الحالي كاملًا في لقطة سياق وقت التشغيل الآمنة مع التخزين المؤقت. ورسالةُ `user/message` المنسوبة هي المُدخَلُ الدائم الذي يراه النموذج؛ وتغييرُ حالة الموافقة يُلحق لقطةً كاملة جديدة بعد التاريخ المحفوظ بلا مساس بعقد `system/message` التي تحمل مطالبةَ النظام المعروضة.

## طلب الموافقة

يحدد `ApprovalRequest` الوكيلَ وفعلَ الأداة تحديدًا يكفي لتوجيه السؤال وتدقيقه. وهو يُغفل وسائطَ الأداة عمدًا: فالمجيبُ يربط المطالبةَ بنداء الأداة المبثوث سلفًا عبر `callId` بدل عرض نسخة ثانية قد تنحرف.

```ts type-equiv
/**
 * Readonly same-process permission question. `callId` links to an already
 * presented tool call, so arguments are not duplicated here.
 */
interface ApprovalRequest extends ApprovalRequestEvent {
  /**
   * The agent on whose behalf the question is asked. Routes the question (a
   * UI answerer only answers for agents it owns) and receives the audit
   * events on its session log.
   */
  readonly agent: Agent
  /** The tool the question is about (presentation and audit). */
  readonly toolName: string
  /**
   * The exact tool call being decided, when the asker has one — lets a UI
   * attach the prompt to the tool call it already streamed.
   */
  readonly callId?: ToolCallId
  /** The asker's human-readable explanation of WHY it is asking. */
  readonly reason?: string
  /**
   * Aborting withdraws the question: the request settles `'cancelled'`
   * immediately and a late answer from a still-pending answerer is discarded.
   */
  readonly signal?: AbortSignal
}
```

## التوزيع والتدقيق

يشترط `ctx.approval.request(req)` أن تكون الجلسةُ الطالبة داخل جولة مفتوحة. وهو يُلحق `approval/asked`، ويحصّل حصيلةً واحدة، ويُلحق `approval/decided` المطابق، ثم يحلّ بتلك الحصيلة. وتُطبَّق سياسةُ `never` داخل الخدمة قبل توزيع الشلال، فلا يستطيع تجاوزَها حتى مجيبٌ سُجّل لاحقًا بـ`prepend`. ويعيد المجيبون حصيلةً حين يملكون الطلب، أو ينادون `next()` للتفويض؛ ويشغل أولُ جواب خانةَ القرار الوحيدة.

وأحداثُ التدقيق للسجل فقط ولا تدخل نصَّ المحادثة الذي يراه النموذج. والسلوكُ الذي يراه النموذج هو نتيجةُ الأداة المشتقة لدى المستدعي مع لقطة سياق وقت التشغيل الحالية. ويزيل التخلصُ من الخدمة إسهامَها في السياق؛ أما مستمعو المجيبين فمربوطون بالأثر مستقلين بإضافاتهم المالكة.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxapproval--approvalservice"></a>

### `ctx.approval` — `ApprovalService`

Approval service that applies session policy before answerers and logs every ask/outcome pair to the requesting session. It exposes deterministic policy changes to the model through the runtime-context snapshot and switch notices.

```ts cordis-catalog
/**
 * Switch one live agent's policy and queue the transition for its next model
 * step. Session initialization uses {@link setApprovalPolicy} directly
 * because there is no previously visible policy to change.
 * @param agent - the live agent whose policy is changing.
 * @param policy - the new effective policy.
 */
setPolicy(agent: Agent, policy: ApprovalPolicy): void

/**
 * Ask the composed answerers to decide one readonly same-process request.
 * The service borrows the request, agent, session, and live signal directly.
 * The request requires an open turn because the audit pair must be enclosed
 * by the durable log's commit/replay boundary; an idle ask rejects before
 * appending anything. The answerer phase always produces an outcome: an
 * aborted signal yields `'cancelled'`, a missing or throwing answerer yields
 * `'unavailable'` (fail closed), and a rogue non-vocabulary return value is
 * normalized to `'unavailable'`. A failure that prevents either audit append
 * from committing still rejects because returning an unlogged decision would
 * violate the pair. Session contains post-commit observer failures, so an
 * authoritative append cannot reject the request or suppress its matching
 * audit event.
 * @param req - the pending decision (agent, tool identity, reason, signal).
 * @returns the closed outcome; `'allowed-once'` is the only grant.
 * @throws when no turn is open or either audit event fails before the session
 *   append commit point.
 */
async request(req: ApprovalRequest): Promise<ApprovalOutcome>

/**
 * Read the session override without applying the configured default.
 * @param session - session whose log supplies the override.
 * @returns the last logged policy, or `undefined` without one.
 */
overrideOf(session: Session): ApprovalPolicy | undefined
```

Types: [Agent](core.ar.md) · [Session](session.ar.md)

Source: [`packages/interaction/user-approval/src/index.ts`](../../packages/interaction/user-approval/src/index.ts)

<a id="approval-events"></a>

### `approval/*` events

<a id="approvalrequest--waterfall"></a>

#### `approval/request` — waterfall

Ask composed answerers for one decision. Return an outcome to claim the request or call `next()` to delegate. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.

```ts cordis-catalog
/**
 * Ask composed answerers for one decision. Return an outcome to claim the
 * request or call `next()` to delegate. Scope-filtered dispatch
 * (`@deepseek-ai/dsh-scope`): agent-scoped listeners receive only that agent.
 * @param req - pending approval request.
 * @mode waterfall
 */
'approval/request'( this: Scoped<Agent>, req: ApprovalRequestEvent, next: () => Promise<ApprovalOutcome>, ): Promise<ApprovalOutcome>
```

Types: [Agent](core.ar.md) · [Scoped](scope.ar.md)

Source: [`packages/interaction/user-approval/src/types.ts`](../../packages/interaction/user-approval/src/types.ts)
<!-- END GENERATED cordis-surface -->

# مستخدم مراجعة دفعة

[English](approval.md) | العربية

[dsh-user-approval](../../packages/interaction/user-approval) مستخدم مراجعة دفعة seam عودة جواب واحد مشكلة: هذا عدد أداة جسم عملية هل يمكن متابعة؟ هو يملك مشترك طلب/نتيجة مفردات،`ctx.approval` توزيع خدمة،`approval/request` ينبغي جواب من waterfall(شلال نشر صيغة حدث) ، فقط سجل سجل مراجعة حساب حدث مقابل، و حسب جلسة `ask`/`never` سياسة.UI عبر طريق يمكن توفير شخص صنف ينبغي جواب من؛[ACP(Agent Client Protocol) تلقائي تحويل جسر وصل طبقة](../../packages/acp/acp) لـ ذلك يملك agent(ذكي جسم) توفير مرة صفة آلة جهاز قرار. استدعاء جهة مثل [dsh-tools](../../packages/core/tools) و [dsh-tool-bash](../../packages/shell/tool-bash) إزالة استهلاك إغلاق دمج نتيجة، حذف غير نتيجة لـ `allowed-once`، لا فإن واحد قاعدة رفض.

شفرة المصدر:[`packages/interaction/user-approval/src/index.ts`](../../packages/interaction/user-approval/src/index.ts)

## معرف و نتيجة

كل طلب كل سوف نيل نيل واحد كل جديد `ApprovalRequestId`. هذا صنف لوحة نوع سوف `approval/asked` و `approval/decided` مراجعة حساب حدث إعداد مقابل، معا لن يجعل مراجعة دفعة id و استدعاء الأداة id أو agent/جلسة id متبادل تبديل.

```ts type-equiv
/**
 * Pairs one `approval/asked` audit event with its `approval/decided`.
 * Service-issued (one fresh id per {@link ApprovalService.request} call).
 */
type ApprovalRequestId = Branded<'ApprovalRequestId'>
```

`ApprovalOutcome` هو إغلاق دمج، كما فشل وقت رفض.`allowed-once` فقط تخويل الذي استفسار سؤال ذلك واحد عملية؛ استدعاء جهة مقابل `rejected`،`cancelled` و `unavailable` متساو تنفيذ رفض. ناقص، لا مسؤول هذا طلب، رمي استثناء أو لا دمج قاعدة ينبغي جواب من سوف إنتاج `unavailable`، بينما غير وضع سطر.

```ts type-equiv
/**
 * Closed approval outcomes: a one-shot grant, explicit rejection, withdrawn
 * request, or unavailable answerer. Callers fail closed on `unavailable`.
 */
type ApprovalOutcome = 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable'
```

## حسب جلسة سياسة

`ApprovalPolicy` قرار في تفاعل صيغة ينبغي جواب من تشغيل قبل حدوث ماذا.`ask` تفويض حمل إعطاء تركيب ينبغي جواب من سلسلة، سلسلة بلا ينبغي جواب قيمة افتراضية لـ `unavailable`؛`never` تحديد صفة أرض إرجاع `rejected`، لا توزيع أي ينبغي جواب من. توليد فاعلية قيمة لـ جلسة سجل في الأكثر بعد واحد بند `approval/policy` حدث، رجوع إلى خدمة إعداد. مستهلك عبر `ctx.approval.effectivePolicy(session)` قراءة؛`setApprovalPolicy(session, policy)` هو وحيد كتابة مسار، لذلك إعادة تشغيل قدرة إعادة بناء تغطية قيمة.

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

اثنان نوع سياسة كل سوف سوف كل منها كامل حالي يحتوي معنى مساهمة إعطاء ذاكرة مؤقتة أمان وقت التشغيل سياق لقطة. حمل مصدر `user/message` هو حفظ دائم كما نموذج مرئي إدخال؛ مراجعة دفعة حالة تغير وقت، سوف في إبقاء تاريخ بعد إلحاق واحد نسخة جديد كامل لقطة، بينما لا لمس اصطدام تحمل تحميل تصيير بعد توجيه النظام `system/message` عقدة.

## مراجعة دفعة طلب

`ApprovalRequest` بـ كاف كاف دقيق طريقة معرف agent و أداة عملية، بـ سهل توجيه و مراجعة حساب هذا مشكلة. هو متعمد حذف أداة معامل: ينبغي جواب من عبر `callId` سوف تلميح مرفق إضافة إلى قد تدفق صيغة إخراج استدعاء الأداة فوق، بينما غير تصيير آخر نسخة ممكن عائم نقل فرعي هذا.

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

## توزيع و مراجعة حساب

`ctx.approval.request(req)` اشتراط إرسال بدء طلب جلسة موضع في واحد بعد لم انتهاء جولة داخل. هو إلحاق `approval/asked`، نيل أخذ واحد نتيجة، إلحاق مقابل `approval/decided`، لكن بعد بـ هذا نتيجة إتمام.`never` سياسة في خدمة داخلي،waterfall توزيع قبل قوي صنع تنفيذ، لذلك أي جعل بعد قدوم بـ `prepend` تسجيل ينبغي جواب من أيضا لا يمكن التفاف مرور هو. ينبغي جواب من في مسؤول معالجة هذا طلب وقت إرجاع نتيجة، لا فإن استدعاء `next()` تفويض حمل؛ رقم واحد ينبغي جواب احتلال حسب وحيد قرار مجرى موضع.

مراجعة حساب حدث فقط كتابة سجل، لا دخول نموذج transcript(نص سجل). نموذج مرئي سلوك هو استدعاء جهة إرسال توليد أداة نتيجة و حالي وقت التشغيل سياق لقطة. خدمة dispose(مورد تحرير) وقت سوف إزالة ذلك سياق مساهمة؛ ينبغي جواب من مستمع مستقل أرض عبر effect ربط إلى ذلك الذي تابع إضافة.

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

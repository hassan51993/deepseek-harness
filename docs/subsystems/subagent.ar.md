# Subagent

[English](subagent.md) | العربية

subagent seam يجعل واحد agent(ذكي جسم) سوف عمل تفويض إرسال إعطاء فرعي agent. و [bash](shell.ar.md) واحد مثال، هو هو**واحد بند اختياري قدرة**، لا يخص agent loop(ذكي جسم حلقة) ، لذلك ذلك نوع تعريف في هذا بينما غير [core.md](core.ar.md) في. هو مختلف في أخرى قدرة seam، لأن**نفس سياق في يمكن مشترك تخزين كثير عدد مزود تنفيذ**، و حسب اسم تسجيل (`ctx.subagents`) ، بينما bash فقط سماح واحد منفذ. هذا سجل التسجيل التزام دوران [LLM(كبير لغة نموذج) مهايئ سجل التسجيل](llm-streaming.ar.md) ، بينما غير مفرد خدمة bash منفذ.

Service Definition:[dsh-subagent](../../packages/subagent/subagent)(`ctx.subagents` + تحت نص مفردات).Service Provider هو ستة عدد أخ أخ حزمة:`dsh-subagent-spawn-in-process`،`dsh-subagent-fork-in-process`،`dsh-subagent-acp`،`dsh-subagent-codex`،`dsh-subagent-claude-code`،`dsh-subagent-dsh-sdk`؛ موجه إلى نموذج Consumer يشمل [dsh-tool-subagent](../../packages/subagent/tool-subagent)(حسب مزود تفويض إرسال) و [dsh-tool-subagent-control](../../packages/subagent/tool-subagent-control)(اختياري عام `send_message`،`interrupt_agent` و `list_agents` تحكم أداة). نفس عدد `ctx.subagents` خدمة عبر داخلي تنشيط إدارة جهاز مسؤول يمكن متابعة فرعي agent تحرير ترتيب، و مباشر أساس في جلسة تخزين و اختياري جلسة حفظ دائم توفير فقط قراءة child و بعد بديل اكتشاف. منتج مزود تصميم إدارة من رؤية [Codex و Claude Code Agent Note](../../.agents/notes/implemented/feature/2026-08-04-claude-code-and-codex-subagent-backends.ar.md) ؛ عام seam تصميم إدارة من رؤية [subagent Agent Note](../../.agents/notes/implemented/feature/2026-06-21-subagent-capability-seam.ar.md) ،[يمكن متابعة subagent Agent Note](../../.agents/notes/implemented/feature/2026-07-28-continuable-subagent-conversations.ar.md) و[متبادل مجاور Agent رسالة Agent Note](../../.agents/notes/implemented/architecture/2026-08-27-adjacent-agent-steer-messaging.ar.md) ؛[قد عودة ملف قائمة هوية إسقاط سجل](../../.agents/notes/archived/architecture/2026-08-06-subagent-list-identity-projection.md) سجل الأكثر أول قائمة هوية قرار.

شفرة المصدر:[`packages/subagent/subagent/src/types.ts`](../../packages/subagent/subagent/src/types.ts) ،[`packages/subagent/subagent/src/index.ts`](../../packages/subagent/subagent/src/index.ts) و [`packages/subagent/subagent/src/continuation.ts`](../../packages/subagent/subagent/src/continuation.ts)

`subagentCatalog` projection عبر Session مراقبة و عميل لقطة كشف حسب أب جلسة حدث ترتيب `SubagentCatalogEntry[]`. كل بند يتضمن فرعي درجة id، إنشاء وقت، نمط و اعتماد نمط تحديد وسم؛fork وراثة دليل واقع لا في منها.[subagent حزمة](../../packages/subagent/subagent/README.ar.md) تعريف دليل إنشاء و حفظ دائم دلالة.

## اثنان صنف قدرة، اثنان نوع اكتشاف طريقة

مزود عبر واحد ساكن حالة وصف رمز عام نشر ذلك**بدء وقت**وظيفة، خدمة سوف في مفرد مرة run وجود قبل أي سطر فحص؛ إذا طلب اعتماد مزود لا أداة تجهيز وظيفة، سوف يتم واضح رفض (`SubagentError('UNSUPPORTED_CAPABILITY')`) ، أبدا سوف يتم قبول بعد ساكن صامت تجاهل اختصار. هذه flag فقط وصف مفرد مرة [`start()`](#the-provider-contract-subagentprovider) مسار، أي من مزود تركيب فرعي agent مسار.**يمكن متابعة**فرعي agent من متابعة تنفيذ إدارة جهاز ذاتي سطر تركيب، لذلك هو جمع من وحيد واحد اختياري طريقة يأخذ صلة، طريقة وجود أي لـ قدرة، و بـ TypeScript نوع استلام ضيق بصفة اكتشاف آلية:[`SubagentProvider.prepareContinuable`](#the-provider-contract-subagentprovider).

```ts type-equiv
/**
 * Which START-TIME features a provider supports. Checked by the service before delegating to
 * {@link SubagentProvider.start}: a request that needs a capability the chosen provider lacks
 * is rejected with a typed error rather than accepted-then-ignored (the "fail loud, no silent
 * degradation" rule). These flags describe the ONE-SHOT
 * {@link SubagentProvider.start} path, where the provider composes the child;
 * continuable children are composed by the continuation manager itself and are
 * gated by {@link SubagentProvider.prepareContinuable} instead. Each flag
 * corresponds one-to-one to a {@link SubagentStartRequest} option: `depthLimit`
 * to `maxDepth`; the other names match.
 */
interface SubagentCapabilities {
  readonly agentOptions: boolean
  readonly outputSchema: boolean
  readonly depthLimit: boolean
  readonly toolFilter: boolean
  readonly persona: boolean
}
```

## مفرد مرة بدء طلب

أداة طبقة أصل حسب نموذج إدخال و ذاته إعداد بناء هذا طلب؛ خدمة في `start` قبل إبرة مقابل إشارة تحديد مزود إجراء تحقق. لا بد ملء `parent` توفير جلسة cwd، جدول نظام و تفويض إرسال عميق درجة. اختياري Agent مزود، نموذج، دفع إدارة قوي درجة و token تغطية،output schema،depth، أداة مرور ترشيح جهاز و persona حاجة مقابل قدرة flag مطابقة. عملية داخل خلفية سوف يأخذ `agentOptions` دمج إلى أب Agent خيار لـ فوق، سوف filter و persona أثر مجال حد تحديد في فرعي agent إنشاء مرحلة مقطع، و عبر قوي صنع capture أداة تنفيذ الذي دعم حمل object-rooted schema.DSH SDK خلفية سوف يأخذ أربعة عدد Agent توجيه حقل دمج إلى نسخة قيمة افتراضية لـ فوق، و في فرعي وقت التشغيل ابتدائي تحويل خلال تحقق؛ACP،Codex و Claude Code سوف في بدء نقل قبل رفض `agentOptions`.

```ts type-equiv
/**
 * What a caller asks for when starting a ONE-SHOT subagent. The tool layer
 * builds this from the model's `{ description, prompt }` plus its own config;
 * the service validates {@link SubagentCapabilities} against the named provider
 * and resolves the durable descriptor before dispatching to
 * {@link SubagentProvider.start}.
 */
interface SubagentStartRequest {
  /** Optional short display label persisted with a session-backed child. */
  readonly label?: string
  /** Content delivered as the child's user message. */
  readonly prompt: ContentBlock[]
  /**
   * The spawning agent. In-process providers derive workspace, lineage, and
   * delegation depth from its durable session state. ACP reads only its cwd,
   * and only when no deployment `cwd` override is configured.
   */
  readonly parent: Agent
  /**
   * Cancellation signal from the spawning context (the tool's `exec.signal`).
   * This is the canonical cancellation channel both before and after startup:
   * a provider rejects `start()` after cleaning partial resources when it
   * fires before the run is published, and cancels the published run's
   * remaining turn work when it fires afterward.
   */
  readonly signal: AbortSignal
  /**
   * Optional host-Agent provider, model, reasoning-effort, and output-token
   * overrides. Requires {@link SubagentCapabilities.agentOptions}; in-process
   * providers merge them over the parent Agent's options when they create the
   * child, while the DSH SDK provider merges them over its instance defaults
   * before initializing the separate child runtime.
   */
  readonly agentOptions?: AgentOptions
  /**
   * Object-rooted JSON Schema within `assertObjectJsonSchema`'s enforced subset. Start rejects
   * unsupported schemas or providers without the capability. Data must be plain host-realm JSON;
   * a successful child returns the matching value as {@link SubagentResult.structured}.
   */
  readonly outputSchema?: ObjectJsonSchema
  /**
   * Optional absolute delegation-depth cap for the child being started: its
   * computed depth must be less than or equal to this non-negative safe
   * integer. Requires {@link SubagentCapabilities.depthLimit}; rejected at
   * start otherwise.
   */
  readonly maxDepth?: number
  /**
   * Optional child tool scoping. Requires {@link SubagentCapabilities.toolFilter};
   * rejected at start otherwise. In-process backends apply it as a scoped
   * `tools.restrict()` in the child's creation window: the named tools vanish
   * from the child's prompt AND refuse to execute (one visibility), with loud
   * unknown-name validation.
   */
  readonly toolFilter?: ToolRestriction
  /**
   * Optional per-child persona. Requires {@link SubagentCapabilities.persona};
   * rejected at start otherwise. In-process backends register it as a scoped
   * `deployment:persona-prefix` section on the child, SHADOWING the deployment's
   * persona for this child alone — same template semantics as the deployment
   * persona (strict `{{…}}` interpolation against the registered variables).
   */
  readonly persona?: string
}
```

`signal` هو حينئذ خيط قبل بعد وحيد إلغاء عبر طريق.[subagent تركيب تحكم Agent Note](../../.agents/notes/implemented/feature/2026-07-12-subagent-persona-tool-filter-and-depth.ar.md) قاعدة تحديد persona،live عام أداة مرور ترشيح، قطعا مقابل عميق درجة و «مرئي صفة بينما غير إذن» تصميم إدارة من.

موجه إلى استدعاء جهة طلب لا يحمل دليل صيغة دقيق عقدة أو متابعة تنفيذ حالة.`SubagentRuntime.start()` سوف في قدرة فحص بعد تحليل قسم مغادرة مرة صفة وصف رمز، مجددا سوف التالي موجه إلى مزود طلب نقل إعطاء الذي اختيار نقل؛ يمكن متابعة فرعي agent أبدا سوف وصول `SubagentProvider.start()`:

```ts type-equiv
/**
 * Provider-facing one-shot request after {@link SubagentRuntime.start} resolves
 * the durable child descriptor.
 */
interface ResolvedSubagentStartRequest extends SubagentStartRequest {
  /** Detached descriptor a session-backed provider persists in the child log. */
  readonly descriptor: SubagentDescriptorData
}
```

## يمكن متابعة فرعي agent و تنشيط

**يمكن متابعة خلفية subagent** هو واحد نسخة حفظ دائم فرعي agent جلسة (Session) ، حتى كثير صلة ربط واحد عملية داخل **Activation(تنشيط)**، أي يتم إعادة بناء فرعي Agent موضع في إقامة إبقاء حالة وقت مقطع.Activation لا هو طلب، نتيجة، إلغاء أو Task: هو يمكن تنفيذ كثير عدد FIFO جولة، و في ذلك إنشاء بعد بديل ما زال في تشغيل خلال إبقاء إقامة إبقاء. متابعة تنفيذ إدارة جهاز مسؤول activation دقيق دخول، مباشر أب درجة تمييز حق، فوري كل حق رسم، بارد استعادة (cold resume) و فرعي درجة أولوية تحرير؛agent loop مسؤول واحد قطع جولة ترتيب و تنفيذ. أي يمكن متابعة مسار كل لن إنشاء Task، أيضا لن إنشاء تحمل تحميل في بين نتيجة حزمة تركيب طبقة.

```text
persisted Session
  -> optional live Activation
       -> one retained AgentHandle
       -> Agent inbox as the only turn FIFO
       -> zero or more owned child Activations
```

`SubagentRuntime.startContinuable()` سوف مسبق إبقاء مستقر فرعي agent id، مقابل إصدار تحويل `subagent/descriptor` payload بناء قيام لقطة، نحو إشارة تحديد مزود بحث أخذ ذلك قسم مغادرة `ContinuableCreateSpec`، عبر خاص activation-owner أثر مجال إنشاء فرعي Agent، بناء قيام أي يمكن متابعة أب درجة كل حق، و إيداع ابتدائي نص التوجيه. عند استلام عنصر صندوق (inbox) دقيق دخول إنتاج خروج رسالة id وقت، هو بـ `{ childId, messageId }` resolve——بلا حاجة انتظار جولة بدء، أيضا بلا حاجة انتظار رسالة دخول جلسة سجل. في هذا دقيق دخول قبل أي فشل كل سوف بـ اثنان عدد id كل لا إرجاع طريقة reject، و dispose(مورد تحرير) أي قد إنشاء handle، تراجع Activation و أب درجة كل حق.

`SubagentRuntime.sendMessage()` هو وحيد من نموذج تحرير كتابة رسالة عملية. هو استقبال تأكيد قطع في خط sender و هدف id، فقط سماح مباشر parent أو مباشر يمكن متابعة child، ذاتي سطر دفع توجيه sender مصدر معلومة، و أصل حسب هدف child Activation إقامة إبقاء حالة توجيه:

| هدف Activation حالة | `sendMessage` |
|---|---|
| `running` | في نفس Activation في steer الأكثر قريب step |
| `waiting` | نداء تنبيه و steer نفس Activation |
| بلا Activation | بارد استعادة جديد Activation، لكن بعد steer |

`running` يمثل Agent يملك نشط وثب driver أو maintenance مهمة؛`waiting` يمثل لا يوجد نشط وثب Agent عمل، لكن ذلك Inbox غير فارغ أو ما زال يملك حتى قليل واحد بعد لم إتمام dispose فرعي Activation؛`settled` يمثل لا يوجد نشط وثب Agent عمل،Inbox لـ فارغ كما ذلك يملك كل فرعي درجة كل قد dispose، هذا وقت إدارة جهاز سوف dispose [`AgentHandle`](core.ar.md#creation-and-ownership) و إزالة هذا Activation. إدارة جهاز أصل حسب `Agent.whenIdle()`،`Agent.inbox.hasPending`، ذلك يملك فرعي درجة تجميع دمج، و يجعل مرور مدة مراقبة بطلان Activation generation دفع توجيه هذه داخلي شرط، بينما غير صيانة ثاني طقم تنفيذ حالة آلة. نهائي Session flush بعد،child-lock قرار سوف عبر `Agent.runMaintenance()` تزامن task مدخل احتلال استخدام idle مرحلة مقطع، و في نفس عدد JavaScript turn داخل إغلاق دقيق دخول. هذا بند حفظ حراسة قاعدة لا منطقة قسم إلقاء تمرير نمط:`Agent.inject()` توقف وضع context يمكن يجعل فارغ خامل Activation و ذلك في خط أصل أولا متابعة إقامة إبقاء، مباشر إلى نداء تنبيه إلقاء تمرير سوف ذلك claim،queue تغيير سوف ذلك إزالة، أو manager teardown سوف ذلك إسقاط.

Agent استلام عنصر صندوق هو وحيد طابور صف. كل بند Agent رسالة كل استخدام `Agent.steer()`: فارغ خامل هدف سوف بدء واحد جولة، تشغيل في هدف فإن في الأكثر قريب step حد قيادة إلغاء خبر. متصفح `subagent.prompt` Remote سوف آخر سطر عبر نفس بند داخلي دقيق دخول مسار يحمل `delivery: 'queue' | 'steer'`؛Queue فتح بدء لاحق FIFO جولة،Steer إبقاء Agent loop best-effort الأكثر قريب step سلوك و رسالة شخص صنف مصدر. إلقاء تمرير نجاح سوف إرجاع يتم قبول `MessageId`؛ قائم `agent/inbox/inserted`،`agent/inbox/claimed` و `agent/inbox/discarded` حدث ما زال هو رسالة دورة الحياة مراقبة قياس نقطة، متابعة تنفيذ طبقة لا تعريف ثاني بند طابور صف.

إذن قدوم ذاتي تأكيد قطع في خط sender.parent إلى child إلقاء تمرير اشتراط هدف `SessionHeader.parentSession` إشارة نحو sender؛child إلى parent إلقاء تمرير اشتراط sender إقامة إبقاء Activation إشارة نحو هدف.sibling، متبادل فصل كثير في واحد بند حافة ancestor،self-target، قديم قديم Agent كائن و مرة صفة child كل سوف يتم رفض. كل بند قد قبول رسالة كل بـ `Agent <sender-id> sent a message:` بصفة بادئة، و سجل `AgentMessageSource`؛ مصدر معلومة سجل sender، لكن لا منح إعطاء إذن.

مقابل في `startContinuable()`،`sendMessage()` و متصفح prompt إلقاء تمرير، استدعاء جهة signal فقط في استلام عنصر صندوق قبول قبل كف إدارة فحص بحث، شيء تحويل و دقيق دخول. هذا بعد إدارة جهاز مستقل كف إدارة هذا Activation: بعد استدعاء جهة إلغاء حيث لن إلغاء قد قبول جولة، أيضا لن dispose فرعي agent. عام subagent خدمة لا كشف من استدعاء جهة اختيار Agent رسالة ضبط درجة؛ متصفح شخص صنف Queue و Steer ما زال هو داخلي مهايئ اختيار.

في خط queue occurrence تغيير يخص Session مجال. فقط لديه في خط subagent-owned Agent حالي projection identity لـ continuable، كما ذلك descriptor ترتيب رقم يقع في هذا child ذاته غير seed suffix وقت،`session.updateQueue` عندئذ سوف وصل قبول عادي Edit،Remove و QueueDock Steer.Identity projection بـ last-wins طريقة طي descriptor، لذلك child descriptor سوف تغطية fork lineage إبقاء descriptor؛own-suffix ترتيب رقم فحص سوف منع توقف فقط قدوم ذاتي seed أصل أولا identity تخويل تغيير.One-shot، ناقص، لم معرفة، ضرر تالف أو بارد child سوف يتم رفض،queue تغيير أبدا سوف بارد استعادة child. هذه تغيير بـ هدف Session id بصفة شخص صنف إذن، يشمل انتظار معالجة `nextStep` steering أو حقن context.Steer اشتراط queued `MessageId`، كما command بدء وقت Agent يجب تقرير إبلاغ running؛ دقيق دخول بعد حدوث إلغاء وقت، سوف استخدام Agent قد قبول نداء تنبيه `nextTurn` fallback.Edit سوف في نفس عدد `MessageId` تحت تعديل كتابة محتوى، كما Edit و Steer كل سوف تزامن إتمام Inbox تغيير، لذلك settlement فقط سوف مراقبة نهائي حالة.`agent/inbox/claimed` و `agent/inbox/discarded` كل سوف نداء تنبيه watcher إعادة قراءة هل ما زال لديه انتظار معالجة occurrence؛ هذا مثال، مباشر Agent إلقاء تمرير يمكن استعادة توقف وضع عمل، بينما إزالة الأكثر بعد واحد توقف وضع occurrence يمكن جعل idle child تسوية.[شخص صنف inbox تحكم Agent Note](../../.agents/notes/implemented/feature/2026-08-27-continuable-subagent-human-inbox-control.ar.md) يملك هذه دلالة.

`SubagentRuntime.interrupt(targetSessionId, authority)` هو وحيد عام إيقاف عملية: هو تزامن إتمام تمييز حق، مقابل في خط هدف إرسال خروج `Agent.cancel(cause, { keepInbox: true })`، لكن بعد لا انتظار تماما توقف مستقر أي إرجاع.Activation، ذلك بعد لم قيادة أخذ انتظار معالجة inbox عمل و قد إصدار بعد بديل متساو لا تلقي أثر؛ قد يتم قيادة أخذ دخول في قطع جولة عمل لن إعادة دخول طابور. يتم في قطع driver دخول idle بعد، مرة نداء تنبيه إرسال سوف استعادة يتم مؤقت توقف FIFO طابور صف. لا وجود هدف——لم معرفة، مرة صفة أو قد تسوية——و لم ربط إدارة جهاز تركيب هو يتم قبول no-op. مقابل في خط هدف، خطأ parent عنوان أو لا في ذلك في خط أصل أولا سلسلة في استدعاء جهة سوف بـ `UNAUTHORIZED` رفض؛ قديم قديم ancestor كائن و إشارة نحو ذاته ancestor طلب سوف في فحص بحث هدف قبل رفض.

```ts type-equiv
/**
 * Authority under which one interrupt request is admitted. `user` carries the
 * durable direct-parent address a human client presented; `ancestor` carries
 * the exact live Agent object whose recorded lineage must contain the caller.
 */
type SubagentInterruptAuthority =
  | { readonly kind: 'user'; readonly parentSessionId: SessionId }
  | { readonly kind: 'ancestor'; readonly agent: Agent }
```

كل Activation كل يملك ذاتي ذات `AgentHandle` و واحد `ownedChildren: Set<SessionId>`؛ من في واحد نسخة جلسة حتى كثير لديه واحد تخزين نشط Activation، فرعي جلسة id بلا حاجة آخر عدد وقت التشغيل تحويل ذات مرجع يكفي معرف تخزين نشط فرعي agent. بدء فرعي agent أو إيداع مصدر ذاتي parent عمل، سوف في فرعي agent قدرة كاف تشغيل قبل سوف ذلك تسجيل إلى تلقي متابعة تنفيذ إدارة أب درجة تجميع دمج في؛ فقط يلزم هذا تجميع دمج غير فارغ، هذا أب درجة حينئذ لا يمكن settle. قمة طبقة أو أخرى غير متابعة تنفيذ Agent لا يوجد Activation، موضع في waiting رسم خارج. فقط لديه عند فرعي Agent لا يوجد نشط وثب عمل، ذلك Inbox لـ فارغ، هذا فرعي agent كل فرعي درجة كل قد dispose،best-effort نهائي جلسة flush تسوية تمام انتهاء، كما فرعي agent `AgentHandle` إتمام dispose بعد، عندئذ سوف تحرير فرعي agent.

نهائي تسوية سوف انتظار `ctx.sessions.flush(session)`، لكن سوف تجاهل اختصار ذلك مشاركة و قيمة منطقية، لأن مهمة معنى listener كل لا يمكن إثبات بعض عدد حفظ دائم خلفية قد تخزين هذا حالة.rejection سوف يتم سجل، لكن لن جعل Activation فشل؛ إدارة جهاز ما زال سوف dispose هذا handle و تحرير كل حق، هذا بعد حفظ دائم فرعي agent حالة في لاحق استعادة وقت ممكن ناقص أو قديم قديم. إدارة جهاز إزالة سوف استدعاء داخلي إدارة جهاز عام drain، إغلاق دقيق دخول و dispose كل قطعة في خط غابة حرج؛`drainContinuableDescendants(parents)` فقط إغلاق من host تأكيد قطع يملك في خط Agent لـ تحت دقيق دخول، و dispose ذلك يمكن متابعة بعد بديل، بينما غير متصل غابة حرج إبقاء في خط. اثنان من كل سوف انتظار كل منها أثر مجال داخل قد نيل دقيق شيء تحويل مرور مسار، ذاتي قمة نحو تحت نقل بث إلغاء، حسب child-first ترتيب تحرير handle، و كما أي جعل عدد آخر فرع فشل أيضا سوف انتظار كل اختيار في فرع. حفظ دائم فرعي جلسة لا تلقي هذا عملية داخل تفكيك إزالة أثر.

```ts type-equiv
/** Durable attribution for one model-authored message between adjacent Agents. */
interface AgentMessageSource {
  readonly kind: 'agent-message'
  /** A message another agent addressed to this one (`relay` context form). */
  readonly form: 'relay'
  /** Session id of the Agent whose tool call produced the message. */
  readonly senderSessionId: SessionId
}
```

```ts type-equiv
/** Options for one model-authored message between adjacent Agents. */
interface SubagentSendMessageOptions {
  /** Caller cancellation, owning the operation only until inbox acceptance. */
  readonly signal: AbortSignal
}
```

```ts type-equiv
/** Identities returned once a continuable child accepted its initial prompt. */
interface ContinuableStart {
  /** The durable child session id, stable across activations. */
  readonly childId: SessionId
  /** The accepted initial prompt's inbox message id. */
  readonly messageId: MessageId
}
```

عند إقامة إبقاء Activation تسوية وقت، إدارة جهاز سوف نحو هذا child حفظ دائم مباشر parent إلقاء تمرير واحد بند إشعار، شرح هذا epoch مثل أي انتهاء، و يحمل ذلك نهائي assistant إخراج في غير فارغ نص كتلة؛ إذا لا يوجد باق بقية غير فارغ نص، فإن يحمل `It left no closing message.`. مقابل كل استدعاء جهة أخذ إلى مرور id child، هذا بند إلقاء تمرير كل هو بلا شرط؛ هو حدوث في سوف يجعل parent يتم حكم تحديد لـ قد تسوية كل حق تحرير قبل، و عبر و Agent رسالة نفسه نداء تنبيه Agent إلقاء تمرير وصول إقامة إبقاء parent. إذا parent ذاته الذي في جدول نظام قد في تفكيك إزالة في، هذا بند إشعار سوف بـ لا نداء تنبيه طريقة إرسال بلوغ، لأن نداء تنبيه واحد idle Agent هو فتح بدء واحد جولة، بينما لا هو ترتيب طابور انتظار عمل. ذلك مصدر معلومة استخدام واحد مستقل kind، لذلك transcript(نص سجل) أبدا سوف يأخذ وقت التشغيل تسجيل حساب عرض لـ child ذاتي ذات كتابة تحت محتوى.

```ts type-equiv
/**
 * Durable attribution for the runtime's own account of a continuable child
 * settling. Deliberately a different kind from
 * {@link AgentMessageSource}: an Agent message is content the sender chose,
 * while this message is the manager stating what became of the child, and a
 * transcript that merged them would credit the child with words it never wrote.
 */
interface SubagentSettledMessageSource {
  readonly kind: 'subagent-settled'
  /** A runtime account shown without expanding the row (`notice` context form). */
  readonly form: 'notice'
  /** One-line account of how the child ended. */
  readonly summary: string
  /** Session id of the child that settled. */
  readonly senderSessionId: SessionId
}
```

مزود فقط مشاركة و دقيق تجهيز ابتدائي إنشاء spec،`spawn` و `fork` في هذا لديه الذي مختلف. ذلك إرجاع spec فقط يحمل قسم مغادرة، مزود مخصص تابع إنشاء إدخال——يكفي اختيار أب درجة تاريخ نوع فرعي——لا يحتوي Agent،`AgentHandle`، نص التوجيه إلقاء تمرير، نتيجة،dispose أو استعادة عملية. بارد استعادة أصل هذا لا مرور من مزود توزيع: إدارة جهاز طي عام وصف رمز، عبر نفس عدد activation-owner أثر مجال استدعاء `ctx.agents.resume()`، و إيداع انتظار في جولة.

```ts type-equiv
/**
 * What the continuation manager asks a provider for while materializing one
 * continuable child's FIRST activation. The manager has already reserved the
 * durable child identity and owns every later operation, so this request
 * carries only what distinguishes a fresh child from one seeded with parent
 * history.
 */
interface ContinuableCreateRequest {
  /** The reserved durable child session id, for provider diagnostics. */
  readonly sessionId: SessionId
  /** The delegating parent agent whose history a seeding provider reads. */
  readonly parent: Agent
  /**
   * Caller cancellation, which owns preparation only until the manager accepts
   * the initial prompt into the child's inbox.
   */
  readonly signal: AbortSignal
}
```

```ts type-equiv
/**
 * A provider's detached contribution to one continuable child's creation. This
 * is DATA, never a capability: it carries no Agent, `AgentHandle`, prompt
 * delivery, result, disposal, or resume operation, because the continuation
 * manager owns the child's whole lifecycle after preparation.
 */
interface ContinuableCreateSpec {
  /**
   * Completed-turn prefix of the parent's log to seed the child session with,
   * or absent for a fresh child. Same durable contract as
   * `CreateAgentOptions.seed`: contiguous from seq 0, lossless JSON, balanced.
   */
  readonly seed?: readonly SessionEvent[]
}
```

وصف رمز ([descriptor.ts](../../packages/subagent/subagent/src/descriptor.ts) في `SubagentDescriptorData`) هو كل من جلسة دعم دعم subagent الذي استخدام، حسب نمط حكم آخر حفظ دائم هوية. اثنان نوع نمط كل يحمل مزود اسم.`one-shot` وصف رمز يمكن يحمل استدعاء جهة يملك اختياري عرض `label`؛`continuable` وصف رمز اشتراط بـ تفويض إرسال `description` بصفة حفظ دائم إنشاء وسم، و آخر خارج مقابل قد تحليل فرعي agent `agentOptions.provider`/`model`/`reasoningEffort` و اختياري `persona`/`toolFilter` بناء قيام لقطة، لأجل بارد استعادة. هو أبدا سوف مقابل يمكن دمج توسيع `AgentOptions` كائن بناء قيام لقطة، لذلك غير متصل توسيع قيمة لن كسر تالف متابعة تنفيذ، لاحق إضافة جديدة تركيب إعداد إدخال فإن هو مرة متعمد إصدار أكثر تعديل. وصف رمز حذف `subagentDepth`(بارد استعادة بـ حفظ دائم header في `delegationDepth` بصفة مفرد ضبط تحت حد) و `outputSchema`(مفرد مرة تشغيل أو Activation نتيجة اتفاق، بينما غير حفظ دائم هوية).

محلي مرة صفة مزود سوف في فرعي agent ابتدائي جولة داخل، أول مرة طلب قبل إلحاق وصف رمز. متابعة تنفيذ إدارة جهاز سوف في أي مزود توفير جدول نظام بعد، ابتدائي نص التوجيه نيل دقيق قبل إلحاق وصف رمز؛`Session.inheritedEventCount` ما زال هو fork جدول نظام حد: استعادة وقت وصف رمز مرجعي قراءة فرعي agent ذاته بعد لاحقة، بينما توفير قائمة استخدام هوية إسقاط بـ last-wins طي `subagent/descriptor`، فرعي agent ذاتي ذات وصف رمز سوف تغطية fork seed في أصل أولا وصف رمز.seeded cold list سوف قفز مرور cache hint، مباشر إلى مرجعي observation توفير هذا دقيق cut. هذا حدث فقط دخول سجل: لا يحتوي `surfaceOp`، أبدا دخول نموذج تاريخ، و من فقط إلحاق سجل عبر ضغط إبقاء. صيغة خطأ حالي إصدار وصف رمز يخص ضرر تالف؛ هذا وقت التشغيل لا يمكن مقابل لا تلقي دعم حمل إصدار إجراء تصنيف.

## حفظ دائم قطعة رفع:`listChildren()`،`listDescendants()` و ذلك بند

`SubagentRuntime.listChildren(parentSessionId)` من `ctx.sessions` و جلسة استعلام جذب محرك `listSessions()` فوري أولوية دمج في قطعة رفع parent مباشر كما من جلسة دعم دعم subagent——لن تحميل أو استعادة أي Agent. مرشح هو حمل دائم header يحمل `origin: 'subagent'` مباشر child؛ هذا علامة فقط مسؤول قطعة رفع تصنيف و خشن حبة درجة عام توجيه رفض، لا يستطيع إثبات وصف رمز صالح،child يمكن استعادة أو عملية قد نيل تخويل——هوية من إسقاط طي مسؤول، استعادة من Activation اتفاق مسؤول. كل سطر `mode`/`label` هو قد تسجيل `subagent` projection unit قيمة، مرور ثلاثة درجة مرحلة سلم توفير قيمة: تخزين نشط child من سجل التسجيل ماء موضع ذاكرة مؤقتة توفير قيمة (صفر سجل قراءة) ؛ بارد child أولا قراءة اختياري إسقاط checkpoint ذاكرة مؤقتة (`cachedSnapshot`——مرور own-suffix seq باب هوية أي تحديد قيمة،own descriptor واحد مرور إلحاق غير ممكن تغيير) ؛ لا فإن في مرة `query.observeSession()` بارد مراقبة فوق مرور سجل التسجيل طي (محدود تزامن، كل مرة قائمة إعادة حساب حساب). هذا ذاكرة مؤقتة هو صاف اختياري إضافة سرعة طبقة: خدمة نقص مقعد، سطر داخل هو `null` مراقبة جندي أو key نقص مقعد،seq باب لا مرور، قراءة خروج خطأ، كل ساكن صامت سقوط إلى مرجعي إعادة طي. طي قاعدة هو `subagent/descriptor` last-wins كما لا يوجد فشل عبر طريق: فرعي agent ذاتي ذات وصف رمز تغطية fork seed في أصل أولا وصف رمز، صيغة خطأ أو إصدار لا إقرار تعرف تحميل حمل طي لـ يمكن تسلسل تحويل `null` مراقبة جندي، نظر نفس بلا قيمة. نتيجة هو حسب `createdAt`، مجددا حسب id ترتيب `SubagentListEntry[]`: أخذ إلى هوية أي توليد حمل لديه `mode: 'one-shot' | 'continuable'` و `activity: 'running' | 'inactive'` `child` بند؛ يمكن متابعة بند بداية نهاية يحمل `label`، مرة صفة بند فإن فقط في بدء استدعاء جهة توفير عرض بيانات وصفية وقت يحمل هذا حقل. قد تحديد نطاق بينما طي بلا هوية مرشح توليد `corrupt` diagnostic——ناقص، صيغة خطأ و إصدار لا إقرار تعرف وصف رمز متعمد لم يعد دقيق قسم (`unsupported` ما زال إبقاء في نوع في لكن من لا إنتاج خروج) ؛ تشغيل في بينما بلا هوية مرشح يتم حذف (وصف رمز سقوط قرص قبل إنشاء نافذة) ؛ بارد فحص فشل توليد واحد بند `unavailable` diagnostic و في تحت مرة قائمة ذاتي لكن إعادة محاولة، لذلك واحد ضرر تالف sibling لن إخفاء سليم سليم child.`hasChildren` علامة وجود حمل دائم subagent origin مباشر بعد بديل، قراءة ذاتي نفس نسخة دمج مادة مادة. نشط حركة حالة فقط يمثل منطق سجل هل في `ctx.sessions` في تخزين نشط، بينما لا يمثل نتيجة أو يمكن استعادة صفة. نقص قليل حفظ دائم وقت، قطعة رفع تراجع تحويل لـ فقط تخزين نشط قطعة رفع بينما لا هو تقرير خطأ——هذا وقت بارد child هذا حينئذ لا يمكن استعادة. نقص قليل `ctx.sessionProjections` سجل التسجيل وقت،`listChildren()` رمي خروج يحمل رمز خطأ `SUBAGENT_CONTROL_PROJECTIONS_UNAVAILABLE` `SubagentError`، نقص قليل جلسة تخزين وقت فإن رمي خروج `SUBAGENT_CONTROL_SESSION_STORE_UNAVAILABLE`، اثنان من كل في أي قراءة قبل فحص، لذلك صفر child نشر نفس مثال تحديد فشل؛ قائمة أداة في إضافة تحميل وقت اشتراط `ctx.subagents` و `ctx.agents`.UI انتظار خدمة مستهلك يمكن عرض اثنان نوع نمط، و لـ بلا وسم مرة صفة child اختيار رجوع عرض؛ موجه إلى نموذج `list_agents` مهايئ ([dsh-tool-subagent-control](../../packages/subagent/tool-subagent-control) في يمكن مفرد وحيد تحميل `/list-agents` إضافة) فإن فقط إبقاء يمكن متابعة بند، و عبر في خط Agent سجل التسجيل سوف حالة دقيق تحويل لـ ذاتي ذات `running`/`idle`/`ready` مفردات، منها `ready` يأخذ فقط تخزين في تخزين child تسمية لـ يمكن استعادة بينما غير نهاية حالة. قطعة رفع لن استعلام متابعة تنفيذ إدارة جهاز Activation map،Agent سجل التسجيل أو مزود متاح صفة؛`send_message` ما زال هو رسالة إرسال بلوغ وقت مرجعي عملية، قائمة في تشغيل في يمكن متابعة child ما زال ممكن بسبب كل حق اندفاع مفاجئ بينما رفض إلقاء تمرير.[قد عودة ملف قائمة هوية إسقاط سجل](../../.agents/notes/archived/architecture/2026-08-06-subagent-list-identity-projection.md) سجل الأكثر أول قراءة مسار قرار.

`SubagentRuntime.listDescendants(rootSessionId)` سوف نفس نسخة فوري أولوية لغة مادة و أساس في إسقاط حل تفسير تطبيق إلى أصل كامل بعد بديل شجرة، و حسب مستقر pre-order إخراج. عادي جلسة و مرة صفة child ما زال بصفة مرة تاريخ عقدة، لذلك ذلك تحت يمكن متابعة بعد بديل ما زال يمكن اكتشاف؛ فقط لديه `origin: 'subagent'` مرشح سوف توليد بند. كل إرجاع child أو diagnostic كل من قطعة رفع الذي نيل حمل دائم header مرفق إضافة شجرة موضع؛ بارد فحص في توفير هوية قبل أيضا سوف إعادة تحقق كامل دورة الحياة:

```ts type-equiv
/**
 * One entry of a descendant listing: the interpreted subagent facts plus its
 * position in the complete session tree. `parentId` is the durable direct
 * parent from the enumerated header, and `depth` counts edges from the root.
 */
type SubagentDescendantListEntry = SubagentListEntry & {
  /** Durable direct parent of this candidate in the enumerated tree. */
  readonly parentId: SessionId
  /** Edge distance from the requested root; direct children are `1`. */
  readonly depth: number
}
```


<a id="the-terminal-result-subagentresult"></a>

## نهاية حالة نتيجة:`SubagentResult`

مفرد مرة run نهائي إنتاج خروج، من `SubagentRun.result` resolve.`structured` فقط في طلب `outputSchema` كما نجاح ممتلئ كاف وقت عندئذ وجود؛ طلب schema لا حفظ إثبات واحد تحديد قدرة نيل إلى هو، عند فرعي agent فشل أو انتهاء وقت لم إنتاج خروج صالح capture وقت، مزود ممكن إرجاع `stopReason: 'error'`. مزود يمكن لـ غير `completed` نتيجة مرفق حمل أمان كما لا يخص assistant محتوى `diagnostic`؛ في مستهلك سوف هو و `output` قسم فتح عرض قبل، مزود سوف ترتيب حذف أداة إدخال، ملف محتوى، بيئة قيمة، سند إثبات و أصلي بروتوكول تحميل حمل، و يأخذ كامل قيمة حد في 4096 عدد UTF-8 بايت بـ داخل. غير `completed` `stopReason` معنى طعم حال `output` ممكن لا كامل——مستهلك سوف ذلك خريطة لـ `isError` أداة نتيجة، بينما غير سوف جزء إخراج تقرير إبلاغ لـ نجاح.

```ts type-equiv
/**
 * The terminal outcome of a subagent run, resolved by {@link SubagentRun.result}.
 */
interface SubagentResult {
  /**
   * The child's final assistant output is the content of its last non-empty
   * assistant message. Empty-content messages, including usage-only messages,
   * are skipped. Without a non-empty message, the output is its accumulated
   * assistant text stream, or `[]` when the child produced neither.
   */
  readonly output: ContentBlock[]
  /**
   * The structured result after a requested `outputSchema` was successfully
   * satisfied. Requesting a schema does not guarantee presence: a provider can
   * end with `stopReason: 'error'` when the child fails or finishes without a
   * valid capture. The structured value is validated against the requested
   * output schema by the provider; `unknown` here because the seam is
   * schema-agnostic.
   */
  readonly structured?: unknown
  /**
   * Provider-authored, non-assistant failure detail for a non-`completed`
   * result. Providers keep this text free of tool inputs, file contents,
   * environment values, credentials, and raw protocol payloads, and limit it
   * to 4096 UTF-8 bytes. Consumers present it separately from {@link output}.
   */
  readonly diagnostic?: string
  /** Why the run ended. A non-`completed` reason means `output` may be partial. */
  readonly stopReason: SubagentStopReason
}
```

`SubagentStopReason` هو واحد[يمكن دمج توسيع إرسال توليد ربط دمج نوع](core.ar.md#the-map--derived-union-pattern)——خلفية يمكن إضافة تغيير جسم، لذلك مستهلك ينبغي مقابل معروف case فرع معالجة، سوف لم معرفة نهاية حالة سبب نظر لـ فشل:

```ts type-equiv
/**
 * Why a subagent run ended. Merge-extensible (a backend may add variants);
 * consumers branch on the known cases and fall through `default`. The known
 * cases mirror the harness turn-end vocabulary so the tool layer can map a
 * non-`completed` result to an `isError` tool result.
 */
interface SubagentStopReasonMap {
  /** The child finished its turn normally. */
  completed: 'completed'
  /** Cancelled through the request signal or disposal. */
  aborted: 'aborted'
  /** Model or transport failure. */
  error: 'error'
  /** The child hit its token ceiling before finishing. */
  'max-tokens': 'max-tokens'
  /** The child declined the task. */
  refusal: 'refusal'
}
```

## مفرد مرة run:`SubagentRun`

`SubagentRun` هو مستهلك يحتفظ، إشارة نحو واحد قد إصدار مفرد مرة فرعي agent جملة مقبض——مرة يمكن dispose قبل منصة تفويض إرسال، فقط لديه واحد نتيجة، أبدا هو حفظ دائم فرعي agent handle. إصدار بعد نص التوجيه إيداع، جولة عمل و أساس أساس ضبط تطبيق لذا عائق عودة `result` كل. مستهلك await هذا نتيجة و بداية نهاية dispose هذا run، مباشر حتى تماما توقف مستقر. فرعي agent فشل وقت بـ غير completed stop reason resolve؛ فقط لديه لا يمكن يمثل أساس أساس ضبط تطبيق لذا عائق عندئذ سوف reject.run لا يوجد steering، أيضا لا يوجد استعادة: يمكن متابعة محادثة أصل هذا لا يوجد run، لأن متابعة تنفيذ إدارة جهاز مباشر يحتفظ هو جمع `AgentHandle`، و عبر فرعي agent ذاتي ذات استلام عنصر صندوق لـ كل جولة ترتيب.

```ts type-equiv
/**
 * ONE-SHOT child handle returned after publication. Prompt submission, turn
 * work, and infrastructure faults after that boundary belong to {@link result}.
 * Consumers await that result and must always {@link dispose} to cancel
 * remaining work and reach quiescence. A run is one disposable foreground
 * delegation with one result; continuable conversations have no run — the
 * continuation manager holds their `AgentHandle` directly and orders every
 * turn through the child's own inbox.
 */
interface SubagentRun {
  /**
   * Parent-scoped run id. For a local run, this MUST equal the published child
   * session id, whose `parentSession` records `request.parent.session.id`; a
   * remote provider mints an id unique in the parent namespace.
   */
  readonly id: SessionId
  /**
   * The exact published in-process child, or `undefined` for a remote run.
   * When present, its id is {@link id}; the provider retains no ownership
   * implication beyond the run's ordinary {@link dispose} contract.
   */
  readonly localAgent: Agent | undefined
  /**
   * Resolves with the child's terminal {@link SubagentResult} when the run
   * settles. Does NOT reject on a child-level failure — a model/transport
   * failure resolves with `stopReason: 'error'` so the consumer maps it to an
   * `isError` tool result. Rejects on an infrastructure fault the seam cannot
   * represent as a stop reason.
   */
  readonly result: Promise<SubagentResult>
  /**
   * Cancel remaining work, reach child quiescence, and release resources.
   * Idempotent.
   */
  dispose(): Promise<void>
}
```

محلي مفرد مرة run يجب في `start()` fulfill قبل إصدار واحد عادي فرعي agent/جلسة، سوف هذا فرعي جلسة id بصفة `SubagentRun.id` إرجاع، بـ `localAgent` كشف تأكيد قطع فرعي agent، في فرعي agent `parentSession` header في سجل `request.parent.session.id`، و في فرعي agent ابتدائي جولة داخل، أول مرة طلب قبل إلحاق قد تحليل وصف رمز. وقت التشغيل كل حق يمكن يأخذ فرعي agent وضع في parent، مزود أو root أثر مجال تحت. بعيد مسار مزود فإن إرجاع parent أثر مجال دورة الحياة id و `localAgent: undefined`؛ من في لا يوجد محلي child Session، هو لن ظهور في حفظ دائم قطعة رفع نتيجة في.

<a id="the-provider-contract-subagentprovider"></a>

## مزود اتفاق:`SubagentProvider`

كل مزود كل هو واحد أداة اسم فرعي agent نقل طبقة، كثير عدد مزود يمكن مشترك تخزين. خدمة في `start()` قبل تحقق طلب بدء وقت قدرة، و رفض في لا يوجد `prepareContinuable` مزود فوق إرسال بدء يمكن متابعة start.`inheritsParentContext` فقط وصف محادثة نوع فرعي حقن (`fork`:true؛`spawn` و `acp`:false) ، جعل مستهلك قدرة توليد دقيق تأكيد موجه إلى نموذج إجراء لفظ، بينما لا داكن عرض وراثة أداة، خدمة أو إذن. إذا بعض عدد مزود مرة صفة توجيه يملك ساكن حالة مزود ذاتي لديه قيمة افتراضية، هو سوف عام اختياري كما غير ممكن تغيير `agentRouteDefaults`، جعل Consumer قدرة كاف في مسبق فحص قبل بـ صحيح تأكيد أساس خط دمج نموذج و أداة تغطية.

```ts type-equiv
/**
 * One registered transport for running child agents. Providers are trusted
 * same-process implementations; callers treat descriptors and returned values
 * as borrowed immutable data. The service may call one provider concurrently
 * for distinct children. Providers isolate operation-local mutable state; a
 * shared capacity controller may delay an operation but must not couple its
 * settlement or cleanup to a sibling.
 */
interface SubagentProvider {
  /** Unique registry name (e.g. `spawn`, `fork`, `acp`). */
  readonly name: string
  /** The start-time features this provider supports (see {@link SubagentCapabilities}). */
  readonly capabilities: SubagentCapabilities
  /**
   * Whether the child sees the parent's completed-turn prefix. This is descriptive, not a
   * service-validated start capability: the model-facing tool derives truthful wording from it.
   * It says nothing about tool registration, injected services, or authority inheritance.
   */
  readonly inheritsParentContext: boolean
  /**
   * Optional static provider-owned provider/model route for one-shot Agent
   * options. Consumers merge tool/model overrides over these values before
   * preflight; providers whose route derives from the parent omit it. The value
   * is detached immutable data and requires `agentOptions` support.
   */
  readonly agentRouteDefaults?: Readonly<{ provider: string; model: string }>
  /**
   * Establish a ONE-SHOT child and return its handle after publication.
   * The service has already validated that every requested start-time
   * capability is supported and resolved `request.descriptor`, so a
   * session-backed implementation appends that descriptor inside the child's
   * initial turn. Before fulfillment, the provider owns setup and cleans any
   * unpublished partial resources before rejecting. Ownership transfers on
   * fulfillment; subsequent turn or infrastructure failure settles through
   * the returned run. Distinct starts may overlap; cancellation, failure,
   * result settlement, and disposal remain independent for each run.
   */
  start(request: ResolvedSubagentStartRequest): Promise<SubagentRun>
  /**
   * OPTIONAL (continuable-creation capability): contribute the detached
   * creation inputs that distinguish this provider's continuable children —
   * only whether the child session is seeded with parent history. Method
   * presence IS the capability: the service rejects continuable starts on
   * providers without it, while a provider that has it may still serve
   * ordinary one-shot delegations.
   *
   * This is the provider's ONLY participation in a continuable child. The
   * continuation manager owns identity reservation, composition, Agent
   * creation, prompt delivery, cold resume, ownership, and disposal, so a
   * provider never sees the child's Agent, handle, turns, or teardown.
   * Distinct preparations may overlap; each follows its own signal and returns
   * data belonging only to `request.sessionId`.
   */
  prepareContinuable?(request: ContinuableCreateRequest): Promise<ContinuableCreateSpec>
}
```

مزود `start()` سوف بـ قد إصدار run fulfill. خدمة صب صنع وحيد `runId`، من مزود تأكيد قطع `localAgent` لقطة `local`، مراقبة نتيجة،emit `subagent/start`، و إرجاع نفس عدد run؛`start()` rejection معنى طعم حال لم إصدار مورد قد تنظيف، كما لن emit دورة الحياة حدث مقابل، بينما إصدار بعد نتيجة rejection سوف انتهاء قد emit حدث مقابل. كل يمكن متابعة Activation كل سوف لـ ذلك إقامة إبقاء سجل عنصر emit نفسه فقط مراقبة حدث مقابل، لذلك مرة بارد استعادة حينئذ هو واحد مقطع يملك ذاتي ذات `runId` جديد سجل عنصر. إعداد مقابل `subagent/end` يحمل نفسه معرف و نهائي إخراج أو أساس أساس ضبط تطبيق فشل. اثنان عدد حدث كل فقط لأجل مراقبة، كما سوف عزل كل منها listener استثناء. منها `provider` حقل علامة واضح بدء run أو Activation وقت مقطع مزود، و لا إعلان هذا edge إرسال خروج وقت مزود ما زال موضع في تسجيل حالة.

## عملية داخل خلفية: إذن، عميق درجة و نوع فرعي

spawn و fork خلفية عبر `parent.ctx` إنشاء واحد عادي مفرد مرة agent، سوف إلغاء إشارة نقل دخول نواة قلب إنشاء مسار، و عبر `AgentHandle` إجراء dispose؛ بينما يمكن متابعة فرعي agent فإن من متابعة تنفيذ إدارة جهاز عبر ذلك ذاتي ذات activation-owner أثر مجال إنشاء. إزالة مزود سوف منع توقف جديد start، لكن لن سحب إلغاء قد قبول run. كل فرعي agent نيل نيل واحد جديد مسطح مستو أثر مجال، بينما غير وراثة أب درجة تسجيل. إذن، عميق درجة و fork نوع فرعي حقن إعادة استخدام قائم Session مفردات:

- **تفويض إرسال إذن**في أول مرة await قبل التقاط.Auto و Full access أب درجة في fresh child إتمام fork seed و sandbox/approval override بعد، إلحاق التقاط `permission/preset` هوية. مفرد مرة و يمكن متابعة child مشترك استخدام هذا مسار؛cold resume فقط قراءة child سجل.Read Only و Workspace Write إبقاء وراثة sandbox override إضافة `approval: never`، لا مطابقة مسبق ضبط تركيب ما زال لـ `custom`. كل Auto child استدعاء كل استخدام قائم `parentSession`، إنشاء prompt و مرور مرور نواة تحقق human/مباشر أب درجة رسالة مستقل مراجعة فحص.[Auto review قرار](../../.agents/notes/implemented/feature/2026-08-28-auto-review.ar.md) تعريف low/medium/high دلالة؛ لا زيادة تفويض إرسال سجل،receipt،Header حقل،descriptor حقل أو Session format.

- **تفويض إرسال عميق درجة**من حمل دائم `SessionHeader.delegationDepth` و يمكن دمج توسيع وقت التشغيل حقل `AgentOptions.subagentDepth` مشترك نفس يمثل؛ ناقص يمثل قمة طبقة عميق درجة لـ صفر، وجود مقارنة كبير قيمة أداة لديه مرجعي صفة. اثنان عدد حقل كل عودة هذا seam كل——حلقة حيث لا ضبط أيضا لا قراءة هو جمع——لذلك عملية داخل فرعي agent سوف حمل دائم حفظ parent عميق درجة + 1، بارد استعادة لا يمكن خفض منخفض عميق درجة، بينما كما كل مرة start كل سوف رفض تجاوز خروج أمان كامل عدد مجال، أو عال في قد تعريف قطعا مقابل `request.maxDepth` حد أعلى إرسال توليد عميق درجة.
- **Fork نوع فرعي حقن**استخدام [`CreateAgentOptions.seed`](core.ar.md#creation-and-ownership)(واحد `SessionEvent[]` بادئة، مرور من `AgentLoop.createAgent` → `ctx.sessions.prepare({ seed })` نقل تمرير، و `ctx.agents.resume()` استخدام أصل لغة نفسه).fork خلفية نقل دخول أب درجة سجل واحد مقطع*مستو توازن اكتمل جولة بادئة*——أب درجة حدث مباشر إلى و يشمل ذلك الأكثر بعد واحد `turn/end`——لذلك نوع فرعي من 0 وصل متابعة،[invariants](../../packages/runtime-diagnostics/invariants) إعادة تشغيل يمكن قبول هو (إجراء في، لم مستو توازن جولة يتم ترتيب حذف في خارج).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsubagentmodelselection--subagentmodelselectionconfig"></a>

### `ctx.subagentModelSelection` — `SubagentModelSelectionConfig`

Singleton settings owner read when delegation tools are composed for a Session.

```ts cordis-catalog
/**
 * Read a detached selection preference for the next eligible Session composition.
 * @returns the enabled state and exact allowed routes.
 */
current(): SubagentModelSelectionSettings
```

Source: [`packages/subagent/tool-subagent/src/model-selection-settings.ts`](../../packages/subagent/tool-subagent/src/model-selection-settings.ts)

<a id="ctxsubagents--subagentruntime"></a>

### `ctx.subagents` — `SubagentRuntime`

Named provider registry with one-shot runs, durable discovery, and continuable-child operations.

```ts cordis-catalog
/**
 * Resolve a delegation tool's depth policy against the current user setting.
 * @param configured - Explicit tool limit, or provider-managed for external delegation.
 * @returns The numeric limit, or undefined when the provider owns depth enforcement.
 */
resolveMaxDepth(configured?: number | 'provider-managed'): number | undefined

/**
 * Establish one durable continuable child and deliver its initial prompt.
 * Resolves when the child's inbox accepts that prompt, without waiting for the
 * turn to start or for the message to reach the Session log; any earlier
 * failure rejects with no ids and rolls back the child entirely.
 * @param spec - provider, delegation request, and caller cancellation.
 * @returns the durable child id and the accepted prompt's message id.
 * @throws when continuation services are unavailable or materialization fails.
 */
async startContinuable(spec: ContinuableStartSpec): Promise<ContinuableStart>

/**
 * Steer one model-authored message to the sender's direct parent or direct
 * continuable child. A running target admits it at the nearest step boundary;
 * an idle target starts a turn, and an absent direct child cold-resumes from
 * persistence. The service derives durable sender attribution from the exact
 * live sender. Caller cancellation stops only pre-acceptance work.
 * @param sender - exact live Agent authorizing and originating the message.
 * @param targetId - durable direct-parent or direct-child session id.
 * @param content - model-authored content to deliver.
 * @param options - caller cancellation before inbox acceptance.
 * @returns the accepted message's inbox id.
 * @throws when continuation services are unavailable, adjacency is rejected,
 *   or the message was not admitted.
 */
async sendMessage( sender: Agent, targetId: SessionId, content: ContentBlock[], options: SubagentSendMessageOptions, ): Promise<MessageId>

/**
 * Interrupt one live continuable child's current turn under a human parent
 * address or an exact live ancestor Agent. Fire-and-return: the cancel
 * signal is issued before this returns, but the target may keep running
 * until it observes the signal. Unclaimed pending inbox work, the Activation,
 * and published descendants are preserved; claimed work is not requeued.
 * Once the interrupted driver is idle, a waking send resumes the parked FIFO
 * queue. An absent target — including a one-shot or unknown id —
 * is an accepted no-op, as is a manager-less composition, which cannot own a
 * live Activation.
 * @param targetSessionId - the durable child session id to interrupt.
 * @param authority - the human parent address or exact live ancestor Agent.
 * @throws {SubagentError} `UNAUTHORIZED` when the authority does not own the
 *   live target.
 */
interrupt(targetSessionId: SessionId, authority: SubagentInterruptAuthority): void

/**
 * Close continuable admission below exact live parent Agents, stop only their
 * visible descendant Activations synchronously, then await admitted scoped
 * materializations and release those forests child-first. The scoped cutoff
 * lasts until each exact parent leaves the registry; unrelated parent trees
 * remain live.
 * @param parents - exact host-owned parent Agents entering teardown.
 * @returns once every retained descendant Activation released its `AgentHandle`.
 * @throws an aggregate error after all branches settle when any failed.
 */
async drainContinuableDescendants(parents: readonly Agent[]): Promise<void>

/**
 * Release selected resident continuable direct children of one exact live
 * parent. Other children of the same parent remain admitted and resident.
 * Absent targets and a manager-less composition are accepted no-ops.
 * @param parent - exact live direct parent authorizing the selected release.
 * @param childIds - durable direct-child ids to release when resident.
 * @returns once every selected Activation released its `AgentHandle`.
 * @throws {SubagentError} `UNAUTHORIZED` when a resident target belongs to a
 *   different parent or the supplied parent identity is stale.
 */
async drainContinuableChildren(parent: Agent, childIds: readonly SessionId[]): Promise<void>

/**
 * Enumerate the parent's direct session-backed subagents without loading or
 * resuming an Agent. The Session query service supplies one live-preferred
 * corpus and shared point observations; the projection cache supplies
 * immutable descriptor hits without opening cold logs. The registered
 * `subagent` projection remains the sole mode/label classifier.
 *
 * Every query receives `signal`, and the listing rechecks cancellation
 * around each await. Read rejections that settle
 * after an abort become a stable `SubagentError` with code `CANCELLED`.
 * @param parentSessionId - parent session whose direct children are listed.
 * @param signal - caller-owned cancellation forwarded to Session queries
 *   and observed around every read await.
 * @returns children and per-child diagnostics ordered by `createdAt`, then id.
 * @throws {@link SubagentError} when the projection registry or the session
 *   store is not mounted, or the caller cancels the listing.
 */
listChildren(parentSessionId: SessionId, signal?: AbortSignal): Promise<SubagentListEntry[]>

/**
 * Enumerate the root's complete session-backed subagent tree in stable
 * pre-order from one live-preferred corpus, without loading or resuming an
 * Agent. Ordinary sessions and one-shot children remain traversal nodes so
 * continuable descendants below them are discovered; each returned entry
 * adds its durable `parentId` and root-relative `depth`. Identity resolution,
 * diagnostics, optional persistence, and cancellation follow the same
 * projection-backed contract as {@link listChildren}.
 * @param rootSessionId - session whose complete descendant tree is listed.
 * @param signal - caller-owned cancellation forwarded to persistence reads
 *   and observed around every read await.
 * @returns children and per-candidate diagnostics with tree position, in
 *   stable pre-order.
 * @throws {@link SubagentError} under the same conditions as {@link listChildren}.
 */
listDescendants(rootSessionId: SessionId, signal?: AbortSignal): Promise<SubagentDescendantListEntry[]>

/**
 * Remote face of {@link listChildren} for one browser: the durable listing
 * plus live Agent activity and the delivery-time parent availability hint.
 * Parent availability is a hint; {@link prompt} performs the authoritative
 * check. Named apart from the provider-name {@link list}, which owns the
 * member.
 * @param parentSessionId - parent session whose direct children are listed.
 * @param signal - carrier cancellation forwarded to Session queries.
 * @returns the catalog view for that parent.
 * @throws {RemoteError} `gateway/bad-request` for an empty parent id,
 *   `gateway/cancelled` for an aborted read, `subagent/projections-unavailable` when
 *   the deployment has no projection registry, otherwise `gateway/internal`.
 */
@Remote('list') async remoteExportList(parentSessionId: SessionId, signal: AbortSignal): Promise<SubagentCatalog>

/**
 * Deliver one browser-authored message to a continuable child through the
 * exact live direct parent, retaining the caller-minted request identity and
 * validated browser zone on the accepted message. Success identifies the
 * message the child's inbox accepted; later execution is independent of this
 * call. Queue delivery targets a later turn; steer delivery targets the
 * nearest step and retains the Agent loop's best-effort fallback semantics.
 * Image parts are admitted and persisted through the attachment store
 * before delivery, and the child's model must accept image input.
 * Cold resume at capacity rejects with `subagent/delivery-unavailable`.
 * @param request - durable address, delivery, minted identity, content, and optional browser zone.
 * @param signal - carrier cancellation, owning the call until inbox acceptance.
 * @returns the accepted message's inbox identity.
 * @throws {RemoteError} `gateway/bad-request`, `subagent/attachment-invalid`,
 *   `subagent/invalid-time-zone`, `subagent/parent-unavailable`,
 *   `subagent/not-resumable`, `subagent/unauthorized`,
 *   `subagent/delivery-unavailable`, `gateway/cancelled`, or `gateway/internal`.
 */
@Remote('prompt') async prompt(request: SubagentPromptRequest, signal: AbortSignal): Promise<SubagentPromptReceipt>

/**
 * Remote face of {@link interrupt} under one durable parent address. No
 * catalog, history, persistence, or parent Agent lookup runs: the core
 * primitive alone authorizes the address against the live Activation, which
 * is what keeps a live child interruptible while its parent Agent is offline.
 * Absent, idle, and already-completed targets are accepted no-ops there.
 * @param childSessionId - durable child session id to interrupt.
 * @param parentSessionId - durable direct parent whose authority is claimed.
 * @param mode - required continuable-address discriminator.
 * @returns acknowledgement that the cancel signal was admitted, not that the target is quiescent.
 * @throws {RemoteError} `gateway/bad-request` for an empty id,
 *   `subagent/unauthorized` when the address does not own the live target,
 *   otherwise `gateway/internal`.
 */
@Remote('interruptByParent') interruptByParent( childSessionId: SessionId, parentSessionId: SessionId, mode: 'continuable', ): SubagentInterruptReceipt

/**
 * Register a provider under its name. Registration is effect-scoped and HMR
 * safe; removing a provider blocks new starts but does not revoke runs that
 * were already returned to their holders.
 * @param provider - the trusted provider implementation.
 * @returns the exact Cordis effect disposer.
 */
registerProvider(provider: SubagentProvider): () => void

/**
 * Look up a provider by name.
 * @param name - the provider name.
 * @returns the provider, or undefined when absent.
 */
getProvider(name: string): SubagentProvider | undefined

/**
 * List registered provider names in insertion order.
 * @returns the registered names.
 */
list(): string[]

/**
 * Establish a published child on the named provider. Capability and semantic
 * checks run before delegation. Provider ownership lasts until its promise
 * fulfills; a rejection therefore has no run for the caller to dispose and
 * emits no run lifecycle events. Post-publication turn and infrastructure
 * failures settle through the returned run.
 * A catalog append failure disposes the run and handles its result rejection;
 * the caller receives the catalog error even if disposal also fails.
 * @param name - the provider to use.
 * @param request - child label, prompt, parent, signal, and optional capabilities.
 * @returns the published holder-owned run.
 */
async start(name: string, request: SubagentStartRequest): Promise<SubagentRun>
```

Types: [Agent](core.ar.md) · [ContentBlock](llm-streaming.ar.md) · [MessageId](llm-streaming.ar.md) · [SessionId](core.ar.md)

Source: [`packages/subagent/subagent/src/index.ts`](../../packages/subagent/subagent/src/index.ts)

<a id="subagent-events"></a>

### `subagent/*` events

<a id="subagentend--emit"></a>

#### `subagent/end` — emit

A published child settled. Scope-filtered dispatch uses the same delegating parent carrier as `subagent/start`, so the lifecycle pair reaches the same scoped audience.

```ts cordis-catalog
/**
 * A published child settled. Scope-filtered dispatch uses the same delegating
 * parent carrier as `subagent/start`, so the lifecycle pair reaches the
 * same scoped audience.
 * @param info - the run identity and terminal outcome.
 * @dshScopeScan unsupported
 * @mode emit
 */
'subagent/end'(this: Scoped<SubagentRuntime>, info: SubagentRunEndInfo): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/subagent/subagent/src/index.ts`](../../packages/subagent/subagent/src/index.ts)

<a id="subagentprovider-added--emit"></a>

#### `subagent/provider-added` — emit

A provider became resolvable in the registry.

```ts cordis-catalog
/**
 * A provider became resolvable in the registry.
 * @param provider - the registered provider.
 * @mode emit
 */
'subagent/provider-added'(provider: SubagentProvider): void
```

Source: [`packages/subagent/subagent/src/index.ts`](../../packages/subagent/subagent/src/index.ts)

<a id="subagentprovider-removed--emit"></a>

#### `subagent/provider-removed` — emit

A provider left the registry. Accepted runs remain holder-owned.

```ts cordis-catalog
/**
 * A provider left the registry. Accepted runs remain holder-owned.
 * @param name - the provider name that no longer resolves.
 * @mode emit
 */
'subagent/provider-removed'(name: string): void
```

Source: [`packages/subagent/subagent/src/index.ts`](../../packages/subagent/subagent/src/index.ts)

<a id="subagentstart--emit"></a>

#### `subagent/start` — emit

A provider established a published child. For in-process providers, `ctx.agents.get(info.id)` resolves during this notification. Scope-filtered dispatch keys the carrier by the delegating parent, so a parent-scoped listener observes only its own delegations. Paired with `subagent/end`.

```ts cordis-catalog
/**
 * A provider established a published child. For in-process providers,
 * `ctx.agents.get(info.id)` resolves during this notification.
 * Scope-filtered dispatch keys the carrier by the delegating parent, so a
 * parent-scoped listener observes only its own delegations. Paired with
 * `subagent/end`.
 * @param info - the provider and published child identity.
 * @dshScopeScan unsupported
 * @mode emit
 */
'subagent/start'(this: Scoped<SubagentRuntime>, info: SubagentRunInfo): void
```

Types: [Scoped](scope.ar.md)

Source: [`packages/subagent/subagent/src/index.ts`](../../packages/subagent/subagent/src/index.ts)
<!-- END GENERATED cordis-surface -->

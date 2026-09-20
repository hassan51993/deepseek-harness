# الوكلاء الفرعيون

[English](subagent.md) | العربية

يتيح seam الوكلاء الفرعيين للوكيل أن يفوّض عملًا إلى وكيل ابن. وهو، مثل [bash](shell.ar.md)، **قدرةٌ اختيارية واحدة**، لا جزءٌ من agent loop، فتعيش أنواعُه هنا لا في [core.md](core.ar.md). ويفترق عن seams القدرات الأخرى لأن **تنفيذاتِ مزوّدين متعددة تتعايش** في سياق واحد، مسجَّلةً بالاسم (`ctx.subagents`)، بينما لا يسمح bash إلا بمنفّذ واحد. ويتبع سجلُّه [سجل مهايئات LLM](llm-streaming.ar.md)، لا منفّذَ bash ذا الخدمة الواحدة.

تعريفُ الخدمة: [dsh-subagent](../../packages/subagent/subagent) (`ctx.subagents` والمفرداتُ أدناه). ومزوّدو الخدمة حزمٌ شقيقة (`dsh-subagent-spawn-in-process` و`dsh-subagent-fork-in-process` و`dsh-subagent-acp` و`dsh-subagent-codex` و`dsh-subagent-claude-code` و`dsh-subagent-dsh-sdk`)؛ والمستهلكان اللذان يراهما النموذج هما [dsh-tool-subagent](../../packages/subagent/tool-subagent) (التفويضُ لكل مزوّد) و[dsh-tool-subagent-control](../../packages/subagent/tool-subagent-control) (وهو ضوابطُ `send_message` و`interrupt_agent` و`list_agents` العامة الاختيارية). وتملك خدمةُ `ctx.subagents` نفسُها تنسيقَ الأبناء القابلين للمتابعة عبر مدير تفعيل داخلي، واكتشافَ الأبناء والأحفاد للقراءة فقط من مخزن الجلسات ومن الحفظ الدائم الاختياري مباشرةً. ويعيش مسوّغُ مزوّدي المنتَجات في [ملاحظة الوكيل عن Codex وClaude Code](../../.agents/notes/implemented/feature/2026-08-04-claude-code-and-codex-subagent-backends.ar.md)؛ ويعيش مسوّغُ الـseam المشترك في [ملاحظة الوكيل عن seam قدرة الوكلاء الفرعيين](../../.agents/notes/implemented/feature/2026-06-21-subagent-capability-seam.ar.md) و[ملاحظة الوكيل عن الوكلاء الفرعيين القابلين للمتابعة](../../.agents/notes/implemented/feature/2026-07-28-continuable-subagent-conversations.ar.md) و[ملاحظة الوكيل عن مراسلة الوكلاء المتجاورين](../../.agents/notes/implemented/architecture/2026-08-27-adjacent-agent-steer-messaging.ar.md)؛ ويوثّق [سجل إسقاط هوية القائمة المؤرشَف](../../.agents/notes/archived/architecture/2026-08-06-subagent-list-identity-projection.md) قرارَ هوية القائمة الأصلي.

المصادر: [`packages/subagent/subagent/src/types.ts`](../../packages/subagent/subagent/src/types.ts) و[`packages/subagent/subagent/src/index.ts`](../../packages/subagent/subagent/src/index.ts) و[`packages/subagent/subagent/src/continuation.ts`](../../packages/subagent/subagent/src/continuation.ts)

ويكشف إسقاطُ `subagentCatalog` مصفوفةَ `SubagentCatalogEntry[]` بترتيب أحداث الأب عبر مراقبات الجلسة ولقطات العميل. ويحتوي كلُّ مدخل معرّفَ الابن ووقتَ الإنشاء والوضعَ والتسميةَ التابعة للوضع؛ وتُستبعد حقائقُ الدليل الموروثة بالتفريع. وتملك [حزمةُ الوكلاء الفرعيين](../../packages/subagent/subagent/README.ar.md) دلالاتِ إنشاء الدليل وحفظه الدائم.

## صنفا قدرة يُكتشفان بطريقتين

يعلن المزوّدُ ملامحَه **وقتَ البدء** في واصف ساكن تفحصه الخدمةُ قبل أن يوجد تشغيلٌ ذو لقطة واحدة؛ والطلبُ الذي يحتاج إلى ملمح لا يملكه المزوّد يُرفض بصوت عالٍ (`SubagentError('UNSUPPORTED_CAPABILITY')`)، ولا يُقبل ثم يُتجاهل قط. ولا تصف تلك الراياتُ إلا مسارَ [`start()`](#the-provider-contract-subagentprovider) ذا اللقطة الواحدة، حيث يركّب المزوّدُ الابن. أما الأبناءُ **القابلون للمتابعة** فيركّبهم مديرُ المتابعة نفسُه، فتحكمهم طريقةٌ اختيارية واحدة حضورُها هو القدرةُ نفسُها، وتضييقُ TypeScript هو آليةُ الاكتشاف: [`SubagentProvider.prepareContinuable`](#the-provider-contract-subagentprovider).

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

## طلب البدء ذو اللقطة الواحدة

تبني طبقةُ الأدوات هذا الطلبَ من مُدخَل النموذج ومن ضبطها، وتتحقق الخدمةُ منه في مقابل المزوّد المسمّى قبل `start`. ويقدّم `parent` المشترَط دليلَ عمل الجلسة والنسبَ وعمقَ التفويض. وتشترط تجاوزاتُ مزوّد الوكيل والنموذجِ وجهدِ الاستدلال والرموزِ الاختيارية، وschema الخرج، والعمقُ، ومرشّحُ الأدوات، والشخصيةُ راياتِ قدرة مطابِقة. وتدمج الخلفياتُ داخل العملية `agentOptions` فوق خيارات وكيل الأب، وتحدّ المرشّحاتِ والشخصياتِ بإنشاء الابن، وتنفّذ schema المجذور بكائن المدعوم مع أداة التقاط مفروضة. وتدمج خلفيةُ DSH SDK حقولَ مسار الوكيل الأربعةَ فوق افتراضات نسختها وتتحقق منها في تهيئة بيئة تشغيل الابن؛ وترفض ACP وCodex وClaude Code قيمةَ `agentOptions` قبل بدء نقلها.

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

و`signal` قناةُ الإلغاء الوحيدة قبل الجاهزية وبعدها. وتملك [ملاحظة الوكيل عن ضوابط تركيب الوكلاء الفرعيين](../../.agents/notes/implemented/feature/2026-07-12-subagent-persona-tool-filter-and-depth.ar.md) مسوّغَ الشخصية ومرشّحِ الأدوات العام الحي والعمقِ المطلق وقاعدةِ «الرؤيةُ ليست سلطة».

ولا يحمل الطلبُ الذي يراه المستدعي تفاصيلَ صيغة الدليل ولا حالةَ المتابعة. وتحلّ `SubagentRuntime.start()` الواصفَ المنفصل ذا اللقطة الواحدة بعد فحوص القدرة، ثم تمرّر هذا الطلبَ الذي يراه المزوّدُ إلى النقل المنتقى؛ ولا يبلغ ابنٌ قابل للمتابعة `SubagentProvider.start()` قط:

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

## الأبناء القابلون للمتابعة والتفعيلات

**الوكيلُ الفرعي الخلفي القابل للمتابعة** جلسةُ ابن دائمة واحدة لها **تفعيلٌ** محلي في العملية واحد على الأكثر، وهو الفترةُ التي يكون فيها وكيلُ الابن المعادُ بناؤه مقيمًا. والتفعيلُ ليس طلبًا ولا نتيجةً ولا إلغاءً ولا مهمة: فقد ينفّذ جولاتٍ كثيرة بترتيب الوصول ويبقى مقيمًا ما دامت أحفادُه التي أنشأها تعمل. ويملك مديرُ المتابعة قبولَ التفعيل، وتخويلَ الأب المباشر، ورسمَ الملكية الحي، والاستئنافَ من البارد، والتخلصَ الذي يبدأ بالأبناء؛ وتملك agent loop كلَّ ترتيب جولات وتنفيذها. ولا ينشئ أيُّ مسار متابعة مهمةً ولا مغلِّفًا وسيطًا يحمل نتيجة.

```text
persisted Session
  -> optional live Activation
       -> one retained AgentHandle
       -> Agent inbox as the only turn FIFO
       -> zero or more owned child Activations
```

وتحجز `SubagentRuntime.startContinuable()` معرّفَ الابن الثابت، وتلتقط حمولةَ `subagent/descriptor` الموسومة بإصدار، وتطلب من المزوّد المسمّى قيمةَ `ContinuableCreateSpec` المنفصلة لديه، وتنشئ وكيلَ الابن عبر نطاق مالك تفعيل خاص، وتُرسي أيَّ ملكية أب قابل للمتابعة، وتقدّم المطالبةَ الأولى. وتحلّ بـ`{ childId, messageId }` حين يُنتج قبولُ صندوق الوارد معرّفَ الرسالة — بلا انتظار بدء الجولة ولا دخول الرسالة سجلَّ الجلسة. وكلُّ فشل قبل ذلك القبول يرفض بلا أي من المعرّفين، فيتخلص من أي مقبض أُنشئ ويتراجع عن التفعيل وعن ملكية الأب.

و`SubagentRuntime.sendMessage()` هي عمليةُ الرسائل الوحيدة التي يؤلفها النموذج. وهي تقبل المرسِلَ الحي بعينه مع معرّف هدف، ولا تسمح إلا بأب مباشر أو ابن مباشر قابل للمتابعة، وتشتق نسبةَ المرسِل بنفسها، وتوجّه هدفًا هو ابنٌ مباشر بحسب إقامة التفعيل:

| حالة تفعيل الهدف | `sendMessage` |
|---|---|
| `running` | وجِّه أقربَ خطوة في التفعيل نفسِه |
| `waiting` | أيقِظ التفعيلَ نفسَه ووجِّهه |
| لا تفعيل | استأنف من البارد تفعيلًا جديدًا ثم وجِّهه |

و`running` تعني أن للوكيل قائدًا نشطًا أو مهمةَ صيانة؛ و`waiting` تعني ألّا نشاطَ وكيل نشطًا لكن صندوقَ وارده غيرُ فارغ أو يملك تفعيلَ ابن واحد على الأقل لم يكتمل التخلصُ منه؛ و`settled` تعني ألّا نشاطَ وكيل نشطًا وأن صندوقَ الوارد فارغ وأن كلَّ ابن مملوك قد تُخلّص منه، وعندها يتخلص المديرُ من [`AgentHandle`](core.ar.md#creation-and-ownership) ويزيل التفعيل. ويشتق المديرُ هذه الشروطَ الداخلية من `Agent.whenIdle()` و`Agent.inbox.hasPending` ومجموعةِ الأبناء المملوكة وجيلِ تفعيل يُبطل المراقباتِ القديمة، بدل صيانة آلة حالة تنفيذ ثانية. وبعد دفع الجلسة الأخير، يستعمل قرارُ قفل الابن المدخلَ المتزامن لـ`Agent.runMaintenance()` ليدّعي طورَ الخمول ويغلق القبولَ في نبضة JavaScript نفسِها. ولا تميّز هذه القاعدةُ المتحفظة بين أوضاع التسليم: فالسياقُ الذي تركنه `Agent.inject()` قد يُبقي تفعيلًا خاملًا وأسلافَه الأحياء مقيمين حتى يدّعيه تسليمٌ موقظ، أو يزيله تغييرُ طابور، أو يهمله تفكيكُ المدير.

وصندوقُ وارد الوكيل هو الطابورُ الوحيد. وتستعمل كلُّ رسالة وكيل `Agent.steer()`: فالهدفُ الخامل يبدأ جولة، والهدفُ العامل يدّعيها عند أقرب حدّ خطوة. وتحمل Remote المسماة `subagent.prompt` في المتصفح على حدة `delivery: 'queue' | 'steer'` عبر مسار القبول الداخلي نفسِه؛ فتفتح `queue` جولةً لاحقة بترتيب الوصول، بينما تحتفظ `steer` بسلوك «أقرب خطوة على قدر الاستطاعة» في agent loop وبمصدر الرسالة البشري. ويعيد التسليمُ الناجح `MessageId` المقبول؛ وتبقى أحداثُ `agent/inbox/inserted` و`agent/inbox/claimed` و`agent/inbox/discarded` القائمة مراقباتِ دورة حياة الرسالة، ولا تعرّف طبقةُ المتابعة طابورًا ثانيًا.

والسلطةُ من المرسِل الحي بعينه. فتسليمُ الأب إلى الابن يشترط أن يسمّي `SessionHeader.parentSession` لدى الهدف المرسِلَ؛ وتسليمُ الابن إلى الأب يشترط أن يسمّي تفعيلُ المرسِل المقيم الهدفَ. وتُرفض الأشقّاءُ والأسلافُ وراء حافة واحدة والأهدافُ الذاتية وكائناتُ الوكلاء القديمة والأبناءُ ذوو اللقطة الواحدة. وتُؤطَّر كلُّ رسالة مقبولة بالصيغة `Agent <sender-id> sent a message:` وتسجّل `AgentMessageSource`؛ ويسجّل المصدرُ المرسِلَ لكنه لا يمنح سلطة.

وفي `startContinuable()` و`sendMessage()` وتسليم مطالبة المتصفح، لا تملك إشارةُ المستدعي إلا البحثَ والتجسيدَ والقبولَ حتى قبول صندوق الوارد. وبعدها يملك المديرُ التفعيلَ مستقلًّا: فإلغاءُ المستدعي لاحقًا لا يلغي الجولةَ المقبولة ولا يتخلص من الابن. ولا تكشف خدمةُ الوكلاء الفرعيين العلنية جدولةَ رسائل وكيل يختارها المستدعي؛ ويبقى Queue وSteer البشريان في المتصفح خيارَي مهايئ داخليين.

ويبقى تغييرُ مناسبات الطابور الحية في مجال الجلسة. وتقبل `session.updateQueue` عملياتِ Edit وRemove وQueueDock Steer المعتادة لوكيل حي يملكه وكيلٌ فرعي فقط حين تكون هويتُه المسقَطة الحالية قابلةً للمتابعة ويكون تسلسلُ واصفه في اللاحقة غير البذرية لذلك الابن. ويطوي إسقاطُ الهوية الواصفاتِ بمبدأ «الأخيرُ يغلب» فيتجاوز واصفُ الابن الواصفاتِ المحفوظة من نسب التفريع؛ ويمنع فحصُ تسلسل اللاحقة الذاتية هويةَ سلف بذرية فقط من تخويل التغيير. وتبقى الأبناءُ ذوو اللقطة الواحدة والمفقودون والمجهولون والفاسدون والباردون مرفوضين، ولا يستأنف تغييرُ الطابور ابنًا من البارد قط. ومعرّفُ الجلسة الهدف هو السلطةُ البشرية لهذه التغييرات، بما فيها توجيهُ `nextStep` المعلَّق أو السياقُ المحقون. ويشترط Steer معرّفَ `MessageId` مصطفًّا ووكيلًا يبلّغ أنه عامل حين يبدأ الأمر؛ ويستعمل الإلغاءُ بعد القبول احتياطيَّ `nextTurn` الموقظ المقبول لدى الوكيل. ويعيد Edit كتابةَ المحتوى تحت `MessageId` نفسِه، ويُكمل Edit وSteer عملَهما في صندوق الوارد متزامنًا، فلا يرصد الاستقرارُ إلا الحالةَ النهائية. ويوقظ `agent/inbox/claimed` و`agent/inbox/discarded` المراقبَ ليعيد قراءةَ أبقيت مناسبةٌ معلَّقة؛ فيتيح ذلك للتسليم المباشر إلى الوكيل استئنافَ العمل المركون، ويتيح لإزالة آخر مناسبة مركونة أن تُسكِّن ابنًا خاملًا. وتملك [ملاحظة الوكيل عن تحكم البشر في صندوق الوارد](../../.agents/notes/implemented/feature/2026-08-27-continuable-subagent-human-inbox-control.ar.md) هذه الدلالات.

و`SubagentRuntime.interrupt(targetSessionId, authority)` هي الإيقافُ العلني الوحيد: فهي تخوّل متزامنةً، وتُصدر `Agent.cancel(cause, { keepInbox: true })` على الهدف الحي، وتعود بلا انتظار السكون. ويبقى التفعيلُ وعملُ صندوق وارده المعلَّق غيرُ المدّعى وأحفادُه المنشورون بلا مساس؛ والعملُ المدّعى سلفًا في الجولة المقطوعة لا يُعاد اصطفافُه. وحالما يخمل القائدُ المقطوع، يستأنف إرسالٌ موقظ الطابورَ المركون بترتيب الوصول. والهدفُ الغائب — المجهولُ أو ذو اللقطة الواحدة أو المستقر سلفًا — والتركيبُ بلا مدير عملياتٌ مقبولة بلا أثر. أما للهدف الحي، فعنوانُ أب غيرُ مطابق أو مستدعٍ خارج نسبه الحي يرفض بـ`UNAUTHORIZED`؛ وترفض كائناتُ الأسلاف القديمة وطلباتُ الأسلاف التي تستهدف نفسَها قبل البحث عن الهدف.

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

ويملك كلُّ تفعيل `AgentHandle` لديه ومجموعةَ `ownedChildren: Set<SessionId>`؛ ولأن للجلسة الواحدة تفعيلًا حيًّا واحدًا على الأكثر، يحدد معرّفُ جلسة الابن الابنَ الحيَّ بلا مرجع تجسّد آخر في وقت التشغيل. ويسجّل بدءُ ابن أو تقديمُ عمل منشؤه الأبُ الابنَ في مجموعة أب يديره المتابعةُ قبل أن يستطيع الابنُ العملَ، ولا يستطيع ذلك الأبُ الاستقرارَ ما دامت المجموعةُ غيرَ فارغة. والوكيلُ الأعلى أو أيُّ وكيل خارج المتابعة لا تفعيلَ له ويبقى خارج رسم الانتظار. ولا يُحرَّر الابنُ إلا بعد أن يخلو من عمل وكيل نشط، ويفرغ صندوقُ وارده، ويُتخلَّص من كل ابن له، ويستقر دفعُ الجلسة النهائي على قدر الاستطاعة، ويكتمل التخلصُ من `AgentHandle` لديه.

وينتظر الاستقرارُ النهائي `ctx.sessions.flush(session)` لكنه يتجاهل قيمتَه المنطقية للمشاركة لأن مستمعًا كيفما كان لا يستطيع إثباتَ أن خلفيةَ حفظ دائم خزّنت الحالة. ويُسجَّل الرفضُ بلا إفشال التفعيل، ويظل المديرُ يتخلص من المقبض ويحرّر الملكية؛ وقد تكون حالةُ الابن المحفوظة عندئذ مفقودةً أو قديمة عند استئناف لاحق. ويستدعي تفريغُ المدير تصريفًا داخليًّا على مستوى المدير يغلق القبولَ ويتخلص من كل غابة حية؛ وتغلق `drainContinuableDescendants(parents)` القبولَ تحت الوكلاء الأحياء الذين يملكهم المضيفُ بعينهم وحدهم وتتخلص من أحفادهم القابلين للمتابعة بينما تبقى الغاباتُ غيرُ المتصلة حية. والاثنتان تنتظران التجسيداتِ المقبولة سلفًا في نطاقهما، وتنشران الإلغاءَ من الأعلى إلى الأسفل، وتحرّران المقابضَ بدءًا بالأبناء، وتنتظران كلَّ فرع منتقى رغم الإخفاقات المفردة. وتنجو جلساتُ الأبناء الدائمة من ذلك التفكيك المحلي في العملية.

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

وحين يستقر تفعيلٌ مقيم، يسلّم المديرُ إشعارًا واحدًا إلى أب الابن المباشر الدائم يصف كيف انتهى ذلك العهدُ ويحمل كتلَ النص غير الفارغة من خرج مساعده النهائي، أو يحمل `It left no closing message.` حين لا تبقى كتلٌ. وذلك التسليمُ غيرُ مشروط لكل ابن تلقى مستدعٍ معرّفَه، ويقع قبل تحرير الملكية الذي سيتيح الحكمَ على الأب بالاستقرار، ويبلغ أبًا مقيمًا عبر تسليم الوكيل الموقظ نفسِه الذي تبلغه رسالةُ وكيل. والأبُ الذي يتفكك نسبُه سلفًا يتلقاه بلا إيقاظ، لأن إيقاظَ وكيل خامل يبدأ جولةً بدل اصطفاف عمل. ولمصدره صنفٌ متمايز، فلا يعرض نصُّ محادثة قط روايةَ وقت تشغيل بوصفها شيئًا كتبه الابن.

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

ولا يشارك المزوّدُ إلا في إعداد مواصفة الإنشاء الأولى، حيث يفترق `spawn` عن `fork`. ولا تحمل المواصفةُ المعادة إلا مُدخَلاتِ إنشاء منفصلة خاصة بالمزوّد — وهي بذرةُ تاريخ الأب الاختيارية — بلا وكيل ولا `AgentHandle` ولا تسليمِ مطالبة ولا نتيجة ولا تخلصٍ ولا عملية استئناف. ولا يوزّع الاستئنافُ من البارد عبر مزوّد البتة: فيطوي المديرُ الواصفَ العام، وينادي `ctx.agents.resume()` عبر نطاق مالك التفعيل نفسِه، ويقدّم الجولةَ المنتظِرة.

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

والواصفُ (`SubagentDescriptorData` في [descriptor.ts](../../packages/subagent/subagent/src/descriptor.ts)) هويةٌ دائمة مميَّزة بالوضع لكل وكيل فرعي مسنَد إلى جلسة. ويحمل الوضعان اسمَ المزوّد. ويحمل واصفُ `one-shot` اختياريًا تسميةَ عرض `label` يملكها المستدعي؛ ويشترط واصفُ `continuable` قيمةَ `description` التفويض تسميةَ إنشاء دائمة لديه، ويلتقط زيادةً على ذلك قيمَ `agentOptions.provider` و`model` و`reasoningEffort` المحلولة للابن و`persona` و`toolFilter` اختياريًا للاستئناف من البارد. وهو لا يلتقط قط كائنَ `AgentOptions` القابل للتوسعة بالدمج، فلا تستطيع قيمةُ امتداد لا صلةَ لها كسرَ المتابعة، ويكون مُدخَلُ تركيب لاحق تغييرَ إصدار متعمَّدًا. وهو يُغفل `subagentDepth` (فالاستئنافُ من البارد يثق بـ`delegationDepth` في الترويسة المحفوظة أرضيةً تصاعدية) ويُغفل `outputSchema` (فهو عقدُ نتيجة تشغيل أو تفعيل واحد، لا هويةً دائمة).

ويُلحق مزوّدٌ محلي ذو لقطة واحدة الواصفَ داخل جولة الابن الأولى قبل أول طلب له. ويُلحق مديرُ المتابعة الواصفَ بعد أي نسب يقدّمه المزوّد وقبل قبول المطالبة الأولى؛ ويبقى `Session.inheritedEventCount` حدَّ نسب التفريع: فتقرأ سلطةُ الواصف وقتَ الاستئناف اللاحقةَ الذاتية للابن، بينما يطوي إسقاطُ الهوية الذي يخدم القائمةَ حدثَ `subagent/descriptor` بمبدأ «الأخيرُ يغلب» فيتجاوز واصفُ الابن واصفَ سلف مبذور بالتفريع. وتتخطى قائمةٌ باردة مبذورة تلميحَ المخزن حتى تقدّم مراقبةٌ مرجعية ذلك القطعَ بعينه. والحدثُ للسجل فقط: فلا `surfaceOp` له، ولا يدخل تاريخَ النموذج قط، ويحفظه السجلُّ ذو الإلحاق فقط عبر الضغط. والواصفاتُ المشوَّهة من الإصدار الحالي فاسدة؛ والإصداراتُ غيرُ المدعومة لا تستطيع بيئةُ التشغيل هذه تصنيفَها.

## التعداد الدائم: `listChildren()` و`listDescendants()` ومداخلُهما

تعدّد `SubagentRuntime.listChildren(parentSessionId)` وكلاءَ الأب الفرعيين المباشرين المسنَدين إلى جلسات من الدمج الذي يُفضَّل فيه الحي بين `ctx.sessions` و`listSessions()` في محرّك الاستعلام عن الجلسات — فلا يُحمَّل وكيلٌ ولا يُستأنف. والمرشحون هم الأبناءُ المباشرون الذين تحمل ترويستُهم الدائمة `origin: 'subagent'`؛ ويصنّف الواسمُ التعدادَ والمنعَ الخشن للمسار العام لكنه لا يستطيع إثباتَ واصف صالح ولا قابلية استئناف ولا تخويل — فيملك طيُّ الإسقاط الهويةَ، ويملك عقدُ التفعيل الاستئنافَ. و`mode` و`label` في كل صف قيمةُ وحدة إسقاط `subagent` المسجَّلة، تُقدَّم عبر سلّم من ثلاث درجات: مخزنُ العلامة المائية في السجل لابن حي (بلا قراءات سجل)؛ ومخزنُ نقاط تفتيش الإسقاط الاختياري لابن بارد (`cachedSnapshot` — والهويةُ التي تجتاز بوابةَ تسلسل اللاحقة الذاتية نهائية، لأن الواصفَ الذاتي غيرُ قابل للتغيير حالما يُلحق)؛ وإلا فمراقبةٌ باردة واحدة بـ`query.observeSession()` مطويةً عبر السجل (بتوازٍ محدود، وتُعاد حوسبتُها لكل تعداد). والمخزنُ مسرّعٌ اختياري محض: فغيابُه، أو تقديمُه علامةَ `null`، أو عدمُ وجود المفتاح، أو فشلُ بوابة التسلسل، أو عطبُه — كلُّ ذلك يسقط صامتًا إلى إعادة الطي المرجعية. والطيُّ هو `subagent/descriptor` بمبدأ «الأخيرُ يغلب» بلا قناة فشل: فيتجاوز واصفُ الابن واصفَ سلف مبذور بالتفريع، وتُطوى حمولةٌ مشوَّهة أو من إصدار مجهول إلى علامة `null` قابلة للتسلسل تُعامل بوصفها بلا قيمة. والنتيجةُ مصفوفةُ `SubagentListEntry[]` واحدة بترتيب `createdAt` ثم المعرّف: فالهويةُ المقدَّمة تُنتج مدخلَ `child` بقيمة `mode: 'one-shot' | 'continuable'` و`activity: 'running' | 'inactive'`؛ وتحمل المداخلُ القابلة للمتابعة `label` دائمًا، بينما لا تحمله مداخلُ اللقطة الواحدة إلا حين يقدّم مستدعي البدء بياناتِ عرض. والمرشحُ المستقر الذي لم يقدّم طيُّه هويةً يُنتج تشخيصَ `corrupt` — فالواصفاتُ المفقودة والمشوَّهة ومن الإصدارات المجهولة لا يُميَّز بينها عمدًا (وتبقى `unsupported` في النوع لكنها لا تُنتَج قط)؛ ويُغفَل المرشحُ العامل بلا هوية (وهو نافذةُ الإنشاء قبل حطّ واصفه)؛ ويُنتج الفحصُ البارد الفاشل تشخيصَ `unavailable` واحدًا يُعاد عند التعداد التالي، فلا يستطيع شقيقٌ واحد معطوب إخفاءَ أبناء سليمين. وتعلّم `hasChildren` سليلًا مباشرًا ذا منشأ وكيل فرعي دائم، تُقرأ من المادة المدموجة نفسِها. ولا يلتقط النشاطُ إلا أحيٌّ السجلُّ المنطقي في `ctx.sessions`، لا الحصيلةَ ولا قابليةَ الاستئناف. وبلا حفظ دائم، يكون التعدادُ حيًّا فقط لا خطأً — فالابنُ الباردُ لا يمكن استئنافُه عندئذ أصلًا. وترمي `listChildren()` خطأَ `SubagentError` برمز `SUBAGENT_CONTROL_PROJECTIONS_UNAVAILABLE` حين يغيب سجلُّ `ctx.sessionProjections`، وبرمز `SUBAGENT_CONTROL_SESSION_STORE_UNAVAILABLE` حين يغيب مخزنُ الجلسات، ويُفحص الاثنان قبل أي قراءة فيفشل نشرٌ بلا أبناء فشلًا حتميًّا؛ وتشترط أداةُ القائمة `ctx.subagents` و`ctx.agents` عند تحميل الإضافة. ويستطيع مستهلكُ خدمة مثل واجهة عرضَ الوضعين واختيارَ احتياطي لقطة واحدة بلا تسمية، بينما لا يُبقي مهايئُ `list_agents` الذي يراه النموذج (وهو إضافةُ `/list-agents` القابلة للتحميل على حدة من [dsh-tool-subagent-control](../../packages/subagent/tool-subagent-control)) إلا المداخلَ القابلة للمتابعة ويصقل الحالةَ عبر سجل الوكلاء الحي إلى مفرداته `running` و`idle` و`ready`، و`ready` فيها تسمّي ابنًا في التخزين وحده بأنه قابل للاستئناف لا بأنه نهائي. ولا يستشير التعدادُ خريطةَ تفعيلات مدير المتابعة ولا سجلَّ الوكلاء ولا إتاحةَ المزوّدين؛ ويبقى `send_message` عمليةَ التسليم المرجعية، وقد يرفض ابنٌ قابل للمتابعة معدود وعامل التسليمَ تعارضَ ملكية. ويوثّق [سجل إسقاط هوية القائمة المؤرشَف](../../.agents/notes/archived/architecture/2026-08-06-subagent-list-identity-projection.md) قرارَ مسار القراءة الأصلي.

وتطبّق `SubagentRuntime.listDescendants(rootSessionId)` المجموعةَ التي يُفضَّل فيها الحي والتفسيرَ المسنَد إلى الإسقاط نفسَيهما على شجرة أحفاد الجذر كاملةً بترتيب سابق ثابت. وتبقى الجلساتُ العادية وأبناءُ اللقطة الواحدة عقدَ اجتياز، فتُكتشف الأحفادُ القابلون للمتابعة تحتها؛ ولا يُنتج صفًّا إلا مرشحو `origin: 'subagent'`. ويضيف كلُّ ابن أو تشخيص معاد موضعَه من الترويسة الدائمة المعدودة، بينما يعيد الفحصُ البارد التحققَ من دورة الحياة كاملةً قبل تقديم الهوية:

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

## النتيجة النهائية: `SubagentResult`

حصيلةُ تشغيل ذي لقطة واحدة، يحلّها `SubagentRun.result`. ولا تحضر `structured` إلا بعد استيفاء `outputSchema` مطلوب بنجاح؛ وطلبُ schema لا يضمنه، وقد يعيد المزوّدُ `stopReason: 'error'` حين يفشل الابنُ أو ينتهي بلا التقاط صالح. وقد يرفق المزوّدُ `diagnostic` آمنًا ليس من المساعد بنتيجة ليست `completed`؛ ويزيل المزوّدُ مُدخَلاتِ الأدوات ومحتوياتِ الملفات وقيمَ البيئة والاعتماداتِ وحمولاتِ البروتوكول الخام، ويحدّ القيمةَ كاملةً بـ4096 بايتًا من UTF-8 قبل أن يعرضها المستهلكون منفصلةً عن `output`. و`stopReason` الذي ليس `completed` يعني أن `output` قد يكون جزئيًّا — فيربطه المستهلكُ بنتيجة أداة `isError` بدل التبليغ عن خرج جزئي بوصفه نجاحًا.

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

و`SubagentStopReason` [اتحادٌ مشتق قابل للتوسعة بالدمج](core.ar.md#the-map--derived-union-pattern) — فقد تضيف خلفيةٌ أشكالًا، فيفرّع المستهلكون على الحالات المعروفة ويعاملون سببًا نهائيًّا مجهولًا فشلًا:

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

## تشغيل ذو لقطة واحدة: `SubagentRun`

`SubagentRun` هو المقبضُ الذي يملكه المستهلك لابن منشور ذي لقطة واحدة — وهو تفويضٌ أمامي واحد قابل للتخلص بنتيجة واحدة، لا مقبضَ ابن دائم. ويخص `result` تقديمَ المطالبة وعملَ الجولة وأعطالَ البنية بعد النشر. وينتظر المستهلكون تلك النتيجةَ ويتخلصون من التشغيل دائمًا ليبلغوا السكون. وتحلّ إخفاقاتُ الابن بسبب توقف ليس `completed`؛ ولا يرفض إلا أعطالُ بنية لا يمكن تمثيلها. ولا توجيهَ للتشغيل ولا استئناف: فالمحادثاتُ القابلة للمتابعة لا تشغيلَ لها أصلًا، لأن مديرَ المتابعة يمسك `AgentHandle` لديها مباشرةً ويرتّب كلَّ جولة عبر صندوق وارد الابن نفسِه.

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

وعلى التشغيل المحلي ذي اللقطة الواحدة أن ينشر وكيلًا وجلسةَ ابن عاديين قبل أن يتحقق `start()`، وأن يعيد معرّفَ جلسة الابن تلك بوصفه `SubagentRun.id`، وأن يكشف الابنَ بعينه بوصفه `localAgent`، وأن يسجّل `request.parent.session.id` في ترويسة `parentSession` لدى الابن، وأن يُلحق الواصفَ المحلول داخل جولة الابن الأولى قبل أول طلب له. وقد تضع ملكيةُ وقت التشغيل الابنَ تحت نطاق الأب أو المزوّد أو الجذر. أما المزوّدُ البعيد فيعيد معرّفَ دورة حياة بنطاق الأب و`localAgent: undefined`؛ وبلا جلسة ابن محلية، يغيب عن التعداد الدائم.

<a id="the-provider-contract-subagentprovider"></a>

## عقد المزوّد: `SubagentProvider`

كلُّ مزوّد ناقلُ وكيل ابن مسمّى، وقد يتعايش مزوّدون عدة. وتتحقق الخدمةُ من قدرات وقت البدء المطلوبة قبل `start()`، وترفض بدءًا قابلًا للمتابعة على مزوّد بلا `prepareContinuable`. و`inheritsParentContext` لا تصف إلا بذرَ المحادثة (فـ`fork`: صحيح؛ و`spawn` و`acp`: خطأ)، فيستطيع المستهلكون توليدَ صياغة دقيقة يراها النموذجُ بلا الإيحاء بوراثة أدوات أو خدمات أو سلطة. والمزوّدُ الذي لمساره ذي اللقطة الواحدة افتراضاتٌ ساكنة يملكها هو ينشر `agentRouteDefaults` اختيارية غيرَ قابلة للتغيير، فيستطيع المستهلكُ دمجَ تجاوزات النموذج والأدوات في مقابل خط الأساس الصحيح قبل التمهيد.

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

ويتحقق `start()` لدى المزوّد بتشغيل منشور. وتسكّ الخدمةُ `runId` فريدًا، وتلتقط `local` من `localAgent` بعينه لدى المزوّد، وترصد النتيجةَ، وتُطلق `subagent/start`، وتعيد التشغيلَ نفسَه؛ ورفضُ `start()` يعني تنظيفَ الموارد غير المنشورة ولا يُطلق زوجَ دورة حياة، بينما يغلق رفضُ نتيجة بعد النشر الزوجَ المُطلق. ويُطلق كلُّ تفعيل قابل للمتابعة الزوجَ نفسَه للمراقبة فقط لعهد إقامته، فيكون الاستئنافُ من البارد عهدًا جديدًا بـ`runId` خاص به. ويحمل `subagent/end` المقترن الهويةَ نفسَها والخرجَ النهائي أو فشلَ البنية. والحدثان للمراقبة فقط ويحتويان استثناءاتِ المستمعين. ويسمّي حقلُ `provider` فيهما المزوّدَ الذي بدأ التشغيلَ أو عهدَ التفعيل؛ وهو لا يدّعي أن المزوّدَ ما زال مسجَّلًا حين تُطلق الحافة.

## الخلفيات داخل العملية: الإذن والعمق والبذرة

تنشئ خلفيتا spawn وfork وكيلًا عاديًا ذا لقطة واحدة عبر `parent.ctx`، وتمرّران الإلغاءَ إلى الإنشاء في النواة، وتتخلصان عبر `AgentHandle`؛ أما الابنُ القابل للمتابعة فينشئه مديرُ المتابعة عبر نطاق مالك التفعيل لديه. وإزالةُ المزوّد تحجب البدايات الجديدة بلا نقض التشغيلات المقبولة. ويحصل كلُّ ابن على نطاق مسطح جديد بدل وراثة تسجيلات الأب. ويعيد الإذنُ والعمقُ وبذرُ التفريع استعمالَ مفردات الجلسة القائمة:

- **الإذنُ المفوَّض** يُلتقط قبل أول انتظار. ويُلحق الآباءُ ذوو وصول Auto وFull access هويةَ `permission/preset` الملتقَطة لديهم بالابن الجديد بعد بذر التفريع وتجاوزات العزل والموافقة. ويتشارك أبناءُ اللقطة الواحدة والأبناءُ القابلون للمتابعة هذا المسارَ؛ ولا يقرأ الاستئنافُ من البارد إلا سجلَّ الابن. ويحتفظ وضعا Read Only وWorkspace Write بتجاوز العزل الموروث مع `approval: never`، فتبقى الحزمُ غيرُ المطابِقة `custom`. وتُراجَع كلُّ نداء ابن Auto مستقلةً باستعمال `parentSession` القائم ومطالبةِ الإنشاء ورسائلِ البشر أو الأب المباشر الموثَّقة. ويعرّف [قرار Auto review](../../.agents/notes/implemented/feature/2026-08-28-auto-review.ar.md) دلالاتِ المستويات المنخفض والمتوسط والمرتفع؛ ولا يُضاف سجلُّ تفويض ولا إيصالٌ ولا حقلُ ترويسة ولا حقلُ واصف ولا صيغةُ جلسة.

- **عمقُ التفويض** هو `SessionHeader.delegationDepth` الدائم مع الحقل القابل للتوسعة بالدمج في وقت التشغيل `AgentOptions.subagentDepth`؛ وغيابُهما يعني العمقَ الأعلى صفرًا، والقيمةُ الأكبر الحاضرة هي المرجع. ويملك الـseam الحقلين — فالحلقةُ لا تضبطهما ولا تقرؤهما — فيحفظ ابنٌ داخل العملية عمقَ الأب زائدَ واحد، ولا يستطيع الاستئنافُ من البارد خفضَه، ويرفض كلُّ بدء عمقًا مشتقًّا خارج مجال الأعداد الصحيحة الآمنة أو فوق سقف `request.maxDepth` المطلق المعرَّف.
- **بذرُ التفريع** يستعمل [`CreateAgentOptions.seed`](core.ar.md#creation-and-ownership) (وهي بادئةُ `SessionEvent[]` تمرّ عبر `AgentLoop.createAgent` ← `ctx.sessions.prepare({ seed })`، وهي البدائيةُ نفسُها التي يستعملها `ctx.agents.resume()`). وتمرّر خلفيةُ fork *بادئةَ جولات مكتملة متوازنة* من سجل الأب — أي أحداثَ الأب حتى آخر `turn/end` لديه وشاملةً له — فتكون البذرةُ متصلةً من الصفر وتقبلها إعادةُ تشغيل [الثوابت](../../packages/runtime-diagnostics/invariants) (وتُستبعد الجولةُ الجارية غيرُ المتوازنة).

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

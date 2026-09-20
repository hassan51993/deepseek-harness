# أوامر المستخدم

[English](commands.md) | العربية

خدمةُ سجل أوامر المستخدم من [`dsh-commands`](../../packages/interaction/commands). وتستعملها المهايئاتُ التفاعلية لاكتشاف الأوامر التي تملكها الإضافاتُ وتنفيذِها مباشرةً لوكيل بعينه بلا إنشاء رسالة للنموذج. وتملك [ملاحظةُ الوكيل عن الأوامر](../../.agents/notes/implemented/feature/2026-07-19-plugin-command-registration.ar.md) مسوّغَ التوزيع ودورةِ الحياة؛ ويملك [README الحزمة](../../packages/interaction/commands/README.ar.md) التركيبَ والحدود.

المصدر: [`packages/interaction/commands/src/index.ts`](../../packages/interaction/commands/src/index.ts)

## البيانات الوصفية للمُدخَل

تكشف الخدمةُ واصفًا اختياريًا واحدًا لمُدخَل غير مبنيَن: تلميحٌ مع رايةِ قبول المرفقات. وتتبع إتاحةُ الأمر تركيبَ الإضافات: فكلُّ مهايئ يستهلك السجلَّ يرى كلَّ تعريف سارٍ.

```ts type-equiv
/** Immutable metadata for a command's optional unstructured input. */
interface CommandInputDescriptor {
  /** Placeholder shown before the user supplies free-form input. */
  readonly hint: string
  /**
   * Whether composer attachments may accompany an invocation. Absent or
   * false = the executor rejects an invocation carrying attachments and capable
   * composers refuse the submission before dispatch. A declaring command's
   * handler receives the admitted durable blocks and owns every further
   * grammar decision, including rejecting sub-commands that cannot use them.
   */
  readonly attachments?: boolean
}
```

## التعريف

`CommandDefinition` هو التسجيلُ الذي تؤلفه الإضافة. ويتحقق السجلُّ من تعريف سارٍ منفصل ويجمّده.

```ts type-equiv
/** Plugin-owned command registration. */
interface CommandDefinition {
  /** Stable plugin-owned identity; absent for definitions without identity-based client behavior. */
  readonly definitionId?: CommandDefinitionId
  /** Lowercase command name without the leading slash. */
  readonly name: string
  /** Human-readable summary used in discovery UI. */
  readonly description: string
  /** Optional free-form input hint advertised to capable clients. */
  readonly input?: CommandInputDescriptor
  /**
   * Whether `command/run` records `rawInput`. Defaults to true. A command
   * whose domain event owns the payload sets this false to avoid duplicating
   * that payload in the session log.
   */
  readonly recordInput?: boolean
  /** Execute against the receiving agent without sending the command to the model. */
  readonly handler: (invocation: CommandInvocation) => CommandResult | Promise<CommandResult>
}
```

## الاستدعاء والنتيجة

يملك المهايئُ الإلغاءَ ويمرّر الوكيلَ الهدف بعينه. ويبدأ `rawInput` مباشرةً بعد الاسم المحلَّل ويحتفظ بالفاصل واللاحقة اللذين سلّمهما المهايئ. والنتائجُ حصائلُ واجهة مباشرة، لا نتائجَ أدوات ولا أحداثَ جلسة.

```ts type-equiv
/** Invocation passed to one registered command handler. */
interface CommandInvocation {
  /** Pairing id already written to this invocation's `command/run` event. */
  readonly commandId: CommandId
  /** Exact agent whose UI received the command. */
  readonly agent: Agent
  /** Exact text following the registered command name, including separator whitespace. */
  readonly rawInput: string
  /**
   * Durably admitted image and file blocks accompanying this invocation, in submission
   * order; empty unless the definition declares `input.attachments`. The handler
   * owns their model-visible use — the registry never schedules them itself —
   * and a handler whose grammar cannot use them in this invocation returns an
   * error so the dispatching composer retains the originals.
   */
  readonly attachments: readonly (ImageBlock | FileBlock)[]
  /** Cancellation signal owned by the dispatching UI request. */
  readonly signal: AbortSignal
}
```

```ts type-equiv
/** Expected command outcome rendered directly by the dispatching UI. */
type CommandResult =
  | {
    readonly kind: 'success'
    readonly text?: string
    /** Earlier authoritative domain event that owns a richer presentation. */
    readonly sourceEventSeq?: SessionSeq
  }
  | { readonly kind: 'error'; readonly text: string }
```

و`sourceEventSeq` اختياري وللنجاح وحده. وهو يسمّي، حين يُوجد، حدثًا أسبق غيرَ أمرٍ في سجل الجلسة المستقبِلة؛ ويحفظ `command/done` المرجعَ نفسه فيستطيع العميلُ أن يجمع دورةَ حياة الأمر مع ذلك الإسقاط بلا تحليل `text` وبلا اعتماد على صفوف مجاورة.

## عروض الاكتشاف والتحليل

تتلقى المهايئاتُ واصفاتٍ غيرَ قابلة للتغيير بلا معالِجات بعد حلّ النطاق. ويعيد `parseCommand()` قيمةَ `ParsedCommand` قبل حلّ السجل؛ وقد يسمّي مُدخَلٌ سليمُ النحو أمرًا غيرَ متاح.

```ts type-equiv
/** Handler-free immutable command view returned to UI adapters. */
interface CommandDescriptor {
  /** Stable plugin-owned identity; absent for definitions without identity-based client behavior. */
  readonly definitionId?: CommandDefinitionId
  /** Lowercase command name without the leading slash. */
  readonly name: string
  /** Human-readable summary used in discovery UI. */
  readonly description: string
  /** Optional free-form input hint advertised to capable clients. */
  readonly input?: CommandInputDescriptor
}
```

```ts type-equiv
/** Syntactically valid slash command before registry resolution. */
interface ParsedCommand {
  /** Lowercase command name without the leading slash. */
  readonly name: string
  /** Exact text following the command name. */
  readonly rawInput: string
}
```

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxcommands--commandruntime"></a>

### `ctx.commands` — `CommandRuntime`

Human-command registry. Plain-context definitions are global; definitions registered through a command-injected child of an agent context shadow globals for that agent.

```ts cordis-catalog
/**
 * Register a global or calling-agent-scoped command.
 * @param definition - discovery metadata and direct UI handler.
 * @returns the exact effect disposer that unregisters this definition.
 */
register(definition: CommandDefinition): () => void

/**
 * Register the sole authority that resolves staged file receipts for command submissions.
 * @param resolver - Session-aware receipt resolver.
 * @returns disposer that removes this exact resolver.
 */
registerFileReceiptResolver(resolver: CommandFileReceiptResolver): () => void

/**
 * List the effective immutable command descriptors for one agent.
 * @param agent - exact receiving agent and scoped-layer key.
 * @returns name-sorted descriptors after scoped shadowing.
 */
@Remote list(agent: Agent): readonly CommandDescriptor[]

/**
 * Resolve one effective command definition.
 * @param agent - exact receiving agent and scoped-layer key.
 * @param name - command name without a slash.
 * @returns the scoped shadow or global definition.
 */
find(agent: Agent, name: string): CommandDefinition | undefined

/**
 * Parse and execute a known command without sending it to the model.
 *
 * A resolved command's lifecycle is logged: `command/run` is appended
 * before the handler is invoked and `command/done` after settlement (a
 * thrown or aborted handler settles as `kind: 'error'`). Both are direct
 * log-only appends — no turn wraps them, and persistence drains them at
 * ordinary checkpoints. Admission misses (syntax or unknown name) log
 * nothing — they never entered a handler. A `command/run` append failure
 * fails the execution loud; a `command/done` append failure on the
 * handler-failure path is contained so the handler's own error stays the
 * reported failure.
 *
 * Attachment admission is enforced here, not in the composer: attachments sent to a
 * command that does not declare `input.attachments`, an absent attachment store,
 * and an exceeded image limit each settle as an error result before
 * the handler runs. Validation rejection starts no attachment writes;
 * a storage failure can leave only unreachable content-addressed objects
 * for deferred collection.
 *
 * @param agent - exact receiving agent.
 * @param line - complete slash-command line.
 * @param submittedAttachments - encoded images and staged file receipts accompanying the line,
 *   in submission order; empty for a plain invocation.
 * @param signal - cancellation signal owned by the UI request.
 * @returns the settled execution (result + lifecycle pairing id), or
 *   `undefined` when syntax or name does not resolve.
 */
@Remote async execute( agent: Agent, line: string, submittedAttachments: readonly CommandSubmitAttachment[], signal: AbortSignal, ): Promise<CommandExecution | undefined>
```

Types: [Agent](core.ar.md)

Source: [`packages/interaction/commands/src/index.ts`](../../packages/interaction/commands/src/index.ts)

<a id="commands-events"></a>

### `commands/*` events

<a id="commandschange--emit"></a>

#### `commands/change` — emit

A command was registered or unregistered. This is an unfiltered registry notification because a global or scoped change may affect any UI view. Observer failures are contained and cannot veto the registry mutation.

```ts cordis-catalog
/**
 * A command was registered or unregistered. This is an unfiltered registry
 * notification because a global or scoped change may affect any UI view.
 * Observer failures are contained and cannot veto the registry mutation.
 * @mode emit
 */
'commands/change'(): void
```

Source: [`packages/interaction/commands/src/types.ts`](../../packages/interaction/commands/src/types.ts)
<!-- END GENERATED cordis-surface -->

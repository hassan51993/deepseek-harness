# تجميع مطالبة النظام

[English](system-prompt.md) | العربية

تملك [حزمة system-prompt](../../packages/core/system-prompt) البياناتِ المتبادلة بين المساهمين في المطالبة ونداءِ تجميع واحد. ويوثّق [README](../../packages/core/system-prompt/README.ar.md) الحزمةِ سلوكَ التسجيل والترتيب والنطاق والعرض؛ وتسجّل هذه الصفحةُ الأنواعَ المشتركة بين الحزم بعينها التي تنفّذها الإضافاتُ أو تمرّرها.

المصدر: [`packages/core/system-prompt/src/index.ts`](../../packages/core/system-prompt/src/index.ts).

## سياق التجميع

يحدد `AssembleContext` طبقةَ النطاق التي يحلّها تجميعٌ واحد، وقد يحمل إشارةَ التحكم الصريحة لذلك الطلب. وهو قابل للتوسعة بالدمج: فـ`dsh-agent` يضيف الحقلَ الاختياري الحي `agent`، ويضبط `assembleContextFor(agent, signal)` الحقلين الصريحين معًا. والتجميعُ المجرد لا نطاقَ له ولا إشارة.

```ts type-equiv
/** Merge-extensible context for one prompt assembly. */
interface AssembleContext {
  /**
   * Scope whose providers and waterfall listeners participate. When absent,
   * only global providers and subject-less listeners participate.
   */
  scope?: ScopeKey
  /** Explicit control signal for the turn that requested this assembly, when any. */
  signal?: AbortSignal
}
```

## نتيجة مزوّد الأدوات

`ToolProviderResult.schemas` هي المجموعةُ التي يراها النموذج في التجميع الحالي. و`knownNames` هو فضاءُ أسماء المزوّد قبل التقييد، ويُستعمل للتمييز بين خطأ مطبعي في اسم مضبوط وأداة معروفة أُخفيت عمدًا في هذا النطاق.

```ts type-equiv
/** Tool schemas visible in one assembly and their pre-restriction name set. */
interface ToolProviderResult {
  /** The schemas this provider contributes to THIS assembly. */
  readonly schemas: readonly ToolSchema[]
  /** The pre-restriction name universe for config validation (defaults to `schemas`' names). */
  readonly knownNames?: readonly string[]
}
```

## أقسام المطالبة

يسمّي `PERSONA_PREFIX_SECTION` المصدَّر (`deployment:persona-prefix`) و`PERSONA_SUFFIX_SECTION` (`deployment:persona-suffix`) الخانتين اللتين يتشاركهما الضبطُ العام والإسهاماتُ النطاقية. ومدخلاهما في `PromptSectionOrderName` هما `DEPLOYMENT_PERSONA_PREFIX` و`DEPLOYMENT_PERSONA_SUFFIX`؛ ويملك [README الحزمة](../../packages/core/system-prompt/README.ar.md#configure-the-prompt) موضعَهما وضبطَ قالبهما.

و`PromptSection` عقدُ تسجيل للقراءة فقط داخل العملية نفسها. وقد يكون نصُّه ساكنًا أو محلولًا من سياق التجميع الحالي. وتُرتَّب الأقسامُ تصاعديًا بالترتيب ثم بالاسم حسب وحدات الترميز؛ ويحلّ المساهمون في المستودع التخصيصَ المسمّى الذي تملكه الخدمةُ عبر `getSectionOrder()`. ويحلّ المساهمون في سياق وقت التشغيل تخصيصَهم المستقل عبر `getContextOrder()`. ويصير قسمُ `complete` الساري الواحد قسمَ المطالبة الوحيد بعد التجميع التعاوني. ويعرض agent loop الأقسامَ المجمَّعة بـ`renderPrompt` ويودِع النصَّ عقدةَ سطح `system/message` — تُلحق عقدةَ سطح رقم 0 في الخطوة الأولى، ثم تُستبدل في موضعها حين يتغيّر النصُّ المعروض، أو تُلحق بعد التاريخ المخزَّن للتحديثات غير الفارغة في سلسلة مستمرة حين يعلن النداءُ المُعَدّ `systemPromptUpdate: 'in-history'` — فتصل المطالبةُ إلى النموذج رسالةً من تاريخ مشتق لا حقلًا في الطلب ([القرار](../../.agents/notes/implemented/architecture/2026-09-02-system-prompt-as-surface-node.ar.md)؛ [قاعدة القرار](../../packages/core/agent-loop/README.ar.md#understand-the-implementation)).

```ts type-equiv
/** One contributed section of the system prompt (registry input). */
interface PromptSection {
  /** Unique name — a duplicate registration throws (see {@link SystemPrompt.section}). */
  readonly name: string
  /**
   * Sections are concatenated in ascending order. Equal orders use code-unit
   * name order.
   */
  readonly order: number
  /**
   * Static text or a provider evaluated at each assembly with that assembly's
   * {@link AssembleContext}. The text may reference `{{variable}}`s — they are
   * interpolated later, by {@link renderPrompt}, unless `interpolate` is false.
   */
  readonly text: string | ((context: AssembleContext) => string)
  /** Whether to interpolate prompt variables. Defaults to true; false preserves literal text. */
  readonly interpolate?: boolean
  /**
   * Treat this contribution as the complete system prompt. Assembly still
   * runs the cooperative waterfall so tools, contexts, and variables can be
   * resolved, then restores this exact section as the sole prompt section.
   * More than one effective complete section makes assembly fail.
   */
  readonly complete?: boolean
}
```

## سياق المطالبة الديناميكي

`PromptContext` هو النظيرُ الآمن مع التخزين المؤقت لـ`PromptSection`. ويحلّ التجميعُ هذه الإسهاماتِ ويرتّبها، بينما يسجّل agent loop لقطتَها الحالية كاملةً بعد تاريخ النموذج المحفوظ، ولا يفعل ذلك إلا حين تتغيّر أو حين يزيلها الضغطُ.

```ts type-equiv
/** Dynamic model context materialized as a durable user-role snapshot. */
interface PromptContext {
  /** Unique name — a duplicate registration throws (see {@link SystemPrompt.context}). */
  readonly name: string
  /** Contexts are joined in ascending order. */
  readonly order: number
  /** Static text or a provider evaluated for each assembly. Empty text contributes nothing. */
  readonly text: string | ((context: AssembleContext) => string)
}
```

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsystemprompt--systemprompt"></a>

### `ctx.systemPrompt` — `SystemPrompt`

Registry service for the prompt inputs assembled before each model step.

```ts cordis-catalog
/**
 * Register an ordered prompt section in the calling context's scope. A scoped
 * section shadows a global section with the same name; duplicates within one
 * layer and non-finite orders throw. Registration and disposal emit
 * `system-prompt/change`.
 * @param section - the section to register.
 * @returns the exact Cordis effect disposer.
 */
section(section: PromptSection): () => void

/**
 * Resolve the centrally owned placement of a repository prompt section.
 * @param name - stable section placement name.
 * @returns the section's numeric sort order.
 */
getSectionOrder(name: PromptSectionOrderName): number

/**
 * Resolve the centrally owned placement of a repository runtime context.
 * @param name - stable context placement name.
 * @returns the context's numeric sort order.
 */
getContextOrder(name: PromptContextOrderName): number

/**
 * Register ordered dynamic context in the calling context's scope. Scoped
 * entries shadow global entries with the same name.
 * @param context - the context contribution to register.
 * @returns the exact Cordis effect disposer.
 */
context(context: PromptContext): () => void

/**
 * Suppress every dynamic runtime-context contribution in the calling
 * context's scope without changing the services that own or enforce those
 * facts. Multiple suppressors remain independently disposable.
 * @returns the exact Cordis effect disposer.
 */
suppressRuntimeContext(): () => void

/**
 * Register a tool-schema provider in the calling context's scope. Global and
 * matching scoped providers both contribute; returning the reserved
 * {@link TOOL_ORDER_REST} name makes assembly fail.
 * @param provider - evaluated for each assembly with its context.
 * @returns the exact Cordis effect disposer.
 */
tools(provider: (context: AssembleContext) => ToolProviderResult): () => void

/**
 * Register a prompt variable in the calling context's scope. Scoped values
 * shadow globals; invalid or duplicate names throw. A provider may return
 * `undefined`, but rendering a section that references that value then fails.
 * @param name - the `[a-z][a-z0-9_]*` reference name.
 * @param provider - evaluated for each assembly.
 * @returns the exact Cordis effect disposer.
 */
variable(name: string, provider: (context: AssembleContext) => string | undefined): () => void

/**
 * Assemble global and scoped providers, detach tool parameters, apply
 * canonical ordering, then run the assembly waterfall. Scoped sections and
 * variables shadow globals. The returned waterfall value is authoritative
 * except that an effective complete section is restored afterwards as the
 * sole prompt section.
 * @param context - the optional scope and plugin-defined assembly fields.
 * @returns the post-waterfall assembly with any complete prompt enforced.
 */
async assemble(context: AssembleContext = {}): Promise<PromptAssembly>
```

Source: [`packages/core/system-prompt/src/index.ts`](../../packages/core/system-prompt/src/index.ts)

<a id="system-prompt-events"></a>

### `system-prompt/*` events

<a id="system-promptassemble--waterfall"></a>

#### `system-prompt/assemble` — waterfall

Expert waterfall over the assembled sections, contexts, tools, and variables. Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): scoped listeners receive only that scope's assemblies. The returned value is authoritative. A supplied signal controls only this explicit assembly request and must not be retained to control later turns. A registered complete section is restored after this waterfall, so listeners cannot add to or replace that scope's system prompt.

```ts cordis-catalog
/**
 * Expert waterfall over the assembled sections, contexts, tools, and variables.
 * Scope-filtered dispatch (`@deepseek-ai/dsh-scope`): scoped listeners
 * receive only that scope's assemblies. The returned value is authoritative.
 * A supplied signal controls only this explicit assembly request and must not
 * be retained to control later turns. A registered complete section is
 * restored after this waterfall, so listeners cannot add to or replace
 * that scope's system prompt.
 * @param assembly - the mutable assembly built from registered providers.
 * @param context - the caller's per-assembly context.
 * @mode waterfall
 */
'system-prompt/assemble'(this: Scoped<SystemPrompt>, assembly: PromptAssembly, context: AssembleContext, next: () => Promise<PromptAssembly>): Promise<PromptAssembly>
```

Types: [Scoped](scope.ar.md)

Source: [`packages/core/system-prompt/src/index.ts`](../../packages/core/system-prompt/src/index.ts)

<a id="system-promptchange--emit"></a>

#### `system-prompt/change` — emit

Emitted when any prompt provider changes. This registry notification is unfiltered because a global change affects every scope.

```ts cordis-catalog
/**
 * Emitted when any prompt provider changes. This registry notification is
 * unfiltered because a global change affects every scope.
 * @mode emit
 */
'system-prompt/change'(): void
```

Source: [`packages/core/system-prompt/src/index.ts`](../../packages/core/system-prompt/src/index.ts)
<!-- END GENERATED cordis-surface -->

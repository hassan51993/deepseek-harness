# دليل عملي: صيغ إضافات التوسعة

[English](extension-cookbook.md) | العربية

أنماط مرجعية لتوسعات الإطار. والمقتطفات تحذف الاستيرادات وتنفيذاتِ المساعدات، وليست كاملةً للنسخ واللصق. ولمسارات التأليف الملموسة انظر [قائمة تحقق الحزمة](adding-a-package.ar.md)، و[درس الأداة الأولى](../user/develop/basic/tool.ar.md)، و[مرجع الأدوات](adding-a-tool.ar.md)، و[دليل مهايئ LLM](adding-an-llm-adapter.ar.md)، و[درس إصدار صيغة الجلسة](adding-a-session-format-version.ar.md)؛ وتملك [المعمارية](../architecture.ar.md) خريطةَ النظام ونقاط الامتداد.

## إضافة أداة

تسجَّل الأداة على `ctx.tools`. ويسكن مثالُ `defineTool` المشروح (بوسائط `execute` المنمَّطة، وبناءِ النتيجة، ونمطِ `run_in_background`) في [adding-a-tool.md](adding-a-tool.ar.md)، وذلك الدليل هو مرجع تعريفات الأدوات. ويقبل `ctx.tools.register()` أيضًا تعريفاتِ `ToolDefinition` بصيغة JSON-Schema خامًا مباشرةً (وهكذا تصل الأدوات الآتية من MCP)؛ أما `defineTool` فهو المساعد المنمَّط لأدوات الطرف الأول.

<a id="a-hook-plugin-permission-gate-example"></a>

## إضافة خطاف (مثال بوابة الأذونات)

بوابةُ الأذونات هذه مثالٌ واحد على إضافة خطاف. وهي ترجع قرارًا منمَّطًا من بوابة `tools/pre-execute` لتسمح بالاستدعاء أو تمنعه؛ وتستطيع إضافاتُ البيئة المعزولة والأذونات ووضع التخطيط استعمالَ نقطة الامتداد هذه. وإضافاتُ الخطاف تستطيع اعتراضَ نقاط امتداد أخرى وليست بوابات أذونات بطبيعتها. و«الخطاف الأصيل» إضافةُ Cordis عادية على نقطة اعتراض؛ ولا يحتاج بروتوكولًا خارجيًا.

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { PreToolDecision, ToolExecution } from '@deepseek-ai/dsh-tools'

declare function isAllowed(exec: ToolExecution): Promise<boolean>

export const name = 'permission-gate'

export function apply(ctx: Context) {
  ctx.on('tools/pre-execute', async (exec, next): Promise<PreToolDecision> => {
    if (!(await isAllowed(exec))) {
      return { kind: 'deny', reason: 'Denied by policy.' }
    }
    return next()
  })
}
```

وهذا الـ waterfall هو طبقة السياسة القابلة لإعادة الترتيب. استعمل `ctx.tools.guard()` حين يحتاج ثابتٌ منعًا نهائيًا رتيبًا، و`tools/execute` حين يجب أن تلفّ إضافةٌ عمرَ التوزيع (المهل وإعادة المحاولة والقياسات؛ ولا يُستبدل سوى `exec.signal`)، و`tools/post-execute` لتحويل النتيجة صراحةً، و`tools/result` للمراقبة المحتواة للنتيجة النهائية غير القابلة للتغيير. ويعطي [دليل إضافة أداة](adding-a-tool.ar.md#execution-policy-and-observation) قاعدةَ الاختيار.

## إضافة واجهة مستخدم

تجمع إضافةُ الواجهة بين سجلات `session/event` الدائمة (تسويات Assistant، وحدود الجولات والخطوات، ونشاط الأدوات) وإطارات `agent/assistant-stream` العابرة لعرض الرموز حيًّا، وتعيد قيادةَ المدخلات عبر `agent.followup()` و`agent.steer()`. أما إضافةُ المتصفح التي تسهم بصف أعمال في عميل Web المدمج فتسجّل `ConversationNodeDefinition` ومصيّرَ محادثة مفهرسًا؛ فاتبع [مرجع نظام المحادثة الفرعي](../subsystems/conversation.ar.md).

```ts
import type { Context } from '@deepseek-ai/cordis'
import { brandString } from '@deepseek-ai/dsh-brand'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { SessionId } from '@deepseek-ai/dsh-session'

declare function render(text: string): void
declare function onUserInput(handler: (text: string) => void): void

export const name = 'my-ui'
export const inject = ['agents']

export function apply(ctx: Context) {
  ctx.on('agent/assistant-stream', ({ frame }) => {
    if (frame.type === 'chunk' && frame.chunk.type === 'text-delta') {
      render(frame.chunk.text)
    }
  })
  onUserInput(text => ctx.agents.get(brandString<SessionId>('client-session'))?.followup(createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'user' },
  })))
}
```

## مشغّل بروتوكول خارجي

*مشغّل البروتوكول* يهايئ نظيرًا على السلك مع `ctx.agents`؛ وقد يخدم واجهةَ مستخدم أو عميلَ أتمتة. ومشغّلُ stdio يملك الخرجَ القياسي، وينشئ الوكلاء أو يستأنفهم عبر المصنع، ويربط طلباتِ البروتوكول بـ `followup()` أو `cancel()`. وطلبُ التوجيه منخفض المستوى يعيد إيصالَ إدراجه الدائم في الطابور؛ ولا يحصل على نتيجة بربط `MessageId` بـ `turn/end`. وانشر حالةَ الوكيل كله منفصلةً. وقد تنتظر طريقةُ أتمتة من إيصالها إلى الخمول التالي وتلخّص تلك الفترةَ التي تملكها صراحةً، بينما تواصل الواجهةُ عادةً مراقبةَ تدفق الأحداث المفتوح. وفكّك الوكلاء بـ `AgentHandle.dispose()` ليبلغ التفكيكُ السكون.

و[`packages/acp/acp`](../../packages/acp/acp) هو المثال العملي المخصص للأتمتة: فهو يكشف جلساتٍ نصية جديدة عبر stdio بـ JSON-RPC من Agent Client Protocol، ويرسل نصَّ Assistant المودَع، ويسجّل مجيبَ أذونات آليًّا لمرة واحدة للوكلاء الذين يملكهم. ويعرّف [README الخاص به](../../packages/acp/acp/README.ar.md) الطرقَ بعينها وترتيبَ الأحداث وعقدَ دورة الحياة.

```ts
import type { Context } from '@deepseek-ai/cordis'
import { expandAssistantStream } from '@deepseek-ai/dsh-llm'

export const name = 'my-protocol-bridge'
export const inject = ['agents', 'sessions', 'sessionPersistence']

export function apply(ctx: Context) {
  // Publish every committed Assistant text delta to the client.
  ctx.on('session/event', (_session, event) => {
    if (event.type === 'assistant/message' || event.type === 'assistant/attempt') {
      for (const { chunk } of expandAssistantStream(event.data.stream)) {
        if (chunk.type === 'text-delta') {
          // sendToClient({ kind: 'message_chunk', text: chunk.text })
        }
      }
    }
  })
  // Inbound "prompt": create/resume an agent, feed it, and return its enqueue receipt.
  // Whole-agent status is a separate notification; no turn end belongs to this prompt.
  // Teardown reaches quiescence via AgentHandle.dispose() (stop + await exit).
}
```

## التوصيلات القابلة للتشغيل

تسهم التطبيقات المشحونة بطبقات الـ profile عبر `packages/bundle/*/cordis.patch.yml`، ويملك مُقلِع المنتج `dsh` تنفيذَ Web وACP وSDK والتشغيلةِ الواحدة الخالية من الواجهة عبر profiles مسمّاة. وتسكن الطبقاتُ الاختيارية الموجَّهة إلى المستخدم تحت `apps/cli/config/examples/`؛ وتسكن اختباراتُ تكامل الـ profiles تحت `apps/cli/tests/profiles/`، بينما تبقى تركيباتُ Loader الخاصة بحزمة بعينها مع اختبارات حزمتها.

<a id="the-feature--mechanism-map"></a>

## خريطة الميزة إلى الآلية

كل ميزة في المنتج تقابل مستمعًا على نقطة امتداد موثَّقة، وهذه هي دعوى النواة المصغّرة وقد صارت قابلة للفحص ([Agent Note عن النواة المصغّرة](../../.agents/notes/implemented/architecture/2026-06-11-microkernel-event-taxonomy.ar.md)). ولا يعدّل أي صف الحلقةَ.

و`system-prompt/assemble` تحويلٌ تعاوني خبير للتجميع كله: فالتجميع الذي يعيده مرجعي، وعلى كاتبي المستمعين أن يحفظوا وضعَ PTC النشط ومساهماتِ بروتوكول الخرج المبنيَن. وفضّل `ctx.tools.restrict()` في ترشيح الأدوات الذي يجب أن يبقى متسقًا بين العرض والبحث والتنفيذ.

| ميزة المنتج | آلية الإضافة |
|---|---|
| نظام الخطافات (على مستوى المستخدم والمشروع) | مستمعون على `agent/created` و`agent/pre-step` و`agent/request` و`tools/pre-execute` و`tools/post-execute` و`agent/turn-stopping`؛ وترجع الـ waterfalls قراراتٍ منمَّطة، بينما قد يوجّه `agent/turn-stopping` خطوةً أخرى؛ وتربط جسور `dsh-hooks-claude-code` و`dsh-hooks-codex` ملفاتِ إعداد الخطافات بنقاط الامتداد هذه |
| `/goal` | يملك `ctx.goals` الحالةَ الدائمة، ويجدوِل `dsh-goal-round-driver` جولاتِ الهدف داخل الجلسة نفسها عبر `Agent` العام، ويكشف منتجو الأوامر والأدوات المنفصلون تحكّمَ الإنسان والنموذج |
| `/loop` | على حدث الجلسة `turn/end`، استدعِ `followup()` للتكرار التالي؛ أو افرض المتابعة |
| سير العمل الديناميكي | `ctx.workflowEngine` مع محرّك سير عمل PTC وأداة `workflow`؛ ويُلزم الأبناءُ المبنيَنون داخل العملية بالخرج عبر تسجيلات توجيه وأدوات ذات نطاق، وحارسِ أدوات رتيب، وإيداعِ `tools/result` نهائي (بما فيه `run_code` المحيط)، وعلامةِ `concludeTurn()` الرتيبة في تنفيذ الخرج المبنيَن |
| الرسائل المصطفّة والتوجيه أثناء التشغيل | `Agent.followup()` و`Agent.steer()` في النواة |
| ضغط السياق (التلقائي واليدوي) | seam الخاص بـ `ctx.compaction` مع `dsh-compaction-basic`؛ ويعمل الضغطُ التلقائي على `agent/pre-step` المتسلسل، ويعمل التعافي المعياري من الفيض على `agent/request-error`، ويستعمل المستدعون يدويًا خدمةَ الضغط نفسها ([Agent Note عن الضغط](../../.agents/notes/implemented/feature/2026-06-18-compaction-capability-seam.ar.md)) |
| قابلية ضبط توجيه النظام | `ctx.systemPrompt.section()` مع الترتيب والتظليل المحلي للنطاق |
| AGENTS.md (في الجذر) | مزوّد مقطع يقرأ الملف |
| AGENTS.md (في دليل فرعي، عند اللمس) وإشعارات تغيّر الملفات | `agent.inject()` من مراقب أو من مستمع لنتائج الأدوات |
| الأدوات المدمجة | `ctx.tools.register()`؛ وتتدفق schemas إلى التجميع تلقائيًا، وعائلات `dsh-tool-*` (bash وfs وweb وsubagent وtodo) هي الأمثلة المشحونة |
| البحث في الأدوات والكشف التدريجي | استبدل تسجيلَ `ctx.tools.restrict()` ذا النطاق كلما تغيّرت المجموعةُ الظاهرة؛ ويُبقي الـ registry العرضَ والبحثَ والتنفيذ متسقين |
| مهلة الأداة وإعادة محاولتها وقياساتها | لُفّ توزيعَ النواة بـ `tools/execute`؛ ويجوز للّافّ أن يستبدل `exec.signal` ويفوّض ويفحص النتيجةَ الموحَّدة في عمر لفظي واحد |
| قياسات نتيجة الأداة النهائية وتدقيقها والتقاطها | راقب النتائجَ المرجعية غير القابلة للتغيير بـ `tools/result`؛ ولا تستعمل `tools/post-execute` بدلًا منه إلا حين يجب أن تحوّل الإضافةُ النتيجة أو تلحق بها سياقًا |
| سياسة إنهاء الجولة الرتيبة | استدعِ `ToolExecution.concludeTurn()` من الأداة النهائية الناجحة؛ وتبقى استدعاءات الأدوات اللاحقة في الاستجابة نفسها قابلة للحراسة، وتتوقف الحلقة بعد الخطوة |
| البيئة المعزولة للعمليات الفرعية (landlock أو sandbox-exec) | استعمل خلفيةَ `ctx.sandbox` عبر `dsh-bash-sandbox`؛ واستعمل `tools/pre-execute` للمنع على مستوى القدرة |
| نظام الأذونات وسؤال المستخدم | أرجِع `ask` من `tools/pre-execute` وأجِب عبر `ctx.approval`؛ وسجّل أداةَ سؤال منفصلة موجَّهة إلى النموذج لأسئلة المستخدم العادية |
| وضع التخطيط | [`@deepseek-ai/dsh-plan-mode`](../../packages/plan/plan-mode/README.ar.md): حالة `plan/mode` مسجَّلة، ومقطعُ الإرشاد `plan:policy`، ودخولٌ بـ `/plan [message]`، وخروجٌ مباشر بـ `/plan off`، وخروجٌ بـ `exit_plan_mode` يراجعه المستخدم؛ ويبقى الإلزام على محورَي البيئة المعزولة والموافقة المستقلين |
| التفويض إلى وكيل فرعي | registry مزوّدي `ctx.subagents` (`dsh-subagent-spawn-in-process` و`dsh-subagent-fork-in-process` و`dsh-subagent-acp` و`dsh-subagent-codex` و`dsh-subagent-claude-code` و`dsh-subagent-dsh-sdk`) مع `dsh-tool-subagent` الذي يكشف مزوّدًا مضبوطًا واحدًا للنموذج |
| MCP | إضافة لكل خادم: اكتشف الأدوات ثم `ctx.tools.register()` |
| المهارات | تسجيل مقطع وأداة؛ واحقن محتوى المهارة بـ `inject()` عند الاستدعاء |
| الذاكرة | مزوّد مقطع وأداة |
| المهام المجدولة (cron) | تسجّل إضافةٌ أدواتِ جدولة يستدعيها النموذج؛ وعند إطلاق المؤقّت: `followup(…, {source: {kind: 'plugin', plugin: 'schedule'}})` عند الخمول، أو إشعار `inject()` عند الانشغال |
| الواجهة (رسومية؛ وCLI يُخرج JSONL) | استمع إلى `agent/assistant-stream` للقطع الحية وإلى `session/event` للتسويات الدائمة والحدود ونشاط الأدوات؛ والمدخلات إلى `followup()` |
| عقدة أعمال في محادثة عميل Web | سجّل `ConversationNodeDefinition` ومصيّرًا مفهرسًا لـ `conversation.chat.node` |
| SessionTelemetryBackend أو أثر قابل لإعادة التشغيل | `session/event` إلى JSONL؛ وإعادةُ التشغيل هي `sessions.create(id, { seed })` |
| مهايئات النماذج | صنف فرعي من `LlmAdapter` عبر `registerAdapter` (`dsh-llm-deepseek` و`dsh-llm-pi-ai`) |
| إعادة التحميل الحارّ للإضافات | كل تسجيل هو `ctx.effect`، فيعمل HMR المستنسخ بلا عناء |

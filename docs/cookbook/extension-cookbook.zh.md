# فعلي تشغيل يد سجل: توسيع إضافة شكل

[English](extension-cookbook.md) | العربية

harness توسيع مشاركة اعتبار نمط. شفرة قطعة مقطع حذف import و مساعد مساعدة تنفيذ، لا يمكن مباشر نسخ تشغيل. أداة جسم تحرير كتابة مسار رؤية[حزمة فحص بيان](adding-a-package.zh.md) ،[رقم واحد أداة تعليم مسار](../user/develop/basic/tool.zh.md) ،[أداة مشاركة اعتبار](adding-a-tool.zh.md) ،[LLM(كبير لغة نموذج) مهايئ إشارة جنوب](adding-an-llm-adapter.zh.md) و [Session صيغة إصدار تعليم مسار](adding-a-session-format-version.zh.md) ؛ نظام و نقطة توسيع خريطة من[هيكل بنية وثيقة](../architecture.zh.md) مسؤول.

## أداة إضافة

أداة في `ctx.tools` فوق تسجيل. حمل ملاحظة حل `defineTool` عرض مثال (نوع تحويل `execute` معامل، نتيجة بنية صنع،`run_in_background` نمط) رؤية [adding-a-tool.md](adding-a-tool.zh.md)——هذا إشارة جنوب هو أداة تعريف حق مصدر.`ctx.tools.register()` أيضا مباشر قبول أصلي JSON Schema `ToolDefinition`(MCP مصدر أداة حينئذ هو هذا مثال وصول) ؛`defineTool` هو رقم واحد جهة أداة استخدام نوع تحويل مساعد مساعدة دالة.

<a id="a-hook-plugin-permission-gate-example"></a>

## خطاف إضافة (بـ إذن بوابة لـ مثال)

هذا عدد إذن بوابة هو خطاف إضافة واحد عرض مثال. هو من `tools/pre-execute` بوابة إرجاع واحد نوع تحويل قرار، لأجل سماح أو رفض مرة استدعاء؛ صندوق رملي، إذن و plan-mode إضافة كل يمكن استخدام هذا نقطة توسيع. خطاف إضافة أيضا يمكن اعتراض قطع أخرى نقطة توسيع، ذاته و لا انتظار نفس في إذن بوابة.«أصلي خطاف» هو في اعتراض قطع نقطة فوق تشغيل عادي Cordis إضافة، لا حاجة خارجي بروتوكول.

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

هذا عدد waterfall(شلال نشر صيغة حدث) هو يمكن إعادة ترتيب سياسة طبقة. عند ثابت صيغة حاجة مفرد ضبط نهائي رفض وقت استخدام `ctx.tools.guard()`؛ عند إضافة حاجة حزمة لف توزيع دورة الحياة وقت (مهلة/إعادة محاولة/إشارة علامة؛ فقط `exec.signal` يمكن استبدال) استخدام `tools/execute`؛ صريح نتيجة تغيير تبديل استخدام `tools/post-execute`؛ مقابل غير ممكن تغيير نهائي نتيجة تلقي حد مراقبة استخدام `tools/result`. اختيار قاعدة رؤية[إضافة أداة إشارة جنوب](adding-a-tool.zh.md#execution-policy-and-observation).

## UI إضافة

UI إضافة يأخذ حمل دائم `session/event` record(Assistant settlement، جولة/خطوة حد و أداة نشط حركة) و لأجل فوري token عرض لحظة حالة `agent/assistant-stream` frame تركيب بدء قدوم، و عبر `agent.followup()` / `agent.steer()` سوف إدخال قيادة عودة ذهاب. إذا متصفح إضافة يلزم نحو داخل بناء Web Client مساهمة عمل خدمة سطر، فإن ينبغي تسجيل `ConversationNodeDefinition` و keyed Chat renderer؛ أداة جسم اتفاق رؤية [Conversation فرعي نظام مشاركة اعتبار](../subsystems/conversation.zh.md).

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

## خارجي بروتوكول قيادة

*بروتوكول قيادة*سوف بروتوكول مقابل طرف وصل دخول `ctx.agents`؛ هو يمكن خدمة في UI أو تلقائي تحويل عميل.stdio قيادة يملك stdout، عبر عمل مصنع إنشاء أو استعادة agent(ذكي جسم) ، و سوف بروتوكول طلب خريطة لـ `followup()` أو `cancel()`. قاع طبقة نص التوجيه طلب إرجاع ذلك حمل دائم دخول طابور عودة تنفيذ؛ هو لن عبر صلة ربط `MessageId` و `turn/end` نيل نيل نتيجة. كامل agent حالة ينبغي مفرد وحيد إصدار. تلقائي تحويل طريقة يمكن من عودة تنفيذ انتظار إلى تحت مرة idle، و عام تضمين هذا واحد صريح يملك منطقة بين؛UI عبر معتاد فإن سوف حمل متابعة مراقبة فتح وضع صيغة حدث تدفق. عبر `AgentHandle.dispose()` تفكيك حذف agent، بـ جعل dispose(مورد تحرير) بلوغ إلى تماما توقف مستقر.

[`packages/acp/acp`](../../packages/acp/acp) هو فقط موجه إلى تلقائي تحويل كامل عرض مثال: هو عبر ACP(Agent Client Protocol)JSON-RPC stdio توفير كل جديد نص جلسة، إرسال خروج قد إيداع مساعدة يد نص، و لـ ذلك يملك agent تسجيل مرة صفة آلة جهاز إذن ينبغي جواب جهاز. ذلك [README](../../packages/acp/acp/README.zh.md) تعريف تأكيد قطع طريقة، حدث ترتيب و دورة الحياة اتفاق.

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

## يمكن تشغيل تجميع عرض مثال

تسليم تطبيق عبر `packages/bundle/*/cordis.patch.yml` توفير profile طبقة، منتج `dsh` بدء جهاز عبر أداة اسم profile مسؤول Web،ACP،SDK و مرة صفة headless تنفيذ. اختياري مستخدم overlay يقع في `apps/cli/config/examples/`؛profile اختبار تكامل يقع في `apps/cli/tests/profiles/`، حزمة مخصص تابع Loader تركيب فإن إبقاء في مقابل حزمة اختبار دليل في.

<a id="the-feature--mechanism-map"></a>

## وظيفة→آلية خريطة

كل منتج وظيفة كل خريطة إلى واحد وثيقة تحويل نقطة توسيع فوق مستمع——دقيق داخل نواة إعلان من هذا يمكن تحقق ([دقيق داخل نواة Agent Note](../../.agents/notes/implemented/architecture/2026-06-11-microkernel-event-taxonomy.zh.md)). لا يوجد أي واحد سطر تعديل حلقة ذاته.

`system-prompt/assemble` هو واحد مخصص بيت تنسيق عمل صيغة كامل جسم تركيب إعداد تغيير تبديل: ذلك إرجاع تركيب إعداد نتيجة أداة لديه مرجعي صفة، لذلك مستمع عمل من لديه مسؤولية مهمة إبقاء نشط وثب PTC mode و بنية تحويل إخراج بروتوكول مساهمة. مقابل في حاجة في عرض، فحص بحث و تنفيذ بين إبقاء مقابل متساو أداة مرور ترشيح، أولوية استخدام `ctx.tools.restrict()`.

| منتج وظيفة | إضافة آلية |
|---|---|
| خطاف نظام (مستخدم درجة + مشروع درجة) | `agent/created`،`agent/pre-step`،`agent/request`،`tools/pre-execute`،`tools/post-execute` و `agent/turn-stopping` فوق مستمع؛waterfall إرجاع نوع تحويل قرار،`agent/turn-stopping` فإن يمكن عبر steering(في طريق جذب توجيه) إطلاق تحت واحد خطوة؛`dsh-hooks-claude-code` / `dsh-hooks-codex` جسر وصل جهاز سوف خطاف ملف إعداد خريطة إلى هذه نقطة توسيع فوق |
| `/goal` | `ctx.goals` إدارة حمل دائم حالة،`dsh-goal-round-driver` عبر عام مشترك `Agent` ضبط درجة نفس جلسة Round، مستقل أمر/أداة إنتاج جهة قسم آخر توفير شخص صنف/نموذج تحكم |
| `/loop` | في `turn/end` جلسة حدث فوق `followup()` تحت مرة تكرار بديل؛ أو قوي صنع متابعة |
| حركة حالة سير العمل | `ctx.workflowEngine` + PTC سير العمل جذب محرك + `workflow` أداة؛ بنية تحويل عملية داخل فرعي مهمة عبر أثر مجال تحويل نص التوجيه/أداة تسجيل، مفرد ضبط أداة حراسة حماية، نهائي `tools/result` إيداع (يشمل خارج طبقة `run_code`) و بنية تحويل إخراج تنفيذ مفرد ضبط `concludeTurn()` علامة قدوم قوي صنع إخراج |
| ترتيب طابور رسالة + steering | نواة قلب `Agent.followup()` / `Agent.steer()` |
| سياق ضغط (context compaction)(تلقائي + يد حركة) | `ctx.compaction` seam + `dsh-compaction-basic`؛ تلقائي ضغط قوة فحص تشغيل في سلسلة سطر `agent/pre-step`، معيار فيض خروج استعادة آلية تشغيل في `agent/request-error`، يد حركة استدعاء جهة استخدام نفس عدد ضغط خدمة ([ضغط Agent Note](../../.agents/notes/implemented/feature/2026-06-18-compaction-capability-seam.zh.md)) |
| توجيه النظام يمكن إعداد صفة | `ctx.systemPrompt.section()`، دعم حمل ترتيب ترتيب و أثر مجال نطاق جزء تغطية |
| AGENTS.md(أصل دليل) | واحد قراءة هذا ملف section مزود |
| AGENTS.md(فرعي دليل، حسب يحتاج إطلاق)+ ملف تغيير إشعار | من watcher / أداة نتيجة مستمع استدعاء `agent.inject()` |
| داخل وضع أداة | `ctx.tools.register()`؛schema تلقائي تدفق دخول تركيب إعداد——`dsh-tool-*` نظام صف (bash،fs،web،subagent،todo) هو قد تسليم عرض مثال |
| ToolSearch / تدريجي دخول صيغة كشف كشف | عند مرئي تجميع تغير وقت استبدال واحد أثر مجال تحويل `ctx.tools.restrict()` تسجيل؛ سجل التسجيل إبقاء عرض، فحص بحث و تنفيذ ثلاثة من مقابل متساو |
| أداة قطع توقف وقت / إعادة محاولة / إشارة علامة | استخدام `tools/execute` حزمة لف نواة قلب توزيع؛ حزمة تركيب طبقة يمكن استبدال `exec.signal`، تفويض حمل تنفيذ، و في نفس كلمة قاعدة دورة الحياة داخل فحص نظر مواصفة تحويل نتيجة |
| نهائي أداة نتيجة إشارة علامة / مراجعة حساب / التقاط | استخدام `tools/result` مراقبة غير ممكن تغيير مرجعي نتيجة؛ فقط عند إضافة حاجة تغيير تبديل نتيجة أو مرفق إضافة سياق وقت عندئذ استخدام `tools/post-execute` |
| مفرد ضبط طرفية جولة سياسة | من نجاح طرفية أداة استدعاء `ToolExecution.concludeTurn()`؛ نفس استجابة في لاحق أداة استدعاء ما زال يمكن من حراسة حماية منع توقف، حلقة في هذا خطوة بعد إيقاف |
| عملية فرعية صندوق رملي (landlock / sandbox-exec) | عبر `dsh-bash-sandbox` استخدام `ctx.sandbox` خلفية؛ قدرة درجة آخر رفض استخدام `tools/pre-execute` |
| إذن نظام / AskUserQuestion | من `tools/pre-execute` إرجاع `ask` و عبر `ctx.approval` ينبغي جواب؛ لـ عادي مستخدم رفع سؤال تسجيل واحد مستقل موجه إلى نموذج ask أداة |
| Plan mode | [`@deepseek-ai/dsh-plan-mode`](../../packages/plan/plan-mode/README.zh.md): سقوط سجل `plan/mode` حالة،`plan:policy` جذب توجيه مقطع،`/plan [message]` مدخل،`/plan off` مباشر خروج، و مرور مستخدم مراجعة `exit_plan_mode` خروج فتحة؛ قوي صنع قيد إبقاء في مستقل صندوق رملي/مراجعة دفعة محور فوق |
| subagent تفويض إرسال | `ctx.subagents` مزود سجل التسجيل (`dsh-subagent-spawn-in-process`/`dsh-subagent-fork-in-process`/`dsh-subagent-acp`/`dsh-subagent-codex`/`dsh-subagent-claude-code`/`dsh-subagent-dsh-sdk`)+ `dsh-tool-subagent` نحو نموذج كشف واحد قد إعداد مزود |
| MCP | كل خادم واحد إضافة: اكتشاف أداة → `ctx.tools.register()` |
| skill(تقنية قدرة) | section + أداة تسجيل؛ استدعاء وقت عبر `inject()` حقن skill محتوى |
| تسجيل ذاكرة | section مزود + أداة |
| تحديد وقت مهمة (cron) | إضافة تسجيل موجه إلى نموذج ضبط درجة أداة؛ تحديد وقت جهاز إطلاق → فارغ خامل وقت `followup(…, {source: {kind: 'plugin', plugin: 'schedule'}})`/مشغول مشغول وقت `inject()` إشعار |
| UI(GUI؛CLI(أمر سطر واجهة) إخراج JSONL) | استماع `agent/assistant-stream` فوري chunk، و استماع `session/event` حمل دائم settlement، حد و أداة نشط حركة؛ إدخال → `followup()` |
| Web Client Chat عمل خدمة عقدة | تسجيل `ConversationNodeDefinition` و `conversation.chat.node` keyed renderer |
| بعيد قياس / يمكن إعادة تشغيل trace | `session/event` → JSONL؛ إعادة تشغيل = `sessions.create(id, { seed })` |
| نموذج مهايئ | عبر `registerAdapter` تسجيل `LlmAdapter` فرعي صنف (`dsh-llm-deepseek`،`dsh-llm-pi-ai`) |
| إضافة حار إعادة تحميل | كل تسجيل كل هو واحد `ctx.effect` → مع مستودع توفير HMR(حار وحدة استبدال) مباشر توليد فاعلية |

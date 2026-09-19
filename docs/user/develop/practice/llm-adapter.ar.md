# LLM مهايئ

[English](llm-adapter.md) | العربية

هذا نص وسيط تعريف مثل أي لـ Harness وصل دخول جديد نموذج مزود.

## عام وصف

LLM مهايئ هو واحد وراثة `LlmAdapter` و تنفيذ `stream()` طريقة صنف، هو سوف سوف Harness مزود غير متصل طلب تحويل لـ أداة جسم مزود API استدعاء، و سوف استجابة تحويل عودة Harness قسم قطعة.

## الأكثر صغير تنفيذ

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { LlmAdapter, type GenerateOptions, type StreamChunk } from '@deepseek-ai/dsh-llm'

class MyAdapter extends LlmAdapter {
  private apiKey: string

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    // 1. Convert options.messages to the provider format.
    // 2. Call the streaming API.
    // 3. Convert the response into StreamChunk values.
  }
}

export interface Config {
  apiKey: string
  providers: string[]
}

export const Config: Schema<Config> = Schema.object({
  apiKey: Schema.string().required(),
  providers: Schema.array(Schema.string()).required(),
})

export const name = 'my-llm-adapter'
export const inject = ['llm']

export function apply(ctx: Context, config: Config) {
  const adapter = new MyAdapter(config.apiKey)
  ctx.llm.registerAdapter(config.providers, adapter)
}
```

## StreamChunk بروتوكول

`stream()` يجب حسب التالي بروتوكول توليد قسم قطعة:

```ts
import { brandString } from '@deepseek-ai/dsh-brand'
import type { StreamChunk, ToolCallId } from '@deepseek-ai/dsh-llm'

async function* exampleChunks(): AsyncIterable<StreamChunk> {
  // 1. Start each content block with block-start.
  yield { type: 'block-start', index: 0, blockType: 'text' }

  // 2. Stream text through text-delta.
  yield { type: 'text-delta', index: 0, text: 'Hello' }
  yield { type: 'text-delta', index: 0, text: ' world' }

  // 3. End each content block with block-end and the complete block.
  yield {
    type: 'block-end',
    index: 0,
    block: { type: 'text', text: 'Hello world' },
  }

  // 4. Tool-call block.
  yield { type: 'block-start', index: 1, blockType: 'tool-call' }
  yield {
    type: 'tool-call-delta',
    index: 1,
    id: brandString<ToolCallId>('call-123'),
    name: 'bash',
    argumentsDelta: '{"command":"ls"}',
  }
  yield {
    type: 'block-end',
    index: 1,
    block: {
      type: 'tool-call',
      id: brandString<ToolCallId>('call-123'),
      name: 'bash',
      arguments: '{"command":"ls"}',
    },
  }

  // 5. Token usage.
  yield { type: 'usage', usage: { inputTokens: 100, outputTokens: 50 } }

  // 6. Finish reason.
  yield { type: 'finish', reason: { kind: 'stop' } }
  // Alternatively, { kind: 'tool-calls' } requests tool execution.
}
```

### صلة مفتاح قاعدة

- كل `block-start` كل يجب لديه و لـ مقابل `block-end`.
- `index` من 0 بدء تمرير زيادة، لأجل معرف محتوى كتلة ترتيب.
- `tool-call-delta` `argumentsDelta` هو أصلي JSON نص زيادة كمية، يمكن في واحد قسم قطعة في كامل توليد، أيضا يمكن قسم كثير عدد قسم قطعة توليد.
- `finish` يجب هو الأكثر بعد واحد قسم قطعة.
- `usage` يجب في `finish` قبل توليد.

## GenerateOptions

`stream()` استقبال مستودع توجيه خروج `GenerateOptions`. هو يتضمن نموذج، مهايئ يملك دفع إدارة قوي درجة ID، محادثة تاريخ، توجيه النظام، أداة schema، توليد معامل، إيقاف تسلسل و في توقف إشارة؛ كامل حقل بـ `@deepseek-ai/dsh-llm` توجيه خروج TypeScript نوع لـ دقيق. مهايئ يجب سوف دعم حمل حقل خريطة إلى أداة جسم API؛ إذا لا يمكن دعم حمل بعض عدد حقل، ينبغي رمي خروج حمل مستقر code `LlmError`، لا نيل ساكن صامت إسقاط.

طلب تغطية كتابة `resolveModel(provider, model, signal?)`، في مرة استعلام في إرجاع تأكيد قطع مزود/نموذج هوية و اختياري `context` و `reasoning` بيانات وصفية. دفع إدارة بيانات وصفية يتضمن لديه ترتيب لا نفاذ واضح ID، عرض اسم، و اختياري إعداد قيمة افتراضية؛ طلب إبقاء مهايئ إعطاء خروج مرجعي اختياري قائمة، يشمل ذلك فوق تنقل قدرة API إرجاع `off`، لا يلزم سوف هذه قيمة رفع رفع لـ نواة قلب قطعة رفع. مختلف خطوة استعلام يجب استجابة هذا اختياري إشارة، جعل إلغاء و مورد تحرير مرور مسار تماما توقف مستقر. خدمة سوف تحقق تجمع دمج نتيجة، و في استدعاء `stream()` قبل رفض صريح إشارة تحديد لكن لا تلقي دعم حمل دفع إدارة قوي درجة؛ حذف `reasoning` يمثل هذا نموذج لا يوجد اختياري دفع إدارة قوي درجة قدرة.

## تسجيل مهايئ

```ts ignore-check
ctx.llm.registerAdapter(['my-provider'], adapter)
```

رقم واحد معامل هو هذا مهايئ معالجة مزود توجيه قائمة.`GenerateOptions.provider` اختيار قد تسجيل مهايئ،`GenerateOptions.model` فإن نقل دخول من مهايئ يملك، بلا حاجة في دورة الحياة بدء وقت تسجيل نموذج id. مهايئ قدرة كاف نحو اختيار جهاز عام نشر نموذج خيار وقت، طلب تغطية كتابة `listModels()`.

## في cordis.yml في استخدام

```yaml
- id: my-llm
  name: './src/my-llm-adapter.ts'
  config:
    apiKey: !!js process.env.MY_API_KEY
    providers:
      - my-provider

- id: agent-loop
  name: '@deepseek-ai/dsh-agent-loop'
  config:
    agents:
      - id: main
        provider: my-provider
        model: my-model-v1
```

## فعلي حرب مشاركة اعتبار

مستودع في يتضمن التالي اثنان عدد كامل تنفيذ:

- `packages/llm/llm-deepseek/` — DeepSeek API مهايئ (OpenAI توافق صيغة)
- `packages/llm/llm-pi-ai/` — Pi AI مهايئ (مختلف API صيغة)

مقابل مقارنة هذا اثنان عدد قد تسليم مهايئ، يمكن يرى نفس طقم harness عقد نحو مثل أي في مختلف مزود SDK لـ فوق تنفيذ.

## خطأ معالجة

مهايئ ينبغي عبر حمل مستقر code `LlmError` رمي خروج نقل و بروتوكول لذا عائق؛agent loop(ذكي جسم حلقة) سوف إبقاء هذا خطأ و ذلك code، لأجل تشخيص و سياسة معالجة. لا يلزم اعتماد عادي `Error` يتم تلقائي تحويل. كل مزود HTTP طلب أيضا يجب دمج `attributionHeaders()`، و نقل تمرير `options.signal`.

```ts
import {
  attributionHeaders,
  LlmAdapter,
  LlmError,
  type GenerateOptions,
  type StreamChunk,
} from '@deepseek-ai/dsh-llm'

class HttpAdapter extends LlmAdapter {
  constructor(private readonly endpoint: string) {
    super()
  }

  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...attributionHeaders(),
      },
      body: JSON.stringify({ model: options.model, messages: options.messages }),
      ...options.signal ? { signal: options.signal } : {},
    })
    if (!response.ok) {
      throw new LlmError(`Provider API error: ${response.status}`, 'PROVIDER_HTTP_ERROR')
    }
    // A real adapter parses the response and emits the complete chunk sequence.
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}
```

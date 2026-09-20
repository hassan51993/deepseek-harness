# مهايئات LLM

[English](llm-adapter.md) | العربية

يوصل هذا الدليل مزوّدَ LLM جديدًا بالإطار.

## نظرة عامة

مهايئُ LLM يوسّع `LlmAdapter` وينفّذ `stream()`، فيترجم طلبَ الإطار المحايد تجاه المزوّدين إلى استدعاء واجهة المزوّد، ثم يترجم الاستجابةَ إلى قطع الإطار.

## تنفيذ أدنى

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

## بروتوكول StreamChunk

يُنتج `stream()` قطعًا وفق هذا البروتوكول:

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

### القواعد الأساسية

- لكل `block-start` ما يقابله من `block-end`.
- و`index` يتزايد من 0 ويحدّد ترتيبَ كتل المحتوى.
- و`tool-call-delta` يحمل نصَّ JSON خامًّا في `argumentsDelta`، دفعةً واحدة أو عبر عدة قطع.
- و`finish` هو القطعة الأخيرة.
- وأرسِل `usage` قبل `finish`.

## GenerateOptions

يستقبل `stream()` النوعَ المصدَّر `GenerateOptions`. وهو يضم النموذجَ، ومعرّفَ درجة الاستدلال الذي يملكه المهايئ، وتاريخَ المحادثة، وتوجيهَ النظام، وschemas الأدوات، ومعاملاتِ التوليد، وتسلسلاتِ الإيقاف، وإشارةَ الإجهاض؛ وعامِل نوعَ TypeScript الذي يصدّره `@deepseek-ai/dsh-llm` مرجعًا. واربط الحقولَ المدعومة بواجهة المزوّد. وإن عجز المزوّد عن احترام حقل، فارمِ `LlmError` برمز ثابت بدل إسقاطه في صمت.

وتجاوَز `resolveModel(provider, model, signal?)` ليعيد هويةَ المزوّد والنموذج بعينها مع بيانات `context` و`reasoning` الاختيارية في بحث واحد. وتضم بياناتُ الاستدلال معرّفاتٍ معتمة مرتَّبة وأسماءَ عرض مع قيمة افتراضية مضبوطة اختيارية؛ فاحفظ قائمةَ المهايئ المرجعية القابلة للاختيار، بما فيها `off` حين تعيدها واجهةُ قدرات المنبع، ولا ترفع تلك القيم إلى تعداد في النواة. واحترم الإشارةَ الاختيارية في البحث اللاتزامني ليبلغ الإلغاءُ والتحريرُ السكون. وتتحقق الخدمةُ من المجموع وترفض درجاتِ الاستدلال الصريحة غير المدعومة قبل `stream()`؛ وحذفُ `reasoning` يعني أن ذلك النموذج لا قدرةَ استدلال قابلة للاختيار له.

## تسجيل مهايئ

```ts ignore-check
ctx.llm.registerAdapter(['my-provider'], adapter)
```

ويعدّد الوسيط الأول مساراتِ المزوّدين التي يتولاها المهايئ. ويختار `GenerateOptions.provider` المهايئَ المسجَّل، بينما يمرّر `GenerateOptions.model` معرّفَ نموذج يملكه المهايئ بلا تسجيل في دورة الحياة. وتجاوَز `listModels()` حين يستطيع المهايئ إعلانَ خيارات النماذج للمحدِّدات.

## استعماله من cordis.yml

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

## التنفيذات المرجعية

يحتوي المستودع تنفيذين كاملين:

- `packages/llm/llm-deepseek/`: مهايئ واجهة DeepSeek بالصيغة المتوافقة مع OpenAI
- `packages/llm/llm-pi-ai/`: مهايئ Pi AI بصيغة واجهة مختلفة

فقارن المهايئين المشحونين لترى عقدَ الإطار نفسه منفَّذًا فوق حزم SDK مختلفة.

## معالجة الأخطاء

ترمي المهايئات أعطالَ النقل والبروتوكول قيمًا من `LlmError` برموز ثابتة. وتحفظ agent loop الخطأَ ورمزَه للتشخيص والسياسة؛ وهي لا تحوّل `Error` عاديًا تلقائيًا. وعلى كل طلب HTTP إلى المزوّد أن يدمج `attributionHeaders()` وأن يمرّر `options.signal`.

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

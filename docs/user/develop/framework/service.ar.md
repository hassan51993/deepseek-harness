# الخدمات والاعتماديات

[English](service.md) | العربية

الخدمةُ قدرةٌ تكشفها إضافةٌ لإضافات أخرى. و`inject` تعلن الخدماتِ التي تشترطها الإضافة.

## ما الخدمة؟

في الإطار، `tools` و`llm` و`agents` خدمات. وكلٌّ منها قدرةٌ مسمّاة مركَّبة على `ctx`:

```ts ignore-check
ctx.tools    // ToolRuntime service
ctx.llm      // LLM service
ctx.agents   // Agent service
```

ويجوز لأي إضافة أن توفّر خدمةً تستهلكها إضافات أخرى.

## استهلاك خدمة

أعلن `inject` لتستعمل خدمةً قائمة:

```ts ignore-check
export const inject = ['tools']

export function apply(ctx: Context) {
  // ctx.tools exists and is ready here.
  ctx.tools.register(/* ... */)
}
```

وحين يعمل `apply` تكون كلُّ خدمة أعلنها `inject` جاهزة. وإن لم تكن خدمةٌ جاهزة، انتظرت الإضافةُ بدل أن تعمل.

## توفير خدمة

### وسّع Service

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

export default class MetricsService extends Service {
  static inject = ['llm']  // A service may depend on other services.

  constructor(ctx: Context) {
    super(ctx, 'metrics')  // 'metrics' is the service name.
  }

  // Public service method.
  record(event: string, value: number) {
    // ...
  }
}
```

وبعد تحميل هذه الإضافة، يصل المستهلكون إلى الخدمة بـ `ctx.metrics`:

```ts ignore-check
export const inject = ['metrics']

export function apply(ctx: Context) {
  ctx.metrics.record('tool_call', 1)
}
```

### أعلن نوعها

استعمل دمجَ التصريحات في TypeScript لتنميط `ctx.metrics`:

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    metrics: MetricsService
  }
}

export default class MetricsService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'metrics')
  }

  record(event: string, value: number) { /* ... */ }
}
```

## سلوك الاعتماديات

### الاعتماديات المطلوبة والاختيارية

```ts ignore-check
// Required: the plugin does not load while the service is absent.
export const inject = ['tools']

// Optional: omit inject and query with ctx.get() at the use site.
export function apply(ctx: Context) {
  const metrics = ctx.get('metrics')
  metrics?.record('plugin_loaded', 1)
}
```

### حين تختفي خدمة

إن اختفت خدمةٌ مطلوبة والتطبيقُ يعمل، مثلًا لأن مزوّدها فُرِّغ:

1. تُحرَّر الإضافاتُ المعتمدة عليها تلقائيًا.
2. وتُحمَّل من جديد حين تعود الخدمة.

وهذا يمنع إضافةً من استدعاء خدمة لم تعد موجودة.

<a id="service-isolation"></a>

## عزل الخدمات

يستطيع `cordis.yml` عزلَ الخدمات فترى مجموعاتُ الإضافات المنفصلة نسخًا منفصلة من الخدمة نفسها:

```yaml
- id: group-a
  name: '@deepseek-ai/cordis-plugin-group'
  group: true
  isolate:
    shell: true
  config:
    - name: '@deepseek-ai/dsh-bash-local'
      config:
        timeoutMs: 5000
    - name: './src/plugin-a.ts'

- id: group-b
  name: '@deepseek-ai/cordis-plugin-group'
  group: true
  isolate:
    shell: true
  config:
    - name: '@deepseek-ai/dsh-bash-local'
      config:
        timeoutMs: 60000
    - name: './src/plugin-b.ts'
```

فترى `plugin-a` و`plugin-b` كلٌّ منهما نسخةَ Bash في مجموعتها هي، بلا أثر عابر بين المجموعتين.

## خدمات الإطار المدمجة

يولّد المستودع أسماءَ الخدمات وطرقَها العامة ومواضعَ مصادرها في [صفحة النظام الفرعي](../../../subsystems/core.ar.md) لكل خدمة. فاستعمل تلك المناطق المولَّدة وواجهةَ TypeScript الخاصة بالخدمة أثناء تطوير إضافة؛ ولا تصُن قائمةً ساكنة ثانية.

## الخطوات التالية

- [نظام الأحداث](./events.ar.md): تواصل بين الإضافات بلا اقتران محكم
- [طبقات القدرات](../practice/index.ar.md): استعمل الخدماتِ واجهاتِ قدرات

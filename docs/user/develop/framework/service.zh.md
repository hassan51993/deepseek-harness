# خدمة و اعتماد

[English](service.md) | العربية

خدمة هو واحد إضافة نحو أخرى إضافة عام قدرة.inject إعلان إضافة حاجة أي بعض خدمة.

## ماذا هو خدمة

في Harness في،`tools`،`llm`،`agents` كل هو خدمة. خدمة هو تركيب في `ctx` فوق تسمية قدرة:

```ts ignore-check
ctx.tools    // ToolRuntime service
ctx.llm      // LLM service
ctx.agents   // Agent service
```

أي إضافة كل يمكن توفير خدمة، توفير أخرى إضافة استخدام.

## استخدام خدمة

إعلان `inject` قدوم استخدام قد لديه خدمة:

```ts ignore-check
export const inject = ['tools']

export function apply(ctx: Context) {
  // ctx.tools exists and is ready here.
  ctx.tools.register(/* ... */)
}
```

إطار هيكل حفظ إثبات: في `apply` تنفيذ وقت،`inject` إعلان خدمة قد الكل حينئذ خيط. إذا خدمة أيضا لا دقيق تجهيز جيد، أنت إضافة سوف انتظار حال، لن تنفيذ.

## توفير خدمة

### استخدام Service أساس صنف

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

تحميل هذا عدد إضافة بعد، مستهلك حينئذ يمكن عبر `ctx.metrics` وصول هو:

```ts ignore-check
export const inject = ['metrics']

export function apply(ctx: Context) {
  ctx.metrics.record('tool_call', 1)
}
```

### نوع إعلان

استخدام TypeScript إعلان دمج يجعل `ctx.metrics` لديه صحيح تأكيد نوع:

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

## اعتماد سلوك

### مطلوب اعتماد و اختياري اعتماد

```ts ignore-check
// Required: the plugin does not load while the service is absent.
export const inject = ['tools']

// Optional: omit inject and query with ctx.get() at the use site.
export function apply(ctx: Context) {
  const metrics = ctx.get('metrics')
  metrics?.record('plugin_loaded', 1)
}
```

### خدمة إزالة فقد وقت سلوك

إذا تطبيق تشغيل خلال بعض بند مطلوب خدمة إزالة فقد (مثال مثل ذلك مزود إزالة):

1. اعتماد هو إضافة سوف تلقائي dispose(مورد تحرير)
2. عند خدمة إعادة ظهور وقت، إضافة تلقائي إعادة تحميل

هذا يمكن منع توقف إضافة استدعاء قد لا وجود خدمة.

<a id="service-isolation"></a>

## خدمة عزل

`cordis.yml` دعم حمل خدمة عزل——نفس عدد خدمة يمكن لديه كثير عدد نسخة، مختلف إضافة مجموعة يرى مختلف نسخة:

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

`plugin-a` و `plugin-b` كل منها يرى ذاتي ذات مجموعة داخل Bash نسخة، متبادل لا أثر.

## Harness داخل وضع خدمة

خدمة اسم، عام طريقة و شفرة المصدر موضع من مستودع تلقائي توليد إلى كل خدمة[فرعي نظام صفحة](../../../subsystems/core.zh.md). تطوير إضافة وقت ينبغي بـ هذه توليد منطقة كتلة و خدمة TypeScript واجهة لـ دقيق، لا يلزم صيانة آخر نسخة ساكن حالة بيان.

## تحت واحد خطوة

- [حدث نظام](./events.zh.md) — إضافة بين رخو اقتران دمج عبر معلومة
- [قدرة قسم طبقة](../practice/index.zh.md) — سوف خدمة استخدام عمل قدرة واجهة

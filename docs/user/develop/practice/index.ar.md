# تصميم القدرات ذات الأدوار الثلاثة

[English](index.md) | العربية

لهذه الصفحة جزآن: مرجعٌ مفاهيمي لنمط القدرة ذات الأدوار الثلاثة، يليه درسٌ متقدم يبني قدرةً واحدة. فأكمل [مسار الإضافة الأساسي](../basic/index.ar.md) و[درس الخدمات](../framework/service.ar.md) أولًا.

## مرجع مفاهيمي

حين تكون القدرة عامةً بما يكفي لتحتاج مزوّدين قابلين للاستبدال، مثل تنفيذ Bash، يفصل الإطارُ ثلاثةَ أدوار: **Service Definition** و**Service Provider** و**Consumer**. وضع الأدوارَ في حزم منفصلة حين تحتاج إلى التطور أو الاستبدال مستقلةً؛ وإلا جاز للحزمة الواحدة أن تملك أكثر من دور. والقدرةُ كاملةً هي seam الخاص بها. ولا دورَ منفرد يكون seam.

## مثال Bash

تتكوّن قدرةُ تنفيذ Bash من:

- **Service Definition** (`dsh-shell`): تعرّف خدمةَ Cordis وأنواعَ طلب Bash ونتيجته
- **Service Provider** (`dsh-bash-local`): ينفّذ الأوامر على الجهاز المحلي
- **Consumer** (`dsh-tool-bash`): يكشف القدرةَ أداةً يستدعيها النموذج

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  dsh-shell   │────▶│  dsh-bash-local  │     │ dsh-tool-bash│
│(definition) │     │    (provider)     │     │(consumer/tool)│
└─────────────┘     └──────────────────┘     └──────────────┘
       ▲                                            │
       └────────────────────────────────────────────┘
                    inject: ['shell']
```

## فوائد القسمة

### استبدال المزوّدين

يجوز أن يكون لـ Service Definition واحدة عدةُ مزوّدين يُختارون من `cordis.yml`:

```yaml
# Local execution
- name: '@deepseek-ai/dsh-bash-local'

# Replace this row with another package that provides the same service.
```

وتبقى Service Definition والأداةُ بلا تغيير بينما يتغيّر المزوّد.

### التطور المستقل

- تتغيّر Service Definition نادرًا بعد أن يعتمد المستدعون على عقدها.
- ويستطيع Service Providers تحسينَ الأداء والأمان مستقلَّين.
- ويستطيع المستهلكون تغييرَ كيفية عرضهم القدرةَ للنموذج.

### فكّ ارتباط الاعتماديات

- يعتمد Service Provider على Service Definition.
- ويعتمد Consumer على Service Definition.
- و**لا يعتمد** Service Provider وConsumer أحدهما على الآخر.

ويملك [مرجع seams القدرات](../../../capability-seams.ar.md) العائلاتِ المدمجة الحالية وروابطَ حزمها.

## درس: طوّر قدرةً ذات ثلاثة أدوار

### الخطوة 1: اكتب Service Definition

```ts ignore-check
// packages/my-cap/my-cap/src/index.ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    myCap: MyCapService
  }
}

export abstract class MyCapService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'myCap')
  }

  /** Execute the capability. */
  abstract execute(request: MyCapRequest): Promise<MyCapResult>
}

export interface MyCapRequest {
  input: string
}

export interface MyCapResult {
  output: string
}
```

### الخطوة 2: اكتب Service Provider

```ts ignore-check
// packages/my-cap/my-cap-local/src/index.ts
import type { Context } from '@deepseek-ai/cordis'
import { MyCapService, type MyCapRequest, type MyCapResult } from '@deepseek-ai/dsh-my-cap'

class MyCapLocal extends MyCapService {
  async execute(request: MyCapRequest): Promise<MyCapResult> {
    // Local provider behavior.
    return { output: request.input.toUpperCase() }
  }
}

export const name = 'my-cap-local'

export function apply(ctx: Context) {
  ctx.plugin(MyCapLocal)
}
```

### الخطوة 3: اكتب مستهلكًا

```ts ignore-check
// packages/my-cap/tool-my-cap/src/index.ts
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'tool-my-cap'
export const inject = ['tools', 'myCap']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'my_cap',
    description: 'Execute my capability.',
    parameters: {
      input: { type: 'string', required: true },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      const result = await ctx.myCap.execute({ input: args.input })
      return result.output
    },
  }))
}
```

### ركّبها في cordis.yml

```yaml
- name: '@deepseek-ai/dsh-my-cap-local'
- name: '@deepseek-ai/dsh-tool-my-cap'
```

## نقاط التصميم

- **لا تقسم استباقًا**: استعمل حزمًا منفصلة حين تحتاج الأدوارُ إلى التطور مستقلةً وحدها. وإضافةُ الأداة البسيطة لا تحتاج ذلك.
- **Service Definition تملك أنواع الطلب والنتيجة**: فلا يعتمد Service Providers والمستهلكون إلا على حزمة Service Definition.
- **الصريح مقدَّم على الضمني**: احسم القيمَ الافتراضية في خطوة `resolve(request): Spec` صريحة، لا بإخفاء تعبيرات `?? default` داخل `run()`.

## الخطوات التالية

- [مهايئ LLM](./llm-adapter.ar.md): نفّذ مزوّد LLM

# قدرة ثلاثة نوع زاوية لون تصميم

[English](index.md) | العربية

هذا نص قسم لـ اثنان جزء: أولا مشاركة اعتبار ثلاثة نوع زاوية لون قدرة نمط عام فكرة، مجددا عبر عال درجة تعليم مسار بناء واحد بند قدرة. طلب أولا إتمام[أساس أساس إضافة مسار](../basic/index.ar.md) و[خدمة تعليم مسار](../framework/service.ar.md).

## عام فكرة مشاركة اعتبار

عند واحد بند قدرة كاف كاف عام، حاجة دعم حمل يمكن استبدال مزود وقت (مثال مثل Bash تنفيذ) ،harness سوف منطقة قسم ثلاثة نوع زاوية لون:**Service Definition**،**Service Provider** و **Consumer**. زاوية لون حاجة مستقل عرض دخول أو استبدال وقت، سوف هو جمع وضع دخول مختلف حزمة؛ لا فإن واحد حزمة يمكن تحمل تحمل كثير عدد زاوية لون. كامل قدرة بنية صار ذلك seam. أي مفرد واحد زاوية لون كل لا هو seam.

## بـ Bash لـ مثال

بـ Bash تنفيذ قدرة لـ مثال:

- **Service Definition** (`dsh-shell`): تعريف Cordis خدمة و Bash طلب و نتيجة نوع
- **Service Provider** (`dsh-bash-local`): في محلي حساب حساب آلة فوق تنفيذ أمر
- **Consumer** (`dsh-tool-bash`): سوف هذا قدرة عام لـ نموذج يمكن استدعاء أداة

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  dsh-shell   │────▶│  dsh-bash-local  │     │ dsh-tool-bash│
│(definition) │     │    (provider)     │     │(consumer/tool)│
└─────────────┘     └──────────────────┘     └──────────────┘
       ▲                                            │
       └────────────────────────────────────────────┘
                    inject: ['shell']
```

## تفكيك قسم جيد موضع

### مزود يمكن استبدال

نفس عدد Service Definition يمكن لديه كثير عدد مزود، يمكن عبر `cordis.yml` اختيار:

```yaml
# Local execution
- name: '@deepseek-ai/dsh-bash-local'

# Replace this row with another package that provides the same service.
```

أكثر تبديل مزود وقت،Service Definition و أداة متساو إبقاء ثابت.

### مستقل عرض دخول

- استدعاء جهة بدء اعتماد Service Definition اتفاق بعد،Service Definition جدا قليل تعديل.
- Service Provider يمكن مستقل أفضل تحويل صفة قدرة و أمان صفة.
- Consumer يمكن ضبط كامل قدرة نحو نموذج عرض طريقة.

### اعتماد حل اقتران

- Service Provider اعتماد Service Definition.
- Consumer اعتماد Service Definition.
- Service Provider و Consumer **متبادل لا اعتماد**.

حالي داخل وضع نظام صف و ذلك حزمة رابط من[قدرة seam مشاركة اعتبار](../../../capability-seams.ar.md) مسؤول.

## تعليم مسار: تطوير ثلاثة نوع زاوية لون قدرة

### رقم واحد خطوة: تحرير كتابة Service Definition

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

### ثاني خطوة: تحرير كتابة Service Provider

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

### رقم ثلاثة خطوة: تحرير كتابة مستهلك

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

### في cordis.yml في تركيب

```yaml
- name: '@deepseek-ai/dsh-my-cap-local'
- name: '@deepseek-ai/dsh-tool-my-cap'
```

## تصميم يلزم نقطة

- **لا يلزم مسبق منع صفة تفكيك قسم**: فقط لديه زاوية لون حاجة مستقل عرض دخول وقت، عندئذ استخدام مختلف حزمة. بسيط مفرد أداة إضافة بلا حاجة تفكيك قسم.
- **Service Definition يملك Request/Result نوع**:Service Provider و Consumer فقط اعتماد Service Definition حزمة.
- **صريح أفضل في خفي صيغة**: تنفيذ ينبغي عبر صريح `resolve(request): Spec` خطوة معالجة قيمة افتراضية، بينما لا هو في `run()` في إخفاء `?? default`.

## تحت واحد خطوة

- [LLM(كبير لغة نموذج) مهايئ](./llm-adapter.ar.md): تنفيذ واحد LLM مزود

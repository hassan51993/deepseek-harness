# تطوير واحد أداة

[English](tool.md) | العربية

هذا تعليم مسار سوف في Web UI في إضافة واحد `greet` أداة. طلب أولا إتمام[رقم واحد إضافة](./index.ar.md) ، و إبقاء منها `scratch-plugin` دليل.

## إنشاء أداة إضافة

سوف `scratch-plugin/src/my-plugin.ts` استبدال لـ:

```ts
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'greet-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet someone by name.',
    parameters: {
      name: { type: 'string', required: true, description: 'The name to greet' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `Hello, ${args.name}!`
    },
  }))
}
```

`inject` يجعل Cordis انتظار أداة سجل التسجيل حينئذ خيط.`defineTool` أصل حسب `parameters` دفع توجيه و تحقق `args`؛`execute` إرجاع `output.schema` إعلان مواصفة قيمة،`output.render` مجددا سوف هذا قيمة تحويل لـ موجه إلى نموذج محتوى.

## تشغيل و استدعاء أداة

إذا تطوير أمر لم في تشغيل، طلب إعادة بدء:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

فتح `http://127.0.0.1:3080`، لكن بعد إدخال:`Use the greet tool to greet Ada.` نموذج يمكن استدعاء `greet`، و استلام إلى `Hello, Ada!` هذا واحد أداة نتيجة.

## تحت واحد خطوة

- [إضافة إعداد](./config.ar.md) — يجعل سؤال انتظار لغة يمكن إعداد.
- [أداة تحرير كتابة مشاركة اعتبار](../../../cookbook/adding-a-tool.ar.md) — فحص قراءة تضمين طقم schema، مواصفة قيمة، خلفية عمل، سياسة خطاف،PTC mode و UI بطاقة.
- [قدرة قسم طبقة](../practice/index.ar.md) — سوف يمكن استبدال قدرة تفكيك قسم لـ Service Definition،Service Provider و Consumer ثلاثة صنف حزمة.

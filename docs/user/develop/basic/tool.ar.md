# بناء أداة

[English](tool.md) | العربية

يضيف هذا الدرس أداةَ `greet` إلى واجهة Web. فأكمل [إضافتك الأولى](./index.ar.md) أولًا واحتفظ بدليل `scratch-plugin` الخاص بها.

## أنشئ إضافة الأداة

استبدل `scratch-plugin/src/my-plugin.ts` بهذا:

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

و`inject` تجعل Cordis ينتظر registry الأدوات. و`defineTool` يستنتج `args` من `parameters` ويتحقق منها؛ و`execute` يعيد القيمةَ المعيارية التي يعلنها `output.schema`، و`output.render` يحوّل تلك القيمة إلى محتوى موجَّه إلى النموذج.

## شغّل الأداة واستدعِها

أعِد تشغيل أمر التطوير إن لم يكن يعمل:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

افتح `http://127.0.0.1:3080` واطلب: `Use the greet tool to greet Ada.` فيستطيع النموذج استدعاءَ `greet` ويتلقى `Hello, Ada!` نتيجةً للأداة.

## الخطوات التالية

- [إعداد الإضافات](./config.ar.md): اجعل التحية قابلة للضبط.
- [مرجع تأليف الأدوات](../../../cookbook/adding-a-tool.ar.md): ابحث فيه عن schemas المتداخلة، والقيم المعيارية، والعمل الخلفي، وخطافات السياسة، ووضع PTC، وبطاقات الواجهة.
- [طبقات القدرات](../practice/index.ar.md): اقسم قدرةً قابلة للاستبدال إلى حزم Service Definition وService Provider وConsumer.

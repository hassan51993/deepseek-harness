# Cookbook: إضافة جديدة ضبط بطاقة

[English](adding-a-settings-card.md) | العربية

إضافة مثل أي يأخذ ذاتي ذات إعداد وضع فوق Web ضبط صفحة. هذا بند مسار فوق لا يوجد أي واحد خطوة حاجة تعديل هذا مستودع:Host خدمة كل واحد قد تسجيل settings نطاق الأسماء، بينما**إضافة إعداد**قسم منطقة بـ بطاقة الذي تحرير نطاق الأسماء لـ مفتاح، لذلك معا تسجيل اثنان عدد نصف جانب إضافة سوف يتم تلقائي إعداد مقابل.

اثنان عدد نصف جانب إقامة في نفس عدد حزمة داخل——Host نصف جانب في `src/`، متصفح نصف جانب في `src/client/`، بـ `./client` تصدير و استخدام `dsh.client` إعلان.[`packages/client/ui-theme`](../../packages/client/ui-theme) هو هذا نوع تحزيم طريقة الآن صار مثال فرعي؛ هذا قسم منطقة ذاتي حمل بطاقة في [`packages/client/ui-settings-plugins`](../../packages/client/ui-settings-plugins).

## 1. تسجيل نطاق الأسماء (Host نصف جانب)

نطاق الأسماء حينئذ هو إعداد مقابل استخدام مفتاح، الذي بـ فقط انتقاء مرة، و في اثنان عدد نصف جانب كل كتابة خروج هو. قد لديه `cordis.yml` entry مستهلك ينبغي عبر `ctx.settings.installSection()` تسجيل——هو يأخذ entry طبقة تراكم في مستخدم وثيقة لـ تحت، و في لا يوجد تركيب settings provider وقت وفق معتاد عمل:

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-settings'
import z from '@deepseek-ai/schemastery'

declare function assertReachable(endpoint: string | undefined): void
declare function rebuildFromSettings(config: Config): void

export const MY_PLUGIN_NS = 'my-plugin'

export interface Config {
  endpoint?: string
  retries?: number
}

export const Config: z<Config> = z.object({
  endpoint: z.string(),
  retries: z.number().step(1).min(0).default(3),
})

export function apply(ctx: Context, config: Config) {
  let source = () => config
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.installSection(ctx, MY_PLUGIN_NS, Config, config, {
      // Constraints the schema cannot express refuse the write, not the next use.
      validate: value => void assertReachable(value.endpoint),
      setSource: (current) => { source = current },
      onChange: () => { rebuildFromSettings(source()) },
    })
  })
}
```

حقل فوق `role('secret')` يجعل هو قيمة لا ظهور في أي استجابة داخل؛ بطاقة يأخذ هذا صنف حقل كتابة دخول `update`/`mutate` تحميل حمل، أو تعديل لـ مرور `credentials` مجال بحث عنوان واحد اعتماد مرجع.`applies: 'restart'` إبلاغ إبلاغ إعداد جدول طبقة: يملك جهة يلزم إلى تحت مرة بدء عندئذ سوف مقابل تغيير توليد فاعلية.

## 2. تسجيل بطاقة (متصفح نصف جانب)

بطاقة بـ ذاتي ذات نطاق الأسماء لـ مفتاح تسجيل دخول `settings.plugin.item`، و يملك منها واحد قطع——خارج مراقبة، تحكم عنصر و نص سجل. هو عبر `ctx.settingsScope` قراءة كتابة، بعد من استخدام قراءة وقت revision لـ كل مرة كتابة ضبط شبكة:

```ts ignore-check
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: the keyed slot's declaration. Cross-plugin collaboration goes
// through cordis services; a value import fails the client bundle-purity gate.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'

export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

export function apply(ctx: ClientContext): void {
  const card = new MyPluginCardController(ctx.settingsScope.bind({ namespace: 'my-plugin' }))
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: 'my-plugin',
    locale: 'settings.myPlugin',
    inject: () => card.inject(),
  }, MyPluginCard),
  )
}
```

scope لقطة يحمل جدول مفرد الذي يحتاج واحد قطع: تحليل بعد `value`، تجميع طبقة `base`، و أصلي `user` طبقة——حقل هل يتم تغطية، أخذ قرار في هو في `user` طبقة في هل**ظهور**، بينما غير هو قيمة.`scope.set(field, value)` تخزين واحد حقل،`scope.unset(field)` يأخذ هو صاف عودة تجميع طبقة.

## 3. وسم صفحة أخذ هو فعل ماذا

**إضافة إعداد**وسم صفحة قراءة Host خدمة أي بعض نطاق الأسماء، و لـ كل نطاق الأسماء إرسال إرسال واحد slot مفتاح. عند Host خدمة بعض بطاقة مفتاح وقت هو يتم تصيير، لا فإن يتم قفز مرور، لذلك من لم تجميع مرور Host نصف جانب نشر لن إبقاء تحت هذا ورقة بطاقة أي أثر أثر. يتم خدمة لكن بلا شخص إقرار قيادة نطاق الأسماء ماذا كل لا تصيير——عودة أخرى صفحة كل ذلك بعض نطاق الأسماء (`ui-theme`،`permission`،`llm-*`) صحيح هو هذا مثال إبقاء في هذا وسم صفحة خارج.

بطاقة حسب ذلك تسجيل دخول هذا slot ترتيب ظهور؛keyed entry لا إعلان ذاتي ذات `order`.

## تحزيم

متصفح نصف جانب من[عميل وحدة نظام](../../packages/client/modules) توفير إعطاء صفحة: هو مسح قد تفعيل Loader entries في إعلان `dsh.client` حزمة، و توفير كل حزمة بناء خروج `./client` تصدير. لذلك فقط يلزم `cordis.yml` تركيب هذا إضافة، هو حينئذ سوف ظهور في صفحة فوق——بلا حاجة إعادة بناء Web تطبيق.

```jsonc
{
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./client": { "types": "./lib/types/client/index.d.ts", "default": "./lib/client.js" }
  },
  "dsh": { "client": { "platform": "web", "inject": ["@deepseek-ai/dsh-client-ui-settings-plugins"] } }
}
```

bundle يجب هو loader lazy-CJS factory ناتج. في هذا مستودع داخل،`tsdown.config.ts` حينئذ هو أساس في مشترك مسبق ضبط ثلاثة سطر:

```ts ignore-check
import { clientBundle } from '../tsdown.client.ts'

export default clientBundle('@deepseek-ai/dsh-client-my-plugin', ['lib/types/index.js', 'lib/types/invariant.js'])
```

لا يوجد قد إصدار مسبق ضبط كشف هذا حزمة، لذلك هذا مستودع خارج حزمة نيل ذاتي سطر تكرار لحظة نفس مثال إخراج صيغة.bundle صاف صاف درجة بوابة معا رفض عبر إضافة قيمة استيراد، الذي بـ بطاقة لا يمكن استيراد هذا قسم منطقة بطاقة خارج مراقبة أو ذلك مؤقت تخزين جدول مفرد نموذج——هو تصيير ذاتي ذات ذلك واحد نسخة، و ذاتي سطر يملك مؤقت تخزين و revision ضبط شبكة. هذا اثنان بند حد كل تسجيل في[هذا قسم منطقة معروف حد](../../packages/client/ui-settings-plugins/README.ar.md#known-limitations-and-deferred-work) داخل.

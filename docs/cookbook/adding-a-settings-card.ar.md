# دليل عملي: إضافة بطاقة إعدادات

[English](adding-a-settings-card.md) | العربية

كيف تضع إضافةٌ إعدادَها هي في صفحة الإعدادات على الويب. ولا يحتاج أي شيء في هذا المسار تغييرًا داخل هذا المستودع: فالمضيف يخدم كل فضاء أسماء إعدادات مسجَّل، ويفهرس قسمُ **الإضافات** بطاقاتِه بفضاء الأسماء الذي تحرّره، فتُقرن الإضافةُ التي تسجّل النصفين تلقائيًا.

ويسكن النصفان في حزمة واحدة: نصفُ المضيف تحت `src/`، ونصفُ المتصفح تحت `src/client/`، مصدَّرًا باسم `./client` ومعلَنًا بـ `dsh.client`. و[`packages/client/ui-theme`](../../packages/client/ui-theme) مثالٌ عملي على تلك الحزمة؛ أما البطاقات التي يشحنها هذا القسم فتسكن في [`packages/client/ui-settings-plugins`](../../packages/client/ui-settings-plugins).

## 1. سجّل فضاء الأسماء (نصف المضيف)

فضاء الأسماء هو مفتاح الوصل، فاخترْه مرةً واكتبه في النصفين. والمستهلك الذي له مدخل `cordis.yml` أصلًا ينبغي أن يسجّل عبر `ctx.settings.installSection()`، فهو يطبّق المدخل تحت وثيقة المستخدم ويظل يعمل حين لا يكون مزوّدُ إعدادات مركَّبًا:

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

و`role('secret')` على حقل يُبقي قيمتَه خارج كل استجابة؛ فتكتب البطاقةُ مثلَ هذا الحقل في حمولة `update` أو `mutate`، أو تخاطب مرجعَ اعتماد عبر مجال `credentials` بدلًا من ذلك. و`applies: 'restart'` يخبر سطحَ الإعداد أن المالك لا يتصرف على التغيير إلا عند الإقلاع التالي.

## 2. سجّل البطاقة (نصف المتصفح)

تسجّل البطاقة في `settings.plugin.item` تحت فضاء أسمائها، وتملك كل ما بداخلها: الإطار وعناصر التحكم والنصوص. وهي تقرأ وتكتب عبر `ctx.settingsScope` الذي يسيّج كل كتابة بالمراجعة التي قرأها:

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

وتحمل لقطةُ النطاق ما يحتاجه النموذج: القيمةَ المحلولة `value`، وطبقةَ التركيب `base`، وطبقةَ `user` الخام التي يكون **وجودُ** مفتاحها فيها، لا قيمتُه، هو ما يسم الحقل بأنه متجاوَز. و`scope.set(field, value)` يخزّن حقلًا واحدًا، و`scope.unset(field)` يعيده إلى طبقة التركيب.

## 3. ماذا يفعل التبويب بها

يقرأ تبويب **إعداد الإضافات** فضاءاتِ الأسماء التي يخدمها المضيف، ويوزّع مفتاحَ فتحة واحدًا لكل فضاء. وتُصيَّر البطاقة حين يخدم المضيف مفتاحَها، وتُتخطّى حين لا يخدمه، فالنشرُ الذي لم يركّب نصفَ المضيف قط لا يُظهر أثرًا للبطاقة. وفضاءُ أسماء مخدوم لا تطالب به بطاقة لا يصيّر شيئًا، وهكذا تبقى فضاءاتُ الأسماء التي تملكها صفحات أخرى (`ui-theme` و`permission` و`llm-*`) خارج هذا التبويب.

وتظهر البطاقات بترتيب تسجيلها في الفتحة؛ ولا يعلن المدخل المفهرس ترتيبًا خاصًّا به.

## الحزم

يخدم [نظام وحدات العميل](../../packages/client/modules) نصفَ المتصفح إلى الصفحة، إذ يمسح مداخلَ Loader المفعَّلة بحثًا عن الحزم التي تعلن `dsh.client` ويخدم تصدير `./client` المبني لكل منها. فتظهر الإضافة في الصفحة فور أن يركّبها `cordis.yml`، بلا إعادة بناء لتطبيق الويب.

```jsonc
{
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./client": { "types": "./lib/types/client/index.d.ts", "default": "./lib/client.js" }
  },
  "dsh": { "client": { "platform": "web", "inject": ["@deepseek-ai/dsh-client-ui-settings-plugins"] } }
}
```

ويجب أن تكون الحزمة ناتجَ مصنع CJS الكسول الخاص بالمحمِّل. وداخل هذا المستودع يزيد `tsdown.config.ts` ثلاثةَ أسطر على الإعداد المشترك:

```ts ignore-check
import { clientBundle } from '../tsdown.client.ts'

export default clientBundle('@deepseek-ai/dsh-client-my-plugin', ['lib/types/index.js', 'lib/types/invariant.js'])
```

ولا يكشف أي إعداد منشور هذه الحزمة، فعلى حزمة خارج هذا المستودع أن تعيد إنتاج صيغة الخرج نفسها بنفسها. وترفض بوابةُ نقاء الحزم أيضًا الاستيرادات القيمية بين الإضافات، فلا تستطيع بطاقة أن تستورد إطارَ بطاقات هذا القسم ولا نموذجَ استمارته المرحَّلة، وإنما تصيّر إطارها هي وتملك ترحيلَها وتسييجَ مراجعتها. والحدّان مسجَّلان في [حدود القسم المعروفة](../../packages/client/ui-settings-plugins/README.ar.md#known-limitations-and-deferred-work).

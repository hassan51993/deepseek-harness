# 4. الأحداث

[English](04-events.md) | العربية

تدعم الخدماتُ الاستدعاءَ المباشر؛ أما **الأحداث** فتتيح لإضافة أن تعلن شيئًا بلا معرفة أي الإضافات تستمع. ويستعمل الإطارُ الأحداثَ في تفاعلات مثل نتائج الأدوات وطلبات النماذج وقرارات الموافقة.

## أعلن وأرسِل واستمع

أنشئ `stats.ts` في `tmp/cordis-tutorial`، وهو خدمةٌ تعدّ الأشياء وتعلن كلَّ تغيّر:

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    stats: StatsService
  }
  interface Events {
    'stats/report'(name: string, count: number): void
  }
}

export class StatsService extends Service {
  private counts = new Map<string, number>()

  constructor(ctx: Context) {
    super(ctx, 'stats')
  }

  bump(name: string) {
    const next = (this.counts.get(name) ?? 0) + 1
    this.counts.set(name, next)
    this.ctx.emit('stats/report', name, next)
  }
}

export const name = 'stats'

export function apply(ctx: Context) {
  ctx.plugin(StatsService)
}
```

ودمجُ `interface Events` توأمُ دمج `interface Context` من الفصل الثالث في نظام الأحداث: فهو يعلن اسمَ الحدث وتوقيعَ مستمعه، ليكون `ctx.emit` و`ctx.on` منمَّطَين تمامًا. وعُرفُ التسمية `namespace/action` يُبقي فضاءَ الأحداث المسطّح مقروءًا.

أنشئ `reporter.ts`:

```ts ignore-check
import type { Context } from '@deepseek-ai/cordis'
import type {} from './stats.ts'

export const name = 'reporter'
export const inject = ['stats']

export function apply(ctx: Context) {
  ctx.on('stats/report', (name, count) => {
    console.log(`[stats] ${name} -> ${count}`)
  })
  ctx.stats.bump('tool_call')
  ctx.stats.bump('tool_call')
  ctx.stats.bump('prompt')
}
```

والسطر `import type {} from './stats.ts'` لا يستورد شيئًا في وقت التشغيل؛ وإنما يوجد ليرى TypeScript دمجَ التصريحات. ركّب وشغّل:

```yaml
- name: './stats.ts'
- name: './reporter.ts'
```

```
[stats] tool_call -> 1
[stats] tool_call -> 2
[stats] prompt -> 1
```

ولأن `ctx.on()` أثر، يختفي المستمعُ مع الإضافة، فلا مسكَ دفاتر لـ `removeListener` يدويًا أبدًا.

## أوضاع التوزيع

`emit` واحدٌ من خمسة أوضاع توزيع. والوضعُ الذي يستعمله الحدثُ جزءٌ من عقده، فهو يقرّر هل يستطيع المستمعون إعادةَ قيم، أو العملَ على التوازي، أو قطعَ بعضهم بعضًا:

| الوضع | الاستدعاء | الدلالة |
|---|---|---|
| emit | `ctx.emit(name, ...args)` | بثٌّ تزامني؛ ولا تُنتظر الوعودُ والقيمُ المعادة ولا تُجمع. |
| parallel | `await ctx.parallel(name, ...args)` | يعمل كل المستمعين على التوازي؛ ويُنتظرون معًا. |
| serial | `await ctx.serial(name, ...args)` | يعمل المستمعون بالترتيب ويُنتظرون؛ وأولُ قيمة ليست `null` ولا `false` ولا `undefined` تفوز وتوقف الباقي. |
| bail | `ctx.bail(name, ...args)` | نسخةُ serial التزامنية. |
| waterfall | `ctx.waterfall(name, ...args, next)` | middleware محيط؛ انظر أدناه. |

وكلُّ حدث في الإطار يوثّق وضعَه في المرجع المولَّد في [صفحة نظامه الفرعي](../subsystems/core.ar.md).

## waterfall: التحويل أو القطع

waterfall هو الوضعُ الذي يشغّل الاعتراض. فكل مستمع يتلقى الوسائطَ مع متابعة `next()`؛ ويستطيع تحويلَ ما يعيده `next()`، أو العودةَ بلا استدعائه فيقطع بقيةَ السلسلة، وهو ما تسمّيه وثائقُ Cordis النقض. أنشئ `waterfall-demo.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Events {
    'demo/transform'(input: string, next: () => Promise<string>): Promise<string>
  }
}

export const name = 'waterfall-demo'

export function apply(ctx: Context) {
  // Listener 1: wrap the downstream result.
  ctx.on('demo/transform', async (input, next) => {
    const downstream = await next()
    return downstream.toUpperCase()
  })

  // Listener 2: short-circuit when it owns the decision.
  ctx.on('demo/transform', async (input, next) => {
    if (input.includes('blocked')) return '** blocked **'
    return next()
  })

  void (async () => {
    console.log(await ctx.waterfall('demo/transform', 'hello', async () => 'hello'))
    console.log(await ctx.waterfall('demo/transform', 'blocked words', async () => 'blocked words'))
  })()
}
```

وجّه `cordis.yml` إلى هذا الملف وحده وشغّل:

```
HELLO
** BLOCKED **
```

وتتبّع السطرَ الثاني: يعمل المستمعُ الأول فيستدعي `next()`، فيستدعي المستمعَ الثاني؛ فيرى الثاني `blocked` ويعود بلا استدعاء `next()`، فلا يعمل الافتراضُ الأعمق (الدالةُ الممرَّرة إلى `ctx.waterfall`) قط، ويرفع المستمعُ الأول حالةَ أحرف الرسالة البديلة في طريق العودة.

والانضباطُ الذي يتبع ذلك: **على مستمع waterfall الذي يراقب أو يعلّق فقط أن يستدعي `next()`**؛ والعودةُ بدونه قطعٌ مقصود. ونسيانُ `next()` في مستمع تسجيل يبتلع السلوكَ الافتراضي في صمت لكل من بعده. وهي قاعدةٌ قائمة في هذا المستودع ([دلالة waterfall](../cordis-primer.ar.md#cordis-waterfall-semantics)).

ويستعمل الإطارُ waterfalls في القرارات التي قد تلفّها الإضافاتُ المتعاونة أو تجيب عنها: فـ[`agent/request`](../subsystems/core.ar.md#agentrequest--waterfall) يتيح لإضافة استبدالَ إعداد استدعاء النموذج، و[`approval/request`](../subsystems/approval.ar.md#approvalrequest--waterfall) يتيح لسياسة أن تجيب بدل المستخدم.

التالي: [الإعداد](05-config.ar.md)، أي خيارات الإضافات من `cordis.yml`.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

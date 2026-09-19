# 4. حدث

[English](04-events.md) | العربية

خدمة دعم حمل مباشر استدعاء؛**حدث**يجعل إضافة بلا حاجة معرفة طريق لديه أي بعض إضافة صحيح في استماع، حينئذ قدرة إرسال خروج إشعار.harness استخدام حدث معالجة أداة نتيجة، نموذج طلب و مراجعة دفعة قرار انتظار تفاعل.

## إعلان، إرسال خروج و استماع

إنشاء `stats.ts`، سوف هو وضع في `tmp/cordis-tutorial` في. هو هو واحد بند مسؤول حساب عدد و في كل مرة تغير وقت إرسال خروج إشعار خدمة:

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

`interface Events` دمج و رقم 3 فصل `interface Context` دمج في حدث نظام في متبادل متبادل مقابل: هو إعلان حدث اسم و ذلك مستمع توقيع، لذلك `ctx.emit` و `ctx.on` كل أداة لديه كامل نوع.`namespace/action` تسمية اتفاق يجعل مسطح مستو حدث نطاق الأسماء إبقاء سهل قراءة.

إنشاء `reporter.ts`:

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

`import type {} from './stats.ts'` سطر لن في وقت التشغيل استيراد أي محتوى؛ هو أثر هو يجعل TypeScript يرى إعلان دمج. تركيب و تشغيل:

```yaml
- name: './stats.ts'
- name: './reporter.ts'
```

```
[stats] tool_call -> 1
[stats] tool_call -> 2
[stats] prompt -> 1
```

لأن `ctx.on()` يخص effect، مستمع سوف مع إضافة واحد نفس إزالة فقد، أبدا حاجة يد حركة صيانة `removeListener`.

## توزيع نمط

`emit` هو 5 نوع توزيع نمط لـ واحد. حدث اعتماد أي نوع نمط هو ذلك اتفاق واحد جزء، قرار مستمع قدرة لا قيمة راجعة، قدرة لا تزامن تشغيل، و قدرة لا ذاك هذا قصير مسار:

| نمط | استدعاء | دلالة |
|---|---|---|
| emit | `ctx.emit(name, ...args)` | تزامن واسع بث؛ لن انتظار أو استلام تجميع إرجاع promise و قيمة. |
| parallel | `await ctx.parallel(name, ...args)` | كل مستمع تزامن تشغيل، و واحد نفس انتظار. |
| serial | `await ctx.serial(name, ...args)` | مستمع حسب ترتيب تشغيل و انتظار؛ رقم واحد غير `null`/`false`/`undefined` قيمة راجعة فوز خروج، و إيقاف لاحق مستمع. |
| bail | `ctx.bail(name, ...args)` | serial تزامن إصدار. |
| waterfall(شلال نشر صيغة حدث) | `ctx.waterfall(name, ...args, next)` | حلقة التفاف في بين عنصر، رؤية تحت نص. |

كل harness حدث كل سوف في ذلك الذي تابع[فرعي نظام صفحة](../subsystems/core.ar.md) تلقائي توليد مشاركة اعتبار وثيقة في سجل ذلك نمط.

## waterfall: تحويل أو قصير مسار

waterfall هو تنفيذ اعتراض قطع نمط. كل مستمع كل سوف استلام إلى معامل و واحد `next()` continuation؛ هو يمكن تحويل `next()` قيمة راجعة، أيضا يمكن لا استدعاء `next()` حينئذ مباشر إرجاع، من بينما قصير مسار سلسلة بند ذلك بقية جزء.Cordis وثيقة يأخذ بعد واحد نوع سلوك تسمية لـ مرفوض. إنشاء `waterfall-demo.ts`:

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

يجعل `cordis.yml` فقط إشارة نحو هذا ملف و تشغيل:

```
HELLO
** BLOCKED **
```

حسب ترتيب نظر ثاني سطر مثل أي إنتاج: مستمع 1 أولا تشغيل و استدعاء `next()`، من بينما استدعاء مستمع 2؛ مستمع 2 يرى `blocked` بعد مباشر إرجاع بينما لا استدعاء `next()`، لذلك الأكثر داخل طبقة افتراضي منطق (نقل إعطاء `ctx.waterfall` دالة) من لم تشغيل؛ إرجاع طريق في، مستمع 1 مجددا يأخذ استبدال رسالة تحويل لـ كبير كتابة.

من هذا نيل إلى واحد بند سجل قاعدة:**فقط مسؤول مراقبة أو علامة ملاحظة waterfall مستمع يجب استدعاء `next()`**؛ لا استدعاء حينئذ مباشر إرجاع بديل جدول متعمد قصير مسار. إذا سجل مستمع نسيان تسجيل استدعاء `next()`، سوف صامت بلا صوت خبر أرض ابتلاع إسقاط كل تحت تنقل افتراضي سلوك. هذا هو هذا مستودع معتاد ضبط قاعدة ([waterfall دلالة](../cordis-primer.ar.md#cordis-waterfall-semantics)).

harness استخدام waterfall معالجة تنسيق عمل إضافة يمكن حزمة تركيب أو عودة جواب قرار:[`agent/request`](../subsystems/core.ar.md#agentrequest--waterfall) سماح إضافة استبدال نموذج استدعاء إعداد،[`approval/request`](../subsystems/approval.ar.md#approvalrequest--waterfall) سماح سياسة بديل بديل مستخدم عمل جواب.

تحت واحد فصل:[إعداد](05-config.ar.md): قدوم ذاتي `cordis.yml` إضافة خيار.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

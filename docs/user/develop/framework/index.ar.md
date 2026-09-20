# الإضافات ودورة الحياة

[English](index.md) | العربية

تصف هذه الصفحة نموذجَ إضافات Cordis وآلةَ حالات دورة حياتها.

## آلة حالات الـ Fiber

كل إضافة محمَّلة تملك نطاقَ **Fiber** بالحالات التالية:

```
PENDING → LOADING → ACTIVE
                 ↘ FAILED
ACTIVE → UNLOADING → DISPOSED
```

| الحالة | المعنى |
|------|------|
| PENDING | مُعلَنة، لكن اعتمادياتها المطلوبة ليست جاهزة |
| LOADING | الاعتماديات جاهزة و`apply` يعمل |
| ACTIVE | الإضافة تعمل |
| FAILED | رمى `apply` خطأً |
| UNLOADING | الإضافة تُفرَّغ وتحرّر مواردها |
| DISPOSED | الإضافة مفرَّغة تمامًا |

## التحميل بقيادة الاعتماديات

الإضافةُ التي لها `inject` تنتظر كلَّ خدمة مطلوبة قبل التحميل:

```ts ignore-check
export const inject = ['tools', 'llm']

export function apply(ctx: Context) {
  // ctx.tools and ctx.llm are ready here.
}
```

وإن اختفت خدمةٌ مطلوبة، مثلًا أثناء استبدال مزوّد، فُرِّغت الإضافةُ تلقائيًا (من ACTIVE إلى DISPOSED) وحُمِّلت من جديد حين تعود الخدمة.

## التنظيف التلقائي

كل تسجيل جرى عبر `ctx` يُنقَض حين تُفرَّغ الإضافة:

```ts ignore-check
export function apply(ctx: Context) {
  // Event listener: removed automatically on unload.
  ctx.on('some-event', handler)

  // Custom resource: the returned disposer runs on unload.
  ctx.effect(() => {
    const connection = createConnection()
    return () => connection.close()
  })
}
```

ويتتبع الإطارُ كلَّ هذه العمليات ويحرّرها:
- `ctx.on(event, handler)`: مستمع حدث
- `ctx.tools.register(tool)`: تسجيل أداة
- `ctx.llm.registerAdapter(names, adapter)`: تسجيل مهايئ LLM
- `ctx.effect(() => cleanup)`: مورد مخصص

وأثناء التفريغ يبدأ استدعاءُ المحرِّرات بعكس ترتيب التسجيل، غير أن المحرِّرات اللاتزامنية المتعددة تعمل على التوازي ولا ضمانَ لإتمامها بالتتابع. فضع التنظيفَ المتوقف على الترتيب في محرِّر واحد يعيده `ctx.effect()` واحد، وانتظر خطواتِه بالتتابع هناك.

## السياقات المتداخلة

يُنشئ `ctx.plugin()` fiber ابنًا يرث السياقَ الأب لكن له دورةُ حياة مستقلة:

```ts ignore-check
export function apply(ctx: Context) {
  // Register a child plugin.
  ctx.plugin(childPlugin)

  // The child has its own Fiber and unloads with its parent.
}
```

## دلالة dispose

لإيقاف نسخة إضافة مبكرًا:

```ts
import type { Context } from '@deepseek-ai/cordis'

declare const ctx: Context
declare function myPlugin(ctx: Context): void

const fiber = ctx.plugin(myPlugin)

// Dispose it manually later.
await fiber.dispose()
```

ويضمن `dispose`:
1. إزالةَ كل التسجيلات التي تملكها الإضافة.
2. تفريغَ الإضافات الأبناء تكراريًا.
3. تحلُّلَ الوعد المعاد بعد انتهاء كل تنظيف لاتزامني.

## الاستبدال الحارّ (HMR)

مع تحميل `@deepseek-ai/dsh-hmr` من `cordis.yml`، يُطلق تعديلُ ملف مصدر إضافة ما يلي:

1. تفريغَ الإضافة القديمة وتنظيفَ تسجيلاتها.
2. تحميلَ الشفرة الجديدة.
3. تشغيلَ `apply` الجديد.

ولأن تسجيلات الإضافة تنظّف نفسها، لا يحتفظ الاستبدالُ الحارّ بتسجيلات النسخة القديمة.

## مثال على دورة الحياة

```ts ignore-check
export function apply(ctx: Context) {
  console.log('plugin loading')

  ctx.effect(() => {
    console.log('effect registered')
    return () => console.log('effect cleaned up')
  })
}
```

فيطبع التحميلُ:
```
plugin loading
effect registered
```

ويطبع التفريغُ:
```
effect cleaned up
```

## الخطوات التالية

- [الخدمات والاعتماديات](./service.ar.md): اكشف قدرةً لإضافات أخرى
- [نظام الأحداث](./events.ar.md): تواصل بين الإضافات
- [درس Cordis](../../../cordis-tutorial/index.ar.md): دورةُ الحياة والخدماتُ والأحداثُ نفسها مبنيةً خطوةً خطوة على وقت تشغيل Cordis

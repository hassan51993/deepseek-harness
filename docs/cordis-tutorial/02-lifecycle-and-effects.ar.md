# 2. دورة الحياة والآثار

[English](02-lifecycle-and-effects.md) | العربية

تُفرَّغ إضافةُ Cordis بتعديل إعداد، أو إعادة تحميل حارّة، أو تحرير صريح، أو فقد خدمة مطلوبة. والتسجيلاتُ التي تجري عبر واجهات Cordis آثارٌ تُنقَض حين تُفرَّغ الإضافةُ التي تملكها؛ أما الموارد المُدارة خارج تلك الواجهات فيجب لفُّها في `ctx.effect()`.

## الآثار

في مورد لا يديره Cordis أصلًا، مثل مؤقّت أو اتصال أو مراقب، لُفَّه في `ctx.effect()` وأعِد محرِّرًا:

أنشئ `lifecycle.ts` في `tmp/cordis-tutorial`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'lifecycle-demo'

function heartbeat(ctx: Context) {
  console.log('heartbeat plugin loading')
  ctx.effect(() => {
    const timer = setInterval(() => console.log('tick'), 200)
    return () => {
      clearInterval(timer)
      console.log('heartbeat cleaned up')
    }
  })
}

export function apply(ctx: Context) {
  // Mount a child plugin and keep its fiber to dispose it later.
  const fiber = ctx.plugin(heartbeat)
  // The demo timer is itself an effect: if THIS plugin is unloaded first,
  // the pending callback is cancelled instead of firing on a dead app.
  ctx.effect(() => {
    const timer = setTimeout(async () => {
      await fiber.dispose()
      console.log('disposed')
      process.exit(0)
    }, 700)
    return () => clearTimeout(timer)
  })
}
```

وجّه `cordis.yml` إليه:

```yaml
- name: './lifecycle.ts'
```

شغّل (`node --import tsx ../../vendor/cordis/bin.js`) فتحصل على:

```
heartbeat plugin loading
tick
tick
tick
heartbeat cleaned up
disposed
```

وثلاثةُ أمور تستحق الانتباه:

- `ctx.plugin(heartbeat)` يركّب دالةً **من الشفرة** إضافةً، وهي العمليةُ نفسها التي يجريها محمِّلُ YAML لكل مدخل إعداد. وإضافةُ الدالة لا تحتاج طريقةَ `apply`: فـ Cordis يستدعي الدالةَ مباشرةً ولا يستعمل اسمَها إلا في التشخيصات. ولا تلزم طريقةُ `apply` إلا في صيغة الكائن، `ctx.plugin({ apply(ctx) { /* ... */ } })`. ويعيد الاستدعاءُ **fiber**، وهو مقبضُ وقت التشغيل لنسخة إضافة محمَّلة واحدة.
- ويعمل متنُ الأثر أثناء التحميل؛ ويعمل المحرِّرُ الذي يعيده أثناء التفريغ. ولا تستدعي المحرِّرَ بنفسك قط في مورد عمرُه عمرُ الإضافة.
- و`fiber.dispose()` يتحلّل بعد انتهاء كل تنظيف الإضافة، بما فيه المحرِّرات اللاتزامنية، ويفرّغ تكراريًا كلَّ إضافة ابن ركّبها.

## آلة حالات الـ fiber

كل نسخة إضافة محمَّلة تملك fiber يمر بهذه الحالات:

```
PENDING → LOADING → ACTIVE → UNLOADING → DISPOSED
                 ↘ FAILED
```

- **PENDING**: مُعلَنة، لكن خدمةً مطلوبة (الفصل الثالث) ليست متاحة بعد.
- **LOADING وACTIVE**: `apply` يعمل، أو انتهى.
- **FAILED**: رمى `apply` أو التحقق من الإعداد.
- **UNLOADING وDISPOSED**: المحرِّرات تعمل، أو فُكّ كل شيء.

وستلقى PENDING ثانيةً في [الفصل السادس](06-composition-and-hmr.ar.md)، حيث هي الجوابُ المعتاد عن سؤال «لماذا لا تطبع إضافتي شيئًا؟».

## ما هو أثرٌ أصلًا

نادرًا ما تكتب `ctx.effect()` بنفسك، لأن واجهات التسجيل المدمجة آثارٌ أصلًا:

- `ctx.on(event, listener)`: يُزال المستمع عند التفريغ ([الفصل الرابع](04-events.ar.md)).
- `ctx.plugin(child)`: يُحرَّر الابنُ مع أبيه.
- وتسجيلاتُ الخدمات آثار. وسجلاتُ الإطار مثل `ctx.tools.register(...)` تلحق أيضًا محرِّراتِها المعادة بالإضافة المستدعية، فتنفكّ تلقائيًا ([الفصل السابع](07-into-the-harness.ar.md)).

وفي مورد لا يديره Cordis، احصل عليه داخل `ctx.effect()` وأعِد محرِّرًا يطلقه. فيستدعي Cordis ذلك الإطلاقَ أثناء التفريغ، بما فيه إعادةُ التحميل الحارّة.

وتحفّظٌ واحد في الترتيب: تبدأ المحرِّراتُ بعكس ترتيب التسجيل، لكن المحرِّرات **اللاتزامنية** المتعددة تعمل على التوازي. فإن وجب أن تجري خطواتُ التفكيك بالتتابع، فأبقِها في محرِّر واحد وانتظرها هناك.

التالي: [الخدمات](03-services.ar.md)، أي كيف تتشارك الإضافاتُ القدرات.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

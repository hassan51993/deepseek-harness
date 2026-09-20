# تحليل ما بعد الحادث 0001: خادم ACP ينهار عند الاتصال، إذ أسقط `export default` قيمة `inject` الخاصة بالإضافة

[English](0001-acp-default-export-drops-inject.md) | العربية

Status: resolved (fix in PR #41 `feat/acp-2-bridge`)

## الملخص التنفيذي

كسر خطآ تكامل ACP رغم تغطية وحدة كاملة: فتصديرٌ افتراضي جعل Loader يُسقط `inject`، وبحثٌ متتبَّع عن خدمة اختيارية سقط عبر حدّ ظل. وتجاوزت الاختباراتُ المركَّبة يدويًا المسارين معًا. وأضافت الإصلاحاتُ تغطيةَ Loader حقيقية بلا مفاتيح وقواعدَ للحزم في تصدير الإضافات والوصول إلى الخدمات الاختيارية.

## الملخص

انهار خادمُ ACP (`dsh --profile acp`، أي `@deepseek-ai/dsh-acp`) لحظةَ اتصال محرّر حقيقي (Zed): فأعاد أولُ طلب `session/new` الخطأَ `Internal error: cannot get property "agents" without inject`، وأعاد `session/load` مثلَه لـ `sessionPersistence`. وكان الجسر معطلًا تمامًا في الإنتاج رغم 178 اختبار وحدة خضراء وتغطية سطور 100%. واختبأ خطآن مستقلان خلف سلسلة الخطأ نفسها، وأخطأهما جناحُ الاختبارات للسبب نفسه: فكل اختبار ركّب الإضافة عبر مسار لا يمرّن كيف تُحمَّل فعلًا ولا كيف تتحلّل خدماتها فعلًا.

## الأثر

لم يستطع خادم ACP إنشاءَ جلسة واحدة ولا تحميلَها، وهما أولُ استدعاءَي RPC يجريهما المحرّر. فمن وصّل الوكيلَ بـ Zed لقي عطلًا قاطعًا فوريًا. ولا فقدَ بيانات (إذ لم يُحفظ شيء قبل الانهيار)؛ وكانت الكلفةُ كلُّها «الميزة لا تعمل» مع وقت التنقيح لمعرفة السبب، مرتين.

## الخط الزمني

- نزل الجسر (RFC 010) بجناح وحدة كامل للـ codec والنقل في الذاكرة ورسائل البروتوكول المولَّدة ومسارات الأعطال وHMR؛ مع e2e حقيقي مقيَّد بمفتاح، وe2e بلا مفتاح لنقاء الخرج القياسي. وكانت كلها خضراء بتغطية 100%.
- وسقطت جلسةُ Zed حقيقية فورًا على `session/new` بالخطأ `cannot get property "agents" without inject`.
- وتتبّع التحقيقُ أولًا نظريةَ «المتتبَّع والظل» في Cordis (وهي معقولة، والآلية حقيقية؛ انظر الخطأ الثاني)، ثم رصد مشيَ الـ fiber الفعلي في `reflect.ts` المستنسخ وشغّل العمليةَ الفرعية الحقيقية. وأظهر الأثرُ الرميَ عند السطر 179 في `apply()` **وقتَ تحميل الإضافة**، على الـ fiber الجذر بلا ظل، فأسقط نظريةَ الظل في `session/new`.
- وعُثر على السبب الجذري الأول: سطرُ `export default apply` شارد. وحذفُه أصلح `session/new`.
- وكشف حذفُه عن الخطأ الثاني: إذ ظل `session/load` يرمي على `sessionPersistence`، وهي آلية مختلفة فعلًا (مشيُ الظل)، تأكّدت بعزل الإصلاح وإعادة تشغيل العملية الفرعية الحقيقية.

## السبب الجذري الأول: `export default apply` يُسقط `inject` الخاصة بالإضافة (كسر `session/new`)

الملفُّ `packages/acp/acp/src/index.ts` *إضافةُ فضاء أسماء*: فهو يصدّر `name` و`inject` و`Config` و`apply` تصديراتٍ مسمّاة منفصلة، مثل كل إضافة أخرى في المستودع (`invariants` و`llm-deepseek` و`tool-bash` و`tui` وغيرها). لكنه انتهى أيضًا بسطر زائد لا تحمله أي إضافة أخرى:

```ts ignore-check
export const name = 'acp'
export const inject = ['agents', 'sessions', 'sessionPersistence']
export function apply(ctx: Context, config: AcpConfig): void { /* … */ }
// …
export default apply   // ← the bug
```

وحين تُحمَّل إضافةٌ من `cordis.yml`، يوحّد Loader في cordis الوحدةَ المستورَدة عبر `Loader.unwrapExports` في `vendor/loader/src/index.ts`:

```ts ignore-check
unwrapExports(exports: any) {
  if (isNullable(exports)) return exports
  exports = exports.default ?? exports        // ← prefers `.default`
  if (!exports.__esModule) return exports
  return exports.default ?? exports
}
```

وبوجود تصدير افتراضي، يتحلّل `exports.default ?? exports` إلى **دالة `apply` مجرَّدة**. والدالةُ المجرَّدة لا `inject` لها ولا `name` ولا `Config`، فتلك عاشت تصديراتٍ مسمّاة *شقيقة* على فضاء أسماء الوحدة، وفكُّ الغلاف إلى `.default` رمى فضاءَ الأسماء. فبنى Loader عندئذ fiber الإضافة من `inject` فارغة.

فعمل `apply` في fiber **بلا خدمات محقونة**. وأولُ سطر، وهو `const agents = ctx.agents`، مشى شجرةَ الـ fibers (الجذرُ ثم Include ثم Loader ثم الجذر)، فلم يجد `agents` في مخزن أي fiber، وبلغ الـ fiber الجذر (`runtime === null`)، فرمى `cannot get property "agents" without inject`. فكان الانهيارُ **وقتَ التحميل** لا في معالج طلب لاحق؛ وإنما صادف أن الطلب هو ما أطلق التحميلَ في الأثر الساقط.

**الإصلاح:** احذف `export default apply`. فيستعمل Loader عندئذ فضاءَ أسماء الوحدة، ويحترم `inject` و`name` و`Config`، ويعمل `apply` داخل fiber يمنح الخدماتِ المعلَنة فعلًا.

## السبب الجذري الثاني: قراءةُ خدمة اختيارية تُسقِط حارسَ inject عبر ظل متتبَّع (كسر `session/load`)

بعد إصلاح الأول عمل `session/new`، لكن `session/load` ظل يرمي `cannot get property "sessionPersistence" without inject`. وهذا **هو** آليةُ المتتبَّع والظل في Cordis، ويستحق فهمًا دقيقًا.

يستدعي `session/load` الدالةَ `agents.resume(...)`، وهي تفوّض إلى `AgentLoop.resume()` التي كانت تقرأ `this.ctx.sessionPersistence`. ولا تضم `static inject` في `AgentLoop` القيمةَ `sessionPersistence` عن قصد، فحقنُها كان سيجعل العروضَ غير الحافظة تعلّق أبدًا في انتظار خلفية لا تُحمَّل قط. والخدمةُ توفّرها إضافةٌ أو fiber شقيق منفصل وتُقرأ انتهازيًا.

والوصولُ إلى الخدمات في Cordis يمر بوسيط سياق (`vendor/cordis/src/reflect.ts`). وحين تُستدعى طريقةُ خدمة عبر *وسيط متتبَّع* مأخوذ من fiber غريب (هنا: fiber الجسر يستدعي `ctx.agents.resume`، فيعيد الـ registry القيمةَ `this.factory`، أي `AgentLoop`، ملفوفةً من جديد وسيطًا متتبَّعًا مربوطًا بالمستدعي)، يعيد `createShadowMethod` في `vendor/cordis/src/utils.ts` ربطَ `this` بكائن *ظل* يحمل سياقُه `[symbols.shadow]` مشيرًا إلى سياق بناء `AgentLoop` نفسه. فداخل `resume` يتحلّل `this.ctx.sessionPersistence` وقد بدأ معالجُ الوسيط مشيَ الـ fibers من fiber الظل:

```ts ignore-check
// reflect.ts get handler
let fiber = (ctx[symbols.shadow] as Context ?? ctx).fiber   // ← starts at AgentLoop's fiber
while (true) {
  const impl = fiber.store?.[prop]
  if (impl) return getTraceable(ctx, impl.value)
  if (prop in fiber.inject) { /* inactive-context error */ }
  if (!fiber.runtime) throw error                            // ← reached root, throw
  if (fiber.parent[symbols.isolate][prop] !== key) throw error
  fiber = fiber.parent.fiber                                 // ← ancestor-only
}
```

والمشيُ **صاعدٌ إلى الأسلاف وحدهم**. و`sessionPersistence` ليست في مخزن fiber الخاص بـ `AgentLoop` (فهي خارج `static inject` عنده) ولا في أي سلف على الطريق إلى الجذر (فهي تسكن فرعًا *شقيقًا*)، فيبلغ المشيُ الـ fiber الجذر ويرمي.

ولماذا لم تلتقط اختباراتُ استئناف `AgentLoop` في الذاكرة هذا؟ لأنها تستدعي `ctx.agents.resume(...)` مباشرةً من شفرة الاختبار، أي *خارج أي fiber إضافة*. وهناك يكون `ctx.fiber.runtime` هو `null`، فيسلك معالجُ الوسيط طريقًا مختصرًا مبكرًا:

```ts ignore-check
if (!ctx.fiber.runtime) return ctx.reflect.get(prop, false)   // ← direct global-store lookup, no fiber walk
```

و`ctx.reflect.get(name, false)` بحثٌ مباشر في مخزن الخدمات العام المفهرس برمز العزل؛ فهو يتجاهل طوبولوجيا الـ fibers كلها ويجد الخدمة. فتنجح القراءةُ من اختبار في المستوى الأعلى، وترمي من داخل fiber إضافة حقيقي بلغه ظل. والجسرُ هو الحالة الثانية بالضبط.

**الإصلاح:** اقرأ الخدمةَ الاختيارية بـ `ctx.get('sessionPersistence')`، فهو يستعمل المخزن العام المفهرس بالعزل مع حفظ فحوص حالة النشاط. وتبقى قراءةُ الخاصية مباشرةً مناسبةً للخدمات في مجموعة الحقن المعلَنة للإضافة.

## لماذا أخطأها كل اختبار (العطل الحقيقي)

يتشارك الخطآن ثغرةَ عملية واحدة: **لم يمرّن أي اختبار الإضافةَ عبر مسار تحميلها الحقيقي ولا عبر طوبولوجيا استدعائها الحقيقية.**

- فتجهيزُ الذاكرة يركّب الجسر ببناء كائن إضافة يدويًا: `ctx.plugin({ name, inject, apply })`. وهذا يوفّر `inject` يدويًا، فلا يستطيع أبدًا إعادةَ إنتاج الخطأ الأول، لأن `unwrapExports` لا يستدعيها إلا *Loader* ولا يستدعيها `ctx.plugin` قط. وحتى `ctx.plugin(NamespaceImport)` ما كان ليلتقطه.
- والتجهيزُ نفسه يركّب كل شيء مسطّحًا على سياق جذر واحد، فاستئنافُ `AgentLoop` المبلوغ منه إما يعمل في المستوى الأعلى (طريقُ `!runtime` المختصر) وإما عبر ظل يتحلّل أصلُه على الجذر، فيُخفى بذلك عطلُ المشي الصاعد في الخطأ الثاني.
- وe2e الوحيد بلا مفتاح أرسل `initialize` وفحص نقاءَ الخرج القياسي. و`initialize` لا يبلغ المصنع قط، فأبحر متجاوزًا الخطأين.
- والاختبارُ الوحيد الذي قاد `session/new` و`session/load` كان مقيَّدًا بمفتاح، فتخطّته CI (بلا مفتاح)؛ ومحليًا «نجح» لأن `lib/` مبنيةً بائتة (بالشفرة القديمة) صادف أنها أرضت تحليلَ الوحدات.

وظلت تغطيةُ السطور 100% طوال الوقت. فالتغطيةُ تثبت أن السطور *نُفِّذت*؛ ولا تقول شيئًا عن عمل الميزة *كما تُشحن*.

## الحواجز المضافة

- **حذف `export default apply`** في `packages/acp/acp/src/index.ts`، وهو إصلاح الخطأ الأول.
- **`AgentLoop.resume` يقرأ `this.ctx.get('sessionPersistence')`** في `packages/core/agent-loop/src/index.ts`، وهو إصلاح الخطأ الثاني، مع تعليق يشرح مصيدةَ مشي الظل.
- **e2e بلا مفتاح لـ `session/new` عبر stdio حقيقي** في `apps/cli/tests/profiles/acp/tests/acp.e2e.ts`: يُقلع الـ profile عمليةً فرعية عبر Loader الحقيقي ويتحقق من أن `session/new` يتحلّل. وهو يسقط سقوطًا مسموعًا على الخطأ الأول بلا مفتاح واجهة. وقد تُحقِّق من سقوطه بإعادة `export default apply`.
- **`TSX_TSCONFIG_PATH` في إقلاع e2e**: فالعملية الفرعية تعمل من دليل عمل مؤقت، حيث لا يجد tsx خريطةَ `paths` في tsconfig بجذر المستودع بالبحث صعودًا، فترتدّ استيراداتُ dsh-* في صمت إلى `lib/` المبنية. وتوجيهُ tsx إلى tsconfig المستودع يجعل التحليلَ مستقلًّا عن دليل العمل ويضمن أن الاختبار يشغّل *المصدر* لا بناءً قد يكون بائتًا.
- **قاعدة في [docs/testing.md](../testing.ar.md)**: «اختبر مسار الدخول الحقيقي»، وأن تغطية السطور ليست تغطيةَ سلوك؛ وهي تقنّن الدرسَ لكل إضافة مستقبلية.

## الدروس

- إضافةُ فضاء الأسماء والتصديرُ الافتراضي لا يجتمعان تحت Loader في cordis. فاختر صيغةَ فضاء الأسماء (`name` و`inject` و`Config` و`apply`) ولا تضف `export default`، فـ `unwrapExports` سيُسقط فضاءَ الأسماء.
- وفي خدمة تقرأها الإضافةُ انتهازيًا ولا تعلنها في `static inject`، استعمل `ctx.get(name)` ولا تستعمل `ctx.<name>` أبدًا. فوسيطُ الخاصية يتحلّل بمشي fibers صاعد إلى الأسلاف وحدهم ويسقط عبر ظل غريب؛ و`ctx.get(name)` هو البحثُ المستقل عن الطوبولوجيا (وهو صارم افتراضيًا، فالخلفيةُ غير النشطة تُقرأ `undefined` بدل أن تُسلَّم في منتصف تفكيكها).
- والاختبارُ الذي يبني إضافةً يدويًا لا يستطيع التحقق من كيفية تحميلها. فلا بد من اختبار واحد على الأقل يقود مسارَ Loader والتصدير الحقيقي من طرف إلى طرف. وحين لا تستدعي العمليةُ الرئيسة النموذجَ، لا يحتاج ذلك الاختبار مفتاحَ واجهة، فموضعُه CI لا خلف قيد مفتاح.
- وثِق بالأثر لا بالنظرية. فشرحُ الظل الأنيق كان حقيقيًا لكنه كان الخطأ *الثاني*؛ أما *الأول* فزلّةُ تصدير في سطر واحد وجدها `console.error` في مشي الـ fibers في دقائق بعد ساعات من استدلال معقول لكنه خاطئ.

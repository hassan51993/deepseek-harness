# ثوابت وقت التشغيل

[English](invariants.md) | العربية

[dsh-invariants](../../packages/runtime-diagnostics/invariants) هي خدمةُ السجل القابلة للضبط (`ctx.invariants`) لفحوص ثوابت وقت التشغيل التي تملكها الحزم. وهي حزمةُ مجموعة دعم واحدة، لا seam قدرة من ثلاث حزم، وليست من عمود agent loop: فالسجلُّ يملك الانتقاءَ وحجزَ الأسماء ودورةَ حياة الليف الابن والفشلَ المنسوب إلى حزمة، بينما تنشر كلُّ حزمة في مساحة العمل إضافةً رفيقة `./invariant` تسجّل الفحوصَ باسم حزمة npm الكامل لها. أما ما يجوز للفحص أن يؤكده — مجارٍ أحداث مرجعية أو بيانات قابلة للتغيير، لا حضورَ خدمة ولا طريقة — فهو عرفُ ثوابت وقت التشغيل في [AGENTS.md](../../AGENTS.md#conventions).

المصدر: [`packages/runtime-diagnostics/invariants/src/index.ts`](../../packages/runtime-diagnostics/invariants/src/index.ts)

## الانتقاء

```ts type-equiv
/** Runtime invariant selection configured on the service plugin. */
interface Config {
  /** Global switch; defaults to `true`. */
  readonly enabled?: boolean
  /** Case-sensitive JavaScript regex sources that admit package names; empty admits all. */
  readonly package_allowlist?: string[]
  /** Case-sensitive JavaScript regex sources that exclude package names after allowlist matching. */
  readonly package_blocklist?: string[]
}
```

تُنتقى الحزمةُ حين تكون الخدمةُ مفعَّلة، وتكون قائمةُ السماح فارغةً أو يطابق نمطٌ واحد منها على الأقل اسمَها الكامل على npm، ولا يطابقها نمطٌ في قائمة المنع — فمطابقةُ المنع تغلب مطابقةَ السماح. وتُترجَم المداخلُ بـ`new RegExp(source)`: والمطابقةُ غيرُ مرساة ما لم يقدّم المصدرُ `^` و`$`، ونحوُ `/pattern/flags` لا يُحلَّل. ويفشل التحققُ بصوت عالٍ عند إقلاع الخدمة: فالمدخلُ الفارغ أو المحاط بمسافات أو المكرر أو غيرُ الصالح يرمي بدل أن يُتخطى. وقد لا يطابق نمطٌ صالح أيَّ حزمة محمَّلة الآن، فيبقى التحميلُ اللاحق وHMR حتميَّين؛ والمرشّحاتُ ثابتةٌ طوال عمر الخدمة ([README](../../packages/runtime-diagnostics/invariants/README.ar.md)).

## المثبِّت

```ts type-equiv
/**
 * Throw a package-attributed invariant failure.
 * @param message - violated package contract without the standard prefix.
 * @returns never because reporting a violation throws.
 */
type InvariantFailure = (message: string) => never
```

```ts type-equiv
/** Install one package's checks into the registration's child context. */
interface InvariantInstaller {
  /**
   * Install the package contribution.
   * @param ctx - child context owned by this invariant registration.
   * @param fail - reporter bound to the registering package name.
   * @returns nothing, or a promise settling after asynchronous checks finish.
   */
  (ctx: Context, fail: InvariantFailure): void | Promise<void>
  /** Services the child installer fiber may access. */
  readonly inject?: Inject
}
```

ويعمل المثبِّتُ المفعَّل في ليف Cordis ابن مخصص؛ ويعلن `installer.inject` الخدماتِ التي يجوز لذلك الليف الوصولُ إليها، ويُضَمّ اكتمالُ المثبِّت المتزامن أو اللاتزامني قبل أن ينجح التسجيل. ويرمي `fail(message)` خطأَ `InvariantError` — وهو `extends Error` برمز ثابت `code: 'INVARIANT'`، ومعه `packageName` المالك، ورسالةٌ تسبقها البادئة `invariant violated by "<package>": …` — فتكون المخالفةُ منسوبةً بلا أن يستورد السجلُّ أيَّ حزمة منتَج.

## الخدمة

يحجز `ctx.invariants.register(packageName, installer)` تسجيلًا نشطًا واحدًا لاسم حزمة npm الكامل، ويعيد مُفكِّكَه المحدود بالأثر. ويثبت الحجزُ ولو أبقت المرشّحاتُ المثبِّتَ خاملًا، فلا تستطيع إضافتان أن تدّعيا اسمَ الحزمة نفسه بصمت؛ والاسمُ المكرر أو الفارغ أو الحاوي مسافاتٍ يرمي. ويتخلص فشلُ المثبِّت من الليف الابن ويحرّر الحجزَ في عملية واحدة. وتملك الخدمةُ كلَّ ليف تسجيل بينما يخص المُفكِّكُ المعادُ الليفَ الرفيق أيضًا: فتفريغُ أي من الجانبين يزيل المستمعين وحالةَ التتبع والحجزَ، فيستطيع الرفيقُ إعادةَ التحميل وتسجيلَ الاسم نفسه ثانيةً بلا حالة محفوظة.

## عقد الرفيق

تملك كلُّ حزمة في مساحة العمل رفيقًا `./invariant` ([عقد الحزمة](../../packages/AGENTS.md))؛ والنشرُ والتسجيلُ شاملان، أما التأكيداتُ فليست مصطنَعة عمدًا. فالرفيقُ لا يثبّت فحصًا إلا حين تملك حزمتُه حدثًا قابلًا للرصد أو علاقةَ بيانات قابلة للتغيير؛ وإلا صدّر مثبِّتًا فارغًا يبدأ تعليقُه الأول بـ`No runtime invariant:` ويشرح، بخصوصية الحزمة، لماذا لا شيء قابلًا للفحص. ويرفض `pnpm run verify-package-invariants` آليًّا الواسماتِ المولَّدة، والمثبِّتاتِ الفارغة بلا تفسير، والمثبِّتاتِ غيرَ الفارغة التي تُغفل المبلِّغَ أو تتجاهله، وأسماءَ التسجيل الخاطئة، والتصديرَ أو النشرَ أو التوابعَ أو ربطَ الحزمة الناقص ([ملاحظة الوكيل عن القاعدة الآلية](../../.agents/notes/implemented/architecture/2026-07-19-package-invariant-runtime-contracts.ar.md)). ويوجد دليلُ الرفاق القابلين للتنفيذ والتركيبُ القياسي في [README الحزمة](../../packages/runtime-diagnostics/invariants/README.ar.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxinvariants--invariantregistry"></a>

### `ctx.invariants` — `InvariantRegistry`

Package-owned invariant registry with global and regex-based selection.

```ts cordis-catalog
/**
 * Register one package's invariant installer. The package name is reserved
 * even when filtering disables its checks. Enabled installers run in a child
 * fiber; failure disposes that fiber and releases the reservation.
 * @param packageName - full npm package name that owns the contribution.
 * @param installer - listener or startup-check installer for the child context.
 * @returns an effect-scoped disposer for the registration.
 */
register(packageName: string, installer: InvariantInstaller): () => void
```

Source: [`packages/runtime-diagnostics/invariants/src/index.ts`](../../packages/runtime-diagnostics/invariants/src/index.ts)
<!-- END GENERATED cordis-surface -->

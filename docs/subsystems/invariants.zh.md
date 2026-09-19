# وقت التشغيل ثابت صيغة

[English](invariants.md) | العربية

[dsh-invariants](../../packages/runtime-diagnostics/invariants) هو موجه إلى حزمة ذاتي لديه وقت التشغيل ثابت صيغة فحص يمكن إعداد سجل التسجيل خدمة (`ctx.invariants`). هو هو واحد support مجموعة حزمة، لا هو ثلاثة حزمة قدرة seam، أيضا لا يخص agent loop(ذكي جسم حلقة) رئيسي جاف: سجل التسجيل يملك اختيار منطق، اسم إبقاء، فرعي fiber دورة الحياة و عودة بسبب إلى حزمة فشل، بينما كل مساحة العمل حزمة إصدار واحد `./invariant` إعداد طقم إضافة، بـ ذاتي ذات تأكيد قطع npm حزمة اسم تسجيل فحص. فحص يمكن تأكيد ماذا (مرجعي حدث تدفق أو متغير بيانات، أبدا هو خدمة أو طريقة هل وجود) هو [AGENTS.md](../../AGENTS.md#conventions) في وقت التشغيل ثابت صيغة اتفاق.

شفرة المصدر:[`packages/runtime-diagnostics/invariants/src/index.ts`](../../packages/runtime-diagnostics/invariants/src/index.ts)

## اختيار

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

واحد حزمة يتم اختيار في شرط هو: خدمة قد تفعيل، سماح قائمة لـ فارغ أو حتى قليل واحد نمط مطابقة ذلك كامل npm اسم، كما لا يوجد أي منع توقف قائمة نمط مطابقة؛ منع توقف قائمة مطابقة أولوية في سماح قائمة مطابقة. بند استخدام `new RegExp(source)` تحرير ترجمة: حذف غير نمط ذاتي حمل `^` و `$`، مطابقة لا مرساة تحديد؛`/pattern/flags` لغة قاعدة لا يتم تحليل. تحقق في خدمة بدء وقت واضح تقرير خطأ: فارغ أبيض، أول ذيل حمل فارغ أبيض، تكرار أو بلا فاعلية بند سوف رمي خروج استثناء، بينما لا هو يتم قفز مرور. صالح نمط يمكن لا مطابقة أي حالي قد تحميل حزمة، لذلك لاحق تحميل و HMR(حار وحدة استبدال) إبقاء تحديد صفة؛ مرور ترشيح جهاز في خدمة دورة الحياة داخل ثابت ثابت ([README](../../packages/runtime-diagnostics/invariants/README.zh.md)).

## تثبيت جهاز

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

يتم تفعيل تثبيت جهاز في مخصص تابع فرعي Cordis fiber في تشغيل؛`installer.inject` إعلان هذا fiber يمكن وصول خدمة، تسجيل نجاح قبل سوف أولا انتظار تثبيت جهاز تزامن أو مختلف خطوة أرض تنفيذ تمام انتهاء.`fail(message)` رمي خروج `InvariantError`(`extends Error`، حمل مستقر `code: 'INVARIANT'`، الذي تابع `packageName`، و بادئة لـ `invariant violated by "<package>": …` رسالة) ، لذلك مخالفة قاعدة يمكن عودة بسبب، بينما سجل التسجيل بلا حاجة استيراد أي منتج حزمة.

## خدمة

`ctx.invariants.register(packageName, installer)` لـ كامل npm حزمة اسم إبقاء وحيد واحد نشط وثب تسجيل، و إرجاع ذلك ربط إلى effect disposer. أي جعل مرور ترشيح جهاز جعل تثبيت جهاز إبقاء لا نشط وثب، إبقاء اعتماد لكن صار قيام، لذلك اثنان عدد إضافة أبدا ممكن ساكن صامت أرض إقرار قيادة نفس عدد حزمة اسم؛ تكرار، فارغ أبيض أو يحتوي فارغ أبيض محرف اسم سوف رمي خروج استثناء. تثبيت جهاز فشل سوف أصل فرعي أرض dispose(مورد تحرير) فرعي fiber و تحرير إبقاء. خدمة يملك كل تسجيل fiber، بينما إرجاع disposer معا يخص إعداد طقم إضافة fiber: إزالة مهمة واحد جانب كل سوف إزالة مستمع،trace حالة و إبقاء بند، لذلك إعداد طقم إضافة يمكن إعادة تحميل و مجددا مرة تسجيل نفس اسم، لا إبقاء ناقص بقية حالة.

## إعداد طقم إضافة اتفاق

كل مساحة العمل حزمة كل يملك واحد `./invariant` إعداد طقم إضافة ([حزمة اتفاق](../../packages/AGENTS.md)) ؛ إصدار و تسجيل هو نفاد كل صيغة، لكن لحظة معنى لا دمج صار تأكيد. فقط لديه عند حزمة يملك بعض عدد يمكن مراقبة حدث أو بعض نوع متغير بيانات علاقة وقت، إعداد طقم إضافة عندئذ تثبيت فحص؛ لا فإن هو توجيه خروج واحد فارغ تثبيت جهاز، ذلك بدء بداية ملاحظة تفسير بـ `No runtime invariant:` فتح رأس، إبرة مقابل هذا حزمة أداة جسم حل تفسير لـ ماذا لا يوجد يمكن فحص بند.`pnpm run verify-package-invariants` آلة آلة أرض رفض «توليد ملف» علامة، بلا حل تفسير فارغ تثبيت جهاز، متروك تسرب أو تجاهل اختصار تقرير إبلاغ جهاز غير فارغ تثبيت جهاز، خطأ تسجيل اسم، و لا كامل توجيه خروج، إصدار، اعتماد أو تحزيم وصل خط ([آلة آلة قاعدة Agent Note](../../.agents/notes/implemented/architecture/2026-07-19-package-invariant-runtime-contracts.zh.md)). يمكن تنفيذ إعداد طقم إضافة دليل و معيار تركيب طريقة رؤية[حزمة README](../../packages/runtime-diagnostics/invariants/README.zh.md).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

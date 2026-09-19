# spill تخزين

[English](spill.md) | العربية

spill تخزين[قدرة seam](../../.agents/notes/implemented/architecture/2026-07-08-tool-output-spill-files.ar.md) حمل دائم حفظ استدعاء جهة توفير نص، و إرجاع موجه إلى نموذج تحديد موضع رمز و فحص بحث إشارة جذب. ذلك Service Definition هو [dsh-spill](../../packages/spill/spill)(`ctx.spillStore`) ، محلي Service Provider هو [dsh-spill-local](../../packages/spill/spill-local). مستهلك يشمل[أداة نتيجة سياسة](../../packages/spill/spill-policy) و[جلسة مرجع](../../packages/context/session-reference/README.ar.md).spill هو اختياري قدرة، لا يخص[ذكي جسم حلقة رئيسي جاف](core.ar.md) ؛ معاينة و spill قرار من مستهلك مسؤول، تخزين فإن أصل مثال حفظ الذي توفير نص.

شفرة المصدر:[`packages/spill/spill/src/types.ts`](../../packages/spill/spill/src/types.ts)

## حفظ طلب

`saveText` هو وحيد خدمة عملية: أصل مثال حمل دائم حفظ `content`، و إرجاع لا نفاذ واضح تحديد موضع رمز، خلفية توفير فحص بحث تلميح و دقيق بايت عدد. طلب يحمل حفظ وقت تخزين نطاق الأسماء (`owner`) ، وصف صفة إنتاج من مصدر معلومة (`source`، قطعا غير وصول تحكم) و خلفية متاح عمل تسمية تلميح بينما غير مسار `suggestedName`. أداة مصدر معرف فعلي أداة استدعاء؛ جلسة مرجع مصدر معرف يتم التقاط مصدر جلسة، بينما ذلك ملكية هو استقبال سياق هدف جلسة.

```ts type-equiv
/** One request to persist text to a spill artifact. */
interface SaveTextSpill {
  owner: SpillOwner
  source: SpillSource
  /**
   * A caller-suggested base name (e.g. `web_fetch.txt`). The backend sanitizes
   * it to a single safe path segment before use — it is a hint, never a path.
   */
  suggestedName: string
  /** The full text to persist (UTF-8). */
  content: string
}
```

```ts type-equiv
/**
 * Save-time storage namespace for a spilled artifact. The session id lets a
 * backend group storage under the producing session, but the returned
 * {@link SpillLocator} is the model-facing handle. Forked sessions inherit
 * locators already present in the seeded log; those artifacts are not copied or
 * re-owned, and spills produced after the fork use the child session id.
 */
interface SpillOwner {
  sessionId: SessionId
}
```

إبقاء مدة تنظيف يمكن وصل نفس أخرى قديم جلسة ناتج واحد بدء جعل قديم تحديد موضع رمز بطلان؛spill seam لا تعريف تدريجي جلسة تنظيف سياسة.

```ts type-equiv
/**
 * Producer of a spilled artifact. Tool results carry their model-issued call id;
 * session references identify the captured source session instead. Descriptive
 * source description only, never access control.
 */
type SpillSource = {
  kind: 'tool'
  /** The tool whose result was spilled (e.g. `web_fetch`). */
  toolName: string
  /** The model-issued call id the result belongs to. */
  callId: ToolCallId
  /** A short human label for the artifact (e.g. `result`). */
  label: string
} | {
  kind: 'session-reference'
  /** Session whose projected conversation was captured. */
  sessionId: SessionId
  /** Host-provided label for the referenced session. */
  label: string
}
```

## نتيجة

```ts type-equiv
/** A saved spill artifact: its locator, byte length, and backend-specific retrieval guidance. */
interface SpillRef {
  locator: SpillLocator
  bytes: number
  retrievalHint: string
}
```

`SpillLocator` هو خلفية إرجاع[صنف لوحة تحويل](core.ar.md#branded-ids) موجه إلى نموذج جملة مقبض. محلي خلفية سوف هو تصيير لـ نظام الملفات مسار؛ بعيد مسار أو قاعدة بيانات خلفية يمكن تصيير URI، مفتاح أو أمر token. مستهلك سوف هو نظر لـ لا نفاذ واضح قيمة، و استخدام `retrievalHint` تصيير، بينما لا هو زائف تحديد `read` بداية نهاية هو صحيح تأكيد فحص بحث آلية.

```ts type-equiv
/**
 * Opaque model-facing handle for one spilled artifact. A local backend may use a
 * filesystem path; a remote or database backend may use a URI or key. Consumers
 * render it with {@link SpillRef.retrievalHint}, but do not parse it.
 */
type SpillLocator = Branded<'SpillLocator'>
```

## خدمة

`SpillStore`(`ctx.spillStore`، تعريف في [`packages/spill/spill/src/index.ts`](../../packages/spill/spill/src/index.ts)) هو فقط لديه واحد طريقة سحب كائن خدمة:`saveText(input) → Promise<SpillRef>`. هو حمل دائم حفظ كامل `content`، و في فعلي تخزين فشل (إذن،ENOSPC، خلفية غير ممكن استخدام) وقت رفض. هذا seam فقط مسؤول تخزين: لا مسؤول إبقاء سياسة، أداة نتيجة استبدال أو فحص بحث/بحث API.

محلي خلفية ([dsh-spill-local](../../packages/spill/spill-local)) كتابة `<root>/session-<hash>/<random>-<safeName>`: أصل دليل هو قد إعداد أو تأخير متأخر إنشاء خاص (0700) دليل، جلسة فرعي دليل اعتماد `sha256(sessionId)`، و عبر ترتيب هو كما فقط كل من يمكن وصول كتابة (`open(path, 'wx', 0o600)`) منع توقف مسبق أولا غرس دخول رمز رقم رابط إعادة تحديد نحو كتابة. ذلك `locator` هو محلي مسار،`retrievalHint` فإن إبلاغ معرفة نموذج في هذا مسار فوق استخدام `read` أو `grep`. سياسة مستهلك ([dsh-spill-policy](../../packages/spill/spill-policy)) سوف يأخذ تجاوز مرور `maxInlineBytes` صاف نص نهائي نتيجة استبدال لـ إبقاء مكتبة توليد أول ذيل معاينة و spill مرجع؛ هذا مرور مسار كل قوة بينما لـ: حفظ فشل وقت إبقاء أصلي داخل ربط نتيجة، بينما لن يأخذ نجاح استدعاء تغيير صار `isError`.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxspillstore--spillstore-abstract-seam"></a>

### `ctx.spillStore` — `SpillStore` (abstract seam)

Abstract spill storage service. Subclass, implement saveText, and load the subclass as a plugin — it registers as `ctx.spillStore` (one implementation per context; loading a second throws, cordis' standard duplicate-service behavior).

Semantics every implementation must honor:

- saveText persists the FULL `content` verbatim and returns an opaque locator, exact byte length, and model-facing retrieval guidance.
- Storage is scoped by the request's SaveTextSpill.owner session; the backend chooses a private (not world-readable) location and a collision-free name derived from — never equal to — the caller's `suggestedName`.
- `saveText` REJECTS on a real storage failure (permissions, ENOSPC, backend unavailable); the caller decides how to degrade (the spill policy treats a rejection as best-effort and keeps the inline result).

```ts cordis-catalog
/**
 * Persist `input.content` to a session-scoped spill artifact.
 * @param input - the owner, caller-supplied source fields, suggested name, and full text to save.
 * @returns the saved artifact's {@link SpillRef}; rejects on a storage failure.
 */
abstract saveText(input: SaveTextSpill): Promise<SpillRef>
```

Source: [`packages/spill/spill/src/index.ts`](../../packages/spill/spill/src/index.ts)
<!-- END GENERATED cordis-surface -->

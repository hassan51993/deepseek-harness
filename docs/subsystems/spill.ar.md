# تخزين الفائض

[English](spill.md) | العربية

يحفظ [seam قدرة](../../.agents/notes/implemented/architecture/2026-07-08-tool-output-spill-files.ar.md) تخزين الفائض النصَّ الذي يقدّمه المستدعي، ويعيد محدِّدًا يراه النموذج مع إرشاد الاسترجاع. وتعريفُ خدمته هو [dsh-spill](../../packages/spill/spill) (`ctx.spillStore`)، ومزوّدُ خدمته المحلي هو [dsh-spill-local](../../packages/spill/spill-local). ومن مستهلكيه [سياسة نتائج الأدوات](../../packages/spill/spill-policy) و[مراجع الجلسات](../../packages/context/session-reference/README.ar.md). والفائضُ اختياري وليس من [عمود agent loop](core.ar.md)؛ ويملك المستهلكون قراراتِ المعاينة والإفاضة، بينما يحفظ التخزينُ النصَّ المقدَّم حرفيًا.

المصدر: [`packages/spill/spill/src/types.ts`](../../packages/spill/spill/src/types.ts)

## طلب الحفظ

`saveText` هي عمليةُ الخدمة الوحيدة: تحفظ `content` حرفيًا، وتعيد محدِّدًا معتمًا، وتلميحَ استرجاع تقدّمه الخلفية، وعددَ البايتات بالضبط. ويحمل الطلبُ فضاءَ أسماء التخزين وقتَ الحفظ (`owner`)، وتفاصيلَ وصفية عن المنتِج (`source`، وليست ضبطَ وصول قط)، و`suggestedName` قد تستعمله الخلفيةُ تلميحَ تسمية لا مسارًا. ومصدرُ الأداة يحدد نداءَ الأداة الفعلي؛ أما مصدرُ مرجع الجلسة فيحدد الجلسةَ المصدر الملتقَطة، بينما مالكُه الجلسةُ الهدف التي تتلقى السياق.

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

وقد يُنهي تنظيفُ مدة الحفظ صلاحيةَ محدِّدات قديمة مع سائر آثار الجلسات القديمة؛ ولا يعرّف seam الفائض سياسةَ تنظيف لكل جلسة.

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

## النتيجة

```ts type-equiv
/** A saved spill artifact: its locator, byte length, and backend-specific retrieval guidance. */
interface SpillRef {
  locator: SpillLocator
  bytes: number
  retrievalHint: string
}
```

و`SpillLocator` مقبضٌ [موسوم](core.ar.md#branded-ids) يراه النموذج وتعيده الخلفية. وتعرضه الخلفيةُ المحلية مسارًا في نظام الملفات؛ وتستطيع خلفيةٌ بعيدة أو قاعديةُ بيانات أن تعرض URI أو مفتاحًا أو رمزَ أمر. ويعامله المستهلكون معتمًا ويعرضونه مع `retrievalHint` بدل افتراض أن `read` هي آليةُ الاسترجاع الصحيحة دائمًا.

```ts type-equiv
/**
 * Opaque model-facing handle for one spilled artifact. A local backend may use a
 * filesystem path; a remote or database backend may use a URI or key. Consumers
 * render it with {@link SpillRef.retrievalHint}, but do not parse it.
 */
type SpillLocator = Branded<'SpillLocator'>
```

## الخدمة

`SpillStore` (`ctx.spillStore`، المعرَّفة في [`packages/spill/spill/src/index.ts`](../../packages/spill/spill/src/index.ts)) خدمةٌ مجردة بطريقة واحدة: `saveText(input) → Promise<SpillRef>`. وهي تحفظ `content` كاملًا وترفض عند فشل تخزين حقيقي (الأذونات، أو ENOSPC، أو خلفية غير متاحة). ويملك الـ seam التخزينَ وحده: فلا سياسةَ حفظ، ولا استبدالَ نتائج أدوات، ولا واجهةَ استرجاع أو بحث.

وتكتب الخلفيةُ المحلية ([dsh-spill-local](../../packages/spill/spill-local)) تحت `<root>/session-<hash>/<random>-<safeName>` — جذرٌ خاص (0700) مضبوط أو منشأ كسولًا، ودليلٌ فرعي للجلسة باسم `sha256(sessionId)`، وكتابةٌ حصرية للمالك وحده (`open(path, 'wx', 0o600)`) فلا يستطيع رابطٌ رمزي مزروع تحويلَها. و`locator` لديها هو المسارُ المحلي، و`retrievalHint` يخبر النموذجَ أن يستعمل `read` أو `grep` على ذلك المسار. ويستبدل مستهلكُ السياسة ([dsh-spill-policy](../../packages/spill/spill-policy)) النتيجةَ النهائية النصية التي تتجاوز `maxInlineBytes` بمعاينة رأس وذيل من مكتبة الاحتفاظ مع مرجع الفائض، على قدر الاستطاعة: فإخفاقُ الحفظ يُبقي النتيجةَ المضمَّنة الأصلية بدل أن يحوّل نداءً ناجحًا إلى `isError`.

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

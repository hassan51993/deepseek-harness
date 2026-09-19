# نظام الملفات

[English](filesystem.md) | العربية

اختياري نظام الملفات قدرة من أربعة عدد جزء مجموعة صار:[dsh-fs](../../packages/fs/fs) يملك `ctx.fs` و حمل اختياري حراسة حماية أصل فرعي نص عملية؛[dsh-fs-local](../../packages/fs/fs-local) تنفيذ محلي مغناطيس قرص خلفية؛[dsh-fs-observation-policy](../../packages/fs/fs-observation-policy) سجل مراقبة قياس إلى وجود أو ناقص حالة، و عبر حدث (بينما غير خدمة) إضافة جديد طازج درجة قاعدة؛[dsh-tool-fs](../../packages/fs/tool-fs) مباشر تنفيذ موجه إلى نموذج read/write/edit استدعاء و تصيير نافذة. هو يقع في agent loop(ذكي جسم حلقة) رئيسي جاف خارج؛ استبدال خلفية لن تغيير سياسة أو أداة schema.

`dsh-fs-observation-policy` هو اختياري إضافة. لا يوجد هذا إضافة وقت،`FileSystem` خدمة تعريف، واحد مزود و `dsh-tool-fs` مستهلك مجموعة صار كامل كما لا تلقي قيد نظام الملفات seam:`write` بلا شرط إنشاء أو تغطية،`edit` بلا شرط استبدال حرف وجه نص. سياسة إضافة عبر قطع قرار `fs/*` waterfall(شلال نشر صيغة حدث) قدوم تغيير هذه عملية. إزالة هذا إضافة لن كسر تالف أداة، لأن أداة استدعاء `ctx.fs` و توزيع حدث، بينما لا استدعاء سياسة طريقة. تحميل `dsh-tool-fs` نشر أيضا ينبغي تحميل `dsh-fs-observation-policy`، جعل افتراضي سلوك لـ «أولا قراءة بعد كتابة/تحرير».

مزود شفرة المصدر:[`packages/fs/fs/src/types.ts`](../../packages/fs/fs/src/types.ts) و [`packages/fs/fs/src/index.ts`](../../packages/fs/fs/src/index.ts). سياسة شفرة المصدر:[`packages/fs/fs-observation-policy/src/types.ts`](../../packages/fs/fs-observation-policy/src/types.ts). قراءة تصيير شفرة المصدر:[`packages/fs/tool-fs/src/read-render.ts`](../../packages/fs/tool-fs/src/read-render.ts).

## هدف معرف و بيانات وصفية (مزود اتفاق)

كل عملية أول أولا سوف مستخدم توفير مسار تحليل لـ لا نفاذ واضح خلفية هدف. مستهلك يمكن عرض `displayPath`، لكن منع توقف تحليل `targetKey`(واحد صنف لوحة تحويل لا نفاذ واضح id) ، أيضا لا نيل زائف ضبط هو هو محلي قطعا مقابل مسار.

و نظام الملفات مشترك تنفيذ عالم حد مستهلك عبر مزود نيل أخذ عبر قدرة جلوس علامة، بينما لا هو حل تفسير هذا هوية:`processPath(target)` إرجاع عملية فرعية يمكن فتح مواصفة تحويل قطعا مقابل مسار؛`processPathFromHostPath(hostPath)` فقط في هذا تنفيذ عالم حد مشترك متبادل ينبغي مضيف ملف وقت خريطة ذلك قطعا مقابل مسار؛`fileUrl(target)` إرجاع اعتماد مزود منصة لغة قاعدة `file:` URI؛`contains(parent, child)` فحص مواصفة تحويل هوية متبادل انتظار أو بعد بديل يتضمن علاقة.

```ts type-equiv
/**
 * A path resolved by a backend into a stable identity. `resolve()` produces
 * this; every other operation takes it.
 */
interface FsTarget {
  /** Opaque key for stale guards and target lookup. */
  targetKey: FsTargetKey
  /**
   * Path for model/UI-facing output. May be a local absolute path,
   * workspace-relative path, or remote URI depending on the backend.
   */
  displayPath: string
}
```

خلفية يملك ملف إصدار token، أي write/edit الذي حراسة حماية جديد طازج درجة token. سياسة إضافة تخزين هو جمع بـ إجراء قديم قديم فحص؛ مستهلك لا حل تفسير ذلك محتوى. اثنان عدد id كل هو صنف لوحة تحويل لا نفاذ واضح نص.

```ts type-equiv
/**
 * Opaque key for stale guards and target lookup. The local backend uses a
 * realpath-like string; a remote backend might use a workspace URI or file id.
 * Consumers MUST NOT parse it or assume it is a local absolute path.
 */
type FsTargetKey = Branded<'FsTargetKey'>
```

```ts type-equiv
/**
 * Opaque file-version token — the freshness token a write/edit guards against.
 * The local backend derives it from high-resolution stat identity and freshness
 * fields; a remote backend might use a revision id. The policy layer records it
 * for stale checks; consumers may display related metadata but MUST NOT
 * interpret this token.
 */
type FsVersion = Branded<'FsVersion'>
```

`stat` إرجاع بيانات وصفية (من لا إرجاع محتوى) ، هدف لا وجود وقت إرجاع `undefined`.`type` يجعل مستهلك في قراءة قبل رفض دليل و خاص خاص ملف؛`size` يجعل نص مستهلك بلا حاجة عبر فشل استكشاف قياس يكفي اختيار `readText` أيضا هو `streamText`. نص مستهلك في إزالة استهلاك `streamText` وقت تنفيذ ذاتي ذات إبقاء كمية حد أعلى. أصلي بايت مستهلك استدعاء `readBytes(target, signal, maxBytes)`؛ ذلك لا بد ملء كامل محتوى حد أعلى سوف جعل معروف أو قراءة في اكتشاف تجاوز حد بـ `FS_TOO_LARGE` فشل، لن قطع قطع نتيجة أو بلا حد مؤقت اندفاع.

```ts type-equiv
/**
 * Metadata about a target — what {@link FileSystem.stat} returns. Lets the
 * policy layer reject directories/special files before reading and choose
 * `readText` vs `streamText` from `size` without probing by failure. `version`
 * is the freshness token. `undefined` from `stat` means the target is absent.
 */
interface FsInfo {
  /** Opaque freshness token of the target right now. */
  version: FsVersion
  /** Whether the target is a regular file, a directory, or something else. */
  type: 'file' | 'directory' | 'other'
  /** Byte size of a regular file, when the backend can report it. */
  size?: number
}
```

`lstat` هو مسار درجة، لا تتبع مع رابط بيانات وصفية أصل لغة. هو استقبال مسار بينما لا هو `FsTarget`، لأن `resolve` سوف متعمد تتبع مع symlink بـ إنتاج مستقر معرف؛ حاجة فحص معلومة مهمة حد مستهلك يمكن أولا استدعاء `lstat`، في تحليل قبل رفض `symlink`.

```ts type-equiv
/**
 * Metadata about a path without following the final path component when it is a
 * symbolic link. Unlike {@link FsInfo}, this path-level probe can report
 * `symlink` so consumers with trust-boundary rules can reject repository-owned
 * links before resolving a target.
 */
interface FsPathInfo {
  /** Opaque freshness token of the path entry right now. */
  version: FsVersion
  /** Whether the path entry is a regular file, directory, symlink, or other. */
  type: 'file' | 'directory' | 'symlink' | 'other'
  /** Byte size of the path entry, when the backend can report it. */
  size?: number
}
```

`listDir` حسب مستقر اسم ترتيب إرجاع مباشر فرعي بند. كل بند يحمل فرعي بند basename، نوع، قد تحليل هدف، و خلفية قدرة تقرير إبلاغ وقت نزيه قيمة بيانات وصفية. هو منع توقف قراءة ملف محتوى، لذلك `size` فقط لأجل عادي ملف،`version` قدوم ذاتي بيانات وصفية. قد ضرر تالف أو قد إزالة فقد فرعي بند يمكن بصفة `other` إرجاع كما لا حمل بيانات وصفية؛ صف خروج أو تحليل فرعي بند بيانات وصفية وقت إذن أو خلفية I/O فشل سوف بـ `FS_PERMISSION_DENIED` أو `FS_IO_ERROR` جعل كامل قائمة عملية فشل.

```ts type-equiv
/**
 * One direct child returned by {@link FileSystem.listDir}. Listing returns
 * metadata and resolved targets only; it must not read file contents.
 */
interface FsDirEntry {
  /** Basename of the child inside the listed directory. */
  name: string
  /** Whether the child is a regular file, a directory, or something else. */
  type: 'file' | 'directory' | 'other'
  /** Resolved child target for follow-up operations. */
  target: FsTarget
  /** Opaque freshness token when the backend can report metadata cheaply. */
  version?: FsVersion
  /** Byte size of a regular file, when the backend can report it. */
  size?: number
}
```

## كتابة و تحرير حراسة حماية (مزود اتفاق)

`writeText` و `editText` إصدار حراسة حماية كل هو اختياري: حذف حراسة حماية وقت تنفيذ بلا شرط عار مزود تغيير، توفير حراسة حماية وقت فإن تنفيذ متبادل ينبغي شرط فحص.`writeText` حراسة حماية هو `FsWriteIntent`:`createIfAbsent` في هدف ناقص وقت إنشاء، هدف قد وجود وقت بـ `FS_NOT_OBSERVED` رفض؛ أي جعل هدف في مزود ابتدائي استكشاف قياس بعد عندئذ ظهور، أيضا يجب رفض، لأن إصدار عملية ذاته لا نيل استبدال.`replaceIfVersion` فقط في هدف وجود كما إصدار مطابقة وقت استبدال، لا فإن تقرير `FS_STALE_VERSION`. حذف `expected` فإن بلا شرط إنشاء أو تغطية. ربط دمج نوع ذاته فقط يتضمن اثنان نوع لديه حراسة حماية معنى رسم؛ «بلا حراسة حماية» عبر حذف جدول بلوغ، لذلك write و edit كل استخدام نفس عدد اختياري `expected` حقل.

```ts type-equiv
/**
 * Guarded write intent. `createIfAbsent` rejects an existing target with
 * `FS_NOT_OBSERVED`; `replaceIfVersion` rejects absence or mismatch with
 * `FS_STALE_VERSION`. Omitting the intent from `writeText` means unconditional
 * create-or-overwrite, not a third union arm.
 */
type FsWriteIntent =
  | { kind: 'createIfAbsent' }
  | { kind: 'replaceIfVersion'; version: FsVersion }
```

```ts type-equiv
/** Outcome of a full-file write. */
interface FsWriteOutcome {
  /** Whether the write created a new file or replaced an existing one. */
  operation: 'create' | 'update'
  /** Opaque version of the file after the write. */
  version: FsVersion
  /**
   * The file's content BEFORE the write, or `null` when the file did not exist
   * (a create) or the backend declined a contextual basis (for example, a
   * binary/non-UTF-8 prior file or either overwrite side reaching its exclusive limit).
   * LF-normalized storage text (the diff basis), never a diff — a consumer
   * computes the result-time contextual diff from `before`/`after` when
   * `before` is present, else falls back to a whole-file diff.
   */
  before: string | null
  /** The file's content AFTER the write, LF-normalized to share `before`'s diff basis. */
  after: string
}
```

`editText` هو مزود درجة آخر تغيير عملية، بينما غير في آخر موضع تركيب `read` إضافة `write`. حمل حراسة حماية وقت، هو في حرف وجه مطابقة قبل أولا تحقق مسبق مدة إصدار (لذلك مقابل قديم قديم محتوى تحرير تقرير `FS_STALE_VERSION`، بينما غير مقابل تحديث محتوى مطابقة فشل) ؛ لا حمل حراسة حماية وقت، هو تحرير حالي محتوى. بلا نقاش أي نوع مسار، هو كل تطبيق استبدال و أصل فرعي كتابة——سوف مطابقة، سطر ذيل معالجة، قديم قديم فحص و أصل فرعي استبدال إبقاء في واحد تغيير قرب حد منطقة داخل——هدف ناقص وقت اثنان بند مسار كل تقرير `FS_STALE_VERSION`.

```ts type-equiv
/** A literal-replacement edit request. */
interface FsEditRequest {
  /** Literal non-empty text to replace. Must match exactly (after line-ending normalization). */
  oldString: string
  /** Literal replacement text. An empty string deletes the matched text. */
  newString: string
  /** Replace every match instead of requiring exactly one. */
  replaceAll: boolean
}
```

```ts type-equiv
/** Outcome of a literal edit. */
interface FsEditOutcome {
  /** Opaque version of the file after the edit. */
  version: FsVersion
  /**
   * The file's content BEFORE the edit. Raw storage text (LF-normalized by the
   * backend), never a diff — a consumer computes the result-time contextual diff
   * (the applied hunk with context) from `before`/`after`.
   */
  before: string
  /** The file's content AFTER the edit. */
  after: string
}
```

## fs سياسة حدث (مزود اتفاق مفردات)

`dsh-fs` يملك ثلاثة عدد حدث، من أداة توزيع، سياسة إضافة استماع، جعل حدث إرسال خروج جهة (`dsh-tool-fs`) و استماع جهة (`dsh-fs-observation-policy`) مشترك مفردات، بينما حدث إرسال خروج جهة بلا حاجة اعتماد سياسة إضافة. هو جمع فقط يحمل `dsh-fs` مفردات إضافة واحد لا نفاذ واضح `object` actor، لا يحتوي موجه إلى نموذج عام فكرة، أيضا لا يحتوي agent/جلسة كل من بنية.

`fs/write-intent` و `fs/edit-intent` هو**مفرد مجرى قرار waterfall**: أداة توزيع وقت مرفق حمل واحد افتراضي thunk(إرجاع `undefined`، أي عار مزود) ، استماع جهة تماما قرار بينما لا استدعاء `next()`. هذا slot حسب تسجيل ترتيب أولا إلى أولا نيل——من سياسة إضافة احتلال حسب هو نشر اتفاق، بينما غير قوي صنع ثابت صيغة.`fs/observed` هو واحد أي إرسال أي ترك سجل حدث، يحمل `FsObservation`: وجود في بعض عدد إصدار، أو تأكيد ناقص. هذا حدث عبر عادي `ctx.emit` توزيع؛ ذلك استماع جهة يجب هو تزامن، فقط إنتاج فرعي أثر، لأن أداة لن التقاط هذا emit رمي خروج استثناء——رمي خروج استثناء استماع جهة ممكن يحل محل قراءة عملية أصل هذا انتظار إرجاع خطأ، أو جعل أداة في تغيير قد نجاح بعد إرجاع `isError` نتيجة. تحت جهة توليد [cordis surface](#cordis-surface) عرض تأكيد قطع توقيع.

```ts type-equiv
/**
 * One authoritative observation of a target. A present observation carries the
 * version used by guarded replacement; an absent observation authorizes only a
 * guarded create, never an edit.
 */
type FsObservation =
  | { readonly kind: 'present'; readonly version: FsVersion }
  | { readonly kind: 'absent' }
```

## تنفيذ سياق (سياسة إضافة)

سياسة إضافة فقط حاجة كاف كاف تنفيذ سياق، عبر استلام ضيق `fs/*` حدث يحمل لا نفاذ واضح `object` actor قدوم دفع توجيه مراقبة قياس حالة كل من.`ToolExecution` يتضمن مطلوب حقل، لذلك `dsh-tool-fs` سوف ذلك تنفيذ كائن بصفة actor مباشر نقل تمرير، بينما بلا حاجة يجعل `dsh-fs-observation-policy` استيراد أداة،agent أو جلسة حزمة.

```ts type-equiv
/**
 * Minimal structural view of a tool execution the policy plugin needs to derive
 * an observed-state owner. `@deepseek-ai/dsh-tools`' `ToolExecution` contains
 * these fields, so the tool passes its `exec` straight through as the opaque
 * `object` actor on the `fs/*` events; this plugin narrows that actor to
 * `FsObservationActor` without importing `dsh-tools`, `dsh-agent`, or `dsh-session`.
 *
 * The owner is `agent.session` when present. It is treated as an opaque object
 * identity (a `WeakMap` key); this package never reads any of its fields.
 */
interface FsObservationActor {
  /** The agent on whose behalf the call runs, when there is one. */
  agent?: {
    /** The session that owns observed-file state, used as an opaque key. */
    session?: object
  }
}
```

## قراءة نتيجة (مستهلك / قراءة تصيير)

نص قراءة تلقي سطر نافذة، بايت حد أعلى و خلفية حد قيد. بلوغ إلى بايت حد أعلى بعد، مسح ما زال سوف متابعة، لكن لم يعد إبقاء أكثر كثير سطر، لذلك `totalLines` ما زال لـ دقيق قيمة. موجه إلى نموذج `read` أداة تصيير نتيجة صاف خالص هو عرض صفة؛ لا وجود `full`/`partial` عرض منطقة قسم——تخويل أساس في جديد طازج درجة (أداة إرسال خروج يمثل هدف وجود `fs/observed` حدث، و مباشر يحمل stat إصدار) ، لذلك أي نافذة تحويل قراءة في ملف لم تغيير وقت كل قدرة تخويل لاحق write/edit. بيانات وصفية لم أمر في وقت، أداة سوف في إرجاع `FS_NOT_FOUND` قبل emit ناقص مراقبة قياس، جعل لاحق حمل حراسة حماية كتابة يمكن إعادة إنشاء خارجي حذف هدف، لكن لن تخويل edit. يملك قراءة عملية منفذ `dsh-tool-fs` تنفيذ قراءة نافذة تحويل و بنية صنع هذا نتيجة؛ سياسة إضافة لا تنفيذ هذه عملية.

```ts type-equiv
/** Outcome of a bounded text read — what {@link formatReadOutput} renders. */
interface FileReadOutcome {
  /** 1-based first line requested. */
  offset: number
  /** Returned lines, already numbered. */
  lines: FileTextLine[]
  /** Exact total line count in the file. */
  totalLines: number
  /** Whether selected output hit the byte cap. */
  truncatedByBytes?: true
}
```

## قد مراقبة قياس ملف حالة (سياسة إضافة)

قد مراقبة قياس حالة هو `dsh-fs-observation-policy` إضافة داخلي يحتفظ `WeakMap<owner, Map<targetKey, FsObservation>>`. خريطة في لا يوجد بند يمثل لم رؤية؛`{ kind: 'absent' }` يمثل `read` بيانات وصفية لم أمر في، أو `str_replace_editor` `view`،`str_replace`،`insert` أمر حدوث بيانات وصفية لم أمر في، من بينما تأكيد ناقص؛`{ kind: 'present', version }` يمثل read،write أو edit مراقبة قياس إلى هذا إصدار. كتابة قرار يأخذ لم رؤية و ناقص خريطة إلى `createIfAbsent`، يأخذ وجود خريطة إلى `replaceIfVersion`؛ تحرير قرار يأخذ لم رؤية خريطة إلى `FS_NOT_OBSERVED`، يأخذ ناقص خريطة إلى `FS_NOT_FOUND`، يأخذ وجود خريطة إلى ذلك إصدار حراسة حماية. كل من من حدث actor دفع توجيه (عبر معتاد هو `exec.agent.session`) ، يتم نظر لـ لا نفاذ واضح كما من لا قراءة.dispose(مورد تحرير) وقت إسقاط الكل بيانات (HMR(حار وحدة استبدال) أمان) ، سياسة لا تنفيذ أي نظام الملفات I/O.

## خطأ تصنيف جسم نظام (مزود اتفاق)

نظام الملفات لذا عائق استخدام مستقر `FsErrorCode` نص، من `FsError`(`HarnessError`) يحمل. أداة سجل التسجيل في خطأ نتيجة فوق إبقاء `{ name, code }`، جعل إعادة محاولة، إذن و UI طبقة يمكن حسب code فرع بينما بلا حاجة تحليل نص.

```ts type-equiv
/**
 * Stable, machine-routable codes for filesystem failures. Carried on
 * {@link FsError}; the tool registry exposes `{ name, code }` on `isError`
 * results so retry/permission/UI layers can branch without parsing messages.
 */
type FsErrorCode =
  | 'FS_NOT_FOUND'
  | 'FS_NOT_DIRECTORY'
  | 'FS_NOT_TEXT'
  | 'FS_NOT_REGULAR_FILE'
  | 'FS_TOO_LARGE'
  | 'FS_PERMISSION_DENIED'
  | 'FS_SANDBOX_DENIED'
  | 'FS_IO_ERROR'
  | 'FS_STALE_VERSION'
  | 'FS_NOT_OBSERVED'
  | 'FS_AMBIGUOUS_EDIT'
  | 'FS_EDIT_NOT_FOUND'
  | 'FS_ABORTED'
```

دليل قائمة استخدام `FS_NOT_DIRECTORY`،`FS_PERMISSION_DENIED` و `FS_IO_ERROR` منطقة قسم قد وجود لكن و غير دليل هدف، يتم رفض قائمة عملية و معنى خارج خلفية I/O فشل.`FS_SANDBOX_DENIED` هو قوي صنع تنفيذ صندوق رملي خلفية (`dsh-fs-sandbox`) الذي عمل سياسة رفض——نمط حد رفض كتابة/تحرير——و `FS_PERMISSION_DENIED`(مضيف داخل نواة رفض) مختلف.`FS_NOT_OBSERVED` يمثل سياسة إضافة لا يوجد هذا كل من أولا قبل مراقبة قياس سجل (أو `createIfAbsent` لقاء إلى قائم ملف).`FS_NOT_FOUND` أيضا يمثل سياسة بسبب تأكيد ناقص بينما رفض edit.`FS_STALE_VERSION` يمثل خلفية إصدار لم يعد و مراقبة قياس إلى إصدار مطابقة (أو مزود ذاته استلام إلى إبرة مقابل ناقص هدف edit). جديد طازج درجة تخويل لا يوجد جزء/كامل لـ قسم، لذلك لا وجود `FS_PARTIAL_OBSERVATION`.

## ملف IO لا ضبط مهلة

`read`/`write`/`edit` **لا**قبول `timeoutMs`، مزود اتفاق أيضا لا ضبط قطع توقف وقت——مختلف في bash و web(هو جمع إزالة استهلاك [`@deepseek-ai/dsh-timeout`](../../packages/util/timeout/README.zh.md)) و subprocess دعم دعم `glob`/`grep`(ذلك إعلان `timeoutMs` من `@deepseek-ai/dsh-tool-call-timeout-policy` قوي صنع تنفيذ): ذلك بعض هو عملية دعم دعم، قطع توقف وقت يمكن حق صحيح إنهاء عمل. محلي نظام استدعاء حتى كثير هو كل قوة في توقف——مهلة لا يمكن إجبار جعل إجراء في `fsync`/`rename` توقف تحت، لذلك هذا داخل `timeoutMs` سوف يصبح seam لا يمكن قوي صنع تنفيذ قطع توقف وقت، بينما كما تماما جيد سقوط في «صريح أفضل في خفي صيغة» منع توقف خفي صيغة قيمة افتراضية موضع. إلغاء ما زال عبر أداة تنفيذ signal نقل بث، في نظام استدعاء حد كل قوة في توقف.

## خدمة و إضافة

`FileSystem`(`ctx.fs`،abstract) يملك مزود أصل لغة:`resolve`،`processPath`،`processPathFromHostPath`،`fileUrl`،`contains`،`stat`،`lstat`،`readText`،`streamText`،`readBytes`،`listDir`،`writeText` و `editText`.`dsh-fs-observation-policy` **لا تسجيل خدمة**. هو عبر `fs/*` حدث بوابة إضافة سياسة، أصل حسب لم رؤية، ناقص أو وجود حالة مقابل كتابة و تحرير معنى رسم waterfall عمل خروج قرار، و سجل `FsObservation` قيمة. منفذ هو `dsh-tool-fs`: هو عبر `ctx.fs` قراءة، كتابة أو تحرير، توزيع waterfall، و emit سجل حدث. تحت جهة توليد [`ctx.fs` صغير عقدة](#ctxfs--filesystem-abstract-seam) عرض تأكيد قطع `ctx.fs` توقيع.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxfs--filesystem-abstract-seam"></a>

### `ctx.fs` — `FileSystem` (abstract seam)

Abstract filesystem provider. Targets must preserve identity across aliases; reads expose regular UTF-8 text or typed errors, listings are stable and content-free, and mutations are atomic. Optional guards add stale protection without changing the unguarded provider contract.

```ts cordis-catalog
/**
 * Resolve a model/plugin-supplied path into a stable {@link FsTarget}. May perform I/O (a
 * remote/sandboxed backend may need a round-trip to map a path to a stable identity), hence
 * async even though the local backend only normalizes + realpaths.
 *
 * @param path - the path to resolve; relative paths resolve against `opts.cwd`.
 * @param opts - optional cwd override and cancellation signal.
 * @returns the stable target; the same file yields the same `targetKey`.
 */
abstract resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget>

/**
 * Return the canonical absolute path a subprocess in this filesystem's
 * execution world can open. The path is deliberately separate from
 * {@link FsTarget.targetKey}: consumers may pass this value to another OS
 * capability, but must continue treating the target key as opaque.
 * @param target - the resolved target whose process path is required.
 * @returns an absolute path in the backend's execution world.
 */
abstract processPath(target: FsTarget): string

/**
 * Map an absolute path from the harness host into this filesystem's
 * execution world when both paths identify the same file. The base provider
 * exposes no mapping; host-backed or explicitly shared backends override it.
 * @param hostPath - absolute path in the harness host filesystem.
 * @returns the process path for the same file, or undefined when this
 *   execution world cannot read that host file.
 */
processPathFromHostPath(hostPath: string): string | undefined

/**
 * Return the canonical `file:` URI for a target in this filesystem's
 * execution world. Backends own URI encoding because the host platform may
 * differ from the execution platform.
 * @param target - the resolved target to encode.
 * @returns the target's canonical file URI.
 */
abstract fileUrl(target: FsTarget): string

/**
 * Test canonical containment without exposing or parsing backend target
 * keys. Both targets must come from this provider.
 * @param parent - canonical directory target.
 * @param child - canonical candidate target.
 * @returns true when `child` is `parent` or a descendant of it.
 */
abstract contains(parent: FsTarget, child: FsTarget): boolean

/**
 * Return target metadata, or `undefined` when the target does not exist.
 * @param target - the resolved target to stat.
 * @param signal - aborts the metadata round-trip.
 * @returns metadata only, never content; undefined for an absent target.
 */
abstract stat(target: FsTarget, signal?: AbortSignal): Promise<FsInfo | undefined>

/**
 * Return path metadata without following the final path component when it is a
 * symbolic link. This is intentionally path-shaped, not target-shaped:
 * {@link resolve} follows symlinks to produce the stable identity used by
 * normal reads/writes, while `lstat` lets a consumer reject the path itself
 * before that follow happens.
 *
 * `opts.cwd` follows {@link resolve}'s cwd rules. `undefined` means the path is
 * absent.
 * @param path - the path to inspect; relative paths resolve against `opts.cwd`.
 * @param opts - `cwd` overrides the backend's default base for relative paths.
 * @param signal - aborts the metadata round-trip.
 * @returns metadata only, never content; undefined for an absent path.
 */
abstract lstat(path: string, opts?: { cwd?: string }, signal?: AbortSignal): Promise<FsPathInfo | undefined>

/**
 * Read the whole regular text file as a single decoded string.
 * @param target - the resolved target to read.
 * @param signal - aborts the read.
 * @returns the full decoded UTF-8 content.
 */
abstract readText(target: FsTarget, signal?: AbortSignal): Promise<string>

/**
 * Stream the whole regular text file as decoded text chunks (same text
 * semantics as {@link readText}, for large files). The backend owns
 * cross-chunk UTF-8 decoding and binary rejection so the policy layer never
 * touches raw bytes.
 * @param target - the resolved target to read.
 * @param signal - aborts the stream, including between chunks.
 * @returns the chunk iterable, decoded and validated like {@link readText}.
 */
abstract streamText(target: FsTarget, signal?: AbortSignal): Promise<AsyncIterable<string>>

/**
 * Read the whole regular file as raw bytes with no decoding or binary
 * rejection. The bound lives at this seam so a backend can never buffer an
 * unbounded file: a target known or discovered to exceed `maxBytes` fails
 * with `FS_TOO_LARGE` instead of returning a truncated result.
 * @param target - the resolved target to read.
 * @param signal - aborts the read.
 * @param maxBytes - inclusive byte cap on the complete content.
 * @returns the full raw content, at most `maxBytes` long.
 */
abstract readBytes(target: FsTarget, signal: AbortSignal | undefined, maxBytes: number): Promise<Uint8Array>

/**
 * Read one byte window of the regular file as raw bytes with no decoding or
 * binary rejection: the bytes at `[offset, offset + length)`, shorter when
 * the file ends inside the window and empty when `offset` lies at or past
 * its end. The window is the bound here, not the file: a backend transfers
 * at most `length` bytes of content beyond the prefix it skips to reach
 * `offset` and never buffers the whole file, so the caller's cap on `length`
 * is the guard against unbounded buffering.
 * @param target - the resolved target to read.
 * @param range - `offset`, the 0-based first byte, and `length`, the largest byte count; both non-negative integers.
 * @param signal - aborts the read.
 * @returns the window's bytes, at most `length` long.
 */
abstract readByteRange(target: FsTarget, range: { offset: number; length: number }, signal?: AbortSignal): Promise<Uint8Array>

/**
 * List direct children of a directory in stable name order. Returns resolved
 * child targets plus cheap metadata only; never reads file contents.
 * @param target - the resolved directory target.
 * @param signal - aborts the listing.
 * @returns one entry per direct child, in stable name order.
 */
abstract listDir(target: FsTarget, signal?: AbortSignal): Promise<FsDirEntry[]>

/**
 * Atomically create or replace UTF-8 text. `expected` guards intent and
 * staleness; omission allows unconditional overwrite.
 * @param target - the resolved target to write.
 * @param content - the full new file content.
 * @param expected - the write intent guarding the write; omit for unconditional.
 * @param signal - aborts before atomic publication takes effect.
 * @param sandboxPolicy - the per-call mode and workspace root this write
 *   runs under; a sandboxing backend fences the write by it, the bare backend
 *   ignores it. Omit to leave the backend its own default.
 * @returns the outcome, including the version the write produced.
 */
abstract writeText( target: FsTarget, content: string, expected?: FsWriteIntent, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy, ): Promise<FsWriteOutcome>

/**
 * Atomically edit literal text. When supplied, the version guard is checked
 * before matching so stale content reports `FS_STALE_VERSION`; omission edits
 * the current content without a freshness precondition.
 * @param target - the resolved target to edit.
 * @param edit - the literal search/replace request.
 * @param expected - the version guard; omit for an unconditional edit.
 * @param signal - aborts before atomic publication takes effect.
 * @param sandboxPolicy - the per-call mode and workspace root this edit runs
 *   under; a sandboxing backend fences the edit by it, the bare backend
 *   ignores it. Omit to leave the backend its own default.
 * @returns the outcome, including the version the edit produced.
 */
abstract editText( target: FsTarget, edit: FsEditRequest, expected?: { version: FsVersion }, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy, ): Promise<FsEditOutcome>
```

Types: [SandboxExecutionPolicy](sandbox.zh.md)

Source: [`packages/fs/fs/src/index.ts`](../../packages/fs/fs/src/index.ts)

<a id="fs-events"></a>

### `fs/*` events

<a id="fsedit-intent--waterfall"></a>

#### `fs/edit-intent` — waterfall

Single-slot decision for the next FileSystem.editText. Calling `next()` yields an unconditional edit; the first returned guard wins.

```ts cordis-catalog
/**
 * Single-slot decision for the next {@link FileSystem.editText}. Calling
 * `next()` yields an unconditional edit; the first returned guard wins.
 * @param target - the resolved target about to be edited.
 * @param actor - the opaque tool-execution context the decider keys off.
 * @mode waterfall
 */
'fs/edit-intent'(target: FsTarget, actor: object | undefined, next: () => { version: FsVersion } | undefined | Promise<{ version: FsVersion } | undefined>): Promise<{ version: FsVersion } | undefined>
```

Source: [`packages/fs/fs/src/index.ts`](../../packages/fs/fs/src/index.ts)

<a id="fsobserved--emit"></a>

#### `fs/observed` — emit

Record an authoritative positive or negative observation. Listeners must be synchronous recorders: throws fail the tool call and returned promises are not awaited.

```ts cordis-catalog
/**
 * Record an authoritative positive or negative observation. Listeners must
 * be synchronous recorders: throws fail the tool call and returned promises
 * are not awaited.
 * @param target - the target whose presence or absence was observed.
 * @param observation - present with its version, or confirmed absent.
 * @param actor - the observing tool-execution context; undefined records nothing useful.
 * @mode emit
 */
'fs/observed'(target: FsTarget, observation: FsObservation, actor: object | undefined): void
```

Source: [`packages/fs/fs/src/index.ts`](../../packages/fs/fs/src/index.ts)

<a id="fswrite-intent--waterfall"></a>

#### `fs/write-intent` — waterfall

Single-slot decision for the next FileSystem.writeText. Calling `next()` yields the bare provider's unconditional write; the first listener that returns an intent owns the decision rather than composing with peers.

```ts cordis-catalog
/**
 * Single-slot decision for the next {@link FileSystem.writeText}. Calling
 * `next()` yields the bare provider's unconditional write; the first listener
 * that returns an intent owns the decision rather than composing with peers.
 * @param target - the resolved target about to be written.
 * @param actor - the opaque tool-execution context the decider keys off.
 * @mode waterfall
 */
'fs/write-intent'(target: FsTarget, actor: object | undefined, next: () => FsWriteIntent | undefined | Promise<FsWriteIntent | undefined>): Promise<FsWriteIntent | undefined>
```

Source: [`packages/fs/fs/src/index.ts`](../../packages/fs/fs/src/index.ts)
<!-- END GENERATED cordis-surface -->

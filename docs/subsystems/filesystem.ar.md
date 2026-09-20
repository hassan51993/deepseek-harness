# نظام الملفات

[English](filesystem.md) | العربية

لقدرة نظام الملفات الاختيارية أربعةُ أجزاء: تملك [dsh-fs](../../packages/fs/fs) الخدمةَ `ctx.fs` وعملياتِ النص الذرّية مع حرّاس اختياريين، وتنفّذ [dsh-fs-local](../../packages/fs/fs-local) القرصَ المحلي، وتسجّل [dsh-fs-observation-policy](../../packages/fs/fs-observation-policy) الحضورَ أو الغيابَ المرصود وتضيف قواعدَ طزاجة عبر الأحداث لا عبر خدمة، وتنفّذ [dsh-tool-fs](../../packages/fs/tool-fs) مباشرةً نداءاتِ القراءة والكتابة والتحرير التي يراها النموذج وتعرض النوافذ. وهي خارج عمود agent loop؛ والخلفياتُ البديلة لا تغيّر السياسةَ ولا schemas الأدوات.

و`dsh-fs-observation-policy` اختيارية. وبدونها، يكوّن تعريفُ خدمة `FileSystem` ومزوّدٌ والمستهلكُ `dsh-tool-fs` seam نظامِ ملفات كاملًا بلا قيود: فينشئ `write` أو يستبدل بلا شرط، ويستبدل `edit` نصًّا حرفيًّا بلا شرط. وتغيّر إضافةُ السياسة هاتين العمليتين بحسم شلالات `fs/*`. وإزالتُها لا تكسر الأداةَ لأن الأداةَ تنادي `ctx.fs` وتوزّع أحداثًا؛ وهي لا تنادي طرائقَ سياسة. ويُتوقع من النشر الذي يحمّل `dsh-tool-fs` أن يحمّل `dsh-fs-observation-policy` أيضًا فيصير السلوكُ الافتراضي «اقرأ قبل الكتابة أو التحرير».

مصدرُ المزوّد: [`packages/fs/fs/src/types.ts`](../../packages/fs/fs/src/types.ts) و[`packages/fs/fs/src/index.ts`](../../packages/fs/fs/src/index.ts). ومصدرُ السياسة: [`packages/fs/fs-observation-policy/src/types.ts`](../../packages/fs/fs-observation-policy/src/types.ts). ومصدرُ عرض القراءة: [`packages/fs/tool-fs/src/read-render.ts`](../../packages/fs/tool-fs/src/read-render.ts).

## هوية الهدف وبياناته الوصفية (عقد المزوّد)

تحلّ كلُّ عملية المسارَ الذي يقدّمه المستخدم إلى هدف خلفية معتم أولًا. وللمستهلكين عرضُ `displayPath`، لكن عليهم ألّا يحلّلوا `targetKey` (وهو معرّف معتم موسوم) وألّا يفترضوه مسارًا محليًّا مطلقًا.

والمستهلكون الذين يتشاركون عالمَ تنفيذ نظام الملفات يحصّلون الإحداثياتِ بين القدرات من المزوّد بدل تفسير تلك الهوية: فـ`processPath(target)` يعيد المسارَ المطلق المعياري الذي تستطيع عمليةٌ فرعية فتحَه، و`processPathFromHostPath(hostPath)` يربط ملفًّا مطلقًا على مضيف الحزام حين يتشاركه عالمُ التنفيذ ذاك وحده، و`fileUrl(target)` يعيد رابطَ `file:` على منصة المزوّد، و`contains(parent, child)` يفحص الهويةَ المعيارية أو احتواءَ السليل.

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

وتملك الخلفيةُ رموزَ إصدار الملفات — وهو رمزُ الطزاجة الذي تحرسه كتابةٌ أو تحرير. وتخزّنها إضافةُ السياسة لفحوص القِدَم؛ ولا يفسّرها المستهلكون. والمعرّفان سلسلتان معتمتان موسومتان.

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

ويعيد `stat` بياناتٍ وصفية (لا محتوى قط)، أو يعيد `undefined` حين يغيب الهدف. ويتيح `type` للمستهلكين رفضَ الأدلة والملفات الخاصة قبل القراءة، ويتيح `size` لمستهلكي النص اختيارَ `readText` أو `streamText` بلا استكشاف بالفشل. ويطبّق مستهلكُ النص سقفَ احتفاظه وهو يستهلك `streamText`. ويستعمل مستهلكو البايتات الخام `readBytes(target, signal, maxBytes)`؛ وسقفُه المشترَط للمحتوى الكامل يجعل الطفحَ المعروفَ أو المكتشَف يفشل بـ`FS_TOO_LARGE` بدل الاقتطاع أو التخزين بلا حدّ.

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

و`lstat` هي بدائيةُ البيانات الوصفية على مستوى المسار بلا اتّباع. وهي تأخذ مسارًا بدل `FsTarget` لأن `resolve` يتّبع الروابطَ الرمزية عمدًا لينتج هويةً ثابتة؛ ويستطيع المستهلكون الذين يحتاجون إلى فحوص حدّ الثقة نداءَ `lstat` أولًا ورفضَ `symlink` قبل الحلّ.

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

ويعيد `listDir` مداخلَ الأبناء المباشرين بترتيب أسماء ثابت. ويحمل كلُّ مدخل اسمَ الابن الأساس ونوعَه وهدفَه المحلول وبياناتٍ وصفية رخيصة حين تستطيع الخلفيةُ التبليغَ عنها. وعليه ألّا يقرأ محتوى الملفات، فـ`size` لا تكون إلا للملفات العادية و`version` مشتقةٌ من البيانات الوصفية. وقد يُعاد الأبناءُ المكسورون أو الذين اختفوا بوصفهم `other` بلا بيانات وصفية؛ أما إخفاقاتُ الأذونات أو الإدخال والإخراج في الخلفية أثناء التعداد أو حلّ بيانات الأبناء الوصفية فتُفشل التعدادَ كلَّه بـ`FS_PERMISSION_DENIED` أو `FS_IO_ERROR`.

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

## حرّاس الكتابة والتحرير (عقد المزوّد)

تأخذ `writeText` و`editText` كلتاهما حارسَ الإصدار **اختياريًا**: أغفِله لتغيير بلا شرط (بمزوّد مجرد)، أو قدّمه للحراسة. وحارسُ `writeText` هو `FsWriteIntent` — فـ`createIfAbsent` تنشئ هدفًا مفقودًا وترفض الموجودَ بـ`FS_NOT_OBSERVED`، ومن ذلك هدفٌ ظهر بعد استكشاف المزوّد الأول لأن النشرَ نفسَه يجب ألّا يستبدل؛ و`replaceIfVersion` لا تستبدل إلا حين يوجد الهدفُ بالإصدار المرصود، وإلا فـ`FS_STALE_VERSION`. وإغفالُ `expected` ينشئ أو يستبدل بلا شرط. ولا يحمل الاتحادُ نفسُه إلا القصدين المحروسين؛ أما «بلا حارس» فيُعبَّر عنه بالإغفال، فتستعمل الكتابةُ والتحريرُ حقلَ `expected` الاختياري نفسَه.

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

و`editText` تغييرٌ على مستوى المزوّد، لا `read` مع `write` مركَّبين في موضع آخر. وهي تتحقق حين تُحرَس من الإصدار المتوقَّع قبل المطابقة الحرفية (فيبلّغ التحريرُ القديم بـ`FS_STALE_VERSION` لا بفشل مطابقة في مقابل محتوى أحدث)؛ وبلا حراسة تحرّر المحتوى الحالي. وفي الحالتين تطبّق الاستبدالَ وتكتب ذرّيًّا — فتُبقي المطابقةَ ومعالجةَ نهايات الأسطر وفحصَ القِدَم والاستبدالَ الذرّي داخل مقطع حَرِج واحد للتغيير — ويبلّغ الهدفُ المفقود بـ`FS_STALE_VERSION` في المسارين.

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

## أحداث سياسة fs (مفردات عقد المزوّد)

تملك `dsh-fs` ثلاثةَ أحداث توزّعها الأداةُ وتستمع إليها إضافةُ السياسة، فيتشارك المُصدِر (`dsh-tool-fs`) والمستمع (`dsh-fs-observation-policy`) مفرداتٍ بلا أن يعتمد المُصدِرُ على إضافة السياسة. وهي لا تحمل إلا مفرداتِ `dsh-fs` وفاعلًا معتمًا من نوع `object` — بلا مفاهيمَ يراها النموذجُ وبلا بنية مالك وكيل أو جلسة.

و`fs/write-intent` و`fs/edit-intent` **شلالا قرار بخانة واحدة**: توزّع الأداةُ كلًّا منهما مع دالة افتراضية تعيد `undefined` (وهي المزوّدُ المجرد)، ويحسم مستمعٌ الأمرَ كاملًا بلا نداء `next()`. والخانةُ للأول الفائز بترتيب التسجيل — وامتلاكُ إضافة السياسة لها عرفُ نشر لا ثابتةٌ مفروضة. و`fs/observed` حدثُ تسجيل بلا متابعة يحمل `FsObservation`: حاضرٌ عند إصدار أو غائبٌ مؤكد. ويُوزَّع بـ`ctx.emit` صرفة؛ وعلى مستمعه أن يكون متزامنًا وذا أثر جانبي فقط، لأن الأداةَ **لا** تحرس الإطلاق — فالمستمعُ الرامي قد يحلّ محلَّ خطأ قراءة أو يظهر نتيجةَ `isError` للأداة بعد نجاح تغيير فعلًا. وتبيّن [سطح cordis](#cordis-surface) المولَّد أدناه التوقيعاتِ بعينها.

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

## سياق التنفيذ (إضافة السياسة)

تحتاج إضافةُ السياسة من سياق التنفيذ إلى ما يكفي لاشتقاق مالك الحالة المرصودة بتضييق الفاعل المعتم `object` الذي تحمله أحداثُ `fs/*`. ولـ`ToolExecution` الحقولُ المشترَطة، فتمرّر `dsh-tool-fs` كائنَ تنفيذها فاعلًا بلا أن تستورد `dsh-fs-observation-policy` حزمَ الأدوات ولا الوكيل ولا الجلسة.

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

## ناتج القراءة (المستهلك وعرض القراءة)

قراءةُ النص محدودةٌ بنافذة أسطر وسقفِ بايتات وحدودِ الخلفية. وبعد بلوغ سقف البايتات، يستمر المسحُ بلا الاحتفاظ بمزيد من الأسطر فتبقى `totalLines` دقيقة. والنتيجةُ التي تعرضها أداةُ `read` التي يراها النموذج عرضيةٌ محضة؛ ولا يوجد عرضٌ `full` أو `partial` — فالتخويلُ قائم على الطزاجة (إذ تُطلق الأداةُ `fs/observed` حاضرًا مباشرةً بإصدار `stat`)، فتستطيع أيُّ قراءة بنافذة تخويلَ كتابة أو تحرير لاحق ما دام الملفُّ لم يتغير. وإخفاقُ البيانات الوصفية يُطلق مراقبةَ غياب قبل أن تعيد الأداةُ `FS_NOT_FOUND`، فتستطيع كتابةٌ محروسة لاحقة إعادةَ إنشاء هدف حُذف خارجيًّا بلا تخويل تحرير. و`dsh-tool-fs` هي المنفِّذُ الذي يملك القراءة: فهي تنفّذ نوافذَ القراءة وتبني هذه النتيجة؛ ولا تفعل ذلك إضافةُ السياسة.

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

## حالة الملفات المرصودة (إضافة السياسة)

الحالةُ المرصودة `WeakMap<owner, Map<targetKey, FsObservation>>` تحتفظ بها إضافةُ `dsh-fs-observation-policy` داخلها. وغيابُ مدخل الخريطة يعني «لم يُرَ»؛ و`{ kind: 'absent' }` تعني أن إخفاقَ بيانات وصفية في `read` أو في `view` أو `str_replace` أو `insert` لدى `str_replace_editor` أكد الغيابَ؛ و`{ kind: 'present', version }` تعني أن قراءةً أو كتابةً أو تحريرًا رصد ذلك الإصدار. ويربط قرارُ الكتابة «لم يُرَ» و«غائب» بـ`createIfAbsent`، بينما يربط «حاضر» بـ`replaceIfVersion`؛ ويربط قرارُ التحرير «لم يُرَ» بـ`FS_NOT_OBSERVED`، و«غائب» بـ`FS_NOT_FOUND`، و«حاضر» بحارس إصداره. ويُشتق المالكُ من فاعل الحدث (عادةً `exec.agent.session`)، ويُعامل معتمًا ولا يُقرأ قط. ويُسقط التخلصُ كلَّ شيء (لسلامة HMR)، ولا تجري السياسةُ عملياتِ إدخال وإخراج على نظام الملفات.

## تصنيف الأخطاء (عقد المزوّد)

تستعمل إخفاقاتُ نظام الملفات سلاسلَ `FsErrorCode` ثابتة يحملها `FsError` (وهو `HarnessError`). ويحفظ سجلُّ الأدوات `{ name, code }` في نتائج الأخطاء، فتستطيع طبقاتُ إعادة المحاولة والأذونات والواجهة التفرعَ بلا تحليل نص.

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

ويستعمل تعدادُ الأدلة الرموزَ `FS_NOT_DIRECTORY` و`FS_PERMISSION_DENIED` و`FS_IO_ERROR` للتمييز بين هدف موجود ليس دليلًا، وتعدادٍ مرفوض، وفشلِ إدخال وإخراج غير متوقع في الخلفية. و`FS_SANDBOX_DENIED` رفضُ **سياسة** من خلفية تفرض العزلَ (`dsh-fs-sandbox`) — إذ منع سياجُ الوضع كتابةً أو تحريرًا — ويتمايز عن `FS_PERMISSION_DENIED` (وهو رفضُ نواة المضيف). و`FS_NOT_OBSERVED` تعني أن إضافةَ السياسة لا تملك سجلَّ مراقبة سابقة لهذا المالك (أو أن `createIfAbsent` أصابت ملفًّا موجودًا). و`FS_NOT_FOUND` تمثّل أيضًا تحريرًا رُفض من غياب مؤكد. و`FS_STALE_VERSION` تعني أن إصدارَ الخلفية لم يعد يطابق المرصودَ (أو أن المزوّدَ نفسَه تلقى تحريرًا لهدف مفقود). ولا تمييزَ في تخويل الطزاجة بين جزئي وكامل، فلا وجودَ لـ`FS_PARTIAL_OBSERVATION`.

## لا مهل لعمليات إدخال وإخراج الملفات

لا تأخذ `read` ولا `write` ولا `edit` قيمةَ `timeoutMs`، ولا يسلّح عقدُ المزوّد مهلةً — بخلاف bash والوِب (اللذين يستهلكان [`@deepseek-ai/dsh-timeout`](../../packages/util/timeout/README.ar.md)) وبخلاف `glob` و`grep` المسنَدتين إلى عمليات فرعية (حيث تفرض `@deepseek-ai/dsh-tool-call-timeout-policy` قيمةَ `timeoutMs` المعلَنة): فتلك مسنَدةٌ إلى عمليات، حيث تستطيع مهلةٌ أن تقتل العملَ حقًّا. أما نداءُ النظام المحلي فقابلٌ للإجهاض على قدر الاستطاعة على أحسن تقدير — فالمهلةُ لا تستطيع إجبارَ `fsync` أو `rename` جاريًا على التوقف، فتكون `timeoutMs` هنا مهلةً لا يستطيع الـseam فرضَها، وافتراضًا ضمنيًّا في الموضع بعينه الذي تمنعه قاعدةُ «الصريحُ أولى من الضمني». ويبقى الإلغاءُ ينتشر عبر إشارة تنفيذ الأداة للإجهاض على قدر الاستطاعة عند حدود نداءات النظام.

## الخدمة والإضافة

تملك `FileSystem` (`ctx.fs`، مجردة) بدائياتِ المزوّد: `resolve` و`processPath` و`processPathFromHostPath` و`fileUrl` و`contains` و`stat` و`lstat` و`readText` و`streamText` و`readBytes` و`listDir` و`writeText` و`editText`. ولا تسجّل `dsh-fs-observation-policy` **خدمةً**: فهي إضافةٌ تضيف سياسةً عبر بوابة أحداث `fs/*`: تحسم شلالَي قصد الكتابة والتحرير من حالات «لم يُرَ» و«غائب» و«حاضر» وتسجّل قيمَ `FsObservation`. والمنفِّذُ هو `dsh-tool-fs`: فهو يقرأ ويكتب ويحرّر عبر `ctx.fs`، ويوزّع الشلالات، ويُطلق حدثَ التسجيل. ويبيّن [قسم `ctx.fs`](#ctxfs--filesystem-abstract-seam) المولَّد أدناه التوقيعاتِ بعينها.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

Types: [SandboxExecutionPolicy](sandbox.ar.md)

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

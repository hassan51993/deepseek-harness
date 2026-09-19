---
description: "موجه إلى نموذج read،read_image،write و edit أداة: توفير تركيب أو ترتيب فحص agent نظام الملفات وصول مستخدم و صيانة من استخدام."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-fs

[English](README.md) | العربية

## عام وصف

استخدام `dsh-tool-fs` يمكن يجعل نموذج حمل سطر رقم قراءة UTF-8 ملف، قراءة تلقي دعم حمل صورة، إنشاء أو أصل فرعي أرض استبدال ملف، و تنفيذ لديه إبرة مقابل صفة حرف وجه كمية تحرير. نتيجة كل لديه حد أعلى، فشل سوف توفير مستقر رمز خطأ و استعادة إشارة أمر. عند كتابة و تحرير يجب في نجاح قراءة بعد تنفيذ وقت، طلب إضافة `dsh-fs-observation-policy`؛ حذف هو وقت، تغيير ما زال هو أصل فرعي، لكن لا تلقي هذا شرط قيد. صورة قراءة حاجة حمل دائم مرفق عنصر تخزين و دعم حمل صورة إدخال توجيه نموذج.glob أو grep بحث طلب اختيار نفس درجة اكتشاف أداة حزمة.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

في `ctx.fs` خلفية بعد تركيب أداة، و في حاجة أولا قراءة بعد كتابة/تحرير سلوك وقت تركيب سياسة إضافة. نموذج مع بعد نيل نيل حمل سطر رقم قراءة، أصل فرعي كتابة و تحرير، و——تركيب مرفق عنصر تخزين وقت——رسم مثل قراءة؛ كل نتيجة كل لديه حد أعلى، فشل يحمل مستقر رمز خطأ و استعادة إشارة أمر.

### الأكثر صغير تركيب

واحد خلفية، سياسة إضافة، لكن بعد هو أداة؛ مرفق عنصر تخزين لـ اختياري، لأجل تفعيل `read_image`.

```yaml
- name: '@deepseek-ai/dsh-fs-local'
- name: '@deepseek-ai/dsh-fs-observation-policy'
- name: '@deepseek-ai/dsh-tool-fs'
```

سياسة إضافة هو اختياري: حذف وقت، أداة مباشر استخدام عار مزود (بلا شرط كتابة، تغطية و تحرير، بلا قد مراقبة حالة). تحميل هذه أداة نشر أيضا ينبغي تحميل هذا إضافة، من بينما توفير كتابة/تحرير قبل قراءة سلوك.`read_image` فقط في حمل دائم `ctx.attachments` خدمة قد تركيب وقت تسجيل؛ تنفيذ وقت أيضا رفض تأكيد قطع نموذج لم إعلان رسم مثل إدخال توجيه، لذلك نص توجيه حمل دائم تاريخ لن ظهور رسم مثل كتلة.

### أداة

| أداة | معامل | سلوك |
|---|---|---|
| `read` | `file_path`،`offset?`،`limit?` | حمل سطر رقم UTF-8 محتوى و قسم صفحة footer؛`offset` من 1 بدء،`limit` افتراضي لـ إعداد `readLimit`، حد أعلى أيضا لـ هذا قيمة |
| `read_image` | `file_path` | قراءة و حمل دائم حفظ PNG/JPEG/WebP/GIF مصدر رسم؛ بلا توسيع اسم مسار (يشمل مواصفة تحويل مرفق عنصر كائن مسار) حسب ملف توقيع تعرف آخر صيغة؛ مواصفة تحويل يمكن في تحت مرة نموذج طلب قبل تقليص صغير صورة، لذلك نموذج بلا حاجة أولا إنشاء تقليص اختصار رسم |
| `write` | `file_path`،`content` | إنشاء أو كامل استبدال ملف؛ لديه سياسة إضافة وقت، تغطية اشتراط أولا في لم تغيير إصدار فوق تنفيذ `read`، إنشاء لا حاجة |
| `edit` | `file_path`،`old_string`،`new_string`،`replace_all?` | حرف وجه كمية استبدال، حذف غير `replace_all` لـ true لا فإن اشتراط وحيد مطابقة؛ لديه سياسة إضافة وقت، اشتراط أولا تنفيذ `read` كما ملف لم تغيير |

حقل اسم استخدام snake_case، و Claude Code و قائم harness أداة schema متسق. نجاح إرجاع ضيق تجميع معلومة غلاف——قراءة نافذة، رسم مثل مرجع أو `Created file`/`Updated file` تأكيد——`write`/`edit` أيضا سوف إرسال توليد يمكن إعادة تشغيل diff بطاقة بيانات وصفية توفير UI عرض.

### إعداد

كل مفتاح متساو لـ اختياري؛ قيمة افتراضية هو مع منتج تسليم قراءة حد أعلى.

| مفتاح | قيمة افتراضية | يحتوي معنى |
|---|---|---|
| `readLimit` | `2000` | مرة `read` استدعاء إرجاع افتراضي و الأكثر كبير سطر عدد |
| `readMaxLineLength` | `2000` | كل سطر مقتطع قبل إبقاء محرف عدد |
| `readMaxBytes` | `51200` | مرة `read` استدعاء الذي اختيار سطر بايت حد أعلى؛ فيض خروج وقت بـ «قد بلوغ حد أعلى»footer انتهاء نافذة |
| `readStreamMinSize` | `10485760` | كبير في انتظار في هذا كبير صغير أو كبير صغير لم معرفة ملف اعتماد تدفق صيغة قراءة، بينما لا هو كامل جسم تحميل إلى داخل تخزين |

توليد[إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-tool-fs) هو كل تلقي دعم حمل حقل و ذلك JSDoc نفاد كل صيغة حق مصدر.

### سياسة و صندوق رملي سلوك

`read` و `read_image` مسار تخويل تماما من `ctx.fs` مسؤول؛ وسيط جسم نوع إعلان و ملف توقيع فقط قرار `read_image` هل قبول هذا خلفية إرجاع بايت.

تركيب سياسة إضافة بعد،`write` و `edit` من `fs/*` معنى رسم مجرى موضع أخذ نيل منع حماية، لذلك لم قراءة هدف أو قديم قديم مراقبة سوف بـ `FS_NOT_OBSERVED` أو `FS_STALE_VERSION` و استعادة إشارة أمر فشل. استخدام تطبيق إضافة صندوق رملي حد خلفية (`fs-sandbox`) وقت،`write`/`edit` أيضا سوف عام `sandbox_permissions` و `justification`؛ يتم رفض تغيير إرجاع `[sandbox: file access denied under <mode> mode]` علامة و نفس جولة ترقية تلميح، نيل دفعة إعادة محاولة يمكن في هذا مرة استدعاء في إضافة غطاء صارم إطار أكثر عرض نمط.

### فشل و استعادة

فشل يتم مواصفة تحويل لـ `Error: <message>`، و لـ استدعاء جهة إبقاء بنية تحويل رمز خطأ. مستقر رسالة يشمل `file_path must be a non-empty string`،`limit must be less than or equal to <max>`،`cannot read "<path>": not found`،`cannot read "<path>": not a regular file`، و رسم مثل توجيه رفض `cannot read "<path>" as an image: model "<model>" does not declare image input; switch to an image-capable model to read images`. بلا نقاش رفض قدوم ذاتي سياسة أيضا هو مزود،`FS_NOT_OBSERVED` كل مواصفة تحويل لـ `cannot modify "<path>": file has not been read — read the file, then retry`؛`FS_STALE_VERSION` إبقاء مزود سبب و إلحاق `— re-read the file, then retry`. هذا مرة إعادة قراءة تأكيد ناقص بعد،`edit` تقرير إبلاغ `FS_NOT_FOUND` بينما لن تكرار قديم قديم استعادة إشارة أمر،`write` فإن استخدام منع حماية إنشاء.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير أداة طقم عنصر خلف بعد تصميم قرار، و إشارة خروج تنفيذ هو جمع شفرة موضع؛ يمكن مراقبة سلوك قد في[استخدام هذه الحزمة](#use-this-package) في كامل شرح.

### تصميم إدارة فكرة

أداة حينئذ هو منفذ؛ سياسة هو حدث بوابة. أداة لا حقن سياسة خدمة، أيضا لا فحص أي ذاكرة مؤقتة——كل مرة تغيير كل عبر `ctx.waterfall` نحو مفرد واحد معنى رسم مجرى موضع طلب منع حماية، كل عملية فقط في نجاح بعد إرسال خروج `fs/observed`. قراءة تماما جيد تنفيذ مرة مزود `stat`(نوع و كبير صغير توجيه إضافة مراقبة إلى إصدار) ؛ تغيير مرة أيضا لا تنفيذ، لأن منع حماية قدوم ذاتي معنى رسم مجرى موضع، مزود في قفل داخل إعادة فحص.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | إضافة مدخل:`Config`، أداة تركيب،`read_image` مرفق عنصر بوابة |
| [`src/read.ts`](src/read.ts) | `read` منفذ: مرة stat، تدفق صيغة قرار، نافذة بناء، مراقبة |
| [`src/read-image.ts`](src/read-image.ts) | `read_image` منفذ: توجيه و وسيط جسم نوع بوابة، محدود بايت، مرفق عنصر حفظ |
| [`src/write.ts`](src/write.ts) | `write` منفذ: معنى رسم waterfall، أصل فرعي كتابة، مراقبة |
| [`src/edit.ts`](src/edit.ts) | `edit` منفذ: معنى رسم waterfall، حرف وجه كمية تحرير، مراقبة |
| [`src/read-render.ts`](src/read-render.ts) | لا اعتماد Cordis نافذة بناء و معلومة غلاف صيغة تحويل |
| [`src/sandbox.ts`](src/sandbox.ts) | `write`/`edit` مشترك رفع حق API: سياسة تحليل و رفض علامة خريطة |
| [`src/error.ts`](src/error.ts) | منع حماية تغيير فشل مستقر نموذج جانب تشخيص |

### كل أداة مسار

أربعة عدد أداة مشترك نفس نوع مسار شكل: استخدام استدعاء جلسة cwd تحليل مسار، تشغيل ملائم استخدام بوابة، تماما جيد تنفيذ مرة مزود عملية، و كما فقط في نجاح بعد إرسال خروج `fs/observed`.`read` و `read_image` لـ نوع و كبير صغير توجيه دفع خروج مرة `stat`؛`write` و `edit` لا تنفيذ stat، لأن منع حماية قدوم ذاتي معنى رسم مجرى موضع، مزود فشل بـ نوع تحويل `FsError` نتيجة عرض. كل أداة منفذ يقع في `src/read.ts`،`src/read-image.ts`،`src/write.ts` و `src/edit.ts`.

### مراقبة و تزامن

`fs/observed` في عملية نجاح بعد عبر عادي `ctx.emit` إرسال خروج؛ مستمع اتفاق هو تزامن كما فقط لديه فرعي أثر سجل جهاز، لذلك مختلف خطوة أو ممكن فشل مراقبة لا يخص هذا حدث.`read` سماح تزامن ضبط درجة، لأن هو وحيد تغيير حالة عملية هو تزامن سجل إصدار؛ قليلا بعد `write` أو `edit` سوف في هدف قفل داخل إعادة فحص إصدار، لذلك سجل جهاز تنافس حالة سوف أمان أرض فشل، اثنان عدد تغيير أداة ما زال إبقاء متبادل رفض.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند حزمة درجة اتفاق لا كاف استخدام وقت قراءة قراءة التالي صفحة. هو جمع من أداة تدريجي خطوة دخول هو جمع الذي تركيب اتفاق، خلفية و سياسة.

- [نظام الملفات فرعي نظام](../../../docs/subsystems/filesystem.ar.md)——نفاد كل صيغة مزود اتفاق، سياسة حدث و خطأ تصنيف جسم نظام.
- [dsh-fs](../fs/README.ar.md)——هذه أداة إزالة استهلاك `ctx.fs` اتفاق.
- [fs-local](../fs-local/README.ar.md)——هذه أداة تشغيل في ذلك فوق مضيف نظام الملفات خلفية.
- [fs-sandbox](../fs-sandbox/README.ar.md)——إضافة رفع حق حقل صندوق رملي قوي صنع خلفية.
- [fs-observation-policy](../fs-observation-policy/README.ar.md)——عبر `fs/*` حدث منع حماية تغيير سياسة إضافة.
- [توليد أداة دليل](../../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-fs)——هذه الحزمة تسجيل نفاد كل صيغة schema.

-----

<a id="model-experience"></a>
## تجربة النموذج

### توجيه النظام

#### نموذج يرى محتوى

تجميع وقت، كل إشارة توجيه مقطع سقوط عبر `ctx.tools.get(name, scope)` فحص مقابل أداة، فقط في هذا agent مرئي وقت إخراج.write مقطع سقوط فقط في edit مرئي وقت دفع ترشيح edit. ثلاثة عدد أداة كل متاح وقت، تحت جهة أصل نص إبقاء ثابت؛ حد تطبيق إضافة، حل حذف و أداة تسجيل تغير في تحت مرة تجميع وقت توليد فاعلية. نفس فحص ملائم لأجل مباشر حد agent و subagent `toolFilter`، أيضا ملائم لأجل عبر `run_code` كشف PTC قدرة. write/edit في أولا قراءة بعد تعديل جملة فرعي وصف مراقبة سياسة، و غير اشتراط استدعاء اسم لـ `read` أداة. إخفاء `read` وقت ما زال إبقاء هذه جملة فرعي: سياسة متابعة حفظ حماية تعديل عملية، أخرى إنتاج مراقبة سجل عملية (مثال مثل `str_replace_editor` `command: view`) أيضا قدرة بناء قيام نفس ملف مراقبة سجل. أداة مرئي صفة لن منع استخدام هذا قبل وضع شرط.

##### Read إشارة توجيه

```markdown
Use the read tool — not shell commands like cat — to inspect text files. Results include line numbers. Use offset and limit to continue reading large files.
```

##### Write إشارة توجيه

```markdown
Use the write tool to create files or completely replace file contents. Existing files are overwritten, so read an existing file first (the default fs-observation-policy requires it) and prefer edit for targeted changes.
```

##### Edit إشارة توجيه

```markdown
Use the edit tool for targeted changes to existing UTF-8 text files. It replaces literal old_string with new_string; by default old_string must appear exactly once. If old_string appears multiple times, provide a more specific old_string or set replace_all to true. Read the file first (the default fs-observation-policy requires it), unless you just created or edited it in this session.
```

#### Token أثر

إشارة توجيه صار هذا أخذ قرار في مرئي أداة و ذلك ملائم استخدام عبر أداة دفع ترشيح.

#### KV Cache أثر

مرئي أداة تجميع دمج، إضافة أثر مجال و إشارة توجيه نص ثابت وقت، بادئة إبقاء مستقر. حد أو إضافة دورة الحياة تغير ممكن من أول عدد تغير مقطع سقوط بدء جعل إعادة استخدام بطلان.

### أداة schema

#### نموذج يرى محتوى

نموذج سوف يرى قد توليد [`read`،`read_image`،`write` و `edit` schema](../../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-fs) ، معامل استخدام snake_case. صورة أداة فقط في حمل دائم مرفق عنصر تخزين قد تركيب وقت ظهور؛schema ذاته و توجيه غير متصل، صارم إطار بوابة في تنفيذ وقت رفض. أثر مجال أداة حد يمكن لـ بعض عدد agent إزالة مهمة واحد تعريف.

#### Token أثر

هذا أداة عرض في كل طلب كل دعم دفع ثابت schema صار هذا.

#### KV Cache أثر

فقط يلزم مرئي أداة تعريف و ترتيب ثابت، بادئة حينئذ إبقاء مستقر. تسجيل دورة الحياة أو أثر مجال حد ممكن من أول عدد تغير schema token بدء جعل إعادة استخدام بطلان.

### قراءة نتيجة

#### نموذج يرى محتوى

نجاح قراءة نتيجة دقيق لـ `<path><displayPath></path>`، تبديل سطر،`<type>file</type>`، تبديل سطر،`<content>`، شكل مثل `<lineNumber>: <text>` تحرير رقم سطر، واحد فارغ سطر، واحد بند footer و `</content>`.footer دقيق لـ `(Output capped. Showing lines <start>-<end>. Use offset=<next> to continue.)`،`(Showing lines <start>-<end> of <total>. Use offset=<next> to continue.)` أو `(End of file - total <total> lines)`. طويل سطر ربط ذيل دقيق لـ `... (line truncated to <max> chars)`. قراءة ناقص هدف ما زال إرجاع `FS_NOT_FOUND`، لكن سوف لـ استدعاء جلسة سجل تأكيد ناقص؛ خارجي حذف ملف يتم إعادة قراءة بعد، إعادة محاولة `write` يمكن عبر مزود لا استبدال منع حماية أمان أرض إعادة إنشاء هذا ملف.

#### Token أثر

قراءة إخراج تلقي `readLimit`،`readMaxLineLength` و `readMaxBytes` حد؛ إبقاء استدعاء و نتيجة سوف عكس تكرار إرسال، مباشر إلى سياق ضغط (compaction).

#### KV Cache أثر

فقط إلحاق؛ إضافة جديدة مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV Cache بند بطلان.

### رسم مثل قراءة نتيجة

#### نموذج يرى محتوى

نجاح `read_image` إرجاع `<path><displayPath></path>`،`<type>image</type>` و كتابة واضح وسيط جسم نوع، مواصفة تحويل مقياس قياس و بايت عدد `<content>` معلومة غلاف، مع بعد هو بصفة أصلي رسم مثل كتلة رسم مثل ذاته. نتيجة سوف مع حمل دائم مرجع كتابة جلسة سجل، لكن بعد عندئذ دخول تحت مرة نموذج طلب.

#### Token أثر

رسم مثل في بعد كل مرة طلب في كل سوف حساب استهلاك، مباشر إلى ضغط. كل مرة استدعاء كل مستقل تلقي مرفق عنصر تخزين `maxImageBytes`/`maxImagePixels`/`maxImageDimension` قيد؛ تكرار نجاح استدعاء سوف في تاريخ في تراكم تراكم، محتوى بحث عنوان فقط ذهاب إعادة تخزين بايت، لا ذهاب إعادة كل مرة طلب token صار هذا.

#### KV Cache أثر

فقط إلحاق؛ جديد مرئي محتوى تتبع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV ذاكرة مؤقتة بند بطلان.

### كتابة و تحرير نتيجة

#### نموذج يرى محتوى

كتابة دقيق إرجاع خمسة سطر حزمة شبكة:`<path><displayPath></path>`،`<type>file</type>`،`<content>`،`Created file` أو `Updated file`، و `</content>`. تحرير دقيق إرجاع `The file <displayPath> has been updated successfully.`؛ مقابل في `replace_all`، دقيق إرجاع `The file <displayPath> has been updated. All occurrences were successfully replaced.`. كامل كتابة أو استبدال نص ما زال إبقاء في assistant استدعاء الأداة معامل في.

#### Token أثر

نجاح نص جدا قليل، لكن كبير نوع تغيير معامل و كل نتيجة سوف عكس تكرار إرسال، مباشر إلى سياق ضغط.

#### KV Cache أثر

فقط إلحاق؛ إضافة جديدة مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV Cache بند بطلان.

### أداة خطأ

#### نموذج يرى محتوى

فشل سوف مواصفة تحويل لـ `Error: <message>`. هذه الحزمة مستقر تحقق و قراءة رسالة هو `file_path must be a non-empty string`،`limit must be less than or equal to <max>`،`old_string must be a non-empty string`،`old_string and new_string must differ`،`cannot read "<path>": not found`،`cannot read "<path>": not a regular file`،`offset <offset> is out of range for "<path>" (<total> lines)`،`cannot read "<path>": the <ext> extension does not declare a supported image format; read_image accepts PNG/JPEG/WebP/GIF files, including extension-less files in those formats`،`cannot read "<path>": the file content is not a supported image format; read_image accepts PNG/JPEG/WebP/GIF`،`cannot read "<path>": the bytes do not decode as a supported PNG/JPEG/WebP/GIF image; the file may be truncated or corrupt`،`cannot read "<path>" as an image: model "<model>" does not declare image input; switch to an image-capable model to read images`، و نوع لا مطابقة إصلاح رسالة `cannot read "<path>": the <ext> extension declares <type>, but the bytes use a different image format; rename the file to match its actual format if it is PNG/JPEG/WebP/GIF, or convert it to one of those formats`(بلا توسيع اسم مسار لا مطابقة تقرير إبلاغ `cannot read "<path>": the file signature claims <type>, but the bytes decode as a different image format; the file may be corrupt`).16-bit تحويل فشل سوف تقرير إبلاغ `cannot read "<path>": the 16-bit PNG could not be converted to the normalized 8-bit sRGB form; convert it to an 8-bit PNG/JPEG/WebP and retry`. مزود و سياسة نموذج لوح في كل منها حزمة README في تدريجي حرف صف خروج. نموذج جانب خطأ حزمة تركيب يأخذ كل `FS_NOT_OBSERVED` مصدر مواصفة تحويل لـ `cannot modify "<path>": file has not been read — read the file, then retry`؛`FS_STALE_VERSION` إبقاء مزود سبب و إلحاق `— re-read the file, then retry`. اثنان من كل إبقاء بنية تحويل رمز خطأ و أصلي سبب. هذا مرة إعادة قراءة تأكيد ناقص بعد،`edit` سوف تقرير إبلاغ `FS_NOT_FOUND`، بينما لن تكرار قديم قديم استعادة إشارة أمر؛`write` فإن استخدام حمل منع حماية إنشاء.

#### Token أثر

فقط لديه فشل استدعاء سوف إضافة هذه إبقاء token.

#### KV Cache أثر

فقط إلحاق؛ إضافة جديدة مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV Cache بند بطلان.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح أداة طقم عنصر أي وقت لا دمج ملائم، أو أي وقت حاجة خاص آخر تشغيل صيانة ملاحظة معنى. هو جمع هو حالي حزمة قيد، لا هو عام نظام الملفات مقابل مقارنة أو مهمة تراكم ضغط.

- **لم تسليم موجه إلى نموذج دليل قائمة أداة**:`ctx.fs.listDir` خدمة في skill(تقنية قدرة) اكتشاف انتظار مزود شفرة، نفس درجة `dsh-tool-fs-search` حزمة فإن توفير أساس في ripgrep `glob` و `grep`، بينما لا هو توسيع نظام الملفات seam.
- **`read` فقط معالجة UTF-8 نص ملف**: رسم مثل استخدام مستقل `read_image` أداة؛PDF، صوت تردد و نظر تردد ما زال تأجيل معالجة. دليل هدف لـ `FS_NOT_REGULAR_FILE`.
- **وسيط جسم نوع حسب توسيع اسم إعلان**: توسيع اسم اختيار إعلان نوع، مرفق عنصر تخزين سحر عدد تحقق إبقاء مرجعي؛ توسيع اسم خطأ لكن صيغة صحيح تأكيد رسم مثل سوف نيل إلى تعديل اسم إصلاح تلميح، بينما لا هو يتم شم استكشاف قبول. فقط لديه لا يوجد توسيع اسم مسار حسب ملف توقيع تعرف آخر صيغة.
- **كائن مسار إعادة مشي مصدر دقيق دخول**: مقابل مواصفة تحويل مرفق عنصر كائن استدعاء `read_image` سوف يأخذ ذلك بايت بصفة جديد مصدر إعادة دقيق دخول، لذلك يأخذ `maxImageBytes`/`maxMessageImageBytes` إعداد نيل منخفض في مواصفة تحويل صورة بايت ميزانية نشر ممكن رفض `ctx.attachments.readImage` ما زال يمكن قراءة كائن مسار؛ افتراضي إعداد تحت مواصفة تحويل ميزانية (4 MiB) بعيد منخفض في مصدر حد أعلى (20 MiB).
- **داخل تضمين رسم مثل معاينة اعتماد UI تركيب**: أداة نتيجة بطاقة مرور من متصفح `tool.call.images` مجرى موضع تصيير رسم مثل، من مرفق عنصر عرض إضافة ملء ملء؛ لم تركيب هذا إضافة UI تعديل لـ عرض نتيجة معلومة غلاف نص.
- **لا يوجد مرفق عنصر منطقة مجال أداة**:agent في يملك نظام الملفات مسار وقت يمكن عبر أخرى متاح أداة قطع قص صورة؛ لا يوجد مسار لصق لصق أو سحب دخول صورة لا يمكن حسب أكثر عال قسم تمييز معدل إعادة قراءة.
- **لا يوجد مهلة واجهة**:`read`/`write`/`edit` لا قبول مهلة معامل، أيضا لا إعلان مهلة ميزانية؛ إلغاء فقط عبر `exec.signal` نقل تمرير (رؤية[مزود إدارة من](../README.ar.md)).

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. هذا عدد نموذج جانب adapter لا يوجد مستقل lifecycle stream؛ تنفيذ علاقة من هو استدعاء capability seam مسؤول.

---
description: "موجه إلى نموذج pwsh أداة، توفير اختيار، إعداد أو ترتيب فحص Windows فوق مرة صفة PowerShell تنفيذ، خلفية مهمة و صندوق رملي رفع حق استخدام من و صيانة من قراءة قراءة."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-pwsh

[English](README.md) | العربية

## عام وصف

`dsh-tool-pwsh` لـ agent(ذكي جسم) توفير `pwsh` أداة، عبر قد تركيب shell منفذ تشغيل PowerShell أمر——هو هو `dsh-tool-bash` Windows مقابل شيء، تدريجي استدعاء مرآة مثل. كل مرة استدعاء كل تشغيل في كل جديد pwsh عملية في، لذلك حالة لن إبقاء؛`run_in_background` يأخذ طويل وقت تشغيل أمر تغيير صار خلفية مهمة. أمر هو PowerShell جهة قول: أصلي `C:\...` مسار و `$env:NAME` متغير، لا فعل جهة قول قلب ترجمة. كل مرة استدعاء كل تشغيل في تلقي إدارة `DSH_*` بيئة في؛ في صندوق رملي منفذ تحت، أداة سوف نحو نموذج شرح و قوي صنع تنفيذ Windows خاص لديه لغة نمط و تسمية إدارة طريق اتفاق. طلب و `dsh-pwsh-local` انتظار PowerShell منفذ و `dsh-shell-env` إضافة واحد بدء تركيب.

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

في agent حاجة تشغيل PowerShell أمر أي تركيب في تحميل هذا إضافة——عبر معتاد هو `ctx.shell` من PowerShell منفذ دعم دعم Windows تركيب. واحد حالما تركيب منفذ مزود و `dsh-shell-env` سجل التسجيل، هو حينئذ تسجيل `pwsh` أداة.

### أي وقت اختيار

عند أمر يجب استخدام PowerShell تحرير كتابة——أصلي مسار و `$env:` متغير——أو نشر هو Windows أصلي وقت، اختيار pwsh أداة. عند أمر تجميع هو bash جهة قول وقت اختيار `dsh-tool-bash`؛ اثنان من بين لا يوجد قلب ترجمة. عند عمل اعتماد عبر استدعاء حالة (cwd، متغير) وقت، حمل دائم مقابل شيء [`dsh-tool-pwsh-persistent`](../tool-pwsh-persistent/README.ar.md) سوف إبقاء واحد حسب كل من عزل shell تخزين نشط.

### الأكثر صغير إعداد

معتاد استخدام مسار هو PowerShell منفذ مزود، بيئة سجل التسجيل و هذا أداة.

```yaml
- name: '@deepseek-ai/dsh-pwsh-local'
- name: '@deepseek-ai/dsh-shell-env'
- name: '@deepseek-ai/dsh-tool-pwsh'
```

وحيد إعداد حقل لأجل فتح صلة خلفية دعم حمل.

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---|---|
| `enableRunInBackground` | `true` | كشف `run_in_background`؛ لـ `false` وقت رفض قوي صنع خلفية استدعاء |

توليد[إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-tool-pwsh) هو كل تلقي دعم حمل حقل و ذلك JSDoc نفاد كل صيغة حق مصدر؛ توليد[أداة دليل](../../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-pwsh) يحمل كامل معامل schema.

### تشغيل أمر

أداة تنفيذ `pwsh -Command <command>` و إرجاع دمج بعد إخراج. أمر كل مرة استدعاء كل تشغيل في كل جديد pwsh عملية في، لذلك حالة من لا إبقاء——طلب نقل `workdir` بينما لا هو `cd`. مسار استخدام أصلي Windows شكل صيغة، بيئة متغير استخدام `$env:NAME` قراءة. غير صفر خروج بـ `[exit code: N]` تقرير إبلاغ؛ في Windows فوق، قوي صنع إنهاء أمر بـ `[exit code: 1]` تسوية كما لا يوجد إشارة علامة، لذلك agent يأخذ في قطع بعد عار exit 1 عند عمل إنهاء بينما غير أمر فشل. خلفية تشغيل، إخراج قطع قطع و `description`/`timeoutMs`/`workdir` معامل سلوك و [`dsh-tool-bash`](../tool-bash/README.ar.md#running-long-commands-in-the-background) تماما متسق، يشمل مختلف خطوة shell دقيق تجهيز مرور مسار في من مهمة مسؤول إلغاء.

### Windows خاص لديه صندوق رملي سلوك

في صندوق رملي منفذ تحت، يتم رفض أمر سوف تقرير إبلاغ `[sandbox: file access denied under <mode> mode]`، و ملائم استخدام نفسه مفرد مرة رفع حق مسار: استخدام `sandbox_permissions` إضافة واحد جملة `justification`، مرور مستخدم مراجعة دفعة بعد إعادة محاولة تماما نفسه أمر مرة. أداة أيضا سوف في ذلك وصف في تعليم منح اثنان بند Windows تلقي حد أمر لوحة اتفاق: فقط قراءة pwsh تشغيل في ConstrainedLanguage في (`.NET` ساكن حالة استدعاء،`Add-Type`،COM و عكس إطلاق سوف بـ "only core types" خطأ فشل) ؛ اثنان نوع تلقي حد نمط تحت برنامج كل لا يمكن فتح تسمية إدارة طريق، لذلك عبر إدارة طريق stdio التقاط آخر برنامج إخراج أمر سوف بـ EPERM فشل——طلب رفع حق هذا تأكيد قطع أمر مرة، أو إعادة بنية أمر بـ تجنب تجنب التقاط إخراج.

### ممكن خروج ماذا مشكلة

لا يوجد PowerShell منفذ تركيب دائم بعيد لن تنشيط هذا أداة، كما حقن خدمة (`tools`،`shell`،`systemPrompt`،`shellEnv`) يجب الكل وجود. لا يوجد مهمة وقت التشغيل خلفية استدعاء سوف بـ `background jobs unavailable: load @deepseek-ai/dsh-jobs and @deepseek-ai/dsh-tool-jobs` فشل؛ لا يوجد صندوق رملي منفذ وقت `sandbox_permissions` سوف بـ `sandbox_permissions is not available in this composition (no sandboxing executor to escalate)` فشل.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير أداة خلف بعد تصميم قرار، و إشارة خروج تنفيذ هو جمع شفرة موضع؛ يمكن مراقبة سلوك قد في[استخدام هذه الحزمة](#use-this-package) في كامل شرح.

### تصميم إدارة فكرة

- **`dsh-tool-bash` لحظة معنى توأم توليد.** قبل منصة و خلفية تنفيذ، تلقي إدارة بيئة، صندوق رملي رفع حق وجه و علامة/قطع قطع تصيير كل تدريجي استدعاء مرآة مثل bash أداة، لذلك منها لـ واحد مستهلك أيضا قدرة قبول آخر عدد بروتوكول شكل حالة ([pwsh أداة و bash مقابل متساو Agent Note](../../../.agents/notes/implemented/feature/2026-08-02-pwsh-tool-bash-parity.ar.md)).
- **PowerShell جهة قول اتفاق.** أداة اتفاق هو PowerShell: أصلي مسار و `$env:` متغير، مرور من `pwsh -Command` تنفيذ، لا يوجد في بين shell.
- **Windows صندوق رملي واقع كتابة دخول وصف.** ConstrainedLanguage و تسمية إدارة طريق اتفاق هو Windows تلقي حد أمر لوحة سلوك؛ تعليم منح هو جمع شرط هو «قد تركيب مهمة معنى قيد منفذ» ، لـ الذي بـ أمان، هو لأن كل قد إصدار إعداد مقابل كل هو win32-only.
- **غير صفر خروج فقط تقرير إبلاغ، لا فشل.** فقط لديه أساس أساس ضبط تطبيق لذا عائق (spawn خطأ، في توقف) عندئذ سوف بصفة أداة خطأ كشف، و bash لذا أمر متسق.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | إضافة مدخل: أداة تسجيل، نص التوجيه منطقة مقطع، معامل تحقق، رفع حق، طلب تجميع |
| [`src/background.ts`](src/background.ts) | يأخذ قد تسوية خلفية عملية خريطة لـ عام مهمة نتيجة مفردات |
| [`src/render.ts`](src/render.ts) | نموذج جانب نتيجة نص: تدفق، علامة، قطع قطع إشعار (bash توأم توليد) |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ حذف الذي تابع seam قوي صنع تنفيذ اتفاق خارج، هذه الحزمة لا عام مستقل حدث تسلسل أو متغير بيانات علاقة. |

### تصيير و خروج علامة

مصير مشترك bash أداة بنية و قدوم ذاتي `dsh-shell` `parseExitStatus` علامة اتفاق: جاف صاف خروج (0، بلا إشارة) لا إنتاج علامة؛UI بطاقة يأخذ خروج علامة إزالة استهلاك لـ خروج حالة pill.Windows قوي صنع إنهاء بـ exit 1 تسوية كما لا يوجد إشارة، لذلك `[killed by signal: …]` فقط ملائم لأجل POSIX.`tool:pwsh` نص التوجيه منطقة مقطع (first-party ترتيب 1010) تعليم منح خروج علامة اتفاق و «في قطع بعد exit 1» Windows حل قراءة.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند حزمة درجة اتفاق لا كاف استخدام وقت قراءة قراءة التالي صفحة. هو جمع من shell بيت عائلة تدريجي خطوة دخول منفذ seam، و Windows سلوك خلف بعد تصميم قلم تسجيل.

- [shell حزمة خريطة](../README.ar.md)——bash قدرة بيت عائلة و ذلك زاوية لون.
- [Bash منفذ فرعي نظام](../../../docs/subsystems/shell.ar.md)——طلب/spec مفردات، نتيجة و خلفية عملية.
- [shell-env](../shell-env/README.ar.md)——كل مرة استدعاء كل سوف استلام إلى تلقي إدارة `DSH_*` بيئة.
- [tool-jobs](../../jobs/tool-jobs/README.ar.md)——خلفية تشغيل `job_output`،`job_list` و `job_kill` تحكم.
- [pwsh أداة و bash مقابل متساو Agent Note](../../../.agents/notes/implemented/feature/2026-08-02-pwsh-tool-bash-parity.ar.md)——لـ ماذا أداة مرآة مثل bash أداة.
- [Windows ACL تلقي حد أمر لوحة صندوق رملي Agent Note](../../../.agents/notes/implemented/feature/2026-08-08-windows-acl-restricted-token-sandbox.ar.md)——لغة نمط و تسمية إدارة طريق اتفاق.
- [توليد أداة دليل](../../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-pwsh)——`pwsh` معامل schema تأكيد قطع محتوى.
- [توليد إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-tool-pwsh)——كل تلقي دعم حمل إعداد حقل و ذلك مصدر إعلان.

-----

<a id="model-experience"></a>
## تجربة النموذج

### توجيه النظام

#### نموذج يرى ماذا

هذا إضافة تسجيل أثر مجال داخل كل مرة طلب كل في first-party ترتيب 1010 موضع يتضمن التالي pwsh إشارة جذب. حسب أثر مجال فعلي تطبيق أداة حد يمكن إخفاء schema، لكن لن إزالة هذا عدد مستقل تسجيل منطقة مقطع.

##### Pwsh إشارة جذب

```markdown
Non-zero exits are reported as `[exit code: N]` markers; investigate failures before moving on. On Windows a killed process settles as `[exit code: 1]` without a signal marker; treat a bare exit 1 after an interruption as a termination, not a command failure.
```

#### Token أثر

إضافة تنشيط خلال، كل مرة طلب كل سوف إنتاج قليل كمية ثابت إدخال token فتح إلغاء.

#### KV Cache أثر

فقط يلزم تسجيل أثر مجال و نص التوجيه نص ثابت، بادئة حينئذ إبقاء مستقر. إضافة تنشيط أو تحرير ممكن جعل من هذا نص التوجيه منطقة مقطع بدء إعادة استخدام بطلان.

### أداة schema

#### نموذج يرى ماذا

نموذج سوف يرى توليد [`pwsh` schema](../../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-pwsh). حسب agent أثر مجال فعلي تطبيق أداة حد يمكن إزالة هذا agent تعريف.

#### Token أثر

أداة مرئي كل طلب كل سوف إنتاج ثابت schema فتح إلغاء.

#### KV Cache أثر

فقط يلزم مرئي صفة و أداة تعريف ثابت، بادئة حينئذ إبقاء مستقر. حد أو إعداد تغير ممكن من أول عدد تغير token بدء جعل إعادة استخدام بطلان.

### قبل منصة نتيجة

#### نموذج يرى ماذا

مصير إخراج اعتماد بيانات بينما تحديد stdout ذيل جزء، مجددا إخراج اختياري `[stderr]` و stderr ذيل جزء. شرط سطر دقيق لـ `[output truncated; full output: <path-or-(unavailable)>]`،`[sandbox: file access denied under <mode> mode]` إضافة رفع حق تلميح `[sandbox: escalation available — …]`(فقط في تركيب إعلان رفع حق وقت) ،`[timed out after <timeoutMs>ms]`،`[killed by signal: <signal>]` و `[exit code: <exitCode>]`(فقط غير صفر خروج) ؛ فارغ متن تصيير لـ `(no output)`.

#### Token أثر

استدعاء قبل نتيجة token لـ صفر. إخراج حسب تدفق ضبط حد، بينما كل سطر قد إرسال خروج محتوى في ضغط (compaction) قبل إبقاء في تاريخ.

#### KV Cache أثر

فقط إلحاق؛ جديد مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV-cache بند بطلان.

### خلفية نتيجة

#### نموذج يرى ماذا

خلفية بدء دقيق تصيير لـ `started background job <id>`؛ مع بعد قراءة و حالة مرور من عام `job_output`/`job_kill` أداة تدفق تحويل، يشمل داخل تخزين قطع قطع إسقاط لم قراءة بايت وقت لديه ضرر قراءة spill إشعار.

#### Token أثر

تأكيد هو واحد سطر ثابت قصير نص؛ مهمة إخراج حسب كل مرة قراءة ضبط حد.

#### KV Cache أثر

فقط إلحاق؛ جديد مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV-cache بند بطلان.

### أداة خطأ

#### نموذج يرى ماذا

تحقق و أساس أساس ضبط تطبيق فشل موحد واحد لـ `Error: <message>`. هذه الحزمة مستقر رسالة يشمل `invalid command: expected a non-empty string`،`invalid description: expected a non-empty string`،`invalid timeoutMs: expected a positive number, got <value>`، رفع حق إعداد مقابل فشل،`sandbox_permissions is not available in this composition (no sandboxing executor to escalate)`، مشترك رفع حق فشل (لم صارم إطار إضافة عرض/بلا مراجعة دفعة خدمة/بلا agent يمكن توجيه/بلا مراجعة دفعة عبر طريق/مستخدم رفض/قد إلغاء) ،`run_in_background is disabled for this deployment (enableRunInBackground: false)`،`background jobs unavailable: load @deepseek-ai/dsh-jobs and @deepseek-ai/dsh-tool-jobs`، و `tool call aborted`.

#### Token أثر

فقط لديه فشل استدعاء سوف زيادة هذه إبقاء token؛ يتم في توقف استدعاء لن إضافة أمر إخراج.

#### KV Cache أثر

فقط إلحاق؛ جديد مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV-cache بند بطلان.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد شرح أداة أي وقت لا دمج ملائم أو حاجة خاص آخر صغير قلب. هو جمع هو حالي حزمة قيد، لا هو مهمة تراكم ضغط.

- **Windows صندوق رملي تحت لغة نمط و تسمية إدارة طريق التقاط**——في [Windows ACL صندوق رملي](../../sandbox/sandbox-windows-acl/README.ar.md) تحت، فقط قراءة pwsh بـ ConstrainedLanguage بدء، لأن ذلك مؤقت دليل كتابة يتم رفض، توجيه يؤدي PowerShell AppLocker استكشاف قياس فشل و حسب رفض معالجة:`Add-Type`، غير نواة قلب .NET ساكن حالة استدعاء (`[System.IO.*]::`،`[math]::`) ،COM كائن و عكس إطلاق سوف بـ "only core types" خطأ فشل، كما هذا نمط لا يمكن من داخلي حل حذف.workspace-write خاص مؤقت دليل يجعل استكشاف قياس إتمام، لذلك حذف غير مضيف سياسة آخر لديه قاعدة تحديد، هو إبقاء FullLanguage. اثنان نوع تلقي حد نمط كل رفض تسمية إدارة طريق فتح، لذلك تلقي حد أمر داخلي إدارة طريق stdio spawn سوف بـ EPERM فشل. أداة وصف يأخذ اثنان بند اتفاق كل تعليم إعطاء نموذج؛ كامل حد بـ خلفية README لـ دقيق.
- **لا يوجد حمل دائم shell**——كل مرة استدعاء كل بدء كل جديد `pwsh -Command`؛ حمل دائم shell مقابل شيء هو [`@deepseek-ai/dsh-tool-pwsh-persistent`](../tool-pwsh-persistent/README.ar.md) ، هو عبر استدعاء إبقاء واحد حسب كل من عزل pwsh تخزين نشط.
- **PowerShell جهة قول اتفاق**——نموذج يجب تحرير كتابة PowerShell(أصلي مسار،`$env:` متغير) ، بينما لا هو bash؛ لا يوجد جهة قول قلب ترجمة.
- **جلسة cwd هوية لم مواصفة تحويل**——workdir أساس دقيق حينئذ هو جلسة رأس جزء cwd أصل مثال، لا مثل bash أداة ذلك مثال بـ صندوق رملي أصل مواصفة تحويل هوية لـ دقيق. في قيد منفذ تحت، سياسة workspace root تأكيد فعلي يتم مواصفة تحويل (من مشترك سياسة خدمة إتمام) ، لذلك عند أصلي جلسة cwd و ذلك مواصفة شكل صيغة مختلف وقت،workdir و قيد أصل ممكن قسم تقاطع——هذا هو دفع متأخر إلى مشترك shell أداة أساس مقعد سحب أخذ مقابل متساو فرق مسافة.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

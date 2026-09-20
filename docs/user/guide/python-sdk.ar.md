# البدء مع Python SDK

[English](python-sdk.md) | العربية

يثبّت هذا الدرس حزمةَ Python SDK المنشورة، ويشغّل الـ profile الأدنى المستقل المشحون، ويعرض كيف تخصّص الـ profile نفسه من `dsh` من برنامجك أنت.

## المتطلبات

- Python 3.10 أو أحدث
- Git
- Linux x64، أو Linux arm64، أو macOS 14 فما فوق على arm64، أو Windows x64
- نقطةُ نهاية واجهة متوافقة مع DeepSeek واعتمادٌ لها
- مساحةُ عمل معزولة ودليلٌ منزلي معزول للإطار

## ثبّت الـ SDK

<div>
<a id="linux-and-macos"></a>
<a id="windows-powershell"></a>
</div>

::: code-group

```sh [Linux/macOS]
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
python -m venv .venv
. .venv/bin/activate
python -m pip install deepseek-harness-sdk
```

```powershell [Windows PowerShell]
git clone https://github.com/deepseek-ai/deepseek-harness.git
Set-Location deepseek-harness
py -3.10 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install deepseek-harness-sdk
```

:::

ويتضمن التثبيتُ عجلةَ وقت تشغيل أصيلة مطابقة والأمرَ `dsh`. ولا يحتاج تشغيلُ SDK المعتاد Node.js في النظام. وعلى مساهمي المستودع الذين يبنون النواتج استعمالُ [مسار عمل مساهمي Python](../../../python/development.ar.md).

## شغّل المثال المودَع

صدّر الاعتماد، وعند الحاجة نقطةَ نهاية وكيل متوافقة:

<div>
<a id="linux-and-macos-1"></a>
<a id="windows-powershell-1"></a>
</div>

::: code-group

```sh [Linux/macOS]
export DEEPSEEK_API_KEY=sk-your-key-here
# export DEEPSEEK_BASE_URL=http://127.0.0.1:8000/v1
```

```powershell [Windows PowerShell]
$env:DEEPSEEK_API_KEY = "sk-your-key-here"
# $env:DEEPSEEK_BASE_URL = "http://127.0.0.1:8000/v1"
```

:::

شغّل مهمةً واحدة بمساري مساحة العمل والدليل المنزلي صريحَين:

<div>
<a id="linux-and-macos-2"></a>
<a id="windows-powershell-2"></a>
</div>

::: code-group

```sh [Linux/macOS]
python python/sdk/examples/minimal.py \
  --workspace /absolute/path/to/disposable-workspace \
  --dsh-home /absolute/path/to/example-dsh-home \
  --session-id example-001 \
  "Inspect the repository and fix the failing tests."
```

```powershell [Windows PowerShell]
python python/sdk/examples/minimal.py `
  --workspace C:\work\disposable-workspace `
  --dsh-home C:\work\example-dsh-home `
  --session-id example-001 `
  "Inspect the repository and fix the failing tests."
```

:::

ويطبع النصُّ استجابةَ المساعد النهائية. ويتلقى الدليلُ المنزلي المختار الـ profile المولَّد `sdk-minimal`، والإضافاتِ المثبَّتة، وسجلاتِ الجلسات بصيغة JSONL غير المضغوطة تحت `sessions/`. ولا يقرأ المثالُ ولا الـ SDK دليلَ `~/.dsh` في صمت أبدًا.

## استعمل الـ SDK في برنامجك

```python
from pathlib import Path

from deepseek_harness import DeepSeekHarness

workspace = Path("/absolute/path/to/disposable-workspace").resolve()
dsh_home = Path("/absolute/path/to/example-dsh-home").resolve()
with DeepSeekHarness(
    provider="deepseek-official",
    model="deepseek-v4-flash",
    max_tokens=49_152,
    cwd=str(workspace),
    dsh_home=str(dsh_home),
    profile="sdk-minimal",
) as harness:
    result = harness.run(
        "Inspect the repository and fix the failing tests.",
        session_id="example-001",
    )

print(result.final_response)
```

ويُقلع الـ SDK عمليةَ `dsh --profile sdk-minimal` المحزومة كسولًا ويعيد استعمالها حتى الخروج من مدير السياق. ويؤلّف الـ profile وpatch الدائم الخاص به وpatch الدليل المنزلي وأيُّ صفّ `patches` مرتَّب إعدادَ التطبيق. ولا يوجد ملفُّ وقت تشغيل Python منفصل ولا خيارُ إعداد كامل.

## ثبّت الإضافات أو عرّفها

استعمل `dsh plugin` للاعتماديات ولطبقات حزم التركيب التي ينبغي أن تدوم في هذا الدليل المنزلي:

<div>
<a id="linux-and-macos-3"></a>
<a id="windows-powershell-3"></a>
</div>

::: code-group

```sh [Linux/macOS]
export DSH_HOME=/absolute/path/to/example-dsh-home
dsh --profile sdk-minimal --dump-default-config >/dev/null
dsh plugin --profile sdk-minimal add file:/absolute/path/to/my-plugin-bundle
```

```powershell [Windows PowerShell]
$env:DSH_HOME = "C:\work\example-dsh-home"
dsh --profile sdk-minimal --dump-default-config | Out-Null
dsh plugin --profile sdk-minimal add file:C:/work/my-plugin-bundle
```

:::

ويهيّئ الأمرُ الأول الـ profile المستقل المشحون. ويمرّر الثاني إدارةَ الحزم إلى `pnpm`، ثم يسجّل كلَّ حزمة مثبَّتة تصدّر طبقةَ `dsh.bundle`. وثبّت `pnpm` لأجل أمر الإدارة هذا وحده؛ فإقلاعُ الـ SDK المثبَّت لا يحتاجه. وعدّل `$DSH_HOME/profiles/sdk-minimal/cordis.patch.yml` لتغييرات صفوف دائمة، أو مرّر ملفاتِ patch من Python لتغييرات عند كل إقلاع.

ويصح `profile` آخر حين يتضمن `@deepseek-ai/dsh-sdk-app` أو صفَّ خادم JSON-RPC آخر. وصفوفُ الخادم المفقودة والإضافاتُ التي لا تتحلّل وpatches غير الصالحة تفشل أثناء الإقلاع بدل الرجوع إلى تركيب آخر.

<a id="opt-in-to-str_replace_editor"></a>
### فعّل `str_replace_editor`

يتضمن وقتُ التشغيل المحزوم الأداةَ `str_replace_editor`، لكن `sdk-minimal` يحذفها من شجرة Cordis الافتراضية. ولاستعمالها احفظ هذا الإعداد باسم `editor.patch.yml`؛ فـ `insert` يضيف المحرّرَ ومزوّدَ نظام الملفات الذي يفتقده الـ profile الأدنى معًا:

```yaml
- insert:
    - id: fs-local
      name: '@deepseek-ai/dsh-fs-local'
      config:
        cwd: !!js process.cwd()
    - id: tool-str-replace-editor
      name: '@deepseek-ai/dsh-tool-str-replace-editor'
```

ومرّر `patches=("/absolute/path/to/editor.patch.yml",)` عند بناء `DeepSeekHarness(profile="sdk-minimal", ...)`، أو ضع الـ patch في `$DSH_HOME/profiles/sdk-minimal/cordis.patch.yml` لإعداد دائم. وفي إقلاع وقت التشغيل التالي، تتضمن طلباتُ النموذج `str_replace_editor` بجوار الغلاف الدائم. ويستعمل مزوّدُ نظام الملفات المحلي دليلَ عمل وقت التشغيل للمسارات النسبية؛ وهو، مثل الغلاف الأدنى، لا يحصر الوصولَ في ذلك الدليل. وفي الـ profile المعياري `sdk`، أدرِج صفَّ المحرّر وحده ليستعمل مزوّدَ نظام الملفات والسياساتِ القائمة.

## افهم الـ profile الأدنى

| الخاصية | القيمة |
|---|---|
| توجيه النظام | `DSH_SYSTEM_PROMPT`، وإلا `You are a helpful software engineer assistant.` |
| النموذج في `minimal.py` | `--model`، ثم `DSH_MODEL`، ثم `deepseek-v4-flash` |
| الأداة الموجَّهة إلى النموذج | `bash` دائمة على Linux وmacOS أو `pwsh` على Windows |
| مهلة الغلاف | 300 ثانية |
| سياق وقت التشغيل والضغط | غائبان |
| حفظ الجلسات الدائم | JSONL غير مضغوط تحت `<dsh_home>/sessions` |

وحزمةُ التركيب الوحيدة في الـ profile تدرج الشجرةَ كاملةً فوق جذر فارغ ولا تتضمن `dsh-base`؛ فلا تستطيع أدواتُ profile الأساس اللاحقة الظهورَ ضمنًا. وهي تحتوي بروتوكولَ الـ SDK، ومهايئَ DeepSeek واحدًا مضبوطًا من البيئة، والتنفيذَ المحلي، والحفظَ الدائم؛ بينما تغيب أدواتُ نظام الملفات والإعداداتُ والاعتماداتُ المُدارة وقياسُ OTel عن بُعد وأدواتُ Web والوكلاءُ الفرعيون واكتشافُ التعليمات المحلية والضغط. ويرفع [مساهم سجل جلسات DeepSeek](../../../packages/session/session-log-deepseek/README.ar.md) لواحقَ السجل غير المقبولة كاملةً مع طلبات DeepSeek افتراضيًا؛ فاضبط `session-log-deepseek.enabled: false` في patch الـ profile لتعطيله. وهو يثبّت `danger-full-access`، فيستطيع الغلافُ الدائم الذي تختاره المنصةُ تعديلَ أي مسار يراه وقتُ التشغيل؛ فاستعمل نسخةَ عمل قابلة للإسقاط أو حاوية.

ولا تزال العجلةُ المثبَّتة تحزم profile الـ `web` كاملًا وأصولَ الواجهة. فشغّل `dsh web` مقابل `DSH_HOME` صريح حين يحتاج نشرُ Python SDK تطبيقَ المتصفح أيضًا؛ فـ `web` تطبيقُ CLI منفصل ولا يستطيع خدمةَ عميل Python SDK.

واستعمل دليلًا منزليًا جديدًا حين يجب عزلُ الـ profiles والإضافات والاعتمادات والإعدادات والجلسات. واستعمل معرّفَ جلسة جديدًا للعمل المستقل؛ ولا تعِد استعمال إطار ودليل منزلي ومعرّف إلا لمتابعة المحادثة الدائمة نفسها والموارد التي تملكها الجلسة.

ويملك [مرجع حزمة التركيب](../../../packages/bundle/sdk-minimal/README.ar.md) الشجرةَ بعينها، ويملك [مرجع المثال](../../../python/sdk/examples/README.ar.md) البرنامجَ القابل للتشغيل. ويغطي [مرجع Python SDK](../../../python/sdk/README.ar.md) دورةَ الحياة والنتائجَ والإشعاراتِ والسلوكَ منخفض المستوى؛ ويغطي [مرجع واجهة dsh](../../../apps/cli/reference/README.ar.md) طبقاتِ الـ profiles.

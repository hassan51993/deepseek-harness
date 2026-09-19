# Python SDK دخول باب

[English](python-sdk.md) | العربية

هذا تعليم مسار تثبيت قد إصدار Python SDK، تشغيل مع مرفق مستقل أقصى بسيط profile، و شرح مثل أي من ذاتي ذات برنامج ذاتي تعريف نفس عدد `dsh` profile.

## قبل وضع شرط

- Python 3.10 أو أكثر عال إصدار
- Git
- Linux x64،Linux arm64،arm64 فوق macOS 14 أو أكثر عال إصدار، أو Windows x64
- DeepSeek توافق API endpoint و اعتماد
- عزل workspace و عزل Harness home

## تثبيت SDK

<div>
<a id="linux-و-macos"></a>
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

تثبيت محتوى يتضمن مطابقة أصلي وقت التشغيل wheel و `dsh` أمر. عادي SDK تشغيل لا حاجة نظام Node.js. حاجة بناء ناتج مستودع مساهمة من ينبغي استخدام [Python مساهمة من سير العمل](../../../python/development.ar.md).

## تشغيل فحص دخول عرض مثال

تصدير اعتماد؛ استخدام توافق بديل إدارة وقت مجددا ضبط endpoint:

<div>
<a id="linux-و-macos-1"></a>
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

استخدام صريح workspace و home مسار تشغيل واحد مهمة:

<div>
<a id="linux-و-macos-2"></a>
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

نص برمجي سوف ضرب طبع نهائي assistant استجابة. الذي اختيار home سوف حفظ توليد `sdk-minimal` profile، قد تثبيت إضافة، و `sessions/` تحت لم ضغط JSONL جلسة سجل. عرض مثال و SDK أبدا سوف ساكن صامت قراءة `~/.dsh`.

## في برنامج في استخدام SDK

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

SDK سوف تأخير متأخر بدء داخل وضع `dsh --profile sdk-minimal` عملية، و إعادة استخدام إلى سياق إدارة جهاز خروج.Profile، ذلك حمل دائم patch،home patch و أي لديه ترتيب `patches` tuple مشترك نفس مجموعة صار تطبيق إعداد. لا وجود مستقل Python وقت التشغيل bin أو كامل إعداد خيار.

## تثبيت أو تعريف إضافة

حاجة في هذا home في حمل دائم حفظ اعتماد و bundle طبقة وقت، استخدام `dsh plugin`:

<div>
<a id="linux-و-macos-3"></a>
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

رقم واحد أمر ابتدائي تحويل مع مرفق مستقل profile. ثاني عدد أمر يأخذ حزمة إدارة تحويل إرسال إعطاء `pnpm`، لكن بعد سجل كل تصدير `dsh.bundle` طبقة قد تثبيت حزمة. فقط لديه تنفيذ هذا إدارة أمر وقت عندئذ حاجة تثبيت `pnpm`؛ بدء قد تثبيت SDK لا حاجة هو. حمل دائم بند إعداد تغيير ينبغي تحرير `$DSH_HOME/profiles/sdk-minimal/cordis.patch.yml`؛ مفرد مرة بدء تغيير فإن من Python نقل دخول patch ملف.

آخر عدد `profile` فقط لديه يتضمن `@deepseek-ai/dsh-sdk-app` أو آخر عدد JSON-RPC server بند إعداد وقت عندئذ صالح. ناقص server بند إعداد، لا يمكن تحليل إضافة و غير قاعدة patch سوف في بدء وقت فشل، لن رجوع إلى أخرى تركيب.

<a id="opt-in-to-str_replace_editor"></a>
### صريح تفعيل `str_replace_editor`

مع مرفق وقت التشغيل يتضمن `str_replace_editor`، لكن `sdk-minimal` افتراضي Cordis tree لا تركيب هو. يلزم استخدام هذا أداة، طلب سوف التالي إعداد حفظ لـ `editor.patch.yml`؛`insert` سوف إضافة editor، و أقصى بسيط profile نقص قليل نظام الملفات خلفية:

```yaml
- insert:
    - id: fs-local
      name: '@deepseek-ai/dsh-fs-local'
      config:
        cwd: !!js process.cwd()
    - id: tool-str-replace-editor
      name: '@deepseek-ai/dsh-tool-str-replace-editor'
```

بنية صنع `DeepSeekHarness(profile="sdk-minimal", ...)` وقت نقل دخول `patches=("/absolute/path/to/editor.patch.yml",)`، أو سوف patch كتابة `$DSH_HOME/profiles/sdk-minimal/cordis.patch.yml` بـ حمل دائم حفظ إعداد. تحت مرة وقت التشغيل بدء بعد، نموذج طلب سوف في حمل دائم shell خارج يتضمن `str_replace_editor`. محلي نظام الملفات خلفية بـ وقت التشغيل عمل دليل تحليل متبادل مقابل مسار؛ و أقصى بسيط shell واحد مثال، هو لن سوف وصول حد في هذا دليل داخل. مقابل في معيار `sdk` profile، فقط إدراج دخول editor بند إعداد، يجعل هو استخدام قد لديه نظام الملفات خلفية و سياسة.

## إدارة حل أقصى بسيط profile

| خاصية | قيمة |
|---|---|
| توجيه النظام | `DSH_SYSTEM_PROMPT`، لم ضبط وقت لـ `You are a helpful software engineer assistant.` |
| `minimal.py` نموذج | `--model`، لكن بعد هو `DSH_MODEL`، الأكثر بعد هو `deepseek-v4-flash` |
| موجه إلى نموذج أداة | Linux/macOS فوق حمل دائم `bash` أو Windows فوق `pwsh` |
| Shell مهلة | 300 ثانية |
| وقت التشغيل سياق و compaction | لا وجود |
| جلسة حفظ دائم | `<dsh_home>/sessions` تحت لم ضغط JSONL |

هذا profile وحيد تركيب حزمة سوف في فارغ أصل لـ فوق إدراج دخول كامل إعداد شجرة، كما لا يتضمن `dsh-base`، لذلك أساس أساس profile بـ بعد إضافة جديدة أداة لن خفي صيغة ظهور. هو يتضمن SDK بروتوكول، واحد من بيئة إعداد DeepSeek مهايئ، محلي تنفيذ و حفظ دائم؛ نظام الملفات أداة،settings، حمل إدارة اعتماد،OTel بعيد قياس،Web أداة،subagent، محلي إشارة أمر اكتشاف و compaction متساو لا وجود.[DeepSeek جلسة سجل مساهمة جهاز](../../../packages/session/session-log-deepseek/README.ar.md) افتراضي مع DeepSeek طلب فوق نقل كامل لم قبول سجل بعد لاحقة؛ في profile patch في ضبط `session-log-deepseek.enabled: false` يمكن سوف ذلك إغلاق. هو ثابت استخدام `danger-full-access`، لذلك حسب منصة اختيار حمل دائم shell يمكن تعديل وقت التشغيل مرئي أي مسار؛ ينبغي استخدام مرة صفة checkout أو حاوية.

قد تثبيت wheel ما زال سوف تحزيم كامل `web` profile و قبل طرف ناتج. إذا Python SDK نشر أيضا حاجة متصفح تطبيق، طلب إبرة مقابل صريح `DSH_HOME` تشغيل `dsh web`؛`web` هو مستقل CLI تطبيق، لا يستطيع لـ Python SDK client توفير خدمة.

حاجة عزل profile، إضافة، اعتماد، ضبط و جلسة وقت، ينبغي استخدام جديد home. مستقل عمل ينبغي استخدام جديد session id؛ فقط لديه متابعة نفس مقطع حمل دائم محادثة و جلسة مورد وقت، عندئذ معا إعادة استخدام harness،home و id.

[تركيب حزمة مشاركة اعتبار](../../../packages/bundle/sdk-minimal/README.ar.md) تعريف تأكيد قطع إعداد شجرة،[عرض مثال مشاركة اعتبار](../../../python/sdk/examples/README.ar.md) تعريف يمكن تشغيل برنامج.[Python SDK مشاركة اعتبار](../../../python/sdk/README.ar.md) وسيط تعريف دورة الحياة، نتيجة، إشعار و قاع طبقة سلوك؛[dsh CLI مشاركة اعتبار](../../../apps/cli/reference/README.ar.md) وسيط تعريف profile قسم طبقة.

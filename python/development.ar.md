# Python مساهمة من سير العمل

[English](development.md) | العربية

أصل حسب الذي يحتاج مساهمة من صار نتيجة اختيار سير العمل: بناء وقت التشغيل ناتج، تحقق SDK، من شفرة المصدر تشغيل أو بناء توزيع حزمة. حزمة سلوك قسم آخر رؤية [SDK مشاركة اعتبار](sdk/README.ar.md) و[وقت التشغيل تحميل جسم مشاركة اعتبار](sdk-runtime/README.ar.md).

## بناء وقت التشغيل ناتج

كل منصة يمكن تنفيذ ملف هو بناء ناتج، لا فحص دخول git. طلب في مستودع أصل دليل تشغيل بناء:

```sh
pnpm install
pnpm exec tsx scripts/build-exe-for-python-sdk.ts
```

الذي يحتاج `lib/` ناتج قد وجود وقت استخدام `--skip-build`؛ مثل يحتاج اختيار منصة، طلب استخدام `--targets=node24-linux-x64,node24-linux-arm64,node24-macos-arm64,node24-macos-x64,node24-win-x64`. كل هدف كل ينبغي في ذلك أصلي هيكل بنية فوق بناء. ناتج كتابة `dist-exe/`، نص برمجي سوف سوف الذي اختيار تحميل جسم تزامن إلى `python/sdk-runtime/`.Windows سوف توليد `.exe` و `-rg.exe`؛macOS بناء أيضا سوف تزامن `node-pty` الذي يحتاج إعداد طقم spawn مساعد مساعدة برنامج.

## تحقق SDK

طلب سوف وهمي محاكاة بيئة وضع في `python/` خارج، تثبيت اختبار مجموعة، لكن بعد تشغيل Python اختبار طقم عنصر:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/tmp/py-sdk-venv"
uv sync --project python/sdk --group test
uv run --project python/sdk pytest
```

`python/sdk/tests/test_bundled_runtime.py` سوف تشغيل متاح داخل وضع تحميل جسم؛ بعض عدد تحميل جسم ناتج بعد لم بناء وقت، سوف قفز مرور هذا تحميل جسم. مستودع درجة اختبار سياسة سياسة رؤية [اختبار](../docs/testing.ar.md).

هذا طقم عنصر موجه إلى هو زائف صنع وقت التشغيل مقابل طرف.`scripts/smoke-python-runtime.py` موجه إلى تحزيم وقت التشغيل.`python-runtime` CI مهمة في سحب أخذ طلب فوق بناء Linux x64 و Windows x64، في master دفع إرسال فوق بناء Linux arm64 و اثنان نوع macOS هيكل بنية. كل اختيار تحديد هدف يأخذ مطابقة SDK wheel حزمة و وقت التشغيل wheel حزمة تثبيت دخول جديد Python 3.10 وهمي محاكاة بيئة، في checkout خارج صاف حذف `PYTHONPATH` و `DSH_RUNTIME_MODE` بعد تشغيل، إثبات اثنان عدد وحدة و يمكن تنفيذ ملف كل قدوم ذاتي هذه distribution، لكن بعد تشغيل الكل keyless مشهد. تجمع تركيز محلي شفرة المصدر SDK تشغيل يمكن اختيار واحد قد بناء يمكن تنفيذ ملف و مشهد:

```sh
uv run --project python/sdk python scripts/smoke-python-runtime.py \
  --scenario sdk-minimal --exe dist-exe/deepseek-harness-sdk-runtime-macos-arm64
```

منها أربعة عدد مشهد سوف مقارنة مقابل `scripts/snapshots/python-sdk-single-exe/` تحت قد إيداع مدة نظر إخراج.`minimal/model-visible.json` ثابت Linux/macOS `sdk-minimal` profile الذي تجميع توجيه النظام، مقابل خارج عام نشر أداة schema و نموذج مرئي رسالة؛`minimal/win-x64/model-visible.json` ثابت مقابل PowerShell إصدار. لذلك، إضافة واحد حالما مساهمة خروج حساب تخطيط خارج نظام قسم مقطع أو user رسالة، هذا مهمة أي فشل، كما هذا profile إرسال خروج كل بند رسالة كل سوف مشاركة و مقارنة مقابل.`advanced/` عبر كل هدف ثابت واحد تكرار مختلط عملية SDK نتيجة و أب/فرعي جلسة سجل.`restart/` إبرة مقابل نفس حفظ دائم أصل دليل بدء اثنان عدد كامل SDK وقت التشغيل عملية، و عبر كل هدف ثابت ذلك ذاك هذا عزل نموذج تاريخ، عال طبقة نتيجة و مستقل حمل دائم سجل.`sdk-minimal-in-history` إعادة استخدام حمل دائم shell و تحرير جهاز مشهد، و في أول مرة shell استدعاء نجاح بعد أكثر تعديل واحد قسم مقطع.`minimal-in-history/prompt-history.json` ثابت اثنان عدد نص التوجيه إصدار، لاحق طلب في ثابت أول بند نص التوجيه، إلحاق SDK system-message حدث و `request/context.systemPromptUpdate`؛ أداة schema إبقاء ثابت، و مستقل فحص تحرير جهاز إنشاء ملف. إعادة تشغيل مقابل مشهد وقت إضافة فوق `--update-snapshots`، و في إيداع قبل مراجعة قراءة هذا فرق مختلف.

يمكن معلومة سحب أخذ طلب و master دفع إرسال أيضا سوف في كل منها اختيار تحديد أصلي هدف فوق تشغيل `--scenario sdk-live --installed-wheel`. هذا مشهد موجه إلى `https://api.deepseek.com` تنفيذ اثنان عدد استخدام أداة جولة: قيام أي فحص قد إنشاء ملف، سوف ذلك محتوى استبدال لـ فقط مضيف معرفة طريق مع آلة انتقاء حرب قيمة، و اشتراط ثاني جولة سوف تغيير بعد محتوى نسخ إلى كل جديد عودة تنفيذ ملف، كما لا تعديل مصدر ملف. اثنان عدد جولة كل يجب إتمام، إرجاع دقيق مراقبة جندي جواب سجل و من نموذج طلب استدعاء أداة؛ ملف عبر خارجي تدريجي بايت مقارنة مقارنة تحقق. مستودع مفتاح ناقص وقت فشل، بينما لا هو ذاتي سطر skip.Fork و Dependabot سحب أخذ طلب سوف تشغيل كامل keyless تثبيت بعد wheel مسار، لكن لن نيل نيل مفتاح.

تفاعل صيغة خطر دخان اختبار حاجة بيئة متغير أو مستودع أصل دليل `.env` في وجود `DEEPSEEK_API_KEY`:

```python
from deepseek_harness import DeepSeekHarness

with DeepSeekHarness(dsh_home="/absolute/path/to/test-dsh-home") as harness:
    print(harness.run("say hi").final_response)
```

أيضا يمكن توجيه خروج غير فارغ `DSH_HOME`.SDK سوف رفض ممكن ساكن صامت استخدام `~/.dsh` بدء.

## إبرة مقابل Node شفرة المصدر تشغيل

مستودع مساهمة من يمكن اختيار التالي مهمة واحد تطوير مسار؛ اثنان من كل تنفيذ عادي `dsh --profile sdk` بدء جهاز:

- ضبط `DSH_RUNTIME_MODE=node`، في نظام Node `>=22.19` فوق استخدام قد بناء Node تحميل جسم. بناء نص برمجي سوف تحديث جديد هذا تحميل جسم، لكن توزيع شيء أبدا سوف يتضمن أو تلقائي اختيار هو.
- سوف `dsh_bin` ضبط لـ قد بناء `apps/cli/lib/bin.js` قطعا مقابل مسار، مباشر تحقق حالي checkout CLI. طلب صريح توفير `dsh_home`، و حسب يحتاج توفير `profile` و لديه ترتيب `patches`.

`python/sdk/tests/manual_sdk_agent_smoke.py` استخدام داخلي `_launch_args` اختبار مهايئ، عبر tsx تحقق لم بناء TypeScript CLI. عام SDK لحظة معنى لا توفير مهمة معنى argv استبدال.

## بناء توزيع حزمة

أصل دليل `package.json` إصدار هو اثنان عدد Python توزيع حزمة مرجعي إصدار. مؤقت تخزين نص برمجي سوف سوف هذا إصدار حقن اثنان عدد wheel حزمة، و سوف SDK ثابت إلى نفس إصدار `deepseek-harness-runtime-bin`.

صاف SDK wheel حزمة فقط يحتاج بناء مرة؛ كل أصلي منصة قسم آخر بناء واحد وقت التشغيل wheel حزمة:

```sh
version="$(python - <<'PY'
import runpy

release = runpy.run_path("scripts/build-python-release.py")
print(release["pep440_version"](release["repository_version"]()))
PY
)"
python scripts/build-python-release.py --package sdk --output-dir dist-python
python scripts/build-python-release.py --package runtime --platform macos-arm64 --runtime-exe dist-exe/deepseek-harness-sdk-runtime-macos-arm64 --output-dir dist-python
pip install \
  "dist-python/deepseek_harness_sdk-$version-py3-none-any.whl" \
  "dist-python/deepseek_harness_runtime_bin-$version-py3-none-macosx_14_0_arm64.whl"
```

وقت التشغيل توزيع حزمة فقط توفير wheel حزمة. إصدار خط الإنتاج سوف وصل نفس صاف SDK wheel حزمة واحد بدء إصدار خمسة عدد منصة wheel حزمة:Linux x64،Linux arm64،macOS 14 أو أكثر عال إصدار arm64 و x64، و Windows x64(`win_amd64`). فقط لديه و مستودع إصدار مطابقة وقت، عندئذ قبول `python-v<repository-version>` وسم؛`0.0.1-rc.1` لـ صنف مستودع مسبق إصدار إصدار في wheel حزمة ملف اسم و بيانات وصفية في استخدام مواصفة تحويل PEP 440 كتابة قاعدة، مثال مثل `0.0.1rc1`.

## تحقق مرشح إرسال سطر إصدار

يد حركة تشغيل GitHub `Release (Python)` سير العمل و ضبط `publish=false`، يكفي بناء الكل ستة عدد wheel حزمة، في Python 3.10 و 3.14 فوق تثبيت Linux إرسال سطر تجميع دمج، فحص دقيق ملف اسم و بيانات وصفية، تنفيذ PyPI افتراضي مفرد ملف كبير صغير حد، و إبقاء واحد نسخة حمل SHA-256 ها أمل تجميع مجموع ناتج. هذا تشغيل لا يوجد سجل التسجيل اعتماد،dry-run تشغيل لا يمكن دخول أي إصدار عمل عمل.

عام إصدار من خاص تلقائي تحويل مستودع تشغيل. حزمة بيانات وصفية إشارة نحو مستقل فقط قراءة عام شفرة المصدر مرآة مثل، هذا مرآة مثل لا تشغيل إصدار Actions. خاص مستودع يأخذ مستودع متغير `PYPI_PUBLISHER_REPOSITORY` تعريف لـ ذاته `owner/name`، و كما فقط في متعمد إصدار خلال يأخذ `PUBLIC_PYPI_RELEASE_ENABLED` من `false` تعديل لـ `true`.

مستقل وقت التشغيل و SDK عمل عمل جعل SDK فوق نقل فشل بعد يمكن متابعة تنفيذ، بينما بلا حاجة إعادة إرسال غير ممكن تغيير وقت التشغيل ملف. فقط لديه سير العمل من إعداد إصدار مستودع، مطابقة `python-v*` وسم تشغيل، كما تلقي حفظ حماية `pypi-runtime` و `pypi` بيئة قسم آخر دفعة دقيق وقت التشغيل و SDK عمل عمل وقت، عندئذ قبول `publish=true`.PyPI Trusted Publishing ما زال سوف توفير قصير مدة OIDC اعتماد، لكن عام attestation سوف كشف كشف خاص إصدار مستودع هوية، لذلك سوف ذلك منع استخدام.

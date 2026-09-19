# Python SDK عرض مثال

[English](README.md) | العربية

أساس في وحيد تطبيق بدء جهاز `dsh --profile sdk-minimal` يمكن تشغيل Python SDK عرض مثال.Python عميل مسؤول JSON-RPC stdio؛profile مسؤول agent(ذكي جسم) تركيب، حفظ دائم، تنفيذ سياسة و إضافة.

## تشغيل أقصى بسيط agent

تثبيت `deepseek-harness-sdk`، توجيه خروج نموذج اعتماد، لكن بعد توفير عزل Harness home و workspace:

```sh
export DEEPSEEK_API_KEY=sk-your-key-here
python python/sdk/examples/minimal.py \
  --dsh-home /absolute/path/to/example-dsh-home \
  --workspace /absolute/path/to/disposable-workspace \
  --session-id example-001 \
  "Inspect the repository and fix the failing tests."
```

مثل يحتاج استخدام توافق بديل إدارة، طلب ضبط `DEEPSEEK_BASE_URL`؛ يمكن عبر `DSH_MODEL` ضبط نص برمجي افتراضي نموذج، عبر `DSH_SYSTEM_PROMPT` إشارة تحديد نشر زاوية لون ضبط تحديد.`--model` هو وحيد وقت التشغيل نموذج اختيار، لا اشتراط مطابقة بيئة متغير؛`--profile` يمكن اختيار آخر عدد توفير SDK خدمة profile. الذي اختيار home حفظ توليد `sdk-minimal` profile، و في `sessions/` تحت حفظ لم ضغط JSONL جلسة سجل؛ نص برمجي أبدا سوف خفي صيغة قراءة `~/.dsh`.

مع مرفق [`@deepseek-ai/dsh-sdk-minimal` تركيب حزمة](../../../packages/bundle/sdk-minimal/README.ar.md) هو هذا نمط كامل كما صريح Cordis إعداد شجرة. هو فقط كشف:

- Linux/macOS فوق كل من أثر مجال داخل حمل دائم `bash`، أو Windows فوق `pwsh`

هذا تركيب حزمة لا يتضمن `dsh-base`، لذلك كل واحد إضافة جديدة بند إعداد كل هو صريح profile تغيير. وقت التشغيل سياق، نظام الملفات أداة، محلي إشارة أمر اكتشاف، ضغط (compaction) ، ضبط، حمل إدارة اعتماد، بعيد قياس،Web أداة،subagent و كامل افتراضي أداة بيان متساو لا وجود. إعداد شجرة إبقاء SDK بدء و JSON-RPC خدمة، واحد من بيئة إعداد DeepSeek مهايئ، محلي تنفيذ و JSONL حفظ دائم.

حمل دائم PTY يمكن تعديل وقت التشغيل عملية يمكن وصول أي مسار، لذلك فقط ينبغي في مرة صفة checkout أو حاوية في استخدام.

## إضافة إضافة

مقابل نفس عدد صريح home استخدام وقت التشغيل wheel حزمة توفير `dsh` أمر، بـ إجراء حمل دائم profile تغيير:

```sh
export DSH_HOME=/absolute/path/to/example-dsh-home
dsh plugin --profile sdk-minimal add file:/absolute/path/to/my-plugin-bundle
```

في هذا أمر في استخدام `sdk-minimal` يمكن توسيع هذا عرض مثال، استخدام `sdk` فإن توسيع أساس في كامل base SDK profile.Python استدعاء أيضا يمكن في `patches=(...)` في نقل دخول أكثر كثير قطعا مقابل patch مسار؛ بعد وجه ملف أولوية. الذي اختيار profile يجب إبقاء `@deepseek-ai/dsh-sdk-app` أو آخر عدد JSON-RPC server بند إعداد. هذا عرض مثال لا قبول كامل Cordis ملف أو مهمة معنى عملية argv.

نفس عدد وقت التشغيل wheel حزمة أيضا تحزيم توفير مباشر CLI(أمر سطر واجهة) استخدام `web` profile و ذلك قبل طرف ناتج:`dsh web` سوف بدء هذا عدد مستقل تطبيق.Python SDK عميل لا يستطيع اختيار `web`، لأن منها لا يوجد JSON-RPC خادم بند إعداد.

آخر رؤية [Python SDK تعليم مسار](../../../docs/user/guide/python-sdk.ar.md) و [SDK مشاركة اعتبار](../README.ar.md).

# DeepSeek Harness Python SDK

[English](README.md) | العربية

لأجل عبر stdio فوق حسب سطر قسم فصل JSON-RPC قيادة DeepSeek Harness Python عملية فرعية SDK. تثبيت `deepseek-harness-sdk` وقت، سوف معا تثبيت حالي منصة فوق إصدار تماما نفسه `deepseek-harness-runtime-bin` wheel حزمة.

```sh
python -m pip install deepseek-harness-sdk
```

## بدء وقت التشغيل

Python SDK لا يوجد مستقل تطبيق مدخل. هو بـ `--profile sdk` بدء داخل وضع `dsh` CLI(أمر سطر واجهة) ؛ الذي اختيار profile مسؤول JSON-RPC خادم،agent(ذكي جسم) تركيب، اعتماد، حفظ دائم، أداة و إغلاق مسار.

كل مرة بدء كل يجب صريح إشارة تحديد Harness home. طلب نقل دخول `dsh_home`، أو في عملية فرعية بيئة في توفير غير فارغ `DSH_HOME`.SDK لحظة معنى لن اكتشاف `~/.dsh`.

```py
from deepseek_harness import DeepSeekHarness

with DeepSeekHarness(
    dsh_home="/absolute/path/to/isolated-dsh-home",
    cwd="/absolute/path/to/workspace",
    provider="deepseek-official",
    model="deepseek-v4-flash",
    reasoning_effort="max",
    max_tokens=49_152,
) as harness:
    result = harness.run("Say hi.", session_id="example-001")

print(result.final_response)
```

`DeepSeekHarness` تأخير متأخر بدء وقت التشغيل، و في استدعاء `close()` أو خروج سياق إدارة جهاز قبل إعادة استخدام هذا عملية. أول مرة profile إمساك يد عبر `initialize_timeout_seconds` استخدام مستقل 30 ثانية افتراضي حد أعلى؛ عادي جولة في لم ضبط `request_timeout_seconds` وقت ما زال لا ضبط حد أعلى. مهلة تشخيص سوف إشارة واضح الذي اختيار profile، و يتضمن إبقاء وقت التشغيل تشخيص.`cwd` هو agent workspace؛`runtime_cwd` مستقل اختيار عملية فرعية عمل دليل. اثنان من كل سوف في بدء قبل تحويل صار قطعا مقابل مسار.`provider`،`model`، اختياري `reasoning_effort` و اختياري صحيح كامل عدد `max_tokens` عبر JSON-RPC ابتدائي تحويل إرسال.`base_url` و `api_key` سوف صريح تغطية عملية فرعية بيئة في `DEEPSEEK_BASE_URL` و `DEEPSEEK_API_KEY`.

## ذاتي تعريف إضافة

حمل دائم ذاتي تعريف يخص `dsh` profile. استخدام وقت التشغيل wheel حزمة توفير `dsh` أمر ابتدائي تحويل مع مرفق SDK profile، و تثبيت خارجي bundle:

```sh
export DSH_HOME=/absolute/path/to/isolated-dsh-home
dsh --profile sdk --dump-default-config >/dev/null
dsh plugin --profile sdk add file:/absolute/path/to/my-plugin-bundle
```

`file:` شكل صيغة سوف يأخذ محلي bundle تثبيت إلى profile حزمة شجرة في، جعل ذلك peer import يمكن وصول داخل وضع تثبيت بعد تجهيز.profile manifest(بيانات وصفية بيان) سوف سجل قد تثبيت اعتماد و لديه ترتيب bundle طبقة؛`$DSH_HOME/profiles/sdk/cordis.patch.yml` هو حمل دائم مستخدم patch. فقط لديه إدارة خارجي حزمة وقت،`dsh plugin` عندئذ حاجة `pnpm`. تشغيل SDK لا حاجة نظام Node.js.

مقابل في مفرد مرة استدعاء تغيير، يمكن نقل دخول واحد أو كثير عدد patch ملف. هو جمع سوف تحويل صار قطعا مقابل مسار، و في profile طبقة و home patch طبقة بعد حسب ترتيب نقل إعطاء CLI:

```py
with DeepSeekHarness(
    dsh_home="/absolute/path/to/isolated-dsh-home",
    profile="sdk",
    patches=("/absolute/path/to/first.patch.yml", "/absolute/path/to/last.patch.yml"),
) as harness:
    result = harness.run("Make the requested code change.")
```

`profile` يمكن اختيار آخر عدد قد وجود profile، لكن هذا تركيب يجب إبقاء `@deepseek-ai/dsh-sdk-app` أو آخر عدد `@deepseek-ai/dsh-sdk-jsonrpc-server` بند إعداد. إعداد خطأ سوف في CLI بدء أو SDK ابتدائي تحويل وقت فشل؛ لا وجود كامل إعداد رجوع.`dsh_bin` يمكن اختيار آخر عدد `dsh` يمكن تنفيذ برنامج، معا إبقاء نفسه profile لغة قاعدة. مهمة معنى argv استبدال فقط هو داخلي fake-runtime اختبار مهايئ، لا يخص عام API.

`provider` اختيار إشارة تحديد Cordis تركيب الذي تسجيل مزود توجيه؛`model` هو هذا مهايئ تحليل خروج نموذج ID.`reasoning_effort` هو هذا تأكيد قطع توجيه اختياري غير فارغ مهايئ ذاتي لديه معرف رمز؛ حذف وقت إبقاء نموذج ذاته قيمة افتراضية.`max_tokens` هو واحد اختياري صحيح كامل عدد، لأجل حد أصل agent و ذلك عملية داخل بعد بديل في كل مرة طلب في إخراج token عدد كمية؛ حذف هذا معامل وقت، من مزود افتراضي سلوك قرار إخراج حد أعلى. نقص قليل مهايئ، نموذج غير ممكن استخدام أو دفع إدارة قوي درجة لا تلقي دعم حمل وقت، ابتدائي تحويل سوف في نص التوجيه تشغيل قبل رفض. ضغط (compaction) ملخص متابعة استخدام ضغط إضافة مفرد وحيد إعداد حد أعلى. داخل وضع افتراضي تركيب تسجيل `deepseek-official`. ذاتي تعريف تركيب يمكن تركيب `llm-pi-ai`، في منها إعداد كل مزود مخصص تابع اعتماد و طرف نقطة، و اختيار pi-ai قد تثبيت catalog في وجود مهمة معنى مزود/نموذج تركيب.

مع مرفق `sdk-minimal` profile هو مستقل صريح إعداد شجرة، بينما لا هو `dsh-base` فوق overlay. استخدام `profile="sdk-minimal"` اختيار هو؛ عادي `model` معامل هو وحيد وقت التشغيل نموذج اختيار، أيضا ملائم لأجل لا في مهايئ بناء اقتراح دليل في نموذج ID. هو فقط توفير حسب منصة اختيار حمل دائم shell، محلي تنفيذ و JSONL جلسة؛ نظام الملفات أداة، ضبط، حمل إدارة اعتماد، بعيد قياس،Web أداة و كامل افتراضي أداة بيان ما زال من مستقل كامل `sdk` و `web` profile توفير.

## نتيجة و إشعار

`Session.run()` نشط حركة منطقة بين من نص التوجيه يتم حمل دائم inbox استقبال وقت بدء، إلى كامل agent تحت مرة دخول فارغ خامل حالة وقت انتهاء، و إرجاع `RunResult(session_id, final_response, finish_reason, events, notifications)`.`final_response` هو هذا منطقة بين داخل أصل جلسة الأكثر بعد إيداع مساعدة يد نص.`finish_reason` هو الأكثر بعد واحد أصل جلسة `turn/end` `kind`، مثال مثل `completed`،`max-tokens` أو `error`؛ لا يوجد جولة انتهاء وقت لـ `None`. نقص قليل نص `data.reason.kind` `turn/end` مخالفة عكس بروتوكول، و سوف رمي خروج `SdkProtocolError`.

`HarnessClient` سوف في وقت التشغيل عملية كامل دورة الحياة داخل إبقاء قد اكتشاف subagent جدول نظام. في `Session.run()` خلال،`RunResult.notifications` و `on_notification` حسب بروتوكول ترتيب استقبال أصل جلسة و معروف بعد بديل إشعار.`RunResult.events` فقط يتضمن أصل جلسة حدث، لذلك بعد بديل إخراج لن استبدال أصل استجابة. قاع طبقة `session_prompt()` سوف قيام أي إرجاع قد ترتيب طابور رسالة id؛ التفاف مرور `Session.run()` استدعاء جهة ذاتي سطر مسؤول لاحق نشط حركة حد.

الذي اختيار home حفظ profile، إضافة و كل profile ذاتي لديه حمل دائم مورد. كامل `sdk` profile استخدام منها اعتماد، ضبط و جلسة تخزين؛`sdk-minimal` فقط استخدام ذاتي ذات JSONL جلسة تخزين. حاجة عزل هذه مورد وقت ينبغي استخدام جديد home؛ مستقل عمل ينبغي استخدام جديد جلسة ID. معا إعادة استخدام harness و جلسة ID سوف تأخير متابعة حمل دائم محادثة و جلسة مورد.

آخر رؤية [Python تعليم مسار](../../docs/user/guide/python-sdk.ar.md) ،[يمكن تشغيل عرض مثال](examples/README.ar.md) و [وقت التشغيل wheel حزمة مشاركة اعتبار](../sdk-runtime/README.ar.md).

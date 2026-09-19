# اتصال رقم ثلاثة جهة تسجيل ذاكرة MCP خدمة

[English](mcp-memory.md) | العربية

هذا ثلاثة نسخة**افتراضي إغلاق مشاركة اعتبار إعداد**عبر [`@deepseek-ai/dsh-mcp-client`](../../../packages/mcp/mcp-client/README.ar.md) سوف واحد تسجيل ذاكرة نظام اتصال إلى DSH. طلب اختيار منها واحد نسخة، أو نسخ نفسه عام MCP بند إعداد قدوم اتصال أخرى خادم.

هذه رقم ثلاثة جهة إعداد فقط بصفة متبادل عملية مشاركة اعتبار؛ استلام تسجيل لا بديل جدول DeepSeek إقرار يمكن، دفع ترشيح، دمج عمل علاقة أو حمل متابعة دعم حمل تحمل وعد.

## DSH مسؤول ماذا

DSH تحليل اختيار في Cordis overlay، بدء قد إعداد stdio أمر أو اتصال قد إعداد Streamable HTTP URL، اكتشاف MCP أداة، و بـ `mcp__<serverName>__<tool>` شكل صيغة عام هذه أداة.DSH **لا مسؤول** تحت تحميل خادم، ابتدائي تحويل ذلك قاعدة بيانات، اختيار نموذج أو embedding مزود، إنشاء سحابة طرف حساب مستخدم، ترحيل مزود بيانات، أيضا لا مراقبة إدارة مستقل HTTP خدمة. مقابل في stdio، عام عميل سوف مع DSH إضافة دورة الحياة بدء و إيقاف عملية فرعية؛ مقابل في HTTP، فوق تنقل خدمة يجب قد تشغيل.

stdio جسر وصل جهاز في بدء عملية فرعية قبل سوف رئيسي حركة إزالة بيئة في اسم عبر معتاد يمثل اعتماد متغير و كل `DSH_*` متغير؛ ذلك بقية بيئة متغير ما زال سوف وراثة. كل نسخة عرض مثال فقط إضافة ذلك أساس خط الذي يحتاج تغطية بند. إذا بعض عدد اختياري فوق تنقل وظيفة أيضا حاجة أخرى مفتاح، طلب سوف هذا متغير إضافة إلى بند إعداد `config.env`، لا يلزم يأخذ مفتاح مباشر كتابة دخول YAML.

## اختيار واحد

| نظام | قد اختبار إصدار | نقل طريقة | فوق تنقل قبل وضع شرط |
|---|---:|---|---|
| [Memorix](https://github.com/AVIDS2/memorix) | `memorix@1.3.0`(`500792cad3144142293bfbb20acb4841c9f7fcfa`) | stdio | Node 22.18+، و تنفيذ `npm install --global memorix@1.3.0` |
| [MCP Reference Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) | `@modelcontextprotocol/server-memory@2026.7.4`(`6dd0a683e198783e30feabf7abaf42f925bd18b1`) | stdio | `npm install --global @modelcontextprotocol/server-memory@2026.7.4` |
| [Engram](https://github.com/Gentleman-Programming/engram) | `v1.20.0`(`ba9e46ced152c37a7cb9e576153c41995873e2fc`) | stdio | Go 1.25.10+، و تنفيذ `go install github.com/Gentleman-Programming/engram/cmd/engram@v1.20.0`، أو تثبيت مطابقة إصدار إصدار اثنان دخول صنع ملف |

## تفعيل واحد

سوف واحد نسخة overlay نقل إعطاء DSH:

```sh
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/memorix.cordis.yml"
```

طلب سوف ملف اسم استبدال لـ `mcp-reference-memory.cordis.yml` أو `engram.cordis.yml`. هذا مسار يمكن إشارة نحو مغناطيس قرص مهمة معنى موضع واحد نسخة نسخ ملف. تسليم تركيب لا يتضمن أي تسجيل ذاكرة خادم، لذلك لا نقل `--patch` حينئذ سوف يجعل هذا ثلاثة بند الكل إبقاء إغلاق.

إذا يلزم عبر مرة تشغيل إبقاء الذي اختيار إعداد، طلب سوف مقابل ملف في مفرد عدد `insert` patch دمج إلى مستخدم patch طبقة: فقط مقابل واحد profile توليد فاعلية فإن كتابة `$DSH_HOME/profiles/<name>/cordis.patch.yml`، مقابل هذا آلة كل profile توليد فاعلية فإن كتابة `$DSH_HOME/cordis.patch.yml`. لا يلزم تغطية قد لديه ملف، منها ممكن قد يتضمن غير متصل مستخدم patch.

## مزود ضبط

### Memorix

```sh
npm install --global memorix@1.3.0
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/memorix.cordis.yml"
```

Memorix بلا حاجة LLM(كبير لغة نموذج) أو embedding خدمة، يكفي في محلي بدء إرسال صيغة نمط تحت تشغيل. طلب في Memorix ذاتي ذات `~/.memorix/config.toml` أو مشروع `memorix.toml` في إعداد اختياري مزود. هذا عرض مثال امتداد استخدام DSH عمل دليل في Git مشروع معرف، و استخدام Memorix ذاته افتراضي دليل `~/.memorix/data`. إذا يلزم تغطية هذا دليل، طلب في بدء DSH قبل ضبط `MEMORIX_DATA_DIR`.

### MCP Reference Memory

```sh
npm install --global @modelcontextprotocol/server-memory@2026.7.4
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/mcp-reference-memory.cordis.yml"
```

هذا مشاركة اعتبار خادم تخزين محلي معرفة تعرف رسم جدول، و عام فعلي جسم، علاقة، مراقبة، قراءة، بحث و فتح أداة. هو لا حاجة نموذج أو embedding خدمة. هذا عرض مثال سوف JSONL تخزين في `$HOME/.dsh-mcp-reference-memory.jsonl`، بينما لا هو قد تثبيت npm حزمة دليل في. إذا يلزم تغطية هذا مسار، طلب في بدء DSH قبل ضبط `MEMORY_FILE_PATH`.

بحث فقط مقابل فعلي جسم اسم، نوع و مراقبة إجراء لا منطقة قسم كبير صغير كتابة فرعي نص مطابقة، لا هو دلالة فحص بحث. هذا خادم لا توفير embedding، تلقائي ملخص، اندفاع مفاجئ إزالة حل أو متروك نسيان سياسة.

### Engram

```sh
go install github.com/Gentleman-Programming/engram/cmd/engram@v1.20.0
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/engram.cordis.yml"
```

Engram مسؤول تخزين و مشروع اختيار: هو افتراضي استخدام `~/.engram`، من DSH عمل دليل فحص قياس Git مشروع، و قبول `ENGRAM_DATA_DIR` أو `ENGRAM_PROJECT` بصفة بيئة تغطية بند.

## اختياري مشترك استخدام نموذج إشارة أمر

إذا خادم أداة وصف لا يمكن يمكن اعتماد إطلاق تسجيل ذاكرة استخدام، طلب سوف التالي بسيط قصير، و مزود غير متصل إشارة أمر إضافة إلى أنت قائم نموذج إشارة أمر في:

> مستخدم اشتراط تسجيل إقامة بعض أمر وقت استدعاء تسجيل ذاكرة كتابة أداة؛ تاريخ معلومة ممكن متبادل صلة وقت، فحص بحث تسجيل ذاكرة و استخدام متبادل صلة نتيجة.

هذا فقط هو مرفق إضافة إشارة توجيه. عرض مثال لن استبدال DSH توجيه النظام في persona.

## تحقق كتابة، جديد جلسة استدعاء عودة و استخدام

طلب في كامل مرور مسار في استخدام واحد وحيد قيمة، و إبقاء مزود تخزين نطاق ثابت:

1. في DSH جلسة A في رفع خروج:`Remember that my validation drink is lapsang-<unique suffix>.`. تأكيد نموذج استدعاء مزود كتابة أداة، و كما أداة إرجاع نجاح.
2. في نفس عدد ما زال في تشغيل Host في إنشاء DSH جلسة B. لا يلزم نسخ جلسة A محادثة. رفع خروج:`What is my validation drink? Check memory.`. تأكيد نموذج استدعاء مزود بحث أو استدعاء عودة أداة، و إرجاع هذا قيمة.
3. متابعة في جلسة B في رفع خروج:`Use that preference to suggest one drink for the meeting.`. تأكيد عودة جواب استخدام استدعاء عودة قيمة.

يجب جديد بناء DSH جلسة، لكن لا حاجة إعادة بدء Host.MCP عملية فرعية انهيار انهيار بعد سوف إطلاق حمل تراجع تجنب تلقائي إعادة وصل و أداة إعادة تزامن؛ توقف آلة خلال أداة ما زال إبقاء صف خروج، استدعاء فقط في توقف آلة خلال فشل؛ إعادة وصل ميزانية استهلاك كل بعد أداة سوف يتم ملاحظة إلغاء، إعادة وصل إيقاف، مباشر إلى إعادة تحميل أو إعادة بدء. ابتدائي اكتشاف مرور مسار هو مختلف خطوة، لذلك إرسال رقم واحد بند تحقق نص التوجيه قبل، طلب انتظار مزود `mcp__...` أداة ظهور.

## وصل دخول أخرى MCP خادم

نسخ نفسه بند حقل، و استخدام وحيد `id` و `serverName`:

```yaml
- insert:
    - id: memory-my-server
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: my-memory
        transport: stdio
        command: my-memory-mcp
        args: []
        env: {}
        cwd: !!js process.cwd()
```

مقابل في بعيد مسار خادم، طلب تعديل استخدام `transport: streamable-http`،`url` و `headers`. مزود مخصص تابع تثبيت، هوية، إقرار إثبات، نموذج،embedding، حفظ دائم و سماح يمكن ما زال من مزود مسؤول.

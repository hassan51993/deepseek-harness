# ربط خادم ذاكرة MCP من طرف ثالث

[English](mcp-memory.md) | العربية

تربط هذه **الإعدادات المرجعية الثلاثة المعطَّلة افتراضيًا** نظامَ ذاكرة واحدًا بـ DSH عبر [`@deepseek-ai/dsh-mcp-client`](../../../packages/mcp/mcp-client/README.ar.md). فاختر واحدًا، أو انسخ صفَّ MCP العام نفسه لخادم آخر.

وهذه الإعدادات من أطراف ثالثة أمثلةُ توافقية لا غير. ووجودُها لا يعني إقرارًا ولا توصيةً ولا شراكةً ولا دعمًا مستمرًا من DeepSeek.

## ماذا يفعل DSH

يحلّل DSH طبقةَ Cordis المختارة، ويُقلع أمرَ stdio المضبوط أو يتصل برابط Streamable HTTP المضبوط، ويكتشف أدواتِ MCP، ويكشفها بصيغة `mcp__<serverName>__<tool>`. و**لا** ينزّل DSH الخادمَ، ولا يهيّئ قاعدةَ بياناته، ولا يختار نموذجَه ولا مزوّدَ تضميناته، ولا ينشئ حسابًا سحابيًا، ولا يرحّل بياناتِ مزوّد، ولا يشرف على خدمة HTTP منفصلة. ففي stdio يُقلع العميلُ العامُّ الابنَ ويوقفه بدورة حياة إضافة DSH؛ وفي HTTP يجب أن تكون خدمةُ المنبع عاملةً أصلًا.

ويزيل جسرُ stdio عمدًا المتغيراتِ المحيطة التي تدل أسماؤها عادةً على اعتمادات، وكلَّ متغيرات `DSH_*`، قبل إقلاع الابن؛ وتبقى سائرُ المتغيرات المحيطة موروثة. ولا يضيف كل مثال إلا التجاوزَ الأساسي الذي يحتاجه. وإن احتاجت ميزةُ منبع اختيارية سرًّا آخر، فأضف ذلك المتغير إلى `config.env` في الصف بدل وضع السر في YAML مباشرةً.

## اختر واحدًا

| النظام | الإصدار المثبَّت المختبَر | النقل | متطلب المنبع |
|---|---:|---|---|
| [Memorix](https://github.com/AVIDS2/memorix) | `memorix@1.3.0` (`500792cad3144142293bfbb20acb4841c9f7fcfa`) | stdio | Node 22.18 فما فوق و`npm install --global memorix@1.3.0` |
| [MCP Reference Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) | `@modelcontextprotocol/server-memory@2026.7.4` (`6dd0a683e198783e30feabf7abaf42f925bd18b1`) | stdio | `npm install --global @modelcontextprotocol/server-memory@2026.7.4` |
| [Engram](https://github.com/Gentleman-Programming/engram) | `v1.20.0` (`ba9e46ced152c37a7cb9e576153c41995873e2fc`) | stdio | Go 1.25.10 فما فوق و`go install github.com/Gentleman-Programming/engram/cmd/engram@v1.20.0`، أو الملف الثنائي المقابل من الإصدارات |

## فعّل واحدًا

مرّر طبقةً واحدة إلى DSH:

```sh
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/memorix.cordis.yml"
```

واستبدل اسمَ الملف بـ `mcp-reference-memory.cordis.yml` أو `engram.cordis.yml`. ويجوز أن يشير المسار إلى نسخة في أي موضع على القرص. ولا خادمَ ذاكرة في التركيب المشحون، فحذفُ `--patch` يُبقي الثلاثةَ معطَّلة.

وللإبقاء على الاختيار عبر التشغيلات، ادمج patch الوحيد `insert` من الملف المختار في طبقة patch للمستخدم: في `$DSH_HOME/profiles/<name>/cordis.patch.yml` لـ profile واحد، أو في `$DSH_HOME/cordis.patch.yml` لكل profile على الجهاز. ولا تنسخ فوق ملف قائم: فقد يحتوي patches أخرى للمستخدم لا صلة لها.

## إعداد المزوّدين

### Memorix

```sh
npm install --global memorix@1.3.0
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/memorix.cordis.yml"
```

يعمل Memorix في وضع استدلالي محلي بلا LLM ولا خدمة تضمينات. واضبط المزوّدين الاختياريين في ملف Memorix نفسه `~/.memorix/config.toml` أو في `memorix.toml` في المشروع. ويُبقي المثالُ هويةَ مشروع Git في Memorix من دليل عمل DSH، ويستعمل الافتراضَ `~/.memorix/data` الخاص بـ Memorix. واضبط `MEMORIX_DATA_DIR` قبل إقلاع DSH لتجاوزه.

### MCP Reference Memory

```sh
npm install --global @modelcontextprotocol/server-memory@2026.7.4
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/mcp-reference-memory.cordis.yml"
```

يخزّن هذا الخادمُ المرجعي رسمًا معرفيًا محليًا ويكشف أدواتِ الكيانات والعلاقات والملاحظات والقراءة والبحث والفتح. ولا يحتاج نموذجًا ولا خدمةَ تضمينات. ويخزّن المثالُ ملفَّ JSONL في `$HOME/.dsh-mcp-reference-memory.jsonl` بدل دليل حزمة npm المثبَّتة. واضبط `MEMORY_FILE_PATH` قبل إقلاع DSH لتجاوزه.

والبحثُ مطابقةُ سلسلة فرعية لا تميّز حالة الأحرف على أسماء الكيانات وأنواعها وملاحظاتها، لا استرجاعًا دلاليًا. ولا يضيف الخادمُ تضميناتٍ ولا تلخيصًا تلقائيًا ولا حلًّا للتعارضات ولا سياسةَ نسيان.

### Engram

```sh
go install github.com/Gentleman-Programming/engram/cmd/engram@v1.20.0
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/engram.cordis.yml"
```

يملك Engram التخزينَ واختيارَ المشروع: فهو يستعمل `~/.engram` افتراضيًا، ويكتشف مشروعَ Git من دليل عمل DSH، ويقبل `ENGRAM_DATA_DIR` أو `ENGRAM_PROJECT` تجاوزَين محيطَين.

## تعليمة نموذج مشتركة اختيارية

أضف هذه التعليمةَ القصيرة المحايدة تجاه المزوّدين إلى تعليمات نموذجك القائمة إن لم تُطلق أوصافُ أدوات الخادم استعمالَ الذاكرة بثبات:

> When the user asks you to remember something, call a memory write tool. When historical information may be relevant, search memory and use relevant results.

وهذا إرشادٌ إضافي لا غير. ولا تحل الأمثلةُ محل شخصية توجيه النظام في DSH.

## تحقّق من الكتابة والاسترجاع في جلسة جديدة والاستعمال

استعمل قيمةً فريدة واحدة وأبقِ نطاقَ تخزين المزوّد بلا تغيير طوال ذلك:

1. في جلسة DSH الأولى، اطلب: `Remember that my validation drink is lapsang-<unique suffix>.` وتأكّد أن النموذج استدعى أداةَ الكتابة عند المزوّد وأن الأداة أعادت نجاحًا.
2. أنشئ جلسةَ DSH ثانية في المضيف العامل نفسه. ولا تنسخ محادثةَ الجلسة الأولى. واطلب: `What is my validation drink? Check memory.` وتأكّد أن النموذج استدعى أداةَ البحث أو الاسترجاع عند المزوّد وأعاد القيمة.
3. وفي الجلسة الثانية نفسها، اطلب: `Use that preference to suggest one drink for the meeting.` وتأكّد أن الجواب يستعمل القيمةَ المسترجَعة.

وجلسةُ DSH جديدة لازمة؛ أما إعادةُ تشغيل المضيف فلا. وانهيارُ ابن MCP يُطلق إعادةَ اتصال تلقائية بتراجع تدريجي ومزامنةً للأدوات؛ وتبقى الأدواتُ مدرَجة وتفشل الاستدعاءات أثناء الانقطاع وحده، وبعد استنفاد ميزانية إعادة الاتصال تُلغى تسجيلاتُ الأدوات ويتوقف الاتصال حتى إعادة تحميل أو إعادة تشغيل. والاكتشافُ الأول لاتزامني، فانتظر ظهورَ أدوات `mcp__...` عند المزوّد قبل إرسال أول توجيه تحقق.

## أحضِر خادم MCP آخر

انسخ حقولَ المدخل نفسها واستعمل `id` و`serverName` فريدين:

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

وللخادم البعيد استعمل `transport: streamable-http` و`url` و`headers` بدلًا من ذلك. ويبقى تثبيتُ المزوّد وهويتُه واستيثاقُه ونماذجُه وتضميناتُه وحفظُه الدائم وترخيصُه من مسؤوليته هو.

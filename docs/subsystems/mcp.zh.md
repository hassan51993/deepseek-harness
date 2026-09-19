# MCP

[English](mcp.md) | العربية

## ملخص

نموذج سياق بروتوكول (Model Context Protocol،MCP) يجعل نموذج استخدام خارجي خادم توفير أداة. كل قد إعداد خادم كل سوف توفير عادي Harness أداة، دعم حمل إلغاء، إذن فحص، نتيجة سجل و تلقي دعم حمل رسم مثل إخراج. استدعاء جهة أثر مجال في إعداد خادم وقت، مشترك أداة مسؤول اكتشاف و قراءة مورد، خادم إشارة أمر فإن إضافة دخول قد سجل توجيه النظام. رسمي جهة SDK تنسيق تجارة الآن بديل أو تلقي دعم حمل قديم إصدار بروتوكول. هذا مشاركة اعتبار صفحة وسيط تعريف MCP حزمة مجموعة مسؤولية، أثر مجال و تركيب اختيار؛ خادم إعداد من[عميل README](../../packages/mcp/mcp-client/README.zh.md) صيانة.

## دليل

- [إعداد](#configuration)
- [مسؤولية و أثر مجال](#responsibilities-and-scope)
- [بروتوكول و نتيجة](#protocol-and-results)
- [مورد و إشارة أمر](#resources-and-instructions)
- [مورد مزود نوع](#resource-provider-types)
- [حد](#limits)
- [تأخير امتداد قراءة قراءة](#further-reading)

-----

<a id="configuration"></a>
## إعداد

MCP خادم حاجة رئيسي حركة إعداد. في هدف Cordis أثر مجال في، لـ كل منصة خادم إعداد واحد `@deepseek-ai/dsh-mcp-client` بند. كل مع مرفق profile كل توفير[أداة سجل التسجيل](tools.zh.md) ، و موحد واحد تركيب مشترك مورد خدمة مرة؛ مستخدم فقط يحتاج إعداد عميل بند. استدعاء جهة لا يوجد مرئي قد إعداد خادم وقت، في native أو PTC نمط تحت كل لن نيل نيل MCP نص التوجيه نص أو أداة.

| اختيار | إعداد صيانة موضع |
|---|---|
| خادم هوية، محلي عملية أو HTTP طرف نقطة، اعتماد و عملية بيئة | [عميل إعداد](../../packages/mcp/mcp-client/README.zh.md#use-this-package) |
| أداة و مورد طلب مهلة، بدء فشل سياسة و إعادة وصل | [عميل إعداد](../../packages/mcp/mcp-client/README.zh.md#use-this-package) |
| مورد اكتشاف و قراءة | مع مرفق profile قد يتضمن [MCP مورد خدمة](../../packages/mcp/mcp-resources/README.zh.md#use-this-package) ؛ هذا خدمة لا يوجد إعداد حقل |
| خادم إشارة أمر كبير صغير حد | عميل `maxInstructionBytes`؛ تركيب توفير[توجيه النظام تركيب إعداد](system-prompt.zh.md) |
| إذن قرار و تلقي دعم حمل رسم مثل إخراج | [أداة تنفيذ](tools.zh.md) و[مرفق عنصر](attachment.zh.md) |

بروتوكول تنسيق تجارة التزام دوران SDK دعم حمل إصلاح حجز إصدار؛ منتج لا يوجد قوي صنع إشارة تحديد بروتوكول إصلاح حجز إصدار ضبط.[إعداد دليل](../config-catalog.zh.md#deepseek-aidsh-mcp-client) صف خروج عميل قبول حقل و قيمة افتراضية.

-----

<a id="responsibilities-and-scope"></a>
## مسؤولية و أثر مجال

عميل هو كل خادم واحد اتصال إضافة، أيضا هو Harness أداة سجل التسجيل إزالة استهلاك من. هو لا إصدار مشترك `ctx.mcp` خدمة. خارجي خادم تنفيذ MCP عملية؛SDK يملك بروتوكول تسليم تبديل؛ عميل سوف اكتشاف أداة ملائم إعداد إلى Harness تنفيذ مرور مسار.

`mcp-resources` يملك مشترك مورد أداة، و في استدعاء جهة أثر مجال في اختيار مزود. كل MCP عميل عبر ذاتي ذات اتصال توفير مورد عملية. أثر مجال في أول عدد مزود تفعيل محلي مشترك أداة، إزالة الأكثر بعد واحد مزود وقت إزالة هذه أداة؛ وراثة مزود ما زال مرئي. خدمة مستقل في أي مفرد واحد عميل يملك هذه أداة تسجيل. فقط يلزم مرئي عميل بند إبقاء تنشيط، اتصال فشل حينئذ لن إزالة مشترك مورد أداة.

إعداد `serverName` في تسجيل أثر مجال داخل معرف خادم. نفس أثر مجال في اثنان عدد بند لا يستطيع احتلال استخدام نفسه اسم؛ مختلف Agent أثر مجال يمكن إعادة استخدام هذا اسم. عام أداة اسم يتضمن إعداد خادم اسم، لذلك مختلف خادم نفس اسم أداة ما زال يمكن منطقة قسم. تسجيل فرعي أثر يملك اسم و قد اكتشاف أداة؛ إضافة تحرير وقت إغلاق اتصال و إزالة ذلك مساهمة.

[أصلي Cua Driver مزود](../../packages/experimental/computer-use-cua-driver-native/README.zh.md) إعادة استخدام عميل توجيه خروج نتيجة مهايئ، بلا حاجة فتح MCP اتصال. طاولة وجه مزود اختيار يخص[حساب حساب آلة استخدام فرعي نظام](computer-use.zh.md).

-----

<a id="protocol-and-results"></a>
## بروتوكول و نتيجة

stdio و Streamable HTTP كل استخدام رسمي جهة SDK تنسيق تجارة، اكتشاف، بروتوكول تحقق و إلغاء آلية. أداة قائمة تغير عبر قديم إصدار إشعار أو الآن بديل حجز قراءة إطلاق اكتشاف. تحديث جديد فشل وقت إبقاء فوق واحد بديل أداة؛ اتصال استعادة التزام دوران[عميل دورة الحياة](../../packages/mcp/mcp-client/README.zh.md#use-this-package).

نتيجة مهايئ لـ برنامج تحويل استدعاء جهة إبقاء مواصفة MCP JSON، و دقيق تجهيز عادي أداة محتوى. تلقي دعم حمل رسم مثل استخدام مرفق عنصر نظام؛ لا تلقي دعم حمل غني محتوى إنتاج واضح نص تشخيص. أداة سجل التسجيل ما زال قرار سياسة فشل و نتيجة استبدال.[أداة عقد نحو](tools.zh.md) صيانة سجل و نهائي عرض قاعدة؛[عميل نتيجة مشاركة اعتبار](../../packages/mcp/mcp-client/README.zh.md#use-this-package) صيانة MCP خاص لديه إسقاط دقيق عقدة.

-----

<a id="resources-and-instructions"></a>
## مورد و إشارة أمر

مورد استدعاء يجب صريح إشارة تحديد إعداد خادم اسم. توجيه النظام تجميع خدمة متاح وقت، مورد خدمة من إرسال إرسال الذي استخدام نفس سجل التسجيل صف خروج استدعاء جهة مرئي اسم، يشمل لا يوجد أداة أو إشارة أمر خادم. مشترك سجل التسجيل في توزيع قبل، في استدعاء Agent أثر مجال في تحليل هذا اسم؛ غير ممكن استخدام خادم سوف في إرسال خروج شبكة شبكة طلب قبل فشل. اكتشاف و قراءة متساو حسب يحتاج تنفيذ، أيضا دعم حمل فقط توفير مورد بينما لا توفير أداة خادم.[مورد حزمة](../../packages/mcp/mcp-resources/README.zh.md) صيانة قسم صفحة و محتوى تصيير قاعدة؛ ذلك توليد أداة schema يقع في[أداة دليل](../tool-catalog.zh.md#deepseek-aidsh-mcp-resources).

مورد مزود ما زال من اتصال يملك. أثر مجال تحرير وقت إزالة تسجيل؛MCP عميل تحكم إلغاء و استعادة. مواصفة نتيجة لـ برنامج تحويل استدعاء جهة إبقاء كامل JSON، نص إسقاط فإن بـ وصف استبدال اثنان دخول صنع blob. إرجاع نص دخول عادي أداة تاريخ؛ خادم اتصال ذاته لن إطلاق محتوى قراءة.

تركيب يتضمن توجيه النظام تركيب إعداد وقت، عميل سوف غير فارغ أبيض خادم إشارة أمر إصدار لـ حمل خادم ملكية أثر مجال فصل عقدة. إشارة أمر إبقاء حرف وجه نص، و في إصدار قبل عبر إعداد كبير صغير حد. استبدال اتصال فقط في اكتشاف نجاح بعد إصدار إشارة أمر؛ نقص قليل إشارة أمر وقت لا إضافة فصل عقدة.[توجيه النظام فرعي نظام](system-prompt.zh.md) صيانة تركيب إعداد و سجل قاعدة.

-----

<a id="resource-provider-types"></a>
## مورد مزود نوع

اتصال مزود استقبال واحد عملية و أصلي أداة تنفيذ كائن، منها يتضمن استدعاء جهة و إلغاء إشارة.

```ts type-equiv
/** One supported resource operation, with server-owned cursors and URIs. */
type McpResourceRequest =
  | { method: 'resources/list' | 'resources/templates/list'; cursor?: string }
  | { method: 'resources/read'; uri: string }
```

```ts type-equiv
/** One configured server's resource access, owned by its MCP connection plugin. */
interface McpResourceProvider {
  /**
   * Run an operation against one live connection generation.
   * @param request - MCP resource method and parameters.
   * @param exec - caller identity and cancellation for this invocation.
   * @returns the protocol result as lossless JSON.
   */
  request(request: McpResourceRequest, exec: ToolExecution): Promise<JsonValue>
}
```

-----

<a id="limits"></a>
## حد

لا دعم حمل MCP نص التوجيه نموذج لوح، شخص عمل إدخال سمة استفسار، أساس في مهمة تنفيذ و مورد حجز قراءة. مورد أداة حاجة استدعاء جهة مرئي قد إعداد خادم؛ اثنان دخول صنع مورد إبقاء لـ برنامج تحويل بيانات، نموذج استقبال ذلك نص وصف. لا يوجد أداة قدرة خادم بـ فارغ أداة تجميع اتصال. اتصال و اكتشاف مهلة التزام دوران SDK؛ عميل لا يوجد مقابل مستقل ضبط.

-----

<a id="further-reading"></a>
## تأخير امتداد قراءة قراءة

- [MCP حزمة مجموعة](../../packages/mcp/README.zh.md) — حزمة مدخل.
- [MCP مورد](../../packages/mcp/mcp-resources/README.zh.md) — مشترك أداة و مورد مزود دلالة.
- [مورد مرئي صفة قرار](../../.agents/notes/implemented/feature/2026-09-13-mcp-resources-in-profiles.zh.md) — profile موحد واحد تركيب و من قد إعداد خادم قرار مرئي صفة.
- [رقم ثلاثة جهة تسجيل ذاكرة خادم](../user/guide/mcp-memory.zh.md) — منتج إعداد إشارة جنوب.
- [بروتوكول تنسيق تجارة قرار](../../.agents/notes/implemented/feature/2026-09-12-mcp-sdk-protocol-negotiation.zh.md) — SDK مسؤولية و توافق صفة قرار.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxmcpresources--mcpresourceruntime"></a>

### `ctx.mcpResources` — `McpResourceRuntime`

Scoped resource access plus three tools shared by configured MCP servers.

```ts cordis-catalog
/**
 * Register one server and expose resource tools while that scope has providers.
 * @param server - configured server name, unique in this scope.
 * @param provider - connection-owned resource operations.
 * @returns the effect disposer for this exact registration.
 */
register(server: string, provider: McpResourceProvider): () => void
```

Source: [`packages/mcp/mcp-resources/src/index.ts`](../../packages/mcp/mcp-resources/src/index.ts)
<!-- END GENERATED cordis-surface -->

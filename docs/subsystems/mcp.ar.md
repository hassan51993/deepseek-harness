# MCP

[English](mcp.md) | العربية

## الملخص

يصل بروتوكولُ سياق النموذج (MCP) النموذجَ بأدوات تقدّمها خوادمُ خارجية. ويسهم كلُّ خادم مضبوط بأدوات حزام عادية مع الإلغاء وفحوص الأذونات والنتائج المسجَّلة وخرج الصور المدعوم. وتكتشف الأدواتُ المشتركة المواردَ وتقرؤها حين يكون الخادمُ مضبوطًا في نطاق المستدعي، بينما تنضم تعليماتُ الخادم إلى مطالبة النظام المسجَّلة. وتتفاوض SDK الرسمية على مراجعات البروتوكول الحديثة أو القديمة المدعومة. ويغطي هذا المرجعُ مسؤولياتِ مجموعة حزم MCP ونطاقَها وخياراتِ تركيبها؛ ويملك [README العميل](../../packages/mcp/mcp-client/README.ar.md) ضبطَ الخوادم.

## المحتويات

- [الضبط](#configuration)
- [المسؤوليات والنطاق](#responsibilities-and-scope)
- [البروتوكول والنتائج](#protocol-and-results)
- [الموارد والتعليمات](#resources-and-instructions)
- [أنواع مزوّد الموارد](#resource-provider-types)
- [الحدود](#limits)
- [قراءات إضافية](#further-reading)

-----

<a id="configuration"></a>
## الضبط

خوادمُ MCP اختياريةُ التفعيل. اضبط مدخلَ `@deepseek-ai/dsh-mcp-client` واحدًا لكل خادم في نطاق Cordis المقصود. ويقدّم كلُّ ملف تعريفي مشحون [سجلَّ الأدوات](tools.ar.md) ويركّب خدمةَ الموارد المشتركة مرةً واحدة؛ ولا يضبط المستخدمون إلا مداخلَ العميل. والمستدعون الذين لا يرون خادمًا مضبوطًا لا يتلقون نصَّ مطالبة MCP ولا أدواتِه في الوضع الأصيل ولا في وضع PTC.

| الخيار | مالك الضبط |
|---|---|
| هويةُ الخادم، والعمليةُ المحلية أو نقطةُ نهاية HTTP، والاعتمادات، وبيئةُ العملية | [ضبط العميل](../../packages/mcp/mcp-client/README.ar.md#use-this-package) |
| مهلةُ طلب الأدوات والموارد، وسياسةُ فشل الإقلاع، وإعادةُ الاتصال | [ضبط العميل](../../packages/mcp/mcp-client/README.ar.md#use-this-package) |
| اكتشافُ الموارد وقراءتُها | [خدمة موارد MCP](../../packages/mcp/mcp-resources/README.ar.md#use-this-package) مضمَّنة في الملفات التعريفية المشحونة؛ ولا حقولَ ضبط لها |
| حدُّ حجم تعليمات الخادم | `maxInstructionBytes` في العميل؛ ويقدّم التركيبُ [تجميع مطالبة النظام](system-prompt.ar.md) |
| قراراتُ الأذونات وخرجُ الصور المدعوم | [تنفيذ الأدوات](tools.ar.md) و[المرفقات](attachment.ar.md) |

ويتبع التفاوضُ على البروتوكول مراجعاتِ SDK المدعومة؛ ولا يوجد إعدادُ منتَج يفرض مراجعةَ بروتوكول. ويعدّد [دليلُ الضبط](../config-catalog.ar.md#deepseek-aidsh-mcp-client) حقولَ العميل المقبولة وافتراضاتِها.

-----

<a id="responsibilities-and-scope"></a>
## المسؤوليات والنطاق

العميلُ إضافةُ وصلة لكل خادم ومستهلكٌ لسجل أدوات الحزام. وهو لا ينشر خدمةَ `ctx.mcp` مشتركة. وينفّذ الخادمُ الخارجي عملياتِ MCP؛ وتملك SDK تبادلَ البروتوكول؛ ويهايئ العميلُ الأدواتِ المكتشَفة مع تنفيذ الحزام.

وتملك `mcp-resources` أدواتِ الموارد المشتركة وتنتقي المزوّدين في نطاق المستدعي. ويقدّم كلُّ عميل MCP عملياتِ الموارد عبر وصلته هو. وأولُ مزوّد في نطاق يفعّل الأدواتِ المشتركة المحلية، وإزالةُ آخرهم تزيلها؛ وتبقى المزوّداتُ الموروثة مرئية. وتملك الخدمةُ تسجيلاتِ هذه الأدوات مستقلةً عن أي عميل بعينه. ولا تزيل إخفاقاتُ الوصلة أدواتِ الموارد المشتركة ما دام مدخلُ عميل مرئي نشطًا.

ويحدد `serverName` المضبوط خادمًا في نطاق تسجيله. ولا يستطيع مدخلان في ذلك النطاق حجزَ الاسم نفسِه؛ وتستطيع نطاقاتُ وكلاء منفصلة إعادةَ استعماله. وتتضمن أسماءُ الأدوات العلنية اسمَ الخادم المضبوط، فتبقى الأدواتُ المتساوية الأسماء من خوادم مختلفة متمايزة. وتملك آثارُ التسجيل الأسماءَ والأدواتِ المكتشَفة؛ ويغلق التخلصُ من الإضافة الوصلةَ ويزيل إسهاماتِها.

ويتشارك [مزوّد Cua Driver الأصيل](../../packages/experimental/computer-use-cua-driver-native/README.ar.md) مهايئَ النتائج المصدَّر من العميل بلا فتح وصلة MCP. أما اختيارُ مزوّد سطح المكتب فيخص [نظام استعمال الحاسوب](computer-use.ar.md).

-----

<a id="protocol-and-results"></a>
## البروتوكول والنتائج

يستعمل كلٌّ من stdio وStreamable HTTP تفاوضَ SDK الرسمية واكتشافَها وتحققَها من البروتوكول وإلغاءَها. وتُطلق تغييراتُ قائمة الأدوات الاكتشافَ عبر إشعارات قديمة أو اشتراك حديث. ويُبقي التحديثُ الفاشل جيلَ الأدوات السابق؛ ويتبع التعافي من الوصلة [دورةَ حياة العميل](../../packages/mcp/mcp-client/README.ar.md#use-this-package).

ويحتفظ مهايئُ النتائج بـJSON المعياري لـMCP للمستدعين البرمجيين، ويعدّ محتوى أدوات عاديًا. وتستعمل الصورُ المدعومة نظامَ المرفقات؛ أما المحتوى الغني غيرُ المدعوم فينتج تشخيصاتٍ نصية صريحة. ويبقى سجلُّ الأدوات المرجعَ في إخفاقات السياسة والنتائج المستبدَلة. وتملك [عقود الأدوات](tools.ar.md) التسجيلَ والعرضَ النهائي؛ ويملك [مرجع نتائج العميل](../../packages/mcp/mcp-client/README.ar.md#use-this-package) تفاصيلَ الإسقاط الخاصة بـMCP.

-----

<a id="resources-and-instructions"></a>
## الموارد والتعليمات

تشترط نداءاتُ الموارد اسمَ خادم مضبوطًا صريحًا. وحين يتوفر تجميعُ مطالبة النظام، تعدّد خدمةُ الموارد الأسماءَ التي يراها المستدعي من السجل نفسِه المستعمل في التوزيع، بما فيها الخوادمُ بلا أدوات ولا تعليمات. ويحلّ السجلُّ المشترك ذلك الاسمَ في نطاق الوكيل المستدعي قبل التوزيع؛ وتفشل الخوادمُ غيرُ المتاحة بلا طلب شبكة. والاكتشافُ والقراءاتُ عند الطلب، ومن ذلك الخوادمُ التي تكشف مواردَ بلا أدوات. وتملك [حزمةُ الموارد](../../packages/mcp/mcp-resources/README.ar.md) التقسيمَ إلى صفحات وعرضَ المحتوى؛ وschemas أدواتها المولَّدة في [دليل الأدوات](../tool-catalog.ar.md#deepseek-aidsh-mcp-resources).

ويبقى مزوّدو الموارد مملوكين للوصلة. ويزيل التخلصُ من النطاق التسجيلاتِ؛ ويتحكم عميلُ MCP في الإلغاء والتعافي. وتحتفظ النتائجُ المعيارية بـJSON كاملًا للمستدعين البرمجيين، بينما يستبدل الإسقاطُ النصي الكتلَ الثنائية بأوصاف. ويدخل النصُّ المعاد تاريخَ الأدوات المعتاد؛ ولا يُجلب المحتوى لمجرد اتصال خادم.

وحين يُركَّب تجميعُ مطالبة النظام، ينشر العميلُ تعليماتِ الخادم غيرَ الفارغة قسمًا منطاقيًّا منسوبًا إلى خادمه. وتبقى التعليماتُ نصًّا حرفيًا وتمرّ بحدّ الحجم المضبوط قبل النشر. ولا تنشر وصلةٌ بديلة التعليماتِ إلا بعد نجاح الاكتشاف؛ والتعليماتُ الغائبة لا تضيف قسمًا. ويملك [نظام مطالبة النظام](system-prompt.ar.md) التجميعَ والتسجيل.

-----

<a id="resource-provider-types"></a>
## أنواع مزوّد الموارد

يتلقى مزوّدُ الوصلة عمليةً واحدة وتنفيذَ الأداة الأصلي، ومعه مستدعيه وإشارةُ إلغائه.

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
## الحدود

قوالبُ مطالبات MCP، واستخلاصُ مُدخَل الإنسان، والتنفيذُ القائم على المهام، واشتراكاتُ الموارد غيرُ مدعومة. وتشترط أدواتُ الموارد خادمًا مضبوطًا يراه المستدعي؛ وتبقى المواردُ الثنائية بياناتٍ برمجية بأوصاف نصية للنموذج. والخوادمُ بلا قدرة أدوات تتصل بمجموعة أدوات فارغة. وتتبع مهلُ الوصلة والاكتشاف SDK؛ ولا إعداداتِ منفصلة لها في العميل.

-----

<a id="further-reading"></a>
## قراءات إضافية

- [مجموعة حزم MCP](../../packages/mcp/README.ar.md) — مداخلُ الحزم.
- [موارد MCP](../../packages/mcp/mcp-resources/README.ar.md) — الأدواتُ المشتركة ودلالاتُ مزوّد الموارد.
- [قرار رؤية الموارد](../../.agents/notes/implemented/feature/2026-09-13-mcp-resources-in-profiles.ar.md) — تركيبُ الملفات التعريفية المشتركة والرؤيةُ من الخوادم المضبوطة.
- [خوادم الذاكرة من أطراف ثالثة](../user/guide/mcp-memory.ar.md) — دليلُ ضبط المنتَج.
- [قرار التفاوض على البروتوكول](../../.agents/notes/implemented/feature/2026-09-12-mcp-sdk-protocol-negotiation.ar.md) — قراراتُ ملكية SDK والتوافق.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

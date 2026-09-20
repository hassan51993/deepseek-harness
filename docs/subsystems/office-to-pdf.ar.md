# من Office إلى PDF

[English](office-to-pdf.md) | العربية

تحوّل [عائلة حزم المستندات](../../packages/document/README.ar.md) ملفاتِ Office إلى PDF على مضيف Node. ويخوّل المستهلكون قراءةَ المصدر ويملكون العرض؛ ويملك المزوّدُ المشترك التحويلَ والقبولَ المحدود وإعادةَ استعمال PDF العابر. ولا ينشئ هذا النظامُ أداةً يراها النموذج ولا حدثَ جلسة.

## الملكية

| المالك | المسؤولية |
|---|---|
| [office-to-pdf](../../packages/document/office-to-pdf/README.ar.md) | `ctx.officeToPdf`: تحويلُ LibreOffice المشترك، والقبولُ المحدود، وتخزينُ PDF مؤقتًا |
| [حزمة Web](../../packages/bundle/web-app/README.ar.md) | مزوّدُ تحويل واحد قابل للضبط يتشاركه مستهلكو المضيف |
| [عميل معاينة Office](../../packages/client/ui-sidebar-documentpreview/README.ar.md#office-preview) | اختيارُ امتدادات Office، وإعادةُ استعمال PDF، وإشعاراتُ الخطوط المفقودة |

## الطلبات والنتائج

يحتوي [`OfficeToPdfRequest`](../../packages/document/office-to-pdf/src/types.ts) على مفتاح مصدر مخوَّل سلفًا وإصداره، وحجمَ stat اختياريًا، وردَّ نداء مؤجلًا `read(signal, maxBytes)`، وأولويةً أمامية أو خلفية، و`OfficeExtension` من `doc` أو `docx` أو `xls` أو `xlsx` أو `ppt` أو `pptx`. ويعيد `OfficeToPdf.convert(request, signal?)` نتيجةَ PDF كاملة واحدة. ويتبع الإلغاءُ عمرَ المستدعي وعمرَ المزوّد؛ وترفض إخفاقاتُ التحقق والخرج والمحرّك بـ`OfficeToPdfError` مصنَّف.

و`OfficeToPdfPriority` قيمتُها `foreground` للمعاينة وضمان الجودة المطلوبين، و`background` للتخمين. ويَسِم `OfficeSourceKey` محدِّدَ المصدر المخوَّل الذي يملكه المستدعي. ويَسِم `OfficeToPdfGeneration` عمرَ مزوّد، ويَسِم `OfficeToPdfKey` هويةَ محتواه؛ ولا يحلّل المستهلكون أيًّا من القيمتين المعتمتين.

| حقل النتيجة | المعنى |
|---|---|
| `pdf` | `Uint8Array` يملكه المستدعي ويحتوي PDF كاملًا |
| `missingFonts` | عائلاتُ خطوط طلبها المستند ولم تتوفر لهذا التحويل |
| `cacheKey` | جيلُ المحوِّل المعتم مع هوية الامتداد ومحتوى المصدر |
| `generation` | عمرُ المزوّد؛ واستبدالُه يُبطل إعادةَ استعمال PDF المخزَّن |

ويقبل المزوّدُ القراءةَ المؤجلة قبل تخصيص بايتات المصدر، ويتشارك التحويلاتِ بهوية المحتوى، ويزيل دليلَه المؤقت الخاص قبل أن يعود. وتبقى بايتاتُ PDF المعادة صالحةً بعد التخلص من المزوّد. ولا تدخل بايتاتُ المصدر ولا بايتاتُ PDF تخزينَ الجلسة. ويستطيع المستهلكون استعمالَ [ملفات مساحة العمل](../../packages/api/workspace-files/README.ar.md) لقراءات مخوَّلة محدودة.

## قراءات المعاينة

يوسّع `RenderedDocumentBytes` استجابةَ بايتات مساحة العمل بـ`missingFonts` و`generation`؛ وترافق هويةُ المصدر الأصلية ملفَّ PDF المحوَّل.

وتفحص طريقةُ Remote المسماة `officeToPdf.render` تخويلَ المصدر وإصداراتِه عبر خدمة [ملفات مساحة العمل](../../packages/api/workspace-files/README.ar.md) في الجلسة. وبعد قبول التحويل، يقدّم `fs.readBytes` المُدخَل الخام ضمن سعة البايتات المحجوزة؛ وتحكم حدودُ مُدخَل Office هذه القراءة. وتحمل الاستجابةُ بايتاتِ PDF بترميز base64 مع مسار المصدر المطلق وإصدار الطزاجة. وتمرّ إخفاقاتُ الوصول إلى المصدر كما هي؛ أما إخفاقاتُ الحجم والمحرّك فتكشف سببًا مصنَّفًا بلا تشخيصات. والتحويلُ لا يفعّل وكيلًا ولا يُلحق أحداثًا.

وتركّب مجموعةُ `api/remotes` واصفَ Remote المولَّد لخدمة التحويل. وتسجّل حزمةُ معاينة المستندات المشتركة صيغَ Office مع تحميل البايتات كاملةً ومع Worker من PDF.js القائم لديها. وتعيد كلُّ قراءة معاينة فحصَ جيل العارض وتخويل المصدر وإصداره قبل أن تتشارك تحويلًا جاريًا أو ملفَّ PDF مخزَّنًا. وتلغي إعادةُ تعيين الوصلة والتخلصُ من الإضافة الطلباتِ وتمسح البايتاتِ المخزَّنة. وتعرض الخدماتُ المفقودة إرشادَ ضبط مترجَمًا.

## اختيار المحرّك والحدود

تختار واجهةُ Node البرمجية الخارجية [`@deepseek-ai/libreoffice-kit`](https://github.com/deepseek-harness/libreoffice-kit) محرّكاتِها المترجَمة سلفًا. وللعدّة إصدارٌ ومسارُ إصدار مستقلان، يعرّفهما [قرارُ ملكية الإصدار](../../.agents/notes/implemented/architecture/2026-09-14-independent-libreoffice-kit.ar.md). وتثبّت بناءاتُ التطبيق حزمَ npm المنشورة. وتشترط حزمُ التطبيق المحرّكَ الأصيل المعلَن للهدف، أو Node WASM حين لا تعلن العدّةُ محرّكًا أصيلًا لذلك الهدف. ويعرّف [قرارُ محرّكات المنصات](../../.agents/notes/implemented/architecture/2026-09-15-platform-office-engines.ar.md) التثبيتَ والتحزيم. وترفض البياناتُ الوصفية غيرُ الصالحة والأصولُ المطلوبة المفقودة وأخطاءُ التحويل بلا تبديل المحرّكات. ويستعمل التحويلُ مسارات مُدخَل ومُخرَج على قرص المضيف، بلا محرّك تحويل في المتصفح وبلا RPC للخطوط.

ويملك [ضبطُ مزوّد المضيف](../../packages/document/office-to-pdf/README.ar.md#use-this-package) التوازيَ والمهلَ وحدودَ المُدخَل والمُخرَج وحدودَ الأرشيف ودقةَ الصور والوصولَ إلى الخطوط. أما التنفيذُ الأصيل وتنفيذُ WASM وتوزيعُ الأصول فتخص مساحةَ عمل العدّة. أما اكتشافُ LibreOffice في النظام، وتنزيلُ المحرّكات في وقت التشغيل، وتخزينُ PDF الدائم، والعرضُ الذي يراه النموذج فخارج هذا المزوّد.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxofficetopdf--officetopdf"></a>

### `ctx.officeToPdf` — `OfficeToPdf`

A provider lifetime owns all converters, queued calls, and temporary files.

```ts cordis-catalog
/**
 * Convert Office bytes without modifying the source or writing Session events.
 * @param request - authorized metadata and deferred bounded source read.
 * @param signal - caller cancellation; provider disposal also stops active work.
 * @returns caller-owned PDF bytes after conversion and scratch cleanup settle; canceled readers reject independently.
 * @throws {OfficeToPdfError} Invalid input, unusable output, or engine failure; cancellation rejects with its reason.
 */
convert(request: OfficeToPdfRequest, signal?: AbortSignal): Promise<OfficeToPdfResult>

/**
 * Read and convert one Office file using the Session's ordinary filesystem authorization.
 * @param workspaceFileScope - Session header lookup shared with workspaceFiles.
 * @param path - absolute or workspace-relative Office path.
 * @param priority - foreground preview or speculative background work.
 * @param signal - Remote cancellation; disposal also cancels outstanding reads and conversions.
 * @returns complete base64 PDF with original source identity and missing font families.
 */
@Remote async render( workspaceFileScope: WorkspaceFileScope, path: string, priority: OfficeToPdfPriority, signal: AbortSignal, ): Promise<RenderedDocumentBytes>

/**
 * Read the current rendering generation before reusing a Client PDF.
 * @param signal - Remote caller cancellation.
 * @returns provider lifetime, replaced with rendering, font, or engine configuration.
 */
@Remote('generation') getGeneration(signal: AbortSignal): OfficeToPdfGeneration
```

Source: [`packages/document/office-to-pdf/src/index.ts`](../../packages/document/office-to-pdf/src/index.ts)
<!-- END GENERATED cordis-surface -->

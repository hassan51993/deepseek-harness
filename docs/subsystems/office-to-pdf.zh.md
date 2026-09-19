# Office تحويل PDF

[English](office-to-pdf.md) | العربية

[document حزمة عائلة](../../packages/document/README.zh.md) في Node مضيف فوق سوف Office ملف تحويل لـ PDF. إزالة استهلاك من مسؤول مصدر ملف قراءة تخويل و عرض؛ مشترك مزود مسؤول تحويل، محدود دقيق دخول و مؤقت PDF إعادة استخدام. هذا فرعي نظام لا إنشاء موجه إلى نموذج أداة أو Session حدث.

## كل حق

| كل من | مسؤولية |
|---|---|
| [office-to-pdf](../../packages/document/office-to-pdf/README.zh.md) | `ctx.officeToPdf`: مشترك LibreOffice تحويل، محدود دقيق دخول و PDF ذاكرة مؤقتة |
| [Web bundle](../../packages/bundle/web-app/README.zh.md) | من مضيف إزالة استهلاك من مشترك مفرد عدد يمكن إعداد تحويل مزود |
| [Office معاينة Client](../../packages/client/ui-sidebar-documentpreview/README.zh.md#office-preview) | Office توسيع اسم اختيار،PDF إعادة استخدام و ناقص حرف جسم تلميح |

## طلب و نتيجة

[`OfficeToPdfRequest`](../../packages/document/office-to-pdf/src/types.ts) يتضمن قد تخويل مصدر مفتاح و إصدار، اختياري stat كبير صغير، تأخير متأخر `read(signal, maxBytes)` عودة ضبط، قبل منصة أو خلفية أولوية درجة و `OfficeExtension`:`doc`،`docx`،`xls`،`xlsx`،`ppt` أو `pptx`.`OfficeToPdf.convert(request, signal?)` إرجاع واحد كامل PDF نتيجة. إلغاء التزام دوران استدعاء جهة و مزود دورة الحياة؛ تحقق، إخراج و جذب محرك فشل بـ تصنيف `OfficeToPdfError` رفض.

`OfficeToPdfPriority` مقابل طلب معاينة أو QA استخدام `foreground`، مقابل دفع قياس عمل استخدام `background`.`OfficeSourceKey` لـ استدعاء جهة يملك قد تخويل مصدر تحديد موضع رمز زيادة صنف لوحة نوع.`OfficeToPdfGeneration` يمثل مزود دورة الحياة،`OfficeToPdfKey` يمثل ذلك محتوى هوية؛ إزالة استهلاك من لا تحليل هذا اثنان نوع لا نفاذ واضح قيمة.

| نتيجة حقل | يحتوي معنى |
|---|---|
| `pdf` | استدعاء جهة يملك `Uint8Array`، يتضمن كامل PDF |
| `missingFonts` | هذا مرة تحويل لا يمكن استخدام وثيقة طلب حرف جسم اسم |
| `cacheKey` | لا نفاذ واضح تحويل generation إضافة توسيع اسم و مصدر محتوى هوية |
| `generation` | مزود دورة الحياة؛ استبدال بعد ذاكرة مؤقتة PDF لم يعد يمكن إعادة استخدام |

مزود أولا دقيق دخول تأخير متأخر قراءة، مجددا قسم إعداد مصدر ملف بايت؛ حسب محتوى هوية مشترك تحويل، و في إرجاع قبل حذف خاص مؤقت دليل. إرجاع PDF بايت في مزود تحرير بعد ما زال صالح. مصدر ملف و PDF بايت لن دخول Session تخزين. إزالة استهلاك من يمكن عبر[مساحة العمل ملف](../../packages/api/workspace-files/README.zh.md) تنفيذ قد تخويل محدود قراءة.

## معاينة قراءة

`RenderedDocumentBytes` في مساحة العمل بايت استجابة فوق زيادة `missingFonts` و `generation`؛ تحويل بعد PDF مرفق حمل أصلي مصدر ملف هوية.

`officeToPdf.render` Remote طريقة عبر Session [مساحة العمل ملف](../../packages/api/workspace-files/README.zh.md) خدمة فحص مصدر ملف تخويل و إصدار. أخذ نيل تحويل سعة كمية بعد،`fs.readBytes` في مسبق إبقاء بايت سعة كمية داخل توفير أصلي إدخال؛ هذا قراءة تلقي Office إدخال حد أعلى قيد. استجابة يحمل base64 PDF بايت، مصدر ملف قطعا مقابل مسار و جديد طازج درجة إصدار. مصدر وصول فشل مباشر نقل تمرير؛ كبير صغير و جذب محرك فشل فقط كشف تصنيف سبب، لا يحتوي تشخيص معلومة. تحويل لا تنشيط Agent أو إلحاق حدث.

`api/remotes` تركيب تحويل خدمة توليد Remote وصف رمز. مشترك وثيقة معاينة حزمة استخدام كامل بايت تحميل و قائم PDF.js Worker تسجيل Office صيغة. كل مرة معاينة قراءة كل سوف إعادة فحص تصيير generation، مصدر ملف تخويل و إصدار، مجددا مشترك إجراء في تحويل أو ذاكرة مؤقتة PDF. اتصال إعادة وضع و إضافة إزالة سوف إلغاء طلب و صاف فارغ ذاكرة مؤقتة بايت. نقص قليل خدمة وقت عرض محلي تحويل إعداد جذب توجيه.

## جذب محرك اختيار و حد

خارجي [`@deepseek-ai/libreoffice-kit`](https://github.com/deepseek-harness/libreoffice-kit) Node API اختيار ذلك مسبق تحرير ترجمة جذب محرك.kit مستقل صيانة إصدار و إصدار مسار، أداة جسم ملكية من[إصدار ملكية قرار](../../.agents/notes/implemented/architecture/2026-09-14-independent-libreoffice-kit.zh.md) تعريف. تطبيق بناء وقت تثبيت قد إصدار npm حزمة. تطبيق تحزيم اشتراط هدف قد إعلان أصلي جذب محرك؛kit لم لـ هذا هدف إعلان أصلي جذب محرك وقت استخدام Node WASM.[منصة جذب محرك قرار](../../.agents/notes/implemented/architecture/2026-09-15-platform-office-engines.zh.md) تعريف تثبيت و تحزيم قاعدة. بيانات وصفية بلا فاعلية، مطلوب مورد ناقص و تحويل خطأ كل سوف رفض طلب، لا تبديل جذب محرك. تحويل في Host استخدام مغناطيس قرص إدخال إخراج مسار، لا استخدام متصفح تحويل جذب محرك أو حرف جسم RPC.

[Host مزود إعداد](../../packages/document/office-to-pdf/README.zh.md#use-this-package) مسؤول تزامن، مدة حد، إدخال إخراج حد أعلى، عودة ملف حد أعلى، رسم مثل قسم تمييز معدل و حرف جسم وصول. أصلي/WASM تنفيذ و مورد إنتاج توزيع يخص kit مساحة العمل. نظام LibreOffice استكشاف قياس، وقت التشغيل جذب محرك تحت تحميل، حمل دائم PDF ذاكرة مؤقتة و موجه إلى نموذج تصيير لا يخص هذا مزود.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

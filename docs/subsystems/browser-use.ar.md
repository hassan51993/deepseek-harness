# متصفح عملية

[English](browser-use.md) | العربية

متصفح عملية يجعل نموذج عبر إعداد خلفية فحص و عملية شبكة صفحة.DSH يملك مهمة حلقة؛ مزود توفير متصفح عملية، و في واحد فوري Session كثير عدد جولة بين إبقاء متصفح حالة.

## اختيار مزود

في نفس تركيب في تركيب [`dsh-browser-use`](../../packages/browser-use/browser-use/README.ar.md) و واحد مزود. هذه مزود هو فعلي تحقق صفة عام مشترك npm حزمة، حاجة صريح تنشيط. هو جمع الأكثر أول دعم حمل متصفح جذب محرك هو Chromium.

| مزود | تجميع صار طريقة |
|---|---|
| [Playwright MCP](../../packages/experimental/browser-use-playwright-mcp/README.ar.md) | Playwright متصفح تحكم MCP أداة |
| [Chrome DevTools MCP](../../packages/experimental/browser-use-chrome-devtools-mcp/README.ar.md) | عبر MCP إجراء Chrome DevTools فحص و تحكم |
| [Stagehand](../../packages/experimental/browser-use-stagehand-native/README.ar.md) | أصلي متصفح عملية، دعم حمل AI(شخص عمل ذكي) مساعد مساعدة حركة عمل، مراقبة قياس و رفع أخذ |

مشترك خدمة فقط تسجيل اسم، و رفض أي ثاني مرة مزود تسجيل، يشمل نفس اسم نسخة. هو لا يتضمن عام متصفح عملية طريقة، متصفح مورد أو نموذج تحكم اختيار جهاز.Profile أو preset في مزود إعداد لـ هذا مرة تنشيط اختيار بدء أو مرفق إضافة نمط.

## Session كل حق

بدء متصفح يخص استخدام هو تأكيد قطع فوري Agent و Session. عبر جولة استدعاء إعادة استخدام هذا متصفح.Session وقت التشغيل تحرير وقت إغلاق ذلك بدء مورد؛ إعادة تحميل أو fork Session وقت إنشاء كل جديد متصفح حالة. متصفح profile و تسجيل تسجيل حالة لن من Session سجل استعادة.

مرفق إضافة متصفح ما زال عودة خارجي كل. مزود في هذا مزود نسخة داخل سوف متصفح إبقاء إعطاء واحد Session، إبقاء قائم متصفح حالة، و رفض آخر عدد Session معا مرفق إضافة. تنظيف سوف قطع فتح اتصال و إبقاء خارجي متصفح تشغيل. مستقل DSH عملية و أخرى عميل لا تلقي هذا إبقاء قيد.

مزود إغلاق وقت أولا إيقاف استقبال أداة استدعاء، و انتظار ذاتي لديه عمل و مورد تنظيف إتمام، مجددا تحرير مشترك مزود تسجيل. إلغاء لا يمكن سحب إلغاء قد تسليم متصفح عملية.

## MCP ابتدائي تحويل

MCP مزود لـ ذلك تحميل بعد إنشاء كل نشط حركة Agent ابتدائي تحويل واحد عميل. قائم سلسلة سطر `agent/created` حدث انتظار اتصال و اكتشاف انتهاء بعد، إنشاء أو استعادة عندئذ إتمام، ترتيب طابور إدخال عندئذ بدء تشغيل. عميل عبر جولة عودة Session كل. بدء فشل أو إلغاء سوف رفض إنشاء أو استعادة، و إطلاق عميل تنظيف.

إذا مرفق إضافة اتصال قد يتم احتلال استخدام، هذا مرة تنشيط لا استخدام متصفح، لكن متابعة تشغيل، لاحق جولة لن إعادة محاولة. اتصال تحرير بعد، جديد إنشاء أو استعادة تنشيط يمكن نيل أخذ هو. تحميل أو إعادة تحميل مزود لن وصل إدارة قد نشط حركة Session؛[مشترك وقت التشغيل](../../packages/experimental/browser-use-runtime/README.ar.md) يملك هذه ابتدائي تحويل قاعدة.

## أداة و سجل نتيجة

مزود أداة استخدام معتاد قاعدة DSH تنفيذ إدارة خط و Session سجل. مزود يملك ذاتي ذات أداة schema، نتيجة تصيير، رسم مثل دعم حمل، إعداد و فوق تنقل حد؛ مشترك خدمة لا إضافة نموذج مرئي محتوى.Stagehand AI مساعد مساعدة عملية استخدام ذلك صريح إعداد أصلي نموذج،DSH إبقاء مهمة حلقة.DSH نموذج توجيه، اعتماد إعادة استخدام، قاع طبقة دفع إدارة طلب/استجابة التقاط، و و Session استخدام كمية حساب كمية تجميع صار متساو تابع مؤقت مؤقت عمل؛ إرجاع SDK بيانات و بيانات وصفية ما زال بصفة عادي أداة نتيجة سجل.

متصفح MCP اتصال أيضا توفير[مورد و خادم إشارة أمر](mcp.ar.md). إرسال نحو متصفح خادم مورد استدعاء استخدام ذلك Session طابور صف، و رفض أخرى Session طلب؛ خادم إشارة أمر فقط سوف تجميع إلى الذي تابع Session نص التوجيه في.

[قرار سجل](../../.agents/notes/implemented/architecture/2026-09-12-browser-use-provider-registration.ar.md) حل تفسير فقط تسجيل اسم خدمة و حسب Session إدارة كل حق.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxbrowseruse--browseruseregistry"></a>

### `ctx.browserUse` — `BrowserUseRegistry`

Owns one optional provider registration in the shared browser-use service.

```ts cordis-catalog
/**
 * Reserve the sole provider slot until the contribution is disposed.
 * A second registration fails even when it repeats the current name. Providers
 * must stop their tools and await owned work before releasing this registration.
 * @param name - provider-owned name used in registration diagnostics.
 * @returns the effect disposer for this exact registration.
 */
register(name: BrowserUseProviderName): () => Promise<void>
```

Source: [`packages/browser-use/browser-use/src/index.ts`](../../packages/browser-use/browser-use/src/index.ts)
<!-- END GENERATED cordis-surface -->

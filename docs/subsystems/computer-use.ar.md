# استعمال الحاسوب

[English](computer-use.md) | العربية

يتيح استعمالُ الحاسوب للنموذج أن يراقب سطحَ المكتب المحلي وأن يشغّله عبر مزوّد مضبوط. وتسمّى هذه القدرةُ المشتركة في DSH **استعمال الحاسوب**؛ أما **Cua Driver** فاسمُ التنفيذ عند المنبع.

## اختر مزوّدًا

ركّب [`dsh-computer-use`](../../packages/computer-use/computer-use/README.ar.md) ومزوّدًا واحدًا في التركيب نفسه. ومزوّدا Cua Driver كلاهما حزمتان تجريبيتان عامتان على npm وتشترطان تفعيلًا صريحًا.

| المزوّد | بيئة التشغيل |
|---|---|
| [Cua Driver MCP](../../packages/experimental/computer-use-cua-driver-mcp/README.ar.md) | تنفيذيُّ `cua-driver` مثبَّت سلفًا ومتصل عبر MCP |
| [Cua Driver الأصيل](../../packages/experimental/computer-use-cua-driver-native/README.ar.md) | بيئةُ التشغيل الأصيلة للمنصة، مثبَّتةً مع تابعة npm |

ويقدّم كل مزوّد دليلَ أدواته من المنبع. ولا تسجّل الخدمةُ المشتركة سوى اسم، وترفض أيَّ مزوّد ثانٍ، ولو كان نسخةً أخرى بالاسم نفسه. وليست لها طرائقُ تشغيل مشتركة لسطح المكتب ولا مُنتقٍ يتحكم فيه النموذج.

## العمر ومشاركة سطح المكتب

يحتفظ المزوّدُ بتسجيله ريثما يوقف أدواتِه ومواردَه المملوكة. ويحرّر فشلُ الإقلاع التسجيلَ الذي حاوله. ويبقي مزوّدُ MCP تسجيلَه أثناء إعادة الاتصال.

ووجودُ مزوّد مسجَّل واحد لا يحجز سطحَ مكتب لجلسة. فالمستدعون ينسّقون مسارات المراقبة والفعل والتحقق كاملةً عبر الجلسات وعبر عمليات DSH المنفصلة. والنداءُ الملغى لا يستطيع التراجعَ عن مُدخَل وصل إلى سطح المكتب فعلًا.

## النتائج ومتطلبات المنصة

تستعمل الأدواتُ مسارَ التنفيذ المعتاد وسجلَّ الجلسة. وتتلقى مساراتُ النماذج القادرة على الصور، حين يوجد مخزنُ مرفقات، لقطاتِ شاشة دائمة؛ أما المساراتُ التي لا تدعم الصور فتتلقى تشخيصَ صور MCP القائم. وتملك ملفاتُ README لدى المزوّدين التثبيتَ والأذوناتِ وحدودَ المنصة.

ويشرح [سجلُّ القرار](../../.agents/notes/implemented/architecture/2026-09-12-computer-use-provider-registration.ar.md) الخدمةَ المقتصرة على التسجيل وتكامُلَي Cua Driver.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxcomputeruse--computeruseregistry"></a>

### `ctx.computerUse` — `ComputerUseRegistry`

Owns one optional provider registration in the shared computer-use service.

```ts cordis-catalog
/**
 * Reserve the sole provider slot until the contribution is disposed.
 * A second registration fails even when it repeats the current name. Providers
 * must stop their tools and await owned work before releasing this registration.
 * @param name - provider-owned name used in registration diagnostics.
 * @returns the effect disposer for this exact registration.
 */
register(name: ComputerUseProviderName): () => Promise<void>
```

Source: [`packages/computer-use/computer-use/src/index.ts`](../../packages/computer-use/computer-use/src/index.ts)
<!-- END GENERATED cordis-surface -->

# استعمال المتصفح

[English](browser-use.md) | العربية

يتيح استعمالُ المتصفح للنموذج أن يفحص صفحاتِ الوِب وأن يشغّلها عبر خلفية مضبوطة. وتملك DSH حلقةَ المهمة؛ ويقدّم المزوّدُ عملياتِ المتصفح ويحفظ حالتَه عبر جولات جلسة حية واحدة.

## اختر مزوّدًا

ركّب [`dsh-browser-use`](../../packages/browser-use/browser-use/README.ar.md) ومزوّدًا واحدًا في التركيب نفسه. والمزوّدون حزمٌ تجريبية عامة على npm وتشترط تفعيلًا صريحًا. ومحرّكُ المتصفح الأولي لديهم هو Chromium.

| المزوّد | التكامل |
|---|---|
| [Playwright MCP](../../packages/experimental/browser-use-playwright-mcp/README.ar.md) | أدواتُ MCP للتحكم في المتصفح من Playwright |
| [Chrome DevTools MCP](../../packages/experimental/browser-use-chrome-devtools-mcp/README.ar.md) | فحصُ Chrome DevTools والتحكمُ فيه عبر MCP |
| [Stagehand](../../packages/experimental/browser-use-stagehand-native/README.ar.md) | عملياتُ متصفح أصيلة مع أفعال ومراقبة واستخراج يعين عليها الذكاء الاصطناعي |

ولا تسجّل الخدمةُ المشتركة سوى اسم، وترفض أيَّ مزوّد ثانٍ، ولو كان نسخةً أخرى بالاسم نفسه. وليست لها طرائقُ تشغيل مشتركة للمتصفح ولا مواردُ متصفح ولا مُنتقٍ يتحكم فيه النموذج. ويختار ضبطُ المزوّد في ملف تعريفي أو في preset الإطلاقَ أو الإرفاقَ لذلك التفعيل.

## ملكية الجلسة

المتصفحُ المُطلَق ملكُ الوكيل الحي والجلسة اللذين يستعملانه بعينهما. وتعيد النداءاتُ عبر الجولات استعمالَ ذلك المتصفح. ويغلق التخلصُ من بيئة تشغيل الجلسة مواردَها المُطلَقة؛ وإعادةُ تحميل الجلسة أو تفريعُها تبدأ بحالة متصفح جديدة. ولا تُستعاد ملفاتُ المتصفح التعريفية ولا حالةُ تسجيل الدخول من سجل الجلسة.

والمتصفحُ المُرفَق يبقى مملوكًا خارجيًا. ويحجزه المزوّدُ لجلسة واحدة داخل تلك النسخة منه، ويحفظ حالتَه القائمة، ويرفض إرفاقًا متزامنًا من جلسة أخرى. ويقطع التفكيكُ الاتصالَ ويترك المتصفحَ الخارجي يعمل. وتبقى عملياتُ DSH المنفصلة والعملاءُ الآخرون خارج هذا الحجز.

ويوقف إغلاقُ المزوّد قبولَ الأدوات وينتظر العملَ المملوك وتنظيفَ الموارد قبل تحرير تسجيل المزوّد المشترك. والإلغاءُ لا يستطيع التراجعَ عن فعل متصفح سُلّم فعلًا.

## تهيئة MCP

يهيّئ مزوّدُ MCP عميلًا واحدًا لكل وكيل حي يُنشأ بعد تحميل المزوّد. وينتظر حدثُ `agent/created` التسلسلي القائم الاتصالَ والاكتشافَ قبل أن يكتمل الإنشاءُ أو الاستئناف ويعمل المُدخَل المصطف. ويبقى العميلُ مع الجلسة عبر الجولات. ويرفض فشلُ الإقلاع أو الإلغاءُ الإنشاءَ أو الاستئناف ويُطلق تنظيفَ العميل.

وإن كان الإرفاقُ مشغولًا، مضى ذلك التفعيلُ بلا متصفح ولم يُعِد المحاولةَ في جولات لاحقة. وبعد التحرير يستطيع تفعيلٌ منشأ حديثًا أو مستأنَف أن يستحوذ عليه. وتحميلُ المزوّد أو إعادةُ تحميله لا تتبنى الجلساتِ النشطة سلفًا؛ وتملك [بيئةُ التشغيل المشتركة](../../packages/experimental/browser-use-runtime/README.ar.md) قواعدَ التهيئة هذه.

## الأدوات والنتائج المسجَّلة

تستعمل أدواتُ المزوّد مسارَ تنفيذ DSH المعتاد وسجلَّ الجلسة. ويملك المزوّدون schemas أدواتهم، وعرضَ النتائج، ودعمَ الصور، والضبطَ، وحدودَ المنبع؛ ولا تضيف الخدمةُ المشتركة محتوى يراه النموذج. وتستعمل عملياتُ Stagehand المعانة بالذكاء الاصطناعي نموذجَها الأصيل المضبوط صراحةً بينما تحتفظ DSH بحلقة المهمة. أما توجيهُ نماذج DSH، وإعادةُ استعمال الاعتمادات، والتقاطُ طلب الاستدلال الأساسي واستجابته، والدمجُ في محاسبة استعمال الجلسة فمؤجلةٌ كلها؛ وتبقى بياناتُ SDK المعادة وبياناتُها الوصفية نتائجَ أدوات مسجَّلة عادية.

وتكشف وصلاتُ MCP للمتصفح أيضًا [الموارد وتعليمات الخادم](mcp.ar.md). ونداءاتُ الموارد الموجَّهة إلى خادم متصفح تستعمل طابورَ جلسته وترفض الجلساتِ الأخرى؛ ولا تُجمَّع تعليماتُ الخادم إلا للجلسة المالكة له.

ويشرح [سجلُّ القرار](../../.agents/notes/implemented/architecture/2026-09-12-browser-use-provider-registration.ar.md) الخدمةَ المقتصرة على التسجيل والملكيةَ لكل جلسة.

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

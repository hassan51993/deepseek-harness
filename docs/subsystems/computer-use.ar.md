# حساب حساب آلة عملية

[English](computer-use.md) | العربية

حساب حساب آلة عملية يجعل نموذج عبر إعداد مزود مراقبة و عملية محلي طاولة وجه.DSH مشترك قدرة تسمية لـ **computer use(حساب حساب آلة عملية)**؛**Cua Driver** هو فوق تنقل تنفيذ اسم.

## اختيار مزود

في نفس تركيب في تركيب [`dsh-computer-use`](../../packages/computer-use/computer-use/README.ar.md) و واحد مزود. اثنان عدد Cua Driver مزود كل هو عام إصدار إلى npm فعلي تحقق صفة حزمة، متساو يحتاج صريح تفعيل.

| مزود | وقت التشغيل |
|---|---|
| [Cua Driver MCP](../../packages/experimental/computer-use-cua-driver-mcp/README.ar.md) | عبر MCP اتصال قد تثبيت `cua-driver` يمكن تنفيذ ملف |
| [Cua Driver أصلي](../../packages/experimental/computer-use-cua-driver-native/README.ar.md) | مع npm اعتماد تثبيت منصة أصلي وقت التشغيل |

كل مزود توفير فوق تنقل أداة دليل. مشترك خدمة فقط تسجيل اسم، و رفض أي ثاني عدد مزود، يشمل استخدام نفسه اسم آخر عدد نسخة. خدمة لا يتضمن عام طاولة وجه عملية طريقة أو نموذج تحكم اختيار جهاز.

## دورة الحياة و طاولة وجه مشترك

مزود في إغلاق أداة و ذاتي لديه مورد خلال إبقاء تسجيل. بدء فشل سوف تحرير هذا مرة محاولة تجربة تسجيل.MCP مزود في إعادة وصل خلال إبقاء تسجيل.

واحد قد تسجيل مزود لن لـ بعض عدد Session مسبق إبقاء طاولة وجه. استدعاء جهة مسؤول تنسيق ضبط عبر Session و مستقل DSH عملية كامل مراقبة، عملية و تحقق مسار. إلغاء استدعاء لا يمكن سحب إلغاء طاولة وجه قد استلام إلى إدخال.

## نتيجة و منصة اشتراط

أداة استخدام معتاد قاعدة تنفيذ مسار و Session سجل. دعم حمل رسم مثل نموذج توجيه في تركيب مرفق عنصر تخزين وقت استقبال حفظ دائم قطع رسم؛ لا دعم حمل رسم مثل توجيه استقبال قائم MCP رسم مثل تشخيص. مزود README مسؤول شرح تثبيت، إذن و منصة حد.

[قرار سجل](../../.agents/notes/implemented/architecture/2026-09-12-computer-use-provider-registration.ar.md) حل تفسير فقط مسؤول تسجيل خدمة و اثنان عدد Cua Driver تجميع صار.

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

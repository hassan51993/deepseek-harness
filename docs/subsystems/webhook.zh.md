# Webhook runtime

[English](webhook.md) | العربية

Webhook فرعي نظام سوف يأخذ قد عبر هوية تحقق خارجي تسليم تحويل لـ اختياري عادي أصل Session. مزود مهايئ يملك هوية تحقق و عام JSON استقبال؛ تلقي معلومة مهمة برنامج تحويل قاعدة يملك شرط و خارجي استدعاء؛`ctx.webhookRuntime` يملك عودة ضبط دورة الحياة و أساس في Workspace Session إنشاء.[قد تنفيذ قرار](../../.agents/notes/implemented/feature/2026-08-22-fire-and-forget-webhook-sessions.zh.md) سجل runtime لـ أي لا إبقاء تسليم أو إتمام حالة.

## مشترك قيمة

`WebhookRuleId`،`WebhookSourceId` و `WebhookDeliveryId` هو لا نفاذ واضح نص. تسليم id فقط لأجل مصدر معلومة:runtime حيث لا تخزين أيضا لا مقابل هو ذهاب إعادة.

`WebhookEventMap` يمكن حسب مزود نوع صنف دمج توسيع.`WebhookEventOf<K>` سوف اختيار معروف مزود حدث، لا فإن وصل قبول عام بلا ضرر JSON، من بينما يجعل شجرة خارج مهايئ بلا حاجة تعديل runtime حزمة.

`VerifiedWebhookDelivery<K>` يتضمن `kind`، قد إعداد `source`، مزود `deliveryId`، مواصفة تحويل `event` و غير سالب أمان كامل عدد `receivedAt`.runtime سوف أولا تحقق، قسم مغادرة و تجميد ربط كامل قيمة، مجددا يأخذ هو توزيع إعطاء كثير عدد قاعدة.

`WebhookRule<K>` يتضمن وحيد id، مزود نوع صنف و `run(delivery, signal)`. عودة ضبط يمكن تنفيذ مهمة معنى تلقي معلومة مهمة شفرة. هو إرجاع `null` أو واحد `WebhookSessionRequest`، و كما مختلف خطوة عمل إذا ينبغي في تسجيل إزالة وقت إيقاف، حينئذ يجب مراقبة signal.

`WebhookSessionRequest` اشتراط قطعا مقابل `workspacePath`، عنوان، نص نص التوجيه،agent preset و permission preset. اختياري `model` سوف إشارة تحديد واضح مزود/نموذج توجيه و اختياري إخراج token حد أعلى، و استخدام هذا مهايئ افتراضي دفع إدارة قوي درجة. حذف وقت سوف لقطة يتضمن دفع إدارة قوي درجة كامل حالي نشر اختيار، مباشر إلى أول عدد طلب سجل حمل دائم header.

## Fire-and-forget توزيع

`dispatch()` سوف لقطة مطابقة قاعدة، ذاك هذا مستقل أرض ضبط درجة كل قاعدة، و في أي عودة ضبط تسوية قبل إرجاع. رمي خروج و رفض حسب قاعدة قسم آخر يتم يتضمن. تسجيل disposer سوف أولا إزالة قاعدة، مجددا في توقف و ترتيب فارغ نشط حركة استدعاء، لذلك لاحق تسليم لا يمكن دخول صحيح في إزالة شفرة.

runtime لا يوجد طابور صف، إعادة محاولة، ذهاب إعادة، تنفيذ حالة، انهيار انهيار إعادة وضع،Agent حالة مستمع أو إتمام نتيجة. تكرار تسليم ممكن إنشاء تكرار Session. وحيد نشط حركة عملية جدول هو خاص teardown تسجيل حساب، و مع عملية إزالة فقد.

## Session إنشاء

غير `null` نتيجة سوف في مختلف خطوة مسبق فحص قبل توليد لقطة.runtime سوف تحقق permission و agent preset، تحليل أو إنشاء مواصفة Workspace، إنشاء Session cwd انتظار في Workspace مسار Agent، في إصدار قبل تركيب الذي اختيار agent preset، و في تطبيق إذن، عنوان و ابتدائي follow-up قبل حمل دائم مرفق إضافة Session.

follow-up هو عادي حمل دائم user-role رسالة، استخدام `source.kind: "webhook"`، و يحمل مزود/مصدر/تسليم/قاعدة مصدر معلومة. ذلك inbox إدراج دخول يتم قبول وقت إيداع webhook عملية.runtime لا تنفيذ خاص خاص flush، أيضا لا انتظار جولة؛ بعد تطبيق عادي Session persistence و Agent دورة الحياة.

مرفق إضافة فشل سوف في نص التوجيه ظهور قبل تحرير جديد Agent. مرفق إضافة بعد، نص التوجيه وصل قبول قبل فشل سوف محاولة تجربة انفصال مغادرة Workspace و تحرير Agent، كما لن يحل محل أصلي خطأ. مسبق فحص خلال تلقائي إنشاء Workspace سوف إبقاء، لأن آخر عدد تزامن استدعاء من ممكن قد استخدام هو.

## GitHub مهايئ

`@deepseek-ai/dsh-webhook-github` في حقن WebServer فوق تسجيل دقيق توجيه، لـ كل مرة طلب تحليل اعتماد مرجع، في تحليل قبل تحقق لم تعديل `application/json` body، و في داخل تخزين توزيع بعد قيام أي إرجاع `202`. هو مواصفة تحويل حدث حفظ إثبات لـ قد توقيع بلا ضرر JSON كائن؛ قاعدة مسؤول تحقق ذاتي ذات إزالة استهلاك حدث خاص تحديد حقل.

[GitHub مراجعة إشارة جنوب](../user/guide/github-review.zh.md) يأخذ هذا توجيه تركيب في عزل ثاني عدد WebServer فوق، لذلك كشف webhook مدخل لن كشف متصفح API.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxwebhookruntime--webhookruntime"></a>

### `ctx.webhookRuntime` — `WebhookRuntime`

Fire-and-forget rule runtime. Session creation is the only built-in action.

```ts cordis-catalog
/**
 * Register one trusted programmatic rule.
 * @param rule - unique id, provider kind, and arbitrary callback.
 * @returns awaitable effect disposer that aborts and drains this rule's active callbacks.
 */
register<K extends string>(rule: WebhookRule<K>): () => Promise<void>

/**
 * Start every currently matching rule and return before any callback settles.
 * @param delivery - authenticated provider data; snapshotted before dispatch.
 * @throws synchronously when the runtime is closing or the delivery is malformed.
 */
dispatch<K extends string>(delivery: VerifiedWebhookDelivery<K>): void
```

Source: [`packages/webhook/webhook/src/index.ts`](../../packages/webhook/webhook/src/index.ts)
<!-- END GENERATED cordis-surface -->

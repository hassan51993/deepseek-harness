# بيئة تشغيل Webhook

[English](webhook.md) | العربية

يحوّل نظامُ Webhook التسليماتِ الخارجية الموثَّقة إلى جلسات جذرية عادية اختيارية. فمهايئاتُ المزوّدين تملك التوثيقَ والاستقبالَ العام لـJSON؛ والقواعدُ البرمجية الموثوقة تملك الشروطَ والنداءاتِ الخارجية؛ ويملك `ctx.webhookRuntime` عمرَ ردّ النداء وإنشاءَ الجلسات المسنَد إلى مساحة عمل. ويسجّل [القرارُ المنفَّذ](../../.agents/notes/implemented/feature/2026-08-22-fire-and-forget-webhook-sessions.ar.md) سببَ ألّا تحفظ بيئةُ التشغيل حالةَ تسليم أو اكتمال.

## القيم المشتركة

`WebhookRuleId` و`WebhookSourceId` و`WebhookDeliveryId` سلاسلُ معتمة. ومعرّفُ التسليم يسجّل معرّفَ المزوّد وحده: فبيئةُ التشغيل لا تخزّنه ولا تزيل تكرارَه.

و`WebhookEventMap` قابلةٌ للتوسعة بالدمج حسب صنف المزوّد. ويختار `WebhookEventOf<K>` حدثَ مزوّد معروفًا، وإلا قبِل JSON عامًّا بلا فقد، فيتيح مهايئًا خارج الشجرة بلا تغيير حزمة بيئة التشغيل.

ويحتوي `VerifiedWebhookDelivery<K>` على `kind` و`source` المضبوط و`deliveryId` من المزوّد و`event` الموحَّد و`receivedAt` عددًا صحيحًا آمنًا غير سالب. وتتحقق بيئةُ التشغيل من القيمة كلها وتفصلها وتجمّدها قبل أن توزّعها على أكثر من قاعدة.

ويحتوي `WebhookRule<K>` على معرّف فريد وصنف مزوّد و`run(delivery, signal)`. وقد ينفّذ ردُّ النداء شفرةً موثوقة كيفما كانت. وهو يعيد `null` أو `WebhookSessionRequest` واحدًا، وعليه أن يراقب الإشارةَ في العمل اللاتزامني الذي ينبغي أن يتوقف حين يُفرَّغ التسجيل.

ويشترط `WebhookSessionRequest` مسارَ `workspacePath` مطلقًا وعنوانًا ومطالبةً نصية وpreset وكيل وpreset أذونات. ويسمّي `model` الاختياري مسارَ مزوّد ونموذج صريحًا مع سقف اختياري لرموز الخرج، ويستعمل الافتراضَ الاستدلالي لذلك المهايئ. وحذفُه يلتقط اختيارَ النشر الحالي كاملًا، بما فيه جهدُ الاستدلال، حتى يسجّل أولُ طلب ترويستَه الدائمة.

## التوزيع بلا متابعة

يلتقط `dispatch()` القواعدَ المطابِقة، ويجدول كلًّا منها مستقلةً، ويعود قبل أن يستقر أيُّ ردّ نداء. والرميُ والرفضُ محتويان لكل قاعدة. ويزيل التخلصُ من التسجيل القاعدةَ قبل إجهاض نداءاتها النشطة وتصريفها، فلا يستطيع تسليمٌ لاحق دخولَ شفرة قيد التفريغ.

ولا طابورَ لبيئة التشغيل ولا إعادةَ محاولة ولا إزالةَ تكرار ولا حالةَ تنفيذ ولا إعادةَ تشغيل بعد الانهيار ولا مستمعًا لحالة الوكيل ولا نتيجةَ اكتمال. وقد ينشئ التسليمُ المتكرر جلساتٍ متكررة. والجدولُ الوحيد للعمليات النشطة هو مسكُ دفاتر تفكيك خاص يزول مع العملية.

## إنشاء الجلسة

تُلتقط النتيجةُ غير الفارغة قبل التمهيد اللاتزامني. وتتحقق بيئةُ التشغيل من presets الأذونات والوكيل، وتحلّ مساحةَ العمل المعيارية أو تنشئها، وتنشئ وكيلًا يساوي مسارُ عمل جلسته مسارَ مساحة العمل، وتركّب preset الوكيل المختار قبل النشر، وتربط الجلسةَ ربطًا دائمًا قبل تطبيق الأذونات والعنوان والمتابعة الأولى.

والمتابعةُ رسالةٌ دائمة عادية بدور المستخدم تحمل `source.kind: "webhook"` ومعرّفاتِ المزوّد والمصدر والتسليم والقاعدة. وإدراجُها المقبول في صندوق الوارد يودِع عمليةَ الـwebhook. ولا تدفع بيئةُ التشغيل الجلسةَ خصيصًا ولا تنتظر الجولة؛ ويسري بعد ذلك حفظُ الجلسة الدائم المعتاد ودورةُ حياة الوكيل.

ويتخلص الربطُ الفاشل من الوكيل الجديد قبل وجود مطالبة. أما الفشلُ بين الربط وقبول المطالبة فيحاول فصلَ مساحة العمل والتخلصَ من الوكيل بلا أن يحلّ محلَّ الخطأ الأصلي. وتبقى مساحةُ العمل المنشأة تلقائيًا أثناء التمهيد لأن مستدعيًا آخر متزامنًا قد يستعملها سلفًا.

## مهايئ GitHub

تسجّل `@deepseek-ai/dsh-webhook-github` مسارًا بعينه على WebServer محقون، وتحلّ مرجعَ اعتمادها لكل طلب، وتتحقق من جسم `application/json` بلا مساس قبل تحليله، وتعيد `202` فورَ التوزيع في الذاكرة. ويضمن حدثُها الموحَّد كائنَ JSON موقَّعًا بلا فقد؛ وتتحقق القواعدُ من حقول الحدث التي تستهلكها.

ويركّب [دليلُ مراجعة GitHub](../user/guide/github-review.ar.md) هذا المسارَ على WebServer ثانٍ معزول، فلا يؤدي كشفُ مدخل الـwebhook إلى كشف واجهة المتصفح البرمجية.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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

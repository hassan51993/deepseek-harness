# Agent Note: Windows coverage lane تحديد صفة تأكيد و dispose ميزانية

Status: implemented
Archived: 2026-09-04

[English](2026-08-31-windows-coverage-flaky-test-budgets.md) | العربية

## Problem

`windows node 24 / coverage` lane لا في `all-checks-passed.needs` داخل، هو لأن هو لا مستقر، بينما لا هو هو ربط نقاش لا إعادة يلزم. لا مستقر قدوم ذاتي واحد مجموعة مقابل وقت ترتيب حساس شعور اختبار: في فارغ خامل runner فوق عبر، في تنازع انتزاع runner فوق فشل. اثنان نوع فشل شكل في كثير عدد PR(3184،3185،3179،3181) عكس تكرار ظهور، و إطلاق هو جمع PR diff غير متصل:

1. `packages/session/session-projection-cache/tests/cache.spec.ts` —— `SessionProjectionCache` كتابة هو fail-soft كما fire-and-forget(حدث مستمع ضبط `void flushSoft(...)`،`coldSnapshot` ضبط `void this.put(...)`). ستة عدد اختبار في ثابت `settle()` 40 ms بعد تأكيد حفظ دائم نتيجة. تنازع انتزاع runner فوق كتابة 40 ms داخل لا يوجد ترتيب فارغ،mock تأكيد بـ `AssertionError: expected "Mock" to be called with arguments: [ StringContaining{…} ]` فشل (في `expect(warn).toHaveBeenCalledWith(...)` سطر) ، أو stored-row تأكيد قراءة إلى قديم قديم cut. هذا صحيح هو كل مرة تلقي أثر run كل فشل cache.spec اثنان عدد حالة استخدام.
2. `packages/sdk/client/tests/sdk-client.spec.ts` و `packages/subagent/subagent-dsh-sdk/tests/subagent-dsh-sdk.spec.ts` —— dispose سلم فرعي اختبار بدء حقيقي عملية فرعية و نقل دخول ضيق تأكيد ميزانية (`disposeGraceMs: 100`–`300`). تنازع انتزاع runner فوق SIGKILL بعد عملية فرعية خروج حافة حافة ممكن متأخر في ميزانية وصول، في هو `close()` بـ `runtime process did not exit within 100ms after SIGKILL` reject، أي جعل عملية فرعية قد يتم صحيح تأكيد عودة استلام. منتج افتراضي هو `disposeEofGraceMs: 6000` / `disposeGraceMs: 3000`؛ ضيق قيمة هو اختبار فقط لـ رفع سرعة اختيار، لكن يأخذ بطيء عودة استلام خطأ تقرير صار dispose فشل.

آخر لديه واحد تاريخ صفة نسبة التغطية نقص فتحة في `packages/workflow/workflow-worker-thread`(host.ts/index.ts منخفض في per-file 100% بوابة) ، سبق يتم عند عمل هذا lane لا مستقر واحد جزء تتبع أثر. هذا مرة ضبط فحص اكتشاف هذا آلة تكرار الآن هو DSH جلسة بيئة زائف كائن بينما غير شفرة نقص وقوع: جلسة توجيه خروج إشارة نحو DSH staging checkout tsconfig `TSX_TSCONFIG_PATH`، يأخذ tsx-in-worker مقابل workspace bare specifier تحليل إعادة تحديد نحو إلى staging فرعي هذا و فقد إسقاط named exports.unset `TSX_TSCONFIG_PATH` بعد `workflow-worker-thread.spec.ts` 54/54 عبر.Windows جانب مقابل هذا نقص فتحة تقرير إبلاغ مبكر في ReFS clone تثبيت (#3342) ، هذا بعد لم مجددا ظهور؛ أي تكرار إرسال كل حاجة Windows جانب تدريجي سطر لم تغطية بيان عندئذ قدرة عودة بسبب.

## Decision

يأخذ cache.spec.ts داخل كل ثابت انتظار تأكيد تعديل صار استخدام `vi.waitFor` جولة استفسار يمكن مراقبة نتيجة، مهلة 5 s(و هذا ملف ذاتي `7746ed64f0` بدء في cold-read write-back حالة استخدام في استخدام نمط متسق). اثنان عدد mock تأكيد حالة استخدام جولة استفسار تحذير إبلاغ استدعاء ذاته:

```ts ignore-check
await vi.waitFor(() => {
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('turn/end write for "fail-soft" failed'))
}, { timeout: 5_000 })
```

جولة استفسار تأكيد في شرط دائم بعيد لا صار قيام وقت ما زال سوف فشل——سالب مثال (غير ممكن قدرة نص) مهلة و جعل اختبار فشل——الذي بـ fail-soft عقد نحو ما زال يتم قوي صنع.

مقابل dispose سلم فرعي اختبار، تعديل استخدام منتج افتراضي ميزانية، ذهاب إسقاط فقط يخص اختبار ضيق قيمة:

- `sdk-client.spec.ts`:`disposeGraceMs` `100` → `3_000`(bounds-profile حالة استخدام) ،`1_000` → `3_000`(SIGTERM سلم فرعي) ،`300` → `3_000`(SIGKILL ترقية).
- `subagent-dsh-sdk.spec.ts`: تزامن تشخيص عزل حالة استخدام تعديل استخدام `run.ts` `DEFAULT_SHUTDOWN_TIMEOUT_MS` / `DEFAULT_DISPOSE_EOF_GRACE_MS` / `DEFAULT_DISPOSE_GRACE_MS`، بينما لا هو `100`/`200`/`200`.

dispose.spec.ts سالب مثال (`disposeGraceMs: 10`،fake child دائم لا خروج) ما زال تحقق حق صحيح بطاقة إقامة عملية فرعية سوف في ميزانية داخل جعل سلم فرعي فشل؛ فقط لديه حقيقي عملية فرعية حالة استخدام مرور ضيق ميزانية يتم وضع عرض.

## Verification

- cache.spec.ts: محلي 17/17 عبر؛ سالب مثال (غير ممكن قدرة تحذير إبلاغ نص) مرور `vi.waitFor` مهلة فشل.
- sdk-client.spec.ts: محلي 42/42 عبر؛dispose.spec.ts 16/16 عبر (10 ms refused/accepted سالب مثال ما زال صحيح تأكيد فشل).
- subagent-dsh-sdk.spec.ts: محلي 55/55 عبر.
- workflow-worker-thread.spec.ts:unset `TSX_TSCONFIG_PATH` بعد محلي 54/54 عبر——تاريخ نسبة التغطية نقص فتحة لم تعديل شفرة.
- CI on this PR:windows coverage lane ينبغي لم يعد بسبب هذه اختبار فشل.

## Alternatives considered

**إبقاء ثابت settle نافذة و إعادة ركض flaky lane.** إعادة ركض نهائي سوف عبر، لكن كل تلقي أثر PR كل يلزم دفع خروج مرة إعادة ركض دورة مدة،lane ما زال يتم ترتيب حذف في `all-checks-passed.needs` خارج. جولة استفسار تأكيد في كتابة و وقت وقت صفر صار هذا، و تماما إزالة حذف وقت ترتيب اعتماد، و هذا ملف ذاتي `7746ed64f0` بدء قد لديه `vi.waitFor` نمط متسق.

**إبقاء ضيق dispose ميزانية و يأخذ SIGKILL مهلة عند عمل runner لذا عائق.** حق صحيح بطاقة إقامة عملية فرعية ما زال يجب يجعل سلم فرعي فشل——dispose.spec.ts fake-child سالب مثال قد استخدام 10 ms تغطية. حقيقي عملية فرعية حالة استخدام وضع عرض إلى منتج افتراضي، لأن هو جمع قياس هو سلم فرعي ترقية مسار بينما لا هو صفة قدرة حد أعلى، تنازع انتزاع runner فوق خروج حافة حافة لا هو شفرة نقص وقوع.

## Consequences

windows coverage lane إبقاء per-file 100% بوابة، بينما ذلك اختبار لم يعد اعتماد 40 ms جدار ساعة نافذة أو 100–300 ms SIGKILL تأكيد.cache.spec اثنان عدد mock تأكيد حالة استخدام و subagent-dsh-sdk تزامن حالة استخدام في runner تنازع انتزاع تحت لم يعد فشل،lane flake معدل تحت خفض بينما لا تقليل ضعيف أي تأكيد: كل جولة استفسار شرط مهلة ما زال فشل، كل dispose سالب مثال ما زال قيد بطاقة إقامة عملية فرعية.

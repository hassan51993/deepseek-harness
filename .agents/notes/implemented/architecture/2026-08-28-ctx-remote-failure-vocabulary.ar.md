# Agent Note: One Remote failure vocabulary for ctx.remote

Status: implemented

[English](2026-08-28-ctx-remote-failure-vocabulary.md) | العربية

## Problem

كل Remote owner حزمة كل منها صيانة واحد طقم فشل وجه: واحد `XxxErrorDetailsMap` واجهة، من هو إرسال توليد `XxxError` union، و واحد خروج فتحة خريطة دالة، يأخذ مجال داخل خطأ صنف (`UnknownPresetError`،`PresetMountError`،`SessionTitleInvalidError` انتظار) قلب ترجمة صار wire فشل قيمة.`@deepseek-ai/dsh-typert-protocol` معا يحمل اثنان عدد فشل صنف——owner رئيسي حركة فوق تقرير استخدام `TypertRemoteFailure`،lookup resolver إنتاج استخدام `TypertLookupFailure`——بينما `@deepseek-ai/dsh-client-connection` أيضا إبقاء ثاني نسخة typed عرض `RpcErrorDetailsMap`، يأخذ `agent-preset-not-found`،`session-not-found` هذا صنف مجال رمز صلب تحرير رمز دخول تحميل جسم طبقة.

في هو واحد رمز معا وجود ثلاثة موضع:owner جدول، تحميل جسم typed عرض، و مستهلك لـ ضيق تحويل بينما كتابة union أو cast(`result.error as SessionError`). إضافة جديدة واحد مجال رمز يلزم تعديل ثلاثة موضع، عبر مجال تحويل وصف واحد آخر شخص رمز فإن يلزم يأخذ مقابل جهة رمز نسخ دخول ذاتي ذات جدول——`SessionErrorDetailsMap` حينئذ استلام تحرير `agent-preset-*`،`subagent-*`،`workspace-not-found` خمسة عدد هو مجال رمز.

فشل معلومة أيضا في اثنان موضع يتم ضغط مستو.Gateway ذاتي ذات 17 عدد تركيب إعداد فشل (لم تركيب طريقة، اختلاف معنى endpoint،lookup provider لا مطابقة، نتيجة لم مرور codec انتظار) واحد قاعدة بـ `code: 'internal'` فوق wire،client لا يمكن يأخذ تركيب إعداد bug و عمل خدمة رفض منطقة قسم فتح؛owner أيضا خروج في منع صد يأخذ غير متصل استثناء مسبق طي صار ذاتي ذات مجال رمز، في هو واحد حق صحيح Host bug سوف بـ واحد نظر بدء قدوم دمج إدارة مجال فشل وصول استدعاء جهة.

Host ثابت واقع نفس مثال التفاف مرور `ctx.remote`:Host home أخذ ذاتي `(ctx.get('connection') as ConnectionHandle).generation.getSnapshot()?.host.home`، أي فقط حاجة واحد بند ثابت واقع صفحة كل نيل حقن تحميل جسم و إدارة حل هو generation store.

## Decision

`@deepseek-ai/dsh-typert-protocol` توجيه خروج وحيد فشل صنف `RemoteError<Code>`: واحد حق `Error`، حمل فقط قراءة `code` و `details`، بنية علامة `isDSHRemoteError`، و معيار `ErrorOptions`(`cause` فقط في عملية داخل صالح). رمز و details مقابل علاقة استلام دخول واحد ورقة merge-extensible `RemoteErrorDetailsMap`؛`RemoteFailure` هو حسب رمز قسم نشر نسخة union،`RemoteResult<T>` شكل حالة ثابت.

```text
export class RemoteError<Code extends RemoteErrorCode = RemoteErrorCode> extends Error {
  readonly isDSHRemoteError: true = true
  constructor(readonly code: Code, message: string,
    readonly details: RemoteErrorDetailsMap[Code], options?: ErrorOptions)
}
export type RemoteFailure = { [C in RemoteErrorCode]: RemoteError<C> }[RemoteErrorCode]
export type RemoteResult<T> = { ok: true; value: T } | { ok: false; error: RemoteFailure }
```

فشل نقطة مباشر `throw new RemoteError(code, message, details)`. مجال داخل لم يعد بناء خطأ صنف بيت عائلة، أيضا لم يعد كتابة خروج فتحة خريطة دالة؛ فقط لديه «يأخذ مهمة معنى provider استثناء عودة صنف» هذا واحد نوع مشهد إبقاء واحد `catch`، و في منها `throw new RemoteError(code, messageOf(error), details, { cause: error })`. عملية داخل ما زال يحتاج إزالة استهلاك قائم استثناء صنف (`ApiSessionCwdConflict` انتظار) إبقاء لـ لا توجيه خروج خاص صنف، في خروج فتحة واحد سطر تحويل صار `RemoteError`.

رمز هو `<دلالة مجال>/<إدارة من>` شكل صيغة نص:`session/not-found`،`gateway/cancelled`،`workspace/invalid-path`،`agent-preset/locked`. بادئة و wire namespace نفس ريح إطار، قراءة من من رمز ذاته حينئذ قدرة نظر خروج هو يخص من، عبر مجال تحويل وصف وقت أيضا لم يعد حاجة واحد آخر لي بلا بادئة اسم.

## Code ownership

واحد رمز فقط لديه واحد إعلان موضع، سقوط نقطة من «من إنتاج هو» و «إعلان مقابل من يمكن بلوغ» مشترك نفس قرار——إعلان دمج فقط في زيادة تكملة ملف دخول حالي program وقت توليد فاعلية، الذي بـ صحيح بيت يجب هو كل إنتاج من كل قدرة نظر رؤية حزمة:

- **تحميل جسم رمز**:`gateway/bad-request`،`gateway/cancelled`،`gateway/internal` من protocol إعلان، شخص شخص يمكن بلوغ.
- **Gateway تركيب إعداد رمز**:17 عدد `gateway/*` من `packages/api/gateway/src/remote-error-codes.ts` إعلان،details موحد واحد لـ `TypertGatewayFaultDetails { endpoint, field? }`؛ هذا وحدة face-neutral،Host و Client اثنان وجه كل منها import، لذلك اثنان عدد program يرى نفس دفعة بند.
- **عبر حزمة مشترك إنتاج**: اثنان عدد و بـ فوق مختلف حزمة رمي نفس عدد رمز وقت، إعلان سقوط إلى مزدوج جهة كل قد اعتماد الأكثر منخفض طبقة.`session/not-found` سقوط `@deepseek-ai/dsh-session`(session-controller و workspace-controller كل اعتماد هو) ،`workspace/not-found` سقوط `@deepseek-ai/dsh-workspace`(session-controller و workspace-controller بين لا يوجد اعتماد حافة، قدرة حزمة هو وحيد مشترك نفس تحت طبقة).
- **مفرد واحد إنتاج من**: فقط لديه واحد حزمة رمي رمز سقوط إنتاج من حزمة.`subagent/not-found` و `agent-preset/conflict` لذلك سقوط session-controller——كل مستودع فقط لديه هو رمي هذا اثنان عدد رمز،subagent و agent-presets رمز جدول داخل كل لا يوجد هو جمع.

مشترك هو تحقق منطق، لا هو رمز.`session/invalid-time-zone` و `subagent/invalid-time-zone` هو اثنان عدد مجال كل منها إعلان، كل منها رمي خروج اثنان عدد رمز، اثنان عدد طرف نقطة مشترك استخدام `@deepseek-ai/dsh-util-time` `canonicalClientTimeZone()` فعل مواصفة تحويل؛client مقابل هذا عدد رمز لا يوجد فرع دلالة، تفكيك رمز صار هذا هو صفر، بينما دمج صار واحد رمز حينئذ سوف إعادة صنع صنع يمكن بلوغ صفة مشكلة.

## Discrimination by code

حكم آخر واحد قاعدة قراءة `code`، من لا استخدام `instanceof`.Client و Host هو اثنان عدد مستقل تحزيم program،worker نقل أيضا سوف يأخذ صفحة جانب مجددا قسم مرة حزمة، لذلك نفس عدد صنف سوف وجود كثير نسخة فرعي هذا، عبر فرعي هذا أصل نوع سلسلة هوية لا صار قيام. آلية طبقة استخدام protocol `remoteErrorOf(value)` قراءة بنية علامة إضافة واحد نص `code`،Gateway client face آخر خارج توجيه خروج `isRemoteFailure(error)` توفير مستهلك في catch داخل حكم آخر؛ اثنان من كل فقط نظر هذا اثنان عدد حقل، لا نظر صنف——وصل `instanceof Error` كل لا اشتراط، لأن آخر عدد realm رمي خروج Error نفس مثال عبر لا مرور هو.

عمل خدمة شفرة عبر معتاد وصل هذا اثنان عدد دالة كل لا حاجة:`RemoteResult` `ok: false` فرع قد هو نوع تحويل `RemoteFailure`،`if (result.error.code === 'session/not-found')` حينئذ يأخذ `details` ضيق تحويل إلى هذا رمز شكل حالة، بلا حاجة cast. حاجة نحو فوق رمي محطة نقطة مباشر `throw result.error`——هو هو حق `Error`، مكدس و `message` كل صار قيام.

client وجه لا بنية صنع `RemoteError`: وحيد مثال خارج هو Gateway client face ذاته، هو في `invoke()` داخل حسب wire بيانات إعادة بناء نسخة، في تدفق حد يأخذ تحميل جسم throw طي دخول نفس مفردات. اختبار بديل ذات يلزم بنية صنع فشل قيمة وقت من `@deepseek-ai/dsh-client-test-runtime` أخذ `RemoteError`، بينما لا هو يجعل client حزمة قيمة جذب دخول protocol. تأكيد استخدام `toMatchObject` حكم code(لا بد يلزم وقت إضافة details حقل):`RemoteError` هو `Error`،own key تجميع دمج و قديم حرف وجه كمية مختلف،`toEqual` سوف فشل.

## Fixed Host facts

`ctx.remote.$host` كشف اثنان بند ثابت واقع:`home: string | undefined` و `isLoopback: boolean`. هو هو Client Remote service فوق getter، قراءة هو service بنية صنع مدة أخذ نيل connection جملة مقبض——`home` قدوم ذاتي generation لقطة ready frame(ready قبل هو `undefined`) ،`isLoopback` قدوم ذاتي تحميل جسم. لا يوجد store، لا يوجد حجز قراءة، لا يوجد generation حساب عدد جهاز.

إعادة وصل بعد تحديث جديد مشي قائم إشارة:Client Remote في وصل فوق وقت emit `connection/reset`، حاجة إعادة أخذ مستهلك استماع هو أو كل مجال ذاتي ذات remote event، بينما لا هو يجعل `$host` تغيير صار واحد يمكن حجز قراءة كائن. لذلك مستهلك لم يعد حقن `connection`:`@deepseek-ai/dsh-client-connection` إزالة استهلاك أبيض اسم مفرد استلام تقليص إلى hmr،frontend-static،bundle/web-app،session-log-export،webworker-runtime،gateway و api-remotes تركيب إعداد.

## What the wire carries

envelope ثابت:wire فوق ما زال هو `{ code, message, details }` بيانات،`RemoteError` هو اثنان طرف كل منها عملية داخل تحميل جسم.Host جانب `rpcFailure()` استلام جمع لـ اثنان فرع——بنية تعرف آخر خروج `RemoteError` أصل مثال تحرير رمز، ذلك بقية طي صار `gateway/internal`؛ تحميل جسم إشارة إلغاء أيضا مشي نفس مفردات (`RemoteInvocationCancelled` صنف كامل جسم حذف، أربعة عدد throw نقطة تعديل رمي `RemoteError('gateway/cancelled', …)`).

ثلاثة بند wire مرئي سلوك مع لـ تحديد.Gateway 17 عدد تركيب إعداد رمز حسب دلالة فوق wire،client لذلك قدرة يأخذ «طريقة لم تركيب» و «عمل خدمة رفض» قسم فتح معالجة.owner لا مسبق طي غير متصل استثناء: لم عودة صنف throw تسليم إعطاء Gateway طي مرة `gateway/internal`، تشخيص سلسلة إبقاء في `message` داخل.client واحد عنصر استدعاء يتم استدعاء جهة abort وقت جواب `gateway/cancelled`، أي جعل محلي throw انتزاع في wire نحو إرجاع قبل فوز نيل تنافس تنازع، أيضا و Host سوف إعطاء خروج رمز متسق.

تحميل جسم طبقة فقط إبقاء فتح وضع wire شكل حالة.`@deepseek-ai/dsh-client-connection` `ConnectionRpcFailure`/`ConnectionRpcResult` لا يحتوي أي مجال رمز معرفة تعرف، ذلك `transportError()` إنتاج خروج `gateway/internal`؛typed عرض صحيح بيت من هذا فقط لديه protocol `RemoteFailure`.

## Alternatives considered

**كل مجال واحد طقم `RemoteFault` خطأ صنف بيت عائلة.** يجعل كل مجال (أو كل رمز) لديه ذاتي ذات `Error` فرعي صنف، نظر بدء قدوم أكثر OO، لكن هو يأخذ «رمز» هذا واحد بند معلومة تفكيك صار صنف هوية إضافة حقل اثنان موضع، عبر realm أيضا فقط قدرة تراجع عودة حكم حقل——في هو صنف هوية يصبح صاف خالص سالب تحمل: كل مجال يلزم صيانة فرعي صنف، توجيه خروج هو، في وثيقة داخل حل تفسير هو، بينما مستهلك ما زال فقط قدرة حكم code. مفرد صنف إضافة واحد ورقة رمز جدول يأخذ هذا نسخة إعادة كمية تبديل صار واحد سطر إعلان.

**في استدعاء نقطة إضافة `attempt` / `unwrap` / `remoteFailureOf` حزمة تركيب دالة.** حزمة تركيب قدرة يجعل استدعاء نقطة قليل كتابة واحد `if`، لكن هو يأخذ `RemoteResult` هذا عدد canonical شكل حالة تغيير صار «أولا مرور واحد طبقة مكتبة دالة» ، اثنان نوع ريح إطار سوف طويل مدة و تخزين؛`unwrap` أيضا سوف يأخذ «فشل هو صحيح معتاد نتيجة» إعادة تغيير صار استثناء تدفق، و Remote وجه لا reject عقد نحو خلف طريق بينما انطلاق. يتم إبقاء `remoteErrorOf` فقط خدمة آلية طبقة و اختبار تأكيد، عمل خدمة شفرة أخذ إلى يلزم ما هو قد نوع تحويل `result.error`، يلزم ما هو ذاتي ذات رمي، لا حاجة هو.

**`host/updated` حدث إضافة حجز قراءة صيغة `$host` store.** حجز قراءة قدرة في Host home تغير وقت تلقائي تحديث جديد، لكن home و isLoopback في واحد بند اتصال داخل هو ثابت واقع، لـ هو جذب دخول store،generation و حجز قراءة دورة الحياة، انتظار في يجعل كل فقط تفكير قراءة مرة صفحة كل تحمل تحمل واحد طقم حالة إدارة. إعادة وصل هو قد لديه إشارة (`connection/reset`) ، عمل خدمة بطلان مشي كل مجال remote event، ثابت واقع إبقاء عادي قيمة قراءة.

**يأخذ لا فوق wire محلي فشل أيضا قبول دخول رمز جدول.** مثال مثل ui-goal `no-current-goal`: هو من لا عبر عملية، قبول دخول رمز جدول سوف يجعل مشترك مفردات خلط دخول فقط لديه واحد client حزمة صلة قلب بند، أيضا سوف خطأ توجيه قراءة من بـ لـ هو لديه wire دلالة. محلي فشل إبقاء كل منها محلي نوع، رمز جدول فقط وصف Remote مفردات.

## Consequences

إضافة جديدة واحد مجال رمز هو واحد موضع declaration merging إضافة واحد throw: لم يعد لديه خريطة دالة، خطأ صنف، تحميل جسم typed عرض ثلاثة موضع ربط حركة. بديل قيمة هو سقوط نقطة حاجة حكم قطع——صحيح بيت يجب مقابل كل إنتاج من يمكن بلوغ، بينما هذا بند حكم قطع فقط لديه في حق ظهور ثاني عدد إنتاج من وقت عندئذ إظهار الآن؛`workspace/not-found` حينئذ هو هذا مثال من workspace-controller نقل إلى قدرة حزمة، و لـ هذا إعطاء `@deepseek-ai/dsh-workspace` إضافة واحد بند type-only protocol اعتماد.

رمز نص حمل بادئة بعد،wire نص كامل جسم تغير،connection fixture داخل تضمين رمز،host و client اثنان جانب تأكيد،spec محلي declare مرة صفة تزامن. إصدار قبل مرحلة مقطع قبول هذا مرة واحد موجة قطع؛ إصدار بعد نفس مثال تعديل اسم حاجة واحد توافق مدة.

`details` نوع من رمز قرار، لذلك رمز و details تركيب إعداد خطأ في تحرير ترجمة مدة حينئذ يتم رفض. عكس وجه هو كل رمي نقطة كل يلزم إعطاء كل details لا بد ملء حقل:protocol يأخذ `gateway/bad-request` `issues` ضبط لـ اختياري، صحيح هو لـ يجعل لا يوجد codec issues عمل خدمة تحقق نقطة ما زال فقط كتابة `{}`.

`RemoteError` هو `Error`، الذي بـ هو دخول أي سجل و `errorChain()` كل إبقاء `message` و `cause`؛ لكن `cause` فقط في عملية داخل صار قيام،wire فوق فقط لديه `code`،`message`،`details` ثلاثة عدد حقل. عبر realm حكم آخر دائم بعيد قراءة بنية علامة، أي إضافة جديدة نقل (worker،bundle قسم قطعة) كل يجب يأخذ علامة أو انتظار قيمة marker لقطة حمل مرور ذهاب، لا فإن فشل قيمة سوف تراجع تحويل لـ عادي `Error`.

Remote طريقة إزالة استهلاك طرف توقيع موحد واحد لـ `Promise<RemoteResult<T>>`، و[طريقة استدعاء وجه](2026-08-02-typert-remote-method-calls.ar.md) وصف توليد إسقاط متسق؛ واحد عنصر استدعاء ترحيل حساب هذا رؤية[واحد عنصر طرف نقطة ترحيل](../../archived/architecture/2026-08-10-unary-apiproxy-remote-migration.md).

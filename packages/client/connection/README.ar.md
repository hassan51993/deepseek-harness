---
description: "Web GUI متصفح و Host بين بروتوكول طبقة:Remote RPC، حمل إعادة وصل حدث تدفق إلقاء تمرير، دقيق Fetch توجيه،/api HTTP جسر و متصفح معلومة مهمة شبكة شريط."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-connection

[English](README.md) | العربية

## عام وصف

هذه الحزمة تحمل تحميل متصفح إلى Host Remote استدعاء، دقيق Fetch استجابة و connection generation.Client إضافة تركيب `ctx.connection`، منها يتضمن حالي صفحة loopback حالة، عام RPC، حالي generation و ذلك Host معلومة، يمكن مراقبة استعادة حالة، قيام أي إعادة وصل أمر، و مفرد واحد generation source تسجيل نقطة.source تقرير إبلاغ ready بعد generation عندئذ مرئي؛source انتهاء، فشل، يتم سحب عودة أو صريح stop كل سوف صاف فارغ هو، مجددا من `ConnectionController` تنفيذ إعادة محاولة سياسة.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [متصفح إقرار إثبات و طلب معلومة مهمة](#browser-authentication-and-request-trust)
- [Connection generation](#connection-generation)
- [تجربة النموذج](#model-experience)
- [معروف حد و مؤقت مؤقت أمر بند](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

ساكن حالة طاولة وجه صفحة يمكن عبر `__DSH_TRANSPORT__.streamBaseUrl` توفير ذلك الذي يملك Host HTTP origin.Gateway سوف هذا origin لأجل WebSocket،HTTP نقل ما زال مستقل اختيار. طاولة وجه تحميل جسم مسؤول إقرار إثبات؛ فقط ضبط origin لن منح إعطاء وصول إذن.

متصفح عبر HTTP POST تنفيذ Remote واحد عنصر استدعاء؛API Gateway ذاتي ذات يملك `/api/remote.mux` WebSocket و ذلك منطق تدفق. من shell يحتفظ تركيب عبر `connection.rpc.open` توفير انتظار قيمة Remote تدفق، لا فتح WebSocket. متصفح إضافة قراءة صفحة transport، استعادة ضبط و location، مجددا تفويض حمل `installConnection(ctx, options)`. يحتفظ ذاته تحميل جسم تركيب يمكن مباشر استدعاء نفس عدد تثبيت دالة؛ كامل آلة عميل اختبار ملف حينئذ هو هذا واحد إزالة استهلاك من. كل مرة استدعاء كل سوف إنشاء واحد عودة الذي تابع Context خدمة، لذلك نفس realm في كثير شجرة Client شجرة يمكن استخدام مختلف تحميل جسم.Host half بداية نهاية توفير و تحميل جسم غير متصل RPC سجل التسجيل و دقيق `GET`/`HEAD`/`POST` توجيه سجل التسجيل. وجود Web تحميل جسم وقت، هو أيضا يحتفظ وحيد `/api` route،Fetch bridge، متصفح إقرار إثبات و Host/Origin تحقق؛ من shell يحتفظ تحميل جسم فإن مباشر قسم إرسال مشترك Fetch handler. كل بند دقيق توجيه سوف في bridge قراءة أي بايت قبل إعلان مؤقت اندفاع أو تدفق صيغة طلب جسم معالجة طريقة.Typert Gateway إقرار قيادة توليد Remote endpoint، وظيفة حزمة تسجيل Session سجل تحت تحميل، أصلي ملف فوق نقل انتظار غير JSON استجابة، لم إقرار قيادة طلب إرجاع 404.Loopback hostname حكم تحديد فقط توفير متصفح جانب حالي صفحة حالة استخدام، إبقاء في حزمة داخل. متصفح أصلي طلب جسم نقل من [`dsh-client-file-upload`](../file-upload/README.ar.md) توفير.

-----

<a id="browser-authentication-and-request-trust"></a>
## متصفح إقرار إثبات و طلب معلومة مهمة

كل Host RPC طريقة و WebSocket تدفق كل اشتراط واحد متصفح جلسة، لا وجود حسب طريقة منطقة قسم loopback طبقة. كل عملية توليد واحد مع آلة بدء أمر لوحة.`dsh-web-app` ضرب طبع و فتح حمل `?token=...` عادي أصل URL؛`frontend-static` يأخذ أصل مسار و index طلب تسليم إعطاء `ctx.connection.authorizeIndex`، بعد من فقط في `GET /` قبول هذا أمر لوحة، كتابة ربط authority توقيع cookie، مجددا إعادة تحديد نحو إلى جاف صاف `/`. ناقص، مرور مدة، شاذ شكل أو authority لا مطابقة cookie سوف في RPC توزيع قبل نيل إلى 401. ساكن حالة مورد إبقاء عام.HTTP تحميل جسم لا في أصل مسار تسليم تبديل خارج قبول query token، أيضا لا قبول Authorization header token.

cookie توقيع مفتاح هو `ctx.credentials` في من `client-connection/browser-session` يملك grant سجل. محلي مزود يأخذ هو حفظ دائم إلى `$DSH_HOME/.credentials.yaml`؛`BrowserAuth` في Connection تنشيط خلال تحميل أو إنشاء هذا سجل، و يأخذ مفتاح إبقاء في داخل تخزين في، لذلك طلب إقرار إثبات تزامن تنفيذ. حذف أو استبدال هذا سجل سوف في تحت مرة Connection تنشيط وقت توليد فاعلية.cookie يحمل قطعا مقابل توقيع إرسال و مرور مدة منطقة بين،`cookieMaxAgeDays` افتراضي ضبط لـ 30 يوم، و في تحديد صفة اسم و توقيع payload في معا ربط مواصفة تحويل hostname و port. هو هو host-only،`Path=/`،`HttpOnly`،`SameSite=Strict`؛ مع مرفق خادم استخدام loopback HTTP، لذلك لحظة معنى لا ضبط `Secure`.

إقرار إثبات قبل، كل طلب ما زال مرور مرور `src/api-request-trust.ts`. ذلك `Host` يجب هو loopback، أو و `trustedHosts` بند مطابقة: حمل طرف فتحة `host:port` دقيق مطابقة، لا حمل طرف فتحة بند مطابقة مهمة معنى طرف فتحة، اثنان جانب متساو مرور WHATWG عودة واحد تحويل. إذا مرفق حمل `Origin`، هو يجب انتظار في هذا Host؛`sec-fetch-site: cross-site` واحد قاعدة رفض. شاذ شكل إعداد authority سوف يجعل إضافة تحميل فشل. هذه فحص منع صد DNS rebinding و عبر محطة متصفح طلب، أبدا بناء قيام هوية.Host/Origin تحقق فشل إرجاع 403؛Host يمكن معلومة لكن لم إقرار إثبات طلب إرجاع 401.`dsh web --host 0.0.0.0` ما زال لا تلقي دعم حمل. قرار سجل:[متصفح طلب معلومة مهمة](../../../.agents/notes/implemented/architecture/2026-07-28-api-browser-trust-boundary.ar.md) و[متصفح أمر لوحة إقرار إثبات](../../../.agents/notes/implemented/architecture/2026-08-24-browser-token-authentication.ar.md).

عبر إقرار إثبات مشترك HTTP طلب في نقل طلب جسم قبل مرور مرور `connection/request` waterfall. مستمع يمكن رفض جديد طلب، أو انتظار `next()` مباشر إلى استجابة إتمام؛ تحرير الذي تابع fiber سوف إزالة دقيق دخول سلوك.Desktop استخدام هذا نقطة توسيع، في قد دفعة دقيق تثبيت خلال قفل إقامة جديد API عمل، بينما لا إلغاء قد وصل قبول عمل.WebSocket تدفق ما زال من API Gateway مسؤول.

<a id="connection-generation"></a>
## Connection generation

API Gateway Client يأخذ داخلي `$events` منطق تدفق تسجيل لـ وحيد generation source، و لديه بلا `$on` حجز قراءة غير متصل.Host في API Remotes source factory تزامن تعليق جيد كل زيادة كمية listener بعد، أولا إرسال وحيد `{ type: 'ready', clientId, host: { home } }` بند، مجددا إرسال حدث.`ConnectionController` فقط في استلام إلى هذا ready بند بعد إصدار generation و استدعاء `onConnected`، لذلك baseline لن ركض في زيادة كمية listener قبل وجه.

`$events` انتهاء،Remote تدفق تقرير خطأ، استلام إلى غير ready أول بند أو شاذ شكل حدث بند، كل سوف جعل حالي generation بطلان. افتراضي حال حال تحت، تعليق بدء إمساك يد في 3 ثانية بعد سجل Host استجابة مؤقت بطيء إبلاغ تحذير، في 15 ثانية بعد سجل حينئذ خيط مهلة و في توقف، يتضمن انتظار شيء إدارة socket وقت. إلغاء بعد،source يجب إيقاف إلقاء تمرير، تحرير مورد و انتهاء، استبدال source عندئذ قدرة بدء؛ قد إلغاء source متأخر إلى ready لا يستطيع إصدار generation. متصفح تقرير إبلاغ شبكة شبكة متاح وقت،Controller إصدار `connecting`، و في 500ms،1s،2s،4s،8s و 10s حد أعلى داخل اعتماد 50%–100% اهتزاز حركة إعادة محاولة، بلوغ إلى نهاية ملف بعد متابعة محاولة تجربة مباشر إلى استعادة. كل مرة إعادة محاولة كل اشتراط Gateway استبدال مرة شيء إدارة WebSocket، مجددا إعادة فتح `$events`.[حمل متابعة استعادة قرار](../../../.agents/notes/implemented/bug-fix/2026-09-05-continuous-client-recovery.ar.md) قاعدة تحديد إمساك يد مدة حد و إعادة محاولة سياسة.

`ctx.connection.reconnect()` سوف في قطع نشط حركة عمل، إعادة وضع تسلسل، و قيام أي بدء retry 1. متصفح `offline` سوف في قطع نشط حركة عمل، إصدار `disconnected` و مؤقت توقف تلقائي محاولة تجربة؛ تحت مرة `online` تحويل سوف إعادة وضع تسلسل و من 500ms ملف بدء. فقط لديه ready بند سوف إصدار `connected`.Gateway mux لا يملك مستقل إعادة محاولة ضبط درجة.

يمكن عبر Host Connection سطر `config.recovery` تغطية إعادة محاولة حد أعلى، زيادة طويل بسبب فرعي أو إمساك يد إبلاغ تحذير و إلغاء وقت؛[إعداد دليل](../../../docs/config-catalog.ar.md#deepseek-aidsh-client-connection) صف خروج قبول حقل.Host تحقق هذه قيمة، و سوف ذلك حقن الذي توفير كل صفحة.Client في توفير Connection قبل تحقق بدء بيانات، و في Gateway بدء حلقة وقت اعتماد هذه قيمة افتراضية؛ صريح نقل إعطاء `start()` وقت ترتيب تغطية أولوية. زيادة طويل بسبب فرعي يجب هو حتى قليل لـ واحد لديه حد عدد. إذا حينئذ خيط، فشل، إلغاء أو صلب مدة حد أولا في إبلاغ تحذير حدوث، هذا إبلاغ تحذير سوف يتم إلغاء. تعديل Host استعادة إعداد بعد يحتاج إعادة تحميل صفحة.


<a id="model-experience"></a>
## تجربة النموذج

بلا. بروتوكول إزالة استهلاك طبقة فقط في متصفح و رئيسي آلة بين نقل تشغيل قد تركيب جيد رسالة؛ هذا داخل لا يوجد أي محتوى دخول نموذج طلب.

#### KV Cache أثر

بلا؛ هذا حزمة حيث لا تجميع أيضا لا إرسال مزود طلب.

## معروف حد و مؤقت مؤقت أمر بند

<a id="known-limitations-and-deferred-work"></a>

- **مؤقت اندفاع نوع `/api` توجيه سوف يأخذ كل طلب جسم إبقاء في داخل تخزين داخل**:`maxRequestBodyBytes`(افتراضي 300 MiB، حسب افتراضي 200 MiB صورة مجموع كمية حد أعلى مرور base64 تمدد انتفاخ إضافة معلومة غلاف بقية كمية نيل خروج) حد عادي صورة و RPC معلومة غلاف. صريح تفعيل تدفق صيغة توجيه استقبال حمل خلف ضغط قسم كتلة و التفاف مرور مجموع كمية حد أعلى؛ توجيه تنفيذ مسؤول حفظ دائم، إلغاء و تخزين إعداد مقدار.
- **متصفح cookie لا حمل `Secure`**: حالي مع منتج توفير نقل طريقة هو loopback HTTP؛ إذا نشر مرور واضح نص شبكة شبكة كشف نفس authority،bearer cookie ممكن في نقل في تسرب كشف.
- **لا يوجد logout عملية**: صاف حذف متصفح cookie سوف انتهاء مفرد عدد متصفح جلسة؛ حذف owner اعتماد سجل و إعادة بدء `dsh` سوف سحب إلغاء الكل جلسة.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. متصفح جلسة تحقق سوف في طلب تخويل عمل وقت مختلف خطوة قراءة اعتماد سجل، بينما سجل commit-event دورة الحياة من credentials مرافق توليد مدخل مسؤول؛ تدفق و إعادة وصل وقت ترتيب و rpcId نحو إرجاع قيد من سلوك مواصفة مباشر تحقق، توجيه تسجيل و dispose(مورد تحرير) مقابل تسمية صفة من webserver مرافق توليد مدخل مراجعة حساب.

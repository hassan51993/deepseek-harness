---
description: "تطبيق Remote تركيب إعداد: لـ Client مستهلك اختيار حمل نوع Host قدرة و تحويل إرسال حدث."
kind: "package-reference"
---

# @deepseek-ai/dsh-api-remotes

[English](README.md) | العربية

## عام وصف

لـ هذا تطبيق اختيار تحديد Host Remote قدرة توفير مزدوج جانب BFF.Host مدخل يملك تحويل إرسال حدث اسم مفرد و نحو API Gateway تسجيل تطبيق حدث source؛Client مدخل بـ وقت التشغيل قيمة شكل صيغة استيراد توليد `/remote` ناتج، عبر `ctx.remote.$mount()` تركيب كل بند مساهمة، و إعادة توجيه خروج مقابل إعلان دمج.Client عمل خدمة حزمة اعتماد هذا خارج مراقبة، بينما لا اعتماد Gateway تنفيذ أو مفرد وحيد Remote وقت التشغيل مدخل.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [تحويل إرسال Host حدث](#forwarded-host-events)
- [بناء حد](#build-boundary)
- [تجربة النموذج](#model-experience)
- [معروف حد و مؤقت مؤقت أمر بند](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

[`@deepseek-ai/dsh-api-session-controller`](../session-controller/README.zh.md) يملك agent(ذكي جسم) و جلسة هوية سياسة، يشمل توفير أخرى namespace استخدام Typert lookup محلل. هذه الحزمة فقط اختيار و تركيب توليد جلسة contribution، لا نسخ تنشيط سياسة.

Client تركيب تركيب Office تحويل،Commands، اعتماد،settings،Goal، حركة حالة Cordis، ملف و جلسة مرجع، فقط قراءة Host إضافة بيان، رسالة عكس تغذية، إذن مسبق ضبط، جلسة تحكم جهاز،subagents و Workspace تحكم جهاز contribution.`permissionPresets` namespace إرجاع current-session تحكم عنصر استخدام كامل عملية درجة دليل. هذا تركيب إزالة وقت،Cordis effect كل حق آلية سوف سحب عودة كل مساهمة؛`@deepseek-ai/dsh-api-gateway/client` مسؤول وصف رمز تحقق، يمكن تتبع أثر namespace خدمة، مباشر و أثر مجال طريقة، استدعاء، تدفق و إلغاء.Client مدخل عبر Cordis إزالة استهلاك مشترك `TypertClientRemote` واجهة، لا استيراد أداة جسم Gateway؛ هو فقط بـ type-only شكل صيغة إعادة توجيه خروج Gateway Client face إعلان دمج، لذلك إزالة استهلاك طرف مرور من هذا خارج مراقبة أخذ إلى تحويل إرسال حدث مفردات وقت، وقت التشغيل لن كثير خروج واحد بند عبر نحو Gateway تنفيذ حافة.

هذا facade معا هو Client حزمة إشارة تسمية wire نوع مفردات صحيح باب. هو بـ type-only طريقة تحويل خروج Remote فشل مفردات (`RemoteResult`،`RemoteFailure`،`RemoteErrorCode`،`RemoteErrorDetailsMap`) ،Host واقع (`RemoteHostFacts`) ، و كل قد اختيار مجال مقابل Client أمان تحميل حمل نوع، لذلك Client وظيفة حزمة فقط import واحد specifier، لا لا بد امتداد يد دخول `dsh-typert-protocol`،Gateway أو بعض عدد يملك جهة Host مدخل. لديه اثنان صنف حزمة لحظة معنى لا مشي هذا طريق باب: هذا تركيب إعداد ذاتي ذات اختيار في API طبقة حزمة——عكس نحو import سوف شكل صار اعتماد حلقة——و هو جمع اختبار، بعد من مباشر من `dsh-typert-protocol` أخذ فشل مفردات.UI حزمة اختبار فإن من [`dsh-client-test-runtime`](../../test-support/client-runtime/README.zh.md) أخذ `RemoteError` منشئ.

هذه الحزمة لا يملك شيء إدارة نقل أو Host خدمة اكتشاف. هو فقط يأخذ تطبيق اختيار إسقاط لـ توليد Remote contribution، و كل Client كل منها مستقل Host حدث مصدر؛API Gateway مسؤول endpoint،carrier، إلغاء و إعادة وصل.Web أو لم قدوم TUI فقط يلزم توفير نفس نسخة لا اعتماد React `ctx.remote` اتفاق، متساو يمكن إعادة استخدام ذلك Client face.

-----

<a id="forwarded-host-events"></a>
## تحويل إرسال Host حدث

`src/remote-events.ts` يحتفظ `API_REMOTE_FORWARDED_EVENTS`، أي هذا تطبيق لا تعديل اسم تحويل إرسال إعطاء إزالة استهلاك طرف Host Cordis حدث اسم مفرد؛ كل بند أيضا سوف اختيار عادي إرسال أو agent-scoped waterfall(شلال نشر صيغة حدث) إلقاء تمرير. هذا اسم مفرد معا حينئذ هو `ctx.remote.$on` دمج قاعدة مفتاح تجميع، فقط يحتوي نوع `src/types.ts` إرسال توليد ذلك اختيار وجه. كثير تحويل إرسال واحد حدث فقط يحتاج في هذا عدد مجموعة داخل إضافة واحد بند: نوع إسقاط، إزالة استهلاك طرف مفتاح وجه و Host تحويل إرسال حلقة الكل من هو إرسال توليد.

مستمع توقيع لا في هذا موضع إعادة كتابة. اسم مفرد داخل كل بند حدث Cordis `Events` إعلان كل إقامة في ذلك owner حزمة client-safe `./types` توجيه خروج، هذه الحزمة اثنان عدد face كل يأخذ ذلك بعض إعلان قبول دخول تحرير ترجمة وجه.Host face أيضا سوف يأخذ كل بند تأكيد إعطاء `TypertForwardableEventEntry`:`emit` بند يجب هو قد إعلان مفرد نحو حدث،`waterfall` بند فإن يجب هو قد إعلان agent-scoped waterfall، كما ذلك الأكثر بعد واحد معامل هو إرجاع نفسه نتيجة نوع `next()` عودة ضبط.

Host entry لـ كل بند Client تدفق مستقل تسجيل واحد مجموعة allowlist listener و واحد طابور صف، و في عادي حدث دخول طابور قبل رفض غير JSON معامل. مقابل في waterfall، هو فقط إسقاط قمة طبقة agent هوية و JSON طلب حقل؛Client نتيجة أيضا يجب قدرة بلا ضرر يمثل لـ JSON، بينما `next()` سوف تفويض حمل إعطاء لاحق Host listener. كل أثر مجال waterfall طلب كل يجب بـ `request.agent` مباشر يحمل توجيه الذي استخدام agent؛Host سوف في تحويل إرسال قبل رفض ناقص أو لا مطابقة هوية. هذا source في `ctx.typertGateway.registerRemoteEvents()` كشف Gateway داخلي `$events` منطق تدفق قبل تزامن تعليق جيد كل listener، لذلك أول عدد `ready` بند حيث قدرة إثبات زيادة كمية إلقاء تمرير قد حينئذ خيط، أيضا سوف يحمل توفير Client عرض مسار Host home. سحب عودة تسجيل سوف في توقف نشط حركة تدفق.

بلا payload `permission-presets/catalog-changed` حدث جعل عملية دليل بطلان.Client في أول مرة قراءة `permissionPresets.catalog()` قبل أولا حجز قراءة، و في إشعار بعد إعادة قراءة كامل لقطة؛ هذا حدث لا يحمل دليل حالة، أيضا لا تغيير Session ترتيب رقم.

<a id="build-boundary"></a>
## بناء حد

مستودع في كثير عدد حزمة فقط يخص واحد TypeScript face:Host حزمة تسجيل تسجيل في أصل `tsconfig.host.json`،Client حزمة تسجيل تسجيل في أصل `tsconfig.client.json`. هذه الحزمة حاجة تفكيك قسم، لأن Host مدخل يلزم مشاركة و Host Typert رسم، بينما `src/client/index.ts` يجب انتظار Host tsdown توليد عمل خدمة حزمة `/remote` إعلان بعد عندئذ قدرة تحرير ترجمة.

هذه الحزمة أصل `tsconfig.json` فقط هو مرجع `tsconfig.host.json` و `tsconfig.client.json` solution.Host aggregate و Host مباشر مستهلك مرجع قبل من،Client aggregate و Client مباشر مستهلك مرجع بعد من؛ منع توقف يأخذ حزمة أصل solution وضع دخول مهمة واحد aggregate اعتماد رسم. اثنان عدد project يملك متبادل لا إعادة تراكم شفرة المصدر و `.tsbuildinfo`، لكن مشترك `lib/types` إخراج دليل——فقط لديه واحد موضع لحظة معنى مثال خارج:`src/remote-events.ts` و `src/types.ts` **معا**صف دخول اثنان عدد face `files`، لأن تحويل إرسال حدث اسم مفرد هو «إزالة استهلاك طرف قدرة استلام إلى ماذا» وحيد تحكم نقطة،Host تحويل إرسال حلقة و Client `ctx.remote.$on` مفتاح وجه يجب قراءة نفس نسخة إعلان، بينما لا هو اثنان نسخة ممكن ذاك هذا عائم نقل إعلان.

هذا بند مثال خارج لا توقف هو واحد سطر `files`. أصل `tsconfig.base.json` يأخذ `@deepseek-ai/dsh-api-remotes/types` خريطة إلى `src/types.ts`——**مصدر مستو وجه**، و ذلك بقية كل workspace فرعي مسار متسق، أيضا و توليد `/remote` ناتج متبادل عكس (بعد من لا يوجد `paths` بند، اعتماد `exports` أمر في بناء ناتج). في هو اثنان عدد face كل يأخذ نفس نسخة اسم مفرد و نوع إسقاط استلام دخول كل منها program، و نحو `lib/types` إرسال إطلاق تدريجي حرف نفسه `remote-events` و `types` إخراج؛`.tsbuildinfo` ما زال كل منها مستقل. لا يوجد أي بوابة قوي صنع اثنان عدد face مصدر ملف متبادل لا إعادة تراكم——`scripts/project-reference-faces.ts` فقط تحقق «مرجع واحد split project يجب إشارة إلى مقابل face»——لذلك هذا مقطع سجل هذا مرة مزدوج صف لـ أي هو متعمد.

حزمة داخل `clientBundle(..., { hostPhase: true })` يجعل Host tsdown تحزيم Host مدخل، يجعل لاحق Client tsdown فقط تحزيم browser مدخل. عادي Client إضافة ما زال استخدام مفرد واحد Client project، و في Client tsdown مرحلة مقطع واحد بدء توليد Node loader مدخل و browser bundle؛ فقط لديه اثنان مجموعة شفرة المصدر حاجة مختلف compiler face وقت عندئذ تفكيك قسم.

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن هذا BFF فقط اختيار Remote تطبيق طريقة و تحويل إرسال حدث، لا تسجيل أي نموذج واجهة.

#### KV Cache أثر

بلا مباشر أثر؛ ذلك إطلاق أي نموذج مرئي سلوك متساو من قد تركيب Host قدرة مسؤول.

## معروف حد و مؤقت مؤقت أمر بند

<a id="known-limitations-and-deferred-work"></a>

- قدرة تجميع دمج من بناء وقت صريح استيراد قيمة ثابت تحديد؛Client لن في وقت التشغيل اكتشاف Host في قد تفعيل خدمة أو Remote تعريف.
- إذا يلزم زيادة قدرة، يجب صريح استيراد متبادل ينبغي `/remote` قيمة و في هذا تركيب في تركيب.
- فقط لديه ما زال في انتظار أثر مجال waterfall سوف في إعادة وصل بعد إعادة تشغيل؛ مفرد نحو إشعار ما زال هو متبادل متبادل عزل best-effort إلقاء تمرير، لن إعادة تشغيل. حاجة يمكن اعتماد استعادة حالة يجب من يملك جهة توفير استعلام، تنقل علامة أو ابتدائي أساس خط.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. يتم مراقبة علاقة من Typert،agent سجل التسجيل و جلسة سجل التسجيل مسؤول.

# Agent Note: بـ فعلي تحقق صفة حزمة اسم إصدار Agent Teams

Status: implemented

[English](2026-08-18-experimental-agent-teams-packages.md) | العربية

## مشكلة

Agent Teams خدمة و أداة اتفاق ما زال في تغير، لكن هو حاجة استخدام حقيقي Session سجل،subagent دورة الحياة، أداة، عرض مثال، لقطة و مستودع فحص. مستخدم أيضا حاجة مباشر من npm تثبيت كامل Team تركيب، بينما بلا حاجة بناء شفرة المصدر checkout.

يأخذ هذه حزمة نقل دخول منتج مسؤولية مجموعة سوف إزالة فعلي تحقق صفة اسم، و داكن عرض مستقر حزمة owner قد حينئذ موضع. إصدار `packages/experimental/` تحت كل حزمة أيضا سوف كشف غير متصل داخلي أصل نوع. إصدار سياسة يجب يجعل مستخدم تثبيت Agent Teams، معا يجعل داخلي مخصص استخدام أصل نوع إبقاء خاص.

## قرار

`packages/experimental/agent-team`،`packages/experimental/tool-agent-team`،`packages/experimental/agent-team-profile`،`packages/experimental/client-ui-agent-team` و `packages/experimental/agent-team-web-profile` هو عام workspace حزمة. هو جمع إبقاء قائم `@deepseek-ai/dsh-experimental-*` اسم و إضافة دخول dsh إصدار نظام صف.[إصدار رفض قائمة قرار](../process/2026-09-12-experimental-publication-denylist.zh.md) مسؤول افتراضي عام و خاص مثال خارج؛[فعلي تحقق صفة حزمة قاعدة](../../../../packages/experimental/AGENTS.md) مسؤول اعتماد عزل و لاحق promotion.

dsh تحزيم و إصدار تجميع دمج و محلي أساس خط إصدار جهاز يتضمن هذا خمسة عدد Agent Teams دليل و [Cua Driver مزود](2026-09-12-computer-use-provider-registration.zh.md).workspace قيد اشتراط هو جمع حذف `private`، سوف `publishConfig.access` ضبط لـ `public`، و إبقاء فعلي تحقق صفة npm بادئة. فعلي تحقق مجموعة خارج إصدار حزمة، تطبيق و Python وقت التشغيل لا يستطيع في `dependencies`،`optionalDependencies` أو `peerDependencies` في مرجع فعلي تحقق حزمة؛ فعلي تحقق حزمة يمكن اعتماد إصدار حزمة و ذاك هذا.

عام استدعاء جهة مسبق إبقاء continuable child هوية و دقيق direct-child drain ما زال يخص مستقر Subagent خدمة. هو جمع مسؤول Subagent هوية و Activation دورة الحياة، لا import أو تسمية Agent Teams؛ فعلي تحقق صفة Team خدمة امتداد سماح جهة نحو إزالة استهلاك هذه قدرة.

عام إصدار Host جانب Agent Teams profile bundle اعتماد Team حزمة، و في `dsh-base` بعد تطبيق. هو سوف إدراج دخول Team إعداد سطر، و منع استخدام نموذج مرئي اسم و Team أداة إعادة تراكم عام continuable-child control. مستقل عام إصدار Web profile في `dsh-web-app` و Host profile بعد تطبيق؛ هو سوف إدراج دخول Team UI، بعد من تركيب Team package توليد Remote contribution. اثنان عدد طبقة كل إبقاء صريح تفعيل، لا تغيير مع مرفق base،CLI،Web و Python runtime اعتماد رسم.

profile بدء سوف أولا تحليل الذي اختيار bundle، مجددا حساب حساب[غير ممكن تغيير profile resolution generation](2026-09-09-profile-resolution-generations.zh.md).generation إبقاء تثبيت أولوية ترتيب، حسب profile ترتيب كامل مرة تاريخ كل صريح bundle أصل، و يجعل pnpm إدارة profile حزمة إبقاء أولوية.runtime نمط في داخل تخزين في قوي صنع هذا نتيجة؛ إبقاء link و dual نمط يأخذ نفس نتيجة شيء تحويل لـ مشترك و profile ذاتي لديه إسقاط. لذلك، خاص profile طبقة يمكن يحمل فعلي تحقق صفة plugin إعداد سطر، بينما بلا حاجة يأخذ هذه plugin إضافة دخول إصدار app، اشتراط profile مستخدم مباشر تثبيت نقل تمرير اعتماد، كسر تالف packaged-runtime وحدة هوية، أو تغيير أخرى profile تحليل نتيجة.

مقابل هذا خمسة عدد حزمة بينما قول، فعلي تحقق صفة حالة تغيير توافق صفة و دعم حمل مسبق مدة، بينما لا منع توقف إصدار. هذه حزمة ما زال يجب ممتلئ كاف مستودع واحد عام وثيقة، ثابت صيغة، دورة الحياة، أمان، اختبار وحدة، حقيقي تركيب اختبار و لقطة اشتراط.promotion قبل ما زال يجب مراجعة عام اتفاق، حد، اختبار دليل، وقت التشغيل اعتماد جهة، و من واحد اسم أداة اسم owner قبول مستقر حزمة معنى خدمة.

## سبق اعتبار بديل خطة

**يأخذ Agent Teams نقل دخول منتج مسؤولية مجموعة.** هذا سوف إزالة اشتراط إبقاء فعلي تحقق صفة npm اسم، و في اتفاق مستقر قبل داكن عرض قد لديه مستقر حزمة owner.

**يجعل Agent Teams إبقاء خاص كما فقط توفير شفرة المصدر checkout استخدام.** هذا سوف إبقاء الأكثر بسيط مفرد فعلي تحقق صفة سياسة، لكن مستخدم لا يمكن من npm تثبيت كامل opt-in تركيب.

**إصدار كل فعلي تحقق صفة حزمة.** أخرى أصل نوع ما زال فقط توفير داخلي استخدام، أيضا لا يوجد قبول عام حزمة اتفاق.

**يأخذ Subagent قبل وضع قدرة نقل دخول experimental دليل.** child هوية قسم إعداد و Activation teardown يخص Subagent owner، كما لا يتضمن Team مخصص استخدام اتفاق. نقل حركة أو نسخ هذه قدرة سوف عكس تحويل اعتماد جهة نحو، أو يأخذ نفس عدد دورة الحياة تفكيك إلى كثير عدد حزمة في.

## عاقبة

Agent Teams سوف بصفة dsh إصدار نظام صف في خمسة عدد يمكن تثبيت tarball إصدار، معا إبقاء حزمة اسم ثابت، أيضا لن في مع مرفق profile في تفعيل Team. عام متاح لا بديل جدول هذه حزمة مستقر أو افتراضي تلقي دعم حمل، مستقر إصدار حزمة أيضا لا يستطيع مقابل ذلك بناء قيام وقت التشغيل اعتماد.

إصدار نظام صف إبقاء فعلي تحقق صفة npm اسم.promotion ما زال سوف حسب وفق فعلي تحقق صفة حزمة قاعدة إنتاج مسار و npm اسم تعديل.

# Agent Note: تحرير ترجمة جهاز غير متصل Typert نوع نموذج

Status: implemented

[English](2026-07-27-compiler-independent-typert-model.md) | العربية

## Problem

مباشر من TypeScript AST تجميع وصل Zod و عكس إطلاق نص، سوف يأخذ نوع قسم تحليل، عمل خدمة دلالة تعرف آخر و مفرد عدد توليد هدف ربط في واحد بدء. هذا مثال توليد جهاز فقط قدرة عودة جواب “هذا مقطع لغة قاعدة قدرة لا توليد” ، لا يمكن توفير حزمة،face، عام تصدير،service،event، كائن و ذلك نوع علاقة معيار يمثل، أيضا لا يمكن توفير ساكن حالة فحص و لاحق توليد هدف إعادة استخدام.

host و client يخص مستقل TypeScript project؛ يأخذ اثنان من وضع دخول نفس عدد `ts.Program` سوف دمج اندفاع مفاجئ Cordis `Context` و `Events` إعلان. و هذا معا،client نوع ما زال يحتاج صريح مرجع host نوع، لذلك تماما عزل أو في اثنان حافة نسخ نوع كل لا يستطيع جدول بلوغ حقيقي اعتماد.

## Decision

[`dsh-typert-generator`](../../../../packages/typert/generator/README.ar.md) قسم آخر من host و client project بناء قيام `ts.Program`، فقط يأخذ compiler node،symbol و checker عند عمل رفع أخذ أداة. قسم تحليل انتهاء بعد، كل توليد جهاز و مسح جهاز فقط إزالة استهلاك Typert ذاتي لديه `WorkspaceModel`،`FaceModel` و `TypeGraph`، نموذج في لا إبقاء AST أو checker كائن. توليد جهاز لا اعتماد `@deepseek-ai/dsh-typert-registry`.

TypeGraph حفظ تطوير من كتابة تحت حساب حساب قبل نوع بنية، يشمل عام نوع معامل و تطبيق، صريح وراثة،conditional،mapped، تمرير عودة مرجع و JSDoc. لا يمكن بلا ضرر يمثل يمكن بلوغ نوع جعل قسم تحليل فشل؛ بعض عدد emitter لا يمكن معالجة قد بناء نموذج عقدة وقت من هذا emitter فشل، بينما لا هو يأخذ نوع عرض مستو أو تخفيض لـ `unknown`.

كل face مستقل يملك PackageModel و TypeGraph.`tsconfig.host.json` و `tsconfig.client.json` مباشر project references قرار package face ملكية،`package.json#exports` قرار عام حد. عبر face علاقة فقط قدوم ذاتي شفرة المصدر في صريح import أو re-export، و بصفة مستقل link إبقاء؛ خارجي npm نوع سجل لـ External، لا قراءة أو نسخ ذلك إعلان.

PackageModel تعرف آخر Cordis service،event،`@typert object` مرجع كائن و `@typert schema` بيانات أصل.service و object فقط كشف public instance member، ترتيب حذف constructor،static،private و protected؛ وراثة حافة إبقاء في TypeGraph في، لا نسخ لـ مسطح مستو عضو. نقص قليل public property،parameter أو return نوع علامة ملاحظة وقت،`check` نمط تقرير خطأ،`write` نمط كتابة checker دفع قطع نتيجة بعد إعادة بناء project و مجددا مرة بـ صارم إطار نمط قسم تحليل.

[`dsh-typert-registry`](../../../../packages/typert/registry/README.ar.md) توفير `ctx.typert`، كما فقط مسؤول وقت التشغيل تسجيل: واحد contribution أصل فرعي يحمل package-face reflection و اختياري Zod schema factory، و مع Cordis effect سحب إلغاء. سجل التسجيل تحقق factory وقت لن استدعاء هو؛ أول مرة `get()`،`resolve()`،`list()` أو JSON Schema إسقاط عندئذ سوف شيء تحويل و ذاكرة مؤقتة كل schema. سجل التسجيل لا قسم تحليل TypeScript، أيضا لا دمج اثنان عدد face.

حزمة ناتج إصدار ما زال عبر package exports اعتماد صريح opt-in.`WorkspaceTypertGenerator` فقط في يتم استدعاء وقت تحقق الذي طلب face أصل دليل ناتج بروتوكول:host face يجب عبر موجه إلى مستخدم subpath `package/typert` كشف `package/lib/typert.host.{js,d.ts}`،client face يجب عبر `package/client/typert` كشف `package/lib/typert.client.{js,d.ts}`؛ هو لن تعديل هذه exports. لاحق [Typert Remote تصميم](2026-08-02-typert-remote-method-calls.ar.md) لـ أصل دليل build،typecheck،lint و وثيقة نوع فحص زيادة كل مستودع Host اتفاق pass. مقابل في قد opt-in Host حزمة، هذا pass سوف في مستهلك تحليل اثنان من قبل توليد محلي عكس إطلاق ناتج و صارم إطار Host-for-Client `/remote` اتفاق. توليد محلي إعلان سوف `TYPERT` نوع إبقاء لـ `unknown`، لذلك عمل خدمة حزمة لا اعتماد سجل التسجيل.

بناء مدة `CordisCatalogProjector` مرة إزالة استهلاك قسم تحليل بعد `FaceModel` و `TypeGraph`، توليد `docs/cordis-catalog/events.md`،`docs/cordis-catalog/services.md`، و لـ `tool-cordis` إيداع ساكن حالة `SERVICE_API`،`EVENT_API` و `TYPE_API` catalog.`tool-cordis` قراءة هذا ساكن حالة catalog، وقت التشغيل لا اعتماد `ctx.typert`.[`dsh-typert-loader`](../../../../packages/typert/loader/README.ar.md) و سجل التسجيل ما زال هو مستقل وقت التشغيل مسار:loader استماع Cordis Loader بند إعداد دورة الحياة حدث، استيراد صريح إصدار `./typert` host ناتج، و عبر `ctx.typert` تسجيل؛ اثنان من كل لا هو حالي `cordis_inspect` catalog بيانات مصدر.

## Verification contract

إيداع داخل صغير نوع مزدوج face project مقابل كامل نوع نموذج و ذلك شفرة المصدر إعلان بحث جذب فعل snapshot. كل مستودع قسم دفعة قسم تحليل و مباشر تجمع تركيز قسم تحليل يجب لـ نفسه face توليد نموذج انتظار قيمة `FaceModel` و `TypeGraph`. نوع درجة كل تجميع و وقت التشغيل تجميع دمج مقارنة مقارنة حفظ إثبات كل نوع node،target،declaration و member discriminant كل قدوم ذاتي حقيقي TypeScript syntax؛ حقل دلالة مستطيل دفعة تغطية كل keyword،type operator،literal value صنف هدف، و عام نوع، معامل،tuple،mapped modifier،import attributes،abstract،predicate و enum initializer كل عدد حالة.

`SyntaxZoo` في كل property شفرة المصدر نوع مرور TypeScript printer معيار تحويل بعد، يجب و TypeGraph تصيير نتيجة تدريجي بند متبادل انتظار، مع بعد كل تصيير declaration مجددا تسليم إعطاء TypeScript تحرير ترجمة. هذا واحد طبقة فحص عقدة داخلي معلومة هل بلا ضرر، يشمل بلا إدراج قيمة template literal، حمل type argument type query و تلقي قيد `infer`، لا بـ discriminant تغطية أو شفرة نسبة التغطية بديل بديل بنية انتظار قيمة.

حد حالة استخدام ثابت نفس face و عبر face صريح حزمة استيراد، عبر face تسمية re-export، دقيق export alias،qualified `import()` link و عام `@types` External ملكية، و رفض package ذاتي لديه TypeScript تشخيص، متبادل مقابل مسار تجاوز حد،`package.json#exports` خارج مرجع، و بعد بلا نموذج target عبر face namespace re-export.interface declaration merging صريح إبقاء كل authored part، لا يمكن بلا ضرر يمثل أخرى merge فشل.

Zod emitter مقابل دعم حمل عقدة و كل صنف literal تدريجي صنف تنفيذ نجاح و فشل parse، مقابل لا دعم حمل عقدة تدريجي صنف تأكيد واضح `TypertEmitError`.Emitter fixture مقابل توليد Zod JavaScript و `.d.ts` نص فعل لقطة، تنفيذ كل schema factory، و مقابل إعلان فعل نوع فحص.`dsh-typert-registry` اختبار ثابت أصل فرعي تسجيل، أول مرة استخدام شيء تحويل، نجاح نتيجة ذاكرة مؤقتة،factory فشل بعد إعادة محاولة، استعلام،JSON Schema و effect سحب إلغاء،`dsh-typert-loader` اختبار أيضا إثبات تأخير متأخر تركيب، إزالة و لم إتمام dynamic import تحرير سلوك. حقيقي `dsh-tools` رأسي قطع من نموذج توليد contribution، مرور وقت التشغيل سجل التسجيل تحميل بعد، سوف ذلك خدمة، حدث و صلة ربط نوع سجل نفس قد إيداع ساكن حالة `SERVICE_API`،`EVENT_API` و `TYPE_API` مقابل وفق. كل مستودع projector اختبار إعادة توليد اثنان نسخة Cordis catalog وثيقة و `tool-cordis` API catalog، و اشتراط ثلاثة نسخة نص نفس قد إيداع ناتج تدريجي بايت متسق.

## Alternatives considered

**مباشر حفظ TypeScript AST.** AST قدرة إبقاء شفرة المصدر كتابة قاعدة، لكن سوف يجعل كل إزالة استهلاك من اعتماد compiler دورة الحياة،node identity و checker سياق، لا يمكن شكل صار مستقر هيكل بنية حد، لذلك فقط في رفع أخذ مرحلة مقطع استخدام.

**أساس في checker نهائي نوع توليد.** عرض مستو بعد `ts.Type` سهل في مباشر مرة تاريخ، لكن فقد فقد عام نوع،conditional،mapped و alias application تطوير من جدول بلوغ، لا يمكن ممتلئ كاف عكس إطلاق و لاحق توليد حاجة.

**دمج host/client project أو نسخ host نوع.** دمج سوف تلوث صبغ Cordis declaration merging؛ نسخ سوف إنتاج ثاني نسخة نوع واقع مصدر. مستقل face إضافة صريح cross-face link إبقاء project عزل و حقيقي مرجع علاقة.

**يجعل `dsh-typert-registry` تحمل تحمل نوع تحليل و عبر حزمة دمج صار.** هذا سوف يأخذ TypeScript compiler،Cordis دورة الحياة و أداة جسم schema سياسة إعادة اقتران دمج. سجل التسجيل إبقاء لـ توليد artifact دورة الحياة حاوية، تكرار مختلط قسم تحليل إبقاء في بناء مدة نموذج.

## Consequences

إضافة جديدة توليد هدف أو ساكن حالة فحص يمكن إعادة استخدام نفس TypeGraph، عمل خدمة صنف هدف أيضا يمكن في PackageModel فوق توسيع، بينما بلا حاجة مجددا مرة تحليل AST. إبقاء حساب حساب قبل نوع و مستقل face بديل قيمة هو نموذج مقارنة ضرب مستو بعد schema أكثر تكرار مختلط،emitter يجب صريح إعلان دعم حمل نطاق و مقابل ناقص قدرة فشل.

حزمة درجة صريح opt-in جعل ناتج إصدار و exports من كل حزمة ذاتي سطر إدارة. مستودع تحرير ترتيب ما زال يمكن لـ كل قد opt-in حزمة تشغيل كل مستودع Host اتفاق pass؛ هذا pass ما زال من لاحق Remote Gateway Agent Note مسؤول شرح. ساكن حالة Cordis catalog يمكن من معيار نموذج تكرار الآن، معا لا يأخذ `tool-cordis` و وقت التشغيل سجل التسجيل حالة اقتران دمج.`ctx.typert` فقط عكس عكس حالي وقت التشغيل في قد تركيب ناتج؛ مقابل في مستهلك شيء تحويل بعد ما زال يحتفظ Zod نسخة، إزالة مسار لا يمكن تحكم.

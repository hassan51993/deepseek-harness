# Agent Note: Web result card — a structured render intent for web_search and web_fetch

Status: implemented
Archived: 2026-09-04

[English](2026-07-30-web-result-card.md) | العربية

## Problem

`web_search` و `web_fetch` أداة كل منها إعلان واحد generic انتظار معالجة بطاقة (`presentCall`،`kind: 'search'`/`'fetch'`) ، لكن لا يوجد `presentResult`، لذلك واحد قد إتمام web استدعاء مقاومة بلوغ UI وقت فقط باق تحت موجه إلى نموذج render نص. مقابل في تفكير تصيير مرجع قائمة أو إمساك أخذ ملخص web قبل طرف بينما قول، هذا نص هو لديه ضرر:`web_search` render يأخذ كل مصدر `title`،`snippet`،`publishedAt` ضغط دخول واحد سطر بـ title أو hostname علامة ملاحظة ذاتي من نص markdown(`packages/web/tool-web/src/search.ts` في `formatSearchOutput`) ، لذلك إعادة تحليل render لا يمكن استعادة كل مصدر حقل؛`web_fetch` render أيضا فقط في واحد سطر header داخل يحمل `url` و `statusCode`. تصيير معنى رسم اتفاق ([وسم ربط دمج نوع](../architecture/2026-07-02-tool-render-intent-union.ar.md)) هذا قبل لا يوجد واحد يمكن توفير web أداة إعلان، استخدام بـ يحمل بنية تحويل نتيجة فرع.

## Decision

نحو `ToolResultView`(`packages/core/tools/src/presentation.ts`) إضافة جديدة واحد `card: 'web'` نتيجة فرع، هو هو بـ `kind: 'search' | 'fetch'` حقل عمل حكم آخر ربط دمج `WebResultView = WebSearchResultView | WebFetchResultView`، و مرفق واحد يمثل مفرد عدد يمكن مرجع مصدر `WebSource` شكل حالة. اثنان عدد أداة الآن كل إعلان `presentResult`.

اعتماد واحد وسم إضافة `kind` حكم آخر، بينما غير اثنان عدد وسم. اثنان عدد استدعاء كل هو web فحص بحث،web قبل طرف سوف استخدام نفس عائلة مكون تصيير هو جمع (واحد فحص بحث بطاقة، متن حسب kind مختلف) ، لذلك مشترك استخدام واحد `card` يجعل كل card مستهلك switch فقط يحتاج إضافة جديدة واحد فرع، و يجعل قبل طرف في ذلك داخلي حسب `kind` قسم تفرع. اثنان عدد وسم سوف إجبار جعل حالي و لم قدوم كل مستهلك لـ هذا تابع نفس نظر شعور عائلة شرق غرب إضافة اثنان عدد فرع. هذا اثنان عدد `kind` أخذ قيمة و اثنان عدد أداة قائم generic استدعاء عرض `kind` متسق، لذلك واحد استدعاء و هو نتيجة قراءة بدء قدوم هو نفس صنف آخر.

`presentationMeta` يحمل render نص لا يمكن يحمل شرق غرب. أداة من `execute` إرجاع بنية تحويل نتيجة كائن**لن**مرور من wire مقاومة بلوغ عميل——فقط لديه موجه إلى نموذج `render` نص، و (إعلان وقت) إسقاط إلى `tool/result` حدث `meta` فوق `output.presentationMeta` JSON سوف. مقابل `web_search`،meta هو نيل إلى `{url, title?, snippet?, publishedAt?}` **وحيد**وفي فعلي طريق مسار:render يأخذ هذه حقل ضغط دخول واحد سطر لديه ضرر ذاتي من نص، مستهلك لا يمكن إعادة تحليل. مقابل `web_fetch`،meta هو أكثر صغير لكن حقيقي استلام فائدة:`url`/`statusCode` يمكن من تحديد صيغة `Fetched <url> (HTTP <n>)` header سطر أيضا أصل، لكن `truncated` هو صالح قطع قطع——مزود حد أعلى، تحويل قبل مصدر قطع قطع، أو نشر `fetchMaxOutputChars` إخراج حد أعلى——عميل لا يمكن إعادة حساب، لأن هو لا معرفة طريق ذلك عدد حد أعلى. إمساك أخذ بطاقة و موجه إلى نموذج نص كل من نفس عدد `renderFetchOutput(result, maxOutputChars)` helper إرسال توليد `truncated`، لذلك بطاقة أبدا سوف و نموذج يرى ذيل جزء معلومة قسم تقاطع. هذا وفق نقل write/edit diff نموذج لوح (`packages/fs/tool-fs/src/diff.ts`): واحد `*MetaFromValue` إسقاط جهاز تغذية إعطاء `output.presentationMeta`، واحد `*MetaFromResult` استلام ضيق جهاز قراءة عودة `result.meta`، و في فشل وقت منع صد صفة رجوع إلى generic بطاقة.`web_fetch` متن قد هو نتيجة محتوى في markdown، لذلك لا تكرار كتابة meta.

اثنان عدد نتيجة عرض كل لا يحمل `content` فرعي هذا. لا تصيير بنية تحويل `web` بطاقة UI رجوع إلى أصلي `tool/result` محتوى، هذا أيضا هو generic بطاقة إزالة استهلاك إدخال. يأخذ نتيجة محتوى نسخ دخول عرض سوف في نفس إلقاء تمرير لقطة فوق تكرار الأكثر كثير `fetchMaxOutputChars` عدد محرف لكن جزء بلا استلام فائدة (و meta واحد عقدة مقابل إمساك أخذ متن مرفوض نفس إدارة) ، لذلك عرض حذف هو، رجوع مسار تصيير تماما نفسه نص. كل عرض من استدعاء معامل ضبط ذلك نتيجة مدة `title`(`args.query`/`args.url`) ، لذلك فقد إسقاط استدعاء رأس نافذة قطع قطع إعادة وضع ما زال لديه عنوان، و write/edit في نتيجة مدة إعادة ضبط title فعل قاعدة متسق.

`presentResult` في خطأ نتيجة، و `meta` ناقص أو شاذ شكل وقت إرجاع `undefined`(أي generic بطاقة) ، لأن presentation سوف في مقابل مهمة معنى قد سجل نتيجة (ممكن قدوم ذاتي قديم schema) إعادة وضع في تشغيل، أبدا قدرة رمي خطأ. استلام ضيق جهاز منع صد صفة أرض تحقق كل حقل؛ فارغ مصدر قائمة هو صالح meta، بينما غير شاذ شكل.

## Consequences

قبل طرف مستهلك يخص [Web result card قبل طرف note](2026-07-30-web-result-card-frontend.ar.md) عمل نطاق: هذا مرة إنتاج من تغيير إضافة جديدة اتفاق فرع و يجعل اثنان عدد أداة إرسال خروج هو، لا يحتوي عميل تصيير. ذلك وحيد يمكن مراقبة تغير هو `web_search`/`web_fetch` `tool/result` حدث حفظ دائم واحد `data.meta` تحميل حمل (`web-fetch` keyless لقطة عند وقت مع لـ تحديث جديد) ؛ موجه إلى نموذج render نص و generic رجوع محتوى إبقاء ثابت. تصيير `web` بطاقة تجميع تطبيق transcript(نص سجل) لقطة يخص تصيير هو مستهلك تغيير. أي فعل نفاد كل switch `ToolResultView` مستهلك كل يجب إضافة جديدة واحد `web` فرع؛ غير نفاد كل مستهلك يمكن استخدام أصلي نتيجة رجوع.Session Controller مباشر يحمل حدث في قد نوع تحويل `surfaceOp`، لا إعادة إعلان card وسم ([خط مسار نوع](../../../../packages/api/session-controller/src/types.ts)) ، لذلك جديد عرض بلا حاجة schema تغيير يكفي عبر wire.

لم قدوم تفكير استخدام هذا بطاقة web أداة، إعلان واحد إرجاع حمل ذاتي لديه `kind` `card: 'web'` عرض `presentResult`؛ إضافة جديدة رقم ثلاثة عدد `kind` هو مرة ربط دمج نوع تحرير إضافة قبل طرف قسم تفرع، بينما غير واحد جديد card وسم.

## Alternatives considered

**اثنان عدد card وسم (`web-search`،`web-fetch`).** مرفوض: هو في كل card مستهلك موضع لـ واحد نظر شعور عائلة قلب ضعف فرع عدد، بينما اثنان عدد شكل حالة قد لديه كاف كاف كثير مشترك صفة (واحد حمل رجوع محتوى حمل عنوان فحص بحث بطاقة) ،`kind` حكم آخر بلا حاجة ثاني عدد وسم يكفي جدول بلوغ فرق مختلف.

**في `presentResult` داخل إعادة تحليل render نص، بينما غير إسقاط meta.** مقابل `web_search` مرفوض:render مصدر قائمة هو لديه ضرر (title أو hostname وسم،snippet و يوم مدة تجميع دخول ذاتي من نص) ، لذلك إعادة تحليل لا يمكن وفي فعلي استعادة بنية تحويل حقل.`presentationMeta` هو وحيد إبقاء هو جمع طريق مسار.

**يأخذ إمساك أخذ متن وضع دخول meta، أو يأخذ نتيجة محتوى نسخ دخول مهمة واحد عرض.** مرفوض: متن قد هو نتيجة محتوى في موجه إلى نموذج markdown، يأخذ هو نسخ دخول meta أو عرض `content` حقل سوف لـ بلا استلام فائدة هدف قلب ضعف حفظ دائم أو إلقاء تمرير تحميل حمل؛ لا أداة تجهيز `web` قدرة UI رجوع إلى قائم نتيجة محتوى، ذلك هو نفسه نص.

## Testing

`packages/web/tool-web/tests/tool-web.spec.ts` تغطية التالي محتوى، ممتلئ كاف حسب ملف 100% بوابة:`searchMetaFromValue`/`fetchMetaFromValue` إسقاط، يحتوي حذف لا وجود اختياري حقل، و إمساك أخذ `truncated` إسقاط في فقط إخراج حد أعلى قطع قطع متن وقت، و في جزء بلا قطع قطع وقت كل و render ذيل جزء معلومة متسق؛`searchMetaFromResult`/`fetchMetaFromResult` استلام ضيق، يحتوي مرة نحو إرجاع و كل نوع شاذ شكل شكل حالة رفض (غير كائن، حقل نوع خطأ، شاذ شكل مصدر بند) و فارغ مصدر قائمة قبول؛`presentSearchResult`/`presentFetchResult` نوع تحويل عرض، يحتوي من معامل إرسال توليد title، بلا `content` فرعي هذا،truncated إشارة، خطأ نتيجة رجوع و شاذ شكل meta رجوع؛ و اثنان مرة حقيقي سجل التسجيل تنفيذ، تأكيد أداة يأخذ meta إسقاط إلى `result.meta` فوق، ذلك تسجيل `presentResult` دفع توجيه خروج `card: 'web'` عرض.

## Related

- [وسم تحويل أداة استدعاء تصيير معنى رسم ربط دمج نوع](../architecture/2026-07-02-tool-render-intent-union.ar.md) —— هذا بطاقة بـ `web` فرع توسيع `card` وسم مفردات جدول.
- [Web terminal card](2026-07-28-web-terminal-card.ar.md) —— يأخذ bash `terminal` تصيير معنى رسم حمل إلى متصفح أولا مثال؛[Web result card قبل طرف](2026-07-30-web-result-card-frontend.ar.md) هو هو إبرة مقابل هذا واحد فرع مقابل خطة.

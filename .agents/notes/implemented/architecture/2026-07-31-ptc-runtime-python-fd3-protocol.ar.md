# Agent Note: the ptc-runtime-python fd-3 frame protocol

Status: implemented

CPython PTC وقت التشغيل يقع في `packages/experimental/ptc-runtime-python`، بـ `@deepseek-ai/dsh-experimental-ptc-runtime-python` اسم إصدار؛[إصدار قرار](../process/2026-09-12-publish-all-experimental-packages.ar.md) إبقاء ذلك فعلي تحقق صفة حالة.

[English](2026-07-31-ptc-runtime-python-fd3-protocol.md) | العربية

## Problem

`@deepseek-ai/dsh-experimental-ptc-runtime-python` مسؤول توفير CPython ptc-runtime مزود استخدام wire protocol. هذا مثال مزود سوف في كل جديد `python3 -I` عملية فرعية في تشغيل كل نموذج برنامج، و عبر عملية فرعية fd 3 جسر وصل binding استدعاء و إتمام قيمة.Host لا يستطيع معلومة مهمة هذا بند عبر طريق: نموذج شفرة يمكن تماما وصول fd 3 و زائف صنع مهمة معنى لقطة، لذلك host يجب يأخذ كل دخول محطة لقطة نظر لـ عدو معنى إدخال، أولا تحقق و إعادة بناء بعد عندئذ قدرة قراءة. بروتوكول أيضا يجب تحمل تحميل بلا عميق درجة حد lossless JSON، لأن seam `PtcJsonValue` عميق درجة بلا حد، بينما `JSON.stringify` و `json.dumps` كل لديه تمرير عودة عميق درجة حد.

هذا عدد فعلي تحقق حزمة معا يتضمن بروتوكول و runtime تنفيذ:`PythonPtcRuntime`(إضافة افتراضي توجيه خروج) ،`python3 -I` عملية فرعية مسار و Python جانب JSON codec كل في `@deepseek-ai/dsh-experimental-ptc-runtime-python` في. بروتوكول بناء قيام في[يمكن نقل غرس معرف رمز seam](../../archived/architecture/2026-07-31-code-runtime-portable-identifier-seam.md) لـ فوق.

## Decision

`src/protocol.ts` هو wire vocabulary host جانب و ذلك عدو معنى لقطة تحرير حل رمز:

- **`validateChildFrame`** مقابل كل دخول محطة لقطة فعل شكل حالة تحقق و إعادة بناء. تحرير ترجمة مدة union في fd 3 فوق جزء بلا معنى معنى——زائف صنع لقطة يمكن يحمل `null`، يتم تلوث صبغ حقل، أو حذف مطلوب حقل——الذي بـ كل يتم قبول لقطة كل تدريجي حقل إعادة بناء: زائف صنع مقدار خارج حقل أبدا مع سطر، غير لديه حد call id أبدا سوف يتم عودة إظهار دخول reply، نفاية قمامة إرجاع `undefined` يتم إسقاط، بينما لا هو في host message handler داخل رمي خطأ.
- **`encodeJsonPlain` / `checkDoneValue` / `hasUnsafeIntegerToken` / `hasNonLosslessNumber`** هو lossless-JSON تحرير حل رمز جهاز و حساب كمية جهاز. هو جمع تكرار بديل مرة تاريخ (صريح مكدس، غير تمرير عودة) ، جعل منخفض في بايت ميزانية عميق طبقة قيمة قدرة كامل اختراق تجاوز؛`checkDoneValue` يأخذ بايت حساب كمية و عدد حرف بلا ضرر صفة طي دخول مرة مرة تاريخ، في إضافة جديدة دخول مكدس فرعي عقدة قبل حينئذ رفض تجاوز ميزانية payload؛ نص و key من غير قسم إعداد تحويل معنى مقياس قياس مسح (`jsonStringBytesUpTo`) حساب كمية، من لا شيء تحويل تحويل معنى فرعي هذا. هو لن إعادة قيد لقطة ذاته عرض درجة:`done.value` في فحص وقت التشغيل قد مرور `JSON.parse`، لذلك إزالة استهلاك runtime يجب في تحليل قبل حد fd-3 بايت عدد. تجاوز خروج أمان نطاق كامل عدد نوع double عبر `BigInt` عدد حرف تسلسل تحويل، اختراق تجاوز هو دقيق كامل عدد بينما غير `String()` ترك دخول شكل صيغة.
- **`logTruncationMarker`** إنتاج خروج سجل ledger استهلاك كل بايت ميزانية وقت إرسال خروج حمل داخل علامة نص.

`py/protocol.py` استخدام `TypedDict` مرآة مثل رسالة شكل حالة، و إعادة إعلان اثنان جانب كل سوف EXECUTE اثنان عدد وجه——`PROTOCOL_FD = 3` و `log_truncation_marker`——نص تدريجي بايت متسق.

هذا حزمة مع بروتوكول واحد بدء تسليم runtime، معا إبقاء مستقل يمكن بناء.`check-workspace-constraints` سوف بلا شرط قراءة كل `packages/<group>/<pkg>/package.json`،coverage و invariant-topology فحص فإن سوف في حزمة دليل وجود وقت قيام أي تغطية هذا حزمة.

## Wire contract

لقطة هو fd 3 فوق JSON-lines، كل سطر واحد كائن، يجعل stdout/stderr فارغ خروج إعطاء برنامج ذاتي ذات إخراج.Child → host:`boot-ack`،`call`،`log`،`done`.Host → child:`boot`(أول لقطة) ،`run`(في `boot-ack` بعد) ، و كل `call` مقابل واحد `reply`.`log` لقطة `truncated` علامة سجل علامة ذلك عدد ذاته حينئذ هو عملية فرعية ledger قطع قطع علامة لقطة، جعل host في و عملية فرعية نفسه نقطة إيقاف التقاط، بينما لا هو من ذاتي ذات ميزانية ذهاب دفع قطع.`log` لقطة `open` علامة سجل علامة من صريح flush إيداع لم انتهاء سطر: مضيف يحتفظ هو و يأخذ تحت واحد لقطة إلحاق إلى نفس بند، لذلك صريح flush بعد وصل أكثر كثير نص قراءة عودة لـ واحد سطر بينما لا هو زائف تبديل سطر. وحيد مثال خارج هو قطع قطع: عند لاحق تجاوز ميزانية لقطة إطلاق حساب هذا وقت، قد حساب استهلاك بادئة بصفة مستقل بند أولا إيداع، قطع قطع marker تتبع في بعد وجه (marker إبقاء نهاية موضع، بلا تكرار حساب استهلاك). دمج بند خط فوق صار هذا تماما جيد حساب استهلاك مرة، في اثنان جانب حسب قطعة مقطع زيادة كمية قسم توزيع (k عدد قطعة مقطع O(k) ، أبدا مقابل كامل يحتفظ إعادة مشي): أول قطعة مقطع دفع كامل JSON نص صار هذا إضافة قسم فصل رمز، كل متابعة وصل و إغلاق دمج لقطة فقط دفع محتوى؛ مضيف دقيق صار هذا cap هو أول قطعة مقطع `logBudget - 1`(حساب هذا مسبق إبقاء بايت، و `admit` متسق) ، متابعة وصل أو إغلاق دمج لقطة `logBudget + 2`(لا يحتوي اثنان عدد جذب رقم حساب استهلاك) ، كما `jsonStringCostUpTo` في منخفض في 2 بايت cap وقت إرجاع `undefined`؛ عملية فرعية حسب `_open_started` مفرد وحيد مفتاح تحكم تفكيك قسم حساب استهلاك، لذلك إغلاق دمج لقطة حسب دمج ذيل جزء حساب استهلاك.`done.error.kind` هو `exception`،`invalid-output`،`output-limit` لـ واحد؛wall/CPU ميزانية،abort،substrate ميت هلاك كل في host جانب مراقبة قياس، لا بصفة لقطة يحمل.

## Mirror alignment

`py/protocol.py` و `src/protocol.ts` متسق قاعدة تحديد:`LogMessage` يحمل `truncated`،`DoneMessage.error` يحمل `kind`،`Namespace` يمكن يحمل `errorClass`.`tests/protocol-mirror.e2e.ts` بدء حقيقي `python3`، مقابل وفق `src/protocol.ts` تأكيد `PROTOCOL_FD`،`log_truncation_marker` و كل `TypedDict` لا بد ملء و اختياري wire حقل تجميع. حقل تعديل اسم، حذف أو لا بد ملء/اختياري صفة لا متسق كل سوف جعل اختبار فشل. حقل*نوع*لا عبر لغة حد مقارنة مقارنة؛ هذا بند نقص فتحة من مراجعة و runtime حقيقي عملية فرعية طقم عنصر (`runtime.spec.ts`) مسؤول.

## Alternatives considered

**اشتراط لم قدوم Python JSON codec(`_encode_json_plain` / `_decode_json_plain`) وضع دخول `py/protocol.py`، بـ سهل و `protocol.ts` عبر جانب مقابل تسمية.**رفض. مستودع “prefer symmetry for parallel values” قاعدة إشارة نحو حق صحيح مستو سطر قيمة؛ هذا اثنان من لا هو.`protocol.ts` في host جانب codec تحقق عدو معنى إدخال كما ذاتي يتضمن.Child جانب codec سوف إنتاج خروج تلقي معلومة مهمة إخراج، ينبغي و bootstrap يملك إرسال خروج منطق و صار هذا نواة حساب وضع في واحد بدء؛ فقط يأخذ مدخل قوي سد دخول `protocol.py` سوف يجعل vocabulary مرآة مثل اقتران دمج runtime داخلي تنفيذ، أو صنع صنع import حلقة.`protocol.py` إبقاء صاف wire-vocabulary مرآة مثل؛codec(`_encode_json_plain`/`_decode_json_plain`) و هو الذي خدمة runtime واحد بدء يقع في `bootstrap.py`.

**في runtime تسليم قبل يأخذ بروتوكول ملف وضع في غير ممكن بناء حزمة خارج.**رفض:workspace-constraint،coverage و invariant-topology فحص اشتراط `packages/<group>/<pkg>` تحت كل دليل كل هو يمكن بناء حزمة، بينما بروتوكول ذاته يملك مستقل اختبار و عام wire vocabulary.

## Consequences

استلام نيل:fd-3 بروتوكول و ذلك عدو معنى إدخال codec بنية صار ذاتي يتضمن،unit كل تغطية واحد طبقة، و من تنفيذ في guard منع توقف TypeScript/Python حقل تجميع عائم نقل. أساس في هو بناء runtime(`bootstrap.py`) إزالة استهلاك مرور مرور مراجعة wire contract.

بديل قيمة: حزمة اسم يمثل Python runtime بيت عائلة، بينما `src/index.ts` توجيه خروج كامل `PythonPtcRuntime` تنفيذ، بروتوكول vocabulary فقط هو حزمة جدول وجه واحد جزء.mirror e2e سوف مقارنة مقارنة اثنان جانب حقل اسم و لا بد ملء/اختياري حالة، لكن لا مقارنة مقارنة حقل نوع؛ عبر TypeScript و Python مقارنة مقارنة نوع إعلان لا يوجد آلة آلة انتظار قيمة شيء، لذلك مراجعة و runtime حقيقي عملية فرعية طقم عنصر متابعة مسؤول هذا بند فحص.

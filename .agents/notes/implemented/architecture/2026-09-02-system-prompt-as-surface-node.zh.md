# Agent Note: توجيه النظام هو surface رقم 0 رقم عقدة

Status: implemented

[English](2026-09-02-system-prompt-as-surface-node.md) | العربية

## Problem

وضع في surface خارج توجيه النظام، ذلك حفظ دائم يمثل و نموذج قراءة إلى أخرى كل رسالة كل مختلف. محادثة رسالة هو surface حدث (`user/message`،`assistant/message`،`tool/result`) ، من `Session.deriveMessages()` حسب seq ترتيب طي؛ بينما تخزين وضع في فقط تسجيل سجل `request/header` لقطة `system` حقل في نص التوجيه، يجب من كل تسلسل تحويل جهاز قبل وضع لـ بروتوكول رسالة 0.[يمكن إعادة بناء طلب Agent Note](2026-07-05-reconstructable-requests.zh.md) يجعل اثنان نصف كل يصبح حمل دائم بيانات، لكن هذا نوع تخطيط يجعل واحد نموذج مرئي واقع يملك اثنان عدد ملكية:surface يملك رسالة،header يملك ترتيب في هذه رسالة قبل ذلك بند رسالة.

هذا نوع تفكيك قسم إجبار جعل كل تفكير معرفة طريق «نموذج يرى ماذا» قراءة جهة كل يلزم دمج اثنان عدد مصدر: ضغط (compaction) ملخص جهاز يأخذ header في نص التوجيه نسخ إلى منطقة مجال إرسال توليد رسالة قبل،`dsh-token-meter` من header تقدير حساب توجيه النظام لكن من surface لـ أخرى كل بند رسالة حساب قيمة،Web طلب نص التوجيه بطاقة، مسار أثر عرض و لقطة عودة واحد تحويل جهاز `{{system}}` احتلال موضع رمز كل منها مفرد وحيد قراءة header. تغيير فحص قياس نفس مثال يتم تفكيك فتح: في `config` و `tools` جانب حافة تدريجي بايت مقارنة مقارنة `system` `headerEquals`، يجعل نص التوجيه تغيير و أداة تغيير في سجل في لا يمكن منطقة قسم (`request/header` reason كل هو `change`) ، كل إدارة هو جمع هو مقابل محادثة اثنان نوع مختلف عملية.

هذا نوع تفكيك قسم أيضا منع سد تحت واحد خطوة. واحد يأخذ محادثة في طريق `system` رسالة عند عمل نص التوجيه استبدال قدوم قبول نموذج، حاجة harness نحو تاريخ إلحاق واحد بند system زاوية لون رسالة؛ عند نص التوجيه إقامة في header داخل وقت، لا يوجد يمكن إلحاق surface يمثل،header أيضا فقط قدرة اعتماد خاص مثال يتم تجميد ربط.[تاريخ داخل استبدال قرار](../feature/2026-09-02-in-history-system-prompt-replacement.zh.md) اعتماد هذا Agent Note.

## Decision

توجيه النظام إقامة في surface فوق. هو هو واحد عادي surface حدث `system/message`، نص التوجيه دورة الحياة في كل عملية كل هو مقابل هذا حدث نوع تطبيق إضافة قائم اثنان نوع `SurfaceOp` تغيير جسم لـ واحد. بروتوكول طلب ثابت:surface طي إنتاج خروج حينئذ هو تسلسل تحويل جهاز إرسال رسالة قائمة، نظام رسالة في الأكثر قبل وجه.

### حدث

`system/message` هو `SurfaceEventType` عضو، و `user/message`،`assistant/message`،`tool/result` و صف (`packages/core/session/src/types.ts`). هو تحميل حمل و `tool/result` مقابل تسمية:`{ turn, step, message }`، منها `message` هو `role: 'system'` `SystemMessage`، واحد نص كتلة تحمل تحميل تصيير بعد نص التوجيه،source لـ `{ kind: 'plugin', plugin: '@deepseek-ai/dsh-system-prompt' }`. فارغ `content` سجل «لا يوجد توجيه النظام»: هذا عقدة إبقاء ذلك surface موضع،`deriveEventMessage` يأخذ هو إسقاط لـ `null`، لذلك لا مساهمة أي بروتوكول رسالة. غير فارغ عقدة تدريجي حرف إسقاط، لذلك `deriveMessages()` في ذلك surface موضع إرجاع نظام رسالة، بينما أصل مثال نفاذ نقل `role: 'system'` تاريخ رسالة DeepSeek تسلسل تحويل جهاز يأخذ هو بصفة بروتوكول رسالة 0 إرسال خروج.`EpochHeader` هو `{ config, adapterDefaults?, tools? }`؛`packages/core/session/src/request-header.ts` في `canonicalHeader` و `headerEquals` فقط مقارنة مقارنة config، مهايئ قيمة افتراضية و أداة.

### عملية

| حال شكل | surface عملية |
|---|---|
| surface فوق لا يوجد تخزين نشط `system/message`(يشمل تصيير بعد نص التوجيه لـ فارغ وقت) | إلحاق `system/message`؛ في جلسة أول عدد خطوة في هو هو surface رقم 0 رقم عقدة، يقع في هذا خطوة أول بند `user/message` قبل |
| لديه تخزين نشط `system/message` كما تصيير بعد نص التوجيه و ذلك نص مختلف (يشمل نص التوجيه تغيير لـ فارغ) | تماما جيد استبدال هذا عقدة:`surfaceOp: { op: 'replace', startSeq: <هذا عقدة seq>, endSeq: <نفس قيمة> }`،`sourceEventSeqs: [<هذا عقدة seq>]`؛ فارغ نص التوجيه إنتاج واحد إسقاط لـ بلا رسالة فارغ محتوى عقدة |
| تصيير بعد نص التوجيه و تخزين نشط عقدة نص نفسه | بلا عملية |

عند ابتدائي تصيير نص التوجيه لـ فارغ وقت، حلقة في ابتدائي وصل قبول مستخدم رسالة قبل مسبق إبقاء فارغ نظام رأس جزء، جعل قليلا بعد أول مرة تغيير لـ غير فارغ نص التوجيه ما زال استبدال رقم 0 رقم عقدة. حذف هذا فارغ عقدة سوف يجعل بعد قدوم نص التوجيه إلحاق في مستخدم تاريخ بعد،pi-ai سوف سوف ذلك تحويل لـ مستخدم رسالة، بينما لا هو `systemPrompt`. استبدال رقم 0 رقم عقدة هو رأس جزء إعادة كتابة في surface فوق جدول بلوغ: مزود بادئة من رقم واحد token بدء تغيير، سجل عبر `sourceEventSeqs` سجل يتم حجب حجب عقدة،`replaceGeneration` و ضغط استبدال وقت واحد مثال دفع دخول. لذلك حلقة `startsSeries` فحص قياس (`requestSurfaceGeneration !== surfaceGeneration`) بلا حاجة في `headerEquals` في مقارنة مقارنة `system` يكفي تغطية نص التوجيه تغيير.`request/header` إبقاء `initial`،`resume`،`change`،`series` أربعة نوع reason؛`change` يمثل config أو tools تغيير، نص التوجيه استبدال بعد تتبع مع لم تغيير header تسجيل لـ `series`.

`packages/core/session/src/surface.ts` في `assertSystemHeadRewrite` في قوي صنع رأس جزء ثابت كمية: عند رقم 0 رقم عقدة هو `system/message` وقت، نطاق تغطية رقم 0 رقم عقدة استبدال سوف يتم رفض، حذف غير استبدال حدث ذاته هو تماما جيد تغطية هذا عقدة `system/message`. يقع في أكثر بعد موضع نظام عقدة لا يوجد هذا صنف حفظ حماية؛ ضغط نطاق يمكن حجب حجب هو جمع.

### حلقة في ملكية

`dsh-agent-loop` في `packages/core/agent-loop/src/runtime-context.ts` في و `RuntimeContextProjection` و صف يملك `SystemPromptProjection`. هو في كل مرة إسقاط وقت من حالي surface قراءة تخزين نشط `system/message` عقدة، لذلك نفس خطوة في أكثر مبكر تشغيل ضغط أو استبدال قد عكس عكس في داخل.`project(rendered, { inHistory, startsSeries })` إرجاع `{ message, intent }`——لا يوجد نظام عقدة تخزين نشط أو[تاريخ داخل قاعدة](../feature/2026-09-02-in-history-system-prompt-replacement.zh.md) ملائم استخدام وقت `intent` لـ `{ surfaceOp: 'append' }`، لا فإن هو مقابل الأكثر جديد تخزين نشط نظام عقدة دقيق استبدال——الأكثر جديد عقدة قد يحتفظ تصيير نص وقت إرجاع `undefined`.

في `packages/core/agent-loop/src/agent.ts` في،`preStep` استخدام `renderPrompt(assembly)` تصيير نص التوجيه، و في `agent/pre-step` waterfall بعد إسقاط هو، لذلك ضغط توفير من في هذا waterfall داخل فعل خروج استبدال مقابل قرار مرئي؛`turn()` ضيق وصل في `step/start` بعد، هذا خطوة `user/message` حدث قبل إيداع `system/message`، لذلك سجل ترتيب أي بروتوكول ترتيب.`buildRequest` لا في طلب فوق ضبط `system`: طلب من `header.config`،`session.deriveMessages()`(نظام رسالة في أولا) و `header.tools` بنية صار. حلقة خطوة ترتيب لـ: قيادة أخذ استلام عنصر صندوق → `systemPrompt.assemble()` → إسقاط وقت التشغيل سياق → `agent/pre-step` waterfall → إسقاط توجيه النظام → `step/start` → إيداع `system/message`(لديه تغير وقت) → إيداع كل بند `user/message` → `agent/request` waterfall → `request/header` → `request/context` → تدفق صيغة طلب.`dsh-agent-loop/invariant` مرافق مع مكون (`packages/core/agent-loop/src/invariant.ts`) تأكيد حلقة بناء طلب ممتلئ كاف `system === undefined` كما `messages` انتظار في `deriveMessages()`.

`dsh-token-meter` يأخذ استخدام كمية مرساة تحديد إلى نجاح `assistant/message` قبل قد حساب قيمة surface، بينما لا هو `step/start`. حلقة في خطوة بدء بعد وصل قبول توجيه النظام و مستخدم رسالة، إعادة محاولة استعادة أيضا ممكن في إعادة بناء طلب قبل استبدال عقدة. التقاط حالي surface سوف يجعل كل قد وصل قبول إدخال تماما جيد حساب دخول مرة؛ داخل تضمين مزود إخراج ما زال مفرد وحيد حساب قيمة، لذلك حمل دائم assistant تعديل كتابة إبقاء ذلك حمل رمز رقم زيادة كمية. فتح وضع خطوة فقط حفظ turn و step بـ تحقق دورة الحياة، لا حفظ ثاني نسخة عقدة لقطة.

### مستهلك

| مستهلك | قراءة محتوى |
|---|---|
| DeepSeek تسلسل تحويل جهاز (`serializeRequest`،`serializeRequestWithImages`) | `options.messages`، يأخذ `role: 'system'` تاريخ رسالة بصفة بروتوكول رسالة 0 نفاذ نقل؛`GenerateOptions.system` لـ عنوان مزود انتظار مباشر مفرد مرة استدعاء جهة إبقاء |
| `dsh-llm-pi-ai` | فتح رأس system تاريخ رسالة خريطة لـ pi-ai `systemPrompt` |
| `compaction-basic` `buildSummarizationInput` | رقم 0 رقم عقدة إرسال توليد رسالة قبل وضع في `SummarizationInput.messages` في منطقة مجال رسالة، بلا مفرد وحيد `system` حقل؛ فارغ محتوى رأس عقدة لا إسقاط لـ رسالة، لكن ما زال تلقي حفظ حماية بينما لا يستطيع يتم ضغط |
| `compaction-basic` `selectCompactableRange` | مرساة تحديد في أول عدد غير نظام عقدة؛ رقم 0 رقم عقدة دائم لا سقوط دخول ضغط نطاق |
| `dsh-token-meter` | نظام عقدة بصفة surface عقدة حساب قيمة، عودة دخول `systemTokens` واضح دقيق |
| Web طلب نص التوجيه بطاقة، مسار أثر طلب عقدة، طلب فحص نظر | `system/message` عقدة؛ يتم استبدال رقم 0 رقم عقدة عرض لـ نص التوجيه تغيير، إلحاق تاريخ داخل عقدة عرض لـ نص التوجيه تحديث، كل منها بـ طي يمكن فحص نظر بطاقة عرض، دائم لا بصفة حديث يوم هواء فقاعة |
| لقطة عودة واحد تحويل جهاز `{{system}}` احتلال موضع رمز،plan-mode اختبار | نظام عقدة نص |
| TypeScript و Python SDK مسبق مدة إخراج | يتضمن `system/message` حدث |
| شخص صنف transcript(نص سجل) إسقاط | قفز مرور `system/message`؛ هو هو نموذج تاريخ، لا هو محادثة |

`RuntimeContextProjection` و `SystemPromptProjection` كل يأخذ واحد بند لم إيداع رسالة تسليم إعطاء حلقة من `turn()` إيداع. اثنان من في مراقبة surface طريقة و عملية تجميع فوق مختلف: وقت التشغيل سياق تتبع مع `session/event` مراقبة ذاتي ذات يملك user زاوية لون لقطة كما فقط فعل إلحاق، بينما توجيه النظام في كل مرة إسقاط وقت مسح حالي surface فوق نظام عقدة، لأن هو قرار أخذ قرار في لديه كثير قليل عقدة تخزين نشط، و حسب توجيه إلحاق أو استبدال.

### V2-to-V3 بنية تحويل

[V2 إلى V3 مواصفة](../../../../packages/session/session-format-v2-to-v3/README.zh.md#system-head) مسؤول نظام رأس عقدة تحويل و رسالة هوية؛ ذلك[مرجع قاعدة](../../../../packages/session/session-format-v2-to-v3/README.zh.md#sequence-references) و[مصدر رفض](../../../../packages/session/session-format-v2-to-v3/README.zh.md#source-audit) تعريف إبقاء محتوى و لا دعم حمل إدخال. ترحيل تخطيط و أصلي طلب دلالة انتظار قيمة، بينما غير و أصلي تسجيل صنع تدريجي بايت نفسه. صالح V2 مصدر في حالي خطوة ثابت كمية تحت ممكن لا يوجد إبقاء ترتيب تحويل طريقة؛ رفض هو أفضل في نقل حركة تاريخ أو وضع عرض ملكية. تاريخ استقبال جلوس علامة لا نيل تغيير لـ مقابل تحويل بعد سجل تأكيد.

[قد إصدار صيغة سياسة](2026-08-31-released-session-format-migrations.zh.md) إبقاء كل بند قد إصدار تحويل دلالة؛ قد لديه هدف صيغة بديل حد لن إعادة ركض ذلك دخول حافة. إسقاط ذاكرة مؤقتة إصدار مستقل في Session صيغة إصدار.

[مواصفة معلومة غلاف مواصفة](../../../../packages/session/session-format-v2-to-v3/README.zh.md#canonical-envelopes) تعريف و بنية تحويل تركيب؛[مواصفة معلومة غلاف قرار](2026-09-06-v3-canonical-session-envelopes.zh.md) مسؤول صارم إطار دقيق دخول اعتماد حسب.

## Alternatives considered

**إبقاء `header.system`، فقط لـ تحديث إضافة `system/message`.** واحد واقع اثنان عدد ملكية: فوق وصف كل مستهلك كل يلزم من header قراءة رسالة 0، من surface قراءة لاحق رسالة، حلقة أيضا حاجة واحد في surface وجود نظام عقدة وقت يجعل `headerEquals` تجاهل اختصار `system` خاص مثال. يتم مرفوض، لأن هذا مرة تغيير هدف حينئذ هو مفرد واحد يمثل.

**استخدام مخصص باب فقط تسجيل سجل حدث `system-prompt/change` إعادة كتابة header.** إبقاء header بصفة نص التوجيه ملكية، و يأخذ تغيير سجل لـ مستقل حدث نوع صنف، لكن ما زال لا يمكن جدول بلوغ تاريخ داخلي نظام رسالة، تاريخ داخل استبدال رفع سجل أيضا هو حاجة ثاني طقم آلية. يتم مرفوض.

**في مهايئ داخل أصل حسب متبادل مجاور header دمج صار نظام رسالة.** مهايئ تدريجي طلب بلا حالة كما من لا وصل لمس سجل؛ اعتماد مهايئ حالة بروتوكول تاريخ لا يمكن من surface طي إعادة بناء. يتم مرفوض.

**مثل وقت التشغيل سياق ذلك مثال استخدام `user/message` لقطة جدول بلوغ نص التوجيه.** إعادة استخدام قائم حدث نوع، لكن إرسال خطأ زاوية لون، لذلك يأخذ نظام رسالة نظر لـ مرجعي نموذج لن هذا مثال مقابل انتظار هو. يتم مرفوض.

## Consequences

- مفرد واحد يمثل: كل تفكير معرفة طريق «نموذج يرى ماذا» قراءة جهة كل طي surface؛ لا يوجد مستهلك حاجة يأخذ header و رسالة قائمة دمج.`EpochHeader` لا يوجد `system` حقل، لذلك مدة نظر هذا حقل قراءة جهة في تحرير ترجمة مدة فشل.
- نص التوجيه تغيير و أداة أو config تغيير في سجل في يمكن منطقة قسم: قبل من هو مقابل رقم 0 رقم عقدة `system/message` استبدال إضافة مع بعد `series` header، بعد من هو reason لـ `change` `request/header`.
- ضغط حمل لديه واحد بند ثابت كمية: رقم 0 رقم عقدة دائم لا يتم ضغط.`dsh-session` surface إدارة جهاز في استبدال عملية ذاته في قوي صنع هو، لذلك حذف `compaction-basic` بـ خارج ضغط مزود لا يمكن عبر مرساة تحديد في `surfaceNodes[0]` قدوم حجب حجب نص التوجيه. أكثر بعد موضع نظام عقدة حسب تصميم لا تلقي حفظ حماية.
- `replaceGeneration` في نص التوجيه استبدال وقت و ضغط وقت واحد مثال دفع دخول؛ حاجة منطقة قسم اثنان من قراءة جهة فحص استبدال حدث نوع.
- تاريخ في طريق نظام عقدة يملك surface يمثل، هذا صحيح هو[تاريخ داخل استبدال قرار](../feature/2026-09-02-in-history-system-prompt-replacement.zh.md) الذي اعتماد أساس أساس.
- ابتدائي فارغ نص التوجيه احتلال حسب تلقي حفظ حماية رأس جزء، لكن لا مساهمة بروتوكول رسالة؛ في استبدال نمط تحت، بعد قدوم غير فارغ نص التوجيه استبدال هو، و إبقاء لـ فتح رأس نظام رسالة.
- تسجيل صنع لقطة fixture يحمل `system/message` حدث بينما غير header `system` حقل. لقطة عودة واحد تحويل جهاز يأخذ هذا حدث نص علامة تحويل لـ `{{system}}`، نص التوجيه مرافق مع ملف من `system/message` تسلسل أخذ تجميع (كل نص التوجيه إصدار واحد عقدة، بـ `header.promptChanges` إعلان) ،`request/header` pin فقط مقارنة مقارنة config و tools.

## Testing

- `packages/compaction/compaction-basic/tests/compaction-loop-repro.spec.ts` تثبيت إقامة مزود استخدام كمية تحت استدعاء بعد جدول وجه زيادة كمية لـ صفر، تغطية ابتدائي، زيادة طويل، تقليص قصير و فارغ نص التوجيه، نفس خطوة في إعادة محاولة استبدال، طلب في بين عنصر و كل جديد إعادة تشغيل.
- `packages/core/session/tests/surface.spec.ts`(`system/message surface node` كتلة) تثبيت إقامة فتح رأس system زاوية لون إسقاط، فارغ محتوى `null` إسقاط،`assertSystemHeadRewrite` قبول و رفض مسار، أكثر بعد موضع نظام عقدة لا تلقي حفظ حماية، و مقابل seed في غير system زاوية لون أو غير إضافة source `system/message` رفض.
- `packages/core/agent-loop/tests/system-prompt-projection.spec.ts` تثبيت إقامة أول مرة تصيير وقت إلحاق (يشمل فارغ نص التوجيه) ، استبدال نمط تحت بعد قدوم غير فارغ نص التوجيه يقع في إرسال توليد تاريخ رأس جزء، نص التوجيه لم تغيير وقت بلا عملية، تغيير وقت مقابل الأكثر جديد تخزين نشط عقدة استبدال، استبدال حجب حجب غير رأس جزء نظام عقدة بعد ذيل جزء إلحاق، و تاريخ داخل إلحاق و إعادة أساس خط قاعدة.
- `packages/core/agent-loop/tests/request-reconstruction.spec.ts`(`a system-prompt change replaces surface node 0 and starts a new series under the same header`) تثبيت إقامة نص التوجيه استبدال بعد تتبع مع `series` header.
- `packages/core/agent-loop/tests/invariant.spec.ts` تثبيت إقامة مرافق مع مكون مقابل يحمل `system` حقل حلقة طلب رفض، و ذلك `messages` و حد إرسال توليد نتيجة متبادل انتظار صفة فحص.
- `packages/llm/llm-deepseek/tests/serialize.spec.ts`(`serializes a leading system message byte-for-byte like the same prompt passed as options.system`) تثبيت إقامة بروتوكول متسق صفة. `packages/llm/llm-pi-ai/tests/context.spec.ts` في نص و صورة مسار فوق مقارنة مقارنة اثنان نوع توجيه النظام مصدر.`packages/compaction/compaction-basic/tests/compaction-basic.spec.ts` عبر منطقة مجال أمر خدمة و افتراضي ملخص جهاز تثبيت إقامة إرسال توليد بادئة، قد توجيه أداة، لا يحمل مفرد وحيد `system` خيار، و غير فارغ أو فارغ رأس عقدة حفظ حماية.
- `snapshots/` تحت تسجيل صنع لقطة تثبيت إقامة كل مع إرسال profile نموذج مرئي بروتوكول طلب؛ تصيير نص التوجيه تسجيل صنع جلسة في ذلك `session.jsonl` في في surface رقم 0 رقم عقدة يحمل `system/message` حدث، جلسة في طريق حدوث نص التوجيه تغيير جلسة فإن يحمل مقابل رقم 0 رقم عقدة استبدال، أو في تاريخ داخل توجيه فوق يحمل إلحاق عقدة.

# قلب ترجمة لغة جسم مثال مثال (style samples)

هذا ملف هو قلب ترجمة لغة جسم تدقيق دقيق مرساة نقطة: كل مجموعة مثال مثال هو واحد مقطع إنجليزي نص أصل نص و واحد مقطع شخص عمل تحديد مسودة العربية ترجمة نص، تغطية هذا مستودع وثيقة رئيسي يلزم نص جسم.**ترجمة نص لغة جسم بـ هذه مثال مثال لـ دقيق**——نص جسم مثال مثال فاعلية قوة عال في مقابل لغة هواء نص حرف وصف، لكن فن لغة جدول، وفي فعلي صفة و بنية قاعدة ما زال أولوية. قلب ترجمة أو مراجعة وقت مقابل وفق الأكثر وصل قريب نص جسم مثال مثال. هذا ملف في إنجليزي مقابل وفق، ذاتي صار مزدوج لغة، لا مشاركة و إعداد مقابل (رؤية [README.md](README.md) ترتيب حذف بيان).

صيانة طريقة: شخص عمل مراجعة تدقيق دقيق خروج جديد ذهب علامة مقطع سقوط بعد إلحاق إلى مقابل نص جسم؛ اكتشاف دلالة، بنية أو فن لغة خطأ وقت مباشر إصلاح صحيح. إضافة جديدة أو إصلاح صحيح مثال مثال كل يحتاج مرور مرور PR مراجعة.

## ① هيكل بنية سرد وصف

> This document describes the architecture of the DeepSeek Harness — the foundation of **DeepSeek Code**. The governing principle, from the microkernel design discussion: **everything is a plugin**. The core is deliberately tiny — a handful of abstract services plus one concrete loop plugin (`dsh-agent-loop`) — and every product feature is a plugin against the extension API described here, without modifying the loop.

هذا نص وسيط تعريف DeepSeek Harness كامل جسم هيكل بنية، هو هو **DeepSeek Code** قاع طبقة أساس مقعد. دقيق داخل نواة تصميم نقاش نقاش في تأكيد قيام نواة قلب تصميم دقيق فإن:**واحد قطع جميع إضافة**. داخل نواة لحظة معنى فعل نيل أقصى دقيق بسيط، فقط يتضمن قليل كمية سحب كائن خدمة، خارج إضافة واحد فعلي جسم حلقة إضافة `dsh-agent-loop`. كل منتج وظيفة متساو أساس في هذا نص تعريف توسيع واجهة تطوير لـ مستقل إضافة، بلا حاجة تعديل رئيسي حلقة منطق.

> Dependency rule: extension plugins depend on interfaces, never on `dsh-agent-loop` (the loop is swappable); composition bundles such as `dsh-base` and `dsh-sdk-minimal` may assemble the concrete loop.

اعتماد قيد مواصفة: كل صنف توسيع إضافة فقط اعتماد سحب كائن واجهة، صارم منع مباشر اعتماد `dsh-agent-loop`(هذا رئيسي حلقة دعم حمل استبدال تنفيذ) ؛`dsh-base` و `dsh-sdk-minimal` انتظار تركيب حزمة يمكن تجميع أداة جسم حلقة.

> This document covers **behavior**; type definitions live in [subsystems/](../subsystems/core.md), the per-event/service reference lives in the generated regions of [subsystems/](../subsystems/core.md), and package contracts in the package READMEs state each package's required configuration and behavior ([map](../../packages/README.md)).

هذا وثيقة وصف كامل جسم سلوك منطق؛ نوع تعريف تخزين وضع في [subsystems/](../subsystems/core.ar.md) ؛ كل صنف حدث، خدمة تفصيل دقيق مشاركة اعتبار رؤية [subsystems/](../subsystems/core.ar.md) في توليد منطقة كتلة؛ متبادل ينبغي README شرح كل حزمة (package) اشتراط إعداد و سلوك ([بحث جذب](../../packages/README.ar.md)).

## ② منع صد نمط قاعدة

> Hard-won bug-class rules: each pattern below is a class of defect that actually shipped or nearly shipped here, stated as the rule that prevents its recurrence. Read this before writing lifecycle, concurrency, subprocess, or teardown code.

هذه كل هو دوس حفرة مجموع ربط نيل خروج نقص وقوع تصنيف مواصفة: تحت نص كل نوع نطاق صيغة كل مقابل واحد صنف سبق فوق خط، أو خطر بعض تدفق دخول خط فوق مشكلة، كل بند مواصفة غاية في منع قطعا نفس صنف مشكلة تكرار الآن. تحرير كتابة دورة الحياة، تزامن، عملية فرعية، مورد إلغاء تدمير متبادل صلة شفرة قبل، طلب خدمة لا بد قراءة قراءة هذا وثيقة.

> **Dispose must reach quiescence, not just request it** — A teardown that issues kills/aborts but returns before the work stops leaves orphans. Make cleanup async and await the children's exit (kill → await `done`), and close listener/notification registries BEFORE killing so late completions stay silent. Tests prove disposal waited (pid gone right after `await fiber.dispose()`), not merely that the process eventually dies.

**dispose(مورد تحرير) يجب انتظار كل مهمة تماما توقف مستقر، لا يستطيع فقط تحت إرسال إنهاء إشارة أمر حينئذ إرجاع**: إذا تنظيف مرور مسار فقط إرسال خروج إنهاء أو في قطع إشارة، لكن لا انتظار مهمة إيقاف حينئذ إرجاع، حينئذ سوف إبقاء تحت منعزل طفل عملية. تنظيف ينبغي اعتماد مختلف خطوة طريقة، انتظار كل فرعي مهمة تام قاع خروج (أولا إرسال خروج إنهاء إشارة، مجددا انتظار خروج) ؛ إرسال خروج إشارة قبل ينبغي أولا إغلاق مستمع و إشعار سجل التسجيل، جعل تأخير متأخر وصول إتمام حدث لم يعد إطلاق إشعار. اختبار يلزم إثبات dispose تأكيد انتظار إلى تنظيف إتمام: تنفيذ تمام `await fiber.dispose()` بعد عملية PID قيام أي إزالة فقد، لا يستطيع فقط فحص عملية نهائي سوف ذاتي سطر إزالة هلاك.

> **Async state is not synchronous state** — `agent.followup()` does not flip status before returning; a background job's completion races turn boundaries; `reader.close()` fires for both EOF and disposal. Never gate control flow on a status you only just requested — drive lifecycle off the events/promises that actually fire (`agent/status`, `task.done`), and observe the transition (saw `running` THEN `idle`) instead of treating status as a per-follow-up result: several queued follow-ups run as consecutive turns under one `running` interval, while cancellation or disposal can discard unstarted items.

**مختلف خطوة حالة لا انتظار نفس في تزامن لحظة وقت حالة**: استدعاء `agent.followup()` لن في إرجاع قبل تزامن تحديث حالة؛ خلفية مهمة إتمام وقت و جولة حد وجود تنافس حالة؛`reader.close()` حيث سوف في قراءة إلى ملف نهاية ذيل وقت إطلاق، أيضا سوف في مورد تحرير وقت إطلاق. قطع لا يأخذ للتو للتو إرسال بدء حالة تغيير عند صار قد توليد فاعلية، حسب هذا تحكم مسار؛ دورة الحياة منطق ينبغي بـ فعلي إطلاق حدث و قد إتمام promise(`agent/status`،`task.done`) لـ دقيق، و مراقبة كامل حالة تغير (أولا `running`، مجددا `idle`) ، لا يلزم يأخذ حالة عند عمل تدريجي مرة `followup()` نتيجة: كثير مرة ترتيب طابور `followup()` سوف بصفة وصل متابعة جولة تشغيل، لكن ممكن مشترك استخدام واحد `running` منطقة بين؛ إلغاء أو مورد تحرير أيضا ممكن إسقاط بعد لم بدء طابور صف بند.

## ③ اختبار سياسة سياسة بيان

> **Coverage gate** (`pnpm run test:coverage`): the gating run, per-file 100% on `packages/*/*/src`. An uncovered line is often dead code the gate is correctly flagging for deletion, not a missing test to bolt on. Line coverage is necessary, never sufficient — it proves lines ran, not that the feature works as shipped.

نسبة التغطية بوابة (`pnpm run test:coverage`): بصفة دمج دخول بوابة تحقق، اشتراط `packages/*/*/src` دليل تحت كل ملف سطر نسبة التغطية بلوغ إلى 100%. لم تغطية شفرة سطر كبير كثير هو بلا استخدام ميت شفرة، بوابة علامة هذا صنف شفرة هو تلميح حذف، بينما غير مفرد صاف تكملة ملء اختبار. سطر نسبة التغطية هو لا بد يلزم شرط، لكن بعيد لا ملء قسم: هو فقط قدرة إثبات شفرة يتم تنفيذ مرور، لا يمكن حفظ إثبات وظيفة رمز دمج خط فوق مسبق مدة.

> We are DeepSeek — do not ration real-API tests. A no-key test proves the plumbing; only a with-key run proves the agent works against a real model. Write many: real prompts that write files, multi-turn conversations, tool use, cancellation mid-stream. Cheapest and highest-value are **smoke tests** that boot the real example, send one real prompt, and check the world — they catch the "green unit tests, broken product" class that mocks structurally cannot. The self-skip exists only so secretless CI and keyless contributors aren't blocked; it is not a cost signal.

أنا جمع هو DeepSeek: حقيقي واجهة متبادل صلة اختبار لا نيل لحظة معنى تقليص نقص حالة استخدام عدد كمية. بلا مفتاح اختبار فقط قدرة تحقق قاع طبقة عبر مسار؛ فقط لديه يحمل صالح مفتاح تنفيذ حالة استخدام، عندئذ قدرة تأكيد agent(ذكي جسم) يمكن صحيح معتاد مقابل وصل حقيقي نموذج. طلب كبير كمية تحرير كتابة هذا صنف اختبار: يتضمن ملف كتابة صنف حقيقي نص التوجيه، كثير جولة محادثة، أداة استدعاء، تدفق صيغة في طريق إلغاء انتظار مشهد.

صار هذا الأكثر منخفض، استلام فائدة الأكثر عال هو**خطر دخان اختبار**: سحب بدء كامل حقيقي عرض مثال، إرسال واحد بند حقيقي تلميح، و فحص ملف، عملية انتظار خارجي يمكن مراقبة نتيجة. هذا صنف حالة استخدام قدرة التقاط واحد صنف مشكلة——اختبار وحدة الكل أخضر مصباح، لكن منتج فعلي تشغيل لذا عائق، مفرد اعتماد mock تماما لا يمكن اكتشاف هذا صنف نقص وقوع.

ذاتي حمل تلقائي قفز مرور منطق، فقط لأجل حفظ عائق بلا مفتاح CI بيئة، بلا إذن مساهمة من لن يتم مسار اعتراض قطع، لا بديل جدول يمكن بـ هذا لـ من تقليل نقص حقيقي واجهة اختبار إلقاء دخول.

> **Prefer the real implementation over a mock** — Mock only genuinely expensive or non-deterministic dependencies (the LLM adapter, the network, the clock); keep everything downstream real. A hand-rolled stand-in proves the bridge moves bytes, not that the shipping tool behaves as asserted — the two drift while the test stays green.

**أولوية استخدام حقيقي تنفيذ، بينما غير mock بديل ذات**——فقط مقابل فتح إلغاء أقصى كبير، نتيجة لا تحديد اعتماد فعل mock(LLM(كبير لغة نموذج) مهايئ، شبكة شبكة، وقت ساعة) ، ذلك بقية تحت تنقل مكون الكل استخدام حقيقي تنفيذ. يد كتابة mock بديل ذات فقط قدرة تحقق بيانات عبر مسار قدرة نقل بايت، لا يمكن حفظ إثبات خط فوق أداة رمز دمج مسبق مدة منطق؛ طويل مدة تحت قدوم عمل خدمة منطق و mock تنفيذ سوف ظهور انحراف فرق، لكن اختبار ما زال سوف عرض عبر.

## ④ آلية وصف

> Blob hashes, not commit hashes, so the record is computable for files edited in the same PR (`git hash-object foo.md`) and consistency is a pure content comparison. The recorded hash also recovers the exact last-confirmed text of either side (`git cat-file -p <hash>`), so an out-of-sync pair is updated by diffing the edited side against its last-confirmed state and patching the counterpart minimally — never by re-translating whole files.

نظام اعتماد ملف blob hash بينما غير commit hash سجل حالة. نفس PR داخل تعديل ملف وقت، يمكن عبر `git hash-object foo.md` مباشر حساب خروج مقابل blob hash، فقط مقابل مقارنة ملف محتوى يكفي حكم قطع مزدوج لغة وثيقة هل تزامن. عبر سجل blob hash، يمكن استخدام `git cat-file -p <hash>` أيضا أصل فوق مرة تأكيد مقابل متساو وقت اثنان جانب أصل نص. عند مزدوج لغة وثيقة لا متسق وقت، فقط يحتاج مقابل مقارنة تعديل إصدار و فوق مرة تأكيد إصدار فرق مختلف، الأكثر صغير عرض درجة تزامن تعديل آخر جانب ترجمة نص، بلا حاجة كل نص إعادة قلب ترجمة.

## ⑤ سياسة سياسة إعلان

> The gate's limit, stated plainly: a green gate means the pair was confirmed consistent at these exact contents, not that the confirmation was sound. It checks hashes and Markdown structure; it cannot judge whether the two sides actually say the same thing — that is the reviewer's half of the contract. A re-recorded pair with a sloppy counterpart passes the gate; it must not pass review.

بوابة حد جدا واضح: عبر بوابة فقط شرح اثنان جانب ملف حالي blob hash و مرافق مع سجل تطابق دمج، و كما Markdown بنية توقيع متسق، أيضا حينئذ هو قول، هذا مجموعة محتوى سبق يتم تأكيد متسق؛ هو لا بديل جدول هذا مرة تأكيد يمكن اعتماد. مراجعة شخص يجب فحص اثنان نوع لغة هل حق صحيح جدول بلوغ نفسه معنى تفكير. أي جعل ترجمة نص خشن خشن، جدول معنى لديه خطأ، إعادة سجل إعداد مقابل بعد ما زال قدرة عبر بوابة، لكن أبدا قدرة عبر شخص عمل مراجعة.

## ⑥ Agent Note نقاش إثبات

> Comparing git timestamps of the pair (no record) — rejected: formatting-only edits would false-positive, and a counterpart committed after an unrelated edit would false-negative; content identity is the only signal that means what the gate claims.

مقابل مقارنة مزدوج لغة ملف git ختم الوقت (بلا سجل خطة)——غير مقبول: فقط ضبط كامل صيغة تعديل سوف إطلاق خطأ تقرير، غير متصل تعديل بعد مجددا إيداع ترجمة نص أيضا سوف صنع صار تسرب فحص. فقط لديه أساس في محتوى ذاته معرف (كل جانب ملف blob hash و مرافق مع سجل مقارنة مقابل) ، عندئذ قدرة تحمل تحميل بوابة الذي صوت تسمية دلالة.

## ⑦ موحد واحد اشتراط (طويل مقطع تفكيك قسم عرض نطاق)

> **Universal requirement**: every in-scope document merges as a complete bilingual pair. The manifest contains only explicit exclusions: it has no per-file rollout list, date cutoff, or README-specific policy class. […] Pairing is a continuing obligation: every later edit to either side updates the counterpart and consistency record in the same change.

**موحد واحد اشتراط**: كل مقالة قبول دخول نطاق وثيقة دمج دخول وقت كل يجب بنية صار كامل مزدوج لغة إعداد مقابل.manifest(بيانات وصفية بيان) فقط يتضمن صريح ترتيب حذف بند: منها لا يوجد تدريجي ملف دفع دخول بيان، يوم مدة قسم حد أو README مخصص استخدام سياسة سياسة صنف آخر.(……) إعداد مقابل هو واحد بند حمل متابعة معنى خدمة: لاحق تعديل مهمة واحد جانب وقت، كل يجب في نفس تغيير في تزامن تحديث مقابل جانب ملف و متسق صفة سجل.

## من مثال مثال رفع صقل يلزم نقطة

- لغة جسم هو مواصفة صنع درجة نص: كامل رئيسي يسمى، تحديد لغة هواء؛ لا فتحة لغة تحويل، أيضا لا تعلم فن تجويف.
- إعطاء جملة فرعي تكملة صريح تنفيذ رئيسي جسم: إنجليزي نص يتم حركة جملة و سحب كائن رئيسي لغة، العربية كتابة صار «نظام/بوابة/أداة/مراجعة شخص» فعل رئيسي لغة.
- استخدام العربية عمل مسار معتاد استخدام لغة استبدال مباشر ترجمة:false positive/negative→خطأ تقرير/تسرب فحص،ratchet→فقط نحو قبل استلام ضيق لا قلب تراجع وضع عرض،reviewable act→مراجعة سند إثبات.
- خفي تشبيه محلي تحويل بينما غير نقل غرس:bilingual from birth→من إنشاء بدء حينئذ اشتراط مزدوج لغة متساو تجهيز؛grandfathered→تاريخ تخزين كمية متروك إبقاء.
- صنف آخر اسم كلمة قول العربية و في أول الآن تضمين ملاحظة إنجليزي نص: فعلي تشغيل يد سجل (cookbook) ، أمر لذا تكرار قرص (postmortem) ؛ إشارة دليل أو مسار وقت إبقاء شفرة جسم إنجليزي نص.
- طويل مقطع حسب دلالة وحدة تفكيك مقطع، واحد مقطع واحد عنصر أمر؛ اسم كلمة قصير لغة توسيع لـ حركة كلمة جملة.
- أم لغة إعادة كتابة لا انتظار في حذف نقص: أصل نص كل دلالة صار قسم كل يلزم سقوط أرض.
- مثال مثال و [terminology.md](terminology.md) اندفاع مفاجئ وقت، بـ فن لغة جدول لـ دقيق: استلام تسجيل مثال مثال قبل حسب جدول إصلاح صحيح فن لغة (مثال مثل agent،mock،LLM إبقاء إنجليزي نص،cancellation ترجمة «إلغاء»).
- شفرة جسم معرف رمز (حدث اسم `agent/status`، حالة قيمة `running`، حزمة اسم `dsh-bash-local` انتظار) في ترجمة نص في إبقاء code span أصل نص، لا نيل فتحة لغة تحويل تعديل كتابة؛Pass 2 يجب تدريجي جملة نواة تحقق.

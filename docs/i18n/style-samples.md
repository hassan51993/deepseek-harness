# عينات الأسلوب (style samples)

هذا الملف مرساة معايرة الأسلوب: كل عينة نصٌّ إنجليزي أصلي يقابله نص عربي راجعه شخص واعتمده، وتغطي العينات أنواع النصوص الرئيسية في توثيق هذا المستودع. **عايِر أسلوب الترجمة على هذه العينات**، فالعينة أعلى حجية من أي وصف مجرد للنبرة، غير أن جدول المصطلحات وقواعد الأمانة والبنية تبقى مقدَّمة عليها. وعند الترجمة أو المراجعة، قِس على أقرب عينة إلى نصك. وهذا الملف ثنائي اللغة بحكم بنائه، فلا يشارك في الاقتران (انظر قائمة الاستثناءات في [README.md](README.md)).

طريقة الصيانة: تُلحَق العينة الجديدة بقسمها المناسب بعد أن يراجعها شخص ويعتمدها؛ وأي خطأ في المعنى أو البنية أو المصطلح يُصحَّح فور اكتشافه. وكل إضافة أو تصحيح يمر بمراجعة PR.

## ① وصف معماري

> This document describes the architecture of the DeepSeek Harness — the foundation of **DeepSeek Code**. The governing principle, from the microkernel design discussion: **everything is a plugin**. The core is deliberately tiny — a handful of abstract services plus one concrete loop plugin (`dsh-agent-loop`) — and every product feature is a plugin against the extension API described here, without modifying the loop.

تصف هذه الوثيقة معمارية DeepSeek Harness، وهي الأساس الذي يقوم عليه **DeepSeek Code**. والمبدأ الحاكم، كما استقر في نقاش تصميم النواة المصغّرة: **كل شيء إضافة**. النواة صغيرة عن قصد، فلا تضم سوى حفنة خدمات مجرّدة وإضافةَ حلقة واحدة ملموسة (`dsh-agent-loop`)، وكل ميزة في المنتج إضافة مبنية على واجهة التوسعة الموصوفة هنا، دون تعديل الحلقة.

> Dependency rule: extension plugins depend on interfaces, never on `dsh-agent-loop` (the loop is swappable); composition bundles such as `dsh-base` and `dsh-sdk-minimal` may assemble the concrete loop.

قاعدة الاعتماد: تعتمد إضافات التوسعة على الواجهات، ولا تعتمد أبدًا على `dsh-agent-loop` (فالحلقة قابلة للاستبدال)؛ أما حزم التركيب مثل `dsh-base` و`dsh-sdk-minimal` فيجوز لها أن تجمّع الحلقة الملموسة.

> This document covers **behavior**; type definitions live in [subsystems/](../subsystems/core.md), the per-event/service reference lives in the generated regions of [subsystems/](../subsystems/core.md), and package contracts in the package READMEs state each package's required configuration and behavior ([map](../../packages/README.md)).

تغطي هذه الوثيقة **السلوك**؛ أما تعريفات الأنواع فتسكن في [subsystems/](../subsystems/core.ar.md)، ومرجعُ كل حدث وخدمة يسكن في المناطق المولَّدة من [subsystems/](../subsystems/core.ar.md)، وتذكر عقود الحزم في ملفات README الخاصة بها ما تشترطه كل حزمة من إعداد وسلوك ([خريطة](../../packages/README.ar.md)).

## ② أنماط دفاعية

> Hard-won bug-class rules: each pattern below is a class of defect that actually shipped or nearly shipped here, stated as the rule that prevents its recurrence. Read this before writing lifecycle, concurrency, subprocess, or teardown code.

هذه قواعد أصناف أخطاء دُفع ثمنها: كل نمط أدناه صنف خلل وقع هنا فعلًا أو كاد، مصوغًا قاعدةً تمنع تكراره. اقرأ هذا قبل كتابة شفرة دورة حياة أو تزامن أو عملية فرعية أو تفكيك.

> **Dispose must reach quiescence, not just request it** — A teardown that issues kills/aborts but returns before the work stops leaves orphans. Make cleanup async and await the children's exit (kill → await `done`), and close listener/notification registries BEFORE killing so late completions stay silent. Tests prove disposal waited (pid gone right after `await fiber.dispose()`), not merely that the process eventually dies.

**على dispose أن يبلغ السكون لا أن يطلبه فقط**: التفكيك الذي يرسل أوامر القتل أو الإجهاض ثم يعود قبل توقف العمل يخلّف عمليات يتيمة. اجعل التنظيف لاتزامنيًا وانتظر خروج الأبناء (اقتل ثم انتظر `done`)، وأغلق سجلات المستمعين والإشعارات قبل القتل حتى تبقى الإتمامات المتأخرة صامتة. وتثبت الاختبارات أن التفكيك انتظر فعلًا، أي أن PID اختفى مباشرةً بعد `await fiber.dispose()`، لا أن العملية تموت في نهاية المطاف.

> **Async state is not synchronous state** — `agent.followup()` does not flip status before returning; a background job's completion races turn boundaries; `reader.close()` fires for both EOF and disposal. Never gate control flow on a status you only just requested — drive lifecycle off the events/promises that actually fire (`agent/status`, `task.done`), and observe the transition (saw `running` THEN `idle`) instead of treating status as a per-follow-up result: several queued follow-ups run as consecutive turns under one `running` interval, while cancellation or disposal can discard unstarted items.

**الحالة اللاتزامنية ليست حالة تزامنية**: لا يقلب `agent.followup()` الحالة قبل أن يعود؛ وإتمام مهمة خلفية يتسابق مع حدود الجولات؛ و`reader.close()` يُطلَق عند نهاية الملف وعند تحرير الموارد معًا. لا تعلّق مسار التحكم أبدًا على حالة طلبتَها للتو، بل قُد دورة الحياة من الأحداث والوعود التي تُطلَق فعلًا (`agent/status` و`task.done`)، وراقب الانتقال نفسه (رأيتَ `running` ثم `idle`) بدل معاملة الحالة نتيجةً لكل متابعة: فعدة متابعات في الطابور تعمل جولاتٍ متتالية داخل فترة `running` واحدة، بينما يستطيع الإلغاء أو تحرير الموارد إسقاط البنود التي لم تبدأ.

## ③ بيان سياسة الاختبار

> **Coverage gate** (`pnpm run test:coverage`): the gating run, per-file 100% on `packages/*/*/src`. An uncovered line is often dead code the gate is correctly flagging for deletion, not a missing test to bolt on. Line coverage is necessary, never sufficient — it proves lines ran, not that the feature works as shipped.

**بوابة التغطية** (`pnpm run test:coverage`): هي التشغيل الحاكم، وتشترط تغطية 100% لكل ملف على حدة تحت `packages/*/*/src`. والسطر غير المغطّى غالبًا شفرة ميتة تشير إليها البوابة بحق للحذف، لا اختبارًا ناقصًا يُركَّب عليها. وتغطية السطور شرط لازم لا يكفي أبدًا: فهي تثبت أن السطور نُفِّذت، لا أن الميزة تعمل كما شُحنت.

> We are DeepSeek — do not ration real-API tests. A no-key test proves the plumbing; only a with-key run proves the agent works against a real model. Write many: real prompts that write files, multi-turn conversations, tool use, cancellation mid-stream. Cheapest and highest-value are **smoke tests** that boot the real example, send one real prompt, and check the world — they catch the "green unit tests, broken product" class that mocks structurally cannot. The self-skip exists only so secretless CI and keyless contributors aren't blocked; it is not a cost signal.

نحن DeepSeek: لا تقتّر في اختبارات الواجهة الحقيقية. الاختبار بلا مفتاح يثبت أن التوصيلات قائمة؛ ولا يثبت أن agent يعمل مع نموذج حقيقي إلا تشغيلٌ بمفتاح. اكتب منها الكثير: توجيهات حقيقية تكتب ملفات، ومحادثات متعددة الجولات، واستخدام أدوات، وإلغاء في منتصف التدفق.

وأرخصها وأعلاها قيمة **اختبارات التحقّق السريع**: تُقلع المثال الحقيقي، وترسل توجيهًا حقيقيًا واحدًا، ثم تفحص العالم. هذه تلتقط صنف «اختبارات وحدة خضراء ومنتج معطوب» الذي تعجز المحاكيات بنيويًا عن التقاطه.

والتخطي الذاتي موجود لسبب واحد: ألّا تتعطل بيئة CI الخالية من الأسرار ولا المساهمون بلا مفاتيح. وهو ليس إشارة تكلفة.

> **Prefer the real implementation over a mock** — Mock only genuinely expensive or non-deterministic dependencies (the LLM adapter, the network, the clock); keep everything downstream real. A hand-rolled stand-in proves the bridge moves bytes, not that the shipping tool behaves as asserted — the two drift while the test stays green.

**فضّل التنفيذ الحقيقي على mock**: حاكِ ما هو باهظ حقًا أو غير حتمي وحده (مهايئ LLM، والشبكة، والساعة)، وأبقِ كل ما دونه حقيقيًا. والبديل المكتوب يدويًا يثبت أن الجسر ينقل بايتات، لا أن الأداة المشحونة تتصرف كما يؤكّد الاختبار؛ فتنحرف الاثنتان بينما يبقى الاختبار أخضر.

## ④ وصف آلية

> Blob hashes, not commit hashes, so the record is computable for files edited in the same PR (`git hash-object foo.md`) and consistency is a pure content comparison. The recorded hash also recovers the exact last-confirmed text of either side (`git cat-file -p <hash>`), so an out-of-sync pair is updated by diffing the edited side against its last-confirmed state and patching the counterpart minimally — never by re-translating whole files.

القيمة المحفوظة هي blob hash لا commit hash، فيبقى السجل قابلًا للحساب لملفات عُدّلت داخل الـ PR نفسه (`git hash-object foo.md`) ويبقى الاتساق مقارنة محتوى خالصة. وتسترجع القيمة المسجَّلة أيضًا النصَّ المؤكَّد أخيرًا لأي من الجانبين بالضبط (`git cat-file -p <hash>`)، فيُحدَّث الاقتران الخارج عن التزامن بمقارنة الجانب المعدَّل بحالته المؤكَّدة أخيرًا ثم ترقيع الجانب المقابل ترقيعًا أدنى، لا بإعادة ترجمة الملفات كاملة.

## ⑤ بيان سياسة

> The gate's limit, stated plainly: a green gate means the pair was confirmed consistent at these exact contents, not that the confirmation was sound. It checks hashes and Markdown structure; it cannot judge whether the two sides actually say the same thing — that is the reviewer's half of the contract. A re-recorded pair with a sloppy counterpart passes the gate; it must not pass review.

وحدُّ البوابة بصراحة: البوابة الخضراء تعني أن الاقتران أُكِّد متسقًا عند هذا المحتوى بالذات، لا أن التأكيد كان سليمًا. فهي تفحص القيم المعمّاة وبنية Markdown؛ ولا تستطيع الحكم على ما إذا كان الجانبان يقولان الشيء نفسه حقًّا. ذلك هو نصف العقد الذي يملكه المراجع. فاقتران أُعيد تسجيله بجانب مقابل مهمل يعبر البوابة؛ ويجب ألا يعبر المراجعة.

## ⑥ تبرير في Agent Note

> Comparing git timestamps of the pair (no record) — rejected: formatting-only edits would false-positive, and a counterpart committed after an unrelated edit would false-negative; content identity is the only signal that means what the gate claims.

مقارنة ختوم الوقت في git بين جانبَي الاقتران (بلا سجل)، وهي مرفوضة: تعديلات التنسيق وحدها تعطي إنذارًا كاذبًا، وجانبٌ مقابل أُودع بعد تعديل غير ذي صلة يعطي سلبية فائتة؛ وهوية المحتوى هي الإشارة الوحيدة التي تعني ما تدّعيه البوابة.

## ⑦ اشتراط شامل (فقرة طويلة مقسومة)

> **Universal requirement**: every in-scope document merges as a complete bilingual pair. The manifest contains only explicit exclusions: it has no per-file rollout list, date cutoff, or README-specific policy class. […] Pairing is a continuing obligation: every later edit to either side updates the counterpart and consistency record in the same change.

**اشتراط شامل**: كل وثيقة داخل النطاق تُدمج اقترانًا ثنائي اللغة كاملًا. ولا يتضمن manifest سوى الاستثناءات الصريحة: فلا قائمة طرح تدريجي لكل ملف، ولا تاريخ فاصل، ولا صنف سياسة خاص بملفات README. (…) والاقتران التزام مستمر: فكل تعديل لاحق على أي من الجانبين يحدّث الجانب المقابل وسجل الاتساق في التغيير نفسه.

## ما تستخلصه هذه العينات

- الأسلوب نثر مواصفات: الفاعل مذكور، والنبرة محسومة؛ لا انتقال إلى العامية، ولا حشو تعليمي.
- أعطِ الجمل فاعلًا صريحًا: حيث يستعمل الإنجليزي المبني للمجهول أو فاعلًا مجرّدًا، تكتب العربية «النظام» أو «البوابة» أو «الأداة» أو «المراجع» فاعلًا.
- استعمل اصطلاح العربية الهندسي المستقر بدل الترجمة الحرفية: false positive/negative تصير إنذارًا كاذبًا وسلبيةً فائتة، وratchet تصير تضييقًا لا رجعة فيه، وreviewable act تصير فعلًا قابلًا للمراجعة.
- وطِّن الاستعارة بدل زرعها: bilingual from birth تصير «ثنائي اللغة منذ نشأته»، وgrandfathered تصير «مستثنى بحكم السابقة».
- أسماء الأصناف تُكتب بالعربية مع تعليق إنجليزي عند أول ظهور: دليل عملي (cookbook)، تحليل ما بعد الحادث (postmortem)؛ أما الإحالة إلى دليل أو مسار فتبقى بالإنجليزية داخل code span.
- اقسم الفقرة الطويلة بوحدة المعنى، فقرة لكل فكرة؛ وافتح سلسلة الأسماء المركّبة إلى جملة فعلية.
- إعادة الكتابة بلغة أهلها ليست حذفًا: كل معنى في الأصل يجب أن يصل.
- عند تعارض عينة مع [terminology.md](terminology.md)، الحكم لجدول المصطلحات: صحّح مصطلح العينة وفق الجدول قبل اعتمادها (مثلًا يبقى agent وmock وLLM بالإنجليزية، وتُترجم cancellation إلى «إلغاء»).
- معرّفات الشفرة (اسم الحدث `agent/status`، وقيمة الحالة `running`، واسم الحزمة `dsh-bash-local` وأمثالها) تبقى في الترجمة داخل code span بنصها الأصلي، فلا تُترجم ولا يُعاد تنسيقها؛ وعلى المرور الثاني أن يتحقق من ذلك جملةً جملة.

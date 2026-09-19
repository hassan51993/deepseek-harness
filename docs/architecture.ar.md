# DeepSeek Harness هيكل بنية

[English](architecture.md) | العربية

تعديل `packages/` تحت أي محتوى قبل، طلب أولا قراءة قراءة هذا نص. هذا نص زائف تحديد أنت قد حل Cordis؛ إذا بعد لم حل، طلب أولا قراءة قراءة[دخول باب](cordis-primer.ar.md) أو[تعليم مسار](cordis-tutorial/index.ar.md).

بناء اقتراح استخدام agent(ذكي جسم) استكشاف شفرة مكتبة و إدارة حل ذلك هيكل بنية.

## Cordis

[Cordis](cordis-primer.ar.md) هو dsh قاع طبقة إطار هيكل: إضافة نحو مشترك سياق مساهمة خدمة، نوع تحويل حدث و يمكن عكس فرعي أثر. منتج كل واحد جزء كل هو إضافة، يشمل نموذج مهايئ، أداة سجل التسجيل، جلسة سجل، و agent loop(ذكي جسم حلقة) ذاته، لذلك كل كل يمكن من إعداد استبدال.

لا وجود حاجة ضرب رقعة خاص حق داخل نواة: توسيع dsh طريقة هو يأخذ إضافة تركيب إلى أخرى إضافة جانب حافة، بينما كل بند تسجيل كل هو فرعي أثر، سوف في ذلك إضافة إزالة وقت سحب إلغاء.

## Profile و تركيب حزمة

تشغيل في `dsh` هو واحد شجرة إضافة شجرة، من بدء وقت حسب ترتيب تراكم إضافة كل طبقة تركيب بينما صار.

**profile** هو تخزين وضع في Harness home في أداة اسم تجميع. هو صف خروج ذاتي ذات تراكم وضع تركيب حزمة، تخزين وضع ذاتي ذات تثبيت شجرة خارج إضافة، و حفظ مستخدم ذاتي ذات `cordis.patch.yml`.`web`،`headless`،`sdk`،`sdk-minimal` و `acp` بصفة نموذج لوح مع إرسال سطر إصدار تسليم.

**تركيب حزمة**هو Cordis بند إعداد و ذلك تركيب شفرة توزيع صيغة، لذلك هو إدراج دخول محتوى بداية نهاية يمكن يتم ذلك فوق كل طبقة patch.

اثنان من كل في كل منها `package.json` في عبر `dsh` حقل إعلان ذاتي ذات:`dsh.profile` صف خروج واحد profile تركيب حزمة،`dsh.bundle` إشارة نحو واحد تركيب حزمة patch ملف.

[`dsh-base`](../packages/bundle/base/README.ar.md) هو `web`،`headless`،`sdk` و `acp` profile مشترك رقم واحد طبقة: نموذج مهايئ، أداة، حفظ دائم، صندوق رملي و مراجعة دفعة سياسة، ضبط، اعتماد، بعيد قياس.[`dsh-web-app`](../packages/bundle/web-app/README.ar.md) زيادة متصفح تطبيق،[`dsh-headless`](../packages/bundle/headless/README.ar.md) زيادة لا حمل خادم مرة صفة تشغيل جهاز،[`dsh-sdk-app`](../packages/bundle/sdk-app/README.ar.md) زيادة SDK JSON-RPC خادم،[`dsh-acp-app`](../packages/bundle/acp-app/README.ar.md) زيادة فقط لأجل تلقائي تحويل ACP خادم.[`dsh-sdk-minimal`](../packages/bundle/sdk-minimal/README.ar.md) هو لحظة معنى إبقاء مثال خارج: واحد تركيب حزمة يملك كامل صريح SDK إعداد شجرة، لا تطبيق `dsh-base`.

كل طبقة حسب هذا ترتيب تطبيق في فارغ بند قائمة لـ فوق: أولا حسب profile صف خروج ترتيب تطبيق كل تركيب حزمة، لكن بعد هو profile `cordis.patch.yml`، لكن بعد هو home درجة ذلك نسخة، الأكثر بعد هو مهمة معنى `--patch` overlay. واحد بند patch حسب id تحديد موضع بعض عدد بند و استبدال ذلك كامل config، أو إدراج دخول جديد بند.

YAML تحكم HMR:base تفعيل فقط مراقبة نظر إعداد `dsh-hmr`؛Headless،SDK و ACP منع استخدام هو؛`sdk-minimal` لا يتضمن هو.Profile patch تغطية هذه قيمة افتراضية.HMR تنسيق ضبط استماع و إعادة تحميل؛ بدء جهاز توفير profile بيانات و حينئذ خيط إشارة.

base توفير لأجل Web و Agent [إضافة إدارة جهاز](../packages/boot/plugin-manager/README.ar.md).

يلزم عرض أنت آلة جهاز بدء إعداد شجرة:

```sh
dsh --profile web --dump-config
```

هو ضرب طبع خروج أي بند، كل يمكن من أنت ذاتي ذات patch استبدال.

تجميع آلية رؤية [app-boot](../packages/boot/app-boot/README.ar.md#profiles) ؛ إعداد حقل رؤية توليد[إعداد دليل](config-catalog.ar.md).

## تطبيق بدء

تلقي دعم حمل Node تطبيق عبر أداة اسم `dsh` profile بدء. مع مرفق profile لـ `web`،`headless`،`sdk`،`sdk-minimal` و `acp`، يمكن عبر `dsh --profile <name>` أو `dsh <name>` اختيار.`plugin` يمثل إدارة أمر؛ نفس اسم profile يجب استخدام `--profile plugin` اختيار.TypeScript SDK سوف تحليل ذلك نفس إصدار `dsh` اعتماد و اختيار `sdk`؛ ذاتي تعريف إضافة تركيب متابعة من profile و لديه ترتيب patch ملف جدول بلوغ، بينما لا هو آخر عدد يمكن تنفيذ ملف أو داخل ربط تطبيق شجرة.`sdk-minimal` هو يقع في نفس launcher بعد مستودع ذاتي لديه مستقل تركيب حزمة، بينما لا هو من استدعاء جهة توفير Cordis إعداد شجرة.

Vendored CLI، فقط لأجل بناء و اختبار يمكن تنفيذ ملف، عملية داخل مباشر تركيب إضافة و خاص متصفح WebWorker معاينة كل لا يخص Harness تطبيق بدء جهاز.[`verify-application-entrypoints`](../scripts/verify-application-entrypoints.ts) سوف كل حزمة bin، يمكن تنفيذ شفرة المصدر و أصل demo عودة دخول صريح صنف آخر، و رفض أي التفاف مرور `dsh` Node تطبيق مسار.

Python SDK التزام دوران نفسه تطبيق هيكل بنية. ذلك وقت التشغيل wheel يأخذ عادي `dsh` CLI تحزيم لـ `deepseek-harness-sdk-runtime-<platform>-<arch>`، عميل افتراضي بـ صريح Harness home بدء `dsh --profile sdk`. أقصى بسيط عرض مثال اختيار مع مرفق `sdk-minimal` profile.Python كشف profile اختيار و لديه ترتيب patch ملف، بينما لا هو كامل Cordis شجرة؛ حمل دائم خارجي إضافة عبر `dsh plugin` تثبيت. قد حذف خاص مباشر قراءة إعداد تحميل جسم لا يوجد توافق bin أو رجوع parser.

## طاولة وجه تطبيق

[Electron طاولة وجه تطبيق](../apps/desktop/README.ar.md) في توقيع مورد في يحمل دقيق مطابقة dsh إنتاج وقت التشغيل، و يملك إبقاء `$DSH_HOME/profiles/desktop`. مشترك profile helper ابتدائي تحويل ذلك ملف، تنسيق ضبط قد تثبيت bundle، و تحليل تثبيت و bundle اعتماد بينما لا استبدال pnpm يملك حزمة.CLI و Desktop مشترك منتج بيانات، يمكن تنفيذ حزمة، تفعيل اختيار و قفل ملف إبقاء مستقل. عام CLI لا يستطيع إدارة Desktop profile.

Electron استخدام Electron Node نمط بدء خاص Desktop Host.Host استدعاء مشترك CLI profile runner و كامل Web تطبيق. نافذة قيام أي تحميل تحزيم Web مورد، انتظار بدء حقن بعد في نفس وثيقة في تنشيط عميل إضافة.Web مسؤول RPC و تدفق؛ طاولة وجه تحميل جسم سوف محلي صفحة اتصال إلى قد إقرار إثبات Host.Node IPC تحمل تحميل بدء حقن، حينئذ خيط، يؤدي أمر خطأ و إغلاق.Desktop افتراضي طرف فتحة لـ `19387`،profile إعداد يمكن تغطية. قشرة يملك UI عبر داخل وضع pnpm تنفيذ إضافة أمر خدمة، و التزام دوران صحيح معتاد مستخدم و profile إعداد.

## نواة قلب حزمة

التالي هو نحو Cordis شجرة مساهمة محتوى جزء نواة قلب حزمة.

| حزمة | مسؤولية | `ctx` مفتاح |
|---|---|---|
| [`core/session`](subsystems/session.ar.md) | فقط إلحاق `SessionEvent` سجل و داخل تخزين تخزين | `ctx.sessions` |
| [`core/system-prompt`](subsystems/system-prompt.ar.md) | نص التوجيه قطعة مقطع و أداة schema تجميع | `ctx.systemPrompt` |
| [`core/tools`](subsystems/tools.ar.md) | أثر مجال تحويل أداة سجل التسجيل و حمل يأخذ صلة تنفيذ خط الإنتاج | `ctx.tools` |
| [`core/agent`](subsystems/core.ar.md) | `Agent` واجهة، نشط وثب agent سجل التسجيل و `agent/*` حدث | `ctx.agents` |
| [`core/agent-loop`](subsystems/core.ar.md) | تنفيذ هذا واجهة افتراضي مشغل | `ctx.agentLoop` |
| [`core/scope`](subsystems/scope.ar.md) | حسب agent تخطيط قسم أثر مجال تسجيل أصل لغة | مكتبة، بلا ctx مفتاح |
| [`llm/llm`](subsystems/llm-streaming.ar.md) | رسالة و تدفق صيغة مفردات جدول، و مهايئ seam | `ctx.llm` |
| [`webhook/webhook`](subsystems/webhook.ar.md) | قد إقرار إثبات delivery قسم إرسال و Workspace Session إنشاء | `ctx.webhookRuntime` |

<a id="events"></a>

## حدث

حدث حينئذ هو نقطة توسيع، بينما اختيار مقابل حدث مجال هو كبير كثير عدد تعديل رقم واحد قرار.

- **جلسة حدث**هو إلحاق إلى سجل و عبر `session/event` واسع بث حمل دائم واقع. عند بعض عدد واقع يجب في إعادة تحميل بعد ما زال وجود وقت، استخدام هو.
- **Agent حدث**(`agent/*`) يحمل نشط وثب `Agent`:inbox، خطوة، حالة، طلب، تحقق، متابعة ركض. يلزم مراقبة أو اعتراض قطع إجراء في عمل وقت، استخدام هو.
- **قدرة حدث**بلا حاجة استيراد حلقة يكفي نحو بعض عدد seam(`fs/*`،`tools/*`،`telemetry/*`) مرفق إضافة سياسة و مهايئ.

AgentLoop في بدء قد ترتيب طابور عمل قبل انتظار سلسلة سطر `agent/created` ابتدائي تحويل. ابتدائي تحويل فشل سوف تراجع إنشاء؛[agent-loop](../packages/core/agent-loop/README.ar.md#understand-the-implementation) تعريف teardown ترتيب.

[حدث خريطة](event-producer-consumer.ar.md) صف خروج كل حدث إنتاج جهة و مستهلك.

<a id="turn-flow"></a>

## جولة مسار

واحد**خطوة**هو مرة نموذج طلب إضافة فوق هو استدعاء أداة. واحد**جولة**يتضمن صفر عدد أو كثير عدد خطوة: هو في قيادة أخذ أول بند إدخال قبل فتح، و في لم يعد نقص تحت أي عمل وقت إغلاق.

```text
turn/start
  claim next-step input plus one queued message
  assemble prompt sections + tool schemas; project runtime context
  -> agent/pre-step                   reject | enter(messages, startsRequestSeries?)
     reject, or a first enter rewritten empty -> close the turn with no step
     step/start
     agent/request -> prepareCall (cancellation commits neither system nor users)
     reconcile system/message using the prepared call capability
     append entered messages as user/message; log request/header and request/context as needed
     derive and freeze model history from the log
     stream the bound prepared call -> llm/stream -> agent/assistant-stream start
       agent/assistant-stream chunk*
       assistant/message | assistant/attempt -> agent/assistant-stream end
     tool/call* -> tools/pre-execute -> tools/execute -> tools/post-execute -> tool/result*
     step/end
     tools owe another request, or next-step input arrived -> claim -> next step
  -> agent/turn-stopping
turn/end
```

`turn/*`،`step/*`،`system/message`،`user/message`،`assistant/message`،`assistant/attempt` و `tool/*` هو حمل دائم جلسة حدث؛ ذلك بقية هو قسم تابع ثلاثة عدد حدث مجال فوري نقطة توسيع.`agent/assistant-stream` إصدار عملية محلي start، لحظة حالة chunk و end frame.loop سوف في committed end frame قبل يأخذ كامل ضيق تجميع stream إيداع لـ واحد message أو فقط سجل attempt؛Web Session-follow adapter هو هذا live event وحيد بعيد مسار مستهلك.`agent/pre-step`،`agent/request`،`llm/stream` و ثلاثة عدد `tools/*` حدث هو waterfall(شلال نشر صيغة حدث) ، ذلك مستمع يجب استدعاء `next()` عندئذ قدرة تفويض حمل تحت ذهاب؛`agent/turn-stopping` هو serial حدث، لا يوجد `next()`.

إدخال عبر نفس عدد inbox وصول مشغل؛ حقن سياق انتظار واحد بند نداء تنبيه رسالة.AgentLoop حمل دائم `inbox` إسقاط جعل انتظار معالجة إدخال في لا يوجد نشط وثب Agent وقت ما زال يمكن قراءة.

`agent/pre-step` قرار وصل قبول إدخال. مستمع يمكن تعديل كتابة أو رفض قد قيادة إلغاء خبر؛ أول مرة قيادة أخذ يتم رفض أو لـ فارغ وقت، إغلاق لا يحتوي خطوة حمل دائم جولة.enter قرار يمكن ضبط `startsRequestSeries`: حلقة سجل جديد `request/header`(سبب لـ `series`، أو في غلاف تركيب معا تغير وقت لـ يحمل `startsSeries: true` `change`). حزمة تركيب مستمع عبر `{ ...decision, messages }` إبقاء هذا إعلان. تجميع و `step/start` بعد،`agent/request` و `prepareCall()` أولا تحليل فعلي توجيه، مجددا إيداع توجيه النظام و قد وصل قبول مستخدم رسالة؛ في مهمة واحد مختلف خطوة مرحلة مقطع إلغاء كل لن إيداع هذا اثنان من. نص التوجيه دقيق دخول اعتماد حسب قد دقيق تجهيز استدعاء قدرة، بينما غير أولا قبل `request/context`. كل مرة محاولة تجربة تزامن تنسيق ضبط نفس نسخة قد تصيير تجميع نتيجة، فقط في أول مرة محاولة تجربة إلحاق مستخدم رسالة، حسب يحتاج سجل header/context، إرسال توليد و تجميد ربط طلب، مجددا عبر ربط استدعاء إرسال بدء تدفق صيغة طلب. إعادة محاولة لا تكرار تجميع أو `agent/pre-step`. مرفق وصل بعد surface استبدال و صورة حذف قرار فتح بدء جديد طلب تسلسل، يشمل استعادة بعد أول مرة pre-step في حدوث استبدال؛ لم تغير استعادة تأخير متابعة تسلسل. أول مرة وصل قبول خطوة في مستخدم رسالة قبل مسبق إبقاء نظام رأس عقدة، أي جعل نص التوجيه لـ فارغ (لا إنتاج بروتوكول رسالة). نص التوجيه فقط عبر `system/message` تاريخ نقل تمرير: فارغ تصيير نص صاف حذف كل توليد فاعلية نظام عقدة، نموذج لم يعد يرى قديم نص التوجيه؛ أداة تجهيز قدرة توجيه يمكن في ذاكرة مؤقتة بادئة بعد إلحاق غير فارغ تحديث؛ لا أداة تجهيز قدرة توجيه و جديد طلب تسلسل سوف غير فارغ نص التوجيه نص عودة و إلى أول عدد نظام عقدة، و لـ غير فارغ لاحق نظام عقدة سجل فارغ محتوى استبدال ([قرار](../.agents/notes/implemented/architecture/2026-09-02-system-prompt-as-surface-node.ar.md) ؛[قرار قاعدة](../packages/core/agent-loop/README.ar.md#understand-the-implementation)).

حلقة إرسال غير ممكن تغيير طلب، معا إبقاء فوري إلغاء قدرة. فقط لديه قد من هذا حلقة كامل تجميد ربط رسالة كائن هوية عندئذ قدرة إعادة استخدام تجميد ربط إثبات؛[agent-loop](../packages/core/agent-loop/README.ar.md) يملك طلب بنية صنع قاعدة.

تفصيل حال رؤية[وقت ترتيب رسم](agent-lifecycle.ar.md) ،[أداة خط الإنتاج](tool-execution-pipeline.ar.md) و[إلغاء و خطأ استعادة](subsystems/core.ar.md#the-agent-handle).

## جلسة سجل

جلسة سجل هو نموذج الذي رؤية سياق مصدر.`deriveMessages()` من في إسقاط خروج نموذج تاريخ. كل `assistant/message` كل تضمين دخول إنتاج ذلك تجميع محتوى دقيق ضيق تجميع حمل وقت stream؛`assistant/attempt` إبقاء قد وصول settlement فشل، إعادة محاولة، إلغاء و stream error attempt، كما لا إضافة نموذج تاريخ.fork، استعادة،transcript(نص سجل) ، بعيد قياس و حفظ دائم كل من هذه حمل دائم settlement إرسال توليد، فوري UI زيادة كمية فإن قدوم ذاتي `agent/assistant-stream`؛ إذا عملية في settlement قبل صلب في قطع، فإن لن إبقاء تحت حمل دائم attempt stream(رؤية[قرار](../.agents/notes/implemented/architecture/2026-09-01-v2-embedded-assistant-streams.ar.md)).

Session مستهلك فقط حل حالي منطق صيغة. فقط header `stat` و `list` سوف إعادة مسح كل Session دليل، اختيار عدد قيمة الأكثر عال مواصفة generation، و في لا تحميل حدث أو إصدار بعد استمرار حال حال تحت تحويل تلقي دعم حمل تاريخ header. قد تخزين Session `open` اختيار نفس generation، رفض لم قدوم إصدار، أو فقط Decode و تركيب مرة بناء وقت ساكن حالة تحديد متبادل مجاور ترحيل سلسلة، مجددا إرجاع مرور مرور تحقق حالي منطق حدث. فقط قراءة open مباشر استخدام هذا نسخة داخل تخزين نتيجة، لا إصدار بعد استمرار؛ كتابة open فإن أولا تحرير رمز، تحقق و في لم تغيير مصدر جانب حافة ترتيب هو إصدار نهائي إصدار تسمية بعد استمرار. لم يتم لاحق حدث غلاف إقامة عادي في قطع ذيل جزء ما زال من جملة مقبض مستهلك إصلاح؛ فقط لديه في لاحق `turn/start` قد غلاف إقامة واحد نوع لديه حد قد إصدار restart وقت،migration عندئذ سوف إدراج دخول ناقص interrupted `turn/end`.JSONL v0 استخدام `session.jsonl[.zstd]`،v1 و لاحق إصدار استخدام صغير كتابة `session.vN.jsonl[.zstd]`؛ قد إيداع generation مسار أبدا إعادة تسمية، استبدال أو حذف.JSONL provider مسؤول شيء إدارة framing، ضغط،generation اختيار و ترتيب هو إصدار، كل متبادل مجاور ترحيل حزمة فقط مسؤول واحد `vN -> vN+1` خطوة ([قرار](../.agents/notes/implemented/architecture/2026-08-31-released-session-format-migrations.ar.md)).

**نموذج مرئي أي قد سجل.** مقاومة بلوغ نموذج طلب واحد قطع كل يجب قدرة من سجل إعادة بناء، و من واحد بند وقت التشغيل ثابت كمية تأكيد هذا واحد نقطة. إضافة جديدة نموذج مرئي إدخال حاجة واحد جلسة حدث. تعديل قائم رسالة محتوى إضافة تسجيل[صاف رسالة إسقاط](subsystems/session.ar.md#plugin-owned-message-projections) ، مستقل قراءة جهاز صريح نقل دخول نفسه معالج.

**إسقاط seam.** `dsh-session-projection` توفير `ctx.sessionProjections`: قد تسجيل وحدة زيادة كمية طي قد إيداع حدث،host مستهلك عبر `stateOf()` قراءة مفرد عدد نوع تحويل حالة، تحميل جسم عبر `snapshot()` دفعة كمية أخذ نيل قطع قص بعد عميل عرض.host قراءة جهة يلزم ما في تنشيط وقت اشتراط هذا خدمة، يلزم ما في سجل التسجيل أو مطلوب key نقص مقعد وقت واضح فشل. مساهمة جهة يمكن إبقاء `ctx.inject(['sessionProjections'], ...)` تسجيل، لكن لا يستطيع لـ ناقص host قيمة ساكن صامت توفير قيمة افتراضية.agent loop لـ قراءة جهة تسجيل مشترك `turnBoundary` حالة ([قرار](../.agents/notes/implemented/architecture/2026-08-19-session-projection-mandatory-seam.ar.md)).

## قدرة seam

واحد **seam** هو واحد بند يمكن استبدال قدرة، يتضمن ثلاثة نوع زاوية لون: إعلان واجهة **Service Definition**، تنفيذ هو **Service Provider**، و استخدام هو **Consumer**(عبر معتاد هو موجه إلى نموذج أداة). واحد حزمة يمكن دمج تحمل تحمل كثير عدد زاوية لون، لكن مفرد واحد زاوية لون ذاته لا هو seam؛ إضافة واحد بند قدرة معنى طعم حال يأخذ ثلاثة من واحد و تصميم ([قدرة رسم](capability-seams.ar.md)).

seam صحيح هو استبدال واحد مزود حينئذ قدرة تغيير كامل منتج سبب. نظام الملفات و عملية مزود مشترك نفس عدد تنفيذ عالم حد، لذلك يأخذ هو جمع إشارة نحو بعيد مسار صندوق رملي، أيضا حينئذ يأخذ Bash،PTY و LSP واحد و نقل مرور ذهاب، بلا حاجة مزود مخصص استخدام fork.[subagent مزود](subsystems/subagent.ar.md) في نفس عدد واجهة بعد نفس مثال ألف فرق ألف آخر، من جديد بناء واحد فرعي agent، إلى يأخذ واحد جولة تفويض إرسال إعطاء آخر عدد منتج.

[فعلي تحقق صفة Agent Teams](subsystems/agent-team.ar.md) هو `ctx.agentTeams` فوق عام إصدار، صريح تفعيل تنسيق عمل seam، في يمكن متابعة subagent لـ فوق توفير حمل دائم roster، مهمة لوح و mailbox.

## جديد سلوك ملكية موضع

جديد سلوك مرفق إضافة إلى قد لديه وثيقة سجل نقطة توسيع. تعديل حلقة ذاته وقت، هذا خريطة مع لـ تحديث.

| هدف | آلية |
|---|---|
| إضافة نموذج مزود | في `ctx.llm` فوق تسجيل ذلك مهايئ |
| إضافة موجه إلى نموذج قدرة | في `ctx.tools` فوق تسجيل؛ ذلك schema إضافة دخول نص التوجيه تجميع |
| يجعل بعض عدد جلسة يملك مختلف قدرة تجميع دمج | تجميع واحد agent preset؛ منها خدمة سطر حاجة `isolate` realm |
| إضافة shell تنفيذ | تسجيل `ctx.shell` خلفية؛ محلي خلفية عبر `ctx.subprocess` spawn عملية |
| إضافة حفظ دائم طرفية تنفيذ | تسجيل `ctx.terminals` خلفية و `dsh-tool-terminal` |
| إضافة مستخدم أمر | في `ctx.commands` فوق تسجيل؛ هو بلا حاجة نموذج جولة يكفي قسم إرسال |
| إضافة خلفية عمل | في `ctx.jobs` فوق تسجيل؛`job_*` أداة مسؤول استلام تجميع أو إيقاف |
| من خارجي webhook بدء Session | في `ctx.webhookRuntime` فوق تسجيل يمكن معلومة قاعدة، و تركيب مزود مهايئ |
| إضافة نظام الملفات وصول أو سياسة | تسجيل `ctx.fs` مزود، أو استماع `fs/*` حدث |
| حد الذي بدء عملية | استخدام `ctx.sandbox` خلفية؛ مستهلك في بدء عملية قبل حزمة تركيب argv |
| اعتراض قطع طلب، أداة أو جولة | استخدام متبادل ينبغي `agent/*` أو `tools/*` حدث؛`agent/turn-stopping` سوف إيقاف جولة |
| إضافة نموذج مرئي سياق | استدعاء `agent.inject()`؛ هو سوف سقوط إلى تحت مرة نيل دقيق طلب في |
| إضافة UI أو تحرير جهاز تجميع صار | قيادة `ctx.agents` و من `session/event` تصيير |
| إضافة Web Client Chat عقدة | تسجيل `ConversationNodeDefinition` + keyed renderer |
| إضافة حمل دائم جلسة حالة | توسيع `SessionEventMap`؛ من سجل تصيير و إعادة تشغيل |
| توليد جلسة عنوان | تسجيل وحيد `ctx.sessionTitle` مزود |
| إدارة نفس جلسة هدف | استخدام `ctx.goals`؛ عبر `agent/*` متابعة ركض |
| في جولة حد fork جلسة | `ctx.agents.create({ sessionId, seed, meta: { parentSession, seedLength } })`——فقط لديه مرور agent-loop إصدار جلسة عندئذ سوف حفظ دائم |
| في جديد خلفية تخزين جلسة | أساس في مشترك جملة مقبض قدم يد هيكل تنفيذ `SessionPersistence`(`create`/`open`/`stat`/`list`/`export`) |
| سوف تسجيل بند حد تحديد إلى مفرد عدد agent | استخدام هذا agent `agent.ctx` |

[توسيع فعلي تشغيل يد سجل](cookbook/extension-cookbook.ar.md) سوف وظيفة خريطة إلى قدرة، و بحث جذب[حزمة](cookbook/adding-a-package.ar.md) ،[أداة](cookbook/adding-a-tool.ar.md) ،[LLM(كبير لغة نموذج) مهايئ](cookbook/adding-an-llm-adapter.ar.md) و[ضبط بطاقة](cookbook/adding-a-settings-card.ar.md) قسم خطوة إشارة جنوب.[Conversation فرعي نظام](subsystems/conversation.ar.md) مسؤول Chat node تجميع.

<!-- إنجليزي نص مصدر ملف من scripts/gen-tool-catalog.ts توليد؛ هذا العربية ملف هو عبر مزدوج لغة إعداد مقابل صيانة مرور مراجعة مقابل جانب.
     تحديث وقت أولا تشغيل `pnpm run gen-tool-catalog` تحديث إنجليزي نص، مجددا تحديث هذا ملف و تشغيل `pnpm run verify-translation-pairing --write docs/tool-catalog.md` إعادة سجل إعداد مقابل. -->

# أداة Schema دليل

[English](tool-catalog.md) | العربية

قد إصدار إضافة نحو `ctx.tools` توفير كل موجه إلى نموذج أداة: نموذج عبر توجيه النظام تجميع نيل نيل `name`،`description` و JSON Schema `parameters`. هذا دليل هو[فرعي نظام صفحة](subsystems/core.ar.md)(نوع و كل صفحة توليد `cordis-surface` وصل خط منطقة مجال) تكملة ملء؛ هذا صفحة صف خروج هو نحو agent(ذكي جسم) توفير*أداة*.

إنجليزي نص مصدر ملف من نظام**توليد**، و عبر `pnpm run verify-tool-catalog`(`doc-sync`(وثيقة تزامن بوابة) واحد جزء) تحقق جديد طازج درجة؛ هذا العربية ملف بصفة مرور مراجعة مقابل جانب عبر مزدوج لغة إعداد مقابل صيانة. و Cordis دليل (صاف شفرة المصدر AST معالجة) مختلف، إنجليزي نص توليد جهاز سوف في حقيقي سياق في**بدء**كل أداة إضافة و قراءة `ctx.tools.schemas()`، لأن أداة schema لا يمكن عبر ساكن حالة قسم تحليل تماما تحديد، مثال مثل وقت التشغيل توسيع قطعة رفع، تجميع وصل وصف، من إعداد قرار اسم و استخدام أصلي JSON Schema MCP أداة. كامل صفة حراسة حماية سوف glob مطابقة `packages/*/tool-*`؛ إذا توليد جهاز بدء manifest(بيانات وصفية بيان) متروك تسرب أي حزمة، فحص حينئذ سوف فشل، لذلك جديد أداة لن في بلا شخص ملاحظة شعور حال حال تحت نقص قليل وثيقة.

نطاق:`packages/*/tool-*` تحت قد إصدار منتج أداة، كل أداة متساو استخدام ذلك**افتراضي**إعداد بدء؛ لكن إذا بعض عدد Config حقل هو**لا بد ملء بند**كما لا يوجد قيمة افتراضية، توليد جهاز حينئذ يجب عمل خروج اختيار، مقابل حزمة شرح سوف سجل هذا صفحة عرض هو أي عدد فرع. تسجيل أداة**اسم**يمكن هو تحميل وقت إعداد، مثال مثل `tool-subagent` `toolName`، لذلك نشر ممكن بـ مختلف اسم أو مقدار خارج اسم توفير بعض عدد حزمة؛ إذا وجود مع منتج إصدار آخر اسم، مقابل حزمة شرح سوف إعطاء بـ سجل.`examples/` في عرض عرض أداة (مثال مثل `echo`) لا في نطاق داخل، هذا و Cordis دليل فقط شمول غطاء حزمة نطاق متسق.

<a id="tool-package-map"></a>

## أداة حزمة خريطة

تحت جدول سوف نموذج مرئي أداة اسم و ذلك خلف بعد إضافة حزمة و خدمة seam مقابل بدء قدوم. كل حزمة فصل عقدة مع بعد إعطاء خروج تأكيد قطع JSON Schema.

| أداة حزمة | نموذج مرئي اسم | اعتماد | كتابة/أثر | مع منتج إصدار آخر اسم | نشر شرح |
| --- | --- | --- | --- | --- | --- |
| `@deepseek-ai/dsh-plugin-manager` | `plugin_manager` | `ctx.tools`, `ctx.pluginManager`, `ctx.sandboxPolicy` | `tool/call`, `tool/result`, `user/message` | - | - |
| `@deepseek-ai/dsh-mcp-resources` | `list_mcp_resource_templates`, `list_mcp_resources`, `read_mcp_resource` | `ctx.tools`, `ctx.mcpResources` | `tool/call`, `tool/result` | - | - |
| `@deepseek-ai/dsh-experimental-browser-use-stagehand-native` | `stagehand_act`،`stagehand_extract`،`stagehand_navigate`،`stagehand_observe`،`stagehand_screenshot`،`stagehand_tabs` | `ctx.browserUse`،`ctx.agents`،`ctx.tools`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | - |
| `@deepseek-ai/dsh-tool-ask-user` | `ask_user_question` | `ctx.tools`،`ctx.userQuestions` | `tool/call`،`tool/result after a UI/provider answers the question` | - | ask_user_question سوف مؤقت توقف أداة استدعاء، مباشر إلى حالي UI مزود إرجاع شخص صنف جواب سجل. |
| `@deepseek-ai/dsh-tools` | `run_code` | `ctx.tools`،`ctx.ptcRuntime (execution time)`،`ctx.systemPrompt` | `tool/call`،`one tool/ptc-dispatch-start + tool/ptc-dispatch pair per bridged sub-call`،`tool/result` | - | في `mode: ptc`/`mode: both` تحت، هو من أداة سجل التسجيل كل، بصفة يمكن مرور ترشيح قدرة طبقة خارج إبقاء نقل آلية (مشاركة رؤية PTC mode Agent Note). في `ptc` تحت، هو هو سجل التسجيل مقابل بروتوكول صيغة (wire format) وحيد مساهمة؛ أخرى مرئي قدرة في استخدام قد تحميل وقت التشغيل لغة توليد SDK فصل عقدة في إعلان. برنامج عبر binding استدعاء هذه قدرة، استدعاء حسب وفق أصلي تزامن اتفاق ضبط درجة: بدء ترتيب و سياسة التزام دوران إيداع ترتيب، تزامن أمان دالة جسم الأكثر كثير إعادة تراكم تنفيذ `maxParallelSubCalls` عدد. استدعاء سوف إعادة دخول كامل كما تلقي حراسة حماية حفظ حماية أداة خط الإنتاج، و سوف كل تضمين طقم تنفيذ صلة ربط إلى هذا خارج طبقة نتيجة. |
| `@deepseek-ai/dsh-plan-mode` | `exit_plan_mode` | `ctx.tools`،`ctx.systemPrompt`،`ctx.userQuestions (execution time, opportunistic)` | `tool/call`،`plan/mode inactive on an approved review`،`tool/result` | - | قاعدة تخطيط لم تنشيط وقت،exit_plan_mode ما زال إبقاء في موجه إلى نموذج schema في، هذا مثال حالة تحويل لن في قاعدة تخطيط سياسة تغيير خارج مقدار خارج صنع صار أداة دليل تغيير حركة. ذلك تنفيذ مسار سوف رفض قاعدة تخطيط نمط خارج استدعاء؛ في قاعدة تخطيط نمط تحت، هو عبر مستخدم تفاعل seam إيداع حساب تخطيط (دفعة دقيق/أصل حسب عكس تغذية متابعة قاعدة تخطيط) ، دفعة دقيق بعد سوف في خطوة حد سجل قاعدة تخطيط نمط قد توقف استخدام. |
| `@deepseek-ai/dsh-tool-bash` | `bash` | `ctx.tools`،`ctx.shell`،`ctx.systemPrompt`،`ctx.shellEnv`،`ctx.jobs at call time for run_in_background` | `tool/call`،`tool/result` | - | bash أداة هو bash منفذ seam موجه إلى نموذج مستهلك. استخدام `run_in_background` تشغيل سوف تسجيل إلى عام `ctx.jobs` وقت التشغيل، و عبر `job_*` أداة (قدوم ذاتي `@deepseek-ai/dsh-tool-jobs`) استلام تجميع/إيقاف؛ منع استخدام `enableRunInBackground` إعداد (افتراضي لـ true) بعد، هذا معامل سوف يتم تماما إزالة. |
| `@deepseek-ai/dsh-tool-present` | `present` | `ctx.tools`, `ctx.fs`, `ctx.sessionProjections` | `tool/call`, `deliverables/presented في نجاح نهائي نتيجة بعد`, `tool/result` | - | تسليم عودة استدعاء جهة Session كل؛Web ui-deliverables توفير مصدر ملف فتح و بطاقة. |
| `@deepseek-ai/dsh-tool-pwsh` | `pwsh` | `ctx.tools`،`ctx.shell`،`ctx.systemPrompt`،`ctx.shellEnv`،`ctx.jobs at call time for run_in_background` | `tool/call`،`tool/result` | - | pwsh أداة هو Windows تركيب في bash منفذ seam PowerShell جهة قول مستهلك (من `@deepseek-ai/dsh-pwsh-local` انتظار PowerShell منفذ لـ `ctx.shell` توفير خلفية) ؛ حذف صندوق رملي واجهة خارج، هو تدريجي بند مقابل bash أداة استدعاء. استخدام `run_in_background` تشغيل سوف تسجيل إلى عام `ctx.jobs` وقت التشغيل، و عبر `job_*` أداة استلام تجميع/إيقاف؛ حمل إدارة `DSH_*` بيئة قدوم ذاتي `@deepseek-ai/dsh-shell-env`. كل مرة استدعاء كل في جديد عملية في تشغيل، لا استخدام حمل دائم PTY جلسة. مسار اعتماد أصلي `C:\...` شكل صيغة، متغير اعتماد `$env:NAME`. |
| `@deepseek-ai/dsh-tool-cordis` | `cordis_inspect_list`, `cordis_inspect_query` | `ctx.tools`, `ctx.cordisInspect` | `tool/call`, `tool/result` | - | إنشاء صنع نمط توفير اثنان عدد فقط قراءة وقت التشغيل فحص أداة.Cordis host runner توفير فحص سجل التسجيل؛Client استعلام حاجة قد اتصال صفحة. حفظ دائم تغيير تحرير كتابة لـ تركيب حزمة، مجددا عبر plugin_manager تثبيت. |
| `@deepseek-ai/dsh-tool-bash-persistent` | `bash` | `ctx.tools`،`ctx.terminals`،`an owning Agent at execution time` | `tool/call`،`PTY shell state`،`tool/result` | - | واحد حسب كل من عزل حمل دائم bash أداة؛ نشر تركيب توفير PTY خلفية، و يمكن تغطية موجه إلى نموذج بيئة وصف. |
| `@deepseek-ai/dsh-tool-pwsh-persistent` | `pwsh` | `ctx.tools`،`ctx.terminals`،`an owning Agent at execution time` | `tool/call`،`PTY shell state`،`tool/result` | - | واحد حسب كل من عزل حمل دائم pwsh أداة، حمل دائم bash أداة Windows مقابل شيء؛ نشر تركيب توفير pwsh جهة قول PTY خلفية، و يمكن تغطية موجه إلى نموذج بيئة وصف. |
| `@deepseek-ai/dsh-tool-str-replace-editor` | `str_replace_editor` | `ctx.tools`،`ctx.fs` | `tool/call`،`fs/observed after view presence/absence, edit absence, or successful mutation`،`tool/result` | - | أساس في نظام الملفات seam مستقل فحص نظر/إنشاء/وحيد حرف وجه كمية استبدال/حسب سطر إدراج دخول أداة؛ يمكن و أي shell أو طرفية واجهة تركيب. |
| `@deepseek-ai/dsh-tool-fs` | `edit`،`read`،`read_image`،`write` | `ctx.tools`،`ctx.fs`،`ctx.systemPrompt`،`ctx.attachments (image-tool registration)`،`ctx.llm + an image-capable route (image-tool execution)` | `tool/call`،`fs/write-intent or fs/edit-intent for mutations`،`fs/observed after read presence/absence or successful file operation`،`durable attachment (read_image)`،`tool/result` | - | أولا قراءة بعد كتابة/تحرير سياسة من `@deepseek-ai/dsh-fs-observation-policy` إضافة؛ هو هو واحد `fs/*` حدث بوابة إضافة، لن تغيير schema. تحميل هذه أداة نشر حسب مسبق مدة أيضا ينبغي تحميل هذا إضافة. لا يوجد `ctx.attachments` وقت صورة أداة لن تسجيل؛ ذلك schema و توجيه غير متصل، تنفيذ وقت حذف غير تأكيد قطع توجيه نموذج إعلان صورة إدخال، لا فإن رفض. |
| `@deepseek-ai/dsh-tool-fs-search` | `glob`،`grep` | `ctx.tools`،`ctx.subprocess`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | glob و grep هو بلا شرط متاح اكتشاف أداة، عبر ctx.subprocess spawn مع حزمة توفير ripgrep اثنان دخول صنع ملف (`@vscode/ripgrep`) ، و بصفة عادي قبل منصة استدعاء تشغيل، أبدا بصفة خلفية مهمة؛ بلا حاجة في مضيف آلة تثبيت `rg`، أيضا لا مرور مرور shell طبقة. هذا دليل استخدام `sampleOverCapGlobResults: true`؛ نشر يجب صريح اختيار هذا سلوك. نتيجة تجاوز مرور حد أعلى وقت، سوف عبر اختياري ctx.spillStore خلفية حفظ كامل صيغة تحويل قائمة؛ في مشترك وضع نشر في، إذا خلفية عام محلي مسار، إرجاع تحديد موضع معلومة يمكن توفير لاحق قراءة/بحث. |
| `@deepseek-ai/dsh-tool-terminal` | `terminal_close`،`terminal_list`،`terminal_open`،`terminal_read`،`terminal_send`،`terminal_signal` | `ctx.tools`،`ctx.terminals`،`ctx.systemPrompt`،`ctx.jobs at call time for run_in_background` | `tool/call`،`tool/result` | - | هذا 6 عدد طرفية أداة حاجة اختيار تفعيل، لأجل تكملة ملء مرة صفة bash/نظام الملفات أداة.`terminal_send(run_in_background: true)` سوف تسجيل إلى `ctx.jobs`؛schema لا يتضمن TUI، أداة اسم حسب مفتاح تسلسل،BEL، ضبط كامل مقياس قياس، تلقائي بدء و عبر agent مشترك. |
| `@deepseek-ai/dsh-tool-goal` | `create_goal`،`get_goal`،`update_goal` | `ctx.tools`،`ctx.agents`،`ctx.goals`،`ctx.systemPrompt`،`a calling Agent in an authorized open turn` | `tool/call`،`goal/change for mutations`،`tool/result` | - | create،edit،pause و resume اشتراط مباشر قدوم ذاتي شخص صنف أصل إذن؛complete و blocked أيضا قبول تأكيد قطع حالي Goal Round.blocked افتراضي تحت حد هو 3 عدد نيل دقيق Round. |
| `@deepseek-ai/dsh-schedule` | `schedule_create`،`schedule_delete`،`schedule_list` | `ctx.tools`،`ctx.sessions`،Session حفظ دائم، لم قدوم إنشاء live أصل Agent | `tool/call`،`schedule/change create or delete`،`tool/result` | - | فقط في اختيار تفعيل Schedule إضافة تحميل بعد إنشاء live أصل Agent scope داخل تسجيل. إصدار 1 قبول after_seconds، صريح قطعا مقابل at و محدود ثابت سرعة معدل every_seconds، و كشف كشف session-local تسليم؛ إدارة قراءة و تغيير يجب عبر مشترك Session حفظ دائم barrier. |
| `@deepseek-ai/dsh-tool-lsp` | `lsp` | `ctx.tools`،`ctx.lsp`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | lsp أداة سوف مزود اختيار و لغة خادم عملية فرعية وضع في ctx.lsp بعد، لذلك ذلك نموذج مرئي schema في أكثر تبديل مزود وقت إبقاء مستقر. وقت التشغيل اشتراط قد تسجيل مزود، مثال مثل `@deepseek-ai/dsh-lsp-stdio`؛ إذا لا يوجد مزود، استعلام سوف إرجاع بنية تحويل `LSP_UNAVAILABLE` خطأ، بينما لن تغيير schema. |
| `@deepseek-ai/dsh-tool-ralph` | `ralph` | `ctx.tools`،`ctx.workflowEngine`،`ctx.subagents`،`ctx.systemPrompt`،`a calling Agent (exec.agent parents every fresh round)` | `tool/call`،`tool/result`،`workflow and child session events during execution` | - | ثابت قبل منصة سير العمل سوف في كل Round بدء واحد كل جديد بنية تحويل فرعي درجة؛ نموذج فقط قدرة اختيار غير ممكن تغيير هدف و اختياري Round حد أعلى. |
| `@deepseek-ai/dsh-tool-skill` | `skill` | `ctx.tools`،`ctx.agents`،`ctx.skills` | `tool/call`،`tool/result`،`user/message replacement catalogs via agent.inject()` | - | - |
| `@deepseek-ai/dsh-tool-session-query` | `session_event_read`،`session_event_search`،`session_event_trace`،`session_search`،`session_trace` | `ctx.tools`،`ctx.systemPrompt`،`ctx.sessionQuery`،`a calling Agent for workspace authority` | `tool/call`،`tool/result` | - | هذا 5 عدد فقط قراءة أداة سوف إخفاء مزود تنقل علامة، و أصل حسب غير ممكن تغيير استدعاء agent جلسة لـ كل نتيجة تخويل. هذا حزمة حاجة اختيار تفعيل؛ حاجة قوي صنع قطع توقف وقت أو حد سطر داخل إخراج تركيب أيضا سوف تركيب عام مهلة أو spill سياسة. |
| `@deepseek-ai/dsh-tool-subagent` | `list_subagent_models`،`subagent` | `ctx.tools`،`ctx.subagents`،`ctx.systemPrompt`،`لأجل نموذج اكتشاف و الذي اختيار توجيه تحقق ctx.llm` | `tool/call`،`tool/result`،`child session events through the chosen provider` | `subagent`،`subagent_fork` | تسجيل تفويض إرسال أداة اسم أخذ قرار في تحميل وقت `toolName` إعداد (افتراضي لـ `subagent`) ؛ فوق وصف افتراضي schema إغلاق نموذج اختيار، بينما اكتشاف schema فإن عرض لـ قد تفعيل Session في متاح ثابت إعداد طقم أداة.Web preset سوف في كل جديد قمة طبقة Session إنشاء وقت قراءة إضافة صفحة انحراف جيد، و لـ ذلك فرعي Session إبقاء هذا قرار؛`subagent_fork` بداية نهاية استخدام ثابت توجيه. كل نسخة عبر `modelSelectionSettings`،`backgroundMode` و `enableRunInBackground` مستقل تحكم هل قراءة نموذج اختيار ضبط و ذلك خلفية سلوك. |
| `@deepseek-ai/dsh-tool-subagent-control` | `interrupt_agent`،`list_agents`،`send_message` | `ctx.tools`،`ctx.subagents`،`ctx.agents and ctx.sessionProjections (list_agents only)` | `tool/call`،`tool/result`،`child session events through ctx.subagents` | - | هذه هو تحكم يمكن متابعة خلفية subagent عام تسمية أداة: ربط مزود `tool-subagent` نسخة تسجيل مختلف تفويض إرسال أداة؛ هذه الحزمة تسجيل مرة `send_message` و `interrupt_agent`، آخر من `list_agents` عبر مفرد وحيد تحميل `/list-agents` إضافة توفير، ذلك دليل سطر استخدام sessionProjections و فوري Agent سجل التسجيل. |
| `@deepseek-ai/dsh-tool-jobs` | `job_kill`،`job_list`،`job_output` | `ctx.tools`،`ctx.jobs`،`ctx.systemPrompt` | `tool/call`،`tool/result`،`user/message via agent.inject() for background completion notices` | - | و مهمة نوع صنف غير متصل خلفية مهمة تحكم جهاز: خلفية bash أمر،PTY إرسال و subagent كل عبر نفسه 3 عدد أداة قراءة، صف خروج و إنهاء. تحميل هذا إضافة سوف تعليق وصل تحكم جهاز، من بينما تفعيل إنتاج جهة `ctx.jobs.start()`. |
| `@deepseek-ai/dsh-experimental-tool-agent-team` | `interrupt_agent`،`list_agents`،`send_message`،`spawn_teammate`،`team_task_create`،`team_task_get`،`team_task_list`،`team_task_update`،`wait_agent` | `ctx.tools`،`ctx.systemPrompt`،`ctx.agentTeams`،`an exact live Team member Agent` | `tool/call`،`team/member`،`team/message/queued`،`team/message/delivered`،`team/task`،`tool/result` | - | هذا 9 عدد أداة حد تحديد في خفي صيغة Team Lead و حمل دائم teammate أثر مجال. مع منتج إصدار dsh-base bundle افتراضي منع استخدام هذا حزمة؛ وثيقة في Agent Teams profile patch سوف تفعيل هو، و منع استخدام قديم continuable child نفس اسم تحكم أداة. |
| `@deepseek-ai/dsh-tool-todo` | `todo_write` | `ctx.tools`،`owning Agent session` | `tool/call`،`todo/write`،`tool/result` | - | todo_write هو جلسة كل حالة؛UI سوف الأكثر جديد todo/write حدث تصيير لـ فحص بيان.`allowParallelInProgress` هو لا يوجد قيمة افتراضية لا بد ملء بند، لذلك هذا دليل واضح اختيار `true`، مقابل وصف سماح معا وجود كثير عدد `in_progress` بند. اختيار `false` نشر سوف نيل نيل نفس أداة، لكن وصف سوف اشتراط فقط قدرة لديه 1 عدد نشط حركة مهمة. |
| `@deepseek-ai/dsh-tool-workflow` | `workflow` | `ctx.tools`،`ctx.workflowEngine`،`ctx.systemPrompt`،`a calling Agent (exec.agent parents the script children)` | `tool/call`،`tool/result` | - | - |
| `@deepseek-ai/dsh-tool-web` | `web_fetch`،`web_search` | `ctx.tools`،`ctx.web`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | web_search و web_fetch سوف مزود اختيار وضع في ctx.web بعد، جعل نموذج مرئي schema في أكثر تبديل خلفية وقت إبقاء مستقر. |

<a id="deepseek-aidsh-plugin-manager"></a>

## `@deepseek-ai/dsh-plugin-manager`

### `plugin_manager`

صف خروج حالي profile في إضافة أو تركيب حزمة، تفعيل أو منع استخدام هو جمع، تثبيت تركيب حزمة أو إزالة قد تثبيت تركيب حزمة. كل بند عملية كل اشتراط danger-full-access إذن أو هذا مرة استدعاء دفعة دقيق. دفعة دقيق لا تغيير جلسة إذن نمط. تغيير أثر هذا profile كل جلسة. أولا صف خروج بند بـ نيل أخذ دقيق تأكيد معرف. حزمة تثبيت ممكن تشغيل قد نيل دفعة دقيق بناء نص برمجي. دعم حمل حار تحديث profile قيام أي تطبيق تغيير؛ فقط بدء وقت تحميل profile حاجة إعادة بدء.

```json
{
  "type": "object",
  "properties": {
    "action": {
      "type": "string",
      "description": "Management operation.",
      "enum": [
        "list_plugins",
        "list_bundles",
        "set_plugin",
        "set_bundle",
        "install_bundle",
        "remove_bundle"
      ]
    },
    "target": {
      "type": "string",
      "description": "Plugin entry id, bundle package name, or installation spec, according to action."
    },
    "enabled": {
      "type": "boolean",
      "description": "Required for set operations; defaults to true for installation."
    },
    "approvedBuilds": {
      "type": "array",
      "description": "For install_bundle: pass names from pendingBuilds only after the user explicitly approves running their install scripts in the conversation. This grants persistent permission for this profile.",
      "items": {
        "type": "string"
      }
    },
    "offset": {
      "type": "number",
      "description": "Zero-based list offset; defaults to 0."
    },
    "limit": {
      "type": "number",
      "description": "List page size, from 1 to 100; defaults to 25."
    }
  },
  "required": [
    "action"
  ]
}
```

مصدر: [`packages/boot/plugin-manager/src/tools.ts`](../packages/boot/plugin-manager/src/tools.ts)

<a id="deepseek-aidsh-mcp-resources"></a>

## `@deepseek-ai/dsh-mcp-resources`

### `list_mcp_resource_templates`

صف خروج MCP خادم توفير معامل تحويل مورد URI نموذج لوح.

```json
{
  "type": "object",
  "properties": {
    "server": {
      "type": "string",
      "description": "Configured MCP server name."
    },
    "cursor": {
      "type": "string",
      "description": "Continuation cursor returned by this server."
    }
  },
  "required": [
    "server"
  ]
}
```

مصدر: [`packages/mcp/mcp-resources/src/tools.ts`](../packages/mcp/mcp-resources/src/tools.ts)

### `list_mcp_resources`

صف خروج MCP خادم توفير مورد.

```json
{
  "type": "object",
  "properties": {
    "server": {
      "type": "string",
      "description": "Configured MCP server name."
    },
    "cursor": {
      "type": "string",
      "description": "Continuation cursor returned by this server."
    }
  },
  "required": [
    "server"
  ]
}
```

مصدر: [`packages/mcp/mcp-resources/src/tools.ts`](../packages/mcp/mcp-resources/src/tools.ts)

### `read_mcp_resource`

حسب URI من إشارة تحديد خادم قراءة MCP مورد. استخدام قد صف خروج URI أو توسيع بعد مورد نموذج لوح.

```json
{
  "type": "object",
  "properties": {
    "server": {
      "type": "string",
      "description": "Configured MCP server name."
    },
    "uri": {
      "type": "string",
      "description": "Resource URI to read."
    }
  },
  "required": [
    "server",
    "uri"
  ]
}
```

مصدر: [`packages/mcp/mcp-resources/src/tools.ts`](../packages/mcp/mcp-resources/src/tools.ts)

<a id="deepseek-aidsh-experimental-browser-use-stagehand-native"></a>

## `@deepseek-ai/dsh-experimental-browser-use-stagehand-native`

### `stagehand_act`

استخدام إعداد Stagehand نموذج تنفيذ مرة ذاتي لكن لغة متصفح عملية.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pageId": {
      "type": "string",
      "minLength": 1
    },
    "instruction": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "instruction"
  ],
  "additionalProperties": false
}
```

مصدر:[`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_extract`

استخدام إعداد Stagehand نموذج و اختياري JSON Schema رفع أخذ صفحة بيانات.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pageId": {
      "type": "string",
      "minLength": 1
    },
    "instruction": {
      "type": "string",
      "minLength": 1
    },
    "schema": {
      "type": "object",
      "propertyNames": {
        "type": "string"
      },
      "additionalProperties": {
        "$ref": "#/$defs/__schema0"
      }
    }
  },
  "required": [
    "instruction"
  ],
  "additionalProperties": false,
  "$defs": {
    "__schema0": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "number"
        },
        {
          "type": "boolean"
        },
        {
          "type": "null"
        },
        {
          "type": "array",
          "items": {
            "$ref": "#/$defs/__schema0"
          }
        },
        {
          "type": "object",
          "propertyNames": {
            "type": "string"
          },
          "additionalProperties": {
            "$ref": "#/$defs/__schema0"
          }
        }
      ]
    }
  }
}
```

مصدر:[`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_navigate`

سوف Stagehand متصفح وسم صفحة تنقل حتى إشارة تحديد URL.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pageId": {
      "type": "string",
      "minLength": 1
    },
    "url": {
      "type": "string",
      "format": "uri"
    }
  },
  "required": [
    "url"
  ],
  "additionalProperties": false
}
```

مصدر:[`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_observe`

استخدام إعداد Stagehand نموذج فحص بحث رمز دمج إشارة أمر متصفح عملية.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pageId": {
      "type": "string",
      "minLength": 1
    },
    "instruction": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "instruction"
  ],
  "additionalProperties": false
}
```

مصدر:[`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_screenshot`

قطع أخذ Stagehand وسم صفحة رسم مثل بـ توفير نظر شعور فحص.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pageId": {
      "type": "string",
      "minLength": 1
    },
    "fullPage": {
      "default": false,
      "type": "boolean"
    }
  },
  "required": [
    "fullPage"
  ],
  "additionalProperties": false
}
```

مصدر:[`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_tabs`

صف خروج، إنشاء، اختيار أو إغلاق Stagehand متصفح وسم صفحة.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "action": {
          "type": "string",
          "const": "list"
        }
      },
      "required": [
        "action"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "action": {
          "type": "string",
          "const": "new"
        },
        "url": {
          "type": "string",
          "format": "uri"
        }
      },
      "required": [
        "action"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "action": {
          "type": "string",
          "enum": [
            "select",
            "close"
          ]
        },
        "pageId": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": [
        "action",
        "pageId"
      ],
      "additionalProperties": false
    }
  ],
  "type": "object"
}
```

مصدر:[`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

<a id="deepseek-aidsh-tool-ask-user"></a>

## `@deepseek-ai/dsh-tool-ask-user`

### `ask_user_question`

متابعة عملية قبل، إذا حاجة تأكيد، اختيار أو ناقص معلومة، طلب نحو مستخدم رفع خروج بسيط واضح مشكلة. إرسال واحد أو كثير عدد مشكلة، كل مشكلة كل حمل واحد مستقر id، هذا id سوف في جواب سجل في أصل مثال إرجاع.

```json
{
  "type": "object",
  "properties": {
    "questions": {
      "type": "array",
      "description": "Questions to ask the user before continuing.",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "id": {
            "type": "string",
            "description": "Stable id for this question; echoed in the answer."
          },
          "question": {
            "type": "string",
            "description": "The specific question to ask the user."
          },
          "header": {
            "type": "string",
            "description": "Optional short heading for the question, such as \"Confirm\" or \"Choose Mode\"."
          },
          "options": {
            "type": "array",
            "description": "Optional choices to show the user. If you recommend one, put it first and append \"(Recommended)\" to that label.",
            "items": {
              "type": "object",
              "additionalProperties": true,
              "properties": {
                "label": {
                  "type": "string",
                  "description": "Short user-facing option label."
                },
                "description": {
                  "type": "string",
                  "description": "One sentence explaining the tradeoff or impact."
                }
              },
              "required": [
                "label"
              ]
            }
          },
          "multi_select": {
            "type": "boolean",
            "description": "Whether the user may select more than one option. Defaults to false."
          }
        },
        "required": [
          "id",
          "question"
        ]
      }
    }
  },
  "required": [
    "questions"
  ]
}
```

مصدر:[`packages/interaction/tool-ask-user/src/index.ts`](../packages/interaction/tool-ask-user/src/index.ts)

ask_user_question سوف مؤقت توقف أداة استدعاء، مباشر إلى حالي UI مزود إرجاع شخص صنف جواب سجل.

<a id="deepseek-aidsh-tools"></a>

## `@deepseek-ai/dsh-tools`

### `run_code`

إبرة مقابل متاح أداة تنفيذ TypeScript برنامج. قبول اثنان عدد لا بد ملء معامل:`code`، أي مختلف خطوة دالة**دالة جسم**(فقط استخدام يمكن مسح حذف لغة قاعدة؛ دعم حمل قمة طبقة `await` و `return`) ؛ و `description`، بسيط يلزم شرح هذا برنامج فعل ماذا. طلب أصل حسب توجيه النظام في إعلان، بـ `await tools.name(args)` شكل صيغة استدعاء أداة. فقط لديه ضرب طبع أو إرجاع محتوى يخص برنامج إخراج، طلب حذر حذر غربلة اختيار. يحتوي صورة فرعي أداة نتيجة سوف في تشغيل انتهاء بعد مرفق إضافة.

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "The program: the body of an async TypeScript function."
    },
    "description": {
      "type": "string",
      "description": "Clear, concise description of what this program does in active voice, 5-10 words (shown in the UI). Examples: \"Count TODO markers across packages\"; \"Read failing test and its fixture\"; \"Rename config key in every cordis.yml\"."
    },
    "timeoutMs": {
      "type": "number",
      "description": "Positive elapsed-time budget in milliseconds, capped by the deployment maximum."
    },
    "sandbox_permissions": {
      "type": "string",
      "description": "Wider sandbox mode for this complete program execution; requires justification and approval.",
      "enum": [
        "workspace-write",
        "danger-full-access"
      ]
    },
    "justification": {
      "type": "string",
      "description": "Reason this complete program needs wider access, shown to the user for approval."
    }
  },
  "required": [
    "code",
    "description"
  ]
}
```

مصدر:[`packages/core/tools/src/ptc.ts`](../packages/core/tools/src/ptc.ts)

في `mode: ptc`/`mode: both` تحت، هو من أداة سجل التسجيل كل، بصفة يمكن مرور ترشيح قدرة طبقة خارج إبقاء نقل آلية (مشاركة رؤية PTC mode Agent Note). في `ptc` تحت، هو هو سجل التسجيل مقابل بروتوكول صيغة وحيد مساهمة؛ أخرى مرئي قدرة في استخدام قد تحميل وقت التشغيل لغة توليد SDK فصل عقدة في إعلان. برنامج عبر binding استدعاء هذه قدرة، استدعاء حسب وفق أصلي تزامن اتفاق ضبط درجة: بدء ترتيب و سياسة التزام دوران إيداع ترتيب، تزامن أمان دالة جسم الأكثر كثير إعادة تراكم تنفيذ `maxParallelSubCalls` عدد. استدعاء سوف إعادة دخول كامل كما تلقي حراسة حماية حفظ حماية أداة خط الإنتاج، و سوف كل تضمين طقم تنفيذ صلة ربط إلى هذا خارج طبقة نتيجة.

<a id="deepseek-aidsh-plan-mode"></a>

## `@deepseek-ai/dsh-plan-mode`

### `exit_plan_mode`

فقط في قاعدة تخطيط نمط تحت استخدام. إيداع حساب تخطيط توفير مستخدم مراجعة، و في نيل دفعة بعد خروج قاعدة تخطيط نمط. إرسال**كامل** Markdown حساب تخطيط، بـ واحد لـ حساب تخطيط تسمية # عنوان فتح رأس. مستخدم يمكن دفعة دقيق (من أنت تحت واحد خطوة بدء تنفيذ حساب تخطيط) ، أيضا يمكن اشتراط متابعة قاعدة تخطيط؛ ذلك عكس تغذية سوف عبر أداة نتيجة إرجاع، طلب تعديل بعد مجددا مرة إيداع.

```json
{
  "type": "object",
  "properties": {
    "plan": {
      "type": "string",
      "description": "The complete plan, as markdown, starting with a # heading that names it."
    }
  },
  "required": [
    "plan"
  ]
}
```

مصدر:[`packages/plan/plan-mode/src/index.ts`](../packages/plan/plan-mode/src/index.ts)

قاعدة تخطيط لم تنشيط وقت،exit_plan_mode ما زال إبقاء في موجه إلى نموذج schema في، هذا مثال حالة تحويل لن في قاعدة تخطيط سياسة تغيير خارج مقدار خارج صنع صار أداة دليل تغيير حركة. ذلك تنفيذ مسار سوف رفض قاعدة تخطيط نمط خارج استدعاء؛ في قاعدة تخطيط نمط تحت، هو عبر مستخدم تفاعل seam إيداع حساب تخطيط (دفعة دقيق/أصل حسب عكس تغذية متابعة قاعدة تخطيط) ، دفعة دقيق بعد سوف في خطوة حد سجل قاعدة تخطيط نمط قد توقف استخدام.

<a id="deepseek-aidsh-tool-bash"></a>

## `@deepseek-ai/dsh-tool-bash`

### `bash`

تنفيذ bash أمر (`bash -c`) و إرجاع stdout/stderr. كل مرة استدعاء كل في جديد shell في تشغيل: استدعاء بين لا إبقاء أي حالة (cwd، متغير، دالة) ، طلب نقل دخول `workdir`، لا يلزم استخدام `cd`. غير صفر خروج سوف تقرير إبلاغ لـ `[exit code: N]`. حالي harness بيئة معلومة عبر حمل إدارة `$DSH_*` متغير عام، حاجة وقت طلب فحص هذه متغير. أمر ممكن في ملف صندوق رملي في تشغيل؛ يتم منع توقف ملف عملية تقرير إبلاغ لـ `[sandbox: file access denied under <mode> mode]`، هذا هو سياسة رفض، بينما لا هو أمر نقص وقوع، طلب لا تبديل واحد نوع طريقة إعادة محاولة. مقارنة طويل إخراج سوف قطع قطع، فقط إبقاء ذيل جزء؛ مثل متاح، كامل إخراج سوف حفظ إلى ملف و تقرير إبلاغ ذلك مسار. مقابل في طويل وقت تشغيل أمر، طلب ضبط `run_in_background: true`: استدعاء سوف قيام أي إرجاع job id؛ استخدام `job_output` قراءة إخراج، استخدام `job_kill` إيقاف مهمة.

```json
{
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "The bash command to execute."
    },
    "description": {
      "type": "string",
      "description": "Clear, concise description of what this command does in active voice, 5-10 words (shown in the UI). Examples: \"ls\" → \"List files in current directory\"; \"git status\" → \"Show working tree status\"; \"npm install\" → \"Install package dependencies\"."
    },
    "timeoutMs": {
      "type": "number",
      "description": "Timeout in milliseconds. The executor applies its configured default and cap, and kills the command on expiry."
    },
    "workdir": {
      "type": "string",
      "description": "Working directory for this command. Defaults to the session workspace; a relative path is resolved against it."
    },
    "run_in_background": {
      "type": "boolean",
      "description": "Run in the background and return a job id immediately (collect with job_output, stop with job_kill). No timeout applies."
    }
  },
  "required": [
    "command",
    "description"
  ]
}
```

مصدر:[`packages/shell/tool-bash/src/index.ts`](../packages/shell/tool-bash/src/index.ts)

bash أداة هو bash منفذ seam موجه إلى نموذج مستهلك. استخدام `run_in_background` تشغيل سوف تسجيل إلى عام `ctx.jobs` وقت التشغيل، و عبر `job_*` أداة (قدوم ذاتي `@deepseek-ai/dsh-tool-jobs`) استلام تجميع/إيقاف؛ منع استخدام `enableRunInBackground` إعداد (افتراضي لـ true) بعد، هذا معامل سوف يتم تماما إزالة.

<a id="deepseek-aidsh-tool-present"></a>

## `@deepseek-ai/dsh-tool-present`

### `present`

إعلان تسليم Session نظام الملفات يمكن وصول قد لديه ملف. إذا أنت إنشاء أو تحديث ملف هو مستخدم اشتراط استقبال صار نتيجة، فإن يجب في كتابة إتمام بعد، نهائي عودة تكرار قبل استدعاء present، يشمل عبر Bash أو شفرة تنفيذ إنشاء ملف. في عودة تكرار في رفع إلى ملف مسار لا يستطيع بديل هذا مرة استدعاء. ملف يجب قد وجود. مستخدم فتح حالي مصدر ملف؛ لا نسخ أو حفظ ذلك محتوى.

```json
{
  "type": "object",
  "properties": {
    "files": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "path": {
            "type": "string",
            "description": "Path of an existing regular file. Relative paths use the Session working directory."
          },
          "description": {
            "type": "string",
            "description": "Brief description for the user."
          }
        },
        "required": [
          "path"
        ]
      }
    }
  },
  "required": [
    "files"
  ]
}
```

مصدر: [`packages/deliverables/tool-present/src/index.ts`](../packages/deliverables/tool-present/src/index.ts)

تسليم عودة استدعاء جهة Session كل؛Web ui-deliverables توفير مصدر ملف فتح و بطاقة.

<a id="deepseek-aidsh-tool-pwsh"></a>

## `@deepseek-ai/dsh-tool-pwsh`

### `pwsh`

تنفيذ PowerShell أمر (`pwsh -Command`) و إرجاع stdout/stderr. كل مرة استدعاء كل في جديد pwsh عملية في تشغيل: استدعاء بين لا إبقاء أي حالة (cwd، متغير، دالة) ، طلب نقل دخول `workdir`، لا يلزم استخدام `cd`. مسار اعتماد Windows أصلي شكل صيغة (`C:\...`) ؛ استخدام `$env:NAME` قراءة بيئة متغير. غير صفر خروج سوف تقرير إبلاغ لـ `[exit code: N]`. حالي harness بيئة معلومة عبر حمل إدارة `$env:DSH_*` متغير عام، حاجة وقت طلب فحص هذه متغير. أمر ممكن في ملف صندوق رملي في تشغيل؛ يتم منع توقف ملف عملية تقرير إبلاغ لـ `[sandbox: file access denied under <mode> mode]`، هذا هو سياسة رفض، بينما لا هو أمر نقص وقوع، طلب لا تبديل واحد نوع طريقة إعادة محاولة. مقارنة طويل إخراج سوف قطع قطع، فقط إبقاء ذيل جزء؛ مثل متاح، كامل إخراج سوف حفظ إلى ملف و تقرير إبلاغ ذلك مسار. في Windows فوق، يتم قوي صنع إنهاء أمر سوف بـ `[exit code: 1]` تسوية كما لا حمل إشارة علامة، طلب سوف ذلك نظر لـ في قطع، بينما لا هو أمر فشل. مقابل في طويل وقت تشغيل أمر، طلب ضبط `run_in_background: true`: استدعاء سوف قيام أي إرجاع job id؛ استخدام `job_output` قراءة إخراج، استخدام `job_kill` إيقاف مهمة.

```json
{
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "The PowerShell command to execute."
    },
    "description": {
      "type": "string",
      "description": "Clear, concise description of what this command does in active voice, 5-10 words (shown in the UI). Examples: \"ls\" → \"List files in current directory\"; \"git status\" → \"Show working tree status\"; \"Get-Process\" → \"List running processes\"."
    },
    "timeoutMs": {
      "type": "number",
      "description": "Timeout in milliseconds. The executor applies its configured default and cap, and kills the command on expiry."
    },
    "workdir": {
      "type": "string",
      "description": "Working directory for this command. Defaults to the session workspace; a relative path is resolved against it."
    },
    "run_in_background": {
      "type": "boolean",
      "description": "Run in the background and return a job id immediately (collect with job_output, stop with job_kill). No timeout applies."
    }
  },
  "required": [
    "command",
    "description"
  ]
}
```

مصدر:[`packages/shell/tool-pwsh/src/index.ts`](../packages/shell/tool-pwsh/src/index.ts)

pwsh أداة هو Windows تركيب في bash منفذ seam PowerShell جهة قول مستهلك (من `@deepseek-ai/dsh-pwsh-local` انتظار PowerShell منفذ لـ `ctx.shell` توفير خلفية) ؛ حذف صندوق رملي واجهة خارج، هو تدريجي بند مقابل bash أداة استدعاء. استخدام `run_in_background` تشغيل سوف تسجيل إلى عام `ctx.jobs` وقت التشغيل، و عبر `job_*` أداة استلام تجميع/إيقاف؛ حمل إدارة `DSH_*` بيئة قدوم ذاتي `@deepseek-ai/dsh-shell-env`. كل مرة استدعاء كل في جديد عملية في تشغيل، لا استخدام حمل دائم PTY جلسة. مسار اعتماد أصلي `C:\...` شكل صيغة، متغير اعتماد `$env:NAME`.

<a id="deepseek-aidsh-tool-cordis"></a>

## `@deepseek-ai/dsh-tool-cordis`

### `cordis_inspect_list`

صف خروج Host حالي معروف كل Cordis Inspect Provider، يشمل محلي Host Provider و Client تزامن الأكثر جديد بيان. كل بند يتضمن منصة، استخدام طريق، فقط قراءة طريقة و إدخال إخراج schema. تحرير كتابة أو إعداد إضافة قبل أولا استدعاء هذا أداة، مجددا من نتيجة اختيار cordis_inspect_query provider و طريقة. لا يلزم تخمين قياس اسم، أيضا لا يلزم يأخذ Inspect طريقة عند عمل إضافة شفرة يمكن استدعاء عمل خدمة Service.

```json
{
  "type": "object",
  "properties": {}
}
```

مصدر: [`packages/extensions/tool-cordis/src/index.ts`](../packages/extensions/tool-cordis/src/index.ts)

### `cordis_inspect_query`

تنفيذ Inspect Provider واضح إعلان فقط قراءة استعلام.platform،provider و method يجب قدوم ذاتي cordis_inspect_list،input يجب رمز دمج هذا طريقة schema. تحرير كتابة إضافة شفرة قبل، استخدام هذا أداة قراءة دقيق تأكيد Service طريقة،Event نمط،Builtin توقيع،Tool schema، رئيسي عنوان token، أو فوري Slot شجرة و props.Host استعلام في محلي تشغيل.Client استعلام انتظار صفحة أول عدد صالح استجابة، مباشر إلى صفحة عودة ينبغي أو أداة إلغاء. هذا أداة لا يستطيع استدعاء عمل خدمة Service طريقة أو تعديل وقت التشغيل. مقابل في Service.listService و Event.listEvents، لا نقل input يمكن تصفح تصفح دقيق بسيط توقيع دليل، مجددا استعلام دقيق تأكيد خدمة أو حدث بـ نيل نيل كامل اتفاق و مرجع نوع. مقابل في Slots.listSubTree، لا نقل root يمكن تصفح تصفح دقيق بسيط شجرة؛ استعلام دقيق تأكيد Slot root يمكن نيل نيل كامل تسجيل اتفاق و props، بينما استعلام دقيق تأكيد Factory root فقط إرجاع identity،scope و registrant.

```json
{
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "description": "Runtime platform that owns the Provider.",
      "enum": [
        "host",
        "client"
      ]
    },
    "provider": {
      "type": "string",
      "description": "Exact Provider ID returned by cordis_inspect_list."
    },
    "method": {
      "type": "string",
      "description": "Exact method name declared by the Provider manifest."
    },
    "input": {
      "description": "Optional query input; it must satisfy the method input schema."
    }
  },
  "required": [
    "platform",
    "provider",
    "method"
  ]
}
```

مصدر: [`packages/extensions/tool-cordis/src/index.ts`](../packages/extensions/tool-cordis/src/index.ts)

إنشاء صنع نمط توفير اثنان عدد فقط قراءة وقت التشغيل فحص أداة.Cordis host runner توفير فحص سجل التسجيل؛Client استعلام حاجة قد اتصال صفحة. حفظ دائم تغيير تحرير كتابة لـ تركيب حزمة، مجددا عبر plugin_manager تثبيت.

<a id="deepseek-aidsh-tool-bash-persistent"></a>

## `@deepseek-ai/dsh-tool-bash-persistent`

### `bash`

في حمل دائم bash shell في تشغيل أمر. يشمل حالي دليل و قد توجيه خروج بيئة متغير في داخل حالة سوف في هذا agent كثير مرة استدعاء بين إبقاء.

```json
{
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "The bash command to run. Relative path is preferred in the command."
    }
  },
  "required": [
    "command"
  ]
}
```

مصدر:[`packages/shell/tool-bash-persistent/src/index.ts`](../packages/shell/tool-bash-persistent/src/index.ts)

واحد حسب كل من عزل حمل دائم bash أداة؛ نشر تركيب توفير PTY خلفية، و يمكن تغطية موجه إلى نموذج بيئة وصف.

<a id="deepseek-aidsh-tool-pwsh-persistent"></a>

## `@deepseek-ai/dsh-tool-pwsh-persistent`

### `pwsh`

في حمل دائم PowerShell shell في تشغيل أمر. يشمل حالي دليل و قد توجيه خروج بيئة متغير في داخل حالة سوف في هذا agent كثير مرة استدعاء بين إبقاء.

```json
{
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "The PowerShell command to run. Relative path is preferred in the command."
    }
  },
  "required": [
    "command"
  ]
}
```

مصدر:[`packages/shell/tool-pwsh-persistent/src/index.ts`](../packages/shell/tool-pwsh-persistent/src/index.ts)

واحد حسب كل من عزل حمل دائم pwsh أداة، حمل دائم bash أداة Windows مقابل شيء؛ نشر تركيب توفير pwsh جهة قول PTY خلفية، و يمكن تغطية موجه إلى نموذج بيئة وصف.

<a id="deepseek-aidsh-tool-str-replace-editor"></a>

## `@deepseek-ai/dsh-tool-str-replace-editor`

### `str_replace_editor`

لأجل فحص نظر، إنشاء و تحرير ملف ذاتي تعريف تحرير أداة:

* حالة سوف في أمر استدعاء و و مستخدم نقاش نقاش بين حمل دائم إبقاء
* إذا `path` هو ملف،`view` سوف عرض تطبيق `cat -n` بعد نتيجة. إذا `path` هو دليل،`view` سوف صف خروج الأكثر كثير نحو تحت 2 طبقة غير إخفاء ملف و دليل
* إذا إشارة تحديد `create` أمر هدف `path` قد بصفة ملف وجود، فإن لا يستطيع استخدام هذا أمر
* إذا `command` إنتاج مقارنة طويل إخراج، إخراج سوف يتم قطع قطع و علامة لـ `<response clipped>`
* حالي أمر لا استخدام بعض عدد معامل وقت، قيمة لـ `null` احتلال موضع معامل نظر لـ لم توفير. لا بد ملء معامل ما زال يجب توفير قيمة؛ حذف مطابقة محتوى وقت ينبغي حذف `str_replace.new_str`، بينما لا هو سوف ذلك ضبط لـ `null`

استخدام `str_replace` أمر وقت طلب ملاحظة معنى:

* `old_str` معامل ينبغي و أصل ملف في واحد سطر أو كثير سطر وصل متابعة محتوى**تماما**مطابقة. طلب إبقاء معنى فارغ أبيض محرف!
* إذا `old_str` معامل في ملف في لا وحيد، فإن لن تنفيذ استبدال. طلب تأكيد حفظ في `old_str` في يتضمن كاف كاف سياق، جعل ذلك وحيد
* `new_str` معامل ينبغي يتضمن لأجل استبدال `old_str` قد تحرير سطر

```json
{
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "The commands to run. Allowed options are: `view`, `create`, `str_replace`, `insert`.",
      "enum": [
        "view",
        "create",
        "str_replace",
        "insert"
      ]
    },
    "path": {
      "type": "string",
      "description": "Absolute path to file or directory, e.g. `/repo/file.py` or `/repo`."
    },
    "file_text": {
      "oneOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Required string parameter of `create` command, with the content of the file to be created. A null placeholder is treated as omitted by commands that do not use this parameter."
    },
    "insert_line": {
      "oneOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "description": "Required integer parameter of `insert` command. The `new_str` will be inserted AFTER the line `insert_line` of `path`. A null placeholder is treated as omitted by commands that do not use this parameter."
    },
    "new_str": {
      "oneOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Optional string parameter of `str_replace` command containing the new string (if omitted, no string will be added). Required string parameter of `insert` command containing the string to insert. A null placeholder is accepted only by commands that do not use this parameter."
    },
    "old_str": {
      "oneOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Required string parameter of `str_replace` command containing the string in `path` to replace. A null placeholder is treated as omitted by commands that do not use this parameter."
    },
    "view_range": {
      "oneOf": [
        {
          "type": "array",
          "items": {
            "type": "integer"
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Optional parameter of `view` command when `path` points to a file. If omitted or null, the full file is shown. If provided, the file will be shown in the indicated line number range, e.g. [11, 12] will show lines 11 and 12. Indexing at 1 to start. Setting `[start_line, -1]` shows all lines from `start_line` to the end of the file."
    }
  },
  "required": [
    "command",
    "path"
  ]
}
```

مصدر:[`packages/fs/tool-str-replace-editor/src/index.ts`](../packages/fs/tool-str-replace-editor/src/index.ts)

أساس في نظام الملفات seam مستقل فحص نظر/إنشاء/وحيد حرف وجه كمية استبدال/حسب سطر إدراج دخول أداة؛ يمكن و أي shell أو طرفية واجهة تركيب.

<a id="deepseek-aidsh-tool-fs"></a>

## `@deepseek-ai/dsh-tool-fs`

### `edit`

عبر استبدال حرف وجه كمية نص قدوم تحرير قائم UTF-8 نص ملف.

```json
{
  "type": "object",
  "properties": {
    "file_path": {
      "type": "string",
      "description": "Path to edit, resolved by the filesystem backend."
    },
    "old_string": {
      "type": "string",
      "description": "Literal text to replace. Must match exactly."
    },
    "new_string": {
      "type": "string",
      "description": "Literal replacement text. Use an empty string to delete the match."
    },
    "replace_all": {
      "type": "boolean",
      "description": "Replace all matches. Defaults to false; when false, old_string must appear exactly once."
    }
  },
  "required": [
    "file_path",
    "old_string",
    "new_string"
  ]
}
```

مصدر:[`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

### `read`

قراءة UTF-8 نص ملف، و إرجاع حمل سطر رقم محتوى.

```json
{
  "type": "object",
  "properties": {
    "file_path": {
      "type": "string",
      "description": "Path to read, resolved by the filesystem backend."
    },
    "offset": {
      "type": "number",
      "description": "1-based first line to return. Defaults to 1."
    },
    "limit": {
      "type": "number",
      "description": "Maximum number of lines to return. Defaults to 2000."
    }
  },
  "required": [
    "file_path"
  ]
}
```

مصدر:[`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

### `read_image`

قراءة PNG/JPEG/WebP/GIF ملف و إرجاع رسم مثل ذاته. بلا توسيع اسم مسار نفس مثال يتم قبول؛ صيغة حسب ملف محتوى فحص قياس، لذلك مواصفة تحويل مرفق عنصر مسار يمكن مباشر نقل دخول، بلا حاجة نسخ أو إعادة تسمية.Harness سوف في تحت مرة نموذج طلب قبل تحقق و تقليص صغير تلقي دعم حمل كبير رسم، لذلك فقط لـ فحص نظر صورة وقت ينبغي مباشر استخدام هذا أداة، بلا حاجة تثبيت صورة مكتبة أو إنشاء تقليص اختصار رسم. يمكن استخدام صغير دفعة مرة تزامن قراءة ذاك هذا مستقل ملف. اشتراط حالي نموذج قبول رسم مثل إدخال.

```json
{
  "type": "object",
  "properties": {
    "file_path": {
      "type": "string",
      "description": "Path to the image file, resolved by the filesystem backend."
    }
  },
  "required": [
    "file_path"
  ]
}
```

مصدر:[`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

### `write`

إنشاء أو تماما استبدال UTF-8 نص ملف.

```json
{
  "type": "object",
  "properties": {
    "file_path": {
      "type": "string",
      "description": "Path to write, resolved by the filesystem backend."
    },
    "content": {
      "type": "string",
      "description": "Full UTF-8 text content to write."
    }
  },
  "required": [
    "file_path",
    "content"
  ]
}
```

مصدر:[`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

أولا قراءة بعد كتابة/تحرير سياسة من `@deepseek-ai/dsh-fs-observation-policy` إضافة؛ هو هو واحد `fs/*` حدث بوابة إضافة، لن تغيير schema. تحميل هذه أداة نشر حسب مسبق مدة أيضا ينبغي تحميل هذا إضافة. لا يوجد `ctx.attachments` وقت صورة أداة لن تسجيل؛ ذلك schema و توجيه غير متصل، تنفيذ وقت حذف غير تأكيد قطع توجيه نموذج إعلان صورة إدخال، لا فإن رفض.

<a id="deepseek-aidsh-tool-fs-search"></a>

## `@deepseek-ai/dsh-tool-fs-search`

### `glob`

فحص بحث مسار مطابقة glob نمط ملف. فقط إرجاع مطابقة ملف مسار، أبدا إرجاع دليل؛ يشمل إخفاء ملف و يتم تجاهل اختصار ملف، لكن ترتيب حذف VCS بيانات وصفية دليل. الأكثر كثير حسب تعديل وقت ترتيب إرجاع 100 بند مسار؛ إذا نتيجة أكثر كثير، فإن تعديل لـ إرجاع من قمة طبقة بند في سحب مثال 100 بند مسار، شرح قد سحب مثال، و تقرير إبلاغ كامل ترتيب تسلسل جدول حفظ موضع. هذا أداة لا قطعة رفع دليل بند.

```json
{
  "type": "object",
  "properties": {
    "pattern": {
      "type": "string",
      "description": "Glob pattern to match file paths against (e.g. \"**/*.ts\", \"src/**/*.test.js\"). A pattern with no \"/\" matches the basename at any depth, so \"*\" and \"*.ts\" both search the whole tree; include a separator to anchor the depth."
    },
    "path": {
      "type": "string",
      "description": "Directory to search in. Defaults to the session workspace; a relative path resolves against it."
    }
  },
  "required": [
    "pattern"
  ]
}
```

مصدر:[`packages/fs/tool-fs-search/src/index.ts`](../packages/fs/tool-fs-search/src/index.ts)

### `grep`

استخدام ripgrep صحيح فإن جدول بلوغ صيغة بحث ملف محتوى. إرجاع حمل سطر رقم مطابقة سطر، و حسب ملف قسم مجموعة. قبل 250 بند مطابقة سوف مباشر إرجاع؛ نتيجة بلوغ إلى حد أعلى وقت سوف تقرير إبلاغ كامل مطابقة قائمة حفظ موضع. مثل يحتاج دورة حافة سياق، طلب مقابل مطابقة ملف استخدام read.

```json
{
  "type": "object",
  "properties": {
    "pattern": {
      "type": "string",
      "description": "Regular expression to search for (ripgrep syntax)."
    },
    "path": {
      "type": "string",
      "description": "File or directory to search. Defaults to the session workspace; a relative path resolves against it."
    },
    "include": {
      "type": "string",
      "description": "One glob filter for which files to search (e.g. \"*.ts\", \"*.{js,jsx}\"). Not a list; negation is not supported."
    }
  },
  "required": [
    "pattern"
  ]
}
```

مصدر:[`packages/fs/tool-fs-search/src/index.ts`](../packages/fs/tool-fs-search/src/index.ts)

glob و grep هو بلا شرط متاح اكتشاف أداة، عبر ctx.subprocess spawn مع حزمة توفير ripgrep اثنان دخول صنع ملف (`@vscode/ripgrep`) ، و بصفة عادي قبل منصة استدعاء تشغيل، أبدا بصفة خلفية مهمة؛ بلا حاجة في مضيف آلة تثبيت `rg`، أيضا لا مرور مرور shell طبقة. هذا دليل استخدام `sampleOverCapGlobResults: true`؛ نشر يجب صريح اختيار هذا سلوك. نتيجة تجاوز مرور حد أعلى وقت، سوف عبر اختياري ctx.spillStore خلفية حفظ كامل صيغة تحويل قائمة؛ في مشترك وضع نشر في، إذا خلفية عام محلي مسار، إرجاع تحديد موضع معلومة يمكن توفير لاحق قراءة/بحث.

<a id="deepseek-aidsh-tool-terminal"></a>

## `@deepseek-ai/dsh-tool-terminal`

### `terminal_close`

إغلاق واحد حمل دائم طرفية، و انتظار ذلك التقاط كما كل عملية شجرة تماما خروج.

```json
{
  "type": "object",
  "properties": {
    "sessionId": {
      "type": "string",
      "description": "Terminal session id."
    }
  },
  "required": [
    "sessionId"
  ]
}
```

مصدر:[`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_list`

صف خروج حالي agent كل حمل دائم طرفية جلسة.

```json
{
  "type": "object",
  "properties": {}
}
```

مصدر:[`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_open`

عبر قد تسجيل خلفية نوع إنشاء حسب كل من عزل حمل دائم طرفية جلسة. حاجة في كثير مرة أداة استدعاء بين إبقاء shell أو REPL حالة وقت، طلب استخدام هذا أداة.

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "description": "Registered terminal backend type, usually \"shell\"."
    },
    "name": {
      "type": "string",
      "description": "Optional owner-local display name such as \"main\" or \"gdb\"."
    },
    "cwd": {
      "type": "string",
      "description": "Initial working directory. Defaults to the deployment workspace root."
    }
  },
  "required": [
    "type"
  ]
}
```

مصدر:[`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_read`

من حمل دائم طرفية قراءة واحد صفحة محدود إبقاء إخراج، لا إرسال إدخال.

```json
{
  "type": "object",
  "properties": {
    "sessionId": {
      "type": "string",
      "description": "Terminal session id."
    },
    "offset": {
      "type": "number",
      "description": "Newest-relative line offset (default 0)."
    },
    "count": {
      "type": "number",
      "description": "Requested line count (default 500; backend caps apply)."
    }
  },
  "required": [
    "sessionId"
  ]
}
```

مصدر:[`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_send`

نحو حمل دائم طرفية إرسال نص. افتراضي سوف إيداع Enter، و انتظار تلميح رمز،stdin انتظار، إخراج ساكن صامت، مهلة أو جلسة خروج. خلفية نمط سوف إرجاع توفير job_output/job_kill استخدام job id.

```json
{
  "type": "object",
  "properties": {
    "sessionId": {
      "type": "string",
      "description": "Terminal session id returned by terminal_open or terminal_list."
    },
    "text": {
      "type": "string",
      "description": "UTF-8 text to write to the terminal."
    },
    "submit": {
      "type": "boolean",
      "description": "Submit Enter after text (default true). Set false for control characters or incomplete REPL input."
    },
    "run_in_background": {
      "type": "boolean",
      "description": "Return a job id immediately; collect with job_output or stop with job_kill."
    }
  },
  "required": [
    "sessionId",
    "text"
  ]
}
```

مصدر:[`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_signal`

نحو حمل دائم طرفية حالي قبل منصة عملية مجموعة إرسال سماح إشارة.

```json
{
  "type": "object",
  "properties": {
    "sessionId": {
      "type": "string",
      "description": "Terminal session id."
    },
    "signal": {
      "type": "string",
      "description": "Signal to deliver. Shell-targeted SIGKILL is rejected; use terminal_close.",
      "enum": [
        "SIGINT",
        "SIGTERM",
        "SIGKILL",
        "SIGTSTP",
        "SIGHUP"
      ]
    }
  },
  "required": [
    "sessionId",
    "signal"
  ]
}
```

مصدر:[`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

هذا 6 عدد طرفية أداة حاجة اختيار تفعيل، لأجل تكملة ملء مرة صفة bash/نظام الملفات أداة.`terminal_send(run_in_background: true)` سوف تسجيل إلى `ctx.jobs`؛schema لا يتضمن TUI، أداة اسم حسب مفتاح تسلسل،BEL، ضبط كامل مقياس قياس، تلقائي بدء و عبر agent مشترك.

<a id="deepseek-aidsh-tool-goal"></a>

## `@deepseek-ai/dsh-tool-goal`

### `create_goal`

عند حالي مباشر شخص صنف طلب هو حاجة عبر ذاتي رئيسي Goal Round حمل متابعة دفع دخول طويل مدة هدف وقت، إنشاء واحد حفظ دائم نفس جلسة إتمام هدف. أي استخدام مستخدم لا يوجد واضح قول «إنشاء هدف» ، أنت أيضا يمكن دفع قطع ذلك معنى رسم. لا يلزم لأجل بسيط مفرد مفرد جولة عمل. تنفيذ وقت سوف رفض غير شخص صنف إذن و subagent إذن.

```json
{
  "type": "object",
  "properties": {
    "objective": {
      "type": "string",
      "description": "The concrete completion objective inferred from the direct human request."
    },
    "max_goal_rounds": {
      "type": "number",
      "description": "Optional positive safe-integer limit on automatic continuation rounds."
    }
  },
  "required": [
    "objective"
  ]
}
```

مصدر:[`packages/goal/tool-goal/src/index.ts`](../packages/goal/tool-goal/src/index.ts)

### `get_goal`

قراءة حالي نفس جلسة هدف، يشمل تأكيد قطع id/revision، هدف، مرحلة مقطع، قد إتمام تأخير متابعة Round عدد،Round حد أعلى، وجود وقت منع سد سبب، و هل قد دقيق تجهيز تحت مرة تأخير متابعة. تحديث هدف قبل طلب أولا استدعاء هذا أداة.

```json
{
  "type": "object",
  "properties": {}
}
```

مصدر:[`packages/goal/tool-goal/src/index.ts`](../packages/goal/tool-goal/src/index.ts)

### `update_goal`

تحديث تأكيد قطع حالي هدف revision.edit،pause و resume اشتراط مباشر قمة طبقة شخص صنف طلب. في تلقائي تأخير متابعة حالي هدف خلال، أيضا سماح complete و blocked. في بلوغ إلى إعداد الأكثر صغير Round عدد قبل سوف رفض blocked؛ نموذج ما زال يجب حكم قطع نفسه شرط هل في هذه Round في حمل متابعة وجود، و في blocked_reason في إعطاء بـ شرح.

```json
{
  "type": "object",
  "properties": {
    "goal_id": {
      "type": "string",
      "description": "Exact id returned by get_goal."
    },
    "revision": {
      "type": "number",
      "description": "Exact positive revision returned by get_goal."
    },
    "action": {
      "type": "string",
      "description": "edit | pause | resume | complete | blocked",
      "enum": [
        "edit",
        "pause",
        "resume",
        "complete",
        "blocked"
      ]
    },
    "objective": {
      "type": "string",
      "description": "Replacement objective; valid only with action edit."
    },
    "max_goal_rounds": {
      "type": "number",
      "description": "Replacement cap; valid only with action edit."
    },
    "blocked_reason": {
      "type": "string",
      "description": "Concrete blocking condition; required only with action blocked."
    }
  },
  "required": [
    "goal_id",
    "revision",
    "action"
  ]
}
```

مصدر:[`packages/goal/tool-goal/src/index.ts`](../packages/goal/tool-goal/src/index.ts)

create،edit،pause و resume اشتراط مباشر قدوم ذاتي شخص صنف أصل إذن؛complete و blocked أيضا قبول تأكيد قطع حالي Goal Round.blocked افتراضي تحت حد هو 3 عدد نيل دقيق Round.

<a id="deepseek-aidsh-schedule"></a>

## `@deepseek-ai/dsh-schedule`

### `schedule_create`

في حالي جلسة في إنشاء واحد بند رفع تنبيه. طلب توفير غير فارغ prompt و تماما جيد واحد selector: صحيح أمان كامل عدد after_seconds تأخير وقت؛ بصفة صارم إطار حمل انحراف نقل يوم مدة وقت أو محلي يوم مدة/وقت كائن at؛ أو لا صغير في 300 أمان كامل عدد every_seconds. ثابت سرعة معدل رفع تنبيه بداية نهاية و إنشاء وقت لحظة مقابل متساو، سوف قفز مرور خطأ مرور حدوث وقت نقطة، و يأخذ كل بند تجاوز مدة قاعدة الأكثر جديد واحد حدوث وقت نقطة دمج إلى واحد دفعة مرة في. تسليم نمط هو session-local: فقط لديه هذا جلسة موضع في live حالة وقت، رفع تنبيه عندئذ سوف دقيق وقت تشغيل؛ لا فإن رفع تنبيه سوف دخول overdue حالة، مباشر حتى جلسة استعادة.

```json
{
  "type": "object",
  "properties": {
    "prompt": {
      "type": "string",
      "description": "Reminder content to present when the target becomes due."
    },
    "after_seconds": {
      "type": "number",
      "description": "Positive safe-integer delay in seconds."
    },
    "every_seconds": {
      "type": "number",
      "description": "Fixed-rate safe-integer interval in seconds, at least 300."
    },
    "at": {
      "oneOf": [
        {
          "type": "string"
        },
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "date": {
              "type": "string"
            },
            "time": {
              "type": "string"
            },
            "time_zone": {
              "type": "string"
            }
          },
          "required": [
            "date",
            "time",
            "time_zone"
          ]
        }
      ],
      "description": "Absolute target as strict offset RFC 3339 or local date/time with an explicit IANA zone."
    }
  },
  "required": [
    "prompt"
  ]
}
```

مصدر:[`packages/schedule/schedule/src/tools.ts`](../packages/schedule/schedule/src/tools.ts)

### `schedule_delete`

استخدام schedule_create أو schedule_list إرجاع تأكيد قطع id، حذف حالي جلسة في واحد بند نشط حركة رفع تنبيه. لم معرفة أو قد انتهاء id سوف إرجاع deleted false.

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Exact session-local schedule id."
    }
  },
  "required": [
    "id"
  ]
}
```

مصدر:[`packages/schedule/schedule/src/tools.ts`](../packages/schedule/schedule/src/tools.ts)

### `schedule_list`

حسب إنشاء ترتيب صف خروج حالي جلسة في كل نشط حركة رفع تنبيه، يشمل تأكيد قطع id،UTC هدف،scheduled أو overdue حالة، و session-local تسليم نمط.

```json
{
  "type": "object",
  "properties": {}
}
```

مصدر:[`packages/schedule/schedule/src/tools.ts`](../packages/schedule/schedule/src/tools.ts)

فقط في اختيار تفعيل Schedule إضافة تحميل بعد إنشاء live أصل Agent scope داخل تسجيل. إصدار 1 قبول after_seconds، صريح قطعا مقابل at و محدود ثابت سرعة معدل every_seconds، و كشف كشف session-local تسليم؛ إدارة قراءة و تغيير يجب عبر مشترك Session حفظ دائم barrier.

<a id="deepseek-aidsh-tool-lsp"></a>

## `@deepseek-ai/dsh-tool-lsp`

### `lsp`

استعلام لغة خادم، بـ دقيق تنقل شفرة.operation يمكن أخذ goToDefinition،findReferences،goToImplementation أو hover.line و character هو من 1 بدء UTF-16 ضوء علامة جلوس علامة.findReferences يتضمن إعلان.

```json
{
  "type": "object",
  "properties": {
    "operation": {
      "type": "string",
      "description": "goToDefinition, findReferences, goToImplementation, or hover.",
      "enum": [
        "goToDefinition",
        "findReferences",
        "goToImplementation",
        "hover"
      ]
    },
    "file_path": {
      "type": "string",
      "description": "The source file to query, relative to the workspace or absolute."
    },
    "line": {
      "type": "number",
      "description": "One-based line of the cursor."
    },
    "character": {
      "type": "number",
      "description": "One-based UTF-16 column of the cursor."
    }
  },
  "required": [
    "operation",
    "file_path",
    "line",
    "character"
  ]
}
```

مصدر:[`packages/lsp/tool-lsp/src/index.ts`](../packages/lsp/tool-lsp/src/index.ts)

lsp أداة سوف مزود اختيار و لغة خادم عملية فرعية وضع في ctx.lsp بعد، لذلك ذلك نموذج مرئي schema في أكثر تبديل مزود وقت إبقاء مستقر. وقت التشغيل اشتراط قد تسجيل مزود، مثال مثل `@deepseek-ai/dsh-lsp-stdio`؛ إذا لا يوجد مزود، استعلام سوف إرجاع بنية تحويل `LSP_UNAVAILABLE` خطأ، بينما لن تغيير schema.

<a id="deepseek-aidsh-tool-ralph"></a>

## `@deepseek-ai/dsh-tool-ralph`

### `ralph`

محيط التفاف واحد غير ممكن تغيير هدف تشغيل استخدام كل جديد agent قبل منصة Ralph حلقة. فقط عند مباشر شخص صنف واضح اشتراط Ralph أو استخدام كل جديد agent تكرار بديل وقت استخدام. كل Round كل سوف بدء واحد كل جديد فرعي درجة، هذا فرعي درجة نظر لا إلى أب درجة محادثة أو أولا قبل فرعي جلسة؛ مشترك مساحة العمل ملء عند طويل مدة تسجيل ذاكرة،Round بين فقط نقل تمرير محدود بنية تحويل تقرير إبلاغ. عند عمل عملية تقرير إبلاغ إتمام، تقرير إبلاغ أداة جسم منع سد بند أو بلوغ إلى Round حد أعلى وقت، استدعاء إرجاع. عادي طويل مدة نفس جلسة عمل ينبغي استخدام goal أداة.

```json
{
  "type": "object",
  "properties": {
    "objective": {
      "type": "string",
      "description": "The immutable completion objective for every fresh Ralph round."
    },
    "maxRounds": {
      "type": "number",
      "description": "Optional positive safe-integer round cap, bounded by the deployment ceiling."
    }
  },
  "required": [
    "objective"
  ]
}
```

مصدر:[`packages/workflow/tool-ralph/src/index.ts`](../packages/workflow/tool-ralph/src/index.ts)

ثابت قبل منصة سير العمل سوف في كل Round بدء واحد كل جديد بنية تحويل فرعي درجة؛ نموذج فقط قدرة اختيار غير ممكن تغيير هدف و اختياري Round حد أعلى.

<a id="deepseek-aidsh-tool-skill"></a>

## `@deepseek-ai/dsh-tool-skill`

### `skill`

تحميل متاح skill(تقنية قدرة) كامل شرح. في تنفيذ نقطة اسم بعض بند skill أو و ذلك واضح مطابقة مهمة قبل، طلب استخدام جلسة skill دليل في تأكيد قطع اسم استدعاء هذا أداة.

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The exact skill name from the available skills list."
    }
  },
  "required": [
    "name"
  ]
}
```

مصدر:[`packages/skill/tool-skill/src/index.ts`](../packages/skill/tool-skill/src/index.ts)

<a id="deepseek-aidsh-tool-session-query"></a>

## `@deepseek-ai/dsh-tool-session-query`

### `session_event_read`

من واحد قد نيل تخويل جلسة في قراءة واحد كامل كما لم حذف عقدة حدث، و اختياري متبادل مجاور أصلي حدث عام وصف.

```json
{
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "Target session id. Omit for the current session."
    },
    "seq": {
      "type": "integer",
      "description": "Target event sequence number."
    },
    "before": {
      "type": "integer",
      "description": "Number of preceding raw events to summarize. Omit for none."
    },
    "after": {
      "type": "integer",
      "description": "Number of following raw events to summarize. Omit for none."
    }
  },
  "required": [
    "seq"
  ]
}
```

مصدر:[`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_event_search`

في واحد قد نيل تخويل جلسة في بحث أولا قبل حدث؛ إذا بحث حالي جلسة، فإن ترتيب حذف تنفيذ هذا مرة استدعاء خطوة.

```json
{
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "Target session id. Omit for the current session."
    },
    "query": {
      "type": "string",
      "description": "Literal full-text query over the target session."
    },
    "seq_from": {
      "type": "integer",
      "description": "Inclusive event sequence lower bound."
    },
    "seq_to": {
      "type": "integer",
      "description": "Inclusive event sequence upper bound."
    },
    "time_from": {
      "type": "string",
      "description": "Inclusive timezone-qualified ISO 8601 event-time lower bound."
    },
    "time_to": {
      "type": "string",
      "description": "Inclusive timezone-qualified ISO 8601 event-time upper bound."
    },
    "event_types": {
      "type": "array",
      "description": "Event types to include.",
      "items": {
        "type": "string"
      }
    },
    "surfaces": {
      "type": "array",
      "description": "Event surfaces to include.",
      "items": {
        "type": "string",
        "enum": [
          "current",
          "shadowed",
          "log-only"
        ]
      }
    }
  },
  "required": [
    "query"
  ]
}
```

مصدر:[`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_event_trace`

قراءة قد نيل تخويل جلسة في بعض عدد حدث كل مباشر استبدال علاقة، و هذا حدث و ذلك مرجع مصدر حدث بين علاقة.

```json
{
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "Target session id. Omit for the current session."
    },
    "seq": {
      "type": "integer",
      "description": "Target event sequence number."
    }
  },
  "required": [
    "seq"
  ]
}
```

مصدر:[`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_search`

بحث استدعاء جهة مساحة العمل في أولا قبل جلسة، و من كل جلسة إرجاع مطابقة درجة الأكثر عال حدث.

```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "Literal full-text query over prior session history."
    },
    "session_ids": {
      "type": "array",
      "description": "Optional session ids to include.",
      "items": {
        "type": "string"
      }
    },
    "created_at_from": {
      "type": "string",
      "description": "Inclusive timezone-qualified ISO 8601 creation-time lower bound."
    },
    "created_at_to": {
      "type": "string",
      "description": "Inclusive timezone-qualified ISO 8601 creation-time upper bound."
    },
    "parent_session_ids": {
      "type": "array",
      "description": "Optional direct parent session ids.",
      "items": {
        "type": "string"
      }
    },
    "include_root_sessions": {
      "type": "boolean",
      "description": "Include sessions with no parent in the parent filter."
    },
    "availability": {
      "type": "array",
      "description": "Require at least one selected source availability.",
      "items": {
        "type": "string",
        "enum": [
          "live",
          "persisted"
        ]
      }
    },
    "event_seq_from": {
      "type": "integer",
      "description": "Inclusive event sequence lower bound."
    },
    "event_seq_to": {
      "type": "integer",
      "description": "Inclusive event sequence upper bound."
    },
    "event_time_from": {
      "type": "string",
      "description": "Inclusive timezone-qualified ISO 8601 event-time lower bound."
    },
    "event_time_to": {
      "type": "string",
      "description": "Inclusive timezone-qualified ISO 8601 event-time upper bound."
    },
    "event_types": {
      "type": "array",
      "description": "Event types to include.",
      "items": {
        "type": "string"
      }
    },
    "event_surfaces": {
      "type": "array",
      "description": "Event surfaces to include.",
      "items": {
        "type": "string",
        "enum": [
          "current",
          "shadowed",
          "log-only"
        ]
      }
    }
  },
  "required": [
    "query"
  ]
}
```

مصدر:[`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_trace`

قراءة محيط التفاف واحد جلسة قد تخويل جلسة جدول نظام، يشمل كامل مرئي أصل أولا و بعد بديل علاقة.

```json
{
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "Target session id. Omit for the current session."
    }
  }
}
```

مصدر:[`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

هذا 5 عدد فقط قراءة أداة سوف إخفاء مزود تنقل علامة، و أصل حسب غير ممكن تغيير استدعاء agent جلسة لـ كل نتيجة تخويل. هذا حزمة حاجة اختيار تفعيل؛ حاجة قوي صنع قطع توقف وقت أو حد سطر داخل إخراج تركيب أيضا سوف تركيب عام مهلة أو spill سياسة.

<a id="deepseek-aidsh-tool-subagent"></a>

## `@deepseek-ai/dsh-tool-subagent`

### `list_subagent_models`

اكتشاف subagent متاح LLM توجيه، لا أكثر تعديل حالي Agent. بلا معامل استدعاء سوف صف خروج قد تسجيل مزود؛ توفير `provider` وقت سوف صف خروج ذلك عام نشر نموذج؛ معا توفير `provider` و `model` وقت سوف فحص هذا دقيق نموذج و ذلك دفع إدارة قوي درجة. دليل بند فقط توفير بناء اقتراح:adapter ممكن قبول لم صف خروج نموذج id. يأخذ إرجاع id لأجل تفويض إرسال أداة `provider`،`model` و `reasoning_effort` حقل.

```json
{
  "type": "object",
  "properties": {
    "provider": {
      "type": "string",
      "description": "Registered LLM provider id. Omit to list providers."
    },
    "model": {
      "type": "string",
      "description": "Exact model id to inspect. Requires provider; omit to list that provider's advertised models."
    }
  }
}
```

مصدر:[`packages/subagent/tool-subagent/src/list-models.ts`](../packages/subagent/tool-subagent/src/list-models.ts)

### `subagent`

سوف واحد بند ذاتي يتضمن مهمة تفويض إرسال إعطاء subagent(في ذاته سياق في عمل مستقل agent) ، استخدام هو إزالة تجمع تركيز كما مستقل عمل، مثال مثل بحث بحث، حد تحديد نطاق تنفيذ أو قسم تحليل، بـ تجنب إزالة استهلاك حالي محادثة سياق.subagent سوف إرجاع نتيجة، لكن لن إرجاع في بين خطوة. طلب توفير كامل، مستقل نص التوجيه، لأن هو نظر لا إلى حالي محادثة. هذا استدعاء افتراضي انتظار نتيجة. ضبط `run_in_background: true` يمكن إرجاع job id؛ استخدام `job_output` استلام تجميع نتيجة، استخدام `job_kill` إيقاف مهمة.

```json
{
  "type": "object",
  "properties": {
    "description": {
      "type": "string",
      "description": "A short (3-5 word) description of the delegated task, for display."
    },
    "prompt": {
      "type": "string",
      "description": "The complete, self-contained task for the subagent. It does not share this conversation's context, so include everything it needs."
    },
    "run_in_background": {
      "type": "boolean",
      "description": "Whether to run as a background job and return its id. Defaults to false; collect with job_output or stop with job_kill."
    }
  },
  "required": [
    "description",
    "prompt"
  ]
}
```

مصدر:[`packages/subagent/tool-subagent/src/index.ts`](../packages/subagent/tool-subagent/src/index.ts)

تسجيل تفويض إرسال أداة اسم أخذ قرار في تحميل وقت `toolName` إعداد (افتراضي لـ `subagent`) ؛ فوق وصف افتراضي schema إغلاق نموذج اختيار، بينما اكتشاف schema فإن عرض لـ قد تفعيل Session في متاح ثابت إعداد طقم أداة.Web preset سوف في كل جديد قمة طبقة Session إنشاء وقت قراءة إضافة صفحة انحراف جيد، و لـ ذلك فرعي Session إبقاء هذا قرار؛`subagent_fork` بداية نهاية استخدام ثابت توجيه. كل نسخة عبر `modelSelectionSettings`،`backgroundMode` و `enableRunInBackground` مستقل تحكم هل قراءة نموذج اختيار ضبط و ذلك خلفية سلوك.

<a id="deepseek-aidsh-tool-subagent-control"></a>

## `@deepseek-ai/dsh-tool-subagent-control`

### `interrupt_agent`

أصل حسب agent id طلب إلغاء خلفية agent حالي جولة. هدف يمكن هو أنت مباشر فرعي درجة، أيضا يمكن هو في أنت تحت جهة إنشاء أكثر عميق طبقة agent. فقط لديه حالي جولة سوف إيقاف: قد ترتيب طابور إرسال إعطاء هذا agent رسالة سوف واحد مباشر وضع وضع إلى لاحق send_message؛ هو بدء agent سوف متابعة تشغيل؛ هذا agent ذاته ما زال يمكن قبول لاحق عملية. إيقاف طلب يتم قبول بعد، هذا استدعاء قيام أي إرجاع، لذلك هدف ممكن أيضا سوف قصير مؤقت تشغيل؛ في قطع واحد قد إتمام agent هو يمكن قبول فارغ عملية.

```json
{
  "type": "object",
  "properties": {
    "agent_id": {
      "type": "string",
      "description": "The agent id of the running agent to interrupt."
    }
  },
  "required": [
    "agent_id"
  ]
}
```

مصدر:[`packages/subagent/tool-subagent-control/src/index.ts`](../packages/subagent/tool-subagent-control/src/index.ts)

### `list_agents`

حسب حمل دائم id و وسم صف خروج أنت يمكن متابعة خلفية subagent. استخدام هو عودة ذاكرة أنت بدء مرور أي بعض subagent، بينما لا هو جولة استفسار إتمام حال حال——subagent إتمام وقت أنت سوف يتم إبلاغ معرفة. حالة قدوم ذاتي فوري سجل التسجيل:running يمثل agent هذا لحظة صحيح في عمل؛idle يمثل قد تحميل لكن موضع في جولة بين، ممكن صحيح في انتظار هو بدء agent؛ready يمثل هو فقط وجود في تخزين في——يمكن استعادة بينما غير نهاية حالة، أيضا لا يمثل لديه نتيجة انتظار استلام تجميع؛`send_message` سوف في تشغيل في child الأكثر قريب step حد steer رسالة، أو لـ idle،ready child بدء جولة، كما بلا نقاش موضع في أي نوع حالة، مباشر فرعي درجة كل ما زال يمكن بصفة `send_message` هدف. هذا لقطة و غير إلقاء تمرير تحمل وعد؛`send_message` سوف تنفيذ مرجعي فحص، ما زال ممكن فشل. لا يمكن قراءة فرعي درجة سوف بصفة تشخيص معلومة تقرير إبلاغ، بينما لن يتم ساكن صامت إسقاط.`descendants` أثر مجال سوف حسب مستقر قبل ترتيب ترتيب مرة تاريخ أنت تحت جهة كامل شجرة شجرة، و لـ كل بند علامة ملاحظة ذلك حمل دائم مباشر أب جلسة id و عميق درجة. فقط لديه عميق درجة لـ 1 بند يمكن استخدام `send_message`؛ أكثر عميق بند فقط قدرة بصفة `interrupt_agent` مرشح هدف.

```json
{
  "type": "object",
  "properties": {
    "scope": {
      "type": "string",
      "description": "children (default) lists direct children only; descendants walks the complete tree below you.",
      "enum": [
        "children",
        "descendants"
      ]
    }
  }
}
```

مصدر:[`packages/subagent/tool-subagent-control/src/list-agents.ts`](../packages/subagent/tool-subagent-control/src/list-agents.ts)

### `send_message`

أصل حسب agent id نحو مباشر يمكن متابعة child إرسال رسالة. إذا أنت هو إقامة إبقاء يمكن متابعة child، أيضا يمكن يأخذ ذاتي ذات مباشر parent بصفة هدف. إذا هدف ما زال في عمل، رسالة سوف steer ذلك الأكثر قريب step؛ إذا هدف موضع في idle، رسالة سوف بدء واحد جولة. هذا استدعاء لن إرجاع هذا agent جواب سجل، فقط سوف تأكيد رسالة قد إلقاء تمرير. استدعاء فشل يمثل رسالة**لم**إلقاء تمرير.

```json
{
  "type": "object",
  "properties": {
    "agent_id": {
      "type": "string",
      "description": "The agent id of your direct continuable child, or your direct parent when you are a resident continuable child."
    },
    "message": {
      "type": "string",
      "description": "The message to deliver to the agent."
    }
  },
  "required": [
    "agent_id",
    "message"
  ]
}
```

مصدر:[`packages/subagent/tool-subagent-control/src/index.ts`](../packages/subagent/tool-subagent-control/src/index.ts)

هذه هو تحكم يمكن متابعة خلفية subagent عام تسمية أداة: ربط مزود `tool-subagent` نسخة تسجيل مختلف تفويض إرسال أداة؛ هذه الحزمة تسجيل مرة `send_message` و `interrupt_agent`، آخر من `list_agents` عبر مفرد وحيد تحميل `/list-agents` إضافة توفير، ذلك دليل سطر استخدام sessionProjections و فوري Agent سجل التسجيل.

<a id="deepseek-aidsh-tool-jobs"></a>

## `@deepseek-ai/dsh-tool-jobs`

### `job_kill`

أصل حسب job id طلب إلغاء صحيح في تشغيل خلفية مهمة. هذا استدعاء قيام أي إرجاع؛ مهمة عمل حق صحيح إيقاف بعد، سوف بـ killed حالة تسوية.

```json
{
  "type": "object",
  "properties": {
    "job_id": {
      "type": "string",
      "description": "Job id returned by the tool that started the background work."
    },
    "reason": {
      "type": "string",
      "description": "Optional short reason, recorded in the log and forwarded to the job."
    }
  },
  "required": [
    "job_id"
  ]
}
```

مصدر:[`packages/jobs/tool-jobs/src/index.ts`](../packages/jobs/tool-jobs/src/index.ts)

### `job_list`

صف خروج أنت خلفية مهمة (يشمل صحيح في تشغيل و قد إتمام مهمة) و ذلك id، نوع صنف و حالة.

```json
{
  "type": "object",
  "properties": {}
}
```

مصدر:[`packages/jobs/tool-jobs/src/index.ts`](../packages/jobs/tool-jobs/src/index.ts)

### `job_output`

قراءة خلفية مهمة. تدفق صيغة مهمة فقط إرجاع ذاتي فوق مرة قراءة بـ قدوم إخراج؛ نهائي إخراج مهمة سوف في تسوية بعد إرجاع نتيجة. كل استجابة كل بـ `[status: ...]` ربط ذيل. قراءة افتراضي لا منع سد؛ ضبط `wait: true` بعد، الأكثر طويل انتظار إلى إعداد حد أعلى.

```json
{
  "type": "object",
  "properties": {
    "job_id": {
      "type": "string",
      "description": "Job id returned by the tool that started the background work."
    },
    "wait": {
      "type": "boolean",
      "description": "Block until the job reaches a terminal status or the timeout expires. A timed-out wait returns [status: running] and leaves the job alive."
    },
    "timeout_ms": {
      "type": "number",
      "description": "Max wait in milliseconds (only meaningful with wait: true). Defaults to the configured wait timeout; capped by the configured maximum."
    }
  },
  "required": [
    "job_id"
  ]
}
```

مصدر:[`packages/jobs/tool-jobs/src/index.ts`](../packages/jobs/tool-jobs/src/index.ts)

و مهمة نوع صنف غير متصل خلفية مهمة تحكم جهاز: خلفية bash أمر،PTY إرسال و subagent كل عبر نفسه 3 عدد أداة قراءة، صف خروج و إنهاء. تحميل هذا إضافة سوف تعليق وصل تحكم جهاز، من بينما تفعيل إنتاج جهة `ctx.jobs.start()`.

<a id="deepseek-aidsh-experimental-tool-agent-team"></a>

## `@deepseek-ai/dsh-experimental-tool-agent-team`

### `interrupt_agent`

في قطع واحد اسم teammate حالي turn، معا إبقاء ذلك انتظار معالجة inbox. فقط Team Lead متاح.

```json
{
  "type": "object",
  "properties": {
    "target": {
      "type": "string",
      "description": "Teammate name."
    }
  },
  "required": [
    "target"
  ]
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `list_agents`

صف خروج Lead و كل حمل دائم teammate، و كل منها حالي وقت التشغيل حالة.

```json
{
  "type": "object",
  "properties": {}
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `send_message`

نحو آخر اسم Team member إرسال واحد بند حمل دائم رسالة.running target سوف في الأكثر قريب خطوة حد استلام إلى رسالة؛idle target سوف بدء واحد turn؛inactive teammate سوف بارد استعادة.

```json
{
  "type": "object",
  "properties": {
    "target": {
      "type": "string",
      "description": "Team member name, or lead."
    },
    "message": {
      "type": "string",
      "description": "Self-contained message for the target."
    }
  },
  "required": [
    "target",
    "message"
  ]
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `spawn_teammate`

إنشاء واحد اسم أداة اسم، حمل دائم teammate. فقط لديه Team Lead يمكن استدعاء هذا أداة.

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Unique lower-kebab-case teammate name."
    },
    "description": {
      "type": "string",
      "description": "Short description of the delegated responsibility."
    },
    "prompt": {
      "type": "string",
      "description": "Complete initial task for the teammate."
    },
    "context": {
      "type": "string",
      "description": "fresh starts without Lead history; fork inherits completed Lead turns. Defaults to fresh.",
      "enum": [
        "fresh",
        "fork"
      ]
    }
  },
  "required": [
    "name",
    "description",
    "prompt"
  ]
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_create`

في مشترك Team مهمة لوح فوق إنشاء واحد بلا owner pending task.

```json
{
  "type": "object",
  "properties": {
    "subject": {
      "type": "string",
      "description": "Concise task title."
    },
    "description": {
      "type": "string",
      "description": "Complete task details and acceptance criteria."
    },
    "blocked_by": {
      "type": "array",
      "description": "Task ids that must complete first.",
      "items": {
        "type": "string"
      }
    },
    "write_scopes": {
      "type": "array",
      "description": "Advisory workspace-relative file or directory prefixes this task expects to modify.",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "subject",
    "description"
  ]
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_get`

في تعديل أو تنفيذ مشترك مهمة قبل، قراءة ذلك كامل الأكثر جديد قيمة.

```json
{
  "type": "object",
  "properties": {
    "task_id": {
      "type": "string",
      "description": "Shared task id."
    }
  },
  "required": [
    "task_id"
  ]
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_list`

صف خروج مشترك مهمة، يشمل readiness،owner،revision،blocker و write-scope warning.

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "description": "Optional exact status filter.",
      "enum": [
        "pending",
        "in_progress",
        "completed"
      ]
    },
    "owner": {
      "type": "string",
      "description": "Optional member-name filter; use unowned for tasks without an owner."
    },
    "ready": {
      "type": "boolean",
      "description": "Optional readiness filter."
    },
    "cursor": {
      "type": "integer",
      "description": "Zero-based result offset. Defaults to 0."
    },
    "limit": {
      "type": "integer",
      "description": "Number of rows, 1 through 100. Defaults to 50."
    }
  }
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_update`

استخدام team_task_get أو team_task_list إرجاع الأكثر جديد revision، مقابل مشترك مهمة عملية تنفيذ compare-and-set.

```json
{
  "type": "object",
  "properties": {
    "task_id": {
      "type": "string",
      "description": "Shared task id."
    },
    "expected_revision": {
      "type": "integer",
      "description": "Current task revision used as the CAS precondition."
    },
    "action": {
      "type": "string",
      "description": "Task transition to apply.",
      "enum": [
        "claim",
        "release",
        "edit",
        "set_dependencies",
        "complete",
        "reopen",
        "reassign",
        "delete"
      ]
    },
    "subject": {
      "type": "string",
      "description": "Replacement title for edit."
    },
    "description": {
      "type": "string",
      "description": "Replacement details for edit."
    },
    "blocked_by": {
      "type": "array",
      "description": "Complete blocker list for set_dependencies.",
      "items": {
        "type": "string"
      }
    },
    "write_scopes": {
      "type": "array",
      "description": "Replacement advisory write scopes for edit.",
      "items": {
        "type": "string"
      }
    },
    "owner": {
      "type": "string",
      "description": "Member name for Lead-only reassign; omit to unassign."
    }
  },
  "required": [
    "task_id",
    "expected_revision",
    "action"
  ]
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `wait_agent`

انتظار هذا مرة استدعاء بدء بعد تحت مرة teammate حالة،mailbox أو مشترك مهمة تغيير. هو أبدا سوف نداء تنبيه inactive member؛ إذا لا يوجد أخرى member صحيح في running أو provisioning، فإن قيام أي إرجاع noProgress. نداء تنبيه أو مهلة بعد ينبغي إعادة صف خروج حالة، بينما لا هو جولة استفسار.

```json
{
  "type": "object",
  "properties": {
    "timeout_ms": {
      "type": "integer",
      "description": "Wait duration in milliseconds, from 10000 through 3600000. Defaults to 30000."
    }
  }
}
```

مصدر:[`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

هذا 10 عدد أداة حد تحديد في خفي صيغة Team Lead و حمل دائم teammate أثر مجال. مع منتج إصدار dsh-base bundle افتراضي منع استخدام هذا حزمة؛ وثيقة في Agent Teams profile patch سوف تفعيل هو، و منع استخدام قديم continuable child نفس اسم تحكم أداة.


<a id="deepseek-aidsh-tool-todo"></a>

## `@deepseek-ai/dsh-tool-todo`

### `todo_write`

سجل و تحديث حالي عمل بنية تحويل مهمة قائمة. كل مرة استدعاء كل يلزم إرسال**كامل قائمة**، هو سوف**استبدال**قبل قائمة، لا دعم حمل نطاق جزء تحديث أو تدريجي بند تحرير. طلب استخدام هو قاعدة تخطيط كثير خطوة عمل و عرض دخول درجة: بدء قبل لـ كل أداة جسم خطوة إضافة واحد بند todo. سوف حالي صحيح في معالجة كل بند todo علامة لـ `in_progress`؛ تأكيد فعلي و سطر وقت التشغيل (مثال مثل تزامن subagent أو خلفية أمر) يمكن معا علامة كثير بند، ترتيب عمل فإن علامة 1 بند. فقط يلزم عمل بعد لم إتمام، حينئذ ينبغي حتى قليل لديه واحد بند مهمة لـ `in_progress`. بعض بند todo إتمام بعد قيام أي علامة لـ `completed`، لا يلزم دفعة كمية علامة إتمام؛ فقط لديه الكل عمل إتمام بعد، عندئذ يمكن لا يوجد `in_progress` بند. بسيط مفرد مفرد خطوة مهمة بلا حاجة استخدام قائمة. حالة:`pending`(لم بدء) ،`in_progress`(صحيح في معالجة) ،`completed`(قد إتمام).

```json
{
  "type": "object",
  "properties": {
    "todos": {
      "type": "array",
      "description": "The COMPLETE task list, replacing any previous list.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "content": {
            "type": "string",
            "description": "What the task is — a short imperative line."
          },
          "status": {
            "type": "string",
            "description": "pending (not started) | in_progress (now) | completed (done).",
            "enum": [
              "pending",
              "in_progress",
              "completed"
            ]
          }
        },
        "required": [
          "content",
          "status"
        ]
      }
    }
  },
  "required": [
    "todos"
  ]
}
```

مصدر:[`packages/todo/tool-todo/src/index.ts`](../packages/todo/tool-todo/src/index.ts)

todo_write هو جلسة كل حالة؛UI سوف الأكثر جديد todo/write حدث تصيير لـ فحص بيان.`allowParallelInProgress` هو لا يوجد قيمة افتراضية لا بد ملء بند، لذلك هذا دليل واضح اختيار `true`، مقابل وصف سماح معا وجود كثير عدد `in_progress` بند. اختيار `false` نشر سوف نيل نيل نفس أداة، لكن وصف سوف اشتراط فقط قدرة لديه 1 عدد نشط حركة مهمة.

<a id="deepseek-aidsh-tool-workflow"></a>

## `@deepseek-ai/dsh-tool-workflow`

### `workflow`

تشغيل لأجل كبير قاعدة نموذج تحرير ترتيب subagent JavaScript سير العمل نص برمجي. عند عمل سوف قسم تفرق إلى سماح كثير متبادل متبادل مستقل جزء وقت، طلب استخدام هذا أداة، مثال مثل مراجعة فحص كبير كمية ملف، تنفيذ ترحيل، فتح عرض كثير زاوية درجة بحث بحث أو مقابل اكتشاف إجراء مقابل مقاومة صيغة تحقق؛ هذا وقت ينبغي سوف تحرير ترتيب كتابة صار نص برمجي، بينما لا هو تدريجي جولة تفويض إرسال.

سير العمل هوية عبر `meta` معامل بـ JSON شكل صيغة نقل دخول: لا بد ملء `name`(بسيط قصير kebab-case) و `description` نص، و اختياري `whenToUse` نص و `phases` عدد مجموعة (`{title, detail?, provider?, model?}`).`script` معامل فقط قدرة هو صاف JavaScript **دالة جسم**، لا يستطيع هو TypeScript، أيضا لا يستطيع يتضمن `export const meta` لغة جملة؛meta هو معامل بينما غير شفرة. نص برمجي دعم حمل قمة طبقة await؛ طلب بـ `return <value>` ربط ذيل، هذا قيمة يجب يمكن JSON تسلسل تحويل، و بصفة هذا أداة نتيجة.

نص برمجي دالة جسم توفير التالي خطاف:

- `agent(prompt, opts?): Promise<any>`: تشغيل واحد subagent مباشر حتى إتمام. لا توفير `opts.schema` وقت، تحليل لـ فرعي درجة نهائي نص؛ توفير `opts.schema` وقت، هو يجب هو بـ كائن لـ أصل، كما**فقط قدرة**استخدام type/properties/required/additionalProperties/items/enum/const/oneOf JSON Schema، لا دعم حمل pattern/format/عدد قيمة حد، هذا وقت تحليل لـ عبر تحقق كائن. فرعي درجة فشل وقت تحليل لـ `null`، يمكن استخدام `.filter(Boolean)` مرور ترشيح. أخرى خيار يشمل `label`(عرض اسم) ،`phase`(دخول درجة مجموعة) ، و متبادل متبادل مستقل `provider`/`model` LLM(كبير لغة نموذج) هدف تغطية بند، اثنان من يمكن مفرد وحيد توفير. أخرى أي خيار (`effort`/`isolation`/`agentType`) كل سوف واضح تقرير خطأ.
- `pipeline(items, ...stages): Promise<any[]>`: يجعل كل بند قسم آخر مرور مرور كل مرحلة مقطع، مرحلة مقطع بين**لا يوجد**شاشة عائق؛ كثير مرحلة مقطع عمل أولوية استخدام هو. كل مرحلة مقطع استقبال `(prev, item, index)`. عادي مرحلة مقطع استثناء سوف سوف هذا**بند**تغيير لـ `null`، و قفز مرور هو باق بقية مرحلة مقطع.
- `parallel(thunks): Promise<any[]>`: تزامن تشغيل صفر معامل دالة و انتظار**الكل**إتمام. هو سوف شكل صار شاشة عائق، فقط عند بعض عدد مرحلة مقطع تأكيد فعلي حاجة تجميع مجموع الكل أولا قبل نتيجة وقت استخدام. رمي خروج استثناء thunk تحليل لـ `null`.
- `phase(title)`: بدء واحد دخول درجة مرحلة مقطع؛`log(message)`: شرح دخول درجة؛`args`: أداة استدعاء `args` إدخال، أصل مثال توفير.

إذا خطأ استخدام خطاف (معامل خطأ، لم معرفة خيار، لا تلقي دعم حمل schema، إطلاق حد أعلى) ، رمي خروج خطأ**مجموع سوف**إنهاء نص برمجي، أبدا سوف تراجع تحويل لـ مفرد عدد بند `null`.

قيد: تزامن حد أعلى و agent مجموع عدد حد أعلى متساو سوف توليد فاعلية؛ لا توفير نظام الملفات، شبكة شبكة، تحديد وقت جهاز أو Node.js API. أداة جسم عمل من agent إتمام، نص برمجي فقط مسؤول تحرير ترتيب. هذا تشغيل في قبل منصة تنفيذ: كامل نص برمجي إتمام بعد، استدعاء عندئذ سوف إرجاع.

```json
{
  "type": "object",
  "properties": {
    "script": {
      "type": "string",
      "description": "The plain-JS workflow script body (top-level await allowed; NO `export const meta` statement; end with `return <json-value>`)."
    },
    "meta": {
      "type": "object",
      "description": "The workflow identity block (plain JSON — never code).",
      "additionalProperties": true,
      "properties": {
        "name": {
          "type": "string",
          "description": "Short kebab-case workflow name."
        },
        "description": {
          "type": "string",
          "description": "One-line description of what the workflow does."
        },
        "whenToUse": {
          "type": "string",
          "description": "Optional guidance on when this workflow applies."
        },
        "phases": {
          "type": "array",
          "description": "Optional phase declarations matched by phase() calls.",
          "items": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "title": {
                "type": "string",
                "description": "The phase title phase() calls match by exact string."
              },
              "detail": {
                "type": "string",
                "description": "Optional one-line description of the phase."
              },
              "provider": {
                "type": "string",
                "description": "Optional provider override this phase is expected to use."
              },
              "model": {
                "type": "string",
                "description": "Optional model override this phase is expected to use."
              }
            },
            "required": [
              "title"
            ]
          }
        }
      },
      "required": [
        "name",
        "description"
      ]
    },
    "args": {
      "type": "object",
      "description": "Optional JSON input exposed to the script as the `args` global (wrap a bare list as a field, e.g. {\"files\": [...]}).",
      "additionalProperties": true
    }
  },
  "required": [
    "script",
    "meta"
  ]
}
```

مصدر:[`packages/workflow/tool-workflow/src/index.ts`](../packages/workflow/tool-workflow/src/index.ts)

<a id="deepseek-aidsh-tool-web"></a>

## `@deepseek-ai/dsh-tool-web`

### `web_fetch`

نيل أخذ إشارة تحديد HTTP(S) URL محتوى، و سوف ذلك حل رمز لـ نص بعد إرجاع.

```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "description": "The HTTP(S) URL to fetch."
    }
  },
  "required": [
    "url"
  ]
}
```

مصدر:[`packages/web/tool-web/src/index.ts`](../packages/web/tool-web/src/index.ts)

### `web_search`

في Web فوق بحث الأكثر جديد معلومة. في لا بد ملء `queries` عدد مجموعة في توفير 1–4 عدد استعلام. إرجاع اختياري ملخص جواب سجل و مصدر URL قائمة.

```json
{
  "type": "object",
  "properties": {
    "queries": {
      "type": "array",
      "description": "Required search queries; accepts 1–4 items and merges their results.",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "queries"
  ]
}
```

مصدر:[`packages/web/tool-web/src/index.ts`](../packages/web/tool-web/src/index.ts)

web_search و web_fetch سوف مزود اختيار وضع في ctx.web بعد، جعل نموذج مرئي schema في أكثر تبديل خلفية وقت إبقاء مستقر.

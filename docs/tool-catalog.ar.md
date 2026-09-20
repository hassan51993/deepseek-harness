<!-- النصُّ الإنجليزي مولَّد من scripts/gen-tool-catalog.ts؛ وهذا الملف العربي يُصان يدويًا ويُقرن به عبر سجل الاقتران الثنائي اللغة.
     عند التحديث، شغّل `pnpm run gen-tool-catalog` أولًا لتحديث النص الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/tool-catalog.md` لإعادة تسجيل الاقتران. -->

# دليل schemas الأدوات

[English](tool-catalog.md) | العربية

كلُّ أداة يراها النموذجُ وتسهم بها إضافةٌ مشحونة في `ctx.tools`: الاسمُ `name` والوصفُ `description` وschema المعاملات `parameters` بصيغة JSON Schema التي يتلقاها النموذجُ عبر تجميع مطالبة النظام. وهي تكمّل [صفحات الأنظمة](subsystems/core.ar.md) (الأنواعَ ومنطقةَ واجهة Cordis البرمجية المولَّدة في كل صفحة) — فهذه الصفحةُ هي *الأدوات* المعروضة على الوكيل.

وهذا الملفُّ مولَّد ويُتحقق من طزاجته بـ`pnpm run verify-tool-catalog` (وهو جزءٌ من `doc-sync`) — فلا تحرّره يدويًّا. وخلافًا لدليل cordis (وهو مرورٌ صرف على شجرة المصدر)، **يُقلع** هذا المولِّدُ كلَّ إضافة أدوات في سياق حقيقي ويقرأ `ctx.tools.schemas()`، لأن schema الأداة غيرُ معروف ساكنًا (فهناك قوائمُ تُنشر في وقت التشغيل، وأوصافٌ موصولة، وأسماءٌ يقودها الضبط، وأدواتُ MCP بـJSON Schema خام). ويمسح حارسُ الاكتمال النمطَ `packages/*/tool-*` ويفشل إن غابت حزمةٌ عن بيان إقلاع المولِّد، فلا تبقى أداةٌ جديدة بلا توثيق بصمت.

النطاق: أدواتُ المنتَج المشحونة تحت `packages/*/tool-*`، ويُقلع كلٌّ منها بضبطه **الافتراضي**، إلا حين يكون حقلُ ضبط **مشترَطًا** بلا افتراض — فهناك يجب على المولِّد أن يختار، وتسجّل ملاحظةُ الحزمة أيَّ الفرعين تعرضه هذه الصفحة. وقد يكون **اسمُ** الأداة المسجَّل ضبطًا عند التحميل (مثل `toolName` في `tool-subagent`)، فقد يكشف نشرٌ حزمةً باسم مختلف أو إضافي — وتسجّل ملاحظةُ الحزمة تلك الأسماءَ البديلة المشحونة حيث توجد. وأدواتُ العرض في `examples/` (مثل `echo`) مستبعَدة، اتساقًا مع نطاق دليل cordis المقتصر على الحزم.

<a id="tool-package-map"></a>

## خريطة حزم الأدوات

يصل هذا الجدولُ أسماءَ الأدوات التي يراها النموذجُ بحزمة الإضافة وseams الخدمات وراءها. وتأتي schemas JSON بعينها في أقسام الحزم أدناه.

| حزمة الأداة | الأسماء التي يراها النموذج | تشترط | تكتب أو تؤثر في | الأسماء البديلة المشحونة | ملاحظة النشر |
| --- | --- | --- | --- | --- | --- |
| `@deepseek-ai/dsh-plugin-manager` | `plugin_manager` | `ctx.tools`, `ctx.pluginManager`, `ctx.sandboxPolicy` | `tool/call`, `tool/result`, `user/message` | - | - |
| `@deepseek-ai/dsh-mcp-resources` | `list_mcp_resource_templates`, `list_mcp_resources`, `read_mcp_resource` | `ctx.tools`, `ctx.mcpResources` | `tool/call`, `tool/result` | - | - |
| `@deepseek-ai/dsh-experimental-browser-use-stagehand-native` | `stagehand_act`،`stagehand_extract`،`stagehand_navigate`،`stagehand_observe`،`stagehand_screenshot`،`stagehand_tabs` | `ctx.browserUse`،`ctx.agents`،`ctx.tools`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | - |
| `@deepseek-ai/dsh-tool-ask-user` | `ask_user_question` | `ctx.tools`،`ctx.userQuestions` | `tool/call`،`tool/result after a UI/provider answers the question` | - | توقف `ask_user_question` نداءَ الأداة حتى يعيد مزوّدُ الواجهة النشط جوابَ إنسان. |
| `@deepseek-ai/dsh-tools` | `run_code` | `ctx.tools`،`ctx.ptcRuntime (execution time)`،`ctx.systemPrompt` | `tool/call`،`one tool/ptc-dispatch-start + tool/ptc-dispatch pair per bridged sub-call`،`tool/result` | - | يملكه سجلُّ الأدوات نقلًا محجوزًا خارج طبقات القدرات القابلة للترشيح تحت `mode: ptc` أو `mode: both` (انظر ملاحظة الوكيل عن وضع PTC). وتحت `ptc` هو إسهامُ السجل الوحيد على الشبكة؛ أما سائرُ القدرات المرئية فتُعلَن في قسم SDK مولَّد بلغة بيئة التشغيل المحمَّلة، ويناديها البرنامجُ عبر ارتباطات مجدولة تحت عقد التوازي الأصيل (بدءٌ وسياسةٌ بترتيب التقديم؛ وتتداخل المتونُ الآمنة مع التوازي حتى `maxParallelSubCalls`) تعيد دخولَ مسار الأدوات المحروس كاملًا وتربط كلَّ تنفيذ متداخل بهذه النتيجة الخارجية. |
| `@deepseek-ai/dsh-plan-mode` | `exit_plan_mode` | `ctx.tools`،`ctx.systemPrompt`،`ctx.userQuestions (execution time, opportunistic)` | `tool/call`،`plan/mode inactive on an approved review`،`tool/result` | - | تبقى `exit_plan_mode` في schema الذي يراه النموذجُ ما دام التخطيطُ خاملًا، فلا تضيف الانتقالاتُ اضطرابَ دليل أدوات فوق تغيير سياسة الخطة. ويرفض مسارُ تنفيذها النداءاتِ خارج وضع التخطيط؛ وفي وضع التخطيط تعرض الخطةَ عبر seam أسئلة المستخدم (الموافقةُ أو مواصلةُ التخطيط بملاحظات)، وتسجّل الموافقةُ خمولَ وضع التخطيط عند حدّ الخطوة. |
| `@deepseek-ai/dsh-tool-bash` | `bash` | `ctx.tools`،`ctx.shell`،`ctx.systemPrompt`،`ctx.shellEnv`،`ctx.jobs at call time for run_in_background` | `tool/call`،`tool/result` | - | أداةُ bash هي المستهلكُ الذي يراه النموذجُ لـseam منفّذ bash. ويُسجَّل تشغيلُ `run_in_background` في بيئة `ctx.jobs` العامة ويُجمع أو يُوقف عبر أدوات `job_*` من `@deepseek-ai/dsh-tool-jobs`؛ ويزيل ضبطُ `enableRunInBackground` (وافتراضُه true) المعاملَ كلَّه حين يُعطَّل. |
| `@deepseek-ai/dsh-tool-present` | `present` | `ctx.tools`, `ctx.fs`, `ctx.sessionProjections` | `tool/call`, `deliverables/presented في نجاح نهائي نتيجة بعد`, `tool/result` | - | التسليماتُ تخص الجلسةَ المستدعية؛ وتقدّم ui-deliverables في Web فتحَ ملفات المصدر والبطاقات. |
| `@deepseek-ai/dsh-tool-pwsh` | `pwsh` | `ctx.tools`،`ctx.shell`،`ctx.systemPrompt`،`ctx.shellEnv`،`ctx.jobs at call time for run_in_background` | `tool/call`،`tool/result` | - | أداةُ pwsh هي المستهلكُ بلهجة PowerShell لـseam منفّذ bash في تركيبات Windows (ويسند `ctx.shell` منفّذُ PowerShell مثل `@deepseek-ai/dsh-pwsh-local`)؛ وهي تحاكي أداةَ bash نداءً بنداء ناقصًا ضوابطَ العزل — فتُسجَّل تشغيلاتُ `run_in_background` في بيئة `ctx.jobs` العامة وتُجمع أو تُوقف عبر أدوات `job_*`، وتأتي بيئةُ `DSH_*` المدارة من `@deepseek-ai/dsh-shell-env`. ويعمل كلُّ نداء في عملية جديدة (بلا جلسة PTY دائمة)، بمسارات `C:\...` أصيلة ومتغيّرات `$env:NAME`. |
| `@deepseek-ai/dsh-tool-cordis` | `cordis_inspect_list`, `cordis_inspect_query` | `ctx.tools`, `ctx.cordisInspect` | `tool/call`, `tool/result` | - | يقدّم وضعُ المؤلف أداتَي فحص للقراءة فقط في وقت التشغيل. ويقدّم مشغّلُ Cordis في المضيف سجلَّ الفحص؛ وتشترط استعلاماتُ العميل صفحةً متصلة. وألّف التغييراتِ الدائمة حزمًا وثبّتها بـ`plugin_manager`. |
| `@deepseek-ai/dsh-tool-bash-persistent` | `bash` | `ctx.tools`،`ctx.terminals`،`an owning Agent at execution time` | `tool/call`،`PTY shell state`،`tool/result` | - | أداةُ bash دائمة واحدة معزولة بمالكها؛ ويقدّم تركيبُ النشر خلفيةَ PTY وقد يتجاوز وصفَ البيئة الذي يراه النموذج. |
| `@deepseek-ai/dsh-tool-pwsh-persistent` | `pwsh` | `ctx.tools`،`ctx.terminals`،`an owning Agent at execution time` | `tool/call`،`PTY shell state`،`tool/result` | - | أداةُ pwsh دائمة واحدة معزولة بمالكها، وهي نظيرُ أداة bash الدائمة على Windows؛ ويقدّم تركيبُ النشر خلفيةَ PTY بلهجة pwsh وقد يتجاوز وصفَ البيئة الذي يراه النموذج. |
| `@deepseek-ai/dsh-tool-str-replace-editor` | `str_replace_editor` | `ctx.tools`،`ctx.fs` | `tool/call`،`fs/observed after view presence/absence, edit absence, or successful mutation`،`tool/result` | - | أداةٌ مستقلة للعرض والإنشاء والاستبدال الحرفي الفريد وإدراج الأسطر فوق seam نظام الملفات؛ وهي تتركب مع أي واجهة صدفة أو طرفية. |
| `@deepseek-ai/dsh-tool-fs` | `edit`،`read`،`read_image`،`write` | `ctx.tools`،`ctx.fs`،`ctx.systemPrompt`،`ctx.attachments (image-tool registration)`،`ctx.llm + an image-capable route (image-tool execution)` | `tool/call`،`fs/write-intent or fs/edit-intent for mutations`،`fs/observed after read presence/absence or successful file operation`،`durable attachment (read_image)`،`tool/result` | - | تضيف `@deepseek-ai/dsh-fs-observation-policy` سياسةَ «اقرأ قبل الكتابة أو التحرير» (وهي إضافةُ بوابة أحداث `fs/*` بلا تغيير schema)؛ ويُتوقع من النشر الذي يحمّل هذه الأدواتِ أن يحمّلها أيضًا. ولا تُسجَّل أداةُ الصور بلا `ctx.attachments`؛ وschema لديها مستقلٌّ عن المسار، ويرفض التنفيذُ ما لم يعلن النموذجُ المسلوك بعينه قبولَ مُدخَل الصور. |
| `@deepseek-ai/dsh-tool-fs-search` | `glob`،`grep` | `ctx.tools`،`ctx.subprocess`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | `glob` و`grep` أداتا اكتشاف بلا شروط تطلقان ثنائيَّ ripgrep المحزوم (`@vscode/ripgrep`) عبر `ctx.subprocess` نداءين أماميين عاديين (لا مهامَّ خلفية قط) — بلا تثبيت `rg` على المضيف وبلا طبقة صدفة. ويستعمل الدليلُ `sampleOverCapGlobResults: true`؛ وعلى عمليات النشر أن تختار ذلك السلوكَ صراحةً. وتحفظ النتائجُ المسقوفة القائمةَ المنسَّقة كاملةً عبر خلفية `ctx.spillStore` الاختيارية؛ والمحدِّداتُ المعادة قابلةٌ للقراءة والبحث لاحقًا حين تكشف الخلفيةُ مساراتٍ محلية في عمليات نشر متجاورة. |
| `@deepseek-ai/dsh-tool-terminal` | `terminal_close`،`terminal_list`،`terminal_open`،`terminal_read`،`terminal_send`،`terminal_signal` | `ctx.tools`،`ctx.terminals`،`ctx.systemPrompt`،`ctx.jobs at call time for run_in_background` | `tool/call`،`tool/result` | - | أدواتُ الطرفية الست اختياريةُ التفعيل وتكمّل أدواتِ الصدفة ونظام الملفات ذاتَ اللقطة الواحدة. ويُسجَّل `terminal_send(run_in_background: true)` في `ctx.jobs`؛ أما واجهاتُ TUI وتسلسلاتُ المفاتيح المسمّاة وBEL وتغييرُ الحجم والبدءُ التلقائي والمشاركةُ بين الوكلاء فغائبةٌ عن الـschema. |
| `@deepseek-ai/dsh-tool-goal` | `create_goal`،`get_goal`،`update_goal` | `ctx.tools`،`ctx.agents`،`ctx.goals`،`ctx.systemPrompt`،`a calling Agent in an authorized open turn` | `tool/call`،`goal/change for mutations`،`tool/result` | - | تشترط `create` و`edit` و`pause` و`resume` سلطةَ إنسان مباشرة في الجذر؛ وتقبل `complete` و`blocked` أيضًا جولةَ الهدف الحالية بعينها. والحدُّ الأدنى الافتراضي لـ`blocked` ثلاثُ جولات مقبولة. |
| `@deepseek-ai/dsh-schedule` | `schedule_create`،`schedule_delete`،`schedule_list` | `ctx.tools`،`ctx.sessions`،Session حفظ دائم، لم قدوم إنشاء live أصل Agent | `tool/call`،`schedule/change create or delete`،`tool/result` | - | تُسجَّل داخل نطاقات الوكلاء الجذريين الأحياء المنشأة بعد تحميل إضافة الجدولة الاختيارية وحدها. ويقبل الإصدارُ 1 قيمَ `after_seconds` و`at` المطلقة الصريحة و`every_seconds` ذاتَ المعدل الثابت المحدودة، ويفصح عن التسليم المحلي في الجلسة؛ وتشترط قراءاتُ الإدارة وتغييراتُها حاجزَ حفظ الجلسة المشترك. |
| `@deepseek-ai/dsh-tool-lsp` | `lsp` | `ctx.tools`،`ctx.lsp`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | تُبقي أداةُ lsp انتقاءَ المزوّدين وعملياتِ خوادم اللغة الفرعية خلف `ctx.lsp`، فيبقى schema الذي يراه النموذجُ ثابتًا عبر المزوّدين. وتشترط مزوّدًا مسجَّلًا (مثل `@deepseek-ai/dsh-lsp-stdio`) في وقت التشغيل؛ وبلا واحد يعيد الاستعلامُ خطأَ `LSP_UNAVAILABLE` المبنيَن بدل تغيير الـschema. |
| `@deepseek-ai/dsh-tool-ralph` | `ralph` | `ctx.tools`،`ctx.workflowEngine`،`ctx.subagents`،`ctx.systemPrompt`،`a calling Agent (exec.agent parents every fresh round)` | `tool/call`،`tool/result`،`workflow and child session events during execution` | - | مسارُ عمل أمامي ثابت يبدأ ابنًا مبنيَنًا جديدًا واحدًا لكل جولة؛ ولا ينتقي النموذجُ إلا الهدفَ غيرَ القابل للتغيير وسقفَ جولات اختياريًا. |
| `@deepseek-ai/dsh-tool-skill` | `skill` | `ctx.tools`،`ctx.agents`،`ctx.skills` | `tool/call`،`tool/result`،`user/message replacement catalogs via agent.inject()` | - | - |
| `@deepseek-ai/dsh-tool-session-query` | `session_event_read`،`session_event_search`،`session_event_trace`،`session_search`،`session_trace` | `ctx.tools`،`ctx.systemPrompt`،`ctx.sessionQuery`،`a calling Agent for workspace authority` | `tool/call`،`tool/result` | - | تُخفي الأدواتُ الخمسُ للقراءة فقط مؤشراتِ المزوّدين وتخوّل كلَّ نتيجة من جلسة الوكيل المستدعي غير القابلة للتغيير. والحزمةُ اختياريةُ التفعيل؛ وتركّب التركيباتُ التي تحتاج إلى مهل مفروضة أو خرج مضمَّن محدود سياساتِ المهلة أو الفائض العامة أيضًا. |
| `@deepseek-ai/dsh-tool-subagent` | `list_subagent_models`،`subagent` | `ctx.tools`،`ctx.subagents`،`ctx.systemPrompt`،`لأجل نموذج اكتشاف و الذي اختيار توجيه تحقق ctx.llm` | `tool/call`،`tool/result`،`child session events through the chosen provider` | `subagent`،`subagent_fork` | اسمُ التفويض المسجَّل هو ضبطُ `toolName` عند التحميل (وافتراضُه `subagent`)؛ وschema الافتراضي أعلاه انتقاءُ النماذج فيه معطَّل، بينما يُعرض schema الاكتشاف رفيقًا ثابتًا متاحًا في جلسة مفعَّلة. وتأخذ presets في Web عيّنةً من تفضيل الإضافات لكل جلسة عليا جديدة وتحفظ ذلك القرارَ لجلسات أبنائها؛ ويبقى `subagent_fork` ثابتَ المسار. وتتحكم كلُّ نسخة مستقلةً في قراءتها إعداداتِ انتقاء النماذج وفي سلوك خلفيتها عبر `modelSelectionSettings` و`backgroundMode` و`enableRunInBackground`. |
| `@deepseek-ai/dsh-tool-subagent-control` | `interrupt_agent`،`list_agents`،`send_message` | `ctx.tools`،`ctx.subagents`،`ctx.agents and ctx.sessionProjections (list_agents only)` | `tool/call`،`tool/result`،`child session events through ctx.subagents` | - | أدواتُ التحكم المسمّاة عالميًا فوق الوكلاء الفرعيين الخلفيين القابلين للمتابعة: فنسخُ `tool-subagent` المرتبطة بمزوّدين تسجّل أدواتِ تفويض متمايزة، بينما تسجّل هذه الحزمةُ `send_message` و`interrupt_agent` مرةً واحدة، مع `list_agents` من إضافة `/list-agents` المحمَّلة على حدة (وتستعمل صفوفُ دليلها سجلَّي sessionProjections والوكلاء الحي). |
| `@deepseek-ai/dsh-tool-jobs` | `job_kill`،`job_list`،`job_output` | `ctx.tools`،`ctx.jobs`،`ctx.systemPrompt` | `tool/call`،`tool/result`،`user/message via agent.inject() for background completion notices` | - | متحكمُ مهام الخلفية المحايد تجاه الأصناف: فأوامرُ bash الخلفية وإرسالاتُ PTY والوكلاءُ الفرعيون تُقرأ وتُعدَّد وتُقتل عبر الأدوات الثلاث نفسِها. ويربط تحميلُ الإضافة المتحكمَ الذي يسلّح `ctx.jobs.start()` لدى المنتِجين. |
| `@deepseek-ai/dsh-experimental-tool-agent-team` | `interrupt_agent`،`list_agents`،`send_message`،`spawn_teammate`،`team_task_create`،`team_task_get`،`team_task_list`،`team_task_update`،`wait_agent` | `ctx.tools`،`ctx.systemPrompt`،`ctx.agentTeams`،`an exact live Team member Agent` | `tool/call`،`team/member`،`team/message/queued`،`team/message/delivered`،`team/task`،`tool/result` | - | الأدواتُ التسع كلُّها محدودةٌ بقادة الفرق الضمنيين والزملاء الدائمين. وتُبقي حزمةُ dsh-base المشحونة الحزمةَ معطَّلة؛ وتفعّلها رقعةُ الملف التعريفي الموثَّقة لفرق الوكلاء بينما تعطّل أسماءَ التحكم القديمة في الأبناء القابلين للمتابعة. |
| `@deepseek-ai/dsh-tool-todo` | `todo_write` | `ctx.tools`،`owning Agent session` | `tool/call`،`todo/write`،`tool/result` | - | `todo_write` حالةٌ تملكها الجلسة؛ وتعرض الواجهاتُ أحدثَ حدث `todo/write` قائمةَ تحقق. و`allowParallelInProgress` مشترَطة بلا افتراض، فيذكر الدليلُ اختيارَه: `true`، ووصفُه يدعو إلى عدة بنود `in_progress`. أما النشرُ الذي يختار `false` فيتلقى الأداةَ نفسَها بوصف يطلب مهمةً نشطة واحدة بالضبط. |
| `@deepseek-ai/dsh-tool-workflow` | `workflow` | `ctx.tools`،`ctx.workflowEngine`،`ctx.systemPrompt`،`a calling Agent (exec.agent parents the script children)` | `tool/call`،`tool/result` | - | - |
| `@deepseek-ai/dsh-tool-web` | `web_fetch`،`web_search` | `ctx.tools`،`ctx.web`،`ctx.systemPrompt` | `tool/call`،`tool/result` | - | تُبقي `web_search` و`web_fetch` انتقاءَ المزوّدين خلف `ctx.web` فتبقى schemas التي يراها النموذجُ ثابتةً عبر تبديل الخلفيات. |

<a id="deepseek-aidsh-plugin-manager"></a>

## `@deepseek-ai/dsh-plugin-manager`

### `plugin_manager`

يعدّد الإضافاتِ أو الحزمَ في الملف التعريفي الحالي، أو يفعّلها أو يعطّلها، أو يثبّت حزمةً، أو يزيل حزمةً مثبَّتة. ويشترط كلُّ فعل إذنَ danger-full-access أو موافقةً على هذا النداء. ولا تغيّر الموافقةُ وضعَ أذونات الجلسة. وتؤثر التغييراتُ في كل جلسة في هذا الملف التعريفي. عدِّد أولًا لتحصّل المعرّفاتِ بعينها. وقد ينفّذ تثبيتُ الحزم سكربتاتِ بناء مسموحًا بها. وتطبّق الملفاتُ التعريفية الحية التغييراتِ فورًا؛ أما ملفاتُ الإقلاع فتشترط إعادةَ تشغيل.

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

المصدر: [`packages/boot/plugin-manager/src/tools.ts`](../packages/boot/plugin-manager/src/tools.ts)

<a id="deepseek-aidsh-mcp-resources"></a>

## `@deepseek-ai/dsh-mcp-resources`

### `list_mcp_resource_templates`

يعدّد قوالبَ روابط الموارد ذات المعاملات من خادم MCP.

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

المصدر: [`packages/mcp/mcp-resources/src/tools.ts`](../packages/mcp/mcp-resources/src/tools.ts)

### `list_mcp_resources`

يعدّد المواردَ المتاحة من خادم MCP.

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

المصدر: [`packages/mcp/mcp-resources/src/tools.ts`](../packages/mcp/mcp-resources/src/tools.ts)

### `read_mcp_resource`

يقرأ موردَ MCP برابطه من الخادم المسمّى. استعمل رابطًا معدودًا أو قالبَ مورد موسَّعًا.

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

المصدر: [`packages/mcp/mcp-resources/src/tools.ts`](../packages/mcp/mcp-resources/src/tools.ts)

<a id="deepseek-aidsh-experimental-browser-use-stagehand-native"></a>

## `@deepseek-ai/dsh-experimental-browser-use-stagehand-native`

### `stagehand_act`

ينفّذ فعلَ متصفح واحدًا بلغة طبيعية عبر نموذج Stagehand المضبوط.

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

المصدر: [`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_extract`

يستخرج بياناتِ الصفحة عبر نموذج Stagehand المضبوط وschema JSON اختياري.

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

المصدر: [`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_navigate`

ينقل لسانَ متصفح Stagehand إلى رابط.

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

المصدر: [`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_observe`

يجد أفعالَ المتصفح المطابِقة لتعليمة عبر نموذج Stagehand المضبوط.

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

المصدر: [`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_screenshot`

يلتقط صورةَ شاشة للسان Stagehand للفحص البصري.

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

المصدر: [`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

### `stagehand_tabs`

يعدّد لسانَ متصفح Stagehand أو ينشئه أو يختاره أو يغلقه.

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

المصدر: [`packages/experimental/browser-use-stagehand-native/src/index.ts`](../packages/experimental/browser-use-stagehand-native/src/index.ts)

<a id="deepseek-aidsh-tool-ask-user"></a>

## `@deepseek-ai/dsh-tool-ask-user`

### `ask_user_question`

اسأل المستخدمَ سؤالًا موجزًا حين تحتاج إلى تأكيد أو اختيار أو معلومة ناقصة قبل المضي. أرسل سؤالًا واحدًا أو أكثر، ولكلٍّ معرّفٌ ثابت يُردّ مع الجواب.

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

المصدر: [`packages/interaction/tool-ask-user/src/index.ts`](../packages/interaction/tool-ask-user/src/index.ts)

توقف `ask_user_question` نداءَ الأداة حتى يعيد مزوّدُ الواجهة النشط جوابَ إنسان.

<a id="deepseek-aidsh-tools"></a>

## `@deepseek-ai/dsh-tools`

### `run_code`

ينفّذ برنامجَ TypeScript في مقابل الأدوات المتاحة. ويأخذ وسيطين مشترَطين: `code`، وهو **متنُ** دالة لاتزامنية (بنحو قابل للمحو فقط؛ و`await` و`return` في المستوى الأعلى يعملان)، و`description`، وهو ملخصٌ قصير لما يفعله البرنامج. ونادِ الأدواتِ بالصيغة `await tools.name(args)` بحسب التصريحات في مطالبة النظام. ولا يكون خرجُ البرنامج إلا ما تطبعه أو تعيده — فانتقِه بعناية. وتُرفق نتائجُ الأدوات الفرعية الحاملةُ صورًا بعد التشغيل.

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

المصدر: [`packages/core/tools/src/ptc.ts`](../packages/core/tools/src/ptc.ts)

يملكه سجلُّ الأدوات نقلًا محجوزًا خارج طبقات القدرات القابلة للترشيح تحت `mode: ptc` أو `mode: both` (انظر ملاحظة الوكيل عن وضع PTC). وتحت `ptc` هو إسهامُ السجل الوحيد على الشبكة؛ أما سائرُ القدرات المرئية فتُعلَن في قسم SDK مولَّد بلغة بيئة التشغيل المحمَّلة، ويناديها البرنامجُ عبر ارتباطات مجدولة تحت عقد التوازي الأصيل (بدءٌ وسياسةٌ بترتيب التقديم؛ وتتداخل المتونُ الآمنة مع التوازي حتى `maxParallelSubCalls`) تعيد دخولَ مسار الأدوات المحروس كاملًا وتربط كلَّ تنفيذ متداخل بهذه النتيجة الخارجية.

<a id="deepseek-aidsh-plan-mode"></a>

## `@deepseek-ai/dsh-plan-mode`

### `exit_plan_mode`

استعملها في وضع التخطيط وحده. اعرض خطتَك لمراجعة المستخدم، واخرج من وضع التخطيط عند الموافقة. وأرسل الخطةَ **كاملةً** بصيغة markdown، بادئًا بعنوان `#` يسمّيها. وللمستخدم أن يوافق (فتنفّذ الخطةَ من خطوتك التالية) أو أن يواصل التخطيط — وتعود ملاحظاتُه في نتيجة الأداة؛ فراجِع واعرض ثانيةً.

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

المصدر: [`packages/plan/plan-mode/src/index.ts`](../packages/plan/plan-mode/src/index.ts)

تبقى `exit_plan_mode` في schema الذي يراه النموذجُ ما دام التخطيطُ خاملًا، فلا تضيف الانتقالاتُ اضطرابَ دليل أدوات فوق تغيير سياسة الخطة. ويرفض مسارُ تنفيذها النداءاتِ خارج وضع التخطيط؛ وفي وضع التخطيط تعرض الخطةَ عبر seam أسئلة المستخدم (الموافقةُ أو مواصلةُ التخطيط بملاحظات)، وتسجّل الموافقةُ خمولَ وضع التخطيط عند حدّ الخطوة.

<a id="deepseek-aidsh-tool-bash"></a>

## `@deepseek-ai/dsh-tool-bash`

### `bash`

ينفّذ أمرَ bash (`bash -c`) ويعيد stdout وstderr لديه. ويعمل كلُّ نداء في صدفة جديدة: فلا حالةَ (لا دليلَ عمل ولا متغيّرات ولا دوال) تبقى بين النداءات — فمرّر `workdir` بدل استعمال `cd`. ويُبلَّغ عن الخروج غير الصفري بالصيغة `[exit code: N]`. وتُكشف حقائقُ بيئة الحزام الحالية عبر متغيّرات `$DSH_*` المدارة؛ ففحصها عند الحاجة. وقد تعمل الأوامرُ تحت عزل ملفات؛ ويُبلَّغ عن عملية ملفات محجوبة بالصيغة `[sandbox: file access denied under <mode> mode]` — وهو منعُ سياسة لا خللٌ في الأمر؛ فلا تعِد المحاولةَ بطريق آخر. ويُقتطع الخرجُ الطويل إلى ذيله؛ ويُحفظ الخرجُ كاملًا في ملف يُبلَّغ عن مساره حين يتوفر. واضبط `run_in_background: true` للأوامر الطويلة: فيعيد النداءُ معرّفَ مهمة فورًا؛ واقرأ خرجَها بـ`job_output` وأوقِفها بـ`job_kill`.

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

المصدر: [`packages/shell/tool-bash/src/index.ts`](../packages/shell/tool-bash/src/index.ts)

أداةُ bash هي المستهلكُ الذي يراه النموذجُ لـseam منفّذ bash. ويُسجَّل تشغيلُ `run_in_background` في بيئة `ctx.jobs` العامة ويُجمع أو يُوقف عبر أدوات `job_*` من `@deepseek-ai/dsh-tool-jobs`؛ ويزيل ضبطُ `enableRunInBackground` (وافتراضُه true) المعاملَ كلَّه حين يُعطَّل.

<a id="deepseek-aidsh-tool-present"></a>

## `@deepseek-ai/dsh-tool-present`

### `present`

يعلن ملفاتٍ موجودة يمكن بلوغُها عبر نظام ملفات الجلسة تسليماتٍ نهائية. وحين يكون ملفٌّ تنشئه أو تحدّثه خرجًا طلب المستخدمُ تلقّيه، فعليك نداءُ `present` بعد كتابته وقبل ردّك النهائي، بما في ذلك الملفاتُ المنشأة عبر Bash أو تنفيذ الشفرة. وذكرُ مساره في ردّك لا يغني عن هذا النداء. ويجب أن تكون الملفاتُ موجودةً سلفًا. ويفتح المستخدمُ ملفاتِ المصدر الحالية؛ ولا تُنسخ محتوياتُها ولا تُحفظ.

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

المصدر: [`packages/deliverables/tool-present/src/index.ts`](../packages/deliverables/tool-present/src/index.ts)

التسليماتُ تخص الجلسةَ المستدعية؛ وتقدّم ui-deliverables في Web فتحَ ملفات المصدر والبطاقات.

<a id="deepseek-aidsh-tool-pwsh"></a>

## `@deepseek-ai/dsh-tool-pwsh`

### `pwsh`

ينفّذ أمرَ PowerShell (`pwsh -Command`) ويعيد stdout وstderr لديه. ويعمل كلُّ نداء في عملية pwsh جديدة: فلا حالةَ (لا دليلَ عمل ولا متغيّرات ولا دوال) تبقى بين النداءات — فمرّر `workdir` بدل استعمال `cd`. وتستعمل المساراتُ صيغةَ Windows الأصيلة (`C:\...`)؛ واقرأ متغيّراتِ البيئة بـ`$env:NAME`. ويُبلَّغ عن الخروج غير الصفري بالصيغة `[exit code: N]`. وتُكشف حقائقُ بيئة الحزام الحالية عبر متغيّرات `$env:DSH_*` المدارة؛ ففحصها عند الحاجة. وقد تعمل الأوامرُ تحت عزل ملفات؛ ويُبلَّغ عن عملية ملفات محجوبة بالصيغة `[sandbox: file access denied under <mode> mode]` — وهو منعُ سياسة لا خللٌ في الأمر؛ فلا تعِد المحاولةَ بطريق آخر. ويُقتطع الخرجُ الطويل إلى ذيله؛ ويُحفظ الخرجُ كاملًا في ملف يُبلَّغ عن مساره حين يتوفر. وعلى Windows يستقر أمرٌ قُتل قسرًا بالصيغة `[exit code: 1]` بلا واسم إشارة — فعامله انقطاعًا لا فشلَ أمر. واضبط `run_in_background: true` للأوامر الطويلة: فيعيد النداءُ معرّفَ مهمة فورًا؛ واقرأ خرجَها بـ`job_output` وأوقِفها بـ`job_kill`.

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

المصدر: [`packages/shell/tool-pwsh/src/index.ts`](../packages/shell/tool-pwsh/src/index.ts)

أداةُ pwsh هي المستهلكُ بلهجة PowerShell لـseam منفّذ bash في تركيبات Windows (ويسند `ctx.shell` منفّذُ PowerShell مثل `@deepseek-ai/dsh-pwsh-local`)؛ وهي تحاكي أداةَ bash نداءً بنداء ناقصًا ضوابطَ العزل — فتُسجَّل تشغيلاتُ `run_in_background` في بيئة `ctx.jobs` العامة وتُجمع أو تُوقف عبر أدوات `job_*`، وتأتي بيئةُ `DSH_*` المدارة من `@deepseek-ai/dsh-shell-env`. ويعمل كلُّ نداء في عملية جديدة (بلا جلسة PTY دائمة)، بمسارات `C:\...` أصيلة ومتغيّرات `$env:NAME`.

<a id="deepseek-aidsh-tool-cordis"></a>

## `@deepseek-ai/dsh-tool-cordis`

### `cordis_inspect_list`

يعدّد كلَّ مزوّد فحص Cordis يعرفه المضيفُ حاليًا، ومنهم مزوّدو المضيف المحليون وأحدثُ البيانات المتزامنة من العميل. ويحتوي كلُّ مدخل منصتَه وغرضَه وطرائقَه للقراءة فقط وschemas مُدخَله ومُخرَجه. نادِ هذه الأداةَ قبل كتابة إضافة أو ضبطها، ثم اختر المزوّدَ والطريقةَ لـ`cordis_inspect_query` من نتيجتها. ولا تخمّن الأسماءَ ولا تعامل طريقةَ فحص بوصفها خدمةَ عمل تستطيع شفرةُ الإضافة نداءَها.

```json
{
  "type": "object",
  "properties": {}
}
```

المصدر: [`packages/extensions/tool-cordis/src/index.ts`](../packages/extensions/tool-cordis/src/index.ts)

### `cordis_inspect_query`

يشغّل استعلامًا للقراءة فقط أعلنه مزوّدُ فحص صراحةً. ويجب أن تأتي `platform` و`provider` و`method` من `cordis_inspect_list`، وأن يستوفي `input` schema تلك الطريقة. استعمل هذه الأداةَ قبل كتابة شفرة إضافة لتقرأ طرائقَ الخدمات بعينها، أو أوضاعَ الأحداث، أو توقيعاتِ المدمجات، أو schemas الأدوات، أو رموزَ السمات، أو أشجارَ الخانات الحية وخصائصها. وتعمل استعلاماتُ المضيف محليًّا. أما استعلامُ العميل فينتظر أولَ استجابة صفحة صالحة ويبقى معلَّقًا حتى تجيب صفحةٌ أو تُلغى الأداة. ولا تستطيع هذه الأداةُ استدعاءَ طرائق خدمات العمل ولا تغييرَ بيئة التشغيل. ولـ`Service.listService` و`Event.listEvents`، استعلم بلا مُدخَل لتتصفح دليلَ التوقيعات المضغوط، ثم استعلم عن الخدمة أو الحدث بعينه لتحصّل عقدَه المبنيَن وأنواعَه المشار إليها. ولـ`Slots.listSubTree`، استعلم بلا جذر لتتصفح الشجرةَ المضغوطة، ثم استعلم عن جذر خانة بعينه لتحصّل عقدَ تسجيله كاملًا وخصائصَه؛ ويعيد جذرُ مصنع بعينه هويتَه ونطاقَه ومسجّله.

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

المصدر: [`packages/extensions/tool-cordis/src/index.ts`](../packages/extensions/tool-cordis/src/index.ts)

يقدّم وضعُ المؤلف أداتَي فحص للقراءة فقط في وقت التشغيل. ويقدّم مشغّلُ Cordis في المضيف سجلَّ الفحص؛ وتشترط استعلاماتُ العميل صفحةً متصلة. وألّف التغييراتِ الدائمة حزمًا وثبّتها بـ`plugin_manager`.

<a id="deepseek-aidsh-tool-bash-persistent"></a>

## `@deepseek-ai/dsh-tool-bash-persistent`

### `bash`

يشغّل الأوامرَ في صدفة bash دائمة. وتبقى الحالةُ، ومنها دليلُ العمل الحالي ومتغيّراتُ البيئة المصدَّرة، عبر النداءات لهذا الوكيل.

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

المصدر: [`packages/shell/tool-bash-persistent/src/index.ts`](../packages/shell/tool-bash-persistent/src/index.ts)

أداةُ bash دائمة واحدة معزولة بمالكها؛ ويقدّم تركيبُ النشر خلفيةَ PTY وقد يتجاوز وصفَ البيئة الذي يراه النموذج.

<a id="deepseek-aidsh-tool-pwsh-persistent"></a>

## `@deepseek-ai/dsh-tool-pwsh-persistent`

### `pwsh`

يشغّل الأوامرَ في صدفة PowerShell دائمة. وتبقى الحالةُ، ومنها دليلُ العمل الحالي ومتغيّراتُ البيئة المصدَّرة، عبر النداءات لهذا الوكيل.

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

المصدر: [`packages/shell/tool-pwsh-persistent/src/index.ts`](../packages/shell/tool-pwsh-persistent/src/index.ts)

أداةُ pwsh دائمة واحدة معزولة بمالكها، وهي نظيرُ أداة bash الدائمة على Windows؛ ويقدّم تركيبُ النشر خلفيةَ PTY بلهجة pwsh وقد يتجاوز وصفَ البيئة الذي يراه النموذج.

<a id="deepseek-aidsh-tool-str-replace-editor"></a>

## `@deepseek-ai/dsh-tool-str-replace-editor`

### `str_replace_editor`

أداةُ تحرير مخصصة لعرض الملفات وإنشائها وتحريرها

* تبقى الحالةُ عبر نداءات الأوامر والمحادثات مع المستخدم
* إن كان `path` ملفًّا، عرض `view` نتيجةَ تطبيق `cat -n`. وإن كان دليلًا، عدّد `view` الملفاتِ والأدلةَ غيرَ المخفية حتى مستويين
* لا يمكن استعمالُ الأمر `create` إن كان `path` المحدد موجودًا سلفًا ملفًّا
* إن ولّد `command` خرجًا طويلًا، اقتُطع ووُسم بـ`<response clipped>`
* يُعامل النائبُ `null` لمعامل لا يستعمله الأمرُ المختار كأنه مُغفَل. وتبقى المعاملاتُ المشترَطة محتاجةً إلى قيم؛ فأغفِل `str_replace.new_str` بدل ضبطها على `null` عند حذف مطابقة

ملاحظات على استعمال الأمر `str_replace`:

* ينبغي أن يطابق المعاملُ `old_str` **بالضبط** سطرًا أو أكثر متتاليًا من الملف الأصلي. وانتبه للفراغات!
* إن لم يكن المعاملُ `old_str` فريدًا في الملف، لم يُنفَّذ الاستبدال. فاحرص على تضمين سياق كافٍ في `old_str` ليصير فريدًا
* ينبغي أن يحتوي المعاملُ `new_str` الأسطرَ المحرَّرة التي تحلّ محلَّ `old_str`

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

المصدر: [`packages/fs/tool-str-replace-editor/src/index.ts`](../packages/fs/tool-str-replace-editor/src/index.ts)

أداةٌ مستقلة للعرض والإنشاء والاستبدال الحرفي الفريد وإدراج الأسطر فوق seam نظام الملفات؛ وهي تتركب مع أي واجهة صدفة أو طرفية.

<a id="deepseek-aidsh-tool-fs"></a>

## `@deepseek-ai/dsh-tool-fs`

### `edit`

يحرّر ملفَّ نص UTF-8 موجودًا باستبدال نص حرفي.

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

المصدر: [`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

### `read`

يقرأ ملفَّ نص UTF-8 ويعيد محتوًى مرقَّم الأسطر.

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

المصدر: [`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

### `read_image`

يقرأ ملفَّ PNG أو JPEG أو WebP أو GIF ويعيد الصورةَ نفسَها. ويُقبل مسارٌ بلا امتداد؛ فالصيغةُ تُكشف من محتوى الملف، فتُمرَّر مساراتُ المرفقات الموحَّدة مباشرةً بلا نسخ ولا إعادة تسمية. ويتحقق الحزامُ من الصور المدعومة الكبيرة ويصغّرها قبل طلب النموذج التالي، فاستعمل هذه الأداةَ مباشرةً بدل تثبيت مكتبات صور أو إنشاء مصغَّرات لمجرد فحص صورة. ويمكن قراءةُ ملفات مستقلة على التوازي في دفعات صغيرة. ويشترط أن يقبل النموذجُ الحالي مُدخَلَ صور.

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

المصدر: [`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

### `write`

ينشئ ملفَّ نص UTF-8 أو يستبدله كاملًا.

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

المصدر: [`packages/fs/tool-fs/src/index.ts`](../packages/fs/tool-fs/src/index.ts)

تضيف `@deepseek-ai/dsh-fs-observation-policy` سياسةَ «اقرأ قبل الكتابة أو التحرير» (وهي إضافةُ بوابة أحداث `fs/*` بلا تغيير schema)؛ ويُتوقع من النشر الذي يحمّل هذه الأدواتِ أن يحمّلها أيضًا. ولا تُسجَّل أداةُ الصور بلا `ctx.attachments`؛ وschema لديها مستقلٌّ عن المسار، ويرفض التنفيذُ ما لم يعلن النموذجُ المسلوك بعينه قبولَ مُدخَل الصور.

<a id="deepseek-aidsh-tool-fs-search"></a>

## `@deepseek-ai/dsh-tool-fs-search`

### `glob`

يجد الملفاتِ التي تطابق مساراتُها نمطَ glob. ويعيد مساراتِ الملفات المطابِقة — لا الأدلةَ قط — ومنها الملفاتُ المخفية والمتجاهَلة (وتُستبعد أدلةُ بيانات أنظمة التحكم بالإصدارات). ويعود ما يصل إلى 100 مسار بترتيب وقت التعديل؛ أما النتيجةُ الأكبر فتعيد 100 مسار أُخذت عيّنةً عبر المداخل العليا، وتقول ذلك، وتبلّغ أين حُفظت القائمةُ المرتَّبة كاملةً. ولا تعدّد هذه الأداةُ مداخلَ الأدلة.

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

المصدر: [`packages/fs/tool-fs-search/src/index.ts`](../packages/fs/tool-fs-search/src/index.ts)

### `grep`

يبحث في محتويات الملفات بتعبير ripgrep النمطي. ويعيد الأسطرَ المطابِقة بأرقامها، مجمَّعةً بالملف. ويعيد أولَ 250 مطابقة مضمَّنةً؛ وتبلّغ النتيجةُ المسقوفة أين حُفظت قائمةُ المطابقات كاملةً. واستعمل `read` على ملف مطابِق للسياق المحيط.

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

المصدر: [`packages/fs/tool-fs-search/src/index.ts`](../packages/fs/tool-fs-search/src/index.ts)

`glob` و`grep` أداتا اكتشاف بلا شروط تطلقان ثنائيَّ ripgrep المحزوم (`@vscode/ripgrep`) عبر `ctx.subprocess` نداءين أماميين عاديين (لا مهامَّ خلفية قط) — بلا تثبيت `rg` على المضيف وبلا طبقة صدفة. ويستعمل الدليلُ `sampleOverCapGlobResults: true`؛ وعلى عمليات النشر أن تختار ذلك السلوكَ صراحةً. وتحفظ النتائجُ المسقوفة القائمةَ المنسَّقة كاملةً عبر خلفية `ctx.spillStore` الاختيارية؛ والمحدِّداتُ المعادة قابلةٌ للقراءة والبحث لاحقًا حين تكشف الخلفيةُ مساراتٍ محلية في عمليات نشر متجاورة.

<a id="deepseek-aidsh-tool-terminal"></a>

## `@deepseek-ai/dsh-tool-terminal`

### `terminal_close`

يغلق طرفيةً دائمة واحدة وينتظر حتى تزول شجرةُ العمليات المملوكة الملتقَطة لديها.

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

المصدر: [`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_list`

يعدّد جلساتِ الطرفية الدائمة التي يملكها الوكيلُ الحالي.

```json
{
  "type": "object",
  "properties": {}
}
```

المصدر: [`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_open`

ينشئ جلسةَ طرفية دائمة معزولة بمالكها من نوع خلفية مسجَّل. استعملها لحالة صدفة أو REPL يجب أن تبقى عبر نداءات الأدوات.

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

المصدر: [`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_read`

يقرأ صفحةً محدودة من الخرج المحفوظ في طرفية دائمة بلا إرسال مُدخَل.

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

المصدر: [`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_send`

يرسل نصًّا إلى طرفية دائمة. ويُقدَّم Enter افتراضيًا وينتظر النداءُ مطالبةً أو انتظارَ stdin أو صمتَ خرج أو انتهاءَ مهلة أو خروجَ الجلسة. ويعيد وضعُ الخلفية معرّفَ مهمة لـ`job_output` و`job_kill`.

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

المصدر: [`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

### `terminal_signal`

يرسل إشارةً مسموحًا بها إلى مجموعة العمليات الأمامية الحالية في طرفية دائمة.

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

المصدر: [`packages/terminal/tool-terminal/src/index.ts`](../packages/terminal/tool-terminal/src/index.ts)

أدواتُ الطرفية الست اختياريةُ التفعيل وتكمّل أدواتِ الصدفة ونظام الملفات ذاتَ اللقطة الواحدة. ويُسجَّل `terminal_send(run_in_background: true)` في `ctx.jobs`؛ أما واجهاتُ TUI وتسلسلاتُ المفاتيح المسمّاة وBEL وتغييرُ الحجم والبدءُ التلقائي والمشاركةُ بين الوكلاء فغائبةٌ عن الـschema.

<a id="deepseek-aidsh-tool-goal"></a>

## `@deepseek-ai/dsh-tool-goal`

### `create_goal`

ينشئ هدفَ إنجاز محفوظًا واحدًا داخل الجلسة نفسِها حين يكون طلبُ الإنسان المباشر الحالي هدفًا طويلَ الأمد ينبغي أن يستمر عبر جولات أهداف مستقلة. ولك أن تستنتج تلك النيةَ بلا أن يقول المستخدمُ «أنشئ هدفًا». ولا تستعملها للعمل التافه ذي الجولة الواحدة. ويرفض التنفيذُ سلطةَ غير البشر وسلطةَ الوكلاء الفرعيين.

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

المصدر: [`packages/goal/tool-goal/src/index.ts`](../packages/goal/tool-goal/src/index.ts)

### `get_goal`

يقرأ الهدفَ الحالي داخل الجلسة، ومعه معرّفُه ومراجعتُه بعينهما، وهدفُه، وطورُه، وجولاتُ الاستمرار المكتملة، وحدُّ الجولات، وسببُ الإعاقة حين يوجد، وهل سُلّحت متابعةٌ أخرى. نادِ هذه قبل تحديث هدف.

```json
{
  "type": "object",
  "properties": {}
}
```

المصدر: [`packages/goal/tool-goal/src/index.ts`](../packages/goal/tool-goal/src/index.ts)

### `update_goal`

يحدّث مراجعةَ الهدف الحالية بعينها. وتشترط `edit` و`pause` و`resume` طلبَ إنسان مباشرًا في المستوى الأعلى. وأثناء متابعة تلقائية للهدف الحالي، يُسمح أيضًا بـ`complete` و`blocked`. وتُرفض `blocked` قبل بلوغ أدنى عدد جولات مضبوط؛ ويبقى النموذجُ مسؤولًا عن الحكم بأن الشرطَ نفسَه استمر عبر تلك الجولات وعليه شرحُ ذلك في `blocked_reason`.

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

المصدر: [`packages/goal/tool-goal/src/index.ts`](../packages/goal/tool-goal/src/index.ts)

تشترط `create` و`edit` و`pause` و`resume` سلطةَ إنسان مباشرة في الجذر؛ وتقبل `complete` و`blocked` أيضًا جولةَ الهدف الحالية بعينها. والحدُّ الأدنى الافتراضي لـ`blocked` ثلاثُ جولات مقبولة.

<a id="deepseek-aidsh-schedule"></a>

## `@deepseek-ai/dsh-schedule`

### `schedule_create`

ينشئ تذكيرًا واحدًا في الجلسة الحالية. قدّم مطالبةً غيرَ فارغة ومُنتقيًا واحدًا بالضبط: تأخيرَ `after_seconds` عددًا صحيحًا موجبًا آمنًا، أو `at` بصيغة تاريخ ووقت بفرق توقيت صارم أو كائنِ تاريخ ووقت محلي، أو `every_seconds` عددًا صحيحًا آمنًا لا يقل عن 300. وتبقى التذكيراتُ ذاتُ المعدل الثابت مرساةً إلى وقت الإنشاء، وتتخطى المناسباتِ الفائتة، وتجمع مناسبةً أحدث واحدة لكل قاعدة متأخرة. والتسليمُ محليٌّ في الجلسة: فيعمل التذكيرُ في وقته ما دامت هذه الجلسةُ حية، وإلا صار متأخرًا حتى تُستأنف الجلسة.

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

المصدر: [`packages/schedule/schedule/src/tools.ts`](../packages/schedule/schedule/src/tools.ts)

### `schedule_delete`

يحذف تذكيرًا نشطًا واحدًا في الجلسة الحالية بالمعرّف بعينه الذي أعاده `schedule_create` أو `schedule_list`. والمعرّفاتُ المجهولة أو المنتهية سلفًا تعيد `deleted` بقيمة false.

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

المصدر: [`packages/schedule/schedule/src/tools.ts`](../packages/schedule/schedule/src/tools.ts)

### `schedule_list`

يعدّد كلَّ تذكير نشط في الجلسة الحالية بترتيب الإنشاء، ومعه معرّفُه بعينه، وهدفُه بالتوقيت العالمي، وحالتُه مجدولًا أو متأخرًا، ووضعُ تسليمه المحلي في الجلسة.

```json
{
  "type": "object",
  "properties": {}
}
```

المصدر: [`packages/schedule/schedule/src/tools.ts`](../packages/schedule/schedule/src/tools.ts)

تُسجَّل داخل نطاقات الوكلاء الجذريين الأحياء المنشأة بعد تحميل إضافة الجدولة الاختيارية وحدها. ويقبل الإصدارُ 1 قيمَ `after_seconds` و`at` المطلقة الصريحة و`every_seconds` ذاتَ المعدل الثابت المحدودة، ويفصح عن التسليم المحلي في الجلسة؛ وتشترط قراءاتُ الإدارة وتغييراتُها حاجزَ حفظ الجلسة المشترك.

<a id="deepseek-aidsh-tool-lsp"></a>

## `@deepseek-ai/dsh-tool-lsp`

### `lsp`

يستعلم خادمَ لغة لتنقّل دقيق في الشفرة. و`operation` واحدةٌ من `goToDefinition` و`findReferences` و`goToImplementation` و`hover`. و`line` و`character` إحداثيا مؤشر بترميز UTF-16 يبدآن من واحد. ويشمل `findReferences` التصريحَ.

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

المصدر: [`packages/lsp/tool-lsp/src/index.ts`](../packages/lsp/tool-lsp/src/index.ts)

تُبقي أداةُ lsp انتقاءَ المزوّدين وعملياتِ خوادم اللغة الفرعية خلف `ctx.lsp`، فيبقى schema الذي يراه النموذجُ ثابتًا عبر المزوّدين. وتشترط مزوّدًا مسجَّلًا (مثل `@deepseek-ai/dsh-lsp-stdio`) في وقت التشغيل؛ وبلا واحد يعيد الاستعلامُ خطأَ `LSP_UNAVAILABLE` المبنيَن بدل تغيير الـschema.

<a id="deepseek-aidsh-tool-ralph"></a>

## `@deepseek-ai/dsh-tool-ralph`

### `ralph`

يشغّل حلقةَ Ralph أمامية بوكيل جديد نحو هدف واحد غير قابل للتغيير. استعملها فقط حين يطلب الإنسانُ المباشر Ralph أو التكرارَ بوكيل جديد صراحةً. وتفتح كلُّ جولة ابنًا جديدًا بلا محادثة أب ولا جلسة ابن سابقة؛ ومساحةُ العمل المشتركة هي الذاكرةُ طويلة الأمد، ولا يعبر بين الجولات إلا تقريرٌ مبنيَن محدود. ويعود النداءُ حين يبلّغ عاملٌ عن اكتمال أو عن معيق ملموس، أو عند حدّ الجولات. أما العملُ المعتاد الطويل داخل الجلسة نفسِها فيخص أدواتِ الأهداف.

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

المصدر: [`packages/workflow/tool-ralph/src/index.ts`](../packages/workflow/tool-ralph/src/index.ts)

مسارُ عمل أمامي ثابت يبدأ ابنًا مبنيَنًا جديدًا واحدًا لكل جولة؛ ولا ينتقي النموذجُ إلا الهدفَ غيرَ القابل للتغيير وسقفَ جولات اختياريًا.

<a id="deepseek-aidsh-tool-skill"></a>

## `@deepseek-ai/dsh-tool-skill`

### `skill`

يحمّل تعليماتِ مهارة متاحة كاملةً. نادِ هذه باسم المهارة بعينه من دليل مهارات الجلسة قبل العمل على مهمة تسمّي تلك المهارةَ أو تطابقها بوضوح.

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

المصدر: [`packages/skill/tool-skill/src/index.ts`](../packages/skill/tool-skill/src/index.ts)

<a id="deepseek-aidsh-tool-session-query"></a>

## `@deepseek-ai/dsh-tool-session-query`

### `session_event_read`

يقرأ حدثًا واحدًا كاملًا غيرَ مختصر وملخصاتٍ اختيارية لأحداث خام مجاورة من جلسة مخوَّلة.

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

المصدر: [`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_event_search`

يبحث في الأحداث السابقة في جلسة مخوَّلة واحدة؛ وتستبعد الجلسةُ الحالية الخطوةَ التي تجري هذا النداء.

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

المصدر: [`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_event_trace`

يقرأ كلَّ استبدال مباشر وكلَّ علاقة بحدث مصدر مذكور لحدث واحد في جلسة مخوَّلة.

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

المصدر: [`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_search`

يبحث في الجلسات السابقة في مساحة عمل المستدعي ويعيد أقوى حدث مطابِق من كل جلسة.

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

المصدر: [`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

### `session_trace`

يقرأ نسبَ الجلسات المخوَّل حول جلسة واحدة، ومعه علاقاتُ الأسلاف والأحفاد المرئية كاملةً.

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

المصدر: [`packages/session-query/tool-session-query/src/index.ts`](../packages/session-query/tool-session-query/src/index.ts)

تُخفي الأدواتُ الخمسُ للقراءة فقط مؤشراتِ المزوّدين وتخوّل كلَّ نتيجة من جلسة الوكيل المستدعي غير القابلة للتغيير. والحزمةُ اختياريةُ التفعيل؛ وتركّب التركيباتُ التي تحتاج إلى مهل مفروضة أو خرج مضمَّن محدود سياساتِ المهلة أو الفائض العامة أيضًا.

<a id="deepseek-aidsh-tool-subagent"></a>

## `@deepseek-ai/dsh-tool-subagent`

### `list_subagent_models`

يكتشف مساراتِ LLM للوكلاء الفرعيين بلا تغيير الوكيل الحالي. نادِه بلا وسائط لتعداد المزوّدين المسجَّلين، أو بـ`provider` لتعداد نماذجه المعلَنة، أو بـ`provider` و`model` لفحص ذلك النموذج بعينه وجهودِ استدلاله. وعضويةُ الدليل إرشادية: فقد يقبل مهايئٌ معرّفَ نموذج غيرَ معدود. واستعمل المعرّفاتِ المعادة في حقول `provider` و`model` و`reasoning_effort` لدى أداة تفويض.

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

المصدر: [`packages/subagent/tool-subagent/src/list-models.ts`](../packages/subagent/tool-subagent/src/list-models.ts)

### `subagent`

يفوّض مهمةً قائمة بذاتها إلى وكيل فرعي (وهو وكيلٌ منفصل يعمل في سياقه) لينقل عنك عملًا مركَّزًا مستقلًّا — بحثًا أو تنفيذًا محدودًا أو تحليلًا — فلا يستهلك سياقَ هذه المحادثة. ويعيد الوكيلُ الفرعي نتيجتَه لا خطواتِه الوسيطة. وأعطِه مطالبةً كاملة قائمة بذاتها: فهو لا يرى هذه المحادثة. وينتظر هذا النداءُ النتيجةَ افتراضيًا. واضبط `run_in_background: true` ليعيد معرّفَ مهمة؛ واجمعه بـ`job_output` وأوقِفه بـ`job_kill`.

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

المصدر: [`packages/subagent/tool-subagent/src/index.ts`](../packages/subagent/tool-subagent/src/index.ts)

اسمُ التفويض المسجَّل هو ضبطُ `toolName` عند التحميل (وافتراضُه `subagent`)؛ وschema الافتراضي أعلاه انتقاءُ النماذج فيه معطَّل، بينما يُعرض schema الاكتشاف رفيقًا ثابتًا متاحًا في جلسة مفعَّلة. وتأخذ presets في Web عيّنةً من تفضيل الإضافات لكل جلسة عليا جديدة وتحفظ ذلك القرارَ لجلسات أبنائها؛ ويبقى `subagent_fork` ثابتَ المسار. وتتحكم كلُّ نسخة مستقلةً في قراءتها إعداداتِ انتقاء النماذج وفي سلوك خلفيتها عبر `modelSelectionSettings` و`backgroundMode` و`enableRunInBackground`.

<a id="deepseek-aidsh-tool-subagent-control"></a>

## `@deepseek-ai/dsh-tool-subagent-control`

### `interrupt_agent`

يطلب إلغاءَ الجولة الحالية لوكيل خلفي بمعرّف وكيله. وقد يكون الهدفُ ابنَك المباشر أو وكيلًا أعمق أُنشئ تحتك. ولا تتوقف إلا الجولةُ الحالية: فالرسائلُ المصطفّة للوكيل سلفًا تبقى مركونةً حتى `send_message` لاحق، والوكلاءُ الذين بدأهم يواصلون العمل، ويبقى الوكيلُ نفسُه متاحًا للمتابعات. ويعود هذا النداءُ حالما يُقبل طلبُ الإيقاف، فقد يواصل الهدفُ العملَ لبرهة؛ ومقاطعةُ وكيل انتهى سلفًا عمليةٌ مقبولة بلا أثر.

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

المصدر: [`packages/subagent/tool-subagent-control/src/index.ts`](../packages/subagent/tool-subagent-control/src/index.ts)

### `list_agents`

يعدّد وكلاءَك الفرعيين الخلفيين القابلين للمتابعة بمعرّفهم الدائم وتسميتهم. استعمله لتتذكر من بدأتَ منهم، لا لتستطلع الاكتمالَ — فأنت تُخبَر حين ينتهي أحدُهم. وتأتي الحالةُ من السجل الحي: فـ`running` تعني أن الوكيلَ يعمل الآن، و`idle` تعني أنه محمَّل لكنه بين الجولات (وقد ينتظر وكلاءَ بدأهم)، و`ready` تعني أنه موجودٌ في التخزين وحده — قابلٌ للاستئناف لا نهائيٌّ ولا نتيجةٌ تنتظر الجمع؛ ويوجّه `send_message` ابنًا عاملًا عند أقرب حدّ خطوة أو يبدأ جولةً لابن خامل أو جاهز، ويبقى الابنُ المباشر مرشحًا لـ`send_message` في كل حالة. واللقطةُ ليست وعدَ تسليم — فـ`send_message` يجري الفحصَ المرجعي وقد يفشل مع ذلك. ويُبلَّغ عن الأبناء الذين تعذّرت قراءتُهم تشخيصاتٍ بدل إسقاطهم صامتًا. ويمشي النطاقُ `descendants` في الشجرة كلها تحتك بترتيب سابق ثابت، ويوسم كلَّ مدخل بمعرّف جلسة أبيه المباشر الدائم وبعمقه. ولك استعمالُ `send_message` لمداخل العمق 1 وحدها؛ أما الأعمقُ فمرشحةٌ لـ`interrupt_agent` فقط.

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

المصدر: [`packages/subagent/tool-subagent-control/src/list-agents.ts`](../packages/subagent/tool-subagent-control/src/list-agents.ts)

### `send_message`

يرسل رسالةً إلى ابن مباشر قابل للمتابعة بمعرّف وكيله. وإن كنتَ ابنًا مقيمًا قابلًا للمتابعة، فلك أن تستهدف أباك المباشر أيضًا. وإن كان الهدفُ ما زال يعمل، وجّهت الرسالةُ أقربَ خطوة له؛ وإن كان خاملًا، بدأت الرسالةُ جولة. ولا يعيد هذا النداءُ جوابًا من الوكيل — بل تأكيدَ تسليم الرسالة وحده. والفشلُ يعني أن الرسالةَ **لم** تُسلَّم.

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

المصدر: [`packages/subagent/tool-subagent-control/src/index.ts`](../packages/subagent/tool-subagent-control/src/index.ts)

أدواتُ التحكم المسمّاة عالميًا فوق الوكلاء الفرعيين الخلفيين القابلين للمتابعة: فنسخُ `tool-subagent` المرتبطة بمزوّدين تسجّل أدواتِ تفويض متمايزة، بينما تسجّل هذه الحزمةُ `send_message` و`interrupt_agent` مرةً واحدة، مع `list_agents` من إضافة `/list-agents` المحمَّلة على حدة (وتستعمل صفوفُ دليلها سجلَّي sessionProjections والوكلاء الحي).

<a id="deepseek-aidsh-tool-jobs"></a>

## `@deepseek-ai/dsh-tool-jobs`

### `job_kill`

يطلب إلغاءَ مهمة خلفية عاملة بمعرّف المهمة. ويعود فورًا؛ وتستقر المهمةُ بحالة `killed` حالما يتوقف عملُها فعلًا.

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

المصدر: [`packages/jobs/tool-jobs/src/index.ts`](../packages/jobs/tool-jobs/src/index.ts)

### `job_list`

يعدّد مهامَّك الخلفية (العاملةَ والمنتهية) بمعرّفاتها وأصنافها وحالاتها.

```json
{
  "type": "object",
  "properties": {}
}
```

المصدر: [`packages/jobs/tool-jobs/src/index.ts`](../packages/jobs/tool-jobs/src/index.ts)

### `job_output`

يقرأ مهمةً خلفية. ولا تعيد مهامُّ المجرى إلا الخرجَ منذ القراءة السابقة؛ وتعيد مهامُّ الخرج النهائي نتيجتَها بعد الاستقرار. وتنتهي كلُّ استجابة بـ`[status: ...]`. والقراءاتُ غيرُ حاجبة ما لم تُضبط `wait: true`، فتنتظر حتى السقف المضبوط.

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

المصدر: [`packages/jobs/tool-jobs/src/index.ts`](../packages/jobs/tool-jobs/src/index.ts)

متحكمُ مهام الخلفية المحايد تجاه الأصناف: فأوامرُ bash الخلفية وإرسالاتُ PTY والوكلاءُ الفرعيون تُقرأ وتُعدَّد وتُقتل عبر الأدوات الثلاث نفسِها. ويربط تحميلُ الإضافة المتحكمَ الذي يسلّح `ctx.jobs.start()` لدى المنتِجين.

<a id="deepseek-aidsh-experimental-tool-agent-team"></a>

## `@deepseek-ai/dsh-experimental-tool-agent-team`

### `interrupt_agent`

يقاطع الجولةَ الحالية لزميل واحد مع حفظ صندوق وارده المعلَّق. لقائد الفريق وحده.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `list_agents`

يعدّد القائدَ وكلَّ زميل دائم مع حالته الحالية في وقت التشغيل.

```json
{
  "type": "object",
  "properties": {}
}
```

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `send_message`

يرسل رسالةً دائمة واحدة إلى عضو فريق آخر. فالهدفُ العامل يتلقاها عند أقرب حدّ خطوة؛ والهدفُ الخامل يبدأ جولة؛ والزميلُ غيرُ النشط يستأنف من البارد.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `spawn_teammate`

ينشئ زميلًا دائمًا مسمًّى واحدًا. ولا ينادي هذه الأداةَ إلا قائدُ الفريق.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_create`

ينشئ مهمةً معلَّقة واحدة بلا مالك على لوحة مهام الفريق المشتركة.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_get`

يقرأ أحدثَ قيمة كاملة لمهمة مشتركة واحدة قبل تغييرها أو تنفيذها.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_list`

يعدّد المهامَّ المشتركة، ومعها الجاهزيةُ والمالكُ والمراجعةُ والمعيقاتُ وتحذيراتُ نطاقات الكتابة.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `team_task_update`

يقارن ويعيّن فعلَ مهمة مشتركة بأحدث مراجعة من `team_task_get` أو `team_task_list`.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

### `wait_agent`

ينتظر التغييرَ التالي في حالة زميل أو في صندوق البريد أو في مهمة مشتركة بعد بدء هذا النداء. وهو لا يوقظ الأعضاءَ غيرَ النشطين قط ويعيد `noProgress` فورًا حين لا يعمل عضوٌ آخر ولا يُهيَّأ. وأعِد التعدادَ بعد الإيقاظ أو انتهاء المهلة بدل الاستطلاع.

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

المصدر: [`packages/experimental/tool-agent-team/src/index.ts`](../packages/experimental/tool-agent-team/src/index.ts)

الأدواتُ التسع كلُّها محدودةٌ بقادة الفرق الضمنيين والزملاء الدائمين. وتُبقي حزمةُ dsh-base المشحونة الحزمةَ معطَّلة؛ وتفعّلها رقعةُ الملف التعريفي الموثَّقة لفرق الوكلاء بينما تعطّل أسماءَ التحكم القديمة في الأبناء القابلين للمتابعة.


<a id="deepseek-aidsh-tool-todo"></a>

## `@deepseek-ai/dsh-tool-todo`

### `todo_write`

يسجّل قائمةَ مهام مبنيَنة للعمل الحالي ويحدّثها. أرسل القائمةَ **كاملةً** في كل نداء — فهي **تستبدل** القائمةَ السابقة (لا تحديثاتِ جزئية ولا تحريرَ بند بند). استعملها لتخطيط العمل المتعدد الخطوات وإظهار التقدم: أضِف بندًا واحدًا لكل خطوة ملموسة قبل أن تبدأ. وعلّم `in_progress` على كل بند يُعمل عليه فعلًا — بندين أو أكثر حين يجري العملُ متوازيًا حقًّا (كوكلاء فرعيين متزامنين أو أوامر خلفية)، وبندًا واحدًا للعمل المتسلسل؛ وما بقي عملٌ، ينبغي أن يكون بندٌ واحد على الأقل `in_progress`. وعلّم `completed` على البند لحظةَ إنجازه (ولا تجمع الإنجازاتِ دفعةً واحدة)، ولا تدع القائمةَ بلا بند `in_progress` إلا حين يكتمل العملُ كلُّه. وتخطَّ القائمةَ في المهام التافهة ذات الخطوة الواحدة. والحالات: `pending` (لم تبدأ)، و`in_progress` (يُعمل عليها الآن)، و`completed` (انتهت).

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

المصدر: [`packages/todo/tool-todo/src/index.ts`](../packages/todo/tool-todo/src/index.ts)

`todo_write` حالةٌ تملكها الجلسة؛ وتعرض الواجهاتُ أحدثَ حدث `todo/write` قائمةَ تحقق. و`allowParallelInProgress` مشترَطة بلا افتراض، فيذكر الدليلُ اختيارَه: `true`، ووصفُه يدعو إلى عدة بنود `in_progress`. أما النشرُ الذي يختار `false` فيتلقى الأداةَ نفسَها بوصف يطلب مهمةً نشطة واحدة بالضبط.

<a id="deepseek-aidsh-tool-workflow"></a>

## `@deepseek-ai/dsh-tool-workflow`

### `workflow`

يشغّل سكربتَ مسار عمل بلغة JavaScript ينسّق وكلاءَ فرعيين على نطاق واسع. استعمله للعمل الذي ينتشر على قطع مستقلة كثيرة — تدقيقٌ على ملفات كثيرة، أو ترحيلٌ، أو بحثٌ من زوايا عدة، أو تحققٌ عدائي من النتائج — حيث تكتب التنسيقَ سكربتًا بدل التفويض جولةً بجولة.

وتركب هويةُ مسار العمل معاملَ `meta` بصيغة JSON: فالسلسلتان `name` (بنسق kebab-case قصير) و`description` مشترَطتان، والسلسلةُ `whenToUse` ومصفوفةُ `phases` (`{title, detail?, provider?, model?}`) اختياريتان. والمعاملُ `script` هو متنُ JavaScript الصرف **وحده** (لا TypeScript، وبلا جملة `export const meta` — فـmeta معاملٌ لا شفرة)، ويعمل بـ`await` في المستوى الأعلى؛ وانتهِ بـ`return <value>` — ويجب أن تكون القيمةُ قابلةً للتسلسل بـJSON وهي نتيجةُ هذه الأداة.

خطّافات متن السكربت:

- `agent(prompt, opts?): Promise<any>` — يشغّل وكيلًا فرعيًا واحدًا حتى الاكتمال. وبلا `opts.schema` يحلّ إلى نص الابن النهائي؛ ومع `opts.schema` (وهو JSON Schema مجذور بكائن يستعمل `type` و`properties` و`required` و`additionalProperties` و`items` و`enum` و`const` و`oneOf` **وحدها** — بلا `pattern` ولا `format` ولا حدود عددية) يحلّ إلى الكائن المتحقَّق منه. ويحلّ إلى `null` حين يفشل الابن (فرشّح بـ`.filter(Boolean)`). ومن الخيارات الأخرى: `label` (للعرض)، و`phase` (مجموعةُ تقدّم)، وتجاوزا هدف LLM المستقلان `provider` و`model` (ويجوز تقديمُ أيٍّ منهما وحده). وما عدا ذلك (`effort` أو `isolation` أو `agentType`) يُرفض بصوت عالٍ.
- `pipeline(items, ...stages): Promise<any[]>` — يشغّل كلَّ بند عبر المراحل مستقلًّا بلا حاجز بين المراحل (وفضّله للعمل متعدد المراحل). وتتلقى كلُّ مرحلة `(prev, item, index)`. ورميُ مرحلة عادي يُسقط ذلك **البند** إلى `null` ويتخطى مراحلَه الباقية.
- `parallel(thunks): Promise<any[]>` — يشغّل دوالَّ بلا وسائط على التوازي وينتظرها **كلَّها** (وهو حاجز؛ فاستعمله فقط حين تحتاج مرحلةٌ إلى كل النتائج السابقة معًا). والدالةُ الرامية تحلّ إلى `null`.
- `phase(title)` — يبدأ مرحلةَ تقدّم؛ و`log(message)` — يسرد التقدمَ؛ و`args` — مُدخَلُ `args` في نداء الأداة حرفيًّا.

والخطّافاتُ المساءُ استعمالُها (وسائطُ خاطئة، أو خياراتٌ مجهولة، أو schemas غيرُ مدعومة، أو سقوفٌ انكسرت) ترمي أخطاءً **تقتل السكربتَ دائمًا** — ولا تذوب قط في `null` لبند.

القيود: تسري سقوفُ التوازي ومجموعِ الوكلاء؛ ولا يُقدَّم نظامُ ملفات ولا شبكةٌ ولا مؤقّتات ولا واجهاتُ Node.js — فالوكلاءُ يعملون والسكربتُ ينسّقهم وحسب. ويعمل التشغيلُ في المقدمة: فيعود هذا النداءُ حين ينتهي السكربتُ كلُّه.

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

المصدر: [`packages/workflow/tool-workflow/src/index.ts`](../packages/workflow/tool-workflow/src/index.ts)

<a id="deepseek-aidsh-tool-web"></a>

## `@deepseek-ai/dsh-tool-web`

### `web_fetch`

يجلب محتوى رابط HTTP أو HTTPS بعينه ويعيده مفكوكَ الترميز نصًّا.

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

المصدر: [`packages/web/tool-web/src/index.ts`](../packages/web/tool-web/src/index.ts)

### `web_search`

يبحث في الوِب عن معلومات حالية. قدّم من استعلام إلى أربعة في المصفوفة المشترَطة `queries`. ويعيد جوابَ ملخص اختياريًا وقائمةَ روابط مصادر.

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

المصدر: [`packages/web/tool-web/src/index.ts`](../packages/web/tool-web/src/index.ts)

تُبقي `web_search` و`web_fetch` انتقاءَ المزوّدين خلف `ctx.web` فتبقى schemas التي يراها النموذجُ ثابتةً عبر تبديل الخلفيات.

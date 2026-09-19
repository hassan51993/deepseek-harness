# فرعي نظام

[English](README.md) | العربية

كل فرعي نظام واحد صفحة، تغطية DeepSeek Harness الكل فرعي نظام: هو هو ماذا، هو عملية أي بعض بيانات بنية، و——عند هو من بعض عدد `ctx` خدمة أو حدث أثر مجال دعم دعم وقت——واحد مقطع توليد **Cordis API** صغير عقدة، تحمل تحميل ذلك خدمة و حدث مشاركة اعتبار. هذا دليل و [architecture.md](../architecture.zh.md) متبادل تكملة: بعد من وصف عبر فرعي نظام*سلوك*(خدمة خريطة، جلسة/جولة/خطوة دورة الحياة، حدث تصنيف جسم نظام) ؛ هذا داخل كل واحد صفحة هو مفرد عدد فرعي نظام مفردات و وصل خط مشاركة اعتبار.

| صفحة | مسؤول محتوى |
|---|---|
| [boot.md](boot.zh.md) | حالي profile إضافة إدارة و launcher إعادة تحميل تنسيق ضبط |
| [core.md](core.zh.md) | `packages/core` مثل أي تحكم agent loop(ذكي جسم حلقة): تدريجي حزمة حلقة شرح،agent إنشاء و كل حق (`AgentHandle`) ،`Agent` جملة مقبض إلقاء تمرير/إلغاء/اعتراض قطع اتفاق، و كل مستودع عام نوع نمط (`…Map → derived-union`، صنف لوحة تحويل id) |
| [llm-streaming.md](llm-streaming.zh.md) | `packages/llm` محادثة نوع——`Message`/`ContentBlock`، تجميع إتمام نموذج طلب،`StreamChunk` wire protocol و مهايئ اتفاق (adapter contract) ،`BlockAssembler`، و `LlmAdapter` مزود اتفاق |
| [token-meter.md](token-meter.zh.md) | غير ممكن تغيير علامة كمية و موضع إعادة تشغيل درجة كمية، مرفق حمل قد إزالة استهلاك سجل إصلاح حجز رقم |
| [scope.md](scope.zh.md) | أثر مجال تسجيل معرف،dispatch تحميل جسم، و يملك `Scope` سياق |
| [typert.md](typert.zh.md) | بعيد مسار استدعاء وصف رمز،lookup/Context إعلان،Typert سجل التسجيل، و Host Gateway/Client API حد |
| [goal.md](goal.zh.md) | حمل دائم goal معرف، دورة الحياة لقطة، تنشيط، تغيير سجل و Round ملكية |
| [schedule.md](schedule.zh.md) | فقط حد جلسة داخل رفع تنبيه سجل، حمل دائم تحويل، نشط حركة عرض و عادي محادثة تسليم |
| [todo.md](todo.zh.md) | todo حزمة كامل قائمة بند نوع، حمل دائم حدث كل حق، إسقاط و لم انتهاء جولة ثابت صيغة |
| [deliverables.md](deliverables.zh.md) | واحد جولة تسليم إعطاء مستخدم شرق غرب:`present` إعلان `PresentedFile` تسليم، و من git لقطة نيل خروج، من Host توفير `WorkspaceChangesSummary` تعديل ملخص |
| [commands.md](commands.zh.md) | شخص صنف أمر سجل التسجيل خدمة: تعريف، مهايئ اكتشاف، مباشر استدعاء، نتيجة و تحليل عرض |
| [session.md](session.zh.md) | كامل `SessionEventMap` تغيير جسم دليل،`TurnEndReason`،`deriveMessages()`، تنفيذ غلاف إغلاق و مستقل حدث |
| [persistence.md](persistence.zh.md) | حمل دائم صفة seam:`SessionPersistence`،JSONL مزود،`session/flush`، انهيار انهيار استعادة،`SessionHeader` |
| [settings.md](settings.zh.md) | مستخدم ضبط seam:`SettingsNamespace` تسجيل، قسم طبقة تحليل (قيمة افتراضية → تركيب `base` → مستخدم وثيقة) ،owner scope، حار إيداع |
| [credentials.md](credentials.zh.md) | اعتماد seam: إعداد في `CredentialRef` مرجع (أبدا يحتوي قيمة) ، حسب عملية تحليل، مقابل UI أمان `CredentialInfo`، مزود مصدر طبقة |
| [session-query.md](session-query.zh.md) | منطق سجل، محدود دقيق حدث قراءة، علاقة تتبع أثر، دلالة غربلة اختيار جهاز/وثيقة و كل نص فحص بحث نتيجة صفحة |
| [feedback.md](feedback.zh.md) | ربط دورة الحياة تدريجي رسالة عكس تغذية سجل، مرح مراقبة إصدار، مرافق مع سجل حفظ دائم و Host Remote اتفاق |
| [session-title.md](session-title.zh.md) | حمل دائم عنوان لقطة، يتم مرجع مصدر رسالة seq و مختلف خطوة مزود اتفاق |
| [session-reference.md](session-reference.zh.md) | بنية تحويل عبر جلسة مرجع:`SessionReferenceInput`/`Candidate`،prepared رسالة سياق، مستقر خطأ تصنيف |
| [system-prompt.md](system-prompt.zh.md) | تدريجي مرة تجميع سياق، أداة مزود نتيجة، نص التوجيه مقطع سقوط و تنسيق عمل صيغة تجميع |
| [tools.md](tools.zh.md) | `ToolDefinition` كامل حقل،schema DSL،`ToolExecution`/`ToolResult`، أداة عرض UI نوع، و تلقي حفظ حماية تنفيذ خط الإنتاج |
| [mcp.md](mcp.zh.md) | خارجي MCP اتصال، أثر مجال أداة و مورد، خادم إشارة أمر، بروتوكول نتيجة و إعداد ملكية |
| [user-questions.md](user-questions.zh.md) | UI دعم حمل شخص عمل سؤال جواب seam:`AskUserQuestionRequest`،answer/options مفردات، مزود API، خطأ تصنيف جسم نظام |
| [approval.md](approval.zh.md) | مرة صفة مستخدم مراجعة دفعة seam:`ApprovalRequest`،`ApprovalOutcome`، تدريجي جلسة سياسة، مراجعة حساب حدث و answerer اتفاق |
| [office-to-pdf.md](office-to-pdf.zh.md) | قد تخويل Office إلى PDF تحويل، أصلي/WASM جذب محرك و محدود مشترك إعادة استخدام |
| [attachment.md](attachment.zh.md) | حمل دائم صورة معرف و بيانات وصفية، تحقق إدخال، مرور تحقق قراءة، و `AttachmentStore` seam |
| [shell.md](shell.zh.md) | shell منفذ seam:`ShellExecRequest`/`Spec`،`ShellRunResult`، خلفية `ShellProcess` جملة مقبض |
| [subprocess.md](subprocess.zh.md) | عملية فرعية seam: تماما صريح `SubprocessSpawnSpec`، أساس في انحراف نقل إخراج قراءة جهاز، لا يحتوي تصنيف `SubprocessOutcome`، و تلقي إدارة `DSH_*` بيئة مفردات |
| [ssh.md](ssh.zh.md) | POSIX SSH اتصال و بعيد مسار نظام الملفات، عملية فرعية و صندوق رملي مزود |
| [terminal.md](terminal.zh.md) | حفظ دائم طرفية ID، خلفية/جلسة اتفاق، إرسال حينئذ خيط حالة، محدود قراءة و owner مرئي لقطة |
| [sandbox.md](sandbox.zh.md) | كل جلسة سياسة تحليل و عملية قيد seam: ملف فاعلية نتيجة نمط، تنفيذ/مزود سياسة،`ConfinedArgv`، قوي صنع تنفيذ و لذا عائق إغلاق خطأ |
| [ptc-runtime.md](ptc-runtime.zh.md) | PTC تنفيذ seam:`PtcRunRequest`/`Result`، ربط نطاق الأسماء، التقاط سجل،`PtcRunFailure` تصنيف جسم نظام |
| [computer-use.md](computer-use.zh.md) | حسب اسم وحيد احتلال تسجيل حساب حساب آلة عملية مزود، و Cua Driver تجميع صار خيار |
| [browser-use.md](browser-use.zh.md) | حسب اسم وحيد احتلال تسجيل متصفح عملية مزود، مزود خيار و حسب Session إدارة متصفح كل حق |
| [extensions.md](extensions.zh.md) | حمل إصدار حركة حالة Cordis إضافة و حزمة،Host/Client تنشيط، مراجعة دفعة، وقت التشغيل فحص و دورة الحياة تنظيف |
| [filesystem.md](filesystem.zh.md) | نظام الملفات seam:`FsTarget`، قراءة/كتابة/تحرير نتيجة، مراقبة قياس إلى ملف حالة،`FsErrorCode` |
| [lsp.md](lsp.zh.md) | LSP تنقل seam:`LspQueryRequest`/`Result`،`LspProvider`/`Service`، أربعة نوع عملية،`LspError` |
| [skills.md](skills.zh.md) | skill(تقنية قدرة) خدمة: اكتشاف أولوية درجة،`SkillSummary`/`SkillDefinition`، جلسة بادئة دليل، موجه إلى نموذج `skill` تحميل |
| [compaction.md](compaction.zh.md) | ضغط (compaction)seam:`compaction/*` جلسة حدث،`CompactionResult`،`CompactionEngine` واجهة |
| [subagent.md](subagent.zh.md) | subagent seam: تسمية مزود سجل التسجيل،`SubagentStartRequest`/`Result`/`Run`، بدء وقت و وقت التشغيل قدرة تفكيك قسم |
| [agent-team.md](agent-team.zh.md) | Agent Teams: خفي صيغة Lead هوية، أداة اسم continuable teammate، حمل دائم peer mailbox و مشترك مهمة DAG |
| [web.md](web.zh.md) | Web وصول seam:`WebSearchRequest`/`Result`،`WebFetchRequest`/`Result`،`WebFetchBody`، مزود متاح صفة،`WebError` |
| [spill.md](spill.zh.md) | spill تخزين seam:`SaveTextSpill`،`SpillOwner`/`SpillSource`،`SpillRef`، صنف لوحة نوع `SpillLocator` |
| [workflow.md](workflow.zh.md) | سير العمل seam:`WorkflowStartRequest`،`WorkflowMeta`،`WorkflowRun`/`Result`،`workflow/*` حدث تحميل حمل،`WorkflowError` يؤدي أمر صفة |
| [jobs.md](jobs.zh.md) | خلفية مهمة وقت التشغيل: صنف لوحة تحويل `JobId`،producer اتفاق، مستهلك عرض و `ctx.jobs` خدمة سلوك |
| [permission-presets.md](permission-presets.zh.md) | إذن مسبق ضبط طبقة:`PresetSpec`/`PresetOption`، إرسال توليد `custom` حالة، فقط تسجيل سجل `permission/preset` حدث |
| [plan.md](plan.zh.md) | حساب تخطيط نمط: فقط تسجيل سجل `plan/mode` حالة، انتظار تحديد اختيار اندفاع تحديث،`PlanModeConfig`،`exit_plan_mode` مراجعة قراءة مسار |
| [invariants.md](invariants.zh.md) | وقت التشغيل ثابت صيغة سجل التسجيل: اختيار إعداد `Config`،`InvariantInstaller`/`InvariantFailure`، فارغ إعداد طقم إضافة اتفاق |
| [web-server.md](web-server.zh.md) | HTTP تحميل جسم:`WebRouteKind`/`WebRoute`، مطابقة ترتيب، يمكن إقرار قيادة رجوع مقعد موضع،index تصيير تعليق وصل نقطة |
| [webhook.md](webhook.zh.md) | عبر هوية تحقق مزود تسليم، مهمة معنى برنامج تحويل قاعدة، و إرسال بدء Workspace جلسة إنشاء بعد لا انتظار نتيجة |
| [storage.md](storage.zh.md) | تخزين فرعي نظام: خلفية اتفاق (`StorageBackend`) ،`StorageForms`،`DomainSpec`/`Domain`،`domain/changed` |
| [workspace.md](workspace.zh.md) | مساحة العمل سجل التسجيل:`Workspace`/`WorkspaceId`، تسجيل و تحليل، و جلسة `cwd` علاقة |
| [web-client.md](web-client.zh.md) | متصفح هيكل بنية: بدء،Remote عبر معلومة، إعداد مقابل Client model،UI مهايئ،Conversation تجميع،slot و إعادة وصل دلالة |
| [client-modules.md](client-modules.zh.md) | Web إضافة جدول:`dsh.client` إعلان،`WebBootGraph` بروتوكول صيغة تركيب،bundle توجيه و index تعليق وصل نقطة |
| [slots.md](slots.zh.md) | نوع تحويل Web UI تركيب: إعلان كل حق،cardinality و scope، إطار هيكل و وظيفة حقن،props دفع توجيه و قد تسليم طبقة درجة بنية |
| [client-resources.md](client-resources.zh.md) | عميل مورد نموذج:`dsh-resource://<type>/…` عنوان، بروتوكول مزود و `ResourceProtocolMap`،`useResource` عام خطاف و ذلك حالة، تثبيت إقامة و تحرير |
| [sidebar-right.md](sidebar-right.zh.md) | يمين جانب Sidebar: مورد عنوان و تنقل عنوان،tab نوع تسجيل و توجيه،`ctx.sidebarRight` تنقل خدمة،pane-tab slot و owner props، مورد نموذج و Workspace Files خدمة |
| [conversation.md](conversation.zh.md) | هدف غير متصل جلسة حدث تجميع: سياق معرف، موضع بيانات، إعادة تشغيل مسار، عرض بناء جهاز و هدف ذاتي لديه تصيير عقدة |
| [session-projection.md](session-projection.zh.md) | إسقاط seam:`SessionProjectionMap`، صاف دالة `ProjectionDefinition` وحدة،`ProjectionSnapshot` متسق قطع وجه، تغيير تغذية إرسال |
| [session-telemetry.md](session-telemetry.zh.md) | مقابل خارج جلسة فوق تقرير قدرة seam:`SessionTelemetryRecord`/`SessionTelemetrySeverity`،`SessionTelemetrySink` اتفاق و `session-telemetry/record` انفصال حساس waterfall(شلال نشر صيغة حدث) |

> هذه صفحة فوق نوع إعلان و ذلك JSDoc و شفرة المصدر انتظار قيمة، و من `pnpm run verify-type-equiv` فحص عائم نقل (رؤية [development.md](../development.zh.md#documenting-types-verbatim-ts-type-equiv)). عادي كتلة إبقاء كامل إعلان؛`public-api` كتلة إبقاء ذهاب حذف تنفيذ جسم عام class إعلان.Cordis خدمة و حدث استخدام كل صفحة توليد **Cordis API** صغير عقدة.

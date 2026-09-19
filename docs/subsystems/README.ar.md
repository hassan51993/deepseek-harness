# فرعي نظام

[English](README.md) | العربية

كل فرعي نظام واحد صفحة، تغطية DeepSeek Harness الكل فرعي نظام: هو هو ماذا، هو عملية أي بعض بيانات بنية، و——عند هو من بعض عدد `ctx` خدمة أو حدث أثر مجال دعم دعم وقت——واحد مقطع توليد **Cordis API** صغير عقدة، تحمل تحميل ذلك خدمة و حدث مشاركة اعتبار. هذا دليل و [architecture.md](../architecture.ar.md) متبادل تكملة: بعد من وصف عبر فرعي نظام*سلوك*(خدمة خريطة، جلسة/جولة/خطوة دورة الحياة، حدث تصنيف جسم نظام) ؛ هذا داخل كل واحد صفحة هو مفرد عدد فرعي نظام مفردات و وصل خط مشاركة اعتبار.

| صفحة | مسؤول محتوى |
|---|---|
| [boot.md](boot.ar.md) | حالي profile إضافة إدارة و launcher إعادة تحميل تنسيق ضبط |
| [core.md](core.ar.md) | `packages/core` مثل أي تحكم agent loop(ذكي جسم حلقة): تدريجي حزمة حلقة شرح،agent إنشاء و كل حق (`AgentHandle`) ،`Agent` جملة مقبض إلقاء تمرير/إلغاء/اعتراض قطع اتفاق، و كل مستودع عام نوع نمط (`…Map → derived-union`، صنف لوحة تحويل id) |
| [llm-streaming.md](llm-streaming.ar.md) | `packages/llm` محادثة نوع——`Message`/`ContentBlock`، تجميع إتمام نموذج طلب،`StreamChunk` wire protocol و مهايئ اتفاق (adapter contract) ،`BlockAssembler`، و `LlmAdapter` مزود اتفاق |
| [token-meter.md](token-meter.ar.md) | غير ممكن تغيير علامة كمية و موضع إعادة تشغيل درجة كمية، مرفق حمل قد إزالة استهلاك سجل إصلاح حجز رقم |
| [scope.md](scope.ar.md) | أثر مجال تسجيل معرف،dispatch تحميل جسم، و يملك `Scope` سياق |
| [typert.md](typert.ar.md) | بعيد مسار استدعاء وصف رمز،lookup/Context إعلان،Typert سجل التسجيل، و Host Gateway/Client API حد |
| [goal.md](goal.ar.md) | حمل دائم goal معرف، دورة الحياة لقطة، تنشيط، تغيير سجل و Round ملكية |
| [schedule.md](schedule.ar.md) | فقط حد جلسة داخل رفع تنبيه سجل، حمل دائم تحويل، نشط حركة عرض و عادي محادثة تسليم |
| [todo.md](todo.ar.md) | todo حزمة كامل قائمة بند نوع، حمل دائم حدث كل حق، إسقاط و لم انتهاء جولة ثابت صيغة |
| [deliverables.md](deliverables.ar.md) | واحد جولة تسليم إعطاء مستخدم شرق غرب:`present` إعلان `PresentedFile` تسليم، و من git لقطة نيل خروج، من Host توفير `WorkspaceChangesSummary` تعديل ملخص |
| [commands.md](commands.ar.md) | شخص صنف أمر سجل التسجيل خدمة: تعريف، مهايئ اكتشاف، مباشر استدعاء، نتيجة و تحليل عرض |
| [session.md](session.ar.md) | كامل `SessionEventMap` تغيير جسم دليل،`TurnEndReason`،`deriveMessages()`، تنفيذ غلاف إغلاق و مستقل حدث |
| [persistence.md](persistence.ar.md) | حمل دائم صفة seam:`SessionPersistence`،JSONL مزود،`session/flush`، انهيار انهيار استعادة،`SessionHeader` |
| [settings.md](settings.ar.md) | مستخدم ضبط seam:`SettingsNamespace` تسجيل، قسم طبقة تحليل (قيمة افتراضية → تركيب `base` → مستخدم وثيقة) ،owner scope، حار إيداع |
| [credentials.md](credentials.ar.md) | اعتماد seam: إعداد في `CredentialRef` مرجع (أبدا يحتوي قيمة) ، حسب عملية تحليل، مقابل UI أمان `CredentialInfo`، مزود مصدر طبقة |
| [session-query.md](session-query.ar.md) | منطق سجل، محدود دقيق حدث قراءة، علاقة تتبع أثر، دلالة غربلة اختيار جهاز/وثيقة و كل نص فحص بحث نتيجة صفحة |
| [feedback.md](feedback.ar.md) | ربط دورة الحياة تدريجي رسالة عكس تغذية سجل، مرح مراقبة إصدار، مرافق مع سجل حفظ دائم و Host Remote اتفاق |
| [session-title.md](session-title.ar.md) | حمل دائم عنوان لقطة، يتم مرجع مصدر رسالة seq و مختلف خطوة مزود اتفاق |
| [session-reference.md](session-reference.ar.md) | بنية تحويل عبر جلسة مرجع:`SessionReferenceInput`/`Candidate`،prepared رسالة سياق، مستقر خطأ تصنيف |
| [system-prompt.md](system-prompt.ar.md) | تدريجي مرة تجميع سياق، أداة مزود نتيجة، نص التوجيه مقطع سقوط و تنسيق عمل صيغة تجميع |
| [tools.md](tools.ar.md) | `ToolDefinition` كامل حقل،schema DSL،`ToolExecution`/`ToolResult`، أداة عرض UI نوع، و تلقي حفظ حماية تنفيذ خط الإنتاج |
| [mcp.md](mcp.ar.md) | خارجي MCP اتصال، أثر مجال أداة و مورد، خادم إشارة أمر، بروتوكول نتيجة و إعداد ملكية |
| [user-questions.md](user-questions.ar.md) | UI دعم حمل شخص عمل سؤال جواب seam:`AskUserQuestionRequest`،answer/options مفردات، مزود API، خطأ تصنيف جسم نظام |
| [approval.md](approval.ar.md) | مرة صفة مستخدم مراجعة دفعة seam:`ApprovalRequest`،`ApprovalOutcome`، تدريجي جلسة سياسة، مراجعة حساب حدث و answerer اتفاق |
| [office-to-pdf.md](office-to-pdf.ar.md) | قد تخويل Office إلى PDF تحويل، أصلي/WASM جذب محرك و محدود مشترك إعادة استخدام |
| [attachment.md](attachment.ar.md) | حمل دائم صورة معرف و بيانات وصفية، تحقق إدخال، مرور تحقق قراءة، و `AttachmentStore` seam |
| [shell.md](shell.ar.md) | shell منفذ seam:`ShellExecRequest`/`Spec`،`ShellRunResult`، خلفية `ShellProcess` جملة مقبض |
| [subprocess.md](subprocess.ar.md) | عملية فرعية seam: تماما صريح `SubprocessSpawnSpec`، أساس في انحراف نقل إخراج قراءة جهاز، لا يحتوي تصنيف `SubprocessOutcome`، و تلقي إدارة `DSH_*` بيئة مفردات |
| [ssh.md](ssh.ar.md) | POSIX SSH اتصال و بعيد مسار نظام الملفات، عملية فرعية و صندوق رملي مزود |
| [terminal.md](terminal.ar.md) | حفظ دائم طرفية ID، خلفية/جلسة اتفاق، إرسال حينئذ خيط حالة، محدود قراءة و owner مرئي لقطة |
| [sandbox.md](sandbox.ar.md) | كل جلسة سياسة تحليل و عملية قيد seam: ملف فاعلية نتيجة نمط، تنفيذ/مزود سياسة،`ConfinedArgv`، قوي صنع تنفيذ و لذا عائق إغلاق خطأ |
| [ptc-runtime.md](ptc-runtime.ar.md) | PTC تنفيذ seam:`PtcRunRequest`/`Result`، ربط نطاق الأسماء، التقاط سجل،`PtcRunFailure` تصنيف جسم نظام |
| [computer-use.md](computer-use.ar.md) | حسب اسم وحيد احتلال تسجيل حساب حساب آلة عملية مزود، و Cua Driver تجميع صار خيار |
| [browser-use.md](browser-use.ar.md) | حسب اسم وحيد احتلال تسجيل متصفح عملية مزود، مزود خيار و حسب Session إدارة متصفح كل حق |
| [extensions.md](extensions.ar.md) | حمل إصدار حركة حالة Cordis إضافة و حزمة،Host/Client تنشيط، مراجعة دفعة، وقت التشغيل فحص و دورة الحياة تنظيف |
| [filesystem.md](filesystem.ar.md) | نظام الملفات seam:`FsTarget`، قراءة/كتابة/تحرير نتيجة، مراقبة قياس إلى ملف حالة،`FsErrorCode` |
| [lsp.md](lsp.ar.md) | LSP تنقل seam:`LspQueryRequest`/`Result`،`LspProvider`/`Service`، أربعة نوع عملية،`LspError` |
| [skills.md](skills.ar.md) | skill(تقنية قدرة) خدمة: اكتشاف أولوية درجة،`SkillSummary`/`SkillDefinition`، جلسة بادئة دليل، موجه إلى نموذج `skill` تحميل |
| [compaction.md](compaction.ar.md) | ضغط (compaction)seam:`compaction/*` جلسة حدث،`CompactionResult`،`CompactionEngine` واجهة |
| [subagent.md](subagent.ar.md) | subagent seam: تسمية مزود سجل التسجيل،`SubagentStartRequest`/`Result`/`Run`، بدء وقت و وقت التشغيل قدرة تفكيك قسم |
| [agent-team.md](agent-team.ar.md) | Agent Teams: خفي صيغة Lead هوية، أداة اسم continuable teammate، حمل دائم peer mailbox و مشترك مهمة DAG |
| [web.md](web.ar.md) | Web وصول seam:`WebSearchRequest`/`Result`،`WebFetchRequest`/`Result`،`WebFetchBody`، مزود متاح صفة،`WebError` |
| [spill.md](spill.ar.md) | spill تخزين seam:`SaveTextSpill`،`SpillOwner`/`SpillSource`،`SpillRef`، صنف لوحة نوع `SpillLocator` |
| [workflow.md](workflow.ar.md) | سير العمل seam:`WorkflowStartRequest`،`WorkflowMeta`،`WorkflowRun`/`Result`،`workflow/*` حدث تحميل حمل،`WorkflowError` يؤدي أمر صفة |
| [jobs.md](jobs.ar.md) | خلفية مهمة وقت التشغيل: صنف لوحة تحويل `JobId`،producer اتفاق، مستهلك عرض و `ctx.jobs` خدمة سلوك |
| [permission-presets.md](permission-presets.ar.md) | إذن مسبق ضبط طبقة:`PresetSpec`/`PresetOption`، إرسال توليد `custom` حالة، فقط تسجيل سجل `permission/preset` حدث |
| [plan.md](plan.ar.md) | حساب تخطيط نمط: فقط تسجيل سجل `plan/mode` حالة، انتظار تحديد اختيار اندفاع تحديث،`PlanModeConfig`،`exit_plan_mode` مراجعة قراءة مسار |
| [invariants.md](invariants.ar.md) | وقت التشغيل ثابت صيغة سجل التسجيل: اختيار إعداد `Config`،`InvariantInstaller`/`InvariantFailure`، فارغ إعداد طقم إضافة اتفاق |
| [web-server.md](web-server.ar.md) | HTTP تحميل جسم:`WebRouteKind`/`WebRoute`، مطابقة ترتيب، يمكن إقرار قيادة رجوع مقعد موضع،index تصيير تعليق وصل نقطة |
| [webhook.md](webhook.ar.md) | عبر هوية تحقق مزود تسليم، مهمة معنى برنامج تحويل قاعدة، و إرسال بدء Workspace جلسة إنشاء بعد لا انتظار نتيجة |
| [storage.md](storage.ar.md) | تخزين فرعي نظام: خلفية اتفاق (`StorageBackend`) ،`StorageForms`،`DomainSpec`/`Domain`،`domain/changed` |
| [workspace.md](workspace.ar.md) | مساحة العمل سجل التسجيل:`Workspace`/`WorkspaceId`، تسجيل و تحليل، و جلسة `cwd` علاقة |
| [web-client.md](web-client.ar.md) | متصفح هيكل بنية: بدء،Remote عبر معلومة، إعداد مقابل Client model،UI مهايئ،Conversation تجميع،slot و إعادة وصل دلالة |
| [client-modules.md](client-modules.ar.md) | Web إضافة جدول:`dsh.client` إعلان،`WebBootGraph` بروتوكول صيغة تركيب،bundle توجيه و index تعليق وصل نقطة |
| [slots.md](slots.ar.md) | نوع تحويل Web UI تركيب: إعلان كل حق،cardinality و scope، إطار هيكل و وظيفة حقن،props دفع توجيه و قد تسليم طبقة درجة بنية |
| [client-resources.md](client-resources.ar.md) | عميل مورد نموذج:`dsh-resource://<type>/…` عنوان، بروتوكول مزود و `ResourceProtocolMap`،`useResource` عام خطاف و ذلك حالة، تثبيت إقامة و تحرير |
| [sidebar-right.md](sidebar-right.ar.md) | يمين جانب Sidebar: مورد عنوان و تنقل عنوان،tab نوع تسجيل و توجيه،`ctx.sidebarRight` تنقل خدمة،pane-tab slot و owner props، مورد نموذج و Workspace Files خدمة |
| [conversation.md](conversation.ar.md) | هدف غير متصل جلسة حدث تجميع: سياق معرف، موضع بيانات، إعادة تشغيل مسار، عرض بناء جهاز و هدف ذاتي لديه تصيير عقدة |
| [session-projection.md](session-projection.ar.md) | إسقاط seam:`SessionProjectionMap`، صاف دالة `ProjectionDefinition` وحدة،`ProjectionSnapshot` متسق قطع وجه، تغيير تغذية إرسال |
| [session-telemetry.md](session-telemetry.ar.md) | مقابل خارج جلسة فوق تقرير قدرة seam:`SessionTelemetryRecord`/`SessionTelemetrySeverity`،`SessionTelemetrySink` اتفاق و `session-telemetry/record` انفصال حساس waterfall(شلال نشر صيغة حدث) |

> هذه صفحة فوق نوع إعلان و ذلك JSDoc و شفرة المصدر انتظار قيمة، و من `pnpm run verify-type-equiv` فحص عائم نقل (رؤية [development.md](../development.ar.md#documenting-types-verbatim-ts-type-equiv)). عادي كتلة إبقاء كامل إعلان؛`public-api` كتلة إبقاء ذهاب حذف تنفيذ جسم عام class إعلان.Cordis خدمة و حدث استخدام كل صفحة توليد **Cordis API** صغير عقدة.

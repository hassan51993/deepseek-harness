# الأنظمة الفرعية

[English](README.md) | العربية

صفحةٌ لكل نظام فرعي في DeepSeek Harness: ما هو، وبنى البيانات التي يحرّكها، وحيث تسنده خدمةُ `ctx` أو نطاقُ أحداث، قسمُ **واجهة Cordis** المولَّد الذي يحمل مرجعَ خدماته وأحداثه. ويكمّل هذا الدليلُ [architecture.md](../architecture.ar.md) الذي يصف *السلوك* عبر الأنظمة الفرعية (خريطةَ الخدمات، ودورةَ حياة الجلسة والجولة والخطوة، وتصنيفَ الأحداث)؛ وكلُّ صفحة هنا مرجعُ مفردات نظام فرعي واحد وتوصيلِه.

| الصفحة | تملك |
|---|---|
| [boot.md](boot.ar.md) | إدارة إضافات الـ profile الحالي وتنسيق إعادة تحميل المُقلِع |
| [core.md](core.ar.md) | كيف تتحكم `packages/core` في agent loop: وصفُ الحلقة حزمةً حزمة، وإنشاءُ الوكلاء وملكيتُهم (`AgentHandle`)، وعقودُ التسليم والإلغاء والاعتراض في مقبض `Agent`، وأنماطُ الأنواع في المستودع كله (`…Map` إلى اتحاد مشتق، والمعرّفات الموسومة) |
| [llm-streaming.md](llm-streaming.ar.md) | أنواعُ المحادثة في `packages/llm`: `Message` و`ContentBlock`، وطلبُ النموذج المجمَّع، وبروتوكولُ السلك `StreamChunk` وعقدُ المهايئ، و`BlockAssembler`، وعقدُ مزوّد `LlmAdapter` |
| [token-meter.md](token-meter.ar.md) | قياساتُ إعادة التشغيل المفردة والموضعية غير القابلة للتغيير، بمراجعات السجل المستهلَك |
| [scope.md](scope.ar.md) | هويةُ التسجيل ذي النطاق، وحواملُ التوزيع، وسياقُ `Scope` المملوك |
| [typert.md](typert.ar.md) | واصفاتُ استدعاء Remote، وتصريحاتُ lookup والسياقات، وسجلاتُ Typert، وحدودُ بوابة Host وواجهة Client |
| [goal.md](goal.ar.md) | هويةُ الهدف المحفوظة، ولقطاتُ دورة الحياة، والتنشيط، وسجلاتُ التغيير، وإسنادُ الجولات |
| [schedule.md](schedule.ar.md) | سجلاتُ التذكيرات المحلية للجلسة، والانتقالاتُ الدائمة، والعروضُ النشطة، والتسليمُ في المحادثة العادية |
| [todo.md](todo.ar.md) | نوعُ بند القائمة كاملةً في حزمة todo، وملكيةُ الأحداث الدائمة، والإسقاط، وثابتُ الجولة المفتوحة |
| [deliverables.md](deliverables.ar.md) | ما تسلّمه الجولة إلى المستخدم: تسليماتُ `PresentedFile` من `present`، و`WorkspaceChangesSummary` الذي يخدمه المضيف للملفات المتغيّرة من لقطات git |
| [commands.md](commands.ar.md) | registry أوامر الإنسان: التعريفاتُ، واكتشافُ المهايئات، والاستدعاءُ المباشر، والنتائجُ، وعروضُ التحليل |
| [session.md](session.ar.md) | دليلُ بدائل `SessionEventMap` كاملًا، و`TurnEndReason`، و`deriveMessages()`، وغلافُ التنفيذ، والأحداثُ المستقلة |
| [persistence.md](persistence.ar.md) | seam المتانة: `SessionPersistence`، ومزوّد JSONL، و`session/flush`، والتعافي من الانهيار، و`SessionHeader` |
| [settings.md](settings.ar.md) | seam إعدادات المستخدم: تسجيلُ `SettingsNamespace`، والتحليلُ الطبقي (الافتراضات ثم `base` في التركيب ثم وثيقة المستخدم)، ونطاقاتُ المالكين، والإيداعُ الحارّ |
| [credentials.md](credentials.ar.md) | seam الاعتمادات: مراجعُ `CredentialRef` (لا القيم) في الإعداد، والتحليلُ لكل عملية، و`CredentialInfo` الآمن للواجهة، وطبقاتُ مصادر المزوّدين |
| [session-query.md](session-query.ar.md) | السجلاتُ المنطقية، وقراءاتُ الأحداث المضبوطة المحدودة، وآثارُ العلاقات، والمرشِّحاتُ والوثائقُ الدلالية، وصفحاتُ نتائج البحث الكامل |
| [feedback.md](feedback.ar.md) | سجلاتُ الملاحظات لكل رسالة مربوطةً بدورة الحياة، والإصداراتُ المتفائلة، والحفظُ في ملف مرافق، وعقدُ Remote في المضيف |
| [session-title.md](session-title.ar.md) | لقطاتُ العناوين الدائمة، وتسلسلاتُ رسائل المصدر المستشهَد بها، وعقدُ المزوّد اللاتزامني |
| [session-reference.md](session-reference.ar.md) | المراجعُ المبنيَنة عبر الجلسات: `SessionReferenceInput` و`Candidate`، وسياقاتُ الرسائل المحضَّرة، وتصنيفُ الأخطاء الثابت |
| [system-prompt.md](system-prompt.ar.md) | سياقُ كل تجميع، ونتائجُ مزوّدي الأدوات، ومقاطعُ التوجيه، والتجميعُ التعاوني |
| [tools.md](tools.ar.md) | حقولُ `ToolDefinition` كاملةً، واللغةُ الوصفية لـ schemas، و`ToolExecution` و`ToolResult`، وأنواعُ عرض الأدوات في الواجهة، وخطُّ التنفيذ المحروس |
| [mcp.md](mcp.ar.md) | اتصالاتُ MCP الخارجية، والأدواتُ والمواردُ ذاتُ النطاق، وتعليماتُ الخادم، ونتائجُ البروتوكول، وملكيةُ الإعداد |
| [user-questions.md](user-questions.ar.md) | seam السؤال والجواب البشري المسنَد بالواجهة: `AskUserQuestionRequest`، ومفرداتُ الأجوبة والخيارات، وواجهةُ المزوّد، وتصنيفُ الأخطاء |
| [approval.md](approval.ar.md) | seam موافقة المستخدم لمرة واحدة: `ApprovalRequest` و`ApprovalOutcome`، والسياسةُ لكل جلسة، وأحداثُ التدقيق، وعقودُ المجيبين |
| [office-to-pdf.md](office-to-pdf.ar.md) | تحويلُ Office إلى PDF المأذون، والمحرّكان الأصيل وWASM، وإعادةُ الاستعمال المشتركة المحدودة |
| [attachment.md](attachment.ar.md) | هويةُ الصور الدائمة وبياناتُها الوصفية، ومدخلاتُ التحقق، والقراءاتُ المتحقَّق منها، وseam الخاص بـ `AttachmentStore` |
| [shell.md](shell.ar.md) | seam منفّذ الغلاف: `ShellExecRequest` و`Spec`، و`ShellRunResult`، ومقابضُ `ShellProcess` الخلفية |
| [subprocess.md](subprocess.ar.md) | seam العمليات الفرعية: `SubprocessSpawnSpec` الصريح كاملًا، وقرّاءُ الخرج المعتمدون على الإزاحة، و`SubprocessOutcome` غيرُ المصنَّف، ومفرداتُ بيئة `DSH_*` المُدارة |
| [ssh.md](ssh.ar.md) | اتصالُ SSH على POSIX ونظامُ الملفات البعيد، ومزوّدا العمليات الفرعية والبيئة المعزولة |
| [terminal.md](terminal.ar.md) | معرّفاتُ الطرفيات الدائمة، وعقودُ الخلفية والجلسة، وجاهزيةُ الإرسال، والقراءاتُ المحدودة، واللقطاتُ التي يراها المالك |
| [sandbox.md](sandbox.ar.md) | تحليلُ السياسة لكل جلسة وseam حصر العمليات: أوضاعُ أثر الملفات، وسياساتُ التنفيذ والمزوّدين، و`ConfinedArgv`، والإلزامُ وأخطاءُ الإغلاق على الفشل |
| [ptc-runtime.md](ptc-runtime.ar.md) | seam تنفيذ PTC: `PtcRunRequest` و`Result`، وفضاءاتُ أسماء الربط، والسجلاتُ الملتقَطة، وتصنيفُ `PtcRunFailure` |
| [computer-use.md](computer-use.ar.md) | التسجيلُ الحصري المسمّى لمزوّدي استعمال الحاسوب، وخياراتُ تكامل Cua Driver |
| [browser-use.md](browser-use.ar.md) | التسجيلُ الحصري المسمّى لاستعمال المتصفح، وخياراتُ المزوّدين، وملكيةُ المتصفح لكل جلسة |
| [extensions.md](extensions.ar.md) | إضافاتُ Cordis وحزمُها الديناميكية المرقَّمة، والتفعيلُ في Host وClient، والموافقةُ، وفحصُ وقت التشغيل، وتفكيكُ دورة الحياة |
| [filesystem.md](filesystem.ar.md) | seam نظام الملفات: `FsTarget`، ونتائجُ القراءة والكتابة والتحرير، وحالةُ الملفات المرصودة، و`FsErrorCode` |
| [lsp.md](lsp.ar.md) | seam التنقل بـ LSP: `LspQueryRequest` و`Result`، و`LspProvider` و`Service`، والعملياتُ الأربع، و`LspError` |
| [skills.md](skills.ar.md) | خدمةُ المهارات: أولويةُ الاكتشاف، و`SkillSummary` و`SkillDefinition`، ودليلُ بادئة الجلسة، وتحميلُ `skill` الموجَّه إلى النموذج |
| [compaction.md](compaction.ar.md) | seam الضغط: أحداثُ `compaction/*` في الجلسة، و`CompactionResult`، وواجهةُ `CompactionEngine` |
| [subagent.md](subagent.ar.md) | seam الوكلاء الفرعيين: registry المزوّدين المسمّين، و`SubagentStartRequest` و`Result` و`Run`، والفصلُ بين قدرات وقت البدء وقدرات وقت التشغيل |
| [agent-team.md](agent-team.ar.md) | فرقُ الوكلاء: هويةُ القائد الضمنية، والزملاءُ المسمّون القابلون للمتابعة، وصندوقُ بريد الأقران الدائم، ورسمُ المهام المشترك |
| [web.md](web.ar.md) | seam الوصول إلى الويب: `WebSearchRequest` و`Result`، و`WebFetchRequest` و`Result`، و`WebFetchBody`، وتوفّرُ المزوّدين، و`WebError` |
| [spill.md](spill.ar.md) | seam تخزين الانسكاب: `SaveTextSpill`، و`SpillOwner` و`SpillSource`، و`SpillRef`، و`SpillLocator` الموسوم |
| [workflow.md](workflow.ar.md) | seam سير العمل: `WorkflowStartRequest`، و`WorkflowMeta`، و`WorkflowRun` و`Result`، وحمولاتُ أحداث `workflow/*`، وقاتليةُ `WorkflowError` |
| [jobs.md](jobs.ar.md) | وقتُ تشغيل المهام الخلفية: معرّفاتُ `JobId` الموسومة، وعقدُ المنتج، وعروضُ المستهلك، وسلوكُ خدمة `ctx.jobs` |
| [permission-presets.md](permission-presets.ar.md) | طبقةُ إعدادات الأذونات الجاهزة: `PresetSpec` و`PresetOption`، والحالةُ المشتقّة `custom`، وحدثُ `permission/preset` الذي يُسجَّل فقط |
| [plan.md](plan.ar.md) | وضعُ التخطيط: حالةُ `plan/mode` التي تُسجَّل فقط، وتفريغُ الاختيار المعلَّق، و`PlanModeConfig`، وقوسُ مراجعة `exit_plan_mode` |
| [invariants.md](invariants.ar.md) | registry ثوابت وقت التشغيل: اختيارُ `Config`، و`InvariantInstaller` و`InvariantFailure`، وعقدُ المرافق الفارغ |
| [web-server.md](web-server.ar.md) | حاملُ HTTP: `WebRouteKind` و`WebRoute`، وترتيبُ المطابقة، ومقعدُ الرجوع القابل للمطالبة، ومقابسُ الفهرس |
| [webhook.md](webhook.ar.md) | تسليماتُ المزوّدين المستوثَقة، والقواعدُ البرمجية الحرة، وإنشاءُ جلسات مساحة العمل بلا انتظار |
| [storage.md](storage.ar.md) | نظامُ التخزين الفرعي: عقدُ الخلفية (`StorageBackend`)، و`StorageForms`، و`DomainSpec` و`Domain`، و`domain/changed` |
| [workspace.md](workspace.ar.md) | registry مساحات العمل: `Workspace` و`WorkspaceId`، والتسجيلُ والتحليل، وعلاقةُ `cwd` بالجلسة |
| [web-client.md](web-client.ar.md) | معماريةُ المتصفح: الإقلاعُ، والتواصلُ عبر Remote، ونماذجُ Client المقترنة، ومهايئاتُ الواجهة، وتجميعُ المحادثة، والفتحاتُ، ودلالةُ إعادة الاتصال |
| [client-modules.md](client-modules.ar.md) | جدولُ إضافات الويب: تصريحاتُ `dsh.client`، وتركيبُ `WebBootGraph` على السلك، ومسارُ الحزمة ومقبسُ الفهرس |
| [slots.md](slots.ar.md) | تركيبُ واجهة Web المنمَّط: ملكيةُ التصريح، والعدديةُ والنطاق، وحقنُ الإطار والميزات، واشتقاقُ الخصائص، والتراتبُ المشحون |
| [client-resources.md](client-resources.ar.md) | نموذجُ موارد العميل: عناوينُ `dsh-resource://<type>/…`، ومزوّدو البروتوكولات و`ResourceProtocolMap`، وخطّافُ `useResource` العام وحالاتُه، والتثبيتُ والتحرير |
| [sidebar-right.md](sidebar-right.ar.md) | الشريطُ الجانبي الأيمن: عناوينُ الموارد والتنقل، وتسجيلُ أنواع التبويبات وتوجيهُها، وخدمةُ التنقل `ctx.sidebarRight`، وفتحاتُ تبويبات اللوحة وخصائصُ مالكها، ونموذجُ الموارد، وخدمةُ ملفات مساحة العمل |
| [conversation.md](conversation.ar.md) | تجميعُ أحداث الجلسة محايدًا تجاه الهدف: هويةُ السياق، وبياناتُ الموضع، ومساراتُ إعادة التشغيل، وبناةُ العروض، وعُقدُ التصيير التي يملكها الهدف |
| [session-projection.md](session-projection.ar.md) | seam الإسقاط: `SessionProjectionMap`، ووحدةُ `ProjectionDefinition` الخالصة، والقطعُ المتسق في `ProjectionSnapshot`، وتغذيةُ التغييرات |
| [session-telemetry.md](session-telemetry.ar.md) | seam قدرة التبليغ الصادر عن الجلسات: `SessionTelemetryRecord` و`SessionTelemetrySeverity`، وعقدُ `SessionTelemetrySink`، وwaterfall الحجب `session-telemetry/record` |

> تصريحاتُ الأنواع وJSDoc الخاص بها في هذه الصفحات مكافئةٌ للمصدر ويفحص انحرافَها `pnpm run verify-type-equiv` (انظر [development.md](../development.ar.md#documenting-types-verbatim-ts-type-equiv)). وتحفظ الكتلُ العادية التصريحاتِ كاملةً؛ وتحفظ كتلُ `public-api` تصريحاتِ الأصناف العامة منزوعةَ الأجسام. وتستعمل خدماتُ Cordis وأحداثُه قسمَ **واجهة Cordis** المولَّد في كل صفحة.

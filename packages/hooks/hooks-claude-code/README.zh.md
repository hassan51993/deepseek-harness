---
description: "في agent تشغيل خلال استخدام أنت قائم Claude Code hooks.json أو settings خطاف إعداد——منع سد نص التوجيه و أداة، مرفق إضافة سياق أو قوي صنع متابعة——توفير هذا جسر وصل مستخدم و صيانة من قراءة قراءة."
kind: "package-reference"
---

# @deepseek-ai/dsh-hooks-claude-code

[English](README.md) | العربية

## عام وصف

`dsh-hooks-claude-code` في agent(ذكي جسم) تشغيل خلال تنفيذ أنت قائم Claude Code `hooks.json` أو settings ملف في command خطاف، بلا حاجة إعادة كتابة. تلقي دعم حمل خطاف سوف في جلسة، نص التوجيه، أداة، إيقاف أو subagent وصول مقابل وقت لحظة وقت تشغيل. هو جمع يمكن حمل نموذج مرئي سبب منع سد نص التوجيه أو أداة استدعاء، إضافة محادثة سياق، أو قوي صنع نموذج مجددا تنفيذ واحد جولة. حاجة في harness في إعادة استخدام Claude Code command خطاف وقت اختيار هذه الحزمة؛ لا يوجد Claude Code مقابل شيء سلوك ينبغي استخدام أصلي إضافة.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

تركيب هذه الحزمة و يأخذ `configPath` إشارة نحو أنت خطاف إعداد، أنت قد لديه خطاف حينئذ سوف في agent تشغيل في مقابل وقت لحظة بدء إطلاق. في رقم واحد خطاف توليد فاعلية قبل بلا حاجة أخرى ضبط.

### أي وقت اختيار

عند أنت يحتفظ Claude Code `hooks.json`(أو `hooks` key تخزين وضع إعداد settings ملف) ، كما منها command خطاف حاجة يأخذ صلة نص التوجيه، أداة و جولة وقت، استخدام هو. لا يوجد Claude Code مقابل شيء سلوك طلب قفز مرور هو: أصلي إضافة يملك كامل harness API، بينما هذا جسر وصل فقط تشغيل مشاركة اعتبار أداة command hook فرعي تجميع.

### الأكثر صغير إعداد

```yaml
- name: '@deepseek-ai/dsh-hooks-claude-code'
  config:
    configPath: ./.claude/hooks.json
    pluginRoot: ./.claude/plugins/my-plugin
    projectDir: .
```

| حقل | قيمة افتراضية | يحتوي معنى |
|---|---|---|
| `configPath` | لا بد ملء | `hooks.json` أو `hooks` key تخزين وضع إعداد settings ملف مسار |
| `pluginRoot` | — | استبدال أمر نص في `${CLAUDE_PLUGIN_ROOT}` |
| `projectDir` | جلسة مساحة العمل | استبدال `${CLAUDE_PROJECT_DIR}` و ضبط `CLAUDE_PROJECT_DIR` بيئة متغير |
| `defaultTimeoutMs` | `600,000` | hook لم ضبط وقت كل hook مهلة (أي Claude Code قيمة افتراضية) |
| `stderrSummaryMaxChars` | `500` | حفظ دائم `hook/result` stderr ملخص محرف حد أعلى |

توليد[إعداد دليل](../../../docs/config-catalog.zh.md#deepseek-aidsh-hooks-claude-code) هو كل تلقي دعم حمل حقل نفاد كل صيغة حق مصدر.

### أنت خطاف قدرة فعل ماذا

| أنت خطاف | وقت التشغيل آلة | قدرة فعل ماذا |
|---|---|---|
| `SessionStart` | جلسة بدء وقت | مرفق إضافة هذا جلسة في نموذج مرئي سياق |
| `UserPromptSubmit` | agent استلام إلى نص التوجيه وقت | منع سد نص التوجيه، أو مرفق إضافة سياق |
| `PreToolUse` | أداة تشغيل قبل | منع سد أداة، أو في تشغيل قبل طلب دفعة دقيق |
| `PostToolUse` | أداة تشغيل بعد | حمل عكس تغذية منع سد نتيجة، أو مرفق إضافة سياق |
| `Stop` | تشغيل أي سوف إيقاف وقت | حمل سبب قوي صنع مجددا تنفيذ واحد خطوة |
| `SubagentStart` | subagent بدء وقت | نحو ما زال في تشغيل subagent مرفق إضافة سياق (فقط حد نفس عملية) |
| `SubagentStop` | subagent انتهاء وقت | فقط مراقبة قياس——لا يستطيع منع سد أو إضافة سياق |

### خطاف مثل أي تشغيل و فشل

- خطاف في أنت مشروع دليل (agent جلسة مساحة العمل) في تشغيل، لذلك خطاف داخل `pwd` و متبادل مقابل مسار إشارة نحو أنت مشروع، بينما غير خادم بدء دليل.
- أمر نص في `${CLAUDE_PLUGIN_ROOT}` و `${CLAUDE_PROJECT_DIR}` سوف حسب أنت إعداد استبدال، كما كل خطاف عملية كل سوف ضبط `CLAUDE_PROJECT_DIR`.
- واحد نسخة إعداد تطبيق في كامل عملية: بدء وقت فقط قراءة مرة، متبادل مقابل `configPath` من بدء عملية دليل تحليل.
- نفس حدث فوق خطاف حسب إعداد ترتيب تدريجي عدد تشغيل.
- إذا إعداد لا يمكن قراءة أو تحليل، جسر وصل سوف سجل تحذير إبلاغ كما لا تشغيل أي خطاف——agent ما زال سوف بدء.
- تشغيل فشل خطاف (أمر خطأ أو انهيار انهيار) سوف يتم سجل،agent متابعة تشغيل.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا عقدة حل تفسير جسر وصل خلف بعد تصميم قرار، و إشارة خروج تنفيذ هو جمع شفرة موضع؛ يمكن مراقبة سلوك قد في[استخدام هذه الحزمة](#use-this-package) في كامل شرح.

### Hook نقطة خريطة

كل تلقي دعم حمل حدث كل موجه إلى واحد harness نقطة توسيع:`SessionStart` في أول عدد جولة قبل عبر يحتاج انتظار `agent/created` ابتدائي تحويل إضافة دخول سياق،`UserPromptSubmit` و `PreToolUse` هو قدرة رفض نقل دخول حركة عمل waterfall(شلال نشر صيغة حدث)(`agent/pre-step`،`tools/pre-execute`) ،`PostToolUse` هو قدرة حمل عكس تغذية منع سد أو نحو تحت تنقل قرار إضافة سياق waterfall(`tools/post-execute`) ،`Stop` هو سلسلة سطر مستمع، ذلك منع سد نتيجة عبر `steer()` قوي صنع مجددا تنفيذ واحد خطوة (`agent/turn-stopping`). اثنان عدد subagent حدث موجه إلى child دورة الحياة إرسال إطلاق (`subagent/start`،`subagent/end`):start نحو ما زال في تشغيل نفس عملية child حقن سياق،stop فقط مراقبة قياس. فقط توفير سياق hook مجموع هو أولا عبر `next()` تفويض حمل، مجددا يأخذ حمل مصدر رسالة طي دخول تحت تنقل قرار، لذلك لاحق مستمع ما زال يمكن رفض أو تعديل كتابة؛ منع سد قرار خريطة لـ `deny`(`PreToolUse` لـ `ask`). تدريجي حدث وصل خط يقع في [`src/index.ts`](src/index.ts).

### تحميل حمل و بيئة

جسر وصل من `session_id`، نص شكل `transcript_path`،`cwd` و `hook_event_name` أساس أساس حقل إضافة تدريجي حدث حقل بناء كل حدث stdin payload.`transcript_path` خروج في توافق صفة إبقاء في payload في، لكن بداية نهاية لـ `''`: حفظ دائم seam لا كشف ناتج مسار، كما افتراضي استخدام Zstandard ضغط جلسة سجل لا يمكن يتم hook نص برمجي قراءة. حذف `projectDir` وقت،`CLAUDE_PROJECT_DIR` حسب مرة افتراضي إلى جلسة مساحة العمل، و خطاف تشغيل دليل متسق؛`${CLAUDE_PLUGIN_ROOT}` و `${CLAUDE_PROJECT_DIR}` استبدال في إعداد تحليل وقت إجراء.

### Matcher subject و سلسلة سطر تنفيذ

matcher subject هو أداة اسم (`PreToolUse`/`PostToolUse`) ، جلسة مصدر (`SessionStart`) ، أو معتاد كمية `agent_type` `general-purpose`(`SubagentStart`/`SubagentStop`——subagent seam لا يحمل كل kind وسم) ؛`UserPromptSubmit` و `Stop` تجاهل اختصار matcher. مطابقة hook حسب إعداد ترتيب سلسلة سطر تشغيل، هذا جعل كل hook `hook/invoked`/`hook/result` مقابل في سجل في متبادل مجاور، كما الأكثر صارم إطار طي و ترتيب غير متصل (`deny > ask > allow`).

### انفصال مغادرة تشغيل و تحرير

ثلاثة عدد emit نقطة (`SessionStart`،`SubagentStart`،`SubagentStop`) بـ انفصال مغادرة طريقة تشغيل——لا يوجد نقطة توسيع انتظار هو جمع. كل بند تشغيل سلسلة كل سوف يتم تتبع أثر، مقابل جسر وصل تنفيذ dispose(مورد تحرير) وقت سوف في توقف ما زال في تشغيل hook عملية، و في dispose إتمام قبل ترتيب فارغ continuation(`createDetachedRuns`، يقع في `dsh-hook-protocol`).

### تصميم إدارة فكرة

- **توافق مهايئ، بينما غير قوي قوة أداة.** جسر وصل وجود معنى معنى هو تشغيل قائم Claude Code إعداد في صريح تلقي دعم حمل command hook فرعي تجميع؛ تحديد صنع سلوك ينبغي وضع في نفس دفعة نقطة توسيع فوق أصلي إضافة في.
- **إضافة سياق لا هل قرار.** فقط توفير سياق hook سوف أولا عبر `next()` تفويض حمل، مجددا يأخذ ذلك رسالة طي دخول تحت تنقل enter قرار، لذلك لاحق `agent/pre-step` أو `tools/post-execute` مستمع ما زال يمكن رفض أو تعديل كتابة.
- **كل فشل نقطة كل تلقي تحكم.** إعداد قراءة/تحليل فشل و بلا فاعلية matcher لا تسجيل أي محتوى؛ رمي استثناء انفصال مغادرة حقن سوف يتم التقاط و سجل، بينما لا هو كسر تالف جلسة بدء أو حلقة.
- **dispose يجب بلوغ إلى تماما توقف مستقر.** انفصال مغادرة تشغيل سوف يتم تتبع أثر و في تحرير وقت ترتيب فارغ، لذلك لن لديه hook عملية أو متأخر إلى عودة ضبط تجاوز خروج fiber تخزين نشط.
- **سلسلة سطر بينما غير تزامن.** مطابقة hook حسب إعداد ترتيب سلسلة سطر تشغيل: كل `hook/invoked`/`hook/result` مقابل في سجل في إبقاء متبادل مجاور، كما قرار طي و ترتيب غير متصل، لذلك نتيجة و مشاركة اعتبار جذب محرك تزامن بدء متسق، بديل قيمة هو سلسلة سطر تحويل تأخير متأخر.

[hook-bridges Agent Note](../../../.agents/notes/archived/feature/2026-06-30-hook-bridges.md) سجل جسر وصل تصميم و تأجيل نقص فتحة؛[hook-protocol-lib Agent Note](../../../.agents/notes/archived/feature/2026-06-30-hook-protocol-lib.md) سجل مشترك و تدريجي جهة قول تخطيط قسم.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | إضافة مدخل: إعداد تحقق، مستمع تسجيل، تدريجي حدث payload، قرار خريطة |
| [`src/config.ts`](src/config.ts) | Claude Code إعداد تحليل: تلقي دعم حمل حدث،matcher تحقق، أمر استبدال |
| — | لا إصدار وقت التشغيل ثابت صيغة مرافق توليد مدخل؛ هذا جسر وصل إصدار hook-protocol جلسة حدث، قائم companion مسؤول تحقق كل نتيجة الذي مرجع استدعاء حدث. |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

عند حزمة درجة اتفاق لا كاف استخدام وقت قراءة قراءة التالي صفحة. هو جمع من مشترك بروتوكول دخول جسر وصل تصميم، و جسر وصل الذي موجه إلى نقطة توسيع.

- [hooks مجموعة أرض رسم](../README.zh.md)——نفس درجة مجموعة صفحة و ذلك حزمة جدول.
- [hook بروتوكول مكتبة](../hook-protocol/README.zh.md)——هذا جسر وصل تطبيق مشترك خطاف قاعدة.
- [خطاف جسر وصل Agent Note](../../../.agents/notes/archived/feature/2026-06-30-hook-bridges.md)——جسر وصل تصميم، قرار خريطة و تأجيل نقص فتحة.
- [اعتراض قطع نقطة توسيع Agent Note](../../../.agents/notes/implemented/feature/2026-06-30-interception-extension-points.zh.md)——جسر وصل الذي خريطة نوع تحويل Decision واجهة وجه.
- [توليد إعداد دليل](../../../docs/config-catalog.zh.md#deepseek-aidsh-hooks-claude-code)——كل تلقي دعم حمل إعداد حقل و ذلك مصدر إعلان.

-----

<a id="model-experience"></a>
## تجربة النموذج

### Hook توفير سياق

#### نموذج يرى ماذا

`SessionStart`، قد قبول نص التوجيه، أداة بعد و فوري نفس عملية subagent-start hook يمكن إضافة حمل مصدر عودة بسبب سياق رسالة؛ منع سد `Stop` hook سوف سبب إضافة لـ تحت واحد خطوة steering(في طريق جذب توجيه). بعيد مسار child حقن لا يوجد محلي هدف.

#### Token أثر

hook لا إرجاع سياق وقت لا يوجد صار هذا.Hook نص أخذ قرار في بيانات، سوف يتم سجل، و في لاحق جلسة طلب في إعادة إرسال، مباشر إلى ضغط (compaction).

#### KV Cache أثر

فقط إلحاق؛ جديد مرئي محتوى يقع في يمكن إعادة استخدام طلب بادئة بعد، لن جعل قائم KV Cache بند بطلان.

### قد منع سد نص التوجيه أو أداة نتيجة

#### نموذج يرى ماذا

مزود توفير سبب تدريجي حرف نقل تمرير. ناقص سبب وقت، قد رفض أداة تغيير لـ `Error: blocked by PreToolUse hook`، قد منع سد أداة بعد عكس تغذية دقيق لـ `blocked by PostToolUse hook`، منع سد stop فإن دقيق إضافة steering `continue: blocked by Stop hook`؛ قد منع سد نص التوجيه لن إنتاج أي نموذج مرئي رسالة، بينما هو بـ `blocked` انتهاء هذا جولة.`systemMessage` و `updatedInput` سوف يتم سجل أو تحذير إبلاغ، لكن في هذا تنفيذ في مقابل نموذج غير ممكن رؤية.

#### Token أثر

منع سد نص التوجيه لن إنتاج هذا نص التوجيه مقابل نموذج طلب token؛ رفض أو عكس تغذية سوف إضافة إبقاء رجوع أو مزود نص؛ قوي صنع continuation حاجة آخر عدد كامل طلب.

#### KV Cache أثر

قد منع سد نص التوجيه لا إرسال طلب، لن توجيه يؤدي بطلان. رفض، عكس تغذية و قوي صنع continuation سياق سوف إلحاق في يمكن إعادة استخدام بادئة بعد، لا تعديل كتابة بادئة.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>


هذه حد وصف أنت Claude Code خطاف هدف قبل أيضا لا يمكن عبر هذا جسر وصل فعل إلى أمر حال، و سلوك و مشاركة اعتبار أداة فرق مختلف. هو جمع هو حالي حزمة قيد، بينما غير مهمة تراكم ضغط.

- **لا دعم حمل hook حدث (Claude Code حالي 30 بند في 23 بند)**——`Setup`،`InstructionsLoaded`،`UserPromptExpansion`،`MessageDisplay`،`PermissionRequest`،`PostToolUseFailure`،`PostToolBatch`،`PermissionDenied`،`Notification`،`TaskCreated`،`TaskCompleted`،`StopFailure`،`TeammateIdle`،`ConfigChange`،`CwdChanged`،`FileChanged`،`WorktreeCreate`،`WorktreeRemove`،`PreCompact`،`PostCompact`،`SessionEnd`،`Elicitation` و `ElicitationResult`. هذه حدث إعداد سوف في إعداد مجموعة تحليل قبل يتم تجاهل اختصار، لذلك لا دعم حمل حدث حيث لن جعل إعداد بطلان، أيضا لن تسجيل hook. مقارنة مقارنة أساس خط هو Claude Code [رسمي جهة hook حدث مشاركة اعتبار](https://code.claude.com/docs/en/hooks#hook-events).
- **`SessionStart` فقط دعم حمل جزء وظيفة**——سوف إزالة استهلاك JSON `additionalContext`، لكن لا دعم حمل صاف stdout سياق،`initialUserMessage`،`sessionTitle`،`watchPaths`،`reloadSkills` و `CLAUDE_ENV_FILE`.hook انفصال مغادرة تشغيل، لذلك سياق ممكن خطأ مرور رقم واحد طلب،payload سوف حذف `model`،`agent_type` و `session_title` انتظار اختياري حقل.
- **`UserPromptSubmit` فقط دعم حمل جزء وظيفة**——دعم حمل منع سد و JSON `additionalContext`، لكن لا دعم حمل صاف stdout سياق،`sessionTitle` و `suppressOriginalPrompt`. حذف غير يتم تغطية، لا فإن جسر وصل أيضا سوف استخدام ذاته 600 ثانية قيمة افتراضية، بينما غير Claude Code حدث خاص تحديد 30 ثانية command مهلة.
- **`PreToolUse` فقط دعم حمل جزء وظيفة**——`deny` و `ask` قرار متاح؛`allow` لن مسبق مراجعة دفعة،`defer` لا تلقي دعم حمل،`additionalContext` سوف يتم تجاهل اختصار،`updatedInput` سوف يتم سجل + تحذير إبلاغ لكن لا تطبيق (رؤية [pre-tool-input-rewrite Agent Note](../../../.agents/notes/proposed/feature/2026-06-30-pre-tool-input-rewrite.zh.md)).
- **`PostToolUse` فقط دعم حمل جزء وظيفة**——دعم حمل منع سد عكس تغذية و JSON `additionalContext`، لكن لا دعم حمل `updatedToolOutput` و `updatedMCPToolOutput`،`tool_response` سوف عرض مستو لـ نص.
- **`SubagentStart` و `SubagentStop` فقط دعم حمل جزء وظيفة**——اثنان من متساو تقرير إبلاغ معتاد كمية `agent_type` `general-purpose`، و في Claude Code تقرير إبلاغ أب جلسة موضع استخدام child جلسة id.Start سياق هو كل قوة بينما لـ، كما فقط قدرة وصول ما زال في تشغيل نفس عملية child؛stop فقط مراقبة قياس، لا يمكن منع سد subagent أو نحو ذلك توفير سياق.Stop حذف `agent_transcript_path`،`last_assistant_message`،`background_tasks` و `session_crons`، و بداية نهاية تقرير إبلاغ `stop_hook_active: false`.
- **`Stop` فقط دعم حمل جزء وظيفة**——منع سد سوف قوي صنع آخر عدد نموذج جولة، لكن `stop_hook_active` بداية نهاية لـ `false`، سوف حذف `last_assistant_message`،`background_tasks` و `session_crons`، كما لم تنفيذ وصل متابعة منع سد حد أعلى. لذلك، بلا شرط منع سد hook سوف في كل خطوة في قوي صنع continuation، حذف غير هو ذاتي أنا حد.
- **عام payload و إخراج حقل فقط دعم حمل جزء وظيفة**——قد خريطة حدث سوف حذف Claude Code أصل هذا سوف توفير `prompt_id`،`permission_mode` و `effort`، كما `transcript_path` دائم لا ملء ملء: هو بداية نهاية لـ فارغ نص، لأن حفظ دائم seam لا كشف ناتج مسار، كما افتراضي استخدام Zstandard ضغط جلسة سجل لا يمكن يتم hook نص برمجي قراءة.`systemMessage` سوف يتم سجل + تحذير إبلاغ لكن لا عرض؛`{"continue": false}` سوف يتم سجل لكن لن إيقاف تشغيل؛`suppressOutput`،`stopReason` و `terminalSequence` لن يتم تطبيق.
- **Handler و إعداد فقط دعم حمل جزء وظيفة**——فقط تشغيل shell شكل command handler. سوف قفز مرور `http`،`mcp_tool`،`prompt` و `agent` handler؛`args`،`async`،`asyncRewake`،`shell`،`if`،`once` و `statusMessage` انتظار command handler خيار لن يتم التزام دوران. مطابقة handler سلسلة سطر تشغيل كما لا ذهاب إعادة، بينما Claude Code سوف و سطر تشغيل و مقابل نفسه handler ذهاب إعادة. واحد عملية درجة `configPath` سوف في تحميل وقت تحليل مرة؛ بعد لم تنفيذ Claude Code قسم طبقة مشروع، مستخدم، إضافة و سياسة اكتشاف و فوري إعادة تحميل.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

هذا ملاحظة تطوير هو صيانة من عمل سياق: فتح وضع مشكلة و بعد لم قرار استكشاف جهة نحو. هو واضح لا أداة مرجعي صفة——قد تسليم سلوك، حد و حيث تحديد إدارة من بـ فوق نص، حزمة شفرة و متبادل صلة Agent Note لـ دقيق.

فوق وجه تأجيل نقص فتحة حينئذ هو عمل طابور صف: حسب جلسة hook إعداد اكتشاف، جلسة بدء إلقاء تمرير باب،stop حلقة منع حماية، و `continue: false` تشغيل درجة إيقاف. هدف قبل متساو بلا تصميم؛ رسمي جهة Claude Code مشاركة اعتبار هو تنفيذ منها أي واحد بند أساس خط.

</details>

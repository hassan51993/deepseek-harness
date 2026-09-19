# Agent Note: قطع قص بلا استخدام عام و نتيجة واجهة

Status: rejected — stale 2026-07 inventory: rows were pruned piecemeal or gained callers; a fresh audit must supersede it

[English](2026-07-04-prune-dead-core-spine-api.md) | العربية

## مشكلة

إذا جاف حزمة أصل توجيه خروج، نتيجة حقل و سهل فائدة طريقة لا يوجد إنتاج مستهلك. هو جمع لـ الذي بـ تخزين نشط، يلزم ما هو لأن اختبار عبر عام مدخل استيراد داخلي تنفيذ، يلزم ما هو لأن بعض عدد نوع مسبق مدة واحد من لم ظهور استدعاء من. كل واحد بند مفرد وحيد نظر كل جدا صغير، لكن دمج في واحد بدء، هو جمع توسيع كبير SDK اتفاق، توليد catalog، وثيقة و ارتداد مستطيل دفعة، لكن لا يوجد دعم دعم أي قد تسليم مسار.

إنتاج لغة مادة مكتبة هو `packages/*/*/src`، عرض مثال شفرة المصدر/إعداد و وقت التشغيل نص برمجي. اختبار، حزمة README و Agent Note سطر نص هو إصدار دليل، لكن لا هو ثابت استدعاء من.`cordis_inspect` جعل `packages/extensions/tool-cordis/src/api-catalog.ts` مقابل نموذج مرئي،`cordis_mount` يمكن عبر تلقي حفظ حماية حقيقي خدمة بديل إدارة استدعاء حقن خدمة، لذلك catalog في خدمة طريقة و إرجاع شكل حالة هو حق صحيح حركة حالة منتج واجهة. تحت جدول لذلك منطقة قسم «لا يوجد ثابت مستودع استدعاء من» و «غير ممكن بلوغ»: تعلق و catalog مفردات سطر متعمد استلام تقليص نموذج تحرير كتابة mount قدرة اكتشاف و استدعاء محتوى، بينما حزمة أصل تنفيذ مساعد مساعدة دالة و لا عبر هذا خدمة باب وجه يمكن بلوغ. دقيق رمز رقم بحث نيل خروج التالي بيان:

| واجهة | إنتاج دليل | بسيط تحويل طريقة |
| --- | --- | --- |
| `SurfaceManager.invalidate()` | فقط لديه ذلك اختبار وحدة استدعاء هو؛seeding في كسول صفة إنشاء manager وجود قبل حينئذ قد إتمام، كما جلسة من لا استبدال ذلك سجل مرجع. | حذف هو و ذلك غير ممكن قدرة إطلاق كامل جسم استبدال اتفاق. |
| `ToolExecutionResult.callId` | كل خطاف قد استقبال غير ممكن تغيير `ToolExecution`؛ حلقة و ACP(Agent Client Protocol) عبر استدعاء/جلسة حدث صلة ربط. لا يوجد مستهلك قراءة هذا عدد تكرار نتيجة حقل. | إزالة هذا حقل، نسخ/لا مطابقة حراسة حماية، و إثبات هذا تكرار غير ممكن قدرة لا متسق اختبار. |
| `ReactLoopAgent` أصل توجيه خروج | حزمة خارج تسمية استيراد كل هو اختبار؛ إنتاج شفرة موجه إلى `Agent` تحرير مسار، عبر `ctx.agents` إنشاء/استعادة. | سوف إرجاع نوع و واجهة نوع ضبط لـ `Agent`، سوف أداة جسم حلقة صنف تعديل لـ حزمة داخلي؛ إبقاء متعمد تصميم تزامن، فقط إعداد `AgentLoop.create()` مسار. |
| `workflow-worker-thread` protocol/runtime/session مجددا توجيه خروج و تسمية `WorkerThreadWorkflowEngine` | كل عبر حزمة اسم استيراد مستهلك كل استخدام افتراضي جذب محرك؛ سير العمل Agent Note قد سوف worker بروتوكول صيغة (wire format) تعريف لـ خاص. | إبقاء افتراضي إضافة صنف/إعداد اتفاق؛ إزالة تكرار تسمية صنف توجيه خروج، سوف بروتوكول وحدة إبقاء لـ شفرة المصدر خاص. |
| `ptc-runtime-worker` protocol/bootstrap مجددا توجيه خروج | حزمة خارج إنتاج/e2e مستهلك استخدام `NodePtcRuntime` و إعداد، بينما غير `BootstrapPort`،`PatchableStream` أو worker رسالة/بدء نوع. | إبقاء وقت التشغيل صنف/إعداد اتفاق، سوف ذلك بروتوكول صيغة/bootstrap مفردات تعديل لـ شفرة المصدر خاص. |
| ACP `agentOptions` أصل توجيه خروج | هذا مساعد مساعدة دالة فقط لديه نفس ملف و ACP اختبار مستهلك؛ وحيد حزمة خارج إنتاج مستهلك تركيب هو إضافة نطاق الأسماء. | إبقاء `name`،`inject`،`Config`،`AcpConfig` و `apply`؛ سوف `agentOptions` تعديل لـ شفرة المصدر خاص، عبر جسر وصل طبقة سلوك اختبار. |
| `providerWording` و `completedTurnPrefix` أصل توجيه خروج | كل لديه واحد نفس حزمة إنتاج استدعاء من؛ فقط لديه balanced-prefix مساعد مساعدة دالة لديه واحد نفس حزمة أبيض صندوق اختبار. | تعديل لـ شفرة المصدر خاص، اختبار مزود سلوك. |
| `depthOf`،`SubagentDepthError`،`waitForExit` و `exitsWithin` أصل توجيه خروج | إنتاج subagent خلفية إزالة استهلاك هو عملية داخل runner و عملية فرعية بنية صنع/dispose(مورد تحرير) مساعد مساعدة دالة، بينما غير هذه قوي صنع آلية و اختبار داخلي تنفيذ.`SENSITIVE_ENV_PATTERN` لا في منها، لأن SDK helper سوف سوف هو تطبيق في استدعاء جهة نقل دخول بيئة. | إبقاء عميق درجة و خروج سلوك، لكن سوف باق بقية مساعد مساعدة دالة و error تعديل لـ شفرة المصدر خاص؛ عبر spawn و dispose اختبار. إبقاء مشترك اعتماد صحيح فإن عام. |
| `LlmError.status` و إعادة تشغيل status | مهايئ/إعادة تشغيل ملء ملء هو، لكن إنتاج فرع أساس في مستقر رمز خطأ/رسالة حكم قطع، من لا قراءة أصلي status. | إزالة لم قراءة حقل و إعادة تشغيل إدارة طريق، إبقاء خطأ تصنيف. |
| `BlockAssembler.push()` قيمة راجعة | اثنان عدد إنتاج استدعاء من كل تجاهل اختصار إرجاع قد إتمام كتلة. | إرجاع `void`؛ إبقاء متعمد عام `blocks()`/`message()` اتفاق. |
| `compactRegion` مستقل `session` معامل | ثابت استدعاء جهة نقل دخول كائن حينئذ هو `agent.session` في قد لديه كائن؛ نموذج مرئي mount API أيضا يمكن استدعاء هذا طريقة، لكن معا قبول اثنان عدد مستقل كائن، سوف يجعل تركيب إضافة نقل دخول لا متسق تركيب. | إبقاء يد حركة region API، معا متعمد سوف ذلك استلام ضيق لـ بـ `agent.session` لـ وحيد حق مصدر. |
| `CompactionResult.startSeq`،`summarySeq`،`endSeq` و `summary` | إنتاج مستهلك فقط قراءة shadowed range/seq/token موحد حساب؛ حمل دائم سجل يملك summary و حدث معرف. | إزالة أربعة عدد نتيجة عودة إظهار، إبقاء اثنان عدد مشترك transcript(نص سجل) مصير. |
| `BasicCompactionEngine` تقدير حساب/ملخص طريقة مرئي صفة | لا يوجد حزمة خارج إنتاج استدعاء من استدعاء هذا خمسة عدد طريقة؛ قد تنفيذ Agent Note فقط سوف `estimateContentTokens()` و `summarize()` تسمية لـ فرعي صنف خطاف. | سوف هذا اثنان عدد طريقة تعديل لـ `protected`، ذلك بقية ثلاثة عدد تحرير ترتيب مخصص استخدام تقدير حساب جهاز تعديل لـ private. |
| `CodeLogEntry.source`/`level` و `RunCodeMeta.dispatches` | كل إنتاج مستهلك كل سوف سجل خريطة لـ نص؛ لا يوجد presenter/نموذج مسار قراءة أخرى حقل أو حفظ دائم dispatch حساب عدد. | سوف ptc-runtime سجل تعديل لـ نص (أو صاف نص بند) ، إزالة result-meta dispatch إدارة طريق؛ إبقاء لأجل توليد تحديد صفة dispatch id محلي حساب عدد جهاز. |
| `PtcRuntime.language` و `PtcRuntime.isolation` | worker خلفية توفير وحيد إنتاج قيمة، بينما PTC mode و أخرى كل إنتاج استدعاء جهة فقط استدعاء `run()`. | إزالة لم قراءة وصف رمز، معا إبقاء worker لغة، عزل، ميزانية، إلغاء و مورد تحرير سلوك. |
| `ToolNotFoundError.toolName`،`SystemPrompt.config` و `BashTask.command` | كل تخزين عام قيمة كل لا يوجد إنتاج قراءة من. | إزالة لم قراءة حقل، إبقاء خطأ رسالة، قد تحليل إعداد سلوك و مهمة دورة الحياة. |
| خلفية حزمة أصل تنفيذ مساعد مساعدة دالة | تحت جهة دقيق بيان فقط عبر متبادل مقابل مسار نفس حزمة استيراد استدعاء. إنتاج نطاق الأسماء استيراد تركيب هو إبقاء إضافة اتفاق، لا قراءة هذه خاصية؛ حزمة أصل تسمية استيراد مستهلك كل هو اختبار. | إبقاء كل مهايئ/مزود/خدمة و ذلك إعداد/خطأ اتفاق؛ إيقاف في حزمة أصل توجيه خروج الذي صف مساعد مساعدة دالة/معتاد كمية. |
| مستهلك حزمة أصل تنفيذ مساعد مساعدة دالة | تحت جهة دقيق بيان فقط لديه نفس حزمة إنتاج استدعاء من. إنتاج نطاق الأسماء استيراد تركيب هو إضافة اتفاق، لا قراءة مساعد مساعدة خاصية؛ حزمة أصل تسمية استيراد مستهلك كل هو اختبار. | إبقاء إضافة اتفاق و مستقر رمز خطأ؛ سوف اختبار ترحيل إلى حزمة داخل وحدة أو عام سلوك، إيقاف في حزمة أصل توجيه خروج الذي صف مساعد مساعدة دالة. |

### قسم مجموعة مساعد مساعدة توجيه خروج بيان

- `dsh-llm-deepseek`:`httpErrorCode`،`serializeMessages`،`serializeRequest`،`DONE`،`parseSse`،`mapFinishReason`،`mapUsage` و `translate`؛`dsh-llm-pi-ai`:`buildModel`،`mapStopReason`،`mapUsage`،`toPiContext` و `toStreamChunks`.
- `dsh-bash-local`:`DEFAULT_GRACE_MS`،`ENV_OVERRIDES`،`killGroup`،`OutputCollector` و `runBash`؛`dsh-bash-sandbox`:`shellQuote`،`classifyDenial` و `classifyRunnerFailure`؛`dsh-sandbox-local`:`bwrapProfileArgs`،`landlockProfileArgs` و `seatbeltProfileArgs`. عام متغير اختبار حقن حقل و ذلك نوع لا في هذا رفع سجل نطاق داخل.
- `dsh-fs-local`:`applyLiteralEdit`،`listDirectory`،`probe`،`readForEdit`،`readTextForDiff`،`readWholeText`،`resolveLocalTarget`،`restoreLineEndings`،`streamWholeText` و `writeFileAtomic`.
- `dsh-web-fetch-http`:`classifyContentType`،`decoderForCharset`،`isSameOrigin`،`parseCharset` و `validateFetchUrl`؛`dsh-web-search-exa`:`mapExaResponse` و `mapExaResult`؛`dsh-web-search-deepseek`:`citationSnippets` و `mapAnthropicResponse`؛`dsh-web-search-perplexity`:`mapPerplexityResponse` و `mapPerplexityResult`.
- `dsh-tool-fs`:`READ_LIMIT`،`STREAM_MIN_SIZE`،`READ_MAX_BYTES`،`READ_MAX_LINE_LENGTH`،`DIFF_CONTEXT`،`applyReadTool`،`parseReadArgs`،`applyWriteTool`،`formatWriteOutput`،`parseWriteArgs`،`applyEditTool`،`formatEditOutput`،`parseEditArgs`،`buildWindow`،`formatReadOutput`،`computeHunkDiffs` و `diffsFromMeta`.
- `dsh-tool-web`:`WEB_SEARCH_MAX_RESULTS`،`applyWebSearchTool`،`formatSearchOutput`،`parseSearchArgs`،`presentSearchCall`،`applyWebFetchTool`،`formatFetchOutput`،`parseFetchArgs`،`presentFetchCall`،`renderBody` و `htmlToMarkdown`؛`dsh-tool-call-timeout-policy`:`toolTimeoutResult`؛`dsh-compaction-basic`:`resolveConfig`؛`dsh-tool-bash`:`renderResult`.

## رفع سجل

بـ مرة محدود، تنسيق ضبط عام واجهة تنظيف، إزالة أو تخفيض فوق وصف كل واحد سطر. تزامن تحديث حزمة README،JSDoc، توليد API/حدث catalog،type-equiv سجل، لا بد يلزم exports map و اختبار، جعل اختبار عبر الذي تابع عام اتفاق تحقق سلوك، بينما غير إبقاء فقط لـ اختبار بينما وجود مدخل. لا طي أي قدرة seam،LLM(كبير لغة نموذج) مهايئ، حفظ دائم provider أو دورة الحياة تماما توقف مستقر اتفاق.

## سبق اعتبار بديل خطة

**إبقاء اختبار سهل فائدة دالة و ذاتي يتضمن نتيجة حقل لـ عام.** عام مساعد مساعدة دالة يمكن يجعل أبيض صندوق اختبار أكثر جهة سهل، ذاتي يتضمن نتيجة حقل نظر بدء قدوم أكثر سهل استخدام، لم قدوم تضمين دخول من ممكن حاجة أداة جسم حلقة صنف أو قطعة رفع طريقة. هذه جيد موضع هو زائف ضبط صفة؛ إبقاء هو جمع سوف يجعل كل موضع تنفيذ و وثيقة كل يلزم حل تفسير لا يوجد قد تسليم استدعاء من قدرة مراقبة إلى حالة. حق صحيح مستهلك يمكن جذب دخول هو الذي يحتاج الأكثر صغير اتفاق، ذلك كل حق و فشل دلالة واضح.

**إبقاء كل catalog عضو بـ توفير نموذج تحرير كتابة mount استخدام.** ذاتي مرجع أداة تجميع هو واحد بند حقيقي عام إزالة استهلاك مسار، بينما غير توليد وثيقة ضجيج صوت. لكن بينما، هو قيمة قيمة قدوم ذاتي دقيق تأكيد، يمكن تركيب خدمة واجهة، بينما غير بلا حد مدة إبقاء تكرار حقل أو لا متسق معامل مقابل؛ فوق وصف كل واحد بند catalog استلام تقليص كل إزالة في نفس مرة تنفيذ، نفس عدد agent(ذكي جسم) أو نفس نتيجة في أخرى موضع قد يمكن نيل نيل واقع، و في نفس تغيير في تحديث API مشاركة اعتبار.

## تحقق استلام معيار

- دقيق رمز رقم بحث عرض: في هذا Agent Note و أي مقابل قد تنفيذ Agent Note إصلاح صحيح خارج، لا يوجد يتم إزالة واجهة.
- هذا Agent Note صف خروج كل واجهة متساو حسب إشارة تحديد طريقة إزالة أو تخفيض؛ بيان خارج متعمد إبقاء توسيع/اختبار اتفاق ثابت.
- أداة تنفيذ، سياق ضغط (context compaction) ، اثنان عدد LLM مهايئ، حفظ دائم provider، سير العمل عزل و agent إنشاء/استعادة إبقاء ذلك قد تسليم سلوك.
- نوع فحص، نسبة التغطية، لقطة،doc-sync(وثيقة تزامن بوابة) ،module-graph تحقق، بناء و hygiene عبر.

## ريح خطر

كبير كثير عدد إزالة في تحرير ترجمة وقت مرئي لكن مقابل وقت التشغيل بلا أثر. سياق ضغط معامل تنظيف متعمد منع توقف جلسة/سياق لا مطابقة، معا إبقاء يد حركة region API. خارجي مسبق إصدار تضمين دخول من و قائم نموذج تحرير كتابة mount ممكن استيراد أكثر قليل مساعد مساعدة دالة، نقل تمرير أكثر قليل معامل أو استقبال أكثر ضيق نتيجة شكل حالة؛ هذا هو متعمد منتج واجهة استلام تقليص، بينما غير فقط فقط هو توليد catalog تنظيف. مستودع بعد لم إصدار، لذلك تحمل تحميل لا تلقي دعم حمل واجهة عندئذ هو أكثر كبير أساس أساس صار هذا.

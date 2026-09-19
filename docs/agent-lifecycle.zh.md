<!-- إنجليزي نص مصدر ملف من scripts/gen-doc-graphs.ts توليد؛ هذا العربية ملف هو عبر مزدوج لغة إعداد مقابل صيانة مرور مراجعة مقابل جانب.
     تحديث وقت أولا تشغيل `pnpm run gen-doc-graphs` تحديث إنجليزي نص، مجددا تحديث هذا ملف و تشغيل `pnpm run verify-translation-pairing --write docs/agent-lifecycle.md` إعادة سجل إعداد مقابل. -->

# Agent جولة و خطوة دورة الحياة

[English](agent-lifecycle.md) | العربية

هذا وقت ترتيب رسم هو [architecture.md](architecture.zh.md#turn-flow) إعداد طقم رسم عرض. حمل دائم إعادة تشغيل واقع حفظ في `session/event` في، فوري تحكم و حالة فإن حفظ في `agent/*` في.

```mermaid
sequenceDiagram
  participant User
  participant Agent
  participant Driver
  participant Hooks as hook listeners
  participant Prompt as ctx.systemPrompt
  participant LLM as ctx.llm
  participant Tools as ctx.tools
  participant Session
  participant SDK as UI or SDK listener
  User->>Agent: followup(content)
  Agent-->>SDK: <code>agent/inbox/spliced</code>
  Agent-->>SDK: <code>agent/inbox/inserted</code> { message }
  Agent->>Driver: queued work wakes driver
  Driver-->>SDK: <code>agent/status</code> running
  Driver->>Session: <code>turn/start</code>
  Note over Agent,Driver: claim pending next-step input plus one queued prompt
  Driver-->>SDK: <code>agent/inbox/spliced</code> pure deletion
  Driver-->>SDK: <code>agent/inbox/claimed</code> { message, turn } per message
  Driver->>Prompt: <code>system-prompt/assemble</code> waterfall
  Driver->>Hooks: <code>agent/pre-step</code> waterfall
  Hooks-->>Driver: authoritative reject or enter(messages)
  alt proposed step rejected, first batch empty, or pre-step failed
    Driver-->>Driver: claimed batch stays removed, the open turn spends no step
  else enter proposed step
  Driver->>Session: <code>step/start</code>
  Driver->>Hooks: <code>agent/request</code> waterfall
  Driver->>LLM: prepareCall(config, signal)
  Note over Driver,LLM: cancellation during either async phase commits neither system nor users
  Note over Driver,Session: synchronous admission using the prepared call capability
  Driver->>Session: <code>system/message</code> ordered per-node reconciliation
  Driver->>Session: <code>user/message</code> per entered message
  Driver->>Session: <code>request/header</code> and <code>request/context</code> as needed
  Driver->>Driver: derive and freeze request from the log
  Driver->>LLM: bound prepared call through <code>llm/stream</code> waterfall
  LLM-->>Driver: StreamChunk*
  Driver-->>SDK: <code>agent/assistant-stream</code> chunk*
  alt final adapter or terminal in-band request failure
    Driver->>Session: <code>assistant/attempt</code>
    Driver-->>SDK: <code>agent/assistant-stream</code> committed end
    Driver->>Hooks: <code>agent/request-error</code> waterfall
    Hooks-->>Driver: return retry action or preserve the original error
    Note over Driver,LLM: retry in the open step: prepare and reconcile the same rendered assembly without repeating pre-step or users
  else model request succeeded
  Driver->>Session: <code>assistant/message</code>
  Driver-->>SDK: <code>agent/assistant-stream</code> committed end
  Driver->>Tools: classify pending call by executionMode
  loop barriers and bounded rolling pool, reclassify before start
    opt call starts
      Driver->>Session: <code>tool/call</code>
      Driver->>Tools: ordered pre, concurrent execute
      Tools-->>Session: tool-owned events when applicable
    end
    opt next model-order result ready
      Driver->>Tools: ordered post
      Driver->>Session: <code>tool/result</code>
    end
  end
  Driver->>Session: <code>step/end</code>
  opt natural stop and next-step inbox empty
    Driver->>Hooks: <code>agent/turn-stopping</code> serial terminal checkpoint
  end
  opt next-step input is pending
    Driver-->>Driver: claim pending next-step input
    Driver-->>SDK: <code>agent/inbox/claimed</code> { message, turn } per message
    Driver->>Hooks: <code>agent/pre-step</code> waterfall
    Hooks-->>Driver: authoritative reject or enter(messages)
  end
  end
  end
  Driver->>Session: <code>turn/end</code>
  Driver-->>SDK: <code>agent/status</code> idle
```

`assistant/message` حدث سوف سجل كل مرة نجاح مزود استدعاء، يشمل إرجاع فارغ محتوى أو بـ `max-tokens` انتهاء استدعاء، و تضمين دخول دقيق ضيق تجميع حمل وقت stream. فارغ محتوى لن دخول إرسال توليد تاريخ. فشل، إعادة محاولة، إلغاء أو stream error attempt وصول settlement وقت، إذا لا يوجد surface message، حينئذ سوف يأخذ stream سجل لـ `assistant/attempt`. فوري `agent/assistant-stream` chunk frame هو لحظة حالة بيانات؛ إعادة تشغيل قراءة مهمة واحد نوع حمل دائم settlement، إذا عملية في settlement قبل صلب في قطع، فإن لن إبقاء تحت حمل دائم attempt stream.

`dsh-compaction-basic` في إرسال توليد طلب قبل عبر `agent/pre-step` معالجة ضغط قوة، بينما `agent/request-error` فقط لأجل مواصفة سياق فيض خروج. مهمة واحد إطلاق شرط ممتلئ كاف بعد، نظام كل سوف أولا تنفيذ اختياري أداة نتيجة قص غصن، مجددا اختيار ملخص. استعادة حدوث في ما زال فتح خطوة داخل، فقط لديه قص غصن أو ملخص توليد دفع دخول surface replacement generation وقت عندئذ إعادة محاولة، لا فإن ما زال بـ أصلي طلب خطأ لـ دقيق. كل مرة إعادة محاولة كل سوف دقيق تجهيز استدعاء، و في إرسال توليد طلب قبل تنسيق ضبط إبقاء قد تصيير تجميع نتيجة، لا تكرار تجميع،pre-step أو مستخدم رسالة دقيق دخول.

بـ إرجاع `agent/pre-step` قرار لـ دقيق؛ عبر حزمة تركيب `next()` مستمع سوف إبقاء تحت تنقل رسالة و `startsRequestSeries`، حذف غير متعمد استبدال.steering(في طريق جذب توجيه) و حقن سياق في لاحق إقرار قيادة عملية أخذ نيل ذلك تحت واحد خطوة دفعة مرة بعد، سوف مرور مرور نفس waterfall(شلال نشر صيغة حدث).

حاجة يمكن إعادة تشغيل transcript(نص سجل) بيانات SDK مستخدم ينبغي عند إزالة استهلاك `session/event`؛`agent/*` هو لأجل طابور صف و حالة، نص التوجيه اعتراض قطع، طلب بنية صنع،steering، متابعة تنفيذ و خطأ معالجة فوري تنسيق ضبط واجهة.

صيانة نمط: إنجليزي نص مصدر ملف يتضمن شخص عمل صيانة Mermaid وقت ترتيب رسم، و من توليد جهاز كتابة خروج؛ هذا العربية ملف بصفة مرور مراجعة مقابل جانب عبر مزدوج لغة إعداد مقابل صيانة. تأكيد قطع حدث توقيع يقع في توليد Cordis دليل في.

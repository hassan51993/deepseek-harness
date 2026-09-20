<!-- النصُّ الإنجليزي مولَّد من scripts/gen-doc-graphs.ts؛ وهذا الملف العربي يُصان يدويًا ويُقرن به عبر سجل الاقتران الثنائي اللغة.
     عند التحديث، شغّل `pnpm run gen-doc-graphs` أولًا لتحديث النص الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/agent-lifecycle.md` لإعادة تسجيل الاقتران. -->

# دورة حياة جولة الوكيل وخطوته

[English](agent-lifecycle.md) | العربية

رسمُ التسلسل هذا هو الرفيقُ المرئي لـ[architecture.md](architecture.ar.md#turn-flow). وهو يُبقي حقائقَ إعادة التشغيل الدائمة على `session/event`، ويُبقي التحكمَ والحالةَ الحيين على `agent/*`.

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

يسجّل حدثُ `assistant/message` كلَّ نداء مزوّد ناجح، بما فيه النداءاتُ بلا محتوى والنداءاتُ المنتهية بـ`max-tokens`، ويضمّن المجرى الموقوت المضغوط بعينه. ويبقى المحتوى الفارغ خارج التاريخ المشتق. أما المحاولةُ الفاشلة أو المعادة أو الملغاة أو التي انتهت بخطأ بث وبلغت الاستقرارَ بلا رسالة سطح فتسجّل مجراها بوصفه `assistant/attempt`. وإطاراتُ قطع `agent/assistant-stream` الحية عابرة؛ وتقرأ إعادةُ التشغيل أيَّ الاستقرارين الدائمين، ولا يُبقي فقدُ العملية القاسي قبل الاستقرار مجرى محاولة دائمًا.

تستعمل `dsh-compaction-basic` حدثَ `agent/pre-step` للضغط قبل اشتقاق الطلب، وتستعمل `agent/request-error` لطفح السياق المعياري وحده. وحالما يتأهل أيُّ المُطلِقين، يعمل تشذيبُ نتائج الأدوات الاختياري قبل انتقاء الملخص. ويعمل التعافي داخل الخطوة المفتوحة ولا يعيد المحاولةَ إلا حين يقدّم التشذيبُ أو التلخيصُ جيلَ استبدال السطح؛ وإلا بقي خطأُ الطلب الأصلي هو المرجع. وتُعدّ كلُّ إعادة محاولة نداءَها وتوفّق التجميعَ المعروض المحفوظ قبل اشتقاق الطلب، بلا إعادة التجميع ولا الخطوةِ التمهيدية ولا قبولِ رسائل المستخدم.

وقرارُ `agent/pre-step` المعاد هو المرجع؛ ويحفظ المستمعون الذين يغلّفون `next()` الرسائلَ التالية و`startsRequestSeries` ما لم يكن الاستبدالُ مقصودًا. ويمرّ التوجيهُ والسياقُ المحقون عبر الشلال نفسِه بعد أن تأخذ عمليةُ ادعاء لاحقة دفعتَهما في الخطوة التالية.

وعلى مستخدمي SDK الذين يحتاجون إلى بيانات نص قابلة لإعادة التشغيل أن يستهلكوا `session/event`؛ أما `agent/*` فهي واجهةُ التنسيق الحية للطابور والحالة، ولاعتراض المطالبة، وبناءِ الطلب، والتوجيه، والمتابعة، والأخطاء.

وضعُ الصيانة: رسمُ تسلسل Mermaid مؤلَّف يدويًا؛ وتوقيعاتُ الأحداث الدقيقة في دليل Cordis المولَّد.

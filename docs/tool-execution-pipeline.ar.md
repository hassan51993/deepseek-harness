<!-- النصُّ الإنجليزي مولَّد من scripts/gen-doc-graphs.ts؛ وهذا الملف العربي يُصان يدويًا ويُقرن به عبر سجل الاقتران الثنائي اللغة.
     عند التحديث، شغّل `pnpm run gen-doc-graphs` أولًا لتحديث النص الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/tool-execution-pipeline.md` لإعادة تسجيل الاقتران. -->

# مسار تنفيذ الأدوات

[English](tool-execution-pipeline.md) | العربية

يعرض هذا الرسمُ أين تعمل السياسةُ والخطّافاتُ والعزلُ وحرّاسُ نظام الملفات وإعادةُ كتابة النتائج ومراقبةُ الحصيلة النهائية والعرضُ في الواجهة بلا تغيير الحلقة. ويعمل شلالُ `tools/pre-execute` أولًا، ثم الحرّاسُ التصاعديون، ثم شلالا `tools/execute` و`tools/post-execute`؛ وللشلالات الثلاثة أن تحوّل نداءً. ويعمل بعدها `finalizeContent` الذي يملكه التعريفُ و`tools/result`.

```mermaid
flowchart TD
  model["Assistant message contains tool-call block"]
  toolCall["Session event: <code>tool/call</code><br/>logged before execution"]
  presentCall["UI pending card<br/>presentCall(args)"]
  pre["<code>tools/pre-execute</code> waterfall<br/>hooks, permission, sandbox"]
  guards["Registered monotonic guards<br/>deny or abstain; identity protected"]
  denied["denied or approval refused<br/>tool body skipped"]
  approval["<code>ctx.approval</code> one-shot prompt<br/>absent or unanswerable: deny"]
  around["<code>tools/execute</code> waterfall<br/>timeout, retry, metrics (around dispatch)"]
  toolBody["Registered tool execute() body"]
  fsGate["<code>fs/write-intent</code> or <code>fs/edit-intent</code><br/>tool-fs mutations only"]
  owned["Tool-owned session events<br/><code>todo/write</code>, <code>fs/observed</code>, <code>hook/invoked</code>, <code>hook/result</code>, <code>tool/ptc-dispatch</code>"]
  post["<code>tools/post-execute</code> waterfall<br/>accept, block, replace, add context"]
  normalized["Registry outer normalization<br/>pipeline/result snapshot throws become isError"]
  finalize["ToolDefinition.finalizeContent<br/>last content-only invariant"]
  final["<code>tools/result</code> synchronous notification<br/>frozen authoritative outcome"]
  context["Active-batch additionalContexts FIFO<br/>injected user/message after recorded tool results"]
  toolResult["Session event: <code>tool/result</code><br/>single model-facing outcome"]
  allResults["Tool batch settled<br/>recorded tool/result events complete"]
  presentResult["UI completed card<br/>presentResult(args, result)"]
  model --> toolCall
  toolCall --> presentCall
  toolCall --> pre
  pre -->|allow| guards
  guards -->|allow| around
  guards -->|deny| denied
  guards -.->|throw| normalized
  around --> toolBody
  pre -->|deny| denied
  pre -->|ask| approval
  approval -->|allowed-once| guards
  approval -->|rejected, cancelled, unavailable| denied
  approval -.->|throw| normalized
  denied --> post
  pre -.->|throw| normalized
  toolBody --> fsGate
  fsGate --> toolBody
  toolBody --> owned
  toolBody --> around
  around --> post
  around -.->|wrapper throws| normalized
  post -.->|throw| normalized
  post --> finalize
  normalized --> finalize
  finalize --> final
  final --> toolResult
  toolResult --> presentResult
  toolResult --> allResults
  allResults --> context
```

تبقى فحوصُ «اقرأ قبل التحرير» في نظام الملفات تحت `tool-fs` على أحداث `fs/*`. وتستضيف شلالاتُ ما قبل التنفيذ وما بعده العامة الخطّافاتِ وسياسةَ الموافقة؛ ويحسم `ctx.approval` الأسئلةَ قبل الحرّاس التصاعديين، وتبقى سياسةُ المالك التي يجب ألّا يُعاد ترتيبُها حارسًا مسجَّلًا. وتغلّف الشؤونُ المحيطة بالتوزيع، كالمهل، شلالَ `tools/execute`. ويلتقط السجلُّ النتيجةَ المرشحة بلا فقد ويوحّد فشلَ الالتقاط قبل أن يفرض ردُّ نداء `finalizeContent` الملتقَط في التعريف المرئي ثابتتَه المتزامنة المقتصرة على المحتوى. ثم يراقب `tools/result` الحصيلةَ غيرَ القابلة للتغيير السليمةَ في JSON. وهذا يتيح للخطّافات أن تمتد على عائلات أدوات بلا ربط الأدوات بخدمة سياسة واحدة. ويرسل وضعُ PTC نقلَ `run_code` المحجوز ونداءاتِه الفرعية المسلسَلة عبر المسار كليهما؛ وتحمل النداءاتُ الفرعية رمزَ الأب، وتسجّل `tool/ptc-dispatch`، وتعيد المنعَ رفضَ ارتباط، وتُغفل `additionalContexts` حفظًا لتجاور النداء ونتيجته.

وضعُ الصيانة: رسمُ تدفق Mermaid مؤلَّف يدويًا؛ وschemas الأدوات وتوقيعاتُ الأحداث الدقيقة في الأدلة المولَّدة.

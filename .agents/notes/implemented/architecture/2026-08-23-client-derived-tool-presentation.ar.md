# Agent Note: Client من أصلي Session أداة حدث إرسال توليد عرض

Status: implemented

[English](2026-08-23-client-derived-tool-presentation.md) | العربية

## Problem

Session تاريخ هو حمل دائم journal واجهة، أداة بطاقة يخص Client عرض. في `page`/`follow` في حساب حساب بطاقة view سوف يجعل تاريخ قراءة اعتماد Tools registry،Agent preset، استعادة بعد scope،presenter تنفيذ و مؤقت UI نوع.

`tool/result` لا تكرار سجل أداة اسم و معامل.Host طرف نتيجة عرض لذلك حاجة call index أو حسب `callId` عودة مسح؛`maxMessages` لا مباشر حد حدث عدد كمية، أداة سري تجميع صفحة فوق تكرار مسح ممكن وصل قريب اثنان مرة جهة صار هذا.

Host إسقاط أيضا سوف تكرار بنية تحويل بيانات.read،diff،search و web نتيجة قد في `tool/result.data.meta` في حفظ دائم محدود واقع؛ آخر نسخة view فقط زيادة Remote payload و Client حل رمز صار هذا، لا زيادة حمل دائم دلالة.

Client قد يملك كامل أداة عرض مدخل.`ui-chat` سوف `tool/call`،`tool/result` و PTC dispatch حدث تجميع صار مستقر `ToolCallBlock`؛`ui-tool` يملك تمرير عودة استدعاء شجرة، حسب أداة اسم توزيع `tool.call.toolview` keyed slot،Generic fallback، بطاقة نموذج و details output؛ عمل خدمة Client إضافة يمكن لـ ذاتي ذات أداة اسم تسجيل renderer.

Host presenter و Client keyed renderer قسم تحمل عرض سوف شكل صار مقابل نفس حدث اثنان طقم حل تفسير.keyed renderer هو Web نقطة توسيع، لذلك في بين Host view لا توفير مستقل Web قدرة.

`ToolDefinition.presentCall`/`presentResult` ما زال هو إبقاء Host API؛ACP اعتماد automation-only بروتوكول، مستودع أيضا لا يوجد إنتاج TUI consumer. هل حذف هذه تعريف و Session قراءة هل مستقل في عرض هو اثنان عدد قرار.

الذي يحتاج نتيجة هو واحد بند أصلي Session journal و واحد Client عرض owner، كما لا حدوث مرئي تراجع تحويل أو ترتيب حمل زيادة قوي. مخصص استخدام بطاقة، تفاعل و PTC dispatch توسيع اندفاع إبقاء مستقر،transport لم يعد يحمل مؤقت view.

## Decision

تحت وصف عرض مقابل انتظار اشتراط لا يتضمن قد مستقل دفعة دقيق[تضمين طقم terminal بطاقة إصلاح](../bug-fix/2026-09-05-nested-terminal-cards.ar.md) ؛ أخرى عرض و كل حق قيد الكل إبقاء.

Session Remote journal فقط تحت إرسال أصلي، قد تحقق، يمكن حفظ دائم Session event.`session.page` و `session.follow` لا تحليل أداة معامل، لا استعلام Tools registry، لا استعادة presenter scope، لا تنفيذ `presentCall`/`presentResult`، أيضا لا بنية صنع أو تغلب ضخم أي tool view.

Client Conversation طبقة متابعة مسؤول استدعاء الأداة و نتيجة identity، إعداد مقابل، دورة الحياة،PTC dispatch توسيع اندفاع و مستقر Chat Node. هو لا حل تفسير أداة جسم أداة اسم، أيضا لا توليد terminal،diff،read،search أو web مكون props.

Client `ui-tool` متابعة مسؤول card model و أداة جسم renderer. كل card model تعديل لـ مباشر قراءة `ToolCallBlock` في أداة اسم، أصلي معامل، نتيجة محتوى، خطأ، حمل دائم metadata،Session cwd و Host home، و توليد و قائم صفحة نفسه مكون props.

Client لا بناء قيام ثاني طقم presenter registry. أداة اسم توزيع فقط استخدام قائم `tool.call.toolview` keyed slot؛Client في صاف card-model helper يخص renderer تنفيذ، لا يصبح Cordis service، عام registry أو wire DTO.

Host `ToolDefinition.presentCall`،`ToolDefinition.presentResult`،`ToolCallView`،`ToolResultView` و قائم presenter تنفيذ الكل إبقاء.Session Controller لا استدعاء هو جمع،Client لا استيراد أو إزالة استهلاك هو جمع؛ لم قدوم غير Client consumer هل استخدام هو جمع لا يخص هذا قرار.

`ToolOutputDefinition.presentationMeta` و حمل دائم `tool/result.data.meta` إبقاء. هو جمع يحمل نموذج مرئي نتيجة نص لا يمكن بلا ضرر جدول بلوغ، بينما قائم مخصص استخدام بطاقة حاجة تنفيذ نتيجة واقع.Client مباشر تحقق و إزالة استهلاك `meta`، لا اشتراط Host في تاريخ قراءة وقت مجددا يأخذ هو تحويل صار view.

### هدف و غير هدف

| صنف آخر | قرار |
|---|---|
| لا وجود | `SessionEventEntry.view`،`SessionToolView`،`SessionToolCallView` |
| لا وجود | `history.ts` `viewFor`،`backscanArgs`،`parseToolCall`،`jsonView` و presenter scope lookup |
| لا وجود | follow في فقط خدمة presentation `openCalls` و fallback event scan |
| لا وجود | Client Session مستو سطر `views` عدد مجموعة،Conversation input `view`،Tool block `callView`/`resultView` |
| إرسال توليد | terminal،diff،read،search،web card model قراءة raw block/meta |
| إرسال توليد | Deliverables قراءة نجاح mutation اسم و معامل |
| إبقاء | Host `ToolDefinition.presentCall`/`presentResult` API، نوع، تنفيذ و مباشر اختبار |
| إبقاء | `output.presentationMeta` و حمل دائم `tool/result.data.meta` |
| إبقاء | Session سجل صيغة،Remote journal دورة الحياة و Conversation identity/topology |
| إبقاء | قائم keyed slot،Generic fallback،Chat،Details و Trajectory بنية |
| منع توقف | جديد Client presenter service، مستو سطر registry أو wire renderer id |
| منع توقف | جديد بطاقة، نظر شعور تعديل إصدار، تفاعل تعديل إصدار أو PTC dispatch rich-card زيادة قوي،[تضمين طقم terminal بطاقة مثال خارج](../bug-fix/2026-09-05-nested-terminal-cards.ar.md) حذف خارج |
| منع توقف | لـ توافق إبقاء مزدوج كتابة، إصدار تنسيق تجارة أو قديم `view` حقل |

## فن لغة

**أصلي Session event**إشارة حمل دائم سجل في `SessionEvent` واقع، يشمل `tool/call` `name` و أصلي `arguments` نص، و `tool/result` `content`،`isError`، بنية تحويل خطأ و اختياري `meta`.

**حمل دائم metadata**إشارة `ToolOutputDefinition.presentationMeta` في أداة نجاح تنفيذ وقت توليد و كتابة `tool/result.data.meta` JSON قيمة. هو هو نتيجة واقع واحد جزء، لا هو مسبق أولا ترتيب إصدار React أو card DTO.

**Host tool view**إشارة `ToolDefinition.presentCall`/`presentResult` إرجاع `ToolCallView`/`ToolResultView`؛Session Remote لا تشغيل نقل هو.

**Client card model**إشارة `ui-tool/src/client/tool/models/` تحت مباشر توفير `TerminalBlock`،`DiffBlock`،`ReadBlock`،`SearchBlock`،`WebBlock` أو `ToolRow` استخدام صاف props بيانات.

**مخصص استخدام بطاقة**إشارة terminal،diff،read،search و web بنية تحويل متن؛ عنوان، ملخص، حالة نقطة و عادي IN/OUT نص ما زال يخص عام أداة سطر.

**مقابل انتظار**إشارة نفس تلقي دعم حمل إدخال إنتاج من قائم مكون، تجميع و متصفح دليل ثابت مستخدم مرئي نتيجة و تفاعل، لا اشتراط نفسه في بين TypeScript نوع أو داخلي دالة استدعاء.

**بلا زيادة قوي**إشارة هذا قرار لا يجعل يتم ثابت لـ Generic fallback إدخال نيل نيل جديد مخصص استخدام بطاقة، أيضا لا توسيع كبير قد لديه بطاقة بيانات أو تفاعل.

## هيكل بنية و كل حق

### أداة تنفيذ و حفظ دائم

1. أداة تسجيل `output.schema`،`output.render` و اختياري `output.presentationMeta`.
2. نجاح تنفيذ إنتاج canonical JSON value.
3. Tools runtime مقابل value فعل لقطة،schema تحقق و تجميد ربط.
4. `output.render(args, value)` توليد نموذج مرئي `ContentBlock[]`.
5. قمة طبقة استدعاء إذا إعلان `output.presentationMeta`،runtime معا توليد JSON-safe metadata.
6. Agent loop يأخذ نموذج مرئي نتيجة و metadata كتابة `tool/result` Session event.
7. Session log لا حفظ `ToolCallView` أو `ToolResultView`.

### Host journal قراءة

1. `session.page` أخذ نيل attached أو persisted حدث.
2. `paginate()` حسب append-origin user/assistant message حد قطع صفحة.
3. tail page عبر قد تسجيل projection snapshot/restore مسار أخذ نيل baseline.
4. كل page entry فقط يتضمن `{event}`.
5. `session.follow` أولا بناء قيام listener، مجددا تنفيذ catch-up read، إرسال opening cursor و تدفق صيغة تحت إرسال وصل متابعة `{event}` frame.
6. اثنان بند مسار كل لا لـ عرض تحليل preset/Tools scope، تحليل أداة معامل، استدعاء presenter أو بناء قيام call index.

### Client بيانات و عرض

1. Client Session حفظ واحد وصل متابعة raw event window.
2. `SessionEventSource` إصدار فقط يحتوي event `SessionEventEntry`.
3. `ui-conversation` في لا يوجد presentation companion حال حال تحت fold كل حدث.
4. Chat و Trajectory Tool Definition حسب callId إعداد مقابل قمة طبقة call/result، و تجميع PTC dispatch فرعي شجرة.
5. `RunningToolCall` و `ToolResultNode` حفظ raw facts،metadata و قائم parent identity.
6. `ToolCallTree` حسب wire tool name توزيع `tool.call.toolview`.
7. `ui-tool` في render site من block إرسال توليد card component props.

### إنتاج إزالة استهلاك من مراجعة حساب

| كائن | إنتاج من | إنتاج إزالة استهلاك من | قرار |
|---|---|---|---|
| `presentCall`/`presentResult` | كل Host أداة | ممكن وجود غير Client caller | إبقاء في Session Remote خارج |
| `SessionEventEntry.view` | بلا | بلا | wire لا وجود |
| `callView`/`resultView` | بلا | بلا | Client model لا وجود |
| `presentationMeta` | Tools runtime | `tool/result`،Client card model و Host presenter | إبقاء حمل دائم إدخال |
| fixture presenter mirror | بلا | بلا | fixture تحت إرسال raw metadata |

ACP لا إزالة استهلاك Session tool view، أيضا لا خريطة Host render intent. مستودع لا يوجد إنتاج TUI consumer؛Host presenter إبقاء، لكن Session Remote لا بصفة ذلك transport.

## بيانات تدفق

```text
Tool execute
  -> canonical value
  -> output.render(args, value)
  -> model-visible result content
  -> output.presentationMeta(args, value), when declared
  -> durable tool/result event

Session page/follow
  -> raw Session event envelope
  -> no tool lookup
  -> no preset lookup for presentation
  -> no call backscan
  -> no render-intent serialization

Client SessionEventSource
  -> Conversation Tool Definition
  -> root call/result pairing + PTC dispatch topology
  -> ToolCallBlock(name, argsRaw, content, error, meta)
  -> tool.call.toolview keyed dispatch
  -> Client card model
  -> existing React component
```

هذا بند سلسلة مسار إبقاء مرة حمل دائم metadata إسقاط، لأن هو حدوث في canonical result بعد في داخل تخزين وقت؛ حذف هو قراءة تاريخ وقت ثاني مرة عرض إسقاط.

### قسم طبقة مسؤولية مهمة

| طبقة | مسؤول | لا مسؤول |
|---|---|---|
| Tools runtime | تنفيذ،canonical value، نموذج نص، يمكن إعادة وضع metadata | Web بطاقة اختيار و مكون props |
| Session log | حمل دائم واقع، ترتيب، إعادة تشغيل | مؤقت card DTO |
| Session Controller | عنوان، إذن، بارد قراءة، قسم صفحة،follow،projection baseline | tool lookup،presenter، عرض scope |
| Client Session | Remote journal دورة الحياة و وصل متابعة نافذة | أداة يحتوي معنى، بطاقة نوع |
| Conversation Tool Definition | call/result إعداد مقابل،lifecycle،root/subcall topology | أداة اسم إلى مكون حل تفسير |
| `ui-tool` | card model، عام fallback،Chat/Details عرض | Session قسم صفحة و Host registry |
| عمل خدمة Client إضافة | ذاتي لديه tool name keyed renderer | root/subcall تحرير ترتيب و عام registry |
| `ui-deliverables` | حالي رقم واحد جهة mutation produced path | UI card أو Host render intent |

## Remote و حمل دائم بيانات اتفاق

### `SessionEventEntry`

`SessionEventEntry` إبقاء لـ journal entry envelope، فقط يحتوي `event: SessionWireEvent`. هذا مرة لا ترتيب حمل يأخذ page entries تعديل صار عار حدث، أيضا لا إعادة بنية `RemoteJournalStream` عام entry اتفاق.

`SessionPage.events` ما زال هو `SessionEventEntry[]`.

`SessionFollowFrame` ما زال هو opening frame أو حمل `event` event frame.

حذف `SessionToolCallView`،`SessionToolView` و `SessionEventEntry.view`.

Client connection لم يعد من `dsh-tools/presentation` تحويل خروج `ToolCallView`/`ToolResultView` توفير Session إزالة استهلاك.

توليد catalog و graph من كل منها source owner إرسال توليد قد استلام ضيق Remote نوع و package dependency.

### حمل دائم سجل

- `tool/call.data.name` إبقاء أصل مثال.
- `tool/call.data.arguments` إبقاء نموذج إنتاج أصلي JSON نص.
- `tool/result.data.message.content` إبقاء نموذج مرئي نتيجة.
- `tool/result.data.error` إبقاء بنية تحويل فشل هوية.
- `tool/result.data.meta` إبقاء أداة خاص JSON قيمة.
- Client card model لا كتابة Session log.
- renderer key و Host tool implementation id لا كتابة Session log.
- قائم حمل دائم Session بلا حاجة ترحيل،`SESSION_FORMAT_VERSION` ثابت.

### `presentationMeta`

`presentationMeta` لا هو Host tool view. هو في أداة تنفيذ إتمام وقت قراءة canonical value، بينما هذا value لن حفظ دائم؛ حذف هو سوف جعل تحت صف قائم عرض لا يمكن بلا ضرر استعادة:

- read path،offset،lines،totalLines و lang؛
- write/edit applied contextual hunks؛
- grep/glob قسم مجموعة نتيجة، مقتطع علامة سجل و مجموع عدد؛
- web_search مصدر حقل و provider answer؛
- web_fetch نهائي URL،HTTP status و صالح مقتطع علامة سجل.

Client مقابل `meta` فعل نطاق جزء وقت التشغيل استلام ضيق. هل يأخذ `presentationMeta` تعديل اسم لـ أكثر في صفة result metadata لا يخص هذا قرار.

## Host طرف تصميم

`SessionHistoryController.page()` في أخذ نيل source events بعد فقط تنفيذ قسم صفحة و قائم projection baseline حساب حساب.attached Session استخدام projection registry snapshot؛detached Session استخدام هذا registry مقابل inspected log restore مسار.history لا عبر تركيب preset تغيير قد تسجيل projection تجميع دمج.

`SessionHistoryController.follow()` إبقاء listener-first،opening cursor،gap-free replay،live buffering، إلغاء و teardown؛ هو لا لـ أداة حدث صيانة مقدار خارج حالة.

Controller لا وجود `presenterScopeFor()`،`viewFor()`،`backscanArgs()`،`parseToolCall()` أو `jsonView()` مسار.page state لا يحتوي presenter scope أو معامل resolver؛follow state لا يحتوي `openCalls`،`fallbackEvents` أو presentation معامل resolver. كل page/follow event فقط حزمة تركيب صار `{event}`، عنوان،ownership،cursor،seq و projection منطق إبقاء كامل.

غير ممكن تغيير event تحويل helper يمكن إبقاء ضيق تنفيذ أو داخل ربط؛ فقط يلزم history لا تنفيذ presentation عمل، ذلك اسم لا يوجد دلالة.

Session Controller dependency فقط في أخرى package responsibility حاجة وقت إبقاء؛manifest و project reference لا يحتوي presentation-only dependency.

### صفة قدرة قيد

- `page()` أداة متبادل صلة عمل لـ صفر.
- صفحة زيادة tool result لا زيادة مقابل قائم صفحة حدث تكرار مسح.
- `follow()` لا صيانة عرض بحث جذب.
- history لا إطلاق Cordis `tools` service proxy.
- history لا انتظار presenter standing scope.
- history لا تنفيذ أداة معامل JSON parse.
- history لا تنفيذ tool view JSON clone.
- Remote payload لا تكرار يحمل `meta` قد جدول بلوغ بنية تحويل بيانات.
- Client لا مسح كامل Session event window توليد مفرد عدد بطاقة.
- Client فقط في مقابل immutable Tool block تغير وقت إعادة إرسال توليد card model.

## Client Session و Conversation

Client Session لا يحتوي و raw event window مستو سطر خاص `views` عدد مجموعة.`installWindow()`،`prependWindow()` و `appendLive()` فقط معالجة event entries،cursor/hasMore،queue،projection و إشعار.

`ConversationEventInput` فقط يحمل `event`.Conversation assembler لا إقرار تعرف `SessionToolView`، ذلك replace/prepend/append،Context identity،Location و publication cadence ثابت.

Chat و Trajectory Tool Definition كل لا قراءة view، بينما من حدث توليد التالي بيانات:

- callId؛
- tool name؛
- raw arguments؛
- turn،step،seq و time؛
- result content؛
- isError و structured error؛
- result metadata؛
- root/subcall parent-child topology؛
- interruption synthetic result.

`RunningToolCall` لا يحتوي `callView`.

`ToolResultNode` لا يحتوي `callView` و `resultView`.

`ToolCallBlock` لا إضافة جديدة عام `view`،`card`،`kind` أو `locations` حقل بديل يتم حذف حقل. أداة جسم عرض ما زال فقط يخص `ui-tool` و keyed renderer.

### Root و PTC dispatch فرعي استدعاء

Host presenter API وصف قمة طبقة call/result. هذا قرار تغطية diff،read،search و web model مقابل PTC dispatch فرعي استدعاء إبقاء Generic/flattened عرض؛ تلقي دعم حمل terminal استدعاء استخدام و أصل استدعاء نفسه ملائم استخدام قاعدة.

PTC dispatch start و result event قد يحمل `parentCallId`.Conversation في كل child `ToolCallBlock` فوق إبقاء هذا بند قائم واقع،root Session call فإن لا يحمل هو.diff،read،search و web model فقط قبول لا يوجد `parentCallId` block؛terminal model و أصل هذا متعمد دعم حمل تضمين طقم استدعاء renderer قبول child block.

مشترك card model في block تصيير إلى أي داخل كل تطبيق إضافة نفس مثال طرفية مورد إطار و غير طرفية فرعي استدعاء حد، لذلك لا حاجة ثاني عدد عرض وجه حمل placement حقل؛ سبق مرور أصل مثال تفويض حمل اختيار في block تفصيل حال وجه لوح قد مع يمين جانب تفصيل حال صف واحد و حذف ([قرار](../feature/2026-09-04-right-sidebar-docking-infrastructure.ar.md)).

keyed slot ما زال حسب كل فرعي استدعاء حقيقي tool name توزيع؛`parentCallId` فقط حد هذا قرار تغطية diff/read/search/web بنية تحويل نموذج.Skill،Cordis انتظار قد مباشر قراءة raw block مخصص استخدام renderer إبقاء الآن حالة.

### ناقص استدعاء رأس

نتيجة عقدة في حالي نافذة لا يوجد إعداد مقابل call وقت،`ToolResultNode.call` إبقاء `null`.Client لا مسح نافذة، لا إرسال مقدار خارج RPC، أيضا لا أصل حسب result نص تخمين قياس أداة اسم.

حاجة اسم أو معامل مخصص استخدام إرسال توليد في `call === null` وقت مشي حالي Generic fallback. فقط اعتماد result metadata نموذج أيضا لا استعارة آلة زيادة قوي، لأن حالي Host `presentResult` يجب أولا أخذ نيل إعداد مقابل استدعاء.

older page لاحق تكملة دخول استدعاء رأس وقت،Conversation Context حسب قائم replay قاعدة إعادة بناء، دورة وقت عندئذ سماح توليد حالي قد لديه مخصص استخدام بطاقة.

### معامل و metadata استلام ضيق

Client من `argsRaw` تحليل JSON، تحليل فشل إرجاع Generic، لا رمي خروج React render خطأ.

Chat و Details عبر صاف helper إعادة استخدام نفس block تحليل. لم قدوم ذاكرة مؤقتة يجب استخدام immutable block identity، لا يستطيع حسب callId بناء قيام عبر Session عام حالة.

كل مخصص استخدام نموذج فقط فحص هو حاجة حقل.Client لا نسخ كامل Host tool schema، أيضا لا استدعاء Host `defineTool` validator.

دمج قاعدة رقم واحد جهة حدث يجب و حالي presenter إخراج انتظار قيمة. شاذ شكل، قديم إصدار أو يد عمل تعديل سجل فقط تحمل وعد لا انهيار انهيار و استخدام Generic fallback.

## Client card-model تصميم

قائم `ui-tool/src/client/tool/models/` متابعة هو Chat و Details مشترك إرسال توليد وحيد موضع.helper مباشر إرجاع مكون props، لا إرجاع `ToolCallView`/`ToolResultView`، أيضا لا إنشاء نفس بنية `ClientToolView` union.

أداة اسم فرع فقط وجود في `ui-tool` card model، قائم row تصنيف جدول، أو يملك هذا أداة keyed renderer Client إضافة؛ لا نيل دخول Session Controller،Client Session،Conversation assembler أو عام Slot renderer.

لم معرفة أداة متابعة من `GenericToolCard` عرض name، أصلي args، نتيجة content و خطأ.

### عام أداة سطر

`toolRowModel()` مباشر من `toolName`،`argsRaw`،result content،error،cwd و home إرسال توليد عام سطر، و إبقاء التالي سلوك:

- `search`،`read`،`bash`،`write`،`edit`،`code` و `others` تصنيف؛
- قائم عنوان و أداة مخصص استخدام عنوان؛
- summary حقل أولوية درجة و مفرد سطر مقتطع؛
- كثير query فاصلة رقم تجميع وصل؛
- cwd متبادل مقابل تحويل و home تقليص كتابة؛
- file path نقر؛
- args pretty JSON و غير JSON أصل نص fallback؛
- result content flatten و structured error fallback؛
- running،ok،error و stopped حالة.

Generic Host `presentCall` title،kind،rawInput،content و locations حالي و لا قيادة عادي Web سطر؛Generic `presentResult.content` أيضا لا قيادة Web إخراج، لذلك بلا حاجة يأخذ هذه لم إزالة استهلاك قيمة نسخ إلى Client.

### Terminal بطاقة

Client terminal model من أداة اسم، استدعاء معامل، نتيجة content،error و Session cwd إرسال توليد قائم `TerminalBlock` props، لا اعتماد `parentCallId`.

| إدخال | إبقاء نتيجة |
|---|---|
| معيار `bash`/`pwsh` قبل منصة running | terminal prompt،description،cwd،running حالة |
| معيار قبل منصة success | terminal output،exit code/signal، نجاح أو فشل حالة نقطة |
| `run_in_background:true` | Generic سطر و أصلي نتيجة |
| أداة تنفيذ error | Generic IN/OUT و خطأ ملخص |
| persistent `bash`/`pwsh` running | terminal prompt |
| persistent `bash`/`pwsh` settled | Generic flattened result، لا إضافة جديدة exit card |
| `terminal_send` قبل منصة | terminal prompt و output |
| `terminal_send` background/error | Generic نتيجة |
| PTC dispatch child | و أصل استدعاء نفسه terminal ملائم استخدام قاعدة و fallback قاعدة |

معيار shell نتيجة تحليل نهاية ذيل `[exit code: N]` و `[killed by signal: X]`. نهاية ذيل قد تعرف آخر spill سياسة تلميح سوف تعديل استخدام Generic إخراج: في shell سطر في يمكن توسيع، في Details في عرض أصل نص، لأن خروج علامة ممكن يتم نقل موضع أو حذف. قد تحليل marker من terminal متن إزالة؛timeout،sandbox denial و لا يوجد pill marker إبقاء في متن.

استدعاء `description` متابعة عرض في card فوق جهة و تغطية طي ملخص.workdir متابعة حسب قطعا مقابل، متبادل مقابل و ناقص ثلاثة نوع حال حال معالجة؛ متبادل مقابل مسار أساس في Session cwd، كما إبقاء `.`،`..`، قرص رمز و UNC root عودة واحد تحويل.

مقابل في `terminal_send`، غير فارغ input و session id إبقاء لـ تدريجي حرف أداة بيانات؛ فارغ input fallback و session label عبر render site conversation locale تحليل.

نفس اسم عادي و persistent provider هو خاص خاص توافق نقطة.Client استخدام حالي صالح معامل و نتيجة خاص سمة إبقاء قد تسليم فرق مختلف؛ لا كاف بـ بلا اختلاف معنى تعرف آخر إدخال اختيار Generic settled نتيجة، لا زيادة جديد جدول الآن.

TerminalBlock ANSI، ضوء علامة إعادة وضع، عرض محرف، سطر عدد حد أعلى، توسيع، نسخ و مساعد مساعدة تقنية فن نص تماما ثابت.

### Diff بطاقة

| إدخال | إبقاء نتيجة |
|---|---|
| running `write` | من `file_path` و `content` توليد intended added-only diff |
| running `edit` | من `file_path`،`old_string`،`new_string` توليد intended replacement diff |
| running `str_replace_editor create` | من `path` و `file_text` توليد intended added-only diff |
| running `str_replace_editor str_replace` | من `path`،`old_str` و `new_str` توليد intended replacement diff |
| settled `write`/`edit` success | من `meta.diffs` توليد applied contextual hunks |
| settled `str_replace_editor` | Generic، لأن هذا أداة لا يوجد result presenter |
| write create أو applied metadata ناقص، شاذ شكل، لـ فارغ | حالي args fallback |
| error، شاذ شكل args،edit metadata شاذ شكل،PTC dispatch child | Generic |

مسار،`oldText:null`،`newText`، نتيجة تغطية استدعاء وقت diff،Chat 8 سطر حد أعلى،Details كل عال عرض و ملف فتح سلوك ثابت.

### Read بطاقة

running `read` متابعة فقط لديه ملخص سطر. نجاح settled `read` من result meta قراءة path،offset،lines،totalLines و lang، و تأكيد نتيجة هو مفرد عدد نص كتلة كما رمز دمج read envelope.

meta ناقص، حقل شاذ شكل،result envelope لا مطابقة،error، ناقص call head أو PTC dispatch child كل مشي Generic. مسار label cwd متبادل مقابل تحويل،home تقليص كتابة، لغة قاعدة لغة، مجموع سطر عدد،Chat 8 سطر حد أعلى و Details كل عال عرض ثابت.

Client لا حاجة بنية صنع Host `ReadResultView.content`؛Generic fallback بداية نهاية يمكن مباشر قراءة أصلي result content.

### Search بطاقة

running `grep`/`glob` متابعة فقط لديه معامل ملخص. نجاح نتيجة قسم آخر من `meta.shape:'matches'` و `meta.shape:'paths'` توليد grouped matches أو path list.

Client تحقق path،lineNumber،line،truncated و total. فارغ matches/paths هو صالح بطاقة؛ ناقص/شاذ شكل meta، لم معرفة shape،error، ناقص call head و PTC dispatch child مشي Generic.

`truncated:true` وقت متابعة من أصلي result content عرض recovery locator؛ لم مقتطع وقت لا عرض.Chat 8 سطر حد أعلى،Details كل عال عرض و توسيع سلوك ثابت.

### Web بطاقة

running `web_search`/`web_fetch` متابعة فقط لديه ملخص سطر. نجاح search من `meta.sources`،`meta.answer`،`meta.truncated` توليد بطاقة؛ نجاح fetch من `meta.url`،`meta.statusCode`،`meta.truncated` توليد بطاقة.

Client تحقق كل source url،title،snippet و publishedAt، و متابعة فقط يأخذ http/https URL تصيير لـ رابط.meta ناقص أو شاذ شكل،error، ناقص call head و PTC dispatch child مشي Generic.

search answer، مصدر ترتيب،label fallback و مقتطع تلميح ثابت؛fetch نهائي URL، حالة، مقتطع تلميح و Details تحت جهة أصلي متن ثابت.

### قد مباشر استخدام raw block renderer

- Todo row متابعة من args حساب حساب completed/active ملخص.
- Question row متابعة من result content و error حساب حساب انتظار، عودة جواب، إلغاء و في توقف حالة.
- Skill row متابعة من args/result حساب حساب اسم و حالة.
- Cordis define/run/action rows متابعة من args/result و كل منها Client service حساب حساب.
- هذه renderer props،slot key، تسجيل ترتيب و مرئي نتيجة ثابت.

## Deliverables

`ui-deliverables` مستقل في عرض معنى رسم إرسال توليد mutation عمل خدمة واقع، لذلك produced-file سلوك لا و بطاقة قطع رسم اقتران دمج.

Deliverables Definition حسب callId مراقبة root `tool/call` و نجاح `tool/result`، حفظ الأكثر صغير Client-owned mutation candidate، لا مسح Session window، أيضا لا اعتماد UI renderer.

| أداة | mutation حكم تحديد | path مصدر |
|---|---|---|
| `write` | مهمة معنى نجاح استدعاء | `file_path` |
| `edit` | مهمة معنى نجاح استدعاء | `file_path` |
| `str_replace_editor` | `create`،`str_replace`،`insert` | `path` |
| `str_replace_editor` | `view` | لا إنتاج path |
| أخرى | بلا حالي رقم واحد جهة mutation دلالة | لا إنتاج path |

فشل،interrupted،orphan result، ناقص path و شاذ شكل args لا إنتاج deliverable. نفس مسار إبقاء first-seen ذهاب إعادة،closing Assistant seq بعد سقوط تحديد نتيجة متابعة ترتيب حذف.

هذا مرة لا إضافة جديدة عام “أداة فرعي أثر” سجل التسجيل.Host-only رقم ثلاثة جهة presenter عبر `kind:'edit'`/`locations` تلقائي إضافة دخول Deliverables قدرة يتم متعمد إزالة؛ لم قدوم إذا لديه حقيقي رقم ثلاثة جهة mutation يحتاج طلب، ينبغي من Client عمل خدمة مساهمة جدول بلوغ، لا يستطيع استعادة Session view.

## Fixture و اختبار بيانات

تجميع RemoteMock مشهد لا يتضمن يد كتابة `presentCall()`،`presentResult()`،`viewFor()` أو tool-view نوع. هو توفير و حقيقي سجل نفسه raw call،result content و result meta.

| Fixture | يجب إبقاء أصلي واقع |
|---|---|
| terminal | معامل و حقيقي نتيجة status marker |
| diff | معامل و result `meta.diffs` |
| read | result meta path/offset/lines/totalLines/lang |
| grep/glob | result meta shape/files أو paths/truncated/total |
| web | result meta sources/answer أو url/statusCode/truncated |
| generic/custom | name،argsRaw،content،error |

هذا مشهد لا استيراد Host أداة حزمة قدوم حساب حساب صفحة عرض، أيضا لا إبقاء presenter مرآة مثل. نفس raw مشهد في jsdom تحت قيادة built Web snapshot؛ حقيقي Host متصفح حالة استخدام مستقل تغطية شبكة مسار.

## عرض انتظار قيمة مستطيل دفعة

“حالي عرض” من قد إيداع مكون اختبار، تجميع اختبار و Web browser expected مشترك نفس تعريف.transport أو ownership إعادة بنية لا يستطيع بصفة refresh snapshot إدارة من؛ نيل دفعة منتج تغير حاجة مستقل دليل.

| مشهد | يجب إبقاء عرض |
|---|---|
| لم معرفة أداة running | Generic سطر، أداة اسم و args ملخص |
| لم معرفة أداة settled | Generic سطر و أصلي output |
| malformed args | أمان Generic fallback |
| orphan result | callId عنوان و Generic output |
| interrupted call | warning/stopped حالة |
| bash/pwsh قبل منصة | حالي terminal prompt، متن،cwd و حالة |
| bash/pwsh background/error | حالي Generic IN/OUT |
| persistent shell | حالي running terminal،settled Generic |
| terminal_send | حالي قبل منصة terminal، خلفية/error Generic |
| write/edit | حالي intended/applied diff و error fallback |
| read | حالي running ملخص،settled ReadBlock و error fallback |
| grep/glob | حالي grouped/path card، مقتطع و recovery |
| web_search/web_fetch | حالي مصدر/ملخص card و أصلي متن |
| Todo/Question/Skill/Cordis | حالي مخصص استخدام سطر |
| PTC dispatch subcall | ممتلئ كاف شرط وقت عرض terminal بطاقة؛diff/read/search/web إبقاء Generic/flattened |
| Chat و Details | نفس استدعاء استخدام نفسه card fields |
| Trajectory | حالي identity، شجرة، اختيار و details |
| Deliverables | حالي نجاح mutation chips و رابط |

## Client توسيع اتفاق

`tool.call.toolview` متابعة هو وحيد أداة UI تسجيل آلية. واحد أداة إذا يلزم في Client نيل نيل مخصص استخدام جدول الآن، يجب من Client إضافة تسجيل ذاتي ذات wire tool name.

تسجيل جهة استقبال raw `ToolCallBlock`،Session path معلومة و مضيف حركة عمل، ذاتي سطر تحقق هو إقرار تعرف args/meta حقل. تسجيل جهة لا استدعاء Host tool registry، لا اعتماد `presentCall`/`presentResult`، أيضا لا يستطيع اشتراط `SessionEventEntry.view`.

لا يوجد Client renderer أداة مستقر تخفيض لـ Generic. نفس tool name فقط قدرة لديه واحد توليد فاعلية keyed registration، تكرار key متابعة loud failure.

Session-scoped slot يمكن جدول بلوغ Client جانب جلسة فرق مختلف، لكن لا من preset دفع قطع renderer تغيير جسم.Host-only presenter لا تلقائي منح إعطاء Web rich card، هذا هو “Host وصف عرض” و “Client إضافة يملك عرض” واضح حد.

## فشل و fallback

- Client يأخذ args و meta عند عمل wire JSON، في إزالة استهلاك نقطة استلام ضيق.
- معامل JSON تحليل فشل مشي Generic.
- معروف أداة نقص قليل لا بد يلزم حقل مشي Generic.
- metadata ناقص أو شاذ شكل مشي Generic؛ نجاح `write` مثال خارج، هو حسب حالي presenter سلوك إبقاء من معامل إرسال توليد كامل ملف diff.
- error result لا بسبب metadata وجود بينما عرض نجاح بطاقة.
- ناقص call head لا تخمين قياس أداة اسم أو معامل.
- لم معرفة metadata حقل يتم تجاهل اختصار.
- جديد metadata variant في قديم Client في مشي Generic.
- card-model helper التقاط يمكن مسبق مدة تحليل فشل، لا اعتماد React error boundary إتمام عادي fallback.
- keyed renderer ذاته معنى خارج استثناء ما زال من قائم Slot error isolation معالجة.

## نفس اسم Host provider

Host registry سماح مختلف scope لـ نفس tool name توفير مختلف تعريف؛Session view عبر presenter scope إدارة نقاش فوق يمكن حسب preset اختيار مختلف render intent. حذف view بعد،Client keyed slot فقط مراقبة wire name، لا يستطيع مراقبة Host definition identity.

حالي رقم واحد جهة إظهار بارز نسخة هو عادي و persistent `bash`/`pwsh`.Client إرسال توليد استخدام صالح معامل و نتيجة خاص سمة إبقاء هو جمع قد تسليم فرق مختلف، لا زيادة provider-id wire حقل؛ لا يمكن حكم آخر شاذ شكل أو ذاتي تعريف نفس اسم provider إدخال اعتماد Generic.

هذا مرة لا تحمل وعد إبقاء رقم ثلاثة جهة نفس اسم provider فقط عبر Host presenter جدول بلوغ فرق مختلف. إذا لم قدوم منتج تأكيد يحتاج نفس اسم provider مختلف Client عرض، يجب تعريف مستقر، غير عرض صفة Client identity؛ لا نيل استعادة حسب صفحة Host view حساب حساب.

## قد تسليم نطاق

### Session Controller

- `SessionEventEntry` فقط يتضمن raw event.
- اثنان عدد Session tool-view نوع كل لا وجود.
- history لا يحتوي presentation import،helper أو page/follow presentation state.
- عنوان، قسم صفحة،follow و projection منطق ما زال من Session owner مسؤول.
- Host اختبار ثابت raw journal اتفاق.

### Session Controller Client

- `Session.views` لا وجود.
- EventSource replace/prepend/append delta إبقاء ثابت.
- transport،fixture و test-support نوع يحمل raw entry.
- event identity و مرجع مستقر صفة إبقاء ثابت.

### UI Conversation،Chat و Trajectory

- Conversation input و Tool block لا يحتوي view حقل.
- Chat/Trajectory Tool Definition قراءة raw event.
- event pairing،Context replay، شجرة و target snapshot إبقاء ثابت.
- child Tool block إبقاء قائم PTC dispatch `parentCallId`؛row و Details slot owner props كل لا زيادة مستقل placement حقل.

### UI Tool و Deliverables

- card model من raw block/meta إرسال توليد.
- Chat و Details إعادة استخدام نفسه helper.
- Generic fallback و keyed dispatch إبقاء ثابت.
- Deliverables تعرف آخر رقم واحد جهة mutation args.

### Fixture، وثيقة و توليد شيء

- fixture فقط إرسال raw event/meta.
- Session Controller و Client README/JSDoc وصف raw journal و Client presentation owner.
- أداة cookbook سجل Web Client وصل دخول مسار.
- هذا نص هو هذا قرار owner؛ إبقاء Host presenter Note متابعة يملك كل منها قرار.
- يد كتابة Remote نوع،dependency،README،pairing record و generated reference إبقاء تزامن.

## تحقق مستطيل دفعة

### Host

- page إرجاع وصل متابعة raw event entries.
- follow إرجاع opening cursor و وصل متابعة raw event entries.
- page/follow في بلا Tools service وقت سلوك نفسه.
- cold page لا تحليل أو تركيب preset.
- tail page عبر معيار projection registry حساب حساب baseline؛provider هل وجود من projection composition قرار، لا جذب دخول history جانب setup مسار.
- عنوان،ownership،message-aligned boundary و tail projection ثابت.
- listener-before-read،reconnect catch-up و gap repair ثابت.
- كبير كمية tool results لا إطلاق كل نتيجة عودة مسح.
- wire نتيجة لا يحتوي view.

`session-history-journal.host.spec.ts` مسؤول قسم صفحة، وصل متابعة صفة و history error سلوك، لا يحتوي presenter تأكيد.

### Client Conversation

- replace،prepend و append قبول بلا view entry.
- Chat و Trajectory root call/result إعداد مقابل ثابت.
- PTC dispatch شجرة ثابت.
- result-only fallback ثابت.
- interruption synthetic result لا نسخ view.
- registry rebuild،older prepend و live append Node identity ثابت.

### Client card model

- terminal استخدام raw args/content نيل إلى قد ثابت props.
- diff استخدام args/meta نيل إلى قد ثابت diffs.
- read استخدام meta/content نيل إلى قد ثابت lines.
- search استخدام meta/content نيل إلى قد ثابت grouped/path card و recovery.
- web استخدام meta/content نيل إلى قد ثابت sources/fetch summary.
- unknown،malformed،error،missing-call و missing-meta متابعة Generic.
- `parentCallId` ناقص و وجود حالة استخدام إثبات terminal ملائم استخدام قاعدة متسق، و إبقاء diff،read،search و web descendant Generic fallback.
- Chat و Details مقابل نفس block نيل إلى نفسه card fields.

### Deliverables

- write/edit نجاح إنتاج `file_path`.
- str_replace_editor create/str_replace/insert إنتاج `path`.
- str_replace_editor view لا إنتاج path.
- failure،interrupted،malformed و orphan لا إنتاج path.
- first-seen ذهاب إعادة و closing seq cut ثابت.

### تجميع و متصفح

- terminal،diff،read،search،web browser expected لا تحديث جديد و الكل عبر.
- tool tree،details،trajectory و deliverables مرئي تأكيد لا تعديل مسبق مدة.
- built Client عبر حقيقي Remote page/follow أخذ نيل raw events بعد ما زال عرض نفس مثال بطاقة.
- fixture و حقيقي Host استخدام نفس Client derivation.
- minimal preset مفرد وحيد ثابت persistent shell سلوك.

### ساكن حالة و وثيقة

- إنتاج شفرة لا وجود `SessionToolView`/`SessionToolCallView`.
- Session history لا مرجع `dsh-tools/presentation`،`ctx.tools`،`presenterScopeFor` أو `backscanArgs`.
- Client Conversation لا مرجع `ToolCallView`/`ToolResultView`.
- Client model لا قراءة `callView`/`resultView`.
- fixture لا تعريف presenter mirror.
- Host `presentCall`/`presentResult` و `presentationMeta` ما زال وجود.
- لا يوجد إضافة جديدة Client registry أو Host→Client presentation hint.
- تلقي أثر يد كتابة نوع،README،Agent Note،catalog و graph إبقاء تزامن.

## تحقق أمر

تعديل هذا قرار وقت استخدام `dsh-pre-push-checks` حسب نهائي diff اختيار أمر؛ الذي يحتاج دليل يشمل:

- Session Controller history/transport تجمع تركيز اختبار؛
- ui-chat و ui-trajectory Tool Definition اختبار؛
- ui-tool terminal،diff،read،search،web،row،tree و details اختبار؛
- ui-deliverables produced-files اختبار؛
- تجميع RemoteMock و Client runtime اختبار؛
- تلقي أثر Host/Client TypeScript face؛
- lint و duplication؛
- تلقي أثر مصدر ملف per-file 100% coverage؛
- `DSH_SNAPSHOT=replay pnpm run test:web`، لا نيل refresh قائم عرض golden؛
- يد كتابة Remote نوع و TypeScript فحص؛
- `pnpm run doc-sync`؛
- `git diff --check`.

## قد تسليم ثابت كمية

- Session page/follow لا قراءة Tools registry أو presenter scope.
- Session history لا وجود callId backscan،presentation cache أو view clone.
- Remote Session entry لا يحمل view.
- Session سجل و `SESSION_FORMAT_VERSION` ثابت.
- result meta تدريجي بايت عبر سجل و Remote وصول Client.
- Conversation فقط من raw event تجميع ToolCallBlock.
- ToolCallBlock لا يحتوي Host render-intent حقل.
- خمسة صنف بنية تحويل card model فقط قراءة raw block و Session path facts؛ فقط لديه diff،read،search و web استخدام `parentCallId` رفض فرعي استدعاء.
- Generic،Todo،Question،Skill و Cordis سطر سلوك ثابت.
- Deliverables لا اعتماد render intent كما إبقاء حالي paths.
- كل رقم واحد جهة قمة طبقة أداة نص، مكون، توسيع محتوى، حالة، رابط و ترتيب ثابت.
- malformed،missing-meta،error،orphan و unknown-tool متابعة أمان fallback.
- PTC dispatch diff،read،search و web فرعي استدعاء إبقاء Generic/flattened؛terminal فرعي استدعاء التزام دوران أصل استدعاء ملائم استخدام قاعدة.
- Chat،Details و Trajectory سلوك ثابت.
- قائم Web browser expected بلا حاجة تحديث جديد يكفي عبر.
- Host presenter API، تنفيذ و مباشر اختبار ثابت.
- ACP إخراج ثابت.
- لا يوجد جديد تحت سطر عرض حقل أو ثاني طقم Client registry.
- قسم صفحة صار هذا لم يعد مع result عدد كمية ركوب بـ صفحة حدث عدد زيادة طويل.
- تحت سطر payload لم يعد تكرار result meta card DTO.

## Alternatives considered

### فقط أفضل تحويل `backscanArgs`، إبقاء view

page قبل بناء قيام مرة `callId → {name,args}` Map يمكن يأخذ عودة مسح خفض لـ خط صفة،live قد لديه `openCalls` سريع مسار؛ لكن Host lookup،preset scope،presenter،JSON clone، تكرار payload و مزدوج إعادة كل حق ما زال وجود، لذلك رفض.

### في Client بناء presenter registry

يأخذ `presentCall`/`presentResult` واجهة نسخ إلى متصفح سوف و `tool.call.toolview` slot تكرار تسجيل، دورة الحياة،fallback و تغطية دلالة؛renderer ما زال يحتاج يأخذ presenter DTO تحويل صار مكون props، لذلك رفض.

### يجعل Conversation Tool Definition توليد موحد واحد view

هذا سوف يأخذ أداة اسم و UI card دلالة وضع دخول target-neutral Conversation owner، و إعادة بناء و Host view نفس بنية في بين DTO، لذلك رفض.

### حذف `presentationMeta`

read سطر بنية،applied diff،search قسم مجموعة،web sources و صالح truncation لا يمكن من نموذج نص بلا ضرر استعادة؛ تحليل ذاتي من نص أيضا سوف يأخذ UI ربط إلى إخراج إجراء لفظ، لذلك رفض.

### حفظ دائم canonical tool result

هذا سوف توسيع كبير Session log، كشف داخلي نتيجة بنية، تغيير حمل دائم صيغة، و ممكن حفظ بعيد تجاوز عرض الذي يحتاج كبير كائن؛ قد لديه metadata كاف كاف، لذلك رفض.

### حذف Host presenter API

واحد و حذف يمكن متابعة استلام تقليص شفرة، لكن هذا قرار إبقاء Host `presentCall`/`presentResult`؛ ذلك API، تنفيذ، اختبار و نوع مستقل في Session Remote.

### Client استيراد Host أداة تنفيذ

أداة حزمة يتضمن Node،filesystem،subprocess أو provider اعتماد، لا يستطيع دخول متصفح bundle؛Client فقط إزالة استهلاك raw JSON، و في ذاتي ذات renderer داخل صيانة ضيق تحليل، لذلك رفض.

### حسب نتيجة نحو Host استعلام presentation

حسب يحتاج RPC سوف يأخذ واحد صفحة قراءة تغيير صار N مرة شبكة استدعاء، ما زال يحتاج Host lookup،scope،callId فحص بحث و خطأ تنسيق ضبط، لذلك رفض.

### سماح عرض زيادة قوي

سوف أكثر وفير غني PTC dispatch بطاقة، ناقص call head دفع قطع أو أخرى تاريخ عرض زيادة قوي و كل حق تغيير ربط ربط، سوف جعل لقطة لا يمكن إثبات مقابل انتظار. هذا قرار رفض هذا نوع ربط ربط؛[تضمين طقم terminal بطاقة مثال خارج](../bug-fix/2026-09-05-nested-terminal-cards.ar.md) لا وضع عرض غير terminal فرعي استدعاء حد.

### قبول مؤقت Generic تراجع تحويل

أولا توقف إرسال view مجددا تدريجي خطوة تكملة Client card سوف يجعل terminal،diff،read،search،web و Deliverables في في بين إصدار تراجع تحويل.Client مقابل انتظار تنفيذ و Host حذف يجب في نفس يمكن إصدار تغيير في إتمام.

## Consequences

هذا قرار من Session قراءة في حذف presentation عمل، تكرار مسح و تكرار view payload؛ بديل قيمة هو إبقاء Host presenter و Client card derivation يمكن مستقل عرض دخول، لذلك اثنان جانب كل حاجة owner مخصص تابع اختبار،Web عرض مقابل انتظار ما زال هو واضح منتج قيد.

### Client و Host منطق عائم نقل

نفس أداة يمكن لديه واحد نسخة Host render intent و واحد نسخة Client card derivation. اثنان من موجه إلى مختلف مستهلك، لا مشترك تشغيل مسار؛ لا تحديث جديد browser expected ثابت رقم واحد جهة Web نظر شعور مقابل انتظار،Host presenter اختبار فقط قيد Host API.

### نفس اسم provider بلا مستقر identity

raw event فقط سجل tool name، لا سجل أداة جسم ToolDefinition.Client استخدام صالح حدث حقل إبقاء عادي و persistent shell فرق مختلف؛ لا يمكن حكم آخر ذاتي تعريف أو شاذ شكل إدخال رجوع Generic،wire لا لـ إدارة نقاش توسيع صفة زيادة hint.

### Metadata هو لم معرفة JSON

قديم Session ممكن نقص حقل، يد عمل تعديل سجل ممكن حمل شاذ شكل قيمة. كل Client model يجب نطاق جزء استلام ضيق، لا يستطيع يأخذ لم معرفة عدد مجموعة أو كائن مباشر نقل إعطاء UI primitive.

### preset-owned projection متاح صفة

history لا لـ حالي تركيب في ناقص projection unit تكملة تعويض. حاجة في بارد قراءة في إبقاء مرئي preset-owned unit، يجب من مشترك Session preparation/projection تركيب في restore قبل توفير ذلك تعريف؛history لا نيل إعادة زيادة preset mount أو presenter setup فرع.

### مزدوج target تزامن

Chat و Trajectory كل لديه مستقل Tool Definition، اثنان من كل يحمل raw fields؛card derivation فقط قدرة إبقاء في `ui-tool`، لا يستطيع نسخ دخول اثنان عدد Definition.

### Deliverables خفي صفة اعتماد

Deliverables لا هو نظر شعور مكون، لذلك mutation parser يجب و تلقي دعم حمل رقم واحد جهة كتابة أداة إبقاء تزامن؛ مخصص استخدام اختبار مستقل في بطاقة قطع رسم ثابت file chips و Markdown links.

### Fixture زائف أخضر

fixture تحت إرسال raw event/meta، لا تحت إرسال يد كتابة view. حقيقي Host تجميع تغطية ما زال لا بد يلزم، لأن fixture-only snapshot لا يستطيع إثبات transport مسار.

### خطأ تحديث جديد لقطة

هذا مرة تحمل وعد مستخدم مرئي إخراج ثابت. ظهور snapshot diff وقت يجب إصلاح Client إرسال توليد؛ حذف غير owner مفرد وحيد دفعة دقيق أداة جسم نظر شعور تغير، لا فإن لا نيل refresh expected.

### وثيقة عائم نقل

raw journal أو Client presentation owner تغير وقت،Agent Note،package README،cookbook، أصل قاعدة و generated reference يجب واحد بدء تحديث؛Host API وثيقة إبقاء مستقل.

### Remote بروتوكول استلام تقليص

optional `view` ناقص هو كل consumer مشترك نفس التزام حراسة مسبق إصدار wire نوع قرار؛ لا يوجد توافق shim، مزدوج كتابة أو إصدار تنسيق تجارة.

## و قائم قرار علاقة

[تضمين طقم terminal بطاقة](../bug-fix/2026-09-05-nested-terminal-cards.ar.md) فقط جزء يحل محل terminal فرعي استدعاء بطاقة منع أمر و ذلك عرض مقابل انتظار اشتراط. هذا نص متابعة مسؤول أصلي journal كل حق،Client إرسال توليد و diff/read/search/web فرعي استدعاء حد.

هذا نص جزء يحل محل [Client أداة عرض كل حق](../../archived/architecture/2026-08-08-client-tool-presentation-ownership.md) في “card model استقبال Host view” تنفيذ واقع؛`ui-tool` يملك عرض، عمل خدمة إضافة استخدام keyed slot،Conversation فقط يملك دورة الحياة و توسيع اندفاع نواة قلب قرار إبقاء ثابت.

هذا نص إبقاء [toolview ذوبان حل](../../archived/architecture/2026-07-23-toolview-dissolution.md) قرار:Client ما زال فقط لديه slot تسجيل نموذج، لا استعادة `ToolViewRegistry`.

هذا نص استلام ضيق [render-intent union](2026-07-02-tool-render-intent-union.ar.md) إزالة استهلاك نطاق:Host API و نوع إبقاء،Session Remote و Web Client لا إزالة استهلاك هو. هذا نص وحيد ذاتي قاعدة تحديد transport تفكيك قسم، لا تعديل كتابة هذا presenter قرار.

هذا نص تحديث [Session تاريخ و Remote حدث نقل](2026-08-18-session-history-and-event-transport.ar.md) entry اتفاق:journal فقط تشغيل نقل أصلي event و مستقل projection baseline، لا تحمل تحميل مؤقت tool view.

هذا نص التزام دوران [Conversation Node تجميع](2026-08-09-client-conversation-node-assembly.ar.md):Tool Definition مسؤول حدث إعداد مقابل و استدعاء شجرة، أداة جسم card model إبقاء في `ui-tool`.

هذا نص إبقاء [مواصفة أداة إخراج اتفاق](2026-07-20-canonical-tool-output-contract.ar.md) result metadata، لأن هو هو بلا ضرر، يمكن إعادة وضع Client إرسال توليد إدخال.

## Deferred

- Host presenter إذا طويل مدة لا يوجد إنتاج إزالة استهلاك من، يمكن من آخر بند واضح قرار تقييم تقدير حذف؛ هذا قرار لا مسبق حكم.
- PTC dispatch فرعي استدعاء diff،read،search و web مخصص استخدام بطاقة ما زال يحتاج مستقل تصميم و تحديث مرئي لقطة؛terminal استدعاء من رابط جزء يحل محل قرار مسؤول.
- رقم ثلاثة جهة mutation tool إذا يلزم إضافة دخول Deliverables، يحتاج إضافة جديدة Client-owned مساهمة؛ هذا قرار لا لـ بعد بلا إزالة استهلاك من توسيع صفة بناء registry.
- نفس اسم provider إذا يلزم مختلف Client عرض، يحتاج أولا تعريف مستقر، غير عرض صفة identity؛ لا نيل استعادة حسب صفحة Host view.
- Client card model إذا يحتاج كمية تحويل صفة قدرة، يمكن زيادة immutable-block دقيق أساس دقيق؛ قد تسليم هيكل بنية منع توقف مسح Session window.

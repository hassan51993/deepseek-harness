# Agent Note: Web عميل هيكل بنية——client cordis إضافة شجرة،slot جسم نظام و React-free كائن طبقة

Status: implemented

[English](2026-07-19-gui-web-client-architecture.md) | العربية

> قسم عمل خط: تاريخ فوق عبر طريق غير متصل قسم طبقة نموذج و RPC بروتوكول رؤية[قد عودة ملف قسم طبقة و RPC بروتوكول قلم تسجيل](../../archived/architecture/2026-07-19-gui-layering-and-rpc-protocol.md) ؛ هذا مقالة = متصفح جانب:client cordis شجرة مثل أي تركيب تحميل،UI إضافة مثل أي مرور slot و خدمة تركيب،React-free كائن طبقة مثل أي بـ غير ممكن تغيير لقطة توفير إعطاء React.

## Problem

متصفح عميل تلقي اثنان سهم قوة تشكيل شكل. ذلك واحد هو تدفق صيغة: حدث قيادة محادثة UI داخل، إذا عمل خدمة حالة (حدث نافذة، تدفق صيغة تراكم تراكم، انتظار جواب تفاعل، اتصال حالة آلة) تفرق سقوط في React مكون و عام store في، كل token قسم قطعة كل سوف اهتزاز تأرجح تصيير شجرة، كما تبديل UI مكتبة انتظار في إعادة كتابة عمل خدمة منطق. ذلك اثنان هو وحدة تحويل:UI وظيفة (تخطيط، جانب شريط، محادثة، رئيسي عنوان، لغة حزمة) يجب هو يمكن مستقل تركيب تحميل إضافة——حسب host تحت إرسال manifest(بيانات وصفية بيان) في وقت التشغيل تركيب، بينما غير تحرير ترجمة دخول مفرد واحد bundle——معا لا وضع ترك عبر إضافة حد تحرير ترجمة مدة نوع أمان.

## Decision

اثنان طرف كل ركض cordis.host هو واحد شجرة cordis إضافة شجرة؛ متصفح داخل ركض ثاني شجرة client جانب cordis شجرة، منها كل واحد بند UI قدرة كل هو إضافة، من قشرة ساكن حالة يحتفظ loader حركة حالة تركيب تحميل. شجرة داخل cordis ctx تحمل تحميل واحد قطع وقت التشغيل واقع (خدمة،store، جلسة scope) ،React هو صاف إسقاط: مكون مقابل إطار هيكل صفر import، واحد قطع مرور props حقن، مرور `useSyncExternalStore`(تحت تسمية uSES) حجز قراءة غير ممكن تغيير لقطة.

```
┌─ Host ─────────────────────────┐   ┌─ Browser ─────────────────────────────────────────┐
│ sessions/agents/SessionLog     │   │ client cordis root ctx                             │
│ Connection + Gateway: RPC/events│◀─▶│  ├ vendored Loader + ctx.modules(داخل نواة، قشرة ساكن حالة يحتفظ)│
│ webserver:                     │   │  ├ immediately entries: connection/runtime/        │
│  ├ GET /plugins/<id>/client.js │   │  │   ui-theme/i18n(fetch bundle،boot مسبق سحب)       │
│  └ GET / حقن __DSH_BOOT__ رسم  │   │  ├ lazy entries: layout/sidebar/                   │
│                                │   │  │   conversation/trajectory(fetch bundle، حسب يحتاج) │
└────────────────────────────────┘   │  ├ ui-renderer(fetch bundle،React أصل)       │
                                     │  └ session scope ×N(مراقبة نظر قيادة، كسول صفة بناء)            │
                                     │ DOM loading صفحة → settled → React UI مرة صار نوع       │
                                     └────────────────────────────────────────────────────┘
```

## client cordis شجرة و تركيب تحميل سلسلة

تركيب تحميل سلسلة——اثنان صنف حزمة (عادي حزمة vs dsh.client إضافة) ، وحدة نظام/إضافة معالجة إدارة جهاز لـ قسم،host وحيد بيت تأليف كتابة حمل إصلاح حجز رقم entry رسم لـ فوق مزدوج مرحلة مقطع boot، حار إعادة تحميل——عودة [client إضافة تركيب تحميل قلم تسجيل](2026-07-23-client-plugin-loading-model.ar.md) كل. هذا مقالة اعتماد بـ قيام كاف واقع: متصفح بدء و host نفسه vendored `@cordisjs/plugin-loader`، من client وحدة نظام (`ctx.modules`،`packages/client/modules`) ملء فوق ذلك `internal` اتفاق؛ كل حمل منتج سلوك وحدة كل هو host وحيد بيت تأليف كتابة `__DSH_BOOT__` رسم داخل entry——كل إنتاج إضافة حزمة (يحتوي أساس أساس ضبط تطبيق) كل يحمل `dsh.client` إعلان، بـ fetch وصول `./client` tsdown إغلاق حزمة bundle توفير إعطاء،`immediately` سطر فرق آخر فقط في boot رقم واحد مرحلة مقطع مسبق أخذ، بينما عادي حزمة (react بيت عائلة،cordis، بعد لم رفع إطار مكتبة) إبقاء ضرب دخول قشرة، قد بث نوع، مقابل رسم غير ممكن رؤية؛bundle تنفيذ `window.__ModuleLoader__.load({ id, factory })`، ذلك `require` من lazy CJS وحدة جدول ينبغي جواب (نوع فرعي كلمة بند + قد تسجيل تسجيل عمل مصنع، أول مرة require وقت شيء تحويل و تسجيل ذاكرة تحويل——عبر إضافة قيمة import هو بناء خطأ، تنسيق عمل مشي cordis خدمة) ؛ عام مثال صيغة و CSS Modules كل داخل ربط في ذلك يحتفظ إضافة bundle في، شيء تحويل وقت حقن لـ `<style data-plugin="<id>">`(CSS Modules أيضا سوف أخذ نيل ها أمل صنف اسم؛ ملكية وسم جعل إعادة تحميل وقت إزالة يصبح ممكن) ؛ حار إعادة تحميل قد في dev رسم سقوط أرض——webserver مقابل ذاتي ذات توفير إعطاء bundle فعل stat جولة استفسار و واسع بث `rebuilt` SSE لقطة،`client-hmr` إضافة كل لقطة تبديل إسقاط واحد fiber.`loader.await()` و كل ACTIVE مسح إتمام بعد، لا اعتماد إطار هيكل داخل نواة سوف استدعاء حركة حالة UI مصير `ctx.uiRenderer.mount(container)` مرة——هذا وقت كل entry قد إنشاء، كل fiber كل وصول ACTIVE،FAILED/PENDING fiber يتم كبير صوت صف خروج؛ لا وجود جزء متاح نمط (تدريجي دخول تصيير لـ بعد وضع عمل).

نوع كون فضاء في تجمع دمج طبقة تفكيك قسم——`tsconfig.host.json` هو host program،`tsconfig.client.json` هو client program، اثنان من من solution أصل `tsconfig.json` مرجع، لأن اثنان جانب كل في نفسه مفتاح (`sessions`،`loader`) فوق مقابل cordis `Context` فعل إعلان دمج كما خدمة مختلف؛client حزمة مرور صاف نوع فرعي مسار (`@deepseek-ai/dsh-session/types` انتظار) إزالة استهلاك بروتوكول مفردات،host جانب إعلان دمج لن تركيب عربة دخول client program.

## slot جسم نظام: صفحة كيف ما تجميع

slot جسم نظام لديه ذاتي ذات قلم تسجيل——[slot جسم نظام معيار](2026-07-22-slot-type-chain-implementation.ar.md)——هذا نص كامل جسم نقل تسليم إعطاء هو. هذا موضع فقط إبقاء واحد مقطع تحديد موضع ملخص:ui-renderer فقط تصيير `'root'`؛ إضافة استخدام مفرد وحيد مرة `register` استدعاء تركيب UI——احتلال استخدام slot، إعلان و تخويل فرعي slot(`children` spec كائن) ، إعلان store، حقن عمل خدمة وجه؛ مكون props قسم أربعة نسخة مقدار تلقائي دفع توجيه وصول (`PropsRuntime<K>` / `PropsRenderSlots<S>` / `PropsStore<H>` / inject) ، كل لديه وحيد حق مصدر.`SlotMap` إعلان دمج ما زال هو نوع مرجعي،entry فقط يحمل owner نسخة مقدار («من حقن، نوع عودة من») ؛ كل يتم تصيير تسجيل بند كل في per-entry خطأ حد لـ داخل.

تنفيذ بيت: سجل التسجيل نواة قلب و props نسخة مقدار نوع في `packages/client/ui-slots`؛outlet مصير،uSES جسر، تطبيق درجة تثبيت و أصل تركيب في `packages/client/ui-renderer`.

## خدمة و scope بحث عنوان

خدمة هو إضافة مقابل أخرى إضافة وحيد API(UI مكون و حقن وجه كل لا هو API؛ بلا شخص استدعاء إضافة لا تعليق خدمة——ui-trajectory أي الأكثر صغير إضافة مثال لوح: بلا ctx خدمة، فقط فعل عرض slot تسجيل). اسم سجل:`ctx.connection`(RPC نقل + generation حالة) ،`ctx.slots`(سجل التسجيل حزمة تركيب طبقة، إرسال `slots/changed`، تصيير مدخل، مصير تثبيت اتفاق) ،`ctx.sessions`(قائمة store، حالي جلسة حالة،scope شجرة) ،`ctx.loader`،`ctx.theme`،`ctx.i18n`،`ctx.layout`(عبر إضافة عرض تنقل) ،`ctx.conversation`(send/cancel/startSession). مرور ذهاب إقامة في خدمة store داخل مراقبة نظر حالة (وجه لوح عرض، اختيار في، مسودة مسودة) الآن حسب [slot جسم نظام معيار](2026-07-22-slot-type-chain-implementation.ar.md) إقامة entry إعلان store.

slot خارج لا وجود ثاني نوع مكون تسجيل نموذج——أصل عرض حلقة و أداة حلقة كل قد ذوبان حل دخول قدوم. جلسة عرض أي ui-conversation إعلان `'conversation.view'` list slot entry،tab بيانات وصفية مع تسجيل options(`id`/`order`/`label`) مشي،per-view chrome إقامة عرض مكون ذاته. نهائي Chat عمل خدمة Node عبر keyed/session `'conversation.chat.node'` slot توزيع؛ui-tool يملك منها `tool-call` entry، تمرير عودة تصيير نقل دخول `subCalls`، و إعلان keyed/session `'tool.call.toolview'` فرعي slot.key فضاء ما زال في وقت التشغيل فتح وضع (SlotMap إعلان slot، من لا إعلان key) ،root و مهمة معنى عميق درجة بعد بديل كل حسب `entryKey: toolName` توزيع، بـ `GenericToolCard` التقاط قاع. عمل خدمة حزمة عبر `ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({ name: 'tool.call.toolview', key: '<tool>' }, Row))` تسجيل أصل فرعي عرض؛ إعلان ذاته حينئذ هو تحميل و إعادة تحميل اعتماد ([قرار](../../archived/architecture/2026-08-05-slot-declaration-injection.md)). يمين صف هو ui-sidebar-right بـ كل جلسة واحد توقف اعتماد وجه ملء ملء `rightbar` حفرة موضع؛ أصل قدوم تفصيل حال صف و ذلك `'conversation.details.tool'` حفرة موضع قد حذف ([قرار](../feature/2026-09-04-right-sidebar-docking-infrastructure.ar.md)). و target غير متصل حدث سجل التسجيل و عرض سجل التسجيل هو بيانات تجميع seam، لا هو مستو سطر مكون سجل التسجيل ([قرار](2026-08-09-client-conversation-node-assembly.ar.md)).

**scope بحث عنوان**و host جانب agent(ذكي جسم)scope معتاد مثال نفس بنية: خدمة هو root مفرد مثال، طريقة لا استلام sessionId——هو جمع قراءة استدعاء جهة ctx فوق scope علامة (`scopeOf(ctx)`). في جلسة scope داخل،`ctx.conversation.send('hi', 'queue')` تلقائي ضرب إلى هذا جلسة؛ عبر جلسة استدعاء تبديل ctx تحديد نحو (`ctx.sessions.scope(id)!.conversation.send(...)`) ؛ من root ctx مباشر ضبط scoped طريقة أي throw.client جلسة scope صب صنع طريقة و host agent scope نفسه (no-op إضافة fiber + scope مفتاح extend) ، أول مرة مراقبة نظر وقت كسول صفة بناء، فقط لديه جلسة يتم إزالة كما بلا شخص مراقبة نظر عندئذ تفكيك——فقط host جلسة ميت هلاك لا تفكيك scope(تجميد ربط لـ فقط قراءة نظر نافذة).

## بيانات كائن طبقة (`packages/api/session-controller/src/client/`)

لقطة من هذا داخل دخول، لقطة من هذا داخل خروج،Conversation assembler جلوس في في بين——React-free(صفر React import،grep يمكن تأكيد):

```
$events frames (ConnectionController pump, injected sinks)
        │
        ▼
SessionManager.handleMuxEnvelope / handleHostEnvelope
        │ session frames target existing instances (requested waits buffer)
        ▼
Session.handleMuxEnvelope ──► contiguous Event window
        │                        │ replace / prepend / append
        │                        ▼
        │                ConversationNodeAssembler
        │                  Definitions -> Contexts -> view builders
        ▼
Notifier دقيق مهمة دمج دفعة ──► ConversationSnapshot ذاكرة مؤقتة ──uSES──► مكون
```

- **Session**(session.ts): كسول بناء، معتاد إقامة——بناء صار بعد في خلفية حمل متابعة أكل لقطة، قطع مشي قطع عودة ثانية إظهار. عملية وجه:`prompt`/`cancel`(RPC نفاذ نقل؛ فشل سقوط دخول لقطة `promptError`) ،`open`(سحب ذيل صفحة history، قوة انتظار) ،`loadOlder`(نحو فوق قلب صفحة، منع إعادة دخول) ،`resync`(إعادة وصل = صاف نافذة إعادة ركض open). حجز قراءة وجه:`subscribe`/`getSnapshot`(ثابت إرجاع ذاكرة مؤقتة مرجع)——`implements ObservableSnapshot<ConversationSnapshot>`، بنية صنع وقت تعليق `useSelector = bindSnapshotSelector(this)`،Session ذاته حينئذ هو uSES مصدر. لقطة توزيع هو واحد switch:`session/event` لقطة حسب seq ذهاب إعادة (وحيد ذهاب إعادة مفتاح) ،open في طريق وقت مؤقت اندفاع، لا فإن إلحاق + زيادة كمية إسقاط؛open/شق دمج حسب seq دمج live مؤقت اندفاع و ذهاب إعادة،`subscribed.lastSeq` تجاوز خروج نافذة ذيل فإن عودة تكملة مرة.
- **ConversationSnapshot**(conversation.ts): قمة طبقة غير ممكن تغيير لقطة اتفاق.`chat` يتضمن بنية تحويل `order`،identity مستقر keyed Node reader،Turn/Step index و timeline؛`nodes`،`partial`،`runningCalls`،`turnTimings`،`turnEnds` هو لم ترحيل Trajectory مستهلك استخدام توافق slice.pending interaction،running،removed،open state،paging و prompt error ما زال هو Session معلومة؛ انتظار معالجة Inbox قيمة فإن يقع في عام Session projection store.**مرجع سجل قاعدة**(memo و uSES قبل رفع): لم تغير فرعي بنية و Node value إبقاء مرجع؛ مفرد عدد عمل خدمة تحديث فقط استبدال مقابل key value، حذف غير هو ترتيب أو Location حدوث تغير.React عبر `useSession(selector)` قراءة Session lifecycle، عبر `useProjection(key, selector)` قراءة مجال إسقاط، جعل كل hook كل عزل غير متصل تحديث.
- **SessionManager**(manager.ts): نسخة عنقود + لقطة مجموع مدخل + جلسة قائمة. حمل sessionId لقطة فقط إلقاء قد وجود نسخة (mux واسع بث لا نيل يأخذ كل جلسة كل نسخة تحويل) ؛ مثال خارج هو مراجعة دفعة/سؤال جواب `requested` لقطة——هو جمع لا سقوط history،open لا يمكن عودة تكملة، لذا مؤقت اندفاع دخول `pendingBuffers`، نسخة تحويل وقت إعادة تشغيل.
- **Notifier**(notifier.ts): اثنان بند إشعار عبر طريق، حسب تغيير مصدر أخذ استخدام.`markDirty()`(افتراضي؛ لقطة قيادة واحد قاعدة استخدام هو) حسب دقيق مهمة دمج دفعة——N مرة تغيير، مرة إشعار، مرة إعادة تصيير؛flush أولا إعادة بناء لقطة ذاكرة مؤقتة مجددا إشعار.`notifyNow()`(فقط مستخدم يد اتجاه مباشر عودة صدى) نفس tick إعادة بناء و إشعار——تلقي تحكم إدخال عودة صدى إذا تأخير إلى دقيق مهمة،DOM سوف تراجع، ضوء علامة قفز ذيل. لقطة قيادة شفرة استخدام notifyNow سوف يجعل دمج دفعة انهيار عودة تدريجي لقطة تصيير؛ منع.
- **ConversationNodeAssembler**(`runtime/src/client/conversation/`):Session يملك زيادة كمية جذب محرك في أصلي حدث فوق تشغيل كل منها مستقل تسجيل Definition.`match(event)` بلا يجب مسح Context يكفي اختيار خروج `(kind, id)`؛start/update بنية صنع Definition state؛ جذب محرك حساب حساب Location يحمل Turn/Step إغلاق معلومة؛ نحو قبل استعلام Context وقت سجل اعتماد، و من لاحق prepend إصلاح؛`buildViewNode(target)` فقط شيء تحويل dirty Context.Chat builder إبقاء بنية ترتيب و per-key value identity،`useSession` selector مسؤول إزالة استهلاك عزل،Assistant token إصدار فإن دمج إلى كل animation frame مرة.[Conversation Node قرار](2026-08-09-client-conversation-node-assembly.ar.md) يملك تجميع حد،[Tool عرض كل حق](../../archived/architecture/2026-08-08-client-tool-presentation-ownership.md) يملك Tool تمرير عودة تصيير.
- **ConnectionController**(يقع في `packages/client/connection`): فتح `$events` Remote تدفق، عبر for-await مضخة دخول، و في generation محيط شريط داخل إشارة عدد تراجع تجنب إعادة وصل (500ms قلب ضعف حتى 10s غلاف قمة، اهتزاز حركة، بلا حد إعادة محاولة) ؛sink مفرد نحو حقن،Controller لا إقرار تعرف Session. إعادة وصل أي إعادة بناء:`onConnected` → قائمة تحديث جديد + كل قد فتح جلسة resync. كائن طبقة عبر `ctx.remote` استدعاء توليد نطاق الأسماء؛Web تحميل جسم بـ HTTP POST تحمل تحميل Remote واحد عنصر استدعاء، بـ API Gateway WebSocket mux تحمل تحميل منطق تدفق،Connection فإن يملك طلب نقل و generation.

## React وجه (`packages/client/ui-renderer`)

حركة حالة ui-renderer إضافة يحتفظ ctx↔React مهايئ، تطبيق درجة تثبيت، أصل تركيب و عنوان إسقاط. عمل خدمة مكون عبر slot props استقبال ربط بعد خطاف، لا مقابل مصير فعل قيمة import.

- لقطة store جذب محرك**إقامة runtime حزمة**(zustand vanilla + مسودة مسودة صيغة تحديث، نقص حذف `flush: 'sync'`، اختياري `'raf'` دمج دفعة، اختياري كامل قيمة localStorage حفظ دائم،dev عميق تجميد ربط——الكل من `runtime` `./client` رئيسي خروج فتحة توجيه خروج، بلا فرعي مسار):store ناتج هو عار يمكن مراقبة مصدر، لا حمل أي خطاف عضو. إضافة فقط مرور [slot جسم نظام معيار](2026-07-22-slot-type-chain-implementation.ar.md) `defineStore` إعلان لمس و جذب محرك.ui-renderer في ربط موضع (`bindSnapshotSelector`، حسب مصدر ذاكرة مؤقتة) من React إزالة استهلاك وحيد بيانات اتفاق دمج صار كل خطاف:`ObservableSnapshot<T>`(`getSnapshot`/`subscribe`)——Session كائن و لقطة store نفس بنية ممتلئ كاف هو.
- `bindSnapshotSelector(source)`: يأخذ واحد مصدر ربط لـ مرور uSES-with-selector حمل نوع selector خطاف.uSES اتفاق أربعة بند حسب بنية صنع صار قيام:getSnapshot ثابت إرجاع ذاكرة مؤقتة مرجع؛subscribe هو ربط مدة إغلاق حزمة (مرجع دائم مستقر) ؛ صاف CSR لا نقل server snapshot؛ متبادل انتظار صفة نقص حذف `Object.is`، حسب استدعاء اختياري `shallowEqual`.
- متبادل انتظار صفة بروتوكول، كل سلسلة متسق: إنتاج طرف بنية مشترك؛ مستهلك بـ `Object.is` أو `shallowEqual` قصير مسار؛`React.memo` ضحل مقارنة مقارنة. عميق مقارنة مقارنة كل سلسلة منع توقف.

## دليل شكل

Client حزمة يقع في `packages/client/*`،`apps/web` هو قشرة boot توجيه خروج لـ فوق رقيق Vite تطبيق. إضافة حزمة متصفح نصف حافة في `src/client/` تحت؛**واحد قطع بناء ناتج سقوط `lib/`**——node نصف حافة لـ `lib/index.js`/`lib/invariant.js`، متصفح bundle لـ `lib/client.js`(مشترك tsdown client مسبق ضبط اثنان من جميع خروج؛ بلا `dist/` دليل،`exports["./client"]` إشارة نحو `./lib/client.js`).`ui-slots`،runtime و ui-renderer بنية صار أساس أساس ضبط تطبيق جهة نحو؛ وظيفة إضافة عبر خدمة و slot تنسيق عمل، لا استيراد عرض تنفيذ.

كثير مجال إضافة حزمة client نصف حافة أيضا حسب لم قدوم حزمة حد مجددا تفكيك——ui-conversation أي مثال لوح:

```
src/client/
  contract/    shared slot and cross-domain types
  service.ts   cross-domain orchestration
  skeleton/    conversation shell and details host
  conversation-nodes/ independently registered business Definitions and Chat builder
  chat/        ordered conversation view
  input/       composer state machine
  queue/       queued-message presentation
  settings/    conversation settings rows
  apply.ts     cross-domain assembly point
  index.ts     public contract surface
```

كل مجال تنفيذ ملف لا import أخ أخ مجال؛ مشترك وجه موحد واحد مرور مرور `contract/`.`scripts/verify-client-domain-graph.ts` يأخذ حراسة قسم طبقة (contract=0،domain=1،apply/index=2؛import فقط دقيق إشارة نحو لا عال في ذاته طبقة درجة؛ أخ أخ مجال اعتماد سوف فشل).Tool عرض قد تفكيك لـ مستقل `ui-tool` حزمة، فقط عبر ui-conversation إعلان slot وصول chat و details.

## كيف ما تطوير

- **جديد UI وظيفة** = جديد إضافة حزمة:package.json إعلان `dsh.client`(+ `inject` توسيع اندفاع) ، متصفح نصف حافة كتابة في `src/client/`(apply تعليق خدمة/بناء store، تسجيل slot) ، بلا host منطق وقت node نصف حافة إبقاء فارغ apply، استخدام مشترك مسبق ضبط بناء. يأخذ إضافة إضافة دخول host إعداد؛manifest و تركيب تحميل مع لـ تلقائي تتبع فوق.
- **جديد slot**: رؤية [slot جسم نظام معيار قلم تسجيل](2026-07-22-slot-type-chain-implementation.ar.md)——اتفاق دمج دخول `SlotMap`، في أب entry `children` داخل إعلان، مرور تلقائي حقن `renderSlot` prop تصيير. دائم لا عام توجيه خروج مكون.
- **إزالة استهلاك جديد لقطة نوع**: صاف نقل session frame → Session توزيع switch؛host درجة frame → Manager توجيه جدول؛ قد سجل conversation عمل خدمة حدث → Definition إضافة keyed view renderer، لا زيادة Session عمل خدمة فرع.
- **حالة إقامة أي**: عمل خدمة بيانات (حدث، تدفق صيغة، انتظار جواب)→ دائم بعيد كائن طبقة؛ أب معرفة طريق → renderSlot الآن ساحة owner props؛ مفرد مكون خاص (تمرير، بحث كلمة، توسيع تجميع)→ مكون حالة؛ عبر entry مشترك أو عبر إعادة تركيب تخزين نشط (اختيار في، مسودة مسودة، وجه لوح عرض)→ entry إعلان store([slot جسم نظام معيار](2026-07-22-slot-type-chain-implementation.ar.md)).
- **إشعار عبر طريق**: لقطة قيادة/مختلف خطوة = `markDirty` دمج دفعة؛ تلقي تحكم إدخال حاجة نفس tick مستخدم يد اتجاه مباشر عودة صدى = `notifyNow`.

## Consequences

token تدفق لم يعد اهتزاز تأرجح تصيير شجرة:Assistant chunk فقط تحديث واحد عمل خدمة Context، كل animation frame الأكثر كثير إصدار مرة مقابل keyed Node؛ غير متصل سطر selector نتيجة إبقاء أصل مرجع، لذلك لن إعادة تصيير.UI وظيفة بـ مستقل إضافة حبة درجة تركيب تحميل، فشل، توقف استخدام——واحد انهيار انهيار slot تسجيل بند فقط أسود واحد ورقة بطاقة، واحد تركيب تحميل فشل bundle في UI قطع دخول قبل كبير صوت تقرير خطأ. قبول بديل قيمة:loader/وحدة جدول آلة عنصر هو مجموعة طابور طرف إلى طرف ذاتي حمل تحديد صنع أساس بناء؛ مرة صار نوع بدء (بلا تدريجي دخول تصيير) استخدام أول شاشة حبة درجة تبديل تركيب إعداد بسيط مفرد؛ مزدوج نوع program يجعل «هذا عدد ملف عودة أي عدد تجمع دمج» يصبح تطوير من أحيانا ذلك يلزم عودة جواب مشكلة.

## Alternatives considered

| Rejected | One-line reason |
|---|---|
| ساكن حالة رابط مفرد SPA bundle | إضافة يجب من host في وقت التشغيل حسب إعداد تركيب؛ مفرد جسم يأخذ كل UI وظيفة إعادة اقتران عودة مرة بناء |
| window عام متغير / import map توفير مشترك اعتماد | DI require جدول يجعل مشترك صريح، كبير صوت فشل، يمكن استبدال؛ عام متغير ساكن صامت تسرب تسرب هوية و إصدار |
| عمل خدمة بيانات دخول zustand قطع قطعة | حدث نافذة/تراكم تراكم جهاز هو سلوك حالة آلة، لا هو مسطح مستو قطع قطعة؛ كائن طبقة حفظ إقامة لقطة حبة درجة و دمج دفعة يمكن تحكم صفة |
| Tool سطر استخدام مستو سطر نص مفتاح مكون سجل التسجيل | ui-tool keyed فرعي slot عبر وحيد slot تسجيل نموذج تحمل تحميل وقت التشغيل فتح وضع Tool اسم تجميع دمج ([toolview ذوبان حل](../../archived/architecture/2026-07-23-toolview-dissolution.md)) |
| أول عدد web عميل تسليم حينئذ فعل تدريجي دخول/Suspense بدء | مرة صار نوع صارم إطار أكثر بسيط مفرد؛loader حسب إضافة حالة وجه قد إبقاء، تدريجي دخول نقطة مضيء يوم بعد يمكن سقوط أرض بينما بلا حاجة إعادة بنية |

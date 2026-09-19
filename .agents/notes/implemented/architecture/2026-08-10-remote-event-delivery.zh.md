# Agent Note: Remote حدث إلقاء تمرير (ctx.remote.$on)

Status: implemented

[English](2026-08-10-remote-event-delivery.md) | العربية

## مشكلة

[Typert Remote طريقة استدعاء](../../implemented/architecture/2026-08-02-typert-remote-method-calls.zh.md) الأكثر أول فقط تغطية «مرة طلب واحد نتيجة» تحديد نحو استدعاء، واضح يأخذ Session حدث تدفق و لديه حالة تفاعل إبقاء في آخر موضع؛Host نحو إزالة استهلاك طرف حدث حاجة واحد لا عودة API Proxy مجال كل إلقاء تمرير آلية.

Host يملك `agent-preset/selected`،`commands/change`،`credentials/reference-updated`،`llm/adapters-updated`،`settings/document-updated` انتظار مفرد نحو حدث؛ هو جمع حيث لا اعتماد AgentScope، تحميل حمل أيضا هذا قدوم حينئذ هو JSON. إذا كل بند حدث كل يلزم اختراق مرور API Proxy يد كتابة لقطة،Client Runtime يد كتابة جسر و Client حدث آخر اسم عندئذ قدرة مقاومة بلوغ UI، هذه طبقة لن قديم وصف owner حدث خارج جديد واقع.

ذلك نسخة تكرار إعلان أيضا هو**لديه ضرر**:client جانب كتابة صار `settings/changed(ns: string)`،brand نوع في هذا واحد قفز يتم التقاط مستو صار عار `string`، و Remote طريقة جانب «إزالة استهلاك طرف نوع إشارة نحو عمل خدمة حزمة وحيد رمز رقم» قائم عقد نحو متبادل عكس.

## قرار

إزالة استهلاك طرف Remote وجه يحتفظ واحد حدث حجز قراءة حركة كلمة `ctx.remote.$on(event, listener)`؛**اسم مفرد قيادة، أصل مثال تحويل إرسال**:

- `packages/api/remotes/src/remote-events.ts` يحتفظ واحد نسخة حمل `emit`/`waterfall` mode يمكن تحويل إرسال Host حدث اسم مفرد، هو معا هو «إزالة استهلاك طرف قدرة حجز قراءة ماذا» وحيد تحكم نقطة. جانب حافة `src/types.ts` من هو إرسال توليد نوع إسقاط و ملء ملء selection مقعد موضع، حسب حزمة اتفاق إبقاء صاف نوع. اثنان عدد ملف**كل معا صف دخول هذه الحزمة Host و Client اثنان عدد face `files`**، اثنان جانب قراءة نفس نسخة.
- wire فوق حدث اسم **حينئذ هو host cordis حدث أصل اسم**(`settings/document-updated`) ، لا إضافة `host/` بادئة؛ تحميل حمل **حينئذ هو host فعلي مشاركة قائمة**، تدريجي عنصر عنصر أصل مثال مرور JSON، بلا إسقاط، بلا انفصال حساس، بلا تعديل اسم.
- Host source من `api/remotes` تسجيل إلى API Gateway؛Gateway في قائم `/api/remote.mux` فوق إبقاء داخلي logical endpoint `$events`، لا زيادة شيء إدارة اتصال، أيضا لا يجعل API Proxy حل تفسير حدث.waterfall نتيجة عبر HTTP واحد عنصر endpoint `$events/result` إرجاع.
- حدث**توقيع**لا آخر قيام جدول:owner حزمة يأخذ ذاتي ذات cordis `Events` إعلان نقل دخول client-safe `./types` صاف نوع خروج فتحة، اثنان جانب قراءة**نفس نسخة**——`$on` listener معامل، نتيجة و `next()` كل من `Events[Event]` دفع توجيه.«أصل مثال» لا حاجة إثبات، هو بنية صنع صفة صار قيام.
- لكن**فقط استعارة cordis نوع شكل حالة، لا وصل cordis حدث نظام**: إلقاء تمرير دلالة، سجل التسجيل، استثناء موضع وضع كل عودة Typert ذاتي ذات.

واحد بند `Events` بند إذا توقيع داخل كاف إلى host-only رمز رقم (Service،`Agent`،Context انتظار) ، معالجة طريقة هو**يأخذ شفرة تفكيك إلى قدرة جاف صاف سقوط دخول `./types` لـ توقف**؛ لا قبول «واحد نصف إبقاء index، واحد نصف نقل مشي» قسم شق إعلان، أيضا لا قبول في `./types` داخل صنع بنية انتظار قيمة أثر فرعي نوع. حالي اسم مفرد داخل كل owner كل من client-safe نوع خروج فتحة توفير نفس نسخة حدث إعلان.

اسم مفرد داخل حدث الكل مشي هذا بند مسار، مخصص استخدام لقطة و Client آخر اسم كل قد حذف. نموذج مستهلك مباشر حجز قراءة `llm/adapters-updated` و `settings/document-updated`؛preset مستهلك حجز قراءة `agent-preset/selected`؛Session و حركة حالة Cordis بلا حالة إشعار استخدام `emit`؛Approval و Question استخدام Agent-scoped `waterfall`. حق صحيح حاجة baseline، إسقاط أو ذهاب إعادة بيانات ما زال إبقاء مخصص استخدام Remote stream.

`skills/change`،`tools/change`،`system-prompt/change` هو نفس شكل حالة صاف بطلان حدث لكن**لا يوجد أي قد تسليم إزالة استهلاك من**، حسب «كل سحب كائن كل يلزم لديه حالي owner و يحتاج طلب» لا دخول اسم مفرد، فقط بصفة توسيع موضع سجل في هذا.

### إزالة استهلاك طرف عقد نحو (dsh-typert-protocol)

type-meta إضافة حدث شكل حالة يسمى كلمة،mode بند، اختيار مقعد موضع و `TypertClientRemote` واحد عضو؛ صفر وقت التشغيل شفرة:

```ts ignore-check
import type { Events } from '@deepseek-ai/cordis'

type TypertForwardingMode<Event extends keyof Events> =
  unknown extends ThisParameterType<Events[Event]>
    ? TypertEventResult<Event> extends void ? 'emit' : never
    : TypertWaterfallEvent<Event> extends never ? never : 'waterfall'

/** Cordis event names that can cross the Remote Event carrier without a second signature. */
export type TypertForwardableEvent = {
  [Event in keyof Events]: TypertForwardingMode<Event> extends never ? never : Event
}[keyof Events]

/** Event and dispatch mode accepted by the Remote Event source. */
export type TypertForwardableEventEntry = {
  [Event in keyof Events]: TypertForwardingMode<Event> extends infer Mode
    ? Mode extends 'emit' | 'waterfall'
      ? { readonly event: Event; readonly mode: Mode }
      : never
    : never
}[keyof Events]

/** The Host assembly's forwarding selection; api/remotes' allowlist fills it, no other package does. */
export interface TypertRemoteEventSelection {}

/** `$on`'s legal keys: selected, and present in the current compilation face. */
export type TypertRemoteEvent = Extract<keyof Events, keyof TypertRemoteEventSelection>
```

```ts ignore-check
/** Subscribe to one forwarded Host event; the returned disposer belongs to the calling fiber. */
$on<Event extends TypertRemoteEvent>(event: Event, listener: TypertClientEventListener<Event>): () => void
```

`Events` حسب برنامج تحليل:host برنامج داخل هو host حدث كل تجميع،client برنامج داخل هو client تحرير ترجمة وجه نظر نيل رؤية ذلك بعض——نفس عدد يسمى كلمة في اثنان جانب كل منها صار قيام، لا حاجة يأخذ host إعلان سحب دخول client.

**عقد نحو فقط عام إزالة استهلاك حركة كلمة.**`ClientRemoteService` تنشيط وقت حينئذ يأخذ داخلي وحيد `$events` pump تسجيل لـ Connection generation source، و حالي لديه بلا `$on` حجز قراءة غير متصل؛ متصفح عبر مشترك Remote mux فتح `$events`، عملية داخل تركيب عبر `connection.rpc.open` فتح نفس logical stream. حل رمز، دقيق item تحقق و حجز قراءة جدول إرسال إرسال كل هو Gateway Client خاص تنفيذ،`TypertClientRemote` لا كشف إنتاج جهة طريقة، لذلك عمل خدمة إضافة لا يستطيع زائف صنع واحد بند Host حدث.

كل مرة Host فتح `$events` وقت،API Remotes source factory أولا تزامن تركيب كل allowlist listener،Gateway مع بعد إنتاج خروج أول بند `{ type: 'ready', clientId, host: { home } }`، مجددا بدء تكرار بديل حدث source.`ConnectionController` فقط لديه في هذا بند وصول بعد عندئذ إصدار `connected`، لذلك baseline قراءة لن ركض في زيادة كمية listener قبل وجه.

شيء إدارة mux قطع فتح سوف يجعل logical stream بـ `RemoteStreamCarrierError` انتهاء؛Host إرجاع Remote stream error، معنى خارج صحيح معتاد انتهاء، غير ready أول بند أو شاذ شكل حدث بند أيضا سوف انتهاء حالي generation.Connection سحب عودة هذا generation، في تراجع تجنب بعد إعادة فتح `$events`؛Gateway mux فقط مسؤول إعادة بناء شيء إدارة WebSocket. تحويل إرسال حدث لا إعادة وضع؛ كل صحيح تأكيد صفة اعتماد استعادة حالة،owner يجب آخر لديه استعلام،cursor أو opening baseline، لا يستطيع يأخذ `$on` عند عمل يمكن اعتماد سجل.

Client بـ Remote نسخة خاص Cordis key توزيع. عادي `emit` استخدام `parallel()` و عزل listener فشل؛Agent-scoped `waterfall` في تحليل خروج Agent Context فوق استخدام `waterfall()`، سماح نتيجة، رفض أو `next()` تفويض حمل. اثنان صنف تسجيل كل ملكية استدعاء جهة fiber، كما Host حدث لن إطلاق Client محلي نفس اسم حدث.

### اسم مفرد: اثنان عدد face مشترك قراءة نفس نسخة إعلان

`packages/api/remotes/src/remote-events.ts` معا صف دخول `tsconfig.host.json` و `tsconfig.client.json` `files`، هو اسم مفرد**وحيد بيت**؛`src/types.ts` من هو إرسال توليد نوع وجه:

```ts ignore-check
// remote-events.ts — the value
export const API_REMOTE_FORWARDED_EVENTS = [
  { event: 'agent-preset/selected', mode: 'emit' },
  { event: 'approval/request', mode: 'waterfall' },
  ...SESSION_CONTROLLER_REMOTE_EVENTS.map(event => ({ event, mode: 'emit' as const })),
  { event: 'commands/change', mode: 'emit' },
  { event: 'credentials/reference-updated', mode: 'emit' },
  { event: 'cordis/request-run', mode: 'emit' },
  { event: 'cordis/request-run-resolved', mode: 'emit' },
  { event: 'cordis/dynamic-package', mode: 'emit' },
  { event: 'cordis/dynamic-retract', mode: 'emit' },
  { event: 'cordis/inspect-query', mode: 'emit' },
  { event: 'cordis/inspect-query-resolved', mode: 'emit' },
  { event: 'llm/adapters-updated', mode: 'emit' },
  { event: 'settings/document-updated', mode: 'emit' },
  { event: 'user-questions/request', mode: 'waterfall' },
] as const satisfies readonly TypertForwardableEventEntry[]

// types.ts — the type face, derived
export type ApiRemoteForwardedEvent = typeof API_REMOTE_FORWARDED_EVENTS[number]['event']

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteEventSelection extends Record<ApiRemoteForwardedEvent, true> {}
}
```

في هو**إضافة واحد حدث فقط تعديل هذا واحد سطر عدد مجموعة**: نوع إسقاط،`$on` مفتاح وجه،Host dispatch mode و تحويل إرسال حلقة الكل من هو إرسال توليد.`ctx.remote.$on('slots/changed', …)`(Client محلي حدث) أو `$on('skills/change', …)`(اسم مفرد لا فتح) كل هو**تحرير ترجمة خطأ**.

عدد مجموعة إعلان نهاية ذيل `satisfies` يأخذ Host حدث مفردات و mode قيد سقوط إلى نفس نسخة اسم مفرد فوق:

```ts ignore-check
API_REMOTE_FORWARDED_EVENTS satisfies readonly TypertForwardableEventEntry[]
```

هو بطاقة إقامة ثلاثة عنصر أمر:**اسم حرف دمج قاعدة**(يسمى كلمة بـ `keyof Events` لـ أساس) ،**mode مطابقة توقيع**، و فقط قبول بلا scope `void` إشعار أو حمل واحد درجة Agent scope، نفس نتيجة `next()` و Promise إرجاع waterfall. أخرى Scope،bail،parallel و serial شكل حالة كل يتم ترتيب حذف.

**«أصل مثال» لا في أي أرض جهة إثبات، بينما هو بنية صنع صفة صار قيام**:`$on` listener نوع أخذ ذاتي owner حزمة `./types` داخل ذلك واحد نسخة cordis `Events` إعلان،host تحويل إرسال قراءة هو نفس نسخة، لا وجود يمكن ذاك هذا انحراف مغادرة ثاني نسخة إعلان.

تحميل حمل JSON-safe تسليم إعطاء وقت التشغيل:`api/remotes` Host source في دخول طابور قبل استخدام `dsh-session` `isJsonValue` تدريجي عنصر عنصر تحقق، لا دمج إطار**رمي خطأ fail loud**(هذا هو اسم مفرد إعداد خطأ، لا هو خارجي إدخال).

### خط بروتوكول (API Gateway Remote mux)

```ts ignore-check
ready     { type, clientId }
emit      { type, event, args }
waterfall { type, event, eventId, agentId, request }
cancel    { type, eventId }
```

Client بـ endpoint `$events` و payload `{ args: {} }` فتح internal logical stream.Gateway رفض مقدار خارج معامل، ناقص Host source و تكرار source تسجيل؛source يتم سحب عودة وقت سوف في توقف كل من هذا تسجيل فتح stream. كل Client stream في `api/remotes` في يملك مستقل طابور صف و واحد مجموعة allowlist listener، لذلك واحد Client قطع فتح لن إزالة استهلاك أو سحب إلغاء آخر عدد Client حدث.

Client اشتراط أول بند هو حمل غير فارغ `clientId` و `host.home` `ready`؛ لاحق item حسب discriminant دقيق تحقق حقل.ready بند بناء قيام Connection generation، و توفير مستقر Host مسار عرض معلومة. عادي `emit` لم معرفة لكن بنية دمج قاعدة حدث اسم في لا يوجد حجز قراءة من وقت ساكن صامت إسقاط.waterfall عبر `eventId` صلة ربط `$events/result`، و من `agentId` اختيار Client Agent Context؛Client فقط عودة نقل يمكن بلا ضرر يمثل لـ JSON نتيجة، لا في transport طبقة تكرار حل تفسير عمل خدمة حقل.

`$events` هو Gateway داخلي endpoint، لا دخول توليد Typert Remote descriptor، أيضا لا يصبح `ctx.remote.<namespace>`. تطبيق اختيار ما زال فقط وجود في `api/remotes` allowlist و Host source؛Gateway فقط يملك تسجيل،payload تحقق و شيء إدارة نقل.

### apps/web browser e2e يخص Host وجه

`apps/web/tests/**` ذلك دفعة e2e في**أصل `tsconfig.host.json`** فعل نوع فحص: هو جمع في عملية داخل بدء حق harness، مباشر وصول `ctx.connection`،Host `SessionStore.get/create/flush` و `ctx.sessionProjectionCache`.**وقت التشغيل استخدام متصفح ≠ نوع فوق يخص Client برنامج**——يأخذ هو جمع نقل دخول Client تجمع دمج سوف تقرير خطأ، لأن واحد program تركيب لا تحت اثنان عدد face مقابل نفس عدد Context key دمج.

من هذا نيل إلى واحد بند مقابل هذا تصميم يلزم ضيق وصل حمل سجل قاعدة:**هذه اختبار من عميل حزمة import قيمة أو نوع، سوف يأخذ هذا حزمة كامل project——و هو مرجع كل project——سحب دخول Host بناء رسم**.`ui-settings-general`/`ui-settings-models`/`ui-permission`/`ui-commands` أربعة عدد إزالة استهلاك من references `api/remotes` client face، بينما هذا face يجب انتظار host tsdown توليد `@deepseek-ai/dsh-goal/remote` عندئذ قدرة تحرير ترجمة، في هو شكل صار بناء مدة ميت قفل:host tsc → api/remotes client face → `goal/remote` → host tsdown → ترتيب في host tsc بعد.

الذي يحتاج عميل رمز رقم في اختبار جانب**مرآة مثل**واحد نسخة (`scaffold.ts` توجيه خروج مرآة مثل بعد welcome-notice معتاد كمية، اثنان عدد chat e2e مباشر جذب `dsh-client-runtime/client` لأن `runtime` عمل مسار هذا قدوم حينئذ في host رسم داخل) ، من بينما يجعل ذلك 4 عدد إزالة استهلاك من مغادرة فتح host رسم؛`apps/cli/tsconfig.json` داخل 15 بند client عمل مسار مرجع مع لـ فقد ذهاب owner-map مسؤولية، قد واحد و حذف. مرآة مثل قيمة و مصدر تدريجي حرف متسق، عائم نقل جدول الآن هو اختيار جهاز فقد إعداد أو إشعار لم يتم كبح صنع، كل هو صدى مضيء فشل.

### تعديل بيان

| موضع | تعديل |
|---|---|
| `dsh-typert-protocol` | `src/types.ts` توفير forwardable mode دفع توجيه،selection و Client listener إسقاط؛`TypertClientRemote` فقط عام `$on`. صاف نوع، صفر وقت التشغيل |
| `api/gateway` | Host نصف توفير وحيد Remote event source،`$events` stream،pending waterfall تنسيق ضبط و `$events/result`؛Client نصف يأخذ خاص pump تسجيل لـ Connection generation source، مسؤول frame تحقق و Cordis توزيع |
| `api/remotes` | `src/remote-events.ts`(حمل mode اسم مفرد قيمة) و `src/types.ts`(مفتاح إسقاط + selection) مزدوج صف دخول اثنان عدد face؛Host نصف تسجيل كل Client source، و في دخول طابور قبل تحقق JSON؛Client نصف متابعة تركيب توليد Remote contribution |
| أصل `tsconfig.base.json` | إضافة `dsh-settings/types`،`dsh-credentials/types`،`dsh-api-remotes/types` ثلاثة بند `paths`، الكل إشارة نحو**مصدر**مستو وجه |
| `dsh-commands` / `dsh-settings` / `dsh-credentials` | `interface Events` فرعي كتلة نقل دخول كل منها client-safe `./types`(settings/credentials جديد بناء هذا خروج فتحة،brand و صاف نوع واحد و نقل دخول،index متابعة re-export و إبقاء إقامة منشئ؛`files` تكملة `lib/types/**/*.js`) |
| `dsh-session` | `isJsonValue` توفير `api/remotes` Host source تحقق كل حدث معامل |
| `client/runtime` | حذف Host frame إلى Remote subscription table جسر؛ فقط متابعة في Connection generation بناء قيام بعد إصدار `connection/reset` |
| مستهلك | Client إضافة مباشر حجز قراءة `ctx.remote.$on(...)`،type-only جذب دخول owner حدث إعلان و يأخذ `'remote'` إضافة دخول `inject` |
| `client/connection` | توفير وحيد generation source تسجيل موضع؛`ConnectionController` إصدار `$events` ready يحمل Host معلومة،fixture أيضا من نفس source إنتاج حدث |
| `apps/web/tests` + `apps/cli` | عميل رمز رقم مرآة مثل (رؤية فوق عقدة) ؛`apps/cli/tsconfig.json` حذف 15 بند client عمل مسار مرجع |

## تجهيز اختيار خطة

**متابعة إرسال توليد API Proxy Host downlink.**هذا مثال يمكن إعادة استخدام Connection generation و `connection/reset`، لكن سوف يجعل API Proxy إبقاء Remote حدث allowlist، طابور صف،schema و Client Runtime bridge، مجال نقل أيضا لا يمكن مع أخرى Remote stream مشترك استخدام دورة الحياة.API Gateway قد لديه معتاد إقامة `/api/remote.mux` بعد،`$events` فقط زيادة واحد internal logical stream، لا حاجة رقم ثلاثة بند WebSocket، لذلك تحويل نقل إلى Gateway صار هذا و كل حق كل أكثر دمج إدارة.

**إعطاء Remote حدث آخر فتح رقم ثلاثة بند شيء إدارة WebSocket أو duplex stream.**مستقل عبر طريق قدرة يملك ذاتي ذات اتصال حالة، لكن سوف تكرار Gateway mux قد توفير إقرار إثبات ترقية، إعادة استخدام، إلغاء، خطأ خريطة و تراجع تجنب إعادة وصل. داخلي `$events` endpoint إبقاء مستقل logical stream،waterfall نتيجة إعادة استخدام HTTP واحد عنصر استدعاء.

**في type-meta قيام واحد ورقة مستقل `TypertRemoteEventMap`، يجعل owner حزمة declare-merge دخول ذهاب**. إزالة استهلاك طرف مفتاح تجميع سوف دقيق انتظار في «يتم إعلان لـ يمكن بعيد مسار إلقاء تمرير حدث» ؛ بديل قيمة هو كل بند حدث توقيع يلزم في cordis `Events` خارج**مجددا كتابة واحد مرة**، في هو حاجة واحد بند مزدوج نحو `extends` انتظار قيمة صفة إثبات قدوم منع عائم نقل، أيضا يلزم إعطاء ثلاثة عدد owner حزمة إضافة جديدة type-meta اعتماد. مشترك استخدام نفس نسخة `Events` إعلان يجعل انتظار قيمة صفة تغيير صار بنية صنع صفة صار قيام، هذا ورقة جدول لذلك لا قيام.

**يجعل typert generator من host `Events` إعلان توليد حدث إسقاط**(codec + `.d.ts` + إعلان خريطة، و `/remote` نفس عائلة).generator قد في قسم تحليل host حدث؛ لكن هو أخذ لا إلى إسقاط و انفصال حساس دلالة، كما يلزم حركة توليد جهاز و بناء وجه. أصل مثال تحويل إرسال هذا بند مسار هذا حينئذ لا حاجة إسقاط.

**إعطاء يمكن تحويل إرسال حدث تحميل حمل إسقاط دالة**(`{ حدث اسم, إسقاط, zod }` تحويل إرسال جدول). قدرة واحد رفع تغطية `models-changed` fan-in و workspace view إرسال توليد؛ بديل قيمة هو إسقاط منطق و تحميل حمل نوع يد عمل مقابل متساو، عودة إلى طريقة جانب للتو للتو إزالة إطفاء في قلب جدول شكل.

**يأخذ apps/web browser e2e نقل دخول client تجمع دمج**. نظر يشبه «عميل اختبار عودة عميل وجه» ، فعلي قياس قيام لحظة 21 بند خطأ: هو جمع استخدام host خدمة، بينما client برنامج داخل `ctx.sessions` هو `ISessions`. قد لا.

**إعطاء `directory-picker-browse`/`-native` فعل host/client مزدوج face قطع قسم**، من أصل فوق يجعل عميل حزمة لا دخول host رسم. جهة نحو صحيح تأكيد (هو جمع تأكيد فعلي هو لم قطع قسم مزدوج نصف حزمة) ، لكن تعديل سقوط في آخر شخص تابع أرض، بينما استلام فائدة فقط هو «بناء رسم أكثر جاف صاف»——هذا تصميم في اختبار جانب مرآة مثل عميل رمز رقم بعد قد لا حاجة هو.**قد تقييم تقدير لا فعل**.

## تحقق

تثبيت إقامة هذا سلوك شرق غرب:

- Host source حق تركيب اختبار: اثنان عدد Client stream كل منها استلام إلى host emit `{ event, args }`، منها واحد قطع فتح لن أثر آخر عدد؛ غير JSON فعلي مشاركة سوف صدى مضيء رفض كما لن سم تحويل لاحق دمج قاعدة حدث.
- نوع طبقة سالب مثال رفض لم اختيار حدث، غير `void` بلا scope حدث، غير Agent-scoped waterfall، و إعلان mode و توقيع لا رمز بند.`$on('slots/changed', …)`(Client محلي حدث) و `$on('skills/change', …)`(قد إعلان لكن لم اختيار في) كل تحرير ترجمة فشل——لذلك `$on` مفتاح وجه تماما جيد انتظار في اسم مفرد.
- إزالة استهلاك طرف `$on('settings/document-updated', …)` يأخذ `ns` تحليل لـ `SettingsNamespace`:brand اختراق مرور wire تخزين نشط.
- `$on` disposer ملكية استدعاء جهة fiber؛ نفس عدد دالة كائن حجز قراءة اثنان مرة وقت اثنان بند تسجيل كل منها مستقل تراجع حجز——حسب listener هوية فعل مفتاح جدول سوف يأخذ هو جمع دمج، الذي بـ حجز قراءة حسب تسجيل بند بحث عنوان.
- عادي إشعار معا استلام سعة رمي خروج listener و رفض الذي إرجاع Promise listener؛waterfall اختبار ثابت Client result،`next()`، رفض، إلغاء، كثير Client أول عدد claim و إعادة وصل إعادة وضع pending request.
- Gateway اختبار تغطية source ناقص، تكرار تسجيل، سحب إلغاء في توقف،payload رفض،ready أولا في حدث، و متصفح و عملية داخل اثنان نوع carrier؛Client اختبار تغطية generation source تسجيل حد، وصف و زيادة كمية حينئذ خيط ترتيب، شيء إدارة فشل بعد إعادة فتح،Host خطأ و معنى خارج انتهاء، غير ready أول بند، شاذ شكل حدث بند،`$events/result` فشل و dispose quiescence.
- `host/remote-event`، عام `$dispatch`،Client Runtime bridge و API Proxy allowlist اعتماد كل لا وجود؛ كل مستهلك مباشر مراقبة owner حدث.

## عاقبة

- **Gateway لديه واحد غير توليد endpoint**:`$events` لا مقابل عمل خدمة namespace، أيضا لا دخول Typert descriptor؛ هو هو Gateway و `api/remotes` بين داخلي اتصال نقطة، معا تعريف Client Connection generation تخزين نشط مدة. صارم إطار فارغ payload تحقق،opening ready تحقق و مفرد source تسجيل حد هو لن عرض تحويل صار ثاني عدد يد كتابة عمل خدمة API.
- **اثنان عدد ملف ضرب كسر api/remotes face متبادل رفض اتفاق**:`src/remote-events.ts` و `src/types.ts` نفس تابع اثنان عدد عمل مسار، كل منها نحو مشترك `lib/types` إرسال إطلاق واحد نسخة نفسه إعلان. محتوى تدريجي بايت نفسه،`.tsbuildinfo` كل منها مستقل، فعلي ممارسة فوق بلا ضرر؛README بناء حد عقدة قديم وصف هذا عدد مثال خارج و ذلك صار بسبب (`paths` إشارة نحو شفرة المصدر وجه).
- **إنتاج جهة إبقاء خاص**: عمل خدمة إضافة فقط قدرة استدعاء `$on`؛Host source تسجيل و Client إرسال إرسال كل لا في `TypertClientRemote` فوق كشف، اختبار double بـ ذاتي ذات `emit` طريقة قيادة حجز قراءة، لا زائف تركيب صار إنتاج واجهة.
- **شاذ شكل فعلي مشاركة في emit نقطة فشل**:`api/remotes` listener في دخول طابور قبل رمي خروج، لذلك استدعاء Host `ctx.emit` عملية قيام أي يرى اسم مفرد إعداد خطأ؛ طابور صف ما زال يمكن متابعة إلقاء تمرير لاحق دمج قاعدة حدث.
- **اختبار جانب مرآة مثل قيمة ممكن عائم نقل**: لا يوجد أي آلية نواة مقابل `apps/web/tests` في مرآة مثل client معتاد كمية و ذلك مصدر؛ أمان شبكة فقط هو عائم نقل سوف يجعل اختيار جهاز فقد إعداد. قاعدة كتابة في `apps/web/tests/README.md`، من review حراسة؛grep درجة بوابة مرور تقييم تقدير بعد لحظة معنى لا فعل.
- **وضع ترك قدرة**: لا دعم حمل إسقاط أو انفصال حساس تحميل حمل، لا دعم حمل Agent بـ خارج Scope، أيضا لا لـ عادي إشعار توفير إعادة وضع. حاجة يمكن اعتماد استعادة حالة يجب يملك استعلام،cursor أو opening baseline؛waterfall فقط إعادة وضع ما زال موضع في نفس مرة Host استدعاء دورة الحياة داخل pending request.
- **ما زال لديه client حزمة إبقاء في host رسم داخل**:12 عدد عمل مسار (`connection`،`runtime`،`ui-slots` انتظار) مرور لم تفكيك قسم `directory-picker-browse`/`-native` و `api/gateway → client/connection` ما زال يمكن بلوغ host رسم. هو جمع كل قدرة تحرير ترجمة كما لم يعد جر وصل api/remotes client face، لذلك لا يوجد منع سد هذا مرة تعديل؛ تفكيك قسم ذلك بعض حزمة قدرة نقص قليل بضعة عدد، لكن مرور تقييم تقدير بعد لا فعل. اثنان عدد chat e2e مباشر جذب `dsh-client-runtime/client` اعتماد `runtime` هذا قدوم حينئذ في رسم داخل——تابع أحيانا لكن بينما غير حفظ إثبات.
- **هذه الحزمة لا إصدار invariant companion**: مبكر أولا إصلاح حجز سبق في نشط حدث مجموع خط فوق تأكيد إلقاء تمرير شكل حالة (`thisArg === null`،`mode === 'emit'`) ، هذا يجعل تشخيص منطق و اسم مفرد قيمة اقتران دمج، و جعل rolldown يأخذ هو رفع صار رقم ثلاثة عدد bundle chunk——بينما آلة آلة دفع توجيه إصدار ملف بيان و لا يحمل هو.Host وجه `TypertForwardableEventEntry` تأكيد قد في تحرير ترجمة مدة رفض هذه انحراف مغادرة، حزمة README أيضا سجل لم يعد وجود مستقل وقت التشغيل علاقة سبب.

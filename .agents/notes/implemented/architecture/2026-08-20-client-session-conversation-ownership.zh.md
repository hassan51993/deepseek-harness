# Agent Note: Client Session،Conversation و UI كل حق قسم طبقة

Status: implemented

[English](2026-08-20-client-session-conversation-ownership.md) | العربية

## مشكلة

Web Client سبق من واحد عام Runtime معا تحمل تحميل Session و Workspace كائن، حدث نافذة،Conversation تجميع،React hooks،Slot سجل التسجيل و Store جذب محرك. بروتوكول حالة، عمل خدمة إسقاط،React ربط و صفحة عرض مشترك نفس عدد اعتماد تجميع نقطة، أي واحد طبقة تغير كل ممكن توسيع كبير إلى كامل قبل طرف.

Session لقطة أيضا سعة سهل خلط دخول حدث عدد مجموعة،Conversation View،Chat Node و انتظار معالجة تفاعل انتظار و غير Session ذاته يملك بيانات. عادي إزالة استهلاك من من هذا حاجة إدارة حل حدث إعادة وضع و أداة جسم عرض، إضافة جديدة واحد Conversation target أيضا ممكن اشتراط تعديل Session،Runtime و renderer.

React دورة الحياة و Session دورة الحياة بين نقص قليل واضح واجهة وقت،binding تحرير،Hook source استبدال و Slot store تنظيف سوف عرض تغيير لـ متبادل متبادل عودة ضبط مخصص استخدام بروتوكول.Approval و Question معا أثر جانب حافة شريط حالة و composer takeover؛ إذا اثنان موضع كل منها صيانة حالة، هو جمع أيضا ممكن اختيار مختلف انتظار معالجة طلب.

حاجة يأخذ بيانات owner،React adapter، عام تصيير آلية و أداة جسم عرض تفكيك صار مفرد نحو اعتماد، معا إبقاء قائم تطبيق سلوك.

## قرار

Client اعتماد “Controller و مجال كائن → UI adapter → renderer → Slot component” قسم طبقة.Controller و مجال كائن إصدار لا اعتماد React observable source؛ الذي تابع `ui-*` package إعلان معيار props و تسجيل source؛`ui-renderer` في Slot binding نقطة توليد selector hook؛ مكون فقط من Slot props قراءة بيانات و عملية.

```text
[Remote / Controller / domain object]
                  |
                  | bare observable source
                  v
             [ui-* adapter]
                  |
                  | standard source registration
                  v
              [ui-renderer]
                  |
                  | selector hook binding
                  v
            [Slot component]
```

Session و Workspace Client كائن قسم آخر عودة `api/session-controller/client` و `api/workspace-controller/client`.Conversation target-neutral بيانات بنية و تجميع عودة `client/ui-conversation`،Chat و Trajectory قسم آخر عودة `client/ui-chat` و `client/ui-trajectory`.

Session و Workspace React ملائم إعداد قسم آخر عودة `client/ui-session` و `client/ui-workspace`.Store engine عودة `client/store`،Slot registry،scope materialization و observable-to-hook ربط عودة `client/ui-renderer`.

نظام لا يوجد تجمع دمج صيغة `client/runtime` حزمة، أيضا لا يوجد بديل في وسط facade.[Session تاريخ و حدث نقل](2026-08-18-session-history-and-event-transport.zh.md) تعريف تاريخ وصل متابعة صفة.[Client جلسة مرجع](2026-09-15-client-session-references.zh.md) يملك مرجع نيل أخذ، دقيق بديل حد دورة الحياة، رئيسي منطقة مجال كل حق و موحد واحد UI حالة؛ هذا مقالة يملك قسم طبقة و بيانات مصدر تسجيل قاعدة.

## قسم طبقة أصل فإن

### Controller هو بلا React منطق owner

Controller يمكن بصفة Cordis service تثبيت، لكن لا يملك React Context،React hook،Slot props أو مكون.Controller snapshot فقط يتضمن ذاته يملك واقع، أمر فقط تغيير Host أو مجال كائن حالة.

UI طبقة يمكن معا قراءة كثير عدد Controller فعل مرة تنقل قرار، لكن لا نيل يأخذ تركيب نتيجة كتابة عودة مهمة واحد Controller snapshot.UI adapter أيضا لا نسخ Controller أمر عمل خدمة تنفيذ.

### UI adapter يملك React وصل دخول

كل معيار hook عودة الأكثر وصل قريب ذلك بيانات دلالة `ui-*` package.

| Hook | Owner | Source |
| --- | --- | --- |
| `useSessions` | `client/ui-session` | Session Controller عام قائمة |
| `useSession` | `client/ui-session` | قد ربط جلسة لقطة |
| `useProjection` | `client/ui-session` | قد ربط جلسة مفتاح تحكم إسقاط |
| `useSessionStatus` | `client/ui-session` | تشغيل حالة، صالح انتظار معالجة طلب و لم قراءة إتمام رفع تنبيه |
| `useSessionRetainInfo` | `client/ui-session` | تحكم جهاز فقط قراءة مرجع مصدر حساب عدد |
| `useWorkspaces` | `client/ui-workspace` | Workspace Controller قائمة |
| `useConversation` | `client/ui-conversation` | Conversation binding snapshot |
| `useChat` | `client/ui-chat` | `chat` target source |
| `useTrajectory` | `client/ui-trajectory` | `trajectory` target source |

`ui-renderer` فقط تنفيذ عام ربط، لا import Session،Workspace،Conversation،Chat أو Trajectory عمل خدمة نوع و قيمة.

### Slot scope و معيار props قسم مغادرة

`ui-slots` إعلان root،session و session-maybe scope، و يمكن عبر declaration merge توسيع معيار props نوع؛ هو لا قرار كل scope تثبيت أي بعض hook.

`ui-renderer` تنفيذ عام scope adapter و source materialization.`ui-session` تثبيت Session scope و توفير داخل بناء source، أخرى مجال package فقط تسجيل ذاتي ذات source و إزالة استهلاك هو Slot entry.

إضافة جديدة target لا اشتراط renderer أو Session Controller زيادة فرع. بيانات owner مسؤول حالة هوية، تحديث، خطأ و تحرير؛UI adapter مسؤول hook؛ عرض owner مسؤول target-specific projection و تفاعل حالة.

## Package كل حق

| Package | يملك محتوى | واضح لا يملك |
| --- | --- | --- |
| `api/session-controller/client` | جلسة كائن، دليل، مرجع، مصدر حساب عدد، أمر، إسقاط، حدث نافذة و Agent Context | تنقل، إتمام رفع تنبيه،Conversation target،React،Slot،Workspace |
| `api/workspace-controller/client` | Workspace كائن، ترتيب، عودة ملف، أمر و snapshot | React،Session تنقل سياسة، دليل UI |
| `client/ui-session` | صريح جلسة أثر مجال، معيار بيانات مصدر،`SessionProvider` و موحد واحد UI حالة | جلسة نقل، مرجع كل حق،Conversation تجميع،Approval/Question نتيجة |
| `client/ui-workspace` | Workspace خطاف، متصفح UI، رئيسي منطقة مجال مرجع و عبر تحكم جهاز تنقل سياسة | Workspace نقل، جلسة بيانات فرعي هذا |
| `client/ui-conversation` | Conversation core،registry،binding،shell،input،composer،queue و View تنقل | Session transport،Chat/Trajectory snapshot |
| `client/ui-chat` | Chat target،Node definitions،renderer،selection،details و locale | Session دورة الحياة، عام View تنقل،Trajectory، تاريخ صورة cache |
| `client/ui-trajectory` | Trajectory target، حدث سجل إسقاط و فحص عرض | Session snapshot،Chat snapshot |
| `client/ui-approval` | Pending Approval،Remote listener،composer و مراجعة دفعة UI | Session control، عام composer election |
| `client/ui-user-questions` | Pending Question،Remote listener،composer و مشكلة UI | Session control، عام composer election |
| `client/store` | React-free store contract و تنفيذ | مجال كائن،React hook،Slot دورة الحياة |
| `client/ui-renderer` | SlotRegistry،scope binding،selector hook،outlet و React root | Session،Workspace و Conversation عمل خدمة منطق |

## مجموع جسم بيانات تدفق

Session بيانات حسب التالي مسار دخول UI:

```text
[ctx.remote.session]
          |
          v
[api/session-controller/client]
  |-- SessionListState --------------------------> [ui-session] -> useSessions
  |-- SessionSnapshot ----------------------------> [ui-session] -> useSession
  |-- ProjectionValueSource ----------------------> [ui-session] -> useProjection
  `-- per-Session SessionEventSource
                    |
                    v
             [client/ui-conversation]
                    |
                    | assemble
                    v
             ConversationSnapshot ----------------> useConversation
                    |
          |---------+----------|
          v                    v
      [ui-chat]           [ui-trajectory]
          |                    |
       useChat            useTrajectory
```

Workspace بيانات من `ctx.remote.workspace` دخول Workspace تحكم جهاز، مجددا من `ui-workspace` عبر `useWorkspaces` توفير.`ui-workspace` لـ عبر مجال تنقل قراءة صريح هدف و يحتفظ رئيسي منطقة مجال مرجع، لا يأخذ هو تغيير لـ افتراضي عمل خدمة Context.

Approval و Question عبر `ctx.remote.$on` من Host waterfall وصول كل منها UI owner. كل owner إصدار Pending كائن؛`ui-session.sessionStatus` نحو Workspace معرف و Conversation composer اختيار توفير نفس عدد صالح كائن.

## Session Controller Client

### SessionSnapshot نطاق

`SessionSnapshot` يمثل Session ذاته تحكم و دورة الحياة واقع. هو يمكن يتضمن identity،running،removed،blank،subagent address،open phase،history phase،prompt error،agent error و queue حالة.

هو لا يتضمن التالي بيانات:

- raw event array؛
- Conversation View؛
- Chat Node؛
- Trajectory row؛
- Approval أو Question انتظار معالجة كائن؛
- اشتراط استدعاء من مرة تاريخ event عندئذ قدرة حل تفسير عرض حالة.

حقل من event،control frame أو محلي أمر دفع توجيه، و لا تلقائي قرار ذلك owner؛ إزالة استهلاك دلالة قرار owner.`composerPhase` معا اعتماد Session lifecycle و Conversation target activity، لذلك من `ui-conversation` دمج صار، لا دخول `SessionSnapshot`.

### ثلاثة عدد قراءة وجه

Session Controller مقابل خارج توفير ثلاثة عدد متبادل لا بديل قراءة وجه:

1. جلسة دليل و محلي كل حق بيانات مصدر، من `useSessions` و فقط قراءة مرجع بيانات وصفية مستهلك استخدام.
2. كل Session منطق binding، يتضمن `sessionId`،`SessionSnapshot` source،commands و projection sources.
3. Conversation-facing `SessionEventSource`، فقط توفير Conversation assemble core استخدام.

عادي UI component لا مباشر قراءة `SessionEventSource`.`ui-session` لا قراءة خاص event window،`ui-conversation` core أيضا لا استقبال React binding أو Slot API.

### SessionEventSource

`SessionEventSource` كشف قد شيء تحويل حدث نافذة، بينما لا هو transport.

نافذة يحمل لديه ترتيب `entries`،`hasMore`، مفرد ضبط `revision`، و `replace | prepend | append` تغيير وصف.Append بـ معتاد عدد وقت اتصال غير ممكن تغيير قطعة مقطع؛ حاجة كامل `entries` عدد مجموعة إزالة استهلاك من عندئذ لـ هذا snapshot شيء تحويل و ذاكرة مؤقتة عدد مجموعة.

أول مرة فتح، إعادة وصل،gap repair و لا يمكن إثبات وصل متابعة صفة تحديث إصدار `replace`؛ تاريخ قسم صفحة إصدار `prepend`؛ وصل متابعة live event إصدار `append`.Conversation core اعتماد حسب revision و change اختيار زيادة كمية تحديث أو كامل rebuild.

`MutableSessionEventSource` هو Session Controller داخلي كتابة طرف، إزالة استهلاك من فقط اعتماد فقط قراءة `SessionEventSource`.

### Session binding دورة الحياة

كل نشط وثب جلسة generation يحتفظ Cordis Context و Fiber. تحكم جهاز في نيل أخذ مرجع وقت إنشاء ربط، و في الأكثر بعد واحد نسخة مرجع تحرير أو أصل إلغاء تدمير وقت انتهاء هذا ربط.

اعتماد جلسة كائن عبر `binding.ctx.effect()` تسجيل تنظيف.generation انتهاء سوف تنظيف Conversation ربط،UI شيء تحويل نتيجة و أثر مجال Slot تخزين، بلا حاجة مفرد وحيد `onBindingRelease` أو `onRelease` عودة ضبط بروتوكول.

هذا نوع تنظيف طريقة لا اشتراط Session Controller حل فوق طبقة إزالة استهلاك من اسم سجل.

## UI Session

### خدمة مسؤولية

`client/ui-session` هو Session Controller و React/Slot نظام بين وحيد Session adapter. هو توفير `ctx.uiSession`، و مسؤول:

- مراقبة جلسة دليل، محلي مرجع بيانات وصفية و صريح توفير ربط؛
- تثبيت session و session-maybe scope adapter؛
- توفير `SessionProvider` عرض دلالة؛
- داخل بناء session snapshot،projection و sessionId source؛
- استقبال أخرى مجال package Session-scoped source contribution؛
- في `sessionStatus` في تركيب مجال يحتفظ انتظار معالجة تفاعل، تشغيل واقع و إتمام رفع تنبيه.

هو لا يملك Session transport،event folding،Conversation target أو أداة جسم عمل خدمة نتيجة.

### معيار source تسجيل

مجال package استدعاء `ctx.uiSession.provide()` تسجيل bare source.Descriptor ساكن حالة إعلان hooks،keyedHooks و props اسم سجل،`resolve(binding)` لـ واحد Session binding إرجاع تماما مقابل قيمة؛ مثال مثل `ui-conversation` يأخذ كل binding snapshot تسجيل لـ `conversation` hook source.

عادي source يتم renderer تحويل صار `use<Name>`،Projection انتظار فتح وضع key فضاء عبر keyed hook resolver كشف، مستقر قيمة عبر props كشف.

وقت التشغيل رفض لم إعلان، ناقص أو تكرار معيار prop.`ui-session` ذاته أيضا مشي نفسه materialization،renderer لا لـ Session اسم حرف كتابة خاص خاص فرع.

### Scope binding

session و session-maybe استخدام نفس عدد adapter، لكن ربط دلالة مختلف:

- صارم إطار جلسة أثر مجال في لا يوجد صريح توفير ربط وقت رفض تصيير؛
- session-maybe استخدام مستقر absent binding، إبقاء hook استدعاء ترتيب؛
- دقيق Context generation تغيير وقت إعادة تركيب قد ربط فرعي شجرة، نفس id بديل generation أيضا مثل هذا؛
- لم ربط session-maybe بند بلا حاجة إعادة تركيب يكفي وصل قبول أول عدد ربط؛root بند لا يوجد جلسة ربط.

كل UI شيء تحويل نتيجة استعارة استخدام تحكم جهاز ربط Context.`ui-session` عبر `binding.ctx.effect()` إزالة هذا generation ذاكرة مؤقتة بند تزامن نشر فارغ قيمة، لن retain جلسة.

Contribution roster تغير سوف إعادة بناء قد materialize binding تزامن نشر جديد source تجميع دمج. نفس binding دورة الحياة داخل،source identity إبقاء مستقر، بـ ممتلئ كاف `useSyncExternalStore` ذاكرة مؤقتة اشتراط.

### SessionProvider

`SessionProvider` هو `PropsRenderSlots` أصل حسب session-scoped child إعلان إرسال توليد معيار مقعد، لا هو عمل خدمة component مباشر import React Context.

هو استقبال عادي `ReactNode` children و لا بد ملء `session={reference | undefined}`.Provider استعارة استخدام استدعاء جهة يحتفظ مرجع، لا نيل أخذ أو تحرير هو؛ استدعاء جهة مباشر حزمة إقامة `renderSlot('details', {})`.

جلسة هوية عبر صريح أثر مجال ربط و معيار `sessionId` prop وصول مكون. فارغ Provider إبقاء لم ربط، تضمين طقم Provider و root بند كل لن رجوع إلى رئيسي منطقة مجال جلسة.

### Pending interaction

`SessionPendingInteractionMap` من عمل خدمة package declaration merge توسيع. كل pending object حتى قليل يحمل مستقر `key`، مجال `kind` و `sessionId`؛`ui-session` لا import Approval أو Question أداة جسم نوع.

عمل خدمة plugin في `apply()` في استدعاء `registerPendingInteraction(precedence)`، لـ ذاتي ذات pending domain بناء قيام مستقر تسجيل. هذا استدعاء إرجاع تدريجي طلب publication function؛publication function معا إصدار دقيق كائن و ذلك waterfall تفويض حمل عودة ضبط، و إرجاع إزالة هذا كائن قوة انتظار disposer.Plugin teardown سوف أولا إزالة كل قد إصدار كائن، مجددا استدعاء و انتظار ذلك تفويض حمل عودة ضبط، تجنب تجنب Client عودة جواب من إزالة بعد Host طلب متابعة معلق تعليق.

نفسه key تزامن كائن يتم رفض، استبدال طلب يجب استخدام جديد key. نفس Session يمكن معا وجود كثير عدد مجال أو كثير عدد طلب.

`ui-session` استخدام كل domain precedence اختيار خروج كل Session حالي توليد فاعلية كائن. مقارنة عال precedence فوز خروج، نفسه precedence تحت بعد مرة تاريخ إلى صالح كائن فوز خروج.

انتظار معالجة تجمع دمج هو `ui-session` خاص تنفيذ؛ ذلك صالح طلب أصل مثال ظهور في `sessionStatus.getSnapshot().get(id)?.pendingInteraction` في.`useSessionStatus` هو عام UI قراءة واجهة.

Session تنقل حالة و composer takeover يجب قراءة نفس عدد effective object، لا نيل قسم آخر صيانة status map أو takeover roster.

## Workspace Controller و UI Workspace

### WorkspaceSnapshot نطاق

`WorkspaceSnapshot` فقط يتضمن Workspace Controller يملك Host-authoritative بيانات، يشمل Workspace rows، ترتيب،archive set،follow phase و خطأ.Workspace row `sessionIds` هو صلة ربط حقل، لا انتظار في يأخذ Session كائن نسخ دخول Workspace snapshot.

التالي تركيب واقع لا دخول `WorkspaceSnapshot`:

- Workspace و Session اثنان بند baseline هل معا ready؛
- أصل حسب Session تحديث وقت دفع توجيه الأكثر قريب Workspace؛
- حالي Session هل بسبب عودة ملف بينما صاف حذف؛
- New Session ينبغي إعادة استخدام أي عدد blank Session؛
- أول مرة بدء ينبغي اختيار أي عدد Session.

### UI Workspace تركيب مسؤولية

`client/ui-workspace` يأخذ Workspace list source تسجيل لـ root معيار source `workspaces`،renderer من هذا توفير `useWorkspaces`.

بدء استعادة، فارغ أبيض جلسة إعادة استخدام، جديد جلسة تنقل، تزامن إنشاء دمج و عودة ملف بعد تنقل يخص UI سياسة.`ui-workspace` يمكن قراءة اثنان عدد تحكم جهاز، لكن يأخذ رئيسي هدف و مرجع حفظ في ذاتي ذات تنقل owner في، لا نحو تحكم جهاز لقطة كتابة UI اختيار.

دليل picker، دليل تصفح تصفح و `openPath` يخص مستقل دليل قدرة، لا دخول Workspace Controller.

## UI Conversation

### Assemble core

`client/ui-conversation` معا يتضمن لا اعتماد React Conversation assemble core و نفس مجال React adapter.

Core يملك `ConversationSnapshot`،Definition registry،View registry،event assembler،location index، كل Session binding،target source و target activity.

Core من Session binding أخذ نيل `SessionEventSource`. وصل متابعة revision append و prepend استخدام زيادة كمية تجميع؛replace أو revision قطع ملف من كامل نافذة rebuild.

Definition أو View roster تغير فقط إعادة بناء Conversation binding، لا إعادة بناء Session أو إعادة فتح Remote stream.Core لا import React، يمكن مستقل اختبار حدث طي، زيادة كمية تحديث و registry lifecycle.

`ConversationSnapshot` لا نسخ `SessionSnapshot`، أيضا لا كشف raw events؛ هو فقط إصدار target-neutral View اسم سجل،target activity و target source lookup.

`useSession` و `useConversation` قدوم ذاتي اثنان عدد source، لا تحمل وعد في نفس عدد React commit أصل فرعي إصدار. معا قراءة اثنان من مكون حسب حالي snapshot صاف حساب حساب، لا يأخذ إشعار ترتيب حل تفسير لـ عمل خدمة بسبب نتيجة.

### Definition و View registry

`UiConversation.events` هو event Definition وحيد registry،`UiConversation.views` هو target snapshot builder وحيد registry.

Registry رفض تكرار key، إبقاء تسجيل ترتيب و إرجاع قوة انتظار disposer.Roster تغير وقت، قائم Conversation binding استخدام حالي event window إعادة بناء؛ نفس تزامن تسجيل جولة في تغير سوف دمج لـ مرة microtask إعادة بناء.

Target package عبر declaration merge توسيع snapshot و location data map، مجددا نحو registry تسجيل ذاتي ذات Definition،builder و View. تسجيل مع Cordis effect تحرير.

`ui-conversation` لا import أداة جسم target package.

### Conversation React adapter

React adapter يأخذ كل Conversation binding snapshot تسجيل لـ Session معيار source `conversation`،renderer من هذا توفير `useConversation`.

نفس حزمة أيضا يملك shell،input،composer chain،queue UI،draft،View navigation و phase دمج صار؛Core لا قراءة React Context،Slot props أو component state.

View اختيار ترتيب ثابت لـ: صالح حفظ دائم selection، قد تسجيل `chat`، بلا View. بلا فاعلية selection لا تغطية حفظ دائم قيمة، نظام لا fallback إلى رقم واحد قد تسجيل View.

لا يوجد `ui-chat` وقت shell ما زال قدرة تنشيط و mount، لكن لن خفي صيغة اختيار Trajectory أو أخرى target.

Shell phase من Session lifecycle و Conversation target activity صاف دمج صار.Session قد active أو مهمة واحد target تقرير إبلاغ مرئي محتوى وقت عرض active؛ أول بند prompt فشل ما زال إبقاء engaging.

### Input و composer

composer chain يخص `ui-conversation`، أداة جسم وصل إدارة يخص عمل خدمة حزمة.`ConversationRoot` عبر `useSessionStatus` قراءة قد ربط جلسة صالح طلب، و بصفة `ComposerChainProps.pendingInteraction` توفير إعطاء chain selector.

Selector هو owner currency صاف دالة، غير null نتيجة بصفة `matched` نقل إعطاء نيل اختيار component.Stable composer entry و افتراضي composer يمكن معا معتاد إقامة،chain فقط اختيار واحد صالح عرض.

Draft و إدخال حالة يخص Conversation UI، لا دخول Session snapshot.Queue command عبر Session-scoped service بحث عنوان، لا يأخذ queue UI كتابة Conversation core.

## Chat و Trajectory target

### Chat owner

`client/ui-chat` تسجيل target id `chat`، و يملك Chat snapshot builder،Conversation Node definitions،keyed node renderers،selection،details،stats،locale و tool inspection تنسيق عمل.

هو عبر `ctx.uiSession.provide()` تسجيل `chat` target source.`ChatView` استخدام `useChat` قراءة تجمع دمج order،navigation و timeline؛ كل `ChatNodeSeat` من هذا snapshot استقبال هوية مستقر Node و Turn-process source، لا حجز قراءة تجمع دمج source.

Chat activity فقط من مرئي كما غير command Chat Node تنشيط. عادي command-only history إبقاء Hero،`/goal` `command-input` Node تنشيط fresh Conversation.

تاريخ صورة cache قد نقل دخول `ui-conversation`(`ctx.uiConversation.imageUrl`) ،Chat و Trajectory مقابل نفس جلسة مرفق عنصر مشترك مرة تخويل قراءة و واحد متصفح URL([Trajectory حفظ دائم صورة مرفق عنصر](../../archived/feature/2026-08-24-trajectory-image-attachments.md)) ؛Draft صورة ما زال يخص Conversation input.

### Trajectory owner

`client/ui-trajectory` عبر نفسه target بروتوكول تسجيل `trajectory`. هو يملك حدث سجل، وقت خط، وهمي محاكاة سطر،selection و inspection view، و عبر معيار source توفير `useTrajectory`.

Session دورة الحياة قراءة `useSession`،Trajectory بيانات قراءة `useTrajectory`.Trajectory لا عبر Session snapshot أو Chat snapshot أخذ نيل ذاتي ذات بيانات.

أخرى target استخدام نفس تسجيل مسار، لا تعديل renderer،Session Controller أو ui-session.

## Approval و Question

### مستقر تسجيل

Approval و Question plugin تثبيت قسم لـ مستقر تسجيل و مفرد مرة طلب معالجة.`apply()` تسجيل locale، استدعاء `registerPendingInteraction()` تسجيل هذا مجال pending domain، و نحو `conversation.composer` تسجيل وحيد مستقر entry.

Approval detail child Slot أيضا من مستقر entry إعلان. تزامن طلب و Session عدد كمية لن زيادة composer entry أو تكرار إعلان Slot، كل تسجيل مع plugin fiber تحرير.

### مفرد مرة waterfall طلب

Remote Event listener من ذاته Agent Context تحليل Session. لا يوجد Session scope وقت استدعاء `next()` متابعة waterfall؛ وجود Session scope وقت إنشاء `PendingApproval` أو `PendingQuestion`.

Listener عبر قد تسجيل domain publication function إصدار كائن، انتظار مستخدم إتمام، إلغاء أو طلب signal في توقف، و في `finally` في دقيق إزالة كائن.

مفرد مرة طلب لا تسجيل Slot، لا إنشاء ثاني طقم lifecycle effect، أيضا لا تعديل Session snapshot.

Approval كشف allow و reject،Question كشف answer و cancel. مستخدم رئيسي حركة إلغاء Question إرجاع `ASK_CANCELLED`؛ انتظار في طلب يتم `AbortSignal` في توقف وقت إرجاع `UserQuestionError(ASK_ABORTED)`، لا تسرب تسرب تحميل جسم `AbortError` أو عادي `Error`.

Gateway فقط اشتراط Remote Event معامل و نتيجة هو دمج قاعدة JSON نقل قيمة، لا نسخ Question خيار مجال تحقق.

### مفرد واحد pending إسقاط

Sidebar و composer إزالة استهلاك `sessionStatus` في نفس عدد صالح انتظار معالجة طلب. تنقل أصل حسب ذلك `kind` عرض مراجعة دفعة، حساب تخطيط مراجعة قراءة أو مشكلة حالة؛ كل composer بند حسب كائن هوية اختيار ذاتي ذات وجه لوح.

نفس طلب identity معا قيادة اثنان موضع UI. جديد طلب استبدال نفس نوع قديم طلب وقت استخدام جديد key، لذلك selector و حجز قراءة من كل مراقبة إلى هوية تغير.

`ui-session` فقط تنفيذ عبر مجال precedence، لا حل تفسير Approval أو Question حقل.

## UI Renderer و Store

### UI Renderer

`client/ui-renderer` يملك `SlotRegistry` service و React renderer. هو مسؤول:

- `ctx.slots.register()`،`inject()`،`renderSlot()` و إعلان دورة الحياة؛
- root،session و session-maybe scope adapter؛
- معيار observable source إلى selector hook ربط؛
- Slot outlet، خطأ عزل،root mount و hydration؛
- حسب scope key إدارة Slot store instance دورة الحياة.

Renderer يمكن إقرار تعرف عام scope اسم و binding بروتوكول، لكن لا قراءة مجال service. تصيير Session scope بينما لا يوجد تثبيت adapter هو تركيب إعداد خطأ، و قيام أي فشل.

### Store

`client/store` هو React-free عادي مكتبة، يملك `ObservableSnapshot`،`SnapshotStore`،`defineStore`،`createSnapshotStore` و `shallowEqual`.

`ui-slots` مرجع store contract،`ui-renderer` إدارة store instance و توفير `useStore`.

Store فقط تحمل تحميل draft،View selection،Chat selection،inspection request و وجه لوح مقياس قياس انتظار مراقبة نظر أو تفاعل حالة.Session،Workspace،Conversation،Remote stream و connection generation لا دخول Store.

### تسجيل و تحرير ترتيب

واحد plugin معا توفير source و Slot entry وقت، أولا تسجيل source، مجددا تسجيل entry.Cordis عكس نحو disposal أولا إزالة entry، مجددا إزالة source، ما زال تركيب entry بسبب بينما لن قصير مؤقت فقد ذهاب مطلوب hook.

الأكثر بعد واحد نسخة جلسة مرجع تحرير بعد، عبر `binding.ctx.effect()` تنظيف UI شيء تحويل نتيجة و أثر مجال تخزين. إضافة fiber تحرير عبر تسجيل disposer تنظيف بيانات مصدر، مستمع و Slot بند.

كل disposer كل يمكن تكرار استدعاء، لا اعتماد Cordis دورة الحياة بـ خارج خفي صيغة عودة ضبط.

## تركيب و اعتماد جهة نحو

تطبيق bundle صريح تثبيت الذي يحتاج Controller،adapter،target و renderer plugin. كل owner `apply()` فقط تثبيت ذاتي ذات service،listener و contribution.

وقت التشغيل مستهلك نحو هو `session-controller → ui-session → ui-conversation → target UI`،`workspace-controller → ui-workspace` و `store → ui-slots → ui-renderer`؛Approval و Question فقط اعتماد `ui-session` توفير pending تسجيل نقطة.

رسم في سهم رأس يمثل وقت التشغيل إزالة استهلاك علاقة، لا تغطية type-only declaration merge حافة.Controller لا عكس نحو اعتماد UI adapter،renderer لا عكس نحو اعتماد مجال package،Conversation core لا اعتماد أداة جسم target.

UI component لا استقبال `ctx`. عبر package تنسيق عمل استخدام Cordis service،standard source أو Slot registration، لا إضافة جديدة تجمع دمج facade.

## تطوير من التزام دوران طريقة

### أولا تحديد بيانات owner

إضافة جديدة حالة قبل أولا حسب إزالة استهلاك دلالة تحديد وحيد owner:Host عبر معلومة، أمر و فعلي جسم دورة الحياة عودة API Controller؛ من Session events شكل صار كما و target غير متصل بيانات عودة Conversation core؛ فقط خدمة واحد نوع View إسقاط عودة مقابل target package؛ مسودة مسودة، اختيار و وجه لوح حالة عودة يملك هذا تفاعل UI package.

نفس عدد واقع لا يستطيع معا حفظ في تحكم جهاز لقطة،Conversation لقطة و تخزين في. عبر مجال تنقل في قرار وقت قراءة بيانات مصدر.UI يحتفظ حالة بيانات مصدر يمكن تركيب مستقل تشغيل، انتظار معالجة طلب و إتمام رفع تنبيه واقع، لكن يجب إبقاء مجال ملكية و كائن هوية، لا يستطيع نسخ هذه مجال حالة.

التالي إشارة يمثل owner اختيار خطأ:Controller بدء import React؛renderer ظهور عمل خدمة نوع فرع؛ مكون مرة تاريخ Session events؛Store حفظ Session أو Workspace فعلي جسم؛ واحد target تغير اشتراط تعديل Session Controller.

### إضافة جديدة Session-scoped بيانات

1. في مجال owner في توفير React-free observable source.
2. في الذي تابع UI adapter في declaration-merge معيار prop نوع.
3. عبر `ctx.uiSession.provide()` إعلان ثابت roster، و من Session binding تحليل source.
4. يجعل Slot component من `PropsRuntime` نيل نيل توليد hook، لا نحو مكون نقل `ctx`.
5. يأخذ كل binding مورد تنظيف تعليق إلى `binding.ctx.effect()`، يأخذ registration تنظيف إبقاء إعطاء plugin fiber.
6. اختبار ناقص قيمة، تكرار اسم حرف،roster استبدال،Session تبديل و binding disposal.

فقط لديه فتح وضع key فضاء استخدام keyed hook؛ لديه حد كما مستقر source استخدام عادي hook؛ لن تغير معرف استخدام prop. لا نيل لـ نقص قليل مرة تسجيل بينما يأخذ عمل خدمة اسم صلب تحرير رمز دخول renderer.

### إضافة جديدة Conversation target

1. في target package في توسيع Conversation snapshot أو location data map.
2. نحو `UiConversation.events` تسجيل الذي يحتاج event Definition.
3. نحو `UiConversation.views` تسجيل snapshot builder،target id،View و activity قاعدة.
4. عبر `ctx.uiSession.provide()` كشف هذا target معيار selector hook.
5. في نفس package في تسجيل renderer،locale و target-specific Slot entry.
6. تحقق target إزالة فقط إعادة بناء Conversation binding، لا تغيير Session، أخرى target أو Remote stream.

Target لا نيل قراءة آخر عدد target snapshot بصفة ذاتي ذات بيانات مصدر. اختياري تنسيق عمل عبر ضيق port أو Slot إتمام؛ ناقص target وقت،shell يجب إبقاء يمكن بدء كما لا نيل تخمين قياس fallback.

### إضافة جديدة pending-interaction عمل خدمة

1. عمل خدمة package تعريف Pending كائن و ذلك إتمام، إلغاء و في توقف دلالة.
2. عبر declaration merge يأخذ كائن إضافة دخول `SessionPendingInteractionMap`.
3. في `apply()` في استدعاء `registerPendingInteraction()` مرة، و تسجيل وحيد مستقر composer entry.
4. Remote waterfall listener من Agent Context تحليل Session؛ لا يمكن معالجة وقت استدعاء `next()`.
5. يمكن معالجة وقت إنشاء Pending كائن، استخدام publication function إصدار، انتظار نتيجة، و في `finally` في إزالة.
6. اختبار تزامن key،precedence، مستخدم إلغاء،transport abort،plugin disposal و بلا Session delegation.

طلب لا تسجيل Slot، لا إعلان فرعي Slot، لا تعديل جلسة لقطة، أيضا لا إنشاء مستقل حالة بحث جذب.Sidebar و composer من `useSessionStatus` قراءة نفس عدد صالح كائن.

### Review فحص نقطة

- كل جديد source،registry contribution،listener و cache كل لديه واضح Cordis fiber أو Session binding owner.
- كل عام مشترك hook قدرة تتبع تتبع إلى وحيد React-free source؛ لا وجود فقط لـ نقل مشاركة بينما طبقة طبقة تحويل إرسال selector.
- كل component بيانات و action كل قدوم ذاتي معيار props أو الذي تابع Slot inject face.
- كل target في نقص مقعد، حركة حالة تسجيل و إزالة وقت كل لديه تعريف واضح نتيجة.
- كل عبر طبقة import كل امتداد Controller،adapter،renderer،component مفرد نحو علاقة قبل دخول.
- كل خطأ من الأكثر مبكر قدرة حل تفسير ذلك دلالة owner عودة صنف؛ تحميل جسم خطأ لا مباشر تسرب تسرب صار عمل خدمة خطأ.

## تحقق

كل owner اختبار قسم آخر ثابت Controller binding و event source،UI scope و pending precedence،Conversation زيادة كمية تجميع و View fallback،target projection،waterfall نتيجة و renderer scope/store دورة الحياة. تطبيق تجميع اختبار معا تغطية كامل roster و نقص قليل أداة جسم target بدء؛ مكون اختبار لا بديل كائن طبقة، إعادة وضع و دورة الحياة اختبار.

## تجهيز اختيار خطة

- **إبقاء Runtime facade.** هو صيانة حمل مفرد واحد مدخل، لكن متابعة شكل صار اعتماد تجميع نقطة و سماح جديد شفرة التفاف مرور مجال owner؛ نظام لذلك لا إبقاء facade أو توافق خروج فتحة.
- **يأخذ كل Client حالة وضع دخول API Controller.** هذا سوف يجعل بروتوكول كائن تحمل تحمل React،View و presentation policy؛Controller بسبب بينما فقط إبقاء بلا React مجال حالة.
- **يجعل Controller مباشر توفير React hooks.** هذا سوف منع توقف غير React إزالة استهلاك من إعادة استخدام نفس كائن، أيضا جعل transport و renderer دورة الحياة متبادل متبادل اعتماد.
- **يأخذ Conversation وضع دخول SessionSnapshot.** هذا سوف توسيع كبير Session API، و إجبار جعل عادي Session إزالة استهلاك من إدارة حل event folding و target roster.
- **يجعل Chat و Trajectory كل منها إعادة وضع Session events.** هذا سوف تكرار صيانة ترتيب،location و registry rebuild؛ مشترك assemble core بسبب بينما إبقاء في `ui-conversation`.
- **يأخذ Conversation core تفكيك صار مقدار خارج غير UI package.** Core و adapter حالي مشترك نفس عرض تحويل كما لا يوجد أخرى غير UI package إزالة استهلاك من؛ نفس حزمة دليل عزل كاف بـ إبقاء React-free core.
- **يأخذ Workspace و Session دمج صار ربط دمج snapshot.** هذا سوف صنع صنع جديد عبر مجال owner؛ عبر مجال منطق إبقاء لـ `ui-workspace` أي وقت قرار.
- **يجعل renderer داخل بناء كل معيار hook.** هذا سوف اشتراط عام أساس أساس ضبط تطبيق إقرار تعرف كل مجال؛standard source registration إبقاء renderer و عمل خدمة نوع حل اقتران.
- **يجعل كل pending طلب حركة حالة تسجيل composer entry.** هذا سوف تكرار إعلان child Slot، و يجعل تزامن طلب تنافس تنازع تسجيل ترتيب؛ مستقر entry و طلب مدة كائن إصدار إبقاء قسم مغادرة.
- **يأخذ pending interaction كتابة عودة Session projection.** انتظار عودة جواب waterfall لا هو قد إيداع حمل دائم Session واقع، تحديث جديد استعادة من Remote Event replay مسؤول، لذلك هو إبقاء في عمل خدمة UI source.
- **لـ binding زيادة مخصص استخدام release callback.** هذا سوف تكرار Cordis دورة الحياة؛`binding.ctx.effect()` قد قدرة يأخذ إزالة استهلاك من تنظيف تعليق إلى نفس owner.
- **يجعل SessionProvider عبر render function نقل Session id.** هذا سوف إنتاج آخر بند بيانات حقن مسار؛ عادي children و معيار `sessionId` prop إبقاء scope بيانات فقط لديه واحد مدخل.
- **يأخذ Store إبقاء في renderer.** Store contract لا اعتماد React، و يتم كائن و اختبار أساس أساس ضبط تطبيق إعادة استخدام؛ مستقل `client/store` إبقاء engine و تصيير دورة الحياة قسم مغادرة.

## عاقبة

Session،Workspace،Conversation و أداة جسم target كل منها يملك واحد نسخة مرجعي حالة، غير React consumer يمكن مباشر إعادة استخدام Controller و assemble core. إضافة جديدة Conversation target فقط يحتاج تسجيل Definition،builder،View، معيار source و Slot entry؛ إضافة جديدة pending-interaction عمل خدمة فقط يحتاج إعلان نوع، تسجيل domain و توفير مستقر composer entry.

Renderer و Session Controller لا بسبب إضافة جديدة عمل خدمة مجال بينما زيادة فرع،Session binding و plugin fiber فإن توفير اثنان بند واضح كما يمكن تركيب تحرير مسار.UI يمكن مراقبة إلى Session و Conversation source مستقل إصدار، إزالة استهلاك من لا نيل اعتماد اثنان من إشعار ترتيب.

تركيب حزمة يجب صريح تركيب تحميل الذي يحتاج adapter و target plugin. ناقص أداة جسم target وقت shell ما زال يمكن تشغيل، لكن لن توليد أو تخمين قياس هذا target View. أكثر كثير package و صريح تسجيل زيادة تركيب إعداد عمل، لكن اعتماد جهة نحو، اختبار نطاق و لذا عائق owner متساو يمكن نطاق جزء تحديد.

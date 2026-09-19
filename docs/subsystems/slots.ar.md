# Web Client Slots

[English](slots.md) | العربية

Slots هو Web Client نوع تحويل React تركيب نظام.[`dsh-client-ui-slots`](../../packages/client/ui-slots/README.ar.md) تعريف لا اعتماد React سجل التسجيل و نوع بديل عدد؛[`dsh-client-ui-renderer`](../../packages/client/ui-renderer/README.ar.md) يأخذ يمكن مراقبة قياس مصدر ربط صار خطاف، تصيير كامل شجرة شجرة، و في داخلي يملك React context. وظيفة إضافة عبر `ctx.slots.register()` مساهمة UI، أبدا استيراد أخرى وظيفة إضافة مكون.

هذا نص سجل slot كل حق، مكون إدخال، توسيع API و حالي طبقة درجة. خارج محيط بدء،Remote،Client model و Conversation بيانات عبر مسار رؤية [Web Client هيكل بنية](web-client.ar.md).

## إعلان و دورة الحياة

`SlotMap` هو تحرير ترجمة مدة سجل التسجيل. حزمة عبر إعلان دمج كتابة key،cardinality(أساس عدد) ،scope،owner props،keyed props و اختياري slot درجة inject face. وقت التشغيل إعلان فإن هو يملك هذا تصيير موضع مكون في `children` في إعطاء خروج مقابل بند.

إعلان واحد child سوف معا إنتاج ثلاثة نوع فاعلية نتيجة: أمر هذا child key توليد فاعلية، تخويل parent entry استدعاء `renderSlot` أو `renderSlotChain`، و سجل وقت التشغيل dispatch قاعدة إطار. كل إعلان فقط قدرة لديه واحد تخزين نشط owner. نحو لم إعلان slot تسجيل، أو تكرار إعلان أخرى entry قد يملك child، كل سوف في إضافة تنشيط وقت فشل.

`root` هو وحيد داخل بناء إعلان، أيضا هو وحيد من Cordis service ذاته تصيير key.`ui-renderer` استدعاء `ctx.slots.renderSlot('root', {})`؛ ذلك بقية كل بعد بديل كل عبر إعلان هو entry الذي استلام إلى `renderSlot` أو `renderSlotChain` prop تصيير.

تسجيل و إعلان التزام دوران Cordis effect دورة الحياة. إلغاء تدمير واحد entry سوف إزالة ذلك مساهمة، و تمرير عودة طي هو إعلان child slots. لذلك، نحو أخرى حزمة slot مساهمة وظيفة وقت استخدام `ctx.slots.inject(key, callback)`:callback سوف في كل مقطع إعلان دورة الحياة داخل تشغيل،owner طي وقت ذلك effect مع لـ إزالة،owner مجددا مرة تركيب وقت فإن إعادة تشغيل.

```tsx ignore-check
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

type HeaderActionProps = PropsRuntime<'conversation.session.header.actions'>

function HeaderAction({ useSession }: HeaderActionProps) {
  const running = useSession(snapshot => snapshot.running)
  return <button disabled={running}>Review</button>
}

export const inject = ['slots']

export function apply(ctx: Context): void {
  ctx.slots.inject('conversation.session.header.actions', () =>
    ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'review',
      order: 100,
    }, HeaderAction))
}
```

## Cardinality و scope

Slot إعلان ثابت اثنان عدد متبادل متبادل مستقل صيانة درجة.

| صيانة درجة | قيمة | يحتوي معنى |
|---|---|---|
| cardinality | `single` | مفرد عدد cell، تصيير حالي priority فوز من؛ حاجة و صف محتوى وقت ينبغي إعلان child slot، بينما لا هو يأخذ هو عند عمل قائمة. |
| cardinality | `list` | cell من لا بد ملء `id` تحديد عنوان، أولا حسب `order`، مجددا حسب تسجيل ترتيب ترتيب صف. |
| cardinality | `keyed` | owner نقل دخول `entryKey`؛ مطابقة cell بـ هذا key مقابل props تصيير. |
| cardinality | `chain` | كل entry توفير صاف `select(owner)` دالة؛ حسب priority ترتيب لقاء إلى رقم واحد غير null نتيجة نيل اختيار، و بـ `matched` نقل إعطاء مكون؛ الكل رفض وقت تصيير owner fallback. |
| scope | `root` | واحد root أثر مجال مكون و store نسخة. |
| scope | `session-maybe` | وراثة خارج محيط Provider binding، لكن لا يوجد binding وقت ما زال يمكن تصيير؛Session قيمة هو اختياري. |
| scope | `session` | اشتراط يمكن تحليل خارج محيط Provider binding، و استلام إلى تحديد وجود Session قيمة. |

مقابل في `single`،`list` و `keyed` cell،`priority` هو حجب حجب أولوية درجة؛ مقابل في `chain`، هو هو اختيار رفع ترتيب. عدد قيمة تجاوز صغير تجاوز أولا تشغيل أو تصيير. عادي زيادة كمية مساهمة ينبغي اختيار استخدام جديد list `id` أو keyed `key`؛ إعادة استخدام قد لديه cell يمثل متعمد استبدال ذلك عرض.

## مكون إدخال

تسجيل مكون سوف في binding موضع استلام إلى تجميع بعد إدخال. مكون ينبغي من هذه نوع دفع توجيه props، لا يلزم إعادة نسخ كتابة عضو.

| إدخال | إعلان من | مكون نوع |
|---|---|---|
| owner قيمة و معيار scope قيمة | `SlotMap` بند و قد تثبيت scope adapter | `PropsRuntime<K>` |
| نيل تخويل child renderer | تسجيل بند `children` keys | `PropsRenderSlots<S>` |
| مشترك عرض حالة selector hook و mutation callback | تسجيل بند `store` | `PropsStore<H>` |
| خاص بيانات،callback و observable hook | تسجيل بند `inject` factory | `InjectFace<I>` |
| محلي تحويل `t` دالة | تسجيل بند `locale` namespace | `PropsLocale<N>` |
| chain اختيار في قيمة | تسجيل بند `select` نتيجة | عبر `ComposedProps` توفير `matched` |

عند entry إعلان `session` أو `session-maybe` child وقت،`PropsRenderSlots` أيضا سوف توفير `SessionProvider`. لا نقل `session` prop وقت، هو وراثة خارج محيط binding؛ صريح نقل دخول `SessionReference` أو `undefined` وقت، فقط تغطية هذا فرعي شجرة.Provider لا لـ كامل body ضبط key. صارم إطار `session` entry في binding generation تغيير وقت إعادة تركيب. فارغ أبيض `session-maybe` entry قبول أول عدد binding وقت لا إعادة تركيب، لاحق generation تغير أو عودة إلى ناقص حالة وقت عندئذ إعادة تركيب.

مكون أبدا سوف استلام إلى `ctx`. أب مكون في بعض مرة تصيير وقت قد معرفة طريق قيمة عبر `renderSlot` owner معامل دخول؛ مشترك عرض حالة استخدام إعلان store؛service و model object إبقاء في `apply` closure في، فقط نحو مكون إسقاط callback أو observable source.

## إطار هيكل توفير hooks

حالي تركيب في adapter سوف إضافة التالي معيار props. هو جمع حسب هدف slot scope توفير، و تسجيل مكون قدوم ذاتي أي عدد حزمة غير متصل.

| متاح نطاق | Props | Owner |
|---|---|---|
| كل scope | `useSessions`،`useSessionStatus`،`useSessionRetainInfo` | `ui-session` |
| كل scope | `useWorkspaces` | `ui-workspace` |
| كل أثر مجال | `usePanelInfo` | `ui-layout` |
| `session` | `sessionId`،`useSession`،`useProjection` | `ui-session` |
| `session-maybe` | نتيجة اختياري `sessionId`،`useSession`،`useProjection` | `ui-session` |
| `session` | `useConversation`،`useInput`،`inputActions` | `ui-conversation` |
| `session-maybe` | نتيجة اختياري `useConversation`،`useInput`،`inputActions` | `ui-conversation` |
| `session` | `useChat` | `ui-chat` |
| `session` | `useTrajectory` | `ui-trajectory` |

Renderer أيضا سوف أصل حسب إعلان store إنشاء `useStore`، و أصل حسب إعلان locale namespace إنشاء `t`. هذه هو من تسجيل بند دفع توجيه props، لا يخص عام معيار props.

إطار هيكل و مجال adapter owner يمكن عبر `ctx.slots.provideRoot()` أو `ctx.uiSession.provide()` توسيع معيار تجميع دمج، معا توفير مقابل `GlobalStandardProps`،`SessionStandardProps` أو `SessionMaybeStandardProps` إعلان دمج. عادي وظيفة مكون لا ينبغي ذاتي سطر إنشاء React hook prop، أيضا لا ينبغي لـ entry خاص بيانات إضافة عام معيار prop.

## تطوير من توفير injection

تسجيل بند `inject` خيار هو عبر معتاد استخدام وظيفة خاص حقن نقطة. هو factory في إضافة `apply` عالم حد في تشغيل، يمكن إغلاق حزمة التقاط قد حقن Cordis service، و كما فقط إرجاع مكون الذي يحتاج بيانات و callback. مقابل في `session` slot، هو سوف استلام إلى `sessionId`؛ مقابل في `session-maybe`، هو استلام إلى `sessionId | undefined`؛ إعلان store بعد، هو أيضا سوف استلام إلى هذا store ربط بعد actions.

قيمة راجعة في إبقاء `hooks` كائن استقبال عار `getSnapshot`/`subscribe` source.Renderer يأخذ `hooks: { status }` تحويل لـ مكون prop `useStatus(selector)`، و حسب source identity ذاكرة مؤقتة ربط. مكون لن استلام إلى source ذاته، أيضا لا مباشر استدعاء `useSyncExternalStore`.

عند كل occupant كل حاجة نفس نوع قدرة وقت،slot owner يمكن في child إعلان داخل وضع وضع `inject` face. عادي عضو سوف أصل مثال تسليم إعطاء كل occupant؛ ذلك `hooks` كائن في دالة عضو هو hook factory، هو سوف استلام إلى slot معيار props و اختياري تدريجي مرة تصيير `hookContext`، مجددا إرجاع توفير إعطاء occupant تلقي حد hook.`conversation.chat.node` صحيح هو عبر هذا نوع آلية، لـ حالي تصيير node توفير `useTurnData(key)`.

مرة تصيير وقت owner معروف قيمة مشي owner props؛ مفرد عدد entry callback و خاص observable مشي تسجيل بند `inject`؛ من slot owner تحكم، كل occupant مشترك قدرة مشي slot درجة `inject`؛ حاجة عبر entry مشترك أو عبر إعادة تركيب إبقاء متغير عرض حالة مشي إعلان store.React node عبر child slot تركيب، لا عبر حقن قيمة نقل تمرير.

## حالي طبقة درجة

تحت رسم هو حالي إصدار تركيب إعلان شجرة. فقط لديه أداة اسم parent entry قد تركيب وقت، ذلك child عندئذ وجود؛ لذلك اختياري وظيفة entry يمكن بصفة واحد دورة الحياة وحدة يجعل كامل شجرة فرعي شجرة ظهور أو إزالة فقد.

```text
root
├─ sidebar
│  ├─ sidebar.brand.mark
│  ├─ sidebar.brand.name
│  ├─ sidebar.panellist
│  ├─ sidebar.footer.action
│  ├─ sidebar.workspaces
│  │  └─ sidebar.workspaces.directoryFlow
│  └─ sidebar.settings
│     ├─ settings.trigger
│     ├─ settings.header
│     ├─ settings.action
│     ├─ settings.close
│     ├─ settings.onboarding
│     └─ settings.section
│        ├─ settings.general.item
│        ├─ settings.models.provider-card
│        ├─ settings.models.footer
│        └─ settings.plugins.tab
├─ main
│  ├─ plugins.item
│  ├─ plugins.bundle.config
│  ├─ plugins.row.config
│  └─ main.conversation
│     ├─ conversation.session
│     │  └─ conversation.view
│     │     ├─ conversation.chat.node
│     │     │  ├─ conversation.chat.assistant-actions
│     │     │  ├─ conversation.chat.commandview
│     │     │  ├─ conversation.chat.turnTail
│     │     │  └─ tool.call.toolview
│     │     │     ├─ tool.call.images
│     │     │     └─ tool.view.cordis
│     │     ├─ conversation.message.images
│     │     └─ conversation.trajectory.images
│     ├─ conversation.session.header
│     │  ├─ conversation.session.header.lineage
│     │  ├─ conversation.session.header.leading
│     │  ├─ conversation.session.header.actions
│     │  ├─ conversation.session.header.utilities
│     │  └─ conversation.session.header.corner
│     ├─ conversation.composer
│     │  ├─ conversation.approval.detail
│     │  └─ conversation.plan-review.actions
│     ├─ conversation.composer.bar
│     │  ├─ conversation.input.attachments
│     │  ├─ conversation.input.permission
│     │  ├─ conversation.input.plan
│     │  └─ conversation.input.model
│     ├─ conversation.input.overlay
│     ├─ conversation.input.dock
│     ├─ conversation.composer.dock
│     ├─ conversation.input.left
│     ├─ conversation.input.right
│     ├─ conversation.hero.brand.mark
│     ├─ conversation.hero.workspace
│     │  └─ conversation.hero.workspace.directoryFlow
│     └─ conversation.hero.agentPreset
├─ rightbar
│  └─ rightbar.session
│     ├─ sidebar.right.pane.tab
│     │  ├─ sidebar.right.tab.guide
│     │  └─ sidebar.right.tab.guide.entry
│     ├─ sidebar.right.pane.tab.title
│     └─ sidebar.right.tab.menu.item
└─ shell.overlay
```

توليد Client inspect catalog هو كل key كامل مشاركة اعتبار، يتضمن cardinality،scope،owner props، معيار props، حالي occupant، إعلان owner و استبدال ريح خطر. تشغيل في حركة حالة حزمة يمكن استخدام `cordis_inspect what:"client"` استعلام فوري شجرة و بعض عدد دقيق key؛ شفرة المصدر catalog من `pnpm run gen-client-catalog` أصل حسب `SlotMap` إعلان و `slots.register()` استدعاء نقطة توليد.

## توسيع قاعدة

- آخر عدد وظيفة حزمة فقط قدرة عبر `import type` جذب دخول إعلان؛ أبدا استيراد أو تحويل إرسال هو وقت التشغيل قيمة.
- فقط في يملك و تصيير بعض عدد موضع مكون في إعلان جديد child slot. أخرى حزمة عبر `ctx.slots.inject()` انتظار، مجددا عبر `ctx.slots.register()` مساهمة محتوى.
- عمل خدمة و نقل حالة إبقاء في الذي تابع Cordis service أو Client model في.Slot store فقط تحمل تحميل مشترك عرض و تفاعل حالة.
- يمكن مراقبة قياس source و ذلك snapshot identity في قيمة تغير قبل إبقاء مستقر؛ قيمة تغير وقت عبر نفس عدد source إصدار.
- UI domain بين فقط نقل JSON توافق بيانات و callback.`hooks` compartment هو عار observable وحيد مثال خارج؛React محتوى عبر slot نقل تمرير.
- سوف `single` و قد لديه occupant keyed cell نظر لـ استبدال نقطة. زيادة كمية توسيع استخدام list id أو بعد لم احتلال استخدام key.

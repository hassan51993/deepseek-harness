# خانات عميل Web

[English](slots.md) | العربية

الخاناتُ نظامُ تركيب React المنوَّع في عميل Web. وتعرّف [`dsh-client-ui-slots`](../../packages/client/ui-slots/README.ar.md) السجلَّ الخالي من React وجبرَ الأنواع؛ وتربط [`dsh-client-ui-renderer`](../../packages/client/ui-renderer/README.ar.md) المصادرَ المرصودة بالخطّافات، وتعرض الشجرةَ، وتملك سياقاتِ React داخليًا. وتسهم إضافةُ الميزة بواجهة عبر `ctx.slots.register()` ولا تستورد قط مكوّنَ إضافة ميزة أخرى.

وتوثّق هذه الصفحةُ ملكيةَ الخانات، ومُدخَلاتِ المكوّنات، وواجهاتِ التوسعة، والتسلسلَ المشحون. أما مساراتُ الإقلاع وRemote ونموذج العميل والمحادثة المحيطة فموجودة في [معمار عميل Web](web-client.ar.md).

## التصريح ودورة الحياة

`SlotMap` هو السجلُّ عند الترجمة. وتدمج الحزمةُ بالتصريح المفتاحَ والعدديةَ والنطاقَ وخصائصَ المالك والخصائصَ المفتاحية ووجهَ الحقن الاختياري على مستوى الخانة. والتصريحُ في وقت التشغيل هو مدخلُ `children` المقابل على المكوّن الذي يملك موضعَ العرض.

ولتصريح ابن ثلاثةُ آثار: يجعل مفتاحَ الابن حيًّا، ويخوّل نداءَ `renderSlot` أو `renderSlotChain` في مدخل ذلك الأب، ويسجّل مواصفةَ التوزيع في وقت التشغيل. ويملك مدخلٌ حيٌّ واحد كلَّ تصريح. والتسجيلُ في خانة غير مصرَّح بها أو تصريحُ ابن يملكه موضعٌ آخر يفشل أثناء تفعيل الإضافة.

و`root` هو التصريحُ المدمج الوحيد والمفتاحُ الوحيد المعروض عبر خدمة Cordis نفسِها. وتنادي `ui-renderer` الدالةَ `ctx.slots.renderSlot('root', {})`؛ ويُعرض كلُّ سليل عبر خاصية `renderSlot` أو `renderSlotChain` في المدخل الذي صرّح به.

وتتبع التسجيلاتُ والتصريحاتُ أعمارَ آثار Cordis. والتخلصُ من مدخل يزيل إسهامَه ويطوي تكراريًّا خاناتِ الأبناء التي صرّح بها. ولذلك تستعمل الميزةُ التي تسهم في خانة حزمة أخرى الدالةَ `ctx.slots.inject(key, callback)`: فيعمل ردُّ النداء لكل عمر تصريح، وتُزال آثارُه حين ينطوي المالك، ويعمل ثانيةً إن رُكّب المالكُ من جديد.

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

## العددية والنطاق

يثبّت تصريحُ الخانة محورين مستقلين.

| المحور | القيمة | المعنى |
|---|---|---|
| العددية | `single` | خليةٌ واحدة. يُعرض الفائزُ بالأولوية النشطة. استعمل خانةَ ابن بدل معاملة هذه قائمةً تراكمية. |
| العددية | `list` | تُخاطَب الخلايا بـ`id` مشترَط وتُرتَّب بـ`order` ثم بترتيب التسجيل. |
| العددية | `keyed` | يوزّع المالكُ قيمةَ `entryKey`؛ وتُعرض الخليةُ المطابِقة بأي خصائص خاصة بالمفتاح. |
| العددية | `chain` | يقدّم كلُّ مدخل دالةَ `select(owner)` نقية. وتُعرض أولُ نتيجة غير فارغة بترتيب الأولوية وتتلقاها قيمةً لـ`matched`؛ وإلا عُرض احتياطيُّ المالك. |
| النطاق | `root` | مكوّنٌ واحد ونسخةُ مخزن واحدة على مستوى الجذر. |
| النطاق | `session-maybe` | يرث ربطَ المزوّد المحيط لكنه يبقى قابلًا للعرض بلا مزوّد؛ وقيمُ الجلسة اختيارية. |
| النطاق | `session` | يشترط ربطَ مزوّد محيط محلولًا ويتلقى قيمَ جلسة مؤكدة. |

و`priority` رتبةُ حجب للخلايا `single` و`list` و`keyed`، وترتيبُ انتخاب لـ`chain`. والقيمُ الأصغر تعمل أو تُعرض أولًا. وعلى الإسهامات التراكمية المعتادة أن تختار `id` جديدًا في القائمة أو `key` جديدًا في المفتاحية؛ أما إعادةُ استعمال خلية مشحونة عمدًا فتستبدل عرضَها.

## مُدخَلات المكوّنات

يتلقى المكوّنُ المسجَّل مُدخَلاتٍ تُجمَّع عند موضع ربطه. وتشتق المكوّناتُ هذه الأنواعَ بدل نسخ أعضائها.

| المُدخَل | من يصرّح به | نوع المكوّن |
|---|---|---|
| قيمُ المالك وقيمُ النطاق القياسية | صفُّ `SlotMap` ومهايئاتُ النطاق المثبَّتة | `PropsRuntime<K>` |
| عارضو الأبناء المخوَّلون | مفاتيحُ `children` في التسجيل | `PropsRenderSlots<S>` |
| خطّافُ الانتقاء وردودُ نداء التغيير لحالة العرض المشتركة | حقلُ `store` في التسجيل | `PropsStore<H>` |
| البياناتُ الخاصة وردودُ النداء والخطّافاتُ المرصودة | مصنعُ `inject` في التسجيل | `InjectFace<I>` |
| دالةُ `t` المترجَمة | فضاءُ أسماء `locale` في التسجيل | `PropsLocale<N>` |
| قيمةُ السلسلة المنتقاة | نتيجةُ `select` في التسجيل | `matched` عبر `ComposedProps` |

ويحضر `SessionProvider` أيضًا في `PropsRenderSlots` حين يصرّح مدخلٌ بابن `session` أو `session-maybe`. وبلا خاصية `session` يرث الربطَ المحيط؛ وقيمةُ `SessionReference` صريحة أو `undefined` تتجاوز تلك الشجرةَ الفرعية وحدها. ولا يفهرس المزوّدُ متنَه كلَّه بمفتاح. ويُعاد تركيبُ مدخل `session` الصارم حين يتغيّر جيلُ ربطه. ويتبنى مدخلُ `session-maybe` الفارغ أولَ ربط له بلا إعادة تركيب، ثم يُعاد تركيبُه عند جيل لاحق أو عند العودة إلى الغياب.

ولا تتلقى المكوّناتُ `ctx` قط. وتدخل قيمُ المالك اللحظية عبر وسيط المالك في `renderSlot`؛ وتستعمل حالةُ العرض المشتركة مخزنًا مصرَّحًا به؛ وتبقى الخدماتُ وكائناتُ النموذج في إغلاق `apply` وتُسقَط في ردود النداء أو المصادر المرصودة.

## خطّافات يقدّمها الإطار

تضيف المهايئاتُ المشحونة هذه الخصائصَ القياسية. وهي متاحةٌ بحسب نطاق الخانة الهدف، بمعزل عن الحزمة التي سجّلت المكوّن.

| الإتاحة | الخصائص | المالك |
|---|---|---|
| كلُّ النطاقات | `useSessions` و`useSessionStatus` و`useSessionRetainInfo` | `ui-session` |
| كلُّ النطاقات | `useWorkspaces` | `ui-workspace` |
| كلُّ النطاقات | `usePanelInfo` | `ui-layout` |
| `session` | `sessionId` و`useSession` و`useProjection` | `ui-session` |
| `session-maybe` | نتائجُ `sessionId` و`useSession` و`useProjection` الاختيارية | `ui-session` |
| `session` | `useConversation` و`useInput` و`inputActions` | `ui-conversation` |
| `session-maybe` | نتائجُ `useConversation` و`useInput` و`inputActions` الاختيارية | `ui-conversation` |
| `session` | `useChat` | `ui-chat` |
| `session` | `useTrajectory` | `ui-trajectory` |

وينشئ العارضُ أيضًا `useStore` من مخزن مصرَّح به و`t` من فضاء أسماء locale مصرَّح به. وهاتان خاصيتان مشتقتان من التسجيل لا خاصيتان قياسيتان عامتان.

ويستطيع مالكو الإطار ومهايئاتِ المجال توسيعَ المجموعة القياسية عبر `ctx.slots.provideRoot()` أو `ctx.uiSession.provide()` مع دمج تصريح `GlobalStandardProps` أو `SessionStandardProps` أو `SessionMaybeStandardProps` المقابل. وعلى مكوّن الميزة ألّا ينشئ خاصيةَ خطّاف React بنفسه وألّا يضيف خاصيةً قياسية عامة لبيانات خاصة بمدخل.

## الحقن الذي يقدّمه المطوّر

خيارُ `inject` في التسجيل هو نقطةُ الحقن المعتادة التي تملكها الميزة. ويعمل مصنعُه في عالم `apply` لدى الإضافة، وله أن يُغلق على خدمات Cordis محقونة، ولا يعيد إلا البياناتِ وردودَ النداء التي يحتاجها المكوّن. وهو يتلقى في خانة `session` قيمةَ `sessionId`؛ وفي `session-maybe` يتلقى `sessionId | undefined`؛ وحين يُصرَّح بمخزن يتلقى أيضًا أفعالَ المخزن المربوطة.

ويقبل كائنُ `hooks` المحجوز في تلك القيمة المعادة مصادرَ `getSnapshot` و`subscribe` المجردة. ويحوّل العارضُ `hooks: { status }` إلى خاصية مكوّن `useStatus(selector)` ويخزّن الربطَ بهوية المصدر. ولا تتلقى المكوّناتُ المصدرَ نفسَه ولا تنادي `useSyncExternalStore` مباشرةً.

ولمالك الخانة أن يضع وجهَ `inject` في تصريح الابن حين يحتاج كلُّ شاغل إلى القدرة نفسِها. وتصل الأعضاءُ الصرفة كلَّ الشاغلين بلا تغيير. والأعضاءُ ذوو القيم الدالّية داخل كائن `hooks` مصانعُ خطّافات؛ تتلقى الخصائصَ القياسية للخانة و`hookContext` الاختياري لكل عرض، ثم تعيد الخطّافَ المقيَّد المكشوف للشاغل. وتستعمل `conversation.chat.node` هذه الآليةَ لتقديم `useTurnData(key)` للعقدة المعروضة حاليًا.

استعمل خصائصَ المالك للقيم المعروفة سلفًا عند عرض واحد، و`inject` في التسجيل لردود نداء مدخل واحد ومرصوداته الخاصة، و`inject` على مستوى الخانة لقدرة يتحكم فيها مالكُ الخانة، ومخزنًا مصرَّحًا به لحالة عرض قابلة للتغيير تتشاركها المداخلُ أو تبقى عبر إعادات التركيب. وتتركب عقدُ React عبر خانات الأبناء لا عبر قيم محقونة.

## التسلسل الحالي

التسلسلُ أدناه هو شجرةُ التصريحات المشحونة. ولا يوجد الابنُ إلا ما دام مدخلُ الأب المسمّى مركَّبًا؛ ولذلك تستطيع مداخلُ الميزات الاختيارية أن تُظهر شجرةً فرعية أو تُخفيها وحدةَ دورة حياة واحدة.

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

ودليلُ فحص العميل المولَّد هو العقدُ الشامل لكل مفتاح: العددية، والنطاق، وخصائصُ المالك، والخصائصُ القياسية، والشاغلون الحاليون، ومالكُ التصريح، وخطرُ الاستبدال. وتستطيع حزمةٌ ديناميكية عاملة أن تستعلم عن الشجرة الحية وعن مفتاح بعينه بـ`cordis_inspect what:"client"`؛ ويُولَّد دليلُ المصدر من تصريحات `SlotMap` ومن مواضع نداء `slots.register()` بأمر `pnpm run gen-client-catalog`.

## قواعد التوسعة

- استورد حزمةَ ميزة أخرى للتصريحات وحدها بـ`import type`؛ ولا تستورد قيمَها في وقت التشغيل ولا تعيد تصديرها.
- صرّح بخانة ابن جديدة في المكوّن الذي يملك ذلك الموضعَ ويعرضه وحده. وتنتظر الحزمُ الأخرى بـ`ctx.slots.inject()` وتسهم بـ`ctx.slots.register()`.
- أبقِ حالةَ العمل والنقل في خدمات Cordis أو نماذج العميل المالكة لها. ولا تحمل مخازنُ الخانات إلا حالةَ العرض والتفاعل المشتركة.
- أبقِ هويةَ المصدر المرصود وهويةَ اللقطة ثابتتين بين التغييرات. وأعِد النشرَ عبر المصدر نفسِه كلما تغيّرت قيمتُه.
- مرّر بين مجالات الواجهة بياناتٍ متوافقة مع JSON وردودَ نداء. وحجرةُ `hooks` هي الاستثناءُ الوحيد للمرصودات المجردة؛ ويسافر محتوى React عبر الخانات.
- عامِل `single` والخليةَ المفتاحية المشغولة نقاطَ استبدال. واستعمل معرّفاتِ القوائم أو مفتاحًا غيرَ مشغول للتوسعات التراكمية.

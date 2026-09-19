# يمين جانب Sidebar

[English](sidebar-right.md) | العربية

يمين جانب Sidebar هو Web Client داخل كل جلسة واحد نسخة توقف اعتماد وجه: جلسة منطقة جانب واحد صف pane و tab، حسب عنوان بحث عنوان محتوى——مساحة العمل ملف، دليل شجرة، منتج ذاتي حمل صفحة——في هذا داخل فتح، قسم شريط، طفو خروج، إغلاق.[`dsh-client-ui-sidebar-right`](../../packages/client/ui-sidebar-right/README.zh.md) يملك هذا عدد وجه،tab نوع سجل التسجيل و تنقل خدمة؛[`dsh-client-ui-dockkit`](../../packages/client/ui-dockkit/README.zh.md) هو هو داخلي تخطيط جذب محرك؛[`dsh-client-resources`](../../packages/client/resources/README.zh.md) يأخذ عنوان تغيير صار أي مكون كل قدرة قراءة نشط بيانات؛[`dsh-api-workspace-files`](../../packages/api/workspace-files/README.zh.md) معا توفير Host مساحة العمل ملف خدمة و Client `file` مورد توفير من.

هذا صفحة هو هذا فرعي نظام عقد نحو مشاركة اعتبار: عنوان،tab نوع تسجيل، تنقل خدمة، توسيع slot و ذلك owner props، مورد نموذج،Workspace Files خدمة، داخل وضع نوع، و واضح لا فعل أمر. تخطيط جذب محرك،frame و توقف اعتماد وجه مثل أي تجميع في واحد بدء رؤية [Agent Note](../../.agents/notes/implemented/feature/2026-09-04-right-sidebar-docking-infrastructure.zh.md) ؛slot آلية رؤية [Slots مشاركة اعتبار](slots.zh.md).

## تحديد موضع و ملكية

كل جلسة تماما لديه واحد توقف اعتماد وجه، حفظ في جلسة أثر مجال slot store داخل، من `rightbar.session` رسم صنع.root أثر مجال `rightbar` تحكم جهاز فقط في اختيار في Conversation وقت تركيب هذا مقعد موضع؛ تحديث جديد صفحة بعد كل جلسة عودة إلى طي افتراضي حالة، تبديل جلسة وقت كل منها وجه إبقاء أصل حالة ([حالة](../../packages/client/ui-sidebar-right/README.zh.md#state)). وجه كل مرة تغير كل هو kit صاف قاعدة تخطيط جهاز حساب خروج واحد بند تاريخ سجل؛ توقف اعتماد pane من لا فارغ حال، أصل pane لـ فارغ وقت سوف إضافة دخول أصل حسب قد تسجيل جذب استيراد فتحة اختيار خروج افتراضي صفحة.

واحد tab نوع هو مشترك استخدام تعريف `id` اثنان مرة تسجيل: في `ctx.sidebarRightTabs` داخل ساكن حالة تعريف شرح ذلك `kind` فتح أي بعض عنوان، مرة keyed slot تسجيل توفير هو متن. إطار هيكل حقن `useTabInfo()` بـ قراءة Sidebar، نافذة إطار و وسم فوري معلومة؛ كل نوع يأخذ ذاته حالة وضع في slot store داخل. كل حزمة بين فقط بـ نوع شكل صيغة مرجع ذاك هذا إعلان.

| حزمة | مسؤولية |
|---|---|
| [`client/ui-sidebar-right`](../../packages/client/ui-sidebar-right/README.zh.md) | وجه لوح و شريط مقعد موضع، تخطيط store،`ctx.sidebarRightTabs`،`ctx.sidebarRight`،Tab مجال، جذب توجيه نوع |
| [`client/ui-dockkit`](../../packages/client/ui-dockkit/README.zh.md) | صاف تخطيط جذب محرك و React وجه؛`ui-sidebar-right` داخلي اعتماد، لا هو مستقر واجهة |
| [`client/resources`](../../packages/client/resources/README.zh.md) | `ctx.resources`،`useResource`، بروتوكول → قيمة نوع زهرة اسم سجل `ResourceProtocolMap` |
| [`api/workspace-files`](../../packages/api/workspace-files/README.zh.md) | Host `ctx.workspaceFiles`،`workspaceFiles` Remote نطاق الأسماء و Client `file` مورد توفير من |
| [`util/workspace-path`](../../packages/util/workspace-path/README.zh.md) | ملف عنوان لغة قاعدة:`fileAddressFor`،`parseFileAddress` |
| [`client/ui-sidebar-documentpreview`](../../packages/client/ui-sidebar-documentpreview/README.zh.md) ،[`client/ui-sidebar-files`](../../packages/client/ui-sidebar-files/README.zh.md) ،[`client/ui-sidebar-browser`](../../packages/client/ui-sidebar-browser/README.zh.md) | داخل وضع `text`،`files` و `browser` نوع |

## عنوان

كل tab كل من واحد عنوان حرف سلسلة فتح، عنوان حينئذ هو tab محتوى هوية. عنوان قسم اثنان عائلة.

**مورد عنوان**هو `dsh-resource://<type>/…` شكل صيغة URL.host تسمية مورد بروتوكول——أي `ResourceProtocolMap` مفتاح——ذلك بعد هو هذا بروتوكول ذاتي ذات مسار؛ كل بروتوكول مشترك استخدام واحد scheme، إضافة جديدة بروتوكول فقط إضافة جديدة host، لا إضافة جديدة scheme.`file` بروتوكول مسار بـ ذلك أثر مجال فتح رأس:`session/<sessionId>` بعد وصل متبادل مقابل هذا جلسة مساحة العمل أصل مسار (`dsh-resource://file/session/abc/src/notes.txt`) ، أو `absolute` بعد وصل ذهاب إسقاط قبل توجيه `/` قطعا مقابل مسار (`dsh-resource://file/absolute/home/ys/notes.txt`،Windows فوق لـ `dsh-resource://file/absolute/C:/x/y.txt`).id و كل واحد مقطع مسار كل فعل مكون تحرير رمز، قرص رمز `:` إبقاء أصل مثال.`fileAddressFor(sessionId, cwd, path)` بنية صنع عنوان——متبادل مقابل مسار أو مساحة العمل داخل قطعا مقابل مسار يصبح `session` متبادل مقابل عنوان، أخرى قطعا مقابل مسار يصبح `absolute` عنوان——`parseFileAddress(address)` قراءة عودة كل جزء أو إرجاع `undefined`([لغة قاعدة](../../packages/util/workspace-path/README.zh.md)).

**صفحة عنوان**هو Sidebar لـ حسب kind(بينما غير حسب مورد) فتح tab تسجيل تحت عنوان:`sidebar://<kind>`، من Sidebar ذاتي ذات في `openTab(kind)` وقت التشغيل كتابة. استدعاء جهة من لا تجميع هو——جذب توجيه صفحة و ملف شجرة بـ `openTab('guide')`،`openTab('files')` فتح——هذا خارج لا وجود أي تنقل عنوان ([لا فعل](#not-built)).

tab هوية هو `(kind, address)` اثنان عنصر مجموعة: سجل التسجيل إقرار قيادة يأخذ عنوان أصل نص استخدام عمل سجل `contentId`، لذلك نفس عنوان مرور نفس نوع مجددا مرة فتح سوف بحث إلى قد لديه tab، نفس عنوان مرور اثنان عدد نوع فتح فإن هو اثنان عدد tab.

## Tab نوع تسجيل

`ctx.sidebarRightTabs.register(definition)` في استدعاء جهة دورة الحياة داخل تسجيل واحد نوع واحد نسخة تنفيذ و إرجاع ملاحظة إلغاء جهاز؛ استدعاء جهة يأخذ هو وضع في ذاتي ذات `ctx.effect` داخل، لذلك تنفيذ و مساهمة هو إضافة نفس عمر، نفس `id` ثاني مرة تسجيل رمي خطأ ([توسيع مقعد موضع](../../packages/client/ui-sidebar-right/README.zh.md#extension-seats)). تعريف هو ساكن حالة: لا يوجد وقت التشغيل hook، لا يوجد حسب tab أو حسب جلسة شرق غرب.

| حقل | يحتوي معنى |
|---|---|
| `id` | هذا تنفيذ هوية، في كل تسجيل في وحيد؛ حزمة اسم هو ذاتي لكن أخذ قيمة (`@deepseek-ai/dsh-client-ui-sidebar-files`). متن و عنوان حفرة موضع حسب هو تسجيل. |
| `kind` | نوع حكم آخر اسم: هو tab هو ماذا، أيضا هو `openTab` نقطة اسم كائن. لا وحيد——extension يمكن وصل إدارة builtin kind. داخل وضع kind لـ `guide`،`text`،`files`. |
| `patterns` | اختياري مورد عنوان glob؛ حسب kind فتح صفحة نوع حذف. يحتوي `:` نمط مطابقة كامل عنوان (`dsh-resource://file/**`) ؛ لا يحتوي مطابقة URL مسار جزء كما مهمة معنى عميق درجة كل في (`*.md`) ، لا هو URL عنوان لن أمر في هذا صنف نمط. مطابقة لا قسم كبير صغير كتابة، لا إخفاء dotfile؛ لغة قاعدة لـ picomatch POSIX جهة قول. |
| `priority` | ثلاثة ملف حرف وجه كمية لـ واحد:`extension`(نقص حذف كما الأكثر عال: منتج خارج نوع ضغط مرور كل داخل وضع فحص نظر جهاز) ،`builtin`(مع منتج إصدار نوع) ،`fallback`(أي أكثر أداة جسم نوع كل ينبغي ضغط مرور صاف محتوى فحص نظر جهاز). |
| `canOpen(address)` | اختياري تزامن مرفوض، مقابل glob أمر في توليد فاعلية؛ كل مرة توجيه قرار كل سوف استدعاء. |
| `title(address)` | chip نص، في tab فتح وقت التقاط دخول تخطيط سجل، بعد لم يعد تعديل كتابة. |
| `guide` | اختياري جذب توجيه صفحة مدخل إطار:`{ order, title(), description?(), icon? }`. نقطة واحد إطار أي يأخذ مساهمة هو نوع بصفة صفحة فتح؛ حذف أي لا فوق جذب توجيه صفحة. |

توجيه هو مرة ترتيب ترتيب إقرار قيادة.`candidates(address)` مقابل نمط أمر في كما لم يتم `canOpen` مرفوض نوع ترتيب ترتيب: أولا حسب ملف، مجددا حسب الأكثر طويل أمر في نمط طويل درجة، الأكثر بعد حسب تسجيل ترتيب.`claim(address, kind?)` أخذ رقم واحد مرشح، أو مباشر استخدام نقطة اسم `kind`——قفز مرور هو glob، لكن `canOpen` ما زال توليد فاعلية——إرجاع `{ kind, contentId: address, title }`. لا يوجد أي نوع إقرار قيادة عنوان سوف رمي خطأ: هذا هو وصل خط خطأ، لا هو مستخدم خطأ.

نفس عدد `kind` يمكن معا يحمل واحد `builtin` و واحد `extension` تسجيل.extension في إقرار قيادة،`get(kind)`،`openTab(kind)` و جذب توجيه صفحة فوق توليد فاعلية، مقعد موضع حسب توليد فاعلية تعريف `id` بحث tab متن و عنوان، لا تعلق و أي slot أولوية درجة؛extension ملاحظة إلغاء بعد builtin استعادة.kind فوق ذلك هو أي اصطدام اسم و أي تكرار `id` كل رمي خطأ.

```ts ignore-check
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'

export const inject = ['sidebarRightTabs', 'slots']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.sidebarRightTabs.register({
    id: '@acme/dsh-client-ui-image',
    kind: 'image',
    patterns: ['*.png', '*.jpg', '*.gif', '*.svg'],
    canOpen: address => address.startsWith('dsh-resource://file/'),
    title: address => address.slice(address.lastIndexOf('/') + 1),
  }), 'image type')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab', key: '@acme/dsh-client-ui-image' },
    ImageBody,
  )), 'image body')
}
```

## تنقل:`ctx.sidebarRight`

اثنان نوع فتح بنية صار تنقل تحكم جهاز، دخول هذا واحد صف كل بند مسار كل استدعاء ذلك واحد:`openResource(address, options?)` فتح `dsh-resource://` عنوان——جلسة منطقة ملف رابط، أداة سطر سطر رقم مرجع، ملف شجرة سطر؛`openTab(kind, options?)` فتح صفحة——tab بند إضافة جديدة تحكم عنصر، جذب توجيه صفحة مدخل إطار أو Assistant Markdown في HTTP(S) رابط. اثنان من كل بـ واحد بند تاريخ سجل مشي تمام أربعة خطوة——إقرار قيادة (سجل التسجيل لـ مورد ترتيب مرشح، أو نقطة اسم `kind` توليد فاعلية تنفيذ ينبغي جواب) ؛ تجمع تركيز قد عرض نفس `(kind, address)` tab؛ لا فإن سقوط واحد جديد tab؛ توسيع هذا واحد صف——لكن بعد يأخذ تنقل تسجيل دخول Tab مجال ([خدمة](../../packages/client/ui-sidebar-right/README.zh.md#ctxsidebarright)). مستخدم نظر لا رؤية محتوى لا حساب فتح، الذي بـ طي صف سوف في نفس خطوة توسيع.`openResource` مقابل `dsh-resource://` خارج عنوان أو بلا شخص إقرار قيادة عنوان رمي خطأ؛`openTab` مقابل بلا شخص تسجيل kind رمي خطأ: اثنان من كل هو وصل خط خطأ، لا هو مستخدم خطأ.

| خيار | يحتوي معنى |
|---|---|
| `paneId` | جديد tab سقوط إلى هذا عدد pane؛ نقص حذف لـ نشط حركة توقف اعتماد pane(نشط حركة هو طفو نافذة وقت أخذ رقم واحد توقف اعتماد pane). |
| `replaceTab` | احتلال استخدام هذا عدد tab pane و بند فوق موضع، و في نفس خطوة إغلاق هو؛ طفو نافذة داخل tab يجعل لا خروج موضع، جديد tab حسب لم إشارة تحديد موضع سقوط موضع. |
| `revealIfOpened` | نقص حذف `true`: قد عرض نفس `(kind, address)` tab يتم تجمع تركيز و استلام إلى `params`.`false` فإن بلا نقاش مثل أي مجددا فتح واحد. |
| `preferNewPane` | في عادي إطار عدد ميزانية و فضاء قاعدة تحت أولوية جديد بناء توقف اعتماد إطار؛ لا يستطيع قسم شريط وقت رجوع إلى هدف إطار. و `replaceTab` واحد بدء استخدام وقت تجاهل اختصار. |
| `kind`(فقط `openResource`) | نقطة اسم فتح نوع بينما لا ترتيب مرشح؛ هذا kind توليد فاعلية تنفيذ فتح عنوان، هو `canOpen` ما زال توليد فاعلية. |
| `params` | إعطاء متن تنقل معامل، بصفة `navigation.params` إرسال بلوغ.`openResource` حسب مورد نوع مرور إعلان دمج جدول `SidebarRightResourceParamsMap` تحديد نوع (نص معاينة إعلان `{ line?: number }`) ؛`openTab<K>` حسب kind مرور `SidebarRightTabParamsMap` تحديد نوع، لم إعلان kind لـ `undefined`؛ متن قراءة إلى هو اثنان من ربط دمج `SidebarRightNavigationParams`. قيمة حسب اتفاق لـ JSON شكل حالة، وقت التشغيل لا تحقق. |

سقوط موضع هو استدعاء جهة خيار، من لا هو نوع خاصية. جلسة منطقة ضبط `openResource(fileAddressFor(sessionId, cwd, path))`،`read` أداة سطر آخر إضافة `{ params: { line } }`(قدوم ذاتي استدعاء 1 بدء `offset`) ؛ جذب توجيه صفحة مدخل إطار ضبط `tab.actions.openTab(entry.kind, { replaceTab: true })`؛ ملف شجرة سطر ضبط `tab.actions.openResource(address)`؛tab بند إضافة جديدة تحكم عنصر ضبط `openTab('guide', { paneId, revealIfOpened: false })`.

`close(tabId)` إغلاق واحد tab؛`active()` إرجاع نشط حركة pane نشط حركة tab؛`isExpanded()` و `toggleExpanded()` قراءة و قلب تحويل هذا واحد صف، قلب تحويل تسجيل دخول تسلسل. بلا جلسة وقت قراءة عملية إرجاع `undefined` أو `false`؛ كتابة عملية حاجة قد تركيب جلسة وجه، لا يوجد وقت رمي خطأ بينما لا هو كتابة دخول لا شخص رسم صنع وجه.

`focus(tabId)` يجعل واحد tab يصبح ذلك pane نشط حركة tab؛`split(paneId?)` قسم قطع نشط حركة توقف اعتماد pane أو نقطة اسم pane، إرجاع جديد pane id——pane عدد ميزانية أو صف عرض لا سماح وقت إرجاع `undefined` كما لا تسجيل حساب؛`float(tabId, rect?)` يأخذ واحد tab طفو خروج لـ طفو نافذة pane؛`dock(paneId)` يأخذ طفو نافذة pane استلام عودة توقف اعتماد منطقة. أربعة من كل مشي store قائم حركة عمل، كل تسجيل واحد بند تاريخ؛ هدف لا وجود أو قد موضع في هدف حالة وقت هو فارغ عملية، و `open` واحد مثال في لا يوجد قد تركيب جلسة وجه وقت رمي خطأ.`TabId`،`PaneId`،`TabRecord`،`FloatRect` ذاتي هذه الحزمة `/client` مدخل مجددا توجيه خروج، استدعاء جهة بلا حاجة جذب dockkit.

## Slot و owner props

Sidebar إعلان أربعة عدد توسيع slot؛ ذلك وثيقة tab آخر سطر إعلان تحت جدول في keyed وثيقة متن slot([طبقة درجة](slots.zh.md)).

| Slot | Cardinality | استخدام طريق |
|---|---|---|
| `sidebar.right.pane.tab` | حسب تعريف `id` keyed، جلسة أثر مجال | واحد tab متن. مقعد موضع يأخذ tab توزيع إلى ذلك kind توليد فاعلية تنفيذ `id`، لذلك تسجيل من استلام إلى هذا kind كل tab، توقف اعتماد أو طفو نافذة. تنفيذ لا يوجد تسجيل متن kind تصيير owner «لا يمكن فحص نظر هذا محتوى» تلميح. |
| `sidebar.right.pane.tab.title` | حسب تعريف `id` keyed، جلسة أثر مجال | chip عنوان،owner share و متن نفسه. اختياري: لا يوجد بند وقت chip عرض فتح وقت التقاط `title(address)` نص؛ لديه نشط عنوان نوع في هذا قراءة ذاتي ذات store. |
| `sidebar.right.tab.guide` | chain، جلسة أثر مجال | استبدال جذب توجيه tab محتوى بينما لا استبدال tab؛ رقم واحد لا رفض بند وصل إدارة متن، لا فإن تصيير ذاتي حمل جذب توجيه. |
| `sidebar.right.tab.menu.item` | list، جلسة أثر مجال | إلحاق في kit ذاته تخطيط حركة عمل بعد محتوى درجة حركة عمل. تنفيذ حركة عمل بند يجب استدعاء owner `dismiss()`. |
| `sidebar.right.tab.document` | حسب وثيقة تنفيذ `id` keyed، جلسة أثر مجال | وثيقة tab داخل اختيار في ملف مصير؛ أب مكون يملك مشترك تحميل و أداة شريط تحكم عنصر. |

متن، عنوان و جذب توجيه صفحة استبدال بند استقبال إطار هيكل حقن `useTabInfo()`. هو إرجاع `{ sidebar, panel, tab }`:`sidebar` يتضمن `expanded` و `fullscreen`،`panel.id` معرف الذي تابع نافذة إطار،`tab` يتضمن سجل حقل و `visible`،`navigation`،`signal` و `actions`. توقف اعتماد متن فقط في توسيع كما نشط وثب وقت مرئي؛ توقف اعتماد عنوان فقط اشتراط توسيع؛ طفو نافذة إبقاء مرئي.`signal` في سجل إزالة فقد أو إضافة إزالة وقت في توقف، لا بسبب إخفاء أو تبديل Session بينما في توقف.`tab.actions` توفير ربط إلى وسم الذي تابع Session `openResource`،`openTab` و `close`. فتح موضع نقص حذف لـ حالي الذي تابع نافذة إطار؛`revealIfOpened` نقص حذف لـ `true`،`replaceTab: true` في نفس تاريخ بند في استبدال هذا سجل. قائمة مفرد بند إبقاء عادي `tab` و `dismiss` owner معامل.

`navigation.revision` في كل مرة تنقل إلى هذا tab وقت تمرير زيادة،`params` ثابت أيضا تمرير زيادة، متن يمكن فقط سند «أيضا يتم تنقل» سطر حركة؛ حسب عنوان فتح tab لـ `1`، لا يوجد شخص حسب عنوان فتح سجل——نوع دخول جذب توجيه، سحب إلغاء استعادة tab——لـ `0`.Tab مجال لـ كل بند فتح سجل حفظ لديه واحد occurrence: سجل ظهور أي في مورد نموذج داخل تثبيت إقامة، لذلك تبديل tab إزالة متن أيضا لا فقد محتوى؛ سجل إزالة فقد أي في توقف و إسقاط؛ سحب إلغاء استعادة سجل هو جديد occurrence([Tab مجال](../../packages/client/ui-sidebar-right/README.zh.md#the-tab-domain)).

## وثيقة مصير

`text` tab هو مشترك Document Preview كل من. ذلك[أصل تسجيل](../../packages/client/ui-sidebar-documentpreview/src/client/index.ts) إعلان `sidebar.right.tab.document` و توفير `ctx.documentPreviews`. مصير في ذاتي ذات effect في تسجيل `DocumentPreviewDefinition` بيانات وصفية، مجددا عبر `ctx.slots.inject('sidebar.right.tab.document', ...)` انتظار slot، بـ `key: definition.id` و ذاتي ذات locale نطاق الأسماء تسجيل مكون. مصير تسجيل ذاتي ذات متن، و يمكن عبر فرعي slot إعادة استخدام مشترك عرض مكون. تبديل مصير لا تغيير tab أو مورد عنوان؛[توسيع قرار اقتراح](../../.agents/notes/implemented/architecture/2026-09-08-document-preview-operations.zh.md) سوف معاينة سياسة و مورد ملكية قسم فتح.

[سجل التسجيل](../../packages/client/ui-sidebar-documentpreview/src/client/document/registry.ts) سجل وحيد `id`،`extensions`، محلي تحويل `title()`،`loading`، و اختياري `priority` و `wrap`. بعد لاحقة مطابقة لا منطقة قسم كبير صغير كتابة، أولا ترتيب `extension`(نقص حذف قيمة) ، مجددا ترتيب `builtin`، مع بعد مقارنة مقارنة بعد لاحقة طويل درجة (طويل من أولوية) و تسجيل ترتيب. و tab kind استبدال مختلف، سجل التسجيل إبقاء كل تنفيذ؛ أداة شريط صف خروج مطابقة مرشح، حسب tab تسجيل إقامة اختيار. لم معرفة توسيع اسم استخدام صاف نص.`binaryExtensions` إعلان بعد لاحقة لا توفير صاف نص تجهيز اختيار، رؤية[حزمة README](../../packages/client/ui-sidebar-documentpreview/README.zh.md#what-it-registers).`loading` لـ `text-pages`،`bytes-complete` أو `renderer`؛`wrap` إعلان هل دعم حمل مشترك شفرة المصدر تبديل سطر تحكم عنصر.

[`DocumentPreviewProps`](../../packages/client/ui-sidebar-documentpreview/src/client/document/contract.ts) إرسال توليد ذاتي `PropsRuntime<'sidebar.right.tab.document'>`.owner توفير أصلي `resourceAddress`،`content` و حالي `wrap`: نص محتوى لـ `{ kind: 'text', text, pages: [{ offset, text, lines }], eof }`، منها `text` لـ تراكم تراكم نص؛ كامل بايت لـ `{ kind: 'bytes', data }`، منها `data` لـ `Uint8Array<ArrayBuffer>`. هذه لحظة وقت مؤقت اندفاع منطقة حسب فقط قراءة طريقة استعارة استخدام، لا نيل دخول حمل دائم تخطيط أو Session JSON.PDF في تحويل نقل إلى Worker قبل نسخ بايت، بـ إبقاء owner مؤقت اندفاع منطقة. فرعي مكون استلام إلى نفس عدد إطار هيكل ربط `useTabInfo`، و عام مشترك، فقط توفير بيانات وصفية `useResource`. أب مكون عبر عادي inject عودة ضبط استدعاء `remote.workspaceFiles.read`/`readAll`، يملك إلحاق قسم صفحة، تدريجي tab تحديث جديد و تحميل حالة.HTML ذاتي ذات inject عودة ضبط استخدام `readRelated`؛ مسار من Host شفرة تحليل.Markdown و شفرة في إلحاق خلال إبقاء نفس عدد زيادة كمية مصير، إلى EOF إتمام نهائي تحليل؛HTML و PDF استقبال كامل بايت.

Preview سجل قد تحميل دخول إصدار و قراءة بدء وقت مراقبة إصدار. تحديث جديد فقط إعادة قراءة حالي tab، لا تغيير مشترك بيانات وصفية أو أخرى tab محتوى. قراءة لا أداة تجهيز أمر خدمة صفة؛ إصدار هو لا نفاذ واضح متبادل انتظار صفة أمر لوحة، لا هو يمكن ترتيب ترتيب ختم الوقت ([مورد مراقبة و Preview RPC](../../.agents/notes/implemented/architecture/2026-09-08-document-preview-operations.zh.md)).

ذاتي سطر تحميل مصير استقبال `{ kind: 'renderer', revision, loaded, reload }`، بينما لا هو ملف بايت. متن عبر ذاتي ذات حقن عودة ضبط تحميل، في revision تغير و إزالة وقت إلغاء طلب، و عبر `loaded(version)` تقرير إبلاغ قد عرض مصدر إصدار. أب مكون تجاهل اختصار مرور مدة تقرير إبلاغ، إبقاء مشترك إعادة تحميل و مصدر ملف تغيير تحكم عنصر.Office استخدام هذا نمط طلب [Host تصيير PDF](office-to-pdf.zh.md) ؛ ذاتي ذات store و محدود ذاكرة مؤقتة إبقاء تحويل بايت، متن في تضمين طقم PDF عرض فوق جهة إدارة حرف جسم تلميح.[حزمة README](../../packages/client/ui-sidebar-documentpreview/README.zh.md#what-it-registers) تعريف تحميل دورة الحياة.

## مورد نموذج

نموذج ذاته رؤية[عميل مورد](client-resources.zh.md) ؛ هذا عقدة فقط كتابة Sidebar اعتماد جزء. واحد نسخة مورد هو واحد عنوان، مورد عنوان هو `dsh-resource://<type>/…` شكل صيغة URL، صغير كتابة host أي بروتوكول مفتاح. بروتوكول الذي تابع عميل حزمة استخدام `ctx.resources.register(provider)` في ذاته دورة الحياة داخل تسجيل وحيد مزود؛ نفس بروتوكول ثاني عدد مزود رمي خطأ ([توفير بروتوكول](../../packages/client/resources/README.zh.md#provide-a-protocol)). مزود هو `{ protocol, open(address, { signal }) }`:`open` إنتاج خروج `RemoteResult` لقطة——أول لقطة هو حالي حالة، بعد كل مرة تغير واحد لقطة——و في `signal` في توقف وقت توقف تحت؛ فشل هو `{ ok: false, error }` لقطة بينما لا هو رمي خطأ، تدفق داخل رمي خروج شرق غرب هو تحرير مسار خطأ، نموذج لا التقاط.

`useResource<P>(address)` هو كل slot مكون كل لديه عام معيار prop، لا نقاش أثر مجال. هو إرجاع `{ status, value, failure }`: عنوان بروتوكول لا يوجد مزود أو عنوان لا هو مورد عنوان (`sidebar://guide` لا إشارة نحو مورد) وقت لـ `none`، أول لقطة قبل لـ `loading`،`live` يحمل الأكثر جديد `ok` قيمة،`failed` في الأكثر بعد واحد قيمة جانب يحمل الأكثر جديد لقطة فشل.([قراءة مورد](../../packages/client/resources/README.zh.md#read-a-resource)).

مورد لديه يحتفظ من حينئذ إبقاء فتح——حجز قراءة في `useResource` أو مرة `ctx.resources.pin(address, signal)`؛ رقم واحد يحتفظ من فتح مزود تدفق، بعد يحتفظ من مشترك هو و قيام لحظة قراءة إلى الأكثر جديد قيمة، الأكثر بعد واحد تحرير وقت في توقف تدفق و إسقاط قيمة. تدفق فقط دفع بيانات وصفية لا دفع محتوى:`file` قيمة هو `{ absolutePath, version, bytes? }`، مستهلك ذاتي ذات مرور Workspace Files خدمة حسب صفحة قراءة ملف نص ([دورة الحياة](../../packages/client/resources/README.zh.md#lifecycle)).

## Workspace Files

Host `ctx.workspaceFiles` خدمة و توليد `workspaceFiles` Remote نطاق الأسماء قراءة Session نظام الملفات خلفية سماح ملف:`stat(path)` إرجاع `{ absolutePath, version, bytes? }`؛`read(path, { offset?, limit? })` إرجاع واحد صفحة سطر (`offset` 1 بدء،`limit` تلقي إعداد صفحة طويل حد) ، شكل مثل `{ …stat, offset, text, eof }`؛`readBytes(path, { offset?, length? })` إرجاع واحد أصلي بايت نافذة (`offset` 0 بدء،`length` تلقي إعداد بايت حد أعلى حد) ، شكل مثل base64 `{ …stat, offset, data, eof }`، لا فعل نص حل رمز.`list(path)` ما زال حد تحديد في مساحة العمل أصل داخل، إرجاع دليل مباشر فرعي بند (`name`،`type: 'file' | 'directory' | 'other'`،`size?`) ، حسب إعداد حد أعلى قطع قطع و وضع `truncated`.`changes()` نفس مثال حد تحديد في مساحة العمل، حجز قراءة حينئذ خيط بعد إنتاج خروج `{ kind: 'ready' }`، مع بعد إنتاج خروج `{ kind: 'change', change }` لقطة، ذلك تحميل حمل لـ `{ absolutePath, version }` أو `{ absolutePath, absent: true }`([README](../../packages/api/workspace-files/README.zh.md#use-this-package)). ملف عملية رفض نهاية طرف رمز رقم رابط و تنفيذ نقل حد أعلى؛`read` أيضا اشتراط UTF-8 نص. فشل استخدام `workspace-file/*` رمز خطأ ([فشل](../../packages/api/workspace-files/README.zh.md)).

[`dsh-api-workspace-files`](../../packages/api/workspace-files/README.zh.md) تسجيل `file` مزود،`ResourceProtocolMap.file` مباشر هو `WorkspaceFileStat`.Session عنوان يحمل تخويل Session و متبادل مقابل أو قطعا مقابل مسار،Host أصل مثال استقبال و تحليل. مزود في stat قبل انتظار Host `ready` لقطة، و حسب `stat.absolutePath` مرور ترشيح تغيير. عار `absolute` عنوان لا يوجد تخويل Session، بـ `workspace-file/unknown-workspace` فشل، لا استعارة استخدام حالي أو Tab Session. أي UI(يشمل Global) وصول نفس كامل عنوان كل مشترك مراقبة.Preview عادي Remote عودة ضبط استخدام عنوان في Session؛Host `readAll` و `readRelated` إبقاء، بايت نتيجة من Preview `rpc.ts` حل رمز.

## داخل وضع نوع

- **`guide`**——`builtin`، بـ `openTab('guide')` فتح. واحد قطعة ضعيف تحويل روا قرص يقع في كل نوع حسب `order` مساهمة مدخل لاصق كيس فوق جهة؛ مدخل مقارنة قليل وقت عرض قد تسجيل وصف، لم توفير رسم علامة مدخل موحد واحد استخدام داخل وضع احتلال موضع رمز. نقطة اختيار لاصق كيس أي في جذب توجيه tab موضع يأخذ مساهمة هو نوع بصفة صفحة فتح. كل pane الأكثر كثير واحد جذب توجيه tab،tab بند إضافة جديدة تحكم عنصر فقط في هذا pane لا يوجد جذب توجيه وقت ظهور. جديد pane استخدام قد تسجيل افتراضي صفحة: فقط لديه واحد جذب استيراد فتحة وقت مباشر استخدام هذا مدخل، لا فإن استخدام جذب توجيه صفحة ([جذب توجيه](../../packages/client/ui-sidebar-right/README.zh.md#the-guide)).
- **`text`**——`fallback`،`dsh-resource://file/**`، فقط إقرار قيادة Session عنوان.Document Preview عبر `useResource<'file'>` مراقبة بيانات وصفية، مرور Remote عودة ضبط تحميل محتوى، و يملك مصير اختيار، أداة شريط، تدريجي tab تحديث جديد، تمرير و شفرة المصدر تحديد موضع؛ لم معرفة توسيع اسم حسب صاف نص تصيير ([README](../../packages/client/ui-sidebar-documentpreview/README.zh.md)).
- **`files`**——`builtin`، بـ `openTab('files')` فتح. مساحة العمل دليل شجرة، مرور `list` كسول تحميل، استخدام `tab.actions.openResource(fileAddressFor(sessionId, root, path))` في ذاتي ذات الذي في pane فتح ملف ([README](../../packages/client/ui-sidebar-files/README.zh.md)).
- **`browser`**——يمكن كثير فتح `builtin`، بـ `openTab('browser', { params: { url? } })` فتح.Assistant Markdown سوف يأخذ HTTP(S) رابط تفويض حمل إعطاء هذا صفحة نوع. هو في افتراضي sandbox تحت قبول عام مشترك و loopback HTTP(S) هدف، محلي ملف تعديل استخدام Document Preview، و استخدام تطبيق معروف iframe history([README](../../packages/client/ui-sidebar-browser/README.zh.md)).
- **`subagentchat`**——`builtin`،`dsh-resource://subagentchat/session/<child>?parent=<parent>&mode=<mode>`. مورد مزود إبقاء واحد صريح بحث عنوان subagent Conversation، و عبر مشترك Conversation Factory تصيير ([README](../../packages/client/ui-subagent/README.zh.md)).

<a id="not-built"></a>
## لا فعل

- حفظ دائم: تخطيط حالة فقط في داخل تخزين داخل؛ تحديث جديد بعد كل جلسة من طي بدء، أي جلسة tab كل لن ظهور في آخر عدد جلسة داخل.
- `ctx.sidebarRight` فوق فقط قراءة تخطيط لقطة أو حجز قراءة: خدمة فقط كشف عملية،dockkit `LayoutState`/`LayoutOp` هو داخلي.
- خدمة فوق قدرة استكشاف قياس عدد مجموعة (`features`).
- tab نوع `option` أولوية درجة ملف: لا يوجد «فقط صف خروج، لا سماح إقرار قيادة» tab نوع.
- تعديل كتابة سجل عنوان:`title(address)` فقط التقاط مرة؛ نشط chip قدوم ذاتي عنوان slot، بينما لا هو سجل.
- فتح وقت نقطة اسم بعض عدد tab تنفيذ:`openResource` الأكثر كثير نقطة اسم واحد kind؛ وثيقة مصير من ملف tab أداة شريط اختيار.
- خدمة فوق عنوان فحص بحث (`find`): استدعاء جهة استخدام `revealIfOpened` فتح، من توقف اعتماد وجه ذهاب إعادة.
- Sidebar ذاته `sidebar://<kind>` تسجيل حساب خارج تنقل عنوان؛ ذلك لغة قاعدة انتظار تنقل تحكم جهاز كامل جسم فعل وقت مجددا تحديد.
- موجه إلى مستخدم سحب إلغاء و عبر نوع عام محتوى تنقل مكدس ([مؤقت مؤقت](../../.agents/notes/implemented/feature/2026-09-04-right-sidebar-docking-infrastructure.zh.md#deferred)) ؛Browser فقط يملك ذاته صفحة تاريخ.

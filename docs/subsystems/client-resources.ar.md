# عميل مورد

[English](client-resources.md) | العربية

عميل مورد نموذج يأخذ واحد عنوان تغيير صار أي Web Client مكون كل قدرة قراءة نشط بيانات.[`dsh-client-resources`](../../packages/client/resources/README.ar.md) توفير `ctx.resources` خدمة و `useResource` عام معيار hook؛ يملك بعض صنف محتوى حزمة لـ هو**بروتوكول**تسجيل واحد**مزود**، مكون حسب**عنوان**قراءة هذا محتوى حالي حالة، بينما بلا حاجة مرجع يملك من وقت التشغيل. يمين جانب Sidebar tab هو هذا عدد نموذج رقم واحد مستهلك ([يمين جانب Sidebar](sidebar-right.ar.md)) ؛ قرار سجل رؤية [عميل مورد نموذج Agent Note](../../.agents/notes/implemented/architecture/2026-09-05-client-resource-model.ar.md).

هذا صفحة هو موجه إلى تطوير من مشاركة اعتبار: عنوان كيف ما كتابة، مزود كيف ما تسجيل، مورد كيف ما قراءة، حالة و فشل كل هو ماذا معنى تفكير، نموذج كيف مثال يحتفظ و تحرير واحد نسخة مورد.

## عنوان

مورد عنوان هو `dsh-resource://<type>/…` شكل صيغة URL.host تسمية بروتوكول، يجب هو `ResourceProtocolMap` مفتاح؛ مسار عودة بروتوكول ذاتي ذات، من ذلك يملك من تدريجي مقطع فعل مئة قسم رقم تحرير رمز. حاجة أثر مجال بروتوكول يأخذ أثر مجال وضع دخول مسار:`file` بروتوكول عنوان شكل مثل `dsh-resource://file/session/<sessionId>/<path>`، منها path يمكن متبادل مقابل مساحة العمل أصل، أيضا يمكن هو إبقاء قبل توجيه مائل عمود قطعا مقابل مسار، استخدام [`dsh-util-workspace-path`](../../packages/util/workspace-path/README.ar.md) `fileAddressFor(sessionId, cwd, path)` بنية صنع،`parseFileAddress(address)` قراءة عودة. نموذج ذاته فقط قراءة scheme و host:`protocolOf(address)` مقابل `dsh-resource://` URL إرجاع صغير كتابة host، مقابل ذلك هو أي حرف سلسلة إرجاع `undefined`. ذلك هو scheme تحت عنوان——Sidebar `sidebar://guide`——لا إشارة نحو مورد، قراءة عمل `none`.

| عنوان | بروتوكول مفتاح | قراءة عمل |
|---|---|---|
| `dsh-resource://file/session/s1/notes/a.md` | `file` | جلسة `s1` مساحة العمل أصل تحت `notes/a.md` بيانات وصفية (`file` مزود قد تسجيل وقت) |
| `dsh-resource://file/absolute/home/me/notes.md` | `file` | يمكن تحليل، لكن لا يوجد تخويل Session، بـ `workspace-file/unknown-workspace` فشل؛ لا استعارة استخدام حالي أو Tab Session |
| `DSH-RESOURCE://File/session/s1/a` | `file` | آخر نسخة سجل: عنوان حسب نص مقارنة مقارنة،`openResource` فقط قبول `fileAddressFor` توليد مواصفة صغير كتابة تجميع كتابة |
| `dsh-resource://subagentchat/session/c1?parent=p1&mode=continuable` | `subagentchat` | قد بحث عنوان subagent Conversation؛ ذلك قيمة يحتفظ واحد `SessionReference`، مباشر إلى مورد إغلاق |
| `sidebar://guide` | — | `none`: تنقل عنوان |
| `/home/me/notes.md` | — | `none`: لا هو URL |

## تسجيل مزود

بروتوكول يملك من في `ResourceProtocolMap` فوق إعلان ذلك قيمة نوع، و في ذاتي ذات `ctx.effect` داخل تسجيل واحد مزود، جعل بروتوكول و إضافة نفس عمر ([توفير بروتوكول](../../packages/client/resources/README.ar.md#provide-a-protocol)).`open(address, { signal })` إرجاع واحد بند `RemoteResult` لقطة تدفق——أول لقطة هو حالي حالة، بعد كل مرة تغير واحد لقطة——و كما يجب في `signal` في توقف وقت توقف تحت. فشل هو يحمل `RemoteFailure` `ok: false` لقطة؛ تدفق داخل رمي خروج هو تحرير مسار خطأ، لن يتم التقاط.

```ts ignore-check
import type { Context } from '@deepseek-ai/cordis'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type {} from '@deepseek-ai/dsh-client-resources/client'

interface NoteView { readonly title: string; readonly updatedAt: string }

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface ResourceProtocolMap { note: NoteView }
}

export const inject = ['resources', 'remote']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.resources.register<'note'>({
    protocol: 'note',
    async *open(address, { signal }): AsyncIterable<RemoteResult<NoteView>> {
      const id = new URL(address).pathname.slice(1)
      yield await ctx.remote.notes.read(id, signal)
      for await (const change of ctx.remote.notes.follow(id, signal)) yield change
    },
  }), 'my-notes: note resource provider')
}
```

واحد بروتوكول تماما لديه واحد مزود؛ ثاني مرة تسجيل رمي خطأ. تسجيل وقت إذا هذا بروتوكول عنوان قد يتم يحتفظ، فإن قيام لحظة فتح هو جمع تدفق؛ مزود dispose وقت انتهاء هذه تدفق، عنوان قراءة عمل `none` مباشر إلى مزود عودة قدوم.

## قراءة مورد

كل slot مكون لا نقاش أثر مجال كل في props فوق استلام إلى `useResource`([Slots](slots.ar.md)).`useResource<P>(address)` بـ نوع معامل تسمية بروتوكول، إرجاع هذا عنوان حالي لقطة؛ حجز قراءة حينئذ هو يحتفظ مورد طريقة، آخر عدد يحتفظ من يجعل مورد تخزين نشط وقت، جديد تركيب مكون قيام لحظة قراءة إلى الأكثر جديد قيمة بينما لا إعادة فتح تدفق ([قراءة مورد](../../packages/client/resources/README.ar.md#read-a-resource)).

| `status` | يحتوي معنى | `value` | `failure` |
|---|---|---|---|
| `none` | عنوان بروتوكول لا يوجد تسجيل مزود، أو عنوان لا هو مورد عنوان | `undefined` | `undefined` |
| `loading` | مزود تدفق قد فتح، بعد لم إنتاج خروج | `undefined` | `undefined` |
| `live` | الأكثر جديد واحد لقطة نجاح | الأكثر جديد `ok` قيمة | `undefined` |
| `failed` | الأكثر جديد واحد لقطة تقرير إبلاغ فشل | إبقاء فوق واحد `ok` قيمة | هذا لقطة `RemoteFailure` |

```tsx ignore-check
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-api-workspace-files/client'

type Props = PropsRuntime<'sidebar.right.pane.tab'>

export function FileHeader({ useTabInfo, useResource, t }: Props) {
  const { tab } = useTabInfo()
  const meta = useResource<'file'>(tab.contentId)
  if (meta.status === 'failed') return <p role="alert">{t('failed', { code: meta.failure.code })}</p>
  return (
    <header>
      {tab.title}
    </header>
  )
}
```

`failed` من مستهلك ذاتي ذات عرض: نموذج يأخذ الأكثر بعد واحد قيمة إبقاء في فشل جانب، متن يمكن حمل تلميح عرض قديم محتوى بينما لا هو واحد قطعة فارغ أبيض، تحت واحد `ok` لقطة سوف صاف حذف فشل. نموذج ذاته لا إنتاج أي مستخدم مرئي نص سجل.

## يحتفظ و تحرير

مورد لديه يحتفظ من حينئذ تخزين نشط: واحد حجز قراءة في `useResource`، أو مرة تثبيت إقامة.`ctx.resources.pin(address, signal)` في لا حجز قراءة حال حال تحت يجعل مورد إبقاء فتح مباشر إلى `signal` في توقف، قد في توقف إشارة ماذا أيضا لا تثبيت؛ يمين جانب Sidebar في كل بند فتح tab سجل تخزين متابعة مدة داخل تثبيت إقامة ذلك عنوان، لذلك قطع tab إزالة متن لا صلة تدفق. رقم واحد يحتفظ من فتح مزود تدفق؛ الأكثر بعد واحد تحرير وقت في توقف هو، إسقاط قيمة، و يأخذ لقطة عودة إلى `loading`(لديه مزود) أو `none`(لا يوجد). مزود في هذا مرة تحرير بعد إنتاج خروج لقطة يتم إسقاط، مكرر يتم عودة أيضا.`ctx.resources.source(address)` هو hook خلف بعد عار observable، حسب عنوان مرجع مستقر، توفير React خارج استدعاء جهة استخدام؛ فقط قراءة هو لقطة لا حساب يحتفظ ([دورة الحياة](../../packages/client/resources/README.ar.md#lifecycle)).

كثير عدد تدفق فقط دفع بيانات وصفية بينما لا دفع محتوى.`file` مزود قيمة هو `WorkspaceFileStat { absolutePath, version, bytes? }`: أول لقطة قدوم ذاتي Host `stat`، لاحق مراقبة تحديث إصدار. مستهلك ذاتي ذات مرور Workspace Files Remote نطاق الأسماء قراءة محتوى؛Preview حسب tab مستقل تحديث جديد ([`dsh-api-workspace-files`](../../packages/api/workspace-files/README.ar.md)).`subagentchat` مزود إبقاء قد بحث عنوان Session و إنتاج خروج ذلك `SessionReference`، في مورد signal في توقف وقت تحرير هذا reference.

## حد

سجل في صفحة تخزين متابعة مدة داخل إبقاء: عنوان سجل في الأكثر بعد واحد يحتفظ من مغادرة فتح بعد ما زال إبقاء حال، لا يحتفظ تدفق أيضا لا يحتفظ قيمة، لذلك داخل تخزين مع قراءة مرور مختلف عنوان عدد زيادة طويل. تجاهل اختصار `signal` مزود سوف واحد مباشر ركض إلى هو تحت واحد لقطة. فشل نوع هو Remote وجه `RemoteFailure`، مصدر لا هو Remote استدعاء مزود نيل ذاتي ذات صب واحد. تجميع خطأ بروتوكول أو شاذ شكل عنوان قراءة عمل `none`، لا يوجد آخر تشخيص.

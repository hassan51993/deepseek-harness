# موارد العميل

[English](client-resources.md) | العربية

يحوّل نموذجُ موارد العميل عنوانًا إلى بيانات حية لأي مكوّن في عميل Web. وتقدّم [`dsh-client-resources`](../../packages/client/resources/README.ar.md) خدمةَ `ctx.resources` والخطّافَ القياسي العام `useResource`؛ وتسجّل الحزمةُ التي تملك صنفًا من المحتوى **مزوّدًا** واحدًا لـ**بروتوكولها**، ويقرأ المكوّنُ الحالةَ الراهنة للمحتوى بـ**العنوان** بلا استيراد بيئة تشغيل المالك. وألسنةُ الشريط الجانبي الأيمن هي أولُ مستهلك للنموذج ([الشريط الجانبي الأيمن](sidebar-right.ar.md))؛ وسجلُّ القرار هو [ملاحظة الوكيل عن نموذج موارد العميل](../../.agents/notes/implemented/architecture/2026-09-05-client-resource-model.ar.md).

وهذه الصفحةُ مرجعُ المطوّر: كيف يُكتب العنوان، وكيف يُسجَّل المزوّد، وكيف يُقرأ المورد، وما معنى الحالات والإخفاقات، وكيف يمسك النموذجُ موردًا ويحرّره.

## العناوين

عنوانُ المورد رابطٌ بالصيغة `dsh-resource://<type>/…`. ويسمّي المضيفُ البروتوكولَ ويجب أن يكون مفتاحًا في `ResourceProtocolMap`؛ والمسارُ مسارُ البروتوكول نفسِه، ويرمّز مالكُه كلَّ مقطع بالنسبة المئوية. والبروتوكولُ الذي يحتاج إلى نطاق يضعه في المسار: فعناوينُ بروتوكول `file` تُقرأ `dsh-resource://file/session/<sessionId>/<path>`، حيث المسارُ نسبيٌّ إلى مساحة العمل أو مطلق مع حفظ الخطوط المائلة في صدره، ويُبنى بـ`fileAddressFor(sessionId, cwd, path)` ويُقرأ ثانيةً بـ`parseFileAddress(address)` من [`dsh-util-workspace-path`](../../packages/util/workspace-path/README.ar.md). ولا يقرأ النموذجُ نفسُه إلا المخطط والمضيف: فـ`protocolOf(address)` يعيد مضيفَ رابط `dsh-resource://` بحروف صغيرة، ويعيد `undefined` لما عداه. والعناوينُ تحت أي مخطط آخر — مثل `sidebar://guide` في الشريط الجانبي — لا تسمّي موردًا وتُقرأ `none`.

| العنوان | مفتاح البروتوكول | يُقرأ بوصفه |
|---|---|---|
| `dsh-resource://file/session/s1/notes/a.md` | `file` | البياناتُ الوصفية لـ`notes/a.md` تحت جذر مساحة عمل الجلسة `s1`، حين يكون مزوّدُ `file` مسجَّلًا |
| `dsh-resource://file/absolute/home/me/notes.md` | `file` | قابلٌ للتحليل لكنه يفشل بـ`workspace-file/unknown-workspace`: لا جلسةَ تخوّله، ولا تُستعار جلسةٌ حالية ولا جلسةُ لسان |
| `DSH-RESOURCE://File/session/s1/a` | `file` | سجلٌّ متمايز: فالعناوينُ تُقارن سلاسلَ، ولا يقبل `openResource` إلا الهجاءَ المعياري بحروف صغيرة الذي يُصدره `fileAddressFor` |
| `dsh-resource://subagentchat/session/c1?parent=p1&mode=continuable` | `subagentchat` | محادثةُ وكيل فرعي معنونة تملك قيمتُها `SessionReference` حتى يُغلق المورد |
| `sidebar://guide` | — | `none`: عنوانُ تنقّل |
| `/home/me/notes.md` | — | `none`: ليس رابطًا |

## تسجيل مزوّد

يعلن مالكُ البروتوكول نوعَ قيمته على `ResourceProtocolMap` ويسجّل مزوّدًا واحدًا داخل `ctx.effect` الخاص به، فيعيش البروتوكولُ بقدر عمر الإضافة بالضبط ([قدّم بروتوكولًا](../../packages/client/resources/README.ar.md#provide-a-protocol)). ويعيد `open(address, { signal })` مجرى إطارات `RemoteResult` — الحالةُ الراهنة أولًا، ثم إطارٌ لكل تغيير — وعليه أن يتوقف حين تُجهَض `signal`. والإخفاقُ إطارُ `ok: false` يحمل `RemoteFailure`؛ أما الرميُ داخل المجرى فخطأٌ برمجي ولا يُلتقط.

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

وللبروتوكول مزوّدٌ واحد بالضبط؛ والتسجيلُ الثاني يرمي. والتسجيلُ بينما عناوينُ البروتوكول ممسوكةٌ سلفًا يفتح مجاريها فورًا؛ والتخلصُ من المزوّد يُنهي تلك المجاري وتُقرأ العناوينُ `none` حتى يعود مزوّد.

## قراءة مورد

يتلقى كلُّ مكوّن خانة الخطّافَ `useResource` في خصائصه، كائنًا ما كان نطاقُه ([الخانات](slots.ar.md)). ويسمّي `useResource<P>(address)` البروتوكولَ وسيطَ نوع ويعيد لقطةَ العنوان الراهنة؛ والاشتراكُ هو ما يُبقي الموردَ مفتوحًا، والمكوّنُ الذي يُركَّب بينما يُبقي ماسكٌ آخر الموردَ حيًّا يقرأ أحدثَ قيمة فورًا بلا إعادة فتح المجرى ([اقرأ موردًا](../../packages/client/resources/README.ar.md#read-a-resource)).

| `status` | المعنى | `value` | `failure` |
|---|---|---|---|
| `none` | لا مزوّدَ مسجَّلًا لبروتوكول العنوان، أو العنوانُ ليس عنوانَ مورد | `undefined` | `undefined` |
| `loading` | مجرى المزوّد مفتوحٌ ولم يُنتج شيئًا بعد | `undefined` | `undefined` |
| `live` | نجح أحدثُ إطار | أحدثُ قيمة `ok` | `undefined` |
| `failed` | بلّغ أحدثُ إطار عن إخفاق | آخرُ قيمة `ok`، محفوظة | قيمةُ `RemoteFailure` في الإطار |

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

ويعرض المستهلكُ حالةَ `failed` بنفسه: فالنموذجُ يُبقي آخرَ قيمة بجوار الإخفاق ليستطيع متنٌ عرضَ محتوى قديم مع إشعار بدل فراغ، ويمسح إطارُ `ok` التالي الإخفاقَ. ولا شيءَ في النموذج يُنتج نصًّا يراه المستخدم.

## المسك والتحرير

يبقى الموردُ حيًّا ما دام له ماسك: `useResource` مشترِك، أو تثبيت. ويُبقي `ctx.resources.pin(address, signal)` الموردَ مفتوحًا بلا اشتراك حتى تُجهَض `signal`، والإشارةُ المجهَضة سلفًا لا تثبّت شيئًا؛ ويثبّت الشريطُ الجانبي الأيمن عنوانَ كل سجل لسان مفتوح طوال عمر السجل، فتبديلُ الألسنة يفكّ تركيبَ متن بلا إغلاق مجراه. ويفتح أولُ ماسك مجرى المزوّد؛ ويُجهضه آخرُ تحرير ويُهمل القيمةَ ويعيد اللقطةَ إلى `loading` (بوجود مزوّد) أو `none` (بغيابه). ويُسقَط أيُّ إطار يُنتجه المزوّدُ بعد ذلك التحرير، ويُعاد المكرِّر. و`ctx.resources.source(address)` هو المرصودُ المجرد خلف الخطّاف، ثابتُ المرجع لكل عنوان، للمستدعين خارج React؛ وقراءةُ لقطته لا تمسك المورد ([دورة الحياة](../../packages/client/resources/README.ar.md#lifecycle)).

ومعظمُ المجاري تحمل بياناتٍ وصفية لا محتوى. وقيمةُ مزوّد `file` هي `WorkspaceFileStat { absolutePath, version, bytes? }`: فالإطارُ الأول من `stat` في المضيف، وتحدّث المراقباتُ اللاحقة الإصدارَ. ويقرأ المستهلكُ المحتوى عبر فضاء أسماء Remote لملفات مساحة العمل؛ وتملك المعاينةُ التحديثَ مستقلةً لكل لسان ([`dsh-api-workspace-files`](../../packages/api/workspace-files/README.ar.md)). ويحتفظ مزوّدُ `subagentchat` بالجلسة المعنونة وينتج `SessionReference` الخاص بها، ثم يحرّر ذلك المرجعَ حين تُجهَض إشارةُ المورد.

## الحدود

تعيش السجلاتُ طوال عمر الصفحة: فسجلُّ العنوان يبقى بعد رحيل آخر ماسك له، بلا مجرى وبلا قيمة، فتنمو الذاكرةُ بعدد العناوين المتمايزة التي قُرئت يومًا. والمزوّدُ الذي يتجاهل `signal` يبقى يعمل حتى إطاره التالي. ونوعُ الإخفاق هو `RemoteFailure` من واجهة Remote، فالمزوّدُ الذي ليس مصدرُه نداءَ Remote يسكّ واحدًا. والبروتوكولُ المكتوب خطأً أو العنوانُ المشوَّه يُقرأ `none` بلا تشخيص آخر.

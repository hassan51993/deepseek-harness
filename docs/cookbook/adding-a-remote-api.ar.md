# دليل عملي: إضافة واجهة Remote

[English](adding-a-remote-api.md) | العربية

إضافةُ نقطة نهاية في `ctx.remote` أو تغييرُها تأخذ الخطوات الخمس في هذه الصفحة: أعلن الطريقة، وأعلن أعطالها، وسجّلها على الحزمة، واستهلكها في الـ Client، واختبرها. أما دلالةُ المزخرِفات وتحليلُ lookup وخطُّ التوليد والمسار `/api` فهي الآلية، وتخص [مرجع بوابة API](../api-gateway.ar.md)؛ وهذه الصفحة تعطي الفعلَ في كل خطوة والأعرافَ التي عليه استيفاؤها. ولماذا تبدو واجهةُ البرمجة هكذا في [Agent Note عن استدعاءات طرق Typert Remote](../../.agents/notes/implemented/architecture/2026-08-02-typert-remote-method-calls.ar.md)، ولماذا العطلُ صنفُ `RemoteError` واحد مع جدول رموز في [Agent Note عن مفردات الأعطال](../../.agents/notes/implemented/architecture/2026-08-28-ctx-remote-failure-vocabulary.ar.md).

## 1. أعلن الواجهة

المالك خدمةُ Cordis على جانب Host: وسّع `TypertRemoteService` ليُربط مفتاحُ الخدمة وفضاءُ أسماء السلك معًا، ثم سِم الطرقَ المكشوفة بـ `@Remote`. وسِم طريقةَ الأعمال نفسها حين يستوفي توقيعُها أعرافَ السلك أصلًا؛ ولا تكتب مهايئ `remoteExport*` إلا حين يجب أن تتغيّر الصيغة (بإضافة `signal`، أو إعادة ترتيب المعاملات، أو تصدير اسم آخر)، ودَع ذلك المهايئ يستدعي طريقةَ الأعمال بلا إعادة تسميتها. وكائناتُ lookup (`Agent` و`Session`) لا تشغل إلا مواضعَ معاملات في المستوى الأعلى، والطريقةُ التي تدعم الإلغاء التعاوني تأخذ `signal: AbortSignal` معاملًا أخيرًا.

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'

/** One stored note as a Client reads it. */
export interface NoteRow {
  readonly noteId: string
  readonly title: string
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    notesController: NotesController
  }
}

export class NotesController extends TypertRemoteService {
  constructor(ctx: Context) {
    super(ctx, 'notesController', { namespace: 'notes' })
  }

  /**
   * @param agent - lookup parameter the Gateway resolves from its wire identity.
   * @param signal - carrier cancellation, always the final parameter.
   * @returns the notes this Agent's session owns.
   */
  @Remote('list')
  async remoteExportList(agent: Agent, signal: AbortSignal): Promise<NoteRow[]> {
    return await this.list(agent, signal)
  }

  /** The in-process API the adapter above delegates to, unchanged by it. */
  async list(agent: Agent, signal: AbortSignal): Promise<NoteRow[]> {
    signal.throwIfAborted()
    return await Promise.resolve([{ noteId: `${agent.id}-1`, title: 'draft' }])
  }
}
```

## 2. أعلن الأعطال

عطلُ Remote صنفٌ واحد هو `RemoteError`: ادمج رموزَ المجال في `RemoteErrorDetailsMap` بدمج التصريحات، وارمِ `new RemoteError(code, message, details)` عند موضع العطل. ولا تبنِ عائلةَ أصناف أخطاء للمجال، ولا تكتب دالةَ ربط للخروج؛ فالاستثناء غير المتصل بنقطة النهاية هذه لا يُصنَّف مسبقًا، لأن البوابة تطويه في `gateway/internal`. ولا تكتب `catch` إلا لتصنّف استثناءَ مزوّد اعتباطيًا رمزَ مجال واحدًا، وألحِق الاستثناء الأصلي بـ `cause`.

ويُقرأ الرمز `<domain>/<reason>`، ولتصريحه أربع قواعد موضع:

- منتجٌ واحد فقط: أعلنه في الحزمة المنتِجة بجوار الرمي.
- عدة حزم تنتجه: أعلنه في أدنى حزمة مجال تعتمد عليها الحزمتان (`session/not-found` في `core/session`، و`workspace/not-found` في `dsh-workspace`).
- رموزُ الحامل `gateway/bad-request` و`gateway/cancelled` و`gateway/internal` مُعلَنة في protocol، ورموزُ بنية البوابة التحتية في gateway؛ فاستعملها ولا تنسخها أبدًا.
- والعطلُ المحلي الذي لا يعبر السلك قط يبقى خارج جدول الرموز؛ فعبّر عنه بنوع المستدعي هو.

```ts
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol'

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    /** No stored note carries that id. */
    'note/not-found': { readonly noteId: string }
    /** The store refused an otherwise valid write. */
    'note/rejected': { readonly noteId: string }
  }
}

declare const stored: ReadonlyMap<string, string>
declare function persist(noteId: string, title: string): Promise<void>

export async function rename(noteId: string, title: string): Promise<void> {
  if (!stored.has(noteId)) {
    throw new RemoteError('note/not-found', `no note "${noteId}"`, { noteId })
  }
  try {
    await persist(noteId, title)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    throw new RemoteError('note/rejected', message, { noteId }, { cause: error })
  }
}
```

## 3. سجّلها على الحزمة

يجب أن تسكن `@Remote` في حزمة إضافة لها مدخل في Loader؛ وحين يكون المالك seam مجرّدًا، يذهب المتحكّم إلى الحزمة المقابلة تحت `packages/api/`. ويكتسب البيانُ المدخلين المولَّدين واعتماديةَ protocol النظيرة، بينما يركّب تجميعُ `@deepseek-ai/dsh-api-remotes` على جانب Client المساهمةَ ويعيد تصدير مفردات الأنواع التي يحتاجها المستهلكون. أما الناتج المولَّد الذي يشير إليه كل مدخل وترتيبُ خط التوليد ففي [مرجع بوابة API](../api-gateway.ar.md).

```json
{
  "exports": {
    "./typert": { "types": "./lib/typert.host.d.ts", "default": "./lib/typert.host.js" },
    "./remote": { "types": "./lib/typert.remote-client.d.ts", "default": "./lib/typert.remote-client.js" }
  },
  "peerDependencies": { "@deepseek-ai/dsh-typert-protocol": "workspace:^" },
  "devDependencies": { "@deepseek-ai/dsh-typert-protocol": "workspace:^" }
}
```

وأعِد تشغيل `pnpm run build:lib` بعد تغيير توقيع أو جدول الرموز أو فضاء الأسماء أو اسم تصدير، فهو ما يسلّم الـ Client تصريحاتِه وcodecs الجديدة؛ أما تغييرُ جسم تنفيذ وحده فلا يحتاج إعادةَ توليد.

## 4. استهلكها في الـ Client

تعلن الإضافةُ المستدعية `remote` و`remote.<namespace>` معًا في `inject` الخاصة بها، ويكتب موضعُ الاستدعاء `ctx.remote.<namespace>.<method>(...)` مباشرةً: بلا تضييق بـ `Pick<ClientRemote, …>`، وبلا توقيع طريقة مكتوب يدويًا، وبلا كائن تمرير على السلك. والنتيجةُ `RemoteResult<T>`، فتفرّع على `if (!result.ok)` في مكانها ومَيِّز بـ `code` لا بـ `instanceof`، فتفريعُ الرمز يضيّق `details` من تلقائه. وموضعُ تدفق الاستثناءات يكتب `throw result.error` (فهو Error حقيقي)؛ ومن يلتقطه يستعمل `isRemoteFailure` ليميّز عطلَ Remote من خلل محلي، ويعيد رميَ الخلل. ولا تكتب catch دفاعيًا: فاستدعاء Remote لا يُرفَض، وخطأُ التجميع ينبغي أن ينهار.

وتأتي وقائعُ Host الثابتة من `ctx.remote.$host`: فـ `home` و`isLoopback` قراءتان عاديتان بلا اشتراك وبلا عدّاد أجيال، و`home` هو `undefined` حتى أول إطار جاهزية. وحدّثها بعد إعادة الاتصال عبر `ctx.on('connection/reset')` أو عبر حدث بعيد يخص المجال. وحين يجهض المستدعي استدعاءً أحاديًا، تكون النتيجةُ `gateway/cancelled` في فرع الخطأ لا رميًا.

```ts ignore-check
import type { Context } from '@deepseek-ai/cordis'
import { isRemoteFailure } from '@deepseek-ai/dsh-api-gateway/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'

export const inject = ['remote', 'remote.notes']

declare const ctx: Context

/** Store-side read: the error branch is handled where the code is meaningful. */
export async function noteTitles(): Promise<readonly string[]> {
  const result = await ctx.remote.notes.list()
  if (!result.ok) {
    if (result.error.code === 'note/not-found') return []
    throw result.error
  }
  return result.value.map(row => row.title)
}

/** Action-side: a Remote failure becomes copy; a local fault keeps crashing. */
export async function renderTitles(): Promise<string> {
  try {
    return (await noteTitles()).join(', ')
  } catch (error: unknown) {
    if (!isRemoteFailure(error)) throw error
    return `unavailable (${error.code})`
  }
}

/** Fixed Host facts as plain reads. */
export function hostLabel(): string {
  const { home, isLoopback } = ctx.remote.$host
  return home ?? (isLoopback ? 'local host' : 'remote host')
}
```

## 5. اختبرها

على جانب المالك، تحقّق من الرمز الذي رُمي: استرجع العطل بـ `remoteErrorOf` بعد الالتقاط، ثم قارن `code` وحقولَ التفاصيل التي تهمك بـ `toMatchObject`؛ ولا تقارن كائنَ الخطأ مقارنةً عميقة بـ `toEqual` أبدًا، ولا تتحقق بـ `instanceof` أبدًا.

```ts
import { remoteErrorOf } from '@deepseek-ai/dsh-typert-protocol'
import { expect, it } from 'vitest'

declare function rename(noteId: string, title: string): Promise<void>

it('refuses an unknown note before writing', async () => {
  const failure = await rename('n-404', 'fresh title').catch((error: unknown) => error)

  expect(remoteErrorOf(failure)).toMatchObject({
    code: 'note/not-found',
    details: { noteId: 'n-404' },
  })
})
```

والبديلُ على جانب Client يعيد نسخًا حقيقية: خذ الاستيرادين القيميين `RemoteError` و`TestRemote` من `@deepseek-ai/dsh-client-test-runtime`، لأن استيرادًا قيميًا من واجهة `api-remotes` كان سيحمّل سلسلةَ التجميع غير المبنية. و`TestRemote.$host` حقل عادي تسنده المواصفةُ مباشرةً.

```ts ignore-check
import { Context } from '@deepseek-ai/cordis'
import { RemoteError, TestRemote } from '@deepseek-ai/dsh-client-test-runtime'
import { expect, it } from 'vitest'

it('renders the failure code the Host reported', async () => {
  const ctx = new Context()
  const remote = new TestRemote(ctx, {
    notes: {
      list: () => Promise.resolve({
        ok: false as const,
        error: new RemoteError('note/not-found', 'no note "n-404"', { noteId: 'n-404' }),
      }),
    },
  })
  remote.$host = { home: '/home/fixture', isLoopback: true }

  await expect(ctx.remote.notes.list()).resolves.toMatchObject({ error: { code: 'note/not-found' } })
})
```

## تحقّق

1. `pnpm run build:lib`: إلزامي متى تغيّر توقيع أو جدول الرموز أو فضاء الأسماء أو اسم تصدير، لأنه ينتج تصريحاتِ الـ Client وcodecs.
2. `pnpm run typecheck`: برنامجا Host وClient معًا، وفيهما يحمرّ رمزٌ دُمج في حزمة لا يمكن الوصول إليها.
3. شغّل مواصفات الجانبين بالاسم: `npx vitest run <owner spec> <client spec>`.
4. أضف لقطةَ جلسة مسجَّلة حين تبلغ نقطةُ النهاية سطحًا يراه المستخدم، وفق [سياسة الاختبار](../testing.ar.md).

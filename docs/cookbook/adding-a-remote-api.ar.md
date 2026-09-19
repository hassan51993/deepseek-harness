# فعلي تشغيل يد سجل: إضافة جديدة واحد Remote API

[English](adding-a-remote-api.md) | العربية

إضافة جديدة أو تعديل واحد `ctx.remote` طرف نقطة حسب هذا صفحة خمسة خطوة مشي: إعلان طريقة، إعلان فشل، في حزمة فوق تسجيل، في Client إزالة استهلاك، كتابة اختبار.decorator دلالة،lookup تحليل، توليد إدارة خط و `/api` توجيه يخص آلية، من [API Gateway مشاركة اعتبار](../api-gateway.ar.md) مسؤول؛ هذا صفحة إعطاء هو كل واحد خطوة حركة عمل و يجب التزام حراسة اتفاق. لـ ماذا هو هذا طقم تحرير مسار وجه، رؤية [Typert Remote طريقة استدعاء Agent Note](../../.agents/notes/implemented/architecture/2026-08-02-typert-remote-method-calls.ar.md) ؛ لـ ماذا فشل وجه هو مفرد عدد `RemoteError` إضافة واحد ورقة رمز جدول، رؤية[فشل مفردات Agent Note](../../.agents/notes/implemented/architecture/2026-08-28-ctx-remote-failure-vocabulary.ar.md).

## 1. إعلان API

owner هو واحد Host جانب Cordis خدمة: وراثة `TypertRemoteService` يأخذ service مفتاح و wire namespace واحد بدء ربط، مجددا استخدام `@Remote` علامة ملاحظة مقابل خارج كشف طريقة. عمل خدمة طريقة توقيع إذا قد رمز دمج wire اتفاق حينئذ مباشر علامة ملاحظة هو ذاته؛ فقط لديه شكل حاجة ضبط كامل (تكملة `signal`، تبديل معامل ترتيب، تبديل توجيه خروج اسم) عندئذ كتابة واحد `remoteExport*` adapter، من هو استدعاء لا تعديل اسم عمل خدمة طريقة.lookup كائن (`Agent`،`Session`) فقط قدرة احتلال قمة طبقة معامل موضع، دعم حمل تنسيق عمل صيغة إلغاء طريقة يأخذ `signal: AbortSignal` وضع في الأكثر بعد واحد موضع.

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

## 2. إعلان فشل

Remote فشل فقط لديه واحد صنف `RemoteError`: مجال رمز مرور declaration merging دخول `RemoteErrorDetailsMap`، فشل نقطة مباشر `throw new RemoteError(code, message, details)`. لا يلزم بناء مجال استثناء صنف بيت عائلة، أيضا لا يلزم كتابة خروج فتحة خريطة دالة؛ و هذا طرف نقطة غير متصل استثناء لا مسبق أولا عودة صنف،Gateway سوف التقاط قاع طي صار `gateway/internal`. فقط لديه"يأخذ مهمة معنى provider استثناء عودة لـ واحد مجال رمز"هذا واحد نوع مشهد عندئذ كتابة `catch`، و يأخذ أصلي استثناء تعليق في `cause` فوق.

رمز اسم هو `<مجال>/<إدارة من>`، إعلان سقوط نقطة أربعة بند:

- فقط لديه واحد إنتاج من: إعلان سقوط إنتاج من حزمة، ضيق ملاصق رمي خروج نقطة.
- كثير عدد حزمة مشترك نفس إنتاج: سقوط مزدوج جهة مشترك نفس اعتماد الأكثر منخفض طبقة مجال حزمة (`session/not-found` في `core/session`،`workspace/not-found` في `dsh-workspace`).
- تحميل جسم رمز `gateway/bad-request`،`gateway/cancelled`،`gateway/internal` قد في protocol إعلان،Gateway أساس أساس ضبط تطبيق رمز قد في gateway إعلان——مباشر استخدام، لا يلزم نسخ.
- لا فوق wire محلي فشل لا دخول رمز جدول، استخدام استدعاء جهة ذاتي ذات نوع جدول بلوغ.

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

## 3. في حزمة فوق تسجيل

`@Remote` يجب سقوط في واحد Loader entry إضافة حزمة داخل؛owner هو سحب كائن seam وقت يأخذ تحكم جهاز وضع دخول `packages/api/` تحت مقابل حزمة. حزمة بيان يلزم تكملة اثنان عدد توليد مدخل و protocol peer اعتماد،Client جانب فإن من `@deepseek-ai/dsh-api-remotes` assembly تركيب هذا مساهمة و حسب يحتاج تحويل فتحة نوع مفردات. اثنان عدد مدخل قسم آخر إشارة نحو أي عدد توليد ناتج، توليد إدارة خط مثل أي ترتيب ترتيب، رؤية [API Gateway مشاركة اعتبار](../api-gateway.ar.md).

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

تعديل توقيع، رمز جدول،namespace أو توجيه خروج اسم بعد إعادة ركض `pnpm run build:lib`،Client عندئذ أخذ نيل إلى جديد إعلان و codec؛ فقط تعديل تنفيذ جسم لا حاجة إعادة توليد.

## 4. في Client إزالة استهلاك

استدعاء إضافة في `inject` داخل معا إعلان `remote` و `remote.<namespace>`، استدعاء نقطة مباشر كتابة `ctx.remote.<namespace>.<method>(...)`: لا يلزم استخدام `Pick<ClientRemote, …>` ضيق تحويل، لا يلزم يد كتابة طريقة توقيع، لا يلزم صنع wire في تحويل كائن. نتيجة هو `RemoteResult<T>`، حينئذ أرض `if (!result.ok)` فرع، حكم `code` بينما لا هو `instanceof`——code فرع سوف تلقائي ضيق تحويل `details`. استثناء تدفق محطة نقطة كتابة `throw result.error`(هو هو حق Error) ؛ وصل إقامة هو فوق طبقة استخدام `isRemoteFailure` منطقة قسم Remote فشل و محلي نقص وقوع، محلي نقص وقوع متابعة نحو فوق رمي. لا يلزم كتابة منع صد صفة catch:Remote استدعاء لا reject، تركيب إعداد خطأ حينئذ هذا انفجار.

Host ثابت واقع قراءة `ctx.remote.$host`:`home` و `isLoopback` هو عادي قيمة قراءة، لا يوجد حجز قراءة أيضا لا يوجد generation حساب عدد جهاز،`home` في رقم واحد لقطة ready قبل هو `undefined`؛ إعادة وصل بعد تحديث جديد مشي `ctx.on('connection/reset')` أو كل مجال ذاتي ذات remote حدث. استدعاء جهة abort إسقاط مرة واحد عنصر استدعاء وقت، نتيجة سقوط في خطأ فرع فوق `gateway/cancelled`، بينما لا هو رمي خروج.

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

## 5. اختبار

owner جانب تأكيد رمي خروج رمز: التقاط بعد استخدام `remoteErrorOf` أخذ خروج فشل، مجددا استخدام `toMatchObject` مقارنة مقابل `code` و حاجة `details` حقل——لا يلزم استخدام `toEqual` عميق مقارنة مقابل خطأ كائن، أيضا لا يلزم تأكيد `instanceof`.

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

Client جانب بديل ذات إرجاع حقيقي مثال:`RemoteError` و `TestRemote` قيمة import واحد قاعدة أخذ ذاتي `@deepseek-ai/dsh-client-test-runtime`، لأن من `api-remotes` facade قيمة import سوف سحب بدء بعد لم بناء تركيب إعداد سلسلة.`TestRemote.$host` هو عادي حقل،spec مباشر منح قيمة يكفي.

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

## تحقق

1. `pnpm run build:lib`: توقيع، رمز جدول،namespace أو توجيه خروج اسم تغيير مرور حينئذ يجب إعادة ركض،Client إعلان و codec من هو إنتاج خروج.
2. `pnpm run typecheck`:Host و Client اثنان عدد program كل مرور واحد مرة، رمز جدول merge سقوط نقطة خطأ سوف في هذا داخل أحمر.
3. نقطة اسم ركض اثنان جانب spec:`npx vitest run <owner spec> <client spec>`.
4. طرف نقطة يخص منتج مرئي وجه وقت تكملة واحد بند تسجيل صنع جلسة لقطة، قاعدة رؤية[اختبار سياسة](../testing.ar.md).

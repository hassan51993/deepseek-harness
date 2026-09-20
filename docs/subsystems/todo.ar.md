# Todo

[English](todo.md) | العربية

مفرداتُ todo الدائمة التي تملكها [`@deepseek-ai/dsh-tool-todo`](../../packages/todo/tool-todo/README.ar.md). فالأداةُ التي يراها النموذج تستبدل قائمةَ جلسة وكيل واحدة بأكملها؛ وتملك الحزمةُ أيضًا تصريحَ الحدث، وإسقاطَ إعادة التشغيل، ورفيقَ الثابتة. وسلوكُ الأداة وضبطُها في [README الحزمة](../../packages/todo/tool-todo/README.ar.md).

المصدر: [`packages/todo/tool-todo/src/types.ts`](../../packages/todo/tool-todo/src/types.ts)

## `TodoItem` — مدخل واحد في القائمة

```ts type-equiv
/**
 * One entry in an agent's todo list — the unit of the `todo/write`
 * whole-list snapshot declared by this package.
 *
 * Deliberately minimal: a human-readable `content` line and a three-state
 * `status`. No id, priority, or `activeForm` — the list is replaced wholesale
 * on every write (last-write-wins), so entries need no stable identity. The
 * three statuses describe the complete portable lifecycle needed by model and
 * UI consumers.
 */
interface TodoItem {
  /** What this task is — a short imperative line shown in the UI. */
  content: string
  /** Lifecycle state. `in_progress` marks a task being worked now; parallel work may mark several. */
  status: 'pending' | 'in_progress' | 'completed'
}
```

## الحدث الدائم والثابتة

تدمج الحزمةُ تصريحَ `todo/write: { todos: TodoItem[] }` في `SessionEventMap`. والحدثُ للسجل فقط ويحمل قائمةَ الاستبدال كاملةً؛ ويسجّل [دليلُ الحفظ الدائم](../persistence-catalog.ar.md#todowrite--log-only) المولَّد موضعَ تصريحه. ويتحقق رفيقُ الثابتة في الحزمة من الجلسات القائمة والجلسات المعلَن عنها حديثًا في مرور واحد، ثم يتتبع حدودَ الجولات المودَعة تدريجيًا، فيُفحص كلُّ `todo/write` حي قبل الإلحاق بلا إعادة مسح السجل.

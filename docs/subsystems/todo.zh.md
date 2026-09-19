# Todo

[English](todo.md) | العربية

هذا صفحة سجل [`@deepseek-ai/dsh-tool-todo`](../../packages/todo/tool-todo/README.zh.md) يملك حمل دائم todo مفردات. موجه إلى نموذج أداة سوف كامل جسم استبدال واحد agent(ذكي جسم) جلسة قائمة؛ هذا حزمة أيضا يملك حدث إعلان، إعادة تشغيل إسقاط و ثابت كمية إعداد طقم إضافة. أداة سلوك و إعداد رؤية[حزمة README](../../packages/todo/tool-todo/README.zh.md).

شفرة المصدر:[`packages/todo/tool-todo/src/types.ts`](../../packages/todo/tool-todo/src/types.ts)

## `TodoItem`: واحد بند قائمة بند

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

## حمل دائم حدث و ثابت كمية

هذا حزمة عبر إعلان دمج يأخذ `todo/write: { todos: TodoItem[] }` إضافة دخول `SessionEventMap`. هذا حدث فقط كتابة سجل، و يحمل كامل استبدال قائمة؛ توليد[حفظ دائم دليل](../persistence-catalog.zh.md#todowrite--log-only) سوف سجل ذلك إعلان موضع. هذا حزمة ثابت كمية إعداد طقم إضافة سوف مفرد مرة مرة تاريخ تحقق قائم جلسة و جديد إصدار جلسة، مع بعد زيادة كمية تتبع أثر قد إيداع جولة حد، جعل كل فوري `todo/write` كل قدرة في إلحاق قبل نيل إلى تحقق، بينما بلا حاجة إعادة مسح سجل.

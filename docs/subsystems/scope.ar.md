# أثر مجال تسجيل

[English](scope.md) | العربية

[scope حزمة](../../packages/core/scope) توفير هوية، تحميل جسم و أثر مجال طبقة مفردات، جعل نفس تسجيل سياق معا جدول بلوغ كل agent(ذكي جسم) مرئي صفة و مشترك دورة الحياة كل حق. هو هو مكتبة أصل لغة، بينما لا هو Cordis خدمة؛ دورة الحياة تصميم إدارة من من [agent-scope وقت التشغيل تصميم Agent Note](../../.agents/notes/implemented/architecture/2026-07-12-agent-scope-runtime-design.ar.md#scope-routing-one-opaque-key-selects-one-layer) قاعدة تحديد، يمكن استدعاء API و مرور ترشيح دلالة فإن من حزمة [README](../../packages/core/scope/README.ar.md) قاعدة تحديد.

شفرة المصدر:[`packages/core/scope/src/index.ts`](../../packages/core/scope/src/index.ts) و [`packages/core/scope/src/store.ts`](../../packages/core/scope/src/store.ts).

## هوية معرف و توزيع تحميل جسم

`ScopeKey` هو واحد لا نفاذ واضح كائن هوية معرف. قد تسليم agent loop(ذكي جسم حلقة) استخدام نشط وثب `Agent` كائن بصفة ذاته key، لكن هذا أصل لغة من لا فحص نظر هذا كائن.

```ts type-equiv
/** An opaque, identity-compared scope key. */
type ScopeKey = object
```

`Scoped<T>` هو تحرير ترجمة مدة صنف لوحة علامة، علامة ملاحظة في `scopeTarget(base, key)` إرجاع لا نفاذ واضح توجيه استقبال جهاز فوق. أثر مجال مرور ترشيح حدث إعلان اشتراط بـ هذا تحميل جسم بصفة `this` نوع، بينما حق صحيح حدث رئيسي جسم ما زال بصفة صريح معامل نقل دخول.

```ts type-equiv
/**
 * A routing-only event receiver built by {@link scopeTarget}. The type
 * parameter records the subject type for dispatch checking; the carrier does
 * not expose the subject's properties. Event payloads carry the real subject.
 */
type Scoped<T extends object> = object & { readonly [ScopedBrand]: T }
```

## يملك كل حق تسجيل سياق

`Scope` سوف حمل وسم تسجيل سياق و اثنان عدد تفكيك إزالة واجهة إعداد مقابل.`rawDispose` إبقاء لديه ترتيب تكرار دمج effect الذي يحتاج Cordis disposer تأكيد قطع هوية؛`dispose()` هو موجه إلى مباشر استدعاء جهة و تنافس حالة استدعاء جهة عام مشترك تماما توقف مستقر حد.

```ts type-equiv
/** A minted registration scope and its quiescent disposal boundaries. */
interface Scope {
  /** Context through which scope-owned registrations are made. */
  ctx: Context
  /** Exact Cordis disposer, used when nesting this scope in an ordered composite effect. */
  rawDispose: () => Promise<void> | void
  /** Dispose every scope-owned registration; racing calls await the same completion. */
  dispose(): Promise<void>
}
```

## حمل أثر مجال سجل التسجيل طبقة

`ScopeLayer` يمثل واحد سجل التسجيل في عام أو تأكيد قطع أثر مجال طبقة درجة كامل مساهمة. أداة جسم layer يمكن تجمع دمج كثير عدد أداة اسم و مجهول اسم table؛ كامل layer لـ فارغ وقت،`ScopedLayers` يمكن عودة استلام حمل أثر مجال حالة، بينما لن إسقاط أخ أخ table.

```ts type-equiv
/** One scope's aggregate contribution to a registry. */
interface ScopeLayer {
  /** Whether every table in this layer is empty. */
  isEmpty(): boolean
}
```

`ScopedLayers<L>` يملك قيام أي إنشاء عام layer، و كسول صفة إنشاء تأكيد قطع أثر مجال layer. قراءة لن إنشاء layer:`peek(undefined)` يمثل لا وجود أثر مجال تغطية طبقة، بينما `merge()` سوف اعتماد مرة شيء تحويل حسب إدراج دخول ترتيب ترتيب صف عام أداة اسم بند و حمل أثر مجال حجب حجب بند. تسجيل استخدام نفس عدد سياق يمثل مرئي صفة و Cordis effect كل حق، في اختياري إشعار قبل أخذ نيل واحد تزامن سحب إلغاء دالة، إرجاع Cordis أصلي disposer، و كما فقط في حمل أثر مجال layer كامل `ScopeLayer` لـ فارغ وقت عودة استلام هو.

`NamedEntries<V>` توفير حسب إدراج دخول ترتيب فحص بحث و حركة حالة تكرار بديل، تكرار بند خطأ من استدعاء جهة معالجة.`AnonymousEntries<V>` لـ كل مرة append قسم إعداد وحيد معرف، لذلك قيمة متبادل انتظار بند ما زال ذاك هذا مستقل. في نفس جولة غير فارغ table دورة الحياة داخل، مكرر يمكن مراقبة لاحق تغير؛table يتم صاف فارغ بعد، قائم مكرر لن مجددا مراقبة لاحق إدراج دخول. اثنان من كل إرجاع قوة انتظار، دقيق مقابل متبادل ينبغي بند سحب إلغاء دالة؛ مشترك تنفيذ واجهة `EntryValues` لا مقابل خارج عام.

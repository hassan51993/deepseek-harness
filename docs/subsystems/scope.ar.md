# التسجيل المنطاقي

[English](scope.md) | العربية

تقدّم [حزمة scope](../../packages/core/scope) مفرداتِ الهوية والحامل والطبقة المنطاقية التي تجعل سياقَ تسجيل واحدًا يعني في آن واحد الرؤيةَ لكل وكيل وملكيةَ العمر المشترك. وهي بدائيةٌ مكتبية لا خدمةُ Cordis؛ وتملك [ملاحظةُ الوكيل عن تصميم نطاق الوكيل في وقت التشغيل](../../.agents/notes/implemented/architecture/2026-07-12-agent-scope-runtime-design.ar.md#scope-routing-one-opaque-key-selects-one-layer) مسوّغَ دورة الحياة، ويملك [README](../../packages/core/scope/README.ar.md) الحزمةِ واجهةَ الاستدعاء ودلالاتِ الترشيح.

المصدران: [`packages/core/scope/src/index.ts`](../../packages/core/scope/src/index.ts) و[`packages/core/scope/src/store.ts`](../../packages/core/scope/src/store.ts).

## الهوية وحامل التوزيع

`ScopeKey` هويةُ كائن معتمة. وتستعمل الحلقةُ المشحونة كائنَ `Agent` الحي مفتاحًا لنفسها، لكن البدائيةَ لا تفحص الكائنَ قط.

```ts type-equiv
/** An opaque, identity-compared scope key. */
type ScopeKey = object
```

و`Scoped<T>` هي العلامةُ عند الترجمة على مستقبِل التوجيه المعتم الذي يعيده `scopeTarget(base, key)`. وتشترط تصريحاتُ الأحداث المرشَّحة بالنطاق هذا الحاملَ نوعًا لـ`this`، بينما يبقى موضوعُ الحدث الحقيقي وسيطًا صريحًا.

```ts type-equiv
/**
 * A routing-only event receiver built by {@link scopeTarget}. The type
 * parameter records the subject type for dispatch checking; the carrier does
 * not expose the subject's properties. Event payloads carry the real subject.
 */
type Scoped<T extends object> = object & { readonly [ScopedBrand]: T }
```

## سياق التسجيل المملوك

يقرن `Scope` سياقَ التسجيل الموسوم بمسارَي تفكيك. فـ`rawDispose` يحفظ هويةَ مُفكِّك Cordis بعينها التي يشترطها أثرٌ مركّب مرتَّب؛ و`dispose()` هو حدُّ السكون المشترك العلني للمستدعين المباشرين والمتسابقين.

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

## طبقة السجل المنطاقية

يمثّل `ScopeLayer` إسهامَ سجل واحد كاملًا على المستوى العام أو على نطاق بعينه. وقد تجمع الطبقةُ الملموسة جداول مسمّاة ومجهولة عدة؛ وخلوُّ الطبقة كلها يتيح لـ`ScopedLayers` استردادَ الحالة المنطاقية بلا التخلص من جدول شقيق.

```ts type-equiv
/** One scope's aggregate contribution to a registry. */
interface ScopeLayer {
  /** Whether every table in this layer is empty. */
  isEmpty(): boolean
}
```

ويملك `ScopedLayers<L>` الطبقةَ العامة المتلهّفة والطبقاتِ النطاقية الدقيقة المُنشأة كسولًا. والقراءاتُ لا تُنشئ طبقات: فـ`peek(undefined)` يعني لا تراكب، بينما يجسّد `merge()` المداخلَ العامة المسمّاة بترتيب الإدراج متبوعةً بظلالها النطاقية. ويستعمل التسجيلُ سياقًا واحدًا للرؤية ولملكية أثر Cordis معًا، ويجمع تراجعًا متزامنًا واحدًا قبل الإشعار الاختياري، ويعيد مُفكِّك Cordis بعينه، ولا يسترد طبقةً نطاقية إلا حين يخلو `ScopeLayer` الخاص بها كاملًا.

ويقدّم `NamedEntries<V>` بحثًا بترتيب الإدراج وتكرارًا حيًّا مع أخطاء تكرار يملكها المستدعي. ويمنح `AnonymousEntries<V>` كلَّ إلحاق هويةً فريدة فتبقى القيمُ المتساوية مستقلةً. ويبقى التكرارُ حيًّا داخل جيل واحد من جدول غير فارغ؛ وتصريفُ الجدول يفصل المكرِّراتِ القائمة عن الإدراجات اللاحقة. ويعيد الاثنان تراجعاتٍ متماثلةً عن المدخل بعينه؛ أما واجهةُ التنفيذ المشتركة `EntryValues` فليست علنية.

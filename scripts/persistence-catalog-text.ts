/** Authored language pairs for generated persistence reference prose. */

/** Language of a generated persistence reference. */
export type PersistenceCatalogLocale = 'en' | 'ar'

const english = {
  title: 'Session Persistence Event Catalog',
  intro: 'Every repository-declared durable Session event appears here with its source declaration and resolved types. The catalog covers the logical and physical headers, event envelopes, and every plugin declaration merge. See [Session](subsystems/session.md) for replay and [persistence](subsystems/persistence.md) for storage.',
  generation: 'Run `pnpm run gen-persistence-catalog` to regenerate both catalog languages, their pairing record, the known-event module, and the machine schema inventory. `pnpm run verify-persistence-catalog` checks all generated files. Declaration fences preserve source JSDoc and type references; resolved definitions expose their transitive structure.',
  envelopeIntro: 'The envelope carries `type`, `seq`, `time`, `data`, optional `ignorable`, and conditional `surfaceOp` / `sourceEventSeqs`. A **surface** event produces model history; a **log-only** event does not. The inventory covers this repository; external plugin types require their own declarations and are outside this catalog.',
  envelope: 'Event envelope', events: 'Events', sources: 'Sources: ', source: 'Source: ', types: 'Types: ',
  fingerprints: 'Persistence type fingerprints',
  fingerprintsIntro: 'The [machine inventory](persistence-schema.json) contains every reachable normalized type and its SHA-256 digest. Root digests include referenced types. Comments, source locations, alias names, erased brands, readonly markers, and harmless field, union, or intersection reordering do not affect these fingerprints. Tuple order, property names, value types, and optionality do. Catalog text and source locations can still produce a diff when digests stay unchanged.',
  historyIntro: 'The [format references](persistence-changes/historical-formats/README.md) cover every historical Session format. The [change records](persistence-changes/README.md) acknowledge exact transitions using snapshots kept in this tree. Follow the [review workflow](cookbook/reviewing-persistence-type-changes.md) to classify a change and record it. These checks cover declared type structure; opaque payload contents and behavior without type changes are outside their scope.',
  rootColumns: '| Root | Kind | SHA-256 | Resolved type |',
  definitions: 'Resolved persistence types',
  definitionsIntro: 'Each definition appears once. References preserve sharing and recursion; the digest beside a definition includes its complete reachable structure. Source names and locations identify its declarations but are excluded from its digest.',
  propertyColumns: '| Property | Presence | Type |', positionColumns: '| Position | Presence | Type |',
  optional: 'optional', required: 'required', rest: 'rest', index: 'index signature',
  emptyObject: 'Object with no declared properties.', arrayPrefix: 'Array of ', arraySuffix: '.',
  oneOf: 'One of:', opaque: ' (opaque)', opaqueExplanation: ": the declaration does not expose the stored value's internal fields.",
}

const arabic: Record<keyof typeof english, string> = {
  title: 'دليل أحداث حفظ الجلسة الدائم',
  intro: 'يظهر هنا كل حدث جلسة دائم يعلنه المستودع، مع تصريحه في المصدر وأنواعه المحلولة. ويغطي الدليل الترويستين المنطقية والفيزيائية، ومغلّفات الأحداث، وكل دمج تصريحات تسهم به إضافة. انظر [Session](subsystems/session.ar.md) لإعادة التشغيل، و[الحفظ الدائم](subsystems/persistence.ar.md) للتخزين.',
  generation: 'شغّل `pnpm run gen-persistence-catalog` لإعادة توليد لغتَي الدليل وسجل اقترانهما ووحدة الأحداث المعروفة وجرد schemas الآلي. ويفحص `pnpm run verify-persistence-catalog` كل الملفات المولَّدة. وتحفظ أسوارُ التصريحات JSDoc المصدر ومراجعَ الأنواع؛ وتكشف التعريفاتُ المحلولة بنيتَها المتعدية.',
  envelopeIntro: 'يحمل المغلّف `type` و`seq` و`time` و`data`، و`ignorable` اختياريًا، و`surfaceOp` و`sourceEventSeqs` شرطيًا. وحدثُ **السطح** ينتج تاريخًا للنموذج؛ وحدثُ **السجل فقط** لا ينتجه. ويغطي الجردُ هذا المستودع؛ أما أنواع الإضافات الخارجية فتشترط تصريحاتها هي وتقع خارج هذا الدليل.',
  envelope: 'مغلّف الأحداث', events: 'الأحداث', sources: 'المصادر: ', source: 'المصدر: ', types: 'الأنواع: ',
  fingerprints: 'بصمات أنواع الحفظ الدائم',
  fingerprintsIntro: 'يحتوي [الجرد الآلي](persistence-schema.json) كل نوع موحَّد قابل للوصول وبصمتَه SHA-256. وتشمل بصماتُ الجذور الأنواعَ المشار إليها. ولا تؤثر في هذه البصمات التعليقاتُ ولا مواضعُ المصدر ولا أسماءُ الأسماء البديلة ولا العلاماتُ الممحوّة ولا واسماتُ readonly ولا إعادةُ ترتيب الحقول أو الاتحادات أو التقاطعات غير الضارة. أما ترتيبُ الصفوف المرتَّبة وأسماءُ الخصائص وأنواعُ القيم والاختياريةُ فتؤثر فيها. وقد ينتج نصُّ الدليل ومواضعُ المصدر فرقًا مع ذلك حين تبقى البصماتُ كما هي.',
  historyIntro: 'تغطي [مراجع الصيغ](persistence-changes/historical-formats/README.ar.md) كل صيغة جلسة تاريخية. وتؤكّد [سجلات التغييرات](persistence-changes/README.ar.md) الانتقالاتِ بعينها بلقطات محفوظة في هذه الشجرة. واتبع [مسار المراجعة](cookbook/reviewing-persistence-type-changes.ar.md) لتصنيف تغيير وتسجيله. وتغطي هذه الفحوصُ بنيةَ الأنواع المعلَنة؛ أما محتوى الحمولات المعتم والسلوكُ الذي لا يغيّر نوعًا فخارج نطاقها.',
  rootColumns: '| الجذر | الصنف | SHA-256 | النوع المحلول |',
  definitions: 'أنواع الحفظ الدائم المحلولة',
  definitionsIntro: 'يظهر كل تعريف مرة واحدة. وتحفظ المراجعُ التشاركَ والتكرارَ الذاتي؛ والبصمةُ بجوار التعريف تشمل بنيتَه القابلة للوصول كاملةً. وأسماءُ المصدر ومواضعُه تحدّد تصريحاته لكنها مستثناة من بصمته.',
  propertyColumns: '| الخاصية | الحضور | النوع |', positionColumns: '| الموضع | الحضور | النوع |',
  optional: 'اختيارية', required: 'مطلوبة', rest: 'معامل الباقي', index: 'توقيع فهرس',
  emptyObject: 'كائن بلا خصائص معلَنة.', arrayPrefix: 'مصفوفة من ', arraySuffix: '.',
  oneOf: 'واحد مما يلي:', opaque: ' (معتم)', opaqueExplanation: ': لا يكشف التصريح الحقولَ الداخلية للقيمة المخزَّنة.',
}

/** Complete translated prose; adding an English key requires its Arabic counterpart. */
export const persistenceCatalogText = { en: english, ar: arabic }

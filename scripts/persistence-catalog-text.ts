/** Authored language pairs for generated persistence reference prose. */

/** Language of a generated persistence reference. */
export type PersistenceCatalogLocale = 'en' | 'zh'

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

const chinese: Record<keyof typeof english, string> = {
  title: 'جلسة حفظ دائم حدث دليل',
  intro: 'هذا دليل صف خروج مستودع إعلان كل حفظ دائم Session حدث و ذلك شفرة المصدر إعلان و تحليل نوع، تغطية منطق و شيء إدارة header، حدث معلومة غلاف و كل إضافة إعلان دمج. إعادة تشغيل قاعدة مشاركة رؤية [Session](subsystems/session.zh.md) ، تخزين قاعدة مشاركة رؤية[حفظ دائم](subsystems/persistence.zh.md).',
  generation: 'تشغيل `pnpm run gen-persistence-catalog` يمكن إعادة توليد دليل اثنان نوع لغة، إعداد مقابل سجل، معروف حدث وحدة و آلة جهاز schema دليل.`pnpm run verify-persistence-catalog` فحص كل توليد ملف. إعلان محيط شريط إبقاء شفرة المصدر JSDoc و نوع مرجع؛ تحليل بعد تعريف توسيع ذلك نقل تمرير مرجع بنية.',
  envelopeIntro: 'معلومة غلاف يتضمن `type`،`seq`،`time`،`data`، اختياري `ignorable` و شرط حقل `surfaceOp` / `sourceEventSeqs`.**surface** حدث إنتاج نموذج تاريخ،**log-only** حدث لا إنتاج نموذج تاريخ. دليل تغطية هذا مستودع؛ خارجي إضافة نوع حاجة مستقل إعلان، لا يخص هذا دليل.',
  envelope: 'حدث معلومة غلاف', events: 'حدث', sources: 'مصدر:', source: 'مصدر:', types: 'نوع:',
  fingerprints: 'حفظ دائم نوع إشارة نقش',
  fingerprintsIntro: '[آلة جهاز يمكن قراءة دليل](persistence-schema.json) يتضمن كل يمكن بلوغ مواصفة تحويل نوع و ذلك SHA-256 ملخص. أصل نوع ملخص شمول غطاء مرجع نوع. ملاحظة تفسير، شفرة المصدر موضع، آخر اسم، مسح حذف صنف لوحة علامة،readonly علامة و بلا دلالة تغير حقل، ربط دمج نوع أو تسليم تقاطع نوع إعادة ترتيب لا أثر ملخص؛ عنصر مجموعة ترتيب، خاصية اسم، قيمة نوع و اختياري صفة سوف أثر ملخص. ملخص ثابت وقت، دليل نص و شفرة المصدر موضع ما زال ممكن إنتاج diff.',
  historyIntro: '[صيغة مشاركة اعتبار](persistence-changes/historical-formats/README.zh.md) تغطية كل تاريخ Session صيغة.[تغيير سجل](persistence-changes/README.zh.md) عبر حفظ في هذا شفرة المصدر شجرة في لقطة تأكيد دقيق نوع تحويل. حسب وفق[مراجعة مسار](cookbook/reviewing-persistence-type-changes.zh.md) تصنيف و سجل تغيير. هذه فحص تغطية قد إعلان نوع بنية؛ لا نفاذ واضح تحميل حمل داخلي محتوى و لم تغيير نوع سلوك تغيير لا في فحص نطاق داخل.',
  rootColumns: '| أصل نوع | صنف آخر | SHA-256 | قد تحليل نوع |',
  definitions: 'قد تحليل حفظ دائم نوع',
  definitionsIntro: 'كل نوع تعريف فقط صف خروج مرة. مرجع إبقاء مشترك و تمرير عودة علاقة؛ تعريف جانب ملخص شمول غطاء ذلك كامل يمكن بلوغ بنية. شفرة المصدر اسم و موضع معرف إعلان مصدر، لكن لا مشاركة و ملخص حساب حساب.',
  propertyColumns: '| خاصية | وجود | نوع |', positionColumns: '| موضع | وجود | نوع |',
  optional: 'اختياري', required: 'مطلوب', rest: 'باق بقية بند', index: 'بحث جذب توقيع',
  emptyObject: 'بلا قد إعلان خاصية كائن.', arrayPrefix: '', arraySuffix: ' عدد مجموعة.',
  oneOf: 'التالي نوع لـ واحد:', opaque: '(لا نفاذ واضح)', opaqueExplanation: ': هذا إعلان لم كشف تخزين قيمة داخلي حقل.',
}

/** Complete translated prose; adding an English key requires its Chinese counterpart. */
export const persistenceCatalogText = { en: english, zh: chinese }

<!-- النصُّ الإنجليزي مولَّد من scripts/gen-doc-graphs.ts؛ وهذا الملف العربي يُصان يدويًا ويُقرن به عبر سجل الاقتران الثنائي اللغة.
     عند التحديث، شغّل `pnpm run gen-doc-graphs` أولًا لتحديث النص الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/graph-atlas.md` لإعادة تسجيل الاقتران. -->

# فهرس رسوم التوثيق

[English](graph-atlas.md) | العربية

تعرض هذه الرسومُ علاقاتٍ لا تعرضها الأدلةُ المولَّدة. استعملها لتجد علاقاتِ الحزم، وseams القدرات، وتدفقَ الأحداث، والأدواتِ التي يراها النموذج، وتركيبَ التطبيقات، ومساراتِ دورة الحياة في وقت التشغيل. وتبقى التوقيعاتُ الدقيقة وتعريفاتُ الأنواع في [صفحات الأنظمة](subsystems/core.ar.md) (الأنواعُ ومناطقُ واجهة Cordis البرمجية المولَّدة) وفي [tool-catalog.md](tool-catalog.ar.md).

وقرارُ المسار وراء هذا الفهرس مسجَّل في [ملاحظة الوكيل عن رسوم التوثيق](../.agents/notes/archived/process/2026-07-03-documentation-graph-atlas.md).

| رسم | نمط |
| --- | --- |
| [وحدة اعتماد رسم](module-graph.ar.md) | `generated` |
| [أداة schema دليل و حزمة خريطة](tool-catalog.ar.md) | `generated` |
| [قدرة seam و نواة قلب خدمة](capability-seams.ar.md) | `hybrid generated` |
| [dsh مشترك أساس أساس تركيب](../apps/cli/composition.md) | `hybrid generated` |
| [حدث إنتاج جهة/مستهلك مستطيل دفعة](event-producer-consumer.ar.md) | `hybrid generated` |
| [agent(ذكي جسم) جولة و خطوة دورة الحياة](agent-lifecycle.ar.md) | `curated` |
| [أداة تنفيذ خط الإنتاج](tool-execution-pipeline.ar.md) | `curated` |

أعِد توليدَ النص الإنجليزي بـ`pnpm run gen-doc-graphs`؛ وتحقق من طزاجته بـ`pnpm run verify-doc-graphs`، أما الجانبُ العربي فيُصان عبر سجل الاقتران الثنائي اللغة.

وضعُ صيانة النص الإنجليزي مختلط: فكلُّ صفحة مرتبطة تعلن وضعَها — مولَّدًا أو مختلطًا أو مؤلَّفًا يدويًا؛ وهذا الملفُّ العربي يُصان يدويًا عبر سجل الاقتران الثنائي اللغة.

# Agent Note: parent ذاتي لديه subagent دليل حدث

Status: implemented

[English](2026-09-01-parent-owned-subagent-catalog.md) | العربية

## مشكلة

مباشر child discovery سبق من عام Session لغة مادة و كل دخول اختيار child سجل إعادة بناء دليل. إنشاء مرور مسار قد معرفة طريق مباشر parent،child id،mode و label، لذلك مستودع نطاق قطعة رفع و child سجل قراءة تكرار دفع توجيه قد لديه ملكية واقع، و يجعل متصفح تحديث جديد صار هذا أخذ قرار في غير متصل Session.

child descriptor مقابل استعادة و composition ما زال لا بد يلزم، لكن هو لا يستطيع بصفة discovery مصدر، لأن قراءة جهة يجب أولا بحث إلى و فتح child عندئذ قدرة قراءة descriptor.fork أيضا لديه مستقل اشتراط: من parent سجل بث نوع فرعي هذا لا يستطيع وراثة أصل Session child.

## قرار

parent Session required `subagent/catalog` حدث هو مباشر child discovery حفظ دائم مرجعي. كل حدث كل هو واحد بند نجاح إنشاء واقع، يتضمن `childId`،`childCreatedAt`،mode و حسب mode منطقة قسم label. لا يوجد محلي Session بعيد مسار one-shot run لا دخول هذا دليل. بلا فاعلية ذاته fact(يشمل لا دعم حمل payload إصدار) سوف جعل projection استعادة فشل، لأن ساكن صامت إسقاط required fact سوف إرجاع لا كامل دليل.

إنشاء فقط إصدار نجاح واقع.one-shot run في provider إرجاع محلي child بعد،run وصول استدعاء جهة قبل إلحاق دليل حدث.continuable run أولا دقيق دخول ابتدائي prompt، مجددا إلحاق دليل حدث، الأكثر بعد إرجاع child id. دقيق دخول أو دليل إلحاق فشل وقت، إنشاء فشل و تحرير activation؛ لا وجود تكملة تعويض دليل حدث أو rollback بروتوكول.

child header و `subagent/descriptor` متابعة يملك استعادة و composition مرجعي.Activation و دقيق parent علاقة متابعة يملك تخويل و إلقاء تمرير مرجعي.mode و label فقط لقطة مرة، نفس نسخة قسم مغادرة قيمة كتابة parent catalog fact و child descriptor.

تسجيل `subagentCatalog` projection شيء تحويل parent fact. هو سوف تخزين، إلحاق، تكرار بديل و فحص نقطة تحقق تسليم إعطاء [`dsh-chunked-list`](../../../../packages/util/chunked-list/README.ar.md) ، بعد من بـ كل كتلة 64 بند حمل دائم stack حفظ واقع، لذلك append الأكثر كثير نسخ head chunk، بـ محدود O(1) عمل إتمام.materialization من قديم إلى جديد وصول chunk، مقابل D بند واقع بـ O(D) وقت إبقاء أب دليل حدث ترتيب. تزامن إنشاء حسب دليل نجاح إلحاق ترتيب ترتيب صف، و child ختم الوقت و id غير متصل.projection checkpoint بـ O(D) تغلب ضخم state؛projection-cache متابعة مختلف خطوة كتابة، و استخدام قائم إنشاء،turn-end و disposal قوي صنع نقطة.

أداة مكتبة يملك قسم كتلة تخطيط و ذلك مشترك سعة كمية معتاد كمية؛ دليل يملك حدث تحقق،fork مرور ترشيح و دليل سطر تحويل. دليل projection state إصدار 2 حفظ عام كتلة قيمة، لذلك projection registry من Session حدث إعادة بناء لا توافق ذاكرة مؤقتة.Session حدث تحميل حمل و عام دليل سطر إبقاء كل منها صيغة.

fork عزل استخدام projection ابتدائي تحويل وقت توفير دقيق `Session.inheritedEventCount`.fold تجاهل اختصار هذا offset قبل `subagent/catalog` حدث.state حفظ inherited offset، لكن لا حفظ كل بند event seq، لأن قبول حكم تحديد قد في fold وقت إتمام.

Headless لقطة أخذ تجميع حسب أب دليل ترتيب قسم إعداد نفس أب فرعي درجة fixture زاوية لون، لا اعتماد فرعي درجة إنشاء ختم الوقت:provider بدء ممكن في مقارنة جديد Session بعد إصدار مقارنة قديم Session. أخذ تجميع مرور مسار أصل مثال إبقاء كل نسخة سجل.

snapshot normalizer سوف يأخذ `childCreatedAt` عودة صفر، لأن هو قدوم ذاتي process clock. حدث ترتيب و مصدر حدث مرجع إبقاء ثابت: متبادل مجاور fact أيضا ممكن قدوم ذاتي ترتيب إنشاء، لذلك متبادل مجاور علاقة لا يستطيع إثبات يمكن تسليم تبديل صفة.

أي جعل replay إدخال إبقاء تاريخ Session generation، حالي writer لقطة مسبق مدة أيضا يتضمن catalog واقع. مقارنة مقارنة إبقاء catalog و ذلك مصدر حدث مرجع؛ تاريخ replay ملف إبقاء ثابت.

## اعتبار مرور بديل خطة

**مسطح مستو غير ممكن تغيير عدد مجموعة.** استخدام `[...facts, fact]` append سوف نسخ D عدد fact، لذلك إنشاء هو O(D). تعديل مشترك عدد مجموعة سوف مخالفة عكس projection state ownership و checkpoint أمان.

**كل fact واحد node linked list.** هو توفير O(1) append و O(D) read، لكن حمل دائم projection checkpoint سوف شكل صار D طبقة JSON تضمين طقم. كل كتلة 64 بند إبقاء تدريجي دخول تكرار مختلط درجة، معا خفض منخفض تضمين طقم عميق درجة.

**مستقل host state مراقبة إخراج.** إرجاع داخلي projection state سوف تكرار قد لديه مراقبة نتيجة آلية، و نسخ و فرعي درجة اكتشاف غير متصل حالة. دليل عرض عبر قائم نوع تحويل projection map توفير مباشر فرعي درجة قائمة.

**حمل دائم SQLite child index.** index سوف لـ parent Session سجل في قد لديه ترتيب fact زيادة آخر طقم كتابة مسار،reconciliation protocol،schema و corruption surface.

**تكملة تعويض فشل حدث.** في ابتدائي prompt دقيق دخول قبل سجل catalog membership سوف جذب دخول ثاني نوع operation، إعداد مقابل قاعدة،rollback تنظيف و client reconciliation. يأخذ نجاح واقع دفع متأخر إلى دقيق دخول إتمام بعد يكفي حذف هذا بروتوكول.

## عاقبة

Session مراقبة و عميل لقطة عبر `projections.values.subagentCatalog` كشف مباشر فرعي درجة قائمة. دليل حالة تغير وقت،projection تغيير إشعار إصدار كامل قائمة. كل مرة عرض حساب حساب صار هذا لـ O(D) ، لذلك D مرة إنشاء تراكم حساب عرض عمل كمية ممكن لـ O(D²) ؛ هذا امتداد استخدام قائم projection آلية. مباشر فرعي درجة و بعد بديل قائمة ما زال استخدام Session لغة مادة مكتبة و فرعي درجة هوية projection.

لا إقرار تعرف هذا required event backend سوف حسب قائم Session event آلية رفض سجل. دليل إسقاط لا عبر مسح قديم فرعي درجة سجل قدوم إعادة بناء ناقص أب درجة واقع.

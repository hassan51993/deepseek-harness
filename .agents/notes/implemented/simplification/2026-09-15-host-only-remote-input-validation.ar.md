# Agent Note: فقط في Host تحقق Remote إدخال

Status: implemented

[English](2026-09-15-host-only-remote-input-validation.md) | العربية

## Problem

توليد Client Remote طريقة عام TypeScript توقيع، و عبر Connection يأخذ استدعاء تحويل إعطاء Host Gateway؛Host Gateway قد في lookup أو عمل خدمة استدعاء قبل فحص دقيق معامل حقل، تنفيذ كل صارم إطار إدخال codec، و تحقق JSON بيانات.Client مجددا لـ كل معامل تنفيذ مقابل schema سوف تكرار هذا مرة تحقق، في Client في نسخة تحويل أصل هذا كسول صفة إنشاء Zod schema، أيضا سوف يجعل بلا فاعلية JavaScript استدعاء أصل حسب أي واحد جانب أولا رفض بينما مشي مختلف فشل مسار.

Client ما زال حاجة descriptor بيانات وصفية قدوم فحص موضع معامل عدد كمية، يأخذ قيمة خريطة لـ أداة اسم wire حقل، ربط scoped Context identity، حذف صريح لـ undefined اختياري قيمة، و دمج إلغاء إشارة. هذه عملية كل لا حاجة تنفيذ وقت التشغيل schema.

## Decision

Client Remote في تركيب contribution وقت تحقق descriptor كامل صفة، مع بعد مباشر تحويل إرسال حمل نوع معامل و ربط Context identity، لا استدعاء invocation codec factory. موضع معامل عدد كمية خطأ و Client Context binding ناقص ما زال في محلي رفض. نجاح واحد عنصر نتيجة و تدفق بند نفس مثال لا مرور Client جانب نوع تحليل مباشر نقل تمرير.

Host Gateway يملك وقت التشغيل إدخال تحقق. هو فحص دقيق أداة اسم حقل، تنفيذ صارم إطار معامل و identity codec، تحقق JSON قيمة، و في استدعاء عمل خدمة شفرة قبل إتمام lookup. التفاف مرور توليد TypeScript API JavaScript استدعاء جهة، ذلك طلب وصول Host بعد سوف استلام إلى Host `gateway/input-invalid` نتيجة؛ لا يمكن دخول تحميل جسم قيمة فإن ممكن في تسلسل تحويل وقت فشل.

توليد Remote contribution متابعة يحمل codec بيانات وصفية، لأن Host و Client ناتج ما زال مشترك `InvocationDescriptor`،Client تركيب أيضا ما زال اشتراط كل Client توفير قيمة حقل أداة تجهيز صارم إطار codec. كامل Remote هيكل بنية رؤية [Typert توليد Remote طريقة استدعاء](../architecture/2026-08-02-typert-remote-method-calls.ar.md) ؛ هذا قرار فقط يحل محل منها Client جانب تنفيذ استدعاء codec جزء.

## Alternatives considered

- **معا إبقاء Client و Host إدخال تحليل.** هذا مثال قدرة يجعل شاذ شكل JavaScript استدعاء جهة أكثر مبكر استلام إلى محلي خطأ، و في نقل قبل استبعاد حذف كائن في لم إعلان خاصية؛ لكن أي جعل Host يجب مستقل تحقق، كل مرة صالح استدعاء ما زال يلزم تكرار نسخة تحويل و تنفيذ schema.
- **من Remote Client ناتج في إزالة codec بيانات وصفية.** هذا مثال يمكن دخول واحد خطوة تقليص صغير توليد Client شفرة، لكن سوف تغيير مشترك descriptor و generator بروتوكول. إبقاء كسول صفة factory قدرة متابعة فحص صارم إطار contribution، معا لا إنتاج وقت التشغيل schema بنية صنع صار هذا.

## Consequences

صحيح معتاد Client استدعاء لم يعد قسم إعداد invocation schema، أيضا لم يعد تكرار تنفيذ Zod parse.Host تحقق ما زال هو lookup و عمل خدمة تنفيذ قبل مرجعي فحص،Client شفرة فإن إبقاء معامل عدد كمية،Context binding، إلغاء و contribution دورة الحياة لذا عائق.

شاذ شكل وقت التشغيل قيمة سوف مقارنة بـ قبل أكثر متأخر فشل. لم إعلان كائن خاصية ممكن في Host codec استبعاد حذف هو جمع قبل مرور مرور يمكن معلومة تحميل جسم، لذلك من غير ممكن معلومة كائن أو يحتوي سري سري كائن إرسال توليد طلب استدعاء جهة يجب بنية صنع قد إعلان DTO، لا يستطيع يأخذ Client تحليل عند عمل انفصال حساس خطوة.Client اختبار ثابت أصل مثال تحويل إرسال سلوك،Host اختبار ثابت صارم إطار إدخال و JSON إدخال رفض.

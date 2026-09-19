# Agent Note: Session تاريخ بيانات توافق

Status: proposed

[English](2026-09-10-session-data-compatibility.md) | العربية

## Problem

مستخدم صلة قلب ترقية بعد قديم محادثة هل ما زال قدرة فتح، بينما لا هو داخلي صنف اسم. سحب كائن إعادة بنية لا يستطيع ترتيب حمل تغيير مغناطيس قرص بايت أو اشتراط يد عمل نقل نقل جلسة. حالي `0.1.5-rc.1` checkout كتابة Session format V3، و قد يتضمن اختراق اختراق V3 released-format migration chain.

## Proposal

### من 0.1.5-rc.1 / V3 بدء

V3 هو حالي durable Session format، لا هو projection-cache version.`SESSION_FORMAT_VERSION` هو writer authority؛format catalog يملك released v0→v1→v2→v3 مسار، منها يشمل مستقل V2-to-V3 stage و ذلك delivery guards. أصلي V3 تحقق و تاريخ صيغة دخول ترحيل هو اثنان بند مستقل مسؤولية مهمة.

لا نيل تغطية قديم generation أو تلقائي تخفيض. ترحيل كتابة جديد current generation، قديم committed generation إبقاء إعطاء فحص و استعادة؛ حالي runtime يمكن عبر catalog فتح قد إصدار قديم صيغة، لكن لا تحمل وعد قديم runtime قدرة قراءة V3.

### مقابل عادي مستخدم أثر

مرحلة مقطع 1–3 فقط إعادة ترتيب شفرة كل حق، لا تغيير V3 Session JSONL bytes،`SESSION_FORMAT_VERSION` أو مستخدم بدء طريقة. عادي مستخدم بلا حاجة بسبب هذا مرة refactor مقدار خارج يد عمل ترحيل أو أكثر تعديل إعداد. أول مرة فتح تلقي دعم حمل قديم صيغة وقت، قائم migration pipeline سوف دقيق تجهيز تزامن نشر current V3 generation؛ كبير سجل استخدام تدفق صيغة stage، تجنب تجنب whole-artifact داخل تخزين ذروة قيمة.

ترقية قبل ما زال ينبغي إبقاء `DSH_HOME` معتاد قاعدة تجهيز نسخة. إذا فتح فشل، ينبغي إبقاء كامل session generation و خطأ معلومة، لا يلزم حذف قديم ملف؛ لم قدوم provider أيضا يجب يأخذ unsupported future version،corruption،ownership conflict و migration failure منطقة قسم تقرير إبلاغ. استعلام بحث جذب و أخرى إرسال توليد بيانات من نظام إعادة بناء، مستخدم لا حاجة يد عمل ترحيل.

### Provider استبدال بعد ثابت كمية

أكثر تبديل داخل تخزين تنفيذ،JSONL provider أو بحث بحث جذب لا تغيير منطق SessionId،header، حدث ترتيب،fork lineage و surface.Storage provider مسؤول قد إصدار صيغة قراءة؛search/statistics cache هو إرسال توليد بيانات، يمكن من مواصفة Session محتوى إعادة بناء، لا يستطيع عكس نحو يصبح استعادة مرجعي.

## Alternatives considered

**في refactor داخل إعادة تعريف V3.** رفض؛ قد إصدار بيانات توافق مستقل في سحب كائن stack. هذا عمل يجب إبقاء قائم format authority و migration evidence، بينما لا هو آخر بناء مستو سطر تعريف.

**يأخذ كل اسم لـ V3 مكون إصدار كل عند عمل Session V3.** رفض؛Session log و projection-cache انتظار إرسال توليد صيغة لديه مختلف durability و استعادة قاعدة.

## Acceptance criteria

- قائم V3 catalog،V2-to-V3 stage،native validation و released-format fixtures إبقاء عبر.
- مرحلة مقطع 1–5 و provider سحب أخذ لا تغيير V3 مغناطيس قرص صيغة؛ لم قدوم صيغة تغير آخر لديه إصدار، ترحيل، إعادة بدء و تراجع دليل.
- مستخدم لا يحتاج يد عمل تحرير سجل؛ خطأ إبقاء يمكن استعادة بيانات و إعطاء خروج واضح صنف آخر.

## Risks

رئيسي يلزم ريح خطر هو يأخذ جديد سحب كائن اقتران دمج إلى V3 حالي JSONL provider، أو يأخذ يمكن إعادة بناء projection cache عند عمل مواصفة Session بيانات. استبدال provider يجب إبقاء released-format contract، معا يجعل عادي وظيفة شفرة نظر لا إلى شيء إدارة تخطيط.

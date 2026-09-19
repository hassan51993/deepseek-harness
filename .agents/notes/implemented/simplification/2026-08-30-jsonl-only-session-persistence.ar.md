# Agent Note: JSONL-only first-party Session persistence

Status: implemented

[English](2026-08-30-jsonl-only-session-persistence.md) | العربية

## Problem

منتج تسليم و فعلي استخدام JSONL بصفة مرجعي Session store، بينما اختياري SQLite Session persistence provider استخدام ثاني نوع شيء إدارة صيغة تكرار تنفيذ نفس منطق خدمة. لذلك، كل بند Session اتفاق،event envelope تغيير، استعادة قاعدة،package graph، منصة اختبار و صيغة ترحيل كل يلزم تحمل تحمل ثاني طقم تنفيذ و اختبار مستطيل دفعة، أي جعل تسليم profile و لا اختيار هو. قد إصدار Session صيغة ترحيل أيضا حاجة إبقاء دقيق تدريجي Session مصدر generation ثابت، معا إصدار أداة اسم إصدار بعد استمرار؛ مفرد قاعدة بيانات provider حاجة آخر طقم غير ممكن تغيير generation transaction تصميم، لكن لا يوجد خدمة حالي نشر.

SQLite كل نص Session-query provider لا هو آخر نوع مرجعي store. هو عبر `ctx.sessionPersistence` مراقبة حفظ دائم، و صيانة مستقل، يمكن إسقاط إرسال توليد بحث جذب. عام SQLite domain-KV provider أيضا و Session سجل غير متصل.

## Decision

`@deepseek-ai/dsh-session-persistence-jsonl` هو `ctx.sessionPersistence` وحيد first-party تنفيذ. سحب كائن Service Definition إبقاء خلفية غير متصل، جعل مستودع خارج provider ما زال يمكن تنفيذ نفس خدمة، لكن مستودع فقط يملك و اختبار واحد نوع مرجعي Session شيء إدارة صيغة.

مستودع لم يعد يتضمن `@deepseek-ai/dsh-session-persistence-sqlite` package، ذلك schema resource، خلفية مخصص استخدام اختبار، إعداد واجهة و Windows differential lane. عبر package حفظ دائم اختبار استخدام حقيقي JSONL provider أو owner-local fake.`@deepseek-ai/dsh-session-query-sqlite` متابعة بصفة اختياري FTS5 query provider استخدام مستقل، يمكن إعادة بناء قاعدة بيانات،`@deepseek-ai/dsh-storage-sqlite` متابعة بصفة عام domain-KV provider.

حالي build لا فتح أو ترحيل قد حذف provider كتابة خروج قائم قاعدة بيانات. حاجة منها محتوى operator يجب أولا استخدام ما زال يتضمن هذا provider build تصدير منطق Session، مجددا تنفيذ ترقية.

## Alternatives considered

- **إبقاء SQLite بصفة اختياري differential backend.** رفض، لأن لم يتم اختيار إنتاج provider ما زال سوف صار ضعف زيادة كل بند durable format،lifecycle، منصة و ترحيل معنى خدمة؛contract fake و JSONL provider قد قدرة تغطية مشترك خدمة، بلا حاجة إبقاء ثاني نوع مرجعي صيغة.
- **إبقاء فقط قراءة SQLite import package.** رفض، لأن في لا يوجد فعلي نشر حاجة وقت، هو ما زال سوف إبقاء package graph و schema صيانة صار هذا. إذا حقيقي إبقاء قاعدة بيانات حاجة استعادة، لم قدوم يمكن مفرد وحيد تصميم recovery tool.
- **يأخذ Session-query SQLite قاعدة بيانات بصفة persistence.** رفض، لأن هذا قاعدة بيانات هو يملك مستقل ownership،schema و إعادة بناء دلالة يمكن إسقاط projection؛ يأخذ هو عند عمل مرجعي مصدر سوف دمج اثنان نوع غير متصل تخزين مسؤولية.

## Consequences

Session persistence فقط لديه واحد نوع first-party شيء إدارة صيغة و واحد بند first-party durability path. ترحيل stack يمكن إبقاء تدريجي Session JSONL generation مسار، بايت و inode ثابت، معا ترتيب هو إصدار نهائي بعد استمرار، بينما بلا حاجة تنفيذ و سطر قاعدة بيانات transaction protocol.SQLite search إبقاء متاح، ذلك integration test إثبات هو مراقبة JSONL، بينما لا هو مشترك مرجعي قاعدة بيانات.

حذف provider هو إبرة مقابل ذلك اختياري قاعدة بيانات ملف واضح compatibility cut. هذا تغيير تقليص صغير تنفيذ و CI surface، لكن أيضا إزالة أكثر قوي database/WAL تخزين خيار؛ لم قدوم provider حاجة حالي owner، نشر يحتاج طلب، كامل shared-contract evidence، و ذاته format-transition policy.

# apps/web متصفح e2e

[English](README.md) | العربية

هذه اختبار في عملية داخل بدء حقيقي web تركيب، و استخدام حقيقي Chromium عبر حقيقي HTTP قيادة هو. هذا lane تشغيل آلية——نمط،fixture(اختبار قبل وضع بيانات) ،golden، و و `dsh web` بين لحظة معنى إبقاء تركيب فرق مختلف——سجل في [`scaffold.ts`](scaffold.ts) و [متصفح e2e Agent Note](../../../.agents/notes/implemented/testing/2026-07-24-web-gui-browser-e2e-lane.ar.md) في.

## إتمام حالة مراقبة

اعتماد حالة حالة استخدام استخدام Workspace، وصل قبول، مرفق عنصر و نموذج تدفق شاشة عائق، منطقة قسم مرئي في بين حالة و قد إتمام عملية. تفصيل حال إغلاق انتظار إطار هيكل مرور عبور انتهاء؛ عودة ملف تحقق لـ seed Session ضبط صريح عنوان، و عبر إعادة تحميل تتبع أثر هذا هوية. مشاركة رؤية [CI fixture تزامن قرار](../../../.agents/notes/implemented/testing/2026-09-08-ci-completion-observations.ar.md).

## هذه هو Host وجه اختبار

هو جمع في أصل `tsconfig.host.json` في فعل نوع فحص، بينما لا في Client aggregate في، لأن هو جمع مباشر قراءة Host خدمة:`ctx.connection`،Host جانب `SessionStore` و `ctx.sessionProjectionCache`. وقت التشغيل قيادة متصفح و لا جعل واحد ملف يصبح Client برنامج واحد جزء——اثنان عدد face في نفسه مفتاح فوق بـ مختلف خدمة دمج Cordis `Context`، لذلك مفرد عدد برنامج لا يمكن معا نظر رؤية اثنان من. يأخذ هذه ملف نقل دخول Client aggregate سوف يجعل كل واحد موضع Host خدمة وصول كل لا يمكن تحرير ترجمة.

## لا يلزم في هذا import `@deepseek-ai/dsh-client-*`

import واحد Client حزمة——بلا نقاش قيمة أيضا هو نوع——كل سوف يأخذ هو كامل TypeScript عمل مسار، و هو مرجع كل عمل مسار سحب دخول **Host بناء رسم**. هذا قد حفرة مرور هذا lane مرة: أربعة عدد Client مستهلك حزمة مرجع `api/remotes` Client face، بينما هذا face يجب انتظار Host tsdown توليد `@deepseek-ai/dsh-goal/remote` بعد عندئذ قدرة تحرير ترجمة، في هو Host بناء مرحلة مقطع تغيير صار في انتظار واحد من هو ذاتي ذات إنتاج خروج ناتج.

عند بعض عدد مشهد حاجة Client يحتفظ معتاد كمية أو صاف دالة وقت، تعديل لـ في هذا موضع مرآة مثل واحد نسخة، و ضيق ملاصق حال واحد بند ملاحظة تفسير إسقاط import نقطة واضح مصدر وحدة. هذا مثال عائم نقل سوف جدول الآن لـ اختيار جهاز لم أمر في أو مرآة مثل قيمة قديم قديم——هو صدى مضيء فشل، أبدا سوف هو ساكن صامت عبر.`scaffold.ts` حسب هذا قاعدة مرآة مثل welcome-notice namespace، تأكيد حقل، إصدار و يتم تأكيد العربية نص سجل.

built-client harness هو مثال خارج.`assembled-boot.ts` import `AppWebEntry`،boot manifest(بيانات وصفية بيان) نوع و `RemoteMock`؛`assembled-remote.ts` import Client test runtime افتراضي استجابة و `RemoteMock`. هذه حزمة هو صريح عمل مسار مرجع، لأجل عبر اختبار يحتفظ carrier بدء حقيقي shell.chat مشهد ما زال في `support.ts` في مرآة مثل `conversationContextKey`، بينما لا import ذلك Client owner.

لا يوجد أي آلية قوي صنع هذا بند قاعدة؛ اعتماد review حراسة إقامة هو.

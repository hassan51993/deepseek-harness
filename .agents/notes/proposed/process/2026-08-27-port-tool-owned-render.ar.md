# Agent Note: يأخذ tool-owned render نقل غرس إلى حالي DSH API

Status: proposed

[English](2026-08-27-port-tool-owned-render.md) | العربية

## مشكلة

`dsh-tool-owned-render` أصل نوع (`Arabiczjc/dsh-tool-owned-render`) حمل لديه `read`،`bash`،`write`/`edit`،`grep`/`glob`،`web_search`/`web_fetch` tool-owned render تسجيل بند، أساس في قديم API تحرير كتابة:`ToolCallBlock` كشف `callView` / `resultView`، عميل قدرة أخذ إلى host `presentResult` إخراج. حالي master من أصلي `block.call` / `block.content` / `block.meta` دفع توجيه عميل بطاقة،`ctx.slots` أيضا حاجة `@deepseek-ai/dsh-client-ui-renderer/client` وحدة زيادة قوي. مباشر دمج أصل نوع لا يستطيع عبر نوع فحص، لذلك هذه تسجيل بند لا مرور نقل غرس لا يمكن إصدار.

## رفع سجل

- إضافة جديدة `packages/client/tool-owned-render` workspace حزمة.
- يأخذ `read`،`bash`،`write`/`edit`،`grep`/`glob`،`web_search`/`web_fetch` تسجيل بند نقل غرس إلى من حالي `ToolCallBlock` حقل دفع توجيه.
- زيادة `read_image` تسجيل بند، استخدام نفس طقم ToolCard/Segment أصل لغة.
- عبر `dsh-client-ui-renderer` وصل عبر `ctx.slots` نوع زيادة قوي.
- نقل غرس مفرد وحيد دفع دخول، إبقاء PR #2828 يمكن دمج.

## قد اعتبار بديل خطة

- **مباشر دمج أصل نوع و حينئذ أرض إصلاح نوع خطأ** — مرفوض: كل تسجيل بند عكس صحيح كل يلزم حسب حالي `ToolCallBlock` حقل إعادة دفع توجيه، نقل غرس حينئذ هو نفس نسخة عمل، فقط هو قديم `callView` / `resultView` عقد نحو قد لا وجود.
- **يأخذ نقل غرس و دخول PR #2828** — مرفوض:image بطاقة هو واحد نطاق واضح مفرد واحد وظيفة، مجددا إضافة واحد جديد حزمة و خمسة عدد تسجيل بند سوف توسيع كبير هذا قد جدا كبير PR مراجعة فحص وجه.

## تحقق استلام معيار

- `packages/client/tool-owned-render` بصفة workspace حزمة وجود.
- نقل غرس بعد تسجيل بند من حالي `ToolCallBlock` حقل دفع توجيه بطاقة حالة، و في master فوق عبر نوع فحص.
- `read_image` تسجيل بند و `read` استخدام نفس طقم أصل لغة تصيير.
- `ctx.slots` نوع زيادة قوي عبر `dsh-client-ui-renderer` تحليل.
- PR #2828 مستقل في هذا نقل غرس دمج.

## ريح خطر

- نقل غرس ممكن لا يمكن تكرار الآن أصل نوع دقيق نظر شعور إخراج، لأن حالي بطاقة أصل لغة و قديم `callView` / `resultView` عقد نحو مختلف.
- نقل غرس دفع دخول خلال API متابعة عائم نقل سوف جعل هذا رفع سجل مرور وقت؛ تحقق استلام معيار في نقل غرس وقت حسب عند وقت master إعادة نواة مقابل.

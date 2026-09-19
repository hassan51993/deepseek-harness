---
description: "DeepSeek Harness حزمة مساحة العمل:packages/ تحت npm حزمة مثل أي قسم مجموعة، كل مجموعة مسؤول ماذا، و قيد هو جمع اتفاق."
kind: "package-group"
---

# حزمة

[English](README.md) | العربية

## عام وصف

harness من `packages/` تحت npm حزمة تجميع بينما صار، حسب قدرة نظام صف قسم مجموعة: جلسة و agent loop(ذكي جسم حلقة) ، موجه إلى نموذج أداة،shell و نظام الملفات تنفيذ،Web وصول،subagent انتظار انتظار. يأخذ هذا صفحة عند عمل قمة طبقة أرض رسم استخدام: أولا بحث إلى يملك بعض قدرة مجموعة، مجددا فتح ذلك README فحص نظر حزمة قائمة. كل حزمة كل بـ `@deepseek-ai/dsh-*` لـ أثر مجال، فقط يخص واحد مجموعة؛ كل مجموعة README كل هو هذا قدرة نظام صف مرجعي حزمة خريطة.

## دليل

- [حزمة قسم مجموعة](#package-groups)
- [إصدار مسبق مدة](#release-expectations)
- [اعتماد](#dependencies)
- [حزمة README اتفاق](#package-readme-contracts)
- [ملاحظة تطوير](#dev-note)

-----

<a id="package-groups"></a>
## حزمة قسم مجموعة

كل حزمة فقط يخص واحد مجموعة؛ جديد حزمة إضافة دخول قائم مجموعة، جديد مجموعة فإن تحديث ذلك ذاته README و هذا جدول.

| مجموعة | مسؤولية |
|---|---|
| [`core/`](core/README.ar.md) | منتج API رئيسي جاف: جلسة، نص التوجيه، أداة،agent خدمة و أداة جسم حلقة |
| [`api/`](api/README.ar.md) | Remote BFF تركيب إعداد و Typert RPC شبكة صلة |
| [`typert/`](typert/README.ar.md) | نوع رسم توليد، ناتج تحميل و وقت التشغيل سجل التسجيل |
| [`goal/`](goal/README.ar.md) | نفس جلسة goal حفظ دائم و دورة الحياة |
| [`schedule/`](schedule/README.ar.md) | فقط حد جلسة داخل تحديد وقت لاحق عملية |
| [`feedback/`](feedback/README.ar.md) | شخص صنف عكس تغذية أخذ تجميع و أمر |
| [`identity/`](identity/README.ar.md) | مشترك مجهول اسم هوية |
| [`llm/`](llm/README.ar.md) | LLM(كبير لغة نموذج) قدرة نظام صف: سحب كائن خدمة + مزود مهايئ |
| [`subprocess/`](subprocess/README.ar.md) | عملية فرعية قدرة نظام صف:Service Definition + محلي عملية شجرة مزود |
| [`ssh/`](ssh/README.ar.md) | POSIX بعيد طرف اتصال و إعداد طقم نظام الملفات، عملية فرعية و صندوق رملي مزود |
| [`shell/`](shell/README.ar.md) | Bash قدرة نظام صف: منفذ seam، محلي تنفيذ، موجه إلى نموذج أداة |
| [`terminal/`](terminal/README.ar.md) | حمل دائم PTY قدرة نظام صف: حد تحديد كل من نطاق جلسة، محلي تنفيذ، موجه إلى نموذج أداة |
| [`ptc-runtime/`](ptc-runtime/README.ar.md) | PTC تنفيذ قدرة عائلة:Service Definition + صندوق رملي Node مزود + PTC mode Consumer |
| [`computer-use/`](computer-use/README.ar.md) | حسب اسم وحيد احتلال تسجيل طاولة وجه مزود |
| [`browser-use/`](browser-use/README.ar.md) | حسب اسم وحيد احتلال تسجيل متصفح مزود |
| [`sandbox/`](sandbox/README.ar.md) | عملية حد seam؛bwrap،Landlock،Seatbelt خلفية |
| [`deliverables/`](deliverables/README.ar.md) | جولة تسليم شيء: صريح ملف تسليم و سجل مساحة العمل تعديل |
| [`fs/`](fs/README.ar.md) | نظام الملفات قدرة نظام صف:seam، محلي تنفيذ، موجه إلى نموذج ملف أداة، اكتشاف أداة |
| [`lsp/`](lsp/README.ar.md) | LSP قدرة نظام صف:seam، عام stdio مزود و `lsp` أداة |
| [`skill/`](skill/README.ar.md) | skill(تقنية قدرة) قدرة نظام صف: مزود سجل التسجيل، محلي مزود، موجه إلى نموذج دليل/loader |
| [`compaction/`](compaction/README.ar.md) | ضغط (compaction) قدرة نظام صف:Service Definition + أساس أساس مزود + أمر Consumer |
| [`context/`](context/README.ar.md) | نموذج مرئي طلب سياق:workspace إشارة أمر، وقت سياق، مرجع |
| [`subagent/`](subagent/README.ar.md) | subagent قدرة نظام صف: مزود سجل التسجيل اتفاق و موجه إلى نموذج تفويض حمل أداة |
| [`jobs/`](jobs/README.ar.md) | عام خلفية مهمة وقت التشغيل و موجه إلى نموذج عمل عمل تحكم أداة |
| [`experimental/`](experimental/README.ar.md) | مسبق مستقر أصل نوع، يتضمن صريح خاص مثال خارج |
| [`workflow/`](workflow/README.ar.md) | سير العمل seam،PTC عملية جذب محرك، موجه إلى نموذج `workflow`/`ralph` أداة |
| [`webhook/`](webhook/README.ar.md) | قد تحقق خارجي حدث، تلقي معلومة قاعدة و أي إرسال أي ترك Workspace جلسة |
| [`web/`](web/README.ar.md) | Web قدرة نظام صف:seam، بحث/نيل أخذ مزود، موجه إلى نموذج Web أداة |
| [`document/`](document/README.ar.md) | مشترك مضيف Office إلى PDF تحويل |
| [`attachment/`](attachment/README.ar.md) | حمل دائم مرفق عنصر معرف، تحقق، محلي محتوى بحث عنوان تخزين |
| [`spill/`](spill/README.ar.md) | spill قدرة نظام صف: تخزين seam، محلي تنفيذ، أداة نتيجة spill سياسة |
| [`todo/`](todo/README.ar.md) | موجه إلى نموذج `todo_write` أداة |
| [`plan/`](plan/README.ar.md) | Plan تنسيق عمل حالة، توفير مباشر دخول أمر و مرور مراجعة خروج |
| [`preset/`](preset/README.ar.md) | من preset `cordis.yml` حسب جلسة تجميع agent |
| [`guard/`](guard/README.ar.md) | حلقة حماية توليد حراسة حماية: بناء اقتراح صفة تكرار استدعاء رفع تنبيه + `tools/execute` قطع توقف وقت قوي صنع منفذ |
| [`bundle/`](bundle/README.ar.md) | يمكن تثبيت `dsh --profile` رقعة طبقة |
| [`extensions/`](extensions/README.ar.md) | agent وقت التشغيل ذاتي تعديل: فوري إضافة/خدمة فحص و نموذج الذي كتابة تركيب/إزالة |
| [`mcp/`](mcp/README.ar.md) | سوف خارجي Model Context Protocol خادم أداة وصل دخول لـ أصلي أداة |
| [`hooks/`](hooks/README.ar.md) | خطاف جسر وصل + مشترك Claude Code/Codex خط بروتوكول مكتبة |
| [`session/`](session/README.ar.md) | حمل دائم جلسة بيانات مستو وجه: حفظ دائم seam + خلفية، إسقاط seam، أساس في سجل عنوان، جلسة فوق تقرير |
| [`session-query/`](session-query/README.ar.md) | جلسة فحص بحث نظام صف: منطق لغة مادة مكتبة، محدود قراءة، دم حافة، دلالة مرور ترشيح،SQLite كل نص بحث |
| [`settings/`](settings/README.ar.md) | مستخدم ضبط seam + أساس في ملف مزود |
| [`credentials/`](credentials/README.ar.md) | اعتماد مرجع و اعتماد سجل seam + بيئة متغير أولوية في `.env` مزود + حاجة نحو شخص استفسار سؤال تخويل مسار |
| [`storage/`](storage/README.ar.md) | غير جلسة تخزين في محور + خلفية + مجال شكل صيغة |
| [`workspace/`](workspace/README.ar.md) | Workspace فعلي جسم |
| [`sdk/`](sdk/README.ar.md) | عملية خارج SDK:JSON-RPC بروتوكول و TypeScript عميل/خادم |
| [`acp/`](acp/README.ar.md) | فقط موجه إلى تلقائي تحويل ACP(Agent Client Protocol) خادم |
| [`interaction/`](interaction/README.ar.md) | شخص آلة تنسيق عمل مستو وجه: دفعة دقيق/تفاعل seam، إذن مسبق ضبط، أمر، استفسار سؤال مستخدم أداة |
| [`boot/`](boot/README.ar.md) | مشترك app bin بدء لصق دمج طبقة |
| [`host/`](host/README.ar.md) | web GUI مضيف نصف جانب:API شبكة صلة + HTTP توجيه خادم |
| [`client/`](client/README.ar.md) | web GUI متصفح نصف جانب:shell، بروتوكول طبقة، كائن خدمة،slot،`ui-*` إضافة |
| [`test-support/`](test-support/README.ar.md) | اختبار أساس أساس ضبط تطبيق (testkit، إعادة تشغيل،Loader خطر دخان اختبار) |
| [`runtime-diagnostics/`](runtime-diagnostics/README.ar.md) | وقت التشغيل تشخيص: حسب حزمة ملكية وقت التشغيل ثابت صيغة فحص و تقرير إبلاغ |
| [`util/`](util/README.ar.md) | مجموعة بين مشترك منخفض طبقة صفر اعتماد أداة (`Branded<B>`،home/مسار مساعد مساعدة دالة، مهلة، إبقاء تخزين) |

-----

<a id="release-expectations"></a>
## إصدار مسبق مدة

كبير كثير عدد مجموعة يخص منتج مجموعة، توفير مستقر API. مثال خارج:`experimental/` إصدار وقت لا توفير مستقر صفة أو دعم حمل تحمل وعد،`test-support/`،`runtime-diagnostics/` و `util/` هو توافق صفة مسبق مدة مقارنة منخفض دعم حمل مجموعة.

-----

<a id="dependencies"></a>
## اعتماد

اعتماد رسم من أداة توليد:[docs/module-graph.md](../docs/module-graph.ar.md)(`pnpm run gen-module-graph`،CI في لديه جديد طازج درجة بوابة).

**توسيع إضافة اعتماد Service Definition، أبدا اعتماد أداة جسم مزود.** `dsh-agent-loop` يمكن استبدال؛UI، خطاف و أداة إضافة استخدام `dsh-agent`. تركيب حزمة يمكن اعتماد رئيسي جاف إضافة. قدرة في حاجة مستقل عرض دخول وقت قسم مغادرة Service Definition/Service Provider/Consumer زاوية لون؛ تفصيل رؤية[قدرة seam](../.agents/notes/implemented/architecture/2026-06-13-capability-seams.ar.md).

-----

<a id="package-readme-contracts"></a>
## حزمة README اتفاق

كل حزمة README كل تغطية استخدام طريق، إعداد، نقطة توسيع و[تجربة النموذج](../docs/cookbook/adding-a-package.ar.md#4-write-the-package-readme) ، صف دخول نموذج غير متصل[حذف سماح بيان](../scripts/verify-package-readme-model-experience.ts) حزمة حذف خارج. هو أيضا يلزم يتضمن `## Known Limitations and Deferred Work`، أو صف دخول ذلك[سماح بيان](../scripts/verify-package-readme-limitations.ts). حزمة اتفاق——توجيه خروج، خدمة وصول، ثابت صيغة، اختبار——رؤية [packages/AGENTS.md](AGENTS.md).

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

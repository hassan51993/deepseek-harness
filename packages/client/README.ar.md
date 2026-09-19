---
description: "web GUI متصفح جانب حزمة خريطة: خارج قشرة بدء، متصفح و مضيف عبر معلومة، مشترك عميل خدمة، محلي تحويل، تطوير إعادة تحميل و UI وظيفة إضافة."
kind: "package-group"
---

# client/ — Web GUI متصفح جانب

[English](README.md) | العربية

## عام وصف

`client/` مجموعة توفير dsh web GUI متصفح تجربة، يشمل محادثة، تنقل، ضبط، دفعة دقيق، ملف وصول و أخرى تفاعل وظيفة. إضافة متصفح في مرئي سلوك وقت، طلب اختيار هذا نظام صف في حزمة؛ خدمة طرف صفحة تسليم و مضيف تجميع صار فإن استخدام [`host/`](../host/README.ar.md). هذا نظام صف معا شمول غطاء مشترك متصفح أساس أساس و مخصص باب UI وظيفة، كل فرعي حزمة README يملك ذلك إعداد و سلوك شرح. تحرير كتابة قاعدة رؤية [AGENTS.md](AGENTS.md) ، تحت جهة متبادل صلة وثيقة حل تفسير عبر حزمة تركيب طريقة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

داخل نواة حزمة مسؤول بدء و خدمة في صفحة،UI وظيفة حزمة مسؤول عرض صفحة. كل حزمة README يملك ذاتي ذات اتفاق و إعداد.

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`web/`](web/README.ar.md) | بدء متصفح خارج قشرة | — |
| [`modules/`](modules/README.ar.md) | تحميل متصفح جانب عميل وحدة | `ctx.clientModules` / `ctx.modules` |
| [`connection/`](connection/README.ar.md) | صيانة متصفح و مضيف بين RPC عبر معلومة و حدث إلقاء تمرير | `ctx.connection` |
| [`file-upload/`](file-upload/README.ar.md) | في صفحة خط مسار خارج إرسال أصلي Blob و بايت تدفق طلب جسم | `ctx.fileUpload` |
| [`store/`](store/README.ar.md) | توفير لا اعتماد React observable و لقطة تخزين أصل لغة | — |
| [`hmr/`](hmr/README.ar.md) | في تطوير خلال تحديث جديد عميل إضافة | — |
| [`locale/`](locale/README.ar.md) | توفير محلي تحويل انحراف جيد و رسالة كلمة قاموس | `ctx.locale` |
| [`test-runtime/`](../test-support/client-runtime/README.ar.md) | لـ عميل وظيفة حزمة توفير مشترك مستودع اختبار دعم حمل | — |
| [`ui-renderer/`](ui-renderer/README.ar.md) | سوف slot بيانات ربط إلى React، و تركيب تجميع إتمام تطبيق | `ctx.uiRenderer` |
| [`ui-slots/`](ui-slots/README.ar.md) | تعريف نوع تحويل توسيع Slots و يمكن إعادة استخدام Component Factory | — |
| [`ui-session/`](ui-session/README.ar.md) | يأخذ جلسة تحكم جهاز حالة ملائم إعداد لـ معيار Slot source و خطاف | — |
| [`ui-theme/`](ui-theme/README.ar.md) | تطبيق الذي اختيار لون لون رئيسي عنوان | — |
| [`ui-primitives/`](ui-primitives/README.ar.md) | توفير مشترك React تحكم عنصر، رسم علامة و محتوى مصير | — |
| [`ui-attachment/`](ui-attachment/README.ar.md) | تسجيل إدخال إطار و رسالة صورة مرفق عنصر عرض | — |
| [`ui-layout/`](ui-layout/README.ar.md) | ترتيب صف تطبيق رئيسي يلزم منطقة مجال | — |
| [`ui-dockkit/`](ui-dockkit/README.ar.md) | توفير توقف اعتماد تخطيط عملية و React مكون | — |
| [`ui-sidebar/`](ui-sidebar/README.ar.md) | عرض مساحة العمل و جلسة تنقل | — |
| [`ui-sidebar-right/`](ui-sidebar-right/README.ar.md) | إدارة يمين جانب Sidebar و ذلك tab نوع | `ctx.sidebarRight`, `ctx.sidebarRightTabs` |
| [`ui-sidebar-documentpreview/`](ui-sidebar-documentpreview/README.ar.md) | في يمين جانب Sidebar tab في عرض وثيقة | `ctx.documentPreviews` |
| [`ui-sidebar-browser/`](ui-sidebar-browser/README.ar.md) | في يمين جانب Sidebar tab في تصفح sandboxed HTTP(S) صفحة، يشمل loopback خدمة | — |
| [`resources/`](resources/README.ar.md) | موحد واحد مورد نموذج:`useResource` جلسة معيار خطاف خلف بعد بروتوكول مزود | `ctx.resources` |
| [`ui-sidebar-files/`](ui-sidebar-files/README.ar.md) | يمين جانب Sidebar مساحة العمل ملف شجرة tab نوع | — |
| [`ui-brand-official/`](ui-brand-official/README.ar.md) | استخدام رسمي جهة اسم و علامة ملء ملء عام متصفح صنف لوحة slot | — |
| [`ui-workspace/`](ui-workspace/README.ar.md) | توفير مساحة العمل اختيار و إنشاء واجهة | — |
| [`ui-conversation/`](ui-conversation/README.ar.md) | عرض حالي محادثة و ذلك إدخال واجهة | — |
| [`ui-chat/`](ui-chat/README.ar.md) | إسقاط و تصيير Chat محادثة target | — |
| [`ui-approval/`](ui-approval/README.ar.md) | عرض دفعة دقيق طلب و إرجاع مستخدم قرار | — |
| [`ui-tool/`](ui-tool/README.ar.md) | تحرير ترتيب استدعاء الأداة شجرة و حسب أداة مفتاح تحكم عرض | — |
| [`ui-workflow-run/`](ui-workflow-run/README.ar.md) | يأخذ حمل دائم سير العمل تشغيل إعادة تشغيل لـ تضمين طقم محادثة طي بند | — |
| [`ui-goal/`](ui-goal/README.ar.md) | عرض و إدارة حالي هدف | — |
| [`ui-trajectory/`](ui-trajectory/README.ar.md) | توفير agent(ذكي جسم) نشط حركة أخرى عرض | — |
| [`ui-commands/`](ui-commands/README.ar.md) | توفير جلسة شعور معرفة أمر اكتشاف و توزيع | — |
| [`ui-input-trigger/`](ui-input-trigger/README.ar.md) | تنسيق ضبط داخل ربط أمر و مرجع بناء اقتراح | — |
| [`ui-skill/`](ui-skill/README.ar.md) | نحو داخل ربط بناء اقتراح إضافة skill(تقنية قدرة) مرجع | — |
| [`ui-reference/`](ui-reference/README.ar.md) | موحد واحد Web `@file` / `@session` مرجع source | — |
| [`ui-subagent/`](ui-subagent/README.ar.md) | توفير subagent تنقل، فرعي درجة transcript(نص سجل) حالة و داخل ربط مرجع | — |
| [`ui-schedule/`](ui-schedule/README.ar.md) | في فقط قراءة عنوان شريط دليل في صف خروج حالي جلسة في توليد فاعلية رفع تنبيه | — |
| [`ui-jobs/`](ui-jobs/README.ar.md) | في جلسة عنوان شريط صف خروج حالي جلسة خلفية مهمة | — |
| [`ui-model-selection/`](ui-model-selection/README.ar.md) | في محادثة واجهة في توفير نموذج اختيار | — |
| [`ui-permission-presets/`](ui-permission-presets/README.ar.md) | إعداد افتراضي إذن و تبديل حالي جلسة وصول نمط | — |
| [`ui-plan/`](ui-plan/README.ar.md) | عرض توليد فاعلية في plan mode حالة و ذلك خروج تحكم عنصر | — |
| [`ui-settings-plugins/`](ui-settings-plugins/README.ar.md) | مسؤول «إضافة» ضبط قسم منطقة، ذلك وسم صفحة نقطة توسيع و يمكن إعداد مضيف مستو وجه إضافة بطاقة | — |
| [`ui-user-questions/`](ui-user-questions/README.ar.md) | عرض agent طلب تفاعل صيغة مشكلة | — |
| [`ui-agent-preset/`](ui-agent-preset/README.ar.md) | اختيار جلسة agent مسبق ضبط و تحرير كتابة مسبق ضبط تركيب | — |
| [`ui-settings/`](ui-settings/README.ar.md) | تحمل تحميل ضبط واجهة و ذلك توسيع منطقة مجال | — |
| [`ui-settings-general/`](ui-settings-general/README.ar.md) | توفير معتاد قاعدة ضبط قسم منطقة | — |
| [`ui-settings-models/`](ui-settings-models/README.ar.md) | توفير نموذج مزود إعداد و DeepSeek جذب توجيه | — |
| [`ui-plugin-manager/`](ui-plugin-manager/README.ar.md) | مساهمة جانب شريط “إضافة” وجه لوح: تثبيت، تفعيل، توقف استخدام، إعادة محاولة و تركيب قد تثبيت حزمة | — |
| [`ui-settings-plugin-inventory/`](ui-settings-plugin-inventory/README.ar.md) | نحو «إضافة» ضبط مساهمة فقط قراءة Host Loader بيان وسم صفحة | — |
| [`ui-deliverables/`](ui-deliverables/README.ar.md) | توليد تعديل ملف بطاقة و ذلك مقابل مقارنة tab، تسليم ملف بطاقة و يمكن نقر نهائي استجابة ملف مرجع | — |
| [`ui-message-feedback/`](ui-message-feedback/README.ar.md) | ملاحظات واجهة: مساعدة يد رسالة عملية بند في تدريجي رسالة مدح دوس، و نقطة مدح، نقطة دوس و `/feedback` خلف بعد ملاحظات نابض نافذة | — |
| [`ui-directory-picker-browse/`](ui-directory-picker-browse/README.ar.md) | موجه إلى مساحة العمل دليل مسار تطبيق داخل دليل تصفح واجهة | — |
| [`ui-directory-picker-native/`](ui-directory-picker-native/README.ar.md) | قيادة محلي Desktop أو Host OS اختيار جهاز أصلي دليل اختيار واجهة | — |
| [`ui-open-in-app/`](ui-open-in-app/README.ar.md) | في قد تثبيت تطبيق في فتح مساحة العمل دليل جلسة عنوان شريط تفكيك قسم حسب زر | — |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار و اثنان نسخة يملك عبر حزمة تركيب قرار Agent Note قراءة بدء، مجددا نظر خدمة في هذا صفحة مضيف نصف جانب.

- [عميل وحدة فرعي نظام](../../docs/subsystems/client-modules.ar.md)——web إضافة جدول:`dsh.client` إعلان، بدء رسم بروتوكول و bundle توجيه.
- [slot نظام معيار](../../.agents/notes/implemented/architecture/2026-07-22-slot-type-chain-implementation.ar.md)——مرجعي slot نموذج: تسجيل،props نسخة مقدار و تخزين.
- [web عميل هيكل بنية Agent Note](../../.agents/notes/implemented/architecture/2026-07-19-gui-web-client-architecture.ar.md)——تحميل سلسلة، كائن طبقة و عميل خدمة.
- [مضيف مجموعة أرض رسم](../host/README.ar.md)——خدمة في هذا متصفح نصف جانب مضيف نصف جانب.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

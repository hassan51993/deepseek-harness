# DeepSeek Harness Python SDK

[English](README.md) | العربية

لأجل بـ عملية فرعية طريقة قيادة DeepSeek Harness Python حزمة. عميل SDK عبر stdio استخدام حسب سطر قسم فصل JSON-RPC و داخل وضع وقت التشغيل عبر معلومة.

## حزمة

| دليل | توزيع اسم/وحدة | مسؤولية |
|---|---|---|
| [sdk](sdk/README.zh.md) | `deepseek-harness-sdk` / `deepseek_harness` | عال طبقة جولة API و منخفض طبقة JSON-RPC عميل |
| [sdk-runtime](sdk-runtime/README.zh.md) | `deepseek-harness-runtime-bin` / `deepseek_harness_runtime` | داخل وضع `dsh` CLI(أمر سطر واجهة) يمكن تنفيذ برنامج و أصلي مرافق مع ملف |

## سلوك

حذف غير استدعاء جهة اختيار آخر عدد `dsh` يمكن تنفيذ برنامج أو profile، لا فإن SDK سوف بدء مطابقة داخل وضع `dsh --profile sdk` وقت التشغيل. يمكن تشغيل أقصى بسيط عرض مثال اختيار مع مرفق مستقل `sdk-minimal` profile؛ نفس وقت التشغيل أيضا سوف تحزيم `dsh web` و ذلك قبل طرف ناتج، توفير مفرد وحيد عبر CLI استخدام. كل مرة بدء كل اشتراط صريح اختيار Harness home؛Python أبدا سوف ساكن صامت قراءة `~/.dsh`.[SDK مشاركة اعتبار](sdk/README.zh.md) و [وقت التشغيل تحميل جسم مشاركة اعتبار](sdk-runtime/README.zh.md) تعريف وقت التشغيل اختيار،profile،patch و خارجي إضافة إدارة اتفاق.

## مساهمة من سير العمل

[Python مساهمة من سير العمل](development.zh.md) وسيط تعريف وقت التشغيل ناتج بناء، حزمة تحقق، شفرة المصدر نمط تطوير و توزيع.

---
description: "مشترك أداة بيت عائلة حزمة خريطة: أصل فرعي ملف كتابة، صنف لوحة تحويل id، مزدوج طرف طابور صف،JSON قيمة،harness رئيسي دليل مسار، بدء بيئة، أصلي أمر، إخراج إبقاء، وقت منطقة و مهلة."
kind: "package-group"
---

# util/: مشترك أداة

[English](README.md) | العربية

## عام وصف

`util/` مجموعة لـ قدرة حزمة توفير مشترك آلية أصل لغة، تجنب تجنب تكرار تنفيذ. هو شمول غطاء أصل فرعي كتابة، صنف لوحة تحويل id، مزدوج طرف طابور صف، بلا ضرر JSON قيمة،UUID،Harness home مسار، بدء بيئة، خروج محطة بديل إدارة سياسة، أصلي أمر، إخراج إبقاء، وقت منطقة مواصفة تحويل و مهلة معالجة. هذا داخل كل أصل مدخل كل هو مكتبة: هو لا تسجيل منتج خدمة أو حدث، عمل خدمة دلالة ما زال من إزالة استهلاك هو قدرة مسؤول.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

كل حزمة توفير واحد أصل لغة؛ فتح مقابل حزمة صفحة حل مثل أي استخدام.

| حزمة | مسؤولية |
|---|---|
| [`brand/`](brand/README.zh.md) | توفير اسم معنى نص نوع و ذلك بلا حالة بنية صنع دالة |
| [`package-manifest/`](package-manifest/README.zh.md) | حزمة manifest(بيانات وصفية بيان) مشترك TypeScript إعلان |
| [`crypto/`](crypto/README.zh.md) | أساس في عبر وقت التشغيل `crypto.getRandomValues` أصل لغة توليد RFC 9562 v4 UUID |
| [`deque/`](deque/README.zh.md) | توفير توزيع إلغاء معتاد عدد وقت طابور صف عملية و محدود فارغ خامل تخزين |
| [`chunked-list/`](chunked-list/README.zh.md) | عبر محدود إلحاق نسخ و فحص نقطة تحقق إبقاء غير ممكن تغيير قائمة إصدار |
| [`values/`](values/README.zh.md) | تحقق، إنشاء لقطة، مقارنة مقارنة و تجميد ربط بلا ضرر JSON توافق قيمة |
| [`home-paths/`](home-paths/README.zh.md) | تحليل موحد واحد Harness رئيسي دليل و تجميع وصل مشترك مستخدم بيانات مسار |
| [`http-proxy/`](http-proxy/README.zh.md) | تحليل خروج وحيد خروج محطة بديل إدارة سياسة، و لـ `fetch`،SDK agent(ذكي جسم) و spawn عملية فرعية تثبيت هو |
| [`launch-environment/`](launch-environment/README.zh.md) | تجميد ربط بدء بيئة، تسجيل إقامة كل قيمة قدوم ذاتي أي واحد طبقة |
| [`atomic-write/`](atomic-write/README.zh.md) | أصل فرعي ملف استبدال و عبر عملية كتابة قفل |
| [`lazy-require/`](lazy-require/README.zh.md) | في أول مرة استخدام وقت حسب استدعاء جهة موضع تحميل توافق CommonJS Host اعتماد |
| [`native-command/`](native-command/README.zh.md) | مباشر تشغيل مضيف أصلي أمر، أبدا تجميع shell نص |
| [`workspace-path/`](workspace-path/README.zh.md) | توفير متصفح أمان Workspace مسار و عرض مساعد مساعدة دالة |
| [`output-retention/`](output-retention/README.zh.md) | حد موجه إلى نموذج إخراج و تقرير إبلاغ دقيق حذف بيانات وصفية |
| [`time/`](time/README.zh.md) | تحقق و مواصفة تحويل استدعاء جهة الذي تقرير IANA وقت منطقة |
| [`timeout/`](timeout/README.zh.md) | قطع توقف وقت تشغيل حساب، إشارة دمج دمج و مهلة و إلغاء تصنيف |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [أصل حزمة خريطة](../README.zh.md)——`util/` في كل حزمة مجموعة في موضع.
- [توليد إعداد دليل](../../docs/config-catalog.zh.md)——هذا مجموعة الذي تابع مكتبة حزمة بحث جذب.
- [إضافة حزمة فعلي تشغيل يد سجل](../../docs/cookbook/adding-a-package.zh.md)——جديد مشترك أصل لغة مثل أي سقوط دخول هذا مجموعة.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

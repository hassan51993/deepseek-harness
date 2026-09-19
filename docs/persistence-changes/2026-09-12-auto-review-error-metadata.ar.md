---
description: "سجل حفظ دائم نوع أكثر تعديل و ذلك توافق صفة تأكيد."
kind: persistence-change
---

# 2026-09-12-auto-review-error-metadata

[English](2026-09-12-auto-review-error-metadata.md) | العربية

## عام وصف

لـ حفظ دائم PTC dispatch زيادة اختياري بنية تحويل خطأ بيانات وصفية، و لـ حفظ دائم أصلي أداة خطأ زيادة اختياري مستخدم مرئي إدارة من. اثنان بند إضافة جديدة حقل متساو إبقاء Session صيغة إصدار.

## دليل

- [إعلان](#declaration)
- [توافق صفة](#compatibility)
- [تحقق](#verification)
- [ملاحظة تطوير](#dev-note)

<a id="declaration"></a>
## إعلان

```yaml persistence-change
schemaVersion: 1
id: 2026-09-12-auto-review-error-metadata
baseline: false
changes:
  - root: "event:tool/ptc-dispatch"
    previous: "2026-09-11-initial"
    after: "b5d66eaebed4da391b13498623b11142222149fbf5e025975dbc6d94f0d06796"
    decision: same-version
  - root: "event:tool/result"
    previous: "2026-09-11-initial"
    after: "3a803805bdeb805f32b229e399fb7258be8e32a89f89063a7c99957cfea942f7"
    decision: same-version
```

<a id="compatibility"></a>
## توافق صفة

قد لديه tool/ptc-dispatch حدث يمكن حذف error، قد لديه tool/result خطأ يمكن حذف reason.PTC dispatch حدث لا دخول نموذج تاريخ؛ أصلي أداة نتيجة إعادة تشغيل فقط إسقاط data.message، لا يتضمن خطأ بيانات وصفية. قديم قراءة جهة يمكن تجاهل اختصار إضافة جديدة حقل، لا تغيير نموذج إعادة تشغيل. حالي Web قراءة جهة قبول ناقص إدارة من، و كما فقط لديه سجل في خطأ معرف مطابقة وقت عندئذ عرض Auto review رفض تفصيل حال. إذن نمط في قد لديه حدث في ما زال لـ نص؛ اختيار auto لا جذب دخول قد إعلان حفظ دائم نوع تغيير.Session header، حدث معلومة غلاف و قد لديه قيمة نوع متساو لم تغيير، بلا حاجة متبادل مجاور ترحيل.

<a id="verification"></a>
## تحقق

pnpm exec vitest run scripts/persistence-changes.spec.ts scripts/persistence-schema.spec.ts عبر 64 عدد اختبار. إذن،Auto review، أداة تنفيذ،agent loop(ذكي جسم حلقة) ،subagent وراثة و TypeScript SDK تحديد نحو اختبار مشترك 10 عدد ملف،390 عدد اختبار عبر، تغطية أصلي و PTC رفض بيانات وصفية.uv run --python 3.10 --group test --project python/sdk pytest python/sdk/tests/test_client.py -k preserves_auto_review_errors عبر 1 عدد اختبار. حفظ دائم معاينة فقط تعرف آخر خروج هذا اثنان بند اختياري حقل إضافة جديدة، متساو بلا حاجة رفع رفع إصدار.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

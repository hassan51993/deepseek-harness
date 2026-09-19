---
description: "سجل حفظ دائم نوع أكثر تعديل و ذلك توافق صفة تأكيد."
kind: persistence-change
---

# 2026-09-14-workspace-changes-event

[English](2026-09-14-workspace-changes-event.md) | العربية

## عام وصف

إضافة جديدة فقط كتابة سجل workspace/changes حدث، سجل قمة طبقة جولة تعديل ملف.

## دليل

- [إعلان](#declaration)
- [توافق صفة](#compatibility)
- [تحقق](#verification)
- [ملاحظة تطوير](#dev-note)

<a id="declaration"></a>
## إعلان

```yaml persistence-change
schemaVersion: 1
id: 2026-09-14-workspace-changes-event
baseline: false
changes:
  - root: "event:workspace/changes"
    previous: null
    after: "e308ccf867a5398e316e0af8cb6ce238a8d33a63b9b384c8250a686786285f72"
    decision: same-version
```

<a id="compatibility"></a>
## توافق صفة

نفس Session صيغة إصدار داخل جديد أصل نوع. قد لديه سجل لا يوجد هذا حدث، إبقاء صالح؛ مبكر في هو قراءة جهة لقاء إلى هو سوف رفض هذا سجل، و كل قراءة وقت مطلوب حدث متسق. هذا حدث فقط من Web bundle workspace-changes إضافة إلحاق، نموذج دائم بعيد نظر لا إلى؛Web تعديل ملف بطاقة هو وحيد إزالة استهلاك من، قراءة كل جولة الأكثر جديد واحد بند.

<a id="verification"></a>
## تحقق

pnpm exec vitest run packages/deliverables/workspace-changes packages/client/ui-deliverables:165 عدد اختبار عبر؛snapshots/web/changed-files-turn عبر Web profile إعادة تشغيل سجل حدث.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

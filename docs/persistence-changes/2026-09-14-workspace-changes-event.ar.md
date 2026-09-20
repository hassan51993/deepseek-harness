---
description: "يسجّل انتقالَ نوع حفظ دائم وتأكيدَ توافقه."
kind: persistence-change
---

# 2026-09-14-workspace-changes-event

[English](2026-09-14-workspace-changes-event.md) | العربية

## الملخص

يضيف حدثَ `workspace/changes` الذي يُسجَّل فقط ويسجّل الملفاتِ التي غيّرتها جولةٌ من المستوى الأعلى.

## المحتويات

- [التصريح](#declaration)
- [التوافق](#compatibility)
- [التحقق](#verification)
- [ملاحظة التطوير](#dev-note)

<a id="declaration"></a>
## التصريح

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
## التوافق

جذرٌ جديد في إصدار صيغة الجلسة نفسه. ولا تحتوي السجلاتُ القائمة حدثًا كهذا وتبقى صالحة؛ ويرفض القرّاءُ الأسبق منه سجلًّا يحمله، كما في كل حدث مطلوب عند القراءة. ولا يُلحق الحدثَ إلا إضافةُ workspace-changes في حزمة Web، ولا يراه النموذج قط؛ وبطاقةُ الملفات المتغيّرة في Web مستهلكُه الوحيد وتقرأ أحدثَ حدث في كل جولة.

<a id="verification"></a>
## التحقق

نجح `pnpm exec vitest run packages/deliverables/workspace-changes packages/client/ui-deliverables` بـ 165 اختبارًا؛ ويعيد `snapshots/web/changed-files-turn` تشغيلَ الحدث المسجَّل عبر profile الـ Web.

<a id="dev-note"></a>
## ملاحظة التطوير

لا شيء.

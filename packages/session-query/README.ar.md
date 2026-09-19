---
description: "جلسة فحص بحث قدرة بيت عائلة حزمة خريطة: بحث، تتبع أثر و قراءة فوري و حمل دائم جلسة تاريخ، و Web طرف جلسة سجل تصدير."
kind: "package-group"
---

# session-query/: جلسة فحص بحث قدرة بيت عائلة

[English](README.md) | العربية

## عام وصف

`session-query/` مجموعة توفير مقابل فوري و حمل دائم جلسة تاريخ فحص بحث، كما مستقل في ضغط (compaction): برنامج تحويل استدعاء جهة عبر واحد موحد واحد خدمة استعلام دقيق سجل، مرور ترشيح بعد قائمة، علاقة تتبع أثر و كل نص بحث؛SQLite خلفية دعم دعم بحث؛ نموذج نيل نيل خمسة عدد مرور مساحة العمل تخويل أداة؛Web واجهة نيل نيل تحت تحميل جلسة ZIP `/export` أمر. بحث نتيجة و نموذج يرى محادثة تاريخ متسق. هذا صفحة عام وصف هذا مجموعة؛ كل حزمة README قسم آخر شرح كل منها حزمة درجة اتفاق.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

كل حزمة README كل سوف شرح هذا حزمة في هذا مجموعة في استخدام طريق.

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`session-query/`](session-query/README.ar.md) | موحد واحد جلسة تاريخ استعلام خدمة: دقيق قراءة، علاقة تتبع أثر و مرور ترشيح | `ctx.sessionQuery` |
| [`session-query-sqlite/`](session-query-sqlite/README.ar.md) | أساس في SQLite FTS5 بحث جذب جلسة تاريخ كل نص بحث | تسجيل إلى `ctx.sessionQuery` |
| [`session-log-export/`](session-log-export/README.ar.md) | Web `/export` أمر و متصفح تحت تحميل جلسة ZIP | `ctx.sessionLogDownload`(متصفح) |
| [`tool-session-query/`](tool-session-query/README.ar.md) | موجه إلى نموذج بحث، تتبع أثر و قراءة جلسة تاريخ أداة | تسجيل إلى `ctx.tools` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار حل مشترك استعلام مفردات، مجددا نظر تتبع أثر و بحث خلف بعد تصميم سجل.

- [جلسة استعلام فرعي نظام مشاركة اعتبار](../../docs/subsystems/session-query.ar.md)——منطق سجل، مرور ترشيح جهاز، بحث صفحة، دم حافة، محدود قراءة و حدث علاقة.
- [جلسة استعلام علاقة تتبع أثر](../../.agents/notes/archived/feature/2026-07-13-session-query-tracing.md)——تتبع أثر دلالة و تحقق حد.
- [SQLite FTS5 جلسة بحث](../../.agents/notes/archived/feature/2026-07-10-sqlite-session-query-provider.md)——بحث دلالة، مقابل حساب و tokenizer قرار.

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.

# Agent Note: serial-windows notices مهلة ميزانية و generator store مسح صار هذا

Status: implemented
Archived: 2026-09-04

[English](2026-08-31-serial-windows-notices-timeout-budget.md) | العربية

## Problem

`serial / windows (self-hosted standby)` master lane واحد دورة داخل أربعة مرة فشل في `test:coverage` gate(run 33333033178،33311481884،33352293522،33353113100) ، فشل حالة استخدام كل مرة كل نفسه:`scripts/gen-third-party-notices.spec.ts > THIRD_PARTY_NOTICES.md > matches what the generator produces from the current manifests`، تقرير `Error: Test timed out in 5000ms`. مشترك Windows رئيسي آلة فوق هذا حالة استخدام فعلي قياس 4149–8853 ms، تجاوز خروج Vitest افتراضي 5000 ms مفرد قياس ميزانية. ملف ذلك بقية 26 عدد حالة استخدام الكل 0–3 ms عبر، اثنان صغير وقت بعد passing run(33360033028) استخدام نفس نسخة شفرة كل أخضر.

هذا lane بـ `DSH_COVERAGE_MAX_WORKERS=1` سلسلة سطر ركض كامل بلا قسم قطعة Windows gate بيان،`render()` يلزم من workspace manifest و قد تثبيت pnpm store كل كمية إعادة توليد `THIRD_PARTY_NOTICES.md`، بينما رئيسي آلة يتم 32 عدد runner مشترك. بارد مسار بديل قيمة تجميع في في `workspaceLinkedManifest`: هو مقابل كل لم ذاكرة مؤقتة خارجي اعتماد اسم إعادة ركض واحد مرة `loadWorkspaceManifests()`——glob و قراءة، تحليل الكل workspace `package.json`——أي 130 اسم × 270 manifest ≈ 3.5 ألف مرة ملف عملية، آخر إضافة كل اسم حرف مرة `.pnpm` store مسح. تراكم إضافة v8 نسبة التغطية إدراج وتد و مشترك رئيسي آلة I/O تنازع انتزاع بعد تجاوز مرور 5 ثانية قيمة افتراضية.

هذا lane أيضا لا يوجد `DSH_COVERAGE_TEST_TIMEOUT_MS`، بينما pull-request `windows-coverage` lane([ci.yml](../../../../.github/workflows/ci.yml)) إعطاء هو 90000 ms——في هو هذا بند serial مشاركة اعتبار lane استخدام كل مستودع الأكثر ضيق ميزانية ركض نفس نسخة coverage بيان.

## Decision

اثنان موضع تعديل:

1. [scripts/gen-third-party-notices.ts](../../../../scripts/gen-third-party-notices.ts) في `render()` داخل فقط تحميل مرة workspace manifest، يأخذ map امتداد `collectNpmDeps` → `installedMetadata` → `installedManifest` → `workspaceLinkedManifest` صريح نقل تمرير، لم يعد حسب خارجي اعتماد اسم تدريجي عدد إعادة تحميل. نفس checkout تحت بارد `render()` جدار ساعة من نحو 893 ms خفض إلى نحو 86 ms، إخراج تدريجي بايت متسق (تعديل قبل بعد تصيير نتيجة diff تحقق).

2. [ci-master.yml](../../../../.github/workflows/ci-master.yml) `serial-windows` "Run complete unsharded Windows gate inventory serially" خطوة زيادة `DSH_COVERAGE_TEST_TIMEOUT_MS: '90000'`، و pull-request `windows-coverage` lane مقابل متساو. هذا هو يأخذ [Windows نسبة التغطية lane hook ميزانية و Lefthook طقم عنصر ميزانية note](../testing/2026-08-29-windows-lane-hook-and-lefthook-budget.zh.md) تعريف per-test،expect.poll و hook ميزانية آلية توسيع إلى ثاني عدد lane؛ هذا note سجل أي بعض lane ضبط هذا env.`scripts/ci-workflow.spec.ts` استخدام `toMatchObject` تأكيد تثبيت إقامة هذا env؛ حذف إسقاط env سوف يجعل spec تغيير أحمر (قد فعل سالب مثال تحقق).

## Alternatives considered

- **فقط وضع عرض lane ميزانية** - مرفوض بصفة وحيد إصلاح: سوف إخفاء غطاء كل تشغيل generator lane فوق O(اسم×manifest) إعادة تحميل صار هذا، يشمل pre-commit hook و مستقل `--check` مسار.
- **إعطاء `loadWorkspaceManifests()` إضافة وحدة درجة ذاكرة مؤقتة** - مرفوض، تعديل استخدام صريح نقل تمرير: يأخذ «مفرد مرة تحميل» عقد نحو إبقاء في استدعاء نقطة مرئي، تجنب تجنب في `workspaceLinkedManifestCache` خارج مجددا إضافة واحد طبقة إخفاء ذاكرة مؤقتة.

## Consequences

generator كل مرة `render()` استدعاء فقط تحميل مرة manifest قدوم تحليل قد تثبيت بيانات وصفية، و في استدعاء فتح رأس صاف فارغ حسب اسم حرف عمل مفتاح linked-manifest ذاكرة مؤقتة، جعل ذاكرة مؤقتة لن نشط مرور هو تحليل ذاتي ذلك نسخة map.serial-windows lane و pull-request coverage lane واحد مثال حسب 90000 ms مفرد قياس ميزانية ركض coverage بيان.`THIRD_PARTY_NOTICES.md` بايت ثابت؛ جديد طازج درجة spec ما زال يأخذ `render()` و قد إيداع وثيقة تدريجي بايت مقارنة مقارنة.

# Agent Note: مشترك base افتراضي ملف تحرير جهاز اختيار

Status: implemented

[English](2026-09-05-base-default-file-editor.md) | العربية

## Problem

مشترك base معا اختيار `read`/`write`/`edit` و `str_replace_editor`، هذه أداة توفير إعادة تراكم ملف تحرير واجهة.Issue #3599 اشتراط أساس في base profile افتراضي استخدام واحد طقم واجهة، معا إبقاء مخصص استخدام أقصى بسيط تركيب.

## Decision

[base patch](../../../../packages/bundle/base/cordis.patch.yml) اختيار `read`،`write` و `edit` مسؤول ملف تحرير. هو لا إدراج دخول `tool-str-replace-editor`؛ لذلك SDK و Web تطبيق patch بلا حاجة منع استخدام تغطية. تحرير جهاز حزمة ما زال يمكن توفير صريح إدراج دخول هو تركيب استخدام.

Web minimal و مستقل `sdk-minimal` bundle كل منها مسؤول أداة اختيار، لا اعتماد base.[فقط حمل دائم shell قرار](2026-09-03-minimal-profiles-persistent-shell-only.ar.md) مسؤول هو جمع مفرد أداة قيمة افتراضية.

هذا قرار دقيق تحويل[موحد واحد dsh بدء جهاز](../architecture/2026-08-22-single-dsh-application-launcher.ar.md) في مشترك أداة قيمة افتراضية. هذا وثيقة مقابل بدء كل حق، مشترك خدمة و patch أولوية درجة ما زال صالح؛ لا يوجد يتم تماما يحل محل نشط وثب Agent Note.

## Alternatives considered

**في كل تطبيق في قسم آخر منع استخدام تحرير جهاز.** هذا سوف في base في إبقاء إعادة تراكم افتراضي واجهة، و اشتراط كل مستهلك رئيسي حركة خروج. مشترك اختيار من base مباشر مسؤول.

**حذف أداة حزمة.** صريح ذاتي تعريف تركيب ما زال استخدام هذا واجهة.base افتراضي اختيار لا حذف حزمة، أيضا لا قيد مستقل مسؤول أقصى بسيط قيمة افتراضية.

## Consequences

أساس في base SDK،headless،ACP و ذاتي تعريف profile افتراضي لا يتضمن هذا تحرير جهاز schema.Web standard نفس مثال لا يتضمن هو.profile،home أو تدريجي مرة استدعاء patch يمكن عبر `insert` إضافة أداة؛ فقط ضبط `disabled: false` patch حاجة قد لديه بند إعداد، لا يمكن إنشاء بند إعداد. هذا قرار لا اشتراط SDK و Web الكل أداة متسق.

## Verification

[SDK عملية اختبار](../../../../apps/cli/tests/profiles/sdk/keyless-smoke.e2e.ts) التقاط افتراضي ملف أداة، صريح إدراج دخول تحرير جهاز و مستقل أقصى بسيط أداة بيان فعلي نموذج طلب.[headless عملية اختبار](../../../../apps/cli/tests/profiles/headless/tests/keyless-smoke.e2e.ts) عبر الذي تابع تطبيق فحص مشترك قيمة افتراضية.[headless](../../../../snapshots/session/headless.snapshot.ts) ،[SDK](../../../../snapshots/sdk/sdk.snapshot.ts) و [ACP](../../../../snapshots/acp/acp.snapshot.ts) تسجيل صنع جلسة ثابت تجميع بعد نموذج مرئي إخراج، يشمل صريح إدراج دخول تحرير جهاز SDK fixture.

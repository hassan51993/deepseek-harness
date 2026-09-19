---
description: "لـ Linux عملية عزل و POSIX جلسة كتابة قفل توفير مسبق تحرير ترجمة نظام أصل لغة."
kind: "package-library"
---
# @deepseek-ai/node-addon-system

[English](README.md) | العربية

## Summary

استخدام Linux `landlock-run` يمكن تنفيذ ملف حد عملية فرعية، أو عبر `./flock` مدخل نيل أخذ POSIX كتابة قفل. منصة حزمة يتضمن مسبق تحرير ترجمة اثنان دخول صنع؛ مستهلك تثبيت وقت لن بناء أصلي شفرة.Landlock سياسة و جلسة دورة الحياة ما زال من استدعاء جهة مسؤول.

## Table of Contents

- [استخدام](#use)
- [دعم حمل نطاق](#support)
- [تطوير](#development)

## Use

`@deepseek-ai/node-addon-system/landlock-run` لـ Landlock توجيه خروج `launcherPath`،`probe` و `grantArgs`. ذلك يمكن تنفيذ ملف اسم، معامل و فشل دلالة من [CLI اتفاق](docs/cli-contract.md) تعريف.

[flock سلوك اتفاق](docs/flock-contract.md) سوف وصف رمز، عملية و استشارة استفسار صيغة قفل دلالة مقابل إلى مستقل أصلي اختبار.

`@deepseek-ai/node-addon-system/flock` توجيه خروج `tryLockExclusive(fd): Promise<void>`. في استدعاء إتمام قبل إبقاء وصف رمز فتح. نيل أخذ عملية استخدام غير منع سد وحيد احتلال flock؛ حدوث تنافس تنازع وقت، إرجاع Promise سوف بـ `EAGAIN` أو `EWOULDBLOCK` رفض، إغلاق هذا فتح ملف وصف الأكثر بعد واحد وصف رمز أي تحرير قفل. مشاركة رؤية[مدخل README](packages/entry/README.ar.md).

استيراد مهمة واحد مدخل كل لن تحميل addon.Landlock يمكن تنفيذ ملف ناقص وقت استكشاف قياس لـ غير ممكن استخدام؛flock ربط ناقص وقت رفض نيل أخذ. اثنان بند مسار كل لن إجراء تحرير ترجمة، أيضا لن ساكن صامت سماح لا تلقي دعم حمل سلوك.

## Support

Linux x64/arm64 حزمة يتضمن ساكن حالة Landlock يمكن تنفيذ ملف، و قسم آخر لأجل glibc/musl `system.node` ملف.macOS x64/arm64 حزمة فقط يتضمن `system.node`.Landlock أيضا حاجة دعم حمل قوي صنع تنفيذ Linux داخل نواة؛Windows استخدام Harness قائم قفل تنفيذ.[دعم حمل مستطيل دفعة](docs/support-matrix.md) إشارة تحديد بناء من و تحقق مسؤول شخص.

## Development

في هذا دليل تشغيل `pnpm build:ts` بناء مدخل،`pnpm build:native` بناء حالي مضيف إعلان أصلي ناتج،`pnpm build:test-oracle` بناء مستقل flock نظام استدعاء fixture(اختبار قبل وضع بيانات). مع بعد استخدام `pnpm test` تحقق مدخل، قفل، تحزيم و متاح داخل نواة سلوك.Linux كامل بناء حاجة musl-gcc؛macOS استخدام cc. أصل دليل `pnpm run build:native-system` فقط بناء شفرة المصدر اختبار الذي يحتاج حالي مضيف addon.

[هيكل بنية](docs/architecture.md) ،[تحزيم](docs/packaging.md) و[إصدار مسار](docs/release.md) قسم آخر مسؤول تنفيذ و إصدار دقيق عقدة.

### Dev Note

بلا.

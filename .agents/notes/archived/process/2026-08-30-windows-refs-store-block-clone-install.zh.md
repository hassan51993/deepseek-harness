# Agent Note: Windows ذاتي حمل إدارة ReFS store و كتلة تغلب ضخم تثبيت

Status: implemented
Archived: 2026-09-04

[English](2026-08-30-windows-refs-store-block-clone-install.md) | العربية

## Problem

ذاتي حمل إدارة Windows وهمي محاكاة آلة مساحة العمل من NTFS `E:` لفة نقل إلى ReFS `F:` لفة. في NTFS لفة فوق،`git clean -ffdx` حذف نحو 7 ألف عدد ملف node_modules شجرة حاجة بضعة عشرة قسم ساعة، و إجبار جعل كل مرة تشغيل كل كمية إعادة تركيب، يأخذ مغناطيس قرص كتابة دفع إلى هذا لفة حمل متابعة حمل عرض بـ فوق.ReFS بيانات وصفية عملية سريع بضعة عدد عدد كمية درجة، لذلك مساحة العمل ترحيل استعادة سريع سرعة checkout، لكن كشف ثاني عدد فشل.

pnpm store أيضا في `F:` فوق (`F:\.pnpm-store`) ، لذلك pnpm استخدام صلب رابط يأخذ node_modules ملف رابط إلى store(نفس لفة تخطيط تحت افتراضي `package-import-method=auto`).TypeScript استخدام أصلي realpath(`fs.realpathSync.native`) تحليل وحدة ملف، في Windows فوق سوف يأخذ صلب رابط تحليل إلى store محتوى بحث عنوان مسار (`F:/.pnpm-store/v11/files/<xx>/<sha256>`). تحرير ترجمة جهاز مع بعد من ذلك عدد store مسار تحليل عار استيراد، بينما ذلك داخل لا يوجد `node_modules`، في هو في `tsc -b` و vite وحدة تحليل خلال بـ TS6231(`Could not resolve the path 'F:/.pnpm-store/...'`) فشل.JS `realpathSync` لا تسرب تسرب store مسار؛ فقط لديه أصلي تغيير جسم سوف تسرب تسرب، الذي بـ هذا فقط ظهور في تحرير ترجمة جهاز أداة سلسلة داخل.

عند `package-import-method=clone` تشغيل في لا دعم حمل copy-on-write لفة فوق وقت، سوف ظهور متبادل صلة تثبيت فشل:pnpm في NTFS لفة (حمل إدارة runner) فوق تقرير إبلاغ `ERR_PNPM_LINKING_FAILED ... Source volume does not support copy-on-write`.

`pnpm/action-setup` تركيب إلى ذلك `dest` pnpm بناء نقص قليل clone نمط الذي يحتاج `@reflink/reflink` أصلي وحدة، الذي بـ أي جعل في ReFS فوق،clone أيضا سوف بـ `Cannot find module './reflink.win32-x64-msvc-*.node'` فشل. نظام corepack pnpm حمل لديه كامل `@reflink` منصة تجميع دمج، يشمل `reflink.win32-x64-msvc.node`.

## Decision

[ci.yml](../../../../.github/workflows/ci.yml)(أربعة عدد pull-request أصلي عمل عمل) و [ci-master.yml](../../../../.github/workflows/ci-master.yml)(`serial-windows`) في Windows تثبيت خطوة حسب مساحة العمل نظام الملفات فرع، فقط في ReFS فوق استخدام clone:

```pwsh
$drive = (Split-Path -Qualifier $env:GITHUB_WORKSPACE).TrimEnd(':')
$fs = (Get-Volume -DriveLetter $drive).FileSystem
if ($fs -eq 'ReFS') {
  corepack pnpm install --frozen-lockfile --package-import-method=clone
} else {
  pnpm install --frozen-lockfile
}
```

- ReFS فوق `--package-import-method=clone` استخدام كتلة تغلب ضخم: كل node_modules ملف نيل نيل مستقل مسار (لذلك أصلي realpath لا يمكن يأخذ هو تحليل عودة store مسار، إزالة حذف TS6231) ، معا و store مشترك شيء إدارة كتلة (بلا نسخ بديل قيمة).ReFS دعم حمل كتلة تغلب ضخم و صلب رابط (قد استخدام `fsutil fsinfo volumeinfo` و صلب رابط قائمة تحقق).
- فقط عند مساحة العمل لفة هو ReFS وقت عندئذ نقل هذا flag. حمل إدارة runner(NTFS، كل job كل جديد VM) إبقاء افتراضي استيراد طريقة، لأن NTFS رفض كتلة تغلب ضخم.
- استخدام `corepack pnpm` هو لأن clone نمط حاجة `@reflink/reflink` أصلي وحدة، نظام corepack pnpm حمل لديه هو، بينما `pnpm/action-setup` dest بناء نقص قليل.
- `.npmrc` و `npm_config_*` بيئة متغير في Windows pnpm 11.7.0 فوق لا قيادة `package-import-method`؛ فقط لديه CLI flag توليد فاعلية، لذلك أمر في صريح نقل flag.

ذاتي حمل إدارة وهمي محاكاة آلة store يقع في `F:\.pnpm-store`(ReFS، آلة جهاز درجة `PNPM_CONFIG_STORE_DIR`) ، مساحة العمل يقع في `F:\ci\_work-NN`. إعادة بناء بعد F: لفة لـ 200 GB ReFS.`DSH_CI_FAILOVER_WINDOWS=selfhosted` يأخذ أربعة عدد pull-request أصلي عمل عمل توجيه إلى ذاتي حمل إدارة حوض.

## Alternatives considered

- **يأخذ مساحة العمل إبقاء في NTFS `E:`** - لا قبول، لأن NTFS فوق `git clean -ffdx` حذف node_modules شجرة حاجة بضعة عشرة قسم ساعة، أي الأكثر أول كتابة ريح كشف أصل بسبب؛ReFS يأخذ هو خفض إلى نحو 23 ثانية.
- **`--package-import-method=copy`** - تجنب تجنب store مسار تسرب تسرب (ملف هو مستقل فرعي هذا) كما لا حاجة أصلي وحدة، لكن كل مرة تثبيت كل من store نسخ كل ملف، استعادة مساحة العمل ترحيل إزالة كبير جزء كتابة بديل قيمة.
- **إصلاح action-setup pnpm reflink** - لا قبول، لأن `pnpm/action-setup` يأخذ كل جديد pnpm تركيب دخول كل job `dest` دليل؛ في ذلك داخل تكملة أصلي وحدة هش ضعيف كما حسب job توليد فاعلية.
- **`.npmrc` `package-import-method=clone`** - لا قبول، لأن Windows pnpm 11.7.0 تجاهل اختصار هو (قد تحقق: ملف إبقاء `nlink=2` صلب رابط، أصلي realpath ما زال تسرب تسرب store مسار).

## Consequences

ذاتي حمل إدارة Windows تثبيت استخدام كتلة تغلب ضخم، حيث نيل إلى مستقل ملف مسار (بلا TS6231) ، أيضا مشترك شيء إدارة كتلة (بلا نسخ). حمل إدارة runner إبقاء افتراضي استيراد طريقة.`serial-windows` standby drill و ذاتي حمل إدارة حوض فوق pull-request أصلي عمل عمل اعتماد ReFS لفة تخطيط؛ إذا حسب [failover runbook](2026-07-26-ci-failover-runbook.zh.md) إعادة بناء runner بينما لا يوجد ReFS store و مساحة العمل تخطيط،Windows بناء بوابة سوف بـ TS6231 فشل (أو تثبيت مرحلة مقطع بـ reflink خطأ فشل).

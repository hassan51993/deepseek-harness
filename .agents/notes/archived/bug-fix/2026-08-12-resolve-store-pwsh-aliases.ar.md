# Agent Note: تحليل Microsoft Store pwsh آخر اسم

Status: implemented
Archived: 2026-09-04

[English](2026-08-12-resolve-store-pwsh-aliases.md) | العربية

## مشكلة

`resolvePwshPath` صوت تسمية Store تثبيت مرور PATH تحليل، لكن هو وجود استكشاف قياس استخدام هو `existsSync`، سوف مقابل مرشح فعل stat، من بينما تتبع مع إعادة تحليل نقطة.Store `%LOCALAPPDATA%\Microsoft\WindowsApps\pwsh.exe` هو app execution alias، ذلك هدف دليل ACL رفض stat(EACCES) ، في هو `existsSync` نظر لا إلى هو، تحليل ساكن صامت سقوط إلى Windows PowerShell 5.1——في هذا صنف «وحيد PowerShell 7 هو Store تثبيت» آلة جهاز فوق حينئذ استخدام خطأ shell.

## قرار

`candidateExists` قبول «stat لـ ملف» أو «lstat لـ رابط شكل إعادة تحليل نقطة» مرشح،`resolvePwshPath` تعديل استخدام هو.spawn آخر اسم مسار يمكن عمل، لأن CreateProcess سوف تحليل app execution alias. معلق فارغ رابط شكل مرشح نفس مثال يتم قبول، يجعل ضرر تالف pwsh في spawn وقت صدى مضيء فشل، بينما لا هو ساكن صامت تخفيض إلى 5.1.

## اعتبار مرور بديل خطة

**مباشر استكشاف قياس WindowsApps حزمة دليل.** Store حزمة مسار حمل إصدار كما يتم ACL إخفاء؛ صلب تحرير رمز هو فقط هو تكرار PATH إضافة آخر اسم قد يملك تحزيم معرفة تعرف.

**مقابل stat فشل متابعة مشي 5.1 رجوع.** مرفوض: هو ساكن صامت تشغيل واحد و غير الذي تركيب shell، هذا صحيح هو هذا note إصلاح نقص وقوع.

## عاقبة

Windows فوق Store تثبيت PowerShell 7 الآن أولا في 5.1 رجوع يتم تحليل؛ عادي ملف مرشح و غير Windows منصة سلوك ثابت. معلق فارغ symlink اختبار وحدة في الكل منصة فوق تثبيت إقامة stat/lstat قسم شق سلوك.

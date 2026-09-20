# 1. إضافتك الأولى

[English](01-first-plugin.md) | العربية

في إعداد المحمِّل المستعمَل هنا، تصدّر وحدةُ إضافة Cordis دالةَ `apply` تصديرًا مسمّى. وحين يحمّلها Cordis يستدعي `apply` بـ**سياق**، أي الكائن `ctx` الذي تسجّل الإضافةُ عبره كلَّ ما تسهم به.

## اكتب الإضافة

في دليلك `tmp/cordis-tutorial` (انظر [الإعداد](index.ar.md#setup))، أنشئ `hello.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello'

export function apply(ctx: Context) {
  console.log('hello from my first plugin')
}
```

وتصديرُ `name` بيانٌ وصفي اختياري للعرض؛ وهو يسم الإضافةَ في التشخيصات.

## ركّب التطبيق

يجمّع مُقلِعُ هذا الدرس التطبيقَ من الإعداد. أنشئ `cordis.yml`:

```yaml
- name: './hello.ts'
```

والملفُّ قائمةُ مداخل إضافات. و`name` محدِّدُ وحدة، أي مسارٌ نسبي أو اسمُ حزمة npm، ويركّب المحمِّلُ كلَّ مدخل. وتبدأ المداخلُ على التوازي، فلا يضمن موضعُ المدخل في القائمة شيئًا عن أي إضافة تُحمَّل أولًا؛ وإنما يأتي الترتيبُ من اعتماديات الخدمات (`inject`، في [الفصل الثالث](03-services.ar.md))، لا من الموضع في الملف.

## شغّله

```sh
node --import tsx ../../vendor/cordis/bin.js
```

الخرج المتوقَّع:

```
hello from my first plugin
```

وتخرج العمليةُ من تلقائها متى لم يبقَ شيء يعمل. وما حدث:

1. أنشأ المُقلِعُ `Context` جذرًا وركّب إضافةَ **Loader**.
2. وقرأ Loader الملفَّ `cordis.yml`، وحلّ `./hello.ts`، وركّبه إضافةً ابنًا.
3. واستدعى Cordis دالتَك `apply(ctx)`.

ولا شفرةَ إقلاع للإطار في ملفك: فالإضافةُ تصف ما تسهم به، و`cordis.yml` يركّب التطبيق. و[أساس `dsh`](../../packages/bundle/base/cordis.patch.yml) مثلًا تركيبُ إضافات أطول ترقّعه طبقاتُ النشر.

## صيغتا الإضافة الأخريان

الدالةُ أكثرُ الصيغ شيوعًا، لكن Cordis يقبل ثلاثًا:

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

// 1. Function plugin (what you just wrote).
export function apply(ctx: Context) {}

// 2. Object plugin: an object with an `apply` method.
export const objectPlugin = {
  name: 'object-plugin',
  apply(ctx: Context) {},
}

// 3. Class plugin: a Service subclass (covered in chapter 3).
export class MyService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'myTutorialService')
  }
}
```

استعمل صيغةَ الدالة حتى تحتاج كشفَ خدمة؛ ويغطي [الفصل الثالث](03-services.ar.md) متى تستحق صيغةُ الصنف موضعَها.

## جرّب كسره

اجعل `apply` يرمي:

```ts ignore-check
export function apply(ctx: Context) {
  throw new Error('apply exploded')
}
```

شغّل ثانيةً: فتموت العمليةُ بخطئك. والإضافةُ التي تفشل في التحميل عطلٌ مسموع لا مدخلٌ متخطًّى.

وثمة تحفّظ يستحق المعرفةَ مبكرًا: فمدخلُ الإعداد الذي لا يمكن **تحليل** وحدته، لخطأ مطبعي في مسار أو اسم حزمة، يُبلَّغ عنه عبر خدمة التسجيل في Cordis لا بانهيار العملية، وعند الإقلاع قد يضيع ذلك التقرير قبل أن يراقب مصدِّرُ لوحة التحكم. فإن بدا مدخلٌ أُضيف للتو لا يفعل شيئًا، فافحص الهجاءَ أولًا.

التالي: [دورة الحياة والآثار](02-lifecycle-and-effects.ar.md)، أي ما يحدث حين تُفرَّغ إضافة.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

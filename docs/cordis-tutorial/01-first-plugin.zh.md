# 1. تحرير كتابة رقم واحد إضافة

[English](01-first-plugin.md) | العربية

في هذا تعليم مسار استخدام loader إعداد في،Cordis إضافة وحدة عبر تسمية توجيه خروج توفير `apply` دالة.Cordis تحميل وحدة وقت، سوف استخدام واحد **سياق** استدعاء `apply`؛ هذا سياق حينئذ هو `ctx` كائن، إضافة عبر هو تسجيل ذاتي ذات مساهمة كل محتوى.

## تحرير كتابة إضافة

في `tmp/cordis-tutorial` دليل في (مشاركة رؤية[بيئة ضبط](index.zh.md#setup)) إنشاء `hello.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello'

export function apply(ctx: Context) {
  console.log('hello from my first plugin')
}
```

`name` توجيه خروج بند هو اختياري عرض بيانات وصفية؛ هو لأجل في تشخيص معلومة في معرف إضافة.

## تركيب تطبيق

هذا تعليم مسار بدء جهاز عبر إعداد تجميع تطبيق. إنشاء `cordis.yml`:

```yaml
- name: './hello.ts'
```

هذا ملف هو واحد مجموعة Cordis بند إعداد قائمة.`name` هو وحدة إشارة تحديد رمز، يمكن هو متبادل مقابل مسار أو NPM حزمة اسم؛loader سوف تركيب كل بند إعداد. كل بند سوف تزامن بدء، لذلك هو جمع في قائمة في موضع لا حفظ إثبات إضافة تحميل أولا بعد؛ ترتيب من خدمة اعتماد (`inject`، مشاركة رؤية[رقم 3 فصل](03-services.zh.md)) قرار، بينما غير ملف في موضع.

## تشغيل

```sh
node --import tsx ../../vendor/cordis/bin.js
```

مسبق مدة إخراج:

```
hello from my first plugin
```

عند لا يوجد أي محتوى متابعة وقت التشغيل، عملية سوف ذاتي سطر خروج. أداة جسم مرور مسار مثل تحت:

1. بدء جهاز إنشاء أصل `Context`، و تركيب **Loader** إضافة.
2. Loader قراءة `cordis.yml`، تحليل `./hello.ts`، لكن بعد سوف ذلك بصفة فرعي إضافة تركيب.
3. Cordis استدعاء أنت `apply(ctx)`.

أنت ملف في لا يوجد إطار هيكل بدء شفرة: إضافة وصف ذاتي ذات مساهمة،`cordis.yml` فإن تركيب تطبيق. مثال مثل،[`dsh` base](../../packages/bundle/base/cordis.patch.yml) حينئذ هو واحد نسخة أكثر طويل إضافة تركيب، من نشر overlay مقابل هو إجراء إصلاح تكملة.

## أخرى اثنان نوع إضافة شكل

دالة هو الأكثر معتاد رؤية شكل صيغة، لكن Cordis قبول ثلاثة نوع شكل صيغة:

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

في أنت حاجة عام خدمة قبل، طلب واحد مباشر استخدام دالة شكل؛[رقم 3 فصل](03-services.zh.md) وسيط تعريف أي وقت ينبغي عند استخدام صنف شكل.

## محاولة تجربة صنع صنع خطأ

يجعل `apply` رمي خروج استثناء:

```ts ignore-check
export function apply(ctx: Context) {
  throw new Error('apply exploded')
}
```

مجددا مرة تشغيل: عملية سوف بسبب هذا خطأ بينما إنهاء. إضافة تحميل فشل سوف واضح تقرير خطأ، لن فقط قفز مرور هذا بند إعداد.

أيضا حاجة كل مبكر حل واحد مثال خارج: إذا بعض عدد بند إعداد وحدة لا يمكن يتم **تحليل**، مثال مثل مسار أو حزمة اسم تجميع كتابة خطأ،Cordis سوف عبر logger خدمة تقرير إبلاغ خطأ، بينما لن جعل عملية انهيار انهيار. في بدء مرحلة مقطع، هذا بند تقرير إبلاغ ممكن في console توجيه خروج جهاز بدء مراقبة قبل فقد فقد. إذا إضافة جديدة بند إعداد يشبه نحو لا يوجد أي فاعلية نتيجة، طلب أولا فحص تجميع كتابة.

تحت واحد فصل:[دورة الحياة و effect](02-lifecycle-and-effects.zh.md): إضافة إزالة وقت سوف حدوث ماذا.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

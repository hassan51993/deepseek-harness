# تحزيم و تثبيت إضافة

[English](publish.md) | العربية

قبل بضعة مقالة تعليم مسار عبر `--patch` overlay تحميل محلي إضافة. هذا تعليم مسار يأخذ هو تحزيم صار يمكن تثبيت**تركيب حزمة**(bundle) ، استخدام `dsh plugin add` تثبيت دخول واحد **profile**، و حل تفسير قرار تركيب بعد إعداد طبقة ترتيب. هذا نص زائف ضبط `dsh` CLI قد تثبيت. طلب أولا إتمام[إضافة إعداد](./config.ar.md).

إذا تعديل استخدام كل جديد شفرة المصدر checkout، طلب أولا حسب وفق[من شفرة المصدر تشغيل فصل عقدة](../../../../README.ar.md#run-from-source) إتمام دقيق تجهيز، سوف هذا تعليم مسار `hello-plugin` دليل وضع في مستودع أصل دليل، و من هذا دليل يأخذ تحت نص `dsh ...` أمر تعديل لـ `pnpm dsh ...`. بناء و بدء جهاز سلوك رؤية[شفرة المصدر تنفيذ](../../../../apps/cli/reference/README.ar.md#source-execution).

## اثنان عدد عام فكرة، اثنان نوع manifest

تثبيت آلية بناء قيام في اثنان عدد عام فكرة لـ فوق. اثنان من كل من واحد نسخة `package.json` وصف، لكن هو جمع في `dsh` مفتاح تحت يحمل manifest(بيانات وصفية بيان) نوع صنف مختلف، عودة جواب مشكلة أيضا مختلف:

- **تركيب حزمة**هو مرفق حمل واحد إعداد طبقة npm حزمة. هو manifest إعلان `dsh.bundle`، عودة جواب هو"هذا عدد حزمة مساهمة ماذا؟": واحد إدراج دخول أو تغطية إضافة سطر patch ملف.
- **profile** هو يقع في `$DSH_HOME/profiles/<name>` تحت، وصف واحد نسخة يمكن بدء تركيب دليل. هو manifest إعلان `dsh.profile`، عودة جواب هو"هذا طقم إعداد من أي بعض تركيب حزمة حسب ماذا ترتيب مجموعة صار؟".

تركيب حزمة هو أنت تحرير كتابة و توزيع شرق غرب؛profile هو مستخدم استخدام `dsh --profile <name>` بدء شرق غرب. لا يوجد شرق غرب معا هو اثنان من.

### تركيب حزمة manifest

إنشاء حزمة دليل:

```sh
mkdir -p hello-plugin
```

```
hello-plugin/
├── package.json       # declares dsh.bundle
├── cordis.patch.yml   # the layer applied when a profile lists this bundle
└── index.js           # plugin modules the patch rows reference
```

إنشاء `hello-plugin/package.json`:

```json
{
  "name": "dsh-hello-plugin",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "files": ["index.js", "cordis.patch.yml"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

إنشاء `hello-plugin/index.js`، كتابة إضافة مدخل:

```js
export const name = 'hello-plugin'

export function apply() {
  console.log('[hello-plugin] plugin loaded!')
}
```

إنشاء `hello-plugin/cordis.patch.yml`. هذا عدد patch و أنت كتابة مرور `--patch` overlay واحد مثال، هو واحد patch بند YAML عدد مجموعة؛ منطقة آخر هو إضافة سطر حسب حزمة اسم بينما لا هو متبادل مقابل شفرة المصدر مسار مرجع هذا عدد حزمة، هذا مثال Node وحدة تحليل عندئذ قدرة بحث إلى قد تثبيت شفرة:

```yaml
- insert:
    - id: hello
      name: dsh-hello-plugin
```

لا يوجد `dsh.bundle` إعلان حزمة ما زال يمكن تثبيت، لكن فقط بصفة عادي اعتماد:`dsh plugin` سوف ضرب طبع تحذير إبلاغ، كما لا تنشيط أي طبقة. إذا واحد مكتبة توفير إضافة حزمة import، بينما لا هو توفير مستخدم تفعيل، حينئذ استخدام هذا نوع حزمة صيغة.

### profile manifest

profile دليل يتضمن اثنان عدد ملف:

- `package.json` — profile شجرة خارج إضافة اعتماد (من pnpm إدارة) ، إضافة فوق `dsh.profile` manifest و ذلك لديه ترتيب `bundles` قائمة.
- `cordis.patch.yml` — مستخدم ذاتي ذات patch طبقة، في كل تركيب حزمة طبقة بعد تطبيق.

profile manifest من لا حاجة يد كتابة:`dsh --profile <name> --from-default-profile <template>` يمكن من مع مرفق تطبيق نموذج لوح إنشاء profile،`dsh plugin` فإن إنشاء واحد بـ base لـ أساس أساس profile، و صيانة منها قد تثبيت bundle قائمة. إنشاء قاعدة بـ [CLI(أمر سطر واجهة) سلوك مشاركة اعتبار](../../../../apps/cli/reference/README.ar.md#profile-boot) لـ دقيق؛ تحت واحد عقدة عرض إضافة مسار.

## تثبيت دخول profile

`dsh plugin --profile <name> <args...>` في profile دليل داخل تحويل إرسال إعطاء pnpm، لذلك كل pnpm فرعي أمر كل متاح. في يتضمن `hello-plugin` دليل في تثبيت هذا حزمة checkout:

```sh
dsh plugin --profile demo add ./hello-plugin
```

أول مرة استخدام سوف ابتدائي تحويل profile(`@deepseek-ai/dsh-base` بصفة هو رقم واحد تركيب حزمة) ،pnpm رابط هذا checkout، بينما `dsh` لأن هذا عدد حزمة إعلان `dsh.bundle`، يأخذ هو إلحاق دخول `dsh.profile.bundles`:

```json
{
  "name": "dsh-profile-demo",
  "private": true,
  "dependencies": {
    "dsh-hello-plugin": "link:/path/to/hello-plugin"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "dsh-hello-plugin"
      ]
    }
  }
}
```

أولا لا بدء، فقط تحقق هذا طبقة، مجددا بدء:

```sh
dsh --profile demo --dump-config   # shows a "# == dsh-hello-plugin" layer
dsh --profile demo
```

`dsh plugin --profile demo remove dsh-hello-plugin` سوف معا إزالة اعتماد و مقابل طبقة.

## تحميل ترتيب

توليد فاعلية إعداد في فارغ أصل لـ فوق حسب التالي ترتيب تدريجي طبقة تركيب:

1. profile `dsh.profile.bundles` قائمة الذي صف كل عدد تركيب حزمة patch، حسب قائمة ترتيب——أولا هو `@deepseek-ai/dsh-base`، لكن بعد هو كل قد تثبيت تركيب حزمة، حسب ذلك إضافة دخول ترتيب.
2. profile ذاتي ذات `cordis.patch.yml`.
3. home درجة `$DSH_HOME/cordis.patch.yml`——كل profile مشترك آلة جهاز محلي انحراف جيد.
4. كل `--patch <path>` overlay، حسب argv ترتيب.

تطبيق معامل لا هو آخر طبقة patch. جدول طبقة تركيب حزمة يمكن عبر تحت نص الذي وصف عادي تطبيق ذاتي لديه خدمة تحليل هو جمع.

بعد تطبيق طبقة حسب سطر فوز خروج، كما patch سوف استبدال هدف سطر كامل `config` قيمة، بينما لا هو عميق درجة دمج كل مفتاح. هذا إعطاء تركيب حزمة عمل من حمل قدوم اثنان عدد دفع نقاش:

- أنت patch يمكن حسب `id` تغطية قبل وجه كل طبقة سطر——حينئذ مثل [`dsh-web-app` تركيب حزمة](../../../../packages/bundle/web-app/cordis.patch.yml) تغطية `dsh-base` سطر ذلك مثال——لكن يجب إعادة وصف هذا سطر حاجة كل واحد مفتاح، بينما لا هو فقط كتابة تعديل ذلك عدد.
- مستخدم يمكن في ذاتي ذات profile `cordis.patch.yml` في تغطية أنت سطر، بلا حاجة تعديل أنت حزمة، الذي بـ أولوية إعطاء خروج مستخدم كبير عام معدل سوف إبقاء إعداد قيمة افتراضية، ذلك بقية تسليم إعطاء schema تحمل تحمل.

داخل وضع تركيب حزمة اسم بداية نهاية من dsh تثبيت دليل ذاته تحليل؛pnpm فقط إدارة شجرة خارج حزمة، الذي بـ أنت تركيب حزمة يمكن وضع قلب اعتماد `@deepseek-ai/dsh-base` وجود كما و تثبيت إبقاء متسق.

## يجعل جدول طبقة تركيب حزمة يحتفظ ذاتي ذات أمر سطر

تعريف يمكن تشغيل تطبيق تركيب حزمة تركيب واحد عادي مزود إضافة:

```yaml
- id: hello-startup
  name: 'dsh-hello-plugin/startup'
```

هذا إضافة توجيه خروج `inject = ['cmdlineArgs']`، استخدام ذاتي ذات commander program استدعاء [`@deepseek-ai/dsh-cmdline`](../../../../packages/boot/cmdline/README.ar.md) في `parseCmdline`، مجددا في program ذاتي ذات action في يأخذ تطبيق ذاتي لديه خدمة توفير خروج ذهاب. بدء جهاز يأخذ ذاته flag بعد نفس نسخة غير ممكن تغيير معامل تسليم إعطاء كل إضافة، لذلك إضافة تطبيق مخصص تابع flag بلا حاجة تعديل بدء جهاز، كثير عدد إضافة أيضا يمكن تحليل هذا لقطة.Loader سطر لا حاجة بدء جهاز علامة أو خاص خاص نوع.

تلقي هذه معامل إعداد سطر سوف حقن مزود خدمة، و في ذاتي ذات `!!js` خيار في قراءة هو، معا يأخذ نشر أخذ قيمة كتابة في جانب حافة بصفة رجوع:

```yaml
- id: my-app
  name: '@example/my-app'
  inject: [myAppStartup]
  config:
    port: !!js ctx.myAppStartup.port ?? 8080
```

لقاء إلى `--help` وقت، مزود لن إصدار هذا خدمة، الذي بـ هذه سطر لن تنشيط.Loader فقط تركيب مرة تركيب، انتظار كل واحد سطر عادي حقن، مجددا أساس في ذلك قد حقن سياق طلب قيمة هذا سطر `!!js` إعداد.

## من GitHub تثبيت: بناء نص برمجي هذا طريق عقبة

إصدار إلى سجل التسجيل لا هو يجب——مستخدم يمكن مباشر من git حمل إدارة تثبيت:

```sh
dsh plugin --profile demo add github:you/hello-plugin
```

لكن git تثبيت سحب أخذ هو**شفرة المصدر، لا هو بناء ناتج**: لا يوجد أي حلقة عقدة تشغيل أنت `build` نص برمجي، لذلك TypeScript حزمة إلى يد وقت لا يوجد `lib/` إخراج، تحميل سوف فشل. يجب اثنان حافة كل فعل واحد عنصر أمر:

- **عمل من**توفير واحد `prepare` نص برمجي——pnpm في git تثبيت بعد تشغيل هو——من شفرة المصدر بناء خروج إصدار مدخل، كما يجب ذاتي يتضمن: لا يستطيع زائف ضبط فقط تطوير بيئة عندئذ لديه سياق، مثال مثل جانب حافة لديه واحد نسخة monorepo checkout. مخصص استخدام tsdown إعداد يمكن مباشر تحويل ترجمة `src/`، لا استخدام مشروع مرجع، أيضا لا فعل نوع فحص.
- **مستخدم**لـ بناء تخويل.pnpm ≥10 في نيل إلى صريح سماح قبل رفض تشغيل git اعتماد `prepare` نص برمجي، الذي بـ رقم مرة `add` سوف فشل؛`dsh` سوف إشارة خروج إصلاح قاعدة——يأخذ pnpm ضرب طبع تأكيد قطع حزمة مفتاح نسخ دخول هذا profile `pnpm-workspace.yaml`:

  ```yaml
  allowBuilds:
    dsh-hello-plugin: true
  ```

  لكن بعد إعادة تنفيذ `add`.

طلب يأخذ هذا بند تخويل نظر لـ**سماح هذا حزمة شفرة في تثبيت وقت في أنت آلة جهاز فوق تنفيذ**، كما لا في agent تشغيل أي صندوق رملي لـ داخل. فقط مقابل شفرة المصدر يمكن معلومة حزمة تخويل، و قفل تحديد commit(`github:you/hello-plugin#<sha>`) ، يجعل لاحق دفع إرسال لا يمكن صامت صامت تغيير فعلي تشغيل محتوى.

إذا لا تفكير يجعل مستخدم فعل هذا بند تخويل، حينئذ تعديل لـ توزيع بناء ناتج——التالي اثنان نوع شكل صيغة كل لا حاجة أي بناء إذن:

- **إصدار إلى npm**، في `pnpm publish` وقت بناء جيد `lib/`؛`dsh plugin add your-package` تثبيت حينئذ هو مسبق بناء شفرة.
- **تسليم tarball**: استخدام `pnpm pack` تحزيم؛ مستخدم تنفيذ `dsh plugin add ./hello-plugin-0.1.0.tgz`.

## تحت واحد خطوة

- [إضافة و دورة الحياة](../framework/index.ar.md) — إضافة كامل دورة الحياة
- [CLI(أمر سطر واجهة) سلوك مشاركة اعتبار](../../../../apps/cli/reference/README.ar.md) — تأكيد قطع طبقة أولوية درجة،flag و profile آلية

# حزم إضافة وتثبيتها

[English](publish.md) | العربية

حمّلت الدروسُ السابقة إضافةً محلية عبر طبقة `--patch`. ويحزم هذا الدرس تلك الإضافةَ **حزمةَ تركيب** قابلة للتثبيت، ويثبّتها في **profile** بـ `dsh plugin add`، ويشرح ترتيبَ الطبقات الذي يقرّر الإعدادَ المركَّب. وهو يفترض أن واجهة `dsh` مثبَّتة. فأكمل [إعداد الإضافات](./config.ar.md) أولًا.

ولاستعمال نسخة مصدر جديدة بدل ذلك، أكمل [قسم التشغيل من المصدر](../../../../README.ar.md#run-from-source)، واحتفظ بدليل `hello-plugin` الخاص بهذا الدرس في جذر المستودع، وشغّل بقية أوامر `dsh ...` من هناك بصيغة `pnpm dsh ...`. وانظر [التنفيذ من المصدر](../../../../apps/cli/reference/README.ar.md#source-execution) لسلوك البناء والمُقلِع.

## مفهومان وبيانان

يقوم التثبيت على مفهومين. ويصف كلًّا منهما `package.json`، لكنهما يحملان بيانين مختلفين تحت المفتاح `dsh`، ويجيبان عن سؤالين مختلفين:

- **حزمة التركيب** حزمةُ npm تشحن طبقةَ إعداد. ويعلن بيانُها `dsh.bundle`، فيجيب: «بماذا تسهم هذه الحزمة؟»، أي ملفَّ patch يدرج صفوفَ إضافات أو يتجاوزها.
- و**الـ profile** دليلٌ تحت `$DSH_HOME/profiles/<name>` يصف تركيبًا واحدًا قابلًا للتشغيل. ويعلن بيانُه `dsh.profile`، فيجيب: «أي حزم تركيب تؤلّف هذا الإعداد، وبأي ترتيب؟».

فحزمةُ التركيب ما تؤلّفه وتوزّعه؛ والـ profile ما يُقلعه المستخدم بـ `dsh --profile <name>`. ولا شيء منهما معًا.

### بيان حزمة التركيب

أنشئ دليل الحزمة:

```sh
mkdir -p hello-plugin
```

```
hello-plugin/
├── package.json       # declares dsh.bundle
├── cordis.patch.yml   # the layer applied when a profile lists this bundle
└── index.js           # plugin modules the patch rows reference
```

أنشئ `hello-plugin/package.json`:

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

أنشئ `hello-plugin/index.js` بمدخل الإضافة:

```js
export const name = 'hello-plugin'

export function apply() {
  console.log('[hello-plugin] plugin loaded!')
}
```

أنشئ `hello-plugin/cordis.patch.yml`. والـ patch مصفوفةُ YAML مثل طبقات `--patch` التي كتبتها، إلا أن صفوف الإضافات تشير إلى الحزمة باسمها لا بمسار مصدر نسبي، ليجد تحليلُ Node الشفرةَ المثبَّتة:

```yaml
- insert:
    - id: hello
      name: dsh-hello-plugin
```

والحزمةُ بلا تصريح `dsh.bundle` تُثبَّت مع ذلك، لكن اعتماديةً عادية وحدها: فيطبع `dsh plugin` تحذيرًا ولا يفعّل أي طبقة. فاستعمل صيغةَ الحزمة تلك لمكتبة تستوردها حزمُ الإضافات، لا لإضافة يفعّلها المستخدمون.

### بيان الـ profile

يحمل دليلُ الـ profile ملفين:

- `package.json`: اعتماديات الـ profile من الإضافات خارج الشجرة (يديرها pnpm) مع بيان `dsh.profile` وقائمةِ `bundles` المرتَّبة فيه.
- `cordis.patch.yml`: طبقةُ patch الخاصة بالمستخدم، وتُطبَّق بعد كل طبقة حزمة تركيب.

ولا تكتب بيانَ profile يدويًا أبدًا: فـ `dsh --profile <name> --from-default-profile <template>` يستطيع إنشاءَه من قالب تطبيق مشحون، بينما ينشئ `dsh plugin` profile مسنودًا بـ base ويصون قائمةَ حزم التركيب المثبَّتة فيه. ويملك [مرجع سلوك CLI](../../../../apps/cli/reference/README.ar.md#profile-boot) قواعدَ الإنشاء؛ ويعرض القسمُ التالي مسارَ الإضافات.

## التثبيت في profile

يمرّر `dsh plugin --profile <name> <args...>` الوسائطَ إلى pnpm في دليل الـ profile، فتعمل كل أفعال pnpm. ومن الدليل الذي يحوي `hello-plugin`، ثبّت نسخةَ الحزمة:

```sh
dsh plugin --profile demo add ./hello-plugin
```

ويهيّئ أولُ استعمال الـ profile (بـ `@deepseek-ai/dsh-base` أولَ حزمة تركيب فيه)، ويربط pnpm النسخة، ويُلحق `dsh` حزمةَ التركيب بـ `dsh.profile.bundles` لأن الحزمة تعلن `dsh.bundle`:

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

تحقّق من الطبقة بلا إقلاع، ثم أقلع:

```sh
dsh --profile demo --dump-config   # shows a "# == dsh-hello-plugin" layer
dsh --profile demo
```

و`dsh plugin --profile demo remove dsh-hello-plugin` يزيل الاعتماديةَ والطبقةَ معًا.

## ترتيب التحميل

يتركّب الإعدادُ الفعلي فوق جذر فارغ بتطبيق ما يلي بالترتيب:

1. كلُّ patch لحزمة تركيب مذكورة في قائمة `dsh.profile.bundles` الخاصة بالـ profile، بترتيب القائمة: `@deepseek-ai/dsh-base` أولًا، ثم كل حزمة مثبَّتة بترتيب إضافتها.
2. ملفُّ `cordis.patch.yml` الخاص بالـ profile.
3. الملفُّ `$DSH_HOME/cordis.patch.yml` على مستوى الدليل المنزلي: تفضيلاتٌ محلية للجهاز يتشاركها كل profile.
4. كلُّ طبقة `--patch <path>` بترتيب argv.

ووسائطُ التطبيق ليست طبقةَ patch أخرى. وتستطيع حزمةُ تركيب السطح تحليلَها عبر خدمة عادية يملكها التطبيق، كما هو موصوف أدناه.

وتفوز الطبقاتُ اللاحقة لكل صف، ويستبدل الـ patch قيمةَ `config` للصف كلها لا يدمج مفاتيحها دمجًا عميقًا. ولهذا نتيجتان على مؤلّفي حزم التركيب:

- يستطيع patch الخاص بك تجاوزَ صفوف من طبقات أسبق بـ `id`، مثلما تتجاوز [حزمة `dsh-web-app`](../../../../packages/bundle/web-app/cordis.patch.yml) صفوفَ `dsh-base`، لكن عليه أن يعيد ذكرَ كل مفتاح يحتاجه الصف، لا المتغيّرَ وحده.
- ويستطيع المستخدمون تجاوزَ صفوفك في `cordis.patch.yml` الخاص بـ profile لديهم بلا مسّ حزمتك، فاختر قيمًا افتراضية يرجَّح أن يُبقوا عليها، ودَع الـ schema يحمل الباقي.

وأسماءُ حزم التركيب المدمجة تتحلّل دائمًا من تثبيت dsh نفسه؛ ولا يدير pnpm سوى الحزم خارج الشجرة، فتستطيع حزمتُك الاعتمادَ على حضور `@deepseek-ai/dsh-base` وحداثته.

## أعطِ حزمة تركيب السطح سطرَ أوامر خاصًّا بها

حزمةُ التركيب التي تعرّف تطبيقًا قابلًا للتشغيل تركّب إضافةَ مزوّد عادية:

```yaml
- id: hello-startup
  name: 'dsh-hello-plugin/startup'
```

وتصدّر الإضافةُ `inject = ['cmdlineArgs']`، وتستدعي `parseCmdline` من [`@deepseek-ai/dsh-cmdline`](../../../../packages/boot/cmdline/README.ar.md) ببرنامج commander خاص بها، وتوفّر خدمتَها المملوكة للتطبيق من فعل البرنامج. ويسلّم المُقلِع كلَّ إضافة الوسائطَ نفسها غيرَ القابلة للتغيير بعد أعلام المُقلِع، فلا تحتاج أعلامُ التطبيق تغييرًا في المُقلِع، وقد تحلّل عدةُ إضافات اللقطةَ نفسها. ولا يحتاج صفُّ Loader علامةَ مُقلِع ولا نوعًا خاصًّا.

والصفوفُ التي تضبطها تلك الوسائط تحقن خدمةَ المزوّد وتقرؤها من خيارات `!!js` الخاصة بها، وقيمةُ النشر بجوارها احتياطيًا:

```yaml
- id: my-app
  name: '@example/my-app'
  inject: [myAppStartup]
  config:
    port: !!js ctx.myAppStartup.port ?? 8080
```

وعند `--help` لا ينشر المزوّد خدمةً، فلا تنشط تلك الصفوف قط. ويركّب Loader التركيبَ مرةً واحدة، وينتظر حقنَ كل صف العادي، ثم عندئذ فقط يقيّم إعدادَ `!!js` لذلك الصف مقابل سياقه المحقون.

## التثبيت من GitHub: مصيدة نص البناء

النشرُ إلى registry ليس لازمًا، فيستطيع المستخدمون التثبيتَ من مستضيف git مباشرةً:

```sh
dsh plugin --profile demo add github:you/hello-plugin
```

لكن تثبيتَ git يجلب **المصادر لا النواتج المبنية**: فلا شيء يشغّل نصَّ `build` عندك، فتصل حزمةُ TypeScript بلا خرج `lib/` وتفشل في التحميل. ويجب أن يقع أمران، واحدٌ على كل جانب:

- **يشحن المؤلِّف** نصَّ `prepare`، ويشغّله pnpm بعد تثبيت git، ليبني مداخلَ النشر من المصدر بنفسه مكتفيًا: فلا يفترض سياقَ تطوير فقط، مثل نسخة monorepo شقيقة. ويستطيع إعدادُ tsdown مخصص تحويلَ `src/` بلا إشارات مشاريع ولا فحص أنواع.
- **ويسمح المستخدم** بالبناء. فـ pnpm 10 فما فوق يرفض تشغيل نص `prepare` لاعتمادية git حتى يُسمح به صراحةً، فيفشل أولُ `add`؛ ويشير `dsh` إلى الإصلاح: انسخ مفتاحَ الحزمة الذي طبعه pnpm بعينه إلى `pnpm-workspace.yaml` في الـ profile:

  ```yaml
  allowBuilds:
    dsh-hello-plugin: true
  ```

  ثم أعِد تشغيل `add`.

وعامِل ذلك السماحَ بوصفه **إذنًا بتنفيذ شفرة الحزمة على جهازك وقتَ التثبيت**، خارج أي بيئة معزولة يعمل الوكيل تحتها. فلا تسمح إلا لحزم تثق بمصدرها، وثبّت commit (`github:you/hello-plugin#<sha>`) حتى لا يغيّر دفعٌ لاحق ما يعمل في صمت.

وإن آثرتَ ألّا تطلب من المستخدمين ذلك السماح، فوزّع نواتجَ مبنية بدلًا منه؛ ولا تحتاج أيٌّ من الصيغتين إذنَ بناء:

- **انشر إلى npm** مع بناء `lib/` وقتَ `pnpm publish`؛ فيثبّت `dsh plugin add your-package` شفرةً مبنية سلفًا.
- **اشحن أرشيفًا** من `pnpm pack`؛ فيشغّل المستخدمون `dsh plugin add ./hello-plugin-0.1.0.tgz`.

## الخطوات التالية

- [الإضافات ودورة الحياة](../framework/index.ar.md): دورةُ حياة الإضافة كاملةً
- [مرجع سلوك CLI](../../../../apps/cli/reference/README.ar.md): أسبقيةُ الطبقات بعينها والأعلامُ وآلياتُ الـ profiles

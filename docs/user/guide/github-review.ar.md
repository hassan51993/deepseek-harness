# إنشاء جلسات مراجعة من webhooks في GitHub

[English](github-review.md) | العربية

تضيف هذه الطبقةُ الاختيارية نقطةَ نهاية موقَّعة من GitHub إلى `dsh web`. وحين ينتقل طلبُ سحب في المستودع المضبوط من مسودة إلى جاهز للمراجعة، تنشئ القاعدةُ جلسةً جذرًا معنونة تحت مساحة عمل Web الخاصة بالمستودع وتبدأ توجيهَ مراجعة للقراءة فقط.

## المتطلبات

- نسخةُ عمل محلية يجوز لـ DSH تسجيلُها مساحةَ عمل في Web.
- سرُّ webhook في GitHub عالي العشوائية متاحٌ عبر مرجع الاعتماد `DSH_GITHUB_WEBHOOK_SECRET`.
- وكيلٌ عكسي بـ TLS أو نفق يستطيع تمرير رابط عام واحد إلى المستمع على الحلقة المحلية.
- اشتراكُ webhook في GitHub بحدث Pull requests بنوع محتوى `application/json`.

وتجعل الطبقةُ مساحةَ العمل افتراضيًا دليلَ الإقلاع، والمستمعَ `127.0.0.1:3081`. وتجاوَزهما بـ `DSH_GITHUB_REVIEW_WORKSPACE` و`DSH_GITHUB_WEBHOOK_PORT`.

## أقلع DSH

ولّد سرًّا واحتفظ بالقيمة نفسها عبر إعادات التشغيل:

```sh
export DSH_GITHUB_WEBHOOK_SECRET="$(openssl rand -hex 32)"
printf '%s\n' "$DSH_GITHUB_WEBHOOK_SECRET"
```

من نسخة عمل للتطوير:

```sh
export DSH_GITHUB_REVIEW_WORKSPACE=/path/to/deepseek-harness
pnpm dsh web --patch apps/cli/config/examples/github-review/cordis.yml
```

ويستعمل DSH المثبَّت الطبقةَ نفسها عبر مسار مطلق:

```sh
dsh web --patch /absolute/path/to/github-review/cordis.yml
```

ولـ profile دائم، ضع `github-ready-review-rule.mjs` بجوار `$DSH_HOME/profiles/web/cordis.patch.yml`، وألحِق صفوفَ `cordis.yml` بذلك الـ patch، وأقلع بـ `dsh web`. وواجهةُ CLI المشحونة تحتوي حزمتَي webhook أصلًا؛ والطبقةُ وحدها هي ما يفعّلهما.

## اكشف نقطة النهاية المخصصة

تبقى واجهةُ Web الرئيسة و`/api` على المنفذ 3080. وتركّب الطبقةُ خادمَ WebServer ثانيًا في مجال معزول؛ ولا يُسجَّل فيه إلا `POST /github`، وكلُّ مسار آخر يعيد `404`.

ويستطيع إعدادُ Caddy كشفَ ذلك المستمع وحده:

```caddyfile
hooks.example.com {
  route {
    @github path /github
    reverse_proxy @github 127.0.0.1:3081
    respond 404
  }
}
```

اضبط GitHub بما يلي:

```text
Payload URL:  https://hooks.example.com/github
Content type: application/json
Secret:       DSH_GITHUB_WEBHOOK_SECRET value
Events:       Pull requests
Active:       yes
```

## سلوك القاعدة

لا تقبل القاعدةُ إلا المصدرَ `primary-github`، والمستودعَ `deepseek-harness/deepseek-harness`، والحدثَ `pull_request`، والفعلَ `ready_for_review`. وهي تمرّر قيمةَ SHA للرأس بعينها مع حقول مختارة من الـ PR إلى توجيه المراجعة، وتسم الـ JSON بيانًا وصفيًا غير موثوق، وتمنع تغييرَ أي ملف أو فرع أو PR أو شيء في GitHub.

ويختار طلبُ الجلسة agent preset باسم `standard` وإعدادَ الأذونات `read-only`. ويُعيَّر `workspacePath` عبر `WorkspaceRegistry.create()`، فينشئ أولُ تسليم مطابق مساحةَ عمل Web إن غابت، وتعيد التسليماتُ اللاحقة استعمالَها.

واستجابةُ HTTP أضعف عمدًا من نتيجة الوكيل: فـ `202` تعني أن التوقيع والـ JSON قُبلا وأن استدعاءات القاعدة جُدولت في الذاكرة. ولا تعني أن هذه القاعدة طابقت ولا أن جلسةً أُنشئت.

## التوسعات البرمجية

`run()` هي JavaScript موثوقة عادية. ويستطيع النشرُ استعلامَ خدمة سياسة داخلية قبل إعادة طلب جلسة:

```js
const response = await fetch('https://policy.internal/pr-review', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ repository: payload.repository.full_name }),
  signal,
})
if (!response.ok || (await response.json()).automaticReview !== true) return null
```

ويستطيع أيضًا ربطَ المستودعات بمسارات محلية مختلفة:

```js
const workspacePath = {
  'deepseek-harness/deepseek-harness': '/path/to/deepseek-harness',
  'deepseek-harness/dsh-sdk': '/path/to/dsh-sdk',
}[payload.repository.full_name]
if (workspacePath === undefined) return null
```

## دلالة التسليم

لا يخزّن وقتُ تشغيل webhook حالةَ تسليم ولا تنفيذ. والتسليمُ المتكرر يشغّل القاعدةَ وقد ينشئ جلسةً أخرى. والانهيارُ يفقد استدعاءاتِ القاعدة التي لم تقبل توجيهَها بعد. وبعد قبول التوجيه يملك العملَ سجلُّ الجلسة المعتاد وحفظُها الدائم ومساحةُ العمل ودورةُ حياة الوكيل.

وسرُّ webhook يوثّق بيانات GitHub الواردة وحدها. وهو لا يمنح شفرةَ القاعدة ولا الوكيلَ المُنشأ وصولًا صادرًا إلى GitHub؛ فاضبط تلك الصلاحية منفصلةً حين تحتاجها قاعدةٌ أو وكيل.

# عبر GitHub Webhook إنشاء مراجعة جلسة

[English](github-review.md) | العربية

هذا اختياري overlay سوف لـ `dsh web` زيادة واحد توقيع GitHub طرف نقطة. عند قد إعداد مستودع في pull request من draft تغيير لـ ready for review وقت، قاعدة سوف في هذا مستودع Web Workspace تحت إنشاء حمل عنوان أصل Session، و بدء فقط قراءة مراجعة نص التوجيه.

## قبل وضع شرط

- واحد يمكن من DSH تسجيل لـ Web Workspace محلي checkout.
- واحد يمكن عبر `DSH_GITHUB_WEBHOOK_SECRET` اعتماد مرجع وصول عال عشوائية GitHub webhook مفتاح.
- واحد يمكن يأخذ مفرد عدد عام مشترك URL تحويل إرسال إلى loopback مستمع TLS عكس نحو بديل إدارة أو tunnel.
- GitHub webhook حجز قراءة Pull requests حدث، كما content type لـ `application/json`.

overlay افتراضي استخدام بدء دليل بصفة Workspace، و استماع `127.0.0.1:3081`. يمكن عبر `DSH_GITHUB_REVIEW_WORKSPACE` و `DSH_GITHUB_WEBHOOK_PORT` تغطية هو جمع.

## بدء DSH

توليد مفتاح، و في إعادة بدء بعد متابعة استخدام نفس قيمة:

```sh
export DSH_GITHUB_WEBHOOK_SECRET="$(openssl rand -hex 32)"
printf '%s\n' "$DSH_GITHUB_WEBHOOK_SECRET"
```

في تطوير checkout في تشغيل:

```sh
export DSH_GITHUB_REVIEW_WORKSPACE=/path/to/deepseek-harness
pnpm dsh web --patch apps/cli/config/examples/github-review/cordis.yml
```

تثبيت إصدار DSH عبر قطعا مقابل مسار استخدام نفس overlay:

```sh
dsh web --patch /absolute/path/to/github-review/cordis.yml
```

مقابل في دائم دائم profile، يأخذ `github-ready-review-rule.mjs` وضع في `$DSH_HOME/profiles/web/cordis.patch.yml` جانب حافة، يأخذ `cordis.yml` في سطر إلحاق إلى هذا patch، لكن بعد تشغيل `dsh web`. مع مرفق CLI قد يتضمن اثنان عدد webhook حزمة؛ فقط يحتاج overlay يكفي تنشيط هو جمع.

## كشف مخصص استخدام طرف نقطة

رئيسي Web UI و `/api` متابعة يقع في طرف فتحة 3080.overlay سوف في عزل realm في تركيب ثاني عدد WebServer؛ منها فقط تسجيل `POST /github`، أخرى مسار متساو إرجاع `404`.

Caddy إعداد يمكن فقط كشف هذا مستمع:

```caddyfile
hooks.example.com {
  route {
    @github path /github
    reverse_proxy @github 127.0.0.1:3081
    respond 404
  }
}
```

GitHub إعداد مثل تحت:

```text
Payload URL:  https://hooks.example.com/github
Content type: application/json
Secret:       DSH_GITHUB_WEBHOOK_SECRET value
Events:       Pull requests
Active:       yes
```

## قاعدة سلوك

قاعدة فقط قبول مصدر `primary-github`، مستودع `deepseek-harness/deepseek-harness`، حدث `pull_request` و حركة عمل `ready_for_review`. هو سوف يأخذ دقيق head SHA و اختيار تحديد PR حقل نقل إعطاء مراجعة نص التوجيه، يأخذ JSON علامة لـ لا تلقي معلومة مهمة بيانات وصفية، و منع توقف تعديل ملف، فرع،PR أو GitHub حالة.

Session طلب اختيار `standard` agent preset و `read-only` permission preset.`workspacePath` عبر `WorkspaceRegistry.create()` مواصفة تحويل، لذلك رقم مرة مطابقة تسليم سوف في Workspace لا وجود وقت إنشاء هو، لاحق تسليم سوف إعادة استخدام هو.

HTTP استجابة لحظة معنى ضعيف في Agent نتيجة:`202` يمثل توقيع و JSON قد يتم قبول، قاعدة استدعاء قد في داخل تخزين في ضبط درجة. هو لا يمثل هذا قاعدة قد مطابقة، أيضا لا يمثل قد إنشاء Session.

## برنامج تحويل توسيع

`run()` هو عادي تلقي معلومة مهمة JavaScript. نشر يمكن في إرجاع Session طلب قبل استعلام داخلي سياسة خدمة:

```js
const response = await fetch('https://policy.internal/pr-review', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ repository: payload.repository.full_name }),
  signal,
})
if (!response.ok || (await response.json()).automaticReview !== true) return null
```

هو أيضا يمكن يأخذ مستودع خريطة إلى مختلف محلي مسار:

```js
const workspacePath = {
  'deepseek-harness/deepseek-harness': '/path/to/deepseek-harness',
  'deepseek-harness/dsh-sdk': '/path/to/dsh-sdk',
}[payload.repository.full_name]
if (workspacePath === undefined) return null
```

## تسليم دلالة

webhook runtime لا تخزين تسليم أو تنفيذ حالة. تكرار تسليم سوف تشغيل قاعدة، و ممكن إنشاء آخر عدد Session. انهيار انهيار سوف فقد فقد بعد لم وصل قبول نص التوجيه قاعدة استدعاء. نص التوجيه وصل قبول بعد، عمل من عادي Session سجل،persistence،Workspace و Agent دورة الحياة يملك.

webhook مفتاح فقط تحقق دخول محطة GitHub بيانات. هو لن نحو قاعدة شفرة أو الذي إنشاء Agent منح إعطاء خروج محطة GitHub وصول حق؛ قاعدة أو Agent حاجة وقت ينبغي مفرد وحيد إعداد هذا إذن.

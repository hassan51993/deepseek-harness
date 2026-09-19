# DeepSeek Harness

[English](README.md) | العربية

DeepSeek Harness(`dsh`) هو من [DeepSeek AI](https://deepseek.com) تطوير فتح مصدر agent harness(ذكي جسم إطار هيكل).

هو بناء في**واحد قطع جميع إضافة**هيكل بنية لـ فوق، من [Cordis](https://github.com/cordiverse/cordis) قيادة، ذلك تصميم مشاركة رؤية نقاش نص [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

وثيقة:[https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## تطوير من معاينة

DeepSeek Harness موضع في _تطوير من معاينة_ مرحلة مقطع، جارٍ سريع سرعة تكرار بديل.**لم قدوم سوف ظهور كسر تالف توافق صفة تغيير.**

تشغيل هذا مشروع قبل، طلب قراءة قراءة[أمان شرح](SAFETY.ar.md).

<a id="run"></a>

## تشغيل

### عبر `npm` تشغيل

تثبيت `Node.js`، لكن بعد تشغيل:

```sh
npx @deepseek-ai/dsh web
```

هذا أمر افتراضي سوف في `http://127.0.0.1:3080` بدء Web UI، هذا آلة بدء وقت أيضا سوف استخدام افتراضي متصفح فتح صفحة. عبر SSH بدء وقت فقط ضرب طبع مضيف آلة URL، لأن محلي تحويل إرسال عنوان من SSH عميل أو تحرير جهاز يحتفظ. نقل دخول `--no-open` يمكن فقط تشغيل خادم بينما لا فتح متصفح. تفصيل رؤية [Web UI إشارة جنوب](docs/user/guide/index.ar.md).

<a id="run-from-source"></a>

### من شفرة المصدر تشغيل

مثل يحتاج من مستودع شفرة المصدر تشغيل:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` سوف دقيق تجهيز مستودع ناتج.`pnpm dsh web` سوف مباشر استخدام هذه قد بناء ناتج، لن إعادة بناء.

## مجتمع منطقة و دعم حمل

- عبر [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) إيداع ملاحظات أو bug تقرير إبلاغ.
- لـ أنت إضافة مستودع إضافة [`dsh-plugin`](https://github.com/topics/dsh-plugin) كلام عنوان، سهل في يتم اكتشاف.
- فرح استقبال إضافة دخول DeepSeek Harness مؤسسة دقيق مجموعة: مسح رمز إضافة مؤسسة دقيق صغير مساعدة يد و ملء كتابة مجموعة سؤال لفة، إتمام بعد صغير مساعدة يد سوف دعوة طلب أنت دخول مجموعة.

<table>
  <thead>
    <tr>
      <th align="center">مؤسسة دقيق صغير مساعدة يد</th>
      <th align="center">دخول مجموعة سؤال لفة</th>
      <th align="center">دقيق معلومة عام جمهور رقم</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><img src="https://cdn.deepseek.com/harness/readme/community-wecom-assistant.png" alt="DeepSeek Harness مؤسسة دقيق صغير مساعدة يد اثنان صيانة رمز" width="180" height="180"></td>
      <td align="center"><a href="https://trtgsjkv6r.feishu.cn/share/base/form/shrcnIt5twSVdLGD52KJBckGCgg"><img src="https://cdn.deepseek.com/harness/readme/community-wecom-survey.png" alt="DeepSeek Harness دخول مجموعة سؤال لفة اثنان صيانة رمز" width="180" height="180"></a></td>
      <td align="center"><img src="https://cdn.deepseek.com/harness/readme/community-wechat-official-account.png" alt="DeepSeek Harness مجموعة طابور دقيق معلومة عام جمهور رقم اثنان صيانة رمز" width="180" height="180"></td>
    </tr>
  </tbody>
</table>

## مشاركة و مساهمة

مشاركة رؤية [CONTRIBUTING.md](CONTRIBUTING.ar.md).

## تطوير

طلب أولا قراءة قراءة[تطوير إشارة جنوب](docs/development.ar.md) و[هيكل بنية وثيقة](docs/architecture.ar.md).

موجه إلى agent: طلب التزام دوران [AGENTS.md](AGENTS.md).

## مرجع

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## سماح يمكن إثبات

[MIT](LICENSE)

رقم ثلاثة جهة اعتماد و ذلك سماح يمكن إثبات رؤية [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

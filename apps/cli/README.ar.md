# `@deepseek-ai/dsh`

[English](README.md) | العربية

`dsh` هو وحيد تلقي دعم حمل Node تطبيق بدء جهاز؛profile من كثير عدد إضافة تركيب حزمة patch طبقة حسب ترتيب تراكم إضافة بينما صار، ذلك فوق مجددا تطبيق مستخدم ذاتي ذات تغطية إعداد.SDK و ACP(Agent Client Protocol) كل هو profile، بينما لا هو مستقل عام يمكن تنفيذ أمر.Python وقت التشغيل wheel حزمة في أيضا يتضمن نفس عدد أمر؛SDK افتراضي استخدام `sdk`، أقصى بسيط عرض مثال اختيار `sdk-minimal`.[`src/args.ts`](src/args.ts) مسؤول أمر لغة قاعدة،[`src/bin.ts`](src/bin.ts) فقط تحميل اختيار في تشغيل جهاز. بلا فاعلية أمر، قدوم ذاتي أخرى نمط خيار، و يؤدي أمر إعداد أو بدء خطأ كل سوف بـ غير صفر حالة خروج.

## مدخل نمط

| أمر | استخدام طريق |
|---|---|
| `dsh <name>` / `dsh --profile <name>` | بدء يقع في `$DSH_HOME/profiles/<name>` إشارة تحديد profile. |
| `dsh --profile <name> --from-default-profile <template>` | من مع مرفق نموذج لوح إنشاء جديد ذاتي تعريف profile، لكن بعد بدء هو. |
| `dsh --profile acp` | عبر ACP stdio لـ تلقائي تحويل عميل توفير خدمة، مباشر حتى قطع فتح اتصال. |
| `dsh --profile headless "job"` | تشغيل واحد كل جديد حفظ دائم جلسة، ضرب طبع نهائي جواب سجل و خروج. |
| `dsh --profile sdk` | عبر JSON-RPC stdio لـ SDK عميل توفير خدمة، مباشر حتى إغلاق أو قطع فتح اتصال. |
| `dsh --profile sdk-minimal` | بـ مستقل أقصى بسيط agent(ذكي جسم) إعداد شجرة لـ SDK عميل توفير خدمة. |
| `dsh web` | بدء Web profile. |
| `dsh plugin --profile <name> <pnpm args>` | عبر في profile دليل في تحويل إرسال إعطاء pnpm قدوم إدارة هذا profile إضافة. |

تشغيل أمر وقت الذي في دليل سوف بصفة افتراضي workspace أصل دليل.`web`،`headless`،`sdk`،`sdk-minimal` و `acp` profile في أول مرة استخدام وقت سوف من مع مرفق نموذج لوح تلقائي ابتدائي تحويل. استخدام `--from-default-profile` يمكن أساس في هذه نموذج لوح لـ واحد، في بعد لم استخدام غير داخل وضع اسم موضع إنشاء أخرى profile؛ عبر `dsh plugin` فإن يمكن ابتدائي تحويل واحد بـ base لـ أساس أساس profile.`desktop` اسم إبقاء إعطاء Electron يحتفظ profile، لذلك CLI(أمر سطر واجهة) سوف رفض إبرة مقابل هو بدء، إعداد dump و إضافة إدارة طلب.

## تطبيق معامل

بدء جهاز فقط تحليل ذاته flag، و سوف ذلك بعد كل محتوى تسليم إعطاء قد بدء profile؛ حقن هذا profile مهمة معنى تطبيق إضافة كل يمكن تحليل هذا نسخة مشترك غير ممكن تغيير لقطة ([`dsh-cmdline`](../../packages/boot/cmdline/README.ar.md)). بدء جهاز لا يمكن تعرف آخر رقم واحد token علامة سجل حال تطبيق معامل بدء:

```sh
dsh --profile web --port 8080       # --port belongs to the web app
dsh --profile tui --resume <id>     # example, assuming the tui profile is installed; --resume belongs to the terminal app
dsh --profile headless "run the tests"
dsh --profile web --help            # the web app's flags, not the launcher's
dsh --help                          # the launcher's own help
```

<a id="profiles"></a>
## Profile

profile دليل يتضمن واحد `package.json`، منها سجل شجرة خارج إضافة اعتماد، و profile manifest(بيانات وصفية بيان)`dsh.profile`، منها حسب ترتيب صف `bundles` قائمة؛ أيضا يتضمن واحد `cordis.patch.yml`، منها حفظ مستخدم ذاتي ذات patch طبقة. في YAML في تفعيل `dsh-hmr` مراقبة نظر profile manifest،profile و home درجة patch ملف، مجددا عبر موحد واحد سلسلة سطر إعادة تحميل إعادة تركيب كل طبقة. لم تفعيل HMR وقت، أكثر تعديل في إعادة بدء بعد توليد فاعلية. مستمع تسجيل خلال حدوث تحرير و لاحق تحرير استخدام نفسه غير يؤدي أمر إعادة تحميل خطأ تقرير إبلاغ.[إضافة إدارة جهاز](../../packages/boot/plugin-manager/README.ar.md) و `dsh plugin` مشترك حزمة عملية و profile كتابة قفل؛ تحديث اعتماد سوف إبقاء قد توقف استخدام تركيب حزمة اختيار.CLI حزمة عملية وراثة إقرار إثبات بيئة و طرفية وصف رمز، دعم حمل تفاعل صيغة بناء دفعة دقيق؛service استدعاء إبقاء تنظيف بعد بيئة و التقاط تشخيص.

إعداد شجرة بـ فارغ أصل لـ بدء نقطة، اعتماد مرة تراكم إضافة التالي إعداد طبقة:
- `dsh.profile.bundles` في كل تركيب حزمة patch
- profile ذاته `cordis.patch.yml`، لكن بعد هو home درجة `$DSH_HOME/cordis.patch.yml`
- `--patch` إشارة تحديد تغطية طبقة

`dsh.profile.bundles` في صف خروج تركيب حزمة أولا من dsh تثبيت دليل تحليل (`@deepseek-ai/dsh-base`،`@deepseek-ai/dsh-web-app`،`@deepseek-ai/dsh-headless`،`@deepseek-ai/dsh-sdk-app`،`@deepseek-ai/dsh-sdk-minimal`،`@deepseek-ai/dsh-acp-app`) ، مجددا من profile ذاته `node_modules` تحليل؛pnpm سوف سوف شجرة خارج إضافة تثبيت إلى هذا دليل.

استخدام `--dump-default-config` و `--dump-config` يمكن في لا بدء حال حال تحت فحص تركيب بعد إعداد شجرة.

طبقة تأكيد قطع أولوية درجة،flag، إغلاق سلوك، نشر قيمة افتراضية و شفرة المصدر تنفيذ طريقة، بـ [CLI سلوك مشاركة اعتبار](reference/README.ar.md) لـ دقيق.[بدء و إعادة تحميل فشل جدول](../../packages/boot/app-boot/README.ar.md#startup-and-reload-failures) مقابل مقارنة optional،required إضافة بدء فشل و إعداد HMR سلوك.

## اختياري تغطية طبقة

`config/examples/` تسليم GitHub مراجعة webhook، جلسة داخل Schedule، تسجيل ذاكرة MCP خادم و وقت التشغيل Cordis أداة اختياري تغطية طبقة. هو جمع أبدا يخص افتراضي profile؛ ضبط و أمان شرح من[مستخدم إشارة جنوب](../../docs/user/guide/index.ar.md) و[تطوير فعلي حرب إشارة جنوب](../../docs/user/develop/practice/index.ar.md) مسؤول.

## تطوير

إنتاج تشغيل حاجة قد بناء حزمة و قبل طرف ناتج. طلب في مستودع أصل دليل مفرد وحيد تشغيل `pnpm run build`، لكن بعد استخدام `pnpm dsh <args...>` تشغيل TypeScript مدخل و تحويل إرسال كل معامل؛ وحدة تحليل اتفاق بـ[شفرة المصدر تنفيذ مشاركة اعتبار](reference/README.ar.md#source-execution) لـ دقيق.

`@deepseek-ai/dsh/profile-boot` تصدير نحو Desktop Host توفير مشترك profile دورة الحياة. قد تحليل تطبيق profile لـ وقت التشغيل حزمة تحليل إشارة تحديد ذاتي ذات تثبيت مرساة نقطة، معا امتداد استخدام Harness home patch، بديل إدارة بيئة، بعيد قياس فتح صلة،patch حار إعادة تحميل و محدود إغلاق.

[Web فشل مستطيل دفعة](tests/profiles/web/tests/web-failure-matrix.expected.e2e.ts) في `test:expected` في عبر بناء بعد CLI تحقق بدء فشل و تفعيل `awaitWriteFinish` أصلي إعداد HMR. هو لا استدعاء نموذج API، بينما هو فحص مرور مرور إقرار إثبات HTTP استجابة، تشخيص، استعادة، عملية خروج و dispose؛[بدء تحقق استلام اختبار](tests/profiles/web/tests/web-best-effort-startup.expected.e2e.ts) أيضا تغطية مع مرفق Web مطلوب اعتماد و طرف فتحة اندفاع مفاجئ.

# Agent Note: Python SDK Windows x64 وقت التشغيل

Status: implemented
Archived: 2026-09-04

[English](2026-08-23-python-sdk-windows-x64-runtime.md) | العربية

## Problem

Python SDK وقت التشغيل توزيع حاجة Windows تحميل جسم، معا لا يستطيع إنشاء آخر عدد تطبيق مدخل، أيضا لا يستطيع تقليل ضعيف قائم أصلي هدف الذي استخدام installed-wheel دليل.Windows يمكن تنفيذ ملف اسم،Python wheel وسم،ConPTY addon،ripgrep sidecar،shell تركيب، وهمي محاكاة بيئة و عملية بدء قاعدة متساو مختلف في Linux و macOS. فقط سند عبر منصة اختبار وحدة أو غير Windows يمكن تنفيذ ملف صوت تسمية دعم حمل Windows، سوف جعل `pip` فعلي اختيار ناتج لم مرور إثبات.

## Decision

### وحيد x64 منتج

`python/sdk-runtime/platforms.json` إعلان وحيد Windows هدف `win-x64`. ذلك pkg هدف هو `node24-win-x64`، وقت التشغيل wheel وسم هو `py3-none-win_amd64`، تحميل حمل يتضمن `deepseek-harness-sdk-runtime-win-x64.exe` و `deepseek-harness-sdk-runtime-win-x64-rg.exe`. تحزيم بعد `node-pty` ملف شجرة يجب يتضمن اثنان عدد x64 ConPTY addon. وقت التشغيل فحص بحث سوف رفض Windows arm64، لن اختيار x64 wheel أو يأخذ هو إعادة علامة لـ arm64.

Python عملية ما زال حسب [Python profile وقت التشغيل قرار](2026-08-23-python-sdk-dsh-profile-runtime.zh.md) بدء عادي `dsh --profile sdk` تطبيق، و اشتراط صريح Harness home.Windows لن زيادة Python مخصص استخدام Node تطبيق، كامل إعداد مدخل، خفي صيغة `~/.dsh` أو نظام Node اشتراط.

### أصلي بناء و إصدار

يمكن تنفيذ ملف بناء جهاز فقط سماح x64 استخدام pkg `win` منصة، و اشتراط Windows بناء في Windows مضيف x64 Node تحت تشغيل؛ بناء جهاز إبقاء `.exe` ملف اسم، و يأخذ `@vscode/ripgrep-win32-x64` نسخ لـ معتاد قاعدة `-rg.exe` sidecar.Pnpm عملية فرعية عبر `process.execPath` تنفيذ استدعاء جهة توفير JavaScript مدخل. عند استدعاء جهة كشف `.cmd` shim وقت، بناء جهاز سوف عبر `PNPM_HOME` تحليل قد تثبيت `pnpm.mjs` أو `pnpm.cjs`؛ إذا لا وجود JavaScript مدخل، بناء سوف فشل، بينما لن بدء shim أو تفعيل أمر shell.

مطلوب GitHub مستطيل دفعة سوف في `windows-2025` فوق بناء `node24-win-x64`، و Linux x64،Linux arm64،macOS arm64 و macOS x64 و صف. عام GitHub إصدار و GitLab وسم خط الإنتاج كل سوف إصدار نفس مجموعة خمسة عدد وقت التشغيل wheel إضافة صاف SDK wheel. هدف تحليل،manifest، مستطيل دفعة، إصدار محتوى و وثيقة متساو لا يتضمن Windows arm64.

### Installed-wheel سلوك

Windows lane سوف إنشاء جاف صاف Windows وهمي محاكاة بيئة، تثبيت إصدار دقيق مطابقة SDK و `win_amd64` وقت التشغيل wheel، تبديل إلى checkout خارج دليل، صاف حذف `PYTHONPATH` و `DSH_RUNTIME_MODE`، مجددا تشغيل و أخرى هدف نفسه `--scenario all --installed-wheel` أسود صندوق اختبار. يمكن معلومة سحب أخذ طلب أيضا سوف تشغيل نفسه مزدوج جولة `sdk-live` حقيقي مزود مشهد.Fork و Dependabot head لن نيل نيل مفتاح.

عام Python عميل عبر `initialize_timeout_seconds` لـ أول مرة profile إمساك يد توفير مستقل 30 ثانية افتراضي حد أعلى. هذا حد أعلى يمكن سعة قبول Windows x64 يمكن تنفيذ ملف بارد بدء و profile شيء تحويل، معا ما زال سوف جعل بطاقة ميت وقت التشغيل فشل؛ استدعاء جهة يمكن سوف ذلك و عادي طلب مهلة قسم فتح إعداد.

نجاح استلام إلى shutdown استجابة بعد،Python عميل سوف إغلاق stdin، و في قد إعداد shutdown مهلة داخل انتظار `dsh` سياق خروج و تحديث كتابة حمل دائم session حالة، لكن بعد عندئذ رجوع إلى إنهاء عملية.Shutdown فشل وقت ما زال قيام أي تنفيذ محدود إنهاء.`shutdown_timeout_seconds` سوف قسم آخر حد shutdown طلب،EOF عرض حد و إنهاء تأكيد مرحلة مقطع، لذلك استثناء إغلاق في نهائي kill قبل ممكن وصل قريب هذا قيمة ثلاثة ضعف. هذا منطقة آخر سوف إبقاء Windows فوق الأكثر بعد واحد قد قبول جولة؛ هذا منصة `terminate()` سوف قوي صنع انتهاء عملية، بينما لا هو إرسال يمكن التقاط إشارة.

أقصى بسيط أسود صندوق اختبار في Windows فوق استخدام حمل دائم `pwsh` و `str_replace_editor`، و من `minimal/win-x64/model-visible.json` ثابت مسبق مدة؛Linux و macOS إبقاء حمل دائم Bash و مشترك `minimal/model-visible.json`. عال درجة عملية/subagent لقطة و إعادة بدء/حمل دائم سجل لقطة متابعة من كل هدف مشترك. مع مرفق [`sdk-minimal` تركيب حزمة](../../../../packages/bundle/sdk-minimal/README.zh.md) لـ يمكن تشغيل Python تعليم مسار اختيار نفس مجموعة منصة shell.

## Existing decisions and supersession

هذا قرار جزء يحل محل[مفرد ملف وقت التشغيل توزيع](2026-07-10-single-file-executable-sdk-runtime-distribution.zh.md) في Windows غير هدف إعلان، و توسيع[تثبيت بعد Python wheel أسود صندوق قرار](../testing/2026-08-23-installed-python-wheel-black-box-ci.zh.md) في مطلوب هدف تجميع دمج. فوق وصف Note متابعة مسؤول SEA تحزيم، اثنان عدد Python distribution، مصدر تحقق، مفتاح معالجة و عام أسود صندوق مشهد.

## Alternatives considered

**في dsh profile وقت التشغيل قبل زيادة Windows.** مرفوض: إبرة مقابل قد تراجع دور خاص مباشر بدء تحميل جسم اختبار لا يمكن إثبات Windows مستخدم فعلي نيل نيل شكل.Windows فقط تعريف في وحيد `dsh` بدء هيكل بنية.

**معا إصدار Windows arm64.** مرفوض: قد قبول منتج نطاق فقط لديه x64؛ زيادة ثاني نوع هيكل بنية حاجة مستقل أصلي بناء جهاز،wheel وسم،ConPTY و ripgrep تحميل حمل تحقق،installed-wheel مستطيل دفعة lane و إصدار ناتج.

**لـ Windows توفير مقارنة صغير خطر دخان اختبار طقم عنصر.** مرفوض: واحد منصة wheel لا يستطيع استعارة استخدام أخرى يمكن تنفيذ ملف بروتوكول، حفظ دائم،worker،MCP، إضافة، أصلي أداة أو حقيقي مزود دليل. فقط لديه حمل دائم shell surface استخدام منصة مخصص تابع مسبق مدة، ذلك بقية لقطة متابعة مشترك.

**عبر Git Bash تشغيل Windows lane.** مرفوض: مستودع اشتراط Windows runner استخدام أصلي `pwsh`، بينما MSYS مسار تحويل لا يمكن إثبات أصلي أمر سلوك. يمكن نقل غرس مفرد سطر خطوة استخدام كل runner افتراضي shell؛ مسار، وهمي محاكاة بيئة و أسود صندوق خطوة قسم آخر توفير صريح POSIX و PowerShell شكل صيغة.

## Consequences

Python تثبيت سوف اختيار بلا حاجة Node Windows x64 وقت التشغيل، و و Linux،macOS استخدام نفس طقم صريح home و profile ذاتي تعريف نموذج. كل سحب أخذ طلب كل سوف يأخذ Windows يمكن تنفيذ ملف و وقت التشغيل wheel بصفة خمسة عدد أصلي هدف لـ واحد إجراء بناء، تشغيل كامل keyless أسود صندوق اختبار، و في يمكن معلومة head فوق تشغيل حقيقي مزود مهمة. مرشح إرسال سطر إصدار تحقق سوف إبقاء ستة عدد wheel.Windows arm64 مستخدم سوف استلام إلى واضح لا دعم حمل منصة خطأ، مباشر إلى آخر بند أصلي منتج قرار توفير و إثبات هذا تحميل جسم.

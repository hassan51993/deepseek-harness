# Agent Note: Web قشرة ناتج قسم قطعة تفكيك قسم و دليل تخطيط

Status: implemented
Archived: 2026-09-04

[English](2026-08-06-web-shell-dist-chunk-layout.md) | العربية

## Problem

apps/web قشرة هذا قبل ضرب صار مفرد واحد نحو 1.2 MB(minified) index قسم قطعة، منها نحو ثمانية صار هو vendor بايت——KaTeX،boot لغة قاعدة و shiki جذب محرك،react-dom،markdown خط الإنتاج——و الكل workspace قشرة شفرة (نحو خمسة قسم لـ واحد) صهر في واحد بدء. أي واحد سطر قشرة شفرة تعديل كل يجعل كامل chunk تبديل ها أمل، مجددا مرة وصول عميل كل كمية إعادة تحت تحميل؛`dist/assets/` هو 100 كثير عدد ملف مفرد طبقة مستو فرش (رئيسي قسم قطعة،23 عدد كسول تحميل لغة قاعدة chunk،59 عدد KaTeX حرف جسم وجه،sourcemap خلط إقامة) ، بلا من تنقل.

## Decision

`apps/web/vite.config.ts` بـ `manualChunks` يأخذ قشرة قطع صار اثنان عدد ابتدائي قسم قطعة، و بـ إخراج تسمية دالة عودة صنف دليل؛ كامل طقم إعداد صفر صحيح فإن——دقيق حزمة اسم Set، ملف اسم بيان، توسيع اسم بيان.

**عضو ملكية**(`VENDOR_PACKAGES`، حسب دقيق npm حزمة اسم):

- `vendor` = ثلاثة عدد إعادة تصيير بيت عائلة:math(katex) ،highlight(shiki) ،markdown(micromark/mdast تحليل خط الإنتاج——ذلك فوق زيادة كمية React مصير هو workspace شفرة، لا في هذا صف). عضو بـ `VENDOR_PACKAGES` لـ نشط فتحة مسار، بيان = workspace شفرة**مباشر import** حزمة: ذلك بقية خاص نقل تمرير اعتماد (oniguruma نظام،@shikijs/core، محرف جدول انتظار عدد عشرة عدد) فقط يتم بيان عضو مرجع،rollup قسم قطعة حال لون تلقائي سوف ذلك و دخول vendor؛ و index جانب مشترك اعتماد عودة سقوط index، فقط نادر تفسير بضعة KB، لا بنية صار صحيح تأكيد صفة مشكلة.
- **vendor كل عضو يجب react-free(حد ثابت كمية)**:rollup سوف يأخذ مدخل و manual chunk مشترك وحدة و دخول manual chunk——بيان داخل ظهور أي import react/jsx-runtime حزمة، وحيد واحد نسخة react فرعي هذا حينئذ سوف يتم جر دخول vendor، انفصال مغادرة index.markdown/math React تصيير جانب هو workspace شفرة، يوم لكن إقامة index،react عائلة لذلك الكل تثبيت في index.
- `index`(افتراضي قسم قطعة)= react عائلة (react،react-dom،scheduler،use-sync-external-store) ،vendored cordis، الكل workspace شفرة و لم صف دخول صغير عنصر (anser،clsx).
- `@shikijs/langs` خاص حكم:boot لغة قاعدة (`BOOT_GRAMMAR_FILES`:typescript،shellscript،json——highlight.ts ساكن حالة import ثلاثة عنصر، متساو لـ صفر داخلي import ذاتي يحتوي بيانات وحدة) دخول vendor؛ ذلك بقية 23 عدد كسول تحميل لغة قاعدة لا فعل إشارة إرسال، كل منها إبقاء حسب يحتاج chunk.
- `index.html` من vite تلقائي وصل خط:index مشي `<script>`،vendor مشي `<link rel="modulepreload">`، اثنان عدد قسم قطعة و سطر سحب أخذ، بلا سلسلة سطر تحميل شلال نشر.

**دليل تخطيط**(`chunkFileNames` + `assetFileNames`):

- `assets/` أصل فقط إبقاء index و vendor js(يحتوي مع سطر sourcemap) و css.
- لغة قاعدة chunk عودة `assets/langs/`. حكم حسب هو chunk `moduleIds` يحتوي `@shikijs/langs` عضو، بينما غير facade: داخل تضمين لغة قاعدة مشترك chunk(php/ruby/mdx داخل تضمين html+javascript، يتم rollup تفكيك خروج مشترك)**لا يوجد facade**،facade حكم حسب سوف تسرب؛index/vendor حسب اسم ترتيب حذف، بسبب vendor دمج قاعدة يحمل boot ثلاثة لغة قاعدة.
- حرف جسم عودة `assets/fonts/`(`FONT_EXTENSIONS`:woff2/woff/ttf؛ كل قد تسليم ملف كل هو vendor.css مرجع KaTeX حرف جسم وجه——katex.min.css رغم من index جانب مكون import،css وحدة نفس مثال مرور manualChunks ملكية، مع `katex` سقوط دخول vendor.css؛ متصفح حسب يحتاج فقط سحب woff2، كما فقط في عام صيغة تصيير وقت).
- sourcemap بلا حاجة أمان ترتيب:rollup يأخذ `.map` كتابة في كل منها js جانب و بـ عار متبادل مقابل ملف اسم مرجع، قسم قطعة نقل دليل وقت map تلقائي تتبع مع.

عبر دليل مرجع (index حركة حالة import إشارة نحو `langs/`، لغة قاعدة chunk بين نفس دليل متبادل مقابل مرجع،vendor.css متبادل مقابل مرجع `fonts/`) متساو من بناء جهاز توليد، وقت التشغيل صفر إعداد طقم تعديل؛host جانب webserver حسب ساكن حالة بادئة أصل مثال خدمة تضمين طقم مسار.

## Alternatives considered

- **react انتظار vendor مشي CDN**:dsh web موجه إلى هذا آلة/داخل شبكة رئيسي آلة (معتاد بلا خارج شبكة) ،CDN مباشر غير ممكن استخدام؛react هو الكل إضافة bundle platform seed external(قشرة هو وحيد توفير إعطاء جهة) ، تعديل CDN عام متغير شكل يحتاج جر حركة platform بيان/seed/وحدة جدول ثلاثة موضع؛ ذاكرة مؤقتة استلام فائدة من vendor قطع قسم يكفي أخذ نيل.
- **عكس نحو التقاط قاع قاعدة (node_modules حذف react عائلة كل عودة vendor)**: عضو من إعداد فوق قراءة لا خروج قدوم، كما يأخذ anser/clsx صنف صغير عنصر خطأ عودة vendor؛ يتم صحيح نحو دقيق حزمة اسم بيان يحل محل.
- **صحيح فإن بيت عائلة مطابقة**: يمكن قراءة صفة فرق؛ دقيق حزمة اسم + rollup مقابل نقل تمرير اعتماد تلقائي حال لون جعل نمط مطابقة لا يوجد لا بد يلزم.
- **بـ facadeModuleId تعرف آخر لغة قاعدة chunk**: بلا facade داخل تضمين لغة قاعدة مشترك chunk سوف تسرب فحص سقوط عودة أصل دليل؛`moduleIds` عضو حكم حسب تغطية اثنان نوع شكل.
- **في vendor داخل استلام إبقاء حمل react حافة تصيير باب وجه**(تاريخ فوق react-markdown تابع هذا صنف): سوف مرور rollup مشترك وحدة عودة و يأخذ وحيد react فرعي هذا جر دخول vendor، كسر تالف «react عودة index» حد؛ هذا قيد قد صار نص لـ بيان حد ثابت كمية.
- **KaTeX كامل جسم كسول تحميل،boot TypeScript لغة قاعدة تحويل كسول**: سوف تغيير أول لقطة تصيير سلوك (عام صيغة/أول عدد شفرة كتلة رجوع) ، هو مستقل في ناتج تخطيط أخذ ترك، آخر سطر قرار.

## Verification

مراجعة حساب أداة مع مكتبة:`node scripts/attribute-chunk-bytes.mjs <chunk.js>`(صفر اعتماد sourcemap VLQ بايت ملكية، حسب npm حزمة/workspace دليل تجمع دمج). بـ ذلك تكرار نواة:vendor لا يحتوي أي workspace بايت،react عائلة (يحتوي react/jsx-runtime) كل كمية يقع في index،index npm جانب فقط باق react عائلة و anser/clsx؛ كسول لغة قاعدة chunk عدد كمية و `LAZY_GRAMMARS` جدول واحد واحد مقابل؛ متصفح keyless replay حالة استخدام و تعديل قبل أساس خط تدريجي حرف متسق (خاص تحديد في هذا آلة بيئة تقرير أحمر حذف خارج) ، مزدوج قسم قطعة قشرة تركيب تحميل تصيير بلا ارتداد.

## Consequences

- قشرة شفرة تعديل فقط إعادة ها أمل index(نحو لـ ناتج ثلاثة قسم لـ واحد) ؛vendor(نحو ثلاثة قسم لـ اثنان) عبر قشرة إصدار ذاكرة مؤقتة مستقر، فقط اعتماد ترقية وقت بطلان.
- `dist/assets/` يمكن تنقل: أصل اثنان مقابل js/css،`langs/` حسب يحتاج لغة قاعدة،`fonts/` حرف جسم.
- صيانة صار هذا:workspace شفرة إضافة جديدة مقابل بعض تصيير بيت عائلة باب وجه حزمة مباشر import وقت يحتاج تزامن `VENDOR_PACKAGES`(تسرب صف فقط نادر تفسير index، لا يؤدي تالف) ؛ في highlight.ts توسيع boot لغة قاعدة تجميع بينما لم تزامن `BOOT_GRAMMAR_FILES` وقت، هذا لغة قاعدة ساكن صامت سقوط دخول index، فقط ناتج مراجعة حساب مرئي.
- webserver ساكن حالة وجه بعد بلا ضغط،gzip جسم تراكم استلام فائدة ما زال لديه انتظار تنفيذ؛ نقل طبقة ضغط هو آخر بند مستقل قرار.

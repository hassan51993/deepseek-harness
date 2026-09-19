# Agent Note: Client Settings،Locale و Theme قسم طبقة

Status: rejected — closed as a proposal: the shipped ui-settings, locale, and ui-theme packages and their READMEs own the design

[English](2026-07-25-client-settings-locale-theme.md) | العربية

## مشكلة

متصفح طرف قد لديه Settings مباشر كتابة في Sidebar داخل، لغة و رئيسي عنوان أيضا من مكون محلي حالة مباشر تعديل DOM. هذا جعل Settings لا يمكن من مستقل إضافة توسيع، انحراف جيد حالة لا يوجد مستقر عبر إضافة خدمة اتفاق، رئيسي عنوان سجل التسجيل معا تحمل تحمل حالة و عرض مسؤولية.

## رفع سجل

**تنسيق عمل توجيه نحو (لاحق كل وحدة وصل دخول Settings طريقة): وظيفة تابع رئيسي ذاتي تسجيل.** Settings قشرة هو صاف تركيب وجه: فقط إعلان slot، تصيير chrome بنية، صفر نص سجل، لا اعتماد locale، لا import أيضا لا قطعة رفع أي وظيفة؛ واحد وظيفة يلزم ظهور في Settings داخل، من هو ذاتي ذات إضافة نحو مقابل slot تسجيل——locale تسجيل Language سطر،ui-theme تسجيل Appearance سطر،ui-settings-models تسجيل Models واحد درجة وجه لوح. لا لـ «بعض وظيفة ضبط صفحة» مفرد فتح `ui-settings-*` حزمة: ضبط وجه يخص وظيفة حزمة ذاته (فعل Theme وظيفة،Theme ضبط اختيار حينئذ مع ui-theme واحد بدء تسليم). لا يخص أي مفرد واحد وظيفة محتوى (trigger/عنوان/close chrome نص سجل،General دليل و هيكل هيكل سطر،`settings` حرف قاموس) من `ui-settings-general` يملك——هو هو «بلا رئيسي نص سجل» تابع رئيسي، لا هو وظيفة حماية نجم حزمة.

Sidebar إعلان `sidebar.settings` single slot،`ui-settings` احتلال استخدام هو و إعلان أربعة عدد slot:`settings.trigger` / `settings.header` / `settings.close`(chrome محتوى مقعد،single) و `settings.section`(واحد درجة صفحة،list). بلا عائق عائق اسم الكل تحليل ذاتي slot محتوى:trigger بلا عائق عائق اسم أي ذلك نص محتوى،dialog مرور aria-labelledby إشارة نحو header محتوى عقدة،close هو نظر شعور إخفاء نص مقعد. كل section من وظيفة إضافة مساهمة؛ قشرة فقط من slot ledger قراءة entry metadata توليد تنقل، عبر `only` تصيير حالي section.General من `ui-settings-general` تسجيل (order 0) و إعلان `settings.general.item` list slot، وظيفة إضافة انحراف جيد سطر حسب order ترتيب دخول.

Settings مدخل هو sidebar Foot Settings سطر، نقر مباشر فتح 1080×700 إقامة في طفو طبقة (أسود 24% حجب غطاء) ؛close حسب زر، نقر حجب غطاء،ESC متساو إغلاق. بلا أي في بين قائمة مفرد شكل.

`@deepseek-ai/dsh-client-locale` توفير `ctx.locale`،`ui-theme` توفير `ctx.theme`. اثنان عدد خدمة كل بـ getter قراءة،setter كتابة و استخدام typed Cordis تغيير حدث إصدار غير ممكن تغيير لقطة؛ خدمة ذاتي ذات حفظ دائم انحراف جيد (فقط تخزين id، بلا فاعلية قيمة رجوع افتراضي).

وظيفة سطر apply طبقة كل منها حجز قراءة ذاتي بيت تغيير حدث (locale حجز `locale/change`،ui-theme حجز `theme/change`) ، يأخذ لقطة إسقاط إلى هذا سطر تسجيل وقت إعلان slot store.React مكون فقط قراءة `useStore`، كتابة حقن setter callback، لا قراءة ctx أو خدمة.

Theme انحراف جيد ثلاثة حالة:`light`،`dark`،`system`، افتراضي `system`(بلا حفظ دائم انحراف جيد أو بلا فاعلية قيمة وقت).system تحليل تابع رئيسي عنوان مجال:ThemeRuntime يحتفظ `prefers-color-scheme` matchMedia استماع (بيئة شعور معرفة، غير DOM عرض) ، انحراف جيد لـ system كما نظام إعداد لون تغير وقت إعادة إرسال لقطة؛ لقطة معا يحمل `preference` و تحليل بعد `active` تعريف.

Theme خدمة لا عملية DOM.`ui-layout` ابتدائي قراءة Theme getter، مع بعد حجز قراءة `theme/change`، من Layout يحتفظ presenter حسب `active` تحديث `body[data-ds-dark-theme]` و رئيسي عنوان token؛presenter لا شعور معرفة system، فقط إزالة استهلاك قد تحليل نتيجة.

### أول مدة تسجيل وجه

| تسجيل وجه | تابع رئيسي إضافة | أول مدة محتوى |
|---|---|---|
| chrome محتوى (trigger/header/close)| `ui-settings-general` | ضبط مدخل سطر رسم علامة+نص سجل، وجه لوح عنوان،close إخفاء نص |
| General section(order 0)| `ui-settings-general` | Permission،Tool Call نظر شعور هيكل هيكل (بلا كتابة عملية)+ `settings.general.item` slot إعلان |
| Language سطر (item order 0)| `locale` | Selector تحت سحب، العربية/English حقيقي يمكن قطع |
| Appearance سطر (item order 10)| `ui-theme` | Light/Dark/System ثلاثة cube حقيقي يمكن قطع (اختيار في حالة نظر preference) |
| Models section(order 10)| `ui-settings-models` | فقط تنقل بند، محتوى منطقة لـ فارغ؛ لاحق نموذج إدارة وظيفة سقوط في هذا حزمة |
| إضافة | بلا | أول مدة لا فعل، تنقل لا ظهور هذا بند (لاحق إضافة وظيفة حزمة تسجيل section أي تلقائي ظهور) |

أول مدة فقط مقابل Settings طفو طبقة داخل نص سجل إجراء محلي تحويل؛ حرف قاموس حينئذ قريب تخزين وضع——chrome + General هيكل هيكل عودة `ui-settings-general` `settings` namespace، وظيفة سطر نص سجل عودة كل وظيفة حزمة (`settings.locale`،`settings.theme`،`settings.models`).

### slot توسيع اندفاع

```text
root
└─ sidebar
   └─ sidebar.settings                   single/root
      └─ ui-settings(قشرة، صفر نص سجل)
         ├─ settings.trigger single/root ui-settings-general تسجيل
         ├─ settings.header single/root ui-settings-general تسجيل
         ├─ settings.close single/root ui-settings-general تسجيل
         └─ settings.section             list/root
            ├─ general (order 0) ui-settings-general تسجيل
            │  └─ settings.general.item  list/root
            │ ├─ language (0) locale تسجيل
            │ └─ appearance (10) ui-theme تسجيل
            └─ models (order 10) ui-settings-models تسجيل
```

section/item contribution استخدام `ctx.slots.inject()`، لا اعتماد client manifest(بيانات وصفية بيان) apply ترتيب؛ محلي تحويل label مشي [كل كمية وصل دخول Note](../../archived/architecture/2026-07-30-client-locale-full-rollout.md) label thunk.SlotMap نوع قسم بيت:trigger/header/close/section صحيح بيت في ui-settings اتفاق (مستهلك general/models متساو اعتماد قشرة، بلا حلقة) ؛`settings.general.item` صحيح بيت في locale حزمة——هو هو الكل item تسجيل جهة الأكثر منخفض عام مشترك اعتماد (ضبط سطر لا بد حمل نص سجل) ، بينما إعلان جهة general اتفاق مقابل locale/ui-theme غير ممكن بلوغ (سوف صار حلقة) ؛ui-theme مرور re-export خروج فتحة إزالة استهلاك.

### slot إعلان هو واحد انتظار يمكن حقن انتظار كائن

`SlotRegistry.inject()` مباشر انتظار لديه نوع قيد ledger key؛ هو لن سوف إعلان جسر وصل لـ دمج صار `slot:<name>` Cordis خدمة. عودة ضبط سوف تتبع مع إعلان طي و إعادة إعلان، بينما ذلك تحكم جهاز ما زال عودة مساهمة جهة إضافة fiber كل؛ مباشر نحو لم إعلان slot تسجيل ما زال سوف مباشر تقرير خطأ. هذا حذف أساس في قديم قديم disposer في موضع حالة آلة، و سعة سهل بسبب تجميع كتابة خطأ خروج خطأ مستو سطر خدمة نطاق الأسماء. كامل دورة الحياة و فشل اتفاق رؤية [slot إعلان حقن قرار](../../archived/architecture/2026-08-05-slot-declaration-injection.md).

### خدمة اتفاق

```ts
export type ThemePreference = 'light' | 'dark' | 'system'

export interface ThemeDefinition {
  id: string
  colorScheme: 'light' | 'dark'
  tokens: Record<string, string>
}

export interface ThemeSnapshot {
  preference: ThemePreference
  active: ThemeDefinition // system قد تحليل لـ أداة جسم light/dark تعريف
  themes: readonly ThemeDefinition[]
  revision: number
}

export interface LocaleDefinition {
  id: 'ar' | 'en'
  label: string
}

export interface LocaleSnapshot {
  active: 'ar' | 'en'
  locales: readonly LocaleDefinition[]
  revision: number
}

export interface Events {
  /** @param snapshot - Current locale registry snapshot. @mode emit */
  'locale/change'(snapshot: LocaleSnapshot): void
  /** @param snapshot - Current theme registry snapshot. @mode emit */
  'theme/change'(snapshot: ThemeSnapshot): void
}
```

Locale داخل وضع العربية و English؛`setLocale`/`setTheme` هو وحيد كتابة فتحة، لم معرفة id فشل.

## سبق اعتبار بديل خطة

**من app shell موحد واحد حجز قراءة انحراف جيد و إعادة تصيير root slot tree.** لغة و رئيسي عنوان تغير فقط حاجة تحديث فعلي مستهلك؛ كل شجرة تحديث جديد وضع كبير أثر وجه، أيضا يأخذ عمل خدمة انحراف جيد وصل دخول shell.

**Theme خدمة مباشر تعديل DOM.**سجل التسجيل خدمة لذلك اعتماد عرض بيئة، دورة الحياة و عام مثال صيغة كل حق لا صاف؛Layout قد يملك صفحة أصل عرض حد.

**system من Layout presenter تحليل.** presenter يحتاج ذاتي حمل matchMedia حجز قراءة و في themes قائمة داخل انتقاء اختيار أداة جسم تعريف، عرض طبقة يتم إجبار إدارة حل انحراف جيد دلالة؛ تحليل وضع خدمة جانب فإن كل مستهلك أخذ إلى متسق قد تحليل لقطة.

**Settings import و قطعة رفع كل section.** إضافة جديدة صفحة يجب تعديل قشرة إضافة، كسر تالف «كل وظيفة من ذاتي ذات إضافة احتلال استخدام slot» تركيب نموذج.

**حسب وظيفة لـ كل section مفرد فتح `ui-settings-*` حماية نجم حزمة.** ضبط وجه و وظيفة هذا جسم قسم بيت: تعديل Theme سلوك يلزم حركة اثنان عدد حزمة، حزمة عدد مع ضبط بند خط صفة تمدد انتفاخ، كما حماية نجم حزمة عكس نحو اعتماد locale/theme خدمة، شكل صار صاف خالص لـ تفكيك حزمة بينما توليد في بين طبقة. وظيفة تابع رئيسي ذاتي تسجيل تحت لا وجود هذا طبقة:preference سطر مع وظيفة حزمة تسليم؛`ui-settings-general` فقط استلام بلا رئيسي نص سجل (chrome و General هيكل هيكل) ، لا تحمل تحميل أي وظيفة ضبط وجه.

**يأخذ Locale/Theme لقطة مباشر حقن React.** inject نتيجة حسب entry identity ذاكرة مؤقتة، سهل تغيير قيمة سوف قديم قديم؛ لـ كل خدمة ذاتي صنع React خطاف أيضا التفاف فتح slot store موحد واحد ربط.

## تحقق استلام معيار

- Settings قشرة فقط اعتماد slot ledger، لا اعتماد مهمة واحد وظيفة تنفيذ؛General item قائمة نفس مثال فقط اعتماد ledger.
- إضافة جديدة واحد ضبط بند = وظيفة حزمة ذاتي ذات تسجيل (section أو general item) ، صفر قشرة تعديل.
- Locale و Theme كتابة فقط مشي setter، حمل متابعة تزامن فقط مشي تغيير حدث.
- وظيفة سطر store ابتدائي تحويل مشي getter، لاحق من ذاتي بيت تغيير حدث تحديث و نطاق جزء إعادة تصيير.
- Layout مستقل تطبيق Theme لقطة،Theme خدمة لا وصول DOM؛presenter لا ظهور system فرع.
- العربية/English و Light/Dark/System قدرة تبديل و تحديث جديد بعد استعادة؛ انحراف جيد لـ system وقت نظام إعداد لون تغير أي وقت توليد فاعلية.
- Models فقط لديه تنقل بند و فارغ محتوى منطقة؛Permission،Tool Call هيكل هيكل بلا كتابة عملية.
- طفو طبقة مرور close حسب زر، حجب غطاء نقر،ESC متساو يمكن إغلاق.

## ريح خطر

slot إعلان و contribution apply ترتيب لا ثابت، كل section/item تسجيل جهة يجب استخدام `ctx.slots.inject()`، بينما لا يستطيع بـ خدمة أو محلي disposer بصفة في موضع إشارة.service event ممكن مبكر في سطر أول مرة تصيير، وظيفة سطر store init و inject attach كل يجب من getter مقابل متساو حالي لقطة.`settings.general.item` تكرار دمج فرعي هذا (locale،ui-theme) و ui-settings صحيح بيت يجب تدريجي حرف متسق، عائم نقل أي ثلاثة موضع واحد بدء تعديل.Layout إزالة وقت يجب تنظيف ذاتي ذات ضبط عام خاصية،ThemeRuntime dispose(مورد تحرير) وقت يجب إزالة matchMedia استماع، تجنب تجنب HMR(حار وحدة استبدال) بعد ناقص إبقاء.

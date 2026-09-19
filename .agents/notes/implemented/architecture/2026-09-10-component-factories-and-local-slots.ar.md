# Agent Note: حمل نطاق جزء slot يمكن إعادة استخدام مكون Factory

Status: implemented

[English](2026-09-10-component-factories-and-local-slots.md) | العربية

## مشكلة

متصفح Slot نظام من parent-owned توسيع موضع بدء.parent entry عبر `children` إعلان child، بعد متبادل لا متبادل صلة إضافة يمكن نحو هذا موضع تسجيل تنفيذ. إعلان ثابت child Slot kind،scope، تصيير إذن و دورة الحياة.

يمكن إعادة استخدام مكون تركيب إعداد اعتماد متبادل عكس كل حق جهة نحو. واحد حزمة تعريف تركيب إعداد، متبادل لا متبادل صلة parents تصيير مستقل occurrence، و كما كل parent يمكن لـ أداة اسم داخلي منطقة مجال اختيار مختلف Component. عادي Slot لا يمكن يمثل هذا نوع علاقة، لأن هو definition يخص عام Slot شجرة في واحد parent موضع.

تعريف حزمة و إزالة استهلاك حزمة مستقل تحرير ترجمة.TypeScript لا يمكن من آخر عدد حزمة في وقت التشغيل registration دفع توجيه الذي اختيار Component props، آخر سطر صيانة مسطح مستو props نوع فإن سوف تكرار store،injection،locale،child-render و scope إعلان.

## قرار

`ui-slots` و `ui-renderer` في[عادي Slot جسم نظام](2026-07-22-slot-type-chain-implementation.ar.md) خارج توفير أداة اسم Component Factory.`registerFactory()` تثبيت واحد يمكن إعادة استخدام definition،`renderFactorySlot()` تصيير واحد occurrence،definition عبر `useFactorySlot()` قراءة استدعاء جهة اختيار نطاق جزء Component.

### متبادل عكس تسجيل جهة نحو

عادي Slot و Component Factory إبقاء مختلف كل حق نموذج.

| خاصية | عادي Slot | Component Factory |
|---|---|---|
| أول عدد إعلان | Parent إعلان child Slot | Definition owner إعلان Factory |
| لاحق عملية | Child تسجيل دخول parent موضع | Parent تصيير occurrence |
| ساكن حالة مرجعي | `SlotMap` وصف موضع | `SlotFactoryMap` وصف كامل definition |
| صالح definitions | كثير عدد entries يمكن احتلال حسب cells | واحد definition وحيد احتلال واحد Factory اسم |
| Parent إدخال | `renderSlot()` owner و keyed props | `renderFactorySlot()` occurrence props |
| Parent اختيار Component | Registry routing اختيار entries | استدعاء جهة لـ كل نطاق جزء slot اختيار واحد Component |
| بعد بديل نقطة توسيع | Entry-owned عادي `children` | Definition-owned عادي `children` |

`SlotFactoryMap` عبر إعلان دمج إعطاء خروج كامل ساكن حالة definition:

```text
interface SlotFactoryDef {
  scope: SlotScope
  props?: object
  children?: ChildrenDecl
  store?: StoreDecl
  inject?: object
  locale?: keyof LocaleNamespaceMap & string
  slots?: Record<string, { scope: SlotScope; props?: object }>
}
```

هذا map هو وحيد نوع مرجعي.`registerFactory()` أصل حسب مقابل map بند فحص وقت التشغيل definition و رئيسي Component.Store إعلان عبر `HandleOf` مواصفة تحويل، لذلك registration فقط قبول واحد مشترك handle أو واحد توليد هذا handle factory، أبدا قبول تضمين طقم factory.`FactoryComponentPropsOf<F>` و `FactoryLocalComponentPropsOf<F, N>` من نفس بند دفع توجيه كامل Component props؛definition owner و مستهلك بلا حاجة إعادة وصف مسطح مستو مشترك نوع.

### Definition و occurrence دورة الحياة

كل Factory اسم في مستقل في عادي Slot cells registry ledger في فقط لديه واحد صالح definition.registration التزام دوران استدعاء جهة Cordis effect.dispose سوف إزالة definition، طي ذلك عادي child إعلان، إشعار قد تركيب outlets، و أمر إبقاء child-render أو نطاق جزء Component إذن بطلان.

كل مرة `renderFactorySlot()` استدعاء كل سوف إنشاء occurrence، ذلك identity من React موضع و `key` قرار. استبدال definition سوف إعادة تركيب occurrence.Definition Component و ذلك fallback نطاق جزء Component فشل ملكية definition، استدعاء جهة الذي اختيار نطاق جزء Component فشل ملكية استدعاء جهة registration؛ تضمين طقم Factory تصيير إبقاء نفس owner. كل فشل كل حد في حالي occurrence داخل، لن إزالة مشترك definition. تركيب إعداد خطأ متابعة نحو خارج نقل بث، كل حق و قديم قديم تخويل خطأ فإن مثل عادي مكون فشل واحد مثال فوق تقرير. خارج طبقة خطأ حد مع Factory scope incarnation إعادة وضع، كل نطاق جزء حد مع ذاته نطاق جزء slot scope incarnation إعادة وضع.

Factory scope تتبع مع occurrence الذي في React موضع scope binding.`renderFactorySlot()` لا قبول Session id أو scope target. صارم إطار `session` Factory اشتراط حالي binding وجود، و في identity تغير وقت إعادة تركيب؛`session-maybe` Factory إبقاء أول مرة من فارغ حالة قبول Session مرور مسار، و في لاحق identity تغير وقت إعادة تركيب، و عادي Slot سلوك متسق.

مشترك store handle إبقاء عادي نمط handle-by-scope سلوك، يشمل اثنان عدد غير root scope متساو اشتراط Session binding. وحيد احتلال store factory في occurrence أول مرة شيء تحويل وقت إنشاء واحد handle؛ إذا هذا handle إعلان `spec.persist`،renderer سوف رفض هو، لأن registration يجب إبقاء lazy، كما كثير عدد معا تخزين نشط مستقل occurrence لا يمكن أمان مشترك واحد persistence key. تصيير مدة سجل في قوة انتظار effect setup إبقاء قد commit occurrence قبل فقط يحتفظ ضعيف مرجع؛effect cleanup سوف إزالة mounted قوي مرجع، بينما occurrence-keyed WeakMap في React effect replay خلال إبقاء identity، و سماح نسخة في إزالة بعد يتم عودة استلام.

### نطاق جزء slots و عادي children

استدعاء جهة يمكن لـ Factory `slots` إعلان في كل اسم اختيار واحد Component.Factory استدعاء `useFactorySlot(name, fallback)`، أخذ نيل identity مستقر ربط Component؛ هذا Component فقط قبول مقابل نطاق جزء slot occurrence props. ربط Component تصيير وقت،renderer توفير Factory store،injection،locale،child renderers و هذا نطاق جزء slot ذاته معيار scope props.

نطاق جزء slots لا يوجد list،keyed أو chain routing، أيضا لا يوجد مستقل registration دورة الحياة. كثير مساهمة جهة نقطة توسيع ما زال استخدام Factory إعلان عادي child Slots. هذه child إعلان في definition نطاق داخل عام مشترك، بينما كل occurrence كل في وراثة scope تحت تصيير ذلك registered entries.

فوري فحص سوف كل definition يمثل لـ `type: 'factory'` عقدة، و يأخذ ذلك عادي child Slots تضمين طقم في هذا عقدة تحت. عادي عقدة إبقاء `type: 'slot'` و قائم `kind`؛ استدعاء جهة عبر `factory:<name>` اختيار Factory أصل عقدة.

كل من renderer إنشاء Component كل سوف استلام إلى `renderFactorySlot`، لذلك Factory occurrence لا حاجة parent-side use declaration. نطاق جزء اختيار ما زال يخص مفرد عدد occurrence، و كما لن جذب دخول مقابل تعريف حزمة وقت التشغيل value import.

### أول عدد تسليم استخدام طريق

`ui-conversation` في مشترك متن و Composer خارج تسجيل optional-Session `conversation.content` Factory. ذلك strict-Session `views` نطاق جزء موضع افتراضي استخدام واحد تصيير قائم `conversation.session` Slot adapter؛ أخرى occurrence يمكن اختيار مختلف View Component، كما لن تركيب رئيسي Conversation Header.

Factory لا يملك Conversation store. عادي `conversation.session` body و `conversation.session.header` إبقاء نفس عدد strict-Session handle، في إبقاء مسودة مسودة و View اختيار identity معا، تجنب تجنب سوف هذا handle معا تعليق إلى `session` و `session-maybe` scope.

### نوع و وقت التشغيل قوي صنع قاعدة

نوع سلسلة رفض لم معرفة Factory اسم، ناقص أو كثير بقية occurrence props، و `SlotMap` لا متسق child spec، و `SlotFactoryMap` لا متسق definition حقل، تضمين طقم store factory، لم معرفة نطاق جزء اسم، لا توافق اختيار في Component، و input،registration،injection و scope props بين كل حق إعادة تراكم.

وقت التشغيل فحص تغطية حركة حالة تركيب إعداد و صاف JavaScript استدعاء جهة: تكرار definitions،child إعلان اندفاع مفاجئ، لم إعلان نطاق جزء اسم، تمرير عودة تصيير،prop اندفاع مفاجئ، قديم قديم إذن، صارم إطار scope ناقص و مكون فشل عزل. نوع و وقت التشغيل اختبار أيضا ثابت كل occurrence وحيد احتلال store، حسب scope مشترك handles، تسجيل قبل fallback سلوك،definition استبدال، نطاق جزء scope إسقاط و عادي child تصيير.

## اعتبار مرور بديل خطة

**يأخذ عادي Slot إعادة استخدام لـ يمكن نقل غرس definition.** عادي Slot يخص واحد parent إعلان و عام شجرة في واحد موضع. في أخرى موضع إعادة استخدام هو سوف استعارة استخدام خطأ كل حق و دورة الحياة.

**يأخذ رئيسي Conversation Header نقل دخول Factory.** فقط لديه رئيسي host تصيير هذا Header. سوف ذلك إبقاء في Factory خارج، جعل تضمين دخول صيغة occurrence بلا حاجة آخر عدد نطاق جزء اختيار يكفي حذف Header، و إبقاء ذلك قائم strict-Session Slot دورة الحياة.

**يأخذ مشترك Conversation store نقل إلى optional-Session Factory.** Header و Session body مشترك واحد strict-Session handle. سوف هذا handle معا تعليق إلى `session-maybe` Factory و `session` Header سوف مخالفة عكس one-handle-one-scope قاعدة.

**في كل parent تحت قسم آخر تسجيل نفس تركيب إعداد.** مستقل registrations سوف تكرار definition و ذلك child إعلان. عام مساهمة جهة حاجة استخدام مستو سطر child اسم، أو صنع صار إعلان اندفاع مفاجئ.

**صيانة مسطح مستو مشترك props نوع.** هذا سوف تكرار `children`،`store`،`inject`،`locale` و scope حقل في قد لديه واقع، جعل إعلان و Component props يمكن حدوث عائم نقل.

**يأخذ React node أو render callback بصفة عمل خدمة props نقل تمرير.** هذه قيمة التفاف مرور renderer توفير scope props،store و injection تركيب إعداد، قديم قديم إذن فحص و نطاق جزء Component نوع فحص.

**يجعل نطاق جزء slots أداة تجهيز عادي Slot routing.** عادي Slots قد مسؤول كثير مساهمة جهة routing. نطاق جزء slot يمثل مرة occurrence واحد استدعاء جهة اختيار.

**نحو `renderFactorySlot()` نقل تمرير Session identity.** occurrence مثل عادي Slot واحد مثال وراثة تصيير موضع scope. ثاني عدد identity معامل سوف إنتاج اثنان عدد ممكن لا متسق مرجعي؛ مستقل تحديد عنوان Session provider يخص آخر بند قدرة.

## أثر

وظيفة حزمة يمكن إصدار واحد نسخة يمكن إعادة استخدام UI تركيب إعداد، بينما مستهلك بلا حاجة وقت التشغيل استيراد ذلك Component. كل occurrence يمكن نيل نيل مستقل اختيار نطاق جزء Components و وحيد احتلال حالة، معا إبقاء عام عادي child مساهمة و قائم scope،locale،injection و store قاعدة.

إضافة جديدة registry ledger و occurrence سجل زيادة renderer تكرار مختلط درجة.Factory definitions يجب عام وحيد، نطاق جزء slots متعمد فقط دعم حمل واحد اختيار في Component، و كما هذا API ذاته لن إنشاء يمكن مستقل تحديد عنوان Session scope.

Factory نوع و وقت التشغيل اختبار هو يمكن تنفيذ توافق صفة سجل.Slots فرعي نظام مشاركة اعتبار و `ui-slots` و `ui-renderer` حزمة مشاركة اعتبار سجل مستهلك API.

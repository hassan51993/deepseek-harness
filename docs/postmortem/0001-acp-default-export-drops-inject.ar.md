# أمر لذا تكرار قرص (postmortem)0001:ACP(Agent Client Protocol) خادم في اتصال وقت انهيار انهيار——`export default` إسقاط إضافة `inject`

[English](0001-acp-default-export-drops-inject.md) | العربية

حالة: قد حل قرار؛ إصلاح رؤية PR(Pull Request)#41 `feat/acp-2-bridge`

## ملخص

اثنان عدد تجميع صار خطأ في اختبار وحدة كل تغطية حال حال تحت ما زال توجيه يؤدي ACP انهيار انهيار: واحد افتراضي تصدير جعل Loader إسقاط `inject`، واحد مرور يمكن تتبع أثر بديل إدارة اختياري خدمة فحص بحث في shadow حد فوق فشل. يد حركة تركيب اختبار التفاف مرور هذا اثنان بند مسار. إصلاح خطة زيادة بلا حاجة API key حقيقي Loader اختبار تغطية، و لـ إضافة تصدير و اختياري خدمة وصول صنع تحديد حزمة درجة قاعدة.

## عام وصف

ACP خادم (`dsh --profile acp`،`@deepseek-ai/dsh-acp`) في حقيقي تحرير جهاز (Zed) اتصال لحظة بين انهيار انهيار: رقم واحد `session/new` طلب إرجاع `Internal error: cannot get property "agents" without inject`،`session/load` مقابل `sessionPersistence` إرجاع نفس مثال خطأ. كل إدارة لديه 178 عدد أخضر لون اختبار وحدة و 100% سطر نسبة التغطية،bridge في إنتاج بيئة في تماما لا يمكن عمل. اثنان عدد مستقل bug إخفاء في نفس عدد خطأ نص خلف بعد، اختبار طقم عنصر لـ الذي بـ اثنان عدد كل لا التقاط، سبب أيضا نفسه: كل اختبار كل عبر واحد بند لن لمس و إضافة حقيقي تحميل طريقة و خدمة حقيقي تحليل طريقة مسار قدوم تركيب إضافة.

## أثر

ACP خادم لا يمكن إنشاء أو تحميل أي واحد جلسة——بينما هذا صحيح هو تحرير جهاز الأكثر أولا استدعاء اثنان عدد RPC. أي سوف agent(ذكي جسم) وصل دخول Zed شخص كل سوف قيام أي تعرض لقاء صلب صفة فشل. بلا بيانات فقد فقد (انهيار انهيار قبل لا يوجد أي محتوى يتم حفظ دائم) ؛ بديل قيمة تماما هو «وظيفة غير ممكن استخدام» إضافة فوق اثنان مرة تحديد موضع سبب ضبط تجربة وقت.

## وقت خط

- bridge(RFC 010) سقوط أرض وقت لديه واحد طقم كامل اختبار وحدة، تغطية codec، داخل تخزين نقل، توليد بروتوكول رسالة، فشل مسار و HMR(حار وحدة استبدال) ؛ آخر لديه واحد حاجة key حقيقي API e2e اختبار و واحد بلا حاجة key stdout صاف صاف صفة e2e اختبار. الكل أخضر لون،100% نسبة التغطية.
- حقيقي Zed جلسة في `session/new` فوق قيام أي فشل، تقرير خطأ `cannot get property "agents" without inject`.
- ضبط فحص الأكثر أول امتداد حال واحد Cordis«traceable/shadow» إدارة نقاش توسيع (نظر يشبه دمج إدارة، كما هذا آلية تأكيد فعلي وجود——رؤية Bug #2) ، مع بعد في vendor دليل في `reflect.ts` داخل مقابل فعلي fiber مرة تاريخ فعل إدراج وتد، و تشغيل حقيقي عملية فرعية. تتبع أثر نتيجة عرض، استثناء في `apply()` رقم 179 سطر،*إضافة تحميل وقت*رمي خروج، يقع في ROOT fiber كما لا يوجد shadow——دفع قلب shadow إدارة نقاش مقابل `session/new` حل تفسير.
- بحث إلى أصل بسبب #1: واحد سطر كثير بقية `export default apply`. حذف بعد `session/new` إصلاح.
- حذف بعد كشف Bug #2:`session/load` ما زال في `sessionPersistence` فوق رمي خطأ——هذا هو واحد حق صحيح مختلف آلية (shadow مرة تاريخ) ، عبر عزل إصلاح و إعادة تشغيل حقيقي عملية فرعية نيل إلى تأكيد.

## أصل بسبب #1——`export default apply` إسقاط إضافة `inject`(توجيه يؤدي `session/new` انهيار انهيار)

`packages/acp/acp/src/index.ts` هو واحد*نطاق الأسماء إضافة*: هو سوف `name`،`inject`،`Config` و `apply` بصفة مستقل تسمية تصدير، مستودع في أخرى كل إضافة (`invariants`،`llm-deepseek`،`tool-bash`،`tui` انتظار) أيضا هو مثل هذا. لكن هو*أيضا*كثير واحد سطر أخرى إضافة كل لا يوجد شفرة:

```ts ignore-check
export const name = 'acp'
export const inject = ['agents', 'sessions', 'sessionPersistence']
export function apply(ctx: Context, config: AcpConfig): void { /* … */ }
// …
export default apply   // ← the bug
```

عند إضافة من `cordis.yml` تحميل وقت،Cordis Loader عبر `Loader.unwrapExports`(`vendor/loader/src/index.ts`) مقابل استيراد وحدة إجراء مواصفة تحويل:

```ts ignore-check
unwrapExports(exports: any) {
  if (isNullable(exports)) return exports
  exports = exports.default ?? exports        // ← prefers `.default`
  if (!exports.__esModule) return exports
  return exports.default ?? exports
}
```

وجود افتراضي تصدير وقت،`exports.default ?? exports` تحليل لـ**عار `apply` دالة**. عار دالة لا يوجد `inject`، لا يوجد `name`، لا يوجد `Config` خاصية——هذه بصفة*نفس درجة*تسمية تصدير وجود في وحدة نطاق الأسماء فوق، بينما unwrap إلى `.default` يأخذ كامل نطاق الأسماء إسقاط.Loader مع بعد أساس في فارغ `inject` بناء إضافة fiber.

لذلك `apply` في واحد**لا يوجد حقن أي خدمة** fiber في تشغيل. رقم واحد سطر `const agents = ctx.agents` مرة تاريخ fiber شجرة (ROOT → Include → Loader → ROOT) ، في كل fiber store في كل بحث لا إلى `agents`، وصول أصل fiber(`runtime === null`) بعد رمي خروج `cannot get property "agents" without inject`. انهيار انهيار حدوث في*تحميل وقت*، بينما غير لاحق طلب معالج في——طلب فقط هو تماما جيد إطلاق تحميل.

**إصلاح:**حذف `export default apply`.Loader مع بعد استخدام وحدة نطاق الأسماء، صحيح تأكيد تعرف آخر `inject`/`name`/`Config`،`apply` في واحد تأكيد فعلي حقن الذي إعلان خدمة fiber في تشغيل.

## أصل بسبب #2——اختياري خدمة قراءة عبر يمكن تتبع أثر shadow إطلاق inject حراسة حماية (توجيه يؤدي `session/load` انهيار انهيار)

إصلاح #1 بعد،`session/new` صحيح معتاد عمل، لكن `session/load` ما زال رمي خروج `cannot get property "sessionPersistence" without inject`. هذا عدد مشكلة*تأكيد فعلي*مصدر في Cordis يمكن تتبع أثر بديل إدارة/shadow آلية، قيمة نيل دقيق إدارة حل.

`session/load` استدعاء `agents.resume(...)`، بعد من تفويض حمل إعطاء `AgentLoop.resume()`، منها قراءة `this.ctx.sessionPersistence`.`AgentLoop` `static inject` لذا معنى لا يتضمن `sessionPersistence`——حقن هو سوف توجيه يؤدي غير حفظ دائم عرض عرض دائم بعيد تعليق بدء، انتظار واحد دائم بعيد لن تحميل خلفية. هذا خدمة من واحد مستقل أخ أخ إضافة/fiber توفير، بـ آلة سوف صفة طريقة قراءة.

Cordis في خدمة وصول عبر سياق بديل إدارة (`vendor/cordis/src/reflect.ts`) إجراء. عند عبر من آخر بند fiber نيل أخذ*يمكن تتبع أثر بديل إدارة*استدعاء خدمة طريقة وقت (هذا موضع:bridge fiber استدعاء `ctx.agents.resume`، سجل التسجيل إرجاع `this.factory`——أي `AgentLoop`——إعادة حزمة تركيب لـ ربط إلى استدعاء جهة جديد traceable بديل إدارة) ،`createShadowMethod`(`vendor/cordis/src/utils.ts`) سوف `this` إعادة ربط إلى واحد *shadow* كائن، ذلك `ctx` يحمل `[symbols.shadow]` إشارة نحو `AgentLoop` ذاته بنية صنع سياق. في `resume` داخلي،`this.ctx.sessionPersistence` تحليل من shadow fiber بدء مرة تاريخ:

```ts ignore-check
// reflect.ts get handler
let fiber = (ctx[symbols.shadow] as Context ?? ctx).fiber   // ← starts at AgentLoop's fiber
while (true) {
  const impl = fiber.store?.[prop]
  if (impl) return getTraceable(ctx, impl.value)
  if (prop in fiber.inject) { /* inactive-context error */ }
  if (!fiber.runtime) throw error                            // ← reached root, throw
  if (fiber.parent[symbols.isolate][prop] !== key) throw error
  fiber = fiber.parent.fiber                                 // ← ancestor-only
}
```

مرة تاريخ**فقط نحو أصل أولا جهة نحو**إجراء.`sessionPersistence` حيث لا في `AgentLoop` fiber store في (لا في ذلك `static inject` في) ، أيضا لا في عبر نحو root أي أصل أولا فوق (هو يقع في واحد*أخ أخ*فرع) ، لذلك مرة تاريخ وصول أصل fiber بعد رمي خطأ.

لـ ماذا داخل تخزين في `AgentLoop` استعادة اختبار لا يوجد التقاط هذا عدد مشكلة؟ لأن هو جمع من اختبار شفرة مباشر استدعاء `ctx.agents.resume(...)`——*في أي إضافة fiber خارج*. هذا وقت `ctx.fiber.runtime` لـ `null`، بديل إدارة معالج مشي واحد بند رفع قبل التفاف مرور مسار:

```ts ignore-check
if (!ctx.fiber.runtime) return ctx.reflect.get(prop, false)   // ← direct global-store lookup, no fiber walk
```

`ctx.reflect.get(name, false)` هو أساس في isolate symbol عام خدمة store مباشر فحص بحث——تماما تجاهل اختصار fiber توسيع اندفاع، قدرة بحث إلى خدمة. لذلك من قمة طبقة اختبار قراءة يمكن نجاح؛ بينما من حقيقي إضافة fiber داخلي، مرور من shadow وصول وقت فإن رمي خطأ.bridge تماما جيد هو بعد من.

**إصلاح:**استخدام `ctx.get('sessionPersistence')` قراءة اختياري خدمة، هذا طريقة استخدام عام isolate-keyed store معا إبقاء نشط وثب حالة فحص. مقابل في إضافة إعلان حقن تجميع في خدمة، مباشر خاصية قراءة ما زال ملائم استخدام.

## لـ ماذا كل اختبار كل لا يوجد التقاط (حق صحيح فشل)

اثنان عدد bug كل مصدر في نفس عدد أصل هذا مسار نقص فتحة:**لا يوجد أي اختبار عبر إضافة حقيقي تحميل مسار أو حقيقي استدعاء توسيع اندفاع قدوم قيادة هو.**

- داخل تخزين harness عبر يد حركة بناء إضافة كائن قدوم تركيب bridge:`ctx.plugin({ name, inject, apply })`. هذا يد حركة توفير `inject`، لذلك دائم بعيد لا يمكن تكرار الآن Bug #1——`unwrapExports` فقط يتم *Loader* استدعاء،`ctx.plugin` من لا استدعاء هو. أي جعل `ctx.plugin(NamespaceImport)` أيضا لا يمكن التقاط.
- نفس عدد harness سوف كل محتوى مستو فرش تركيب في واحد أصل سياق فوق، لذلك من في لمس بلوغ `AgentLoop` استعادة يلزم ما تشغيل في قمة طبقة (`!runtime` التفاف مرور) ، يلزم ما مرور من shadow تشغيل، بينما هذا shadow origin ما زال تحليل إلى root——إخفاء غطاء Bug #2 أصل أولا مرة تاريخ فشل.
- وحيد بلا key e2e إرسال `initialize` و فحص stdout صاف صاف صفة.`initialize` من لا لمس بلوغ factory، لذلك اثنان عدد bug كل أمان لكن عبر.
- وحيد قيادة `session/new`/`session/load` اختبار حاجة key عندئذ قدرة تشغيل، لذلك CI(بلا key) قفز مرور هو——بينما محلي هو لـ الذي بـ «عبر» ، فقط هو لأن واحد قديم قديم قد بناء `lib/`(يتضمن قديم شفرة) تماما جيد ممتلئ كاف وحدة تحليل.

100% سطر نسبة التغطية بداية نهاية ممتلئ كاف. نسبة التغطية إثبات شفرة سطر*يتم تنفيذ مرور*؛ هو لا يستطيع شرح وظيفة هل*حسب تسليم طريقة صحيح معتاد عمل*.

## إضافة جديدة منع حماية إجراء تطبيق

- **حذف `export default apply`**(`packages/acp/acp/src/index.ts`)——Bug #1 إصلاح.
- **`AgentLoop.resume` استخدام `this.ctx.get('sessionPersistence')`**(`packages/core/agent-loop/src/index.ts`)——Bug #2 إصلاح، مرفق ملاحظة تفسير شرح shadow مرة تاريخ وقوع فخ.
- **بلا حاجة key `session/new` e2e، عبر حقيقي stdio تشغيل**(`apps/cli/tests/profiles/acp/tests/acp.e2e.ts`): بـ عملية فرعية طريقة عبر حقيقي Loader بدء profile، و تأكيد `session/new` صحيح معتاد إرجاع. بلا حاجة API key يكفي واضح كشف Bug #1. قد تحقق استعادة `export default apply` وقت اختبار فشل.
- **e2e spawn في ضبط `TSX_TSCONFIG_PATH`**: عملية فرعية من مؤقت cwd تشغيل،tsx لا يمكن عبر نحو فوق بحث بحث إلى مستودع أصل tsconfig `paths` خريطة——لذلك dsh-* import ساكن صامت رجوع إلى قد بناء `lib/`. سوف tsx إشارة نحو مستودع tsconfig جعل تحليل لا اعتماد cwd، تأكيد حفظ اختبار تشغيل هو*شفرة المصدر*بينما غير ممكن قديم قديم بناء ناتج.
- **[docs/testing.md](../testing.ar.md) قاعدة**:«اختبار حقيقي مدخل مسار» ، سطر نسبة التغطية لا انتظار في سلوك نسبة التغطية——سوف هذا واحد تعليم تدريب تحرير تأليف لـ كل لم قدوم إضافة قاعدة.

## مرور تحقق تعليم تدريب

- نطاق الأسماء إضافة و default export في Cordis Loader تحت متبادل رفض. اختيار نطاق الأسماء شكل صيغة (`name`/`inject`/`Config`/`apply`) ، لا يلزم إضافة `export default`——`unwrapExports` سوف إسقاط نطاق الأسماء.
- مقابل في إضافة آلة سوف صفة قراءة لكن لم في `static inject` في إعلان خدمة، استخدام `ctx.get(name)`، أبدا استخدام `ctx.<name>`. خاصية بديل إدارة عبر فقط نحو أصل أولا جهة نحو fiber مرة تاريخ تحليل، مرور من خارجي shadow وقت سوف فشل؛`ctx.get(name)` هو توسيع اندفاع غير متصل فحص بحث (كما افتراضي اعتماد صارم إطار نمط——غير نشط وثب خلفية قراءة لـ `undefined`، لن في teardown خلال ما زال سوف هذا خلفية إرجاع إعطاء استدعاء جهة).
- يد حركة بناء إضافة اختبار لا يمكن تحقق إضافة تحميل طريقة. حتى قليل واحد اختبار يجب طرف إلى طرف أرض قيادة حقيقي Loader/export مسار. عند نواة قلب عملية لا استدعاء نموذج وقت، هذا اختبار بلا حاجة API key——لذلك هو يخص CI، بينما غير key باب تحكم بعد.
- متبادل معلومة تتبع أثر نتيجة، لا يلزم حيرة معلومة إدارة نقاش. أفضل أنيق shadow حل تفسير هو حقيقي، لكن هو هو*ثاني عدد* bug؛*رقم واحد*هو واحد سطر تصدير خطأ، في عدد ساعة نظر يشبه دمج إدارة لكن فعلي خطأ دفع إدارة بعد، واحد fiber مرة تاريخ `console.error` في بضعة دقيقة داخل حينئذ بحث إلى هو.

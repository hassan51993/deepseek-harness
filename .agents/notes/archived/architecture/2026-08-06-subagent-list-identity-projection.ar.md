# Agent Note: subagent قائمة مرور إسقاط وحدة قراءة هوية

Status: implemented
Archived: 2026-09-04

[English](2026-08-06-subagent-list-identity-projection.md) | العربية

## مشكلة

إعادة كتابة قبل `SubagentRuntime.listChildren` مقابل كل `header.origin === 'subagent'` مباشر child، كل مرة قائمة كل تنفيذ `listEvents` إضافة `readEvent` اثنان مرة كامل سجل شيء تحويل، كما كل مرة شيء تحويل كل مرافق مع كامل سجل structuredClone، فقط لـ من وصف رمز حدث داخل طي خروج mode و label اثنان عدد حقل. وصف رمز في سجل في موضع لا ثابت——fork بادئة مهمة معنى طويل،zstd ضغط لقطة لا يوجد seq بحث جذب——لذلك تحديد موضع لا يوجد سريع مسار؛ هذا بند مسار لا يوجد أي ذاكرة مؤقتة، بديل قيمة مع transcript(نص سجل) طويل درجة × child عدد كمية × قائمة تردد معدل وضع كبير. هو أيضا يأخذ session-query سحب صار قائمة صلب اعتماد: لا يوجد query backend نشر،`list_agents` بـ `SUBAGENT_CONTROL_SESSION_QUERY_UNAVAILABLE` كامل جسم رفض، كل إدارة قطعة رفع الذي يحتاج فقط هو header واقع.

نفس أصل بسبب أيضا لديه ثاني عدد عرض حالة:host جانب `hasSubagentDescriptor()` في كل مرة Agent(ذكي جسم) ربط RPC تابع رئيسي حكم تحديد فوق مسح هدف جلسة own suffix، أي سهل `SessionHeader.origin` قد عودة جواب نفس عدد مشكلة قطعا كبير جزء.

أصل بسبب في في [durable-subagent-catalog قرار](../feature/2026-07-22-durable-subagent-catalog-and-list-agents.ar.md) يأخذ وصف رمز حدث (`subagent/descriptor`) تحديد لـ دليل وحيد حمل دائم مرجعي، لكن لا يوجد لـ وصف رمز قراءة إعداد أي ذاكرة مؤقتة طبقة، و يأخذ تدريجي child مزدوج قراءة واضح قبول لـ «بلا بحث جذب صحيح تأكيد صفة أساس خط».[web subagent conversations](../feature/2026-07-27-web-subagent-conversations.ar.md)(#1569) قد يأخذ «هو لا هو subagent» وضع دخول header(`SessionHeader.origin`) ، هوية حكم تحديد لم يعد قراءة سجل؛mode و label ما زال يلزم مسح.

## قرار

mode و label من `subagent` projection unit(صاف هوية اثنان ذراع) طي،unit هو طي قاعدة وحيد مرجعي. قطعة رفع استخدام مشترك Session query corpus، أخذ قيمة فإن مشي ثلاثة درجة «حساب تمام أي توقف» مرحلة سلم:live child تزامن قراءة سجل التسجيل قائم ماء موضع ذاكرة مؤقتة (صفر سجل قراءة) ؛unseeded cold child يمكن استخدام اختياري `sessionProjectionCache` checkpoint، لأن ذلك دقيق inherited cut معروف لـ صفر؛ كل seeded child و كل مرة cache miss كل تنفيذ مرة يحتوي متن Session observation، مجددا مرور تسجيل `subagent` unit طي. بلا بحث جذب، لا ذاتي بناء ذاكرة مؤقتة، قائمة جانب بلا عودة كتابة.

إزالة حذف تدريجي child مسح خروج مسار لديه ثلاثة صنف: يأخذ mode/label رفع رفع دخول header(كتابة مسار تحمل تحمل) ؛ لـ إسقاط بناء حمل دائم إرسال توليد (checkpoint مرحلة سلم، أو مع استعلام بحث جذب إعادة بناء سقوط قيمة، قراءة طرف مقابل حساب) ؛ قراءة وقت الآن حساب (live مشي ماء موضع ذاكرة مؤقتة،cold مرة كامل قراءة). هذا سجل أخذ رقم ثلاثة بند.«قيمة مع استعلام بحث جذب سقوط مكتبة» قد كامل جسم تراجع دور: استعلام أساس أساس ضبط تطبيق يتم إجبار إقرار تعرف مجال مفردات، بينما وحيد مستهلك قراءة وقت الآن حساب يكفي ممتلئ كاف——live child صفر قراءة من session-projection قائم ماء موضع ذاكرة مؤقتة أبيض أخذ،cold child مرة كامل قراءة يتم «حساب تمام أي توقف» صريح قبول. قبل اثنان بند و تراجع دور إدارة من تفصيل رؤية اعتبار مرور بديل خطة واحد عقدة.

يلزم نقطة:

- **subagent قائمة استخدام Session query corpus إتمام قطعة رفع و يحتوي متن observation**:mode/label ما زال مرور `ctx.sessionProjections` نيل أخذ، قائمة لا يملك descriptor parser أو مجال بحث جذب.
- **أخذ قيمة ثلاثة درجة «حساب تمام أي توقف» مرحلة سلم**:live child قراءة `sessionProjections.snapshot(session, ['subagent'])`(سجل التسجيل قائم ماء موضع ذاكرة مؤقتة، صفر سجل قراءة) ؛unseeded cold child يمكن قراءة `sessionProjectionCache.cachedSnapshot(header, SessionLogOffset(0), ['subagent'])`؛seeded child أو cache miss تنفيذ مرة يحمل `inheritedEventCount` Session observation، مجددا مرور تسجيل `subagent` unit طي. مجددا لا يوجد حينئذ لا يوجد——لا ذاتي بناء ذاكرة مؤقتة، قائمة جانب بلا عودة كتابة، بلا بحث جذب.
- **`subagent` projection unit هو طي قاعدة وحيد مرجعي**:live و cold لقطة كل تشغيل نفس نسخة قد تسجيل unit، لا وجود ثاني نسخة وصف رمز حل تفسير منطق.
- **وصف رمز (v2) إبقاء ثابت**.Session،persistence،projection cache و query في logical header خارج مفرد وحيد يحمل دقيق inherited cut؛listing لا يمكن إثبات cut لـ صفر وقت، تخزين كمية بيانات مرور مرة يحتوي متن observation نيل نيل دقيق قيمة——بلا unknown تخفيض حالة، أيضا بلا حمل دائم صيغة ترحيل.

و قائم سجل علاقة:

- هذا سجل يحل محل [durable-subagent-catalog](../feature/2026-07-22-durable-subagent-catalog-and-list-agents.ar.md) في قائمة قراءة مسار اثنان بند تصميم: مرور `sessionQuery.traceSession` قطعة رفع، و تدريجي child قراءة وصف رمز حدث (`listEvents` إضافة دقيق `readEvent` مزدوج قراءة، حينئذ أرض تشخيص تصنيف).diagnostic سطر دلالة إبقاء، تصنيف تعديل من قائمة حسب إسقاط قيمة نقص مقعد و activity إرسال توليد؛ وصف رمز حدث ما زال هو mode/label وحيد حمل دائم مرجعي و طي إدخال، استعادة تمييز حق و تنشيط اتفاق لا حركة. تابع جزء يحل محل، اثنان سجل إبقاء تسليم تقاطع رابط.
- [session-projection RFC](../../proposed/architecture/2026-07-27-session-projection-and-command-log.ar.md) هو registry اتفاق مرجعي، ذلك بعد من [state-and-client-views سجل](2026-08-19-session-projection-state-and-client-views.ar.md) تفكيك قسم لـ host حالة و عميل عرض؛ هذا سجل إضافة جديدة عميل مرئي `subagent` هوية unit، و مرور live و cold لقطة إزالة استهلاك هو. طي قاعدة فقط في registry تسجيل واحد نسخة؛ أي إزالة استهلاك وجه كل مرور هذا واحد نسخة قد تسجيل unit حساب حساب، لا وجود ثاني نسخة طي منطق.

### `subagent` projection unit

تعليق في قائم `subagentTiming` جانب ([projection.ts](../../../../packages/subagent/subagent/src/projection.ts) ،[projection-types.ts](../../../../packages/subagent/subagent/src/projection-types.ts)) ،key لـ `subagent`. اثنان عدد unit كل توفير عميل wire view؛ هوية unit في host حالة في إبقاء اختياري حزمة تركيب قيمة، و يأخذ نقص مقعد خريطة لـ عميل مراقبة جندي:

```ts ignore-check
export type SubagentIdentityProjection =
  | { mode: 'one-shot'; label?: string; seq: SessionSeq }
  | { mode: 'continuable'; label: string; seq: SessionSeq }

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap {
    subagent: { identity?: SubagentIdentityProjection }
  }
  interface SessionProjectionMap {
    subagentTiming: SubagentTimingProjection
    subagent: SubagentIdentityProjection | null
  }
}
```

- إسقاط هو صاف هوية،**projection جسم نظام لا فعل فشل عبر طريق**:unit دائم لا رمي خطأ؛ تحميل حمل ضرر تالف، إصدار لا إقرار تعرف و كامل سجل لا يوجد وصف رمز واحد مثال.host checkpoint حالة استخدام يمكن تسلسل تحويل حزمة تركيب `{ identity?: SubagentIdentityProjection }`، نقص مقعد لـ `{}`؛ عميل view فإن هو غير اختياري `SubagentIdentityProjection | null` بند.`null` تمام جيد عبر JSON، لذلك دفع إرسال reset سوف استبدال قديم هوية، بينما لن يتم stringify فقد إسقاط. حكم تحديد سجل قاعدة: إزالة استهلاك وجه يأخذ null و عميل key نقص مقعد واحد قاعدة نظر لـ بلا قيمة.«حساب خروج قدوم لا يوجد» مثل أي عرض هو مستهلك ذاتي ذات أمر (رؤية تحت نص `listChildren` أربعة حالة خريطة).
- label قوي درجة من وصف رمز schema قرار:continuable label تحليل قوي صنع لا بد لديه،one-shot هذا حينئذ اختياري؛mode/label حكم آخر و تحت نص child سطر قوي اتفاق تماما متسق (سطر لا يحمل `seq`——هو هو إسقاط داخلي own-suffix إثبات).
- هوية يحمل صنف لوحة تحويل `seq`: طي خروج هذا هوية `subagent/descriptor` حدث seq، اثنان ذراع لا بد لديه،null مراقبة جندي بلا.live Session عبر `isOwnSeq()` فحص هو؛cold يحتوي متن observation فإن و `inheritedEventCount` مقارنة مقارنة. فقط header seeded candidate سوف قفز مرور cache، لأن header متعمد لا كشف كامل عدد cut؛unseeded candidate معرفة طريق cut لـ صفر.unit يأخذ حزمة تركيب حالة في تحقق بعد هوية خريطة لـ عميل wire view، و و أخرى unit واحد قاعدة فحص نقطة تحويل (`persist` خيار قد حذف) ؛`stateVersion` لـ 2، في زيادة `seq` وقت رفع إصدار. أكثر مبكر checkpoint سطر حسب registry اتفاق إصدار فقد إعداد بطلان، سقوط مرجعي إعادة طي.
- طي قاعدة:`subagent/descriptor` last-wins، و `subagentTiming` نفس بند descriptor-reset سجل قاعدة——fork بادئة داخل أصل أولا وصف رمز يتم ذاته وصف رمز تغطية. ضرر تالف أو إصدار لا إقرار تعرف تحميل حمل نفس مثال last-wins: إعادة وضع لـ null مراقبة جندي بينما غير إبقاء أولا قبل هوية، سليم سليم أصل أولا fork لن وراثة ذاته وصف رمز قيام لا إقامة هوية.

### قطعة رفع:query corpus و live preference

`listChildren`([list-children.ts](../../../../packages/subagent/subagent/src/list-children.ts)) عبر `sessionQuery.listSessions()` أخذ نيل canonical live-preferred corpus، مجددا يأخذ كل listed id و ممكن وجود `ctx.sessions.get(id)` إعداد مقابل؛ نفس id وجود live Session وقت استخدام live header. قطعة رفع الذي يحتاج الكل هو header واقع:

- مرور ترشيح:`header.origin === 'subagent' && header.parentSession === parentSessionId`.
- `hasChildren`: نفس نسخة دمج مادة مادة نحو تحت نظر واحد طبقة——وجود `origin === 'subagent'` كما `parentSession` لـ هذا child مباشر بعد بديل.
- `activity`:live سجل لـ `running`، فقط وجود في حفظ دائم لـ `inactive`.
- ترتيب ترتيب:`createdAt` رفع ترتيب، مجددا حسب child id رفع ترتيب (و قديم اتفاق متسق).
- `sessionQuery` خدمة نقص مقعد وقت بـ `SUBAGENT_CONTROL_QUERY_UNAVAILABLE` فشل؛ مشترك query corpus مسؤول قرار نشر قدرة قطعة رفع live-only أيضا هو حفظ دائم Session.
- query corpus فشل جعل كامل مرة قطعة رفع فشل؛per-child عزل فقط ملائم لأجل تدريجي child cold observation.

### أخذ قيمة: ثلاثة درجة «حساب تمام أي توقف» مرحلة سلم

مقابل كل قطعة رفع خروج child،mode/label أخذ قيمة مشي ثلاثة درجة مرحلة سلم——حساب تمام أي توقف، لا ذاتي بناء ذاكرة مؤقتة، بلا عودة كتابة (رقم ثلاثة درجة و apiproxy `session.history` بارد قراءة نفس بند):

| درجة | قراءة قاعدة | صار هذا |
| --- | --- | --- |
| 1:live child | `ctx.sessionProjections.snapshot(session, ['subagent'])` | صفر سجل قراءة——سجل التسجيل قائم ماء موضع ذاكرة مؤقتة، تزامن أخذ قيمة |
| 2:unseeded cold child،cache أمر في | اختياري `sessionProjectionCache.cachedSnapshot(header, SessionLogOffset(0), ['subagent'])`؛ دقيق cut لـ صفر وقت، كل دمج قاعدة seq كل عودة child ذاتي لديه | صفر سجل قراءة |
| 3:seeded child أو cold التقاط قاع | مرة يحتوي متن `sessionQuery.observeSession(id)` إضافة قد تسجيل `subagent` projection، استخدام `inheritedEventCount` فعل own-suffix فحص | كل مرة قائمة مرة كامل قراءة الآن حساب |

- خطأ اتفاق:`sessionProjections`،Session store و `sessionQuery` كل هو listing الذي يحتاج runtime service. ثلاثة من قسم آخر بـ `SUBAGENT_CONTROL_PROJECTIONS_UNAVAILABLE`،`SUBAGENT_CONTROL_SESSION_STORE_UNAVAILABLE` و `SUBAGENT_CONTROL_QUERY_UNAVAILABLE` صريح فشل؛ ناقص تصنيف أو corpus قدرة لن زائف تركيب صار فارغ نتيجة.
- cache هو صاف اختياري إضافة سرعة طبقة: خدمة نقص مقعد حكم فارغ قفز مرور——بلا رمز خطأ، لا دخول إعداد تحقق (و `sessionProjections` مطلوب حقن متبادل مقابل).seeded header سوف قفز مرور هذا درجة، لأن لا قراءة متن حينئذ لا يمكن توفير cache identity الذي يحتاج دقيق cut. مقابل unseeded child، ثاني درجة أي رمي خطأ (يشمل في سم unit سطر جذب انفجار `viewCheckpoint`) كل سوف ساكن صامت سقوط رقم ثلاثة درجة——ذاكرة مؤقتة هو إرسال توليد بيانات، ذلك لذا عائق لا إنتاج `corrupt` حكم قرار، نهاية مراجعة عودة مرجعي إعادة طي؛checkpoint مبكر في descriptor،key نقص مقعد أو null مراقبة جندي أيضا كل سوف سقوط قاع.
- per-child عزل: مفرد child cold كامل قراءة فشل فقط جعل هذا سطر يصبح `unavailable` diagnostic، تحت مرة قائمة ذاتي لكن إعادة محاولة، لا أثر sibling(رؤية أربعة حالة خريطة).
- بارد مسار دورة الحياة رؤية إثبات:observation يجب ما زال إشارة نحو قطعة رفع وقت ذلك عدد دورة الحياة. رؤية إثبات حقل لـ version،id،createdAt،cwd،parentSession،isSeeded،delegationDepth،origin و agentPreset؛ نفس id حذف بعد إعادة إصدار Session مقابل قديم parent دليل تخفيض لـ `corrupt` سطر، لا خارج تسرب جديد owner child.
- بارد قراءة تزامن بـ معتاد عدد 4 محدود——هو قيد هو محلي وسيط جودة مرة فقط قراءة مسح بينما غير نشر سلوك؛ ظهور ربط شبكة persistence backend وقت رفع رفع لـ تحقق مرور `Config` حقل.
- بارد قراءة صار هذا مثل فعلي سجل: كل seeded child و كل مرة unseeded cache miss كل سوف في كل مرة قائمة وقت دعم دفع مرة كامل query observation، صار هذا و ذلك transcript كبير صغير صار صحيح مقارنة؛ تحديد سجل «حساب تمام أي توقف» ، لا ذاتي بناء ذاكرة مؤقتة.observation يمكن إعادة استخدام query/persistence preparation طبقة، لكن قائمة لا اعتماد هذا أفضل تحويل.live child كل مسار صفر سجل قراءة.
- إلغاء: كل مرة persistence قراءة قبل بعد فحص استدعاء جهة signal،abort بعد عندئذ تسوية قراءة رفض عودة واحد تحويل لـ مستقر رمز خطأ `CANCELLED`.

### مرجعي نموذج

- session log هو وحيد مرجعي؛ هذا خطة لا إضافة جديدة مجال بحث جذب، ذاتي لديه checkpoint أو عملية memo. ثاني درجة قراءة `sessionProjectionCache` checkpoint هو قائم تركيب بند إرسال توليد بيانات، قائمة فقط قراءة. أخذ قيمة الآن حساب الآن ترك؛seeded candidate استخدام يحتوي متن observation حسب دقيق cut تصنيف،unseeded cached identity بلا حاجة seq باب، لأن كل دمج قاعدة seq كل عودة ذاته كل.
- Session و persistence كتابة مسار تماما لا شعور معرفة قائمة و إسقاط إزالة استهلاك: لا يوجد حدث استماع عودة كتابة، لا يوجد كتابة وقت طي.
- قطعة رفع و أخذ قيمة لا بنية صار ثاني عدد تمييز حق مصدر، أيضا لا يجعل بعد لم إصدار child مرئي——اثنان عدد مصدر فقط رؤية قد إصدار live سجل و قد سقوط قرص حفظ دائم سجل، و durable-subagent-catalog سجل مقابل إرسال توليد قراءة وجه قيام تحت قاعدة متسق.

### `listChildren` سطر شكل حالة و إزالة استهلاك وجه

`SubagentListEntry` **بيانات بنية و إعادة كتابة قبل تماما متسق**——child و diagnostic اثنان ذراع،`kind` حكم آخر،reason ثلاثة قيمة،child ذراع mode/label قوي اتفاق الكل إبقاء؛ تغير فقط في تشخيص معلومة مصدر: إسقاط جسم نظام لا يوجد فشل عبر طريق،diagnostic من قائمة حسب إسقاط قيمة نقص مقعد و activity إرسال توليد، قائمة ذاته صفر حدث تحليل.«لا يوجد حينئذ انتظار صلب قراءة» حفظ إثبات مرحلة سلم مقابل سليم سليم بيانات لا بد لكن حساب نيل خروج mode/label.

```ts ignore-check
export type SubagentListEntry =
  | ({
    readonly kind: 'child'
    readonly id: SessionId
    readonly activity: 'running' | 'inactive'
    readonly hasChildren: boolean
  } & (
    | { readonly mode: 'one-shot'; readonly label?: string }
    | { readonly mode: 'continuable'; readonly label: string }
  ))
  | {
    readonly kind: 'diagnostic'
    readonly id: SessionId
    readonly reason: 'corrupt' | 'unsupported' | 'unavailable'
  }
```

مقابل كل قطعة رفع خروج child، مرحلة سلم أخذ قيمة نتيجة حسب أربعة حالة خريطة صار سطر:

| مرحلة سلم أخذ قيمة نتيجة | سطر |
| --- | --- |
| لقطة يحتوي غير null `subagent` هوية | child سطر |
| لقطة في،`subagent` لـ null مراقبة جندي أو key نقص مقعد، كما child **inactive** | diagnostic سطر،reason `corrupt`(تحديد نطاق ناقص هيكل: بلا، ضرر تالف أو إصدار لا إقرار تعرف وصف رمز، لم يعد دقيق قسم) |
| لقطة في،`subagent` لـ null مراقبة جندي أو key نقص مقعد، كما child **running** | سطر لا ظهور (إنشاء نافذة: وصف رمز بعد لم إلحاق، و قديم تنفيذ نفس نافذة omit) |
| cold كامل قراءة فشل | diagnostic سطر،reason `unavailable` |

- `unsupported` لم يعد يتم إنتاج خروج: نوع و wire قطعة رفع حسب «بيانات بنية إبقاء الآن حالة» إبقاء تخزين هذا عضو، هذا سجل إبقاء ملف ذلك لـ لم يعد إنتاج خروج.
- descriptor-less تحديد نطاق ناقص هيكل من قديم تنفيذ omit عودة دخول `corrupt` diagnostic——مكتبة داخل تالف، ميت فرعي جلسة مرئي، لا ساكن صامت إزالة فقد، هذا صحيح هو إبقاء diagnostic أصلي حركة آلة.
- قائمة فقط اختيار `subagent` wire unit، كما هذا طي دائم لا رمي خطأ: وصف رمز ضرر تالف أو إصدار لا إقرار تعرف طي لـ null مراقبة جندي، من أربعة حالة خريطة استلام قبول لـ هذا child `corrupt` سطر (تحديد صفة بيانات لذا عائق، مقابل متساو قديم تنفيذ `SESSION_QUERY_CORRUPT_SESSION`→`corrupt` خريطة دلالة).live و cold نفس انتظار لقاء، تدريجي child عزل،sibling و قائمة ذاته لا تلقي أثر. هو و «بلا قيمة + running → omit» صحيح تسليم: إنشاء نافذة هو «بعد بلا بيانات» ، طي لـ بلا قيمة هو «بيانات تالف»——running في سم child أيضا خروج `corrupt` سطر بينما غير omit.

معروف حد انحراف فرق (متعمد قبول، مع هذا سجل إبقاء ملف):

- own suffix ظهور كثير عدد وصف رمز، قديم تنفيذ حكم corrupt، الآن last-wins أخذ نهاية من (مزود اتفاق هذا حينئذ حفظ إثبات تماما واحد).
- live/persisted header اندفاع مفاجئ، قديم تنفيذ هو per-child corrupt؛ الآن قطعة رفع live أولوية، لا فعل متسق صفة تحقق، اندفاع مفاجئ لم يعد يتم ملاحظة شعور، بـ live سجل صار سطر.
- ضرر تالف تخزين مصدر قراءة فشل (مثل تالف surface يتم بارد قراءة كامل قراءة رفض استلام) ، قديم تنفيذ خريطة per-child `corrupt`، الآن موحد واحد صار `unavailable` سطر (قراءة جانب بلا من منطقة قسم صار بسبب).
- لم معرفة parent، قديم تنفيذ مرور session-query رمي not-found(«parent session … was not found») ؛ الآن ذاتي إدارة دمج مقابل لا وجود parent نيل إلى فارغ فرعي تجميع، قطعة رفع إرجاع فارغ قائمة،wire فوق لاحق عملية سقوط إلى child درجة subagent-not-found——دلالة و نص سجل ساكن صامت تغير، صريح قبول.
- rung 2 أكثر متأخر حدث نافذة فقط ملائم لأجل unseeded child:cache سطر تماما في أول عدد descriptor بعد سقوط قرص، سجل مع بعد إلحاق ثاني عدد descriptor(أو malformed تحميل حمل وضع null مراقبة جندي) ، كما عملية في تحت مرة checkpoint قبل انهيار انهيار.cold listing ممكن حمل متابعة توفير خروج قديم هوية، مباشر إلى مرة live تشغيل أو cache write استبدال هذا سطر. ذلك قبل رفع مخالفة عكس provider «تماما إلحاق مرة» اتفاق، و كما أيضا يحتاج خطأ مرور كل mandatory checkpoint؛ سليم سليم child لا تلقي أثر.seeded child لا يوجد body-owned cut وقت أبدا دخول rung 2.

إزالة استهلاك وجه إبقاء نفسه row و diagnostic wire شكل حالة.`list_agents` استخدام مطلوب query corpus و projection registry؛live identity قدوم ذاتي registry snapshot،cold identity قدوم ذاتي cache أو query observation.Host ownership ما زال استخدام `header.origin`،history استخدام مشترك live/cold Session query source؛ لا يوجد مستهلك مستقل تحليل descriptor event.

### تعديل سقوط نقطة

| منطقة مجال | ملف | تعديل |
| --- | --- | --- |
| subagent | projection.ts،projection-types.ts،index.ts | جديد عميل مرئي `subagent` unit و تسجيل |
| subagent | list-children.ts و نوع | query-corpus قطعة رفع إضافة projection مرحلة سلم أربعة حالة خريطة؛ مطلوب projections/query service و اختياري projection-cache إضافة سرعة |
| host/apiproxy | Session controller/query integration | owner فحص استخدام `header.origin`؛live/cold history و listing إزالة استهلاك مشترك query و projection source |
| tool | tool-subagent-control/list-agents.ts | model-visible schema، وصف و تصيير إبقاء ثابت |
| wire/client | api/subagents.ts،runtime sessions/service.ts،GUI | نوع، سطر شكل حالة و diagnostic معالجة**صفر تعديل**؛api/subagents.ts فقط `history` JSDoc إجراء لفظ تعديل لـ مزدوج ذراع |
| core/session،session-persistence،session-projection(-cache) ،session-query(-sqlite) | يحتوي متن cut و صنف لوحة تحويل seq نقل تمرير | Logical header كشف `isSeeded`؛Session،persistence observation،cache identity و query record مفرد وحيد يحمل دقيق `inheritedEventCount` |

## اعتبار مرور بديل خطة

**mode/label دخول SessionHeader.** صفر قراءة حفظ إثبات الأكثر قوي——قائمة فقط نظر header حينئذ قدرة صار سطر. لكن header تغيير سوف نقل توجيه إلى حفظ دائم provider و توافق صفة فحص؛ تخزين كمية JSONL فقط قدرة تخفيض لـ unknown أو backfill. قراءة وقت الآن حساب مقابل تخزين كمية جواب سجل هو «رقم مرة قائمة مرة `inspect` الآن حساب» ، لا اصطدام حمل دائم صيغة.

**projection-cache مرحلة سلم (`cachedSnapshot ?? cold fold` إضافة fail-soft كتابة عودة).** آلية صار قيام——session-projection-cache checkpoint مرحلة سلم هذا حينئذ لـ بارد قراءة تصميم. لكن checkpoint كتابة عودة هو واحد طقم من قائمة قيادة إرسال توليد بيانات حفظ دائم و بطلان تحرير ترتيب (floor/identity/putSoft) ؛ يتم لا هو هذا طقم تحرير ترتيب بصفة رئيسي آلية. تحديد مسودة رقم ثلاثة درجة مرحلة سلم بعد قدوم بـ فقط قراءة طريقة آلة سوف صفة إعادة استخدام هذا ذاكرة مؤقتة عمل ثاني درجة——بلا كتابة عودة، بلا تحرير ترتيب، نقص مقعد أي قفز مرور.

**إعطاء persistence إضافة محدود قراءة أصل لغة انتزاع إنقاذ تخزين كمية.** لـ مرة صفة مشكلة جديد فتح persistence أصل لغة؛ يتم قراءة وقت `inspect` كامل قراءة بديل——تخزين كمية رقم مرة يتم قائمة وقت كامل قراءة حينئذ هو أخذ قيمة ذاته.

**list سطر mode/label اختياري تحويل.** سليم سليم بيانات لا بد لكن يمكن حساب؛ اختياري تحويل فقط هو يأخذ نفاية قمامة بيانات معالجة تكرار مختلط درجة خارج فيض إعطاء الكل مستهلك——كل إزالة استهلاك وجه كل يلزم طويل خروج مرور ترشيح فرع و unknown عرض حالة. قوي اتفاق إضافة حساب لا خروج أي omit أكثر جاف صاف.

**تام قاع حذف diagnostic سطر.** حذف يأخذ مكتبة ضرر تالف مرئي صفة خارج فيض لـ سطر ساكن صامت إزالة فقد،wire/tool/GUI عكس يلزم كل منها تحمل تحمل اتفاق و لقطة تغيير؛ بينما إبقاء فقط يحتاج قائمة جانب حسب إسقاط قيمة نقص مقعد و activity إرسال توليد تصنيف، صفر صار هذا. مكتبة داخل تالف، ميت فرعي جلسة يجب مرئي هو diagnostic وجود أصلي حركة آلة، إبقاء بعد إزالة استهلاك وجه كامل جسم صفر تعديل.

**registry حساب حساب فشل عبر طريق (per-unit سعة خطأ إضافة `failures` مرفق إضافة حقل).** لـ يأخذ ضرر تالف، إصدار لا إقرار تعرف تقرير إبلاغ إعطاء مستهلك، من registry التقاط unit استثناء و في snapshot جانب مرفق per-key فشل حالة. يتم لا:failure لا هو قيمة، أيضا لا لا بد هو عبر طريق——unit دائم لا رمي خطأ، نقص مقعد ذاته حينئذ هو إشارة، «كبير لا حساب خروج قدوم لا يوجد» ، مثل أي عرض هو مستهلك يلزم اعتبار أمر. واحد مستقل مراقبة:vendor cordis `emit`([vendor/cordis/src/events.ts](../../../../vendor/cordis/src/events.ts)) مقابل listener رمي خطأ صفر التقاط، إسقاط قيادة تعليق في `session/event` فوق وقت unit استثناء سوف امتداد emit هروب هروب——هذا إضافة إعادة «unit دائم لا رمي خطأ» سجل قاعدة قسم كمية، لكن emit سعة خطأ إصلاح لا يخص هذا سجل نطاق.

**قيمة مع query بحث جذب preparation سقوط مكتبة.** إسقاط قيمة في sqlite backend مقابل حساب إعادة بناء داخل طي سقوط دخول session بحث جذب سطر، قراءة مستقر حالة صفر سجل:`projectionsFor` دفعة كمية قراءة وجه، سطر قيمة مع `(key → stateVersion)` تسجيل تجميع تخزين بطلان مقابل حساب و SCHEMA bump. كامل جسم تراجع دور: جهة نحو عكس——استعلام أساس أساس ضبط تطبيق يتم إجبار إقرار تعرف مجال مفردات (إسقاط صف، تسجيل تجميع مقابل حساب) ، بينما وحيد مستهلك subagent قائمة قراءة وقت الآن حساب يكفي ممتلئ كاف؛ مستهلك عودة صفر بعد، هذا طقم إرسال توليد حفظ دائم لا يوجد وجود إدارة من.`SESSION_QUERY_PROJECTIONS_UNAVAILABLE` مع قراءة وجه واحد و حذف.

**subagent يد عمل parse إضافة عملية memo إضافة إنشاء بث نوع.** لـ اقتباس حذف session-query اعتماد، من subagent حزمة ذاتي ذات تحليل وصف رمز حدث، بـ عملية داخل memo تجنب تجنب تكرار كامل قراءة، إنشاء وقت بث نوع أول قيمة. يتم قد تسليم مرحلة سلم يحل محل:live مشي `sessionProjections` ماء موضع ذاكرة مؤقتة،cold مشي تسجيل unit طي، إعادة استخدام registry هذا واحد نسخة طي مرجعي، لم يعد ظهور ثاني نسخة وصف رمز حل تفسير منطق، أيضا لا جذب دخول عملية حالة ذاكرة مؤقتة و بث نوع وقت ترتيب.

**session-query إخراج وجه DeepReadonly(قراءة مسار تعديل صنع فعلي تحقق).** عام استعلام إخراج عميق فقط قراءة تحويل، بـ في نوع طبقة وجه تثبيت ميت غير ممكن تغيير استعارة استخدام. فعلي إثبات مرفوض:3 موضع TS2589(نوع نسخة تحويل مرور عميق) إضافة 17 موضع عدد مجموعة موضع نقل صبغ (مستهلك عدد مجموعة طريقة و توسيع موضع يتم إجبار تتبع تعديل) ؛ عميق طبقة غير ممكن تغيير من core/session وقت التشغيل عميق تجميد ربط حفظ إثبات، هذا قراءة مسار تعديل صنع لم قبول دخول هذا سجل.

## تحقق

`packages/subagent/subagent/tests/list-children.spec.ts` ثابت هذا اتفاق:live identity عبر `Session.isOwnSeq()` فحص؛unseeded cold identity يمكن في cut صفر وقت استخدام cache؛seeded candidate قفز مرور هذا cache rung، تحويل بينما استخدام يحمل `inheritedEventCount` observation؛ أصل أولا identity لا يمكن عبر own-suffix فحص؛ نقص مقعد،null، في سم و غير ممكن استخدام cache/observation سوف حسب اتفاق سقوط قاع أو إنتاج diagnostic؛lifecycle اغتصاب تعديل حسب كامل رؤية إثبات حقل تجميع تخفيض لـ `corrupt`. قائم بلا مفتاح لقطة إبقاء سليم سليم wire و model-visible وجه ثابت،`subagent-diagnostic` فإن ثابت تشخيص تصنيف.

## عاقبة

- live child قائمة كل مسار صفر سجل قراءة؛cold child في cache لم تركيب أو لم أمر في وقت كل مرة قائمة مرة `inspect` كامل قراءة، صار هذا و ذلك transcript كبير صغير صار صحيح مقارنة، مع قائمة تردد معدل تكرار——تحديد سجل «حساب تمام أي توقف» ، لا ذاتي بناء ذاكرة مؤقتة، لا عودة كتابة، نفس id قصير مدة تكرار كامل قراءة يمكن أمر في دقيق تجهيز مرحلة مقطع LRU لكن قائمة لا اعتماد هو.
- subagent قائمة اشتراط Session query corpus و projection registry؛ خدمة ناقص سوف صريح فشل، بينما لا هو توفير خروج لا كامل row. اختياري projection cache فقط تغيير متن قراءة مرة عدد.
- هوية حل تفسير فقط وجود في registry تسجيل واحد نسخة unit: قائمة ثلاثة درجة مرحلة سلم و GUI history بارد قراءة استخدام ذلك live،cached أو observed wire لقطة، لا وجود يد كتابة جانب مسار طي؛ إذا لم قدوم بعض إزالة استهلاك وجه التفاف فتح هذا unit يد كتابة طي، كل قراءة وجه قيمة سوف عائم نقل——هذا هو هذا تصميم اشتراط صيانة حمل سجل قاعدة، لا هو آلية حفظ إثبات.
- per-child عزل ارتداد: مفرد child بارد قراءة فشل فقط ضرر فقد هذا سطر،healthy sibling لا تلقي أثر؛persistence قائمة فشل ما زال جعل كامل مرة قطعة رفع فشل.
- تشخيص و قطعة رفع دلالة إبقاء تحت خمسة موضع حد انحراف فرق (كثير وصف رمز أخذ نهاية من،header اندفاع مفاجئ لم يعد يتم ملاحظة شعور، ضرر تالف مصدر قراءة فشل تغيير تصنيف، لم معرفة parent من not-found تعديل لـ فارغ قائمة،unseeded rung 2 أكثر متأخر حدث نافذة).seeded أصل أولا identity قد لم يعد بنية صار انحراف فرق، لأن يحتوي متن قراءة سوف يأخذ هو و `inheritedEventCount` مقارنة مقارنة؛ استعادة تمييز حق بداية نهاية لا تلقي أثر.
- pre-#1569 بلا `origin` تخزين كمية لم يعد يتم إقرار عمل subagent تابع رئيسي؛ ذلك هذا حينئذ لا دخول دليل،pre-release بلا توافق تحمل وعد.

## متبادل صلة

- [durable-subagent-catalog و list_agents](../feature/2026-07-22-durable-subagent-catalog-and-list-agents.ar.md)——يتم هذا سجل جزء يحل محل: وصف رمز ما زال هو mode/label حمل دائم مرجعي و طي إدخال، أخذ قيمة تعديل لـ مشترك query corpus فوق projection مرحلة سلم.
- [session projections و أمر دورة الحياة سجل](../../proposed/architecture/2026-07-27-session-projection-and-command-log.ar.md)——registry اتفاق مرجعي؛ هذا سجل لـ ذلك إضافة جديدة `subagent` هوية unit، و إزالة استهلاك ذلك live و cold wire لقطة.
- [session projection حالة و عميل عرض](2026-08-19-session-projection-state-and-client-views.ar.md)——state/client تفكيك قسم؛`subagent` و `subagentTiming` كل توفير عميل wire view.
- [session projections بصفة مطلوب وصل شق](2026-08-19-session-projection-mandatory-seam.ar.md)——`sessionProjections` تحويل لـ مطلوب حقن؛ قائمة خطأ اتفاق مع ذلك تغير (registry نقص مقعد هو تنشيط مدة فشل، إسقاط رمز خطأ حذف).
- [web subagent conversations](../feature/2026-07-27-web-subagent-conversations.ar.md)——`SessionHeader.origin` خروج موضع (#1569) ، هوية حكم تحديد ذهاب سجل تحويل قبل نصف خطوة؛ ذلك history بارد قراءة (inspect بادئة إضافة registry طي) هو هذا سجل أخذ قيمة مرحلة سلم نفس بند أولا مثال.
- [إصدار قبل يمكن إعادة استخدام Session دقيق تجهيز مرحلة مقطع](2026-08-05-session-preparation.ar.md)——`inspect()` بارد قراءة و LRU إعادة استخدام؛cold child كامل قراءة صار هذا نموذج بناء قيام ذلك فوق.

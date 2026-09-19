# Agent Note: مشترك مهلة/قطع توقف وقت أصل لغة، صلب إنهاء إبقاء إعطاء كل قدرة ذاتي سطر تنفيذ

Status: implemented

[English](2026-07-06-timeout-deadline-library.md) | العربية

## مشكلة

مهلة معالجة في كل عدد تحمل تحميل أداة قدرة بين تدريجي تدريجي قسم تحويل، بينما كما هذا نوع قسم تحويل و غير جدول وجه: نفس طقم منطق يتم بـ ثلاثة نوع طريقة إعادة تنفيذ، كل منها حمل لديه دقيق بديع صحيح تأكيد صفة سالب تحمل.

- **bash**(عند وقت يقع في bash-local تنفيذ `run.ts`) في عملية إدارة طريق داخلي لديه واحد طقم كامل، صحيح تأكيد مهلة تنفيذ: واحد مرور إعداد ملقط موضع `timeoutMs`، اثنان عدد مستقل إطلاق جهاز (لأجل مهلة `killTimer` و لأجل فوق تنقل إلغاء `onAbort` مستمع) ، كل منها استدعاء نفس عدد `kill()` إغلاق حزمة قيادة عملية فرعية إنهاء مسار، و اثنان عدد صحيح تسليم نتيجة قيمة منطقية (`timedOut`،`aborted`) مستقل قفل تخزين. مرور هذا مرة كامل دمج بعد، هذا طقم إدارة طريق——يقع في [packages/subprocess/subprocess-local/src/spawn.ts](../../../../packages/subprocess/subprocess-local/src/spawn.ts)——فقط استجابة في توقف؛[packages/shell/bash-local/src/index.ts](../../../../packages/shell/bash-local/src/index.ts) يملك دمج دمج deadline و `timedOut`/`aborted` تصنيف.
- **web_fetch**([packages/web/web-fetch-http/src/provider.ts](../../../../packages/web/web-fetch-http/src/provider.ts)) لديه واحد طقم صحيح تأكيد لكن*يد كتابة*مهلة: بنية صنع واحد `AbortController`، اتصال `setTimeout(() => controller.abort(new WebError(…, 'WEB_FETCH_TIMEOUT')))`، يد حركة إضافة و إزالة فوق تنقل إشارة مستمع، في `finally` في صاف حذف تحديد وقت جهاز، و في `translateAbortOrNetwork` مساعد مساعدة دالة في من `signal.reason` استعادة مهلة سبب (لأن reader فقط رمي خروج عار `AbortError`).
- **web_search**([packages/web/tool-web/src/search.ts](../../../../packages/web/tool-web/src/search.ts))**تماما لا يوجد مهلة**:`WebSearchRequest`([packages/web/web/src/types.ts](../../../../packages/web/web/src/types.ts)) لا يحمل `timeoutMs` حقل، كل مزود `search()` فقط تحويل إرسال `exec.signal`.(web_search في هذا مرة تصميم في إبقاء بلا مهلة——رؤية «عاقبة».)

كل جديد خارجي عملية أو شبكة أداة كل يلزم إعادة دفع توجيه نفس مثال أربعة عنصر أمر: ملقط موضع طلب قيمة، بدء تحديد وقت جهاز، سوف مهلة و فوق تنقل إلغاء دمج دمج، في خروج فتحة موضع منطقة قسم «مهلة» و «قد إلغاء». بينما دمج دمج و سبب استعادة تماما تماما هو الأكثر سعة سهل خروج دقيق بديع خطأ جزء (web_fetch `signal.reason` معالجة حينئذ هو دليل). و هذا معا، كل قدرة تنفيذ*إنهاء*عملية غير ممكن عودة نحو أرض مختلف:bash طلب ذلك عملية فرعية مزود إنهاء من OS يملك نطاق، بينما web في توقف واحد عملية داخل `fetch`، من undici تفكيك حذف socket.[أصلي containment قرار](2026-08-28-subprocess-native-containment.ar.md) مسؤول محلي scope،Job و fallback آلية؛ لا وجود واحد قدرة إيقاف كل قدرة عمل مفرد واحد آلية.

## قرار

`@deepseek-ai/dsh-timeout` يقع في `packages/util/`(و `dsh-brand` نفس درجة) ، مسؤول مهلة*حساب وقت و تصنيف*هذا واحد نصف؛*إنهاء*ذلك واحد نصف——صلب إنهاء——إبقاء في كل قدرة تنفيذ في. هو هو واحد صاف دالة مكتبة،**لا هو** Cordis خدمة أو إضافة: لا استقبال `ctx`، لا تسجيل أي شرق غرب، لا يحتفظ عبر استدعاء حالة، لا إرسال إطلاق حدث. هذا داخل لحظة معنى لا ضبط في وسط «مهلة خدمة» ، لأن ذلك مثال خدمة يجب معرفة طريق مثل أي إيقاف كل قدرة عمل——بينما هذا صحيح هو دقيق داخل نواة يلزم ترتيب حذف في مشترك طبقة خارج معرفة تعرف، أيضا هو Codex سوف `ExecExpiration` حد تحديد في exec عائلة الذي عرض نطاق أصل فإن.

### مكتبة مقابل خارج واجهة

أربعة عدد دالة، واحد watchdog واجهة إضافة واحد reason نوع:

```ts ignore-check
/** The internal reason attached to a timeout abort, so consumers can classify it after the fact. */
export class TimeoutReason extends Error {
  override name = 'TimeoutReason'

  constructor(readonly code: string, readonly timeoutMs: number) {
    super(`${code} after ${timeoutMs}ms`)
  }
}

/** Validate/fill a caller's optional positive hint from the backend's default, then cap at its max. */
export function clampTimeout(
  requested: number | undefined,
  def: number,
  max: number,
  name = 'timeoutMs',
): number

/**
 * Build a deadline signal that aborts on upstream cancellation OR on timeout,
 * with the timeout carrying a `TimeoutReason`. `timeoutMs <= 0` means "no
 * timeout" (background jobs): forward only the upstream signal, arm no timer.
 * The returned object's `[Symbol.dispose]` clears the timer — `using` for a
 * scope-lifetime consumer, a manual call for an event-lifetime one.
 */
export function deadline(
  upstream: AbortSignal | undefined,
  timeoutMs: number,
  code: string,
): { signal: AbortSignal; [Symbol.dispose](): void }

/** A stable signal plus one-at-a-time, timer-guarded async-iterator demand. */
export interface IdleWatchdog {
  readonly signal: AbortSignal
  next<T>(iterator: AsyncIterator<T>): Promise<IteratorResult<T>>
  pulse(): void
  [Symbol.dispose](): void
}

/** Arm only while one iterator `next()` is outstanding; rearm on later demand or out-of-band activity. */
export function idleWatchdog(
  upstream: AbortSignal | undefined,
  timeoutMs: number,
  code: string,
): IdleWatchdog

/** Recover the TimeoutReason from an aborted signal (or error); `code` scopes the match to this deadline's timer. */
export function timeoutOf(x: AbortSignal | { reason?: unknown }, code?: string): TimeoutReason | undefined
```

`deadline` عبر `AbortSignal.any` سوف فوق تنقل إشارة و مرة صفة تحديد وقت جهاز دمج دمج، مرفق إضافة واحد نوع تحويل `TimeoutReason`، و كشف يمكن dispose(مورد تحرير) تحديد وقت جهاز تنظيف. غير صحيح عدد مهلة هو داخلي «بلا مهلة» مراقبة جندي، لأجل خلفية يملك خلفية مهمة؛ خارجي تلميح مرور مرور `clampTimeout`، يجب لـ صحيح لديه حد قيمة. حيث بلا تحديد وقت جهاز أيضا بلا فوق تنقل إشارة وقت، دالة إرجاع واحد دائم لا في توقف إشارة، أداة لديه نفسه disposal شكل حالة.`idleWatchdog` فإن اشتراط صحيح لديه حد بين فصل، في كامل تدفق خلال إبقاء واحد مستقر دمج دمج إشارة، و كما فقط في واحد مكرر `next()` بعد لم تسوية وقت بدء تحديد وقت جهاز؛ تسوية سوف حل حذف تحديد وقت جهاز، لاحق demand سوف إعادة بدء، حمل خارج نقل نشط حركة حدوث بعد،`pulse()` فإن سوف لـ نفس عدد بعد لم تسوية demand إعادة بدء تحديد وقت جهاز. إذا لا يوجد بعد لم تسوية demand، أو قد dispose،pulse لا تنفيذ أي عملية؛ تزامن demand سوف فشل،dispose سوف صاف حذف حالي arm. مزود سوف مهلة سبب تحويل ترجمة لـ seam خاص تحديد نتيجة.`timeoutOf(signal, code)` حد تحديد تصنيف نطاق، جعل خارج طبقة تضمين طقم deadline يتم نظر لـ فوق تنقل إلغاء بينما غير داخل طبقة قدرة ذاته مهلة.

### مسؤولية تخطيط قسم

| صلة ملاحظة نقطة | مسؤول جهة |
|---|---|
| تحقق طلب تلميح و ملقط موضع قيمة افتراضية/الأكثر كبير قيمة | `dsh-timeout`(`clampTimeout`): صاف حساب فن إضافة مشترك صحيح لديه حد طلب اتفاق |
| بدء مرة صفة تحديد وقت جهاز، إلى مدة في توقف، يحمل reason، و فوق تنقل إلغاء دمج دمج | `dsh-timeout`(`deadline`) |
| فقط محيط التفاف لم تسوية مكرر demand بدء و إعادة بدء، حمل خارج نشط حركة أيضا سوف إطلاق إعادة بدء | `dsh-timeout`(`idleWatchdog`) |
| صاف حذف تحديد وقت جهاز | `dsh-timeout`(مهمة واحد أصل لغة `[Symbol.dispose]`) |
| في توقف بعد مقابل أول عدد abort reason إجراء تصنيف | `dsh-timeout`(`timeoutOf`) |
| **فعلي إنهاء عمل** | كل قدرة تنفيذ |
| قيمة افتراضية/الأكثر كبير قيمة*عدد قيمة* | كل قدرة إعداد |
| مهلة `code` نص | كل قدرة (`WEB_FETCH_TIMEOUT` ≠ `BASH_TIMEOUT`) |

إشارة فقط*إشعار*؛ إنهاء بداية نهاية هو استماع جهة مسؤولية، بينما استماع جهة بسبب قدرة بينما مختلف.bash ذاتي سطر تحرير كتابة `addEventListener('abort', kill)`، لأن OS عملية وجود في هذا وقت التشغيل خارج، يجب من عملية فرعية مزود قيادة ذلك يملك نطاق بلوغ إلى تماما توقف مستقر؛web سوف `d.signal` تسليم إعطاء `fetch`، من undici تفكيك حذف socket. هذا أيضا هو ملف قراءة/كتابة/تحرير**لا قبول** `timeoutMs` سبب: محلي نظام استدعاء الأكثر كثير فقط قدرة كل قوة في توقف، مهلة لا يمكن قوي صنع `fsync`/`rename` إيقاف، إضافة مهلة سوف هو واحد مخالفة عكس «صريح أفضل في خفي صيغة» خفي صيغة قيمة افتراضية. اثنان عدد مشاركة اعتبار agent(ذكي جسم) خروج في نفس مثال سبب مقابل ملف I/O لا ضبط مهلة.

### كل قدرة مثل أي إزالة استهلاك هذا مكتبة

- **web_fetch**: أداة طبقة إبقاء تحقق و تحويل إرسال؛ مزود يد كتابة controller + `setTimeout` + يد حركة مستمع + `finally` + `signal.reason` استعادة يتم استبدال لـ مزود ذاتي لديه `deadline`/`timeoutOf`. قد مسبق أولا في توقف فوق تنقل إشارة ما زال قيام أي رمي خروج `WEB_ABORTED`؛ لا فإن `fetch` استخدام دمج دمج بعد `d.signal` تشغيل،`translateAbortOrNetwork` أصل حسب إشارة تصنيف رمي خروج خطأ (`timeoutOf` → `WEB_FETCH_TIMEOUT`، لا فإن قد في توقف → `WEB_ABORTED`، لا فإن شبكة خطأ → `WEB_PROVIDER_ERROR`). عام رمز خطأ اتفاق ثابت،`TimeoutReason` دائم بعيد لن بصفة عام خطأ عبر تجاوز web seam.
- **bash**:`resolve()` سوف طلب ملقط موضع لـ صريح قاعدة إطار. قبل منصة `run()` إنشاء deadline و سوف ذلك إشارة نقل إعطاء عملية تنفيذ، بعد من abort مستمع استدعاء `SubprocessHandle.terminate()`، و انتظار نفس عدد من مزود إدارة نطاق. منفذ سوف أول عدد abort تصنيف لـ مهلة أو إلغاء. خلفية بدء إبقاء بلا مهلة، فقط تحويل إرسال فوق تنقل إلغاء.
- **LLM(كبير لغة نموذج) مهايئ**:`dsh-llm-deepseek` و `dsh-llm-pi-ai` استخدام `idleWatchdog` حزمة تركيب فعلي نقل تكرار بديل. إعداد خمسة دقيقة بين فصل فقط تغطية بعد لم تسوية مزود demand، لا يشمل تحت تنقل مستهلك في قسم قطعة بين زهرة استهلاك وقت.DeepSeek مباشر وصل مهايئ أيضا سوف في ذلك SSE(Server-Sent Events) محلل مراقبة إلى ملاحظة تفسير وقت، مقابل هذا بند بعد لم تسوية demand استدعاء `pulse()`؛ هذا ملاحظة تفسير حيث لن بصفة `StreamChunk` إنتاج خروج، أيضا لن كتابة جلسة سجل.pi-ai SDK لن نحو ذلك مهايئ كشف ملاحظة تفسير نشط حركة، لذلك هذا مسار فقط قدرة في SDK إنتاج خروج قيمة وقت إعادة بدء تحديد وقت جهاز. مستقر إشارة في كامل استدعاء خلال نقل إعطاء `fetch` أو SDK، لذلك مهلة سوف إغلاق قاع طبقة طلب و خريطة لـ `TIMEOUT`، بينما أكثر مبكر استدعاء جهة في توقف خريطة لـ `ABORTED`.

## عاقبة

- `runBash` نتيجة لم يعد مستقل قفل تخزين `timedOut` و `aborted`؛ مهلة و مستخدم في توقف في عملية إغلاق قبل تنافس تنازع وقت، الآن تقرير إبلاغ مفرد واحد أول عدد abort سبب، بينما غير اثنان من معا لـ true. مهلة تصنيف لا تغيير من مزود إدارة إنهاء: محلي POSIX نطاق استخدام TERM→عرض حد مدة→KILL،Windows عادي نطاق فإن قيام أي إنهاء.Service Definition نوع `ShellRunResult` إبقاء اثنان عدد قيمة منطقية (الآن متبادل رفض) ، لذلك `dsh-tool-bash` نتيجة تصيير لا تلقي أثر.
- `SpawnSpec.timeoutMs` و `SpawnOutcome.timedOut`/`aborted` يتم إزالة، بينما غير بصفة بداية نهاية لـ صفر/بداية نهاية لـ false ناقص بقية إبقاء: من في `runBash` لم يعد يملك تحديد وقت جهاز كما منفذ مسؤول تصنيف، هذه حقل بلا موضع يتم قراءة. واحد بداية نهاية لـ 0 كما بلا موضع قراءة حقل في تدريجي ملف نسبة التغطية بوابة تحت يخص ميت شفرة.
- web_fetch ذهاب حذف ذلك تحديد صنع controller/timer/listener/reason-recovery؛ تصنيف جهاز الآن أساس في deadline إشارة (`timeoutOf` + `aborted`) بينما غير رمي خروج خطأ شكل حالة قدوم حكم قطع، هذا في طلب مرحلة مقطع reject-with-reason و قراءة مرحلة مقطع عار `AbortError` اثنان نوع حال حال تحت كل هو سليم قوي.
- `AbortSignal.any` و `using`/`Symbol.dispose` في هذا أول مرة دخول هذا مستودع (Node ≥ 24 أساس خط، قد ممتلئ كاف).
- نموذج تدفق الآن مشترك واحد يمكن إعادة بدء تحديد وقت جهاز اتفاق، لن يأخذ انزلاق حركة فارغ خامل بين فصل تغيير صار مجموع استدعاء قطع توقف وقت، أيضا لن حساب دخول مستهلك تفكير اعتبار وقت. قدرة كاف مراقبة إلى حمل خارج نقل نشط حركة مهايئ يمكن مقابل بعد لم تسوية demand استدعاء `pulse()`؛ يتم شاشة حجب نشط حركة مقابل watchdog ما زال غير ممكن رؤية. هذا أصل لغة ما زال فقط فعل إشعار؛ مهايئ اختبار إثبات ذلك نقل مراقبة إلى مستقر إشارة و إنهاء.

التالي محتوى لا في هذا مرة نطاق داخل، صف خروج بـ علامة واضح حد:`web_search` يمكن في ذلك أداة schema و لقطة تغطية قاعدة تخطيط إتمام بعد نيل نيل اختياري موجه إلى نموذج `timeout_ms`؛ أساس في ripgrep نظام الملفات اكتشاف أداة ([تحزيم ripgrep بحث](../../archived/architecture/2026-08-01-packaged-ripgrep-search.md)) عبر `dsh-tool-call-timeout-policy` و `exec.signal` إزالة استهلاك نفس مثال مزود ذاتي لديه deadline شكل حالة؛`tools/execute` waterfall(شلال نشر صيغة حدث) في بين عنصر يمكن عبر قيادة `exec.signal` لـ كل مرة استدعاء الأداة ضبط افتراضي deadline——ذلك سوف هو واحد*إزالة استهلاك*هذا مكتبة إضافة، ما زال فقط فعل إشعار، صلب إنهاء ما زال هو كل قدرة ذاتي ذات أمر.

## سبق اعتبار بديل خطة

**موحد واحد مهلة*إضافة* / `ctx.timeout` خدمة.** أساس في دقيق داخل نواة أصل فإن مرفوض. واحد قدرة إيقاف أي أداة عمل خدمة يجب إدارة حل كل قدرة إنهاء آلية (أصلي scope أو Job إنهاء،fallback عملية مجموعة إشارة،socket تفكيك حذف، نظام استدعاء حد فحص) ، هذا صحيح هو هيكل بنية الذي منع توقف «داخل نواة معرفة طريق جدا كثير».Codex `ExecExpiration` يتم حد تحديد في exec عائلة، صحيح هو لأن هو قيادة kill(`killpg`) هو عملية عائلة خاص لديه؛MCP و نموذج تدفق كل منها حفظ لديه ذاتي ذات. لا وجود واحد وصل اختراق في بين طبقة قدرة لـ كل شرق غرب يملك إنهاء حق، لذلك مشترك جزء فقط قدرة هو صاف حساب وقت/تصنيف ذلك واحد نصف——واحد مكتبة، بينما غير خدمة.

**كل أداة كل منها تنفيذ مهلة، لا مشترك شفرة (أولا قبل الآن حالة، أيضا هو Claude Code اختيار).** مرفوض، لأن هو قد في إنتاج قسم تحويل و تكرار صحيح تأكيد صفة سالب تحمل:web_fetch يد كتابة و لم قدوم شبكة/عملية صنف أداة كل منها حاجة إعادة دفع توجيه تماما نفسه controller/reason منطق، بينما دمج دمج + `signal.reason` استعادة صحيح هو سعة سهل خروج خطأ جزء.Claude Code سعة تحمل تماما تكرار؛ هذا مستودع لديه واحد موحد واحد مشترك abort عبر طريق (كل مرة `execute` فوق `exec.signal`) ، جعل نيل اعتماد واحد صغير نوع مشترك أصل لغة واضح إظهار أكثر بسيط نظيف، لذلك صار هذا/استلام فائدة مختلف.

**استخدام `withTimeout(promise, ms)` حزمة تركيب جهاز بديل بديل إشارة عمل مصنع.** مرفوض، لأن يجعل promise و تحديد وقت جهاز تنافس تنازع فقط هو في قطع توقف وقت وصول وقت resolve *استدعاء الأداة* promise، بينما لن إيقاف قاع طبقة عمل——عملية فرعية أو fetch socket سوف تسرب تسرب. توزيع إشارة و اشتراط قدرة استماع، عندئذ قدرة قوي صنع واحد بند حقيقي إنهاء مسار وجود. هذا و «dispose يجب بلوغ إلى تماما توقف مستقر، بينما غير فقط فقط طلب هو» منع صد صفة قاعدة متسق.

**إبقاء bash مستقل مهلة و إلغاء إطلاق جهاز.** مرفوض، لأن واحد deadline إشارة إزالة تحديد صنع تحديد وقت جهاز و معيار تحويل تصنيف. حدوث تنافس تنازع وقت، تقرير إبلاغ أولا وصول ذلك عدد abort بصفة سبب، من مزود إدارة إنهاء مسار لا تلقي أي عدد سبب أولا فوز خروج أثر.

# Agent Note: سوف واحد عنصر متصفح عملية وضع إلى الذي تابع Remote خدمة

Status: implemented
Archived: 2026-09-04

[English](2026-08-10-unary-apiproxy-remote-migration.md) | العربية

## مشكلة

Host API Proxy سبق في عمل خدمة Service،API Proxy interface،Zod schema، توجيه جدول،Client stub و Client استدعاء جهة بين تكرار تعريف بسيط مفرد واحد عنصر عملية.[Typert Remote استدعاء](2026-08-02-typert-remote-method-calls.zh.md) قد سماح عمل خدمة حزمة يحتفظ هذا صنف استدعاء، لكن إذا ترحيل endpoint وقت لا يوجد واحد و إبقاء دورة الحياة و إسقاط سياسة، حينئذ سوف تغيير يمكن مراقبة سلوك.

و Agent ربط استدعاء حاجة إطار خارج حذر حذر. مشترك lookup سياسة سوف إعادة استخدام live Agent، استخدام سجل preset استعادة عادي بارد Session، مقابل تزامن استعادة ذهاب إعادة، و رفض من subagent يحتفظ identity.skill قائمة فإن يجب فحص Session بينما لا تنشيط Agent.Settings و preset عملية لن يأخذ Host يحتفظ وثيقة مسار وضع دخول متصفح طلب؛Session ملف رابط إبقاء من استدعاء جهة تحليل مسار سلوك.

## قرار

بسيط مفرد واحد عنصر عملية ملكية ذلك ذاتي لكن عمل خدمة Remote owner. عمل خدمة حزمة يحتفظ Remote توقيع و Host ملائم إعداد؛`@deepseek-ai/dsh-api-remotes/client` اختيار ذلك توليد مساهمة؛Client حزمة يحتفظ عرض ربط وصل.Connection يحتفظ نقل envelope و دقيق Fetch توجيه سجل التسجيل، لم يعد وجود API Proxy خدمة.

| أصل API Proxy عملية | هدف | Owner و إبقاء سلوك |
|---|---|---|
| `session.rename` | `sessionTitle/rename` | `SessionTitleService` عبر مشترك lookup سياسة تحليل Session، و إرجاع عنوان حدث ترتيب رقم. |
| `command.list`،`command.execute` | `commands/list`،`commands/execute` | `CommandRuntime` إبقاء Agent lookup، لم مطابقة أمر و استدعاء جهة إلغاء. |
| `llm.providers` | `llm/listProviders`،`llm/listConfigurableProviders` | `LlmRuntime` يحتفظ provider واقع؛Client ربط وصل live و configurable سطر. |
| `llm.discoverModels` | `llm/discoverModels` | `LlmRuntime` إبقاء provider اكتشاف، إلغاء و صاف تحويل بعد فشل. |
| `llm.models` | `session/modelCatalog` | `SessionController` يحتفظ Host generation دليل، افتراضي اختيار و عزل بعد provider فشل. |
| `credentials.describe`،`credentials.set`،`credentials.unset` | `credentials/describe`،`credentials/set`،`credentials/unset` | `CredentialsController` إبقاء مرجع تحقق، حقل إسقاط،provider تشخيص و رفض خريطة. |
| `settings.describe`،`settings.update`،`settings.replace`،`settings.mutate` | مقابل `settings/*` طريقة | `SettingsController` إبقاء انفصال حساس،mutation دلالة،revision تحقق و provider فشل. |
| `settings.openDocument` | `settings/openSettingsDocument` | `SettingsController` دقيق تجهيز provider يحتفظ وثيقة، و حسب نص تحرير جهاز معنى رسم فتح. |
| `agentPreset.read`،`agentPreset.copy`،`agentPreset.remove` | مقابل `agentPresets/*` طريقة | `AgentPresetService` يحتفظ وثيقة قراءة، نسخ و حذف. |
| `agentPreset.openDocument` | `settings/openAgentPresetDirectory` | `SettingsController` تحليل preset دليل، و في أصلي فتح غير ممكن استخدام وقت إرجاع ذلك مسار. |
| `subagent.interrupt` | `subagents/interruptByParent` | subagent خدمة إبقاء parent إذن، كما لا تنشيط أي واحد جهة Agent. |
| `workspace.list`،`workspace.insertSessionBefore`،`workspace.archiveSession` | مقابل `workspace/*` طريقة | Workspace registry يحتفظ انفصال مغادرة متغير كائن snapshot و سلسلة سطر mutation. |
| `skill.list` | `skills/list` | `SessionSkillCatalog` مراقبة Session و ذلك سجل preset، فقط في live Agent قد وجود وقت استخدام هو، قائمة استعلام أبدا تنشيط Agent. |
| `fileReferences/list` | `fileReferences/list` | `SessionFileReferences` نحو provider توفير Session Controller قائم Agent lookup؛ بارد lookup سلوك إبقاء ثابت. |
| `host.openPath` | `session/openWorkspacePath` | Session-aware Client أولا أساس في معروف workspace تحليل متبادل مقابل مسار، مجددا من `SessionController` تسليم إعطاء أصلي فتح جهاز. |
| `host.describe` | `$events` ready frame و capability استعلام | API Remotes مع generation readiness إرسال Host home، مستهلك عبر `ctx.remote.$host.home` و و صف `$host.isLoopback` بـ عادي قيمة قراءة؛Settings و Session controller في مقابل صفحة عرض وقت تقرير إبلاغ كل منها أصلي فتح قدرة. لا إرسال بلا شخص استخدام عملية بيانات وصفية. |
| `session.export` | `GET`/`HEAD /api/session.export` | `session-log-export` تسجيل دقيق Connection Fetch توجيه، و في لا يوجد JSON Remote envelope حال حال تحت تدفق صيغة نقل ZIP. |

مشترك Agent و Session resolver ما زال هو استقبال هذه كائن endpoint مرجعي. هو توفير و قديم API Proxy استدعاء نفسه live إعادة استخدام، بارد استعادة، تزامن ذهاب إعادة،preset setup، حفظ دائم فشل و subagent ownership fence.resolver رمي خروج يحمل ذاتي لديه رمز `RemoteError`——`session/not-found` أو `session/agent-busy`——Gateway يأخذ هذا رمز،message و details أصل مثال تحرير رمز فوق wire، لذلك lookup رفض و `gateway/internal` بداية نهاية يمكن منطقة قسم ([فشل مفردات](2026-08-28-ctx-remote-failure-vocabulary.zh.md)).

أصلي مسار تنفيذ في `@deepseek-ai/dsh-native-command` في.Settings controller اختيار Host يحتفظ هدف،Session-aware Client فإن في استدعاء `SessionController` قبل تحليل workspace مسار؛ هذا أداة فقط مسؤول منصة استكشاف قياس،WSL تحويل، متصفح انحراف جيد، نص تحرير جهاز معنى رسم و بلا shell أمر تنفيذ.

## متصفح إقرار إثبات

Connection في اختيار Typert endpoint أو دقيق Fetch توجيه قبل إقرار إثبات كامل `/api` طلب. لذلك Remote استدعاء و Session سجل تحت تحميل اشتراط نفسه متصفح جلسة و Host/Origin تحقق.

## تحقق

تجمع تركيز Host و Client اختبار تغطية Remote استدعاء،lookup و لا تنشيط سياسة، أصلي فتح، خطأ إسقاط و legacy توجيه إزالة. مستودع بناء سوف أولا توليد و إزالة استهلاك الذي اختيار Remote contribution، مجددا بناء Web تطبيق.

## اعتبار مرور بديل خطة

**سوف بسيط مفرد استدعاء إبقاء في API Proxy.** مرفوض، لأن عمل خدمة owner قد وجود بعد، هذا ما زال سوف إبقاء تكرار interface،schema، توجيه سطر،stub و نتيجة إسقاط.

**إبقاء `host.describe`.** مرفوض، لأن مرة bootstrap استدعاء سوف يأخذ Connection readiness و متبادل لا متبادل صلة عملية و عمل خدمة واقع اقتران دمج بدء قدوم.generation-ready frame فقط يحمل قيام أي حاجة دورة الحياة واقع، كل capability owner صفحة في عرض وقت استعلام ذاتي ذات حالي قدرة.

**في generation-ready frame في إصدار كل عمل خدمة capability.** مرفوض، لأن هذه قيمة لا يوجد مشترك نفس تحديث دورة الحياة. فقط لديه مستقر Host home يخص Connection؛ كل عمل خدمة owner عودة جواب ذاتي ذات حالي capability.

**يأخذ Session export يمثل لـ Remote.** مرفوض، لأن متصفح تحت تحميل إدارة جهاز إزالة استهلاك تدفق صيغة HTTP استجابة، بينما لا هو JSON نتيجة. دقيق تسجيل Fetch توجيه يجعل وظيفة حزمة يحتفظ هذا سلوك، معا لا جذب دخول ثاني عدد gateway.

**يأخذ أصلي فتح عملية وضع دخول بعض عدد controller.** مرفوض، لأن Session و Settings اختيار مختلف تخويل هدف.Host أداة يمكن تجنب تجنب controller بين استيراد، معا لا يجعل متصفح يصبح نظام الملفات هدف مرجعي.

## عاقبة

عمل خدمة owner و Client consumer كل منها تعريف واحد عنصر عملية واحد جانب، بينما Connection يحتفظ إقرار إثبات، نقل، استجابة envelope، دقيق Fetch توجيه و generation حالة. حذف legacy Client timeout هو قد قبول يمكن مراقبة نقل تغير؛ عمل خدمة نتيجة، إلغاء، دورة الحياة سياسة، مرور ترشيح و أصلي مسار إذن ما زال من قائم مجال يحتفظ.

كل عند Remote توقيع أو الذي اختيار حزمة حدوث تغير، كل يجب تحديث توليد Remote ناتج و صريح API Remotes assembly.

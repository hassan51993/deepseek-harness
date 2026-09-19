---
description: "فعلي تحقق مجموعة أرض رسم: يمكن عام تثبيت مسبق مستقر أصل نوع."
kind: "package-group"
---

# packages/experimental

[English](README.md) | العربية

## عام وصف

فعلي تحقق مجموعة يتضمن اتفاق ممكن تغيير كما لا توفير دعم حمل تحمل وعد أصل نوع قدرة. كل حالي حزمة كل بـ `@deepseek-ai/dsh-experimental-*` اسم إصدار، يشمل صريح تفعيل Agent Teams تركيب،Auto review،Cua Driver مزود، متصفح عملية خلفية، عبر realm Inspector،CPython PTC خلفية و متصفح worker معاينة مكتبة. مجموعة خارج قد إصدار منتج لا نيل اعتماد فعلي تحقق صفة حزمة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`agent-team-profile`](agent-team-profile/README.zh.md) | Agent Teams عام opt-in profile طبقة | — |
| [`agent-team`](agent-team/README.zh.md) | أداة اسم teammate، عضو بين حمل دائم رسالة و مشترك مهمة لوح | `ctx.agentTeams` |
| [`agent-team-web-profile`](agent-team-web-profile/README.zh.md) | Agent Teams عام opt-in Web طبقة | — |
| [`client-ui-agent-team`](client-ui-agent-team/README.zh.md) | Web Team roster، مهمة لوح و teammate تنقل | — |
| [`auto-review`](auto-review/README.zh.md) | صريح Web طبقة، في كل أصلي أو PTC inner أداة استدعاء قبل استخدام نفس نموذج مراجعة فحص | — |
| [`ptc-runtime-python`](ptc-runtime-python/README.zh.md) | PTC تنفيذ seam CPython عملية فرعية خلفية | `ctx.ptcRuntime` |
| [`computer-use-cua-driver-mcp`](computer-use-cua-driver-mcp/README.zh.md) | عبر MCP استخدام قد تثبيت Cua Driver | `ctx.computerUse` |
| [`computer-use-cua-driver-native`](computer-use-cua-driver-native/README.zh.md) | تضمين دخول Cua Driver أصلي npm وقت التشغيل | `ctx.computerUse` |
| [`browser-use-playwright-mcp`](browser-use-playwright-mcp/README.zh.md) | عبر MCP توفير Playwright متصفح أداة | `ctx.browserUse` |
| [`browser-use-chrome-devtools-mcp`](browser-use-chrome-devtools-mcp/README.zh.md) | عبر MCP توفير Chrome DevTools فحص و متصفح تحكم | `ctx.browserUse` |
| [`browser-use-stagehand-native`](browser-use-stagehand-native/README.zh.md) | Stagehand متصفح عملية و صريح إعداد أصلي نموذج | `ctx.browserUse` |
| [`browser-use-runtime`](browser-use-runtime/README.zh.md) | فعلي تحقق صفة مزود مشترك Session متصفح مورد | — |
| [`inspector`](inspector/README.zh.md) | لأجل Host ضبط تجربة،Client Runtime فحص، شبكة شبكة أخذ تجميع و Cordis شجرة عبر realm CDP hub | `ctx.inspector` |
| [`tool-agent-team`](tool-agent-team/README.zh.md) | يجعل نموذج إنشاء، إرسال رسالة و تنسيق ضبط teammate تسعة عدد أداة | حسب أثر مجال تسجيل أداة إلى `ctx.tools` |
| [`webworker-packer`](webworker-packer/README.zh.md) | بناء متصفح worker معاينة الذي إزالة استهلاك gzip ضغط وهمي محاكاة نظام الملفات (VFS) مرآة مثل | مكتبة و CLI(أمر سطر واجهة) ، لا استخدام ctx key |
| [`webworker-runtime`](webworker-runtime/README.zh.md) | في مخصص استخدام متصفح worker في تشغيل harness إضافة شجرة | مكتبة و worker مدخل، لا استخدام ctx key |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [فعلي تحقق حزمة إصدار قرار](../../.agents/notes/implemented/process/2026-09-12-experimental-publication-denylist.zh.md)——افتراضي عام و خاص مثال خارج.
- [حساب حساب آلة عملية](../../docs/subsystems/computer-use.zh.md)——طاولة وجه مزود اختيار.
- [متصفح عملية](../../docs/subsystems/browser-use.zh.md)——متصفح مزود اختيار و Session كل حق.
- [Agent Teams فرعي نظام](../../docs/subsystems/agent-team.zh.md)——حمل دائم Team نوع و `ctx.agentTeams` خدمة API.
- [فعلي تحقق فرعي شجرة قاعدة](AGENTS.md)——فعلي تحقق حالة وضع عرض ماذا، لا وضع عرض ماذا.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

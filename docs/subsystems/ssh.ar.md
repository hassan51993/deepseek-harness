# SSH

[English](ssh.md) | العربية

تقدّم [عائلة مزوّدي SSH](../../packages/ssh/README.ar.md) عالمَ ملفات وعمليات بعيدًا واحدًا عبر وصلة OpenSSH يملكها النشر. ويبقى الحزامُ ونقلُ النموذج وتخزينُ الجلسة على المضيف. وتنفّذ العائلةُ واجهاتِ نظام الملفات والعمليات الفرعية والعزل القائمة؛ ولا تُدخل أدواتِ نموذج خاصة بـSSH.

## إحداثيات التنفيذ

تشير هوياتُ نظام الملفات، والبحثُ عن التنفيذيات، ودليلُ عمل العملية، وجذورُ مساحات عمل العزل، وروابطُ ملفات خادم اللغة إلى مضيف SSH. ويعيّر المزوّدون المساراتِ حيث توجد الملفاتُ، فيحفظون تفسيرَ نظام الملفات لـ`symlink/..`. ويحمل محلِّلُ السياسة الهجاءَ المطلق لعالم التنفيذ بلا محاولة حلّ المسارات البعيدة على مضيف الحزام.

ويقدّم `processPath()` مسارًا صالحًا لمزوّد العمليات الفرعية المقترن. ويبقى `processPathFromHostPath()` غيرَ متاح لـSSH؛ فتثبيتُ أثر بعيد لا يجعل مسارَ مضيف كيفما كان قابلًا للنقل. ولذلك تأخذ [`NodePtcRuntime`](../../packages/ptc-runtime/ptc-runtime-node/README.ar.md) إقلاعًا بعيدًا مثبَّتًا صراحةً ومتحقَّقًا من بصمته.

## النقل والثقة

يستعمل RPC الإداري مجاري تنفيذ SSH لدى المساعد. أما stdin وstdout وstderr المعتادة وخرجُ الطرفية وحركةُ التحكم الاختيارية على fd 7 فتستعمل مقابس Unix مُمرَّرة وموثَّقة على حدة. ولكل مجرى مُمرَّر نافذةُ قناة SSH خاصة به؛ فخرجُ البرنامج الموقوف لا يتشارك نافذةَ التحكم ولا النافذةَ الإدارية. ومع ذلك تتشارك القنواتُ كلُّها عرضَ نطاق الوصلة وفشلَ النقل.

ويخص [`dsh-ssh`](../../packages/ssh/ssh/README.ar.md) توثيقُ النشر والتحققُ من الآثار المثبَّتة وتوثيقُ TLS لكل مجرى. وينفّذ المساعدُ طلباتِ نظام الملفات والعمليات بمزوّدين محليين موثوقين على الآلة البعيدة. وSSH نقلٌ؛ ومزوّدُ العزل البعيد المختار هو من يفرض آثارَ الملفات.

## عمر العملية وإلغاؤها

تُحجز العمليةُ قبل وصل مجاريها، ويُقبل الإطلاقُ مرةً واحدة على الأكثر. ويبلّغ `done` عن النتيجة المباشرة؛ ويراقب `waitForExit` المدى المدار البعيد. وتحتفظ عملياتُ الطرفية بالواجهة المشتركة اللاتزامنية. ويحرّر إلغاءُ التحضير وإنهاءُ عملية مُطلَقة والتخلصُ من المزوّد مواردَها المملوكة عبر المساعد.

وتحدّ المهلُ الإداريةُ مراقباتِ RPC المفردة؛ وهي لا تحلّ محلَّ مهلة التنفيذ التي يختارها مستهلكُ Bash أو ptc-runtime. وقد تبقى الانتظاراتُ البعيدة معلَّقة بينما تتقدم طلباتٌ أخرى. وفقدانُ SSH يُبطل العملياتِ المعلَّقة؛ ويبدأ التنظيفَ البعيد بلوغُ نهاية ملف المساعد والإشاراتُ وانتهاءُ عقد الإيجار. ويبلّغ العميلُ عن الحصائل غير المؤكدة بصدق ولا يعيد الاتصالَ قط لإعادة تشغيل فعل ربما نُفّذ.

## نطاق التركيب

يسجّل الوضعُ عديمُ الرأس دليلَ عمل الجلسة ويفحصه عبر مزوّد نظام الملفات المركَّب. ولذلك تستطيع مستهلكاتُ FS وBash والطرفية وLSP وPTC البعيدة أن تتشارك تلك الإحداثيات. أما عروضُ مساحة عمل Web التي تفترض الوصولَ إلى نظام ملفات المضيف فتحتاج إلى تكامل منفصل؛ فاستبدالُ المزوّدين وحده لا يجعل تلك العروضَ واعيةً بالبُعد.

وانظر [سجل القرار](../../.agents/notes/implemented/architecture/2026-09-11-posix-ssh-runtime.ar.md) للبدائل وواجبات التحقق.

## واجهة الوصلة البرمجية

```ts type-equiv
/** Deployment-owned SSH identity and installed helper; no model argument selects these values. */
interface Config {
  /** OpenSSH host alias, including its existing user, key and known-host configuration. */
  host: string
  /** Absolute remote Node executable. */
  node: string
  /** Absolute path to the installed, bundled helper entry. */
  helper: string
  /** SHA-256 of that bundled helper; mismatches refuse the connection. */
  helperHash: string
  /** Absolute remote default workspace. */
  workspace: string
  /** Optional preinstalled built PTC entry, paired with its expected digest. */
  bootstrapPath?: string
  /** SHA-256 of bootstrapPath; both fields must be supplied together. */
  bootstrapHash?: string
  /** Connection and administrative-request deadline, at most 2,147,483,647 milliseconds. */
  requestTimeoutMs?: number
  /** Maximum JSON payload bytes per helper request or response. */
  maxFrameBytes?: number
  /** Maximum ordinary requests; heartbeat and bounded resource cleanup have reserved capacity. */
  maxPending?: number
  /** Remote helper lease; loss of heartbeats starts remote managed cleanup. */
  leaseMs?: number
}
```

```ts public-api
/** One non-reconnecting SSH session; loss invalidates all active operations. */
declare class SshConnection extends Service {
  static Config: schema<Config>;
  /** Verified remote helper coordinates; callers must await this before launch. */
  readonly ready: Promise<Hello>;
  constructor(ctx: Context, config: Config);
  /** Hold plugin readiness until the remote identity and helper digest are verified. */
  async [Service.init](): Promise<void>;
  /** Verified remote Node executable for the paired PTC runtime. */
  get nodeExecutable(): string;
  /** Verified preinstalled PTC entry; unconfigured runtimes fail before program execution. */
  get bootstrapPath(): string;
  /**
     * Send a helper operation; cancellation never replays an ambiguous mutation.
     * @param method - the private helper operation.
     * @param params - JSON request fields validated by the helper.
     * @param result - response validation before returning provider-visible data.
     * @param signal - cancellation, which does not undo completed remote effects.
     * @param wait - allow a process observation to outlast the administrative deadline.
     * @returns the validated remote result.
     */
  async request<T>(method: string, params: unknown, result: z.ZodType<T>, signal?: AbortSignal, wait: boolean = false): Promise<T>;
  /**
     * Forward one authenticated stream through an independent SSH channel.
     * @param endpoint - private coordinates issued by this connection's helper.
     * @param signal - cancellation of allocation and the resulting socket.
     * @returns a paused socket; attach a consumer before resuming it.
     */
  async connectStream(endpoint: SshStreamEndpoint, signal?: AbortSignal): Promise<Socket>;
  /** Tear down the helper's remote managed ranges before releasing the SSH master when reachable. */
  dispose(): Promise<void>;
}
```

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxssh--sshconnection"></a>

### `ctx.ssh` — `SshConnection`

One non-reconnecting SSH session; loss invalidates all active operations.

```ts cordis-catalog
/**
 * Send a helper operation; cancellation never replays an ambiguous mutation.
 * @param method - the private helper operation.
 * @param params - JSON request fields validated by the helper.
 * @param result - response validation before returning provider-visible data.
 * @param signal - cancellation, which does not undo completed remote effects.
 * @param wait - allow a process observation to outlast the administrative deadline.
 * @returns the validated remote result.
 */
async request<T>(method: string, params: unknown, result: z.ZodType<T>, signal?: AbortSignal, wait: boolean = false): Promise<T>

/**
 * Forward one authenticated stream through an independent SSH channel.
 * @param endpoint - private coordinates issued by this connection's helper.
 * @param signal - cancellation of allocation and the resulting socket.
 * @returns a paused socket; attach a consumer before resuming it.
 */
async connectStream(endpoint: SshStreamEndpoint, signal?: AbortSignal): Promise<Socket>

/** Tear down the helper's remote managed ranges before releasing the SSH master when reachable. */
dispose(): Promise<void>
```

Source: [`packages/ssh/ssh/src/index.ts`](../../packages/ssh/ssh/src/index.ts)
<!-- END GENERATED cordis-surface -->

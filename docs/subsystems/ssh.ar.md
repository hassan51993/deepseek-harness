# SSH

[English](ssh.md) | العربية

[SSH مزود بيت عائلة](../../packages/ssh/README.ar.md) عبر نشر جهة يحتفظ OpenSSH اتصال توفير واحد بعيد طرف نظام الملفات/عملية بيئة.Harness، نموذج نقل و Session تخزين إبقاء في رئيسي آلة. هذا بيت عائلة تنفيذ قائم نظام الملفات، عملية فرعية و صندوق رملي API، لا جذب دخول SSH مخصص استخدام نموذج أداة.

## تنفيذ جلوس علامة

نظام الملفات هوية، يمكن تنفيذ ملف فحص بحث، عملية cwd، صندوق رملي مساحة العمل أصل دليل و لغة خادم ملف URL كل إشارة نحو SSH رئيسي آلة. مزود في ملف فعلي وجود موضع مواصفة تحويل مسار، إبقاء نظام الملفات مقابل `symlink/..` حل تفسير. سياسة محلل إبقاء تنفيذ بيئة في قطعا مقابل مسار كتابة قاعدة، لا محاولة تجربة في Harness رئيسي آلة فوق تحليل بعيد طرف مسار.

`processPath()` توفير إعداد طقم عملية فرعية مزود متاح مسار.SSH `processPathFromHostPath()` ما زال غير ممكن استخدام؛ تثبيت بعيد طرف ناتج لا معنى طعم حال مهمة معنى رئيسي آلة مسار يمكن نقل غرس. لذلك [`NodePtcRuntime`](../../packages/ptc-runtime/ptc-runtime-node/README.ar.md) استخدام صريح تثبيت و مرور مرور ملخص تحقق بعيد طرف جذب توجيه برنامج.

## نقل و معلومة مهمة

إدارة RPC استخدام مساعد مساعدة عملية SSH exec تدفق. عادي stdin،stdout،stderr، طرفية إخراج و اختياري fd 7 تحكم تدفق استخدام قسم آخر إقرار إثبات تحويل إرسال Unix طقم وصل حرف. كل بند تحويل إرسال تدفق يملك مستقل SSH عبر طريق نافذة؛ مؤقت توقف برنامج إخراج لا و تحكم أو إدارة رسالة مشترك استخدام نافذة. كل عبر طريق ما زال مشترك اتصال حمل عرض و نقل فشل.

نشر إقرار إثبات، قد تثبيت ناتج تحقق و تدريجي تدفق TLS إقرار إثبات يخص [`dsh-ssh`](../../packages/ssh/ssh/README.ar.md). مساعد مساعدة عملية استخدام بعيد طرف آلة جهاز فوق يمكن معلومة محلي مزود تنفيذ نظام الملفات و عملية طلب.SSH هو نقل طريقة؛ ملف فاعلية نتيجة حد من الذي اختيار بعيد طرف صندوق رملي مزود تنفيذ.

## عملية دورة الحياة و إلغاء

عملية أولا مسبق إبقاء، مجددا اتصال تدفق، كما بدء الأكثر كثير قبول مرة.`done` تقرير إبلاغ مباشر نتيجة،`waitForExit` مراقبة بعيد طرف حمل إدارة عملية نطاق. طرفية عملية إبقاء مشترك مختلف خطوة API. دقيق تجهيز مرحلة مقطع إلغاء، قد بدء عملية إنهاء و مزود تحرير كل عبر مساعد مساعدة عملية تحرير كل منها مورد.

إدارة قطع توقف وقت حد قيد مفرد مرة RPC مراقبة، لا بديل Bash أو PTC وقت التشغيل مستهلك اختيار تنفيذ قطع توقف وقت حد. بعيد طرف انتظار يمكن حمل متابعة تعليق بدء، معا أخرى طلب متابعة دفع دخول.SSH فقد فقد سوف جعل انتظار معالجة عملية بطلان؛ مساعد مساعدة عملية EOF، إشارة و إيجار مدة إلى مدة سوف بدء بعيد طرف تنظيف. عميل مثل فعلي تقرير إبلاغ لم تأكيد نتيجة، أبدا عبر إعادة وصل إعادة وضع ممكن قد تنفيذ عملية.

## تركيب نطاق

headless عبر قد تركيب نظام الملفات مزود سجل و فحص Session cwd. لذلك بعيد طرف FS،Bash، طرفية،LSP و PTC مستهلك يمكن مشترك هذه جلوس علامة. زائف تحديد يمكن وصول رئيسي آلة نظام الملفات Web مساحة العمل عرض حاجة مفرد وحيد تجميع صار؛ فقط استبدال مزود و لن جعل هذه عرض دعم حمل بعيد طرف.

بديل خطة و تحقق مسؤولية مهمة رؤية[قرار سجل](../../.agents/notes/implemented/architecture/2026-09-11-posix-ssh-runtime.ar.md).

## اتصال API

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

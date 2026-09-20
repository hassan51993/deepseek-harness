<!-- النصُّ الإنجليزي مولَّد من scripts/gen-doc-graphs.ts؛ وهذا الملف العربي يُصان يدويًا ويُقرن به عبر سجل الاقتران الثنائي اللغة.
     عند التحديث، شغّل `pnpm run gen-doc-graphs` أولًا لتحديث النص الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/capability-seams.md` لإعادة تسجيل الاقتران. -->

# seams القدرات وخدمات النواة

[English](capability-seams.md) | العربية

قد تكون الخدمةُ خدمةَ عمود في النواة، أو seam قدرة قابلًا للاستبدال، أو نقطةَ حزمة أو تركيب. ويعرض الرسمُ الحزمةَ التي تملك تصريحَ الخدمة، وحزمَ التنفيذ المعروفة، والحزمَ التي تستهلك الخدمةَ مباشرةً.

```mermaid
flowchart LR
  pkg_hmr["hmr"]
  svc_hmr["ctx.hmr<br/>Serialized module and configuration reloads"]
  pkg_app_boot["app-boot"]
  pkg_plugin_manager["plugin-manager"]
  svc_pluginManager["ctx.pluginManager<br/>Current-profile plugin and bundle management"]
  pkg_ui_settings_plugin_inventory["ui-settings-plugin-inventory"]
  svc_profileContext["ctx.profileContext<br/>Launcher-owned profile data"]
  pkg_client_connection["client-connection"]
  svc_connection["ctx.connection<br/>Authenticated browser transport"]
  pkg_api_gateway["api-gateway"]
  pkg_host_frontend_static["host-frontend-static"]
  pkg_mcp_resources["mcp-resources"]
  svc_mcpResources["ctx.mcpResources<br/>Scoped MCP resource access"]
  pkg_mcp_client["mcp-client"]
  pkg_browser_use["browser-use"]
  svc_browserUse["ctx.browserUse<br/>Browser-use provider registration"]
  pkg_experimental_browser_use_playwright_mcp["experimental-browser-use-playwright-mcp"]
  pkg_experimental_browser_use_chrome_devtools_mcp["experimental-browser-use-chrome-devtools-mcp"]
  pkg_experimental_browser_use_stagehand_native["experimental-browser-use-stagehand-native"]
  pkg_computer_use["computer-use"]
  svc_computerUse["ctx.computerUse<br/>Computer-use provider registration"]
  pkg_experimental_computer_use_cua_driver_mcp["experimental-computer-use-cua-driver-mcp"]
  pkg_experimental_computer_use_cua_driver_native["experimental-computer-use-cua-driver-native"]
  pkg_office_to_pdf["office-to-pdf"]
  svc_officeToPdf["ctx.officeToPdf<br/>Office to PDF conversion"]
  pkg_client_ui_sidebar_documentpreview["client-ui-sidebar-documentpreview"]
  pkg_attachment["attachment"]
  svc_attachments["ctx.attachments<br/>Durable binary attachment storage"]
  pkg_attachment_local["attachment-local"]
  pkg_api_session_controller["api-session-controller"]
  pkg_tool_fs["tool-fs"]
  pkg_llm_pi_ai["llm-pi-ai"]
  pkg_llm_deepseek["llm-deepseek"]
  pkg_client_file_upload["client-file-upload"]
  svc_fileUploads["ctx.fileUploads<br/>Agent-scoped staged file uploads"]
  pkg_llm["llm"]
  svc_llm["ctx.llm<br/>LLM adapter registry"]
  pkg_llm_replay["llm-replay"]
  pkg_agent_loop["agent-loop"]
  pkg_compaction_basic["compaction-basic"]
  pkg_deepseek_llm_api_extensions["deepseek-llm-api-extensions"]
  svc_deepseekLlmApiExtensions["ctx.deepseekLlmApiExtensions<br/>Official DeepSeek request extensions"]
  pkg_session_log_deepseek["session-log-deepseek"]
  pkg_plugin_package_inventory_deepseek["plugin-package-inventory-deepseek"]
  pkg_token_meter["token-meter"]
  svc_tokenMeter["ctx.tokenMeter<br/>Replay token measurement"]
  pkg_compaction_tool_result_pruner["compaction-tool-result-pruner"]
  svc_toolResultPruner["ctx.toolResultPruner<br/>Model-free tool-result pruning"]
  pkg_session["session"]
  svc_sessions["ctx.sessions<br/>In-memory session store"]
  pkg_agent["agent"]
  pkg_session_persistence["session-persistence"]
  pkg_session_query["session-query"]
  pkg_session_query_sqlite["session-query-sqlite"]
  pkg_subagent_in_process_driver["subagent-in-process-driver"]
  pkg_invariants["invariants"]
  pkg_message_feedback["message-feedback"]
  svc_sessionController["ctx.sessionController<br/>Host Session Remote controller"]
  svc_sessionFileReferences["ctx.sessionFileReferences<br/>Session-addressed file-reference Remote adapter"]
  svc_sessionSkillCatalog["ctx.sessionSkillCatalog<br/>Session-addressed skill Remote adapter"]
  pkg_api_settings_controller["api-settings-controller"]
  svc_credentialsController["ctx.credentialsController<br/>Host credential-surface Remote controller"]
  svc_settingsController["ctx.settingsController<br/>Host settings-surface Remote controller"]
  pkg_api_workspace_files["api-workspace-files"]
  svc_workspaceFiles["ctx.workspaceFiles<br/>Host workspace file Remote service"]
  pkg_workspace_changes["workspace-changes"]
  svc_workspaceChanges["ctx.workspaceChanges<br/>Host per-turn changed-file summaries"]
  pkg_api_terminal_controller["api-terminal-controller"]
  svc_terminalController["ctx.terminalController<br/>Session interactive terminal Remote controller"]
  pkg_api_workspace_controller["api-workspace-controller"]
  svc_workspaceController["ctx.workspaceController<br/>Host Workspace Remote controller"]
  svc_directoryPickerController["ctx.directoryPickerController<br/>Host directory-picking Remote controller"]
  svc_invariants["ctx.invariants<br/>Package-owned invariant registry"]
  pkg_scope["scope"]
  pkg_typert_registry["typert-registry"]
  svc_typert["ctx.typert<br/>Runtime type registry"]
  pkg_typert_loader["typert-loader"]
  svc_typertGateway["ctx.typertGateway<br/>Typert Host invocation gateway"]
  svc_sessionPersistence["ctx.sessionPersistence<br/>Durable session persistence seam"]
  pkg_session_persistence_jsonl["session-persistence-jsonl"]
  pkg_tool_bash["tool-bash"]
  pkg_hooks_claude_code["hooks-claude-code"]
  pkg_hooks_codex["hooks-codex"]
  pkg_settings["settings"]
  svc_settings["ctx.settings<br/>User-settings seam"]
  pkg_settings_file["settings-file"]
  pkg_tool_subagent["tool-subagent"]
  svc_subagentModelSelection["ctx.subagentModelSelection<br/>Subagent model-selection preference"]
  pkg_credentials["credentials"]
  svc_credentials["ctx.credentials<br/>Credential seam"]
  pkg_credentials_local["credentials-local"]
  pkg_authorization["authorization"]
  svc_authorization["ctx.authorization<br/>Authorization flow registry"]
  pkg_session_telemetry["session-telemetry"]
  svc_sessionTelemetry["ctx.sessionTelemetry<br/>Session telemetry seam"]
  pkg_session_telemetry_otel["session-telemetry-otel"]
  pkg_storage["storage"]
  svc_storage["ctx.storage<br/>Non-session storage hub"]
  pkg_storage_json["storage-json"]
  pkg_storage_sqlite["storage-sqlite"]
  pkg_storage_domain["storage-domain"]
  svc_storageDomain["ctx.storageDomain<br/>Domain data facility"]
  pkg_workspace["workspace"]
  svc_messageFeedback["ctx.messageFeedback<br/>Lifecycle-bound message feedback"]
  pkg_command_feedback["command-feedback"]
  svc_sessionFeedback["ctx.sessionFeedback<br/>Session-level feedback recorder"]
  svc_workspaceRegistry["ctx.workspaceRegistry<br/>Workspace entity registry"]
  svc_sessionQuery["ctx.sessionQuery<br/>Session reads, traces, filters, and search"]
  pkg_session_reference["session-reference"]
  pkg_tool_session_query["tool-session-query"]
  pkg_file_reference["file-reference"]
  svc_fileReferences["ctx.fileReferences<br/>File reference discovery"]
  pkg_file_reference_local["file-reference-local"]
  svc_sessionReferenceResolver["ctx.sessionReferenceResolver<br/>Cross-session snapshot preparation"]
  pkg_session_title["session-title"]
  svc_sessionTitle["ctx.sessionTitle<br/>Log-backed session titles"]
  pkg_session_title_first_prompt_llm["session-title-first-prompt-llm"]
  pkg_session_title_all_prompts_llm["session-title-all-prompts-llm"]
  pkg_system_prompt["system-prompt"]
  svc_systemPrompt["ctx.systemPrompt<br/>System prompt assembly registry"]
  pkg_tools["tools"]
  pkg_tool_terminal["tool-terminal"]
  pkg_tool_web["tool-web"]
  svc_tools["ctx.tools<br/>Tool registry and guarded execution pipeline"]
  pkg_tool_ask_user["tool-ask-user"]
  pkg_tool_cordis["tool-cordis"]
  pkg_tool_skill["tool-skill"]
  pkg_tool_todo["tool-todo"]
  pkg_user_questions["user-questions"]
  svc_userQuestions["ctx.userQuestions<br/>Human question/answer seam"]
  pkg_plan_mode["plan-mode"]
  svc_planMode["ctx.planMode<br/>Plan collaboration state"]
  pkg_agent_presets["agent-presets"]
  svc_agentPresets["ctx.agentPresets<br/>Per-session agent composition"]
  pkg_commands["commands"]
  svc_commands["ctx.commands<br/>Human command registry"]
  pkg_session_projection["session-projection"]
  svc_sessionProjections["ctx.sessionProjections<br/>Session projection units"]
  pkg_session_projection_cache["session-projection-cache"]
  svc_sessionProjectionCache["ctx.sessionProjectionCache<br/>Persisted projection cache"]
  pkg_subagent["subagent"]
  pkg_skill["skill"]
  svc_skills["ctx.skills<br/>Skill provider registry"]
  pkg_skill_badge["skill-badge"]
  pkg_skill_filesystem["skill-filesystem"]
  pkg_skill_office["skill-office"]
  svc_agents["ctx.agents<br/>Agent service"]
  pkg_acp["acp"]
  pkg_agent_default_model["agent-default-model"]
  svc_agentDefaultModel["ctx.agentDefaultModel<br/>Default Agent model selection"]
  pkg_headless["headless"]
  svc_agentLoop["ctx.agentLoop<br/>Concrete loop driver"]
  pkg_base["base"]
  pkg_sdk_minimal["sdk-minimal"]
  pkg_goal["goal"]
  svc_goals["ctx.goals<br/>Same-session goal domain"]
  pkg_ssh["ssh"]
  svc_ssh["ctx.ssh<br/>POSIX SSH connection owner"]
  pkg_fs_ssh["fs-ssh"]
  pkg_subprocess_ssh["subprocess-ssh"]
  pkg_sandbox_ssh["sandbox-ssh"]
  pkg_subprocess["subprocess"]
  svc_subprocess["ctx.subprocess<br/>Subprocess seam"]
  pkg_subprocess_local["subprocess-local"]
  pkg_bash_local["bash-local"]
  pkg_bash_sandbox["bash-sandbox"]
  pkg_terminal_bash["terminal-bash"]
  pkg_lsp_stdio["lsp-stdio"]
  pkg_subagent_acp["subagent-acp"]
  pkg_subagent_codex["subagent-codex"]
  pkg_subagent_claude_code["subagent-claude-code"]
  pkg_shell["shell"]
  svc_shell["ctx.shell<br/>Bash executor seam"]
  pkg_pwsh_local["pwsh-local"]
  pkg_tool_pwsh["tool-pwsh"]
  pkg_shell_env["shell-env"]
  svc_shellEnv["ctx.shellEnv<br/>Managed bash environment registry"]
  pkg_terminal["terminal"]
  svc_terminals["ctx.terminals<br/>Persistent PTY session registry"]
  pkg_sandbox["sandbox"]
  svc_sandbox["ctx.sandbox<br/>Process-sandbox seam"]
  pkg_sandbox_local["sandbox-local"]
  pkg_sandbox_policy["sandbox-policy"]
  svc_sandboxPolicy["ctx.sandboxPolicy<br/>Sandbox policy home"]
  pkg_fs_sandbox["fs-sandbox"]
  pkg_user_approval["user-approval"]
  svc_approval["ctx.approval<br/>Approval seam"]
  pkg_permission_presets["permission-presets"]
  svc_permissionPresets["ctx.permissionPresets<br/>Permission presets"]
  pkg_ptc_runtime["ptc-runtime"]
  svc_ptcRuntime["ctx.ptcRuntime<br/>PTC execution seam"]
  pkg_ptc_runtime_node["ptc-runtime-node"]
  pkg_experimental_ptc_runtime_python["experimental-ptc-runtime-python"]
  pkg_workflow_ptc["workflow-ptc"]
  pkg_fs["fs"]
  svc_fs["ctx.fs<br/>Filesystem provider seam"]
  pkg_fs_local["fs-local"]
  pkg_fs_observation_policy["fs-observation-policy"]
  pkg_compaction["compaction"]
  svc_compaction["ctx.compaction<br/>Compaction seam"]
  svc_subagents["ctx.subagents<br/>Subagent provider and continuation service"]
  pkg_subagent_spawn_in_process["subagent-spawn-in-process"]
  pkg_subagent_fork_in_process["subagent-fork-in-process"]
  pkg_subagent_dsh_sdk["subagent-dsh-sdk"]
  pkg_tool_subagent_control["tool-subagent-control"]
  pkg_tool_ralph["tool-ralph"]
  pkg_experimental_agent_team["experimental-agent-team"]
  svc_agentTeams["ctx.agentTeams<br/>Agent Teams coordination domain"]
  pkg_experimental_tool_agent_team["experimental-tool-agent-team"]
  pkg_experimental_client_ui_agent_team["experimental-client-ui-agent-team"]
  pkg_inspector["inspector"]
  svc_inspector["ctx.inspector<br/>Cross-realm runtime inspection"]
  pkg_jobs["jobs"]
  svc_jobs["ctx.jobs<br/>Background job registry"]
  pkg_jobs_local["jobs-local"]
  pkg_tool_jobs["tool-jobs"]
  pkg_web["web"]
  svc_web["ctx.web<br/>Web access provider registry"]
  pkg_web_search_exa["web-search-exa"]
  pkg_web_search_perplexity["web-search-perplexity"]
  pkg_web_search_deepseek["web-search-deepseek"]
  pkg_web_fetch_http["web-fetch-http"]
  pkg_spill["spill"]
  svc_spillStore["ctx.spillStore<br/>Spill storage seam"]
  pkg_spill_local["spill-local"]
  pkg_spill_policy["spill-policy"]
  pkg_host_directory_picker["host-directory-picker"]
  svc_directoryPicker["ctx.directoryPicker<br/>Workspace-directory picking seam"]
  pkg_host_directory_picker_native["host-directory-picker-native"]
  pkg_host_directory_picker_browse["host-directory-picker-browse"]
  pkg_host_webserver["host-webserver"]
  svc_webServer["ctx.webServer<br/>HTTP route registration"]
  pkg_client_modules["client-modules"]
  pkg_client_hmr["client-hmr"]
  svc_clientModules["ctx.clientModules<br/>Client plugin graph host"]
  pkg_workflow["workflow"]
  svc_workflowEngine["ctx.workflowEngine<br/>Workflow script engine"]
  pkg_tool_workflow["tool-workflow"]
  pkg_webhook["webhook"]
  svc_webhookRuntime["ctx.webhookRuntime<br/>Webhook rule runtime"]
  pkg_webhook_github["webhook-github"]
  pkg_lsp["lsp"]
  svc_lsp["ctx.lsp<br/>Language-server navigation seam"]
  pkg_tool_lsp["tool-lsp"]
  pkg_cordis_host_runner["cordis-host-runner"]
  svc_dynamicCordisRunner["ctx.dynamicCordisRunner<br/>Dynamic Cordis package host runner"]
  svc_cordisInspect["ctx.cordisInspect<br/>Dynamic Cordis inspect registry"]
  pkg_agent --> svc_agents
  pkg_agent_default_model --> svc_agentDefaultModel
  pkg_agent_loop --> svc_agentLoop
  pkg_agent_presets --> svc_agentPresets
  pkg_api_gateway --> svc_typertGateway
  pkg_api_session_controller --> svc_sessionController
  pkg_api_session_controller --> svc_sessionFileReferences
  pkg_api_session_controller --> svc_sessionSkillCatalog
  pkg_api_settings_controller --> svc_credentialsController
  pkg_api_settings_controller --> svc_settingsController
  pkg_api_terminal_controller --> svc_terminalController
  pkg_api_workspace_controller --> svc_directoryPickerController
  pkg_api_workspace_controller --> svc_workspaceController
  pkg_api_workspace_files --> svc_workspaceFiles
  pkg_app_boot --> svc_profileContext
  pkg_attachment --> svc_attachments
  pkg_attachment_local --> svc_attachments
  pkg_authorization --> svc_authorization
  pkg_bash_local --> svc_shell
  pkg_bash_sandbox --> svc_shell
  pkg_browser_use --> svc_browserUse
  pkg_client_connection --> svc_connection
  pkg_client_file_upload --> svc_fileUploads
  pkg_client_modules --> svc_clientModules
  pkg_command_feedback --> svc_sessionFeedback
  pkg_commands --> svc_commands
  pkg_compaction --> svc_compaction
  pkg_compaction_basic --> svc_compaction
  pkg_compaction_tool_result_pruner --> svc_toolResultPruner
  pkg_computer_use --> svc_computerUse
  pkg_cordis_host_runner --> svc_cordisInspect
  pkg_cordis_host_runner --> svc_dynamicCordisRunner
  pkg_credentials --> svc_credentials
  pkg_credentials_local --> svc_credentials
  pkg_deepseek_llm_api_extensions --> svc_deepseekLlmApiExtensions
  pkg_experimental_agent_team --> svc_agentTeams
  pkg_experimental_browser_use_chrome_devtools_mcp --> svc_browserUse
  pkg_experimental_browser_use_playwright_mcp --> svc_browserUse
  pkg_experimental_browser_use_stagehand_native --> svc_browserUse
  pkg_experimental_computer_use_cua_driver_mcp --> svc_computerUse
  pkg_experimental_computer_use_cua_driver_native --> svc_computerUse
  pkg_experimental_ptc_runtime_python --> svc_ptcRuntime
  pkg_file_reference --> svc_fileReferences
  pkg_file_reference_local --> svc_fileReferences
  pkg_fs --> svc_fs
  pkg_fs_local --> svc_fs
  pkg_fs_sandbox --> svc_fs
  pkg_fs_ssh --> svc_fs
  pkg_goal --> svc_goals
  pkg_hmr --> svc_hmr
  pkg_host_directory_picker --> svc_directoryPicker
  pkg_host_directory_picker_browse --> svc_directoryPicker
  pkg_host_directory_picker_native --> svc_directoryPicker
  pkg_host_webserver --> svc_webServer
  pkg_inspector --> svc_inspector
  pkg_invariants --> svc_invariants
  pkg_jobs --> svc_jobs
  pkg_jobs_local --> svc_jobs
  pkg_llm --> svc_llm
  pkg_llm_deepseek --> svc_llm
  pkg_llm_pi_ai --> svc_llm
  pkg_llm_replay --> svc_llm
  pkg_lsp --> svc_lsp
  pkg_lsp_stdio --> svc_lsp
  pkg_mcp_client --> svc_mcpResources
  pkg_mcp_resources --> svc_mcpResources
  pkg_message_feedback --> svc_messageFeedback
  pkg_office_to_pdf --> svc_officeToPdf
  pkg_permission_presets --> svc_permissionPresets
  pkg_plan_mode --> svc_planMode
  pkg_plugin_manager --> svc_pluginManager
  pkg_plugin_package_inventory_deepseek --> svc_deepseekLlmApiExtensions
  pkg_ptc_runtime --> svc_ptcRuntime
  pkg_ptc_runtime_node --> svc_ptcRuntime
  pkg_pwsh_local --> svc_shell
  pkg_sandbox --> svc_sandbox
  pkg_sandbox_local --> svc_sandbox
  pkg_sandbox_policy --> svc_sandboxPolicy
  pkg_sandbox_ssh --> svc_sandbox
  pkg_session --> svc_sessions
  pkg_session_log_deepseek --> svc_deepseekLlmApiExtensions
  pkg_session_persistence --> svc_sessionPersistence
  pkg_session_persistence_jsonl --> svc_sessionPersistence
  pkg_session_projection --> svc_sessionProjections
  pkg_session_projection_cache --> svc_sessionProjectionCache
  pkg_session_query --> svc_sessionQuery
  pkg_session_query_sqlite --> svc_sessionQuery
  pkg_session_reference --> svc_sessionReferenceResolver
  pkg_session_telemetry --> svc_sessionTelemetry
  pkg_session_telemetry_otel --> svc_sessionTelemetry
  pkg_session_title --> svc_sessionTitle
  pkg_session_title_all_prompts_llm --> svc_sessionTitle
  pkg_session_title_first_prompt_llm --> svc_sessionTitle
  pkg_settings --> svc_settings
  pkg_settings_file --> svc_settings
  pkg_shell --> svc_shell
  pkg_shell_env --> svc_shellEnv
  pkg_skill --> svc_skills
  pkg_skill_badge --> svc_skills
  pkg_skill_filesystem --> svc_skills
  pkg_skill_office --> svc_skills
  pkg_spill --> svc_spillStore
  pkg_spill_local --> svc_spillStore
  pkg_ssh --> svc_ssh
  pkg_storage --> svc_storage
  pkg_storage_domain --> svc_storageDomain
  pkg_storage_json --> svc_storage
  pkg_storage_sqlite --> svc_storage
  pkg_subagent --> svc_subagents
  pkg_subagent_acp --> svc_subagents
  pkg_subagent_claude_code --> svc_subagents
  pkg_subagent_codex --> svc_subagents
  pkg_subagent_dsh_sdk --> svc_subagents
  pkg_subagent_fork_in_process --> svc_subagents
  pkg_subagent_spawn_in_process --> svc_subagents
  pkg_subprocess --> svc_subprocess
  pkg_subprocess_local --> svc_subprocess
  pkg_subprocess_ssh --> svc_subprocess
  pkg_system_prompt --> svc_systemPrompt
  pkg_terminal --> svc_terminals
  pkg_terminal_bash --> svc_terminals
  pkg_token_meter --> svc_tokenMeter
  pkg_tool_subagent --> svc_subagentModelSelection
  pkg_tools --> svc_tools
  pkg_typert_registry --> svc_typert
  pkg_user_approval --> svc_approval
  pkg_user_questions --> svc_userQuestions
  pkg_web --> svc_web
  pkg_web_fetch_http --> svc_web
  pkg_web_search_deepseek --> svc_web
  pkg_web_search_exa --> svc_web
  pkg_web_search_perplexity --> svc_web
  pkg_webhook --> svc_webhookRuntime
  pkg_workflow --> svc_workflowEngine
  pkg_workflow_ptc --> svc_workflowEngine
  pkg_workspace --> svc_workspaceRegistry
  pkg_workspace_changes --> svc_workspaceChanges
  svc_agentDefaultModel --> pkg_api_session_controller
  svc_agentDefaultModel --> pkg_headless
  svc_agentLoop --> pkg_base
  svc_agentLoop --> pkg_sdk_minimal
  svc_agentTeams --> pkg_experimental_client_ui_agent_team
  svc_agentTeams --> pkg_experimental_tool_agent_team
  svc_agents --> pkg_acp
  svc_agents --> pkg_agent_loop
  svc_agents --> pkg_subagent_in_process_driver
  svc_approval --> pkg_acp
  svc_approval --> pkg_tool_bash
  svc_approval --> pkg_tools
  svc_attachments --> pkg_api_session_controller
  svc_attachments --> pkg_llm_deepseek
  svc_attachments --> pkg_llm_pi_ai
  svc_attachments --> pkg_tool_fs
  svc_authorization --> pkg_llm_pi_ai
  svc_browserUse --> pkg_experimental_browser_use_chrome_devtools_mcp
  svc_browserUse --> pkg_experimental_browser_use_playwright_mcp
  svc_browserUse --> pkg_experimental_browser_use_stagehand_native
  svc_clientModules --> pkg_client_hmr
  svc_compaction --> pkg_compaction_basic
  svc_computerUse --> pkg_experimental_computer_use_cua_driver_mcp
  svc_computerUse --> pkg_experimental_computer_use_cua_driver_native
  svc_connection --> pkg_api_gateway
  svc_connection --> pkg_host_frontend_static
  svc_cordisInspect --> pkg_tool_cordis
  svc_credentials --> pkg_api_settings_controller
  svc_credentials --> pkg_llm_deepseek
  svc_credentials --> pkg_llm_pi_ai
  svc_deepseekLlmApiExtensions --> pkg_llm_deepseek
  svc_directoryPicker --> pkg_api_workspace_controller
  svc_dynamicCordisRunner --> pkg_tool_cordis
  svc_fileReferences --> pkg_api_session_controller
  svc_fileUploads --> pkg_api_session_controller
  svc_fs --> pkg_tool_fs
  svc_hmr --> pkg_app_boot
  svc_invariants --> pkg_agent
  svc_invariants --> pkg_agent_loop
  svc_invariants --> pkg_scope
  svc_invariants --> pkg_session
  svc_jobs --> pkg_tool_bash
  svc_jobs --> pkg_tool_jobs
  svc_jobs --> pkg_tool_subagent
  svc_jobs --> pkg_tool_terminal
  svc_llm --> pkg_agent_loop
  svc_llm --> pkg_compaction_basic
  svc_lsp --> pkg_tool_lsp
  svc_mcpResources --> pkg_mcp_resources
  svc_officeToPdf --> pkg_client_ui_sidebar_documentpreview
  svc_pluginManager --> pkg_plugin_manager
  svc_pluginManager --> pkg_ui_settings_plugin_inventory
  svc_profileContext --> pkg_plugin_manager
  svc_ptcRuntime --> pkg_tools
  svc_ptcRuntime --> pkg_workflow_ptc
  svc_sandbox --> pkg_bash_sandbox
  svc_sandbox --> pkg_terminal_bash
  svc_sandboxPolicy --> pkg_bash_sandbox
  svc_sandboxPolicy --> pkg_fs_sandbox
  svc_sandboxPolicy --> pkg_terminal_bash
  svc_sessionPersistence --> pkg_agent_loop
  svc_sessionPersistence --> pkg_hooks_claude_code
  svc_sessionPersistence --> pkg_hooks_codex
  svc_sessionPersistence --> pkg_message_feedback
  svc_sessionPersistence --> pkg_session_query
  svc_sessionPersistence --> pkg_session_query_sqlite
  svc_sessionPersistence --> pkg_tool_bash
  svc_sessionProjectionCache --> pkg_api_session_controller
  svc_sessionProjectionCache --> pkg_session_query
  svc_sessionProjectionCache --> pkg_session_reference
  svc_sessionProjectionCache --> pkg_subagent
  svc_sessionProjections --> pkg_api_session_controller
  svc_sessionProjections --> pkg_session_title
  svc_sessionProjections --> pkg_tool_todo
  svc_sessionQuery --> pkg_session_reference
  svc_sessionQuery --> pkg_tool_session_query
  svc_sessions --> pkg_agent
  svc_sessions --> pkg_agent_loop
  svc_sessions --> pkg_invariants
  svc_sessions --> pkg_message_feedback
  svc_sessions --> pkg_session_persistence
  svc_sessions --> pkg_session_query
  svc_sessions --> pkg_session_query_sqlite
  svc_sessions --> pkg_subagent_in_process_driver
  svc_settings --> pkg_api_settings_controller
  svc_settings --> pkg_llm_deepseek
  svc_settings --> pkg_llm_pi_ai
  svc_shell --> pkg_hooks_claude_code
  svc_shell --> pkg_hooks_codex
  svc_shell --> pkg_tool_bash
  svc_shell --> pkg_tool_pwsh
  svc_shellEnv --> pkg_tool_bash
  svc_shellEnv --> pkg_tool_pwsh
  svc_skills --> pkg_tool_skill
  svc_spillStore --> pkg_spill_policy
  svc_ssh --> pkg_fs_ssh
  svc_ssh --> pkg_sandbox_ssh
  svc_ssh --> pkg_subprocess_ssh
  svc_storage --> pkg_storage_domain
  svc_storageDomain --> pkg_workspace
  svc_subagentModelSelection --> pkg_tool_subagent
  svc_subagents --> pkg_tool_ralph
  svc_subagents --> pkg_tool_subagent
  svc_subagents --> pkg_tool_subagent_control
  svc_subprocess --> pkg_bash_local
  svc_subprocess --> pkg_bash_sandbox
  svc_subprocess --> pkg_lsp_stdio
  svc_subprocess --> pkg_subagent_acp
  svc_subprocess --> pkg_subagent_claude_code
  svc_subprocess --> pkg_subagent_codex
  svc_subprocess --> pkg_terminal_bash
  svc_systemPrompt --> pkg_agent_loop
  svc_systemPrompt --> pkg_tool_fs
  svc_systemPrompt --> pkg_tool_terminal
  svc_systemPrompt --> pkg_tool_web
  svc_systemPrompt --> pkg_tools
  svc_terminals --> pkg_tool_terminal
  svc_tokenMeter --> pkg_compaction_basic
  svc_toolResultPruner --> pkg_compaction_basic
  svc_tools --> pkg_agent_loop
  svc_tools --> pkg_tool_ask_user
  svc_tools --> pkg_tool_bash
  svc_tools --> pkg_tool_cordis
  svc_tools --> pkg_tool_fs
  svc_tools --> pkg_tool_skill
  svc_tools --> pkg_tool_subagent
  svc_tools --> pkg_tool_terminal
  svc_tools --> pkg_tool_todo
  svc_tools --> pkg_tool_web
  svc_typert --> pkg_api_gateway
  svc_typert --> pkg_typert_loader
  svc_userQuestions --> pkg_tool_ask_user
  svc_web --> pkg_tool_web
  svc_webServer --> pkg_client_connection
  svc_webServer --> pkg_client_hmr
  svc_webServer --> pkg_client_modules
  svc_webhookRuntime --> pkg_webhook_github
  svc_workflowEngine --> pkg_tool_ralph
  svc_workflowEngine --> pkg_tool_workflow
  svc_workspaceRegistry --> pkg_api_session_controller
  svc_workspaceRegistry --> pkg_api_workspace_controller
  svc_fs -. event gate .-> pkg_fs_observation_policy
```

| مفتاح ctx | الدور | الحزمة المالكة | التنفيذات | المستهلكون المباشرون | الإضافات الرفيقة | ملاحظة |
| --- | --- | --- | --- | --- | --- | --- |
| `ctx.hmr` | `core` | [`hmr`](../packages/boot/hmr) | - | [`app-boot`](../packages/boot/app-boot) | - | يملك مراقبي الوحدات والضبط بعينه؛ وتتشارك تغييراتُ التطبيق طابورَه، وتنتظر إعاداتُ التحميل التلقائية قفلَ ملف التطبيق. |
| `ctx.pluginManager` | `core` | [`plugin-manager`](../packages/boot/plugin-manager) | - | [`plugin-manager`](../packages/boot/plugin-manager), `ui-settings-plugin-inventory` | - | يتشارك عملياتِ حزم الملف التعريفي مع CLI، ويبلّغ مستدعي Web والوكلاء بالحالة المحفوظة والحالة العاملة. |
| `ctx.profileContext` | `core` | [`app-boot`](../packages/boot/app-boot) | - | [`plugin-manager`](../packages/boot/plugin-manager) | - | يقدّم مُقلِعُ dsh مواضعَ ملفات تعريفية ومُدخَلاتِ تركيب بيانيةً فقط؛ وجدولةُ إعادة التحميل تخص dsh-hmr. |
| `ctx.connection` | `core` | [`client-connection`](../packages/client/connection) | - | [`api-gateway`](../packages/api/gateway), [`host-frontend-static`](../packages/host/frontend-static) | - | يملك توثيقَ المتصفح وتوزيعَ طلبات HTTP المشترك؛ وتسجّل مهايئاتُ الواجهة البرمجية نقاطَ النهاية والمجاري. |
| `ctx.mcpResources` | `seam` | [`mcp-resources`](../packages/mcp/mcp-resources) | [`mcp-client`](../packages/mcp/mcp-client) | [`mcp-resources`](../packages/mcp/mcp-resources) | - | يقدّم المزوّدون الذين تملكهم الوصلةُ أدواتِ الموارد المشتركة في نطاق الوكيل المستدعي. |
| `ctx.browserUse` | `seam` | [`browser-use`](../packages/browser-use/browser-use) | [`experimental-browser-use-playwright-mcp`](../packages/experimental/browser-use-playwright-mcp), [`experimental-browser-use-chrome-devtools-mcp`](../packages/experimental/browser-use-chrome-devtools-mcp), [`experimental-browser-use-stagehand-native`](../packages/experimental/browser-use-stagehand-native) | [`experimental-browser-use-playwright-mcp`](../packages/experimental/browser-use-playwright-mcp), [`experimental-browser-use-chrome-devtools-mcp`](../packages/experimental/browser-use-chrome-devtools-mcp), [`experimental-browser-use-stagehand-native`](../packages/experimental/browser-use-stagehand-native) | - | اسمٌ واحد يملكه المزوّد لكل نسخة خدمة. ويملك المزوّدون أدواتِهم وموارد المتصفح لكل جلسة حية؛ ولا واجهةَ عمليات متصفح للخدمة المشتركة. |
| `ctx.computerUse` | `seam` | [`computer-use`](../packages/computer-use/computer-use) | [`experimental-computer-use-cua-driver-mcp`](../packages/experimental/computer-use-cua-driver-mcp), [`experimental-computer-use-cua-driver-native`](../packages/experimental/computer-use-cua-driver-native) | [`experimental-computer-use-cua-driver-mcp`](../packages/experimental/computer-use-cua-driver-mcp), [`experimental-computer-use-cua-driver-native`](../packages/experimental/computer-use-cua-driver-native) | - | اسمٌ واحد يملكه المزوّد لكل نسخة خدمة. ويملك كلُّ مزوّد أدواتِ نموذجه أيضًا؛ ولا واجهةَ أفعال مشتركة للخدمة ولا انتقاءَ وقت تشغيل ولا قفلَ مسار جلسة. |
| `ctx.officeToPdf` | `core` | [`office-to-pdf`](../packages/document/office-to-pdf) | - | [`client-ui-sidebar-documentpreview`](../packages/client/ui-sidebar-documentpreview) | - | تُحوَّل بايتاتُ Office المخوَّلة على المضيف بمحرّك الهدف الأصيل المعلَن، أو بـNode WASM حين لا يُعلَن محرّكٌ أصيل للهدف. |
| `ctx.attachments` | `seam` | [`attachment`](../packages/attachment/attachment) | [`attachment-local`](../packages/attachment/attachment-local) | [`api-session-controller`](../packages/api/session-controller), [`tool-fs`](../packages/fs/tool-fs), [`llm-pi-ai`](../packages/llm/llm-pi-ai), [`llm-deepseek`](../packages/llm/llm-deepseek) | - | يودِع المضيفُ الصورَ المقبولة قبل أحداث الجلسة؛ وتحلّ مهايئاتُ المزوّدين المراجعَ الدائمة المخوَّلة إلى محتوى أصيل لدى المزوّد. |
| `ctx.fileUploads` | `core` | [`client-file-upload`](../packages/client/file-upload) | - | [`api-session-controller`](../packages/api/session-controller) | - | يملك الاستقبالَ المتدفق والتخزينَ الدائم وعمرَ الإيصال المهيَّأ؛ ويربط متحكمُ الجلسة الإيصالاتِ بالتقديمات المقبولة. |
| `ctx.llm` | `seam` | [`llm`](../packages/llm/llm) | [`llm-deepseek`](../packages/llm/llm-deepseek), [`llm-pi-ai`](../packages/llm/llm-pi-ai), [`llm-replay`](../packages/test-support/llm-replay) | [`agent-loop`](../packages/core/agent-loop), [`compaction-basic`](../packages/compaction/compaction-basic) | - | تسجّل المهايئاتُ تنفيذاتِ المزوّدين؛ وتنادي الحلقةُ والضغطُ خدمةَ البث المحايدة تجاه المزوّدين. |
| `ctx.deepseekLlmApiExtensions` | `seam` | [`deepseek-llm-api-extensions`](../packages/llm/deepseek-llm-api-extensions) | [`session-log-deepseek`](../packages/session/session-log-deepseek), [`plugin-package-inventory-deepseek`](../packages/llm/plugin-package-inventory-deepseek) | [`llm-deepseek`](../packages/llm/llm-deepseek) | - | تُعدّ الإضافاتُ حقولًا عليا مستقلة؛ ويدمجها المهايئُ الرسمي ويودِع حالةَ تسليمها بعد قبول HTTP. |
| `ctx.tokenMeter` | `core` | [`token-meter`](../packages/llm/token-meter) | - | [`compaction-basic`](../packages/compaction/compaction-basic) | - | يملك طيّاتِ إعادة تشغيل معزولة لكل جلسة؛ ويتشارك مستهلكو الضغط قياساتٍ موسومة بمراجعات وغيرَ قابلة للتغيير. |
| `ctx.toolResultPruner` | `core` | [`compaction-tool-result-pruner`](../packages/compaction/compaction-tool-result-pruner) | - | [`compaction-basic`](../packages/compaction/compaction-basic) | - | يعيد كتابةَ نتائج الأدوات الحالية المفرطة الحجم عبر استبدالات سطح لعقدة واحدة قابلة لإعادة التشغيل قبل ضغط الملخص. |
| `ctx.sessions` | `core` | [`session`](../packages/core/session) | - | [`agent-loop`](../packages/core/agent-loop), [`agent`](../packages/core/agent), [`session-persistence`](../packages/session/session-persistence), [`session-query`](../packages/session-query/session-query), [`session-query-sqlite`](../packages/session-query/session-query-sqlite), [`subagent-in-process-driver`](../packages/subagent/subagent-in-process-driver), [`invariants`](../packages/runtime-diagnostics/invariants), [`message-feedback`](../packages/feedback/message-feedback) | - | يملك نسخَ الجلسات ذات الإلحاق فقط ويُطلق تغذيةَ أحداث الجلسة الدائمة. |
| `ctx.sessionController` | `core` | [`api-session-controller`](../packages/api/session-controller) | - | - | - | يملك أوامرَ الجلسات والقراءاتِ الباردة ومتابعةَ الأحداث الدائمة وحالةَ التحكم الحية وأدلةَ النماذج وفتحَ مساحات العمل وسياسةَ تفعيل الوكلاء. |
| `ctx.sessionFileReferences` | `core` | [`api-session-controller`](../packages/api/session-controller) | - | - | - | يفوّض اكتشافَ مراجع الملفات عبر سياسة البحث عن الوكيل التي أرساها متحكمُ الجلسة. |
| `ctx.sessionSkillCatalog` | `core` | [`api-session-controller`](../packages/api/session-controller) | - | - | - | يعدّد مهاراتِ تركيب الجلسة القابلة لاستدعاء المستخدم بلا تفعيل وكيل بارد. |
| `ctx.credentialsController` | `core` | [`api-settings-controller`](../packages/api/settings-controller) | - | - | - | يُسقط seam مراجع الاعتمادات على فضاء أسماء Remote المولَّد: فالنشرُ على دفعات وإسقاطُ العرض وربطُ الرفض تعيش هنا لا في تعريف الـseam. |
| `ctx.settingsController` | `core` | [`api-settings-controller`](../packages/api/settings-controller) | - | - | - | يُسقط seam إعدادات المستخدم على فضاء أسماء Remote المولَّد: فالقراءةُ منقَّحة دائمًا وكلُّ رفض مصنَّف هنا لا في تعريف الـseam. |
| `ctx.workspaceFiles` | `core` | [`api-workspace-files`](../packages/api/workspace-files) | - | - | - | يقدّم stat والنصَّ المقسَّم إلى صفحات ونوافذَ البايتات وتعدادَ الأدلة وتغذيةَ التغييرات للملفات داخل جذر مساحة عمل جلسة، محصورةً بـlstat والاحتواء وإعادةِ فحص stat. |
| `ctx.workspaceChanges` | `core` | [`workspace-changes`](../packages/deliverables/workspace-changes) | - | - | - | يقدّم الملخصَ الذي أعلن عنه كلُّ حدث workspace/changes ومقارنةَ كل ملف مدرَج بين بدء الجولة ونهايتها، بالجلسة وبتسلسل الحدث، حتى يُتخلَّص من تلك الجلسة؛ ولا يحمل السجلُّ إلا الجولة. |
| `ctx.terminalController` | `core` | [`api-terminal-controller`](../packages/api/terminal-controller) | - | - | - | يملك عملياتِ طرفية المستخدم وحلَّ الصدفة الافتراضية واستردادَ الشاشة المحدود عبر مزوّد العمليات الفرعية ونقلِ Remote المنوَّع. |
| `ctx.workspaceController` | `core` | [`api-workspace-controller`](../packages/api/workspace-controller) | - | - | - | يملك أوامرَ مساحات العمل وتسليمَ حالتها الآمن مع إعادة الاتصال عبر فضاء أسماء Remote المولَّد. |
| `ctx.directoryPickerController` | `core` | [`api-workspace-controller`](../packages/api/workspace-controller) | - | - | - | يحمل seam الاختيار إلى الشبكة: فحصَ القدرة والإلغاءَ وإخفاقاتِ الـseam المرمَّزة التي يميّز عليها مسارُ اختيار الأدلة في المتصفح. |
| `ctx.invariants` | `core` | [`invariants`](../packages/runtime-diagnostics/invariants) | - | [`session`](../packages/core/session), [`agent`](../packages/core/agent), [`scope`](../packages/core/scope), [`agent-loop`](../packages/core/agent-loop) | - | تسجّل المساراتُ الفرعية الرفيقة فحوصًا محلية لدى مالكها؛ وتملك الخدمةُ الانتقاءَ والتفردَ والأليافَ الأبناء والإخفاقاتِ المنسوبة إلى حزمة. |
| `ctx.typert` | `core` | [`typert-registry`](../packages/typert/registry) | - | [`typert-loader`](../packages/typert/loader), [`api-gateway`](../packages/api/gateway) | - | تسجّل الإضافاتُ إسهاماتِ zod الحية مباشرةً أو عبر dsh-typert-loader؛ وتستهلك بوابةُ الواجهة البرمجية واصفاتِ الاستدعاء والمزوّدين، بينما يستعلم سائرُ مستهلكي وقت التشغيل عن schemas وبيانات الانعكاس الوصفية عند حوافهم. |
| `ctx.typertGateway` | `core` | [`api-gateway`](../packages/api/gateway) | - | - | - | يربط واصفاتِ Remote المولَّدة بخدمات Cordis الحية، ويحلّ الهوياتِ المسجَّلة، ويكشف النداءاتِ الأحادية عبر ناقل RPC المشترك في الوصلة. |
| `ctx.sessionPersistence` | `seam` | [`session-persistence`](../packages/session/session-persistence) | [`session-persistence-jsonl`](../packages/session/session-persistence-jsonl) | [`agent-loop`](../packages/core/agent-loop), [`tool-bash`](../packages/shell/tool-bash), [`hooks-claude-code`](../packages/hooks/hooks-claude-code), [`hooks-codex`](../packages/hooks/hooks-codex), [`session-query`](../packages/session-query/session-query), [`session-query-sqlite`](../packages/session-query/session-query-sqlite), [`message-feedback`](../packages/feedback/message-feedback) | - | تحفظ خلفيةُ JSONL مفرداتِ SessionEvent أثرًا واحدًا لكل جلسة. |
| `ctx.settings` | `seam` | [`settings`](../packages/settings/settings) | [`settings-file`](../packages/settings/settings-file) | [`api-settings-controller`](../packages/api/settings-controller), [`llm-deepseek`](../packages/llm/llm-deepseek), [`llm-pi-ai`](../packages/llm/llm-pi-ai) | - | تسجّل الإضافاتُ schemas فضاءات الأسماء وتحلّ القيمَ الطبقية؛ ويخزّن المزوّدون الوثيقةَ الخام. وتسجّل مهايئاتُ LLM ضبطَ مدخلها طبقةَ أساس للتركيب تحت قسم المستخدم؛ ويقدّم متحكمُ الإعدادات واصفاتٍ طبقية منقَّحة ويكتب طبقةَ المستخدم. |
| `ctx.subagentModelSelection` | `core` | [`tool-subagent`](../packages/subagent/tool-subagent) | - | [`tool-subagent`](../packages/subagent/tool-subagent) | - | يملك فضاءَ أسماء الإعدادات المعطَّل افتراضيًا الذي تأخذ منه أدواتُ التفويض المحدودة بالوكيل عيّنةً حين تركّب جلسةً عليا جديدة. |
| `ctx.credentials` | `seam` | [`credentials`](../packages/credentials/credentials) | [`credentials-local`](../packages/credentials/credentials-local) | [`api-settings-controller`](../packages/api/settings-controller), [`llm-deepseek`](../packages/llm/llm-deepseek), [`llm-pi-ai`](../packages/llm/llm-pi-ai) | - | يحمل الضبطُ مراجعَ إلى الأسرار؛ ويملك المزوّدون القيمَ. ويحلّ المستهلكون لكل عملية، فيبلغ الاعتمادُ المُدوَّر الطلبَ التالي مباشرةً؛ ويكشف متحكمُ الإعدادات عروضًا بلا قيم وتخزينًا للكتابة فقط. |
| `ctx.authorization` | `seam` | [`authorization`](../packages/credentials/authorization) | - | [`llm-pi-ai`](../packages/llm/llm-pi-ai) | - | تسجّل المساراتِ الإضافةُ التي تعرف كيف تحصّل اعتمادًا واحدًا، وتُفهرَس بالسجل الذي تكتبه؛ ويملك الـseam المحادثةَ ودورةَ حياة المحاولة الواحدة لكل مفتاح، لا البروتوكول. |
| `ctx.sessionTelemetry` | `seam` | [`session-telemetry`](../packages/session/session-telemetry) | [`session-telemetry-otel`](../packages/session/session-telemetry-otel) | - | - | يلتقط الـseam سجلاتِ الجلسات وينقّحها ويسلّمها إلى خلفية واحدة؛ ولا يستهلك الخدمةَ شيءٌ آخر — فخرجُها يغادر العملية. |
| `ctx.storage` | `seam` | [`storage`](../packages/storage/storage) | [`storage-json`](../packages/storage/storage-json), [`storage-sqlite`](../packages/storage/storage-sqlite) | [`storage-domain`](../packages/storage/storage-domain) | - | تُسجَّل الخلفياتُ جنبًا إلى جنب بأسماء؛ وتُركَّب صيغُ البيانات (والمجالُ أولًا) على المحور وتترجم العملياتِ المنوَّعة إلى بدائيات وحدات KV معتمة. |
| `ctx.storageDomain` | `core` | [`storage-domain`](../packages/storage/storage-domain) | - | [`workspace`](../packages/workspace/workspace) | - | ينتظر كلَّ خلفية مضبوطة، ثم ينشر صيغةَ المجال خدمةً واحدة مربوطة بدورة حياة للحالة الدائمة المنوَّعة. |
| `ctx.messageFeedback` | `core` | [`message-feedback`](../packages/feedback/message-feedback) | - | - | - | يملك ملاحظاتِ كل رسالة مساعد في سجل الجلسة المعياري، والتحققَ من الهدف، والمقارنةَ والتعيينَ لكل بند، وعقدَ Remote الأحادي في المضيف. وتبقى الملاحظاتُ خارج تاريخ النموذج؛ ويتبع تصديرُ السجل سياسةَ المستهلك. |
| `ctx.sessionFeedback` | `core` | [`command-feedback`](../packages/feedback/command-feedback) | - | - | - | يسجّل ملاحظةً واحدة على مستوى الجلسة مع فئتها حدثَ feedback/record للسجل فقط على جلسة حية عبر عقد Remote الأحادي في المضيف؛ ويتشارك أمرُ /feedback المنتِجَ نفسَه. |
| `ctx.workspaceRegistry` | `core` | [`workspace`](../packages/workspace/workspace) | - | [`api-workspace-controller`](../packages/api/workspace-controller), [`api-session-controller`](../packages/api/session-controller) | - | يملك سجلاتٍ موسومة بـWorkspaceId فوق مرفق المجالات؛ وتقود حساباتُ sessionIds الثابتة RPC المضيف وإسقاطاتِ الواجهة الرسومية. |
| `ctx.sessionQuery` | `seam` | [`session-query`](../packages/session-query/session-query) | [`session-query-sqlite`](../packages/session-query/session-query-sqlite) | [`session-reference`](../packages/context/session-reference), [`tool-session-query`](../packages/session-query/tool-session-query) | - | تقدّم الواجهةُ قراءاتٍ دقيقة ومرشّحاتٍ وتتبعات؛ وتضيف خلفيتُها الملموسة التوفيقَ بالنص الكامل والترتيبَ والمقتطفاتِ وأجيالَ المؤشرات، بينما يملك مستهلكُ النموذج سلطةَ مساحة العمل والعرضَ بلا مؤشرات. |
| `ctx.fileReferences` | `seam` | [`file-reference`](../packages/context/file-reference) | [`file-reference-local`](../packages/context/file-reference-local) | [`api-session-controller`](../packages/api/session-controller) | - | تعيد الواجهةُ مرشحي إكمال مقتصرين على المسارات داخل دليل عمل وكيل؛ ويملك المزوّدون الوصولَ إلى فضاء الأسماء والترتيبَ بلا قراءة محتوى الملفات. |
| `ctx.sessionReferenceResolver` | `core` | [`session-reference`](../packages/context/session-reference) | - | - | - | يُسقط لقطاتِ محادثة محدودة من السطح الحالي في سياق رسائل دائم غير موثوق؛ وتملك مهايئاتُ المضيف نحوَ الإشارة. |
| `ctx.sessionTitle` | `seam` | [`session-title`](../packages/session/session-title) | [`session-title-first-prompt-llm`](../packages/session/session-title-first-prompt-llm), [`session-title-all-prompts-llm`](../packages/session/session-title-all-prompts-llm) | - | - | يملك الاحتياطيَّ الحتمي وطيَّ أحدث عنوان وتسجيلَ المزوّد اللاتزامني الاختياري الوحيد. |
| `ctx.systemPrompt` | `core` | [`system-prompt`](../packages/core/system-prompt) | - | [`agent-loop`](../packages/core/agent-loop), [`tools`](../packages/core/tools), [`tool-fs`](../packages/fs/tool-fs), [`tool-terminal`](../packages/terminal/tool-terminal), [`tool-web`](../packages/web/tool-web) | - | يجمع أقسامَ المطالبة وschemas الأدوات التي يراها النموذجُ لكل خطوة. |
| `ctx.tools` | `core` | [`tools`](../packages/core/tools) | - | [`agent-loop`](../packages/core/agent-loop), [`tool-ask-user`](../packages/interaction/tool-ask-user), [`tool-bash`](../packages/shell/tool-bash), [`tool-cordis`](../packages/extensions/tool-cordis), [`tool-fs`](../packages/fs/tool-fs), [`tool-terminal`](../packages/terminal/tool-terminal), [`tool-skill`](../packages/skill/tool-skill), [`tool-subagent`](../packages/subagent/tool-subagent), [`tool-todo`](../packages/todo/tool-todo), [`tool-web`](../packages/web/tool-web) | - | يسجّل القدراتِ، ويملك نقلَ وضع PTC، ويوجّه النداءاتِ عبر سياسة ما قبل التنفيذ والحرّاسِ التصاعديين ومغلِّفاتِ التوزيع وسياسةِ ما بعد التنفيذ ومراقبةِ النتيجة النهائية. |
| `ctx.userQuestions` | `seam` | [`user-questions`](../packages/interaction/user-questions) | - | [`tool-ask-user`](../packages/interaction/tool-ask-user) | - | تقدّم واجهاتُ المستخدم مزوّدَ إجابات البشر النشط؛ ويوقف tool-ask-user نداءَ أداة على وعد `ask()` المحايد تجاه المزوّدين. |
| `ctx.planMode` | `core` | [`plan-mode`](../packages/plan/plan-mode) | - | - | - | يطوي حالةَ plan/mode المسجَّلة، ويدفع اختياراتِ المستخدم عند حدود الجولات، ويعرض الإرشادَ الذي يملكه النشر، ويسجّل /plan، ويُبقي schema الخروج من الخطة ثابتًا عبر الانتقالات. |
| `ctx.agentPresets` | `core` | [`agent-presets`](../packages/preset/agent-presets) | - | - | - | يكتشف أدلةَ presets فوق جذور موثوقة وأخرى يؤلفها المستخدم، ويركّب ملفَّ cordis.yml واحدًا لـpreset تحت نطاق وكيل أثناء الإنشاء، رافضًا صفًّا لا يُفعَّل قط أو ينشر في عالم الخدمة الجذري. |
| `ctx.commands` | `core` | [`commands`](../packages/interaction/commands) | - | - | - | تسجّل الإضافاتُ أوامرَ بشر مباشرة بلا إرسال الاستدعاءات إلى النموذج. |
| `ctx.sessionProjections` | `core` | [`session-projection`](../packages/session/session-projection) | - | [`api-session-controller`](../packages/api/session-controller), [`tool-todo`](../packages/todo/tool-todo), [`session-title`](../packages/session/session-title) | - | تسجّل المجالاتُ وحداتِ طي مدفوعة بالحالة؛ وتُبقي القيادةُ المتلهّفة حالاتِ علامة مائية لكل جلسة، ويقدّم متحكمُ الجلسة خطوطَ الأساس ويدفع القيمَ المتغيّرة. |
| `ctx.sessionProjectionCache` | `core` | [`session-projection-cache`](../packages/session/session-projection-cache) | - | [`api-session-controller`](../packages/api/session-controller), [`session-query`](../packages/session-query/session-query), [`session-reference`](../packages/context/session-reference), [`subagent`](../packages/subagent/subagent) | - | يحفظ دائمًا نقاطَ تفتيش لحالات وحدات الإسقاط لكل جلسة (بتقييد معدل ونقاطٍ إجبارية عند turn/end والانفصال)، ويقدّم سلّمَ القراءة الباردة: صفَّ المخزن مع إعادة تشغيل ذيل الحفظ الدائم، فلا تحمّل التعداداتُ سجلاتٍ كاملة قط. |
| `ctx.skills` | `seam` | [`skill`](../packages/skill/skill) | [`skill-badge`](../packages/skill/skill-badge), [`skill-filesystem`](../packages/skill/skill-filesystem), [`skill-office`](../packages/skill/skill-office) | [`tool-skill`](../packages/skill/tool-skill) | - | يدمج أدلةَ مهارات المزوّدين؛ ويعرض tool-skill دليلَ بادئة الجلسة ويحمّل متونَ المهارات كاملةً. |
| `ctx.agents` | `core` | [`agent`](../packages/core/agent) | - | [`agent-loop`](../packages/core/agent-loop), [`acp`](../packages/acp/acp), [`subagent-in-process-driver`](../packages/subagent/subagent-in-process-driver) | - | يملك مقابضَ الوكلاء الحية، وseam مصنع الإنشاء والاستئناف، ونشرَ المُبادر المحلي في العملية. |
| `ctx.agentDefaultModel` | `core` | [`agent-default-model`](../packages/core/agent-default-model) | - | [`api-session-controller`](../packages/api/session-controller), [`headless`](../packages/bundle/headless) | - | يطبّق `ModelSelection` الافتراضية طبقةً عبر الإعدادات فيتشارك مدخلا الوكيل المباشر والمسنَد إلى المضيف مالكَ حالة واحدًا. |
| `ctx.agentLoop` | `bundle` | [`agent-loop`](../packages/core/agent-loop) | - | [`base`](../packages/bundle/base), [`sdk-minimal`](../packages/bundle/sdk-minimal) | - | إضافةُ الحلقة الملموسة الوحيدة؛ وتعتمد حزمُ التوسعة على أحداث dsh-agent وخدماته لا على هذه الحزمة. |
| `ctx.goals` | `core` | [`goal`](../packages/goal/goal) | - | - | - | يطوي حالةَ الهدف الموسومة بمراجعات من سجل الجلسة ويُبقي تفعيلَ الاستمرار الحي محليًّا في العملية. |
| `ctx.ssh` | `core` | [`ssh`](../packages/ssh/ssh) | - | [`fs-ssh`](../packages/ssh/fs-ssh), [`subprocess-ssh`](../packages/ssh/subprocess-ssh), [`sandbox-ssh`](../packages/ssh/sandbox-ssh) | - | يملك وصلةَ OpenSSH موثَّقة واحدة، وهويةَ المساعد المثبَّت، ومجاريَ برامج مستقلة، وتنظيفَ الانقطاع للمزوّدين البعيدين المقترنين. |
| `ctx.subprocess` | `seam` | [`subprocess`](../packages/subprocess/subprocess) | [`subprocess-local`](../packages/subprocess/subprocess-local), [`subprocess-ssh`](../packages/ssh/subprocess-ssh) | [`bash-local`](../packages/shell/bash-local), [`bash-sandbox`](../packages/shell/bash-sandbox), [`terminal-bash`](../packages/terminal/terminal-bash), [`lsp-stdio`](../packages/lsp/lsp-stdio), [`subagent-acp`](../packages/subagent/subagent-acp), [`subagent-codex`](../packages/subagent/subagent-codex), [`subagent-claude-code`](../packages/subagent/subagent-claude-code) | - | تُطلق منفّذاتُ bash وخلفيةُ صدفة PTY ومضيفُ LSP وخلفياتُ الوكلاء الفرعيين خارج العملية على ACP وCodex وClaude Code عبر ctx.subprocess؛ وتملك الخدمةُ إحداثياتِ العمليات وعمرَ الشجرة والجلسة وتصرفاتِ stdio وآلياتِ الطرفية وتصعيدَ القتل. |
| `ctx.shell` | `seam` | [`shell`](../packages/shell/shell) | [`bash-local`](../packages/shell/bash-local), [`bash-sandbox`](../packages/shell/bash-sandbox), [`pwsh-local`](../packages/shell/pwsh-local) | [`tool-bash`](../packages/shell/tool-bash), [`tool-pwsh`](../packages/shell/tool-pwsh), [`hooks-claude-code`](../packages/hooks/hooks-claude-code), [`hooks-codex`](../packages/hooks/hooks-codex) | - | تستهلك أدواتُ الصدفة التي يراها النموذجُ وجسورُ الخطّافات هذا الـseam؛ وتحلّ منفّذاتُ العزل أو البعد أو PowerShell محلَّ bash-local بلا مساسها. |
| `ctx.shellEnv` | `core` | [`shell-env`](../packages/shell/shell-env) | - | [`tool-bash`](../packages/shell/tool-bash), [`tool-pwsh`](../packages/shell/tool-pwsh) | - | تعلن الإضافاتُ حقائقَ `DSH_*` محدودةً بالأثر؛ وتجمع كلُّ أداة صدفة لقطةً موثوقة واحدة لكل تنفيذ ويعيد منفّذُها بناءَ فضاء الأسماء. |
| `ctx.terminals` | `seam` | [`terminal`](../packages/terminal/terminal) | [`terminal-bash`](../packages/terminal/terminal-bash) | [`tool-terminal`](../packages/terminal/tool-terminal) | - | يملك السجلُّ هويةَ جلسة الوكيل بعينه وتنظيفَها؛ وتملك الخلفياتُ آلياتِ الطرفية، بينما يكشف tool-terminal أدواتِ النموذج المحدودة بالمالك. |
| `ctx.sandbox` | `seam` | [`sandbox`](../packages/sandbox/sandbox) | [`sandbox-local`](../packages/sandbox/sandbox-local), [`sandbox-ssh`](../packages/ssh/sandbox-ssh) | [`bash-sandbox`](../packages/shell/bash-sandbox), [`terminal-bash`](../packages/terminal/terminal-bash) | - | يسلّم المستهلكون الوسائطَ التي هم على وشك إطلاقها بعينها؛ وتغلّفها خلفياتُ العالم نفسِه تحت سياسة لكل نداء وتبلّغ عن الفرض. |
| `ctx.sandboxPolicy` | `core` | [`sandbox-policy`](../packages/sandbox/sandbox-policy) | - | [`bash-sandbox`](../packages/shell/bash-sandbox), [`fs-sandbox`](../packages/fs/fs-sandbox), [`terminal-bash`](../packages/terminal/terminal-bash) | - | المكانُ الوحيد للوضع الافتراضي في النشر ولجذر مساحة العمل؛ ولا يقرأ الخدمةَ إلا المنفّذُ المعزول والمزوّد (وتستعمل طبقاتُ الأدوات طيَّ `sandbox/mode` النقي الذي يصدّره أيضًا). وتقرؤه العائلتان الفارضتان كلتاهما فلا يستطيع bash وfs الحصرَ في جذرين مختلفين. |
| `ctx.approval` | `seam` | [`user-approval`](../packages/interaction/user-approval) | - | [`tools`](../packages/core/tools), [`tool-bash`](../packages/shell/tool-bash), [`acp`](../packages/acp/acp) | - | قراراتُ إذن لمرة واحدة تُوزَّع عبر شلال `approval/request`؛ والمجيبون مستمعون (وجسرُ ACP لوكلائه)، وغيابُهم يفشل مغلقًا إلى `unavailable`. |
| `ctx.permissionPresets` | `core` | [`permission-presets`](../packages/interaction/permission-presets) | - | - | - | جدولُ presets الذي يراه المستخدم (`workspace-write` و`danger-full-access`) يجمع مقبضَي وضع العزل وسياسةِ الموافقة؛ ويكتب التبديلُ حدثَ `permission/preset` واحدًا ثم يكتب إلى حدثَي المقبضين. |
| `ctx.ptcRuntime` | `seam` | [`ptc-runtime`](../packages/ptc-runtime/ptc-runtime) | [`ptc-runtime-node`](../packages/ptc-runtime/ptc-runtime-node), [`experimental-ptc-runtime-python`](../packages/experimental/ptc-runtime-python) | [`tools`](../packages/core/tools), [`workflow-ptc`](../packages/workflow/workflow-ptc) | - | يشغّل البرامجَ في مقابل ارتباطات لاتزامنية يقدّمها المضيف؛ وتملك الأدواتُ عرضَ PTC ويملك workflow-ptc تنسيقَ مسارات العمل. |
| `ctx.fs` | `seam` | [`fs`](../packages/fs/fs) | [`fs-local`](../packages/fs/fs-local), [`fs-sandbox`](../packages/fs/fs-sandbox), [`fs-ssh`](../packages/ssh/fs-ssh) | [`tool-fs`](../packages/fs/tool-fs) | [`fs-observation-policy`](../packages/fs/fs-observation-policy) | ينفّذ tool-fs القراءةَ والكتابةَ والتحريرَ عبر ctx.fs؛ ويسيّج fs-sandbox التغييراتِ بوضع العزل المشترك؛ ويسهم fs-observation-policy بفحوص الحالة المرصودة عبر بوابة أحداث `fs/*`. |
| `ctx.compaction` | `seam` | [`compaction`](../packages/compaction/compaction) | [`compaction-basic`](../packages/compaction/compaction-basic) | [`compaction-basic`](../packages/compaction/compaction-basic) | - | تستهلك الخلفيةُ الأساسية ضغطَ ما بعد الخطوة وأحداثَ التعافي من أخطاء الطلبات؛ ولا توجد أداةُ ضغط يراها النموذج. |
| `ctx.subagents` | `seam` | [`subagent`](../packages/subagent/subagent) | [`subagent-spawn-in-process`](../packages/subagent/subagent-spawn-in-process), [`subagent-fork-in-process`](../packages/subagent/subagent-fork-in-process), [`subagent-acp`](../packages/subagent/subagent-acp), [`subagent-codex`](../packages/subagent/subagent-codex), [`subagent-claude-code`](../packages/subagent/subagent-claude-code), [`subagent-dsh-sdk`](../packages/subagent/subagent-dsh-sdk) | [`tool-subagent`](../packages/subagent/tool-subagent), [`tool-subagent-control`](../packages/subagent/tool-subagent-control), [`tool-ralph`](../packages/workflow/tool-ralph) | - | ينفّذ المزوّدون وسائلَ النقل؛ وتملك الخدمةُ أيضًا تنسيقَ المتابعة الاختياري القائم على التفعيلات، ويختار tool-subagent تفويضًا بلقطة واحدة أو قابلًا للمتابعة، ويسلّم tool-subagent-control المتابعاتِ، ويشترط tool-ralph مسارَ خرج مبنيَن جديدًا واحدًا. |
| `ctx.agentTeams` | `core` | [`experimental-agent-team`](../packages/experimental/agent-team) | - | [`experimental-tool-agent-team`](../packages/experimental/tool-agent-team), [`experimental-client-ui-agent-team`](../packages/experimental/client-ui-agent-team) | - | يملك قائمةَ الأعضاء ذات الجذر الضمني، وصندوقَ بريد الأقران الدائم، والرسمَ الموجَّه للمهام المشترك، ودورةَ حياة الأبناء القابلين للمتابعة، وطرائقَ Remote المولَّدة للفريق؛ ويسهم tool-agent-team بضوابط النموذج ويركّب client-ui-agent-team إسهامَ المتصفح. |
| `ctx.inspector` | `core` | `inspector` | - | - | - | يملك هدفَ CDP المستضاف في Worker وواجهةَ مراقبة المضيف والعميل واستعلامِ شجرة Cordis المستقلة عن النقل. |
| `ctx.jobs` | `seam` | [`jobs`](../packages/jobs/jobs) | [`jobs-local`](../packages/jobs/jobs-local) | [`tool-bash`](../packages/shell/tool-bash), [`tool-terminal`](../packages/terminal/tool-terminal), [`tool-subagent`](../packages/subagent/tool-subagent), [`tool-jobs`](../packages/jobs/tool-jobs) | - | يسجّل المنتِجون (bash في الخلفية، وإرسالاتُ PTY، وتفويضاتُ الوكلاء الفرعيين) عملًا عاملًا؛ وtool-jobs هو المتحكمُ الذي يراه النموذجُ فيقرؤه ويعدّده ويقتله؛ وjobs-local هو السجلُّ المحلي في العملية. |
| `ctx.web` | `seam` | [`web`](../packages/web/web) | [`web-search-exa`](../packages/web/web-search-exa), [`web-search-perplexity`](../packages/web/web-search-perplexity), [`web-search-deepseek`](../packages/web/web-search-deepseek), [`web-fetch-http`](../packages/web/web-fetch-http) | [`tool-web`](../packages/web/tool-web) | - | يسجّل مزوّدو البحث والجلب في seam ‏ctx.web واحد؛ ويملك tool-web الأسماءَ الثابتة التي يراها النموذج. |
| `ctx.spillStore` | `seam` | [`spill`](../packages/spill/spill) | [`spill-local`](../packages/spill/spill-local) | [`spill-policy`](../packages/spill/spill-policy) | - | تحفظ الخلفيةُ نصَّ الأدوات المفرط وتعيد محدِّدًا يراه النموذجُ مع تلميح استرجاع؛ وspill-policy هو مستهلكُ `tools/post-execute` الذي يقرر متى يُفاض. |
| `ctx.directoryPicker` | `seam` | [`host-directory-picker`](../packages/host/directory-picker) | [`host-directory-picker-native`](../packages/host/directory-picker-native), [`host-directory-picker-browse`](../packages/host/directory-picker-browse) | [`api-workspace-controller`](../packages/api/workspace-controller) | - | قدرةُ تفاعل مميَّزة: فالخلفيةُ الأصيلة تفتح مُنتقيَ نظام تشغيل واحدًا على شاشة المضيف، وخلفيةُ التصفح تقدّم بدائياتِ التعداد والإنشاء للمتصفح داخل التطبيق؛ وتملأ الخلفياتُ ذاتُ الوجهين خاناتِ مسار الأدلة في ui-workspace من أنصافها في المتصفح (بلا إعلان على الشبكة). |
| `ctx.webServer` | `core` | [`host-webserver`](../packages/host/webserver) | - | [`client-connection`](../packages/client/connection), [`client-modules`](../packages/client/modules), [`client-hmr`](../packages/client/hmr) | - | ناقلُ `node:http` صرف: سجلُّ مسارات مسمّاة، ومَهارب تحويل index، والاحتياطيُّ الساكن من dist؛ وتسجّل إضافاتُ نقل الوِب مساراتِها. |
| `ctx.clientModules` | `core` | [`client-modules`](../packages/client/modules) | - | [`client-hmr`](../packages/client/hmr) | - | يركّب رسمَ مداخل `__DSH_BOOT__` من مسح `dsh.client` تدريجي، ويقدّم حزمَ الإضافات، ويُشعر المشترِكين في إعادة البناء وفي تغيّر الرسم. |
| `ctx.workflowEngine` | `seam` | [`workflow`](../packages/workflow/workflow) | [`workflow-ptc`](../packages/workflow/workflow-ptc) | [`tool-workflow`](../packages/workflow/tool-workflow), [`tool-ralph`](../packages/workflow/tool-ralph) | - | محرّكٌ واحد لكل سياق، كما في bash، بلا سجل مزوّدين مسمّين؛ ويبدأ مستهلكا مسار العمل العام وRalph الثابت تشغيلاتٍ تنتشر نداءاتُ `agent()` فيها عبر ctx.subagents. |
| `ctx.webhookRuntime` | `core` | [`webhook`](../packages/webhook/webhook) | - | [`webhook-github`](../packages/webhook/webhook-github) | - | توزّع مهايئاتُ المزوّدين التسليماتِ الموثَّقة؛ وتسجّل الإضافاتُ الموثوقة قواعدَ مستقلة محلية في العملية، وتحوّل بيئةُ التشغيل النتائجَ غير الفارغة إلى جلسات عادية مسنَدة إلى مساحة عمل بلا حالة تسليم أو اكتمال. |
| `ctx.lsp` | `seam` | [`lsp`](../packages/lsp/lsp) | [`lsp-stdio`](../packages/lsp/lsp-stdio) | [`tool-lsp`](../packages/lsp/tool-lsp) | - | تسجيلُ المزوّدين وانتقاؤهم مع تنفيذ استعلام موحَّد على أربع عمليات بالضبط؛ ولا يعرض الـseam مَهربَ بروتوكول، فتترجم الخلفيةُ إلى الطلب والنتيجة الموحَّدين. |
| `ctx.dynamicCordisRunner` | `core` | [`cordis-host-runner`](../packages/extensions/cordis-host-runner) | - | [`tool-cordis`](../packages/extensions/tool-cordis) | - | يملك سجلَّ التعريفات في الذاكرة، وصندوقَ vm المعزول لأنصاف المضيف، ورحلةَ الذهاب والإياب في request-run؛ وتبلغ صفحاتُ المتصفح الخدمةَ نفسَها عبر الشبكة من فضاء أسمائها البعيد. |
| `ctx.cordisInspect` | `core` | [`cordis-host-runner`](../packages/extensions/cordis-host-runner) | - | [`tool-cordis`](../packages/extensions/tool-cordis) | - | يسجّل مزوّدي الفحص في المضيف، ويعكس بيانَ مزوّدي العميل، ويوجّه استعلاماتِ العميل عبر نقل Cordis الديناميكي. |

وضعُ الصيانة: مختلط — تُكتشف الخدماتُ من تصريحات Cordis؛ وتُصنَّف أدوارُ الواجهة والتنفيذ والاستهلاك في `scripts/gen-doc-graphs.ts` مع حارس اكتمال.

<!-- إنجليزي نص مصدر ملف من scripts/gen-doc-graphs.ts توليد؛ هذا العربية ملف هو عبر مزدوج لغة إعداد مقابل صيانة مرور مراجعة مقابل جانب.
     تحديث وقت أولا تشغيل `pnpm run gen-doc-graphs` تحديث إنجليزي نص، مجددا تحديث هذا ملف و تشغيل `pnpm run verify-translation-pairing --write docs/capability-seams.md` إعادة سجل إعداد مقابل. -->

# قدرة Seams و نواة قلب خدمة

[English](capability-seams.md) | العربية

خدمة يمكن هو نواة قلب رئيسي جاف خدمة، يمكن استبدال قدرة seam، أيضا يمكن هو تركيب حزمة/تركيب نقطة. تحت رسم عرض يملك خدمة إعلان حزمة، معروف تنفيذ حزمة، و مباشر إزالة استهلاك هذا خدمة حزمة.

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

| ctx مفتاح | زاوية لون | الذي تابع حزمة | تنفيذ | مباشر مستهلك | إعداد طقم إضافة | شرح |
| --- | --- | --- | --- | --- | --- | --- |
| `ctx.hmr` | `core` | [`hmr`](../packages/boot/hmr) | - | [`app-boot`](../packages/boot/app-boot) | - | مسؤول وحدة و دقيق إعداد استماع؛ تطبيق تعديل مشترك استخدام ذلك طابور صف، تلقائي إعادة تحميل انتظار تطبيق ملف قفل. |
| `ctx.pluginManager` | `core` | [`plugin-manager`](../packages/boot/plugin-manager) | - | [`plugin-manager`](../packages/boot/plugin-manager), `ui-settings-plugin-inventory` | - | و CLI مشترك profile حزمة عملية، و نحو Web و Agent استدعاء جهة قسم آخر تقرير إبلاغ حمل دائم حالة و تشغيل حالة. |
| `ctx.profileContext` | `core` | [`app-boot`](../packages/boot/app-boot) | - | [`plugin-manager`](../packages/boot/plugin-manager) | - | dsh launcher توفير صاف بيانات شكل صيغة profile موضع و تركيب إدخال؛ إعادة تحميل ضبط درجة من dsh-hmr مسؤول. |
| `ctx.connection` | `core` | [`client-connection`](../packages/client/connection) | - | [`api-gateway`](../packages/api/gateway), [`host-frontend-static`](../packages/host/frontend-static) | - | مسؤول متصفح إقرار إثبات و مشترك HTTP طلب توزيع؛API مهايئ تسجيل طرف نقطة و تدفق. |
| `ctx.mcpResources` | `seam` | [`mcp-resources`](../packages/mcp/mcp-resources) | [`mcp-client`](../packages/mcp/mcp-client) | [`mcp-resources`](../packages/mcp/mcp-resources) | - | اتصال كل من توفير عملية في استدعاء agent أثر مجال داخل خدمة في مشترك مورد أداة. |
| `ctx.browserUse` | `seam` | [`browser-use`](../packages/browser-use/browser-use) | [`experimental-browser-use-playwright-mcp`](../packages/experimental/browser-use-playwright-mcp), [`experimental-browser-use-chrome-devtools-mcp`](../packages/experimental/browser-use-chrome-devtools-mcp), [`experimental-browser-use-stagehand-native`](../packages/experimental/browser-use-stagehand-native) | [`experimental-browser-use-playwright-mcp`](../packages/experimental/browser-use-playwright-mcp), [`experimental-browser-use-chrome-devtools-mcp`](../packages/experimental/browser-use-chrome-devtools-mcp), [`experimental-browser-use-stagehand-native`](../packages/experimental/browser-use-stagehand-native) | - | كل خدمة نسخة تسجيل واحد مزود يملك اسم. مزود حسب فوري Session يملك ذاتي ذات أداة و متصفح مورد؛ مشترك خدمة لا توفير متصفح عملية API. |
| `ctx.computerUse` | `seam` | [`computer-use`](../packages/computer-use/computer-use) | [`experimental-computer-use-cua-driver-mcp`](../packages/experimental/computer-use-cua-driver-mcp), [`experimental-computer-use-cua-driver-native`](../packages/experimental/computer-use-cua-driver-native) | [`experimental-computer-use-cua-driver-mcp`](../packages/experimental/computer-use-cua-driver-mcp), [`experimental-computer-use-cua-driver-native`](../packages/experimental/computer-use-cua-driver-native) | - | كل خدمة نسخة فقط تسجيل واحد مزود ذاتي تحديد اسم. كل مزود أيضا يملك ذاتي ذات نموذج أداة؛ خدمة لا توفير عام عملية API، وقت التشغيل اختيار أو Session مسار قفل. |
| `ctx.officeToPdf` | `core` | [`office-to-pdf`](../packages/document/office-to-pdf) | - | [`client-ui-sidebar-documentpreview`](../packages/client/ui-sidebar-documentpreview) | - | قد تخويل Office بايت في مضيف فوق استخدام قد إعلان أصلي هدف جذب محرك تحويل؛ لم إعلان أصلي هدف وقت استخدام Node WASM. |
| `ctx.attachments` | `seam` | [`attachment`](../packages/attachment/attachment) | [`attachment-local`](../packages/attachment/attachment-local) | [`api-session-controller`](../packages/api/session-controller), [`tool-fs`](../packages/fs/tool-fs), [`llm-pi-ai`](../packages/llm/llm-pi-ai), [`llm-deepseek`](../packages/llm/llm-deepseek) | - | مضيف سوف في جلسة حدث قبل إيداع قد قبول صورة؛ مزود مهايئ سوف قد تخويل حمل دائم مرجع تحليل لـ مزود أصلي محتوى. |
| `ctx.fileUploads` | `core` | [`client-file-upload`](../packages/client/file-upload) | - | [`api-session-controller`](../packages/api/session-controller) | - | مسؤول تدفق صيغة استقبال، حمل دائم تخزين و مؤقت تخزين عودة تنفيذ دورة الحياة؛Session Controller سوف عودة تنفيذ ربط إلى قد قبول إيداع. |
| `ctx.llm` | `seam` | [`llm`](../packages/llm/llm) | [`llm-deepseek`](../packages/llm/llm-deepseek), [`llm-pi-ai`](../packages/llm/llm-pi-ai), [`llm-replay`](../packages/test-support/llm-replay) | [`agent-loop`](../packages/core/agent-loop), [`compaction-basic`](../packages/compaction/compaction-basic) | - | مهايئ تسجيل مزود تنفيذ؛agent loop(ذكي جسم حلقة) و ضغط وظيفة استدعاء مزود غير متصل تدفق خدمة. |
| `ctx.deepseekLlmApiExtensions` | `seam` | [`deepseek-llm-api-extensions`](../packages/llm/deepseek-llm-api-extensions) | [`session-log-deepseek`](../packages/session/session-log-deepseek), [`plugin-package-inventory-deepseek`](../packages/llm/plugin-package-inventory-deepseek) | [`llm-deepseek`](../packages/llm/llm-deepseek) | - | إضافة دقيق تجهيز ذاك هذا مستقل قمة طبقة حقل؛ رسمي جهة مهايئ سوف دمج هذه حقل، و في HTTP قبول بعد إيداع ذلك تسليم حالة. |
| `ctx.tokenMeter` | `core` | [`token-meter`](../packages/llm/token-meter) | - | [`compaction-basic`](../packages/compaction/compaction-basic) | - | يملك حسب جلسة عزل إعادة تشغيل طي منطقة؛ ضغط قوة مستهلك مشترك غير ممكن تغيير كما حمل إصلاح حجز إصدار قياس كمية نتيجة. |
| `ctx.toolResultPruner` | `core` | [`compaction-tool-result-pruner`](../packages/compaction/compaction-tool-result-pruner) | - | [`compaction-basic`](../packages/compaction/compaction-basic) | - | في ملخص ضغط قبل، عبر يمكن إعادة تشغيل مفرد عقدة جدول طبقة استبدال قدوم تعديل كتابة مرور كبير حالي أداة نتيجة. |
| `ctx.sessions` | `core` | [`session`](../packages/core/session) | - | [`agent-loop`](../packages/core/agent-loop), [`agent`](../packages/core/agent), [`session-persistence`](../packages/session/session-persistence), [`session-query`](../packages/session-query/session-query), [`session-query-sqlite`](../packages/session-query/session-query-sqlite), [`subagent-in-process-driver`](../packages/subagent/subagent-in-process-driver), [`invariants`](../packages/runtime-diagnostics/invariants), [`message-feedback`](../packages/feedback/message-feedback) | - | يملك فقط إلحاق Session نسخة، تزامن خروج حمل دائم جلسة حدث تدفق. |
| `ctx.sessionController` | `core` | [`api-session-controller`](../packages/api/session-controller) | - | - | - | مسؤول Session أمر، بارد قراءة، حمل دائم حدث تتبع مع، فوري تحكم حالة، نموذج دليل،workspace فتح و Agent تنشيط سياسة. |
| `ctx.sessionFileReferences` | `core` | [`api-session-controller`](../packages/api/session-controller) | - | - | - | عبر Session Controller قائم Agent lookup سياسة تفويض حمل ملف مرجع اكتشاف. |
| `ctx.sessionSkillCatalog` | `core` | [`api-session-controller`](../packages/api/session-controller) | - | - | - | في لا تنشيط بارد Agent قبل رفع تحت صف خروج Session تركيب في سماح مستخدم استدعاء skill. |
| `ctx.credentialsController` | `core` | [`api-settings-controller`](../packages/api/settings-controller) | - | - | - | يأخذ اعتماد مرجع seam إسقاط إلى توليد Remote namespace: دفعة كمية مروحة خروج، عرض إسقاط و رفض خريطة كل في هذا داخل، بينما لا في seam Definition فوق. |
| `ctx.settingsController` | `core` | [`api-settings-controller`](../packages/api/settings-controller) | - | - | - | يأخذ مستخدم ضبط seam إسقاط إلى توليد Remote namespace: قراءة واحد قاعدة انفصال حساس، كل رفض في هذا داخل تصنيف، بينما لا في seam Definition فوق. |
| `ctx.workspaceFiles` | `core` | [`api-workspace-files`](../packages/api/workspace-files) | - | - | - | لـ جلسة مساحة العمل أصل داخل ملف توفير stat، قسم صفحة نص، بايت نافذة، دليل صف رفع و تغيير تدفق، مرور lstat، يتضمن علاقة و stat إعادة فحص حد تحديد. |
| `ctx.workspaceChanges` | `core` | [`workspace-changes`](../packages/deliverables/workspace-changes) | - | - | - | Serves the summary each workspace/changes event announced and each listed file's turn-start and turn-end comparison, by Session and event sequence, until that Session is disposed; the log carries only the turn. |
| `ctx.terminalController` | `core` | [`api-terminal-controller`](../packages/api/terminal-controller) | - | - | - | عبر عملية فرعية مزود و نوع تحويل Remote نقل إدارة مستخدم طرفية عملية، تحليل افتراضي shell، و استعادة محدود طرفية شاشة ستار. |
| `ctx.workspaceController` | `core` | [`api-workspace-controller`](../packages/api/workspace-controller) | - | - | - | عبر توليد Remote namespace مسؤول Workspace أمر و يمكن في إعادة وصل بعد استلام جمع Workspace حالة إلقاء تمرير. |
| `ctx.directoryPickerController` | `core` | [`api-workspace-controller`](../packages/api/workspace-controller) | - | - | - | يأخذ اختيار دليل seam إرسال فوق خط: قدرة بوابة، إلغاء نقل بث، و متصفح دليل مسار لأجل فرع حكم قطع seam رمز خطأ. |
| `ctx.invariants` | `core` | [`invariants`](../packages/runtime-diagnostics/invariants) | - | [`session`](../packages/core/session), [`agent`](../packages/core/agent), [`scope`](../packages/core/scope), [`agent-loop`](../packages/core/agent-loop) | - | إعداد طقم فرعي مسار تسجيل الذي تابع حزمة محلي فحص؛ هذا خدمة مسؤول اختيار، وحيد صفة، فرعي fiber، و علامة واضح الذي تابع حزمة فشل. |
| `ctx.typert` | `core` | [`typert-registry`](../packages/typert/registry) | - | [`typert-loader`](../packages/typert/loader), [`api-gateway`](../packages/api/gateway) | - | إضافة مباشر أو عبر dsh-typert-loader تسجيل فوري zod مساهمة؛API شبكة صلة إزالة استهلاك استدعاء وصف رمز و مزود، أخرى وقت التشغيل مستهلك فإن في كل منها حد استعلام schema و عكس إطلاق بيانات وصفية. |
| `ctx.typertGateway` | `core` | [`api-gateway`](../packages/api/gateway) | - | - | - | سوف توليد Remote وصف رمز و فوري Cordis خدمة صلة ربط، تحليل قد تسجيل هوية، و عبر مشترك Connection RPC تحميل جسم توفير واحد عنصر استدعاء. |
| `ctx.sessionPersistence` | `seam` | [`session-persistence`](../packages/session/session-persistence) | [`session-persistence-jsonl`](../packages/session/session-persistence-jsonl) | [`agent-loop`](../packages/core/agent-loop), [`tool-bash`](../packages/shell/tool-bash), [`hooks-claude-code`](../packages/hooks/hooks-claude-code), [`hooks-codex`](../packages/hooks/hooks-codex), [`session-query`](../packages/session-query/session-query), [`session-query-sqlite`](../packages/session-query/session-query-sqlite), [`message-feedback`](../packages/feedback/message-feedback) | - | JSONL backend يأخذ SessionEvent مفردات حفظ دائم لـ كل Session واحد نسخة ناتج. |
| `ctx.settings` | `seam` | [`settings`](../packages/settings/settings) | [`settings-file`](../packages/settings/settings-file) | [`api-settings-controller`](../packages/api/settings-controller), [`llm-deepseek`](../packages/llm/llm-deepseek), [`llm-pi-ai`](../packages/llm/llm-pi-ai) | - | إضافة تسجيل نطاق الأسماء schema و تحليل قسم طبقة قيمة؛ مزود تخزين أصلي وثيقة.LLM(كبير لغة نموذج) مهايئ في مستخدم قسم منطقة تحت سوف ذلك مدخل إعداد تسجيل لـ تركيب أساس أساس؛settings controller توفير مرور مرور انفصال حساس قسم طبقة وصف رمز، و كتابة مستخدم طبقة. |
| `ctx.subagentModelSelection` | `core` | [`tool-subagent`](../packages/subagent/tool-subagent) | - | [`tool-subagent`](../packages/subagent/tool-subagent) | - | يملك افتراضي إغلاق ضبط نطاق الأسماء؛Agent أثر مجال تفويض إرسال أداة سوف في تركيب جديد قمة طبقة Session وقت قراءة هو. |
| `ctx.credentials` | `seam` | [`credentials`](../packages/credentials/credentials) | [`credentials-local`](../packages/credentials/credentials-local) | [`api-settings-controller`](../packages/api/settings-controller), [`llm-deepseek`](../packages/llm/llm-deepseek), [`llm-pi-ai`](../packages/llm/llm-pi-ai) | - | إعداد يحمل مقابل آلة سري معلومة مرجع؛ مزود يملك فعلي قيمة. مستهلك حسب عملية تحليل، لذلك جولة تبديل بعد اعتماد سوف في ضيق وصل حال تحت مرة طلب في توليد فاعلية؛settings controller توفير لا يحتوي فعلي قيمة عرض و فقط كتابة تخزين. |
| `ctx.authorization` | `seam` | [`authorization`](../packages/credentials/authorization) | - | [`llm-pi-ai`](../packages/llm/llm-pi-ai) | - | flow من معرفة طريق مثل أي أخذ نيل بعض نسخة اعتماد إضافة تسجيل، و بـ ذلك كتابة سجل لـ مفتاح؛seam يملك هذا مقطع محادثة و"كل مفتاح معا فقط ركض مرة محاولة تجربة"دورة الحياة، بينما غير بروتوكول ذاته. |
| `ctx.sessionTelemetry` | `seam` | [`session-telemetry`](../packages/session/session-telemetry) | [`session-telemetry-otel`](../packages/session/session-telemetry-otel) | - | - | هذا seam التقاط جلسة سجل، إجراء انفصال حساس و تسليم إعطاء واحد خلفية؛ لا يوجد أخرى مكون إزالة استهلاك هذا خدمة، ذلك إخراج سوف مغادرة فتح حالي عملية. |
| `ctx.storage` | `seam` | [`storage`](../packages/storage/storage) | [`storage-json`](../packages/storage/storage-json), [`storage-sqlite`](../packages/storage/storage-sqlite) | [`storage-domain`](../packages/storage/storage-domain) | - | كل خلفية بـ مختلف اسم و صف تسجيل؛ بيانات شكل (مجال أولوية) تركيب إلى محور عقدة فوق، و سوف نوع تحويل عملية تحويل لـ لا نفاذ واضح KV وحدة أصل لغة. |
| `ctx.storageDomain` | `core` | [`storage-domain`](../packages/storage/storage-domain) | - | [`workspace`](../packages/workspace/workspace) | - | انتظار كل قد إعداد خلفية حينئذ خيط، لكن بعد سوف مجال شكل إصدار لـ واحد تلقي دورة الحياة قيد خدمة، لأجل نوع تحويل حمل دائم حالة. |
| `ctx.messageFeedback` | `core` | [`message-feedback`](../packages/feedback/message-feedback) | - | - | - | يملك مرجعي Session سجل في تدريجي assistant رسالة عكس تغذية، هدف تحقق، تدريجي بند compare-and-set و Host واحد عنصر Remote عقد نحو. عكس تغذية لا دخول نموذج تاريخ؛ سجل توجيه خروج التزام دوران مستهلك سياسة. |
| `ctx.sessionFeedback` | `core` | [`command-feedback`](../packages/feedback/command-feedback) | - | - | - | عبر Host واحد عنصر Remote عقد نحو في live Session فوق يأخذ واحد بند حمل تصنيف Session درجة تقييم قيمة سجل لـ فقط كتابة سجل feedback/record حدث؛/feedback أمر مشترك استخدام نفس عدد إنتاج جهة. |
| `ctx.workspaceRegistry` | `core` | [`workspace`](../packages/workspace/workspace) | - | [`api-workspace-controller`](../packages/api/workspace-controller), [`api-session-controller`](../packages/api/session-controller) | - | عبر مجال ضبط تطبيق يملك حمل WorkspaceId صنف لوحة نوع سجل؛ مستقر sessionIds حساب مستخدم قيادة Host RPC و GUI إسقاط. |
| `ctx.sessionQuery` | `seam` | [`session-query`](../packages/session-query/session-query) | [`session-query-sqlite`](../packages/session-query/session-query-sqlite) | [`session-reference`](../packages/context/session-reference), [`tool-session-query`](../packages/session-query/tool-session-query) | - | هذا واجهة توفير دقيق قراءة، مرور ترشيح و تتبع أثر؛ أداة جسم خلفية أيضا توفير كل نص تنسيق ضبط، ترتيب ترتيب، ملخص قطعة مقطع و تنقل علامة عالم بديل، بينما نموذج مستهلك مسؤول مساحة العمل إذن و لا يحتوي تنقل علامة تصيير. |
| `ctx.fileReferences` | `seam` | [`file-reference`](../packages/context/file-reference) | [`file-reference-local`](../packages/context/file-reference-local) | [`api-session-controller`](../packages/api/session-controller) | - | هذا واجهة إرجاع Agent cwd داخل فقط يحتوي مسار تكملة كل مرشح؛ مزود مسؤول نطاق الأسماء وصول و ترتيب ترتيب، لكن لا قراءة ملف محتوى. |
| `ctx.sessionReferenceResolver` | `core` | [`session-reference`](../packages/context/session-reference) | - | - | - | سوف حالي جدول طبقة في محدود محادثة لقطة إسقاط لـ حمل دائم لكن غير ممكن معلومة رسالة سياق؛Host مهايئ مسؤول رفع و لغة قاعدة. |
| `ctx.sessionTitle` | `seam` | [`session-title`](../packages/session/session-title) | [`session-title-first-prompt-llm`](../packages/session/session-title-first-prompt-llm), [`session-title-all-prompts-llm`](../packages/session/session-title-all-prompts-llm) | - | - | مسؤول تحديد صفة رجوع، الأكثر جديد عنوان طي منطقة، و وحيد اختياري مختلف خطوة مزود تسجيل. |
| `ctx.systemPrompt` | `core` | [`system-prompt`](../packages/core/system-prompt) | - | [`agent-loop`](../packages/core/agent-loop), [`tools`](../packages/core/tools), [`tool-fs`](../packages/fs/tool-fs), [`tool-terminal`](../packages/terminal/tool-terminal), [`tool-web`](../packages/web/tool-web) | - | لـ كل خطوة استلام تجميع نص التوجيه كل جزء و موجه إلى نموذج أداة schema. |
| `ctx.tools` | `core` | [`tools`](../packages/core/tools) | - | [`agent-loop`](../packages/core/agent-loop), [`tool-ask-user`](../packages/interaction/tool-ask-user), [`tool-bash`](../packages/shell/tool-bash), [`tool-cordis`](../packages/extensions/tool-cordis), [`tool-fs`](../packages/fs/tool-fs), [`tool-terminal`](../packages/terminal/tool-terminal), [`tool-skill`](../packages/skill/tool-skill), [`tool-subagent`](../packages/subagent/tool-subagent), [`tool-todo`](../packages/todo/tool-todo), [`tool-web`](../packages/web/tool-web) | - | تسجيل قدرة، مسؤول PTC mode نقل، و يجعل استدعاء اعتماد مرة مرور مرور سياسة قبل معالجة، مفرد ضبط حراسة حماية، حلقة التفاف قسم إرسال، سياسة بعد معالجة و نهائي نتيجة مراقبة قياس. |
| `ctx.userQuestions` | `seam` | [`user-questions`](../packages/interaction/user-questions) | - | [`tool-ask-user`](../packages/interaction/tool-ask-user) | - | UI قبل طرف توفير حالي توليد فاعلية شخص عمل عودة جواب مزود؛tool-ask-user في مزود غير متصل ask() promise فوق مؤقت توقف أداة استدعاء. |
| `ctx.planMode` | `core` | [`plan-mode`](../packages/plan/plan-mode) | - | - | - | طي قد سجل حساب تخطيط/نمط حالة، في جولة حد تحديث جديد مستخدم اختيار، تصيير من نشر جهة يملك إشارة توجيه معلومة، تسجيل /plan، و في حالة تحويل خلال إبقاء حساب تخطيط خروج schema مستقر. |
| `ctx.agentPresets` | `core` | [`agent-presets`](../packages/preset/agent-presets) | - | - | - | في تلقي معلومة مهمة أصل دليل و مستخدم إنشاء عمل أصل دليل فوق اكتشاف preset دليل، و في إنشاء مدة يأخذ واحد نسخة preset cordis.yml تركيب إلى agent أثر مجال لـ تحت، رفض بداية نهاية لم تنشيط أو نحو أصل خدمة realm إصدار خدمة سطر. |
| `ctx.commands` | `core` | [`commands`](../packages/interaction/commands) | - | - | - | إضافة تسجيل مباشر موجه إلى شخص أمر، بينما لن يأخذ استدعاء إرسال إعطاء نموذج. |
| `ctx.sessionProjections` | `core` | [`session-projection`](../packages/session/session-projection) | - | [`api-session-controller`](../packages/api/session-controller), [`tool-todo`](../packages/todo/tool-todo), [`session-title`](../packages/session/session-title) | - | كل مجال تسجيل من حالة قيادة طي وحدة؛ رئيسي حركة قيادة مرور مسار صيانة كل جلسة ماء موضع حالة،Session controller توفير baseline و دفع إرسال حدوث تغير قيمة. |
| `ctx.sessionProjectionCache` | `core` | [`session-projection-cache`](../packages/session/session-projection-cache) | - | [`api-session-controller`](../packages/api/session-controller), [`session-query`](../packages/session-query/session-query), [`session-reference`](../packages/context/session-reference), [`subagent`](../packages/subagent/subagent) | - | حسب جلسة حمل دائم حفظ إسقاط وحدة حالة فحص نقطة (عقدة تدفق فحص نقطة، و جولة/انتهاء/قسم مغادرة وقت لا بد اختيار فحص نقطة) ، و توفير بارد قراءة مرحلة سلم: ذاكرة مؤقتة سطر إضافة حفظ دائم ذيل جزء إعادة تشغيل، لذلك قائمة قراءة دائم بعيد لا حاجة تحميل كامل سجل. |
| `ctx.skills` | `seam` | [`skill`](../packages/skill/skill) | [`skill-badge`](../packages/skill/skill-badge), [`skill-filesystem`](../packages/skill/skill-filesystem), [`skill-office`](../packages/skill/skill-office) | [`tool-skill`](../packages/skill/tool-skill) | - | دمج مزود skill(تقنية قدرة) دليل؛tool-skill تصيير جلسة بادئة دليل، و تحميل كامل skill متن. |
| `ctx.agents` | `core` | [`agent`](../packages/core/agent) | - | [`agent-loop`](../packages/core/agent-loop), [`acp`](../packages/acp/acp), [`subagent-in-process-driver`](../packages/subagent/subagent-in-process-driver) | - | يملك فوري Agent جملة مقبض، إنشاء/استعادة عمل مصنع seam، و عملية محلي إرسال بدء جهة نقل بث. |
| `ctx.agentDefaultModel` | `core` | [`agent-default-model`](../packages/core/agent-default-model) | - | [`api-session-controller`](../packages/api/session-controller), [`headless`](../packages/bundle/headless) | - | عبر settings قسم طبقة افتراضي `ModelSelection`، يجعل مباشر مدخل و Host دعم دعم Agent مدخل مشترك نفس عدد حالة كل من. |
| `ctx.agentLoop` | `bundle` | [`agent-loop`](../packages/core/agent-loop) | - | [`base`](../packages/bundle/base), [`sdk-minimal`](../packages/bundle/sdk-minimal) | - | وحيد أداة جسم حلقة إضافة؛ توسيع حزمة اعتماد dsh-agent حدث و خدمة، بينما لا اعتماد هذا حزمة. |
| `ctx.goals` | `core` | [`goal`](../packages/goal/goal) | - | - | - | من جلسة سجل طي حمل إصلاح حجز إصدار هدف حالة، و سوف فوري تأخير متابعة تنشيط إبقاء في عملية محلي. |
| `ctx.ssh` | `core` | [`ssh`](../packages/ssh/ssh) | - | [`fs-ssh`](../packages/ssh/fs-ssh), [`subprocess-ssh`](../packages/ssh/subprocess-ssh), [`sandbox-ssh`](../packages/ssh/sandbox-ssh) | - | مسؤول واحد بند مرور مرور إقرار إثبات OpenSSH اتصال، قد تثبيت مساعد مساعدة برنامج هوية، مستقل برنامج تدفق، و إعداد طقم بعيد طرف مزود قطع وصل تنظيف. |
| `ctx.subprocess` | `seam` | [`subprocess`](../packages/subprocess/subprocess) | [`subprocess-local`](../packages/subprocess/subprocess-local), [`subprocess-ssh`](../packages/ssh/subprocess-ssh) | [`bash-local`](../packages/shell/bash-local), [`bash-sandbox`](../packages/shell/bash-sandbox), [`terminal-bash`](../packages/terminal/terminal-bash), [`lsp-stdio`](../packages/lsp/lsp-stdio), [`subagent-acp`](../packages/subagent/subagent-acp), [`subagent-codex`](../packages/subagent/subagent-codex), [`subagent-claude-code`](../packages/subagent/subagent-claude-code) | - | Bash منفذ،PTY shell خلفية،LSP Host، و عملية خارج ACP،Codex و Claude Code subagent خلفية كل عبر ctx.subprocess تنفيذ spawn؛ هذا خدمة مسؤول عملية جلوس علامة، عملية شجرة/جلسة دورة الحياة،stdio موضع وضع، طرفية آلية و kill ترقية. |
| `ctx.shell` | `seam` | [`shell`](../packages/shell/shell) | [`bash-local`](../packages/shell/bash-local), [`bash-sandbox`](../packages/shell/bash-sandbox), [`pwsh-local`](../packages/shell/pwsh-local) | [`tool-bash`](../packages/shell/tool-bash), [`tool-pwsh`](../packages/shell/tool-pwsh), [`hooks-claude-code`](../packages/hooks/hooks-claude-code), [`hooks-codex`](../packages/hooks/hooks-codex) | - | موجه إلى نموذج shell أداة و خطاف جسر وصل إزالة استهلاك هذا seam؛ صندوق رملي، بعيد مسار أو PowerShell منفذ يمكن استبدال bash-local، بينما بلا حاجة تعديل هذه مستهلك. |
| `ctx.shellEnv` | `core` | [`shell-env`](../packages/shell/shell-env) | - | [`tool-bash`](../packages/shell/tool-bash), [`tool-pwsh`](../packages/shell/tool-pwsh) | - | إضافة إعلان حد تحديد في effect أثر مجال DSH_* واقع؛ كل shell أداة في كل مرة تنفيذ وقت استلام تجميع واحد نسخة يمكن معلومة لقطة، ذلك منفذ حسب هذا إعادة بناء نطاق الأسماء. |
| `ctx.terminals` | `seam` | [`terminal`](../packages/terminal/terminal) | [`terminal-bash`](../packages/terminal/terminal-bash) | [`tool-terminal`](../packages/terminal/tool-terminal) | - | سجل التسجيل مسؤول دقيق إلى Agent جلسة هوية و تنظيف؛ خلفية مسؤول طرفية آلية،tool-terminal فإن توفير حد تحديد في كل من أثر مجال نموذج واجهة. |
| `ctx.sandbox` | `seam` | [`sandbox`](../packages/sandbox/sandbox) | [`sandbox-local`](../packages/sandbox/sandbox-local), [`sandbox-ssh`](../packages/ssh/sandbox-ssh) | [`bash-sandbox`](../packages/shell/bash-sandbox), [`terminal-bash`](../packages/terminal/terminal-bash) | - | مستهلك تسليم خروج أي سوف تنفيذ spawn تأكيد قطع argv؛ و إعداد طقم عملية فرعية مزود مشترك تنفيذ بيئة خلفية حسب كل مرة استدعاء سياسة حزمة تركيب هذا argv، و تقرير إبلاغ قوي صنع تنفيذ حال حال. |
| `ctx.sandboxPolicy` | `core` | [`sandbox-policy`](../packages/sandbox/sandbox-policy) | - | [`bash-sandbox`](../packages/shell/bash-sandbox), [`fs-sandbox`](../packages/fs/fs-sandbox), [`terminal-bash`](../packages/terminal/terminal-bash) | - | موحد واحد حفظ نشر افتراضي نمط و مساحة العمل أصل دليل؛ فقط لديه صندوق رملي منفذ و مزود قراءة هذا خدمة (أداة طبقة استخدام هو معا توجيه خروج صاف `sandbox/mode` طي منطقة). اثنان صنف قوي صنع تنفيذ مكون كل قراءة هذا خدمة، لذلك bash و fs لن حد إلى مختلف أصل دليل. |
| `ctx.approval` | `seam` | [`user-approval`](../packages/interaction/user-approval) | - | [`tools`](../packages/core/tools), [`tool-bash`](../packages/shell/tool-bash), [`acp`](../packages/acp/acp) | - | مرة صفة إذن قرار عبر `approval/request` waterfall(شلال نشر صيغة حدث) قسم إرسال؛ عودة جواب جهة هو مستمع (أي ACP لـ ذاته agent توفير جسر وصل) ، لا يوجد عودة جواب جهة وقت بـ `unavailable` إغلاق فشل. |
| `ctx.permissionPresets` | `core` | [`permission-presets`](../packages/interaction/permission-presets) | - | - | - | موجه إلى مستخدم مسبق ضبط جدول (`workspace-write`/`danger-full-access`) ، سوف صندوق رملي نمط و مراجعة دفعة سياسة خيار تركيب في واحد بدء؛ مرة تبديل سوف كتابة واحد `permission/preset` حدث، و اختراق عبر إلى اثنان عدد خيار حدث. |
| `ctx.ptcRuntime` | `seam` | [`ptc-runtime`](../packages/ptc-runtime/ptc-runtime) | [`ptc-runtime-node`](../packages/ptc-runtime/ptc-runtime-node), [`experimental-ptc-runtime-python`](../packages/experimental/ptc-runtime-python) | [`tools`](../packages/core/tools), [`workflow-ptc`](../packages/workflow/workflow-ptc) | - | استخدام Host توفير مختلف خطوة ربط تشغيل برنامج؛tools مسؤول PTC عرض،workflow-ptc مسؤول سير العمل تحرير ترتيب. |
| `ctx.fs` | `seam` | [`fs`](../packages/fs/fs) | [`fs-local`](../packages/fs/fs-local), [`fs-sandbox`](../packages/fs/fs-sandbox), [`fs-ssh`](../packages/ssh/fs-ssh) | [`tool-fs`](../packages/fs/tool-fs) | [`fs-observation-policy`](../packages/fs/fs-observation-policy) | tool-fs عبر ctx.fs تنفيذ قراءة/كتابة/تحرير؛fs-sandbox حسب مشترك صندوق رملي نمط حد تغيير؛fs-observation-policy عبر fs/* حدث بوابة مساهمة أساس في مراقبة قياس حالة فحص. |
| `ctx.compaction` | `seam` | [`compaction`](../packages/compaction/compaction) | [`compaction-basic`](../packages/compaction/compaction-basic) | [`compaction-basic`](../packages/compaction/compaction-basic) | - | أساس أساس خلفية إزالة استهلاك خطوة بعد ضغط قوة حدث و طلب خطأ استعادة حدث؛ لا وجود موجه إلى نموذج ضغط أداة. |
| `ctx.subagents` | `seam` | [`subagent`](../packages/subagent/subagent) | [`subagent-spawn-in-process`](../packages/subagent/subagent-spawn-in-process), [`subagent-fork-in-process`](../packages/subagent/subagent-fork-in-process), [`subagent-acp`](../packages/subagent/subagent-acp), [`subagent-codex`](../packages/subagent/subagent-codex), [`subagent-claude-code`](../packages/subagent/subagent-claude-code), [`subagent-dsh-sdk`](../packages/subagent/subagent-dsh-sdk) | [`tool-subagent`](../packages/subagent/tool-subagent), [`tool-subagent-control`](../packages/subagent/tool-subagent-control), [`tool-ralph`](../packages/workflow/tool-ralph) | - | مزود تنفيذ نقل؛ هذا خدمة أيضا مسؤول اختياري، أساس في Activation تأخير متابعة تحرير ترتيب،tool-subagent اختيار مرة صفة أو يمكن تأخير متابعة تفويض إرسال،tool-subagent-control نقل تمرير لاحق رسالة، بينما tool-ralph اشتراط واحد بند كل جديد بنية تحويل إخراج توجيه. |
| `ctx.agentTeams` | `core` | [`experimental-agent-team`](../packages/experimental/agent-team) | - | [`experimental-tool-agent-team`](../packages/experimental/tool-agent-team), [`experimental-client-ui-agent-team`](../packages/experimental/client-ui-agent-team) | - | مسؤول خفي صيغة Root roster، حمل دائم peer mailbox، مشترك مهمة DAG،continuable child دورة الحياة و توليد صيغة Team Remote method؛tool-agent-team توفير نموذج تحكم أداة،client-ui-agent-team تركيب متصفح contribution. |
| `ctx.inspector` | `core` | `inspector` | - | - | - | مسؤول Worker حمل إدارة CDP target، و مستقل في نقل Host و Client observation و Cordis tree query API. |
| `ctx.jobs` | `seam` | [`jobs`](../packages/jobs/jobs) | [`jobs-local`](../packages/jobs/jobs-local) | [`tool-bash`](../packages/shell/tool-bash), [`tool-terminal`](../packages/terminal/tool-terminal), [`tool-subagent`](../packages/subagent/tool-subagent), [`tool-jobs`](../packages/jobs/tool-jobs) | - | إنتاج جهة (خلفية bash،PTY إرسال و subagent تفويض إرسال) تسجيل تسجيل صحيح في تشغيل عمل؛tool-jobs هو موجه إلى نموذج تحكم جهاز، لأجل قراءة، صف خروج و إنهاء هذه عمل؛jobs-local هو عملية محلي سجل التسجيل. |
| `ctx.web` | `seam` | [`web`](../packages/web/web) | [`web-search-exa`](../packages/web/web-search-exa), [`web-search-perplexity`](../packages/web/web-search-perplexity), [`web-search-deepseek`](../packages/web/web-search-deepseek), [`web-fetch-http`](../packages/web/web-fetch-http) | [`tool-web`](../packages/web/tool-web) | - | بحث و إمساك أخذ مزود تسجيل إلى نفس عدد ctx.web seam؛tool-web مسؤول مستقر موجه إلى نموذج اسم. |
| `ctx.spillStore` | `seam` | [`spill`](../packages/spill/spill) | [`spill-local`](../packages/spill/spill-local) | [`spill-policy`](../packages/spill/spill-policy) | - | خلفية حفظ مرور كبير أداة نص، و إرجاع موجه إلى نموذج تحديد موضع معلومة و أخذ عودة تلميح؛spill-policy هو tools/post-execute مستهلك، مسؤول قرار أي وقت spill. |
| `ctx.directoryPicker` | `seam` | [`host-directory-picker`](../packages/host/directory-picker) | [`host-directory-picker-native`](../packages/host/directory-picker-native), [`host-directory-picker-browse`](../packages/host/directory-picker-browse) | [`api-workspace-controller`](../packages/api/workspace-controller) | - | حمل حكم آخر علامة تفاعل قدرة: أصلي خلفية في Host عرض ضبط تجهيز فوق فتح واحد عملية نظام اختيار جهاز، تصفح تصفح خلفية لـ تطبيق داخل متصفح توفير قائمة و إنشاء أصل لغة؛ مزدوج طرف خلفية عبر ذلك متصفح جانب ملء ملء ui-workspace دليل مسار slot(لا عبر بروتوكول إصدار). |
| `ctx.webServer` | `core` | [`host-webserver`](../packages/host/webserver) | - | [`client-connection`](../packages/client/connection), [`client-modules`](../packages/client/modules), [`client-hmr`](../packages/client/hmr) | - | عادي node:http تحميل جسم: أداة اسم توجيه سجل التسجيل، بحث جذب تحويل tap، و ساكن حالة dist رجوع؛Web نقل إضافة تسجيل ذاتي ذات توجيه. |
| `ctx.clientModules` | `core` | [`client-modules`](../packages/client/modules) | - | [`client-hmr`](../packages/client/hmr) | - | عبر زيادة كمية `dsh.client` مسح تركيب __DSH_BOOT__ مدخل رسم، توفير إضافة تركيب حزمة، و إشعار إعادة بناء/رسم تغيير حجز قراءة جهة. |
| `ctx.workflowEngine` | `seam` | [`workflow`](../packages/workflow/workflow) | [`workflow-ptc`](../packages/workflow/workflow-ptc) | [`tool-workflow`](../packages/workflow/tool-workflow), [`tool-ralph`](../packages/workflow/tool-ralph) | - | كل سياق استخدام واحد جذب محرك، و bash نفسه، كما لا يوجد أداة اسم مزود سجل التسجيل؛ عام سير العمل و ثابت Ralph مستهلك بدء تشغيل، منها agent() استدعاء عبر ctx.subagents مروحة خروج. |
| `ctx.webhookRuntime` | `core` | [`webhook`](../packages/webhook/webhook) | - | [`webhook-github`](../packages/webhook/webhook-github) | - | مزود مهايئ قسم إرسال قد إقرار إثبات تسليم؛ يمكن معلومة إضافة تسجيل مستقل عملية محلي قاعدة،runtime يأخذ غير null نتيجة تحويل لـ عادي Workspace-backed Session، لا إبقاء تسليم أو إتمام حالة. |
| `ctx.lsp` | `seam` | [`lsp`](../packages/lsp/lsp) | [`lsp-stdio`](../packages/lsp/lsp-stdio) | [`tool-lsp`](../packages/lsp/tool-lsp) | - | مزود تسجيل و اختيار، إضافة فوق تماما جيد أربعة نوع عملية معيار تحويل استعلام تنفيذ؛ هذا seam لا توفير بروتوكول هروب توليد فتحة، خلفية يجب تحويل لـ معيار تحويل طلب و نتيجة. |
| `ctx.dynamicCordisRunner` | `core` | [`cordis-host-runner`](../packages/extensions/cordis-host-runner) | - | [`tool-cordis`](../packages/extensions/tool-cordis) | - | يملك داخل تخزين تعريف سجل التسجيل،Host نصف vm صندوق رملي و request-run نحو إرجاع مسار؛ متصفح صفحة عبر ذلك Remote نطاق الأسماء في خط وصول نفس خدمة. |
| `ctx.cordisInspect` | `core` | [`cordis-host-runner`](../packages/extensions/cordis-host-runner) | - | [`tool-cordis`](../packages/extensions/tool-cordis) | - | تسجيل Host inspect مزود، مرآة مثل Client مزود manifest، و عبر حركة حالة Cordis نقل توجيه Client استعلام. |

صيانة نمط: خلط دمج نمط. خدمة من Cordis إعلان في اكتشاف؛ واجهة، تنفيذ و مستهلك زاوية لون في `scripts/gen-doc-graphs.ts` في تصنيف، و ضبط لديه كامل صفة حراسة حماية.

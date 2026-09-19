/** Pure Issue/PR validation, reference parsing, lifecycle decisions, and Project dates. */

import config from './config.json' with { type: 'json' }

const TYPES = new Set(['Idea', 'Feature', 'Bug', 'Research', 'Task'])
const PRIORITIES = ['p0', 'p1', 'p2', 'p3']
const PR_KINDS = new Set([
  'kind/feature',
  'kind/bug-fix',
  'kind/doc',
  'kind/testing',
  'kind/cleanup',
  'kind/dependency',
])
// Retired label aliases stay reserved so they cannot be recreated.
const LEGACY_LABELS = new Set([
  'kind/bug',
  'kind/documentation',
  'feature',
  'bug-fix',
  'doc',
  'cleanup',
  'testing',
  'dependencies',
  'ci',
  'cli',
  'llm',
  'web-search',
])
const TERMINAL_STATUSES = new Set(['Done', 'No action'])
const ACTIVE_STATUS_ORDER = config.statuses.filter((status) => !TERMINAL_STATUSES.has(status))
const IMPLEMENTATION_PULL_REQUEST_ACTIONS = new Set([
  'opened',
  'edited',
  'reopened',
])

for (const status of ['In progress', 'In review']) {
  if (!ACTIVE_STATUS_ORDER.includes(status)) throw new Error(`config.statuses نقص قليل ${status}`)
}
if (typeof config.lifecycleActor !== 'string' || !config.lifecycleActor) {
  throw new Error('config.lifecycleActor لم ضبط')
}
if (typeof config.priorityField !== 'string' || !config.priorityField) {
  throw new Error('config.priorityField لم ضبط')
}
if (typeof config.startDateField !== 'string' || !config.startDateField) {
  throw new Error('config.startDateField لم ضبط')
}
if (typeof config.projectTimeZone !== 'string' || !config.projectTimeZone) {
  throw new Error('config.projectTimeZone لم ضبط')
}
Intl.DateTimeFormat('en-US', { timeZone: config.projectTimeZone })

/**
 * Decide whether the human-review policy applies to a PR.
 * @param {{isDraft: boolean, authorType: string, reviewRequestCount: number, reviewCount: number}} input PR state.
 * @returns {boolean} Whether the PR policy is mandatory.
 */
export function requiresPullRequestPolicy({
  isDraft,
  authorType,
  reviewRequestCount,
  reviewCount,
}) {
  const automated = authorType === 'Bot' || authorType === 'App'
  return !isDraft && !automated && (reviewRequestCount > 0 || reviewCount > 0)
}

/**
 * Translate a repository event into one resolving-Issue lifecycle command.
 * @param {string} eventName GitHub event name.
 * @param {{action?: string, changes?: {body?: object}, review?: {state?: string}}} event GitHub event payload.
 * @returns {'implementation'|'review-requested'|'changes-requested'|null} Lifecycle command.
 */
export function resolvingIssueStatusCommand(eventName, event) {
  if (eventName === 'pull_request') {
    if (event.action === 'edited' && !event.changes?.body) return null
    if (event.action === 'review_requested') return 'review-requested'
    return IMPLEMENTATION_PULL_REQUEST_ACTIONS.has(event.action) ? 'implementation' : null
  }
  if (
    eventName === 'pull_request_review' &&
    event.action === 'submitted' &&
    event.review?.state?.toLowerCase() === 'changes_requested'
  ) {
    return 'changes-requested'
  }
  return null
}

/**
 * Plan one event-directed resolving-Issue status transition.
 * @param {string|null} currentStatus Current Project status.
 * @param {'implementation'|'review-requested'|'changes-requested'} command Lifecycle command.
 * @param {string|null} currentStatusActor Actor that last set the current Project status.
 * @returns {string|null} Status to write, or null when no permitted transition exists.
 */
export function nextResolvingIssueStatus(currentStatus, command, currentStatusActor = null) {
  let target
  if (command === 'review-requested') target = 'In review'
  else if (command === 'implementation' || command === 'changes-requested') target = 'In progress'
  else throw new Error(`لم معرفة lifecycle command:${command}`)

  const currentIndex = ACTIVE_STATUS_ORDER.indexOf(currentStatus)
  const targetIndex = ACTIVE_STATUS_ORDER.indexOf(target)
  if (
    command === 'changes-requested' &&
    currentStatus === 'In review' &&
    currentStatusActor === config.lifecycleActor
  ) {
    return target
  }
  return currentIndex >= 0 && currentIndex < targetIndex ? target : null
}

/**
 * Convert a GitHub timestamp to a Project date in one configured time zone.
 * @param {string} timestamp ISO timestamp.
 * @param {string} timeZone IANA time-zone name.
 * @returns {string} Calendar date in YYYY-MM-DD form.
 */
export function projectDate(timestamp, timeZone = config.projectTimeZone) {
  const instant = new Date(timestamp)
  if (Number.isNaN(instant.getTime())) throw new Error(`بلا فاعلية PR إنشاء وقت:${timestamp}`)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(instant)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )
  return `${parts.year}-${parts.month}-${parts.day}`
}

function stripIgnoredMarkdown(body) {
  const lines = body.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/)
  const kept = []
  let fence = null
  for (const line of lines) {
    const marker = line.match(/^\s*([\u0060~]{3,})/)
    if (marker) {
      if (fence === null) fence = marker[1][0]
      else if (marker[1][0] === fence) fence = null
      continue
    }
    if (fence === null) kept.push(line)
  }
  return kept.join('\n').replace(/\u0060[^\u0060]*\u0060/g, ' ')
}

/**
 * Parse same-repository resolving and informational references.
 * @param {{body: string, repository: string}} input PR body and repository.
 * @returns {{all: number[], resolving: number[], related: number[]}} References.
 */
export function parseReferences({ body, repository }) {
  const source = stripIgnoredMarkdown(body)
  const expected = repository.toLowerCase()
  const all = new Set()
  const resolving = new Set()
  const reference =
    /(?:([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)#|#)(\d+)|https:\/\/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)\/issues\/(\d+)/gi
  const closing =
    /\b(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s*:?\s+(?:(?:([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)#|#)(\d+)|https:\/\/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)\/issues\/(\d+))/gi

  for (const match of source.matchAll(reference)) {
    const explicit = (match[1] ?? match[3] ?? '').toLowerCase()
    const number = Number(match[2] ?? match[4])
    if (!explicit || explicit === expected) all.add(number)
  }
  for (const match of source.matchAll(closing)) {
    const explicit = (match[1] ?? match[3] ?? '').toLowerCase()
    const number = Number(match[2] ?? match[4])
    if (!explicit || explicit === expected) {
      all.add(number)
      resolving.add(number)
    }
  }
  return {
    all: [...all].sort((left, right) => left - right),
    resolving: [...resolving].sort((left, right) => left - right),
    related: [...all].filter((number) => !resolving.has(number)).sort((a, b) => a - b),
  }
}

/**
 * Retain only references that resolve to Issues rather than pull requests.
 * @param {{all: number[], resolving: number[], related: number[]}} references Parsed references.
 * @param {Map<number, unknown>} issues Resolved same-repository Issues.
 * @returns {{all: number[], resolving: number[], related: number[]}} Issue-only references.
 */
export function retainIssueReferences(references, issues) {
  return {
    all: references.all.filter((number) => issues.has(number)),
    resolving: references.resolving.filter((number) => issues.has(number)),
    related: references.related.filter((number) => issues.has(number)),
  }
}

/**
 * Validate one Issue with its Project status.
 * @param {{labels: string[], type: string|null, priority: string|null, status: string|null, state: string, stateReason: string|null}} issue Issue snapshot.
 * @returns {string[]} Validation errors.
 */
export function validateIssue(issue) {
  const errors = []
  const status = issue.status
  const invalidLabels = issue.labels.filter(isInvalidIssueLabel)

  if (invalidLabels.length > 0) {
    errors.push(`Issue لا نيل استخدام PR kind أو قديم إصدار وسم:${invalidLabels.join(', ')}`)
  }
  if (!TYPES.has(issue.type ?? '')) errors.push('Type يجب هو خمسة نوع أصلي إنجليزي نص Type لـ واحد')
  if (!status || !config.statuses.includes(status)) errors.push('Issue يجب في Project في كما أداة لديه دمج قاعدة Status')
  if (issue.priority !== null && !PRIORITIES.includes(issue.priority.toLowerCase())) {
    errors.push('Priority يجب لـ فارغ أو لـ P0–P3')
  }
  if (status === 'Done' && (issue.state !== 'closed' || issue.stateReason !== 'completed')) {
    errors.push('Done يجب مقابل Completed إغلاق سبب')
  }
  if (
    status === 'No action' &&
    (issue.state !== 'closed' || issue.stateReason !== 'not_planned')
  ) {
    errors.push('No action يجب مقابل Not planned إغلاق سبب')
  }
  if (!['Done', 'No action'].includes(status ?? '') && issue.state !== 'open') {
    errors.push(`${status} يجب مقابل فتح وضع Issue`)
  }
  return errors
}

/**
 * Identify PR kinds and retired aliases that cannot label an Issue.
 * @param {string} label Label name.
 * @returns {boolean} Whether the label is invalid for Issues.
 */
export function isInvalidIssueLabel(label) {
  return label.startsWith('kind/') || LEGACY_LABELS.has(label)
}

/**
 * Validate PR metadata and its referenced Issues.
 * @param {{authorType: string, labels: string[], references: ReturnType<typeof parseReferences>, issues: Map<number, {priority: string|null}>}} input PR snapshot.
 * @returns {string[]} Validation errors.
 */
export function validatePullRequest(input) {
  if (!requiresPullRequestPolicy(input)) return []
  const errors = []
  const kinds = input.labels.filter((label) => PR_KINDS.has(label))
  const unknownKinds = input.labels.filter(
    (label) => label.startsWith('kind/') && !PR_KINDS.has(label) && !LEGACY_LABELS.has(label),
  )
  const legacyLabels = input.labels.filter((label) => LEGACY_LABELS.has(label))
  const sourceLabels = input.labels.filter((label) => label.startsWith('source/'))
  const priorities = input.labels.filter((label) => PRIORITIES.includes(label))
  const areas = input.labels.filter((label) => label.startsWith('area/'))

  if (input.references.all.length === 0) {
    errors.push('PR متن يجب مرجع حتى قليل واحد نفس مستودع Issue؛PR تحرير رقم (يشمل كومة تراكم اعتماد PR) لا حساب Issue مرجع')
  }
  if (kinds.length !== 1) {
    errors.push(`PR يجب تماما جيد لديه واحد سماح kind/*، حالي لـ ${kinds.length}`)
  }
  if (unknownKinds.length > 0) {
    errors.push(`PR يحتوي لا دعم حمل kind/*:${unknownKinds.join(', ')}`)
  }
  if (legacyLabels.length > 0) errors.push(`PR يحتوي قديم إصدار وسم:${legacyLabels.join(', ')}`)
  if (sourceLabels.length > 0) errors.push(`source/* فقط لأجل Issue:${sourceLabels.join(', ')}`)
  if (priorities.length > 1) errors.push(`PR الأكثر كثير لديه واحد p0–p3، حالي لـ ${priorities.length}`)
  if (areas.length === 0) errors.push('PR يجب حتى قليل لديه واحد area/*')
  for (const number of input.references.all) {
    if (!input.issues.has(number)) errors.push(`#${number} لا هو نفس مستودع Issue`)
  }

  const resolving = input.references.resolving
    .map((number) => [number, input.issues.get(number)])
    .filter((entry) => entry[1])
  if (resolving.length === 0) return errors

  const issuePriorities = resolving
    .map(([, issue]) => issue.priority?.toLowerCase())
    .filter((priority) => PRIORITIES.includes(priority))
  if (priorities.length === 0 && issuePriorities.length > 0) {
    const highest = issuePriorities.sort(
      (left, right) => PRIORITIES.indexOf(left) - PRIORITIES.indexOf(right),
    )[0]
    errors.push(`PR Priority ينبغي لـ ${highest}`)
  } else if (priorities.length === 1 && issuePriorities.length !== resolving.length) {
    errors.push('لديه Priority حل قرار نوع PR اشتراط كل يتم حل قرار Issue كل ضبط Priority')
  } else if (priorities.length === 1) {
    const highest = issuePriorities.sort(
      (left, right) => PRIORITIES.indexOf(left) - PRIORITIES.indexOf(right),
    )[0]
    if (priorities[0] !== highest) errors.push(`PR Priority ينبغي لـ ${highest}`)
  }
  return errors
}

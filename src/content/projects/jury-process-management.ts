import { defineProject } from "@/domain/content/define";

/**
 * Jury Process Management Integration — PUBLISHED.
 *
 * Professional work performed under an employer. Written and approved by Randi
 * on 2026-08-09; every claim is his own.
 *
 * CONFIDENTIALITY — this is the strictest file in the repository.
 *
 * The repository is public. Publication status controls what the website
 * renders, not what GitHub serves, so everything here must be safe to read
 * directly (ADR-011, Handoff section 7.6). The systems are described by what
 * kind of thing they are rather than by name. The following must never appear:
 *   - internal project, module, or ticket identifiers
 *   - internal or partner system names
 *   - internal URLs or private repository links
 *   - customer or student data
 *   - confidential architecture detail or proprietary source
 *   - screenshots that were not sanitized and approved
 *
 * Three of Randi's decisions here are worth preserving against future editing,
 * because each one gives up something that would have read better.
 *
 * deliveryStatus is "completed", not "production". His reason: the evidence he
 * holds covers implementation, pre-production investigation, and verification —
 * not a documented production verification he personally performed. TD 9.5
 * would have required a productionConfirmation object, and he declined to
 * assert one he could not support. FAC-PROJECT-004 exists for exactly this.
 *
 * The asynchronous-synchronisation decision is stated at the level he can
 * defend and no further. He explicitly refused to name a mechanism — polling,
 * retrying, queue waits, job chaining — unless that was what he implemented.
 * Do not "improve" that passage by adding a specific technique; the vagueness
 * is the accuracy.
 *
 * technologyIds omits skill-rest-apis and skill-typescript. Both are plausible
 * and neither is confirmed for this project, so both are left out rather than
 * assumed. Add either only once the actual source is checked.
 */
export const juryProcessManagement = defineProject({
  id: "project-jury-process-management",
  slug: "jury-process-management-integration",
  title: "Jury Process Management Integration",
  summary:
    "Integrated a separate jury-management workflow with a primary academic administration " +
    "platform, coordinating session data, scheduling state, and downstream workflow steps across " +
    "application boundaries.",

  projectType: "professional",
  role: "Backend Developer — cross-application integration and workflow synchronization",
  deliveryStatus: "completed",
  period: "2026",

  context:
    "The work connected a primary academic administration platform with a separate application " +
    "responsible for jury assignment and scheduling. The overall workflow crossed both " +
    "applications: an evaluation session was created and published in the primary platform, jury " +
    "members and scheduling were managed in the jury application, and the resulting state needed " +
    "to support downstream marking workflows.\n\n" +
    "Because the workflow crossed repository and application boundaries, a step could appear " +
    "complete in one application while related data was still being synchronized in the " +
    "background. The integration therefore required more than matching API fields; the lifecycle " +
    "and timing between systems had to remain consistent.",

  problem:
    "The main problem was keeping workflow state synchronized across two applications without " +
    "leaving sessions in a partially updated state. During the integration work, a background " +
    "worker could finish before the related synchronization had fully completed, which produced " +
    "partially synchronized jury sessions and required rework.\n\n" +
    "Pre-production verification also exposed a missing workflow dependency around schedule " +
    "creation. A published session needed the corresponding schedule state so the jury workflow " +
    "could continue correctly. Separately, a lookup bug used a configurable display label as a " +
    "data key, which failed when configuration differed from the assumption in the code.",

  personalResponsibilities: [
    "Analyze the existing cross-application workflow and identify the states and synchronization points required between the two systems.",
    "Implement and adjust backend integration behavior for jury-session synchronization and the downstream workflow.",
    "Investigate an asynchronous-processing issue where worker completion occurred before related background synchronization had fully completed.",
    "Verify the end-to-end workflow in pre-production and identify the missing schedule-related dependency.",
    "Investigate and correct a lookup issue caused by relying on a configurable display label instead of a stable identifier.",
  ],

  teamResponsibilities: [
    "Frontend implementation and UI behavior were handled by the relevant frontend developers.",
    "QA owned formal validation of the completed workflow after development verification.",
    "Product and functional teams defined or clarified the expected business workflow and acceptance rules.",
  ],

  technicalApproach:
    "I started from an existing integration pattern so the new workflow would stay aligned with " +
    "established application behavior and reduce unnecessary differences. I mapped the lifecycle " +
    "across both applications, including publication, jury-session synchronization, scheduling, " +
    "and the downstream actions that depended on those states.\n\n" +
    "The integration also required treating asynchronous processing carefully. A worker reporting " +
    "completion was not automatically equivalent to the entire cross-application state being " +
    "synchronized, so I investigated the actual timing of background work instead of relying only " +
    "on the worker result.\n\n" +
    "For the configuration-dependent lookup issue, I traced the data flow back to the underlying " +
    "identifier and corrected the logic so it did not depend on a customizable display label.",

  workflowOrArchitecture:
    "1. The primary academic platform creates and publishes an evaluation session.\n" +
    "2. Session data is synchronized to the jury-management application.\n" +
    "3. Jury assignment and scheduling are managed in the jury workflow.\n" +
    "4. The published scheduling state is synchronized back into the broader workflow.\n" +
    "5. The primary platform continues with downstream marking-related tasks.\n\n" +
    "Some synchronization occurs through background processing, so end-to-end completion must " +
    "account for both the initiating worker and the related background synchronization.",

  challenges: [
    {
      title: "Asynchronous synchronization",
      description:
        "A worker could complete before related background synchronization had finished, leaving " +
        "jury-session data only partially synchronized. This exposed an assumption that job " +
        "completion and end-to-end workflow completion were the same thing.",
    },
    {
      title: "Missing workflow dependency",
      description:
        "Pre-production testing showed that the expected workflow also depended on schedule " +
        "creation at publication time. The gap was not obvious from the isolated implementation " +
        "and only became clear when the complete cross-application flow was exercised.",
    },
    {
      title: "Configuration-dependent lookup",
      description:
        "A configurable display label had been used as a data key. When the configured label " +
        "differed from the assumed value, the lookup failed and the related jury information was " +
        "not visible.",
    },
  ],

  decisionsAndTradeoffs: [
    {
      decision: "Reuse the existing integration pattern rather than introducing a different flow",
      rationale:
        "Staying close to established behavior reduced unnecessary implementation differences and " +
        "regression surface.",
      tradeoff:
        "The reused pattern also carried assumptions about asynchronous timing, so copying the " +
        "pattern was not enough; its completion semantics still needed to be validated.",
    },
    {
      decision:
        "Use a stable underlying identifier for data lookup instead of a configurable display label",
      rationale:
        "Display labels can change by configuration, while an identifier is intended to remain " +
        "stable for application logic.",
      tradeoff:
        "The implementation becomes slightly more explicit because the stable identifier must be " +
        "resolved or carried through the data flow, but it avoids behavior that changes when " +
        "labels are customized.",
    },
    {
      decision:
        "Stop treating completion of the initiating worker as proof that the related background " +
        "synchronization had also completed",
      rationale:
        "The original implementation assumed that worker completion represented end-to-end " +
        "completion. In practice, related background processing could still be running, which " +
        "left some jury sessions only partially synchronized.",
      tradeoff:
        "The workflow became more dependent on explicit synchronization state and completion " +
        "handling instead of a simpler worker-success result. This added coordination and " +
        "verification logic, but avoided treating partially synchronized data as complete.",
    },
  ],

  implementationSummary:
    "I implemented and refined backend integration behavior connecting the jury-management " +
    "workflow with the primary academic platform, covering cross-application session " +
    "synchronization, scheduling-related workflow state, and downstream processing. I also " +
    "investigated and corrected issues discovered during integration and environment " +
    "verification, including asynchronous synchronization behavior and a configuration-dependent " +
    "lookup.\n\n" +
    "Frontend UI implementation, ownership of product and business rules, and formal QA " +
    "validation were outside my primary scope; my work focused on the backend integration and " +
    "synchronization behavior between the applications.",

  testingAndVerification:
    "I verified the integration manually through the end-to-end workflow in the pre-production " +
    "environment, including session publication, synchronization, jury scheduling, and the " +
    "downstream workflow. Issues found during that verification were corrected before the flow " +
    "was validated again. QA was also involved in formal validation of the feature.\n\n" +
    "Following the workflow end to end rather than checking an isolated API response is what " +
    "exposed the missing schedule dependency and the synchronization assumptions.",

  outcome:
    "After the fixes, the connected applications could continue through the expected jury " +
    "workflow without relying on the earlier synchronization and configurable-label assumptions. " +
    "The session could move through publication, jury assignment and scheduling, and into the " +
    "downstream marking workflow with the required state available across the integration.\n\n" +
    "No performance or adoption metric was measured for this work, so none is claimed here.",

  aiUsage:
    "I used AI as part of the engineering workflow for analysis and implementation support, but I " +
    "remained responsible for validating the generated changes against the real application " +
    "behavior. One AI-generated change relied on a configurable display label as a data key; that " +
    "assumption failed when the label differed by configuration.\n\n" +
    "I investigated the actual data model, corrected the lookup to rely on a stable identifier, " +
    "and re-evaluated the surrounding flow. The incident reinforced that generated code still " +
    "needs domain-aware review, realistic test data, and verification against configurable " +
    "behavior.",

  lessonsLearned:
    "I initially reused an existing integration approach without questioning its asynchronous " +
    "assumptions deeply enough. A worker could report completion before related background " +
    "synchronization had finished, which led to partially synchronized sessions and rework. I " +
    "learned to distinguish job completion from end-to-end workflow completion and to verify " +
    "timing and state transitions across the whole integration.\n\n" +
    "I also learned not to treat written acceptance criteria as a substitute for understanding " +
    "the real operational flow. The missing schedule dependency became visible only when the " +
    "workflow was exercised end to end. I would now ask more questions about implicit " +
    "cross-system dependencies earlier, map the lifecycle before implementation, and validate " +
    "configurable data against stable identifiers rather than display labels.",

  technologyIds: [
    "skill-nodejs",
    "skill-graphql",
    "skill-mongodb",
    "skill-git",
    "skill-ai-assisted-engineering",
  ],

  confidentialityNote:
    "This case study uses generalized system names and workflow descriptions. Private source " +
    "code, internal identifiers, URLs, environment details, and company-sensitive data are " +
    "intentionally excluded.",

  confidentialityClass: "sanitized",

  // Featured second, behind the existing priority 1. Two Published projects
  // render two balanced cards on the homepage (FAC-HOME-004), and TD 9.4
  // requires a featured project to be Published — both now hold.
  featured: true,
  featuredPriority: 2,
  publicationStatus: "published",
  updatedAt: "2026-08-09",
});

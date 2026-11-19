import { defineModeIntro } from "@/domain/content/define";

/**
 * Mode intros — the hero copy for each of the three V3 modes (UX3 7). PUBLISHED.
 *
 * The wording is the V3.1 mockup's, approved by Randi on 2026-11-18. The two
 * descriptions restate his résumés: the backend one his backend work for
 * higher-education platforms, the infrastructure one his current role. Neither
 * describes how the employer's systems are wired (DEC-064).
 *
 * The infrastructure eyebrow says "Infrastructure", not the requirements'
 * "Infrastructure & Reliability": the role is a delivery and infrastructure
 * role, and "Reliability" invites an SRE reading it does not support (UX3 12).
 *
 * Every published intro must name the engineer (V3-CONT-003). Overall does it
 * in the heading, the other two in the eyebrow; a cross-record rule checks it.
 */
export const modeIntros = [
  defineModeIntro({
    id: "mode-intro-overall",
    mode: "overall",
    eyebrow: "Software Engineer · Backend & Infrastructure",
    headingLines: ["Randi Fajar", "Wicaksono"],
    action: { label: "Explore the journey", targetId: "profile" },
    publicationStatus: "published",
  }),

  defineModeIntro({
    id: "mode-intro-backend",
    mode: "backend",
    eyebrow: "Randi Fajar Wicaksono · Backend",
    headingLines: ["Behind the", "Application."],
    description:
      "Node.js, GraphQL, REST and MongoDB services, integrations and data workflows for " +
      "higher-education platforms.",
    action: { label: "Explore backend work", targetId: "backend-work" },
    publicationStatus: "published",
  }),

  defineModeIntro({
    id: "mode-intro-infrastructure",
    mode: "infrastructure",
    eyebrow: "Randi Fajar Wicaksono · Infrastructure",
    headingLines: ["Beyond", "Deployment."],
    description:
      "Jenkins delivery pipelines, Linux and Docker environments on AWS, and the " +
      "troubleshooting behind reliable releases.",
    action: { label: "Explore infrastructure work", targetId: "infrastructure-work" },
    publicationStatus: "published",
  }),
];

import { defineResume } from "@/domain/content/define";
import { RESUME_PATH } from "@/lib/constants";

/**
 * Resume — DRAFT.
 *
 * The real PDF is supplied in P30. Until then this record is Draft, so
 * FAC-RESUME-001's "exactly one active Published Resume" rule is not yet
 * satisfied — which is correct, and release validation reports it as a reason
 * the site is not launch-ready.
 *
 * isActive is true because this is the record that becomes active once the
 * real file lands; the Draft publication status is what keeps it non-public.
 * Cross-record validation in P09 checks that exactly one Resume is both active
 * and Published (FAC-RESUME-004).
 */
export const resume = defineResume({
  id: "resume-current",
  fileName: "randi-fajar-wicaksono-resume.pdf",
  fileFormat: "pdf",
  version: "DRAFT PLACEHOLDER",
  publicationDate: "2026-08-04",
  publicPath: RESUME_PATH,
  isActive: true,
  confidentialityClass: "public",
  publicationStatus: "draft",
});

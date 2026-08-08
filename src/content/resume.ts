import { defineResume } from "@/domain/content/define";
import { RESUME_PATH } from "@/lib/constants";

/**
 * Resume — PUBLISHED.
 *
 * The PDF was supplied on 2026-08-08 and Randi confirmed it carries no home
 * address, phone number, date of birth, or identity number. That confirmation
 * mattered before committing rather than before publishing: anything under
 * public/ is served by the static host regardless of this record's
 * publicationStatus, so the file becomes downloadable the moment it is
 * committed, not the moment it is Published.
 *
 * The file arrived named resume.pdf.pdf. Left alone it would have 404'd, since
 * RESUME_PATH and every Resume action point at /resume.pdf.
 *
 * FAC-RESUME-004: exactly one Resume may be both active and Published, and
 * cross-record validation enforces it. Replacing this file later means
 * replacing it in place rather than adding a second active record.
 */
export const resume = defineResume({
  id: "resume-current",
  fileName: "randi-fajar-wicaksono-resume.pdf",
  fileFormat: "pdf",
  version: "2026-08",
  publicationDate: "2026-08-08",
  publicPath: RESUME_PATH,
  isActive: true,
  confidentialityClass: "public",
  publicationStatus: "published",
});

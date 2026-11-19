import { aiPractices } from "@/content/ai-practices";
import { careerChapters } from "@/content/career";
import { contactChannels, externalProfiles } from "@/content/contact";
import { certifications, education, languages } from "@/content/credentials";
import { experience } from "@/content/experience";
import { mediaAssets } from "@/content/media";
import { modeIntros } from "@/content/modes";
import { engineeringPractices } from "@/content/practices";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { skills } from "@/content/skills";
import { toolkitGroups } from "@/content/toolkits";
import type { ContentSet } from "@/domain/content/validation";

/**
 * The real content set, assembled in one place.
 *
 * Both validation scripts and the validation tests need every content module
 * together. Each used to list the modules by hand, so a new content type had
 * to be added in three places, and missing one would have let that type skip
 * validation without any error. Adding the seven V3 types is what made that
 * visible. Typing this as `ContentSet` means a missing type is now a compile
 * error here rather than a silent gap somewhere else.
 */
export const contentSet: ContentSet = {
  profile,
  experience,
  projects,
  skills,
  aiPractices,
  resumes: [resume],
  contactChannels,
  externalProfiles,
  mediaAssets,
  modeIntros,
  careerChapters,
  education,
  certifications,
  languages,
  engineeringPractices,
  toolkitGroups,
};

import { SectionHeader } from "@/components/ui/section-header";
import { TechnologyTag } from "@/components/ui/technology-tag";
import type { SkillClassification, SkillGroup } from "@/domain/content/types";
import { getPublishedSkillGroups } from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";

const GROUP_LABEL: Record<SkillGroup, string> = {
  languages: "Languages",
  backend: "Backend",
  frontend: "Frontend",
  databases: "Databases",
  "apis-and-integration": "APIs and Integration",
  "infrastructure-and-deployment": "Infrastructure and Deployment",
  "testing-and-quality": "Testing and Quality",
  "developer-tools": "Developer Tools",
  "ai-assisted-engineering": "AI-Assisted Engineering",
};

const CLASSIFICATION_LABEL: Record<SkillClassification, string> = {
  "strong-working-skill": "Strong working skill",
  "professional-experience": "Professional experience",
  "currently-learning": "Currently learning",
};

/**
 * Technical Skills (UX 7.7).
 *
 * Grouped by discipline, each skill labelled with its evidence-oriented
 * classification.
 *
 * There is no progress bar, percentage, or star rating anywhere in this
 * section, and none is possible: the data model has no numeric proficiency
 * field to render (FAC-SKILL-003). The classification is a word, because a
 * word can be justified in an interview and a number cannot.
 *
 * Empty groups never appear — the selector omits them (FAC-HOME-005).
 */
export function SkillsSection() {
  const groups = getPublishedSkillGroups();

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-(--spacing-content) px-5 py-16 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Toolkit"
          heading="Technical Skills"
          id={SECTION_IDS.skills}
          description="Grouped by discipline and labelled by the level of real evidence behind each one."
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ group, skills: groupSkills }) => (
            <div key={group} className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-text-primary">{GROUP_LABEL[group]}</h3>

              <ul className="flex flex-col gap-2">
                {groupSkills.map((skill) => (
                  <li key={skill.id} className="flex flex-wrap items-center gap-2">
                    <TechnologyTag name={skill.name} />
                    <span className="text-xs text-text-muted">
                      {CLASSIFICATION_LABEL[skill.classification]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

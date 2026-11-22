/**
 * Counts in words, for headings that say how many things follow them.
 *
 * The number is always derived from the content and never typed into the
 * heading, so the heading cannot drift from what it introduces: "Three
 * chapters" stays true only while three chapters are published.
 */

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/** 3 → "three". Ten and above, and anything that is not a whole number, stay digits. */
export function countInWords(count: number): string {
  return WORDS[count] ?? String(count);
}

/** (3, "chapter") → "Three chapters"; (1, "chapter") → "One chapter". */
export function countedNoun(count: number, singular: string, plural = `${singular}s`): string {
  const word = countInWords(count);

  return `${word.charAt(0).toUpperCase()}${word.slice(1)} ${count === 1 ? singular : plural}`;
}

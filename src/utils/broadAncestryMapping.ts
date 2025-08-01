export const BROAD_ANCESTRY_MAPPING: Record<string, string> = {
"Asian unspecified":"Additional Asian Ancestries",
"Central Asian, South Asian":"Additional Asian Ancestries",
"Other admixed ancestry":"Additional Asian Ancestries",
"South Asian, South East Asian, East Asian":"Additional Asian Ancestries",
"South East Asian":"Additional Asian Ancestries",
"Asian unspecified, Oceanian":"Additional Diverse Ancestries",
"Native American":"Additional Diverse Ancestries",
"Oceanian":"Additional Diverse Ancestries",
"Other":"Additional Diverse Ancestries",
"African American or Afro-Caribbean":"African",
"African American or Afro-Caribbean, African unspecified":"African",
"African American or Afro-Caribbean, Sub-Saharan African":"African",
"African American or Afro-Caribbean,African unspecified":"African",
"African unspecified":"African",
"African unspecified, African American or Afro-Caribbean":"African",
"Sub-Saharan African":"African",
"Sub-Saharan African, African American or Afro-Caribbean":"African",
"Not reported":"Not Reported",
"East Asian":"East Asian",
"European":"European",
"Greater Middle Eastern (Middle Eastern, North African or Persian)":"Greater Middle Eastern",
"Hispanic or Latin American":"Hispanic or Latin American",
"African American or Afro-Caribbean, Asian unspecified":"Multi-Ancestry (excluding European)",
"African American or Afro-Caribbean, Hispanic or Latin American":"Multi-Ancestry (excluding European)",
"East Asian, Asian unspecified":"Multi-Ancestry (excluding European)",
"East Asian, NR":"Multi-Ancestry (excluding European)",
"East Asian, South Asian":"Multi-Ancestry (excluding European)",
"Hispanic or Latin American, African unspecified":"Multi-Ancestry (excluding European)",
"Hispanic or Latin American, African unspecified, Asian unspecified, NR":"Multi-Ancestry (excluding European)",
"Hispanic or Latin American, Native American":"Multi-Ancestry (excluding European)",
"NR, Hispanic or Latin American, African unspecified, Asian unspecified":"Multi-Ancestry (excluding European)",
"South Asian, East Asian, African American or Afro-Caribbean, Hispanic or Latin American":"Multi-Ancestry (excluding European)",
"South Asian, East Asian, African unspecified":"Multi-Ancestry (excluding European)",
"South Asian,East Asian":"Multi-Ancestry (excluding European)",
"African American or Afro-Caribbean, African unspecified, European":"Multi-Ancestry (including European)",
"African American or Afro-Caribbean, African unspecified, European, East Asian, Hispanic or Latin American, South Asian":"Multi-Ancestry (including European)",
"African American or Afro-Caribbean, East Asian, European, Hispanic or Latin American, South Asian":"Multi-Ancestry (including European)",
"African American or Afro-Caribbean, East Asian, European, Hispanic or Latin American, South Asian, NR":"Multi-Ancestry (including European)",
"African American or Afro-Caribbean, East Asian, European, Hispanic or Latin American, South Asian, Sub-Saharan African":"Multi-Ancestry (including European)",
"African American or Afro-Caribbean, European, Hispanic or Latin American":"Multi-Ancestry (including European)",
"African unspecified, East Asian, European, Hispanic or Latin American, South Asian":"Multi-Ancestry (including European)",
"African unspecified, Hispanic or Latin American, European, Asian unspecified, NR":"Multi-Ancestry (including European)",
"African unspecified,Hispanic or Latin American,European,South Asian,Central Asian,Greater Middle Eastern (Middle Eastern, North African or Persian),East Asian":"Multi-Ancestry (including European)",
"European, African American or Afro-Caribbean, East Asian, Hispanic or Latin American, South Asian":"Multi-Ancestry (including European)",
"European, African American or Afro-Caribbean, Hispanic or Latin American":"Multi-Ancestry (including European)",
"European, African American or Afro-Caribbean, Hispanic or Latin American, East Asian, South Asian":"Multi-Ancestry (including European)",
"European, African American or Afro-Caribbean, Hispanic or Latin American, South Asian":"Multi-Ancestry (including European)",
"European, African unspecified, Asian unspecified, NR":"Multi-Ancestry (including European)",
"European, African unspecified, Asian unspecified, Oceanian, Hispanic or Latin American, Other, Not reported":"Multi-Ancestry (including European)",
"European, African unspecified, Asian unspecified, Other admixed ancestry, Not reported":"Multi-Ancestry (including European)",
"European, African unspecified, East Asian, European, Hispanic or Latin American":"Multi-Ancestry (including European)",
"European, African unspecified, East Asian, Hispanic or Latin American":"Multi-Ancestry (including European)",
"European, African unspecified, East Asian, South Asian, Greater Middle Eastern (Middle Eastern, North African or Persian), Hispanic or Latin American":"Multi-Ancestry (including European)",
"European, African unspecified, East Asian, South Asian, Not reported":"Multi-Ancestry (including European)",
"European, African unspecified, Hispanic or Latin American, East Asian, South Asian":"Multi-Ancestry (including European)",
"European, Asian unspecified":"Multi-Ancestry (including European)",
"European, Central Asian":"Multi-Ancestry (including European)",
"European, East Asian, African unspecified, Hispanic or Latin American, South Asian":"Multi-Ancestry (including European)",
"European, East Asian, African unspecified, South Asian, Greater Middle Eastern (Middle Eastern, North African or Persian)":"Multi-Ancestry (including European)",
"European, East Asian, Hispanic or Latin American, African unspecified, South Asian":"Multi-Ancestry (including European)",
"European, East Asian, South Asian, Asian unspecified, NR":"Multi-Ancestry (including European)",
"European, Hispanic or Latin American":"Multi-Ancestry (including European)",
"European, Hispanic or Latin American, African American or Afro-Caribbean":"Multi-Ancestry (including European)",
"European, Hispanic or Latin American, African unspecified, East Asian, Oceanian, Not reported":"Multi-Ancestry (including European)",
"European, Not reported":"Multi-Ancestry (including European)",
"European, NR":"Multi-Ancestry (including European)",
"European, Other":"Multi-Ancestry (including European)",
"European, South Asian":"Multi-Ancestry (including European)",
"European, South Asian, African unspecified, East Asian, Other admixed ancestry, NR":"Multi-Ancestry (including European)",
"European, South Asian, African unspecified, Other admixed ancestry":"Multi-Ancestry (including European)",
"European, South Asian, East Asian, African American or Afro-Caribbean":"Multi-Ancestry (including European)",
"European, South Asian, NR":"Multi-Ancestry (including European)",
"European, South East Asian, East Asian, South Asian, African American or Afro-Caribbean, Native American, Greater Middle Eastern (Middle Eastern, North African or Persian), Hispanic or Latin American, Not reported":"Multi-Ancestry (including European)",
"NR, European":"Multi-Ancestry (including European)",
"NR":"Not Reported",
"South Asian":"South Asian",
"East Asian, European":"East Asian"
  };
  

  export function normalizeAncestryBroad(raw: string): string {
    return raw
      .normalize('NFD') // remove accents
      .replace(/[\u0300-\u036f]/g, '') // remove combining characters
      .replace(/[.,;]/g, '') // remove punctuation
      .replace(/\s+/g, ' ') // collapse whitespasce
      .trim()
  }
  
export function getBroadAncestryLabelFromRaw(raw: any): string | null {
  const normalized = raw?.samples?.[0]?.ancestry_broad ?? null
  return BROAD_ANCESTRY_MAPPING[normalized] ?? null
}
export interface BroadAncestryCategoryData {
  id: number;
  label: string;
}

export interface AncestrySelector {
  id: number;
  name: string;
  numberOfSNP: number | null;
  pgscId: string | null;
  pgscURL: string | null;
  publicationId: number;
  broadAncestryCategories: {
    broadAncestryCategory: BroadAncestryCategoryData;
  }[];
}

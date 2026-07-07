export type SavedViewListItem = {
  id: string;
  name: string;
  description: string | null;
  nameFilter: string | null;
  tagIds: string[];
  createdAt: Date;
};

export type FolderType = {
  _id: string;
  name: string;
  createdAt: string;
  isFolder: boolean;
  parent: string;
  last_edit: string;
  size: string;
  type?: string;
};

type PageNavigation = {
  path: string;
  id: string;
};

type NavigationContextType = {
  pageNavigation: PageNavigation[] | null;
  setPageNavigation: React.Dispatch<
    React.SetStateAction<PageNavigation[] | null>
  >;
};

type WebSocketContextType = {
  recentFiles: FolderType[] | null;
  sendFile: (fileData: FolderType) => void;
};

export type RecentFileType = {
  name: string;
  _id: string;
  timestamp: string;
};

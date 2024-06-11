import { FolderType } from "./types";

export const Folders: FolderType[] = [
  {
    _id: "1",
    name: "Documents",
    createdAt: "2023-01-15T09:30:00Z",
    isFolder: true,
    parent: "0",
    lastEdit: "2023-05-10T12:45:00Z",
    size: "2GB",
  },
  {
    _id: "2",
    name: "Photos",
    createdAt: "2023-02-20T14:15:00Z",
    isFolder: true,
    parent: "0",
    lastEdit: "2023-04-22T10:00:00Z",
    size: "5GB",
  },
  {
    _id: "3",
    name: "Work",
    createdAt: "2023-03-10T08:00:00Z",
    isFolder: true,
    parent: "0",
    lastEdit: "2023-05-18T16:30:00Z",
    size: "3GB",
  },
  {
    _id: "4",
    name: "Vacation.jpg",
    createdAt: "2023-03-25T11:00:00Z",
    isFolder: false,
    parent: "2",
    lastEdit: "2023-04-01T09:00:00Z",
    size: "1.5MB",
  },
  {
    _id: "5",
    name: "Resume.docx",
    createdAt: "2023-04-12T13:30:00Z",
    isFolder: false,
    parent: "3",
    lastEdit: "2023-05-01T15:20:00Z",
    size: "200KB",
  },
  {
    _id: "6",
    name: " Proposal.pdf",
    createdAt: "2023-02-05T10:00:00Z",
    isFolder: false,
    parent: "3",
    lastEdit: "2023-05-15T14:10:00Z",
    size: "500KB",
  },
];

export const Files: FolderType[] = [
  {
    _id: "1",
    name: "Documents.txt",
    createdAt: "2023-01-15T09:30:00Z",
    isFolder: false,
    parent: "0",
    lastEdit: "2023-05-10T12:45:00Z",
    size: "12 KB",
  },
  {
    _id: "2",
    name: "notes.txt",
    createdAt: "2023-01-15T09:30:00Z",
    isFolder: false,
    parent: "0",
    lastEdit: "2023-05-10T12:45:00Z",
    size: "12 KB",
  },
  {
    _id: "3",
    name: "DSA.doc",
    createdAt: "2023-01-15T09:30:00Z",
    isFolder: false,
    parent: "0",
    lastEdit: "2023-05-10T12:45:00Z",
    size: "12 KB",
  },
];

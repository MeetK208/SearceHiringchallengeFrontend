export interface Collaborator {
  id: number;
  userId: number;
  projectId: number;
  name:string;
}

export interface Project {
  projectId: number;
  user: number;
  collaborators: Collaborator[];
  last_edited_by: string | null;
  projectName: string;
  projectDesc: string;
  totalPosition: number;
  budget: string;
  role: string;
  last_updated_timestamp: string;
  last_edited_by_userId: number | null;
}

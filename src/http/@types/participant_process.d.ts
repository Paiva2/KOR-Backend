export interface IParticipantProcessSave {
  processId: string;
  participantId: string;
}

export interface IParticipantProcess {
  id: string;
  processId: string;
  participantId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IParticipantProcessModel {
  id: string;
  process_id: string;
  participant_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

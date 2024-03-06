import { ParticipantType } from "./enums";
import {
  IParticipant,
  IParticipantModel,
  IParticipantModelAlias,
} from "./participant";

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
  participant?: IParticipant;
}

export interface IParticipantProcess {
  id: string;
  processId: string;
  participantId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  participant?: IParticipant;
}

export interface IParticipantProcessModel {
  id: string;
  process_id: string;
  participant_id: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
  participant_id: string;
  participant_full_name: string;
  participant_email: string;
  participant_document: string;
  participant_phone: string;
  participant_type: ParticipantType;
  participant_created_at: Date;
  participant_updated_at: Date;
  participant_deleted_at: Date | null;
}

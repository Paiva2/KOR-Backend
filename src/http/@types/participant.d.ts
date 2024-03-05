import { ParticipantType } from "./enums";

export interface IParticipantSave {
  name: string;
  email: string;
  phone: string;
  document: string;
  type: ParticipantType;
}

export interface IParticipant {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: ParticipantType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IParticipantModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: ParticipantType;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

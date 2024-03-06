import { ParticipantType } from "./enums";
import {
  IParticipantProcess,
  IParticipantProcessModel,
} from "./participant_process";

export interface IProcessSave {
  number: string;
  causeValue: string;
  type: ProcessType;
  quoteDate: Date;
  audienceDate: Date;
  forum: string;
  city: strig;
  state: string;
}

export interface IProcess {
  id: string;
  number: string;
  causeValue: string;
  type: ProcessType;
  quoteDate: Date;
  audienceDate: Date;
  forum: string;
  city: strig;
  state: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  participantProcess?: IParticipantProcess[];
}

export interface IProcessModel {
  id: string;
  number: string;
  cause_value: string;
  type: ProcessType;
  quote_date: Date;
  audience_date: Date;
  forum: string;
  city: strig;
  state: string;
  client_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  participantProcess: IParticipantProcessModel[];
}

export interface IProcessUpdate {
  causeValue?: string;
  type?: ProcessType;
  quoteDate?: Date;
  audienceDate?: Date;
  forum?: string;
  city?: strig;
  state?: string;
}

export interface IProcessClientAndParticipantModel {
  id: string;
  number: string;
  cause_value: string;
  type: ProcessType;
  quote_date: Date;
  audience_date: Date;
  forum: string;
  city: strig;
  state: string;
  client_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  client_id: string;
  client_name: string;
  client_cnpj: string;
  client_created_at: Date;
  client_updated_at: Date;
  client_deleted_at: Date | null;
  participant_id: string;
  participant_full_name: string;
  participant_email: string;
  participant_phone: string;
  participant_document: string;
  participant_type: ParticipantType;
  participant_created_at: Date;
  participant_updated_at: Date;
  participant_deleted_at: Date | null;
}

export interface IProcessClientAndParticipant {
  id: string;
  number: string;
  causeValue: string;
  type: ProcessType;
  quoteDate: Date;
  audienceDate: Date;
  forum: string;
  city: strig;
  state: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  client: {
    id: string;
    fullName: string;
    cnpj: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
  participantProcess: {
    id: string;
    name: string;
    email: string;
    phone: string;
    document: string;
    type: ParticipantType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }[];
}

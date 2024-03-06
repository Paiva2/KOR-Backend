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

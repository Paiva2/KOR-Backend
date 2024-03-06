import type {
  IParticipantProcess,
  IParticipantProcessSave,
} from "../@types/participant_process";

export default interface ParticipantProcessRepository {
  findParticipant(dto: {
    participantId: string;
    processId: string;
  }): Promise<IParticipantProcess | null>;

  save(dto: IParticipantProcessSave): Promise<IParticipantProcess>;
}

import { randomUUID } from "crypto";
import {
  IParticipantProcess,
  IParticipantProcessSave,
} from "../../@types/participant_process";
import ParticipantProcessRepository from "../../repositories/participantProcessRepository";

export default class InMemoryParticipantProcessRepository
  implements ParticipantProcessRepository
{
  public participantsProcess: IParticipantProcess[] = [];

  async save(dto: IParticipantProcessSave): Promise<IParticipantProcess> {
    const newParticipantProcess: IParticipantProcess = {
      id: randomUUID(),
      participantId: dto.participantId,
      processId: dto.processId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.participantsProcess.push(newParticipantProcess);

    return newParticipantProcess;
  }

  async findParticipant(dto: {
    participantId: string;
    processId: string;
  }): Promise<IParticipantProcess | null> {
    return (
      this.participantsProcess.find(
        (pp) =>
          pp.participantId === dto.participantId &&
          pp.processId === dto.processId
      ) ?? null
    );
  }
}

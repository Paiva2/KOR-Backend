import { randomUUID } from "crypto";
import {
  IParticipantProcess,
  IParticipantProcessSave,
} from "../../@types/participant_process";
import ParticipantProcessRepository from "../../repositories/participantProcessRepository";
import InMemoryParticipantsRepository from "./inMemoryParticipantsRepository";

export default class InMemoryParticipantProcessRepository
  implements ParticipantProcessRepository
{
  public participantsProcess: IParticipantProcess[] = [];

  private participantRepository: InMemoryParticipantsRepository;

  public constructor(participantRepository: InMemoryParticipantsRepository) {
    this.participantRepository = participantRepository;
  }

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

  public async findAllByProcessId(
    processId: string
  ): Promise<IParticipantProcess[]> {
    let findParticipantsProcess = this.participantsProcess.filter(
      (participant) => participant.processId === processId
    );

    findParticipantsProcess = findParticipantsProcess.map((pp) => {
      const findParticipant = this.participantRepository?.participants.find(
        (participant) => participant.id === pp.participantId
      );

      if (findParticipant) {
        pp.participant = findParticipant;
      }

      return pp;
    });

    return findParticipantsProcess;
  }

  public async findAllProcessParticipantsById(
    participantId: string
  ): Promise<IParticipantProcess[]> {
    let findParticipantProcess = this.participantsProcess.filter(
      (participant) => participant.participantId === participantId
    );

    findParticipantProcess = findParticipantProcess.map((pp) => {
      const findParticipant = this.participantRepository?.participants.find(
        (participant) => participant.id === pp.participantId
      );

      if (findParticipant) {
        pp.participant = findParticipant;
      }

      return pp;
    });

    return findParticipantProcess;
  }

  public async findAllProcessParticipants({
    page,
    perPage,
    processId,
  }: {
    processId: string;
    page: number;
    perPage: number;
  }): Promise<{
    page: number;
    perPage: number;
    participantsProcess: IParticipantProcess[];
  }> {
    const list = await this.findAllByProcessId(processId);

    return {
      page,
      perPage,
      participantsProcess: list.slice((page - 1) * perPage, perPage * page),
    };
  }
}

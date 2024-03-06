import { randomUUID } from "crypto";
import { IProcessSave, IProcess, IProcessUpdate } from "../../@types/process";
import ProcessRepository from "../../repositories/processRepository";
import InMemoryParticipantProcessRepository from "./inMemoryParticipantProcessRepository";

export default class InMemoryProcessRepository implements ProcessRepository {
  public process: IProcess[] = [];
  private participantProcessRepository: InMemoryParticipantProcessRepository;

  public constructor(
    participantProcessRepository: InMemoryParticipantProcessRepository
  ) {
    this.participantProcessRepository = participantProcessRepository;
  }

  async save(clientId: string, dto: IProcessSave): Promise<IProcess> {
    const newProcess: IProcess = {
      id: randomUUID(),
      audienceDate: dto.audienceDate,
      causeValue: dto.causeValue,
      city: dto.city,
      state: dto.state,
      type: dto.type,
      forum: dto.forum,
      number: dto.number,
      quoteDate: dto.quoteDate,
      clientId: clientId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.process.push(newProcess);

    return newProcess;
  }

  public async findByNumber(dto: string): Promise<IProcess | null> {
    const find = this.process.find((process) => process.number === dto);

    if (!find) return null;

    const findParticipantsFromProcess =
      this.participantProcessRepository.participantsProcess.filter(
        (pp) => pp.id === find.id
      );

    return {
      ...find,
      participantProcess: findParticipantsFromProcess,
    };
  }

  public async findById(dto: string): Promise<IProcess | null> {
    const find = this.process.find((process) => process.id === dto);

    if (!find) return null;

    const findParticipantsFromProcess =
      await this.participantProcessRepository.findAllByProcessId(find.id);

    return {
      ...find,
      participantProcess: findParticipantsFromProcess,
    };
  }

  public async updateProcess(
    processId: string,
    dto: IProcessUpdate
  ): Promise<IProcess> {
    let updatedProcess = {} as IProcess;

    this.process = this.process.map((process) => {
      if (process.id === processId) {
        process = {
          ...process,
          ...dto,
          updatedAt: new Date(),
        };

        updatedProcess = process;
      }

      return process;
    });

    console.log(updatedProcess);

    return updatedProcess;
  }
}

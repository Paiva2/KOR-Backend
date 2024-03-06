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

    return updatedProcess;
  }

  public async delete(dto: string): Promise<IProcess> {
    let deletedProcess = {} as IProcess;

    this.process = this.process.map((process) => {
      if (process.id === dto) {
        process = {
          ...process,
          updatedAt: new Date(),
          deletedAt: new Date(),
        };

        deletedProcess = process;
      }

      return process;
    });

    return deletedProcess;
  }

  private async handleParticipantQuery(participantId: string) {
    const listOfProcess: IProcess[] = [];

    const participantsWithQueryId =
      await this.participantProcessRepository.findAllProcessParticipantsById(
        participantId
      );

    for await (let pp of participantsWithQueryId) {
      const findProcess = this.process.find(
        (process) => process.id === pp.processId
      );

      if (findProcess) {
        const findParticipantsFromProcess =
          await this.participantProcessRepository.findAllByProcessId(
            findProcess.id
          );

        findProcess.participantProcess = findParticipantsFromProcess;

        listOfProcess.push(findProcess);
      }
    }

    return listOfProcess;
  }

  public async listAll(query: {
    client?: string | undefined;
    participant?: string | undefined;
    page: string;
    perPage: string;
  }): Promise<{ page: number; perPage: number; list: IProcess[] }> {
    let list = [] as IProcess[];

    if (!query.client && !query.participant) {
      for await (let process of this.process) {
        const getProcess = await this.findById(process.id);

        if (getProcess) {
          list.push(getProcess);
        }
      }
    }

    if (query.client && query.participant) {
      const listWithClients = this.process.filter(
        (process) => process.clientId === query.client
      );

      const listWithParticipants = await this.handleParticipantQuery(
        query.participant
      );

      list = [...new Set(listWithClients.concat(listWithParticipants))];
    } else if (query.client) {
      const listOfProcessWithClient = this.process.filter(
        (process) => process.clientId === query.client
      );

      for await (let process of listOfProcessWithClient) {
        const getProcess = await this.findById(process.id);

        if (getProcess) {
          list.push(getProcess);
        }
      }
    } else if (query.participant) {
      list = await this.handleParticipantQuery(query.participant);
    }

    const page = +query.page;
    const perPage = +query.perPage;

    return {
      page,
      perPage,
      list: list.slice((page - 1) * perPage, perPage * page),
    };
  }
}

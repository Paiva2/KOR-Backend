import { randomUUID } from "crypto";
import { IProcessSave, IProcess } from "../../@types/process";
import ProcessRepository from "../../repositories/processRepository";

export default class InMemoryProcessRepository implements ProcessRepository {
  public process: IProcess[] = [];

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
    return this.process.find((process) => process.number === dto) ?? null;
  }
}

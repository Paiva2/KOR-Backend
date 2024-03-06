import type { IProcess, IProcessSave, IProcessUpdate } from "../@types/process";

export default interface ProcessRepository {
  save(clientId: string, dto: IProcessSave): Promise<IProcess>;

  findByNumber(dto: string): Promise<IProcess | null>;

  findById(dto: string): Promise<IProcess | null>;

  listAll(query: {
    client?: string;
    participant?: string;
    page: string;
    perPage: string;
  }): Promise<{
    page: number;
    perPage: number;
    list: IProcess[];
  }>;

  updateProcess(processId: string, dto: IProcessUpdate): Promise<IProcess>;

  delete(dto: string): Promise<IProcess>;
}

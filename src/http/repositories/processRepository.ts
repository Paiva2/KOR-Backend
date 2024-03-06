import type { IProcess, IProcessSave, IProcessUpdate } from "../@types/process";

export default interface ProcessRepository {
  save(clientId: string, dto: IProcessSave): Promise<IProcess>;

  findByNumber(dto: string): Promise<IProcess | null>;

  findById(dto: string): Promise<IProcess | null>;

  updateProcess(processId: string, dto: IProcessUpdate): Promise<IProcess>;

  delete(dto: string): Promise<IProcess>;
}

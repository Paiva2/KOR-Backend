import type { IProcess, IProcessSave } from "../@types/process";

export default interface ProcessRepository {
  save(clientId: string, dto: IProcessSave): Promise<IProcess>;

  findByNumber(dto: string): Promise<IProcess | null>;

  findById(dto: string): Promise<IProcess | null>;
}

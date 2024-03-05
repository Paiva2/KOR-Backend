import { IClient, IClientSave } from "../@types/client";

export default interface ClientRepository {
  save(dto: IClientSave): Promise<IClient>;

  findByCnpj(dto: string): Promise<IClient | null>;

  findById(dto: string): Promise<IClient | null>;
}

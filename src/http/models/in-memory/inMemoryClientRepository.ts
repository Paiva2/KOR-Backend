import { randomUUID } from "crypto";
import { IClientSave, IClient } from "../../@types/client";
import ClientRepository from "../../repositories/clientRepository";

export default class InMemoryClientRepository implements ClientRepository {
  public clients: IClient[] = [];

  public async save(dto: IClientSave): Promise<IClient> {
    const newClient: IClient = {
      id: randomUUID(),
      cnpj: dto.cnpj,
      fullName: dto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.clients.push(newClient);

    return newClient;
  }

  public async findByCnpj(dto: string): Promise<IClient | null> {
    return this.clients.find((client) => client.cnpj === dto) ?? null;
  }

  public async findById(dto: string): Promise<IClient | null> {
    return this.clients.find((client) => client.id === dto) ?? null;
  }
}

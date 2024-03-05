import type { IClient } from "../../@types/client";
import ConflictException from "../../exceptions/conflictEsception";
import ClientRepository from "../../repositories/clientRepository";
import ClientDtoCheck from "./clientDtoCheck";

export default class RegisterClientService {
  private dtoCheck = new ClientDtoCheck();

  public constructor(private readonly clientRepository: ClientRepository) {}

  public async exec(dto: { name: string; cnpj: string }): Promise<IClient> {
    this.dtoCheck.registerClientDto(dto);

    const doesClientExists = await this.clientRepository.findByCnpj(dto.cnpj);

    if (doesClientExists) {
      throw new ConflictException("A client with this CNPJ already exists.");
    }

    const creation = await this.clientRepository.save(dto);

    return creation;
  }
}

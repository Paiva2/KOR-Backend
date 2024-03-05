import type { IClient } from "../../@types/client";
import NotFoundException from "../../exceptions/notFoundException";
import ClientRepository from "../../repositories/clientRepository";
import ClientDtoCheck from "./clientDtoCheck";

export default class AuthClientService {
  private dtoCheck = new ClientDtoCheck();

  public constructor(private readonly clientRepository: ClientRepository) {}

  public async exec(dto: { cnpj: string }): Promise<IClient> {
    this.dtoCheck.authClientDto(dto);

    const doesClientExists = await this.clientRepository.findByCnpj(dto.cnpj);

    if (!doesClientExists) {
      throw new NotFoundException("Client not found.");
    }

    return doesClientExists;
  }
}

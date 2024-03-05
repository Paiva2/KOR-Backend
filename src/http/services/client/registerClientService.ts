import { IClient } from "../../@types/client";
import BadRequestException from "../../exceptions/badRequestException";
import ConflictException from "../../exceptions/conflictEsception";
import ClientRepository from "../../repositories/clientRepository";
import DtoCheck from "./dtoCheck";

export default class RegisterClientService {
  private dtoCheck = new DtoCheck();

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

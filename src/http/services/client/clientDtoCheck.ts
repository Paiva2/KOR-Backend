import BadRequestException from "../../exceptions/badRequestException";
import cnpjValidator from "../../utils/cnpjValidator";

export default class ClientDtoCheck {
  public constructor() {}

  public registerClientDto(dto: { name: string; cnpj: string }) {
    if (!dto.name) {
      throw new BadRequestException("Name can't be empty.");
    }

    if (!dto.cnpj) {
      throw new BadRequestException("Cnpj can't be empty.");
    }

    if (!cnpjValidator(dto.cnpj)) {
      throw new BadRequestException(
        "Invalid cnpj format. Valid format ex: XX.XXX.XXX/XXXX-XX."
      );
    }
  }
}

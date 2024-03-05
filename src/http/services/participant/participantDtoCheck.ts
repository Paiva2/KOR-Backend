import { IParticipantSave } from "../../@types/participant";
import BadRequestException from "../../exceptions/badRequestException";
import documentValidator from "../../utils/documentValidator";
import emailValidator from "../../utils/emailValidator";
import phoneValidator from "../../utils/phoneValidator";

export default class ParticipantDtoCheck {
  public constructor() {}

  public registerParticipantDtoCheck(dto: IParticipantSave) {
    if (!dto.document) {
      throw new BadRequestException("document can't be empty.");
    }

    if (!documentValidator(dto.document)) {
      throw new BadRequestException("Invalid document.");
    }

    if (!dto.email) {
      throw new BadRequestException("email can't be empty.");
    }

    if (!emailValidator(dto.email)) {
      throw new BadRequestException(
        "Invalid e-mail format. Valid format ex: example@email.com."
      );
    }

    if (!dto.name) {
      throw new BadRequestException("name can't be empty.");
    }

    if (!dto.phone) {
      throw new BadRequestException("phone can't be empty.");
    }

    if (!phoneValidator(dto.phone)) {
      throw new BadRequestException(
        "Invalid phone format. Valid format ex: (99) 9 1234-5678"
      );
    }

    if (!dto.type) {
      throw new BadRequestException("type can't be empty.");
    }
  }
}

import type { IParticipantProcessSave } from "../../@types/participant_process";
import BadRequestException from "../../exceptions/badRequestException";

export default class ProcessParticipantDtoCheck {
  public constructor() {}

  public insertProcessParticipantDtoCheck(dto: IParticipantProcessSave) {
    if (!dto.participantId) {
      throw new BadRequestException("Invalid participant id.");
    }

    if (!dto.processId) {
      throw new BadRequestException("Invalid process id.");
    }
  }
}

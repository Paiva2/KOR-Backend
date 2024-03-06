import { IProcessSave } from "../../@types/process";
import BadRequestException from "../../exceptions/badRequestException";

export default class ProcessDtoCheck {
  public constructor() {}

  public updateProcessInfosDtoCheck(processId: string, clientId: string) {
    if (!processId) {
      throw new BadRequestException("processId can't be empty.");
    }

    if (!clientId) {
      throw new BadRequestException("processId can't be empty.");
    }
  }

  public createProcessDtoCheck(clientId: string, dto: IProcessSave) {
    if (!dto.audienceDate) {
      throw new BadRequestException("Invalid audience date.");
    }

    if (!dto.causeValue) {
      throw new BadRequestException("Invalid cause value.");
    }

    if (!dto.city) {
      throw new BadRequestException("Invalid process city.");
    }

    if (!clientId) {
      throw new BadRequestException("Invalid process client id.");
    }

    if (!dto.forum) {
      throw new BadRequestException("Invalid process forum.");
    }

    if (!dto.number) {
      throw new BadRequestException("Invalid process number.");
    }

    if (!dto.quoteDate) {
      throw new BadRequestException("Invalid process quote date.");
    }

    if (!dto.state) {
      throw new BadRequestException("Invalid process state.");
    }

    if (!dto.type) {
      throw new BadRequestException("Invalid process type.");
    }
  }
}

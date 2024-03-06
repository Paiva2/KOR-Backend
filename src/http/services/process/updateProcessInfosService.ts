import type { IProcess, IProcessUpdate } from "../../@types/process";
import ConflictException from "../../exceptions/conflictEsception";
import ForbiddenException from "../../exceptions/forbiddenException";
import NotFoundException from "../../exceptions/notFoundException";
import ClientRepository from "../../repositories/clientRepository";
import ProcessRepository from "../../repositories/processRepository";
import ProcessDtoCheck from "./processDtoCheck";

export default class UpdateProcessInfosService {
  private dtoCheck = new ProcessDtoCheck();

  public constructor(
    private readonly clientRepository: ClientRepository,
    private readonly processRepository: ProcessRepository
  ) {}

  public async exec(
    clientId: string,
    processId: string,
    dto: IProcessUpdate
  ): Promise<IProcess> {
    this.dtoCheck.updateProcessInfosDtoCheck(processId, clientId);

    if (dto.audienceDate && dto.audienceDate < new Date()) {
      throw new ConflictException("Audience date can't be in the past.");
    }

    const doesClientExists = await this.clientRepository.findById(clientId);

    if (!doesClientExists) {
      throw new NotFoundException("Client not found.");
    }

    const doesProcessExists = await this.processRepository.findById(processId);

    if (!doesProcessExists) {
      throw new NotFoundException("Process not found.");
    }

    if (doesProcessExists.deletedAt !== null) {
      throw new ForbiddenException("Process deactivated.");
    }

    if (doesClientExists.id !== doesProcessExists.clientId) {
      throw new ForbiddenException(
        "Only process owners can update their processes."
      );
    }

    const performUpdate = await this.processRepository.updateProcess(
      processId,
      dto
    );

    return performUpdate;
  }
}

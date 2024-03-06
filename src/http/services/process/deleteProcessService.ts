import type { IProcess, IProcessSave } from "../../@types/process";
import ConflictException from "../../exceptions/conflictEsception";
import ForbiddenException from "../../exceptions/forbiddenException";
import NotFoundException from "../../exceptions/notFoundException";
import ClientRepository from "../../repositories/clientRepository";
import ProcessRepository from "../../repositories/processRepository";
import ProcessDtoCheck from "./processDtoCheck";

export default class DeleteProcessService {
  private dtoCheck = new ProcessDtoCheck();

  public constructor(
    private readonly clientRepository: ClientRepository,
    private readonly processRepository: ProcessRepository
  ) {}

  public async exec(clientId: string, processId: string): Promise<IProcess> {
    this.dtoCheck.deleteProcessInfosDtoCheck(processId, clientId);

    const doesProcessClientExists = await this.clientRepository.findById(
      clientId
    );

    if (!doesProcessClientExists) {
      throw new NotFoundException("Client not found.");
    }

    const isProcessOwnerDeactivated =
      doesProcessClientExists.deletedAt !== null;

    if (isProcessOwnerDeactivated) {
      throw new ForbiddenException("Client has been deactivated.");
    }

    const doesProcessExists = await this.processRepository.findById(processId);

    if (!doesProcessExists) {
      throw new NotFoundException("Process not found.");
    }

    if (doesProcessExists.deletedAt !== null) {
      throw new ConflictException("Process is already deactivated/excluded.");
    }

    if (doesProcessClientExists.id !== doesProcessExists.clientId) {
      throw new ForbiddenException("Only process owner can disable a process.");
    }

    const performDelete = await this.processRepository.delete(processId);

    return performDelete;
  }
}

import type { IProcess, IProcessSave } from "../../@types/process";
import ConflictException from "../../exceptions/conflictEsception";
import ForbiddenException from "../../exceptions/forbiddenException";
import NotFoundException from "../../exceptions/notFoundException";
import ClientRepository from "../../repositories/clientRepository";
import ProcessRepository from "../../repositories/processRepository";
import ProcessDtoCheck from "./processDtoCheck";

export default class CreateNewProcessService {
  private dtoCheck = new ProcessDtoCheck();

  public constructor(
    private readonly clientRepository: ClientRepository,
    private readonly processRepository: ProcessRepository
  ) {}

  public async exec(clientId: string, dto: IProcessSave): Promise<IProcess> {
    this.dtoCheck.createProcessDtoCheck(clientId, dto);

    if (dto.audienceDate < new Date()) {
      throw new ConflictException("Audience date can't be in the past.");
    }

    const doesProcessClientExists = await this.clientRepository.findById(
      clientId
    );

    if (!doesProcessClientExists) {
      throw new NotFoundException("Client not found.");
    }

    const isProcessDeactivated = doesProcessClientExists.deletedAt !== null;

    if (isProcessDeactivated) {
      throw new ForbiddenException("Client has been deactivated.");
    }

    const doesProcessNumberAlreadyExists =
      await this.processRepository.findByNumber(dto.number);

    if (!isProcessDeactivated && doesProcessNumberAlreadyExists) {
      throw new ConflictException(
        "An process with this number already exists."
      );
    }

    const creation = await this.processRepository.save(clientId, dto);

    return creation;
  }
}

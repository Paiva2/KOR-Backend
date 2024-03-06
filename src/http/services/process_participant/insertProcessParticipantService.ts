import type {
  IParticipantProcess,
  IParticipantProcessSave,
} from "../../@types/participant_process";
import ConflictException from "../../exceptions/conflictEsception";
import ForbiddenException from "../../exceptions/forbiddenException";
import NotFoundException from "../../exceptions/notFoundException";
import ParticipantProcessRepository from "../../repositories/participantProcessRepository";
import ParticipantRepository from "../../repositories/participantRepository";
import ProcessRepository from "../../repositories/processRepository";
import ProcessParticipantDtoCheck from "./processParticipantDtoCheck";

export default class InsertProcessParticipantService {
  private dtoCheck = new ProcessParticipantDtoCheck();

  public constructor(
    private readonly processRepository: ProcessRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly participantProcessRepository: ParticipantProcessRepository
  ) {}

  public async exec(
    dto: IParticipantProcessSave
  ): Promise<IParticipantProcess> {
    this.dtoCheck.insertProcessParticipantDtoCheck(dto);

    const doesProcessExists = await this.processRepository.findById(
      dto.processId
    );

    if (!doesProcessExists) {
      throw new NotFoundException("Process not found.");
    }

    if (doesProcessExists.deletedAt !== null) {
      throw new ForbiddenException("Process deactivated.");
    }

    const doesParticipantExists = await this.participantRepository.findById(
      dto.participantId
    );

    if (!doesParticipantExists) {
      throw new NotFoundException("Participant not found.");
    }

    if (doesParticipantExists.deletedAt !== null) {
      throw new ForbiddenException("Participant deactivated.");
    }

    const doesParticipantIsAlreadyOnProcess =
      await this.participantProcessRepository.findParticipant(dto);

    if (doesParticipantIsAlreadyOnProcess) {
      throw new ConflictException(
        "This participant is already alocated on provided process."
      );
    }

    const insertOnProcess = await this.participantProcessRepository.save(dto);

    return insertOnProcess;
  }
}

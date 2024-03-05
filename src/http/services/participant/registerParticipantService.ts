import type { IParticipant, IParticipantSave } from "../../@types/participant";
import ConflictException from "../../exceptions/conflictEsception";
import ParticipantRepository from "../../repositories/participantRepository";
import ParticipantDtoCheck from "./participantDtoCheck";

export default class RegisterParticipantService {
  private dtoCheck = new ParticipantDtoCheck();

  public constructor(
    private readonly participantRepository: ParticipantRepository
  ) {}

  public async exec(dto: IParticipantSave): Promise<IParticipant> {
    this.dtoCheck.registerParticipantDtoCheck(dto);

    const doesThisParticipantAlreadyExists =
      await this.participantRepository.findByUniques({
        document: dto.document,
        email: dto.email,
        phone: dto.phone,
      });

    if (doesThisParticipantAlreadyExists) {
      throw new ConflictException(
        "An participant with those informations already exists."
      );
    }

    const create = await this.participantRepository.save(dto);

    return create;
  }
}

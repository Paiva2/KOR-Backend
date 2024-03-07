import type { IParticipant } from "../../@types/participant";
import ParticipantRepository from "../../repositories/participantRepository";

export default class ListAllParticipantsAvailableService {
  public constructor(
    private readonly participantRepository: ParticipantRepository
  ) {}

  public async exec(query: { page: string; perPage: string }): Promise<{
    page: number;
    perPage: number;
    participants: IParticipant[];
  }> {
    let page = +query.page ?? 1;
    let perPage = +query.perPage ?? 5;

    if (page < 1) {
      page = 1;
    }

    if (page > 100) {
      page = 100;
    }

    if (perPage < 5) {
      perPage = 5;
    }

    const list = await this.participantRepository.listAllAvailable({
      page,
      perPage,
    });

    return list;
  }
}

import type { IParticipantProcess } from "../../@types/participant_process";
import BadRequestException from "../../exceptions/badRequestException";
import ParticipantProcessRepository from "../../repositories/participantProcessRepository";

export default class FilterProcessParticipantsService {
  public constructor(
    private readonly participantProcessRepository: ParticipantProcessRepository
  ) {}

  public async exec(query: {
    page: string;
    perPage: string;
    processId: string;
  }): Promise<{
    page: number;
    perPage: number;
    participantsProcess: IParticipantProcess[];
  }> {
    if (!query.processId) {
      throw new BadRequestException("processId can't be empty.");
    }

    let page = +query.page;
    let perPage = +query.perPage;

    if (page < 1) {
      page = 1;
    }

    if (page > 100) {
      page = 100;
    }

    if (perPage < 5) {
      perPage = 5;
    }

    const listParticipants =
      await this.participantProcessRepository.findAllProcessParticipants({
        processId: query.processId,
        page,
        perPage,
      });

    return listParticipants;
  }
}

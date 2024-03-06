import BadRequestException from "../../exceptions/badRequestException";
import ProcessRepository from "../../repositories/processRepository";

export default class FilterProcessByIdService {
  public constructor(private readonly processRepository: ProcessRepository) {}

  public async exec(processId: string) {
    if (!processId) {
      throw new BadRequestException("processId can't be empty.");
    }

    const doesProcessExists = await this.processRepository.findById(processId);

    return doesProcessExists;
  }
}

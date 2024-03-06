import type { IProcess } from "../../@types/process";
import ProcessRepository from "../../repositories/processRepository";

export default class FilterProcessByParamsService {
  public constructor(private readonly processRepository: ProcessRepository) {}

  public async exec(query: {
    client?: string;
    participant?: string;
    page: string;
    perPage: string;
  }): Promise<{
    page: number;
    perPage: number;
    list: IProcess[];
  }> {
    if (+query.page < 1 || !query.page) {
      query.page = "1";
    }

    if (+query.perPage < 5 || !query.perPage) {
      query.page = "5";
    }

    if (+query.perPage > 100) {
      query.perPage = "100";
    }

    const processList = await this.processRepository.listAll(query);

    return processList;
  }
}

import ClientModel from "../../models/postgres/clientModel";
import ProcessModel from "../../models/postgres/processModel";
import CreateNewProcessService from "../../services/process/createNewProcessService";
import FilterProcessByIdService from "../../services/process/filterProcessByIdService";

export default class ProcessFactory {
  public constructor() {}

  public async exec() {
    const models = this.models();

    const createNewProcessService = new CreateNewProcessService(
      models.clientModel,
      models.processModel
    );

    const filterProcessById = new FilterProcessByIdService(models.processModel);

    return {
      createNewProcessService,
      filterProcessById,
    };
  }

  private models() {
    const clientModel = new ClientModel();
    const processModel = new ProcessModel();

    return {
      clientModel,
      processModel,
    };
  }
}

import ClientModel from "../../models/postgres/clientModel";
import ProcessModel from "../../models/postgres/processModel";
import CreateNewProcessService from "../../services/process/createNewProcessService";
import DeleteProcessService from "../../services/process/deleteProcessService";
import FilterProcessByIdService from "../../services/process/filterProcessByIdService";
import UpdateProcessInfosService from "../../services/process/updateProcessInfosService";

export default class ProcessFactory {
  public constructor() {}

  public async exec() {
    const models = this.models();

    const createNewProcessService = new CreateNewProcessService(
      models.clientModel,
      models.processModel
    );

    const filterProcessById = new FilterProcessByIdService(models.processModel);

    const updateProcessInfosService = new UpdateProcessInfosService(
      models.clientModel,
      models.processModel
    );

    const deleteProcessService = new DeleteProcessService(
      models.clientModel,
      models.processModel
    );

    return {
      createNewProcessService,
      filterProcessById,
      updateProcessInfosService,
      deleteProcessService,
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

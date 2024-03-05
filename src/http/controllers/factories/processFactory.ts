import ClientModel from "../../models/postgres/clientModel";
import ProcessModel from "../../models/postgres/processModel";
import CreateNewProcessService from "../../services/process/createNewProcessService";

export default class ProcessFactory {
  public constructor() {}

  public async exec() {
    const models = this.models();

    const createNewProcessService = new CreateNewProcessService(
      models.clientModel,
      models.processModel
    );

    return {
      createNewProcessService,
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

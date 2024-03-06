import ClientModel from "../../models/postgres/clientModel";
import ParticipantModel from "../../models/postgres/participantModel";
import ParticipantProcessModel from "../../models/postgres/participantProcessModel";
import ProcessModel from "../../models/postgres/processModel";
import InsertProcessParticipantService from "../../services/process_participant/insertProcessParticipantService";

export default class ParticipantProcessFactory {
  public constructor() {}

  public async exec() {
    const models = this.models();

    const insertProcessParticipantService = new InsertProcessParticipantService(
      models.processModel,
      models.participantModel,
      models.participantProcessModel
    );

    return {
      insertProcessParticipantService,
    };
  }

  private models() {
    const clientModel = new ClientModel();
    const processModel = new ProcessModel();
    const participantModel = new ParticipantModel();
    const participantProcessModel = new ParticipantProcessModel();

    return {
      clientModel,
      processModel,
      participantModel,
      participantProcessModel,
    };
  }
}

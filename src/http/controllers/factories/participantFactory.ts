import ParticipantModel from "../../models/postgres/participantModel";
import RegisterParticipantService from "../../services/participant/registerParticipantService";
import ListAllParticipantsAvailableService from "../../services/participant/listAllParticipantsAvailableService";

export default class ParticipantFactory {
  public constructor() {}

  public async exec() {
    const models = this.models();

    const registerParticipantService = new RegisterParticipantService(
      models.participantModel
    );

    const listAllParticipantsService = new ListAllParticipantsAvailableService(
      models.participantModel
    );

    return {
      registerParticipantService,
      listAllParticipantsService,
    };
  }

  private models() {
    const participantModel = new ParticipantModel();

    return {
      participantModel,
    };
  }
}

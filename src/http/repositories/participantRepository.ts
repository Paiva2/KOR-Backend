import { IParticipant, IParticipantSave } from "../@types/participant";

export default interface ParticipantRepository {
  save(dto: IParticipantSave): Promise<IParticipant>;

  findByUniques(findByUniques: {
    phone: string;
    document: string;
    email: string;
  }): Promise<IParticipant | null>;
}

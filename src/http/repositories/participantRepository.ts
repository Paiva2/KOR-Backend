import { IParticipant, IParticipantSave } from "../@types/participant";

export default interface ParticipantRepository {
  save(dto: IParticipantSave): Promise<IParticipant>;

  findByUniques(findByUniques: {
    phone: string;
    document: string;
    email: string;
  }): Promise<IParticipant | null>;

  findById(dto: string): Promise<IParticipant | null>;

  listAllAvailable(query: { page: number; perPage: number }): Promise<{
    page: number;
    perPage: number;
    participants: IParticipant[];
  }>;
}

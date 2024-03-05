import { randomUUID } from "crypto";
import { IParticipantSave, IParticipant } from "../../@types/participant";
import ParticipantRepository from "../../repositories/participantRepository";

export default class InMemoryParticipantsRepository
  implements ParticipantRepository
{
  public participants: IParticipant[] = [];

  public async save(dto: IParticipantSave): Promise<IParticipant> {
    const participant: IParticipant = {
      id: randomUUID(),
      name: dto.name,
      document: dto.document,
      email: dto.email,
      phone: dto.phone,
      type: dto.type,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.participants.push(participant);

    return participant;
  }

  public async findByUniques({
    email,
    phone,
    document,
  }: {
    phone: string;
    document: string;
    email: string;
  }): Promise<IParticipant | null> {
    return (
      this.participants.find(
        (participant) =>
          participant.email === email ||
          participant.phone === phone ||
          participant.document === document
      ) ?? null
    );
  }
}

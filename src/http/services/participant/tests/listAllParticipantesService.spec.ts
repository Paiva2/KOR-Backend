import { beforeEach, describe, it, expect } from "vitest";
import { ParticipantType } from "../../../@types/enums";
import RegisterParticipantService from "../registerParticipantService";
import InMemoryParticipantsRepository from "../../../models/in-memory/inMemoryParticipantsRepository";
import ListAllParticipantsAvailableService from "../listAllParticipantsAvailableService";

describe("List all available participants", () => {
  let participantRepository: InMemoryParticipantsRepository;

  let registerParticipantService: RegisterParticipantService;

  let sut: ListAllParticipantsAvailableService;

  beforeEach(() => {
    participantRepository = new InMemoryParticipantsRepository();

    registerParticipantService = new RegisterParticipantService(
      participantRepository
    );

    sut = new ListAllParticipantsAvailableService(participantRepository);
  });

  it("should list all available participants on database", async () => {
    const firstParticipant = await registerParticipantService.exec({
      document: "573.957.840-06",
      email: "johndoe1@email.com",
      name: "John Doe 1",
      phone: "(82) 9 9233-9138",
      type: ParticipantType.LAWYER,
    });

    const secondParticipant = await registerParticipantService.exec({
      document: "485.269.290-46",
      email: "johndoe2@email.com",
      name: "John Doe 2",
      phone: "(13) 9 6878-5188",
      type: ParticipantType.LAWYER,
    });

    const thirdParticipant = await registerParticipantService.exec({
      document: "435.173.220-24",
      email: "johndoe3@email.com",
      name: "John Doe 3",
      phone: "(98) 9 7983-6833",
      type: ParticipantType.LAWYER,
    });

    const disabledParticipant = await registerParticipantService.exec({
      document: "248.365.530-08",
      email: "johndoe4@email.com",
      name: "John Doe 4",
      phone: "(69) 9 9911-7957",
      type: ParticipantType.LAWYER,
    });

    const getParticipantToDisable = participantRepository.participants.find(
      (participant) => participant.id === disabledParticipant.id
    );

    if (getParticipantToDisable) {
      getParticipantToDisable.deletedAt = new Date();
    }

    const list = await sut.exec({
      page: "1",
      perPage: "5",
    });

    expect(list.participants.length).toBe(3);
    expect(list).toEqual(
      expect.objectContaining({
        page: 1,
        perPage: 5,
        participants: expect.arrayContaining([
          expect.objectContaining({
            ...firstParticipant,
          }),

          expect.objectContaining({
            ...secondParticipant,
          }),

          expect.objectContaining({
            ...thirdParticipant,
          }),
        ]),
      })
    );
  });
});

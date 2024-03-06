import { ParticipantType, ProcessType } from "../../../@types/enums";
import { beforeEach, describe, expect, it } from "vitest";
import { IProcess } from "../../../@types/process";
import type { IClient } from "../../../@types/client";
import type { IParticipant } from "../../../@types/participant";
import InMemoryClientRepository from "../../../models/in-memory/inMemoryClientRepository";
import RegisterClientService from "../../client/registerClientService";
import InMemoryProcessRepository from "../../../models/in-memory/inMemoryProcessRepository";
import CreateNewProcessService from "../../process/createNewProcessService";
import RegisterParticipantService from "../../participant/registerParticipantService";
import InMemoryParticipantsRepository from "../../../models/in-memory/inMemoryParticipantsRepository";
import InsertProcessParticipantService from "../insertProcessParticipantService";
import InMemoryParticipantProcessRepository from "../../../models/in-memory/inMemoryParticipantProcessRepository";
import FilterProcessParticipantsService from "../filterProcessParticipantsService";

const randomCnpj = "33.483.364/0001-29"; // generated with https://www.4devs.com.br/gerador_de_cnpj
const validRandomCpf = "292.776.365-80";
const validRandomPhone = "(99) 9 9999-9999";

const mockProcess = {
  audienceDate: new Date(2030, 1, 20, 0, 0),
  causeValue: "R$ 100,00",
  city: "São Paulo",
  state: "SP",
  forum: "Forum X",
  number: "123456789",
  quoteDate: new Date(2030, 1, 10, 0, 0),
  type: ProcessType.ADMINISTRATIVE,
};

describe("Filter process participants", () => {
  let client: IClient;
  let firstParticipant: IParticipant;
  let secondParticipant: IParticipant;
  let thirdParticipant: IParticipant;
  let process: IProcess;

  let clientRepository: InMemoryClientRepository;
  let processRepository: InMemoryProcessRepository;
  let participantRepository: InMemoryParticipantsRepository;
  let participantProcessRepository: InMemoryParticipantProcessRepository;

  let registerClientService: RegisterClientService;
  let createNewProcessService: CreateNewProcessService;
  let registerParticipantService: RegisterParticipantService;
  let insertProcessParticipantService: InsertProcessParticipantService;

  let sut: FilterProcessParticipantsService;

  beforeEach(async () => {
    clientRepository = new InMemoryClientRepository();

    participantRepository = new InMemoryParticipantsRepository();

    participantProcessRepository = new InMemoryParticipantProcessRepository(
      participantRepository
    );

    processRepository = new InMemoryProcessRepository(
      participantProcessRepository
    );

    registerClientService = new RegisterClientService(clientRepository);

    createNewProcessService = new CreateNewProcessService(
      clientRepository,
      processRepository
    );

    registerParticipantService = new RegisterParticipantService(
      participantRepository
    );

    insertProcessParticipantService = new InsertProcessParticipantService(
      processRepository,
      participantRepository,
      participantProcessRepository
    );

    client = await registerClientService.exec({
      name: "John Doe",
      cnpj: randomCnpj,
    });

    firstParticipant = await registerParticipantService.exec({
      document: validRandomCpf,
      phone: validRandomPhone,
      email: "johndoe@email.com",
      name: "Participant 1",
      type: ParticipantType.LAWYER,
    });

    secondParticipant = await registerParticipantService.exec({
      document: "891.065.170-99",
      phone: "(99) 9 1111-9999",
      email: "johndoe2@email.com",
      name: "Participant 2",
      type: ParticipantType.DEFENDANT,
    });

    thirdParticipant = await registerParticipantService.exec({
      document: "832.628.310-00",
      phone: "(99) 9 9999-2222",
      email: "johndoe3@email.com",
      name: "Participant 3",
      type: ParticipantType.DEFENDANT,
    });

    process = await createNewProcessService.exec(client.id, mockProcess);

    await insertProcessParticipantService.exec({
      participantId: firstParticipant.id,
      processId: process.id,
    });

    await insertProcessParticipantService.exec({
      participantId: secondParticipant.id,
      processId: process.id,
    });

    await insertProcessParticipantService.exec({
      participantId: thirdParticipant.id,
      processId: process.id,
    });

    sut = new FilterProcessParticipantsService(participantProcessRepository);
  });

  it("should list all process participants", async () => {
    const listParticipants = await sut.exec({
      page: "1",
      perPage: "5",
      processId: process.id,
    });

    expect(listParticipants).toEqual(
      expect.objectContaining({
        page: 1,
        perPage: 5,
        participantsProcess: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            processId: process.id,
            participantId: firstParticipant.id,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: null,
            participant: {
              id: firstParticipant.id,
              name: firstParticipant.name,
              email: firstParticipant.email,
              phone: firstParticipant.phone,
              document: firstParticipant.document,
              type: firstParticipant.type,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              deletedAt: null,
            },
          }),
          expect.objectContaining({
            id: expect.any(String),
            processId: process.id,
            participantId: secondParticipant.id,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: null,
            participant: {
              id: secondParticipant.id,
              name: secondParticipant.name,
              email: secondParticipant.email,
              phone: secondParticipant.phone,
              document: secondParticipant.document,
              type: secondParticipant.type,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              deletedAt: null,
            },
          }),
          expect.objectContaining({
            id: expect.any(String),
            processId: process.id,
            participantId: thirdParticipant.id,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: null,
            participant: {
              id: thirdParticipant.id,
              name: thirdParticipant.name,
              email: thirdParticipant.email,
              phone: thirdParticipant.phone,
              document: thirdParticipant.document,
              type: thirdParticipant.type,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              deletedAt: null,
            },
          }),
        ]),
      })
    );
  });

  it("should throw an exception over empty process id dto", async () => {
    await expect(() => {
      return sut.exec({
        page: "1",
        perPage: "5",
        processId: "",
      });
    }).rejects.toThrowError("processId can't be empty.");
  });
});

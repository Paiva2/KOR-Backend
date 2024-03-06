import { beforeEach, describe, it, expect, vi } from "vitest";
import { ProcessType } from "../../../@types/enums";
import type { IClient } from "../../../@types/client";
import type { IProcess } from "../../../@types/process";
import InMemoryClientRepository from "../../../models/in-memory/inMemoryClientRepository";
import RegisterClientService from "../../client/registerClientService";
import CreateNewProcessService from "../createNewProcessService";
import InMemoryProcessRepository from "../../../models/in-memory/inMemoryProcessRepository";
import InMemoryParticipantProcessRepository from "../../../models/in-memory/inMemoryParticipantProcessRepository";
import InMemoryParticipantsRepository from "../../../models/in-memory/inMemoryParticipantsRepository";
import UpdateProcessInfosService from "../updateProcessInfosService";

const randomCnpj = "33.483.364/0001-29"; // generated with https://www.4devs.com.br/gerador_de_cnpj

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

describe("Update process infos", () => {
  let client: IClient;
  let process: IProcess;

  let clientRepository: InMemoryClientRepository;
  let processRepository: InMemoryProcessRepository;
  let participantProcessRepository: InMemoryParticipantProcessRepository;
  let participantRepository: InMemoryParticipantsRepository;

  let registerClientService: RegisterClientService;
  let createNewProcessService: CreateNewProcessService;

  let sut: UpdateProcessInfosService;

  beforeEach(async () => {
    vi.useFakeTimers();

    const date = new Date(2030, 0, 20, 0, 0);
    vi.setSystemTime(date);

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

    sut = new UpdateProcessInfosService(clientRepository, processRepository);

    client = await registerClientService.exec({
      name: "John Doe",
      cnpj: randomCnpj,
    });

    process = await createNewProcessService.exec(client.id, mockProcess);
  });

  it("should update an existent process infos", async () => {
    const updateProcess = await sut.exec(client.id, process.id, {
      audienceDate: new Date(2030, 1, 23, 0, 0),
      causeValue: "R$ 300,00",
      city: "Blumenau",
      state: "SC",
      forum: "Forum Y",
      type: ProcessType.JUDICIAL,
    });

    expect(updateProcess).toEqual(
      expect.objectContaining({
        id: process.id,
        number: "123456789",
        causeValue: "R$ 300,00",
        type: ProcessType.JUDICIAL,
        quoteDate: new Date(2030, 1, 10, 0, 0),
        audienceDate: new Date(2030, 1, 23, 0, 0),
        forum: "Forum Y",
        city: "Blumenau",
        state: "SC",
        clientId: client.id,
        createdAt: new Date(2030, 0, 20, 0, 0),
        updatedAt: new Date(),
        deletedAt: null,
      })
    );
  });
});

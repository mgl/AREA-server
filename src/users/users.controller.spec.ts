import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;
  const createCatDto: CreateUserDto = {
    name: 'mgl',
    password: 'sosecure',
  };

  const mockUser = {
    name: 'admin',
    password: 'hello',
    _id: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'user1',
                password: 'pw1',
              },
              {
                name: 'user2',
                password: 'pw2',
              },
              {
                name: 'user2',
                password: 'pw2',
              },
            ]),
            create: jest.fn().mockResolvedValue(CreateUserDto),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockUser);

      await controller.create(createCatDto);
      expect(createSpy).toHaveBeenCalledWith(createCatDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of Users', async () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          name: 'user1',
          password: 'pw1',
        },
        {
          name: 'user2',
          password: 'pw2',
        },
        {
          name: 'user3',
          password: 'pw3',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});

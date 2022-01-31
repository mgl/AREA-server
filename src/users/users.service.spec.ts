import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

const mockUser = {
  name: 'someUser',
  password: 'somePw',
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const UsersArray = [
    {
      name: 'user1',
      password: 'pw1',
    },
    {
      name: 'user2',
      breed: 'pw2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all Users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(UsersArray),
    } as any);
    const Users = await service.findAll();
    expect(Users).toEqual(UsersArray);
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        name: 'user1',
        breed: 'pw1',
      }),
    );
    const newUser = await service.create({
      name: 'user1',
      password: 'pw1',
    });
    expect(newUser).toEqual(mockUser);
  });
});

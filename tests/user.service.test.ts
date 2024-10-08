import { UserService } from '../src/services/user.service';
import RegistrationDTO from '../src/payloads/dto/register.dto';
import { Role, User } from '../src/interfaces/user.interface';
import JsonModifier from '../src/utils/json_modifier.utils';

jest.mock('../src/services/user.service');
jest.mock('../utils/json_modifier.utils');

test('should create a user', async () => {
  (UserService.addUser as jest.Mock).mockResolvedValue(true);

  const newUser: RegistrationDTO = {
    email: "test@test.com",
    password: "abc-123",
    name: "Test User",
    role: "employee"
  };

  const result = await UserService.addUser(newUser);

  expect(result).toBe(true);
});

test('should get a user by email', async () => {
  const mockUsers: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      password: "abc-123",
      role: Role.Employee
    }
  ];

  (JsonModifier.prototype.readJsonToData as jest.Mock).mockResolvedValue(mockUsers);

  await UserService.getAllUser();

  const user = await UserService.getUserByEmail("john.doe@example.com");

  expect(user).toBeDefined();
  expect(user?.name).toBe("John Doe");
  expect(user?.email).toBe("john.doe@example.com");
});

test('should return null for non-existing user', async () => {
  const mockUsers: User[] = [];

  (JsonModifier.prototype.readJsonToData as jest.Mock).mockResolvedValue(mockUsers);

  await UserService.getAllUser();

  const user = await UserService.getUserByEmail("non.existing@example.com");

  expect(user).toBeNull();
});
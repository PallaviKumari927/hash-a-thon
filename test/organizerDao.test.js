const { getOrganizerByEmailDao } = require('../dao/organizerDao'); 
const Organizer = require('../models/organizer')
jest.mock('../models/organizer', () => ({
  find: jest.fn(),
}));

test('getOrganizerByEmailDao should return an array of organizers with a matching email', async () => {
  const mockEmail = 'john.doe@example.com';
  const mockOrganizers = [
    { company_name: 'John Doe', email: mockEmail, password: 'john123' },
    { name: 'Jane Smith', email: mockEmail, password: 'jane123' },
  ];

  Organizer.find.mockResolvedValue(mockOrganizers);

  const result = await getOrganizerByEmailDao(mockEmail);

  expect(result).toEqual(mockOrganizers);
});

test('getOrganizerByEmailDao should return an empty array when the email does not exist', async () => {
  const mockEmail = 'nonexistent@example.com';

  Organizer.find.mockResolvedValue([]);

  const result = await getOrganizerByEmailDao(mockEmail);

  expect(result).toEqual([]);
});

test('getOrganizerByEmailDao should handle errors gracefully', async () => {
  const mockEmail = 'error@example.com';
  const errorMessage = 'Database connection error';

  Organizer.find.mockRejectedValue(new Error(errorMessage));

  try {
    await getOrganizerByEmailDao(mockEmail);
  } catch (error) {
    expect(error.message).toBe(errorMessage);
  }
});
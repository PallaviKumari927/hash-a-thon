const Employee = require('../models/employee');
const { getEmployeeByEmailDao, updateEmployeeDao, deleteEmployeeDao } = require('../dao/employeeDao');


jest.mock('../models/employee');

describe('getEmployeeByEmailDao', () => {
  beforeEach(() => {
    Employee.find.mockReset();
  });

  test('should return employee(s) with matching email', async () => {
    const mockEmail = 'john.doe@example.com';
    const mockEmployees = [
      { name: 'John Doe', email: mockEmail, password: 'anshu@123', designation: 'Software Engineer-1', experience: 2, skill: ['Java'] },
      { name: 'Jane Smith', email: mockEmail, password: 'anshu@123', designation: 'Software Engineer-1', experience: 2, skill: ['Java'] },
    ];

    Employee.find.mockResolvedValue(mockEmployees);

    const result = await getEmployeeByEmailDao(mockEmail);

    expect(result).toEqual(mockEmployees);
  });

  test('should return an empty array for non-existent email', async () => {
    const mockEmail = 'nonexistent@example.com';

    Employee.find.mockResolvedValue([]);

    const result = await getEmployeeByEmailDao(mockEmail);

    expect(result).toEqual([]);
  });

  test('should handle errors gracefully', async () => {
    const mockEmail = 'error@example.com';
    const errorMessage = 'Database connection error';

    Employee.find.mockRejectedValue(new Error(errorMessage));

    try {
      await getEmployeeByEmailDao(mockEmail);
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
  });
});

describe('updateEmployeeDao', () => {
  beforeEach(() => {
    Employee.findOneAndUpdate.mockReset();
  });

  test('should return the updated employee object', async () => {
    const mockReq = {
      user: {
        email: 'john.doe@example.com',
      },
      body: {
        name: 'John Doe',
        role: 'employee',
      },
    };

    const mockUpdatedEmployee = {
      _id: 'employee1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      experience:2,
      role: 'employee',
    };

    Employee.findOneAndUpdate.mockResolvedValue(mockUpdatedEmployee);

    const result = await updateEmployeeDao(mockReq);

    expect(result).toEqual(mockUpdatedEmployee);
  });

  test('should return null when the employee does not exist', async () => {
    const mockReq = {
      user: {
        email: 'nonexistent@example.com',
      },
      body: {
        name: 'John Doe',
        role: 'employee',
      },
    };

    Employee.findOneAndUpdate.mockResolvedValue(null);

    const result = await updateEmployeeDao(mockReq);

    expect(result).toBeNull();
  });

  test('should handle errors gracefully', async () => {
    const mockReq = {
      user: {
        email: 'john.doe@example.com',
      },
      body: {
        name: 'John Doe',
        role: 'employee',
      },
    };

    const errorMessage = 'Database update error';

    Employee.findOneAndUpdate.mockRejectedValue(new Error(errorMessage));

    try {
      await updateEmployeeDao(mockReq);
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
  });
});

describe('deleteEmployeeDao', () => {
  beforeEach(() => {
    Employee.findOneAndRemove.mockReset();
  });

  test('should return the deleted employee object', async () => {
    const mockReq = {
      user: {
        email: 'john.doe@example.com',
      },
    };

    const mockDeletedEmployee = {
      _id: 'employee1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      experience:2,
      role: 'employee',
    };

    Employee.findOneAndRemove.mockResolvedValue(mockDeletedEmployee);

    const result = await deleteEmployeeDao(mockReq);

    expect(result).toEqual(mockDeletedEmployee);
  });

  test('should return null when the employee does not exist', async () => {
    const mockReq = {
      user: {
        email: 'nonexistent@example.com',
      },
    };

    Employee.findOneAndRemove.mockResolvedValue(null);

    const result = await deleteEmployeeDao(mockReq);

    expect(result).toBeNull();
  });

  test('should handle errors gracefully', async () => {
    const mockReq = {
      user: {
        email: 'john.doe@example.com',
      },
    };

    const errorMessage = 'Database deletion error';

    Employee.findOneAndRemove.mockRejectedValue(new Error(errorMessage));

    try {
      await deleteEmployeeDao(mockReq);
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
  });
});
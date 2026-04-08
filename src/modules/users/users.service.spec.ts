import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserDocument } from './schemas/user.schema';

// Mimics the Mongoose query chain: .findById().select().exec()
const mockQueryChainModel = {
    findById: jest.fn().mockReturnThis(), // Returns the mock itself
    select: jest.fn().mockReturnThis(), // Returns the mock itself
    exec: jest.fn(), // This will be set to return the desired result in tests
};

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken('User'),
                    useValue: mockQueryChainModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('users.service.findOne', () => {
        // Test 1: Invalid ID Format
        // Thinking: Types.ObjectId.isValid() returns false for invalid ObjectId.
        // The function should be able to return immediately before touching the database transactions.
        it('should throw BadRequestException when ID format is invalid', async () => {
            await expect(service.findOne('not-a-valid-id-params')).rejects.toThrow(
                BadRequestException,
            );
            // Confirm that the DB transactions was never called.
            expect(mockQueryChainModel.findById).not.toHaveBeenCalled();
        });

        // Test 2: Valid ID, however, user not found
        // Thinking: ID passed the format check, DB Query runs, returns null
        // The function should return NotFoundException
        it('should return NotFoundException when user is not found', async () => {
            // Give exec() a null return — simulates "no document found"
            mockQueryChainModel.exec.mockResolvedValue(null);

            const validId = new Types.ObjectId().toHexString(); // Initialize a valid ID from MongoDB Types
            await expect(service.findOne(validId)).rejects.toThrow(NotFoundException);

            // Confirms that the Query DB was executed
            expect(mockQueryChainModel.findById).toHaveBeenCalled();
        });

        // Test 3: Valid ID, user found
        // Thinking: ID passed the format check, DB Query runs, returns a user document
        // The function should return the user document (without password, createdAt, updatedAt)
        it('should return user document without password, created_at and updated_at', async () => {
            const mockUser = {
                _id: new Types.ObjectId(),
                name: 'John',
                email: 'john@example.com',
            } as unknown as UserDocument;

            mockQueryChainModel.exec.mockResolvedValue(mockUser);

            const validId = new Types.ObjectId().toHexString();
            const result = await service.findOne(validId);

            expect(result).toEqual(mockUser); // Expects that the returned user document matches the mock
            expect(mockQueryChainModel.findById).toHaveBeenCalledWith(validId); // Confirms that findById was called with the correct ID
            expect(mockQueryChainModel.select).toHaveBeenCalledWith(
                '-password -createdAt -updatedAt',
            ); // Confirms that select was called to exclude password, createdAt, and updatedAt fields
        });
    });
});

import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected logger: Logger = new Logger(UserRepository.name);
  constructor(
    @InjectModel(UserRepository.name)
    userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}

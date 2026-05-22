import { ChatError } from '../../../../shared/domain/errors/AppError';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class UploadImageUseCase {
  constructor(private readonly chatRepo: IChatRepository) {}

  async execute(uri: string, userId: string): Promise<string> {
    if (!uri) throw new ChatError('URI de imagen inválida');
    return this.chatRepo.uploadImage(uri, userId);
  }
}

import { Module } from '@nestjs/common';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.serviec';

@Module({
  controllers: [ScriptController],
  providers: [ScriptService],
})
export class ScriptModule {}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { GENDER } from '../../constants/local.constant';
import { Base } from './base.entity';

@Entity()
export class Patient extends Base {
  @Column()
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  @IsOptional()
  age: number;

  @ApiProperty({ type: String, enum: GENDER })
  @IsEnum(GENDER)
  @Column()
  @IsOptional()
  gender: GENDER;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Column()
  hospitalId: string;
}

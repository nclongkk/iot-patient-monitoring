import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @Column()
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name?: string;

  @Column()
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  @Column()
  password?: string;
}

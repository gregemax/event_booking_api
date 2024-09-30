import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: String;

  @IsDate()
  date: Date;

  @IsString()
  location: String;

  @IsString()
  description: String;

  @IsString()
  attendees: [String];

  @IsNumber()
  price: number;
  
}

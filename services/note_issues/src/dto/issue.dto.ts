import { IsString, IsArray } from 'class-validator';

export class IssueDtoIn {
  @IsString()
  url!: string;
}

export class IssueDtoOut {
  @IsString()
  url!: string;

  @IsArray()
  @IsArray({ each: true })
  @IsString({ each: true })
  links!: Array<[string, string]>;
}

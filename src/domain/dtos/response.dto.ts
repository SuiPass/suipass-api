import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  success: boolean;

  protected constructor(success: boolean) {
    this.success = success;
  }
}

export abstract class DataResponseDto extends ResponseDto {
  abstract data: any;

  protected constructor() {
    super(true);
  }
}

export class AnyDataResponseDto extends DataResponseDto {
  @ApiProperty()
  data: any;

  constructor(data: any) {
    super();
    this.data = data;
  }
}

export class OkResponseDto extends ResponseDto {
  constructor() {
    super(true);
  }
}

export class MessageResponseDto extends ResponseDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    super(true);
    this.message = message;
  }
}

export class ErrorResponseDto extends ResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  errors?: any;

  constructor(message: string, errors?: any) {
    super(false);
    this.message = message;
    this.errors = errors;
  }
}

export abstract class ListDto {
  abstract list: any[];
  abstract metadata?: any;
}

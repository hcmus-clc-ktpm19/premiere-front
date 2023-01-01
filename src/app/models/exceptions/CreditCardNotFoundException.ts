import {ErrorDto} from '@/app/models/model';

class CreditCardNotFoundException extends Error {

  public errorDto?: ErrorDto;

  constructor(message: string, errorObject?: ErrorDto) {
    super(message);
    this.errorDto = errorObject;
    this.name = 'CreditCardNotFoundException';
  }
}

export default CreditCardNotFoundException;
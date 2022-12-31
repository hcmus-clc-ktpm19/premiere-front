import {ErrorDto} from '@/app/models/model';

class CreditCardNotFoundException extends Error {

  public errorObject?: ErrorDto;

  constructor(message: string, errorObject?: ErrorDto) {
    super(message);
    this.errorObject = errorObject;
    this.name = 'CreditCardNotFoundException';
  }
}

export default CreditCardNotFoundException;
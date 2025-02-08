export interface CreateCountryInterface {
  name: string;
  code: string;
  supported: boolean;
  mobileCode: string;
}

export interface CountryInterface extends CreateCountryInterface {
  _id: string;
}

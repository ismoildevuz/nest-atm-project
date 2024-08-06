export interface IReqUserInterface {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  balance: string;
}

declare module 'express' {
  export interface Request {
    user: IReqUserInterface;
  }
}

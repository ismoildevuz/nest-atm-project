export interface IReqUserInterface {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

declare module 'express' {
  export interface Request {
    user: IReqUserInterface;
  }
}

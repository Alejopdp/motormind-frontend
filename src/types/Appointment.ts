export type Appointment = {
  _id: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  vehicle: object;
  reception: {
    _id: string;
    agent: {
      _id: string;
      name: string;
    };
    date: string;
    time: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface LogData {
  _id: string;
  userId: {
    _id: string;
    prefix: string;
    firstname: string;
    lastname: string;
  };
  request: {
    method: string;
    endpoint: string;
  };
  response: {
    statusCode: string;
    message: string;
    timeMs: number;
  };
  timestamp: Date;
  labnumber: string[];
  action: string;
}
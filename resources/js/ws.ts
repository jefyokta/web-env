export type SensorMessage = {
  temperature: number;
  dust: number;
  lux: number;
  crisp: number;
};

export type Message<T = SensorMessage> = {
    event : string;
    message: T

}


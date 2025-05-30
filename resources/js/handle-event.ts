type SensorMessage = {
  temperature: number;
  dust: number;
  lux: number;
  crisp: number;
};

type EventPayloads = {
  sensor: SensorMessage;
};

const handler: Record<keyof EventPayloads, (message: any) => void> = {
  sensor: (message: SensorMessage) => {
    updateChart()
    updateCard()
    console.log("Sensor data:", message);
  },
};

export const handleEvent = (data: string) => {
  try {
    const { event, message } = JSON.parse(data) as {
      event: keyof EventPayloads;
      message: unknown;
    };

    if (event in handler) {
      handler[event](message);
    } else {
      console.warn(`Unhandled event: ${event}`);
    }
  } catch (e) {
    console.error("Failed to handle WS event:", e);
  }
};


const updateChart = () => {

}

const updateCard = () => {

}
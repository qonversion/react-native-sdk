import {AutomationsEventType} from "./enums";

class AutomationsEvent {

  type: AutomationsEventType;
  date: number;

  constructor(
    type: AutomationsEventType,
    date: number,
  ) {
    this.type = type;
    this.date = date;
  }
}

export default AutomationsEvent;

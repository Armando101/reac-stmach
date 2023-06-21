import { useMachine } from "@xstate/react";
import React from "react";
import { bookingMachine } from "../Machines/bookingMachine";

export const BaseLayout = () => {
  const [state, send] = useMachine(bookingMachine);

  console.log(state);

  return <div>BaseLayout</div>;
};

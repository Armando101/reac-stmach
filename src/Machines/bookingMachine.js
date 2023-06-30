import { assign, createMachine } from "xstate";

const bookingMachine = createMachine(
  {
    id: "buy plane tickets",
    initial: "initial",
    context: {
      passengers: [],
      selectedCountry: "",
    },
    states: {
      initial: {
        on: {
          START: {
            target: "search",
            // actions: "imprimirInicio",
          },
        },
      },
      search: {
        // entry: "imprimirEntrada",
        // exit: "imprimirSalida",
        on: {
          CONTINUE: {
            target: "passengers",
            actions: assign({
              selectedCountry: (context, event) => event.selectedCountry,
            }),
          },
          CANCEL: { target: "initial", actions: "cleanContext" },
        },
      },
      tickets: {
        on: {
          FINISH: "initial",
        },
      },
      passengers: {
        on: {
          DONE: "tickets",
          CANCEL: "initial",
          ADD: {
            target: "passengers",
            actions: assign((context, event) => context.passengers.push(event)),
          },
        },
      },
    },
  },
  {
    actions: {
      imprimirInicio: () => console.log("imprimir inicio"),
      imprimirEntrada: () => console.log("imprimir entry"),
      imprimirSalida: () => console.log("imprimir exit"),
      cleanContext: assign({ selectedCountry: "", passengers: [] }),
    },
  }
);

export default bookingMachine;

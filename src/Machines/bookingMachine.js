import { assign, createMachine } from "xstate";
import { fetchCountries } from "../Utils/api";

const fillCountries = {
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "getCountries",
        src: () => fetchCountries,
        onDone: {
          target: "success",
          actions: assign({
            countries: (context, event) => event.data,
          }),
        },
        onError: {
          target: "failure",
          actions: assign({
            error: "Request error",
          }),
        },
      },
      // on: {
      //   DONE: "success",
      //   ERROR: "failure",
      // },
    },
    success: {},
    failure: {
      on: {
        RETRY: { target: "loading" },
      },
    },
  },
};

const bookingMachine = createMachine(
  {
    id: "buy plane tickets",
    initial: "initial",
    context: {
      passengers: [],
      selectedCountry: "",
      countries: [],
      error: "",
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
        ...fillCountries,
      },
      tickets: {
        after: {
          500: { target: "initial", actions: "cleanContext" },
        },
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

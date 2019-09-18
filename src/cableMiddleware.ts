import ActionCable from "actioncable";
import { Action, Dispatch, Reducer, StoreCreator } from "redux";

export const cableMiddleware = ({ dispatch }: { dispatch: Dispatch }) => (
  next: StoreCreator,
) => (action: Reducer<unknown, Action<any>>) => {
  // This action is a function, so keep moving
  if (typeof action === "function") {
    return next(action);
  }

  const {
    channel,
    room,
  }: {
    channel: string | undefined;
    room: string | undefined;
  } = action;

  let { received }: { received?: ((result: any) => {}) | string } = action;

  // This action is not ActionCable-related, so keep moving
  if (channel === undefined || received === undefined) {
    return next(action);
  }

  if (typeof received === "string") {
    received = result => dispatch({ type: received, result });
  }

  const cable: ActionCable.Cable = ActionCable.createConsumer(
    "ws://localhost:4000/cable",
  );
  const connected: () => void = (): void => {};
  const disconnected: () => void = (): void => {};

  return cable.subscriptions.create(
    { channel, room },
    { connected, disconnected, received },
  );
};

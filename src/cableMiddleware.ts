import ActionCable from "actioncable";
import { Dispatch, Reducer, StoreCreator, Action } from "redux";

export const cableMiddleware = ({ dispatch }: { dispatch: Dispatch }) => (
  next: StoreCreator,
) => (action: Reducer<unknown, Action<any>>) => {
  // This action is a function, so keep moving
  if (typeof action === "function") {
    return next(action);
  }

  const cable: ActionCable.Cable = ActionCable.createConsumer("/cable");

  const {
    channel,
    room,
  }: {
    channel: string | undefined;
    room: string | undefined;
  } = action;

  let { received }: { received(result: any): {} } = action;

  // This action is not ActionCable-related, so keep moving
  if (channel === undefined || received === undefined || room === undefined) {
    return next(action);
  }

  if (typeof received === "string") {
    received = (result: any) => dispatch({ type: received, result });
  }

  const connected: () => void = (): void => {};
  const disconnected: () => void = (): void => {};

  return cable.subscriptions.create(
    { channel, room },
    { connected, disconnected, received },
  );
};

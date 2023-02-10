export type State<TransitionArguments extends any[] = []> = {};
export type GetStateArguments<E extends State> = E extends State<infer Args> ? Args : never;

export const state = <TransitionArguments extends any[] = []>() => ({}) as State<TransitionArguments>;
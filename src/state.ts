export type State<TransitionArguments extends any[] = []> = Record<string, never> & { __brand: 'machina-ts-state' };
export type GetStateArguments<E extends State> = E extends State<infer Args> ? Args : never;

export const state = <TransitionArguments extends any[] = []>() => ({} as State<TransitionArguments>);

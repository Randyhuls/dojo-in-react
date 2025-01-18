
declare interface Window {
  dojoConfig: Record<string, unknown>;
}

declare type UnknownWidget = Record<string, unknown>;

declare class Widget extends Function {
  constructor(props: unknown, srcNodeRef: string);

  private inherited(args: unknown): void;

  declaredClass: string;

  destroy(): void;
  destroyRecursive(): void;
  placeAt(container: Widget | DocumentFragment | HTMLElement, position?: string | number): void;
  postCreate(): void;
  postMixInProperties(): void;
  resize(): void;
  startup(): void;

  get(name: string): unknown;
  set(name: string, value: unknown): void;
  set(props: Record<string, unknown>): void;
  watch(name: string, callback: (name: string, oldValue: unknown, newValue: unknown) => void): void;

  // Additional unknown fields and methods
  [key: string]: unknown;
}

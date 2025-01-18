import { JSX as JSX_2 } from 'react/jsx-runtime';

export declare const innerWidget: (widget: Widget | UnknownWidget) => Widget;

export declare const isDojoWidget: (widget: Widget | UnknownWidget | unknown) => boolean;

export declare const loadDojoWidget: (path: string) => Promise<Widget>;

export declare const withReact: <DojoWidgetProps extends UnknownWidget>(widget: Widget) => (props: DojoWidgetProps & Omit<WithReactComponentProps<DojoWidgetProps>, "widget" | "props">) => JSX_2.Element;

declare interface WithReactComponentProps<Props extends UnknownWidget> {
    widget: Widget;
    props?: Props;
    /**
     * @description Listen for specific prop changes inside the Dojo widget. Omit to listen to all changes.
     */
    subscribedProps?: string[];
    /**
     * @description Called when props inside the Dojo widget change
     * @param props
     * @returns
     */
    onPropChange?: (props: Record<keyof Props, unknown>) => void;
}

export { }


export interface Window {
  dojoConfig: Record<string, unknown>;
}

export type UnknownWidget = Record<string, unknown>;

export class Widget extends Function {
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

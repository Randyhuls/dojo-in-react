export const isDevelopment = import.meta.env.MODE === 'development';

export const loadDojoWidget = async (path: string): Promise<Widget> => {
  if (!window.require) throw new Error('Require is not available in the global scope');

  if (!window.dojoConfig) throw new Error('dojoConfig is not available');

  return new Promise((resolve, reject) => {
    window.require(
      [path], 
      (Widget: Widget) =>  Widget ? resolve(Widget) : reject(Widget),
      (err: unknown) => reject(err)
    );
  })
}

export const isDojoWidget = (widget: Widget | UnknownWidget | unknown) => {
  if (!widget || typeof widget !== 'function' && typeof widget !== 'object') return false;

  const unknownWidget = widget as Record<string, unknown>;

  const hasCoreProperties = (
    'destroy' in widget && 
    'set' in widget
  );

  const hasAdditionalProperties = (
    typeof unknownWidget.startup === 'function'  || '_started' in unknownWidget ||
    typeof unknownWidget.inherited === 'function' || 'domNode' in unknownWidget
  );

  return hasCoreProperties && hasAdditionalProperties;
}

export const innerWidget = (widget: Widget | UnknownWidget | unknown, visited: WeakSet<object> = new WeakSet()): Widget => {
  if (isDojoWidget(widget)) return widget as Widget;

  if (typeof widget === 'function') return innerWidget(widget(), visited);

  // Check for circular references
  if (widget && typeof widget === 'object') {
    if (visited.has(widget)) throw new Error('Circular reference detected');
    visited.add(widget);

    // Check all property values for a Dojo widget
    for (const value of Object.values(widget as UnknownWidget)) {
      const result = innerWidget(value, visited);
      if (isDojoWidget(result)) return result;
    }
  }

  throw new Error('Object is not a Dojo widget');
}

export const createObservableWidget = <T extends Record<string, unknown>>(widget: Widget, onPropChange?: (prop: T) => void, subscribedProps: string[] = []) => {
  return new Proxy(widget, {
    set(target, prop, value) {
      if (target.get(prop.toString()) !== value && typeof value !== 'function') {
        target.set(prop.toString(), value);
        if (subscribedProps.includes(prop.toString()) || subscribedProps.length === 0) onPropChange?.({ [prop]: value } as T);
      }
      return true;
    }
  });
}

export const interceptOnReadyLifecycleMethod = <CallbackReturnValue = unknown>(widget: UnknownWidget, methodName: string, widgetPropName?: string, callback?: (deferredWidget?: Widget, result?: CallbackReturnValue) => void) => {
  const originalMethod = widget[methodName] as (() => void | Promise<unknown>);
  
  if (typeof originalMethod !== 'function') {
    throw new Error(`Method ${methodName} does not exist on the widget, or ${methodName} is not a function`);
  }

  widget[methodName] = async function (...args: unknown[]) {
    const result = await originalMethod.apply(this, args as []) as CallbackReturnValue;
    callback?.(widget[widgetPropName || ''] as Widget | undefined, result);
  }
}

export const pascalToSnakeCase = (value: string = '') => value.split(/\.?(?=[A-Z])/).join('_').toLowerCase();

export const uniqueWidgetUUID = () => `DojoWidget-${crypto?.randomUUID?.() || Math.random().toString(36).substring(2, 15)}`;
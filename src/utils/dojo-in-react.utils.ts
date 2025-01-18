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

  return (
    'constructor' in widget && 
    'inherited' in widget && 
    'destroy' in widget
  )
}

export const innerWidget = (widget: Widget | UnknownWidget): Widget => {
  if (isDojoWidget(widget)) return widget as unknown as Widget;
  
  if (typeof widget !== 'function') {
    console.log('not widget?', widget)
    throw new Error('Unknown Widget must be a Function or a Dojo Widget');
  }

  return innerWidget(widget());
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

export const pascalToSnakeCase = (value: string) => value.split(/\.?(?=[A-Z])/).join('_').toLowerCase();

import { FC, useEffect, useRef } from 'react';
import { pascalToSnakeCase, innerWidget, isDojoWidget, createObservableWidget, uniqueWidgetUUID } from '../../utils/dojo-in-react.utils';

interface WithReactComponentProps<Props extends UnknownWidget> {
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
  onPropChange?: (prop: Record<keyof Props, unknown>) => void;
};

export const withReact = <DojoWidgetProps extends UnknownWidget>(widget: Widget) => {
  const DojoWidgetInReactComponent: FC<WithReactComponentProps<DojoWidgetProps>> = ({ widget: dojoWidget, onPropChange, subscribedProps = [], ...props }: WithReactComponentProps<DojoWidgetProps>) => {
    const DojoWidget = dojoWidget();
    const widgetName = `${pascalToSnakeCase(DojoWidget.declaredClass || uniqueWidgetUUID()).toUpperCase()}`;

    const isInitialMount = useRef<boolean>(true);
    const widgetContainerRef = useRef<HTMLDivElement>(null);
    const widget = useRef<Widget | null>(null);

    const containerStyle = {
      display: 'contents'
    };

    /**
     * @description Bootstrap Dojo widget lifecycles
     */
    useEffect(() => {
      /**
       * @description Assign an observable version of the widget,
       * which can call onPropChange when internal (non-function) properties have changed
       */
      if (isInitialMount.current) {
        widget.current = createObservableWidget(DojoWidget, onPropChange, subscribedProps);      
      }

      if (!widget.current) {
        throw new Error('Dojo Widget is not initialized');
      }

      if (!widgetContainerRef.current) {
        throw new Error('Widget HTML container is not available');
      }

      /**
      * @description Set the widget props
      */
      widget.current?.set(props ?? {});

      /**
      * @description The internal widget (that contains lifecycle methods)
      */
      const internalWidget: Widget = isDojoWidget(widget.current) ? widget.current : innerWidget(widget?.current); 
        
      /**
       * @description Start the widget
       */
      internalWidget.startup();

      /**
       * @description Place the widget in the DOM container
       */
      widget.current.placeAt(widgetContainerRef.current);  
    }, [props, DojoWidget, onPropChange, subscribedProps]);

    /**
     * @description Destroy the widget when the component is unmounted. Note that in development, 
     * React's Strict Mode immediately calls unmount before remounting the component. This is unfavorable for testing purposes 
     * when working with Dojo widgets, so we bypass the initial unmount.
     */
    useEffect(() => {
      return () => {
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return
        }
        
        widget.current?.destroyRecursive();
      };
    }, [])

    return <div ref={widgetContainerRef} className={`__${widgetName}__ __DOJO_WIDGET__`} style={containerStyle}/>;
  };
  DojoWidgetInReactComponent.displayName = `withReact(${widget.declaredClass ?? 'DojoWidget'})`;

  return (props: DojoWidgetProps & Omit<WithReactComponentProps<DojoWidgetProps>, 'widget' | 'props'>) => <DojoWidgetInReactComponent widget={widget} {...props}/>;
};

export default withReact;
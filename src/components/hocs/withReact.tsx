import { FC, useEffect, useRef } from 'react';
import { pascalToSnakeCase, innerWidget, createObservableWidget, uniqueWidgetUUID, interceptOnReadyLifecycleMethod } from '../../utils/dojo-in-react.utils';

interface WithReactComponentProps<Props extends UnknownWidget> {
  widget: Widget;
  interceptOptions?: {
    /**
     * @description Name of the lifecycle method to intercept
     */
    lifecycleMethodName: string;
    /**
     * @description Name of the widget property that becomes available asynchronously after the lifecycle method is called
     */
    asyncWidgetPropName?: string;
  };
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
  const DojoWidgetInReactComponent: FC<WithReactComponentProps<DojoWidgetProps>> = ({ 
    widget: dojoWidget, 
    interceptOptions,
    onPropChange, 
    subscribedProps = [], 
    ...props 
  }: WithReactComponentProps<DojoWidgetProps>) => {
    const DojoWidget = typeof dojoWidget === 'function' ? dojoWidget() : dojoWidget;
    const widgetName = `${pascalToSnakeCase(DojoWidget.declaredClass || uniqueWidgetUUID()).toUpperCase()}`;

    const isInitialMount = useRef<boolean>(true);
    const widgetContainerRef = useRef<HTMLDivElement>(null);
    const widget = useRef<Widget | null>(null);

    const containerStyle = {
      display: 'contents'
    };

    /**
    * @description Recursively find the most inner Dojo widget, make its props observable within the React state,
    * then boot it up
    */
    const initializeWidget = (widgetToCreate: Widget) => {
      const internalWidget: Widget = innerWidget(widgetToCreate); 
      widget.current = createObservableWidget(internalWidget, onPropChange, subscribedProps);   

      if (!widget.current) {
        throw new Error('Dojo Widget is not initialized');
      }

      if (!widgetContainerRef.current) {
        throw new Error('Widget HTML container is not available');
      }

      /**
      * @description Set the widget props
      */
      widget.current.set(props ?? {});
        
      /**
       * @description Start the widget
       */
      widget.current.startup();

      /**
       * @description Place the widget in the DOM container
       */
      widget.current.placeAt(widgetContainerRef.current);
    }

    /**
     * @description Bootstrap Dojo widget lifecycles
     */
    useEffect(() => {
      (async () => {
        /**
         * @description Assign an observable version of the widget,
         * which can call onPropChange when internal (non-function) properties have changed
         */
        if (isInitialMount.current) {
          if (!interceptOptions?.lifecycleMethodName) return void initializeWidget(DojoWidget);

          interceptOnReadyLifecycleMethod<DojoWidgetProps[typeof interceptOptions.lifecycleMethodName] extends (...args: unknown[]) => infer R ? R : never>(
            DojoWidget,
            interceptOptions.lifecycleMethodName,
            interceptOptions.asyncWidgetPropName,
            (deferredWidget?: Widget, result?) => {
              console.log('callback!!', deferredWidget, result)
              initializeWidget(deferredWidget || DojoWidget) 
            }      
          );

          /**
           * @description Call the lifecycle method that will asynchronously set the widget property (asyncWidgetPropName)
           */
          await DojoWidget[interceptOptions.lifecycleMethodName]();
        }      
      })();
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
  DojoWidgetInReactComponent.displayName = `withReact(${widget.declaredClass ?? uniqueWidgetUUID()})`;

  return (
    props: DojoWidgetProps & Omit<WithReactComponentProps<DojoWidgetProps>, 'widget' | 'props'>
  ) => <DojoWidgetInReactComponent widget={widget} {...props} />;
};

export default withReact;
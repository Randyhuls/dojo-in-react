# Dojo-In-React

A convenient wrapper that turns Dojo widgets into React components mimicking React's high-order component functionality.
> **Dojo-In-React** only works in a runtime environment, as it relies on Dojo's `window.require` (AMD loading) to load widgets in runtime.
This package both supports ESM as CommonJS projects.

## Prerequisites
This module requires that you have `dojo`and its internal `require` library installed, as well as having your `dojoConfig` set up.
These are currently not included as peer dependencies due to the variety of ways Dojo can be incorporated into a project (CDN, Bower, NPM, etc.)

- [Dojo Toolkit](https://dojotoolkit.org/)
- [Dojo.Require](https://dojotoolkit.org/reference-guide/1.7/dojo/require.html)

## Installing

```bash
npm i dojo-in-react
```

## How to use

#### loadDojoWidget(path: string): Promise\<Widget\>
Since AMD modules are loaded asynchronously in runtime, we can use the `loadDojoWidget` method to return a Promise containing the widget.
The `path` argument accepts path names as defined in your `dojoConfig.baseUrl` and `dojoConfig.packages`.

```typescript
import { loadDojoWidget } from 'dojo-in-react';

const MyDojoButton = loadDojoWidget('path/to/my/widget.js');

// Or if you're using barrel files you can re-export the Dojo widget
export const MyDojoButton = loadDojoWidget('path/to/my/widget.js');

```

#### withReact<T>(widget: Widget): JSX.Element
`withReact` wraps a Dojo widget and returns a React component, binding the widget's lifecycle methods (`startUp`, `destroyRecursive`) to React's mount and unmount lifecycle hooks.
The widget's DOM node is placed inside a React `ref` to persist the node across renders.

> **Note**: If your project does not support top-level await, you will have to wrap your logic with an async [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

```typescript
import { withReact } from 'dojo-in-react';
import { MyDojoButton } from './my/dojo/widgets';

// We add the `await` keyword since the widget returned by loadDojoWidget is a `Promise`
const DojoInReactButton = withReact(await DojoButton); 

const MyReactComponent = () => {
  return (
    <DojoInReactButton> // Dojo widget acting as a regular React component
  )
};
```

##### Passing props
The wrapped widget accepts the same arguments (props) as the original Dojo widget.

In Dojo, imagine your widget instantiated in the following way:

```typescript
new DojoButton({
  label: "Bye Dojo, Hello React",
  isLoading: false
});
```

Then in a React Typescript environment we could do the following:

```typescript
import { withReact } from 'dojo-in-react';
import { MyDojoButton } from './my/dojo/widgets';

// Interface for the widget
type DojoButtonProps {
  label: string;
  isLoading?: boolean;
}

// The interface can be passed to the high order function
const DojoInReactButton = withReact<DojoButtonProps>(await DojoButton); 

const MyReactComponent = () => {
  const [somethingIsLoading, setSomethingIsLoading] = useState(false);

  return (
    // The wrapped widget now accepts the props defined in the interface
    <DojoInReactButton
      label="Bye Dojo, Hello React"
      isLoading={somethingIsLoading}
    >
  )
};

```
##### Listening to changes inside the widget
With the `onPropChange` prop, changes can be monitored inside the Dojo widget. 

```typescript
import { MyDojoButton } from './my/dojo/widgets';
import withReact from 'dojo-in-react';

const DojoInReactButton = withReact(await Button);

const MyReactComponent = () => {
  const onDojoWidgetPropChange = (prop: Record<string, unknown>) => {
    console.log('Some changed prop:', prop); // { label: 'Label changed inside the widget!' }
  }

  return (
    <DojoInReactButton
      label="Bye Dojo, Hello React"
      onPropChange={onDojoWidgetPropChange}
    > 
  )
};

```

If you wish to only listen to specific prop changes, you can pass an string array through the `subscribedProps` prop.

```typescript
<DojoInReactButton
  label="Bye Dojo, Hello React"
  onPropChange={onDojoWidgetPropChange}
  subscribedProps={['label']} // Listen only to changes of the `label` prop
> 
```

#### Overview
| Methods                                         | Description                                                       |
|-------------------------------------------------|-------------------------------------------------------------------|
| `isDojoWidget(widget: unknown): boolean`        | Checks to see if a data type is a Dojo widget                     |
| `loadDojoWidget(path: string): Promise<Widget>` | Path corresponds to the paths configured in `dojoConfig.packages` |
| `withReact(widget: Widget): JSX.Element`        | Returns a React high-order component                              |
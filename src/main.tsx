import { useEffect, useState } from 'react';

// Components
import { Button } from './components/dojo';
import withReact from './components/hocs/withReact';

const ReactInDojoButton = withReact<{ label: string }>(await Button);

export const Main = () => {
  const [widgetState, setWidgetState] = useState<Record<string, unknown>>({});
  const [label, setLabel] = useState('Dojo-in-React Button');
  const [hideDojoButton, setHideDojoButton] = useState(false);
  
  useEffect(() => {
    console.log('Dojo widget state in React:', widgetState)
  }, [widgetState])

  return (
    <div 
      style={{
        display: 'flex',
        gap: '10px'
      }}
    >
      {!hideDojoButton && (
        <ReactInDojoButton 
          label={label}   
          subscribedProps={['label']}
          onPropChange={(props) => {
            setWidgetState({ ...widgetState, ...props })
          }}
        />
      )}
      <button onClick={setLabel.bind(null, 'Still a Dojo button!')}>Change Dojo Button label</button>
      <button onClick={setHideDojoButton.bind(null, !hideDojoButton)}>{!hideDojoButton ? 'Hide' : 'Show'} Dojo Button</button>
    </div>
  )
};

export default Main
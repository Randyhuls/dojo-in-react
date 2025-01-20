import { useEffect, useState } from 'react';

// Components
import { Button, Select } from './components/dojo';
import withReact from './components/hocs/withReact';

const DojoInReactButton = withReact<{ label: string }>(await Button);
const SelectInReact = withReact(await Select);

export const Main = () => {
  const [widgetState, setWidgetState] = useState<Record<string, unknown>>({});
  const [label, setLabel] = useState('Dojo-in-React Button');
  const [hideDojoButton, setHideDojoButton] = useState(false);

  useEffect(() => {
    console.log('Dojo widget state in React:', widgetState)
  }, [widgetState])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div 
        style={{
          display: 'flex',
          gap: '10px'
        }}
      >
        {!hideDojoButton && (
          <DojoInReactButton 
            label={label}   
            subscribedProps={['label']}
            onPropChange={(prop) => {
              setWidgetState({ ...widgetState, ...prop })
            }}
          />
        )}
        <button onClick={setLabel.bind(null, 'Still a Dojo button!')}>Change Dojo Button label</button>
        <button onClick={setHideDojoButton.bind(null, !hideDojoButton)}>{!hideDojoButton ? 'Hide' : 'Show'} Dojo Button</button>
      </div>

      <SelectInReact  
        name="Select dropdown in React"
        className="mySelectInReactClass"
        options={[
          { label: "Dojo", value: "dojo" },
          { label: "React", value: "react", selected: true },
        ]}
      />
    </div>
  )
};

export default Main
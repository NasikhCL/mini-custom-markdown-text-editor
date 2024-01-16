import { useState } from 'react';

function useHandleClick() {
  const [triggerClick, setTriggerClick] = useState(false);
  console.log('trigger modified', triggerClick)

  return { triggerClick, setTriggerClick }; 
}

export default useHandleClick;

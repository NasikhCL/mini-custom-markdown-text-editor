import React from 'react'
import useHandleClick from '../customHook/useHandleClick';

const SaveButton = () => {
  const { setTriggerClick } = useHandleClick(); 
  const callSetTrigger = ()=>{
    console.log('set trigger button called')
    setTriggerClick(true)
  }

  return (
    <button onClick={callSetTrigger} className='px-4 py-2  border rounded ease-in-out hover:shadow'>Save</button>
  )
}

export default SaveButton
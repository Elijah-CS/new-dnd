import React, {useState} from 'react';

import SortableListForm, { ItemProps } from './sortableListForm/SortableListForm';

function App() {
  const allItems : string[] = ["A1","A2","A3","A4","A5","A6","A7"]

  return (
    <SortableListForm allItems={allItems} />
  )
  
}

export default App;
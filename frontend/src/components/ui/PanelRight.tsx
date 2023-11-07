import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';

import { Output } from '../output/Output';
import { EditorPanel } from '../editor/Editor';


export function PanelRight() {  
  const selected = useSelector((state: RootState) => state.ui.rightPanel);
  const panels = [
    { id: 'output', component: <Output key={'output'} /> },
    { id: 'editor', component: <EditorPanel key={'editor'} />}
  ]
  return (
    <aside
      className="fixed top-0 right-0 z-40 w-2/6 h-screen pt-14 transition-transform -translate-x-full bg-white border-l border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"      
      aria-label="Sidenav"
      id="output"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
        {panels.map((panel) => panel.id === selected ? panel.component : null)}
      </div>     
    </aside>
  )
}
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { classNames } from '../../utils/css';
import { setRightPanel } from '../../features/ui/uiSlice';
import {AiFillSave} from 'react-icons/ai'
// import styles from "./Menu.module.css";
import { useAddFlowMutation } from '../../services/flows';

export function Menu() {    
  const dispatch = useDispatch<AppDispatch>();
  const flow = useSelector((state: RootState) => state.flow)  
  const [addPost, { isLoading }] = useAddFlowMutation()  
  const saveFlow = () => {    
    addPost(flow)    
  }
  return (
    <div className="flex bg-white rounded border-gray-200 px-1 py-1 dark:bg-gray-800 dark:border-gray-700">
      <button onClick={() => saveFlow()} className="flex items-center gap-1 mr-1 py-2.5 px-4 border rounded border-gray-200"><AiFillSave /> Save</button>
      {/* <button className="mr-1 py-2.5 px-4">Close</button> */}
    </div>           
  )
}
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { FiPlay } from 'react-icons/fi'
import { classNames } from '../../utils/css';
import { setRightPanel } from '../../features/ui/uiSlice';

export function Actions() {    
  const dispatch = useDispatch<AppDispatch>();  
  return (
    <div className="flex bg-white rounded border-gray-200 px-1 py-1 dark:bg-gray-800 dark:border-gray-700">
      <button className="flex items-center gap-1 mr-1 py-2.5 px-4 border rounded border-gray-200"><FiPlay /> Run</button>
    </div>           
  )
}
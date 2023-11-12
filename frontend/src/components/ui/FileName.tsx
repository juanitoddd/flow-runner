import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { classNames } from '../../utils/css';
import { setRightPanel } from '../../features/ui/uiSlice';

export function FileName() {    
  const dispatch = useDispatch<AppDispatch>();  
  return (
    <div className="flex items-center bg-white border-b border-gray-200 px-4 h-full dark:bg-gray-800 dark:border-gray-700">
      Flow 1
    </div>           
  )
}
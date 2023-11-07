import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { classNames } from '../../utils/css';
import { setRightPanel } from '../../features/ui/uiSlice';
import styles from "./Nav.module.css";

export function Nav() {  
  const rightPanel = useSelector((state: RootState) => state.ui.rightPanel);  
  const dispatch = useDispatch<AppDispatch>();
  const panelsRight = ['output','editor']
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            {/*
            <a href="https://flowbite.com" className="flex items-center justify-between mr-4">
              <img
                src="https://flowbite.s3.amazonaws.com/logo.svg"
                className="mr-3 h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
            </a>
          */}            
          <a className="flex items-center justify-between mr-4">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">23° Pipelines</span>
          </a>
          </div>
          <div className="flex items-center lg:order-2">
            <button
              type="button"
              data-drawer-toggle="drawer-navigation"
              aria-controls="drawer-navigation"
              className="p-2 mr-1 text-gray-500 rounded-lg md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Toggle search</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path>
              </svg>
            </button>
          </div>
      </div>
      <div className="absolute top-0 right-0 flex items-center" style={{ height: 53 }}>        
        {panelsRight.map((_panel: string) =>
          <button
            key={_panel}
            className={
              classNames({
                "border-l border-gray-200 h-full px-2": true,
                [styles.panelSelected]: rightPanel === _panel,
              })}
            onClick={() => dispatch(setRightPanel(_panel))}
          >{_panel}</button>
        )}               
      </div>
      </nav>           
  )
}

// Hooks
import { useGetNodesQuery } from './services/nodes';
// UI
import { Nav } from './components/ui/Nav';
import { PanelRight } from './components/ui/PanelRight';
import { PanelLeft } from './components/ui/PanelLeft';
// Flow
import Flow from './components/flow/Flow';
// css
import "./styles.css";
import 'flowbite';
import { FileName } from './components/ui/FileName';

export default function App() {
  const { data, error, isLoading } = useGetNodesQuery()
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-rows-site">
        <Nav />
        <div className="grid grid-cols-panels">
          <PanelLeft />
          <div className="grid grid-rows-flow">
            <FileName/>
            <Flow />
            {/* <div className="h-screen w-screen"></div> */}
          </div>
          <PanelRight />
        </div>
      </div>
    </div>
  );
}

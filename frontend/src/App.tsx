
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

export default function App() {
  const { data, error, isLoading } = useGetNodesQuery()
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <Nav /> 
      <PanelLeft />
      <PanelRight />
      <main className="h-auto">
        <div className="h-screen w-screen">          
          <Flow />
        </div>
      </main>
    </div>
  );
}

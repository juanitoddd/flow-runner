import Flow from "./Flow";
import Editor from "./Editor";
import { Modal } from 'flowbite'
import type { ModalOptions, ModalInterface } from 'flowbite'
// Hooks
import { useGetNodesQuery } from './services/nodes';
import { useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { Output } from './components/Output';
import { Aside } from './components/Aside';
import "./styles.css";
import 'flowbite';

export default function App() {
  const { data, error, isLoading } = useGetNodesQuery()  
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <Nav /> 
      <Aside />
      <Output />
      <main className="h-auto">
        <div className="h-screen w-screen">          
          <Flow />
        </div>
      </main>
    </div>
  );
}

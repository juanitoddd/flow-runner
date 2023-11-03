import { useCallback, useState } from "react";
import MonacoEditor from "react-monaco-editor";

const BasicEditor = () => {
  const [code, setCode] = useState('');    
  const options = {
    selectOnLineNumbers: true
  };  

  return (
    <MonacoEditor
      width="600"
      height="600"
      language="javascript"
      theme="vs-dark"
      value={code}
      options={options}    
    />
  );

  /*
  onChange={::this.onChange}
  editorDidMount={::this.editorDidMount}
  */
};

export default BasicEditor;

import { useState } from 'react';
import './App.css';
export default function App() {
  const apiUrl = import.meta.env.VITE_GATEWAY;

  const [isOpened, setIsOpened] = useState(false)
  return (
    <>{
      isOpened ? 'Hello from JSX Content!' : ''
    }</>
  );
}

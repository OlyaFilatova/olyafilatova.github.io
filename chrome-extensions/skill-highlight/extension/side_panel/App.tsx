import './App.css';
export default function App() {
  const apiUrl = import.meta.env.VITE_GATEWAY;

  return (
    <>Hello from JSX Side panel! {apiUrl}</>
  );
}

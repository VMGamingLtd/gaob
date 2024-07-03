import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello, React with TypeScript!</h1>
    </div>
  );
};

export default App;

const root = ReactDOM.createRoot(document.getElementById('react-root'));

root.render(<App />);
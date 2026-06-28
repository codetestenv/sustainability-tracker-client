import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './app/store';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

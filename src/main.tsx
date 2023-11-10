import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import ErrorPage from './pages/ErrorPage/error-page';
import Details from './components/Details/Details';
import Layout from './Layouts/Layout';
import { AppGlobalContext, PokemonSearchInfo } from './types';
import { readSearchFromStorage } from './helpers/workWithStorage';

window.addEventListener('error', (ev) => {
  ev.preventDefault();
  console.error('Render error ', ev.error.message);
});

const AppContext: React.Context<AppGlobalContext> = createContext({
  search: readSearchFromStorage(),
  pokemons: new Array<PokemonSearchInfo>(),
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'detail/:name',
        element: <Details />,
        loader: async ({ params }) => {
          return fetch(import.meta.env.VITE_API_URL.concat('/', params.name?.toString())).then(
            (data) => data.json()
          );
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

export default AppContext;

import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import React from 'react';
import notFound from '../../assets/ditto.png';
import styles from './error-page.module.css';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className={styles.errorPage}>
      <h1>Oops!</h1>
      <img src={notFound} alt="not found" />
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{isRouteErrorResponse(error) ? error.statusText : 'Something went wrong...'}</i>
      </p>
      <a href="/">Back to main page</a>
    </div>
  );
}

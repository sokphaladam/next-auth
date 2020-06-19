import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import Navigation from '../src/Navigation';
import '../src/styles/_index.scss';
import ApolloClient, { gql } from 'apollo-boost';

function apollo(token: string){
  const client = new ApolloClient({
    uri: `http://graph.stage.mediaload.co?token=${token}`
  })

  return client;
}

export default function MyApp(props: any) {
  const { Component, pageProps } = props;
  const x = process.browser ? localStorage.getItem('token') : null
  const [token, setToken] = useState(x);

  const getMe = async (token: string) => {
    const res = await apollo(token).query({
      query: gql`{
        merchant{
          id
        }
      }`,
      fetchPolicy: 'no-cache'
    })

    if(res.data.merchant === null) {
      localStorage.removeItem('token');
      setToken(null);
    }
    else{
      localStorage.setItem('token', token);
      setToken(token);
    }
  }

  getMe(token!);

  const onClickToken = () => {
    getMe('mxde7c9312df401a0264db2bdc521f76f7');
  }

  const onClickRemoveToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  if(token === null) {
    return(
      <div>
        <div>login</div>
        <button onClick={onClickToken}>add token</button>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <main className="content" style={{ padding: theme.spacing(3) }}>
          <div className="toolbar" style={{ padding: theme.spacing(0,1), ...theme.mixins.toolbar }}/>
          <Component {...pageProps} />
          <button onClick={onClickRemoveToken}>remove token</button>
        </main>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    height: 100%;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;

    font-family: verdana;
  }

  #root { height: 100% };

  /* Scroll-bars */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: ${({ theme }) => theme.body};
  }
  
  ::-webkit-scrollbar {
    width: 6px;
    background-color: dimgrey;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: dimgrey;
  }

  ::-webkit-scrollbar-corner { background: dimgrey }

  /* dropdown menu */

  select {
    padding: 0.25rem;
    border-radius: 5px;
  }
`
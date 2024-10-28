import { createGlobalStyle } from "styled-components";
import "antd/dist/reset.css";

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

    body,
    html,
    a {
        font-family: 'Montserrat', sans-serif;
    }


    body {
        margin:0;
        padding:0;
        border: 0;
        outline: 0;
        background: #fff;
        overflow-x: hidden;
    }

    a:hover {
        color: #18216d;
    }

    input,
    textarea {
        border-radius: 4px;
        border: 0;
        transition: all 0.3s ease-in-out;
        outline: none;
        width: 100%;
        padding: 1rem 1.25rem;

        :focus-within {
            box-shadow: #2e186a 0px 0px 0px 1px;
        }
    }

    .custom-heading {
        color: #12111C;
        font-size: 65px;
        font-weight: 700;
        line-height: 1.18;
    }
    
    @media only screen and (max-width: 890px) {
        .custom-heading {
            font-size: 47px;
        }
    }
    
    @media only screen and (max-width: 414px) {
        .custom-heading {
            font-size: 32px;
        }
    }
    

    p {
        color: #12111C;
        font-size: 21px;        
        line-height: 1.41;
    }

    h1 {
        font-weight: 600;
    }

    a {
        text-decoration: none;
        outline: none;
        color: #2E186A;

        :hover {
            color: #2e186a;
        }
    }
    
    *:focus {
        outline: none;
    }

    .about-block-image svg {
        text-align: center;
    }

    .ant-drawer-body {
        display: flex;
        flex-direction: column;
        text-align: left;
        padding-top: 1.5rem;
    }

    .ant-drawer-content-wrapper {
        width: 300px !important;
    }
`;

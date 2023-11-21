import React from "react";
import { Helmet } from "react-helmet";
import AppBarComp from "./Appbar";
import SwipeableTemporaryDrawer from "./SwipeableDrawer/SwipeableDrawer";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <div>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
        </div>
        <title>{title}</title>
      </Helmet>
      <AppBarComp />
      <SwipeableTemporaryDrawer />
      <main
        style={{
          minHeight: "80vh",
        }}
      >
        {children}
      </main>
    </div>
  );
};

Layout.defaultProps = {
  title: "React project",
  description: "React project",
  keywords: "react,material ui",
  author: "Roy Atali",
};

export default Layout;

import React, { Component } from "react";
import logo from "./banner.png";

class Header extends Component {
  render() {
    return (
      <div className="app-header">
        <div className="app-header-title">
          <div style={{ display: "flex" }}>
            <img
              alt="synthetic logo"
              src={logo}
              style={{ height: 50, width: 200 }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;

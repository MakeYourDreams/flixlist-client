import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import popcorn from "../assets/popcorn.png";

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

    const logoPopcorn = {
      backgroundImage: 'url(' + popcorn + ')',
      width: '2.5rem',
      height: '2.75rem',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
  }


  return (
    <div className="nav-container">
      <Navbar className="navStyle" expand="md">
        <Container>
          <NavbarBrand className="mb-4 mr-0" style={logoPopcorn} />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/"
                  exact
                  activeClassName=""
                  className="nav-hov-helper text-white font-weight-bold mb-4"
                >
                  Flixlist
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="d-none d-md-block" navbar>
                <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/"
                  exact
                  activeClassName="router-link-exact-active-new"
                  className="text-white mb-3 font-weight-light nav-hov"
                  style={{fontSize: '0.955rem'}}
                >
                  <div className="nav-hov-helper">
                  <span className="">Trending Movies</span>
                  </div>
                </NavLink>
                </NavItem>
              </Nav>
              <Nav className="d-none d-md-block" navbar>
                <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/tv"
                  exact
                  activeClassName="router-link-exact-active-new"
                  className="text-white mb-3 font-weight-light nav-hov"
                  style={{fontSize: '0.955rem'}}
                >
                  <div className="nav-hov-helper">
                  <span className="">Trending Shows</span>
                  </div>
                </NavLink>
                </NavItem>
              </Nav>             
            <Nav className="d-none d-md-block" navbar>
                <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/favorites"
                  exact
                  activeClassName="router-link-exact-active-new"
                  className="text-white mb-3 font-weight-light nav-hov"
                  style={{fontSize: '0.955rem'}}
                >
                  <div className="nav-hov-helper">
                  <span className="">Favorites</span>
                  </div>
                </NavLink>
                </NavItem>
              </Nav>
              
            <Nav className="d-none d-md-block" navbar>
              {!isAuthenticated && (
                <NavItem>
                  <a href="" onClick={() => loginWithRedirect({})}><div className="justify-content-md-center mb-1"><i className="fa fa-user-plus fa-lg mb-4" style={{color: 'white'}}/></div></a>
                  {/* <Button
                    id="qsLoginBtn"
                    color="light"
                    className="font-weight-bold btn-margin mb-4 text-black btn-primary h-25"
                    size="sm"
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button> */}
                </NavItem>
              )}
              {isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown" className="text-white"> 
                  <i className="fas fa-user-lock fa-lg mb-4" style={{color: 'white'}}/>
                 
                    {/* <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle mb-3"
                      width="38"
                    /> */}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active-new"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                    </DropdownItem>
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                      out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </NavItem>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active-new"
                  >
                    Profile
                  </RouterNavLink>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;

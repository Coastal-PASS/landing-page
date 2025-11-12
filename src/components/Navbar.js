"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPinterestP,
  FaPlus,
  FaRegEnvelope,
  FaSearch,
  FaTwitter,
} from "react-icons/fa";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const menuActive = () => {
    setActive(!active);
  };
  const searchActive = () => {
    setSearchShow(!searchShow);
  };

  // Control sidebar navigation
  useEffect(() => {
    const items = document.querySelectorAll(".menu-item-has-children > a");

    const handleClick = (event) => {
      event.preventDefault(); // Prevent default link behavior
      const subMenu =
        event.currentTarget.parentElement.querySelector(".sub-menu");
      if (subMenu) {
        subMenu.classList.toggle("active");
        event.currentTarget.classList.toggle("open");
      }
    };

    items.forEach((item) => {
      item.addEventListener("click", handleClick);
    });

    // Cleanup function to remove event listeners
    return () => {
      items.forEach((item) => {
        item.removeEventListener("click", handleClick);
      });
    };
  }, []);
  return (
    <>
      {/* navbar start */}
      <nav className="navbar navbar-area navbar-area_7 navbar-area-2 navbar-area-7 navbar-expand-lg bg-white">
        <div className="container nav-container">
          <div className="responsive-mobile-menu">
            <button
              onClick={menuActive}
              className={
                active
                  ? "menu toggle-btn d-block d-lg-none open"
                  : "menu toggle-btn d-block d-lg-none"
              }
              data-target="#itech_main_menu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="icon-left" />
              <span className="icon-right" />
            </button>
          </div>
          <div className="logo">
            <Link href="/">
              <img src="assets/img/ct/logo.png" alt="img" />
            </Link>
          </div>
          <div
            className={
              active
                ? "collapse navbar-collapse sopen"
                : "collapse navbar-collapse"
            }
            id="itech_main_menu"
          >
            <ul className="navbar-nav menu-open text-lg-center ps-lg-5">
              {/* <li>
                <Link href="/">Home</Link>
              </li>
              <li className="menu-item-has-children">
                <Link href="#">Services</Link>
                <ul className="sub-menu">
                  <li>
                    <Link href="/service">Service 01</Link>
                  </li>
                  <li>
                    <Link href="/service-2">Service 02</Link>
                  </li>
                  <li>
                    <Link href="/service-3">Service 03</Link>
                  </li>
                  <li>
                    <Link href="/service-4">Service 04</Link>
                  </li>
                  <li>
                    <Link href="/service-5">Service 05</Link>
                  </li>
                  <li>
                    <Link href="/service-details">Service Single</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li> */}
            </ul>
          </div>
          <div className="nav-right-part nav-right-part-desktop d-lg-inline-flex align-item-center">
            <Link className="btn btn-border-base" href="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* navbar end */}
    </>
  );
};

export default Navbar;

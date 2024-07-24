'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaSearch } from 'react-icons/fa';

const NavbarEight = () => {
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
    const items = document.querySelectorAll('.menu-item-has-children > a');

    const handleClick = (event) => {
      event.preventDefault(); // Prevent default link behavior
      const subMenu = event.currentTarget.parentElement.querySelector('.sub-menu');
      if (subMenu) {
        subMenu.classList.toggle('active');
        event.currentTarget.classList.toggle('open');
      }
    };

    items.forEach(item => {
      item.addEventListener('click', handleClick);
    });

    // Cleanup function to remove event listeners
    return () => {
      items.forEach(item => {
        item.removeEventListener('click', handleClick);
      });
    };
  }, []);
  return (
    <>
      {/* search popup start*/}
      <div
        className={searchShow ? 'td-search-popup active' : 'td-search-popup '}
        id="td-search-popup"
      >
        <form action="/" className="search-form">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search....."
            />
          </div>
          <button type="submit" className="submit-btn">
            <FaSearch />
          </button>
        </form>
      </div>
      {/* search popup end*/}
      <div
        onClick={searchActive}
        className={searchShow ? 'body-overlay active' : 'body-overlay'}
        id="body-overlay"
      ></div>
      {/* navbar start */}
      <nav className="navbar navbar-area navbar-area_8 navbar-area-3 mt-0 navbar-expand-lg">
        <div className="container nav-container">
          <div className="responsive-mobile-menu">
            <button
              onClick={menuActive}
              className={
                active
                  ? 'menu toggle-btn d-block d-lg-none open'
                  : 'menu toggle-btn d-block d-lg-none'
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
            <Link className="d-none d-lg-inline-block" href="index-1">
              <img src="assets/img/home-9/1.png" alt="img" />
            </Link>
            <Link className="d-lg-none d-inline-block" href="index-1">
              <img src="assets/img/logo.png" alt="img" />
            </Link>
          </div>
          <div className="nav-right-part nav-right-part-mobile">
            <span className="search-bar-btn" onClick={searchActive}>
              <FaSearch />
            </span>
          </div>
          <div
            className={
              active
                ? 'collapse navbar-collapse sopen'
                : 'collapse navbar-collapse'
            }
            id="itech_main_menu"
          >
            <ul className="navbar-nav menu-open text-lg-center ps-lg-5">
              <li className="menu-item-has-children">
                <Link href="#">Home</Link>
                <ul className="sub-menu">
                  <li>
                    <Link href="/index-1">IT / Softwer Agency</Link>
                  </li>
                  <li>
                    <Link href="/index-2">SaaS App Landing</Link>
                  </li>
                  <li>
                    <Link href="/index-3">Payments Solution</Link>
                  </li>
                  <li>
                    <Link href="/index-4">Software Company</Link>
                  </li>
                  <li>
                    <Link href="/index-5">Artificial Intelligence</Link>
                  </li>
                  <li>
                    <Link href="/index-6">NFT Service</Link>
                  </li>
                  <li>
                    <Link href="/index-7">Cyber Security</Link>
                  </li>
                  <li>
                    <Link href="/index-8">Hardware Service</Link>
                  </li>
                  <li>
                    <Link href="/index-9">ICO Landing</Link>
                  </li>
                  <li>
                    <Link href="/index-10">Personal Portfolio</Link>
                  </li>
                  <li>
                    <Link href="/index-11">SEO Service</Link>
                  </li>
                </ul>
              </li>
              <li className="menu-item-has-children">
                <Link href="#">Service</Link>
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
              <li className="menu-item-has-children">
                <Link href="#">Pages</Link>
                <ul className="sub-menu">
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/team">Team 01</Link>
                  </li>
                  <li>
                    <Link href="/team-2">Team 02</Link>
                  </li>
                  <li>
                    <Link href="/team-3">Team 03</Link>
                  </li>
                  <li>
                    <Link href="/team-details">Team Details</Link>
                  </li>
                  <li>
                    <Link href="/pricing">Pricing 01</Link>
                  </li>
                  <li>
                    <Link href="/pricing-2">Pricing 02</Link>
                  </li>
                </ul>
              </li>
              <li className="menu-item-has-children mega-menu">
                <Link href="#">Mega Menu</Link>
                <div className="sub-menu">
                  <div className="row">
                    <div className=" mb-lg-4 col-lg-4 col-xl-3">
                      <ul>
                        <li>
                          <Link href="/index-1">IT / Softwer Agency</Link>
                        </li>
                        <li>
                          <Link href="/index-2">SaaS App Landing</Link>
                        </li>
                        <li>
                          <Link href="/index-3">Payments Solution</Link>
                        </li>
                        <li>
                          <Link href="/index-4"> Software Company</Link>
                        </li>
                        <li>
                          <Link href="/index-5">Artificial Intelligence</Link>
                        </li>
                        <li>
                          <Link href="/index-6">NFT Service</Link>
                        </li>
                        <li>
                          <Link href="/index-7">Cyber Security</Link>
                        </li>
                        <li>
                          <Link href="/index-8">Hardware Service</Link>
                        </li>
                        <li>
                          <Link href="/index-9">ICO Landing</Link>
                        </li>
                        <li>
                          <Link href="/index-10">Personal Portfolio</Link>
                        </li>
                        <li>
                          <Link href="/index-11">SEO Service</Link>
                        </li>
                      </ul>
                    </div>
                    <div className=" mb-lg-4 col-lg-4 col-xl-3">
                      <ul>
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
                    </div>
                    <div className=" mb-lg-4 col-lg-4 col-xl-3">
                      <ul>
                        <li>
                          <Link href="/project">Project 01</Link>
                        </li>
                        <li>
                          <Link href="/project-2">Project 02</Link>
                        </li>
                        <li>
                          <Link href="/project-3">Project 03</Link>
                        </li>
                        <li>
                          <Link href="/project-details">Case Study Details</Link>
                        </li>
                        <li>
                          <Link href="/pricing">Pricing 01</Link>
                        </li>
                        <li>
                          <Link href="/pricing-2">Pricing 02</Link>
                        </li>
                      </ul>
                    </div>
                    <div className=" mb-lg-4 col-lg-4 col-xl-3">
                      <ul>
                        <li>
                          <Link href="/about">About Us</Link>
                        </li>
                        <li>
                          <Link href="/team">Team 01</Link>
                        </li>
                        <li>
                          <Link href="/team-2">Team 02</Link>
                        </li>
                        <li>
                          <Link href="/team-3">Team 03</Link>
                        </li>
                        <li>
                          <Link href="/team-details">Team Details</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>

              <li className="menu-item-has-children">
                <Link href="#">Blog</Link>
                <ul className="sub-menu">
                  <li>
                    <Link href="/blog">Blog 01</Link>
                  </li>
                  <li>
                    <Link href="/blog-2">Blog 02</Link>
                  </li>
                  <li>
                    <Link href="/blog-3">Blog 03</Link>
                  </li>
                  <li>
                    <Link href="/blog-4">Blog 04</Link>
                  </li>
                  <li>
                    <Link href="/blog-details">Blog Details</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="nav-right-part nav-right-part-desktop align-self-center">
            <Link className="btn btn-base bg-base-9" href="about">
              Discover More <FaArrowRight className="mt-4" />
            </Link>
          </div>
        </div>
      </nav>
      {/* navbar end */}
    </>
  );
};

export default NavbarEight;
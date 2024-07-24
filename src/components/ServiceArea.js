import Link from "next/link";
import React from "react";
import { FaAngleRight } from "react-icons/fa";

const ServicesArea = () => {
  return (
    <>
      {/*=================== service five start ===================*/}
      <div className="service-area ServiceAreaSeven bg-cover pd-top-120 pd-bottom-90 pd-top-110 pd-bottom-90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8">
              <div className="section-title text-center">
                <h6 className="color-base bg-none mb-3">Our Services</h6>
                <h2 className="title">
                  Comprehensive Solutions <br />
                  For Modern Agriculture
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <div className="single-service-inner style-4 text-center">
                <div className="thumb mb-4">
                  <img src="assets/img/home-7/2.png" alt="img" />
                </div>
                <div className="details">
                  <Link className="btn btn-black" href="#">
                    <FaAngleRight className="mt-0" />
                  </Link>
                  <h5 className="mb-3">Water Management</h5>
                  <p className="content mb-0">
                    Optimize water usage with our advanced field leveling and
                    surveying services. Our state-of-the-art equipment from
                    leading brands like New Holland, Raven, and Trimble ensures
                    your fields are perfectly leveled for effective irrigation
                    and water management.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="single-service-inner style-4 text-center">
                <div className="thumb mb-4">
                  <img src="assets/img/home-7/3.png" alt="img" />
                </div>
                <div className="details">
                  <Link className="btn btn-black" href="#">
                    <FaAngleRight className="mt-0" />
                  </Link>
                  <h5 className="mb-3">Application Control</h5>
                  <p className="content mb-0">
                    Enhance your crop management with our precision spraying
                    equipment. Our solutions provide accurate application of
                    fertilizers and pesticides, ensuring optimal coverage and
                    reducing waste. Partner with us for cutting-edge technology
                    from industry leaders.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="single-service-inner style-4 text-center">
                <div className="thumb mb-4">
                  <img src="assets/img/home-7/4.png" alt="img" />
                </div>
                <div className="details">
                  <Link className="btn btn-black" href="#">
                    <FaAngleRight className="mt-0" />
                  </Link>
                  <h5 className="mb-3">AgSupport</h5>
                  <p className="content mb-0">
                    Introducing AgSupport, our upcoming SaaS platform for
                    tractor dealerships and agricultural service providers. This
                    tool will streamline service scheduling, offer comprehensive
                    fleet management features, and improve customer support, all
                    in one seamless platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================== service area end ===================*/}
    </>
  );
};

export default ServicesArea;

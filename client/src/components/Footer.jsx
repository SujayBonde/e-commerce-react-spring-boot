import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-2 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Discover your signature style with StyleBySujay — where fashion
            meets confidence. We curate timeless trends, bold statements, and
            everyday essentials to elevate your wardrobe. Whether you're
            dressing for impact or comfort, our collections are designed to
            empower your individuality.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link to={"/"}>
              <li className="cursor-pointer">Home</li>
            </Link>
            <Link to={"/about"}>
              <li className="cursor-pointer">About us</li>
            </Link>
            <Link to={"/contact"}>
              <li className="cursor-pointer">Contact</li>
            </Link>
            <a
              href="https://en.wikipedia.org/wiki/E-commerce"
              target="_blank"
              rel="noopener noreferrer"
            >
              <li className="cursor-pointer">Privacy policy</li>
            </a>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 7387385410</li>
            <li>sujaybonde2005@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2026@ stylebysujay.com - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;

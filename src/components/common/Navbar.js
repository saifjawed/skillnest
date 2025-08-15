import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/skillnest.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="relative flex w-11/12 max-w-maxContent items-center justify-between">
        
        {/* Desktop: Logo Left */}
        <div className="hidden md:block">
          <Link to="/">
            <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
          </Link>
        </div>

        {/* Center Navigation (Desktop) */}
        <nav className="hidden md:block flex-1">
          <ul className="flex justify-center gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks && subLinks.length ? (
                        subLinks
                          .filter((subLink) => subLink?.courses?.length > 0)
                          .map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop: Login/Signup */}
        <div className="hidden md:flex items-center gap-x-4">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        {/* Mobile: Logo Center + Hamburger Right */}
        <div className="flex md:hidden items-center justify-center w-full relative">
          {/* Centered Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src={logo} alt="Logo" width={140} height={28} loading="lazy" />
          </Link>
          {/* Hamburger on right */}
          <button
            className="absolute right-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <AiOutlineClose fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
    <div className="absolute top-14 left-0 w-full bg-richblack-800 flex flex-col items-start p-4 gap-4 md:hidden z-50">
  {/* Show login/signup only if not logged in */}
  {!token && (
    <>
      <Link
        to="/login"
        onClick={() => setMobileMenuOpen(false)}
        className="text-richblack-25"
      >
        Log in
      </Link>
      <Link
        to="/signup"
        onClick={() => setMobileMenuOpen(false)}
        className="text-richblack-25"
      >
        Sign up
      </Link>
    </>
  )}

  <Link
    to="/catalog/ai-ml"
    onClick={() => setMobileMenuOpen(false)}
    className="text-richblack-25"
  >
    Courses
  </Link>
  <Link
    to="/about"
    onClick={() => setMobileMenuOpen(false)}
    className="text-richblack-25"
  >
    About Us
  </Link>
  <Link
    to="/contact"
    onClick={() => setMobileMenuOpen(false)}
    className="text-richblack-25"
  >
    Contact Us
  </Link>

  {/* Show Dashboard only if logged in */}
  {token && (
    <Link
      to="/dashboard/my-profile"
      onClick={() => setMobileMenuOpen(false)}
      className="text-richblack-25"
    >
      My Profile
    </Link>
  )}
</div>
      )}
    </div>
  );
}

export default Navbar;

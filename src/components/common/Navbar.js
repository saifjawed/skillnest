import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/skillnest.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links for desktop */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {/* ...existing code... */}
                {link.title === "Catalog" ? (
                  <>
                    {/* ...existing code... */}
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`$${
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
        {/* Login / Signup / Dashboard for desktop */}
        <div className="items-center gap-x-4 flex-col hidden md:flex">
          {/* ...existing code... */}
        </div>
        {/* Hamburger icon for mobile */}
        <button className="mr-4 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[2000] bg-black bg-opacity-70 flex flex-col md:hidden">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl">&times;</button>
            </div>
            <nav className="flex flex-col items-center gap-y-6 mt-8">
              {NavbarLinks.map((link, index) => (
                <div key={index} className="w-full text-center">
                  {link.title === "Catalog" ? (
                    <div className="relative">
                      <span className="flex items-center justify-center gap-2 text-lg font-semibold text-white cursor-pointer">
                        {link.title}
                        <BsChevronDown />
                      </span>
                      <div className="mt-2 bg-white rounded shadow-lg">
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : (subLinks && subLinks.length) ? (
                          subLinks
                            .filter((subLink) => subLink?.courses?.length > 0)
                            .map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                className="block px-4 py-2 text-black hover:bg-gray-200"
                                key={i}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subLink.name}
                              </Link>
                            ))
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link?.path}
                      className="block text-lg font-semibold text-white py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
              {/* Login / Signup / Dashboard for mobile */}
              <div className="flex flex-col items-center gap-y-4 mt-6">
                {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                  <Link to="/dashboard/cart" className="relative" onClick={() => setMobileMenuOpen(false)}>
                    <AiOutlineShoppingCart className="text-2xl text-white" />
                    {totalItems > 0 && (
                      <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-yellow-500 text-center text-xs font-bold text-black">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                {token === null && (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="rounded-[8px] border border-white bg-black px-[12px] py-[8px] text-white">
                      Log in
                    </button>
                  </Link>
                )}
                {token === null && (
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <button className="rounded-[8px] border border-white bg-black px-[12px] py-[8px] text-white">
                      Sign up
                    </button>
                  </Link>
                )}
                {token !== null && <ProfileDropdown />}
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar;

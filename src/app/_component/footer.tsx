const Footer = () => {
  return (
    <footer className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <span className="text">MULTISTORE</span>
          </a>
          <p className="mt-2 text-sm text-gray-500">
            The Home of Authentic Products
          </p>
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          {/* store links */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              STORES
            </h2>
            <nav className="list-none mb-10 text-sm flex flex-col gap-2">
              <li>
                <a className="text-gray-600 hover:text-gray-800">Clothings</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">Footwears</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">Accessories</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">
                  Home Appliance
                </a>
              </li>
            </nav>
          </div>
          {/* product links */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              PRODUCTS
            </h2>
            <nav className="list-none mb-10 text-sm flex flex-col gap-2">
              <li>
                <a className="text-gray-600 hover:text-gray-800">Clothings</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">Footwears</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">Accessories</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">
                  Home Appliance
                </a>
              </li>
            </nav>
          </div>
          {/* brand links */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              BRANDS
            </h2>
            <nav className="list-none mb-10 text-sm flex flex-col gap-2">
              <li>
                <a className="text-gray-600 hover:text-gray-800">Clothings</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">Footwears</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">Accessories</a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800">
                  Home Appliance
                </a>
              </li>
            </nav>
          </div>
          {/* store info like address, phone number e.t.c */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="flex flex-col font-medium text-gray-900 text-sm mb-3">
              <span className="underlinet text-xs">Address</span>
              <span className="text-gray-600">
                No 5 Mbatoli street, Shopping avenue, Ikeja Abuja.
              </span>
            </h2>
            <nav className="list-none mb-10 text-sm flex flex-col gap-2">
              <li className="flex flex-col">
                <span className="underlinet text-xs">Phone Number</span>
                <span className="text-gray-600 hover:text-gray-800">
                  09087654321
                </span>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © 2020 Multistore —
            <a
              href="https://twitter.com/knyttneve"
              rel="noopener noreferrer"
              className="text-gray-600 ml-1"
              target="_blank"
            >
              @multistore_africa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

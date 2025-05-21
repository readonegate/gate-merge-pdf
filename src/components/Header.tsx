import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="w-full py-4 border-b">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-pdf"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h1 className="text-xl font-bold">PDFTools</h1>
        </Link>
        <nav>
          <ul className="flex items-center gap-6">
            <li
              className={
                location.pathname === "/"
                  ? "font-medium text-pdf"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              <Link to="/">Merge PDF</Link>
            </li>
            <li
              className={
                location.pathname === "/split-pdf"
                  ? "font-medium text-pdf"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              <Link to="/split-pdf">Split PDF</Link>
            </li>
            {/* <li className="text-muted-foreground hover:text-foreground transition-colors">Convert</li>
            <li className="text-muted-foreground hover:text-foreground transition-colors">Compress</li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

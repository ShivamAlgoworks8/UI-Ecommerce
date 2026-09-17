import { useEffect, useRef, useState } from "react";
import "./AdminHeader.css";
import AdminNavigation from "./AdminNavigation";

type AdminHeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

function AdminHeader({ currentPage, onNavigate }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1>Nexora</h1>

        <AdminNavigation
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
      </div>

      <div className="admin-header-right" ref={profileRef}>
        <button
          className="profile-button"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          aria-label="Open profile menu"
          aria-expanded={isProfileOpen}
        >
          <div className="profile-avatar">S</div>

          <svg
            className={`profile-chevron ${isProfileOpen ? "open" : ""}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isProfileOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <div className="profile-avatar large">S</div>

              <div>
                <strong>Shivam</strong>
                <span>Administrator</span>
              </div>
            </div>

            <div className="dropdown-divider" />

            <button className="dropdown-item">Profile</button>

            <button className="dropdown-item logout">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
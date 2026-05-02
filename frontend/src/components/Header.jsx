import { Link, useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-blue-600">
          AI Study Companion
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link to="/progress" className="text-gray-700 hover:text-blue-600">Progress</Link>
              <button onClick={logout} className="px-3 py-2 rounded bg-red-500 text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded bg-blue-600 text-white">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

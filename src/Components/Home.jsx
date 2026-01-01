import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { isAdmin, logActivity, getAuthUser } from "../utils/authUtils"
import "../styles/home.css"
import "../styles/alerts.css"

const Home = () => {
  const [employees, setEmployees] = useState(null)
  const [filteredEmployees, setFilteredEmployees] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [designationFilter, setDesignationFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigator = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const authUser = getAuthUser()
  const itemsPerPage = 6

  // Fetch employees data
  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("http://localhost:3000/employee")
      setEmployees(data)
      setFilteredEmployees(data)
    } catch (error) {
      setMessage("Failed to load employees")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Sync search from URL params
  useEffect(() => {
    const querySearch = searchParams.get('search')
    if (querySearch !== null && querySearch !== searchTerm) {
      setSearchTerm(querySearch)
    }
  }, [searchParams])

  // Apply designation filter from query param
  useEffect(() => {
    const queryDesignation = searchParams.get("designation")
    if (queryDesignation && queryDesignation !== designationFilter) {
      setDesignationFilter(queryDesignation)
    }
  }, [searchParams, designationFilter])

  // Get unique designations for filter
  const getDesignations = () => {
    if (!employees) return []
    return [...new Set(employees.map(emp => emp.designation))]
  }

  // Filter and sort employees
  useEffect(() => {
    if (!employees) return

    let result = [...employees]

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Designation filter
    if (designationFilter !== "all") {
      result = result.filter(emp => emp.designation === designationFilter)
    }

    // Sort
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredEmployees(result)
    setCurrentPage(1) // Reset to first page
  }, [employees, searchTerm, designationFilter, sortOrder])

  // Keep URL query in sync with designation filter
  useEffect(() => {
    if (designationFilter === "all") {
      searchParams.delete("designation")
      setSearchParams(searchParams, { replace: true })
    } else {
      const current = searchParams.get("designation")
      if (current !== designationFilter) {
        searchParams.set("designation", designationFilter)
        setSearchParams(searchParams, { replace: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designationFilter])

  // Pagination
  const getTotalPages = () => {
    if (!filteredEmployees) return 0
    return Math.ceil(filteredEmployees.length / itemsPerPage)
  }

  const getPaginatedEmployees = () => {
    if (!filteredEmployees) return []
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage)
  }

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      await axios.delete(`http://localhost:3000/employee/${id}`)
      await logActivity(authUser.id, authUser.email, "DELETE", id, `Deleted employee: ${name}`)
      setMessage("Employee deleted successfully")
      fetchData()
    } catch (error) {
      setMessage("Failed to delete employee")
      console.error(error)
    }
  }

  // Handle view employee
  const handleView = (id) => {
    navigator(`/view-employee/${id}`)
  }

  // Handle update employee
  const handleUpdate = (id) => {
    navigator(`/update-employee/${id}`)
  }

  return (
    <div className="home-container">
      {message && <div className="inline-alert">{message}</div>}
      {/* Header Section */}
      <section className="home-header">
        <h1 className="home-title">Employee Registry</h1>
        {isAdmin() && (
          <button
            className="btn btn-primary"
            onClick={() => navigator("/create-employee")}
          >
            ➕ Create Employee
          </button>
        )}
      </section>

      {/* Controls Section */}
      <section className="controls-section">
        <div className="search-box desktop-search">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-group">
          {/* Designation Filter */}
          <select
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Designations</option>
            {getDesignations().map(designation => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>

          {/* Sort Toggle */}
          <button
            className={`sort-button ${sortOrder}`}
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={`Sort ${sortOrder === "asc" ? "Z-A" : "A-Z"}`}
          >
            {sortOrder === "asc" ? "↑ A-Z" : "↓ Z-A"}
          </button>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>{filteredEmployees?.length || 0} employee(s) found</p>
        </div>
      </section>

      {/* Employees Grid Section */}
      <main className="employees-grid">
        {loading ? (
          <div className="loading">Loading employees...</div>
        ) : filteredEmployees && filteredEmployees.length > 0 ? (
          getPaginatedEmployees().map((employee) => (
            <article className="employee-card" key={employee.id}>
              <div className="card-image">
                <img
                  src={employee.photo}
                  alt={employee.name}
                  className="employee-photo"
                />
              </div>

              <div className="card-content">
                <h2 className="employee-name">{employee.name}</h2>
                <p className="employee-designation">{employee.designation}</p>

                <div className="employee-details">
                  <p>
                    <span className="detail-icon">📧</span>
                    <span className="detail-text">{employee.email}</span>
                  </p>
                  <p>
                    <span className="detail-icon">📱</span>
                    <span className="detail-text">{employee.phone}</span>
                  </p>
                  <p>
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{employee.dob}</span>
                  </p>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleView(employee.id)}
                  title="View Details"
                >
                  👁️ View
                </button>
                {isAdmin() && (
                  <>
                    <button
                      className="btn btn-info"
                      onClick={() => handleUpdate(employee.id)}
                      title="Edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(employee.id, employee.name)}
                      title="Delete"
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="no-results">
            <p>No employees found</p>
          </div>
        )}
      </main>

      {/* Pagination Section */}
      {filteredEmployees && filteredEmployees.length > itemsPerPage && (
        <section className="pagination-section">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="page-info">
            <span>Page {currentPage} of {getTotalPages()}</span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
            disabled={currentPage === getTotalPages()}
          >
            Next →
          </button>
        </section>
      )}
    </div>
  )
}

export default Home
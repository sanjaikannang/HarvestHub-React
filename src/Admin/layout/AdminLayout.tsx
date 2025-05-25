import Header from "../components/Header"
import MainComponent from "../components/MainComponent"
import Sidebar from "../components/Sidebar"

const AdminLayout = () => {

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <MainComponent />
        </div>
      </div>
    </>
  )
}

export default AdminLayout
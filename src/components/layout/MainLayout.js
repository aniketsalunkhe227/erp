import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="">
        <div className="">
          {children}
        </div>
      </main>
    </div>
  );
}
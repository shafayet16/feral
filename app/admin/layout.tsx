import AdminCheck from './AdminCheck';
import AdminNav from './AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminCheck>
      <AdminNav />
      {children}
    </AdminCheck>
  );
}
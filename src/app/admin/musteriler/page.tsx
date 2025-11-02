'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, UserCog, Trash2, Eye, ShoppingBag, MessageSquare } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  image?: string;
  createdAt: string;
  _count: {
    orders: number;
    reviews: number;
  };
}

interface UserDetail extends User {
  orders: any[];
  reviews: any[];
  addresses: any[];
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [status, session, searchTerm, roleFilter, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/users?search=${searchTerm}&role=${roleFilter}&page=${page}&limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Kullanıcı rolünü ${newRole === 'admin' ? 'Admin' : 'Müşteri'} olarak değiştirmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success('Rol başarıyla güncellendi');
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Rol güncellenirken hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Kullanıcı silindi');
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Kullanıcı silinirken hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const viewUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.user);
        setDetailModalOpen(true);
      }
    } catch (error) {
      toast.error('Kullanıcı detayları yüklenirken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading && page === 1) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-gray-600 mt-1">
          Toplam {users.length} kullanıcı
        </p>
      </div>

      {/* Filtreler */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="İsim veya e-posta ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={(value) => {
          setRoleFilter(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Roller</SelectItem>
            <SelectItem value="customer">Müşteriler</SelectItem>
            <SelectItem value="admin">Adminler</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tablo */}
      {users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Kullanıcı bulunamadı</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Siparişler</TableHead>
                  <TableHead>Yorumlar</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-pink-600 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'Müşteri'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user.phone || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <ShoppingBag size={16} className="text-gray-400" />
                        {user._count.orders}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MessageSquare size={16} className="text-gray-400" />
                        {user._count.reviews}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewUserDetails(user.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(
                            user.id,
                            user.role === 'admin' ? 'customer' : 'admin'
                          )}
                          disabled={user.id === session?.user?.id}
                        >
                          <UserCog className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.id === session?.user?.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Önceki
              </Button>
              <span className="px-4 py-2 text-sm">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sonraki
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detay Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kullanıcı Detayları</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} - {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 mt-4">
              {/* Genel Bilgiler */}
              <div>
                <h3 className="font-semibold mb-3">Genel Bilgiler</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Rol:</span>
                    <Badge className="ml-2" variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedUser.role === 'admin' ? 'Admin' : 'Müşteri'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Telefon:</span>
                    <span className="ml-2">{selectedUser.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Kayıt Tarihi:</span>
                    <span className="ml-2">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Siparişler */}
              <div>
                <h3 className="font-semibold mb-3">
                  Son Siparişler ({selectedUser.orders.length})
                </h3>
                {selectedUser.orders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.orders.map((order: any) => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <p className="font-semibold">₺{order.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Henüz sipariş yok</p>
                )}
              </div>

              {/* Adresler */}
              <div>
                <h3 className="font-semibold mb-3">
                  Kayıtlı Adresler ({selectedUser.addresses.length})
                </h3>
                {selectedUser.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.addresses.map((address: any) => (
                      <div key={address.id} className="p-3 bg-gray-50 rounded text-sm">
                        <p className="font-medium">{address.title}</p>
                        <p className="text-gray-600">
                          {address.address}, {address.district}/{address.city}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Kayıtlı adres yok</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
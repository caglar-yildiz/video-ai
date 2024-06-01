"use client"
import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserListResponse, UserListUserType } from "@/app/api/organization/list-user/route"
import { Button } from "@/components/ui/button"

const OrganizationUserList = ( ) => {
  const [users, setUsers] = useState<UserListUserType[]>([]);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

  const deleteUser = async (userId :string) => {
    try {
      const response = await fetch(`/api/organization/delete-user/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        throw new Error('Delete operation was not successful');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/organization/list-user');
        const data : UserListResponse = await response.json();
        console.log(data)
        setUsers(data.userList || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-2">
      {users.map((user, index) => (
        <div
          key={user.id}
          className={`flex items-center gap-4 rounded justify-between ${index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100'}`}
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage alt={user.name} src={user.image || '/placeholder-avatar.jpg'} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.name}</p>
            </div>
          </div>
          <Button variant={"destructive"} onClick={() => deleteUser(user.id)}>Delete</Button>
        </div>
      ))}
    </div>
  );
};

export default OrganizationUserList;

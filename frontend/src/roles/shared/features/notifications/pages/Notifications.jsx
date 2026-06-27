import React from 'react';
import { useNotifications } from '../../../../../context/NotificationContext';
import { HiOutlineBell, HiCheck } from 'react-icons/hi2';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="space-y-8 select-none max-w-3xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500">Stay up to date with events, credentials releases, and announcements</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs">
            <HiCheck /> Mark all read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-slate-200/10">
            <p className="text-slate-500 font-medium">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif._id}
              onClick={() => !notif.read && markAsRead(notif._id)}
              className={`flex items-start gap-4 p-5 cursor-pointer border border-slate-200/10 ${
                !notif.read ? 'bg-primary/5 dark:bg-primary/5 font-semibold' : 'opacity-85'
              }`}
            >
              <div className={`p-2.5 rounded-lg text-lg flex-shrink-0 ${
                !notif.read ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-950 text-slate-400'
              }`}>
                <HiOutlineBell />
              </div>
              <div className="flex-1 space-y-1 text-left">
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">{notif.message}</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </Card>
          ))
        )}
      </div>

    </div>
  );
};

export default Notifications;

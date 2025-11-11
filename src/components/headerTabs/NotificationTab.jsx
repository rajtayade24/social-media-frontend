import { relativeTimeCompact } from '../../utils/dateUtils';
import normalizeUrl from '../../utils/urlUtils';
import { UserCircle2Icon } from 'lucide-react';

export default function NotificationTab(props) {
  return (
    <div
      className={`noti-section bg-white rounded-r-3xl shadow-[1px_0px_7px_0px_gray] transition-all duration-[500ms] ease-out overflow-hidden 
    ${props.isNotificationsSection ? "w-[350px]" : "w-0"} dark:bg-[#1e1c21]`}
      onClick={props.handleBackdropClick}
    >
      <div className="">
        <div className="text-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Notifications</span>
            <span className="text-sm px-2 py-0.5 rounded-full bg-[#eee] dark:bg-[#2a282d]">
              {props.unreadNotificationCount ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); props.markAllRead(); }}
              className="text-xs px-3 py-1 rounded-2xl border hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-500"
              title="Mark all read"
              disabled={!props.userMainId}
            >
              Mark all read
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); props.deleteAllNotifications() }}
              className="text-xs px-3 py-1 rounded-2xl border hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-500"
              title="Clear local list"
              disabled={!props.userMainId}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="px-4">
          {props.notificationError && (
            <div className="text-red-500 text-sm mb-2">{props.notificationError}</div>
          )}
        </div>

        {/* <div className="max-h-[calc(100vh-90px)] overflow-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"> */}
        <div className="max-h-[calc(100vh-90px)] overflow-auto scrollbar-hide px-4 pb-6 scrollbar-hide">
          {props.notifications.length === 0 && !props.notificationLoading && (
            <div className="text-center text-sm text-gray-500 py-10">No notifications</div>
          )}

          <ul className="space-y-3">
            {props.notifications.map((n) => (
              <li
                key={n?.userid || n?.id}
                className={`profiles flex gap-2 justify-between items-center py-2 px-3 cursor-pointer text-[14px] dark:hover:bg-gray-950 `}
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.handleProfileSection) props.handleProfileSection(n)
                  if (!n.read) props.markAsReadNotification(n.id);
                }}
              >
                <span className=" relative flex-shrink-0 w-10 h-10 rounded-full bg-[#f0f0f0] dark:bg-[#2b2a2d] flex items-center justify-center text-sm">
                  {n.profilePhotoUrl ?
                    <img
                      className="h-[45px] w-[45px] rounded-full"
                      src={normalizeUrl(n.profilePhotoUrl)}
                      alt="user profile"
                    />
                    : <UserCircle2Icon />
                  }
                  {(n.read !== undefined && !n.read) && (
                    < span className='absolute h-3 w-3 right-0 -bottom-[2px] bg-red-400 rounded-full'></span>
                  )}
                </span>

                <div className="flex flex-col">
                  <div>

                    <span className="username font-bold mr-2">
                      {n.username}
                    </span>

                    {props.markAsReadNotification && (
                      <span>
                        <span className=' mr-2'>
                          {n.type === "FOLLOW"
                            ? "Started following you."
                            : n.message}
                        </span>
                        <span className="text-xs text-gray-500">
                          {relativeTimeCompact(n.createdAt)}
                        </span>
                      </span>
                    )}

                  </div>

                  {!props.markAsReadNotification && (
                    <div className="name text-gray-500">{n.name}</div>
                  )}
                </div>

              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-center gap-3">
            {props.notificationLoading && (
              <div className="text-sm text-gray-500">Loading...</div>
            )}
            {!props.notificationLoading && props.hasMoreNotification && (
              <button
                onClick={(e) => { e.stopPropagation(); props.handleLoadMore(); }}
                className="text-sm px-4 py-2 rounded-md border"
              >
                Load more
              </button>
            )}
            {!props.notificationLoading && !props.hasMoreNotification && props.notifications.length > 0 && (
              <div className="text-xs text-gray-400">No more notifications</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

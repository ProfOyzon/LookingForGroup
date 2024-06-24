import { CreateNotification } from "./NotificationSingles";

let notifications = [
    CreateNotification("Notification 1", new Date('2024-06-15T10:00:00Z')),
    CreateNotification("Notification 2", new Date('2024-06-12T06:00:00Z')),
    CreateNotification("Notification 3", new Date('2024-06-10T07:00:00Z')),
    CreateNotification("Notification 4", new Date('2024-06-12T05:00:00Z')),
    CreateNotification("Notification 5", new Date('2024-06-23T09:00:00Z')),
    CreateNotification("Notification 6", new Date('2024-06-22T08:00:00Z')),
    CreateNotification("Notification 7", new Date('2024-06-01T11:00:00Z')),
    CreateNotification("Notification 8", new Date('2024-07-12T12:00:00Z')),
    
]

function SortNotifs(notifs) {
    return notifs.sort((a, b) => b.time.getTime() - a.time.getTime())
}

function FormatDate(dateString) {
    const date = new Date(dateString);
    let month = date.getMonth();
    let day = date.getDate();

    return (
        `${month}-${day}`
    )

}

function GroupNotifsByDate(notifs) {
    let grouped = [];
    notifs.forEach(notification => {
        const formattedDate = FormatDate(notification.time);

        if (!grouped[formattedDate]) {
            grouped[formattedDate] = [];
        }

        grouped[formattedDate].push(notification);
    });

    return grouped;
}

function Check(stuff) {
    console.log(stuff);
}

export function DisplayNotifs2() {
    let sortedNotifs = SortNotifs(notifications);
    let groupedNotifs = GroupNotifsByDate(sortedNotifs);
    let content;

    Check(groupedNotifs);

    return (
        <>
            <h2 className="notif-header">Notifications</h2>

            <div>

            </div>

            {sortedNotifs.map(notif => (
                <>
                    <div className="date-sent-header">
                        <p>{notif.time.getMonth()}-{notif.time.getDate()}-{notif.time.getFullYear()}</p>

                    </div>
                    <div className="notif-popup-boxes">
                        <p>{notif.message} --- Time: {notif.time.getHours()}:{notif.time.getMinutes()}</p>
                    </div>
                </>
            ))}
        </>
    )
}

export function DisplayNotifs() {
    let sortedNotifs = SortNotifs(notifications);
    let groupedNotifs = GroupNotifsByDate(sortedNotifs);
    let content;

    return (
        <>
            <h2 className="notif-header">Notifications</h2>
            {sortedNotifs.map(notif => (
                <>
                    <div className="date-sent-header">
                        <p>{notif.time.getMonth()}-{notif.time.getDate()}-{notif.time.getFullYear()}</p>
                        {content}
                    </div>
                    <div className="notif-popup-boxes">
                        <p>{notif.message} --- Time: {notif.time.getHours()}:{notif.time.getMinutes()}</p>
                    </div>
                </>
            ))}
        </>
    )
}
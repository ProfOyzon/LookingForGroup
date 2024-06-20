let notifications = [
    { message: "Notification 1", time: new Date('2024-06-15T10:00:00Z') },
    { message: "Notification 2", time: new Date('2024-06-12T06:00:00Z') },
    { message: "Notification 3", time: new Date('2024-06-10T07:00:00Z') },
    { message: "Notification 4", time: new Date('2024-06-12T05:00:00Z') },
    { message: "Notification 5", time: new Date('2024-06-23T09:00:00Z') },
    { message: "Notification 6", time: new Date('2024-06-22T08:00:00Z') },
    { message: "Notification 7", time: new Date('2024-06-01T11:00:00Z') },
    { message: "Notification 8", time: new Date('2024-07-12T12:00:00Z') },
]

function sortNotifs(notifs){
    return notifs.sort((a, b) =>b.time.getTime() - a.time.getTime())
}

function FormatDate(dateString){
    const date = new Date(dateString);
    let month = date.getMonth();
    let day = date.getDate();

    return(
        `${month}-${day}`
    )

}

export function CreateNotifs() {
    let sortedNotifs = sortNotifs(notifications);

    return (
        <>
        <h2 className="notif-header">Notifications</h2>
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
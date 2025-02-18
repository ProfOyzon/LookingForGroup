import { CreateNotification } from './NotificationSingles';

//fake notifications for testing purposes
//can move to the "fake data" file if needed
let notifications = [
  CreateNotification('Notification 1', new Date('2024-06-15T10:00:00Z')),
  CreateNotification('Notification 2', new Date('2024-06-12T06:00:00Z')),
  CreateNotification('Notification 3', new Date('2024-06-10T07:00:00Z')),
  CreateNotification('Notification 4', new Date('2024-06-12T05:00:00Z')),
  CreateNotification('Notification 5', new Date('2024-06-23T09:00:00Z')),
  CreateNotification('Notification 6', new Date('2024-06-22T08:00:00Z')),
  CreateNotification('Notification 7', new Date('2024-06-01T11:00:00Z')),
  CreateNotification('Notification 8', new Date('2024-07-12T12:00:00Z')),
  CreateNotification('Notification 9', new Date('2024-07-12T18:00:00Z')),
];

//arranges notifications from oldest to newest
//most recent notifs get pushed to the top
function SortNotifs(notifs) {
  return notifs.sort((a, b) => b.time.getTime() - a.time.getTime());
}

//turns the given date for notifs into a more human readable format
//puts it into a 'month-day' format for the headers
function FormatDate(dateString) {
  const date = new Date(dateString);
  let month = date.getMonth();
  let day = date.getDate();

  return `${month}-${day}`;
}

//organizes each notification by the day they were sent
//so all notifs "created" on the same day are grouped
//together to later be placed under the same header
function GroupNotifsByDate(notifs) {
  //creates a new array
  let grouped;
  grouped = [];

  //first, go through each notification
  notifs.forEach((notification) => {
    //format the time for the current notification
    const formattedDate = FormatDate(notification.time);

    //check the array, using the formmated date as a key,
    //to see if anything exists there

    //if NOT, create a new array using that
    //formatted date as a key
    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }

    //push the notification to the nested array
    //*the nested arrays are unique dates,
    //and notifs are oragnized within these dates
    grouped[formattedDate].push(notification);
  }, {});

  return grouped;
}

//how the notifications are to be displayed
export function DisplayNotifs() {
  //first sort the notifs by time
  //the most recent go up towards the top
  let sortedNotifs = SortNotifs(notifications);

  //get the sorted notifs from above and group them
  //puts all notifs from the same day under one header
  let groupedNotifs = GroupNotifsByDate(sortedNotifs);

  return (
    <>
      <h2 className="notif-header">Notifications</h2>

      <div></div>
      {Object.keys(groupedNotifs).map((notif) => (
        <>
          <div className="date-sent-header">
            <p>Date: {notif}</p>
          </div>

          {groupedNotifs[notif].map((notification) => (
            <div className="notif-popup-boxes">
              <p>
                {notification.message} --- Time: {notification.time.getHours()}:
                {(notification.time.getMinutes() < 10 ? '0' : '') + notification.time.getMinutes()}
              </p>
            </div>
          ))}
        </>
      ))}
    </>
  );
}

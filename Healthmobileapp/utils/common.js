//tạo roomId từ id của 2 user
export const getRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    const roomId = sortedIds.join('-');
    //user1-user2
    return roomId;
}
export const formatDate = date => {
    var day = date.getDate();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var month = monthNames[date.getMonth()];

    var formatedDate = day + ' ' + month;
    return formatedDate;
}
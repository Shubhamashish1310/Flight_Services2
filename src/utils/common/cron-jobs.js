const cron = require('node-cron');
const { BookingService } = require('../../services');
function scheduleCronJobs() {
    cron.schedule('*/30 * * * *', async() => {
        console.log('Running a task every 5 seconds');
        await BookingService.cancelOldBookings();
    });
}


module.exports = {
    scheduleCronJobs,
};
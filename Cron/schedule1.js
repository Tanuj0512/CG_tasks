const cron = require('node-cron');

const task = () => {
    console.log("Scheduled task runnig at : ", new Date());
};

cron.schedule("* * * * * *", task);
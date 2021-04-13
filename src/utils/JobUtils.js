module.exports = {
  remainingDays(job) {
    // quantos dias para finalizar o job
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();

    let createdDate = new Date(job.created_at);

    //data de finalização
    const dueDay = createdDate.getDate() + Number(remainingDays);
    const dueDate = createdDate.setDate(dueDay);
    createdDate = new Date(job.created_at);

    const timeDiffInMs = dueDate - Date.now();
    // tranf milisec em dias
    const dayInMs = 1000 * 60 * 60 * 24;
    const dayDiff = Math.ceil(timeDiffInMs / dayInMs);

    return dayDiff;
  },
  calculateBudget: (job, valueHour) => valueHour * job["total-hours"],

  calculateAheadDays(job) {
    let createdDate = new Date(job.created_at);
    const finishedDate = new Date(job.finished_at);
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
    const dueDay = createdDate.getDate() + Number(remainingDays);
    const dueDate = createdDate.setDate(dueDay);
    const dayInMs = 1000 * 60 * 60 * 24;

    const aheadDaysInMs = dueDate - finishedDate;
    const aheadDays = Math.ceil(aheadDaysInMs / dayInMs);

    return aheadDays;
  },
};

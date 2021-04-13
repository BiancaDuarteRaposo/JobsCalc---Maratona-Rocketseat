const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    const statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };
    // total de hr por dia de cada jpb em progress
    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      //ajustando o job
      const finishedAt = JobUtils.finishedAtDate(job);
      const remaining = JobUtils.remainingDays(job);
      const aheadDays = JobUtils.calculateAheadDays(job);
      const status = job["is-finished"] == "1" ? "done" : "progress";
      //somando a quantidade de status
      statusCount[status] += 1;

      // total de hr por dia de cada jpb em progress
      jobTotalHours =
        status === "progress"
          ? jobTotalHours + Number(job["daily-hours"])
          : jobTotalHours;

      return {
        ...job,
        remaining,
        aheadDays,
        finishedAt,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    //qtd de horas que quero trabalhar profile menos a qtd de horas dia de cada projeto
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};

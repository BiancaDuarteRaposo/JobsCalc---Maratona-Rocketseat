const Database = require("../db/config");

module.exports = {
  async get() {
    const db = await Database();

    const jobs = await db.all(`SELECT * FROM jobs`);

    await db.close();

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      "daily-hours": job.daily_hours,
      "total-hours": job.total_hours,
      created_at: job.created_at,
      "is-finished": job.is_finished,
      finished_at: job.finished_at,
    }));
  },

  async update(updatedJob, jobId) {
    const db = await Database();

    let finished_at = updatedJob["is-finished"] == "1" ? Date.now() : null;

    await db.run(`UPDATE jobs SET
    name = "${updatedJob.name}",
    daily_hours = ${updatedJob["daily-hours"]},
    total_hours = ${updatedJob["total-hours"]},
    is_finished = ${updatedJob["is-finished"]},
    finished_at = "${finished_at}"
    WHERE id = ${jobId}
    `);
  },
  async delete(id) {
    const db = await Database();

    await db.run(`DELETE FROM jobs WHERE id = ${id}`);
    await db.close();
  },

  async create(newJob) {
    const db = await Database();

    await db.run(`INSERT INTO jobs (
      name,
      daily_hours,
      total_hours,
      created_at
    ) VALUES (
      "${newJob.name}",
      ${newJob["daily-hours"]},
      ${newJob["total-hours"]},
      ${newJob.created_at}
    )`);
    await db.close();
  },
};

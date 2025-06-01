const { execSync } = require("child_process");

// Helper to get a random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pad numbers with leading zeros
function pad(n) {
  return String(n).padStart(2, "0");
}

// Convert date + time to ISO string
function toISO(date, h, m, s) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(h)}:${pad(m)}:${pad(s)}`;
}

// ----- CONFIG -----
const start = new Date("2025-06-01");
const end = new Date("2025-07-01");
const minTotalCommits = 30;  // تم التعديل
const maxTotalCommits = 47;  // تم التعديل
const workingHourStart = 10;
const workingHourEnd = 18;
// -------------------

// 1) Pick total commits for the month
const totalCommits = randomInt(minTotalCommits, maxTotalCommits);
console.log(`🎯 Target commits for month: ${totalCommits}`);

// 2) Get all days in the range
let days = [];
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  days.push(new Date(d));
}

// 3) Randomly assign commits to days
let datesArray = [];
for (let i = 0; i < totalCommits; i++) {
  const randomDay = days[randomInt(0, days.length - 1)];
  const hour = randomInt(workingHourStart, workingHourEnd);
  const min = randomInt(0, 59);
  const sec = randomInt(0, 59);
  datesArray.push(toISO(randomDay, hour, min, sec));
}

// 4) Sort commits chronologically
datesArray.sort((a, b) => new Date(a) - new Date(b));

// 5) Create commits in Git
datesArray.forEach(date => {
  const msg = `Commit for ${date}`;
  console.log(`Creating: ${msg}`);
  execSync(`git commit --allow-empty -m "${msg}"`, {
    stdio: "inherit",
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: date,
      GIT_COMMITTER_DATE: date
    }
  });
});

console.log("✅ All commits created!");

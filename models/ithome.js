const cheerio = require('cheerio');
const rp = require('request-promise');

async function ithome2020api(team) {
  const teams = {};
  const url = `https://ithelp.ithome.com.tw/2020ironman/signup/team/${team}`;
  const options = {
    uri: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  const $ = await rp(options);

  ithome2020Parse($, teams);

  return { teams };
}

function ithome2020Parse($, teams) {
  const teamDashboardNum = $('span', '.team-dashboard__num');

  if (Object.getOwnPropertyNames(teams).length === 0) {
    teams.title = $('.team-detail__title').text().trim(); // 團隊隊名
    teams.img = $('.team-detail__img').find('img').attr('src'); // 團隊圖片
    teams.desc = $('.team-detail__desc').text().trim(); // 團隊介紹
    teams.cumulativeArticle = $(teamDashboardNum[0]).text(); //累計文章
    teams.bar = $('.progress-bar').attr('aria-valuenow'); // 團隊進度
    teams.numberTeams = $(teamDashboardNum[1]).text(); // 團隊人數
    teams.memberTeams = parseInt($(teamDashboardNum[1]).text(), 10);
    teams.teamStatus = $('.team-dashboard__text').text();
    teams.challengeProgress = $('.team-dashboard__day').text().trim(); // 挑戰進度
    const numberChallengeProgress = /\d/g.exec($('.team-dashboard__day').text().trim());
    teams.numberChallengeProgress = numberChallengeProgress[0]; // 挑戰進度
  }
}

module.exports = {
  ithome2020api
};

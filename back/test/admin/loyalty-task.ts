// import request from 'supertest';
// import { dbConnection } from '../testDb';
// import { admin } from '../../src/admin/app';
// import { loyaltyProjectModel } from '../../src/db/models';

// const loginCredentials = {
//   login: process.env.ADMIN_LOGIN,
//   password: process.env.ADMIN_PASSWORD,
// };

// describe('/admin/partner-project/ Endpoint Tests', () => {
//   let bearerToken;
//   beforeAll(async () => {
//     await dbConnection();

//     const loginResponse = await request(admin).post('/login').send(loginCredentials).set('Accept', 'application/json');

//     bearerToken = loginResponse['_body'].token;
//     console.log('bearerToken', bearerToken);
//   });

//   it('POST Create | Firstcomer', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Firstcomer',
//         points: 2,
//         startAt: null,
//         endAt: null,
//         type: 'visitLink',
//         link: 'https://forms.gle/jJx3HKPzX9kfcVXA7',
//         description: 'Fill out our whitelist form and get your first points!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Zoomer Ape', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Zoomer Ape',
//         points: 2,
//         startAt: null,
//         endAt: null,
//         type: 'visitLink',
//         link: 'https://www.youtube.com/watch?v=Gqwj_-3sPPs',
//         description: 'Just watch a suggested video to get your points!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Boomer Ape', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Boomer Ape',
//         points: 2,
//         startAt: null,
//         endAt: null,
//         type: 'visitLink',
//         link: 'https://www.youtube.com/watch?v=bIvqxusaN3s',
//         description: 'Just read a suggested article to get your points!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Token Holder', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Token Task',
//         points: 22222,
//         //"startAt": "2023-02-05T15:44:21.693Z",
//         //"endAt": "2023-07-05T15:44:21.693Z",
//         type: 'token',
//         chainId: '0x1',
//         address: '0x6b175474e89094c44da98b954eedeac495271d0f',
//         description: 'blah blah blah',
//         minTokenAmount: '0.1',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | NFT Holder', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'NFT Task 0.1',
//         points: 22222,
//         //"startAt": "2023-02-05T15:44:21.693Z",
//         //"endAt": "2023-07-05T15:44:21.693Z",
//         type: 'nft',
//         chainId: '0x1',
//         address: '0x6b175474e89094c44da98b954eedeac495271d0f',
//         description: 'blah blah blah',
//         standard: 'ERC721',
//         minTokenAmount: '0.1',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Value Holder', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Value Holder 10000',
//         points: 112,
//         startAt: null,
//         endAt: null,
//         type: 'valueHolder',
//         description: 'Tell your friends about BlockchainTask',
//         chainId: '0x1',
//         minUSDValue: 10000,
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Native Holder', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Native Holder 1000',
//         points: 10,
//         startAt: null,
//         endAt: null,
//         type: 'nativeHolder',
//         description: 'Tell your friends about MyNativeHolder',
//         chainId: '0x1',
//         minValue: 1000,
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Blockchain User', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Blockchain User 1000',
//         points: 333,
//         startAt: null,
//         endAt: null,
//         type: 'blockchainUser',
//         description: 'Tell your friends about BlockchainTask',
//         chainId: '0x1',
//         minTransactions: 1000,
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Daily Tasks', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'NFT Task',
//         points: 22222,
//         //"startAt": "2023-02-05T15:44:21.693Z",
//         //"endAt": "2023-07-05T15:44:21.693Z",
//         type: 'nft',
//         chainId: '0x1',
//         address: '0x6b175474e89094c44da98b954eedeac495271d0f',
//         description: 'blah blah blah',
//         standard: 'ERC721',
//         minTokenAmount: '1',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Follow Twitter', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Follower',
//         points: 4,
//         startAt: null,
//         endAt: null,
//         type: 'followTwitter',
//         userId: '1628470958842314753',
//         username: 'chtvshow',
//         description: 'Follow our project on Twitter to get more points :)',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Join Discord', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Discord landed!',
//         points: 3,
//         startAt: null,
//         endAt: null,
//         type: 'joinDiscord',
//         serverId: '1083428045425221692',
//         inviteLink: 'https://discord.gg/CyP5vhcbeZ',
//         description: 'Join our project on Discord!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Unlim. Twitter Mention', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'First Gossip',
//         points: 5,
//         startAt: null,
//         endAt: null,
//         type: 'mentionTwitter',
//         description:
//           ':text[{"tag":"p","classname":"","text":" Tell your friends about our project on Twitter with @ MENTION and get the first & points. "}] :text[{"tag":"p","classname":"","text":" Then try to gain likes and retweets of your post. More retweets&likes of this mention you get, the more points you receive! "}] :text[{"tag":"p","classname":"","text":"max 3 pnt – each like"}]   :text[{"tag":"p","classname":"","text":"max 5 pnt – each retweet"}]',
//         mentionUserId: '1555523463808442371',
//         mentionUserName: 'DinoWars_Game',
//         additionalProgram: {
//           pointsPerLike: 3,
//           pointsPerReTweet: 5,
//         },
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Unlim. Twitter Quote Retweet', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Famed Ape',
//         points: 5,
//         startAt: null,
//         endAt: null,
//         type: 'reTweetQuoteTwitter',
//         tweetId: '1655912446710652936',
//         description:
//           ':text[{"tag":"p","classname":"","text":"Quote Retweet the post on Twitter with and get your points! The more likes & retweets you get of this quote, the more points you get! "}]   :text[{"tag":"p","classname":"","text":"up to 3 pnt – each like"}]   :text[{"tag":"p","classname":"","text":"up to 5 pnt – each retweet"}]',
//         additionalProgram: {
//           pointsPerLike: 3,
//           pointsPerReTweet: 5,
//         },
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Redirect / Referral', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Refer a friend',
//         points: 2,
//         startAt: null,
//         endAt: null,
//         type: 'referralLink',
//         description: 'Are you friendly enough to bring more little Alphas on board? Dare to try!',
//         redirectLink: 'https://dino-wars.com/',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Text Suggestion', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Sui Ape',
//         points: 2,
//         startAt: null,
//         endAt: null,
//         type: 'suggestion',
//         description: 'Leave your SUI wallet address here, and get your points!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | E-Mail Suggestion', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Contact',
//         points: 3,
//         startAt: null,
//         endAt: null,
//         type: 'email',
//         description:
//           'Leave us your email to check your registration and deposit status. If you haven\'t passed registration and deposit but marked these tasks as "Completed", we\'ll disqualify you from the Quest.',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Twitter Follow AG', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'AG Follower',
//         points: 4,
//         startAt: null,
//         endAt: null,
//         type: 'followTwitter',
//         userId: '1503761213309792266',
//         username: 'AGuiltyOfficial',
//         description: 'Follow AlphaGuilty on Twitter to get more points :)',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Discord Join AG', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'AG Discord landed!',
//         points: 4,
//         startAt: null,
//         endAt: null,
//         type: 'joinDiscord',
//         serverId: '950689670390505504',
//         inviteLink: 'https://discord.com/invite/S6YgxUfH5S',
//         description: 'Join AlphaGuilty on Discord!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Partner Quest', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Nextdoor visit',
//         points: 1,
//         startAt: null,
//         endAt: null,
//         type: 'partner',
//         description:
//           ':text[{"tag":"p","classname":"","text":"Fancy a visit to our beloved partner AlphaGuilty, perform at least 1 task, and receive extra points!"}]',
//         partnerTask: {
//           projectId: 1,
//           tasksCount: 1,
//           projectLink: 'alphaguilty-campaign',
//         },
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Join Telegram', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Telegram community',
//         points: 2,
//         startAt: null,
//         endAt: null,
//         type: 'joinTelegram',
//         chatId: '-1001977438524',
//         inviteLink: 'https://t.me/+H22fi383b41lZDU0',
//         description: 'Become a part of our Telegram community!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create | Answer the question', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'QUIZ Test String 2',
//         points: 55,
//         type: 'quiz',
//         description: 'QUIZ DESC',
//         answers: ['222'],
//         maxAnswers: 3,
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - Visit Medium', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Follower',
//         points: 2,
//         startAt: null,
//         endAt: null,
//         type: 'medium',
//         link: 'https://medium.com/@amlsafe',
//         description: 'Join us on medium blog!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - Visit Twitter Space', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Twitter Space Debate',
//         points: 25,
//         startAt: null,
//         endAt: null,
//         type: 'checkSpaceTwitter',
//         description: 'Join our Live on Twitter Space on January 6th!',
//         redirectLink: 'https://twitter.com/i/spaces/1YpKkgpkDByKj',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - Discord Roles', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Discord Ape',
//         points: 3,
//         startAt: null,
//         endAt: null,
//         type: 'roleDiscord',
//         roleId: '1056614595005009970',
//         roleName: 'Verified',
//         serverId: '1047910108887273522',
//         description:
//           'Show how Apey you are on our Discord! Engage in conversations, level up to the Verified, and get your points!',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - Twitter REtweet ONLY', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Share us',
//         points: 5,
//         startAt: null,
//         endAt: null,
//         type: 'reTweetTwitter',
//         tweetId: '1627740361496924179',
//         description: 'Retweet a post on Twitter with a quote.',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - Twitter Mention', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Tell your friends',
//         points: 5,
//         startAt: null,
//         endAt: null,
//         type: 'mentionTwitter',
//         description: 'Tell your friends about UniCrypt on Twitter with @ mention.',
//         mentionUserId: '1275709288787345408',
//         mentionUserName: 'UNCX_token',
//         additionalProgram: null,
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - Video', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Watch AlphaQuest Training Video',
//         description: 'Watch our video about AlphaGuest and get reward',
//         points: 30,
//         type: 'watchVideo',
//         videoId: '4zF3BzDEmpA',
//         isOnboardingTask: true,
//         onboardingTitle: 'Watch the video and learn about our AlphaQuests. This will get you 30 extra points!',
//         onboardingDescription: '',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - SignUp Onboarding', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Register or Login to get started',
//         description: '',
//         points: 20,
//         type: 'signUp',
//         isOnboardingTask: true,
//         onboardingTitle: 'To get rewards',
//         onboardingDescription:
//           'Climb the quest scoreboard by earning points, complete tasks to get points, the higher place - the bigger reward. Create account to get your first points.',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('POST Create Task - Complete Onboarding', async () => {
//     const loyaltyProjects = await loyaltyProjectModel.getAll();

//     const response = await request(admin)
//       .post(`/admin/loyalty-project/${loyaltyProjects[0].id}/loyalty-task`)
//       .send({
//         title: 'Awesome job, young Alpha!',
//         description:
//           "You've earned 50 points already! Go to the AlphaGuilty quest and finish more tasks to get bigger reward.",
//         points: 0,
//         type: 'completedOnboarding',
//         buttonText: 'Go to AlphaGuilty Quest',
//         linkTitle: 'alphaguilty-campaign-3',
//       })
//       .set('Authorization', `Bearer ${bearerToken}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//   });
// });

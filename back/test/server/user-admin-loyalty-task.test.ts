import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser, LoyaltyProject } from '../../src/db/entity';

describe('/api/admin/project Endpoint Tests', () => {
  let bearerToken;
  let quest;
  beforeAll(async () => {
    await dbConnection();

    const loyaltyProjectRepository = getRepository(LoyaltyProject);
    quest = await loyaltyProjectRepository.findOne({ projectName: 'test-integration Quest' });

    const emailUserRepository = getRepository(EmailUser);
    const emailUser = await emailUserRepository.findOne({});

    const loginResponse = await request(server)
      .post('/api/auth/login/email')
      .send({
        email: emailUser?.email,
        password: 'securepassword1',
      })
      .set('Accept', 'application/json');

    bearerToken = loginResponse['_body'].accessToken;
  });

  /* ========== TWITTER TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'followTwitter',
        typeItem: 'followTwitter',
        startAt: null,
        endAt: null,
        title: 'Follow on Twitter',
        description: '<p>Follow our project on Twitter and get your points!</p>',
        username: 'kairatbeast',
        points: 3,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'mentionTwitter',
        typeItem: 'mentionTwitter',
        startAt: null,
        endAt: null,
        title: 'Mention on Twitter',
        description: '<p>Tell your friends about our project on Twitter get your points!</p>',
        mentionUserName: 'kairatbeast',
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'tweetTwitter',
        typeItem: 'tweetTwitter',
        startAt: null,
        endAt: null,
        title: 'Tweet on Twitter',
        description: '<p>Make a tweet on Twitter and get your points!</p>',
        tweetText: 'kairatbeast',
        points: 3,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'reTweetTwitter',
        typeItem: 'reTweetTwitter',
        startAt: null,
        endAt: null,
        title: 'Retweet a Tweet',
        description: '<p>Retweet our tweet on Twitter and get your points!</p>',
        tweetLink: 'https://twitter.com/VirtualBacon0x/status/1728806349004214681',
        points: 10,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'reTweetQuoteTwitter',
        typeItem: 'reTweetQuoteTwitter',
        startAt: null,
        endAt: null,
        title: 'Quote Retweet on Twitter',
        description: '<p>Quote Retweet the tweet on Twitter and get your points!</p>',
        tweetLink: 'https://twitter.com/VirtualBacon0x/status/1728806349004214681',
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'likeTweetTwitter',
        typeItem: 'likeTweetTwitter',
        startAt: null,
        endAt: null,
        title: 'Like Tweet on Twitter',
        description: '<p>Like the tweet on Twitter and get your points!</p>',
        tweetLink: 'https://twitter.com/AGuiltyOfficial/status/1687248252091949056',
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'commentTweetTwitter',
        typeItem: 'commentTweetTwitter',
        startAt: null,
        endAt: null,
        title: 'Comment a tweet',
        description: '<p>Comment the tweet on Twitter and get your points!</p>',
        tweetLink: 'https://twitter.com/AGuiltyOfficial/status/1687248252091949056',
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== DISCORD TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'joinDiscord',
        typeItem: 'joinDiscord',
        startAt: null,
        endAt: null,
        title: 'Join a Discord server',
        description: '<p>Join our project on Discord and get your points!</p>',
        inviteLink: 'https://discord.gg/KvNVM8jVJr',
        points: 3,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'roleDiscord',
        typeItem: 'roleDiscord',
        startAt: null,
        endAt: null,
        title: 'Verify role in Discord server',
        description:
          '<p>Show how Apey you are on our Discord! Engage in conversations, level up to the TestRole and get your points!</p>',
        inviteLink: 'https://discord.gg/KvNVM8jVJr',
        roleId: '1143184858894585877',
        roleName: 'TestRole',
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== YOUTUBE TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'roleDiscord',
        typeItem: 'roleDiscord',
        startAt: null,
        endAt: null,
        title: 'Verify role in Discord server',
        description:
          '<p>Show how Apey you are on our Discord! Engage in conversations, level up to the TestRole and get your points!</p>',
        inviteLink: 'https://www.youtube.com/watch?v=b9_i2GnwWPU',
        roleId: '1143184858894585877',
        roleName: 'TestRole',
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== TELEGRAM TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'joinTelegram',
        typeItem: 'joinTelegram',
        startAt: null,
        endAt: null,
        title: 'Join the Telegram group',
        description: '<p>Become a part of our Telegram community and get your points!</p>',
        chatId: '-1001936460012',
        inviteLink: 'https://t.me/testalphakairat',
        points: 3,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== VISITPAGE TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'visitLink',
        typeItem: 'visitLink',
        startAt: null,
        endAt: null,
        title: 'Visit the website',
        description: '<p>Visit the website and get your points!</p>',
        link: 'https://alphaguilty.io/',
        points: 2,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== SUGGEST TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'suggestion',
        typeItem: 'suggestion',
        startAt: null,
        endAt: null,
        regex: '',
        title: 'Take a Survey',
        description: '<p>test survey</p>',
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'email',
        typeItem: 'email',
        startAt: null,
        endAt: null,
        title: 'Leave your e-mail',
        description: '<p>Leave your e-mail in this form and get your points!</p>',
        regex: '',
        points: 3,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== QUIZ TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'quiz',
        typeItem: 'quiz',
        startAt: null,
        endAt: null,
        title: 'Pick the correct answer',
        description: ' ',
        answers: 'test',
        maxAnswers: 10,
        points: 5,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== MEDIUM TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'medium',
        typeItem: 'medium',
        startAt: null,
        endAt: null,
        title: 'Read a Medium article',
        description: '<p>Read our Medium article and get your points!</p>',
        link: 'https://alphaguilty.io/',
        points: 2,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  /* ========== REFFERAL TASK ==========*/

  it('Create task with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest/${quest.id}/task`)
      .send({
        type: 'invite',
        typeItem: 'invite',
        startAt: null,
        endAt: null,
        title: 'Refer a friend',
        description: '<p>Invite a friend and get your points!</p>',
        scorePercentage: 10,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });
});

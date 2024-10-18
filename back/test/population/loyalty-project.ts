import { getRepository } from 'typeorm';
import { LoyaltyProject } from '../../src/db/entity';
import { QuestStatus, QuestType } from '../../src/db/types/interfaces/loyalty';

export const populateLoyaltyProject = async () => {
  const loyaltyProjectRepository = getRepository(LoyaltyProject);
  const currentDate = new Date();
  const nextYearDate = new Date(currentDate);
  nextYearDate.setFullYear(currentDate.getFullYear() + 1);

  const projects = [
    // Project 1: All properties provided
    {
      linkTitle: 'link-title-1',
      title: 'Test Title 1',
      projectName: 'Test Project Name 1',
      backgroundImage: 'test-bg-image1.jpg',
      previewImage: 'test-preview-image1.jpg',
      description: 'Test Description 1',
      socialDescription: 'Test Social Description 1',
      sortOrder: 1,
      startAt: new Date(),
      endAt: nextYearDate,
      claimingStartAt: new Date(),
      claimingEndAt: new Date(),
      questStatus: QuestStatus.Active,
      featured: true,
      preview_img: 'test-preview-img1.jpg',
      visible: true,
      threshold: 100,
      eligibleUsersCount: 50,
      projectType: QuestType.Scoreboard,
    },
    // Project 2: Without backgroundImage and previewImage
    {
      linkTitle: 'link-title-2',
      title: 'Test Title 2',
      projectName: 'Test Project Name 2',
      backgroundImage: null,
      previewImage: null,
      description: 'Test Description 2',
      socialDescription: 'Test Social Description 2',
      sortOrder: 2,
      startAt: new Date(),
      endAt: nextYearDate,
      claimingStartAt: new Date(),
      claimingEndAt: new Date(),
      questStatus: QuestStatus.Active,
      featured: false,
      preview_img: 'test-preview-img2.jpg',
      visible: false,
      threshold: 150,
      eligibleUsersCount: 30,
      projectType: QuestType.Scoreboard,
    },
    // Project 3: Different QuestType
    {
      linkTitle: 'alphaguilty-onboarding',
      title: 'Test Title 3',
      projectName: 'Test Project Name 3',
      backgroundImage: 'test-bg-image3.jpg',
      previewImage: 'test-preview-image3.jpg',
      description: 'Test Description 3',
      socialDescription: 'Test Social Description 3',
      sortOrder: 3,
      startAt: new Date(),
      endAt: nextYearDate,
      claimingStartAt: new Date(),
      claimingEndAt: new Date(),
      questStatus: QuestStatus.Completed,
      featured: true,
      preview_img: 'test-preview-img3.jpg',
      visible: true,
      threshold: 200,
      eligibleUsersCount: 75,
      projectType: QuestType.Guaranteed, // Assuming QuestType has 'AnotherType', update accordingly.
    },
  ];

  for (const project of projects) {
    const loyaltyProject = await loyaltyProjectRepository.create(project as LoyaltyProject);
    await loyaltyProjectRepository.save(loyaltyProject);
  }
};

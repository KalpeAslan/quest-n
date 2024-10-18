import styled from "@emotion/styled";
import questCardBg from "@assets/images/quest/quest-card-bg.webp";

export const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: initial;
  background: url(${questCardBg.src}) no-repeat center;
  background-size: cover;
  border-radius: 16px;
  text-decoration: none;
  overflow: hidden;
  filter: grayscale(1);

  .content {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  .head {
    display: flex;
    justify-content: space-between;
  }

  .profile {
    display: flex;
    gap: 12px;
  }

  .profile-texts {
    flex: 1;
  }

  .items {
    display: flex;
    gap: 8px;
  }

  @media (min-width: 768px) {
    width: calc(50% - 6px);
  }

  @media (min-width: 1024px) {
    width: calc(33.33% - 8px);
  }
`;

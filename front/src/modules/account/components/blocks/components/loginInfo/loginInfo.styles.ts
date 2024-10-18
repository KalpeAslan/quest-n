import styled from "@emotion/styled";
import { inviteFriends, inviteFriends2x } from "@modules/account/assets";

export const LoginInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;
  text-align: center;
  order: 1;

  .image {
    flex: 1;
    min-height: 125px;
    padding: 16px 16px 0;
  }

  .decor {
    width: 100%;
    height: 100%;
    background-image: url(${inviteFriends.src});
    background-image: -webkit-image-set(
      url(${inviteFriends.src}) 1x,
      url(${inviteFriends2x.src}) 2x
    );
    background-image: image-set(
      url(${inviteFriends.src}) 1x,
      url(${inviteFriends2x.src}) 2x
    );
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .content {
    padding: 0 16px 16px;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .button {
    width: 100%;
  }

  .max {
    max-width: 185px;
  }

  @media (min-width: 768px) {
    width: 66.6%;
    order: 0;

    .decor {
      background-image: url(${inviteFriends2x.src});
    }
  }
`;

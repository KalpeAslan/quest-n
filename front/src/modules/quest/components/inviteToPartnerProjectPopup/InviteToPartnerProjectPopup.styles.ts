import styled from "@emotion/styled";

export const InviteToPartnerProjectPopupStyles = {
  AddUser: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background-color: #1e442c;
    background-image: url("/images/project/addUserIcon.svg");
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
  `,
  RemoveUser: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background-color: rgba(252, 91, 63, 0.1);
    background-image: url("/images/project/removeUserIcon.svg");
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
  `,
};

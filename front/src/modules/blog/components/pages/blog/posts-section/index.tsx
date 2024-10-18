import { Box } from "@mui/material";

import { IPostItem } from "@models";

import { Item } from "./item";

import { PostsSectionStylesList } from "./postsSection.styles";

type Props = {
  data: IPostItem[];
};

export const PostsSection = ({ data }: Props) => {
  return (
    <Box component="section" mx={{ xs: 0, sm: 0 }}>
      {data.length > 0 && (
        <PostsSectionStylesList>
          {data.map((item: IPostItem) => (
            <li key={item.postId}>
              <Item data={item} />
            </li>
          ))}
        </PostsSectionStylesList>
      )}
    </Box>
  );
};

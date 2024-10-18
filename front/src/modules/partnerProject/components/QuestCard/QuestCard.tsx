import { IQuestShort } from "@/modules/quest/models";
import { FC, Dispatch, SetStateAction, useCallback } from "react";
import { useRouter } from "next/router";
import { FeaturedItem } from "@/modules/quest/components/featuredItems/featuredItem";

interface Props {
  project: IQuestShort;
  partnerProjectLinkTitle: string;
  setDeleteLinkTitle: Dispatch<SetStateAction<string | null>>;
}

const QuestCard: FC<Props> = ({
  project,
  setDeleteLinkTitle,
  partnerProjectLinkTitle,
}) => {
  const { push } = useRouter();

  const handlePreview = useCallback(
    () =>
      push(
        `/admin/project/${partnerProjectLinkTitle}/quest/${project.linkTitle}/preview`,
      ),
    [project.linkTitle, push],
  );

  const handleEdit = useCallback(
    () =>
      push(
        `/admin/project/${partnerProjectLinkTitle}/quest/${project.linkTitle}/edit/setup`,
      ),
    [project.linkTitle, push],
  );

  const handleDelete = useCallback(
    () => setDeleteLinkTitle(project.linkTitle),
    [project.linkTitle, setDeleteLinkTitle],
  );

  const handleAnalytics = useCallback(() => {
    push(
      `/admin/project/${partnerProjectLinkTitle}/quest/${project.linkTitle}/analytics`,
    );
  }, [project.linkTitle, push]);
  return (
    <FeaturedItem
      className="item"
      project={project}
      onClick={() => {}}
      admin
      handlePreview={handlePreview}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleAnalytics={handleAnalytics}
    />
  );
};

export default QuestCard;

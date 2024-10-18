import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import {
  getAccountState,
  getCurrentPartnerProject,
} from "@/modules/account/store/account.selector";
import {
  setIsAdminPanelOpened,
  setPartnerProjectSettingsLinkTitle,
  setPreviewPanel,
} from "@/store/slices/system/system.slice";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { QuestComponent } from "../../components/questComponent";

const QuestPreviewPage = () => {
  const { query, push } = useRouter();

  const [projectName, setProjectName] = useState<string | null>(null);

  const { quest, linkTitle } = query as {
    id: string;
    quest?: string;
    linkTitle: string;
  };

  const dispatch = useAppDispatch();

  const { accountInfo, isPartnerProjectsLoaded } =
    useTypedSelector(getAccountState);
  const project = useTypedSelector(getCurrentPartnerProject);

  const partnerId = useMemo(() => project?.linkTitle, [project?.linkTitle]);

  useEffect(() => {
    dispatch(setPartnerProjectSettingsLinkTitle(partnerId));

    return () => {
      dispatch(setPartnerProjectSettingsLinkTitle(null));
    };
  }, [partnerId, dispatch]);

  useEffect(() => {
    if (
      accountInfo?.connected === null ||
      !isPartnerProjectsLoaded ||
      !partnerId
    )
      return;

    if (!accountInfo?.connected || !project) {
      push("/");
    }

    return () => {
      if (!accountInfo?.connected || !project) {
        push("/");
      }
    };
  }, [accountInfo?.connected, push, isPartnerProjectsLoaded, partnerId]);

  useEffect(() => {
    dispatch(setIsAdminPanelOpened(true));

    return () => {
      dispatch(setIsAdminPanelOpened(false));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      setPreviewPanel({
        open: true,
        onClick: "redirect",
        redirectPath: `/admin/project/${linkTitle}/quests`,
      }),
    );

    return () => {
      dispatch(setPreviewPanel({ open: false, onClick: "close" }));
    };
  }, [dispatch, partnerId]);

  return (
    <div className="background-other">
      <Head>
        <title>Quest Preview ${projectName}</title>
        <link
          rel="canonical"
          href={`partners/${partnerId}/quests/${quest}/preview`}
        />
      </Head>

      <QuestComponent
        preview
        projectLinkTitle={quest}
        setProjectName={setProjectName}
        fullPreview
      />
    </div>
  );
};

export default QuestPreviewPage;
